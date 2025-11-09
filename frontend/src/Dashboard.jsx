import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Textarea, Alert, Card, Header } from './components';
import API_URL from './config/api';

const Dashboard = ({ onLogout }) => {
  const [title, setTitle] = useState('');
  const [article, setArticle] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [currentSummaryId, setCurrentSummaryId] = useState(null);
  const [regenerating, setRegenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleCopySummary = async (text) => {
    if (!text) return;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        // fallback
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setErrors({ submit: 'Unable to copy to clipboard' });
    }
  };

  const handleGenerateSummary = async (e) => {
    e.preventDefault();
    if (!title.trim() || !article.trim()) {
      setErrors({ submit: 'Please provide both title and article text' });
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const response = await fetch(`${API_URL}/summaries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          summaryText: article
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate summary');
      }

      setSummary(data.summary?.summaryText || 'No summary available');
      setCurrentSummaryId(data.summary?._id);
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerateSummary = async () => {
    if (!currentSummaryId || !article.trim()) {
      setErrors({ submit: 'Please provide article text to regenerate' });
      return;
    }

    setRegenerating(true);
    setErrors({});

    try {
      const response = await fetch(`http://localhost:8080/summaries/${currentSummaryId}/regenerate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          summaryText: article
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to regenerate summary');
      }

      setSummary(data.summary?.summaryText || 'No summary available');
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setRegenerating(false);
    }
  };

  const handleViewHistory = () => {
    navigate('/history');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user-info');
    if (onLogout) {
      onLogout();
    }
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-soft relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-primary rounded-full opacity-5 blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-accent rounded-full opacity-5 blur-3xl animate-pulse-soft" style={{ animationDelay: '2s' }} />
      </div>

      <Header
        title="Article Summarizer"
        subtitle="Transform your articles into concise summaries with AI"
        gradient={true}
        icon={() => (
          <svg className="h-7 w-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2h-2z" />
          </svg>
        )}
        actions={[
          <Button 
            key="history" 
            variant="outline" 
            size="md" 
            onClick={handleViewHistory}
            icon={() => (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          >
            History
          </Button>,
          <Button 
            key="logout" 
            variant="ghost" 
            size="md" 
            onClick={handleLogout}
            icon={() => (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            )}
          >
            Logout
          </Button>,
        ]}
      />

      <main className="mx-auto px-6 py-12 relative z-10" style={{ maxWidth: '1400px' }}>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
          {/* Input Section */}
          <div className="space-y-8 animate-slideUp">
            <Card variant="elevated" gradient={true} className="p-10 hover-lift">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-gradient-primary rounded-xl shadow-glow">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-neutral-900">Create New Summary</h2>
                  <p className="text-neutral-600 mt-1">Paste your article content to generate an AI-powered summary</p>
                </div>
              </div>

              {errors.submit && (
                <div className="mb-6">
                  <Alert type="error" message={errors.submit} dismissible={true} onClose={() => setErrors({ ...errors, submit: '' })} />
                </div>
              )}

              <form onSubmit={handleGenerateSummary} className="space-y-8">
                <Input 
                  label="Article Title" 
                  type="text" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  placeholder="Enter a descriptive title" 
                  required 
                  icon={() => (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  )}
                />
                
                <Textarea 
                  label="Article Content" 
                  value={article} 
                  onChange={(e) => setArticle(e.target.value)} 
                  placeholder="Paste your full article content here..." 
                  rows={14} 
                  maxLength={10000} 
                  showCharCount={true} 
                  required 
                />
                
                <div className="flex justify-end pt-6">
                  <Button 
                    type="submit" 
                    variant="primary" 
                    size="lg" 
                    loading={loading} 
                    disabled={loading || !title.trim() || !article.trim()}
                    icon={() => (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    )}
                  >
                    Generate Summary
                  </Button>
                </div>
              </form>
            </Card>
          </div>

          {/* Output Section */}
          <div className="animate-slideUp" style={{ animationDelay: '200ms' }}>
            <Card variant="elevated" className="p-10 sticky top-32 hover-lift">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-gradient-accent rounded-xl shadow-glow-accent">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-neutral-900">Generated Summary</h2>
                  <p className="text-neutral-600 mt-1">Your AI-powered summary will appear here</p>
                </div>
              </div>

              <div className="min-h-[500px] flex flex-col">
                {loading ? (
                  <div className="flex items-center justify-center flex-1">
                    <div className="text-center">
                      <div className="relative">
                        <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto"></div>
                        <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-accent-400 rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                      </div>
                      <p className="mt-6 text-lg font-semibold text-neutral-700">Generating summary...</p>
                      <p className="mt-2 text-sm text-neutral-500">Our AI is analyzing your content</p>
                      <div className="mt-4 flex justify-center">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : summary ? (
                  <div className="animate-fadeIn">
                    <div className="flex-1 mb-8 p-6 bg-gradient-to-br from-neutral-50 to-white rounded-2xl border border-neutral-200/60 shadow-soft">
                      <p className="text-neutral-700 leading-relaxed whitespace-pre-wrap text-base">{summary}</p>
                    </div>
                    <div className="flex gap-4 pt-6 border-t border-neutral-200">
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="md" 
                        onClick={handleRegenerateSummary} 
                        loading={regenerating} 
                        disabled={regenerating} 
                        fullWidth
                        icon={() => (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                        )}
                      >
                        Regenerate
                      </Button>
                      {/* <Button 
                        type="button" 
                        variant="accent" 
                        size="md" 
                        fullWidth
                        icon={() => (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      >
                        Save Summary
                      </Button> */}
                      <Button
                          type="button"
                          variant={copied ? "success" : "accent"}
                          size="md"
                          onClick={() => handleCopySummary(summary)}
                        >
                          {copied ? (
                            <>
                              <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              Copied to Clipboard!
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8h2a2 2 0 012 2v8a2 2 0 01-2 2H10a2 2 0 01-2-2v-2" />
                              </svg>
                              Copy Summary
                            </>
                          )}
                        </Button>
                    </div>

                  </div>
                ) : (
                  <div className="flex items-center justify-center flex-1">
                    <div className="text-center">
                      <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-2xl bg-gradient-to-br from-neutral-100 to-neutral-200 mb-6 shadow-soft">
                        <svg className="h-10 w-10 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-neutral-900 mb-2">Ready to summarize</h3>
                      <p className="text-neutral-600 text-base">Enter an article and click "Generate Summary" to get started</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;