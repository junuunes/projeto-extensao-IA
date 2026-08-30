(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ========================================================================
     Menu mobile
     ======================================================================== */
  var navToggle = document.getElementById('navToggle');
  var mainNav = document.getElementById('mainNav');

  function closeNav() {
    mainNav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  }

  function toggleNav() {
    var isOpen = mainNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  }

  navToggle.addEventListener('click', toggleNav);

  mainNav.addEventListener('click', function (event) {
    if (event.target.closest('a')) {
      closeNav();
    }
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && mainNav.classList.contains('is-open')) {
      closeNav();
      navToggle.focus();
    }
  });

  /* ========================================================================
     Scroll suave para links de âncora (fallback + botões data-scroll)
     ======================================================================== */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (event) {
      var targetId = link.getAttribute('href');
      if (targetId.length <= 1) return;
      var target = document.querySelector(targetId);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    });
  });

  /* ========================================================================
     Barra de progresso de leitura
     ======================================================================== */
  var progressBar = document.getElementById('progressBar');

  function updateProgressBar() {
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = percent + '%';
  }

  window.addEventListener('scroll', updateProgressBar, { passive: true });
  updateProgressBar();

  /* ========================================================================
     Revelar elementos ao rolar (IntersectionObserver)
     ======================================================================== */
  var revealTargets = document.querySelectorAll(
    '.capability-card, .everyday-card, .mini-card, .benefit-card, .risk-card, ' +
    '.ethics-card, .scenario-card, .checklist-item, .example-box, .callout, ' +
    '.flow-diagram, .alert-box, .quiz-box'
  );

  revealTargets.forEach(function (el) { el.classList.add('reveal'); });

  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealTargets.forEach(function (el) { observer.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ========================================================================
     "Você faria isso?" - cenários interativos
     ======================================================================== */
  document.querySelectorAll('.scenario-card').forEach(function (card) {
    var buttons = card.querySelectorAll('[data-answer]');
    var feedback = card.querySelector('.scenario-feedback');

    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        buttons.forEach(function (b) { b.classList.remove('is-selected'); });
        button.classList.add('is-selected');
        buttons.forEach(function (b) { b.setAttribute('aria-pressed', String(b === button)); });
        feedback.hidden = false;
      });
    });
  });

  /* ========================================================================
     Checklist de uso consciente (não persiste nada)
     ======================================================================== */
  document.querySelectorAll('.checklist-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var pressed = btn.getAttribute('aria-pressed') === 'true';
      btn.setAttribute('aria-pressed', String(!pressed));
    });
  });

  /* ========================================================================
     Placeholder do Google Forms - aviso amigável no console
     ======================================================================== */
  var feedbackLink = document.getElementById('feedbackLink');
  var GOOGLE_FORMS_URL = '#INSERIR_LINK_GOOGLE_FORMS';

  if (feedbackLink && feedbackLink.getAttribute('href') === GOOGLE_FORMS_URL) {
    feedbackLink.addEventListener('click', function (event) {
      event.preventDefault();
      window.alert('O link do formulário de feedback ainda não foi configurado. Substitua o placeholder GOOGLE_FORMS_URL pelo link real do Google Forms.');
    });
  }

  /* ========================================================================
     Quiz interativo - 6 perguntas
     ======================================================================== */
  var QUIZ_QUESTIONS = [
    {
      topic: 'Funcionamento básico da IA',
      question: 'Como a Inteligência Artificial aprende a reconhecer padrões, como identificar gatos em fotos?',
      options: [
        'Ela segue uma lista fixa de regras escritas por um programador para cada imagem.',
        'Ela analisa milhares ou milhões de exemplos até identificar características em comum.',
        'Ela pergunta diretamente para uma pessoa qual é o resultado correto.',
        'Ela copia respostas prontas de um banco de dados de imagens.'
      ],
      correctIndex: 1,
      explanation: 'A IA aprende analisando grandes quantidades de dados (como imagens com e sem gatos) até identificar características comuns, como formato das orelhas e dos olhos. É um processo de treinamento baseado em padrões, não em regras fixas ou respostas prontas.'
    },
    {
      topic: 'Alucinação e verificação de informações',
      question: 'Uma ferramenta de IA Generativa responde a uma pergunta de forma muito confiante e bem escrita. O que isso garante?',
      options: [
        'Garante que a informação está correta, já que a IA nunca erra.',
        'Garante apenas que o texto foi bem formatado, mas não garante que seja verdadeiro.',
        'Garante que a resposta foi verificada por especialistas humanos.',
        'Garante que a informação é mais confiável do que uma fonte científica.'
      ],
      correctIndex: 1,
      explanation: 'Uma resposta convincente não é necessariamente verdadeira. Ferramentas de IA Generativa podem produzir informações incorretas ou inexistentes de forma muito convincente — esse fenômeno é chamado de "alucinação da IA". Por isso, é importante verificar as respostas em fontes confiáveis.'
    },
    {
      topic: 'Proteção de dados pessoais',
      question: 'Você precisa tirar uma dúvida rápida sobre um contrato de trabalho. Qual é a atitude mais segura ao usar uma ferramenta pública de IA?',
      options: [
        'Enviar o contrato completo, incluindo cláusulas confidenciais.',
        'Enviar apenas o CPF e os dados bancários mencionados no contrato.',
        'Evitar enviar documentos sigilosos e, se necessário, perguntar de forma genérica, sem dados confidenciais.',
        'Enviar o documento inteiro, pois ferramentas de IA nunca armazenam informações.'
      ],
      correctIndex: 2,
      explanation: 'Antes de compartilhar qualquer informação com uma ferramenta de IA, é preciso avaliar se ela é realmente necessária. Dados sigilosos, senhas, informações bancárias e documentos confidenciais não devem ser inseridos sem conhecer a política de privacidade da plataforma.'
    },
    {
      topic: 'Fake news e deepfakes',
      question: 'Por que os deepfakes são considerados um risco relacionado à Inteligência Artificial?',
      options: [
        'Porque eles deixam os vídeos com qualidade de imagem pior.',
        'Porque podem simular pessoas reais dizendo ou fazendo coisas que nunca aconteceram, sendo usados em fraudes e desinformação.',
        'Porque só podem ser criados por grandes empresas de tecnologia.',
        'Porque são fáceis de identificar em qualquer situação.'
      ],
      correctIndex: 1,
      explanation: 'Deepfakes são vídeos ou áudios manipulados digitalmente que podem simular pessoas reais dizendo ou fazendo algo que nunca ocorreu. Essa tecnologia pode ser usada para fraudes, golpes, desinformação e danos à reputação, dificultando distinguir o real do falso.'
    },
    {
      topic: 'Ética e responsabilidade',
      question: 'Uma empresa toma uma decisão automatizada com apoio de um sistema de IA e ela causa um prejuízo. De quem é a responsabilidade?',
      options: [
        'Da própria IA, já que ela tomou a decisão sozinha.',
        'De nenhum dos envolvidos, pois é uma falha "natural" da tecnologia.',
        'Da empresa e dos desenvolvedores, que continuam responsáveis pelas decisões tomadas com apoio da IA.',
        'Do usuário final que apenas recebeu o resultado da decisão.'
      ],
      correctIndex: 2,
      explanation: 'O princípio da responsabilidade estabelece que empresas, desenvolvedores e organizações continuam responsáveis pelas decisões tomadas com apoio da IA. A tecnologia não assume essa responsabilidade — ela continua sendo das pessoas e organizações envolvidas.'
    },
    {
      topic: 'Boas práticas de uso consciente',
      question: 'Qual das alternativas representa uma boa prática de uso consciente da Inteligência Artificial?',
      options: [
        'Aceitar qualquer resposta gerada pela IA sem verificar, pois ela é sempre neutra.',
        'Usar a IA para substituir completamente a análise e o julgamento humano.',
        'Verificar as informações em fontes confiáveis e usar a IA como apoio, não como substituta do pensamento crítico.',
        'Compartilhar qualquer dado pessoal, já que as ferramentas de IA são seguras por padrão.'
      ],
      correctIndex: 2,
      explanation: 'O uso consciente envolve verificar a veracidade das informações, confirmar fontes confiáveis e utilizar a IA como ferramenta de apoio às atividades humanas — sem substituir o pensamento crítico, a análise e a responsabilidade individual.'
    }
  ];

  var quizState = {
    currentIndex: 0,
    score: 0,
    answered: false
  };

  var quizBox = document.getElementById('quizBox');
  var quizQuestionEl = document.getElementById('quizQuestion');
  var quizStatusEl = document.getElementById('quizStatus');
  var quizProgressBar = document.getElementById('quizProgressBar');
  var quizNextBtn = document.getElementById('quizNextBtn');
  var quizResultEl = document.getElementById('quizResult');
  var quizScoreEl = document.getElementById('quizScore');
  var quizMessageEl = document.getElementById('quizMessage');
  var quizRestartBtn = document.getElementById('quizRestartBtn');

  var OPTION_LETTERS = ['A', 'B', 'C', 'D'];

  function renderQuestion() {
    var q = QUIZ_QUESTIONS[quizState.currentIndex];
    quizState.answered = false;
    quizNextBtn.disabled = true;
    quizNextBtn.textContent = quizState.currentIndex === QUIZ_QUESTIONS.length - 1
      ? 'Ver resultado'
      : 'Próxima pergunta';

    quizStatusEl.textContent = 'Pergunta ' + (quizState.currentIndex + 1) + ' de ' + QUIZ_QUESTIONS.length;
    quizProgressBar.style.width = (((quizState.currentIndex + 1) / QUIZ_QUESTIONS.length) * 100) + '%';

    var html = '';
    html += '<h3 class="quiz-question-title">' + escapeHtml(q.question) + '</h3>';
    html += '<ul class="quiz-options" role="list">';
    q.options.forEach(function (optionText, index) {
      html += '<li>' +
        '<button type="button" class="quiz-option" data-index="' + index + '">' +
        '<span class="option-letter">' + OPTION_LETTERS[index] + '</span>' +
        '<span>' + escapeHtml(optionText) + '</span>' +
        '</button>' +
        '</li>';
    });
    html += '</ul>';
    html += '<div class="quiz-explanation-wrap" id="quizExplanationWrap" hidden>' +
      '<div class="quiz-explanation" role="status"></div>' +
      '</div>';

    quizQuestionEl.innerHTML = html;

    var optionButtons = quizQuestionEl.querySelectorAll('.quiz-option');
    optionButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        handleAnswer(parseInt(button.getAttribute('data-index'), 10), optionButtons);
      });
    });
  }

  function handleAnswer(selectedIndex, optionButtons) {
    if (quizState.answered) return;
    quizState.answered = true;

    var q = QUIZ_QUESTIONS[quizState.currentIndex];
    var isCorrect = selectedIndex === q.correctIndex;
    if (isCorrect) quizState.score += 1;

    optionButtons.forEach(function (button, index) {
      button.disabled = true;
      if (index === q.correctIndex) {
        button.classList.add('is-correct');
        button.insertAdjacentHTML('beforeend', '<span class="quiz-option-tag">Correta</span>');
      } else if (index === selectedIndex) {
        button.classList.add('is-wrong');
        button.insertAdjacentHTML('beforeend', '<span class="quiz-option-tag">Sua resposta</span>');
      } else {
        button.classList.add('is-muted');
      }
    });

    var explanationWrap = document.getElementById('quizExplanationWrap');
    var explanationBox = explanationWrap.querySelector('.quiz-explanation');
    var prefix = isCorrect ? 'Correto! ' : 'Não é essa. ';
    explanationBox.innerHTML = '<strong>' + prefix + '</strong>' + escapeHtml(q.explanation);
    explanationWrap.hidden = false;

    quizNextBtn.disabled = false;
    quizNextBtn.focus();
  }

  function goToNextQuestion() {
    if (quizState.currentIndex < QUIZ_QUESTIONS.length - 1) {
      quizState.currentIndex += 1;
      renderQuestion();
      quizBox.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
    } else {
      showResult();
    }
  }

  function showResult() {
    quizBox.hidden = true;
    quizResultEl.hidden = false;

    var score = quizState.score;
    quizScoreEl.textContent = 'Você acertou ' + score + ' de ' + QUIZ_QUESTIONS.length + ' questões.';

    var message;
    if (score >= 5) {
      message = 'Excelente! Você demonstra bons conhecimentos sobre o uso consciente e seguro da Inteligência Artificial.';
    } else if (score >= 3) {
      message = 'Bom resultado! Você já conhece importantes cuidados, mas ainda existem alguns pontos que vale revisar.';
    } else {
      message = 'Este é um ótimo momento para revisar algumas das orientações da página. Quanto mais conhecemos a tecnologia, mais seguros podemos utilizá-la.';
    }
    quizMessageEl.textContent = message;
    quizResultEl.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
  }

  function restartQuiz() {
    quizState.currentIndex = 0;
    quizState.score = 0;
    quizState.answered = false;
    quizResultEl.hidden = true;
    quizBox.hidden = false;
    renderQuestion();
    quizBox.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  quizNextBtn.addEventListener('click', goToNextQuestion);
  quizRestartBtn.addEventListener('click', restartQuiz);

  renderQuestion();

})();
