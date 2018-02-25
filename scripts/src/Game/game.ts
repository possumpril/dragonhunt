/**Модуль класса игры */

/**Импорт класса клеток */
import {Cell, Content} from "./cell";
import * as $ from 'jquery';

/**Класс игры */
export class Game
{
    /**Длина стороны поля */
    public static readonly SIDE_LENGTH = 10;

    /**Дефолтное количество ям */
    public static readonly DEFAULT_HOLES_NUMBER = 9;

    /**Идет игра или нет */
    public GameState: boolean;

    /**Длина стороны поля*/
    public SideLength: number;

    /**Массив клеток поля */
    public CellsArray: Cell[];

    /**Количество ям на поле */
    private _holesNumber: number;

    /**Статус конца игры */
    public GameOver: GameOver;

    /**Конструктор класса игры */
    public constructor()
    {
        this.GameState=false;
        this.SideLength=Game.SIDE_LENGTH;
        this.GameOver=GameOver.isNotOver;
        this.CellsArray = [] as Cell[];
        let a;
        for(let i=0;i<=(this.SideLength*this.SideLength)-1;i++)
        {
            this.CellsArray[i]=new Cell();
            a=document.getElementById(i.toString());
            if (a!=null)
            { 
                this.CellsArray[i].divLink=a;
            }
        }
        this._holesNumber = Game.DEFAULT_HOLES_NUMBER;
        
    }

    /**Изменение дефолтного количества ям
     * @param number количество ям
     */
    public set HolesNumber(enteredNumber: number)
    {
        this._holesNumber=enteredNumber;
    }

    /**Блок функций для заполнения поля */

    /**Заполнение поля содержимым */
    public Filling()
    {
        let dragon=this.chooseDragonPlace();
        let dangerArray: number[] = [];
        dangerArray[0]=dragon;
        dangerArray = dangerArray.concat(this.chooseHolesPlaces(dragon));
        this.placeDangers(dangerArray);
        this.placeWarnings(dangerArray);
        this.drawContent();
    }

     /**Выбор координаты для дракона: любая, кроме стартовой клетки игрока
      * в левом нижнем углу (a*(a-1), где а - длина стороны поля) */
    private chooseDragonPlace()
    {
        let dragon=this.SideLength*(this.SideLength-1);
        while (dragon == this.SideLength*(this.SideLength-1))
        {
            dragon = this.getRandomInt(0,this.SideLength*this.SideLength);
        }
        this.CellsArray[dragon].content=Content.dragon;
        return dragon;
    }

    /**Выбор координат для ям: любые, кроме стартовой клетки игрока и клетки с драконом */
    private chooseHolesPlaces(dragon:number)
    {
        let holesArray: number[] = [];
        let holeCoordinate;
        for (let i=0;i<this._holesNumber;i++)
        {
            holeCoordinate = dragon;
            while (holeCoordinate==dragon||holeCoordinate==this.SideLength*(this.SideLength-1))
            {
                holeCoordinate=this.getRandomInt(0,this.SideLength*this.SideLength);
            }
            holesArray[i] = holeCoordinate;
        }
        return holesArray;
    }

