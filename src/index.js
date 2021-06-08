import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button
      className={`square ${props.winner ? "winner" : ""}`} 
      onClick={props.onClick}
    >
      {props.value}
    </button>
  )
}

class Board extends React.Component {
  renderSquare(i) {
    return <Square key={i}
      value={this.props.squares[i]}
      winner = {this.props.winningCells.includes(i)}
      onClick={() => this.props.onClick(i)}  
    />;
  }

  renderRow(rowNumber){
    let row = [];
    for(let columnNumber = 0; columnNumber < 3; columnNumber++){
      row.push(this.renderSquare(rowNumber * 3 + columnNumber));
    }

    return (<div key={rowNumber} className="board-row">
      {row}
    </div>)
  }

  render() {
    const rows = [];
    for(let i = 0; i < 3; i++){
      rows.push(this.renderRow(i));
    }

    return (
      <div>
        {rows}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        whatChanged: -1,
      }],
      stepNumber: 0,
      xIsNext: true,
    }
  }

  handleClick(i){
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if(calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        whatChanged: computeWhatChanged(current.squares, squares),
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    })
  }

  jumpTo(step){
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    })
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    
    const moves = history.map((move, moveNumber) => {
      let whatChanged = -1;
      if(moveNumber !== 0) whatChanged = history[moveNumber].whatChanged;
      const desc = moveNumber ? 
        "Go to move #" + moveNumber + ' - (' + Math.floor(whatChanged / 3) + ', ' + (whatChanged % 3) + ')' : 
        "Go to game start";
    
      return (
        <li key={moveNumber} className={`${this.state.stepNumber === moveNumber ? "active" : ""}`}>
          <button onClick={() => {this.jumpTo(moveNumber)}}>{desc}</button>
        </li>
      )  
    })
    
    
    let status;
    let winningCells = [-1, -1, -1]
    
    if(winner){
      console.log(winner);
      status = 'Winner: ' + winner;
      winningCells = [winner[1], winner[2], winner[3]];
    }
    else if(this.state.stepNumber === 9){
      status = "DRAW!!!";
    }
    else{
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      
    }


    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares = {current.squares}
            winningCells = {winningCells}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ul>{moves}</ul>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a], a, b, c];
    }
  }
  return null;
}

function computeWhatChanged(oldSquares, newSquares){
  for(let i=0; i<newSquares.length; i++){
    if(oldSquares[i] !== newSquares[i])
      return i;
  }
  return -1;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
