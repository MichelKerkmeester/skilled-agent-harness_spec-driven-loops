---
title: "Feature Specification: sk-vision Class S metadata"
description: "Author graph-metadata.json, leaf-manifest.config.json, README, then generate manifests with ci-skill-root-metadata.cjs --fix. Leave vision-runtime empty."
trigger_phrases:
  - "sk-vision graph-metadata"
  - "sk-vision leaf manifest"
  - "sk-vision class S"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-vision/001-sk-vision-fork-of-opencode-senses/002-skill-scaffold/002-metadata-and-manifests"
    last_updated_at: "2026-08-16T07:45:00.000Z"
    last_updated_by: "cursor-grok"
    recent_action: "Authored nested-phase copy pack and L1 suite."
    next_safe_action: "Implement files from this child's spec.md copy pack."
    blockers: []
    key_files:
      - "spec.md"
      - ".opencode/skills/sk-vision/graph-metadata.json"
      - ".opencode/skills/sk-vision/leaf-manifest.config.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-001-sk-vision-fork-of-opencode-senses-002-skill-scaffold-002-metadata-and-manifests"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: sk-vision Class S metadata

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
| **Status** | Complete |
| **Created** | 2026-08-16 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 2 |
| **Predecessor** | 001-skill-md |
| **Successor** | None |
| **Handoff Criteria** | Class S gate clean: hub JSON absent, generated manifests exist, package_skill.py --check exits 0, vision-runtime empty. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of `002-skill-scaffold`.

**Scope Boundary**: JSON identity, README, and generator --fix only. Do not edit SKILL.md unless a generator requires a one-line fix.

**Dependencies**:
- 001-skill-md SKILL.md exists.

**Deliverables**:
- graph-metadata.json, leaf-manifest.config.json, generated leaf-manifest.json and leaf-aliases.json, README.md.

**Changelog**:
- When this phase closes, refresh the matching file in the parent changelog using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
SKILL.md alone is not a legal Class S skill root. Missing graph-metadata and generated manifests fail ci-skill-root-metadata and package_skill.py.

### Purpose
Finish the Class S identity files without copying the dump and without hub JSON.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Write graph-metadata.json and leaf-manifest.config.json from the skeletons
- Write a short operator README
- Run ci-skill-root-metadata.cjs --fix then without --fix
- Run package_skill.py --check
- Prove hub JSON names are absent and vision-runtime is empty

### Out of Scope
- Rewriting SKILL.md triggers — prior child
- Copying context/ — 003
- Host adapters — 004 and 005
- Wrong generators: system-skill-advisor/scripts/ci-skill-root-metadata.cjs or sk-doc/scripts/dist/leaf/generate-manifest.js

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-vision/graph-metadata.json` | Create | Class S identity |
| `.opencode/skills/sk-vision/leaf-manifest.config.json` | Create | Authored manifest config |
| `.opencode/skills/sk-vision/leaf-manifest.json` | Generate | --fix output |
| `.opencode/skills/sk-vision/leaf-aliases.json` | Generate | --fix output |
| `.opencode/skills/sk-vision/README.md` | Create | Operator README |

### Implementer copy pack (follow exactly)

Stop and report if any of these is true: `001-skill-md` is not Complete / SKILL.md missing; you are about to add `description.json`, `mode-registry.json`, `hub-router.json`, or `command-metadata.json`; you are about to populate `vision-runtime/`; you are about to call `system-skill-advisor/scripts/ci-skill-root-metadata.cjs` or `sk-doc/scripts/dist/leaf/generate-manifest.js`.

Filled from `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-graph-metadata-template.json`. `skill_id` MUST equal the folder name `sk-vision`.

#### File 2 — `.opencode/skills/sk-vision/graph-metadata.json`

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

`leafRoots` is `["references"]` only.

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
```

`ls` of the four hub JSON names MUST fail (files absent). Optional equivalent: `node .opencode/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs --write .opencode/skills/sk-vision`.

Close this child with:

```bash
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/sk-vision/001-sk-vision-fork-of-opencode-senses/002-skill-scaffold/002-metadata-and-manifests --strict
```
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | graph-metadata.json skill_id is sk-vision and has no hub registry keys | File exists; no mode-registry keys |
| REQ-002 | Hub JSON absent | ls of the four names fails |
| REQ-003 | Manifests generated by ci-skill-root-metadata.cjs --fix | leaf-manifest.json and leaf-aliases.json exist |
| REQ-004 | package_skill.py --check exits 0 | Command exit 0 |
| REQ-005 | vision-runtime empty | test ! -e or empty |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-P1 | No extra scope | Files outside Files to Change stay untouched |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- [x] Skill root has graph-metadata.json and leaf-manifest.config.json [evidence: `.opencode/skills/sk-vision/graph-metadata.json` and `leaf-manifest.config.json` created; ci exit 0]
- [x] Generated leaf-manifest.json and leaf-aliases.json exist [evidence: `--fix` wrote both under `.opencode/skills/sk-vision/`]
- [x] Hub JSON ls fails [evidence: `ls description.json mode-registry.json hub-router.json command-metadata.json` exit 1]
- [x] ci-skill-root-metadata.cjs without --fix reports no forbidden files [evidence: OK [S] sk-vision, exit 0]
- [x] package_skill.py --check exits 0 [evidence: Result PASS, exit 0]
- [x] This child validate.sh --strict scoped rules pass [evidence: scoped Errors 0 Warnings 0 RESULT PASSED; process exit 2 from repo-wide COMMAND_TREE_PARITY only]
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Authoring hub JSON by copying a parent-hub skill | High | Run ci-skill-root-metadata.cjs before close |
| Risk | Wrong generator path | High | Use sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs --fix |
| Dependency | SKILL.md from prior child | High | Stop if missing |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

### Answered Questions
- **Q**: Hub or standalone? **A**: Standalone Class S.
- **Q**: Exclude from advisor routing? **A**: No unless a later child proves false positives.

### Open Questions
- None.
<!-- /ANCHOR:questions -->
