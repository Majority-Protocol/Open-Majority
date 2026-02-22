// src/index.ts
var openMajorityGameHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<title>Open Majority</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: #0a0a1a;
    color: #fff;
    overflow: hidden;
    height: 100vh;
    height: 100dvh;
  }

  /* \u2500\u2500 Shared \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
  .screen { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 24px; transition: opacity 0.35s ease, transform 0.35s ease; }
  .screen.hidden { opacity: 0; pointer-events: none; transform: translateY(20px); }
  .screen.active { opacity: 1; pointer-events: auto; transform: translateY(0); }

  .badge { display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }

  /* \u2500\u2500 Lobby \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
  #lobby .pulse-dot { width: 10px; height: 10px; border-radius: 50%; background: #22c55e; animation: pulse 1.5s ease infinite; }
  @keyframes pulse { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.3); } }
  #lobby h1 { font-size: 28px; font-weight: 800; background: linear-gradient(135deg, #818cf8, #c084fc); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 8px; }
  #lobby .subtitle { color: rgba(255,255,255,0.5); font-size: 14px; }

  /* \u2500\u2500 Question \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
  #question { justify-content: flex-start; padding-top: 40px; }
  .question-number { font-size: 13px; font-weight: 700; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 2px; margin-bottom: 12px; }
  .question-text { font-size: 22px; font-weight: 700; text-align: center; line-height: 1.4; max-width: 500px; margin-bottom: 24px; }
  .question-media { max-width: 300px; max-height: 180px; border-radius: 12px; margin-bottom: 20px; object-fit: cover; }

  /* Timer bar */
  .timer-wrap { width: 100%; max-width: 400px; margin-bottom: 24px; }
  .timer-bar-bg { height: 6px; border-radius: 3px; background: rgba(255,255,255,0.1); overflow: hidden; }
  .timer-bar { height: 100%; border-radius: 3px; background: linear-gradient(90deg, #818cf8, #c084fc); transition: width 0.25s linear; }
  .timer-bar.warning { background: linear-gradient(90deg, #f59e0b, #ef4444); }
  .timer-seconds { text-align: center; margin-top: 8px; font-size: 14px; font-weight: 700; color: rgba(255,255,255,0.6); }
  .timer-seconds.warning { color: #ef4444; }

  /* Input area */
  .answer-area { width: 100%; max-width: 400px; }
  .answer-input {
    width: 100%; padding: 16px 20px; border-radius: 16px; border: 2px solid rgba(255,255,255,0.15);
    background: rgba(255,255,255,0.05); color: #fff; font-size: 18px; font-weight: 500;
    outline: none; transition: border-color 0.2s;
  }
  .answer-input:focus { border-color: #818cf8; }
  .answer-input::placeholder { color: rgba(255,255,255,0.25); }
  .answer-input:disabled { opacity: 0.4; }

  .submit-btn {
    width: 100%; margin-top: 12px; padding: 16px; border: none; border-radius: 16px;
    background: linear-gradient(135deg, #818cf8, #6366f1); color: #fff; font-size: 16px;
    font-weight: 700; cursor: pointer; transition: all 0.2s; text-transform: uppercase; letter-spacing: 1px;
  }
  .submit-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(99,102,241,0.4); }
  .submit-btn:active:not(:disabled) { transform: translateY(0); }
  .submit-btn:disabled { opacity: 0.35; cursor: not-allowed; }

  .char-count { text-align: right; font-size: 12px; color: rgba(255,255,255,0.3); margin-top: 6px; }

  /* \u2500\u2500 Waiting \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
  #waiting .check-icon { width: 64px; height: 64px; border-radius: 50%; background: rgba(34,197,94,0.15); display: flex; align-items: center; justify-content: center; margin-bottom: 16px; }
  #waiting .check-icon svg { width: 32px; height: 32px; color: #22c55e; }
  #waiting h2 { font-size: 22px; font-weight: 700; margin-bottom: 8px; }
  #waiting .wait-sub { color: rgba(255,255,255,0.5); font-size: 14px; }
  .answer-preview { margin-top: 16px; padding: 12px 20px; border-radius: 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); font-size: 15px; color: rgba(255,255,255,0.7); max-width: 350px; text-align: center; word-break: break-word; }
  .wait-countdown { margin-top: 20px; display: flex; flex-direction: column; align-items: center; gap: 8px; }
  .wait-countdown-label { font-size: 12px; color: rgba(255,255,255,0.35); text-transform: uppercase; letter-spacing: 1.5px; font-weight: 600; }
  .wait-countdown-time { font-size: 32px; font-weight: 800; background: linear-gradient(135deg, #818cf8, #c084fc); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .wait-countdown-bar { width: 200px; height: 4px; border-radius: 2px; background: rgba(255,255,255,0.1); overflow: hidden; }
  .wait-countdown-fill { height: 100%; border-radius: 2px; background: linear-gradient(90deg, #818cf8, #c084fc); transition: width 0.25s linear; }

  /* \u2500\u2500 Results \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
  #results { justify-content: flex-start; padding-top: 20px; overflow-y: auto; }

  .results-header { text-align: center; margin-bottom: 20px; position: relative; }
  .results-header h1 { font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 3px; color: rgba(255,255,255,0.4); margin-bottom: 8px; }

  .rank-display { margin-bottom: 6px; }
  .rank-display .rank-icon { font-size: 36px; line-height: 1; display: block; margin-bottom: 4px; }
  .rank-display .rank-text { font-size: 22px; font-weight: 900; letter-spacing: -0.5px; }
  .rank-display .rank-text.top-1 { background: linear-gradient(135deg, #fbbf24, #f59e0b); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .rank-display .rank-text.top-2 { background: linear-gradient(135deg, #818cf8, #6366f1); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .rank-display .rank-text.top-3 { background: linear-gradient(135deg, #f59e0b, #d97706); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .rank-display .rank-text.top-other { color: rgba(255,255,255,0.7); }
  .rank-display .rank-sub { font-size: 13px; color: rgba(255,255,255,0.4); margin-top: 2px; }

  .total-score { font-size: 48px; font-weight: 900; background: linear-gradient(135deg, #fbbf24, #f59e0b); -webkit-background-clip: text; -webkit-text-fill-color: transparent; line-height: 1.1; }
  .total-score-label { font-size: 12px; color: rgba(255,255,255,0.35); text-transform: uppercase; letter-spacing: 2px; margin-top: 2px; }

  .score-glow { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 200px; height: 200px; background: radial-gradient(circle, rgba(251,191,36,0.08) 0%, transparent 70%); pointer-events: none; z-index: -1; }

  .leaderboard { width: 100%; max-width: 440px; margin-top: 12px; }
  .leaderboard-title { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: rgba(255,255,255,0.4); margin-bottom: 8px; padding-left: 4px; }
  .lb-row { display: flex; align-items: center; gap: 10px; padding: 8px 12px; border-radius: 10px; margin-bottom: 4px; background: rgba(255,255,255,0.03); }
  .lb-row.me { background: rgba(99,102,241,0.1); border: 1px solid rgba(99,102,241,0.2); }
  .lb-rank { font-size: 14px; font-weight: 800; min-width: 28px; color: rgba(255,255,255,0.5); }
  .lb-row.lb-rank-1 .lb-rank { color: #fbbf24; }
  .lb-row.lb-rank-2 .lb-rank { color: #818cf8; }
  .lb-row.lb-rank-3 .lb-rank { color: #f59e0b; }
  .lb-addr { flex: 1; font-size: 13px; color: rgba(255,255,255,0.6); overflow: hidden; text-overflow: ellipsis; }
  .lb-score { font-size: 14px; font-weight: 700; color: #fff; }

  /* \u2500\u2500 Question Breakdown (collapsible) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
  .breakdown-toggle { width: 100%; max-width: 440px; margin-top: 16px; padding: 12px 16px; border-radius: 12px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); cursor: pointer; display: flex; align-items: center; justify-content: space-between; color: #fff; font-size: 14px; font-weight: 700; transition: background 0.2s; }
  .breakdown-toggle:hover { background: rgba(255,255,255,0.07); }
  .breakdown-toggle .toggle-label { display: flex; align-items: center; gap: 8px; }
  .breakdown-toggle .toggle-arrow { font-size: 12px; color: rgba(255,255,255,0.4); transition: transform 0.3s ease; }
  .breakdown-toggle.open .toggle-arrow { transform: rotate(180deg); }

  .breakdown-content { width: 100%; max-width: 440px; overflow: hidden; max-height: 0; transition: max-height 0.4s ease; }
  .breakdown-content.open { max-height: 5000px; }
  .breakdown-content-inner { padding-top: 12px; }

  .back-btn { width: 100%; max-width: 440px; margin-top: 20px; padding: 14px 20px; border-radius: 12px; background: linear-gradient(135deg, #818cf8, #6366f1); border: none; color: #fff; font-size: 15px; font-weight: 700; cursor: pointer; transition: opacity 0.2s; }
  .back-btn:hover { opacity: 0.9; }

  .result-card {
    width: 100%; margin-bottom: 12px; padding: 14px 16px; border-radius: 14px;
    background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06);
  }
  .result-card .q-label { font-size: 11px; color: rgba(255,255,255,0.3); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
  .result-card .q-text { font-size: 15px; font-weight: 600; margin-bottom: 10px; line-height: 1.4; }
  .result-card .your-answer { font-size: 13px; color: rgba(255,255,255,0.5); margin-bottom: 8px; }
  .result-card .your-answer strong { color: #fff; }

  .cluster-list { display: flex; flex-direction: column; gap: 5px; }
  .cluster-item { display: flex; align-items: center; gap: 8px; padding: 6px 10px; border-radius: 8px; background: rgba(255,255,255,0.03); }
  .cluster-item.rank-1 { background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.2); }
  .cluster-item.rank-2 { background: rgba(99,102,241,0.08); border: 1px solid rgba(99,102,241,0.15); }
  .cluster-item.rank-3 { background: rgba(245,158,11,0.06); border: 1px solid rgba(245,158,11,0.12); }
  .cluster-bar-wrap { flex: 1; height: 5px; border-radius: 3px; background: rgba(255,255,255,0.08); overflow: hidden; }
  .cluster-bar { height: 100%; border-radius: 3px; background: rgba(255,255,255,0.15); transition: width 0.5s ease; }
  .cluster-item.rank-1 .cluster-bar { background: #22c55e; }
  .cluster-item.rank-2 .cluster-bar { background: #6366f1; }
  .cluster-item.rank-3 .cluster-bar { background: #f59e0b; }
  .cluster-label { font-size: 12px; font-weight: 600; min-width: 80px; }
  .cluster-count { font-size: 11px; color: rgba(255,255,255,0.4); min-width: 24px; text-align: right; }
  .rank-badge { font-size: 9px; padding: 2px 7px; border-radius: 6px; font-weight: 700; text-transform: uppercase; white-space: nowrap; }
  .rank-badge.rank-1 { background: #22c55e; color: #fff; }
  .rank-badge.rank-2 { background: #6366f1; color: #fff; }
  .rank-badge.rank-3 { background: #f59e0b; color: #fff; }
  .rank-badge.rank-4 { background: rgba(255,255,255,0.12); color: rgba(255,255,255,0.6); }
  .rank-badge.rank-5 { background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.4); }
  .xp-label { font-size: 10px; color: rgba(255,255,255,0.35); font-weight: 600; white-space: nowrap; }

  .score-badge { display: inline-flex; align-items: center; gap: 4px; padding: 3px 8px; border-radius: 6px; font-size: 12px; font-weight: 700; margin-top: 6px; }
  .score-badge.win { background: rgba(34,197,94,0.15); color: #22c55e; }
  .score-badge.miss { background: rgba(239,68,68,0.1); color: #ef4444; }
  .score-badge.rank-2 { background: rgba(99,102,241,0.12); color: #818cf8; }
  .score-badge.rank-3 { background: rgba(245,158,11,0.1); color: #f59e0b; }
  .score-badge.rank-low { background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.4); }
</style>
</head>
<body>

<!-- Lobby screen -->
<div id="lobby" class="screen active">
  <div class="pulse-dot" style="margin-bottom:20px"></div>
  <h1>Open Majority</h1>
  <p class="subtitle">Waiting for the game to start...</p>
  <p class="subtitle" style="margin-top:8px" id="lobby-username"></p>
</div>

<!-- Question screen -->
<div id="question" class="screen hidden">
  <div class="question-number" id="q-number">Question 1</div>
  <div class="question-text" id="q-text"></div>
  <img class="question-media" id="q-media" style="display:none" alt="">
  <div class="timer-wrap">
    <div class="timer-bar-bg"><div class="timer-bar" id="timer-bar"></div></div>
    <div class="timer-seconds" id="timer-seconds">30s</div>
  </div>
  <div class="answer-area">
    <input class="answer-input" id="answer-input" type="text" placeholder="Type your answer..." maxlength="100" autocomplete="off" autofocus>
    <button class="submit-btn" id="submit-btn" disabled>Submit Answer</button>
    <div class="char-count" id="char-count">0 / 100</div>
  </div>
</div>

<!-- Waiting screen -->
<div id="waiting" class="screen hidden">
  <div class="check-icon">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
  </div>
  <h2>Answer Submitted!</h2>
  <p class="wait-sub">Waiting for next question...</p>
  <div class="answer-preview" id="answer-preview"></div>
  <div class="wait-countdown" id="wait-countdown" style="display:none">
    <div class="wait-countdown-label" id="wait-countdown-label">Next question in</div>
    <div class="wait-countdown-time" id="wait-countdown-time">0s</div>
    <div class="wait-countdown-bar"><div class="wait-countdown-fill" id="wait-countdown-fill"></div></div>
  </div>
</div>

<!-- Results screen -->
<div id="results" class="screen hidden">
  <div class="results-header">
    <div class="score-glow"></div>
    <h1>Your Score</h1>
    <div class="total-score" id="total-score">0</div>
    <div class="total-score-label">Total XP</div>
    <div class="rank-display" id="rank-display" style="display:none">
      <span class="rank-icon" id="rank-icon"></span>
      <div class="rank-text" id="rank-text"></div>
      <div class="rank-sub" id="rank-sub"></div>
    </div>
  </div>
  <div id="leaderboard" class="leaderboard"></div>
  <div class="breakdown-toggle" id="breakdown-toggle" style="display:none">
    <span class="toggle-label">Question Breakdown</span>
    <span class="toggle-arrow">&#9660;</span>
  </div>
  <div class="breakdown-content" id="breakdown-content">
    <div class="breakdown-content-inner" id="results-list"></div>
  </div>
  <button class="back-btn" id="back-btn" onclick="window.parent.postMessage({type:'NAVIGATE_BACK'},'*')">View Contest</button>
</div>

<script>
(function() {
  // \u2500\u2500 State \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  var state = {
    gameID: null,
    username: null,
    walletAddress: null,
    totalQuestions: 0,
    currentQuestion: null,
    answers: [],
    timerInterval: null,
    timeLeft: 0,
    timerDuration: 0,
    submitted: false
  };

  // \u2500\u2500 Screens \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  var screens = {
    lobby: document.getElementById('lobby'),
    question: document.getElementById('question'),
    waiting: document.getElementById('waiting'),
    results: document.getElementById('results')
  };

  function showScreen(name) {
    for (var k in screens) {
      if (k === name) {
        screens[k].classList.remove('hidden');
        screens[k].classList.add('active');
      } else {
        screens[k].classList.add('hidden');
        screens[k].classList.remove('active');
      }
    }
    if (name === 'question') {
      setTimeout(function() {
        var input = document.getElementById('answer-input');
        if (input) input.focus();
      }, 400);
    }
  }

  // \u2500\u2500 Timer \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  function startTimer(seconds) {
    stopTimer();
    state.timeLeft = seconds;
    state.timerDuration = seconds;
    updateTimerUI();
    state.timerInterval = setInterval(function() {
      state.timeLeft = Math.max(0, state.timeLeft - 0.25);
      updateTimerUI();
      if (state.timeLeft <= 0) {
        stopTimer();
      }
    }, 250);
  }

  function stopTimer() {
    if (state.timerInterval) {
      clearInterval(state.timerInterval);
      state.timerInterval = null;
    }
  }

  function updateTimerUI() {
    var bar = document.getElementById('timer-bar');
    var secs = document.getElementById('timer-seconds');
    var pct = (state.timeLeft / state.timerDuration) * 100;
    bar.style.width = pct + '%';
    var isWarning = state.timeLeft <= 5;
    bar.className = 'timer-bar' + (isWarning ? ' warning' : '');
    secs.className = 'timer-seconds' + (isWarning ? ' warning' : '');
    secs.textContent = Math.ceil(state.timeLeft) + 's';

    // Update waiting screen countdown if visible
    var waitCountdown = document.getElementById('wait-countdown');
    var waitTime = document.getElementById('wait-countdown-time');
    var waitFill = document.getElementById('wait-countdown-fill');
    if (state.submitted && state.timeLeft > 0) {
      waitCountdown.style.display = 'flex';
      waitTime.textContent = Math.ceil(state.timeLeft) + 's';
      waitFill.style.width = pct + '%';
    } else {
      waitCountdown.style.display = 'none';
    }
  }

  // \u2500\u2500 Submit answer \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  function submitAnswer() {
    var input = document.getElementById('answer-input');
    var text = (input.value || '').trim();
    if (!text || state.submitted || !state.currentQuestion) return;

    state.submitted = true;
    var now = Date.now();
    var answer = {
      questionId: state.currentQuestion.questionId,
      answerText: text,
      submittedAt: now
    };
    state.answers.push(answer);

    // Tell parent
    postMsg({ type: 'ANSWER_SUBMIT', questionId: answer.questionId, answerText: answer.answerText, submittedAt: answer.submittedAt });

    // Show waiting screen with answer preview (keep timer running for countdown)
    document.getElementById('answer-preview').textContent = '"' + text + '"';
    var isLast = state.currentQuestion && state.totalQuestions && (state.currentQuestion.orderIndex + 1) >= state.totalQuestions;
    document.getElementById('wait-countdown-label').textContent = isLast ? 'Game ends in' : 'Next question in';
    document.querySelector('#waiting .wait-sub').textContent = isLast ? 'Waiting for game to end...' : 'Waiting for next question...';
    showScreen('waiting');
  }

  // \u2500\u2500 Input handlers \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  var answerInput = document.getElementById('answer-input');
  var submitBtn = document.getElementById('submit-btn');
  var charCount = document.getElementById('char-count');

  answerInput.addEventListener('input', function() {
    var len = answerInput.value.length;
    charCount.textContent = len + ' / 100';
    submitBtn.disabled = len === 0 || state.submitted;
  });

  answerInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !submitBtn.disabled) {
      e.preventDefault();
      submitAnswer();
    }
  });

  submitBtn.addEventListener('click', submitAnswer);

  // \u2500\u2500 Render results \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  var RANK_LABELS = { 1: '1st', 2: '2nd', 3: '3rd', 4: '4th', 5: '5th' };
  var RANK_XP = { 1: 100, 2: 80, 3: 65, 4: 50, 5: 30 };

  function renderResults(data) {
    document.getElementById('total-score').textContent = (data.totalScore || 0) + ' XP';

    // Player rank
    var scores = data.scores || [];
    var myRank = null;
    for (var si = 0; si < scores.length; si++) {
      if (scores[si].rank && scores[si].userAddress === state.walletAddress) {
        myRank = scores[si].rank;
        break;
      }
    }

    var rankDisplay = document.getElementById('rank-display');
    if (myRank) {
      rankDisplay.style.display = 'block';
      var rankIcons = { 1: '\\u{1F3C6}', 2: '\\u{1F948}', 3: '\\u{1F949}' };
      document.getElementById('rank-icon').textContent = rankIcons[myRank] || '';
      var rankTextEl = document.getElementById('rank-text');
      rankTextEl.textContent = (RANK_LABELS[myRank] || '#' + myRank) + ' Place';
      rankTextEl.className = 'rank-text top-' + (myRank <= 3 ? myRank : 'other');
      document.getElementById('rank-sub').textContent = 'out of ' + scores.length + ' players';
    }

    // Leaderboard
    var lbContainer = document.getElementById('leaderboard');
    lbContainer.innerHTML = '';
    if (scores.length > 0) {
      var title = document.createElement('div');
      title.className = 'leaderboard-title';
      title.textContent = 'Leaderboard';
      lbContainer.appendChild(title);
      scores.forEach(function(s) {
        var row = document.createElement('div');
        var rowClasses = 'lb-row';
        if (s.userAddress === state.walletAddress) rowClasses += ' me';
        if (s.rank <= 3) rowClasses += ' lb-rank-' + s.rank;
        row.className = rowClasses;
        var rk = document.createElement('span');
        rk.className = 'lb-rank';
        rk.textContent = '#' + s.rank;
        row.appendChild(rk);
        var addr = document.createElement('span');
        addr.className = 'lb-addr';
        addr.textContent = s.userAddress === state.walletAddress ? 'You' : (s.userAddress.slice(0, 6) + '...' + s.userAddress.slice(-4));
        row.appendChild(addr);
        var sc = document.createElement('span');
        sc.className = 'lb-score';
        sc.textContent = s.totalScore + ' XP';
        row.appendChild(sc);
        lbContainer.appendChild(row);
      });
    }

    // Question breakdown toggle
    var questions = data.questions || [];
    var toggleBtn = document.getElementById('breakdown-toggle');
    var breakdownContent = document.getElementById('breakdown-content');
    if (questions.length > 0) {
      toggleBtn.style.display = 'flex';
      toggleBtn.onclick = function() {
        toggleBtn.classList.toggle('open');
        breakdownContent.classList.toggle('open');
      };
    }

    var list = document.getElementById('results-list');
    list.innerHTML = '';

    var questions = data.questions || [];
    var maxCount = 1;
    questions.forEach(function(q) {
      (q.clusters || []).forEach(function(c) { if (c.count > maxCount) maxCount = c.count; });
    });

    questions.forEach(function(q) {
      var card = document.createElement('div');
      card.className = 'result-card';

      var label = document.createElement('div');
      label.className = 'q-label';
      label.textContent = 'Question ' + (q.orderIndex + 1);
      card.appendChild(label);

      var txt = document.createElement('div');
      txt.className = 'q-text';
      txt.textContent = q.questionText;
      card.appendChild(txt);

      if (q.userAnswer) {
        var ans = document.createElement('div');
        ans.className = 'your-answer';
        ans.innerHTML = 'Your answer: <strong>' + escHtml(q.userAnswer) + '</strong>';
        card.appendChild(ans);
      }

      // Clusters \u2014 already sorted by rank from server
      var cl = document.createElement('div');
      cl.className = 'cluster-list';
      (q.clusters || []).forEach(function(c) {
        var rank = c.rank || 99;
        var item = document.createElement('div');
        item.className = 'cluster-item' + (rank <= 3 ? ' rank-' + rank : '');

        // Rank badge
        if (rank <= 5) {
          var rb = document.createElement('span');
          rb.className = 'rank-badge rank-' + rank;
          rb.textContent = RANK_LABELS[rank] || '#' + rank;
          item.appendChild(rb);
        }

        var lbl = document.createElement('span');
        lbl.className = 'cluster-label';
        lbl.textContent = c.canonicalAnswer;
        item.appendChild(lbl);

        // XP label
        var xp = RANK_XP[rank];
        if (xp) {
          var xpEl = document.createElement('span');
          xpEl.className = 'xp-label';
          xpEl.textContent = '+' + xp + ' XP';
          item.appendChild(xpEl);
        }

        var bw = document.createElement('div');
        bw.className = 'cluster-bar-wrap';
        var b = document.createElement('div');
        b.className = 'cluster-bar';
        b.style.width = (c.count / maxCount * 100) + '%';
        bw.appendChild(b);
        item.appendChild(bw);

        var cnt = document.createElement('span');
        cnt.className = 'cluster-count';
        cnt.textContent = c.count;
        item.appendChild(cnt);

        cl.appendChild(item);
      });
      card.appendChild(cl);

      // Score badge for this question
      var badge = document.createElement('div');
      badge.className = 'score-badge';
      if (q.userScore >= 100) {
        badge.className += ' win';
        badge.textContent = '+' + q.userScore + ' XP \u2014 Majority answer!';
      } else if (q.userScore >= 65) {
        badge.className += ' rank-2';
        badge.textContent = '+' + q.userScore + ' XP \u2014 ' + (q.userScore === 80 ? '2nd' : '3rd') + ' most popular';
      } else if (q.userScore > 0) {
        badge.className += ' rank-low';
        badge.textContent = '+' + q.userScore + ' XP';
      } else if (q.userAnswer) {
        badge.className += ' miss';
        badge.textContent = '0 XP \u2014 Not in top 5';
      } else {
        badge.className += ' miss';
        badge.textContent = '0 XP \u2014 No answer';
      }
      card.appendChild(badge);

      list.appendChild(card);
    });
  }

  function escHtml(s) {
    var d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  // \u2500\u2500 PostMessage \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  function postMsg(data) {
    if (window.parent !== window) {
      window.parent.postMessage(data, '*');
    }
  }

  window.addEventListener('message', function(event) {
    var msg = event.data;
    if (!msg || !msg.type) return;

    switch (msg.type) {
      case 'CONTEST_CONFIG':
        state.gameID = msg.gameID;
        state.username = msg.username;
        state.walletAddress = msg.walletAddress;
        document.getElementById('lobby-username').textContent = msg.username ? 'Playing as ' + msg.username : '';
        postMsg({ type: 'SESSION_START' });
        break;

      case 'GAME_START':
        state.totalQuestions = msg.totalQuestions || 0;
        break;

      case 'QUESTION_REVEAL':
        state.currentQuestion = msg;
        state.submitted = false;
        // Reset input
        answerInput.value = '';
        answerInput.disabled = false;
        submitBtn.disabled = true;
        charCount.textContent = '0 / 100';
        // Update UI
        document.getElementById('q-number').textContent = 'Question ' + (msg.orderIndex + 1) + (state.totalQuestions ? ' of ' + state.totalQuestions : '');
        document.getElementById('q-text').textContent = msg.text;
        var media = document.getElementById('q-media');
        if (msg.mediaUrl) { media.src = msg.mediaUrl; media.style.display = 'block'; }
        else { media.style.display = 'none'; }
        // Start timer
        startTimer(msg.timerSeconds);
        showScreen('question');
        break;

      case 'QUESTION_CLOSED':
        stopTimer();
        if (!state.submitted && state.currentQuestion) {
          // Didn't answer in time \u2014 show waiting
          var isLastQ = state.currentQuestion && state.totalQuestions && (state.currentQuestion.orderIndex + 1) >= state.totalQuestions;
          document.querySelector('#waiting .wait-sub').textContent = isLastQ ? 'Waiting for game to end...' : 'Waiting for next question...';
          document.getElementById('answer-preview').textContent = '(No answer submitted)';
          showScreen('waiting');
        }
        // Disable input
        answerInput.disabled = true;
        submitBtn.disabled = true;
        break;

      case 'GAME_ENDED':
        stopTimer();
        // Send session end
        postMsg({
          type: 'SESSION_END',
          answers: state.answers,
          totalQuestions: state.totalQuestions,
          answeredCount: state.answers.length
        });
        // Show waiting for results
        showScreen('waiting');
        document.getElementById('answer-preview').textContent = 'Calculating results...';
        document.querySelector('#waiting h2').textContent = 'Game Over!';
        document.querySelector('#waiting .wait-sub').textContent = 'AI is judging answers...';
        break;

      case 'RESULTS':
        renderResults(msg);
        showScreen('results');
        break;
    }
  });
})();
</script>
</body>
</html>`;
export {
  openMajorityGameHtml
};
