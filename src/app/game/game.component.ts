import { Component, OnInit } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  pickCardAnimation = false;
  game!: Game;
  currentCard: string = '';

  constructor(private firestore: AngularFirestore, public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.newGame();
    this
      .firestore
      .collection('games')
      .valueChanges()
      .subscribe((game) => {
        console.log('Game update', game);
      });
  }

  takeCard() {
    if (!this.pickCardAnimation) {
      this.currentCard = this.game.stack.pop()!;
      this.pickCardAnimation = true;

      console.log('currentCard =', this.currentCard);
      console.log(this.game);

      this.game.currentPlayer++;
      this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;

      setTimeout(() => {
        this.pickCardAnimation = false;
        this.game.playedCards.push(this.currentCard);
      }, 1000);
    }
  }

  newGame() {
    this.game = new Game();
    this.firestore.collection('games').add(this.game.toJson());
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent, {

    });

    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length < 0) {
        this.game.players.push(name);
      }
    });
  }

}
