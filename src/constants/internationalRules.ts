import {
  Shield,
  MapPin,
} from 'lucide-react'

export interface InternationalRule {
  id: string
  country: string
  category: string
  icon: React.ComponentType<any>
  title: string
  content: string
  important?: boolean
}

export type ChecklistRequirementCategory = 'equipment' | 'documents' | 'trailer' | 'vehicle' | 'speed' | 'toll' | 'other'

export interface CountryChecklistRequirement {
  id: string
  title: string
  description: string
  category: ChecklistRequirementCategory
  severity: 'required' | 'important' | 'info'
  sourceRuleId: string
}

export const COUNTRIES = [
  'Magyarország',
  'Hollandia',
  'Németország',
  'Ausztria',
  'Svájc',
  'Luxemburg',
  'Olaszország',
  'Csehország',
  'Lengyelország',
  'Szlovákia',
]

export const COUNTRY_FLAGS: Record<string, string> = {
  'Magyarország': 'hu',
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

export const internationalRules: InternationalRule[] = [
  // HOLLANDIA
  {
    id: '21',
    country: 'Hollandia',
    category: 'Kötelező Felszerelések',
    icon: Shield,
    title: 'Kötelező felszerelések',
    content: 'Hollandiában kötelező: sárga mellény (minden utasnak), figyelmeztető háromszög, tartalék izzók, biztosítékok, első és hátsó ködlámpa, valamint nemzetközi útlevél vagy személyi igazolvány.',
    important: true,
  },
  {
    id: '22',
    country: 'Hollandia',
    category: 'Díjak és Úthasználat',
    icon: MapPin,
    title: 'Úthasználati díjak',
    content: 'Hollandiában nincs úthasználati díj az autópályákon. Az ország díjmentes közlekedésre. Azonban a parkolás városokban drága lehet.',
  },

  // NÉMETORSZÁG
  {
    id: '23',
    country: 'Németország',
    category: 'Kötelező Felszerelések',
    icon: Shield,
    title: 'Kötelező felszerelések',
    content: 'Németországban kötelező: sárga mellény (minden utasnak), figyelmeztető háromszög (2 db), tartalék izzók, biztosítékok, első és hátsó ködlámpa, valamint nemzetközi útlevél.',
    important: true,
  },
  {
    id: '24',
    country: 'Németország',
    category: 'Díjak és Úthasználat',
    icon: MapPin,
    title: 'Úthasználati díjak',
    content: 'Németországban az autópályákon (Autobahn) nincs úthasználati díj személygépkocsiknak. Azonban nagyobb járműveknek (3,5 t felett) Maut díjat kell fizetni elektronikus rendszeren keresztül.',
  },

  // AUSZTRIA
  {
    id: '25',
    country: 'Ausztria',
    category: 'Kötelező Felszerelések',
    icon: Shield,
    title: 'Kötelező felszerelések',
    content: 'Ausztriában kötelező: sárga mellény (minden utasnak), figyelmeztető háromszög, tartalék izzók, biztosítékok, első és hátsó ködlámpa, valamint nemzetközi útlevél.',
    important: true,
  },
  {
    id: '26',
    country: 'Ausztria',
    category: 'Díjak és Úthasználat',
    icon: MapPin,
    title: 'Úthasználati díjak - Vignetta',
    content: 'Ausztriában kötelező a vignetta (matrica) az autópályákon. 10 napos, 2 hónapos vagy éves vignetta érhető el. A vignetta nélküli közlekedés magas bírságot von maga után. Pótkocsival is szükséges!',
    important: true,
  },

  // SVÁJC
  {
    id: '27',
    country: 'Svájc',
    category: 'Kötelező Felszerelések',
    icon: Shield,
    title: 'Kötelező felszerelések',
    content: 'Svájcban kötelező: sárga mellény (minden utasnak), figyelmeztető háromszög, tartalék izzók, biztosítékok, valamint nemzetközi útlevél. Téli időszakban téli gumi vagy lánc kötelező.',
    important: true,
  },
  {
    id: '28',
    country: 'Svájc',
    category: 'Díjak és Úthasználat',
    icon: MapPin,
    title: 'Úthasználati díjak - Vignetta',
    content: 'Svájcban kötelező a vignetta (matrica) az autópályákon. Éves vignetta szükséges, amely december 31-ig érvényes. A vignetta nélküli közlekedés magas bírságot von maga után. Pótkocsival is szükséges!',
    important: true,
  },

  // LUXEMBURG
  {
    id: '29',
    country: 'Luxemburg',
    category: 'Kötelező Felszerelések',
    icon: Shield,
    title: 'Kötelező felszerelések',
    content: 'Luxemburgban kötelező: sárga mellény (minden utasnak), figyelmeztető háromszög, tartalék izzók, biztosítékok, valamint nemzetközi útlevél.',
  },
  {
    id: '30',
    country: 'Luxemburg',
    category: 'Díjak és Úthasználat',
    icon: MapPin,
    title: 'Úthasználati díjak',
    content: 'Luxemburgban nincs úthasználati díj az autópályákon. Az ország díjmentes közlekedésre. Azonban a parkolás városokban drága lehet.',
  },

  // OLASZORSZÁG
  {
    id: '31',
    country: 'Olaszország',
    category: 'Kötelező Felszerelések',
    icon: Shield,
    title: 'Kötelező felszerelések',
    content: 'Olaszországban kötelező: sárga mellény (minden utasnak), figyelmeztető háromszög, tartalék izzók, biztosítékok, valamint nemzetközi útlevél. Nappali világítás is kötelező.',
    important: true,
  },
  {
    id: '32',
    country: 'Olaszország',
    category: 'Díjak és Úthasználat',
    icon: MapPin,
    title: 'Úthasználati díjak - Autostrada',
    content: 'Olaszországban az autópályákon (Autostrada) úthasználati díjat kell fizetni. A díj a távolság és a jármű kategóriája alapján számítódik. Pótkocsival magasabb díj. Elektronikus vagy készpénz fizetés lehetséges.',
    important: true,
  },

  // CSEHORSZÁG
  {
    id: '33',
    country: 'Csehország',
    category: 'Kötelező Felszerelések',
    icon: Shield,
    title: 'Kötelező felszerelések',
    content: 'Csehországban kötelező: sárga mellény (minden utasnak), figyelmeztető háromszög, tartalék izzók, biztosítékok, valamint nemzetközi útlevél. Téli időszakban téli gumi kötelező.',
    important: true,
  },
  {
    id: '34',
    country: 'Csehország',
    category: 'Díjak és Úthasználat',
    icon: MapPin,
    title: 'Úthasználati díjak - Matrica',
    content: 'Csehországban kötelező a matrica (dálniční známka) az autópályákon. 10 napos, 30 napos vagy éves matrica érhető el. A matrica nélküli közlekedés magas bírságot von maga után. Pótkocsival is szükséges!',
    important: true,
  },

  // LENGYELORSZÁG
  {
    id: '35',
    country: 'Lengyelország',
    category: 'Kötelező Felszerelések',
    icon: Shield,
    title: 'Kötelező felszerelések',
    content: 'Lengyelországban kötelező: sárga mellény (minden utasnak), figyelmeztető háromszög, tartalék izzók, biztosítékok, valamint nemzetközi útlevél. Nappali világítás is kötelező.',
    important: true,
  },
  {
    id: '36',
    country: 'Lengyelország',
    category: 'Díjak és Úthasználat',
    icon: MapPin,
    title: 'Úthasználati díjak - Matrica',
    content: 'Lengyelországban kötelező a matrica (nalepka) az autópályákon. 10 napos, 30 napos vagy éves matrica érhető el. A matrica nélküli közlekedés magas bírságot von maga után. Pótkocsival is szükséges!',
    important: true,
  },

  // SZLOVÁKIA
  {
    id: '37',
    country: 'Szlovákia',
    category: 'Kötelező Felszerelések',
    icon: Shield,
    title: 'Kötelező felszerelések',
    content: 'Szlovákiában kötelező: sárga mellény (minden utasnak), figyelmeztető háromszög, tartalék izzók, biztosítékok, valamint nemzetközi útlevél. Téli időszakban téli gumi kötelező.',
    important: true,
  },
  {
    id: '38',
    country: 'Szlovákia',
    category: 'Díjak és Úthasználat',
    icon: MapPin,
    title: 'Úthasználati díjak - Matrica',
    content: 'Szlovákiában kötelező a matrica (známka) az autópályákon. 10 napos, 30 napos vagy éves matrica érhető el. A matrica nélküli közlekedés magas bírságot von maga után. Pótkocsival is szükséges!',
    important: true,
  },
]

const EQUIPMENT_RULE_IDS = new Set(['21', '23', '25', '27', '29', '31', '33', '35', '37'])
const TOLL_RULE_IDS = new Set(['26', '28', '32', '34', '36', '38'])

export function getCountryChecklistRequirements(country: string): CountryChecklistRequirement[] {
  return internationalRules
    .filter(rule => rule.country === country)
    .flatMap<CountryChecklistRequirement>(rule => {
      if (EQUIPMENT_RULE_IDS.has(rule.id)) {
        return [{
          id: 'required-equipment',
          title: 'Kötelező felszerelések ellenőrizve',
          description: 'Ellenőrizd az adott ország szabályainál felsorolt kötelező felszereléseket.',
          category: 'equipment' as const,
          severity: 'required' as const,
          sourceRuleId: rule.id,
        }]
      }
      if (TOLL_RULE_IDS.has(rule.id)) {
        return [{
          id: 'road-access',
          title: 'Úthasználati díj vagy matrica ellenőrizve',
          description: 'Ellenőrizd az útvonalhoz és a szerelvényhez szükséges úthasználati jogosultságot.',
          category: 'toll' as const,
          severity: 'important' as const,
          sourceRuleId: rule.id,
        }]
      }
      return []
    })
}

