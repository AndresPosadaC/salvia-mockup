// ==========================================
// VARIABLES GLOBALES
// ==========================================
let sumaCorrectaReporte = 0;
let vistaActualGlobal = 'Portal Público (Inicio)'; // Rastreará dónde está el usuario
let sumaCorrectaLogin = 0;
let rolActual = 'tercero';
let asistenteVozActivo = false;
let inputActivo = null;

// ==========================================
// 1. RUTEO PÚBLICO
// ==========================================
function navPublic(viewId) {
    document.querySelectorAll('#public-app main > section').forEach(el => el.classList.add('hidden-view'));
    document.getElementById(viewId).classList.remove('hidden-view');
    const btnLogin = document.getElementById('btn-nav-login');
    if(viewId === 'home-view') btnLogin.style.display = 'block';
    else btnLogin.style.display = 'none';

    // Actualizar el rastreador para el Google Form
    if(viewId === 'home-view') vistaActualGlobal = 'Portal Público (Inicio)';
    else if(viewId === 'reporte-view') vistaActualGlobal = 'Formulario de Reporte (Ciudadano/Tercero)';
    else if(viewId === 'login-view') vistaActualGlobal = 'Login / Acceso de Funcionarios';
    else if(viewId === 'login-victima-view' || viewId === 'intermedio-funcionario-view') vistaActualGlobal = 'Portal de Mujeres (Login/Trazabilidad)';
}

// ==========================================
// 2. FORMULARIO DINÁMICO (NUEVO V2.0)
// ==========================================
function prepararFormulario(rol) {
    rolActual = rol;
    const titulo = document.getElementById('form-dynamic-title');
    const instruccion = document.getElementById('form-dynamic-instruction');
    const btnSubmit = document.querySelector('#form-reporte button[type="submit"]');

    if (rol === 'tercero') {
        titulo.innerText = "Reporte por Terceros (Familiar / Conocido)";
        instruccion.innerHTML = "<strong>Orientación:</strong> Los datos a continuación deben ser <strong>exclusivamente los de la víctima</strong> para que podamos contactarla. El campo de teléfono es el único obligatorio.";
        btnSubmit.innerText = "Enviar Reporte a la Línea 155";
    } else if (rol === 'victima') {
        titulo.innerText = "Mi Registro Personal";
        instruccion.innerHTML = "<strong>Orientación:</strong> Actualice su información personal. El sistema resguardará sus datos con máxima seguridad.";
        btnSubmit.innerText = "Guardar mis datos";
    } else if (rol === 'funcionario') {
        titulo.innerText = "Registro de Caso Entrante (Operador)";
        instruccion.innerHTML = "<strong>Orientación Operador:</strong> Diligencie los datos proporcionados por la ciudadana en la llamada. Verifique el número de contacto.";
        btnSubmit.innerText = "Radicar Caso en el Sistema";
    }
    
    generarCaptchas();
    navPublic('reporte-view');
    if(asistenteVozActivo) {leerTexto(titulo.innerText + ". " + instruccion.innerText.replace('Orientación:', 'Orientación. '));}
}

// ==========================================
// 3. MOTOR DE DATOS Y CACHÉ (LOCALSTORAGE)
// ==========================================
function enviarReporte(e) {
    e.preventDefault();
    
    const tel = document.getElementById('reporte-tel').value;
    // VALIDACIÓN ESTRICTA DE TELÉFONO
    if (!tel || tel.trim() === '') {
        alert("El número de teléfono es obligatorio para poder contactarla.");
        if (asistenteVozActivo) leerTexto("Error. El campo de teléfono es obligatorio.");
        return;
    }

    const captchaValor = document.getElementById('reporte-captcha').value;
    if (captchaValor !== sumaCorrectaReporte.toString()) {
        alert("Suma de verificación incorrecta. Intente de nuevo.");
        generarCaptchas();
        return;
    }

    let casosEnCache = JSON.parse(localStorage.getItem('casosSalvia')) || [];
    const nuevoCaso = {
        id: 'VBG-2026-' + Math.floor(1000 + Math.random() * 9000),
        tel: tel,
        fecha: 'Hace un momento',
        rol: rolActual 
    };
    
    casosEnCache.push(nuevoCaso);
    localStorage.setItem('casosSalvia', JSON.stringify(casosEnCache));

    inyectarFilaTabla(nuevoCaso);
    actualizarMetricas();

    alert("Registro guardado exitosamente.");
    e.target.reset();
    cerrarTeclado();
    navPublic('home-view');
}

