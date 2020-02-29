/*
Author: Adam Simonar
Date: Feb 28, 2020
*/

/* Global Variables */
const baseUrl = 'http://api.openweathermap.org/data/2.5/weather?';
const apiKey = '8436dca3b8f0c98fa4be88143e7ad5e8';
const apiCall = '&appid='
const countryCode = 'us';

// Create a new date instance dynamically with JS
function createDate(){
    let d = new Date();
    let newDate = d.getMonth()+'.'+ d.getDate()+'.'+ d.getFullYear();
    return newDate;
}

document.getElementById('generate').addEventListener('click', generateClicked);

function generateClicked(){
    const zipCode = document.getElementById('zip').value;
    const feelings = document.getElementById('feelings').value;
    if(zipCode != '' || zipCode != null || feelings != ''  || feelings != null){
        date = createDate();
        console.log(date);
        getWeather(baseUrl, zipCode, countryCode, apiCall, apiKey)
        .then(function(data){
            //check to see if it returned successfully, if so post it, otherwise get most recent data
            if(data.cod == 200){
                let temp = (data.main.temp - 273) * (9/5) + 32;
                postData('/addWeather', {
                    zip: zipCode,
                    date: date,
                    feelings: feelings,
                    temp: temp,
                    name: data.name
                });
            //did not properly collect the data from the weatherAPI. Return most recent or empty
            } else {
                retrieveData('/weatherData');
            }
        }).then(function(data){
            //return posted data from above
            retrieveData('/weatherData');
        });
    //if we got here, the required information was not entered properly
    } else {
        retrieveData('/weatherData');
    }
}

// get the information from the weather API
const getWeather = async (baseUrl, zipCode, countryCode, apiCall, apiKey) => {
    const res = await fetch(`${baseUrl}zip=${zipCode},${countryCode}${apiCall}${apiKey}`);
    try{
        const weatherRes = await res.json();
        return weatherRes;
    } catch (err){
        console.log(`Error: ${err}`);
    }
}

//retrieve the data from our server
const retrieveData = async (url='') =>{ 
    const response = await fetch(url);
    try {
    // Transform into JSON
    const data = await response.json()
    //update the UI with most recent data
    if (data !={} || data != null){
        updateRecentEntry(data);
    }
    return data;
    }
    catch(error) {
      console.log("error", error);
      // appropriately handle the error
    }
  }

  //post data to our server
  const postData = async (url = '', data = {})=>{
    const response = await fetch(url, {
    method: 'POST', 
    credentials: 'same-origin', 
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data), // body data type must match "Content-Type" header        
  });
    try {
        const newData = await response.json();
        return newData;
    }catch(error) {
    console.log("error", error);
    }
}

//helper function used to update our UI. Is being used inside of retrieveData
function updateRecentEntry(data){
    if (data.date && data.temp && data.feelings && data.zip && data.name){
        let date = document.getElementById('date');
        let zip = document.getElementById('zip-code');
        let name = document.getElementById('city-name');
        let temp = document.getElementById('temp');
        let feelings = document.getElementById('content'); 

        date.innerHTML = `Today's Date: ${data.date}`;
        zip.innerHTML = `Zipcode Entered: ${data.zip}`;
        name.innerHTML = `Area: ${data.name}`;
        temp.innerHTML = `Current Temperature: ${data.temp} &#8457`;
        feelings.innerHTML = `How You're Feeling: ${data.feelings}`;
    }else{
        let content = document.getElementById('content');
        content.innerHTML = `Please make sure you entered a valid zipcode and how you are feeling.`;
    }
}

