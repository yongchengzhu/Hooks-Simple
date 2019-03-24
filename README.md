# Hooks-Simple

A react application built to understand hooks in react 16.



## Timeline / Notes

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

7. First thing to do, render the two buttons inside of App.

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

   

