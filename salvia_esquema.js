// salvia_esquema.js

const dicPreguntas = {
    // --- SECCIÓN 1: DATOS PERSONALES ---
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
    "G1_011": { label: "Ocupación", type: "select", options: ["Seleccione...", 'st: Estudiante', 'hs: Trabajadora sector salud', 'Trabajadora sector educación', 'Trabajadora sector público / funcionaria pública', 'Lideresa social', 'periodista', 'Trabajo doméstico remunerado', 'Trabajo doméstico no remunerado', 'trabajadora sexual', 'Desempleada', 'Jubilada', 'Campesino', 'otra ¿Cuál?'], colSpan: 2 },
    "G2_011_A": { label: "¿Cuál otra ocupación?", type: "text", colSpan: 2 },
    "G1_012": { label: "Grupo Étnico", type: "select", options: ["Seleccione...", "Ninguno", "Afrocolombiano", "Indígena", "Raizal", "Palenquero", "Otro"], colSpan: 2 },
    "G2_012_A": { label: "¿Cuál otro grupo étnico?", type: "text", colSpan: 2 },

    // --- SECCIÓN 2: DATOS DEL AGRESOR (Extraído del CSV) ---
    "S_005": { label: "Datos del Presunto Agresor", type: "section", icon: "fa-user-ninja", colSpan: 4 },
    "A1_001": { label: "Nombres y apellidos", type: "text", colSpan: 2 },
    "A1_002": { label: "Número de teléfono", type: "number", colSpan: 2 },
    "V1_013": { label: "Relación con el agresor", type: "select", options: ["Seleccione...", "Ninguno", "Otro", "Familiar diferente a la pareja", "Novio", "Jefe", "Familiar", "Expareja", "Amigo", "Familiar no convivivente", " Familiar convivivente", "Pareja permanente/temporal", "Pareja temporal", "Compañero de trabajo", "Vecino", "Compañero de estudios", "Amigo de la pareja"], colSpan: 4 },
    "V2_013_A": { label: "¿Cuál otra relación?", type: "text", colSpan: 4 },
    
    // --- SECCIÓN 3: DESCRIPCIÓN DE LOS HECHOS Y RIESGO ---
    "S_006": { label: "Descripción de los Hechos", type: "section", icon: "fa-file-lines", colSpan: 4 },
    "V1_014": { label: "Alcance interno", type: "select", options: ["Seleccione...", "Familiar convivivente", "Familiar no convivivente", "Pareja", "Empareja", "Amistad"], colSpan: 2 },
    "V1_015": { label: "Alcance externo", type: "select", options: ["Seleccione...", "Salud", "Institucional", "Laboral", "Reclusión Intramural","Instituciones de protección", "Transporte Público", "Educativo", "Espacio público", "Digital", "Establecimientos de comercio", "Bares", "Restaurantes", "Cibernético", "Político", "Sin relación"], colSpan: 2 },
    "H1_001": { label: "Detalle de lo ocurrido", type: "textarea", colSpan: 4 },
    
    // Nodos de Agresión (booleanos del CSV)
    "H1_002": { label: "¿Ha reportado esta situación previamente?", type: "boolean", colSpan: 2 },
    "H2_002_A": { label: "¿A qué entidad?", type: "select", options: ["Seleccione...", "Comisaría de Familia", "Fiscalía", "Inspección de Policía", "IPS", "Medicina Legal", "No recuerdo", "Otro"], colSpan: 2 },
    
    "H1_003": { label: "¿El agresor tiene armas?", type: "boolean", colSpan: 2 },
    "H1_004": { label: "¿Existen amenazas de muerte explícitas?", type: "boolean", colSpan: 2 }
};

const arbolRelaciones = {
    // Definimos las Raíces para que el sistema sepa qué mostrar por defecto
    "raices_tamizaje": [
        "S_004", "G1_001", "G1_002", "G1_003", "G1_004", 
        "G1_005", "G1_006", "G1_007", "G1_008", 
        "G1_009", "G1_010", "G1_011", "G1_012",
        "S_005", "A1_001", "A1_002", "V1_013",
        "S_006", "V1_014", "V1_015", "H1_001", "H1_002", "H1_003", "H1_004"
    ],
    
    // Reglas en Cascada
    "G1_009": { "Otra": ["G2_009_A"] },
    "G1_011": { "otra ¿Cuál?": ["G2_011_A"] },
    "G1_012": { "Otro": ["G2_012_A"] },
    "V1_013": { "Otro": ["V2_013_A"] },
    "H1_002": { "true": ["H2_002_A"] } // Si dice que SÍ reportó previamente, despliega la entidad
};