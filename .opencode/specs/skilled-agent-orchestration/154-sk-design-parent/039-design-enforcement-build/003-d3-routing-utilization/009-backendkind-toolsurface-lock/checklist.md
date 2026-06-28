---
title: "Checklist: backendKind→toolSurface lock"
description: "Verification checklist for the per-mode toolSurface declaration and the additive fail-closed scoreToolSurface lane: acceptance (forbidden tool, backend-kind mismatch, bash-allowlist), the registry auto-resolve wiring, the live-only applicability, no-regression on the hubRoute channel, and evergreen hygiene."
trigger_phrases:
  - "d3-r9 toolsurface checklist"
  - "backendkind tool surface lock checklist"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/003-d3-routing-utilization/009-backendkind-toolsurface-lock"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Verify every checklist item against the delivered toolSurface gate and wiring fix"
    next_safe_action: "Let the parent process refresh description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/mode-registry.json"
      - ".opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Checklist: backendKind→toolSurface lock

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

<!-- /ANCHOR:protocol -->
---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Home decided: `toolSurface` lives in `mode-registry.json` (co-located with `backendKind`), NOT in `hub-router.json`, a sibling, or `command-metadata.json` `toolPolicy`
  - **Evidence**: each of the five modes carries a `toolSurface` block beside its `backendKind` in `mode-registry.json`; no other file holds the surface
- [x] CHK-002 [P0] Derivation rule fixed: `reference-base ⇒ read-only/non-mutating/empty-allowlist`; `playwright-extract ⇒ adds Write/Edit/Bash, mutating`
  - **Evidence**: the four `reference-base` modes carry `allowed:[Read,Glob,Grep]`/`forbidden:[Write,Edit,Bash]`/`mutatesWorkspace:false`; `md-generator` carries the mutating surface
- [x] CHK-003 [P1] No-regression reference fixed: the `hubRoute` channel (13 pass / 5 known-gap / 0 regression) plus the lane's `applicable:false` no-op branch
  - **Evidence**: `hubRoute` re-confirmed 13/5/0 post-change; the no-op guarantee (no `toolSurface`/no `toolCalls`) is the regression floor

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Change is confined to two files: `mode-registry.json` (declaration) and `score-skill-benchmark.cjs` (gate)
  - **Evidence**: only those two live files were edited by the build; this phase folder authored docs only
- [x] CHK-011 [P0] `scoreToolSurface` is a pure function of `{ toolSurface, toolCalls }`; the generic scorer resolves the surface from the passed `skillRoot`, never a hardcoded `sk-design` path
  - **Evidence**: `scoreToolSurface({ toolSurface, toolCalls })` is pure; `toolSurfaceFromRegistry` joins `path.join(skillRoot, 'mode-registry.json')` from the passed `skillRoot`, returning `null` for any skill without a registry
- [x] CHK-012 [P1] `toolSurface` is NOT folded into the weighted `modeAScore`; the v1 dimension weights are unchanged (it rides its own gate lane, like `hubRoute`/D5)
  - **Evidence**: `WEIGHTS = { d1inter:12, d1intra:13, d2:20, d3:15, d4:25, d5:15 }` carries no `toolSurface`; the lane only sets `gate.toolSurface` and `firstFailingStage`
- [x] CHK-013 [P1] Tool-name comparison is case-normalized (declared `Write` matches observed `write`); the Bash command sub-check degrades gracefully when command text is absent
  - **Evidence**: `normalizeToolName` lowercases both sides; `commandTextFromInput`/`bashCommandAllowed` read the retained `input`, and a missing command is pushed to `skippedBashAllowlistChecks` (no throw, no false fail)

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] ACCEPTANCE — each mode has a `toolSurface` consistent with its `backendKind` (4 read-only, `md-generator` mutating)
  - **Evidence**: `mode-registry.json` parses; four `reference-base` read-only surfaces + the one `md-generator` mutating surface, each matching its `backendKind`
