import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckCircle2,
  Circle,
  RotateCcw,
  AlertTriangle,
  Lightbulb,
  Link2 as LinkIcon,
  Eye,
  Gauge,
  Shield,
  Package,
  Wrench,
  FileCheck,
  Droplet,
  LifeBuoy,
  Hammer,
  ClipboardCheck,
  Battery,
  Settings,
  Disc,
  Anchor,
  FlameKindling,
  Hash,
  Lock,
  Globe,
} from 'lucide-react'
import 'flag-icons/css/flag-icons.min.css'
import { COUNTRIES, COUNTRY_FLAGS, internationalRules } from '../constants/internationalRules'
import { useLanguage } from '../context/LanguageContext'

interface ChecklistItem {
  id: string
  category: string
  iconName: string
  title: string
  description: string
  checked: boolean
  country?: string
}

interface ChecklistItemTranslation {
  category: string
  title: string
  description: string
}

const checklistEnTranslations: Record<string, ChecklistItemTranslation> = {
  '1': {
    category: 'Coupling and tow hitch',
    title: 'Inspect tow hitch',
    description: 'No cracks, rust, or deformation. Shake-test to ensure secure lock.',
  },
  '2': {
    category: 'Coupling and tow hitch',
    title: 'Safety chain/cable',
    description: 'Crossed in an X shape, not touching the ground. No worn or damaged sections.',
  },
  '3': {
    category: 'Coupling and tow hitch',
    title: 'Coupling ball',
    description: 'Clean and lightly greased. Coupler fully seated and latch locked.',
  },
  '4': {
    category: 'Lighting and electrical',
    title: 'Rear lights',
    description: 'Brake lights, tail lights, indicators, and reverse light are working.',
  },
  '5': {
    category: 'Lighting and electrical',
    title: 'Electrical connector',
    description: 'Clean, dry, corrosion-free connector with tight fit.',
  },
  '6': {
    category: 'Wheels and suspension',
    title: 'Tire pressure',
    description: 'Correct pressure on all wheels (see trailer sidewall values).',
  },
  '7': {
    category: 'Wheels and suspension',
    title: 'Tire condition',
    description: 'No cracks, cuts, or bulges. Tread min. 1.6 mm (3 mm recommended).',
  },
  '8': {
    category: 'Wheels and suspension',
    title: 'Wheel nuts',
    description: 'All nuts present and tight. For new trailers: 100-120 Nm.',
  },
  '9': {
    category: 'Pre-departure check',
    title: 'Adjust mirrors',
    description: 'Full trailer length should be visible on both sides.',
  },
  '10': {
    category: 'Cargo and load',
    title: 'Secure cargo',
    description: 'Use straps/ropes. Cargo must not move when shaken.',
  },
  '11': {
    category: 'Cargo and load',
    title: 'Load distribution',
    description: '60% front, 40% rear. Hitch load should be 50-100 kg.',
  },
  '12': {
    category: 'Cargo and load',
    title: 'Maximum load',
    description: 'Max. 4250 kg (combined). Check trailer data plate.',
  },
  '13': {
    category: 'Brakes',
    title: 'Trailer brakes',
    description: 'Test at low speed. Check brake fluid or brake cable linkage.',
  },
  '14': {
    category: 'Brakes',
    title: 'Parking brake',
    description: 'With handbrake engaged, trailer must not move. Release before departure.',
  },
  '15': {
    category: 'Documents',
    title: 'Trailer documents',
    description: 'Registration and insurance valid. Rental trailers need rental contract.',
  },
  '16': {
    category: 'Documents',
    title: 'Driving license',
    description: 'Valid BE category license present (required above 750 kg trailer).',
  },
  '17': {
    category: 'Maintenance and equipment',
    title: 'Lubricate hitch and couplings',
    description: 'Grease tow ball and couplings. No excessive wear.',
  },
  '18': {
    category: 'Maintenance and equipment',
    title: 'Jockey wheel',
    description: 'Moves freely, locking pin holds. Lubricate if squeaking.',
  },
  '19': {
    category: 'Maintenance and equipment',
    title: 'Spare wheel and tools',
    description: 'Spare wheel in good condition. Jack and wheel wrench available.',
  },
  '20': {
    category: 'Maintenance and equipment',
    title: 'Condition of securing tools',
    description: 'Straps, ropes, chains intact. Hooks not rusty or bent.',
  },
  '21': {
    category: 'Maintenance and equipment',
    title: 'Safety equipment',
    description: 'Gloves, high-vis vest, first aid kit, warning triangle.',
  },
  '22': {
    category: 'Pre-departure check',
    title: 'Walk-around check',
    description: 'Hitch OK, chain OK, connector OK, lights OK, cargo OK.',
  },
  '23': {
    category: 'Pre-departure check',
    title: 'Final load and stability check',
    description: 'Max load OK. Hitch load 50-100 kg. Weight split 60/40.',
  },
  '24': {
    category: 'Lighting and electrical',
    title: 'Battery (if equipped)',
    description: 'Charge level OK, terminals clean (caravan/braked trailer).',
  },
  '25': {
    category: 'Wheels and suspension',
    title: 'Suspension / axle connection',
    description: 'No leaks, bends, or cracks. Leaf springs and bearings in good condition.',
  },
  '26': {
    category: 'Wheels and suspension',
    title: 'Wheel bearing noise/play',
    description: 'No humming noise, no lateral play. Bearings properly greased.',
  },
  '27': {
    category: 'Coupling and tow hitch',
    title: 'Hitch attachment to trailer',
    description: 'Bolts and welds intact. Mounting is stable and secure.',
  },
  '28': {
    category: 'Coupling and tow hitch',
    title: 'Stabilizer lever / friction pads',
    description: 'Stabilizer works correctly, pads not worn (if present).',
  },
  '29': {
    category: 'Maintenance and equipment',
    title: 'First aid kit expiry',
    description: 'First aid kit is in date and complete.',
  },
  '30': {
    category: 'Maintenance and equipment',
    title: 'Fire extinguisher',
    description: 'Fire extinguisher charged and certified (caravan/large trailer).',
  },
  '31': {
    category: 'Pre-departure check',
    title: 'License plate and bracket',
    description: 'Plate is readable, illuminated, and bracket securely mounted.',
  },
  '32': {
    category: 'Pre-departure check',
    title: 'Cover / lid / door locks',
    description: 'Cover, lid, and doors close and lock securely.',
  },
  '33': {
    category: 'Pre-departure check',
    title: 'Release handbrake before departure',
    description: 'Handbrake is fully released before moving off.',
  },
}

