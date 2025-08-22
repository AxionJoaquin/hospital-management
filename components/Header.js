function Header() {
  try {
    return (
      <header className="bg-white shadow-sm border-b border-[var(--border-color)]" data-name="header" data-file="components/Header.js">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-[var(--primary-color)] flex items-center justify-center">
                <div className="icon-heart-pulse text-xl text-white"></div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-[var(--text-primary)]">Hospital San Rafael</h1>
                <p className="text-sm text-[var(--text-secondary)]">Sistema de Gestión</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-[var(--text-primary)]">Dr. Admin</p>
                <p className="text-xs text-[var(--text-secondary)]">Administrador</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-[var(--secondary-color)] flex items-center justify-center">
                <div className="icon-user text-lg text-[var(--primary-color)]"></div>
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  } catch (error) {
    console.error('Header component error:', error);
    return null;
  }
}