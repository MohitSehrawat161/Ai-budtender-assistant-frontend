'use client'
import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, X, Leaf, Sparkles, Heart, Brain, Moon, Zap } from 'lucide-react';
import StrainCard from '@/components/StrainCard';
import { useGetStrainsQuery } from '@/store/api/api';

const TYPE_OPTIONS = ['All', 'Indica', 'Sativa', 'Hybrid'];
const EFFECT_OPTIONS = ['All', 'Relaxed', 'Happy', 'Sleepy', 'Euphoric', 'Creative', 'Focused', 'Uplifted', 'Energetic'];
const USAGE_OPTIONS = ['All', 'Stress', 'Pain', 'Insomnia', 'Depression', 'Inflammation', 'Lack of Appetite'];

const getTypeColor = (type: string) => {
  switch (type) {
    case 'Indica':
      return 'from-purple-500/20 to-indigo-500/20 border-purple-200/50';
    case 'Sativa':
      return 'from-emerald-500/20 to-green-500/20 border-emerald-200/50';
    case 'Hybrid':
      return 'from-amber-500/20 to-orange-500/20 border-amber-200/50';
    default:
      return 'from-slate-500/20 to-gray-500/20 border-slate-200/50';
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'Indica':
      return <Moon className="w-4 h-4" />;
    case 'Sativa':
      return <Zap className="w-4 h-4" />;
    case 'Hybrid':
      return <Sparkles className="w-4 h-4" />;
    default:
      return <Leaf className="w-4 h-4" />;
  }
};

const getEffectIcon = (effect: string) => {
  const effectLower = effect.toLowerCase();
  if (effectLower.includes('relaxed') || effectLower.includes('sleepy')) return <Moon className="w-3 h-3" />;
  if (effectLower.includes('happy') || effectLower.includes('euphoric')) return <Heart className="w-3 h-3" />;
  if (effectLower.includes('creative') || effectLower.includes('focused')) return <Brain className="w-3 h-3" />;
  if (effectLower.includes('energetic') || effectLower.includes('uplifted')) return <Zap className="w-3 h-3" />;
  return <Sparkles className="w-3 h-3" />;
};

