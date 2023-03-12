let weather = {
    apiKey: "80173499979b7bb77acc2ec77c4498dd",
    dbkey:"ZKRAU8U4BQQT",
    obj:[],
    fetchWeather: function (city) {
        fetch(
            "https://api.openweathermap.org/data/2.5/forecast?q=" +
            city +
            "&appid=" +
            this.apiKey
        ).then((response) => {
            if (!response.ok) {
                alert("No weather found.");
                throw new Error("No weather found.");
            }
            return response.json();
        }).then((data) => this.displayWeather(data));
    },

    getLocalDateTimeFromLatLong: function(latitude, longitude) {
        var apiUrl = `https://api.timezonedb.com/v2.1/get-time-zone?key=${this.dbkey}&format=json&by=position&lat=${latitude}&lng=${longitude}`;
      
        return fetch(apiUrl)
          .then(response => response.json())
          .then(data => data.formatted)
          .catch(error => console.error(error));
    },

    displayCurrentTime: function(dateTime){
        var date = new Date(dateTime);
        var options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
          };
        var dateTimeString = date.toLocaleString('default', options);
        document.querySelector(".dt").innerText=dateTimeString;
    },

    myfunction: function(x){
        document.querySelector(".day1").classList.remove("active");
        document.querySelector(".day2").classList.remove("active");
        document.querySelector(".day3").classList.remove("active");
        document.querySelector(".day4").classList.remove("active");
        document.querySelector(".day5").classList.remove("active");
        document.querySelector(".day"+x).classList.add("active");

        var prev=this.obj.list[0].dt_txt;
        let k=1;
        let day_no=1;
        for(let i=0;i<this.obj.list.length;i++)
        {
            if((this.obj.list[i].dt_txt).substring(0,10)!=prev.substring(0,10))
            {
                day_no++;
            }
            if(day_no==x)
            {
                const temp = new Date(this.obj.list[i].dt_txt);
                let temp2 = temp.toLocaleTimeString();
                document.querySelector(".hour"+k).innerText=temp2;
                document.querySelector(".icon"+k).src ="https://openweathermap.org/img/wn/" + this.obj.list[i].weather[0].icon + ".png";
                document.querySelector(".description"+k).innerText = this.obj.list[i].weather[0].description;
                document.querySelector(".temp"+k).innerText = "Temperature : "+Number(this.obj.list[i].main.temp - 273).toFixed(1) + "°C";
                document.querySelector(".wind"+k).innerText = "Wind Speed : "+Number(this.obj.list[i].wind.speed*3.6).toFixed(1) + "Km/h";
                document.querySelector(".visibility"+k).innerText = "Visibility : "+Number(this.obj.list[i].visibility/1000).toFixed(1) + "Km";
                k++;
            }
            if(day_no>x)
            {
                for(let j=k;j<=8;j++)
                {
                    document.querySelector(".hour"+j).innerText="";
                    document.querySelector(".icon"+j).src ="";
                    document.querySelector(".description"+j).innerText = "";
                    document.querySelector(".temp"+j).innerText = "";
                    document.querySelector(".wind"+j).innerText = "";
                    document.querySelector(".visibility"+j).innerText = "";
                }
                break;
            }
            prev=this.obj.list[i].dt_txt;
        }
    
    },

    fillDetails: function(data)
    {
        var prev=data.list[0].dt_txt;
        const d = new Date(prev);
        let dt = d.toLocaleDateString();
        document.querySelector(".day1").innerText=dt;
        let k=2;
        for(let i=1;i<data.list.length;i++)
        {
            if((data.list[i].dt_txt).substring(0,10)==prev.substring(0,10))
            {
                continue;
            }
            const temp = new Date(data.list[i].dt_txt);
            let temp2 = temp.toLocaleDateString();
            document.querySelector(".day"+k).innerText=temp2;
            prev=data.list[i].dt_txt;
            k++;
            if(k==6)
            {
                break;
            }
        }
    },
      
    displayWeather: function (data) {
        this.obj=data;
        document.querySelector(".place").innerText = data.city.name;
        document.querySelector(".icon").src =
            "https://openweathermap.org/img/wn/" + data.list[0].weather[0].icon + ".png";
        document.querySelector(".description").innerText = data.list[0].weather[0].description;
        document.querySelector(".temp").innerText = Number(data.list[0].main.temp - 273).toFixed(1) + "°C";
        var latitude = data.city.coord.lat;
        var longitude = data.city.coord.lon;
        this.getLocalDateTimeFromLatLong(latitude, longitude).then(dateTime => this.displayCurrentTime(dateTime));
        document.querySelector(".curr").classList.remove("loading");
        this.fillDetails(data);
        this.myfunction(1);
    },

    search: function () {
        this.fetchWeather(document.querySelector(".city").value);
    },

};

document.querySelector(".go").addEventListener("click", function () {
    weather.search();
});

document.querySelector(".city").addEventListener("keyup", function (event) {
    if (event.key == "Enter") {
        weather.search();
    }
});

weather.fetchWeather("Ahmedabad");