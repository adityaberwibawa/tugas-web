# Penjelasan Penggunaan API — MIBER (Checkout Wilayah Indonesia)

Dokumen ini menjelaskan proses kode penggunaan API eksternal pada proyek MIBER.

## 1. Ringkasan

* **Satu-satunya API eksternal:** API Wilayah Indonesia (Emsifa / ibnux, gratis tanpa key).
* **Lokasi kode:** `script.js:275-403` (bagian `3b. Checkout + API Wilayah Indonesia`), dipicu dari `index.html:118-151` (dialog checkout).
* **Tujuan:** Mengisi dropdown bertingkat Provinsi → Kota/Kabupaten → Kecamatan → Kelurahan/Desa secara dinamis saat checkout, tanpa harus menyimpan ribuan data wilayah di repo.
* **Teknik:** `fetch()` + `Promise (.then/.catch)`, tanpa library tambahan.

## 2. Basis URL dan Endpoint

Didefinisikan di `script.js:289`:

```js
var WIL_BASE = 'https://ibnux.github.io/data-indonesia';
```

| Tahap | URL | Dipanggil di | Mengisi select |
|---|---|---|---|
| Provinsi | `GET {WIL_BASE}/provinsi.json` | `script.js:336-340` (`loadProvinces`) | `co-province` (`index.html:127-129`) |
| Kota/Kabupaten | `GET {WIL_BASE}/kabupaten/{provinsiId}.json` | `script.js:347-354` | `coRegency` (`index.html:131-133`) |
| Kecamatan | `GET {WIL_BASE}/kecamatan/{kabupatenId}.json` | `script.js:355-360` | `coDistrict` (`index.html:135-137`) |
| Kelurahan/Desa | `GET {WIL_BASE}/kelurahan/{kecamatanId}.json` | `script.js:361-365` | `coVillage` (`index.html:139-141`) |

Format data tiap endpoint adalah array JSON:

```json
[{ "id": "11", "nama": "ACEH" }]
```

Kode membaca `it.nama || it.name` di `script.js:300` agar toleran terhadap variasi field.

## 3. Alur Lengkap (End-to-End)

1. User menambah produk ke keranjang (logika `localStorage`, bukan API) — `script.js:242-274`.
2. User klik tombol **Checkout** (`#checkout-btn`, `index.html:110`).
3. Handler di `script.js:369-375`:
   * Salin ringkasan keranjang (`cartText`) ke `coSummary`.
   * Kosongkan error/success lama.
   * Panggil `loadProvinces()`.
   * Tampilkan `<dialog>` via `dialog.showModal()`.
4. `loadProvinces()` di `script.js:336-340`:
   * Jika `provincesLoaded === true`, tidak fetch ulang (cache sederhana).
   * Jika belum, panggil `fetchWilayah(.../provinsi.json, coProvince, ...)`.
   * Set `provincesLoaded = true` hanya jika hasil `true`.
5. User pilih provinsi → event `change` di `script.js:347-354`:
   * Reset 3 select di bawahnya ke status loading/disabled via `setLoading()`.
   * Jika value kosong, berhenti (tidak fetch).
   * Jika ada value, fetch kabupaten lalu isi `coRegency`.
6. Pola yang sama berulang untuk `coRegency` (`script.js:355-360`) dan `coDistrict` (`script.js:361-365`).
7. User lengkapi nama, HP, alamat jalan, lalu submit (`script.js:380-402`):
   * Validasi manual (bukan validasi API).
   * Rangkai alamat lengkap memakai `selName()` + `coAddress`.
   * Tampilkan pesan sukses, kosongkan keranjang, reset form + dropdown wilayah, tutup dialog setelah 3,5 detik.

## 4. Fungsi per Fungsi

### 4.1 `fillSelect(sel, items, placeholder)` — `script.js:292-307`

* Kosongkan `sel.innerHTML`.
* Tambah 1 `<option value="">` sebagai placeholder dan `selected`.
* Loop `items`: buat `<option>` dengan:
  * `o.value = it.id` — ID dipakai untuk URL tahap berikutnya.
  * `o.textContent = label` — nama tampil.
  * `o.dataset.name = label` — nama disimpan untuk perangkaian alamat akhir.

### 4.2 `setLoading(sel, msg)` — `script.js:308-316`

* Kosongkan select, isi 1 option `Memuat…` / `Pilih provinsi dulu` / dsb.
* `sel.disabled = true` agar user tidak bisa memilih saat data belum siap.
* Dipakai untuk 3状态: loading, instruksi (pilih parent dulu), dan error ringan.

### 4.3 `fetchWilayah(url, sel, placeholder, emptyMsg)` — `script.js:317-335`

Inti semua panggilan API:

```js
setLoading(sel, 'Memuat…');
return fetch(url).then(function (res) {
  if (!res.ok) throw new Error('HTTP ' + res.status);
  return res.json();
}).then(function (data) {
  if (!data || data.length === 0) {
    setLoading(sel, emptyMsg || 'Data kosong');
    return false;
  }
  fillSelect(sel, data, placeholder);
  sel.disabled = false;
  return true;
}).catch(function () {
  fillSelect(sel, [], 'Gagal memuat — pilih ulang untuk coba lagi');
  sel.disabled = false;
  return false;
});
```

