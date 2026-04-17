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
      subtitle: 'BE Kategória Segédlet',
      nav: {
        home: 'Főoldal',
        checklist: 'Ellenőrzőlista',
        rules: 'KRESZ',
      },
      language: 'Nyelv',
      langHu: 'Magyar nyelv',
      langEn: 'Angol nyelv',
    },
    home: {
      badge: 'BE kategória segédlet',
      titleA: 'Első indulásra',
      titleB: 'magabiztosan',
      titleC: 'és biztonságosan.',
      description:
        'A Ready2Tow egy helyen ad ellenőrzőlistát és gyors KRESZ referenciát, hogy ne maradjon ki semmi indulás előtt.',
      openChecklist: 'Lista megnyitása',
      openRules: 'KRESZ áttekintés',
      heroAlt: 'Vontatást ábrázoló fotó',
      quickCheck: 'Gyors ellenőrzés',
      quickTime: '2 perc indulás előtt',
      checklistTitle: 'Ellenőrzőlista',
      checklistDescription: 'Interaktív lista az indulás előtti ellenőrzéshez',
      rulesTitle: 'KRESZ Referencia',
      rulesDescription: 'BE kategóriás közlekedési szabályok',
      open: 'Megnyitas',
      previewSuffix: 'előnézet',
      infoTitle: 'Fontos tudnivalók',
      point1: 'Mindig ellenőrizd a pótkocsi és a vonóhorog állapotát',
      point2: 'Győződj meg a megfelelő terhelésről és rögzítésről',
      point3: 'Tartsd be a sebességkorlátozásokat vontatás közben',
    },
    checklist: {
      title: 'Indulás Előtti Ellenőrzőlista',
      subtitle: 'Menj végig minden ponton az indulás előtt a biztonságos vontatásért',
      routeTitle: 'Utazási Útvonal',
      routeDesc:
        'Válaszd ki, mely országokon keresztül fogsz vontatni. Az ellenőrzőlista automatikusan frissül az adott ország szabályai szerint.',
      doneItems: 'elem kész',
      remaining: 'hátra',
      reset: 'Újra',
      englishNote: 'A részletes pontok jelenleg magyar nyelven szerepelnek.',
    },
    rules: {
      title: 'KRESZ Referencia - BE Kategória',
      subtitle: 'Fontos közlekedési szabályok pótkocsival való vontatáshoz',
      searchPlaceholder: 'Keresés a szabályok között...',
      hungary: 'Magyarország',
      international: 'Nemzetközi Szabályok',
      important: 'Fontos!',
      emptyTitle: 'Nem található ilyen szabály',
      emptySubtitle: 'Próbálj meg más keresési kifejezést használni',
      englishNote: 'A részletes szabályok jelenleg magyar nyelven olvashatók.',
    },
  },
  en: {
    layout: {
      subtitle: 'BE Category Assistant',
      nav: {
        home: 'Home',
        checklist: 'Checklist',
        rules: 'Rules',
      },
      language: 'Language',
      langHu: 'Hungarian language',
      langEn: 'English language',
    },
    home: {
      badge: 'BE category assistant',
      titleA: 'Start every trip',
      titleB: 'confidently',
      titleC: 'and safely.',
      description:
        'Ready2Tow gives you a departure checklist and a quick traffic rules reference in one place, so nothing gets missed before towing.',
      openChecklist: 'Open checklist',
      openRules: 'Open rules',
      heroAlt: 'Towing photo scene',
      quickCheck: 'Quick check',
      quickTime: '2 minutes before departure',
      checklistTitle: 'Checklist',
      checklistDescription: 'Interactive pre-departure towing checklist',
      rulesTitle: 'Rules Reference',
      rulesDescription: 'BE category traffic essentials',
      open: 'Open',
      previewSuffix: 'preview',
      infoTitle: 'Important notes',
      point1: 'Always inspect the trailer and tow hitch before departure',
      point2: 'Confirm correct load distribution and secure fastening',
      point3: 'Follow speed limits while towing',
    },
    checklist: {
      title: 'Pre-Departure Checklist',
      subtitle: 'Go through each item before departure for safer towing',
      routeTitle: 'Travel Route',
      routeDesc:
        'Select countries on your route. The checklist updates automatically with country-specific requirements.',
      doneItems: 'items done',
      remaining: 'remaining',
      reset: 'Reset',
      englishNote: 'Detailed checklist items are currently displayed in Hungarian.',
    },
    rules: {
      title: 'Rules Reference - BE Category',
      subtitle: 'Key traffic rules for towing with a trailer',
      searchPlaceholder: 'Search rules...',
      hungary: 'Hungary',
      international: 'International Rules',
      important: 'Important!',
      emptyTitle: 'No matching rule found',
      emptySubtitle: 'Try a different search phrase',
      englishNote: 'Detailed rule texts are currently displayed in Hungarian.',
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
