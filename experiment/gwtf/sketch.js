let npoints = 100;
let nlines = 70;
let step = 8;
let gap = 14;
let cnv;
let img = [];
let nkeyframe = 0;
let keyframe = 0;
let kfblend = 0;
let hline = [];
let adjgap = [];
let speed = 625; //millisec
let contrast = 0.7;
let active = 0;
let permissionGranted = false;

function preload() {
  img[0] = loadImage('experiment/gwtf/frames/0.png');
  img[1] = loadImage('experiment/gwtf/frames/1.png');
  img[2] = loadImage('experiment/gwtf/frames/2.png');
  img[3] = loadImage('experiment/gwtf/frames/3.png');
  img[4] = loadImage('experiment/gwtf/frames/4.png');
  img[5] = loadImage('experiment/gwtf/frames/5.png');
  img[6] = loadImage('experiment/gwtf/frames/6.png');
  img[7] = loadImage('experiment/gwtf/frames/7.png');
  img[8] = loadImage('experiment/gwtf/frames/8.png');
}

function setup() {
  pixelDensity(constrain(displayDensity(),0,2));
  frameRate(32);
  cnv = createCanvas(800-8, 800-8);
  //cnv.parent("frame");
  cnv.mouseOut(recenter);
  cnv.mouseOver(activate);
  
  nkeyframe = img.length;
  
  img.forEach((imgelem, imgindex) => {
    
  imgelem.loadPixels();
    
  hline[imgindex] = [];
  adjgap[imgindex] = [];
  
  createhline(hline[imgindex],nlines,npoints);
  inithline(hline[imgindex][0]);
  
  hline[imgindex].forEach((lelem, lindex) => hline[imgindex][lindex] = lindex > 0 ? offsetline(hline[imgindex][lindex-1],gap,img[imgindex]) : hline[imgindex][lindex]);
  hline[imgindex].forEach((lelem, lindex) => adjgap[imgindex][lindex] = adjacentgapy(hline[imgindex][lindex+1],hline[imgindex][lindex]));
    
  }
  );
  
  // DeviceOrientationEvent, DeviceMotionEvent
  if (typeof(DeviceOrientationEvent) !== 'undefined' && typeof(DeviceOrientationEvent.requestPermission) === 'function') {
    // ios 13 device
    
    DeviceOrientationEvent.requestPermission()
      .catch(() => {
        // show permission dialog only the first time
        let button = createButton("click to allow access to sensors");
        button.style("font-size", "24px");
        button.center();
        button.mousePressed( requestAccess );
        throw error;
      })
      .then(() => {
        // on any subsequent visits
        permissionGranted = true;
      })
  } else {
    // non ios 13 device
    textSize(48);
    // text("non ios 13 device", 100, 100);
    permissionGranted = true;
  }
  
}

function requestAccess() {
  DeviceOrientationEvent.requestPermission()
    .then(response => {
      if (response == 'granted') {
        permissionGranted = true;
      } else {
        permissionGranted = false;
      }
    })
  .catch(console.error);
  
  this.remove();
}

function draw() {
  background(0);
  
  let cx = width/2;
  
  if (active) {
    cx = constrain(mouseX,0,width);
  }
  else if(permissionGranted) {
      cx = constrain((-rotationY*10)+(width/2), 0, width-1);
  }
  
    keyframe = constrain(Math.floor((cx/width)*(nkeyframe-1)),0,nkeyframe-2);
    kfblend = ((cx/width)*(nkeyframe-1))-keyframe;
  
  stroke(255);
  noFill();

  hline[keyframe].forEach((lelem, lindex) => drawinterline(lelem,adjgap[keyframe][lindex],hline[keyframe+1][lindex],adjgap[keyframe+1][lindex],kfblend,(millis()%speed)/speed));
}

function createhline(lines,n,npoints) {
  for(i=0;i<n;i++)
    {
      lines[i] = [];
      for(j=0;j<npoints;j++)
        {
          lines[i][j] = [0,0];
        }
    }
}

