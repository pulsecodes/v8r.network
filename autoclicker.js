javascript:(function() {
    let clickInterval;
    let isRunning = false;
    let targetX = 0;
    let targetY = 0;
    let clicksPerSecond = 10;
    let isDragging = false;
    let previewMode = false;

    // Clean up existing instance if it exists
    if (window.autoClicker) {
        window.autoClicker.stop();
    }

    // CPS Control Panel
    const cpsControl = createElement('div', {
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        padding: '10px',
        backgroundColor: 'white',
        border: '2px solid #5D5CDE',
        borderRadius: '5px',
        zIndex: '10000',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
        display: 'flex',
        flexDirection: 'column',
        gap: '5px'
    });

    const cpsLabel = createElement('div', {
        fontSize: '12px',
        fontWeight: 'bold',
        color: '#5D5CDE',
        textAlign: 'center'
    }, `CPS: ${clicksPerSecond}`);

    const cpsSlider = createElement('input', {
        type: 'range',
        min: '1',
        max: '100',
        value: clicksPerSecond,
        width: '150px'
    });
    
    cpsSlider.addEventListener('input', () => {
        clicksPerSecond = parseInt(cpsSlider.value);
        cpsLabel.textContent = `CPS: ${clicksPerSecond}`;
        if (isRunning) {
            stopClicking();
            startClicking();
        }
    });

    cpsControl.append(cpsLabel, cpsSlider);
    document.body.appendChild(cpsControl);

    // Exit Button
    const exitButton = createElement('div', {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        padding: '10px 20px',
        backgroundColor: '#5D5CDE',
        color: 'white',
        borderRadius: '5px',
        fontWeight: 'bold',
        cursor: 'pointer',
        zIndex: '10000',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
    }, 'EXIT');

    exitButton.onclick = cleanup;

    // Markers
    const marker = createElement('div', {
        position: 'fixed',
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        border: '2px solid #5D5CDE',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#5D5CDE',
        fontWeight: 'bold',
        pointerEvents: 'none',
        zIndex: '9999',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
        fontSize: '12px',
        backgroundColor: 'rgba(93, 92, 222, 0.1)'
    }, 'CLICK<br>STARTING<br>POSITION');

    const clickMarker = createElement('div', {
        position: 'fixed',
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        border: '2px solid #5D5CDE',
        backgroundColor: 'rgba(93, 92, 222, 0.3)',
        display: 'none',
        zIndex: '9999',
        transform: 'translate(-50%, -50%)',
        cursor: 'move'
    });

    const statusLabel = createElement('div', {
        position: 'absolute',
        bottom: '-20px',
        left: '50%',
        transform: 'translateX(-50%)',
        whiteSpace: 'nowrap',
        fontSize: '10px',
        backgroundColor: '#5D5CDE',
        color: 'white',
        padding: '2px 5px',
        borderRadius: '3px'
    }, 'PREVIEW MODE');

    const closeButton = createElement('div', {
        position: 'absolute',
        top: '-10px',
        right: '-10px',
        width: '20px',
        height: '20px',
        backgroundColor: '#5D5CDE',
        color: 'white',
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        fontSize: '12px',
        fontWeight: 'bold'
    }, 'X');

    closeButton.onclick = (e) => {
        e.stopPropagation();
        stopClicking();
        marker.style.display = 'flex';
        clickMarker.style.display = 'none';
        console.log('Click position reset. Click to set a new position.');
    };

    clickMarker.append(statusLabel, closeButton);
    document.body.append(marker, clickMarker, exitButton);

    // Event Handlers
    clickMarker.addEventListener('mousedown', (e) => {
        if (e.target === closeButton) return;
        isDragging = true;
        e.preventDefault();
    });

    const mouseMoveHandler = (e) => {
        if (marker.style.display === 'flex') {
            marker.style.left = e.clientX + 'px';
            marker.style.top = e.clientY + 'px';
        }
        if (isDragging) {
            targetX = e.clientX;
            targetY = e.clientY;
            clickMarker.style.left = targetX + 'px';
            clickMarker.style.top = targetY + 'px';
        }
    };

    const mouseUpHandler = () => {
        if (isDragging) {
            console.log(`Position updated to X: ${targetX}, Y: ${targetY}`);
            isDragging = false;
        }
    };

    const clickHandler = (e) => {
        if (marker.style.display === 'flex' && !isRunning) {
            targetX = e.clientX;
            targetY = e.clientY;
            console.log(`Position set to X: ${targetX}, Y: ${targetY}`);
            marker.style.display = 'none';
            clickMarker.style.display = 'block';
            clickMarker.style.left = targetX + 'px';
            clickMarker.style.top = targetY + 'px';
            startClicking();
        }
    };

    // Add Event Listeners
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
    document.addEventListener('click', clickHandler);

    // Core Functions
    function startClicking() {
        if (isRunning) return;
        isRunning = true;
        updateStatusLabel();
        console.log(`Auto clicking at X: ${targetX}, Y: ${targetY} (${clicksPerSecond} clicks per second)`);
        console.log('Press the X button to stop and reset position');
        
        clickInterval = setInterval(() => {
            clickMarker.style.backgroundColor = 'rgba(93, 92, 222, 0.6)';
            setTimeout(() => clickMarker.style.backgroundColor = 'rgba(93, 92, 222, 0.3)', 50);
            
            if (!previewMode) {
                const elem = document.elementFromPoint(targetX, targetY);
                if (elem) elem.click();
            }
        }, 1000 / clicksPerSecond);
    }

    function stopClicking() {
        clearInterval(clickInterval);
        isRunning = false;
        console.log('Auto clicking stopped');
    }

    function updateStatusLabel() {
        statusLabel.textContent = previewMode ? 'PREVIEW MODE' : 'CLICKING';
        statusLabel.style.backgroundColor = previewMode ? '#5D5CDE' : '#ff4757';
    }

    function cleanup() {
        stopClicking();
        [exitButton, marker, clickMarker, cpsControl].forEach(el => el.remove());
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
        document.removeEventListener('click', clickHandler);
        window.autoClicker = undefined;
        console.log('Auto Clicker script removed');
    }

    // Helper function to create elements
    function createElement(type, styles, content) {
        const el = document.createElement(type);
        Object.assign(el.style, styles);
        if (content) el.innerHTML = content;
        return el;
    }

    // Initial Setup
    marker.style.left = (window.innerWidth / 2) + 'px';
    marker.style.top = (window.innerHeight / 2) + 'px';

    // Public API
    window.autoClicker = {
        stop: () => {
            stopClicking();
            marker.style.display = 'flex';
            clickMarker.style.display = 'none';
            console.log('Auto clicker stopped. Click to set a new position.');
        },
        setSpeed: (cps) => {
            if (cps > 0 && cps <= 100) { // Adjusted max to match slider
                clicksPerSecond = cps;
                cpsSlider.value = cps;
                cpsLabel.textContent = `CPS: ${clicksPerSecond}`;
                console.log(`Click speed set to ${cps} clicks per second`);
                if (isRunning) {
                    stopClicking();
                    startClicking();
                }
            } else {
                console.log('Speed must be between 1 and 100 clicks per second');
            }
        },
        previewMode: (enabled) => {
            previewMode = enabled;
            console.log(`Preview mode ${previewMode ? 'enabled' : 'disabled'}`);
            updateStatusLabel();
            if (isRunning) {
                stopClicking();
                startClicking();
            }
        },
        status: () => {
            console.log(`Status: ${isRunning ? 'Running' : 'Stopped'}`);
            console.log(`Mode: ${previewMode ? 'Preview (not clicking)' : 'Active (clicking)'}`);
            console.log(`Position: X: ${targetX}, Y: ${targetY}`);
            console.log(`Speed: ${clicksPerSecond} clicks per second`);
        },
        start: () => {
            if (!isRunning && clickMarker.style.display === 'block') {
                startClicking();
            } else if (marker.style.display === 'flex') {
                console.log('Set a position first by clicking on the screen');
            }
        }
    };

    // Initialization Messages
    console.log('Enhanced Auto Clicker initialized!');
    console.log('Move your mouse and click to set the target position');
    console.log('You can drag the purple marker to reposition it');
    console.log('Current mode: ACTIVE (actually clicking)');
    console.log('\nAdditional commands:');
    console.log('- autoClicker.previewMode(false) - Enable actual clicking');
    console.log('- autoClicker.stop() - Stop and reset position');
    console.log('- autoClicker.start() - Start clicking at current position');
    console.log('- autoClicker.setSpeed(10) - Change clicks per second (1-100)');
    console.log('- autoClicker.status() - Show current status');
})();
