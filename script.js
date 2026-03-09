// NEET Test Website - Complete JavaScript

// Global variables
let questions = [];
let currentQuestionIndex = 0;
let userAnswers = {};
let markedForReview = new Set();
let questionStatus = [];
let timeLeft = 0;
let timerInterval = null;
let testTitle = 'NEET Mock Test';

// Show/Hide Screens
function showWelcome() {
    hideAllScreens();
    document.getElementById('welcome-screen').classList.add('active');
}

function showCreator() {
    hideAllScreens();
    document.getElementById('creator-screen').classList.add('active');
}

function showTest() {
    hideAllScreens();
    document.getElementById('test-screen').classList.add('active');
}

function showResults() {
    hideAllScreens();
    document.getElementById('results-screen').classList.add('active');
}

function hideAllScreens() {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
}

// Load sample questions

// Generate test from pasted questions
function generateTest() {
    const pastedText = document.getElementById('question-paste').value;
    const duration = parseInt(document.getElementById('test-duration').value) || 180;
    testTitle = document.getElementById('test-titfunction loadSample() {
    const physicsSample = `1. Which law states F = ma?
A. Newton's 1st
B. Newton's 2nd
C. Newton's 3rd
D. Kepler's Law
Answer: B

2. Unit of electric current?
A. Volt
B. Ampere
C. Ohm
D. Watt
Answer: B

3. Which of the following is a vector quantity?
A. Mass
B. Temperature
C. Velocity
D. Time
Answer: C`;

    const chemistrySample = `1. Which element has the highest electronegativity?
A. Oxygen
B. Fluorine
C. Chlorine
D. Nitrogen
Answer: B

2. Organic compound with functional group -OH?
A. Alcohol
B. Aldehyde
C. Ketone
D. Carboxylic acid
Answer: A

3. In which block does Copper belong?
A. s-block
B. p-block
C. d-block
D. f-block
Answer: C`;

    const biologySample = `1. Which is the powerhouse of cell?
A. Nucleus
B. Mitochondria
C. Ribosome
D. Golgi apparatus
Answer: B

2. Which vitamin is produced in sunlight?
A. Vitamin A
B. Vitamin B
C. Vitamin C
D. Vitamin D
Answer: D

3. Blood cells that lack nucleus in humans?
A. RBC
B. WBC
C. Platelets
D. All
Answer: A`;

    document.getElementById('physics-questions').value = physicsSample;
    document.getElementById('chemistry-questions').value = chemistrySample;
    document.getElementById('biology-questions').value = biologySample;
}le').value || 'NEET Mock Test';
    
    if (!pastedText.trim()) {
        alert('Please paste some questions first!');
        return;
    }
    
    // Parse questions
    questions = parseQuestions(pastedText);
    
    if (questions.length === 0) {
        alert('No valid questions found! Please check the format.');
        return;
    }
    
    // Initialize arrays
    userAnswers = {};
    markedForReview = new Set();
    questionStatus = new Array(questions.length).fill('not-visited');
    
    // Set timer (convert minutes to seconds)
    timeLeft = duration * 60;
    
    // Start test
    currentQuestionIndex = 0;
    questionStatus[0] = 'current';
    
    // Update subject display
    document.getElementById('subject-display').textContent = testTitle;
    
    // Show test screen
    showTest();
    
    // Display first question
    displayQuestion();
    
    // Update palette
    updatePalette();
    
    // Start timer
    startTimer();
}

