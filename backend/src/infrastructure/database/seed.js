/**
 * Seed script: populates reto_c.areas and reto_c.tipos_solicitud
 * with initial data so the app is immediately functional after setup.
 *
 * Usage:
 *   node src/infrastructure/database/seed.js
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../../../.env') });

const { pool } = require('./db');

async function seed() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // ── Areas ─────────────────────────────────────────────────────────────────
    const areas = [
      {
        nombre: 'Tecnología de la Información',
        descripcion: 'Soporte técnico, infraestructura y desarrollo de sistemas.',
        email_contacto: 'ti@empresa.com',
      },
      {
        nombre: 'Recursos Humanos',
        descripcion: 'Gestión del personal, selección, onboarding y capacitación.',
        email_contacto: 'rrhh@empresa.com',
      },
      {
        nombre: 'Finanzas',
        descripcion: 'Contabilidad, presupuesto, pagos y control financiero.',
        email_contacto: 'finanzas@empresa.com',
      },
      {
        nombre: 'Operaciones',
        descripcion: 'Logística, procesos operativos y gestión de proveedores.',
        email_contacto: 'operaciones@empresa.com',
      },
      {
        nombre: 'Legal',
        descripcion: 'Asesoría legal, contratos y cumplimiento normativo.',
        email_contacto: 'legal@empresa.com',
      },
      {
        nombre: 'Administración',
        descripcion: 'Servicios generales, compras y gestión administrativa.',
        email_contacto: 'admin@empresa.com',
      },
    ];

    for (const area of areas) {
      await client.query(
        `INSERT INTO reto_c.areas (nombre, descripcion, email_contacto)
         VALUES ($1, $2, $3)
         ON CONFLICT (nombre) DO NOTHING`,
        [area.nombre, area.descripcion, area.email_contacto],
      );
    }

    console.log(`✓ ${areas.length} áreas procesadas`);

    // ── Tipos de solicitud ────────────────────────────────────────────────────
    const tipos = [
      {
        codigo: 'SOPORTE',
        nombre: 'Soporte Técnico',
        descripcion: 'Incidencias y requerimientos de soporte de TI.',
        sla_horas: 24,
        requiere_aprobacion: false,
      },
      {
        codigo: 'PERSONAL',
        nombre: 'Solicitud de Personal',
        descripcion: 'Altas, bajas, cambios de posición o permisos de RRHH.',
        sla_horas: 72,
        requiere_aprobacion: true,
      },
      {
        codigo: 'COMPRA',
        nombre: 'Requerimiento de Compra',
        descripcion: 'Solicitud de adquisición de bienes o servicios.',
        sla_horas: 48,
        requiere_aprobacion: true,
      },
      {
        codigo: 'FINANZAS',
        nombre: 'Consulta Financiera',
        descripcion: 'Preguntas sobre pagos, facturación o presupuesto.',
        sla_horas: 48,
        requiere_aprobacion: false,
      },
      {
        codigo: 'ACCESO',
        nombre: 'Acceso a Sistemas',
        descripcion: 'Solicitud de permisos, accesos o credenciales.',
        sla_horas: 8,
        requiere_aprobacion: false,
      },
      {
        codigo: 'LEGAL',
        nombre: 'Revisión Legal',
        descripcion: 'Revisión de contratos, acuerdos o documentos legales.',
        sla_horas: 120,
        requiere_aprobacion: true,
      },
    ];

    for (const tipo of tipos) {
      await client.query(
        `INSERT INTO reto_c.tipos_solicitud (codigo, nombre, descripcion, sla_horas, requiere_aprobacion)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (codigo) DO NOTHING`,
        [
          tipo.codigo,
          tipo.nombre,
          tipo.descripcion,
          tipo.sla_horas,
          tipo.requiere_aprobacion,
        ],
      );
    }

    console.log(`✓ ${tipos.length} tipos de solicitud procesados`);

    await client.query('COMMIT');
    console.log('\n✅ Seed completado exitosamente.');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Error en el seed:', err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
