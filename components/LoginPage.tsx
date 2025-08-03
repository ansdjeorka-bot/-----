
import React, { useState } from 'react';
import { signInWithEmailAndPassword } from '../services/firebaseService';

interface LoginPageProps {
    onNavigateToSignUp: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onNavigateToSignUp }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            await signInWithEmailAndPassword(email, password);
            // 성공 시 App.tsx의 onAuthStateChanged가 리디렉션을 처리합니다.
        } catch (err) {
            setError('이메일 또는 비밀번호가 올바르지 않습니다.');
            console.error("Login error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignUp = (e: React.MouseEvent) => {
        e.preventDefault();
        onNavigateToSignUp();
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-8 py-6 border-b border-gray-100">
                        <div className="text-center">
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                거래처 방문 관리
                            </h1>
                            <p className="text-gray-600 text-sm">
                                계정에 로그인하여 시작하세요
                            </p>
                        </div>
                    </div>
                    
                    <form className="px-8 py-6 space-y-4" onSubmit={handleLogin}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                이메일
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors placeholder-gray-400"
                                placeholder="이메일을 입력하세요"
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                비밀번호
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors placeholder-gray-400"
                                placeholder="비밀번호를 입력하세요"
                            />
                        </div>
                        
                        {error && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gray-900 text-white font-medium py-3 px-4 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {isLoading ? '로그인 중...' : '로그인'}
                        </button>
                    </form>
                    
                    <div className="px-8 py-4 border-t border-gray-100">
                        <p className="text-center text-sm text-gray-600">
                            계정이 없으신가요?{' '}
                            <button
                                onClick={handleSignUp}
                                className="font-medium text-gray-900 hover:text-gray-700 transition-colors"
                            >
                                회원가입
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
