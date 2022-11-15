$(document).ready(function () {
  var currentQuestion;
  var interval;
  var timeLeft = 10;
  var score = 0;
  var highScore = 0;

  var updateTimeLeft = function (amount) {
    timeLeft += amount;
    $('#time-left').text(timeLeft);
  };

  var updateScore = function (amount) {
    score += amount;
    $('#current-score').text(score);
    if (score > highScore) {
      highScore = score;
      $('#high-score').text(highScore);
    }
  };

  var startGame = function () {
    if (!interval) {
      if (timeLeft === 0) {
        updateTimeLeft(10);
        updateScore(-score);
      }
      interval = setInterval(function () {
        updateTimeLeft(-1);
        if (timeLeft === 0) {
          clearInterval(interval);
          interval = undefined;
        }
      }, 1000);
    }
  };

  var randomNumberGenerator = function (size) {
    return Math.ceil(Math.random() * size);
  };

  var questionGenerator = function () {
    var question = {};
    var operate = [];

    if ($('#plus').prop('checked')) {
      operate.push('+')
    }
    if ($('#minus').prop('checked')) {
      operate.push('−')
    }
    if ($('#times').prop('checked')) {
      operate.push('×')
    }
    if ($('#divide').prop('checked')) {
      operate.push('÷')
    }

    var operator = operate[Math.floor(Math.random() * operate.length)];

    var num1 = randomNumberGenerator($('#num-limit').val());
    var num2 = randomNumberGenerator($('#num-limit').val());

    if (operator === '−') {
      if (num1 <= num2) {
        return questionGenerator();
      }
    }

    if (operator === "÷") {
      if(num1 % num2 !== 0 || num1 <= num2 || num2 === 1) {
        return questionGenerator();
      }
    }

    question.equation = String(num1) + " " + operator + " " + String(num2);

    switch (operator) {
      case "+":
        question.answer = num1 + num2;
        break;
      case "−":
        question.answer = num1 - num2;
        break;
      case "×":
        question.answer = num1 * num2;
        break;
      case "÷":
        question.answer = num1 / num2;
        break;
    }
    return question;
  };

  var renderNewQuestion = function () {
    currentQuestion = questionGenerator();
    $('#equation').text(currentQuestion.equation);
  };

  var checkAnswer = function (userInput, answer) {
    if (userInput === answer) {
      renderNewQuestion();
      $('#user-input').val('');
      updateTimeLeft(+1);
      updateScore(+1);
    }
  };

  $('#user-input').on('keyup', function () {
    startGame();
    checkAnswer(Number($(this).val()), currentQuestion.answer);
  });

  $('#reset').on('click', function () {
    renderNewQuestion();
    clearInterval(interval);
    interval = undefined;
    updateTimeLeft(10 - timeLeft);
  });

  $('#start').on('click', function () {
    renderNewQuestion();
    startGame();
    checkAnswer(Number($(this).val()), currentQuestion.answer);
  });

  renderNewQuestion();
});