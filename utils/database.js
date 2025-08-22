// Database utility functions are available globally
// The following functions are imported by default:
// - trickleCreateObject
// - trickleUpdateObject  
// - trickleGetObject
// - trickleListObjects
// - trickleDeleteObject

// Additional utility functions for the hospital management system
const DatabaseUtils = {
  // Format date for display
  formatDate: (dateString) => {
    if (!dateString) return 'No especificada';
    return new Date(dateString).toLocaleDateString('es-ES');
  },

  // Get patients by area
  getPatientsByArea: async (area) => {
    try {
      const response = await trickleListObjects('patient', 100, true);
      return response.items.filter(patient => patient.objectData.area === area);
    } catch (error) {
      console.error('Error fetching patients by area:', error);
      return [];
    }
  },

  // Get available staff by type and area
  getAvailableStaff: async (type, area = null) => {
    try {
      const response = await trickleListObjects(type, 100, true);
      let staff = response.items.filter(s => s.objectData.availability === 'Disponible');
      
      if (area) {
        staff = staff.filter(s => s.objectData.area === area);
      }
      
      return staff;
    } catch (error) {
      console.error(`Error fetching available ${type}:`, error);
      return [];
    }
  },

  // Get statistics
  getHospitalStats: async () => {
    try {
      const [patientsData, doctorsData, nursesData] = await Promise.all([
        trickleListObjects('patient', 100, true),
        trickleListObjects('doctor', 100, true),
        trickleListObjects('nurse', 100, true)
      ]);

      const patients = patientsData.items || [];
      const doctors = doctorsData.items || [];
      const nurses = nursesData.items || [];

      return {
        patients: {
          total: patients.length,
          active: patients.filter(p => p.objectData.status !== 'Dado de alta').length,
          byArea: patients.reduce((acc, p) => {
            acc[p.objectData.area] = (acc[p.objectData.area] || 0) + 1;
            return acc;
          }, {})
        },
        doctors: {
          total: doctors.length,
          available: doctors.filter(d => d.objectData.availability === 'Disponible').length
        },
        nurses: {
          total: nurses.length,
          available: nurses.filter(n => n.objectData.availability === 'Disponible').length
        }
      };
    } catch (error) {
      console.error('Error fetching hospital stats:', error);
      return null;
    }
  }
};

// Make utilities available globally
window.DatabaseUtils = DatabaseUtils;