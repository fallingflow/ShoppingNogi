const theme = document.getElementById('#navigator-theme')
let themeText = document.getElementById('#navigator-theme-text')

$(document).ready(function() {
    const themeButton = document.getElementById('navigator-theme');
    const themeText = document.getElementById('navigator-theme-text');

    const isUserColorTheme = localStorage.getItem('color-theme');
    const isOsColorTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const getUserTheme = () => (isUserColorTheme ? isUserColorTheme : isOsColorTheme);

    const applyTheme = (theme) => {
        document.documentElement.setAttribute('color-theme', theme);
        localStorage.setItem('color-theme', theme);
        themeText.innerText = theme === 'dark' ? '밝은 모드로' : '다크 모드로';
    };

    window.onload = function() {
        applyTheme(getUserTheme());
    };

    themeButton.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('color-theme');
        // console.log('clicked')
        // console.log(currentTheme)
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
    });
})
