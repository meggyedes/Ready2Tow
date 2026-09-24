import { useEffect, useState } from 'react'
import { AnimatePresence, animate, motion, useMotionValue, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2, Gauge, Scale, ShieldCheck } from 'lucide-react'

const modules = [
  { no: '01', title: 'Vontathatom?', text: 'Jármű, pótkocsi, össztömeg és jogosítvány. A számok, amiket indulás előtt ismerned kell.', stat: 'B/BE', meta: 'JOGOSÍTVÁNY', href: '/calculator' },
  { no: '02', title: 'Indulhatok?', text: 'Végigvezetünk a csatlakozás, világítás, gumik, rakomány és dokumentumok ellenőrzésén.', stat: '33', meta: 'ELLENŐRZÉSI PONT', href: '/checklist' },
  { no: '03', title: 'Szabályok', text: 'Országonként átlátható sebességhatárok, felszerelések és úthasználati tudnivalók.', stat: '10', meta: 'ORSZÁG', href: '/kresz' },
  { no: '04', title: 'Határátlépés', text: 'Lásd egy helyen, mi változik, amikor egy másik országba érkezel.', stat: 'HU→DE', meta: 'ÖSSZEHASONLÍTÁS', href: '/kresz#compare' },
  { no: '05', title: 'Útközben', text: 'Állj meg az első kilométerek után: rögzítés, hőmérséklet, gumik és fékek gyors ellenőrzése.', stat: '20', meta: 'KM UTÁN', href: '/checklist#journey-checks' },
]

function AnimatedNumber({ value }: { value: number }) {
  const count = useMotionValue(0)
  const formatted = useTransform(count, current => Math.round(current).toLocaleString('hu-HU'))

  useEffect(() => {
    const controls = animate(count, value, { duration: 1.25, ease: [0.16, 1, 0.3, 1] })
    return controls.stop
  }, [count, value])

  return <motion.span>{formatted}</motion.span>
}

const licenceLimits = [
  { category: 'B · KÖNNYŰ PÓTKOCSI', value: 750 },
  { category: 'B96 · MAX. SZERELVÉNY', value: 4250 },
  { category: 'BE · ELMÉLETI MAXIMUM', value: 7000 },
]

function RotatingLicenceCounter() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => setActive(current => (current + 1) % licenceLimits.length), 2800)
    return () => window.clearInterval(timer)
  }, [])

  const item = licenceLimits[active]

  return (
    <motion.div className="licence-counter" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
      <Scale />
      <AnimatePresence mode="wait">
        <motion.span key={item.category} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: .2 }}>{item.category}</motion.span>
      </AnimatePresence>
      <strong><AnimatedNumber key={item.value} value={item.value} /> KG</strong>
    </motion.div>
  )
}

const mobileStats = [
  { label: 'B · KÖNNYŰ PÓTKOCSI', values: [750], separator: '', suffix: ' KG', group: 0, icon: Scale },
  { label: 'B96 · MAX. SZERELVÉNY', values: [4250], separator: '', suffix: ' KG', group: 0, icon: Scale },
  { label: 'BE · ELMÉLETI MAXIMUM', values: [7000], separator: '', suffix: ' KG', group: 0, icon: Scale },
  { label: 'VONÓFEJTERHELÉS', values: [50, 100], separator: '–', suffix: ' KG', group: 1, icon: Gauge },
  { label: 'SÚLYELOSZTÁS', values: [60, 40], separator: ' / ', suffix: '', group: 2, icon: ShieldCheck },
]

function MobileStatRotator() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => setActive(current => (current + 1) % mobileStats.length), 2800)
    return () => window.clearInterval(timer)
  }, [])

  const stat = mobileStats[active]
  const Icon = stat.icon

  return <div className="mobile-stat" aria-live="polite">
    <AnimatePresence mode="wait">
      <motion.div key={stat.label} initial={{ opacity: 0, y: 7 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -7 }} transition={{ duration: .22 }}>
        <Icon /><span className="mobile-stat__label">{stat.label}</span><strong>{stat.values.map((value, index) => <span key={`${stat.label}-${value}`}>{index > 0 && stat.separator}<AnimatedNumber value={value} /></span>)}{stat.suffix}</strong>
      </motion.div>
    </AnimatePresence>
    <div className="mobile-stat__steps" aria-hidden="true">{[0, 1, 2].map(group => <i className={group === stat.group ? 'active' : ''} key={group} />)}</div>
  </div>
}

