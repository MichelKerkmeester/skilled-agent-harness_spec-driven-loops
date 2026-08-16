---
title: "Feature Specification: sk-vision 006-001 SKILL.md contract, README, references"
description: "Rewrite .opencode/skills/sk-vision/SKILL.md as the executable contract, fix README.md, author references/runtime-reference.md, regenerate leaf manifests."
trigger_phrases:
  - "sk-vision SKILL.md contract"
  - "sk-vision readme rewrite"
  - "sk-vision runtime reference"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-vision/001-sk-vision-fork-of-opencode-senses/006-skill-contract-realignment/001-skill-md-and-readme"
    last_updated_at: "2026-08-16T12:00:00.000Z"
    last_updated_by: "pi"
    recent_action: "Created 006-001 copy pack."
    next_safe_action: "Implement File 1 (SKILL.md rewrite) from this spec copy pack."
    blockers: []
    key_files:
      - "spec.md"
      - ".opencode/skills/sk-vision/SKILL.md"
      - ".opencode/skills/sk-vision/README.md"
      - ".opencode/skills/sk-vision/references/runtime-reference.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-006-001-skill-md-and-readme"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: sk-vision 006-001 SKILL.md contract, README, references

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
| **Successor** | 002-package-hygiene |
| **Handoff Criteria** | SKILL.md is the real contract and passes `validate_document.py --type skill` (0 errors). README accurate. `references/runtime-reference.md` exists. Manifests regenerated. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of `006-skill-contract-realignment`.

**Scope Boundary**: `.opencode/skills/sk-vision/` docs only. No runtime code changes. No package.json changes (that is 002).

**Dependencies**:
- 002-005 shipped (runtime, plugin, pi factory all on disk).

**Deliverables**:
- `.opencode/skills/sk-vision/SKILL.md` (rewrite)
- `.opencode/skills/sk-vision/README.md` (rewrite)
- `.opencode/skills/sk-vision/references/runtime-reference.md` (create)
- `.opencode/skills/sk-vision/leaf-manifest.json` + `leaf-aliases.json` (regenerate)

**Changelog**:
- When this phase closes, refresh the matching entry in the skill changelog using the parent packet number plus this phase folder name (no changelog exists yet; create `changelog/` only if 002-package-hygiene needs it — otherwise record the change in the implementation-summary).
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`SKILL.md` still says "This file only reserves paths and advisor triggers", "The runtime and host adapters land in later children", and "Reserved package home (leave empty here)" — every one of those statements is false now. `validate_document.py --type skill` reports 4 blocking errors (missing `---` before numbered H2 sections 2-5). `README.md` repeats the stub framing. `references/` is empty.

### Purpose
Make the docs tell the truth about the shipped skill so the advisor, operators, and later phases (008 catalog, 009 playbook) read one consistent contract.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rewrite `.opencode/skills/sk-vision/SKILL.md` per File 1 contract.
- Rewrite `.opencode/skills/sk-vision/README.md` per File 2 contract.
- Author `.opencode/skills/sk-vision/references/runtime-reference.md` per File 3 contract.
- Regenerate `leaf-manifest.json` / `leaf-aliases.json` with `ci-skill-root-metadata.cjs --fix`.

### Out of Scope
- `vision-runtime/package.json` and any runtime code (002-package-hygiene owns those).
- `feature-catalog/`, `manual-testing-playbook/`, `benchmark/` (008/009 own those).
- `context/` (read-only dump).
- Publishing, version bumps, or changelog creation beyond what this child's proofs require.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-vision/SKILL.md` | Rewrite | Executable contract |
| `.opencode/skills/sk-vision/README.md` | Rewrite | Accurate operator README |
| `.opencode/skills/sk-vision/references/runtime-reference.md` | Create | Overflow reference corpus |
| `.opencode/skills/sk-vision/leaf-manifest.json` | Regenerate | Via `--fix` |
| `.opencode/skills/sk-vision/leaf-aliases.json` | Regenerate | Via `--fix` |
| `.opencode/skills/sk-vision/leaf-manifest.config.json` | Modify if needed | Only if `leafRoots` must change (it should stay `references` only) |

### Implementer copy pack (follow exactly)

Stop and report if any of these is true: you are about to edit `vision-runtime/` code or `package.json`; you are about to invent a tool name outside the locked 13; you are about to add hub JSON (`description.json`, `mode-registry.json`, `hub-router.json`, `command-metadata.json`) to the skill root; you are about to claim a gate passed without running it.

**File 1 — `SKILL.md`.** Keep the existing frontmatter contract (`name`, single-line `description`, `allowed-tools: [Read, Bash]` — extend only if the contract needs it, `version: 0.1.0.0` → bump to `0.1.1.0`). Required section order with `---` separators between ALL numbered ALL-CAPS H2 sections:

