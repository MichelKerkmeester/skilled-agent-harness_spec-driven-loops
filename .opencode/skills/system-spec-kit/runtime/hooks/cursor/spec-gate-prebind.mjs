#!/usr/bin/env node
// Cursor does not deliver its prompt-classification event under the CLI, so
// sessionStart is the only confirmed place to establish state before the
// pre-tool mutation guard runs. This adapter only initializes state; the
// shared mutation evaluator remains the policy authority.
//
// Two startup outcomes preserve the interactive mutation policy:
// 1. MK_SPEC_FOLDER names a valid spec folder up front: satisfy the gate
//    immediately, mirroring an already-answered Gate 3 (source 'flags', a
//    prebound source, never 'prior_answer').
// 2. No valid declaration, but the operator opted into MK_SPEC_GATE_ENFORCE=1:
//    open the gate so the existing evaluator enforces for the rest of the
//    top-level session. Disabled and dispatched child sessions remain no-ops;
//    the shared core owns that child-session contract centrally.
'use strict';

import * as guardCore from '../../lib/spec-gate/spec-gate-core.mjs';
import { validateSpecFolderBinding } from '../../../shared/dist/gate-3-classifier.js';

function allow() {
  process.stdout.write(JSON.stringify({ permission: 'allow' }));
  process.exit(0);
}

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf8');
}

async function main() {
  let payload;
  try {
    payload = JSON.parse(await readStdin());
  } catch {
    return allow(); // no/invalid payload -> fail open, nothing to pre-bind
  }

  const env = process.env;
  if (env[guardCore.DISABLED_ENV] === '1') return allow();
  if (guardCore.isChildSession(env)) return allow();

  // Preserve the session id VERBATIM: the enforce consumer (spec-gate-enforce.mjs)
  // and the shared core's sessionStateKey() never trim it, so trimming here would
  // write state under a different key than enforcement later reads, letting a
  // whitespace-padded id bypass the gate. Only the emptiness check trims.
  const sessionID = typeof payload?.session_id === 'string' ? payload.session_id : '';
  if (sessionID.trim().length === 0) return allow();

  const workspaceRoot = payload?.workspace_roots?.[0];
  const projectDir = typeof workspaceRoot === 'string' && workspaceRoot.trim()
    ? workspaceRoot
    : process.cwd();
  const { stateDir } = guardCore.resolveGuardPaths(projectDir);
  const existingState = guardCore.readGateState(stateDir, sessionID);
  if (existingState.status === 'satisfied' || existingState.status === 'skipped') return allow();

  const declaredFolder = env.MK_SPEC_FOLDER;
  if (typeof declaredFolder === 'string' && declaredFolder.trim().length > 0) {
    const validation = validateSpecFolderBinding(
      { path: declaredFolder.trim(), source: 'flags' },
      { workspaceRoot: projectDir },
    );
    if (validation.valid && validation.resolvedAbsolutePath) {
      guardCore.writeGateStateAtomic(stateDir, sessionID, {
        status: 'satisfied',
        boundSpecFolder: { path: declaredFolder.trim(), source: 'flags' },
        validatedResolvedPath: validation.resolvedAbsolutePath,
        answeredAtMs: Date.now(),
      });
      return allow();
    }
    // Invalid declarations fall through to explicit enforcement rather than
    // being treated as successful bindings.
  }

  if (env[guardCore.ENFORCE_ENV] === '1') {
    guardCore.writeGateStateAtomic(stateDir, sessionID, { status: 'open', askedAtMs: Date.now() });
  }

  return allow();
}

main().catch(() => allow());
