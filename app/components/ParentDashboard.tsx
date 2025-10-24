"use client";

import { useState, useEffect } from "react";
import { useReadContract } from "wagmi";
import { familyManagerAbi } from "../../contract/abis";

const FAMILY_MANAGER_CONTRACT = process.env.NEXT_PUBLIC_FAMILY_MANAGER_ADDRESS as `0x${string}`;

interface ParentDashboardProps {
  address: `0x${string}`;
  onNotification: (message: string, type: "success" | "error" | "info") => void;
}

export default function ParentDashboard({ address, onNotification }: ParentDashboardProps) {
  const [children, setChildren] = useState<`0x${string}`[]>([]);
  const [isLoadingChildren, setIsLoadingChildren] = useState(true);

  const { data: child0 } = useReadContract({
    address: FAMILY_MANAGER_CONTRACT,
    abi: familyManagerAbi,
    functionName: "parentToChildren",
    args: [address, 0n],
  });

  const { data: child1 } = useReadContract({
    address: FAMILY_MANAGER_CONTRACT,
    abi: familyManagerAbi,
    functionName: "parentToChildren",
    args: [address, 1n],
  });

  const { data: child2 } = useReadContract({
    address: FAMILY_MANAGER_CONTRACT,
    abi: familyManagerAbi,
    functionName: "parentToChildren",
    args: [address, 2n],
  });

  useEffect(() => {
    const childAddresses: `0x${string}`[] = [];
    
    if (child0 && child0 !== "0x0000000000000000000000000000000000000000") {
      childAddresses.push(child0 as `0x${string}`);
    }
    if (child1 && child1 !== "0x0000000000000000000000000000000000000000") {
      childAddresses.push(child1 as `0x${string}`);
    }
    if (child2 && child2 !== "0x0000000000000000000000000000000000000000") {
      childAddresses.push(child2 as `0x${string}`);
    }

    setChildren(childAddresses);
    setIsLoadingChildren(false);
  }, [child0, child1, child2]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Parent Dashboard</h2>
            <p className="text-gray-600 mt-1">Manage your family wallet and child accounts</p>
          </div>
          <div className="bg-blue-100 px-4 py-2 rounded-lg">
            <p className="text-sm font-medium text-blue-900">
              {children.length} {children.length === 1 ? "Child" : "Children"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-blue-900">Total Balance</h3>
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-3xl font-bold text-blue-900">$0.00</p>
            <p className="text-xs text-blue-700 mt-1">Main wallet balance</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-green-900">Active Children</h3>
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <p className="text-3xl font-bold text-green-900">{children.length}</p>
            <p className="text-xs text-green-700 mt-1">Registered accounts</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-purple-900">Total Spent</h3>
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <p className="text-3xl font-bold text-purple-900">$0.00</p>
            <p className="text-xs text-purple-700 mt-1">This month</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Child Accounts</h3>
        {isLoadingChildren ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : children.length === 0 ? (
          <div className="text-center py-8">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="text-gray-600">No child accounts registered yet</p>
            <p className="text-sm text-gray-500 mt-2">Register a child account to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            {children.map((child, index) => (
              <ChildCard key={child} childAddress={child} index={index} />
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => onNotification("Register child feature coming soon", "info")}
            className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            <span>Register Child</span>
          </button>
          <button
            onClick={() => onNotification("Fund children feature coming soon", "info")}
            className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Fund Children</span>
          </button>
          <button
            onClick={() => onNotification("Settings feature coming soon", "info")}
            className="flex items-center justify-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function ChildCard({ childAddress, index }: { childAddress: `0x${string}`; index: number }) {
  const { data: limits } = useReadContract({
    address: FAMILY_MANAGER_CONTRACT,
    abi: familyManagerAbi,
    functionName: "getChildLimits",
    args: [childAddress],
  });

  const { data: isPaused } = useReadContract({
    address: FAMILY_MANAGER_CONTRACT,
    abi: familyManagerAbi,
    functionName: "isChildPaused",
    args: [childAddress],
  });

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
            {index + 1}
          </div>
          <div>
            <p className="font-medium text-gray-900">Child {index + 1}</p>
            <p className="text-xs text-gray-500 font-mono">
              {childAddress.slice(0, 6)}...{childAddress.slice(-4)}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {isPaused ? (
            <span className="px-2 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded">
              Paused
            </span>
          ) : (
            <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded">
              Active
            </span>
          )}
        </div>
      </div>
      {limits && (
        <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
          <div className="bg-gray-50 rounded p-2">
            <p className="text-xs text-gray-600">Daily</p>
            <p className="font-semibold text-gray-900">{limits[0]?.toString() || "0"}</p>
          </div>
          <div className="bg-gray-50 rounded p-2">
            <p className="text-xs text-gray-600">Weekly</p>
            <p className="font-semibold text-gray-900">{limits[1]?.toString() || "0"}</p>
          </div>
          <div className="bg-gray-50 rounded p-2">
            <p className="text-xs text-gray-600">Monthly</p>
            <p className="font-semibold text-gray-900">{limits[2]?.toString() || "0"}</p>
          </div>
        </div>
      )}
    </div>
  );
}
