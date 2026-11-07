'use client';
import { useEffect, useState } from 'react';

export type Config = { mode: 'sandbox' | 'demo'; clientId: string | null; currency: 'EUR'; ai: 'gemini' | 'rules'; multiPayee: boolean; payees: string[] };
let cache: Promise<Config> | null = null;

export function useConfig() {
  const [cfg, setCfg] = useState<Config | null>(null);
  useEffect(() => {
    cache ??= fetch('/api/config').then(r => r.json());
    cache.then(setCfg).catch(() => setCfg({ mode: 'demo', clientId: null, currency: 'EUR', ai: 'rules', multiPayee: false, payees: [] }));
  }, []);
  return cfg;
}
