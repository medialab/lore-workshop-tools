import './App.css';
import { useEffect, useState } from 'react';
import Measure from 'react-measure';


function App() {
  const [dimensions, setDimensions] = useState();
  return (
    <Measure
      bounds
      onResize={contentRect => {
        setDimensions(contentRect.bounds);
      }}
    >
      {({ measureRef }) => (
        <div className="App" ref={measureRef}>
          <header>
            <h3>
              Lore workshop tools
            </h3>
          </header>

        </div>
      )
      }
    </Measure>
  );
}

export default App;
