// ==========================================
// 1. RUTEO PÚBLICO
// ==========================================
function navPublic(viewId) {
    document.querySelectorAll('#public-app main > section').forEach(el => el.classList.add('hidden-view'));
    document.getElementById(viewId).classList.remove('hidden-view');
    const btnLogin = document.getElementById('btn-nav-login');
    if(viewId === 'home-view') btnLogin.style.display = 'block';
    else btnLogin.style.display = 'none';
}

// ==========================================
// 2. TECLADO VIRTUAL
// ==========================================
let inputActivo = null;
const teclado = document.getElementById('virtual-keypad');

document.querySelectorAll('.numpad-trigger').forEach(input => {
    input.addEventListener('click', function() {
        inputActivo = this;
        document.querySelectorAll('.numpad-trigger').forEach(t => t.classList.remove('ring-2', 'ring-salvia-purple'));
        this.classList.add('ring-2', 'ring-salvia-purple');
        teclado.classList.add('show');
    });
});

document.querySelectorAll('.keypad-btn').forEach(btn => {
    btn.addEventListener('click', function() { 
        if(inputActivo) inputActivo.value += this.innerText; 
    });
});

function borrarUltimo() { if(inputActivo) inputActivo.value = inputActivo.value.slice(0, -1); }
function limpiarInput() { if(inputActivo) inputActivo.value = ''; }
function cerrarTeclado() { 
    teclado.classList.remove('show'); 
    if(inputActivo) inputActivo.classList.remove('ring-2', 'ring-salvia-purple'); 
}

// ==========================================
// 3. MOTOR DE DATOS Y CACHÉ (LOCALSTORAGE)
// ==========================================
function enviarReporte(e) {
    e.preventDefault();
    
    // Validar Captcha del Registro Público
    const captchaValor = document.getElementById('reporte-captcha').value;
    if (captchaValor !== '12') {
        alert("Suma de verificación incorrecta. 5 + 7 es 12. Intente de nuevo.");
        return;
    }

    const tel = document.getElementById('reporte-tel').value;
    
    let casosEnCache = JSON.parse(localStorage.getItem('casosSalvia')) || [];
    const nuevoCaso = {
        id: 'VBG-2026-' + Math.floor(1000 + Math.random() * 9000), 
        tel: tel,
        fecha: 'Hace un momento'
    };
    
    casosEnCache.push(nuevoCaso);
    localStorage.setItem('casosSalvia', JSON.stringify(casosEnCache));

    inyectarFilaTabla(nuevoCaso);
    actualizarMetricas();

    alert("Reporte guardado exitosamente. Ahora ingrese como funcionario para ver el caso enrutado.");
    e.target.reset();
    cerrarTeclado();
    navPublic('home-view'); // Mejor devolverlo al Home después de reportar
}

// Funciones auxiliares para pintar los datos del Caché
function inyectarFilaTabla(caso) {
    const tbody = document.getElementById('tabla-seguimiento');
    if(!tbody) return;
    
    const newRow = `<tr>
        <td class="px-6 py-4 font-mono text-xs">${caso.id}</td>
        <td class="px-6 py-4 font-medium">Ciudadana (Tel: ${caso.tel})</td>
        <td class="px-6 py-4"><span class="px-2 py-1 rounded bg-purple-100 text-purple-700 text-xs font-bold">Primer Contacto</span></td>
        <td class="px-6 py-4">${caso.fecha}</td>
        <td class="px-6 py-4"><button class="bg-salvia-purple text-white px-3 py-1 rounded shadow hover:bg-purple-700 text-xs font-bold">INICIAR RUTA</button></td>
    </tr>`;
    tbody.insertAdjacentHTML('afterbegin', newRow);
}

function actualizarMetricas() {
    let casosEnCache = JSON.parse(localStorage.getItem('casosSalvia')) || [];
    const metricElement = document.getElementById('metric-nuevo');
    if(metricElement) {
        // Sumamos los casos quemados en el HTML (1240) + los nuevos que estén en caché
        metricElement.innerText = (1240 + casosEnCache.length).toLocaleString();
    }
}

