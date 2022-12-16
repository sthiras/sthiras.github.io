Object.defineProperty(HTMLMediaElement.prototype, 'playing', {
  get: function () {
      return !!(this.currentTime > 0 && !this.paused && !this.ended && this.readyState > 2);
  }
});

document.addEventListener('DOMContentLoaded', function(){
    if(document.querySelectorAll('[autoplay]').length > 0){
      window.addEventListener('click', videoAutoplay);
      window.addEventListener('touchstart', videoAutoplay);
    }
    if(document.getElementsByClassName("video-grid").length > 0){
      videoScroll();
      window.addEventListener('resize', videoScroll);
      window.addEventListener('scroll', videoScroll);
    }
});

function videoAutoplay() {
  const videoElm = document.querySelectorAll('[autoplay]');
  for (let i = 0; i < videoElm.length; i++) {
    if (videoElm[i].playing) {
        // video is already playing so do nothing
    }
    else {
        // video is not playing
        // so play video now
        videoElm[i].play();
        videoElm[i].removeAttribute('autoplay');
    }
  }
}

function videoScroll() {
      let windowHeight = window.innerHeight;
      const videoBlock = document.getElementsByClassName("video-grid");
      for (let i = 0; i < videoBlock.length; i++) {
  
          let thisVideoBlock = videoBlock[i],
              videoBlockTop = thisVideoBlock.getBoundingClientRect().top,
              videoBlockBottom = thisVideoBlock.getBoundingClientRect().bottom;
              videoElm = thisVideoBlock.getElementsByTagName("video");

          if (videoBlockTop <= (windowHeight/2) && videoBlockBottom >= (windowHeight/2)) {
              for (let j = 0; j < videoElm.length; j++){
                if(!videoElm[j].playing){
                  videoElm[j].play();
                }
              }
                //console.log("play" + i);
          } else {
              for (let j = 0; j < videoElm.length; j++){
                if(videoElm[j].playing){
                  videoElm[j].pause();
                }
              }
              //console.log("pause" + i);
          }
  
      }
  }