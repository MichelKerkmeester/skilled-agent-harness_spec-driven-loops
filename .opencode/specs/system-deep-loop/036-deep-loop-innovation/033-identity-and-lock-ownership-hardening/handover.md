---
title: "Handover: 033 Identity and Lock Ownership Hardening — ATTEMPT REVERTED"
description: "Postmortem and path-forward for the 033 remediation attempt: two LUNA builds produced a 451-test regression that could not be isolated within budget; runtime code reverted to landed-024, design docs retained."
trigger_phrases:
  - "033 remediation reverted"
  - "identity lock hardening handover"
  - "451 test regression postmortem"
  - "per-mode certificate fixture digest break"
importance_tier: "critical"
contextType: "handover"
parent: "system-deep-loop/036-deep-loop-innovation/033-identity-and-lock-ownership-hardening"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/033-identity-and-lock-ownership-hardening"
    last_updated_at: "2026-08-06T05:29:50Z"
    last_updated_by: "claude-opus"
    recent_action: "wrote postmortem handover after reverting 033 to landed-024"
    next_safe_action: "re-attempt 033 root-cause-first, gate on full per-mode matrix"
    blockers:
      - "451-test per-mode regression root cause NOT isolated; F001/F002 ruled out by revert"
    key_files:
      - "spec.md"
      - "implementation-summary.md"
      - "../024-durable-write-boundaries/review/lineages/luna/review-report.md"
    completion_pct: 0
    open_questions:
      - "Exact root cause of the 451-test per-mode invalid_input regression — NOT isolated"
    answered_questions:
      - "The 4 review findings (F001-F004) are confirmed real; only the fix execution failed."
---

# Handover — 033 Identity and Lock Ownership Hardening

## STATUS: ATTEMPT REVERTED (design retained, code NOT implemented)

The 033 remediation was **attempted and rolled back**. The runtime code is restored to
the landed-024 state; the 033 *design* docs (spec/plan/tasks/checklist/decision-record)
are retained as the plan of record for a future, correctly-gated re-attempt.

**Verified end state (this worktree):**
- `runtime/lib` + `runtime/tests` working tree == landed-024 commit `5c98e4654e`
  (`git diff --name-only 5c98e4654e -- <lib> <tests>` = empty; no untracked residue).
- `tsc --noEmit -p tsconfig.json` → **rc 0**.
- `tests/unit/agent-improvement-certificates.vitest.ts` → **14/14 pass**
  (this exact suite was **14/14 FAIL** under the 033 attempt).
- **024 is untouched**: it remains landed on `origin/skilled/v4.0.0.0` (`5c98e4654e`).

Worktree: `.worktrees/0129-system-deep-loop-036-remediation-execution`,
branch `system-deep-loop/0129-036-remediation-execution`, HEAD `9229cb8f3e`.
Note: 024's runtime lives here as *uncommitted working changes* (it was landed to origin
via the leak-guard tree-to-tree lander, which does not advance this branch's HEAD). No
re-land of 024 is needed.

---

## What the 024 deep review found (the valuable output — keep)

A 20-iteration deep review of landed-024 (executor **GPT-5.6-LUNA MAX FAST** via cli-codex,
no early convergence) returned **verdict FAIL, P0=3 / P1=3**. Full report:
`024-durable-write-boundaries/review/lineages/luna/review-report.md`.

Confirmed real gaps (verified by direct code read):

