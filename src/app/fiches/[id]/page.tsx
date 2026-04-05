import { FicheDetailPage } from "../../../features/fiches/detail-page";

export default async function FicheDetailsRoute(
  props: Readonly<{ params: Promise<{ id: string }> }>,
) {
  const { id } = await props.params;
  return <FicheDetailPage id={id} />;
}