export default function Home() {
  return (
    <div className="home-page">
      <section className="hero">
        <picture>
          <source media="(max-width: 767px)" srcSet="/images/IMG_8564.JPEG" />
          <img src="/images/IMG_0468.JPEG" alt="Autó utánfutóval közúton" className="hero__image" />
        </picture>
        <div className="hero__shade" />
        <div className="hero__roadline" />
        <motion.div className="hero__content" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7 }}>
          <div className="eyebrow"><span /> VONTATÁSI ÚTITÁRS</div>
          <h1>READY<br /><em>2</em> TOW?</h1>
          <p>Rég vontattál? Néhány perc alatt átnézzük veled, hogy szabályosan és biztonságosan indulhatsz-e.</p>
          <Link className="primary-cta" to="/checklist">Indulás előtti ellenőrzés <ArrowRight /></Link>
        </motion.div>
      </section>

      <section className="confidence-strip" id="start">
        <div className="confidence-strip__inner">
          <RotatingLicenceCounter />
          <motion.div className="metric-counter" initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .55, delay: .12, ease: [0.16, 1, 0.3, 1] }}>
            <motion.i initial={{ rotate: -35, scale: .7 }} whileInView={{ rotate: 0, scale: 1 }} viewport={{ once: true }} transition={{ duration: .55, delay: .22 }}><Gauge /></motion.i>
            <span>VONÓFEJTERHELÉS</span>
            <motion.strong initial={{ opacity: 0, scale: .88 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: .5, delay: .25 }}><AnimatedNumber value={50} />–<AnimatedNumber value={100} /> KG</motion.strong>
          </motion.div>
          <motion.div className="metric-counter" initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .55, delay: .24, ease: [0.16, 1, 0.3, 1] }}>
            <motion.i initial={{ rotate: -18, scale: .7 }} whileInView={{ rotate: 0, scale: 1 }} viewport={{ once: true }} transition={{ duration: .55, delay: .34 }}><ShieldCheck /></motion.i>
            <span>SÚLYELOSZTÁS</span>
            <motion.strong initial={{ opacity: 0, scale: .88 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: .5, delay: .37 }}><AnimatedNumber value={60} /> / <AnimatedNumber value={40} /></motion.strong>
          </motion.div>
        </div>
        <MobileStatRotator />
      </section>

      <section className="module-section page-width">
        <div className="section-heading">
          <div><span>ÚTVONAL</span><h2>Öt lépés.<br />Nyugodt indulás.</h2></div>
          <p>A legfontosabb döntések és ellenőrzések logikus sorrendben, felesleges keresgélés nélkül.</p>
        </div>
        <div className="module-list">
          {modules.map((module, index) => {
            const content = (
              <motion.div className="module-row" initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * .06 }}>
                <span className="module-row__no">{module.no}</span>
                <div className="module-row__copy"><h3>{module.title}</h3><p>{module.text}</p></div>
                <div className="module-row__stat"><strong>{module.stat}</strong><span>{module.meta}</span></div>
                {module.href && <ArrowRight className="module-row__arrow" />}
              </motion.div>
            )
            return module.href ? <Link to={module.href} key={module.no}>{content}</Link> : <div key={module.no}>{content}</div>
          })}
        </div>
      </section>

      <section className="country-preview">
        <div className="page-width country-preview__inner">
          <div className="country-preview__title"><span>03 / SZABÁLYOK</span><h2>MAGYARORSZÁG</h2><p>A kritikus információt egy pillantással megtalálod.</p></div>
          <div className="speed-display"><span>AUTÓPÁLYA</span><strong>80</strong><b>KM/H</b></div>
          <div className="speed-display secondary"><span>LAKOTT TERÜLET</span><strong>50</strong><b>KM/H</b></div>
          <Link to="/kresz" className="text-link">Minden ország szabályai <ArrowRight /></Link>
        </div>
      </section>

      <section className="ready-banner page-width">
        <div><span>02 / INDULHATOK?</span><h2>Készen áll<br />a szerelvény?</h2></div>
        <div><CheckCircle2 /><p>A haladásodat automatikusan megőrizzük, így ott folytathatod, ahol abbahagytad.</p><Link to="/checklist" className="primary-cta">Ellenőrzés indítása <ArrowRight /></Link></div>
      </section>
    </div>
  )
}
