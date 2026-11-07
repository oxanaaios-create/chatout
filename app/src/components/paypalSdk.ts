'use client';
let loading: Promise<any> | null = null;
export function loadPayPal(clientId: string, payees: string[]): Promise<any> {
  if ((window as any).paypal) return Promise.resolve((window as any).paypal);
  if (loading) return loading;
  loading = new Promise((resolve, reject) => {
    const s = document.createElement('script');
    const multi = payees.length > 1;
    s.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(clientId)}&currency=EUR&intent=capture&components=buttons${multi ? '&merchant-id=*' : ''}`;
    if (multi) s.setAttribute('data-merchant-id', payees.join(','));
    s.onload = () => resolve((window as any).paypal);
    s.onerror = () => { loading = null; reject(new Error('The PayPal script did not load. Check your connection and the client ID.')); };
    document.head.appendChild(s);
  });
  return loading;
}
