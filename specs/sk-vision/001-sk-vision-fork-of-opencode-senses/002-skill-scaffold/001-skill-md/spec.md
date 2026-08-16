---
title: "Feature Specification: sk-vision SKILL.md"
description: "Author SKILL.md, WHEN TO USE triggers, reserved paths, and references stub. Do not write Class S JSON in this child."
trigger_phrases:
  - "sk-vision skill md"
  - "sk-vision when to use"
  - "sk-vision reserved paths"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-vision/001-sk-vision-fork-of-opencode-senses/002-skill-scaffold/001-skill-md"
    last_updated_at: "2026-08-16T07:45:00.000Z"
    last_updated_by: "cursor-grok"
    recent_action: "Authored nested-phase copy pack and L1 suite."
    next_safe_action: "Implement files from this child's spec.md copy pack."
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - ".opencode/skills/sk-vision/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-001-sk-vision-fork-of-opencode-senses-002-skill-scaffold-001-skill-md"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: sk-vision SKILL.md

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-08-16 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 2 |
| **Predecessor** | None |
| **Successor** | 002-metadata-and-manifests |
| **Handoff Criteria** | SKILL.md exists with locked triggers, WHEN NOT TO USE, reserved vision-runtime path, and 13 tool names as documentation only. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of `002-skill-scaffold`.

**Scope Boundary**: SKILL.md and references/.gitkeep only. No graph-metadata.json, no leaf manifests, no dump copy.

**Dependencies**:
- 001-research Complete (Class S lock).

**Deliverables**:
- `.opencode/skills/sk-vision/SKILL.md` and `references/.gitkeep`.

**Changelog**:
- When this phase closes, refresh the matching file in the parent changelog using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The workspace has no `sk-vision` skill body, so later children have nowhere to reserve the package path or advisor triggers.

### Purpose
Write SKILL.md with locked WHEN TO USE / WHEN NOT TO USE text and leave vision-runtime empty.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Create `.opencode/skills/sk-vision/SKILL.md` from the File 1 skeleton
- Create `references/.gitkeep`
- Document the 13 `sk_vision_*` names as documentation only

