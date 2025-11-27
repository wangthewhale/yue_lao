
import React, { useState, useRef } from 'react';
import { UserData, RelationshipType } from '../types';

interface InputFormProps {
  onSubmit: (data: UserData, type: RelationshipType) => void;
  initialData: UserData | null;
}

const SECTIONS = [
  { id: 'biometrics', title: 'Biometrics', subtitle: '生物特徵', icon: '01' },
  { id: 'status', title: 'Social Metrics', subtitle: '社會參數', icon: '02' },
  { id: 'psycho', title: 'Psycho', subtitle: '心理模組', icon: '03' },
  { id: 'deep', title: 'Values', subtitle: '價值觀分析', icon: '04' },
  { id: 'target', title: 'Target', subtitle: '鎖定目標', icon: '05' },
];

// Helper for consistent label styling
export const Label = ({ children }: { children?: React.ReactNode }) => (
  <label className="block text-sm md:text-base font-mono font-bold text-zinc-700 mb-2 uppercase tracking-wide">
    {children}
  </label>
);

export const InputForm: React.FC<InputFormProps> = ({ onSubmit, initialData }) => {
  const [activeSection, setActiveSection] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<UserData>(initialData || {
    name: '',
    age: '',
    gender: '',
    email: '',
    sexualOrientation: '',
    height: '',
    weight: '',
    income: '',
    photo: null,
    occupation: '',
    mbti: '',
    introExtroScale: 5,
    thinkingFeelingScale: 5,
    interests: '',
    values: '',
    petPeeves: '',
    idealWeekend: '',
    loveLanguage: '',
    darkSide: '',
  });

  const [selectedType, setSelectedType] = useState<RelationshipType>(RelationshipType.LIFE_PARTNER);

  const handleChange = (field: keyof UserData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNext = () => {
    if (activeSection < SECTIONS.length - 1) {
      setActiveSection(prev => prev + 1);
    } else {
      onSubmit(formData, selectedType);
    }
  };

  const handlePrev = () => {
    if (activeSection > 0) {
      setActiveSection(prev => prev - 1);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-zinc-200 w-full h-full shadow-2xl shadow-zinc-200/50 relative overflow-hidden rounded-sm">
      
      <div className="flex flex-col md:flex-row min-h-[600px]">
        {/* Sidebar Navigation */}
        <div className="md:w-64 bg-zinc-50 p-6 border-b md:border-b-0 md:border-r border-zinc-200">
          <div className="space-y-2">
            {SECTIONS.map((section, index) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(index)}
                disabled={index > activeSection + 1}
                className={`w-full flex items-center justify-between px-4 py-4 text-left transition-all font-mono text-sm border border-transparent ${
                  index === activeSection 
                    ? 'bg-white text-zinc-900 border-zinc-300 shadow-sm font-bold' 
                    : index < activeSection
                    ? 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-800'
                    : 'text-zinc-300 cursor-not-allowed'
                }`}
              >
                <div className="flex flex-col">
                    <span className="uppercase tracking-wider">{section.title}</span>
                    <span className="text-xs text-zinc-500 font-sans mt-0.5">{section.subtitle}</span>
                </div>
                <span className="font-mono text-xs opacity-50">{section.icon}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 p-6 md:p-12 relative flex flex-col bg-white">
          
          <div className="flex-1 max-w-2xl mx-auto w-full">
            <div className="mb-10 flex items-end gap-4 border-b border-zinc-200 pb-4">
                <h2 className="text-3xl md:text-4xl font-light text-zinc-900 tracking-tight">
                  {SECTIONS[activeSection].title}
                </h2>
                <span className="text-sm font-mono text-zinc-500 pb-1 mb-1 font-medium">
                   // {SECTIONS[activeSection].subtitle}_INPUT_SEQUENCE
                </span>
            </div>

            {/* Section 1: Biometrics */}
            {activeSection === 0 && (
              <div className="space-y-8 animate-fade-in">
                <div className="grid grid-cols-2 gap-8">
                   <div>
                    <Label>Name (你的姓名)</Label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      className="w-full bg-zinc-50 border-b-2 border-zinc-300 focus:border-cyan-600 outline-none p-3 text-zinc-900 font-medium font-sans text-lg placeholder-zinc-400 transition-colors"
                      placeholder="e.g. Alex"
                    />
                  </div>
                  <div>
                    <Label>Age (你的年齡)</Label>
                    <input 
                      type="text" 
                      value={formData.age}
                      onChange={(e) => handleChange('age', e.target.value)}
                      className="w-full bg-zinc-50 border-b-2 border-zinc-300 focus:border-cyan-600 outline-none p-3 text-zinc-900 font-medium font-sans text-lg placeholder-zinc-400 transition-colors"
                      placeholder="e.g. 28"
                    />
                  </div>
                  <div>
                    <Label>Height (你的身高 cm)</Label>
                    <input 
                      type="number" 
                      value={formData.height}
                      onChange={(e) => handleChange('height', e.target.value)}
                      className="w-full bg-zinc-50 border-b-2 border-zinc-300 focus:border-cyan-600 outline-none p-3 text-zinc-900 font-medium font-sans text-lg placeholder-zinc-400 transition-colors"
                      placeholder="e.g. 175"
                    />
                  </div>
                  <div>
                    <Label>Weight (你的體重 kg)</Label>
                    <input 
                      type="number" 
                      value={formData.weight}
                      onChange={(e) => handleChange('weight', e.target.value)}
                      className="w-full bg-zinc-50 border-b-2 border-zinc-300 focus:border-cyan-600 outline-none p-3 text-zinc-900 font-medium font-sans text-lg placeholder-zinc-400 transition-colors"
                      placeholder="e.g. 70"
                    />
                  </div>
                  <div>
                    <Label>Gender (你的性別)</Label>
                    <input 
                      type="text" 
                      value={formData.gender}
                      onChange={(e) => handleChange('gender', e.target.value)}
                      className="w-full bg-zinc-50 border-b-2 border-zinc-300 focus:border-cyan-600 outline-none p-3 text-zinc-900 font-medium font-sans text-lg placeholder-zinc-400 transition-colors"
                      placeholder="e.g. 男性 / 女性"
                    />
                  </div>
                  <div>
                    <Label>Orientation (你的性向)</Label>
                    <select 
                        value={formData.sexualOrientation}
                        onChange={(e) => handleChange('sexualOrientation', e.target.value)}
                        className="w-full bg-zinc-50 border-b-2 border-zinc-300 focus:border-cyan-600 outline-none p-3 text-zinc-900 font-medium font-sans text-lg transition-colors"
                    >
                        <option value="" disabled>Select...</option>
                        <option value="Heterosexual">Heterosexual (異性戀)</option>
                        <option value="Homosexual">Homosexual (同性戀)</option>
                        <option value="Bisexual">Bisexual (雙性戀)</option>
                        <option value="Pansexual">Pansexual (泛性戀)</option>
                        <option value="Other">Other (其他)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Section 2: Social Metrics */}
            {activeSection === 1 && (
              <div className="space-y-8 animate-fade-in">
                <div>
                    <Label>Occupation (你的職業)</Label>
                    <input 
                      type="text" 
                      value={formData.occupation}
                      onChange={(e) => handleChange('occupation', e.target.value)}
                      className="w-full bg-zinc-50 border-b-2 border-zinc-300 focus:border-cyan-600 outline-none p-4 text-zinc-900 font-medium font-sans text-lg placeholder-zinc-400 transition-colors"
                      placeholder="e.g. 軟體工程師 / 專案經理"
                    />
                </div>
                <div>
                    <Label>Annual Income (你的年收入)</Label>
                    <input 
                      type="text" 
                      value={formData.income}
                      onChange={(e) => handleChange('income', e.target.value)}
                      className="w-full bg-zinc-50 border-b-2 border-zinc-300 focus:border-cyan-600 outline-none p-4 text-zinc-900 font-medium font-sans text-lg placeholder-zinc-400 transition-colors"
                      placeholder="例如：100萬台幣"
                    />
                    <p className="text-xs text-zinc-500 mt-2 font-mono flex items-center gap-1 font-medium">
                        <span className="w-1.5 h-1.5 bg-cyan-600 rounded-full"></span>
                        Used for Social Vector Calibration (用於校準社會參數向量)。
                      </p>
                </div>
              </div>
            )}

            {/* Section 3: Psycho */}
            {activeSection === 2 && (
              <div className="space-y-10 animate-fade-in">
                <div>
                    <Label>MBTI Code (你的 MBTI)</Label>
                    <input 
                      type="text" 
                      value={formData.mbti}
                      onChange={(e) => handleChange('mbti', e.target.value.toUpperCase())}
                      className="w-full bg-zinc-50 border-b-2 border-zinc-300 focus:border-cyan-600 outline-none p-4 text-zinc-900 font-medium font-sans text-lg placeholder-zinc-400 transition-colors"
                      placeholder="e.g. ENTJ"
                      maxLength={5}
                    />
                </div>
                
                <div>
                  <Label>Energy Source (你的能量來源)</Label>
                  <div className="flex justify-between text-xs font-mono mb-2 text-zinc-600 uppercase tracking-widest font-bold">
                    <span>Introvert (內向)</span>
                    <span>Extrovert (外向)</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" max="10" 
                    value={formData.introExtroScale}
                    onChange={(e) => handleChange('introExtroScale', parseInt(e.target.value))}
                    className="w-full h-2 bg-zinc-200 rounded-none appearance-none cursor-pointer accent-zinc-900"
                  />
                  <div className="flex justify-between text-xs text-zinc-500 mt-2 font-medium">
                      <span>需要獨處恢復能量</span>
                      <span>從社交獲取能量</span>
                  </div>
                </div>

                <div>
                  <Label>Decision Making (你的決策模式)</Label>
                  <div className="flex justify-between text-xs font-mono mb-2 text-zinc-600 uppercase tracking-widest font-bold">
                    <span>Logic (理性)</span>
                    <span>Emotion (感性)</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" max="10" 
                    value={formData.thinkingFeelingScale}
                    onChange={(e) => handleChange('thinkingFeelingScale', parseInt(e.target.value))}
                    className="w-full h-2 bg-zinc-200 rounded-none appearance-none cursor-pointer accent-zinc-900"
                  />
                  <div className="flex justify-between text-xs text-zinc-500 mt-2 font-medium">
                      <span>事實與效率導向</span>
                      <span>人情與感受導向</span>
                  </div>
                </div>
              </div>
            )}

            {/* Section 4: Values */}
            {activeSection === 3 && (
              <div className="space-y-8 animate-fade-in">
                 <div>
                    <Label>Interests & Habits (你的興趣與習慣)</Label>
                    <textarea 
                      value={formData.interests}
                      onChange={(e) => handleChange('interests', e.target.value)}
                      className="w-full h-32 bg-zinc-50 border border-zinc-300 focus:border-cyan-600 outline-none p-4 text-zinc-900 text-lg placeholder-zinc-400 resize-none rounded-sm transition-colors font-medium"
                      placeholder="e.g. 週末喜歡去咖啡廳看書, 規律健身, 喜歡研究手沖咖啡..."
                    />
                 </div>
                 <div>
                    <Label>Core Values (你的核心價值觀)</Label>
                    <textarea 
                      value={formData.values}
                      onChange={(e) => handleChange('values', e.target.value)}
                      className="w-full h-32 bg-zinc-50 border border-zinc-300 focus:border-cyan-600 outline-none p-4 text-zinc-900 text-lg placeholder-zinc-400 resize-none rounded-sm transition-colors font-medium"
                      placeholder="e.g. 財務自由是首要目標, 相信傳統家庭價值..."
                    />
                 </div>
                 <div>
                    <Label>Dark Side Data (你的陰暗面數據)</Label>
                    <textarea 
                      value={formData.darkSide}
                      onChange={(e) => handleChange('darkSide', e.target.value)}
                      className="w-full h-32 bg-zinc-50 border border-zinc-300 focus:border-cyan-600 outline-none p-4 text-zinc-900 text-lg placeholder-zinc-400 resize-none rounded-sm transition-colors font-medium"
                      placeholder="e.g. 脾氣不好, 容易嫉妒, 對整潔有強迫症..."
                    />
                 </div>
              </div>
            )}

            {/* Section 5: Target & Photo */}
            {activeSection === 4 && (
              <div className="space-y-8 animate-fade-in">
                {/* Relationship Type Selection */}
                <div className="space-y-6">
                   <Label>Goal (你的目標關係)</Label>
                   <div className="grid grid-cols-1 gap-4">
                    {[
                      { id: RelationshipType.CASUAL_PARTNER, label: 'Casual Partner', sub: '短期關係 / 砲友' },
                      { id: RelationshipType.LIFE_PARTNER, label: 'Life Partner', sub: '人生伴侶' },
                    ].map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setSelectedType(type.id)}
                        className={`p-6 border text-left transition-all flex items-center justify-between group rounded-sm ${
                          selectedType === type.id
                            ? 'bg-zinc-900 border-zinc-900 text-white'
                            : 'bg-white border-zinc-300 hover:border-zinc-400 text-zinc-600 hover:text-zinc-900'
                        }`}
                      >
                        <div>
                          <div className={`font-mono text-base tracking-wider uppercase font-bold`}>
                            {type.label}
                          </div>
                          <div className={`text-sm mt-1 font-medium ${selectedType === type.id ? 'text-zinc-300' : 'text-zinc-500'}`}>{type.sub}</div>
                        </div>
                        
                        {/* Radio indicator */}
                        {selectedType === type.id && (
                          <div className="w-3 h-3 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.8)]"></div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                 {/* New Field: Email */}
                 <div className="pt-8 border-t border-zinc-100">
                    <Label>Email (你的電子郵件)</Label>
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className="w-full bg-zinc-50 border-b-2 border-zinc-300 focus:border-cyan-600 outline-none p-4 text-zinc-900 font-medium font-sans text-lg placeholder-zinc-400 transition-colors"
                      placeholder="e.g. you@example.com"
                    />
                 </div>

                {/* Photo Upload */}
                <div className="pt-8 border-t border-zinc-100">
                  <Label>
                    Subject Photo (你的照片 - Optional)
                  </Label>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={`w-full h-56 border-2 border-dashed rounded-sm flex flex-col items-center justify-center cursor-pointer transition-all bg-zinc-50 hover:bg-zinc-100 ${
                        formData.photo 
                        ? 'border-cyan-500/50' 
                        : 'border-zinc-300 hover:border-zinc-500'
                    }`}
                  >
                     {formData.photo ? (
                         <div className="relative w-full h-full flex items-center justify-center p-2">
                            <img src={formData.photo} alt="User" className="h-full object-contain shadow-sm" />
                            <div className="absolute top-2 right-2 bg-green-500 w-3 h-3 rounded-full border border-white"></div>
                         </div>
                     ) : (
                         <>
                            <span className="text-4xl mb-3 text-zinc-400">📸</span>
                            <span className="text-zinc-600 text-xs font-mono uppercase font-bold">Initialize Biometric Scan (Optional)</span>
                            <span className="text-zinc-500 text-[10px] mt-2 font-medium">Click to Upload</span>
                         </>
                     )}
                     <input 
                        ref={fileInputRef}
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleImageUpload}
                     />
                  </div>
                  <p className="text-xs text-zinc-500 mt-2 font-mono flex items-center gap-1 font-medium">
                    <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full"></span>
                    Upload to enable biometric matching (上傳照片可啟用生物特徵配對).
                  </p>
               </div>
              </div>
            )}

            {/* Navigation */}
            <div className="mt-16 flex justify-between items-center pt-6 border-t border-zinc-200">
              <button
                onClick={handlePrev}
                disabled={activeSection === 0}
                className={`font-mono text-xs tracking-[0.2em] text-zinc-500 hover:text-zinc-900 transition-colors uppercase flex items-center gap-2 font-bold ${
                  activeSection === 0 ? 'opacity-0' : ''
                }`}
              >
                &larr; BACK
              </button>
              
              <button
                onClick={handleNext}
                className="bg-zinc-900 hover:bg-cyan-600 text-white font-mono font-bold text-xs px-10 py-4 uppercase tracking-[0.2em] transition-all rounded-sm shadow-lg shadow-zinc-300"
              >
                {activeSection === SECTIONS.length - 1 ? 'Execute Analysis' : 'Next Step'}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
