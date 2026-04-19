export type DifficultyLevel = "easy" | "medium" | "advanced";

export type ChildInput = {
  name: string;
  age: number;
};

export type SessionInput = {
  number_of_children: number;
  children: ChildInput[];
  session_length_minutes?: number;
  difficulty_level: DifficultyLevel;
  theme?: string;
};

export type SessionSection = {
  title: string;
  lines: string[];
};

export type SessionStep = {
  id: string;
  kind: "script" | "scenario" | "questions" | "notes";
  title: string;
  audience: string;
  description?: string;
  content?: string[];
  sections?: SessionSection[];
  helpTitle?: string;
  helpLines?: string[];
  notePlaceholder?: string;
  scenarioVariants?: string[][];
};

export type SessionPlan = {
  title: string;
  theme: string;
  durationLabel: string;
  participantsLabel: string;
  steps: SessionStep[];
};

type ThemeDefinition = {
  key: string;
  label: string;
  title: string;
  warmupStories: string[][];
  warmupQuestions: (child: ChildInput, index: number) => string[];
  childStories: (child: ChildInput, difficulty: DifficultyLevel) => string[][];
};

const THEMES: ThemeDefinition[] = [
  {
    key: "sosialt-press",
    label: "Sosialt press og tydelige valg",
    title: "Snakk tydelig under press",
    warmupStories: [
      [
        "Det er sen fredag ettermiddag, og barna stopper ved en liten butikk nær skolen.",
        "Et barn putter en sjokolade i lomma og sier: 'Slapp av, de merker det aldri her.'",
        "Så ser barnet rett på gruppa og sier: 'Enten gjør du det samme, eller så må du slutte å late som du er så uskyldig.'",
        "To andre barn følger med, og den ansatte står opptatt med en kunde i kassa.",
      ],
      [
        "Det er på vei hjem fra trening, og flere barn går innom kiosken ved busstoppet.",
        "En i gruppa river opp en energidrikk før den er betalt og ler: 'Bare gå ut med den, ingen gidder å stoppe oss.'",
        "Så peker barnet på dere og sier: 'Hvis dere ikke blir med, må dere i hvert fall ikke sladre.'",
        "Det er trangt i lokalet, og alle ser hvem som nøler.",
      ],
      [
        "Etter skolen står en liten gjeng ved sykkelstativet.",
        "En elev viser fram noe de nettopp tok fra klasserommet og sier: 'Det er ikke stjeling hvis ingen savner det.'",
        "Så kommer presset: 'Nå er du enten med oss, eller så er du bare feig.'",
        "Ingen voksen er i nærheten, og stemningen blir fort spent.",
      ],
    ],
    warmupQuestions: (child, index) =>
      index % 2 === 0
        ? [
            `${child.name}, hva gjør du de første fem sekundene?`,
            `${child.name}, hva sier du høyt, helt konkret?`,
            `${child.name}, hva er risikoen hvis du prøver å være nøytral?`,
          ]
        : [
            `${child.name}, hva gjør du med kroppen med en gang: blir stående, går litt unna, eller går til kassa?`,
            `${child.name}, hva er de første ordene du sier?`,
            `${child.name}, hvis vennen din blir irritert på deg, hva gjør du etterpå?`,
          ],
    childStories: (child, difficulty) => {
      if (child.age >= 14) {
        const stories = [
          [
            "Du er i en gruppechat søndag kveld.",
            "Noen legger ut et skjermbilde av en medelev under en dårlig framføring, og folk begynner å sende le-emojier.",
            "Så skriver en annen: 'Legg det ut på storyen din.'",
            "Alle kan se om du blir med, holder deg stille, eller stopper det.",
          ],
          [
            "Du sitter med venner etter skolen, og noen viser en sexvideo-lignende sexvideo-spøk laget med AI av en medelev.",
            "En i gruppa sier: 'Bare send den videre, alle kommer til å dø av latter.'",
            "Så får du mobilen stukket mot deg og blir bedt om å sende den til flere.",
            "Du skjønner at hvis du sier nei, kommer noen til å kalle deg svak eller vanskelig.",
          ],
          [
            "Du er i garderoben etter trening.",
            "Noen begynner å snakke hardt om en lagkamerat som ikke er der og vil at du skal bekrefte historien deres.",
            "De sier: 'Du vet jo at det er sant, bare si det.'",
            "Hvis du ikke blir med, kan stemningen snu mot deg veldig fort.",
          ],
        ];

        if (difficulty === "advanced") {
          stories.unshift([
            "Du får en privat melding fra en venn som vil at du skal dekke over en løgn de allerede har fortalt i en chat.",
            "Hvis du sier sannheten, kan vennen bli sint og du kan miste tillit i gruppa på kort sikt.",
            "Hvis du blir med på løgnen, vet du at en annen person kan få skylden for noe de ikke har gjort.",
            "Du må velge før andre begynner å spørre deg direkte.",
          ]);
        }

        return stories;
      }

      if (child.age >= 10) {
        const stories = [
          [
            "I friminuttet har du med noe nytt på skolen, og en klassekamerat låner det.",
            "Litt senere ser du at det har blitt sendt rundt, og nå mangler en del.",
            "Når du ber om å få det tilbake, sier klassekameraten: 'Hvorfor lager du så stor greie ut av det? Det er bare en ting.'",
            "To andre barn står og hører på.",
          ],
          [
            "Du står i kø til kantina da en venn presser seg foran og drar deg med.",
            "Bak dere står en elev som blir irritert og sier at dere sniker.",
            "Vennen din hvisker: 'Bare si at vi sto her hele tiden.'",
            "Alle rundt kan høre hva du velger å gjøre.",
          ],
          [
            "På skolen jobber dere i gruppe, og en venn ber deg si til læreren at dere begge har gjort like mye arbeid.",
            "Du vet at det ikke stemmer, fordi du gjorde nesten alt.",
            "Vennen ser rett på deg og sier: 'Hvis du ikke backer meg nå, er du en dårlig venn.'",
            "Det er bare noen sekunder til læreren kommer bort til bordet.",
          ],
        ];

        if (difficulty === "advanced") {
          stories.unshift([
            "Klassen øver til framføring, og en venn ber deg si at hen også øvde masse selv om du vet at det ikke stemmer.",
            "Vennen sier at dere må stå sammen, ellers kommer hen til å se dum ut foran resten av klassen.",
            "Læreren er på vei bort og kommer til å spørre dere begge hvordan arbeidet gikk.",
            "Du kjenner både lojalitet og irritasjon på samme tid.",
          ]);
        }

        return stories;
      }

      const stories = [
        [
          "Du bygger med klosser på skolen.",
          "Et annet barn tar en av klossene dine og sier: 'Jeg trenger den mer enn deg.'",
          "Læreren hjelper noen andre og ser det ikke.",
          "To barn i nærheten følger med på hva du gjør.",
        ],
        [
          "På SFO sitter du og tegner med favorittfargene dine.",
          "Et annet barn tar den blå tusjen din og nekter å gi den tilbake.",
          "Barnet sier: 'Du kan bare vente til jeg er ferdig.'",
          "Andre barn ser på om du sier noe eller bare lar det skje.",
        ],
        [
          "I garderoben tar et annet barn plassen din på benken og dytter sekken din ned på gulvet.",
          "Barnet sier: 'Finn deg et annet sted.'",
          "Den voksne er opptatt med noen andre.",
          "Du kjenner at du både blir sint og litt stresset.",
        ],
      ];

      if (difficulty === "advanced") {
        stories.unshift([
          "Du er med i en lek, og et annet barn endrer reglene midt i leken så du plutselig ikke får være med lenger.",
          "Barnet sier at det er de andre som bestemmer nå.",
          "Ingen voksen er akkurat der, og de andre barna ser på hva du gjør.",
          "Du må velge om du vil protestere, finne en annen løsning, eller gå vekk.",
        ]);
      }

      return stories;
    },
  },
  {
    key: "penger-og-aerlighet",
    label: "Penger, ærlighet og press",
    title: "Si sannheten når det koster",
    warmupStories: [
      [
        "En ansatt gir deg for mye penger tilbake etter skolen.",
        "Vennen din ser det først og hvisker: 'Behold dem. Store butikker bryr seg ikke.'",
        "Så legger vennen til: 'Hvis du gir dem tilbake, så ikke få meg til å se dum ut.'",
        "Det står folk i kø bak dere, og alle venter.",
      ],
      [
        "Dere kjøper småting i en kiosk etter trening.",
        "Kassadamen scanner bare én vare selv om dere har to.",
        "Vennen din sier lavt: 'Bare gå. Det er deres feil, ikke vår.'",
        "Du skjønner at du må velge før dere er ute av døra.",
      ],
      [
        "På et loppemarked får du en hundrelapp for mye tilbake.",
        "En venn ser det og sier: 'De har masse penger uansett.'",
        "Så kommer presset: 'Ikke ødelegg stemningen nå.'",
        "De voksne rundt dere er opptatt med andre ting.",
      ],
    ],
    warmupQuestions: (child, index) =>
      index % 2 === 0
        ? [
            `${child.name}, hva sier du til den ansatte, helt konkret?`,
            `${child.name}, hva sier du til vennen din etterpå?`,
            `${child.name}, hva føles ubehagelig med å gjøre det riktige foran andre?`,
          ]
        : [
            `${child.name}, hva gjør ansiktet og kroppen din først?`,
            `${child.name}, snakker du først til den ansatte eller til vennen din?`,
            `${child.name}, hva er risikoen hvis du later som du ikke merket det?`,
          ],
    childStories: (child, difficulty) => {
      if (child.age >= 14) {
        const stories = [
          [
            "Du selger et gammelt headset til noen fra skolen.",
            "Etter at personen har betalt, merker du at lyden av og til kutter ut på én side.",
            "Personen har allerede gått og virker fornøyd.",
            "Hvis du sier ifra, er det stor sjanse for at du må gi tilbake penger eller avlyse salget.",
          ],
          [
            "Du finner ut at du har blitt vippset for mye etter å ha hjulpet noen med en oppgave.",
            "Personen har tydeligvis skrevet feil beløp og ikke merket det ennå.",
            "En venn sier: 'De kommer aldri til å oppdage det, bare behold det.'",
            "Du vet at det føles fint å ha pengene, men det er ikke dine.",
          ],
          [
            "Du og en venn selger brukte klær på nett.",
            "En kjøper spør om plagget har noen feil, og vennen din sparker borti deg under bordet for at du skal si nei.",
            "Du vet at plagget faktisk har en liten skade som synes hvis man ser godt etter.",
            "Det står om dere får solgt det eller ikke på hva du svarer nå.",
          ],
        ];

        if (difficulty === "advanced") {
          stories.unshift([
            "Du oppdager at en venn har ført opp navnet ditt på en deling av penger som ikke er helt ærlig.",
            "Hvis du sier ifra, kan det skape dårlig stemning og koste dere begge noe.",
            "Hvis du tier, drar du fordel av noe du vet er feil.",
            "Ingen andre vet ennå at du har oppdaget det.",
          ]);
        }

        return stories;
      }

      if (child.age >= 10) {
        const stories = [
          [
            "På en skolemesse hjelper du til ved en bod.",
            "Et yngre barn gir deg for mye penger ved en feil, og vennen din ved siden av sier lavt: 'Ikke si noe. Vi trenger flere billetter til laget vårt.'",
            "Det yngre barnet har allerede snudd seg og gått videre.",
            "Du må velge raskt om du skal stoppe barnet eller la det gå.",
          ],
          [
            "Du kjøper en juice i kantina og får tilbake for mye vekslepenger.",
            "Vennen din ser det og sier: 'Da kan vi kjøpe noe ekstra etterpå.'",
            "Det er lang kø bak dere, og ingen andre ser feilen.",
            "Du kjenner at det haster å bestemme seg.",
          ],
          [
            "Klassen samler inn penger til en tur, og du sitter ved bordet når en medelev legger igjen tjue kroner for mye.",
            "Vennen ved siden av deg sier at dere bare kan legge dem i klassekassa uten å si noe.",
            "Du vet at pengene da blir brukt til noe bra, men de tilhører fortsatt noen andre.",
            "Læreren kommer snart tilbake til rommet.",
          ],
        ];

        if (difficulty === "advanced") {
          stories.unshift([
            "Du og en venn selger kaker for laget, og en voksen betaler litt for mye uten å merke det.",
            "Vennen din sier at dere kan bruke det ekstra til å nå målet fortere.",
            "Du vet at pengene går til noe bra, men at de fortsatt ikke er deres.",
            "Den voksne er allerede på vei bort fra bordet.",
          ]);
        }

        return stories;
      }

      const stories = [
        [
          "Du kjøper en liten snack sammen med en voksen.",
          "Den ansatte gir deg to mynter for mye tilbake.",
          "Du oppdager det før noen andre.",
          "Den voksne står og pakker ned varer og ser det ikke.",
        ],
        [
          "Du kjøper en bolle i kiosken.",
          "Den ansatte glemmer å ta betalt for saften du også fikk med deg.",
          "En venn smiler og sier: 'Bare gå fort.'",
          "Ingen stopper dere, så du må velge selv.",
        ],
        [
          "På skolearrangementet får du for mange lodd da du betaler.",
          "Den voksne i boden er travel og merker ingenting.",
          "Et annet barn sier at dette bare er flaks.",
          "Du kjenner at det er fristende å være stille.",
        ],
      ];

      if (difficulty === "advanced") {
        stories.unshift([
          "Du får utdelt for mange bonger i en bod på skoleavslutningen.",
          "Et annet barn sier at du bare kan bruke dem siden den voksne allerede er opptatt.",
          "Du vet at ingen kom til å merke det med en gang.",
          "Likevel kjenner du at det ikke helt er ditt å beholde.",
        ]);
      }

      return stories;
    },
  },
  {
    key: "nett-og-omdomme",
    label: "Nett, dømmekraft og omdømme",
    title: "Tenk før du blir med",
    warmupStories: [
      [
        "Et bilde fra skolen begynner å spre seg i en klassechat.",
        "Folk zoomer inn på én elev og kommer med raske kommentarer og vitser.",
        "Så skriver noen: 'Skriv noe morsomt eller gå ut.'",
        "Det går bare noen sekunder, og alle kan se hvem som er aktive.",
      ],
      [
        "Noen i klassen starter en avstemning i chatten om hvem som er mest rar på trinnet.",
        "Navn begynner å dukke opp, og folk stemmer fort for å være med.",
        "Så kommer en melding til deg: 'Kom igjen da, stem på noen.'",
        "Du kjenner at du må velge om du skal delta, si fra, eller holde deg unna.",
      ],
      [
        "Et skjermopptak av en elev på vei til tavla begynner å gå rundt på mobilen til flere.",
        "Folk ler og vil sende det videre til enda flere klasser.",
        "Så spør noen deg direkte om du også vil ha videoen.",
        "Du vet at valget ditt blir lagt merke til med en gang.",
      ],
    ],
    warmupQuestions: (child, index) =>
      index % 2 === 0
        ? [
            `${child.name}, hva er det første du gjør?`,
            `${child.name}, hvilken melding ville du sendt, helt konkret?`,
            `${child.name}, hva skjer hvis du er stille, men fortsetter å se på?`,
          ]
        : [
            `${child.name}, hva er du mest redd for i dette øyeblikket?`,
            `${child.name}, hvem tenker du først på: deg selv, gruppa, eller personen på bildet?`,
            `${child.name}, hva er det ryddigste neste steget ditt?`,
          ],
    childStories: (child, difficulty) => {
      if (child.age >= 14) {
        const stories = [
          [
            "En venn ber deg like og dele en hard vits om en lærer.",
            "Vennen sier at det bare er en spøk og at alle andre gjør det.",
            "Hvis du nekter, kan du bli kalt kjedelig og kanskje ikke bli invitert med på ting på en stund.",
            "Du kjenner at valget handler både om humor, lojalitet og rygggrad.",
          ],
          [
            "Noen i vennegjengen vil at du skal sende et AI-redigert bilde av en medelev videre.",
            "De sier at det bare er tull, men du ser at det lett kan bli ydmykende.",
            "Telefonen blir holdt fram mot deg, og du blir bedt om å sende det fra din konto.",
            "Du vet at det er lettere å gli med enn å stoppe det.",
          ],
          [
            "En venn vil bruke kontoen din til å poste en spydig kommentar anonymt.",
            "De sier det er tryggere hvis det ikke kan spores til dem.",
            "Du forstår at du både kan bli tatt og at noen andre kan bli såret.",
            "Likevel er presset der fordi du ikke vil være den som ødelegger stemningen.",
          ],
        ];

        if (difficulty === "advanced") {
          stories.unshift([
            "Du blir bedt om å være med i en privat chat der folk planlegger å klippe sammen ydmykende små videoer av andre elever.",
            "De sier at du ikke trenger å lage noe selv, bare være med og reagere.",
            "Du vet at det å bare være passiv også gjør deg til en del av det.",
            "Samtidig vet du at et nei kan koste deg sosialt med en gang.",
          ]);
        }

        return stories;
      }

      if (child.age >= 10) {
        const stories = [
          [
            "En venn vil sende en stygg talemelding om et annet barn i klassen og spør om hen kan bruke nettbrettet ditt til det.",
            "Vennen sier: 'Det er bedre om det ikke kommer fra meg.'",
            "Du vet at meldingen vil såre det andre barnet hvis den blir sendt videre.",
            "Det skjer fort, og du kjenner at du må stoppe eller la det skje.",
          ],
          [
            "Du sitter ved siden av en venn som vil ta et bilde av en medelev uten å spørre og sende det til andre.",
            "Vennen sier at det bare er for gøy og at ingen kommer til å bry seg.",
            "Telefonen er allerede oppe, og du skjønner at du må reagere med en gang.",
            "Andre barn rundt dere følger med og venter på reaksjonen din.",
          ],
          [
            "I en felles chat begynner noen å skrive stygge ting om en elev som ikke er pålogget.",
            "En venn sender deg privat melding og spør hvorfor du ikke skriver noe morsomt tilbake.",
            "Du ser at det blir forventet at du skal bli med.",
            "Samtidig kjenner du at det er noe ved det som ikke føles riktig.",
          ],
        ];

        if (difficulty === "advanced") {
          stories.unshift([
            "En venn vil at du skal hjelpe til med å lage en falsk melding for å lure et annet barn i klassen.",
            "Vennen sier at det bare er en spøk og at ingen trenger å få vite at du hjalp til.",
            "Du kjenner at det virker spennende der og da, men også ganske slemt.",
            "Du må velge før meldingen blir sendt.",
          ]);
        }

        return stories;
      }

      const stories = [
        [
          "Et barn vil bruke enheten din til å ta et tullebilde av et annet barn uten å spørre først.",
          "Barnet sier at det bare er for gøy og lover å slette det senere.",
          "Andre barn er allerede i ferd med å le.",
          "Du kjenner at det er lett å bli dratt med i øyeblikket.",
        ],
        [
          "En venn vil spille inn et annet barn som danser og sende videoen rundt.",
          "Vennen sier at det blir morsomt for alle.",
          "Du ser at barnet som blir filmet ikke vet hva som skjer.",
          "Du må velge raskt hva du gjør med situasjonen.",
        ],
        [
          "Noen vil låne nettbrettet ditt for å sende en tullemelding til et annet barn.",
          "De sier at det bare er lek, men du ser at meldingen kan virke slem.",
          "Flere barn rundt ser på og venter.",
          "Det er opp til deg om du setter en grense eller ikke.",
        ],
      ];

      if (difficulty === "advanced") {
        stories.unshift([
          "Et annet barn vil låne enheten din for å sende en hemmelig melding som kan gjøre et tredje barn lei seg.",
          "Barnet sier at det bare er tull og at du ikke må være så streng.",
          "Flere ser på og håper du sier ja.",
          "Du må bestemme deg raskt før meldingen blir sendt.",
        ]);
      }

      return stories;
    },
  },
];