### Out of Scope
- graph-metadata.json, leaf-manifest files, README.md — next child
- Copying `context/` — 003
- `.opencode/plugins/sk-vision.js` or `.pi/extensions/sk-vision.ts`
- GPU download or inventing `sk_vision_query`

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-vision/SKILL.md` | Create | Advisor skill body |
| `.opencode/skills/sk-vision/references/.gitkeep` | Create | Leaf root stub |

### Implementer copy pack (follow exactly)

Stop and report if any of these is true: you are about to write `graph-metadata.json` or leaf manifests (next child); you are about to copy `context/`; you are about to create `.opencode/plugins/sk-vision.js` or `.pi/extensions/sk-vision.ts`; you are about to invent `sk_vision_query`.

```bash
mkdir -p .opencode/skills/sk-vision/references
touch .opencode/skills/sk-vision/references/.gitkeep
```

#### File 1 — `.opencode/skills/sk-vision/SKILL.md`

`package_skill.py --check` requires frontmatter `name`, `description` (single line, no `<` `>`, prefer ≤130 chars), `allowed-tools` as a YAML array, `version` as `X.Y.Z.W`, plus headings `WHEN TO USE`, `SMART ROUTING`, `HOW IT WORKS` (or `HOW TO USE`), `RULES`, `REFERENCES`.

Write this file verbatim. The SMART ROUTING python block is part of SKILL.md; copy it as a fenced python block inside SKILL.md.

~~~~
---
name: sk-vision
description: "Local vision for text-only models: OCR, inspect, and detect on screenshots and mockups via Moondream."
allowed-tools: [Read, Bash]
version: 0.1.0.0
---

<!-- Keywords: screenshot OCR, attached image, mockup, error.png, local vision, moondream, grounded evidence, sk-vision -->

# sk-vision

Local vision skill. Text-only coding models get grounded OCR, layout, detect, and inspect evidence from a local image. The runtime and host adapters land in later children. This file only reserves paths and advisor triggers.

## 1. WHEN TO USE

Use this skill when the primary model is text-only and the user attached or named a local image:

- screenshot OCR
- attached image
- mockup
- error.png
- local vision
- moondream
- grounded evidence

### WHEN NOT TO USE

- The primary model is already multimodal and can see the image itself.
- The ask is audio, video, or documents.
- Publishing under the upstream npm name `opencode-senses`.
- Inventing a tool named `sk_vision_query`. Dump `senses_inspect` without a question already runs caption + scene + OCR together.

## 2. SMART ROUTING

Standalone Class S skill. One workflow mode: `sk-vision`. Leaf root: `references/` only. No `mode-registry.json`. No `hub-router.json`.

| Level | When to load | Resources |
|-------|----------------|-----------|
| ALWAYS | Every invocation | This SKILL.md |
| ON_DEMAND | Explicit request | `references/` markdown if any exists |

```python
from pathlib import Path
SKILL_ROOT = Path(__file__).resolve().parent
INTENT_SIGNALS = {
    "VISION": {
        "weight": 4,
        "keywords": [
            "screenshot OCR", "attached image", "mockup", "error.png",
            "local vision", "moondream", "grounded evidence",
        ],
    },
}
RESOURCE_MAP = {"VISION": []}
UNKNOWN_FALLBACK_CHECKLIST = [
    "Confirm the input is a local image path or attachment",
    "Confirm the primary model is text-only",
    "Do not route audio, video, or document work here",
]
```

## 3. HOW IT WORKS

This child does not copy runtime code and does not register host tools.

Reserved package home (leave empty here): `.opencode/skills/sk-vision/vision-runtime/`

Later OpenCode load path (do not create here): `.opencode/plugins/sk-vision.js` as a real file, not a symlink.

Later Pi load path (do not create here): `.pi/extensions/sk-vision.ts` as a relative symlink to `.opencode/skills/sk-vision/pi/sk-vision.ts`.

Locked tool names (13, implement in 003/004/005): `sk_vision_inspect`, `sk_vision_detect`, `sk_vision_point`, `sk_vision_ocr`, `sk_vision_status`, `sk_vision_segment`, `sk_vision_metadata`, `sk_vision_crop`, `sk_vision_zoom`, `sk_vision_colors`, `sk_vision_diff`, `sk_vision_annotate`, `sk_vision_reverse`.

## 4. RULES

- Class S: author `graph-metadata.json` and `leaf-manifest.config.json`. Generate `leaf-manifest.json` and `leaf-aliases.json` with `ci-skill-root-metadata.cjs --fix`.
- Forbidden at this root: `description.json`, `mode-registry.json`, `hub-router.json`, `command-metadata.json`.
- Do not populate `vision-runtime/` in this child.
- Do not publish as `opencode-senses`.
- Do not add a repo-root `opencode.json` `plugin` array.

## 5. REFERENCES

- Class S analog: `.opencode/skills/sk-git/`
- Contract: `.opencode/skills/sk-doc/sk-create-skill/references/shared/skill-root-metadata-contract.md`
- Read-only dump (not this skill's corpus): `specs/sk-vision/001-sk-vision-fork-of-opencode-senses/context/`
~~~~

Proof:

```bash
test -f .opencode/skills/sk-vision/SKILL.md
test -f .opencode/skills/sk-vision/references/.gitkeep
rg -n "sk_vision_query" .opencode/skills/sk-vision/SKILL.md && exit 1 || true
test ! -e .opencode/skills/sk-vision/vision-runtime
```

Close this child with:

```bash
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/sk-vision/001-sk-vision-fork-of-opencode-senses/002-skill-scaffold/001-skill-md --strict
```
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | SKILL.md exists with seven WHEN TO USE phrases | File contains screenshot OCR, attached image, mockup, error.png, local vision, moondream, grounded evidence |
| REQ-002 | WHEN NOT TO USE covers multimodal, audio/video/docs, upstream npm name, and sk_vision_query | Those four bullets exist |
| REQ-003 | Reserved paths documented | vision-runtime empty path, OpenCode real file, Pi relative symlink named |
| REQ-004 | 13 tool names listed as documentation only | All 13 `sk_vision_*` names present; no host registration |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-P1 | No extra scope | Files outside Files to Change stay untouched |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- [ ] `.opencode/skills/sk-vision/SKILL.md` exists with locked triggers and WHEN NOT TO USE
- [ ] `references/.gitkeep` exists
- [ ] `vision-runtime/` is absent or empty
- [ ] This child `validate.sh --strict` exits 0
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Writing hub JSON or manifests here | High | Stop; those files belong in 002-metadata-and-manifests |
| Risk | Populating vision-runtime | High | Empty-directory check |
| Dependency | 001-research Class S lock | High | Do not start if ADR-001 is open |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

### Answered Questions
- **Q**: Copy dump files here? **A**: No. 003 owns the copy.
- **Q**: Write manifests here? **A**: No. Next child.

### Open Questions
- None.
<!-- /ANCHOR:questions -->
