🌿 SALVIA (Fase II) - Mockup Interactivo de Validación
Propósito del Proyecto
Esta versión es un prototipo funcional de alta fidelidad (Single Page Application) diseñado para validar la experiencia de usuario (UX), los flujos de interacción y la lógica de negocio del ecosistema SALVIA antes de su desarrollo en código de producción (Go, PostgreSQL, Vue.js). Su objetivo principal es permitir a los stakeholders interactuar con la herramienta de manera realista, mitigando riesgos de diseño y evitando reprocesos durante la fase de ingeniería.

Alcance y Funcionalidades Cubiertas en esta Versión:

Arquitectura Visual e Identidad Institucional:

Implementación estricta de lineamientos GOV.CO (cabezotes, paleta de colores).

Diseño Split-Screen moderno con esquemas de color institucionales (Morado #380E44 y Amarillo #FCCC3C) que garantizan alto contraste y legibilidad.

Cumplimiento de estándares de accesibilidad con tooltips descriptivos (hovers) para guiar el diligenciamiento seguro de información.

Portal Ciudadano (Ruta de Registro):

Formulario de "Registro de Atención Inicial" ampliado con captura de variables demográficas clave (enfoque diferencial, identidad de género, grupo étnico y ocupación).

Integración de un Teclado Numérico Virtual interactivo para campos sensibles (Documento y Teléfono), aumentando la seguridad de la usuaria en dispositivos compartidos.

Sistema de verificación humana (Captcha dinámico).

Panel Operativo y de Supervisión (Dashboard Privado):

Simulación completa del entorno de funcionarios con navegación lateral.

Bandeja de Seguimiento: Tabla reactiva con semaforización de estados según el nivel de urgencia (Morado para primer contacto, Rojo para alertas vitales).

Motor de Tamizaje: Calculadora interactiva que evalúa el riesgo de feminicidio en tiempo real basado en un cuestionario de validación, arrojando puntajes y alertas visuales.

Vistas preparadas para módulos especializados (App MASP y Población LGBTIQ+).

Persistencia de Datos Simulada (End-to-End):

Incorporación de tecnología de caché en el navegador (localStorage) que permite simular una base de datos real.

Los reportes creados en el portal público generan radicados automáticos (ej. VBG-2026-4592) y viajan instantáneamente a la bandeja de entrada del operador, permitiendo demostrar el flujo completo de enrutamiento sin requerir un servidor Backend.