// Parse questions from text
function parseQuestions(text, subject) {
    const lines = text.split('\n');
    const questions = [];
    let currentQuestion = null;
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        if (line.match(/^\d+\./)) {
            if (currentQuestion && currentQuestion.options.length > 0) {
                questions.push(currentQuestion);
            }
            currentQuestion = {
                id: questions.length + 1,
                text: line.replace(/^\d+\./, '').trim(),
                options: [],
                correct: null,
                subject: subject
            };
        }
        else if (line.match(/^[A-D]\./)) {
            if (currentQuestion) {
                currentQuestion.options.push(line);
            }
        }
        else if (line.toLowerCase().includes('answer:')) {
            if (currentQuestion) {
                const answerPart = line.split(':')[1].trim();
                const match = answerPart.match(/[A-D]/i);
                if (match) {
                    currentQuestion.correct = match[0].toUpperCase();
                }
            }
        }
    }
    
    if (currentQuestion && currentQuestion.options.length > 0) {
        questions.push(currentQuestion);
    }
    
    return questions;
}
        
        // Check for question number (e.g., "1.", "2.")
        if (line.match(/^\d+\./)) {
            // Save previous question
            if (currentQuestion && currentQuestion.options.length > 0) {
                questions.push(currentQuestion);
            }
            
            // Start new question
            currentQuestion = {
                id: questions.length + 1,
                text: line.replace(/^\d+\./, '').trim(),
                options: [],
                correct: null
            };
        }
        // Check for options (A., B., C., D.)
        else if (line.match(/^[A-D]\./)) {
            if (currentQuestion) {
                currentQuestion.options.push(line);
            }
        }
        // Check for answer
        else if (line.toLowerCase().includes('answer:')) {
            if (currentQuestion) {
                const answerPart = line.split(':')[1].trim();
                // Extract just the letter (A, B, C, D)
                const match = answerPart.match(/[A-D]/i);
                if (match) {
                    currentQuestion.correct = match[0].toUpperCase();
                }
            }
        }
    }
    
    // Add last question
    if (currentQuestion && currentQuestion.options.length > 0) {
        questions.push(currentQuestion);
    }
    
    return questions;
}

// Display current question
function displayQuestion() {
    if (questions.length === 0) return;
    
    const q = questions[currentQuestionIndex];const q = questions[currentQuestionIndex];
    document.getElementById('subject-display').textContent = q.subject || testTitle;
    const questionArea = document.getElementById('question-area');
    
    // Mark as viewed
    if (questionStatus[currentQuestionIndex] === 'not-visited') {
        questionStatus[currentQuestionIndex] = 'not-answered';
    }
    
    // Build options HTML
    let optionsHtml = '';
    q.options.forEach((opt, idx) => {
        const optionLetter = String.fromCharCode(65 + idx); // A, B, C, D
        const isSelected = userAnswers[currentQuestionIndex] === optionLetter;
        optionsHtml += `<div class="option ${isSelected ? 'selected' : ''}" onclick="selectOption('${optionLetter}')">${opt}</div>`;
    });
    
    // Build navigation buttons
    let navButtons = `
        <button class="nav-btn save-next" onclick="saveAndNext()">Save & Next</button>
        <button class="nav-btn mark-review" onclick="markForReview()">Mark for Review</button>
        <button class="nav-btn clear" onclick="clearResponse()">Clear</button>
    `;
    
    if (currentQuestionIndex > 0) {
        navButtons += `<button class="nav-btn prev" onclick="previousQuestion()">Previous</button>`;
    }
    
    // Complete question HTML
    questionArea.innerHTML = `
        <div class="question-number">Question ${currentQuestionIndex + 1} of ${questions.length}</div>
        <div class="question-text">${q.text}</div>
        <div class="options">${optionsHtml}</div>
        <div class="nav-buttons">${navButtons}</div>
    `;
    
    // Update palette
    updatePalette();
}

// Select an option
function selectOption(optionLetter) {
    userAnswers[currentQuestionIndex] = optionLetter;
    questionStatus[currentQuestionIndex] = 'answered';
    displayQuestion();
    updatePalette();
}

// Save and go to next
function saveAndNext() {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        if (questionStatus[currentQuestionIndex] === 'not-visited') {
            questionStatus[currentQuestionIndex] = 'current';
        }
        displayQuestion();
    } else {
        // Last question - show submit confirmation
        if (confirm('This is the last question. Submit test?')) {
            submitTest();
        }
    }
}

// Mark for review
function markForReview() {
    markedForReview.add(currentQuestionIndex);
    questionStatus[currentQuestionIndex] = 'marked';
    
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        if (questionStatus[currentQuestionIndex] === 'not-visited') {
            questionStatus[currentQuestionIndex] = 'current';
        }
        displayQuestion();
    } else {
        // Option to submit
        if (confirm('Last question marked. Submit test?')) {
            submitTest();
        }
    }
}

// Clear response
function clearResponse() {
    delete userAnswers[currentQuestionIndex];
    questionStatus[currentQuestionIndex] = 'not-answered';
    displayQuestion();
    updatePalette();
}

// Go to previous question
function previousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayQuestion();
    }
}

// Jump to specific question
function jumpToQuestion(index) {
    if (index >= 0 && index < questions.length) {
        currentQuestionIndex = index;
        if (questionStatus[index] === 'not-visited') {
            questionStatus[index] = 'current';
        }
        displayQuestion();
    }
}

