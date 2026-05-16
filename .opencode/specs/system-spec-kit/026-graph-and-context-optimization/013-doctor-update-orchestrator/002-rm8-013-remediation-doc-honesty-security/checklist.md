---
title: "Checklist: 003 RM-8 013 Remediation"
description: "Per-finding verification checklist for all 30 P1 + 30 P2 findings from 013 review-report.md (commit 8d794afad). Marked with evidence as each finding is closed."
trigger_phrases:
  - "003 checklist"
  - "013 remediation checklist"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "013-doctor-update-orchestrator/002-rm8-013-remediation-doc-honesty-security"
    last_updated_at: "2026-05-11T08:15:00Z"
    last_updated_by: "main-claude-opus-4.7"
    recent_action: "Authored Level-2 checklist with one row per finding"
    next_safe_action: "Mark items as each batch verifies"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:003-checklist-2026-05-11"
      session_id: "main-003-2026-05-11"
      parent_session_id: null
    completion_pct: 20
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->
# Checklist: 003 RM-8 013 Remediation

<!-- SPECKIT_LEVEL: 2 -->

Each finding ID below corresponds to the `R<iter>-<sev>-<seq>` IDs in `../review/review-report.md` and `../review/deep-review-findings-registry.json`.

---

## Cluster A — last_active_child_id + parent status drift (P1)

- [ ] **R1-P1-001** Parent `last_active_child_id` is null — evidence: ___
- [ ] **R2-P1-001** Duplicate of R1-P1-001 — evidence: ___
- [ ] **R8-P1-002** Doc-code drift: last_active_child_id falsely claimed as set in 002 docs — evidence: ___
- [ ] **R1-P1-002** Parent graph-metadata.json status: planned → in_progress — evidence: ___

## Cluster B — 001 completion-state contradictions (P1)

- [ ] **R1-P1-003** 001 implementation-summary contradictory completion states — evidence: ___
- [ ] **R2-P1-003** Duplicate of R1-P1-003 — evidence: ___
- [ ] **R3-P1-003** Duplicate of R1-P1-003 — evidence: ___
- [ ] **R2-P1-004** 001 tasks.md stale ⏳ Pending status for completed files — evidence: ___
- [ ] **R1-P1-004** 001 checklist.md 100% unchecked — evidence: ___
- [ ] **R6-P1-001** Duplicate of R1-P1-004 — evidence: ___
- [ ] **R2-P1-006** 001 IMS Track B1 obsolete YAML mentions — evidence: ___
- [ ] **R3-P1-004** Duplicate of R2-P1-006 — evidence: ___

## Cluster C — 002 completion-state + scenario count (P1)

- [ ] **R3-P1-002** 002 IMS continuity completion_pct 70 vs body 95 — evidence: ___
- [ ] **R1-P1-007** 002 checklist.md unchecked — evidence: ___
- [ ] **R6-P1-002** Duplicate of R1-P1-007 — evidence: ___
- [ ] **R3-P0-001 (→P1)** Verification gate bypassed — duplicate of R1-P1-007 — evidence: ___
- [ ] **R3-P1-001** 002 spec.md SC-001 25 scenarios vs reality 23 — evidence: ___

## Cluster D — parent spec yaml count drift (P1)

- [ ] **R2-P1-005** Parent spec.md "21 yamls" obsolete per ADR-010 — evidence: ___
- [ ] **R6-P1-003** Duplicate of R2-P1-005 — evidence: ___

## Cluster E — 001 description.json specFolder drift (P1)

- [ ] **R1-P1-005** 001 description.json specFolder at parent level — evidence: ___

## Cluster F — stale resource-map status (P1 → P2 after adjudication)

- [ ] **R1-P1-006 → P2** 001 resource-map all PLANNED — evidence: ___
- [ ] **R1-P1-008 → P2** 002 resource-map all PLANNED — evidence: ___

## Cluster G — doctor command security (P1)

