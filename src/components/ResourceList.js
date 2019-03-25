import React from 'react';
import useResources from './useResources';

const ResourceList = ({ resource }) => {
  // const [resources, setResources] = useState([]);

  // const fetchResource = async (resource) => {
  //   const response = await axios.get(`http://jsonplaceholder.typicode.com/${resource}`);
  
  //   setResources(response.data);
  // }

  // useEffect(() => {
  //   // fetchResource(resource)
  //   (async () => {
  //     const response = await axios.get(`http://jsonplaceholder.typicode.com/${resource}`);
      
  //     setResources(response.data);
  //   })();
  // }, [resource])

  const resources = useResources(resource);

  return (
    <ul>
      {resources.map(record =>
        <li key={record.id}>{record.title}</li>
      )}
    </ul>
  );
}

export default ResourceList;