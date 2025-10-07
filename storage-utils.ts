/**
 * Storage Utilities
 * Safe localStorage operations with error handling
 */

/**
 * Save data to localStorage
 */
export function saveToStorage<T>(key: string, data: T): boolean {
  try {
    const json = JSON.stringify(data);
    localStorage.setItem(key, json);
    return true;
  } catch (error) {
    console.error(`Failed to save to localStorage [${key}]:`, error);
    return false;
  }
}

/**
 * Load data from localStorage
 */
export function loadFromStorage<T>(key: string): T | null {
  try {
    const json = localStorage.getItem(key);
    if (!json) return null;
    return JSON.parse(json) as T;
  } catch (error) {
    console.error(`Failed to load from localStorage [${key}]:`, error);
    return null;
  }
}

/**
 * Remove data from localStorage
 */
export function removeFromStorage(key: string): boolean {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Failed to remove from localStorage [${key}]:`, error);
    return false;
  }
}

/**
 * Clear all data from localStorage
 */
export function clearStorage(): boolean {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error('Failed to clear localStorage:', error);
    return false;
  }
}

/**
 * Check if localStorage is available
 */
export function isStorageAvailable(): boolean {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Get storage size in bytes
 */
export function getStorageSize(): number {
  let size = 0;
  for (const key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      size += localStorage[key].length + key.length;
    }
  }
  return size;
}

/**
 * Get storage size in human-readable format
 */
export function getStorageSizeFormatted(): string {
  const size = getStorageSize();
  if (size < 1024) {
    return `${size} bytes`;
  } else if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(2)} KB`;
  } else {
    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  }
}
