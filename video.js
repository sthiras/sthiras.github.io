let playingBlock = -1;

window.addEventListener('load', videoScroll);
window.addEventListener('resize', videoScroll);
window.addEventListener('scroll', videoScroll);

function videoScroll() {

    if ( document.getElementsByClassName("video-grid").length > 0) {
        let windowHeight = window.innerHeight;
        const videoBlock = document.getElementsByClassName("video-grid");
        for (let i = 0; i < videoBlock.length; i++) {
    
            let thisVideoBlock = videoBlock[i],
                videoBlockTop = thisVideoBlock.getBoundingClientRect().top,
                videoBlockBottom = thisVideoBlock.getBoundingClientRect().bottom;
                videoElm = thisVideoBlock.getElementsByTagName("video");

            if (videoBlockTop <= (windowHeight/2) && videoBlockBottom >= (windowHeight/2)) {
                if(playingBlock != i){
                  for (let j = 0; j < videoElm.length; j++){
                    videoElm[j].play();
                  }
                  //console.log("play" + i);
                  playingBlock = i;
                }
            } else if(playingBlock == i) {
                for (let j = 0; j < videoElm.length; j++){
                  videoElm[j].pause();
                }
                //console.log("pause" + i);
                playingBlock = -1;
            }
    
        }
    }
  
  }