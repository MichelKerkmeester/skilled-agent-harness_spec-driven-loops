---
title: "Implementation Plan: Validation-Hardening Tooling Fixes — Evidence Substance, Status Classifier, Freshness Baseline"
description: "Sequenced approach for the four package-009 validation-tooling fixes, F7 first because it is confirmed live today: add Implemented to both status-classifier copies with a cross-reference and reconcile the two now-newly-visible real packets, then tighten and re-scope check-evidence.sh's substance checker, then fix strict-pass-freshness.ts's no-baseline misclassification."
trigger_phrases:
  - "validation hardening fixes plan"
  - "evidence substance checker fix plan"
  - "status classifier implemented plan"
  - "freshness sweep baseline fix plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/003-spec-data-quality/009-validation-hardening-fixes"
    last_updated_at: "2026-07-10T08:09:04.000Z"
    last_updated_by: "claude-code"
    recent_action: "Phase R audit remediation completed: swarm-implemented, Sonnet-verified, all tasks evidenced"
    next_safe_action: "Review Phase R evidence and the consolidated swarm commit"
    blockers: []
    key_files:
      - "spec.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "planning-015-validation-hardening-fixes"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Validation-Hardening Tooling Fixes — Evidence Substance, Status Classifier, Freshness Baseline

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash (`check-evidence.sh`, `status-classifier.sh`), TypeScript/Node (`strict-pass-freshness.ts`) |
| **Framework** | `validate.sh`'s rule-sourcing harness (bash rules sourced by `validate.sh`; the TS sweep is a standalone `spawnSync`-driven wrapper around `validate.sh`) |
| **Storage** | None — all three files operate on in-memory line/regex parsing of spec-doc text and an optional JSON baseline report file |
| **Testing** | Existing rule scripts have no dedicated unit-test harness today (validated indirectly via `validate.sh` runs against real/fixture packets); `strict-pass-freshness.ts` has no test file found in `scripts/tests/` as of this plan — new focused coverage is added per REQ |

### Overview
Three independent fix groups, no cross-dependencies, safe to land in any order — but sequenced by real-world priority, not file order: (1) `status-classifier.sh` and `strict-pass-freshness.ts` each get one word added to their `complete` bucket regex, plus a paired cross-reference comment — this group goes first because its blind spot is confirmed live today against two already-shipped sibling packets (`006-presentation-layer-fixes`, `010-query-channel-calibration`), not a latent or hypothetical gap; (2) `check-evidence.sh`'s `evidence_item_has_substance()` gets a loophole closed and a regression reverted, both inside the same ~35-line function; (3) `strict-pass-freshness.ts`'s `runValidate()` gets a two-branch baseline-presence check replacing today's single overloaded boolean. None of the three touch `mcp_server/` daemon code or any hot path.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (spec.md complete)
- [x] Success criteria measurable (SC-001..007)
- [x] Dependencies identified (none upstream; all three groups independent of each other)

### Definition of Done
- [x] All P0 acceptance criteria met (REQ-001..003) — fixture-verified, see tasks.md T005/T008/T009/T017
- [x] P1 acceptance criteria met (REQ-004..006) — none deferred; T007/T013-015 all complete
- [x] `validate.sh --strict` re-run on a representative sample of already-shipped 028 packets: 83/2,121 folders repo-wide flip `pass`→`warn` on `EVIDENCE_CITED`, all confirmed genuine loophole catches (spot-checked, zero false positives) — not "false failures" in the sense this gate guards against, but a real, disclosed, repo-wide consequence outside this phase's Files-to-Change scope to remediate. **SUPERSEDED (re-verified 2026-07-09):** this 83/2,121 figure was corrected in `spec.md`'s Implementation Findings addendum (Finding 2) to **80/2,235** folders repo-wide — the within-parent breakdown also shrank from the originally-disclosed `009, 010, 011, 012, 014` to only `009` and `010` actually flipping (see spec.md for the full re-verification methodology and the concurrent-edit caveats that make an exact repeat of either count non-reproducible). Separately, packet `019-validation-enforce-graduation` (2026-07-10) graduated `SPECKIT_STATUS_CROSS_DOC_ENFORCE`, `SPECKIT_METADATA_DISK_CONSISTENCY_ENFORCE`, and `SPECKIT_CHILD_DRIFT_ENFORCE` from advisory to enforcing-by-default, which further changed the repo-wide validation blast radius beyond `EVIDENCE_CITED` alone — see `019-validation-enforce-graduation/implementation-summary.md`. See spec.md's Implementation Findings addendum.
- [x] Docs updated (spec/plan/tasks/implementation-summary synchronized)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Targeted bug fixes inside existing pure-function validators; no new components, no new architecture. Each fix is a small, independently reversible edit to a single function.