| ID | Sev | Site | Gap |
|----|-----|------|-----|
| F001 | P0 | `lib/authorized-ledger/transition-authorization-gateway.ts` (~:655-684) | Gateway fails **OPEN** on identity: each actorId/capabilityId/evidenceDigest check is gated on `expected… !== undefined`, so when no binding and no `identityResolver` resolve, a caller-supplied identity passes **unvalidated**. |
| F002 | P0 | `lib/authorized-ledger/transition-policy-registry.ts` (~:93-107) | Policy identity does not cover closure-captured authorization state: `implementationDigest` hashes only `evaluate.toString()`; two policies with identical source but different captured state get the **same** digest. |
| F003 | P1 | `lib/deep-loop/leaf-artifact-writer.ts` (~:282-325) | Staged leaf publication has **no cross-process single-winner** boundary — in-memory Set + `existsSync` check-then-publish is racy across processes. |
| F004 | P1 | `lib/deep-loop/atomic-state.ts` (~:135-169, `withAppendLock`) | Stale append-lock reclaim is **age-only** (`mtime>30s → rmSync`) with an unconditional `unlinkSync` release — a slow/racing owner's live lock can be dropped, or a successor's lock unlinked. |
| F005 | P0→plausible | `lib/deep-loop/loop-lock.ts` | Fresh-acquisition partial-file window; two winners observed **once**, did NOT reproduce in 3 clean re-runs. Treat as hardening, not a confirmed defect. |
| F007 | P1 | 024 packet docs | Completion-metadata reconciliation (doc-only; separate light task). |

These four (F001-F004) are real gaps that 024's own checks missed and are worth fixing —
**the findings are sound; only the fix execution failed.**

---

## Why 033 was reverted — postmortem

Two LUNA build attempts (initial full fix set, then a targeted re-fix) each ended in a
**catastrophic 451-failed-test regression** across the per-mode suites (certificates,
rollback-gate, resume-adapter, shadow-parity for all 8 modes).

**Deny signature** (observed repeatedly): `reason_code: "invalid_input"`,
`matched_rule_ids: ["identity:actorId"]`, `authority_state: "shadowing"`, on
`policy_id` like `agent-improvement-shadow-write` with a shifted `policy_digest`.

**Isolation performed (all inconclusive):**
- Reverting **F001** (gateway) alone → still failed.
- Reverting **F001 + F002** (gateway + policy registry) → `agent-improvement-certificates`
  **still 14/14 fail**. This proves the cause is **NOT F001/F002 in isolation** — an
  identity policy rule kept denying with `invalid_input` even with the gateway restored to
  its fail-open landed-024 form.

**Leading unresolved hypothesis:** the build propagated `authorizationState: null` to ~60
event-registry / fixture / harness-adapter sites. That most likely shifted the
`event_registry_digest` / `policy_digest` that the **golden** per-mode certificate,
rollback, and resume fixtures assert against — so every mode's stored certificate no longer
matches, surfacing as `invalid_input` at verification. F003/F004 (which alter the shared
append path used by every mode) are a secondary suspect. The true root cause was **not
cleanly isolated within the available budget**, which is why the whole attempt was rolled
back rather than partially landed.

---

## THE HARD LESSON (read before re-attempting)

F001/F002-class fixes have **deep, non-obvious blast radius** through the per-mode
authorization machinery. Two traps caught this attempt:

1. **The 8 shadow-parity harness adapters build the gateway with NO `identityResolver`, by
   design** (they simulate legacy/shadow writes with no identity binding). A *global*
   fail-closed flip therefore over-denies every one of them. The first build hit exactly
   this (deep-ai-council-shadow-parity 15/39 fail). The correct fix distinguishes
   "identity required" (binding or resolver present) → fail closed, from
   "no-identity-by-design" (shadow/legacy) → fail open.

2. **Anything that changes what feeds the policy/event-registry digest breaks every golden
   per-mode fixture at once.** Binding captured authorization state into the digest (F002)
   or blanket-propagating `authorizationState: null` shifts the digest the stored
   certificates assert against → 451-test `invalid_input` cascade. Any such change must
   **regenerate all golden fixtures in lockstep**, or be made digest-backward-compatible.

3. **The build's verification gate was too narrow.** It ran only the "owned" suites
   (authorized-ledger, locks-and-fencing, atomic-state, leaf-artifact-writer, …) and never
   the per-mode certificate/rollback/resume/shadow-parity matrix — so it reported green
   while 451 tests were broken; only the post-hoc full aggregate caught it.

