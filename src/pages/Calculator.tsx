import { useMemo, useState } from 'react'
import { AlertCircle, AlertTriangle, Check, ChevronDown, Info, Scale, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  evaluateTowing, EvaluationStatus, TachographStatus, TollCategory,
  TrailerBrakeType, TransportType,
} from '../lib/towingEvaluation'

type FormState = {
  carGrossWeight: string; carCurbWeight: string; trailerGrossWeight: string; trailerActualWeight: string
  carBrakedTowCapacity: string; carUnbrakedTowCapacity: string
  towbarMaxVerticalLoad: string; trailerMaxNoseWeight: string; actualNoseWeight: string
}

const initialForm: FormState = {
  carGrossWeight: '', carCurbWeight: '', trailerGrossWeight: '', trailerActualWeight: '',
  carBrakedTowCapacity: '', carUnbrakedTowCapacity: '', towbarMaxVerticalLoad: '',
  trailerMaxNoseWeight: '', actualNoseWeight: '',
}
const numberValue = (value: string) => value === '' ? 0 : Number(value)

function StatusIcon({ status }: { status: EvaluationStatus | TachographStatus }) {
  if (status === 'ok' || status === 'not-required') return <Check aria-hidden="true" />
  if (status === 'error' || status === 'required') return <X aria-hidden="true" />
  return <AlertTriangle aria-hidden="true" />
}

