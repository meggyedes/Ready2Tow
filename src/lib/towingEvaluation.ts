export type TransportType = 'private' | 'commercial'
export type LicenceCategory = 'B' | 'B96' | 'BE' | 'OTHER'
export type EvaluationStatus = 'ok' | 'warning' | 'error'
export type TachographStatus = 'not-required' | 'check-required' | 'required'
export type TrailerBrakeType = 'unbraked' | 'overrun' | 'other-braked'
export type TollCategory = 'D1' | 'D2' | 'UNKNOWN'

export interface TowingInput {
  carGrossWeight: number
  carCurbWeight: number
  trailerGrossWeight: number
  trailerActualWeight: number
  carBrakedTowCapacity: number
  carUnbrakedTowCapacity: number
  isBraked: boolean
  brakeType?: TrailerBrakeType
  hasEuropeanTypeApproval?: boolean | null
  isBeginnerDriver: boolean
  transportType: TransportType
  isInternational: boolean
  towbarMaxVerticalLoad?: number
  trailerMaxNoseWeight?: number
  actualNoseWeight?: number
  hungarianTollCategory: TollCategory
}

export interface CalculationStep {
  title: string
  values: string[]
  conclusion: string
  status: EvaluationStatus
}

interface ComplianceResult {
  status: EvaluationStatus
  label: string
  messages: string[]
}

export interface TowingEvaluationResult {
  combinedGrossWeight: number
  licence: ComplianceResult & { category: LicenceCategory }
  technical: ComplianceResult & { towCapacity: number }
  kohemCompliance: ComplianceResult & { applicableLimit?: number }
  noseWeightCompliance: ComplianceResult & { maxAllowed?: number; actual?: number }
  tachograph: { status: TachographStatus; label: string; messages: string[] }
  toll: ComplianceResult & { category: TollCategory }
  calculationSteps: CalculationStep[]
}

const isPositive = (value: number | undefined) => Number.isFinite(value) && Number(value) > 0
const kg = (value: number) => `${value.toLocaleString('hu-HU')} kg`