function normalizeTheme(theme?: string) {
  if (!theme) return null;

  const lowered = theme.trim().toLowerCase();

  return (
    THEMES.find(
      (item) =>
        item.key === lowered ||
        item.label.toLowerCase() === lowered ||
        item.label.toLowerCase().includes(lowered) ||
        lowered.includes(item.key.replaceAll("-", " ")),
    ) ?? null
  );
}

function chooseTheme(input: SessionInput) {
  const explicitTheme = normalizeTheme(input.theme);
  if (explicitTheme) {
    return explicitTheme;
  }

  const averageAge =
    input.children.reduce((sum, child) => sum + child.age, 0) /
    Math.max(input.children.length, 1);

  if (averageAge >= 13) {
    return input.difficulty_level === "advanced" ? THEMES[2] : THEMES[0];
  }

  if (input.difficulty_level === "easy") {
    return THEMES[1];
  }

  return THEMES[0];
}

function cleanName(name: string, fallbackIndex: number) {
  const trimmed = name.trim();
  return trimmed.length > 0 ? trimmed : `Barn ${fallbackIndex + 1}`;
}

function ageBandQuestion(child: ChildInput) {
  if (child.age >= 14) {
    return "Hva slags person blir du hvis hovedregelen din er: bare ikke bli det neste målet?";
  }

  if (child.age >= 10) {
    return "Hvordan kan du få fram poenget ditt tydelig uten å prøve å gjøre den andre liten?";
  }

  return "Hvordan kan du være tydelig og rolig samtidig?";
}

