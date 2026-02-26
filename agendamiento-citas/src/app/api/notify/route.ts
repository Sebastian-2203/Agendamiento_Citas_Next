import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const { name, cedula, school, sede, date, time, reason } = data;

        // Create a transporter using Gmail SMTP
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Formatting the date nicely
        const [year, month, day] = date.split('-');
        const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        const formattedDate = `${parseInt(day, 10)} de ${months[parseInt(month, 10) - 1]} de ${year}`;

        // Email content
        const mailOptions = {
            from: `"Contigo Profe - Agendamiento" <${process.env.EMAIL_USER}>`,
            to: process.env.PSYCHOLOGIST_EMAIL,
            subject: `Nueva Cita Agendada: ${name} - ${school}`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
          <h2 style="color: #63a4ff; text-align: center; margin-bottom: 30px;">¡Nueva cita agendada!</h2>
          <p style="font-size: 16px;">Hola,</p>
          <p style="font-size: 16px;">Tienes una nueva reserva en tu calendario de <strong>Contigo Profe</strong>.</p>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Docente:</strong> ${name}</p>
            <p style="margin: 5px 0;"><strong>Cédula:</strong> ${cedula}</p>
            <p style="margin: 5px 0;"><strong>Colegio:</strong> ${school}</p>
            <p style="margin: 5px 0;"><strong>Sede:</strong> ${sede}</p>
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 15px 0;" />
            <p style="margin: 5px 0; color: #10b981; font-weight: bold;"><strong>Fecha:</strong> ${formattedDate}</p>
            <p style="margin: 5px 0; color: #10b981; font-weight: bold;"><strong>Hora:</strong> ${time}</p>
          </div>

          ${reason ? `
          <div style="margin: 20px 0;">
            <p><strong>Motivo de consulta:</strong></p>
            <p style="background-color: #f1f5f9; padding: 15px; border-radius: 8px; font-style: italic;">"${reason}"</p>
          </div>
          ` : ''}

          <p style="font-size: 14px; color: #64748b; text-align: center; margin-top: 40px;">
            Este es un correo automático, por favor no respondas a este mensaje.
          </p>
        </div>
      `,
        };

        // Send the email
        await transporter.sendMail(mailOptions);

        return NextResponse.json({ success: true, message: 'Correo enviado correctamente' });
    } catch (error) {
        console.error('Error enviando el correo:', error);
        return NextResponse.json(
            { success: false, message: 'Hubo un error al enviar el correo' },
            { status: 500 }
        );
    }
}
