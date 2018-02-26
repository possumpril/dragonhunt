/**Модуль класса игрока */

/**Импорт класса игры */
import {Game, GameOver, Content, Action} from "./game";

import * as $ from 'jquery';

/**Класс игрока */
export class Player 
{
    private divLink: JQuery<HTMLElement>;
    private location: number;
    public playerState: PlayerState;
    public game: Game;
    private shootingDirection: Direction;
    public constructor()
    {
        this.game = new Game();
        this.playerState = PlayerState.isWalking;
        this.divLink = $("#player");
        this.divLink.css('grid-area', '10/1');
        this.location = 90;
        this.shootingDirection = Direction.up;
    }

    public initGame()
    {
        this.game.gameStart();
        this.playerState = PlayerState.isWalking;
        this.divLink.attr('class', 'walking');
        this.divLink.css('transform', 'rotate(0deg)');
        this.location = 90;
        this.divLink.css('grid-area', '10/1');
        this.unHidePlayer();
    }

    public changePlayerState ()
    {
        if (this.playerState === PlayerState.isWalking)
        {
            this.playerState = PlayerState.isShooting;
            this.divLink.attr('class', 'shooting');
        }
        else 
        {
            this.playerState = PlayerState.isWalking;
            this.divLink.attr('class', 'walking');
            this.divLink.css('transform', 'rotate(0deg)');
        }
    }

    public changeShootingDirection(dir: Direction)
    {
        this.shootingDirection = dir;
        switch (dir)
        {
            case Direction.up:
                this.divLink.css('transform', 'rotate(0deg)');
                break;
            case Direction.down:
                this.divLink.css('transform', 'rotate(180deg)');
                break;
            case Direction.left:
                this.divLink.css('transform', 'rotate(-90deg)');
                break;
            case Direction.right:
                this.divLink.css('transform', 'rotate(90deg)');
                break;
            default:
                alert('Получено неверное направление!');
                break;
        }
    }

    private hidePlayer ()
    {
        this.divLink.css('display', 'none');
    }

    private unHidePlayer()
    {
        this.divLink.css('display', 'block');
    }

    public go(directionOfGoing: Direction)
    {
        let neighborIndex = this.getNeighborIndex(directionOfGoing);
        this.hidePlayer();
        let isGameNotOver = this.game.tryToGoOrShoot(Action.walking, neighborIndex);
        if (isGameNotOver === true)
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
        if (isGameNotOver === true)
        {
            alert('Игра не закончилась, что-то пошло не так');
        }
    }

    private movePlayer(index: number)
    {
        this.location = index;
        this.divLink.css('grid-area', '' + (Math.floor(index/10)+1) + '/' + (index%10+1));
    }

    private getNeighborIndex(directionOfGoing: Direction)
    {
        switch (directionOfGoing)
        {
            case Direction.left:
                return(this.game.getLeftNeighbour(this.location));
            case Direction.right:
                return(this.game.getRightNeighbour(this.location));
            case Direction.up:
                return(this.game.getUpperNeighbour(this.location));
            case Direction.down:
                return(this.game.getLowerNeighbour(this.location));
            default:
                alert('Получено неверное направление!');
                return(-1);
        }
    }

}

export enum PlayerState {isWalking, isShooting}
export enum Direction {left, right, up, down}

export{Game} from "./game";
