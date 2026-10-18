import nodemailer, { Transporter } from 'nodemailer';

interface ProjectEmailPayload {
  trackingCode: string;
  client: {
    name: string;
    email: string;
    phone?: string;
    notes?: string;
  };
  serviceType: string;
  location?: {
    municipality?: string;
    neighborhood?: string;
    lotNumber?: string;
    address?: string;
    isGatedCommunity?: boolean;
  };
  technicalData?: {
    lotSizeM2?: number;
    coveredM2?: number;
    semiCoveredM2?: number;
  };
  scopeDetails?: {
    environments?: string[];
    architecturalStyle?: string;
    budgetRange?: string;
    estimatedTimeframe?: string;
  };
}

export class EmailService {
  private static transporter: Transporter | null = null;

  private static async getTransporter(): Promise<Transporter> {
    if (this.transporter) {
      return this.transporter;
    }

    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT) || 587;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (host && user && pass) {
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
      });
      return this.transporter;
    }

    // Si no hay SMTP configurado en .env, creamos un transporte de prueba con Ethereal o JSON fallback
    try {
      const testAccount = await nodemailer.createTestAccount();
      this.transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      console.log(`[EmailService] Cuenta Ethereal temporal inicializada: ${testAccount.user}`);
      return this.transporter;
    } catch (err) {
      // Fallback seguro a transport en memoria/json
      this.transporter = nodemailer.createTransport({
        jsonTransport: true,
      });
      return this.transporter;
    }
  }

  private static formatServiceType(type: string): string {
    switch (type) {
      case 'obra_nueva':
        return 'Vivienda Residencial desde Cero';
      case 'interior_mobiliario':
        return 'Arquitectura de Interiores & Mobiliario a Medida';
      case 'oficinas':
        return 'Espacios Corporativos & Oficinas';
      case 'gastronomia':
        return 'Gastronomía & Locales Comerciales';
      case 'regularizacion':
        return 'Habilitación & Trámite Municipal (CAPBA D4)';
      default:
        return 'Proyecto Arquitectónico Integral';
    }
  }

  static async sendProjectIntakeConfirmation(project: ProjectEmailPayload): Promise<boolean> {
    try {
      if (!project.client?.email) {
        console.warn('[EmailService] El cliente no posee correo electrónico configurado.');
        return false;
      }

      const clientName = project.client.name || 'Estimado/a cliente';
      const serviceName = this.formatServiceType(project.serviceType);
      const municipality = project.location?.municipality || 'Zona Norte, Buenos Aires';
      const neighborhood = project.location?.neighborhood ? ` · ${project.location.neighborhood}` : '';
      const lot = project.location?.lotNumber ? ` (Lote ${project.location.lotNumber})` : '';
      const coveredM2 = project.technicalData?.coveredM2 ? `${project.technicalData.coveredM2} m²` : 'A definir';
      const lotM2 = project.technicalData?.lotSizeM2 ? `${project.technicalData.lotSizeM2} m²` : 'A definir';
      const style = project.scopeDetails?.architecturalStyle || 'Minimalismo Acromático Contemporáneo';
      const timeframe = project.scopeDetails?.estimatedTimeframe || 'Dentro de los próximos meses';
      const environments = project.scopeDetails?.environments?.length
        ? project.scopeDetails.environments.join(', ')
        : 'Diseño integral personalizado';

      const trackingUrl = `${process.env.CORS_ORIGIN || 'http://localhost:3000'}/seguimiento?codigo=${encodeURIComponent(
        project.trackingCode
      )}`;

      const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmación de Expediente - Acromático Estudio</title>
</head>
<body style="margin: 0; padding: 0; background-color: #050505; color: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #050505; padding: 40px 15px;">
    <tr>
      <td align="center">
        <!-- Container Principal -->
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 620px; background-color: #0d0d0d; border: 1px solid #262626; border-collapse: collapse;">
          
          <!-- Header Acromático -->
          <tr>
            <td style="padding: 36px 36px 28px 36px; border-bottom: 1px solid #1f1f1f; text-align: left;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <span style="font-size: 10px; font-family: 'Courier New', Courier, monospace; letter-spacing: 0.25em; color: #a3a3a3; text-transform: uppercase; display: block; margin-bottom: 6px;">
                      ESTUDIO DE ARQUITECTURA · ZONA NORTE BUENOS AIRES
                    </span>
                    <h1 style="margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.02em; color: #ffffff; text-transform: uppercase;">
                      ACROMÁTICO ESTUDIO
                    </h1>
                  </td>
                  <td align="right" valign="top">
                    <span style="display: inline-block; width: 10px; height: 10px; background-color: #ffffff; margin-top: 6px;"></span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Código de Seguimiento Destacado -->
          <tr>
            <td style="padding: 28px 36px; background-color: #121212; border-bottom: 1px solid #1f1f1f;">
              <span style="font-size: 11px; font-family: 'Courier New', Courier, monospace; letter-spacing: 0.15em; color: #737373; text-transform: uppercase; display: block; margin-bottom: 8px;">
                CÓDIGO DE EXPEDIENTE ASIGNADO
              </span>
              <div style="font-size: 26px; font-family: 'Courier New', Courier, monospace; font-weight: 700; color: #ffffff; letter-spacing: 0.08em;">
                ${project.trackingCode}
              </div>
              <p style="margin: 8px 0 0 0; font-size: 12px; color: #a3a3a3; font-weight: 300;">
                Guarda este identificador único para consultar el avance del proyecto, planos y visados municipales en tiempo real.
              </p>
            </td>
          </tr>

          <!-- Mensaje Principal -->
          <tr>
            <td style="padding: 36px 36px 20px 36px;">
              <h2 style="margin: 0 0 14px 0; font-size: 18px; font-weight: 400; color: #ffffff; text-transform: uppercase; letter-spacing: 0.04em;">
                Hola, ${clientName}
              </h2>
              <p style="margin: 0 0 24px 0; font-size: 13px; line-height: 1.6; color: #d4d4d4; font-weight: 300;">
                Hemos recibido satisfactoriamente la ficha técnica de tu solicitud. En <strong>Acromático Estudio</strong> abordamos cada encargo con un método riguroso que une la pureza del diseño contemporáneo con el cumplimiento estricto del código de edificación municipal y los visados colegiales del <strong>CAPBA D4</strong>.
              </p>

              <!-- Ficha Resumen de Datos Técnicos -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border: 1px solid #262626; background-color: #080808; margin-bottom: 28px;">
                <tr>
                  <td colspan="2" style="padding: 12px 16px; background-color: #141414; border-bottom: 1px solid #262626; font-size: 10px; font-family: 'Courier New', Courier, monospace; letter-spacing: 0.15em; color: #e5e5e5; text-transform: uppercase; font-weight: bold;">
                    RESUMEN TÉCNICO DE LA SOLICITUD
                  </td>
                </tr>

                <tr>
                  <td width="38%" style="padding: 12px 16px; border-bottom: 1px solid #1a1a1a; font-size: 11px; font-family: 'Courier New', Courier, monospace; color: #888888; text-transform: uppercase;">
                    Servicio
                  </td>
                  <td style="padding: 12px 16px; border-bottom: 1px solid #1a1a1a; font-size: 12px; color: #ffffff; font-weight: 500;">
                    ${serviceName}
                  </td>
                </tr>

                <tr>
                  <td style="padding: 12px 16px; border-bottom: 1px solid #1a1a1a; font-size: 11px; font-family: 'Courier New', Courier, monospace; color: #888888; text-transform: uppercase;">
                    Ubicación
                  </td>
                  <td style="padding: 12px 16px; border-bottom: 1px solid #1a1a1a; font-size: 12px; color: #ffffff;">
                    ${municipality}${neighborhood}${lot}
                  </td>
                </tr>

                <tr>
                  <td style="padding: 12px 16px; border-bottom: 1px solid #1a1a1a; font-size: 11px; font-family: 'Courier New', Courier, monospace; color: #888888; text-transform: uppercase;">
                    Superficie
                  </td>
                  <td style="padding: 12px 16px; border-bottom: 1px solid #1a1a1a; font-size: 12px; color: #ffffff;">
                    Cubiertos: <strong>${coveredM2}</strong> · Lote: <strong>${lotM2}</strong>
                  </td>
                </tr>

                <tr>
                  <td style="padding: 12px 16px; border-bottom: 1px solid #1a1a1a; font-size: 11px; font-family: 'Courier New', Courier, monospace; color: #888888; text-transform: uppercase;">
                    Estilo & Materiales
                  </td>
                  <td style="padding: 12px 16px; border-bottom: 1px solid #1a1a1a; font-size: 12px; color: #ffffff;">
                    ${style}
                  </td>
                </tr>

                <tr>
                  <td style="padding: 12px 16px; border-bottom: 1px solid #1a1a1a; font-size: 11px; font-family: 'Courier New', Courier, monospace; color: #888888; text-transform: uppercase;">
                    Plazo Estimado
                  </td>
                  <td style="padding: 12px 16px; border-bottom: 1px solid #1a1a1a; font-size: 12px; color: #ffffff;">
                    ${timeframe}
                  </td>
                </tr>

                <tr>
                  <td style="padding: 12px 16px; font-size: 11px; font-family: 'Courier New', Courier, monospace; color: #888888; text-transform: uppercase;">
                    Ambientes / Alcance
                  </td>
                  <td style="padding: 12px 16px; font-size: 12px; color: #ffffff; line-height: 1.4;">
                    ${environments}
                  </td>
                </tr>
              </table>

              <!-- Botón CTA con Portal de Seguimiento -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 28px;">
                <tr>
                  <td align="center">
                    <a href="${trackingUrl}" target="_blank" style="display: inline-block; padding: 14px 28px; background-color: #ffffff; color: #050505; font-size: 11px; font-family: 'Courier New', Courier, monospace; font-weight: bold; text-decoration: none; text-transform: uppercase; letter-spacing: 0.12em; border: 1px solid #ffffff;">
                      Consultar Estado en Tiempo Real →
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Próximos Pasos -->
              <div style="padding: 20px; background-color: #121212; border-left: 3px solid #ffffff; margin-bottom: 30px;">
                <span style="font-size: 11px; font-family: 'Courier New', Courier, monospace; font-weight: bold; color: #ffffff; text-transform: uppercase; display: block; margin-bottom: 6px;">
                  ¿Cuáles son los próximos pasos?
                </span>
                <ol style="margin: 0; padding-left: 18px; font-size: 12px; line-height: 1.6; color: #a3a3a3;">
                  <li>El Arquitecto Titular analizará la normativa urbanística (FOS/FOT) de tu lote en ${municipality}.</li>
                  <li>Nos contactaremos para coordinar una reunión técnica presencial o remota.</li>
                  <li>Te presentaremos la propuesta de honorarios y el cronograma de entregas.</li>
                </ol>
              </div>
            </td>
          </tr>

          <!-- Footer Legal y Contacto -->
          <tr>
            <td style="padding: 24px 36px; background-color: #080808; border-top: 1px solid #1f1f1f; text-align: center;">
              <p style="margin: 0 0 8px 0; font-size: 11px; font-family: 'Courier New', Courier, monospace; color: #737373; text-transform: uppercase; letter-spacing: 0.05em;">
                Acromático Estudio · San Isidro · Tigre · Pilar · Vicente López · Escobar
              </p>
              <p style="margin: 0; font-size: 10px; color: #525252; font-family: 'Courier New', Courier, monospace;">
                Web: <a href="https://www.acromaticoestudio.com" style="color: #888888; text-decoration: underline;">acromaticoestudio.com</a> · Email: contacto@acromaticoestudio.com
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `;

      const transporter = await this.getTransporter();

      const mailOptions = {
        from: `"Acromático Estudio" <${process.env.SMTP_FROM || 'contacto@acromaticoestudio.com'}>`,
        to: project.client.email,
        subject: `[${project.trackingCode}] Confirmación de Expediente Arquitectónico · Acromático Estudio`,
        html: htmlContent,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log(`[EmailService] Correo de confirmación enviado exitosamente a ${project.client.email}. MessageId: ${info.messageId}`);

      // Si es un test de Ethereal, loguear la URL de previsualización
      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) {
        console.log(`[EmailService] Previsualización del correo (Ethereal URL): ${previewUrl}`);
      }

      return true;
    } catch (error: any) {
      console.error('[EmailService] Error al enviar el correo de confirmación de proyecto:', error);
      return false;
    }
  }
}
