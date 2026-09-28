import { useTranslation } from "react-i18next";
import { Phone, Mail, MapPin } from "lucide-react";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import Container from "../ui/Container";

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  const socials = [
    { Icon: FaFacebookF, href: "#" },
    { Icon: FaInstagram, href: "#" },
    { Icon: FaLinkedinIn, href: "#" },
  ];

  return (
    <footer className="bg-ink text-white/80 pt-20 pb-10 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-600/10 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />

      <Container className="relative">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-2">
            <h3 className="font-display text-3xl font-semibold text-white mb-4">
              NeoTonic
            </h3>
            <p className="text-white/60 leading-relaxed max-w-md">
              {t("footer.company")}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-5">
              {t("footer.quick_links")}
            </h4>
            <ul className="space-y-3">
              {["home", "about", "products", "contact"].map((k) => (
                <li key={k}>
                  <a
                    href={`#${k}`}
                    className="hover:text-brand-400 transition-colors"
                  >
                    {t(`nav.${k}`)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-5">
              {t("contact.title")}
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-brand-400 shrink-0" />
                <span dir="ltr">+963 932 288 878</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-brand-400 shrink-0" />
                <span>info@neotonic.com</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-brand-400 mt-1 shrink-0" />
                <span>{t("contact.address")}</span>
              </li>
            </ul>

            <div className="flex gap-3 mt-6">
              {socials.map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="w-10 h-10 rounded-full bg-white/5 hover:bg-brand-600 flex items-center justify-center transition-all hover:scale-110"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/50">
          <p>
            © {year} NeoTonic. {t("footer.rights")}.
          </p>
          <p className="text-gold/70">{t("hero.tagline")}</p>
        </div>
      </Container>
    </footer>
  );
}