// Update question palette
function updatePalette() {
    const paletteGrid = document.getElementById('palette-grid');
    let html = '';
    
    for (let i = 0; i < questions.length; i++) {
        let statusClass = '';
        
        if (markedForReview.has(i)) {
            statusClass = 'marked';
        } else if (userAnswers[i]) {
            statusClass = 'answered';
        } else if (questionStatus[i] === 'not-visited' && i !== currentQuestionIndex) {
            statusClass = 'not-visited';
        } else if (!userAnswers[i]) {
            statusClass = 'not-answered';
        }
        
        html += `<button class="q-btn ${statusClass}" onclick="jumpToQuestion(${i})">${i + 1}</button>`;
    }
    
    paletteGrid.innerHTML = html;
}

// Timer functions
function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    
    timerInterval = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            alert('⏰ Time\'s up! Submitting test...');
            submitTest();
            return;
        }
        
        timeLeft--;
        updateTimerDisplay();
        
        // Warning at 5 minutes
        if (timeLeft === 300) {
            alert('⚠️ 5 minutes remaining!');
        }
    }, 1000);
}

function updateTimerDisplay() {
    const hours = Math.floor(timeLeft / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    const seconds = timeLeft % 60;
    
    document.getElementById('timer-display').textContent = 
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Submit test and show results
function submitTest() {
    clearInterval(timerInterval);
    
    // Calculate results
    let correct = 0;
    let wrong = 0;
    let skipped = 0;
    let subjectWise = {};
    
    questions.forEach((q, index) => {
        const userAnswer = userAnswers[index];
        const isCorrect = userAnswer === q.correct;
        
        if (!userAnswer) {
            skipped++;
        } else if (isCorrect) {
            correct++;
        } else {
            wrong++;
        }
        
        // Detect subject (simplified)
        function detectSubject(text) {
    text = text.toLowerCase();
    
    const botany = [
        'plant', 'flower', 'leaf', 'root', 'stem', 'photosynthesis', 'chlorophyll',
        'stomata', 'pollination', 'seed', 'fruit', 'angiosperm', 'gymnosperm',
        'monocot', 'dicot', 'stamen', 'carpel', 'ovule', 'ovary', 'embryo',
        'endosperm', 'transpiration', 'guttation', 'plastid', 'chromoplast',
        'leucoplast', 'xylem', 'phloem', 'vascular', 'cortex', 'pith', 'epidermis',
        'guard cell', 'mesophyll', 'chloroplast', 'photorespiration', 'calvin cycle',
        'c3', 'c4', 'cam', 'nitrogen fixation', 'rhizobium', 'mycorrhiza',
        'fern', 'moss', 'algae', 'fungi', 'lichen', 'bryophyte', 'pteridophyte',
        'gymnosperm', 'angiosperm', 'inflorescence', 'androecium', 'gynoecium',
        'pericycle', 'endodermis', 'cambium', 'collenchyma', 'sclerenchyma',
        'parenchyma', 'meristem', 'abscission', 'vernalization', 'photoperiodism',
        'auxin', 'gibberellin', 'cytokinin', 'ethylene', 'aba', 'phytochrome'
    ];
    
    const zoology = [
        'animal', 'cell', 'tissue', 'organ', 'blood', 'heart', 'brain', 'nerve',
        'muscle', 'digestion', 'respiratory', 'excretion', 'skeleton', 'bone',
        'cartilage', 'neuron', 'axon', 'dendrite', 'synapse', 'hormone', 'enzyme',
        'antibody', 'antigen', 'vaccine', 'pathogen', 'bacteria', 'virus', 'protozoa',
        'mammal', 'reptile', 'amphibian', 'bird', 'fish', 'insect', 'arthropod',
        'mollusk', 'echinoderm', 'cnidarian', 'platyhelminthes', 'nematode',
        'annelid', 'circulatory', 'nervous', 'endocrine', 'reproductive', 'urinary'
    ];
    
    const organic = [
        'organic', 'hydrocarbon', 'alkane', 'alkene', 'alkyne', 'alcohol', 'aldehyde',
        'ketone', 'carboxylic', 'ester', 'ether', 'amine', 'benzene', 'polymer',
        'monomer', 'functional group', 'isomer', 'chiral', 'enantiomer', 'diastereomer',
        'racemic', 'substitution', 'elimination', 'addition', 'rearrangement'
    ];
    
    const inorganic = [
        'inorganic', 'metal', 'non-metal', 'coordination', 'complex', 'ligand',
        'transition', 'lanthanide', 'actinide', 'p-block', 's-block', 'd-block',
        'f-block', 'periodic', 'group', 'period', 'ionic', 'covalent', 'electronegativity',
        'ionization', 'atomic radius', 'oxidation state', 'crystal field', 'chelate'
    ];
    
    const physical = [
        'physical', 'thermodynamics', 'enthalpy', 'entropy', 'gibbs', 'equilibrium',
        'kinetics', 'rate', 'order', 'molecularity', 'electrochemistry', 'cell',
        'electrode', 'nernst', 'conductance', 'surface', 'adsorption', 'catalyst',
        'quantum', 'orbital', 'atomic structure', 'wave function', 'schrodinger',
        'heisenberg', 'uncertainty', 'photoelectric', 'black body', 'maxwell'
    ];
    
    const physics = [
        'force', 'current', 'velocity', 'mass', 'acceleration', 'energy', 'power',
        'circuit', 'charge', 'field', 'magnetic', 'electric', 'resistance', 'voltage',
        'ohm', 'newton', 'joule', 'watt', 'hertz', 'frequency', 'wavelength',
        'amplitude', 'diffraction', 'interference', 'refraction', 'lens', 'mirror',
        'optics', 'thermodynamics', 'heat', 'temperature', 'kinetic', 'potential',
        'momentum', 'impulse', 'work', 'simple harmonic', 'oscillation', 'wave'
    ];
    
    if (botany.some(word => text.includes(word))) return 'Botany';
    if (zoology.some(word => text.includes(word))) return 'Zoology';
    if (organic.some(word => text.includes(word))) return 'Organic Chemistry';
    if (inorganic.some(word => text.includes(word))) return 'Inorganic Chemistry';
    if (physical.some(word => text.includes(word))) return 'Physical Chemistry';
    if (physics.some(word => text.includes(word))) return 'Physics';
    
    return 'General';
        }
    
    const total = questions.length;
    const attempted = correct + wrong;
    const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;
    const score = (correct * 4) - (wrong * 1); // NEET marking
    
    // Display results
    displayResults({
        total,
        correct,
        wrong,
        skipped,
        attempted,
        accuracy,
        score,
        subjectWise
    });
    
    showResults();
}

// Simple subject detection
function detectSubject(text) {
    text = text.toLowerCase();
    
    const physics = ['force', 'current', 'velocity', 'mass', 'acceleration', 'energy', 'power', 'circuit', 'charge', 'field'];
    const chemistry = ['atom', 'molecule', 'reaction', 'acid', 'base', 'bond', 'element', 'compound', 'solution', 'gas'];
    const botany = ['plant', 'flower', 'leaf', 'root', 'photosynthesis', 'chlorophyll', 'stomata', 'pollination', 'seed'];
    const zoology = ['animal', 'cell', 'tissue', 'organ', 'blood', 'heart', 'brain', 'nerve', 'muscle', 'digestion'];
    
    if (physics.some(word => text.includes(word))) return 'Physics';
    if (chemistry.some(word => text.includes(word))) return 'Chemistry';
    if (botany.some(word => text.includes(word))) return 'Botany';
    if (zoology.some(word => text.includes(word))) return 'Zoology';
    
    return 'General';
}

// Display results
function displayResults(data) {
    // Score circle
    document.getElementById('score-display').textContent = data.score;
    
    // Stats grid
    const statsGrid = document.getElementById('stats-grid');
    statsGrid.innerHTML = `
        <div class="stat-box">
            <div class="value">${data.correct}</div>
            <div class="label">Correct</div>
        </div>
        <div class="stat-box">
            <div class="value">${data.wrong}</div>
            <div class="label">Wrong</div>
        </div>
        <div class="stat-box">
            <div class="value">${data.skipped}</div>
            <div class="label">Skipped</div>
        </div>
        <div class="stat-box">
            <div class="value">${data.attempted}</div>
            <div class="label">Attempted</div>
        </div>
    `;
    
    // Subject analysis
    const subjectAnalysis = document.getElementById('subject-analysis');
    let subjectHtml = '<h3>Subject-wise Performance</h3>';
    
    for (const [subject, stats] of Object.entries(data.subjectWise)) {
        const correctPercent = (stats.correct / stats.total) * 100;
        subjectHtml += `
            <div class="subject-row">
                <div class="subject-name">${subject}</div>
                <div class="subject-stats">
                    <span class="correct">✓ ${stats.correct}</span>
                    <span class="wrong">✗ ${stats.wrong}</span>
                    <span>Total: ${stats.total}</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${correctPercent}%"></div>
                </div>
            </div>
        `;
    }
    
    subjectAnalysis.innerHTML = subjectHtml;
    
// NEET Test Website - Complete JavaScript (Multi‑Subject Version)

// Global variables
let questions = [];
let currentQuestionIndex = 0;
let userAnswers = {};
let markedForReview = new Set();
let questionStatus = [];
let timeLeft = 0;
let timerInterval = null;
let testTitle = 'NEET Mock Test';

// ================== SCREEN NAVIGATION ==================
function showWelcome() {
    hideAllScreens();
    document.getElementById('welcome-screen').classList.add('active');
}

function showCreator() {
    hideAllScreens();
    document.getElementById('creator-screen').classList.add('active');
}

function showTest() {
    hideAllScreens();
    document.getElementById('test-screen').classList.add('active');
}

function showResults() {
    hideAllScreens();
    document.getElementById('results-screen').classList.add('active');
}

function hideAllScreens() {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
}

// ================== LOAD SAMPLE QUESTIONS ==================
function loadSample() {
    const physicsSample = `1. Which law states F = ma?
A. Newton's 1st
B. Newton's 2nd
C. Newton's 3rd
D. Kepler's Law
Answer: B

2. Unit of electric current?
A. Volt
B. Ampere
C. Ohm
D. Watt
Answer: B

3. Which of the following is a vector quantity?
A. Mass
B. Temperature
C. Velocity
D. Time
Answer: C`;

    const chemistrySample = `1. Which element has the highest electronegativity?
A. Oxygen
B. Fluorine
C. Chlorine
D. Nitrogen
Answer: B

2. Organic compound with functional group -OH?
A. Alcohol
B. Aldehyde
C. Ketone
D. Carboxylic acid
Answer: A

3. In which block does Copper belong?
A. s-block
B. p-block
C. d-block
D. f-block
Answer: C`;

    const biologySample = `1. Which is the powerhouse of cell?
A. Nucleus
B. Mitochondria
C. Ribosome
D. Golgi apparatus
Answer: B

2. Which vitamin is produced in sunlight?
A. Vitamin A
B. Vitamin B
C. Vitamin C
D. Vitamin D
Answer: D

3. Blood cells that lack nucleus in humans?
A. RBC
B. WBC
C. Platelets
D. All
Answer: A`;

    document.getElementById('physics-questions').value = physicsSample;
    document.getElementById('chemistry-questions').value = chemistrySample;
    document.getElementById('biology-questions').value = biologySample;
}

// ================== GENERATE TEST ==================
function generateTest() {
    // Read from the three textareas
    const physicsText = document.getElementById('physics-questions').value;
    const chemistryText = document.getElementById('chemistry-questions').value;
    const biologyText = document.getElementById('biology-questions').value;
    const duration = parseInt(document.getElementById('test-duration').value) || 180;
    testTitle = document.getElementById('test-title').value || 'NEET Mock Test';

    // Parse each subject's questions with the correct subject tag
    let physicsQuestions = parseQuestions(physicsText, 'Physics');
    let chemistryQuestions = parseQuestions(chemistryText, 'Chemistry');
    let biologyQuestions = parseQuestions(biologyText, 'Biology');

    // Combine all questions
    questions = [...physicsQuestions, ...chemistryQuestions, ...biologyQuestions];

    if (questions.length === 0) {
        alert('No valid questions found! Please paste questions in at least one subject area.');
        return;
    }

    // Initialize tracking arrays
    userAnswers = {};
    markedForReview = new Set();
    questionStatus = new Array(questions.length).fill('not-visited');

    // Set timer (minutes → seconds)
    timeLeft = duration * 60;

    // Start at first question
    currentQuestionIndex = 0;
    questionStatus[0] = 'current';

    // Update header with test title
    document.getElementById('subject-display').textContent = testTitle;

    // Show test screen
    showTest();

    // Display first question
    displayQuestion();
    updatePalette();
    startTimer();
}

// ================== PARSE QUESTIONS (with subject tag) ==================
function parseQuestions(text, subject) {
    const lines = text.split('\n');
    const questions = [];
    let currentQuestion = null;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        // Detect question number (e.g., "1.", "2.")
        if (line.match(/^\d+\./)) {
            // Save previous question
            if (currentQuestion && currentQuestion.options.length > 0) {
                questions.push(currentQuestion);
            }
            // Start new question
            currentQuestion = {
                id: questions.length + 1,
                text: line.replace(/^\d+\./, '').trim(),
                options: [],
                correct: null,
                subject: subject   // <-- tag with subject
            };
        }
        // Detect options (A., B., C., D.)
        else if (line.match(/^[A-D]\./)) {
            if (currentQuestion) {
                currentQuestion.options.push(line);
            }
        }
        // Detect answer line
        else if (line.toLowerCase().includes('answer:')) {
            if (currentQuestion) {
                const answerPart = line.split(':')[1].trim();
                const match = answerPart.match(/[A-D]/i);
                if (match) {
                    currentQuestion.correct = match[0].toUpperCase();
                }
            }
        }
    }

    // Add the last question
    if (currentQuestion && currentQuestion.options.length > 0) {
        questions.push(currentQuestion);
    }

    return questions;
}

// ================== DISPLAY CURRENT QUESTION ==================
function displayQuestion() {
    if (questions.length === 0) return;

    const q = questions[currentQuestionIndex];
    // Update the top bar to show the subject of the current question
    document.getElementById('subject-display').textContent = q.subject || testTitle;

    const questionArea = document.getElementById('question-area');

    // Mark as viewed if it was 'not-visited'
    if (questionStatus[currentQuestionIndex] === 'not-visited') {
        questionStatus[currentQuestionIndex] = 'not-answered';
    }

    // Build options HTML
    let optionsHtml = '';
    q.options.forEach((opt, idx) => {
        const optionLetter = String.fromCharCode(65 + idx); // A, B, C, D
        const isSelected = userAnswers[currentQuestionIndex] === optionLetter;
        optionsHtml += `<div class="option ${isSelected ? 'selected' : ''}" onclick="selectOption('${optionLetter}')">${opt}</div>`;
    });

    // Navigation buttons
    let navButtons = `
        <button class="nav-btn save-next" onclick="saveAndNext()">Save & Next</button>
        <button class="nav-btn mark-review" onclick="markForReview()">Mark for Review</button>
        <button class="nav-btn clear" onclick="clearResponse()">Clear</button>
    `;
    if (currentQuestionIndex > 0) {
        navButtons += `<button class="nav-btn prev" onclick="previousQuestion()">Previous</button>`;
    }

    questionArea.innerHTML = `
        <div class="question-number">Question ${currentQuestionIndex + 1} of ${questions.length}</div>
        <div class="question-text">${q.text}</div>
        <div class="options">${optionsHtml}</div>
        <div class="nav-buttons">${navButtons}</div>
    `;

    updatePalette();
}

// ================== OPTION SELECTION ==================
function selectOption(optionLetter) {
    userAnswers[currentQuestionIndex] = optionLetter;
    questionStatus[currentQuestionIndex] = 'answered';
    displayQuestion();
    updatePalette();
}

// ================== NAVIGATION ==================
function saveAndNext() {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        if (questionStatus[currentQuestionIndex] === 'not-visited') {
            questionStatus[currentQuestionIndex] = 'current';
        }
        displayQuestion();
    } else {
        if (confirm('This is the last question. Submit test?')) {
            submitTest();
        }
    }
}

function markForReview() {
    markedForReview.add(currentQuestionIndex);
    questionStatus[currentQuestionIndex] = 'marked';

    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        if (questionStatus[currentQuestionIndex] === 'not-visited') {
            questionStatus[currentQuestionIndex] = 'current';
        }
        displayQuestion();
    } else {
        if (confirm('Last question marked. Submit test?')) {
            submitTest();
        }
    }
}

function clearResponse() {
    delete userAnswers[currentQuestionIndex];
    questionStatus[currentQuestionIndex] = 'not-answered';
    displayQuestion();
    updatePalette();
}

function previousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayQuestion();
    }
}

