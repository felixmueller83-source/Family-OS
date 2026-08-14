/* Nestwerk Service Worker
   Strategie:
   - Eigene Dateien: aus dem Zwischenspeicher anzeigen, im Hintergrund erneuern.
   - Seitenaufrufe: erst Netz, bei Ausfall der letzte bekannte Stand.
   - Fremde Adressen (Supabase, Open-Meteo): niemals zwischenspeichern.
   Die Versionsnummer bei jeder neuen Fassung hochzählen.                    */
const VERSION = "nestwerk-v3";
const SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./icons/apple-touch-icon.png"
];

self.addEventListener("install", e=>{
  e.waitUntil(
    caches.open(VERSION)
      .then(c=> Promise.allSettled(SHELL.map(u=> c.add(u))))
      .then(()=> self.skipWaiting())
  );
});

self.addEventListener("activate", e=>{
  e.waitUntil(
    caches.keys()
      .then(keys=> Promise.all(keys.filter(k=> k!==VERSION).map(k=> caches.delete(k))))
      .then(()=> self.clients.claim())
  );
});

self.addEventListener("message", e=>{ if(e.data === "skipWaiting") self.skipWaiting(); });

self.addEventListener("fetch", e=>{
  const req = e.request;
  if(req.method !== "GET") return;
  const url = new URL(req.url);
  if(url.origin !== self.location.origin) return;          /* Wetter und Sync ans Netz durchreichen */

  if(req.mode === "navigate"){
    e.respondWith(
      fetch(req)
        .then(res=>{ const copy = res.clone(); caches.open(VERSION).then(c=> c.put("./index.html", copy)); return res; })
        .catch(()=> caches.match("./index.html").then(r=> r || caches.match("./")))
    );
    return;
  }
  e.respondWith(
    caches.match(req).then(hit=>{
      const net = fetch(req).then(res=>{
        if(res && res.status === 200){ const copy = res.clone(); caches.open(VERSION).then(c=> c.put(req, copy)); }
        return res;
      }).catch(()=> hit);
      return hit || net;
    })
  );
});
