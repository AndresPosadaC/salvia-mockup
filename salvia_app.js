let sumaCorrectaReporte = 0;
let sumaCorrectaLogin = 0;

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
    
    // Validar Captcha del Reporte
    const captchaValor = document.getElementById('reporte-captcha').value;
    if (captchaValor !== sumaCorrectaReporte.toString()) {
        alert("Suma de verificación incorrecta. Intente de nuevo.");
        generarCaptchas(); // Regenera ambas sumas
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
    
    // Validar Captcha del Login
    const captchaValor = document.getElementById('login-captcha').value;
    if (captchaValor !== sumaCorrectaLogin.toString()) {
        alert("Suma de seguridad incorrecta. Intente de nuevo.");
        generarCaptchas(); // Regenera ambas sumas
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
    
    // Ocultar todas las vistas y quitar el estilo activo del menú
    views.forEach(v => {
        document.getElementById(`view-${v}`).classList.add('hidden');
        document.getElementById(`nav-${v}`).classList.remove('sidebar-active');
    });
    
    // Mostrar la vista seleccionada y marcar el menú activo
    document.getElementById(`view-${viewId}`).classList.remove('hidden');
    document.getElementById(`nav-${viewId}`).classList.add('sidebar-active');

    // Mapeo: Relacionamos cada vista con su título y su llave de historia de usuario
    const viewConfig = {
        'dashboard':   { title: 'Panel de Control Estratégico', storyKey: 'panel_control' },
        'seguimiento': { title: 'Monitoreo de Rutas y Barreras', storyKey: 'seguimiento_casos' },
        'tamizaje':    { title: 'Valoración Técnica de Riesgo de Feminicidio', storyKey: 'tamizaje_riesgo' },
        'masp':        { title: 'Mockup Aplicativo MASP', storyKey: 'modulo_masp' },
        'lgbtiq':      { title: 'Enfoque Diferencial de Género', storyKey: 'modulo_lgbtiq' }
    };

    const config = viewConfig[viewId];
    
    // Magia pura: Inyectamos el título y el botón dinámico con la llave correcta
    document.getElementById('view-title').innerHTML = `
        ${config.title}
        <button onclick="abrirModalHistoria('${config.storyKey}')" class="ml-4 text-gray-400 hover:text-[#FCCC3C] transition-colors align-middle" title="Ver Historia de Usuario">
            <i class="fa-solid fa-circle-info text-2xl drop-shadow-sm"></i>
        </button>
    `;
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
// 8. MENÚ HAMBURGUESA MÓVIL
// ==========================================
function toggleMenuMovil() {
    const menu = document.getElementById('menu-movil');
    // La clase 'hidden' de Tailwind oculta el elemento. Toggle la quita o la pone.
    menu.classList.toggle('hidden');
}

// ==========================================
// 9. GENERADOR DE CAPTCHAS DINÁMICOS
// ==========================================
function generarCaptchas() {
    // --- 1. CAPTCHA PARA EL REPORTE CIUDADANO ---
    const num1R = Math.floor(Math.random() * 10) + 1;
    const num2R = Math.floor(Math.random() * 10) + 1;
    sumaCorrectaReporte = num1R + num2R;
    
    const textoReporte = document.getElementById('captcha-text'); // El original
    if (textoReporte) textoReporte.innerText = `Verificación: ${num1R} + ${num2R} =`;
    const inputReporte = document.getElementById('reporte-captcha');
    if (inputReporte) inputReporte.value = '';

    // --- 2. CAPTCHA PARA EL INGRESO DE FUNCIONARIOS ---
    const num1L = Math.floor(Math.random() * 10) + 1;
    const num2L = Math.floor(Math.random() * 10) + 1;
    sumaCorrectaLogin = num1L + num2L;
    
    const textoLogin = document.getElementById('login-captcha-text'); // El nuevo
    if (textoLogin) textoLogin.innerText = `Seguridad: ${num1L} + ${num2L} =`;
    const inputLogin = document.getElementById('login-captcha');
    if (inputLogin) inputLogin.value = '';
}

// ==========================================
// 10. GESTOR DE HISTORIAS DE USUARIO (MODAL)
// ==========================================

// Aquí guardamos el "diccionario" de las historias
// Aquí guardamos el "diccionario" de las historias
const userStories = {
    // --- PÚBLICAS ---
    'reporte': {
        title: 'Registro de Atención Inicial',
        role: 'Ciudadana / Víctima',
        content: '"Como ciudadana en situación de riesgo, quiero poder registrar mis datos demográficos básicos y una descripción de los hechos en un formulario seguro, para que el sistema active una alerta temprana y la Línea 155 pueda contactarme."'
    },
    'login': {
        title: 'Acceso de Funcionarios',
        role: 'Operador / Funcionario de Red',
        content: '"Como operador de la Línea 155, necesito un portal de acceso seguro que valide mi identidad, para poder ingresar al sistema y visualizar los casos reportados por las ciudadanas manteniendo la confidencialidad."'
    },
    // --- DASHBOARD PRIVADO ---
    'panel_control': {
        title: 'Panel de Control Estratégico',
        role: 'Supervisor / Director',
        content: '"Como supervisor, necesito visualizar métricas en tiempo real sobre los casos reportados, niveles de riesgo y tiempos de respuesta, para tomar decisiones informadas y asignar recursos eficientemente en la red de atención."'
    },
    'seguimiento_casos': {
        title: 'Monitoreo de Rutas',
        role: 'Operador 155 / Orientador',
        content: '"Como operador, quiero ver una bandeja de entrada con los casos recién reportados, ordenados por urgencia y semaforizados, para poder iniciar el contacto de manera prioritaria y activar la ruta institucional."'
    },
    'tamizaje_riesgo': {
        title: 'Valoración Técnica de Riesgo',
        role: 'Profesional Psicosocial / Comisaría',
        content: '"Como profesional en la ruta, necesito aplicar un cuestionario estandarizado que calcule automáticamente el riesgo de feminicidio, para clasificar el nivel de alerta (Extremo, Moderado, Bajo) y justificar medidas de protección."'
    },
    'modulo_masp': {
        title: 'Módulo MASP',
        role: 'Mujeres en Actividades Sexuales Pagas',
        content: '"Como usuaria del ecosistema MASP, necesito contar con un botón de pánico y un canal de reporte discreto que me permita alertar a las autoridades si me encuentro en una situación de violencia en mi entorno laboral."'
    },
    'modulo_lgbtiq': {
        title: 'Enfoque Diferencial de Género',
        role: 'Analista de Casos',
        content: '"Como analista, necesito visualizar indicadores y variables específicas de identidad de género y orientación sexual, para garantizar que la atención cumpla con el enfoque diferencial y no revictimice a la población diversa."'
    }
};

function abrirModalHistoria(storyKey) {
    const story = userStories[storyKey];
    if (!story) return; // Si no existe la historia, no hace nada
    
    // Inyectar los textos en el HTML del modal
    document.getElementById('story-title').innerHTML = `<i class="fa-solid fa-book-open mr-2"></i> ${story.title}`;
    document.getElementById('story-role').innerText = `Rol: ${story.role}`;
    document.getElementById('story-content').innerText = story.content;
    
    // Mostrar el modal
    document.getElementById('story-modal').classList.remove('hidden');
}

function cerrarModalHistoria() {
    // Ocultar el modal
    document.getElementById('story-modal').classList.add('hidden');
}

// ==========================================
// INICIALIZADOR GENERAL DE LA APLICACIÓN
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    navPublic('home-view');
    cargarCacheAlInicio(); 
    generarCaptchas(); // <-- Ahora en plural
});