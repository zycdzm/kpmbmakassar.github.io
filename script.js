// ================== FIX KEGIATAN GALLERY ==================

// Fungsi untuk membuka gallery kegiatan
function showGallery(type) {
    // Hide semua page
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
        page.style.display = 'none';
    });

    // Hide semua gallery-page
    document.querySelectorAll('.gallery-page').forEach(page => {
        page.style.display = 'none';
    });

    // Show gallery yang dipilih
    const galleryId = type + '-gallery';
    const galleryPage = document.getElementById(galleryId);
    if (galleryPage) {
        galleryPage.style.display = 'block';
        setTimeout(() => {
            galleryPage.classList.add('active');
        }, 10);
    }

    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Fungsi untuk kembali ke halaman kegiatan
function backToKegiatan() {
    // Hide semua gallery-page
    document.querySelectorAll('.gallery-page').forEach(page => {
        page.style.display = 'none';
        page.classList.remove('active');
    });

    // Show kegiatan page
    const kegiatanPage = document.getElementById('kegiatan');
    if (kegiatanPage) {
        kegiatanPage.style.display = 'block';
        setTimeout(() => {
            kegiatanPage.classList.add('active');
        }, 10);
    }

    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// ================== PAGE NAVIGATION ==================

function showPage(id) {
    // Force close dropdown!
    const dropdown = document.querySelector(".dropdown");
    const dropdownMenu = document.querySelector(".dropdown-menu");
    
    if (dropdown) {
        dropdown.classList.remove("active");
        console.log("🔴 showPage: Closed dropdown - removed active class");
    }
    
    if (dropdownMenu) {
        // Jangan paksa inline style di sini (opacity/visibility) — itu bikin
        // dropdown gak bisa kebuka lagi setelah ini, karena inline style
        // selalu menang dari CSS class .dropdown.active .dropdown-menu.
        // Cukup bersihkan inline style biar dikontrol CSS class lagi.
        dropdownMenu.style.opacity = "";
        dropdownMenu.style.visibility = "";
        console.log("🔴 showPage: Closed dropdown via class (inline style dibersihkan)");
    }
    
    // Hide semua page
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
        page.style.display = 'none';
    });

    // Hide semua gallery-page
    document.querySelectorAll('.gallery-page').forEach(page => {
        page.style.display = 'none';
        page.classList.remove('active');
    });

    // Show page yang dipilih
    const target = document.getElementById(id);
    if (target) {
        target.style.display = 'block';
        setTimeout(() => {
            target.classList.add('active');
        }, 10);
    }

    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// ================== SUPABASE SETUP ==================
const SUPABASE_URL = "https://pcpnzmiqpbogmmbqvysf.supabase.co";
const SUPABASE_KEY = "sb_publishable_dwLyRRGPv5q13PcFkz0CLw_pa9OLs3J";
const supabaseClient = window.supabase
    ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY)
    : null;

let divisiAktif = null; // divisi yang lagi dibuka
let isAdminDivisi = false; // status login admin

// ================== AUTH ADMIN DIVISI ==================

async function cekSesiDivisi() {
    if (!supabaseClient) return;
    const { data } = await supabaseClient.auth.getSession();
    isAdminDivisi = !!data.session;
    updateAdminBarDivisi();
}

function updateAdminBarDivisi() {
    const btnLogin = document.getElementById("btnLoginDivisi");
    const controls = document.getElementById("divisiAdminControls");
    if (!btnLogin || !controls) return;

    if (isAdminDivisi) {
        btnLogin.style.display = "none";
        controls.style.display = "flex";
    } else {
        btnLogin.style.display = "inline-block";
        controls.style.display = "none";
    }
}

function bukaDivisiLogin() {
    const modal = document.getElementById("divisiLoginModal");
    if (modal) modal.classList.add("active");
    document.getElementById("divisiLoginError")?.classList.remove("show");
}

function closeDivisiLogin() {
    document.getElementById("divisiLoginModal")?.classList.remove("active");
}

async function cekLoginDivisi(event) {
    event.preventDefault();
    const email = document.getElementById("divisiEmail").value.trim();
    const password = document.getElementById("divisiPassword").value;
    const errorEl = document.getElementById("divisiLoginError");

    const { error } = await supabaseClient.auth.signInWithPassword({ email, password });

    if (error) {
        errorEl?.classList.add("show");
        return false;
    }

    errorEl?.classList.remove("show");
    isAdminDivisi = true;
    updateAdminBarDivisi();
    closeDivisiLogin();
    if (divisiAktif) tampilkanDivisi(divisiAktif);
    return false;
}

