// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Persistent Style Database Test Fixtures                                 ║
// ╚══════════════════════════════════════════════════════════════════════════╝

import path from 'node:path';

import {
  STYLE_ALPHA,
  STYLE_BETA,
  createFixtureCorpus,
} from '../../_engine/__tests__/fixtures.mjs';
import { runBuild } from '../../_engine/style-library.mjs';
import { indexStyleCorpus } from '../indexer.mjs';
import { openStyleDatabase } from '../schema.mjs';

export { STYLE_ALPHA, STYLE_BETA };

/**
 * Create a two-style authoritative corpus and its in-memory projection.
 *
 * @param {import('node:test').TestContext} context - Test cleanup owner.
 * @returns {Promise<Object>} Corpus, database, manifest, and generation details.
 */
export async function createIndexedFixture(context, styles) {
  const fixture = await createFixtureCorpus(styles);
  const database = openStyleDatabase();
  context.after(() => {
    database.close();
    return fixture.cleanup();
  });
  const manifestPath = path.join(fixture.root, '_retrieval-manifest.json');
  await runBuild(['--write'], { corpusRoot: fixture.root, manifestPath });
  const indexed = await indexStyleCorpus({
    corpusRoot: fixture.root,
    database,
    corpusWalkMode: 'migration',
  });
  return { fixture, database, manifestPath, indexed };
}
