'use client';

import { useState } from "react";
import QuizQuestion from "./QuizQuestion";
import Button from "./Button";
import TitleTextBtn from "./TitleTextBtn";
import { updateUser } from "@/utils/updateUser";

interface Question {
    question: string;
    info: string;
    multipleChoice: boolean;
    answers?: string[]; // Optional answers
    inputType?: string; // Optional input type
}

export default function Questionaire() {
    const questions: Question[] = [ // Type the questions array
        {
            question: "What is your date of birth?",
            info: "We capture this to better understand your risk and tailor your results",
            multipleChoice: false,
            inputType: "date"
        },
        {
            question: "What gender do you identify with?",
            info: "Some people don’t identify with the sex they were assigned at birth. So we ask for your gender so that we can address you correctly.",
            answers: ["Female", "Male", "Other", "Prefer not to say"],
            multipleChoice: false
        },
        {
            question: "What sex were you assigned at birth?",
            info: "We ask this so we can further personalise your medicines.",
            answers: ["Female", "Male"],
            multipleChoice: false
        },
        {
            question: "What is your ethnic group?",
            info: "We are committed to delivering equitable services, by providing this information you help us understand who we serve and who we are missing.",
            answers: ["White", "Mixed or multiple ethnic group", "Asian or Asian British", "Black, African, Caribbean or Black British", "Other ethnic group", "Prefer not to say"],
            multipleChoice: false
        },
        {
            question: "Do you take any regular medicines at the moment?",
            info: "",
            answers: ["Yes", "No", "Prefer not to say"],
            multipleChoice: false
        },
        {
            question: "What medicines do you take?",
            info: "We ask this so we can personalise how we present your results. You can enter generic or brand names",
            multipleChoice: false,
            inputType: "text"
        },
        {
            question: "Have you ever had any of the following issues with medicines?",
            info: "Please select all that apply",
            answers: ["Side Effects", "Medicines not working", "Dose had to be adjusted", "No", "Other (please specify)", "Prefer not to say"],
            multipleChoice: true
        },
    ];

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string | string[]>>({}); // Type selectedAnswers
    const [isEnd, setIsEnd] = useState(false);

    const handleSelectAnswer = (answer: string) => { // Explicitly type answer
        const isMultipleChoice = questions[currentQuestion].multipleChoice;

        setSelectedAnswers((prev) => {
            const currentAnswers = prev[currentQuestion] || (isMultipleChoice ? [] : undefined);
            return {
                ...prev,
                [currentQuestion]: isMultipleChoice
                    ? (currentAnswers as string[]).includes(answer) // Type assertion and cast
                        ? (currentAnswers as string[]).filter((a) => a !== answer)
                        : [...(currentAnswers as string[] || []), answer]
                    : answer,
            };
        });
    };

    const handleUpdateUser = async () => {
        try {
            const updatedUser = await updateUser(selectedAnswers);
    
            if (updatedUser) {
                console.log("User updated successfully:", updatedUser);
            } else {
                console.error("Failed to update user.");
            }
        } catch (error) {
            console.error("Error updating user:", error);
        }
    };


    const handleNext = () => {
        const nextQuestion = currentQuestion + 1;

    
        if (currentQuestion === 4) {

            const takesMedicine = selectedAnswers[4];
    
            if (takesMedicine !== "Yes") {
                setCurrentQuestion(6);
                return;
            }
        }
    
        if (nextQuestion < questions.length) {
            setCurrentQuestion(nextQuestion);
        } else {
            setIsEnd(true);
            handleUpdateUser()
        }
    };

    const handleBack = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };
    
    return (
        <div className="flex flex-col justify-center items-center w-full h-[80dvh] text-center px-12">
            {!isEnd ? (
                <>
                    <div className="text-xl font-bold">When it comes to your genes, it&apos;s personal.</div>
                    <div className="mt-6 mb-10 text-sm text-center">
                        Answer a few questions to help us tailor your results to your needs.
                    </div>

                    <QuizQuestion
                        index={currentQuestion} 
                        question={questions[currentQuestion].question}
                        info={questions[currentQuestion].info}
                        answers={questions[currentQuestion].answers || []} // Provide default empty array
                        multipleChoice={questions[currentQuestion].multipleChoice}
                        selected={selectedAnswers[currentQuestion] || (questions[currentQuestion].multipleChoice ? [] : undefined)} // Correct selected value
                        inputType={questions[currentQuestion].inputType}
                        onSelect={handleSelectAnswer}
                    />
                    <div className="flex items-center justify-center mt-[10dvh] space-x-5">
                        {currentQuestion > 0 && (
                            <Button
                                text="Back"
                                colour="bg-favaBean text-white"
                                onClick={handleBack}
                            />
                        )}

                        <div className="">
                            <Button
                                text={currentQuestion < questions.length - 1 ? "Next" : "Submit"}
                                colour="bg-favaGreen text-white"
                                onClick={handleNext}
                            />
                        </div>
                    </div>
                </>
            ) : (
                <TitleTextBtn title="It's good to get to know you." btnText="Done" btnColour="bg-favaGreen text-white">
                    You&apos;re one step closer to personalising your medicines.
                </TitleTextBtn>
            )}
        </div>
    );
}