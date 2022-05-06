

//仮想画面 HTML上で作るのではなくてjs上で作成する。
let vcan = document.createElement("canvas");
let vcon = vcan.getContext("2d");


//idの取得　domの取得
let can = document.getElementById("can");
//画像の内容とその情報とか操作するためのメソット
let con = can.getContext("2d");



//ファミコンの画面サイズ
vcan.width = SCREEN_SIZE_W;
vcan.height = SCREEN_SIZE_H;

can.width = SCREEN_SIZE_W * 3;
can.height = SCREEN_SIZE_H * 3;

//trueにするとアップコンバートがかかる。
con.mozimageSmoothingEnabled = false;
con.imageSmoothingEnabled = false;
con.webkitimageSmoothingEnabled = false;
con.msimageSmoothingEnabled = false;

//フレームレート維持
let frameCount = 0;
let statTime;


//Image imageというオブジェクトを新しく作る。
//srcに画像名を入れると画像を読み込み始める。
let chImg = new Image();
chImg.src = "sprite.png";
//画像を読み込み終わった時にonloadプロパティに入っている関数を呼び出す。
// chImg.onload = draw;

//おじさん情報

//キーボード
let keyb = {};

//おじさんを作る
let ojisan = new Ojisan(100, 100);

//フィールドを作る
let field = new Field();

let sprice =new Sprite();

// ブロックのオブジェクト
let block = [];
let item = [];

//2進数と16進数　対応を完璧にする。
//0から15
//0～F
//0000～1111

function updateObj(obj) {
    // スプライトのブロックを更新
    for (let i = obj.length - 1; i >= 0; i--) {
        obj[i].update();
        if (obj[i].kill) obj.splice(i, 1)
    }
}


//更新処理
function update() {
    // マップの更新
    field.update();

    updateObj(block);
    updateObj(item);


    // おじさんの更新
    ojisan.update();

    

}

    //スプライトの描画
    function drawSprite(snum, x, y) {
        //&15 and演算子
        let sx = (snum & 15) * 16;
        let sy = (snum >> 4) * 16;

        vcon.drawImage(chImg, sx, sy, 16, 32, x, y, 16, 32);
    }

    function drawObj(obj) {
        // スプライトのブロックを表示
        for (let i = 0; i < obj.length; i++)
            obj[i].draw();
    }


    //描画処理
    function draw() {
        //Contextに備わっているプロパティ RGBなどを入れる。画面を水色にしている。
        vcon.fillStyle = "#66AAFF"
        //Contextに備わっているメソット　四角を書くメソット　プロパティに沿って書いていく。
        vcon.fillRect(0, 0, SCREEN_SIZE_W, SCREEN_SIZE_H);

        //読みこみ終わる前に次の命令をする
        //drawImageが画像をテキストにコピーするためのメソット　Contextに備わっている。
        //drawImageがキャラクターを表示させるのに一番重要になる。
        //chImgには読み込んだスプレッドデータが入っている。
        //imageの０，０の地点から16px,32pxの地点をcanvasの一番上にコピーする。

        //マップを表示
        field.draw();

        drawObj(block);
        drawObj(item);


        //おじさん表示
        ojisan.draw();



        vcon.font = "10px 'Regular'";
        vcon.fillStyle = "#FFFFFF"
        //contextに備わっているメソット
        let timecount = parseInt(frameCount, 10);
        vcon.fillText("time " + (3000 - timecount), 190, 15);

        //仮想画面から実画面へ拡大転送
        con.drawImage(vcan, 0, 0, SCREEN_SIZE_W, SCREEN_SIZE_H,
            0, 0, SCREEN_SIZE_W * 2, SCREEN_SIZE_H * 2);
    }

    //一定の間隔でmainLoopを呼ぶ。
    // setInterval(mainLoop, 1000 / 60);

    //ループ開始
    window.onload = function () {
        //起動してからの時間を取得する。
        startTime = performance.now(); //msで取得される。

        mainLoop();

    }

    //メインループ
    //秒間60mmでmainLoopの処理を行う
    function mainLoop() {
        //mainの処理を行う。

        let nowTime = performance.now();
        let nowFrame = (nowTime - startTime) / GAME_FPS;

        if (nowFrame > frameCount) {

            let c = 0;
            //処理落ちしてしまっている場合
            while (nowFrame > frameCount) {

                frameCount++;

                //更新処理
                update();
                if (++c >= 4) break;


            }
            //描画処理
            draw();

        }

        requestAnimationFrame(mainLoop); //モニターによって60msにならない可能性がある。
    }


    //キーボードが押された時に呼ばれる関数
    document.onkeydown = function (e) {
        if (e.key === "ArrowLeft") keyb.Left = true;
        if (e.key === "ArrowRight") keyb.Right = true;
        if (e.key === "ArrowUp") keyb.ABUTTON = true;
        if (e.key === "ArrowDown") keyb.BBUTTON = true;

        if (e.key === "a") {
            block.push(new Block(368, 5, 5));
        }
        // if (e.key === "a") field.scx--;
        // if (e.key === "s") field.scx++;

    };
    //キーボードが離されたときに呼ばれる関数
    document.onkeyup = function (e) {
        if (e.key === "ArrowLeft") keyb.Left = false;
        if (e.key === "ArrowRight") keyb.Right = false;
        if (e.key === "ArrowUp") keyb.ABUTTON = false;
        if (e.key === "ArrowDown") keyb.BBUTTON = false;
    };
