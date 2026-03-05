import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

export interface Capsule {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
    color: string;
    span: number;
}

const KV_KEY = 'mental-health-capsules';

// Obtener todas las cápsulas
export async function GET() {
    try {
        const capsules: Capsule[] | null = await kv.get(KV_KEY);
        return NextResponse.json(capsules || []);
    } catch (error) {
        console.error('Error al obtener cápsulas de KV', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}

// Crear nueva cápsula
export async function POST(request: Request) {
    try {
        const body: Capsule = await request.json();

        // Obtener actuales
        let capsules: Capsule[] | null = await kv.get(KV_KEY);
        if (!capsules) capsules = [];

        // Generar ID
        const maxId = capsules.reduce((max, c) => Math.max(max, c.id), 0);
        const newCapsule = { ...body, id: maxId + 1 };

        // Guardar array actualizado en KV
        capsules.unshift(newCapsule);
        await kv.set(KV_KEY, capsules);

        return NextResponse.json(newCapsule, { status: 201 });
    } catch (error) {
        console.error('Error al crear cápsula en KV', error);
        return NextResponse.json({ error: 'Error guardando cápsula' }, { status: 500 });
    }
}

// Editar cápsula
export async function PUT(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const idParam = searchParams.get('id');
        if (!idParam) return NextResponse.json({ error: 'ID requerido' }, { status: 400 });

        const id = parseInt(idParam, 10);
        const body: Partial<Capsule> = await request.json();

        // Obtener actuales
        const capsules: Capsule[] | null = await kv.get(KV_KEY);
        if (!capsules) return NextResponse.json({ error: 'No hay cápsulas' }, { status: 404 });

        // Actualizar
        const index = capsules.findIndex(c => c.id === id);
        if (index === -1) return NextResponse.json({ error: 'Cápsula no encontrada' }, { status: 404 });

        capsules[index] = { ...capsules[index], ...body };
        await kv.set(KV_KEY, capsules);

        return NextResponse.json(capsules[index]);
    } catch (error) {
        console.error('Error actualizando cápsula en KV', error);
        return NextResponse.json({ error: 'Error actualizando cápsula' }, { status: 500 });
    }
}

// Eliminar cápsula
export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const idParam = searchParams.get('id');
        if (!idParam) return NextResponse.json({ error: 'ID requerido' }, { status: 400 });

        const id = parseInt(idParam, 10);

        // Obtener actuales
        const capsules: Capsule[] | null = await kv.get(KV_KEY);
        if (!capsules) return NextResponse.json({ success: true }); // Si no hay, no importa, ya fue borrada o no existía.

        // Filtrar y guardar
        const newCapsules = capsules.filter(c => c.id !== id);
        await kv.set(KV_KEY, newCapsules);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error eliminando cápsula en KV', error);
        return NextResponse.json({ error: 'Error eliminando cápsula' }, { status: 500 });
    }
}
