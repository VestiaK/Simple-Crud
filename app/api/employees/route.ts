import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { verifyToken } from "../../../lib/jwt";

type AuthUser = {
  id: string;
  email: string;
  role: string;
};

function getAuthUser(req: NextRequest): AuthUser | null {
  // Cara baru mengambil cookie di App Router
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return null;
  }

  try {
    const payload = verifyToken(token) as AuthUser;
    return {
      id: payload.id,
      email: payload.email,
      role: payload.role,
    };
  } catch {
    return null;
  }
}

function canManageEmployee(role: string): boolean {
  return role === "ADMIN" || role === "USER";
}

export async function GET(request: NextRequest) {
  const user = getAuthUser(request);

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (!canManageEmployee(user.role)) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    const employees = await prisma.employee.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ employees, role: user.role }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Gagal mengambil data karyawan", error: String(error) },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const user = getAuthUser(request);

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (user.role !== "ADMIN") {
    return NextResponse.json(
      { message: "Forbidden: Hanya Admin yang bisa melakukan ini" },
      { status: 403 },
    );
  }
  try {
    // Cara baru membaca body request
    const body = await request.json();
    const { nip, name, position, division, status } = body;

    if (!nip || !name || !position || !division || !status) {
      return NextResponse.json(
        { message: "nip, name, position, division, status wajib diisi" },
        { status: 400 },
      );
    }

    const existing = await prisma.employee.findUnique({ where: { nip } });
    if (existing) {
      return NextResponse.json(
        { message: "NIP sudah terdaftar" },
        { status: 409 },
      );
    }

    const employee = await prisma.employee.create({
      data: { nip, name, position, division, status },
    });

    return NextResponse.json(
      { message: "Karyawan berhasil dibuat", employee },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Gagal membuat karyawan", error: String(error) },
      { status: 500 },
    );
  }
}
