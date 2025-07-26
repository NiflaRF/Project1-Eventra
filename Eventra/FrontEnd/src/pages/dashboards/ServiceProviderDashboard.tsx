import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BadgeCheck, XCircle, MessageSquare, MapPin, Calendar, Bell, LogOut, Home, ClipboardList, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from '../../components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import Layout from '../../components/Layout';

// Dummy data for requests and notifications
const DUMMY_REQUESTS = [
  {
    id: 1,
    eventName: 'Annual Cultural Festival',
    requestedBy: { name: 'Ravindu Lakmal', email: 'ravindu@university.edu' },
    venue: 'Main Lecture Theater',
    dateTime: '2025-07-10  18:00',
    serviceType: 'Sound System',
    status: 'Pending',
    priority: 'High',
    description: 'Need full sound setup for 500+ audience.',
  },
  {
    id: 2,
    eventName: 'Tech Talk 2025',
    requestedBy: { name: 'Diluksha Perera', email: 'dilukshp@university.edu' },
    venue: 'TLH-1',
    dateTime: '2025-07-12  14:00',
    serviceType: 'Media Support', // changed from 'Media' to 'Media Support'
    status: 'Pending',
    priority: 'Medium',
    description: 'Projector and live streaming required.',
  },
  {
    id: 3,
    eventName: 'Sports Fiesta',
    requestedBy: { name: 'Nilmini Ranathunga', email: 'Nilmini@university.edu' },
    venue: 'Open Ground',
    dateTime: '2025-07-15  09:00',
    serviceType: 'Sound System',
    status: 'Approved',
    priority: 'Low',
    description: 'Basic sound system for announcements.',
  },
  // Extra dummy request for Sound System
  {
    id: 4,
    eventName: 'Music Night-Handhaewa',
    requestedBy: { name: 'Pasindhu Gunawardana', email: 'pasindu@university.edu' },
    venue: 'Open Air Theater',
    dateTime: '2025-08-05T19:00',
    serviceType: 'Sound System',
    status: 'Pending',
    priority: 'Medium',
    description: 'High-quality sound setup needed for live band performance.',
  },
  // Extra dummy requests for Media Support
  {
    id: 5,
    eventName: 'Researsch Conference',
    requestedBy: { name: 'Kavindya Nethmi', email: 'kavindya@university.edu' },
    venue: 'Main Lecture Theater',
    dateTime: '2025-08-20  10:00',
    serviceType: 'Media Support',
    status: 'Approved',
    priority: 'High',
    description: 'Full media coverage and recording for the event.',
  },
  {
    id: 6,
    eventName: 'CST Alumni Meetup',
    requestedBy: { name: 'Suresh Kumar', email: 'suresh@university.edu' },
    venue: 'E1- Main Auditorium',
    dateTime: '2025-09-10  16:00',
    serviceType: 'Media Support',
    status: 'Pending',
    priority: 'Low',
    description: 'Photography and video recording required for alumni gathering.',
  },
];

const DUMMY_NOTIFICATIONS = [
  { id: 1, message: '🔔 New request: "Tech Talk 2025" requires Sound System.', time: 'Just now' },
  { id: 2, message: '🔔 New request: "Annual Cultural Fest" requires Media.', time: '2 min ago' },
  { id: 3, message: '🔔 Request "Sports Fiesta" approved.', time: '10 min ago' },
];

// Reusable card for service types
const ServiceTypeCard: React.FC<{ type: string }> = ({ type }) => (
  <div className="bg-white rounded-xl shadow-md p-4 flex flex-col items-center">
    <span className="text-lg font-bold text-indigo-700">{type}</span>
    <span className="text-xs text-gray-500">Service Type</span>
  </div>
);

const ServiceProviderDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState(DUMMY_REQUESTS);
  const [notifications, setNotifications] = useState(DUMMY_NOTIFICATIONS);
  const [showNotif, setShowNotif] = useState(false);
  const [modal, setModal] = useState<{ open: boolean; requestId: number | null; action: 'approve' | 'reject' | null }>({ open: false, requestId: null, action: null });
  const [comment, setComment] = useState('');
  const [commentError, setCommentError] = useState('');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  // Show all requests regardless of user serviceType
  const filteredRequests = requests;

  // Stats
  const pendingCount = filteredRequests.filter(r => r.status === 'Pending').length;
  const approvedToday = filteredRequests.filter(r => r.status === 'Approved').length;

  // Simulate auto-notification
  useEffect(() => {
    const timer = setTimeout(() => {
      const newNotif = { id: Date.now(), message: `🔔 Auto-notification: New service request submitted for ${user?.serviceType}.`, time: 'Now' };
      setNotifications(prev => [newNotif, ...prev.slice(0, 2)]);
      console.log(newNotif.message);
    }, 8000);
    return () => clearTimeout(timer);
  }, [user?.serviceType]);

  const handleAction = (id: number, action: 'approve' | 'reject') => {
    // Only open modal for reject, for approve just approve directly
    if (action === 'approve') {
      setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'Approved' } : r));
      toast({ title: 'Request approved!', description: 'Approved without comment.' });
    } else {
      setModal({ open: true, requestId: id, action });
      setComment('');
      setCommentError('');
    }
  };

  const handleModalSubmit = () => {
    if (!comment.trim()) {
      setCommentError('Comment is required.');
      return;
    }
    setRequests(prev => prev.map(r => r.id === modal.requestId ? { ...r, status: modal.action === 'approve' ? 'Approved' : 'Rejected' } : r));
    toast({ title: `Request ${modal.action === 'approve' ? 'approved' : 'rejected'}!`, description: comment });
    setModal({ open: false, requestId: null, action: null });
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Notification bell and dropdown for Layout
  const notificationBell = (
    <div className="relative">
      <button className="p-2 hover:bg-gray-800 rounded-lg relative" onClick={() => setShowNotif(prev => !prev)}>
        <Bell className="w-6 h-6 text-gray-300" />
        {notifications.length > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">{notifications.length}</span>}
      </button>
      {showNotif && (
        <div id="notifications" className="absolute right-0 top-10 w-80 bg-black bg-opacity-90 shadow-lg rounded-lg p-4 z-20 animate-fade-in">
          <h4 className="font-semibold mb-2 text-white">Recent Notifications</h4>
          <ul className="space-y-2">
            {notifications.slice(0, 3).map(n => (
              <li key={n.id} className="text-sm text-white">{n.message} <span className="text-xs text-gray-400">({n.time})</span></li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  return (
    <Layout notificationBell={notificationBell}>
      <div className="relative min-h-screen w-full flex flex-col justify-center items-stretch" style={{ backgroundColor: '#bd7880' }}>
        <div className="relative z-10 space-y-8 animate-fade-in px-2 md:px-0 pt-0 pb-8">
          {/* Welcome Section at the very top */}
          <div className="w-full flex justify-center">
            <div className="bg-transparent text-white rounded-xl py-12 px-8 shadow-none w-full max-w-5xl">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-extrabold mb-2">
                    Welcome, {user?.name || 'Service Provider'}!
                  </h1>
                  <p className="text-white text-lg font-semibold">
                    Ready to manage your service requests and support events?
                  </p>
                </div>
                <div className="hidden md:block">
                  <div className="bg-black bg-opacity-60 rounded-lg p-4 flex items-center justify-center">
                    <Calendar size={48} className="text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Main Content Container for stats and requests */}
          <div className="w-full max-w-5xl mx-auto px-4 md:px-8 space-y-8 bg-black bg-opacity-30 rounded-2xl shadow-lg">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
              <div className="bg-black bg-opacity-40 rounded-xl shadow-none p-6 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">Pending Requests</p>
                    <p className="text-2xl font-bold text-white">{pendingCount}</p>
                  </div>
                  <div className="bg-yellow-900 bg-opacity-60 p-3 rounded-full">
                    <ClipboardList size={20} className="text-yellow-200" />
                  </div>
                </div>
              </div>
              <div className="bg-black bg-opacity-40 rounded-xl shadow-none p-6 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">Approved Today</p>
                    <p className="text-2xl font-bold text-white">{approvedToday}</p>
                  </div>
                  <div className="bg-green-900 bg-opacity-60 p-3 rounded-full">
                    <BadgeCheck size={20} className="text-green-200" />
                  </div>
                </div>
              </div>
              <div className="bg-black bg-opacity-40 rounded-xl shadow-none p-6 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">Total Requests</p>
                    <p className="text-2xl font-bold text-white">{filteredRequests.length}</p>
                  </div>
                  <div className="bg-blue-900 bg-opacity-60 p-3 rounded-full">
                    <ClipboardList size={20} className="text-blue-200" />
                  </div>
                </div>
              </div>
            </div>
            {/* Request List */}
            {/* Group requests by service type with a heading card for each */}
            {Array.from(new Set(requests.map(r => r.serviceType)))
              .filter(serviceType => serviceType !== 'Media')
              .map(serviceType => (
                <div key={serviceType} className="mb-8">
                  {/* Service Type Group Heading */}
                  <div className="bg-black bg-opacity-60 rounded-xl shadow-none p-4 flex flex-col items-center mb-4">
                    <span className="text-lg font-bold text-white">{serviceType}</span>
                    <span className="text-xs text-gray-200">Service Type</span>
                  </div>
                  {/* Request Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {requests.filter(r => r.serviceType === serviceType).map(req => (
                      <div key={req.id} className="bg-black bg-opacity-40 rounded-xl shadow-none p-6 hover:scale-105 transition-all flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-lg text-white">{req.eventName}</span>
                          <span className={`px-2 py-0.5 rounded text-xs font-semibold ${req.status === 'Pending' ? 'bg-yellow-900 bg-opacity-60 text-yellow-200' : req.status === 'Approved' ? 'bg-green-900 bg-opacity-60 text-green-200' : 'bg-red-900 bg-opacity-60 text-red-200'}`}>{req.status}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-200"><span className="font-medium">Requested by:</span> {req.requestedBy.name} ({req.requestedBy.email})</div>
                        <div className="flex items-center gap-2 text-sm text-gray-200"><MapPin size={16} /> {req.venue}</div>
                        <div className="flex items-center gap-2 text-sm text-gray-200"><Calendar size={16} /> {new Date(req.dateTime).toLocaleString()}</div>
                        <div className="flex items-center gap-2 text-sm"><span className="bg-purple-900 bg-opacity-60 text-purple-200 rounded px-2 py-0.5 text-xs">{req.serviceType}</span> <span className={`ml-2 px-2 py-0.5 rounded text-xs font-semibold ${req.priority === 'High' ? 'bg-red-900 bg-opacity-60 text-red-200' : req.priority === 'Medium' ? 'bg-yellow-900 bg-opacity-60 text-yellow-200' : 'bg-green-900 bg-opacity-60 text-green-200'}`}>{req.priority}</span></div>
                        <div className="text-sm text-white mt-2">{req.description}</div>
                        <div className="flex gap-2 mt-4">
                          {req.status === 'Pending' && <>
                            <Button variant="ghost" className="bg-green-900 bg-opacity-60 text-white hover:bg-green-800" onClick={() => handleAction(req.id, 'approve')}><BadgeCheck className="w-4 h-4 mr-1" /> Approve</Button>
                            <Button variant="ghost" className="bg-red-900 bg-opacity-60 text-white hover:bg-red-800" onClick={() => handleAction(req.id, 'reject')}><XCircle className="w-4 h-4 mr-1" /> Reject</Button>
                          </>}
                          {req.status !== 'Pending' && <span className="text-xs text-gray-400">No actions available</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
          {/* Approval Modal */}
        <Dialog open={modal.open} onOpenChange={open => setModal(m => ({ ...m, open }))}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{modal.action === 'approve' ? 'Approve' : 'Reject'} Request</DialogTitle>
            </DialogHeader>
            <textarea
              className="w-full border rounded p-2 mb-2"
              rows={3}
              placeholder="Add a comment (required)"
              value={comment}
              onChange={e => { setComment(e.target.value); setCommentError(''); }}
            />
            {commentError && <div className="text-red-600 text-xs mb-2">{commentError}</div>}
            <DialogFooter>
              <Button variant="outline" onClick={() => setModal({ open: false, requestId: null, action: null })}>Cancel</Button>
              <Button variant={modal.action === 'approve' ? 'default' : 'destructive'} onClick={handleModalSubmit}>{modal.action === 'approve' ? 'Approve' : 'Reject'}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  </Layout>
  );
};

export default ServiceProviderDashboard;
