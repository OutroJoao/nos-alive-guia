/* =============================================================
   NOS ALIVE 2026 — DADOS DA PROGRAMAÇÃO (OFICIAL)
   -------------------------------------------------------------
   Fonte: cartaz oficial (Excel "Programação Diária por Palco e Hora",
   ref. Expresso/Blitz). Este é o ÚNICO ficheiro a editar.

   ⚠️ HORAS DE FIM = ESTIMATIVA. O cartaz só publica a hora de INÍCIO.
      Os "end" foram calculados (até ao concerto seguinte / duração
      típica por tipo de palco). Corrige se tiveres horas exatas.

   Editar: { day:"d1", stage:"nos", artist:"Nome", start:"21:15", end:"22:45", genre:"Rock" }
   day: d1 (9 Jul) | d2 (10 Jul) | d3 (11 Jul)
   stage: nos | heineken | wtf | coreto | fado | portico | comedia | literario
   ============================================================= */

const FESTIVAL = {
  name: "NOS ALIVE",
  edition: "'26",
  location: "Passeio Marítimo de Algés, Oeiras",

  days: [
    { id: "d1", dow: "QUI", num: "09", long: "Quinta, 9 Julho",  iso: "2026-07-09" },
    { id: "d2", dow: "SEX", num: "10", long: "Sexta, 10 Julho",  iso: "2026-07-10" },
    { id: "d3", dow: "SÁB", num: "11", long: "Sábado, 11 Julho", iso: "2026-07-11" },
  ],

  stages: [
    { id: "nos", name: "Palco NOS", color: "#0089b3" },
    { id: "heineken", name: "Palco Heineken", color: "#1fae4d" },
    { id: "wtf", name: "WTF / Clubbing", color: "#e0148c" },
    { id: "coreto", name: "Palco Coreto", color: "#8b5cf6" },
    { id: "fado", name: "Galp Fado Café", color: "#c0392b" },
    { id: "portico", name: "Pórtico", color: "#16a085" },
    { id: "comedia", name: "Palco Comédia", color: "#f5a623" },
    { id: "literario", name: "Palco Literário", color: "#5b6ee1" },
  ],

  shows: [
    // d1 · nos
    { day: "d1", stage: "nos", artist: "The Royston Club", start: "18:00", end: "19:30" },
    { day: "d1", stage: "nos", artist: "A Perfect Circle", start: "19:30", end: "21:15" },
    { day: "d1", stage: "nos", artist: "Nick Cave & The Bad Seeds", start: "21:15", end: "22:45" },
    { day: "d1", stage: "nos", artist: "Twenty One Pilots", start: "00:30", end: "02:00" },
    // d1 · heineken
    { day: "d1", stage: "heineken", artist: "Sonya", start: "16:30", end: "18:00" },
    { day: "d1", stage: "heineken", artist: "Dogstar", start: "18:30", end: "20:00" },
    { day: "d1", stage: "heineken", artist: "Alabama Shakes", start: "20:00", end: "21:30" },
    { day: "d1", stage: "heineken", artist: "Xinobi", start: "22:15", end: "23:45", genre: "Live" },
    { day: "d1", stage: "heineken", artist: "Matt Berninger", start: "23:45", end: "01:30" },
    { day: "d1", stage: "heineken", artist: "Tomora", start: "01:30", end: "03:00" },
    // d1 · wtf
    { day: "d1", stage: "wtf", artist: "Maria Lui", start: "17:00", end: "18:00" },
    { day: "d1", stage: "wtf", artist: "Saya Noé", start: "18:00", end: "19:00" },
    { day: "d1", stage: "wtf", artist: "Linka Moja", start: "19:00", end: "20:15" },
    { day: "d1", stage: "wtf", artist: "Gui Aly", start: "20:15", end: "21:55" },
    { day: "d1", stage: "wtf", artist: "Rumia", start: "22:30", end: "23:45" },
    { day: "d1", stage: "wtf", artist: "Polo & Pan", start: "23:45", end: "01:30", genre: "DJ set" },
    { day: "d1", stage: "wtf", artist: "Midnight Generation", start: "01:30", end: "03:10" },
    // d1 · coreto
    { day: "d1", stage: "coreto", artist: "Deixa Rolá", start: "16:30", end: "17:30" },
    { day: "d1", stage: "coreto", artist: "Neon Soho", start: "19:00", end: "20:00" },
    { day: "d1", stage: "coreto", artist: "Duques do Precariado", start: "21:00", end: "22:00" },
    { day: "d1", stage: "coreto", artist: "Hetta", start: "22:45", end: "23:45" },
    { day: "d1", stage: "coreto", artist: "Rita Maia", start: "00:30", end: "01:30" },
    // d1 · fado
    { day: "d1", stage: "fado", artist: "Orquestra Maré do Amanhã", start: "17:30", end: "18:50" },
    { day: "d1", stage: "fado", artist: "Geadas", start: "18:50", end: "19:50" },
    { day: "d1", stage: "fado", artist: "Geadas", start: "20:30", end: "22:00" },
    { day: "d1", stage: "fado", artist: "Diana Vilarinho", start: "22:00", end: "23:00" },
    { day: "d1", stage: "fado", artist: "Diana Vilarinho", start: "23:45", end: "00:45" },
    // d1 · portico
    { day: "d1", stage: "portico", artist: "Groove My Soul", start: "15:00", end: "16:15" },
    { day: "d1", stage: "portico", artist: "Groove My Soul", start: "16:15", end: "17:30" },
    { day: "d1", stage: "portico", artist: "Namorados da Cidade", start: "17:30", end: "18:45" },
    { day: "d1", stage: "portico", artist: "Namorados da Cidade", start: "18:45", end: "20:00" },
    { day: "d1", stage: "portico", artist: "A-Gold", start: "20:00", end: "21:00" },
    // d1 · comedia
    { day: "d1", stage: "comedia", artist: "Na Wall convida Francisco Reis e Rafael Jesus", start: "17:00", end: "17:15" },
    { day: "d1", stage: "comedia", artist: "João Nuno Gonçalo", start: "17:15", end: "17:30" },
    { day: "d1", stage: "comedia", artist: "Inês Baptista", start: "17:30", end: "17:45" },
    { day: "d1", stage: "comedia", artist: "Rui Mirama", start: "17:45", end: "18:00" },
    { day: "d1", stage: "comedia", artist: "Bolinha Nunes", start: "18:00", end: "18:20" },
    { day: "d1", stage: "comedia", artist: "Vasco Pereira Coutinho", start: "19:00", end: "19:20" },
    { day: "d1", stage: "comedia", artist: "Beatriz Gosta", start: "20:35", end: "20:55" },
    { day: "d1", stage: "comedia", artist: "Curto e Grosso (Eduardo Madeira e Jel)", start: "23:45", end: "00:05" },
    // d1 · literario
    { day: "d1", stage: "literario", artist: "“A que soam os livros”, com Valter Hugo Mãe e Ana Markl", start: "17:15", end: "17:40" },
    { day: "d1", stage: "literario", artist: "“Greatest Hits”, com Pedro Chagas Freitas e Ana Markl", start: "17:40", end: "18:05" },
    // d2 · nos
    { day: "d2", stage: "nos", artist: "The Warning", start: "18:00", end: "19:30" },
    { day: "d2", stage: "nos", artist: "Skunk Anansie", start: "19:30", end: "21:00" },
    { day: "d2", stage: "nos", artist: "Wolf Alice", start: "21:00", end: "22:45" },
    { day: "d2", stage: "nos", artist: "Foo Fighters", start: "22:45", end: "00:15" },
    // d2 · heineken
    { day: "d2", stage: "heineken", artist: "Call Me", start: "16:30", end: "18:00" },
    { day: "d2", stage: "heineken", artist: "Palaye Royale", start: "18:45", end: "20:10" },
    { day: "d2", stage: "heineken", artist: "Jehnny Beth", start: "20:10", end: "21:35" },
    { day: "d2", stage: "heineken", artist: "The War on Drugs", start: "21:35", end: "23:05" },
    { day: "d2", stage: "heineken", artist: "Zara Larsson", start: "01:15", end: "02:45" },
    // d2 · wtf
    { day: "d2", stage: "wtf", artist: "Stresshead", start: "18:00", end: "19:05" },
    { day: "d2", stage: "wtf", artist: "La Fleur", start: "19:05", end: "20:30" },
    { day: "d2", stage: "wtf", artist: "Chris Luno", start: "20:30", end: "21:45" },
    { day: "d2", stage: "wtf", artist: "Fiona Kraft", start: "21:45", end: "23:25" },
    { day: "d2", stage: "wtf", artist: "Digitalism", start: "00:45", end: "02:15", genre: "Hybrid live set" },
    { day: "d2", stage: "wtf", artist: "SBTRKT", start: "02:15", end: "03:55", genre: "DJ set" },
    // d2 · coreto
    { day: "d2", stage: "coreto", artist: "Inês Sousa", start: "16:30", end: "17:30" },
    { day: "d2", stage: "coreto", artist: "Picas", start: "18:45", end: "19:45" },
    { day: "d2", stage: "coreto", artist: "Ellis Ferrére", start: "19:45", end: "21:05" },
    { day: "d2", stage: "coreto", artist: "Constança Quinteiro", start: "21:05", end: "22:30" },
    { day: "d2", stage: "coreto", artist: "Mutu", start: "22:30", end: "23:30" },
    // d2 · fado
    { day: "d2", stage: "fado", artist: "Fado Máfia", start: "17:30", end: "18:50" },
    { day: "d2", stage: "fado", artist: "Fado Máfia", start: "18:50", end: "20:20" },
    { day: "d2", stage: "fado", artist: "Ana Sofia Varela", start: "20:20", end: "21:20" },
    { day: "d2", stage: "fado", artist: "Ana Sofia Varela", start: "22:00", end: "23:00" },
    { day: "d2", stage: "fado", artist: "“Playback Paião” por Tigerman", start: "01:15", end: "02:15" },
    // d2 · portico
    { day: "d2", stage: "portico", artist: "Soundproof", start: "15:00", end: "16:15" },
    { day: "d2", stage: "portico", artist: "Soundproof", start: "16:15", end: "17:30" },
    { day: "d2", stage: "portico", artist: "Trio Cadmira +1", start: "17:30", end: "18:45" },
    { day: "d2", stage: "portico", artist: "Trio Cadmira +1", start: "18:45", end: "20:00" },
    { day: "d2", stage: "portico", artist: "No Collective", start: "20:00", end: "21:00" },
    // d2 · comedia
    { day: "d2", stage: "comedia", artist: "Madalena Malveiro", start: "17:00", end: "17:15" },
    { day: "d2", stage: "comedia", artist: "Pedro Costa Rodrigues", start: "17:15", end: "17:30" },
    { day: "d2", stage: "comedia", artist: "Hélder Machado", start: "17:30", end: "17:45" },
    { day: "d2", stage: "comedia", artist: "Joana Gama", start: "17:45", end: "18:05" },
    { day: "d2", stage: "comedia", artist: "“Aqui Que Ninguém Nos Ouve”, com Diogo Faro e Isabel Viana", start: "19:00", end: "19:20" },
    { day: "d2", stage: "comedia", artist: "Francisco Menezes", start: "20:30", end: "20:50" },
    { day: "d2", stage: "comedia", artist: "Gilmário Vemba", start: "22:00", end: "22:20" },
    // d2 · literario
    { day: "d2", stage: "literario", artist: "“Das Letras à Música”, com Pedro Boucherie Mendes, Afonso Cruz e Luísa Sobral", start: "17:30", end: "17:55" },
    // d3 · nos
    { day: "d3", stage: "nos", artist: "Don West", start: "17:30", end: "18:50" },
    { day: "d3", stage: "nos", artist: "Teddy Swims", start: "18:50", end: "20:35" },
    { day: "d3", stage: "nos", artist: "Lorde", start: "20:35", end: "22:05" },
    { day: "d3", stage: "nos", artist: "Florence + The Machine", start: "22:35", end: "00:05" },
    { day: "d3", stage: "nos", artist: "Buraka Som Sistema", start: "00:55", end: "02:25" },
    // d3 · heineken
    { day: "d3", stage: "heineken", artist: "Rita Cortezão", start: "16:30", end: "18:00" },
    { day: "d3", stage: "heineken", artist: "Florence Road", start: "18:00", end: "19:30" },
    { day: "d3", stage: "heineken", artist: "Alessi Rose", start: "19:30", end: "21:00" },
    { day: "d3", stage: "heineken", artist: "Pixies", start: "21:25", end: "22:55" },
    { day: "d3", stage: "heineken", artist: "Noiserv", start: "23:55", end: "01:25" },
    { day: "d3", stage: "heineken", artist: "Zimmer90", start: "02:15", end: "03:45" },
    // d3 · wtf
    { day: "d3", stage: "wtf", artist: "Fidju Kitxora", start: "18:00", end: "19:45" },
    { day: "d3", stage: "wtf", artist: "Pedro da Linha", start: "19:45", end: "20:50", genre: "Live" },
    { day: "d3", stage: "wtf", artist: "Deize Tigrona", start: "20:50", end: "21:40" },
    { day: "d3", stage: "wtf", artist: "Arthi", start: "21:40", end: "23:20" },
    { day: "d3", stage: "wtf", artist: "Titica", start: "00:05", end: "01:45" },
    { day: "d3", stage: "wtf", artist: "Modeselektor", start: "02:10", end: "03:50", genre: "DJ set" },
    // d3 · coreto
    { day: "d3", stage: "coreto", artist: "Esteves Sem Metafísica", start: "16:30", end: "17:30" },
    { day: "d3", stage: "coreto", artist: "Suzana Francês", start: "19:00", end: "20:00" },
    { day: "d3", stage: "coreto", artist: "Razy", start: "20:35", end: "21:35" },
    { day: "d3", stage: "coreto", artist: "Redoma", start: "22:35", end: "00:05" },
    { day: "d3", stage: "coreto", artist: "Sheri Vari", start: "00:05", end: "01:05" },
    // d3 · fado
    { day: "d3", stage: "fado", artist: "Valéria", start: "17:30", end: "19:00" },
    { day: "d3", stage: "fado", artist: "Valéria", start: "19:00", end: "20:30" },
    { day: "d3", stage: "fado", artist: "Beatriz Felício", start: "20:30", end: "21:50" },
    { day: "d3", stage: "fado", artist: "Beatriz Felício", start: "21:50", end: "22:50" },
    { day: "d3", stage: "fado", artist: "“Playback Paião” por Tigerman", start: "00:00", end: "01:00" },
    // d3 · portico
    { day: "d3", stage: "portico", artist: "Raio X", start: "15:00", end: "16:15" },
    { day: "d3", stage: "portico", artist: "Raio X", start: "16:15", end: "17:30" },
    { day: "d3", stage: "portico", artist: "Nassurra", start: "17:30", end: "18:45" },
    { day: "d3", stage: "portico", artist: "Nassurra", start: "18:45", end: "20:00" },
    { day: "d3", stage: "portico", artist: "Doctor Jony", start: "20:00", end: "21:00" },
    // d3 · comedia
    { day: "d3", stage: "comedia", artist: "Catarina Rocha", start: "17:00", end: "17:15" },
    { day: "d3", stage: "comedia", artist: "Joana Oliveira", start: "17:15", end: "17:30" },
    { day: "d3", stage: "comedia", artist: "Vitor Costa", start: "17:30", end: "17:45" },
    { day: "d3", stage: "comedia", artist: "Joana Caldeira", start: "17:45", end: "18:00" },
    { day: "d3", stage: "comedia", artist: "João Pinto", start: "18:00", end: "18:20" },
    { day: "d3", stage: "comedia", artist: "Dagu", start: "18:20", end: "18:40" },
    { day: "d3", stage: "comedia", artist: "Duarte Pita Negrão", start: "19:50", end: "20:10" },
    { day: "d3", stage: "comedia", artist: "Hugo Sousa", start: "21:45", end: "22:05" },
    // d3 · literario
    { day: "d3", stage: "literario", artist: "“Ensaiar a Escrita”, com David Azevedo Lopes, Francisco Guimarães e Ana Bárbara Pedrosa", start: "17:00", end: "17:25" },
    { day: "d3", stage: "literario", artist: "“Isto Não Tem Nada a Ler”, com Hugo Van Der Ding", start: "17:40", end: "18:05" },
  ],

  /* --- "★ Para ti" — recomendações do perfil Spotify, ancoradas ao cartaz oficial --- */
  recos: {
    "The War on Drugs": { tier: "top",   why: "Indie atmosférico que já ouves — 'Thinking of a Place'." },
    "Alabama Shakes":   { tier: "top",   why: "Soul orgânica na linha de The Teskey Brothers e Marcus King." },
    "Matt Berninger":   { tier: "top",   why: "Barítono narrativo, mesma veia de Gang of Youths." },
    "Digitalism":       { tier: "top",   why: "Eletrónica alternativa, herança Chemical Brothers / STRFKR." },
    "Polo & Pan":       { tier: "top",   why: "French touch tropical à Sébastien Tellier / Maribou State." },
    "Teddy Swims":      { tier: "taste", why: "Soul contemporânea de raízes — afinidade com Jon Batiste." },
  },

  /* --- Mapa OFICIAL do recinto ---
     Imagem base (nosalive.com) + coordenadas x,y (fração 0-1) dos pinos,
     retiradas do mapa interativo oficial da página /no-festival/.
     stage -> usa a cor do palco; senão usa "color"/emoji. */
  map: {
    image: "assets/mapa-recinto.jpg",
    ratio: 1.6, // 2000 x 1250
    pins: [
      { stage: "nos",       x: 0.3508, y: 0.2123 },
      { stage: "wtf",       x: 0.5216, y: 0.3810 },
      { stage: "comedia",   x: 0.4675, y: 0.4607 },
      { stage: "heineken",  x: 0.6563, y: 0.4533 },
      { stage: "fado",      x: 0.6840, y: 0.4032 },
      { stage: "literario", x: 0.6118, y: 0.5089 },
      { stage: "coreto",    x: 0.5841, y: 0.5850 },
      { stage: "portico",   x: 0.5408, y: 0.3108 }, // Entrada principal / Palco Pórtico
    ],
  },

  /* --- Info prática do evento (fonte: guia BLITZ/Expresso) --- */
  info: {
    hours: "Portas às 15h · fecho às 04h da madrugada. Última entrada até 15 min antes do fecho. 8 palcos e mais de 39h de programação.",
    tickets: "Dias 10 e 11 (Sex/Sáb) esgotados, tal como os passes de 2 e 3 dias. Restam bilhetes diários para 9 Jul (~84€). Passe trocado por pulseira à entrada, ou no C.C. Alegro Alfragide (8–9 Jul, 10h–22h).",
    transport: [
      "Comboio (CP): Linha de Cascais até à estação de Algés, depois a pé. 30% de desconto CP entre 8–12 Jul com bilhete do festival.",
      "Regresso: comboios da Linha de Cascais (Algés → Cais do Sodré) das 01h45 às 04h.",
      "Carris: 723, 729, 750, 751, 776 e 15E (elétrico), com paragem em Algés.",
      "Metro: linha verde até Cais do Sodré.",
    ],
    rules: [
      "Leva: chapéu/boné, óculos de sol, protetor solar (até 100 ml) e tampões para os ouvidos.",
      "Garrafa de água de plástico até 50 cl, com tampa.",
      "Powerbank não maior que um telemóvel.",
      "Proibido: vidro e embalagens rígidas.",
    ],
  },
};
