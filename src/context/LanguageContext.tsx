import { createContext, ReactNode, useContext, useMemo, useState } from 'react'

export type Language = 'hu' | 'en'

type TranslationTree = {
  [key: string]: string | TranslationTree
}

interface LanguageContextType {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string) => string
}

const translations: Record<Language, TranslationTree> = {
  hu: {
    layout: {
      subtitle: 'BE Kategória Vontatási Cockpit',
      nav: {
        home: 'Áttekintés',
        checklist: 'Ellenőrzőlista',
        rules: 'KRESZ Tudástár',
      },
      language: 'Nyelv',
      langHu: 'Magyar',
      langEn: 'English',
    },
    home: {
      badge: 'BE VONTATÁSI ASSZISZTENS & PROTOKOLL',
      titleA: 'Indulj útnak',
      titleB: 'maximális biztonsággal',
      titleC: 'és szabályosan.',
      description:
        'Interaktív indulás előtti ellenőrzőrendszer, 10 európai ország speciális vontatási szabályai és a legfontosabb KRESZ előírások egyetlen precíz felületen.',
      openChecklist: 'Ellenőrzőlista indítása',
      openRules: 'KRESZ és országszabályok',
      heroAlt: 'Vontatás közúton',
      quickCheck: 'Gyors átvizsgálás',
      quickTime: '~3 perc indulás előtt',
      checklistTitle: 'Interaktív Ellenőrzőlista',
      checklistDescription: '33 pontos biztonsági protokoll + automata országspecifikus tételek',
      rulesTitle: 'KRESZ & Nemzetközi Szabályzat',
      rulesDescription: 'Sebességhatárok, súlykorlátok, előzési szabályok és útdíjak',
      open: 'Megnyitás',
      previewSuffix: 'előnézet',
      infoTitle: 'BE Kategória Alapszabályok',
      point1: 'Max. szerelvény össztömeg: 4250 kg (vontató max. 3500 kg)',
      point2: 'Ideális terhelésmegoszlás: 60% elöl / 40% hátul, 50-100 kg vonófej-nyomás',
      point3: 'Sebességkorlát vontatással Mo-n: Autópályán & autóúton 80 km/h, lakott területen 50 km/h',
      statChecklist: 'Ellenőrzési pont',
      statCountries: 'EU ország szabályai',
      statRules: 'KRESZ előírás',
      quickSpecsTitle: 'Kritikus Vontatási Paraméterek (BE)',
      specGrossWeight: '4 250 kg',
      specGrossWeightLabel: 'Max. megengedett szerelvény össztömeg',
      specTongueWeight: '50 - 100 kg',
      specTongueWeightLabel: 'Optimális vonófej függőleges terhelés',
      specWeightRatio: '60% / 40%',
      specWeightRatioLabel: 'Súlyeloszlás (Első / Hátsó rész)',
      specHighwaySpeed: '80 km/h',
      specHighwaySpeedLabel: 'Max. autópálya sebesség vontatva (HU)',
    },
    checklist: {
      title: 'Indulás Előtti Ellenőrzőlista',
      subtitle: 'Haladj végig a lépéseken a biztonságos, bírságmentes vontatásért',
      routeTitle: 'Útvonal és Tranzitországok',
      routeDesc:
        'Jelöld be az útvonaladba eső országokat! A lista dinamikusan kiegészül a helyi kötelező felszerelésekkel és matricás szabályokkal.',
      doneItems: 'kész',
      remaining: 'hátra',
      reset: 'Visszaállítás',
      allCategories: 'Összes kategória',
      filterAll: 'Összes',
      filterPending: 'Függőben',
      filterDone: 'Kész',
      allCompletedTitle: 'Minden ellenőrzés sikeresen lefutott!',
      allCompletedDesc: 'A szerelvény felkészült az indulásra. Jó utat és biztonságos közlekedést!',
      englishNote: 'A részletes pontok angol nyelven is elérhetők a nyelvváltóval.',
    },
    rules: {
      title: 'KRESZ & Nemzetközi Szabályzat',
      subtitle: 'Naprakész vontatási szabályok, sebességhatárok és előírások',
      searchPlaceholder: 'Keresés szabály, ország, felszerelés, sebesség szerint...',
      hungary: 'Magyarországi KRESZ Szabályok',
      international: 'Nemzetközi Országos Előírások',
      important: 'Kiemelt szabály',
      filterAll: 'Összes',
      emptyTitle: 'Nincs találat a megadott keresésre',
      emptySubtitle: 'Próbálj más kulcsszóra keresni (pl. matrica, sebesség, lámpa)',
      englishNote: 'Detailed rule texts are fully translated in English.',
    },
  },
  en: {
    layout: {
      subtitle: 'BE Category Towing Cockpit',
      nav: {
        home: 'Dashboard',
        checklist: 'Checklist',
        rules: 'Rules & Law',
      },
      language: 'Language',
      langHu: 'Magyar',
      langEn: 'English',
    },
    home: {
      badge: 'BE TOWING ASSISTANT & PROTOCOL',
      titleA: 'Hit the road',
      titleB: 'with maximum confidence',
      titleC: 'and full compliance.',
      description:
        'Interactive pre-departure checklist, country-specific towing requirements across 10 EU nations, and comprehensive traffic rules in one high-precision cockpit.',
      openChecklist: 'Launch Checklist',
      openRules: 'Explore Rules & Laws',
      heroAlt: 'Vehicle towing trailer on open road',
      quickCheck: 'Fast Inspection',
      quickTime: '~3 mins before trip',
      checklistTitle: 'Interactive Checklist',
      checklistDescription: '33-point safety inspection + auto-injected country requirements',
      rulesTitle: 'Traffic Law & EU Regulations',
      rulesDescription: 'Speed limits, weight limits, overtaking rules, and vignette requirements',
      open: 'Open',
      previewSuffix: 'preview',
      infoTitle: 'BE Category Essential Rules',
      point1: 'Max Gross Combination Mass: 4,250 kg (Towing vehicle max 3,500 kg)',
      point2: 'Optimal weight balance: 60% front / 40% rear, 50-100 kg tongue weight',
      point3: 'Highway speed limit when towing in HU: 80 km/h max, 50 km/h in urban areas',
      statChecklist: 'Checkpoints',
      statCountries: 'EU Country Rules',
      statRules: 'Traffic Laws',
      quickSpecsTitle: 'Critical Towing Specifications (BE)',
      specGrossWeight: '4,250 kg',
      specGrossWeightLabel: 'Max allowed combined gross mass',
      specTongueWeight: '50 - 100 kg',
      specTongueWeightLabel: 'Optimal tow ball downward pressure',
      specWeightRatio: '60% / 40%',
      specWeightRatioLabel: 'Weight distribution (Front / Rear)',
      specHighwaySpeed: '80 km/h',
      specHighwaySpeedLabel: 'Max highway towing speed (HU)',
    },
    checklist: {
      title: 'Pre-Departure Checklist',
      subtitle: 'Complete all steps before moving off for safe and fine-free towing',
      routeTitle: 'Travel Route & Transit Countries',
      routeDesc:
        'Select countries along your route. The checklist instantly injects mandatory local gear and vignette rules.',
      doneItems: 'done',
      remaining: 'remaining',
      reset: 'Reset All',
      allCategories: 'All Categories',
      filterAll: 'All',
      filterPending: 'Pending',
      filterDone: 'Done',
      allCompletedTitle: 'All Inspections Complete!',
      allCompletedDesc: 'Your vehicle and trailer combination is verified and ready. Safe travels!',
      englishNote: 'Checklist points are displayed in your chosen language.',
    },
    rules: {
      title: 'Traffic Law & International Rules',
      subtitle: 'Essential towing rules, speed restrictions, and transit obligations',
      searchPlaceholder: 'Search by rule, country, equipment, speed, vignette...',
      hungary: 'Hungary Traffic Law (KRESZ)',
      international: 'International Country Regulations',
      important: 'High Priority',
      filterAll: 'All',
      emptyTitle: 'No matching rules found',
      emptySubtitle: 'Try another keyword (e.g. vignette, speed, mirror, brakes)',
      englishNote: 'Rules and notes are fully translated in English.',
    },
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const getNestedValue = (tree: TranslationTree, key: string): string | undefined => {
  const path = key.split('.')
  let current: string | TranslationTree | undefined = tree

  for (const segment of path) {
    if (!current || typeof current === 'string' || !(segment in current)) {
      return undefined
    }
    current = current[segment]
  }

  return typeof current === 'string' ? current : undefined
}

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem('appLanguage')
    return savedLanguage === 'en' ? 'en' : 'hu'
  })

  const setLanguageWithPersistence = (nextLanguage: Language) => {
    localStorage.setItem('appLanguage', nextLanguage)
    setLanguage(nextLanguage)
  }

  const t = (key: string): string => {
    const localizedValue = getNestedValue(translations[language], key)
    if (localizedValue) {
      return localizedValue
    }

    const fallbackValue = getNestedValue(translations.hu, key)
    return fallbackValue ?? key
  }

  const value = useMemo(
    () => ({ language, setLanguage: setLanguageWithPersistence, t }),
    [language]
  )

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}
