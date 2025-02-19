'use client';
import React, { JSX } from "react";

interface QuizQuestionProps {
    index: number; // Replace number with index
    question: string;
    info: string;
    answers: string[];
    multipleChoice: boolean;
    selected: string | string[] | undefined;
    onSelect: (answer: string) => void;
    inputType?: string;
}

const today = new Date().toISOString().split("T")[0];

const QuizQuestion: React.FC<QuizQuestionProps> = ({
    index, // Now using index
    question,
    info,
    answers,
    multipleChoice,
    selected,
    onSelect,
    inputType = "options",
}) => {
    let inputElement: JSX.Element | null = null;

    switch (inputType) {
        case "date":
            inputElement = (
                <input
                    type="date"
                    id={`answer-${index}`}
                    value={selected as string || ""}
                    onChange={(e) => onSelect(e.target.value)}
                    max={today} // No future dates
                    className="border border-gray-300 rounded px-3 py-2 mt-2 w-full"
                />
            );
            break;
        case "text":
            inputElement = (
                <input
                    type="text"
                    id={`answer-${index}`}
                    value={selected as string || ""}
                    onChange={(e) => onSelect(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 mt-2 w-full"
                />
            );
            break;
        case "options":
        default:
            inputElement = (
                <div className="flex flex-col items-start mt-4 space-y-3">
                    {answers.map((a, i) => {
                        const letter = String.fromCharCode(65 + i);
                        const isChecked = multipleChoice
                            ? (selected as string[] || []).includes(a)
                            : selected === a;

                        return (
                            <div key={i} className="flex items-center space-x-3">
                                <input
                                    type={multipleChoice ? "checkbox" : "radio"}
                                    id={`answer-${index}-${i}`}
                                    name={`question-${index}`}
                                    value={a}
                                    checked={isChecked}
                                    onChange={() => onSelect(a)}
                                    className="hidden"
                                />
                                <label
                                    htmlFor={`answer-${index}-${i}`}
                                    className="flex items-center space-x-2 cursor-pointer text-gray-700"
                                >
                                    <div
                                        className={`w-5 h-5 border border-black rounded flex items-center justify-center ${
                                            isChecked ? "bg-favaBean text-favaGreen" : "bg-white"
                                        }`}
                                    >
                                        {isChecked && (
                                            <svg
                                                className="w-4 h-4 text-favaGreen"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="3"
                                            >
                                                <path d="M5 12l4 4L19 7" />
                                            </svg>
                                        )}
                                    </div>
                                    <span className="font-semibold">{letter}. {a}</span>
                                </label>
                            </div>
                        );
                    })}
                </div>
            );
            break;
    }

    return (
        <div className="text-left md:w-[32vw]">
            <div className="font-bold">{index + 1}. <span className="font-semibold">{question}</span></div> 
            {/* Using index+1 for question number */}
            <div className="text-sm text-gray-600 mt-1">{info}</div>

            {inputElement}
        </div>
    );
};

export default QuizQuestion;
