'use client';

import { useState, useEffect, JSX } from 'react';
import Link from 'next/link';
import { Leaf, ShoppingBag, MessageCircle, Sparkles } from 'lucide-react';
import { useRecommendProductsMutation } from '@/store/api/groqApi';
import { toast } from 'react-hot-toast';
import StrainCard from '@/components/StrainCard';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/components/ProductCard';

type Effect = 'To Relax' | 'Sleep' | 'Energy' | 'To Create' | 'Focus' | 'Pain Relief' | 'Stress Relief' | 'Appetite';
type ExperienceLevel = 'Never tried' | 'Beginner (used a few times)' | 'Experienced user';
type ProductType = 'Flower' | 'Edibles' | 'Vapes' | 'Tinctures' | 'Topicals' | 'Drops' | 'Not sure';

// interface Product {
//   name: string;
//   type: string;
//   description: string;
// }

interface Strain {
  name: string;
  type: 'Indica' | 'Sativa' | 'Hybrid';
  description: string;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  delay: number;
  duration: number;
}

const effects: Effect[] = [
  'To Relax', 'Sleep', 'Energy', 'To Create', 'Focus', 'Pain Relief', 'Stress Relief', 'Appetite'
];
const experienceLevels: ExperienceLevel[] = ['Never tried', 'Beginner (used a few times)', 'Experienced user'];
const productTypes: ProductType[] = ['Flower', 'Edibles', 'Vapes', 'Tinctures', 'Topicals', 'Drops', 'Not sure'];

const Confetti: React.FC = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const newParticles: Particle[] = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 2 + Math.random() * 2,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-bounce opacity-70"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
          }}
        />
      ))}
    </div>
  );
};

