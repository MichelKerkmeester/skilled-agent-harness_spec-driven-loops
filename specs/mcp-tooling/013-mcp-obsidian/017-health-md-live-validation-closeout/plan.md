---
title: "Implementation Plan — Phase 17 — health-md live validation and closeout"
description: "Plan for the live OBS-014 run and closeout of the health-md remediation phases."
trigger_phrases:
  - "phase 17 plan"
  - "health-md closeout plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/013-mcp-obsidian/017-health-md-live-validation-closeout"
    last_updated_at: "2026-08-03T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author Phase 17 plan"
    next_safe_action: "Execute T001-T005"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/017-health-md-live-validation-closeout"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- SPECKIT_LEVEL: 1 -->

# Implementation Plan — Phase 17 — health-md live validation and closeout

<!-- ANCHOR:summary -->
## 1. SUMMARY

Run the remediated OBS-014 scenario live against a real vault — proving the mock-fallback guard (empty folder renders bundled data → not proof) and the authentic-source verification path — then validate and close out phases 014-017. Reversible: the run touches only `_pbtest-` paths; the scenario verdict is a doc edit.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Check | Tool |
|------|-------|------|
| Guard exercised | Empty-folder case observed + correctly graded | scenario verdict |
| Authentic verification | Actual data folder identified from plugin settings + at least one authentic file path cited | read |
| Throwaway discipline | Only `_pbtest-` paths written; cleanup verified | ls before/after |
| Validation | `validate.sh` 0 errors on 014-017 | validate.sh |
| Closeout | Summaries + parent map consistent | read |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

No new components. Sequence:

1. **Pre-flight**: read the vault's `.obsidian/plugins/health-md/data.json` (folder/pattern/format); list the data folder (expect empty → mock-fallback case).
2. **Mock-fallback observation**: with the folder empty, place a `health-viz` block in a `_pbtest-` note; document that a chart would render from bundled example data — graded NOT proof.
3. **Authentic verification**: write the Phase 15 fixture to a `_pbtest-` subfolder under the data folder (or a `_pbtest-` folder if the pattern allows), verify the file is identifiable + parses; grade PASS per the scenario.
4. **Cleanup**: remove throwaway files; verify the real data folder untouched.
5. **Closeout**: validate.sh on 014-017; refresh metadata; write summaries; update the parent phase map.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

| Phase | Work |
|-------|------|
| Setup | Pre-flight settings + folder listing |
| Implementation | Mock-fallback observation; authentic-file verification; cleanup |
| Verification | Verdict + evidence; validate.sh; closeout docs |

Sequenced in tasks.md (T001–T005).
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The phase IS a test: the OBS-014 live execution is the verification record. Secondary checks: `validate.sh` on all new phases, JSON parse of the fixture, ls-verified cleanup.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Risk | Mitigation |
|------------|------|------------|
| Phases 14-16 artifacts | Scenario references wrong pointers | Verify pointers before the run |
| Vault on this machine | No vault available | 3 vaults exist; use MEGA/Documents/Obsidian |
| Health.md plugin settings | Folder/pattern unknown | Read `data.json` first; adapt the run to the actual configuration |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Delete `_pbtest-` files (cleanup is part of the run itself); revert the scenario verdict edit if needed. No other files touched.
<!-- /ANCHOR:rollback -->
