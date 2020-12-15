const BOARD = document.getElementById("board");
const INFOS = document.getElementById("infos");
const START = document.getElementById("start");

const CaseType = Object.freeze({"EMPTY_CASE": 1, "PLAYER_1_CASE" : 2, "PLAYER_2_CASE": 3});
const Players = Object.freeze({"PLAYER_1": 1, "PLAYER_2" : 2});

const PATH_EMPTY_CASE = "static/img/case_empty.png";
const PATH_PLAYER_1_CASE = "static/img/case_player1.png";
const PATH_PLAYER_2_CASE = "static/img/case_player2.png";
const PATH_PLAYER_1 = "static/img/player1.png";
const PATH_PLAYER_2 = "static/img/player2.png";

let last_id_case = 0;
let game = null;

START.addEventListener("click", launchGame);

function Game()
{
    this.end = false;
    this.winner = null;
    this.board_cases = {};
    this.round = 0;
    this.currentPlayer = Players.PLAYER_1;
}

Game.prototype.isEnded = function() {
    return this.end;
};

Game.prototype.getWinner = function() {
    return this.winner;
};

Game.prototype.getBoardCases = function() {
    return this.board_cases;
};

Game.prototype.getCurrentPlayer = function() {
    return this.currentPlayer;
};

Game.prototype.getRound = function() {
    return this.round;
};

Game.prototype.setCurrentPlayer = function(p) {
    this.currentPlayer = p;
    return this;
};

Game.prototype.nextRound = function()
{
    if(this.getCurrentPlayer() === Players.PLAYER_1)
        this.setCurrentPlayer(Players.PLAYER_2);
    else
        this.setCurrentPlayer(Players.PLAYER_1);

    this.round++;

    return this;
};

Game.prototype.addCase = function(cur_case) {
    this.board_cases[cur_case.getId()] = cur_case;
    return this;
};

function Case(type = CaseType.EMPTY_CASE, img_src = undefined)
{
    this.id = last_id_case++;

    this.element = document.createElement("img");
    
    this.element.classList.add("cellule");
    this.element.setAttribute("data-id", this.id);

    this.changeType(type, img_src);

    this.element.addEventListener("click", function() {
        if((c = game.getBoardCases()[this.dataset.id]).getType() === CaseType.EMPTY_CASE) {
            if(game.getCurrentPlayer() === Players.PLAYER_1)
                c.changeType(CaseType.PLAYER_1_CASE);
            else
                c.changeType(CaseType.PLAYER_2_CASE);
            game.nextRound();
            updateDisplay();
        }
    });
}

Case.prototype.changeType = function(type, img_src = undefined)
{
    this.type = type;
    this.imgSrc = img_src;

    switch(type)
    {
        case CaseType.EMPTY_CASE:
            if(this.imgSrc === undefined)
                this.imgSrc = PATH_EMPTY_CASE;
            this.element.src = this.imgSrc;
            this.element.alt = "CASE VIDE";
            this.element.title = "CASE VIDE";
        break;
        case CaseType.PLAYER_1_CASE:
            if(this.imgSrc === undefined)
                this.imgSrc = PATH_PLAYER_1_CASE;
            this.element.src = this.imgSrc;
            this.element.alt = "JOUEUR 1";
            this.element.title = "JOUEUR 1";
        break;
        case CaseType.PLAYER_2_CASE:
            if(this.imgSrc === undefined)
                this.imgSrc = PATH_PLAYER_2_CASE;
            this.element.src = this.imgSrc;
            this.element.alt = "JOUEUR 2";
            this.element.title = "JOUEUR 2";
        break;
        default:
            if(this.imgSrc === undefined)
                this.imgSrc = PATH_EMPTY_CASE;
            this.element.src = this.imgSrc;
            this.element.alt = "CASE VIDE";
            this.element.title = "CASE VIDE";
    }

    return this;
};

Case.prototype.getType = function() {
    return this.type;
};

Case.prototype.getImgSrc = function() {
    return this.imgSrc;
};

Case.prototype.getId = function() {
    return this.id;
};

Case.prototype.getElement = function() {
    return this.element;
};

function launchGame()
{
    game = new Game();

    resetBoard();

    updateDisplay();
}

function checkBoard()
{
    if(0) {
        game.end = true;
        game.winner = Players.PLAYER_1;
    } else if(0) {
        game.end = true;
        game.winner = Players.PLAYER_2;
    }
}

function resetBoard(board = BOARD)
{
    board.innerHTML = "";
    Array.from(Array(9).keys(), () => {
        let cur_case = new Case();
        game.addCase(cur_case);
        board.appendChild(game.getBoardCases()[cur_case.getId()].getElement());
    });
}

function updateDisplay()
{
    START.innerHTML = "RELANCER UNE PARTIE !"
    if(game.getCurrentPlayer() === Players.PLAYER_1)
    {
        INFOS.innerHTML = "Joueur 1, à vous !";
        BOARD.style.cursor = PATH_PLAYER_1;
    }
    else
    {
        INFOS.innerHTML = "Joueur 2, à vous !";
        BOARD.style.cursor = PATH_PLAYER_2;
    }
}

function displayResults()
{
    if(game.end)
    {
        // TODO: afficher resultats winner
    }
}