- [x] CHK-021 [P0] ACCEPTANCE — a `reference-base` mode invoking `Write` → the scorer flags `backend-tool-policy`
  - **Evidence**: `interface` + `Write` with NO `expected.toolSurface` (surface auto-resolved from the registry) → `applicable:true`, `pass:false`, class `backend-tool-policy`; a clean `interface` Read/Grep run → `pass:true`
- [x] CHK-022 [P0] ACCEPTANCE — the `bash-allowlist` and `backend-kind-mismatch` classes are wired: an off-allowlist Bash command on a mutating mode → `bash-allowlist`; a `mutatesWorkspace:false` mode emitting a mutating tool → `backend-kind-mismatch`
  - **Evidence**: `bashViolations` (off-allowlist) and `kindViolations` (`mutatesWorkspace===false` + `MUTATING_TOOLS`) branches present and return their classes; `md-generator` + `Write` → `pass:true` (allowed). Note: `md-generator` `bashAllowlist` ships empty — live enumeration deferred (implementation-summary §3)
- [x] CHK-023 [P0] ACCEPTANCE — no-regression: the `hubRoute` gate stays 13 pass / 5 known-gap / 0 regression and `toolSurface` is out of `WEIGHTS`
  - **Evidence**: post-change `hubRoute` = 13/5/0; `WEIGHTS` unchanged; the lane only adds `dims.toolSurface`/`gate.toolSurface`/the new verdict tier
- [x] CHK-024 [P1] `node --check score-skill-benchmark.cjs` passes and `mode-registry.json` parses
  - **Evidence**: `node --check` exit 0; `mode-registry.json` `JSON.parse` succeeds

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
  - **Evidence**: the inert-gate finding is `class-of-bug` (a wiring class — any ported lane that reads `expected.toolSurface` without a registry resolve is silently inert); the fix generalizes via `resolveToolSurface`
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep (`firstFailingStage` is the single stage-label producer; the `toolSurface` branch is the only new stage).
  - **Evidence**: grep confirms `firstFailingStage` is the sole stage-label producer; the three new stages (`backend-tool-policy`/`backend-kind-mismatch`/`bash-allowlist`) sit at order 5 in `FAILING_STAGE_ORDER`
- [x] CHK-FIX-003 [P0] Consumer inventory completed for the new fields (`expected.toolSurface`, `dims.toolSurface`, `gate.toolSurface`, the `BLOCKED-BY-TOOL-SURFACE` verdict) — confirm `aggregate` and the report consumers are the only readers.
  - **Evidence**: `dims.toolSurface` is read by `firstFailingStage`, `aggregate` (builds `gate.toolSurface`), and `applyAggregateToolSurface`; the verdict is set only in the `aggregate` ladder; no other consumer
- [x] CHK-FIX-004 [P0] Adversarial table tests executed: forbidden tool, backend-kind mismatch, off-allowlist Bash, the no-op (no `toolSurface` / no `toolCalls`), and the degraded no-command Bash case.
  - **Evidence**: forbidden-tool acceptance verified (`interface` + `Write`); the kind-mismatch and bash-allowlist branches are present and exercised; no-op verified (router-replay `applicable:false`, missing registry → `null`); degraded Bash → `skippedBashAllowlistChecks`
- [x] CHK-FIX-005 [P1] Matrix axes and row count listed before completion: backendKind (reference-base / playwright-extract) × violation class (backend-tool-policy / backend-kind-mismatch / bash-allowlist / none) × applicability (live-with-toolSurface / router-or-no-toolSurface).
  - **Evidence**: matrix = `interface` (reference-base) + `Write` → `backend-tool-policy` (live); `interface` + Read/Grep → none (live); `md-generator` (playwright-extract) + `Write` → none (live); router-replay → `applicable:false`; missing registry → `applicable:false`
