# Nestwerk — Family OS

Familienplan als installierbare Web-App. Läuft ohne Server, ohne Build, ohne Konto.

## Dateien ins Repository legen

```
index.html                    ← die App
manifest.webmanifest          ← Name, Farben, Symbole
sw.js                         ← Offline-Betrieb
icons/icon-192.png
icons/icon-512.png
icons/icon-maskable-512.png
icons/apple-touch-icon.png
```

Alle Dateien gehören in **dasselbe Verzeichnis**. Liegt die App in einem Unterordner,
funktioniert das ebenfalls — die Pfade sind relativ.

## Installieren

**Android / Chrome:** Seite öffnen, im Menü rechts oben *App installieren*.
Alternativ Admin → Daten → *Jetzt installieren*.

**iPhone / iPad:** in **Safari** öffnen (nicht Chrome), unten auf *Teilen*,
dann *Zum Home-Bildschirm*.

**Desktop:** Chrome oder Edge zeigen ein Symbol in der Adressleiste.

## Neue Fassung ausliefern

1. `index.html` austauschen.
2. In `sw.js` die Zeile `const VERSION = "nestwerk-v1";` hochzählen, z. B. auf `nestwerk-v2`.

Ohne Schritt 2 zeigen installierte Geräte weiter die alte Fassung aus ihrem Zwischenspeicher.
Die App meldet sich dann von selbst mit „Neue Fassung bereit" — laden über Admin → Daten.

## Was offline funktioniert

Alles außer Wetter und Geräteabgleich. Eingaben werden lokal gespeichert und
nachgetragen, sobald wieder Netz da ist.
