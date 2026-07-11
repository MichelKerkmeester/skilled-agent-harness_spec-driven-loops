---
title: "Feature Specification: Validation-Gate Hardening"
description: "validate.sh's identity, status and evidence gates all pass silently on bad data: CANONICAL_SAVE_PACKET_IDENTITY_NORMALIZED only cross-checks the three metadata surfaces against each other, never against disk; check-scaffold-never-touched.sh matches the literal string Complete* so a stale Planned status suppresses its own error check; nothing compares spec.md Status to implementation-summary.md; and EVIDENCE_CITED accepts any non-empty [EVIDENCE: ...] bracket regardless of content."
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
    packet_pointer: "system-speckit/028-memory-search-intelligence/009-validation-integrity-hardening"
    last_updated_at: "2026-07-10T08:09:04.000Z"
    last_updated_by: "claude-code"
    recent_action: "Phase R audit remediation completed: swarm-implemented, Sonnet-verified, all tasks evidenced"
    next_safe_action: "Review Phase R evidence and the consolidated swarm commit"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/rules/check-canonical-save-helper.cjs"
      - ".opencode/skills/system-spec-kit/scripts/rules/check-scaffold-never-touched.sh"
      - ".opencode/skills/system-spec-kit/scripts/rules/check-evidence.sh"
      - ".opencode/skills/system-spec-kit/scripts/lib/validator-registry.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: Validation-Gate Hardening

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Shipped |
| **Created** | 2026-07-09 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Background: related prior art (do not duplicate)
This packet is one of five sibling phases opened from the same deep-review findings digest (F1-F14, P1-P3) covering `mk-spec-memory`'s JSON metadata, spec-doc validation, backend search-index and presentation layers. `006-presentation-layer-fixes` owns P1-P3, `007-search-index-integrity-sweep` owns F10-F13, `010-query-channel-calibration` owns F14, and the sibling `008-metadata-rename-reconciliation` owns F1/F2/F3/F5/F6 (the JSON-metadata data-quality fixes this phase's F4 check depends on). This phase owns only F4, F7, F8 and F9 — the four gaps in `validate.sh` and `checklist.md` scoring itself, not the underlying data those gates inspect. It does not touch `mk-spec-memory`'s search-index tables, the query-channel classifier, or the presentation-contract text files those siblings own.

### Problem Statement
Four independent gaps let bad spec-folder data pass `validate.sh` clean:

