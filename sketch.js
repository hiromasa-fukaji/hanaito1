let numLines = 85;
let numDense = 2;
let res = 100;
let powVal = 1;
let img;

// 黒・白ライン太さ
let blackWeight = 4.4 * 1.3;
let yellowWeight = 3.8 * 1.3;

// ---- 白ライン制御用スライダー ----
let sliderWhiteAmp;      // 揺れ幅
let sliderWhiteOffset;   // x方向のオフセット

// ---- 表示ラベル ----
let whiteAmpLabel;
let whiteOffsetLabel;

function preload() {
  img = loadImage('design_2_fix.jpg');
}

function setup() {
  background("#000000");
  createCanvas(img.width, img.height, SVG);

  // ● 白ラインの揺れ幅（山の大きさ）
  sliderWhiteAmp = createSlider(0, 50, 35, 0.1);
  sliderWhiteAmp.position(10, 10);
  sliderWhiteAmp.style('width', '150px');

  // ★ 数値表示
  whiteAmpLabel = createP("");
  whiteAmpLabel.position(170, 5);
  whiteAmpLabel.style("color", "white");

  // ● 白ラインの x方向位置（ライン全体の左右移動）
  sliderWhiteOffset = createSlider(-100, 100, -10.4, 0.1);
  sliderWhiteOffset.position(10, 40);
  sliderWhiteOffset.style('width', '150px');

  // ★ 数値表示
  whiteOffsetLabel = createP("");
  whiteOffsetLabel.position(170, 35);
  whiteOffsetLabel.style("color", "white");

  let button = createButton('Save SVG');
  button.position(10, 70);
  button.mousePressed(savesvg);

  img.resize(width, height);
  img.loadPixels();

  noFill();
}

function draw() {
  background("#ffffffff");

  let offsetAmpWhite = sliderWhiteAmp.value();
  let offsetXWhite = sliderWhiteOffset.value();

  // ★ スライダーの数値をリアルタイム表示
  whiteAmpLabel.html("Amp: " + offsetAmpWhite.toFixed(2));
  whiteOffsetLabel.html("Offset: " + offsetXWhite.toFixed(2));

  // ---- 描画処理 ----
  for (let i = 0; i < numLines; i++) {

    let x = map(i, 0, numLines - 1, 0, width);

    for (let n = numDense - 1; n >= 0; n--) {

      let isWhite = (n === 1);

      let colLine = isWhite ? "#3e3e3eff" : "#d6d671ff";
      let weight = isWhite ? blackWeight : yellowWeight;

      let offsetAmp = isWhite ? offsetAmpWhite : 0;
      let offsetX = isWhite ? offsetXWhite : 0;

      stroke(colLine);
      strokeWeight(weight);

      beginShape();
      for (let t = 0; t < res; t++) {

        let py = (t / (res - 1)) * height;

        // 画像の範囲外アクセスを防ぐために座標を制限
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
