import React, { useState } from "react";
import { toast } from "@/components/ui/sonner";
import DashboardNavbar from "@/components/DashboardNavbar";
import DashboardWelcomeBanner from "@/components/DashboardWelcomeBanner";
import DashboardSidebar from "@/components/DashboardSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import Layout from "@/components/Layout";
import { Calendar, Clock, Users, FileText } from "lucide-react";

// Dummy data for pending requests
const dummyRequests = [
  {
    id: 204,
    eventTitle: "Cultural Fest 2025",
    requestedBy: "Student Council",
    dateTime: "2025-07-10 14:00",
    venue: "Auditorium",
    document: "/public/placeholder.pdf",
    status: "Pending",
  },
  {
    id: 205,
    eventTitle: "Tech Symposium",
    requestedBy: "Faculty of Engineering",
    dateTime: "2025-07-15 10:00",
    venue: "Seminar Hall",
    document: "/public/placeholder.pdf",
    status: "Pending",
  },
];

const dummySignedLetters = [
  {
    id: 201,
    eventTitle: "Alumni Meet",
    date: "2025-06-20",
    document: "/public/placeholder.pdf",
    status: "Sent to Admin",
  },
  {
    id: 202,
    eventTitle: "Research Expo",
    date: "2025-06-25",
    document: "/public/placeholder.pdf",
    status: "Pending",
  },
];

