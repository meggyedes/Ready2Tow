import { useMemo, useState } from 'react'
import { AlertCircle, AlertTriangle, Check, ChevronDown, Gauge, Scale, X } from 'lucide-react'
import { evaluateTowing, EvaluationStatus, TachographStatus, TransportType } from '../lib/towingEvaluation'

type FormState = {
  carGrossWeight: string
  carCurbWeight: string
  trailerGrossWeight: string
  trailerActualWeight: string
  carBrakedTowCapacity: string
  carUnbrakedTowCapacity: string
}

const initialForm: FormState = {
  carGrossWeight: '', carCurbWeight: '', trailerGrossWeight: '', trailerActualWeight: '',
  carBrakedTowCapacity: '', carUnbrakedTowCapacity: '',
}

const numberValue = (value: string) => value === '' ? 0 : Number(value)

function StatusIcon({ status }: { status: EvaluationStatus | TachographStatus }) {
  if (status === 'ok' || status === 'not-required') return <Check aria-hidden="true" />
  if (status === 'error' || status === 'required') return <X aria-hidden="true" />
  return <AlertTriangle aria-hidden="true" />
}

export default function Calculator() {
  const [form, setForm] = useState(initialForm)
  const [isBraked, setIsBraked] = useState(true)
  const [isBeginnerDriver, setIsBeginnerDriver] = useState(false)
  const [transportType, setTransportType] = useState<TransportType>('private')
  const [isInternational, setIsInternational] = useState(false)

  const result = useMemo(() => evaluateTowing({
    carGrossWeight: numberValue(form.carGrossWeight),
    carCurbWeight: numberValue(form.carCurbWeight),
    trailerGrossWeight: numberValue(form.trailerGrossWeight),
    trailerActualWeight: numberValue(form.trailerActualWeight),
    carBrakedTowCapacity: numberValue(form.carBrakedTowCapacity),
    carUnbrakedTowCapacity: numberValue(form.carUnbrakedTowCapacity),
    isBraked, isBeginnerDriver, transportType, isInternational,
  }), [form, isBraked, isBeginnerDriver, transportType, isInternational])

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

  return (
    <div className="calculator-page page-width">
      <header className="tool-hero calculator-hero">
        <div><span className="kicker">01 / VONTATHATOM?</span><h1>Vontatási<br />kalkulátor</h1></div>
        <p>Írd be a forgalmi engedélyek és a mérlegelés adatait. A jogosítvány és a műszaki megfelelőség két külön ellenőrzés.</p>
      </header>

      <div className="calculator-layout">
        <div className="calculator-form">
          <section className="calculator-section">
            <div className="calculator-section__title"><span>01</span><div><small>VONTATÓ JÁRMŰ</small><h2>Az autó adatai</h2></div></div>
            <div className="calculator-fields">
              {input('carGrossWeight', 'F.1 – Megengedett össztömeg', 'A vontató forgalmi engedélyéből')}
              {input('carCurbWeight', 'G – Saját tömeg', 'A vontató menetkész saját tömege')}
              {input('carBrakedTowCapacity', 'O.1 – Fékezett vontatható tömeg', 'A vontató fékezett pótkocsi-határa')}
              {input('carUnbrakedTowCapacity', 'O.2 – Fékezetlen vontatható tömeg', 'A vontató fékezetlen pótkocsi-határa')}
            </div>
          </section>

          <section className="calculator-section">
            <div className="calculator-section__title"><span>02</span><div><small>PÓTKOCSI</small><h2>A trailer adatai</h2></div></div>
            <div className="calculator-fields">
              {input('trailerGrossWeight', 'F.2 – Megengedett össztömeg', 'A pótkocsi forgalmi engedélyéből')}
              {input('trailerActualWeight', 'Tényleges tömeg', 'A rakománnyal együtt mért aktuális tömeg')}
            </div>
            <div className="segmented-control" aria-label="Pótkocsi fékrendszere">
              <button className={isBraked ? 'active' : ''} onClick={() => setIsBraked(true)}>Fékezett</button>
              <button className={!isBraked ? 'active' : ''} onClick={() => setIsBraked(false)}>Fékezetlen</button>
            </div>
          </section>

          <section className="calculator-section">
            <div className="calculator-section__title"><span>03</span><div><small>HASZNÁLAT</small><h2>Vezető és szállítás</h2></div></div>
            <label className={`check-option ${isBeginnerDriver ? 'active danger' : ''}`}>
              <input type="checkbox" checked={isBeginnerDriver} onChange={event => setIsBeginnerDriver(event.target.checked)} />
              <span className="check-option__box">{isBeginnerDriver && <Check />}</span>
              <span><strong>Kezdő vezetői engedélyem van</strong><small>Az első nemzetközi kategória megszerzésétől még nem telt el 2 év.</small></span>
            </label>
            <div className="segmented-control" aria-label="Szállítás célja">
              <button className={transportType === 'private' ? 'active' : ''} onClick={() => setTransportType('private')}>Magáncélú</button>
              <button className={transportType === 'commercial' ? 'active' : ''} onClick={() => setTransportType('commercial')}>Kereskedelmi / szakmai</button>
            </div>
            {transportType === 'commercial' && (
              <label className={`check-option ${isInternational ? 'active' : ''}`}>
                <input type="checkbox" checked={isInternational} onChange={event => setIsInternational(event.target.checked)} />
                <span className="check-option__box">{isInternational && <Check />}</span>
                <span><strong>Nemzetközi áruszállítás vagy kabotázs</strong><small>Az útvonal országhatárt érint.</small></span>
              </label>
            )}
          </section>
        </div>

        <aside className="calculator-results">
          <div className="combined-weight"><Scale /><span>SZERELVÉNY MEGENGEDETT ÖSSZTÖMEGE</span><strong>{result.combinedGrossWeight || '—'} <small>{result.combinedGrossWeight ? 'KG' : ''}</small></strong></div>

          <article className={`result-block ${result.licence.status}`}>
            <div className="result-block__head"><StatusIcon status={result.licence.status} /><span>JOGOSÍTVÁNY</span></div>
            <strong>{result.licence.label}</strong>
            {result.licence.messages.map(message => <p key={message}>{message}</p>)}
          </article>

          <article className={`result-block ${result.technical.status}`}>
            <div className="result-block__head"><StatusIcon status={result.technical.status} /><span>MŰSZAKI MEGFELELŐSÉG</span></div>
            <strong>{result.technical.label}</strong>
            {result.technical.messages.map(message => <p key={message}>{message}</p>)}
          </article>

          <article className={`result-block ${result.tachograph.status}`}>
            <div className="result-block__head"><StatusIcon status={result.tachograph.status} /><span>TACHOGRÁF</span></div>
            <strong>{result.tachograph.label}</strong>
            {result.tachograph.messages.map(message => <p key={message}>{message}</p>)}
          </article>
          <p className="result-disclaimer"><AlertCircle /> A kalkulátor tájékoztató jellegű. A forgalmi engedélyek és az aktuális hatósági előírások az irányadók.</p>
        </aside>
      </div>

      <section className="calculator-knowledge">
        <details>
          <summary><span>Mit jelentenek ezek az adatok?</span><ChevronDown /></summary>
          <div className="knowledge-content">
            <div><strong>F.1 / F.2</strong><p>A vontató, illetve a pótkocsi megengedett legnagyobb össztömege. A jogosítvány-kategóriánál ezek összege számít.</p></div>
            <div><strong>G</strong><p>A jármű saját tömege. Nehéz pótkocsi B kategóriás vontatásánál releváns adat.</p></div>
            <div><strong>O.1</strong><p>A vontató által húzható fékezett pótkocsi legnagyobb tömege.</p></div>
            <div><strong>O.2</strong><p>A vontató által húzható fékezetlen pótkocsi legnagyobb tömege.</p></div>
            <div><strong>B / B96 / BE</strong><p>B: alap jogosultság. B96: 750 kg feletti pótkocsival 3500–4250 kg-os szerelvény. BE: legfeljebb 3500 kg-os B kategóriás vontató és legfeljebb 3500 kg-os pótkocsi.</p></div>
            <div><strong>Kezdő vezető</strong><p>Az első nemzetközi kategória megszerzésétől számított két évben B kategóriás jogosultsággal pótkocsi nem vontatható.</p></div>
            <div><strong>Tachográf</strong><p>A vezetési és pihenőidők rögzítésére szolgáló menetíró. A kötelezettséget a tömeg, a használat célja, az útvonal és a mentességek együtt határozzák meg; nem azonos a GKI-val.</p></div>
          </div>
        </details>
        <div className="knowledge-speeds">
          <div><Gauge /><span>MAGYARORSZÁGI ÁLTALÁNOS SEBESSÉGHATÁROK<br />GÉPJÁRMŰ + PÓTKOCSI ESETÉN</span></div>
          <dl><div><dt>Lakott terület</dt><dd>50 <small>KM/H</small></dd></div><div><dt>Lakott területen kívül</dt><dd>70 <small>KM/H</small></dd></div><div><dt>Autóút</dt><dd>70 <small>KM/H</small></dd></div><div><dt>Autópálya</dt><dd>80 <small>KM/H</small></dd></div></dl>
        </div>
      </section>
    </div>
  )
}
