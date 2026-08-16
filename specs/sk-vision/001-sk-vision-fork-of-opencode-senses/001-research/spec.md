---
title: "Feature Specification: sk-vision 001 research"
description: "Lock the fork, skill-housing, and dual-host adapter decisions for sk-vision before any skill or runtime code is written."
trigger_phrases:
  - "sk-vision research"
  - "senses fork feasibility"
  - "pi vision registerTool"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "sk-vision/001-sk-vision-fork-of-opencode-senses/001-research"
    last_updated_at: "2026-08-16T06:28:08.000Z"
    last_updated_by: "cursor-grok"
    recent_action: "Pointed successor at scaffolded 002-005 spec suites."
    next_safe_action: "Implement 002-skill-scaffold from its child spec."
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "research/research.md"
      - "decision-record.md"
      - "../context/src/plugin.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-001-research-20260815"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Standalone skill class S, not a parent hub."
      - "Fork shipped Senses v0.2.0, not the unbuilt PLAN.md roadmap."
      - "Pi adapter uses registerTool plus input.images when present."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: sk-vision 001 research

<!-- SPECKIT_LEVEL: 3 -->

---

## EXECUTIVE SUMMARY

This child decides how to fork OpenCode Senses into a first-party `sk-vision` skill that works in OpenCode and Pi. The locked shape is a standalone skill that contains a host-agnostic JSON-RPC runtime, an OpenCode plugin adapter, and a Pi extension that registers vision tools.

**Key Decisions**: Standalone skill housing (ADR-001), fork shipped v0.2.0 (ADR-002), Pi `registerTool` plus native images (ADR-003), MIT rebrand of env and cache names (ADR-004)

**Critical Dependencies**: Installed Pi 0.84.2 types, upstream dump at `../context/`, OpenCode plugin contract from dumped `plugin.ts`

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-08-15 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 1 of 5 (002-005 Planned; spec suites scaffolded on disk) |
| **Predecessor** | None |
| **Successor** | `002-skill-scaffold`. Class S only: author `SKILL.md` (WHEN TO USE triggers: screenshot OCR, attached image, mockup, local vision, moondream, grounded evidence), `graph-metadata.json` (`skill_id` `sk-vision`), `leaf-manifest.config.json` (`workflowMode` `sk-vision`). Forbid hub `description.json`, `mode-registry.json`, `hub-router.json`. Run `ci-skill-root-metadata.cjs --fix`. Do not copy `../context/`. |
| **Handoff Criteria** | ADRs accepted; 002-005 spec suites exist on disk; implement 002 from its child spec plus this Successor row |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the sk-vision fork specification.

**Scope Boundary**: Research and architecture lock only. No skill scaffold, no runtime rebrand in `.opencode/skills/`, no GPU download.

**Dependencies**:
- Upstream dump: `../context/`
- Pi types: `@earendil-works/pi-coding-agent` 0.84.2
- OpenCode adapter source: `../context/src/plugin.ts`, `../context/src/opencode/`
- Parent Phase Documentation Map: implementer briefs for 002-005 (spec suites now on disk)

**Deliverables**:
- Filled Level 3 spec, plan, tasks, checklist, decision-record, implementation-summary
- `research/research.md` with confirmed versus inferred claims
- Successor contract for `002-skill-scaffold`: class S files and SKILL.md triggers (see Metadata Successor)

**Changelog**:
- When this phase closes, refresh the matching file in `../changelog/` using the parent packet number plus this phase folder name.

