'use client'
import React from "react";

export default function QuizQuestion({ 
    number, 
    question, 
    info, 
    answers, 
    multipleChoice = false, 
    selected, 
    onSelect 
}) {
    return (
        <div className="text-left md:w-[32vw]">
            {/* Question Number & Text */}
            <div className="font-bold">{number}. <span className="font-semibold">{question}</span></div>
            <div className="text-sm text-gray-600 mt-1">{info}</div>

            {/* Answer Options */}
            <div className="flex flex-col items-start mt-4 space-y-3">
                {answers.map((a, i) => {
                    const letter = String.fromCharCode(65 + i); // Convert index to A, B, C, etc.
                    const isChecked = multipleChoice ? selected.includes(a) : selected === a;

                    return (
                        <div key={i} className="flex items-center space-x-3">
                            {/* Hidden Input */}
                            <input
                                type={multipleChoice ? "checkbox" : "radio"}
                                id={`answer-${number}-${i}`}
                                name={`question-${number}`}
                                value={a}
                                checked={isChecked}
                                onChange={() => onSelect(a)} // Calls parent function
                                className="hidden"
                            />
                            
                            {/* Custom Styled Checkbox/Radio */}
                            <label
                                htmlFor={`answer-${number}-${i}`}
                                className="flex items-center space-x-2 cursor-pointer text-gray-700"
                            >
                                <div
                                    className={`w-5 h-5 border border-black rounded flex items-center justify-center ${
                                        isChecked ? "bg-favaBean text-favaGreen" : "bg-white"
                                    }`}
                                >
                                    {isChecked && (
                                        <svg className="w-4 h-4 text-favaGreen" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
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
        </div>
    );
}
