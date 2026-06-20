// 퀴즈 문제 데이터 (2022 개정 1~2단원 반영)
const quizData = [
    {
        question: "1. 다른 사람이 만든 창작물(음악, 글, 사진 등)을 허락 없이 사용하는 것은 어떤 권리를 침해하는 것일까요?",
        options: ["초상권", "저작권", "재산권", "인격권"],
        answer: 1 // 배열 인덱스 (0부터 시작하므로 '저작권'이 정답)
    },
    {
        question: "2. 관찰이나 측정을 통해 수집된 단순한 사실이나 값을 ( A )(이)라고 하고, 이를 목적에 맞게 가공하여 유용하게 만든 것을 ( B )(이)라고 합니다. 알맞은 말은?",
        options: ["A: 정보, B: 자료", "A: 소프트웨어, B: 하드웨어", "A: 자료, B: 정보", "A: 하드웨어, B: 소프트웨어"],
        answer: 2
    },
    {
        question: "3. 다음 중 컴퓨터를 구성하는 물리적인 기계 장치인 '하드웨어(Hardware)'가 아닌 것은 무엇인가요?",
        options: ["모니터", "운영체제(OS)", "중앙처리장치(CPU)", "키보드"],
        answer: 1
    },
    {
        question: "4. 컴퓨터 하드웨어가 작동할 수 있도록 지시하고 제어하며, 사용자가 원하는 작업을 수행할 수 있게 해주는 프로그램들의 모음을 무엇이라고 하나요?",
        options: ["소프트웨어", "입력장치", "출력장치", "기억장치"],
        answer: 0
    },
    {
        question: "5. 우리가 인터넷을 사용하면서 남기는 검색 기록, 방문 기록, SNS 글 등의 흔적을 무엇이라고 부를까요?",
        options: ["디지털 섀도우", "아날로그 발자국", "사이버 스페이스", "디지털 발자국"],
        answer: 3
    }
];

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const nextBtn = document.getElementById("next-btn");
const questionNumberEl = document.getElementById("question-number");
const scoreEl = document.getElementById("score");
const quizEl = document.getElementById("quiz");
const resultEl = document.getElementById("result");
const finalScoreEl = document.getElementById("final-score");
const restartBtn = document.getElementById("restart-btn");

let currentQuestionIndex = 0;
let score = 0;

// 퀴즈 시작 함수
function loadQuestion() {
    // 다음 버튼 숨기기
    nextBtn.classList.add("hidden");
    
    // 현재 문제 데이터 가져오기
    const currentQuiz = quizData[currentQuestionIndex];
    
    // 텍스트 업데이트
    questionNumberEl.innerText = `문제 ${currentQuestionIndex + 1} / ${quizData.length}`;
    scoreEl.innerText = `현재 점수: ${score}점`;
    questionEl.innerText = currentQuiz.question;
    
    // 선택지 초기화 및 생성
    optionsEl.innerHTML = "";
    currentQuiz.options.forEach((option, index) => {
        const button = document.createElement("button");
        button.innerText = option;
        button.classList.add("option-btn");
        button.addEventListener("click", () => selectOption(button, index));
        optionsEl.appendChild(button);
    });
}

// 선택지 클릭 시 동작
function selectOption(selectedButton, selectedIndex) {
    const currentQuiz = quizData[currentQuestionIndex];
    const allButtons = optionsEl.querySelectorAll(".option-btn");
    
    // 정답 체크
    if (selectedIndex === currentQuiz.answer) {
        selectedButton.classList.add("correct");
        score += 20; // 한 문제당 20점 (총 100점 만점)
        scoreEl.innerText = `현재 점수: ${score}점`;
    } else {
        selectedButton.classList.add("wrong");
        // 오답을 고르면 정답을 초록색으로 표시해줌
        allButtons[currentQuiz.answer].classList.add("correct");
    }
    
    // 모든 버튼 비활성화 (중복 클릭 방지)
    allButtons.forEach(btn => btn.disabled = true);
    
    // 다음 버튼 표시
    nextBtn.classList.remove("hidden");
}

// 다음 문제로 이동
nextBtn.addEventListener("click", () => {
    currentQuestionIndex++;
    
    if (currentQuestionIndex < quizData.length) {
        loadQuestion();
    } else {
        showResult();
    }
});

// 결과창 표시
function showResult() {
    quizEl.classList.add("hidden");
    resultEl.classList.remove("hidden");
    finalScoreEl.innerText = `총 100점 만점에 ${score}점을 받았습니다!`;
}

// 다시 풀기
restartBtn.addEventListener("click", () => {
    currentQuestionIndex = 0;
    score = 0;
    quizEl.classList.remove("hidden");
    resultEl.classList.add("hidden");
    loadQuestion();
});

// 초기 실행
loadQuestion();
