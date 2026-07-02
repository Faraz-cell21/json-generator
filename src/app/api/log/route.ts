import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Log from "@/models/Log";
import { countFields, calculateDepth } from "@/lib/schemaUtils";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { schema, records_requested } = body;

        if (!schema || !records_requested) {
            return NextResponse.json(
                { error: "Schema and records_requested are required" },
                { status: 400 }
            );
        }

        const ip =
            req.headers.get("x-forwaded-for")?.split(",")[0]?.trim() ||
            req.headers.get("x-real-ip") ||
            "unknown";

        const field_count = countFields(schema);
        const nesting_depth = calculateDepth(schema);

        await connectDB();

        await Log.create({
            ip_address: ip,
            schema_submitted : schema,
            field_count,
            nesting_depth,
            records_requested,
        });

        return NextResponse.json(
            { message: "Log saved successfully" },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error saving log:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        )
    }
}