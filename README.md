# **PROJET DE PROGRAMMATION WEB**
by Célestine Paillé, Romain Monier, Romane Brun, Théo Bos

**I. Naissance du projet**

 Dans le cadre de notre cours de Programmation Web, nous avons dû faire le choix entre deux projets de création de site web : un utilisant des éléments en HTML et CSS uniquement et l&#39;autre en utilisant des éléments en JavaScript en plus des deux langages cités précédemment. Nous avons opté pour le second choix et avons alors choisi de programmer un site web de jeux du morpion. Nous avons alors entrepris de réaliser les maquettes graphiques du site web afin d&#39;avoir une base visuelle pour programmer ensuite.

 Nous avons donc ensuite posé les frontières de notre site en définissant les différentes pages que nous allions devoir coder et les images nécessaires à la réalisation de notre site web. Pour cela nous avons choisi de coder 6 pages reliées.

 Enfin, pour faciliter la coopération a plusieurs sur ce projet, nous avons choisi d&#39;utiliser GitHub qui permet de gérer la multi écriture de notre code. Nous avons également choisi d&#39;héberger le site sur GitHub. Vous pouvez accéder au dépôt ici : [https://github.com/rmonier/morpion-insa](https://github.com/rmonier/morpion-insa).

**II. Partage des tâches**

 Nous étions donc prêts à programmer. Il nous fallait nous répartir les différentes pages à coder. Pour cela, Romain s&#39;est concentré sur la partie JavaScript étant donné qu&#39;il était celui qui maîtrisait le mieux ce langage. Romane, Célestine et Théo se sont quant à eux occupés des codes HTML et CSS de chacune des pages.

**III. Code HTML et CSS**

 Pour ces parties de code HTML et CSS, nous nous retrouvions sur un vocal Discord. L&#39;un de nous partageait son écran et ainsi nous pouvions tous ensembles, petit à petit, rajouter des bouts de code et regarder le résultat en direct. Nous avons donc codé ces pages tous les trois ensembles ce que nous avons trouvé plus efficace que se séparer en codant chacun une page étant donné qu&#39;il y avait beaucoup de redondances entre les pages. Nous avons donc choisi également de regrouper tous le code CSS des _header_ et _footer_ dans un seul fichier commun à toutes nos pages : _style.css_

**IV. Code JavaScript**

 Pour la partie JavaScript, utilisée donc pour coder le déroulement d&#39;une partie placé dans _game.js_, nous avons tout d&#39;abord créé deux énumérations, CaseType qui représente le type de la case actuelle (vide, Joueur 1 ou 2) et Players qui correspondra aux Joueurs. La grille est générée automatiquement en récupérant le nombre de lignes après avoir vérifié qu&#39;elle est valide, et pour cela nous instancions Game et utilisons la fonction resetBoard qui créé chaque case, l&#39;ajoute à la grille et formatte le style dynamiquement pour avoir une grille carrée (en tirant profit de la propriété CSS gridTemplateColumns). Lorsqu&#39;on instancie une Case on lui associe une image et un listener qui écoutera les clicks effectués pour changer son type. A chaque placement, on utilise Game pour passer au tour suivant et vérifier s&#39;il y a un gagnant.

 La partie vérification de gagnant (checkBoard) est entièrement dynamique. La grille peut avoir autant de cases que l&#39;on veut, l&#39;algorithme trouvera toujours s&#39;il y a un gagnant. Il est un peu « brute force » car il vérifie toute la grille à chaque tour, cela peut poser un problème si elle est vraiment très grande, mais cela aurait peu d&#39;intérêt. Plus de détails sur le fonctionnement peuvent être trouvés dans les commentaires de _game.js_.

**V. La version finale du site**

 Vous pouvez donc retrouver la version finale de notre site en suivant ce lien : [https://rmonier.github.io/morpion-insa](https://rmonier.github.io/morpion-insa)
