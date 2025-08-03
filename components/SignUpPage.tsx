
import React, { useState } from 'react';
import { signUpWithEmailAndPassword } from '../services/firebaseService';

interface SignUpPageProps {
    onNavigateToLogin: () => void;
}

const SignUpPage: React.FC<SignUpPageProps> = ({ onNavigateToLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError('비밀번호가 일치하지 않습니다.');
            return;
        }

        setIsLoading(true);
        try {
            await signUpWithEmailAndPassword(email, password);
            alert('회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.');
            onNavigateToLogin();
        } catch (err: any) {
            switch (err.code) {
                case 'auth/email-already-in-use':
                    setError('이미 사용 중인 이메일입니다.');
                    break;
                case 'auth/weak-password':
                    setError('비밀번호는 6자 이상이어야 합니다.');
                    break;
                case 'auth/invalid-email':
                    setError('유효하지 않은 이메일 주소입니다.');
                    break;
                default:
                    setError('회원가입 중 오류가 발생했습니다. 다시 시도해 주세요.');
                    break;
            }
            console.error("Sign up error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-8 py-6 border-b border-gray-100">
                        <div className="text-center">
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                회원가입
                            </h1>
                            <p className="text-gray-600 text-sm">
                                새로운 계정을 만들어 시작하세요
                            </p>
                        </div>
                    </div>
                    
                    <form className="px-8 py-6 space-y-4" onSubmit={handleSignUp}>
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
                                autoComplete="new-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors placeholder-gray-400"
                                placeholder="비밀번호를 입력하세요 (6자 이상)"
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-2">
                                비밀번호 확인
                            </label>
                            <input
                                id="confirm-password"
                                name="confirm-password"
                                type="password"
                                autoComplete="new-password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors placeholder-gray-400"
                                placeholder="비밀번호를 다시 입력하세요"
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
                            {isLoading ? '가입하는 중...' : '회원가입'}
                        </button>
                    </form>
                    
                    <div className="px-8 py-4 border-t border-gray-100">
                        <p className="text-center text-sm text-gray-600">
                            이미 계정이 있으신가요?{' '}
                            <button
                                onClick={onNavigateToLogin}
                                className="font-medium text-gray-900 hover:text-gray-700 transition-colors"
                            >
                                로그인
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;
