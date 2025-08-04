import React, { useState, useEffect, useCallback } from 'react';
import type firebase from 'firebase/compat/app';
import type { Client, DayOfWeek } from '../types';
import { 
  listenToClients, 
  updateClient, 
  deleteClient 
} from '../services/firebaseService';
import ClientItem from './ClientItem';

const DAYS: DayOfWeek[] = ['월', '화', '수', '목', '금', '토', '일'];

interface ClientListPageProps {
  user: firebase.User;
  onBack: () => void;
}

const ClientListPage: React.FC<ClientListPageProps> = ({ user, onBack }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('월');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'visited' | 'unvisited'>('all');

  useEffect(() => {
    if (!user) return;
    
    const unsubscribe = listenToClients(
      user.uid,
      selectedDay,
      (clientsData) => {
        setClients(clientsData);
        setIsLoading(false);
      },
      (error) => {
        setError(error.message);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, selectedDay]);

  const handleToggleVisited = useCallback(async (id: string) => {
    if (!user) return;
    const client = clients.find(c => c.id === id);
    if (client) {
      try {
        setError(null);
        await updateClient(user.uid, selectedDay, id, { ...client, visited: !client.visited });
      } catch (err) {
        setError(err instanceof Error ? err.message : '상태 변경 중 오류 발생');
      }
    }
  }, [clients, selectedDay, user]);

  const handleDeleteClient = useCallback(async (id: string) => {
    if (!user) return;
    try {
      setError(null);
      await deleteClient(user.uid, selectedDay, id);
    } catch (err) {
      setError(err instanceof Error ? err.message : '삭제 중 오류 발생');
    }
  }, [selectedDay, user]);

  // 필터링된 거래처 목록
  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'visited' && client.visited) ||
                         (filterStatus === 'unvisited' && !client.visited);
    
    return matchesSearch && matchesStatus;
  });

  const totalClients = clients.length;
  const visitedClients = clients.filter(c => c.visited).length;
  const unvisitedClients = totalClients - visitedClients;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  거래처 목록
                </h1>
                <p className="text-gray-600">
                  모든 거래처를 한눈에 확인하고 관리하세요
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">총 {totalClients}개</div>
              <div className="text-xs text-gray-400">
                완료: {visitedClients} | 미완료: {unvisitedClients}
              </div>
            </div>
          </div>
        </header>

        {/* Day Selector */}
        <div className="mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2">
            <div className="flex justify-center space-x-1">
              {DAYS.map(day => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                    selectedDay === day 
                      ? 'bg-gray-900 text-white shadow-sm' 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  {day}요일
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="거래처명, 주소로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-gray-900 focus:border-gray-900 sm:text-sm"
                />
              </div>
            </div>

            {/* Filter */}
            <div className="flex space-x-2">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  filterStatus === 'all' 
                    ? 'bg-gray-900 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                전체
              </button>
              <button
                onClick={() => setFilterStatus('unvisited')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  filterStatus === 'unvisited' 
                    ? 'bg-red-600 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                미완료
              </button>
              <button
                onClick={() => setFilterStatus('visited')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  filterStatus === 'visited' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                완료
              </button>
            </div>
          </div>
        </div>

        {/* Client List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">
              {selectedDay}요일 거래처 목록
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {filteredClients.length}개 거래처 
              {searchTerm && ` (검색: "${searchTerm}")`}
              {filterStatus !== 'all' && ` (${filterStatus === 'visited' ? '완료' : '미완료'})`}
            </p>
          </div>
          
          <div className="p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
            
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="flex flex-col items-center space-y-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-gray-600"></div>
                  <p className="text-sm text-gray-500">로딩 중...</p>
                </div>
              </div>
            ) : filteredClients.length > 0 ? (
              <ul className="space-y-3">
                {filteredClients.map(client => (
                  <ClientItem
                    key={client.id}
                    client={client}
                    onToggleVisited={handleToggleVisited}
                    onDelete={handleDeleteClient}
                  />
                ))}
              </ul>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <p className="text-gray-500 text-sm">
                  {searchTerm ? `"${searchTerm}"에 대한 검색 결과가 없습니다` : 
                   filterStatus === 'all' ? `${selectedDay}요일에 추가된 거래처가 없습니다` :
                   filterStatus === 'visited' ? '완료된 거래처가 없습니다' :
                   '미완료 거래처가 없습니다'}
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  다른 검색어나 필터를 시도해보세요
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientListPage;