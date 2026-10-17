(function () {
  "use strict";
  const Z = window.ZC;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const rad = (x) => (x * Math.PI) / 180;
  const deg = (x) => (x * 180) / Math.PI;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const byId = (id) => Z.monumentos.find((m) => m.id === id);

  const LEVELS = [["facil", "Lectura fácil"], ["general", "General"], ["profundo", "En profundidad"], ["peques", "Para peques"]];
  let level = "general";
  try { const l = localStorage.getItem("zc-level"); if (LEVELS.some((x) => x[0] === l)) level = l; } catch (e) {}
  function setLevel(l) { level = l; try { localStorage.setItem("zc-level", l); } catch (e) {} }
  const textOf = (m) => (m.niveles[level] || m.niveles.general || "");
  const paragraphs = (t) => t.split(/\n\s*\n/).map((p) => `<p>${esc(p)}</p>`).join("");

  let pos = null, heading = null, current = null, dismissedId = null, scanning = false;
  let map = null, userMarker = null;

  // ---------- Geometría ----------
  function dist(a, b) {
    const R = 6371000, dLat = rad(b.lat - a.lat), dLng = rad(b.lng - a.lng);
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(h));
  }
  function bearing(a, b) {
    const y = Math.sin(rad(b.lng - a.lng)) * Math.cos(rad(b.lat));
    const x = Math.cos(rad(a.lat)) * Math.sin(rad(b.lat)) - Math.sin(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.cos(rad(b.lng - a.lng));
    return (deg(Math.atan2(y, x)) + 360) % 360;
  }
  const angDiff = (a, b) => { const d = Math.abs(a - b) % 360; return d > 180 ? 360 - d : d; };
  function compassHeading(alpha, beta, gamma) {
    const x = rad(beta), y = rad(gamma), z = rad(alpha);
    const vx = -Math.cos(z) * Math.sin(y) - Math.sin(z) * Math.sin(x) * Math.cos(y);
    const vy = -Math.sin(z) * Math.sin(y) + Math.cos(z) * Math.sin(x) * Math.cos(y);
    let h = Math.atan2(vx, vy); if (h < 0) h += 2 * Math.PI; return deg(h);
  }
  const distText = (d) => `A unos ${Math.round(d)} m de ti`;

  // ---------- Voz del móvil ----------
  function stopTTS() { if ("speechSynthesis" in window) speechSynthesis.cancel(); const b = $("#btn-tts"); if (b) b.textContent = "Leer en voz alta"; }
  function toggleTTS(m) {
    if (!("speechSynthesis" in window)) return;
    if (speechSynthesis.speaking) { stopTTS(); return; }
    const u = new SpeechSynthesisUtterance(m.nombre + ". " + textOf(m).replace(/^BORRADOR[^.]*\.\s*/, ""));
    u.lang = "es-ES"; u.rate = level === "facil" || level === "peques" ? 0.9 : 1;
    u.onend = () => { const b = $("#btn-tts"); if (b) b.textContent = "Leer en voz alta"; };
    speechSynthesis.speak(u);
    $("#btn-tts").textContent = "Detener";
  }

  // ---------- Router ----------
  const VIEWS = ["home", "escanear", "mapa", "episodios", "m"];
  function show(name) {
    VIEWS.forEach((v) => $("#view-" + v).classList.toggle("active", v === name));
  }
  function setNav(r) { $$(".bottomnav a").forEach((a) => a.classList.toggle("on", a.dataset.r === r)); }

  function route() {
    const h = (location.hash || "#/").replace(/^#/, "") || "/";
    stopTTS();
    if (!h.startsWith("/escanear")) stopCamera();
    let m;
    if (h === "/" || h === "") { show("home"); setNav("home"); window.scrollTo(0, 0); }
    else if (h === "/ruta") { show("home"); setNav("home"); setTimeout(() => { const el = $("#ruta"); if (el) el.scrollIntoView(); }, 30); }
    else if (h === "/escanear") { show("escanear"); setNav("escanear"); window.scrollTo(0, 0); }
    else if (h === "/mapa") { show("mapa"); setNav("mapa"); window.scrollTo(0, 0); initMap(); }
    else if (h === "/episodios") { show("episodios"); setNav("episodios"); window.scrollTo(0, 0); renderEpisodios(); }
    else if ((m = h.match(/^\/m\/([\w-]+)$/)) && byId(m[1])) { show("m"); setNav(""); window.scrollTo(0, 0); renderFicha(byId(m[1])); }
    else { location.hash = "#/"; }
  }

  // ---------- Ficha ----------
  function playerHtml(m) {
    if (m.spotifyEpisodeId) return `<div class="embed"><iframe title="Episodio en Spotify" src="https://open.spotify.com/embed/episode/${encodeURIComponent(m.spotifyEpisodeId)}" allow="encrypted-media" loading="lazy"></iframe></div>`;
    if (m.ivooxEpisodeId) return `<div class="embed"><iframe title="Episodio en iVoox" src="https://www.ivoox.com/player_ej_${encodeURIComponent(m.ivooxEpisodeId)}_4_1.html" loading="lazy"></iframe></div>`;
    return `<p class="small">Este lugar aún no tiene su episodio enlazado. Mientras tanto puedes oír el texto con la voz del móvil.</p>`;
  }
  function renderFicha(m) {
    const ttsOk = "speechSynthesis" in window;
    $("#ficha").innerHTML = `
      <header class="fhero"><img src="${esc(m.foto)}" alt="${esc(m.nombre)}">
        <div class="wrap"><a class="link-light" href="#/">← Volver</a>
          <p class="kicker">${esc(m.epoca)}</p><h1 class="font-display">${esc(m.nombre)}</h1>
          <p class="lead">${esc(m.resumen)}</p></div></header>
      <div class="wrap fbody">
        <section class="listen" aria-label="Escuchar">
          <h2 class="font-display">Escúchalo · ${esc(m.titulo)}</h2>
          ${playerHtml(m)}
          ${ttsOk ? `<button id="btn-tts" class="btn-ghost" type="button">Leer en voz alta</button>` : ""}
        </section>
        <section aria-label="Leer">
          <div class="levels" role="radiogroup" aria-label="Nivel de lectura">
            ${LEVELS.map(([k, n]) => `<button type="button" role="radio" aria-checked="${k === level}" data-l="${k}" class="${k === level ? "on" : ""}">${n}</button>`).join("")}
          </div>
          <div id="texto" class="texto ${level}" style="margin-top:1rem">${paragraphs(textOf(m))}</div>
        </section>
        <a class="btn-ghost" href="#/mapa">Ver en el mapa</a>
      </div>`;
    $("#ficha .levels").addEventListener("click", (e) => {
      const l = e.target.dataset && e.target.dataset.l; if (!l) return;
      setLevel(l); stopTTS();
      $$("#ficha .levels button").forEach((b) => { b.classList.toggle("on", b.dataset.l === l); b.setAttribute("aria-checked", b.dataset.l === l); });
      const t = $("#texto"); t.className = "texto " + l; t.innerHTML = paragraphs(textOf(m));
    });
    const tb = $("#btn-tts"); if (tb) tb.addEventListener("click", () => toggleTTS(m));
  }

  // ---------- Selector de nivel de la portada ----------
  function wireHomeLevels() {
    const group = $('#view-home [role="radiogroup"]'); if (!group) return;
    const box = $("#view-home .font-legible"); const m = byId("catedral");
    const btns = $$("button", group);
    function apply(l) {
      btns.forEach((b, i) => {
        const on = LEVELS[i][0] === l;
        b.setAttribute("aria-checked", on);
        b.className = "rounded-full border px-4 py-2 text-sm font-medium transition-colors " + (on ? "border-foreground bg-foreground text-background" : "border-border hover:border-foreground/40");
      });
      if (box) box.innerHTML = paragraphs(m.niveles[l] || m.niveles.general);
    }
    btns.forEach((b, i) => b.addEventListener("click", () => { setLevel(LEVELS[i][0]); apply(LEVELS[i][0]); }));
    apply(level);
  }

  // ---------- Escáner ----------
  function ranked() {
    if (!pos) return [];
    return Z.monumentos.map((m) => {
      const d = dist(pos, m), b = bearing(pos, m);
      return { m, d, diff: heading == null ? null : angDiff(b, heading) };
    }).filter((r) => r.d <= Z.config.maxDistance * 2)
      .sort((a, b) => (a.d + (a.diff == null ? 0 : a.diff * 3)) - (b.d + (b.diff == null ? 0 : b.diff * 3)));
  }
  function refresh() {
    if (!scanning) return;
    const st = $("#status"); st.hidden = false;
    if (!pos) { st.textContent = "Buscando tu ubicación…"; return; }
    const list = ranked();
    const best = list.find((r) => r.d <= Z.config.maxDistance && (r.diff == null || r.diff <= Z.config.fov));
    if (!best) {
      st.textContent = heading == null ? "Ubicación lista. Esperando la brújula…" : "No detecto ningún edificio delante. Gira despacio.";
      return;
    }
    st.textContent = "Edificio detectado";
    if (best.m.id !== dismissedId && (!current || current.id !== best.m.id)) openSheet(best.m, best.d, list);
    else if (current) $("#s-dist").textContent = distText(dist(pos, current));
  }
  function openSheet(m, d, list) {
    current = m;
    $("#sheet").hidden = false;
    $("#s-epoca").textContent = m.epoca;
    $("#s-nombre").textContent = m.nombre;
    $("#s-dist").textContent = d == null ? "" : distText(d);
    $("#s-resumen").textContent = m.resumen;
    $("#s-open").href = "#/m/" + m.id;
    const others = (list || ranked()).filter((r) => r.m.id !== m.id).slice(0, 3);
    $("#others").innerHTML = others.map((r) => `<button type="button" data-id="${esc(r.m.id)}">${esc(r.m.nombre)}</button>`).join("");
  }
  async function start() {
    const btn = $("#btn-start"); btn.disabled = true;
    // El permiso de orientación en iPhone debe pedirse dentro del gesto del usuario
    try {
      if (window.DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission === "function") await DeviceOrientationEvent.requestPermission();
    } catch (e) {}
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" } }, audio: false });
      $("#cam").srcObject = stream;
      $("#camfallback").hidden = true; $("#reticle").hidden = false;
    } catch (e) {
      $("#cam-msg").textContent = "No he podido abrir la cámara. Comprueba el permiso del navegador o elige un lugar en el mapa.";
      btn.disabled = false; return;
    }
    scanning = true; dismissedId = null; current = null;
    startGeo();
    refresh();
  }
  function stopCamera() {
    scanning = false; current = null;
    const v = $("#cam"); if (v && v.srcObject) { v.srcObject.getTracks().forEach((t) => t.stop()); v.srcObject = null; }
    const f = $("#camfallback"); if (f) f.hidden = false;
    ["#reticle", "#status", "#sheet"].forEach((s) => { const el = $(s); if (el) el.hidden = true; });
    const b = $("#btn-start"); if (b) b.disabled = false;
  }
  let geoStarted = false;
  function startGeo() {
    if (!geoStarted) {
      geoStarted = true;
      window.addEventListener("deviceorientationabsolute", onOrient, true);
      window.addEventListener("deviceorientation", onOrient, true);
    }
    if ("geolocation" in navigator && !startGeo.id) {
      startGeo.id = navigator.geolocation.watchPosition(
        (p) => { pos = { lat: p.coords.latitude, lng: p.coords.longitude }; updateUserMarker(); refresh(); },
        () => { if (scanning) { const st = $("#status"); st.hidden = false; st.textContent = "Sin ubicación. Elige un lugar en el mapa."; } },
        { enableHighAccuracy: true, maximumAge: 2000, timeout: 15000 });
    }
  }
  let lastH = 0;
  function onOrient(e) {
    let h = null;
    if (typeof e.webkitCompassHeading === "number") h = e.webkitCompassHeading;
    else if (e.alpha != null && e.beta != null && e.gamma != null && (e.absolute || e.type === "deviceorientationabsolute")) h = compassHeading(e.alpha, e.beta, e.gamma);
    if (h == null) return;
    heading = heading == null ? h : (heading + ((((h - heading) % 360) + 540) % 360 - 180) * 0.25 + 360) % 360;
    const now = Date.now(); if (now - lastH > 400) { lastH = now; refresh(); }
  }

  // ---------- Mapa y ruta ----------
  const stops = () => Z.ruta.map(byId).filter(Boolean);
  function gmapsUrl(list, fromMe) {
    const f = (m) => m.lat + "," + m.lng;
    let url = "https://www.google.com/maps/dir/?api=1&travelmode=walking&destination=" + encodeURIComponent(f(list[list.length - 1]));
    if (!fromMe) url += "&origin=" + encodeURIComponent(f(list[0]));
    const way = (fromMe ? list.slice(0, -1) : list.slice(1, -1)).map(f).join("|");
    if (way) url += "&waypoints=" + encodeURIComponent(way);
    return url;
  }
  function renderRuta() {
    const list = stops(); if (!list.length) return;
    let total = 0; const legs = list.map((m, i) => { const d = i ? dist(list[i - 1], m) : 0; total += d; return d; });
    $("#ruta-resumen").textContent = `${list.length} paradas · unos ${(total / 1000).toFixed(1).replace(".", ",")} km en línea recta · unos ${Math.round(total / 75)} min a pie sin paradas`;
    $("#ruta-gmaps").href = gmapsUrl(list, false);
    $("#ruta-gmaps-yo").href = gmapsUrl(list, true);
    $("#ruta-lista").innerHTML = list.map((m, i) => `
      <li class="stop"><span class="n">${i + 1}</span>
        <div><h3>${esc(m.nombre)}</h3><div class="meta">${i ? Math.round(legs[i]) + " m desde la parada anterior" : "Punto de salida"}</div></div>
        <a href="#/m/${esc(m.id)}">Ficha</a></li>`).join("");
  }
  function updateUserMarker() {
    if (!map || !pos || typeof L === "undefined") return;
    if (!userMarker) userMarker = L.circleMarker([pos.lat, pos.lng], { radius: 8, color: "#fff", weight: 2, fillColor: "#3b82f6", fillOpacity: 1 }).addTo(map);
    else userMarker.setLatLng([pos.lat, pos.lng]);
  }
  function initMap() {
    renderRuta();
    if (typeof L === "undefined") { $("#map").innerHTML = '<p class="small" style="padding:1rem">No se ha podido cargar el mapa. Comprueba la conexión.</p>'; return; }
    if (!map) {
      const list = stops();
      map = L.map("map").setView([41.5033, -5.75], 16);
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19, attribution: "© OpenStreetMap" }).addTo(map);
      L.polyline(list.map((m) => [m.lat, m.lng]), { color: "#c0562b", weight: 4, dashArray: "6 8" }).addTo(map);
      list.forEach((m, i) => {
        const icon = L.divIcon({ className: "pin", html: `<span>${i + 1}</span>`, iconSize: [29, 29], iconAnchor: [14, 14] });
        L.marker([m.lat, m.lng], { icon }).addTo(map).bindPopup(`<strong>${esc(m.nombre)}</strong><br><a class="popbtn" href="#/m/${esc(m.id)}">Abrir ficha</a>`);
      });
      if (list.length) map.fitBounds(L.latLngBounds(list.map((m) => [m.lat, m.lng])), { padding: [30, 30] });
      updateUserMarker();
    }
    setTimeout(() => map.invalidateSize(), 80);
  }

  // ---------- Episodios ----------
  let filtro = "todos";
  function renderEpisodios() {
    const c = Z.config;
    let top = "";
    if (c.spotifyShowId) top += `<iframe title="Podcast en Spotify" src="https://open.spotify.com/embed/show/${encodeURIComponent(c.spotifyShowId)}" allow="encrypted-media" loading="lazy"></iframe>`;
    else top += `<p class="small">Añade el ID de tu programa de Spotify en data.js para ver aquí el reproductor.</p>`;
    if (c.ivooxPodcastUrl) top += `<p style="margin-top:.7rem"><a class="btn-ghost" href="${esc(c.ivooxPodcastUrl)}" target="_blank" rel="noopener">Escuchar en iVoox</a></p>`;
    $("#show-embed").innerHTML = top;
    const eps = Z.episodios.filter((e) => filtro === "todos" || (filtro === "spotify" ? e.spotifyId : e.ivooxUrl));
    $("#lista-ep").innerHTML = eps.length ? eps.map((e, i) => `
      <li class="ep"><h3>${esc(e.titulo)}</h3><div class="small">${esc(e.fecha || "")}</div>
        <div class="row">
          ${e.spotifyId ? `<button type="button" data-play="${esc(e.spotifyId)}" data-i="${i}">Reproducir aquí</button><a href="https://open.spotify.com/episode/${encodeURIComponent(e.spotifyId)}" target="_blank" rel="noopener">Spotify</a>` : ""}
          ${e.ivooxUrl ? `<a href="${esc(e.ivooxUrl)}" target="_blank" rel="noopener">iVoox</a>` : ""}
        </div><div data-slot="${i}"></div></li>`).join("") : `<li class="small">No hay episodios con este filtro.</li>`;
  }

  // ---------- Eventos ----------
  $("#btn-start").addEventListener("click", start);
  $("#s-close").addEventListener("click", () => { dismissedId = current && current.id; current = null; $("#sheet").hidden = true; });
  $("#others").addEventListener("click", (e) => {
    const id = e.target.dataset && e.target.dataset.id; if (!id) return;
    dismissedId = null; const m = byId(id); openSheet(m, pos ? dist(pos, m) : null);
  });
  $("#filtro").addEventListener("click", (e) => {
    const f = e.target.dataset && e.target.dataset.f; if (!f) return;
    filtro = f; $$("#filtro button").forEach((b) => b.classList.toggle("on", b === e.target)); renderEpisodios();
  });
  $("#lista-ep").addEventListener("click", (e) => {
    const id = e.target.dataset && e.target.dataset.play; if (!id) return;
    const slot = $(`[data-slot="${e.target.dataset.i}"]`);
    slot.innerHTML = slot.innerHTML ? "" : `<iframe title="Episodio" src="https://open.spotify.com/embed/episode/${encodeURIComponent(id)}" allow="encrypted-media" loading="lazy"></iframe>`;
  });
  window.addEventListener("hashchange", route);

  wireHomeLevels();
  route();
})();
