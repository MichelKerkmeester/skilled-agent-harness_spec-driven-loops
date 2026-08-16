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
    last_updated_at: "2026-08-16T08:35:00.000Z"
    last_updated_by: "cursor-grok"
    recent_action: "006-010 amendment complete; all gates green."
    next_safe_action: "Commit when the operator asks (nothing committed yet)."
    blockers: []
    key_files:
      - "spec.md"
      - "001-research/spec.md"
      - "002-skill-scaffold/001-skill-md/spec.md"
      - "003-runtime-fork/001-copy-shipped-files/spec.md"
      - "004-opencode-adapter/001-plugin-reexport/spec.md"
      - "005-pi-adapter/001-extension-factory/spec.md"
      - "006-skill-contract-realignment/spec.md"
      - "007-pi-input-images/spec.md"
      - "008-feature-catalog/spec.md"
      - "009-manual-testing-playbook/spec.md"
      - "010-quality-gate/spec.md"
      - "context/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-001-parent-20260815"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "001-research is a one-shot Level 3 research child, not a deep-research loop."
      - "The parent stays a lean trio; context/ remains the upstream dump."
      - "002-005 are phase parents; nested L1 children hold implementer copy packs."
      - "006-010 close the standards drift; no npm publishing (publishConfig removed)."
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
| **Status** | Complete |
| **Created** | 2026-08-15 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | None |
| **Parent Packet** | `sk-vision` |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | `001-research` Complete. Nested children under `002-005` Complete. `006-010` amendment Complete: real SKILL.md contract, package hygiene, Pi `input.images`, feature catalog, manual testing playbook, and a green quality gate. Next: commit when the operator asks. |
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
- Amendment `006-010` (only after 002-005 shipped): contract realignment (SKILL.md, README, references, package hygiene), Pi `input.images` auto-inspect parity, canonical feature catalog, manual testing playbook + benchmark scaffold, final quality gate
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
| `002-skill-scaffold/001-skill-md/*` | Create | 002-skill-scaffold/001-skill-md | SKILL.md and references stub (Complete) |
| `002-skill-scaffold/002-metadata-and-manifests/*` | Create | 002-skill-scaffold/002-metadata-and-manifests | Class S JSON and generated manifests (Complete) |
| `003-runtime-fork/001-copy-shipped-files/*` | Create | 003-runtime-fork/001-copy-shipped-files | Locked dump copy (Complete) |
| `003-runtime-fork/002-rebrand-identifiers/*` | Create | 003-runtime-fork/002-rebrand-identifiers | Identifier rewrite (Complete) |
| `003-runtime-fork/003-build-and-tests/*` | Create | 003-runtime-fork/003-build-and-tests | dist/plugin.js and tests (Complete) |
| `003-runtime-fork/004-gpu-smoke/*` | Create | 003-runtime-fork/004-gpu-smoke | load then status, or SKIP (Complete) |
| `004-opencode-adapter/001-plugin-reexport/*` | Create | 004-opencode-adapter/001-plugin-reexport | Regular-file plugin re-export (Complete) |
| `004-opencode-adapter/002-readme-and-proof/*` | Create | 004-opencode-adapter/002-readme-and-proof | README row and opencode.json proof (Complete) |
| `005-pi-adapter/001-extension-factory/*` | Create | 005-pi-adapter/001-extension-factory | Function default-export factory (Complete) |
| `005-pi-adapter/002-symlink-and-dry-factory/*` | Create | 005-pi-adapter/002-symlink-and-dry-factory | Relative symlink and dry factory (Complete) |
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
| `.opencode/skills/sk-vision/SKILL.md` | Rewrite | 006-skill-contract-realignment/001-skill-md-and-readme | Executable contract, not scaffold stub |
| `.opencode/skills/sk-vision/README.md` | Rewrite | 006-skill-contract-realignment/001-skill-md-and-readme | Accurate layout, quick start, env vars |
| `.opencode/skills/sk-vision/references/runtime-reference.md` | Create | 006-skill-contract-realignment/001-skill-md-and-readme | Env vars, JSON-RPC protocol, tool semantics |
| `.opencode/skills/sk-vision/vision-runtime/package.json` | Modify | 006-skill-contract-realignment/002-package-hygiene | Neutralize publishConfig/provenance |
| `.opencode/skills/sk-vision/vision-runtime/.venv` | Delete | 006-skill-contract-realignment/002-package-hygiene | 22MB python3.9 residue; tests must stay hermetic |
| `.opencode/skills/sk-vision/pi/sk-vision.ts` | Modify | 007-pi-input-images | `input.images` bounded auto-inspect |
| `.opencode/skills/sk-vision/feature-catalog/**` | Create | 008-feature-catalog | Canonical capability inventory |
| `.opencode/skills/sk-vision/manual-testing-playbook/**` | Create | 009-manual-testing-playbook | Operator scenario corpus |
| `.opencode/skills/sk-vision/benchmark/**` | Create | 009-manual-testing-playbook | Run-index scaffold (`reports/README.md`) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children. This parent stays a lean trio: `spec.md`, `description.json`, `graph-metadata.json`.

