/**
 * JavaScript Interactions for Windek Group Maintenance Page
 * Features:
 * 1. Dynamic Countdown Timer
 * 2. Interactive Canvas Network Particles
 * 3. Subscription Form Validation & Simulation
 */
document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. COUNTDOWN TIMER
  // ==========================================
  // Set launch date to exactly 7 days from current date
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 7);
  targetDate.setHours(12, 0, 0, 0); // 12:00 PM launch
  const daysVal = document.getElementById('days');
  const hoursVal = document.getElementById('hours');
  const minutesVal = document.getElementById('minutes');
  const secondsVal = document.getElementById('seconds');
  function updateCountdown() {
    const now = new Date().getTime();
    const difference = targetDate.getTime() - now;
    if (difference <= 0) {
      // Countdown completed, set all values to 00
      daysVal.textContent = '00';
      hoursVal.textContent = '00';
      minutesVal.textContent = '00';
      secondsVal.textContent = '00';
      return;
    }
    // Time calculations
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);
    // Format numbers with leading zero
    daysVal.textContent = String(days).padStart(2, '0');
    hoursVal.textContent = String(hours).padStart(2, '0');
    minutesVal.textContent = String(minutes).padStart(2, '0');
    secondsVal.textContent = String(seconds).padStart(2, '0');
  }
  // Update timer every second
  updateCountdown();
  setInterval(updateCountdown, 1000);
  // ==========================================
  // 2. CANVAS INTERACTIVE NETWORK PARTICLES
  // ==========================================
  const canvas = document.getElementById('particlesCanvas');
  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;
  const particles = [];
  let connectionDistance = 140;
  let mouse = { x: null, y: null, radius: 180 };
  // Adjust particle count depending on screen width
  let particleCount = Math.floor((width * height) / 9000);
  if (particleCount > 100) particleCount = 100;
  if (particleCount < 30) particleCount = 30;
  // Particle Constructor
  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.35; // Slow movement speed
      this.vy = (Math.random() - 0.5) * 0.35;
      this.radius = Math.random() * 2.5 + 1; // Varying particle sizes
      this.alpha = Math.random() * 0.5 + 0.2;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      // Wrap around edges screen
      if (this.x < 0) this.x = width;
      if (this.x > width) this.x = 0;
      if (this.y < 0) this.y = height;
      if (this.y > height) this.y = 0;
      // Mouse interactive push/pull effect
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < mouse.radius) {
          // Subtle attraction toward mouse
          const force = (mouse.radius - dist) / mouse.radius;
          this.x += (dx / dist) * force * 0.6;
          this.y += (dy / dist) * force * 0.6;
        }
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(18, 132, 191, ${this.alpha})`; // Secondary Teal Color
      ctx.fill();
    }
  }
  // Populate Particles array
  function initParticles() {
    particles.length = 0;
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }
  // Draw lines connecting close particles
  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const p1 = particles[i];
        const p2 = particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < connectionDistance) {
          // Line opacity gets higher as nodes get closer
          const opacity = (1 - (distance / connectionDistance)) * 0.15;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          
          // Gradient between brand teal and navy-purple for connector links
          ctx.strokeStyle = `rgba(18, 132, 191, ${opacity})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
      // Connect particles to mouse cursor if near
      if (mouse.x !== null && mouse.y !== null) {
        const p = particles[i];
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius - 30) {
          const opacity = (1 - (distance / (mouse.radius - 30))) * 0.22;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(244, 123, 32, ${opacity})`; // Orange accent link to mouse
          ctx.lineWidth = 0.9;
          ctx.stroke();
        }
      }
    }
  }
  // Animation loop
  function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    drawConnections();
    requestAnimationFrame(animate);
  }
  // Event Listeners for canvas background
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });
  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    
    // Re-initialize particles on resizing
    particleCount = Math.floor((width * height) / 9000);
    if (particleCount > 100) particleCount = 100;
    if (particleCount < 30) particleCount = 30;
    initParticles();
  });
  // Start Canvas animation
  initParticles();
  animate();
  // ==========================================
  // 3. PROGRESS BAR ANIMATION
  // ==========================================
  const progressFill = document.getElementById('progressFill');
  const progressPercent = document.getElementById('progressPercent');
  let currentProgress = 75;
  const maxProgress = 99;
  function updateProgress() {
    if (currentProgress < maxProgress) {
      // Slow down progress as it increases (logarithmic feel)
      const increment = Math.random() * 1.5 + 0.1;
      currentProgress = Math.min(currentProgress + increment, maxProgress);
      progressFill.style.width = currentProgress + '%';
      progressPercent.textContent = Math.floor(currentProgress) + '%';
      // Progress slows down as it gets higher
      const nextDelay = currentProgress > 95 ? 8000 : currentProgress > 90 ? 5000 : 2500;
      setTimeout(updateProgress, nextDelay);
    }
  }
  // Start progress animation after a small delay
  setTimeout(updateProgress, 3000);
  // ==========================================
  // 4. SUBSCRIPTION FORM VALIDATION & SIMULATION
  // ==========================================
  const form = document.getElementById('subscribeForm');
  const emailInput = document.getElementById('emailInput');
  const inputWrapper = emailInput.closest('.input-wrapper');
  const submitBtn = document.getElementById('submitBtn');
  const feedback = document.getElementById('formFeedback');
  function validateEmail(email) {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  }
  emailInput.addEventListener('input', () => {
    // Remove invalid style on typing
    inputWrapper.classList.remove('invalid');
  });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailValue = emailInput.value.trim();
    if (!validateEmail(emailValue)) {
      inputWrapper.classList.add('invalid');
      emailInput.focus();
      return;
    }
    // Form is valid - enter loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    emailInput.disabled = true;
    feedback.className = 'form-feedback';
    feedback.textContent = '';
    // Simulate Server Request (1.5 seconds delay)
    setTimeout(() => {
      submitBtn.classList.remove('loading');
      
      // Success feedback state
      feedback.textContent = "Subscription active! We've registered your email.";
      feedback.classList.add('visible', 'success');
      // Reset form fields
      form.reset();
      
      // Keep input disabled but restore button for future if they want to subscribe another email
      setTimeout(() => {
        emailInput.disabled = false;
        submitBtn.disabled = false;
      }, 2000);
    }, 1500);
  });
});
