import React, { useState, useCallback, useEffect } from 'react';
import type firebase from 'firebase/compat/app';
import type { Client, DayOfWeek } from '../types';
import { 
  listenToClients, 
  addClient, 
  updateClient, 
  deleteClient 
} from '../services/firebaseService';
import AddClientForm from './AddClientForm';
import ClientItem from './ClientItem';

const DAYS: DayOfWeek[] = ['월', '화', '수', '목', '금', '토', '일'];

interface HomePageProps {
  user: firebase.User;
  onNavigateToClientList: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ user, onNavigateToClientList }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isClientsLoading, setClientsIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const getCurrentDay = (): DayOfWeek => {
    const dayIndex = new Date().getDay(); // 0: Sunday, 1: Monday, ...
    const adjustedIndex = (dayIndex === 0) ? 6 : dayIndex - 1; // 0: Monday, ..., 6: Sunday
    return DAYS[adjustedIndex];
  };

  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(getCurrentDay());

  useEffect(() => {
    if (!user) return;
    
    setClientsIsLoading(true);
    const unsubscribe = listenToClients(
      user.uid,
      selectedDay,
      (clientsData) => {
        setClients(clientsData);
        setClientsIsLoading(false);
      },
      (error) => {
        setError(error.message);
        setClientsIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, selectedDay]);

  const handleAddClient = useCallback(async (clientData: { name: string; address: string }) => {
    if (!user) return;
    try {
      setError(null);
      await addClient(user.uid, selectedDay, clientData);
    } catch (err) {
      setError(err instanceof Error ? err.message : '거래처 추가 중 오류 발생');
    }
  }, [selectedDay, user]);

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

  const unvisitedClients = clients.filter(c => !c.visited);

  return (
    <div className="space-y-6">
      {/* Day Selector */}
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

      {/* Add Client Form */}
      <AddClientForm onAddClient={handleAddClient} />
      
      {/* Today's Clients */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {selectedDay}요일 방문 목록
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {unvisitedClients.length} / {clients.length} 남음
            </p>
          </div>
          <button
            onClick={onNavigateToClientList}
            className="text-sm text-gray-900 hover:text-gray-700 font-medium flex items-center space-x-1 hover:bg-gray-50 px-3 py-1.5 rounded-lg transition-colors"
          >
            <span>전체 보기</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
          
          {isClientsLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="flex flex-col items-center space-y-3">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-gray-600"></div>
                <p className="text-sm text-gray-500">로딩 중...</p>
              </div>
            </div>
          ) : clients.length > 0 ? (
            <>
              <ul className="space-y-3">
                {clients.slice(0, 5).map(client => (
                  <ClientItem
                    key={client.id}
                    client={client}
                    onToggleVisited={handleToggleVisited}
                    onDelete={handleDeleteClient}
                  />
                ))}
              </ul>
              {clients.length > 5 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={onNavigateToClientList}
                    className="w-full text-center text-sm text-gray-600 hover:text-gray-900 py-2 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    {clients.length - 5}개 더 보기
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <p className="text-gray-500 text-sm">
                {selectedDay}요일에 추가된 거래처가 없습니다
              </p>
              <p className="text-gray-400 text-xs mt-1">
                위의 폼에서 새로운 거래처를 추가해보세요
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;