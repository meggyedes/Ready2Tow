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
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onToggle(item.id)}
      className={`card cursor-pointer transition-all duration-300 p-3 md:p-4 ${
        item.checked
          ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300'
          : 'hover:shadow-xl'
      }`}
    >
      <div className="flex items-start gap-2 md:gap-4">
        <div className="flex-shrink-0">
          {item.checked ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 15 }}
            >
              <CheckCircle2 className="w-6 h-6 md:w-8 md:h-8 text-green-600" />
            </motion.div>
          ) : (
            <Circle className="w-6 h-6 md:w-8 md:h-8 text-gray-400" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 md:gap-2 mb-1">
            <IconComponent className="w-4 h-4 md:w-5 md:h-5 text-blue-600 flex-shrink-0" />
            <h4 className={`text-sm md:text-base font-semibold ${
              item.checked ? 'text-green-800 line-through' : 'text-gray-800'
            }`}>
              {item.country && (
                <span className="inline-flex items-center gap-1 mr-2">
                  <div className={`fib fi-${COUNTRY_FLAGS[item.country]}`} style={{ width: '16px', height: '12px' }}></div>
                  <span className="text-xs font-normal text-gray-600">{getCountryLabel(item.country, language)}</span>
                  <span className="text-gray-400">-</span>
                </span>
              )}
              {item.title}
            </h4>
          </div>
          <p className={`text-xs md:text-sm ${
            item.checked ? 'text-green-700' : 'text-gray-600'
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

  return (
    <div className="max-w-4xl mx-auto px-3 md:px-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 md:mb-6"
      >
        <h2 className="text-xl md:text-3xl font-bold text-gray-800 mb-1 md:mb-2">
          {t('checklist.title')}
        </h2>
        <p className="text-sm md:text-base text-gray-600">
          {t('checklist.subtitle')}
        </p>
        {language === 'en' && (
          <p className="text-xs text-blue-700 mt-2">{t('checklist.englishNote')}</p>
        )}
      </motion.div>

      {/* Country Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card mb-4 md:mb-6 p-3 md:p-4"
      >
        <h3 className="text-base md:text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
          <Globe className="w-5 h-5 text-blue-600" />
          {t('checklist.routeTitle')}
        </h3>
        <p className="text-xs md:text-sm text-gray-600 mb-3">
          {t('checklist.routeDesc')}
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
          {COUNTRIES.map(country => (
            <motion.button
              key={country}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleCountry(country)}
              className={`p-2 md:p-3 rounded-lg transition-all flex items-center justify-center gap-1.5 text-xs md:text-sm font-medium ${
                selectedCountries.includes(country)
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              } ${country === 'Magyarország' ? 'cursor-not-allowed opacity-75' : ''}`}
              disabled={country === 'Magyarország'}
            >
              <div className={`fib fi-${COUNTRY_FLAGS[country]}`} style={{ width: '16px', height: '12px' }}></div>
              <span className="hidden sm:inline">{getCountryLabel(country, language)}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Progress Bar */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card mb-4 md:mb-6 p-3 md:p-4"
      >
        <div className="flex justify-between items-center mb-2 md:mb-3">
          <div>
            <span className="text-sm md:text-lg font-semibold text-gray-800">
              {checkedCount}/{items.length} {t('checklist.doneItems')}
            </span>
            <p className="text-xs text-gray-500 mt-1">
              {Math.round(progress)}% - {items.length - checkedCount} {t('checklist.remaining')}
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetChecklist}
            className="flex items-center gap-1 md:gap-2 px-2 md:px-4 py-1.5 md:py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-xs md:text-sm"
          >
            <RotateCcw size={16} className="md:w-[18px] md:h-[18px]" />
            <span className="font-medium">{t('checklist.reset')}</span>
          </motion.button>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 md:h-4 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
            className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
          />
        </div>
      </motion.div>

      {/* Confetti Effect */}
      <AnimatePresence>
        {showConfetti && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="text-6xl"
            >
              🎉
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Checklist Items by Category */}
      {categories.map((category, categoryIndex) => (
        <motion.div
          key={category}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: categoryIndex * 0.1 }}
          className="mb-4 md:mb-6"
        >
          <h3 className="text-base md:text-xl font-bold text-gray-800 mb-2 md:mb-3 flex items-center">
            {category}
          </h3>
          <div className="space-y-2 md:space-y-3">
            {items
              .filter(item => item.category === category)
              .map((item, index) => (
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
      ))}

      {/* Bottom Spacing for Navigation */}
      <div className="h-8"></div>
    </div>
  )
}

export default Checklist

