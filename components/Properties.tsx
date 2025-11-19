
import React, { useState, useMemo, useRef } from 'react';
import { 
  MapPin, User, Plus, Search, Filter, X, Home, Save, ChevronLeft, 
  FileText, Calendar, Wrench, DollarSign, Upload, Trash2, Download, Check
} from 'lucide-react';
import { useData } from '../DataContext';
import { Property, PropertyStatus, PropertyDocument } from '../types';
import { storageService } from '../services/storageService';

const Properties: React.FC = () => {
  const { properties, addProperty, bookings, tasks, documents, addDocument, deleteDocument } = useData();
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProp, setNewProp] = useState<Partial<Property>>({ status: PropertyStatus.ACTIVE, unitType: 'Studio' });
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'tasks' | 'documents'>('overview');

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [ownerFilter, setOwnerFilter] = useState<string>('All');
  const [typeFilter, setTypeFilter] = useState<string>('All');

  // Form styles
  const inputClass = "w-full bg-gray-50 border border-gray-200 text-slate-900 text-sm rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent block p-2.5 transition-all hover:bg-white";
  const labelClass = "block text-sm font-semibold text-slate-700 mb-1.5";

  // Derived Data
  const uniqueOwners = useMemo(() => Array.from(new Set(properties.map(p => p.ownerId))), [properties]);
  const uniqueUnitTypes = useMemo(() => Array.from(new Set(properties.map(p => p.unitType))), [properties]);

  const filteredProperties = properties.filter(prop => {
    const matchesSearch = 
      prop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prop.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prop.code.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || prop.status === statusFilter;
    const matchesOwner = ownerFilter === 'All' || prop.ownerId === ownerFilter;
    const matchesType = typeFilter === 'All' || prop.unitType === typeFilter;

    return matchesSearch && matchesStatus && matchesOwner && matchesType;
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProp.name || !newProp.address || !newProp.ownerId) return;
    
    addProperty({
        id: Date.now().toString(),
        name: newProp.name,
        address: newProp.address,
        code: newProp.code || 'NEW-001',
        status: newProp.status || PropertyStatus.ACTIVE,
        units: newProp.units || 1,
        ownerId: newProp.ownerId,
        pricePerNight: newProp.pricePerNight || 100,
        unitType: newProp.unitType || 'Studio',
        imageUrl: `https://picsum.photos/400/300?random=${Date.now()}`,
        amenities: ['Wifi', 'Kitchen'],
        description: 'Newly added property.'
    } as Property);
    setIsAddModalOpen(false);
    setNewProp({ status: PropertyStatus.ACTIVE, unitType: 'Studio' });
  };

  // --- Detail View Sub-components ---

  const PropertyOverview = ({ prop }: { prop: Property }) => (
    <div className="space-y-6 animate-in fade-in duration-300">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center space-x-3 mb-2">
                    <div className="p-2 bg-green-50 text-green-600 rounded-lg"><DollarSign size={20} /></div>
                    <span className="text-sm font-medium text-slate-500">Price / Night</span>
                </div>
                <p className="text-2xl font-bold text-slate-800">AED {prop.pricePerNight}</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center space-x-3 mb-2">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Home size={20} /></div>
                    <span className="text-sm font-medium text-slate-500">Unit Type</span>
                </div>
                <p className="text-2xl font-bold text-slate-800">{prop.unitType}</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                 <div className="flex items-center space-x-3 mb-2">
                    <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><User size={20} /></div>
                    <span className="text-sm font-medium text-slate-500">Owner</span>
                </div>
                <p className="text-2xl font-bold text-slate-800">{prop.ownerId}</p>
            </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Description</h3>
            <p className="text-slate-600 leading-relaxed">{prop.description || "No description provided."}</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Amenities</h3>
            <div className="flex flex-wrap gap-2">
                {prop.amenities?.map((am, idx) => (
                    <span key={idx} className="px-3 py-1 bg-gray-100 text-slate-600 rounded-full text-sm font-medium flex items-center">
                        <Check size={14} className="mr-1.5 text-green-500" /> {am}
                    </span>
                ))}
                {!prop.amenities?.length && <span className="text-slate-400 italic">No amenities listed.</span>}
            </div>
        </div>
    </div>
  );

  const PropertyDocuments = ({ prop }: { prop: Property }) => {
    const propDocs = documents.filter(d => d.propertyId === prop.id);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const file = files[0];
        setUploading(true);
        
        try {
            // Use Storage Service
            const result = await storageService.uploadFile(file);
            
            addDocument({
                id: `d-${Date.now()}`,
                propertyId: prop.id,
                name: result.name,
                type: file.type.includes('pdf') ? 'Contract' : file.type.includes('image') ? 'Photo' : 'Other',
                size: result.size,
                uploadDate: new Date().toISOString().split('T')[0],
                url: result.url
            });
        } catch (error) {
            console.error("Upload failed", error);
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = ''; // Reset input
        }
    };

    const handleDelete = async (doc: PropertyDocument) => {
        await storageService.deleteFile(doc.url);
        deleteDocument(doc.id);
    };

    return (
      <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-800">Documents & Files</h3>
              <div className="relative">
                  <input 
                    type="file" 
                    className="hidden" 
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                  />
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                      {uploading ? 'Uploading...' : <><Upload size={16} className="mr-2" /> Upload File</>}
                  </button>
              </div>
          </div>

          {propDocs.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                  <FileText size={48} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-slate-500">No documents uploaded for this property.</p>
              </div>
          ) : (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <table className="w-full text-sm text-left">
                      <thead className="bg-gray-50 text-slate-500 border-b border-gray-200">
                          <tr>
                              <th className="px-6 py-3">Name</th>
                              <th className="px-6 py-3">Type</th>
                              <th className="px-6 py-3">Date</th>
                              <th className="px-6 py-3">Size</th>
                              <th className="px-6 py-3 text-right">Actions</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                          {propDocs.map(doc => (
                              <tr key={doc.id} className="hover:bg-gray-50">
                                  <td className="px-6 py-4 font-medium text-slate-800 flex items-center">
                                      <FileText size={16} className="mr-2 text-indigo-500" /> 
                                      <a href={doc.url} target="_blank" rel="noopener noreferrer" className="hover:underline">{doc.name}</a>
                                  </td>
                                  <td className="px-6 py-4"><span className="px-2 py-1 bg-gray-100 rounded text-xs text-slate-600">{doc.type}</span></td>
                                  <td className="px-6 py-4 text-slate-500">{doc.uploadDate}</td>
                                  <td className="px-6 py-4 text-slate-500">{doc.size}</td>
                                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                                      <a href={doc.url} download className="text-indigo-600 hover:text-indigo-800 p-1"><Download size={16}/></a>
                                      <button onClick={() => handleDelete(doc)} className="text-red-400 hover:text-red-600 p-1"><Trash2 size={16}/></button>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          )}
      </div>
    );
  };

  const PropertyBookings = ({ prop }: { prop: Property }) => {
    const propBookings = bookings.filter(b => b.propertyId === prop.id);
    return (
        <div className="space-y-4 animate-in fade-in duration-300">
            <h3 className="text-lg font-bold text-slate-800">Recent Bookings</h3>
            {propBookings.length === 0 ? (
                <div className="p-8 text-center bg-gray-50 rounded-xl text-slate-500">No bookings found.</div>
            ) : (
                <div className="grid gap-4">
                    {propBookings.map(b => (
                        <div key={b.id} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-all">
                            <div>
                                <div className="font-bold text-slate-800">{b.guestName}</div>
                                <div className="text-sm text-slate-500">{b.checkIn} - {b.checkOut}</div>
                            </div>
                            <div className="text-right">
                                <div className={`text-xs font-bold px-2 py-1 rounded-full mb-1 inline-block ${
                                    b.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                }`}>{b.status}</div>
                                <div className="font-mono text-sm font-medium">AED {b.totalAmount}</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
  };

  const PropertyTasks = ({ prop }: { prop: Property }) => {
      const propTasks = tasks.filter(t => t.propertyId === prop.id);
      return (
          <div className="space-y-4 animate-in fade-in duration-300">
             <h3 className="text-lg font-bold text-slate-800">Maintenance & Cleaning</h3>
             {propTasks.length === 0 ? (
                  <div className="p-8 text-center bg-gray-50 rounded-xl text-slate-500">No active tasks.</div>
             ) : (
                 <div className="grid gap-4">
                    {propTasks.map(t => (
                        <div key={t.id} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl">
                            <div>
                                <div className="font-bold text-slate-800">{t.title}</div>
                                <div className="text-xs text-slate-500">{t.description}</div>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                t.type === 'Cleaning' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                            }`}>{t.type}</span>
                        </div>
                    ))}
                 </div>
             )}
          </div>
      );
  };

  // --- Main Render ---

  if (selectedProperty) {
    return (
        <div className="space-y-6">
            {/* Detail Header */}
            <button 
                onClick={() => setSelectedProperty(null)}
                className="flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors mb-2"
            >
                <ChevronLeft size={16} className="mr-1" /> Back to Properties
            </button>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="h-48 bg-gray-200 relative">
                    <img src={selectedProperty.imageUrl} alt={selectedProperty.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40"></div>
                    <div className="absolute bottom-0 left-0 p-6 text-white">
                        <h1 className="text-3xl font-bold">{selectedProperty.name}</h1>
                        <p className="opacity-90 flex items-center mt-1"><MapPin size={16} className="mr-1" /> {selectedProperty.address}</p>
                    </div>
                    <div className="absolute top-6 right-6">
                        <span className={`px-3 py-1 rounded-full text-sm font-bold bg-white/20 backdrop-blur-md text-white border border-white/30`}>
                            {selectedProperty.status}
                        </span>
                    </div>
                </div>
                
                <div className="border-b border-gray-200 px-6">
                    <nav className="flex space-x-8">
                        {[
                            { id: 'overview', label: 'Overview', icon: Home },
                            { id: 'bookings', label: 'Bookings', icon: Calendar },
                            { id: 'tasks', label: 'Tasks', icon: Wrench },
                            { id: 'documents', label: 'Documents', icon: FileText },
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`py-4 px-1 inline-flex items-center border-b-2 font-medium text-sm transition-colors ${
                                    activeTab === tab.id
                                    ? 'border-indigo-600 text-indigo-600'
                                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-gray-300'
                                }`}
                            >
                                <tab.icon size={16} className="mr-2" />
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="p-6 bg-gray-50 min-h-[400px]">
                    {activeTab === 'overview' && <PropertyOverview prop={selectedProperty} />}
                    {activeTab === 'bookings' && <PropertyBookings prop={selectedProperty} />}
                    {activeTab === 'tasks' && <PropertyTasks prop={selectedProperty} />}
                    {activeTab === 'documents' && <PropertyDocuments prop={selectedProperty} />}
                </div>
            </div>
        </div>
    );
  }

  // Grid View
  return (
    <div>
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
                <h2 className="text-xl font-bold text-slate-800">Properties</h2>
                <p className="text-sm text-slate-500">Manage your portfolio</p>
            </div>
            <button 
                onClick={() => setIsAddModalOpen(true)}
                className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 transition-all flex items-center w-fit"
            >
                <Plus size={18} className="mr-2" /> Add Property
            </button>
        </div>

        {/* Filters Toolbar */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm mb-8 flex flex-col lg:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Search property name, code, or address..." 
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm bg-gray-50 hover:bg-white transition-colors"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <div className="flex flex-wrap md:flex-nowrap gap-3 w-full lg:w-auto">
                <div className="relative w-full md:w-40 group">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 group-hover:text-indigo-500 transition-colors" size={16} />
                    <select 
                        className="w-full pl-10 pr-8 py-2.5 border border-gray-200 rounded-xl appearance-none focus:ring-2 focus:ring-indigo-500 outline-none text-sm bg-gray-50 hover:bg-white cursor-pointer transition-all font-medium text-slate-600"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="All">Status: All</option>
                        {Object.values(PropertyStatus).map(status => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>
                </div>
                <div className="relative w-full md:w-40 group">
                    <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 group-hover:text-indigo-500 transition-colors" size={16} />
                    <select 
                        className="w-full pl-10 pr-8 py-2.5 border border-gray-200 rounded-xl appearance-none focus:ring-2 focus:ring-indigo-500 outline-none text-sm bg-gray-50 hover:bg-white cursor-pointer transition-all font-medium text-slate-600"
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                    >
                        <option value="All">Type: All</option>
                        {uniqueUnitTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>
                <div className="relative w-full md:w-40 group">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 group-hover:text-indigo-500 transition-colors" size={16} />
                    <select 
                        className="w-full pl-10 pr-8 py-2.5 border border-gray-200 rounded-xl appearance-none focus:ring-2 focus:ring-indigo-500 outline-none text-sm bg-gray-50 hover:bg-white cursor-pointer transition-all font-medium text-slate-600"
                        value={ownerFilter}
                        onChange={(e) => setOwnerFilter(e.target.value)}
                    >
                        <option value="All">Owner: All</option>
                        {uniqueOwners.map(ownerId => (
                            <option key={ownerId} value={ownerId}>{ownerId}</option>
                        ))}
                    </select>
                </div>
                {(searchQuery || statusFilter !== 'All' || ownerFilter !== 'All' || typeFilter !== 'All') && (
                    <button 
                        onClick={() => { setSearchQuery(''); setStatusFilter('All'); setOwnerFilter('All'); setTypeFilter('All'); }}
                        className="px-3 py-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Clear Filters"
                    >
                        <X size={20} />
                    </button>
                )}
            </div>
        </div>

        {/* Grid */}
        {filteredProperties.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 border-dashed">
                <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <Search size={24} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">No properties found</h3>
                <p className="text-slate-500">Try adjusting your filters or search query.</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProperties.map((prop, idx) => (
                <div 
                    key={prop.id} 
                    data-aos="fade-up"
                    data-aos-delay={idx * 50}
                    onClick={() => setSelectedProperty(prop)}
                    className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col cursor-pointer"
                >
                    <div className="h-52 bg-gray-200 relative overflow-hidden">
                        <img src={prop.imageUrl} alt={prop.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm ${
                            prop.status === 'Active' ? 'bg-green-500/90 backdrop-blur-sm' : 'bg-orange-500/90 backdrop-blur-sm'
                        }`}>
                            {prop.status}
                        </span>
                        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-5 pt-12">
                            <div className="flex justify-between items-end">
                                <p className="text-white font-bold text-xl">AED {prop.pricePerNight}<span className="text-sm font-normal text-gray-200">/night</span></p>
                                <span className="text-xs bg-white/20 backdrop-blur-md text-white border border-white/30 px-2.5 py-1 rounded-lg font-medium">{prop.unitType}</span>
                            </div>
                        </div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-bold text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors">{prop.name}</h3>
                        </div>
                        <div className="flex items-center mb-4">
                           <span className="text-xs bg-gray-100 text-slate-500 px-2 py-0.5 rounded border border-gray-200 font-mono mr-2">{prop.code}</span>
                        </div>
                        <p className="text-slate-500 text-sm flex items-start mb-5 flex-1 leading-relaxed">
                            <MapPin size={16} className="mr-2 flex-shrink-0 mt-0.5 text-slate-400" /> {prop.address}
                        </p>
                        <div className="flex justify-between items-center border-t border-gray-50 pt-4 mt-auto">
                            <span className="text-xs font-medium text-slate-500 flex items-center bg-slate-50 px-2 py-1 rounded-lg">
                                <User size={12} className="mr-1.5"/> {prop.ownerId}
                            </span>
                            <span className="text-indigo-600 text-sm font-bold hover:text-indigo-800 transition-colors">View Details</span>
                        </div>
                    </div>
                </div>
                ))}
            </div>
        )}

        {/* Add Modal */}
        {isAddModalOpen && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-gray-100 overflow-hidden transform transition-all scale-100">
                    <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <h3 className="text-lg font-bold text-slate-800">Add New Property</h3>
                        <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50">
                            <X size={20} />
                        </button>
                    </div>
                    <form onSubmit={handleAdd} className="p-6 space-y-5">
                        <div>
                            <label className={labelClass}>Property Name</label>
                            <input 
                                placeholder="e.g. Sunset Villa" 
                                className={inputClass}
                                onChange={e => setNewProp({...newProp, name: e.target.value})}
                                required
                            />
                        </div>
                        
                        <div>
                            <label className={labelClass}>Address</label>
                            <input 
                                placeholder="123 Ocean Drive..." 
                                className={inputClass}
                                onChange={e => setNewProp({...newProp, address: e.target.value})}
                                required
                            />
                        </div>

                        <div>
                            <label className={labelClass}>Owner ID</label>
                            <input 
                                placeholder="e.g., owner1" 
                                className={inputClass}
                                onChange={e => setNewProp({...newProp, ownerId: e.target.value})}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-5">
                             <div>
                                <label className={labelClass}>Unit Type</label>
                                <div className="relative">
                                    <select 
                                        className={`${inputClass} appearance-none`}
                                        onChange={e => setNewProp({...newProp, unitType: e.target.value})}
                                        value={newProp.unitType}
                                    >
                                        <option value="Studio">Studio</option>
                                        <option value="1BR">1BR</option>
                                        <option value="2BR">2BR</option>
                                        <option value="Loft">Loft</option>
                                        <option value="Villa">Villa</option>
                                        <option value="Cabin">Cabin</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                                        <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                                    </div>
                                </div>
                             </div>
                             <div>
                                <label className={labelClass}>Price per Night (AED)</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="text-gray-500 text-sm">AED</span>
                                    </div>
                                    <input 
                                        type="number"
                                        placeholder="100" 
                                        className={`${inputClass} pl-10`}
                                        onChange={e => setNewProp({...newProp, pricePerNight: Number(e.target.value)})}
                                    />
                                </div>
                             </div>
                        </div>
                        
                        <div className="pt-2">
                            <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-all hover:shadow-lg hover:shadow-indigo-200 flex justify-center items-center">
                                <Save size={18} className="mr-2" /> Save Property
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}
    </div>
  );
};

export default Properties;