### Key Components
- **`classify_status()`** (`status-classifier.sh:26-52`) / **`classifyStatus()`** (`strict-pass-freshness.ts:89-96`): pure functions, bash and TS twins, map a raw status string to one of `complete|in-progress|planned|unknown`. Highest-priority fix — REQ-003 adds one word to each `complete` regex, confirmed live-blind on `006-presentation-layer-fixes`/`010-query-channel-calibration` today. REQ-004 adds cross-reference comments to both. REQ-006 closes the loop: re-run `STATUS_CROSS_DOC_CONSISTENCY` on both real packets once REQ-003 lands and reconcile any mismatch it now surfaces.
- **`evidence_item_has_substance()`** (`check-evidence.sh:30-68`): pure bash function, takes a checklist/task line, returns 0 (has substance) or 1 (does not). REQ-001 removes/narrows the bare-filename branch (line 49); REQ-002 adds a scoped DEFERRED-content bypass ahead of the shape checks.
- **`runValidate()`** (`strict-pass-freshness.ts:159-187` approx.): spawns `validate.sh --strict --json --no-recursive` per folder and compares against a baseline `Set<string>` of previously-passing folder paths. REQ-005 splits the current single `wasBaselinePass` boolean (line 172) into an explicit no-baseline branch.

### Data Flow
`check-evidence.sh` and `status-classifier.sh` are sourced by `validate.sh` at rule-run time and operate on the target packet's own `spec.md`/`implementation-summary.md`/`tasks.md`/`checklist.md` text, line by line. `strict-pass-freshness.ts` runs standalone (CI/manual invocation), walks the spec-folder tree, `spawnSync`s `validate.sh --strict --json` per completion-claiming folder, and diffs the parsed JSON result against an optional prior baseline JSON file.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Applies because this phase changes a validation gate's pass/fail behavior across every spec folder in the repo, not just this one.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|---------------|
| `check-evidence.sh:49` (bare-filename match) | False-negative loophole: any filename mention counts as evidence | Remove or require it to co-occur with an explicit evidence-shaped signal | Synthetic fixture line with only a bare filename mention now fails; `filename.ts:123` fixture still passes |
| `check-evidence.sh:36-44` (DEFERRED/EVIDENCE shared gate) | False-positive: a real DEFERRED reason must look evidence-shaped | Split so DEFERRED content bypasses the shape checks once past the trivial-placeholder filter | Synthetic `[DEFERRED: blocked on operator decision]` fixture now passes; `[DEFERRED: tbd]` still fails |
| `status-classifier.sh:36` | Blind to `Implemented`/`Implementing` | Add to `complete` regex | `classify_status "Implemented"` returns `complete` |
| `strict-pass-freshness.ts:97` | Same blind spot, duplicated | Mirror the same regex addition | `classifyStatus("Implemented")` returns `'complete'` |
| `check-status-cross-doc-consistency.sh` (consumer of both classifiers) | Currently reports "not applicable" for any packet using `Implemented` | Not modified directly — becomes correctly-applicable as a side effect of the classifier fix | Re-run `validate.sh --strict` on `006-presentation-layer-fixes` and `010-query-channel-calibration`; the `STATUS_CROSS_DOC_CONSISTENCY` line no longer reads "not applicable; one status is missing or unclassified" |
| `006-presentation-layer-fixes/spec.md` + `010-query-channel-calibration/spec.md` (previously-invisible real consumers, REQ-006) | Newly-applicable comparison may surface a real cross-doc mismatch now that `Implemented` is classified | Conditional docs-only reconciliation, not a code change — only if the re-run actually surfaces a disagreement | Re-run confirms pass/expected-advisory result on both packets, or a docs-only edit/intentional-difference note resolves any real disagreement found |
| `check-scaffold-never-touched.sh` (other consumer of `status-classifier.sh`) | Also sources `classify_status`; gates "Complete" scaffold-marker suppression | Not modified — audit only, confirm the `implemented` addition does not wrongly suppress scaffold-marker checks on a real "Implemented, verification-limited" packet | Re-run `validate.sh --strict` on both known "Implemented" packets, confirm `SCAFFOLD_NEVER_TOUCHED` result is still correct (both currently pass with "not Complete; scaffold markers are allowed" — new bucket makes them classify as complete, so confirm this rule's own literal-string match, not the shared classifier, still governs its behavior; the finding text and this file's own line 36-45 use a direct string match on the raw `Status` value, not `classify_status`, so this consumer is unaffected — confirm during implementation) |
| `strict-pass-freshness.ts:172-173` (`wasBaselinePass`) | No-baseline case reports every failure as regression | Split into an explicit `hasBaseline` check separate from `wasBaselinePass` | Synthetic empty-baseline fixture run against a known-failing folder reports a non-`'regression'` status; a real-baseline fixture with a recorded pass still reports `'regression'` on failure |

