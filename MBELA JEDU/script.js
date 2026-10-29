
const PHOTOS = [
  { src: "photos/club adolescents1.jpg", titre: "Seance du club Ado", album:"Club Adolescents"},
  { src: "photos/club adolescents2.jpg", titre: "Seance du club Ado", album: "Club Adolescents"},
  { src: "photos/club adolescents3.jpg", titre: "seance du club Ado", album: "Club Adolescents"},
  { src: "photos/club adolescents4.jpg", titre: "seance du club Ado", album: "Club Adolescents"},
  { src: "photos/club adolescents5.jpg", titre: "seance du club Ado", album: "Club Adolescents"},
  { src: "photos/culte1.jpg", titre: "Cultes dominicaux", album: "Cultes" },
  { src: "photos/culte2.jpg", titre: "cultes dominicaux", album: "Cultes" },
  { src: "photos/culte3.jpg", titre: "cultes de sainte cène",album: "Cultes" },
  { src: "photos/culte4.jpg", titre: "cultes speciaux", album: "Cultes" },
  { src: "photos/culte5.jpg", titre: "cultes speciaux", album: "Cultes" },
  { src: "photos/fetes1.jpg", titre: "Fête de noel", album: "Fêtes de noel" },
  { src: "photos/fetes2.jpg", titre: "Remise de cadeaux", album: "Fêtes de noel" },
  { src: "photos/divertissement1.jpg", titre: "divert&jeux", album:"Divertissements"},
  { src: "photos/divertissement2.jpg", titre: "divert&jeux", album:"Divertissements"},
  { src: "photos/divertissement3.jpg", titre: "divert&jeux", album:"Divertissements"},
  { src: "photos/divertissement4.jpg", titre: "divert&jeux", album:"Divertissements"},
  { src: "photos/divertissement5.jpg", titre: "divert&jeux", album:"Divertissements"}
];

const VIDEOS = [
  { type: "fichier", src: "videos/video1.mp4", affiche: "photos/photo1.jpg", titre: "Chant des enfants" },
  { type: "fichier", src: "videos/video2.mp4", affiche: "photos/photo3.jpg", titre: "Souvenirs de Noel" },
  { type: "fichier", src: "videos/video3.mp4", titre: "Messages bibliques" }
];

const WHATSAPP = "237655308645";


const $ = (s) => document.querySelector(s);

$("#burger").addEventListener("click", (e) => {
  const ouvert = $("#menu").classList.toggle("ouvert");
  e.currentTarget.setAttribute("aria-expanded", ouvert);
});
$("#menu").addEventListener("click", (e) => {
  if (e.target.tagName === "A") $("#menu").classList.remove("ouvert");
});
$("#annee").textContent = new Date().getFullYear();

let albumActif = "Tout";
let visibles = [];
const albums = ["Tout", ...new Set(PHOTOS.map((p) => p.album))];

function afficherFiltres() {
  $("#filtres").innerHTML = "";
  albums.forEach((nom) => {
    const b = document.createElement("button");
    b.className = "filtre";
    b.textContent = nom;
    b.setAttribute("aria-pressed", nom === albumActif);
    b.addEventListener("click", () => { albumActif = nom; afficherFiltres(); afficherGalerie(); });
    $("#filtres").appendChild(b);
  });
}

function afficherGalerie() {
  const g = $("#galerie");
  g.innerHTML = "";
  visibles = PHOTOS.filter((p) => albumActif === "Tout" || p.album === albumActif);
  visibles.forEach((p, i) => {
    const b = document.createElement("button");
    b.className = "photo";
    b.setAttribute("aria-label", "Agrandir : " + p.titre);
    const img = document.createElement("img");
    img.src = p.src; img.alt = p.titre; img.loading = "lazy";
    img.onerror = () => { b.innerHTML = '<div class="vide-photo">Ajoutez ' + p.src + '</div>'; };
    const l = document.createElement("span");
    l.textContent = p.titre;
    b.append(img, l);
    b.addEventListener("click", () => ouvrir(i));
    g.appendChild(b);
  });
}


let courant = 0;
function ouvrir(i) {
  courant = (i + visibles.length) % visibles.length;
  const p = visibles[courant];
  $("#bImg").src = p.src; $("#bImg").alt = p.titre;
  $("#bLegende").textContent = p.titre;
  $("#boite").classList.add("ouverte");
}
const fermer = () => $("#boite").classList.remove("ouverte");
$("#bFermer").addEventListener("click", fermer);
$("#bPrec").addEventListener("click", () => ouvrir(courant - 1));
$("#bSuiv").addEventListener("click", () => ouvrir(courant + 1));
$("#boite").addEventListener("click", (e) => { if (e.target.id === "boite") fermer(); });
document.addEventListener("keydown", (e) => {
  if (!$("#boite").classList.contains("ouverte")) return;
  if (e.key === "Escape") fermer();
  if (e.key === "ArrowLeft") ouvrir(courant - 1);
  if (e.key === "ArrowRight") ouvrir(courant + 1);
});

function afficherVideos() {
  VIDEOS.forEach((v) => {
    const carte = document.createElement("article");
    carte.className = "video";
    const lecteur = document.createElement("div");
    lecteur.className = "lecteur";
    const bouton = document.createElement("button");
    bouton.className = "lecture";
    bouton.setAttribute("aria-label", "Lire : " + v.titre);
    const affiche = v.type === "youtube"
      ? "https://img.youtube.com/vi/" + v.id + "/hqdefault.jpg" : v.affiche;
    if (affiche) bouton.style.backgroundImage = "url('" + affiche + "')";
    bouton.innerHTML = "<i></i>";
    bouton.addEventListener("click", () => {
      lecteur.innerHTML = "";
      if (v.type === "youtube") {
        const f = document.createElement("iframe");
        f.src = "https://www.youtube-nocookie.com/embed/" + v.id + "?autoplay=1";
        f.allow = "autoplay; encrypted-media; picture-in-picture";
        f.allowFullscreen = true; f.title = v.titre;
        lecteur.appendChild(f);
      } else {
        const vid = document.createElement("video");
        vid.src = v.src; vid.controls = true; vid.autoplay = true; vid.playsInline = true;
        lecteur.appendChild(vid);
      }
    });
    lecteur.appendChild(bouton);
    const t = document.createElement("h3");
    t.textContent = v.titre;
    carte.append(lecteur, t);
    $("#listeVideos").appendChild(carte);
  });
}

$("#formulaire").addEventListener("submit", (e) => {
  e.preventDefault();
  const texte = "Bonjour, je suis " + $("#nom").value + ". " + $("#msg").value;
  window.open("https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(texte), "_blank");
  $("#ok").style.display = "block";
  e.target.reset();
});

afficherFiltres();
afficherGalerie();
afficherVideos();
