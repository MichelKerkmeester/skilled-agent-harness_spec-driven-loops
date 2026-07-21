// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Persistent Style Database Operator Tests                                 ║
// ╚══════════════════════════════════════════════════════════════════════════╝

import assert from 'node:assert/strict';
import path from 'node:path';
import test from 'node:test';

import {
  appendDesignText,
  createFixtureCorpus,
} from '../engine/fixtures.mjs';
import { runStyleDatabaseOperator } from '../../lib/database/operator.mjs';
import { resolvePublishedDatabasePath } from '../../lib/database/schema.mjs';

test('operator commands retain only the current and rollback generations', async (context) => {
  const fixture = await createFixtureCorpus();
  context.after(fixture.cleanup);
  const databasePath = path.join(fixture.base, 'operator-style.sqlite');
  const commonArguments = ['--corpus', fixture.root, '--database', databasePath];

  const first = await runStyleDatabaseOperator(['build', ...commonArguments]);
  await appendDesignText(fixture.root, 'alpha', 'Second operator generation.');
  const second = await runStyleDatabaseOperator(['build', ...commonArguments]);
  await appendDesignText(fixture.root, 'alpha', 'Third operator generation.');
  const third = await runStyleDatabaseOperator(['build', ...commonArguments]);

  const status = await runStyleDatabaseOperator(['status', '--database', databasePath]);
  assert.equal(status.published, true);
  assert.equal(status.currentGenerationPath, third.generationDatabasePath);
  assert.equal(status.rollbackGenerationPath, second.generationDatabasePath);
  assert.equal(status.retainedGenerationPaths.length, 2);
  assert.ok(third.retention.removed.includes(first.generationDatabasePath));

  const repaired = await runStyleDatabaseOperator([
    'repair',
    '--database', databasePath,
    '--profile', 'style-default-v1',
  ]);
  assert.equal(repaired.action, 'repair');
  assert.equal(repaired.queued, 2);

  const rolledBack = await runStyleDatabaseOperator(['rollback', '--database', databasePath]);
  assert.equal(rolledBack.action, 'rollback');
  assert.equal(resolvePublishedDatabasePath(databasePath), second.generationDatabasePath);

  const cutover = await runStyleDatabaseOperator([
    'cutover',
    '--database', databasePath,
    '--generation', third.generationDatabasePath,
  ]);
  assert.equal(cutover.action, 'cutover');
  assert.equal(resolvePublishedDatabasePath(databasePath), third.generationDatabasePath);
});
