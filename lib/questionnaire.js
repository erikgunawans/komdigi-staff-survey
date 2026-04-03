export const SUBDIRS = [
  {
    id: "satelit",
    emoji: "🛰️",
    name: "Layanan Satelit & Orbit",
    color: "#7c3aed",
    light: "#f3eeff",
    lead: "Tim Pak Surya",
    tagline: "Filing ITU · Slot orbit · Koordinasi internasional",
  },
  {
    id: "broadband",
    emoji: "📡",
    name: "Penataan Spektrum Broadband",
    color: "#0284c7",
    light: "#e0f2fe",
    lead: "Tim Pak Wijanarko",
    tagline: "Alokasi frekuensi · WRC-28 · Monitoring UPT",
  },
  {
    id: "penerbangan",
    emoji: "✈️",
    name: "Harmonisasi Penerbangan & Maritim",
    color: "#059669",
    light: "#d1fae5",
    lead: "Tim Harmonisasi",
    tagline: "ICAO · IMO · Koordinasi perjanjian internasional",
  },
  {
    id: "standarisasi",
    emoji: "🔬",
    name: "Standarisasi Teknis",
    color: "#d97706",
    light: "#fef3c7",
    lead: "Tim Standarisasi",
    tagline: "Sertifikasi perangkat · Balai Uji · Standar teknis",
  },
  {
    id: "tausiaha",
    emoji: "📬",
    name: "Tata Usaha & Umum",
    color: "#db2777",
    light: "#fce7f3",
    lead: "Tim Tata Usaha",
    tagline: "Surat-menyurat · Disposisi · Pelaporan",
  },
];

export const COMMON_QS = [
  {
    id: "c1",
    type: "scenario",
    q: "Bayangkan: Senin pagi, Pak Direktur tiba-tiba tanya kabar progres suatu urusan penting. Berapa lama biasanya Anda butuh waktu untuk kumpulkan jawaban yang lengkap?",
    emoji: "😅",
    options: [
      { val: 1, label: "< 5 menit — tinggal lihat catatan" },
      { val: 2, label: "15–30 menit — cari-cari dulu" },
      { val: 3, label: "1–2 jam — harus telepon sana-sini" },
      { val: 4, label: "Lebih dari 2 jam — perlu koordinasi banyak pihak" },
    ],
  },
  {
    id: "c2",
    type: "slider",
    q: "Berapa jam per minggu Anda habiskan untuk menyusun laporan atau rekap yang rasanya 'pekerjaan yang sama terus berulang'?",
    emoji: "📊",
    min: 0,
    max: 20,
    step: 1,
    unit: "jam/minggu",
    labels: ["Nol — aman", "4 jam", "8 jam", "12 jam", "16 jam+"],
  },
  {
    id: "c3",
    type: "mcq",
    q: "Kalau Anda mencari dokumen yang Anda buat sendiri 2 minggu lalu, di mana biasanya ketemu?",
    emoji: "🔍",
    options: [
      { val: "a", label: "Langsung ketemu — folder saya tertata rapi" },
      { val: "b", label: "Di email — search dulu" },
      { val: "c", label: "Di Google Drive — tapi harus ingat nama filenya" },
      { val: "d", label: "Tanya rekan kerja — biasanya mereka yang ingat" },
      { val: "e", label: "Cari agak lama — tersebar di beberapa tempat" },
    ],
  },
  {
    id: "c4",
    type: "rating",
    q: "Seberapa mudah Anda mendapat informasi terbaru dari tim/sub-direktorat lain tanpa harus kirim pesan atau telfon duluan?",
    emoji: "🤝",
    labels: ["Sangat Sulit", "Sulit", "Cukup", "Mudah", "Sangat Mudah"],
  },
  {
    id: "c5",
    type: "open",
    q: "Kalau ada satu hal dalam pekerjaan harian Anda yang bisa 'hilang begitu saja' besok — pekerjaan apa itu?",
    emoji: "✨",
    placeholder: "Ceritakan dengan bebas — tidak ada jawaban yang salah...",
  },
];