export default function Home(): JSX.Element {
  const [selectedEffects, setSelectedEffects] = useState<Effect[]>([]);
  const [experience, setExperience] = useState<ExperienceLevel | ''>('');
  const [productType, setProductType] = useState<ProductType | ''>('');
  const [showRecommendations, setShowRecommendations] = useState<boolean>(false);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [recommendProducts, { data, isLoading, error }] = useRecommendProductsMutation();
  const [recommendations, setRecommendations] = useState<{ products: Product[]; strains: Strain[] } | null>(null);

  const handleEffectToggle = (effect: Effect): void => {
    setSelectedEffects((prev) =>
      prev.includes(effect) ? prev.filter((e) => e !== effect) : [...prev, effect]
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLButtonElement>): Promise<void> => {
    e.preventDefault();
    if (selectedEffects.length > 0 && experience && productType) {
      setShowRecommendations(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
      try {
        const res = await recommendProducts({
          preferences: {
            goals: selectedEffects,
            experience,
            productType,
          },
        }).unwrap();
        setRecommendations(res.recommendations);
      } catch (err: any) {
        toast.error(err?.data?.message || 'Failed to get recommendations.');
        setRecommendations(null);
      }
    } else {
      alert('Please answer all questions to get recommendations.');
    }
  };
console.log(recommendations);
  const handleStartOver = (): void => {
    setSelectedEffects([]);
    setExperience('');
    setProductType('');
    setShowRecommendations(false);
  };

  const handleExperienceChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setExperience(e.target.value as ExperienceLevel);
  };

  const handleProductTypeChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setProductType(e.target.value as ProductType);
  };

  if (showRecommendations) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-teal-50 relative">
        {showConfetti && <Confetti />}
        <main className="container mx-auto px-4 py-12 text-gray-800 relative z-10">
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center gap-2 mb-4">
              <Sparkles className="text-purple-500 animate-pulse" size={32} />
              <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-teal-600 bg-clip-text text-transparent">
                Your Perfect Match
              </h1>
              <Sparkles className="text-teal-500 animate-pulse" size={32} />
            </div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Based on your preferences, we've curated these personalized recommendations just for you.
            </p>
          </div>

          {isLoading && (
            <div className="text-center text-lg text-indigo-600 font-semibold py-8">Loading recommendations...</div>
          )}
          {Boolean(error) && (
            <div className="text-center text-lg text-red-500 font-semibold py-8">Failed to load recommendations.</div>
          )}

          {recommendations && (
            <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
                  Recommended Products
                </h2>
                {recommendations.products.length > 0 ? recommendations.products.map((product, index) => (
                <ProductCard key={product._id || index} product={product} />
                )) : <div className="text-center text-gray-500">No products found.</div>}
              </div>


              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
                  Recommended Strains
                </h2>
                {recommendations.strains.length > 0 ? recommendations.strains.map((strain, index) => (
                  <StrainCard key={strain.name || index} strain={strain} isFavorite={false} onFavorite={() => {}} />
                )) : <div className="text-center text-gray-500">No strains found.</div>}
              </div>
            </div>
          )}

          <div className="text-center mt-16">
            <button
              onClick={handleStartOver}
              className="group px-10 py-4 border-2 border-purple-500 text-purple-600 font-bold rounded-2xl hover:bg-purple-500 hover:text-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              <span className="flex items-center gap-2">
                Start Over
                <div className="w-2 h-2 bg-current rounded-full group-hover:animate-bounce"></div>
              </span>
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-teal-50">
      <main className="container mx-auto px-4 py-12 text-gray-800">
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="flex justify-center gap-6 mb-12 flex-wrap">
            <Link href="/strains" className="group flex items-center gap-3 px-6 py-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-purple-100">
              <Leaf className="text-green-500 group-hover:animate-pulse" size={24} />
              <span className="font-semibold text-gray-700 group-hover:text-green-600">Browse Strains</span>
            </Link>
            <Link href="/products" className="group flex items-center gap-3 px-6 py-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-purple-100">
              <ShoppingBag className="text-purple-500 group-hover:animate-pulse" size={24} />
              <span className="font-semibold text-gray-700 group-hover:text-purple-600">Shop Products</span>
            </Link>
            <Link href="/chat" className="group flex items-center gap-3 px-6 py-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-purple-100">
              <MessageCircle className="text-teal-500 group-hover:animate-pulse" size={24} />
              <span className="font-semibold text-gray-700 group-hover:text-teal-600">Chat with AI</span>
            </Link>
          </div>
          
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-indigo-600 to-teal-600 bg-clip-text text-transparent leading-tight">
            Find Your Perfect Match
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Answer a few simple questions to get personalized cannabis recommendations tailored just for you.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-12">
          {/* Step 1 */}
          <div className="p-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-purple-100">
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
              Step 1: What are you looking for today?
            </h2>
            <div className="flex flex-wrap gap-4 justify-center">
              {effects.map((effect) => (
                <button
                  key={effect}
                  type="button"
                  onClick={() => handleEffectToggle(effect)}
                  className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 cursor-pointer ${
                    selectedEffects.includes(effect)
                      ? 'bg-gradient-to-r from-purple-500 to-teal-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
                  }`}
                >
                  {effect}
                </button>
              ))}
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-indigo-100">
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
              Step 2: What's your experience level?
            </h2>
            <div className="space-y-4 max-w-2xl mx-auto">
              {experienceLevels.map((level) => (
                <label
                  key={level}
                  className="group flex items-center p-6 bg-white rounded-2xl shadow-md cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border-2 border-transparent hover:border-indigo-200"
                >
                  <input
                    type="radio"
                    name="experience"
                    value={level}
                    checked={experience === level}
                    onChange={handleExperienceChange}
                    className="w-5 h-5 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0"
                  />
                  <span className="ml-6 text-lg font-medium text-gray-700 group-hover:text-indigo-600 transition-colors">
                    {level}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-teal-100">
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
              Step 3: What's your preferred product type?
            </h2>
            <div className="space-y-4 max-w-2xl mx-auto">
              {productTypes.map((type) => (
                <label
                  key={type}
                  className="group flex items-center p-6 bg-white rounded-2xl shadow-md cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border-2 border-transparent hover:border-teal-200"
                >
                  <input
                    type="radio"
                    name="productType"
                    value={type}
                    checked={productType === type}
                    onChange={handleProductTypeChange}
                    className="w-5 h-5 text-teal-600 focus:ring-teal-500 focus:ring-offset-0"
                  />
                  <span className="ml-6 text-lg font-medium text-gray-700 group-hover:text-teal-600 transition-colors">
                    {type}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="text-center pt-8">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!selectedEffects.length || !experience || !productType}
              className="group relative px-12 py-5 bg-gradient-to-r from-purple-600 to-teal-600 text-white font-bold text-xl rounded-2xl shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-3">
                Get My Recommendations
                <Sparkles className="group-hover:animate-spin" size={20} />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
        </div>
      </main>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}