async function logoutDivisi() {
    await supabaseClient.auth.signOut();
    isAdminDivisi = false;
    updateAdminBarDivisi();
    if (divisiAktif) tampilkanDivisi(divisiAktif);
}

// ================== DIVISI DISPLAY ==================

async function tampilkanDivisi(divisi) {
    divisiAktif = divisi;
    const anggotaDiv = document.getElementById("anggotaDivisi");
    if (!anggotaDiv || !supabaseClient) return;

    anggotaDiv.innerHTML = `<p class="divisi-loading">Memuat data...</p>`;

    const { data, error } = await supabaseClient
        .from("anggota_divisi")
        .select("*")
        .eq("divisi", divisi)
        .order("urutan", { ascending: true });

    if (error || !data) {
        anggotaDiv.innerHTML = `<p class="divisi-loading">Gagal memuat data. Coba refresh halaman.</p>`;
        return;
    }

    if (data.length === 0) {
        anggotaDiv.innerHTML = `<p class="divisi-loading">Belum ada anggota untuk divisi ini.</p>`;
        return;
    }

    const koor = data.find(item => item.peran === "koordinator") || data[0];
    const anggotaList = data.filter(item => item.id !== koor.id);

    let anggotaHTML = "";
    anggotaList.forEach(item => {
        anggotaHTML += `
            <div class="tim-card">
                ${isAdminDivisi ? `
                <div class="card-admin-actions">
                    <button class="btn-edit-anggota" onclick='bukaFormAnggota("edit", ${JSON.stringify(item).replace(/'/g, "&#39;")})' title="Edit">✎</button>
                    <button class="btn-hapus-anggota" onclick="hapusAnggota(${item.id}, '${item.nama.replace(/'/g, "\\'")}')" title="Hapus">✕</button>
                </div>` : ""}
                <img src="${item.foto_url}" alt="${item.nama}">
                <h4>${item.nama}</h4>
                <p>${item.unit}</p>
            </div>
        `;
    });

    anggotaDiv.innerHTML = `
        <div class="detail-divisi">
            <div class="divisi-header">
                <div class="divisi-text">
                    <small>Koordinator Divisi</small>
                    <h2>${divisi}</h2>
                    <p class="ketua-deskripsi">${koor.deskripsi}</p>
                    <br>
                    <p><strong>Program Kerja:</strong> ${koor.program || "-"}</p>
                </div>
                <div class="koordinator">
                    ${isAdminDivisi ? `
                    <div class="card-admin-actions">
                        <button class="btn-edit-anggota" onclick='bukaFormAnggota("edit", ${JSON.stringify(koor).replace(/'/g, "&#39;")})' title="Edit">✎</button>
                        <button class="btn-hapus-anggota" onclick="hapusAnggota(${koor.id}, '${koor.nama.replace(/'/g, "\\'")}')" title="Hapus">✕</button>
                    </div>` : ""}
                    <img src="${koor.foto_url}" alt="${koor.nama}">
                    <div class="nama-koor">${koor.nama}</div>
                </div>
            </div>
            <div class="sub-divisi-title">
                <small>Anggota Divisi</small>
                <h3>Struktur Divisi</h3>
            </div>
            <div class="tim-grid">
                ${anggotaHTML || "<p>Belum ada anggota lain.</p>"}
            </div>
        </div>
    `;

    anggotaDiv.scrollIntoView({ behavior: "smooth" });
}

// ================== FORM TAMBAH / EDIT ANGGOTA ==================

