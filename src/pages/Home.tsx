import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, ClipboardCheck, Shield } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

const Home = () => {
  const { t } = useLanguage()

  const features = [
    {
      icon: ClipboardCheck,
      title: t('home.checklistTitle'),
      description: t('home.checklistDescription'),
      color: 'from-blue-500 to-cyan-500',
      link: '/checklist',
      image: '/images/checklist.jpg',
    },
    {
      icon: BookOpen,
      title: t('home.rulesTitle'),
      description: t('home.rulesDescription'),
      color: 'from-cyan-500 to-sky-600',
      link: '/kresz',
      image: '/images/traffic%20regulations%20signs.jpg',
    },
  ]

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative overflow-hidden rounded-3xl border border-sky-100 bg-gradient-to-br from-sky-50 via-white to-cyan-50 p-4 md:p-8 mb-8"
      >
        <div className="absolute -top-16 -right-16 w-44 h-44 rounded-full bg-cyan-200/40 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 w-44 h-44 rounded-full bg-sky-200/50 blur-3xl" />

        <div className="relative grid lg:grid-cols-2 gap-6 lg:gap-10 items-center">
          <div className="text-left">
            <span className="inline-flex items-center rounded-full bg-white/90 px-4 py-1.5 text-sm font-semibold text-sky-700 border border-sky-200 shadow-sm mb-4">
              {t('home.badge')}
            </span>

            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-800 leading-tight mb-4">
              {t('home.titleA')}
              <span className="bg-gradient-to-r from-sky-600 to-cyan-500 bg-clip-text text-transparent"> {t('home.titleB')} </span>
              {t('home.titleC')}
            </h2>

            <p className="text-base md:text-lg text-slate-600 max-w-xl mb-6">
              {t('home.description')}
            </p>

            <div className="flex flex-wrap gap-3">
              <Link to="/checklist" className="btn-primary inline-flex items-center gap-2">
                {t('home.openChecklist')} <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/kresz" className="btn-secondary inline-flex items-center gap-2">
                {t('home.openRules')}
              </Link>
            </div>
          </div>

          <div className="relative">
            <motion.img
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              src="/images/IMG_0468.JPEG"
              alt={t('home.heroAlt')}
              className="w-full rounded-2xl shadow-2xl border border-white/70"
            />
            <div className="absolute top-4 right-4 rounded-xl bg-white/95 px-3 py-2 shadow-lg border border-sky-100">
              <p className="text-xs text-slate-500">{t('home.quickCheck')}</p>
              <p className="text-sm font-bold text-slate-800">{t('home.quickTime')}</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 + 0.4 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link to={feature.link} className="block">
              <div className="card h-full hover:shadow-2xl p-4 md:p-5 bg-white/90 backdrop-blur-sm">
                <img
                  src={feature.image}
                  alt={`${feature.title} ${t('home.previewSuffix')}`}
                  className="w-full h-40 object-cover rounded-xl border border-slate-100 mb-4"
                  loading="lazy"
                />
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 mx-auto`}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-center">
                  {feature.description}
                </p>
                <p className="text-center text-sm text-sky-700 font-semibold mt-4">
                  {t('home.open')} →
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="card bg-gradient-to-r from-sky-50 to-cyan-50 border-2 border-sky-200"
      >
        <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
          <Shield className="w-5 h-5 mr-2 text-blue-600" />
          {t('home.infoTitle')}
        </h3>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">✓</span>
            <span>{t('home.point1')}</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">✓</span>
            <span>{t('home.point2')}</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">✓</span>
            <span>{t('home.point3')}</span>
          </li>
        </ul>
      </motion.div>
    </div>
  )
}

export default Home

