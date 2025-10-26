"use strict";

import * as Engine from "./engine.js";

class MenuScene extends Engine.Scene
{
    constructor()
    {
        super();

        this.ball = new Engine.Sprite("resources/sprites/debug/ball_test.png", new Engine.Transform(undefined, undefined, new Engine.Vector2(5, 5)), new Engine.Animation(undefined, new Engine.Vector2(5, 2), 6, 3));
        this.sprites.push(this.ball);
    }

    Update()
    {
        this.ball.transform.position.x = Engine.Application.Instance.mousePosition.x - this.ball.transform.scaledDimensions.x / 2;
        this.ball.transform.position.y = Engine.Application.Instance.mousePosition.y - this.ball.transform.scaledDimensions.y / 2;

        super.Update();
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

a.Start();