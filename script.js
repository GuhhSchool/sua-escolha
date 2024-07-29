const titleElement = document.querySelector('.h1__main--title');
const descriptionMainElement = document.querySelector('.p__main--title');
const divColorsElement = document.querySelector('.div__main--colors');
const colorsElement = document.querySelectorAll('.circle')
const buttonsElement = document.querySelectorAll('.button__main');
const inputElement = document.querySelector('.input__main');
const buttonStartElement = document.querySelector('.button__main--start');
const buttonYesElement = document.querySelector('.button__main--yes');
const buttonNoElement = document.querySelector('.button__main--no');
const pQuestionElement = document.querySelector('.p__main--question');
const divInteractionsElement = document.querySelector('.div__main--buttons');
const resultTextElement = document.querySelector('.p__main--result');
const divEndButtonsElement = document.querySelector('.div__main--end');

let currentIndexColor = 1;

const colors = {
    a: {
        '--color-background-body': 'rgb(215, 255, 214)',
        '--color-background-box': 'rgb(163, 254, 162)',
        '--color-background-1-e-2': 'rgb(215, 255, 214)',
        '--color-border-box': 'rgb(84, 135, 83)',
        '--color-button-click': 'rgb(52, 255, 49)',
    },
    b: {
        '--color-background-body': 'rgb(255, 182, 194)',
        '--color-background-box': 'rgb(220, 139, 152)',
        '--color-background-1-e-2': 'rgb(237, 160, 173)',
        '--color-border-box': 'rgb(188, 98, 113)',
        '--color-button-click': 'rgb(230, 99, 121)',
    },
    c: {
        '--color-background-body': 'rgb(250, 235, 235)',
        '--color-background-box': 'rgb(237, 250, 252)',
        '--color-background-1-e-2': 'rgb(207, 238, 248)',
        '--color-border-box': 'rgb(0, 0, 0)',
        '--color-button-click': 'rgb(255, 255, 255)',
    },
    d: {  
        '--color-background-body': 'rgb(255, 194, 245)',
        '--color-background-box': 'rgb(255, 155, 238)',
        '--color-background-1-e-2': 'rgb(255, 202, 246)',
        '--color-border-box': 'rgb(203, 87, 184)',
        '--color-button-click': 'rgb(255, 166, 240)',
    }
}

if (window.location.href.includes('?')) start()
else startConfig();

// Parte 1 - Configuração
function startConfig() {
    pQuestionElement.style.display = 'none';
    divInteractionsElement.style.display = 'none';

    buttonsElement.forEach(button => button.style.display = 'none');
    colorsElement.forEach((button, index) => button.addEventListener('click', (b) => changeColor(b, index + 1)));
    inputElement.addEventListener('keypress', keypress);
    buttonStartElement.onclick = clickStart;

    function changeColor(button, index) {
        button = button.target;
        currentIndexColor = index;

        colorsElement.forEach(button => button.classList.remove('circle-activated'));
        button.classList.add('circle-activated');  
        
        const letter = replaceIndex(index);
        changeBackground(letter);
    }

    changeBackground('a');
}

function clickStart() {
    const text = inputElement.value;
    
    if (!text.length) {
        alert('Você precisa definir uma pergunta.');
        inputElement.focus()
        const bordercolor = inputElement.style.borderColor;
        inputElement.style.borderColor = '#FF0000'
        return setTimeout(() => inputElement.style.borderColor = `${bordercolor}`, 1500);
    }

    finishStart(text);
}

function finishStart(text) {
    text = text.trim().split(/ +/g).join(' ')
    
    // Escondendo/Mostrando Ações    
    divInteractionsElement.style.display = 'flex';
    divColorsElement.style.display = 'none';
    inputElement.style.display = 'none';
    buttonStartElement.style.display = 'none';

    titleElement.textContent = 'Sua pergunta foi criada!'
    descriptionMainElement.textContent = `"${text}"`;

    const [, buttonView, , buttonShare] = divInteractionsElement.childNodes;
    const url = `?${currentIndexColor}#${encodeURI(text)}`;

    buttonView.onclick = () => view();
    buttonShare.onclick = () => share();

    function view() {
        window.location.href = url;
    }

    let disabled;
    function share() {
        if (disabled) return;
        disabled = true;

        navigator.clipboard.writeText(window.location.href + url);

        const buttonText = buttonShare.textContent;
        buttonShare.textContent = 'Link Copiado!';
        buttonShare.style.cursor = 'default';

        setTimeout(() => {
            buttonShare.textContent = buttonText;
            buttonShare.style.cursor = 'pointer';
            disabled = false;
        }, 2000);
    }
}

