"use strict";

export class Vector2
{
    constructor(x=0, y=0)
    {
        this.x = x;
        this.y = y;
    }

    static get negativeOne()
    {
        return new Vector2(-1, -1);
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
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    get normalised()
    {
        let _tmp = new Vector2(this.x / this.magnitude, this.y / this.magnitude);

        if (isNaN(_tmp.x))
        {
            _tmp.x = 0;
        }

        if (isNaN(_tmp.y))
        {
            _tmp.y = 0;
        }

        return _tmp;
    }

    Normalise()
    {
        this.x /= this.magnitude;
        this.y /= this.magnitude;

        if (isNaN(this.x))
        {
            this.x = 0;
        }

        if (isNaN(this.y))
        {
            this.y = 0;
        }
    }

    Add(_other)
    {
        this.x += _other.x;
        this.y += _other.y;
    }

    Subtract(_other)
    {
        this.x -= _other.x;
        this.y -= _other.y;
    }

    Multiply(_other)
    {
        this.x *= _other.x;
        this.y *= _other.y;
    }

    Divide(_other)
    {
        this.x /= _other.x;
        this.y /= _other.y;
    }
}   

export class Transform
{
    constructor(position=Vector2.zero, rotation=0, scale=Vector2.one)
    {
        this.position = position;
        this.rotation = rotation;
        this.scale = scale;

        this.dimensions = Vector2.zero;

        this.velocity = Vector2.zero;
    }
    
    get scaledDimensions()
    {
        return new Vector2(this.dimensions.x * this.scale.x, this.dimensions.y * this.scale.y);
    }
}

export class Animation
{
    constructor(resolution=new Vector2(32, 32), columnRow=Vector2.one, frameCount=1, speed=15)
    {
        this.resolution = resolution;

        this.columnRow = columnRow;
        this.frameCount = frameCount;

        this.speed = speed;

        this.playing = false;
        
        this._frameArray = this.GenerateFrameArray();
        this._currentFrame = 0;
    }

    GenerateFrameArray()
    {
        let tmp = [];

        rowLoop:
            for (let y = 0; y < this.columnRow.y; y++)
            {
                columnLoop:
                    for (let x = 0; x < this.columnRow.x; x++)
                    {
                        tmp[tmp.length] = new Vector2(Math.round((this.resolution.x + Application.Instance.SPRITE_PADDING) * x), Math.round((this.resolution.y + Application.Instance.SPRITE_PADDING) * y));

                        if (tmp.length == this.frameCount)
                        {
                            break rowLoop;
                        }
                    }
            }

        return tmp;
    }

    get nextFrame()
    {
        if (this._currentFrame < this.frameCount)
        {
            let frame = this._frameArray[this._currentFrame];

            this._currentFrame++;

            return frame;
        }

        else
        {
            this._currentFrame = 0;

            let frame = this._frameArray[this._currentFrame];

            this._currentFrame++;

            return frame;
        }
    }
}

export class Sprite
{
    constructor(path="resources/sprites/engine/missingTexture.png", transform=new Transform(), anim=new Animation())
    {
        this.transform = transform;

        this.path = path;
        this.img = new Image(this.transform.scale.x, this.transform.scale.y);
        this.img.src = path;

        this.onLoaded = null;

        this.img.onload = () =>
        {
            this.transform.dimensions = new Vector2(this.img.width, this.img.height);

            if (this.onLoaded != null)
            {
                this.onLoaded();
            }
        }

        this.anim = anim;

        this._currentFrame = this.anim.nextFrame;

        this._lastDrawcall = 0;
    }

    Draw()
    {
        this._lastDrawcall += Application.Instance.deltaTime;

        if (this._lastDrawcall > this.anim.speed / Application.Instance.SPRITE_FRAMERATE && this.anim.playing)
        {
            this._lastDrawcall = 0;

            this._currentFrame = this.anim.nextFrame;
        }

        if (this.img.complete)
        {
            Application.Instance.ctx.translate(this.transform.position.x + this.transform.scaledDimensions.x / 2, this.transform.position.y + this.transform.scaledDimensions.y / 2);
            Application.Instance.ctx.rotate((this.transform.rotation * Math.PI) / 180);
            Application.Instance.ctx.translate(-(this.transform.position.x + this.transform.scaledDimensions.x / 2), -(this.transform.position.y + this.transform.scaledDimensions.y / 2));

            Application.Instance.ctx.drawImage(this.img, this._currentFrame.x, this._currentFrame.y, this.anim.resolution.x, this.anim.resolution.y, this.transform.position.x, this.transform.position.y, this.transform.scaledDimensions.x, this.transform.scaledDimensions.y);
            
            Application.Instance.ctx.setTransform(1, 0, 0, 1, 0, 0);
        }
    }
}

export class Scene
{
    constructor()
    {
        this.sprites = [];

        Application.Instance.RegisterScene(this);
    }

