import { Search, Filter, X, Leaf, Sparkles, Heart, Brain, Moon, Zap, Shield, Plus } from 'lucide-react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";


const parseEffects = (benefitString: string | null | undefined) => {
    if (!benefitString) return [];
    return benefitString.split(',').map(effect => effect.trim()).filter(effect => effect.length > 0);
};

const parseUsages = (usageString: string | null | undefined) => {
    if (!usageString) return [];
    return usageString.split(',').map(usage => usage.trim()).filter(usage => usage.length > 0);
};

const parseFlavors = (flavorString: string | null | undefined) => {
    if (!flavorString) return [];
    return flavorString.split(',').map(flavor => flavor.trim()).filter(flavor => flavor.length > 0);
};


export default function StrainCard({ strain, isFavorite, onFavorite }: {
    strain: any;
    isFavorite: boolean;
    onFavorite: (id: string) => void;
}) {
    const effects = parseEffects(strain.benefit);
    const usages = parseUsages(strain.commonUsage);
    const flavors = parseFlavors(strain.flavor);

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
    return (
        <Dialog>
            <DialogTrigger asChild>
                <div
                    className="group relative bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg shadow-sage-200/30 hover:shadow-xl hover:shadow-sage-300/40 transition-all duration-300 hover:scale-105 hover:-translate-y-1 cursor-pointer flex flex-col"
                >
                    {/* Favorite Button */}
                    <button
                        onClick={e => {
                            e.stopPropagation();
                            onFavorite(strain._id);
                        }}
                        className={`absolute top-4 right-4 p-2 rounded-full transition-all duration-200 ${isFavorite
                            ? 'bg-rose-100 text-rose-500 hover:bg-rose-200'
                            : 'bg-white/50 text-sage-400 hover:bg-white/80 hover:text-rose-500'
                            }`}
                    >
                        <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                    </button>

                    {/* Type Badge */}
                    <div className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-medium mb-4 bg-gradient-to-r ${getTypeColor(strain.type)} border`}>
                        {getTypeIcon(strain.type)}
                        <span className="text-sage-700">{strain.type}</span>
                    </div>

                    {/* Strain Name */}
                    <h3 className="text-xl font-bold text-sage-800 mb-2 group-hover:text-sage-900 transition-colors">
                        {strain.name}
                    </h3>

                    {/* Breeder */}
                    <p className="text-sm text-sage-500 mb-4">
                        by {strain.breeder ? strain.breeder : 'Unknown Breeder'}
                    </p>

                    {/* Effects Preview */}
                    {effects.length > 0 && (
                        <div className="mb-4">
                            <h4 className="text-xs font-medium text-sage-600 mb-2 uppercase tracking-wide">Top Effects</h4>
                            <div className="flex flex-wrap gap-1">
                                {effects.slice(0, 3).map((effect: string, index: number) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center space-x-1 px-2 py-1 bg-sage-50/80 text-sage-600 rounded-lg text-xs font-medium"
                                    >
                                        {getEffectIcon(effect)}
                                        <span>{effect}</span>
                                    </span>
                                ))}
                                {effects.length > 3 && (
                                    <span className="inline-flex items-center px-2 py-1 bg-sage-100/80 text-sage-500 rounded-lg text-xs font-medium">
                                        <Plus className="w-3 h-3 mr-1" />
                                        {effects.length - 3} more
                                    </span>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Flavors Preview */}
                    {flavors.length > 0 && (
                        <div className="mb-6">
                            <h4 className="text-xs font-medium text-sage-600 mb-2 uppercase tracking-wide">Flavors</h4>
                            <div className="flex flex-wrap gap-1">
                                {flavors.slice(0, 2).map((flavor: string, index: number) => (
                                    <span
                                        key={index}
                                        className="px-2 py-1 bg-amber-50/80 text-amber-700 rounded-lg text-xs font-medium border border-amber-200/30"
                                    >
                                        {flavor}
                                    </span>
                                ))}
                                {flavors.length > 2 && (
                                    <span className="px-2 py-1 bg-amber-100/80 text-amber-600 rounded-lg text-xs font-medium">
                                        +{flavors.length - 2}
                                    </span>
                                )}
                            </div>
                        </div>
                    )}

                    {/* View Details Button */}
                    <button
                        className="w-full cursor-pointer px-4 py-3 bg-gradient-to-r from-[#7a8f7a] to-[#4a614a] text-white rounded-xl font-medium shadow-lg shadow-sage-500/25 hover:shadow-xl hover:shadow-sage-500/30 hover:from-sage-600 hover:to-moss-700 transition-all duration-300 group-hover:scale-105 mt-auto"
                    >
                        View Details
                    </button>
                </div>
            </DialogTrigger>
            <DialogContent className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-white/20 p-0">
                <DialogHeader className="sticky top-0 bg-white/90 backdrop-blur-xl border-b border-sage-200/30 p-6 rounded-t-3xl z-50">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-medium mb-3 bg-gradient-to-r ${getTypeColor(strain.type)} border`}>
                                {getTypeIcon(strain.type)}
                                <span className="text-sage-700">{strain.type}</span>
                            </div>
                            <DialogTitle asChild>
                                <h2 className="text-3xl font-bold text-sage-800 mb-2">{strain.name}</h2>
                            </DialogTitle>
                            <p className="text-sage-600">
                                by {strain.breeder ? strain.breeder : 'Unknown Breeder'}
                            </p>
                        </div>
                        <DialogClose asChild>
                            <button
                                className="p-2 rounded-full cursor-pointer bg-sage-100/80 hover:bg-sage-200/80 text-sage-600 hover:text-sage-800 transition-all duration-200"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </DialogClose>
                    </div>
                </DialogHeader>
                <div className="p-6 space-y-6">
                    {/* Effects */}
                    {effects.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold text-sage-800 mb-3 flex items-center">
                                <Sparkles className="w-5 h-5 mr-2 text-sage-600" />
                                Effects
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {effects.map((effect, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center space-x-2 px-3 py-2 bg-sage-100/80 text-sage-700 rounded-xl text-sm font-medium border border-sage-200/30"
                                    >
                                        {getEffectIcon(effect)}
                                        <span>{effect}</span>
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Medical Uses */}
                    {usages.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold text-sage-800 mb-3 flex items-center">
                                <Shield className="w-5 h-5 mr-2 text-sage-600" />
                                Medical Uses
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {usages.map((usage, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-2 bg-emerald-100/80 text-emerald-700 rounded-xl text-sm font-medium border border-emerald-200/30"
                                    >
                                        {usage}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Flavors */}
                    {flavors.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold text-sage-800 mb-3 flex items-center">
                                <Leaf className="w-5 h-5 mr-2 text-sage-600" />
                                Flavor Profile
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {flavors.map((flavor, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-2 bg-amber-100/80 text-amber-700 rounded-xl text-sm font-medium border border-amber-200/30"
                                    >
                                        {flavor}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex space-x-3 pt-4">
                        <button
                            onClick={() => onFavorite(strain._id)}
                            className={`flex-1 flex items-center justify-center space-x-2 px-6 py-3 cursor-pointer rounded-xl font-medium transition-all duration-200 ${isFavorite
                                ? 'bg-rose-100 text-rose-700 hover:bg-rose-200 border border-rose-200'
                                : 'bg-red-100 text-red-700 hover:bg-red-200 border border-red-200'
                                }`}
                        >
                            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                            <span>{isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}</span>
                        </button>

                        <DialogClose asChild>
                            <button
                                className="px-6 py-3 cursor-pointer bg-gradient-to-r from-[#7a8f7a] to-[#4a614a] text-white rounded-xl font-medium shadow-lg shadow-sage-500/25 hover:shadow-xl hover:shadow-sage-500/30 hover:from-sage-600 hover:to-moss-700 transition-all duration-300"
                            >
                                Close
                            </button>
                        </DialogClose>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}