import type { Fiche, FicheListResponse, FicheStatus, ProductType, UserRole } from "@/types/fiche";

export interface ListQueryParams {
  page: number;
  product: "" | ProductType;
  status: "" | FicheStatus;
  search: string;
  role: UserRole;
  advisor: string;
}

export async function fetchFiches(params: ListQueryParams): Promise<FicheListResponse> {
  const query = new URLSearchParams({
    page: String(params.page),
    pageSize: "10",
    role: params.role,
  });

  if (params.product) {
    query.set("product", params.product);
  }
  if (params.status) {
    query.set("status", params.status);
  }
  if (params.search) {
    query.set("search", params.search);
  }
  if (params.role === "ADVISOR" && params.advisor) {
    query.set("advisor", params.advisor);
  }

  const response = await fetch(`/api/fiches?${query.toString()}`);
  if (!response.ok) {
    throw new Error("Erreur lors du chargement des fiches.");
  }

  return response.json();
}

export async function fetchFicheById(id: string): Promise<Fiche> {
  const response = await fetch(`/api/fiches/${id}`);
  if (!response.ok) {
    throw new Error("Impossible de charger la fiche.");
  }

  return response.json();
}

export async function changeFicheStatus(id: string, status: FicheStatus): Promise<Fiche> {
  const response = await fetch(`/api/fiches/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "changeStatus", status }),
  });

  if (!response.ok) {
    throw new Error("Impossible de changer le statut.");
  }

  return response.json();
}

export async function assignFiche(id: string, advisor: string): Promise<Fiche> {
  const response = await fetch(`/api/fiches/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "assign", advisor }),
  });

  if (!response.ok) {
    throw new Error("Impossible d'assigner la fiche.");
  }

  return response.json();
}