function notePlaceholder(stepTitle: string) {
  return `Skriv korte notater fra steget "${stepTitle}" her. Eksempel: hva barnet svarte, hva som var vanskelig, og hva du vil følge opp senere.`;
}

function followUpHelp(child: ChildInput) {
  return [
    "Bruk disse kommentarene hvis du trenger å presse tenkingen videre:",
    `Si: "${child.name}, gi meg det første svaret ditt før du pynter på det."`,
    `Si: "${child.name}, hva koster det sosialt å gjøre dette riktig?"`,
    `Si: "${child.name}, hva er det tredje alternativet hvis verken ja eller nei føles helt riktig?"`,
    `Si: "${child.name}, hva ville du ønsket at en trygg person gjorde her?"`,
  ];
}

function reflectionHelp(children: ChildInput[]) {
  const joinedNames = children.map((child) => child.name).join(" og ");

  return [
    "Målet her er ikke å få rette svar, men å få dem til å se sin egen tenking.",
    `Si: "${joinedNames}, ikke fortell meg hva som er riktig først. Fortell meg hva som skjedde inni dere før dere svarte."`,
    `Si: "${joinedNames}, hvor merket dere presset i kroppen?"`,
    `Si: "${joinedNames}, når ble dere mest fristet til å gi et raskt og pent svar i stedet for et ærlig svar?"`,
  ];
}

