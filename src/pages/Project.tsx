export default function Project() {
  return (
    <div className="project-page">
      <section className="project-intro page-width">
        <div className="project-intro__heading">
          <span className="kicker">A PROJEKTRŐL</span>
          <h1>MIÉRT KÉSZÜLT<br />A READY<span>2</span>TOW?</h1>
        </div>

        <div className="project-copy project-intro__copy">
          <p>A vontatás tipikusan olyan dolog, amit sokan nem csinálnak minden héten. Eltelik fél vagy akár egy év, újra utánfutót kell húzni, és hirtelen előjönnek azok a kérdések, amelyek legutóbb még egyértelműnek tűntek: mennyivel mehetek? Mit enged a jogosítványom? Mekkora lehet a szerelvény össztömege? Mit kell ellenőriznem indulás előtt? És mi változik, ha átlépem az országhatárt?</p>
          <p>A szabályok ráadásul nem mindenhol ugyanazok. Ami Magyarországon megszokott, az Németországban, Ausztriában vagy éppen Franciaországban már eltérhet. Ha valaki csak alkalmanként vontat, nem feltétlenül reális elvárás, hogy ezeket az adatokat és előírásokat mindig fejből tudja.</p>
          <p>A READY2TOW ezért készült: egy gyorsan elővehető vontatási segédlet azoknak, akik szeretnének indulás előtt néhány perc alatt képbe kerülni.</p>
          <p>Nem az a célja, hogy helyetted gondolkodjon, hanem hogy rendszerezze és könnyen áttekinthetővé tegye a vontatáshoz szükséges legfontosabb információkat. Segít átnézni a jogosítványhoz és tömeghatárokhoz kapcsolódó adatokat, végigvezet az indulás előtti ellenőrzéseken, és összefoglalja az egyes országok fontosabb vontatási szabályait.</p>
          <p>Olyan, mint egy digitális gyorstalpaló, amit akkor is elő lehet venni, ha utoljára tegnap vontattál — és akkor is, ha már egy éve.</p>
        </div>
      </section>

      <section className="project-creator page-width">
        <div className="project-creator__content">
          <span className="kicker">A KÉSZÍTŐ</span>
          <h2>KI KÉSZÍTI?</h2>
          <div className="project-copy">
            <p>Soós Dani vagyok, szoftverfejlesztő, jelenleg pedig gépjármű-mechatronikai technikusnak tanulok.</p>
            <p>A READY2TOW-ban két olyan területet kötök össze, amelyek külön-külön is közel állnak hozzám: a szoftverfejlesztést és az autótechnikát. Szeretem azokat a projekteket, ahol a technológia nem önmagáért létezik, hanem egy valódi, hétköznapi problémát tesz egyszerűbbé.</p>
            <p>A vontatás is érdekel, viszont jelenleg nincs saját utánfutóm vagy olyan vállalkozásom, ami miatt rendszeresen vontatnék. Én is főleg alkalomszerűen, magáncélra használok utánfutót, amikor éppen szükség van rá.</p>
            <p>És tulajdonképpen pontosan innen jött a READY2TOW ötlete.</p>
            <p>Ha valamit csak időnként csinálsz, könnyű elfelejteni azokat a részleteket, amelyek napi használat mellett természetesek lennének. Ilyenkor jól jön egy hely, ahol nem kell hosszasan keresgélni, hanem néhány perc alatt újra át lehet venni a legfontosabbakat, ellenőrizni a szerelvényt, majd nyugodtabban elindulni.</p>
            <p>A READY2TOW ennek a problémának az én megoldásom.</p>
          </div>
        </div>

        <div className="project-creator__aside">
          <figure className="project-creator__image">
            <img src="https://danielsoos.eu/images/profile/me2.JPG" alt="Soós Dániel, a READY2TOW készítője" loading="lazy" />
          </figure>
          <div className="creator-signature">
            <strong>SOÓS DÁNIEL</strong>
            <span>Software Developer</span>
            <span>Gépjármű-mechatronikai technikus tanuló</span>
            <a href="https://danielsoos.eu" target="_blank" rel="noreferrer">danielsoos.eu ↗</a>
          </div>
        </div>
      </section>
    </div>
  )
}