function inyectarFilaTabla(caso) {
    const tbody = document.getElementById('tabla-seguimiento');
    if(!tbody) return;
    
    const newRow = `<tr>
        <td class="px-6 py-4 font-mono text-xs">${caso.id}</td>
        <td class="px-6 py-4 font-medium">Ciudadana (Tel: ${caso.tel})</td>
        <td class="px-6 py-4"><span class="px-2 py-1 rounded bg-purple-100 text-purple-700 text-xs font-bold">${caso.rol === 'funcionario' ? 'Radicado OP' : 'Primer Contacto'}</span></td>
        <td class="px-6 py-4">${caso.fecha}</td>
        <td class="px-6 py-4"><button class="bg-[#380E44] text-white px-3 py-1 rounded shadow hover:bg-purple-900 text-xs font-bold">INICIAR RUTA</button></td>
    </tr>`;
    tbody.insertAdjacentHTML('afterbegin', newRow);
}

function actualizarMetricas() {
    let casosEnCache = JSON.parse(localStorage.getItem('casosSalvia')) || [];
    const metricElement = document.getElementById('metric-nuevo');
    if(metricElement) metricElement.innerText = (1240 + casosEnCache.length).toLocaleString();
}

function cargarCacheAlInicio() {
    let casosEnCache = JSON.parse(localStorage.getItem('casosSalvia')) || [];
    casosEnCache.forEach(caso => inyectarFilaTabla(caso));
    actualizarMetricas();
}

// FUNCIONES REPARADAS DEL DASHBOARD
function toggleDesignControls() {
    const panel = document.getElementById('design-controls');
    if (panel.classList.contains('translate-x-full')) {
        panel.classList.remove('translate-x-full');
    } else {
        panel.classList.add('translate-x-full');
    }
}

function submitFeedback() {
    alert("Comentario de diseño registrado en la bitácora.");
    document.getElementById('feedback-text').value = '';
    toggleDesignControls();
}

// ==========================================
// 4. LÓGICA DE LOGIN Y CIERRE DE SESIÓN
// ==========================================
function ingresarDashboard(e) {
    e.preventDefault();
    const captchaValor = document.getElementById('login-captcha').value;
    if (captchaValor !== sumaCorrectaLogin.toString()) {
        alert("Suma de seguridad incorrecta. Intente de nuevo.");
        generarCaptchas();
        return;
    }
    cerrarTeclado();
    // V2.0: Va a la vista intermedia en lugar de ir directo al dashboard
    navPublic('intermedio-funcionario-view');
    e.target.reset();
}

function ingresarDashboardFinal() {
    document.getElementById('public-app').classList.add('hidden-view');
    document.getElementById('dashboard-app').classList.remove('hidden-view');
    switchDashView('dashboard');
}

function cerrarSesion() {
    document.getElementById('dashboard-app').classList.add('hidden-view');
    document.getElementById('public-app').classList.remove('hidden-view');
    navPublic('home-view');
}

