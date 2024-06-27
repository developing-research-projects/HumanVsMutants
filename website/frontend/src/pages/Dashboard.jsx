import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { useNavigate } from 'react-router-dom';
import { InfinitySpin } from "react-loader-spinner";
import { Badge } from "@/components/ui/badge";

const Dashboard = () => {
    const { toast } = useToast();
    const navigate = useNavigate();
    const [username, setUsername] = useState(null);
    const [loading, setLoading] = useState(true);
    const [taskLoading, setTaskLoading] = useState(true);
    const [newTaskLoading, setNewTaskLoading] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [hasOpenTasks, setHasOpenTasks] = useState(false)
    const [remainingTasks, setRemainingTasks] = useState(null);

    //fetch username 
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/users/me`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });

                    setUsername(response.data.user.username);
                }
            } catch (error) {

            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    //fetch user list of tasks      
    const fetchUserTasks = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/users/tasks`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setTasks(response.data); // Directly set the tasks state
                setHasOpenTasks(response.data.some(task => task.status === 'ASSIGNED')); 
            }
        } catch (error) {

            toast({
                variant: "destructive",
                title: "Error fetching user tasks",
                description: "Please try again",
            });
            setHasOpenTasks(true); // If tasks fetch request fails do not let user request for a task
        } finally {
            setTaskLoading(false)
        }
    };

        // Sort tasks based on status
        const sortedTasks = tasks.slice().sort((a, b) => {
            if (a.status === 'ASSIGNED' && b.status !== 'ASSIGNED') return -1;
            if (a.status !== 'ASSIGNED' && b.status === 'ASSIGNED') return 1;
            return 0;
        });
    
        useEffect(() => {
            setTasks(sortedTasks);
        }, [tasks]);

    useEffect(() => {
        fetchUserTasks();
        fetchRemainingTasks();
    }, []);     

    //handle user request for a new task
    const handleNewTask = async () => {
        // Check if any open tasks, if none open then allow request for new task.
        setNewTaskLoading(true)
        const hasOpenTasks = tasks.some(task => task.status === 'ASSIGNED');
        
        if (!hasOpenTasks) {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const response = await axios.post(`${import.meta.env.VITE_APP_API_URL}/users/request`, {}, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    toast({
                        variant: "newVariant",
                        title: "New Task Requested",
                    });
                    setTaskLoading(true) //set loading true while refetching the new tasks list
                    fetchUserTasks(); // Refresh tasks after requesting new task
                }
            } catch (error) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to request a new task.",
                });
            } finally {
                setNewTaskLoading(false);
            }
        } else {
            toast({
                variant: "destructive",
                title: "Open Task Pending",
                description: "A new task can be requested upon completing the currently open one.",
            });
            setNewTaskLoading(false);
        }
    };    


    const fetchRemainingTasks = async () => {
        const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/mutants/remaining`);
        setRemainingTasks(response.data.remaining);
    }

    return (
        <div>
            <Navbar />
            <div className='flex flex-col min-h-screen bg-gray-100'>
                <Toaster />
                <div className='flex flex-col items-center justify-center mt-36'>
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        <h1 className='text-2xl text-center font-normal text-gray-900 mb-1'>Hello, {username}</h1>
                    )}
                    <Badge variant="default">{remainingTasks} Total Tasks Remaining</Badge>
                    <p className='text-5xl text-center font-semibold text-gray-900 mb-3'>Your Tasks</p>
                    <Button
                        className={`text-xl w-5/6 lg:w-2/6 mt-5 font-light ${hasOpenTasks ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-900'}`}
                        onClick={handleNewTask}
                        disabled={hasOpenTasks}
                    >
                        <span className='mr-2'>+</span> Request a New Task
                    </Button>
                    {newTaskLoading && (<InfinitySpin width="200" color="black" />)}
                    <div className='mt-5 w-5/6 lg:w-3/6 max-h-96 overflow-y-scroll'>
                        {taskLoading ? (
                            // loading animation
                            <div className="animate-pulse">
                                <div className="bg-gray-400 h-16 mb-2 rounded-md"></div>
                                <div className="bg-gray-400 h-16 mb-2 rounded-md"></div>
                                <div className="bg-gray-400 h-16 mb-2 rounded-md"></div>
                                <div className="bg-gray-400 h-16 mb-2 rounded-md"></div>
                                <div className="bg-gray-400 h-16 rounded-md"></div>
                            </div>
                        ) : (
                            tasks.length > 0 ? (
                            tasks.map((task, index) => {
                                const descendingIndex = tasks.length - index;
                                return (
                                    <Alert key={index} className='mb-4'>
                                        <div className='flex flex-row justify-between'>
                                            <p className='text-gray-950 text-base font-semibold flex items-center'>
                                                [{descendingIndex}]{' '}
                                                {/*FIXME: Needed fix to disable link to main, instead link to 461dfea3626452643d4138fef934535979fe87e9 inside Task.jsx*/}
                                                <a /*href={task.address} target="_blank" rel="noopener noreferrer"*/ className="text-gray-950 text-xs lg:text-base font-normal  flex items-center ml-2">
                                                    {task.mutant_name}
                                                </a>
                                            </p>
                                            {task.status === 'SUBMITTED' ? (
                                                <div className={`flex justify-center items-center text-sm lg:text-base w-24 p-2 h-10 font-normal text-center ml-4 text-white rounded-md bg-gray-300`} >
                                                    {task.status}
                                                </div>
                                            ) : (
                                                <button className={`flex justify-center items-center text-sm lg:text-base w-24 p-2 h-10 font-normal text-center ml-4 text-white rounded-md bg-gray-600`}
                                                    onClick={() => navigate('/Task', { state: { taskLink: task.address, taskName: task.mutant_name, mutant_id: task.mutant_id} })}>
                                                    OPEN
                                                </button>
                                            )}
                                        </div>
                                    </Alert>
                                );
                            })
                            ):(
                                <Alert className='mb-4'>
                                <div className='flex flex-row justify-center items-center text-center'>
                                    <p className='text-gray-950 text-base font-semibold flex items-center'>
                                        You have no tasks at the moment.
                                    </p>
                                </div>
                            </Alert>
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
