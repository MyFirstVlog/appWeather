const fs = require('fs')
const axios = require('axios')


class Busquedas{

    historial = []

    dbPath = './db/database.json'

    constructor(){
        //TODO: Leer DB si existe
        this.leerDB()
    }

    get paramsMapbox(){
        return {
            'access_token':process.env.MAPBOX_KEY,
            'limit': 5,
            'language': 'es'
        }
    }
    get paramsWeatherBox(){
        return{
            'appid': process.env.OPENWEATHER_KEY,
            'units': 'metric',
            'lang': 'es'
        }
    }

    get historialCapitalizado(){
        const cap = this.historial.map((each)=>{
            let lista = each.split(' ')
            lista = lista.map((each)=>{
                const str = each.charAt(0).toUpperCase() + each.slice(1) 
                return str
            })
            return(lista.join(' '))
        })

        return cap
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
                

            } catch (error) {
                return [] // ciudades que coincidan conn el lugar de busqueda del usuario
            }
    }

    async clima(lat = '', lon = '') {
            try {
                const objeto = this.paramsWeatherBox
                objeto.lat = lat
                objeto.lon = lon
                const instance2 = axios.create({
                    baseURL:`https://api.openweathermap.org/data/2.5/weather`,
                    params:{...this.paramsWeatherBox, lat,lon}
                })

                const response2 = await instance2.get()

                return({
                    desc : response2.data.weather[0].description,
                    temp :  response2.data.main.temp,
                    max: response2.data.main.temp_max,
                    min : response2.data.main.temp_min
                })

            } catch (error) {
                console.log("error en la api de clima")
                return {}
            }
    }

    agregarHistorial(lugar=''){
        if(!this.historial.includes(lugar)) this.historial.unshift(lugar.toLocaleLowerCase())

        this.guardarDB()
    }

    guardarDB(){

        const payload = {
            historial : this.historial
        }

        fs.writeFileSync(this.dbPath, JSON.stringify(payload) )
    }

    leerDB(){
        if(!fs.existsSync(this.dbPath)){
            return 
        }
    
        const info = fs.readFileSync(this.dbPath,{encoding: 'utf-8'})
        const data = JSON.parse(info)
        console.log(data)
        this.historial = data.historial
    }
}

module.exports = Busquedas