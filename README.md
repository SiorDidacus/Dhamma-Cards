# Santini del Dharma

Piccola web-app personale: un raccoglitore virtuale di "santini" di ispirazione cristiana
nella forma, dedicati a figure e episodi del mondo buddhista.

## Come funziona

- All'apertura si vede la **pagina 1**: lo schermo è diviso in quattro sezioni, ognuna con una carta.
- **Tocca una carta** → si apre a schermo intero.
- **Tocca di nuovo** → la carta si gira e si legge il retro, con una citazione di ispirazione.
- **"← Torna"** (o tocco fuori dalla carta) → si torna alla pagina.
- **Scorri a destra** → pagina successiva; **scorri a sinistra** → pagina precedente.
  (Su desktop: frecce ← → della tastiera.)
- I puntini in basso indicano e permettono di saltare direttamente a una pagina.
- Le carte già lette mostrano un piccolo punto dorato (memoria salvata sul telefono).
- **Sull'ultima pagina trovi il tile "+"**: premi «Nuova carta», scegli l'immagine del
  fronte, poi quella del retro, dai un titolo (facoltativo) e salva. La carta appare
  subito nella collezione, ed è salvata sul telefono (funziona anche offline).

## Contenuto

24 carte su 6 pagine: la vita del Buddha, episodi celebri, discepoli, filosofi e patriarchi,
maestri del Tibet e maestri Zen e contemporanei. Le illustrazioni sono SVG disegnate a mano
(loto, albero Bodhi, ruota del Dhamma, enso, ecc.), nel stile dei santini tradizionali.

## Installazione sul telefono

1. Pubblica la cartella su un hosting statico (es. GitHub Pages).
2. Apri l'indirizzo con il browser del telefono (Chrome su Android, Safari su iPhone).
3. Dal menu del browser scegli **"Aggiungi alla schermata Home"**: l'app si installerà
   come applicazione, a schermo intero e **funziona anche offline** (service worker incluso).

## Struttura

```
index.html            struttura dell'app
styles.css            stile (carte, flip 3D, swipe, overlay)
app.js                logica: pagine, flip, overlay, aggiunta carte personali
data.js               collezione: 24 carte (titolo, didascalia, citazione, motivo)
manifest.webmanifest  manifest PWA
sw.js                 service worker per l'uso offline
icons/                icone dell'app
cards/                le carte come immagini PNG (fronte e retro, 750×1050 px)
tools/                script per rigenerare le PNG di cards/
```

## Aggiungere nuove carte

Aggiungi un oggetto a `COLLECTION` in `data.js`:

```js
{
  id: "id-unico",
  title: "Titolo della carta",
  motif: "lotus",
  accent: "#7a1f1f",
  text: "Didascalia del fronte.",
  quote: "Citazione del retro.",
  source: "Fonte"
}
```

Le pagine si generano da sole, 4 carte per pagina. Motivi disponibili: `lotus`, `moon`,
`tree`, `wheel`, `snake`, `elephant`, `bowl`, `lamp`, `book`, `star`, `enso`, `mountain`,
`sun`, `wave`.
