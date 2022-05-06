// 
// キノコやアイテムのクラス
// 
const ITEM_KINOKO = 1;
const ITEM_KUSA = 2;
const ITEM_STAR = 4;
const ITEM_FIRE = 8;


class Item extends Sprite {
    constructor(sp, x, y, vx, vy, tp) {
        super(sp, x, y, vx, vy);
        if (tp == undefined) tp = ITEM_KINOKO;
        this.tp = tp;
    }


    //横の壁判定
    checkWall() {
        let lx = ((this.x + this.vx) >> 4);
        let ly = ((this.y + this.vy) >> 4);

        //右側のチェック
        if (field.isBlock(lx + 15, ly + 3) ||
            field.isBlock(lx + 15, ly + 12) ||
            field.isBlock(lx, ly + 3) ||
            field.isBlock(lx, ly + 12)) {
            this.vx *= -1;
        }
    }



    //床の判定
    checkFloor() {
        if (this.vy <= 0) return;
        let lx = ((this.x + this.vx) >> 4);
        let ly = ((this.y + this.vy) >> 4);

        if (field.isBlock(lx + 1, ly + 15) || field.isBlock(lx + 14, ly + 15)) {
            this.vy = 0;
            this.y = ((((ly + 15) >> 4) << 4) - 16) << 4;
        }
    }
    // キノコの処理
    proc_kinoko() {
        if (this.checkHit(ojisan)) {

            ojisan.kinoko = 1;
            this.kill = true;
            return true;
        }

        if (++this.count <= 32) {
            this.sz = (1 + this.count) >> 1;
            this.y -= 1 << 3;
            if (this.count == 32) this.vx = 20;
            return true;
        }
        return false;
    }

    // 草の処理
    proc_kusa() {
        if (this.y > 0) {
            this.count++;
            if (this.count < 16) this.sz = this.count;
            else this.sz = 16;

            this.y -= 1 << 4;
        }
    }

    // 更新処理
    update() {
        if (this.kill) return;
        if (ojisan.kinoko) return;

        switch (this.tp) {
            case ITEM_KINOKO:
                if (this.proc_kinoko()) return;
                break;
            case ITEM_KUSA:
                this.proc_kusa();
                return;
        }


        this.checkWall();
        this.checkFloor();
        super.update();
    }

    draw() {
        super.draw();
        if (this.tp == ITEM_KUSA) {

            //&15 and演算子
            let c = (this.count - 16) >> 4;
            for (let i = 0; i <= c; i++) {
                let an = 486 + 16;
                let sx = (an & 15) << 4;
                let sy = (an >> 4) << 4;

                let px = (this.x >> 4) - (field.scx);
                let py = (this.y >> 4) - (field.scy);

                let s;
                if (i == c) s = (this.count % 16);
                else s = 16;
                py += 16 + i * 16;
                vcon.drawImage(chImg, sx, sy, 16, s, px, py, 16, s);
            }


        }
    }
}
