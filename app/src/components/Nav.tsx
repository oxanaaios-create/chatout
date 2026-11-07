'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useConfig } from './useConfig';

const LINKS = [{ href: '/', t: 'Chat' }, { href: '/merchant', t: 'Merchant' }, { href: '/connect', t: 'Connect' }];

export default function Nav() {
  const path = usePathname();
  const cfg = useConfig();
  if (path === '/pay') return null;
  return (
    <header className="nav">
      <Link className="brand" href="/">
        <span className="brand-mark" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 20 20"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h7A2.5 2.5 0 0 1 16 5.5v5a2.5 2.5 0 0 1-2.5 2.5H9l-3.6 3v-3H6.5A2.5 2.5 0 0 1 4 10.5z" fill="#141212" /><path d="M7.5 8.2h5M7.5 10.4h3" stroke="#F4F3F3" strokeWidth="1.4" strokeLinecap="round" /></svg>
        </span>
        <b>Chatout</b>
      </Link>
      <nav className="nav-links">
        {LINKS.map(l => <Link key={l.href} href={l.href} aria-current={path === l.href ? 'page' : undefined}>{l.t}</Link>)}
      </nav>
      <div className="nav-status">
        {cfg && <span className={`chip ${cfg.mode === 'sandbox' ? 'ok' : 'warn'}`}><i />{cfg.mode === 'sandbox' ? 'PayPal sandbox' : 'Demo mode'}</span>}
        {cfg && <span className="chip hide-sm"><i />AI: {cfg.ai === 'gemini' ? 'Gemini' : 'rules'}</span>}
      </div>
    </header>
  );
}
