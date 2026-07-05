---
title: "Feature Specification: Runtime Hygiene Fixes"
description: "Remove 6 live comment-hygiene violations and fix the salvage/duplicate-filename naming defect behind the codex zero-finding registry and glm's inflated iteration-file count."
trigger_phrases:
  - "runtime hygiene fixes"
  - "comment hygiene markers cleanup"
  - "salvage placeholder naming fix"
  - "duplicate iteration filename fix"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/030-deep-loop-improved/009-research-backlog-remediation/003-runtime-hygiene-fixes"
    last_updated_at: "2026-07-01T07:20:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored spec from research.md F-002/G-003, F-012/F-014, F-019/G-009 (Tier0 #3,#4,#5)"
    next_safe_action: "Author plan.md and tasks.md, then dispatch implementation to MiMo v2.5 ultraspeed"
    blockers: []
    key_files:
      - ".opencode/commands/deep/assets/deep_review_auto.yaml"
      - ".opencode/commands/deep/assets/deep_research_auto.yaml"
      - ".opencode/skills/deep-loop-runtime/scripts/fanout-salvage.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sonnet-009-remediation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: Runtime Hygiene Fixes

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-07-01 |
| **Parent Spec** | `../spec.md` |
| **Phase** | 3 |
| **Predecessor** | 002-fanout-timeout-override |
| **Successor** | 004-phase-doc-map-and-completion-pct-sync |
| **Handoff Criteria** | Zero remaining `F-\d+-[A-Z0-9]+-\d+`-style markers in any YAML comment; salvage placeholder filenames zero-padded; a new lint check exists; full deep-loop-runtime suite green |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Three related but distinct hygiene defects, all confirmed live:
1. **Comment-hygiene violation** — 6 ephemeral finding-ID markers still embedded in workflow YAML comments, directly violating this project's constitutional comment-hygiene hard block. Confirmed exact locations: `deep_review_auto.yaml:395,408,988` (`F-010-B5-04` x2, `F-010-B5-03`) and `deep_research_auto.yaml:301,319,1099` (`F-010-B5-04` x2, `F-010-B5-02`). Both deep-research lineages independently found all 6 (`research/research.md` §4.2, F-002/G-003). **Generation-2 forced-depth research (35 iterations/lineage) found 4 MORE live instances beyond the original 6, confirmed by direct grep**: `.opencode/skills/cli-opencode/SKILL.md:289` (`F-007-B2-01`) and `.opencode/skills/cli-opencode/references/agent_delegation.md:225,226,228` (`F-007-B2-02` x3) — total scope is now **10 markers across 3 files**, not 6 across 2 (`research/research.md` R2-GPT-002).
2. **Salvage placeholder naming defect** — `fanout-salvage.cjs:112` writes failed-iteration placeholder files as `iteration-${iterNum}.md` with **no zero-padding**, while real iteration files use a zero-padded canonical name (`iteration-001.md`, etc). This is the root-caused reason the codex review lineage's findings registry showed 0 findings after 50 real iterations: its 100 iteration files are 50 real (zero-padded) + 50 non-padded salvage placeholders, and whatever process counts/reads iteration files did not distinguish them correctly (`research/research.md` §4.2, F-012/F-014).
3. **Duplicate-iteration-filename artifact** — the glm deep-research lineage independently wrote every real iteration under BOTH the canonical zero-padded name and a non-padded duplicate (`iteration-001.md` AND `iteration-1.md`, byte-identical), inflating its apparent file count from 18 real iterations to 36 files. Same naming-ambiguity root cause as #2, manifesting in a different lineage/loop-type (`research/research.md` §3.3, F-019/G-009).

