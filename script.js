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

// ================== DATA ANGGOTA ==================
const dataAnggota = {
    "Divisi PSDM": [
        {
            nama: "Hartika Julianty Nursuhada",
            foto: "asset/img/psdm.jpg",
            unit: "Koordinator",
            program: "Upgarding, LDK",
            desc: "Penanggung Jawab Program-Program Kerja Bidang Pengembangan Sumber Daya Manusia."
        },
        {
            nama: "Amanda Nur Fadillah",
            foto: "asset/img/manda.jpg",
            unit: "Manuntung Studi Club",
            program: "Manuntung Sport, Manuntung Kajian",
            desc: "Pelaksana Teknis Pengembangan pada Bidang Ilmiah, Minat dan Bakat."
        },
        {
            nama: "Daniel Putra Natama Lumban Gaol",
            foto: "asset/img/daniel.jpg",
            unit: "Manuntung English Improvement",
            program: "Manuntung Class",
            desc: "Pelaksana Teknis Program-Program Pengembangan Kemampuan Berbahasa Inggris."
        }
    ],
    "Divisi Humas": [
        {
            nama: "Akhmad Nurwahid",
            foto: "asset/img/humas.png",
            unit: "Koordinator",
            program: "",
            desc: "Penanggung Jawab Program-Program Kerja Divisi Hubungan Masyarakat."
        },
        {
            nama: "Samuel Putra Natama Lumban Gaol",
            foto: "asset/img/samuel.jpg",
            unit: "Informasi & Komunikasi",
            program: "Rebuild Website KPMB",
            desc: "Pelaksana Teknis Program-Program Internal dan Eksternal KPMB Makassar."
        },
        {
            nama: "Afkhar Fahry Wardana",
            foto: "asset/img/pari.jpg",
            unit: "Media & Kreatif",
            program: "Arsip Kegiatan",
            desc: "Penanggung Jawab Pengelolaan Konten pada Media KPMB Makassar."
        }
    ],
    "Divisi Biro": [
        {
            nama: "Dewi Hardiani",
            foto: "asset/img/dewi.jpg",
            unit: "Kepala Biro",
            program: "Moas, Menabur, HUT Asrama",
            desc: "Penanggung Jawab Kepala Operasional Asrama KPMB Makassar."
        },
        {
            nama: "Ermi",
            foto: "asset/img/ermi.png",
            unit: "Keuangan",
            program: "Moas Menabur HUT Asrama",
            desc: "Penanggung Jawab Pembukuan dan Pengelolaan Keuangan Asrama."
        },
        {
            nama: "Andi Miftahul Jannah",
            foto: "asset/img/mita.jpg",
            unit: "Inventaris & Logistik",
            program: "Moas Menabur HUT Asrama",
            desc: "Penanggung Jawab Pengelolaan Inventaris Organisasi."
        }
    ]
};

// ================== DIVISI DISPLAY ==================

document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll("#struktur .box").forEach(box => {
        box.addEventListener("click", () => {
            const namaDivisi = box.dataset.divisi || box.querySelector('h3').textContent;
            tampilkanDivisi(namaDivisi);
            showPage('divisi');
        });
    });
});

function tampilkanDivisi(divisi) {
    const data = dataAnggota[divisi];
    if (!data) return;

    const koor = data[0];
    let anggotaHTML = "";

    data.slice(1).forEach(item => {
        anggotaHTML += `
            <div class="tim-card">
                <img src="${item.foto}" alt="${item.nama}">
                <h4>${item.nama}</h4>
                <p>${item.unit}</p>
            </div>
        `;
    });

    const anggotaDiv = document.getElementById("anggotaDivisi");
    if (anggotaDiv) {
        anggotaDiv.innerHTML = `
            <div class="detail-divisi">
                <div class="divisi-header">
                    <div class="divisi-text">
                        <small>Koordinator Divisi</small>
                        <h2>${divisi}</h2>
                        <p class="ketua-deskripsi">${koor.desc}</p>
                        <br>
                        <p><strong>Program Kerja:</strong> ${koor.program || "-"}</p>
                    </div>
                    <div class="koordinator">
                        <img src="${koor.foto}" alt="${koor.nama}">
                        <div class="nama-koor">${koor.nama}</div>
                    </div>
                </div>
                <div class="sub-divisi-title">
                    <small>Anggota Divisi</small>
                    <h3>Struktur Divisi</h3>
                </div>
                <div class="tim-grid">
                    ${anggotaHTML}
                </div>
            </div>
        `;

        anggotaDiv.scrollIntoView({
            behavior: "smooth"
        });
    }
}

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
        "asset/img/k1.jpg",
        "asset/img/k2.jpg",
        "asset/img/k3.jpg",
        "asset/img/k4.jpg",
        "asset/img/k5.jpeg"
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

const images = document.querySelectorAll('.gallery-img');
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