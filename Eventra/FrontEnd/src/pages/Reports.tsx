
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { 
  Download, 
  FileText, 
  BarChart3, 
  Calendar,
  Filter,
  Star,
  MessageSquare,
  TrendingUp,
  Users,
  MapPin
} from 'lucide-react';

const Reports: React.FC = () => {
  const [dateRange, setDateRange] = useState({
    start: '2024-01-01',
    end: '2024-12-31'
  });
  const [eventTypeFilter, setEventTypeFilter] = useState('all');
  const [venueFilter, setVenueFilter] = useState('all');

  // Mock report data
  const reportData = [
    {
      id: '1',
      eventName: 'Tech Conference 2024',
      date: '2024-01-15',
      type: 'Conference',
      venue: 'Main Auditorium',
      participants: 200,
      status: 'Completed',
      rating: 4.8,
      feedback: 'Excellent organization and content'
    },
    {
      id: '2',
      eventName: 'Cultural Night',
      date: '2024-01-20',
      type: 'Cultural',
      venue: 'Open Ground',
      participants: 500,
      status: 'Completed',
      rating: 4.5,
      feedback: 'Great performances, needs better sound system'
    },
    {
      id: '3',
      eventName: 'Academic Symposium',
      date: '2024-01-25',
      type: 'Academic',
      venue: 'Conference Hall',
      participants: 100,
      status: 'Completed',
      rating: 4.2,
      feedback: 'Informative sessions, venue was perfect'
    }
  ];

  const feedbackData = [
    {
      id: '1',
      eventName: 'Tech Conference 2024',
      rating: 5,
      comment: 'Outstanding event! Great speakers and well organized.',
      attendee: 'John Doe',
      date: '2024-01-16'
    },
    {
      id: '2',
      eventName: 'Tech Conference 2024',
      rating: 4,
      comment: 'Good content but the venue was a bit crowded.',
      attendee: 'Jane Smith',
      date: '2024-01-16'
    },
    {
      id: '3',
      eventName: 'Cultural Night',
      rating: 5,
      comment: 'Amazing performances! Loved the cultural diversity.',
      attendee: 'Alex Johnson',
      date: '2024-01-21'
    }
  ];

  const eventTypes = ['Conference', 'Workshop', 'Cultural', 'Sports', 'Academic', 'Social'];
  const venues = ['Main Auditorium', 'Conference Hall', 'Open Ground', 'Innovation Hub'];

  const filteredReports = reportData.filter(report => {
    const matchesType = eventTypeFilter === 'all' || report.type === eventTypeFilter;
    const matchesVenue = venueFilter === 'all' || report.venue === venueFilter;
    const reportDate = new Date(report.date);
    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);
    const matchesDate = reportDate >= startDate && reportDate <= endDate;
    
    return matchesType && matchesVenue && matchesDate;
  });

  const handleExportPDF = () => {
    console.log('Exporting PDF report...');
    // In a real app, this would generate and download a PDF
    alert('PDF report would be generated and downloaded');
  };

  const handleExportExcel = () => {
    console.log('Exporting Excel report...');
    // In a real app, this would generate and download an Excel file
    alert('Excel report would be generated and downloaded');
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={16}
        className={index < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}
      />
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'ongoing':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Calculate statistics
  const totalEvents = filteredReports.length;
  const totalParticipants = filteredReports.reduce((sum, report) => sum + report.participants, 0);
  const averageRating = totalEvents > 0 
    ? (filteredReports.reduce((sum, report) => sum + report.rating, 0) / totalEvents).toFixed(1)
    : '0';
  const averageParticipants = totalEvents > 0 
    ? Math.round(totalParticipants / totalEvents) 
    : 0;

  return (
    <Layout showSidebar={true} backgroundImage="/Wrd.jpg">
      <div className="min-h-full bg-black/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8 animate-fade-in text-white">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white">Reports & Analytics</h1>
                <p className="text-white/90 mt-2">Generate and analyze event reports</p>
              </div>
              <div className="flex space-x-3 mt-4 md:mt-0">
                <button
                  onClick={handleExportPDF}
                  className="bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-xl flex items-center hover:bg-white/20 transition-colors border border-white/20"
                >
                  <FileText size={20} className="mr-2" />
                  Export PDF
                </button>
                <button
                  onClick={handleExportExcel}
                  className="bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-xl flex items-center hover:bg-white/20 transition-colors border border-white/20"
                >
                  <Download size={20} className="mr-2" />
                  Export Excel
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl shadow-xl border border-white/10 p-6">
              <h2 className="text-xl font-bold text-white mb-4">Report Filters</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">Start Date</label>
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                    className="bg-black/60 backdrop-blur-sm text-white border border-white/20 rounded-xl py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">End Date</label>
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                    className="bg-black/60 backdrop-blur-sm text-white border border-white/20 rounded-xl py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">Event Type</label>
                  <select
                    value={eventTypeFilter}
                    onChange={(e) => setEventTypeFilter(e.target.value)}
                    className="bg-black/60 backdrop-blur-sm text-white border border-white/20 rounded-xl py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="all">All Types</option>
                    {eventTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">Venue</label>
                  <select
                    value={venueFilter}
                    onChange={(e) => setVenueFilter(e.target.value)}
                    className="bg-black/60 backdrop-blur-sm text-white border border-white/20 rounded-xl py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="all">All Venues</option>
                    {venues.map(venue => (
                      <option key={venue} value={venue}>{venue}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-black/30 backdrop-blur-sm rounded-2xl shadow-xl border border-white/10 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white/90">Total Events</p>
                    <p className="text-2xl font-bold text-white">{totalEvents}</p>
                  </div>
                  <div className="bg-blue-900/60 backdrop-blur-sm p-3 rounded-full border border-blue-500/30">
                    <Calendar size={24} className="text-blue-200" />
                  </div>
                </div>
              </div>
              <div className="bg-black/30 backdrop-blur-sm rounded-2xl shadow-xl border border-white/10 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white/90">Total Participants</p>
                    <p className="text-2xl font-bold text-white">{totalParticipants}</p>
                  </div>
                  <div className="bg-green-900/60 backdrop-blur-sm p-3 rounded-full border border-green-500/30">
                    <Users size={24} className="text-green-200" />
                  </div>
                </div>
              </div>
              <div className="bg-black/30 backdrop-blur-sm rounded-2xl shadow-xl border border-white/10 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white/90">Average Rating</p>
                    <p className="text-2xl font-bold text-white">{averageRating}</p>
                  </div>
                  <div className="bg-yellow-900/60 backdrop-blur-sm p-3 rounded-full border border-yellow-500/30">
                    <Star size={24} className="text-yellow-200" />
                  </div>
                </div>
              </div>
              <div className="bg-black/30 backdrop-blur-sm rounded-2xl shadow-xl border border-white/10 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white/90">Avg Participants</p>
                    <p className="text-2xl font-bold text-white">{averageParticipants}</p>
                  </div>
                  <div className="bg-purple-900/60 backdrop-blur-sm p-3 rounded-full border border-purple-500/30">
                    <TrendingUp size={24} className="text-purple-200" />
                  </div>
                </div>
              </div>
            </div>

            {/* Reports Table & Feedback */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Reports Table */}
              <div className="bg-black/30 backdrop-blur-sm rounded-2xl shadow-xl border border-white/10 p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-bold text-white">Event Summary</span>
                  <button className="bg-white/10 backdrop-blur-sm text-white px-3 py-2 rounded-xl font-medium flex items-center hover:bg-white/20 transition-colors border border-white/20">
                    <Download size={16} className="mr-2" /> Export
                  </button>
                </div>
                <table className="w-full">
                  <tbody>
                    {filteredReports.map(report => (
                      <tr key={report.id} className="border-b border-white/10">
                        <td className="py-4 px-2 text-white/80 flex items-center gap-2"><MapPin size={16} /> {report.venue}</td>
                        <td className="py-4 px-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold border
                            ${report.type === 'Conference' ? 'bg-blue-900/60 text-blue-200 border-blue-500/30' :
                              report.type === 'Cultural' ? 'bg-purple-900/60 text-purple-200 border-purple-500/30' :
                              'bg-green-900/60 text-green-200 border-green-500/30'}`}>{report.type}</span>
                        </td>
                        <td className="py-4 px-2 flex items-center gap-1">{renderStars(report.rating)}<span className="text-white ml-1">{report.rating}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Feedback Cards */}
              <div className="bg-black/30 backdrop-blur-sm rounded-2xl shadow-xl border border-white/10 p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-bold text-white">Feedback</span>
                  <button className="bg-white/10 backdrop-blur-sm text-white px-3 py-2 rounded-xl font-medium flex items-center hover:bg-white/20 transition-colors border border-white/20">
                    <FileText size={16} className="mr-2" /> Export PDF
                  </button>
                </div>
                <div className="space-y-4">
                  {feedbackData.map(feedback => (
                    <div key={feedback.id} className="bg-black/60 backdrop-blur-sm rounded-xl p-4 flex flex-col gap-2 border border-white/10">
                      <div className="flex items-center justify-between">
                        <span className="text-white font-semibold">{feedback.attendee}</span>
                        <span className="flex items-center gap-1">{renderStars(feedback.rating)}</span>
                      </div>
                      <div className="text-white/80">{feedback.comment}</div>
                      <div className="text-xs text-white/60 flex justify-between">
                        <span>{feedback.eventName}</span>
                        <span>{feedback.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Generate Report Button */}
            <div className="text-center">
              <button
                onClick={() => {
                  console.log('Generating comprehensive report...');
                  alert('Comprehensive report would be generated with all filtered data');
                }}
                className="bg-white/10 backdrop-blur-sm text-white text-lg px-8 py-3 rounded-xl hover:bg-white/20 transition-colors border border-white/20 flex items-center mx-auto"
              >
                <BarChart3 size={24} className="mr-3" />
                Generate Comprehensive Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Reports;