// ==========================================
// 5. NAVEGACIÓN DEL DASHBOARD Y BOTONES INFO
// ==========================================
function switchDashView(viewId) {
    const views = ['dashboard', 'seguimiento', 'tamizaje', 'masp', 'lgbtiq'];
    views.forEach(v => {
        document.getElementById(`view-${v}`).classList.add('hidden');
        document.getElementById(`nav-${v}`).classList.remove('sidebar-active');
    });
    document.getElementById(`view-${viewId}`).classList.remove('hidden');
    document.getElementById(`nav-${viewId}`).classList.add('sidebar-active');

    const viewConfig = {
        'dashboard':   { title: 'Panel de Control Estratégico', storyKey: 'panel_control' },
        'seguimiento': { title: 'Monitoreo de Rutas y Barreras', storyKey: 'seguimiento_casos' },
        'tamizaje':    { title: 'Valoración Técnica de Riesgo de Feminicidio', storyKey: 'tamizaje_riesgo' },
        'masp':        { title: 'Mockup Aplicativo MASP', storyKey: 'modulo_masp' },
        'lgbtiq':      { title: 'Enfoque Diferencial de Género', storyKey: 'modulo_lgbtiq' }
    };

    const config = viewConfig[viewId];
    document.getElementById('view-title').innerHTML = `
        ${config.title}
        <button onclick="abrirModalHistoria('${config.storyKey}')" class="ml-4 text-gray-400 hover:text-[#FCCC3C] transition-colors align-middle" title="Ver Historia de Usuario">
            <i class="fa-solid fa-circle-info text-2xl drop-shadow-sm"></i>
        </button>
    `;
    // Actualizar el rastreador para el Google Form (DASHBOARD)
    if(viewId === 'dashboard') vistaActualGlobal = 'Dashboard - Panel de Control';
    else if(viewId === 'seguimiento') vistaActualGlobal = 'Dashboard - Bandeja de Seguimiento';
    else if(viewId === 'tamizaje') vistaActualGlobal = 'Dashboard - Tamizaje de Riesgo';
    else if(viewId === 'masp' || viewId === 'lgbtiq') vistaActualGlobal = 'Dashboard - Módulo MASP / LGBTIQ+';
}

// ==========================================
// 6. TECLADO VIRTUAL
// ==========================================
const teclado = document.getElementById('virtual-keypad');
document.addEventListener('click', function(e) {
    if(e.target.classList.contains('numpad-trigger')) {
        inputActivo = e.target;
        document.querySelectorAll('.numpad-trigger').forEach(t => t.classList.remove('ring-2', 'ring-[#380E44]'));
        inputActivo.classList.add('ring-2', 'ring-[#380E44]');
        teclado.classList.add('show');
    }
});
document.querySelectorAll('.keypad-btn').forEach(btn => {
    btn.addEventListener('click', function() { if(inputActivo) inputActivo.value += this.innerText; });
});
function borrarUltimo() { if(inputActivo) inputActivo.value = inputActivo.value.slice(0, -1); }
function limpiarInput() { if(inputActivo) inputActivo.value = ''; }
function cerrarTeclado() { 
    if(teclado) teclado.classList.remove('show'); 
    if(inputActivo) inputActivo.classList.remove('ring-2', 'ring-[#380E44]'); 
}

// ==========================================
// 7. GENERADOR DE CAPTCHAS DINÁMICOS
// ==========================================
function generarCaptchas() {
    const num1R = Math.floor(Math.random() * 10) + 1;
    const num2R = Math.floor(Math.random() * 10) + 1;
    sumaCorrectaReporte = num1R + num2R;
    const textoReporte = document.getElementById('captcha-text');
    if (textoReporte) textoReporte.innerText = `Verificación: ${num1R} + ${num2R} =`;
    const inputReporte = document.getElementById('reporte-captcha');
    if (inputReporte) inputReporte.value = '';

    const num1L = Math.floor(Math.random() * 10) + 1;
    const num2L = Math.floor(Math.random() * 10) + 1;
    sumaCorrectaLogin = num1L + num2L;
    const textoLogin = document.getElementById('login-captcha-text');
    if (textoLogin) textoLogin.innerText = `Seguridad: ${num1L} + ${num2L} =`;
    const inputLogin = document.getElementById('login-captcha');
    if (inputLogin) inputLogin.value = '';
}



