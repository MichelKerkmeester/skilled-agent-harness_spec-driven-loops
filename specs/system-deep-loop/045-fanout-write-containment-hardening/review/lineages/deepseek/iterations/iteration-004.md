# Iteration 4: D4 Maintainability — duplication, residue and decision-record hygiene

## Focus

Dimension: **maintainability** (D4).
Files: `.opencode/commands/deep/assets/*.yaml` (inline call sites, read-only), `runtime/lib/deep-loop/write-containment.ts`, `runtime/scripts/fanout-run.cjs`, `runtime/tests/stress/cli-adapter/fixtures/worktree-fixture.ts` (ruled out), `decision-record.md`, the hub and runtime feature catalogs.
Scope: the change set's residue after the worktree removal, duplicated maintenance surfaces, and whether the decision record still reads coherently. Static evidence only.

## Scorecard

- Dimensions covered: maintainability
- Files reviewed: 5 primary + 6 supporting
- New findings: P0=0 P1=0 P2=5
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.71

## Findings

### P0, Blocker

None.

### P1, Required

None.

### P2, Suggestion

- **F-019**: Ten byte-identical copies of the inline containment call and its advisory message live across the four command YAMLs, `.opencode/commands/deep/assets/deep-research-auto.yaml:1244, 1334, 1424, 1625`, `deep-research-confirm.yaml:1119`, `deep-review-auto.yaml:1521, 1615, 1705, 1795`, `deep-review-confirm.yaml:1191`. Each block passes the same six options (`repoRoot`, `artifactDir`, `preDispatchDirtyPaths`, `stateLogPath`, `iteration`, `label`), then duplicates the same `write-containment advisory` message and the same preserved-paths log. The drift cost is already visible: two of the ten blocks carry the superseded revert/fail-closed comment above them (F-016), none can pass the `mode` option so the opt-in restore remedy is unreachable from an inline iteration, and any new guard option must be added in ten places or silently defaulted. The runtime guard is versioned and tested; the call-site envelope is copy-pasted configuration with no test covering the copies. Recommendation: one shared helper (the module already exports everything needed) that performs the call, prints the advisory and returns the result, leaving each dispatch branch a one-line call.
- **F-020**: The index-lock contention warning has a single drain site outside its own module, `runtime/scripts/fanout-run.cjs:3171` (`for (const warning of drainGitContentionWarnings())`), while `drainGitContentionWarnings` is exported at `write-containment.ts:312` and the ten inline callers above never call it. Phase 004's stated intent — "an exhausted retry budget is recorded and reported" — therefore reaches only fan-out lanes. An inline iteration that exhausts the 250/500/1000/2000 ms budget records the warning in the module-level list and exits without ever printing it: the retry still fails open, but the operator never learns the guard contended. Recommendation: drain and log inside the shared helper from F-019 (or log at record time inside the guard, where the knowledge exists).
- **F-021**: `decision-record.md`'s supersession chain was not closed out: ADR-003 (the detached ephemeral lane) still carries `Status: Proposed` (`:234-240`) although the lane was implemented in phase 4 (tasks T017-T021 checked) and deleted in phase 7; ADR-005 (the shared-checkout watch for isolated lanes) still carries `Status: Accepted` (`:466-472`) although its subject — "isolated lanes" — no longer exists in the codebase; ADR-007 announces that it "supersedes the mechanism in ADR-004 and ADR-006" (`:540-542`) and does not name ADR-003 or ADR-005, so a reader following the chain arrives at two live-looking decisions for removed machinery. Recommendation: mark ADR-003 `Withdrawn`/`Superseded` and ADR-005 `Superseded by ADR-007`, and extend ADR-007's supersession note to cover both.
- **F-022**: The artifact-scope containment rule is implemented twice with no shared helper: `deep-review-auto.yaml:1328-1360` defines `canonicalLocation`/`escapesArtifactDir` (name test plus canonical test, "resolution can only ever narrow scope"), and `write-containment.ts:574-596` defines the same rule in `isContainedInArtifact` with the same rationale comment — but the module's helper is not exported, so the command guard reimplements it. Two implementations of a security boundary that must agree, in the one place (the cli-opencode guard) where divergence would be hardest to notice, since F-017 shows the surrounding guard is not exercised by any current test. Recommendation: export the canonicalization helper (or a small `isPathInsideArtifact` function) from the module and call it from the YAML.
- **F-023**: The runtime fan-out catalog entry is stale in a way the change set did not touch, while the hub catalog entry was migrated. `.opencode/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-run.md:3` describes the driver as spawning "(opencode, claude, opencode)" and `:42` as "Supports all 3 CLI kinds: `cli-opencode`, `cli-claude-code`, `cli-opencode`" — `cli-codex` is the third kind the code maps (`fanout-run.cjs:473-475`), so the list names one kind twice; and the entry's HOW-IT-WORKS section (`:40-59`) predates the driver's containment enforcement, churn sampler, advisory terminal status and index-lock retry, presenting the progress heartbeat as the only post-045 concern. `git log 5340e39233^..63b633c62f` shows no commit touching this file, while `ca713e3478` migrated the hub entry (`feature-catalog/fanout-write-containment/fanout-write-containment.md`, retitled from "…and Per-Lineage Worktrees"). Recommendation: correct the kind list and add one sentence each for containment ordering, the advisory status and the churn sampler, or point the related-references section at the hub entry explicitly.

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| feature_catalog_code | partial | advisory | hub `fanout-write-containment.md` migrated by `ca713e3478`; runtime `fanout/fanout-run.md:3, 42-59` untouched and understates the driver | F-023 |
| playbook_capability | pass | advisory | `manual-testing-playbook/write-containment/shared-checkout-run.md` | No worktree wording remains; scenario matches the shipped preserve path |
| spec_code | carried from iteration 3 | hard | already failing | Not re-run; no new spec surface reviewed this iteration |

