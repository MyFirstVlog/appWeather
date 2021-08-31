
const axios = require('axios')


class Busquedas{

    historial = ['Amsterdam', 'San Jose', 'Ottawa']

    constructor(){
        //TODO: Leer DB si existe
    }

    get paramsMapbox(){
        return {
            'access_token':process.env.MAPBOX_KEY,
            'limit': 5,
            'language': 'es'
        }
    }

    async ciudad(lugar = ''){ // Asincrona porque vamos a realizar una peticion http
            //console.log('Ciudad ',lugar)
            try {
                const instance = axios.create({
                    baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                    params: this.paramsMapbox
                })

                const response = await instance.get()
               
                return response.data.features.map((lugar)=>({
                        id: lugar.id,
                        nombre: lugar.place_name,
                        lng:lugar.center[0],
                        lat:lugar.center[1]
                }))
                console.log(response.data.features)

            } catch (error) {
                return [] // ciudades que coincidan conn el lugar de busqueda del usuario
            }
    }
}

module.exports = Busquedas