/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [{ source: '/embed.js', headers: [{ key: 'Access-Control-Allow-Origin', value: '*' }] },
            { source: '/api/catalog', headers: [{ key: 'Access-Control-Allow-Origin', value: '*' }] }];
  }
};
export default nextConfig;
