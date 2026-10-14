// MIBER — interaksi JavaScript (hamburger, validasi login & registrasi, keranjang, back-to-top + reveal)
(function () {
  'use strict';

  /* 1. Hamburger menu responsif */
  var hamburger = document.querySelector('.hamburger');
  var nav = document.getElementById('main-nav');
  if (hamburger && nav) {
    var closeNav = function () {
      nav.classList.remove('open');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.setAttribute('aria-label', 'Buka menu navigasi');
    };
    hamburger.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('open');
      hamburger.classList.toggle('active', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
      hamburger.setAttribute('aria-label', isOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeNav();
    });
    document.addEventListener('click', function (e) {
      if (nav.classList.contains('open') && !e.target.closest('.site-header')) closeNav();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeNav();
    });
  }

  /* 2. Toggle lihat/sembunyi kata sandi (ikon mata) — dipakai login & registrasi */
  var wireToggle = function (btnId, inputId) {
    var btn = document.getElementById(btnId);
    var input = document.getElementById(inputId);
    if (!btn || !input) return;
    var eye = btn.querySelector('.icon-eye');
    var eyeOff = btn.querySelector('.icon-eye-off');
    btn.addEventListener('click', function () {
      var show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      if (eye) eye.hidden = show;
      if (eyeOff) eyeOff.hidden = !show;
      btn.setAttribute('aria-pressed', String(show));
      btn.setAttribute('aria-label', show ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi');
      input.focus();
    });
  };
  wireToggle('toggle-password', 'password');
  wireToggle('toggle-reg-password', 'reg-password');
  wireToggle('toggle-reg-confirm', 'reg-confirm');

  /* Validasi form login */
  var form = document.getElementById('login-form');
  if (form) {
    var email = document.getElementById('email');
    var password = document.getElementById('password');
    var emailError = document.getElementById('email-error');
    var passwordError = document.getElementById('password-error');
    var success = document.getElementById('login-success');

    var setError = function (input, el, msg) {
      el.textContent = msg;
      input.classList.toggle('input-invalid', Boolean(msg));
      input.setAttribute('aria-invalid', msg ? 'true' : 'false');
      return !msg;
    };

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var emailVal = email.value.trim();
      var passVal = password.value;
      var emailOk = true;
      var passOk = true;

      if (!emailVal) {
        emailOk = setError(email, emailError, 'Email wajib diisi.');
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(emailVal)) {
        emailOk = setError(email, emailError, 'Format email tidak valid, contoh: nama@email.com.');
      } else {
        emailOk = setError(email, emailError, '');
      }

      if (!passVal) {
        passOk = setError(password, passwordError, 'Kata sandi wajib diisi.');
      } else if (passVal.length < 6) {
        passOk = setError(password, passwordError, 'Kata sandi minimal 6 karakter.');
      } else {
        passOk = setError(password, passwordError, '');
      }

      if (!emailOk || !passOk) {
        success.hidden = true;
        (emailOk ? password : email).focus();
        return;
      }
      success.hidden = false;
      success.textContent = 'Login berhasil! Selamat datang, ' + emailVal + '. (simulasi frontend)';
      form.reset();
    });

    ['input'].forEach(function (evt) {
      email.addEventListener(evt, function () { setError(email, emailError, ''); });
      password.addEventListener(evt, function () { setError(password, passwordError, ''); });
    });
  }

  /* 2b. Validasi form registrasi (simulasi frontend, tanpa redirect) */
  var regForm = document.getElementById('register-form');
  if (regForm) {
    var regName = document.getElementById('reg-name');
    var regEmail = document.getElementById('reg-email');
    var regPassword = document.getElementById('reg-password');
    var regConfirm = document.getElementById('reg-confirm');
    var regSuccess = document.getElementById('register-success');
    var regErr = {
      name: document.getElementById('reg-name-error'),
      email: document.getElementById('reg-email-error'),
      password: document.getElementById('reg-password-error'),
      confirm: document.getElementById('reg-confirm-error')
    };
    var regSetError = function (input, el, msg) {
      el.textContent = msg;
      input.classList.toggle('input-invalid', Boolean(msg));
      input.setAttribute('aria-invalid', msg ? 'true' : 'false');
      return !msg;
    };

    regForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var nameVal = regName.value.trim();
      var emailVal = regEmail.value.trim();
      var passVal = regPassword.value;
      var confirmVal = regConfirm.value;
      var firstBad = null;

      if (!nameVal) {
        if (!firstBad) firstBad = regName;
        regSetError(regName, regErr.name, 'Nama wajib diisi.');
      } else if (nameVal.length < 3) {
        if (!firstBad) firstBad = regName;
        regSetError(regName, regErr.name, 'Nama minimal 3 karakter.');
      } else {
        regSetError(regName, regErr.name, '');
      }

      if (!emailVal) {
        if (!firstBad) firstBad = regEmail;
        regSetError(regEmail, regErr.email, 'Email wajib diisi.');
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(emailVal)) {
        if (!firstBad) firstBad = regEmail;
        regSetError(regEmail, regErr.email, 'Format email tidak valid, contoh: nama@email.com.');
      } else {
        regSetError(regEmail, regErr.email, '');
      }

      if (!passVal) {
        if (!firstBad) firstBad = regPassword;
        regSetError(regPassword, regErr.password, 'Kata sandi wajib diisi.');
      } else if (passVal.length < 6) {
        if (!firstBad) firstBad = regPassword;
        regSetError(regPassword, regErr.password, 'Kata sandi minimal 6 karakter.');
      } else {
        regSetError(regPassword, regErr.password, '');
      }

      if (!confirmVal) {
        if (!firstBad) firstBad = regConfirm;
        regSetError(regConfirm, regErr.confirm, 'Konfirmasi kata sandi wajib diisi.');
      } else if (confirmVal !== passVal) {
        if (!firstBad) firstBad = regConfirm;
        regSetError(regConfirm, regErr.confirm, 'Konfirmasi tidak sama dengan kata sandi.');
      } else {
        regSetError(regConfirm, regErr.confirm, '');
      }

      if (firstBad) {
        regSuccess.hidden = true;
        firstBad.focus();
        return;
      }
      regSuccess.hidden = false;
      regSuccess.textContent = 'Pendaftaran berhasil! Halo, ' + nameVal + '. Silakan masuk. (simulasi frontend)';
      regForm.reset();
    });

    [[regName, regErr.name], [regEmail, regErr.email], [regPassword, regErr.password], [regConfirm, regErr.confirm]].forEach(function (pair) {
      pair[0].addEventListener('input', function () { regSetError(pair[0], pair[1], ''); });
    });
    // Ketik ulang sandi utama juga membersihkan error konfirmasi yang sudah cocok
    regPassword.addEventListener('input', function () {
      if (regConfirm.value && regConfirm.value === regPassword.value) {
        regSetError(regConfirm, regErr.confirm, '');
      }
    });
  }

  /* 3. Keranjang / simulasi pesan (localStorage) */
  var products = document.querySelectorAll('.product');
  var cartCount = document.getElementById('cart-count');
  var cartText = document.getElementById('cart-text');
  var checkoutBtn = document.getElementById('checkout-btn');
  var clearBtn = document.getElementById('clear-btn');
  var STORAGE_KEY = 'miber_cart';
  var cart = {};
  try {
    cart = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch (err) {
    cart = {};
  }
  // Bersihkan entri produk yang sudah tidak ada di katalog
  if (cart.sport) { delete cart.sport; }

  var formatRp = function (n) {
    return 'Rp' + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  var renderCart = function () {
    var totalQty = 0;
    var totalRp = 0;
    var lines = [];
    products.forEach(function (card) {
      var id = card.dataset.id;
      var qty = cart[id] || 0;
      var price = parseInt(card.dataset.price, 10) || 0;
      var label = card.querySelector('.qty-value');
      if (label) label.textContent = String(qty);
      if (qty > 0) {
        totalQty += qty;
        totalRp += qty * price;
        lines.push(qty + 'x ' + card.dataset.name);
      }
    });
    if (cartCount) cartCount.textContent = String(totalQty);
    if (cartText) {
      cartText.textContent = totalQty === 0
        ? 'Keranjang masih kosong.'
        : lines.join(', ') + ' — Total: ' + formatRp(totalRp);
    }
    if (checkoutBtn) checkoutBtn.disabled = totalQty === 0;
    if (clearBtn) clearBtn.disabled = totalQty === 0;
  };

  if (products.length > 0) {
    var save = function () {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cart)); } catch (err) { /* abaikan */ }
      renderCart();
    };
    products.forEach(function (card) {
      var id = card.dataset.id;
      var minus = card.querySelector('[data-action="minus"]');
      var plus = card.querySelector('[data-action="plus"]');
      var add = card.querySelector('.add-btn');
      var step = function (delta) {
        var current = cart[id] || 0;
        var next = Math.min(99, Math.max(0, current + delta));
        if (next === 0) delete cart[id]; else cart[id] = next;
        save();
      };
      if (minus) minus.addEventListener('click', function () { step(-1); });
      if (plus) plus.addEventListener('click', function () { step(1); });
      if (add) add.addEventListener('click', function () {
        cart[id] = Math.min(99, (cart[id] || 0) + 1);
        save();
        add.textContent = 'Ditambahkan ✓';
        setTimeout(function () { add.textContent = 'Tambah ke keranjang'; }, 1200);
      });
    });
    if (clearBtn) clearBtn.addEventListener('click', function () {
      if (confirm('Yakin ingin mengosongkan keranjang?')) { cart = {}; save(); }
    });
    /* 3b. Checkout + API Wilayah Indonesia (Emsifa, gratis tanpa key) */
    var dialog = document.getElementById('checkout-dialog');
    var coForm = document.getElementById('checkout-form');
    var coSummary = document.getElementById('checkout-summary');
    var coName = document.getElementById('co-name');
    var coPhone = document.getElementById('co-phone');
    var coAddress = document.getElementById('co-address');
    var coProvince = document.getElementById('co-province');
    var coRegency = document.getElementById('co-regency');
    var coDistrict = document.getElementById('co-district');
    var coVillage = document.getElementById('co-village');
    var coError = document.getElementById('co-error');
    var coSuccess = document.getElementById('co-success');
    var coCancel = document.getElementById('checkout-cancel');
    var WIL_BASE = 'https://emsifa.github.io/api-wilayah-indonesia/api';
    var provincesLoaded = false;

    var fillSelect = function (sel, items, placeholder) {
      sel.innerHTML = '';
      var opt = document.createElement('option');
      opt.value = '';
      opt.textContent = placeholder;
      opt.selected = true;
      sel.appendChild(opt);
      items.forEach(function (it) {
        var o = document.createElement('option');
        o.value = it.id;
        o.textContent = it.name;
        o.dataset.name = it.name;
        sel.appendChild(o);
      });
    };
    var setLoading = function (sel, msg) {
      sel.innerHTML = '';
      var o = document.createElement('option');
      o.value = '';
      o.textContent = msg;
      o.selected = true;
      sel.appendChild(o);
      sel.disabled = true;
    };
    var fetchWilayah = function (url, sel, placeholder, emptyMsg) {
      setLoading(sel, 'Memuat…');
      return fetch(url).then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      }).then(function (data) {
        if (!data || data.length === 0) {
          setLoading(sel, emptyMsg || 'Data kosong');
          return;
        }
        fillSelect(sel, data, placeholder);
        sel.disabled = false;
      }).catch(function () {
        setLoading(sel, 'Gagal memuat, coba lagi');
      });
    };
    var loadProvinces = function () {
      if (provincesLoaded || !coProvince) return;
      provincesLoaded = true;
      fetchWilayah(WIL_BASE + '/provinces.json', coProvince, 'Pilih provinsi', 'Provinsi kosong');
    };
    var selName = function (sel) {
      var o = sel && sel.selectedOptions && sel.selectedOptions[0];
      return (o && o.dataset.name) || (o ? o.textContent : '');
    };

    if (coProvince && coRegency && coDistrict && coVillage) {
      coProvince.addEventListener('change', function () {
        setLoading(coRegency, 'Pilih provinsi dulu');
        setLoading(coDistrict, 'Pilih kota dulu');
        setLoading(coVillage, 'Pilih kecamatan dulu');
        if (!coProvince.value) return;
        fetchWilayah(WIL_BASE + '/regencies/' + coProvince.value + '.json', coRegency, 'Pilih kota / kabupaten', 'Kota kosong');
      });
      coRegency.addEventListener('change', function () {
        setLoading(coDistrict, 'Pilih kota dulu');
        setLoading(coVillage, 'Pilih kecamatan dulu');
        if (!coRegency.value) return;
        fetchWilayah(WIL_BASE + '/districts/' + coRegency.value + '.json', coDistrict, 'Pilih kecamatan', 'Kecamatan kosong');
      });
      coDistrict.addEventListener('change', function () {
        setLoading(coVillage, 'Pilih kecamatan dulu');
        if (!coDistrict.value) return;
        fetchWilayah(WIL_BASE + '/villages/' + coDistrict.value + '.json', coVillage, 'Pilih kelurahan / desa', 'Kelurahan kosong');
      });
    }

    if (checkoutBtn && dialog && coForm) {
      checkoutBtn.addEventListener('click', function () {
        if (coSummary && cartText) coSummary.textContent = cartText.textContent;
        if (coError) coError.textContent = '';
        if (coSuccess) coSuccess.hidden = true;
        loadProvinces();
        if (typeof dialog.showModal === 'function') dialog.showModal();
      });
      if (coCancel) coCancel.addEventListener('click', function () { dialog.close(); });
      dialog.addEventListener('click', function (e) {
        if (e.target === dialog) dialog.close();
      });
      coForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var err = '';
        if (!coName.value.trim()) err = 'Nama penerima wajib diisi.';
        else if (!/^[0-9+ ]{10,15}$/.test(coPhone.value.trim())) err = 'No. HP tidak valid (10–15 digit angka).';
        else if (!coProvince.value || !coRegency.value || !coDistrict.value || !coVillage.value) err = 'Lengkapi provinsi, kota, kecamatan, dan kelurahan.';
        else if (!coAddress.value.trim()) err = 'Alamat jalan wajib diisi.';
        if (coError) coError.textContent = err;
        if (err) return;
        var alamat = coAddress.value.trim() + ', ' + selName(coVillage) + ', ' + selName(coDistrict) + ', ' + selName(coRegency) + ', ' + selName(coProvince);
        var pesanan = cartText ? cartText.textContent : '';
        if (coSuccess) {
          coSuccess.hidden = false;
          coSuccess.textContent = 'Pesanan diterima! ' + pesanan + ' — dikirim ke ' + alamat + ' (a.n. ' + coName.value.trim() + '). Terima kasih!';
        }
        cart = {};
        save();
        coForm.reset();
        setLoading(coRegency, 'Pilih provinsi dulu');
        setLoading(coDistrict, 'Pilih kota dulu');
        setLoading(coVillage, 'Pilih kecamatan dulu');
        setTimeout(function () { dialog.close(); }, 3500);
      });
    }
    renderCart();
  } else if (cartCount) {
    // Halaman tanpa katalog (mis. login): tetap tampilkan jumlah tersimpan
    var n = Object.keys(cart).reduce(function (s, k) { return s + (cart[k] || 0); }, 0);
    cartCount.textContent = String(n);
  }

  /* 4. Back-to-top + reveal on scroll */
  var backBtn = document.getElementById('backToTop');
  if (backBtn) {
    var onScroll = function () {
      backBtn.classList.toggle('show', window.scrollY > 400);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    backBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  var revealTargets = document.querySelectorAll('.hero-copy, .hero-photo, .benefit, .benefit-photo, .product, .login-card');
  if ('IntersectionObserver' in window && revealTargets.length > 0) {
    revealTargets.forEach(function (el) { el.classList.add('reveal'); });
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealTargets.forEach(function (el) { observer.observe(el); });
  }
})();
