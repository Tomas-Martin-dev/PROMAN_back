import { CorsOptions } from "cors"

export const corsrOption: CorsOptions = {
    origin: function (origin, callback) {
        const whiteList = [process.env.URL_FRONT]
        
        if (whiteList.includes(origin)) {
            callback(null, true)
        }else{
            console.log(origin);
            callback(new Error("Error de Cors",))
        }
    }
}