**Downstream briefs** (spec suites on disk; full briefs live on `../spec.md` Phase Documentation Map and each child `spec.md`):
- **002-skill-scaffold** (Level 2, Planned): create `.opencode/skills/sk-vision/` as class S (`SKILL.md`, `graph-metadata.json`, `leaf-manifest.config.json`, generated manifest/aliases). No runtime copy, no GPU, no hub JSON. Verify with `ci-skill-root-metadata.cjs` under `sk-doc/sk-create-skill/scripts/` and `package_skill.py --check`.
- **003-runtime-fork** (Level 3, Planned): copy dumped `src/` and `python/` into `.opencode/skills/sk-vision/vision-runtime/`, map `SENSES_*` to `SK_VISION_*`, cache to `~/.cache/sk-vision`, evidence to `<SK-VISION>`, tools to the 13 `sk_vision_*` dump names (inspect through reverse; no `sk_vision_query`). Optional GPU smoke: RPC `load` then `status` on NVIDIA Ampere+ or Apple Silicon (~3.9 GB first download). SKIP allowed. `ping` is not the smoke.
- **004-opencode-adapter** (Level 2, Planned): real file `.opencode/plugins/sk-vision.js` importing skill `dist/plugin.js`; restore `event` / `chat.message` / `tool` / `dispose`; auto-inspect 2s grace. Repo `opencode.json` has no `plugin` array. Analog: `mk-communication-projection.js`.
- **005-pi-adapter** (Level 2, Planned): owner file `.opencode/skills/sk-vision/pi/sk-vision.ts` plus relative symlink `.pi/extensions/sk-vision.ts`; `pi.registerTool` for the same 13 tools; optional bounded `pi.on("input")` when `images` present. Invalid export fail-closes Pi. Analog: `git-preflight-advisory.ts`.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The workspace has an OpenCode Senses source dump but no spec, no skill, and no Pi path. Building adapters without a locked housing and host contract would split the runtime or copy OpenCode APIs into Pi.

### Purpose
Produce a one-shot research pack that names the skill class, the fork baseline, and the OpenCode plus Pi adapter contracts so later children can implement without re-litigating those choices.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Inventory of shipped Senses v0.2.0 versus upstream PLAN.md
- Skill-housing recommendation (standalone versus hub)
- OpenCode plugin hook map
- Pi extension tool and image-attach map from installed types
- MIT rebrand and cache/env rename rules
- Intended later phase list for the parent map

