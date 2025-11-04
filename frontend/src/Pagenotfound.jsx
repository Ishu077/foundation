import { useNavigate } from "react-router-dom";
import { Button, Card } from "./components";

function Pagenotfound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <div style={{ width: '400px' }} className="animate-fadeIn">
        <Card className="p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-neutral-100 mb-6">
            <svg className="h-10 w-10 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-4xl font-light tracking-tight text-neutral-900 mb-2">404</h1>
          <h2 className="text-2xl font-light tracking-tight text-neutral-900 mb-4">Page Not Found</h2>
          <p className="text-neutral-600 mb-8 text-sm">Sorry, the page you're looking for doesn't exist or has been moved.</p>
          <Button variant="primary" size="lg" onClick={() => navigate("/login")} fullWidth>
            Back to Login
          </Button>
        </Card>
      </div>
    </div>
  );
}

export default Pagenotfound;
