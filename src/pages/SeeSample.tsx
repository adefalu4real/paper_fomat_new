import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, Calendar, Tag, Trash2 } from "lucide-react";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  role?: string;
  [key: string]: unknown;
}

interface FormattedPaper {
  id: number;
  title: string;
  format: string;
  content: string;
  timestamp: string;
}

const SeeSample = () => {
  const [formattedPapers, setFormattedPapers] = useState<FormattedPaper[]>([]);
  const [selectedPaper, setSelectedPaper] = useState<FormattedPaper | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedPapers = JSON.parse(localStorage.getItem('formattedPapers') || '[]');
    setFormattedPapers(savedPapers);
    if (savedPapers.length > 0) {
      setSelectedPaper(savedPapers[0]);
    }

    // Check if user is admin
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        setIsAdmin(decoded.role === 'admin');
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, []);

  const deletePaper = (paperId: number) => {
    if (window.confirm('Are you sure you want to delete this sample paper?')) {
      const updatedPapers = formattedPapers.filter(paper => paper.id !== paperId);
      setFormattedPapers(updatedPapers);
      localStorage.setItem('formattedPapers', JSON.stringify(updatedPapers));

      // If the deleted paper was selected, select another one or clear selection
      if (selectedPaper?.id === paperId) {
        setSelectedPaper(updatedPapers.length > 0 ? updatedPapers[0] : null);
      }
    }
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate("/")}
                className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Home
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Sample Papers</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {formattedPapers.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Sample Papers Yet</h3>
            <p className="text-gray-500 mb-6">Start formatting papers to see samples here.</p>
            <button
              onClick={() => navigate("/format")}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Your First Paper
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Papers List */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border p-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Formatted Papers ({formattedPapers.length})
                </h2>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {formattedPapers.map((paper) => (
                    <div
                      key={paper.id}
                      className={`p-3 rounded-lg transition-colors ${
                        selectedPaper?.id === paper.id
                          ? 'bg-blue-50 border border-blue-200'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div
                        onClick={() => setSelectedPaper(paper)}
                        className="cursor-pointer flex-1"
                      >
                        <h3 className="font-medium text-gray-900 text-sm truncate">
                          {paper.title || 'Untitled Paper'}
                        </h3>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-blue-600 font-medium">
                            {paper.format}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatDate(paper.timestamp).split(',')[0]}
                          </span>
                        </div>
                      </div>
                      {isAdmin && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deletePaper(paper.id);
                          }}
                          className="ml-2 p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                          title="Delete sample"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Paper Preview */}
            <div className="lg:col-span-3">
              {selectedPaper ? (
                <div className="bg-white rounded-lg shadow-sm border">
                  <div className="p-6 border-b">
                    <div className="flex items-start justify-between">
                      <div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                          {selectedPaper.title || 'Untitled Paper'}
                        </h1>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Tag className="w-4 h-4 mr-1" />
                            Format: {selectedPaper.format}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {formatDate(selectedPaper.timestamp)}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => navigate("/format")}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        Create Similar
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    <div
                      className="prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: selectedPaper.content }}
                    />
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Paper</h3>
                  <p className="text-gray-500">Choose a paper from the list to view its formatted content.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SeeSample;