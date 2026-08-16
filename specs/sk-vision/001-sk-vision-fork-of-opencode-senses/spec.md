---
title: "sk-vision: local vision skill forked from OpenCode Senses"
description: "Phase parent for a local-first vision skill that gives text-only coding models grounded image evidence through a shared JSON-RPC runtime, with OpenCode plugin and Pi CLI adapters."
trigger_phrases:
  - "sk-vision"
  - "opencode senses fork"
  - "local vision skill"
  - "pi vision adapter"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-vision/001-sk-vision-fork-of-opencode-senses"
    last_updated_at: "2026-08-16T06:28:08.000Z"
    last_updated_by: "cursor-grok"
    recent_action: "Aligned 002-005 plans, tasks, checklists, and summaries."
    next_safe_action: "Implement 002-skill-scaffold from its child spec."
    blockers: []
    key_files:
      - "spec.md"
      - "001-research/spec.md"
      - "002-skill-scaffold/spec.md"
      - "003-runtime-fork/spec.md"
      - "004-opencode-adapter/spec.md"
      - "005-pi-adapter/spec.md"
      - "context/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-001-parent-20260815"
      parent_session_id: null
    completion_pct: 20
    open_questions: []
    answered_questions:
      - "001-research is a one-shot Level 3 research child, not a deep-research loop."
      - "The parent stays a lean trio; context/ remains the upstream dump."
      - "Child phases 002-005 spec suites are scaffolded on disk."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X→Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: sk-vision local vision skill

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | Phase parent |
| **Priority** | P0 |
| **Status** | In Progress |
| **Created** | 2026-08-15 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | None |
| **Parent Packet** | `sk-vision` |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | `001-research` is Complete, child phase spec suites `002-005` are scaffolded on disk. Next: implement `002-skill-scaffold`. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Text-only coding models in OpenCode and Pi cannot read screenshots, mockups, or error images. OpenCode Senses already solves that for OpenCode with a local Moondream runtime, but this workspace needs a first-party skill, a rebranded fork, and a Pi adapter.

### Purpose
Deliver `sk-vision` as a standalone skill that owns a host-agnostic vision runtime and thin adapters for OpenCode and Pi, so either CLI can attach an image and receive guarded, source-grounded evidence.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Upstream dump under `context/` as the fork source (OpenCode Senses v0.2.0, default `moondream2`)
- Research lock in `001-research/` (Complete)
- Later children, created only after the prior child closes: standalone skill, in-skill runtime fork, OpenCode plugin load path, Pi extension load path
- Dual-host vision for text-only models: OCR, inspect, detect, and the other shipped image tools, via one JSON-RPC core

### Out of Scope
- Audio, video, and document pipelines from `context/PLAN.md`
- Publishing an npm package named `opencode-senses`
- Hub metadata on the skill root (`description.json`, `mode-registry.json`, `hub-router.json`)
- GPU weight download or live inference in `001-research/` or `002-skill-scaffold/`
- Scaffolding `002-005` directories in the research child
- MCP, bash-CLI, or SKILL.md-only Pi paths as the primary adapter (fallbacks only)

### Files to Change
Summary of aggregate file scope. Per-phase detail lives in the Phase Documentation Map briefs and child spec suites.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `001-research/*` | Modify | 001-research | Feasibility, ADRs, verification (Complete) |
| `002-skill-scaffold/*` | Create | 002-skill-scaffold | Spec suite & skill scaffold (Planned) |
| `003-runtime-fork/*` | Create | 003-runtime-fork | Spec suite & runtime fork (Planned) |
| `004-opencode-adapter/*` | Create | 004-opencode-adapter | Spec suite & plugin adapter (Planned) |
| `005-pi-adapter/*` | Create | 005-pi-adapter | Spec suite & Pi extension (Planned) |
| `context/**` | Read only | all | Upstream dump. Do not edit. |
| `.opencode/skills/sk-vision/SKILL.md` | Create | 002-skill-scaffold | Advisor skill body and WHEN TO USE triggers |
| `.opencode/skills/sk-vision/graph-metadata.json` | Create | 002-skill-scaffold | Class S identity (`skill_id`: `sk-vision`) |
| `.opencode/skills/sk-vision/leaf-manifest.config.json` | Create | 002-skill-scaffold | Class S authored manifest config |
| `.opencode/skills/sk-vision/leaf-manifest.json` | Generate | 002-skill-scaffold | `ci-skill-root-metadata.cjs --fix` |
| `.opencode/skills/sk-vision/leaf-aliases.json` | Generate | 002-skill-scaffold | Identity projection of the manifest |
| `.opencode/skills/sk-vision/README.md` | Create | 002-skill-scaffold | Operator-facing skill README |
| `.opencode/skills/sk-vision/references/` | Create | 002-skill-scaffold | Routed corpus stub |
| `.opencode/skills/sk-vision/vision-runtime/` | Create | 003-runtime-fork | Forked package (`package.json`, `src/`, `python/`, tests, LICENSE) |
| `.opencode/plugins/sk-vision.js` | Create | 004-opencode-adapter | OpenCode auto-discovered load path (real file, thin import) |
| `.opencode/plugins/README.md` | Modify | 004-opencode-adapter | Inventory row for the new plugin |
| `.opencode/skills/sk-vision/pi/sk-vision.ts` | Create | 005-pi-adapter | Owner-tree `ExtensionFactory` |
| `.pi/extensions/sk-vision.ts` | Create | 005-pi-adapter | Relative symlink to the owner file |
| `.pi/extensions/README.md` | Modify | 005-pi-adapter | Symlink inventory row |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children. This parent stays a lean trio: `spec.md`, `description.json`, `graph-metadata.json`.

