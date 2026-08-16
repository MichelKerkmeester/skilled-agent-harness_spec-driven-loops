---
title: "Implementation Plan: sk-vision 002 skill scaffold"
description: "Scaffold standalone skill root, author metadata and SKILL.md, and generate leaf documentation manifests."
trigger_phrases:
  - "sk-vision scaffold plan"
  - "sk-vision skill structure"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-vision/001-sk-vision-fork-of-opencode-senses/002-skill-scaffold"
    last_updated_at: "2026-08-15T17:20:00.000Z"
    last_updated_by: "cursor-grok"
    recent_action: "Corrected Class S generator and validator script paths."
    next_safe_action: "Create .opencode/skills/sk-vision/ with SKILL.md and Class S metadata."
    blockers: []
    key_files:
      - "plan.md"
      - "spec.md"
      - ".opencode/skills/sk-vision/SKILL.md"
      - ".opencode/skills/sk-vision/graph-metadata.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-002-scaffold-20260815"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: sk-vision 002 skill scaffold

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, JSON, Node.js (manifest generator) |
| **Framework** | OpenCode Skill System (Class S Standalone) |
| **Storage** | File system metadata |
| **Testing** | `ci-skill-root-metadata.cjs`, `validate.sh` |

### Overview
Create `.opencode/skills/sk-vision/` following Class S standalone conventions. Define routing triggers in `SKILL.md`, construct `graph-metadata.json`, configure `leaf-manifest.config.json`, generate leaf manifests, and ensure strict validator compliance before runtime files are introduced.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Verification Command | Threshold |
|------|----------------------|-----------|
| **Skill Metadata Gate** | `node .opencode/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs --fix` | 0 forbidden files |
| **Package Check** | `python3 .opencode/skills/sk-doc/sk-create-skill/scripts/package_skill.py .opencode/skills/sk-vision --check` | Exit 0 |
| **Packet Validation** | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/sk-vision/001-sk-vision-fork-of-opencode-senses/002-skill-scaffold --strict` | Exit 0 |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

```
.opencode/skills/sk-vision/
├── SKILL.md                  # Primary routing & documentation
├── graph-metadata.json       # Advisor standalone metadata
├── leaf-manifest.config.json # Manifest build configuration
├── leaf-manifest.json        # Generated manifest
├── leaf-aliases.json         # Generated aliases
├── README.md                 # Skill root overview
└── references/               # Reference documents stub
    └── .gitkeep
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## 4. AFFECTED SURFACES

| Surface | Path | Action |
|---------|------|--------|
| **Skill Root** | `.opencode/skills/sk-vision/` | Create directory |
| **Skill Doc** | `.opencode/skills/sk-vision/SKILL.md` | Author |
| **Metadata** | `.opencode/skills/sk-vision/graph-metadata.json` | Author |
| **Manifest Config** | `.opencode/skills/sk-vision/leaf-manifest.config.json` | Author |
| **Generated Manifests** | `.opencode/skills/sk-vision/leaf-*.json` | Generate |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 5. IMPLEMENTATION PHASES

### Phase 1: Setup & Directory Scaffolding
- Create `.opencode/skills/sk-vision/` and `.opencode/skills/sk-vision/references/`.
- Ensure no residual hub files exist.

### Phase 2: Metadata & Documentation Authoring
- Author `SKILL.md` with full frontmatter, trigger keywords, and usage boundaries.
- Author `graph-metadata.json` adhering strictly to standalone Class S schema.
- Author `leaf-manifest.config.json` with `workflowMode: "sk-vision"` and `leafRoots: ["references"]`.
- Generate `leaf-manifest.json` and `leaf-aliases.json` with `ci-skill-root-metadata.cjs --fix` (do not hand-edit).
- Author `README.md`. Leave `vision-runtime/` empty.

### Phase 3: Verification & Alignment
- Run `ci-skill-root-metadata.cjs` and `package_skill.py --check`.
- Confirm hub JSON files are absent.
- Run `validate.sh --strict` on this spec packet.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 6. TESTING STRATEGY

- [ ] Check absence of `description.json`, `mode-registry.json`, `hub-router.json` in skill root.
- [ ] Verify `ci-skill-root-metadata.cjs` passes.
- [ ] Verify `leaf-manifest.json` correctly indexes the skill directory.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 7. DEPENDENCIES

| Dependency | Purpose | Status |
|------------|---------|--------|
| `001-research` | Architecture decisions & ADR-001 | Complete |
| `sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs` | Class S metadata validator / `--fix` | Available |
| `sk-doc/sk-create-skill/scripts/package_skill.py` | Skill package `--check` | Available |
| `sk-git/graph-metadata.json` | Class S analog | Available |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 8. ROLLBACK PLAN

If scaffolding fails or creates illegal state, delete `.opencode/skills/sk-vision/` directory and restore working tree.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## 9. PHASE DEPENDENCIES

- `001-research` -> `002-skill-scaffold` -> `003-runtime-fork`
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## 10. ESTIMATED EFFORT

| Task Group | Effort |
|------------|--------|
| Directory & metadata setup | 15 mins |
| SKILL.md authoring & triggers | 20 mins |
| Manifest generation & validation | 10 mins |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## 11. ENHANCED ROLLBACK PROTOCOL

1. Remove `.opencode/skills/sk-vision` via `rm -rf .opencode/skills/sk-vision`.
2. Confirm the directory is gone with `test ! -e .opencode/skills/sk-vision`.
<!-- /ANCHOR:enhanced-rollback -->
