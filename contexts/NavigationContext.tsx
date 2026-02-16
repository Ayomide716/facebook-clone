import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type ViewState = 
  | { type: 'feed' } 
  | { type: 'profile', userId: string }
  | { type: 'watch' }
  | { type: 'marketplace' }
  | { type: 'groups' }
  | { type: 'gaming' }
  | { type: 'friends' }
  | { type: 'memories' }
  | { type: 'saved' }
  | { type: 'events' }
  | { type: 'generic', title: string }; // For placeholders

interface NavigationContextType {
  currentView: ViewState;
  navigateToProfile: (userId: string) => void;
  navigateToFeed: () => void;
  navigateToWatch: () => void;
  navigateToMarketplace: () => void;
  navigateToGroups: () => void;
  navigateToGaming: () => void;
  navigateToFriends: () => void;
  navigateToMemories: () => void;
  navigateToSaved: () => void;
  navigateToEvents: () => void;
  navigateToGeneric: (title: string) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initial state derived from URL
  const getInitialState = (): ViewState => {
      const params = new URLSearchParams(window.location.search);
      const view = params.get('view');
      const id = params.get('id');
      const title = params.get('title');

      if (view === 'profile' && id) return { type: 'profile', userId: id };
      if (view === 'watch') return { type: 'watch' };
      if (view === 'marketplace') return { type: 'marketplace' };
      if (view === 'groups') return { type: 'groups' };
      if (view === 'gaming') return { type: 'gaming' };
      if (view === 'friends') return { type: 'friends' };
      if (view === 'memories') return { type: 'memories' };
      if (view === 'saved') return { type: 'saved' };
      if (view === 'events') return { type: 'events' };
      if (view === 'generic' && title) return { type: 'generic', title };
      
      return { type: 'feed' };
  };

  const [currentView, setCurrentView] = useState<ViewState>(getInitialState);

  // Sync state on PopState (Back/Forward buttons)
  useEffect(() => {
    const handlePopState = () => {
        setCurrentView(getInitialState());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const updateUrl = (params: Record<string, string>) => {
      const url = new URL(window.location.href);
      url.search = ''; // Clear current params
      Object.entries(params).forEach(([key, value]) => {
          url.searchParams.set(key, value);
      });
      window.history.pushState({}, '', url.toString());
  };

  const navigateToProfile = (userId: string) => {
      const newState: ViewState = { type: 'profile', userId };
      setCurrentView(newState);
      updateUrl({ view: 'profile', id: userId });
  };

  const navigateToFeed = () => {
      setCurrentView({ type: 'feed' });
      updateUrl({}); // Clear params for home
  };

  const navigateToWatch = () => {
      setCurrentView({ type: 'watch' });
      updateUrl({ view: 'watch' });
  };

  const navigateToMarketplace = () => {
      setCurrentView({ type: 'marketplace' });
      updateUrl({ view: 'marketplace' });
  };

  const navigateToGroups = () => {
      setCurrentView({ type: 'groups' });
      updateUrl({ view: 'groups' });
  };

  const navigateToGaming = () => {
      setCurrentView({ type: 'gaming' });
      updateUrl({ view: 'gaming' });
  };

  const navigateToFriends = () => {
      setCurrentView({ type: 'friends' });
      updateUrl({ view: 'friends' });
  };

  const navigateToMemories = () => {
      setCurrentView({ type: 'memories' });
      updateUrl({ view: 'memories' });
  };

  const navigateToSaved = () => {
      setCurrentView({ type: 'saved' });
      updateUrl({ view: 'saved' });
  };

  const navigateToEvents = () => {
      setCurrentView({ type: 'events' });
      updateUrl({ view: 'events' });
  };

  const navigateToGeneric = (title: string) => {
      setCurrentView({ type: 'generic', title });
      updateUrl({ view: 'generic', title });
  };

  return (
    <NavigationContext.Provider value={{ 
      currentView, 
      navigateToProfile, 
      navigateToFeed,
      navigateToWatch,
      navigateToMarketplace,
      navigateToGroups,
      navigateToGaming,
      navigateToFriends,
      navigateToMemories,
      navigateToSaved,
      navigateToEvents,
      navigateToGeneric
    }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) throw new Error('useNavigation must be used within a NavigationProvider');
  return context;
};