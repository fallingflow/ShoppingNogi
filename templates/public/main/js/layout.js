function updateNavPosition(){
    const nav = document.getElementById('navigator')
    const windowWidth = window.innerWidth;
    const navWidth = nav.offsetWidth;
    const centerPosition = (windowWidth - navWidth) / 2;
    const newPositionX = centerPosition - 480;

    if(newPositionX < 30) nav.style.left = '30px';
    else nav.style.left = `${newPositionX}px`;
}

function updateTooltipPosition(){
    const tooltip = document.getElementsByClassName('category-tooltip')[0];
    const windowWidth = window.innerWidth;
    const tooltipWidth = tooltip.offsetWidth;
    const centerPosition = (windowWidth - tooltipWidth) / 2;
    const newPositionX = centerPosition - 330;

    if(newPositionX < 30) tooltip.style.left = '30px';
    else tooltip.style.left = `${newPositionX}px`;
}

$(document).ready(function () {
    window.addEventListener('resize', updateNavPosition);
    window.addEventListener('load', updateNavPosition);

    window.addEventListener('resize', updateTooltipPosition);
    window.addEventListener('load', updateTooltipPosition);

})