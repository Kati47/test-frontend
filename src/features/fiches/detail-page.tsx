"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { assignFiche, changeFicheStatus, fetchFicheById } from "@/features/fiches/api";
import { ADVISORS, STATUSES } from "@/features/fiches/constants";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";

const statusSchema = z.object({
  status: z.enum(["NEW", "ASSIGNED", "IN_PROGRESS", "CLOSED"]),
});

const assignSchema = z.object({
  advisor: z.string().min(1),
});

interface Props {
  id: string;
}

/**
 * Page détail d'une fiche: consultation + actions (statut / assignation).
 */
export function FicheDetailPage({ id }: Readonly<Props>) {
  const queryClient = useQueryClient();

  // Chargement du dossier depuis l'API locale.
  const ficheQuery = useQuery({
    queryKey: ["fiche", id],
    queryFn: () => fetchFicheById(id),
  });

  // Formulaire de changement de statut.
  const statusForm = useForm<{ status: z.infer<typeof statusSchema>["status"] }>({
    resolver: zodResolver(statusSchema),
    defaultValues: { status: "NEW" },
  });

  // Formulaire d'assignation conseiller.
  const assignForm = useForm<{ advisor: string }>({
    resolver: zodResolver(assignSchema),
    defaultValues: { advisor: ADVISORS[0] },
  });

  useEffect(() => {
    if (ficheQuery.data) {
      statusForm.reset({ status: ficheQuery.data.status });
      assignForm.reset({ advisor: ficheQuery.data.advisor });
    }
  }, [assignForm, ficheQuery.data, statusForm]);

  // Mutation statut + invalidation ciblée du cache React Query.
  const statusMutation = useMutation({
    mutationFn: async (values: { status: z.infer<typeof statusSchema>["status"] }) => changeFicheStatus(id, values.status),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["fiche", id] });
      await queryClient.invalidateQueries({ queryKey: ["fiches"] });
    },
  });

  // Mutation assignation + invalidation ciblée du cache React Query.
  const assignMutation = useMutation({
    mutationFn: async (values: { advisor: string }) => assignFiche(id, values.advisor),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["fiche", id] });
      await queryClient.invalidateQueries({ queryKey: ["fiches"] });
    },
  });

  if (ficheQuery.isLoading) {
    return (
      <div className="mx-auto w-full max-w-4xl px-6 py-8">
        <div className="rounded-xl border border-[#BBBBD0]/70 bg-[#FDFCFD] p-6 text-[#5A6B7F] shadow-[0_8px_24px_rgba(30,41,59,0.08)] animate-fade-up">
          Chargement de la fiche...
        </div>
      </div>
    );
  }

  if (ficheQuery.isError || !ficheQuery.data) {
    return (
      <div className="mx-auto w-full max-w-4xl px-6 py-8">
        <div className="rounded-xl border border-[#BBBBD0]/70 bg-[#FDFCFD] p-6 text-[#ED4A52] shadow-[0_8px_24px_rgba(30,41,59,0.08)] animate-fade-up">
          Impossible de charger cette fiche.
        </div>
      </div>
    );
  }

  const fiche = ficheQuery.data;

  return (
    <div className="mx-auto w-full max-w-4xl space-y-5 px-6 py-8">
      {/* Entête de contexte fiche */}
      <section className="overflow-hidden rounded-xl border border-[#BBBBD0]/70 bg-[#FDFCFD] p-6 shadow-[0_8px_24px_rgba(30,41,59,0.08)] animate-fade-up">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs tracking-[0.22em] text-[#ED4A52]">FICHE ASSURANCE</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-wide text-[#1E293B]">Dossier de {fiche.client.name}</h1>
           
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-full border border-[#BBBBD0]/70 bg-[#FDFCFD] px-3 py-1 text-xs font-semibold tracking-wide text-[#5A6B7F]">
              {fiche.status}
            </div>
            <Link href="/" className="text-sm font-medium text-[#64748B] hover:text-[#2B4B83]">
              Retour liste
            </Link>
          </div>
        </div>
      </section>

      {/* Contenu métier: client, produit et actions */}
      <div className="grid gap-5 md:grid-cols-2">
        <Card className="rounded-xl shadow-[0_8px_24px_rgba(30,41,59,0.08)] animate-fade-up">
          <CardHeader className="bg-[#FDFCFD]">
            <CardTitle className="text-lg tracking-wide text-[#1E293B]">Section Client</CardTitle>
            <div className="mt-2 h-1 w-10 rounded-full bg-[#ED4A52]" />
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-[#5A6B7F]">
            <p>
              <span className="font-semibold text-[#1E293B]">Nom :</span> {fiche.client.name}
            </p>
            <p>
              <span className="font-semibold text-[#1E293B]">Téléphone :</span> {fiche.client.phone}
            </p>
            <p>
              <span className="font-semibold text-[#1E293B]">Email :</span> {fiche.client.email}
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-[0_8px_24px_rgba(30,41,59,0.08)] animate-fade-up">
          <CardHeader className="bg-[#FDFCFD]">
            <CardTitle className="text-lg tracking-wide text-[#1E293B]">Section Produit</CardTitle>
            <div className="mt-2 h-1 w-10 rounded-full bg-[#ED4A52]" />
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-[#5A6B7F]">
            <p>
              <span className="font-semibold text-[#1E293B]">Type :</span> {fiche.product.type}
            </p>
            <p>
              <span className="font-semibold text-[#1E293B]">Garanties :</span> {fiche.product.garanties.join(", ")}
            </p>
            <p>
              <span className="font-semibold text-[#1E293B]">Prime :</span> {fiche.product.prime} €
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-[0_8px_24px_rgba(30,41,59,0.08)] md:col-span-2 animate-fade-up">
          <CardHeader className="bg-[#FDFCFD]">
            <CardTitle className="text-lg tracking-wide text-[#1E293B]">Section Actions</CardTitle>
            <div className="mt-2 h-1 w-10 rounded-full bg-[#ED4A52]" />
          </CardHeader>
          <CardContent className="grid gap-5 bg-[#FDFCFD] md:grid-cols-2">
            <form
              className="space-y-3 rounded-xl border border-[#BBBBD0]/70 bg-[#FDFCFD] p-4 shadow-[0_4px_14px_rgba(30,41,59,0.04)]"
              onSubmit={statusForm.handleSubmit((values) => statusMutation.mutate(values))}
            >
              <p className="text-sm font-medium text-[#2B4B83]">Changer statut</p>
              <Select {...statusForm.register("status")}>
                {STATUSES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </Select>
              <Button type="submit" disabled={statusMutation.isPending} className="w-full">
                Changer statut
              </Button>
            </form>

            <form
              className="space-y-3 rounded-xl border border-[#BBBBD0]/70 bg-[#FDFCFD] p-4 shadow-[0_4px_14px_rgba(30,41,59,0.04)]"
              onSubmit={assignForm.handleSubmit((values) => assignMutation.mutate(values))}
            >
              <p className="text-sm font-medium text-[#ED4A52]">Assigner</p>
              <Select {...assignForm.register("advisor")}>
                {ADVISORS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </Select>
              <Button type="submit" variant="outline" disabled={assignMutation.isPending} className="w-full">
                Assigner
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
