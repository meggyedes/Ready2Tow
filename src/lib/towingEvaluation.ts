export type TransportType = 'private' | 'commercial'
export type LicenceCategory = 'B' | 'B96' | 'BE' | 'OTHER'
export type EvaluationStatus = 'ok' | 'warning' | 'error'
export type TachographStatus = 'not-required' | 'check-required' | 'required'

export interface TowingInput {
  carGrossWeight: number
  carCurbWeight: number
  trailerGrossWeight: number
  trailerActualWeight: number
  carBrakedTowCapacity: number
  carUnbrakedTowCapacity: number
  isBraked: boolean
  isBeginnerDriver: boolean
  transportType: TransportType
  isInternational: boolean
}

export interface TowingEvaluationResult {
  combinedGrossWeight: number
  licence: {
    category: LicenceCategory
    label: string
    status: EvaluationStatus
    messages: string[]
  }
  technical: {
    status: EvaluationStatus
    label: string
    towCapacity: number
    messages: string[]
  }
  tachograph: {
    status: TachographStatus
    label: string
    messages: string[]
  }
}

const isPositive = (value: number) => Number.isFinite(value) && value > 0

export function evaluateTowing(input: TowingInput): TowingEvaluationResult {
  const combinedGrossWeight = input.carGrossWeight + input.trailerGrossWeight
  const licenceMessages: string[] = []
  let category: LicenceCategory = 'OTHER'
  let licenceLabel = 'További kategória szükséges'
  let licenceStatus: EvaluationStatus = 'ok'

  if (!isPositive(input.carGrossWeight) || !isPositive(input.trailerGrossWeight)) {
    licenceStatus = 'warning'
    licenceMessages.push('Add meg a vontató és a pótkocsi megengedett legnagyobb össztömegét.')
  } else if (input.carGrossWeight > 3500 || input.trailerGrossWeight > 3500 || combinedGrossWeight > 7000) {
    licenceStatus = 'warning'
    licenceMessages.push('B/BE kategórián kívüli kombináció – további jogosítvány-kategória ellenőrzése szükséges.')
  } else if (input.trailerGrossWeight <= 750) {
    category = 'B'
    licenceLabel = 'B'
    licenceMessages.push('Legfeljebb 750 kg-os könnyű pótkocsi B kategóriás, legfeljebb 3500 kg-os vontatóhoz kapcsolható.')
  } else if (combinedGrossWeight <= 3500 && (!isPositive(input.carCurbWeight) || input.trailerGrossWeight <= input.carCurbWeight)) {
    category = 'B'
    licenceLabel = 'B'
    licenceMessages.push('A 750 kg feletti pótkocsival számított együttes megengedett össztömeg legfeljebb 3500 kg.')
    if (!isPositive(input.carCurbWeight)) {
      licenceStatus = 'warning'
      licenceMessages.push('A vontató saját tömegét (G) is ellenőrizd: a pótkocsi megengedett össztömege nem haladhatja meg.')
    }
  } else if (input.trailerGrossWeight > 750 && combinedGrossWeight > 3500 && combinedGrossWeight <= 4250) {
    category = 'B96'
    licenceLabel = 'B96'
    licenceMessages.push('A szerelvény 3500 kg feletti, de legfeljebb 4250 kg megengedett együttes össztömegű.')
  } else {
    category = 'BE'
    licenceLabel = 'BE'
    licenceMessages.push('A vontató és a pótkocsi is legfeljebb 3500 kg megengedett legnagyobb össztömegű.')
  }

  if (input.isBeginnerDriver) {
    licenceStatus = 'error'
    licenceMessages.unshift('Kezdő vezetői engedéllyel B kategóriás jogosultság alapján pótkocsi nem vontatható.')
  }

  const towCapacity = input.isBraked ? input.carBrakedTowCapacity : input.carUnbrakedTowCapacity
  const technicalMessages: string[] = []
  let technicalStatus: EvaluationStatus = 'ok'
  let technicalLabel = 'Megfelelő'

  if (!isPositive(towCapacity) || !isPositive(input.trailerActualWeight)) {
    technicalStatus = 'warning'
    technicalLabel = 'Ellenőrzés szükséges'
    technicalMessages.push('Add meg a pótkocsi tényleges tömegét és a forgalmiban szereplő megfelelő vontatható tömeget.')
  } else if (input.trailerActualWeight > towCapacity) {
    technicalStatus = 'error'
    technicalLabel = 'Nem megfelelő'
    technicalMessages.push('A pótkocsi tényleges tömege meghaladja a vontató jármű megengedett vontatható tömegét.')
  } else {
    technicalMessages.push(`A pótkocsi tényleges tömege a ${input.isBraked ? 'fékezett (O.1)' : 'fékezetlen (O.2)'} vontatási határon belül van.`)
  }

  let tachographStatus: TachographStatus = 'check-required'
  let tachographLabel = 'Kötelezettség / mentesség ellenőrzése szükséges'
  const tachographMessages: string[] = []

  if (!isPositive(combinedGrossWeight)) {
    tachographMessages.push('A megengedett együttes össztömeg nélkül a státusz nem állapítható meg.')
  } else if (input.transportType === 'private' && combinedGrossWeight <= 7500) {
    tachographStatus = 'not-required'
    tachographLabel = 'Nem szükséges'
    tachographMessages.push('Valóban nem kereskedelmi áruszállításnál 7,5 tonnáig alkalmazható a magáncélú mentesség.')
  } else if (input.transportType === 'private') {
    tachographMessages.push('A szerelvény meghaladja a 7,5 tonnás magáncélú mentességi határt. További ellenőrzés szükséges.')
  } else if (input.isInternational && combinedGrossWeight > 2500) {
    tachographMessages.push('Nemzetközi áruszállításnál vagy kabotázsnál 2026. július 1-jétől 2500 kg felett ellenőrizni kell az 561/2006/EK rendelet alkalmazhatóságát és a tachográf-kötelezettséget.')
  } else if (!input.isInternational && combinedGrossWeight > 3500) {
    tachographMessages.push('Belföldi kereskedelmi áruszállításnál 3500 kg felett alkalmazandók lehetnek az 561/2006/EK vezetési, pihenőidő- és menetíró szabályai.')
  } else {
    tachographMessages.push('A megadott adatokból a kötelezettség vagy valamely mentesség nem dönthető el biztosan. További ellenőrzés szükséges.')
  }

  return {
    combinedGrossWeight,
    licence: { category, label: licenceLabel, status: licenceStatus, messages: licenceMessages },
    technical: { status: technicalStatus, label: technicalLabel, towCapacity, messages: technicalMessages },
    tachograph: { status: tachographStatus, label: tachographLabel, messages: tachographMessages },
  }
}
