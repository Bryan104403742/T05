// Simple CSV loader using d3.csv
// Returns a Promise resolving to an array of row objects
function loadCSVData(filename) {
  // try to load from a few common locations
  const tryPaths = [`data_set/${filename}`, `data set/${filename}`, `${filename}`];
  const tryFetch = async () => {
    for (const p of tryPaths) {
      try {
        const data = await d3.csv(p);
        if (data && data.length) return data;
      } catch (e) {
        // continue trying other paths
      }
    }
    // final attempt: try direct filename (already in list) - if fails, throw
    throw new Error(`Could not load CSV '${filename}'. Tried: ${tryPaths.join(', ')}`);
  };
  return tryFetch();
}

// expose globally for chart scripts
window.loadCSVData = loadCSVData;
