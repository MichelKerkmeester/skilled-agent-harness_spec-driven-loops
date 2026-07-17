---
title: "456 -- Canonical-first spec-root resolution"
description: "This scenario validates canonical-first bare-name resolution, explicit-path preservation, legacy-only read fallback, divergent-duplicate write rejection, and no-alias writes without touching either live spec root."
version: 1.0.0.0
---

# 456 -- Canonical-first spec-root resolution

This document captures the temporary-workspace manual validation contract for canonical-first spec-root resolution.

---

## 1. OVERVIEW

This scenario validates the operator-visible resolution and write-safety contract using disposable directories created under the operating-system temp directory. It never reads from, writes to, renames, removes, or replaces the checkout's live `.opencode/specs` or `specs` paths.

### Why This Matters

A bare packet identity must have one predictable canonical winner without making explicit migration paths unusable. Legacy-only packets must remain readable during rollout, but divergent physical owners must never accept an implicit write. The final no-alias check proves ordinary canonical writes do not recreate a plain `specs/` directory as a side effect.

The implementation is present on this implementation branch. Passing this scenario does not prove that real production packet migration or compatibility-alias retirement has occurred; those actions remain deployment-gated by the migration and alias-retirement runbook.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and temporary-workspace command sequence for `456` and confirm all five outcomes without contradictory evidence.

- Objective: Prove canonical-first resolution of a bare packet name, explicit-path preservation, legacy-only read fallback, divergent-duplicate write rejection, and no plain `specs/` re-materialization.
- Real user request: `Validate the canonical-first spec-root behavior in a disposable workspace and show me that it never touches or recreates the repository's legacy specs root.`
- Prompt: `Validate canonical-first spec-root resolution in an operating-system temporary workspace. Prove bare-name canonical precedence, explicit-path preservation, legacy-only read fallback, divergent-duplicate write rejection, and a guarded canonical write that does not create a plain specs/ root. Return PASS or FAIL with the temporary path and JSON evidence.`
- Expected execution process: Create two isolated temporary workspaces, import the branch implementation through `tsx`, materialize canonical/legacy fixture packets, execute the resolver and write guard, and capture the emitted JSON object.
- Expected signals: `bareCanonical`, `explicitPreserved`, `legacyFallback`, `divergentWriteRejected`, and `noAliasPreserved` are all `true`; `legacyExistsBefore` and `legacyExistsAfter` are both `false`; the divergence error names `divergent-duplicate`.
- Desired user-visible outcome: A concise `PASS` verdict with the temporary workspace path and the emitted evidence object, or `FAIL` naming the first violated contract.
- Pass/fail: PASS only when the command exits `0`, every boolean above matches the expected value, and both evidence paths remain under the printed temporary root.

---

## 3. TEST EXECUTION

### Prompt

```text
Validate canonical-first spec-root resolution in an operating-system temporary workspace. Prove bare-name canonical precedence, explicit-path preservation, legacy-only read fallback, divergent-duplicate write rejection, and a guarded canonical write that does not create a plain specs/ root. Return PASS or FAIL with the temporary path and JSON evidence.
```

### Commands

1. From the repository root, create an isolated playground and a writer-freeze runtime directory. Confirm the printed path begins with the operating-system temp directory and is not the repository root.

   ```bash
   export SPEC_ROOT_PLAYGROUND="$(mktemp -d "${TMPDIR:-/tmp}/spec-root-manual.XXXXXX")"
   export SPEC_KIT_WRITER_FREEZE_DIR="$SPEC_ROOT_PLAYGROUND/freeze"
   mkdir -p "$SPEC_KIT_WRITER_FREEZE_DIR"
   printf 'SPEC_ROOT_PLAYGROUND=%s\n' "$SPEC_ROOT_PLAYGROUND"
   ```

