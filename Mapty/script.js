'use strict';


const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

let map ,mapEvent;
class Workout{
    date=new Date();
    id=(Date.now()+'').slice(-10);

    constructor(coords,distance,duration){
        this.coords=coords;
        this.distance=distance;
        this.duration=duration;

    }
}

class Running extends Workout{
    constructor(coords,distance,duration,Cadence){
        super(coords,distance,duration);
        Cadence=this.Cadence;
        this.calcPace();
    }

    calcPace(){
        this.pace=this.duration/this.distance;
        return this.pace;
    }
}

class Cycling extends Workout{
    constructor(coords,distance,duration,ElevationGain){
        super(coords,distance,duration);
        ElevationGain=this.ElevationGain;
        this.calcSpeed();
    }

    calcSpeed(){
        this.speed=this.distance/this.duration;
        return this.speed;
    }
}

class App{
    #map;
    #mapEvent;
    constructor(){
        this._getPosition();

        form.addEventListener('submit',this._newWorkout.bind(this));
           
           inputType.addEventListener('change',this._toggleElevationField.bind(this));

    }

    _getPosition()
    {
        if(navigator.geolocation)
            navigator.geolocation.getCurrentPosition(this._loadMap.bind(this),function(){
        alert('Sorry! Unable to access your current location.');
        }
        );

    }

    _loadMap(position){
       
            const {latitude} = position.coords;
            const {longitude} = position.coords;
          //console.log(latitude,longitude);
            console.log(`https://www.google.com/maps/@${latitude},${longitude}`);

            const coords=[latitude,longitude];
            this.#map = L.map('map').setView(coords, 13);

            L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                } ).addTo(this.#map);



             this.#map.on('click',this._showForm.bind(this));
      

    }

    _showForm(mapE){
        this.#mapEvent=mapE;
         form.classList.remove('hidden');
         inputDistance.focus();

    }

    _toggleElevationField(){
        inputElevation.closest('.form__row ').classList.toggle('form__row--hidden');
         inputCadence.closest('.form__row ').classList.toggle('form__row--hidden');

    }

    _newWorkout(e){
        const validInputs = (... inputs)=> inputs.every(inp =>Number.isFinite(inp));
        const allPositive= (...inputs) => inputs.every(inp=> inp > 0);
        e.preventDefault();

        const type= inputType.value;
        const distance= +inputDistance.value;
        const duration= +inputDuration.value;

        if(type==='running')
        {
            const cadence= +inputCadence.value;
            if(!validInputs(distance,duration,cadence) || !allPositive(distance,duration))
            {
                alert('Please input positive numeric values only.');
            }
             
        }

        if(type==='cycling')
        {
            const elevation= +inputElevation.value;
            if(!validInputs(distance,duration,elevation) || 
             !allPositive(distance,duration)
            )
            return alert('Please input positive numeric values only.');
        }


            //inputDistance.value=inputDuration.value=inputCadence.value=inputElevation.value='';
           
            //console.log(mapEvent);
        const {lat,lng}=this.#mapEvent.latlng;
           
        L.marker({lat,lng})
            .addTo(this.#map)
            .bindPopup(
                L.popup({
                    maxWidth: 250,
                    minWidth: 100,
                    autoClose: false,
                    closeOnClick: false,
                    className:'running-popup',
                })
            )
            .setPopupContent('Workout!')
            .openPopup();

    }

}

const app= new App();



    
   
