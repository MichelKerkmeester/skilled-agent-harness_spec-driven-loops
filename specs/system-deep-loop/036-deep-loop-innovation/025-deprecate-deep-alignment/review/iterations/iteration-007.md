---
title: "Iteration 007 — Security (Broadened Angle 3: Adversarial Replay)"
trigger_phrases: []
---
# Iteration 007 — Security (Broadened Angle 3: Adversarial Replay)

## Dimension
security — adversarial replay of the retired Phase-0 dispatch-context gate, frozen-artifact integrity of the packet-001 census edit, and write-containment coverage for the cli-cursor/devin/pi leaves.

## Files Reviewed
- `.opencode/hooks/task-dispatch/lib/dispatch-guard.cjs:1-493` (surviving deterministic guard; `isCommandDrivenIteration` at 142-165)
- `.opencode/skills/system-deep-loop/runtime/scripts/render-command-contract.cjs` (e41aa1878ad removed the DISPATCH-CONTEXT prefix, 8 lines)
- `.opencode/skills/system-deep-loop/runtime/tests/unit/render-command-contract.vitest.ts` (e41aa1878ad removed the gate-resolution test, 22 lines)
- `git show e41aa1878ad` — Phase-0 gate retirement across 33 files (8 deep/* commands + prompt/improve + 4 legacy bodies + 3 presentations + 023 spec packet)
- `git show d1a5981b58c` — single-dispatch branches for cli-cursor/devin/pi in deep-alignment-auto.yaml (and research/review auto YAMLs)
- `git show 8849444aa6` — 3-row edit to frozen `state-backend-census.json` (removed alignment-config-corpus, alignment-state-deltas, alignment-projections)
- `specs/.../003-baseline-taxonomy-and-state-census/state-backend-census.json:1-60,184-189` (freeze contract: `baseSha`, `lifecycle: "create once, frozen"`)
- `specs/.../003-baseline-taxonomy-and-state-census/phase-004-handoff-manifest.json:18-40` (stores `sha256` per artifact)
- `specs/.../003-baseline-taxonomy-and-state-census/validate-evidence.cjs:388,408,419,489` (assertEvidencePath + BASE_SHA inclusion check)
- `specs/.../003-baseline-taxonomy-and-state-census/spec.md:126` (REQ-010: frozen auditable handoff with hashes)
- Guard caller surface: `.opencode/hooks/task-dispatch/{claude/task-dispatch-guard.cjs,pi/task-dispatch-guard.ts,lib/dispatch-guard.cjs}`, `.opencode/plugins/system-deep-loop-guard.js`

## Findings by Severity

### P0
None.

### P1
None.

### P2

#### P2-011 — Surviving deterministic guard is runtime-asymmetric; Phase-0 retirement removed the only runtime-neutral boundary
- **Claim:** The retired Phase-0 dispatch-context gate was the only runtime-NEUTRAL (prompt-level) boundary against a pasted-inline deep/* command doc gaining command authority. The surviving deterministic guard (`dispatch-guard.cjs:isCommandDrivenIteration`, 142-165) covers a DIFFERENT threat (loop-repeat via repeated non-command-driven Task hand-offs) and is wired only into runtimes that have a Task-tool PreToolUse adapter: claude (`claude/task-dispatch-guard.cjs`), pi (`pi/task-dispatch-guard.ts`), and opencode (`plugins/system-deep-loop-guard.js`). There is NO adapter for cli-cursor or cli-devin orchestrators. On a cursor/devin-orchestrated deep-loop, no boundary enforces the loop-repeat block-at-3 invariant (WARN_AT_COUNT=2 / BLOCK_AT_COUNT=3, dispatch-guard.cjs:80-81).
- **Evidence refs:** [SOURCE: `.opencode/hooks/task-dispatch/lib/dispatch-guard.cjs:142-165`]; [SOURCE: caller surface grep — claude/pi/opencode only, no cursor/devin adapter]; [SOURCE: `git show e41aa1878ad` removed DISPATCH-CONTEXT prefix from render-command-contract.cjs].
- **Counter-evidence sought:** (1) Confirmed the new d1a5981b58c branches dispatch cursor/devin/pi as LEAF subprocesses via `buildLineageCommand` + `runAuditedExecutorCommand` — these are process spawns, not Task dispatches, so the loop-repeat guard is structurally inapplicable to them (a subprocess cannot hand off to another agent). (2) Confirmed write-containment (`enforceWriteContainment` + `snapshotOutOfScopeDirtyPaths`) IS present in the new branches and bounds leaf write scope regardless of orchestrator runtime. (3) Confirmed the Phase-0 gate was already non-functional pre-retirement — the commit message documents capable orchestrators false-blocked genuine invocations because the model cannot observe invocation provenance.
- **Alternative explanation:** The asymmetry is pre-existing (guard adapters were always claude/pi/opencode only); the commits under review did not create or worsen it. The retirement removed a boundary that was already broken in the false-positive direction and defended authority the operator had already session-granted (theatrical, not a real escalation).
- **Final severity:** P2 — the unguarded case requires a cursor/devin orchestrator running a deep-loop with repeated non-command-driven hand-offs (an abuse pattern, not an external attack); leaf write scope is still bounded by containment; pre-existing, not introduced.
- **Confidence:** 0.82
- **Downgrade trigger:** Would upgrade to P1 only if a code path exists where a cursor/devin orchestrator can be coerced into repeated loop hand-offs by untrusted prompt content AND containment does not revert the out-of-scope writes — not demonstrated this iteration.

#### P2-012 — Frozen census edit was contract-correct, but the handoff-manifest sha256 is now stale and unenforced
- **Claim:** The 3-row removal from frozen packet-001 `state-backend-census.json` (8849444aa6) was contract-CORRECT for the evidence-exists invariant: `validate-evidence.cjs:388,408,419` calls `assertEvidencePath` on every census row's `evidence`, and the removed rows (`alignment-config-corpus`, `alignment-state-deltas`, `alignment-projections`) pointed at deleted alignment runtime files (`deep-alignment/references/state-machine-wiring.md`, `runtime/scripts/reduce-alignment-state.cjs`); leaving them would fail validation. An additive overlay would NOT have fixed the stale evidence references. HOWEVER, `phase-004-handoff-manifest.json:23-26` stores a content `sha256` (`e35a707bc969f075e1e4fb0558a9b211f48c526a47d7d0a121e8712d54bb9441`) for the census at freeze time; the edit changed the census content, so this hash is now stale, and 8849444aa6 did NOT update the handoff manifest (confirmed absent from commit stat). REQ-010 (spec.md:126) promises a "frozen, auditable handoff" with hashes; the hash is now inconsistent with the artifact it claims to freeze.
- **Evidence refs:** [SOURCE: `phase-004-handoff-manifest.json:23-26` sha256=e35a707b…]; [SOURCE: `validate-evidence.cjs:388,408,419` assertEvidencePath]; [SOURCE: `git show 8849444aa6` census diff — 3 rows removed, handoff manifest not in stat]; [SOURCE: `spec.md:126` REQ-010].
- **Counter-evidence sought:** (1) Confirmed `validate-evidence.cjs` does NOT recompute-and-compare the handoff manifest hashes — line 489 only asserts the census SOURCE includes the `BASE_SHA` string (the `baseSha` field at census line 3, preserved as `fe6ca303…`), not byte-equality to base. This is why the commit's "validate --strict 0/0" passed despite the edit. (2) Confirmed the census `baseSha` field was preserved (not bumped), so the BASE-anchor assertion still holds. (3) The selective removal left `alignment-control` (a lock surface) intact — consistent with removing only rows whose evidence pointed at deleted files.
- **Alternative explanation:** The handoff manifest hash may be intended as a freeze-time snapshot only (not a live integrity gate), in which case stale hashes are expected after any justified post-freeze remediation and the manifest is historical, not enforced.
- **Final severity:** P2 — audit-trail/hash drift, not a functional break; no validator enforces the manifest hashes, so no gate fails. The edit itself was the correct remediation.
- **Confidence:** 0.78
- **Downgrade trigger:** Would upgrade to P1 if a downstream replay/rollback consumer trusts the handoff manifest hash for integrity and a stale hash causes a false tamper alert or a rollback that restores the pre-edit census (re-introducing broken evidence refs) — not demonstrated this iteration.

## Traceability Checks
- **spec_code:** REQ-010 (frozen auditable handoff with hashes) vs shipped state — PARTIAL: the handoff manifest exists and hashes artifacts, but the census hash is stale post-8849444aa6 and unenforced (P2-012). The evidence-exists invariant (implied by validate-evidence.cjs) IS satisfied by the row removal.
- **checklist_evidence:** Not re-run (observation-only; prior iterations ruled this direction out — strategy.md §9).
- **skill_agent / agent_cross_runtime / feature_catalog_code / playbook_capability:** Deferred (strategy.md §9 exhausted-approaches; not security-relevant this angle).

## Ruled-Out Directions (this iteration)
- **Write-containment gap for cli-cursor/devin/pi leaves:** The new d1a5981b58c branches mirror the cli-codex branch — `enforceWriteContainment` + `snapshotOutOfScopeDirtyPaths` + `runAuditedExecutorCommand` are present in all three inserted branches. Containment is post-hoc reversion (snapshot pre-dispatch dirty paths, revert out-of-scope writes post-dispatch), consistent across all CLI executor kinds. The known limitation (a path already dirty before dispatch can mask a leaf modification) is pre-existing and shared with cli-codex, not introduced by these commits. No new gap found. RULED OUT.
- **Pasted-inline authority escalation as external attack:** The retired Phase-0 gate defended command authority that is operator-session-granted, not command-granted; a pasted-inline doc cannot escalate beyond the session's existing write permit. Theatrical, not a real escalation. RULED OUT as P1+.

## SCOPE VIOLATIONS
None. All writes confined to the allowed iteration/delta/strategy paths.

## Verdict
P2-only findings this iteration (P2-011, P2-012). No P0, no P1.

Review verdict: PASS
