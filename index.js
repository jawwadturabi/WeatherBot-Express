const express = require ("express");
const bodyParser = require ("body-parser");
const http = require("./http")
const app = express().use(bodyParser.json());
let port = process.env.Port || 4000;

app.post('/webhook',async (req,res)=>{
   await http.get("https://usil.instructure.com/api/v1/" + "courses").then((data) => {
        console.log("data is : ",data)
       if(data.length == 0){
        res.send(
            {
                "messages": [
                  {"text": "You are not enroll in any course"},
                ],
                "quick_replies": [
                    {
                      "title":"Loved it!",
                      "block_names": ["Second block"]
                    },
                    {
                      "title":"Not really...",
                      "url": "https://rockets.chatfuel.com/api/sad-match",
                      "type":"json_plugin_url"
                    }
                  ]
               }
        )
            }
    }).catch((err) => {
        console.log("err is : ",err)
    });
})
app.listen(port,()=>{
  console.log("server is running on port ",port)
})