    static self = null;

    Start()
    {
        document.addEventListener("keydown", this.OnKeyDown);
        document.addEventListener("keyup", this.OnKeyUp);

        self = Application.Instance.currentScene;
    }

    Stop()
    {
        document.removeEventListener("keydown", this.OnKeyDown);
        document.removeEventListener("keyup", this.OnKeyUp);

        self = null;
    }

    OnKeyDown(_event)
    {
        
    }

    OnKeyUp(_event)
    {

    }

    Update()
    {
        
    }

    Draw()
    {
        for (let i = 0; i < this.sprites.length; i++)
        {
            this.sprites[i].Draw();
        }
    }
}

export class Application
{
    constructor(wh, background="none", debug=false)
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

        this.c.width = wh[0];
        this.c.height = wh[1];

        this.c.style.background = background;
        this.c.style.border = "none";

        this.ctx = this.c.getContext("2d");

        this.ctx.imageSmoothingEnabled = false;

        this.debug = debug

        this.deltaTime = 0;
        this.lastTimestamp = 0;
        this.fps = 0;

        this.SPRITE_PADDING = 1;
        this.SPRITE_FRAMERATE = 60;

        this.mousePosition = Vector2.zero;

        this._scenes = [];
        this.currentScene = null;
        this._animationFrameRequest = null;
    }

    static Instance;

    Start()
    {
        if (!this._animationFrameRequest)
        {
            this._animationFrameRequest = window.requestAnimationFrame(this.Update.bind(this));

            this.c.addEventListener("mousemove", this.UpdateMouse);
            this.c.addEventListener("mouseenter", this.UpdateMouse);
            this.c.addEventListener("mouseleave", this.UpdateMouse);
        }
    }

    Stop()
    {
        if (this._animationFrameRequest)
        {
            window.cancelAnimationFrame(this._animationFrameRequest);

            this.c.removeEventListener("mousemove");
            this.c.removeEventListener("mouseenter");
            this.c.removeEventListener("mouseleave");

            this._animationFrameRequest = null;
        }
    }

    Update()
    {
        this._animationFrameRequest = window.requestAnimationFrame(this.Update.bind(this));

        const timestamp = window.performance.now();

        this.deltaTime = (timestamp - this.lastTimestamp) / 1000;
        this.lastTimestamp = timestamp;
        this.fps = Math.round(1 / this.deltaTime);

        if (this.currentScene != null)
        {
            this.currentScene.Update();
        }

        this.Draw();
    }

    Draw()
    {
        if (this.currentScene != null)
        {
            this.currentScene.Draw();
        }

        if (this.debug)
        {
            this.DrawDebug();
        }
    }

    DrawDebug()
    {
        this.ctx.font = "10px Arial";
        this.ctx.fillStyle = "red";
        this.ctx.fillText("FPS: " + this.fps, 5, 10);
    }

    UpdateMouse(_event)
    {
        const _bounds = Application.Instance.c.getBoundingClientRect();

        Application.Instance.mousePosition.x = _event.clientX - _bounds.left;
        Application.Instance.mousePosition.y = _event.clientY - _bounds.top;
    }

    RegisterScene(_scene)
    {
        this._scenes.push(_scene);

        if (this.currentScene == null)
        {
            this.currentScene = this._scenes[0];
            this.currentScene.Start();
        }
    }

    LoadScene(_scene)
    {
        if (this.currentScene == null)
        {
            this.currentScene = this._scenes[_scene];
            this.currentScene.Start();
        }

        else
        {
            this.currentScene.Stop();
            
            this.currentScene = this._scenes[_scene];
            this.currentScene.Start();
        }
    }
}