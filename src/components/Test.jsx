import React, { useState } from 'react';

const Test = ({ preguntas }) => {
  const [indicePregunta, setIndicePregunta] = useState(0);
  const [respuestasCorrectas, setRespuestasCorrectas] = useState(Array(preguntas.length).fill(null));
  const [respuestasIncorrectas, setRespuestasIncorrectas] = useState([]);
  const [juegoTerminado, setJuegoTerminado] = useState(false);

  const preguntaActual = preguntas[indicePregunta];

  const manejarRespuesta = (indiceRespuesta) => {
    const respuestaCorrecta = preguntaActual.respuesta_correcta;
    const respuestaUsuarioCorrecta = indiceRespuesta === respuestaCorrecta;

    const nuevasRespuestas = [...respuestasCorrectas];
    nuevasRespuestas[indicePregunta] = respuestaUsuarioCorrecta;
    setRespuestasCorrectas(nuevasRespuestas);

    if (!respuestaUsuarioCorrecta) {
      setRespuestasIncorrectas([
        ...respuestasIncorrectas,
        { pregunta: preguntaActual.pregunta, opcionUsuario: indiceRespuesta, opcionCorrecta: respuestaCorrecta }
      ]);
    }

    const proximoIndice = indicePregunta + 1;
    if (proximoIndice < preguntas.length) {
      setIndicePregunta(proximoIndice);
    } else {
      // Fin del test, mostrar el resultado
      setJuegoTerminado(true);
    }
  };

  const reiniciarJuego = () => {
    setIndicePregunta(0);
    setRespuestasCorrectas(Array(preguntas.length).fill(null));
    setRespuestasIncorrectas([]);
    setJuegoTerminado(false);
  };

  return (
    <div>
      {!juegoTerminado ? (
        <Pregunta
          pregunta={preguntaActual}
          onSeleccionarRespuesta={manejarRespuesta}
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

const Pregunta = ({ pregunta, onSeleccionarRespuesta, onSiguientePregunta }) => {
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
      <button onClick={onSiguientePregunta}>Siguiente Pregunta</button>
    </div>
  );
};


const Respuesta = ({ texto, onClick }) => {
  return (
    <div className="respuesta">
      <input type="radio" onClick={onClick} />
      <label>{texto}</label>
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
            <strong>{respuesta.pregunta}</strong>
            <br />
            <span>Seleccionaste: {preguntas[respuesta.opcionUsuario].respuestas[respuesta.opcionUsuario]}</span>
            <br />
            <span>Respuesta correcta: {preguntas[respuesta.opcionCorrecta].respuestas[respuesta.opcionCorrecta]}</span>
          </li>
        ))}
      </ul>
      <button onClick={onReiniciarJuego}>Volver a jugar</button>
    </div>
  );
};

export default Test;
