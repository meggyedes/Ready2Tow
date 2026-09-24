import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, ChevronDown, Circle, Globe2, RotateCcw } from 'lucide-react'
import { COUNTRIES, COUNTRY_FLAGS, getCountryChecklistRequirements } from '../constants/internationalRules'

type ChecklistItemSource = 'base' | 'country'
type BaseItem = { id: string; group: string; title: string; detail: string }
type Item = BaseItem & { source: ChecklistItemSource }
type RouteItem = Item & { requiredByCountries: string[] }

const baseItems: BaseItem[] = [
  { id: 'license', group: 'DOKUMENTUMOK ÉS TÖMEG', title: 'Megfelelő jogosítvány-kategória', detail: 'B, B96 vagy BE: a forgalmikban szereplő megengedett legnagyobb össztömegek alapján ellenőrizve.' },
  { id: 'beginner', group: 'DOKUMENTUMOK ÉS TÖMEG', title: 'Nem kezdő vezetői engedély', detail: 'B kategóriás jogosultsággal a kezdő vezetői engedély első két évében pótkocsi nem vontatható.' },
  { id: 'car-doc', group: 'DOKUMENTUMOK ÉS TÖMEG', title: 'A vontató forgalmi engedélye', detail: 'Saját tömeg, össztömeg, fékezett és fékezetlen vontatható tömeg ellenőrizve.' },
  { id: 'trailer-doc', group: 'DOKUMENTUMOK ÉS TÖMEG', title: 'A pótkocsi forgalmi engedélye', detail: 'Saját tömeg és megengedett legnagyobb össztömeg ellenőrizve.' },
  { id: 'limits', group: 'DOKUMENTUMOK ÉS TÖMEG', title: 'Minden tömegkorlát rendben', detail: 'A jogosítvány és a konkrét autó műszaki határértékei is megengedik a szerelvényt.' },
  { id: 'coupling', group: 'CSATLAKOZÁS', title: 'Vonófej és retesz', detail: 'A kapcsolófej teljesen rázáródott a gömbre, a retesz biztosított.' },
  { id: 'cable', group: 'CSATLAKOZÁS', title: 'Biztonsági kábel', detail: 'Megfelelő pontra kapcsolva, nem ér a földhöz és nem sérült.' },
  { id: 'jockey', group: 'CSATLAKOZÁS', title: 'Támasztókerék', detail: 'Teljesen felhúzva, menetirányban áll és szorosan rögzített.' },
  { id: 'lights', group: 'VILÁGÍTÁS', title: 'Minden lámpa működik', detail: 'Helyzetjelző, féklámpa, irányjelző, ködlámpa és rendszámvilágítás.' },
  { id: 'plug', group: 'VILÁGÍTÁS', title: 'Elektromos csatlakozó', detail: 'Tiszta, száraz, szorosan illeszkedik; a kábel nem feszül.' },
  { id: 'left-indicator', group: 'VILÁGÍTÁS', title: 'Bal irányjelző', detail: 'A vontatóval azonos ütemben, megfelelő fényerővel működik.' },
  { id: 'right-indicator', group: 'VILÁGÍTÁS', title: 'Jobb irányjelző', detail: 'A vontatóval azonos ütemben, megfelelő fényerővel működik.' },
  { id: 'brake-light', group: 'VILÁGÍTÁS', title: 'Fék- és rendszámvilágítás', detail: 'Mindkét féklámpa és a rendszámtábla megvilágítása működik.' },
  { id: 'tyres', group: 'KEREKEK', title: 'Gumik és nyomás', detail: 'Nincs sérülés vagy repedés, a nyomás megfelel az előírásnak.' },
  { id: 'nuts', group: 'KEREKEK', title: 'Kerékanyák', detail: 'Minden anya a helyén van és a gyártói nyomatékra húzott.' },
  { id: 'load', group: 'RAKOMÁNY', title: 'Rakomány rögzítése', detail: 'A rakomány nem mozdul el, minden heveder ép és feszes.' },
  { id: 'balance', group: 'RAKOMÁNY', title: 'Súlyelosztás', detail: 'A tömeg nagyobb része elöl van, a vonófejterhelés megfelelő.' },
  { id: 'straps', group: 'RAKOMÁNY', title: 'Hevederek feszessége', detail: 'Minden rögzítőeszköz sérülésmentes, megfelelően vezetett és feszes.' },
  { id: 'overhang', group: 'RAKOMÁNY', title: 'Túlnyúlás jelölése', detail: 'A túlnyúló rakomány előírt jelzései és szükség esetén fényei a helyükön vannak.' },
  { id: 'dimensions', group: 'RAKOMÁNY', title: 'Magasság és teljes hossz', detail: 'Ismered a szerelvény magasságát és hozzávetőleges hosszát; a magasság nem több 4 méternél.' },
  { id: 'mirrors', group: 'LÁTÁS', title: 'Tükrök beállítása', detail: 'Mindkét oldalon belátható a pótkocsi teljes hossza.' },
  { id: 'documents', group: 'DOKUMENTUMOK ÉS TÖMEG', title: 'Iratok és biztosítás', detail: 'Minden szükséges okmány nálad van, a forgalmi és a biztosítás érvényes.' },
  { id: 'plate', group: 'VÉGSŐ KÖR', title: 'Rendszám és fényvisszaverők', detail: 'Rögzítve, olvashatóan és takarás nélkül láthatók.' },
  { id: 'damage', group: 'VÉGSŐ KÖR', title: 'Nincs látható sérülés', detail: 'A vázon, tengelyen, karosszérián és rögzítési pontokon nincs rendellenesség.' },
  { id: 'walkaround', group: 'VÉGSŐ KÖR', title: 'Körbejárás indulás előtt', detail: 'Kézifék kioldva, ajtók és ponyva zárva, rendszám látható.' },
  { id: 'speed-known', group: 'INDULÁSI TERV', title: 'Ismered a sebességhatárokat', detail: 'Magyarországon: 50 km/h lakott területen, 70 km/h országúton és autóúton, 80 km/h autópályán.' },
  { id: 'first-stop', group: 'INDULÁSI TERV', title: 'Megvan az első ellenőrző megálló', detail: 'Az első néhány tíz kilométer után biztonságos helyen újra átnézed a szerelvényt.' },
]
const checklist: Item[] = baseItems.map(item => ({ ...item, source: 'base' }))

