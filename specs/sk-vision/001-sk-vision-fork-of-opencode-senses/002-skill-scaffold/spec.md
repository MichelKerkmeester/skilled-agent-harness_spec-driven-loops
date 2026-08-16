---
title: "Feature Specification: sk-vision 002 skill scaffold"
description: "Create the standalone Class S skill root at .opencode/skills/sk-vision/ with SKILL.md triggers, graph-metadata.json, leaf-manifest.config.json, and generated manifests. Do not copy the Senses dump."
trigger_phrases:
  - "sk-vision skill scaffold"
  - "sk-vision standalone skill"
  - "sk-vision leaf manifest"
  - "sk-vision class S"
importance_tier: "important"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "sk-vision/001-sk-vision-fork-of-opencode-senses/002-skill-scaffold"
    last_updated_at: "2026-08-16T07:10:00.000Z"
    last_updated_by: "cursor-grok"
    recent_action: "Added implementer copy pack: files, commands, stop rules."
    next_safe_action: "Implement skill root files from the copy pack in spec.md."
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - ".opencode/skills/sk-vision/SKILL.md"
      - ".opencode/skills/sk-vision/graph-metadata.json"
      - ".opencode/skills/sk-vision/leaf-manifest.config.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-002-scaffold-20260815"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Standalone Class S skill root without hub JSON files."
      - "SKILL.md reserves vision-runtime path without populating code in this child."
      - "ci-skill-root-metadata.cjs lives under sk-doc/sk-create-skill, not system-skill-advisor."
---
# Feature Specification: sk-vision 002 skill scaffold

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-08-15 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 2 of 5 |
| **Predecessor** | `001-research` (Complete; ADR-001 locks Class S) |
| **Successor** | `003-runtime-fork` copies dump into reserved `vision-runtime/` |
| **Handoff Criteria** | Class S gate clean. `package_skill.py --check` passes. SKILL.md names the reserved package path and both host load paths. `vision-runtime/` is not populated. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Later children need a legal OpenCode skill root before they can drop a runtime package or host adapters. Without Class S metadata, the Skill Advisor cannot route screenshot and mockup work to `sk-vision`, and `ci-skill-root-metadata.cjs` will fail if anyone adds hub JSON by habit.

### Purpose
Create `.opencode/skills/sk-vision/` as a standalone skill so 003 can copy the runtime into a reserved subdirectory, and so 004/005 can document their load paths from SKILL.md without inventing a parent hub.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Author `.opencode/skills/sk-vision/SKILL.md` with:
  - Frontmatter `name: sk-vision` and keyword triggers: `screenshot OCR`, `attached image`, `mockup`, `error.png`, `local vision`, `moondream`, `grounded evidence`.
  - WHEN TO USE: text-only coding models need OCR, layout, detect, or inspect on a local image.
  - WHEN NOT TO USE: the primary model is already multimodal; the ask is audio, video, or documents; publishing under the upstream npm name `opencode-senses`.
  - Architecture prose that **reserves** `.opencode/skills/sk-vision/vision-runtime/` and names host load paths `.opencode/plugins/sk-vision.js` (real file, 004) and `.pi/extensions/sk-vision.ts` (relative symlink, 005) without creating those files.
- Author `.opencode/skills/sk-vision/graph-metadata.json` with `skill_id: "sk-vision"`, `schema_version: 2`, standalone identity, no hub keys. Analog: `.opencode/skills/sk-git/graph-metadata.json`.
- Author `.opencode/skills/sk-vision/leaf-manifest.config.json` with `workflowMode: "sk-vision"`, `packet: "."`, `leafRoots: ["references"]` only (no unused `assets` / catalog roots).
- Generate `leaf-manifest.json` and `leaf-aliases.json` via `ci-skill-root-metadata.cjs --fix`. Do not hand-edit those two files.
- Author `.opencode/skills/sk-vision/README.md` and a `references/` stub (`.gitkeep` or a short operator note).
- Run Class S checks listed in Success Criteria.

### Out of Scope
- Hub JSON: `description.json`, `mode-registry.json`, `hub-router.json`, `command-metadata.json`.
- Copying `../context/` into `vision-runtime/` (003).
- Creating `.opencode/plugins/sk-vision.js` (004) or `.pi/extensions/sk-vision.ts` (005).
- GPU download, Hugging Face weights, advisor route-exclusion unless a later child proves it is required.

### Files to Change

