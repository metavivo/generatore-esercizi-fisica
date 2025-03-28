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
    displayText += "Passo 5: Calcolo numerico\n" + problem.finalCalculationPrompt.replace(/\$/g, '') + "\nRisultato finale: " + problem.correctAnswers[5];
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
    text: "Un pendolo di massa $m = 0.5$ kg viene lasciato cadere da un'altezza $h = 0.8$ m rispetto al punto più basso della sua oscillazione. Qual è la sua velocità nel punto più basso, assumendo che non ci siano perdite di energia?",
    formalizeData: "Dati:\n- Massa: $m = 0.5$ kg\n- Altezza iniziale: $h = 0.8$ m\n- Velocità iniziale (al rilascio): $v_i = 0$ m/s",
    get formalizeDataFormatted() {
      return this.formalizeData.replace(/\n- /g, '<br>- ');
    },
    equations: "Equazioni risolutive:\n1. Teorema dell'energia cinetica (lavoro della forza peso): $L_p = \\Delta K = K_f - K_i$\n2. Lavoro della forza peso: $L_p = mgh$\n3. Energia cinetica: $K = \\frac{1}{2} m v^2$",
    unknownKnown: "Incognita: $v_f$ (velocità nel punto più basso)\nTermini noti: $m$, $h$, $v_i$ (e $g$, accelerazione di gravità $\\approx 9.81 \\text{ m/s}^2$)",
    literalSolution: "Il lavoro compiuto dalla forza peso mentre il pendolo scende è $L_p = mgh$. Per il teorema dell'energia cinetica, questo lavoro è uguale alla variazione di energia cinetica: $mgh = K_f - K_i$.<br>Dato che la velocità iniziale è $v_i = 0$, l'energia cinetica iniziale $K_i = 0$. Quindi, $mgh = K_f = \\frac{1}{2} m v_f^2$.<br>$\\implies mgh = \\frac{1}{2} m v_f^2$<br>$\\implies 2gh = v_f^2$<br>$\\implies v_f = \\sqrt{2gh}$",
    get literalSolutionFormatted() {
      return this.literalSolution.split('<br>').join("<br>");
    },
    finalCalculationPrompt: "Calcolo numerico:<br>$v_f = \\sqrt{2 \\cdot 9.81 \\text{ m/s}^2 \\cdot 0.8 \\text{ m}}$<br>$= \\sqrt{15.696} \\text{ m}^2/\\text{s}^2$<br>$\\approx 3.96 \\text{ m/s}$",
    correctAnswers: ["kg", "L_p = \\Delta K = K_f - K_i", "Velocità nel punto più basso (vf)", "vf = \\sqrt{2gh}", "\\approx 3.96 \\text{ m/s}", "3.96 m/s"],
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
