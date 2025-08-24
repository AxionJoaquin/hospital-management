function Dashboard({ currentView, onEditPatient }) {
  try {
    const [patients, setPatients] = React.useState([]);
    const [doctors, setDoctors] = React.useState([]);
    const [nurses, setNurses] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
      loadData();
    }, [currentView]);

    const loadData = async () => {
      setLoading(true);
      try {
        const [patientsData, doctorsData, nursesData] = await Promise.all([
          trickleListObjects('patient', 100, true),
          trickleListObjects('doctor', 100, true),
          trickleListObjects('nurse', 100, true)
        ]);

        setPatients(patientsData.items || []);
        setDoctors(doctorsData.items || []);
        setNurses(nursesData.items || []);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    const getStats = () => {
      return {
        totalPatients: patients.length,
        activePatients: patients.filter(p => p.objectData.status !== 'Dado de alta').length,
        availableDoctors: doctors.filter(d => d.objectData.availability === 'Disponible').length,
        availableNurses: nurses.filter(n => n.objectData.availability === 'Disponible').length
      };
    };

    const renderDashboard = () => {
      const stats = getStats();
      
      return (
        <div className="space-y-6">
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Dashboard</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="card">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <div className="icon-users text-xl text-blue-600"></div>
                </div>
                <div>
                  <p className="text-2xl font-bold text-[var(--text-primary)]">{stats.totalPatients}</p>
                  <p className="text-sm text-[var(--text-secondary)]">Total Pacientes</p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                  <div className="icon-activity text-xl text-green-600"></div>
                </div>
                <div>
                  <p className="text-2xl font-bold text-[var(--text-primary)]">{stats.activePatients}</p>
                  <p className="text-sm text-[var(--text-secondary)]">Pacientes Activos</p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                  <div className="icon-user-check text-xl text-purple-600"></div>
                </div>
                <div>
                  <p className="text-2xl font-bold text-[var(--text-primary)]">{stats.availableDoctors}</p>
                  <p className="text-sm text-[var(--text-secondary)]">Médicos Disponibles</p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-lg bg-pink-100 flex items-center justify-center">
                  <div className="icon-user-heart text-xl text-pink-600"></div>
                </div>
                <div>
                  <p className="text-2xl font-bold text-[var(--text-primary)]">{stats.availableNurses}</p>
                  <p className="text-sm text-[var(--text-secondary)]">Enfermeras Disponibles</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Pacientes Recientes</h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {patients.slice(0, 5).map(patient => (
                  <div key={patient.objectId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{patient.objectData.name}</p>
                      <p className="text-xs text-[var(--text-secondary)]">{patient.objectData.area}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      patient.objectData.status === 'Dado de alta' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {patient.objectData.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Personal Disponible</h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {[...doctors.filter(d => d.objectData.availability === 'Disponible'), 
                  ...nurses.filter(n => n.objectData.availability === 'Disponible')].slice(0, 5).map(staff => (
                  <div key={staff.objectId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{staff.objectData.name}</p>
                      <p className="text-xs text-[var(--text-secondary)]">{staff.objectData.area}</p>
                    </div>
                    <span className="status-available text-xs">
                      {staff.objectData.availability}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    };

    const renderPatients = () => (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Pacientes</h1>
          <p className="text-[var(--text-secondary)]">{patients.length} pacientes registrados</p>
        </div>

        {patients.length === 0 ? (
          <p className="text-[var(--text-secondary)]">No hay pacientes registrados.</p>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Edad
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Género
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Área
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha de Ingreso
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {patients.map(patient => (
                  <tr key={patient.objectId}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {patient.objectData.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {patient.objectData.age || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {patient.objectData.gender || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {patient.objectData.area || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        patient.objectData.status === 'Dado de alta' ? 'bg-green-100 text-green-800' : 
                        patient.objectData.status === 'Ingresado' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800' // Default for other statuses like 'En Observación'
                      }`}>
                        {patient.objectData.status || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {window.DatabaseUtils.formatDate(patient.objectData.admissionDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => onEditPatient(patient)}
                        className="text-[var(--primary-color)] hover:text-[var(--primary-color-dark)]"
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );

    const renderStaff = (staffType, title) => {
      const staffData = staffType === 'doctors' ? doctors : nurses;
      return (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">{title}</h1>
            <p className="text-[var(--text-secondary)]">{staffData.length} registrados</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {staffData.map(staff => (
              <StaffCard key={staff.objectId} staff={staff} type={staffType === 'doctors' ? 'doctor' : 'nurse'} />
            ))}
          </div>
        </div>
      );
    };

    const renderAreas = () => {
      const areas = ['Emergencias', 'Cardiología', 'Neurología', 'Pediatría', 'Cirugía', 'Medicina General'];
      
      return (
        <div className="space-y-6">
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Áreas del Hospital</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {areas.map(area => {
              const areaPatients = patients.filter(p => p.objectData.area === area);
              const areaDoctors = doctors.filter(d => d.objectData.area === area);
              const areaNurses = nurses.filter(n => n.objectData.area === area);
              
              return (
                <div key={area} className="card">
                  <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">{area}</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-[var(--text-secondary)]">Pacientes:</span>
                      <span className="font-medium">{areaPatients.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-[var(--text-secondary)]">Médicos:</span>
                      <span className="font-medium">{areaDoctors.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-[var(--text-secondary)]">Enfermeras:</span>
                      <span className="font-medium">{areaNurses.length}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    };

    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary-color)] mx-auto mb-4"></div>
            <p className="text-[var(--text-secondary)]">Cargando...</p>
          </div>
        </div>
      );
    }

    switch (currentView) {
      case 'patients':
        return renderPatients();
      case 'doctors':
        return renderStaff('doctors', 'Médicos');
      case 'nurses':
        return renderStaff('nurses', 'Enfermeras');
      case 'areas':
        return renderAreas();
      default:
        return renderDashboard();
    }
  } catch (error) {
    console.error('Dashboard component error:', error);
    return null;
  }
}