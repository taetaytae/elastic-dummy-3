// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from "axios"


export default function handler(req, res) {

  const options = {
    method: 'GET',
    url: 'https://wordsapiv1.p.rapidapi.com/words/',
    params: {random: 'true'},
    headers: {
      'X-RapidAPI-Host': 'wordsapiv1.p.rapidapi.com',
      'X-RapidAPI-Key': `${process.env.WORD_API_KEY}`
    }
  };

  if(req.method == 'GET'){
    async function fetchRandomURL(){
      const response = await axios.request(options);

      //Use random word to fetch a random audio file
      const query = response.data.word;

      await axios.get(`https://freesound.org/apiv2/search/text/?query=${query}&fields=name,previews&token=${process.env.FREESOUND_TOKEN}`)
                .then(function(response){
                  if(response.data.results.length == 0){
                    fetchRandomURL();
                  }else{
                    res.status(200).send(response.data.results[0]);
                  }
                })
                .catch(function(error){
                  res.status(500).send(error);
                })
    }
    //Recursion until there is an audio file
    fetchRandomURL();
  }
}
