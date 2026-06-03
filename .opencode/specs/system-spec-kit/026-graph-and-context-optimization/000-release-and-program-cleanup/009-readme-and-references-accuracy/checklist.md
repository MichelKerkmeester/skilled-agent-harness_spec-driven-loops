---
title: "Verification Checklist: README & References Accuracy Audit + Remediation"
description: "QA verification for the 3-stage audit -> verify -> remediate workflow and the 142 confirmed doc fixes across 61 files."
trigger_phrases:
  - "readme accuracy checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/133-readme-and-references-accuracy"
    last_updated_at: "2026-06-03T07:32:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Verification items confirmed via grepClean + 4-cluster spot-verify"
    next_safe_action: "Validate --strict and reconcile"
    blockers: []
    key_files:
      - ".opencode/install_guides"
      - ".opencode/skills/system-spec-kit/references"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "readme-references-accuracy-session"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Verification Checklist: README & References Accuracy Audit + Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md (REQ-001..006)
- [x] CHK-002 [P0] Technical approach defined in plan.md (3-stage audit → verify → remediate over 10 areas)
- [x] CHK-003 [P1] Scope census confirmed: ~33 user-facing command READMEs + 41 references + 4 assets; ~250 nested stubs excluded
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Remediation is finding-driven; no edits beyond the 144 confirmed findings (no scope creep)
- [x] CHK-011 [P0] No spec-path/packet-id introduced into any edited doc as a tracking artifact
- [x] CHK-012 [P1] grepClean: singular `.opencode/skill` path token, drifted tool-API signatures, and stale entrypoints gone across edited files
- [x] CHK-013 [P1] No source/config files touched — edits land only in audited READMEs + references/assets
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All 159 raw findings adversarially verified against the real filesystem
- [x] CHK-021 [P0] 13 false positives rejected (dist build-artifact class + a `.mcp.json` analogue); not applied
- [x] CHK-022 [P1] Cross-tool check used for "file does not exist" findings (`rg --files` catches fd false-negatives; `recommend-level.sh` confirmed present)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-030 [P0] Theme 1 — `.opencode/skill` → `.opencode/skills` (install_guides + skills/README; commands, `init_skill.py --path`, links)
- [x] CHK-031 [P0] Theme 2 — MCP entrypoint = launcher `node .opencode/bin/mk-spec-memory-launcher.cjs` (per opencode.json)
- [x] CHK-032 [P0] Theme 3 — tool-API drift fixed (`mode:[dry-run,apply]`, `call_tool_chain({code})`, `EMBEDDINGS_PROVIDER`, `mk-skill-advisor.js`)
- [x] CHK-033 [P0] Theme 4 — validation-reference drift realigned to validator-registry.json + spec-kit-docs.json (WARN→error, `AI_PROTOCOL`→`AI_PROTOCOLS`, L1 + implementation-summary, full validate.sh path)
- [x] CHK-034 [P1] Theme 5 — level_selection_guide §2 → recommend-level.sh 4-factor scoring (LOC35/File20/Risk25/Complexity20); embedder_architecture trimmed to nomic-only MANIFESTS
- [x] CHK-035 [P0] 142 fixes applied across 61 files; 0 skipped
- [x] CHK-036 [P0] 4 highest-risk content clusters spot-verified against live source — all correct
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-040 [P0] No hardcoded secrets introduced by the doc edits
- [x] CHK-041 [P1] Read-only audit/verify stages used no-write parallel workflows
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P1] spec/plan/tasks/implementation-summary synchronized to shipped state
- [x] CHK-051 [P2] Confirmed-findings detail retained at `/tmp/readme-research/AUDIT-REPORT.md` + `confirmed.json`
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P1] No temp/scratch artifacts introduced into the repo (findings detail kept under `/tmp`, not committed)
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 8 | 8/8 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-06-03

### Ship status

- [x] CHK-070 [P1] description.json + graph-metadata.json present
- [ ] CHK-071 [P0] `validate.sh --strict` → Errors 0
- [ ] CHK-072 [P1] Completion metadata reconciled across packet docs
<!-- /ANCHOR:summary -->