const internationalRuleEnTranslations: Record<string, { title: string; content: string }> = {
  '21': {
    title: 'Required equipment',
    content:
      'In the Netherlands you must carry high-visibility vests (for all passengers), warning triangle, spare bulbs, fuses, front and rear fog lights, and valid travel ID.',
  },
  '22': {
    title: 'Road tolls',
    content:
      'There is no general motorway toll in the Netherlands for passenger cars, but city parking can be expensive.',
  },
  '23': {
    title: 'Required equipment',
    content:
      'In Germany carry high-visibility vests, warning triangles (2 pcs), spare bulbs, fuses, fog lights, and valid travel documents.',
  },
  '24': {
    title: 'Road tolls',
    content:
      'Passenger cars are generally toll-free on German motorways. Heavier vehicle categories may require Maut payment.',
  },
  '25': {
    title: 'Required equipment',
    content:
      'In Austria carry high-visibility vests, warning triangle, spare bulbs, fuses, fog lights, and valid travel documents.',
  },
  '26': {
    title: 'Road tolls - vignette',
    content:
      'A valid Austrian vignette is mandatory on motorways. Choose 10-day, 2-month, or annual option to avoid fines.',
  },
  '27': {
    title: 'Required equipment',
    content:
      'In Switzerland carry high-visibility vests, warning triangle, spare bulbs, fuses, and valid travel documents. Winter tires/chains may be required in season.',
  },
  '28': {
    title: 'Road tolls - vignette',
    content:
      'A Swiss motorway vignette is mandatory and usually sold as an annual pass. Driving without it can result in high fines.',
  },
  '29': {
    title: 'Required equipment',
    content:
      'In Luxembourg carry high-visibility vests, warning triangle, spare bulbs, fuses, and valid travel documents.',
  },
  '30': {
    title: 'Road tolls',
    content:
      'Luxembourg generally has no motorway toll for passenger vehicles, but urban parking fees can be high.',
  },
  '31': {
    title: 'Required equipment',
    content:
      'In Italy carry high-visibility vests, warning triangle, spare bulbs, fuses, valid travel documents, and use daytime lights where required.',
  },
  '32': {
    title: 'Road tolls - Autostrada',
    content:
      'Italian motorways are tolled. Cost depends on route and vehicle class, and towing combinations can pay higher fees.',
  },
  '33': {
    title: 'Required equipment',
    content:
      'In Czechia carry high-visibility vests, warning triangle, spare bulbs, fuses, and valid travel documents. Winter requirements apply seasonally.',
  },
  '34': {
    title: 'Road tolls - vignette',
    content:
      'A motorway vignette is mandatory in Czechia. Choose valid period (10-day/30-day/annual) before entering tolled roads.',
  },
  '35': {
    title: 'Required equipment',
    content:
      'In Poland carry high-visibility vests, warning triangle, spare bulbs, fuses, valid travel documents, and use daytime lights as required.',
  },
  '36': {
    title: 'Road tolls - vignette',
    content:
      'Toll rules depend on motorway section and vehicle type in Poland. Check payment method and trailer category before travel.',
  },
  '37': {
    title: 'Required equipment',
    content:
      'In Slovakia carry high-visibility vests, warning triangle, spare bulbs, fuses, and valid travel documents. Winter tire rules may apply.',
  },
  '38': {
    title: 'Road tolls - vignette',
    content:
      'A valid Slovak motorway vignette is required on designated roads. Driving without one may lead to penalties.',
  },
}

