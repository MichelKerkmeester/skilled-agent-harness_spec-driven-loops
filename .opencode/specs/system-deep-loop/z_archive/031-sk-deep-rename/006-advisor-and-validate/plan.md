---
title: "Implementation Plan: Phase 006 Advisor Rebuild and Validation"
description: "Plan for restoring Packet 070 parent rename narrative, rebuilding the advisor graph, running direct advisor probes, auditing residual old-name references, and validating the final packet."
trigger_phrases:
  - "070 phase 006 plan"
  - "advisor rebuild plan"
  - "final validation plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/031-sk-deep-rename/006-advisor-and-validate"
    last_updated_at: "2026-05-05T20:00:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Planned final advisor verification and narrative cleanup"
    next_safe_action: "Apply surgical narrative cleanup, rebuild advisor, and run final probes"
    blockers: []
    key_files:
      - "plan.md"
      - "../spec.md"
      - "../resource-map.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "codex-2026-05-05-phase-006"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Phase 006 Advisor Rebuild and Validation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, JSON, Node.js, Python |
| **Framework** | Spec Kit Level 2 contract and skill advisor graph |
| **Storage** | Repo docs plus advisor graph artifacts |
| **Testing** | Advisor build, advisor probes, grep audit, strict validation |

### Overview
Phase 006 is the closing verification pass for Packet 070. It first restores source-side old names in parent narrative, then rebuilds the advisor graph, probes routing, audits active residual references, and records the final verdict.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] User pre-approved the Phase 006 spec folder.
- [x] Parent and Phase 005 artifacts were read for structure and handoff context.
- [x] Level 2 template shape was checked before authoring docs.
- [x] Narrative cleanup file list is explicit and finite.

### Definition of Done
- [ ] Parent narrative cleanup touches only the five listed files.
- [ ] Advisor build script runs.
- [ ] Direct advisor probes return expected top-1 skills.
- [ ] Active-scope final grep returns zero old-name hits.
- [ ] Child and parent strict validation exit 0.
- [ ] `implementation-summary.md` records six-phase outcome and final verdict.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Verification-first finalization with surgical documentation repair.

### Key Components
- **Parent narrative docs**: `../spec.md`, `../description.json`, `../graph-metadata.json`, `../resource-map.md`, and `../002-skill-folder-rename/description.json`.
- **Advisor graph tooling**: `.opencode/skills/system-spec-kit/scripts/dist/skill-graph/build-skill-graph.js` and `skill_advisor.py`.
- **Spec validator**: `.opencode/skills/system-spec-kit/scripts/spec/validate.sh`.
- **Phase 006 docs**: Level 2 docs in this folder.

### Data Flow
Earlier phases produced rename and verification evidence. Phase 006 consumes those outputs, repairs parent search/narrative metadata, rebuilds advisor graph data, tests direct routing, and writes the final implementation summary.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Parent spec docs | Describe Packet 070 source and target names | Restore old names on source side only | Targeted grep for `sk-deep-review`/`sk-deep-research` in parent metadata |
| Advisor graph | Ranks skills for routing prompts | Rebuild via canonical script | Build output and direct probes |
| Runtime mirrors and skill docs | Active consumers of new skill names | Audit only | Final grep old-name audit with exclusions |
| Phase 006 docs | Record closure evidence | Create/update | Child strict validation |

Required inventory:
- Same-class producer search: targeted grep for old names in active scope and excluded historical scope.
- Consumers of changed metadata: parent `description.json` and `graph-metadata.json` trigger phrases.
- Matrix axes: active vs excluded hits; deep-review vs deep-research; build vs probe vs validation command.
- Invariant: active runtime and docs references use new names, while parent rename-history narrative remains searchable by old names.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase A: Planning Artifacts
Create Level 2 `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `graph-metadata.json` before running final verification.

### Phase B: Narrative Cleanup
Patch only the five listed files so source-side rename prose and trigger metadata name `sk-deep-review` and `sk-deep-research`.

### Phase C: Advisor Rebuild and Probes
Run the canonical Node build script. Then run the two direct `skill_advisor.py` probes and capture the top-three output.

### Phase D: Residual Audit and Validation
Run active/excluded grep classification, child strict validation, and parent strict validation. Treat nonzero active hits or validation failures as blockers.

### Phase E: Summary and Verdict
Write `implementation-summary.md`, update task/checklist evidence, and set the verdict to `READY_FOR_COMMIT` only if all P0 checks pass.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test | Command | Expected |
|------|---------|----------|
| Advisor build | `node .opencode/skills/system-spec-kit/scripts/dist/skill-graph/build-skill-graph.js 2>&1 \| tail -10` | Build completes |
| Deep review probe | `skill_advisor.py "deep review the auth flow for security issues" --threshold 0.0` | Top-1 `deep-review` |
| Deep research probe | `skill_advisor.py "deep research the new typing api" --threshold 0.0` | Top-1 `deep-research` |
| Active grep audit | Requested old-name grep with exclusions | Zero active hits |
| Child validation | `validate.sh specs/.../006-advisor-and-validate --strict` | Exit 0 |
| Parent validation | `validate.sh specs/.../070-sk-deep-rename --strict` | Exit 0 |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Phases 001-005 exist and have completed their scoped work.
- Node can run the advisor graph build script.
- `/usr/bin/python3` can run `skill_advisor.py`.
- The spec validator is available under `.opencode/skills/system-spec-kit/scripts/spec/validate.sh`.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Rollback is documentation-local unless the advisor build updates generated graph outputs. If narrative cleanup is wrong, revert only the five listed narrative hunks. If advisor build changes generated files unexpectedly, inspect the diff and rerun probes before deciding whether the generated output belongs in Packet 070.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Dependency | Notes |
|-------|------------|-------|
| 001 | Discovery inventory | Defines historical vs active residual context |
| 002 | Skill folder rename and initial advisor rebuild | Ensures new skill folders and graph keys exist |
| 003 | `.opencode/` internals | Removes active internal old-name references |
| 004 | Runtime mirrors | Removes runtime mirror old-name references |
| 005 | Root docs and configs | Removes root active old-name references |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Work Item | Estimate | Reason |
|-----------|----------|--------|
| Planning artifacts | Medium | Level 2 docs plus graph metadata |
| Narrative cleanup | Low | Five explicit files, exact source-side wording fixes |
| Advisor probes | Low | Two deterministic Python commands |
| Final audit and validation | Medium | Grep classification and strict recursive validation |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

The safest rollback path is hunk-local: parent narrative metadata and Phase 006 docs can be adjusted without touching renamed skill folders. Generated advisor artifacts should only be reverted if the build output conflicts with the expected new skill names.
<!-- /ANCHOR:enhanced-rollback -->
