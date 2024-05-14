import React from 'react';
import Test from './components/Test';
import preguntas from './components/preguntas';

const App = () => {
  return (
    <div>
      <header>
        <h1>Quiz de geografía e historia</h1>
      </header>
      <main>
        <Test preguntas={preguntas} /> {/* Asegúrate de pasar las preguntas como prop */}
      </main>
      <footer>
      © Sergi Farga
      </footer>
    </div>
  );
};

export default App;
