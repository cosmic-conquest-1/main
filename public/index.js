/*document.addEventListener('DOMContentLoaded', () => {
    // Handle form submission for login
    document.querySelector('form[action="/login"]')?.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission

        const formData = new FormData(this);
        fetch('/login', {
            method: 'POST',
            body: new URLSearchParams(formData),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Hide the login form
                document.getElementById('centerer').style.display = 'none';
                
                // Show the main menu
                document.getElementById('main-menu').style.display = 'block';

                // Optionally, hide the sign-up form as well
                document.getElementById('sign-up').style.display = 'none';
            } else {
                alert('Login failed: ' + (data.message || 'Unknown error'));
            }
        })
        .catch(error => {
            console.error('Fetch error:', error);
        });
    });

    // Handle form submission for sign-up
    document.querySelector('form[action="/signup"]')?.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission

        const formData = new FormData(this);
        fetch('/signup', {
            method: 'POST',
            body: new URLSearchParams(formData),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Sign up successful');
                // Optionally handle further actions after sign-up
            } else {
                alert('Sign up failed: ' + (data.message || 'Unknown error'));
            }
        })
        .catch(error => {
            console.error('Fetch error:', error);
        });
    });

    // Toggle between login and sign-up forms
    document.getElementById('needAccount')?.addEventListener('click', function(event) {
        event.preventDefault();
        document.getElementById('login').style.display = 'none';
        document.getElementById('sign-up').style.display = 'block';
    });

    document.getElementById('haveAccount')?.addEventListener('click', function(event) {
        event.preventDefault();
        document.getElementById('sign-up').style.display = 'none';
        document.getElementById('login').style.display = 'block';
    });

    // Main Menu
    let playerFaction = null;

    document.getElementById('play')?.addEventListener('click', function(event) {
        event.preventDefault();
        if (playerFaction == null){
            alert('Select a faction first.');
        }
        else {
            // Emit an event to the server with the user's session ID
            socket.emit('joinQueue', socket.id);

            document.getElementById('finding-match').style.display = 'block';
            document.getElementById('main-menu').style.display = 'none';
        }
    });

    document.getElementById('cancel')?.addEventListener('click', function(event) {
        event.preventDefault();
        document.getElementById('finding-match').style.display = 'none';
        document.getElementById('main-menu').style.display = 'block';
    });

    document.getElementById('factionSelect')?.addEventListener('click', function(event) {
        event.preventDefault();
        document.getElementById('faction-select').style.display = 'block';
        document.getElementById('overlay').classList.add('visible');
    });

    document.getElementById('leaderboard')?.addEventListener('click', function(event) {
        event.preventDefault();
        alert('Come back later.');
    });

    document.getElementById('support')?.addEventListener('click', function(event) {
        event.preventDefault();
        alert('Come back later.');
    });

    document.getElementById('factionSelect')?.addEventListener('click', function(event) {
        event.preventDefault();
        document.getElementById('faction-select').style.display = 'block';
        document.getElementById('overlay').classList.add('visible');
    });

    // Faction select screen's buttons
    document.getElementById('selectEarth')?.addEventListener('click', function(event) {
        event.preventDefault();
        playerFaction = 'earth';
        document.getElementById('faction-select').style.display = 'none';
        document.getElementById('overlay').classList.remove('visible');
    });

    document.getElementById('selectMoon')?.addEventListener('click', function(event) {
        event.preventDefault();
        playerFaction = 'moon';
        document.getElementById('faction-select').style.display = 'none';
        document.getElementById('overlay').classList.remove('visible');
    });

    document.getElementById('selectSun')?.addEventListener('click', function(event) {
        event.preventDefault();
        playerFaction = 'sun';
        document.getElementById('faction-select').style.display = 'none';
        document.getElementById('overlay').classList.remove('visible');
    });

    document.getElementById('selectBlackHole')?.addEventListener('click', function(event) {
        event.preventDefault();
        playerFaction = 'black hole';
        document.getElementById('faction-select').style.display = 'none';
        document.getElementById('overlay').classList.remove('visible');
    });

    // Overlay that fades to black
    document.getElementById('overlay')?.addEventListener('click', function(event) {
        event.preventDefault();
        document.getElementById('faction-select').style.display = 'none';
        document.getElementById('overlay').classList.remove('visible');
    });

    //If they misclick between cards
    document.getElementById('faction-select')?.addEventListener('click', function(event) {
        event.preventDefault();
        document.getElementById('faction-select').style.display = 'none';
        document.getElementById('overlay').classList.remove('visible');
    });
});*/