const journeyChecks = [
  { id: 'straps', title: 'Rakományrögzítő hevederek', detail: 'Nézd meg, hogy egyik heveder sem lazult, csúszott vagy sérült meg. A racsnik legyenek zárva, a kampók pedig biztos ponton maradjanak.' },
  { id: 'coupling', title: 'Kapcsolószerkezet', detail: 'Ellenőrizd, hogy a vonófej továbbra is teljesen zárt és biztosított, nincs rendellenes játék, zaj vagy látható elmozdulás.' },
  { id: 'breakaway', title: 'Szakítófék-kábel', detail: 'Legyen a kijelölt rögzítési ponthoz kapcsolva, ne tekeredjen a vonófej köré, ne érjen a földhöz és ne legyen sérült.' },
  { id: 'electric', title: 'Elektromos csatlakozó', detail: 'Győződj meg róla, hogy a dugó nem lazult ki, a kábel nem feszül és nem ér le. Ellenőrizd újra az irányjelzőket, féklámpát és helyzetjelzőket.' },
  { id: 'tyres', title: 'Gumiabroncsok', detail: 'Keress sérülést, dudort vagy szokatlan deformációt. Figyelj az abroncsok rendellenes melegedésére és a látható nyomásvesztésre.' },
  { id: 'wheels', title: 'Kerekek és kerékrögzítés', detail: 'Nézd meg, hogy minden kerékanya a helyén van-e, nincs-e elmozdulásra utaló nyom, repedés vagy rendellenes kerékállás.' },
  { id: 'heat', title: 'Rendellenes melegedés', detail: 'Óvatosan, érintés nélkül közelítve hasonlítsd össze a kerékagyak és fékek hőmérsékletét. Egy feltűnően melegebb kerék hibára utalhat.' },
  { id: 'load', title: 'Rakomány elmozdulása', detail: 'Ellenőrizd, hogy a rakomány helyzete nem változott, a súlyelosztás megfelelő maradt, és semmi nem nyomja vagy dörzsöli a ponyvát és oldalfalakat.' },
]

