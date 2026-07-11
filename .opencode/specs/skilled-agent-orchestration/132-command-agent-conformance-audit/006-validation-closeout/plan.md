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
    last_updated_at: "2026-07-11T00:30:00Z"
    last_updated_by: "fable-5"
    recent_action: "Authored plan.md: ordered steps for CMD-05, XS-01(gated), XS-03 + gate"
    next_safe_action: "Run T001 pre-flight once 002-005 land; XS-01 needs operator go-ahead"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs"
      - ".opencode/skills/system-skill-advisor/mcp_server/scripts/skill_graph_compiler.py"
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/derived/sync.ts"
      - ".opencode/commands/doctor/scripts/skill-graph-freshness.cjs"
      - ".opencode/skills/system-spec-kit/scripts/spec/validate.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "conformance-audit-132"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
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
- [ ] Phases 002-005 individually complete with clean strict validate (checked at execution time, not at planning time)
- [ ] Operator decision recorded for XS-01 (approve-and-execute vs. explicit deferral)

### Definition of Done
- [ ] CMD-05, XS-03 findings executed and verified (XS-01 executed only if operator-approved, else deferral documented)
- [ ] Recursive `validate.sh --strict` on the 132 parent is Errors:0
- [ ] `route-validate.sh` exits 0; all 9 read-only `/doctor` targets re-run clean
- [ ] Advisor re-baseline shows no regression (or a documented intended delta)
- [ ] Program metadata (description.json + graph-metadata.json, children then parent) refreshed and memory-saved
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
- [ ] Confirm phases 002-005 each have `implementation-summary.md` and an individually clean `validate.sh --strict` (per-child, not yet recursive)
- [ ] Capture the pre-regen baseline: `node .opencode/commands/doctor/scripts/skill-graph-freshness.cjs` output (for before/after diffing)
- [ ] Confirm phase 002's CMD-06 fix (deep presentation `.txt` executor-selector dedup) is on disk — CMD-05's recompile must not run before this, or it re-bakes the duplicate-executor-enum defect into the contracts

### Phase 2: Build-Artifact Regen — Safe-Auto (CMD-05, XS-03)
- [ ] **CMD-05**: `node .opencode/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs --command deep/research --write`
- [ ] **CMD-05**: `node .opencode/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs --command deep/review --write`
- [ ] **CMD-05**: `node .opencode/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs --command deep/ai-council --write`
- [ ] **CMD-05**: Investigate the `deep/ai-council` manifest divergence — `manifest.jsonl` rows are appended only by `render-command-contract.cjs` at render time, never by the compiler; determine whether a render needs to happen (or a manual row correction is warranted) to reconcile the last row's `compiledContractSha256` against the regenerated file
- [ ] **XS-03**: For each of the 12 hubs (`cli-external`, `mcp-code-mode`, `mcp-tooling`, `sk-code`, `sk-design`, `sk-doc`, `sk-git`, `sk-prompt`, `system-code-graph`, `system-deep-loop`, `system-skill-advisor`, `system-spec-kit`), populate `derived.generated_at` — NOTE: `syncDerivedMetadata` (`.opencode/skills/system-skill-advisor/mcp_server/lib/derived/sync.ts`) is the only found implementation of this write path and currently has only test callers (`tests/lifecycle-derived-metadata.vitest.ts`, `stress_test/skill-advisor/auto-indexing-derived-sync-stress.vitest.ts`); the implementer either invokes it directly per hub or authors a minimal driver — do not assume a wired CLI exists without re-checking at execution time

### Phase 3: Skill-Graph Regen — OPERATOR-GATED (XS-01)
- [ ] **STOP — obtain explicit operator approval before any step below.** This regen mutates persistent advisor-routing state (SQLite + the compiled JSON the advisor's compiled-JSON lane reads). Default posture if approval is not obtained: document the deferral in this phase's handoff/continuity and skip to Phase 4 with REQ-001/SC-003 recorded as "deferred," not "complete."
- [ ] (If approved) Regenerate `system-skill-advisor/mcp_server/scripts/skill-graph.json` via `skill_graph_compiler.py`, purging the 9 ghost nodes (`cli-claude-code`, `cli-opencode`, `deep-loop-runtime`, `deep-loop-workflows`, `mcp-chrome-devtools`, `mcp-click-up`, `mcp-figma`, `mcp-open-design`, `sk-prompt-models`) and 2 family mismatches (`sk-design` sk-hub/sk-code, `sk-prompt` sk-hub/sk-util)
- [ ] (If approved) Invoke the `skill_graph_scan` MCP tool (requires a trusted caller per `requireTrustedCaller`) to re-index `.opencode/skills` and purge the `cli-codex-retired` SQLite zombie
- [ ] (If approved) Re-run `skill-graph-freshness.cjs`; confirm GHOST/FAMILY MISMATCH/ZOMBIE lines all report `none`

### Phase 4: Validation Gate
- [ ] Spot-confirm each of phases 002-005 is individually clean: `bash validate.sh <child> --strict` per child
- [ ] Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <132-parent> --strict` (auto-recurses; confirm Errors:0 across parent + all 6 children)
- [ ] Run `bash .opencode/commands/doctor/scripts/route-validate.sh` — confirm exit 0
- [ ] Re-run each read-only `/doctor` target (`memory`, `embeddings`, `causal-graph`, `code-graph`, `deep-loop`, `skill-budget`, `parent-skill`, `skill-graph-freshness`, `fable-mode`) — confirm no new errors vs. the §4 baseline table in research.md (exits 75 for `memory`/`causal-graph` remain the documented "daemon not warm" code, not a defect)
- [ ] Run `node .opencode/commands/doctor/scripts/parent-skill-check.cjs sk-doc` (owns `create-agent`, touched by phase 004's AGT-03/AGT-08/AGT-09 fixes) — confirm STRICT 0; also run against `system-skill-advisor` if Phase 3 executed
- [ ] If any advisor-facing metadata changed (002-005's command/agent/doctor `trigger_phrases`, or this phase's own Phase 2/3 work), re-run `skill_advisor_regression.py --dataset .opencode/skills/system-skill-advisor/mcp_server/scripts/fixtures/skill_advisor_regression_cases.jsonl` and compare against the pre-program baseline — confirm no regression or document the intended delta

### Phase 5: Program Metadata + Close
- [ ] Regenerate `description.json` + `graph-metadata.json` for each of the 6 children, then the 132 parent
- [ ] Confirm parent `graph-metadata.json` `children_ids` count == 6 on-disk children and `derived.last_active_child_id` is set
- [ ] Memory-save the program via `generate-context.js`; confirm the POST-SAVE quality review is PASSED, or patch HIGH/MEDIUM issues per the memory-save-rule
- [ ] Reconcile completion metadata across this phase's own spec/plan/tasks (and cross-check the parent + children docs) so nothing claims a conflicting completion state
- [ ] Author this phase's `implementation-summary.md` — ONLY once the work above is actually executed and green; NOT performed during this planning-only authoring pass
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
