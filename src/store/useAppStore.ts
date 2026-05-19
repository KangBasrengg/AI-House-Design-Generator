import { create } from 'zustand';
import { translations, Language } from '@/lib/i18n/translations';

export const useAppStore = create<{ lang: Language; setLang: (l: Language) => void }>((set) => ({
  lang: 'en',
  setLang: (lang) => set({ lang }),
}));
