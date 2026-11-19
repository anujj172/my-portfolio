export const profile = {
  name: "Anujin Erdenebaatar",
  role: "Мэдээллийн системийн менежментийн оюутан",
  bio: "Мэдээллийн системийн менежментийн чиглэлээр суралцдаг. Системийн шинжилгээ, бизнес процессыг сайжруулах төсөл дээр ажилласан бөгөөд SQL, ERP систем, өгөгдлийн шинжилгээгээр туршлагатай.",
  skillGroups: [
    ["Өгөгдөл ба систем", ["SQL", "MySQL", "PostgreSQL", "Excel", "Power BI", "ERP систем", "Системийн шинжилгээ", "Бизнес процессын шинжилгээ"]],
    ["Хөгжүүлэлт ба дизайн", ["C#", "JavaScript", "React", "Figma"]],
    ["Менежмент", ["Agile", "Word", "Excel", "Outlook"]],
  ],
  personal: [
    "Багаар ажиллах", "Харилцаа", "Асуудал шийдэх", "Шийдвэр гаргах", "Цаг төлөвлөлт",
    "Шинэ мэдлэг сурах", "Санаачлага", "Бүтээлч байдал", "Дарамтад ажиллах", "Манлайлал",
  ],
  experience: [
    {
      title: "Systems Analyst",
      org: "Mongol ID LLC",
      when: "2025.12 – 2026.05",
      points: [
        "Системийн шинжилгээ, бизнес процессыг сайжруулах төсөлд оролцсон.",
        "ERP системд санхүүгийн өгөгдлийг удирдаж, тайлан бэлтгэсэн.",
      ],
    },
    {
      title: "Гурван зуун жар Финанс ХХК",
      org: "Gurvan Zuun Jar Finance LLC",
      when: "2023 – 2024",
      points: ["Бичиг баримтыг ангилж, бүртгэсэн.", "Архивын ажил хийсэн."],
    },
  ],
  education: [
    { school: "Санхүү эдийн засгийн их сургууль", degree: "Мэдээллийн системийн менежментийн бакалавр", when: "2023 – 2027 (хүлээгдэж буй)" },
    { school: "48-р сургууль", degree: "Бүрэн дунд боловсрол", when: "2011 – 2023" },
  ],
  // type нь main.js дахь contactIcons-той таарна: phone, email, github
  contacts: [
    { type: "phone", label: "Утас", value: "+976 86886700", href: "tel:+97686886700" },
    { type: "email", label: "Имэйл", value: "anujinnerdenebaatar@gmail.com", href: "mailto:anujinnerdenebaatar@gmail.com" },
    { type: "github", label: "GitHub", value: "github.com/anujj172", href: "https://github.com/anujj172" },
  ],
};

export const projects = [
  {
    title: "Bouquet Studio",
    desc: "Цэцгийн дэлгүүрийн онлайн захиалгын систем. Хэрэглэгч цэцгээ өөрөө сонгож, баглаагаа 2D болон 3D-ээр урьдчилж харж, боодол, туузны өнгийг сонгоод захиална. Сагс, захиалга, профайл, нэвтрэлт бүгд ажилладаг.",
    tech: ["React", "Vite", "Tailwind CSS", "Supabase", "PostgreSQL", "React Router"],
    links: [
      { label: "GitHub", href: "https://github.com/anujj172/Bouquet-studio" },
      { label: "Figma", href: "https://www.figma.com/design/HBcqIymfWWKdVDFkBLgm7u/Flowershop?node-id=0-1" },
    ],
    images: ["/images/bouquet-studio.png" , "/images/bouquet-studio 3.png", "/images/bouquet-studio 2.png"], 
    hue: 340,
  },
  {
    title: "Санхүүгийн апп",
    desc: "React дээр хийсэн гар утасны апп. Хэрэглэгчийн өдөр тутмын орлого, зарлагыг бүртгэж, үргүй зардлыг хянах замаар хуримтлал үүсгэх дадлыг төлөвшүүлэх санхүүгийн апп. Хэзээ ч, хаанаас ч хурдан, ойлгомжтой хөтлөх боломжийг олгож, иргэдийн санхүүгийн боловсролыг дэмжинэ.",
    tech: ["React","Tailwind CSS", "Supabase"],
    links: [
      { label: "GitHub", href: "https://github.com/anujj172/finance-project" },
    ],
    images: ["/images/finance 1.png", "/images/finance 2.png"], 
    hue: 220,
  },
  {
    title: "MyOS портфолио",
    desc: "Энэ сайт. Цонх чирдэг, start цэстэй, ажилладаг хогийн савтай үйлдлийн систем загварын портфолио.",
    tech: ["JavaScript", "Vite", "CSS"],
    links: [{ label: "GitHub", href: "https://github.com/anujj172/my-portfolio" }],
    images: ["/images/portfolio-1.png", "/images/portfolio-2.png"],
    hue: 170,
  },
];