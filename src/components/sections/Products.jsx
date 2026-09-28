import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import Container from "../ui/Container";
import SectionTitle from "../ui/SectionTitle";

// ⬇️ بيانات المنتجات (مؤقتاً — رح ننقلها لملف منفصل لاحقاً)
const PRODUCTS_DATA = {
  cold_pressed: [
    {
      name_ar: "زيت بذور البطم",
      name_en: "Pisticia Oil",
      part_ar: "البذور",
      part_en: "Seeds",
    },
    {
      name_ar: "زيت اللوز المر",
      name_en: "Bitter Almond Oil",
      part_ar: "المرة",
      part_en: "Fruit",
    },
    {
      name_ar: "زيت اللوز الحلو",
      name_en: "Sweet Almond Oil",
      part_ar: "المرة",
      part_en: "Fruit",
    },
    {
      name_ar: "زيت بذور العنب",
      name_en: "Grape Seed Oil",
      part_ar: "البذور",
      part_en: "Seeds",
    },
    {
      name_ar: "زيت الحبة السوداء",
      name_en: "Black Seed Oil",
      part_ar: "البذور",
      part_en: "Seeds",
    },
    {
      name_ar: "زيت بذور الكتان",
      name_en: "Linseed Oil",
      part_ar: "البذور",
      part_en: "Seeds",
    },
    {
      name_ar: "زيت اليانسون",
      name_en: "Anise Oil",
      part_ar: "المرة",
      part_en: "Fruit",
    },
    {
      name_ar: "زيت الغار",
      name_en: "Laurel Seed Oil",
      part_ar: "البذور",
      part_en: "Seeds",
    },
    {
      name_ar: "زيت الجزر الأصفر",
      name_en: "Yellow Carrot Oil",
      part_ar: "البذور",
      part_en: "Seeds",
    },
    {
      name_ar: "زيت جوز الهند",
      name_en: "Coconut Oil",
      part_ar: "اللب",
      part_en: "Copra",
    },
    {
      name_ar: "زيت لبان الذكر",
      name_en: "Frankincense Oil",
      part_ar: "الراتنج",
      part_en: "Resin",
    },
    {
      name_ar: "زيت بذور الخردل",
      name_en: "Mustard Seed Oil",
      part_ar: "البذور",
      part_en: "Seeds",
    },
    {
      name_ar: "زيت السمسم",
      name_en: "Sesame Oil",
      part_ar: "البذور",
      part_en: "Seeds",
    },
    {
      name_ar: "زيت المكاديميا",
      name_en: "Macadamia Oil",
      part_ar: "الجوزة",
      part_en: "Nutlet",
    },
    {
      name_ar: "زيت بذور البندورة",
      name_en: "Tomato Seed Oil",
      part_ar: "البذور",
      part_en: "Seeds",
    },
    {
      name_ar: "زيت بذور اليقطين",
      name_en: "Pumpkin Seed Oil",
      part_ar: "البذور",
      part_en: "Seeds",
    },
    {
      name_ar: "زيت جنين القمح",
      name_en: "Wheatgerm Oil",
      part_ar: "البذور",
      part_en: "Seeds",
    },
    {
      name_ar: "زيت الزيتون البكر",
      name_en: "Extra Virgin Olive Oil",
      part_ar: "الثمرة",
      part_en: "Fruit",
    },
    {
      name_ar: "زيت ثمرة الورد",
      name_en: "Rosehip Oil",
      part_ar: "الثمرة",
      part_en: "Fruit",
    },
    {
      name_ar: "زيت الرمان",
      name_en: "Pomegranate Seed Oil",
      part_ar: "البذور",
      part_en: "Seeds",
    },
    {
      name_ar: "خلاصة الألوفيرا",
      name_en: "Aloe Vera Oil",
      part_ar: "الساق",
      part_en: "Stem",
    },
  ],
  oil_extracts: [
    {
      name_ar: "خلاصة البابونج",
      name_en: "Chamomile Oil Extract",
      part_ar: "أزهار",
      part_en: "Flower",
      conc: "20%",
    },
    {
      name_ar: "خلاصة بذور الحلبة",
      name_en: "Fenugreek Seed Extract",
      part_ar: "البذور",
      part_en: "Seeds",
      conc: "20%",
    },
    {
      name_ar: "خلاصة زيت الليمون",
      name_en: "Lemon Oil Extract",
      part_ar: "قشور",
      part_en: "Peels",
      conc: "10%",
    },
    {
      name_ar: "خلاصة زيت البرتقال",
      name_en: "Orange Oil Extract",
      part_ar: "قشور",
      part_en: "Peels",
      conc: "10%",
    },
    {
      name_ar: "خلاصة بتلات الورد",
      name_en: "Rose Oil Extract",
      part_ar: "البتلات",
      part_en: "Petals",
      conc: "20%",
    },
    {
      name_ar: "خلاصة بذور السعد",
      name_en: "Saad Oil Extract",
      part_ar: "البذور",
      part_en: "Seeds",
      conc: "20%",
    },
    {
      name_ar: "خلاصة زيت النارنج",
      name_en: "Bitter Orange Oil",
      part_ar: "قشور",
      part_en: "Peels",
      conc: "10%",
    },
    {
      name_ar: "خلاصة بذور الزنجبيل",
      name_en: "Ginger Root Extract",
      part_ar: "جذور",
      part_en: "Roots",
      conc: "20%",
    },
  ],
  liquid_extracts: [
    {
      name_ar: "خلاصة عرق السوس",
      name_en: "Licorice Extract",
      part_ar: "الجذور",
      part_en: "Roots",
      conc: "20%",
    },
    {
      name_ar: "خلاصة الزعتر البري",
      name_en: "Thyme Liquid Extract",
      part_ar: "أوراق",
      part_en: "Leaves",
      conc: "20%",
    },
    {
      name_ar: "خلاصة الخيار",
      name_en: "Cucumber Extract",
      part_ar: "الثمرة",
      part_en: "Fruit",
      conc: "20%",
    },
    {
      name_ar: "خلاصة الشاي الأخضر",
      name_en: "Green Tea Extract",
      part_ar: "أوراق",
      part_en: "Leaves",
      conc: "20%",
    },
    {
      name_ar: "خلاصة إكليل الجبل",
      name_en: "Rosemary Extract",
      part_ar: "أوراق",
      part_en: "Leaves",
      conc: "20%",
    },
    {
      name_ar: "خلاصة أوراق الزيتون",
      name_en: "Olive Leaf Extract",
      part_ar: "أوراق",
      part_en: "Leaves",
      conc: "20%",
    },
    {
      name_ar: "خلاصة النعنع",
      name_en: "Peppermint Extract",
      part_ar: "أوراق",
      part_en: "Leaves",
      conc: "20%",
    },
  ],
  others: [
    { name_ar: "طحين اللوز كامل الدسم", name_en: "Full-fat Almond Flour" },
    { name_ar: "طحين اللوز منخفض الدسم", name_en: "Low-fat Almond Flour" },
    { name_ar: "طحين اليانسون كامل الدسم", name_en: "Full-fat Anise Flour" },
    { name_ar: "طحين اليانسون منخفض الدسم", name_en: "Low-fat Anise Flour" },
    { name_ar: "أوراق النعنع المجفف", name_en: "Dried Mint Leaves" },
    { name_ar: "طحين الخردل منخفض الدسم", name_en: "Low-fat Mustard Flour" },
  ],
};