export const SPECIFIC_QS = {
  satelit: [
    {
      id: "s1",
      type: "scenario",
      q: "Berapa lama biasanya Anda butuh untuk menemukan dokumen filing ITU tertentu dari arsip lama — misalnya koordinasi dari 3 tahun lalu?",
      emoji: "🗂️",
      options: [
        { val: 1, label: "< 10 menit — saya tahu persis di mana" },
        { val: 2, label: "30 menit – 1 jam — cari di beberapa folder" },
        { val: 3, label: "1–3 jam — perlu tanya kolega juga" },
        { val: 4, label: "Lebih dari 3 jam atau tidak ketemu" },
      ],
    },
    {
      id: "s2",
      type: "mcq",
      q: "Bagaimana Anda saat ini memantau status koordinasi dengan administrasi negara lain untuk filing yang sedang berjalan?",
      emoji: "🌐",
      options: [
        { val: "a", label: "Spreadsheet yang saya update manual" },
        { val: "b", label: "Catatan di email / chat" },
        { val: "c", label: "Ada sistem — tapi tidak selalu up-to-date" },
        { val: "d", label: "Di kepala saya sendiri dan kolega dekat" },
        { val: "e", label: "Kombinasi beberapa cara di atas" },
      ],
    },
    {
      id: "s3",
      type: "slider",
      q: "Berapa banyak surat koordinasi formal (dalam Bahasa Inggris) yang tim Anda susun per bulan untuk dikirim ke administrasi asing?",
      emoji: "📨",
      min: 0,
      max: 30,
      step: 1,
      unit: "surat/bulan",
      labels: ["0", "5", "10", "20", "30+"],
    },
    {
      id: "s4",
      type: "rating",
      q: "Seberapa mudah Anda tahu deadline ITU mana yang paling mendesak untuk filing aktif Anda, tanpa perlu cek ulang dokumen satu per satu?",
      emoji: "⏰",
      labels: ["Sangat Susah", "Susah", "Lumayan", "Mudah", "Sangat Mudah"],
    },
    {
      id: "s5",
      type: "open",
      q: "Bagian mana dari proses filing ITU yang paling menyita waktu Anda — padahal Anda rasa bukan itu yang harusnya jadi fokus utama?",
      emoji: "💭",
      placeholder: "Misalnya: menyusun summary status, mencari dokumen lama, menyiapkan draft surat...",
    },
  ],
  broadband: [
    {
      id: "b1",
      type: "scenario",
      q: "Saat Anda perlu mengecek alokasi frekuensi untuk band tertentu, proses normalnya seperti apa?",
      emoji: "📋",
      options: [
        { val: 1, label: "Buka satu file master — selesai dalam menit" },
        { val: 2, label: "Cek beberapa sheet/dokumen berbeda" },
        { val: 3, label: "Masuk ke SIMS dulu, lalu cross-check manual" },
        { val: 4, label: "Tanya rekan yang lebih hafal datanya" },
      ],
    },
    {
      id: "b2",
      type: "slider",
      q: "Untuk membuat update status persiapan WRC-28 (semua agenda item) — berapa jam biasanya dibutuhkan untuk menyiapkan rekap mingguan?",
      emoji: "📡",
      min: 0,
      max: 12,
      step: 0.5,
      unit: "jam/minggu",
      labels: ["< 1 jam", "2–3 jam", "4–6 jam", "8 jam", "12 jam+"],
    },
    {
      id: "b3",
      type: "mcq",
      q: "Data monitoring dari 37 UPT di seluruh Indonesia — bagaimana biasanya data itu sampai ke meja Anda?",
      emoji: "🗺️",
      options: [
        { val: "a", label: "Real-time via SIMS — langsung bisa lihat" },
        { val: "b", label: "Laporan Excel periodik dari UPT masing-masing" },
        { val: "c", label: "Harus minta ke tim UPT kalau butuh" },
        { val: "d", label: "Campuran — tergantung UPT-nya" },
        { val: "e", label: "Jujur, aksesnya masih terbatas" },
      ],
    },
    {
      id: "b4",
      type: "rating",
      q: "Seberapa cepat Anda bisa identifikasi agenda item WRC-28 mana yang posisi Indonesia-nya belum siap atau butuh perhatian segera?",
      emoji: "⚡",
      labels: ["Sangat Lambat", "Lambat", "Cukup", "Cepat", "Sangat Cepat"],
    },
    {
      id: "b5",
      type: "scenario",
      q: "Kalau ada pertanyaan mendadak soal status interference atau pelanggaran frekuensi di suatu wilayah — dari mana Anda mulai?",
      emoji: "🔍",
      options: [
        { val: 1, label: "SIMS — datanya langsung ada" },
        { val: 2, label: "Kontak UPT setempat langsung" },
        { val: 3, label: "Cari laporan monitoring yang lalu" },
        { val: 4, label: "Perlu waktu karena datanya tersebar" },
      ],
    },
  ],
  penerbangan: [
    {
      id: "p1",
      type: "mcq",
      q: "Saat Anda perlu cek isi regulasi ICAO atau IMO yang relevan, bagaimana cara Anda mengaksesnya sehari-hari?",
      emoji: "📖",
      options: [
        { val: "a", label: "Ada folder Drive internal yang tertata — langsung cari di sana" },
        { val: "b", label: "Website resmi ICAO/IMO — cari manual" },
        { val: "c", label: "Simpan sendiri di laptop — tapi tidak selalu versi terbaru" },
        { val: "d", label: "Tanya rekan yang lebih sering pakai dokumen itu" },
        { val: "e", label: "Campuran beberapa cara" },
      ],
    },
    {
      id: "p2",
      type: "slider",
      q: "Berapa jam per bulan Anda habiskan untuk menyiapkan bahan input atau posisi Indonesia untuk koordinasi bilateral/multilateral frekuensi?",
      emoji: "🤝",
      min: 0,
      max: 40,
      step: 2,
      unit: "jam/bulan",
      labels: ["< 5 jam", "10 jam", "20 jam", "30 jam", "40 jam+"],
    },
    {
      id: "p3",
      type: "rating",
      q: "Seberapa mudah Anda memantau perkembangan keputusan frekuensi internasional (ICAO, IMO, ITU-R) yang relevan dengan tugas harian Anda?",
      emoji: "🌏",
      labels: ["Sangat Sulit", "Sulit", "Lumayan", "Mudah", "Sangat Mudah"],
    },
    {
      id: "p4",
      type: "scenario",
      q: "Ketika perlu menyusun draft surat koordinasi atau input untuk pertemuan internasional — berapa lama persiapannya?",
      emoji: "✍️",
      options: [
        { val: 1, label: "< 2 jam — punya template yang bagus" },
        { val: 2, label: "Setengah hari — perlu cari referensi dulu" },
        { val: 3, label: "1–2 hari — koordinasi internal dan cari dokumen" },
        { val: 4, label: "Lebih dari 2 hari — proses reviewnya panjang" },
      ],
    },
    {
      id: "p5",
      type: "open",
      q: "Dalam koordinasi frekuensi internasional (penerbangan/maritim), informasi apa yang paling sering Anda butuhkan tapi susah didapat dengan cepat?",
      emoji: "💭",
      placeholder: "Misalnya: status koordinasi negara tetangga, perubahan regulasi terbaru, riwayat korespondensi...",
    },
  ],
  standarisasi: [
    {
      id: "st1",
      type: "slider",
      q: "Berapa banyak permohonan sertifikasi perangkat yang sedang dalam proses aktif yang perlu Anda pantau saat ini (atau rata-rata per bulan)?",
      emoji: "📱",
      min: 0,
      max: 100,
      step: 5,
      unit: "permohonan",
      labels: ["< 10", "25", "50", "75", "100+"],
    },
    {
      id: "st2",
      type: "mcq",
      q: "Bagaimana Anda tahu status terkini laporan hasil uji dari Balai Uji yang ditunjuk?",
      emoji: "🔬",
      options: [
        { val: "a", label: "Balai Uji kirim langsung — ada sistem tracking" },
        { val: "b", label: "Harus aktif tanya ke Balai Uji" },
        { val: "c", label: "Email atau WhatsApp informal dari PIC-nya" },
        { val: "d", label: "Tunggu laporan akhir masuk — tidak ada update interim" },
        { val: "e", label: "Tiap Balai Uji caranya berbeda-beda" },
      ],
    },
    {
      id: "st3",
      type: "scenario",
      q: "Untuk merekap status semua permohonan sertifikasi bulan ini — berapa lama biasanya?",
      emoji: "📊",
      options: [
        { val: 1, label: "< 30 menit — datanya sudah terkumpul rapi" },
        { val: 2, label: "2–4 jam — perlu compile dari beberapa sumber" },
        { val: 3, label: "Setengah hari — koordinasi dengan Balai Uji dulu" },
        { val: 4, label: "Lebih dari sehari — datanya tersebar dan tidak konsisten" },
      ],
    },
    {
      id: "st4",
      type: "rating",
      q: "Seberapa mudah Anda menemukan standar teknis yang relevan ketika mau menyusun rekomendasi atau evaluasi perangkat baru?",
      emoji: "📐",
      labels: ["Sangat Sulit", "Sulit", "Lumayan", "Mudah", "Sangat Mudah"],
    },
    {
      id: "st5",
      type: "open",
      q: "Kalau ada satu hal dalam proses sertifikasi yang paling sering bikin frustrasi atau memperlambat pekerjaan — apa itu?",
      emoji: "😤",
      placeholder: "Ceritakan jujur — jawaban ini sangat membantu kami...",
    },
  ],
  tausiaha: [
    {
      id: "tu1",
      type: "slider",
      q: "Berapa jumlah surat masuk (rata-rata) yang perlu diproses dan didisposisi per minggu di unit Anda?",
      emoji: "📬",
      min: 0,
      max: 100,
      step: 5,
      unit: "surat/minggu",
      labels: ["< 10", "25", "50", "75", "100+"],
    },
    {
      id: "tu2",
      type: "scenario",
      q: "Kalau Direktur tanya 'surat dari Kemhan minggu lalu — sudah ada tindak lanjutnya?' — berapa lama Anda bisa jawab?",
      emoji: "🕐",
      options: [
        { val: 1, label: "Langsung tahu — ada log yang terupdate" },
        { val: 2, label: "5–15 menit — cek log surat manual" },
        { val: 3, label: "30 menit – 1 jam — tanya ke beberapa pihak" },
        { val: 4, label: "Perlu waktu lebih — tracking tidak tersentralisasi" },
      ],
    },
    {
      id: "tu3",
      type: "mcq",
      q: "Untuk LAKIP atau evaluasi SPBE — bagaimana biasanya data dari sub-tim dikumpulkan?",
      emoji: "📋",
      options: [
        { val: "a", label: "Pakai form/template terpusat — lumayan lancar" },
        { val: "b", label: "Minta via email ke setiap sub-tim — lama" },
        { val: "c", label: "WhatsApp group — tidak konsisten formatnya" },
        { val: "d", label: "Rapat koordinasi khusus — memakan banyak waktu" },
        { val: "e", label: "Campuran cara di atas tergantung musim laporan" },
      ],
    },
    {
      id: "tu4",
      type: "rating",
      q: "Seberapa mudah Anda mengetahui surat mana yang sudah melewati batas waktu tindak lanjut — tanpa harus cek satu per satu?",
      emoji: "⚠️",
      labels: ["Sangat Sulit", "Sulit", "Lumayan", "Mudah", "Sangat Mudah"],
    },
    {
      id: "tu5",
      type: "open",
      q: "Dalam pekerjaan Tata Usaha sehari-hari, apa yang paling sering terasa seperti 'kerja keras tapi hasilnya tidak kelihatan'?",
      emoji: "💼",
      placeholder: "Misalnya: menyiapkan undangan rapat, rekap disposisi, arsip dokumen...",
    },
  ],
};

export function getSubdirById(subdirId) {
  return SUBDIRS.find((subdir) => subdir.id === subdirId) ?? null;
}

export function getQuestionsForSubdir(subdirId) {
  return subdirId ? [...COMMON_QS, ...(SPECIFIC_QS[subdirId] ?? [])] : [];
}

export function getQuestionById(questionId, subdirId) {
  return getQuestionsForSubdir(subdirId).find((question) => question.id === questionId) ?? null;
}

export function findFirstIncompleteStep(subdirId, answers) {
  const questions = getQuestionsForSubdir(subdirId);
  const index = questions.findIndex((question) => {
    const value = answers[question.id];
    return value === undefined || value === "";
  });

  return index === -1 ? Math.max(questions.length - 1, 0) : index;
}
