    const dataAnggota = {
    "Divisi PSDM":[
    {
    nama:"Hartika Julianty Nursuhada",
    foto:"asset/img/psdm.jpg",
    unit:"Koordinator ",
    program:"Upgarding, LDK ", 
    desc:"Penanggung Jawab Program-Program Kerja Bidang Pengembangan Sumber Daya Manusia.."
    },
    {
    nama:"Daniel Putra Natama Lumban Gaol",
    foto:"asset/img/daniel.jpg",
    unit:"Manuntung English Improvement",
    program:"Manuntung Class",
    desc:"Pelaksana Teknis Program-Program Pengembangan Kemampuan Berbahasa Inggris Bagi Warga KPMB Makassar.."
    },
    {
    nama:"Amanda Nur Fadillah",
    foto:"asset/img/manda.jpg",
    unit:"Manuntung Studi Club ",
    program:"Manuntung Sport , Manuntung Kajian  ",
    desc:"Pelaksana Teknis Pengembangan pada Bidang Ilmiah, Minat dan Bakat Termasuk di Dalamnya Program Pengembangan Wawasan dan Keilmuan Warga KPMB Makassar.."
    }
    ],

    "Divisi Humas":[
    {
    nama:"Akhmad Nurwahid",
    foto:"asset/img/humas.png",
    unit:"Koordiantor",
    program:"",
    desc:"Penanggung Jawab Program-Program Kerja Divisi Hubungan Masyarakat."
    },
    {
    nama:"Samuel Putra Natama Lumban Gaol ",
    foto:"asset/img/samuel.jpg",
    unit:"Informasi & Komunikasi , Kemahasiswaan",
    program:"Rebuild Website KPMB",
    desc:"Pelaksana Teknis Program- Program yang Mencakup Informasi Mengenai Internal dan Eksternal KPMB Makassar, Pelaksana Teknis Terhadap Pendataan Pelajar dan Mahasiswa Asal Kota Balikpapan yang melanjutkan Studi di Kota Makassar yang mencakup tentang keanggotaan dan memonitoring keaktifan serta keterlibatan anggota"           ,
        
    }, 
    {
    nama:"Afkhar Fahry Wardana ",
    foto:"asset/img/pari.jpg",
    unit:"Media & Kreatif",
    program:"Arsip Kegiatan",
    desc:"Penanggung Jawab dan Pelaksana Teknis Pengelolaan Konten pada Media KPMB Makassa."
    }
    ],
    
    "Divisi Biro":[
    {
    nama:"Dewi Hardiani",
    foto:"asset/img/dewi.JPG",
    unit:"Kepala Biro",
    program:"Pengelolaan Aset",
    desc:"Penanggung Jawab dan Kepala Operasional Asrama KPMB Makassar."
    },
    {
    nama:"Ermi",
    foto:"asset/img/ermi.jpg",
    unit:"Keuangan",
    program:"Persiapan Kegiatan",
    desc:"Penanggung Jawab Terhadap Pembukuan dan Pengelolaan Keuangan Asrama KPMB Makassar.."
    },
    {
    nama:"Andi Miftahul Jannah",
    foto:"asset/img/mita.jpg",
    unit:"Inventaris & Logistik",
    program:"Pendataan Anggota",
    desc: "Penanggung Jawab Terhadap Pengelolaan Inventaris Organisasi Serta Pengadaan Kelengkapan dan Logistik Organisasi."
    }
    ]
    };

    // ================== PAGE NAVIGATION ==================

    function showPage(id){
    document.querySelectorAll(".page").forEach(page=>{
    page.classList.remove("active");
    });

    const target = document.getElementById(id);
    if(target){
    target.classList.add("active");
    window.scrollTo(0,0);
    }
    }

    // ================== DIVISI ==================

   document.addEventListener("DOMContentLoaded", function () {
  const cards = document.querySelectorAll("#divisi .struktur-grid .box");
  const container = document.getElementById("anggotaDivisi");

  cards.forEach((box) => {
    box.addEventListener("click", function () {
      const titleEl = this.querySelector("h3");
      if (!titleEl) return;

      const namaDivisi = titleEl.innerText.trim(); // contoh: "Divisi PSDM"

      // aman kalau key di dataAnggota kamu cuma "PSDM", "Humas", "Biro"
      const key1 = namaDivisi;
      const key2 = namaDivisi.replace(/^Divisi\s+/i, "").trim();

      const anggota = dataAnggota[key1] || dataAnggota[key2];

      if (!anggota || anggota.length === 0) {
        container.innerHTML = `<p style="margin-top:20px;">Belum ada data anggota untuk ${namaDivisi}.</p>`;
        return;
      }

     let html = `<h2>${namaDivisi}</h2>`;
      html += `<div class="anggota-list">`;

      anggota.forEach((a) => {
        html += `
          <div class="anggota-card">
            <img src="${a.foto}" alt="${a.nama}">
            <div class="anggota-info">
              <h3>${a.nama}</h3>
              <p><b>Unit:</b> ${a.unit}</p>
              <div class="program">
                <h4>${a.program}</h4>
                <p>${a.desc}</p>
              </div>
            </div>
          </div>
        `;
      });

      html += `</div>`;
      container.innerHTML = html;
    });
  });
});
    // ================== FLIPBOOK ==================

  let pageFlip = null;