function bukaFormAnggota(mode, item) {
    if (!isAdminDivisi) return;

    document.getElementById("anggotaFormTitle").textContent =
        mode === "edit" ? "Edit Anggota" : "Tambah Anggota";

    document.getElementById("anggotaId").value = mode === "edit" ? item.id : "";
    document.getElementById("anggotaDivisiField").value = divisiAktif;
    document.getElementById("anggotaNama").value = mode === "edit" ? item.nama : "";
    document.getElementById("anggotaUnit").value = mode === "edit" ? item.unit : "";
    document.getElementById("anggotaPeran").value = mode === "edit" ? (item.peran || "anggota") : "anggota";
    document.getElementById("anggotaProgram").value = mode === "edit" ? (item.program || "") : "";
    document.getElementById("anggotaDeskripsi").value = mode === "edit" ? item.deskripsi : "";
    document.getElementById("anggotaFoto").value = "";

    const preview = document.getElementById("anggotaFotoPreview");
    if (mode === "edit" && item.foto_url) {
        preview.src = item.foto_url;
        preview.style.display = "block";
    } else {
        preview.style.display = "none";
    }

    document.getElementById("anggotaFormError")?.classList.remove("show");
    document.getElementById("anggotaFormModal")?.classList.add("active");
}

function closeFormAnggota() {
    document.getElementById("anggotaFormModal")?.classList.remove("active");
}

async function simpanAnggotaForm(event) {
    event.preventDefault();

    const submitBtn = document.getElementById("anggotaSubmitBtn");
    const errorEl = document.getElementById("anggotaFormError");
    submitBtn.disabled = true;
    submitBtn.textContent = "Menyimpan...";

    try {
        const id = document.getElementById("anggotaId").value;
        const divisi = document.getElementById("anggotaDivisiField").value;
        const nama = document.getElementById("anggotaNama").value.trim();
        const unit = document.getElementById("anggotaUnit").value.trim();
        const peran = document.getElementById("anggotaPeran").value;
        const program = document.getElementById("anggotaProgram").value.trim();
        const deskripsi = document.getElementById("anggotaDeskripsi").value.trim();
        const fotoFile = document.getElementById("anggotaFoto").files[0];

        let foto_url = document.getElementById("anggotaFotoPreview").src || "";

        // upload foto baru kalau ada file yang dipilih
        if (fotoFile) {
            const namaFile = `${Date.now()}_${fotoFile.name.replace(/\s+/g, "_")}`;
            const { error: uploadError } = await supabaseClient.storage
                .from("foto-anggota")
                .upload(namaFile, fotoFile);

            if (uploadError) throw uploadError;

            const { data: publicData } = supabaseClient.storage
                .from("foto-anggota")
                .getPublicUrl(namaFile);

            foto_url = publicData.publicUrl;
        }

        if (!foto_url) throw new Error("Foto wajib diisi");

        const payload = { divisi, nama, unit, peran, program, deskripsi, foto_url };

        // kalau dijadikan koordinator, pastikan urutan = 0 & yang lama diturunkan jadi anggota
        if (peran === "koordinator") {
            payload.urutan = 0;
            await supabaseClient
                .from("anggota_divisi")
                .update({ peran: "anggota" })
                .eq("divisi", divisi)
                .eq("peran", "koordinator");
        }

        let result;
        if (id) {
            result = await supabaseClient.from("anggota_divisi").update(payload).eq("id", id);
        } else {
            if (peran !== "koordinator") {
                const { count } = await supabaseClient
                    .from("anggota_divisi")
                    .select("id", { count: "exact", head: true })
                    .eq("divisi", divisi);
                payload.urutan = (count || 0) + 1;
            }
            result = await supabaseClient.from("anggota_divisi").insert(payload);
        }

        if (result.error) throw result.error;

        closeFormAnggota();
        tampilkanDivisi(divisiAktif);
    } catch (err) {
        errorEl.textContent = err.message || "Gagal menyimpan data, coba lagi.";
        errorEl.classList.add("show");
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Simpan";
    }
}

async function hapusAnggota(id, nama) {
    if (!isAdminDivisi) return;
    if (!confirm(`Hapus ${nama} dari divisi ini?`)) return;

    const { error } = await supabaseClient.from("anggota_divisi").delete().eq("id", id);
    if (error) {
        alert("Gagal menghapus data: " + error.message);
        return;
    }
    tampilkanDivisi(divisiAktif);
}

// Preview foto sebelum upload
document.addEventListener("change", (e) => {
    if (e.target && e.target.id === "anggotaFoto") {
        const file = e.target.files[0];
        const preview = document.getElementById("anggotaFotoPreview");
        if (file) {
            preview.src = URL.createObjectURL(file);
            preview.style.display = "block";
        }
    }
});

// Cek sesi login admin divisi saat halaman dimuat
document.addEventListener("DOMContentLoaded", cekSesiDivisi);