function inithline(point) {
  for(i=0;i<point.length;i++)
    {
      point[i][0] = i*step;
      point[i][1] = 0;
    }
}

function offsetline(point,dist,imgage) {
  let newpoint = [];
  let dx = 0;
  let dy = 0;
  let slope = 0;
  let newslope = 0;
  let b = 0;
  let newb = 0;
  for(i=0;i<point.length;i++)
    {
      slope = newslope;
      b = newb;
      if (i != point.length-1)
        {
          dx = point[i+1][0] - point[i][0];
          dy = point[i+1][1] - point[i][1];
          newslope = dy/dx;
        }
      let newdx = -dy*dist/Math.sqrt((dx*dx)+(dy*dy));
      let newdy = Math.sqrt((dist*dist)-(newdx*newdx));
      //let newdy = 40;
      let newx = point[i][0]+newdx;
      let newy = point[i][1]+newdy;
      newb = newy - (newslope*newx);
      
      if (i == 0 || i == point.length-1 || slope == newslope || Math.abs((newslope-slope)/slope) < 0.005 )
        {
          newpoint[i] = [point[i][0],point[i][1]+dist];
        }
      else
        {
          newpoint[i] = [(newb-b)/(slope-newslope),((slope*newb)-(newslope*b))/(slope-newslope)];
        }
    }

  newpoint = resample(newpoint,step);
  newpoint = valuelookup(newpoint,point,imgage);

  return newpoint;
}

function resample(point,steplen) {
  let newpoint = [];
  let curstep = 0;  
  for(i=0;i<point.length-1;i++)
    {
      let seglenx = point[i+1][0]-point[i][0];
      while(curstep*steplen < point[i+1][0] && curstep <= point.length-1)
        {

          let newy = point[i][1]+((point[i+1][1]-point[i][1])*((curstep*steplen)-point[i][0])/seglenx); //lerp
          newpoint[curstep] = [curstep*steplen,newy];
          curstep++;
        }
    }
  newpoint[point.length-1] = point[point.length-1];
  return newpoint;
}

function valuelookup(point,prvpoint,image) {
  let newpoint = [];
  for(i=0;i<prvpoint.length;i++)
    {
      let imgx = Math.round(point[i][0]/width*(image.width-1));
      let imgy = Math.round((point[i][1] >= height ? image.height-1 : point[i][1]) / height*(image.height-1));
      let imgpxnum = (imgy*image.width)+imgx;
      let imgpxval = image.pixels[imgpxnum*4]/255;
      let gapy = point[i][1]-prvpoint[i][1];
      newpoint[i] = [point[i][0],point[i][1]-(imgpxval*gapy*contrast)];
    }
  return newpoint;
}

function adjacentgapy(pointa,pointb) {
  let gapy = [];
  for(i=0;i<pointb.length;i++)
    {
      if (pointa != null && pointa != null)
        gapy[i] = pointa[i][1]-pointb[i][1];
      else
        gapy[i] = 0;
    }
  return gapy;
}

function drawinterline(pointa,offstya,pointb,offstyb,blend,anim) {
  beginShape();
    let vx = pointa[0][0]+((pointb[0][0]-pointa[0][0])*blend); //lerp
    let vy = pointa[0][1]+((pointb[0][1]-pointa[0][1])*blend);
    let voffsty = offstya[0]+((offstyb[0]-offstya[0])*blend);
    curveVertex(vx,vy+(voffsty*anim)); //repeat first vertex
    for(i=0;i<pointa.length;i++)
      {
        vx = pointa[i][0]+((pointb[i][0]-pointa[i][0])*blend); //lerp
        vy = pointa[i][1]+((pointb[i][1]-pointa[i][1])*blend);
        voffsty = offstya[i]+((offstyb[i]-offstya[i])*blend);
        curveVertex(vx,vy+(voffsty*anim));
      }
    curveVertex(vx,vy+(voffsty*anim)); //repeat last vertex 
  endShape();
}

function recenter() {
  active = 0;
}

function activate() {
  active = 1;
}