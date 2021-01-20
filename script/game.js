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
let grid_lines, nom_joueur1, nom_joueur2;

START.addEventListener("click", launchGame);

/**
 * Gère le déroulement d'une partie
 */
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

/**
 * Passe au tour suivant et change de joueur
 */
Game.prototype.nextRound = function()
{
    if(this.getCurrentPlayer() === Players.PLAYER_1)
        this.setCurrentPlayer(Players.PLAYER_2);
    else
        this.setCurrentPlayer(Players.PLAYER_1);

    this.round++;

    checkBoard();
    updateDisplay();

    return this;
};

/**
 * Ajoute une case au plateau
 * @param {Case} cur_case 
 */
Game.prototype.addCase = function(cur_case) {
    this.board_cases[cur_case.getId()] = cur_case;
    return this;
};

/**
 * Contient toutes les données d'une case (type, image) et lui associe un listener
 * @param {CaseType} type 
 * @param {string} img_src 
 */
function Case(type = CaseType.EMPTY_CASE, img_src = undefined)
{
    this.id = last_id_case++;

    this.element = document.createElement("img");
    
    this.element.classList.add("cellule");
    this.element.setAttribute("data-id", this.id);

    this.changeType(type, img_src);

    // Si on clique dessus, on vérifie qu'elle est vide puis on change son type et passe au tour suivant
    this.element.addEventListener("click", function() {
        if((c = game.getBoardCases()[this.dataset.id]).getType() === CaseType.EMPTY_CASE && !game.isEnded()) {
            if(game.getCurrentPlayer() === Players.PLAYER_1)
                c.changeType(CaseType.PLAYER_1_CASE);
            else
                c.changeType(CaseType.PLAYER_2_CASE);
            game.nextRound();
        }
    });
}

/**
 * Change le type d'une case
 * @param {CaseType} type 
 * @param {string} img_src 
 */
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
            this.element.alt = nom_joueur1;
            this.element.title = nom_joueur1;
        break;
        case CaseType.PLAYER_2_CASE:
            if(this.imgSrc === undefined)
                this.imgSrc = PATH_PLAYER_2_CASE;
            this.element.src = this.imgSrc;
            this.element.alt = nom_joueur2;
            this.element.title = nom_joueur2;
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

/**
 * Lance ou relance une partie en demandant les noms aux joueurs et en vérifiant la grille 
 */
function launchGame()
{
    last_id_case = 0;

    if(parseInt(LIGNES.value) > 1 && parseInt(LIGNES.value) <= 30) {
        grid_lines = parseInt(LIGNES.value);
        
        nom_joueur1 = prompt("Joueur 1, entrez votre nom !", "Joueur 1");
        nom_joueur2 = prompt("Joueur 2, entrez votre nom !", "Joueur 2");

        if(nom_joueur1 === null || nom_joueur1 === "")
            nom_joueur1 = "Joueur 1";

        if(nom_joueur2 === null || nom_joueur2 === "")
            nom_joueur2 = "Joueur 2";

        game = new Game();
        resetBoard();

        updateDisplay();
    } else {
        alert("La grille doit contenir entre 2 et 30 lignes seulement !");
    }
}

/**
 * Vérifie si le jeu est finie en scannant la grille
 */
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
    
    // Si le nombre de case d'un joueur correspond à une ligne complète
    if(nb_j1 === nb_rows)
        game.setEnd(true).setWinner(Players.PLAYER_1);
    else if(nb_j2 === nb_rows)
        game.setEnd(true).setWinner(Players.PLAYER_2);

    // On compte le nombre de case au total
    for(const k in game.getBoardCases()) {
        if(game.getBoardCases()[k].getType() !== CaseType.EMPTY_CASE)
            nb_tot++;
    }
    
    // Si on a une égalité (toutes cases remplies)
    if(nb_tot === grid_lines*grid_lines)
        game.setEnd(true);
}

/**
 * On (ré)initialise le plateau
 * @param {HTMLElement} board 
 */
function resetBoard(board = BOARD)
{
    board.innerHTML = "";
    for(let c of Array(parseInt(grid_lines*grid_lines))) {
        let cur_case = new Case();
        game.addCase(cur_case);
        board.appendChild(game.getBoardCases()[cur_case.getId()].getElement());
    }
    
    let gridStyle = "";
    for(let c of Array(grid_lines)) {
        gridStyle += "1fr ";
    }
    BOARD.style.gridTemplateColumns = gridStyle; // On formate l'affichage
}

/**
 * Affichage du message
 */
function updateDisplay()
{
    START.innerHTML = "RELANCER UNE PARTIE !"
    if(!game.isEnded())
    {
        if(game.getCurrentPlayer() === Players.PLAYER_1)
        {
            INFOS.innerHTML = nom_joueur1 + ", à vous !";
            BOARD.style.cursor = "url('static/img/player1.cur'), pointer";
        }
        else
        {
            INFOS.innerHTML = nom_joueur2 + ", à vous !";
            BOARD.style.cursor = "url('static/img/player2.cur'), pointer";
        }
    } else {
        displayResults();
    }
}

/**
 * Affichage du message de fin de partie
 */
function displayResults()
{
    if(game.isEnded())
    {
        if(game.getWinner() === Players.PLAYER_1)
            INFOS.innerHTML = nom_joueur1 + ", vous avez gagné, bravo !";
        else if(game.getWinner() === Players.PLAYER_2)
            INFOS.innerHTML = nom_joueur2 + ", vous avez gagné, bravo !";
        else
            INFOS.innerHTML = "C'est une égalité !";

        BOARD.style.cursor = "auto";
    }
}