// ================== FLIPBOOK ==================

let pageFlip = null;

function initBook() {
    const bookEl = document.getElementById("book");
    if (!bookEl) return;

    if (pageFlip) {
        pageFlip.destroy();
        pageFlip = null;
    }

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const isMobile = vw <= 600;

    let pageW, pageH;

    if (isMobile) {
        pageW = Math.floor(vw * 0.92);
        pageH = Math.floor(pageW * 1.414);
        if (pageH > vh * 0.88) {
           pageH = Math.floor(vh * 0.75);
           pageW = Math.floor(pageH / 1.414);
        }
    } else {
        pageH = Math.floor(vh * 0.88);
        pageW = Math.floor(pageH / 1.414);
        if (pageW * 2 > vw) {
            pageW = Math.floor(vw / 2);
            pageH = Math.floor(pageW * 1.414);
        }
    }

    bookEl.style.width  = (isMobile ? pageW : pageW * 2) + "px";
    bookEl.style.height = pageH + "px";

    console.log({
    vw,
    vh,
    pageW,
    pageH
});

   pageFlip = new St.PageFlip(bookEl, {
    width: 450,
    height: 636,
    size: "stretch",
    minWidth: 315,
    maxWidth: 450,
    minHeight: 446,
    maxHeight: 636,
    showCover: true,
    usePortrait: true,
    autoSize: true
});
    pageFlip.on("flip", (e) => {
        const cur = document.getElementById("currentPage");
        if (cur) cur.textContent = e.data + 1;
    });

    const pages = [];
    for (let i = 0; i <= 126; i++) {
         pages.push(`asset/book/${i}.jpg`);
}

    pageFlip.loadFromImages(pages);
}
function bukaSejarah() {
    document.getElementById("databaseModal").classList.remove("active");
    document.getElementById("visiModal").classList.remove("active");
    document.getElementById("nilaiModal").classList.remove("active");

    const modal = document.getElementById("bookModal");
    if (modal) {
        modal.classList.add("active");
        // Delay 300ms agar modal dan CSS flex layout selesai render
        setTimeout(() => {
            initBook();
        }, 300);
    }
}

function closeSejarah() {
    const modal = document.getElementById("bookModal");
    if (modal) modal.classList.remove("active");
}  

// ================== LOGIN DATABASE (WARGA & ALUMNI) ==================
// GANTI password di bawah ini sesuai keinginan kamu.
// PENTING: karena situs ini tanpa backend, password di sini hanya
// jadi penghalang biasa, bukan proteksi keamanan yang kuat.
const DATABASE_PASSWORD = "gantipassword123";

function bukaDatabaseGate() {
    if (sessionStorage.getItem("kpmbDatabaseAuth") === "1") {
        bukaDatabase();
        return;
    }

    document.getElementById("bookModal")?.classList.remove("active");
    document.getElementById("visiModal")?.classList.remove("active");
    document.getElementById("nilaiModal")?.classList.remove("active");

    const loginError = document.getElementById("loginError");
    if (loginError) loginError.classList.remove("show");

    const loginInput = document.getElementById("loginPassword");
    if (loginInput) loginInput.value = "";

    const modal = document.getElementById("loginModal");
    if (modal) modal.classList.add("active");

    setTimeout(() => loginInput?.focus(), 100);
}

function cekLoginDatabase(event) {
    event.preventDefault();

    const input = document.getElementById("loginPassword");
    const error = document.getElementById("loginError");
    const password = input ? input.value : "";

    if (password === DATABASE_PASSWORD) {
        sessionStorage.setItem("kpmbDatabaseAuth", "1");
        closeLogin();
        bukaDatabase();
    } else {
        if (error) error.classList.add("show");
        if (input) {
            input.value = "";
            input.focus();
        }
    }

    return false;
}

function closeLogin() {
    const modal = document.getElementById("loginModal");
    if (modal) modal.classList.remove("active");
}

// ================== DATABASE ==================

function bukaDatabase() {
    document.getElementById("bookModal").classList.remove("active");
    document.getElementById("visiModal").classList.remove("active");
    document.getElementById("nilaiModal").classList.remove("active");

    const modal = document.getElementById("databaseModal");
    if (!modal) return;

    modal.classList.add("active");
    document.querySelectorAll(".data-box").forEach((box) => {
        box.classList.remove("active");
    });

    const alumni = document.getElementById("alumni");
    if (alumni) alumni.classList.add("active");
}

