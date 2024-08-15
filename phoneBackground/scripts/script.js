document.addEventListener("DOMContentLoaded", function () {

    // Theme Toggle
    /*const themeToggle = document.getElementById('theme-toggle');
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        document.body.classList.toggle('light-theme');
    });*/

    // Photo Gallery
    const photos = document.querySelectorAll('.photo');
    let currentPhoto = 0;
    let photoInterval;

    function showNextPhoto() {
        photos[currentPhoto].classList.remove('active');
        currentPhoto = (currentPhoto + 1) % photos.length;
        photos[currentPhoto].classList.add('active');
    }

    // Switch photos every 7 seconds
    photoInterval = setInterval(showNextPhoto, 7000);

    // Add click event to change the photo manually
    /*photos.forEach((photo, index) => {
        photo.addEventListener('click', () => {
            clearInterval(photoInterval); // Stop auto-switching when clicked
            photos[currentPhoto].classList.remove('active');
            currentPhoto = index;
            photos[currentPhoto].classList.add('active');
            setInterval(showNextPhoto, 7000);
        });
    });*/

    // Clock and Date
    /*function updateClock() {
        const now = new Date();
        const clock = document.getElementById('clock');
        const options = { day: '2-digit', month: 'short', year: '2-digit' };
        const formattedDate = now.toLocaleDateString('en-GB', options).replace(',', '');
        clock.innerHTML = now.toLocaleTimeString() + " <br> " + formattedDate;
    }
    setInterval(updateClock, 1000);
    updateClock();*/

    // Toggle Weather Info
    /*const toggleWeatherButton = document.getElementById('toggle-weather');
    const weatherDiv = document.getElementById('weather');
    toggleWeatherButton.addEventListener('click', () => {
        weatherDiv.classList.toggle('shown');
    });*/

    // Music Control
    /*const music = document.getElementById('background-music');
    const pauseMusicButton = document.getElementById('pause-music');
    pauseMusicButton.addEventListener('click', () => {
        if (music.paused) {
            music.play();
            pauseMusicButton.innerHTML = '&#10073;&#10073;'; // Pause icon (||)
        } else {
            music.pause();
            pauseMusicButton.innerHTML = '&#9654;'; // Play icon (▶)
        }
    });*/

    // Weather Info (Use a weather API to update this section)
    // You will need to fetch the weather data from an API

    // Star Wars Animation (You can add some cool JS animations here)

    // Game Logic (Implement a simple game like T-Rex or Pac-Man here)
});




function updateClock() {
    const now = new Date();

    // Get the time components
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();

    // Format hours, minutes, and seconds
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    // Display the time
    const timeString = `${hours}:${minutes}:${seconds}`;
    document.getElementById('time').textContent = timeString;

    // Display the date
    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const dateString = now.toLocaleDateString(undefined, dateOptions);
    document.getElementById('date').textContent = dateString;
}

// Update the clock every second
setInterval(updateClock, 1000);

// Initialize the clock
updateClock();