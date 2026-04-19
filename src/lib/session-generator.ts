export type DifficultyLevel = "easy" | "medium" | "advanced";

export type ChildInput = {
  name: string;
  age: number;
  temperament?: string;
  focus?: string;
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
  brand: string;
  title: string;
  theme: string;
  durationLabel: string;
  participantsLabel: string;
  ageGuidance: string;
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
    title: "Velg tydelig når andre presser deg",
    warmupStories: [
      [
        "Etter skolen står flere barn utenfor en liten butikk.",
        "Et barn putter en sjokolade i lomma og sier: 'Slapp av, de merker det aldri her.'",
        "Så kommer presset: 'Enten gjør du det samme, eller så må du slutte å late som du er så ordentlig.'",
        "To andre følger med, og ingen voksen er tett på.",
      ],
      [
        "En venn vil snike i køen og drar deg med.",
        "Barnet hvisker: 'Bare si at vi stod her hele tiden.'",
        "Folk bak dere ser irritert bort, og du kjenner at du må velge fort.",
        "Hvis du sier nei, kan vennen bli sur med en gang.",
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
            `${child.name}, hva gjør du med kroppen med en gang: blir stående, går unna, eller ber om hjelp?`,
            `${child.name}, hva er de første ordene du sier?`,
            `${child.name}, hvis vennen din blir irritert på deg, hva gjør du etterpå?`,
          ],
    childStories: (child, difficulty) => {
      if (child.age >= 13) {
        return [
          [
            "Du er i en gruppechat søndag kveld.",
            "Noen legger ut et skjermbilde av en medelev under en dårlig framføring, og folk begynner å le.",
            "Så skriver en annen: 'Legg det ut på storyen din.'",
            "Alle kan se om du blir med, holder deg stille, eller stopper det.",
          ],
          [
            "Du får en privat melding fra en venn som vil at du skal dekke over en løgn de allerede har fortalt.",
            "Hvis du sier sannheten, kan vennen bli sint og du kan miste status i gruppa.",
            "Hvis du blir med på løgnen, vet du at noen andre kan få skylden.",
            "Du må velge før flere begynner å spørre deg direkte.",
          ],
          difficulty === "advanced"
            ? [
                "Du blir bedt om å være med i en privat chat der folk planlegger å henge ut en medelev.",
                "De sier at du ikke trenger å skrive noe, bare være med og reagere.",
                "Du vet at det å være passiv også gjør deg til en del av det.",
                "Samtidig vet du at et nei kan koste deg sosialt med en gang.",
              ]
            : [
                "Du er i garderoben etter trening.",
                "Noen begynner å snakke hardt om en lagkamerat som ikke er der og vil at du skal bekrefte historien deres.",
                "De sier: 'Du vet jo at det er sant, bare si det.'",
                "Hvis du ikke blir med, kan stemningen snu mot deg veldig fort.",
              ],
        ];
      }

      if (child.age >= 9) {
        return [
          [
            "I friminuttet låner en klassekamerat noe av deg og gir det videre til andre uten å spørre.",
            "Når du ber om det tilbake, sier barnet: 'Det er bare en ting. Hvorfor lager du så stor greie ut av det?'",
            "To andre barn står og ser på.",
            "Du kjenner at du må svare tydelig uten å miste kontrollen.",
          ],
          [
            "Du står i kø til kantina da en venn presser seg foran og drar deg med.",
            "Bak dere står en elev som sier at dere sniker.",
            "Vennen din hvisker: 'Bare si at vi stod her hele tiden.'",
            "Alle rundt kan høre hva du velger å gjøre.",
          ],
          difficulty === "advanced"
            ? [
                "På skolen jobber dere i gruppe, og en venn ber deg si til læreren at dere begge gjorde like mye.",
                "Du vet at det ikke stemmer, fordi du gjorde nesten alt.",
                "Vennen sier: 'Hvis du ikke backer meg nå, er du en dårlig venn.'",
                "Læreren kommer bort om noen sekunder.",
              ]
            : [
                "Et barn vil at du skal bli med på en regel som åpenbart er urettferdig mot et annet barn.",
                "Barnet sier at hvis du ikke er med, ødelegger du hele leken.",
                "Du merker at de andre ser på hva du gjør.",
                "Det er lett å bli med bare for å slippe presset.",
              ],
        ];
      }

      return [
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
      ];
    },
  },
  {
    key: "penger-og-aerlighet",
    label: "Penger, ærlighet og press",
    title: "Si sannheten når det koster litt",
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
      if (child.age >= 13) {
        return [
          [
            "Du selger et gammelt headset til noen fra skolen.",
            "Etter at personen har betalt, merker du at lyden av og til kutter ut på én side.",
            "Personen har allerede gått og virker fornøyd.",
            "Hvis du sier ifra, er det stor sjanse for at du må gi tilbake penger eller avlyse salget.",
          ],
          [
            "Du finner ut at du har blitt vippset for mye etter å ha hjulpet noen med en oppgave.",
            "En venn sier: 'De kommer aldri til å oppdage det, bare behold det.'",
            "Du vet at det føles fint å ha pengene, men de er ikke dine.",
            "Du må velge før det blir for sent å si ifra på en naturlig måte.",
          ],
          difficulty === "advanced"
            ? [
                "Du oppdager at en venn har ført opp navnet ditt på en deling av penger som ikke er helt ærlig.",
                "Hvis du sier ifra, kan det skape dårlig stemning og koste dere begge noe.",
                "Hvis du tier, drar du fordel av noe du vet er feil.",
                "Ingen andre vet ennå at du har oppdaget det.",
              ]
            : [
                "Du og en venn selger brukte klær på nett.",
                "En kjøper spør om plagget har noen feil, og vennen din vil at du skal si nei.",
                "Du vet at plagget faktisk har en liten skade.",
                "Det står om dere får solgt det eller ikke på hva du svarer nå.",
              ],
        ];
      }

      if (child.age >= 9) {
        return [
          [
            "På en skolemesse hjelper du til ved en bod.",
            "Et yngre barn gir deg for mye penger ved en feil, og vennen din sier: 'Ikke si noe. Vi trenger flere billetter til laget vårt.'",
            "Barnet har allerede snudd seg og gått videre.",
            "Du må velge raskt om du skal stoppe barnet eller la det gå.",
          ],
          [
            "Du kjøper en juice i kantina og får tilbake for mye vekslepenger.",
            "Vennen din ser det og sier: 'Da kan vi kjøpe noe ekstra etterpå.'",
            "Det er lang kø bak dere, og ingen andre ser feilen.",
            "Du kjenner at det haster å bestemme seg.",
          ],
          difficulty === "advanced"
            ? [
                "Klassen samler inn penger til en tur, og du sitter ved bordet når en medelev legger igjen tjue kroner for mye.",
                "Vennen ved siden av deg sier at dere bare kan legge dem i klassekassa uten å si noe.",
                "Du vet at pengene da blir brukt til noe bra, men de tilhører fortsatt noen andre.",
                "Læreren kommer snart tilbake til rommet.",
              ]
            : [
                "Du får for mange lodd da du betaler på et skolearrangement.",
                "Den voksne i boden merker ingenting.",
                "Et annet barn sier at dette bare er flaks.",
                "Du kjenner at det er fristende å være stille.",
              ],
        ];
      }

      return [
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
      ];
    },
  },
  {
    key: "nett-og-omdomme",
    label: "Nett, dømmekraft og omdømme",
    title: "Tenk før du blir med på nett",
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
        "Så kommer meldingen til deg: 'Kom igjen da, stem på noen.'",
        "Du kjenner at valget ditt blir lagt merke til med en gang.",
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
      if (child.age >= 13) {
        return [
          [
            "En venn ber deg like og dele en hard vits om en lærer.",
            "Vennen sier at det bare er en spøk og at alle andre gjør det.",
            "Hvis du nekter, kan du bli kalt kjedelig og kanskje ikke bli invitert med på ting.",
            "Du kjenner at valget handler både om humor, lojalitet og rygggrad.",
          ],
          [
            "Noen i vennegjengen vil at du skal sende et AI-redigert bilde av en medelev videre.",
            "De sier at det bare er tull, men du ser at det lett kan bli ydmykende.",
            "Telefonen blir holdt fram mot deg, og du blir bedt om å sende det fra din konto.",
            "Du vet at det er lettere å gli med enn å stoppe det.",
          ],
          difficulty === "advanced"
            ? [
                "Du blir bedt om å være med i en privat chat der folk planlegger å klippe sammen ydmykende små videoer av andre elever.",
                "De sier at du ikke trenger å lage noe selv, bare være med og reagere.",
                "Du vet at passivitet også gjør deg til en del av det.",
                "Samtidig vet du at et nei kan koste deg sosialt med en gang.",
              ]
            : [
                "En venn vil bruke kontoen din til å poste en spydig kommentar anonymt.",
                "De sier det er tryggere hvis det ikke kan spores til dem.",
                "Du forstår at noen andre kan bli såret og at du kan bli tatt.",
                "Likevel er presset der fordi du ikke vil være den som ødelegger stemningen.",
              ],
        ];
      }

      if (child.age >= 9) {
        return [
          [
            "En venn vil sende en stygg talemelding om et annet barn i klassen og spør om hen kan bruke nettbrettet ditt.",
            "Vennen sier: 'Det er bedre om det ikke kommer fra meg.'",
            "Du vet at meldingen vil såre det andre barnet hvis den blir sendt videre.",
            "Det skjer fort, og du kjenner at du må stoppe eller la det skje.",
          ],
          [
            "Du sitter ved siden av en venn som vil ta et bilde av en medelev uten å spørre og sende det videre.",
            "Vennen sier at det bare er for gøy og at ingen kommer til å bry seg.",
            "Telefonen er allerede oppe, og du skjønner at du må reagere med en gang.",
            "Andre barn rundt dere følger med og venter på reaksjonen din.",
          ],
          difficulty === "advanced"
            ? [
                "En venn vil at du skal hjelpe til med å lage en falsk melding for å lure et annet barn i klassen.",
                "Vennen sier at det bare er en spøk og at ingen trenger å få vite at du hjalp til.",
                "Du kjenner at det virker spennende der og da, men også ganske slemt.",
                "Du må velge før meldingen blir sendt.",
              ]
            : [
                "I en felles chat begynner noen å skrive stygge ting om en elev som ikke er pålogget.",
                "En venn sender deg privat melding og spør hvorfor du ikke skriver noe morsomt tilbake.",
                "Du ser at det blir forventet at du skal bli med.",
                "Samtidig kjenner du at det er noe ved det som ikke føles riktig.",
              ],
        ];
      }

      return [
        [
          "Et barn vil bruke enheten din til å ta et tullebilde av et annet barn uten å spørre først.",
          "Barnet sier at det bare er for gøy og lover å slette det senere.",
          "Andre barn er allerede i ferd med å le.",
          "Du kjenner at det er lett å bli dratt med i øyeblikket.",
        ],
        [
          "Noen vil låne nettbrettet ditt for å sende en tullemelding til et annet barn.",
          "De sier at det bare er lek, men du ser at meldingen kan virke slem.",
          "Flere barn rundt ser på og venter.",
          "Det er opp til deg om du setter en grense eller ikke.",
        ],
      ];
    },
  },
  {
    key: "vennskap-og-mobbing",
    label: "Vennskap, utenforskap og mobbing",
    title: "Stå stødig når noen holdes utenfor",
    warmupStories: [
      [
        "I en bursdagssamtale begynner flere barn å planlegge hvem som ikke skal få være med i neste lek.",
        "Noen sier: 'Bare ikke si det til henne ennå.'",
        "Alle ser mot deg for å se om du blir med eller protesterer.",
        "Du kjenner at det er ubehagelig å skille seg ut.",
      ],
      [
        "I friminuttet blir ett barn alltid valgt sist.",
        "Noen ler og sier at det er fordi barnet er rart.",
        "Så kommer spørsmålet til deg: 'Vi trenger ikke ta med henne, vel?'",
        "Det skjer fort, og du må velge hva du gjør i gruppa.",
      ],
    ],
    warmupQuestions: (child, index) =>
      index % 2 === 0
        ? [
            `${child.name}, hva gjør du med én gang når noen holdes utenfor?`,
            `${child.name}, hva sier du, helt konkret?`,
            `${child.name}, hva koster det deg å si noe?`,
          ]
        : [
            `${child.name}, hva er det letteste valget her?`,
            `${child.name}, hva er det modigste lille steget du kan ta?`,
            `${child.name}, hva gjør du hvis gruppa himler med øynene?`,
          ],
    childStories: (child, difficulty) => [
      [
        "Et barn i klassen blir alltid valgt sist i lag.",
        "I dag foreslår noen at dere bare kan starte uten barnet.",
        "Du ser at barnet later som det ikke bryr seg.",
        "Alle rundt deg venter på om du sier noe eller ikke.",
      ],
      [
        "En venn vil at du skal la være å invitere en bestemt person fordi det blir mindre drama da.",
        "Du vet at den personen allerede føler seg litt utenfor.",
        "Hvis du protesterer, kan vennen din mene at du overdriver.",
        "Du må velge hva slags venn du vil være i praksis.",
      ],
      difficulty === "advanced"
        ? [
            "Noen i vennegjengen lager en intern spøk som egentlig bare går ut på å gjøre én person liten.",
            "Alle ler, og det ser uskyldig ut på overflaten.",
            "Men du merker at personen som rammes blir stille hver gang.",
            "Spørsmålet er om du tør å bryte stemningen for å stoppe det.",
          ]
        : [
            "Et barn blir ertet for klærne sine i friminuttet.",
            "Du er ikke den som startet det, men du står der og hører på.",
            "Noen ser på deg og sier: 'Det er jo sant, da.'",
            "Du kjenner at stillhet også blir et valg.",
          ],
    ],
  },
  {
    key: "folelser-og-konflikter",
    label: "Følelser, sinne og konflikt",
    title: "Snakk bedre når følelsene blir store",
    warmupStories: [
      [
        "To søsken begynner å krangle om noe lite som plutselig blir stort.",
        "Den ene sier: 'Du gjør alltid dette mot meg.'",
        "Den andre blir så sint at stemmen går rett opp.",
        "Alle kjenner at det er sekunder unna at noen smeller til med noe sårt.",
      ],
      [
        "Et barn mister kontrollen i en lek og vil gå sin vei i sinne.",
        "Et annet barn roper etter og gjør det bare verre.",
        "Du ser at alt går fortere og fortere.",
        "Spørsmålet er hva som hjelper når følelsen allerede har tatt over.",
      ],
    ],
    warmupQuestions: (child, index) =>
      index % 2 === 0
        ? [
            `${child.name}, hva skjer i kroppen din rett før du sier noe dumt når du er sint?`,
            `${child.name}, hva kunne du sagt i stedet?`,
            `${child.name}, hva er forskjellen på et ærlig svar og et sårt svar?`,
          ]
        : [
            `${child.name}, hva gjør du når du kjenner at det koker?`,
            `${child.name}, hva er det første tegnet på at du mister kontrollen?`,
            `${child.name}, hva kan du gjøre som er tydelig uten å gjøre alt verre?`,
          ],
    childStories: (child, difficulty) => [
      [
        "Du blir veldig irritert på et søsken eller en venn fordi du føler deg urettferdig behandlet.",
        "Den andre personen sier noe som får deg til å ville svare hardt tilbake.",
        "Du kjenner at hele kroppen vil vinne krangelen med én gang.",
        "Du må velge om du skal slippe ut følelsen rått eller styre den litt først.",
      ],
      [
        "Noen avbryter deg flere ganger og du kjenner at du blir både sint og lei deg.",
        "Til slutt vurderer du å si noe skarpt for å få stoppet det.",
        "Du vet at det kunne føles godt der og da, men også gjøre alt verre etterpå.",
        "Spørsmålet er hvordan du kan være tydelig uten å eskalere.",
      ],
      difficulty === "advanced"
        ? [
            "Du går inn i en konflikt med mye gammel irritasjon i kroppen fra før.",
            "Det betyr at du allerede er mer ladd enn det andre ser.",
            "En liten kommentar treffer mye hardere enn den egentlig burde.",
            "Hvordan velger du når følelsen din egentlig handler om mer enn akkurat det som skjer nå?",
          ]
        : [
            "Et barn tar plassen din eller tingen din, og du blir sint med én gang.",
            "Du får lyst til å rive tilbake eller rope.",
            "Samtidig vet du at du blir misforstått når du går rett i eksplosjon.",
            "Hva gjør du i stedet?",
          ],
    ],
  },
  {
    key: "kropp-og-grenser",
    label: "Kropp, grenser og samtykke",
    title: "Øv på å sette grenser tydelig",
    warmupStories: [
      [
        "Et barn tar på kroppen til et annet barn på en måte som ikke virker grei, og ler det bort.",
        "Noen andre sier: 'Det var jo bare tull.'",
        "Den som ble utsatt ser usikker ut og sier ikke så mye.",
        "Du må tenke på hva du gjør når noe føles feil selv om andre sier det er uskyldig.",
      ],
      [
        "Noen presser på for å få en klem eller fysisk nærhet som den andre ikke virker komfortabel med.",
        "De voksne rundt ser det ikke tydelig.",
        "Stemningen blir rar fordi ingen vil være den som gjør det kleint.",
        "Likevel må noen sette en grense.",
      ],
    ],
    warmupQuestions: (child, index) =>
      index % 2 === 0
        ? [
            `${child.name}, hvordan høres et tydelig nei ut her?`,
            `${child.name}, hva gjør du hvis den andre ler av grensa di?`,
            `${child.name}, hvem kan du gå til hvis noe føles feil?`,
          ]
        : [
            `${child.name}, hvordan kjenner du i kroppen at noe ikke er greit?`,
            `${child.name}, hva kan du si hvis du vil stoppe noe uten å forklare alt?`,
            `${child.name}, hva gjør du hvis en venn ber deg holde det hemmelig?`,
          ],
    childStories: (child, difficulty) => [
      [
        "Noen i klassen eller på trening går for langt med tulling, dytting eller berøring.",
        "De sier at du overdriver hvis du reagerer.",
        "Du kjenner at noe ikke er greit, men du vil heller ikke skape en stor scene.",
        "Du må velge hvordan du setter en grense som faktisk merkes.",
      ],
      [
        "En venn vil låne mobilen din for å vise eller spørre om noe som gjelder kropp, bilde eller privat prat.",
        "Det føles litt feil, men du vil ikke virke vanskelig.",
        "Samtidig vet du at det er lettere å stoppe tidlig enn å rydde opp etterpå.",
        "Hva gjør du når grensa di ikke passer med vennens forventning?",
      ],
      difficulty === "advanced"
        ? [
            "Noen prøver å få deg til å bære på en hemmelighet som gjelder kropp, grenser eller noe som føles utrygt.",
            "De sier at du ikke må si det til noen voksne.",
            "Du skjønner at stillhet kanskje beskytter feil person.",
            "Spørsmålet er hva lojalitet egentlig betyr i en sånn situasjon.",
          ]
        : [
            "Et barn fortsetter med tulling som er fysisk selv om du sier stopp.",
            "Barnet ler og sier at det bare er lek.",
            "Du kjenner deg både sint og litt usikker på om du har lov til å gjøre en stor sak ut av det.",
            "Hvordan setter du grensa en gang til på en tydeligere måte?",
          ],
    ],
  },
  {
    key: "endring-og-skilsmisse",
    label: "Endring, familie og skilsmisse",
    title: "Gi språk til det som er vanskelig hjemme",
    warmupStories: [
      [
        "Det har skjedd en stor endring hjemme, og barna merker at alt føles annerledes enn før.",
        "En voksen prøver å holde stemningen lett, men barna bærer på spørsmål de ikke helt vet hvordan de skal stille.",
        "Noen blir stille, andre blir korte og irritable.",
        "Samtalen stopper lett hvis ingen tør å si det som faktisk er vanskelig.",
      ],
      [
        "Et barn skal mellom to hjem og later som alt er greit, men kroppen og humøret sier noe annet.",
        "Når noen spør hvordan det går, kommer det bare et raskt 'bra'.",
        "Det virker lettere å lukke seg enn å forklare.",
        "Likevel trenger barnet hjelp til å finne ord for det som skjer.",
      ],
    ],
    warmupQuestions: (child, index) =>
      index % 2 === 0
        ? [
            `${child.name}, hva er vanskeligst å si høyt når ting hjemme er annerledes?`,
            `${child.name}, hvordan merker du i kroppen at noe er tungt?`,
            `${child.name}, hva trenger du fra en voksen når du ikke vet helt hva du føler?`,
          ]
        : [
            `${child.name}, hva er lettere å si enn det du egentlig tenker?`,
            `${child.name}, hva gjør du når du savner noen eller noe, men ikke vil vise det?`,
            `${child.name}, hva ville gjort det tryggere å snakke sant?`,
          ],
    childStories: (child, difficulty) => [
      [
        "Det er mye som har endret seg hjemme i det siste.",
        "Kanskje bor folk annerledes, kanskje reglene er nye, eller kanskje humøret i huset er helt forandret.",
        "Du merker at du reagerer, men det er ikke alltid lett å forklare hvordan.",
        "Spørsmålet er hvordan du kan si noe sant uten å måtte ha alt perfekt formulert.",
      ],
      [
        "Du skal fra ett hjem til et annet og kjenner at overgangen er tyngre enn du vil innrømme.",
        "Når noen spør, frister det å bare si 'det går fint' for å slippe mer prat.",
        "Samtidig håper en del av deg at noen skjønner at det ikke er hele sannheten.",
        "Hva svarer du hvis du skal være litt modigere enn vanlig?",
      ],
      difficulty === "advanced"
        ? [
            "Du bærer på to følelser samtidig: lojalitet til de voksne og et sterkt behov for å si hvordan dette faktisk kjennes for deg.",
            "Det gjør det vanskelig å være ærlig uten å føle at du svikter noen.",
            "Du er redd for at sannheten din skal bli for mye for de voksne.",
            "Hvordan sier du det viktigste uten å ta ansvar for alles følelser samtidig?",
          ]
        : [
            "Du savner noe sånn det var før, men du vet ikke helt hvordan du skal si det uten å gjøre noen lei seg.",
            "Derfor blir du kanskje stille, sint eller kort i stedet.",
            "En voksen prøver å snakke med deg, men du vet ikke hvor du skal begynne.",
            "Hva er én setning du kan starte med?",
          ],
    ],
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
        lowered.includes(item.key.replaceAll("-", " ")) ||
        lowered.includes(item.label.toLowerCase()),
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
    return THEMES[4];
  }

  return THEMES[3];
}

