import React, { useState } from 'react';

const Test = ({ preguntas }) => {
  const [indicePregunta, setIndicePregunta] = useState(0);
  const [respuestasCorrectas, setRespuestasCorrectas] = useState(Array(preguntas.length).fill(null));
  const [respuestasIncorrectas, setRespuestasIncorrectas] = useState([]);
  const [juegoTerminado, setJuegoTerminado] = useState(false);
  const [respuestaSeleccionada, setRespuestaSeleccionada] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null); // nuevo estado

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
    setSelectedAnswer(indiceRespuesta); // actualizamos el estado
  };

  const reiniciarJuego = () => {
    setIndicePregunta(0);
    setRespuestasCorrectas(Array(preguntas.length).fill(null));
    setRespuestasIncorrectas([]);
    setJuegoTerminado(false);
    setRespuestaSeleccionada(false);
    setSelectedAnswer(null); // reiniciar el estado
  };

  const siguientePregunta = () => {
    if (respuestaSeleccionada) {
      const proximoIndice = indicePregunta + 1;
      if (proximoIndice < preguntas.length) {
        setIndicePregunta(proximoIndice);
        setRespuestaSeleccionada(false);
        setSelectedAnswer(null); // reiniciar el estado
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
          selectedAnswer={selectedAnswer} // pasamos el estado
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

const Pregunta = ({ pregunta, onSeleccionarRespuesta, siguientePregunta, respuestaSeleccionada, selectedAnswer }) => {
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
            seleccionada={selectedAnswer === indice} // pasamos si está seleccionada
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
      <input type="radio" style={{ display: "none" }} checked={seleccionada} readOnly />
      <label style={seleccionada ? { backgroundColor: '#ba9a39', color: 'white' } : {}}>
        {texto}
      </label>
    </div>
  );
};

const Resultado = ({ respuestasCorrectas, respuestasIncorrectas, preguntas, onReiniciarJuego }) => {
  return (
    <div className="resultado">
      <h2>Resultado del juego</h2>
      <h3>Respuestas correctas:</h3>
      <ul>
        {preguntas.map((pregunta, index) => (
          respuestasCorrectas[index] ? (
            <li key={index}>
              {pregunta.pregunta}
              <br />
              <span>Respuesta: {pregunta.respuestas[pregunta.respuesta_correcta]}</span>
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