const countryLabelsEn: Record<string, string> = {
  'Magyarország': 'Hungary',
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

const getCountryLabel = (country: string, language: 'hu' | 'en') => {
  if (language === 'en') {
    return countryLabelsEn[country] ?? country
  }
  return country
}

// Icon mapping
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LinkIcon: LinkIcon,
  Shield: Shield,
  Lightbulb: Lightbulb,
  Gauge: Gauge,
  Wrench: Wrench,
  Eye: Eye,
  Package: Package,
  AlertTriangle: AlertTriangle,
  FileCheck: FileCheck,
  Droplet: Droplet,
  LifeBuoy: LifeBuoy,
  Hammer: Hammer,
  ClipboardCheck: ClipboardCheck,
  Battery: Battery,
  Settings: Settings,
  Disc: Disc,
  Anchor: Anchor,
  FlameKindling: FlameKindling,
  Hash: Hash,
  Lock: Lock,
}

// Memoized ChecklistItem component to prevent unnecessary re-renders
const ChecklistItemComponent = React.memo<{
  item: ChecklistItem
  index: number
  onToggle: (id: string) => void
  language: 'hu' | 'en'
}>(({ item, index, onToggle, language }) => {
  const IconComponent = iconMap[item.iconName] || Package

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03, duration: 0.25 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onToggle(item.id)}
      className={`group relative cursor-pointer rounded-xl border transition-all duration-200 p-3 md:p-4 ${
        item.checked
          ? 'bg-gradient-to-r from-red-950/80 via-red-900/40 to-black/60 border-red-500/60 shadow-glow-red'
          : 'bg-[#121217]/90 border-white/[0.08] hover:border-red-500/50 hover:bg-[#191922] hover:shadow-glow-red'
      }`}
    >
      <div className="flex items-start gap-3 md:gap-4">
        <div className="flex-shrink-0 pt-0.5">
          {item.checked ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 15 }}
            >
              <CheckCircle2 className="w-6 h-6 text-red-500" />
            </motion.div>
          ) : (
            <Circle className="w-6 h-6 text-slate-500 group-hover:text-red-400 transition-colors" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
            <IconComponent className={`w-4 h-4 flex-shrink-0 ${item.checked ? 'text-red-400' : 'text-red-500'}`} />
            <h4 className={`text-sm md:text-base font-semibold ${
              item.checked ? 'text-red-200 line-through decoration-red-500/50' : 'text-white group-hover:text-white'
            }`}>
              {item.country && (
                <span className="inline-flex items-center gap-1 mr-2">
                  <div className={`fib fi-${COUNTRY_FLAGS[item.country]}`} style={{ width: '14px', height: '10px' }}></div>
                  <span className="text-[10px] font-mono text-slate-400">{getCountryLabel(item.country, language)}</span>
                  <span className="text-slate-600">—</span>
                </span>
              )}
              {item.title}
            </h4>
          </div>
          <p className={`text-xs md:text-sm leading-relaxed ${
            item.checked ? 'text-red-300/80' : 'text-slate-300'
          }`}>
            {item.description}
          </p>
        </div>
      </div>
    </motion.div>
  )
})