export default function Products() {
  const { t, i18n } = useTranslation();
  const [activeCategory, setActiveCategory] = useState("cold_pressed");
  const lang = i18n.language;

  const categories = [
    { key: "cold_pressed", label: t("products.categories.cold_pressed") },
    { key: "oil_extracts", label: t("products.categories.oil_extracts") },
    { key: "liquid_extracts", label: t("products.categories.liquid_extracts") },
    { key: "others", label: t("products.categories.others") },
  ];

  const currentProducts = PRODUCTS_DATA[activeCategory] || [];

  return (
    <section
      id="products"
      className="relative min-h-screen flex items-center justify-center py-32"
    >
      <Container className="relative z-10">
        <SectionTitle
          eyebrow={t("nav.products")}
          title={t("products.title")}
          subtitle={t("products.subtitle")}
        />

        {/* التبويبات */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-wrap gap-3 justify-center mt-12 mb-12"
        >
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === cat.key
                  ? "bg-brand-700 text-white shadow-lg shadow-brand-700/30"
                  : "bg-white/60 backdrop-blur-md text-brand-700 border border-brand-200/60 hover:bg-white hover:border-brand-400"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </motion.div>

        {/* شبكة المنتجات */}
        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {currentProducts.map((product, i) => (
                <motion.div
                  key={product.name_en}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.5 }}
                  whileHover={{ y: -4 }}
                  className="group bg-white/60 backdrop-blur-md border border-white/70 rounded-2xl p-6 hover:bg-white hover:shadow-xl hover:shadow-brand-900/10 transition-all duration-300"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h4 className="font-display text-lg font-semibold text-brand-800 leading-tight">
                      {lang === "ar" ? product.name_ar : product.name_en}
                    </h4>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <span className="text-brand-700 text-xs font-bold">
                        {i + 1}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-ink/50 mb-4">
                    {lang === "ar" ? product.name_en : product.name_ar}
                  </p>

                  <div className="flex flex-wrap gap-2 text-xs">
                    {product.part_ar && (
                      <span className="px-3 py-1 rounded-full bg-brand-50 text-brand-700">
                        {lang === "ar" ? product.part_ar : product.part_en}
                      </span>
                    )}
                    {activeCategory === "cold_pressed" && (
                      <span className="px-3 py-1 rounded-full bg-gold/10 text-gold-dark">
                        {lang === "ar" ? "عصر بارد" : "Cold Pressed"}
                      </span>
                    )}
                    {product.conc && (
                      <span className="px-3 py-1 rounded-full bg-gold/10 text-yellow-800">
                        {product.conc}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </Container>
    </section>
  );
}
