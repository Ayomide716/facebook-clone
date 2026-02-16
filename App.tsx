import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Feed from './components/Feed';
import Rightbar from './components/Rightbar';
import Profile from './components/Profile';
import LoginPage from './components/LoginPage';
import CallOverlay from './components/CallOverlay';
import ChatWindow from './components/ChatWindow';
import Watch from './components/Watch';
import Marketplace from './components/Marketplace';
import Groups from './components/Groups';
import Events from './components/Events';
import Saved from './components/Saved';
import Memories from './components/Memories';
import Gaming from './components/Gaming';
import Friends from './components/Friends';
import { NavigationProvider, useNavigation } from './contexts/NavigationContext';
import { DataProvider, useData } from './contexts/DataContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CallProvider } from './contexts/CallContext';
import { MessageProvider } from './contexts/MessageContext';
import { Home, MonitorPlay, Store, Users, Gamepad2, Bell, Layout } from 'lucide-react';

// Generic placeholder for pages not yet fully implemented
const GenericPage = ({ title }: { title: string }) => (
    <div className="flex-1 py-10 px-4 flex flex-col items-center justify-center text-gray-500">
        <div className="bg-gray-200 p-6 rounded-full mb-4">
            <Layout className="w-12 h-12" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <p className="mt-2 text-center max-w-md">This page is currently under construction. Check back later for updates on {title}.</p>
    </div>
);

const MobileNav: React.FC = () => {
  const { 
    currentView,
    navigateToFeed, 
    navigateToWatch, 
    navigateToMarketplace, 
    navigateToGroups, 
    navigateToGaming 
  } = useNavigation();
  
  const isActive = (type: string) => currentView.type === type;

  return (
    <div className="md:hidden fixed bottom-0 w-full bg-white border-t border-gray-300 h-14 flex items-center justify-around z-50 pb-safe shadow-lg">
      <div onClick={navigateToFeed} className={`flex flex-col items-center justify-center w-full h-full cursor-pointer active:scale-95 transition-transform ${isActive('feed') ? 'text-blue-600' : 'text-gray-500'}`}>
        <Home className="w-6 h-6" />
      </div>
      <div onClick={navigateToWatch} className={`flex flex-col items-center justify-center w-full h-full cursor-pointer active:scale-95 transition-transform ${isActive('watch') ? 'text-blue-600' : 'text-gray-500'}`}>
        <MonitorPlay className="w-6 h-6" />
      </div>
      <div onClick={navigateToMarketplace} className={`flex flex-col items-center justify-center w-full h-full cursor-pointer active:scale-95 transition-transform ${isActive('marketplace') ? 'text-blue-600' : 'text-gray-500'}`}>
        <Store className="w-6 h-6" />
      </div>
      <div onClick={navigateToGroups} className={`flex flex-col items-center justify-center w-full h-full cursor-pointer active:scale-95 transition-transform ${isActive('groups') ? 'text-blue-600' : 'text-gray-500'}`}>
        <Users className="w-6 h-6" />
      </div>
       <div onClick={navigateToGaming} className={`flex flex-col items-center justify-center w-full h-full cursor-pointer active:scale-95 transition-transform ${isActive('gaming') ? 'text-blue-600' : 'text-gray-500'}`}>
        <Gamepad2 className="w-6 h-6" />
      </div>
    </div>
  );
};

const MainLayout: React.FC = () => {
  const { currentView } = useNavigation();
  const { currentUser, getUser } = useData();

  const renderContent = () => {
    switch (currentView.type) {
        case 'profile':
            const profileUser = currentView.userId === currentUser.id ? currentUser : getUser(currentView.userId);
            
            if (!profileUser) return <div className="p-8 text-center">User not found</div>;

            return (
                <Profile 
                    user={profileUser}
                />
            );
        case 'watch':
            return <Watch />;
        case 'marketplace':
            return <Marketplace />;
        case 'groups':
            return <Groups />;
        case 'friends':
            return <Friends />;
        case 'gaming':
            return <Gaming />;
        case 'memories':
             return <Memories />;
        case 'saved':
             return <Saved />;
        case 'events':
             return <Events />;
        case 'generic':
             return <GenericPage title={currentView.title} />;
        case 'feed':
        default:
            return <Feed />;
    }
  };

  return (
    <div className="bg-[#F0F2F5] min-h-screen flex flex-col">
      <CallOverlay />
      <Navbar />
      
      <div className="flex flex-1 justify-center overflow-hidden relative w-full max-w-[1920px] mx-auto">
        <Sidebar />
        <div className="flex-1 flex justify-center w-full min-w-0">
             {renderContent()}
        </div>
        <Rightbar />
      </div>
      
      <ChatWindow />
      <MobileNav />
    </div>
  );
};

// Root Component that decides between Login and Main Layout
const AppContent: React.FC = () => {
  const { user } = useAuth();
  
  if (!user) {
    return <LoginPage />;
  }

  return (
    <NavigationProvider>
      <DataProvider>
        <CallProvider>
            <MessageProvider>
                <MainLayout />
            </MessageProvider>
        </CallProvider>
      </DataProvider>
    </NavigationProvider>
  );
}

function App() {
  return (
    <AuthProvider>
        <AppContent />
    </AuthProvider>
  );
}

export default App;