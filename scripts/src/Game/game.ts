/**Модуль класса игры 
 * 
 * @module
*/

/**Импорт класса клеток */
import {Cell, Content} from "./cell";

/**Класс игры */
export class Game
{
    /**Константа длины стороны поля */
    public static readonly SIDE_LENGTH = 10;

    /**Дефолтное количество ям */
    public static readonly DEFAULT_HOLES_NUMBER = 9;

    /**Идет игра или нет */
    public gameState: boolean;

    /**Текущая длина стороны поля*/
    private _sideLength: number;

    /**Массив клеток поля */
    private _cellsArray: Cell[];

    /**Текущее количество ям на поле */
    private _holesNumber: number;

    /**Статус конца игры */
    private _gameOver: GameOver;

    /**Конструктор класса игры */
    public constructor()
    {
        this.gameState=false;
        this._sideLength=Game.SIDE_LENGTH;
        this._gameOver=GameOver.isNotOver;
        this._cellsArray = [] as Cell[];
        let a;
        for(let i=0;i<=(this._sideLength*this._sideLength)-1;i++)
        {
            this._cellsArray[i]=new Cell();
            a=document.getElementById(i.toString());
            if (a!=null)
            { 
                this._cellsArray[i].divLink=a;
            }
        }
        this._holesNumber = Game.DEFAULT_HOLES_NUMBER;
        
    }

    /**Изменение дефолтного количества ям
     * @param number количество ям
     */
    public set holesNumber(enteredNumber: number)
    {
        this._holesNumber=enteredNumber;
    }

    /**Блок функций для заполнения поля */

    /**Заполнение поля содержимым */
    private _filling()
    {
        let dragon=this._chooseDragonPlace();
        let dangerArray: number[] = [];
        dangerArray[0]=dragon;
        dangerArray = dangerArray.concat(this._chooseHolesPlaces(dragon));
        this._placeDangers(dangerArray);
        this._placeWarnings(dangerArray);
        this._drawContent();
    }

     /**Выбор координаты для дракона: любая, кроме стартовой клетки игрока
      * в левом нижнем углу (a*(a-1), где а - длина стороны поля) */
    private _chooseDragonPlace()
    {
        let dragon=this._sideLength*(this._sideLength-1);
        while (dragon === this._sideLength*(this._sideLength-1))
        {
            dragon = this._getRandomInt(0,this._sideLength*this._sideLength);
        }
        this._cellsArray[dragon].content=Content.dragon;
        return dragon;
    }

    /**Выбор координат для ям: любые, кроме стартовой клетки игрока и клетки с драконом 
     * @param number координата дракона
    */
    private _chooseHolesPlaces(dragon:number)
    {
        let holesArray: number[] = [];
        let holeCoordinate;
        for (let i=0;i<this._holesNumber;i++)
        {
            holeCoordinate = dragon;
            while (holeCoordinate===dragon||holeCoordinate===this._sideLength*(this._sideLength-1))
            {
                holeCoordinate=this._getRandomInt(0,this._sideLength*this._sideLength);
            }
            holesArray[i] = holeCoordinate;
        }
        return holesArray;
    }

