/**
 * Linea Studio - Comprehensive Mock Data & Configuration
 * Tailored for Linea Studio (Pécs, Budai Nagy Antal utca 1.)
 */

import {
  LashSetOption,
  PortfolioItem,
  FormResponseItem,
  CalendarAppointment,
  ServiceDetailItem,
  GoogleReviewItem,
  FaqCategory,
  HouseRuleItem
} from '../types';

export const LASH_SET_OPTIONS: LashSetOption[] = [
  {
    id: 'set-1d-classic',
    name: '1D Természetes Classic',
    style: 'Természetes & Visszafogott',
    description: '1 saját pillára 1 műszempilla. Tiszta, szempillaspirál-szerű hatás.',
    imageUrl: '/assets/1.jpg',
  },
  {
    id: 'set-2d-3d-soft',
    name: '2D-3D Soft Light Volume',
    style: 'Elegáns & Lágy',
    description: 'Ultra-finom pillaszálakból képzett tincsek. Kifejező, mégis légies tekintet.',
    imageUrl: '/assets/2.jpg',
  },
  {
    id: 'set-4d-5d-volume',
    name: '4D-5D Russian Volume',
    style: 'Dúsabb & Hangsúlyos',
    description: 'Sűrűbb, látványosabb vonalvezetés fekete bársonyos hatással.',
    imageUrl: '/assets/3.jpg',
  },
  {
    id: 'set-mega-volume',
    name: '6D+ Mega Volume',
    style: 'Látványos & Karakteres',
    description: 'Maximális dúsítás 0.03 mm-es mikroszálakkal, drámai és intenzív feketeség.',
    imageUrl: '/assets/4.jpg',
  },
];

