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
    last_updated_at: "2026-08-16T07:45:00.000Z"
    last_updated_by: "cursor-grok"
    recent_action: "Nested L1 children under 002-005; next is 001-skill-md."
    next_safe_action: "Implement 002-skill-scaffold/001-skill-md from its spec copy pack."
    blockers: []
    key_files:
      - "spec.md"
      - "001-research/spec.md"
      - "002-skill-scaffold/001-skill-md/spec.md"
      - "003-runtime-fork/001-copy-shipped-files/spec.md"
      - "004-opencode-adapter/001-plugin-reexport/spec.md"
      - "005-pi-adapter/001-extension-factory/spec.md"
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
      - "002-005 are phase parents; nested L1 children hold implementer copy packs."
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
| **Handoff Criteria** | `001-research` is Complete. `002-005` are phase parents with nested L1 children. Next: implement `002-skill-scaffold/001-skill-md` from that child's spec copy pack. |
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
| `002-skill-scaffold/001-skill-md/*` | Create | 002-skill-scaffold/001-skill-md | SKILL.md and references stub (Planned) |
| `002-skill-scaffold/002-metadata-and-manifests/*` | Create | 002-skill-scaffold/002-metadata-and-manifests | Class S JSON and generated manifests (Planned) |
| `003-runtime-fork/001-copy-shipped-files/*` | Create | 003-runtime-fork/001-copy-shipped-files | Locked dump copy (Planned) |
| `003-runtime-fork/002-rebrand-identifiers/*` | Create | 003-runtime-fork/002-rebrand-identifiers | Identifier rewrite (Planned) |
| `003-runtime-fork/003-build-and-tests/*` | Create | 003-runtime-fork/003-build-and-tests | dist/plugin.js and tests (Planned) |
| `003-runtime-fork/004-gpu-smoke/*` | Create | 003-runtime-fork/004-gpu-smoke | load then status, or SKIP (Planned) |
| `004-opencode-adapter/001-plugin-reexport/*` | Create | 004-opencode-adapter/001-plugin-reexport | Regular-file plugin re-export (Planned) |
| `004-opencode-adapter/002-readme-and-proof/*` | Create | 004-opencode-adapter/002-readme-and-proof | README row and opencode.json proof (Planned) |
| `005-pi-adapter/001-extension-factory/*` | Create | 005-pi-adapter/001-extension-factory | Function default-export factory (Planned) |
| `005-pi-adapter/002-symlink-and-dry-factory/*` | Create | 005-pi-adapter/002-symlink-and-dry-factory | Relative symlink and dry factory (Planned) |
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

**Directory status:** `001-research/` is Complete. `002-skill-scaffold/`, `003-runtime-fork/`, `004-opencode-adapter/`, and `005-pi-adapter/` are phase parents. Each has nested Level 1 children that hold the implementer copy packs. Do not implement from this parent or from a mid-level parent spec.

**Small-model implementation order.** Do not skip nested children. Open the next Planned child's `spec.md` copy pack.

1. `002-skill-scaffold/001-skill-md/spec.md` — SKILL.md and references stub.
2. `002-skill-scaffold/002-metadata-and-manifests/spec.md` — Class S JSON, `--fix`, empty `vision-runtime/`.
3. `003-runtime-fork/001-copy-shipped-files/spec.md` — locked `cp` list. Do not edit `context/`.
4. `003-runtime-fork/002-rebrand-identifiers/spec.md` — longest-token-first rewrite. Package name `sk-vision`.
5. `003-runtime-fork/003-build-and-tests/spec.md` — `bun run build`, `dist/plugin.js`, tests, `rg` inventory.
6. `003-runtime-fork/004-gpu-smoke/spec.md` — JSON-RPC `load` then `status`, or SKIP. `ping` is not the smoke.
7. `004-opencode-adapter/001-plugin-reexport/spec.md` — regular file `.opencode/plugins/sk-vision.js`.
8. `004-opencode-adapter/002-readme-and-proof/spec.md` — README row; no `opencode.json` plugin array.
9. `005-pi-adapter/001-extension-factory/spec.md` — function default export; 13 `pi.registerTool`.
10. `005-pi-adapter/002-symlink-and-dry-factory/spec.md` — relative symlink; `pi --offline --approve`.

| Phase | Folder | Title / Focus | Level | Status |
|-------|--------|---------------|-------|--------|
| 1 | `001-research/` | Fork, skill-housing, and OpenCode plus Pi adapter feasibility | 3 | Complete |
| 2 | `002-skill-scaffold/` | Class S skill root (nested L1 children) | Phase parent | Planned |
| 3 | `003-runtime-fork/` | Rebranded v0.2.0 JSON-RPC core (nested L1 children) | Phase parent | Planned |
| 4 | `004-opencode-adapter/` | Repo plugin load path (nested L1 children) | Phase parent | Planned |
| 5 | `005-pi-adapter/` | Pi `registerTool` extension (nested L1 children) | Phase parent | Planned |

