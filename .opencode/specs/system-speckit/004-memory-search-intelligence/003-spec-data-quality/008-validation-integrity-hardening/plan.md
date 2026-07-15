---
title: "Implementation Plan: Validation-Gate Hardening"
description: "Four independent rule changes over the existing check-*.sh / validator-registry.json architecture: a disk-truth identity check, a shared status classifier feeding a new cross-doc rule and a scaffold-never-touched fix, a completion-claim freshness sweep, and a content-substance redesign of EVIDENCE_CITED."
trigger_phrases:
  - "validation gate hardening"
  - "evidence cited redesign"
  - "scaffold never touched complete match"
  - "strict pass freshness sweep"
  - "metadata disk path consistency"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/003-spec-data-quality/008-validation-integrity-hardening"
    last_updated_at: "2026-07-10T08:09:04.000Z"
    last_updated_by: "claude-code"
    recent_action: "Phase R audit remediation completed: swarm-implemented, Sonnet-verified, all tasks evidenced"
    next_safe_action: "Review Phase R evidence and the consolidated swarm commit"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Validation-Gate Hardening

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope. Remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash rule modules (`scripts/rules/*.sh`) plus one Node/CommonJS helper (`check-canonical-save-helper.cjs`), dispatched by `scripts/spec/validate.sh` via `scripts/lib/validator-registry.json`; the sweep entrypoint is TypeScript on Node |
| **Framework** | None — the rule-module `run_check()` contract documented in `scripts/rules/README.md` |
| **Storage** | None of its own; rules read spec-folder files and the real filesystem, the sweep reads the spec corpus |
| **Testing** | Existing shell test harnesses (`scripts/tests/test-validation*.sh`, `scripts/tests/test-validation-system.cjs`) plus a new `graph-metadata-backfill.vitest.ts`-style vitest for the sweep |

### Overview
Two of the four fixes are narrow corrections inside existing rule modules (F7b's literal-match fix in `check-scaffold-never-touched.sh`, F9's content-heuristic redesign in `check-evidence.sh`). The other two are new rule modules registered the same way every existing rule is registered — a new `check-*.sh` file plus a `validator-registry.json` entry (`scripts/rules/README.md` §5-6) — that reuse two things already proven live in the codebase: `derivePacketIdFromPath()` (already in `check-canonical-save-helper.cjs`, F4's disk-truth source) and the `SPECKIT_CHILD_DRIFT_ENFORCE` advisory-by-default flag shape (already in `check-graph-metadata-child-drift.sh`, F4's and F7a's rollout template). F7a and F7b additionally share one new small classifier helper so the two rules can never define "complete" differently from each other again. F8 is a thin fan-out sweep entrypoint plus a scheduled workflow, structurally identical to the already-planned (but unbuilt) `011-scheduled-dq-sweep` sibling, narrowed to completion-claiming folders and regression diffing rather than general data-quality detection.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Four independent, additive changes over the existing registry-dispatched rule-module architecture. No new orchestration layer; `validate.sh` and the registry are unchanged in shape, only in contents.

### Key Components
- **`scripts/lib/status-classifier.sh`** (new): a single function, e.g. `classify_status(raw_value) -> {planned|in-progress|complete}`, sourced by both `check-status-cross-doc-consistency.sh` and `check-scaffold-never-touched.sh`. Mirrors the existing shared-helper pattern already used for priority parsing (`check-evidence.sh:25-29` sources `scripts/lib/check-priority-helper.sh` for exactly this reason — one regex, two consumers).
- **`check-metadata-disk-consistency.sh`** (new, F4): resolves the folder's real on-disk relative path (reusing `derivePacketIdFromPath()`'s logic, ported to bash or called via the existing `.cjs` helper) and compares it against `description.json.specFolder`, `graph-metadata.json.spec_folder`/`parent_id`, and the continuity `packet_pointer`. Reports `warn` unless `SPECKIT_METADATA_DISK_CONSISTENCY_ENFORCE=true`.
- **`check-status-cross-doc-consistency.sh`** (new, F7a): reads `spec.md` Status (reusing the same `awk` table-cell extraction `check-scaffold-never-touched.sh:39-51` already does) and `implementation-summary.md` Status, classifies both via `status-classifier.sh`, and reports `warn` unless `SPECKIT_STATUS_CROSS_DOC_ENFORCE=true`.
- **`check-scaffold-never-touched.sh`** (modified, F7b): line 53's `[[ "$status_value" == Complete* ]]` becomes a call into `status-classifier.sh`; no other logic in the file changes.
- **`check-evidence.sh`** (modified, F9): the three independent `has_evidence=true` substring checks (lines 90, 93, 96) are replaced by one content-substance check applied to the full item text (see "Affected surfaces" below for the exact heuristic shape and the calibration note).
- **`scripts/sweep/strict-pass-freshness.ts`** (new, F8): iterates folders under `--roots` whose `implementation-summary.md` Status classifies as `complete` (via the same `status-classifier.sh` logic, ported/re-implemented in TS or shelled out to), runs `validate.sh --json` on each, and diffs the result against a last-recorded result stored alongside the sweep's own report artifact. Report-only; no corpus writes.
- **`.github/workflows/strict-pass-freshness-sweep.yml`** (new, F8): `schedule:` plus `workflow_dispatch`, no commit step, no write credential — matching `011-scheduled-dq-sweep`'s planned workflow shape exactly, coordinated (not merged) with it per REQ-009.

