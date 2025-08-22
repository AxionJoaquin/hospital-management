function Sidebar({ currentView, onViewChange, onAddPatient }) {
  try {
    const menuItems = [
      { id: 'dashboard', label: 'Dashboard', icon: 'layout-dashboard' },
      { id: 'patients', label: 'Pacientes', icon: 'users' },
      { id: 'doctors', label: 'Médicos', icon: 'user-check' },
      { id: 'nurses', label: 'Enfermeras', icon: 'user-heart' },
      { id: 'areas', label: 'Áreas', icon: 'building' }
    ];

    return (
      <aside className="w-64 bg-white shadow-sm border-r border-[var(--border-color)] min-h-screen" data-name="sidebar" data-file="components/Sidebar.js">
        <div className="p-6">
          <button 
            onClick={onAddPatient}
            className="btn-primary w-full mb-6 flex items-center justify-center space-x-2"
          >
            <div className="icon-plus text-lg"></div>
            <span>Nuevo Paciente</span>
          </button>
          
          <nav className="space-y-2">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                  currentView === item.id 
                    ? 'bg-[var(--primary-color)] text-white' 
                    : 'text-[var(--text-secondary)] hover:bg-[var(--secondary-color)] hover:text-[var(--text-primary)]'
                }`}
              >
                <div className={`icon-${item.icon} text-lg`}></div>
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </aside>
    );
  } catch (error) {
    console.error('Sidebar component error:', error);
    return null;
  }
}