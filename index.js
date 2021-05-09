require('dotenv').config()
const { leerInput, inquirerMenu, inquirePausa, listarlugares } = require('./helpers/inquirer');
const Busquedas = require('./models/busquedas');

const main = async () => {

  const busquedas = new Busquedas();
  let opt;

  do {
    opt = await inquirerMenu();

    switch (opt) {
      case 1:
        //Mostrar Mensaje
        const termino = await leerInput('Ciudad: ');
        //Buscar los lugares
        const lugares = await busquedas.ciudad(termino);

        // seleccionar el lugar
        const id = await listarlugares(lugares);
        if (id === '0') continue;
        //guardar en db
        const lugarSel = lugares.find(l => l.id === id);
        busquedas.agregarHistorial(lugarSel.nombre);

        //datos del Clima
        const clima = await busquedas.climaLugar(lugarSel.lat, lugarSel.lng);

        //Mostrar resultados
        console.clear();
        console.log('\nInformacion del lugar\n');
        console.log('Ciudad: ', lugarSel.nombre.green);
        console.log('Lat: ', lugarSel.lat);
        console.log('Lng: ', lugarSel.lng);
        console.log('Temperatura: ', clima.temp);
        console.log('Minima: ', clima.min);
        console.log('Maxima: ', clima.max);
        console.log('Desc: ', clima.desc.green);

        break;

      case 2:
        busquedas.historialCapitalizado.forEach((lugar, i) => {
          const idx = `${i + 1}.`.green;
          console.log(`${idx} ${lugar}`);
        })
        break;
    }
    if (opt !== 0) await inquirePausa();

  } while (opt != 0);
}

main();

//ciclo infinito mostrando las oppciones del menu