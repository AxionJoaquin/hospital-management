class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Algo salió mal</h1>
            <p className="text-gray-600 mb-4">Lo sentimos, ocurrió un error inesperado.</p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Recargar Página
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  try {
    const [currentView, setCurrentView] = React.useState('dashboard');
    const [showPatientForm, setShowPatientForm] = React.useState(false);
    const [selectedPatient, setSelectedPatient] = React.useState(null);

    const handleViewChange = (view) => {
      setCurrentView(view);
      setShowPatientForm(false);
      setSelectedPatient(null);
    };

    const handleAddPatient = () => {
      setShowPatientForm(true);
      setSelectedPatient(null);
    };

    const handleEditPatient = (patient) => {
      setSelectedPatient(patient);
      setShowPatientForm(true);
    };

    const handleCloseForm = () => {
      setShowPatientForm(false);
      setSelectedPatient(null);
    };

    return (
      <div className="min-h-screen bg-gray-50" data-name="app" data-file="app.js">
        <Header />
        <div className="flex">
          <Sidebar 
            currentView={currentView} 
            onViewChange={handleViewChange}
            onAddPatient={handleAddPatient}
          />
          <main className="flex-1 p-6">
            <Dashboard 
              currentView={currentView}
              onEditPatient={handleEditPatient}
            />
          </main>
        </div>
        
        {showPatientForm && (
          <PatientForm 
            patient={selectedPatient}
            onClose={handleCloseForm}
          />
        )}
      </div>
    );
  } catch (error) {
    console.error('App component error:', error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);