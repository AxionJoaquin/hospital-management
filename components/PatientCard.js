function PatientCard({ patient, onEdit }) {
  try {
    const getStatusColor = (status) => {
      switch (status) {
        case 'Disponible':
        case 'Dado de alta':
          return 'status-available';
        case 'En tratamiento':
        case 'Ingresado':
          return 'status-busy';
        default:
          return 'status-inactive';
      }
    };

    const formatDate = (dateString) => {
      if (!dateString) return 'No especificada';
      return new Date(dateString).toLocaleDateString('es-ES');
    };

    return (
      <div className="card hover:shadow-lg transition-shadow duration-200" data-name="patient-card" data-file="components/PatientCard.js">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-1">
              {patient.objectData.name || 'Sin nombre'}
            </h3>
            <p className="text-sm text-[var(--text-secondary)]">
              {patient.objectData.locality || 'Sin localidad'}
            </p>
          </div>
          <div className="flex space-x-2">
            <span className={getStatusColor(patient.objectData.status)}>
              {patient.objectData.status || 'Sin estado'}
            </span>
            <button
              onClick={() => onEdit(patient)}
              className="p-1 hover:bg-[var(--secondary-color)] rounded"
            >
              <div className="icon-edit text-sm text-[var(--text-secondary)]"></div>
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <div className="icon-phone text-sm text-[var(--text-secondary)]"></div>
            <span className="text-sm">{patient.objectData.phone || 'Sin teléfono'}</span>
          </div>

          <div className="flex items-center space-x-2">
            <div className="icon-calendar text-sm text-[var(--text-secondary)]"></div>
            <span className="text-sm">Ingreso: {formatDate(patient.objectData.admission_date)}</span>
          </div>

          <div className="flex items-center space-x-2">
            <div className="icon-user-check text-sm text-[var(--text-secondary)]"></div>
            <span className="text-sm">{patient.objectData.doctor || 'Sin médico asignado'}</span>
          </div>

          {patient.objectData.area && (
            <span className="area-badge">{patient.objectData.area}</span>
          )}
        </div>

        {patient.objectData.diagnosis && (
          <div className="mt-4 pt-4 border-t border-[var(--border-color)]">
            <p className="text-sm text-[var(--text-secondary)] mb-2">Diagnóstico:</p>
            <p className="text-sm">{patient.objectData.diagnosis}</p>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('PatientCard component error:', error);
    return null;
  }
}