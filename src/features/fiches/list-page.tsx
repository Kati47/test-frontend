"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchFiches } from "@/features/fiches/api";
import { ADVISORS, PRODUCTS, STATUSES } from "@/features/fiches/constants";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type { FicheStatus, ProductType, UserRole } from "@/types/fiche";

/**
 * Carte statistique réutilisable pour l'entête de la page liste.
 */
function StatCard({
  label,
  value,
  tone,
  subtitle,
}: Readonly<{ label: string; value: string; tone: "blue" | "red"; subtitle?: string }>) {
  return (
    <div className="rounded-xl border border-[#94A3B8]/60 bg-white p-4 shadow-[0_10px_26px_rgba(15,23,42,0.08)]">
      <p className="text-[10px] tracking-[0.18em] text-[#475569]">{label}</p>
      <p
        className={
          tone === "red"
            ? "mt-2 text-2xl font-semibold tracking-wide text-[#ED4A52]"
            : "mt-2 text-2xl font-semibold tracking-wide text-[#2B4B83]"
        }
      >
        {value}
      </p>
      {subtitle && <p className="mt-1 text-xs text-[#334155]">{subtitle}</p>}
    </div>
  );
}

export function FicheListPage() {
  // État UI des filtres et de la pagination.
  const [page, setPage] = useState(1);
  const [role, setRole] = useState<UserRole>("ADMIN");
  const [advisor, setAdvisor] = useState(ADVISORS[0]);
  const [product, setProduct] = useState<"" | ProductType>("");
  const [status, setStatus] = useState<"" | FicheStatus>("");
  const [search, setSearch] = useState("");

  // Chargement serveur (API locale) basé sur l'état courant de la vue.
  const query = useQuery({
    queryKey: ["fiches", page, role, advisor, product, status, search],
    queryFn: () =>
      fetchFiches({
        page,
        role,
        advisor,
        product,
        status,
        search,
      }),
  });

  const totalPages = query.data ? Math.max(1, Math.ceil(query.data.total / 10)) : 1;
  const roleCount = query.data?.total ?? 0;
  const roleCountLabel = role === "ADMIN" ? "FICHES TOTALES" : "FICHES ASSIGNÉES";
  const currentUserName = role === "ADMIN" ? "Admin Zenith" : advisor;

  // Garde-fou pagination: évite de rester sur une page invalide après filtrage.
  useEffect(() => {
    if (query.isSuccess && page > totalPages) {
      setPage(totalPages);
    }
  }, [page, query.isSuccess, totalPages]);

  // Memo pour éviter de recréer le panneau de filtres à chaque render.
  const filterPanel = useMemo(
    () => (
      <div className="grid gap-3 rounded-xl border border-[#BBBBD0]/70 bg-[#FDFCFD] p-4 shadow-[0_4px_14px_rgba(30,41,59,0.04)] md:grid-cols-5">
        <Select
          value={role}
          onChange={(event) => {
            setRole(event.target.value as UserRole);
            setPage(1);
          }}
        >
          <option value="ADMIN">ADMIN</option>
          <option value="ADVISOR">ADVISOR</option>
        </Select>

        {role === "ADVISOR" && (
          <Select
            value={advisor}
            onChange={(event) => {
              setAdvisor(event.target.value);
              setPage(1);
            }}
          >
            {ADVISORS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
        )}

        <Select
          value={product}
          onChange={(event) => {
            setProduct(event.target.value as "" | ProductType);
            setPage(1);
          }}
        >
          <option value="">Produit (tous)</option>
          {PRODUCTS.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </Select>

        <Select
          value={status}
          onChange={(event) => {
            setStatus(event.target.value as "" | FicheStatus);
            setPage(1);
          }}
        >
          <option value="">Statut (tous)</option>
          {STATUSES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </Select>

        <div className="relative md:col-span-2">
          <Input
            value={search}
            className="pl-3"
            placeholder="Rechercher par nom client"
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>
    ),
    [advisor, product, role, search, status],
  );

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-8">
      {/* Résumé haut de page */}
      <section className="mb-6 overflow-hidden rounded-xl border border-[#94A3B8]/60 bg-white p-6 shadow-[0_10px_28px_rgba(15,23,42,0.08)] animate-fade-up">
        <div className="flex flex-col gap-6">
          <div className="max-w-3xl">
            <h1 className="mt-2 text-[2.15rem] font-semibold tracking-tight text-[#0F172A] sm:text-[2.35rem]">
              Tableau des Fiches
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[#334155]">
              Une vue claire pour suivre les fiches, filtrer rapidement et accéder aux détails en un clic.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <StatCard label={roleCountLabel} value={String(roleCount)} tone="blue" />
            <StatCard label="UTILISATEUR" value={role} subtitle={currentUserName} tone="red" />
          </div>
        </div>
      </section>

      {/* Zone principale: filtres, table et pagination */}
      <Card className="overflow-hidden rounded-xl border-[#94A3B8]/60 shadow-[0_10px_28px_rgba(15,23,42,0.08)] animate-fade-up">
        <CardHeader className="bg-[#F8FAFC]">
          <CardTitle className="text-xl tracking-wide text-[#0F172A]">Filtres & Résultats</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5 bg-white">
          {filterPanel}

          {query.isLoading && (
            <div className="rounded-xl border border-[#94A3B8]/60 bg-[#F8FAFC] p-4 text-[#334155] shadow-[0_6px_18px_rgba(15,23,42,0.06)] animate-fade-in">
              Chargement des fiches...
            </div>
          )}

          {!query.isLoading && query.data && query.data.data.length === 0 && (
            <div className="rounded-xl border border-[#FCA5A5] bg-[#FFF1F2] p-4 text-[#B91C1C] shadow-[0_6px_18px_rgba(15,23,42,0.06)] animate-fade-in">
              Aucune fiche trouvée pour les filtres sélectionnés.
            </div>
          )}

          {!query.isLoading && query.data && query.data.data.length > 0 && (
            // Tableau paginé des fiches.
            <div className="overflow-x-auto rounded-xl border border-[#94A3B8]/60 bg-white shadow-[0_10px_24px_rgba(15,23,42,0.06)] animate-fade-up">
              <table className="w-full min-w-[900px] text-sm">
                <thead className="bg-[#E2E8F0] text-[#0F172A]">
                  <tr>
                    <th className="px-4 py-4 text-left text-xs tracking-[0.12em] text-[#334155]">Nom client</th>
                    <th className="px-4 py-4 text-left text-xs tracking-[0.12em] text-[#334155]">Produit</th>
                    <th className="px-4 py-4 text-left text-xs tracking-[0.12em] text-[#334155]">Statut</th>
                    <th className="px-4 py-4 text-left text-xs tracking-[0.12em] text-[#334155]">Conseiller</th>
                    <th className="px-4 py-4 text-left text-xs tracking-[0.12em] text-[#334155]">Date création</th>
                    <th className="px-4 py-4 text-left text-xs tracking-[0.12em] text-[#334155]">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {query.data.data.map((fiche) => (
                    <tr
                      key={fiche.id}
                      className="border-t border-[#CBD5E1] bg-white transition-colors hover:bg-[#F1F5F9] even:bg-[#F8FAFC]"
                    >
                      <td className="px-4 py-3 font-medium text-[#0F172A]">{fiche.client.name}</td>
                      <td className="px-4 py-3 text-[#334155]">{fiche.product.type}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={fiche.status} />
                      </td>
                      <td className="px-4 py-3 text-[#334155]">{fiche.advisor}</td>
                      <td className="px-4 py-3 text-[#334155]">
                        {new Date(fiche.createdAt).toLocaleDateString("fr-FR")}
                      </td>
                      <td className="px-4 py-3">
                        <Link href={`/fiches/${fiche.id}`}>
                          <Button size="sm" variant="outline">
                            Voir
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex items-center justify-between rounded-xl border border-[#94A3B8]/60 bg-[#F8FAFC] px-4 py-3 shadow-[0_6px_18px_rgba(15,23,42,0.05)]">
            <p className="text-sm font-medium text-[#334155]">
              Page {page} / {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={page <= 1}
              >
                Précédent
              </Button>
              <Button
                onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                disabled={page >= totalPages}
              >
                Suivant
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
