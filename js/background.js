/**
 * Nihal S Jain - Portfolio Background Animation (Three.js)
 * Generates an interactive 3D digital-signal / neural-network particle wave
 * PLUS a central, floating, wireframe holographic 3D Torus Knot model.
 */

(function () {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    let scene, camera, renderer;
    let particles, geometry, material;
    let torusKnot, torusMaterial;
    
    // Wave parameters
    const SEPARATION = 45;
    const AMOUNTX = 75;
    const AMOUNTY = 75;
    const numParticles = AMOUNTX * AMOUNTY;
    
    let positions = new Float32Array(numParticles * 3);
    let scales = new Float32Array(numParticles);

    // Animation values
    let count = 0;
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    
    let scrollSpeedFactor = 1.0;
    let targetScrollSpeedFactor = 1.0;

    // Window properties
    let windowHalfX = window.innerWidth / 2;
    let windowHalfY = window.innerHeight / 2;

    function init() {
        // 1. Scene & Camera Setup
        scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x050505, 0.0007); // Smooth foggy fading in depth

        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
        camera.position.z = 1200;
        camera.position.y = 450;
        camera.position.x = 0;

        // 2. Initialize Particle Positions and Scales (Grid Wave)
        let i = 0;
        let j = 0;

        for (let ix = 0; ix < AMOUNTX; ix++) {
            for (let iy = 0; iy < AMOUNTY; iy++) {
                // Flat grid arrangement centered in scene
                positions[i] = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2;     // X
                positions[i + 1] = 0;                                            // Y (height)
                positions[i + 2] = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2; // Z
                
                scales[j] = 1;
                
                i += 3;
                j++;
            }
        }

        // 3. Wave Geometry & Material Construction
        geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

        // Create a circular particle texture dynamically
        const particleTexture = createCircleTexture();

        material = new THREE.PointsMaterial({
            size: 6,
            map: particleTexture,
            color: 0xBC13FE, // Core theme magenta color
            transparent: true,
            opacity: 0.75,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });

        // Points Mesh Creation
        particles = new THREE.Points(geometry, material);
        scene.add(particles);

        // 4. ADD 3D MODEL: Central Floating Holographic Torus Knot
        // Creates a beautiful, complex 3D wireframe knot representing an AI engine or core data loop
        const torusGeometry = new THREE.TorusKnotGeometry(130, 25, 120, 12, 3, 4);
        
        torusMaterial = new THREE.MeshBasicMaterial({
            color: 0x00F0FF, // Glow cyan
            wireframe: true,
            transparent: true,
            opacity: 0.35,
            blending: THREE.AdditiveBlending
        });
        
        torusKnot = new THREE.Mesh(torusGeometry, torusMaterial);
        torusKnot.position.set(0, 180, 0); // Position it floating in the center above the wave
        scene.add(torusKnot);

        // Add secondary smaller inner sphere core inside the knot
        const coreGeometry = new THREE.SphereGeometry(60, 16, 16);
        const coreMaterial = new THREE.MeshBasicMaterial({
            color: 0xBC13FE,
            wireframe: true,
            transparent: true,
            opacity: 0.2,
            blending: THREE.AdditiveBlending
        });
        const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
        torusKnot.add(coreMesh); // Nest it inside the rotating torus knot

        // 5. WebGL Renderer Setup
        renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(window.innerWidth, window.innerHeight);

        // 6. Event Listeners
        document.addEventListener('mousemove', onDocumentMouseMove);
        window.addEventListener('resize', onWindowResize);
        window.addEventListener('scroll', onScroll);
        
        animate();
    }

    // Canvas generator for particle maps
    function createCircleTexture() {
        const matCanvas = document.createElement('canvas');
        matCanvas.width = 16;
        matCanvas.height = 16;
        const ctx = matCanvas.getContext('2d');
        
        // Gradient for a glowing orb look
        const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
        grad.addColorStop(0, 'rgba(255,255,255,1)');
        grad.addColorStop(0.3, 'rgba(230,200,255,0.8)');
        grad.addColorStop(1, 'rgba(188,19,254,0)');
        
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 16, 16);
        
        return new THREE.CanvasTexture(matCanvas);
    }

    function onDocumentMouseMove(event) {
        targetX = (event.clientX - windowHalfX) * 0.3;
        targetY = (event.clientY - windowHalfY) * 0.2;
    }

    function onWindowResize() {
        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    let lastScrollTop = 0;
    function onScroll() {
        const st = window.pageYOffset || document.documentElement.scrollTop;
        const diff = Math.abs(st - lastScrollTop);
        
        // Temporarily accelerate wave and model rotation based on scroll magnitude
        targetScrollSpeedFactor = 1.0 + Math.min(diff * 0.08, 5.0);
        lastScrollTop = st <= 0 ? 0 : st;
    }

    function animate() {
        requestAnimationFrame(animate);
        render();
    }

    function render() {
        // Interpolate mouse targets for camera orbit
        mouseX += (targetX - mouseX) * 0.05;
        mouseY += (targetY - mouseY) * 0.05;

        // Smoothly decay scroll speed acceleration
        scrollSpeedFactor += (targetScrollSpeedFactor - scrollSpeedFactor) * 0.05;
        targetScrollSpeedFactor += (1.0 - targetScrollSpeedFactor) * 0.05;

        // Position camera based on mouse
        camera.position.x += (mouseX - camera.position.x) * 0.05;
        camera.position.y += (-mouseY + 450 - camera.position.y) * 0.05;
        camera.lookAt(new THREE.Vector3(0, 100, 0));

        // Rotate the 3D Torus model based on time and scroll factor
        if (torusKnot) {
            torusKnot.rotation.x += 0.005 * scrollSpeedFactor;
            torusKnot.rotation.y += 0.01 * scrollSpeedFactor;
            
            // Add a subtle floating bounce to the 3D model
            torusKnot.position.y = 180 + Math.sin(count * 0.5) * 15;
        }

        // Wave equations updating grid points
        const positions = particles.geometry.attributes.position.array;
        const scales = particles.geometry.attributes.scale.array;

        let i = 0;
        let j = 0;

        for (let ix = 0; ix < AMOUNTX; ix++) {
            for (let iy = 0; iy < AMOUNTY; iy++) {
                // Double sine wave
                positions[i + 1] = (Math.sin((ix + count) * 0.3) * SEPARATION * 1.5) +
                                   (Math.sin((iy + count) * 0.5) * SEPARATION * 1.5);

                scales[j] = (Math.sin((ix + count) * 0.3) + 1) * 3 +
                            (Math.sin((iy + count) * 0.5) + 1) * 3;

                i += 3;
                j++;
            }
        }

        particles.geometry.attributes.position.needsUpdate = true;
        particles.geometry.attributes.scale.needsUpdate = true;

        // Increment time-based counter
        count += 0.04 * scrollSpeedFactor;
        
        // Dynamic HSL shifting for both particles and wireframe Torus Knot
        const waveHue = (0.78 + Math.sin(count * 0.02) * 0.05) % 1.0;
        const modelHue = (0.50 + Math.cos(count * 0.01) * 0.05) % 1.0;
        
        material.color.setHSL(waveHue, 0.95, 0.53);
        torusMaterial.color.setHSL(modelHue, 0.95, 0.55);

        renderer.render(scene, camera);
    }

    // Handle initialization once script runs
    if (window.THREE) {
        init();
    } else {
        window.addEventListener('DOMContentLoaded', () => {
            if (window.THREE) init();
        });
    }
})();
