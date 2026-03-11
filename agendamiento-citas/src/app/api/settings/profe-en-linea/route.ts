import { createClient } from 'redis';
import { NextResponse } from 'next/server';

const KV_KEY = 'profe-en-linea-flyer';

// Helper to get connected redis client
async function getRedis() {
    const url = process.env.KV_URL || process.env.REDIS_URL || process.env.UPSTASH_REDIS_REST_URL;
    const client = createClient({ url });
    await client.connect();
    return client;
}

export async function GET() {
    try {
        const redis = await getRedis();
        const data = await redis.get(KV_KEY);
        await redis.disconnect();

        let imageUrl = '';
        if (data) {
            const parsed = JSON.parse(data);
            imageUrl = parsed.imageUrl || '';
        }

        return NextResponse.json({ imageUrl });
    } catch (error) {
        console.error('Error al obtener flyer de Profe en Linea de Redis', error);
        return NextResponse.json({ imageUrl: '' }, { status: 200 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { imageUrl } = body;

        if (imageUrl === undefined) {
            return NextResponse.json({ error: 'Falta imageUrl' }, { status: 400 });
        }

        const redis = await getRedis();
        await redis.set(KV_KEY, JSON.stringify({ imageUrl }));
        await redis.disconnect();

        return NextResponse.json({ success: true, imageUrl }, { status: 201 });
    } catch (error) {
        console.error('Error al guardar flyer de Profe en Linea en Redis', error);
        return NextResponse.json({ error: 'Error guardando flyer' }, { status: 500 });
    }
}
