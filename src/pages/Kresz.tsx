import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  ChevronDown,
  ChevronUp,
  Gauge,
  Weight,
  Ruler,
  AlertTriangle,
  Shield,
  Car,
  Truck,
  MapPin,
  Package,
} from 'lucide-react'
import 'flag-icons/css/flag-icons.min.css'
import { useLanguage } from '../context/LanguageContext'

interface KreszRule {
  id: string
  category: string
  country?: string
  icon: React.ComponentType<any>
  title: string
  content: string
  important?: boolean
}

// Helper function to get country flag code for flag-icons
const getCountryFlagCode = (country: string): string => {
  const flagCodes: { [key: string]: string } = {
    'Hollandia': 'nl',
    'Németország': 'de',
    'Ausztria': 'at',
    'Svájc': 'ch',
    'Luxemburg': 'lu',
    'Olaszország': 'it',
    'Csehország': 'cz',
    'Lengyelország': 'pl',
    'Szlovákia': 'sk',
  }
  return flagCodes[country] || 'un'
}

const countryLabelsEn: Record<string, string> = {
  'Hollandia': 'Netherlands',
  'Németország': 'Germany',
  'Ausztria': 'Austria',
  'Svájc': 'Switzerland',
  'Luxemburg': 'Luxembourg',
  'Olaszország': 'Italy',
  'Csehország': 'Czechia',
  'Lengyelország': 'Poland',
  'Szlovákia': 'Slovakia',
}

const categoryLabelsEn: Record<string, string> = {
  'Sebességkorlátozások': 'Speed limits',
  'Méretek és Tömegek': 'Dimensions and weights',
  'Előzés': 'Overtaking',
  'Biztonsági Előírások': 'Safety requirements',
  'Rakodás': 'Loading',
  'Parkolás és Megállás': 'Parking and stopping',
  'Tolatás és Kanyarodás': 'Reversing and turning',
  'Dokumentumok': 'Documents',
  'Különleges Helyzetek': 'Special situations',
  'Kötelező Felszerelések': 'Required equipment',
  'Díjak és Úthasználat': 'Road fees and usage',
  'Különleges Szabályok': 'Special rules',
}

