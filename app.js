require('dotenv').config()

const { leerInput, inquirerMenu, inquirerPausa, listadoLugares } = require("./helpers/inquirer")
const Busquedas = require("./models/busquedas")
require('colors')

//console.log(process.env.MAPBOX_KEY)

const main = async () => {
    
    let opt 

    const busquedas = new Busquedas()
    
    do {
        opt = await inquirerMenu()

        switch (opt) {
            case 1:
                
                const lugar = await leerInput("Ciudad: ")
                const ciudades =  await busquedas.ciudad(lugar)
                const idSeleccionado = await listadoLugares(ciudades)
                if(idSeleccionado === '0') continue

                const {nombre,lat,lng} = ciudades.find(l => l.id === idSeleccionado)

                busquedas.agregarHistorial(nombre)

                const {desc,temp,max,min} = await busquedas.clima(lat,lng)

                console.log('\nInformacion de la Ciudad\n'.green )
                console.log('Ciudad:',nombre)
                console.log('Lat:',lat)
                console.log('Lng:',lng)
                console.log('Temperatura:', temp)
                console.log('Minima:',min)
                console.log('Maxima:',max)
                console.log('Descripcion:',desc)
                break;
        
            case 2:
                busquedas.historialCapitalizado.forEach((each,index)=>{
                    const idx = `${index +1}.`.green
                    console.log(`${idx} ${each}`)
                })
                break;
            case 3:
                console.log(`escogio la opcion numero ${"3.".magenta}`);
                break
        }
        
        if(opt !== 3) await inquirerPausa()

    } while (opt !== 3 && opt !=='undefined');



}

main()