| File Path | Change Type | Notes |
|-----------|-------------|-------|
| `.opencode/skills/sk-vision/SKILL.md` | Create | Triggers + reserved paths |
| `.opencode/skills/sk-vision/graph-metadata.json` | Create | Class S identity |
| `.opencode/skills/sk-vision/leaf-manifest.config.json` | Create | Authored config |
| `.opencode/skills/sk-vision/leaf-manifest.json` | Generate | `--fix` only |
| `.opencode/skills/sk-vision/leaf-aliases.json` | Generate | `--fix` only |
| `.opencode/skills/sk-vision/README.md` | Create | Operator README |
| `.opencode/skills/sk-vision/references/` | Create | Stub leaf root (`references/.gitkeep` only) |

### Implementer copy pack (follow exactly)

Stop and report if any of these is true: you are about to copy `../context/` into this child; you are about to write `description.json`, `mode-registry.json`, `hub-router.json`, or `command-metadata.json`; you are about to create `.opencode/plugins/sk-vision.js` or `.pi/extensions/sk-vision.ts`; you are about to populate `vision-runtime/` with source; you cannot find `sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs`. Do not invent `generate-manifest.js`. Do not run `/create:skill-parent`.

Analog for Class S shape only: `.opencode/skills/sk-git/` (has `graph-metadata.json` + `leaf-manifest.config.json`, no hub JSON). Do not copy sk-git content.

Work from the repository root. Run these commands in order.

```bash
mkdir -p .opencode/skills/sk-vision/references
touch .opencode/skills/sk-vision/references/.gitkeep
```

Then write the four authored files below with the exact bytes in the skeletons. Then generate manifests. Then prove.

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

#### File 2 — `.opencode/skills/sk-vision/graph-metadata.json`

Filled from `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-graph-metadata-template.json`. `skill_id` MUST equal the folder name `sk-vision`. Do not add `description.json`.

```json
{
  "schema_version": 2,
  "skill_id": "sk-vision",
  "family": "sk-util",
  "category": "utility",
  "deprecated": false,
  "edges": {
    "depends_on": [],
    "enhances": [],
    "siblings": [
      {
        "target": "sk-code",
        "weight": 0.3,
        "context": "vision evidence for text-only coding models"
      }
    ],
    "conflicts_with": [],
    "prerequisite_for": []
  },
  "domains": [
    "vision",
    "ocr",
    "screenshot",
    "mockup",
    "moondream",
    "local-vision"
  ],
  "intent_signals": [
    "screenshot OCR",
    "attached image",
    "mockup",
    "error.png",
    "local vision",
    "moondream",
    "grounded evidence"
  ],
  "derived": {
    "trigger_phrases": [
      "screenshot OCR",
      "attached image",
      "mockup",
      "error.png",
      "local vision",
      "moondream",
      "grounded evidence",
      "sk-vision"
    ],
    "key_topics": [
      "vision",
      "ocr",
      "screenshot",
      "mockup",
      "moondream"
    ],
    "key_files": [
      ".opencode/skills/sk-vision/SKILL.md"
    ],
    "entities": [
      {
        "name": "sk-vision",
        "kind": "skill",
        "path": ".opencode/skills/sk-vision/SKILL.md",
        "source": "derived"
      }
    ],
    "source_docs": [
      "SKILL.md",
      "leaf-manifest.config.json"
    ],
    "causal_summary": "Standalone local-vision skill that routes screenshot OCR, mockup, and error-image work to a later JSON-RPC runtime; it does not own hub routing or multimodal primary models.",
    "created_at": "2026-08-16T07:10:00.000Z",
    "last_updated_at": "2026-08-16T07:10:00.000Z"
  }
}
```

#### File 3 — `.opencode/skills/sk-vision/leaf-manifest.config.json`

`leafRoots` is `["references"]` only. Do not add unused `assets` or catalog roots.

```json
{
  "workflowMode": "sk-vision",
  "packet": ".",
  "leafRoots": ["references"],
  "excludeIndexFiles": true,
  "resourceContractVersion": 1,
  "_note": "Standalone Class S config. references/ is the only routed leaf root. Generate leaf-manifest.json and leaf-aliases.json with ci-skill-root-metadata.cjs --fix. Do not hand-edit those two files."
}
```

#### File 4 — `.opencode/skills/sk-vision/README.md`

Short operator README. State: Class S standalone; runtime lands in `vision-runtime/` in a later child; OpenCode plugin is a real file; Pi extension is a relative symlink; 13 `sk_vision_*` tools; do not publish as `opencode-senses`.

