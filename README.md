Peg Solitaire.
**CID**: 02150093

The game that I decided to make for the Computing 2 Coursework is Peg Solitaire.

It is a game involving empty holes and pegs. 

"A valid move is to jump a peg orthogonally (vertically or horizontally) over an adjacent peg into a hole two positions away and then to remove the jumped peg."

The goal of the game is to have the least number of pegs left on the board when the player runs out of valid moves. 

Although the original board of the game is in a + sign, I thought of modifying it into a square board, which looks like the following image:

![image](https://user-images.githubusercontent.com/92794242/176841555-58a3d896-8472-495d-af8c-23617250b08b.png)

The board starts of with all holes filled with pegs, except one, allowing for valid moves in the start. To increase the complexity of retrying, everytime the board is loaded, the empty piece appears at a random place, showed in this video:

https://user-images.githubusercontent.com/92794242/176840144-cd81b93e-f76f-4e30-be06-b74ed91b3379.mp4


To play, the user has to first click on the peg to play, and then select the empty hole 2 positions away. At every move, one peg is removed. At the end, when there are no possible valid moves, the game ends. The final score is calculated by counting the number of pegs left. If the player has 1 peg left, they win the game. 

Everytime you click a peg, on the footer, it shows the possible valid positions that peg can go to. Note: the valid moves are in the form of an array, with the first one showing the row number, followed by column number (0-5 each).

This video is a walkthrough of how I played the game: 

https://user-images.githubusercontent.com/92794242/176840166-961b6c01-4797-4ca6-a04b-9793f857835d.mp4

