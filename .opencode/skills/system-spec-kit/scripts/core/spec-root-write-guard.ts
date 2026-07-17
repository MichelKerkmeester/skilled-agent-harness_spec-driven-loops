// ───────────────────────────────────────────────────────────────────
// MODULE: Spec Root Write Guard
// ───────────────────────────────────────────────────────────────────

import * as path from 'node:path';

import { classifySpecRootCollision } from './spec-root-collision-classifier.js';
import { assertWritersUnfrozen } from './spec-writer-freeze.js';

// ───────────────────────────────────────────────────────────────────
// 1. PUBLIC API
// ───────────────────────────────────────────────────────────────────

/** Reject a packet write when global or packet-root safety cannot be established. */
export function assertSpecWriteAllowed(relativePacketId: string, workspacePath: string): void {
  assertWritersUnfrozen();

  const resolvedWorkspace = path.resolve(workspacePath);
  const collision = classifySpecRootCollision(relativePacketId, [
    {
      rootPath: path.join(resolvedWorkspace, '.opencode', 'specs'),
      kind: 'canonical',
    },
    {
      rootPath: path.join(resolvedWorkspace, 'specs'),
      kind: 'legacy',
    },
  ]);

  if (collision.klass !== 'divergent-duplicate') return;

  const roots = collision.presentRoots.length > 0
    ? collision.presentRoots.join(', ')
    : 'no readable packet roots';
  throw new Error(
    `Spec packet write blocked for "${relativePacketId}": `
      + `collision class is divergent-duplicate (${roots}).`,
  );
}
