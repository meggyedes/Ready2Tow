import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowDown, ArrowRight, CheckCircle2, Gauge, Scale, ShieldCheck } from 'lucide-react'

const modules = [
  { no: '01', title: 'Vontathatom?', text: 'Jármű, pótkocsi, össztömeg és jogosítvány. A számok, amiket indulás előtt ismerned kell.', stat: 'BE', meta: 'JOGOSÍTVÁNY' },
  { no: '02', title: 'Indulhatok?', text: 'Végigvezetünk a csatlakozás, világítás, gumik, rakomány és dokumentumok ellenőrzésén.', stat: '33', meta: 'ELLENŐRZÉSI PONT', href: '/checklist' },
  { no: '03', title: 'Szabályok', text: 'Országonként átlátható sebességhatárok, felszerelések és úthasználati tudnivalók.', stat: '10', meta: 'ORSZÁG', href: '/kresz' },
  { no: '04', title: 'Határátlépés', text: 'Lásd egy helyen, mi változik, amikor egy másik országba érkezel.', stat: 'HU→DE', meta: 'ÖSSZEHASONLÍTÁS', href: '/kresz#compare' },
  { no: '05', title: 'Útközben', text: 'Állj meg az első kilométerek után: rögzítés, hőmérséklet, gumik és fékek gyors ellenőrzése.', stat: '20', meta: 'KM UTÁN' },
]

export default function Home() {
  return (
    <div className="home-page">
      <section className="hero">
        <img src="/images/IMG_0468.JPEG" alt="Autó utánfutóval közúton" className="hero__image" />
        <div className="hero__shade" />
        <div className="hero__roadline" />
        <motion.div className="hero__content" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7 }}>
          <div className="eyebrow"><span /> VONTATÁSI ÚTITÁRS</div>
          <h1>READY<br /><em>2</em> TOW?</h1>
          <p>Rég vontattál? Néhány perc alatt átnézzük veled, hogy szabályosan és biztonságosan indulhatsz-e.</p>
          <Link className="primary-cta" to="/checklist">Indulás előtti ellenőrzés <ArrowRight /></Link>
        </motion.div>
        <div className="hero__metric"><span>HU / AUTÓPÁLYA</span><strong>80</strong><b>KM/H</b></div>
        <a href="#start" className="scroll-cue" aria-label="Tovább"><ArrowDown /></a>
      </section>

      <section className="confidence-strip" id="start">
        <div><Scale /><span>MAX. SZERELVÉNY</span><strong>4250 KG</strong></div>
        <div><Gauge /><span>VONÓFEJTERHELÉS</span><strong>50–100 KG</strong></div>
        <div><ShieldCheck /><span>SÚLYELOSZTÁS</span><strong>60 / 40</strong></div>
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
