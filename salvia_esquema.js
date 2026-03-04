// salvia_esquema.js

const dicPreguntas = {
    // --- SECCIÓN 1: DATOS PERSONALES Y SOCIODEMOGRÁFICOS (Basado en PDF Oficial) ---
    "S_004": { label: "Datos Personales", type: "section", icon: "fa-users", colSpan: 4 },
    "G1_001": { label: "Nombres", type: "text", colSpan: 1 },
    "G1_002": { label: "Apellidos", type: "text", colSpan: 1 },
    "G1_003": { label: "Nombre identitario", type: "text", colSpan: 1 },
    "G1_004": { label: "Fecha de nacimiento", type: "date", colSpan: 1 },
    "G1_005": { label: "Tipo de documento", type: "select", options: ["Seleccione...", 'Cédula De Extranjería','Cédula De Ciudadanía','Pasaporte','Nit','Tarjeta Identidad','Tarjeta Extranjería','Dni - Documento Identidad Extranjero','Nit De Otro País','Registro Civil','Salvoconducto Refugiados Svc','Permiso Especial De Permanencia - Pep','Permiso De Protección Temporal','Sin Información'], colSpan: 2 },
    "G1_006": { label: "Número de documento", type: "number", colSpan: 2 },
    "G1_007": { label: "Dirección de residencia", type: "text", colSpan: 4 },
    "G1_008": { label: "Número de teléfono", type: "number", colSpan: 4 },
    "G1_009": { label: "Identidad de género", type: "select", options: ["Seleccione...", 'No Binaria - Asignado Femenino Al Nacer','No Binaria - Asignado Masculino Al Nacer','Hombre','Mujer','Mujer Transgénero','Hombre Transgénero', 'Otra'], colSpan: 2 },
    "G2_009_A": { label: "¿Cuál otro género?", type: "text", colSpan: 2 },
    "G1_010": { label: "Orientación sexual", type: "select", options: ["Seleccione...", "Heterosexual", "Lesbiana", "Gay", "Bisexual", "Otra"], colSpan: 2 },
    "G1_011": { label: "Ocupación", type: "select", options: ["Seleccione...", 'Estudiante', 'Trabajadora sector salud', 'Trabajadora sector educación', 'Trabajadora sector público / funcionaria pública', 'Lideresa social', 'Periodista', 'Trabajo doméstico remunerado', 'Trabajo doméstico no remunerado', 'Trabajadora sexual', 'Desempleada', 'Jubilada', 'Campesino', 'Otra ¿Cuál?'], colSpan: 2 },
    "G2_011_A": { label: "¿Cuál otra ocupación?", type: "text", colSpan: 2 },
    "G1_012": { label: "Grupo Étnico", type: "select", options: ["Seleccione...", "Ninguno", "Afrocolombiano", "Indígena", "Raizal", "Palenquero", "Otro"], colSpan: 2 },
    "G2_012_A": { label: "¿Cuál otro grupo étnico?", type: "text", colSpan: 2 },

    // Nuevos campos del Formulario PDF
    "G1_013": { label: "¿Requiere de algún ajuste razonable para la atención?", type: "select", options: ["Seleccione...", "Ninguno / No informa", "Adecuaciones de accesibilidad física", "Dispositivos o ayudas técnicas", "Presencia de persona de confianza", "Transporte seguro o acompañamiento", "Intérprete de lengua de señas", "Guía-intérprete"], colSpan: 2 },
    "G1_014": { label: "Estado civil", type: "select", options: ["Seleccione...", "Soltera", "Casada", "Unión libre", "Separada", "Divorciada", "Viuda"], colSpan: 2 },
    "G1_015": { label: "Último nivel de escolaridad", type: "select", options: ["Seleccione...", "Ninguno", "Primaria", "Bachillerato", "Técnico/Tecnólogo", "Profesional", "Postgrado"], colSpan: 2 },
    "G1_016": { label: "Forma de generación de ingresos", type: "select", options: ["Seleccione...", "Empleo formal", "Empleo informal", "Independiente", "Rentas/Pensiones", "Depende de terceros", "Sin ingresos"], colSpan: 2 },
    "G1_017": { label: "Forma de tenencia de la vivienda", type: "select", options: ["Seleccione...", "Propia", "Arrendada", "Familiar", "Invasión / Ocupación de hecho", "Otra"], colSpan: 2 },
    "G1_018": { label: "Estrato de la vivienda", type: "select", options: ["Seleccione...", "1", "2", "3", "4", "5", "6", "Sin estrato / Finca"], colSpan: 2 },
    "G1_019": { label: "¿Tiene personas o animales a cargo?", type: "boolean", colSpan: 2 },
    
    // Condicional Fuerte: Gestación
    "G1_020": { label: "¿Actualmente se encuentra en estado de gestación?", type: "boolean", colSpan: 2 },
    "G2_020_A": { label: "⚠️ ALERTA DE VULNERABILIDAD: Indique meses de gestación", type: "number", colSpan: 2 },

    // --- SECCIÓN 2: DATOS DEL AGRESOR ---
    "S_005": { label: "Datos del Presunto Agresor", type: "section", icon: "fa-user-ninja", colSpan: 4 },
    "A1_001": { label: "Nombres y apellidos", type: "text", colSpan: 2 },
    "A1_002": { label: "Número de teléfono", type: "number", colSpan: 2 },
    "V1_013": { label: "Relación con el agresor", type: "select", options: ["Seleccione...", "Ninguno", "Familiar diferente a la pareja", "Novio", "Jefe", "Familiar", "Expareja", "Amigo", "Familiar no conviviente", "Familiar conviviente", "Pareja permanente/temporal", "Pareja temporal", "Compañero de trabajo", "Vecino", "Compañero de estudios", "Amigo de la pareja", "Otro"], colSpan: 4 },
    "V2_013_A": { label: "¿Cuál otra relación?", type: "text", colSpan: 4 },
    
    // --- SECCIÓN 3: DESCRIPCIÓN DE LOS HECHOS ---
    "S_006": { label: "Descripción de los Hechos", type: "section", icon: "fa-file-lines", colSpan: 4 },
    "V1_014": { label: "Alcance interno", type: "select", options: ["Seleccione...", "Familiar conviviente", "Familiar no conviviente", "Pareja", "Empareja", "Amistad"], colSpan: 2 },
    "V1_015": { label: "Alcance externo", type: "select", options: ["Seleccione...", "Salud", "Institucional", "Laboral", "Reclusión Intramural","Instituciones de protección", "Transporte Público", "Educativo", "Espacio público", "Digital", "Establecimientos de comercio", "Bares", "Restaurantes", "Cibernético", "Político", "Sin relación"], colSpan: 2 },
    "H1_001": { label: "Detalle de lo ocurrido", type: "textarea", colSpan: 4 },
    "H1_002": { label: "¿Ha reportado esta situación previamente?", type: "boolean", colSpan: 2 },
    "H2_002_A": { label: "¿A qué entidad?", type: "select", options: ["Seleccione...", "Comisaría de Familia", "Fiscalía", "Inspección de Policía", "IPS", "Medicina Legal", "No recuerdo", "Otro"], colSpan: 2 },
    "H1_003": { label: "¿El agresor tiene armas?", type: "boolean", colSpan: 2 },
    "H1_004": { label: "¿Existen amenazas de muerte explícitas?", type: "boolean", colSpan: 2 },

    // --- SECCIÓN 4: PLAN DE ACCIÓN Y UBICACIÓN (DIVIPOLA) ---
    "S_007": { label: "Atención y Enrutamiento", type: "section", icon: "fa-sitemap", colSpan: 4 },
    "P1_001": { label: "Plan de acción", type: "select", options: ["Seleccione...", "Enrutamiento interinstitucional", "Activación de la ruta (oficio)", "Acompañamiento psicosocial", "Plan de estabilización", "Medidas de emergencia", "Esquema de autocuidado"], colSpan: 4 },
    
    // Condicional: Si elige "Medidas de emergencia", se activa esto:
    "P2_001_A": { label: "Especifique la medida de emergencia a activar", type: "textarea", colSpan: 4 },

    "P1_002": { label: "Explicación relacionada con la gestión de SALVIA (remisión, uso de datos)", type: "textarea", colSpan: 4 },
    
    // DIVIPOLA: Departamentos de Colombia
    "P1_003": { label: "Departamento (DIVIPOLA)", type: "select", options: ["Seleccione...", "ANTIOQUIA", "ATLÁNTICO", "BOGOTÁ, D.C.", "BOLÍVAR", "BOYACÁ", "CALDAS", "CAQUETÁ", "CAUCA", "CESAR", "CÓRDOBA", "CUNDINAMARCA", "CHOCÓ", "HUILA", "LA GUAJIRA", "MAGDALENA", "META", "NARIÑO", "NORTE DE SANTANDER", "QUINDÍO", "RISARALDA", "SANTANDER", "SUCRE", "TOLIMA", "VALLE DEL CAUCA", "ARAUCA", "CASANARE", "PUTUMAYO", "ARCHIPIÉLAGO DE SAN ANDRÉS", "AMAZONAS", "GUAINÍA", "GUAVIARE", "VAUPÉS", "VICHADA"], colSpan: 2 },
    "P1_004": { label: "Municipio (Código o Nombre)", type: "text", placeholder: "Ej: 05001 MEDELLÍN", colSpan: 2 }
};

