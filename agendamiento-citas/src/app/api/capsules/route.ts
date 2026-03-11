import { createClient } from 'redis';
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

// Helper to get connected redis client
async function getRedis() {
    // We conditionally use process.env.REDIS_URL or KV_URL if available provided by Upstash
    const url = process.env.KV_URL || process.env.REDIS_URL || process.env.UPSTASH_REDIS_REST_URL;
    const client = createClient({ url });
    await client.connect();
    return client;
}

// Obtener todas las cápsulas
export async function GET() {
    try {
        const redis = await getRedis();
        const data = await redis.get(KV_KEY);
        await redis.disconnect();

        let capsules: Capsule[] = [];
        if (data) capsules = JSON.parse(data);

        return NextResponse.json(capsules);
    } catch (error) {
        console.error('Error al obtener cápsulas de Redis', error);
        return NextResponse.json([], { status: 200 });
    }
}

// Crear nueva cápsula
export async function POST(request: Request) {
    try {
        const body: Capsule = await request.json();
        const redis = await getRedis();

        // Obtener actuales
        const data = await redis.get(KV_KEY);
        let capsules: Capsule[] = data ? JSON.parse(data) : [];

        // Generar ID
        const maxId = capsules.reduce((max, c) => Math.max(max, c.id), 0);
        const newCapsule = { ...body, id: maxId + 1 };

        // Guardar array actualizado
        capsules.unshift(newCapsule);
        await redis.set(KV_KEY, JSON.stringify(capsules));
        await redis.disconnect();

        return NextResponse.json(newCapsule, { status: 201 });
    } catch (error) {
        console.error('Error al crear cápsula en Redis', error);
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

        const redis = await getRedis();
        const data = await redis.get(KV_KEY);
        let capsules: Capsule[] = data ? JSON.parse(data) : [];

        if (capsules.length === 0) {
            await redis.disconnect();
            return NextResponse.json({ error: 'No hay cápsulas' }, { status: 404 });
        }

        // Actualizar
        const index = capsules.findIndex(c => c.id === id);
        if (index === -1) {
            await redis.disconnect();
            return NextResponse.json({ error: 'Cápsula no encontrada' }, { status: 404 });
        }

        capsules[index] = { ...capsules[index], ...body };
        await redis.set(KV_KEY, JSON.stringify(capsules));
        await redis.disconnect();

        return NextResponse.json(capsules[index]);
    } catch (error) {
        console.error('Error actualizando cápsula en Redis', error);
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

        const redis = await getRedis();
        const data = await redis.get(KV_KEY);

        if (!data) {
            await redis.disconnect();
            return NextResponse.json({ success: true });
        }

        let capsules: Capsule[] = JSON.parse(data);
        const newCapsules = capsules.filter(c => c.id !== id);

        await redis.set(KV_KEY, JSON.stringify(newCapsules));
        await redis.disconnect();

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error eliminando cápsula en Redis', error);
        return NextResponse.json({ error: 'Error eliminando cápsula' }, { status: 500 });
    }
}