// ==========================================
// 8. ACCESIBILIDAD AVANZADA (AUDIO)
// ==========================================
function toggleAsistenteVoz() {
    asistenteVozActivo = !asistenteVozActivo;
    const btn = document.getElementById('btn-audio');
    if (asistenteVozActivo) {
        btn.classList.add('bg-green-500');
        btn.classList.remove('bg-white/20');
        leerTexto("Asistente de voz activado. Navegue por la página usando la tecla Tabulador.");
    } else {
        btn.classList.remove('bg-green-500');
        btn.classList.add('bg-white/20');
        window.speechSynthesis.cancel();
    }
}

function leerTexto(texto) {
    if (!asistenteVozActivo) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(texto);
    utterance.lang = 'es-CO'; 
    utterance.rate = 1.05; // Un poco más natural
    window.speechSynthesis.speak(utterance);
}

// Leer cuando el usuario enfoca un campo (Tabulador)
document.addEventListener('focusin', function(e) {
    if (!asistenteVozActivo) return;
    const elemento = e.target;
    
    if (['INPUT', 'SELECT', 'TEXTAREA'].includes(elemento.tagName)) {
        let textoALeer = "";
        
        // Buscar el label
        const label = elemento.previousElementSibling;
        if (label && label.tagName === 'LABEL') textoALeer += label.innerText + ". ";
        
        // Lógica especial para Selects
        if (elemento.tagName === 'SELECT') {
            const opcionActual = elemento.options[elemento.selectedIndex].text;
            textoALeer += "Lista desplegable. Use las flechas arriba y abajo de su teclado para cambiar. Opción actual: " + opcionActual;
        } 
        // Lógica especial para Captchas (Lee los números reales)
        else if (elemento.id === 'reporte-captcha') {
            const sumaTexto = document.getElementById('captcha-text').innerText;
            textoALeer = "Verificación de seguridad. Por favor escriba el resultado de: " + sumaTexto;
        }
        else if (elemento.id === 'login-captcha') {
            const sumaTexto = document.getElementById('login-captcha-text').innerText;
            textoALeer = "Seguridad. Escriba el resultado de: " + sumaTexto;
        }
        // Campos normales
        else {
            if (elemento.placeholder && elemento.placeholder !== '?') textoALeer += elemento.placeholder;
        }
        
        leerTexto(textoALeer);
    }
});

// Leer cuando el usuario cambia una opción en un Select con las flechas
document.addEventListener('change', function(e) {
    if (!asistenteVozActivo) return;
    if (e.target.tagName === 'SELECT') {
        const nuevaOpcion = e.target.options[e.target.selectedIndex].text;
        leerTexto("Seleccionado: " + nuevaOpcion);
    }
});

