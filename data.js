const COLLECTION = [
  {
    id: "nascita-lumbini",
    title: "La nascita a Lumbini",
    motif: "lotus",
    accent: "#c9942a",
    text: "Nato sotto un sal a Lumbini, il piccolo Siddhattha compie sette passi: dove posa il piede sboccia un fiore di loto.",
    quote: "La mente è tutto ciò che siamo: con i nostri pensieri creiamo il mondo.",
    source: "Dhammapada, v. 1"
  },
  {
    id: "grande-rinuncia",
    title: "La Grande Rinuncia",
    motif: "moon",
    accent: "#6b5b95",
    text: "Nella notte, mentre la luna illumina Kapilavastu, Siddhattha lascia palazzo e corona per cercare la fine del soffrire.",
    quote: "Non dimorare nel passato, non sognare il futuro: la mente presente è la vera vita.",
    source: "Bhaddekaratta Sutta"
  },
  {
    id: "illuminazione-bodhi",
    title: "L'illuminazione",
    motif: "tree",
    accent: "#3e6b3e",
    text: "Sotto l'albero Bodhi, a Bodh Gaya, Siddhattha vince le tentazioni di Māra e diventa il Buddha, il Risvegliato.",
    quote: "Il Dhamma ha un solo sapore, come il mare ha un solo sapore: il sapore della libertà.",
    source: "Udāna 5.5"
  },
  {
    id: "primo-discorso",
    title: "Il primo discorso",
    motif: "wheel",
    accent: "#7a1f1f",
    text: "Nel parco dei cervi di Sarnath il Buddha mette in moto la Ruota del Dhamma, insegnando la Via di mezzo.",
    quote: "Io insegno una sola cosa: la sofferenza e la fine della sofferenza.",
    source: "Dalle prediche del Buddha"
  },
  {
    id: "mucalinda",
    title: "Il serpente Mucalinda",
    motif: "snake",
    accent: "#2e6f5e",
    text: "Durante la tempesta, il nāga Mucalinda avvolge il Buddha nei suoi anelli e lo protegge con il proprio cappuccio.",
    quote: "Chi non fa del male a nessuno, sicuro dorme e si sveglia felice.",
    source: "Dhammapada, v. 15"
  },
  {
    id: "nalagiri",
    title: "L'elefante Nālāgiri",
    motif: "elephant",
    accent: "#8a6d3b",
    text: "L'elefante inferocito Nālāgiri carica il Buddha, che lo accoglie con benevolenza: la bestia si inginocchia e si placa.",
    quote: "Con la dolcezza si vince l'ira, con la bontà il male, con la generosità l'avidità, con la verità il bugiardo.",
    source: "Dhammapada, v. 223"
  },
  {
    id: "kisa-gotami",
    title: "Kisā Gotamī e il seme",
    motif: "bowl",
    accent: "#a8763e",
    text: "Folle di dolore, Kisā Gotamī cerca un seme di senape per una casa dove la morte non sia mai entrata.",
    quote: "Impermanenti sono le cose composte: è la loro natura nascere e dissolversi.",
    source: "Mahāparinibbāna Sutta"
  },
  {
    id: "angulimala",
    title: "Angulimāla",
    motif: "lamp",
    accent: "#b5651d",
    text: "Il bandito Angulimāla, coperto di crudeltà, incontra il Buddha e depone la spada: diventa monaco e santo.",
    quote: "L'odio non vince mai l'odio: solo l'amore vince l'odio. Questa è la legge antica e perenne.",
    source: "Dhammapada, v. 5"
  },
  {
    id: "ananda",
    title: "Ānanda, il fedele",
    motif: "book",
    accent: "#4a5a7a",
    text: "Attendente del Buddha per venticinque anni, Ānanda custodisce ogni parola e la recita al primo Concilio.",
    quote: "La compagnia dei savi è una felicità, come l'ascolto del Dhamma è una felicità.",
    source: "Mangala Sutta"
  },
  {
    id: "sariputta",
    title: "Sāriputta",
    motif: "star",
    accent: "#6b4f8a",
    text: "Primo tra i discepoli nella saggezza, Sāriputta spiega il Dhamma con una chiarezza che nasce dall'umiltà.",
    quote: "La saggezza nasce dalla meditazione: senza meditazione la saggezza svanisce.",
    source: "Dhammapada, v. 282"
  },
  {
    id: "moggallana",
    title: "Moggallāna",
    motif: "moon",
    accent: "#2e4a6f",
    text: "Maestro dei poteri straordinari, con l'occhio divino Moggallāna vede la danza di meriti e sofferenze degli esseri.",
    quote: "Vigile tra i sonnolenti, sveglio tra i dormienti: il saggio avanza come un cavallo da corsa.",
    source: "Dhammapada, v. 29"
  },
  {
    id: "mahapajapati",
    title: "Mahāpajāpatī Gotamī",
    motif: "lotus",
    accent: "#8a3b5c",
    text: "Zia e madre adottiva del Buddha, ottiene l'ordine monastico femminile: è la prima bhikkhunī della storia.",
    quote: "Il rispetto per la madre e per il padre, e per il maestro: è la benedizione della vita.",
    source: "Dhammapada, v. 332"
  },
  {
    id: "nagarjuna",
    title: "Nāgārjuna",
    motif: "enso",
    accent: "#3a3a3a",
    text: "Filosofo della Via di mezzo, Nāgārjuna insegna la vacuità: le cose sono vuote di sé, e per questo tutto è possibile.",
    quote: "Ciò che nasce da cause non esiste di per sé: ciò che non esiste di per sé è vuoto.",
    source: "Mūlamadhyamakakārikā"
  },
  {
    id: "bodhidharma",
    title: "Bodhidharma",
    motif: "enso",
    accent: "#1f3a5f",
    text: "Il monaco dallo sguardo severo attraversa il mare dall'India alla Cina: è il primo patriarca del Chan, lo Zen.",
    quote: "Trasmissione fuori dalle scritture, sguardo dritto sulla mente: vedere la propria natura è diventare Buddha.",
    source: "Attribuito a Bodhidharma"
  },
  {
    id: "shantideva",
    title: "Shāntideva",
    motif: "lamp",
    accent: "#8a4a1f",
    text: "Il monaco Shāntideva compone la Via del Bodhisattva: una guida poetica per svegliare il cuore della compassione.",
    quote: "Finché lo spazio dura, finché ci sono esseri viventi, anch'io rimanga, per dissolvere il dolore del mondo.",
    source: "Bodhicaryāvatāra, X"
  },
  {
    id: "padmasambhava",
    title: "Padmasambhava",
    motif: "mountain",
    accent: "#5f2e6f",
    text: "Guru Rinpoche, il nato dal loto, doma i demoni del Tibet e pianta il Dhamma tra le sue montagne innevate.",
    quote: "Cerca la mente: quando la cerchi, non la trovi. Quell'irritrovarla è la sua natura di luce.",
    source: "Insegnamenti di Guru Rinpoche"
  },
  {
    id: "milarepa",
    title: "Milarepa",
    motif: "mountain",
    accent: "#4f6f8a",
    text: "Il grande yogi del Tibet vive in caverne di neve, canta il Dhamma e raggiunge il risveglio in una sola vita.",
    quote: "Ho rinunciato a tutto, e così la mia mente è a suo agio in qualunque luogo.",
    source: "Le Centomila Canti di Milarepa"
  },
  {
    id: "yeshe-tsogyal",
    title: "Yeshe Tsogyal",
    motif: "lotus",
    accent: "#7a2e5e",
    text: "Prima discepola di Padmasambhava, Yeshe Tsogyal custodisce e tramanda gli insegnamenti segreti del Tibet.",
    quote: "Le esperienze sono come nuvole: lasciale venire e andare, non aggrapparti a niente.",
    source: "Dalla vita di Yeshe Tsogyal"
  },
  {
    id: "gampopa",
    title: "Gampopa",
    motif: "book",
    accent: "#3e5e4a",
    text: "Medico divenuto monaco, unisce la disciplina del Kadampa e la pratica del Mahāmudrā: nasce la scuola Kagyü.",
    quote: "Quando la mente non si disturba, è felice; quando non aggrappa, è libera.",
    source: "Dagli insegnamenti di Gampopa"
  },
  {
    id: "dalai-lama",
    title: "Il Dalai Lama",
    motif: "sun",
    accent: "#b5651d",
    text: "Il quattordicesimo Dalai Lama attraversa l'esilio con il sorriso: porta la compassione del Tibet in tutto il mondo.",
    quote: "La mia religione è la gentilezza.",
    source: "Tenzin Gyatso"
  },
  {
    id: "dogen",
    title: "Dōgen",
    motif: "book",
    accent: "#2e2e2e",
    text: "Dōgen porta lo Zen in Giappone e scrive lo Shōbōgenzō: per lui sedersi in zazen è già essere il Buddha.",
    quote: "Studiare la Via è studiare se stessi; studiare se stessi è dimenticare se stessi.",
    source: "Genjōkōan"
  },
  {
    id: "ryokan",
    title: "Ryōkan",
    motif: "moon",
    accent: "#4a4a6f",
    text: "Il monaco-poeta Ryōkan vive povero tra gli alberi, gioca con i bambini e scrive versi di neve e di luna.",
    quote: "Il ladro se n'è andato e non ha lasciato nulla: alla finestra, la luna.",
    source: "Versi di Ryōkan"
  },
  {
    id: "ajahn-chah",
    title: "Ajahn Chah",
    motif: "tree",
    accent: "#2e5e3e",
    text: "Maestro della Foresta, Ajahn Chah insegna con parabole semplici: la mente è una tazza d'acqua limpida.",
    quote: "Se lasci andare un po', avrai un po' di pace; se lasci andare tutto, avrai pace completa.",
    source: "Dalle prediche di Ajahn Chah"
  },
  {
    id: "thich-nhat-hanh",
    title: "Thich Nhat Hanh",
    motif: "wave",
    accent: "#2e6f8e",
    text: "Il monaco vietnamita insegna la consapevolezza di ogni gesto: lavare i piatti, per lavare i piatti.",
    quote: "La pace è ogni passo.",
    source: "Thich Nhat Hanh"
  }
];

const CARDS_PER_PAGE = 4;
