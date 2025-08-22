function PatientForm({ patient, onClose }) {
  try {
    const [formData, setFormData] = React.useState({
      name: patient?.objectData?.name || '',
      phone: patient?.objectData?.phone || '',
      locality: patient?.objectData?.locality || '',
      diagnosis: patient?.objectData?.diagnosis || '',
      doctor: patient?.objectData?.doctor || '',
      treatment: patient?.objectData?.treatment || '',
      admission_date: patient?.objectData?.admission_date || new Date().toISOString().split('T')[0],
      status: patient?.objectData?.status || 'Ingresado',
      area: patient?.objectData?.area || 'Emergencias'
    });

    const [loading, setLoading] = React.useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);

      try {
        if (patient) {
          await trickleUpdateObject('patient', patient.objectId, formData);
        } else {
          await trickleCreateObject('patient', formData);
        }
        onClose();
        window.location.reload();
      } catch (error) {
        alert('Error al guardar el paciente');
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" data-name="patient-form" data-file="components/PatientForm.js">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-[var(--text-primary)]">
                {patient ? 'Editar Paciente' : 'Nuevo Paciente'}
              </h2>
              <button
                onClick={onClose}
                className="p-1 hover:bg-[var(--secondary-color)] rounded"
              >
                <div className="icon-x text-lg text-[var(--text-secondary)]"></div>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    className="input-field"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                    Localidad
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.locality}
                    onChange={(e) => setFormData({...formData, locality: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                    Fecha de ingreso
                  </label>
                  <input
                    type="date"
                    className="input-field"
                    value={formData.admission_date}
                    onChange={(e) => setFormData({...formData, admission_date: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                    Estado
                  </label>
                  <select
                    className="input-field"
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="Ingresado">Ingresado</option>
                    <option value="En tratamiento">En tratamiento</option>
                    <option value="Dado de alta">Dado de alta</option>
                    <option value="En observación">En observación</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                    Área
                  </label>
                  <select
                    className="input-field"
                    value={formData.area}
                    onChange={(e) => setFormData({...formData, area: e.target.value})}
                  >
                    <option value="Emergencias">Emergencias</option>
                    <option value="Cardiología">Cardiología</option>
                    <option value="Neurología">Neurología</option>
                    <option value="Pediatría">Pediatría</option>
                    <option value="Cirugía">Cirugía</option>
                    <option value="Medicina General">Medicina General</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  Médico que atiende
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={formData.doctor}
                  onChange={(e) => setFormData({...formData, doctor: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  Diagnóstico
                </label>
                <textarea
                  className="input-field resize-none"
                  rows="3"
                  value={formData.diagnosis}
                  onChange={(e) => setFormData({...formData, diagnosis: e.target.value})}
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  Tratamiento
                </label>
                <textarea
                  className="input-field resize-none"
                  rows="3"
                  value={formData.treatment}
                  onChange={(e) => setFormData({...formData, treatment: e.target.value})}
                ></textarea>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-secondary"
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Guardando...' : (patient ? 'Actualizar' : 'Crear')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('PatientForm component error:', error);
    return null;
  }
}