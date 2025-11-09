import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Input, Alert, Card, Checkbox } from '../components';
import API_URL from '../config/api';

const Signup = ({ onSignup }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
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

    if (!formData.username) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!agreedToTerms) {
      newErrors.terms = 'You must agree to the terms and conditions';
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
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Signup failed');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user-info', JSON.stringify(data.user));
      onSignup();
      navigate('/dashboard');
    } catch (err) {
      setErrors({ submit: err.message || 'An error occurred during signup' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <div style={{ width: '400px' }} className="animate-fadeIn">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-light tracking-tight text-neutral-900">Create Account</h1>
          <p className="text-neutral-600 mt-2 text-sm">Join us today</p>
        </div>

        <Card className="p-8">
          {/* Form Content */}
          <div>
            {errors.submit && (
              <Alert
                type="error"
                message={errors.submit}
                dismissible={true}
                onClose={() => setErrors({ ...errors, submit: '' })}
              />
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Username"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Choose a unique username"
                error={errors.username}
                required
                autoComplete="username"
              />

              <Input
                label="Email Address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                error={errors.email}
                required
                autoComplete="email"
              />

              <Input
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                error={errors.password}
                required
                autoComplete="new-password"
              />

              <Checkbox
                checked={agreedToTerms}
                onChange={(e) => {
                  setAgreedToTerms(e.target.checked);
                  if (errors.terms) {
                    setErrors({ ...errors, terms: '' });
                  }
                }}
                label="I agree to the Terms of Service and Privacy Policy"
                error={errors.terms}
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={isLoading}
                disabled={isLoading}
                fullWidth
                className="mt-6"
              >
                Create Account
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-neutral-600">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-neutral-900 hover:text-neutral-700 transition-colors duration-200">
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Signup;