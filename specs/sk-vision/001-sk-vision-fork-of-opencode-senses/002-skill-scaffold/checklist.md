---
title: "Verification Checklist: sk-vision 002 skill scaffold"
description: "Verification checklist for sk-vision standalone skill scaffold."
trigger_phrases:
  - "sk-vision scaffold checklist"
importance_tier: "important"
contextType: "verification"
_memory:
  continuity:
    packet_pointer: "sk-vision/001-sk-vision-fork-of-opencode-senses/002-skill-scaffold"
    last_updated_at: "2026-08-16T07:10:00.000Z"
    last_updated_by: "cursor-grok"
    recent_action: "Added empty vision-runtime check to the gate list."
    next_safe_action: "Perform pre-implementation checks."
    blockers: []
    key_files:
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-002-scaffold-20260815"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: sk-vision 002 skill scaffold

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

- [ ] CHK-001 [P0] Requirements documented in spec.md | Evidence: Spec Section 4
- [ ] CHK-002 [P0] Technical approach defined in plan.md | Evidence: Plan Section 1
- [ ] CHK-003 [P1] Predecessor 001-research complete | Evidence: 001-research/implementation-summary.md
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] SKILL.md contains required frontmatter and trigger keywords | Evidence: SKILL.md frontmatter
- [ ] CHK-011 [P0] graph-metadata.json conforms to Class S standalone schema | Evidence: graph-metadata.json
- [ ] CHK-012 [P0] No hub JSON files (description.json, mode-registry.json, hub-router.json, command-metadata.json) in skill root | Evidence: Directory listing of .opencode/skills/sk-vision
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] `node .opencode/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs` reports no forbidden files | Evidence: Command exit status
- [ ] CHK-021 [P1] `leaf-manifest.json` and `leaf-aliases.json` generated via `--fix`, not hand-edited | Evidence: leaf-manifest.json content
- [ ] CHK-022 [P1] `python3 .opencode/skills/sk-doc/sk-create-skill/scripts/package_skill.py .opencode/skills/sk-vision --check` exits 0 | Evidence: Command exit status
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-030 [P0] SKILL.md documents runtime reservation and host integration boundaries | Evidence: SKILL.md Sections 2 & 3
- [ ] CHK-031 [P1] README.md authored with clear purpose and links | Evidence: README.md
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-040 [P0] No sensitive credentials or private tokens introduced in skill documentation | Evidence: Code scan
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-050 [P0] Implementation summary updated with delivered structure | Evidence: implementation-summary.md
- [ ] CHK-051 [P1] Spec packet passes strict validation | Evidence: validate.sh output
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-060 [P0] File structure matches architecture in plan.md | Evidence: Directory tree
- [ ] CHK-061 [P0] `vision-runtime/` is absent or empty of source | Evidence: `test ! -e` or empty listing
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Metric | Value |
|--------|-------|
| Total Checks | 16 |
| Passed Checks | 0 |
| Remaining Checks | 16 |
| P0 Blockers | 11 |
<!-- /ANCHOR:summary -->
