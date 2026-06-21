---
title: "Feature Specification: A7 EARS Patterns, Constraint Tier, and REQ_COVERAGE Gate [template:level_2/spec.md]"
description: "Spec requirement prose has no shared grammar and the spec-REQ-to-tasks linkage is unguarded, so requirements drift from their build tasks. This phase adds EARS patterns, an always/ask-first/never constraint tier, a soft EARS linter, and a REQ_COVERAGE gate cloned from the shipped AC_COVERAGE rule."
trigger_phrases:
  - "ears requirements"
  - "constraint tier"
  - "req coverage"
  - "ac coverage clone"
  - "ears linter"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/007-a7-ears-constraints-req-coverage"
    last_updated_at: "2026-06-21T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored phase spec from research A7 row"
    next_safe_action: "Run generate-context and graph-metadata generators"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/rules/check-ac-coverage.sh"
      - ".opencode/skills/system-spec-kit/scripts/lib/validator-registry.json"
      - ".opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: A7 EARS Patterns, Constraint Tier, and REQ_COVERAGE Gate

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
| **Status** | Draft |
| **Created** | 2026-06-21 |
| **Branch** | `007-a7-ears-constraints-req-coverage` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Spec requirement prose has no shared grammar, so requirements are authored in inconsistent free-form sentences that resist linting and machine extraction. There is no always / ask-first / never constraint tier in the templates, so hard safety constraints are buried in narrative. The spec-REQ-to-tasks linkage gap is real and unguarded today: `tasks.md` lists `T001`-style task IDs with no requirement back-reference column (`templates/manifest/tasks.md.tmpl:54-77`), so nothing checks that every authored requirement is actually built. The shipped `AC_COVERAGE` rule already solves the parallel problem for acceptance-criteria traceability (`scripts/rules/check-ac-coverage.sh`), proving the exact gate shape exists and can be cloned.

### Purpose
Give spec requirements an EARS grammar plus a constraint tier in the templates, a soft EARS linter that nudges without breaking the legacy corpus, and a `REQ_COVERAGE` gate that reuses the shipped `AC_COVERAGE` pattern to flag requirements with no task linkage, all default-off and warn-only.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- EARS requirement patterns (ubiquitous, event-driven, state-driven, optional-feature, unwanted-behavior) added as authoring guidance in the spec template REQUIREMENTS anchor.
- An always / ask-first / never constraint tier added to the spec template, where each tier maps to a named class so a constraint is machine-locatable.
- A soft EARS linter that scans requirement rows, reports rows that do not match an EARS or constraint-tier shape, and is advisory only.
- A `REQ_COVERAGE` validation rule cloned from `AC_COVERAGE`, registered in `validator-registry.json` and dispatched by `validate.sh`, default-off and warn, that flags authored requirements with no corresponding task linkage.
- A requirement-reference column or marker added to `tasks.md.tmpl` so the `REQ_COVERAGE` rule has a canonical linkage location to read.