**Nested children (implementer surface):**
- **002:** `001-skill-md/`, `002-metadata-and-manifests/` — Level 1
- **003:** `001-copy-shipped-files/`, `002-rebrand-identifiers/`, `003-build-and-tests/`, `004-gpu-smoke/` — Level 1
- **004:** `001-plugin-reexport/`, `002-readme-and-proof/` — Level 1
- **005:** `001-extension-factory/`, `002-symlink-and-dry-factory/` — Level 1

No sixth top-level phase. MCP/bash/skill-only Pi paths remain fallbacks inside 005, not a new child.

Housing analog (confirmed): package lives inside the skill, matching `.opencode/skills/sk-communication/cli-communication-projection/`. Skill-root class S matrix (confirmed): author `SKILL.md`, `graph-metadata.json`, `leaf-manifest.config.json`; forbid `description.json`, `mode-registry.json`, `hub-router.json`, `command-metadata.json`; generate `leaf-manifest.json` and `leaf-aliases.json`.

SYNC analog (confirmed by `ls -la`):
- **Pi:** `.pi/extensions/*.ts` are relative symlinks to owner trees (example: `git-preflight-advisory.ts` → `../../.opencode/skills/sk-git/scripts/hooks/pi/git-preflight-advisory.ts`). Author the factory under the skill; symlink into `.pi/extensions/`.
- **OpenCode:** `.opencode/plugins/*.js` are real files that import from the owning skill (example: `mk-communication-projection.js` imports `../skills/sk-communication/cli-communication-projection/dist/index.js`). Repo root `opencode.json` has no `plugin` array. Do not copy `context/opencode.json` over the repo config. Do not assume dump-style `"plugin": ["./src/plugin.ts"]` is this workspace's discovery mechanism.

