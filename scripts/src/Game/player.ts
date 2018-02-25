/**Модуль класса игрока */

/**Импорт класса игры */
import {Game, GameOver, Content, Action} from "./game";

import * as $ from 'jquery';

/**Класс игрока */
export class Player 
{
    public divLink: JQuery<HTMLElement>;
    public location: number;
    public playerState: playerState;
    public game: Game;
    public shootingDirection: direction;
    public constructor()
    {
        this.game = new Game();
        this.playerState = playerState.isWalking;
        this.divLink = $("#player");
        this.divLink.css('grid-area', '10/1');
        this.location = 90;
        this.shootingDirection = direction.up;
    }

    public initGame()
    {
        this.game.GameStart();
        this.playerState = playerState.isWalking;
        this.divLink.attr('class', 'walking');
        this.location = 90;
        this.divLink.css('grid-area', '10/1');
        this.unHidePlayer();
    }

    public changePlayerState ()
    {
        if (this.playerState === playerState.isWalking)
        {
            this.playerState = playerState.isShooting;
            this.divLink.attr('class', 'shooting');
        }
        else 
        {
            this.playerState = playerState.isWalking;
            this.divLink.attr('class', 'walking');
        }
    }

    public changeShootingDirection(dir: direction)
    {
        this.shootingDirection = dir;
        switch (dir)
        {
            case direction.up:
                this.divLink.css('transform', 'rotate(0deg)');
                break;
            case direction.down:
                this.divLink.css('transform', 'rotate(180deg)');
                break;
            case direction.left:
                this.divLink.css('transform', 'rotate(-90deg)');
                break;
            case direction.right:
                this.divLink.css('transform', 'rotate(90deg)');
                break;
            default:
                alert('Получено неверное направление!');
                break;
        }
    }

    public hidePlayer ()
    {
        this.divLink.css('display', 'none');
    }

    public unHidePlayer()
    {
        this.divLink.css('display', 'block');
    }

    public go(directionOfGoing: direction)
    {
        let neighborIndex = this.getNeighborIndex(directionOfGoing);
        this.hidePlayer();
        let isGameNotOver = this.game.tryToGoOrShoot(Action.walking, neighborIndex);
        if (isGameNotOver == true)
        {
            this.unHidePlayer();
            this.location = neighborIndex;
            this.movePlayer(neighborIndex);
        }
    }

    public shoot()
    {
        let neighborIndex = this.getNeighborIndex(this.shootingDirection);
        this.hidePlayer();
        let isGameNotOver = this.game.tryToGoOrShoot(Action.shooting, neighborIndex);
        if (isGameNotOver == true)
        {
            alert('Игра не закончилась, что-то пошло не так');
        }
    }

    private movePlayer(index: number)
    {
        this.location = index;
        this.divLink.css('grid-area', '' + (Math.floor(index/10)+1) + '/' + (index%10+1));
    }

    private getNeighborIndex(directionOfGoing: direction)
    {
        switch (directionOfGoing)
        {
            case direction.left:
                return(this.game.getLeftNeighbour(this.location));
            case direction.right:
                return(this.game.getRightNeighbour(this.location));
            case direction.up:
                return(this.game.getUpperNeighbour(this.location));
            case direction.down:
                return(this.game.getLowerNeighbour(this.location));
            default:
                alert('Получено неверное направление!');
                return(-1);
        }
    }

}

export enum playerState {isWalking, isShooting}
export enum direction {left, right, up, down}

export{Game} from "./game";