function closeDatabase() {
    const modal = document.getElementById("databaseModal");
    if (modal) modal.classList.remove("active");
}

function showData(id) {
    document.querySelectorAll(".data-box").forEach((box) => {
        box.classList.remove("active");
    });
    const target = document.getElementById(id);
    if (target) target.classList.add("active");
}

// ================== VISI MISI ==================

function bukaVisiMisi() {
    document.getElementById("bookModal").classList.remove("active");
    document.getElementById("databaseModal").classList.remove("active");
    document.getElementById("nilaiModal").classList.remove("active");

    const modal = document.getElementById("visiModal");
    if (modal) modal.classList.add("active");
}

function closeVisi() {
    const modal = document.getElementById("visiModal");
    if (modal) modal.classList.remove("active");
}

// ================== NILAI ==================

function bukaNilai() {
    document.getElementById("bookModal").classList.remove("active");
    document.getElementById("databaseModal").classList.remove("active");
    document.getElementById("visiModal").classList.remove("active");

    const modal = document.getElementById("nilaiModal");
    if (modal) modal.classList.add("active");
}

function closeNilai() {
    const modal = document.getElementById("nilaiModal");
    if (modal) modal.classList.remove("active");
}

// ================== HERO SLIDER ==================

document.addEventListener("DOMContentLoaded", () => {
    const hero = document.querySelector(".hero");
    const heroImages = [
        "asset/img/selamat.jpg",
        "asset/img/rakpel.jpg",
        "asset/img/rakpel3.jpg",
        "asset/img/ldk2.jpg",
        "asset/img/ldk3.jpg",
        "asset/img/muswam3.jpg"
    ];

    let heroIndex = 0;

    function updateHero() {
        if (!hero) return;
        hero.style.backgroundImage = `linear-gradient(rgba(0,0,0,.5), rgba(0,0,0,.5)), url('${heroImages[heroIndex]}')`;
    }

    const heroNext = document.querySelector(".hero-next");
    const heroPrev = document.querySelector(".hero-prev");

    if (heroNext) {
        heroNext.addEventListener("click", () => {
            heroIndex++;
            if (heroIndex >= heroImages.length) heroIndex = 0;
            updateHero();
        });
    }

    if (heroPrev) {
        heroPrev.addEventListener("click", () => {
            heroIndex--;
            if (heroIndex < 0) heroIndex = heroImages.length - 1;
            updateHero();
        });
    }

    updateHero();
    setInterval(() => {
        heroIndex++;
        if (heroIndex >= heroImages.length) heroIndex = 0;
        updateHero();
    }, 5000);
});

// ================== BERITA ==================

const beritaData = [
    {
        img: "asset/img/forta.jpeg",
        judul: "Forta KPMB",
        isi: "Dokumentasi kegiatan Forta KPMB Makassar."
    },
    {
        img: "asset/img/forta1.jpeg",
        judul: "Kegiatan Anggota",
        isi: "Kegiatan kebersamaan anggota KPMB Makassar."
    },
    {
        img: "asset/img/forta3.jpeg",
        judul: "Balikpapan City Series",
        isi: "Dokumentasi kegiatan city series."
    }
];

function bukaBerita(index) {
    const data = beritaData[index];
    document.getElementById("beritaModalImg").src = data.img;
    document.getElementById("beritaModalJudul").textContent = data.judul;
    document.getElementById("beritaModalIsi").textContent = data.isi;
    document.getElementById("beritaModal").classList.add("active");
    document.getElementById("beritaModalImg").classList.remove("zoomed");
}

function closeBerita() {
    document.getElementById("beritaModal").classList.remove("active");
}

function tutupBerita(event) {
    if (event.target.id === 'beritaModal') {
        closeBerita();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const img = document.getElementById("beritaModalImg");
    if (img) {
        img.addEventListener("click", function() {
            this.classList.toggle("zoomed");
        });
    }
});

// ================== FAQ ==================

const faqItems = document.querySelectorAll(".faq-item");
faqItems.forEach((item) => {
    const btn = item.querySelector(".faq-question");
    if (btn) {
        btn.addEventListener("click", () => {
            item.classList.toggle("active");
        });
    }
});