### Data Flow
`validate.sh` reads the registry, dispatches each rule module's `run_check()` against the target folder, and collects `RULE_*` output (`scripts/rules/README.md` §6 "Main flow" diagram — unchanged by this phase). The two new rule modules and the two modified ones plug into that same dispatch with no changes to `validate.sh` itself, only to the registry contents and the rule files. The sweep is a separate, standalone entrypoint outside the `validate.sh` dispatch — it *calls* `validate.sh --json` as a subprocess per folder, the same relationship `011-scheduled-dq-sweep`'s plan already describes for its own detector fan-out.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `check-canonical-save-helper.cjs` (`CANONICAL_SAVE_PACKET_IDENTITY_NORMALIZED`, lines 209-228) | Cross-checks three metadata surfaces against each other only, always emits `pass` | Add a disk-truth comparison branch, gated by the new rollout flag | `grep -n "emit('pass'" check-canonical-save-helper.cjs` after the change shows the drift branch now conditionally emits `warn`/`error`, not unconditional `pass` |
| `check-graph-metadata-child-drift.sh` (lines 100-118) | Owns the `SPECKIT_CHILD_DRIFT_ENFORCE` advisory-flag pattern | Not modified — reused as the template for F4's and F7a's flags | `diff` confirms zero changes to this file |
| `check-scaffold-never-touched.sh` (line 53) | Gates the scaffold-marker scan on a literal `Complete*` bash-glob match | Replace with a `status-classifier.sh` call | Fixture with `Status: Shipped` plus a `template-author` marker fails after the change; fails to fail today (reproduced) |
| `check-evidence.sh` (lines 90, 93, 96) | Three independent bare-marker substring checks | Replace with one content-substance heuristic over the full item text | The two real bare-stamp fixtures cited in spec.md fail after the change; `032`'s 25 prose-evidence items pass after the change |
| `scripts/lib/validator-registry.json` | Registers all 43 existing rule ids, aliases, severities and script paths | Add `METADATA_DISK_PATH_CONSISTENCY` and `STATUS_CROSS_DOC_CONSISTENCY` entries; no change to existing entries' `rule_id`/`aliases` for the two modified rules (their behavior changes, their identity does not) | `validate.sh <any-folder>` output lists both new rule ids by name |
| `011-scheduled-dq-sweep` (`002-spec-data-quality/002-retroactive-automation/011-scheduled-dq-sweep/`, planned, unbuilt) | Plans a general full-corpus `schedule:`-triggered data-quality sweep folding in `validate.sh --json` | Not modified — coordination check only (REQ-009), decide consolidate-vs-separate at implementation time | The coordination-check task (tasks.md) records the decision and its rationale before the new workflow file lands |

