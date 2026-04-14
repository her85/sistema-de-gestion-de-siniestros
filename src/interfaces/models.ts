
export interface Image {
  id: string;
  url: string;
}

export interface Claim {
  id: string;
  claimNumber: string;
  userId: string;
  description: string;
  incidentDate?: string;
  location?: string;
  status?: string;
  amount?: number | null;
  images?: Image[];
}

export interface CreateClaimDTO {
  userId: string;
  description: string;
  incidentDate: Date | string;
  location?: string;
  images: string[];
}