function initBook() {
  const bookEl = document.getElementById("book");

  if (!bookEl) return;

  if (pageFlip) {
    pageFlip.destroy();
    pageFlip = null;
  }

  pageFlip = new St.PageFlip(bookEl, {
    width: 450,
    height: 600,
    size: "fixed",
    showCover: true,
    usePortrait: true,
    autoSize: true,
    maxShadowOpacity: 0.5,
    mobileScrollSupport: true
  });

  const pages = [];
  for (let i = 1; i <= 127; i++) {
    pages.push(`asset/book/page${i}.jpg`);
  }

  pageFlip.loadFromImages(pages);

  document.getElementById("currentPage").textContent = 1;
  document.getElementById("totalPage").textContent = pages.length;
}

function bukaSejarah() {
  document.getElementById("bookModal").style.display = "flex";

  setTimeout(() => {
    initBook();
  }, 100);
}

function closeSejarah() {
  document.getElementById("bookModal").style.display = "none";

  if (pageFlip) {
    pageFlip.destroy();
    pageFlip = null;
  }
}

document.addEventListener("click", function (e) {
  if (!pageFlip) return;

  if (e.target.classList.contains("next")) {
    pageFlip.flipNext("bottom");
  }

  if (e.target.classList.contains("prev")) {
    pageFlip.flipPrev("bottom");
  }
});

  /* klik luar buku untuk keluar */


    // ================== DATABASE ==================

    function bukaDatabase(){

    document.getElementById("bookModal").classList.remove("active");

    const modal = document.getElementById("databaseModal");
    modal.classList.add("active");

    document.querySelectorAll(".data-box").forEach(box=>{
    box.classList.remove("active");
    });

    document.getElementById("alumni").classList.add("active");

    }

    function closeDatabase(){
    document.getElementById("databaseModal").classList.remove("active");
    }

    function showData(id){

    document.querySelectorAll(".data-box").forEach(box=>{
    box.classList.remove("active");
    });

    document.getElementById(id).classList.add("active");

    }

    // ================== IMAGE PREVIEW ==================

    document.querySelectorAll(".db-table img").forEach(img=>{
    img.addEventListener("click",function(){

    const preview = document.getElementById("imgPreview");
    const previewImg = document.getElementById("previewImg");

    previewImg.src = this.src;
    preview.classList.add("active");

    });
    });

    document.querySelector(".close-img").onclick=function(){
    document.getElementById("imgPreview").classList.remove("active");
    };

    document.getElementById("imgPreview").onclick=function(e){
    if(e.target.id==="imgPreview"){
    this.classList.remove("active");
    }
    };

    // ================== VISI MISI ==================

    function bukaVisiMisi(){

    document.getElementById("bookModal").classList.remove("active");
    document.getElementById("databaseModal").classList.remove("active");

    document.getElementById("visiModal").classList.add("active");

    }

    function closeVisi(){
    document.getElementById("visiModal").classList.remove("active");
    }

    // ================== NILAI ==================

    function bukaNilai(){

    document.getElementById("bookModal").classList.remove("active");
    document.getElementById("databaseModal").classList.remove("active");
    document.getElementById("visiModal").classList.remove("active");

    document.getElementById("nilaiModal").classList.add("active");

    }

    function closeNilai(){
    document.getElementById("nilaiModal").classList.remove("active");
    }

    // ================== HERO SLIDER ==================

    // ================== HERO SLIDER ==================

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

  function updateHero(){

  if(!hero) return;

  hero.style.backgroundImage =
  "linear-gradient(rgba(0,0,0,.6),rgba(0,0,0,.6)), url('" + heroImages[heroIndex] + "')";

  }

  const heroNext = document.querySelector(".hero-next");
  const heroPrev = document.querySelector(".hero-prev");

  if(heroNext){
  heroNext.onclick=function(){

  heroIndex++;

  if(heroIndex >= heroImages.length){
  heroIndex = 0;
  }

  updateHero();

  };
  }

  if(heroPrev){
  heroPrev.onclick=function(){

  heroIndex--;

  if(heroIndex < 0){
  heroIndex = heroImages.length-1;
  }

  updateHero();

  };
  }

  updateHero();

  setInterval(()=>{
  heroIndex++;

  if(heroIndex >= heroImages.length){
  heroIndex = 0;
  }

  updateHero();

  },5000)