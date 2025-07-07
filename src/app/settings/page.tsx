'use client';
import { useState } from "react";

export default function Settings() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    costLimit: 50,
    aiProvider: "openai",
  });

  const currentUsage = 12.45;
  const usagePercentage = (currentUsage / formData.costLimit) * 100;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert("Settings saved!");
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Settings</h2>
        <p className="text-lg text-gray-600">Manage your account and AI preferences</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Profile Information */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Profile Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter your email"
              />
            </div>
          </div>
        </div>

        {/* API Cost Limit */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">API Cost Limit</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Spending Limit</label>
              <div className="flex items-center space-x-4">
                <input
                  type="number"
                  value={formData.costLimit}
                  onChange={(e) => handleInputChange('costLimit', parseInt(e.target.value) || 0)}
                  className="w-32 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  min="1"
                />
                <span className="text-gray-600">USD per month</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Set a monthly limit to control your AI chat usage costs
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Current Usage</span>
                <span className="text-sm font-semibold text-indigo-600">
                  ${currentUsage.toFixed(2)} / ${formData.costLimit}.00
                </span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 transition-all"
                  style={{ width: `${usagePercentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Provider */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">AI Provider</h3>
          <div className="space-y-4">
            {[
              { id: 'openai', label: 'OpenAI', desc: 'GPT-4o powered conversations with high accuracy' },
              { id: 'deepseek', label: 'DeepSeek', desc: 'Cost-effective AI with good performance' },
              { id: 'perplexity', label: 'Perplexity', desc: 'Research-focused AI with real-time information' },
            ].map((provider) => (
              <label key={provider.id} className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="aiProvider"
                  value={provider.id}
                  checked={formData.aiProvider === provider.id}
                  onChange={(e) => handleInputChange('aiProvider', e.target.value)}
                  className="mt-1"
                />
                <div>
                  <div className="font-medium text-gray-900">{provider.label}</div>
                  <div className="text-sm text-gray-500">{provider.desc}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}