- [ ] **R4-P1-002** doctor-runtime-bootstrap.sh `npm install --no-audit` — evidence: ___
- [ ] **R4-P1-004** doctor-runtime-bootstrap.sh mkdir lock TOCTOU — evidence: ___
- [ ] **R4-P1-001 → P2** doctor_update.yaml rm -rf TOCTOU (downgraded; flock mitigates) — evidence: ___
- [ ] **R4-P1-003 → P2** cocoindex_venv_check pip install -e . (downgraded) — evidence: ___
- [ ] **R4-P1-005 → P2** No integrity check on migration-manifest.json (downgraded) — evidence: ___

## Cluster H — sandbox security (P1)

- [ ] **R5-P1-001** docker-compose broad RW mount — evidence: ___
- [ ] **R5-P1-002** No cap_drop on sandbox container — evidence: ___
- [ ] **R5-P1-003 → P2** SPECKIT_DOCTOR_RUNNER env var unvalidated (downgraded) — evidence: ___

## Cluster I — traceability (P1)

- [ ] **R6-P1-004** P0 REQ-003 strict-validate exit 0 never passed (cross-packet; defer or fix) — evidence: ___
- [ ] **R7-P1-001** Doctor commands lack skill_agent traceability — evidence: ___
- [ ] **R8-P1-001** Cross-runtime command mirror missing for 3/4 runtimes — evidence: ___
- [ ] **R6-P1-005 → P2** No POST-SAVE QUALITY REVIEW evidence (downgraded) — evidence: ___

## Cluster J — maintainability P2

### R2 P2

- [ ] **R2-P2-001** evidence: ___
- [ ] **R2-P2-002** evidence: ___

### R3 P2

- [ ] **R3-P2-001** evidence: ___
- [ ] **R3-P2-002** evidence: ___

### R4 P2

- [ ] **R4-P2-001** evidence: ___
- [ ] **R4-P2-002** evidence: ___

### R5 P2

- [ ] **R5-P2-001** Debian-full vs slim — evidence: ___
- [ ] **R5-P2-002** Sandbox guard returns success not SKIP — evidence: ___

### R6 P2

- [ ] **R6-P2-001** evidence: ___
- [ ] **R6-P2-002** evidence: ___

### R7 P2

- [ ] **R7-P2-001** No @doctor agent (deliberate per spec) — `[~]` defer — evidence: ___
- [ ] **R7-P2-002** 002 SC-001 25 vs 23 — covered by Cluster C — evidence: ___

### R8 P2

- [ ] **R8-P2-001** Gemini doctor commands use .toml instead of .md (likely Codex, not Gemini — verify) — evidence: ___
- [ ] **R8-P2-002** Parent spec REQ-P-001 too strict on lean trio — evidence: ___

### R9 P2 (9 findings)

- [ ] **R9-P2-001** Stale 001-doctor-commands resource-map statuses — covered by Cluster F — evidence: ___
- [ ] **R9-P2-002** 001 resource-map references absent scratch/ — evidence: ___
- [ ] **R9-P2-003** 001 spec.md stale continuity (completion_pct: 0) — evidence: ___
- [ ] **R9-P2-004** Stale packet_pointer in 001 child docs missing /001-doctor-commands suffix — evidence: ___
- [ ] **R9-P2-005** 013-parent resource-map marks .opencode/skill symlink OK but path absent — evidence: ___
- [ ] **R9-P2-006** evidence: ___
- [ ] **R9-P2-007** evidence: ___
- [ ] **R9-P2-008** evidence: ___
- [ ] **R9-P2-009** evidence: ___

---

## Final gate

- [ ] All P1 above marked `[x]` with `file:line` evidence
- [ ] All P2 above marked `[x]` (resolved) or `[~]` (deferred with note)
- [ ] `validate.sh --strict` exits 0
- [ ] 013 phase parent metadata: `derived.status == in_progress` (or `done`) and `derived.last_active_child_id == 002-rm8-013-remediation-doc-honesty-security`
