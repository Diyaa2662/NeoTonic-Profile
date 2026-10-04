import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { FlaskConical, Leaf, Microscope } from "lucide-react";
import Container from "../ui/Container";
import SectionTitle from "../ui/SectionTitle";

export default function About() {
  const { t } = useTranslation();

  const values = [
    { Icon: FlaskConical, key: "gmp" },
    { Icon: Leaf, key: "local" },
    { Icon: Microscope, key: "research" },
  ];

  return (
    <section
      id="about"
      className="relative min-h-screen flex items-center justify-center py-32"
    >
      <Container className="relative z-10">
        {/* ⬇️ العنوان والوصف داخل Container زجاجي */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9 }}
          className="max-w-4xl mx-auto"
        >
          <div className="relative glass-panel rounded-3xl p-8 md:p-12">
            <div className="absolute top-8 bottom-8 start-0 w-1 bg-gradient-to-b from-gold via-brand-500 to-gold rounded-full" />

            <SectionTitle
              eyebrow={t("nav.about")}
              title={t("about.title")}
              subtitle={t("about.description")}
            />
          </div>
        </motion.div>

        {/* الرسالة */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="mt-8 max-w-4xl mx-auto"
        >
          <div className="relative glass-panel rounded-3xl p-8 md:p-12">
            <div className="absolute top-8 bottom-8 start-0 w-1 bg-gradient-to-b from-gold via-brand-500 to-gold rounded-full" />

            <h3 className="font-display text-2xl md:text-3xl font-semibold text-brand-800 mb-4">
              {t("about.mission_title")}
            </h3>
            <p className="text-lg text-ink/70 leading-relaxed">
              {t("about.mission_text")}
            </p>
          </div>
        </motion.div>

        {/* القيم - 3 كروت */}
        <div className="grid md:grid-cols-3 gap-6 mt-16 max-w-5xl mx-auto">
          {values.map(({ Icon, key }, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: 0.1 * i }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group glass-panel rounded-2xl p-8 hover:shadow-xl transition-shadow"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Icon size={26} className="text-brand-700" />
              </div>
              <h4 className="font-display text-xl font-semibold text-brand-800 mb-3">
                {t(`about.values.${key}`)}
              </h4>
              <p className="text-ink/60 leading-relaxed">
                {t(`about.values.${key}_desc`)}
              </p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