const arbolRelaciones = {
    // Las Raíces (Nodos Nivel 1) siempre visibles
    "raices_tamizaje": [
        "S_004", "G1_001", "G1_002", "G1_003", "G1_004", 
        "G1_005", "G1_006", "G1_007", "G1_008", 
        "G1_009", "G1_010", "G1_011", "G1_012", "G1_013", "G1_014", "G1_015", "G1_016", "G1_017", "G1_018", "G1_019", "G1_020",
        "S_005", "A1_001", "A1_002", "V1_013",
        "S_006", "V1_014", "V1_015", "H1_001", "H1_002", "H1_003", "H1_004",
        "S_007", "P1_001", "P1_002", "P1_003", "P1_004"
    ],
    
    // REGLAS CONDICIONALES EN CASCADA (DAG)
    "G1_009": { "Otra": ["G2_009_A"] },
    "G1_011": { "Otra ¿Cuál?": ["G2_011_A"] },
    "G1_012": { "Otro": ["G2_012_A"] },
    "V1_013": { "Otro": ["V2_013_A"] },
    
    // Si reportó previamente, preguntamos a qué entidad
    "H1_002": { "true": ["H2_002_A"] },
    
    // REGLAS DE RIESGO IDENTIFICADAS
    // Si está en estado de gestación, alertamos y pedimos los meses
    "G1_020": { "true": ["G2_020_A"] },

    // Si el Plan de Acción es una Medida de Emergencia, pedimos especificar
    "P1_001": { "Medidas de emergencia": ["P2_001_A"] }
};