Required inventories:
- Same-class producers: `rg -n "Complete\*|status_value" .opencode/skills/system-spec-kit/scripts/rules` — confirms `check-scaffold-never-touched.sh` is the only consumer of this literal-match pattern before the fix.
- Consumers of changed symbols: `rg -n "check-evidence|EVIDENCE_CITED" .opencode/skills/system-spec-kit` — confirms which docs/tests reference the rule id by name so none silently break on an id rename (there is none — the id itself does not change, only its internal logic).
- Matrix axes: bracketed-vs-prose evidence, complete-vs-non-complete status (four label variants: `Complete`, `Shipped`, `Done`, `Planned`), disk-path-matches-vs-drifts, flag-on-vs-off for both staged rules — these are the axes the fixtures in tasks.md Phase 3 must cover.
- Algorithm invariant: neither new rule ever produces a false `error` when its rollout flag is unset (both must be provably inert at default settings, verified by a flags-off byte-identical corpus-hash check mirroring `011-scheduled-dq-sweep`'s own default-safety proof).
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm `008-metadata-rename-reconciliation`'s status before flipping any enforcement flag (F4 stays flag-off regardless of this phase's own completion)
- [ ] Read `011-scheduled-dq-sweep/plan.md` and `spec.md` in full to make the REQ-009 coordination decision (consolidate vs. separate workflow) before writing the new workflow file
- [ ] Stand up a small fixture set: one rename-drifted folder copy (disk vs metadata mismatch), one status-drifted folder copy (`spec.md` Planned + `implementation-summary.md` Complete), the two real bare-evidence-stamp files already cited in spec.md, and the `032` folder as the prose-evidence-should-pass fixture

### Phase 2: Core Implementation
- [ ] Build `scripts/lib/status-classifier.sh` with the `{planned, in-progress, complete}` classification function and its test fixture table (Complete/Shipped/Done/COMPLETE-with-space/complete-with-period → complete; Planned/Draft/In Progress → non-complete)
- [ ] Build `check-metadata-disk-consistency.sh` (F4), reusing `derivePacketIdFromPath()`'s comparison logic, default-off behind `SPECKIT_METADATA_DISK_CONSISTENCY_ENFORCE`
- [ ] Build `check-status-cross-doc-consistency.sh` (F7a), sourcing `status-classifier.sh`, default-off behind `SPECKIT_STATUS_CROSS_DOC_ENFORCE`
- [ ] Fix `check-scaffold-never-touched.sh:53` (F7b) to call `status-classifier.sh` instead of the literal match
- [ ] Redesign `check-evidence.sh`'s evidence detection (F9): extract each completed item's full text block, require (a) non-trivial length after stripping the checkbox/priority-tag prefix and (b) at least one evidence-shaped marker (file:line pattern, backtick-quoted command/output, a `\d+/\d+` or `\d+%` numeric result, or a named test-tool keyword), and (c) reject a small deny-list of pure-tautology phrases (`done`, `verified`, `tested`, `confirmed`, `passed`, `yes`, `n/a`, `ok`) when they are the *entire* remaining content
- [ ] Register `METADATA_DISK_PATH_CONSISTENCY` and `STATUS_CROSS_DOC_CONSISTENCY` in `validator-registry.json`
- [ ] Build `scripts/sweep/strict-pass-freshness.ts` (F8): fan out `validate.sh --json` over completion-claiming folders under `--roots`, diff against a stored last-known-good result, report regressions
- [ ] Add `.github/workflows/strict-pass-freshness-sweep.yml` (F8) per the REQ-009 coordination decision from Phase 1

