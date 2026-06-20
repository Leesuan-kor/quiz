// !!! Apps Script 배포 후 얻은 웹 앱 URL을 아래에 반드시 입력하세요 !!!
const SCRIPT_URL = "여기에_웹앱_URL을_붙여넣으세요";

const quizData = [
    { question: "1. 다른 사람이 만든 창작물을 허락 없이 사용하는 것은?", options: ["초상권", "저작권", "재산권", "인격권"], answer: 1 },
    { question: "2. 수집된 사실인 ( A )를 가공하여 유용하게 만든 것을 ( B )라 합니다.", options: ["A: 정보, B: 자료", "A: 소프트웨어, B: 하드웨어", "A: 자료, B: 정보", "A: 하드웨어, B: 소프트웨어"], answer: 2 },
    { question: "3. 컴퓨터의 물리적인 기계 장치(하드웨어)가 아닌 것은?", options: ["모니터", "운영체제(OS)", "중앙처리장치(CPU)", "키보드"], answer: 1 },
    { question: "4. 하드웨어를 제어하고 사용자가 작업을 수행하게 해주는 프로그램 모음은?", options: ["소프트웨어", "입력장치", "출력장치", "기억장치"], answer: 0 },
    { question: "5. 인터넷을 사용하면서 남기는 각종 흔적을 무엇이라 부를까요?", options: ["디지털 섀도우", "아날로그 발자국", "사이버 스페이스", "디지털 발자국"], answer: 3 }
];

let role = ""; 
let studentName = "";
let currentQuestionIndex = -1; // -1 은 대기 상태
let score = 0;
let timeLeft = 10;
let timerInterval;
let isEnded = false;

const screens = {
    login: document.getElementById('login-screen'),
    waiting: document.getElementById('waiting-screen'),
    quiz: document.getElementById('quiz-screen'),
    result: document.getElementById('result-screen')
};

function showScreen(screenName) {
    Object.values(screens).forEach(s => s.classList.add('hidden'));
    screens[screenName].classList.remove('hidden');
}

// 1. 학생 참여
document.getElementById('join-btn').addEventListener('click', async () => {
    const nameInput = document.getElementById('student-name').value;
    if (!nameInput) return alert("이름을 입력해주세요!");
    
    role = 'student';
    studentName = nameInput;
    showScreen('waiting');
    
    // 구글 시트에 학생 등록
    await fetch(`${SCRIPT_URL}?action=join&name=${studentName}`);
    
    // 2초마다 선생님의 화면 상태 확인(폴링 시작)
    setInterval(pollTeacherState, 2000); 
});

// 2. 교사 모드 진입
document.getElementById('teacher-btn').addEventListener('click', async () => {
    role = 'teacher';
    document.getElementById('teacher-controls').classList.remove('hidden');
    
    // 첫 문제(0번) 상태로 시트 업데이트 후 문제 로드
    await fetch(`${SCRIPT_URL}?action=setQuestion&index=0&status=active`);
    loadQuestion(0);
});

// 3. 학생 화면 동기화 (폴링)
async function pollTeacherState() {
    if (role !== 'student' || isEnded) return;
    
    try {
        const response = await fetch(`${SCRIPT_URL}?action=getState`);
        const data = await response.json();
        
        if (data.status === 'ended') {
            isEnded = true;
            showResult();
        } else if (data.status === 'active' && data.currentQuestion !== currentQuestionIndex) {
            loadQuestion(data.currentQuestion);
        }
    } catch(e) {
        console.error("상태 확인 실패", e);
    }
}

// 4. 문제 로드
function loadQuestion(index) {
    currentQuestionIndex = index;
    showScreen('quiz');
    
    document.getElementById('question-number').innerText = `문제 ${index + 1} / ${quizData.length}`;
    document.getElementById('question').innerText = quizData[index].question;
    
    const optionsEl = document.getElementById('options');
    optionsEl.innerHTML = "";
    selectedAnswer = null;
    
    quizData[index].options.forEach((option, i) => {
        const btn = document.createElement("button");
        btn.innerText = option;
        btn.classList.add("option-btn");
        if(role === 'student') {
            btn.addEventListener('click', () => selectOption(btn, i));
        } else {
            btn.disabled = true;
        }
        optionsEl.appendChild(btn);
    });

    startTimer();
}

// 5. 타이머
function startTimer() {
    timeLeft = 10;
    document.getElementById('time-left').innerText = timeLeft;
    clearInterval(timerInterval);
    
    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('time-left').innerText = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            checkAnswers(); 
        }
    }, 1000);
}

// 6. 답안 선택
let selectedAnswer = null;
function selectOption(btn, index) {
    if (selectedAnswer !== null) return; // 중복 선택 방지
    const allBtns = document.querySelectorAll('.option-btn');
    allBtns.forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    selectedAnswer = index;
}

// 7. 정답 확인 및 점수 전송
async function checkAnswers() {
    const currentQuiz = quizData[currentQuestionIndex];
    const allBtns = document.querySelectorAll('.option-btn');
    allBtns.forEach(btn => btn.disabled = true); // 클릭 비활성화
    
    if (role === 'student' && selectedAnswer === currentQuiz.answer) {
        score += 20;
        document.getElementById('final-score').innerText = `내 점수: ${score}점`;
        // 구글 시트에 내 점수 +20점 전송
        await fetch(`${SCRIPT_URL}?action=updateScore&name=${studentName}&score=20`);
    }
    
    // 정답/오답 표시
    allBtns[currentQuiz.answer].classList.add('correct');
    if (selectedAnswer !== null && selectedAnswer !== currentQuiz.answer) {
        allBtns[selectedAnswer].classList.add('wrong');
    }
}

// 8. 교사 다음 버튼
document.getElementById('next-btn').addEventListener('click', async () => {
    if (currentQuestionIndex + 1 < quizData.length) {
        const nextIndex = currentQuestionIndex + 1;
        await fetch(`${SCRIPT_URL}?action=setQuestion&index=${nextIndex}&status=active`);
        loadQuestion(nextIndex);
    } else {
        await fetch(`${SCRIPT_URL}?action=setQuestion&index=0&status=ended`);
        showScreen('result');
    }
});

function showResult() {
    showScreen('result');
}
