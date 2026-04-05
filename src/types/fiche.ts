export type ProductType = "AUTO" | "MRH" | "RCPRO";

export type FicheStatus = "NEW" | "ASSIGNED" | "IN_PROGRESS" | "CLOSED";

export type UserRole = "ADMIN" | "ADVISOR";

export interface ClientInfo {
  name: string;
  phone: string;
  email: string;
}

export interface ProductInfo {
  type: ProductType;
  garanties: string[];
  prime: number;
}

export interface Fiche {
  id: string;
  client: ClientInfo;
  status: FicheStatus;
  advisor: string;
  createdAt: string;
  product: ProductInfo;
}

export interface FicheListResponse {
  data: Fiche[];
  total: number;
  page: number;
  pageSize: number;
}
