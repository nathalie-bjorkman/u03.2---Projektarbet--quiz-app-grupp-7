/*
 * Den här filen hanterar quizets frågor och svar.
 *
 * Hämtar frågor från Open Trivia DB baserat på den kategori
 * som spelaren valt på startsidan.
 *
 * Visar frågor och svarsalternativ, hanterar spelarens val
 * och kontrollerar om svaren är rätt eller fel.
 *
 * Håller koll på vilken fråga spelaren är på,
 * uppdaterar framstegen och sparar svaren.
 *
 * När alla frågor är besvarade eller tiden tar slut
 * räknas poängen ihop och spelaren skickas till resultatsidan.
 */

const API_ENDPOINT = "https://opentdb.com/api.php";

const categoryMap = {
  blandat: null,
  natur: [17, 22],
  kultur: [23, 12, 25],
};

// Hämtar HTML-elementen
const answerTitleElements = [
  document.querySelector("#answer-titel-1"),
  document.querySelector("#answer-titel-2"),
  document.querySelector("#answer-titel-3"),
];

const answerElements = [
  document.querySelector("#answer-1"),
  document.querySelector("#answer-2"),
  document.querySelector("#answer-3"),
];

const questionTitleElement = document.querySelector("#question-titel");
const questionCategoryElement = document.querySelector("#question-category");
const submitBtn = document.querySelector("#submit");

// Variabler för quizets tillstånd
let questions = [];
let currentQuestionIndex = 0;
let selectedAnswerIndex = null;
let correctAnswerIndex = null;
let currentAnswerOptions = [];