// ================== REVEAL SCROLL ==================

const reveals = document.querySelectorAll(".reveal");

function revealOnScroll() {
    reveals.forEach((el) => {
        const windowHeight = window.innerHeight;
        const elementTop = el.getBoundingClientRect().top;
        if (elementTop < windowHeight - 100) {
            el.classList.add("active");
        }
    });
}

window.addEventListener("scroll", revealOnScroll);
revealOnScroll();

// ================== DARK MODE ==================

const darkBtn = document.getElementById("darkToggle");
if (darkBtn) {
    darkBtn.addEventListener("click", () => {
        document.body.classList.toggle("dark");
        if (document.body.classList.contains("dark")) {
            darkBtn.innerHTML = "☀️ Light Mode";
        } else {
            darkBtn.innerHTML = "🌙 Dark Mode";
        }
    });
}

// ================== PROKER ACCORDION ==================

document.querySelectorAll('.proker-header').forEach(btn => {
    btn.addEventListener('click', () => {
        const content = btn.nextElementSibling;
        document.querySelectorAll('.proker-content').forEach(item => {
            if (item !== content) {
                item.classList.remove('active');
            }
        });
        content.classList.toggle('active');
    });
});

// ================== GALLERY IMAGE VIEWER ==================

const images = document.querySelectorAll('.gallery-img, #struktur .box img');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeBtn = document.querySelector('.close-btn');
const zoomIn = document.getElementById('zoomIn');
const zoomOut = document.getElementById('zoomOut');

let scale = 1;

if (images.length > 0) {
    images.forEach(img => {
        img.addEventListener('click', () => {
            if (lightbox && lightboxImg) {
                lightbox.classList.add('active');
                lightboxImg.src = img.src;
                scale = 1;
                lightboxImg.style.transform = `scale(${scale})`;
            }
        });
    });
}

if (closeBtn) {
    closeBtn.onclick = () => {
        if (lightbox) lightbox.classList.remove('active');
    };
}

if (zoomIn) {
    zoomIn.onclick = () => {
        scale += 0.2;
        if (lightboxImg) lightboxImg.style.transform = `scale(${scale})`;
    };
}

if (zoomOut) {
    zoomOut.onclick = () => {
        if (scale > 0.4) {
            scale -= 0.2;
            if (lightboxImg) lightboxImg.style.transform = `scale(${scale})`;
        }
    };
}

if (lightbox) {
    lightbox.onclick = (e) => {
        if (e.target === lightbox) {
            lightbox.classList.remove('active');
        }
    };
}

// ================== IMAGE PREVIEW ==================

document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".db-table img").forEach((img) => {
        img.addEventListener("click", function () {
            const preview = document.getElementById("imgPreview");
            const previewImg = document.getElementById("previewImg");
            if (!preview || !previewImg) return;
            previewImg.src = this.src;
            preview.classList.add("active");
        });
    });

    const closeImgBtn = document.querySelector(".close-img");
    if (closeImgBtn) {
        closeImgBtn.onclick = function () {
            const preview = document.getElementById("imgPreview");
            if (preview) preview.classList.remove("active");
        };
    }

    const imgPreview = document.getElementById("imgPreview");
    if (imgPreview) {
        imgPreview.onclick = function (e) {
            if (e.target.id === "imgPreview") {
                this.classList.remove("active");
            }
        };
    }
});
// ================= SIMPLE DATABASE SEARCH ================= 

/**
 * Filter database berdasarkan search input
 */
function filterDatabase() {
  const searchInput = document.getElementById('searchInput');
  const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
  
  // Get active tab (alumni atau warga)
  const activeTab = document.querySelector('.data-box.active');
  if (!activeTab) return;

  // Get semua rows dari table
  const table = activeTab.querySelector('table');
  if (!table) return;
  
  const rows = table.querySelectorAll('tbody tr, tr:not(:first-child)');
  
  let visibleCount = 0;
  let totalCount = 0;

  // Loop setiap row
  rows.forEach(row => {
    // Skip header
    if (row.querySelector('th')) return;

    totalCount++;

    // Get cell values (nama, kampus, angkatan)
    const cells = row.querySelectorAll('td');
    if (cells.length < 3) return;

    const nama = cells[0].textContent.toLowerCase();
    const kampus = cells[1].textContent.toLowerCase();
    const angkatan = cells[2].textContent.toLowerCase();

    // Check if row matches search
    const matches = 
      searchTerm === '' ||
      nama.includes(searchTerm) ||
      kampus.includes(searchTerm) ||
      angkatan.includes(searchTerm);

    // Show or hide row
    if (matches) {
      row.style.display = 'table-row';
      row.classList.remove('table-row-hidden');
      visibleCount++;
    } else {
      row.classList.add('table-row-hidden');
      row.style.display = 'none';
    }
  });

  // Update result info
  updateSearchInfo(visibleCount, totalCount);

  // Show/hide no results message
  checkNoResults(table, visibleCount);
}

