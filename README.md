Peg Solitaire
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

This video is a walkthrough of how I played the game: 

https://user-images.githubusercontent.com/92794242/176840166-961b6c01-4797-4ca6-a04b-9793f857835d.mp4





This is the submission template for your Computing 2 Applications coursework submission.

## Checklist
### Install dependencies locally
This template relies on a a few packages from the Node Package Manager, npm.
To install them run the following commands in the terminal.
```properties
npm install
npm install --prefix ./web-app/common
```
These won't be uploaded to your repository because of the `.gitignore`.
I'll run the same commands when I download your repos.

### Game Module – API
*You will produce an API specification, i.e. a list of function names and their signatures, for a Javascript module that represents the state of your game and the operations you can perform on it that advances the game or provides information.*

- [ ] Include a `.js ` module file in `/web-app/common` containing the API using `jsdoc`.
- [ ] Update `/jsdoc.json` to point to this module in `.source.include` (line 7)
- [ ] Compile jsdoc using the run configuration `Generate Docs`
- [ ] Check the generated docs have compiled correctly.

### Game Module – Implementation
*You will implement, in Javascript, the module you specified above. Such that your game can be simulated in code, e.g. in the debug console.*

- [ ] The file above should be fully implemented.

### Unit Tests – Specification
*For the Game module API you have produced, write a set of unit tests descriptions that specify the expected behaviour of one aspect of your API, e.g. you might pick the win condition, or how the state changes when a move is made.*

- [ ] Write unit test definitions in `/web-app/tests`.
- [ ] Check the headings appear in the Testing sidebar.

### Unit Tests – Implementation
*Implement in code the unit tests specified above.*

- [ ] Implement the tests above.

### Web Application
*Produce a web application that allows a user to interface with your game module.*

- Implement in `/web-app/browser`
  - [ ] `index.html`
  - [ ] `default.css`
  - [ ] `main.js`
  - [ ] Any other files you need to include.

### Finally
- [ ] Push to GitHub.
- [ ] Sync the changes.
- [ ] Check submission on GitHub website.