// Blandar svarsalternativen i slumpmässig ordning
function shuffle(array) {
  let currentIndex = array.length;

  while (currentIndex !== 0) {
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

// Hämtar kategoriernas namn och ID från API:et
async function getCategoryNames() {
  const response = await fetch("https://opentdb.com/api_category.php");

  if (!response.ok) {
    throw new Error(`Kunde inte hämta kategorier: ${response.status}`);
  }

  const data = await response.json();

  return data.trivia_categories.map(({ id, name }) => ({
    id,
    name: name.trim(),
  }));
}

// Hämtar slumpmässiga frågor från Open Trivia DB
async function getAPIQuestions(categoryId, difficulty = "easy", amount = 10) {
  const params = new URLSearchParams({
    amount: String(amount),
    difficulty,
    type: "multiple",
  });

  if (categoryId !== undefined && categoryId !== null) {
    params.set("category", String(categoryId));
  }

  const response = await fetch(`${API_ENDPOINT}?${params}`);

  if (!response.ok) {
    throw new Error(`Kunde inte hämta frågor: ${response.status}`);
  }

  const data = await response.json();

  if (data.response_code !== 0) {
    throw new Error(`Fråge-API:t returnerade felkod ${data.response_code}`);
  }

  return data.results;
}

// Omvandlar HTML-entiteter till vanlig text
function decodeHTML(value) {
  return new DOMParser().parseFromString(value, "text/html").documentElement
    .textContent;
}

// Nollställer markeringen på svarsalternativen
function resetAnswers() {
  answerElements.forEach((answerElement) => {
    answerElement.classList.remove(
      "answer-wrong",
      "answer-correct",
      "answer-selected"
    );

    answerElement.setAttribute("aria-pressed", "false");
  });

  selectedAnswerIndex = null;
}

// Markerar spelarens valda svar
function selectAnswer(answerIndex) {
  resetAnswers();

  selectedAnswerIndex = answerIndex;

  answerElements[answerIndex].classList.add("answer-selected");
  answerElements[answerIndex].setAttribute("aria-pressed", "true");
}

// Visar aktuell fråga och svarsalternativ
function askQuestion(question) {
  questionTitleElement.textContent = decodeHTML(question.question);

  questionCategoryElement.textContent = decodeHTML(question.category);

  // Blandar två felaktiga svar och ett rätt svar
  const answers = shuffle([
    ...question.incorrect_answers.slice(0, answerTitleElements.length - 1),
    question.correct_answer,
  ]);

  // Sparar svarsalternativen för resultatsidan
  currentAnswerOptions = answers.map(decodeHTML);

  // Hittar index för rätt svar
  correctAnswerIndex = answers.indexOf(question.correct_answer);

  resetAnswers();

  // Visar svarsalternativen i HTML
  answers.forEach((answer, index) => {
    answerTitleElements[index].textContent = decodeHTML(answer);
  });

  // Startar timern vid första frågan
  if (
    currentQuestionIndex === 0 &&
    typeof window.startQuizTimer === "function"
  ) {
    window.startQuizTimer();
  }

  // Uppdaterar progressbaren
  if (typeof window.updateProgress === "function") {
    window.updateProgress(currentQuestionIndex + 1, questions.length);
  }
}

// Kontrollerar om spelaren valt rätt svar
function validateAnswers() {
  if (selectedAnswerIndex === null) {
    return null;
  }

  answerElements.forEach((answerElement, index) => {
    if (index === correctAnswerIndex) {
      answerElement.classList.add("answer-correct");
    } else if (index === selectedAnswerIndex) {
      answerElement.classList.add("answer-wrong");
    }

    answerElement.classList.remove("answer-selected");
  });

  return selectedAnswerIndex === correctAnswerIndex;
}

// Sparar spelarens svar och går vidare till nästa fråga
function submitAnswer(event) {
  event.preventDefault();

  const isCorrect = validateAnswers();

  if (isCorrect === null) {
    alert("Vänligen välj ett svar");
    return;
  }

  // Hämtar tidigare svar eller skapar en tom lista
  const results = JSON.parse(localStorage.getItem("results") ?? "[]");

  // Sparar frågan, svarsalternativen och spelarens val
  results.push({
    question: decodeHTML(questions[currentQuestionIndex].question),
    options: currentAnswerOptions,
    selected: selectedAnswerIndex,
    correct: correctAnswerIndex,
    isCorrect,
  });

  // Sparar svaren i localStorage
  localStorage.setItem("results", JSON.stringify(results));

  // Går vidare till nästa fråga
  currentQuestionIndex++;

  // Avslutar quizet efter sista frågan
  if (currentQuestionIndex === questions.length) {
    if (typeof window.finishQuiz === "function") {
      window.finishQuiz("completed");
    }

    return;
  }

  // Visar nästa fråga
  askQuestion(questions[currentQuestionIndex]);
}

// Hämtar frågor från API eller tidigare sparad data
async function loadQuestions(categoryId) {
  const storedCategoryId = localStorage.getItem("questionsCategoryId");

  let storedQuestions;

  try {
    storedQuestions = JSON.parse(localStorage.getItem("questions") ?? "null");
  } catch (error) {
    if (!(error instanceof SyntaxError)) {
      throw error;
    }
  }

  // Använder sparade frågor om kategorin är densamma
  if (
    Array.isArray(storedQuestions) &&
    storedQuestions.length > 0 &&
    storedCategoryId === String(categoryId)
  ) {
    return storedQuestions;
  }

  // Hämtar nya frågor och sparar dem
  const fetchedQuestions = await getAPIQuestions(categoryId);

  localStorage.setItem("questions", JSON.stringify(fetchedQuestions));

  localStorage.setItem("questionsCategoryId", String(categoryId));

  return fetchedQuestions;
}

// Startar quizet
async function init() {
  // Nollställer tidigare svar inför en ny spelomgång
  localStorage.removeItem("results");

  // Hämtar vald kategori från startsidan
  const selectedCategory =
    sessionStorage.getItem("selectedCategory") ?? "blandat";

  const categoryIds = categoryMap[selectedCategory] ?? null;

  // Väljer ett slumpmässigt kategori-ID
  const categoryId =
    categoryIds === null
      ? null
      : categoryIds[Math.floor(Math.random() * categoryIds.length)];

  // Hämtar frågorna
  questions = await loadQuestions(categoryId);

  if (!Array.isArray(questions) || questions.length === 0) {
    throw new Error("Det finns inga frågor att visa.");
  }

  // Kopplar klickhändelser till svarsalternativen
  answerElements.forEach((answerElement, index) => {
    answerElement.addEventListener("click", () => {
      selectAnswer(index);
    });
  });

  // Kopplar bekräftaknappen
  submitBtn.addEventListener("click", submitAnswer);

  // Visar första frågan
  askQuestion(questions[currentQuestionIndex]);
}

// Avslutar quizet och skickar spelaren till resultatsidan
window.finishQuiz = function (reason) {
  // Stoppar timern
  window.stopQuizTimer?.();

  // Hämtar spelarens sparade svar
  const answers = JSON.parse(localStorage.getItem("results") ?? "[]");

  // Räknar antalet rätt
  const score = answers.filter((answer) => answer.isCorrect).length;

  // Hämtar tiden som använts
  const timeUsed = window.getTimeUsed();

  // Sparar resultatet inför sidbytet
  sessionStorage.setItem(
    "quiztajm_current_result",
    JSON.stringify({
      score,
      total: questions.length,
      time: window.formatQuizTime(timeUsed),
      answers,
      reason,
    })
  );

  // Går vidare till resultatsidan
  window.location.href = "./result.html";
};

// Startar quizet när sidan laddas
init();
