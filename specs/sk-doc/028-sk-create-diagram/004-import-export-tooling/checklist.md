---
title: "Verification Checklist: sk-create-diagram import/export tooling"
description: "Readiness gates confirming the extraction scripts and import/export references work before hub wiring."
trigger_phrases:
  - "diagram import export checklist"
importance_tier: "important"
contextType: "verification"
_memory:
  continuity:
    packet_pointer: "sk-doc/028-sk-create-diagram/004-import-export-tooling"
    last_updated_at: "2026-08-12T06:38:42.000Z"
    last_updated_by: "claude"
    recent_action: "Verified executor output; fixed 4 stale later-phase references in SKILL.md"
    next_safe_action: "Start phase 005 (orchestrator-direct hub wiring)"
    blockers: []
    key_files:
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-create-diagram-fork"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Verification Checklist: sk-create-diagram import/export tooling

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Readiness Impact |
|----------|----------|------------------|
| **P0** | Hard blocker | Must pass before phase 005 can start |
| **P1** | Required | Must pass or carry an explicit deferral |
| **P2** | Optional | May remain for a later phase |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Phase 002 `SKILL.md` and `references/` existed before this phase started.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Both scripts exist, byte-for-byte from source. [EVIDENCE: `cmp -s` confirmed identical for `drawio_extract.py` and `mermaid_extract.py`, re-run independently by the orchestrator.]
- [x] CHK-011 [P0] Both scripts pass `--help` with exit 0. [EVIDENCE: independent orchestrator run of `python3 <script> --help`, both exit 0.]
- [x] CHK-012 [P0] No third-party import was introduced. [EVIDENCE: `grep -E '^import|^from'` on both scripts re-run by the orchestrator, matches the confirmed stdlib list exactly.]
- [x] CHK-013 [P1] All 3 references exist with valid frontmatter. [EVIDENCE: `import-drawio.md`, `import-mermaid.md`, `export.md` present under `references/`.]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] `validate_skill_package.py --check --strict` exits 0 for the full packet. [EVIDENCE: `PASS (exit 0)`, re-run by the orchestrator after both the executor's edits and the orchestrator's own follow-up fix.]
- [x] CHK-021 [P1] `SKILL.md` routes `.drawio*`, `.mmd`/`.mermaid`, and export requests to the correct reference. [EVIDENCE: executor's 3-edit diff, cross-checked against the SMART ROUTING `RESOURCE_MAP` which already carried the routing keys.]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

This phase is content porting, not a code fix. One documentation-quality gap was found and fixed: 4 stale "ships in a later phase" references across `SKILL.md` (lines 125, 277, 336, 507), now inaccurate since every referenced file exists. The executor correctly flagged one instance as out-of-scope for its own edit restriction rather than silently expanding scope; the orchestrator fixed all 4 as a same-category follow-up.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No file outside the allowed write paths was created, modified, or deleted. [EVIDENCE: executor confirmed via `git status`; orchestrator's own follow-up edits were scoped to the same `SKILL.md` file already in phase.]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Dispatch prompt, executor output, and orchestrator verification are recorded in `implementation-summary.md`.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Final tree matches the frozen manifest: 2 scripts, 3 references, 3 surgical `SKILL.md` edits plus the orchestrator's 4 stale-reference fixes.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Gate | State | Evidence |
|------|-------|----------|
| Script byte-identity | PASS | `cmp -s`, independently re-run |
| Script `--help` smoke test | PASS | exit 0 on both |
| Stdlib-only import confirmation | PASS | `grep` re-run |
| `validate_skill_package.py --check --strict` | PASS | exit 0 |
| Stale "later phase" references | FIXED | 4 instances corrected |

**Verification Date**: 2026-08-12
<!-- /ANCHOR:summary -->
