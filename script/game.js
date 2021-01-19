const BOARD = document.getElementById("board");
const INFOS = document.getElementById("infos");
const START = document.getElementById("start");
const LIGNES = document.getElementById("lignes");

const CaseType = Object.freeze({"EMPTY_CASE": 1, "PLAYER_1_CASE" : 2, "PLAYER_2_CASE": 3});
const Players = Object.freeze({"PLAYER_1": 1, "PLAYER_2" : 2});

const PATH_EMPTY_CASE = "static/img/case_empty.png";
const PATH_PLAYER_1_CASE = "static/img/case_player1.png";
const PATH_PLAYER_2_CASE = "static/img/case_player2.png";
const PATH_PLAYER_1 = "static/img/player1.png";
const PATH_PLAYER_2 = "static/img/player2.png";

let last_id_case = 0;
let game = null;
let grid_lines;

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

Game.prototype.setEnd = function(b) {
    this.end = b;
    return this;
};

Game.prototype.getWinner = function() {
    return this.winner;
};

Game.prototype.setWinner = function(w) {
    this.winner = w
    return this;
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
        if((c = game.getBoardCases()[this.dataset.id]).getType() === CaseType.EMPTY_CASE && !game.isEnded()) {
            if(game.getCurrentPlayer() === Players.PLAYER_1)
                c.changeType(CaseType.PLAYER_1_CASE);
            else
                c.changeType(CaseType.PLAYER_2_CASE);
            game.nextRound();
            checkBoard();
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
    last_id_case = 0;

    grid_lines = 3;
    if(parseInt(LIGNES.value) > 1 && parseInt(LIGNES.value) <= 30)
        grid_lines = parseInt(LIGNES.value);

    LIGNES.value = grid_lines;

    game = new Game();
    resetBoard();

    updateDisplay();
}

function checkBoard()
{
    let nb_j1 = 0, nb_j2 = 0, nb_tot = 0, nb_rows = grid_lines;

    let row = 0;
    while(row < nb_rows && !(nb_j1 === nb_rows || nb_j2 === nb_rows)) 
    {
        let line = 0;
        nb_j1 = 0;
        nb_j2 = 0;
        while(line < parseInt(nb_rows*nb_rows) && !(nb_j1 === nb_rows || nb_j2 === nb_rows)) // On vérifie les colonnes
        {
            if(game.getBoardCases()[parseInt(row + line)].getType() === CaseType.PLAYER_1_CASE) {
                nb_j1++;
            } else {
                nb_j1 = 0;
            }
            
            if(game.getBoardCases()[parseInt(row + line)].getType() === CaseType.PLAYER_2_CASE) {
                nb_j2++;
            } else {
                nb_j2 = 0;
            }

            line += nb_rows;
        }
        row++;
    }

    row = 0;
    while(row < nb_rows && !(nb_j1 === nb_rows || nb_j2 === nb_rows)) 
    {
        let line = 0;
        nb_j1 = 0;
        nb_j2 = 0;
        while(line < nb_rows && !(nb_j1 === nb_rows || nb_j2 === nb_rows)) // On vérifie les lignes
        {
            if(game.getBoardCases()[parseInt(row*nb_rows + line)].getType() === CaseType.PLAYER_1_CASE) {
                nb_j1++;
            } else {
                nb_j1 = 0;
            }
            
            if(game.getBoardCases()[parseInt(row*nb_rows + line)].getType() === CaseType.PLAYER_2_CASE) {
                nb_j2++;
            } else {
                nb_j2 = 0;
            }

            line++;
        }
        row++;
    }

    let cur_id = 0;
    if(!(nb_j1 === nb_rows || nb_j2 === nb_rows)) {
        nb_j1 = 0;
        nb_j2 = 0;
    }
    while(cur_id < parseInt(nb_rows*nb_rows) && !(nb_j1 === nb_rows || nb_j2 === nb_rows)) // On vérifie la diagonale gauche
    {
        if(game.getBoardCases()[parseInt(cur_id)].getType() === CaseType.PLAYER_1_CASE) {
            nb_j1++;
        } else {
            nb_j1 = 0;
        }
        
        if(game.getBoardCases()[parseInt(cur_id)].getType() === CaseType.PLAYER_2_CASE) {
            nb_j2++;
        } else {
            nb_j2 = 0;
        }

        cur_id += parseInt(nb_rows+1);
    }

    cur_id = parseInt(nb_rows-1);
    if(!(nb_j1 === nb_rows || nb_j2 === nb_rows)) {
        nb_j1 = 0;
        nb_j2 = 0;
    }
    while(cur_id < parseInt(nb_rows*nb_rows) && !(nb_j1 === nb_rows || nb_j2 === nb_rows)) // On vérifie la diagonale droite
    {
        if(game.getBoardCases()[parseInt(cur_id)].getType() === CaseType.PLAYER_1_CASE) {
            nb_j1++;
        } else {
            nb_j1 = 0;
        }
        
        if(game.getBoardCases()[parseInt(cur_id)].getType() === CaseType.PLAYER_2_CASE) {
            nb_j2++;
        } else {
            nb_j2 = 0;
        }

        cur_id += parseInt(nb_rows-1);
    }
    
    if(nb_j1 === nb_rows)
        game.setEnd(true).setWinner(Players.PLAYER_1);
    else if(nb_j2 === nb_rows)
        game.setEnd(true).setWinner(Players.PLAYER_2);

    for(const k in game.getBoardCases()) {
        if(game.getBoardCases()[k].getType() !== CaseType.EMPTY_CASE)
            nb_tot++;
    }
    
    if(nb_tot === grid_lines*grid_lines)
        game.setEnd(true);
}

function resetBoard(board = BOARD)
{
    board.innerHTML = "";
    Array.from(Array(parseInt(grid_lines*grid_lines)).keys(), () => {
        let cur_case = new Case();
        game.addCase(cur_case);
        board.appendChild(game.getBoardCases()[cur_case.getId()].getElement());
    });
    
    let gridStyle = "";
    Array.from(Array(grid_lines).keys(), () => {
        gridStyle += "1fr ";
    });
    BOARD.style.gridTemplateColumns = gridStyle;
}

function updateDisplay()
{
    START.innerHTML = "RELANCER UNE PARTIE !"
    if(!game.isEnded()) 
    {
        if(game.getCurrentPlayer() === Players.PLAYER_1)
        {
            INFOS.innerHTML = "Joueur 1, à vous !";
            BOARD.style.cursor = "url('static/img/player1.cur'), pointer";
        }
        else
        {
            INFOS.innerHTML = "Joueur 2, à vous !";
            BOARD.style.cursor = "url('static/img/player2.cur'), pointer";
        }
    } else {
        displayResults();
    }
}

function displayResults()
{
    if(game.isEnded())
    {
        if(game.getWinner() === Players.PLAYER_1)
            INFOS.innerHTML = "Joueur 1, vous avez gagné, bravo !";
        else if(game.getWinner() === Players.PLAYER_2)
            INFOS.innerHTML = "Joueur 2, vous avez gagné, bravo !";
        else
            INFOS.innerHTML = "C'est une égalité !";

        BOARD.style.cursor = "auto";
    }
}