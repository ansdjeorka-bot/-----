
import React, { useState } from 'react';

interface AddClientFormProps {
  onAddClient: (name: string, address: string) => void;
}

const AddClientForm: React.FC<AddClientFormProps> = ({ onAddClient }) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && address.trim()) {
      onAddClient(name.trim(), address.trim());
      setName('');
      setAddress('');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">신규 거래처 추가</h2>
        <p className="text-sm text-gray-500 mt-1">새로운 거래처 정보를 입력해주세요</p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div>
          <label htmlFor="client-name" className="block text-sm font-medium text-gray-700 mb-2">
            거래처 이름
          </label>
          <input
            id="client-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="거래처명을 입력하세요"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors placeholder-gray-400"
            required
          />
        </div>
        
        <div>
          <label htmlFor="client-address" className="block text-sm font-medium text-gray-700 mb-2">
            주소
          </label>
          <input
            id="client-address"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="주소를 입력하세요"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors placeholder-gray-400"
            required
          />
        </div>
        
        <button 
          type="submit" 
          className="w-full bg-gray-900 text-white font-medium py-3 px-4 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
        >
          거래처 추가
        </button>
      </form>
    </div>
  );
};

export default AddClientForm;