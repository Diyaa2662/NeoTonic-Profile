import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";
import Container from "../ui/Container";
import SectionTitle from "../ui/SectionTitle";

export default function Contact() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [sent, setSent] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: ربط مع backend/email service
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const contactInfo = [
    {
      Icon: Phone,
      label: t("contact.phone"),
      value: "+963 932 288 878",
      href: "tel:+963932288878",
      dir: "ltr",
    },
    {
      Icon: Mail,
      label: t("contact.email"),
      value: "info@neotonic.com",
      href: "mailto:info@neotonic.com",
      dir: "ltr",
    },
    {
      Icon: MapPin,
      label: t("contact.address"),
      value:
        t("contact.address") === "العنوان" ? "دمشق، سوريا" : "Damascus, Syria",
      href: null,
    },
    {
      Icon: Clock,
      label: t("contact.hours"),
      value:
        t("contact.hours") === "ساعات العمل"
          ? "السبت - الخميس: 9:00 - 17:00"
          : "Sat - Thu: 9:00 - 17:00",
      href: null,
    },
  ];

  return (
    <section
      id="contact"
      className="relative min-h-screen flex items-center justify-center py-32"
    >
      <Container className="relative z-10">
        <SectionTitle
          eyebrow={t("nav.contact")}
          title={t("contact.title")}
          subtitle={t("contact.subtitle")}
        />

        <div className="grid lg:grid-cols-5 gap-8 mt-20 max-w-6xl mx-auto">
          {/* معلومات التواصل */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-2 space-y-4"
          >
            {contactInfo.map((info, i) => {
              const { Icon } = info;
              const content = (
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center shrink-0">
                    <Icon size={20} className="text-brand-700" />
                  </div>
                  <div>
                    <p className="text-sm text-ink/50 mb-1">{info.label}</p>
                    <p
                      className="font-medium text-brand-800"
                      dir={info.dir || "auto"}
                    >
                      {info.value}
                    </p>
                  </div>
                </div>
              );

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  className="bg-white/60 backdrop-blur-md border border-white/70 rounded-2xl p-6 hover:bg-white hover:shadow-lg transition-all"
                >
                  {info.href ? (
                    <a href={info.href} className="block">
                      {content}
                    </a>
                  ) : (
                    content
                  )}
                </motion.div>
              );
            })}
          </motion.div>

          {/* الفورم */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-3"
          >
            <form
              onSubmit={handleSubmit}
              className="bg-white/60 backdrop-blur-xl border border-white/70 rounded-3xl p-8 md:p-10 shadow-xl shadow-brand-900/5"
            >
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  name="name"
                  required
                  placeholder={t("contact.form.name")}
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-5 py-4 rounded-xl bg-white/80 border border-brand-200/60 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all placeholder:text-ink/40"
                />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder={t("contact.form.email")}
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-5 py-4 rounded-xl bg-white/80 border border-brand-200/60 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all placeholder:text-ink/40"
                />
              </div>

              <input
                type="text"
                name="subject"
                placeholder={t("contact.form.subject")}
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-5 py-4 rounded-xl bg-white/80 border border-brand-200/60 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all placeholder:text-ink/40 mb-4"
              />

              <textarea
                name="message"
                required
                rows="5"
                placeholder={t("contact.form.message")}
                value={formData.message}
                onChange={handleChange}
                className="w-full px-5 py-4 rounded-xl bg-white/80 border border-brand-200/60 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all placeholder:text-ink/40 resize-none mb-6"
              />

              <button
                type="submit"
                disabled={sent}
                className="w-full group inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand-700 text-white font-medium rounded-full hover:bg-brand-800 transition-all shadow-lg shadow-brand-700/20 hover:shadow-brand-700/40 disabled:opacity-70"
              >
                {sent ? t("contact.form.success") : t("contact.form.send")}
                <Send
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
            </form>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
