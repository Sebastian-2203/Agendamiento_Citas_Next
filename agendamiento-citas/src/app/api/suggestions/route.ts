import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const { name, suggestion } = data;

        if (!suggestion) {
            return NextResponse.json({ success: false, message: 'La sugerencia es requerida' }, { status: 400 });
        }

        // Create a transporter using Gmail SMTP
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Email content
        const mailOptions = {
            from: `"Contigo Profe - Sugerencias" <${process.env.EMAIL_USER}>`,
            to: process.env.PSYCHOLOGIST_EMAIL,
            subject: `Nueva Sugerencia de Cápsula: ${name || 'Anónimo'}`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
          <h2 style="color: #63a4ff; text-align: center; margin-bottom: 30px;">¡Nueva sugerencia recibida!</h2>
          <p style="font-size: 16px;">Hola,</p>
          <p style="font-size: 16px;">Has recibido una nueva sugerencia para añadir a la sección de Cápsulas de Salud Mental.</p>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Enviado por:</strong> ${name || 'Docente Anónimo'}</p>
          </div>

          <div style="margin: 20px 0;">
            <p><strong>Contenido de la Sugerencia:</strong></p>
            <p style="background-color: #f1f5f9; padding: 15px; border-radius: 8px; font-style: italic; white-space: pre-wrap;">"${suggestion}"</p>
          </div>

          <p style="font-size: 14px; color: #64748b; text-align: center; margin-top: 40px;">
            Este es un correo automático de tu plataforma Contigo Profe.
          </p>
        </div>
      `,
        };

        // Send the email
        await transporter.sendMail(mailOptions);

        return NextResponse.json({ success: true, message: 'Sugerencia enviada correctamente' });
    } catch (error) {
        console.error('Error enviando sugerencia:', error);
        return NextResponse.json(
            { success: false, message: 'Hubo un error al enviar tu sugerencia' },
            { status: 500 }
        );
    }
}
