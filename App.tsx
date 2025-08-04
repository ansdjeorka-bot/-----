import React, { useState, useEffect } from 'react';
import type firebase from 'firebase/compat/app';
import { 
  onAuthStateChangedListener,
  signOutUser
} from './services/firebaseService';
import HomePage from './components/HomePage';
import ClientListPage from './components/ClientListPage';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';
import { UserIcon } from './components/icons';

type AppPage = 'home' | 'clientList';

const App: React.FC = () => {
  const [user, setUser] = useState<firebase.User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [authPage, setAuthPage] = useState<'login' | 'signup'>('login');
  const [currentPage, setCurrentPage] = useState<AppPage>('home');

  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener((user) => {
      setUser(user);
      setIsAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOutUser();
      setAuthPage('login');
      setCurrentPage('home'); // 로그아웃 시 홈으로 리셋
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  const renderNavigation = () => (
    <nav className="bg-white border-b border-gray-200 mb-6">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Navigation Links */}
          <div className="flex space-x-8">
            <button
              onClick={() => setCurrentPage('home')}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                currentPage === 'home'
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              홈
            </button>
            <button
              onClick={() => setCurrentPage('clientList')}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                currentPage === 'clientList'
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              거래처 목록
            </button>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900" title={user?.email ?? ''}>
                {user?.email}
              </p>
              <button
                onClick={handleLogout}
                className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
              >
                로그아웃
              </button>
            </div>
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <UserIcon className="w-4 h-4 text-gray-600" />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );

  const renderCurrentPage = () => {
    if (!user) return null;

    switch (currentPage) {
      case 'home':
        return (
          <HomePage
            user={user}
            onNavigateToClientList={() => setCurrentPage('clientList')}
          />
        );
      case 'clientList':
        return (
          <ClientListPage
            user={user}
            onBack={() => setCurrentPage('home')}
          />
        );
      default:
        return null;
    }
  };

  if (isAuthLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-300 border-t-gray-600"></div>
          <p className="text-gray-600 text-sm">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    if (authPage === 'signup') {
      return <SignUpPage onNavigateToLogin={() => setAuthPage('login')} />;
    }
    return <LoginPage onNavigateToSignUp={() => setAuthPage('signup')} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                거래처 방문 관리
              </h1>
              <p className="text-gray-600">
                요일별 방문 계획을 효율적으로 관리하세요
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900" title={user.email ?? ''}>
                  {user.email}
                </p>
                <button
                  onClick={handleLogout}
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  로그아웃
                </button>
              </div>
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <UserIcon className="w-5 h-5 text-gray-600" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      {renderNavigation()}

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 pb-8">
        {renderCurrentPage()}
      </main>
    </div>
  );
};

export default App;