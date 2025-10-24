
import React, { useState, useEffect, useCallback } from 'react';
import type { FamilyData, FamilyMember, Transaction } from './types';
import { familyService } from './services/baseSubaccountService';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import AddMemberModal from './components/AddMemberModal';
import SettingsModal from './components/SettingsModal';
import TransactionHistory from './components/TransactionHistory';

const App: React.FC = () => {
  const [familyData, setFamilyData] = useState<FamilyData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isAddMemberModalOpen, setAddMemberModalOpen] = useState(false);
  const [isSettingsModalOpen, setSettingsModalOpen] = useState(false);
  const [isHistoryVisible, setHistoryVisible] = useState(false);
  
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await familyService.getFamilyData();
      setFamilyData(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch family data.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddMember = async (name: string, role: 'Mom' | 'Kid', limit: number, allowance: number) => {
    try {
      const updatedData = await familyService.addFamilyMember(name, role, limit, allowance);
      setFamilyData(updatedData);
      setAddMemberModalOpen(false);
    } catch (err) {
      setError('Failed to add family member.');
    }
  };

  const handleUpdateSettings = async (memberId: string, limit: number, allowance: number) => {
    try {
      const updatedData = await familyService.updateMemberSettings(memberId, { spendingLimit: limit, dailyAllowance: allowance });
      setFamilyData(updatedData);
      setSettingsModalOpen(false);
      setSelectedMember(null);
    } catch (err) {
      setError('Failed to update settings.');
    }
  };
  
  const handleRevokeAccess = async (memberId: string) => {
    if(window.confirm('Are you sure you want to revoke access for this member?')) {
      try {
        const updatedData = await familyService.revokeAccess(memberId);
        setFamilyData(updatedData);
        setSettingsModalOpen(false);
        setSelectedMember(null);
      } catch (err) {
        setError('Failed to revoke access.');
      }
    }
  };

  const handleTopUpAllowance = async () => {
    try {
      const updatedData = await familyService.processDailyAllowances();
      setFamilyData(updatedData);
    } catch (err) {
      setError('Failed to process allowances.');
    }
  };

  const handleOpenSettings = (member: FamilyMember) => {
    setSelectedMember(member);
    setSettingsModalOpen(true);
  };
  
  const handleCloseModals = () => {
    setAddMemberModalOpen(false);
    setSettingsModalOpen(false);
    setSelectedMember(null);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen text-xl font-semibold text-base-blue">Loading BaseFam...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-screen text-xl font-semibold text-red-500">{error}</div>;
  }
  
  return (
    <div className="min-h-screen bg-light-bg font-sans text-dark-text">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        {familyData && (
          <Dashboard 
            familyData={familyData}
            onAddMember={() => setAddMemberModalOpen(true)}
            onOpenSettings={handleOpenSettings}
            onTopUpAllowance={handleTopUpAllowance}
            onToggleHistory={() => setHistoryVisible(!isHistoryVisible)}
          />
        )}
        {familyData && isHistoryVisible && <TransactionHistory transactions={familyData.transactions} />}
      </main>
      
      <AddMemberModal 
        isOpen={isAddMemberModalOpen}
        onClose={handleCloseModals}
        onAddMember={handleAddMember}
      />
      
      {selectedMember && (
        <SettingsModal
          isOpen={isSettingsModalOpen}
          onClose={handleCloseModals}
          member={selectedMember}
          onUpdate={handleUpdateSettings}
          onRevoke={handleRevokeAccess}
        />
      )}
    </div>
  );
};

export default App;
