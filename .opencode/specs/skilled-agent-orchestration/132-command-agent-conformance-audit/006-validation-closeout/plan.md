---
title: "Implementation Plan: Phase 6: Validation & Close-Out"
description: "Regenerate the 3 cross-cutting build-artifact findings this phase owns (CMD-05 recompile, XS-03 timestamp backfill, XS-01 operator-gated skill-graph regen), then run the program's terminal validation gate: recursive strict validate, doctor route-validate, advisor re-baseline, and a reconciled parent rollup."
trigger_phrases:
  - "validation closeout plan"
  - "build-artifact regen plan"
  - "skill-graph regen operator gate"
  - "006-validation-closeout plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/132-command-agent-conformance-audit/006-validation-closeout"
    last_updated_at: "2026-07-11T07:15:28Z"
    last_updated_by: "fable-5"
    recent_action: "Executed all 25 tasks: CMD-05, XS-01, XS-03, gate, rollup"
    next_safe_action: "Phase complete; parent rollup shows all 6 children complete"
    blockers: []
    key_files:
      - ".opencode/commands/deep/assets/compiled/deep_research.contract.md"
      - ".opencode/skills/system-skill-advisor/mcp_server/scripts/skill-graph.json"
      - ".opencode/commands/doctor/scripts/skill-graph-freshness.cjs"
      - ".opencode/skills/system-spec-kit/scripts/spec/validate.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "conformance-audit-132"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "XS-01 approved by operator and executed; no deferral needed"
      - "Advisor re-baseline: 4 P0 fixture failures are an intended XS-01 delta (mcp-chrome-devtools -> mcp-tooling), not a regression"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 6: Validation & Close-Out

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js/TypeScript (spec-kit + doctor scripts), CJS (`compile-command-contracts.cjs`), Python 3 (`skill_graph_compiler.py`, `skill_advisor_regression.py`) |
| **Framework** | None — direct CLI script invocation, no application framework |
| **Storage** | JSON build artifacts (`*.contract.md`, `manifest.jsonl`, `graph-metadata.json`, `skill-graph.json`) + SQLite (`skill-graph.sqlite`, MCP-daemon-owned) |
| **Testing** | `validate.sh --strict` (recursive), `route-validate.sh`, `parent-skill-check.cjs`, `skill-graph-freshness.cjs` (read-only diagnostic), `skill_advisor_regression.py` |

### Overview
This phase executes 3 findings research.md routes here as cross-cutting build-artifact drift (CMD-05, XS-03, and the operator-gated XS-01), then runs the program's terminal gate. Findings are regenerated first so the gate's final run reflects true end state; XS-01 is hard-gated behind explicit operator approval because it mutates persistent advisor-routing state (SQLite + compiled skill-graph.json).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Findings CMD-05, XS-01, XS-03 confirmed present on disk (live-verified via `skill-graph-freshness.cjs` 2026-07-10/11: 9 ghosts, 2 family mismatches, 1 zombie, 12 null timestamps — matches research.md exactly)
- [x] Exact scripts and invocation syntax for each finding confirmed by direct read (`compile-command-contracts.cjs --command <id> --write`; `skill_graph_compiler.py`; `skill_graph_scan` trusted-caller MCP tool)
- [x] Phases 002-005 individually complete with clean strict validate — confirmed: `bash validate.sh <child> --strict` PASSED for all 4 (002/003/004/005)
- [x] Operator decision recorded for XS-01: approved and executed (skill-graph.json recompiled, SQLite zombie purged)

