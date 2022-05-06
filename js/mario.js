//
//  おじさんクラス
//

const ANIME_STAND = 1;
const ANIME_WALK = 2;
const ANIME_BRAKE = 4;
const ANIME_JUMP = 8;
const GRAVITY = 4;
const MAX_SPEED = 32;

const TYPE_MINI = 1;
const TYPE_BIG = 2;
const TYPE_FIRE = 4;

let isGameOver = false;


class Ojisan {
    constructor(x, y) {
        //座標
        //座標小数　小数点は見えないけどあるという考え方
        this.x = x << 4;
        this.y = y << 4;
        this.ay = 16;
        this.w = 16;
        this.h = 16;
        this.vx = 0;
        this.vy = 0;
        this.anime = 0;
        this.snum = 0;
        this.acou = 0;
        this.dirc = 0;
        this.jump = 0;

        this.kinoko = 0;
        this.type = TYPE_MINI;
    }

    //床の判定
    checkFloor() {
        if (this.vy <= 0) return;
        let lx = ((this.x + this.vx) >> 4);
        let ly = ((this.y + this.vy) >> 4);

        let p = this.type == TYPE_MINI ? 2 : 0;

        if (field.isBlock(lx + 1 + p, ly + 31) ||
            field.isBlock(lx + 14 - p, ly + 31)) {
            if (this.anime == ANIME_JUMP) this.anime = ANIME_WALK;
            this.jump = 0;
            this.vy = 0;
            this.y = ((((ly + 31) >> 4) << 4) - 32) << 4;
        }
        if (this.y > 4000) {
            // ゲームオーバーのキャラが更に下に落ちてきた時にダイアログを表示し、各種変数を初期化する
            alert("GAME OVER  (F5でリロードしてね！)");
            isGameOver = false;
            this.jump = false;
        } else {

            if (this.y > 4000) {
                // 下まで落ちてきたらゲームオーバーとし、上方向の初速度を与える

                isGameOver = true;

            }

        }
    }

    //横の壁判定
    checkWall() {
        let lx = ((this.x + this.vx) >> 4);
        let ly = ((this.y + this.vy) >> 4);

        let p = this.type == TYPE_MINI ? 16 + 8 : 9;


        //右側のチェック
        if (field.isBlock(lx + 15, ly + p) ||
            (this.type == TYPE_BIG && (
                field.isBlock(lx + 15, ly + 15) ||
                field.isBlock(lx + 15, ly + 24)))) {
            this.vx = 0;
            this.x -= 8;
        } //左側のチェック 
        else if (field.isBlock(lx, ly + 9) ||
            field.isBlock(lx, ly + 15) ||
            field.isBlock(lx, ly + 24)) {
            this.vx = 0;
            this.x += 8;
        }
    }
    //天井の判定
    checkCeil() {
        //下方向に向かっているときは実行しない
        if (this.vy >= 0) return;

        let lx = ((this.x + this.vx) >> 4);
        let ly = ((this.y + this.vy) >> 4);

        let ly2 = ly + (this.type == TYPE_MINI ? 21 : 5);

        let bl;
        //右側のチェック
        if (bl = field.isBlock(lx + 8, ly2)) {
            this.jump = 15;
            this.vy = 0;

            let x = (lx + 8) >> 4;
            let y = (ly2) >> 4;

            if (bl == 374) {

            }
            if (bl != 371) {
                block.push(new Block(374, x, y));
                item.push(new Item(218, x, y, 0, 0, ITEM_KINOKO));
                // item.push(new Item(486, x, y, 0, 0,ITEM_KUSA));
            } else if (this.type == TYPE_MINI) {
                block.push(new Block(bl, x, y));
            } else {
                block.push(new Block(bl, x, y, 1, 20, -60));
                block.push(new Block(bl, x, y, 1, -20, -60));
                block.push(new Block(bl, x, y, 1, 20, -20));
                block.push(new Block(bl, x, y, 1, -20, -20));
            }


        }
    }

