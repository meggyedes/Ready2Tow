import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, ChevronDown, Search, Shield, X } from 'lucide-react'
import { COUNTRY_FLAGS, internationalRules } from '../constants/internationalRules'
import { hungarianRules } from '../constants/hungarianRules'
import 'flag-icons/css/flag-icons.min.css'

type CountryInfo = { name: string; motorway: number; outside: number; urban: number }

const countryInfo: CountryInfo[] = [
  { name: 'Magyarország', motorway: 80, outside: 70, urban: 50 },
  { name: 'Hollandia', motorway: 100, outside: 80, urban: 50 },
  { name: 'Németország', motorway: 100, outside: 80, urban: 50 },
  { name: 'Ausztria', motorway: 100, outside: 80, urban: 50 },
  { name: 'Svájc', motorway: 100, outside: 80, urban: 50 },
  { name: 'Luxemburg', motorway: 90, outside: 90, urban: 50 },
  { name: 'Olaszország', motorway: 100, outside: 90, urban: 50 },
  { name: 'Csehország', motorway: 100, outside: 90, urban: 50 },
  { name: 'Lengyelország', motorway: 100, outside: 90, urban: 50 },
  { name: 'Szlovákia', motorway: 100, outside: 90, urban: 50 },
]

export default function Kresz() {
  const [active, setActive] = useState('Magyarország')
  const [from, setFrom] = useState('Magyarország')
  const [to, setTo] = useState('Németország')
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)

  const selected = countryInfo.find(country => country.name === active)!
  const fromInfo = countryInfo.find(country => country.name === from)!
  const toInfo = countryInfo.find(country => country.name === to)!
  const rules = useMemo(() => {
    const source = active === 'Magyarország' ? hungarianRules : internationalRules.filter(rule => rule.country === active)
    const term = search.toLocaleLowerCase('hu')
    return source.filter(rule => `${rule.title} ${rule.content}`.toLocaleLowerCase('hu').includes(term))
  }, [active, search])

  return (
    <div className="rules-page">
      <header className="rules-hero page-width">
        <span className="kicker">03 / SZABÁLYOK</span>
        <h1>Országonként.<br />Egy pillantásra.</h1>
        <p>A meglévő adatbázisban szereplő vontatási sebességek, kötelező felszerelések és úthasználati tudnivalók.</p>
      </header>

      <div className="country-tabs-wrap">
        <div className="country-tabs page-width">
          {countryInfo.map(country => (
            <button key={country.name} className={active === country.name ? 'active' : ''} onClick={() => setActive(country.name)}>
              <span className={`fi fi-${COUNTRY_FLAGS[country.name] || 'hu'}`} />{country.name}
            </button>
          ))}
        </div>
      </div>

      <section className="country-dashboard page-width">
        <div className="country-dashboard__name">
          <span className={`fi fi-${COUNTRY_FLAGS[active] || 'hu'}`} />
          <div><small>AKTÍV ORSZÁG</small><h2>{active.toUpperCase()}</h2></div>
        </div>
        <div className="speed-grid">
          <div className="speed-tile primary"><span>AUTÓPÁLYA</span><strong>{selected.motorway}</strong><b>KM/H</b></div>
          <div className="speed-tile"><span>LAKOTT TERÜLETEN KÍVÜL</span><strong>{selected.outside}</strong><b>KM/H</b></div>
          <div className="speed-tile"><span>LAKOTT TERÜLET</span><strong>{selected.urban}</strong><b>KM/H</b></div>
        </div>

        <div className="rules-search"><Search /><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Keresés az ország szabályai között" />{search && <button onClick={() => setSearch('')}><X /></button>}</div>
        <div className="rule-list">
          {rules.map(rule => {
            const open = expanded === rule.id
            return (
              <button key={rule.id} className={`rule-line ${rule.important ? 'important' : ''}`} onClick={() => setExpanded(open ? null : rule.id)}>
                <span className="rule-line__icon"><Shield /></span>
                <span className="rule-line__title"><small>{'category' in rule ? rule.category : 'SEBESSÉGKORLÁTOZÁS'}</small><strong>{rule.title}</strong></span>
                <ChevronDown className={open ? 'rotated' : ''} />
                <AnimatePresence>{open && <motion.span className="rule-line__content" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>{rule.content}</motion.span>}</AnimatePresence>
              </button>
            )
          })}
          {rules.length === 0 && <p className="empty-result">Nincs találat ebben az országban.</p>}
        </div>
        {active === 'Magyarország' && (
          <div className="legal-note">
            <strong>JOGI MEGJEGYZÉS</strong>
            <p>A Ready2Tow gyors tájékoztató és ellenőrző segédlet. Nem helyettesíti a hatályos jogszabályokat, a járművek forgalmi engedélyét, a gyártói előírásokat vagy a hatósági tájékoztatást. Speciális járműkombináció esetén mindig ellenőrizd az aktuális hivatalos előírásokat.</p>
          </div>
        )}
      </section>

      <section className="compare-section" id="compare">
        <div className="page-width">
          <span className="kicker">04 / HATÁRÁTLÉPÉS</span>
          <h2>MI VÁLTOZIK<br />A HATÁRON?</h2>
          <div className="compare-selectors">
            <label><span>INDULÁS</span><select value={from} onChange={event => setFrom(event.target.value)}>{countryInfo.map(c => <option key={c.name}>{c.name}</option>)}</select></label>
            <ArrowRight />
            <label><span>ÉRKEZÉS</span><select value={to} onChange={event => setTo(event.target.value)}>{countryInfo.map(c => <option key={c.name}>{c.name}</option>)}</select></label>
          </div>
          <div className="compare-title"><span>{from.toUpperCase()}</span><ArrowRight /><strong>{to.toUpperCase()}</strong></div>
          <div className="difference-table">
            <div><span>AUTÓPÁLYA</span><b>{fromInfo.motorway} KM/H</b><ArrowRight /><strong className={fromInfo.motorway !== toInfo.motorway ? 'changed' : ''}>{toInfo.motorway} KM/H</strong></div>
            <div><span>ORSZÁGÚT</span><b>{fromInfo.outside} KM/H</b><ArrowRight /><strong className={fromInfo.outside !== toInfo.outside ? 'changed' : ''}>{toInfo.outside} KM/H</strong></div>
            <div><span>LAKOTT TERÜLET</span><b>{fromInfo.urban} KM/H</b><ArrowRight /><strong className={fromInfo.urban !== toInfo.urban ? 'changed' : ''}>{toInfo.urban} KM/H</strong></div>
          </div>
          <p className="compare-note">A további felszerelési és úthasználati eltéréseket a fenti országfüleken találod.</p>
        </div>
      </section>
    </div>
  )
}
