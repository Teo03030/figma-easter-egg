
// Définition des variables du jeu
let joueur1, joueur2, balle;
let vitesseJoueur = 12;
let vitesseBalle = {
  x: 10,
  y: 10
};
let scoreJoueur1 = 0;
let scoreJoueur2 = 0;
let etatJeu = "menu";

// Définition des constantes du jeu

const largeurRaquette = 30;
const hauteurRaquette = 160;
const diametreBalle = 60;


// Fonction de configuration du jeu
function setup() {
  createCanvas(windowWidth,windowHeight);
  joueur1 = new Joueur(0, windowHeight / 2 - hauteurRaquette / 2);
  joueur2 = new IA(windowWidth - largeurRaquette, windowHeight / 2 - hauteurRaquette / 2);
  balle = new Balle(windowWidth/ 2, windowHeight / 2);
}

// Fonction de dessin du jeu
// Fonction de dessin du jeu
function draw() {
    background(0);

    stroke(255)
    strokeWeight(4)
    line(windowWidth/2, 0, windowWidth/2, height)
  noStroke()

 

    if (etatJeu === "menu") {
      afficherMenu();
    } else if (etatJeu === "jeu") {
      joueur1.deplacer();
      joueur2.deplacer();
      balle.deplacer();
      joueur1.afficher();
      joueur2.afficher();
      balle.afficher();
      balle.detecterCollisions();
      balle.detecterScores();
      afficherScores();
  
      // Condition de fin de partie
      if (scoreJoueur1 >= 10 || scoreJoueur2 >= 10) {
        etatJeu = "fin";
      }
    } else if (etatJeu === "fin") {
      afficherFin();
    }
  }
  

// Fonction de gestion des touches
function keyPressed() {
  if (keyCode === UP_ARROW) {
    joueur1.deplacerHaut();
  } else if (keyCode === DOWN_ARROW) {
    joueur1.deplacerBas();
  } else if (keyCode === ENTER && etatJeu !== "jeu") {
    etatJeu = "jeu";
    scoreJoueur1 = 0;
    scoreJoueur2 = 0;
  }
}

// Fonction de dessin du menu
function afficherMenu() {
    fill(0)
    stroke(255)
    strokeWeight(2)
    rect(width/2-300, height/2-100, 600, 200)
   
    noStroke()
 
 
    fill(255);
  textAlign(CENTER);
  textSize(32);
  text("Appuyez sur ENTRÉE pour commencer", width / 2, height / 2);
  
 
  
}

// Fonction de dessin de l'écran de fin
function afficherFin() {

    fill(0)
    stroke(255)
    strokeWeight(2)
    rect(width/2-300, height/2-100, 600, 200)
   
    noStroke()

  fill(255);
  textAlign(CENTER);
  textSize(32);
  text("Jeu terminé", width / 2, height / 2 - 20);
  textSize(24);
  text("Score : " + scoreJoueur1, width / 2, height / 2 + 20);
  text("Appuyez sur ENTRÉE pour rejouer", width / 2, height / 2 + 60);
}

// Fonction d'affichage des scores
function afficherScores() {
  fill(255);
  textAlign(CENTER);
  textSize(24);
  text(scoreJoueur1, width / 4, 30);
  text(scoreJoueur2, 3 * width / 4, 30);
}

// Classe du joueur
class Joueur {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  deplacerHaut() {
    if (this.y - vitesseJoueur >= 0) {
      this.y -= vitesseJoueur;
    }
  }

  deplacerBas() {
    if (this.y + hauteurRaquette + vitesseJoueur <= height) {
      this.y += vitesseJoueur;
    }
  }

  deplacer() {
    if (keyIsDown(UP_ARROW)) {
      this.deplacerHaut();
    } else if (keyIsDown(DOWN_ARROW)) {
      this.deplacerBas();
    }
  }

  afficher() {
    fill(255);
    rect(this.x, this.y, largeurRaquette, hauteurRaquette);
  }
}

// Classe de l'IA
class IA extends Joueur {
    deplacer() {
      // Réglage de la réactivité de l'IA
      let reactivite = 0.13;
      let objectifY = balle.y - hauteurRaquette / 2;
  
      this.y += (objectifY - this.y) * reactivite;
    }
  }

// Classe de la balle
class Balle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }


  deplacer() {
    this.x += vitesseBalle.x;
    this.y += vitesseBalle.y;
  }

  detecterCollisions() {
    if (
      (this.y - diametreBalle / 2 <= 0 && vitesseBalle.y < 0) ||
      (this.y + diametreBalle / 2 >= height && vitesseBalle.y > 0)
    ) {
      vitesseBalle.y *= -1;
    }

    if (this.x - diametreBalle / 2 <= joueur1.x + largeurRaquette &&
      this.y >= joueur1.y &&
      this.y <= joueur1.y + hauteurRaquette &&
      vitesseBalle.x < 0) {
      vitesseBalle.x *= -1;
    }

    if (this.x + diametreBalle / 2 >= joueur2.x &&
      this.y >= joueur2.y &&
      this.y <= joueur2.y + hauteurRaquette &&
      vitesseBalle.x > 0) {
      vitesseBalle.x *= -1;
    }
  }



  detecterScores() {
    if (this.x - diametreBalle / 2 <= 0) {
      scoreJoueur2++;
      this.reinitialiser();
    }

    if (this.x + diametreBalle / 2 >= width) {
      scoreJoueur1++;
      this.reinitialiser();
    }
  }


  reinitialiser() {
    this.x = width / 2;
    this.y = height / 2;
    vitesseBalle.x = random([-1, 1]) * random(9, 15); // Trajectoire horizontale aléatoire
    vitesseBalle.y = random([-1, 1]) * random(9, 15); // Trajectoire verticale aléatoire
  }

  afficher() {
    fill(255,0,0);
    dessinerEtoile(this.x, this.y, diametreBalle, 5);
}
}

function dessinerEtoile(x, y, taille, branches) {
    push();
    translate(x, y);
    rotate(frameCount * 0.02); // Rotation de l'étoile
  
    beginShape();
    for (let i = 0; i < branches * 2; i++) {
      let angle = map(i, 0, branches * 2, 0, TWO_PI);
      let rayon = i % 2 === 0 ? taille / 2 : taille / 4;
      let posX = cos(angle) * rayon;
      let posY = sin(angle) * rayon;
      vertex(posX, posY);
    }
    endShape(CLOSE);
  
    pop();
  }