@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700&display=swap');

body {
    font-family: 'Noto Sans KR', sans-serif;
    background-color: #f0f4f8;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    margin: 0;
}

.quiz-container {
    background-color: #ffffff;
    width: 90%;
    max-width: 600px;
    border-radius: 15px;
    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
    padding: 30px;
    text-align: center;
}

h1, h2 { color: #2c3e50; }

input[type="text"] {
    width: 80%;
    padding: 12px;
    margin-bottom: 15px;
    border: 1px solid #cbd5e0;
    border-radius: 8px;
    font-size: 1rem;
}

.primary-btn, .secondary-btn {
    width: 100%;
    padding: 12px;
    border: none;
    border-radius: 8px;
    font-size: 1.1rem;
    font-weight: bold;
    cursor: pointer;
    margin-bottom: 10px;
    transition: 0.2s;
}

.primary-btn {
    background-color: #4299e1;
    color: white;
}
.primary-btn:hover { background-color: #3182ce; }

.secondary-btn {
    background-color: #edf2f7;
    color: #4a5568;
}
.secondary-btn:hover { background-color: #e2e8f0; }

hr {
    border: 0;
    height: 1px;
    background: #e2e8f0;
    margin: 20px 0;
}

.header-info {
    display: flex;
    justify-content: space-between;
    font-weight: bold;
    margin-bottom: 15px;
}

#timer {
    color: #e53e3e;
    font-size: 1.2rem;
}

.options-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.option-btn {
    padding: 12px;
    border: 2px solid #edf2f7;
    background-color: #edf2f7;
    border-radius: 8px;
    font-size: 1rem;
    cursor: pointer;
    text-align: left;
}

.option-btn:disabled { cursor: not-allowed; }
.option-btn.selected { border-color: #4299e1; background-color: #ebf8ff; }
.option-btn.correct { background-color: #c6f6d5; border-color: #48bb78; }
.option-btn.wrong { background-color: #fed7d7; border-color: #f56565; }

.hidden { display: none !important; }
