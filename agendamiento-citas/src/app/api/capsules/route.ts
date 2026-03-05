import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'capsules.json');

// Función auxiliar para leer los datos
async function getCapsulesData() {
    try {
        const fileContents = await fs.readFile(dataFilePath, 'utf8');
        return JSON.parse(fileContents);
    } catch (error) {
        console.error('Error reading capsules data:', error);
        return [];
    }
}

// Función auxiliar para guardar los datos
async function saveCapsulesData(data: any) {
    try {
        await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
        return true;
    } catch (error) {
        console.error('Error writing capsules data:', error);
        return false;
    }
}

export async function GET() {
    const capsules = await getCapsulesData();
    return NextResponse.json(capsules);
}

export async function POST(request: Request) {
    try {
        const newCapsule = await request.json();

        // Validación básica
        if (!newCapsule.title || !newCapsule.description || !newCapsule.imageUrl) {
            return NextResponse.json({ error: 'Faltan campos obligatorios (title, description, imageUrl)' }, { status: 400 });
        }

        const capsules = await getCapsulesData();

        // Generar un nuevo ID de forma rudimentaria
        const maxId = capsules.reduce((max: number, cap: any) => Math.max(max, cap.id), 0);
        const capsuleToAdd = {
            id: maxId + 1,
            title: newCapsule.title,
            description: newCapsule.description,
            imageUrl: newCapsule.imageUrl,
            color: newCapsule.color || "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
            span: newCapsule.span || 1
        };

        capsules.unshift(capsuleToAdd); // Añadir al principio para que se vea primero

        const saved = await saveCapsulesData(capsules);
        if (!saved) {
            return NextResponse.json({ error: 'Error al guardar la cápsula' }, { status: 500 });
        }

        return NextResponse.json(capsuleToAdd, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Error processing request' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const url = new URL(request.url);
        const idParam = url.searchParams.get('id');

        const updatedData = await request.json();
        const id = idParam ? parseInt(idParam, 10) : updatedData.id;

        if (!id) {
            return NextResponse.json({ error: 'Se requiere el ID de la cápsula' }, { status: 400 });
        }

        const capsules = await getCapsulesData();
        const index = capsules.findIndex((c: any) => c.id === id);

        if (index === -1) {
            return NextResponse.json({ error: 'Cápsula no encontrada' }, { status: 404 });
        }

        // Actualizar datos permitidos
        const capsule = capsules[index];
        capsules[index] = {
            ...capsule,
            title: updatedData.title ?? capsule.title,
            description: updatedData.description ?? capsule.description,
            imageUrl: updatedData.imageUrl ?? capsule.imageUrl,
            color: updatedData.color ?? capsule.color,
            span: updatedData.span ?? capsule.span
        };

        const saved = await saveCapsulesData(capsules);
        if (!saved) {
            return NextResponse.json({ error: 'Error al actualizar la cápsula' }, { status: 500 });
        }

        return NextResponse.json(capsules[index]);
    } catch (error) {
        return NextResponse.json({ error: 'Error processing request' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const url = new URL(request.url);
        const idParam = url.searchParams.get('id');

        if (!idParam) {
            return NextResponse.json({ error: 'Se requiere el ID de la cápsula' }, { status: 400 });
        }

        const id = parseInt(idParam, 10);
        const capsules = await getCapsulesData();
        const newCapsules = capsules.filter((c: any) => c.id !== id);

        if (capsules.length === newCapsules.length) {
            return NextResponse.json({ error: 'Cápsula no encontrada' }, { status: 404 });
        }

        const saved = await saveCapsulesData(newCapsules);
        if (!saved) {
            return NextResponse.json({ error: 'Error al eliminar la cápsula' }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Error processing request' }, { status: 500 });
    }
}