**Directory status:** all 5 child phase folders (`001-research/`, `002-skill-scaffold/`, `003-runtime-fork/`, `004-opencode-adapter/`, `005-pi-adapter/`) exist on disk with validated spec suites. Implementation proceeds sequentially from 002 through 005.

| Phase | Folder | Title / Focus | Level | Status |
|-------|--------|---------------|-------|--------|
| 1 | `001-research/` | Fork, skill-housing, and OpenCode plus Pi adapter feasibility | 3 | Complete |
| 2 | `002-skill-scaffold/` | Standalone class S skill identity and advisor metadata | 2 | Planned |
| 3 | `003-runtime-fork/` | Rebranded v0.2.0 JSON-RPC core inside the skill package | 3 | Planned |
| 4 | `004-opencode-adapter/` | Repo plugin load path and attachment auto-inspect | 2 | Planned |
| 5 | `005-pi-adapter/` | Pi `registerTool` extension and optional image `input` hook | 2 | Planned |

**Level justification (blast radius, not gold-plating):**
- **002 = Level 2:** new skill root plus class S QA. Bounded file set, no runtime copy, no GPU. Checklist is required because a hub JSON mistake fails `ci-skill-root-metadata`.
- **003 = Level 3:** copies the dumped `src/` and `python/` trees, rewrites env/cache/package/evidence identifiers, keeps MIT copyright, and owns the GPU provision path. Architecture and injection-guard live here.
- **004 = Level 2:** thin OpenCode load-path adapter over the already-forked `plugin.ts`. Core and `<SK-VISION>` guards ship in 003. Unknown published `@opencode-ai/plugin` `.d.ts` stays labeled unknown unless this child installs the package.
- **005 = Level 2:** thin Pi factory over the same core. Fail-closed invalid exports are a verification item, not a new architecture. Optional auto-inspect copies the dumped 2s grace; it does not reopen ADR-003.

No sixth phase. MCP/bash/skill-only Pi paths remain fallbacks inside 005, not a new child.

Housing analog (confirmed): package lives inside the skill, matching `.opencode/skills/sk-communication/cli-communication-projection/`. Skill-root class S matrix (confirmed): author `SKILL.md`, `graph-metadata.json`, `leaf-manifest.config.json`; forbid `description.json`, `mode-registry.json`, `hub-router.json`, `command-metadata.json`; generate `leaf-manifest.json` and `leaf-aliases.json`.

SYNC analog (confirmed by `ls -la`):
- **Pi:** `.pi/extensions/*.ts` are relative symlinks to owner trees (example: `git-preflight-advisory.ts` → `../../.opencode/skills/sk-git/scripts/hooks/pi/git-preflight-advisory.ts`). Author the factory under the skill; symlink into `.pi/extensions/`.
- **OpenCode:** `.opencode/plugins/*.js` are real files that import from the owning skill (example: `mk-communication-projection.js` imports `../skills/sk-communication/cli-communication-projection/dist/index.js`). Repo root `opencode.json` has no `plugin` array. Do not copy `context/opencode.json` over the repo config. Do not assume dump-style `"plugin": ["./src/plugin.ts"]` is this workspace's discovery mechanism.