export default function Checklist() {
  const [checked, setChecked] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('r2t-checklist') || '[]') } catch { return [] }
  })
  const [countries, setCountries] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('selectedCountries') || '["Magyarország"]') } catch { return ['Magyarország'] }
  })
  const [openGroups, setOpenGroups] = useState<Set<string>>(() => new Set())
  const [openJourney, setOpenJourney] = useState<string | null>(null)

  useEffect(() => localStorage.setItem('r2t-checklist', JSON.stringify(checked)), [checked])
  useEffect(() => localStorage.setItem('selectedCountries', JSON.stringify(countries)), [countries])

  const groups = useMemo(() => Array.from(new Set(checklist.map(item => item.group))), [])
  const routeItems = useMemo<RouteItem[]>(() => {
    const merged = new Map<string, RouteItem>()
    countries.forEach(country => {
      getCountryChecklistRequirements(country).forEach(requirement => {
        const id = `country:${requirement.id}`
        const existing = merged.get(id)
        if (existing) existing.requiredByCountries.push(country)
        else merged.set(id, {
          id,
          group: 'ÚTVONAL-SPECIFIKUS',
          title: requirement.title,
          detail: requirement.description,
          source: 'country',
          requiredByCountries: [country],
        })
      })
    })
    return Array.from(merged.values())
  }, [countries])
  const activeIds = useMemo(() => new Set([...checklist, ...routeItems].map(item => item.id)), [routeItems])
  const checkedCount = checked.filter(id => activeIds.has(id)).length
  const totalItems = checklist.length + routeItems.length
  const percent = Math.round((checkedCount / totalItems) * 100)
  const toggle = (id: string) => setChecked(value => value.includes(id) ? value.filter(item => item !== id) : [...value, id])
  const toggleGroup = (group: string) => setOpenGroups(current => {
    const next = new Set(current)
    next.has(group) ? next.delete(group) : next.add(group)
    return next
  })
  const toggleCountry = (country: string) => {
    if (country === 'Magyarország') return
    setCountries(value => value.includes(country) ? value.filter(item => item !== country) : [...value, country])
  }

  return (
    <div className="tool-page page-width">
      <header className="tool-hero">
        <div><span className="kicker">02 / INDULHATOK?</span><h1>Indulás előtti<br />ellenőrzés</h1></div>
        <p>Menj végig a szerelvényen ebben a sorrendben. Nagy gombok, egykezes használat, semmi kapkodás.</p>
      </header>

      <section className="progress-panel">
        <div className="progress-panel__count"><strong>{checkedCount} / {totalItems}</strong><span>ELLENŐRIZVE{routeItems.length > 0 && <small>+{routeItems.length} ÚTVONAL-SPECIFIKUS</small>}</span></div>
        <div className="progress-track"><motion.div animate={{ width: `${percent}%` }} /></div>
        <span className="progress-percent">{percent}%</span>
        <button onClick={() => setChecked([])} title="Lista visszaállítása"><RotateCcw /></button>
      </section>

      <section className="route-selector">
        <div className="route-selector__heading"><Globe2 /><div><span>ÚTVONAL</span><h2>Mely országokon haladsz át?</h2></div></div>
        <div className="country-chips">
          {COUNTRIES.map(country => (
            <button key={country} onClick={() => toggleCountry(country)} className={countries.includes(country) ? 'active' : ''}>
              <span className={`fi fi-${COUNTRY_FLAGS[country]}`} />
              <span className="country-chip__copy"><strong>{country}</strong>{getCountryChecklistRequirements(country).length > 0 && <small>+{getCountryChecklistRequirements(country).length} ellenőrzés</small>}</span>
            </button>
          ))}
        </div>
        <p>A kiválasztott országok részletes előírásait a Szabályok nézetben ellenőrizheted.</p>
      </section>

      <div className="checklist-groups">
        {groups.map((group, groupIndex) => {
          const items = checklist.filter(item => item.group === group)
          const done = items.filter(item => checked.includes(item.id)).length
          const expanded = openGroups.has(group)
          return (
            <section className="check-group" key={group}>
              <button className="check-group__heading" onClick={() => toggleGroup(group)} aria-expanded={expanded} aria-controls={`check-group-${groupIndex}`}>
                <span>{String(groupIndex + 1).padStart(2, '0')}</span><h2>{group}</h2><b>{done}/{items.length}</b><ChevronDown className={expanded ? 'rotated' : ''} />
              </button>
              <AnimatePresence initial={false}>
                {expanded && <motion.div
                  id={`check-group-${groupIndex}`}
                  className="check-group__content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ height: { duration: .3, ease: [0.22, 1, 0.36, 1] }, opacity: { duration: .2 } }}
                >
                  <div className="check-items">
                    {items.map(item => {
                      const done = checked.includes(item.id)
                      return (
                        <motion.button whileTap={{ scale: .985 }} key={item.id} className={`check-item ${done ? 'done' : ''}`} onClick={() => toggle(item.id)}>
                          <span className="check-control">{done ? <Check /> : <Circle />}</span>
                          <span className="check-item__copy"><strong>{item.title}</strong><small>{item.detail}</small></span>
                        </motion.button>
                      )
                    })}
                  </div>
                </motion.div>}
              </AnimatePresence>
            </section>
          )
        })}
      </div>

      <AnimatePresence initial={false}>
        {routeItems.length > 0 && <motion.section
          className="route-checklist"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ height: { duration: .35, ease: [0.22, 1, 0.36, 1] }, opacity: { duration: .2 } }}
        >
          <div className="route-checklist__inner">
            <div className="route-checklist__heading"><span>ÚTVONAL-SPECIFIKUS</span><h2>Határátlépés előtt</h2><b>{routeItems.filter(item => checked.includes(item.id)).length}/{routeItems.length}</b></div>
            <div className="check-items route-checklist__items">
              {routeItems.map(item => {
                const done = checked.includes(item.id)
                return <motion.button whileTap={{ scale: .985 }} key={item.id} className={`check-item country ${done ? 'done' : ''}`} onClick={() => toggle(item.id)}>
                  <span className="check-control">{done ? <Check /> : <Circle />}</span>
                  <span className="check-item__copy"><strong>{item.title}</strong><small>{item.detail}</small><span className="required-countries">Útvonal miatt szükséges: {item.requiredByCountries.map(country => <span key={country}><i className={`fi fi-${COUNTRY_FLAGS[country]}`} />{country}</span>)}</span></span>
                </motion.button>
              })}
            </div>
          </div>
        </motion.section>}
      </AnimatePresence>

      <section className="journey-checks" id="journey-checks">
        <div className="journey-checks__intro"><span className="kicker">05 / ÚTKÖZBEN</span><h2>Állj meg.<br />Nézd át újra.</h2><p>Az első néhány tíz kilométer után, majd hosszabb úton rendszeresen keress biztonságos helyet az ellenőrzéshez.</p></div>
        <div className="journey-checks__list">
          {journeyChecks.map((item, index) => {
            const expanded = openJourney === item.id
            return <div className={expanded ? 'expanded' : ''} key={item.id}>
              <button onClick={() => setOpenJourney(expanded ? null : item.id)} aria-expanded={expanded} aria-controls={`journey-${item.id}`}>
                <span>{String(index + 1).padStart(2, '0')}</span><strong>{item.title}</strong><ChevronDown className={expanded ? 'rotated' : ''} />
              </button>
              <AnimatePresence initial={false}>
                {expanded && <motion.p id={`journey-${item.id}`} initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: .24, ease: 'easeOut' }}>{item.detail}</motion.p>}
              </AnimatePresence>
            </div>
          })}
        </div>
      </section>

      {checkedCount === totalItems && <motion.div className="complete-banner" initial={{ scale: .96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}><Check /><div><span>ELLENŐRZÉS KÉSZ</span><strong>Indulásra kész.</strong></div></motion.div>}
    </div>
  )
}
