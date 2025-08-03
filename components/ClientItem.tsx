import React from 'react';
import type { Client } from '../types';
import { TrashIcon, CheckCircleIcon, CircleIcon, MapPinIcon } from './icons';

interface ClientItemProps {
  client: Client;
  onToggleVisited: (id: string) => void;
  onDelete: (id: string) => void;
}

const ClientItem: React.FC<ClientItemProps> = ({ client, onToggleVisited, onDelete }) => {
  return (
    <li className={`group flex items-center justify-between p-4 rounded-lg border transition-all duration-200 ${
      client.visited 
        ? 'bg-gray-50 border-gray-200' 
        : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
    }`}>
      <div className="flex items-center space-x-4 flex-1">
        <button 
          onClick={() => onToggleVisited(client.id)} 
          className="flex-shrink-0 p-1 rounded-full hover:bg-gray-100 transition-colors"
        >
          {client.visited ? (
            <CheckCircleIcon className="w-6 h-6 text-green-600" />
          ) : (
            <CircleIcon className="w-6 h-6 text-gray-400 group-hover:text-gray-600 transition-colors" />
          )}
        </button>
        
        <div className="flex-grow min-w-0">
          <p className={`font-medium text-gray-900 truncate ${
            client.visited ? 'line-through text-gray-500' : ''
          }`}>
            {client.name}
          </p>
          <div className="flex items-center text-sm text-gray-500 mt-1">
            <MapPinIcon className="w-4 h-4 mr-1.5 flex-shrink-0" />
            <span className={`truncate ${client.visited ? 'line-through' : ''}`}>
              {client.address}
            </span>
          </div>
        </div>
      </div>
      
      <button 
        onClick={() => onDelete(client.id)} 
        className="flex-shrink-0 p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
        aria-label="삭제"
      >
        <TrashIcon className="w-4 h-4" />
      </button>
    </li>
  );
};

export default ClientItem;