import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { CircleHelp, Plus } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

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
    const [newHover, setNewHover] = useState(false);

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
        <div className="flex flex-col items-center justify-center h-screen w-screen min-h-screen min-w-[100vw] bg-blue-100">
            <div className='flex justify-center items-center self-center my-6'>
                <span className="text-2xl font-bold">{currentPlayer === PLAYER1 ? 'Player Red' : 'Player Yellow'}'s turn</span>
                <Button className="ml-2 bg-blue-100" variant="outline" onClick={() => alert('Connect 4 is a two-player connection game in which the players first choose a color and then take turns dropping colored discs from the top into a seven-column, six-row vertically suspended grid. The pieces fall straight down, occupying the lowest available space within the column. The objective of the game is to be the first to form a horizontal, vertical, or diagonal line of four of one\'s own discs.')}
                    size="icon"
                >
                    <CircleHelp size={24} />
                </Button>
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
            <div className="fixed bottom-9 right-9 flex flex-col gap-2 z-50">
                <button className="bg-green-500 hover:bg-green-600 text-white rounded-full p-3 shadow-lg transition-all duration-300 flex items-center group hover:pr-6"
                    onMouseEnter={() => setNewHover(true)}
                    onMouseLeave={() => setNewHover(false)}
                    onClick={resetGame}
                >
                    <Plus size={24} />
                    {newHover === true ?
                        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ml-1">
                            New
                        </span>
                        : null}
                </button>
            </div>
        </div>
    );
};

export default Connect4;