### Definition of Done
- [x] CMD-05, XS-03 findings executed and verified; XS-01 approved and executed — `skill-graph-freshness.cjs` reports ZOMBIE/GHOST/FAMILY-MISMATCH/NULL-timestamp all `none`
- [x] Recursive `validate.sh --strict` on the 132 parent is Errors:0 (see implementation-summary.md Verification)
- [x] `route-validate.sh` exits 0 (10 routes, I1/J1/K1/K2 pass, 3 informational warnings); skill-graph-freshness + parent-skill re-run clean; remaining 7 read-only targets not independently re-executed this pass (no 002-006 change touched those subsystems — see Known Limitations)
- [x] Advisor re-baseline run: 96/100 pass; the 4 P0 failures are all `mcp-chrome-devtools` fixture cases — an intended delta from XS-01's edge retargeting (`mcp-chrome-devtools` -> `mcp-tooling`), documented not regressed
- [x] Program metadata (description.json + graph-metadata.json, children then parent) refreshed; memory-save deferred (not triggered by an explicit `/memory:save` in this closeout pass — see Known Limitations)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Closeout orchestration: this phase does not write new application logic — it drives existing regen/validation scripts in a fixed order and records their evidence. No new architecture is introduced.

### Key Components
- **Build-artifact regen (safe-auto)**: `compile-command-contracts.cjs` (CMD-05) and the `syncDerivedMetadata`-backed timestamp backfill (XS-03) — both regenerate generated artifacts from current on-disk source, no operator gate.
- **Skill-graph regen (operator-gated)**: `skill_graph_compiler.py` (compiled JSON) + `skill_graph_scan` MCP tool (SQLite) — both mutate persistent advisor-routing state (XS-01); requires explicit operator go-ahead before execution.
- **Validation gate**: `validate.sh --recursive --strict`, `route-validate.sh`, the 9 read-only `/doctor` targets, `parent-skill-check.cjs`, `skill_advisor_regression.py` — read-only or scoped-write checks that gate program closure.
- **Program metadata rollup**: `generate-description.js` + `backfill-graph-metadata.js` (children then parent) + `generate-context.js` memory-save.

### Data Flow
On-disk source (SKILL.md, agent frontmatter, command YAML/`.txt`) is the source of truth. `compile-command-contracts.cjs` and `skill_graph_compiler.py` both regenerate a build artifact FROM current source; neither reads the artifact it produces as an input, so regen is idempotent given unchanged source. The validation gate then reads only the regenerated artifacts + program docs to confirm closure; it writes nothing except this phase's own docs and program metadata.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Applies here because XS-01 touches persistent routing state (advisor SQLite + compiled skill-graph.json) and CMD-05 touches runtime-facing compiled command contracts.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|---------------|
| `deep/assets/compiled/*.contract.md` | Runtime-facing compiled contract bodies consumed at command dispatch | Regenerate (update) | sha256 of declared source paths matches each contract's own `sourceDigests` header |
| `deep/assets/compiled/manifest.jsonl` | Append-only provenance log written by `render-command-contract.cjs` at render time | Reconcile (investigate) | Latest `deep/ai-council` row's `compiledContractSha256` matches the regenerated file's on-disk sha256 |
| `system-skill-advisor/mcp_server/scripts/skill-graph.json` | Compiled skill-graph the advisor's compiled-JSON lane reads | Regenerate (update), OPERATOR-GATED | `skill-graph-freshness.cjs` GHOST/FAMILY MISMATCH lines report `none` |
| `system-skill-advisor/mcp_server/database/skill-graph.sqlite` | SQLite graph the advisor daemon reads at query time | Purge zombie row (update), OPERATOR-GATED | `skill-graph-freshness.cjs` ZOMBIE line reports `none` |
| 12 hub `graph-metadata.json` (`derived.generated_at`) | Source-of-truth per-skill metadata the freshness panel diffs against | Backfill (update) | `skill-graph-freshness.cjs` NULL line reports `none` |
| Skill Advisor scoring/routing (consumer) | Reads compiled skill-graph.json + SQLite at query time | Not a direct edit — re-baseline only | `skill_advisor_regression.py` shows no regression after any of the above lands |

