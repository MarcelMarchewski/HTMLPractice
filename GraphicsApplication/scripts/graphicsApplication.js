"use strict";

import * as Engine from "./engine.js";

class MenuScene extends Engine.Scene
{
    constructor()
    {
        super();

        this.title = new Engine.Sprite("resources/sprites/demoGame/s_engineDemoTitle.png", new Engine.Transform(undefined, undefined, new Engine.Vector2(20, 20)), new Engine.Animation(new Engine.Vector2(128, 64), new Engine.Vector2(5, 2), 10, 5));
        this.title.anim.playing = true;

        this.title.onLoaded = () =>
        {
            this.title.transform.position.x = Engine.Application.Instance.c.width / 2 - this.title.transform.scaledDimensions.x / 2;
            this.title.transform.position.y = Engine.Application.Instance.c.height / 2 - this.title.transform.scaledDimensions.y;
        }

        this.sprites.push(this.title);
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
    }

    Draw()
    {
        Engine.Application.Instance.ctx.fillStyle = "black";
        Engine.Application.Instance.ctx.fillRect(0, 0, Engine.Application.Instance.c.width, Engine.Application.Instance.c.height);

        super.Draw();
    }
}

class GameScene extends Engine.Scene
{
    constructor()
    {
        super();

        this.player = new Engine.Sprite("resources/sprites/demoGame/s_playerJet.png", new Engine.Transform(undefined, undefined, new Engine.Vector2(8, 8)), new Engine.Animation(new Engine.Vector2(64, 80), new Engine.Vector2(4, 1), 4, 5));
        this.player.anim.playing = true;

        this.speed = 300;

        this.player.onLoaded = () =>
        {
            this.player.transform.position.x = Engine.Application.Instance.c.width / 2 - this.player.transform.scaledDimensions.x / 2;
            this.player.transform.position.y = Engine.Application.Instance.c.height - this.player.transform.scaledDimensions.y * 2;
        }

        this.sprites.push(this.player);

        this.inputArray = [false, false, false, false]

        this.lastPos = this.player.transform.position;
    }

    Update()
    {
        super.Update();

        let _input = new Engine.Vector2(0, 0);

        if (this.inputArray[0])
        {
            _input.y -= 1;
        }

        if (this.inputArray[2])
        {
            _input.y += 1;
        }

        if (this.inputArray[1])
        {
            _input.x -= 1;
        }

        if (this.inputArray[3])
        {
            _input.x += 1;
        }

        this.player.transform.velocity.x = _input.normalised.x * this.speed;
        this.player.transform.velocity.y = _input.normalised.y * this.speed;

        this.player.transform.position.x += this.player.transform.velocity.x * Engine.Application.Instance.deltaTime;
        this.player.transform.position.y += this.player.transform.velocity.y * Engine.Application.Instance.deltaTime;
    }

    Draw()
    {
        Engine.Application.Instance.ctx.fillStyle = "black";
        Engine.Application.Instance.ctx.fillRect(0, 0, Engine.Application.Instance.c.width, Engine.Application.Instance.c.height);

        super.Draw();
    }

    OnKeyDown(_event)
    {
        super.OnKeyDown(_event);

        if (_event.code == "KeyW")
        {
            self.inputArray[0] = true;
        }

        if (_event.code == "KeyA")
        {
            self.inputArray[1] = true;
        }

        if (_event.code == "KeyS")
        {
            self.inputArray[2] = true;
        }

        if (_event.code == "KeyD")
        {
            self.inputArray[3] = true;
        }
    }

    OnKeyUp(_event)
    {
        super.OnKeyUp(_event);

        if (_event.code == "KeyW")
        {
            self.inputArray[0] = false;
        }

        if (_event.code == "KeyA")
        {
            self.inputArray[1] = false;
        }

        if (_event.code == "KeyS")
        {
            self.inputArray[2] = false;
        }

        if (_event.code == "KeyD")
        {
            self.inputArray[3] = false;
        }
    }
}

let a = new Engine.Application([640, 640], undefined, true);

let s = new MenuScene();
let s2 = new GameScene();

a.Start();