let problem;
let step = 0;
let feedback = "";
let nextButton;
let prevButton;
let problemDiv;
let mathJaxLoaded = false; // Flag per verificare se MathJax è caricato

function preload() {
  // Puoi aggiungere qui eventuali caricamenti di risorse (immagini, ecc.)
}

function setup() {
  createCanvas(600, 100);
  textFont('Arial');
  textSize(16);
  textAlign(LEFT, TOP);

  generateProblem();
  console.log("Oggetto problem generato in setup:", problem);

  prevButton = createButton('Indietro');
  prevButton.position(20, 550);
  prevButton.mousePressed(prevStep);
  prevButton.attribute('disabled', true); // Inizialmente disabilitato

  nextButton = createButton('Avanti');
  nextButton.position(100, 550);
  nextButton.mousePressed(nextStep);

  problemDiv = select('#problem-container');
  console.log("Elemento problemDiv selezionato:", problemDiv);

  // Forza il typesetting di MathJax all'inizio
  if (typeof MathJax !== 'undefined') {
    MathJax.typesetPromise()
      .then(() => {
        mathJaxLoaded = true;
        console.log("MathJax caricato e typesetting iniziale completato.");
        renderProblem(); // Forza il primo rendering dopo il caricamento
      })
      .catch(err => console.error("Errore durante il typesetting iniziale di MathJax:", err));
  } else {
    console.warn("MathJax non rilevato all'inizializzazione.");
    renderProblem(); // Tenta comunque il rendering senza MathJax
  }
}

function draw() {
  background(240);
  console.log("draw() chiamato. Step:", step);

  if (!problem) {
    if (problemDiv) problemDiv.html("Errore nel caricamento del problema.");
    return;
  }

  // La visualizzazione principale ora avviene in renderProblem()
}

function renderProblem() {
  if (!problemDiv) return;

  let displayText = "Problema:<br>" + problem.text + "<br><br>";

  if (step === 1) {
    displayText += "Passo 1: Formalizzazione dei dati<br>" + problem.formalizeDataFormatted;
  } else if (step === 2) {
    displayText += "Passo 2: Equazioni risolutive<br>" + problem.equations;
  } else if (step === 3) {
    displayText += "Passo 3: Incognita e termini noti<br>" + problem.unknownKnown;
  } else if (step === 4) {
    displayText += "Passo 4: Risoluzione letterale<br>" + problem.literalSolutionFormatted;
  } else if (step === 5) {
    displayText += "Passo 5: Calcolo numerico<br>" + problem.finalCalculationPrompt + "<br>Risultato finale: $" + problem.correctAnswers[5] + "$";
    nextButton.attribute('disabled', true);
  } else {
    nextButton.removeAttribute('disabled');
    displayText += "Premi il pulsante 'Avanti' per visualizzare la risoluzione passo dopo passo.";
  }

  displayText += "<br><br>" + feedback;
  problemDiv.html(displayText);

  // Aggiorna lo stato del pulsante "Indietro"
  if (step > 0) {
    prevButton.removeAttribute('disabled');
  } else {
    prevButton.attribute('disabled', true);
  }

  if (typeof MathJax !== 'undefined') {
    MathJax.typesetPromise()
      .then(() => {
        if (problemDiv && problemDiv.elt) {
          const divHeight = problemDiv.elt.offsetHeight;
          resizeCanvas(600, divHeight + 100);
          prevButton.position(20, divHeight + 60);
          nextButton.position(100, divHeight + 60);
        }
      })
      .catch(err => console.error("Errore durante la tipografia MathJax (renderProblem):", err));
  } else {
    renderProblemFallback();
  }
}

