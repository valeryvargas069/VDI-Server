import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [estadoBackend, setEstadoBackend] = useState("Comprobando conexión...");
const [estadoProxmox, setEstadoProxmox] = useState("Comprobando Proxmox...");
const [estadoVM, setEstadoVM] = useState("Comprobando VM...");
useEffect(() => {
  fetch("http://localhost:3000")
    .then((respuesta) => respuesta.json())
    .then((datos) => {
      if (datos.estado === "activo") {
        setEstadoBackend("Conectado al backend");
      }
    })
    .catch(() => {
      setEstadoBackend("Backend desconectado");
    });
}, []);
useEffect(() => {
  fetch("http://localhost:3000/proxmox/estado")
    .then((respuesta) => respuesta.json())
    .then((datos) => {
      if (datos.estado === "conectado") {
        setEstadoProxmox("🟢 Proxmox VE conectado");
      } else {
        setEstadoProxmox("🔴 Proxmox VE desconectado");
      }
    })
    .catch(() => {
      setEstadoProxmox("🔴 Proxmox VE desconectado");
    });
}, []);
useEffect(() => {
  fetch("http://localhost:3000/proxmox/vms")
    .then((respuesta) => respuesta.json())
    .then((datos) => {
      if (datos.data?.status === "running") {
        setEstadoVM("🟢 Encendido");
      } else if (datos.data?.status === "stopped") {
        setEstadoVM("⚪ Apagado");
      } else {
        setEstadoVM("Estado desconocido");
      }
    })
    .catch(() => {
      setEstadoVM("No disponible");
    });
}, []);
  const [pagina, setPagina] = useState("Inicio");
  const [resultadosBackend, setResultadosBackend] = useState([]);
  const [usuariosBackend, setUsuariosBackend] = useState([]);
  useEffect(() => {
  fetch("http://localhost:3000/resultados")
    .then((respuesta) => respuesta.json())
    .then((datos) => {
      setResultadosBackend(datos);
    })
    .catch((error) => {
      console.error("Error al cargar resultados:", error);
    });
}, []);
useEffect(() => {
  fetch("http://localhost:3000/usuarios")
    .then((respuesta) => respuesta.json())
    .then((datos) => {
      setUsuariosBackend(datos);
    })
    .catch((error) => {
      console.error("Error al cargar usuarios:", error);
    });
}, []);
const resultadoPreventivoBackend = resultadosBackend.find(
  (resultado) => resultado.practica === "Mantenimiento preventivo"
);

const resultadoCorrectivoBackend = resultadosBackend.find(
  (resultado) => resultado.practica === "Mantenimiento correctivo"
);
const [usuarioRegistrado, setUsuarioRegistrado] = useState(() => {
  const cuentaGuardada = localStorage.getItem("usuarioRegistrado");

  return cuentaGuardada
    ? JSON.parse(cuentaGuardada)
    : null;
});
  const [usuarioActual, setUsuarioActual] = useState(() => {
  const sesionGuardada = localStorage.getItem("usuarioActual");

  return sesionGuardada
    ? JSON.parse(sesionGuardada)
    : null;
});
const administrador = {
  usuario: "administrador",
  correo: "ADMIN@VDISERVER.com",
  contraseña: "administrador123"
};
const [registro, setRegistro] = useState({
  usuario: "",
  correo: "",
  contraseña: "",
  confirmar: "",
});

const [login, setLogin] = useState({
  usuario: "",
  correo: "",
  contraseña: "",
});
const [resultadoPreventivo, setResultadoPreventivo] = useState(() => {
  const guardado = localStorage.getItem("resultadoPreventivo");

  return guardado
    ? JSON.parse(guardado)
    : null;
});
const [pasosPreventivo, setPasosPreventivo] = useState([
  false,
  false,
  false,
  false,
]);
const [pasosCorrectivo, setPasosCorrectivo] = useState([
  false,
  false,
  false,
  false,
]);

