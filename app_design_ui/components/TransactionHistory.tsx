
import React from 'react';
import type { Transaction } from '../types';

interface TransactionHistoryProps {
  transactions: Transaction[];
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions }) => {
  return (
    <div className="mt-8 bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      <h3 className="text-2xl font-semibold text-dark-text mb-4">Transaction History</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b-2 border-gray-200">
            <tr>
              <th className="p-3 text-sm font-semibold text-light-text">Date</th>
              <th className="p-3 text-sm font-semibold text-light-text">Member</th>
              <th className="p-3 text-sm font-semibold text-light-text">Store / Description</th>
              <th className="p-3 text-sm font-semibold text-light-text text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(tx => (
              <tr key={tx.id} className="border-b border-gray-100 last:border-b-0">
                <td className="p-3 text-dark-text whitespace-nowrap">{new Date(tx.date).toLocaleDateString()}</td>
                <td className="p-3 text-dark-text font-medium">{tx.memberName}</td>
                <td className="p-3 text-dark-text">{tx.store}</td>
                <td className="p-3 font-semibold text-right text-dark-text">
                  -${tx.amount.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionHistory;
