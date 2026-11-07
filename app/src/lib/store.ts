/* In-memory order log for the demo dashboard. Resets on server restart.
   The browser also keeps its own copy, so the dashboard survives serverless cold starts. */
export type OrderRecord = {
  id: string;
  paypalOrderId: string;
  mode: 'sandbox' | 'demo';
  status: string;
  total: number;
  currency: 'EUR';
  host: string;
  engine: string;
  stores: { id: string; name: string; amount: number; integration: 'webhook' | 'agent' }[];
  captures: { unit: string; id: string; status: string; amount?: string }[];
  items: number;
  createdAt: string;
  seed?: boolean;
};

const g = globalThis as unknown as { __chatoutOrders?: OrderRecord[] };
g.__chatoutOrders ??= [];
export const orders = g.__chatoutOrders;

export function record(o: OrderRecord) {
  if (!orders.some(x => x.id === o.id)) orders.unshift(o);
  if (orders.length > 500) orders.length = 500;
  return o;
}
