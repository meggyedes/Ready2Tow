export type HungarianRule = {
  id: string
  category: string
  title: string
  content: string
  important?: boolean
}

export const hungarianRules: HungarianRule[] = [
  { id: 'hu-speed-urban', category: 'Sebességhatárok', title: 'Lakott területen: 50 km/h', content: 'Személygépkocsiból és pótkocsiból álló járműszerelvénnyel lakott területen legfeljebb 50 km/h sebességgel szabad közlekedni.', important: true },
  { id: 'hu-speed-road', category: 'Sebességhatárok', title: 'Lakott területen kívül és autóúton: 70 km/h', content: 'Lakott területen kívül és autóúton a járműszerelvény megengedett legnagyobb sebessége 70 km/h.', important: true },
  { id: 'hu-speed-motorway', category: 'Sebességhatárok', title: 'Autópályán: 80 km/h', content: 'Pótkocsis járműszerelvénnyel autópályán is legfeljebb 80 km/h a megengedett sebesség. A magasabb értéket mutató jelzés ezt nem írja felül.', important: true },
  { id: 'hu-speed-safe', category: 'Sebességhatárok', title: 'A körülményekhez igazított sebesség', content: 'A határértéken belül is úgy válaszd meg a sebességet, hogy a szerelvény az út-, forgalmi-, látási- és időjárási viszonyok között biztonságosan megállítható legyen.' },

  { id: 'hu-trailer-light', category: 'Jogosítvány és tömeg', title: 'Könnyű pótkocsi', content: 'Könnyű pótkocsi az, amelynek megengedett legnagyobb össztömege legfeljebb 750 kg. A kategória megállapításánál nem a pillanatnyi tényleges tömeg, hanem a megengedett legnagyobb össztömeg számít.', important: true },
  { id: 'hu-trailer-heavy', category: 'Jogosítvány és tömeg', title: 'Nehéz pótkocsi', content: 'Nehéz pótkocsi az, amelynek megengedett legnagyobb össztömege 750 kg-nál nagyobb.' },
  { id: 'hu-license-b-light', category: 'Jogosítvány és tömeg', title: 'B kategória + könnyű pótkocsi', content: 'B kategóriával legfeljebb 3500 kg megengedett legnagyobb össztömegű gépkocsi vezethető, amelyhez legfeljebb 750 kg-os könnyű pótkocsi kapcsolható. Az együttes megengedett legnagyobb össztömeg így legfeljebb 4250 kg lehet.', important: true },
  { id: 'hu-license-b-heavy', category: 'Jogosítvány és tömeg', title: 'B kategória + 750 kg feletti pótkocsi', content: 'Nehéz pótkocsi B kategóriával akkor vontatható, ha a szerelvény megengedett legnagyobb együttes össztömege legfeljebb 3500 kg, és a pótkocsi megengedett legnagyobb össztömege nem haladja meg a vontató saját tömegét.', important: true },
  { id: 'hu-license-b96', category: 'Jogosítvány és tömeg', title: 'B96 jogosultság', content: 'A B96 a B kategóriához kapcsolódó jogosultság. 750 kg-nál nagyobb pótkocsival olyan szerelvény vezethető vele, amelynek megengedett legnagyobb együttes össztömege 3500 kg felett, de legfeljebb 4250 kg.', important: true },
  { id: 'hu-license-be', category: 'Jogosítvány és tömeg', title: 'BE kategória', content: 'BE kategóriával B kategóriás vontatójárműhöz legfeljebb 3500 kg megengedett legnagyobb össztömegű pótkocsi vagy félpótkocsi kapcsolható. Ettől még a konkrét autó műszaki vontatási határértékeit be kell tartani.', important: true },
  { id: 'hu-license-new', category: 'Jogosítvány és tömeg', title: 'Kezdő vezetői engedély', content: 'Az első nemzetközi vezetői kategória megszerzésétől számított első két évben a vezetői engedély kezdőnek minősül. Kezdő vezetői engedéllyel B kategóriás jogosultsággal pótkocsi nem vontatható.', important: true },
  { id: 'hu-license-not-enough', category: 'Jogosítvány és tömeg', title: 'A jogosítvány önmagában nem elég', content: 'Külön ellenőrizd, hogy a jogosítvány engedi-e a szerelvényt, és hogy a vontató jármű műszakilag vontathatja-e a pótkocsit. A BE kategória nem növeli meg az autó határértékeit.', important: true },

  { id: 'hu-doc-car', category: 'Okmányok és műszaki adatok', title: 'A vontató forgalmi engedélye', content: 'Ellenőrizd a saját tömeget, a megengedett legnagyobb össztömeget, valamint a vontatható fékezett és fékezetlen pótkocsi tömegét.' },
  { id: 'hu-doc-trailer', category: 'Okmányok és műszaki adatok', title: 'A pótkocsi forgalmi engedélye', content: 'Ellenőrizd a pótkocsi saját tömegét és megengedett legnagyobb össztömegét. Mindig a konkrét járművek okmányaiból indulj ki.' },
  { id: 'hu-approved', category: 'Okmányok és műszaki adatok', title: 'Csak engedélyezett pótkocsi vontatható', content: 'A vonóhorog megléte önmagában nem elég. Csak olyan pótkocsi vontatható, amelynek vontatását a vontató jármű hatósági engedélye lehetővé teszi.', important: true },

  { id: 'hu-load', category: 'Rakomány és méretek', title: 'Rakomány elhelyezése és rögzítése', content: 'A rakomány nem veszélyeztetheti a közlekedést, nem ronthatja számottevően a stabilitást, nem csúszhat el, nem eshet vagy szóródhat le. Kerüld a túlzottan hátul elhelyezett rakományt.' },
  { id: 'hu-overhang', category: 'Rakomány és méretek', title: 'Túlnyúló rakomány jelölése', content: 'A szabályosan túlnyúló rakományt nappal legalább 40 × 40 cm-es piros vagy piros-fehér csíkos zászlóval vagy táblával kell jelölni. Éjszaka és korlátozott látásnál további fényjelzések szükségesek.' },
  { id: 'hu-height', category: 'Rakomány és méretek', title: 'Legnagyobb magasság: 4 méter', content: 'A rakomány magassága a járművel együtt főszabály szerint nem haladhatja meg a 4 métert. Figyelj a hidakra, alagutakra, kapukra és magasságkorlátozásokra.', important: true },
  { id: 'hu-signs', category: 'Rakomány és méretek', title: 'Korlátozó táblák', content: 'Figyeld a magasság-, szélesség-, hosszúság-, súly- és tengelyterhelés-korlátozást, valamint a járműszerelvényre vonatkozó behajtási tilalmat. A teljes szerelvény adatai számítanak.' },

  { id: 'hu-distance', category: 'Közlekedés és manőverezés', title: 'Nagyobb követési távolság', content: 'A nagyobb tömeg hosszabb fékutat és eltérő reakciókat jelent. 3500 kg megengedett együttes tömeg vagy 7 méter hossz felett lakott területen kívül főszabály szerint hagyj helyet egy előző személyautó biztonságos besorolásához; a szabálynak vannak kivételei.' },
  { id: 'hu-motorway-capable', category: 'Közlekedés és manőverezés', title: 'Autópályára és autóútra felhajtás', content: 'Csak olyan gépjárműből és pótkocsiból álló szerelvénnyel hajthatsz fel, amely sík úton legalább 60 km/h sebesség elérésére képes.' },
  { id: 'hu-reverse', category: 'Közlekedés és manőverezés', title: 'Hátramenet trailerrel', content: 'Hátramenettel más közlekedőt nem veszélyeztethetsz. Ha a biztonság megkívánja, kérj olyan irányító személyt, aki látja a jármű mögötti területet és kapcsolatban van veled.' },
  { id: 'hu-stability', category: 'Közlekedés és manőverezés', title: 'Menetstabilitás', content: 'Kerüld a hirtelen kormányzást, fékezést, sávváltást és gyors kanyarodást. Lengésnél ne ránts a kormányon: kontrolláltan csökkentsd a sebességet, majd biztonságos helyen ellenőrizd a szerelvényt.' },

  { id: 'hu-lights', category: 'Indulás előtti műszaki ellenőrzés', title: 'Világítás és láthatóság', content: 'Ellenőrizd a helyzetjelzőket, féklámpákat, irányjelzőket, rendszámvilágítást, ködlámpát és fényvisszaverőket. A rakomány sem takarhatja el ezeket.' },
  { id: 'hu-coupling', category: 'Indulás előtti műszaki ellenőrzés', title: 'Vonófej és kapcsolószerkezet', content: 'Fizikailag is ellenőrizd a teljes zárást, a biztonsági reteszt, a holtjátékot és a vonóhorog rögzítését. Ne csak vizuálisan ellenőrizz.' },
  { id: 'hu-breakaway', category: 'Indulás előtti műszaki ellenőrzés', title: 'Szakítófék-kábel', content: 'Fékezett pótkocsinál a kábelt az előírt rögzítési ponthoz csatlakoztasd, a jármű, vonóhorog és pótkocsi gyártói előírásai szerint.' },
  { id: 'hu-electric', category: 'Indulás előtti műszaki ellenőrzés', title: 'Elektromos csatlakozó', content: 'A csatlakozó legyen rögzített és sérülésmentes; a kábel ne érjen az úthoz és kanyarodáskor se feszüljön. Ezután végezz teljes világításpróbát.' },
  { id: 'hu-noseweight', category: 'Indulás előtti műszaki ellenőrzés', title: 'Orrterhelés', content: 'A megengedett függőleges terhelést az autó, a vonóhorog és a pótkocsi is korlátozhatja. Mindig a legalacsonyabb megengedett értéken belül maradj.' },
  { id: 'hu-tyres', category: 'Indulás előtti műszaki ellenőrzés', title: 'Gumiabroncsok és kerékrögzítés', content: 'Ellenőrizd a nyomást, futófelületet, sérülést, repedést, öregedést és rendellenes kopást. Hosszabb állás vagy kerékcsere után a kerékrögzítést is ellenőrizd a gyártói nyomaték szerint.' },
  { id: 'hu-mirrors', category: 'Indulás előtti műszaki ellenőrzés', title: 'Tükrök és kilátás', content: 'Ha a jármű saját tükrei nem biztosítanak megfelelő hátralátást a trailer mellett, használj a szerelvényhez megfelelő kiegészítő tükröt.' },

  { id: 'hu-recheck', category: 'Útközben', title: 'Indulás utáni ismételt ellenőrzés', content: 'Az első néhány tíz kilométer után biztonságos helyen ellenőrizd újra a hevedereket, kapcsolószerkezetet, szakítófék-kábelt, elektromos csatlakozót, gumikat, kerekeket, melegedést és a rakomány elmozdulását. Hosszabb úton ismételd meg.', important: true },
]
