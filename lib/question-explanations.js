export const QUESTION_EXPLANATIONS = {
  c1: {
    why: "Pertanyaan ini mengukur kecepatan organisasi menjawab permintaan mendadak dari pimpinan. Ini membantu melihat apakah informasi operasional sudah siap pakai atau masih tersebar di banyak orang dan dokumen.",
    use: "Jawaban dipakai untuk menilai tingkat urgensi kebutuhan dashboard status, ringkasan pimpinan, dan pelacakan progres lintas tim.",
  },
  c2: {
    why: "Pertanyaan ini mengukur beban kerja administratif yang berulang. Leadership bisa melihat berapa banyak jam staf yang sebenarnya habis untuk kompilasi manual, bukan pekerjaan inti.",
    use: "Jawaban dipakai untuk menghitung potensi penghematan waktu jika pelaporan, rekap, atau pembaruan status diotomatisasi.",
  },
  c3: {
    why: "Pertanyaan ini mengukur kematangan penataan dokumen dan kebiasaan pencarian informasi. Tujuannya bukan mencari siapa yang rapi atau tidak, tetapi melihat seberapa besar ketergantungan pada memori personal.",
    use: "Jawaban dipakai untuk menentukan kebutuhan pengarsipan yang lebih tertata, pencarian dokumen yang lebih baik, dan standardisasi lokasi kerja.",
  },
  c4: {
    why: "Pertanyaan ini mengukur hambatan koordinasi lintas tim. Kalau skor rendah, biasanya masalahnya bukan niat kolaborasi, melainkan kurangnya visibilitas status dan informasi bersama.",
    use: "Jawaban dipakai untuk menentukan kebutuhan portal lintas unit, update status bersama, atau ringkasan progres yang bisa diakses tanpa harus chat satu per satu.",
  },
  c5: {
    why: "Pertanyaan terbuka ini sengaja meminta staf menyebut pekerjaan yang terasa paling tidak bernilai. Ini sering mengungkap beban tersembunyi yang tidak terlihat dari angka saja.",
    use: "Jawaban dipakai untuk menyusun daftar prioritas perbaikan cepat dan mengidentifikasi pekerjaan yang paling layak dihilangkan, disederhanakan, atau diotomatisasi.",
  },
  s1: {
    why: "Leadership perlu tahu apakah pengetahuan filing lama masih bisa diakses dengan cepat, terutama ketika ada isu koordinasi internasional yang muncul kembali setelah beberapa tahun.",
    use: "Jawaban dipakai untuk menilai kebutuhan arsip filing yang lebih dapat dicari, timeline historis, dan indeks dokumen lama.",
  },
  s2: {
    why: "Pertanyaan ini memetakan bagaimana status koordinasi antar-negara dipantau hari ini. Ini penting karena pekerjaan satelit sangat bergantung pada proses lintas administrasi yang berjalan lama.",
    use: "Jawaban dipakai untuk menentukan apakah tim butuh tracker koordinasi resmi, reminder deadline, atau single source of truth untuk filing aktif.",
  },
  s3: {
    why: "Pertanyaan ini mengukur volume surat koordinasi formal yang ditangani tim. Leadership bisa melihat seberapa besar porsi kerja komunikasi internasional yang bersifat rutin.",
    use: "Jawaban dipakai untuk menilai kebutuhan template surat, bank korespondensi, dan otomasi drafting atau pencatatan komunikasi.",
  },
  s4: {
    why: "Pertanyaan ini melihat apakah tim bisa membedakan deadline ITU yang benar-benar mendesak dari yang masih aman. Masalah di sini sering berarti informasi tersebar atau monitoring belum sistematis.",
    use: "Jawaban dipakai untuk menentukan kebutuhan reminder deadline, prioritas kerja otomatis, dan tampilan risiko filing.",
  },
  s5: {
    why: "Pertanyaan terbuka ini mencari aktivitas non-inti yang paling menyita waktu pada proses filing ITU. Leadership butuh ini untuk melihat bagian proses yang paling menggerus kapasitas tim.",
    use: "Jawaban dipakai untuk memilih bottleneck paling layak disederhanakan lebih dulu, misalnya pencarian dokumen, drafting status, atau ringkasan progres.",
  },
  b1: {
    why: "Pertanyaan ini mengukur seberapa cepat tim broadband menemukan status alokasi band frekuensi. Ini inti untuk respons kebijakan yang cepat dan konsisten.",
    use: "Jawaban dipakai untuk menentukan kebutuhan file master, katalog band, atau tampilan status frekuensi yang lebih terpusat.",
  },
  b2: {
    why: "Leadership perlu tahu berapa besar biaya waktu mingguan untuk menyiapkan rekap WRC-28. Pertanyaan ini menunjukkan beban koordinasi kebijakan yang saat ini masih manual.",
    use: "Jawaban dipakai untuk mengukur potensi otomatisasi rekap agenda item, dashboard posisi Indonesia, dan status readiness lintas agenda.",
  },
  b3: {
    why: "Pertanyaan ini memetakan aliran data monitoring dari UPT ke pusat. Nilai strategisnya adalah melihat apakah data lapangan sudah bisa dipercaya dan dibaca cepat saat dibutuhkan.",
    use: "Jawaban dipakai untuk menilai kebutuhan integrasi SIMS, standardisasi pelaporan UPT, atau dashboard monitoring terpusat.",
  },
  b4: {
    why: "Pertanyaan ini mengukur kemampuan tim mengidentifikasi agenda WRC-28 yang paling berisiko tertinggal. Untuk leadership, ini berhubungan langsung dengan prioritas kerja dan kesiapan posisi nasional.",
    use: "Jawaban dipakai untuk merancang dashboard prioritas agenda, alert kesiapan, dan tampilan gap yang lebih cepat dibaca.",
  },
  b5: {
    why: "Pertanyaan ini melihat titik awal investigasi saat ada gangguan atau pelanggaran frekuensi. Leadership bisa melihat apakah prosesnya berbasis data atau masih bergantung pada jalur informal.",
    use: "Jawaban dipakai untuk menentukan kebutuhan playbook investigasi, akses data gangguan, dan dashboard wilayah/interference.",
  },
  p1: {
    why: "Pertanyaan ini mengukur kemudahan akses regulasi ICAO dan IMO yang relevan. Dalam kerja internasional, keterlambatan akses referensi sering memperlambat kualitas respons.",
    use: "Jawaban dipakai untuk menentukan kebutuhan perpustakaan regulasi terpusat, tagging dokumen, dan versioning referensi.",
  },
  p2: {
    why: "Pertanyaan ini mengukur beban kerja bulanan untuk menyusun posisi Indonesia dalam koordinasi bilateral atau multilateral. Leadership perlu angka ini untuk memahami beban analisis yang tersebar.",
    use: "Jawaban dipakai untuk menilai kebutuhan reuse dokumen, basis posisi historis, dan alat penyusunan bahan koordinasi.",
  },
  p3: {
    why: "Pertanyaan ini melihat seberapa mudah perkembangan keputusan internasional dipantau. Jika sulit, risiko yang muncul adalah keputusan penting terlambat diketahui atau dipahami.",
    use: "Jawaban dipakai untuk menilai kebutuhan monitoring update regulasi dan ringkasan perubahan yang relevan dengan tugas harian.",
  },
  p4: {
    why: "Pertanyaan ini mengukur lead time penyusunan draft surat atau bahan rapat internasional. Leadership bisa melihat apakah hambatannya ada di referensi, koordinasi, atau review.",
    use: "Jawaban dipakai untuk menentukan apakah perlu template drafting, pustaka referensi, atau proses review yang lebih ringkas.",
  },
  p5: {
    why: "Pertanyaan terbuka ini mencari jenis informasi yang paling sering dibutuhkan tetapi sulit diperoleh. Ini membantu leadership melihat blind spot informasi dalam kerja koordinasi internasional.",
    use: "Jawaban dipakai untuk menyusun backlog kebutuhan data prioritas, misalnya status regulasi, histori korespondensi, atau referensi posisi Indonesia.",
  },
  st1: {
    why: "Pertanyaan ini mengukur volume permohonan sertifikasi yang aktif dipantau. Leadership memerlukan ukuran ini untuk memahami tekanan kerja dan potensi backlog.",
    use: "Jawaban dipakai untuk menilai kebutuhan dashboard antrean sertifikasi, prioritas penanganan, dan alokasi kapasitas tim.",
  },
  st2: {
    why: "Pertanyaan ini memetakan cara tim mengetahui status laporan hasil uji dari Balai Uji. Ini penting karena hambatan koordinasi eksternal sering memperlambat keseluruhan proses sertifikasi.",
    use: "Jawaban dipakai untuk menentukan kebutuhan tracking antar-lembaga, notifikasi status, dan standardisasi update dari Balai Uji.",
  },
  st3: {
    why: "Leadership perlu tahu berapa lama hanya untuk merekap status permohonan bulan berjalan. Ini menunjukkan seberapa besar biaya koordinasi dan kompilasi yang saat ini tidak bernilai tambah langsung.",
    use: "Jawaban dipakai untuk menentukan kebutuhan rekap otomatis, dashboard status bulanan, dan ringkasan progres lintas pemohon.",
  },
  st4: {
    why: "Pertanyaan ini mengukur seberapa mudah standar teknis yang relevan ditemukan ketika ada perangkat baru. Jika sulit, risiko yang muncul adalah penilaian lambat dan pengetahuan tersebar.",
    use: "Jawaban dipakai untuk merancang repositori standar teknis yang mudah dicari dan referensi evaluasi yang lebih konsisten.",
  },
  st5: {
    why: "Pertanyaan terbuka ini menangkap sumber frustrasi terbesar dalam proses sertifikasi. Sering kali justru di sinilah hambatan operasional yang paling mahal tersimpan.",
    use: "Jawaban dipakai untuk memilih perbaikan proses yang paling terasa dampaknya bagi tim, bukan hanya yang paling mudah dibangun.",
  },
  tu1: {
    why: "Pertanyaan ini mengukur volume surat yang diproses setiap minggu. Leadership butuh angka ini untuk memahami tekanan operasional tata usaha dan kebutuhan tracking yang lebih rapi.",
    use: "Jawaban dipakai untuk menilai kebutuhan log surat terpusat, prioritas disposisi, dan monitoring beban kerja mingguan.",
  },
  tu2: {
    why: "Pertanyaan ini mengukur kecepatan menjawab status tindak lanjut surat tertentu. Ini penting karena tata usaha sering menjadi titik pertama ketika pimpinan meminta status cepat.",
    use: "Jawaban dipakai untuk menentukan kebutuhan pelacakan disposisi yang lebih real-time dan mudah dibaca pimpinan.",
  },
  tu3: {
    why: "Pertanyaan ini memetakan cara data LAKIP atau SPBE dikumpulkan. Tujuannya melihat seberapa besar koordinasi pelaporan masih berjalan melalui jalur manual yang tidak konsisten.",
    use: "Jawaban dipakai untuk menilai kebutuhan form terpusat, template standar, dan alur pengumpulan data yang lebih tertib.",
  },
  tu4: {
    why: "Pertanyaan ini mengukur kemampuan mendeteksi surat yang sudah melewati tenggat tanpa cek manual satu per satu. Ini inti dari kendali operasional tata usaha.",
    use: "Jawaban dipakai untuk menentukan kebutuhan alert tenggat, dashboard aging surat, dan monitoring tindak lanjut yang lebih proaktif.",
  },
  tu5: {
    why: "Pertanyaan terbuka ini menangkap pekerjaan tata usaha yang terasa berat tetapi kurang terlihat hasilnya. Jawaban seperti ini sering menjadi dasar kuat untuk perbaikan yang paling dirasakan tim.",
    use: "Jawaban dipakai untuk memprioritaskan otomasi atau penyederhanaan pekerjaan administrasi dengan dampak nyata pada keseharian staf.",
  },
};
