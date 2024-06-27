import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from "@/components/ui/button"
import { Alert } from "@/components/ui/alert";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { useLocation } from 'react-router-dom';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

const Task = () => {
    const { toast } = useToast();
    const [selectedAnswer, setSelectedAnswer] = useState('');
    const [reasoning, setReasoning] = useState('');
    const [timeTaken, setTimeTaken] = useState('');
    const { state } = useLocation();
    const { taskLink, taskName, mutant_id } = state;
    //To protect the link to mutants seen by setting it to the original main commit
    const updatedTaskLink = taskLink.replace("/compare/main", "/compare/461dfea3626452643d4138fef934535979fe87e9"); 
    const navigate = useNavigate();

    const handleTextareaChange = (event) => {
        setReasoning(event.target.value);
    };


    const handleSubmit = async () => {
        try {
            if (!selectedAnswer || !reasoning || !timeTaken) {
                toast({
                    variant: "destructive",
                    title: "Failed to Submit",
                    description: "Please fill in all fields.",
                });
            }
            else if (timeTaken < 1) {
                toast({
                    variant: "destructive",
                    title: "Invalid Input",
                    description: "Time taken must be greater than or equal to 1",
                });
            }
            else if (!/^\d*\.?\d+$/.test(timeTaken) ) {
                toast({
                    variant: "destructive",
                    title: "Invalid Input",
                    description: "Time taken must be numeric only",
                });
            }
            else{
                const token = localStorage.getItem('token');

                const payload = {
                    mutant_id: mutant_id,
                    time_taken: parseInt(timeTaken),
                    decision: selectedAnswer.toUpperCase(),
                    explanation: reasoning
                };
                const response = await axios.post(`${import.meta.env.VITE_APP_API_URL}/users/submit`, payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            
                toast({
                    variant: "newVariant",
                    title: "Task Submitted Successfully",
                    description: "Rerouting back to list of tasks.",
                });
                setTimeout(() => {
                    navigate('/dashboard');
                }, 2000);
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Failed to Submit Task",
                description: "Please try again",
            });
        }
    };

    return (
        <div>
            <Navbar />
            <div className='flex flex-col min-h-screen bg-gray-100 pt-28'>
            <Toaster />
                <p className='text-xl lg:text-3xl text-center font-medium text-gray-900 my-10 mx-2'>{taskName}</p>

                <div className='flex flex-col lg:flex-row justify-center gap-x-0 lg:gap-x-12'>

                    <div className='flex flex-col justify-start items-center lg:items-end lg:w-1/2'>
                        <p className='text-gray-950 font-medium text-base text-start lg:w-1/2'>Mutant Link</p>
                        <Alert className='w-8/12 lg:w-6/12'>
                            <div className='flex flex-row justify-start items-center'>
                                <p className='text-blue-600 text-base font-semibold'>
                                    <a href={updatedTaskLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-xs lg:text-base font-normal underline flex items-center ml-2">
                                        {taskName}
                                    </a>
                                </p>
                            </div>
                        </Alert>

                        <p className='text-gray-950 font-medium text-base lg:w-1/2 pt-2 lg:pt-6'>Is the mutant buggy?</p>
                        <Select
                            value={selectedAnswer}
                            onValueChange={(value) => setSelectedAnswer(value)}
                        >
                            <SelectTrigger className="w-8/12 lg:w-6/12">
                                <SelectValue placeholder="Select an Option" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Yes">Yes</SelectItem>
                                <SelectItem value="No">No</SelectItem>
                                <SelectItem value="Maybe">Maybe</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className='flex flex-col justify-start items-center lg:items-start lg:w-1/2 mt-4 lg:mt-0'>
                        <p className='text-gray-950 font-medium text-base text-start'>Your Reasoning</p>
                        <textarea
                            rows="4"
                            className="block p-2.5 w-8/12 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Write your thoughts here..."
                            value={reasoning}
                            onChange={handleTextareaChange}
                        />
                            <p className='mt-2 text-gray-950 font-medium text-base text-start lg:w-1/2'>Time Taken (in minutes)</p>
                            <input
                                type="number"
                                min="0"
                                className="block p-2.5 w-8/12 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter time taken"
                                value={timeTaken}
                                onChange={(e) => setTimeTaken(e.target.value)}
                            />
                    </div>

                </div>

                

                <Button className='text-lg lg:text-xl w-8/12 lg:w-2/6 my-10 font-light bg-gray-900 mx-auto' onClick={handleSubmit}>
                    Submit
                </Button>
            </div>
        </div>
    );
}

export default Task;