const ViceChancellorDashboard: React.FC = () => {
  const [requests, setRequests] = useState(dummyRequests);
  const [signedLetters, setSignedLetters] = useState(dummySignedLetters);
  const [activeTab, setActiveTab] = useState("pending");
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [signature, setSignature] = useState<string | null>(null);
  const [comment, setComment] = useState("");
  const [rejectionComment, setRejectionComment] = useState("");

  // Simulate notification
  React.useEffect(() => {
    if (requests.length > 0) {
      console.log(
        `🔔 VC: You have a new approval request for ${requests[0].eventTitle}.`
      );
    }
  }, [requests]);

  // Statistics
  const stats = {
    pending: requests.length,
    approved: signedLetters.filter((l) => l.status === "Sent to Admin").length,
    rejected: 0, // For UI phase, not tracked
  };

  // Handle Approve
  const handleApprove = () => {
    if (!signature) {
      toast.error("Please upload your e-signature.");
      return;
    }
    // Simulate moving to signed letters
    setSignedLetters([
      ...signedLetters,
      {
        id: selectedRequest.id,
        eventTitle: selectedRequest.eventTitle,
        date: new Date().toISOString().slice(0, 10),
        document: selectedRequest.document,
        status: "Sent to Admin",
      },
    ]);
    setRequests(requests.filter((r) => r.id !== selectedRequest.id));
    setShowApproveModal(false);
    setSignature(null);
    setComment("");
    toast.success("Request approved and sent to Admin.");
    console.log(
      `✅ Admin: VC approved event request ID#${selectedRequest.id}. Signed letter attached.`
    );
  };

  // Handle Reject
  const handleReject = () => {
    if (!rejectionComment.trim()) {
      toast.error("Please provide a rejection comment.");
      return;
    }
    setRequests(requests.filter((r) => r.id !== selectedRequest.id));
    setShowRejectModal(false);
    setRejectionComment("");
    toast("Request rejected and admin notified.");
    console.log(
      `❌ Admin: VC rejected event request ID#${selectedRequest.id}. Reason: ${rejectionComment}`
    );
  };

  // Handle signature upload
  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setSignature(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const { user } = useAuth();
  return (
    <div>
      <Layout>
        {/* Dashboard Background with Overlay */}
        <div className="relative min-h-screen flex flex-col justify-center items-stretch bg-gray-50">
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: "url('/LogIn.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: 0,
          }} />
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.5)',
            zIndex: 1,
          }} />
          <div className="relative z-10 space-y-8 animate-fade-in px-2 md:px-0 pt-0 pb-8">
            {/* Welcome Section at the very top */}
            <div className="w-full flex justify-center">
              <div className="bg-black bg-opacity-40 text-white rounded-xl py-12 px-8 shadow-none w-full max-w-5xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-extrabold mb-2">
                      Welcome, {user?.name}!
                    </h1>
                    <p className="text-white text-lg font-semibold">
                      Ready to review and approve events?
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

            {/* Main Content Container for stats and tables */}
            <div className="w-full max-w-5xl mx-auto px-4 md:px-8 space-y-8 bg-black bg-opacity-30 rounded-2xl shadow-lg">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
                <div className="bg-black bg-opacity-40 rounded-xl shadow-none p-6 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-white">Pending Requests</p>
                      <p className="text-2xl font-bold text-white">{stats.pending}</p>
                    </div>
                    <div className="bg-yellow-900 bg-opacity-60 p-3 rounded-full">
                      <Clock size={20} className="text-yellow-200" />
                    </div>
                  </div>
                </div>
                <div className="bg-black bg-opacity-40 rounded-xl shadow-none p-6 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-white">Approved Events</p>
                      <p className="text-2xl font-bold text-white">{stats.approved}</p>
                    </div>
                    <div className="bg-green-900 bg-opacity-60 p-3 rounded-full">
                      <Users size={20} className="text-green-200" />
                    </div>
                  </div>
                </div>
                <div className="bg-black bg-opacity-40 rounded-xl shadow-none p-6 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-white">Rejected Events</p>
                      <p className="text-2xl font-bold text-white">{stats.rejected}</p>
                    </div>
                    <div className="bg-red-900 bg-opacity-60 p-3 rounded-full">
                      <FileText size={20} className="text-red-200" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="grid grid-cols-1 gap-8">
                {/* Pending Requests + Signed Letters (stacked) */}
                <div className="space-y-8">
                  {/* Pending Requests */}
                  <div className="bg-black bg-opacity-40 rounded-xl shadow-none p-6 w-full max-w-none">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold text-white">Pending Approval Requests</h2>
                    </div>
                    <div>
                      <table className="w-full bg-transparent rounded-xl border border-gray-700 shadow-none">
                        <thead>
                          <tr className="bg-gray-800/70 text-white">
                            <th className="py-2 px-4">Request ID</th>
                            <th className="py-2 px-4">Event Title</th>
                            <th className="py-2 px-4">Requested By</th>
                            <th className="py-2 px-4">Date & Time</th>
                            <th className="py-2 px-4">Venue</th>
                            <th className="py-2 px-4">Document</th>
                            <th className="py-2 px-4">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {requests.map((req) => (
                            <tr key={req.id} className="border-b border-gray-700 last:border-none">
                              <td className="py-2 px-4 text-white">{req.id}</td>
                              <td className="py-2 px-4 text-white">{req.eventTitle}</td>
                              <td className="py-2 px-4 text-white">{req.requestedBy}</td>
                              <td className="py-2 px-4 text-white">{req.dateTime}</td>
                              <td className="py-2 px-4 text-white">{req.venue}</td>
                              <td className="py-2 px-4">
                                <a
                                  href={req.document}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-white underline"
                                >
                                  View PDF
                                </a>
                              </td>
                              <td className="py-2 px-4 flex gap-2">
                                <button
                                  className="bg-green-900 bg-opacity-60 hover:bg-green-800 text-white px-3 py-1 rounded transition-colors"
                                  onClick={() => {
                                    setSelectedRequest(req);
                                    setShowApproveModal(true);
                                  }}
                                >
                                  Approve
                                </button>
                                <button
                                  className="bg-red-900 bg-opacity-60 hover:bg-red-800 text-white px-3 py-1 rounded transition-colors"
                                  onClick={() => {
                                    setSelectedRequest(req);
                                    setShowRejectModal(true);
                                  }}
                                >
                                  Reject
                                </button>
                              </td>
                            </tr>
                          ))}
                          {requests.length === 0 && (
                            <tr>
                              <td colSpan={7} className="text-center py-6 text-gray-400">
                                No pending requests.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  {/* Signed Letters */}
                  <div className="bg-black bg-opacity-40 rounded-xl shadow-none p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold text-white">Signed Letters</h2>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-transparent rounded-xl border border-gray-700 shadow-none">
                        <thead>
                          <tr className="bg-gray-800/70 text-white">
                            <th className="py-2 px-4">Date</th>
                            <th className="py-2 px-4">Event</th>
                            <th className="py-2 px-4">Document</th>
                            <th className="py-2 px-4">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {signedLetters.map((letter) => (
                            <tr key={letter.id}>
                              <td className="py-2 px-4 text-white">{letter.date}</td>
                              <td className="py-2 px-4 text-white">{letter.eventTitle}</td>
                              <td className="py-2 px-4">
                                <a
                                  href={letter.document}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-white underline"
                                >
                                  View PDF
                                </a>
                              </td>
                              <td className="py-2 px-4">
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                    letter.status === "Sent to Admin"
                                      ? "bg-green-900 bg-opacity-60 text-green-200"
                                      : "bg-yellow-900 bg-opacity-60 text-yellow-200"
                                  }`}
                                >
                                  {letter.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                          {signedLetters.length === 0 && (
                            <tr>
                              <td colSpan={4} className="text-center py-6 text-gray-400">
                                No signed letters yet.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
      {/* Approve Modal */}
      {showApproveModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-black bg-opacity-90 rounded-xl shadow-xl p-8 w-full max-w-lg relative">
            <button
              className="absolute top-2 right-2 text-white hover:text-gray-300 text-2xl font-bold"
              onClick={() => setShowApproveModal(false)}
            >
              ×
            </button>
            <h3 className="text-lg font-bold mb-4 text-white">Approve Request</h3>
            <div className="mb-4">
              <span className="font-semibold text-white">Letter Preview:</span>
              <div className="border border-gray-600 rounded-md mt-2 p-2 bg-gray-800/60 flex items-center justify-center h-40">
                {/* Simulate PDF preview */}
                <img
                  src="/placeholder.svg"
                  alt="PDF Preview"
                  className="h-32 object-contain"
                />
              </div>
              <a
                href={selectedRequest.document}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white underline text-sm mt-2 inline-block"
              >
                View Full Document
              </a>
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-1 text-white">Comment (optional):</label>
              <textarea
                className="w-full border border-gray-600 rounded-md p-2 bg-gray-800/60 text-white placeholder-gray-300"
                rows={2}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
            <label className="block font-semibold mb-1 text-white">Add E-signature:</label>
            <div className="border-2 border-dashed border-gray-600 rounded-md p-4 flex flex-col items-center bg-gray-800/60 hover:bg-gray-700 transition cursor-pointer">
              <input
                type="file"
                accept="image/png, image/svg+xml"
                className="hidden"
                id="signature-upload"
                onChange={handleSignatureUpload}
              />
              <label htmlFor="signature-upload" className="cursor-pointer text-white">
                {signature ? (
                  <img
                    src={signature}
                    alt="E-signature Preview"
                    className="h-12 object-contain mx-auto"
                  />
                ) : (
                  <>
                    <span className="text-gray-300">Drag & drop or click to upload signature (PNG/SVG)</span>
                  </>
                )}
              </label>
            </div>
            <button
              className="bg-gray-700/80 hover:bg-gray-600 text-white px-6 py-2 rounded font-semibold w-full mt-6 transition-colors"
              onClick={handleApprove}
            >
              Approve & Sign
            </button>
          </div>
        </div>
      )}
      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-black bg-opacity-90 rounded-xl shadow-xl p-8 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-white hover:text-gray-300 text-2xl font-bold"
              onClick={() => setShowRejectModal(false)}
            >
              ×
            </button>
            <h3 className="text-lg font-bold mb-4 text-white">Reject Request</h3>
            <div className="mb-4">
              <label className="block font-semibold mb-1 text-white">Rejection Comment <span className="text-red-500">*</span></label>
              <textarea
                className="w-full border border-gray-600 rounded-md p-2 bg-gray-800/60 text-white placeholder-gray-300"
                rows={3}
                value={rejectionComment}
                onChange={(e) => setRejectionComment(e.target.value)}
                placeholder="Please provide a reason for rejection"
              />
            </div>
            <button
              className="bg-gray-700/80 hover:bg-gray-600 text-white px-6 py-2 rounded font-semibold w-full transition-colors"
              onClick={handleReject}
            >
              Reject
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViceChancellorDashboard;
