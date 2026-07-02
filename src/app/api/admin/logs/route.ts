import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { connectDB } from "@/lib/db";
import Log from "@/models/Log";

export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get("admin_token")?.value;

        if (!token) {
            return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    await jwtVerify(token, secret);

    await connectDB();

    const logs = await Log.find().sort({ createdAt: -1 }).limit(100);

    return NextResponse.json({ logs }, { status: 200 });
    } catch (error) {
        console.error("Error fetching logs:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}