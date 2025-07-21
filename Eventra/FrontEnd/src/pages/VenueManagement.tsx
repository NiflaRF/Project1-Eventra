
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import { 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash, 
  Users, 
  MapPin, 
  Calendar,
  Eye,
  Upload
} from 'lucide-react';

interface Venue {
  id: string;
  name: string;
  capacity: number;
  location: string;
  type: string;
  availability: string;
  restrictions: string;
  images: string[];
}

const VenueManagement: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [minCapacity, setMinCapacity] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingVenue, setEditingVenue] = useState<Venue | null>(null);

  // Mock venue data
  const [venues, setVenues] = useState<Venue[]>([
    {
      id: '1',
      name: 'E Block Main Auditorium',
      capacity: 500,
      location: 'Academic Block A',
      type: 'Auditorium',
      availability: 'Available',
      restrictions: 'No food allowed',
      images: ['/E1.jpg']
    },
    {
      id: '2',
      name: 'Technology Auditorium',
      capacity: 100,
      location: 'Administration Building',
      type: 'Meeting Room',
      availability: 'Booked',
      restrictions: 'Professional events only',
      images: ['/Tecno.jpg']
    },
    {
      id: '3',
      name: 'Open Ground',
      capacity: 1000,
      location: 'Campus Center',
      type: 'Outdoor',
      availability: 'Available',
      restrictions: 'Weather dependent',
      images: ['/Ground.jpg']
    },
    {
      id: '4',
      name: 'Namunukula Open Air Theater',
      capacity: 1000,
      location: 'Campus Center',
      type: 'Outdoor',
      availability: 'Available',
      restrictions: 'Weather dependent',
      images: ['/Open Air Theater.jpg']
    }
  ]);

  const [newVenue, setNewVenue] = useState<Partial<Venue>>({
    name: '',
    capacity: 0,
    location: '',
    type: '',
    availability: 'Available',
    restrictions: '',
    images: []
  });

  const eventTypes = ['Conference', 'Workshop', 'Cultural', 'Sports', 'Academic', 'Social'];
  const venueTypes = ['Auditorium', 'Meeting Room', 'Outdoor', 'Workshop Space', 'Laboratory'];

  const filteredVenues = venues.filter(venue => {
    const matchesSearch = venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         venue.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || venue.type === filterType;
    const matchesCapacity = !minCapacity || venue.capacity >= parseInt(minCapacity);
    
    return matchesSearch && matchesType && matchesCapacity;
  });

  const handleAddVenue = () => {
    if (newVenue.name && newVenue.capacity && newVenue.location && newVenue.type) {
      const venue: Venue = {
        id: Date.now().toString(),
        name: newVenue.name,
        capacity: newVenue.capacity,
        location: newVenue.location,
        type: newVenue.type,
        availability: newVenue.availability || 'Available',
        restrictions: newVenue.restrictions || '',
        images: newVenue.images || []
      };
      
      setVenues([...venues, venue]);
      setNewVenue({
        name: '',
        capacity: 0,
        location: '',
        type: '',
        availability: 'Available',
        restrictions: '',
        images: []
      });
      setShowAddModal(false);
    }
  };

  const handleEditVenue = (venue: Venue) => {
    setEditingVenue(venue);
    setNewVenue(venue);
    setShowAddModal(true);
  };

  const handleUpdateVenue = () => {
    if (editingVenue && newVenue.name && newVenue.capacity && newVenue.location && newVenue.type) {
      const updatedVenue: Venue = {
        ...editingVenue,
        name: newVenue.name,
        capacity: newVenue.capacity,
        location: newVenue.location,
        type: newVenue.type,
        availability: newVenue.availability || 'Available',
        restrictions: newVenue.restrictions || '',
        images: newVenue.images || []
      };
      
      setVenues(venues.map(v => v.id === editingVenue.id ? updatedVenue : v));
      setEditingVenue(null);
      setNewVenue({
        name: '',
        capacity: 0,
        location: '',
        type: '',
        availability: 'Available',
        restrictions: '',
        images: []
      });
      setShowAddModal(false);
    }
  };

  const handleDeleteVenue = (venueId: string) => {
    if (window.confirm('Are you sure you want to delete this venue?')) {
      setVenues(venues.filter(v => v.id !== venueId));
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability.toLowerCase()) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'booked':
        return 'bg-red-100 text-red-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout showSidebar={user?.role !== 'student' && user?.role !== 'faculty'}>
      <div
        className="space-y-6 animate-fade-in text-white min-h-screen w-full"
        style={{
          backgroundImage: `url('/Terms.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="w-full max-w-6xl mx-auto px-4 md:px-8">
          {/* Header */}
          <div className="flex flex-col items-center text-center w-full">
            <h1 className="text-5xl font-extrabold text-white">Venue Management</h1>
            <p className="text-2xl text-white mt-4">Discover and manage event venues</p>
            {user?.role === 'admin' || user?.role === 'super-admin' ? (
              <button
                onClick={() => setShowAddModal(true)}
                className="mt-6 bg-white/10 backdrop-blur-sm text-white px-6 py-2 rounded-xl flex items-center hover:bg-white/20 transition-colors border border-white/20"
              >
                <Plus size={20} className="mr-2" />
                Add New Venue
              </button>
            ) : null}
          </div>

          {/* Filters */}
          <div className="bg-black bg-opacity-40 rounded-xl shadow-none p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search venues..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-black bg-opacity-60 text-white border border-gray-700 rounded-lg pl-10 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {/* Type Filter */}
              <div>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="bg-black bg-opacity-60 text-white border border-gray-700 rounded-lg py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Types</option>
                  {venueTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              {/* Capacity Filter */}
              <div>
                <input
                  type="number"
                  placeholder="Min. Capacity"
                  value={minCapacity}
                  onChange={(e) => setMinCapacity(e.target.value)}
                  className="bg-black bg-opacity-60 text-white border border-gray-700 rounded-lg py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                />
              </div>
              {/* Clear Filters */}
              <div>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilterType('all');
                    setMinCapacity('');
                  }}
                  className="bg-gray-800 bg-opacity-80 text-white w-full px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Venue Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredVenues.map(venue => (
              <div key={venue.id} className="bg-black bg-opacity-40 rounded-xl shadow-none overflow-hidden flex flex-col">
                <div className="relative">
                  <img src={venue.images[0]} alt={venue.name} className="w-full h-56 object-cover" />
                  <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold
                    ${venue.availability.toLowerCase() === 'available' ? 'bg-green-900 bg-opacity-60 text-green-200' :
                      venue.availability.toLowerCase() === 'booked' ? 'bg-red-900 bg-opacity-60 text-red-200' :
                      'bg-yellow-900 bg-opacity-60 text-yellow-200'}`}>{venue.availability}</span>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div className="mb-4">
                    <div className="font-bold text-xl text-white mb-2">{venue.name}</div>
                    <div className="flex items-center gap-2 text-sm text-gray-200 mb-1"><MapPin size={16} /> {venue.location}</div>
                    <div className="flex items-center gap-2 text-sm text-gray-200 mb-1">Capacity: {venue.capacity}</div>
                    <div className="flex items-center gap-2 text-sm text-gray-200 mb-1">Type: {venue.type}</div>
                    <div className="text-xs text-gray-300 mt-2"><span className="font-semibold">Restrictions:</span> {venue.restrictions}</div>
                  </div>
                  <div className="flex gap-2 mt-auto">
                    <button className="bg-gray-800/70 text-white px-4 py-2 rounded-lg font-medium flex-1 hover:bg-gray-700 transition-colors flex items-center justify-center">
                      <Eye size={16} className="mr-2" /> View Details
                    </button>
                    {user?.role === 'admin' || user?.role === 'super-admin' ? (
                      <>
                        <button className="bg-yellow-900 bg-opacity-80 text-white px-3 py-2 rounded-lg font-medium hover:bg-yellow-800 transition-colors flex items-center justify-center">
                          <Edit size={16} />
                        </button>
                        <button className="bg-red-900 bg-opacity-80 text-white px-3 py-2 rounded-lg font-medium hover:bg-red-800 transition-colors flex items-center justify-center">
                          <Trash size={16} />
                        </button>
                      </>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredVenues.length === 0 && (
            <div className="text-center py-12">
              <MapPin size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No venues found</h3>
              <p className="text-gray-600">Try adjusting your search criteria</p>
            </div>
          )}

          {/* Add/Edit Venue Modal */}
          {showAddModal && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <div className="bg-black/80 backdrop-blur-lg rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/20">
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-white mb-6">
                    {editingVenue ? 'Edit Venue' : 'Add New Venue'}
                  </h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          Venue Name
                        </label>
                        <input
                          type="text"
                          value={newVenue.name || ''}
                          onChange={(e) => setNewVenue({...newVenue, name: e.target.value})}
                          className="bg-white/10 border border-white/20 text-white placeholder-white/60 rounded-xl py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder="Enter venue name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          Capacity
                        </label>
                        <input
                          type="number"
                          value={newVenue.capacity || ''}
                          onChange={(e) => setNewVenue({...newVenue, capacity: parseInt(e.target.value)})}
                          className="bg-white/10 border border-white/20 text-white placeholder-white/60 rounded-xl py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder="Enter capacity"
                          min="1"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          Location
                        </label>
                        <input
                          type="text"
                          value={newVenue.location || ''}
                          onChange={(e) => setNewVenue({...newVenue, location: e.target.value})}
                          className="bg-white/10 border border-white/20 text-white placeholder-white/60 rounded-xl py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder="Enter location"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          Type
                        </label>
                        <select
                          value={newVenue.type || ''}
                          onChange={(e) => setNewVenue({...newVenue, type: e.target.value})}
                          className="bg-white/10 border border-white/20 text-white rounded-xl py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        >
                          <option value="" className="text-black">Select type</option>
                          {venueTypes.map(type => (
                            <option key={type} value={type} className="text-black">{type}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          Availability
                        </label>
                        <select
                          value={newVenue.availability || 'Available'}
                          onChange={(e) => setNewVenue({...newVenue, availability: e.target.value})}
                          className="bg-white/10 border border-white/20 text-white rounded-xl py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        >
                          <option value="Available" className="text-black">Available</option>
                          <option value="Booked" className="text-black">Booked</option>
                          <option value="Maintenance" className="text-black">Maintenance</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          Image Upload
                        </label>
                        <div className="border-2 border-dashed border-white/20 rounded-xl p-4 text-center hover:border-white/40 transition-colors cursor-pointer bg-white/5">
                          <Upload size={24} className="mx-auto text-white mb-2" />
                          <p className="text-sm text-white/80">Click to upload images</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Restrictions
                      </label>
                      <textarea
                        value={newVenue.restrictions || ''}
                        onChange={(e) => setNewVenue({...newVenue, restrictions: e.target.value})}
                        className="bg-white/10 border border-white/20 text-white placeholder-white/60 rounded-xl py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        rows={3}
                        placeholder="Enter any restrictions or special requirements"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-4 mt-6">
                    <button
                      onClick={() => {
                        setShowAddModal(false);
                        setEditingVenue(null);
                        setNewVenue({
                          name: '',
                          capacity: 0,
                          location: '',
                          type: '',
                          availability: 'Available',
                          restrictions: '',
                          images: []
                        });
                      }}
                      className="bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-xl hover:bg-white/20 transition-colors border border-white/20"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={editingVenue ? handleUpdateVenue : handleAddVenue}
                      className="bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-xl hover:bg-white/20 transition-colors border border-white/20"
                    >
                      {editingVenue ? 'Update Venue' : 'Add Venue'}
                    </button>
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

export default VenueManagement;
