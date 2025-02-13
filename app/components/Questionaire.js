'use client'
import { useState } from "react";
import QuizQuestion from "./QuizQuestion";
import Button from "./Button";
import TitleTextBtn from "./TitleTextBtn";

export default function Questionaire() {
    const questions = [
        {
            number: "1",
            question: "What gender do you identify with?",
            info: "Some people don’t identify with the sex they were assigned at birth. So we ask for your gender so that we can address you correctly.",
            answers: ["Female", "Male", "Other", "Prefer not to say"],
            multipleChoice: false
        },
        {
            number: "2",
            question: "What sex were you assigned at birth?",
            info: "We ask this so we can further personalise your medicines.",
            answers: ["Female", "Male"],
            multipleChoice: false
        },
        {
            number: "3",
            question: "Have you ever experienced any of the following?",
            info: "Please select all that apply.",
            answers: ["Pain", "Depression/Anxiety", "High Cholesterol", "Stroke", "Heart Attack", "Heartburn/Reflux", "Blood Clots", "None of the above"],
            multipleChoice: true
        }
    ];

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({}); // Store answers per question
    const [isEnd, setIsEnd] = useState(false)

    // Handle selection updates
    const handleSelectAnswer = (answer) => {
        const isMultipleChoice = questions[currentQuestion].multipleChoice;

        setSelectedAnswers((prev) => ({
            ...prev,
            [currentQuestion]: isMultipleChoice
                ? prev[currentQuestion]?.includes(answer) 
                    ? prev[currentQuestion].filter((a) => a !== answer) // Remove if already selected
                    : [...(prev[currentQuestion] || []), answer] // Add selection
                : answer, // Single selection
        }));
    };

    // Move to next question
    const handleNext = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            setIsEnd(true)
        }
    };

    return (
        <div className="flex flex-col justify-center items-center w-full h-[80dvh] text-center px-12">
            {!isEnd ?
            <>
                <div className="text-xl font-bold">When it comes to your genes, it&apos;s personal.</div>
                <div className="mt-6 mb-10 text-sm text-center">
                    Answer a few questions to help us tailor your results to your needs.
                </div>
    
                {/* Show only the current question */}
                <QuizQuestion 
                    number={questions[currentQuestion].number}
                    question={questions[currentQuestion].question}
                    info={questions[currentQuestion].info}
                    answers={questions[currentQuestion].answers}
                    multipleChoice={questions[currentQuestion].multipleChoice}
                    selected={selectedAnswers[currentQuestion] || []} // Pass selected answer(s)
                    onSelect={handleSelectAnswer} // Handle selection
                />
    
                {/* Show Next button */}
                <div className="mt-[10dvh]">
                    <Button 
                        text={currentQuestion < questions.length - 1 ? "Next" : "Submit"} 
                        colour="bg-favaGreen text-white" 
                        onClick={handleNext} 
                    />
                </div>
            </>
            :
            <TitleTextBtn title="It's good to get to know you." btnText="Done" btnColour="bg-favaGreen text-white">
                You&apos;re one step closer to personalising your medicines.
            </TitleTextBtn>
            }
        </div>
    );
}
