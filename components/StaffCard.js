function StaffCard({ staff, type }) {
  try {
    const getAvailabilityColor = (availability) => {
      switch (availability) {
        case 'Disponible':
          return 'status-available';
        case 'Ocupado':
        case 'Ocupada':
        case 'En cirugía':
        case 'En ronda':
          return 'status-busy';
        default:
          return 'status-inactive';
      }
    };

    const getShiftColor = (shift) => {
      switch (shift) {
        case 'Mañana':
          return 'bg-yellow-100 text-yellow-800';
        case 'Tarde':
          return 'bg-orange-100 text-orange-800';
        case 'Noche':
          return 'bg-purple-100 text-purple-800';
        case '24 horas':
          return 'bg-blue-100 text-blue-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    };

    return (
      <div className="card hover:shadow-lg transition-shadow duration-200" data-name="staff-card" data-file="components/StaffCard.js">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-1">
              {staff.objectData.name || 'Sin nombre'}
            </h3>
            {type === 'doctor' && staff.objectData.specialty && (
              <p className="text-sm text-[var(--text-secondary)]">
                {staff.objectData.specialty}
              </p>
            )}
          </div>
          <span className={getAvailabilityColor(staff.objectData.availability)}>
            {staff.objectData.availability || 'Sin estado'}
          </span>
        </div>

        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <div className="icon-phone text-sm text-[var(--text-secondary)]"></div>
            <span className="text-sm">{staff.objectData.phone || 'Sin teléfono'}</span>
          </div>

          <div className="flex items-center justify-between">
            {staff.objectData.area && (
              <span className="area-badge">{staff.objectData.area}</span>
            )}
            {staff.objectData.shift && (
              <span className={`px-2 py-1 rounded-full text-sm font-medium ${getShiftColor(staff.objectData.shift)}`}>
                {staff.objectData.shift}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('StaffCard component error:', error);
    return null;
  }
}