'use client';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Checkout from '@/components/Checkout';
import { Line, P } from '@/components/types';

function Pay() {
  const sp = useSearchParams();
  const [lines, setLines] = useState<Line[] | null>(null);
  const [err, setErr] = useState('');
  const sku = sp.get('sku') || '', option = sp.get('option') || '';
  useEffect(() => {
    fetch(`/api/catalog?sku=${encodeURIComponent(sku)}`).then(r => r.json()).then(j => {
      const p: P | undefined = j.products?.[0];
      if (!p) return setErr('This product is not in the catalog.');
      setLines([{ p, option: p.options.includes(option) ? option : p.options[0], qty: 1 }]);
    }).catch(() => setErr('Could not load the product.'));
  }, [sku, option]);
  return (
    <div style={{ minHeight: '100dvh', display: 'grid', placeItems: 'center', padding: 16 }}>
      {err && <div className="err">{err}</div>}
      {lines && <Checkout standalone lines={lines} host="Store embed" engine="embed" onClose={() => window.close()} onPaid={() => window.close()} />}
    </div>
  );
}
export default function Page() { return <Suspense><Pay /></Suspense>; }