const [resultadoCorrectivo, setResultadoCorrectivo] = useState(() => {
  const guardado = localStorage.getItem("resultadoCorrectivo");

  return guardado
    ? JSON.parse(guardado)
    : null;
});
  const mostrarPagina = () => {
    if (pagina === "Inicio") {
      return (
        <section className="inicio">
          <div className="texto-inicio">
            <p className="etiqueta">💻 VDI SERVER</p>

           <h1 className="titulo-inicio">
  Aprende mantenimiento <span>de computadores</span>
</h1>

            <p className="texto-inicio">
  Realiza prácticas de mantenimiento de computadores
  mediante entornos virtuales seguros y controlados.
</p>

            <button onClick={() => setPagina("Prácticas")}>
              Comenzar práctica
            </button>

            <button
              className="boton-secundario"
              onClick={() => setPagina("Instrucciones")}
            >
              Ver instrucciones
            </button>
          </div>

          <div className="tarjeta-servidor tarjeta-vdi">
  <h2>VDI SERVER</h2>

  <img
    src="/logo-vdi.png"
    alt="VDI SERVER"
    className="logo-servidor"
  />

  <h3>Servidor disponible</h3>

  <div className="estado">
    <span></span>
    <strong>Servidor activo</strong>
  </div>

  <p className="conexion-servidor">
    🟢 Entorno virtual disponible
  </p>
</div>
        </section>
      );
    }

    if (pagina === "Prácticas") {
      return (
        <section className="contenido">
          <h1>Prácticas de mantenimiento</h1>
          <p>
            Selecciona una práctica para trabajar con un computador virtual.
          </p>

          <div className="tarjetas">
            <div className="tarjeta">
              <h2>🔧 Mantenimiento preventivo</h2>
              <p>
                Actividades relacionadas con la prevención de fallos en un
                computador.
              </p>
              <button onClick={() => setPagina("Preventivo")}>
  Iniciar práctica
</button>
            </div>

            <div className="tarjeta">
              <h2>🛠️ Mantenimiento correctivo</h2>
              <p>
                Identificación y solución de problemas del sistema.
              </p>
              <button onClick={() => setPagina("Correctivo")}>
  Iniciar práctica
</button>
            </div>
          </div>
        </section>
      );
    }
if (pagina === "Preventivo") {
  return (
    <section className="contenido">
      <button
        className="boton-volver"
        onClick={() => setPagina("Prácticas")}
      >
        ← Volver a prácticas
      </button>

      <h1>🔧 Mantenimiento preventivo</h1>

      <p>
        En esta práctica aprenderás a realizar procedimientos básicos
        para prevenir fallos y mantener el buen funcionamiento de un computador.
      </p>

      <div className="practica-detalle">
        <h2>Pasos de la práctica</h2>

        <ol>
  <li>
    <label>
      <input
        type="checkbox"
        checked={pasosPreventivo[0]}
        onChange={() => {
          const nuevosPasos = [...pasosPreventivo];
          nuevosPasos[0] = !nuevosPasos[0];
          setPasosPreventivo(nuevosPasos);
        }}
      />
      Revisar el estado general del computador.
    </label>
  </li>

  <li>
    <label>
      <input
        type="checkbox"
        checked={pasosPreventivo[1]}
        onChange={() => {
          const nuevosPasos = [...pasosPreventivo];
          nuevosPasos[1] = !nuevosPasos[1];
          setPasosPreventivo(nuevosPasos);
        }}
      />
      Identificar posibles problemas.
    </label>
  </li>

  <li>
    <label>
      <input
        type="checkbox"
        checked={pasosPreventivo[2]}
        onChange={() => {
          const nuevosPasos = [...pasosPreventivo];
          nuevosPasos[2] = !nuevosPasos[2];
          setPasosPreventivo(nuevosPasos);
        }}
      />
      Realizar limpieza y optimización.
    </label>
  </li>

  <li>
    <label>
      <input
        type="checkbox"
        checked={pasosPreventivo[3]}
        onChange={() => {
          const nuevosPasos = [...pasosPreventivo];
          nuevosPasos[3] = !nuevosPasos[3];
          setPasosPreventivo(nuevosPasos);
        }}
      />
      Comprobar el funcionamiento del sistema.
    </label>
  </li>
</ol>
<button
  className="boton-iniciar"
  onClick={() => {
    const completados = pasosPreventivo.filter((paso) => paso).length;
    const porcentaje = completados * 25;

    const resultado = {
      usuario: usuarioActual?.usuario || "Estudiante",
      correo: usuarioActual?.correo || "Sin correo",
      practica: "Mantenimiento preventivo",
      completados: completados,
      total: 4,
      porcentaje: porcentaje,
    };

    setResultadoPreventivo(resultado);

    localStorage.setItem(
      "resultadoPreventivo",
      JSON.stringify(resultado)
    );
fetch("http://localhost:3000/resultados", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(resultado)
})
  .then((respuesta) => respuesta.json())
  .then((datos) => {
    console.log("Resultado guardado en el backend:", datos);
  })
  .catch((error) => {
    console.error("Error al guardar resultado:", error);
  });
    alert(`Práctica finalizada. Resultado: ${porcentaje}%`);
  }}
>
  Finalizar práctica
</button>
        <button
  className="boton-iniciar"
  onClick={() => setPagina("Laboratorio")}
>
  Iniciar computador virtual
</button>
      </div>
    </section>
  );
}
if (pagina === "Laboratorio") {
  return (
    <section className="contenido">
      <h1>Laboratorio Virtual</h1>

      <p>
        Computador virtual listo para realizar prácticas de mantenimiento.
      </p>

      <div className="tarjeta-laboratorio">
        <h2>Computador virtual</h2>
        <p>Estado: {estadoVM}</p>

        <h3>Práctica de mantenimiento</h3>
        <ol>
          <li>Iniciar el computador virtual.</li>
          <li>Revisar el sistema operativo.</li>
          <li>Realizar las actividades de mantenimiento.</li>
          <li>Comprobar el funcionamiento del sistema.</li>
        </ol>
        <button
  className="boton-iniciar"
  onClick={async () => {
  try {
    const respuesta = await fetch("http://localhost:3000/proxmox/iniciar/100", {
      method: "POST"
    });

    const datos = await respuesta.json();
    alert(datos.mensaje || "Computador virtual iniciado correctamente");
    window.open(
  "https://192.168.1.50:8006/?console=kvm&novnc=1&vmid=100&node=pve",
  "_blank"
);
  } catch (error) {
    alert("No se pudo conectar con Proxmox");
  }
}}
>
  Iniciar computador virtual
</button>
      </div>

      <button
        className="boton-iniciar"
        onClick={() => setPagina("Prácticas")}
      >
        Volver a prácticas
      </button>
    </section>
  );
}
if (pagina === "Correctivo") {
  return (
    <section className="contenido">
      <button
        className="boton-volver"
        onClick={() => setPagina("Prácticas")}
      >
        ← Volver a prácticas
      </button>

      <h1>🛠️ Mantenimiento correctivo</h1>

      <p>
        En esta práctica aprenderás a identificar problemas y aplicar
        soluciones en un computador virtual.
      </p>

      <div className="practica-detalle">
        <h2>Pasos de la práctica</h2>

       <ol>
  <li>
    <label>
      <input
        type="checkbox"
        checked={pasosCorrectivo[0]}
        onChange={() => {
          const nuevosPasos = [...pasosCorrectivo];
          nuevosPasos[0] = !nuevosPasos[0];
          setPasosCorrectivo(nuevosPasos);
        }}
      />
      Identificar el problema presentado.
    </label>
  </li>

  <li>
    <label>
      <input
        type="checkbox"
        checked={pasosCorrectivo[1]}
        onChange={() => {
          const nuevosPasos = [...pasosCorrectivo];
          nuevosPasos[1] = !nuevosPasos[1];
          setPasosCorrectivo(nuevosPasos);
        }}
      />
      Realizar un diagnóstico del sistema.
    </label>
  </li>

  <li>
    <label>
      <input
        type="checkbox"
        checked={pasosCorrectivo[2]}
        onChange={() => {
          const nuevosPasos = [...pasosCorrectivo];
          nuevosPasos[2] = !nuevosPasos[2];
          setPasosCorrectivo(nuevosPasos);
        }}
      />
      Aplicar una solución al problema.
    </label>
  </li>

  <li>
    <label>
      <input
        type="checkbox"
        checked={pasosCorrectivo[3]}
        onChange={() => {
          const nuevosPasos = [...pasosCorrectivo];
          nuevosPasos[3] = !nuevosPasos[3];
          setPasosCorrectivo(nuevosPasos);
        }}
      />
      Comprobar que el computador funciona correctamente.
    </label>
  </li>
</ol>
<button
  className="boton-iniciar"
  onClick={() => {
    const completados = pasosCorrectivo.filter((paso) => paso).length;
    const porcentaje = completados * 25;

    const resultado = {
      usuario: usuarioActual?.usuario || "Estudiante",
      correo: usuarioActual?.correo || "Sin correo",
      practica: "Mantenimiento correctivo",
      completados: completados,
      total: 4,
      porcentaje: porcentaje,
    };

    setResultadoCorrectivo(resultado);

    localStorage.setItem(
      "resultadoCorrectivo",
      JSON.stringify(resultado)
    );
fetch("http://localhost:3000/resultados", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(resultado)
})
  .then((respuesta) => respuesta.json())
  .then((datos) => {
    console.log("Resultado correctivo guardado en el backend:", datos);
  })
  .catch((error) => {
    console.error("Error al guardar resultado correctivo:", error);
  });
    alert(`Práctica finalizada. Resultado: ${porcentaje}%`);
  }}
>
  Finalizar práctica
</button>

        <button
 
  className="boton-iniciar"
  onClick={() => setPagina("Laboratorio")}
>
  Iniciar computador virtual
</button>
      </div>
    </section>
  );
}
if (pagina === "Login") {
  return (
    <section className="contenido">
      <h1 className="titulo-formulario">Iniciar sesión</h1>

<p className="subtitulo-formulario">
  Ingresa tus datos para acceder a VDI SERVER
</p>
      <div className="login-contenedor">
       

        <label>Usuario</label>
        <input
  type="text"
  placeholder="Escribe tu usuario"
  value={login.usuario}
  onChange={(e) =>
    setLogin({ ...login, usuario: e.target.value })
  }
/>

        <label>Correo electrónico</label>
        <input
  type="email"
  placeholder="correo@ejemplo.com"
  value={login.correo}
  onChange={(e) =>
    setLogin({ ...login, correo: e.target.value })
  }
/>

        <label>Contraseña</label>
        <input
  type="password"
  placeholder="Escribe tu contraseña"
  value={login.contraseña}
  onChange={(e) =>
    setLogin({ ...login, contraseña: e.target.value })
  }
/>
        <button
  className="boton-iniciar"
  onClick={() => {
    if (
      !login.usuario ||
      !login.correo ||
      !login.contraseña
    ) {
      alert("Completa todos los campos.");
      return;
    }

  if (
  login.usuario.trim().toLowerCase() === administrador.usuario.toLowerCase() &&
  login.correo.trim().toLowerCase() === administrador.correo.toLowerCase() &&
  login.contraseña === administrador.contraseña
) {
  const usuarioSesion = {
    usuario: administrador.usuario,
    correo: administrador.correo,
    rol: "Administrador",
  };

  setUsuarioActual(usuarioSesion);

  localStorage.setItem(
    "usuarioActual",
    JSON.stringify(usuarioSesion)
  );

  alert("Inicio de sesión como administrador.");
  setPagina("Inicio");
  return;
}
if (login.usuario.trim().toLowerCase() === "administrador") {
  if (
    login.correo.trim().toLowerCase() === "correo-del-profesor@ejemplo.com" &&
    login.contraseña === "VDISERVER2026"
  ) {
    const usuarioSesion = {
      usuario: "administrador",
      correo: "correo-del-profesor@ejemplo.com",
      rol: "Administrador",
    };

    setUsuarioActual(usuarioSesion);

    localStorage.setItem(
      "usuarioActual",
      JSON.stringify(usuarioSesion)
    );

    alert("Inicio de sesión como administrador.");
    setPagina("Inicio");
    return;
  } else {
    alert("Datos del administrador incorrectos.");
    return;
  }
}
if (
  usuarioRegistrado &&
 login.usuario.trim().toLowerCase() === usuarioRegistrado.usuario.trim().toLowerCase() &&
login.correo.trim().toLowerCase() === usuarioRegistrado.correo.trim().toLowerCase() &&
login.contraseña === usuarioRegistrado.contraseña
) {
  const usuarioSesion = {
    usuario: usuarioRegistrado.usuario,
    correo: usuarioRegistrado.correo,
    rol: "Estudiante",
  };

  setUsuarioActual(usuarioSesion);

  localStorage.setItem(
    "usuarioActual",
    JSON.stringify(usuarioSesion)
  );

  alert("Inicio de sesión correcto.");
  setPagina("Inicio");
  return;
}

alert("Usuario, correo o contraseña incorrectos.");
  }}
>
  Iniciar sesión
</button>

        <p className="texto-registro">
          ¿No tienes una cuenta?
        </p>

        <button
          className="boton-secundario"
          onClick={() => setPagina("Registro")}
        >
          Crear cuenta
        </button>
      </div>
    </section>
  );
}
if (pagina === "Registro") {
  return (
    <section className="contenido">
      <h1 className="titulo-formulario">Crear cuenta</h1>

<p className="subtitulo-formulario">
  Registra tus datos para acceder a VDI SERVER
</p>
      <div className="login-contenedor">
        

        <label>Usuario</label>
        <input
  type="text"
  placeholder="Crea un nombre de usuario"
  value={registro.usuario}
  onChange={(e) =>
    setRegistro({ ...registro, usuario: e.target.value })
  }
/>

        <label>Correo electrónico</label>
       <input
  type="email"
  placeholder="correo@ejemplo.com"
  value={registro.correo}
  onChange={(e) =>
    setRegistro({ ...registro, correo: e.target.value })
  }
/>

        <label>Contraseña</label>
       <input
  type="password"
  placeholder="Crea una contraseña"
  value={registro.contraseña}
  onChange={(e) =>
    setRegistro({ ...registro, contraseña: e.target.value })
  }
/>

        <label>Confirmar contraseña</label>
        <input
  type="password"
  placeholder="Repite la contraseña"
  value={registro.confirmar}
  onChange={(e) =>
    setRegistro({ ...registro, confirmar: e.target.value })
  }
/>

        <button
  className="boton-iniciar"
  onClick={() => {
    if (
      !registro.usuario ||
      !registro.correo ||
      !registro.contraseña ||
      !registro.confirmar
    ) {
      alert("Completa todos los campos.");
      return;
    }

    if (registro.contraseña !== registro.confirmar) {
      alert("Las contraseñas no coinciden.");
      return;
    }

 const nuevaCuenta = {
  usuario: registro.usuario,
  correo: registro.correo,
  contraseña: registro.contraseña,
};

setUsuarioRegistrado(nuevaCuenta);

localStorage.setItem(
  "usuarioRegistrado",
  JSON.stringify(nuevaCuenta)
);
fetch("http://localhost:3000/usuarios", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    usuario: nuevaCuenta.usuario,
    correo: nuevaCuenta.correo,
    rol: "Estudiante"
  })
})
  .then((respuesta) => respuesta.json())
  .then((datos) => {
    console.log("Usuario guardado en la base de datos:", datos);
  })
  .catch((error) => {
    console.error("Error al guardar usuario:", error);
  });
    alert("Cuenta creada correctamente.");
    setPagina("Login");
  }}