function cleanName(name: string, fallbackIndex: number) {
  const trimmed = name.trim();
  return trimmed.length > 0 ? trimmed : `Barn ${fallbackIndex + 1}`;
}

function ageBandQuestion(child: ChildInput) {
  if (child.age >= 13) {
    return "Hva slags person blir du hvis hovedregelen din er at du bare ikke vil bli det neste målet selv?";
  }

  if (child.age >= 9) {
    return "Hvordan kan du få fram poenget ditt tydelig uten å prøve å gjøre den andre liten?";
  }

  return "Hvordan kan du være tydelig og rolig samtidig?";
}

function notePlaceholder(stepTitle: string) {
  return `Skriv korte notater fra steget "${stepTitle}" her. Eksempel: hva barnet svarte, hva som var vanskelig, og hva du vil følge opp senere.`;
}

function childContextLines(child: ChildInput) {
  const lines: string[] = [];

  if (child.temperament?.trim()) {
    lines.push(`Temperament / stil: ${child.temperament.trim()}`);
  }

  if (child.focus?.trim()) {
    lines.push(`Aktuell utfordring nå: ${child.focus.trim()}`);
  }

  return lines;
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
    "Målet her er ikke å få riktige svar, men å få dem til å se sin egen tenking.",
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
      temperament: child.temperament?.trim() || "",
      focus: child.focus?.trim() || "",
    }));

  const duration = rawInput.session_length_minutes ?? 20;
  const theme = chooseTheme({ ...rawInput, children });

  const steps: SessionStep[] = [
    {
      id: "parent-guide",
      kind: "script",
      title: "Foreldreguide",
      audience: "Felles",
      description: "Les dette høyt før dere starter. Hold tonen rolig og nysgjerrig.",
      content: [
        "I dag skal vi øve på å tenke under press.",
        "Jeg er ikke ute etter perfekte svar.",
        "Jeg vil ha tydelige svar, ekte grunner og ærlig tenking.",
        "Hvis du kjenner deg usikker, er det en del av øvelsen.",
        "Du må fortsatt velge noe og forklare hvorfor.",
      ],
      helpTitle: "Støtte til forelder",
      helpLines: [
        "Les rolig og sakte. Ikke legg til en miniforelesning etterpå.",
        "Hvis barna vil diskutere før du er ferdig, si: 'Hold på tanken. Først hører vi hele oppgaven.'",
        "Målet i dette steget er å sette rammen: tydelig, rolig, ingen moralpreken.",
      ],
      notePlaceholder: notePlaceholder("Foreldreguide"),
    },
    {
      id: "shared-scenario",
      kind: "scenario",
      title: "Felles scenario",
      audience: "Felles",
      description: "Les scenarioet høyt. Hvis det ikke treffer, lag en ny variant med knappen øverst til høyre.",
      scenarioVariants: theme.warmupStories,
      helpTitle: "Støtte til forelder",
      helpLines: [
        "Les hele scenarioet før du tar imot svar.",
        "Ikke myk opp situasjonen. Litt ubehag er meningen.",
        "Hvis barna hopper rett til moral, si: 'Vent. Først vil jeg høre hva du faktisk ville gjort.'",
      ],
      notePlaceholder: notePlaceholder("Felles scenario"),
    },
    {
      id: "shared-questions",
      kind: "questions",
      title: "Spørsmål til alle",
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
      helpTitle: "Støtte til forelder",
      helpLines: [
        "Be alltid om konkrete ord, ikke bare generelle forklaringer.",
        "Hvis svaret blir uklart, si: 'Si det som om det skjer nå.'",
        "Hvis barnet svarer veldig fort, press med: 'Hva overser du i det svaret?'",
      ],
      notePlaceholder: notePlaceholder("Spørsmål til alle"),
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
      sections:
        childContextLines(child).length > 0
          ? [
              {
                title: "Kontekst å ha i bakhodet",
                lines: childContextLines(child),
              },
            ]
          : undefined,
      helpTitle: "Støtte til forelder",
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
        ...(childContextLines(child).length > 0
          ? [
              {
                title: "Kontekst å ta med inn i spørsmålene",
                lines: childContextLines(child),
              },
            ]
          : []),
        {
          title: "Hovedspørsmål",
          lines:
            child.age >= 13
              ? [
                  `Spør: "${child.name}, hva gjør du først?"`,
                  'Spør: "Hva ville du sagt eller skrevet, ord for ord?"',
                  rawInput.difficulty_level === "advanced"
                    ? 'Spør: "Hva prøver du mest å beskytte her: deg selv, statusen din, relasjonen, eller den andre personen?"'
                    : 'Spør: "Hvis du ikke gjør noe, hva tror du skjer videre?"',
                  'Spør: "Hva er det tredje alternativet, bortsett fra å bli med eller late som du ikke så det?"',
                ]
              : child.age >= 9
                ? [
                    `Spør: "${child.name}, hva sier du først, helt konkret?"`,
                    'Spør: "Sier du noe med en gang, venter du, eller ber du om å snakke alene?"',
                    rawInput.difficulty_level === "advanced"
                      ? 'Spør: "Hva beskytter du mest her: stoltheten din, tryggheten din, eller hvordan folk vil behandle deg senere?"'
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
      ],
      helpTitle: "Støtte til forelder",
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
    helpTitle: "Støtte til forelder",
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
        title: "Sikkerhetsramme for forelder",
        lines: [
          "Denne økten er laget for hverdagslige, vanskelige samtaler hjemme.",
          "Hvis barnet forteller om vold, overgrep, selvskading eller noe som kjennes akutt, gå ut av øvelsen og søk hjelp med en gang.",
          "Du trenger ikke fullføre en økt hvis barnet blir overveldet. Senk tempoet, bekreft følelsen, og ta pausen først.",
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
    helpTitle: "Støtte til forelder",
    helpLines: [
      "Dette er oppsummeringsvinduet ditt. Bruk det etter økten eller mellom stegene hvis du trenger å nullstille deg.",
      "Hvis du merker at du blir frustrert, gå tilbake hit og minn deg selv på at målet er tenking, ikke lydighet.",
      "Se etter framgang i tydelighet og motstandstoleranse, ikke i perfekte svar.",
    ],
    notePlaceholder: notePlaceholder("Foreldrenotater"),
  });

  return {
    brand: "KlokPrat",
    title: theme.title,
    theme: theme.label,
    durationLabel: `${duration} minutter`,
    participantsLabel: children.map((child) => `${child.name} (${child.age})`).join(", "),
    ageGuidance: "Best egnet for barn ca. 6-16 år",
    steps,
  };
}
