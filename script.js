document.addEventListener('DOMContentLoaded', function(){
    
    const project_elm = document.getElementsByClassName("home-projects")[0];

    project_elm.addEventListener('mousemove', e => {
        project_elm.style.setProperty('--mousex', e.clientX + 5 + 'px');
        project_elm.style.setProperty('--mousey', e.clientY + 5 + 'px');
    });

});