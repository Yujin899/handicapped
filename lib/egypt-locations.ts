export type City = {
  id: string
  name: string
  nameAr: string
}

export type Governorate = {
  id: string
  name: string
  nameAr: string
  cities: City[]
}

export const egyptLocations: Governorate[] = [
  {
    id: "cairo",
    name: "Cairo",
    nameAr: "القاهرة",
    cities: [
      { id: "nasr-city", name: "Nasr City", nameAr: "مدينة نصر" },
      { id: "maadi", name: "Maadi", nameAr: "المعادي" },
      { id: "heliopolis", name: "Heliopolis", nameAr: "مصر الجديدة" },
      { id: "downtown", name: "Downtown", nameAr: "وسط البلد" },
      { id: "shubra", name: "Shubra", nameAr: "شبرا" },
      { id: "zamalek", name: "Zamalek", nameAr: "الزمالك" },
      { id: "garden-city", name: "Garden City", nameAr: "جاردن سيتي" },
      { id: "new-cairo", name: "New Cairo", nameAr: "القاهرة الجديدة" },
      { id: "shorouk", name: "Shorouk City", nameAr: "مدينة الشروق" },
      { id: "madinaty", name: "Madinaty", nameAr: "مدينتي" },
    ],
  },
  {
    id: "giza",
    name: "Giza",
    nameAr: "الجيزة",
    cities: [
      { id: "dokki", name: "Dokki", nameAr: "الدقي" },
      { id: "mohandessin", name: "Mohandessin", nameAr: "المهندسين" },
      { id: "haram", name: "Haram", nameAr: "الهرم" },
      { id: "faisal", name: "Faisal", nameAr: "فيصل" },
      { id: "october-6th", name: "6th of October City", nameAr: "مدينة 6 أكتوبر" },
      { id: "sheikh-zayed", name: "Sheikh Zayed City", nameAr: "مدينة الشيخ زايد" },
      { id: "agouza", name: "Agouza", nameAr: "العجوزة" },
      { id: "imbaba", name: "Imbaba", nameAr: "إمبابة" },
    ],
  },
  {
    id: "alexandria",
    name: "Alexandria",
    nameAr: "الإسكندرية",
    cities: [
      { id: "smouha", name: "Smouha", nameAr: "سموحة" },
      { id: "montaza", name: "Montaza", nameAr: "المنتزة" },
      { id: "gleem", name: "Gleem", nameAr: "جليم" },
      { id: "sidi-gaber", name: "Sidi Gaber", nameAr: "سيدي جابر" },
      { id: "agami", name: "Agami", nameAr: "العجمي" },
      { id: "ibrahimiya", name: "Ibrahimiya", nameAr: "الإبراهيمية" },
      { id: "lauren", name: "Lauren", nameAr: "لوران" },
      { id: "rushdy", name: "Rushdy", nameAr: "رشدي" },
    ],
  },
  {
    id: "dakahlia",
    name: "Dakahlia",
    nameAr: "الدقهلية",
    cities: [
      { id: "mansoura", name: "Mansoura", nameAr: "المنصورة" },
      { id: "talkha", name: "Talkha", nameAr: "طلخا" },
      { id: "mit-ghamr", name: "Mit Ghamr", nameAr: "ميت غمر" },
      { id: "dekernes", name: "Dekernes", nameAr: "دكرنس" },
    ],
  },
  {
    id: "sharqia",
    name: "Sharqia",
    nameAr: "الشرقية",
    cities: [
      { id: "zagazig", name: "Zagazig", nameAr: "الزقازيق" },
      { id: "10th-of-ramadan", name: "10th of Ramadan City", nameAr: "مدينة العاشر من رمضان" },
      { id: "bilbeis", name: "Bilbeis", nameAr: "بلبيس" },
      { id: "minya-el-qamh", name: "Minya el Qamh", nameAr: "منيا القمح" },
    ],
  },
  {
    id: "gharbia",
    name: "Gharbia",
    nameAr: "الغربية",
    cities: [
      { id: "tanta", name: "Tanta", nameAr: "طنطا" },
      { id: "kafr-el-zayat", name: "Kafr el Zayat", nameAr: "كفر الزيات" },
      { id: "mehalla-el-kubra", name: "El Mahalla El Kubra", nameAr: "المحلة الكبرى" },
      { id: "zefta", name: "Zefta", nameAr: "زفتى" },
    ],
  },
  {
    id: "qalyubia",
    name: "Qalyubia",
    nameAr: "القليوبية",
    cities: [
      { id: "banha", name: "Banha", nameAr: "بنها" },
      { id: "shubra-el-kheima", name: "Shubra El Kheima", nameAr: "شبرا الخيمة" },
      { id: "obour", name: "Obour City", nameAr: "مدينة العبور" },
      { id: "qalyub", name: "Qalyub", nameAr: "قليوب" },
    ],
  },
  {
    id: "beheira",
    name: "Beheira",
    nameAr: "البحيرة",
    cities: [
      { id: "damanhour", name: "Damanhour", nameAr: "دمنهور" },
      { id: "kafr-el-dawwar", name: "Kafr el Dawwar", nameAr: "كفر الدوار" },
      { id: "rashid", name: "Rashid", nameAr: "رشيد" },
      { id: "edko", name: "Edko", nameAr: "إدكو" },
    ],
  },
  {
    id: "menofia",
    name: "Menofia",
    nameAr: "المنوفية",
    cities: [
      { id: "shibin-el-kom", name: "Shibin el Kom", nameAr: "شبين الكوم" },
      { id: "menouf", name: "Menouf", nameAr: "منوف" },
      { id: "ashmoun", name: "Ashmoun", nameAr: "أشمون" },
      { id: "quwaysna", name: "Quwaysna", nameAr: "قويسنا" },
      { id: "sadat", name: "Sadat City", nameAr: "مدينة السادات" },
    ],
  },
  {
    id: "fayoum",
    name: "Fayoum",
    nameAr: "الفيوم",
    cities: [
      { id: "fayoum-city", name: "Fayoum City", nameAr: "مدينة الفيوم" },
      { id: "its", name: "Itsa", nameAr: "إطسا" },
      { id: "tamiya", name: "Tamiya", nameAr: "طامية" },
      { id: "senuris", name: "Senuris", nameAr: "سنورس" },
    ],
  },
  {
    id: "kafr-el-sheikh",
    name: "Kafr El Sheikh",
    nameAr: "كفر الشيخ",
    cities: [
      { id: "kafr-el-sheikh-city", name: "Kafr el Sheikh City", nameAr: "مدينة كفر الشيخ" },
      { id: "desouk", name: "Desouk", nameAr: "دسوق" },
      { id: "metoubes", name: "Metoubes", nameAr: "مطوبس" },
      { id: "fua", name: "Fua", nameAr: "فوه" },
    ],
  },
  {
    id: "ismailia",
    name: "Ismailia",
    nameAr: "الإسماعيلية",
    cities: [
      { id: "ismailia-city", name: "Ismailia City", nameAr: "مدينة الإسماعيلية" },
      { id: "fayed", name: "Fayed", nameAr: "فايد" },
      { id: "qantara-west", name: "Qantara West", nameAr: "القنطرة غرب" },
    ],
  },
  {
    id: "beni-suef",
    name: "Beni Suef",
    nameAr: "بني سويف",
    cities: [
      { id: "beni-suef-city", name: "Beni Suef City", nameAr: "مدينة بني سويف" },
      { id: "nasser", name: "Nasser", nameAr: "ناصر" },
      { id: "wasta", name: "Wasta", nameAr: "الواسطى" },
    ],
  },
  {
    id: "minya",
    name: "Minya",
    nameAr: "المنيا",
    cities: [
      { id: "minya-city", name: "Minya City", nameAr: "مدينة المنيا" },
      { id: "malla-wi", name: "Mallawi", nameAr: "ملوي" },
      { id: "samalut", name: "Samalut", nameAr: "سمالوط" },
      { id: "abu-qurqas", name: "Abu Qurqas", nameAr: "أبو قرقاص" },
    ],
  },
  {
    id: "assiut",
    name: "Assiut",
    nameAr: "أسيوط",
    cities: [
      { id: "assiut-city", name: "Assiut City", nameAr: "مدينة أسيوط" },
      { id: "dayrout", name: "Dayrout", nameAr: "ديروط" },
      { id: "manfalut", name: "Manfalut", nameAr: "منفلوط" },
      { id: "abnoub", name: "Abnoub", nameAr: "أبنوب" },
    ],
  },
  {
    id: "sohag",
    name: "Sohag",
    nameAr: "سوهاج",
    cities: [
      { id: "sohag-city", name: "Sohag City", nameAr: "مدينة سوهاج" },
      { id: "akhmim", name: "Akhmim", nameAr: "أخميم" },
      { id: "girga", name: "Girga", nameAr: "جرجا" },
      { id: "tahta", name: "Tahta", nameAr: "طهطا" },
    ],
  },
  {
    id: "qena",
    name: "Qena",
    nameAr: "قنا",
    cities: [
      { id: "qena-city", name: "Qena City", nameAr: "مدينة قنا" },
      { id: "luxor-city", name: "Luxor City", nameAr: "مدينة الأقصر" }, // Luxor was part of Qena, now it's its own but often grouped or shared. Actually Luxor is a governorate now.
      { id: "nagh-hammadi", name: "Nagh Hammadi", nameAr: "نجع حمادي" },
      { id: "qus", name: "Qus", nameAr: "قوص" },
    ],
  },
  {
    id: "aswan",
    name: "Aswan",
    nameAr: "أسوان",
    cities: [
      { id: "aswan-city", name: "Aswan City", nameAr: "مدينة أسوان" },
      { id: "edfu", name: "Edfu", nameAr: "إدفو" },
      { id: "kom-ombo", name: "Kom Ombo", nameAr: "كوم أمبو" },
    ],
  },
  {
    id: "luxor",
    name: "Luxor",
    nameAr: "الأقصر",
    cities: [
      { id: "luxor-city", name: "Luxor City", nameAr: "مدينة الأقصر" },
      { id: "esna", name: "Esna", nameAr: "إسنا" },
      { id: "armant", name: "Armant", nameAr: "أرمنت" },
    ],
  },
  {
    id: "red-sea",
    name: "Red Sea",
    nameAr: "البحر الأحمر",
    cities: [
      { id: "hurghada", name: "Hurghada", nameAr: "الغردقة" },
      { id: "safaga", name: "Safaga", nameAr: "سفاجا" },
      { id: "marsa-alam", name: "Marsa Alam", nameAr: "مرسى علم" },
      { id: "quseir", name: "Quseir", nameAr: "القصير" },
    ],
  },
  {
    id: "suez",
    name: "Suez",
    nameAr: "السويس",
    cities: [
      { id: "suez-city", name: "Suez City", nameAr: "مدينة السويس" },
      { id: "ain-sokhna", name: "Ain Sokhna", nameAr: "العين السخنة" },
    ],
  },
  {
    id: "port-said",
    name: "Port Said",
    nameAr: "بور سعيد",
    cities: [
      { id: "port-said-city", name: "Port Said City", nameAr: "مدينة بورسعيد" },
      { id: "port-fouad", name: "Port Fouad", nameAr: "بورفؤاد" },
    ],
  },
  {
    id: "damietta",
    name: "Damietta",
    nameAr: "دمياط",
    cities: [
      { id: "damietta-city", name: "Damietta City", nameAr: "مدينة دمياط" },
      { id: "new-damietta", name: "New Damietta City", nameAr: "مدينة دمياط الجديدة" },
      { id: "ras-el-bar", name: "Ras el Bar", nameAr: "رأس البر" },
    ],
  },
  {
    id: "matrouh",
    name: "Matrouh",
    nameAr: "مطروح",
    cities: [
      { id: "marsa-matrouh", name: "Marsa Matrouh", nameAr: "مرسى مطروح" },
      { id: "siwa", name: "Siwa Oasis", nameAr: "واحة سيوة" },
      { id: "el-alamein", name: "El Alamein", nameAr: "العلمين" },
    ],
  },
  {
    id: "north-sinai",
    name: "North Sinai",
    nameAr: "شمال سيناء",
    cities: [
      { id: "arish", name: "Arish", nameAr: "العريش" },
      { id: "bir-al-abd", name: "Bir al-Abd", nameAr: "بئر العبد" },
    ],
  },
  {
    id: "south-sinai",
    name: "South Sinai",
    nameAr: "جنوب سيناء",
    cities: [
      { id: "sharm-el-sheikh", name: "Sharm El Sheikh", nameAr: "شرم الشيخ" },
      { id: "dahab", name: "Dahab", nameAr: "دهب" },
      { id: "nuweiba", name: "Nuweiba", nameAr: "نويبع" },
      { id: "saint-catherine", name: "Saint Catherine", nameAr: "سانت كاترين" },
    ],
  },
  {
    id: "new-valley",
    name: "New Valley",
    nameAr: "الوادي الجديد",
    cities: [
      { id: "kharga", name: "Kharga Oasis", nameAr: "الخارجة" },
      { id: "dakhla", name: "Dakhla Oasis", nameAr: "الداخلة" },
      { id: "farafra", name: "Farafra Oasis", nameAr: "الفرافرة" },
    ],
  },
]