export default function Calculator() {
  const [form, setForm] = useState(initialForm)
  const [brakeType, setBrakeType] = useState<TrailerBrakeType>('overrun')
  const [hasEuropeanTypeApproval, setHasEuropeanTypeApproval] = useState<boolean | null>(null)
  const [isBeginnerDriver, setIsBeginnerDriver] = useState(false)
  const [transportType, setTransportType] = useState<TransportType>('private')
  const [isInternational, setIsInternational] = useState(false)
  const [tollCategory, setTollCategory] = useState<TollCategory>('UNKNOWN')
  const [expandedResults, setExpandedResults] = useState<Set<string>>(() => new Set())

  const result = useMemo(() => evaluateTowing({
    carGrossWeight: numberValue(form.carGrossWeight), carCurbWeight: numberValue(form.carCurbWeight),
    trailerGrossWeight: numberValue(form.trailerGrossWeight), trailerActualWeight: numberValue(form.trailerActualWeight),
    carBrakedTowCapacity: numberValue(form.carBrakedTowCapacity), carUnbrakedTowCapacity: numberValue(form.carUnbrakedTowCapacity),
    isBraked: brakeType !== 'unbraked', brakeType, hasEuropeanTypeApproval,
    isBeginnerDriver, transportType, isInternational,
    towbarMaxVerticalLoad: numberValue(form.towbarMaxVerticalLoad),
    trailerMaxNoseWeight: numberValue(form.trailerMaxNoseWeight), actualNoseWeight: numberValue(form.actualNoseWeight),
    hungarianTollCategory: tollCategory,
  }), [form, brakeType, hasEuropeanTypeApproval, isBeginnerDriver, transportType, isInternational, tollCategory])

  const setField = (field: keyof FormState, value: string) => {
    if (value === '' || /^\d{0,5}$/.test(value)) setForm(current => ({ ...current, [field]: value }))
  }
  const input = (field: keyof FormState, label: string, hint: string) => (
    <label className="calculator-field">
      <span>{label}</span>
      <div><input inputMode="numeric" value={form[field]} onChange={event => setField(field, event.target.value)} placeholder="0" /><b>KG</b></div>
      <small>{hint}</small>
    </label>
  )
  const toggleResult = (id: string) => setExpandedResults(current => {
    const next = new Set(current)
    next.has(id) ? next.delete(id) : next.add(id)
    return next
  })
  const resultBlock = (
    id: string,
    title: string,
    data: { status: EvaluationStatus | TachographStatus; label: string; messages: string[] },
    cta: string,
    stepTitle?: string,
  ) => {
    const isOpen = expandedResults.has(id)
    const step = stepTitle ? result.calculationSteps.find(item => item.title === stepTitle || item.title.startsWith(stepTitle)) : undefined
    const detailsId = `result-details-${id}`
    return <article className={`result-block ${data.status} ${isOpen ? 'expanded' : ''}`}>
      <div className="result-block__head"><StatusIcon status={data.status} /><span>{title}</span></div>
      <strong>{data.label}</strong>
      <button className="result-disclosure" onClick={() => toggleResult(id)} aria-expanded={isOpen} aria-controls={detailsId}>
        <span>{cta.replace('{result}', data.label)}</span><ChevronDown className={isOpen ? 'rotated' : ''} />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && <motion.div id={detailsId} className="result-details" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: .18, ease: 'easeOut' }}>
          <div>
            {step && <div className="result-calculation">{step.values.map(value => <span key={value}>{value}</span>)}<strong>{step.conclusion}</strong></div>}
            {data.messages.map(message => <p key={message}>{message}</p>)}
          </div>
        </motion.div>}
      </AnimatePresence>
    </article>
  }

  return (
    <div className="calculator-page page-width">
      <header className="tool-hero calculator-hero">
        <div><span className="kicker">01 / VONTATHATOM?</span><h1>Vontatási<br />kalkulátor</h1></div>
        <p>Írd be a forgalmi engedélyek és a mérlegelés adatait. A jogosítvány és a műszaki megfelelőség két külön ellenőrzés.</p>
      </header>

      <div className="weight-info"><Info /><div><strong>Papír szerinti tömeg ≠ tényleges tömeg</strong><p>A jogosítvány-kategóriánál a forgalmiban szereplő megengedett legnagyobb össztömeg számít. A műszaki vontathatóságnál a ténylegesen vontatott tömeget is ellenőrizni kell.</p></div></div>

      <div className="calculator-layout">
        <div className="calculator-form">
          <section className="calculator-section">
            <div className="calculator-section__title"><span>01</span><div><small>VONTATÓ JÁRMŰ</small><h2>Az autó adatai</h2></div></div>
            <div className="calculator-fields">
              {input('carGrossWeight', 'F.1/F.2 – Megengedett össztömeg', 'A vontató forgalmi engedélyéből')}
              {input('carCurbWeight', 'G – Saját tömeg', 'A vontató menetkész saját tömege')}
              {input('carBrakedTowCapacity', 'O.1 – Fékezett vontatható tömeg', 'A vontató fékezett pótkocsi-határa')}
              {input('carUnbrakedTowCapacity', 'O.2 – Fékezetlen vontatható tömeg', 'A vontató fékezetlen pótkocsi-határa')}
            </div>
          </section>

          <section className="calculator-section">
            <div className="calculator-section__title"><span>02</span><div><small>PÓTKOCSI</small><h2>A trailer adatai</h2></div></div>
            <div className="calculator-fields">
              {input('trailerGrossWeight', 'F.1/F.2 – Megengedett össztömeg', 'Jogosítvány- és KöHÉM-ellenőrzéshez')}
              {input('trailerActualWeight', 'Tényleges tömeg', 'Saját tömeg + aktuális rakomány')}
            </div>
            <div className="segmented-control three" aria-label="Pótkocsi fékrendszere">
              <button className={brakeType === 'unbraked' ? 'active' : ''} onClick={() => setBrakeType('unbraked')}>Fékezetlen</button>
              <button className={brakeType === 'overrun' ? 'active' : ''} onClick={() => setBrakeType('overrun')}>Ráfutófékes</button>
              <button className={brakeType === 'other-braked' ? 'active' : ''} onClick={() => setBrakeType('other-braked')}>Egyéb fékezett</button>
            </div>
          </section>

          <section className="calculator-section">
            <div className="calculator-section__title"><span>03</span><div><small>JOGOSÍTVÁNY</small><h2>Vezetői státusz</h2></div></div>
            <label className={`check-option ${isBeginnerDriver ? 'active danger' : ''}`}>
              <input type="checkbox" checked={isBeginnerDriver} onChange={event => setIsBeginnerDriver(event.target.checked)} />
              <span className="check-option__box">{isBeginnerDriver && <Check />}</span>
              <span><strong>Kezdő vezetői engedélyem van</strong><small>Az első nemzetközi kategória megszerzésétől még nem telt el 2 év.</small></span>
            </label>
          </section>

          <section className="calculator-section">
            <div className="calculator-section__title"><span>04</span><div><small>SZÁLLÍTÁS JELLEGE</small><h2>Használat és útdíj</h2></div></div>
            <div className="segmented-control" aria-label="Szállítás célja">
              <button className={transportType === 'private' ? 'active' : ''} onClick={() => setTransportType('private')}>Magáncélú</button>
              <button className={transportType === 'commercial' ? 'active' : ''} onClick={() => setTransportType('commercial')}>Kereskedelmi / szakmai</button>
            </div>
            {transportType === 'commercial' && <label className={`check-option ${isInternational ? 'active' : ''}`}><input type="checkbox" checked={isInternational} onChange={event => setIsInternational(event.target.checked)} /><span className="check-option__box">{isInternational && <Check />}</span><span><strong>Nemzetközi áruszállítás vagy kabotázs</strong><small>Az útvonal országhatárt érint.</small></span></label>}
            <div className="field-label">A vontató magyar e-matrica díjkategóriája</div>
            <div className="segmented-control three toll-control" aria-label="E-matrica kategória">
              {(['D1', 'D2', 'UNKNOWN'] as TollCategory[]).map(value => <button key={value} className={tollCategory === value ? 'active' : ''} onClick={() => setTollCategory(value)}>{value === 'UNKNOWN' ? 'Nem tudom' : value}</button>)}
            </div>
          </section>

          <details className="advanced-fields">
            <summary><span><small>05 / OPCIONÁLIS</small>További műszaki adatok</span><ChevronDown /></summary>
            <div className="advanced-fields__content">
              {brakeType === 'overrun' && <div className="approval-field"><span>Európai típusbizonyítvánnyal rendelkezik?</span><div className="segmented-control three"><button className={hasEuropeanTypeApproval === true ? 'active' : ''} onClick={() => setHasEuropeanTypeApproval(true)}>Igen</button><button className={hasEuropeanTypeApproval === false ? 'active' : ''} onClick={() => setHasEuropeanTypeApproval(false)}>Nem</button><button className={hasEuropeanTypeApproval === null ? 'active' : ''} onClick={() => setHasEuropeanTypeApproval(null)}>Nem tudom</button></div></div>}
              <div className="calculator-fields">
                {input('towbarMaxVerticalLoad', 'Vonóhorog max. függőleges terhelése', 'A vonóhorog adattáblájáról vagy dokumentációjából')}
                {input('trailerMaxNoseWeight', 'Trailer max. támasztóterhelése', 'A trailer adattáblájáról')}
                {input('actualNoseWeight', 'Tényleges támasztóterhelés', 'Mért aktuális S-érték')}
              </div>
              <p className="advanced-help">A szükséges adatot általában a vonóhorog adattábláján, a jármű dokumentációjában vagy a trailer adattábláján találod.</p>
            </div>
          </details>
        </div>

        <aside className="calculator-results-column">
          <div className="calculator-results">
            <div className="combined-weight"><Scale /><span>SZERELVÉNY MEGENGEDETT ÖSSZTÖMEGE</span><strong>{result.combinedGrossWeight || '—'} <small>{result.combinedGrossWeight ? 'KG' : ''}</small></strong></div>
            {resultBlock('licence', 'JOGOSÍTVÁNY', result.licence, 'Miért {result}?', 'Miért')}
            {resultBlock('technical', 'VONTATHATÓSÁG · O.1/O.2', result.technical, 'Miért {result}?', 'Vontathatja az autó?')}
            {resultBlock('tachograph', 'TACHOGRÁF', result.tachograph, 'Miért?')}
            {resultBlock('toll', 'E-MATRICA', result.toll, 'Részletek')}
            <p className="result-disclaimer"><AlertCircle /> A kalkulátor tájékoztató jellegű. A forgalmi engedélyek és az aktuális hatósági előírások az irányadók.</p>
          </div>
        </aside>
      </div>

      <section className="secondary-results">
        <div className="secondary-results__heading"><span className="kicker">MŰSZAKI RÉSZLETEK</span><h2>További ellenőrzések</h2></div>
        <div>
          {resultBlock('kohem', 'KÖHÉM MŰSZAKI FELTÉTELEK', result.kohemCompliance, 'Részletek', 'KöHÉM')}
          {resultBlock('nose', 'TÁMASZTÓTERHELÉS', result.noseWeightCompliance, result.noseWeightCompliance.status === 'warning' ? 'Mit kell ellenőriznem?' : 'Részletek')}
        </div>
      </section>

      <section className="calculator-knowledge">
        <details>
          <summary><span>Mit jelentenek ezek az adatok?</span><ChevronDown /></summary>
          <div className="knowledge-content">
            <div><strong>F.1 / F.2</strong><p>A vontató, illetve a pótkocsi megengedett legnagyobb össztömege. A jogosítvány-kategóriánál ezek összege számít.</p></div>
            <div><strong>G</strong><p>A jármű saját tömege.</p></div><div><strong>O.1</strong><p>A fékezett pótkocsi vontatható tömege.</p></div><div><strong>O.2</strong><p>A fékezetlen pótkocsi vontatható tömege.</p></div>
            <div><strong>S-érték</strong><p>A kapcsolási pont függőleges terhelése. A vonóhorog és a trailer alacsonyabb megengedett értéke számít.</p></div>
            <div><strong>B / B96 / BE</strong><p>B: alap jogosultság. B96: 3500–4250 kg-os szerelvény. BE: legfeljebb 3500 kg-os vontató és legfeljebb 3500 kg-os pótkocsi.</p></div>
            <div><strong>Tachográf</strong><p>A kötelezettséget a tömeg, a használat célja, az útvonal és a mentességek együtt határozzák meg; nem azonos a GKI-val.</p></div>
          </div>
        </details>
      </section>
    </div>
  )
}
