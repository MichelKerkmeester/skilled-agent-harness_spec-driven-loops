---
title: "Implementation Plan: sk-code Cross-Reference and Metadata Sync"
description: "Plan for adding additive Webflow motion.dev cross-references, exposing motion_dev in sk-code router metadata, and validating Packet 3."
trigger_phrases:
  - "sk-code motion.dev cross-reference plan"
  - "003-cross-ref metadata plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/z_archive/007-sk-code-motion-dev-and-playbook/003-cross-ref-metadata-sync"
    last_updated_at: "2026-05-05T08:30:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Defined Packet 3 implementation sequence"
    next_safe_action: "Patch cross-references, refresh metadata, and validate"
    blockers: []
    key_files:
      - "plan.md"
      - ".opencode/skills/sk-code/references/webflow/"
      - ".opencode/skills/sk-code/references/router/"
      - ".opencode/skills/sk-code/SKILL.md"
      - ".opencode/skills/sk-code/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "codex-2026-05-05"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: sk-code Cross-Reference and Metadata Sync

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown documentation, JSON metadata, JavaScript JSDoc comments |
| **Framework** | sk-code skill reference/asset metadata |
| **Storage** | Repository files only |
| **Testing** | Spec-kit strict validation, grep audits, skill graph scan/validation |

### Overview
Packet 3 links existing Webflow Motion mentions to the new cross-stack `motion_dev/` package, updates the current sk-code router/resource documentation, refreshes skill metadata, and records the parent packet in the changelog.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Parent phase spec read.
- [x] Packet 1 and Packet 2 docs read for style and ownership boundaries.
- [x] Case-insensitive dispatch grep run against Webflow references/assets.
- [x] Router docs, SKILL.md, README.md, description.json, graph-metadata.json, and changelog convention read.

### Definition of Done
- [x] Every grep-discovered Webflow Motion file has an additive `motion_dev/` pointer.
- [x] SKILL.md, README.md, description.json, and router docs consistently expose `motion_dev/`.
- [x] Skill `graph-metadata.json` was refreshed and indexed; derived sync rejected instruction-shaped generated trigger values, so graph discoverability was repaired with conservative Motion-specific metadata.
- [x] Changelog entry for parent packet 069 exists.
- [x] Child and parent strict validation exit 0.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Use the existing narrative router model:
- SKILL.md defines supported surfaces and resource domains.
- README.md provides the structure inventory.
- `references/router/*.md` documents detection, intent, resource loading, and lifecycle.
- Skill `description.json` and derived graph metadata provide advisor discoverability.

### Key Components
- **Webflow cross-refs**: Add local "See also" pointers near Motion sections or single mentions.
- **Router metadata**: Add `motion_dev/` as a cross-stack animation resource loaded for Motion/API/decision work.
- **Skill metadata**: Add motion.dev/cross-stack keywords and trigger examples without dropping existing Webflow or OpenCode signals.
- **Changelog**: Summarize Packets 1-3 under spec 069.

### Data Flow
A user asks for Motion API/integration guidance. sk-code routes code work as usual, then resource loading can direct cross-stack Motion questions to `references/motion_dev/` while keeping Webflow CDN/Designer guidance in `references/webflow/`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm write scope and main branch.
- [x] Read target files before editing.
- [x] Re-grep Webflow Motion mentions.
- [x] Audit router/manifest mechanism.

### Phase 2: Core Implementation
- [x] Create Packet 3 planning docs.
- [x] Patch 10 Webflow Markdown docs with additive pointers.
- [x] Patch `wait_patterns.js` JSDoc with an additive pointer.
- [x] Update SKILL.md, README.md, description.json, and router docs.
- [x] Add changelog entry.

### Phase 3: Verification
- [x] Refresh derived skill graph metadata safely.
- [x] Run child strict validation.
- [x] Run cross-ref grep audits.
- [x] Run parent strict validation.
- [x] Record implementation summary and checklist evidence.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Template validation | Packet 3 docs and parent phase integration | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh ... --strict` |
| Cross-ref audit | Motion mention files and `motion_dev/` pointer coverage | `grep -ril`, `grep -rl`, `wc -l` |
| Metadata refresh | Skill graph derived block and index health | derived sync script, `skill_graph_scan`, `skill_graph_validate` |
| Scope review | No Packet 1/2-owned content edited | `git status --short`, changed-file review |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Packet 2 `motion_dev/` docs/assets | Internal docs/assets | Green | Cross-links would have no targets |
| Existing Webflow references | Internal docs/assets | Green | Cross-ref placement depends on current mentions |
| Derived metadata sync | Internal tooling | Green if runnable | Graph metadata refresh would otherwise be documented as skipped |
| Spec-kit validator | Internal script | Green | Cannot claim packet validation without it |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: cross-ref audit fails after remediation, metadata tooling corrupts skill metadata, or strict validation cannot pass.
- **Procedure**: revert only Packet 3-created docs and Packet 3 metadata/cross-reference edits; leave Packet 1 playbook and Packet 2 `motion_dev/` folders untouched.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Source reads -> Cross-reference patches -> Metadata/router refresh -> Validation
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Source reads | None | All edits |
| Cross-reference patches | Source reads | Cross-ref audit |
| Metadata/router refresh | Source reads | Skill graph refresh |
| Validation | All edits | Completion claim |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Source reads | Medium | 30-60 minutes |
| Cross-reference patches | Medium | 45-90 minutes |
| Metadata/router refresh | Medium | 45-90 minutes |
| Verification | Medium | 30-60 minutes |
| **Total** | | **2.5-5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] All Webflow edits are additive.
- [x] No Packet 1 playbook files are modified by Packet 3.
- [x] No Packet 2 `motion_dev/` files are modified by Packet 3.
- [x] Metadata refresh used existing derived sync/indexing, with documented repair for rejected generated trigger values.

### Rollback Procedure
1. Remove only the newly added cross-reference lines from Webflow files.
2. Revert only Packet 3 edits to SKILL.md, README.md, description.json, router docs, graph metadata derived sync output, and changelog.
3. Remove Packet 3 child docs if the packet is cancelled.
4. Re-run strict validation on the parent if docs remain.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A.
<!-- /ANCHOR:enhanced-rollback -->