// ==========================================
// 4 DETAILED SERVICES (PDF Page 4 Spec)
// ==========================================
export const DETAILED_SERVICES: ServiceDetailItem[] = [
  {
    id: 'muszempilla',
    name: 'Műszempilla Építés',
    shortTag: '1D - 6D+ Volume & Styling',
    headline: 'Természetes adottságaidhoz és stílusodhoz szabott egyedi szempillasor',
    heroImage: '/assets/1.jpg',
    galleryImages: [
      '/assets/1.jpg',
      '/assets/2.jpg',
      '/assets/3.jpg',
      '/assets/4.jpg',
    ],
    generalDescription:
      'A műszempilla építés nálunk nem egy katalógusból választott sablon. Személyes konzultáción felmérjük a szemformádat, természetes pilláid terhelhetőségét és mindennapi stílusodat, majd pehelykönnyű prémium szálakkal építjük fel a tökéletesen illeszkedő szettet.',
    processSteps: [
      'Alapos, olajmentes szempillatisztítás és zsírtalanítás speciális szempillasamponnal.',
      'Szemalátét felhelyezése és szemforma-térképezés (mapping: ívek, hosszúságok kiválasztása).',
      'Szálankénti izolálás és precíz applikáció orvosi minőségű, bevizsgált ragasztóval.',
      'Befejező átfésülés, nano-gőzös kötésfixálás és otthoni ápolási tanácsadás ajándék kefével.',
    ],
    recommendedFor: [
      'Akik szeretnének minden reggel rendezett, hangsúlyos tekintettel ébredni sminkelés nélkül.',
      'Akiknek természetes pillái egyenesek, világosak vagy ritkábbak.',
      'Akik egy pihentető, minőségi szépségápolási rituáléra vágynak kellemes környezetben.',
    ],
    duration: '1.5 – 2.5 óra (szett típusától függően)',
    durability: '3 – 5 hét (ajánlott töltés: 3-4 hetente a természetes pillaciklus miatt)',
    aftercare: [
      'Az első 24 órában óvd a szempillákat a közvetlen víztől, párától és gőztől (szauna, szolárium).',
      'Kizárólag olajmentes arclemosót és sminkeltávolítót használj a szemkörnyéken.',
      'Ne dörzsöld a szemedet, és ne húzgáld a szálakat!',
      'Naponta 1-2 alkalommal fésüld át a pillákat a kapott puha szempillakefével (csak szárazon).',
      'Kerüld a vízálló szemhéjtust és a spirálozást a műszempillán.',
    ],
    prices: [
      { name: '1D Classic Új szett', price: '14 500 Ft', note: '1 saját pillára 1 műszempilla' },
      { name: '1D Classic Töltés (3 hétig)', price: '10 500 Ft' },
      { name: '2D-3D Soft Light Volume Új szett', price: '17 500 Ft', note: 'Légies, finom volumen' },
      { name: '2D-3D Töltés (3 hétig)', price: '12 500 Ft' },
      { name: '4D-6D Russian Volume Új szett', price: '21 000 Ft', note: 'Intenzív bársonyos feketeség' },
      { name: '4D-6D Töltés (3 hétig)', price: '15 000 Ft' },
      { name: 'Mega Volume (7D+) Új szett', price: '25 000 Ft', note: 'Maximális dúsítás' },
      { name: 'Mega Volume Töltés', price: '18 000 Ft' },
      { name: 'Szakszerű Műszempilla Eltávolítás', price: '4 000 Ft' },
    ],
  },
  {
    id: 'szempilla-lifting',
    name: 'Szempilla Lifting',
    shortTag: 'Természetes ív & Keratin Botox',
    headline: 'Saját szempilláid látványos megemelése és mély táplálása műszempilla nélkül',
    heroImage: '/assets/2.jpg',
    galleryImages: [
       '/assets/2.jpg',
      '/assets/3.jpg',
      '/assets/1.jpg',
      '/assets/4.jpg',
    ],
    generalDescription:
      'A szempilla lifting egy kíméletes, mégis rendkívül hatásos eljárás, amely a saját pilláidat a tövüktől íveli meg egy szilikon sablon segítségével. A kezelést mélyfekete tartós festéssel és keratinos-hialuronsavas tápláló botox maszkkal zárjuk, így a pillák dúsabbnak, hosszabbnak és ragyogóbbnak tűnnek.',
    processSteps: [
      'Szemkörnyék előkészítése és a szemformához illő szilikon lifting sablon méretének kiválasztása.',
      'Saját szálak precíz felhelyezése a sablonra speciális vízbázisú ragasztóval.',
      'Ívelő és fixáló emulzió hatóideje a pillák szerkezetéhez igazítva.',
      'Mélysötét szempillafestés a hegyektől a tövekig.',
      'Keratin & Botox mélytáplálás és vitaminos lezárás.',
    ],
    recommendedFor: [
      'Akik idegenkednek a műszempillától, de nyitottabb, élénkebb tekintetre vágynak.',
      'Akiknek egyenesen vagy lefelé nőnek a természetes pillái.',
      'Sportolóknak, úszóknak, akik nem szeretnének a műszempillák töltésére járni.',
    ],
    duration: 'kb. 60 perc',
    durability: '6 – 8 hét (amíg a saját pillák természetesen kicserélődnek)',
    aftercare: [
      'A kezelést követő 24 órában ne érje víz, forró gőz, könny vagy izzadság a pillákat.',
      '24 óráig ne használj szempillaspirált és szemkrémet.',
      '24 óra letelte után a pillák szabadon moshatók, festhetők, dörzsölhetők és olajos termékekkel is érintkezhetnek.',
    ],
    prices: [
      { name: 'Szempilla Lifting + Mélyfekete Festés', price: '12 500 Ft', note: 'Sablonos ívelés + festés' },
      { name: 'Prémium Keratin & Lash Botox Lifting', price: '14 500 Ft', note: 'Ívelés + festés + intenzív keratin táplálás' },
    ],
  },
  {
    id: 'szemoldok-laminalas',
    name: 'Szemöldök Laminálás',
    shortTag: 'Dús, fésült hatás & Tartós fixálás',
    headline: 'Tökéletesen rendezett, dúsabb hatású és könnyen fésülhető szemöldök',
    heroImage: '/assets/3.jpg',
    galleryImages: [
       '/assets/3.jpg',
      '/assets/4.jpg',
      '/assets/2.jpg',
      '/assets/1.jpg',
    ],
    generalDescription:
      'A szemöldök laminálás a legmodernebb kezelés a kósza, nehezen kezelhető vagy ritkásnak tűnő szemöldökszálak megszelídítésére. A szálak szerkezetét átalakítjuk, így a kívánt irányba fésülhetők, elfedve a hiányos részeket és optikailag megduplázva a szemöldök vastagságát.',
    processSteps: [
      'Szemöldök megtisztítása és a kívánt ideális forma megtervezése a vendéggel közösen.',
      'Lamináló lotion felvitele a szálak lágyítására és formázhatóságára.',
      'Fixáló formula alkalmazása a tartós vonalvezetés rögzítéséhez.',
      'Egyéni bőrtónushoz és hajszínhez kevert prémium hibrid festés.',
      'Szemöldökszedés gyantával/csipesszel és tápláló olajos utóápolás.',
    ],
    recommendedFor: [
      'Akiknek göndör, lefelé növő vagy rendezetlen a szemöldökszáluk.',
      'Akik szeretnék a felkapott "fluffy / fésült" divatos szemöldökhatást.',
      'Akik reggelente unják a szemöldökzselével és ceruzával való hosszas bíbelődést.',
    ],
    duration: 'kb. 50 – 60 perc',
    durability: '5 – 7 hét',
    aftercare: [
      '24 órán át ne érje víz, párás levegő vagy smink a szemöldököt.',
      '24 óra után reggelente elég egy kis szemöldökkefével átfésülni a kívánt formára.',
      'Heti 2-3 alkalommal tápláld ricinus- vagy argánolajjal lefekvés előtt a szálak rugalmasságáért.',
    ],
    prices: [
      { name: 'Szemöldök Laminálás (formázással & festéssel)', price: '12 000 Ft', note: 'Teljes körű styling' },
      { name: 'Kombinált Csomag: Lash Lift + Brow Laminálás', price: '23 500 Ft', note: 'Komplett tekintetmegújítás' },
    ],
  },
  {
    id: 'szemoldok-formazas',
    name: 'Szemöldök Formázás & Festés',
    shortTag: 'Arcformához illeszkedő precíz styling',
    headline: 'Harmonikus, precízen kimért szemöldökvonal kíméletes szedéssel és tartós festéssel',
    heroImage: '/assets/4.jpg',
    galleryImages: [
       '/assets/4.jpg',
      '/assets/1.jpg',
      '/assets/2.jpg',
      '/assets/3.jpg',
    ],
    generalDescription:
      'A jól megválasztott szemöldökforma azonnal keretet ad az arcnak, kiemeli a szemeket és optikailag megemeli a tekintetet. Nem dolgozunk sablonokkal: aranymetszésen alapuló brow mapping technikával határozzuk meg a kezdő-, csúcs- és végpontokat.',
    processSteps: [
      'Brow mapping felmérés az arc arányaihoz igazítva.',
      'Szemöldökfesték árnyalatának egyéni kikeverése (világos szőkétől a hideg barna tónusokig).',
      'Festék precíz felvitele és satírozása az ombre hatásért.',
      'Kíméletes szőrtelenítés professzionális elasztikus gyantával és precíziós csipesszel.',
      'Bőrnyugtató, gyulladáscsökkentő gél felvitele.',
    ],
    recommendedFor: [
      'Akik szeretnék megtalálni az arcukhoz legjobban passzoló formát.',
      'Akik természetes, rendezett megjelenésre vágynak laminálás nélkül.',
      'Rendszeres havi karbantartásra és színfrissítésre.',
    ],
    duration: 'kb. 35 – 45 perc',
    durability: 'A festés a bőrön 1-2 hétig, a szálakon 4-5 hétig látható.',
    aftercare: [
      'A kezelés napján kerüld az erős dörzsölést és az olajos lemosókat a szemöldök területén.',
      'Kerüld az erős hámlasztókat és savakat (AHA, BHA, retinol) a szemöldök közvetlen környékén.',
    ],
    prices: [
      { name: 'Szemöldök Formázás (gyanta + csipesz)', price: '4 500 Ft' },
      { name: 'Szemöldök Formázás + Tartós Festés', price: '6 500 Ft', note: 'Mapping + festés + szedés' },
      { name: 'Hibrid Tartós Festés (hosszabb bőrfogással)', price: '8 000 Ft' },
    ],
  },
];