const kreszRuleEn: Record<string, { title: string; content: string }> = {
  '1': { title: 'Maximum speed in built-up area', content: 'When towing a trailer in built-up areas, the maximum allowed speed is 50 km/h, even if higher limits apply without a trailer.' },
  '2': { title: 'Maximum speed outside built-up area', content: 'When towing outside built-up areas, the maximum speed is 80 km/h on regular and express roads unless signed otherwise.' },
  '3': { title: 'On motorways', content: 'When towing on motorways, the maximum speed is 80 km/h, which is lower than the limit for passenger cars without trailers.' },
  '4': { title: 'Maximum gross combination mass', content: 'With BE category rules, check towing vehicle and trailer limits so the combination stays within legally permitted gross mass.' },
  '5': { title: 'Maximum length', content: 'The combined car and trailer length must remain within legal limits; verify both total combination and trailer-only values.' },
  '6': { title: 'Maximum width', content: 'Trailer width must stay within legal maximum. Cargo must not protrude beyond the trailer sides.' },
  '7': { title: 'Maximum height', content: 'Total vehicle-trailer-cargo height must not exceed the allowed maximum; check low bridges and restrictions before departure.' },
  '8': { title: 'Overtaking rules', content: 'With a trailer, overtake only when legal and safe, and ensure enough distance and time to complete the maneuver.' },
  '9': { title: 'Overtaking prohibition', content: 'Do not overtake in bends, on hills, near pedestrian crossings, or before railway crossings where overtaking is prohibited.' },
  '10': { title: 'Safety chain/cable', content: 'Attach a safety chain or breakaway cable correctly to prevent complete trailer separation if the main coupling fails.' },
  '11': { title: 'Mirrors', content: 'Use mirrors that provide sufficient rear and side visibility around the trailer; fit extension mirrors when needed.' },
  '12': { title: 'Lighting and signals', content: 'Trailer tail lights, brake lights, indicators, and plate illumination must all function correctly before starting the trip.' },
  '13': { title: 'Cargo securing', content: 'Load must be positioned and secured so it cannot shift, fall, or endanger traffic. Respect overhang limits.' },
  '14': { title: 'Weight distribution', content: 'Distribute load properly for stable axle load and hitch load. Poor balance increases sway and braking risk.' },
  '15': { title: 'Parking rules', content: 'Follow parking restrictions for towing combinations and avoid prohibited zones such as sidewalks and cycle paths.' },
  '16': { title: 'Stopping on slope', content: 'On slopes, secure both towing vehicle and trailer with parking brake and wheel chocks where needed.' },
  '17': { title: 'Reversing', content: 'Reversing with a trailer requires slow steering corrections because trailer direction reacts opposite to steering input.' },
  '18': { title: 'Turning', content: 'Take wider turns with trailers to avoid curb strikes and collisions due to trailer off-tracking.' },
  '19': { title: 'Required documents', content: 'Carry valid driving license, registration, and insurance documents for towing vehicle and trailer at all times.' },
  '20': { title: 'Emergency situation', content: 'In breakdown or emergency, stop safely, place warning triangle at legal distance, and request assistance.' },
  '21': { title: 'Urban speed limit', content: 'In the Netherlands, trailer towing is generally limited to 50 km/h in urban areas, depending on local zone signs.' },
  '22': { title: 'Motorway speed limit', content: 'In the Netherlands, towing speed on motorways is typically limited; check local signs and conditions.' },
  '23': { title: 'Required equipment', content: 'In the Netherlands carry mandatory safety equipment and valid travel documents for all relevant passengers and vehicle class.' },
  '24': { title: 'Road usage fees', content: 'The Netherlands has no general passenger motorway toll, but city parking and specific crossings may be charged.' },
  '25': { title: 'Cyclist lane priority', content: 'In the Netherlands, respect cycle lane priority and visibility; blocking bike lanes can lead to serious penalties.' },
  '26': { title: 'Motorway speed limit', content: 'In Germany, trailer towing speed limits apply by road type; always follow posted limits and trailer regulations.' },
  '27': { title: 'Required equipment', content: 'In Germany keep required warning and safety equipment available, including high-visibility items and legal documents.' },
  '28': { title: 'Road usage fees', content: 'German passenger cars are generally toll-free on Autobahn, while certain heavier categories use toll systems.' },
  '29': { title: 'Lane discipline and overtaking', content: 'In Germany, keep right except when overtaking and return to right lane after overtaking safely.' },
  '30': { title: 'Motorway speed limit', content: 'In Austria, towing limits apply on motorways and regular roads; verify signs and trailer-specific restrictions.' },
  '31': { title: 'Road usage fees - vignette', content: 'Austria requires a valid vignette for motorway use. Select correct duration and keep proof of validity.' },
  '32': { title: 'Required equipment', content: 'In Austria carry legally required safety equipment and documents; requirements may be checked roadside.' },
  '33': { title: 'Winter equipment', content: 'In winter conditions, Austria may require winter tires or chains for towing vehicles and trailers.' },
  '34': { title: 'Motorway speed limit', content: 'In Switzerland, trailer towing speed limits apply by road category; follow posted signs carefully.' },
  '35': { title: 'Road usage fees - vignette', content: 'Switzerland requires a valid motorway vignette; driving without one can result in substantial fines.' },
  '36': { title: 'Required equipment', content: 'In Switzerland keep mandatory safety and travel documents in the vehicle and trailer combination.' },
  '37': { title: 'Mountain roads and tunnel tolls', content: 'Certain Swiss mountain routes and tunnels require extra fees; check planned route costs before travel.' },
  '38': { title: 'Motorway speed limit', content: 'In Luxembourg, towing speed limits vary by road type and signage; verify current legal limits before driving.' },
  '39': { title: 'Road usage fees', content: 'Luxembourg has no standard passenger motorway toll, but local parking and special zones may be charged.' },
  '40': { title: 'Required equipment', content: 'In Luxembourg carry the recommended and mandatory safety equipment and valid driving/travel documents.' },
  '41': { title: 'Motorway speed limit', content: 'In Italy, towing speed limits differ by motorway and secondary roads; always follow posted restrictions.' },
  '42': { title: 'Road usage fees - Autostrada', content: 'Italian motorways are tolled; towing combinations may pay higher category-based fees depending on axle class.' },
  '43': { title: 'Required equipment', content: 'In Italy carry mandatory warning and safety gear, and comply with daytime light requirements where applicable.' },
  '44': { title: 'Daytime lights and enforcement', content: 'Italy enforces speed limits strictly and requires proper lighting use; violations can result in high fines.' },
  '45': { title: 'Motorway speed limit', content: 'In Czechia, towing speed limits are road-type dependent; obey posted limits and trailer restrictions.' },
  '46': { title: 'Road usage fees - vignette', content: 'Czech motorways require a valid vignette. Ensure the registration is valid before entering toll roads.' },
  '47': { title: 'Required equipment', content: 'In Czechia carry mandatory safety equipment and documents, with seasonal winter requirements when applicable.' },
  '48': { title: 'Winter equipment and lights', content: 'Czech winter season rules may require winter tires; daytime lights and speed compliance are enforced.' },
  '49': { title: 'Motorway speed limit', content: 'In Poland, towing speed limits depend on road category and posted signs; verify local limits.' },
  '50': { title: 'Road usage fees', content: 'Poland uses mixed toll systems by section and category; confirm required payment method for your route.' },
  '51': { title: 'Required equipment', content: 'In Poland carry mandatory warning equipment, documents, and comply with daytime lighting requirements.' },
  '52': { title: 'Daytime lights and enforcement', content: 'Poland enforces speed and lighting rules strictly; towing combinations should plan for regular checks.' },
  '53': { title: 'Motorway speed limit', content: 'In Slovakia, towing speed limits vary by road class and signage; follow local legal restrictions.' },
  '54': { title: 'Road usage fees - vignette', content: 'A valid Slovak vignette is required on designated motorways; penalties apply for missing or invalid passes.' },
  '55': { title: 'Required equipment', content: 'In Slovakia carry mandatory safety items and travel documents; seasonal winter rules may also apply.' },
  '56': { title: 'Winter equipment and lights', content: 'In Slovakia, winter tires may be required seasonally and daytime light usage is mandatory in many situations.' },
}