function jumpToQuestion(index) {
    if (index >= 0 && index < questions.length) {
        currentQuestionIndex = index;
        if (questionStatus[index] === 'not-visited') {
            questionStatus[index] = 'current';
        }
        displayQuestion();
    }
}

// ================== UPDATE QUESTION PALETTE ==================
function updatePalette() {
    const paletteGrid = document.getElementById('palette-grid');
    let html = '';

    for (let i = 0; i < questions.length; i++) {
        let statusClass = '';
        if (markedForReview.has(i)) {
            statusClass = 'marked';
        } else if (userAnswers[i]) {
            statusClass = 'answered';
        } else if (questionStatus[i] === 'not-visited' && i !== currentQuestionIndex) {
            statusClass = 'not-visited';
        } else if (!userAnswers[i]) {
            statusClass = 'not-answered';
        }

        html += `<button class="q-btn ${statusClass}" onclick="jumpToQuestion(${i})">${i + 1}</button>`;
    }

    paletteGrid.innerHTML = html;
}

// ================== TIMER ==================
function startTimer() {
    if (timerInterval) clearInterval(timerInterval);

    timerInterval = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            alert('⏰ Time\'s up! Submitting test...');
            submitTest();
            return;
        }

        timeLeft--;
        updateTimerDisplay();

        if (timeLeft === 300) {  // 5 minutes warning
            alert('⚠️ 5 minutes remaining!');
        }
    }, 1000);
}