Required inventories:
- Other consumers of `evidence_item_has_substance` / `check_completed_item_evidence`: `rg -n 'evidence_item_has_substance|check_completed_item_evidence' .opencode/skills/system-spec-kit/scripts` (expected: only within `check-evidence.sh` itself, called from its own `run_check`).
- Other consumers of `classify_status` / `classifyStatus`: `rg -n 'classify_status' .opencode/skills/system-spec-kit/scripts --include='*.sh'` and `rg -n 'classifyStatus' .opencode/skills/system-spec-kit/scripts --include='*.ts'` (bash: `check-status-cross-doc-consistency.sh` and `check-scaffold-never-touched.sh`; TS: local to `strict-pass-freshness.ts`, confirm no other importer).
- Other consumers of `strict-pass-freshness.ts`'s `SweepResult.status` union (any code branching on the literal `'regression'` string): `rg -n "'regression'|\"regression\"" .opencode/skills/system-spec-kit/scripts .github/workflows` (the F8-referenced `.github/workflows/strict-pass-freshness-sweep.yml`, if it parses the sweep's JSON output, is a candidate consumer to check).
- Invariant (evidence check): a fixture line that currently fails must keep failing after the fix unless it now legitimately qualifies under an unchanged branch; a fixture line that currently passes via a real evidence signal (filename:linenum, backtick, fraction/percent, test-tool keyword) must keep passing.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Status classifier fix + cross-reference + reconciliation (F7 + F9) — highest priority, confirmed live
- [x] Added `implemented`/`implementing` to `status-classifier.sh`'s `complete` bucket, as a separately-guarded check (not a literal single-line addition — see spec.md's Implementation Findings addendum for the `not implemented` collision this required guarding against)
- [x] Added the byte-equivalent word (plus the same guard) to `strict-pass-freshness.ts`'s `classifyStatus()`; verified byte-identical output across 17 test strings
- [x] Added a cross-reference comment at each site naming the other file's path (paired-comments decision recorded in spec.md §7)
- [x] Re-ran `validate.sh --strict` on `006-presentation-layer-fixes` and `010-query-channel-calibration`: `STATUS_CROSS_DOC_CONSISTENCY` no longer reports "not applicable" for either — both now correctly compare and both agree (`complete`==`complete`)
- [x] REQ-006: re-run shows clean agreement for both packets, zero mismatch — recorded explicitly in spec.md/tasks.md rather than left unstated
- [x] Confirmed `check-scaffold-never-touched.sh` DOES call `classify_status` directly (the plan's "matches the raw Status string" parenthetical was wrong — its own hedge, "verify during implementation rather than assuming," caught this). `006` audited clean; `010` now fails with 4 real scaffold markers — a genuine pre-existing defect the fix correctly un-masks, NOT remediated here (out of Files-to-Change scope), flagged for operator review in spec.md

### Phase 2: `check-evidence.sh` fix (F6)
- [x] Read `evidence_item_has_substance()` in full, wrote and ran synthetic fixture lines for the loophole (bare filename, no other signal) and the regression (non-trivial `[DEFERRED: ...]`, trivial `[DEFERRED: tbd]`)
- [x] Removed the bare-filename branch entirely; filename:linenum and all other shape checks untouched
- [x] Captured which bracket keyword matched (`evidence` vs `deferred`) via a `grep -Eo` probe; added a bypass branch: non-trivial `deferred` content (survives the existing placeholder case-statement) returns 0 immediately, before the shape checks
- [x] Re-ran against the fixture lines: all four expected outcomes confirmed. Also re-ran the real rule against all 2,121 repo folders carrying checklist.md/tasks.md before and after — 83 flip pass→warn (all confirmed genuine loophole catches, 0 false positives in a 19-line spot-check), 0 flip the other way; see spec.md's Implementation Findings addendum

### Phase 3: Freshness sweep baseline fix (F10), then verify
- [x] In `strict-pass-freshness.ts`'s `runValidate()`, replaced the single `wasBaselinePass` boolean with an explicit `hasBaseline = baselinePasses.size > 0` check; `'regression'` now requires `hasBaseline && baselinePasses.has(relativeFolder)`; no-baseline failures get a new `'first-run'` status
- [x] Updated the `SweepResult.status` union type, the JSON payload (`firstRun` count added), and the text-mode summary line
- [x] `sweep/` has no project tsc build gate (confirmed: not in `tsconfig.json`'s `include`); standalone `tsc --noEmit` with matching flags: 0 diagnostics. Built a real synthetic known-failing-folder repro and ran it two ways (no baseline → `first-run`; real baseline with a recorded pass → `regression`), plus codified as a permanent vitest case. `npm run build`/`npm run typecheck` for the whole `scripts` package: both exit 0. `validate.sh --strict` on this folder: PASSED, Errors 0 Warnings 0. Adversarial self-review done. Commit deferred per this turn's explicit no-commit instruction.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit/fixture | `evidence_item_has_substance` loophole + regression fixtures; `classify_status`/`classifyStatus` on `Implemented` inputs; `runValidate` with an empty vs populated baseline `Set` | bash fixture invocation for the two `.sh` functions; vitest (or a small standalone script if no existing suite covers `strict-pass-freshness.ts`) for the TS function |
| Integration | `validate.sh --strict` re-run on `006-presentation-layer-fixes`, `010-query-channel-calibration` (including REQ-006's reconciliation, if the re-run surfaces a real mismatch once `Implemented` is classifiable), and a broader sample of already-shipped 028 packets to confirm no new false failures from the tightened evidence check | `validate.sh` |
| Manual | Read the `.github/workflows/strict-pass-freshness-sweep.yml` (if it exists and parses sweep output) to confirm the new status value does not break its consumption | Read tool |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|--------------------|
| `check-status-cross-doc-consistency.sh` (consumer of `status-classifier.sh`) | Internal | Green (exists, unmodified) | Confirms REQ-003's fix actually surfaces end to end |
| `check-scaffold-never-touched.sh` (other consumer of `status-classifier.sh`) | Internal | Green (exists, unmodified) | Must be audited, not assumed unaffected, per Phase 1's last task |
| `.github/workflows/strict-pass-freshness-sweep.yml` (possible consumer of `strict-pass-freshness.ts` JSON output) | Internal | Unknown until inventoried | If it hard-codes the `SweepResult.status` union, REQ-005's new status value needs a matching update there too |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the `implemented` classifier addition causes `check-scaffold-never-touched.sh` to wrongly suppress a scaffold-marker check, or REQ-006's reconciliation step surfaces a mismatch that cannot be resolved cleanly (Phase 1); the tightened evidence check produces new false failures on already-shipped packets (Phase 2); or the new freshness-sweep status value breaks a workflow consumer (Phase 3).
- **Procedure**: each phase is a small, scoped, independently reversible edit to a pure function; revert the single hunk for the affected phase. None of the three phases share state or depend on each other landing together.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
