
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { 
  Calendar, 
  Users, 
  FileText, 
  Upload, 
  CheckCircle, 
  Clock, 
  X,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

interface EventPlan {
  id: string;
  title: string;
  type: string;
  organizer: string;
  date: string;
  time: string;
  participants: number;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  currentStage: number;
  facilities: string[];
  documents: string[];
  remarks: string;
}

const EventPlanning: React.FC = () => {
  const [showPlanForm, setShowPlanForm] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  const [eventPlan, setEventPlan] = useState({
    title: '',
    type: '',
    organizer: '',
    date: '',
    time: '',
    participants: '',
    facilities: [] as string[],
    documents: [] as string[],
    remarks: ''
  });

  const [eventPlans, setEventPlans] = useState<EventPlan[]>([
    {
      id: '1',
      title: 'Annual Research Conference',
      type: 'Conference',
      organizer: 'Computer Science and Informatics Department',
      date: '2025-03-15',
      time: '9:00 AM',
      participants: 600,
      status: 'approved',
      currentStage: 5,
      facilities: ['Projector', 'Microphone', 'Recording Equipment'],
      documents: ['event_proposal.pdf', 'budget_plan.pdf'],
      remarks: 'All approvals completed'
    },
    {
      id: '2',
      title: 'Social Night 2025',
      type: 'Social Events',
      organizer: 'Student Union',
      date: '2025-06-20',
      time: '6:00 PM',
      participants: 1000,
      status: 'submitted',
      currentStage: 2,
      facilities: ['Stage Setup', 'Lighting System', 'Speaker System'],
      documents: ['cultural_plan.pdf'],
      remarks: 'Waiting for Admin approval'
    }
  ]);

  const eventTypes = ['Conference', 'Cultural Events', 'Sports Events', 'Social Events','Club Events'];
  const availableFacilities = [
    'Projector', 'Microphone', 'Speaker System', 'Stage Setup', 
    'Lighting System', 'Recording Equipment', 'Wi-Fi', 'Air Conditioning',
    'Whiteboard'
  ];

  const approvalStages = [
    { name: 'VC', status: 'pending' },
    { name: 'Admin', status: 'pending' },
    { name: 'SU', status: 'pending' },
    { name: 'Wardens', status: 'pending' },
    { name: 'Facility Manager', status: 'pending' }
  ];

  const handleFacilityToggle = (facility: string) => {
    const updatedFacilities = eventPlan.facilities.includes(facility)
      ? eventPlan.facilities.filter(f => f !== facility)
      : [...eventPlan.facilities, facility];
    
    setEventPlan({ ...eventPlan, facilities: updatedFacilities });
  };

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmitPlan = () => {
    const newPlan: EventPlan = {
      id: Date.now().toString(),
      title: eventPlan.title,
      type: eventPlan.type,
      organizer: eventPlan.organizer,
      date: eventPlan.date,
      time: eventPlan.time,
      participants: parseInt(eventPlan.participants),
      status: 'submitted',
      currentStage: 1,
      facilities: eventPlan.facilities,
      documents: eventPlan.documents,
      remarks: eventPlan.remarks
    };

    setEventPlans([...eventPlans, newPlan]);
    setShowPlanForm(false);
    setCurrentStep(1);
    setEventPlan({
      title: '',
      type: '',
      organizer: '',
      date: '',
      time: '',
      participants: '',
      facilities: [],
      documents: [],
      remarks: ''
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Basic Event Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Event Title
                </label>
                <input
                  type="text"
                  value={eventPlan.title}
                  onChange={(e) => setEventPlan({...eventPlan, title: e.target.value})}
                  className="bg-gray-800/70 text-white border border-gray-600 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-white"
                  placeholder="Enter event title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Event Type
                </label>
                <select
                  value={eventPlan.type}
                  onChange={(e) => setEventPlan({...eventPlan, type: e.target.value})}
                  className="bg-gray-800/70 text-white border border-gray-600 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-white"
                  required
                >
                  <option value="">Select event type</option>
                  {eventTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Organizer Name/Group
              </label>
              <input
                type="text"
                value={eventPlan.organizer}
                onChange={(e) => setEventPlan({...eventPlan, organizer: e.target.value})}
                className="bg-gray-800/70 text-white border border-gray-600 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-white"
                placeholder="Enter organizer name or group"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Proposed Date
                </label>
                <input
                  type="date"
                  value={eventPlan.date}
                  onChange={(e) => setEventPlan({...eventPlan, date: e.target.value})}
                  className="bg-gray-800/70 text-white border border-gray-600 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Time
                </label>
                <div className="relative">
                  <input
                    type="time"
                    value={eventPlan.time}
                    onChange={(e) => setEventPlan({...eventPlan, time: e.target.value})}
                    className="bg-gray-800/70 text-white border border-gray-600 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-white pr-10"
                    required
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <Clock size={18} className="text-white" />
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Expected Participants
                </label>
                <input
                  type="number"
                  value={eventPlan.participants}
                  onChange={(e) => setEventPlan({...eventPlan, participants: e.target.value})}
                  className="bg-gray-800/70 text-white border border-gray-600 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-white"
                  placeholder="Number of participants"
                  min="1"
                  required
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Facility Requests</h3>
            
            <div>
              <label className="block text-sm font-medium text-white mb-4">
                Select Required Facilities
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {availableFacilities.map((facility) => (
                  <label key={facility} className="flex items-center space-x-2 cursor-pointer p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-white">
                    <input
                      type="checkbox"
                      checked={eventPlan.facilities.includes(facility)}
                      onChange={() => handleFacilityToggle(facility)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm">{facility}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-gray-800/70 border border-gray-700 rounded-lg p-4">
              <h4 className="font-medium text-white mb-2">Facility Availability Status</h4>
              <div className="space-y-2">
                {eventPlan.facilities.map((facility) => (
                  <div key={facility} className="flex items-center justify-between text-sm text-white">
                    <span>{facility}</span>
                    <span className="px-2 py-1 bg-green-700 text-white rounded text-xs">
                      ✅ Available
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Upload Request Letters</h3>
            
            <div className="border-2 border-dashed border-gray-500 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
              <Upload size={48} className="mx-auto text-white mb-4" />
              <h4 className="text-lg font-medium text-white mb-2">Upload Documents</h4>
              <p className="text-white mb-4">
                Upload event proposal, budget plan, and other required documents
              </p>
              <p className="text-sm text-white mb-4">
                Supported formats: PDF, DOC, DOCX (Max size: 10MB each)
              </p>
              <button className="bg-gray-800/90 hover:bg-gray-900 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                Choose Files
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Additional Remarks (Optional)
              </label>
              <textarea
                value={eventPlan.remarks}
                onChange={(e) => setEventPlan({...eventPlan, remarks: e.target.value})}
                className="bg-gray-800/70 text-white border border-gray-600 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-white"
                rows={4}
                placeholder="Add any additional information or special requirements"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Layout>
      <div style={{ backgroundColor: '#bd7880', minHeight: '100vh', width: '100%' }}>
        <div className="w-full max-w-6xl mx-auto px-4 md:px-8">
          {/* Header */}
          <div className="flex flex-col items-center text-center w-full mb-6">
            <h1 className="text-3xl font-bold text-white">Event Planning</h1>
            <p className="text-white mt-2">Submit and track your event planning proposals</p>
            <button
              onClick={() => setShowPlanForm(true)}
              className="mt-4 bg-black bg-opacity-70 hover:bg-black/90 text-white flex items-center px-6 py-2 rounded-lg font-medium transition-colors"
            >
              <FileText size={20} className="mr-2" />
              New Event Plan
            </button>
          </div>

          {/* Event Plans List */}
          <div className="space-y-6">
            {eventPlans.map((plan) => (
              <div key={plan.id} className="bg-black bg-opacity-70 rounded-xl p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{plan.title}</h3>
                    <div className="flex flex-wrap gap-4 text-sm text-white">
                      <div className="flex items-center">
                        <Calendar size={16} className="mr-1 text-white" />
                        {plan.date} at {plan.time}
                      </div>
                      <div className="flex items-center">
                        <Users size={16} className="mr-1 text-white" />
                        {plan.participants} participants
                      </div>
                      <div>
                        <span className="font-medium">Type:</span> {plan.type}
                      </div>
                      <div>
                        <span className="font-medium">Organizer:</span> {plan.organizer}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 lg:mt-0">
                    <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(plan.status)}`}>
                      {plan.status.charAt(0).toUpperCase() + plan.status.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Approval Tracker */}
                <div className="mb-4">
                  <h4 className="font-medium text-white mb-3">Approval Progress</h4>
                  <div className="flex items-center justify-between">
                    {approvalStages.map((stage, index) => (
                      <div key={stage.name} className="flex items-center">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                          index < plan.currentStage 
                            ? 'bg-green-500 text-white' 
                            : index === plan.currentStage 
                              ? 'bg-blue-500 text-white' 
                              : 'bg-gray-200 text-gray-600'
                        }`}>
                          {index < plan.currentStage ? <CheckCircle size={16} className="text-white" /> : index + 1}
                        </div>
                        <span className="ml-2 text-sm text-white hidden sm:block">{stage.name}</span>
                        {index < approvalStages.length - 1 && (
                          <div className={`w-8 h-1 mx-2 ${
                            index < plan.currentStage ? 'bg-green-500' : 'bg-gray-200'
                          }`} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Facilities and Documents */}
                <div className="flex flex-col md:flex-row md:justify-between gap-6 mb-4">
                  <div>
                    <h4 className="font-medium text-white mb-2">Required Facilities</h4>
                    <div className="flex flex-wrap gap-2">
                      {plan.facilities.map((facility) => (
                        <span key={facility} className="bg-gray-700 text-white px-3 py-1 rounded-full text-xs font-medium">
                          {facility}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-white mb-2">Uploaded Documents</h4>
                    <ul className="space-y-1">
                      {plan.documents.map((doc) => (
                        <li key={doc} className="flex items-center text-white">
                          <FileText size={14} className="mr-2 text-white" />
                          {doc}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Remarks */}
                <div className="bg-gray-800/70 border border-gray-700 rounded-lg p-4 mt-2">
                  <h4 className="font-medium text-white mb-1">Remarks</h4>
                  <p className="text-white text-sm">{plan.remarks}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Event Plan Form Modal */}
          {showPlanForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-black bg-opacity-80 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto text-white">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">Submit Event Plan</h2>
                    <button
                      onClick={() => setShowPlanForm(false)}
                      className="text-white hover:text-gray-300"
                    >
                      <X size={24} className="text-white" />
                    </button>
                  </div>

                  {/* Progress Indicator */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      {[1, 2, 3].map((step) => (
                        <div key={step} className="flex items-center">
                          <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                            step <= currentStep ? 'bg-blue-500 text-white' : 'bg-gray-700 text-white'
                          }`}>
                            {step}
                          </div>
                          <span className="ml-2 text-sm text-white hidden sm:block">
                            {step === 1 ? 'Basic Details' : step === 2 ? 'Facilities' : 'Documents'}
                          </span>
                          {step < 3 && (
                            <div className={`w-12 h-1 mx-4 ${
                              step < currentStep ? 'bg-blue-500' : 'bg-gray-700'
                            }`} />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Step Content */}
                  <div className="mb-8">
                    {renderStepContent()}
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex justify-between">
                    <button
                      onClick={handlePrevStep}
                      disabled={currentStep === 1}
                      className={`flex items-center bg-gray-800/70 hover:bg-gray-900 text-white px-6 py-2 rounded-lg font-medium transition-colors ${
                        currentStep === 1 ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <ArrowLeft size={20} className="mr-2 text-white" />
                      Previous
                    </button>

                    <div className="flex space-x-4">
                      <button
                        onClick={() => setShowPlanForm(false)}
                        className="bg-gray-800/70 hover:bg-gray-900 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                      >
                        Cancel
                      </button>
                      
                      {currentStep < 3 ? (
                        <button
                          onClick={handleNextStep}
                          className="flex items-center bg-gray-800/90 hover:bg-gray-900 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                        >
                          Next
                          <ArrowRight size={20} className="ml-2 text-white" />
                        </button>
                      ) : (
                        <button
                          onClick={handleSubmitPlan}
                          className="bg-gray-800/90 hover:bg-gray-900 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                        >
                          Submit Plan
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default EventPlanning;