function keypress(keyEvent) {
    if (keyEvent.key !== 'Enter') return;
    inputElement.removeEventListener('keypress', keypress);
    clickStart();
}

// Parte 2 - Mostrar
function start() {
    divColorsElement.style.display = 'none';
    inputElement.style.display = 'none';
    buttonStartElement.style.display = 'none';
    descriptionMainElement.style.display = 'none';
    divInteractionsElement.style.display = 'none';

    const urlData = getURLData();
    changeBackground(urlData.letter);
    titleElement.textContent = 'Sua Escolha';
    pQuestionElement.textContent = urlData.text;

    buttonNoElement.addEventListener('mouseover', hover);
    buttonNoElement.onclick = hover;
    buttonYesElement.onclick = finish;

    function getURLData() {
        const url = window.location.href;
        let letter = url.substring(url.indexOf('?') + 1, url.indexOf('#'));
        let text = url.substring(url.indexOf('#') + 1, url.length);
        letter = replaceIndex(letter);
        text = decodeURI(text);
        
        return { letter, text };
    }
}

function hover(button) {
    const buttonWidth = buttonNoElement.clientWidth;
    const buttonHeight = buttonNoElement.clientHeight;
    const limitX = window.innerWidth - 50;
    const limitY = window.innerHeight - 50;
    const buttonX = () => buttonNoElement.getBoundingClientRect().x;
    const buttonY = () => buttonNoElement.getBoundingClientRect().y;

    let choices = ['left', 'right', 'top', 'bottom'];
    
    verifyLimit();
    const position = randomize();
    move(position)

    function verifyLimit() {
        if (buttonY() - buttonHeight <= 50) choices = choices.filter(f => f !== 'top');
        if (buttonY() + buttonHeight >= limitY) choices = choices.filter(f => f !== 'bottom');
        if (buttonX() + buttonWidth >= limitX) choices = choices.filter(f => f !== 'right');
        if (buttonX() - buttonWidth <= 50) choices = choices.filter(f => f !== 'left');
    }

    function randomize() {
        return choices[Math.floor(Math.random() * choices.length)];
    }

    function move(direction) {
        const left = () => `${(parseInt(buttonNoElement.style.left) || 0) - buttonWidth}px`;
        const right = () => `${(parseInt(buttonNoElement.style.left) || 0) + buttonWidth}px`;
        const top = () => `${(parseInt(buttonNoElement.style.top) || 0) - buttonHeight * 2}px`;
        const bottom = () => `${(parseInt(buttonNoElement.style.top) || 0) + buttonHeight * 2}px`;

        if (direction === 'left') buttonNoElement.style.left = left();
        if (direction === 'right') buttonNoElement.style.left = right();
        if (direction === 'top') buttonNoElement.style.top = top();
        if (direction === 'bottom') buttonNoElement.style.top = bottom();   
    }
}

function replaceIndex(index) {
    if (index == 1) return 'a';
    if (index == 2) return 'b';
    if (index == 3) return 'c';
    if (index == 4) return 'd';
}

function changeBackground(letter) {
    /** @type {HTMLElement} */
    const root = document.querySelector(':root');
    const subColors = colors[letter];
    for (const key in subColors) root.style.setProperty(key, subColors[key])
}

// Parte 3 - Reiniciar
async function finish() {
    const restartButton = document.querySelector('.button__main--restart');
    const createButton = document.querySelector('.button__main--create');

    const delay  = (ms) => new Promise(res => setTimeout(res, ms));
    buttonYesElement.style.opacity = 0;
    buttonNoElement.style.opacity = 0;

    await delay(1000);
    buttonYesElement.style.display = 'none';
    buttonNoElement.style.display = 'none';
    resultTextElement.textContent = '🎉 Viva! Você disse Sim!!! 🥳';
    resultTextElement.style.display = 'flex';

    await delay(3000);
    divEndButtonsElement.style.display = 'flex';
    restartButton.onclick = () => restart();
    createButton.onclick = () => create();

    function restart() {
        window.location.reload();
    }

    function create() {
        window.location.replace(window.location.href.split('?')[0]);
    }
}