Tool names (lock so later children do not re-open ADR-003's alias question): `sk_vision_*` only in this workspace. Do not ship `senses_*` aliases. Shipped dump names to map: `inspect`, `detect`, `point`, `ocr`, `status`, `segment`, `metadata`, `crop`, `zoom`, `colors`, `diff`, `annotate`, `reverse`.

GPU (confirmed from `context/README.md`): NVIDIA Ampere or newer, or Apple Silicon (M-series). 6 GB VRAM is enough for default `moondream2`. First vision `load` downloads weights ~3.9 GB from Hugging Face and may provision a venv under `~/.cache/sk-vision/venv`. Do not hide this. GPU smoke lives in **003** (optional, operator-gated). 004/005 attach or tool smokes run only after that smoke, or they record SKIP.

Dump comment drift (confirmed): `python/runtime.py` header mentions Moondream 3.1 Photon; shipped default remains `moondream2` per `package.json` and README. 003 keeps `SK_VISION_MODEL=moondream2` and corrects the copied docstring.

### 001-research (Complete)

Purpose: lock housing, fork baseline, and host adapters. Deliverables are on disk under `001-research/`. Resume: `/speckit:resume specs/sk-vision/001-sk-vision-fork-of-opencode-senses/001-research/`.

### 002-skill-scaffold (Planned)

**Purpose.** Create `.opencode/skills/sk-vision/` as a standalone class S advisor skill so later children have a legal skill root. Do not copy `context/`. Implementer contract: `002-skill-scaffold/spec.md`.

**In scope.** `SKILL.md` (WHEN TO USE / keyword triggers / WHEN NOT TO USE), `graph-metadata.json`, `leaf-manifest.config.json` with `workflowMode` `sk-vision` and `leafRoots` including `references`, README, references stub, `ci-skill-root-metadata.cjs --fix` under `sk-doc/sk-create-skill/scripts/`. Triggers must cover screenshot OCR, attached image, mockup, error.png, local vision, moondream, grounded evidence. WHEN NOT TO USE: native multimodal primary models; audio/video/docs; publishing upstream's npm name.

**Out of scope.** Hub JSON; `vision-runtime/` source copy; `.opencode/plugins/` or `.pi/extensions/` load files; GPU download; advisor route-exclusion unless a later child proves it is required (sk-communication is excluded for a different product reason).

**Key files to create.** `.opencode/skills/sk-vision/SKILL.md`, `graph-metadata.json`, `leaf-manifest.config.json`, generated `leaf-manifest.json` and `leaf-aliases.json`, `README.md`, `references/` stub. Reserve the path `.opencode/skills/sk-vision/vision-runtime/` in SKILL.md prose. Do not populate it.

**Acceptance / handoff.** Class S gate clean (no forbidden hub files). `python3 .opencode/skills/sk-doc/sk-create-skill/scripts/package_skill.py` check passes. SKILL.md names the future package path and the two host load paths. Handoff to 003 is an empty legal skill root.

**Depends on.** `001-research` Complete (ADR-001).

### 003-runtime-fork (Planned)

**Purpose.** Copy shipped Senses v0.2.0 image pipeline into `.opencode/skills/sk-vision/vision-runtime/` and apply ADR-004. Host-agnostic core: `RuntimeClient` NDJSON plus `python/runtime.py`. OpenCode `src/plugin.ts` and `src/opencode/*` copy with the core so 004 can import them. Pi factory is not this child's load-path work. Implementer contract: `003-runtime-fork/spec.md`.

**In scope.** Copy from `context/` (do not edit `context/`): `src/runtime/client.ts`, `src/providers/types.ts`, `src/providers/photon.ts`, `src/providers/photon.test.ts`, `src/plugin.ts`, `src/opencode/tools.ts`, `src/opencode/attachments.ts`, `src/core/context-builder.ts`, `python/runtime.py`, `python/runtime.test.ts`, `scripts/build.ts`, `package.json`, `tsconfig.json`, `LICENSE`. Keep Adarsh Gourab Mahalik 2026 copyright. Add this project's copyright for modifications. Rewrite identifiers. Keep dump tests after rebrand. Keep bun build unless this child records a `tsc` substitute.

**Out of scope.** `context/PLAN.md` phases 2-4 (audio, video, documents, evidence graph, High Accuracy). GitHub workflows, funding, dump `opencode.json`. npm publish. Wiring `.opencode/plugins/sk-vision.js` or `.pi/extensions/sk-vision.ts` (004/005).

**Rebrand map (implementer lock).**

| Dump | sk-vision |
|------|-----------|
| package name `opencode-senses` | `sk-vision` (do not publish as `opencode-senses`) |
| `SENSES_MODEL` default `moondream2` | `SK_VISION_MODEL` |
| `SENSES_PYTHON` / `SENSES_UV` / `SENSES_DEBUG` / `SENSES_KV_CACHE_PAGES` / `SENSES_DISABLE_AUTO_PROVISION` | `SK_VISION_*` same suffixes |
| `SENSES_CACHE_DIR` `~/.cache/opencode-senses` | `SK_VISION_CACHE_DIR` `~/.cache/sk-vision` |
| `SENSES_VENV_DIR` `~/.cache/opencode-senses/venv` | `SK_VISION_VENV_DIR` `~/.cache/sk-vision/venv` |
| `<SENSES …>` / `</SENSES>` | `<SK-VISION …>` / `</SK-VISION>` (or one stable envelope documented in this child) |
| `SENSES_ERROR` | `SK_VISION_ERROR` |
| `/tmp/senses-<hash>.<ext>` | `/tmp/sk-vision-<hash>.<ext>` |
| `senses_*` tools | `sk_vision_*` |

**GPU smoke (this child, optional).** If NVIDIA Ampere+ or Apple Silicon is present: JSON-RPC `load` then `status` against the copied runtime. First `load` may download ~3.9 GB and provision the venv. If hardware is absent: record SKIP with the hardware note. Packet close does not require GPU. `ping` alone is not the smoke (`load` pulls weights).

**Acceptance / handoff.** Zero residual `SENSES_*`, `opencode-senses`, `~/.cache/opencode-senses`, `<SENSES`, or `senses_` tool keys inside `vision-runtime/` (LICENSE Adarsh line is the exception). Dump tests run. Build emits `dist/plugin.js` (or this child documents the substitute). Handoff to 004/005 is an importable core plus plugin factory.

**Depends on.** `002-skill-scaffold` (skill root exists).

### 004-opencode-adapter (Planned)

**Purpose.** Put the forked plugin on this repo's OpenCode discovery path and restore auto-inspect. Confirmed dump hooks in `context/src/plugin.ts`: `event` (`message.part.updated` fire-and-forget preload), `chat.message` (injector, 2s grace, never full GPU await), `tool` (13 tools: inspect, detect, point, ocr, status, segment, metadata, crop, zoom, colors, diff, annotate, reverse), `dispose` (`client.close()`). Implementer contract: `004-opencode-adapter/spec.md`.

**In scope.** Create `.opencode/plugins/sk-vision.js` as a real file that default-exports the skill package plugin (same pattern as `mk-communication-projection.js` importing skill `dist/`). Update `.opencode/plugins/README.md`. Keep `autoInspect` default on, `enabled`, `python`, `timeoutMs`, `fetchTimeoutMs`, `reverseSearch`. Yandex remains opt-in via the reverse tool / `always` flag.

**Out of scope.** Pi extension. Changing JSON-RPC methods. Installing `@opencode-ai/plugin` only if this child chooses to turn that `[U]` into `[C]`. GPU close requirement when 003 recorded SKIP.

**Key files.** `.opencode/plugins/sk-vision.js`; `.opencode/plugins/README.md`; import target `.opencode/skills/sk-vision/vision-runtime/dist/plugin.js` (or source if this child proves OpenCode loads it). Canonical plugin factory stays in the skill.

**Acceptance / handoff.** OpenCode session loads the plugin from `.opencode/plugins/` without a repo `opencode.json` `plugin` array. Tools register as `sk_vision_*`. Auto-inspect injects a guarded `<SK-VISION>` (or documented envelope) block on image attach, with the dumped 2s cap. GPU attach smoke only if 003 `load` smoke passed; otherwise SKIP. Handoff to 005 is the shared tool-name list, evidence envelope, and RuntimeClient lifecycle.

**Depends on.** `003-runtime-fork`.

### 005-pi-adapter (Planned)

**Purpose.** Native Pi vision tools via `ExtensionFactory` default export, `pi.registerTool(ToolDefinition)`, and optional `pi.on("input")` when `InputEvent.images` is present (ADR-003). Confirmed Pi 0.84.2 types: `registerTool`, `images?: ImageContent[]` with `{type, data, mimeType}`. Confirmed: invalid default export fail-closes the whole Pi session. Implementer contract: `005-pi-adapter/spec.md`.

**In scope.** Author `.opencode/skills/sk-vision/pi/sk-vision.ts`. Symlink `.pi/extensions/sk-vision.ts` → `../../.opencode/skills/sk-vision/pi/sk-vision.ts`. Add a row to `.pi/extensions/README.md`. Register `sk_vision_*` tools that call the same PhotonProvider/RuntimeClient. Optional bounded auto-inspect on `input` (mirror 2s grace; never block the full GPU run). `session_shutdown` should close the client (inferred; prove or document).

**Key files.** `.opencode/skills/sk-vision/pi/sk-vision.ts`; `.pi/extensions/sk-vision.ts` (symlink); `.pi/extensions/README.md`. `.pi/SYNC.md` already describes extensions as owner-authored with discovery under `.pi/extensions/`; a new symlink does not require a new SYNC mechanism.

**Out of scope.** MCP wrapper, bash JSON-RPC, or SKILL.md-only as the primary path. Changing core RPC. Publishing npm.

**Acceptance / handoff.** `pi --offline --approve` starts with the extension loaded (no startup fail-closed). Model sees `sk_vision_*` tools, not only read/bash/edit/write/grep/find/ls. Path-tool execute works when GPU is present; if 003 SKIP, close on registration plus a dry factory test. Auto-inspect is P1: implement the hook with a bounded wait; if live image paste is unproven, record that gap and still close on tools. Parent epic is then ready for operator use on both hosts.

**Depends on.** `003-runtime-fork`. `004-opencode-adapter` is not a code dependency; run 005 after 004 so tool names and evidence tags stay aligned.

### Phase Transition Rules

- `001`-`005` spec folders exist on disk. Implement 002 next; do not start 003 until 002's Class S gate is clean.
- Each phase MUST pass `validate.sh --strict` independently before the next phase's **implementation** starts.
- Parent spec tracks aggregate progress via this map. Parent remains a lean trio. Heavy plans, tasks, checklists, and ADRs stay in children.
- Resume the active child: `/speckit:resume specs/sk-vision/001-sk-vision-fork-of-opencode-senses/002-skill-scaffold/` until 002 closes.
- Run `validate.sh --recursive --strict` on the parent after every child-phase status change.
- Do not download Hugging Face weights in 001 or 002. Optional GPU `load` smoke is 003 only.
- Do not add hub metadata on `.opencode/skills/sk-vision/`.
- Do not publish as `opencode-senses`.
- Skill owns source. `.opencode/plugins/` and `.pi/extensions/` are load paths only (OpenCode: real JS adapter file; Pi: relative symlink).

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-research | 002-skill-scaffold | ADRs 001-004 accepted; child spec suites exist; class S and host contracts locked | `001-research` `validate.sh --strict` exit 0 (satisfied). Implement from `002-skill-scaffold/spec.md`. |
| 002-skill-scaffold | 003-runtime-fork | Class S skill root exists; forbidden hub JSON absent; SKILL.md triggers and reserved `vision-runtime/` path documented | Child `validate.sh --strict` exit 0; `node .opencode/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs` reports no forbidden files on `sk-vision`; `python3 .opencode/skills/sk-doc/sk-create-skill/scripts/package_skill.py .opencode/skills/sk-vision --check` |
| 003-runtime-fork | 004-opencode-adapter | Rebranded core and plugin factory importable; MIT Adarsh line kept; identifier inventory clean | Child `validate.sh --strict` exit 0; dump tests in `vision-runtime/` pass; optional GPU: RPC `load` then `status` (SKIP allowed) |
| 004-opencode-adapter | 005-pi-adapter | `.opencode/plugins/sk-vision.js` loads; 13 `sk_vision_*` tools register; auto-inspect respects 2s grace | Child `validate.sh --strict` exit 0; plugin inventory row present; GPU attach smoke only if 003 `load` ran |
| 005-pi-adapter | Parent remaining work | Pi factory valid; symlink in `.pi/extensions/`; tools registered; optional `input.images` hook bounded | Child `validate.sh --strict` exit 0; `pi --offline --approve` starts without extension fail-closed; then parent `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/sk-vision/001-sk-vision-fork-of-opencode-senses --recursive --strict` |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None for the parent. Remaining GPU-hardware proof is deferred to a later implementation child.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Upstream dump**: See `context/`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
