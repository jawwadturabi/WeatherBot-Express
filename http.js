const request = require ("request")
exports.get = async (url)=>{
    const token = "Bearer 11286~cKNZP8SsHdUgk2vfmXGV0J3mfKGe3uyuv664oinBASOMr3MfxhDx5vZ9nNnrniG4"
    // queryParamsObject = {}
        return new Promise((resolve, reject) => {
            try {

                //making request
                request.get({
                    url: url ,
                    headers: {
                        Authorization: token
                    }
                }, function (error, response, body) {

                    //checking if response was success
                    if (!error && response.statusCode === 200) {
                        const responseBody = JSON.parse(response.body)

                        console.log("http get success, url: ", url , "responseBody: ", responseBody);
                        resolve(responseBody)

                    } else {
                        console.log("http get error, url: ", url, error);
                        reject(response.statusCode)
                    }
                })
            } catch (e) {
                console.log("catch error: ", e)
            }
        })
    }
