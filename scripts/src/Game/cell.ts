/**
 * Модуль класса клеток поля
 * 
 * @module
 */

/**
 * Класс клетки поля
 */

export class Cell
{
    /**Что хранится в клетке */
    public content: Content;
    /**Посещалась ли клетка */
    public visited: boolean;
    /**Ссылка на div на странице */
    public divLink: HTMLElement;
    /**Конструктор класса клеток */
    public constructor()
    {
        this.content=Content.none;
        this.visited=false;
//        this.divLink = new HTMLElement();
    }

    public cleanCell()
    {
        this.content=Content.none;
        this.visited=false;
    }
}

/**Варианты содержимого клетки */
export enum Content{none, dragon, hole, dragonWarning, holeWarning, doubleWarning}