1. `## 1. WHEN TO USE` — real triggers (screenshot OCR, attached image, mockup, error.png, local vision, moondream, grounded evidence, plus the 13 tool names), WHEN NOT TO USE (multimodal primary model, audio/video/docs, `sk_vision_query` does not exist, publishing as `opencode-senses`).
2. `## 2. SMART ROUTING` — standalone Class S skill, one workflow mode `sk-vision`; resource map: ALWAYS = this SKILL.md; ON_DEMAND = `references/` (list `runtime-reference.md` when present); keep the INTENT_SIGNALS snippet but make `RESOURCE_MAP` name the real reference.
3. `## 3. HOW IT WORKS` — the real pipeline: 13 `sk_vision_*` tools over one JSON-RPC runtime (`RuntimeClient` NDJSON + `python/runtime.py`, Moondream default `moondream2`); model lifecycle (lazy load on first inference, keep warm, `unload`); host adapters: OpenCode plugin `.opencode/plugins/sk-vision.js` (real file re-exporting `vision-runtime/dist/plugin.js`, auto-inspect on attached images with 2s grace), Pi extension `.pi/extensions/sk-vision.ts` (relative symlink to `pi/sk-vision.ts` factory, 13 `pi.registerTool`, shutdown closes client); env vars table (`SK_VISION_MODEL`, `SK_VISION_PYTHON`, `SK_VISION_UV`, `SK_VISION_DEBUG`, `SK_VISION_KV_CACHE_PAGES`, `SK_VISION_DISABLE_AUTO_PROVISION`, `SK_VISION_CACHE_DIR`, `SK_VISION_VENV_DIR`); evidence envelope `<SK-VISION>` / `</SK-VISION>` and `SK_VISION_ERROR` contract; GPU notes (Ampere+/Apple Silicon, ~6GB VRAM, first load downloads ~3.9GB weights).
4. `## 4. RULES` — class S author/generate matrix; forbidden hub JSON; do not invent tools; do not publish as `opencode-senses`; load paths are the only host surfaces; tests/build must stay green.
5. `## 5. SUCCESS CRITERIA` — checklist of this skill's own completion checks (validator gates, tool registration proof, adapter proofs) with evidence columns.

Keep it under 5k words. Move deep detail to File 3.

**File 2 — `README.md`.** Accurate layout table (SKILL.md, graph-metadata.json, leaf-manifest.config.json, generated manifests, references/, vision-runtime/ with src+python+dist, pi/sk-vision.ts, feature-catalog/ and manual-testing-playbook/ marked "later phases" or removed until 008/009 ship), quick start (3 steps: attach image → tool runs → evidence), env-var table, tool list (13), adapter notes, publishing note (do not publish; neutralized in 006-002). Frontmatter per the README template (title, description, version four-part).

**File 3 — `references/runtime-reference.md`.** Frontmatter per skill-reference-template.md (title, description, trigger_phrases, version four-part). Contents: JSON-RPC protocol (methods `ping/status/load/unload/query/caption` + analysis handlers, NDJSON framing, error codes), tool semantics table (13 names → provider method → what it returns), env vars with defaults and cache paths (`~/.cache/sk-vision`, `~/.cache/sk-vision/venv`), model notes (moondream2 default, SK_VISION_MODEL override, weight download), hardware requirements, troubleshooting (model load failure, venv provisioning, GPU memory), and the exact doc strings are NOT to be duplicated — point at `vision-runtime/python/runtime.py` and `src/providers/photon.ts` as the authoritative detail.

**Manifest regeneration.** After File 3 exists, run `node .opencode/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs --fix` and confirm `leaf-manifest.json` lists the new reference leaf.

Close this child with:

```bash
python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .opencode/skills/sk-vision/SKILL.md --type skill
python3 .opencode/skills/sk-doc/sk-create-skill/scripts/package_skill.py .opencode/skills/sk-vision --check
node .opencode/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/sk-vision/001-sk-vision-fork-of-opencode-senses/006-skill-contract-realignment/001-skill-md-and-readme --strict
```
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | SKILL.md is the executable contract | Says what the skill does today; no "later children"/"leave empty" stub language; `---` before every numbered H2; SUCCESS CRITERIA present |
| REQ-002 | `validate_document.py --type skill` clean | exit 0, zero blocking errors |
| REQ-003 | README accurate | Layout table matches disk; no "do not populate" stub claims |
| REQ-004 | references/runtime-reference.md exists | Real content; listed in regenerated leaf-manifest.json |
| REQ-005 | Manifests regenerated | `ci-skill-root-metadata.cjs` exits OK `[S] sk-vision` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-P1 | No scope creep | Files outside Files to Change stay untouched |
| REQ-P2 | Locked tool names preserved | No new `sk_vision_*` names introduced in prose as real tools |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- [ ] SKILL.md passes `validate_document.py --type skill` (0 errors) — record output
- [ ] `package_skill.py --check` PASS — record output
- [ ] `ci-skill-root-metadata.cjs` fleet gate OK for sk-vision — record output
- [ ] `references/runtime-reference.md` present and listed in `leaf-manifest.json`
- [ ] No stub language in SKILL.md or README (grep for `later children`, `leave empty`, `do not populate`)
- [ ] This child `validate.sh --strict` exits 0
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Rewriting SKILL.md breaks advisor intent signals | Medium | Keep `graph-metadata.json` untouched; keep intent keywords in prose |
| Risk | Reference doc goes stale vs runtime | Medium | Anchor detail to source files; do not duplicate docstrings |
| Dependency | Runtime files on disk (002-005) | High | Stop if `vision-runtime/` or `pi/sk-vision.ts` missing |
<!-- /ANCHOR:risks -->