**Directory status:** `001-research/` is Complete. `002-skill-scaffold/`, `003-runtime-fork/`, `004-opencode-adapter/`, `005-pi-adapter/`, and `006-skill-contract-realignment/` are phase parents. Each has nested Level 1 children that hold the implementer copy packs. `007-pi-input-images/`, `008-feature-catalog/`, `009-manual-testing-playbook/`, and `010-quality-gate/` are leaf phases with their own suites. Do not implement from this parent or from a mid-level parent spec.

**Amendment context (006-010):** 002-005 shipped and passed their gates (build, tests, GPU load smoke, plugin re-export, Pi dry factory), but the shipped skill drifted from sk-create-skill standards: `SKILL.md` is still the scaffold stub that says the runtime "lands in later children", `README.md` repeats the stale stub framing, `references/` is empty, `feature-catalog/` and `manual-testing-playbook/` (+ `benchmark/`) do not exist, `vision-runtime/package.json` still carries upstream provenance and a live `publishConfig`, a 22MB `.venv` residue sits in `vision-runtime/`, and the Pi `input.images` auto-inspect gap is recorded but unwired. `SKILL.md` also fails `validate_document.py --type skill` (4 blocking errors). 006-010 close every one of these.

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
11. `006-skill-contract-realignment/001-skill-md-and-readme/spec.md` — real SKILL.md contract, README, references corpus, manifest regen.
12. `006-skill-contract-realignment/002-package-hygiene/spec.md` — package.json provenance, `.venv` removal, hermetic tests, rebuild, sweep.
13. `007-pi-input-images/spec.md` — bounded `input.images` auto-inspect in the Pi factory (2s grace, mirror 004 injector).
14. `008-feature-catalog/spec.md` — feature-catalog package (root + categories + per-feature leaves).
15. `009-manual-testing-playbook/spec.md` — manual-testing-playbook package + `benchmark/` scaffold.
16. `010-quality-gate/spec.md` — every gate re-run, metadata reconciliation, stray-file sweep.

| Phase | Folder | Title / Focus | Level | Status |
|-------|--------|---------------|-------|--------|
| 1 | `001-research/` | Fork, skill-housing, and OpenCode plus Pi adapter feasibility | 3 | Complete |
| 2 | `002-skill-scaffold/` | Class S skill root (nested L1 children) | Phase parent | Complete |
| 3 | `003-runtime-fork/` | Rebranded v0.2.0 JSON-RPC core (nested L1 children) | Phase parent | Complete |
| 4 | `004-opencode-adapter/` | Repo plugin load path (nested L1 children) | Phase parent | Complete |
| 5 | `005-pi-adapter/` | Pi `registerTool` extension (nested L1 children) | Phase parent | Complete |
| 6 | `006-skill-contract-realignment/` | SKILL.md contract + README + references + package hygiene (nested L1 children) | Phase parent | Complete |
| 7 | `007-pi-input-images/` | Bounded `input.images` auto-inspect for Pi parity | 2 | Complete |
| 8 | `008-feature-catalog/` | Canonical feature catalog package | 2 | Complete |
| 9 | `009-manual-testing-playbook/` | Operator scenario corpus + benchmark scaffold | 2 | Complete |
| 10 | `010-quality-gate/` | Full conformance proof + metadata reconciliation | 2 | Complete |

