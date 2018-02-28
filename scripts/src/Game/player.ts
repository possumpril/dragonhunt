/**Модуль класса игрока */

/**Импорт класса игры */
import {Game, GameOver, Content, Action} from "./game";

/**Импорт библиотеки jQuery */
import * as $ from 'jquery';

/**Класс игрока */
export class Player 
{
    /**Ссылка на div c игроком на странице */
    private divLink: JQuery<HTMLElement>;

    /**Индекс клетки, где сейчас находится игрок */
    private location: number;

    /**Состояние игрока: ходит или стреляет */
    public playerState: PlayerState;

    /**Объект класса игра */
    public game: Game;

    /**Направление стрельбы, которое выбрано игроком */
    private shootingDirection: Direction;

    /**Конструктор */
    public constructor()
    {
        this.game = new Game();
        this.playerState = PlayerState.isWalking;
        this.divLink = $("#player");
        this.divLink.css('grid-area', '10/1');
        this.location = 90;
        this.shootingDirection = Direction.up;
    }

    /**Функция инициализации игры при нажатии на кнопку "Играть" */
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

    /**Функция смены состояния игрока: если ходил, меняет на стрельбу, и наоборот */
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

    /**Функция смены направления стрельбы
     * @param Direction выбранное направление
     */
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

    /**Функция, которая прячет игрока на странице */
    private hidePlayer ()
    {
        this.divLink.css('display', 'none');
    }

    /**Функция, которая показывает игрока на странице */
    private unHidePlayer()
    {
        this.divLink.css('display', 'block');
    }

    /**Функция хода
     * @param Direction направление хода
     */
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

    /**Функция стрельбы */
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

    /**Функция, которая перемещает игрока в другую клетку
     * @param number индекс клетки, в которую перемещается игрок
     */
    private movePlayer(index: number)
    {
        this.location = index;
        this.divLink.css('grid-area', '' + (Math.floor(index/10)+1) + '/' + (index%10+1));
    }

    /**Функция, которая возвращает индекс соседней клетки
     * @param Direction направление, в котором требуется найти соседа
     */
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

/**Варианты состояния игрока */
export enum PlayerState {isWalking, isShooting}

/**Варианты направления */
export enum Direction {left, right, up, down}

/**Реэкспорт модуля игры */
export{Game} from "./game";