// ==========================================
// GOOGLE REVIEWS (Verified from https://share.google/dWBT9oc8NyyR0mFXu)
// ==========================================
export const GOOGLE_REVIEWS_URL = 'https://share.google/dWBT9oc8NyyR0mFXu';

export const GOOGLE_REVIEWS: GoogleReviewItem[] = [
  {
    id: 'rev-1',
    authorName: 'Ildikó',
    rating: 5,
    relativeTime: 'Google értékelés',
    text: '2D építés. Szép, precíz munka, nagyon kellemes és nyugodt környezet, köszönöm Kata!',
    serviceMentioned: '2D Soft Light Volume',
  },
  {
    id: 'rev-2',
    authorName: 'Babett',
    rating: 5,
    relativeTime: 'Google értékelés',
    text: 'Szemöldök formázás csipesszel. Nagyon szépen megcsinálta, teljesen olyat amilyet szerettem volna, és közben nagyon jót beszélgettünk. Kata végtelenül kedves és figyelmes!',
    serviceMentioned: 'Szemöldök formázás',
  },
  {
    id: 'rev-3',
    authorName: 'Varga Petra',
    rating: 5,
    relativeTime: 'Google értékelés',
    text: 'A legügyesebb szempillás Pécsen! Nem csak csodaszép lett a szettem, de a szalonban valódi kikapcsolódás volt az a 2 óra. A kávé és a finom tea a szalonbárban külön szuper figyelmesség. Biztosan visszatérő vendég vagyok!',
    serviceMentioned: '3D Light Volume & UV technológia',
  },
  {
    id: 'rev-4',
    authorName: 'Kovács Renáta',
    rating: 5,
    relativeTime: 'Google értékelés',
    text: 'Fantasztikus szakértelem! Nagyon féltem korábban, hogy művi lesz a hatás, de Kata pontosan az arcomhoz és a szemformámhoz tervezte meg a szettet. Egyáltalán nem érzem a pillákat, pehelykönnyű és hihetetlenül tartós. Csillagos ötös!',
    serviceMentioned: '1D Classic Természetes Szett',
  },
  {
    id: 'rev-5',
    authorName: 'Bognár Lili',
    rating: 5,
    relativeTime: 'Google értékelés',
    text: 'Végre egy szalon Pécs belvárosában, ahol valóban a vendég igénye az első, és nem futószalagon készülnek a szettek. A Budai Nagy Antal utcai stúdió megközelítése is kényelmes, a parkolás egyszerű. Csak ajánlani tudom!',
    serviceMentioned: 'Műszempilla építés',
  },
];

