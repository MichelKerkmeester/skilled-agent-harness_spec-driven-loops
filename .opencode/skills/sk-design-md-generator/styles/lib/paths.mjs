// Single source of truth for styles-library filesystem paths.
//
// Every root and manifest location the engine, indexer, and harness resolve by
// default is defined here so the physical layout can move without editing the
// modules that consume it: callers still pass explicit overrides, and only the
// defaults below change when the tree is restructured or the manifests renamed.
// Restructuring the tree or renaming a manifest changes only the defaults
// below; the retrieval behaviour stays byte-identical.

import path from 'node:path';
import { fileURLToPath } from 'node:url';

const LIB_DIR = path.dirname(fileURLToPath(import.meta.url));

// Corpus + bundle roots. Bundles live under library/bundles/ so the corpus is
// isolated from the engine, tests, and tooling that share the styles root.
export const STYLES_ROOT = path.resolve(LIB_DIR, '..');
export const BUNDLE_ROOT = path.join(STYLES_ROOT, 'library', 'bundles');

// Manifest filenames.
export const CRAWL_MANIFEST_FILENAME = 'crawl-manifest.json';
export const RETRIEVAL_MANIFEST_FILENAME = 'retrieval-manifest.json';

// Default manifest locations. The crawl manifest stays co-located with the
// bundles it enumerates (the corpus root); the retrieval manifest sits beside
// the library under library/manifests/.
export const CRAWL_MANIFEST_PATH = path.join(BUNDLE_ROOT, CRAWL_MANIFEST_FILENAME);
export const RETRIEVAL_MANIFEST_PATH = path.join(STYLES_ROOT, 'library', 'manifests', RETRIEVAL_MANIFEST_FILENAME);

// Mutable persistent-database root. Not created here; publication is owned by
// the database lifecycle and its contents stay out of source control.
export const DATABASE_ROOT = path.join(STYLES_ROOT, 'database');
