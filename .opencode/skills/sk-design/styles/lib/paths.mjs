// Single source of truth for styles-library filesystem paths.
//
// Every root and manifest location the engine, indexer, and harness resolve by
// default is defined here so the physical layout can move without editing the
// modules that consume it: callers still pass explicit overrides, and only the
// defaults below change when the tree is restructured or the manifests renamed.
// During the restructure these defaults intentionally still point at the
// current (pre-move) locations so the retrieval behaviour stays byte-identical.

import path from 'node:path';
import { fileURLToPath } from 'node:url';

const LIB_DIR = path.dirname(fileURLToPath(import.meta.url));

// Corpus + bundle roots. Bundles currently live directly under the styles root.
export const STYLES_ROOT = path.resolve(LIB_DIR, '..');
export const BUNDLE_ROOT = STYLES_ROOT;

// Manifest filenames (renamed as a unit at the restructure's Checkpoint A).
export const CRAWL_MANIFEST_FILENAME = '_manifest.json';
export const RETRIEVAL_MANIFEST_FILENAME = '_retrieval-manifest.json';

// Default manifest locations derived from the roots + filenames above.
export const CRAWL_MANIFEST_PATH = path.join(STYLES_ROOT, CRAWL_MANIFEST_FILENAME);
export const RETRIEVAL_MANIFEST_PATH = path.join(STYLES_ROOT, RETRIEVAL_MANIFEST_FILENAME);

// Mutable persistent-database root. Not created here; publication is owned by
// the database lifecycle and its contents stay out of source control.
export const DATABASE_ROOT = path.join(STYLES_ROOT, '_db');
