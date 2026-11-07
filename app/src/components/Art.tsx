import { art } from '@/lib/art';
export default function Art({ kind, color, v = 0 }: { kind: string; color: string; v?: number }) {
  return <span style={{ display: 'block', width: '100%', height: '100%' }} dangerouslySetInnerHTML={{ __html: art(kind, color, v) }} />;
}