**Nested children (implementer surface):**
- **002:** `001-skill-md/`, `002-metadata-and-manifests/` — Level 1
- **003:** `001-copy-shipped-files/`, `002-rebrand-identifiers/`, `003-build-and-tests/`, `004-gpu-smoke/` — Level 1
- **004:** `001-plugin-reexport/`, `002-readme-and-proof/` — Level 1
- **005:** `001-extension-factory/`, `002-symlink-and-dry-factory/` — Level 1
- **006:** `001-skill-md-and-readme/`, `002-package-hygiene/` — Level 1

MCP/bash/skill-only Pi paths remain fallbacks inside 005, not a new child. Phases 006-010 are the standards-realignment amendment authorized after 002-005 shipped; they add doc-contract, hygiene, Pi input parity, catalog, playbook, and quality-gate work. No phase beyond 010 exists unless the operator opens a new packet.

Housing analog (confirmed): package lives inside the skill, matching `.opencode/skills/sk-communication/cli-communication-projection/`. Skill-root class S matrix (confirmed): author `SKILL.md`, `graph-metadata.json`, `leaf-manifest.config.json`; forbid `description.json`, `mode-registry.json`, `hub-router.json`, `command-metadata.json`; generate `leaf-manifest.json` and `leaf-aliases.json`.

SYNC analog (confirmed by `ls -la`):
- **Pi:** `.pi/extensions/*.ts` are relative symlinks to owner trees (example: `git-preflight-advisory.ts` → `../../.opencode/skills/sk-git/scripts/hooks/pi/git-preflight-advisory.ts`). Author the factory under the skill; symlink into `.pi/extensions/`.
- **OpenCode:** `.opencode/plugins/*.js` are real files that import from the owning skill (example: `mk-communication-projection.js` imports `../skills/sk-communication/cli-communication-projection/dist/index.js`). Repo root `opencode.json` has no `plugin` array. Do not copy `context/opencode.json` over the repo config. Do not assume dump-style `"plugin": ["./src/plugin.ts"]` is this workspace's discovery mechanism.