export function buildSessionPlan(rawInput: SessionInput): SessionPlan {
  const children = rawInput.children
    .slice(0, Math.max(rawInput.number_of_children || rawInput.children.length, 1))
    .map((child, index) => ({
      name: cleanName(child.name, index),
      age: Number.isFinite(child.age) ? child.age : 0,
    }));

  const duration = rawInput.session_length_minutes ?? 20;
  const theme = chooseTheme({ ...rawInput, children });

  const steps: SessionStep[] = [
    {
      id: "parent-script",
      kind: "script",
      title: "Foreldreskript",
      audience: "Felles",
      description: "Les dette høyt før dere starter selve økten.",
      content: [
        "I dag skal vi øve på å tenke under press.",
        "Jeg er ikke ute etter perfekte svar.",
        "Jeg vil ha tydelige svar, ekte grunner og ærlig tenking.",
        "Hvis du kjenner deg usikker, er det en del av øvelsen.",
        "Du må fortsatt velge noe og forklare hvorfor.",
      ],
      helpTitle: "Hjelp til forelder",
      helpLines: [
        "Les rolig og sakte. Ikke forklar ekstra etterpå.",
        "Hvis barna begynner å diskutere før du er ferdig, si: 'Hold på tanken. Først hører vi hele oppgaven.'",
        "Målet i dette steget er å sette rammen: tydelig, rolig, ingen forelesning.",
      ],
      notePlaceholder: notePlaceholder("Foreldreskript"),
    },
    {
      id: "shared-scenario",
      kind: "scenario",
      title: "Kort scenario",
      audience: "Felles",
      description: "Les scenarioet høyt. Hvis det ikke passer, lag et nytt med knappen øverst til høyre.",
      scenarioVariants: theme.warmupStories,
      helpTitle: "Hjelp til forelder",
      helpLines: [
        "Les hele scenarioet før du tar imot svar.",
        "Ikke myk opp situasjonen. Litt ubehag er meningen.",
        "Hvis barna vil hoppe rett til moral, si: 'Vent. Først vil jeg høre hva du faktisk ville gjort.'",
      ],
      notePlaceholder: notePlaceholder("Kort scenario"),
    },
    {
      id: "shared-questions",
      kind: "questions",
      title: "Spørsmål etter scenario",
      audience: "Felles",
      sections: [
        ...children.map((child, index) => ({
          title: `${child.name} (${child.age})`,
          lines: theme.warmupQuestions(child, index).map((question) => `Spør: "${question}"`),
        })),
        {
          title: "Hvis barnet sier 'jeg vet ikke'",
          lines: [
            'Si: "Du må fortsatt gi meg én setning. Start med: Først ville jeg ..."',
            'Hvis barnet fortsatt står fast: "Velg ett av to: A) Ta et skritt tilbake og si at du ikke er med. B) Gå til en voksen og si at de må sjekke det som nettopp skjedde."',
            'Si deretter: "Fortell meg hvorfor du valgte akkurat det."',
          ],
        },
      ],
      helpTitle: "Hjelp til forelder",
      helpLines: [
        "Be alltid om konkrete ord, ikke bare generelle forklaringer.",
        "Hvis svaret blir uklart, si: 'Si det som om det skjer nå.'",
        "Hvis barnet svarer veldig fort, press med: 'Hva overser du i det svaret?'",
      ],
      notePlaceholder: notePlaceholder("Spørsmål etter scenario"),
    },
  ];

  children.forEach((child, index) => {
    const childStories = theme.childStories(child, rawInput.difficulty_level);

    steps.push({
      id: `child-${index + 1}-scenario`,
      kind: "scenario",
      title: `Scenario for ${child.name}`,
      audience: child.name,
      description: "Les dette høyt til barnet. Bytt scenario hvis du vil ha en annen variant.",
      scenarioVariants: childStories,
      helpTitle: "Hjelp til forelder",
      helpLines: [
        "Hold igjen løsningen. Barnet skal kjenne på valget før du hjelper.",
        "Hvis barnet prøver å slippe unna med et pent standardsvar, si: 'Hva ville du faktisk gjort om dette skjedde i dag?'",
        "Hvis barnet blir defensivt, senk tempoet, men behold presset.",
      ],
      notePlaceholder: notePlaceholder(`Scenario for ${child.name}`),
    });

    steps.push({
      id: `child-${index + 1}-questions`,
      kind: "questions",
      title: `Spørsmål til ${child.name}`,
      audience: child.name,
      sections: [
        {
          title: "Hovedspørsmål",
          lines:
            child.age >= 14
              ? [
                  `Spør: "${child.name}, hva gjør du først?"`,
                  'Spør: "Hva ville du sagt eller skrevet, ord for ord?"',
                  rawInput.difficulty_level === "advanced"
                    ? 'Spør: "Hva prøver du mest å beskytte her: deg selv, statusen din, relasjonen, eller den andre personen?"'
                    : 'Spør: "Hvis du ikke gjør noe, hva tror du skjer videre?"',
                  'Spør: "Hva er det tredje alternativet, bortsett fra å bli med eller late som du ikke så det?"',
                ]
              : child.age >= 10
                ? [
                    `Spør: "${child.name}, hva sier du først, helt konkret?"`,
                    'Spør: "Sier du noe med en gang, venter du, eller ber du om å snakke alene?"',
                    rawInput.difficulty_level === "advanced"
                      ? 'Spør: "Hva beskytter du mest her: tingen, stoltheten din, eller hvordan folk vil behandle deg senere?"'
                      : 'Spør: "Hvis den andre blir sur eller de andre ler, hva gjør du da?"',
                    'Spør: "Hva er det tredje alternativet, bortsett fra å rope eller gå vekk?"',
                  ]
                : [
                    `Spør: "${child.name}, hva sier du først?"`,
                    'Spør: "Blir du stående, ber du om hjelp, eller prøver du å løse det selv?"',
                    rawInput.difficulty_level === "advanced"
                      ? 'Spør: "Hva er det som gjør dette vanskelig akkurat nå?"'
                      : 'Spør: "Hvis den andre sier nei, hva gjør du etterpå?"',
                    'Spør: "Hva er det tredje alternativet, bortsett fra å gi opp eller bli sint med en gang?"',
                  ],
        },
        {
          title: "Oppfølgingslogikk",
          lines: [
            "Hvis svaret er ja: press på konsekvenser.",
            `Spør: "${child.name}, hvilket problem løste det akkurat nå, og hvilket større problem kan det skape etterpå?"`,
            `Spør: "${child.name}, hvem kan stole mindre på deg etter det valget?"`,
            "Hvis svaret er nei: press på følelser og sosial kostnad.",
            `Spør: "${child.name}, hvilket press eller hvilken reaksjon forventer du fra andre?"`,
            `Spør: "${child.name}, hvilken følelse må du tåle i tretti sekunder for å holde den grensa?"`,
            "Hvis svaret er usikkert: tving fram én setning.",
            `Si: "${child.name}, gi meg bare én setning: Jeg ville ____ fordi ____."`,
          ],
        },
        {
          title: "Gjennombruddsspørsmål",
          lines: [`Spør: "${ageBandQuestion(child)}"`],
        },
        {
          title: "Valgfritt hint hvis barnet står fast i 20-30 sekunder",
          lines:
            child.age >= 14
              ? [
                  "Si: 'Du trenger ikke velge en stor heroisk handling. Du kan velge ett tydelig svar, én privat melding, eller ett skritt bort.'",
                ]
              : child.age >= 10
                ? [
                    "Si: 'Prøv: Jeg mener det. Jeg vil løse dette uten drama, men jeg kommer ikke til å overse det.'",
                  ]
                : [
                    "Si: 'Prøv: Stopp. Jeg vil ha den tilbake. Eller: La oss spørre læreren sammen.'",
                  ],
        },
      ],
      helpTitle: "Hjelp til forelder",
      helpLines: followUpHelp(child),
      notePlaceholder: notePlaceholder(`Spørsmål til ${child.name}`),
    });
  });

  steps.push({
    id: "reflection",
    kind: "questions",
    title: "Felles refleksjon",
    audience: "Felles",
    sections: [
      {
        title: "Refleksjonsspørsmål",
        lines: [
          `Spør: "${children.map((child) => child.name).join(" og ")}, hva skjedde i hodet deres før dere svarte?"`,
          `Spør: "${children.map((child) => child.name).join(" og ")}, hvor nølte dere?"`,
          `Spør: "${children.map((child) => child.name).join(" og ")}, hvilken følelse kom først: frykt, irritasjon, flauhet, forvirring, eller noe annet?"`,
          `Spør: "${children.map((child) => child.name).join(" og ")}, endret det første svaret seg da jeg presset dere? Hvorfor?"`,
          `Spør: "${children.map((child) => child.name).join(" og ")}, hva var vanskeligst: å velge, å forklare, eller å se for seg konsekvensene?"`,
          `Spør: "${children.map((child) => child.name).join(" og ")}, hva er ett bedre svar dere fant etter å ha tenkt litt lenger?"`,
        ],
      },
      {
        title: "Kjerneprinsipp",
        lines: ['Si: "Senk farten, velg tydelig, og si det høyt."'],
      },
    ],
    helpTitle: "Hjelp til forelder",
    helpLines: reflectionHelp(children),
    notePlaceholder: notePlaceholder("Felles refleksjon"),
  });

  steps.push({
    id: "parent-notes",
    kind: "notes",
    title: "Foreldrenotater",
    audience: "Bare forelder",
    sections: [
      {
        title: "Hvordan du svarer uten tom ros",
        lines: [
          'Si: "Det svaret var tydelig."',
          'Si: "Det endret seg da presset økte. Det betyr noe."',
          'Si: "Det var uklart. Prøv igjen med én setning."',
          'Si: "Gi meg grunnen, ikke bare valget."',
          'Si: "Det høres modig ut, men er det realistisk?"',
          'Si: "Gi meg de nøyaktige ordene du ville brukt."',
        ],
      },
      {
        title: "Hvordan du håndterer stillhet eller motstand",
        lines: [
          "Vent fem sekunder før du hjelper.",
          'Si: "Du kan begynne dårlig, men du må begynne."',
          'Hvis barnet trekker på skuldrene, si: "Bare én setning."',
          "Hvis barnet fortsetter å nøle, gi to realistiske valg og få barnet til å velge ett.",
          'Hvis barnet tuller seg unna, si: "Ordentlig svar nå."',
          "Hold presset rolig og jevnt, ikke sint.",
        ],
      },
      {
        title: "Hva du ikke skal gjøre",
        lines: [
          "Ikke foreles.",
          "Ikke redd barnet for tidlig.",
          "Ikke gjør svaret om til en moralsk tale.",
          'Ikke godta "jeg vet ikke" som sluttsvar.',
          "Ikke overros opplagte svar.",
          "Ikke skynd deg til det peneste svaret før barnet har fått streve litt.",
        ],
      },
      {
        title: "Hva suksess ser ut som i denne økten",
        lines: [
          "Barnet gir et svar selv om det er ubehagelig.",
          "Barnet forklarer hvorfor, ikke bare hva.",
          'Barnet tåler minst ett motspørsmål uten å kollapse til "jeg vet ikke".',
          "Barnet finner minst ett tredje alternativ utover ja eller nei.",
          "Svarene blir mer konkrete mot slutten.",
        ],
      },
    ],
    helpTitle: "Hjelp til forelder",
    helpLines: [
      "Dette er oppsummeringsvinduet ditt. Bruk det etter økten eller mellom stegene hvis du trenger å nullstille deg.",
      "Hvis du merker at du blir frustrert, gå tilbake hit og minn deg selv på at målet er tenking, ikke lydighet.",
      "Se etter framgang i tydelighet og motstandstoleranse, ikke i perfekte svar.",
    ],
    notePlaceholder: notePlaceholder("Foreldrenotater"),
  });

  return {
    title: theme.title,
    theme: theme.label,
    durationLabel: `${duration} minutter`,
    participantsLabel: children.map((child) => `${child.name} (${child.age})`).join(", "),
    steps,
  };
}