    /**Возвращает рандомное число от min включительно до max не включительно
     * @param number, number минимум и максимум
     */
    private _getRandomInt(min: number, max: number)
    {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    /**Размещение дракона и ям согласно выбранным координатам 
     * @param number[] массив с координатами
    */
    private _placeDangers(dangerArray: number[])
    {
        this._cellsArray[dangerArray[0]].content=Content.dragon;
        for (let i=1;i<=this._holesNumber;i++)
        {
            this._cellsArray[dangerArray[i]].content=Content.hole;
        }
    }

    /**Размещение предупреждений о расставленных драконе и ямах
     * @param number[] массив с координатами
     */
    private _placeWarnings(dangerArray: number[])
    {
        this._placeWarningsAroundDragon(dangerArray[0]);
        for (let i=1;i<=this._holesNumber;i++)
        {
            this._placeWarningsAroundHole(dangerArray[i]);
        }
    }

    /**Размещение предупреждений вокруг дракона 
     * @param number координата дракона
    */
    private _placeWarningsAroundDragon(dragonPlace: number)
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
            if(this._cellsArray[warningsPlaces[i]].content === Content.none)
                this._cellsArray[warningsPlaces[i]].content = Content.dragonWarning;
        }
    }

    /**Размещение предупреждений вокруг ямы 
     * @param number координата ямы
    */
    private _placeWarningsAroundHole(holePlace: number)
    {
        let left = this.getLeftNeighbour(holePlace);
        let right = this.getRightNeighbour(holePlace);
        let down = this.getLowerNeighbour(holePlace);
        let up = this.getUpperNeighbour(holePlace);

        let warningsPlaces: number[] = [left, right, down, up];
        for (let i=0;i<4;i++)
        {
            if (this._cellsArray[warningsPlaces[i]].content === Content.none)
                this._cellsArray[warningsPlaces[i]].content = Content.holeWarning;
            if (this._cellsArray[warningsPlaces[i]].content === Content.dragonWarning)
                this._cellsArray[warningsPlaces[i]].content = Content.doubleWarning;
        }

    }

    /**Заполняет поле на HTML-странице соответствующими содержимому изображениями */
    private _drawContent()
    {
        for (let i=0;i<this._sideLength*this._sideLength;i++)
        {
            if (this._cellsArray[i].divLink!=null)
                switch (this._cellsArray[i].content) {
                    case Content.dragon:
                        this._cellsArray[i].divLink.className = "dragonCell";
                        break;
                    case Content.hole:
                        this._cellsArray[i].divLink.className = "holeCell";
                        break;
                    case Content.dragonWarning:
                        this._cellsArray[i].divLink.className = "dragonWarningCell";
                        break;
                    case Content.holeWarning:
                        this._cellsArray[i].divLink.className = "holeWarningCell";
                        break;
                    case Content.doubleWarning:
                        this._cellsArray[i].divLink.className = "doubleWarningCell";
                        break;    

                    default:
                        this._cellsArray[i].divLink.className = "simpleCell";
                        break;
                }
        }
    }

    /**Блок функций для получения соседних клеток */

    /**Возвращает индекс соседа снизу 
     * @param number координата текущей клетки
    */
    public getLowerNeighbour(i:number)
    {
        return (i+this._sideLength)%(this._sideLength*this._sideLength);
    }

    /**Возвращает индекс соседа сверху 
     * @param number координата текущей клетки
     * */   
    public getUpperNeighbour(i:number)
    {
        return (i+this._sideLength*(this._sideLength-1))%(this._sideLength*this._sideLength);
    }

    /**Возвращает индекс соседа слева 
     * @param number координата текущей клетки
    */
    public getLeftNeighbour(i:number)
    {
        return (Math.floor(i/this._sideLength))*this._sideLength + (this._sideLength-1) - (this._sideLength-i%this._sideLength)%this._sideLength;
    }

    /**Возвращает индекс соседа справа 
     * @param number координата текущей клетки
    */
    public getRightNeighbour(i:number)
    {
        return (Math.floor(i/this._sideLength))*this._sideLength + (i%this._sideLength+1)%this._sideLength;
    }

    /**Блок функций для начала игры*/

    /**Начинает игру */
    public gameStart()
    {
        this.gameState=true;
        this._gameOver=GameOver.isNotOver;
        this.cleanField();
        this._filling();
    }

    /**Очищает поле от предыдущих игр */
    private cleanField()
    {
        for (let i=0; i<this._sideLength*this._sideLength;i++){
            this._cellsArray[i].cleanCell();
            this._closeCap(i);
        }
        this._openCap(90);
    }

    /**Блок функций для хода игры */

    /**Возвращает истину, если игра не закончилась при ходе, и ложь, если закончилась, и вызывает функции для конца игры
     * @param Action какое действие было совершено при ходе
     * @param number куда игрок походил или выстрелил
     */
    public tryToGoOrShoot(action: Action, index: number)
    {
        let indexContent = this._cellsArray[index].content;
        if (action === Action.walking)
        {
            if (indexContent === Content.dragon || indexContent === Content.hole)
            {
                this.gameState = false;
                this._identifyGameOver(action, indexContent);
                return false;
            }
            else
            {
                if (this._cellsArray[index].visited === false) 
                {
                    this._openCap(index);
                    this._cellsArray[index].visited === true;
                }
                return true;
            }
        }
        else
        {
            this.gameState = false;
            this._identifyGameOver(action, indexContent);
            return false;
        }
    }

    /**Определяет, какой конец игры произошел
     * @param Action какое действие было совершено при ходе
     * @param Content что находится в клетке, куда игрок походил или выстрелил
     */
    private _identifyGameOver(action: Action, content: Content)
    {
        if (action === Action.walking && content === Content.dragon)
            this._gameOver = GameOver.burningByDragon;
        if (action === Action.walking && content === Content.hole)
            this._gameOver = GameOver.fallIntoHole;
        if (action === Action.shooting && content === Content.dragon)
            this._gameOver = GameOver.killingDragon;
        if (action === Action.shooting && content != Content.dragon)
            this._gameOver = GameOver.burningByDragon;
        this._finishGame();
    }

    /**Заканчивает игру визуально: открывает поле и выводит сообщение о конце игры */
    private _finishGame()
    {
        for (let i=0;i<=(this._sideLength*this._sideLength)-1;i++)
        {
            this._openCap(i);
        }
        switch (this._gameOver)
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

    /**Открывает игровую клетку
     * @param number индекс клетки
     */
    private _openCap(index: number)
    {
        let cap = document.getElementById('c'+index)!;
        cap.className = "visited_cap";
    }

    /**Закрывает игровую клетку
     * @param number индекс клетки
     */
    private _closeCap(index: number)
    {
        let cap = document.getElementById('c'+index)!;
        cap.className = "unvisited_cap";
    }
}

/**Варианты конца игры */
export enum GameOver {isNotOver, fallIntoHole, burningByDragon, killingDragon};

/**Варианты действий игрока при ходе */
export enum Action {walking, shooting};

/**Реэкспорт модуля клетки */
export {Cell,Content} from "./cell";