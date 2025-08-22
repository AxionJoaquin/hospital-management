# Sistema de Gestión Hospitalaria

## Descripción
Sistema integral para la gestión de pacientes, médicos y enfermeras en un hospital. Permite el registro, seguimiento y administración completa del personal médico y pacientes.

## Características Principales

### Gestión de Pacientes
- Registro completo de pacientes con campos críticos
- Fecha de ingreso, nombre, teléfono, localidad
- Diagnóstico médico y tratamiento
- Asignación de médico responsable
- Estado del paciente (Ingresado, En tratamiento, Dado de alta, En observación)
- Asignación por áreas del hospital

### Gestión de Personal Médico
- **Médicos**: Registro con especialidad, área de trabajo, disponibilidad y turnos
- **Enfermeras**: Registro con área de trabajo, disponibilidad y turnos
- Control de disponibilidad en tiempo real

### Áreas del Hospital
- Emergencias
- Cardiología  
- Neurología
- Pediatría
- Cirugía
- Medicina General

### Dashboard
- Estadísticas generales del hospital
- Número total de pacientes y pacientes activos
- Personal médico disponible
- Resumen por áreas

## Estructura Técnica

### Base de Datos
- **patient**: Tabla principal de pacientes
- **doctor**: Registro de médicos con especialidades
- **nurse**: Registro de enfermeras

### Componentes
- `Header`: Cabecera con branding del hospital
- `Sidebar`: Navegación principal y acceso rápido
- `Dashboard`: Vista principal con estadísticas
- `PatientCard`: Tarjeta de información del paciente
- `StaffCard`: Tarjeta de información del personal
- `PatientForm`: Formulario para crear/editar pacientes

### Utilidades
- `DatabaseUtils`: Funciones auxiliares para consultas a la base de datos
- Formateo de fechas y estadísticas

## Estados y Flujos

### Estados de Pacientes
- **Ingresado**: Paciente recién llegado
- **En tratamiento**: Paciente recibiendo atención médica
- **En observación**: Paciente bajo supervisión
- **Dado de alta**: Paciente que ha completado tratamiento

### Estados del Personal
- **Disponible**: Listo para atender pacientes
- **Ocupado/Ocupada**: Atendiendo pacientes
- **En cirugía**: Médico en sala de operaciones
- **En ronda**: Enfermera haciendo rondas
- **Fuera de servicio**: No disponible

## Uso del Sistema

1. **Dashboard**: Vista general del estado del hospital
2. **Nuevo Paciente**: Botón de acceso rápido para registrar pacientes
3. **Navegación**: Sidebar con acceso a todas las secciones
4. **Edición**: Clic en tarjetas de pacientes para editar información
5. **Filtros**: Vista por áreas y estado del personal

## Datos de Ejemplo
El sistema incluye datos de ejemplo de médicos y enfermeras para demostrar funcionalidad.