export function evaluateTowing(input: TowingInput): TowingEvaluationResult {
  const combinedGrossWeight = input.carGrossWeight + input.trailerGrossWeight
  const calculationSteps: CalculationStep[] = []
  const licenceMessages: string[] = []
  let category: LicenceCategory = 'OTHER'
  let licenceLabel = 'További kategória ellenőrzése szükséges'
  let licenceStatus: EvaluationStatus = 'ok'

  if (!isPositive(input.carGrossWeight) || !isPositive(input.trailerGrossWeight)) {
    licenceStatus = 'warning'
    licenceLabel = 'Adatok megadása szükséges'
    licenceMessages.push('Add meg a vontató és a pótkocsi megengedett legnagyobb össztömegét.')
  } else if (input.carGrossWeight > 3500 || input.trailerGrossWeight > 3500 || combinedGrossWeight > 7000) {
    licenceStatus = 'warning'
    licenceMessages.push('B/BE kategórián kívüli kombináció – további jogosítvány-kategória ellenőrzése szükséges.')
  } else if (input.trailerGrossWeight <= 750) {
    category = 'B'; licenceLabel = 'B'
    licenceMessages.push('Legfeljebb 750 kg-os könnyű pótkocsi B kategóriás, legfeljebb 3500 kg-os vontatóhoz kapcsolható.')
  } else if (combinedGrossWeight <= 3500 && (!isPositive(input.carCurbWeight) || input.trailerGrossWeight <= input.carCurbWeight)) {
    category = 'B'; licenceLabel = 'B'
    licenceMessages.push('A 750 kg feletti pótkocsival számított együttes megengedett össztömeg legfeljebb 3500 kg.')
    if (!isPositive(input.carCurbWeight)) {
      licenceStatus = 'warning'
      licenceMessages.push('A vontató saját tömegét (G) is ellenőrizd.')
    }
  } else if (combinedGrossWeight > 3500 && combinedGrossWeight <= 4250) {
    category = 'B96'; licenceLabel = 'B96'
    licenceMessages.push('A szerelvény 3500 kg feletti, de legfeljebb 4250 kg megengedett együttes össztömegű.')
  } else {
    category = 'BE'; licenceLabel = 'BE'
    licenceMessages.push('A szerelvény meghaladja a B96 4250 kg-os felső határát, a vontató és a pótkocsi egyenként legfeljebb 3500 kg.')
  }

  if (input.isBeginnerDriver) {
    licenceStatus = 'error'
    licenceMessages.unshift('Kezdő vezetői engedéllyel B kategóriás jogosultság alapján pótkocsi nem vontatható.')
  }

  if (isPositive(input.carGrossWeight) && isPositive(input.trailerGrossWeight)) {
    calculationSteps.push({
      title: `Miért ${licenceLabel}?`,
      values: [`Autó F.1/F.2: ${kg(input.carGrossWeight)}`, `Trailer F.1/F.2: +${kg(input.trailerGrossWeight)}`, `Szerelvény: ${kg(combinedGrossWeight)}`],
      conclusion: input.isBeginnerDriver ? 'A kezdő vezetői korlátozás miatt a vontatás blokkolt.' : `→ ${licenceLabel} kategória szükséges`,
      status: licenceStatus,
    })
  }

  const isBraked = input.brakeType ? input.brakeType !== 'unbraked' : input.isBraked
  const towCapacity = isBraked ? input.carBrakedTowCapacity : input.carUnbrakedTowCapacity
  const technicalMessages: string[] = []
  let technicalStatus: EvaluationStatus = 'ok'
  let technicalLabel = 'Megfelelő'

  if (!isPositive(towCapacity) || !isPositive(input.trailerActualWeight)) {
    technicalStatus = 'warning'; technicalLabel = 'Ellenőrzés szükséges'
    technicalMessages.push('Add meg a pótkocsi tényleges tömegét és a megfelelő O.1/O.2 értéket.')
  } else if (input.trailerActualWeight > towCapacity) {
    technicalStatus = 'error'; technicalLabel = 'Nem megfelelő'
    technicalMessages.push('A pótkocsi tényleges tömege meghaladja a vontató jármű megengedett vontatható tömegét.')
  } else {
    technicalMessages.push(`A tényleges tömeg a ${isBraked ? 'fékezett (O.1)' : 'fékezetlen (O.2)'} vontatási határon belül van.`)
  }

  if (isPositive(towCapacity) && isPositive(input.trailerActualWeight)) {
    const operator = input.trailerActualWeight <= towCapacity ? '≤' : '>'
    calculationSteps.push({
      title: 'Vontathatja az autó?',
      values: [`Trailer tényleges tömege: ${kg(input.trailerActualWeight)}`, `Autó ${isBraked ? 'O.1' : 'O.2'}: ${kg(towCapacity)}`, `${kg(input.trailerActualWeight)} ${operator} ${kg(towCapacity)}`],
      conclusion: `→ ${technicalLabel}`,
      status: technicalStatus,
    })
  }

  const brakeType = input.brakeType ?? (input.isBraked ? 'other-braked' : 'unbraked')
  let kohemStatus: EvaluationStatus = 'warning'
  let kohemLabel = 'Ellenőrzés szükséges'
  let applicableLimit: number | undefined
  const kohemMessages: string[] = []

  if (brakeType === 'unbraked') {
    if (isPositive(input.carCurbWeight) && isPositive(input.carUnbrakedTowCapacity) && isPositive(input.trailerGrossWeight)) {
      applicableLimit = Math.floor(Math.min((input.carCurbWeight + 68) / 2, input.carUnbrakedTowCapacity, 750))
      if (input.trailerGrossWeight > applicableLimit) {
        kohemStatus = 'error'; kohemLabel = 'Nem megfelelő'
        kohemMessages.push(`A fékezetlen pótkocsi megengedett össztömege meghaladja a legszigorúbb, ${kg(applicableLimit)}-os korlátot.`)
      } else {
        kohemStatus = 'ok'; kohemLabel = 'Megfelelő'
        kohemMessages.push(`A fékezetlen pótkocsi a legszigorúbb, ${kg(applicableLimit)}-os alkalmazandó korláton belül van.`)
      }
    } else {
      kohemMessages.push('További adat szükséges az ellenőrzéshez: G, O.2 és a trailer megengedett össztömege.')
    }
  } else if (brakeType === 'overrun') {
    if (input.hasEuropeanTypeApproval === null || input.hasEuropeanTypeApproval === undefined) {
      kohemMessages.push('További adat szükséges az ellenőrzéshez: az európai típusbizonyítvány státusza.')
    } else if (input.hasEuropeanTypeApproval) {
      kohemStatus = 'ok'; kohemLabel = 'Megfelelő'
      kohemMessages.push('Európai típusbizonyítványnál a hatóságilag meghatározott O.1 érték az irányadó; a 21. § (4) szerinti 75%-os korlátot nem kell külön alkalmazni.')
    } else if (isPositive(input.carGrossWeight) && isPositive(input.trailerGrossWeight)) {
      applicableLimit = Math.floor(input.carGrossWeight * 0.75)
      if (input.trailerGrossWeight > applicableLimit) {
        kohemStatus = 'error'; kohemLabel = 'Nem megfelelő'
        kohemMessages.push(`A ráfutófékes pótkocsi megengedett össztömege meghaladja a vontató össztömegének háromnegyedét (${kg(applicableLimit)}).`)
      } else {
        kohemStatus = 'ok'; kohemLabel = 'Megfelelő'
        kohemMessages.push(`A ráfutófékes pótkocsi nem haladja meg a vontató össztömegének háromnegyedét (${kg(applicableLimit)}).`)
      }
    } else {
      kohemMessages.push('További adat szükséges az ellenőrzéshez: a vontató és a trailer megengedett össztömege.')
    }
  } else {
    kohemMessages.push('Az O.1 értéken túli KöHÉM-feltételek teljes ellenőrzéséhez további járműadat szükséges.')
  }

  if (applicableLimit && isPositive(input.trailerGrossWeight)) {
    calculationSteps.push({ title: 'KöHÉM műszaki korlát', values: [`Alkalmazandó maximum: ${kg(applicableLimit)}`, `Trailer megengedett össztömege: ${kg(input.trailerGrossWeight)}`], conclusion: `→ ${kohemLabel}`, status: kohemStatus })
  }

  let noseStatus: EvaluationStatus = 'warning'
  let noseLabel = 'Nincs elég adat'
  let maxAllowedNoseWeight: number | undefined
  const noseMessages: string[] = []
  if (isPositive(input.towbarMaxVerticalLoad) && isPositive(input.trailerMaxNoseWeight) && isPositive(input.actualNoseWeight)) {
    maxAllowedNoseWeight = Math.min(Number(input.towbarMaxVerticalLoad), Number(input.trailerMaxNoseWeight))
    if (Number(input.actualNoseWeight) > maxAllowedNoseWeight) {
      noseStatus = 'error'; noseLabel = 'Túl magas'
      noseMessages.push('A tényleges támasztóterhelés meghaladja a megengedett értéket.')
    } else {
      noseStatus = 'ok'; noseLabel = 'Megfelelő'
      noseMessages.push('A tényleges támasztóterhelés a két alkatrész által megengedett alacsonyabb értéken belül van.')
    }
  } else {
    noseMessages.push('A támasztóterhelés teljes ellenőrzéséhez további adat szükséges.')
  }
  noseMessages.push('A támasztóterhelés a vontató terhelését és hátsó tengelyterhelését is befolyásolja.')

  let tachographStatus: TachographStatus = 'check-required'
  let tachographLabel = 'Ellenőrzés szükséges'
  const tachographMessages: string[] = []
  if (!isPositive(combinedGrossWeight)) tachographMessages.push('A megengedett együttes össztömeg nélkül a státusz nem állapítható meg.')
  else if (input.transportType === 'private' && combinedGrossWeight <= 7500) {
    tachographStatus = 'not-required'; tachographLabel = 'Nem szükséges'
    tachographMessages.push('Valóban nem kereskedelmi áruszállításnál 7,5 tonnáig alkalmazható a magáncélú mentesség.')
  } else if (input.transportType === 'private') tachographMessages.push('A szerelvény meghaladja a 7,5 tonnás magáncélú mentességi határt.')
  else if (input.isInternational && combinedGrossWeight > 2500) tachographMessages.push('Nemzetközi áruszállításnál vagy kabotázsnál 2026. július 1-jétől ellenőrizni kell az 561/2006/EK rendelet és a tachográf-kötelezettség alkalmazhatóságát.')
  else if (!input.isInternational && combinedGrossWeight > 3500) tachographMessages.push('Belföldi kereskedelmi áruszállításnál alkalmazandók lehetnek az 561/2006/EK vezetési, pihenőidő- és menetíró szabályai.')
  else tachographMessages.push('A megadott adatokból a kötelezettség vagy mentesség nem dönthető el biztosan.')

  let tollStatus: EvaluationStatus = 'warning'
  let tollLabel = 'Ellenőrzés szükséges'
  const tollMessages: string[] = []
  if (input.hungarianTollCategory === 'D1') {
    tollStatus = 'ok'; tollLabel = 'D1'
    tollMessages.push('D1 kategóriás vontató esetén a pótkocsira nem szükséges külön U e-matrica.')
  } else if (input.hungarianTollCategory === 'D2') {
    tollLabel = 'D2 + U'
    tollMessages.push('D2 kategóriás vontatóhoz kapcsolt pótkocsi esetén a pótkocsira U kategóriás e-matrica szükséges.')
  } else tollMessages.push('Ellenőrizd a vontató jármű e-matrica díjkategóriáját.')
  if (input.carGrossWeight > 3500) tollMessages.push('3,5 tonna feletti vontató jármű esetén külön útdíjszabályok alkalmazandók lehetnek. Ellenőrizd a HU-GO rendszer aktuális feltételeit.')

  return {
    combinedGrossWeight,
    licence: { category, label: licenceLabel, status: licenceStatus, messages: licenceMessages },
    technical: { status: technicalStatus, label: technicalLabel, towCapacity, messages: technicalMessages },
    kohemCompliance: { status: kohemStatus, label: kohemLabel, messages: kohemMessages, applicableLimit },
    noseWeightCompliance: { status: noseStatus, label: noseLabel, messages: noseMessages, maxAllowed: maxAllowedNoseWeight, actual: input.actualNoseWeight },
    tachograph: { status: tachographStatus, label: tachographLabel, messages: tachographMessages },
    toll: { status: tollStatus, label: tollLabel, messages: tollMessages, category: input.hungarianTollCategory },
    calculationSteps,
  }
}