    //ジャンプ処理
    updateJump() {
        //ジャンプ Aボタンを押したとき
        if (keyb.ABUTTON) {

            //押していなかったら
            if (this.jump == 0) {
                this.anime = ANIME_JUMP;
                this.jump = 1;
            }
            if (this.jump < 15) this.vy = -(64 - this.jump);

        }
        //!this.jump =0 と同義
        if (this.jump) this.jump++;

    }

    //横方向の移動
    updateWalkSub(dir) {

        //最高速まで加速
        if (dir == 0 && this.vx < MAX_SPEED) this.vx++;
        if (dir == 1 && this.vx > -MAX_SPEED) this.vx--;


        //  ジャンプしていないとき
        if (!this.jump) {
            //立ちポーズ時カウンタリセット
            if (this.anime == ANIME_STAND) this.acou = 0;
            //アニメを歩きアニメにする
            this.anime = ANIME_WALK;

            //方向指定
            this.dirc = dir;
            //逆方向の時はブレーキをかける
            if (dir == 0 && this.vx < 0) this.vx++;
            if (dir == 1 && this.vx > 0) this.vx--;

            //逆に強い加速の時はブレーキアニメ
            if (dir == 1 && this.vx > 8 || dir == 0 && this.vx < -8) this.anime = ANIME_BRAKE;

        }
    }

    //歩く処理
    updateWalk() {
        //横移動
        if (keyb.Left) {
            this.updateWalkSub(1);
        } else if (keyb.Right) {
            this.updateWalkSub(0);

        } else {
            if (!this.jump) {
                if (this.vx > 0) this.vx -= 1;
                if (this.vx < 0) this.vx += 1;
                if (!this.vx) this.anime = ANIME_STAND;
            }

        }
    }
    //スプライトを変える処理
    updateAnim() {
        //  スプライトの決定
        switch (this.anime) {
            case ANIME_STAND:
                this.snum = 0;
                break;
            case ANIME_WALK:
                this.snum = 2 + ((this.acou / 6) % 3);
                break;
            case ANIME_JUMP:
                this.snum = 6;
                break;
            case ANIME_BRAKE:
                this.snum = 5;
                break;
        }
        // ちっちゃいおじさんの時は+32
        if (this.type == TYPE_MINI) this.snum += 32;
        //左向きの時は+48を使う。
        if (this.dirc) this.snum += 48;
    }

    //毎フレームごとの更新処理
    update() {
        // キノコを取った時のエフェクト
        if (this.kinoko) {
            let anime = [32, 14, 32, 14, 32, 14, 0, 32, 14, 0];
            this.snum = anime[this.kinoko >> 2];
            this.h = this.snum == 32 ? 16 : 32;
            if (this.dirc) this.snum += 48;

            if (++this.kinoko == 40) {
                this.type = TYPE_BIG;
                this.ay = 0;
                this.kinoko = 0;
            }

            return;


        }





        //アニメ用のカウンタ
        this.acou++;
        if (Math.abs(this.vx) == MAX_SPEED) this.acou++;

        this.updateJump();
        this.updateWalk();
        this.updateAnim();

        //重力
        if (this.vy < 64) this.vy += GRAVITY;

        //横の壁のチェック
        this.checkWall();

        //床のチェック
        this.checkFloor();

        //天井の壁チェック
        this.checkCeil();



        //実際に座標を変えてるところ。

        this.x += this.vx;
        this.y += this.vy;

        // //床にぶつかる
        // if (this.y > 160 << 4) {
        //     if (this.anime == ANIME_JUMP) this.anime = ANIME_WALK;
        //     this.jump = 0;
        //     this.vy = 0;
        //     this.y = 160 << 4;
        // }

    }
    //毎フレームごとの描画処理
    draw() {
        let px = (this.x >> 4) - field.scx;
        let py = (this.y >> 4) - field.scy;

        let sx = (this.snum & 15) * 16;
        let sy = (this.snum >> 4) * 16;

        let w = this.w;
        let h = this.h;

        py += (32 - h)

        vcon.drawImage(chImg, sx, sy, w, h, px, py, w, h);
    }
}