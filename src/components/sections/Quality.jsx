import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Award, ShieldCheck, Beaker, Leaf } from "lucide-react";
import Container from "../ui/Container";
import SectionTitle from "../ui/SectionTitle";

export default function Quality() {
  const { t } = useTranslation();

  const features = [
    {
      Icon: ShieldCheck,
      title_ar: "معايير GMP",
      title_en: "GMP Standards",
      desc_ar: "منشأة مصممة بالكامل وفق معايير التصنيع الجيد",
      desc_en:
        "Facility fully designed according to Good Manufacturing Practice",
    },
    {
      Icon: Beaker,
      title_ar: "معدات مخصصة",
      title_en: "Custom Equipment",
      desc_ar: "معدات مصممة بأيدي مهندسينا لعمليات العصر والاستخلاص والتقطير",
      desc_en:
        "Equipment designed by our engineers for pressing, extraction, and distillation",
    },
    {
      Icon: Leaf,
      title_ar: "خامات محلية",
      title_en: "Local Raw Materials",
      desc_ar: "نعتمد على الثروة النباتية في بلدنا",
      desc_en: "We rely on the botanical wealth of our country",
    },
    {
      Icon: Award,
      title_ar: "جودة مضمونة",
      title_en: "Guaranteed Quality",
      desc_ar: "رقابة صارمة على كل مرحلة من مراحل الإنتاج",
      desc_en: "Strict control at every stage of production",
    },
  ];

  return (
    <section
      id="quality"
      className="relative min-h-screen flex items-center justify-center py-32"
    >
      <Container className="relative z-10">
        <SectionTitle
          eyebrow={t("nav.quality")}
          title={t("quality.title")}
          subtitle={t("quality.subtitle")}
        />

        <div className="grid md:grid-cols-2 gap-6 mt-20 max-w-5xl mx-auto">
          {features.map((feature, i) => {
            const { Icon } = feature;
            const lang = t("nav.home") === "الرئيسية" ? "ar" : "en";
            const title = lang === "ar" ? feature.title_ar : feature.title_en;
            const desc = lang === "ar" ? feature.desc_ar : feature.desc_en;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.7, delay: i * 0.1 }}
                className="group relative bg-white/50 backdrop-blur-xl border border-white/60 rounded-3xl p-8 hover:bg-white/70 transition-all duration-500 overflow-hidden"
              >
                {/* خلفية زخرفية */}
                <div className="absolute -top-10 -end-10 w-32 h-32 rounded-full bg-brand-100/40 blur-2xl group-hover:bg-gold/20 transition-colors duration-500" />

                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                    <Icon size={28} className="text-brand-700" />
                  </div>
                  <h3 className="font-display text-2xl font-semibold text-brand-800 mb-3">
                    {title}
                  </h3>
                  <p className="text-ink/60 leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
