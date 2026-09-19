import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BookOpen,
  ClipboardCheck,
  ShieldCheck,
  Gauge,
  Scale,
  Anchor,
  CheckCircle2,
  Sparkles,
  Zap,
} from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

const Home = () => {
  const { t } = useLanguage()

  const quickSpecs = [
    {
      icon: Scale,
      value: t('home.specGrossWeight'),
      label: t('home.specGrossWeightLabel'),
      color: 'from-red-600/20 to-red-950/30',
      border: 'border-red-500/30',
      textColor: 'text-red-400',
    },
    {
      icon: Anchor,
      value: t('home.specTongueWeight'),
      label: t('home.specTongueWeightLabel'),
      color: 'from-white/10 to-white/5',
      border: 'border-white/20',
      textColor: 'text-white',
    },
    {
      icon: Zap,
      value: t('home.specWeightRatio'),
      label: t('home.specWeightRatioLabel'),
      color: 'from-red-500/15 to-rose-950/25',
      border: 'border-red-500/25',
      textColor: 'text-red-300',
    },
    {
      icon: Gauge,
      value: t('home.specHighwaySpeed'),
      label: t('home.specHighwaySpeedLabel'),
      color: 'from-red-600/25 to-red-900/20',
      border: 'border-red-500/35',
      textColor: 'text-red-400',
    },
  ]

  const features = [
    {
      icon: ClipboardCheck,
      title: t('home.checklistTitle'),
      description: t('home.checklistDescription'),
      badge: '33+ PONT',
      link: '/checklist',
      image: '/images/checklist.jpg',
      color: 'from-red-600 to-rose-700',
      glow: 'shadow-glow-red',
    },
    {
      icon: BookOpen,
      title: t('home.rulesTitle'),
      description: t('home.rulesDescription'),
      badge: '10 ORSZÁG',
      link: '/kresz',
      image: '/images/traffic%20regulations%20signs.jpg',
      color: 'from-neutral-800 to-red-900',
      glow: 'shadow-hud-card',
    },
  ]

  const importantPoints = [
    t('home.point1'),
    t('home.point2'),
    t('home.point3'),
  ]

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Cockpit Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl bg-[#111116]/95 backdrop-blur-2xl border border-white/[0.1] shadow-2xl p-6 md:p-10"
      >
        {/* Ambient red mesh inside card */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-red-600/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-red-900/15 blur-3xl pointer-events-none" />

        <div className="relative grid lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Copy & Actions */}
          <div className="lg:col-span-7 space-y-5 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/15 border border-red-500/30 text-red-300 text-xs font-mono font-bold tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-red-400" />
              <span>{t('home.badge')}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-[1.15]">
              {t('home.titleA')}{' '}
              <span className="bg-gradient-to-r from-red-500 via-rose-400 to-red-300 bg-clip-text text-transparent">
                {t('home.titleB')}
              </span>{' '}
              {t('home.titleC')}
            </h1>

            <p className="text-sm md:text-base text-slate-300 max-w-xl leading-relaxed">
              {t('home.description')}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link to="/checklist" className="btn-primary">
                <span>{t('home.openChecklist')}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/kresz" className="btn-secondary">
                <BookOpen className="w-4 h-4 text-slate-400" />
                <span>{t('home.openRules')}</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Hero Visual Frame */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-white/15 shadow-2xl group">
              <img
                src="/images/IMG_0468.JPEG"
                alt={t('home.heroAlt')}
                className="w-full h-56 sm:h-64 object-cover filter brightness-95 group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#08080a] via-[#08080a]/30 to-transparent" />
              
              {/* Floating HUD Badge */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between p-3 rounded-xl bg-[#14141a]/95 backdrop-blur-md border border-white/10 shadow-lg">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                  <div>
                    <p className="text-[11px] font-mono text-slate-400 uppercase">{t('home.quickCheck')}</p>
                    <p className="text-xs font-bold text-white">{t('home.quickTime')}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/40 font-bold">
                    BE SPEC
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Specs HUD Grid (Key Towing Parameters) */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-xs font-mono uppercase tracking-widest text-slate-300 font-bold flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-red-500" />
            {t('home.quickSpecsTitle')}
          </h2>
          <span className="text-[11px] font-mono text-red-400/90 font-semibold">KRESZ & BE Standard</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickSpecs.map((spec, i) => (
            <motion.div
              key={spec.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i + 0.2 }}
              className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${spec.color} p-4 border ${spec.border} backdrop-blur-xl shadow-lg`}
            >
              <div className="flex items-center justify-between mb-2">
                <spec.icon className={`w-5 h-5 ${spec.textColor}`} />
                <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
              </div>
              <div className={`text-xl sm:text-2xl font-bold font-display tracking-tight ${spec.textColor} mb-1`}>
                {spec.value}
              </div>
              <p className="text-[11px] text-slate-300 font-medium leading-tight">
                {spec.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Main Hub Navigation Cards */}
      <div className="grid md:grid-cols-2 gap-5">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15 + 0.3 }}
            whileHover={{ y: -3 }}
            className="group"
          >
            <Link to={feature.link} className="block h-full">
              <div className="h-full rounded-2xl bg-[#121217]/90 backdrop-blur-xl border border-white/[0.08] p-5 hover:border-red-500/50 hover:bg-[#191922] transition-all duration-300 shadow-xl relative overflow-hidden flex flex-col justify-between">
                <div>
                  {/* Card Image Frame */}
                  <div className="relative h-44 rounded-xl overflow-hidden mb-4 border border-white/5">
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="w-full h-full object-cover filter brightness-90 group-hover:scale-105 group-hover:brightness-100 transition-all duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121217] via-[#121217]/40 to-transparent" />
                    
                    {/* Badge top right */}
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md border border-white/15 text-xs font-mono font-bold text-white">
                      {feature.badge}
                    </div>

                    {/* Feature Icon pill */}
                    <div className={`absolute bottom-3 left-3 w-11 h-11 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg border border-white/20`}>
                      <feature.icon className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-red-400 transition-colors flex items-center justify-between">
                    <span>{feature.title}</span>
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed mb-4">
                    {feature.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-semibold text-red-400 group-hover:text-red-300">
                  <span className="font-mono tracking-wider">{t('home.open')}</span>
                  <div className="w-6 h-6 rounded-full bg-red-500/15 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-all">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Critical Rules Callout Box */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="rounded-2xl bg-gradient-to-br from-[#121218]/95 via-[#181216]/90 to-[#121218]/95 border border-red-500/30 p-5 md:p-6 shadow-xl relative overflow-hidden"
      >
        <div className="flex items-center gap-2.5 mb-4 text-red-400 font-bold text-base">
          <ShieldCheck className="w-5 h-5 text-red-500" />
          <span>{t('home.infoTitle')}</span>
        </div>

        <div className="grid sm:grid-cols-3 gap-3">
          {importantPoints.map((point, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2.5 p-3 rounded-xl bg-black/50 border border-white/10"
            >
              <div className="w-5 h-5 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-red-400" />
              </div>
              <span className="text-xs text-slate-200 leading-relaxed font-medium">
                {point}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export default Home


