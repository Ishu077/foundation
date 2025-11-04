import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Input, Alert, Card, Checkbox } from '../components';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user-info', JSON.stringify(data.user));
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }
      onLogin();
      navigate('/dashboard');
    } catch (err) {
      setErrors({ submit: err.message || 'An error occurred during login' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-soft flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-primary rounded-full opacity-10 blur-3xl animate-pulse-soft" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-accent rounded-full opacity-10 blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }} />
      </div>

      <div style={{ width: '420px' }} className="animate-fadeIn relative z-10">
        {/* Logo/Brand section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl shadow-glow mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gradient mb-3">Welcome Back</h1>
          <p className="text-neutral-600 text-lg">Sign in to continue your journey</p>
        </div>

        <Card variant="elevated" className="p-10 hover-lift">
          {errors.submit && (
            <div className="mb-6">
              <Alert
                type="error"
                message={errors.submit}
                dismissible={true}
                onClose={() => setErrors({ ...errors, submit: '' })}
              />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              error={errors.email}
              required
              autoComplete="email"
              icon={() => (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              )}
            />

            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              error={errors.password}
              required
              autoComplete="current-password"
            />

            <div className="flex items-center justify-between">
              <Checkbox
                label="Remember me"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <Link 
                to="/forgot-password" 
                className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors duration-200"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={isLoading}
              disabled={isLoading}
              fullWidth
              className="mt-8"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-neutral-500">New to our platform?</span>
              </div>
            </div>
            
            <div className="mt-6">
              <Link 
                to="/signup" 
                className="inline-flex items-center justify-center w-full px-6 py-3 border border-neutral-300 rounded-xl text-sm font-medium text-neutral-700 bg-white hover:bg-neutral-50 hover:border-neutral-400 transition-all duration-200 hover:shadow-soft"
              >
                Create an account
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;