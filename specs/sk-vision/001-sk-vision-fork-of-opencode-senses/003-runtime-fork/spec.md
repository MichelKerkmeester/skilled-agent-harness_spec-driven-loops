---
title: "Feature Specification: sk-vision 003 runtime fork"
description: "Copy shipped Senses v0.2.0 into .opencode/skills/sk-vision/vision-runtime/, rebrand SENSES_* to SK_VISION_*, keep MIT copyright, emit dist/plugin.js, and optionally smoke GPU load then status."
trigger_phrases:
  - "sk-vision runtime fork"
  - "sk-vision senses fork"
  - "sk-vision rebrand"
  - "sk-vision vision runtime"
importance_tier: "critical"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "sk-vision/001-sk-vision-fork-of-opencode-senses/003-runtime-fork"
    last_updated_at: "2026-08-15T16:55:00.000Z"
    last_updated_by: "cursor-grok"
    recent_action: "Enriched rebrand map, 13-tool lock, and GPU smoke protocol."
    next_safe_action: "Copy shipped dump files into vision-runtime/ after 002 closes."
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "decision-record.md"
      - "../context/src/plugin.ts"
      - "../context/python/runtime.py"
      - "../context/src/opencode/tools.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-003-runtime-20260815"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Fork shipped v0.2.0 files only; do not import unbuilt PLAN.md roadmap."
      - "Complete rebrand from SENSES_* to SK_VISION_* with clean caches."
      - "GPU smoke is RPC load then status; ping alone is not the smoke."
---
# Feature Specification: sk-vision 003 runtime fork

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

Copy the shipped OpenCode Senses v0.2.0 image pipeline into `.opencode/skills/sk-vision/vision-runtime/`. Rebrand every `SENSES_*` identifier, cache path, evidence tag, and `senses_*` tool key. Keep Adarsh Gourab Mahalik 2026 on LICENSE. Build `dist/plugin.js` so 004 can import it. Optional GPU proof is JSON-RPC `load` then `status`; SKIP is allowed.

**Key Decisions**: Fork shipped v0.2.0 only (ADR-002). MIT rebrand with dual copyright (ADR-004). Host-agnostic NDJSON JSON-RPC core. Tools are `sk_vision_*` only; no `senses_*` aliases.

**Critical Dependencies**: Empty Class S skill root from 002. Read-only dump at `../context/`. Bun build unless this child records a `tsc` substitute.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-08-15 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 3 of 5 |
| **Predecessor** | `002-skill-scaffold` |
| **Successor** | `004-opencode-adapter` (import `dist/plugin.js`); `005-pi-adapter` uses the same RuntimeClient |
| **Handoff Criteria** | Identifier inventory clean; dump tests pass after rebrand; `dist/plugin.js` exists or a substitute is documented; GPU `load`/`status` recorded or SKIP with hardware note. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The dump at `../context/` still speaks `SENSES_*`, `~/.cache/opencode-senses`, `<SENSES>`, and `senses_*` tools. Dropping that tree unchanged would collide with any remaining upstream install and would publish the wrong package name. 004 and 005 cannot import a factory that still uses those names.

### Purpose
Land a host-agnostic runtime package inside the skill so OpenCode and Pi adapters share one JSON-RPC daemon, one evidence envelope (`<SK-VISION>`), and one `sk_vision_*` tool list.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Copy these shipped v0.2.0 files from `../context/` (do not edit `context/`):
  - `src/runtime/client.ts`
  - `src/providers/types.ts`
  - `src/providers/photon.ts`
  - `src/providers/photon.test.ts`
  - `src/plugin.ts`
  - `src/opencode/tools.ts`
  - `src/opencode/attachments.ts`
  - `src/core/context-builder.ts`
  - `python/runtime.py`
  - `python/runtime.test.ts`
  - `scripts/build.ts`
  - `package.json`, `tsconfig.json`, `LICENSE`
- Keep OpenCode `src/plugin.ts` and `src/opencode/*` in this package so 004 can import them. Pi factory is not this child's load-path work.
- Apply the rebrand map below. Keep dump tests after identifier rewrite.
- Keep bun build unless this child records a `tsc` substitute and why.
- Correct the copied `python/runtime.py` header: it mentions Moondream 3.1 Photon; shipped default remains `moondream2` per dump `package.json` and README. Set `SK_VISION_MODEL=moondream2`.
- Optional GPU smoke on NVIDIA Ampere+ or Apple Silicon.