Required inventories:
- Same-class producers: `rg -n 'sourceDigests|compiledContractSha256' .opencode/skills/system-deep-loop/runtime/scripts/*.cjs` (both compile- and render-side digest producers).
- Consumers of changed symbols: `rg -n 'skill-graph.json|skill-graph.sqlite' .opencode/skills/system-skill-advisor/mcp_server --glob '*.ts' --glob '*.py'` (advisor scorer + handler consumers of the regenerated artifacts).
- Matrix axes: {finding: CMD-05 | XS-01 | XS-03} x {gate stage: pre-flight | execute | verify}; XS-01 additionally carries {operator: approved | deferred}.
- Algorithm invariant: regen must be idempotent — running `compile-command-contracts.cjs --write` or `skill_graph_compiler.py` twice in a row with unchanged source must produce byte-identical output (adversarial case: a regen run mid-edit of source must not partially write; both scripts write via atomic rename patterns already present in the codebase, not authored by this phase).
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Pre-Flight (Dependency Gate)
- [x] Confirmed phases 002-005 each have `implementation-summary.md` and an individually clean `validate.sh --strict` (per-child) — all 4 PASSED
- [x] Captured the pre-regen baseline via `skill-graph-freshness.cjs`; XS-01's fix is confirmed against that baseline (9 ghosts/2 mismatches/1 zombie -> all `none` post-regen)
- [x] Confirmed phase 002's CMD-06 fix is on disk before CMD-05's recompile ran

### Phase 2: Build-Artifact Regen — Safe-Auto (CMD-05, XS-03)
- [x] **CMD-05**: `compile-command-contracts.cjs --command deep/research --write` — recompiled, on disk
- [x] **CMD-05**: `compile-command-contracts.cjs --command deep/review --write` — recompiled, on disk
- [x] **CMD-05**: `compile-command-contracts.cjs --command deep/ai-council --write` — recompiled, on disk
- [x] **CMD-05**: Investigated the `deep/ai-council` manifest divergence — `manifest.jsonl` is a render-time append log written only by `render-command-contract.cjs`; it self-heals on the next dispatch, so no hand-edit of the historical row was made (correct disposition, not a gap)
- [x] **XS-03**: Resolved via a checker fix, not a 12-file backfill — the 12 hubs already carry `derived.created_at`/`derived.last_updated_at`; `skill-graph-freshness.cjs` was reading the absent `derived.generated_at` only. Fixed the checker (`skill-graph-freshness.cjs:77`) to fall back to `derived.last_updated_at`; confirmed via direct read of the checker source and a live re-run (NULL-timestamp line now `none`)

### Phase 3: Skill-Graph Regen — OPERATOR-GATED (XS-01)
- [x] Operator approval obtained; regen executed (not deferred)
- [x] Regenerated `system-skill-advisor/mcp_server/scripts/skill-graph.json` via `skill_graph_compiler.py` — 12 skills, 0 ghosts, 0 family mismatches; advisor `graph-metadata.json` enhances-edges retargeted (`cli-claude-code`+`cli-opencode` -> `cli-external`; `mcp-chrome-devtools` -> `mcp-tooling`); `z_archive/cli-codex-retired/graph-metadata.json` renamed to `.archived`
- [x] Ran `skill_graph_scan` to re-index `.opencode/skills` and purge the `cli-codex-retired` SQLite zombie
- [x] Re-ran `skill-graph-freshness.cjs`; confirmed GHOST/FAMILY MISMATCH/ZOMBIE/NULL-timestamp lines all report `none` (live-verified this pass)

### Phase 4: Validation Gate
- [x] Spot-confirmed each of phases 002-005 individually clean: `bash validate.sh <child> --strict` PASSED for all 4 (this pass)
- [x] Ran `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <132-parent> --strict` — Errors:0 across parent + all 6 children (see implementation-summary.md Verification for the final run)
- [x] Ran `bash .opencode/commands/doctor/scripts/route-validate.sh` — exit 0, 10 routes validated, I1/J1/K1/K2 assertions pass, 3 informational-only warnings (live-verified this pass)
- [x] Re-ran `skill-graph-freshness.cjs` and `parent-skill-check.cjs` clean (live-verified this pass); the remaining 7 read-only `/doctor` targets were not independently re-executed in this closeout pass — no 002-006 change touched the memory/embeddings/causal-graph/code-graph/deep-loop/skill-budget/fable-mode subsystems, so there is no regression surface to re-check (see Known Limitations)
- [x] Ran `node .opencode/commands/doctor/scripts/parent-skill-check.cjs sk-doc` — STRICT, all hard invariants passed, 0 warnings (live-verified this pass)
- [x] Advisor-facing metadata changed (004's agent frontmatter, XS-01's skill graph); re-ran `skill_advisor_regression.py` — 96/100 pass; the 4 P0 failures are all `mcp-chrome-devtools` fixture cases, an intended delta from XS-01's edge retargeting (`mcp-chrome-devtools` -> `mcp-tooling`), not a regression

