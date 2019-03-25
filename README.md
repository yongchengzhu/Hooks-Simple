# Hooks-Simple

A react application built to understand hooks in react 16.



## Timeline / Notes

### Contents

[Initial Setup and Design](#initial-setup-and-design)

[Class Component App](#class-component-app)

[App Refactored](#app-refactored)

[Class Component ResourceList](#class-component-resourcelist)

[ResourceList Refactored](#resource-list-refactored)



### Initial Setup and Design

1. Generate the react application,

   `create-react-app hooks-simple`

2. Delete all the files inside of *src* directory.

3. Create `index.js`.

   ```jsx
   import React from 'react';
   import ReactDOM from 'react-dom';
   import App from './components/App';
   
   ReactDOM.render(<App />, document.querySelector('#root'));
   ```

4. Create the App component inside `src/components/App.js`

   ```jsx
   import React from 'react';
   
   class App extends React.Component {
     render () {
       return <div>App</div>;
     }
   }
   
   export default App;
   ```

5. Run the application.

   `npm start`

   Should see the text 'App' in the browser.

6. **Design:** We have two components, App and ResourceList. App has two buttons 'Posts' and 'Todos', and the ResourceList will render the title of the '/posts' and 'todos' from jsonplaceholder api.

### Class Component App

1. First thing to do, render the two buttons inside of App.

   ```jsx
   render () {
     return (
       <div>
         <div>
           <button>Posts</button>
           <button>Todos</button>
         </div>
       </div>
     );
   }
   ```

   To print out the information based on whichever button the user has clicked on, we need a component-level state object.

   ```jsx
   state = { resource: 'posts' };
   ```

   For now, let's also print out the current resource at the bottom of our buttons to see if we can make any changes to it when we click on the button.

   ```jsx
   render () {
     return (
       <div>
         <div>
           <button onClick={() => this.setState({resource: 'posts'})}>Posts</button>
           <button onClick={() => this.setState({resource: 'todos'})}>Todos</button>
         </div>
         {this.state.resource}
       </div>
     );
   }
   ```

### App Refactored

| Name       | Goal                                                         |
| ---------- | ------------------------------------------------------------ |
| useState   | Allows a functional component to use component.              |
| useEffect  | Allows a functional component to use 'lifecycle methods'.    |
| useContext | Allows a functional component to use the context system.     |
| useRef     | Allows a functional component to use the ref system.         |
| useReducer | Allows a functional component to store data through a 'reducer'. |

1. For now, we can make use of the useState function inside the App component.

   ```jsx
   import { useState } from 'react';
   ```

2. Refactor the App as a functional component.

   ```jsx
   const App = () => {
     const [resource, setResource] = useState('posts');
   
     return (
       <div>
         <div>
           <button onClick={() => setResource('posts')}>Posts</button>
           <button onClick={() => setResource('todos')}>Todos</button>
         </div>
         {resource}
       </div>
     );
   }
   
   export default App;
   ```

   The general structure for the useState hook:

   `const [currentValue, setCurrentValue] = useState(initialValue)`

   **currentValue:** contains the present value of this piece of state.

   **setCurrentValue:** function to call when we want to update our state (and rerender).

   **useState:** function from React.

   **initialValue:** starting value for this piece of state, similar to when we initialized our object.

   Notice how in class-components, we make use of an object to keep track of the states. And in functional-components all the states separated individually.

### Class Component ResourceList

3. Create a new component ResourceList.

   ```jsx
   import React from 'react';
   
   class ResourceList extends React.Component {
     render() {
       return <div></div>;
     }
   }
   
   export default ResourceList;
   ```

4. Inisde App, pass 'resource' down to ResourceList as a prop.

   ```jsx
   import ResourceList from './ResourceList';
   
   const App = () => {
     const [resource, setResource] = useState('posts');
   
     return (
       <div>
         <div>
           <button onClick={() => setResource('posts')}>Posts</button>
           <button onClick={() => setResource('todos')}>Todos</button>
         </div>
         <ResourceList resource={resource} />
       </div>
     );
   }
   ```

5. Back inside ResourceList, let's test if we can print out the currently selected resource inside here.

   ```jsx
   return <div>{this.props.resource}</div>;
   ```

   So far, so good.

6. Inside the ResourceList component, let's make use of the currently selected resource to make an api call to jsonplaceholder with axios.

   Install axios.

   `npm install --save axios`

   Inside ResourceList,

   ```jsx
   import axios from 'axios';
   ```

   The question now is, when do we want to make the GET request to jsonplaceholder? We probably want to make it as soon as this component first renders on the screen.

   ```jsx
   class ResourceList extends React.Component {
     componentDidMount() {
       axios.get(`http://jsonplaceholder.typicode.com/${this.props.resource}`);
     }
   }
   ```

   To find out if our GET request was successful, check the network tab in chrome.

7. Now, we need to somehow get ResourceList to re-render itself after it has successfully made the GET request. Recall whenever we want to re-render a component, we always make use of **state**. For now, we are going to create a state object to store the response from the GET request and print out the length of the data. (There should be 100 posts and 200 todos.)

   ```jsx
   class ResourceList extends React.Component {
     state = { resources: [] };
   
     async componentDidMount() {
       const response = await axios.get(`http://jsonplaceholder.typicode.com/${this.props.resource}`);
     
       this.setState({ resources: response.data });
     }
   
     render() {
       return <div>{this.state.resources.length}</div>;
     }
   }
   ```

   **Problem:** Axios made a GET request to /posts but no matter how many times we click on 'todos' button, the GET request to /todos is not made.

   **Explanation:**

   ​	Step 1. App component created, initializes state 'resources' of 'posts'.

   ​	Step 2. App renders ResourceList.

   ​	Step 3. ResourceList's 'componentDidMount' called, fetches posts.

   ​	Step 4. Fetch completed, setState called, number of posts rendered.

   ​	Step 5. We click 'todos' button, App updates its state, re-renders itself *and* ResourceList.

   ​	Step 6. ResourceList was already ***mounted*** so, 'componentDidMount' is not called a second time!

   **Solution:** Make use of the lifecycle method 'componentDidUpdate'. So we might want to write something like this.

   ```jsx
     async componentDidUpdate() {
       const response = await axios.get(`http://jsonplaceholder.typicode.com/${this.props.resource}`);
     
       this.setState({ resources: response.data });   
     }
   ```

   **Follow-up Problem:** However, this is bad, because we have setState() inside of this lifecycle method. Which means, this component is updated and this lifecycle method will keep calling itself endlessly.

   **Solution:** We can make use of the 'prevProps' argument inside 'componentDidMount(prevProps)'. We can check if the prevProp changed, then make a request. However, if it didn't change then don't make a request.

   ```jsx
     async componentDidUpdate(prevProps) {
       if (prevProps.resource !== this.props.resource) {
         const response = await axios.get(`http://jsonplaceholder.typicode.com/${this.props.resource}`);
       
         this.setState({ resources: response.data });  
       }
     }
   ```

### ResourceList Refactored

1. Refactor ResourceList to a functional component.

   ```jsx
   import React from 'react';
   import axios from 'axios';
   
   const ResourceList = () => {
     const fetchResource = async () => {
       const response = await axios.get(`http://jsonplaceholder.typicode.com/${this.props.resource}`);
     
       this.setState({ resources: response.data });
     }
     
     return <div></div>;
   }
   
   export default ResourceList;
   ```

2. This component will use the 'useState' and 'useEffect' hooks.

   First, let's add the useState hook to create our state variable 'resources'.

   ```jsx
   import { useState } from 'react';
   
   const ResourceList = () => {
     const [resources, setResources] = useState([]);
     
     return <div>{resources.length}</div>;
   }
   ```

3. Recall that we passed a prop called 'resource' from App component. We want to make sure our functional class component has access to the prop.

   ```jsx
   const ResourceList = ({ resource }) => {
   }
   ```

   Now we want to make sure when ResourceList is first rendered, we want to fetch the list of 'posts' from the api server. And whenever 'resource' gets updated, we want to fetch new resources from the api server and re-render ResourceList. To do this, we can make use of the 'useEffect' hook. It is a combination of 'componentDidMount' and 'componentDidUpdate'.

   ```jsx
   const ResourceList = ({ resource }) => {
     const [resources, setResources] = useState([]);
   
     const fetchResource = async (resource) => {
       const response = await axios.get(`http://jsonplaceholder.typicode.com/${resource}`);
     
       setResources(response.data);
     }
   
     useEffect(() => {
       fetchResource(resource)
     }, [])
     
     return <div>{resources.length}</div>;
   }
   ```

   This code is equivalent to using 'componentDidMount' lifecycle method as before when ResourceList was a class. We still need to make sure fetchResource gets called again when 'resource' is updated in the App component.

4. Inside ResouceList, we want to fetch data from jsonplaceholder when current resource is changed. The only change we have to add, is to assign 'prop.resource'  as an element in the second argument of useEffect().

   ```jsx
     useEffect(() => {
       fetchResource(resource)
     }, [resource])
   ```

   **Explanation**:

     We are calling useEffect hook method every time ResourceList is re-rendered. So, we are recreating the array in the second argument, or possible new values into the array. In our case, if 'prop.resource' is different, useEffect()  is going to be called and fetch data from jsonplaceholder again.

   **Some cases:**

   1. If second argument is not provided, then useEffect will call itself endlessly. (BAD)

   2. If second argument is provided as an empty array, then useEffect will only be called once when the component is render. (Identical to componentDidMount.)

   3. If the second argument is provided as an array with a constant value, then it won't be called the second time, since the element cannot never change.

   4. If the second argument is provided as an array with an element that's an object, it will be called the second because a new object will be evaluated as a different element even if the prop is same.

   **Question**:

     Why didn't we write the fetchResource logic directly inside the useEffect callback function and make the function async?

   **Answer**:

     We will get an error that tells us that useEffect does not accept any async functions.

     Example:

     ```jsx
     useEffect(async (resource) => {
       const response = await axios.get(`http://jsonplaceholder.typicode.com/${resource}`);
   
       setResources(response.data);
     }, [resource])
     ```

      Note: actually, we don't need 'resource' as a parameter, because the function can get access to prop.

   **Alternative:**

     We can pass an async function right inside of the useEffect callback function, and invoke the async function immediately by a second pair of paranthesis.

     ```jsx
     useEffect(() => {
       // fetchResource(resource)
       (async () => {
         const response = await axios.get(`http://jsonplaceholder.typicode.com/${resource}`);
         setResources(response.data);
       })();
     }, [resource])
     ```

5. Finally, to render out the titles of the resources

   ```jsx
     return (
       <ul>
         {resources.map(record =>
           <li key={record.id}>{record.title}</li>
         )}
       </ul>
     );
   ```

   

