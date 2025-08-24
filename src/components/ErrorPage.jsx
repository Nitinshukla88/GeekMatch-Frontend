import { useLocation, useNavigate } from "react-router-dom";

const ErrorPage = () => {
  const location = useLocation();
  const error = location.state;
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-100 text-gray-800 p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md text-center">
        <h1 className="text-3xl font-bold text-red-600">Something went wrong</h1>
        <p className="text-gray-600 mt-4">We encountered an unexpected error.</p>
        {error && (
          <div className="bg-gray-200 text-gray-700 p-3 mt-4 rounded text-sm overflow-auto max-w-full">
          <p><strong>Error:</strong> {error.message}</p>
          {error.note && <p><strong>Note:</strong> {error.note}</p>}
        </div>
          
        )}
        <div className="mt-6 flex space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
            >
            Go Back
          </button>
          <button
            onClick={() => navigate("/app")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