// ==========================================
// 9. GESTOR DE HISTORIAS DE USUARIO (MODAL)
// ==========================================
const userStories = {
    'versiones': { 
        title: 'KREIVO: Actualizaciones', 
        role: 'Equipo Desarrollador', 
        content: `
            <div class="bg-blue-50 p-4 rounded-lg border border-blue-100 mt-2">
                <h4 class="font-bold text-[#B53D75] mb-3">Versión 2.0 (Actual)</h4>
                <ul class="space-y-3">
                    <li class="flex items-start">
                        <span class="bg-[#B53D75] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-3 shrink-0 mt-0.5">1</span> 
                        <span>Tres formularios independientes por rol (Víctima / Funcionarios / Terceros).</span>
                    </li>
                    <li class="flex items-start">
                        <span class="bg-[#B53D75] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-3 shrink-0 mt-0.5">2</span> 
                        <span>Activación <i>voice audio</i> (Text-to-Speech) para accesibilidad en formularios.</span>
                    </li>
                    <li class="flex items-start">
                        <span class="bg-[#B53D75] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-3 shrink-0 mt-0.5">3</span> 
                        <span>Botón de tickets integrado para recopilación de <i>feedback</i> contextual.</span>
                    </li>
                </ul>
            </div>
        ` 
    },
    'glosario': { 
        title: 'Glosario SALVIA', 
        role: 'MinIgualdad', 
        // Nota el uso de la comilla invertida al inicio y al final
        content: `
            <div class="overflow-x-auto rounded-lg shadow border border-gray-200 mt-2">
                <table class="min-w-full text-left text-sm text-gray-700">
                    <thead class="bg-[#380E44] text-white">
                        <tr>
                            <th class="px-4 py-3 font-bold uppercase tracking-wider text-xs">Término / Sigla</th>
                            <th class="px-4 py-3 font-bold uppercase tracking-wider text-xs">Definición</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                        <tr class="bg-white hover:bg-gray-50"><td class="px-4 py-3 font-bold text-[#380E44]">SALVIA</td><td class="px-4 py-3">Sistema de información y protocolo operativo para la atención de víctimas de VBG/VPP.</td></tr>
                        <tr class="bg-gray-50 hover:bg-gray-100"><td class="px-4 py-3 font-bold text-[#380E44]">VBG</td><td class="px-4 py-3">Violencia Basada en Género.</td></tr>
                        <tr class="bg-white hover:bg-gray-50"><td class="px-4 py-3 font-bold text-[#380E44]">VPP</td><td class="px-4 py-3">Violencia contra la Pareja y en el ámbito familiar.</td></tr>
                        <tr class="bg-gray-50 hover:bg-gray-100"><td class="px-4 py-3 font-bold text-[#380E44]">NNA</td><td class="px-4 py-3">Niños, Niñas y Adolescentes.</td></tr>
                        <tr class="bg-white hover:bg-gray-50"><td class="px-4 py-3 font-bold text-[#380E44]">ASP</td><td class="px-4 py-3">Agente Social de Protección (equipo en territorio).</td></tr>
                        <tr class="bg-gray-50 hover:bg-gray-100"><td class="px-4 py-3 font-bold text-[#380E44]">PQRS</td><td class="px-4 py-3">Peticiones, Quejas, Reclamos y Sugerencias.</td></tr>
                        <tr class="bg-white hover:bg-gray-50"><td class="px-4 py-3 font-bold text-[#380E44]">Enrutamiento</td><td class="px-4 py-3">Proceso de referir a la víctima a las instituciones o servicios que corresponden.</td></tr>
                        <tr class="bg-gray-50 hover:bg-gray-100"><td class="px-4 py-3 font-bold text-[#380E44]">Mec. Articulador</td><td class="px-4 py-3">Instancia de coordinación que facilita la respuesta institucional.</td></tr>
                        <tr class="bg-white hover:bg-gray-50"><td class="px-4 py-3 font-bold text-[#380E44]">Medidas Emergencia</td><td class="px-4 py-3">Apoyos inmediatos (alojamiento, transporte) para proteger a la víctima.</td></tr>
                        <tr class="bg-gray-50 hover:bg-gray-100"><td class="px-4 py-3 font-bold text-[#380E44]">Riesgo Feminicida</td><td class="px-4 py-3">Valoración del peligro para la vida (extremo, alto, moderado, bajo, sin riesgo).</td></tr>
                    </tbody>
                </table>
            </div>
        ` 
    },
    'reporte_terceros': { title: 'Registro de Contacto indirecto', role: 'Familiar / Amigo / Vecino / + Equipo Territorial / ASP', content: '"Como allegado de una ciudadana en situación de riesgo, quiero poder registrar sus datos demográficos básicos y una descripción de los hechos en un formulario seguro, para que el sistema por medio del Agente Integral active una alerta temprana y la Línea 155 pueda contactarla."' },
    'registro_victima': { title: 'Registro de Contacto directo', role: 'Víctima', content: '"Como ciudadana en situación de riesgo, quiero poder registrar mis datos demográficos básicos y una descripción de los hechos en un formulario seguro que valide mi identidad, para que el sistema active una alerta temprana y la Línea 155 pueda contactarme. Y quiero poder hacer seguimiento a mi caso una vez ya registrado"' },
    'registro_funcionarios': { title: 'Acceso de Funcionarios', role: 'Agente Integral', content: '"Primer contacto con la víctima. Crea el registro SALVIA, realiza la valoración de riesgo inicial y enruta el caso. Como operador de la Línea 155, necesito un portal de acceso seguro que valide mi identidad, para poder ingresar al sistema y visualizar los casos reportados por las ciudadanas manteniendo la confidencialidad."' },
    'panel_control': { title: 'Panel de Control Estratégico', role: 'Gestora de Caso', content: '"Como supervisor, necesito visualizar métricas en tiempo real sobre los casos reportados, niveles de riesgo y tiempos de respuesta, para tomar decisiones informadas y asignar recursos eficientemente en la red de atención."' },
    'seguimiento_casos': { title: 'Monitoreo de Rutas', role: 'Gestora de Caso / Agente Integral / Territorial / SALVIA Nacional', content: '"Como operador, quiero ver una bandeja de entrada con los casos recién reportados, ordenados por urgencia y semaforizados, para poder iniciar el contacto de manera prioritaria y activar la ruta institucional."' },
    'tamizaje_riesgo': { title: 'Valoración Técnica de Riesgo', role: 'Equipo Psicosocial / Comisaría', content: '"Como profesional en la ruta, necesito aplicar un cuestionario estandarizado que calcule automáticamente el riesgo de feminicidio, para clasificar el nivel de alerta (Extremo, Moderado, Bajo) y justificar medidas de protección."' },
    'modulo_masp': { title: 'Módulo MASP', role: 'Mujeres en Actividades Sexuales Pagas', content: '"Como usuaria del ecosistema MASP, necesito contar con un botón de pánico y un canal de reporte discreto que me permita alertar a las autoridades si me encuentro en una situación de violencia en mi entorno laboral."' },
    'modulo_lgbtiq': { title: 'Enfoque Diferencial de Género', role: 'Analista de Casos', content: '"Como analista, necesito visualizar indicadores y variables específicas de identidad de género y orientación sexual, para garantizar que la atención cumpla con el enfoque diferencial y no revictimice a la población diversa."' }
};

