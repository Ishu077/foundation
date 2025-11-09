import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Alert, Header } from '../components';
import API_URL from '../config/api';

const History = ({ onLogout }) => {
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSummary, setSelectedSummary] = useState(null);
  const [copySuccess, setCopySuccess] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const fetchSummaries = async () => {
    try {
      const response = await fetch(`${API_URL}/summaries`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch summaries');
      }

      const data = await response.json();
      setSummaries(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummaries();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this summary?')) return;

    try {
      const response = await fetch(`${API_URL}/summaries/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete summary');
      }

      // Refresh the list
      fetchSummaries();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user-info');
    if (onLogout) {
      onLogout();
    }
    navigate('/login');
  };

  const handleCopy = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(id);
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (err) {
      setError('Failed to copy to clipboard');
    }
  };

  const handleViewSummary = (summary) => {
    setSelectedSummary(summary);
  };

  const handleCloseModal = () => {
    setSelectedSummary(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-light flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-lg font-medium text-gray-700">Loading your summaries...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header
        title="Summary History"
        subtitle="View and manage all your generated summaries"
        icon={() => (
          <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )}
        actions={[
          <Button key="dashboard" variant="secondary" size="md" onClick={handleBackToDashboard}>
            Back to Dashboard
          </Button>,
          <Button key="logout" variant="secondary" size="md" onClick={handleLogout}>
            Logout
          </Button>,
        ]}
      />

      <main className="mx-auto px-6 py-12" style={{ maxWidth: '1200px' }}>
        {error && <Alert type="error" message={error} dismissible={true} onClose={() => setError('')} />}

        {summaries.length === 0 ? (
          <div className="text-center py-16 animate-fadeIn flex justify-center">
            <Card className="p-8" style={{ width: '400px' }}>
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-neutral-100 mb-4">
                <svg className="h-8 w-8 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-normal text-neutral-900">No summaries yet</h3>
              <p className="mt-2 text-neutral-600 text-sm">Get started by creating your first summary from the dashboard.</p>
              <div className="mt-6">
                <Button variant="primary" size="lg" onClick={handleBackToDashboard} fullWidth>
                  Create Summary
                </Button>
              </div>
            </Card>
          </div>
        ) : (
          <div className="animate-fadeIn">
            <div className="mb-8">
              <h2 className="text-2xl font-light tracking-tight text-neutral-900">Your Summaries</h2>
              <p className="mt-2 text-neutral-600 text-sm">You have {summaries.length} {summaries.length === 1 ? 'summary' : 'summaries'}</p>
            </div>

            <div className="space-y-4">
              {summaries.map((summary, idx) => (
                <Card key={summary._id} className="p-6 hover:border-neutral-400 transition-all duration-200 animate-fadeIn" style={{ animationDelay: `${idx * 50}ms` }}>
                  <div className="flex flex-col h-full">
                    <div
                      className="flex-1 mb-4 cursor-pointer"
                      onClick={() => handleViewSummary(summary)}
                    >
                      <h3 className="text-lg font-normal text-neutral-900 mb-2 line-clamp-2 hover:text-primary-600 transition-colors">
                        {summary.title}
                      </h3>
                      <p className="text-neutral-600 text-sm leading-relaxed line-clamp-3">
                        {summary.summaryText || 'No summary content available'}
                      </p>
                      <p className="text-xs text-primary-500 mt-2 hover:text-primary-700">
                        Click to view full summary →
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
                      <div className="flex items-center text-xs text-neutral-500">
                        <svg className="h-4 w-4 mr-1.5 text-neutral-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        {new Date(summary.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant={copySuccess === summary._id ? "success" : "secondary"}
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopy(summary.summaryText, summary._id);
                          }}
                        >
                          {copySuccess === summary._id ? (
                            <>
                              <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              Copied
                            </>
                          ) : (
                            <>
                              <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                                <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                              </svg>
                              Copy
                            </>
                          )}
                        </Button>
                        <Button variant="danger" size="sm" onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(summary._id);
                        }}>
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Modal for viewing full summary */}
      {selectedSummary && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-primary p-6 text-white">
              <div className="flex items-start justify-between">
                <div className="flex-1 pr-4">
                  <h2 className="text-2xl font-bold mb-2">{selectedSummary.title}</h2>
                  <div className="flex items-center text-sm text-white/80">
                    <svg className="h-4 w-4 mr-1.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    {new Date(selectedSummary.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                >
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
              <div className="prose prose-neutral max-w-none">
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">Summary</h3>
                <div className="bg-neutral-50 rounded-xl p-6 border border-neutral-200">
                  {selectedSummary.summaryText ? (
                    <div className="space-y-3">
                      {selectedSummary.summaryText.split('\n').map((line, index) => {
                        const trimmedLine = line.trim();
                        if (!trimmedLine) return null;

                        // Remove bullet point markers if present
                        const cleanedLine = trimmedLine.replace(/^[•\-\*]\s*/, '');

                        return (
                          <div key={index} className="flex items-start gap-3">
                            <span className="text-primary-500 font-bold text-lg mt-1">•</span>
                            <p className="text-neutral-700 leading-relaxed flex-1">{cleanedLine}</p>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-neutral-500 italic">No summary content available</p>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-neutral-50 px-6 py-4 border-t border-neutral-200 flex justify-between items-center">
              <div className="text-sm text-neutral-600">
                {selectedSummary.summaryLength && (
                  <span>{selectedSummary.summaryLength} words</span>
                )}
              </div>
              <div className="flex gap-3">
                <Button
                  variant={copySuccess === selectedSummary._id ? "success" : "secondary"}
                  size="md"
                  onClick={() => handleCopy(selectedSummary.summaryText, selectedSummary._id)}
                >
                  {copySuccess === selectedSummary._id ? (
                    <>
                      <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                        <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                      </svg>
                      Copy Summary
                    </>
                  )}
                </Button>
                <Button variant="primary" size="md" onClick={handleCloseModal}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;