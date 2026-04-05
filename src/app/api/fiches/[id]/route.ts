import { assignFicheToAdvisor, getFicheById, updateFicheStatus } from "@/lib/fiches-store";
import type { FicheStatus } from "@/types/fiche";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const fiche = getFicheById(id);

  if (!fiche) {
    return Response.json({ message: "Fiche introuvable" }, { status: 404 });
  }

  return Response.json(fiche);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = (await request.json()) as
    | { action: "changeStatus"; status: FicheStatus }
    | { action: "assign"; advisor: string };

  if (body.action === "changeStatus") {
    const updated = updateFicheStatus(id, body.status);

    if (!updated) {
      return Response.json({ message: "Fiche introuvable" }, { status: 404 });
    }

    return Response.json(updated);
  }

  if (body.action === "assign") {
    const updated = assignFicheToAdvisor(id, body.advisor);

    if (!updated) {
      return Response.json({ message: "Fiche introuvable" }, { status: 404 });
    }

    return Response.json(updated);
  }

  return Response.json({ message: "Action invalide" }, { status: 400 });
}
