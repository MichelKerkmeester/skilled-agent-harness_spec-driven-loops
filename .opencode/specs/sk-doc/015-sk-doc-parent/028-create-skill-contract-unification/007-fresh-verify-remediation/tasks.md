---
title: "Tasks: Fresh-Verify Fleet Remediation"
description: "One row per defect: surgical or fresh LUNA MAX fix, then a fresh Sonnet-5 xhigh re-verify, across the 11 FAIL skills plus the surface validator branch."
trigger_phrases:
  - "fresh verify remediation tasks"
  - "per-defect remediation rows"
  - "surgical LUNA re-verify"
importance_tier: "normal"
contextType: "implementation"
parent: "sk-doc/015-sk-doc-parent/028-create-skill-contract-unification"
_memory:
  continuity:
    packet_pointer: "sk-doc/015-sk-doc-parent/028-create-skill-contract-unification/007-fresh-verify-remediation"
    last_updated_at: "2026-07-14T07:12:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Remediated fleet defects from fresh verify"
    next_safe_action: "Run advisor re-baseline for description changes"
    blockers: []
    key_files: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

# Tasks: Fresh-Verify Fleet Remediation

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable (>=5 concurrent per wave) |

**Format**: `T### [P?] Description (path)`. Each defect has a fix task; all defects share the re-verify pass.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Fleet audit: 46 fresh Sonnet-5 xhigh agents, one per SKILL.md [EVIDENCE: workflow `wf_8d695f77-ad0`; 11 PASS / 24 CONCERN / 11 FAIL]
- [x] T002 Confirm every FAIL is pre-existing, not a sweep regression [EVIDENCE: `git diff f454518df1^..f454518df1` + agents' git-blame notes]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

Surgical fixes (confirmed exact edits by the orchestrator):

- [x] T003 [P] create-flowchart broken `assets/flowcharts/` -> `assets/`, package-wide [EVIDENCE: `6ff2546493`; 0 live stale refs; gate PASS]
- [x] T004 [P] create-manual-testing-playbook `assets/testing_playbook/` -> `assets/`, package-wide [EVIDENCE: `6ff2546493`; 0 live stale refs; gate PASS]
- [x] T005 [P] code-webflow RESOURCE_MAP missing trailing commas added [EVIDENCE: `6ff2546493`; content-based comma scan; gate PASS]
- [x] T006 [P] system-skill-advisor HOOKS keywords deduped opencode, added codex [EVIDENCE: `6ff2546493`; `"codex"` present at SKILL.md:121]
- [x] T007 [P] deep-alignment json dropped from markdown-guarded RESOURCE_MAP [EVIDENCE: `6ff2546493`; 0 json in RESOURCE_MAP; gate PASS]

Substantial fixes (fresh GPT-5.6 LUNA MAX per defect, orchestrator-verified):

- [x] T008 [P] code-quality checklist paths -> `../code-opencode/assets/checklists/` [EVIDENCE: `6ff2546493`; all 10 paths resolve on disk; gate PASS]
- [x] T009 [P] code-review detect_surface_evidence placeholder fixed; asset snake_cased; REFERENCES consolidated [EVIDENCE: `6ff2546493`; gate PASS 0 warnings]
- [x] T010 [P] mcp-click-up config/auth/namespace corrected across SKILL.md + README + references [EVIDENCE: `6ff2546493`; 0 stale markers vs `.utcp_config.json`; gate PASS]
- [x] T011 [P] system-deep-loop hub: 8th alignment mode added across SKILL.md/README/descriptor/graph [EVIDENCE: `6ff2546493`; parent-skill-check 0 warnings]
- [x] T012 [P] sk-doc hub: create-diff + create-changelog added to layout/references/descriptor [EVIDENCE: `6ff2546493`; both present in SKILL.md + description.json]
- [x] T013 [P] cli-external-orchestration: descriptor/graph/README synced with cli-codex [EVIDENCE: `6ff2546493`; parent-skill-check 0 warnings]
- [x] T014 Followup: `package_skill.py` branches on packetKind: surface [EVIDENCE: `c3352a176a`; both surface packets PASS `--strict`, non-surface unaffected]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T015 Fresh Sonnet-5 xhigh re-verify of every remediated skill [EVIDENCE: workflow `wf_ec00e980-b1a`; 12/12, 9 PASS 3 CONCERN 0 FAIL, all defectResolved]
- [x] T016 Close CONCERN completeness gaps (defect in sibling files) package-wide [EVIDENCE: `6ff2546493`; create-flowchart/create-manual-testing-playbook/mcp-click-up siblings 0 stale refs]
- [x] T017 `validate.sh --recursive --strict` Errors 0; reconcile packet docs [EVIDENCE: 028 recursive validate Errors 0]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All 11 FAIL defects resolved, confirmed on disk by fresh Sonnet-5 re-verify [EVIDENCE: `wf_ec00e980-b1a`; 0 FAIL]
- [x] Surface validator branch shipped and tested [EVIDENCE: `c3352a176a`]
- [x] Gates green (children `--strict`; hubs 0 warnings) [EVIDENCE: `6ff2546493`; per-skill gate PASS]
- [x] `validate.sh --recursive --strict` Errors 0 [EVIDENCE: `validate.sh --recursive --strict` on 028 parent -> Errors:0]
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `./spec.md`
- **Plan**: `./plan.md`
- **Checklist**: `./checklist.md`
<!-- /ANCHOR:cross-refs -->