1. **F4 — identity checks never touch disk.** `CANONICAL_SAVE_PACKET_IDENTITY_NORMALIZED` (`check-canonical-save-helper.cjs:209-228`) collects `continuityPointer`, `descriptionSpecFolder` and `graphSpecFolder`, dedupes them, and only checks whether they *agree with each other* — line 223-227 `emit('pass', 'Packet identity normalization drift detected (soft detector)', ...)` unconditionally returns `pass` even when it finds drift. A folder whose `description.json` and `graph-metadata.json` are both consistently wrong (same wrong value in both, as with `system-spec-kit/999-sk-doc-parent`'s stale `skilled-agent-orchestration/125-sk-doc-parent` pointer) passes clean because nothing compares either surface to the real on-disk path. Separately, `GRAPH_METADATA_CHILD_DRIFT` (`check-graph-metadata-child-drift.sh:100-118`) is advisory-only unless `SPECKIT_CHILD_DRIFT_ENFORCE=true`, so the 871 phantom `children_ids` from F2 are deliberately unreported by default.
2. **F7 — status drift is invisible, and the one status check that exists reads the wrong condition.** No rule anywhere compares `spec.md`'s `Status` field to `implementation-summary.md`'s stated completion state, so 65 live folders can carry `Status: Planned/In Progress/Draft` in `spec.md` while `implementation-summary.md` claims Complete with no error. Worse, the one rule that *does* branch on status — `SCAFFOLD_NEVER_TOUCHED` (`check-scaffold-never-touched.sh:53`) — gates its entire scaffold-marker scan on `[[ "$status_value" == Complete* ]]`: a stale `Planned` status makes `spec_complete=false`, which returns `pass` at line 57-65 before the scaffold-marker scan ever runs, so the exact stale-status folder the rule exists to catch is the one that suppresses it. A status of `Shipped`, `Done`, or any complete-equivalent that isn't the literal string `Complete` bypasses the scan entirely in the other direction.
3. **F8 — a recorded `--strict PASS` claim rots silently.** There is no periodic re-validation; a folder validated clean once (or claimed Complete in its `implementation-summary.md`) is never re-checked as the rules or its own content drift. Live re-run today (`2026-07-09`) against `system-speckit/026-graph-and-context-optimization/007-mcp-daemon-reliability/032-boot-integrity-rebuild-maintenance-marker` — a folder whose `implementation-summary.md` and rigorously-cited `checklist.md` both claim Complete and were shipped this week — confirms the digest's 16/18 sample: `validate.sh --strict` on that folder exits `2` (`RESULT: FAILED`, `Errors: 0  Warnings: 1`) purely because `EVIDENCE_CITED` (a `warn`-severity rule) escalates under `--strict`.
4. **F9 — `EVIDENCE_CITED` rewards bracket shape, not evidence.** `check-evidence.sh:90,93,96` accepts a completed checklist item as evidenced if the line contains the literal substring `[evidence:`, `| evidence:`, a Unicode checkmark, or `(verified)`/`(tested)`/`(confirmed)` — content is never inspected. Two real, currently-passing examples: `z_archive/022-hybrid-rag-fusion/.../012-auto-detection-fixes/tasks.md:113` — `` [x] T031 `validate.sh` run on spec folder [Evidence: PASSED] `` (no command, no output, no file cited) — and `z_archive/001-fix-command-dispatch/.../001-mvp-monolithic/checklist.md:109` — `[x] ... [EVIDENCE: tested]` (pure tautology). Meanwhile the same live re-run above shows `032`'s checklist — 25 `- [x]` items citing real file:line, real `vitest` pass counts (`25 passed (25)`, `397 passed`), and real quoted command output, but written as dense prose after an em-dash rather than inside an `[EVIDENCE:` bracket — fails `EVIDENCE_CITED` with `Found 25 completed item(s) without evidence`. The rule runs in both directions on real, unmodified corpus files today.

### Purpose
Close all four gaps without silently breaking the corpus: add a real disk-comparison identity check (staged behind a rollout flag so it starts green, matching the existing `SPECKIT_CHILD_DRIFT_ENFORCE` pattern), add a cross-doc status-consistency rule and fix the scaffold-never-touched literal match to share one canonical status classifier, add a scheduled re-validation sweep that reports strict-pass regressions instead of letting them rot silently, and redesign `EVIDENCE_CITED` to score cited *content* instead of marker shape.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A new disk-comparison identity rule that resolves each folder's real on-disk relative path and compares it to `description.json.specFolder`, `graph-metadata.json.spec_folder`/`parent_id`, and the continuity `packet_pointer`, staged behind a default-off enforcement flag (F4).
- A new cross-doc status-consistency rule comparing `spec.md` Status to `implementation-summary.md` Status through one shared canonical-status classifier (F7).
- A fix to `check-scaffold-never-touched.sh:53`'s literal `Complete*` match to use the same shared classifier (F7).
- A new scheduled + on-demand re-validation sweep that re-runs `validate.sh --strict` against folders carrying a completion claim and reports regressions against the last recorded result (F8).
- A redesign of `EVIDENCE_CITED` (`check-evidence.sh`) to score the cited content's substance rather than bracket/marker shape, recognizing both bracketed and unbracketed evidence (F9).

### Out of Scope
- Fixing the underlying JSON-metadata drift (F1, F2, F3, F5, F6) — owned by the sibling `008-metadata-rename-reconciliation`, which this phase's F4 check depends on landing first.
- The search-index staleness, content-drift, enrichment-pipeline and channel-skip findings (F10-F14) — owned by `007-search-index-integrity-sweep` and `010-query-channel-calibration`.
- The presentation-layer findings (P1-P3) — owned by `006-presentation-layer-fixes`.
- Retroactively fixing the 65 status-drift folders or the 154 circular-evidence stamps the new rules will surface — this phase ships the gates; sweeping the existing corpus into compliance is a follow-up once the new rules are calibrated and rolled out.
- Any change to `memory_search`/`memory_context` retrieval behavior — this phase only touches `validate.sh` and `checklist.md` scoring.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/scripts/rules/check-canonical-save-helper.cjs` | Modify | Add a real on-disk path resolution and comparison branch to the identity check, gated by a rollout flag (F4) |
| `.opencode/skills/system-spec-kit/scripts/lib/validator-registry.json` | Modify | Register severity/behavior changes for the touched and new rule ids |
| `.opencode/skills/system-spec-kit/scripts/lib/status-classifier.sh` | Create | Shared canonical status classifier (`planned` / `in-progress` / `complete`) consumed by both the new cross-doc rule and the scaffold-never-touched fix |
| `.opencode/skills/system-spec-kit/scripts/rules/check-status-cross-doc-consistency.sh` | Create | New rule comparing `spec.md` Status to `implementation-summary.md` Status via the shared classifier (F7) |
| `.opencode/skills/system-spec-kit/scripts/rules/check-scaffold-never-touched.sh` | Modify | Replace the literal `Complete*` match at line 53 with the shared classifier (F7) |
| `.opencode/skills/system-spec-kit/scripts/sweep/strict-pass-freshness.ts` | Create | Periodic re-validation entrypoint: re-runs `validate.sh --strict` against completion-claiming folders and reports regressions (F8) |
| `.github/workflows/strict-pass-freshness-sweep.yml` | Create | Scheduled plus `workflow_dispatch` report-only workflow wrapping the sweep (F8) |
| `.opencode/skills/system-spec-kit/scripts/rules/check-evidence.sh` | Modify | Replace bare-marker substring matching with a substantive-content heuristic (F9) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | When validate.sh runs the identity check, the system SHALL resolve each folder's real on-disk relative path and compare it to `description.json.specFolder`, `graph-metadata.json.spec_folder`/`parent_id`, and the continuity `packet_pointer`, in addition to the existing cross-surface comparison. | A fixture folder whose `description.json` and `graph-metadata.json` agree with each other but not with the real path fails the new disk-comparison branch; a correctly-pathed fixture still passes. Reproduced against a copy of a known rename-drifted folder (e.g. the `system-spec-kit/999-sk-doc-parent`-style stale pointer cited in F1). |
| REQ-002 | The system SHALL provide one shared canonical-status classifier that normalizes `spec.md` Status and `implementation-summary.md` Status into `{planned, in-progress, complete}`, consumed by both the new cross-doc rule and the fixed scaffold-never-touched rule. | Unit-level fixture asserts `Complete`, `Shipped`, `Done`, `COMPLETE ` (trailing space) and `complete.` all classify as `complete`; `Planned`, `Draft`, `In Progress` classify as non-complete. |
| REQ-003 | A new rule SHALL compare `spec.md` Status against `implementation-summary.md` Status via the shared classifier and fail when they disagree. | A fixture with `spec.md` Status=Planned and `implementation-summary.md` Status=Complete fails the new rule with both raw values in `RULE_DETAILS`; a fixture where both classify to the same bucket passes. |
| REQ-004 | `check-scaffold-never-touched.sh` SHALL use the shared classifier instead of the literal `Complete*` substring match at line 53, so any status that classifies as `complete` triggers the scaffold-marker scan and any non-complete status still short-circuits it. | A fixture with Status=`Shipped` and a `last_updated_by: template-author` marker fails after the fix; confirmed today that the unmodified rule passes it (literal-string mismatch). A fixture with Status=`Planned` and the same marker still passes (scaffold markers are legitimately allowed pre-completion). |
| REQ-005 | `EVIDENCE_CITED` SHALL require the cited content — bracketed or prose — to meet a minimum substantive-evidence bar (non-trivial length plus at least one evidence-shaped marker: file:line, command/output quote, numeric result, or named test/tool) instead of passing on marker shape alone. | The two real repo examples cited in the problem statement (`[Evidence: PASSED]`, `[EVIDENCE: tested]`) fail after the fix. `032-boot-integrity-rebuild-maintenance-marker/checklist.md`'s 25 dense-prose items (file:line + vitest counts + quoted output, no bracket) pass after the fix. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | The disk-comparison identity check (REQ-001) SHALL default to advisory/warn behind a rollout flag, matching the existing `SPECKIT_CHILD_DRIFT_ENFORCE` pattern, and escalate to error only once enabled. | Flag defaults false; a drifted fixture reports `warn` with the flag unset and `error` with it set to `true`, mirroring `check-graph-metadata-child-drift.sh:100-118`'s existing shape. |
| REQ-007 | The new cross-doc status rule (REQ-003) SHALL default to advisory/warn behind its own rollout flag for the same reason (65 live folders currently drift). | Flag defaults false; behavior mirrors REQ-006. |
| REQ-008 | When invoked, the freshness sweep SHALL accept a `--roots` contract so it can be scoped, and SHALL never write to the corpus (report-only). | A scoped `--roots .opencode/specs/system-speckit` run inspects only that subtree; a dirty scratch fixture's working tree is unchanged after a sweep run. |
| REQ-009 | The freshness sweep's workflow SHALL trigger on a `schedule:` cron and on `workflow_dispatch`, and SHALL be coordinated with the sibling `008-metadata-rename-reconciliation`'s planned corpus-sweep tooling (if any) so the repo does not end up with two redundant full-corpus `schedule:` workflows. | The workflow file declares both triggers; the plan documents the coordination check performed against sibling sweep tooling before the workflow lands. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Re-running `validate.sh --strict` against the same 18-folder sample the F8 finding was drawn from (or an equivalent fresh sample of 18 folders claiming Complete) after all four fixes land shows a materially different pass/fail mix than the 16/18-fail baseline — specifically, folders failing only because of F9's marker-shape bug (like `032`) now pass, and folders whose identity or status was silently wrong now correctly fail.
- **SC-002**: The disk-comparison identity check (F4) and the cross-doc status rule (F7a) both ship with their rollout flag defaulting off, so landing this phase alone does not flip any existing folder's `validate.sh --strict` result from pass to fail. `check-scaffold-never-touched.sh`'s fix (F7b) and the `EVIDENCE_CITED` redesign (F9) are not flag-gated (a warn-severity fix and a narrow literal-match fix respectively) and are proven safe by running them against a known-good and a known-bad packet sample before rollout, per this phase's own scope note.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `008-metadata-rename-reconciliation` | F4's disk-comparison check would immediately fail every already-known rename-drifted packet across the repo (988+ folders) if it shipped as a hard error before that phase lands | Stage F4 behind a default-off rollout flag (REQ-006); only flip it on after 008 lands and the corpus is clean |
| Risk | The new status and identity rules surface corpus-wide drift the moment they are enabled | A large, sudden wave of new `--strict` failures across unrelated packets | Both new rules default to advisory/warn (REQ-006, REQ-007); enforcement is a separate, deliberate follow-up rollout step, not part of this phase's landing |
| Risk | `EVIDENCE_CITED`'s content heuristic is a judgment call, not a deterministic parse | A poorly-calibrated heuristic could flip false positives/negatives in either direction across the corpus | Calibrate against the four real fixtures already cited in this spec (two circular-stamp fails, `032`'s prose-evidence pass) before widening; see plan.md's investigation note |
| Risk | Duplicate scheduled corpus-sweep infrastructure | The sibling `002-spec-data-quality/002-retroactive-automation/011-scheduled-dq-sweep` phase (planned, not yet built, blocked on `026-shared-safe-fix-engine`) already plans a `schedule:`-triggered full-corpus sweep folding in `validate.sh --json`; a second independent `schedule:` workflow from this phase risks redundant CI runs | REQ-009 requires an explicit coordination check before the new workflow lands; the two sweeps have different triggers (F8 targets only completion-claiming folders and diffs against a last-known-good state, `011` is a general data-quality detector fan-out) and may end up as one consolidated workflow or two narrowly-scoped ones — decided at implementation time, not assumed here |
| Dependency | `validator-registry.json` | Every new/changed rule id must be registered here with correct severity or `validate.sh` will not dispatch it | Update the registry in the same change as the rule module, verified by `validate.sh --strict` picking up the new rule in its output |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The disk-comparison and status-consistency checks are single-folder `fs.realpathSync`/`fs.readFileSync` operations, adding no measurable overhead to a single-folder `validate.sh` run.
- **NFR-P02**: The freshness sweep is a fan-out caller, not a new engine; a full-corpus run completes within a single CI job wall clock.

### Security
- **NFR-S01**: The freshness-sweep CI workflow has no write credential and no commit step; it is report-only exactly like the sibling `011-scheduled-dq-sweep` pattern it is coordinated with.

### Reliability
- **NFR-R01**: All four rule changes are additive or narrow-fix; none removes or weakens an existing passing check's coverage.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A folder with no `description.json` or `graph-metadata.json` at all: the disk-comparison check has nothing to compare and reports not-applicable, matching the existing `hasMetadataSurface` guard pattern in `check-canonical-save-helper.cjs`.
- A phase-parent folder whose `spec.md` intentionally has no `implementation-summary.md` (per this repo's lean-trio phase-parent convention): the cross-doc status rule reports not-applicable rather than a false failure.
- A checklist item whose evidence spans multiple lines (a wrapped paragraph): the F9 heuristic must inspect the full item block, not just the first physical line, or it will false-negative on legitimately long evidence.

### Error Scenarios
- `implementation-summary.md` Status field uses non-tabular prose (no `| Status | ... |` row): the classifier falls back to not-applicable rather than crashing.
- The freshness sweep's `validate.sh --json` call on one folder returns malformed output: the sweep records that folder as errored and continues the fan-out over the rest, matching the `011-scheduled-dq-sweep` plan's own error-scenario handling.

### State Transitions
- A folder transitions from advisory-warn to enforced-error when the rollout flag flips: no code change is needed, only the flag, so the transition is a single environment-variable flip with no restart required.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 15/25 | Four independent rule changes plus one new shared classifier and one new sweep entrypoint/workflow, all thin over the existing `validate.sh` rule-module architecture |
| Risk | 16/25 | Changes gate behavior repo-wide; mitigated by default-off staging on the two corpus-wide-impact rules (F4, F7a) and calibration against real fixtures for F9 |
| Research | 8/20 | Root cause and exact fix mechanism confirmed to file:line for F4/F7/F9 by live reproduction; F8's sweep design needs a coordination check against the sibling `011-scheduled-dq-sweep` plan before implementation |
| **Total** | **39/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 7. CONCRETE CHANGE AND SEAMS

The exact seams, verified to file:line against the live tree and reproduced live on 2026-07-09.

- `check-canonical-save-helper.cjs:209-228` (`CANONICAL_SAVE_PACKET_IDENTITY_NORMALIZED`) computes `identities = [continuityPointer, descriptionSpecFolder, graphSpecFolder]`, dedupes, and at line 223-227 calls `emit('pass', 'Packet identity normalization drift detected (soft detector)', ...)` even on drift — confirmed by reading the switch case verbatim, this rule can never fail. `derivePacketIdFromPath()` (lines 73-83) already exists in the same file and computes a real on-disk-derived packet id; F4's fix reuses it as the disk-truth comparison target instead of introducing a new path-resolution helper.
- `check-graph-metadata-child-drift.sh:100-118` confirms the `SPECKIT_CHILD_DRIFT_ENFORCE` advisory-by-default pattern this phase reuses for F4's and F7a's rollout flags — the same `if [[ "${SPECKIT_CHILD_DRIFT_ENFORCE:-false}" == "true" ]]` shape is the template.
- `check-scaffold-never-touched.sh:39-55` builds `status_value` from `spec.md`'s Status table cell via `awk`, then line 53 does `if [[ "$status_value" == Complete* ]]`. This is a literal bash glob-prefix match against the single string `Complete`, confirmed by direct read — it does not match `Shipped`, `Done`, `SHIPPED`, or any synonym, and it treats a stale `Planned` value as license to skip the scaffold-marker scan entirely (lines 57-65 return early).
- `check-evidence.sh:90,93,96` — three independent substring/pattern checks (`*"[evidence:"*`, Unicode checkmarks, `(verified)`/`(tested)`/`(confirmed)`) that any one of which sets `has_evidence=true` regardless of the text around or inside them. Reproduced live: `z_archive/022-hybrid-rag-fusion/009-perfect-session-capturing/012-auto-detection-fixes/tasks.md:113` and `z_archive/001-fix-command-dispatch/z_archive/023-path-scoped-rules/001-mvp-monolithic/checklist.md:109` both pass today with zero cited substance.
- Live counter-evidence reproduced the same day: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-speckit/026-graph-and-context-optimization/007-mcp-daemon-reliability/032-boot-integrity-rebuild-maintenance-marker --strict` exits `2` with `Errors: 0  Warnings: 1` and the single warning is `EVIDENCE_CITED: Found 25 completed item(s) without evidence` against a checklist whose 25 items all cite real file:line, real test-run counts, and real quoted command output in unbracketed prose.
- `scripts/rules/README.md` §5-6 documents the registry-driven dispatch: new rules register in `scripts/lib/validator-registry.json` with `rule_id`, `script_path`, `severity` and `category`; `validate.sh` reads the registry and calls each module's `run_check()`. This is the mechanism F4's and F7a's new rule modules plug into.

## 8. DEPENDENCIES AND VERDICT

- **Depends on `008-metadata-rename-reconciliation`**: F4's disk-comparison check must land behind a default-off flag specifically because the corpus is not yet clean; flipping the flag to enforce is a follow-up once 008 lands, not part of this phase.
- **Coordinates with (does not depend on) `002-spec-data-quality/002-retroactive-automation/011-scheduled-dq-sweep`**: both plan a scheduled full-corpus sweep; F8's sweep is narrower (only completion-claiming folders, diffs against a last-known-good result) and does not require `011`'s blocked `026-shared-safe-fix-engine` dependency, so it can ship independently, but the workflow-trigger overlap must be checked before `.github/workflows/strict-pass-freshness-sweep.yml` lands (REQ-009).
- **Sibling boundary**: `006-presentation-layer-fixes` (P1-P3), `007-search-index-integrity-sweep` (F10-F13) and `010-query-channel-calibration` (F14) are independent phases from the same findings digest; none of their files overlap this phase's Files to Change list.
- **Verdict**: GO, staged rollout. Two of the four fixes (F7b's literal-match fix, F9's evidence redesign) are narrow, low-risk corrections ready to implement directly. The other two (F4's disk check, F7a's cross-doc rule) are ready to implement but must land inert (flag-off) given the confirmed scale of existing drift (988+ rename-drifted folders, 65 status-drift folders) they would otherwise immediately flag.

---

## 10. OPEN QUESTIONS

- Should F8's freshness sweep and `011-scheduled-dq-sweep` end up as one consolidated workflow, or two narrowly-scoped ones? Deferred to plan.md's coordination-check task rather than decided here, since `011` is still unbuilt and blocked on a different dependency chain.
- What exact minimum-length and evidence-marker thresholds does F9's content heuristic need? Deferred to a calibration pass against the real fixture set (the two circular-stamp examples and `032`'s prose-evidence checklist) named in plan.md, rather than guessed here.
<!-- /ANCHOR:questions -->
