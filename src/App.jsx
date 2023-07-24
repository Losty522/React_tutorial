import { useState } from "react";

//このJSX構文を返す関数は、コンポーネント
//単体で呼び出されるものは、関数、クラス内で定義された関数はメソッド
function Square({value,onSquareClick}) {
  return <button className="square" onClick={onSquareClick} > {value} </button>;
}

function Board({ xIsNext, squares, onPlay }) {

  const winner = calculateWinner(squares);
  let status;
  if(winner){
    status = "Winner: "+ winner;
  }else{
    status = "Next Player: " +(xIsNext ? "X" : "O");
  }

  function handleClick(i) {
    //勝敗判定
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();//配列コピー
    if(xIsNext){
      nextSquares[i] = "X";//コピーした配列に値を代入  
    }else{
      nextSquares[i] = "O";//コピーした配列に値を代入  
    }
    onPlay(nextSquares);
  }

  return(
  <>
    <div className="status">{status}</div>
    <div className="board-row">
      {/*propsとは？ 親コンポーネントから子コンポーネントにデータを受け渡しすることができる機能のことです。
        この関数は、データの入った “props”（「プロパティ」の意味）というオブジェクトを引数としてひとつ受け取り、
        React 要素を返すので、有効な React コンポーネントです。
        */}
      {/*Square関数呼び ValuseのProps 値はボードの配列0を参照 OnClickのところにhandleClick関数を渡す */}
      <Square value={squares[0]} onSquareClick={()=>handleClick(0)}/>
      <Square value={squares[1]} onSquareClick={()=>handleClick(1)}/>
      <Square value={squares[2]} onSquareClick={()=>handleClick(2)}/>
    </div>
    <div className="board-row">
      <Square value={squares[3]} onSquareClick={()=>handleClick(3)}/>
      <Square value={squares[4]} onSquareClick={()=>handleClick(4)}/>
      <Square value={squares[5]} onSquareClick={()=>handleClick(5)}/>
    </div>
    <div className="board-row">
      <Square value={squares[6]} onSquareClick={()=>handleClick(6)}/>
      <Square value={squares[7]} onSquareClick={()=>handleClick(7)}/>
      <Square value={squares[8]} onSquareClick={()=>handleClick(8)}/>
    </div>
  </>
  );
}


export default function Game() {
  //memo--- const [ 状態を保持する値、状態を更新する関数 ] = useState（初期値）
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);//何番目か用の変数
  const currentSquares = history[currentMove];//現在の盤面をヒストリーから変数に渡す BoardコンポーネントにPropsとして渡す
  const xIsNext = currentMove % 2 === 0;
  console.log(history);
  //ボードをクリックされたときの処理
  //nextSquares:ボードの配列が渡ってくる
  function handlePlay(nextSquares) {
    //slice(スタート0から,End何番目の要素まで取るか−1は全部)
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);//履歴を更新
    setCurrentMove(nextHistory.length - 1);//Historyから現在の盤面を更新
  }

  //履歴ボタンが押されたときの処理
  // 
  function jumpTo(nextMove) {
    setCurrentMove(nextMove);//MapからMoveのインデックスがはいる
  }

  //map (elemet,index,array)
  const moves = history.map((squares, move) => {
    let description;
    if(move > 0){
      description = 'Go to move #' + move;
    }else{
      description = 'Go to game start';
    }
    return(
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return(
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}


//勝敗判定用の関数
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a,b,c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
