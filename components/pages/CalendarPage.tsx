import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { api } from '../../sdk';
import type { Activity } from '../../types';
import { useToasts } from '../../context/ToastContext';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';
import { Skeleton } from '../ui/Skeleton';
import Modal from '../ui/Modal';
import ActivityForm from '../activities/ActivityForm';
import ConfirmationModal from '../ui/ConfirmationModal';
import { ChevronLeftIcon, ChevronRightIcon } from '../shared/icons';

type CalendarView = 'month' | 'week' | 'day';

const CalendarPage: React.FC = () => {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState<CalendarView>('month');
    const [currentDate, setCurrentDate] = useState(new Date());
    const { addToast } = useToasts();
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
    const [preselectedDate, setPreselectedDate] = useState<string | null>(null);

    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [activityToDelete, setActivityToDelete] = useState<Activity | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchActivities = useCallback(async () => {
        setLoading(true);
        try {
            const data = await api.activity.list();
            setActivities(data);
        } catch (error) {
            addToast('Failed to fetch activities.', 'error');
        } finally {
            setLoading(false);
        }
    }, [addToast]);

    useEffect(() => {
        fetchActivities();
    }, [fetchActivities]);

    const handleOpenModal = (activity: Activity | null = null) => {
        setSelectedActivity(activity);
        setPreselectedDate(null);
        setIsModalOpen(true);
    };

    const handleOpenModalForDate = (date: Date) => {
        setSelectedActivity(null);
        setPreselectedDate(date.toISOString().split('T')[0]);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedActivity(null);
        setPreselectedDate(null);
    };

    const handleSaveActivity = async (formData: Omit<Activity, 'id'>) => {
        setIsSaving(true);
        try {
            if (selectedActivity) {
                await api.activity.update(selectedActivity.id, formData);
                addToast('Activity updated successfully!', 'success');
            } else {
                await api.activity.create(formData);
                addToast('Activity created successfully!', 'success');
            }
            handleCloseModal();
            fetchActivities();
        } catch (error) {
            addToast(`Failed to save activity.`, 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const openDeleteConfirmation = (activity: Activity) => {
        setActivityToDelete(activity);
        setIsConfirmModalOpen(true);
    };

    const handleDeleteActivity = async () => {
        if (!activityToDelete) return;
        setIsDeleting(true);
        try {
            await api.activity.deleteById(activityToDelete.id);
            addToast('Activity deleted successfully!', 'success');
            fetchActivities();
            setIsConfirmModalOpen(false);
            setActivityToDelete(null);
        } catch (error) {
            addToast('Failed to delete activity.', 'error');
        } finally {
            setIsDeleting(false);
        }
    };

    const activitiesByDate = useMemo(() => {
        return activities.reduce((acc, activity) => {
            const date = activity.date;
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(activity);
            return acc;
        }, {} as Record<string, Activity[]>);
    }, [activities]);

    const headerText = useMemo(() => {
        if (view === 'week') {
            const startOfWeek = new Date(currentDate);
            startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);
            
            if (startOfWeek.getMonth() === endOfWeek.getMonth()) {
                return `${startOfWeek.toLocaleDateString(undefined, { month: 'long' })} ${startOfWeek.getFullYear()}`;
            }
            return `${startOfWeek.toLocaleDateString(undefined, { month: 'short' })} - ${endOfWeek.toLocaleDateString(undefined, { month: 'short' })} ${endOfWeek.getFullYear()}`;
        }
        
        const options: Intl.DateTimeFormatOptions = { year: 'numeric' };
        if (view === 'month') options.month = 'long';
        if (view === 'day') {
            options.month = 'long';
            options.day = 'numeric';
        }
        return currentDate.toLocaleDateString(undefined, options);
    }, [currentDate, view]);

    const navigate = (direction: 'prev' | 'next') => {
        const newDate = new Date(currentDate);
        const offset = direction === 'prev' ? -1 : 1;
        if (view === 'month') newDate.setMonth(newDate.getMonth() + offset);
        if (view === 'week') newDate.setDate(newDate.getDate() + (offset * 7));
        if (view === 'day') newDate.setDate(newDate.getDate() + offset);
        setCurrentDate(newDate);
    };

    const colorClasses: Record<string, { bg: string; text: string; hover: string }> = {
        blue: { bg: 'bg-accent-100', text: 'text-accent-800', hover: 'hover:bg-accent-200' },
        green: { bg: 'bg-green-100', text: 'text-green-800', hover: 'hover:bg-green-200' },
        red: { bg: 'bg-red-100', text: 'text-red-800', hover: 'hover:bg-red-200' },
        yellow: { bg: 'bg-amber-100', text: 'text-amber-800', hover: 'hover:bg-amber-200' },
        purple: { bg: 'bg-purple-100', text: 'text-purple-800', hover: 'hover:bg-purple-200' },
    };

    const renderMonthView = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const days = Array.from({ length: firstDayOfMonth + daysInMonth }, (_, i) => {
            if (i < firstDayOfMonth) return null;
            return new Date(year, month, i - firstDayOfMonth + 1);
        });

        return (
            <div className="grid grid-cols-7 border-l border-t border-slate-200">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="py-2 text-center text-xs font-semibold text-slate-500 border-r border-b bg-slate-50">{day}</div>
                ))}
                {days.map((day, index) => (
                    <div
                        key={index}
                        className="h-36 border-r border-b p-1.5 flex flex-col relative group cursor-pointer hover:bg-slate-50 transition-colors"
                        onClick={() => day && handleOpenModalForDate(day)}
                    >
                        {day && (
                            <>
                                <span className={cn("text-xs font-medium", new Date().toDateString() === day.toDateString() ? 'bg-primary-500 text-white rounded-full h-5 w-5 flex items-center justify-center' : 'text-slate-700')}>{day.getDate()}</span>
                                <div className="mt-1 space-y-1 overflow-y-auto">
                                    {(activitiesByDate[day.toISOString().split('T')[0]] || []).map(activity => (
                                        <button
                                            key={activity.id}
                                            onClick={(e) => { e.stopPropagation(); handleOpenModal(activity); }}
                                            className={cn("w-full text-left text-xs p-1 rounded truncate", colorClasses[activity.color]?.bg, colorClasses[activity.color]?.text, colorClasses[activity.color]?.hover)}
                                        >
                                            {activity.title}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        );
    };
    
    const renderWeekView = () => {
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay()); // Starts week on Sunday

        const weekDays = Array.from({ length: 7 }, (_, i) => {
            const day = new Date(startOfWeek);
            day.setDate(startOfWeek.getDate() + i);
            return day;
        });
        
        return (
            <div className="grid grid-cols-7 border-l border-t border-slate-200">
                {weekDays.map((day) => (
                    <div key={day.toISOString()} className="flex flex-col border-r">
                        <div className="text-center py-2 border-b bg-slate-50">
                            <span className="text-xs font-semibold text-slate-500">{day.toLocaleDateString(undefined, { weekday: 'short' })}</span>
                            <p className={cn(
                                "text-xl font-bold mt-1",
                                new Date().toDateString() === day.toDateString() ? 'text-primary-600' : 'text-slate-800'
                            )}>
                                {day.getDate()}
                            </p>
                        </div>
                        <div
                            className="flex-grow min-h-[400px] border-b p-1.5 space-y-1 cursor-pointer hover:bg-slate-50 transition-colors"
                             onClick={() => handleOpenModalForDate(day)}
                        >
                            {(activitiesByDate[day.toISOString().split('T')[0]] || []).map(activity => (
                                <button
                                    key={activity.id}
                                    onClick={(e) => { e.stopPropagation(); handleOpenModal(activity); }}
                                    className={cn(
                                        "w-full text-left text-xs p-2 rounded-lg",
                                        colorClasses[activity.color]?.bg,
                                        colorClasses[activity.color]?.text,
                                        colorClasses[activity.color]?.hover
                                    )}
                                >
                                    <p className="font-semibold">{activity.title}</p>
                                    {(activity.startTime) && <p className="text-xs">{activity.startTime}{activity.endTime ? ` - ${activity.endTime}` : ''}</p>}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const renderDayView = () => <div>Day View Placeholder</div>;

    const renderCurrentView = () => {
        switch (view) {
            case 'month':
                return renderMonthView();
            case 'week':
                return renderWeekView();
            case 'day':
                return renderDayView();
            default:
                return renderMonthView();
        }
    };

    return (
        <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold text-slate-800">Activities Calendar</h1>
                    <Button variant="primary" onClick={() => handleOpenModal()}>
                        Add Activity
                    </Button>
                </div>
                
                <div className="bg-white rounded-xl shadow-md">
                    <div className="p-4 flex justify-between items-center border-b">
                        <div className="flex items-center space-x-2">
                            <button onClick={() => navigate('prev')} className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-700" aria-label="Previous">
                                <ChevronLeftIcon className="h-5 w-5" />
                            </button>
                            <span className="font-semibold text-lg text-slate-800 text-center w-48">{headerText}</span>
                             <button onClick={() => navigate('next')} className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-700" aria-label="Next">
                                <ChevronRightIcon className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="hidden sm:flex items-center space-x-1 bg-slate-100 p-1 rounded-lg">
                            {(['month', 'week', 'day'] as CalendarView[]).map(v => (
                                <Button key={v} onClick={() => setView(v)} isActive={view === v} className="capitalize text-xs px-2 py-1">{v}</Button>
                            ))}
                        </div>
                    </div>
                    {loading ? <Skeleton className="h-[600px] w-full" /> : renderCurrentView()}
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={selectedActivity ? 'Edit Activity' : 'Add Activity'}
                size="lg"
            >
                <ActivityForm
                    activity={selectedActivity}
                    preselectedDate={preselectedDate}
                    onSubmit={handleSaveActivity}
                    onCancel={handleCloseModal}
                    isSaving={isSaving}
                    onDelete={openDeleteConfirmation}
                />
            </Modal>
            
            <ConfirmationModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={handleDeleteActivity}
                title="Confirm Deletion"
                message={`Are you sure you want to delete the activity "${activityToDelete?.title}"?`}
                isConfirming={isDeleting}
            />
        </main>
    );
};

export default CalendarPage;