function updateTimerDisplay() {
    const hours = Math.floor(timeLeft / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    const seconds = timeLeft % 60;
    document.getElementById('timer-display').textContent =
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// ================== SUBMIT TEST & CALCULATE RESULTS ==================
function submitTest() {
    clearInterval(timerInterval);

    let correct = 0;
    let wrong = 0;
    let skipped = 0;
    let subjectWise = {};

    questions.forEach((q, index) => {
        const userAnswer = userAnswers[index];
        const isCorrect = userAnswer === q.correct;

        if (!userAnswer) {
            skipped++;
        } else if (isCorrect) {
            correct++;
        } else {
            wrong++;
        }

        // Use the enhanced subject detection to get detailed subject (Botany, Organic, etc.)
        const detailedSubject = detectSubject(q.text);
        if (!subjectWise[detailedSubject]) {
            subjectWise[detailedSubject] = { correct: 0, wrong: 0, total: 0 };
        }
        subjectWise[detailedSubject].total++;
        if (isCorrect) subjectWise[detailedSubject].correct++;
        else if (userAnswer) subjectWise[detailedSubject].wrong++;
    });

    const total = questions.length;
    const attempted = correct + wrong;
    const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;
    const score = (correct * 4) - (wrong * 1); // NEET marking

    displayResults({
        total,
        correct,
        wrong,
        skipped,
        attempted,
        accuracy,
        score,
        subjectWise
    });

    showResults();
}

// ================== ENHANCED SUBJECT DETECTION ==================
function detectSubject(text) {
    text = text.toLowerCase();

    const botany = [
        'plant', 'flower', 'leaf', 'root', 'stem', 'photosynthesis', 'chlorophyll',
        'stomata', 'pollination', 'seed', 'fruit', 'angiosperm', 'gymnosperm',
        'monocot', 'dicot', 'stamen', 'carpel', 'ovule', 'ovary', 'embryo',
        'endosperm', 'transpiration', 'guttation', 'plastid', 'chromoplast',
        'leucoplast', 'xylem', 'phloem', 'vascular', 'cortex', 'pith', 'epidermis',
        'guard cell', 'mesophyll', 'chloroplast', 'photorespiration', 'calvin cycle',
        'c3', 'c4', 'cam', 'nitrogen fixation', 'rhizobium', 'mycorrhiza',
        'fern', 'moss', 'algae', 'fungi', 'lichen', 'bryophyte', 'pteridophyte',
        'gymnosperm', 'angiosperm', 'inflorescence', 'androecium', 'gynoecium',
        'pericycle', 'endodermis', 'cambium', 'collenchyma', 'sclerenchyma',
        'parenchyma', 'meristem', 'abscission', 'vernalization', 'photoperiodism',
        'auxin', 'gibberellin', 'cytokinin', 'ethylene', 'aba', 'phytochrome'
    ];

    const zoology = [
        'animal', 'cell', 'tissue', 'organ', 'blood', 'heart', 'brain', 'nerve',
        'muscle', 'digestion', 'respiratory', 'excretion', 'skeleton', 'bone',
        'cartilage', 'neuron', 'axon', 'dendrite', 'synapse', 'hormone', 'enzyme',
        'antibody', 'antigen', 'vaccine', 'pathogen', 'bacteria', 'virus', 'protozoa',
        'mammal', 'reptile', 'amphibian', 'bird', 'fish', 'insect', 'arthropod',
        'mollusk', 'echinoderm', 'cnidarian', 'platyhelminthes', 'nematode',
        'annelid', 'circulatory', 'nervous', 'endocrine', 'reproductive', 'urinary'
    ];

    const organic = [
        'organic', 'hydrocarbon', 'alkane', 'alkene', 'alkyne', 'alcohol', 'aldehyde',
        'ketone', 'carboxylic', 'ester', 'ether', 'amine', 'benzene', 'polymer',
        'monomer', 'functional group', 'isomer', 'chiral', 'enantiomer', 'diastereomer',
        'racemic', 'substitution', 'elimination', 'addition', 'rearrangement'
    ];

    const inorganic = [
        'inorganic', 'metal', 'non-metal', 'coordination', 'complex', 'ligand',
        'transition', 'lanthanide', 'actinide', 'p-block', 's-block', 'd-block',
        'f-block', 'periodic', 'group', 'period', 'ionic', 'covalent', 'electronegativity',
        'ionization', 'atomic radius', 'oxidation state', 'crystal field', 'chelate'
    ];

    const physical = [
        'physical', 'thermodynamics', 'enthalpy', 'entropy', 'gibbs', 'equilibrium',
        'kinetics', 'rate', 'order', 'molecularity', 'electrochemistry', 'cell',
        'electrode', 'nernst', 'conductance', 'surface', 'adsorption', 'catalyst',
        'quantum', 'orbital', 'atomic structure', 'wave function', 'schrodinger',
        'heisenberg', 'uncertainty', 'photoelectric', 'black body', 'maxwell'
    ];

    const physics = [
        'force', 'current', 'velocity', 'mass', 'acceleration', 'energy', 'power',
        'circuit', 'charge', 'field', 'magnetic', 'electric', 'resistance', 'voltage',
        'ohm', 'newton', 'joule', 'watt', 'hertz', 'frequency', 'wavelength',
        'amplitude', 'diffraction', 'interference', 'refraction', 'lens', 'mirror',
        'optics', 'thermodynamics', 'heat', 'temperature', 'kinetic', 'potential',
        'momentum', 'impulse', 'work', 'simple harmonic', 'oscillation', 'wave'
    ];

    if (botany.some(word => text.includes(word))) return 'Botany';
    if (zoology.some(word => text.includes(word))) return 'Zoology';
    if (organic.some(word => text.includes(word))) return 'Organic Chemistry';
    if (inorganic.some(word => text.includes(word))) return 'Inorganic Chemistry';
    if (physical.some(word => text.includes(word))) return 'Physical Chemistry';
    if (physics.some(word => text.includes(word))) return 'Physics';

    return 'General';
}

// ================== DISPLAY RESULTS ==================
function displayResults(data) {
    document.getElementById('score-display').textContent = data.score;

    const statsGrid = document.getElementById('stats-grid');
    statsGrid.innerHTML = `
        <div class="stat-box">
            <div class="value">${data.correct}</div>
            <div class="label">Correct</div>
        </div>
        <div class="stat-box">
            <div class="value">${data.wrong}</div>
            <div class="label">Wrong</div>
        </div>
        <div class="stat-box">
            <div class="value">${data.skipped}</div>
            <div class="label">Skipped</div>
        </div>
        <div class="stat-box">
            <div class="value">${data.attempted}</div>
            <div class="label">Attempted</div>
        </div>
    `;

    const subjectAnalysis = document.getElementById('subject-analysis');
    let subjectHtml = '<h3>Subject-wise Performance</h3>';

    for (const [subject, stats] of Object.entries(data.subjectWise)) {
        const correctPercent = (stats.correct / stats.total) * 100;
        subjectHtml += `
            <div class="subject-row">
                <div class="subject-name">${subject}</div>
                <div class="subject-stats">
                    <span class="correct">✓ ${stats.correct}</span>
                    <span class="wrong">✗ ${stats.wrong}</span>
                    <span>Total: ${stats.total}</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${correctPercent}%"></div>
                </div>
            </div>
        `;
    }

    subjectAnalysis.innerHTML = subjectHtml;

    document.getElementById('accuracy-fill').style.width = `${data.accuracy}%`;
    document.getElementById('accuracy-value').textContent = `${data.accuracy}%`;
}

// ================== CREATE NEW TEST ==================
function createNewTest() {
    questions = [];
    currentQuestionIndex = 0;
    userAnswers = {};
    markedForReview = new Set();
    questionStatus = [];
    timeLeft = 0;
    if (timerInterval) clearInterval(timerInterval);
    showCreator();
}

// ================== INITIALIZE ON PAGE LOAD ==================
window.onload = function() {
    showWelcome();
    window.onpopstate = function() {
        showWelcome();
    };
};
