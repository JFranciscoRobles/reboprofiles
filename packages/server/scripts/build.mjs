// The package as it goes to npm: `tools/package.mjs` says how.
import { buildPackage } from '../../../tools/package.mjs';

await buildPackage('server', {
  entries: { index: 'src/index.ts' },
  exports: { '.': 'index' },
  keywords: ['profile', 'link-in-bio', 'analytics', 'tracking', 'server'],
  homepage: 'https://github.com/JFranciscoRobles/reboprofiles#readme',
});
