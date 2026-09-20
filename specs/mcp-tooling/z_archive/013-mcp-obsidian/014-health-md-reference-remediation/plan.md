---
title: "Implementation Plan — Phase 14 — health-md reference remediation"
description: "Plan for rewriting the four health-md reference docs per the deep-research remediation order."
trigger_phrases:
  - "phase 14 plan"
  - "health-md remediation plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/013-mcp-obsidian/014-health-md-reference-remediation"
    last_updated_at: "2026-08-03T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author Phase 14 plan"
    next_safe_action: "Execute T001-T006"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/014-health-md-reference-remediation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- SPECKIT_LEVEL: 1 -->

# Implementation Plan — Phase 14 — health-md reference remediation

<!-- ANCHOR:summary -->
## 1. SUMMARY

Rewrite the four `references/plugins/health-md/` docs so they implement the deep-research remediation order (§7 of `research.md`): real `health-viz` fence contract, mock-fallback warning, Apple/Android model, narrowed write authority, file-layer separation, privacy contract, complete settings contract — while retaining the accurate v0-v7/nesting/cache/roll-up/dictionary content. Reversible: git-revert the four files.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Check | Tool |
|------|-------|------|
| Fence hygiene | Zero `health-md` fences / `type: chart` / `dateRange` in the reference set | grep -r |
| Example validity | Every `health-viz` block uses registered renderers + documented keys | read + research §3 cross-check |
| Traceability | Each section maps to research.md §1-§6 + its SOURCE urls | read |
| Retention | v0-v7, nesting, cache, roll-up, dictionary, compact-archive sections still present | read |
| Versioning | All four files keep `version:` frontmatter | frontmatter gate |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Documentation-only. Four files, each mapped to research sections:

| File | Research source | Focus |
|------|-----------------|-------|
| `health-md.md` (index) | §1-§2, §5, §7.1-7.3 | Identity, what-it-does, quick start with real `health-viz` fence, mock-fallback warning, platform summary |
| `data-model.md` | §1-§4 | Formats/schemas, settings contract, file-layer separation table, roll-up semantics, dictionary, archives |
| `workflows.md` | §4-§6, §7.4 | Read-only-first posture, authentic-source verification, narrowed write authority, entry-note discovery |
| `troubleshooting.md` | §2, §5-§6 | Empty-chart distinction matrix, permission ambiguity, bounded previews, privacy-safe diagnostics |
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

| Phase | Work |
|-------|------|
| Setup | Extract the remediation checklist + contracts from `research.md` |
| Implementation | Rewrite the four docs (T001-T004); supersede 012's T009 |
| Verification | Grep gates, retention check, spot-check vs research (T005-T006) |

Sequenced in tasks.md (T001–T006).
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Static verification: grep for banned fence/keys (REQ-001), read-through against research.md section-by-section (SC-002), frontmatter version gate, and the phase-level `validate.sh`. No live vault interaction in this phase (that is Phase 17).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Risk | Mitigation |
|------------|------|------------|
| `research.md` completeness | Missing nuance | Research converged (all questions answered); any gap flagged, not invented |
| 012's task ledger | Stale T009 | Mark superseded in `012/tasks.md` |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

`git checkout --` the four reference files (previous content is committed). 012's task note is a single-line edit, trivially reverted.
<!-- /ANCHOR:rollback -->
