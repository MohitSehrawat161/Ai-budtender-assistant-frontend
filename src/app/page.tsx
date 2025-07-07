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
      <div className="min-h-screen" style={{ backgroundColor: '#f4fbf0' }}>
        {showConfetti && <Confetti />}
        <main className="container mx-auto px-4 py-12" style={{ color: '#232728' }}>
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center gap-2 mb-4">
              <Sparkles style={{ color: '#82c341' }} className="animate-pulse" size={32} />
              <h1 className="text-5xl font-bold" style={{ background: 'linear-gradient(to right, #38861a, #82c341)', WebkitBackgroundClip: 'text', color: 'transparent' }}>
                Your Perfect Match
              </h1>
              <Sparkles style={{ color: '#3F4540' }} className="animate-pulse" size={32} />
            </div>
            <p className="text-xl" style={{ color: '#3F4540' }}>
              Based on your preferences, we've curated these personalized recommendations just for you.
            </p>
          </div>

          {isLoading && (
            <div className="text-center text-lg font-semibold py-8" style={{ color: '#38861a' }}>Loading recommendations...</div>
          )}
          {Boolean(error) && (
            <div className="text-center text-lg font-semibold py-8" style={{ color: '#c0392b' }}>Failed to load recommendations.</div>
          )}

          {recommendations && (
            <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-center mb-8" style={{ color: '#232728' }}>
                  Recommended Products
                </h2>
                {recommendations.products.length > 0 ? recommendations.products.map((product, index) => (
                <ProductCard key={product._id || index} product={product} />
                )) : <div className="text-center" style={{ color: '#7a7d7e' }}>No products found.</div>}
              </div>

              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-center mb-8" style={{ color: '#232728' }}>
                  Recommended Strains
                </h2>
                {recommendations.strains.length > 0 ? recommendations.strains.map((strain, index) => (
                  <StrainCard key={strain.name || index} strain={strain} isFavorite={false} onFavorite={() => {}} />
                )) : <div className="text-center" style={{ color: '#7a7d7e' }}>No strains found.</div>}
              </div>
            </div>
          )}

          <div className="text-center mt-16">
            <button
              onClick={handleStartOver}
              className="group px-10 py-4 border-2 font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              style={{ borderColor: '#82c341', color: '#82c341' }}
              onMouseOver={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#82c341'; (e.currentTarget as HTMLButtonElement).style.color = '#fff'; }}
              onMouseOut={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = '#82c341'; }}
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
    <div className="min-h-screen" style={{ backgroundColor: '#f4fbf0' }}>
      <main className="container mx-auto px-4 py-12" style={{ color: '#232728' }}>
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="flex justify-center gap-6 mb-12 flex-wrap">
            <Link href="/strains" className="group flex items-center gap-3 px-6 py-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border" style={{ borderColor: '#eaf7e0' }}>
              <Leaf style={{ color: '#82c341' }} className="group-hover:animate-pulse" size={24} />
              <span className="font-semibold group-hover:text-[#82c341]" style={{ color: '#3F4540' }}>Browse Strains</span>
            </Link>
            <Link href="/products" className="group flex items-center gap-3 px-6 py-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border" style={{ borderColor: '#eaf7e0' }}>
              <ShoppingBag style={{ color: '#38861a' }} className="group-hover:animate-pulse" size={24} />
              <span className="font-semibold group-hover:text-[#38861a]" style={{ color: '#3F4540' }}>Shop Products</span>
            </Link>
            <Link href="/chat" className="group flex items-center gap-3 px-6 py-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border" style={{ borderColor: '#eaf7e0' }}>
              <MessageCircle style={{ color: '#3F4540' }} className="group-hover:animate-pulse" size={24} />
              <span className="font-semibold group-hover:text-[#3F4540]" style={{ color: '#3F4540' }}>Chat with AI</span>
            </Link>
          </div>
          
          <h1 className="text-6xl font-bold mb-6 leading-tight" style={{ background: 'linear-gradient(to right, #38861a, #82c341)', WebkitBackgroundClip: 'text', color: 'transparent' }}>
            Find Your Perfect Match
          </h1>
          <p className="text-xl leading-relaxed max-w-2xl mx-auto" style={{ color: '#3F4540' }}>
            Answer a few simple questions to get personalized cannabis recommendations tailored just for you.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-12">
          {/* Step 1 */}
          <div className="p-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border" style={{ borderColor: '#eaf7e0' }}>
            <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: '#232728' }}>
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
                      ? ''
                      : ''
                  }`}
                  style={selectedEffects.includes(effect)
                    ? { background: 'linear-gradient(to right, #38861a, #82c341)', color: '#fff', boxShadow: '0 4px 14px 0 #eaf7e0' }
                    : { backgroundColor: '#f4fbf0', color: '#3F4540', border: '1px solid #eaf7e0' }}
                >
                  {effect}
                </button>
              ))}
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border" style={{ borderColor: '#eaf7e0' }}>
            <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: '#232728' }}>
              Step 2: What's your experience level?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              {experienceLevels.map((level) => (
                <label
                  key={level}
                  className="group flex items-center p-6 bg-white rounded-2xl shadow-md cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border-2 border-transparent"
                  style={{ borderColor: experience === level ? '#82c341' : 'transparent' }}
                >
                  <input
                    type="radio"
                    name="experience"
                    value={level}
                    checked={experience === level}
                    onChange={handleExperienceChange}
                    className="w-5 h-5 focus:ring-0"
                    style={{ accentColor: '#82c341' }}
                  />
                  <span className="ml-6 text-lg font-medium transition-colors" style={{ color: experience === level ? '#82c341' : '#3F4540' }}>
                    {level}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border" style={{ borderColor: '#eaf7e0' }}>
            <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: '#232728' }}>
              Step 3: What's your preferred product type?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              {productTypes.map((type) => (
                <label
                  key={type}
                  className="group flex items-center p-6 bg-white rounded-2xl shadow-md cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border-2 border-transparent"
                  style={{ borderColor: productType === type ? '#82c341' : 'transparent' }}
                >
                  <input
                    type="radio"
                    name="productType"
                    value={type}
                    checked={productType === type}
                    onChange={handleProductTypeChange}
                    className="w-5 h-5 focus:ring-0"
                    style={{ accentColor: '#82c341' }}
                  />
                  <span className="ml-6 text-lg font-medium transition-colors" style={{ color: productType === type ? '#82c341' : '#3F4540' }}>
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
              className="group relative px-12 py-5 font-bold text-xl rounded-2xl shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 overflow-hidden"
              style={{ background: 'linear-gradient(to right, #38861a, #82c341)', color: '#fff', border: 'none' }}
            >
              <span className="relative z-10 flex items-center gap-3">
                Get My Recommendations
                <Sparkles className="group-hover:animate-spin" size={20} style={{ color: '#fff' }} />
              </span>
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, #82c341, #38861a)', opacity: 0 }}></div>
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