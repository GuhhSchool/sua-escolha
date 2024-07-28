const buttonNoElement = document.querySelector('.button__main--no');

buttonNoElement.addEventListener('mouseover', hover);
buttonNoElement.addEventListener('click', hover);

function hover(button) {
    const limitX = window.innerWidth - 50;
    const limitY = window.innerHeight - 50;
    const buttonWidth = buttonNoElement.clientWidth;
    const buttonHeight = buttonNoElement.clientHeight;
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