    /**Возвращает рандомное число от min включительно до max не включительно
     * @param number, number минимум и максимум
     */
    private getRandomInt(min: number, max: number)
    {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    /**Размещение дракона и ям согласно выбранным координатам */
    private placeDangers(dangerArray: number[])
    {
        this.CellsArray[dangerArray[0]].content=Content.dragon;
        for (let i=1;i<=this._holesNumber;i++)
        {
            this.CellsArray[dangerArray[i]].content=Content.hole;
        }
    }

    /**Размещение предупреждений о расставленных драконе и ямах */
    private placeWarnings(dangerArray: number[])
    {
        this.placeWarningsAroundDragon(dangerArray[0]);
        for (let i=1;i<=this._holesNumber;i++)
        {
            this.placeWarningsAroundHole(dangerArray[i]);
        }
    }

    /**Размещение предупреждений вокруг дракона */
    private placeWarningsAroundDragon(dragonPlace: number)
    {
        let left = this.getLeftNeighbour(dragonPlace);
        let right = this.getRightNeighbour(dragonPlace);
        let down = this.getLowerNeighbour(dragonPlace);
        let up = this.getUpperNeighbour(dragonPlace);
        let left_left = this.getLeftNeighbour(left);
        let right_right = this.getRightNeighbour(right);
        let down_down = this.getLowerNeighbour(down);
        let up_up = this.getUpperNeighbour(up);
        let up_left = this.getLeftNeighbour(up);
        let up_right = this.getRightNeighbour(up);
        let down_left = this.getLeftNeighbour(down);
        let down_right = this.getRightNeighbour(down);

        let warningsPlaces: number[] = [left, right, down, up, left_left, right_right, up_up, down_down, up_left, up_right, down_left, down_right];

        for (let i = 0; i < 12; i++)
        {
            if(this.CellsArray[warningsPlaces[i]].content == Content.none)
                this.CellsArray[warningsPlaces[i]].content = Content.dragonWarning;
        }
    }

    /**Размещение предупреждений вокруг ямы */
    private placeWarningsAroundHole(holePlace: number)
    {
        let left = this.getLeftNeighbour(holePlace);
        let right = this.getRightNeighbour(holePlace);
        let down = this.getLowerNeighbour(holePlace);
        let up = this.getUpperNeighbour(holePlace);

        let warningsPlaces: number[] = [left, right, down, up];
        for (let i=0;i<4;i++)
        {
            if (this.CellsArray[warningsPlaces[i]].content == Content.none)
                this.CellsArray[warningsPlaces[i]].content = Content.holeWarning;
            if (this.CellsArray[warningsPlaces[i]].content == Content.dragonWarning)
                this.CellsArray[warningsPlaces[i]].content = Content.doubleWarning;
        }

    }

    /**Заполняет поле на HTML-странице соответствующими содержимому изображениями */
    private drawContent()
    {
        for (let i=0;i<this.SideLength*this.SideLength;i++)
        {
            if (this.CellsArray[i].divLink!=null)
                switch (this.CellsArray[i].content) {
                    case Content.dragon:
                        this.CellsArray[i].divLink.className = "dragonCell";
                        break;
                    case Content.hole:
                        this.CellsArray[i].divLink.className = "holeCell";
                        break;
                    case Content.dragonWarning:
                        this.CellsArray[i].divLink.className = "dragonWarningCell";
                        break;
                    case Content.holeWarning:
                        this.CellsArray[i].divLink.className = "holeWarningCell";
                        break;
                    case Content.doubleWarning:
                        this.CellsArray[i].divLink.className = "doubleWarningCell";
                        break;    

                    default:
                        this.CellsArray[i].divLink.className = "simpleCell";
                        break;
                }
        }
    }

    /**Блок функций для получения соседних клеток */

    /**Возвращает индекс соседа снизу */
    public getLowerNeighbour(i:number)
    {
        return (i+this.SideLength)%(this.SideLength*this.SideLength);
    }

    /**Возвращает индекс соседа сверху */   
    public getUpperNeighbour(i:number)
    {
        return (i+this.SideLength*(this.SideLength-1))%(this.SideLength*this.SideLength);
    }

    /**Возвращает индекс соседа слева */
    public getLeftNeighbour(i:number)
    {
        return (Math.floor(i/this.SideLength))*this.SideLength + (this.SideLength-1) - (this.SideLength-i%this.SideLength)%this.SideLength;
    }

    /**Возвращает индекс соседа справа */
    public getRightNeighbour(i:number)
    {
        return (Math.floor(i/this.SideLength))*this.SideLength + (i%this.SideLength+1)%this.SideLength;
    }

    /**Блок функций для начала игры*/

    /**Начинает игру */
    public GameStart()
    {
        this.GameState=true;
        this.GameOver=GameOver.isNotOver;
        this.cleanField();
        this.Filling();
    }

    /**Очищает поле от предыдущих игр */
    private cleanField()
    {
        for (let i=0; i<this.SideLength*this.SideLength;i++){
            this.CellsArray[i].cleanCell();
            this.closeCap(i);
        }
        this.openCap(90);
    }

    /**Блок функций для хода игры */

    public tryToGoOrShoot(action: Action, index: number)
    {
        let indexContent = this.CellsArray[index].content;
        if (action === Action.walking)
        {
            if (indexContent === Content.dragon || indexContent === Content.hole)
            {
                this.GameState = false;
                this.identifyGameOver(action, indexContent);
                return false;
            }
            else
            {
                if (this.CellsArray[index].visited === false) 
                {
                    this.openCap(index);
                    this.CellsArray[index].visited === true;
                }
                return true;
            }
        }
        else
        {
            this.GameState = false;
            this.identifyGameOver(action, indexContent);
            return false;
        }
    }

    private identifyGameOver(action: Action, content: Content)
    {
        if (action === Action.walking && content === Content.dragon)
            this.GameOver = GameOver.burningByDragon;
        if (action === Action.walking && content === Content.hole)
            this.GameOver = GameOver.fallIntoHole;
        if (action === Action.shooting && content === Content.dragon)
            this.GameOver = GameOver.killingDragon;
        if (action === Action.shooting && content != Content.dragon)
            this.GameOver = GameOver.burningByDragon;
        this.finishGame();
    }

    private finishGame()
    {
        for (let i=0;i<=(this.SideLength*this.SideLength)-1;i++)
        {
            this.openCap(i);
        }
        switch (this.GameOver)
        {
            case GameOver.burningByDragon:
                alert('Вас сжег дракон!');
                break;
            case GameOver.fallIntoHole:
                alert('Вы упали в яму!');
                break;
            case GameOver.killingDragon:
                alert('Вы убили дракона!');
                break;
            default:
                alert('Что-то пошло не так, игра еще не закончена Оо');
                break;
        }
    }

    private openCap(index: number)
    {
        let cap = $("#c"+index);
        cap.attr('class', 'visited_cap');
    }

    private closeCap(index: number)
    {
        let cap = $("#c"+index);
        cap.attr('class', 'unvisited_cap');
    }
}
export enum GameOver {isNotOver, fallIntoHole, burningByDragon, killingDragon};
export {Cell,Content} from "./cell";
export enum Action {walking, shooting};