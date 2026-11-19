# Carte in formato PNG

Questa cartella contiene le **24 carte della collezione** come immagini PNG
(misura 750×1050 px, proporzioni 5:7 — adatte anche alla stampa):

- `<id>-fronte.png`: il fronte con illustrazione, titolo e didascalia
- `<id>-retro.png`: il retro con la citazione e la fonte

## Rigenerare le immagini

Le immagini si rigenerano con lo script `tools/gen_cards.py`, che legge i dati
delle carte da `tools/cards_data.json`:

```bash
pip install pillow matplotlib
python3 tools/gen_cards.py            # PNG (consigliato)
python3 tools/gen_cards.py --jpeg     # JPEG, file più piccoli
```

Se aggiungi o modifichi carte in `data.js`, aggiorna prima `tools/cards_data.json`:

```bash
node -e "const fs=require('fs');eval(fs.readFileSync('data.js','utf8').replace(/const (COLLECTION|CARDS_PER_PAGE)/g,'globalThis.\$1'));console.log(JSON.stringify(COLLECTION,null,1))" > tools/cards_data.json
```

Nota: le **carte personalizzate** create dall'app con il "+" restano salvate
sul telefono e non fanno parte di questa cartella.