Tool names (lock so later children do not re-open ADR-003's alias question): `sk_vision_*` only in this workspace. Do not ship `senses_*` aliases. Shipped dump names to map: `inspect`, `detect`, `point`, `ocr`, `status`, `segment`, `metadata`, `crop`, `zoom`, `colors`, `diff`, `annotate`, `reverse`.

GPU (confirmed from `context/README.md`): NVIDIA Ampere or newer, or Apple Silicon (M-series). 6 GB VRAM is enough for default `moondream2`. First vision `load` downloads weights ~3.9 GB from Hugging Face and may provision a venv under `~/.cache/sk-vision/venv`. Do not hide this. GPU smoke lives in **003** (optional, operator-gated). 004/005 attach or tool smokes run only after that smoke, or they record SKIP.

Dump comment drift (confirmed): `python/runtime.py` header mentions Moondream 3.1 Photon; shipped default remains `moondream2` per `package.json` and README. 003 keeps `SK_VISION_MODEL=moondream2` and corrects the copied docstring.

### 001-research (Complete)

Purpose: lock housing, fork baseline, and host adapters. Deliverables are on disk under `001-research/`. Resume: `/speckit:resume specs/sk-vision/001-sk-vision-fork-of-opencode-senses/001-research/`.

### 002-skill-scaffold (Complete phase parent)

**Purpose.** Create `.opencode/skills/sk-vision/` as a standalone class S advisor skill so later children have a legal skill root. Do not copy `context/`.

**Nested children.** `001-skill-md/` writes `SKILL.md` and `references/.gitkeep`. `002-metadata-and-manifests/` writes identity JSON, README, and generated manifests, then proves hub JSON is absent.

**Implementer contract.** `002-skill-scaffold/001-skill-md/spec.md`, then `002-skill-scaffold/002-metadata-and-manifests/spec.md`.

**Depends on.** `001-research` Complete (ADR-001).

### 003-runtime-fork (Complete phase parent)

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

### 004-opencode-adapter (Complete phase parent)

**Purpose.** Put the forked plugin on this repo's OpenCode discovery path. Dump hooks stay in the skill factory: `event`, `chat.message` (2s grace), `tool` (13 names), `dispose` (`client.close()`).

**Nested children.** `001-plugin-reexport/` writes the regular file. `002-readme-and-proof/` adds the README row and proves `opencode.json` has no plugin array.

**Implementer contract.** `004-opencode-adapter/001-plugin-reexport/spec.md`.

**Depends on.** `003-runtime-fork`.

### 005-pi-adapter (Complete phase parent)

**Purpose.** Native Pi vision tools via function default export and `pi.registerTool`. Invalid default export fail-closes the Pi session.

**Nested children.** `001-extension-factory/` authors `.opencode/skills/sk-vision/pi/sk-vision.ts`. `002-symlink-and-dry-factory/` creates the relative symlink and runs `pi --offline --approve`.

**Implementer contract.** `005-pi-adapter/001-extension-factory/spec.md`.

**Depends on.** `003-runtime-fork`. `004-opencode-adapter` is not a code dependency; run 005 after 004 so tool names and evidence tags stay aligned.

### 006-skill-contract-realignment (Planned phase parent)

**Purpose.** Bring the shipped skill into conformance with sk-create-skill standards: `SKILL.md` as the executable contract (not the scaffold stub), accurate `README.md`, a real `references/` corpus, and package hygiene in `vision-runtime/`.

**Nested children.** `001-skill-md-and-readme/` rewrites `SKILL.md` + `README.md` and authors `references/runtime-reference.md`, then regenerates leaf manifests. `002-package-hygiene/` neutralizes `package.json` publish/provenance, deletes the `.venv` residue, proves tests are hermetic, rebuilds `dist/`, and sweeps residual identifiers.

**Implementer contract.** `006-skill-contract-realignment/001-skill-md-and-readme/spec.md`.

**Depends on.** 002-005 shipped (satisfied). `002-package-hygiene` depends on `001-skill-md-and-readme` only for manifest regeneration ordering; the two may otherwise be implemented in sequence without waiting.

### 007-pi-input-images (Planned leaf phase)

**Purpose.** Close the recorded P1 gap: Pi `on("input")` with `event.images` performs a bounded 2s-grace preload and injects sk-vision evidence via `action: "transform"`, mirroring the OpenCode `AttachmentInjector` so Pi users get the same auto-inspect behavior on attached images.

**Depends on.** 005-pi-adapter (factory exists), 006 (docs reflect the change). Run after 006 so the skill contract documents the new hook in the same amendment.

### 008-feature-catalog (Planned leaf phase)

**Purpose.** Author the canonical `feature-catalog/` package per sk-create-feature-catalog: root catalog + category folders + one per-feature file per tool/runtime/adapter, each with source anchors and validation anchors. Categories: `scene-understanding/`, `pixel-analysis/`, `system-health/`, `host-adapters/`, `runtime-core/`.

**Depends on.** 006 + 007 (catalog describes shipped behavior only).

### 009-manual-testing-playbook (Planned leaf phase)

**Purpose.** Author the `manual-testing-playbook/` package per sk-create-manual-testing-playbook (root index + per-feature scenario files, feature IDs `VSN-001+`), scaffold the `benchmark/` run-index (`README.md` + `reports/README.md`), and run the operator-contract validator. Optional bounded live execution: run a subset of scenarios against the warm model cache and persist PASS/SKIP evidence through `run-manual-playbook-scenario.cjs`; SKIP with a named blocker is acceptable.

**Depends on.** 008 (playbook cross-links catalog entries).

### 010-quality-gate (Planned leaf phase)

**Purpose.** Prove perfect alignment: re-run every skill gate (`validate_skill_package.py`, `ci-skill-root-metadata.cjs`, `validate_document.py` on every authored doc, DQI via `extract_structure.py`, advisor smoke, `package_skill.py --check`), run `validate.sh --recursive --strict` on the whole packet, reconcile stale continuity metadata (002-001 completion, parent `last_active_child_id`), and sweep for stray files.

**Depends on.** 006-009 complete.

### Phase Transition Rules

- `001`-`005` spec folders exist on disk and are Complete. Implement `006-skill-contract-realignment/001-skill-md-and-readme` next; do not start `007` until 006's gates are clean, and do not start `008` before `007`, `009` before `008`, or `010` before `009`.
- Each nested child MUST pass `validate.sh --strict` independently before the next child's **implementation** starts.
- Parent spec tracks aggregate progress via this map. Mid-level 002-006 stay lean trios. Heavy plans, tasks, checklists, and ADRs stay in nested children.
- Resume the active nested child: `/speckit:resume specs/sk-vision/001-sk-vision-fork-of-opencode-senses/006-skill-contract-realignment/001-skill-md-and-readme/` until that child closes.
- Run `validate.sh --recursive --strict` on the parent after every child-phase status change.
- Do not download Hugging Face weights in 001 or 002. Optional GPU `load` smoke is `003-runtime-fork/004-gpu-smoke` only.
- Do not add hub metadata on `.opencode/skills/sk-vision/`.
- Do not publish as `opencode-senses`; 006-002 neutralizes the fork's `publishConfig` unless the operator explicitly wants npm publishing.
- Skill owns source. `.opencode/plugins/` and `.pi/extensions/` are load paths only (OpenCode: real JS adapter file; Pi: relative symlink).
- 006-010 must not modify `context/` and must not rewrite published child history; they amend forward.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-research | 002-skill-scaffold/001-skill-md | ADRs 001-004 accepted; nested children exist; class S and host contracts locked | `001-research` `validate.sh --strict` exit 0 (satisfied). Implement from `002-skill-scaffold/001-skill-md/spec.md`. |
| 002-skill-scaffold | 003-runtime-fork/001-copy-shipped-files | Class S skill root exists; forbidden hub JSON absent; SKILL.md triggers and reserved `vision-runtime/` path documented | Nested 002 children `validate.sh --strict` exit 0; `ci-skill-root-metadata.cjs`; `package_skill.py --check` |
| 003-runtime-fork | 004-opencode-adapter/001-plugin-reexport | Rebranded core and plugin factory importable; MIT Adarsh line kept; identifier inventory clean | Nested 003 children `validate.sh --strict` exit 0; dump tests pass; optional GPU: RPC `load` then `status` (SKIP allowed) |
| 004-opencode-adapter | 005-pi-adapter/001-extension-factory | `.opencode/plugins/sk-vision.js` loads; 13 `sk_vision_*` tools register; auto-inspect respects 2s grace | Nested 004 children `validate.sh --strict` exit 0; plugin inventory row present; GPU attach smoke only if 003 `load` ran |
| 005-pi-adapter | Parent remaining work | Pi factory valid; symlink in `.pi/extensions/`; tools registered; optional `input.images` hook bounded | Nested 005 children `validate.sh --strict` exit 0; `pi --offline --approve` starts without extension fail-closed; then parent recursive `--strict` |
| 006-skill-contract-realignment | 007-pi-input-images | SKILL.md is the real contract (tools, env vars, adapters, SUCCESS CRITERIA); README accurate; references corpus present; package.json neutralized; no `.venv`; tests hermetic; manifests regenerated | Nested 006 children `validate.sh --strict` exit 0; `validate_document.py --type skill` exit 0; `ci-skill-root-metadata.cjs` OK; `rg` sweep clean; `bun run build && bun test` pass |
| 007-pi-input-images | 008-feature-catalog | Pi `on("input")` handler injects bounded evidence for `event.images`; README gap note removed; session-safe (never blocks, never raises) | `007` `validate.sh --strict` exit 0; `pi --offline --approve` exit 0; `rg 'on("input")'` present; `.pi/extensions/README.md` no longer claims the P1 gap |
| 008-feature-catalog | 009-manual-testing-playbook | Root catalog + per-feature files with source and validation anchors; parity between root and leaves | `validate_catalog_package.cjs` exit 0; `validate_document.py` on root + leaves clean; `008` `validate.sh --strict` exit 0 |
| 009-manual-testing-playbook | 010-quality-gate | Playbook root + per-feature scenarios; `benchmark/` run-index scaffold; deterministic prompts and PASS/FAIL/SKIP verdicts | `validate-playbook-package.cjs` exit 0; root `validate_document.py` clean; `009` `validate.sh --strict` exit 0 |
| 010-quality-gate | Parent completion | All gates green; metadata reconciled (stale continuities fixed, `last_active_child_id` current); no stray files | `010` `validate.sh --strict` exit 0; parent `validate.sh --recursive --strict` exit 0; gate outputs recorded in `010` implementation-summary |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None. All 006-010 open questions resolved at closeout: no npm publishing (publishConfig removed in 006-002), real-image proof recorded via 009's live runs (status + ocr reports in `benchmark/reports/`), and `references/` ships `runtime-reference.md`.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Upstream dump**: See `context/`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
