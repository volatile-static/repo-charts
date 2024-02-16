import { build } from 'esbuild';

build({
  entryPoints: ['src/index.tsx'],
  bundle: true,
  sourcemap: 'both',
  outfile: 'dist/main.js',
}).catch(() => process.exit(1));
