import React, { useState } from 'react';

const Test = ({ preguntas }) => {
  const [indicePregunta, setIndicePregunta] = useState(0);
  const [respuestasCorrectas, setRespuestasCorrectas] = useState(Array(preguntas.length).fill(null));
  const [respuestasIncorrectas, setRespuestasIncorrectas] = useState([]);
  const [juegoTerminado, setJuegoTerminado] = useState(false);
  const [respuestaSeleccionada, setRespuestaSeleccionada] = useState(false);

  const preguntaActual = preguntas[indicePregunta];

  const manejarRespuesta = (indiceRespuesta) => {
    const respuestaCorrecta = preguntaActual.respuesta_correcta;
    const respuestaUsuarioCorrecta = indiceRespuesta === respuestaCorrecta;
  
    const nuevasRespuestas = [...respuestasCorrectas];
    nuevasRespuestas[indicePregunta] = respuestaUsuarioCorrecta;
    setRespuestasCorrectas(nuevasRespuestas);
  
    if (!respuestaUsuarioCorrecta) {
      const preguntaRepetida = respuestasIncorrectas.find(respuesta => respuesta.indicePregunta === indicePregunta);
      if (!preguntaRepetida) {
        setRespuestasIncorrectas([
          ...respuestasIncorrectas,
          { indicePregunta: indicePregunta, opcionUsuario: indiceRespuesta, opcionCorrecta: respuestaCorrecta }
        ]);
      }
    }
  
    setRespuestaSeleccionada(true);
  };
  
  

  const reiniciarJuego = () => {
    setIndicePregunta(0);
    setRespuestasCorrectas(Array(preguntas.length).fill(null));
    setRespuestasIncorrectas([]);
    setJuegoTerminado(false);
    setRespuestaSeleccionada(false);
  };

  const siguientePregunta = () => {
    if (respuestaSeleccionada) {
      const proximoIndice = indicePregunta + 1;
      if (proximoIndice < preguntas.length) {
        setIndicePregunta(proximoIndice);
        setRespuestaSeleccionada(false);
      } else {
        setJuegoTerminado(true);
      }
    }
  };

  return (
    <div>
      {!juegoTerminado ? (
        <Pregunta
          pregunta={preguntaActual}
          onSeleccionarRespuesta={manejarRespuesta}
          siguientePregunta={siguientePregunta}
          respuestaSeleccionada={respuestaSeleccionada}
        />
      ) : (
        <Resultado
          respuestasCorrectas={respuestasCorrectas}
          respuestasIncorrectas={respuestasIncorrectas}
          preguntas={preguntas}
          onReiniciarJuego={reiniciarJuego}
        />
      )}
    </div>
  );
};

const Pregunta = ({ pregunta, onSeleccionarRespuesta, siguientePregunta, respuestaSeleccionada }) => {
  const { pregunta: textoPregunta, respuestas } = pregunta;

  return (
    <div className="pregunta">
      <h2>{textoPregunta}</h2>
      <div className="respuesta">
        {respuestas.map((respuesta, indice) => (
          <Respuesta
            key={indice}
            texto={respuesta}
            onClick={() => onSeleccionarRespuesta(indice)}
          />
        ))}
      </div>
      <button onClick={siguientePregunta} disabled={!respuestaSeleccionada}>Siguiente Pregunta</button>
    </div>
  );
};

const Respuesta = ({ texto, onClick, seleccionada }) => {
  return (
    <div className={`respuesta ${seleccionada ? 'seleccionada' : ''}`} onClick={onClick}>
      <input type="radio" style={{ display: "none" }} />
      <label style={seleccionada ? { backgroundColor: '#ba9a39', color: 'white' } : {}}>
        {texto}
      </label>
    </div>
  );
};


const Resultado = ({ respuestasCorrectas, respuestasIncorrectas, preguntas, onReiniciarJuego }) => {
  return (
    <div>
      <h2>Resultado del juego</h2>
      <h3>Respuestas correctas:</h3>
      <ul>
        {preguntas.map((pregunta, index) => (
          respuestasCorrectas[index] ? (
            <li key={index}>
              {pregunta.pregunta}
              <br />
              <span>Respuesta correcta: {pregunta.respuestas[pregunta.respuesta_correcta]}</span>
            </li>
          ) : null
        ))}
      </ul>
      <h3>Respuestas incorrectas:</h3>
      <ul>
        {respuestasIncorrectas.map((respuesta, index) => (
          <li key={index}>
            <strong>{preguntas[respuesta.indicePregunta].pregunta}</strong>
            <br />
            <span>Seleccionaste: {preguntas[respuesta.indicePregunta].respuestas[respuesta.opcionUsuario]}</span>
            <br />
            <span>Respuesta correcta: {preguntas[respuesta.indicePregunta].respuestas[respuesta.opcionCorrecta]}</span>
          </li>
        ))}
      </ul>
      <button onClick={onReiniciarJuego}>Volver a jugar</button>
    </div>
  );
};



export default Test;