Tool names (lock so later children do not re-open ADR-003's alias question): `sk_vision_*` only in this workspace. Do not ship `senses_*` aliases. Shipped dump names to map: `inspect`, `detect`, `point`, `ocr`, `status`, `segment`, `metadata`, `crop`, `zoom`, `colors`, `diff`, `annotate`, `reverse`.

GPU (confirmed from `context/README.md`): NVIDIA Ampere or newer, or Apple Silicon (M-series). 6 GB VRAM is enough for default `moondream2`. First vision `load` downloads weights ~3.9 GB from Hugging Face and may provision a venv under `~/.cache/sk-vision/venv`. Do not hide this. GPU smoke lives in **003** (optional, operator-gated). 004/005 attach or tool smokes run only after that smoke, or they record SKIP.

Dump comment drift (confirmed): `python/runtime.py` header mentions Moondream 3.1 Photon; shipped default remains `moondream2` per `package.json` and README. 003 keeps `SK_VISION_MODEL=moondream2` and corrects the copied docstring.

### 001-research (Complete)

Purpose: lock housing, fork baseline, and host adapters. Deliverables are on disk under `001-research/`. Resume: `/speckit:resume specs/sk-vision/001-sk-vision-fork-of-opencode-senses/001-research/`.

### 002-skill-scaffold (Planned phase parent)

**Purpose.** Create `.opencode/skills/sk-vision/` as a standalone class S advisor skill so later children have a legal skill root. Do not copy `context/`.

**Nested children.** `001-skill-md/` writes `SKILL.md` and `references/.gitkeep`. `002-metadata-and-manifests/` writes identity JSON, README, and generated manifests, then proves hub JSON is absent.

**Implementer contract.** `002-skill-scaffold/001-skill-md/spec.md`, then `002-skill-scaffold/002-metadata-and-manifests/spec.md`.

**Depends on.** `001-research` Complete (ADR-001).

### 003-runtime-fork (Planned phase parent)

**Purpose.** Copy shipped Senses v0.2.0 image pipeline into `.opencode/skills/sk-vision/vision-runtime/` and apply the identifier lock. Host-agnostic core: `RuntimeClient` NDJSON plus `python/runtime.py`.

**Nested children.** `001-copy-shipped-files/` copies the locked list. `002-rebrand-identifiers/` rewrites identifiers and holds `decision-record.md`. `003-build-and-tests/` emits `dist/plugin.js`. `004-gpu-smoke/` runs `load` then `status`, or SKIP.

**Implementer contract.** Start at `003-runtime-fork/001-copy-shipped-files/spec.md` after 002 closes.

**Rebrand map (epic lock; execute in `002-rebrand-identifiers`).**

| Dump | sk-vision |
|------|-----------|
| package name `opencode-senses` | `sk-vision` (do not publish as `opencode-senses`) |
| `SENSES_MODEL` default `moondream2` | `SK_VISION_MODEL` |
| `SENSES_PYTHON` / `SENSES_UV` / `SENSES_DEBUG` / `SENSES_KV_CACHE_PAGES` / `SENSES_DISABLE_AUTO_PROVISION` | `SK_VISION_*` same suffixes |
| `SENSES_CACHE_DIR` `~/.cache/opencode-senses` | `SK_VISION_CACHE_DIR` `~/.cache/sk-vision` |
| `SENSES_VENV_DIR` `~/.cache/opencode-senses/venv` | `SK_VISION_VENV_DIR` `~/.cache/sk-vision/venv` |
| `<SENSES …>` / `</SENSES>` | `<SK-VISION …>` / `</SK-VISION>` |
| `SENSES_ERROR` | `SK_VISION_ERROR` |
| `/tmp/senses-<hash>.<ext>` | `/tmp/sk-vision-<hash>.<ext>` |
| `senses_*` tools | `sk_vision_*` |

**Depends on.** `002-skill-scaffold` (skill root exists).

### 004-opencode-adapter (Planned phase parent)

**Purpose.** Put the forked plugin on this repo's OpenCode discovery path. Dump hooks stay in the skill factory: `event`, `chat.message` (2s grace), `tool` (13 names), `dispose` (`client.close()`).

**Nested children.** `001-plugin-reexport/` writes the regular file. `002-readme-and-proof/` adds the README row and proves `opencode.json` has no plugin array.

**Implementer contract.** `004-opencode-adapter/001-plugin-reexport/spec.md`.

**Depends on.** `003-runtime-fork`.

### 005-pi-adapter (Planned phase parent)

**Purpose.** Native Pi vision tools via function default export and `pi.registerTool`. Invalid default export fail-closes the Pi session.

**Nested children.** `001-extension-factory/` authors `.opencode/skills/sk-vision/pi/sk-vision.ts`. `002-symlink-and-dry-factory/` creates the relative symlink and runs `pi --offline --approve`.

**Implementer contract.** `005-pi-adapter/001-extension-factory/spec.md`.

**Depends on.** `003-runtime-fork`. `004-opencode-adapter` is not a code dependency; run 005 after 004 so tool names and evidence tags stay aligned.

### Phase Transition Rules

- `001`-`005` spec folders exist on disk. Implement `002-skill-scaffold/001-skill-md` next; do not start 003 until 002's Class S gate is clean.
- Each nested child MUST pass `validate.sh --strict` independently before the next child's **implementation** starts.
- Parent spec tracks aggregate progress via this map. Mid-level 002-005 stay lean trios. Heavy plans, tasks, checklists, and ADRs stay in nested children.
- Resume the active nested child: `/speckit:resume specs/sk-vision/001-sk-vision-fork-of-opencode-senses/002-skill-scaffold/001-skill-md/` until that child closes.
- Run `validate.sh --recursive --strict` on the parent after every child-phase status change.
- Do not download Hugging Face weights in 001 or 002. Optional GPU `load` smoke is `003-runtime-fork/004-gpu-smoke` only.
- Do not add hub metadata on `.opencode/skills/sk-vision/`.
- Do not publish as `opencode-senses`.
- Skill owns source. `.opencode/plugins/` and `.pi/extensions/` are load paths only (OpenCode: real JS adapter file; Pi: relative symlink).

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-research | 002-skill-scaffold/001-skill-md | ADRs 001-004 accepted; nested children exist; class S and host contracts locked | `001-research` `validate.sh --strict` exit 0 (satisfied). Implement from `002-skill-scaffold/001-skill-md/spec.md`. |
| 002-skill-scaffold | 003-runtime-fork/001-copy-shipped-files | Class S skill root exists; forbidden hub JSON absent; SKILL.md triggers and reserved `vision-runtime/` path documented | Nested 002 children `validate.sh --strict` exit 0; `ci-skill-root-metadata.cjs`; `package_skill.py --check` |
| 003-runtime-fork | 004-opencode-adapter/001-plugin-reexport | Rebranded core and plugin factory importable; MIT Adarsh line kept; identifier inventory clean | Nested 003 children `validate.sh --strict` exit 0; dump tests pass; optional GPU: RPC `load` then `status` (SKIP allowed) |
| 004-opencode-adapter | 005-pi-adapter/001-extension-factory | `.opencode/plugins/sk-vision.js` loads; 13 `sk_vision_*` tools register; auto-inspect respects 2s grace | Nested 004 children `validate.sh --strict` exit 0; plugin inventory row present; GPU attach smoke only if 003 `load` ran |
| 005-pi-adapter | Parent remaining work | Pi factory valid; symlink in `.pi/extensions/`; tools registered; optional `input.images` hook bounded | Nested 005 children `validate.sh --strict` exit 0; `pi --offline --approve` starts without extension fail-closed; then parent recursive `--strict` |
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
