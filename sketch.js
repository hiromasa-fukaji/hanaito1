let numDense = 2;
let powVal = 1;
let img;

const PARAMS = {
  numLines: 85,
  res: 100,
  blackWeight: 5.72,
  yellowWeight: 4.94,
  yellowOffset: 5,
  whiteAmp: 35,
  whiteOffset: -5.4
};

let pane;

function preload() {
  img = loadImage('design_1.jpg');
}

function setup() {
  createCanvas(img.width, img.height, SVG);
  background("#000000");

  img.resize(width, height);
  img.loadPixels();

  noFill();

  pane = new Tweakpane.Pane({
    title: 'Line Controls',
    container: (() => {
      const c = document.createElement('div');
      c.id = 'tweakpane-container';
      document.body.appendChild(c);
      return c;
    })()
  });

  pane.element.style.width = '350px';

  setTimeout(() => {
    document.querySelectorAll('#tweakpane-container .tp-lblv_v').forEach(el => {
      el.style.flex = '1 1 78%';
      el.style.minWidth = '0';
    });
    document.querySelectorAll('#tweakpane-container .tp-sldv').forEach(el => {
      el.style.width = '100%';
    });
  }, 0);

  pane.addInput(PARAMS, 'numLines', {
    label: 'Lines',
    min: 85,
    max: 150,
    step: 1
  });

  pane.addInput(PARAMS, 'res', {
    label: 'ResNum',
    min: 10,
    max: 100,
    step: 0.1
  });

  pane.addInput(PARAMS, 'whiteAmp', {
    label: 'Hight',
    min: 5,
    max: 35,
    step: 0.1
  });

  pane.addInput(PARAMS, 'whiteOffset', {
    label: 'Xpos',
    min: -20,
    max: 10,
    step: 0.1
  });

  pane.addInput(PARAMS, 'blackWeight', {
    label: 'Black',
    min: 0.5,
    max: 5.7,
    step: 0.1
  });

  pane.addInput(PARAMS, 'yellowWeight', {
    label: 'Yellow',
    min: 0.5,
    max: 7,
    step: 0.1
  });

  pane.addButton({ title: 'Save SVG' }).on('click', savesvg);
}

function draw() {
  background("#ffffffff");

  let offsetAmpWhite = PARAMS.whiteAmp;
  let offsetXWhite = PARAMS.whiteOffset;

  for (let i = 0; i < PARAMS.numLines; i++) {

    let x = map(i, 0, PARAMS.numLines - 1, 0, width);

    for (let n = numDense - 1; n >= 0; n--) {

      let isWhite = (n === 1);

      let colLine = isWhite ? "#3e3e3eff" : "#d6d671ff";
      let weight = isWhite ? PARAMS.blackWeight : PARAMS.yellowWeight;

      let offsetAmp = isWhite ? offsetAmpWhite : 0;
      let offsetX = isWhite ? offsetXWhite : PARAMS.yellowOffset;

      stroke(colLine);
      strokeWeight(weight);

      beginShape();
      for (let t = 0; t < PARAMS.res; t++) {

        let py = (t / (PARAMS.res - 1)) * height;

        let getX = constrain(floor(x), 0, img.width - 1);
        let getY = constrain(floor(py), 0, img.height - 1);

        let col = img.get(getX, getY);
        let bri = 1 - brightness(col) / 100;
        bri = pow(bri, powVal);

        let px = x + offsetX + n * bri * offsetAmp;

        vertex(px, py);
      }
      endShape();
    }
  }
}

function savesvg() {
  save("mySVG.svg");
}
