import { useState, useEffect } from 'react';
import axios from 'axios';

const useResources = (resource) => {
  const [resources, setResources] = useState([]);

  useEffect(() => {
    // fetchResource(resource)
    (async () => {
      const response = await axios.get(`http://jsonplaceholder.typicode.com/${resource}`);
      
      setResources(response.data);
    })();
  }, [resource])

  return resources;
}

export default useResources;