function cargarCacheAlInicio() {
    let casosEnCache = JSON.parse(localStorage.getItem('casosSalvia')) || [];
    casosEnCache.forEach(caso => {
        inyectarFilaTabla(caso);
    });
    actualizarMetricas();
}

// ==========================================
// 4. LÓGICA DE LOGIN Y CIERRE DE SESIÓN
// ==========================================
function ingresarDashboard(e) {
    e.preventDefault();
    const captchaValor = document.getElementById('login-captcha').value;
    if (captchaValor !== '20') {
        alert("Suma de seguridad incorrecta. Intente de nuevo.");
        return;
    }
    cerrarTeclado();
    document.getElementById('public-app').classList.add('hidden-view');
    document.getElementById('dashboard-app').classList.remove('hidden-view');
    switchDashView('dashboard');
    e.target.reset();
}

function cerrarSesion() {
    document.getElementById('dashboard-app').classList.add('hidden-view');
    document.getElementById('public-app').classList.remove('hidden-view');
    navPublic('home-view');
}

// ==========================================
// 5. NAVEGACIÓN DEL DASHBOARD PRIVADO
// ==========================================
function switchDashView(viewId) {
    const views = ['dashboard', 'seguimiento', 'tamizaje', 'masp', 'lgbtiq'];
    views.forEach(v => {
        document.getElementById(`view-${v}`).classList.add('hidden');
        document.getElementById(`nav-${v}`).classList.remove('sidebar-active');
    });
    document.getElementById(`view-${viewId}`).classList.remove('hidden');
    document.getElementById(`nav-${viewId}`).classList.add('sidebar-active');

    const titles = {
        'dashboard': 'Panel de Control Estratégico',
        'seguimiento': 'Monitoreo de Rutas y Barreras',
        'tamizaje': 'Valoración Técnica de Riesgo de Feminicidio',
        'masp': 'Mockup Aplicativo MASP',
        'lgbtiq': 'Enfoque Diferencial de Género'
    };
    document.getElementById('view-title').innerText = titles[viewId];
}

// ==========================================
// 6. MOTOR DE RIESGO (TAMIZAJE)
// ==========================================
document.querySelectorAll('.risk-calc').forEach(radio => {
    radio.addEventListener('change', () => {
        let totalScore = 0;
        document.querySelectorAll('.risk-calc:checked').forEach(c => totalScore += parseInt(c.value));
        const scoreDisplay = document.getElementById('risk-score');
        const badge = document.getElementById('risk-badge');
        
        scoreDisplay.innerText = totalScore;
        if(totalScore >= 15) {
            scoreDisplay.className = "text-6xl font-black text-red-600 transition-colors";
            badge.innerText = "ALERTA VITAL - RIESGO EXTREMO";
            badge.className = "mt-4 inline-block px-4 py-1.5 rounded-full bg-red-100 text-red-600 font-bold text-sm animate-bounce";
        } else if(totalScore >= 5) {
            scoreDisplay.className = "text-6xl font-black text-amber-500 transition-colors";
            badge.innerText = "RIESGO MODERADO - SEGUIMIENTO";
            badge.className = "mt-4 inline-block px-4 py-1.5 rounded-full bg-amber-100 text-amber-600 font-bold text-sm";
        } else {
            scoreDisplay.className = "text-6xl font-black text-slate-800 transition-colors";
            badge.innerText = "RIESGO BAJO";
            badge.className = "mt-4 inline-block px-4 py-1.5 rounded-full bg-slate-100 text-slate-600 font-bold text-sm";
        }
    });
});

// ==========================================
// 7. PANEL DE COMENTARIOS LATERAL
// ==========================================
function toggleDesignControls() { document.getElementById('design-controls').classList.toggle('translate-x-full'); }
function submitFeedback() {
    const text = document.getElementById('feedback-text').value;
    if(!text) return;
    alert("Observación guardada. Esta interacción demostrará control al cliente.");
    document.getElementById('feedback-text').value = '';
    toggleDesignControls();
}

// ==========================================
// INICIALIZADOR GENERAL DE LA APLICACIÓN
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    navPublic('home-view');
    cargarCacheAlInicio(); // Ejecuta la lectura de caché apenas abre la página
});