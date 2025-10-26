"use strict";

import * as Engine from "./engine.js";

class MenuScene extends Engine.Scene
{
    constructor()
    {
        super();

        this.title = new Engine.Sprite("resources/sprites/demoGame/s_engineDemoTitle.png", new Engine.Transform(undefined, undefined, new Engine.Vector2(20, 20)), new Engine.Animation(new Engine.Vector2(128, 64), new Engine.Vector2(5, 2), 10, 5));
        this.title.anim.playing = true;
        this.sprites.push(this.title);

        this.movedTitle = false;
    }

    Start()
    {
        super.Start();
    }

    Stop()
    {
        super.Stop();
    }

    OnKeyDown(_event)
    {
        super.OnKeyDown(_event);

        Engine.Application.Instance.LoadScene(1);
    }

    OnKeyUp(_event)
    {
        super.OnKeyUp(_event);
    }

    Update()
    {
        super.Update();

        if (!this.movedTitle && this.title.img.complete)
        {
            this.MoveTitle();
            this.movedTitle = true;
        }
    }

    Draw()
    {
        Engine.Application.Instance.ctx.fillStyle = "black";
        Engine.Application.Instance.ctx.fillRect(0, 0, Engine.Application.Instance.c.width, Engine.Application.Instance.c.height);

        super.Draw();
    }

    MoveTitle()
    {
        this.title.transform.position.x = Engine.Application.Instance.c.width / 2 - this.title.transform.scaledDimensions.x / 2;
        this.title.transform.position.y = Engine.Application.Instance.c.height / 2 - this.title.transform.scaledDimensions.y;
    }
}

class BlankScene extends Engine.Scene
{
    constructor()
    {
        super();
    }

    Draw()
    {
        Engine.Application.Instance.ctx.fillStyle = "black";
        Engine.Application.Instance.ctx.fillRect(0, 0, Engine.Application.Instance.c.width, Engine.Application.Instance.c.height);

        super.Draw();
    }
}

let a = new Engine.Application([640, 640], undefined, true);

let s = new MenuScene();
let s2 = new BlankScene();

a.Start();