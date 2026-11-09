// The package as it goes to npm: `tools/package.mjs` says how.
import { buildPackage } from '../../../tools/package.mjs';

await buildPackage('core', {
  entries: { index: 'src/index.ts' },
  exports: { '.': 'index' },
  keywords: ['profile', 'link-in-bio', 'linktree', 'landing-page', 'blocks'],
  homepage: 'https://github.com/JFranciscoRobles/reboprofiles#readme',
});