// ==========================================
// SALON BAR (PDF Page 3 Spec: "Szalonbár")
// ==========================================
export const SALON_BAR_ITEMS = [
  { name: 'Frissen őrölt prémium kávé', desc: 'Espresso, Cappuccino vagy Latte', icon: 'coffee' },
  { name: 'Szezonális szálas & gyümölcsteák', desc: 'Kellemesen melegítő illatos teák', icon: 'tea' },
  { name: 'Szűrt hideg víz & citromos frissítő', desc: 'Mindig friss hidratálás', icon: 'water' },
  { name: 'Növényi tej alternatívák', desc: 'Zabtej, mandulatej vagy kókusztej kérésre', icon: 'milk' },
];

// ==========================================
// HOUSE RULES (PDF Page 4 Spec)
// ==========================================
export const HOUSE_RULES: HouseRuleItem[] = [
  {
    title: '1. Érkezés smink nélkül',
    description: 'Kérjük, a kezelésre tiszta, szemsminktől, spiráltól és alapozótól mentes szemkörnyékkel érkezz! A sminkmaradványok eltávolítása a te építési idődből vesz el és ronthatja a ragasztó kötését.',
    iconName: 'sparkles',
  },
  {
    title: '2. Pontos érkezés',
    description: 'Kérjük, érkezz pontosan az időpontodra. 10 percnél nagyobb késés esetén sajnos csak annyi pillát tudunk felhelyezni, amennyi a fennmaradó időbe belefér, hogy a következő vendéget ne várakoztassuk.',
    iconName: 'clock',
  },
  {
    title: '3. Lemondási szabályzat (24 óra)',
    description: 'Az időpont módosítására vagy lemondására díjmentesen az időpont előtt legkésőbb 24 órával van lehetőség. 24 órán belüli lemondás vagy meg nem jelenés esetén a következő alkalom foglalásakor a szolgáltatás díjának 50%-a felszámításra kerül.',
    iconName: 'calendar',
  },
  {
    title: '4. Kísérők és gyermekek',
    description: 'A szalonban a teljes nyugalom és a precíz alkotómunka biztosítása érdekében kérjük, hogy egyedül érkezz. Kísérőt, kisgyermeket és háziállatot a kezelőhelyiségben nem áll módunkban fogadni.',
    iconName: 'user-check',
  },
  {
    title: '5. Telefonhasználat és pihenés',
    description: 'A kezelés alatt a szemed zárva van, ezért kérjük, állítsd a telefonodat néma üzemmódba. Ez az idő a te pihenésedről szól – aludni, relaxálni ér!',
    iconName: 'phone-off',
  },
  {
    title: '6. Garancia és elégedettség',
    description: 'Minden új és töltött szettre 48 órás garanciát vállalunk az előírt utóápolási szabályok betartása mellett. Ha rendellenes hullást tapasztalsz, 48 órán belül díjmentesen korrigáljuk.',
    iconName: 'shield',
  },
];