const getCountryLabel = (country: string, language: 'hu' | 'en') => {
  if (language === 'en') {
    return countryLabelsEn[country] ?? country
  }
  return country
}

const Kresz = () => {
  const { language, t } = useLanguage()
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const rules: KreszRule[] = [
    {
      id: '1',
      category: 'Sebességkorlátozások',
      icon: Gauge,
      title: 'Maximális sebesség lakott területen',
      content: 'Pótkocsival vontatva lakott területen belül a megengedett legnagyobb sebesség 50 km/h. Ez alól nincs kivétel, még akkor sem, ha az úton magasabb sebesség lenne megengedett pótkocsi nélkül.',
      important: true,
    },
    {
      id: '2',
      category: 'Sebességkorlátozások',
      icon: Gauge,
      title: 'Maximális sebesség lakott területen kívül',
      content: 'Pótkocsival vontatva lakott területen kívül a megengedett legnagyobb sebesség 80 km/h. Ez vonatkozik az országutakra és a gyorsforgalmi utakra is.',
      important: true,
    },
    {
      id: '3',
      category: 'Sebességkorlátozások',
      icon: Gauge,
      title: 'Autópályán',
      content: 'Pótkocsival vontatva autópályán a megengedett legnagyobb sebesség 80 km/h. Fontos, hogy ez alacsonyabb, mint a pótkocsi nélküli személygépkocsik számára megengedett sebesség.',
      important: true,
    },
    {
      id: '4',
      category: 'Méretek és Tömegek',
      icon: Weight,
      title: 'Maximális össztömeg',
      content: 'BE kategóriás jogosítvánnyal 3500 kg-nál nem nehezebb vontatójárművel, 750 kg-nál nehezebb pótkocsit lehet vontatni, ha a szerelvény össztömege nem haladja meg a 4250 kg-ot. Ha a pótkocsi 750 kg-nál könnyebb, akkor a szerelvény össztömege akár 4250 kg is lehet.',
      important: true,
    },
    {
      id: '5',
      category: 'Méretek és Tömegek',
      icon: Ruler,
      title: 'Maximális hossz',
      content: 'A személygépkocsi és pótkocsi együttes hossza nem haladhatja meg a 18 métert. A pótkocsi önmagában maximum 12 méter hosszú lehet.',
    },
    {
      id: '6',
      category: 'Méretek és Tömegek',
      icon: Ruler,
      title: 'Maximális szélesség',
      content: 'A pótkocsi szélessége nem haladhatja meg a 2,55 métert. A rakomány nem lóghat ki a pótkocsi oldalából.',
    },
    {
      id: '7',
      category: 'Méretek és Tömegek',
      icon: Ruler,
      title: 'Maximális magasság',
      content: 'A szerelvény teljes magassága (vontatójármű + pótkocsi + rakomány) nem haladhatja meg a 4 métert.',
    },
    {
      id: '8',
      category: 'Előzés',
      icon: Car,
      title: 'Előzési szabályok',
      content: 'Pótkocsival vontatva autópályán és autóúton tilos a 3500 kg-nál nehezebb járműveket előzni. Lakott területen kívül kétirányú forgalmú úton csak akkor szabad előzni, ha az előzés biztonságosan befejezhető.',
      important: true,
    },
    {
      id: '9',
      category: 'Előzés',
      icon: AlertTriangle,
      title: 'Előzési tilalom',
      content: 'Tilos az előzés kanyarban, emelkedőn, gyalogátkelőhelyen és azok előtt 50 méteren belül, valamint vasúti átjáró előtt 100 méteren belül.',
    },
    {
      id: '10',
      category: 'Biztonsági Előírások',
      icon: Shield,
      title: 'Biztonsági lánc/kábel',
      content: 'A pótkocsit biztonsági lánccal vagy kábellel kell a vontatójárműhöz rögzíteni. Ez megakadályozza, hogy a pótkocsi teljesen leváljon, ha a fő csatlakozás meghibásodik.',
      important: true,
    },
    {
      id: '11',
      category: 'Biztonsági Előírások',
      icon: Shield,
      title: 'Tükrök',
      content: 'A vontatójárműnek olyan külső visszapillantó tükrökkel kell rendelkeznie, amelyek lehetővé teszik a pótkocsi mögötti és melletti terület megfigyelését. Ha szükséges, pótlólagos tükröket kell felszerelni.',
      important: true,
    },
    {
      id: '12',
      category: 'Biztonsági Előírások',
      icon: AlertTriangle,
      title: 'Világítás és jelzések',
      content: 'A pótkocsit megfelelő világítással kell ellátni: hátsó lámpák, féklámpák, irányjelzők, rendszámtábla-világítás. Minden lámpának működnie kell az indulás előtt.',
      important: true,
    },
    {
      id: '13',
      category: 'Rakodás',
      icon: Package,
      title: 'Rakomány rögzítése',
      content: 'A rakományt úgy kell elhelyezni és rögzíteni, hogy az ne mozdulhasson el, ne eshessen le, és ne veszélyeztesse a közlekedés biztonságát. A rakomány nem lóghat túl a pótkocsi végén 1 méternél többet.',
      important: true,
    },
    {
      id: '14',
      category: 'Rakodás',
      icon: Weight,
      title: 'Súlyelosztás',
      content: 'A rakomány súlyát úgy kell elosztani, hogy a pótkocsi tengelyterhelése megfelelő legyen. Általános szabály: a súly 60%-a legyen a pótkocsi elején, 40%-a hátul. A vonóhorogra eső terhelés 50-100 kg között legyen.',
    },
    {
      id: '15',
      category: 'Parkolás és Megállás',
      icon: MapPin,
      title: 'Parkolási szabályok',
      content: 'Pótkocsival vontatva tilos parkolni a járdán, gyalogúton, kerékpárúton. Lakott területen kívül a pótkocsi leválasztva csak kijelölt helyen hagyható.',
    },
    {
      id: '16',
      category: 'Parkolás és Megállás',
      icon: MapPin,
      title: 'Megállás lejtőn',
      content: 'Lejtőn vagy emelkedőn megállva a járművet rögzítőfékkel kell biztosítani, és a kerekek alá ékeket kell helyezni. A pótkocsit is rögzíteni kell.',
    },
    {
      id: '17',
      category: 'Tolatás és Kanyarodás',
      icon: Truck,
      title: 'Tolatás',
      content: 'Pótkocsival tolatni nehezebb, mert a pótkocsi ellenkező irányba fordul, mint a kormány. Lassan, óvatosan kell tolatni, és ha szükséges, segítőt kell kérni.',
    },
    {
      id: '18',
      category: 'Tolatás és Kanyarodás',
      icon: Truck,
      title: 'Kanyarodás',
      content: 'Kanyarodáskor figyelembe kell venni a pótkocsi nagyobb ívét. Éles kanyarban a pótkocsit szélesebb ívben kell vezetni, hogy ne menjen fel a járdára vagy ne ütközzön akadályba.',
    },
    {
      id: '19',
      category: 'Dokumentumok',
      icon: Shield,
      title: 'Szükséges dokumentumok',
      content: 'BE kategóriás jogosítvány, a vontatójármű és a pótkocsi forgalmi engedélye, érvényes kötelező biztosítás mindkét járműre. Ezeket mindig magaddal kell vinni.',
      important: true,
    },
    {
      id: '20',
      category: 'Különleges Helyzetek',
      icon: AlertTriangle,
      title: 'Vészhelyzet',
      content: 'Vészhelyzet esetén (pl. defekt, műszaki hiba) a szerelvényt biztonságos helyre kell állítani, figyelmeztető háromszöget kell kihelyezni (50 m-re lakott területen kívül, 100 m-re autópályán), és segítséget kell hívni.',
    },

    // ===== NEMZETKÖZI KÖZLEKEDÉSI SZABÁLYOK =====

    // HOLLANDIA
    {
      id: '21',
      country: 'Hollandia',
      category: 'Sebességkorlátozások',
      icon: Gauge,
      title: 'Maximális sebesség lakott területen',
      content: 'Hollandiában pótkocsival vontatva lakott területen (30 km/h vagy 50 km/h zónában) a megengedett sebesség 50 km/h. Az autópályákon (snelwegen) a maximális sebesség 100 km/h pótkocsival.',
      important: true,
    },
    {
      id: '22',
      country: 'Hollandia',
      category: 'Sebességkorlátozások',
      icon: Gauge,
      title: 'Autópálya sebességkorlátozás',
      content: 'Hollandiában az autópályákon pótkocsival a maximális sebesség 100 km/h. Éjszaka (22:00-06:00) és rossz időben a sebesség még alacsonyabb lehet.',
      important: true,
    },
    {
      id: '23',
      country: 'Hollandia',
      category: 'Kötelező Felszerelések',
      icon: Shield,
      title: 'Kötelező felszerelések',
      content: 'Hollandiában kötelező: sárga mellény (minden utasnak), figyelmeztető háromszög, tartalék izzók, biztosítékok, első és hátsó ködlámpa, valamint nemzetközi útlevél vagy személyi igazolvány.',
      important: true,
    },
    {
      id: '24',
      country: 'Hollandia',
      category: 'Díjak és Úthasználat',
      icon: MapPin,
      title: 'Úthasználati díjak',
      content: 'Hollandiában nincs úthasználati díj az autópályákon. Az ország díjmentes közlekedésre. Azonban a parkolás városokban drága lehet.',
    },
    {
      id: '25',
      country: 'Hollandia',
      category: 'Különleges Szabályok',
      icon: AlertTriangle,
      title: 'Kerékpáros sávok',
      content: 'Hollandiában nagyon fontos a kerékpáros sávok tiszteletben tartása. Tilos a kerékpáros sávba parkolni vagy abban közlekedni. A kerékpárosok jogai nagyon erősek.',
    },

    // NÉMETORSZÁG
    {
      id: '26',
      country: 'Németország',
      category: 'Sebességkorlátozások',
      icon: Gauge,
      title: 'Autópálya sebességkorlátozás',
      content: 'Németországban az autópályákon (Autobahn) pótkocsival a megengedett sebesség 100 km/h. Lakott területen kívül 80 km/h, lakott területen 50 km/h.',
      important: true,
    },
    {
      id: '27',
      country: 'Németország',
      category: 'Kötelező Felszerelések',
      icon: Shield,
      title: 'Kötelező felszerelések',
      content: 'Németországban kötelező: sárga mellény (minden utasnak), figyelmeztető háromszög (2 db), tartalék izzók, biztosítékok, első és hátsó ködlámpa, valamint nemzetközi útlevél.',
      important: true,
    },
    {
      id: '28',
      country: 'Németország',
      category: 'Díjak és Úthasználat',
      icon: MapPin,
      title: 'Úthasználati díjak',
      content: 'Németországban az autópályákon (Autobahn) nincs úthasználati díj személygépkocsiknak. Azonban nagyobb járműveknek (3,5 t felett) Maut díjat kell fizetni elektronikus rendszeren keresztül.',
    },
    {
      id: '29',
      country: 'Németország',
      category: 'Különleges Szabályok',
      icon: AlertTriangle,
      title: 'Jobboldali közlekedés és előzés',
      content: 'Németországban szigorú az előzési szabály: csak balról szabad előzni. Az autópályákon a jobb sáv a normál közlekedésé, a bal sáv az előzésé. Az előzés után vissza kell térni a jobb sávra.',
      important: true,
    },

    // AUSZTRIA
    {
      id: '30',
      country: 'Ausztria',
      category: 'Sebességkorlátozások',
      icon: Gauge,
      title: 'Autópálya sebességkorlátozás',
      content: 'Ausztriában az autópályákon (Autobahn) pótkocsival a megengedett sebesség 100 km/h. Lakott területen kívül 80 km/h, lakott területen 50 km/h.',
      important: true,
    },
    {
      id: '31',
      country: 'Ausztria',
      category: 'Díjak és Úthasználat',
      icon: MapPin,
      title: 'Úthasználati díjak - Vignetta',
      content: 'Ausztriában kötelező a vignetta (matrica) az autópályákon. 10 napos, 2 hónapos vagy éves vignetta érhető el. A vignetta nélküli közlekedés magas bírságot von maga után. Pótkocsival is szükséges!',
      important: true,
    },
    {
      id: '32',
      country: 'Ausztria',
      category: 'Kötelező Felszerelések',
      icon: Shield,
      title: 'Kötelező felszerelések',
      content: 'Ausztriában kötelező: sárga mellény (minden utasnak), figyelmeztető háromszög, tartalék izzók, biztosítékok, első és hátsó ködlámpa, valamint nemzetközi útlevél.',
      important: true,
    },
    {
      id: '33',
      country: 'Ausztria',
      category: 'Különleges Szabályok',
      icon: AlertTriangle,
      title: 'Téli felszerelés',
      content: 'Ausztriában november 1-től április 15-ig kötelező a téli gumi vagy lánc, ha hó vagy jég van az úton. A pótkocsit is fel kell szerelni téli gumikkal vagy lánccal.',
    },

    // SVÁJC
    {
      id: '34',
      country: 'Svájc',
      category: 'Sebességkorlátozások',
      icon: Gauge,
      title: 'Autópálya sebességkorlátozás',
      content: 'Svájcban az autópályákon (Autobahn) pótkocsival a megengedett sebesség 100 km/h. Lakott területen kívül 80 km/h, lakott területen 50 km/h.',
      important: true,
    },
    {
      id: '35',
      country: 'Svájc',
      category: 'Díjak és Úthasználat',
      icon: MapPin,
      title: 'Úthasználati díjak - Vignetta',
      content: 'Svájcban kötelező a vignetta (matrica) az autópályákon. Éves vignetta szükséges, amely december 31-ig érvényes. A vignetta nélküli közlekedés magas bírságot von maga után. Pótkocsival is szükséges!',
      important: true,
    },
    {
      id: '36',
      country: 'Svájc',
      category: 'Kötelező Felszerelések',
      icon: Shield,
      title: 'Kötelező felszerelések',
      content: 'Svájcban kötelező: sárga mellény (minden utasnak), figyelmeztető háromszög, tartalék izzók, biztosítékok, valamint nemzetközi útlevél. Téli időszakban téli gumi vagy lánc kötelező.',
      important: true,
    },
    {
      id: '37',
      country: 'Svájc',
      category: 'Különleges Szabályok',
      icon: AlertTriangle,
      title: 'Hegyi utak és alagút díjak',
      content: 'Svájcban egyes hegyi utak és alagutak (pl. San Gotthard) díjasak. A díjat előre vagy az alagút előtt kell megfizetni. Pótkocsival is fizetni kell.',
    },

    // LUXEMBURG
    {
      id: '38',
      country: 'Luxemburg',
      category: 'Sebességkorlátozások',
      icon: Gauge,
      title: 'Autópálya sebességkorlátozás',
      content: 'Luxemburgban az autópályákon pótkocsival a megengedett sebesség 90 km/h. Lakott területen kívül 90 km/h, lakott területen 50 km/h.',
      important: true,
    },
    {
      id: '39',
      country: 'Luxemburg',
      category: 'Díjak és Úthasználat',
      icon: MapPin,
      title: 'Úthasználati díjak',
      content: 'Luxemburgban nincs úthasználati díj az autópályákon. Az ország díjmentes közlekedésre. Azonban a parkolás városokban drága lehet.',
    },
    {
      id: '40',
      country: 'Luxemburg',
      category: 'Kötelező Felszerelések',
      icon: Shield,
      title: 'Kötelező felszerelések',
      content: 'Luxemburgban kötelező: sárga mellény (minden utasnak), figyelmeztető háromszög, tartalék izzók, biztosítékok, valamint nemzetközi útlevél.',
    },

    // OLASZORSZÁG
    {
      id: '41',
      country: 'Olaszország',
      category: 'Sebességkorlátozások',
      icon: Gauge,
      title: 'Autópálya sebességkorlátozás',
      content: 'Olaszországban az autópályákon (Autostrada) pótkocsival a megengedett sebesség 100 km/h. Lakott területen kívül 90 km/h, lakott területen 50 km/h.',
      important: true,
    },
    {
      id: '42',
      country: 'Olaszország',
      category: 'Díjak és Úthasználat',
      icon: MapPin,
      title: 'Úthasználati díjak - Autostrada',
      content: 'Olaszországban az autópályákon (Autostrada) úthasználati díjat kell fizetni. A díj a távolság és a jármű kategóriája alapján számítódik. Pótkocsival magasabb díj. Elektronikus vagy készpénz fizetés lehetséges.',
      important: true,
    },
    {
      id: '43',
      country: 'Olaszország',
      category: 'Kötelező Felszerelések',
      icon: Shield,
      title: 'Kötelező felszerelések',
      content: 'Olaszországban kötelező: sárga mellény (minden utasnak), figyelmeztető háromszög, tartalék izzók, biztosítékok, valamint nemzetközi útlevél. Nappali világítás is kötelező.',
      important: true,
    },
    {
      id: '44',
      country: 'Olaszország',
      category: 'Különleges Szabályok',
      icon: AlertTriangle,
      title: 'Nappali világítás és sebességmérés',
      content: 'Olaszországban kötelező a nappali világítás (dipped headlights). Szigorú sebességmérés van, különösen az autópályákon. A sebességtúllépés magas bírságot von maga után.',
    },

    // CSEHORSZÁG
    {
      id: '45',
      country: 'Csehország',
      category: 'Sebességkorlátozások',
      icon: Gauge,
      title: 'Autópálya sebességkorlátozás',
      content: 'Csehországban az autópályákon (Dálnice) pótkocsival a megengedett sebesség 100 km/h. Lakott területen kívül 90 km/h, lakott területen 50 km/h.',
      important: true,
    },
    {
      id: '46',
      country: 'Csehország',
      category: 'Díjak és Úthasználat',
      icon: MapPin,
      title: 'Úthasználati díjak - Matrica',
      content: 'Csehországban kötelező a matrica (dálniční známka) az autópályákon. 10 napos, 30 napos vagy éves matrica érhető el. A matrica nélküli közlekedés magas bírságot von maga után. Pótkocsival is szükséges!',
      important: true,
    },
    {
      id: '47',
      country: 'Csehország',
      category: 'Kötelező Felszerelések',
      icon: Shield,
      title: 'Kötelező felszerelések',
      content: 'Csehországban kötelező: sárga mellény (minden utasnak), figyelmeztető háromszög, tartalék izzók, biztosítékok, valamint nemzetközi útlevél. Téli időszakban téli gumi kötelező.',
      important: true,
    },
    {
      id: '48',
      country: 'Csehország',
      category: 'Különleges Szabályok',
      icon: AlertTriangle,
      title: 'Téli felszerelés és fényszóró',
      content: 'Csehországban november 1-től március 31-ig kötelező a téli gumi. Nappali világítás (dipped headlights) is kötelező. Az autópályákon szigorú sebességmérés van.',
    },

    // LENGYELORSZÁG
    {
      id: '49',
      country: 'Lengyelország',
      category: 'Sebességkorlátozások',
      icon: Gauge,
      title: 'Autópálya sebességkorlátozás',
      content: 'Lengyelországban az autópályákon (Autostrada) pótkocsival a megengedett sebesség 100 km/h. Lakott területen kívül 90 km/h, lakott területen 50 km/h.',
      important: true,
    },
    {
      id: '50',
      country: 'Lengyelország',
      category: 'Díjak és Úthasználat',
      icon: MapPin,
      title: 'Úthasználati díjak - Matrica',
      content: 'Lengyelországban kötelező a matrica (nalepka) az autópályákon. 10 napos, 30 napos vagy éves matrica érhető el. A matrica nélküli közlekedés magas bírságot von maga után. Pótkocsival is szükséges!',
      important: true,
    },
    {
      id: '51',
      country: 'Lengyelország',
      category: 'Kötelező Felszerelések',
      icon: Shield,
      title: 'Kötelező felszerelések',
      content: 'Lengyelországban kötelező: sárga mellény (minden utasnak), figyelmeztető háromszög, tartalék izzók, biztosítékok, valamint nemzetközi útlevél. Nappali világítás is kötelező.',
      important: true,
    },
    {
      id: '52',
      country: 'Lengyelország',
      category: 'Különleges Szabályok',
      icon: AlertTriangle,
      title: 'Nappali világítás és sebességmérés',
      content: 'Lengyelországban kötelező a nappali világítás (dipped headlights). Szigorú sebességmérés van, különösen az autópályákon. A sebességtúllépés magas bírságot von maga után.',
    },

    // SZLOVÁKIA
    {
      id: '53',
      country: 'Szlovákia',
      category: 'Sebességkorlátozások',
      icon: Gauge,
      title: 'Autópálya sebességkorlátozás',
      content: 'Szlovákiában az autópályákon (Diaľnica) pótkocsival a megengedett sebesség 100 km/h. Lakott területen kívül 90 km/h, lakott területen 50 km/h.',
      important: true,
    },
    {
      id: '54',
      country: 'Szlovákia',
      category: 'Díjak és Úthasználat',
      icon: MapPin,
      title: 'Úthasználati díjak - Matrica',
      content: 'Szlovákiában kötelező a matrica (známka) az autópályákon. 10 napos, 30 napos vagy éves matrica érhető el. A matrica nélküli közlekedés magas bírságot von maga után. Pótkocsival is szükséges!',
      important: true,
    },
    {
      id: '55',
      country: 'Szlovákia',
      category: 'Kötelező Felszerelések',
      icon: Shield,
      title: 'Kötelező felszerelések',
      content: 'Szlovákiában kötelező: sárga mellény (minden utasnak), figyelmeztető háromszög, tartalék izzók, biztosítékok, valamint nemzetközi útlevél. Téli időszakban téli gumi kötelező.',
      important: true,
    },
    {
      id: '56',
      country: 'Szlovákia',
      category: 'Különleges Szabályok',
      icon: AlertTriangle,
      title: 'Téli felszerelés és fényszóró',
      content: 'Szlovákiában november 15-től március 15-ig kötelező a téli gumi. Nappali világítás (dipped headlights) is kötelező. Az autópályákon szigorú sebességmérés van.',
    },
  ]

  const localizedRules = useMemo(() => {
    if (language !== 'en') {
      return rules
    }

    return rules.map((rule) => ({
      ...rule,
      category: categoryLabelsEn[rule.category] ?? rule.category,
      title: kreszRuleEn[rule.id]?.title ?? rule.title,
      content: kreszRuleEn[rule.id]?.content ?? rule.content,
    }))
  }, [language, rules])

  // Memoize filtered rules to avoid recalculating on every render
  const filteredRules = useMemo(() => {
    const lowerSearch = searchTerm.toLowerCase()
    return localizedRules.filter(
      rule =>
        rule.title.toLowerCase().includes(lowerSearch) ||
        rule.content.toLowerCase().includes(lowerSearch) ||
        rule.category.toLowerCase().includes(lowerSearch) ||
        (rule.country && getCountryLabel(rule.country, language).toLowerCase().includes(lowerSearch))
    )
  }, [language, localizedRules, searchTerm])

  // Separate Hungarian and International rules
  const hungarianRules = useMemo(
    () => filteredRules.filter(rule => !rule.country),
    [filteredRules]
  )

  const internationalRules = useMemo(
    () => filteredRules.filter(rule => rule.country),
    [filteredRules]
  )

  // Get unique countries from international rules
  const countries = useMemo(
    () => Array.from(new Set(internationalRules.map(rule => rule.country).filter((c): c is string => Boolean(c)))).sort(),
    [internationalRules]
  )

  // Memoize categories extraction for Hungarian rules
  const hungarianCategories = useMemo(
    () => Array.from(new Set(hungarianRules.map(rule => rule.category))),
    [hungarianRules]
  )

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          {t('rules.title')}
        </h2>
        <p className="text-gray-600">
          {t('rules.subtitle')}
        </p>
        {language === 'en' && (
          <p className="text-xs text-blue-700 mt-2">{t('rules.englishNote')}</p>
        )}
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card mb-6"
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder={t('rules.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
          />
        </div>
      </motion.div>

      {/* Hungarian Rules Section */}
      {hungarianRules.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
            <div className="fib fi-hu" style={{ width: '32px', height: '24px' }}></div>
            {t('rules.hungary')}
          </h2>

          {hungarianCategories.map((category, categoryIndex) => {
            const categoryRules = hungarianRules.filter(rule => rule.category === category)

            if (categoryRules.length === 0) return null

            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: categoryIndex * 0.05 }}
                className="mb-4"
              >
                <h3 className="text-lg font-semibold text-gray-700 mb-2 pt-2 flex items-center">

                  {category}
                </h3>
                <div className="space-y-2">
                  {categoryRules.map((rule, index) => (
                <motion.div
                  key={rule.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`card cursor-pointer transition-all duration-300 hover:shadow-xl border-l-4 ${
                    rule.important ? 'border-orange-500' : 'border-blue-500'
                  }`}
                  onClick={() => toggleExpand(rule.id)}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        rule.important
                          ? 'bg-gradient-to-br from-orange-500 to-red-500'
                          : 'bg-gradient-to-br from-blue-500 to-cyan-500'
                      }`}>
                        <rule.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                          {rule.title}
                          {rule.important && (
                            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-medium">
                              {t('rules.important')}
                            </span>
                          )}
                        </h4>
                        <motion.div
                          animate={{ rotate: expandedId === rule.id ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          {expandedId === rule.id ? (
                            <ChevronUp className="w-5 h-5 text-gray-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          )}
                        </motion.div>
                      </div>
                      <AnimatePresence>
                        {expandedId === rule.id && (
                          <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="text-sm text-gray-600 mt-2 leading-relaxed"
                          >
                            {rule.content}
                          </motion.p>
                        )}
                      </AnimatePresence>
                      {expandedId !== rule.id && (
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {rule.content}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      )}

      {/* International Rules Section */}
      {countries.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">{t('rules.international')}
          </h2>

          {countries.map((country, countryIndex) => {
            const countryRules = internationalRules.filter(rule => rule.country === country)

            if (countryRules.length === 0) return null

            return (
              <motion.div
                key={country}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + countryIndex * 0.1 }}
                className="mb-6"
              >
                <h3 className="text-lg font-bold text-gray-800 mb-3 pt-4 flex items-center gap-3">
                  <div className={`fib fi-${getCountryFlagCode(country)}`} style={{ width: '32px', height: '24px' }}></div>
                  {getCountryLabel(country, language)}
                </h3>
                <div className="space-y-2">
                  {countryRules.map((rule, index) => (
                    <motion.div
                      key={rule.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + countryIndex * 0.1 + index * 0.05 }}
                      className={`card cursor-pointer transition-all duration-300 hover:shadow-xl border-l-4 ${
                        rule.important ? 'border-orange-500' : 'border-green-500'
                      }`}
                      onClick={() => toggleExpand(rule.id)}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            rule.important
                              ? 'bg-gradient-to-br from-orange-500 to-red-500'
                              : 'bg-gradient-to-br from-green-500 to-emerald-500'
                          }`}>
                            <rule.icon className="w-6 h-6 text-white" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                              {rule.title}
                              {rule.important && (
                                <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-medium">
                                  {t('rules.important')}
                                </span>
                              )}
                            </h4>
                            <motion.div
                              animate={{ rotate: expandedId === rule.id ? 180 : 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              {expandedId === rule.id ? (
                                <ChevronUp className="w-5 h-5 text-gray-400" />
                              ) : (
                                <ChevronDown className="w-5 h-5 text-gray-400" />
                              )}
                            </motion.div>
                          </div>
                          <AnimatePresence>
                            {expandedId === rule.id && (
                              <motion.p
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="text-sm text-gray-600 mt-2 leading-relaxed"
                              >
                                {rule.content}
                              </motion.p>
                            )}
                          </AnimatePresence>
                          {expandedId !== rule.id && (
                            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                              {rule.content}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      )}

      {filteredRules.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card text-center py-12"
        >
          <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">
            {t('rules.emptyTitle')}
          </p>
          <p className="text-gray-400 text-sm mt-2">
            {t('rules.emptySubtitle')}
          </p>
        </motion.div>
      )}

      {/* Bottom Spacing for Navigation */}
      <div className="h-8"></div>
    </div>
  )
}

export default Kresz