### Purpose
Remove the 6 live comment-hygiene violations, fix the salvage-placeholder naming so it can't collide/confuse with the canonical zero-padded convention, and add a lint check so hygiene markers can't recur. Investigate whether #2 and #3 share a single fixable root cause (a naming-convention ambiguity somewhere both salvage-writing and lineage-self-authored files draw from) versus needing independent patches.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Remove all 10 confirmed `<!-- F-\d+-[A-Z0-9]+-\d+ -->`-style markers across `deep_review_auto.yaml`, `deep_research_auto.yaml`, `.opencode/skills/cli-opencode/SKILL.md`, and `.opencode/skills/cli-opencode/references/agent_delegation.md`, replacing with durable-WHY prose where the marker was annotating something meaningful, or deleting outright where it was purely a tracking artifact.
- Add a lint rule (in `validate.sh` or a pre-commit hook) matching `F-\d+-[A-Z0-9]+-\d+` inside YAML/code comments, so this class of violation is caught automatically going forward.
- Fix `fanout-salvage.cjs:112` to zero-pad the placeholder iteration number to match the canonical convention (check `state_paths.iteration_pattern` or equivalent for the exact padding width expected elsewhere in the runtime).
- Investigate the actual iteration-counting/reducer code path that produced codex's 0-finding registry to confirm the salvage-naming defect is the true root cause (not just glm's hypothesis) before declaring it fixed; if a SEPARATE bug in the counting glob also exists, fix that too.
- Re-run the reducer/registry-build process against codex's real 50 iterations (once salvage placeholders are excluded/fixed) to backfill its actual findings, if feasible without excessive scope expansion — otherwise document as a known follow-up.

### Out of Scope
- Any change to WHAT gets written into a salvage placeholder's content (only the filename convention is in scope).
- Retroactively fixing every already-written duplicate-named file across the whole repo (that's covered by whatever child handles the specific glm lineage's own artifacts, if any cleanup is warranted there — this phase fixes the code so it can't recur).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/commands/deep/assets/deep_review_auto.yaml` | Modify | Remove 3 markers (lines 395, 408, 988) |
| `.opencode/commands/deep/assets/deep_research_auto.yaml` | Modify | Remove 3 markers (lines 301, 319, 1099) |
| `.opencode/skills/deep-loop-runtime/scripts/fanout-salvage.cjs` | Modify | Zero-pad placeholder iteration filenames |
| `.opencode/skills/system-spec-kit/scripts/spec/validate.sh` (or a pre-commit hook) | Modify | New comment-hygiene lint rule |
| `.opencode/skills/deep-loop-runtime/tests/unit/fanout-salvage.vitest.ts` (or nearest existing test file) | Modify | Regression test for zero-padded placeholder naming |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 — Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Zero `F-\d+-[A-Z0-9]+-\d+` markers remain in any of the 4 confirmed files | `grep -rn "F-[0-9]\+-[A-Z0-9]\+-[0-9]\+" .opencode/commands .opencode/skills` (whole-repo, not just the 4 known files, since generation-2 already found 4 more than generation-1 estimated) returns nothing |
| REQ-002 | Salvage placeholders use zero-padded filenames | New test: a salvage placeholder for iteration 1 is named `iteration-001.md`, not `iteration-1.md` |
| REQ-003 | A lint rule exists that would have caught the original 6 markers | New validate.sh/pre-commit check fails when re-run against a fixture containing an `F-\d+-...` marker in a comment |

### P1 — Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Root cause of codex's 0-finding registry is confirmed (not just hypothesized) | Implementation summary documents the actual code path read and what specifically caused the 0-finding result |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `grep` for the marker pattern across the whole repo's `.opencode/commands/` and `.opencode/skills/` trees returns zero hits (not just the 6 originally cited).
- **SC-002**: New salvage-naming test is RED before the fix, GREEN after.
- **SC-003**: Full `deep-loop-runtime` Vitest suite passes.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Scope | The codex zero-finding registry's true root cause may be more complex than the naming defect alone | REQ-004 backfill effort could expand | Time-box the investigation; document findings even if a full backfill isn't completed this phase |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Whether #2 (codex) and #3 (glm) share one exact root-cause code path, or are two independent instances of the same convention gap — resolve during implementation, document either way.
<!-- /ANCHOR:questions -->
