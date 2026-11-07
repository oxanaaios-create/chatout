/* Flat product illustrations for the demo catalog (no third-party images). */
export function art(kind: string, c: string, v = 0): string {
  const tf = v === 1 ? 'translate(-30 -26) scale(1.55)' : v === 2 ? 'translate(6 4) rotate(-8 50 50) scale(.92)' : '';
  const bgc = v === 2 ? 'rgba(0,0,0,.06)' : 'rgba(0,0,0,.035)';
  const shade = 'rgba(255,255,255,.14)';
  const S: Record<string, string> = {
    tee:`<path d="M30 24l12-6c2 5 14 5 16 0l12 6 10 14-11 6-4-5v41H35V39l-4 5-11-6z" fill="${c}"/><path d="M42 18c2 5 14 5 16 0" stroke="${shade}" stroke-width="2" fill="none"/><circle cx="50" cy="48" r="9" fill="none" stroke="${shade}" stroke-width="2"/>`,
    hoodie:`<path d="M30 28l10-8c0 9 20 9 20 0l10 8 9 34-10 2-3-14v34H34V50l-3 14-10-2z" fill="${c}"/><path d="M40 20c0 12 20 12 20 0" fill="none" stroke="${shade}" stroke-width="2.4"/><rect x="40" y="62" width="20" height="10" rx="3" fill="${shade}"/>`,
    ticket:`<path d="M18 32h64v12a6 6 0 0 0 0 12v12H18V56a6 6 0 0 0 0-12z" fill="${c}"/><path d="M62 32v36" stroke="rgba(255,255,255,.35)" stroke-dasharray="3 3"/><rect x="25" y="40" width="28" height="4" rx="2" fill="${shade}"/><rect x="25" y="49" width="20" height="3" rx="1.5" fill="${shade}"/><rect x="25" y="56" width="24" height="3" rx="1.5" fill="${shade}"/><circle cx="72" cy="50" r="5" fill="${shade}"/>`,
    poster:`<rect x="26" y="16" width="48" height="68" rx="3" fill="${c}"/><circle cx="50" cy="44" r="14" fill="rgba(255,236,200,.75)"/><rect x="33" y="66" width="34" height="4" rx="2" fill="${shade}"/><rect x="38" y="73" width="24" height="3" rx="1.5" fill="${shade}"/><path d="M38 76c6-4 18-4 24 0" stroke="rgba(255,255,255,.4)" fill="none"/>`,
    tablet:`<rect x="16" y="26" width="68" height="48" rx="6" fill="${c}"/><rect x="22" y="31" width="56" height="38" rx="3" fill="rgba(255,255,255,.12)"/><path d="M30 60c8-14 16 4 24-8s10 2 14-2" stroke="rgba(255,255,255,.55)" stroke-width="1.6" fill="none"/><path d="M76 78l14-30" stroke="#222" stroke-width="3" stroke-linecap="round"/>`,
    film:`<rect x="22" y="22" width="56" height="56" rx="4" fill="${c}"/><path d="M28 70L70 28" stroke="rgba(255,255,255,.35)" stroke-width="6"/><path d="M40 72L72 40" stroke="rgba(255,255,255,.2)" stroke-width="3"/>`,
    jacket:`<path d="M32 22l10-5 8 6 8-6 10 5 10 18-9 6-3-6v44H34V40l-3 6-9-6z" fill="${c}"/><path d="M50 23v61" stroke="rgba(0,0,0,.25)" stroke-width="1.5"/><path d="M42 17l8 14 8-14" fill="none" stroke="${shade}" stroke-width="2"/><rect x="37" y="52" width="9" height="8" rx="1.5" fill="${shade}"/><rect x="54" y="52" width="9" height="8" rx="1.5" fill="${shade}"/>`,
    tote:`<path d="M38 36c0-14 24-14 24 0" fill="none" stroke="${c}" stroke-width="3.5"/><path d="M28 36h44l-4 46H32z" fill="${c}"/><rect x="40" y="52" width="20" height="3" rx="1.5" fill="rgba(0,0,0,.18)"/>`,
    screws:`<g fill="${c}">${([[30,30,-20],[50,26,10],[66,36,35],[38,56,-40],[60,58,15]] as number[][]).map(([x,y,r]) => `<g transform="translate(${x} ${y}) rotate(${r})"><rect x="-7" y="-4" width="14" height="5" rx="2"/><path d="M-2.5 1h5l-1 22h-3z"/><path d="M-4 6l8 2M-4 11l8 2M-4 16l8 2" stroke="rgba(0,0,0,.3)" stroke-width="1.2"/></g>`).join('')}</g>`,
    bit:`<g transform="rotate(-35 50 50)"><rect x="44" y="12" width="12" height="26" rx="2" fill="${c}"/><path d="M45 38h10l-1 42-4 8-4-8z" fill="#9AA5B0"/><path d="M45 46l10 6M45 56l10 6M45 66l10 6" stroke="#5B6672" stroke-width="2"/></g>`,
    drill:`<path d="M22 32h44a8 8 0 0 1 8 8v4a8 8 0 0 1-8 8H50l-4 26H34l4-26H22z" fill="${c}"/><rect x="74" y="38" width="12" height="8" rx="2" fill="#555"/><path d="M86 42h8" stroke="#999" stroke-width="3"/><rect x="32" y="74" width="18" height="12" rx="3" fill="#2B2B2B"/>`
  };
  return `<svg viewBox="0 0 100 100" aria-hidden="true"><rect width="100" height="100" fill="${bgc}"/><ellipse cx="50" cy="88" rx="30" ry="4" fill="rgba(0,0,0,.08)"/><g transform="${tf}">${S[kind] || S.tee}</g></svg>`;
}