### Phase 3: Verification
- [ ] Both new rules (F4, F7a) confirmed inert at default flag settings: flags-off run on the full fixture set produces zero new failures and a byte-identical corpus hash
- [ ] Both new rules confirmed to correctly flag their drifted fixture once the flag is set to `true`
- [ ] `check-scaffold-never-touched.sh` fix (F7b) confirmed against the Shipped-plus-marker and Planned-plus-marker fixtures from Phase 1
- [ ] `check-evidence.sh` redesign (F9) confirmed against all four real fixtures: the two bare-stamp files now fail, `032`'s 25-item prose checklist now passes
- [ ] Freshness sweep (F8) confirmed report-only against a dirty scratch fixture (working tree unchanged after a run) and confirmed to surface a planted regression (seed a previously-clean fixture with a fresh defect, confirm the next sweep run reports it)
- [ ] Run `validate.sh --strict` against a known-good and a known-bad packet sample (per this phase's own scope note) and confirm no unexpected regressions before calling the phase done
- [ ] Documentation updated (spec/plan/tasks/checklist)

### Benchmark (SPECIFIED, not run)

This is a validation-gate correctness change, not a retrieval-class change — no `completeRecall@3` or `mk-spec-memory` search-quality metric applies. The relevant "benchmark" is gate accuracy against known-good/known-bad fixtures, which doubles as this phase's own required pre-rollout validation step (spec.md SC-001/SC-002).

**Frozen fixture set** (built in Phase 1, reused for both benchmark and named tests):
- `scratch/validation-hardening-fixtures/rename-drift/` — a folder copy with `description.json`/`graph-metadata.json` agreeing with each other but not the real path.
- `scratch/validation-hardening-fixtures/status-drift/` — `spec.md` Status=Planned, `implementation-summary.md` Status=Complete.
- `scratch/validation-hardening-fixtures/bare-evidence/` — checklist copy containing the two real bare-stamp lines cited in spec.md.
- A read-only reference to `032-boot-integrity-rebuild-maintenance-marker` (not copied, referenced) as the prose-evidence-should-pass fixture.

| Metric | Pass threshold | Regress threshold | Reproduce |
|--------|----------------|--------------------|-----------|
| Flags-off inertness | 0 new failures across the fixture set with both new flags unset | any new failure with flags unset | `validate.sh scratch/validation-hardening-fixtures/* --strict` before and after, diff the output |
| Drift detection (flag-on) | Both drifted fixtures fail once their flag is set to `true` | either fixture still passes with the flag on | `SPECKIT_METADATA_DISK_CONSISTENCY_ENFORCE=true SPECKIT_STATUS_CROSS_DOC_ENFORCE=true validate.sh scratch/validation-hardening-fixtures/* --strict` |
| Scaffold-never-touched fix | Shipped-plus-marker fixture fails, Planned-plus-marker fixture still passes | either fixture's result is unchanged from pre-fix behavior in the wrong direction | `validate.sh <fixture> --strict` before/after on both fixtures |
| Evidence-content accuracy | Both bare-stamp fixtures fail, `032`'s 25 items all pass | any bare stamp still passes, or any real `032` item newly fails | `validate.sh scratch/validation-hardening-fixtures/bare-evidence --strict` and `validate.sh .../032-boot-integrity-rebuild-maintenance-marker --strict` |
| Sweep regression detection | A planted fresh defect on a previously-clean fixture is reported by the next sweep run | the defect is not reported, or the sweep mutates the fixture | seed the defect, run `node scripts/sweep/strict-pass-freshness.ts --roots scratch/validation-hardening-fixtures`, diff the report against the planted manifest |

The named test suite (`scripts/tests/validation-gate-hardening.vitest.ts` or an extension of the existing `scripts/tests/test-validation-extended.sh`) asserts every row above plus the edge cases named in spec.md (missing metadata surface, phase-parent with no `implementation-summary.md`, multi-line evidence block, non-tabular Status field, malformed `validate.sh --json` output).

**Default-safety**: `SPECKIT_METADATA_DISK_CONSISTENCY_ENFORCE` and `SPECKIT_STATUS_CROSS_DOC_ENFORCE` both default `false`. Keep-off rationale is the confirmed scale of existing drift (988+ rename-drifted, 65 status-drifted folders) — flipping either on before the corresponding data is clean would flood the corpus with new `--strict` failures. No-regress is proven flags-off: a full-corpus `validate.sh --json` content hash (of the aggregated rule output, not the corpus files themselves, since `check-evidence.sh` and `check-scaffold-never-touched.sh` are not flag-gated and are expected to change some folders' results) stays byte-identical for the two staged rules specifically. Runtime reversibility is setting either flag back to `false`, no restart required. Both flags register in `ALL_SPECKIT_FLAGS` with matching `FLAG_CHECKERS` entries in `mcp_server/tests/flag-ceiling.vitest.ts` so the ceiling test proves they default off, mirroring the exact pattern `011-scheduled-dq-sweep`'s plan already specifies for `SPECKIT_DQ_SWEEP`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `status-classifier.sh`'s classification table, the F9 content heuristic's marker/deny-list logic | Existing shell test harness pattern (`scripts/tests/test-validation*.sh`), new fixture files |
| Integration | Full `validate.sh --strict` runs against the frozen fixture set, flags on and off | `scripts/spec/validate.sh`, `scratch/validation-hardening-fixtures/` |
| Regression | Full `validate.sh --strict` runs against `032-boot-integrity-rebuild-maintenance-marker` and the two real bare-stamp files, before and after | Live corpus files (read-only reference, no corpus mutation) |
| Benchmark | The five metrics in the Benchmark table above | New named vitest/shell test suite |
| Default-off | Flags-off byte-identical rule-output hash for the two staged rules, plus the `ALL_SPECKIT_FLAGS`/`FLAG_CHECKERS` ceiling entries | `mcp_server/tests/flag-ceiling.vitest.ts` |
| Manual | A manual `workflow_dispatch` run of the freshness sweep; a manual before/after `--strict` run against the known-good/known-bad sample named in spec.md SC-001 | GitHub Actions, local shell |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|--------------------|
| `008-metadata-rename-reconciliation` | Internal | Not yet built (sibling phase, authored in parallel) | F4 ships flag-off regardless, so this phase is not blocked from landing; only the future enforce-flip is blocked |
| `derivePacketIdFromPath()` (`check-canonical-save-helper.cjs`) | Internal | Green (already shipped, in active use) | F4 would need to duplicate path-resolution logic instead of reusing it |
| `SPECKIT_CHILD_DRIFT_ENFORCE` flag pattern (`check-graph-metadata-child-drift.sh`) | Internal | Green (already shipped, in active use) | F4/F7a would need to invent a new rollout-flag shape instead of reusing the proven one |
| `scripts/lib/check-priority-helper.sh` shared-helper precedent | Internal | Green (already shipped, cited by `check-evidence.sh:25-29`) | Justifies the new `status-classifier.sh` shared-helper approach for F7a/F7b; not a hard dependency |
| `011-scheduled-dq-sweep`'s plan (coordination only) | Internal | Planned, unbuilt, blocked on `026-shared-safe-fix-engine` | F8 does not depend on it functionally, only on reading its plan to make the REQ-009 workflow-consolidation decision |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A staged rule's flag is accidentally flipped to `true` before its data dependency lands, or the F9/F7b fixes cause unexpected `--strict` regressions on unrelated packets.
- **Procedure**: Flip `SPECKIT_METADATA_DISK_CONSISTENCY_ENFORCE`/`SPECKIT_STATUS_CROSS_DOC_ENFORCE` back to `false` (no restart needed) to fully neutralize F4/F7a. For F7b/F9, revert the specific rule-file diff via git — both are narrow, single-file changes with no downstream schema dependents. The freshness sweep's workflow can be disabled by removing its `schedule:` trigger, keeping `workflow_dispatch` for manual runs only.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup + fixtures) ──► Phase 2 (Core: classifier, 4 rules, sweep) ──► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | 008 status check, 011-scheduled-dq-sweep plan read, fixture set | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|-------------------|
| Setup | Low | 1-2 hours |
| Core Implementation | Med-High | 8-14 hours |
| Verification | Med | 3-5 hours |
| **Total** | | **12-21 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Both rollout flags confirmed default-off in a clean checkout
- [ ] `ALL_SPECKIT_FLAGS`/`FLAG_CHECKERS` ceiling entries added for both flags
- [ ] REQ-009 coordination decision recorded before the sweep workflow lands
- [ ] Fixture set validated against both known-good and known-bad real packets, not synthetic-only

### Rollback Procedure
1. Flip both staged flags back to `false` if either was enabled prematurely
2. Revert the `check-scaffold-never-touched.sh` and/or `check-evidence.sh` diffs via git if either causes unexpected corpus-wide regressions
3. Disable the sweep workflow's `schedule:` trigger, keep `workflow_dispatch` only, if the sweep proves noisy
4. Re-run `validate.sh --strict` on the known-good/known-bad sample to confirm the rollback restored prior behavior

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A — this phase changes gate logic only, it does not write to any spec-folder content.
<!-- /ANCHOR:enhanced-rollback -->