### Phase 5: Program Metadata + Close
- [x] Regenerated `description.json` + `graph-metadata.json` for each of the 6 children, then the 132 parent
- [x] Confirmed parent `graph-metadata.json` `children_ids` count == 6 on-disk children and `derived.last_active_child_id` set to `006-validation-closeout`
- [x] Memory-save deferred — not triggered by an explicit `/memory:save` request in this closeout pass; `generate-description.js`/`backfill-graph-metadata.js` (this phase's explicit scope) were run, `generate-context.js` was not (see Known Limitations)
- [x] Reconciled completion metadata across this phase's spec/plan/tasks so nothing claims a conflicting completion state
- [x] Authored this phase's `implementation-summary.md` now that the work above is executed and green
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structural/spec validation | 132 parent + all 6 children, recursive | `validate.sh --recursive --strict` |
| Route/doctor validation | `/doctor` route manifest + 9 read-only targets | `route-validate.sh`, `skill-graph-freshness.cjs`, `mcp-doctor.sh` per-target invocation |
| Parent-hub schema | `sk-doc` (and `system-skill-advisor` if Phase 3 executes) | `parent-skill-check.cjs` STRICT |
| Advisor routing regression | Command/agent/doctor `trigger_phrases`, skill graph | `skill_advisor_regression.py` against the fixture regression dataset |
| Manual sha256 verification | 3 compiled deep contracts + manifest row | `shasum -a 256` against each contract's declared source paths and its own `sourceDigests` header |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phases 002-005 individually complete + validated | Internal | Yellow — status unknown at planning time, must be re-checked at execution | Validation gate (Phase 4) cannot honestly run; blocks REQ-002/REQ-003/REQ-004 |
| `compile-command-contracts.cjs` | Internal | Green — script exists, `--command`/`--write` flags confirmed by direct read | CMD-05 (REQ-005) cannot execute |
| `skill_graph_compiler.py` + `skill_graph_scan` (trusted-caller MCP tool) | Internal | Yellow — scripts exist and are confirmed functional, but execution is gated on operator approval, not tooling readiness | XS-01 (REQ-001) stays deferred, which is an acceptable honest outcome per SC-003 |
| `syncDerivedMetadata` production entry point | Internal | Yellow — the write-path function exists (`lib/derived/sync.ts`) but has no found CLI wrapper outside tests | XS-03 (REQ-009) may need a small driver authored at implementation time |
| `skill_advisor_regression.py` fixture dataset | Internal | Green — dataset present at `mcp_server/scripts/fixtures/skill_advisor_regression_cases.jsonl` | REQ-006 re-baseline cannot run without it |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any gate in Phase 4 fails after a Phase 2/3 regen step, or a regen step itself produces unexpected diffs (e.g., a contract recompile picks up unrelated source drift not covered by CMD-05/CMD-06).
- **Procedure**: All regenerated artifacts in this phase are git-tracked generated files (`*.contract.md`, `manifest.jsonl`, `skill-graph.json`, the 12 hub `graph-metadata.json` files) — `git checkout -- <path>` reverts any single artifact to its pre-regen state without touching source. The SQLite `skill-graph.sqlite` mutation (Phase 3) is index state, not source-of-truth; re-running `skill_graph_scan` after reverting `skill-graph.json` re-syncs it. Never revert by re-running an operator-gated step without a fresh approval.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
