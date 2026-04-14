import { api } from 'boot/axios'
import type { Claim, CreateClaimDTO } from 'src/interfaces/models'

const base = '/claims'

export async function getClaims(filters?: { status?: string; date?: string }) {
  const params = filters || {}
  const res = await api.get<Claim[]>(base, { params })
  return res.data
}

export async function getClaim(id: string) {
  const res = await api.get<Claim>(`${base}/${id}`)
  return res.data
}

export async function createClaim(payload: CreateClaimDTO) {
  const res = await api.post<Claim>(base, payload)
  return res.data
}

export async function updateClaimStatus(id: string, status: string, amount?: number) {
  const res = await api.patch<Claim>(`${base}/${id}/status`, { status, amount })
  return res.data
}

export default { getClaims, getClaim, createClaim, updateClaimStatus }
