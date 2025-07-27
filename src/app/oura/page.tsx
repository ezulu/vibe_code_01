"use client";

import { useState, useEffect } from "react";
import { type PersonalInfoResponse } from "~/lib/validations/oura";
import { api } from "~/trpc/react";

// Utility functions for unit conversions
function kgToPounds(kg: number): number {
  return Math.round(kg * 2.20462);
}

function metersToFeetInches(meters: number): { feet: number; inches: number } {
  const totalInches = meters * 39.3701;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return { feet, inches };
}

// Gender icon components - bathroom door style silhouettes
const MaleIcon = () => (
  <svg className="h-6 w-6 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
    {/* Head */}
    <circle cx="12" cy="4" r="2" />
    {/* Body */}
    <path d="M15 8H9c-1 0-1 1-1 1v6h2v8h4v-8h2V9s0-1-1-1z" />
    {/* Arms */}
    <path d="M8 10v4h1v-4zM15 10v4h1v-4z" />
    {/* Legs */}
    <path d="M10 15v8h1v-8zM13 15v8h1v-8z" />
  </svg>
);

const FemaleIcon = () => (
  <svg className="h-6 w-6 text-pink-400" viewBox="0 0 24 24" fill="currentColor">
    {/* Head */}
    <circle cx="12" cy="4" r="2" />
    {/* Body/Dress */}
    <path d="M16 8H8c-1 0-1 1-1 1v5c0 2 1 3 2 3h1v7h4v-7h1c1 0 2-1 2-3V9s0-1-1-1z" />
    {/* Arms */}
    <path d="M7 10v4h1v-4zM16 10v4h1v-4z" />
  </svg>
);

export default function OuraPage() {
  const [token, setToken] = useState("");
  const [personalInfo, setPersonalInfo] = useState<PersonalInfoResponse | null>(null);

  // In development we use the token from the server's environment so the
  // visitor does not need to provide it manually.
  const isDev = process.env.NODE_ENV !== "production";

  const getPersonalInfoMutation = api.oura.getPersonalInfo.useMutation({
    onSuccess: (data) => {
      setPersonalInfo(data);
    },
    onError: (error) => {
      console.error("Failed to fetch personal info:", error);
    },
  });

  const fetchPersonalInfo = async () => {
    if (!token.trim() && !isDev) {
      return;
    }

    try {
      await getPersonalInfoMutation.mutateAsync(isDev ? {} : { token });
    } catch (error) {
      // Error is handled by onError callback
      console.error("Mutation failed:", error);
    }
  };

  // Automatically fetch when running locally so users don't have to click the
  // button or provide a token.
  useEffect(() => {
    if (isDev && !personalInfo && !getPersonalInfoMutation.isPending) {
      void fetchPersonalInfo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDev]);

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-4xl px-6 py-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Your <span className="text-emerald-700">Oura Profile</span>
          </h1>
          <p className="mt-2 text-gray-600">Manage your health data and insights</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-4xl px-6 py-8">
        
        {!isDev && !personalInfo && (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Connect Your Oura Account</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="token" className="block text-sm font-medium text-gray-700">
                  Personal Access Token
                </label>
                <input
                  id="token"
                  type="password"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Enter your Oura PAT..."
                  className="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              
              <button
                onClick={fetchPersonalInfo}
                disabled={getPersonalInfoMutation.isPending || !token.trim()}
                className="w-full rounded-md bg-emerald-700 px-4 py-2 font-semibold text-white transition hover:bg-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {getPersonalInfoMutation.isPending ? "Connecting..." : "Connect Account"}
              </button>
            </div>
          </div>
        )}

        {getPersonalInfoMutation.error && (
          <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-red-800">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-red-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {getPersonalInfoMutation.error.message}
            </div>
          </div>
        )}

        {personalInfo && (
          <div className="space-y-8">
            {/* Profile Header */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center">
                  <svg className="h-8 w-8 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{personalInfo.email}</h2>
                  <p className="text-sm text-gray-600">Oura User ID: {personalInfo.id}</p>
                </div>
              </div>
            </div>

            {/* Personal Details */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {personalInfo.age && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-700">Age</span>
                    <span className="text-sm text-gray-900">{personalInfo.age} years</span>
                  </div>
                )}
                {personalInfo.biological_sex && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-700">Biological Sex</span>
                    <div className="flex items-center space-x-2">
                      {personalInfo.biological_sex.toLowerCase() === 'male' ? <MaleIcon /> : <FemaleIcon />}
                      <span className="text-sm text-gray-900 capitalize">{personalInfo.biological_sex}</span>
                    </div>
                  </div>
                )}
                {personalInfo.height && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-700">Height</span>
                    <span className="text-sm text-gray-900">
                      {metersToFeetInches(personalInfo.height).feet}&apos; {metersToFeetInches(personalInfo.height).inches}&quot;
                    </span>
                  </div>
                )}
                {personalInfo.weight && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-700">Weight</span>
                    <span className="text-sm text-gray-900">{kgToPounds(personalInfo.weight)} lbs</span>
                  </div>
                )}
                {personalInfo.date_of_birth && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-700">Date of Birth</span>
                    <span className="text-sm text-gray-900">{personalInfo.date_of_birth}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}