/**
 * Update search result info
 */
function updateSearchInfo(visibleCount, totalCount) {
  const resultInfo = document.getElementById('resultInfo');
  if (!resultInfo) return;

  const searchInput = document.getElementById('searchInput');
  const searchTerm = searchInput ? searchInput.value.trim() : '';

  if (searchTerm === '') {
    resultInfo.textContent = `Total: ${totalCount} data`;
    resultInfo.style.color = '#999';
  } else {
    resultInfo.textContent = `Ditemukan ${visibleCount} dari ${totalCount} data`;
    resultInfo.style.color = 'var(--secondary)';
    resultInfo.style.fontWeight = '500';
  }
}

/**
 * Check dan tampilkan no results message
 */
function checkNoResults(table, visibleCount) {
  // Remove old message
  const oldMessage = table.parentElement.querySelector('.no-results-message');
  if (oldMessage) oldMessage.remove();

  // Tampilkan message jika tidak ada hasil
  if (visibleCount === 0) {
    const noResultsDiv = document.createElement('div');
    noResultsDiv.className = 'no-results-message';
    noResultsDiv.innerHTML = `
      <strong>Tidak ada hasil yang cocok</strong>
      <p>Coba ubah pencarian Anda</p>
    `;
    table.parentElement.appendChild(noResultsDiv);
  }
}

/**
 * Reset search
 */
function resetSearch() {
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.value = '';
    searchInput.focus();
  }

  filterDatabase();
}

/**
 * Override showData function untuk reset search saat tab switch
 */
const originalShowData = window.showData || function() {};

if (typeof originalShowData === 'function') {
  window.showData = function(type) {
    originalShowData(type);
    
    // Reset search saat switch tab
    setTimeout(() => {
      resetSearch();
    }, 50);
  };
}

/**
 * Initialize search saat page load
 */
document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    // Handle Escape key
    searchInput.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        resetSearch();
      }
    });

    // Initialize result info
    const activeTab = document.querySelector('.data-box.active');
    if (activeTab) {
      const table = activeTab.querySelector('table');
      if (table) {
        const rows = table.querySelectorAll('tbody tr, tr:not(:first-child)');
        let totalCount = 0;
        rows.forEach(row => {
          if (!row.querySelector('th')) totalCount++;
        });
        updateSearchInfo(totalCount, totalCount);
      }
    }
  }
});

console.log('✅ Search Database (Simple) Loaded');
// ================= BACK TO TOP BUTTON FUNCTIONALITY =================

/**
 * Scroll ke atas dengan smooth animation
 */
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
    duration: 500
  });
}

/**
 * Toggle button visibility saat scroll
 */
function toggleBackToTopBtn() {
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (!backToTopBtn) return;

  // Tampilkan button jika scroll > 300px
  if (window.scrollY > 300) {
    backToTopBtn.classList.add('show');
    backToTopBtn.classList.remove('hide');
  } else {
    backToTopBtn.classList.add('hide');
    backToTopBtn.classList.remove('show');
  }
}

/**
 * Debounce scroll event untuk performance
 */
let scrollTimeout;
function handleScroll() {
  if (scrollTimeout) clearTimeout(scrollTimeout);
  
  scrollTimeout = setTimeout(() => {
    toggleBackToTopBtn();
  }, 50);
}

/**
 * Initialize back to top button
 */
document.addEventListener('DOMContentLoaded', function() {
  const backToTopBtn = document.getElementById('backToTopBtn');
  
  if (backToTopBtn) {
    // Show button on scroll
    window.addEventListener('scroll', handleScroll);
    
    // Click untuk scroll to top
    backToTopBtn.addEventListener('click', scrollToTop);
    
    // Initial check
    toggleBackToTopBtn();
  }
});

