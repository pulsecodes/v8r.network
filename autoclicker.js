javascript:(function() {
  const clicksPerSecond = prompt("How many clicks per second? (1-100)", "20");
  if (!clicksPerSecond || isNaN(clicksPerSecond) || clicksPerSecond < 1 || clicksPerSecond > 100) {
    alert("Please enter a valid number between 1 and 100");
    return;
  }
  
  alert("Auto-clicker ready! Click on the target area to start clicking. Press ESC to stop.");
  
  let clickInterval;
  let isRunning = false;
  let targetElement = null;
  
  function clickTarget() {
    if (targetElement) {
      // Try multiple click methods to ensure it registers
      targetElement.dispatchEvent(new MouseEvent('mousedown', {bubbles: true}));
      targetElement.dispatchEvent(new MouseEvent('mouseup', {bubbles: true}));
      targetElement.click();
    }
  }
  
  document.addEventListener('click', function(e) {
    if (!isRunning) {
      targetElement = e.target;
      isRunning = true;
      
      clickInterval = setInterval(clickTarget, 1000 / clicksPerSecond);
      console.log(`Started clicking at ${clicksPerSecond} CPS`);
    }
  }, {once: true});
  
  document.addEventListener('keydown', function(e) {
    if (e.key === "Escape" && isRunning) {
      clearInterval(clickInterval);
      isRunning = false;
      console.log("Auto-clicker stopped");
    }
  });
})();
