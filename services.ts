import type { DrawResult, Reading } from './types';

const API_BASE = '';

export function getOrCreateSessionId(): string {
  const key = 'mystic_tarot_session_id';
  const existing = localStorage.getItem(key);
  if (existing && existing.length >= 8) return existing;
  const next = crypto.randomUUID();
  localStorage.setItem(key, next);
  return next;
}

async function apiFetch<T>(input: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${input}`, {
    ...init,
    headers: {
      'content-type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });

  const text = await res.text();
  const json = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const message =
      typeof json?.error === 'string' ? json.error : `Request failed (${res.status})`;
    throw new Error(message);
  }

  return json as T;
}

export async function createReading(cards: DrawResult[]): Promise<Reading> {
  const sessionId = getOrCreateSessionId();
  return apiFetch<Reading>('/api/readings', {
    method: 'POST',
    body: JSON.stringify({ sessionId, cards }),
  });
}

export async function listReadings(limit = 20): Promise<Reading[]> {
  const sessionId = getOrCreateSessionId();
  const params = new URLSearchParams({ sessionId, limit: String(limit) });
  return apiFetch<Reading[]>(`/api/readings?${params.toString()}`);
}

export async function getReading(id: string): Promise<Reading> {
  const sessionId = getOrCreateSessionId();
  const params = new URLSearchParams({ sessionId });
  return apiFetch<Reading>(`/api/readings/${encodeURIComponent(id)}?${params.toString()}`);
}

export async function getInterpretation(cards: Array<{ name: string, isReversed: boolean }>): Promise<string> {
  const res = await apiFetch<{ interpretation: string }>('/api/interpret', {
    method: 'POST',
    body: JSON.stringify({ cards }),
  });
  return res.interpretation;
}

