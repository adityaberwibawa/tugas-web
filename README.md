# MIBER — Lap Microfiber

Landing page dan simulasi toko online untuk produk lap microfiber **MIBER**. Dibuat sebagai tugas mata kuliah Pemrograman Web, Program Studi Informatika, Universitas Muhammadiyah Malang.

Proyek ini murni frontend: HTML, CSS, dan JavaScript tanpa framework, tanpa build tool, dan tanpa backend.

## Fitur

- **Landing page responsif** — hero, keunggulan produk, katalog, dan footer.
- **Katalog 3 varian produk** — MIBER Reguler, MIBER Jumbo, dan MIBER Paket 3pcs.
- **Keranjang belanja** — atur jumlah dengan tombol +/−, lalu tambahkan ke keranjang.
  - Tersimpan otomatis di `localStorage` (`miber_cart`), tetap ada setelah halaman dimuat ulang.
  - Badge jumlah item di navigasi dan ringkasan total harga.
  - Kosongkan keranjang dengan konfirmasi.
- **Checkout dengan alamat bertingkat** — dropdown Provinsi → Kota/Kabupaten → Kecamatan → Kelurahan/Desa diisi otomatis dari API Wilayah Indonesia.
- **Validasi formulir** — login, registrasi, dan checkout divalidasi langsung di sisi klien dengan pesan kesalahan yang jelas.
- **Tampilkan/sembunyikan kata sandi** — tombol ikon mata pada form login dan registrasi.
- **Navigasi mobile** — menu hamburger yang dapat ditutup dengan klik di luar, tautan, atau tombol `Esc`.
- **Detail UX** — tombol kembali ke atas, animasi *reveal on scroll*, dan atribut aksesibilitas (`aria-label`, `aria-live`, `<dialog>`).

## Halaman

| File | Keterangan |
|---|---|
| `index.html` | Beranda: hero, manfaat, katalog, keranjang, dan dialog checkout |
| `login.html` | Form masuk (simulasi validasi frontend) |
| `register.html` | Form pendaftaran akun (simulasi validasi frontend) |

## Struktur Proyek

```
tugas_kelas/
├── index.html          # Halaman utama
├── login.html          # Halaman login
├── register.html       # Halaman registrasi
├── style.css           # Seluruh styling (desain responsif)
├── script.js           # Interaksi: menu, validasi, keranjang, checkout
├── penjelasan-api.md   # Dokumentasi teknis penggunaan API wilayah
├── README.md
└── img/
    ├── lap.png
    └── lap2.png
```

## Teknologi

- HTML5 semantik
- CSS3 (custom properties, grid, flexbox, media query)
- JavaScript ES5-style (IIFE, tanpa dependensi)
- [API Wilayah Indonesia](https://github.com/ibnux/data-indonesia) via `https://ibnux.github.io/data-indonesia` — gratis, tanpa API key

## Menjalankan Proyek

Tidak ada proses instalasi. Ada dua cara:

1. **Langsung** — buka `index.html` di browser.
2. **Server lokal** (disarankan agar `fetch` berjalan konsisten):

   ```bash
   # Python 3
   python -m http.server 8000

   # atau Node.js
   npx serve .
   ```

   Lalu buka `http://localhost:8000`.

> Dropdown wilayah pada checkout membutuhkan koneksi internet karena datanya diambil dari API eksternal.

## Alur Checkout

1. Pilih jumlah produk dan klik **Tambah ke keranjang**.
2. Klik **Checkout** untuk membuka dialog pesanan.
3. Isi nama penerima, no. HP, dan pilih wilayah lengkap (provinsi → kelurahan).
4. Klik **Buat pesanan** — pesanan disimulasikan berhasil, keranjang dikosongkan, dan dialog tertutup otomatis.

Penjelasan teknis lengkap mengenai pemanggilan API wilayah tersedia di [`penjelasan-api.md`](penjelasan-api.md).

## Keterbatasan

Proyek ini adalah **simulasi frontend**, bukan aplikasi produksi:

- Login dan registrasi tidak terhubung ke backend atau basis data — hanya validasi dan pesan sukses di browser.
- Keranjang dan pesanan tidak dikirim ke server mana pun; data keranjang hanya tersimpan di `localStorage`.
- Tidak ada halaman riwayat pesanan, pembayaran, atau manajemen stok.

---

© 2026 MIBER. Dibuat untuk keperluan pembelajaran.