//Socket function to allow multiple clients 
document.addEventListener('DOMContentLoaded', () => {
    const socket = io(); // Initialize Socket.IO client

    // Handle form submission for login
    document.querySelector('form[action="/login"]')?.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission

        const formData = new FormData(this);
        const socketId = socket.id; // Get the socket ID from the Socket.io instance
        
        // Append socket ID to form data
        formData.append('socketId', socketId);

        fetch('/login', {
            method: 'POST',
            body: new URLSearchParams(formData),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('Login successful! Socket ID:', data.socketId);
                
                // Hide the login form
                document.getElementById('centerer').style.display = 'none';
                
                // Show the main menu
                document.getElementById('main-menu').style.display = 'block';

                // Optionally, hide the sign-up form as well
                document.getElementById('sign-up').style.display = 'none';
            } else {
                alert('Login failed: ' + (data.message || 'Unknown error'));
            }
        })
        .catch(error => {
            console.error('Fetch error:', error);
        });
    });

    socket.on('connected', (data) => {
        console.log('Connected to server with socket ID:', data.socketId);
    });

    socket.on('gameState', (gameData) => {
        console.log('Received game state:',gameData);
    })

    socket.on('disconnect', () => {
        console.log('Disconnected from server');
    });

    // Handle form submission for login
    document.querySelector('form[action="/login"]')?.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission

        const formData = new FormData(this);
        fetch('/login', {
            method: 'POST',
            body: new URLSearchParams(formData),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Hide the login form
                document.getElementById('centerer').style.display = 'none';
                
                // Show the main menu
                document.getElementById('main-menu').style.display = 'block';

                // Optionally, hide the sign-up form as well
                document.getElementById('sign-up').style.display = 'none';
            } else {
                alert('Login failed: ' + (data.message || 'Unknown error'));
            }
        })
        .catch(error => {
            console.error('Fetch error:', error);
        });
    });

    // Handle form submission for sign-up
    document.querySelector('form[action="/signup"]')?.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission

        const formData = new FormData(this);
        fetch('/signup', {
            method: 'POST',
            body: new URLSearchParams(formData),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Sign up successful');
                // Optionally handle further actions after sign-up
            } else {
                alert('Sign up failed: ' + (data.message || 'Unknown error'));
            }
        })
        .catch(error => {
            console.error('Fetch error:', error);
        });
    });

    // Toggle between login and sign-up forms
    document.getElementById('needAccount')?.addEventListener('click', function(event) {
        event.preventDefault();
        document.getElementById('login').style.display = 'none';
        document.getElementById('sign-up').style.display = 'block';
    });

    document.getElementById('haveAccount')?.addEventListener('click', function(event) {
        event.preventDefault();
        document.getElementById('sign-up').style.display = 'none';
        document.getElementById('login').style.display = 'block';
    });

    // Main Menu
    let playerFaction = null;

    document.getElementById('faction-select')?.addEventListener('click', function(event) {
        let clickedElement = event.target.closest('button'); // Get closest button (handles clicks on images)
        if (clickedElement && clickedElement.hasAttribute('data-faction')) {
            playerFaction = clickedElement.getAttribute('data-faction');
            console.log('Selected Faction:', playerFaction);
    
            // Hide the selection menu
            //document.getElementById('faction-select').style.display = 'none';
            //document.getElementById('overlay').classList.remove('visible');
        }
    });

    document.getElementById('play')?.addEventListener('click', function(event) {
        event.preventDefault();
        
        if (playerFaction == null){
            alert('Select a faction first.');
        }
        else {
            data = [socket.id,playerFaction]
            
            // Emit an event to the server with the user's session ID
            socket.emit('joinQueue', data);
            
            document.getElementById('finding-match').style.display = 'block';
            document.getElementById('main-menu').style.display = 'none';
        }
    });

    document.getElementById('cancel')?.addEventListener('click', function(event) {
        event.preventDefault();
        document.getElementById('finding-match').style.display = 'none';
        document.getElementById('main-menu').style.display = 'block';
    });

    document.getElementById('factionSelect')?.addEventListener('click', function(event) {
        event.preventDefault();
        document.getElementById('faction-select').style.display = 'block';
        document.getElementById('overlay').classList.add('visible');
    });

    document.getElementById('leaderboard')?.addEventListener('click', function(event) {
        window.location.href = "leaderboardpage.html";
    });

    document.getElementById('support')?.addEventListener('click', function(event) {
        event.preventDefault();
        alert('Come back later.');
    });

    document.getElementById('factionSelect')?.addEventListener('click', function(event) {
        event.preventDefault();
        document.getElementById('faction-select').style.display = 'block';
        document.getElementById('overlay').classList.add('visible');
    });

    // Faction select screen's buttons
    document.getElementById('selectEarth')?.addEventListener('click', function(event) {
        event.preventDefault();
        playerFaction = 'earth';
        document.getElementById('faction-select').style.display = 'none';
        document.getElementById('overlay').classList.remove('visible');
    });

    document.getElementById('selectMoon')?.addEventListener('click', function(event) {
        event.preventDefault();
        playerFaction = 'moon';
        document.getElementById('faction-select').style.display = 'none';
        document.getElementById('overlay').classList.remove('visible');
    });

    document.getElementById('selectSun')?.addEventListener('click', function(event) {
        event.preventDefault();
        playerFaction = 'sun';
        document.getElementById('faction-select').style.display = 'none';
        document.getElementById('overlay').classList.remove('visible');
    });

    document.getElementById('selectBlackHole')?.addEventListener('click', function(event) {
        event.preventDefault();
        playerFaction = 'black hole';
        document.getElementById('faction-select').style.display = 'none';
        document.getElementById('overlay').classList.remove('visible');
    });

    // Overlay that fades to black
    document.getElementById('overlay')?.addEventListener('click', function(event) {
        event.preventDefault();
        document.getElementById('faction-select').style.display = 'none';
        document.getElementById('overlay').classList.remove('visible');
    });

    //If they misclick between cards
    document.getElementById('faction-select')?.addEventListener('click', function(event) {
        event.preventDefault();
        document.getElementById('faction-select').style.display = 'none';
        document.getElementById('overlay').classList.remove('visible');
    });
});
