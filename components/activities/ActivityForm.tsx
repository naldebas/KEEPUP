import React, { useState, useEffect } from 'react';
import type { Activity, Tier } from '../../types';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Textarea';
import { Select } from '../ui/Select';
import { cn } from '../../lib/utils';
import { TrashIcon } from '../shared/icons';

interface ActivityFormProps {
  activity: Activity | null;
  preselectedDate?: string | null;
  onSubmit: (data: Omit<Activity, 'id'>) => void;
  onCancel: () => void;
  onDelete?: (activity: Activity) => void;
  isSaving?: boolean;
}

const colorOptions = {
    blue: 'bg-accent-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
    yellow: 'bg-amber-500',
    purple: 'bg-purple-500',
};

const ActivityForm: React.FC<ActivityFormProps> = ({ activity, preselectedDate, onSubmit, onCancel, onDelete, isSaving }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [description, setDescription] = useState('');
  const [targetAudience, setTargetAudience] = useState<Tier | 'All'>('All');
  const [color, setColor] = useState('blue');

  useEffect(() => {
    if (activity) {
      setTitle(activity.title);
      setDate(activity.date);
      setStartTime(activity.startTime || '');
      setEndTime(activity.endTime || '');
      setDescription(activity.description || '');
      setTargetAudience(activity.targetAudience);
      setColor(activity.color);
    } else {
      const today = new Date().toISOString().split('T')[0];
      setTitle('');
      setDate(preselectedDate || today);
      setStartTime('');
      setEndTime('');
      setDescription('');
      setTargetAudience('All');
      setColor('blue');
    }
  }, [activity, preselectedDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      date,
      startTime: startTime || undefined,
      endTime: endTime || undefined,
      description: description || undefined,
      targetAudience,
      color,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-slate-700">Activity Title</label>
        <Input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-1">
            <label htmlFor="date" className="block text-sm font-medium text-slate-700">Date</label>
            <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>
        <div className="sm:col-span-1">
            <label htmlFor="startTime" className="block text-sm font-medium text-slate-700">Start Time (Opt.)</label>
            <Input id="startTime" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
        </div>
        <div className="sm:col-span-1">
            <label htmlFor="endTime" className="block text-sm font-medium text-slate-700">End Time (Opt.)</label>
            <Input id="endTime" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-slate-700">Description (Opt.)</label>
        <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
            <label htmlFor="targetAudience" className="block text-sm font-medium text-slate-700">Target Audience</label>
            <Select id="targetAudience" value={targetAudience} onChange={(e) => setTargetAudience(e.target.value as Tier | 'All')}>
                <option value="All">All Tiers</option>
                <option value="Discovery">Discovery</option>
                <option value="Silver">Silver</option>
                <option value="Gold">Gold</option>
                <option value="Platinum">Platinum</option>
            </Select>
        </div>
        <div>
            <label className="block text-sm font-medium text-slate-700">Color Tag</label>
            <div className="flex space-x-2 mt-2">
                {Object.entries(colorOptions).map(([name, className]) => (
                    <button
                        key={name}
                        type="button"
                        onClick={() => setColor(name)}
                        className={cn(
                            `h-8 w-8 rounded-full border-2`,
                            className,
                            color === name ? 'border-primary-500 ring-2 ring-primary-500' : 'border-transparent'
                        )}
                        aria-label={`Select ${name} color`}
                    />
                ))}
            </div>
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t">
        <div>
        {activity && onDelete && (
             <Button type="button" onClick={() => onDelete(activity)} className="text-red-600 hover:bg-red-50" disabled={isSaving}>
                <TrashIcon className="h-4 w-4 mr-2" />
                Delete
             </Button>
        )}
        </div>
        <div className="flex justify-end space-x-2">
            <Button type="button" onClick={onCancel} disabled={isSaving}>Cancel</Button>
            <Button type="submit" variant="primary" disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Activity'}
            </Button>
        </div>
      </div>
    </form>
  );
};

export default ActivityForm;