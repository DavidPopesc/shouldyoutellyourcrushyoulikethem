import { NextRequest, NextResponse } from "next/server";

import { getNextStep } from "@/lib/quiz-flow";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { stepId?: string; answerId?: string };

  if (!body.stepId || !body.answerId) {
    return NextResponse.json({ error: "missing stepId or answerId" }, { status: 400 });
  }

  const nextStep = getNextStep(body.stepId, body.answerId);
  if (!nextStep) {
    return NextResponse.json({ error: "invalid quiz transition" }, { status: 400 });
  }

  return NextResponse.json(nextStep);
}
