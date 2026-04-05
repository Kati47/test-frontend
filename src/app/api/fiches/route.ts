import { NextRequest, NextResponse } from "next/server";
import { listFiches } from "@/lib/fiches-store";
import type { FicheStatus, ProductType, UserRole } from "@/types/fiche";

/**
 * Endpoint liste des fiches.
 * Lit les query params, applique des valeurs sûres,
 * puis délègue le filtrage/paging au store local.
 */
export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);

	const page = Number(searchParams.get("page") ?? 1);
	const pageSize = Number(searchParams.get("pageSize") ?? 10);
	const role = (searchParams.get("role") ?? "ADMIN") as UserRole;
	const advisor = searchParams.get("advisor") ?? undefined;
	const product = (searchParams.get("product") || undefined) as ProductType | undefined;
	const status = (searchParams.get("status") || undefined) as FicheStatus | undefined;
	const search = searchParams.get("search") ?? undefined;

	// Le contrôle rôle + filtres est appliqué côté serveur simulé.
	const result = listFiches({
		role,
		advisor,
		product,
		status,
		search,
		page: Number.isNaN(page) || page < 1 ? 1 : page,
		pageSize: Number.isNaN(pageSize) || pageSize < 1 ? 10 : pageSize,
	});

	return NextResponse.json(result);
}