// ==========================================
// FAQS (PDF Page 4 Spec)
// ==========================================
export const FAQS_DATA: FaqCategory[] = [
  {
    category: 'Műszempilla Építés',
    items: [
      {
        question: 'Károsítja a saját szempilláimat a műszempilla?',
        answer: 'Nem, amennyiben szakszerűen, a természetes pilla terhelhetőségéhez igazított vastagsággal és hosszúsággal készül. A Linea Studio-ban szigorúan szálanként izolálunk és ultra-könnyű szálakkal dolgozunk, így a saját szempilla zavartalanul végigjárja a természetes növekedési ciklusát.',
      },
      {
        question: 'Fájdalmas a szempilla felhelyezése?',
        answer: 'Egyáltalán nem! A kezelés teljesen fájdalommentes és relaxáló. A vendégek 90%-a kellemesen elalszik a puha kozmetikai ágyon a halk zene mellett.',
      },
      {
        question: 'Hordhatok kontaktlencsét az építés alatt?',
        answer: 'Az építés idejére javasoljuk a kontaktlencse kivételét, mert a szemhéj hosszas csukva tartása és a ragasztópára minimális szárazságot okozhat. Kérjük, hozz magaddal lencsetokot és folyadékot!',
      },
      {
        question: 'Milyen gyakran kell töltésre járni?',
        answer: 'Átlagosan 3–4 hetente. Naponta természetes módon 2-5 saját szempillánk hullik ki és újul meg, így 3-4 hét elteltével a szett ritkul és lenő, ilyenkor indokolt az új szálak pótlása.',
      },
    ],
  },
  {
    category: 'Szempilla Lifting & Szemöldök',
    items: [
      {
        question: 'Mennyi ideig tart a szempilla lifting hatása?',
        answer: 'A szempilla lifting 6–8 hétig tartós. Nem mosódik ki, a tartóssága addig áll fenn, amíg a meglévő szempillák a természetes cserefolyamat során újakra nem cserélődnek.',
      },
      {
        question: 'Mi a különbség a szemöldök formázás és a laminálás között?',
        answer: 'A formázás a szemöldök szedését (gyantával/csipesszel) és színezését jelenti. A laminálás ezzel szemben magát a szálak szerkezetét teszi lággyá és könnyen fésülhetővé, így a ritkás vagy lefelé kunkorodó szálak tetszőleges irányba fixálhatók.',
      },
    ],
  },
  {
    category: 'Időpontfoglalás & Szalon információk',
    items: [
      {
        question: 'Hogyan tudok időpontot foglalni?',
        answer: 'A leggyorsabb és legkényelmesebb módja, ha kitöltöd a weboldalon található Ingyenes Konzultációs Kérdőívet. Ebből azonnal megismerjük az elképzeléseidet, és 24 órán belül konkrét időpontjavaslatokkal jelentkezünk e-mailben vagy telefonon.',
      },
      {
        question: 'Milyen fizetési módok érhetők el a szalonban?',
        answer: 'A pécsi szalonban készpénzes fizetés és azonnali banki átutalás is lehetséges.',
      },
      {
        question: 'Hol található a szalon és hogyan tudok parkolni?',
        answer: 'Címünk: 7624 Pécs, Budai Nagy Antal utca 1. (Tervezők Háza, 1. emelet 112.). Az épület közvetlen közelében utcai parkolás biztosított (fizetős övezet), valamint a helyi járatú buszmegálló mindössze 2 perc sétára található. Telefonszám: +36 70 576 6902.',
      },
    ],
  },
];