export default function StrainExplorer() {
  const [search, setSearch] = useState('');
  const [type, setType] = useState('All');
  const [effect, setEffect] = useState('All');
  const [usage, setUsage] = useState('All');
  const [isScrolled, setIsScrolled] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const { data: strains, isLoading, isError } = useGetStrainsQuery();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredStrains = useMemo(() => {
    if (!strains) return [];
    return strains.filter((strain: any) => {
      const matchesName = strain.name?.toLowerCase().includes(search.toLowerCase());
      const matchesType = type === 'All' || strain.type === type;
      const matchesEffect =
        effect === 'All' || (strain.benefit && strain.benefit.toLowerCase().includes(effect.toLowerCase()));
      const matchesUsage =
        usage === 'All' || (strain.commonUsage && strain.commonUsage.toLowerCase().includes(usage.toLowerCase()));
      return matchesName && matchesType && matchesEffect && matchesUsage;
    });
  }, [strains, search, type, effect, usage]);

  const handleClear = () => {
    setSearch('');
    setType('All');
    setEffect('All');
    setUsage('All');
  };

  const toggleFavorite = (strainId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(strainId)) {
      newFavorites.delete(strainId);
    } else {
      newFavorites.add(strainId);
    }
    setFavorites(newFavorites);
  };

  return (
    <div className="min-h-screen  bg-[#f4fbf0]">
      {/* Sticky Filter Bar */}
      <div className={`sticky top-18 z-10 transition-all duration-300 ${isScrolled
          ? 'bg-white/90 backdrop-blur-xl shadow-lg shadow-sage-200/50 border-b border-white/20'
          : 'bg-white/70 backdrop-blur-md shadow-md shadow-sage-200/30'
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap gap-4 items-end">
            {/* Search */}
            <div className="flex-1 min-w-64 ">
              <label className="block text-sm font-medium text-sage-700 mb-2">
                <Search className="w-4 h-4 inline mr-1" />
                Search Strains
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Enter strain name..."
                  className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-sage-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-400/50 focus:border-sage-300 transition-all duration-200 text-sage-800 placeholder-sage-400"
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sage-400 hover:text-sage-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              <div>
                <label className="block text-sm font-medium text-sage-700 mb-2">Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="px-4 py-3 bg-white/80 backdrop-blur-sm border border-sage-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-400/50 focus:border-sage-300 transition-all duration-200 text-sage-800 min-w-32"
                >
                  {TYPE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-sage-700 mb-2">Effect</label>
                <select
                  value={effect}
                  onChange={(e) => setEffect(e.target.value)}
                  className="px-4 py-3 bg-white/80 backdrop-blur-sm border border-sage-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-400/50 focus:border-sage-300 transition-all duration-200 text-sage-800 min-w-32"
                >
                  {EFFECT_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-sage-700 mb-2">Usage</label>
                <select
                  value={usage}
                  onChange={(e) => setUsage(e.target.value)}
                  className="px-4 py-3 bg-white/80 backdrop-blur-sm border border-sage-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-400/50 focus:border-sage-300 transition-all duration-200 text-sage-800 min-w-32"
                >
                  {USAGE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleClear}
                className="px-6 py-3 bg-sage-100/80 hover:bg-sage-200/80 text-sage-700 rounded-xl font-medium transition-all duration-200 hover:scale-105 backdrop-blur-sm border border-sage-200/30"
              >
                <Filter className="w-4 h-4 inline mr-2" />
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-sage-800 via-moss-600 to-sage-800 bg-clip-text text-transparent mb-4">
            Cannabis Strain Explorer
          </h1>
          <p className="text-lg md:text-xl text-sage-600 max-w-3xl mx-auto leading-relaxed">
            Discover premium cannabis strains with detailed information about effects, usage, and flavors.
            Find your perfect match from our curated collection.
          </p>
          <div className="mt-6 flex items-center justify-center space-x-6 text-sage-500">
            <div className="flex items-center space-x-2">
              <Leaf className="w-5 h-5 text-sage-400" />
              <span className="text-sm font-medium">{isLoading ? 'Loading...' : filteredStrains.length + ' Strains Available'}</span>
            </div>
          </div>
        </div>

        {/* Strain Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isLoading ? (
            <div className="col-span-full text-center py-16">
              <div className="bg-white/60 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-lg shadow-sage-200/30 max-w-md mx-auto">
                <Leaf className="w-12 h-12 text-sage-400 mx-auto mb-4 animate-spin" />
                <h3 className="text-xl font-semibold text-sage-700 mb-2">Loading strains...</h3>
                <p className="text-sage-500 mb-4">Please wait while we fetch the latest strains</p>
              </div>
            </div>
          ) : isError ? (
            <div className="col-span-full text-center py-16">
              <div className="bg-white/60 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-lg shadow-sage-200/30 max-w-md mx-auto">
                <Leaf className="w-12 h-12 text-red-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-red-700 mb-2">Failed to load strains</h3>
                <p className="text-red-500 mb-4">There was an error fetching strains. Please try again later.</p>
                <button
                  onClick={handleClear}
                  className="px-6 py-2 bg-sage-500 hover:bg-sage-600 text-white rounded-xl font-medium transition-all duration-200 hover:scale-105"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          ) : filteredStrains.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <div className="bg-white/60 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-lg shadow-sage-200/30 max-w-md mx-auto">
                <Leaf className="w-12 h-12 text-sage-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-sage-700 mb-2">No strains found</h3>
                <p className="text-sage-500 mb-4">Try adjusting your filters or search terms</p>
                <button
                  onClick={handleClear}
                  className="px-6 py-2 bg-sage-500 hover:bg-sage-600 text-white rounded-xl font-medium transition-all duration-200 hover:scale-105"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          ) : (
            filteredStrains.map((strain: any) => (
              <StrainCard
                key={strain._id}
                strain={strain}
                isFavorite={favorites.has(strain._id)}
                onFavorite={toggleFavorite}
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
}