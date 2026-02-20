export type {
  ParentToGameMessage,
  GameToParentMessage,
  ContestConfigMessage,
  GameStartMessage,
  QuestionRevealMessage,
  QuestionClosedMessage,
  GameEndedMessage,
  ResultsMessage,
  SessionStartMessage,
  AnswerSubmitMessage,
  SessionEndMessage,
} from "./types";

export const openMajorityGameHtml = `<!DOCTYPE html>
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

  /* ── Shared ─────────────────────────────────────────────────────── */
  .screen { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 24px; transition: opacity 0.35s ease, transform 0.35s ease; }
  .screen.hidden { opacity: 0; pointer-events: none; transform: translateY(20px); }
  .screen.active { opacity: 1; pointer-events: auto; transform: translateY(0); }

  .badge { display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }

  /* ── Lobby ──────────────────────────────────────────────────────── */
  #lobby .pulse-dot { width: 10px; height: 10px; border-radius: 50%; background: #22c55e; animation: pulse 1.5s ease infinite; }
  @keyframes pulse { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.3); } }
  #lobby h1 { font-size: 28px; font-weight: 800; background: linear-gradient(135deg, #818cf8, #c084fc); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 8px; }
  #lobby .subtitle { color: rgba(255,255,255,0.5); font-size: 14px; }

  /* ── Question ──────────────────────────────────────────────────── */
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

  /* ── Waiting ───────────────────────────────────────────────────── */
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

  /* ── Results ────────────────────────────────────────────────────── */
  #results { justify-content: flex-start; padding-top: 24px; overflow-y: auto; }
  .results-header { text-align: center; margin-bottom: 24px; }
  .results-header h1 { font-size: 26px; font-weight: 800; margin-bottom: 4px; }
  .total-score { font-size: 40px; font-weight: 900; background: linear-gradient(135deg, #fbbf24, #f59e0b); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .total-score-label { font-size: 13px; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 2px; }

  .result-card {
    width: 100%; max-width: 440px; margin-bottom: 16px; padding: 16px 20px; border-radius: 16px;
    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
  }
  .result-card .q-label { font-size: 12px; color: rgba(255,255,255,0.35); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; }
  .result-card .q-text { font-size: 16px; font-weight: 600; margin-bottom: 12px; }
  .result-card .your-answer { font-size: 14px; color: rgba(255,255,255,0.6); margin-bottom: 10px; }
  .result-card .your-answer strong { color: #fff; }

  .cluster-list { display: flex; flex-direction: column; gap: 6px; }
  .cluster-item { display: flex; align-items: center; gap: 10px; padding: 8px 12px; border-radius: 10px; background: rgba(255,255,255,0.03); }
  .cluster-item.majority { background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.2); }
  .cluster-bar-wrap { flex: 1; height: 6px; border-radius: 3px; background: rgba(255,255,255,0.08); overflow: hidden; }
  .cluster-bar { height: 100%; border-radius: 3px; background: rgba(255,255,255,0.25); transition: width 0.5s ease; }
  .cluster-item.majority .cluster-bar { background: #22c55e; }
  .cluster-label { font-size: 13px; font-weight: 600; min-width: 100px; }
  .cluster-count { font-size: 12px; color: rgba(255,255,255,0.4); min-width: 30px; text-align: right; }
  .majority-badge { font-size: 10px; background: #22c55e; color: #fff; padding: 2px 8px; border-radius: 8px; font-weight: 700; text-transform: uppercase; }

  .score-badge { display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; border-radius: 8px; font-size: 13px; font-weight: 700; margin-top: 8px; }
  .score-badge.win { background: rgba(34,197,94,0.15); color: #22c55e; }
  .score-badge.miss { background: rgba(239,68,68,0.1); color: #ef4444; }
  .score-badge.partial { background: rgba(245,158,11,0.1); color: #f59e0b; }
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
    <h1>Game Over</h1>
    <div class="total-score" id="total-score">0</div>
    <div class="total-score-label">Total Score</div>
  </div>
  <div id="results-list"></div>
</div>

<script>
(function() {
  // ── State ─────────────────────────────────────────────────────────
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

  // ── Screens ───────────────────────────────────────────────────────
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

  // ── Timer ─────────────────────────────────────────────────────────
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

  // ── Submit answer ─────────────────────────────────────────────────
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

  // ── Input handlers ────────────────────────────────────────────────
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

  // ── Render results ────────────────────────────────────────────────
  function renderResults(data) {
    document.getElementById('total-score').textContent = data.totalScore;
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

      // Clusters
      var cl = document.createElement('div');
      cl.className = 'cluster-list';
      (q.clusters || []).sort(function(a,b) { return b.count - a.count; }).forEach(function(c) {
        var item = document.createElement('div');
        item.className = 'cluster-item' + (c.isMajority ? ' majority' : '');

        var lbl = document.createElement('span');
        lbl.className = 'cluster-label';
        lbl.textContent = c.canonicalAnswer;
        item.appendChild(lbl);

        if (c.isMajority) {
          var mb = document.createElement('span');
          mb.className = 'majority-badge';
          mb.textContent = 'majority';
          item.appendChild(mb);
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

      // Score badge
      var badge = document.createElement('div');
      badge.className = 'score-badge';
      if (q.userScore >= 100) {
        badge.className += ' win';
        badge.textContent = '+' + q.userScore + ' pts — In the majority!';
      } else if (q.userScore > 0) {
        badge.className += ' partial';
        badge.textContent = '+' + q.userScore + ' pt — Answered';
      } else if (q.userAnswer) {
        badge.className += ' miss';
        badge.textContent = '0 pts — Not in majority';
      } else {
        badge.className += ' miss';
        badge.textContent = '0 pts — No answer';
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

  // ── PostMessage ───────────────────────────────────────────────────
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
          // Didn't answer in time — show waiting
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
