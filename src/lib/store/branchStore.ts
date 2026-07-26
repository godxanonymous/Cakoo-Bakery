import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type BranchId = 'attock' | 'wah-cantt';

export interface Branch {
  id: BranchId;
  name: string;
  shortName: string;
  address: string;
  mapUrl: string;
  phone: string;
  whatsapp: string;
  email: string;
}

export const BRANCHES: Record<BranchId, Branch> = {
  'attock': {
    id: 'attock',
    name: 'Attock City',
    shortName: 'Attock',
    address: '3 Meela Chowk, opposite Total Parco Petrol Station, Attock City, Pakistan',
    mapUrl: 'https://maps.google.com/',
    phone: '+92 329 9927777',
    whatsapp: 'https://wa.me/923299927777',
    email: 'contact@cakoobakery.com'
  },
  'wah-cantt': {
    id: 'wah-cantt',
    name: 'Wah Cantt',
    shortName: 'Wah Cantt',
    address: 'B-180 Minar Road, Lala Rukh, Wah Cantt, Pakistan',
    mapUrl: 'https://maps.google.com/',
    phone: '+92 329 5115550',
    whatsapp: 'https://wa.me/923295115550',
    email: 'contact@cakoobakery.com'
  }
};

interface BranchState {
  selectedBranchId: BranchId;
  setBranch: (id: BranchId) => void;
  getCurrentBranch: () => Branch;
}

export const useBranchStore = create<BranchState>()(
  persist(
    (set, get) => ({
      selectedBranchId: 'attock', // Default branch
      setBranch: (id) => set({ selectedBranchId: id }),
      getCurrentBranch: () => {
        const branch = BRANCHES[get().selectedBranchId];
        return branch || BRANCHES['attock'];
      },
    }),
    {
      name: 'cakoo-branch-storage', // unique name
    }
  )
);
