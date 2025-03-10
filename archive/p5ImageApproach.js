const lenis = new Lenis({
    duration: 1.2,
    // easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
    direction: 'vertical', // vertical, horizontal
    gestureDirection: 'vertical', // vertical, horizontal, both
    smooth: false,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 1,
    infinite: false,
    // wrapper: scroller, // element which has overflow
    // content: main, // usually wrapper's direct child
  })
  
  function mapRange (value, a, b, c, d) {
    value = (value - a) / (b - a);
    return c + value * (d - c);
  }
  
  function raf(time) {
    lenis.raf(time)
    requestAnimationFrame(raf)
  }
  requestAnimationFrame(raf)
  
  p5.disableFriendlyErrors = true;
  
  var imgs = [];
  var imgsB = [];
  var imgsL;
  var prog = 0;
  var pageL;
  var scrollLength = 0;
  
  var numElements = document.querySelectorAll('.image-canvas').length;
  var m;
  
  const JS_HOOK_FOOTER = '[js-hook-footer]';
  const footer = document.querySelector(JS_HOOK_FOOTER);
  const JS_HOOK_HEADER = '[js-hook-header]';
  const header = document.querySelector(JS_HOOK_HEADER);
  const JS_HOOK_LINKTOTOP = '[js-hook-linktotop]';
  const linktotop = document.querySelector(JS_HOOK_LINKTOTOP);
  
  var SS2 = false;
  var SS3 = false;
  var SS4 = false;
  var SS5 = false;
  var SS6 = false;
  
  $(linktotop).click(function() {
    $('html,body').animate({scrollTop: $('#content').offset().top}, 2500);
  }); 
  
  lenis.on('scroll', ({ scroll, limit, velocity, direction, progress }) => {
    prog = progress;
    pageL = limit;
  
    if (prog > .1 && !SS2) {
      new p5(s2, 'scarfs-02');
      SS2 = true;
    }
    if (prog > .25 && !SS3) {
      new p5(s3, 'scarfs-03');
      SS3 = true;
    }
    if (prog > .4 && !SS4) {
      new p5(s4, 'scarfs-04');
      SS4 = true;
    }
    if (prog > .55 && !SS5) {
      new p5(s5, 'scarfs-05');
      SS5 = true;
    }
    if (prog > .7 && !SS6) {
      new p5(s6, 'scarfs-06');
      SS6 = true;
    }
    
  })
  
  function masking(imgS, imgP, t) {
    for (let x = 0; x < imgS.width; x++) {
      for (let y = 0; y < imgS.height; y++) {
        let i = (x + y * imgS.width) * 4;
        let r = imgS.pixels[i + 0];
        let g = imgS.pixels[i + 1];
        let b = imgS.pixels[i + 2];
        let alphavalue = 255;
        if (r / 255 > t && g / 255 > t && b / 255 > t) {
        } else {
          alphavalue = 0;
        }
        imgP.pixels[i + 3] = alphavalue;
      }
    }
  }
  
  
  function outroMasking() {
    return mapRange(prog - .9, 0, .1, 0, 1.1);
  }
  
  
  var s1 = function( sketch ) {
    // img - imgMask
    // img2 - img
    // imgB - imgB
    let img, img2;
    let imgB;
    let imgW, imgH;
  
    sketch.preload = function() {
      if (window.mobileAndTabletCheck() == true) {
        img = sketch.loadImage('/assets/images/01-blur-small.png');
        img2 = sketch.loadImage('/assets/images/01-small.png');
      } else {
        img = sketch.loadImage('/assets/images/01-blur.png');
        img2 = sketch.loadImage('/assets/images/01.png');
      }
      imgB = img2;
      imgW = document.getElementById('scarfs-01').clientWidth;
      imgH = document.getElementById('scarfs-01').clientHeight;
    }
  
    sketch.setup = function() {
      sketch.createCanvas(imgW, imgH);
      // if (window.mobileAndTabletCheck() == true) {
      //   sketch.pixelDensity(1);
      // }
    }
    
    sketch.draw = function() {
      sketch.clear();
      img.loadPixels();
      imgB.loadPixels();
      masking(img, imgB,
        
      prog < .9 ? mapRange(prog, .1, 0, 0, 1) : outroMasking()
      
      );
      
      imgB.updatePixels();
      sketch.image(img2, 0, 0, imgW, imgH);
      img2 = imgB;
  
      if (prog > .95) {
        footer.classList.add("hidden")
      } else if (prog > .05) {
        footer.classList.remove("hidden")
      } else if (prog < .05) {
        footer.classList.add("hidden")
      }
  
      // if (prog > .95) {
      //   header.classList.add("hidden")
      // } else {
      //   header.classList.remove("hidden")
      // }
  
      if (prog > .95) {
        linktotop.classList.add("active")
      } else {
        linktotop.classList.remove("active")
      }
  
    }
  
    sketch.windowResized = function() {
      imgW = document.getElementById('scarfs-01').clientWidth;
      imgH = document.getElementById('scarfs-01').clientHeight;
      sketch.resizeCanvas(imgW, imgH);
    }
  };
  
  new p5(s1, 'scarfs-01');
  
  
  
  
  var s2 = function( sketch ) {
    let imgg, imgg2;
    let imggB;
    let imgW, imgH;
  
    sketch.preload = function() {
      if (window.mobileAndTabletCheck() == true) {
        imgg = sketch.loadImage('/assets/images/02-blur-small.png');
        imgg2 = sketch.loadImage('/assets/images/02-small.png');
      } else {
        imgg = sketch.loadImage('/assets/images/02-blur.png');
        imgg2 = sketch.loadImage('/assets/images/02.png');
      }
      imggB = imgg2;
      imgW = document.getElementById('scarfs-02').clientWidth;
      imgH = document.getElementById('scarfs-02').clientHeight;
    }
  
    sketch.setup = function() {
      sketch.createCanvas(imgW, imgH);
      // if (window.mobileAndTabletCheck() == true) {
      //   sketch.pixelDensity(1);
      // }
    }
    
    sketch.draw = function() {
      if (prog > .05 && prog < .25 || prog > .9) {
        sketch.clear();
        imgg.loadPixels();
        imggB.loadPixels();
        masking(imgg, imggB,
          
          prog < .9 ? mapRange(prog, .2, .1, 0, 1) : outroMasking()
        
        );
        imggB.updatePixels();
        sketch.image(imgg2, 0, 0, imgW, imgH);
        imgg2 = imggB;
      }
    }
  
    sketch.windowResized = function() {
      imgW = document.getElementById('scarfs-02').clientWidth;
      imgH = document.getElementById('scarfs-02').clientHeight;
      sketch.resizeCanvas(imgW, imgH);
    }
  };
  
  // new p5(s2, 'scarfs-02');
  
  
  
  
  var s3 = function( sketch ) {
    let imgg, imgg2;
    let imggB;
    let imgW, imgH;
  
    sketch.preload = function() {
      if (window.mobileAndTabletCheck() == true) {
        imgg = sketch.loadImage('/assets/images/03-blur-small.png');
        imgg2 = sketch.loadImage('/assets/images/03-small.png');
      } else {
        imgg = sketch.loadImage('/assets/images/03-blur.png');
        imgg2 = sketch.loadImage('/assets/images/03.png');
      }
      imggB = imgg2;
      imgW = document.getElementById('scarfs-03').clientWidth;
      imgH = document.getElementById('scarfs-03').clientHeight;
    }
  
    sketch.setup = function() {
      sketch.createCanvas(imgW, document.getElementById('scarfs-03').clientHeight);
      // if (window.mobileAndTabletCheck() == true) {
      //   sketch.pixelDensity(1);
      // }
    }
    
    sketch.draw = function() {
      if (prog > .2 && prog < .4 || prog > .9) {
        sketch.clear();
        imgg.loadPixels();
        imggB.loadPixels();
        masking(imgg, imggB,
          
          prog < .9 ? mapRange(prog, .35, .25, 0, 1) : outroMasking()
          
          );
        imggB.updatePixels();
        sketch.image(imgg2, 0, 0, imgW, imgH);
        imgg2 = imggB;
      }
    }
  
    sketch.windowResized = function() {
      imgW = document.getElementById('scarfs-03').clientWidth;
      imgH = document.getElementById('scarfs-03').clientHeight;
      sketch.resizeCanvas(imgW, imgH);
    }
  };
  
  // new p5(s3, 'scarfs-03');
  
  
  
  
  
  var s4 = function( sketch ) {
    let imgg, imgg2;
    let imggB;
    let imgW, imgH;
  
    sketch.preload = function() {
      if (window.mobileAndTabletCheck() == true) {
        imgg = sketch.loadImage('/assets/images/04-blur-small.png');
        imgg2 = sketch.loadImage('/assets/images/04-small.png');
      } else {
        imgg = sketch.loadImage('/assets/images/04-blur.png');
        imgg2 = sketch.loadImage('/assets/images/04.png');
      }
      imggB = imgg2;
      imgW = document.getElementById('scarfs-04').clientWidth;
      imgH = document.getElementById('scarfs-04').clientHeight;
    }
  
    sketch.setup = function() {
      sketch.createCanvas(imgW, document.getElementById('scarfs-04').clientHeight);
      // if (window.mobileAndTabletCheck() == true) {
      //   sketch.pixelDensity(1);
      // }
    }
    
    sketch.draw = function() {
      if (prog > .35 && prog < .55 || prog > .9) {
        sketch.clear();
        imgg.loadPixels();
        imggB.loadPixels();
        masking(imgg, imggB,
          
          prog < .9 ? mapRange(prog, .5, .4, 0, 1) : outroMasking()
          
          );
        imggB.updatePixels();
        sketch.image(imgg2, 0, 0, imgW, imgH);
        imgg2 = imggB;
      }
    }
  
    sketch.windowResized = function() {
      imgW = document.getElementById('scarfs-04').clientWidth;
      imgH = document.getElementById('scarfs-04').clientHeight;
      sketch.resizeCanvas(imgW, imgH);
    }
  };
  
  // new p5(s4, 'scarfs-04');
  
  
  
  
  
  var s5 = function( sketch ) {
    let imgg, imgg2;
    let imggB;
    let imgW, imgH;
  
    sketch.preload = function() {
      if (window.mobileAndTabletCheck() == true) {
        imgg = sketch.loadImage('/assets/images/05-blur-small.png');
        imgg2 = sketch.loadImage('/assets/images/05-small.png');
      } else {
        imgg = sketch.loadImage('/assets/images/05-blur.png');
        imgg2 = sketch.loadImage('/assets/images/05.png');
      }
      imggB = imgg2;
      imgW = document.getElementById('scarfs-05').clientWidth;
      imgH = document.getElementById('scarfs-05').clientHeight;
    }
  
    sketch.setup = function() {
      sketch.createCanvas(imgW, document.getElementById('scarfs-05').clientHeight);
      // if (window.mobileAndTabletCheck() == true) {
      //   sketch.pixelDensity(1);
      // }
    }
    
    sketch.draw = function() {
      if (prog > .5 && prog < .65 || prog > .9) {
        sketch.clear();
        imgg.loadPixels();
        imggB.loadPixels();
        masking(imgg, imggB,
          
          prog < .9 ? mapRange(prog, .65, .55, 0, 1) : outroMasking()
          
          );
        imggB.updatePixels();
        sketch.image(imgg2, 0, 0, imgW, imgH);
        imgg2 = imggB;
      }
    }
  
    sketch.windowResized = function() {
      imgW = document.getElementById('scarfs-05').clientWidth;
      imgH = document.getElementById('scarfs-05').clientHeight;
      sketch.resizeCanvas(imgW, imgH);
    }
  };
  
  // new p5(s5, 'scarfs-05');
  
  
  
  
  
  var s6 = function( sketch ) {
    let imgg, imgg2;
    let imggB;
    let imgW, imgH;
  
    sketch.preload = function() {
      if (window.mobileAndTabletCheck() == true) {
        imgg = sketch.loadImage('/assets/images/06-blur-small.png');
        imgg2 = sketch.loadImage('/assets/images/06-small.png');
      } else {
        imgg = sketch.loadImage('/assets/images/06-blur.png');
        imgg2 = sketch.loadImage('/assets/images/06.png');
      }
      imggB = imgg2;
      imgW = document.getElementById('scarfs-06').clientWidth;
      imgH = document.getElementById('scarfs-06').clientHeight;
    }
  
    sketch.setup = function() {
      sketch.createCanvas(imgW, document.getElementById('scarfs-06').clientHeight);
      // if (window.mobileAndTabletCheck() == true) {
      //   sketch.pixelDensity(1);
      // }
    }
    
    sketch.draw = function() {
      if (prog > .65 && prog < .85 || prog > .9) {
        sketch.clear();
        imgg.loadPixels();
        imggB.loadPixels();
        masking(imgg, imggB,
          
          prog < .9 ? mapRange(prog, .8, .7, 0, 1) : outroMasking()
          
          );
        imggB.updatePixels();
        sketch.image(imgg2, 0, 0, imgW, imgH);
        imgg2 = imggB;
      }
    }
  
    sketch.windowResized = function() {
      imgW = document.getElementById('scarfs-06').clientWidth;
      imgH = document.getElementById('scarfs-06').clientHeight;
      sketch.resizeCanvas(imgW, imgH);
    }
  };
  
  // new p5(s6, 'scarfs-06');
  
  
  
  window.mobileAndTabletCheck = function() {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
  };
  
  
  $(function() {
    setTimeout(() => {
      if ($(document).scrollTop() == 0){
        $('html,body').animate({scrollTop: $('#content').offset().top}, 1000);
      }
    }, 2000);
  });
  
  