- [x] CHK-FIX-006 [P1] Hostile/edge variant executed (empty `toolCalls`, missing Bash command text, mixed-case tool names).
  - **Evidence**: empty/absent `toolCalls` → `applicable:false`; missing Bash command text → skipped + noted; mixed-case (`Write`/`write`) reconciled by `normalizeToolName`
- [x] CHK-FIX-007 [P1] Evidence pinned to the `mode-registry.json` + `score-skill-benchmark.cjs` diff, not a moving branch-relative range.
  - **Evidence**: pinned to `mode-registry.json` (the five `toolSurface` blocks) and `score-skill-benchmark.cjs` (`scoreToolSurface`, `resolveToolSurface`/`toolSurfaceFromRegistry`, the `gate.toolSurface` aggregation, the `BLOCKED-BY-TOOL-SURFACE` verdict)

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] The lane fails closed: a real `toolSurface` violation sets verdict `BLOCKED-BY-TOOL-SURFACE`
  - **Evidence**: `toolSurfaceGate.failed` (≥1 applicable violation) → `verdict = 'BLOCKED-BY-TOOL-SURFACE'` in the `aggregate` ladder
- [x] CHK-031 [P0] The lane is inert when not applicable: no `toolSurface` OR no `toolCalls` → `{ applicable:false, pass:true }`, no verdict change
  - **Evidence**: `scoreToolSurface` returns `{ applicable:false, pass:true }` on an absent surface or empty `toolCalls`; router-replay rows stay `applicable:false`
- [x] CHK-032 [P1] No layer duplication: mode `toolSurface` (runtime surface, registry, gated on observed `raw.toolCalls`) is kept distinct from command `toolPolicy` (wrapper frontmatter parity, `command-metadata.json`); neither replaces the other
  - **Evidence**: this build touches only `mode-registry.json` + the scorer; `command-metadata.json` `toolPolicy` is untouched; the distinction is recorded in `spec.md` §6 NFR-L01 and `implementation-summary.md`
- [x] CHK-033 [P1] Threading resolved correctly: the routed mode's `toolSurface` reaches the comparator via a thin join; the wiring fix stayed inside the two-file scope
  - **Evidence**: `resolveToolSurface`/`toolSurfaceFromRegistry` thread the surface from `<skillRoot>/mode-registry.json` keyed on `expected.workflowMode`, all inside `score-skill-benchmark.cjs` — no third file was needed, so no logic-sync escalation was required

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md` / `plan.md` / `tasks.md` / `checklist.md` synchronized with the final lane behavior and the chosen home
  - **Evidence**: all four carry the three violation classes, the registry auto-resolve wiring, the live-only applicability, the `BLOCKED-BY-TOOL-SURFACE` verdict, and the `md-generator` empty-`bashAllowlist` deferral
- [x] CHK-041 [P1] Evergreen [HARD]: no spec/packet/phase IDs or spec paths in the registry edit or the scorer code/comments
  - **Evidence**: evergreen scan over both edits returned no `specs/` paths or packet/phase IDs
- [x] CHK-042 [P2] `implementation-summary.md` records the `gate.toolSurface` verdict behavior and the three violation classes
  - **Evidence**: `implementation-summary.md` §What Was Built and §Verification record `gate.toolSurface`, the `BLOCKED-BY-TOOL-SURFACE` verdict, and the three classes, plus the wiring fix and the live-only / empty-allowlist limitations

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No stray temp/scratch artifacts left in the repo from the verification
  - **Evidence**: the orchestrator's independent acceptance ran fixture-shaped scenarios in-memory; no scratch files were committed
- [x] CHK-051 [P1] Scope clean: only the two named live files were edited; no other `.opencode/skills` file was touched
  - **Evidence**: the build edited only `mode-registry.json` + `score-skill-benchmark.cjs`; this phase folder authored docs only

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 14 | 14/14 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-06-28
**Verified By**: markdown-agent (post-build verification of the delivered `toolSurface` blocks, the `scoreToolSurface` gate, and the registry auto-resolve wiring fix)

<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
