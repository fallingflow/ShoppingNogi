function changeTheme(){
    let theme = document.getElementById('navigator-theme-text')
    let themeText = theme.innerText

    if (themeText == '밝은 모드로'){
        theme.innerText = '다크 모드로'

        $('html, body').css('background-color', '#fff')

        $('#header').css('background', 'linear-gradient(90deg, #F09319, #ABBA7C)')
        $('#header').css('background-color', '')

        $('#container').css('background-color', '#fff')

        $('#navigator').css('background-color', '#fff')
        $('#navigator').css('color', '#000')
        $('#navigator').css('border', '1px solid #ccc')

        $('#container').css('background-color', '#fff')
        $('#content').css('background-color', '#fff')
        $('#content').css('border', '1px solid #ccc')
        $('#content-article').css('color', '#000')
        $('#content th, td').css('border-bottom', '1px solid #ccc')
        $('#item-list').css('color', '#000')

        $('#footer').css('background', 'linear-gradient(90deg, #F09319, #ABBA7C)')
        $('#footer').css('background-color', '')
        $('#footer').css('border', '0')

        $('#item-list-title').css('background-color', '#F09319')
    }
    else{
        theme.innerText = '밝은 모드로'

        $('html, body').css('background-color', '#000')

        $('#header').css('background-color', '#2e3033')
        $('#header').css('background', '')
        $('#header').css('color', '#ffffff')

        $('#navigator').css('background-color', '#1c1d1f')
        $('#navigator').css('color', '#fff')
        $('#navigator').css('border', '1px solid #444')

        $('.category-tooltip').css('background-color', '#333')

        $('#container').css('background-color', '#000')
        $('#content').css('background-color', '#1c1d1f')
        $('#content').css('border', '1px solid #444')
        $('#content-article').css('color', '#fff')

        $('#content th, td').css('border-bottom', '1px solid #444')
        $('#item-list').css('color', '#fff')

        $('#footer').css('background-color', '#2e3033')
        $('#footer').css('background', '')
        $('#footer').css('color', '#ffffff')
        $('#footer').css('border', '1px solid #444')

        $('#item-list-title').css('background-color', '#2e3033')
    }
}

$(document).ready(function () {
    $('#navigator-theme').click(function(){
        changeTheme()
    })
    $('#header-left-title').click(function(){
        window.location.href = '/'
    })
})