### Out of Scope
- Creating `.opencode/skills/sk-vision/`
- Rewriting `python/runtime.py` or publishing npm
- Audio, video, documents, evidence-graph, High Accuracy
- Live GPU inference or Hugging Face weight download

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Modify | Research requirements and ADRs pointer |
| `plan.md` | Modify | One-shot research execution plan |
| `tasks.md` | Modify | Research tasks |
| `checklist.md` | Create | Verification with evidence |
| `decision-record.md` | Create | Four accepted ADRs |
| `research/research.md` | Create | Full investigation |
| `implementation-summary.md` | Modify | What this research locked |
| `../spec.md` | Modify | Parent phase map |
| `../description.json` | Modify | Parent metadata (scaffolder) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Inventory the dumped Senses runtime | `research/research.md` cites `../context/src/plugin.ts`, `../context/python/runtime.py`, and the 13 tools in `../context/src/opencode/tools.ts` |
| REQ-002 | Separate shipped code from PLAN.md | Research states default model `moondream2` and that audio/video/docs are unbuilt |
| REQ-003 | Recommend skill housing | ADR-001 chooses standalone class S with package-inside-skill, matching `sk-communication`. 002 must author `graph-metadata.json` and `leaf-manifest.config.json` only, then `--fix`; it must not add `description.json`, `mode-registry.json`, or `hub-router.json`. |
| REQ-004 | Confirm Pi custom tools | Research cites `ExtensionAPI.registerTool` and `ToolDefinition` from Pi 0.84.2 `types.d.ts` |
| REQ-005 | Confirm Pi image attach | Research cites `InputEvent.images` and `ImageContent` `{type, data, mimeType}` |
| REQ-006 | Map OpenCode plugin hooks | Research maps `event`, `chat.message`, `tool`, `dispose` from `../context/src/plugin.ts` |
| REQ-007 | Record MIT fork rules | ADR-004 keeps Adarsh copyright and renames `SENSES_*` / cache dirs |
| REQ-008 | Keep parent lean | Parent folder has no `plan.md` / `tasks.md` / `checklist.md`; `context/` remains |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-009 | Rank Pi adapter alternatives | Research ranks registerTool, MCP, bash CLI, skill-only |
| REQ-010 | Name later children | Parent spec Phase Documentation Map lists 002 through 005 with Title/Focus, Level, Planned status, per-phase in/out/files/acceptance, and a 001-to-005 handoff table. This research child did not implement those later children. 002 reads this spec's Metadata Successor plus `002-skill-scaffold/spec.md` for class S files and SKILL.md triggers. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Four ADRs in `decision-record.md` have Status Accepted
- **SC-002**: `research/research.md` marks each load-bearing claim `[C]`, `[I]`, or `[U]`
- **SC-003**: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/sk-vision/001-sk-vision-fork-of-opencode-senses/001-research --strict` exits 0
- **SC-004**: Parent `validate.sh --recursive --strict` exits 0
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Pi 0.84.2 types | Wrong adapter API | Cite installed `types.d.ts` line-level, not Pi docs alone |
| Dependency | Upstream dump completeness | Missing handlers | Inventory `python/runtime.py` method list against tools.ts |
| Risk | OpenCode plugin types not installed locally | Hook names drift | Treat dumped `plugin.ts` as confirmed source; label npm types `[U]` |
| Risk | GPU/VRAM on operator machines | Later children blocked | Defer hardware proof; document 6 GB / Apple Silicon requirement |
| Risk | Auto-inspect latency on Pi `input` | Blocks prompt submit | Mirror Senses: bounded wait, never block the full GPU run |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Research authoring completes without spawning the Python runtime or downloading weights

### Security
- **NFR-S01**: Image text remains untrusted observation in later adapters (keep the injection guard)
- **NFR-S02**: Yandex reverse search stays opt-in; default local-only

### Reliability
- **NFR-R01**: Claims distinguish confirmed file/type evidence from inferred host behavior

---

## 8. EDGE CASES

### Data Boundaries
- Empty image attach: OpenCode injector no-ops; Pi `images` omitted
- Clipboard data URLs: Senses materializes to `/tmp/senses-<hash>.<ext>`; Pi `ImageContent.data` is already in-memory

### Error Scenarios
- Missing `moondream` interpreter: runtime raises `DEPENDENCY_MISSING` / auto-provision
- Invalid Pi extension export: session fail-closed at startup (confirmed by cli-pi pin)
- `upgrade-level.sh` missing addendum files: render L3 templates with `inline-gate-renderer.sh` instead

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 18/25 | Dump plus two host APIs plus skill metadata class |
| Risk | 16/25 | GPU, prompt injection, MIT fork, dual runtime |
| Research | 16/20 | Live type read plus source inventory |
| Multi-Agent | 6/15 | Single authoring session |
| Coordination | 10/15 | Parent lean-trio plus child L3 |
| **Total** | **66/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Pi image auto-inspect blocks `input` | H | M | Bounded transform; tools still work on paths |
| R-002 | Skill class chosen as hub by mistake | M | L | ADR-001 locks class S |
| R-003 | Forking PLAN.md unbuilt work | H | M | ADR-002 locks shipped v0.2.0 |
| R-004 | Publishing under upstream package name | H | L | ADR-004 forbids `opencode-senses` |
| R-005 | GPU unavailable on implementer machine | M | M | Defer smoke test; document hardware |

---

## 11. USER STORIES

### US-001: OpenCode screenshot debug (Priority: P0)

**As a** developer in OpenCode with a text-only model, **I want** attached screenshots converted to OCR and layout evidence, **so that** I can debug UI without a native vision model.

**Acceptance Criteria**:
1. Given the later OpenCode adapter is installed, When I attach `error.png`, Then a guarded evidence block is injected before the model replies

### US-002: Pi screenshot tools (Priority: P0)

**As a** developer in Pi, **I want** `sk_vision_*` tools equivalent to Senses inspect/OCR/detect, **so that** the same local runtime serves both CLIs.

**Acceptance Criteria**:
1. Given the later Pi extension is loaded, When the model calls the inspect tool with a path, Then the JSON-RPC runtime returns a `<SK-VISION>` (or equivalent) evidence block

---

## 12. OPEN QUESTIONS

- None remaining for this child. GPU smoke test belongs to a later implementation child.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Research**: See `research/research.md`
