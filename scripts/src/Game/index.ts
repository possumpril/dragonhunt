/**Модуль инициализации игры */

/**Импорт модуля игрока */
import {Player, Direction, PlayerState} from "./player";

let player: Player;

/**Функция для отображения блока с игрой */
function showGame()
{
    let a = document.getElementById("game");
    if (a!=null) a.style.display="block";
    let b = document.getElementById("menu");
    if (b!=null) b.style.display="none";
    player.initGame();
}

/**Функция для кнопки "Играть" */
function gameStartButtonClick()
{
    let gameButton = document.getElementById("gameButton");
    if (gameButton!=null) 
    {
        gameButton.addEventListener("click", showGame);
    }
}

/**Функция для отображения блока с настройками */
function showSettings()
{
    let a = document.getElementById("settings");
    if (a!=null) a.style.display="block";
    let b = document.getElementById("menu");
    if (b!=null) b.style.display="none";
}

/**Функция для кнопки "Настройки" */
function settingsButtonClick()
{
    let settingsButton = document.getElementById("settingsButton");
    if (settingsButton!=null) settingsButton.addEventListener("click", showSettings);
}

/**Функция для отображения блока меню */
function showMenu()
{
    let a = document.getElementById("settings");
    if (a!=null) a.style.display="none";
    let b = document.getElementById("game");
    if (b!=null) b.style.display="none";
    let c = document.getElementById("menu");
    if (c!=null) c.style.display="block";
}

/**Функция для кнопки "Отмена" в блоке настроек */
function cancelButtonClick()
{
    let cancelButton = document.getElementById("cancelButton");
    if (cancelButton!=null) cancelButton.addEventListener("click", showMenu);
}

/**Функция для кнопки "Меню" в блоке игры*/
function exitButtonClick()
{
    let exitButton = document.getElementById("exitButton");
    if (exitButton!=null) exitButton.addEventListener("click", exitGame);
}

/**Функция для завершения игры и выхода в меню */
function exitGame()
{
    player.game.gameState = false;
    showMenu();
}

/**Функция для кнопки "Применить" в блоке настроек */
function confirmButtonClick()
{
    let confirmButton = document.getElementById("confirmButton");
    if (confirmButton!=null)
    {
        confirmButton.addEventListener("click", confirmChanges);
    } 
}

/**Функция, меняющая число ям в настройках */
function confirmChanges()
{
    let holesNumberInput = document.getElementById("holesNumberInput");
    if (holesNumberInput!=null)
    {
        let str = (<HTMLInputElement>holesNumberInput).value;
        let num = parseInt(str);
        if (num>0 && num<=9)
        {
            player.game.holesNumber = num;
            showMenu();
        }
        else
        {
            alert("Пожалуйста, введите число от 1 до 9");
        }
    }
    
}

/**Функция для обработки нажатий клавиш в игре */
function presskey(event: KeyboardEvent)
{
    if (player.game.gameState === true)
    {
        let key = event.keyCode;
        switch (key)
        {
            case 87:
                if(player.playerState === PlayerState.isWalking)
                {
                    player.go(Direction.up);
                    break;
                }
                else
                {
                    player.changeShootingDirection(Direction.up);
                    break;
                }
            case 83:
                if(player.playerState === PlayerState.isWalking)
                {
                    player.go(Direction.down);
                    break;
                }
                else
                {
                    player.changeShootingDirection(Direction.down);
                    break;
                }
            case 65:
                if(player.playerState === PlayerState.isWalking)
                {
                    player.go(Direction.left);
                    break;
                }
                else
                {
                    player.changeShootingDirection(Direction.left);
                    break;
                }
            case 68:
                if(player.playerState === PlayerState.isWalking)
                {
                    player.go(Direction.right);
                    break;
                }
                else
                {
                    player.changeShootingDirection(Direction.right);
                    break;
                }
            case 32:
                player.changePlayerState();
                break;
            case 13:
                if (player.playerState === PlayerState.isShooting)
                {
                    player.shoot();
                }
        }
    }
}

function main():void
{
    player = new Player();
    gameStartButtonClick();
    settingsButtonClick();
    exitButtonClick();
    cancelButtonClick();
    confirmButtonClick();
    document.addEventListener("keydown", presskey);

}

export {main as default};