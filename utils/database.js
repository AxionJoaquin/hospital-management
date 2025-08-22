// Database utility functions are available globally
// The following functions are imported by default:
// - trickleCreateObject
// - trickleUpdateObject  
// - trickleGetObject
// - trickleListObjects
// - trickleDeleteObject

const DB_NAME = 'site.db';
const DB_VERSION = 1; // Increment this version if you change the schema (e.g., add new object stores)

let dbPromise = null;

/**
 * Opens the IndexedDB database and creates object stores if they don't exist.
 * Returns a promise that resolves with the database instance.
 */
function openDatabase() {
  if (dbPromise) {
    return dbPromise;
  }

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      // Create object stores for different data types if they don't exist
      if (!db.objectStoreNames.contains('patient')) {
        db.createObjectStore('patient', { keyPath: 'objectId' });
      }
      if (!db.objectStoreNames.contains('doctor')) {
        db.createObjectStore('doctor', { keyPath: 'objectId' });
      }
      if (!db.objectStoreNames.contains('nurse')) {
        db.createObjectStore('nurse', { keyPath: 'objectId' });
      }
      console.log('IndexedDB upgraded: object stores created/checked.');
    };

    request.onsuccess = (event) => {
      const db = event.target.result;
      console.log('IndexedDB opened successfully.');
      resolve(db);
    };

    request.onerror = (event) => {
      console.error('IndexedDB error:', event.target.error);
      reject(event.target.error);
    };
  });
  return dbPromise;
}

/**
 * Creates a new object in the specified object store.
 * @param {string} type - The type of object (e.g., 'patient', 'doctor', 'nurse').
 * @param {object} data - The data for the new object.
 * @returns {Promise<object>} The created object including its objectId.
 */
window.trickleCreateObject = async (type, data) => {
  const db = await openDatabase();
  const tx = db.transaction(type, 'readwrite');
  const store = tx.objectStore(type);

  const objectId = `obj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const objectToStore = {
    objectId,
    objectType: type,
    objectData: data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  return new Promise((resolve, reject) => {
    const request = store.add(objectToStore);
    request.onsuccess = () => {
      console.log(`Created ${type} with ID: ${objectId}`);
      resolve(objectToStore);
    };
    request.onerror = (event) => {
      console.error(`Error creating ${type}:`, event.target.error);
      reject(event.target.error);
    };
  });
};

/**
 * Updates an existing object in the specified object store.
 * @param {string} type - The type of object.
 * @param {string} objectId - The ID of the object to update.
 * @param {object} data - The data to merge into the existing object's objectData.
 * @returns {Promise<object>} The updated object.
 */
window.trickleUpdateObject = async (type, objectId, data) => {
  const db = await openDatabase();
  const tx = db.transaction(type, 'readwrite');
  const store = tx.objectStore(type);

  return new Promise((resolve, reject) => {
    const getRequest = store.get(objectId);
    getRequest.onsuccess = () => {
      const existingObject = getRequest.result;
      if (!existingObject) {
        reject(new Error(`${type} with ID ${objectId} not found.`));
        return;
      }
      
      const updatedObject = {
        ...existingObject,
        objectData: { ...existingObject.objectData, ...data },
        updatedAt: new Date().toISOString()
      };

      const putRequest = store.put(updatedObject);
      putRequest.onsuccess = () => {
        console.log(`Updated ${type} with ID: ${objectId}`);
        resolve(updatedObject);
      };
      putRequest.onerror = (event) => {
        console.error(`Error updating ${type}:`, event.target.error);
        reject(event.target.error);
      };
    };
    getRequest.onerror = (event) => {
      console.error(`Error getting ${type} for update:`, event.target.error);
      reject(event.target.error);
    };
  });
};

/**
 * Retrieves a single object by its ID from the specified object store.
 * @param {string} type - The type of object.
 * @param {string} objectId - The ID of the object to retrieve.
 * @returns {Promise<object|undefined>} The retrieved object or undefined if not found.
 */
window.trickleGetObject = async (type, objectId) => {
  const db = await openDatabase();
  const tx = db.transaction(type, 'readonly');
  const store = tx.objectStore(type);

  return new Promise((resolve, reject) => {
    const request = store.get(objectId);
    request.onsuccess = () => {
      resolve(request.result);
    };
    request.onerror = (event) => {
      console.error(`Error getting ${type}:`, event.target.error);
      reject(event.target.error);
    };
  });
};

/**
 * Lists objects from the specified object store.
 * @param {string} type - The type of objects to list.
 * @param {number} [limit] - Optional limit for the number of items to return.
 * @param {boolean} [includeObjectData=true] - Whether to include the full objectData. (Currently always returns full objects as per app's usage)
 * @returns {Promise<{items: object[]}>} An object containing an array of retrieved items.
 */
window.trickleListObjects = async (type, limit, includeObjectData = true) => {
  const db = await openDatabase();
  const tx = db.transaction(type, 'readonly');
  const store = tx.objectStore(type);

  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => {
      let items = request.result || [];
      
      // Apply limit if specified
      if (limit && items.length > limit) {
        items = items.slice(0, limit);
      }
      
      // The current application components expect the full object with objectData.
      // The `includeObjectData` flag is acknowledged but for current usage,
      // we provide the full object structure.
      resolve({ items: items });
    };
    request.onerror = (event) => {
      console.error(`Error listing ${type}:`, event.target.error);
      reject(event.target.error);
    };
  });
};

/**
 * Deletes an object by its ID from the specified object store.
 * @param {string} type - The type of object.
 * @param {string} objectId - The ID of the object to delete.
 * @returns {Promise<void>} A promise that resolves when the object is deleted.
 */
window.trickleDeleteObject = async (type, objectId) => {
  const db = await openDatabase();
  const tx = db.transaction(type, 'readwrite');
  const store = tx.objectStore(type);

  return new Promise((resolve, reject) => {
    const request = store.delete(objectId);
    request.onsuccess = () => {
      console.log(`Deleted ${type} with ID: ${objectId}`);
      resolve();
    };
    request.onerror = (event) => {
      console.error(`Error deleting ${type}:`, event.target.error);
      reject(event.target.error);
    };
  });
};


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