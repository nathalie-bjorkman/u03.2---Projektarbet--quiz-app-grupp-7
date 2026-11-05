# Quiz Tajm 🎯

Quiz Tajm är en quizapp byggd med HTML, CSS och vanilla JavaScript som en del av kursen Fullstack JavaScript på Chas Academy.

Användaren får testa sina kunskaper genom att besvara 10 frågor på fyra minuter. Varje fråga har tre svarsalternativ: 1, X och 2.

## Teammedlemmar

- Nathalie
- Marcus

## Om appen

Appen består av fyra huvudsakliga vyer:

1. **Startskärm:** Användaren väljer kategori och får information om quizet.
2. **Frågeskärm:** Frågor och svarsalternativ hämtas från Open Trivia DB. En timer räknar ner från fyra minuter och en progressbar visar hur långt användaren kommit.
3. **Avslutningsskärm:** Visas när alla frågor är besvarade eller tiden tar slut.
4. **Resultatskärm:** Användaren får se sina poäng och möjlighet att gå igenom sina svar.

Appen använder `localStorage` för att spara frågor och svar samt `sessionStorage` för att föra över vald kategori och aktuellt resultat mellan sidorna.

## Planering och design

Vi började projektet med UX-metoden **Crazy 8s**, där vi individuellt skissade på olika lösningar för appen. Därefter gick vi igenom förslagen tillsammans och röstade fram de idéer vi ville arbeta vidare med.

Vi tog sedan fram wireframes och en designskiss i Figma som låg till grund för utvecklingen.

Designen använder typsnitten Fredoka och DM Sans tillsammans med en färgpalett i lila, rosa och gult.

### Skisser och design

[Se designen i Figma](https://www.figma.com/design/dDtTZeF3oq0rlZFnJ7OF5K/U03---Quizapp?node-id=0-1)

## Teknik

Projektet är byggt med:

- HTML5 och CSS3
- Vanilla JavaScript
- Open Trivia DB API
- Fetch API och async/await
- localStorage och sessionStorage
- Git och GitHub

### Kodstruktur

JavaScript-koden är uppdelad i separata filer med olika ansvarsområden:

- `startscreen.js` hanterar kategorival och start av quizet.
- `questions.js` hämtar frågor från API:et, visar svarsalternativ och hanterar svar och poäng.
- `timer.js` hanterar nedräkningen, framstegen och tidsgränsen.
- Resultatkoden hanterar presentationen av quizets resultat.

### Datamodell

Frågorna hämtas från Open Trivia DB och innehåller bland annat frågetext, kategori, rätt svar och felaktiga svarsalternativ.

När användaren svarar sparas information om frågan, vilka svarsalternativ som visades, spelarens val och om svaret var rätt eller fel.

## Git och samarbete

Vi har arbetat i ett gemensamt GitHub-repo med feature branches, commits och pull requests. Vi har också använt code review för att granska kod innan den sammanfogades med main.

Arbetet delades inledningsvis upp i olika delar av appen. Mot slutet blev arbetsfördelningen däremot ojämn, vilket gjorde att vi två, Nathalie och Marcus, fick ta ett större ansvar för att färdigställa och få ihop applikationen.

## AI-verktyg

Vi har använt AI-verktyg som stöd under projektet.

**Figma Make** användes för att utforska och generera delar av designen. Vi märkte dock att resultatet inte alltid motsvarade våra skisser, framför allt när det gällde textplacering och layout.

**ChatGPT** användes som stöd för bland annat kodförslag, felsökning och förklaringar av JavaScript.

Förslagen granskades och justerades utifrån projektets befintliga kod och design.

## Reflektion

### Vad fungerade bra?

En av de mest givande delarna var Crazy 8s. Det var intressant att se hur olika vi föreställde oss en så pass enkel produkt som en quizapp.

Vissa skissade på lösningar där alla frågor visades samtidigt, medan andra föreslog en fråga i taget. Vi hade däremot ganska liknande idéer kring start- och avslutningsskärmarna.

Övningen hjälpte oss att snabbt få fram idéer och komma överens om en gemensam riktning.

Vi fick också en bättre förståelse för hur olika delar av en applikation behöver fungera tillsammans, särskilt när flera personer arbetar i samma kodbas.

### Utmaningar och förbättringsmöjligheter

Den största utmaningen var samarbetet. Vi hade från början delat upp arbetet mellan gruppmedlemmarna, men kommunikationen och engagemanget fungerade inte som vi hade tänkt.

Det ledde till att vissa delar drog ut på tiden och att vi mot slutet behövde lägga mycket fokus på att färdigställa och koppla ihop appen.

I efterhand hade vi behövt tydligare avstämningar och tidigare kontroll av att de olika delarna fungerade tillsammans.

Vi hade också gärna lagt mer tid på den inledande designprocessen. Crazy 8s var en rolig och givande metod som hade kunnat utvecklas ytterligare.

En annan lärdom var att AI-genererad design inte alltid fungerar direkt som tänkt. Även när resultatet ser bra ut visuellt behöver det granskas och anpassas manuellt.

## Länkar

- MARCUS OCH NATHALIE **GitHub:** [Projektets repository](https://github.com/nathalie-bjorkman/u03.2---Projektarbet--quiz-app-grupp-7.git)
- ORGINAL GRUPP 7 **GitHub:** [Projektets repository](https://github.com/nathalie-bjorkman/u03---Projektarbet--quiz-app-grupp-7)
- **Figma:** [Design och skisser](https://www.figma.com/design/dDtTZeF3oq0rlZFnJ7OF5K/U03---Quizapp?node-id=0-1)
- **Publicerad app:** Lägg till länk här
