import { createClient } from 'redis';
import { NextResponse } from 'next/server';

const KV_KEY = 'admin-profile';

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

        if (data) {
            const parsed = JSON.parse(data);
            return NextResponse.json(parsed);
        }

        // Return empty or default if nothing saved
        return NextResponse.json({ name: '', avatarUrl: '' });
    } catch (error) {
        console.error('Error al obtener perfil de admin de Redis', error);
        return NextResponse.json({ name: '', avatarUrl: '' }, { status: 200 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, avatarUrl } = body;

        if (!name) {
            return NextResponse.json({ error: 'Falta el nombre' }, { status: 400 });
        }

        const redis = await getRedis();
        await redis.set(KV_KEY, JSON.stringify({ name, avatarUrl: avatarUrl || '' }));
        await redis.disconnect();

        return NextResponse.json({ success: true, name, avatarUrl }, { status: 201 });
    } catch (error) {
        console.error('Error al guardar perfil de admin en Redis', error);
        return NextResponse.json({ error: 'Error guardando perfil' }, { status: 500 });
    }
}