// ==========================================
// INITIAL PORTFOLIO (High Res Gallery)
// ==========================================
export const INITIAL_PORTFOLIO: PortfolioItem[] = [
  {
    id: 1,
    title: 'Természetes 2D Soft Volume',
    category: 'Természetes',
    image_url: '/assets/1.jpg',
    description: 'C és CC ív kombináció, 8-11 mm hossz, selyemfényű prémium pillák.',
    sort_order: 1,
    is_visible: true,
  },
  {
    id: 2,
    title: '4D Orosz Dúsított Volume',
    category: 'Volume',
    image_url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
    description: 'Mélyfekete volumen szett mandulaszemekhez tervezve.',
    sort_order: 2,
    is_visible: true,
  },
  {
    id: 3,
    title: 'Wispy Kim K Effect',
    category: 'Különleges & Wispy',
    image_url: 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=800&q=80',
    description: 'Lágy alap rövidebb szálakkal, határozott kiugró tüskékkel.',
    sort_order: 3,
    is_visible: true,
  },
  {
    id: 4,
    title: 'Elegáns 1D Classic Szett',
    category: 'Elegáns',
    image_url: 'https://images.unsplash.com/photo-1583001809873-a128495da465?auto=format&fit=crop&w=800&q=80',
    description: 'Tökéletes mindennapi viselet, egyenletes és természetes esés.',
    sort_order: 4,
    is_visible: true,
  },
  {
    id: 5,
    title: 'Lágy Csokoládébarna Szett',
    category: 'Természetes',
    image_url: 'https://images.unsplash.com/photo-1579829366248-204fe8413f31?auto=format&fit=crop&w=800&q=80',
    description: 'Meleg tónusú sötétbarna pillák világos szemszínhez és bőrhöz.',
    sort_order: 5,
    is_visible: true,
  },
  {
    id: 6,
    title: 'Látványos 6D Mega Volume',
    category: 'Volume',
    image_url: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80',
    description: 'Rendkívül dús, fekete bársonyos megjelenés fotózásokhoz és eseményekre.',
    sort_order: 6,
    is_visible: true,
  },
];

// ==========================================
// INITIAL FORM RESPONSES
// ==========================================
export const INITIAL_RESPONSES: FormResponseItem[] = [
  {
    id: 101,
    client_name: 'Horváth Vivien',
    email: 'horvath.vivi@gmail.com',
    phone: '+36 30 554 1122',
    is_done: false,
    created_at: '2026-10-24T09:15:00Z',
    answers: {
      q01_effect: ['Elegáns, látható, de nem túlzó hatást szeretnék', 'Dúsabb, hangsúlyosabb hatást szeretnék'],
      q02_selected_sets: ['2D-3D Soft Light Volume', 'Wispy / Kim K stílus'],
      q03_emphasis_level: 4,
      q04_dislikes: ['Nem szeretnék túl művi hatást.', 'Nem szeretném, ha a szemem külső széle lenne hangsúlyos.'],
      q04_dislikes_other: '',
      q05_style: ['Elegáns, letisztult', 'Modern, trendibb'],
      q06_makeup_routine: 'Rendszeresen',
      q07_has_previous_lashes: 'Igen',
      q07_what_liked: 'Reggel nem kellett spiráloznom, ébredéskor is szép volt a tekintetem.',
      q07_what_disliked: 'Amikor lenőtt, szúrta a szemhéjamat.',
      q08_mirror_wishes: [
        'Szeretném, ha nyitottabbnak tűnne a tekintetem.',
        'Szeretném, ha smink nélkül is rendezettnek és hangsúlyosnak tűnne a tekintetem.',
      ],
      q08_mirror_custom_text: 'Olyan hatást szeretnék, ami nem nehezíti el a szemhéjamat, de kiemeli a zöld szememet.',
    },
  },
  {
    id: 102,
    client_name: 'Molnár Dóra',
    email: 'dora.molnar@freemail.hu',
    phone: '+36 20 889 4433',
    is_done: true,
    created_at: '2026-10-23T14:30:00Z',
    processed_at: '2026-10-23T16:00:00Z',
    admin_notes: 'Telefonon egyeztetve, október 28. 14:00-ra beírva naptárba.',
    answers: {
      q01_effect: ['Természetes, visszafogott hatást szeretnék'],
      q02_selected_sets: ['1D Természetes Classic'],
      q03_emphasis_level: 2,
      q04_dislikes: ['Nem szeretném, ha feltűnő lenne, hogy műszempillám van.', 'Nem szeretnék túl hosszú pillákat.'],
      q05_style: ['Természetes, visszafogott', 'Sportos, praktikus'],
      q06_makeup_routine: 'Minimálisan',
      q07_has_previous_lashes: 'Nem, ez lenne az első alkalom',
      q08_mirror_wishes: [
        'Szeretnék természetes hatást, mintha a szempilláim a sajátjaim lennének, csak szebbek.',
        'Szeretném, ha a szempillám illeszkedne a saját stílusomhoz, és nem érezném idegennek magamon.',
      ],
    },
  },
];