### Out of Scope
- Auto-rewriting requirement prose into EARS form. The `req.ears_coverage` fix is classified risky and suggest-only in the research (`research.md` section 4), never a silent body mutation.
- Flipping `REQ_COVERAGE` or the EARS linter from warn to error. The four-beat WARN -> BACKFILL -> RE-MEASURE -> ERROR migration (`research.md` section 5) is a separate later gate and is not part of this phase.
- Retrofitting the legacy corpus to EARS grammar. Existing specs are untouched until a backfill report reads zero.
- Any retrieval-class or vector change. A7 is floor-bypassing on the adherence and logic readers only.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl` | Modify | Add EARS pattern guidance and the always / ask-first / never constraint tier inside the REQUIREMENTS anchor for each level block |
| `.opencode/skills/system-spec-kit/templates/manifest/tasks.md.tmpl` | Modify | Add a requirement-reference column or marker so task rows link back to a REQ id |
| `.opencode/skills/system-spec-kit/scripts/rules/check-req-coverage.sh` | Create | Clone `check-ac-coverage.sh`, retarget from checklist AC rows to tasks REQ linkage, keep default-off and warn |
| `.opencode/skills/system-spec-kit/scripts/lib/validator-registry.json` | Modify | Register `REQ_COVERAGE` next to `AC_COVERAGE`, severity info, category authored_template, with `SPECKIT_REQ_COVERAGE` plus enforce and floor flags |
| `.opencode/skills/system-spec-kit/scripts/rules/check-ears-lint.sh` | Create | Soft EARS linter that reports non-EARS, non-constraint requirement rows, advisory only |
| `.opencode/skills/system-spec-kit/scripts/lib/validator-registry.json` | Modify | Register `EARS_LINT` as a second authored_template advisory rule behind `SPECKIT_EARS_LINT` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | When `SPECKIT_REQ_COVERAGE` is enabled, the system shall scan authored requirement ids against tasks linkage and warn on any requirement with no covering task, mirroring `check-ac-coverage.sh:177-224`. | `bash scripts/spec/validate.sh <folder> --strict` with `SPECKIT_REQ_COVERAGE=true` emits a `REQ_COVERAGE WARNING` for a spec whose REQ has no task linkage, and stays silent (no-op message) when the flag is unset. |
| REQ-002 | While `SPECKIT_REQ_COVERAGE` is unset, the system shall behave exactly as today and never block, so the legacy corpus is unaffected. | A clean run of `validate.sh` across an existing 005 sibling packet with the flag unset produces the same exit code as before this phase. |
| REQ-003 | The system shall register `REQ_COVERAGE` in `validator-registry.json` with severity info, category authored_template, and the `SPECKIT_REQ_COVERAGE` / `_ENFORCE` / `_FLOOR` flags, matching the `AC_COVERAGE` entry shape at `validator-registry.json:51-62`. | `node`-parse of the registry shows the new entry; `validate.sh` dispatches it through the `run_check` registry loop (`validate.sh:636,685`). |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The spec template REQUIREMENTS anchor shall present EARS patterns and an always / ask-first / never constraint tier as authoring guidance without breaking the existing requirement tables. | `spec.md.tmpl` REQUIREMENTS anchor renders the EARS patterns and the three constraint classes. An existing Level 2 spec still validates clean. |
| REQ-005 | When `SPECKIT_EARS_LINT` is enabled, the system shall report requirement rows that match neither an EARS shape nor a constraint-tier class, advisory only and never blocking. | With `SPECKIT_EARS_LINT=true`, a spec containing a free-form non-EARS requirement emits an advisory line. With the flag unset there is no output and no exit-code change. |
| REQ-006 | The `tasks.md` template shall carry a requirement-reference marker so a task row can name the REQ it builds, giving `REQ_COVERAGE` a canonical linkage location. | `tasks.md.tmpl` shows the REQ-reference column or marker; `check-req-coverage.sh` reads that location to compute coverage. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `REQ_COVERAGE` is default-off and warn, registered in `validator-registry.json` and dispatched by `validate.sh`, and an enabled run flags a requirement with no task linkage while an unset run is a verified no-op.
- **SC-002**: The spec and tasks templates carry the EARS patterns, the always / ask-first / never constraint tier, and the REQ-reference linkage marker, and an existing Level 2 sibling packet still validates clean with all new flags unset.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `AC_COVERAGE` shipped rule (`check-ac-coverage.sh`, `validator-registry.json:51-62`) | The clone inherits its registry shape, flag triad, and `run_check` contract | Mirror the AC entry verbatim and retarget only the scan target from checklist AC rows to tasks REQ linkage |
| Dependency | None on `026-shared-safe-fix-engine` or `015-c2-prodmode-recall-gate` | A7 is independent: the shared safe-fix engine gates A1/B1/B2 only, and the C2 prod-mode gate gates every Tier-C and 027 retrieval item only | A7 ships standalone on cost as a floor-bypassing Tier A item. Note the two dependencies here only to record that they do NOT apply |
| Risk | The `req.ears_coverage` fix is risky / suggest-only (`research.md` section 4) | An over-eager auto-rewrite would mutate authored requirement prose and reward-hack a proxy | Keep this phase report-only: the linter and gate warn, they never rewrite a body |
| Risk | A premature warn-to-error flip breaks the legacy corpus | Existing specs predate EARS and the linkage marker | Hold the four-beat migration (`research.md` section 5) for a later phase. This phase lands WARN only |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The `REQ_COVERAGE` and `EARS_LINT` scans add only a per-folder text pass over `spec.md` and `tasks.md`, comparable to the existing `AC_COVERAGE` cost, with no measurable impact on a default `validate.sh` run.

### Security
- **NFR-S01**: The new rule scripts live inside `RULES_DIR` and are dispatched through the same realpath-guarded `run_check` loop the existing rules use (`validate.sh:664-666`), introducing no new file-write or path surface.

### Reliability
- **NFR-R01**: With all new flags unset the validation result is byte-for-byte equivalent to the pre-phase result, so no existing packet regresses.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- No requirements found: the gate is a no-op with an explanatory message, matching `check-ac-coverage.sh:193-196`.
- No tasks linkage column present in a legacy `tasks.md`: the gate treats coverage as unmeasurable and reports advisory, never a hard fail.
- Requirement row inside a fenced code block: the scan is fence-aware, skipping fences as the AC counter does (`check-ac-coverage.sh:84-85`).

### Error Scenarios
- `SPECKIT_REQ_COVERAGE_FLOOR` out of range: clamp to `[0,1]` and note the clamp, mirroring `_ac_clamped_floor`.
- Registry unreadable: `validate.sh` already degrades to a registry-unavailable notice (`validate.sh:92`); the new rule is skipped, not fatal.

### State Transitions
- Flag toggled on mid-corpus: the first enabled run is report-only, so no in-flight packet is blocked.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Two template edits, two new rule scripts, two registry entries |
| Risk | 8/25 | Default-off and warn, no error flip, no body mutation, clones a shipped rule |
| Research | 6/20 | Seams verified to file:line. Pattern already shipped |
| **Total** | **26/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Does the REQ-to-task linkage live as a new column in `tasks.md` or as an inline `REQ-NNN` marker on each task line, given the existing task rows are checkbox bullets not a table (`tasks.md.tmpl:54-77`)?
- Should `EARS_LINT` and `REQ_COVERAGE` share one rule script or stay two registry entries, since they read different files but use the same advisory contract?
<!-- /ANCHOR:questions -->

---

## VERDICT

GO-on-cost. A7 is a Tier A floor-bypassing item that ships on cost and structural soundness (`research.md` section 2, Tier A row A7). It serves the adherence and logic readers, never the retrieval reader, so it pays no re-index or prod-mode-recall tax and is not gated on `015-c2-prodmode-recall-gate`. It clones the shipped `AC_COVERAGE` rule shape, so the build risk is low. It lands default-off and warn so the legacy corpus never breaks.