### Out of Scope
- `context/PLAN.md` phases 2-4 (audio, video, documents, evidence graph, High Accuracy).
- GitHub workflows, funding files, dump `opencode.json`.
- npm publish. Do not publish as `opencode-senses`.
- Wiring `.opencode/plugins/sk-vision.js` or `.pi/extensions/sk-vision.ts`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-vision/vision-runtime/**` | Create | Forked, rebranded package |

### Rebrand map (implementer lock)

| Dump | sk-vision |
|------|-----------|
| package name `opencode-senses` | `sk-vision` (local package; do not publish as `opencode-senses`) |
| `SENSES_MODEL` default `moondream2` | `SK_VISION_MODEL` |
| `SENSES_PYTHON` / `SENSES_UV` / `SENSES_DEBUG` / `SENSES_KV_CACHE_PAGES` / `SENSES_DISABLE_AUTO_PROVISION` | `SK_VISION_*` same suffixes |
| `SENSES_CACHE_DIR` `~/.cache/opencode-senses` | `SK_VISION_CACHE_DIR` `~/.cache/sk-vision` |
| `SENSES_VENV_DIR` `~/.cache/opencode-senses/venv` | `SK_VISION_VENV_DIR` `~/.cache/sk-vision/venv` |
| `<SENSES …>` / `</SENSES>` | `<SK-VISION …>` / `</SK-VISION>` |
| `SENSES_ERROR` | `SK_VISION_ERROR` |
| `/tmp/senses-<hash>.<ext>` | `/tmp/sk-vision-<hash>.<ext>` |
| `senses_*` tools | `sk_vision_*` (no aliases) |

### Tool names (13, from dump `src/opencode/tools.ts`)

`sk_vision_inspect`, `sk_vision_detect`, `sk_vision_point`, `sk_vision_ocr`, `sk_vision_status`, `sk_vision_segment`, `sk_vision_metadata`, `sk_vision_crop`, `sk_vision_zoom`, `sk_vision_colors`, `sk_vision_diff`, `sk_vision_annotate`, `sk_vision_reverse`.

Do not invent `sk_vision_query`. Dump `senses_inspect` without a question runs caption + scene + OCR together.

### GPU smoke (optional, this child)

If NVIDIA Ampere+ or Apple Silicon is present: JSON-RPC `load` then `status` against the copied runtime. First `load` may download ~3.9 GB from Hugging Face and provision `~/.cache/sk-vision/venv`. `ping` alone is not the smoke. If hardware is absent: record SKIP with the hardware note. Packet close does not require GPU. 6 GB VRAM is enough for default `moondream2`.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Identifier inventory clean | `rg -n 'SENSES_|opencode-senses|~/.cache/opencode-senses|<SENSES|senses_' .opencode/skills/sk-vision/vision-runtime` returns only the LICENSE Adarsh copyright line (if it mentions the upstream name) or zero hits |
| REQ-002 | Shipped file isolation | Only the In Scope file list is copied; PLAN.md roadmap code is omitted |
| REQ-003 | MIT copyright | LICENSE keeps Adarsh Gourab Mahalik 2026 and adds this project's modification notice |
| REQ-004 | Build output | Build emits `.opencode/skills/sk-vision/vision-runtime/dist/plugin.js`, or this child documents a `tsc` substitute |
| REQ-005 | Dump tests after rebrand | Copied TypeScript and Python tests run against `SK_VISION_*` names |
| REQ-006 | Tool keys | `src/opencode/tools.ts` registers the 13 `sk_vision_*` names listed in Scope |
| REQ-007 | Default model | `SK_VISION_MODEL` default is `moondream2`; copied Photon 3.1 docstring is corrected |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | GPU smoke | RPC `load` then `status` on supported hardware, or SKIP recorded with hardware note |
| REQ-009 | Subprocess lifecycle | Python daemon exits on `client.close()` without orphaned processes |
| REQ-010 | Evidence envelope | Failures and inspect output use `<SK-VISION>` / `SK_VISION_ERROR`, not `<SENSES>` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `test -f .opencode/skills/sk-vision/vision-runtime/dist/plugin.js` succeeds, or the substitute is written in this child's implementation-summary.
- **SC-002**: Identifier `rg` in REQ-001 is clean except the LICENSE exception.
- **SC-003**: Copied unit tests pass after rebrand.
- **SC-004**: GPU row is either `load`+`status` evidence or SKIP.
- **SC-005**: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/sk-vision/001-sk-vision-fork-of-opencode-senses/003-runtime-fork --strict` exits 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | 002 skill root | Blocks target path | Do not start copy until 002 Class S gate is clean |
| Dependency | `../context/` dump | Critical source | Read-only; copy then rebrand in `vision-runtime/` |
| Dependency | Python 3.10+ / uv | Daemon cannot start | Auto-provision `~/.cache/sk-vision/venv`; document failure |
| Risk | Residual `SENSES_*` strings | 004/005 register wrong tools | REQ-001 `rg` before close |
| Risk | First-load 3.9 GB download | Operator stall | GPU smoke optional; never hide the download |
| Risk | Dump header vs default model | Wrong weights | Keep `moondream2`; fix the Photon 3.1 comment |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: JSON-RPC `ping` after a warm venv returns without pulling weights. `load` is the slow path and may download ~3.9 GB.

### Security
- **NFR-S01**: Image bytes stay local unless the operator calls `sk_vision_reverse` with Yandex enabled.
- **NFR-S02**: Injected evidence remains untrusted observation. Keep the dump injection guard after rebrand (`<SK-VISION>` envelope).

### Reliability
- **NFR-R01**: Python daemon crash returns `SK_VISION_ERROR` and does not kill the host CLI session.

---

## 8. EDGE CASES

### Data Boundaries
- Empty image path: structured validation error, no daemon hang.
- Clipboard data URLs: dump materializes to `/tmp/sk-vision-<hash>.<ext>` after rebrand.
- Corrupt payload: `SK_VISION_ERROR` without crashing the host.

### Error Scenarios
- Missing Python/uv: `DEPENDENCY_MISSING` / auto-provision, same as dump.
- Out of GPU memory: error report, no zombie process.
- Hardware absent: SKIP the smoke; still close the packet if P0 items pass.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 18/25 | Multi-language fork (TypeScript + Python) plus 13 tools |
| Risk | 16/25 | Subprocess lifecycle, GPU, MIT, identifier collisions |
| Research | 14/20 | Locked in 001-research |
| Multi-Agent | 8/15 | Single implementer |
| Coordination | 10/15 | Feeds 004 and 005 |
| **Total** | **66/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Orphaned Python after host exit | M | L | `dispose` / `client.close()` in adapters; this child keeps `RuntimeClient` close |
| R-002 | Weight download blocks close | M | H | Smoke is optional; document SKIP |
| R-003 | Publishing as `opencode-senses` | H | L | Package name `sk-vision`; ADR-004 |
| R-004 | Leaving `senses_*` aliases | H | M | Tool-key `rg`; no aliases |

---

## 11. USER STORIES

### US-001: Local inspect (Priority: P0)

**As a** later OpenCode or Pi adapter, **I want** `sk_vision_inspect` on a file path, **so that** the shared daemon returns a `<SK-VISION>` evidence block.

**Acceptance Criteria**:
1. Given `vision-runtime` is built, When inspect is called with a path, Then the JSON-RPC core returns structured caption/scene/OCR text wrapped in `<SK-VISION>`.

### US-002: Clean rebrand (Priority: P0)

**As an** operator, **I want** caches under `~/.cache/sk-vision`, **so that** this fork does not share state with an upstream Senses install.

**Acceptance Criteria**:
1. Given the forked runtime starts, When it provisions a venv, Then the path is `~/.cache/sk-vision/venv`.

### US-003: GPU skip (Priority: P1)

**As an** implementer without Ampere/Apple Silicon, **I want** to close this child without downloading weights, **so that** 004/005 can still wire adapters.

**Acceptance Criteria**:
1. Given no supported GPU, When the smoke runs, Then the summary records SKIP and P0 tests still pass.

---

## 12. OPEN QUESTIONS

- None. ADR-001 through ADR-004 stay locked. GPU hardware proof is optional here, not a new decision.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Parent Spec**: See `../spec.md`
- **Dump**: See `../context/`
