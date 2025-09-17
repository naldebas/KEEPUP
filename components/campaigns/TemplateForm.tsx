// Fix: Implement the TemplateForm for creating and editing campaign templates.
import React, { useState, useEffect } from 'react';
import { api } from '../../sdk';
import type { CampaignTemplate, Activity } from '../../types';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';

interface TemplateFormProps {
  template: CampaignTemplate | null;
  onSubmit: (data: Omit<CampaignTemplate, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
  isSaving?: boolean;
}

const TemplateForm: React.FC<TemplateFormProps> = ({ template, onSubmit, onCancel, isSaving }) => {
  const [name, setName] = useState('');
  const [channel, setChannel] = useState<'Email' | 'WhatsApp'>('Email');
  const [subject, setSubject] = useState('');
  const [whatsappTemplateName, setWhatsappTemplateName] = useState('');
  const [content, setContent] = useState('');
  const [occasionName, setOccasionName] = useState('');
  const [occasionDate, setOccasionDate] = useState('');
  const [activityId, setActivityId] = useState<string | undefined>(undefined);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const fetchActivities = async () => {
        try {
            const data = await api.activity.list();
            setActivities(data);
        } catch (error) {
            console.error("Failed to fetch activities for form");
        }
    };
    fetchActivities();
  }, []);

  useEffect(() => {
    if (template) {
      setName(template.name);
      setChannel(template.channel);
      setSubject(template.subject || '');
      setWhatsappTemplateName(template.whatsappTemplateName || '');
      setContent(template.content);
      setOccasionName(template.occasionName || '');
      setOccasionDate(template.occasionDate || '');
      setActivityId(template.activityId);
    } else {
      setName('');
      setChannel('Email');
      setSubject('');
      setWhatsappTemplateName('');
      setContent('');
      setOccasionName('');
      setOccasionDate('');
      setActivityId(undefined);
    }
  }, [template]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      channel,
      subject: channel === 'Email' ? subject : undefined,
      whatsappTemplateName: channel === 'WhatsApp' ? whatsappTemplateName : undefined,
      content,
      occasionName: occasionName || undefined,
      occasionDate: occasionDate || undefined,
      activityId,
    });
  };

  const handleGenerateContent = async () => {
    if (!aiPrompt) return;
    setIsGenerating(true);
    try {
      const generatedContent = await api.comms.generateTemplateContent(aiPrompt);
      setContent(generatedContent);
    } catch (error) {
      console.error("AI content generation failed:", error);
      // You might want to show an error to the user here
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Template Name</label>
        <Input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <label htmlFor="channel" className="block text-sm font-medium text-gray-700">Channel</label>
        <Select
          id="channel"
          value={channel}
          onChange={(e) => setChannel(e.target.value as 'Email' | 'WhatsApp')}
        >
          <option>Email</option>
          <option>WhatsApp</option>
        </Select>
      </div>
      {channel === 'Email' && (
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
          <Input id="subject" type="text" value={subject} onChange={(e) => setSubject(e.target.value)} required />
        </div>
      )}
      {channel === 'WhatsApp' && (
        <div>
          <label htmlFor="whatsappTemplateName" className="block text-sm font-medium text-gray-700">WhatsApp Template Name</label>
          <Input id="whatsappTemplateName" type="text" value={whatsappTemplateName} onChange={(e) => setWhatsappTemplateName(e.target.value)} required placeholder="e.g. welcome_message_v2" />
          <p className="text-xs text-gray-500 mt-1">The approved template name from your WhatsApp Business provider.</p>
        </div>
      )}
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content</label>
        <Textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} required rows={6} />
      </div>

       <div className="space-y-4 p-4 border border-gray-200 rounded-md bg-white">
        <h3 className="text-sm font-medium text-gray-700">Campaign Association (Optional)</h3>
         <div>
            <label htmlFor="activityId" className="block text-sm font-medium text-gray-700">
              Link to Activity
            </label>
            <Select
              id="activityId"
              value={activityId || ''}
              onChange={(e) => setActivityId(e.target.value || undefined)}
              className="mt-1"
            >
              <option value="">None</option>
              {activities.map(activity => (
                <option key={activity.id} value={activity.id}>
                  {activity.title} ({activity.date})
                </option>
              ))}
            </Select>
            <p className="text-xs text-gray-500 mt-1">Associate this campaign with a calendar activity.</p>
        </div>
      </div>


      <div className="space-y-4 p-4 border border-gray-200 rounded-md bg-white">
        <h3 className="text-sm font-medium text-gray-700">Occasion Scheduling (Optional)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
                <label htmlFor="occasionName" className="block text-sm font-medium text-gray-700">Occasion Name</label>
                <Input id="occasionName" type="text" value={occasionName} onChange={(e) => setOccasionName(e.target.value)} placeholder="e.g., New Year's Day" />
            </div>
            <div>
                <label htmlFor="occasionDate" className="block text-sm font-medium text-gray-700">Occasion Date</label>
                <Input id="occasionDate" type="date" value={occasionDate} onChange={(e) => setOccasionDate(e.target.value)} />
            </div>
        </div>
        <p className="text-xs text-gray-500 mt-1">Link this template to a specific date for automated sending.</p>
      </div>

      <div className="space-y-2 p-4 border border-gray-200 rounded-md bg-gray-50">
          <label htmlFor="ai-prompt" className="block text-sm font-medium text-gray-700">Generate with AI</label>
          <p className="text-xs text-gray-500">Describe the message you want to send. For example: "A friendly email welcoming a new customer to our gold loyalty tier."</p>
          <Textarea id="ai-prompt" value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} placeholder="Enter your prompt here..." rows={3} />
          <Button type="button" onClick={handleGenerateContent} disabled={isGenerating || !aiPrompt}>
            {isGenerating ? 'Generating...' : 'Generate Content'}
          </Button>
      </div>
      <div className="flex justify-end space-x-2 pt-4 border-t">
        <Button type="button" onClick={onCancel} disabled={isSaving}>Cancel</Button>
        <Button type="submit" variant="primary" disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Template'}
        </Button>
      </div>
    </form>
  );
};

export default TemplateForm;