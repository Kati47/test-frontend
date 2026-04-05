import MOCK_FICHES from "@/lib/mock-fiches";
import type { Fiche, FicheStatus, ProductType, UserRole } from "@/types/fiche";

// État mémoire simulant une base de données locale.
const state: { fiches: Fiche[] } = {
  fiches: structuredClone(MOCK_FICHES),
};

export interface ListFilters {
  role: UserRole;
  advisor?: string;
  product?: ProductType;
  status?: FicheStatus;
  search?: string;
  page: number;
  pageSize: number;
}

/**
 * Retourne une liste paginée de fiches avec filtrage par rôle,
 * conseiller, produit, statut et recherche texte.
 */
export function listFiches(filters: ListFilters) {
  const { role, advisor, product, status, search, page, pageSize } = filters;

  const filtered = state.fiches.filter((fiche) => {
    if (role === "ADVISOR" && advisor && fiche.advisor !== advisor) {
      return false;
    }

    if (product && fiche.product.type !== product) {
      return false;
    }

    if (status && fiche.status !== status) {
      return false;
    }

    if (search && !fiche.client.name.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }

    return true;
  });

  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const data = filtered.slice(start, start + pageSize);

  return { data, total, page, pageSize };
}

/**
 * Récupère une fiche unique par identifiant.
 */
export function getFicheById(id: string) {
  return state.fiches.find((fiche) => fiche.id === id);
}

/**
 * Met à jour le statut d'une fiche.
 */
export function updateFicheStatus(id: string, status: FicheStatus) {
  const fiche = getFicheById(id);
  if (!fiche) {
    return null;
  }

  fiche.status = status;
  return fiche;
}

/**
 * Assigne une fiche à un conseiller.
 * Si la fiche est NEW, elle passe automatiquement en ASSIGNED.
 */
export function assignFicheToAdvisor(id: string, advisor: string) {
  const fiche = getFicheById(id);
  if (!fiche) {
    return null;
  }

  fiche.advisor = advisor;
  if (fiche.status === "NEW") {
    fiche.status = "ASSIGNED";
  }

  return fiche;
}
