// salvia_esquema.js

// DICCIONARIO CENTRAL (Catálogo de Entidades)
const dicPreguntas = {
    // Generales (G)
    "G1_001": { label: "Nombres y Apellidos", type: "text", colSpan: 2 },
    "G1_002": { label: "Número de documento", type: "number", colSpan: 2 },
    "G1_003": { label: "Detalle de lo ocurrido", type: "textarea", colSpan: 4 },

    // Tamizaje Psicosocial (T) - Nivel 1
    "T1_001": { label: "1. Pérdida de Autodeterminación (Control)", type: "boolean", colSpan: 2 },
    
    // Tamizaje (T) - Nivel 2
    "T2_001": { label: "2. Aislamiento y Prohibición", type: "boolean", colSpan: 2 },
    "T2_002": { label: "2. Distorsión de la realidad (Gaslighting)", type: "boolean", colSpan: 2 },
    
    // Tamizaje (T) - Nivel 3 y 4
    "T3_001": { label: "3. Invalidación Emocional y Humillación", type: "boolean", colSpan: 2 },
    "T4_001": { label: "4. Amenazas e Intimidación", type: "boolean", colSpan: 2 },
    "T5_001": { label: "Describa brevemente las amenazas", type: "textarea", colSpan: 4 }
};

// ÁRBOL DE RELACIONES (Reglas de Dependencia y Nodos)
const arbolRelaciones = {
    "raices_tamizaje": ["G1_001", "G1_002", "G1_003", "T1_001"],
    "T1_001": {
        "true": ["T2_001"],
        "false": ["T2_002"]
    },
    "T2_002": {
        "true": ["T3_001"]
    },
    "T3_001": {
        "true": ["T4_001"]
    },
    "T4_001": {
        "true": ["T5_001"]
    }
};