function renderProblemFallback() {
  if (!problemDiv) return;

  let displayText = "Problema:\n" + problem.text.replace(/\$/g, '') + "\n\n";

  if (step === 1) {
    displayText += "Passo 1: Formalizzazione dei dati\n" + problem.formalizeDataFormatted.replace(/- /g, '\n- ');
  } else if (step === 2) {
    displayText += "Passo 2: Equazioni risolutive\n" + problem.equations.replace(/\$/g, '');
  } else if (step === 3) {
    displayText += "Passo 3: Incognita e termini noti\n" + problem.unknownKnown.replace(/\$/g, '');
  } else if (step === 4) {
    displayText += "Passo 4: Risoluzione letterale\n" + problem.literalSolutionFormatted.replace(/\$/g, '').replace(/\\implies /g, '=> ');
  } else if (step === 5) {
    displayText += "Passo 5: Calcolo numerico\n" + problem.finalCalculationPrompt.replace(/\$/g, '') + "\nRisultato finale: " + problem.correctAnswers[5].replace(/\$/g, '');
    nextButton.attribute('disabled', true);
  } else {
    nextButton.removeAttribute('disabled');
    displayText += "Premi il pulsante 'Avanti' per visualizzare la risoluzione passo dopo passo.";
  }

  displayText += "\n\n" + feedback;
  problemDiv.html(`<pre>${displayText}</pre>`);
  if (problemDiv && problemDiv.elt) {
    const divHeight = problemDiv.elt.offsetHeight;
    resizeCanvas(600, divHeight + 100);
    prevButton.position(20, divHeight + 60);
    nextButton.position(100, divHeight + 60);
  }
}

function generateProblem() {
  problem = {
    text: "Un corpo di massa $m = 3$ kg subisce una variazione di energia cinetica $\\Delta K = 75$ J. Se la sua velocità iniziale era $v_i = 2$ m/s, qual è la sua velocità finale $v_f$?",
    formalizeData: "Dati:\n- Massa: $m = 3$ kg\n- Variazione energia cinetica: $\\Delta K = 75$ J\n- Velocità iniziale: $v_i = 2$ m/s",
    get formalizeDataFormatted() {
      return this.formalizeData.replace(/\n- /g, '<br>- ');
    },
    equations: "Equazioni risolutive:\n1. Definizione di variazione energia cinetica: $\\Delta K = K_f - K_i$\n2. Energia cinetica: $K = \\frac{1}{2} m v^2$",
    unknownKnown: "Incognita: $v_f$\nTermini noti: $\\Delta K$, $m$, $v_i$",
    literalSolution: "$\\Delta K = \\frac{1}{2} m v_f^2 - \\frac{1}{2} m v_i^2$\n$\\implies \\Delta K + \\frac{1}{2} m v_i^2 = \\frac{1}{2} m v_f^2$\n$\\implies 2(\\Delta K + \\frac{1}{2} m v_i^2) = m v_f^2$\n$\\implies 2\\Delta K + m v_i^2 = m v_f^2$\n$\\implies v_f^2 = \\frac{2\\Delta K + m v_i^2}{m}$\n$\\implies v_f = \\sqrt{\\frac{2\\Delta K + m v_i^2}{m}}$",
    get literalSolutionFormatted() {
      return this.literalSolution.split('\n').join("<br>");
    },
    finalCalculationPrompt: "Calcolo numerico:\n$v_f = \\sqrt{\\frac{2 \\cdot 75 \\text{ J} + 3 \\text{ kg} \cdot (2 \\text{ m/s})^2}{3 \\text{ kg}}} = \\sqrt{\\frac{150 + 12}{3}} \\text{ m/s} = \\sqrt{54} \\text{ m/s} \\approx 7.35 \\text{ m/s}$",
    correctAnswers: ["kg", "\\Delta K = K_f - K_i", "Velocità finale (vf)", "vf = \\sqrt{\\frac{2\\Delta K + m v_i^2}{m}}", "\\sqrt{54} \\text{ m/s}", "7.35 \\text{ m/s}"]
  };
  step = 0;
  feedback = "";
  console.log("Oggetto problem generato in setup:", problem);
}

function nextStep() {
  console.log("nextStep() chiamato. Step prima:", step);
  step++;
  if (step > 5) {
    step = 5;
  }
  renderProblem();
  console.log("Step dopo:", step);
}

function prevStep() {
  console.log("prevStep() chiamato. Step prima:", step);
  step--;
  if (step < 0) {
    step = 0;
  }
  renderProblem();
  console.log("Step dopo:", step);
}