>
  Registrarse
</button>

        <p className="texto-registro">
          ¿Ya tienes una cuenta?
        </p>

        <button
          className="boton-secundario"
          onClick={() => setPagina("Login")}
        >
          Iniciar sesión
        </button>
      </div>
    </section>
  );
}
if (pagina === "Admin") {
  return (
    <section className="contenido">
      <h1>Panel de administrador</h1>

      <p>
        Gestiona usuarios, prácticas y el estado del laboratorio virtual.
      </p>
      <div className="tarjetas">
      <div className="tarjeta">
  <h2>Usuarios</h2>
  <p>Ver y administrar estudiantes registrados.</p>

  <button
    className="boton-iniciar"
    onClick={() => setPagina("AdminUsuarios")}
  >
    Ver usuarios
  </button>
</div>
        <div className="tarjeta">
  <h2>Prácticas</h2>
  <p>Administrar prácticas de mantenimiento.</p>

  <button
    className="boton-iniciar"
    onClick={() => setPagina("AdminPracticas")}
  >
    Ver prácticas
  </button>
</div>

        <div className="tarjeta">
          <h2>Estado del servidor</h2>
          <p>Consultar el estado del laboratorio virtual.</p>
          <button
  className="boton-iniciar"
  onClick={() => setPagina("Estado")}
>
  Ver estado
</button>
        </div>
      </div>
    </section>
  );
}
if (pagina === "AdminUsuarios") {
  return (
    <section className="contenido">
      <h1>Usuarios registrados</h1>

      {usuariosBackend.length > 0 ? (
  usuariosBackend.map((usuario) => (
    <div className="tarjeta" key={usuario.id}>
      <h2>{usuario.usuario}</h2>
      <p>Correo: {usuario.correo}</p>
      <p>Rol: {usuario.rol}</p>
    </div>
  ))
) : (
  <p>No hay estudiantes registrados.</p>
)}

      <button
        className="boton-iniciar"
        onClick={() => setPagina("Admin")}
      >
        Volver al panel
      </button>
    </section>
  );
}
if (pagina === "AdminPracticas") {
  return (
    <section className="contenido">
      <h1>Administrar prácticas</h1>

      <div className="tarjetas">
        <div className="tarjeta">
          <h2>Mantenimiento preventivo</h2>
          <p>Práctica disponible para los estudiantes.</p>

         <button
  className="boton-iniciar"
  onClick={() => setPagina("ResultadosPreventivo")}
>
  Ver resultados
</button>
        </div>

        <div className="tarjeta">
          <h2>Mantenimiento correctivo</h2>
          <p>Práctica disponible para los estudiantes.</p>

          <button
            className="boton-iniciar"
            onClick={() => setPagina("ResultadosCorrectivo")}
          >
            Ver resultados
          </button>
        </div>
      </div>

      <button
        className="boton-iniciar"
        onClick={() => setPagina("Admin")}
      >
        Volver al panel
      </button>
    </section>
  );
}
if (pagina === "ResultadosPreventivo") {
  return (
    <section className="contenido">
      <h1>Resultados - Mantenimiento preventivo</h1>

      {resultadosBackend
  .filter((resultado) => resultado.practica === "Mantenimiento preventivo")
  .map((resultado) => (
    <div className="tarjeta" key={resultado.id}>
      <h2>{resultado.usuario}</h2>

      <p>Práctica: {resultado.practica}</p>

      <p>
        Pasos completados: {resultado.completados} de {resultado.total}
      </p>

      <p>Resultado: {resultado.porcentaje}%</p>

      <p>
        Estado: {resultado.porcentaje === 100 ? "Completada" : "En proceso"}
      </p>
    </div>
  ))}
      <button
        className="boton-iniciar"
        onClick={() => setPagina("AdminPracticas")}
      >
        Volver a prácticas
      </button>
    </section>
  );
}
if (pagina === "ResultadosCorrectivo") {
  return (
    <section className="contenido">
      <h1>Resultados - Mantenimiento correctivo</h1>

      {resultadosBackend
  .filter((resultado) => resultado.practica === "Mantenimiento correctivo")
  .map((resultado) => (
    <div className="tarjeta" key={resultado.id}>
      <h2>{resultado.usuario}</h2>

      <p>Práctica: {resultado.practica}</p>

      <p>
        Pasos completados: {resultado.completados} de {resultado.total}
      </p>

      <p>Porcentaje: {resultado.porcentaje}%</p>

      <p>
        Estado: {resultado.porcentaje === 100 ? "Completada" : "En proceso"}
      </p>
    </div>
  ))}

      <button
        className="boton-iniciar"
        onClick={() => setPagina("AdminPracticas")}
      >
        Volver a prácticas
      </button>
    </section>
  );
}
if (pagina === "Herramientas") {
      return (
        <section className="contenido">
          <h1>Herramientas disponibles</h1>
          <p>Herramientas para realizar las prácticas de mantenimiento.</p>

          <div className="tarjetas">
            <div className="tarjeta">
  <h2>🔍 Diagnóstico</h2>
  <p>Herramientas para identificar problemas del computador.</p>

  <button
    className="boton-iniciar"
    onClick={() => setPagina("Diagnostico")}
  >
    Abrir herramienta
  </button>
</div>

            <div className="tarjeta">
  <h2>💾 Almacenamiento</h2>
  <p>Herramientas para revisar unidades y almacenamiento.</p>

  <button
    className="boton-iniciar"
    onClick={() => setPagina("Almacenamiento")}
  >
    Abrir herramienta
  </button>
</div>
           <div className="tarjeta">
  <h2>🌐 Red</h2>
  <p>Herramientas para comprobar la conectividad de red.</p>

  <button
    className="boton-iniciar"
    onClick={() => setPagina("Red")}
  >
    Abrir herramienta
  </button>
</div>
          </div>
        </section>
      );
    }
