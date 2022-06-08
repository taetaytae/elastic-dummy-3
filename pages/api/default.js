import axios from "axios";

export default async function handler(req, res){
    if(req.method == 'GET'){
        await axios.get(`https://freesound.org/apiv2/sounds/636237/?fields=name,previews&token=${process.env.FREESOUND_TOKEN}`)
                    .then(function(response){
                        res.status(200).send(response.data);
                    })
                    .catch(function(error){
                        res.status(500).send(error);
                    })
    }
}