**Mandatory conditions for any re-attempt:**
- **Start with root-cause isolation, NOT a rebuild.** Two blind rebuilds failed identically.
  From clean landed-024, re-derive the changes one finding at a time and run the full
  per-mode matrix after each, to find the exact change that first turns a per-mode suite red
  with `invalid_input`. Confirm/kill the digest-shift hypothesis first (apply ONLY the
  `authorizationState: null` propagation, no gateway/policy change, and run the matrix).
- The verification gate **MUST** be the **full per-mode matrix** (certificates,
  rollback-gate, resume-adapter, shadow-parity × all 8 modes) — not the owned suites —
  with red-before/green-after against that matrix for each fix.
- F001 fix = identity-required predicate (fail closed only when a binding/resolver exists;
  fail open for no-identity-by-design shadow/legacy modes). All existing forged-actor /
  forged-capability / forged-evidence tests must still pass.
- F002 fix = if captured state is bound into the digest, regenerate **all** golden
  certificate/rollback/resume fixtures in the same change, or make the new digest
  backward-compatible; prove old fixtures still verify.
- Keep the Sonnet adversarial pass (explicit `model: sonnet`) before any land.

---

## Working headless deep-review mechanism (epic deliverable — preserve)

`opencode run --command deep/review` does **NOT** work headlessly (the agent narrates
instead of executing the loop). The working path is calling the fan-out runner directly:

```
AI_SESSION_CHILD=1 MK_SPEC_GATE_ENFORCE=0 \
node .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs \
  --spec-folder <spec-folder> \
  --loop-type review \
  --fanout-config-json '<cfg>' \
  --base-artifact-dir <spec-folder>/review \
  --convergence-threshold 0.10 \
  --stop-policy max-iterations
```

Working `<cfg>` (20 iters, GPT-5.6-LUNA MAX FAST, single lineage):

```json
{"executors":[{"kind":"cli-codex","model":"gpt-5.6-luna","reasoningEffort":"max","serviceTier":"fast","timeoutSeconds":1800,"iterations":20,"count":1,"label":"luna"}],"assignment_model":"flat_pool","concurrency":1,"maxCostUnitsPerLineage":500,"max_aggregate_cost_units":500}
```

Notes: default `maxCostUnitsPerLineage` (72) rejects a 20-iter lineage — raise it. Do NOT
set `sandboxMode: read-only` (it blocks the loop's own state writes). Output lands at
`review/lineages/<label>/review-report.md`.

---

## Next steps

1. **024** — landed + clean. No action.
2. **033** — retain design docs; re-attempt the *code* with the mandatory conditions above,
   OR defer. This handover + the 024 review report are the full brief for that re-attempt.
3. **F007** (024 doc-metadata reconciliation) — separate light doc-only task, deferred.
4. **WS1 036 runtime chain** (026→027→…→032, 019, 020) — resumes after 033 is properly
   landed or explicitly deferred.

## Environment gotchas (carried forward)

- node = `/opt/homebrew/bin/node`; after `cd` into the worktree a chpwd hook clobbers PATH →
  `export PATH="/opt/homebrew/bin:/usr/bin:/bin:$PATH"` **after** cd.
- tsc = `../../system-spec-kit/node_modules/.bin/tsc` (from `runtime`); vitest =
  `runtime/node_modules/.bin/vitest`.
- `vitest.config.ts` has `fileParallelism:false` (shared graph SQLite) — never
  `--fileParallelism`. `git checkout -- database/` before isolation runs (tracked
  test byproducts). better-sqlite3 rebuilt for ABI 141.
- Landing uses the leak-guard tree-to-tree lander (seeds a temp index from fresh origin
  FETCH_HEAD, guards 0 deletions + all-under-prefix, commit-tree + braced push with
  `SPECKIT_ALLOW_REMOTE_PUSH=1`). It does not advance the local branch HEAD.