function abrirModalHistoria(storyKey) {
    const story = userStories[storyKey];
    if (!story) return;
    document.getElementById('story-title').innerHTML = `<i class="fa-solid fa-book-open mr-2"></i> ${story.title}`;
    document.getElementById('story-role').innerText = `Rol: ${story.role}`;
    document.getElementById('story-content').innerHTML = story.content;
    document.getElementById('story-modal').classList.remove('hidden');
}
function cerrarModalHistoria() { document.getElementById('story-modal').classList.add('hidden'); }

// ==========================================
// 10. MENÚ MÓVIL Y MOTOR DE RIESGO
// ==========================================
function toggleMenuMovil() { document.getElementById('menu-movil').classList.toggle('hidden'); }

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
// 11. SISTEMA DE FEEDBACK CONTEXTUAL (GOOGLE FORMS)
// ==========================================
function abrirFormularioFeedback() {
    // La URL base de tu formulario
    const baseUrl = "https://docs.google.com/forms/d/e/1FAIpQLSc4qDbw38kp5I5DKDXM8EF-DoH4QcBI8dEdJ3K60aIRsRDLXA/viewform";
    // El ID exacto de la pregunta "Módulo o Vista Actual"
    const entryId = "entry.675421179";
    
    // Convertimos el texto (ej. "Portal Público (Inicio)") a formato URL (ej. Portal%20P%C3%BAblico...)
    const vistaCodificada = encodeURIComponent(vistaActualGlobal);
    
    // Ensamblamos la URL final
    const urlFinal = `${baseUrl}?usp=pp_url&${entryId}=${vistaCodificada}`;
    
    // Abrimos el formulario en una nueva pestaña
    window.open(urlFinal, '_blank');
}

// ==========================================
// INICIALIZADOR GENERAL
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    navPublic('home-view');
    cargarCacheAlInicio(); 
    generarCaptchas();
});