Penjelasan tahap:
1. Tampilkan status loading dulu (UX).
2. `fetch(url)` — request GET asinkron.
3. Cek `res.ok`; jika status 404/500, lempar error agar masuk `catch`.
4. `res.json()` — parse body JSON.
5. Jika array kosong/null → tampilkan `emptyMsg`, return `false`.
6. Jika ada data → `fillSelect()` + enable, return `true`.
7. Jika network error / JSON rusak / HTTP error → tampilkan pesan gagal tapi tetap enable agar user bisa memicu `change` ulang untuk retry. Return `false`.

Return `true/false` dipakai oleh `loadProvinces()` untuk menentukan `provincesLoaded`.

### 4.4 `loadProvinces()` — `script.js:336-340`

* Guard: `if (provincesLoaded || !coProvince) return;`
* Fetch sekali saja. Jika gagal (`ok !== true`), `provincesLoaded` tetap `false` sehingga klik Checkout berikutnya akan mencoba lagi.

### 4.5 `selName(sel)` — `script.js:341-344`

* Ambil `selectedOptions[0].dataset.name`, fallback ke `textContent`.
* Dipakai saat submit untuk merangkai alamat manusiawi, bukan ID.

### 4.6 Handler `change` berjenjang — `script.js:346-366`

Contoh provinsi:

```js
coProvince.addEventListener('change', function () {
  if (!provincesLoaded && !coProvince.value) { loadProvinces(); return; }
  setLoading(coRegency, 'Pilih provinsi dulu');
  setLoading(coDistrict, 'Pilih kota dulu');
  setLoading(coVillage, 'Pilih kecamatan dulu');
  if (!coProvince.value) return;
  fetchWilayah(WIL_BASE + '/kabupaten/' + coProvince.value + '.json', coRegency, ...);
});
```

Poin penting:
* Setiap ganti parent, semua child di-reset. Ini mencegah alamat tidak konsisten (mis. pilih Jawa Barat lalu ganti ke Aceh tapi kecamatan masih milik Jawa Barat).
* Fetch URL dibentuk dengan konkatenasi ID parent: `'/kabupaten/' + coProvince.value + '.json'`.
* Pola identik untuk regency → kecamatan dan district → kelurahan.

### 4.7 Pemicu dialog — `script.js:368-379`

* `checkoutBtn click` → isi `coSummary`, reset `coError`/`coSuccess`, `loadProvinces()`, `showModal()`.
* `checkout-cancel click` → `dialog.close()`.
* Klik backdrop (`e.target === dialog`) → `dialog.close()`.

## 5. Validasi Saat Submit — `script.js:380-402`

Bukan bagian API, tapi berkaitan karena memastikan ID wilayah benar-benar dipilih:

```js
if (!coName.value.trim()) err = 'Nama penerima wajib diisi.';
else if (!/^[0-9+ ]{10,15}$/.test(coPhone.value.trim())) err = 'No. HP tidak valid...';
else if (!coProvince.value || !coRegency.value || !coDistrict.value || !coVillage.value) err = 'Lengkapi...';
else if (!coAddress.value.trim()) err = 'Alamat jalan wajib diisi.';
```

Jika lolos, alamat dirangkai di `script.js:389`:

```js
var alamat = coAddress.value.trim() + ', ' + selName(coVillage) + ', ' + selName(coDistrict) + ', ' + selName(coRegency) + ', ' + selName(coProvince);
```

Setelah sukses: `cart = {}; save(); coForm.reset();` + reset 3 dropdown anak ke mode `setLoading()` + `setTimeout(close, 3500)`.

## 6. Penanganan Error & UX State

| Kondisi | Kode | Tampilan |
|---|---|---|
| Awal buka dialog | `index.html:128`, `script.js:318` | `Memuat…` / `Memuat provinsi…`, disabled |
| Parent belum dipilih | `script.js:349-351`, `index.html:132,136,140` | `Pilih provinsi/kota/kecamatan dulu`, disabled |
| Sukses ada data | `script.js:327-329` | `Pilih provinsi/kota/...`, enabled |
| Data kosong | `script.js:323-326` | `Provinsi/Kota/... kosong`, disabled |
| Gagal network/HTTP | `script.js:330-334` | `Gagal memuat — pilih ulang untuk coba lagi`, enabled (bisa retry) |

Tidak ada `api key`, tidak ada `POST`; semua `GET` publik via CDN GitHub Pages (`ibnux.github.io`).

## 7. Keterbatasan

1. Tanpa cache `kabupaten/kecamatan/kelurahan` — tiap ganti pilihan fetch ulang.
2. Tanpa `AbortController` — jika user ganti provinsi cepat, response lama bisa menimpa yang baru (race condition ringan).
3. Validasi wilayah hanya cek `value` tidak kosong, tidak verifikasi ulang ke server.
4. Ketergantungan penuh pada ketersediaan `ibnux.github.io`; offline = dropdown gagal dimuat.
5. `localStorage` keranjang (`script.js:198-240`) terpisah dan tidak dikirim ke API mana pun (simulasi frontend).
