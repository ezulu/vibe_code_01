"use client";

import { useState } from "react";
import { type PersonalInfoResponse } from "~/lib/validations/oura";
import { api } from "~/trpc/react";

export default function OuraPage() {
  const [token, setToken] = useState("");
  const [personalInfo, setPersonalInfo] = useState<PersonalInfoResponse | null>(null);

  const getPersonalInfoMutation = api.oura.getPersonalInfo.useMutation({
    onSuccess: (data) => {
      setPersonalInfo(data);
    },
    onError: (error) => {
      console.error("Failed to fetch personal info:", error);
    },
  });

  const fetchPersonalInfo = async () => {
    if (!token.trim()) {
      return;
    }

    try {
      await getPersonalInfoMutation.mutateAsync({ token });
    } catch (error) {
      // Error is handled by onError callback
      console.error("Mutation failed:", error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-8 px-4 py-16">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-[3rem]">
          Oura Ring <span className="text-[hsl(280,100%,70%)]">Personal Data</span>
        </h1>
        
        <div className="w-full max-w-md space-y-4">
          <div className="space-y-2">
            <label htmlFor="token" className="block text-sm font-medium">
              Personal Access Token
            </label>
            <input
              id="token"
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Enter your Oura PAT..."
              className="w-full rounded-lg bg-white/10 px-4 py-2 text-white placeholder-white/50 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          
          <button
            onClick={fetchPersonalInfo}
            disabled={getPersonalInfoMutation.isPending || !token.trim()}
            className="w-full rounded-lg bg-purple-600 px-4 py-2 font-semibold text-white transition hover:bg-purple-700 disabled:opacity-50"
          >
            {getPersonalInfoMutation.isPending ? "Loading..." : "Fetch Personal Info"}
          </button>
        </div>

        {getPersonalInfoMutation.error && (
          <div className="w-full max-w-md rounded-lg bg-red-500/20 border border-red-500 px-4 py-3 text-red-200">
            {getPersonalInfoMutation.error.message}
          </div>
        )}

        {personalInfo && (
          <div className="w-full max-w-md space-y-4">
            <h2 className="text-2xl font-bold">Personal Information</h2>
            <div className="rounded-lg bg-white/10 p-4 space-y-2">
              <div><strong>ID:</strong> {personalInfo.id}</div>
              <div><strong>Email:</strong> {personalInfo.email}</div>
              {personalInfo.age && <div><strong>Age:</strong> {personalInfo.age}</div>}
              {personalInfo.weight && <div><strong>Weight:</strong> {personalInfo.weight} kg</div>}
              {personalInfo.height && <div><strong>Height:</strong> {personalInfo.height} cm</div>}
              {personalInfo.biological_sex && <div><strong>Biological Sex:</strong> {personalInfo.biological_sex}</div>}
              {personalInfo.date_of_birth && <div><strong>Date of Birth:</strong> {personalInfo.date_of_birth}</div>}
            </div>
          </div>
        )}

        <div className="mt-8 text-center text-sm text-white/70">
          <p>Get your Personal Access Token from</p>
          <a 
            href="https://cloud.ouraring.com/personal-access-tokens" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-purple-400 hover:text-purple-300 underline"
          >
            cloud.ouraring.com
          </a>
        </div>
      </div>
    </main>
  );
}