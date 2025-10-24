"use strict";

class Vector2
{
    constructor(x=0, y=0)
    {
        this.x = x;
        this.y = y;
    }

    static get zero()
    {
        return new Vector2();
    }

    static get one()
    {
        return new Vector2(1, 1);
    }

    static get up()
    {
        return new Vector2(0, 1);
    }

    static get down()
    {
        return new Vector2(0, -1);
    }

    static get left()
    {
        return new Vector2(-1, 0);
    }

    static get right()
    {
        return new Vector2(1, 0);
    }

    get magnitude()
    {
        return Math.sqrt(this.x * this.x, this.y * this.y);
    }

    get normalised()
    {
        return new Vector2(this.x / this.magnitude, this.y / this.magnitude);
    }

    Normalise()
    {
        this.x /= this.magnitude;
        this.y /= this.magnitude;
    }
}   

class Transform
{
    constructor(position=Vector2.zero, rotation=Vector2.zero, scale=Vector2.one)
    {
        this.position = position;
        this.rotation = rotation;
        this.scale = scale;

        this.dimensions = Vector2.zero;

        this.velocity = Vector2.zero;
    }
    
    get trueDimensions()
    {
        return new Vector2(this.dimensions.x * this.scale.x, this.dimensions.y * this.scale.y * 0.5);
    }

    Update()
    {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}

class Sprite
{
    constructor(path="resources/missingTexture.png", transform=new Transform())
    {
        this.transform = transform;

        this.path = path;
        this.img = new Image(this.transform.scale.x, this.transform.scale.y);
        this.img.src = path;

        this.img.onload = () =>
        {
            this.transform.dimensions = new Vector2(this.img.width, this.img.height);
        }
    }

    Update()
    {
        this.transform.Update();
    }

    Draw()
    {
        if (this.img.complete)
        {
            Application.Instance.ctx.drawImage(this.img, this.transform.position.x, this.transform.position.y, this.transform.trueDimensions.x, this.transform.trueDimensions.y);
        }
    }
}

class Scene
{
    constructor()
    {
        
    }

    Update()
    {
        
    }

    Draw()
    {
        
    }
}

class Application
{
    constructor(wh, border="0px", background="none")
    {
        if (Application.Instance)
        {
            throw new Error("Application class can only have one instance!");
        }

        else
        {
            Application.Instance = this;
        }

        this.c = document.getElementById("mainCanvas");

        this.c.style.border = border;

        this.c.style.width = wh[0];
        this.c.style.height = wh[1];

        this.c.style.background = background;

        this.ctx = this.c.getContext("2d");

        this.ctx.imageSmoothingEnabled = false;

        this.deltaTime;
        this.lastTimestamp;

        this.mousePosition = Vector2.zero;

        this.testSprite = new Sprite(undefined, new Transform(new Vector2(20, 20), Vector2.zero, new Vector2(10, 10)));

        this.animationFrameRequest = null;
    }

    static Instance;

    Start()
    {
        if (!this.animationFrameRequest)
        {
            this.animationFrameRequest = window.requestAnimationFrame(this.Update.bind(this));

            this.c.addEventListener("mousemove", this.UpdateMouse);
            this.c.addEventListener("mouseenter", this.UpdateMouse);
            this.c.addEventListener("mouseleave", this.UpdateMouse);
        }
    }

    Stop()
    {
        if (this.animationFrameRequest)
        {
            window.cancelAnimationFrame(this.animationFrameRequest);

            this.c.removeEventListener("mousemove");
            this.c.removeEventListener("mouseenter");
            this.c.removeEventListener("mouseleave");

            this.animationFrameRequest = null;
        }
    }

    Update()
    {
        this.animationFrameRequest = window.requestAnimationFrame(this.Update.bind(this));

        const timestamp = window.performance.now();

        this.deltaTime = (timestamp - this.lastTimestamp) / 1000;
        this.lastTimestamp = timestamp;

        this.testSprite.Update();

        this.Draw();
    }

    Draw()
    {
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, 300, 150);

        this.testSprite.Draw();
    }

    UpdateMouse(event)
    {
        const bounds = Application.Instance.c.getBoundingClientRect();

        Application.Instance.mousePosition.x = event.clientX - bounds.left;
        Application.Instance.mousePosition.y = event.clientY - bounds.top;
    }
}

export default Application;