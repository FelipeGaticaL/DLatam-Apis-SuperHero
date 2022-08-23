
 
  /* 1.- Seleccionamos el form para hacer el tratamiento de los datos de entrada */
  $("form").on("submit", (c) => {
    /* Se dejan vacíos los campos para que no haya error, los campos están llamados a través de jQuery manipulación de DOM */
    c.preventDefault();
    $("#resultado").html(" ");
    $("#grafica").html(" ");
    hero = parseInt($("#hero").val());
    /* Restricción con máscara de datos, la cual después se validará a través del .test, que ejecuta la expresión regular*/
    let expresion = /\d/gim;
    /* Resultado guarda el retorno de la fucnión validar, que contiene el bolean true or false de la ejecución de la expresión regular */
    resultado = validar(hero, expresion); 
    /* Si resultado es = true, entonces ejecuta la función lectura con el valor de hero */
    if (resultado) {
      lectura(hero);
      /* Si el resultado es FALSE, entonces resetea el campo a "" */
    } else {
      $("#hero").html(" ");
    }
  });
 
  /* Ejecutar función validar,
  Si HERO SI se ajusta a la expresión regular de Let expresion, entonces retorna TRUE
  si HERO no se ajusta a la expresión regular guardada en Let Expresión, entonces rtorna el alert, sólo números válidos.  */
   function validar(hero, expresion) {
    if (hero && expresion.test(hero)) {
      return true;
    } else {
      alert("Sólo números válidos");
      return false;
    }
  }

  /* Ejecutar función lectura */
  /* Función lectura utiliza el valor del parametro HERO,
  Se crea un objeto vacío,
  Se utiliza la instancia de Jquery para ejecutar el método ajax 
  El tipo de consulta será get
  Se declara que el data que recibiremos es del typo jason
  Se declara propiedad success, que puede guardar una función, que tendrá por parametro "resultado",
  resultado a su vez será guardado en la var objeto (el cual puede contener un objeto {})
  Si el campo o atributo result del json.response es = a success, entonces invoca la función imprimir con el parametro objeto
  De no ser así, lanzar alert
  Se agrega la propiedad error, que retorna alert
  */
  function lectura(hero) {
    var objeto = {};

    $.ajax({
      type: "get",
      dataType: "json",
      url: `https://www.superheroapi.com/api.php/10226104197055565/${hero}`,
      success: function (result) {
        objeto = result;
        if (result.response === "success") {
          imprimir(objeto);
        } else {
          alert("No hay super héroes con esta ID");
        }
      },
      error: () => {
        alert("Hay un error al momento de consultar datos");
      },
    });
  }


/* Imprimir en sección de super héroe los datos del json de la API con estructura HTML */


  function imprimir(result) {
    let view1 = `
            <h2 class="text-center">Detalles de los super héroes</h2>
            <div class="d-flex justify-content-start">
            <div class="card">
              <div class="row no-gutters">
                    <div class="col-md-5 d-flex justify-content-start">
                        <img src="${result.image.url}" class="card-img" alt="${result.name}">
                    </div>
                    <div class="col-md-5 col col align-self-end">
                        <div class="card-body">
                            <h3 class="card-title">Nombre: ${result.name}</h3>
                            <ul class="list-group list-group-flush">
                                <li class="list-group-item">Conexiones: ${result.connections["relatives"]}</li>
                                <li class="list-group-item"><em>Publicado por</em>: ${result.biography.publisher}</li>
                                <li class="list-group-item"><em>Nombre Completo:</em> ${result.biography["full-name"]}</li>
                                <li class="list-group-item"><em>Ocupacion:</em> ${result.work["occupation"]}</li>
                                <li class="list-group-item"><em>Grupo de afilación:</em> ${result.connections["group-affiliation"]}</li>
        `;
/* Se recorren ambos valores que contiene el atributo height para poder extraerlos y se imprimen en el span */
 /*    let vista2 = `<li class="list-group-item"> <em>Altura:</em>`;
    result.appearance.height.forEach((height) => {
      vista2 += `
                <span>${height}-</span>
            `;
    });

    vista2 += `</li>`; */

  /* Método de recorrido a través de propiedad join */
    let view2 = `<li class="list-group-item"> <em>Altura:</em> ${result.appearance.height.join(
      " - "
      )}.</li>`;


  /* Se recorren ambos valores que contiene el atributo wight, para poder extraerlos y se imprimen en el span, pero esta vez se ocupa la propiedad de join*/
    let view3 = `<li class="list-group-item"> <em>Peso:</em> ${result.appearance.weight.join(
      " - "
    )}.</li>`;

    let view4 = `
                              <li class="list-group-item"><em>Lugar de nacimiento:</em> ${result.biography["place-of-birth"]}</li>
                            </ul>
                        </div>
                    </div>
                    </div>
                    </div>
            </div>
        `;

    $("#resultado").append(view1 + view2 + view3 + view4);

/* Sección del PIE CHART 
A) Variable datos xy guarda el arreglo del objeto powerstats y los valores listados en sub atributos, intelligence, strength, speed, durability, power, combat, el cual es recorrido (For) y pusheado como valores parseInt */  
/* B) En valores se guarda el arreglo con los campos demandados por CavnasJSChart y los valores que están en dataPoints: DatosXY */
  let datosXY = [];
    for (const key in result.powerstats) {
      datosXY.push({
        label: key,
        y: parseInt(result.powerstats[key]),
      });
    }

    var valores = {
      title: {
        text: `Estadísticas Skills ${result.name}`,
      },
      data: [
        {
          type: "pie",
          showInLegend: "true",
          legendText: "{label}",
          indexLabel: "{label} ({y})",
          yValueFormatString: "#,##0.#" % "",
          dataPoints: datosXY,
        },
      ],
    };

    $("#grafica").CanvasJSChart(valores);
  }