if (pagina === "Diagnostico") {
  return (
    <section className="contenido">
      <h1>Diagnóstico del computador</h1>

      <p>
        Utiliza estas opciones para revisar posibles problemas del sistema.
      </p>

      <div className="tarjetas">
        <div className="tarjeta">
          <h2>Estado del sistema</h2>
          <p>Revisa si el sistema funciona correctamente.</p>
        </div>

        <div className="tarjeta">
          <h2>Rendimiento</h2>
          <p>Comprueba si el equipo presenta lentitud o fallos.</p>
        </div>

        <div className="tarjeta">
          <h2>Errores detectados</h2>
          <p>Consulta posibles problemas encontrados durante la práctica.</p>
        </div>
      </div>

      <button
        className="boton-iniciar"
        onClick={() => setPagina("Herramientas")}
      >
        Volver a herramientas
      </button>
    </section>
  );
}
if (pagina === "Almacenamiento") {
  return (
    <section className="contenido">
      <h1>💾 Almacenamiento</h1>

      <p>
        Utiliza estas opciones para revisar el almacenamiento del computador.
      </p>

      <div className="tarjetas">
        <div className="tarjeta">
          <h2>Unidades de almacenamiento</h2>
          <p>Revisa las unidades disponibles en el computador.</p>
        </div>

        <div className="tarjeta">
          <h2>Espacio disponible</h2>
          <p>Comprueba el espacio utilizado y disponible.</p>
        </div>

        <div className="tarjeta">
          <h2>Estado del almacenamiento</h2>
          <p>Comprueba si las unidades funcionan correctamente.</p>
        </div>
      </div>

      <button
        className="boton-iniciar"
        onClick={() => setPagina("Herramientas")}
      >
        Volver a herramientas
      </button>
    </section>
  );
}
if (pagina === "Red") {
  return (
    <section className="contenido">
      <h1>🌐 Red</h1>

      <p>
        Utiliza estas opciones para revisar la conectividad del computador.
      </p>

      <div className="tarjetas">
        <div className="tarjeta">
          <h2>Estado de conexión</h2>
          <p>Comprueba si el computador está conectado a la red.</p>
        </div>

        <div className="tarjeta">
          <h2>Dirección IP</h2>
          <p>Consulta la configuración de red del computador.</p>
        </div>

        <div className="tarjeta">
          <h2>Conectividad</h2>
          <p>Comprueba la comunicación del computador con la red.</p>
        </div>
      </div>

      <button
        className="boton-iniciar"
        onClick={() => setPagina("Herramientas")}
      >
        Volver a herramientas
      </button>
    </section>
  );
}
    if (pagina === "Instrucciones") {
  return (
    <section className="contenido">
      <h1>📋 Instrucciones</h1>

      <p>
        Sigue estos pasos para realizar correctamente las prácticas
        de mantenimiento en el laboratorio virtual.
      </p>

      <div className="tarjetas">

        <div className="tarjeta">
          <h2>1. Seleccionar la práctica</h2>
          <p>
            Ingresa a la sección Prácticas y selecciona Mantenimiento
            preventivo o Mantenimiento correctivo.
          </p>
        </div>

        <div className="tarjeta">
          <h2>2. Revisar las actividades</h2>
          <p>
            Lee cuidadosamente los pasos de la práctica antes de comenzar.
          </p>
        </div>

        <div className="tarjeta">
          <h2>3. Iniciar el computador virtual</h2>
          <p>
            Accede al laboratorio virtual para trabajar en un entorno
            seguro y controlado.
          </p>
        </div>

        <div className="tarjeta">
          <h2>4. Realizar el mantenimiento</h2>
          <p>
            Completa las actividades indicadas y marca cada paso
            realizado durante la práctica.
          </p>
        </div>

        <div className="tarjeta">
          <h2>5. Finalizar la práctica</h2>
          <p>
            Presiona Finalizar práctica para guardar el resultado
            y calcular el porcentaje de actividades completadas.
          </p>
        </div>

        <div className="tarjeta">
          <h2>6. Consultar resultados</h2>
          <p>
            Los resultados de las prácticas podrán ser revisados
            posteriormente por el administrador.
          </p>
        </div>

      </div>
    </section>
  );
}
if (pagina === "Estado") {
  return (
    <section className="contenido">
      <h1>🖥️ Estado del servidor</h1>

      <p>
        Consulta la disponibilidad de los servicios del laboratorio virtual.
      </p>

      <div className="tarjetas">

        <div className="tarjeta">
          <h2>🟢 Aplicación</h2>
          <p>Estado: {estadoBackend}</p>
        </div>

        <div className="tarjeta">
          <h2>🖥️ Servidor de virtualización</h2>
          <p>Estado: {estadoProxmox}</p>
        </div>

        <div className="tarjeta">
          <h2>💻 Laboratorio virtual</h2>
          <p>Estado: {estadoProxmox}</p>
        </div>

        <div className="tarjeta">
          <h2>🌐 Conexión</h2>
          <p>Estado: {estadoBackend}</p>
        </div>

      </div>

      <p>
        Cuando Proxmox VE esté conectado, esta sección mostrará
        automáticamente el estado real del servidor y de las máquinas virtuales.
      </p>
    </section>
  );
} 
  };

  return (
    <div className="app">
      <header className="sidebar">
        <div className="logo-vdi">
  <img src="/logo-vdi.png" alt="VDI SERVER" />
</div>

        <div className="nombre">
          <h2>VDI SERVER</h2>
          <p>Prácticas de mantenimiento</p>
        </div>

        <nav>
          <button onClick={() => setPagina("Inicio")}>
  🏠 Inicio
</button>

<button onClick={() => setPagina("Prácticas")}>
  🔧 Prácticas
</button>

<button onClick={() => setPagina("Herramientas")}>
  🧰 Herramientas
</button>

<button onClick={() => setPagina("Instrucciones")}>
  📄 Instrucciones
</button>

<button onClick={() => setPagina("Estado")}>
  🖥️ Estado del servidor
</button>
          {usuarioActual?.rol === "Administrador" && (
  <button onClick={() => setPagina("Admin")}>
    Panel administrador
  </button>
)}
          <button onClick={() => setPagina("Login")}>
  Iniciar sesión
</button>

<button onClick={() => setPagina("Registro")}>
  Crear cuenta
</button>
        </nav>
       {usuarioActual && (
  <div className="usuario-info">
    <span>{usuarioActual.usuario}</span>
    <small>{usuarioActual.rol}</small>

    <button
      className="boton-cerrar-sesion"
      onClick={() => {
        setUsuarioActual(null);
        localStorage.removeItem("usuarioActual");
        setPagina("Login");
      }}
    >
      Cerrar sesión
    </button>
  </div>
)}
      </header>

      <main>{mostrarPagina()}</main>
    </div>
  );
}

export default App;