2. Run the branch implementation against only that temporary playground. The script intentionally leaves the playground available for evidence inspection; it performs no checkout cleanup and has no path to the live spec roots.

   ```bash
   cd .opencode/skills/system-spec-kit/scripts
   npx tsx <<'TS'
   import * as fs from 'node:fs';
   import * as path from 'node:path';

   import { resolveSpecFolderCanonical } from './core/spec-root-canonical-resolver.ts';
   import { assertSpecWriteAllowed } from './core/spec-root-write-guard.ts';

   const playground = process.env.SPEC_ROOT_PLAYGROUND;
   if (!playground) throw new Error('SPEC_ROOT_PLAYGROUND is required');

   const workspace = path.join(playground, 'workspace');
   const canonicalRoot = path.join(workspace, '.opencode', 'specs');
   const legacyRoot = path.join(workspace, 'specs');
   fs.mkdirSync(workspace, { recursive: true });

   function createPacket(root: string, packetId: string, content: string): string {
     const packetPath = path.join(root, packetId);
     fs.mkdirSync(packetPath, { recursive: true });
     fs.writeFileSync(path.join(packetPath, 'spec.md'), content, 'utf8');
     return packetPath;
   }

   const dualId = 'manual/001-dual';
   const canonicalDual = createPacket(canonicalRoot, dualId, '# Same packet\n');
   const legacyDual = createPacket(legacyRoot, dualId, '# Same packet\n');
   const bareResolved = resolveSpecFolderCanonical(dualId, workspace);
   const explicitResolved = resolveSpecFolderCanonical(`specs/${dualId}`, workspace);

   const legacyOnlyId = 'manual/002-legacy-only';
   const legacyOnly = createPacket(legacyRoot, legacyOnlyId, '# Legacy only\n');
   const fallbackResolved = resolveSpecFolderCanonical(legacyOnlyId, workspace);

   const divergentId = 'manual/003-divergent';
   createPacket(canonicalRoot, divergentId, '# Canonical copy\n');
   createPacket(legacyRoot, divergentId, '# Legacy copy\n');
   let divergenceError = '';
   try {
     assertSpecWriteAllowed(divergentId, workspace);
   } catch (error: unknown) {
     divergenceError = error instanceof Error ? error.message : String(error);
   }

   const noAliasWorkspace = path.join(playground, 'no-alias-workspace');
   const noAliasId = 'manual/004-no-alias';
   const noAliasPacket = createPacket(
     path.join(noAliasWorkspace, '.opencode', 'specs'),
     noAliasId,
     '# No alias\n',
   );
   const noAliasLegacyRoot = path.join(noAliasWorkspace, 'specs');
   const legacyExistsBefore = fs.existsSync(noAliasLegacyRoot);
   const noAliasResolved = resolveSpecFolderCanonical(noAliasId, noAliasWorkspace);
   assertSpecWriteAllowed(noAliasId, noAliasWorkspace);
   fs.writeFileSync(path.join(noAliasResolved, 'implementation-summary.md'), '# Saved\n', 'utf8');
   const legacyExistsAfter = fs.existsSync(noAliasLegacyRoot);

   const evidence = {
     playground,
     bareCanonical: bareResolved === canonicalDual,
     explicitPreserved: explicitResolved === legacyDual,
     legacyFallback: fallbackResolved === legacyOnly,
     divergentWriteRejected: divergenceError.includes('divergent-duplicate'),
     divergenceError,
     noAliasPreserved: noAliasResolved === noAliasPacket,
     legacyExistsBefore,
     legacyExistsAfter,
   };
   const passed = evidence.bareCanonical
     && evidence.explicitPreserved
     && evidence.legacyFallback
     && evidence.divergentWriteRejected
     && evidence.noAliasPreserved
     && !evidence.legacyExistsBefore
     && !evidence.legacyExistsAfter;

   console.log(JSON.stringify({ verdict: passed ? 'PASS' : 'FAIL', ...evidence }, null, 2));
   process.exitCode = passed ? 0 : 1;
   TS
   ```

3. From the repository root, run the existing focused regression set as corroborating evidence. It uses its own operating-system temp fixtures and does not target the checkout's spec roots.

   ```bash
   cd .opencode/skills/system-spec-kit
   npx vitest run scripts/tests/spec-root-canonical-resolver.vitest.ts scripts/tests/spec-root-collision-classifier.vitest.ts scripts/tests/spec-root-write-guard.vitest.ts scripts/tests/spec-root-validation-matrix.vitest.ts --config mcp_server/vitest.config.ts --root .
   ```

### Expected

- Bare `manual/001-dual` resolves to `<playground>/workspace/.opencode/specs/manual/001-dual` even though an identical legacy copy exists.
- Explicit `specs/manual/001-dual` remains `<playground>/workspace/specs/manual/001-dual`.
- Bare `manual/002-legacy-only` resolves to its existing legacy packet.
- `assertSpecWriteAllowed()` rejects `manual/003-divergent` with `collision class is divergent-duplicate` and reports both physical roots.
- The no-alias write lands at `<playground>/no-alias-workspace/.opencode/specs/manual/004-no-alias/implementation-summary.md`, while `<playground>/no-alias-workspace/specs` is absent before and after the write.
- The four-file focused spec-root regression set exits `0`.

### Evidence

Capture the printed `SPEC_ROOT_PLAYGROUND` path, the complete JSON object, the divergence error, and the focused Vitest summary. Inspect evidence only under the printed temporary path; do not substitute either checkout spec root.

### Pass / Fail

- **Pass**: the manual probe exits `0` with `verdict: "PASS"`, all five contract booleans are `true`, both legacy-root existence booleans are `false`, and the focused regression set exits `0`.
- **Fail**: any bare name selects the wrong root, an explicit path is repointed, legacy-only fallback fails, the divergent write is allowed, `specs/` appears in the no-alias workspace, or either command exits non-zero.

### Failure Triage

Inspect `scripts/core/spec-root-canonical-resolver.ts` first for precedence or explicit-path failures, `scripts/core/spec-root-collision-classifier.ts` and `scripts/core/spec-root-write-guard.ts` for divergence failures, and `scripts/tests/spec-root-validation-matrix.vitest.ts` for no-alias regressions. A failure in this disposable scenario is implementation-branch evidence only; do not attempt production migration or alias removal as a troubleshooting shortcut.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario registration |
| `../../feature_catalog/tooling_and_scripts/canonical_first_spec_root_resolution.md` | Matching current-state capability reference and deployment-gated rollout status |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skills/system-spec-kit/scripts/core/spec-root-canonical-resolver.ts:43-72` | Canonical-first bare-name resolution, explicit-path preservation, and legacy-only read fallback |
| `.opencode/skills/system-spec-kit/scripts/core/spec-root-write-guard.ts:14-38` | Writer-freeze enforcement and divergent-duplicate rejection |
| `.opencode/skills/system-spec-kit/scripts/tests/spec-root-canonical-resolver.vitest.ts:35-79` | Focused tests for the resolver contract |
| `.opencode/skills/system-spec-kit/scripts/tests/spec-root-validation-matrix.vitest.ts:185-205` | No-alias guarded write with no plain `specs/` root materialized |
| `.opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/research.md:138-147` | Deployment and alias-retirement gates; not evidence of production execution |

---

## 5. SOURCE METADATA

- Group: Tooling And Scripts
- Playbook ID: 456
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `tooling_and_scripts/canonical_first_spec_root_resolution.md`
- Destructive: No — all fixture writes stay under a newly created operating-system temp directory.
- Deployment status: Implementation-branch capability present; real-data migration and alias retirement not claimed as run in production.