#### Generate (do not hand-edit outputs)

```bash
node .opencode/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs --fix
node .opencode/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs
python3 .opencode/skills/sk-doc/sk-create-skill/scripts/package_skill.py .opencode/skills/sk-vision --check
ls .opencode/skills/sk-vision/{description,mode-registry,hub-router,command-metadata}.json
test ! -e .opencode/skills/sk-vision/vision-runtime
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/sk-vision/001-sk-vision-fork-of-opencode-senses/002-skill-scaffold --strict
```

`ls` of the four hub JSON names MUST fail (files absent). `ci-skill-root-metadata.cjs` without `--fix` must report no forbidden files. Optional equivalent generator: `node .opencode/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs --write .opencode/skills/sk-vision`. Wrong paths: `system-skill-advisor/scripts/ci-skill-root-metadata.cjs`, `sk-doc/scripts/dist/leaf/generate-manifest.js`.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### Functional Requirements
- **REQ-001**: Class S identity: `.opencode/skills/sk-vision/graph-metadata.json` MUST set `skill_id` to `sk-vision` and MUST NOT contain hub registry keys.
- **REQ-002**: Hub prohibition: the skill root MUST NOT contain `description.json`, `mode-registry.json`, `hub-router.json`, or `command-metadata.json`.
- **REQ-003**: Advisor triggers: `SKILL.md` MUST include the seven WHEN TO USE phrases named in Scope, plus WHEN NOT TO USE for native multimodal models, audio/video/docs, and the upstream npm name.
- **REQ-004**: Manifest generation: `leaf-manifest.json` and `leaf-aliases.json` MUST be produced by `node .opencode/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs --fix` (or `generate-leaf-manifest.cjs --write .opencode/skills/sk-vision`). Do not invent a `generate-manifest.js` path.
- **REQ-005**: Path reservation: `SKILL.md` MUST name `.opencode/skills/sk-vision/vision-runtime/` as the future package home and MUST leave that directory empty in this child.
- **REQ-006**: Host load-path documentation: `SKILL.md` MUST name `.opencode/plugins/sk-vision.js` (OpenCode real file) and `.pi/extensions/sk-vision.ts` (Pi relative symlink) as later-child load paths.

### Non-Functional Requirements
- **NFR-001**: `node .opencode/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs` against `.opencode/skills/sk-vision` reports no forbidden files.
- **NFR-002**: `python3 .opencode/skills/sk-doc/sk-create-skill/scripts/package_skill.py .opencode/skills/sk-vision --check` exits 0.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- [ ] `.opencode/skills/sk-vision/SKILL.md` exists with the locked triggers and WHEN NOT TO USE boundaries.
- [ ] Skill root has `graph-metadata.json` and `leaf-manifest.config.json`; generated `leaf-manifest.json` and `leaf-aliases.json` exist.
- [ ] `ls .opencode/skills/sk-vision/{description,mode-registry,hub-router,command-metadata}.json` fails (files absent).
- [ ] `node .opencode/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs` reports no forbidden files on `sk-vision`.
- [ ] `python3 .opencode/skills/sk-doc/sk-create-skill/scripts/package_skill.py .opencode/skills/sk-vision --check` exits 0.
- [ ] `test ! -e .opencode/skills/sk-vision/vision-runtime` or the directory is empty of source.
- [ ] `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/sk-vision/001-sk-vision-fork-of-opencode-senses/002-skill-scaffold --strict` exits 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk / Assumption | Impact | Mitigation |
|-------------------|--------|------------|
| Authoring hub JSON by copying a parent-hub skill | High | Follow sk-git analog; run `ci-skill-root-metadata.cjs` before close |
| Wrong generator script path (`generate-manifest.js` / advisor scripts) | High | Use `sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs --fix` |
| Advisor false-positives on text-only coding | Medium | WHEN NOT TO USE for native multimodal and non-image media |
| Populating `vision-runtime/` early | High | Empty-directory check in Success Criteria |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

### Answered Questions
- **Q**: Hub or standalone?
  - **A**: Standalone Class S (`001-research` ADR-001). Housing analog is `sk-communication` (package inside skill) plus `sk-git` (Class S metadata).
- **Q**: Copy dump files in this child?
  - **A**: No. 003 owns the copy.
- **Q**: Exclude `sk-vision` from advisor routing?
  - **A**: No unless a later child proves false positives. sk-communication is excluded for a different product reason.

### Open Questions
- None.
<!-- /ANCHOR:questions -->