## Assessment

- New findings ratio: 0.71 (five maintainability findings, all new).
- Dimensions addressed: maintainability.
- Novelty justification: this iteration reads the call-site envelope and the decision record rather than behaviour; F-019 to F-022 are structural properties of the migration's shape, and F-023 is a catalog surface no earlier iteration audited.

## Claim Adjudication

No P0/P1 findings this iteration; no adjudication packets required.

## Ruled Out

- The stress fixture `.opencode/skills/system-deep-loop/runtime/tests/stress/cli-adapter/fixtures/worktree-fixture.ts` looked like removal residue but is live harness infrastructure: `createIsolatedWorktrees` is used by the cli-codex suite and the adapter suite to run two fan-outs side by side in separate temporary worktrees (`cli-codex.vitest.ts:374-493`, `adapter-suite.ts:420-523`, `fanout.vitest.ts:340-673`). It tests the runner from an isolated checkout, not the deleted per-lineage mechanism. Correct as-is.
- `runtime-bootstrap.cjs:47-51` and `write-containment.ts:600` reference git worktrees in the general sense (artifact symlinked into another checkout) — live, correct scope-resolution logic, not residue.
- No test still references `checkout_write_detected` or `checkout_watched`; the watch's removal was clean at the test layer.
- The hub catalog entry `feature-catalog/fanout-write-containment/fanout-write-containment.md`: current, accurate, and migrated by the removal commit.

## Dead Ends

- Searching for dormant feature flags or dead branches left by the removal: `executor-config.ts` has no `worktrees` residue, the isolation summary and watch code are gone, and the command YAMLs contain no `--worktrees` reference.
- Auditing the deleted suites' helpers for orphaned imports: no file imports the deleted modules, and no config lists them.

## Recommended Next Focus

D5 Completeness and cross-cutting coverage: the remaining changed files not yet read line by line — `fanout-pool.cjs` advisory accounting, `fanout-merge.cjs` executor attribution, the reducer's registry handling, and the untracked-path advisory path in `write-containment.ts` — plus a final sweep of the seven fix phases' declared scope against their commits.

Review verdict: PASS
