
import React, { useState } from 'react';
import { useData } from '../DataContext';
import { CheckCircle2, XCircle, RefreshCw, Globe, CreditCard, Mail, Wrench, Key, DownloadCloud } from 'lucide-react';

const Integrations: React.FC = () => {
  const { integrations, toggleIntegration, syncChannel } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<string | null>(null);
  const [mockKey, setMockKey] = useState('');
  const [isSyncing, setIsSyncing] = useState<string | null>(null);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'airbnb': return <Globe size={24} />;
      case 'booking': return <Globe size={24} />;
      case 'stripe': return <CreditCard size={24} />;
      case 'mailchimp': return <Mail size={24} />;
      case 'quickbooks': return <Wrench size={24} />;
      default: return <Globe size={24} />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Connected': return <span className="px-2.5 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-bold flex items-center"><CheckCircle2 size={12} className="mr-1" /> Connected</span>;
      case 'Syncing': return <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center animate-pulse"><RefreshCw size={12} className="mr-1 animate-spin" /> Syncing</span>;
      case 'Error': return <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-bold flex items-center"><XCircle size={12} className="mr-1" /> Error</span>;
      default: return <span className="px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-bold">Disconnected</span>;
    }
  };

  const handleConnectClick = (id: string) => {
    const integration = integrations.find(i => i.id === id);
    if (integration?.status === 'Connected') {
        // Disconnect logic
        toggleIntegration(id, 'Disconnected');
    } else {
        // Open modal to connect
        setSelectedIntegration(id);
        setMockKey('');
        setIsModalOpen(true);
    }
  };

  const handleSync = async (name: string) => {
      setIsSyncing(name);
      try {
          await syncChannel(name);
      } catch (error) {
          console.error("Sync failed", error);
      } finally {
          setIsSyncing(null);
      }
  };

  const handleConfirmConnect = () => {
    if (!selectedIntegration) return;
    
    // Simulate API call delay for connection
    setTimeout(() => {
        toggleIntegration(selectedIntegration, 'Connected');
        setIsModalOpen(false);
        setSelectedIntegration(null);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800">Integrations</h2>
        <p className="text-sm text-slate-500">Manage connections with third-party services.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((integration) => (
          <div key={integration.id} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${integration.status === 'Connected' ? 'bg-indigo-50 text-indigo-600' : 'bg-gray-50 text-slate-400'}`}>
                    {getIcon(integration.icon)}
                </div>
                {getStatusBadge(isSyncing === integration.name ? 'Syncing' : integration.status)}
            </div>
            
            <h3 className="font-bold text-slate-800 text-lg mb-1">{integration.name}</h3>
            <p className="text-sm text-slate-500 mb-6 h-10">{integration.description}</p>
            
            <div className="flex flex-col gap-3">
                {integration.lastSync && (
                    <p className="text-xs text-slate-400 flex items-center">
                        <RefreshCw size={10} className="mr-1" /> Last sync: {integration.lastSync}
                    </p>
                )}
                
                <div className="flex gap-2">
                    {integration.status === 'Connected' && integration.category === 'Channel' && (
                         <button 
                            onClick={() => handleSync(integration.name)}
                            disabled={isSyncing === integration.name}
                            className="flex-1 py-2.5 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-xl text-sm font-bold hover:bg-indigo-100 transition-all flex justify-center items-center"
                         >
                             {isSyncing === integration.name ? (
                                 <RefreshCw size={16} className="animate-spin" />
                             ) : (
                                 <><DownloadCloud size={16} className="mr-2" /> Sync</>
                             )}
                         </button>
                    )}
                    
                    <button 
                        onClick={() => handleConnectClick(integration.id)}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                            integration.status === 'Connected' 
                            ? 'border border-gray-200 text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200' 
                            : 'bg-slate-900 text-white hover:bg-slate-800 hover:shadow-lg w-full'
                        }`}
                    >
                        {integration.status === 'Connected' ? 'Disconnect' : 'Connect'}
                    </button>
                </div>
            </div>
          </div>
        ))}
      </div>

      {/* Connection Modal */}
      {isModalOpen && selectedIntegration && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-gray-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center">
                        <Key size={18} className="mr-2 text-indigo-600" />
                        Connect {integrations.find(i => i.id === selectedIntegration)?.name}
                    </h3>
                </div>
                <div className="p-6 space-y-4">
                    <p className="text-sm text-slate-500">
                        Please enter your API Key or Client ID to authorize the connection. 
                        <span className="block mt-1 text-xs text-indigo-600 cursor-pointer hover:underline">Where do I find this?</span>
                    </p>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">API Key / Token</label>
                        <input 
                            type="password" 
                            className="w-full bg-gray-50 border border-gray-200 text-slate-900 text-sm rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent block p-2.5"
                            placeholder="sk_live_..."
                            value={mockKey}
                            onChange={(e) => setMockKey(e.target.value)}
                        />
                    </div>
                </div>
                <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3">
                    <button 
                        onClick={() => setIsModalOpen(false)}
                        className="px-4 py-2 text-slate-600 hover:bg-white hover:text-slate-800 rounded-lg text-sm font-medium transition-all"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleConfirmConnect}
                        disabled={!mockKey}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 flex items-center min-w-[100px] justify-center"
                    >
                        Authorize
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Integrations;