const Checklist = () => {
  const { language, t } = useLanguage()

  const initialItems: ChecklistItem[] = [
    {
      id: '1',
      category: 'Csatlakozás és vonófej',
      iconName: 'LinkIcon',
      title: 'Vonóhorog ellenőrzése',
      description: 'Nincs repedés, rozsdásodás vagy deformáció. Rázd meg, hogy rögzítve legyen.',
      checked: false,
    },
    {
      id: '2',
      category: 'Csatlakozás és vonófej',
      iconName: 'Shield',
      title: 'Biztonsági lánc/kábel',
      description: 'Keresztbe kötve (X alakban), ne érjen a földhöz. Nincs sérült vagy kopott rész.',
      checked: false,
    },
    {
      id: '3',
      category: 'Csatlakozás és vonófej',
      iconName: 'LinkIcon',
      title: 'Csatlakozó golyó',
      description: 'Tiszta, enyhén kenve. Csatlakozó rácsukódott, retesz bekapcsolva.',
      checked: false,
    },
    {
      id: '4',
      category: 'Világítás és elektromos',
      iconName: 'Lightbulb',
      title: 'Hátsó lámpák',
      description: 'Féklámpák, helyzetjelzők, irányjelzők, tolatólámpa működik.',
      checked: false,
    },
    {
      id: '5',
      category: 'Világítás és elektromos',
      iconName: 'Lightbulb',
      title: 'Elektromos csatlakozás',
      description: 'Tiszta, száraz, korróziómentes. Szorosan illeszkedik.',
      checked: false,
    },
    {
      id: '6',
      category: 'Kerekek és futómű',
      iconName: 'Gauge',
      title: 'Gumiabroncs nyomás',
      description: 'Megfelelő nyomás minden keréken (érték a pótkocsi oldalfalán).',
      checked: false,
    },
    {
      id: '7',
      category: 'Kerekek és futómű',
      iconName: 'Gauge',
      title: 'Gumiabroncs állapot',
      description: 'Nincs repedés, vágás, dudor. Futófelület min. 1,6 mm (3 mm ajánlott).',
      checked: false,
    },
    {
      id: '8',
      category: 'Kerekek és futómű',
      iconName: 'Wrench',
      title: 'Kerékanyák',
      description: 'Minden anya a helyén, nincs laza. Új pótkocsinál: 100-120 Nm.',
      checked: false,
    },
    {
      id: '9',
      category: 'Indulás előtti ellenőrzés',
      iconName: 'Eye',
      title: 'Külső tükrök beállítása',
      description: 'Látható a pótkocsi teljes hossza mindkét oldalon.',
      checked: false,
    },
    {
      id: '10',
      category: 'Rakomány és terhelés',
      iconName: 'Package',
      title: 'Rakomány rögzítése',
      description: 'Hevederekkel/kötelekkel rögzítve. Nem mozog, ha megrázod.',
      checked: false,
    },
    {
      id: '11',
      category: 'Rakomány és terhelés',
      iconName: 'Package',
      title: 'Súlyelosztás',
      description: '60% elöl, 40% hátul. Vonóhorog terhelés: 50-100 kg.',
      checked: false,
    },
    {
      id: '12',
      category: 'Rakomány és terhelés',
      iconName: 'AlertTriangle',
      title: 'Maximális terhelés',
      description: 'Max. 4250 kg (teljes szerelvény). Lásd pótkocsi adattábla.',
      checked: false,
    },
    {
      id: '13',
      category: 'Fékek',
      iconName: 'Shield',
      title: 'Pótkocsi fékek',
      description: 'Próbáld ki alacsony sebességnél. Ellenőrizd a fékfolyadékot vagy bowden kábelt.',
      checked: false,
    },
    {
      id: '14',
      category: 'Fékek',
      iconName: 'Shield',
      title: 'Rögzítőfék',
      description: 'Kézifék behúzva a pótkocsi nem mozdul. Indulás előtt kioldva!',
      checked: false,
    },
    {
      id: '15',
      category: 'Dokumentumok',
      iconName: 'FileCheck',
      title: 'Pótkocsi papírok',
      description: 'Forgalmi engedély és biztosítás érvényes. Bérelt pótkocsinál bérleti szerződés.',
      checked: false,
    },
    {
      id: '16',
      category: 'Dokumentumok',
      iconName: 'FileCheck',
      title: 'Jogosítvány',
      description: 'BE kategória érvényes és nálad (750 kg+ pótkocsihoz).',
      checked: false,
    },
    {
      id: '17',
      category: 'Karbantartás és felszerelés',
      iconName: 'Droplet',
      title: 'Vonófej és csatlakozások kenése',
      description: 'Gömbfej, golyó, csatlakozások kenve. Nincs túlzott kopás.',
      checked: false,
    },
    {
      id: '18',
      category: 'Karbantartás és felszerelés',
      iconName: 'Wrench',
      title: 'Támasztó kerék (jockey wheel)',
      description: 'Könnyen mozgatható, rögzítő csap tart. Kend meg, ha nyikorog.',
      checked: false,
    },
    {
      id: '19',
      category: 'Karbantartás és felszerelés',
      iconName: 'LifeBuoy',
      title: 'Tartalék kerék és szerszámok',
      description: 'Tartalék kerék jó állapotban. Jack és kerékkulcs megvan.',
      checked: false,
    },
    {
      id: '20',
      category: 'Karbantartás és felszerelés',
      iconName: 'Hammer',
      title: 'Rögzítő eszközök állapota',
      description: 'Hevederek, kötelek, láncok épek. Horgok nem rozsdásak/hajlottak.',
      checked: false,
    },
    {
      id: '21',
      category: 'Karbantartás és felszerelés',
      iconName: 'Package',
      title: 'Biztonsági felszerelés',
      description: 'Kesztyű, mellény, elsősegély doboz, háromszög.',
      checked: false,
    },
    {
      id: '22',
      category: 'Indulás előtti ellenőrzés',
      iconName: 'ClipboardCheck',
      title: 'Körbesétálás (Walk-around)',
      description: 'Vonófej OK, lánc OK, csatlakozó OK, lámpák OK, rakomány OK.',
      checked: false,
    },
    {
      id: '23',
      category: 'Indulás előtti ellenőrzés',
      iconName: 'AlertTriangle',
      title: 'Terhelés és stabilitás végső ellenőrzése',
      description: 'Max. terhelés OK. Vonóhorog: 50-100 kg. Súlyelosztás: 60/40%.',
      checked: false,
    },
    {
      id: '24',
      category: 'Világítás és elektromos',
      iconName: 'Battery',
      title: 'Akkumulátor (ha van)',
      description: 'Töltöttség OK, saruk tiszták (lakókocsi/fékrendszeres utánfutó).',
      checked: false,
    },
    {
      id: '25',
      category: 'Kerekek és futómű',
      iconName: 'Settings',
      title: 'Futómű / tengelycsatlakozás',
      description: 'Nincs olajfolyás, hajlás, repedés. Laprugók és csapágyak jók.',
      checked: false,
    },
    {
      id: '26',
      category: 'Kerekek és futómű',
      iconName: 'Disc',
      title: 'Kerékcsapágy hang / játék',
      description: 'Kerék nem zúg, nincs oldalirányú játék. Csapágyak zsírozva.',
      checked: false,
    },
    {
      id: '27',
      category: 'Csatlakozás és vonófej',
      iconName: 'Anchor',
      title: 'Vonófej rögzítése a pótkocsihoz',
      description: 'Csavarok és hegesztések épek. Teljes rögzítés stabil.',
      checked: false,
    },
    {
      id: '28',
      category: 'Csatlakozás és vonófej',
      iconName: 'Settings',
      title: 'Stabilizátor kar / súrlódó betétek',
      description: 'Stabilizátor működik, betétek nem kopottak (ha van).',
      checked: false,
    },
    {
      id: '29',
      category: 'Karbantartás és felszerelés',
      iconName: 'Package',
      title: 'Elsősegély csomag érvényessége',
      description: 'Elsősegély doboz szavatossága érvényes.',
      checked: false,
    },
    {
      id: '30',
      category: 'Karbantartás és felszerelés',
      iconName: 'FlameKindling',
      title: 'Tűzoltó készülék',
      description: 'Tűzoltó készülék töltött és hitelesített (lakókocsi/nagy pótkocsi).',
      checked: false,
    },
    {
      id: '31',
      category: 'Indulás előtti ellenőrzés',
      iconName: 'Hash',
      title: 'Rendszámtábla és tartó',
      description: 'Rendszámtábla olvasható, megvilágított, tartó rögzítve.',
      checked: false,
    },
    {
      id: '32',
      category: 'Indulás előtti ellenőrzés',
      iconName: 'Lock',
      title: 'Ponyva / fedél / ajtózárak',
      description: 'Ponyva, fedél, ajtók biztonságosan záródnak.',
      checked: false,
    },
    {
      id: '33',
      category: 'Indulás előtti ellenőrzés',
      iconName: 'Shield',
      title: 'Kézifék kioldása indulás előtt',
      description: 'Kézifék teljesen kioldva indulás előtt.',
      checked: false,
    },
  ]

  const localizedInitialItems = useMemo(() => {
    if (language !== 'en') {
      return initialItems
    }

    return initialItems.map((item) => {
      const translation = checklistEnTranslations[item.id]
      if (!translation) {
        return item
      }

      return {
        ...item,
        category: translation.category,
        title: translation.title,
        description: translation.description,
      }
    })
  }, [language])

  // Load selected countries from localStorage
  const [selectedCountries, setSelectedCountries] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('selectedCountries')
      if (saved) {
        return JSON.parse(saved)
      }
    } catch (error) {
      console.error('Error loading selected countries:', error)
    }
    return ['Magyarország'] // Default to Hungary
  })

  // Generate dynamic items based on selected countries
  const generateDynamicItems = useCallback((): ChecklistItem[] => {
    const dynamicItems: ChecklistItem[] = []
    let idCounter = localizedInitialItems.length + 1

    selectedCountries.forEach(country => {
      if (country === 'Magyarország') return // Skip Hungary as it's already in initialItems

      const countryRules = internationalRules.filter(rule => rule.country === country)

      // Add equipment and toll rules
      countryRules.forEach(rule => {
        if (
          rule.category === 'Kötelező Felszerelések' ||
          rule.category === 'Díjak és Úthasználat' ||
          rule.important
        ) {
          dynamicItems.push({
            id: `dynamic-${idCounter}`,
            category:
              language === 'en'
                ? `${getCountryLabel(country, language)} - International rules`
                : `${country} - Nemzetközi Szabályok`,
            iconName: 'Shield',
            title:
              language === 'en'
                ? (internationalRuleEnTranslations[rule.id]?.title ?? rule.title)
                : rule.title,
            description:
              language === 'en'
                ? (internationalRuleEnTranslations[rule.id]?.content ?? rule.content)
                : rule.content,
            checked: false,
            country: country,
          })
          idCounter++
        }
      })
    })

    return dynamicItems
  }, [language, localizedInitialItems.length, selectedCountries])

  const dynamicItems = useMemo(() => generateDynamicItems(), [generateDynamicItems])

  const [items, setItems] = useState<ChecklistItem[]>(() => {
    try {
      const saved = localStorage.getItem('checklistItems')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) {
          return parsed
        }
      }
    } catch (error) {
      console.error('Error loading checklist from localStorage:', error)
      localStorage.removeItem('checklistItems')
    }
    return [...localizedInitialItems, ...dynamicItems]
  })

  const [showConfetti, setShowConfetti] = useState(false)

  // Update items when dynamic items change
  useEffect(() => {
    setItems(prevItems => {
      // Keep checked state of existing items
      const newItems = [...localizedInitialItems, ...dynamicItems]
      const checkedMap = new Map(prevItems.map(item => [item.id, item.checked]))

      return newItems.map(item => ({
        ...item,
        checked: checkedMap.get(item.id) ?? false,
      }))
    })
  }, [dynamicItems, localizedInitialItems])

  // Save selected countries to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('selectedCountries', JSON.stringify(selectedCountries))
    } catch (error) {
      console.error('Error saving selected countries:', error)
    }
  }, [selectedCountries])

  // Debounced localStorage save - only save after user stops clicking
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      try {
        localStorage.setItem('checklistItems', JSON.stringify(items))
      } catch (error) {
        console.error('Error saving checklist to localStorage:', error)
      }
    }, 300) // Wait 300ms after last change before saving

    return () => clearTimeout(timeoutId)
  }, [items])

  // Check for completion and show confetti
  useEffect(() => {
    const allChecked = items.every(item => item.checked)
    if (allChecked && items.length > 0) {
      setShowConfetti(true)
      const timer = setTimeout(() => setShowConfetti(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [items])

  // Memoized toggle function to prevent unnecessary re-renders
  const toggleItem = useCallback((id: string) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    )
  }, [])

  // Memoized reset function
  const resetChecklist = useCallback(() => {
    setItems(prevItems => prevItems.map(item => ({ ...item, checked: false })))
  }, [])

  // Memoize expensive calculations
  const categories = useMemo(
    () => Array.from(new Set(items.map(item => item.category))),
    [items]
  )

  const checkedCount = useMemo(
    () => items.filter(item => item.checked).length,
    [items]
  )

  const progress = useMemo(
    () => (checkedCount / items.length) * 100,
    [checkedCount, items.length]
  )

  const toggleCountry = useCallback((country: string) => {
    setSelectedCountries(prev => {
      if (prev.includes(country)) {
        return prev.filter(c => c !== country)
      } else {
        return [...prev, country]
      }
    })
  }, [])

  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed'>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  // Filtered items based on active tab and category
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesStatus =
        filterStatus === 'all' ||
        (filterStatus === 'pending' && !item.checked) ||
        (filterStatus === 'completed' && item.checked)

      const matchesCategory =
        selectedCategory === 'all' || item.category === selectedCategory

      return matchesStatus && matchesCategory
    })
  }, [items, filterStatus, selectedCategory])

  const filteredCategories = useMemo(() => {
    if (selectedCategory !== 'all') {
      return [selectedCategory]
    }
    return Array.from(new Set(filteredItems.map(item => item.category)))
  }, [filteredItems, selectedCategory])

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-1.5"
      >
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-red-400 font-bold uppercase tracking-wider bg-red-950/80 px-2.5 py-0.5 rounded-md border border-red-800/60">
            CHECKLIST PROTOCOL
          </span>
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          {t('checklist.title')}
        </h2>
        <p className="text-sm md:text-base text-slate-300">
          {t('checklist.subtitle')}
        </p>
      </motion.div>

      {/* Country Selector / Transit Waypoint Route */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-[#121217]/90 backdrop-blur-xl border border-white/[0.1] p-4 md:p-5 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm md:text-base font-bold text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-red-500" />
            {t('checklist.routeTitle')}
          </h3>
          <span className="text-[11px] font-mono text-red-300 bg-red-950/80 px-2 py-0.5 rounded border border-red-800/60 font-bold">
            {selectedCountries.length} {language === 'en' ? 'countries active' : 'ország aktív'}
          </span>
        </div>
        <p className="text-xs text-slate-300 mb-3.5 leading-relaxed">
          {t('checklist.routeDesc')}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {COUNTRIES.map(country => {
            const isSelected = selectedCountries.includes(country)
            const isDefault = country === 'Magyarország'

            return (
              <motion.button
                key={country}
                whileTap={{ scale: 0.96 }}
                onClick={() => toggleCountry(country)}
                className={`p-2.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-xs font-semibold ${
                  isSelected
                    ? 'bg-gradient-to-r from-red-600/30 to-red-900/30 border border-red-500/70 text-white shadow-glow-red font-bold'
                    : 'bg-[#181820] border border-white/10 text-slate-300 hover:text-white hover:border-white/25'
                } ${isDefault ? 'opacity-90' : ''}`}
                disabled={isDefault}
                title={isDefault ? (language === 'en' ? 'Default starting country' : 'Alapértelmezett kiindulási ország') : ''}
              >
                <div className={`fib fi-${COUNTRY_FLAGS[country]}`} style={{ width: '16px', height: '12px' }}></div>
                <span className="truncate">{getCountryLabel(country, language)}</span>
              </motion.button>
            )
          })}
        </div>
      </motion.div>

      {/* Progress & Quick Control Bar */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl bg-[#121217]/90 backdrop-blur-xl border border-white/[0.1] p-4 md:p-5 shadow-2xl space-y-4"
      >
        <div className="flex flex-wrap justify-between items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl md:text-2xl font-black font-display text-white">
                {checkedCount} <span className="text-slate-500 text-base font-normal">/ {items.length}</span>
              </span>
              <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${
                progress === 100 ? 'bg-red-600 text-white shadow-glow-red' : 'bg-red-500/20 text-red-300 border border-red-500/40'
              }`}>
                {Math.round(progress)}%
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5 font-medium">
              {items.length - checkedCount > 0
                ? `${items.length - checkedCount} ${t('checklist.remaining')}`
                : t('checklist.allCompletedTitle')}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={resetChecklist}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#181820] hover:bg-[#22222c] text-slate-200 hover:text-white rounded-xl border border-white/15 text-xs font-medium transition-all"
            >
              <RotateCcw size={14} />
              <span>{t('checklist.reset')}</span>
            </motion.button>
          </div>
        </div>

        {/* Progress Track */}
        <div className="w-full bg-black/80 rounded-full h-2.5 p-0.5 border border-white/10 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="h-full rounded-full transition-all duration-300 bg-gradient-to-r from-red-600 via-rose-500 to-red-400 shadow-glow-red"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-white/[0.06]">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 bg-black/60 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                filterStatus === 'all'
                  ? 'bg-red-600 text-white font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t('checklist.filterAll')} ({items.length})
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                filterStatus === 'pending'
                  ? 'bg-red-600 text-white font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t('checklist.filterPending')} ({items.length - checkedCount})
            </button>
            <button
              onClick={() => setFilterStatus('completed')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                filterStatus === 'completed'
                  ? 'bg-white text-black font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t('checklist.filterDone')} ({checkedCount})
            </button>
          </div>

          {/* Category Dropdown */}
          <div className="flex-1 min-w-[160px] max-w-[240px]">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full text-xs font-medium bg-[#181820] text-slate-200 border border-white/15 rounded-xl px-3 py-1.5 focus:outline-none focus:border-red-500"
            >
              <option value="all">{t('checklist.allCategories')}</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* 100% Completed Ready Banner */}
      {progress === 100 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="rounded-2xl bg-gradient-to-r from-red-950/90 via-black/90 to-red-950/90 border border-red-500/70 p-5 shadow-glow-red text-center space-y-2"
        >
          <div className="w-12 h-12 rounded-full bg-red-500/20 border border-red-400/50 flex items-center justify-center mx-auto text-red-300">
            <CheckCircle2 className="w-7 h-7 text-red-500" />
          </div>
          <h3 className="text-lg md:text-xl font-bold text-white">
            {t('checklist.allCompletedTitle')}
          </h3>
          <p className="text-xs md:text-sm text-red-200/90 max-w-md mx-auto">
            {t('checklist.allCompletedDesc')}
          </p>
        </motion.div>
      )}

      {/* Confetti Effect */}
      <AnimatePresence>
        {showConfetti && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.5, rotate: -10 }}
              animate={{ scale: 1.2, rotate: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', damping: 12 }}
              className="text-7xl p-8 rounded-3xl bg-[#14141a] border border-red-500/70 shadow-glow-red"
            >
              🚀
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Checklist Items by Category */}
      <div className="space-y-6">
        {filteredCategories.map((category, categoryIndex) => {
          const categoryItems = filteredItems.filter(item => item.category === category)
          if (categoryItems.length === 0) return null

          return (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: categoryIndex * 0.05 }}
              className="space-y-2.5"
            >
              <div className="flex items-center justify-between px-1">
                <h3 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  {category}
                </h3>
                <span className="text-[11px] font-mono text-slate-400 font-medium">
                  {categoryItems.filter(i => i.checked).length}/{categoryItems.length}
                </span>
              </div>

              <div className="space-y-2">
                {categoryItems.map((item, index) => (
                  <ChecklistItemComponent
                    key={item.id}
                    item={item}
                    index={index}
                    onToggle={toggleItem}
                    language={language}
                  />
                ))}
              </div>
            </motion.div>
          )
        })}

        {filteredItems.length === 0 && (
          <div className="rounded-2xl bg-[#121217]/80 border border-white/10 p-8 text-center text-slate-400 text-sm">
            Nincs megjeleníthető elem a kiválasztott szűrők alapján.
          </div>
        )}
      </div>

      <div className="h-6" />
    </div>
  )
}

export default Checklist

