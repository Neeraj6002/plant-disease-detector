// app/api/detect/route.ts

import { NextRequest, NextResponse } from "next/server";
import { detectDisease } from "@/lib/openrouter";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No image provided." }, { status: 400 });
    }

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Only JPG and PNG images are supported." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    const result = await detectDisease(base64, file.type);
    return NextResponse.json(result);
  } catch (err: unknown) {
    console.error("Detection error:", err);
    return NextResponse.json(
      { error: "Failed to analyze image. Please try again." },
      { status: 500 }
    );
  }
}