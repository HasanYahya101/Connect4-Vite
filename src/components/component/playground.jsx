import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';

const ROWS = 6;
const COLS = 7;
const EMPTY = null;
const PLAYER1 = 'red';
const PLAYER2 = 'yellow';

const Connect4 = () => {
    const [board, setBoard] = useState(Array(ROWS).fill().map(() => Array(COLS).fill(EMPTY)));
    const [currentPlayer, setCurrentPlayer] = useState(PLAYER1);
    const [winner, setWinner] = useState(null);
    const [gameOver, setGameOver] = useState(false);

    const dropPiece = (col) => {
        if (gameOver) return;

        const newBoard = [...board];
        for (let row = ROWS - 1; row >= 0; row--) {
            if (newBoard[row][col] === EMPTY) {
                newBoard[row][col] = currentPlayer;
                setBoard(newBoard);
                checkWinner(row, col);
                setCurrentPlayer(currentPlayer === PLAYER1 ? PLAYER2 : PLAYER1);
                break;
            }
        }
    };

    const checkWinner = (row, col) => {
        const directions = [
            [0, 1], [1, 0], [1, 1], [1, -1]
        ];

        for (const [dx, dy] of directions) {
            let count = 1;
            for (const factor of [-1, 1]) {
                let r = row + factor * dx;
                let c = col + factor * dy;
                while (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === currentPlayer) {
                    count++;
                    r += factor * dx;
                    c += factor * dy;
                }
            }
            if (count >= 4) {
                setWinner(currentPlayer);
                setGameOver(true);
                return;
            }
        }

        if (board.every(row => row.every(cell => cell !== EMPTY))) {
            setGameOver(true);
        }
    };

    const resetGame = () => {
        setBoard(Array(ROWS).fill().map(() => Array(COLS).fill(EMPTY)));
        setCurrentPlayer(PLAYER1);
        setWinner(null);
        setGameOver(false);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-blue-100">
            <div className='flex justify-center items-center self-center'>
                <h1 className="text-4xl font-bold mb-4">Connect 4</h1>
                <div className="ml-4 flex items-center justify-center mb-2.5">
                    {currentPlayer === PLAYER1 ? <div className="w-4 h-4 rounded-full bg-red-500 mr-2" /> : <div className="w-4 h-4 rounded-full bg-yellow-400 mr-2" />}
                </div>
            </div>
            <div className="bg-blue-500 p-4 rounded-lg shadow-lg">
                {board.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex">
                        {row.map((cell, colIndex) => (
                            <motion.div
                                key={colIndex}
                                className="w-16 h-16 bg-blue-700 m-1 rounded-full flex items-center justify-center cursor-pointer"
                                onClick={() => dropPiece(colIndex)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                {cell && (
                                    <motion.div
                                        className={`w-14 h-14 rounded-full ${cell === PLAYER1 ? 'bg-red-500' : 'bg-yellow-400'}`}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                    />
                                )}
                            </motion.div>
                        ))}
                    </div>
                ))}
            </div>
            {gameOver && (
                <div className="mt-4 text-xl font-bold">
                    {winner ? `${winner === PLAYER1 ? 'Red' : 'Yellow'} wins!` : "It's a draw!"}
                </div>
            )}
            <Button
                className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                onClick={resetGame}
            >
                New Game
            </Button>
        </div>
    );
};

export default Connect4;