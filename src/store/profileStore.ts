import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface PlayerProfile {
    id: string;
    name: string;
    avatarSeed: number; // For procedural blobby avatar generation
    avatarColor: string;
    createdAt: string;
    stats: {
        highestLevel: number;
        currentLevel: number;
        totalClears: number;
        gamesPlayed: number;
        bestCombo: number;
        totalDropsUsed: number;
    };
    unlockedPowerups: string[];
}

interface ProfileState {
    profiles: PlayerProfile[];
    activeProfileId: string | null;

    // Actions
    createProfile: (name: string) => PlayerProfile;
    selectProfile: (id: string) => void;
    deleteProfile: (id: string) => void;
    updateStats: (updates: Partial<PlayerProfile['stats']>) => void;
    unlockPowerup: (powerupId: string) => void;
    getActiveProfile: () => PlayerProfile | null;
}

// Blob avatar color palette - warm and friendly
const AVATAR_COLORS = [
    '#00d4aa', // Teal
    '#ffb347', // Orange
    '#ff6b9d', // Pink
    '#a18cd1', // Purple
    '#67e8f9', // Cyan
    '#fbbf24', // Yellow
    '#f87171', // Coral
    '#34d399', // Green
];

export const useProfileStore = create<ProfileState>()(
    persist(
        (set, get) => ({
            profiles: [],
            activeProfileId: null,

            createProfile: (name: string) => {
                const newProfile: PlayerProfile = {
                    id: Math.random().toString(36).substring(2, 9),
                    name: name.trim() || 'Player',
                    avatarSeed: Math.floor(Math.random() * 1000000),
                    avatarColor: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
                    createdAt: new Date().toISOString(),
                    stats: {
                        highestLevel: 0,
                        currentLevel: 1,
                        totalClears: 0,
                        gamesPlayed: 0,
                        bestCombo: 0,
                        totalDropsUsed: 0,
                    },
                    unlockedPowerups: ['rain'], // Rain is unlocked by default
                };

                set(state => ({
                    profiles: [...state.profiles, newProfile],
                    activeProfileId: newProfile.id,
                }));

                return newProfile;
            },

            selectProfile: (id: string) => {
                set({ activeProfileId: id });
            },

            deleteProfile: (id: string) => {
                set(state => ({
                    profiles: state.profiles.filter(p => p.id !== id),
                    activeProfileId: state.activeProfileId === id ? null : state.activeProfileId,
                }));
            },

            updateStats: (updates: Partial<PlayerProfile['stats']>) => {
                const { activeProfileId, profiles } = get();
                if (!activeProfileId) return;

                set({
                    profiles: profiles.map(p =>
                        p.id === activeProfileId
                            ? { ...p, stats: { ...p.stats, ...updates } }
                            : p
                    ),
                });
            },

            unlockPowerup: (powerupId: string) => {
                const { activeProfileId, profiles } = get();
                if (!activeProfileId) return;

                set({
                    profiles: profiles.map(p =>
                        p.id === activeProfileId && !p.unlockedPowerups.includes(powerupId)
                            ? { ...p, unlockedPowerups: [...p.unlockedPowerups, powerupId] }
                            : p
                    ),
                });
            },

            getActiveProfile: () => {
                const { activeProfileId, profiles } = get();
                return profiles.find(p => p.id === activeProfileId) || null;
            },
        }),
        {
            name: 'droplit-profiles', // localStorage key
        }
    )
);
