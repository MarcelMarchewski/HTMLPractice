class Transform
{
    constructor(position, rotation, scale)
    {
        this.pos = position;
        this.rot = rotation;
        this.scale = scale;

        this.vel = [0, 0];

        this.wh = [0, 0];
    }

    get realScale()
    {
        return [this.wh[0] * this.scale[0], this.wh[1] * this.scale[1]];
    }

    Update(delta)
    {
        this.pos[0] += this.vel[0] * delta;
        this.pos[1] += this.vel[1] * delta;
    }
}

class Sprite
{
    constructor(context, transform, path)
    {
        this.context = context;

        this.transform = transform;

        this.img = new Image();
        this.img.src = path;

        this.img.onload = () =>
        {
            this.transform.wh = [this.img.width, this.img.height];
        }
    }

    Update(delta)
    {
        this.transform.Update(delta);
    }

    DrawImage()
    {
        if (this.img.complete)
        {
            this.context.drawImage(this.img, this.transform.pos[0], this.transform.pos[1], this.transform.realScale[0], this.transform.realScale[1]);
        }
    }
}

function RandomRange(x, y)
{
    return Math.floor(Math.random() * (y - x + 1)) + x;
}

function BoundaryCheck(sprite)
{
    if (sprite.transform.pos[0] < 0 || sprite.transform.pos[0] + sprite.transform.realScale[0] > 300)
    {
        sprite.transform.vel[0] *= -1;

        if (sprite.transform.vel[0] < 0)
        {
            sprite.transform.pos[0] = 300 - sprite.transform.realScale[0];

            sprite.transform.vel[0] = -RandomRange(xVelRange[0], xVelRange[1]);
        }

        else
        {
            sprite.transform.pos[0] = 0;

            sprite.transform.vel[0] = RandomRange(xVelRange[0], xVelRange[1]);
        }
    }

    if (sprite.transform.pos[1] < 0 || sprite.transform.pos[1] + sprite.transform.realScale[1] > 150)
    {
        sprite.transform.vel[1] *= -1;

        if (sprite.transform.vel[1] < 0)
        {
            sprite.transform.pos[1] = 150 - sprite.transform.realScale[1];

            sprite.transform.vel[1] = -RandomRange(yVelRange[0], yVelRange[1]);
        }

        else
        {
            sprite.transform.pos[1] = 0;

            sprite.transform.vel[1] = RandomRange(yVelRange[0], yVelRange[1]);
        }
    }
}

let c;
let ctx;

let test;

const xVelRange = [50, 100];
const yVelRange = [25, 50];

let secondsPassed = 0;
let oldTimeStamp = 0;
let fps = 0;

window.onload = init;

function init()
{
    c = document.getElementById("mainCanvas");
    ctx = c.getContext("2d");

    ctx.imageSmoothingQuality = "high";

    test = new Sprite(ctx, new Transform([0, 0], [0, 0], [0.01, 0.01]), "resources/dvdLogo.png");
    test.transform.vel[0] = RandomRange(xVelRange[0], xVelRange[1]);
    test.transform.vel[1] = RandomRange(yVelRange[0], yVelRange[1]);

    window.requestAnimationFrame(main);
}

function main(timeStamp)
{
    update();

    draw();

    drawFPS(timeStamp);

    window.requestAnimationFrame(main);
}

function update()
{
    test.Update(secondsPassed);

    BoundaryCheck(test);
}

function draw()
{
    ctx.fillStyle = "#ADD8E6";
    ctx.fillRect(0, 0, 300, 150);

    test.DrawImage();
}

function drawFPS(timeStamp)
{
    secondsPassed = (timeStamp - oldTimeStamp) / 1000;
    oldTimeStamp = timeStamp;

    fps = Math.round(1 / secondsPassed);

    ctx.font = '10px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText("FPS: " + fps, 5, 10);
}