// ==========================================
// CALENDAR APPOINTMENTS
// ==========================================
export const INITIAL_CALENDAR_EVENTS: CalendarAppointment[] = [
  {
    event_id: 'evt-201',
    summary: 'Horváth Vivien - 3D Light Volume Szett',
    client_name: 'Horváth Vivien',
    client_email: 'horvath.vivi@gmail.com',
    start_time: '2026-10-26T10:00:00',
    end_time: '2026-10-26T12:00:00',
    status: 'confirmed',
    notes: 'Konzultáció alapján tervezve, lágy C/CC ív, természetes kiemelés.',
  },
  {
    event_id: 'evt-202',
    summary: 'Varga Eszter - UV 4D Volume Töltés',
    client_name: 'Varga Eszter',
    client_email: 'eszter.varga@gmail.com',
    start_time: '2026-10-26T14:00:00',
    end_time: '2026-10-26T16:00:00',
    status: 'confirmed',
    notes: 'UV ragasztásos technológia, 3 hetes töltés.',
  },
  {
    event_id: 'evt-203',
    summary: 'Molnár Dóra - 1D Classic Első alkalom',
    client_name: 'Molnár Dóra',
    client_email: 'dora.molnar@freemail.hu',
    start_time: '2026-10-27T13:30:00',
    end_time: '2026-10-27T15:00:00',
    status: 'confirmed',
    notes: 'Első szett építés + allergia próba ellenőrzés.',
  },
  {
    event_id: 'evt-204',
    summary: 'Kovács Beatrix - Szempilla Lifting + Botox',
    client_name: 'Kovács Beatrix',
    client_email: 'bea.kovacs@gmail.com',
    start_time: '2026-10-28T09:30:00',
    end_time: '2026-10-28T10:45:00',
    status: 'confirmed',
    notes: 'M sablon, intenzív keratin botox maszkkal.',
  },
  {
    event_id: 'evt-205',
    summary: 'Tóth Nikolett - Wispy Kim K Új szett',
    client_name: 'Tóth Nikolett',
    client_email: 'nikolett.toth@outlook.com',
    start_time: '2026-10-29T11:00:00',
    end_time: '2026-10-29T13:30:00',
    status: 'confirmed',
    notes: 'Karakteres tüskék, 8-13 mm D ívvel.',
  },
  {
    event_id: 'evt-206',
    summary: 'Balogh Fanni - Szemöldök Laminálás & Styling',
    client_name: 'Balogh Fanni',
    client_email: 'fanni.balogh@gmail.com',
    start_time: '2026-10-30T15:00:00',
    end_time: '2026-10-30T16:00:00',
    status: 'confirmed',
    notes: 'Hibrid melegbarna festéssel és formázással.',
  },
  {
    event_id: 'evt-207',
    summary: 'Szabó Laura - 2D Soft Volume Töltés',
    client_name: 'Szabó Laura',
    client_email: 'laura.szabo@citromail.hu',
    start_time: '2026-10-31T10:30:00',
    end_time: '2026-10-31T12:30:00',
    status: 'confirmed',
    notes: 'Rendszeres vendég, C ív természetes eséssel.',
  },
];
