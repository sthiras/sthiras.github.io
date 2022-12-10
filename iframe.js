const frame = document.getElementById("iframe");

frame.style.display = "block";

frame.addEventListener('load', e => {

    const frame_project = frame.contentWindow.document.getElementsByClassName("home-projects")[0];

    const head  = frame.contentWindow.document.getElementsByTagName('head')[0];
    const link  = frame.contentWindow.document.createElement('link');
    link.rel  = 'stylesheet';
    link.type = 'text/css';
    link.href = 'iframe.css';
    link.media = 'all';
    head.appendChild(link);

    frame.style.height = frame_project.scrollHeight + 1 + 'px';
    frame_project.addEventListener('click', e2 => {
        frame.style.height = frame_project.scrollHeight + 1 + 'px';
    });

});