/**
 * Cleanup on page unload
 */
window.addEventListener('beforeunload', function() {
  if (scrollTimeout) clearTimeout(scrollTimeout);
});

console.log('✅ Back to Top Button Loaded');
document.addEventListener("DOMContentLoaded", () => {
    const dropdown = document.querySelector(".dropdown");
    const dropdownMenu = document.querySelector(".dropdown-menu");

    // Hitung posisi dropdown-menu (khusus mode mobile) agar tidak
    // ketimpa/kepotong oleh overflow .navbar. Posisi dihitung relatif
    // viewport karena dropdown-menu pakai position:fixed di mobile.
    function positionDropdownMobile() {
        if (!dropdown || !dropdownMenu) return;
        if (window.innerWidth > 768) return; // hanya untuk mobile

        const rect = dropdown.getBoundingClientRect();
        const top = rect.bottom + 8; // jarak 8px di bawah tombol "Divisi"
        dropdownMenu.style.setProperty("--dropdown-top", top + "px");
        dropdownMenu.style.top = top + "px";
    }

    if (dropdown) {
        // Toggle dropdown saat click pada dropdown
        dropdown.addEventListener("click", function(e) {
            e.stopPropagation(); // Stop event bubbling
            console.log("Dropdown clicked");
            this.classList.toggle("active");

            if (this.classList.contains("active")) {
                positionDropdownMobile();
            }
        });

        // Close dropdown immediately saat click pada item di menu
        if (dropdownMenu) {
            const menuItems = dropdownMenu.querySelectorAll("a");
            menuItems.forEach(item => {
                item.addEventListener("click", function(e) {
                    console.log("❌ Menu item clicked - closing dropdown");
                    dropdown.classList.remove("active");
                    // Bersihkan inline style (bukan paksa hidden) biar CSS
                    // class yang ngatur lagi pas dropdown dibuka berikutnya.
                    dropdownMenu.style.opacity = "";
                    dropdownMenu.style.visibility = "";
                    e.preventDefault(); // Jangan propagate event
                });
            });
        }
    }

    // Reposisi ulang saat resize / scroll selagi dropdown masih terbuka
    window.addEventListener("resize", positionDropdownMobile);
    window.addEventListener("scroll", function() {
        if (dropdown && dropdown.classList.contains("active")) {
            positionDropdownMobile();
        }
    }, { passive: true });

    // Close dropdown saat click di luar
    document.addEventListener("click", function(e) {
        if (dropdown && !dropdown.contains(e.target)) {
            dropdown.classList.remove("active");
        }
    });

    console.log('✅ Dropdown Fixed');
});

// ================== NAVBAR SCROLL FADE INDICATOR (MOBILE) ==================
document.addEventListener("DOMContentLoaded", () => {
    const navbarEl = document.querySelector(".navbar");
    const navbarWrap = document.querySelector(".navbar-wrap");

    if (!navbarEl || !navbarWrap) return;

    function updateNavbarFade() {
        // Cuma relevan di mobile (fade-nya juga cuma di-render via CSS mobile)
        const maxScroll = navbarEl.scrollWidth - navbarEl.clientWidth;
        const isAtEnd = maxScroll <= 1 || navbarEl.scrollLeft >= maxScroll - 2;
        navbarWrap.classList.toggle("scrolled-end", isAtEnd);
    }

    navbarEl.addEventListener("scroll", updateNavbarFade, { passive: true });
    window.addEventListener("resize", updateNavbarFade);

    // Cek kondisi awal (misal navbar gak overflow sama sekali di tablet/desktop)
    updateNavbarFade();
});

// ================== TUTUP MODAL DENGAN TOMBOL ESC ==================
document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;

    // Semua modal di situs ini pakai pola class "active" buat nampil/sembunyi,
    // jadi cukup satu listener buat nutup modal manapun yang lagi kebuka.
    const modalIds = [
        "bookModal",
        "databaseModal",
        "visiModal",
        "nilaiModal",
        "beritaModal",
        "lightbox",
        "imgPreview"
    ];

    modalIds.forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.classList.remove("active");
    });

    // Dropdown navbar juga ikut ditutup biar konsisten
    const dropdown = document.querySelector(".dropdown");
    if (dropdown) dropdown.classList.remove("active");
});
