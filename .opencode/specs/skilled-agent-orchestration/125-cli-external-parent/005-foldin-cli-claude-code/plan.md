---
title: "Implementation Plan: Phase 5: foldin-cli-claude-code"
description: "Execute the cli-claude-code fold-in, the identity dissolution, and the hub-aware scorer rewrite as one atomic bundle. The plan gates the dissolution behind the scorer rewrite, rebuilds the dist, re-baselines the parity fixtures, and keeps the delegation vitest green."
trigger_phrases:
  - "foldin cli-claude-code plan"
  - "identity dissolution plan"
  - "scorer rewrite plan"
  - "atomic bundle plan"
  - "phase 005 plan"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/125-cli-external-parent/005-foldin-cli-claude-code"
    last_updated_at: "2026-07-09T19:00:00Z"
    last_updated_by: "claude"
    recent_action: "Drafted the atomic fold-in + scorer-rewrite plan"
    next_safe_action: "Execute the atomic bundle after phase 004"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/scorer/executor-delegation.ts"
      - ".opencode/skills/cli-external/graph-metadata.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-005-foldin-cli-claude-code"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 5: foldin-cli-claude-code

<!-- SPECKIT_LEVEL: 2 -->
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
| **Language/Stack** | Markdown/JSON skill tree, TypeScript scorer, compiled dist, JSON parity fixtures, vitest |
| **Framework** | OpenCode skill hub plus the skill-advisor executor-delegation scorer |
| **Storage** | Filesystem skill tree and advisor mcp_server |
| **Testing** | `executor-delegation.vitest.ts`, parity-fixture re-baseline, graph-metadata inventory, one-commit atomicity check |

### Overview
This phase moves cli-claude-code into the hub (rewriting its ~13 internal outbound relative paths in the same move) and, in the same atomic change, dissolves both children's graph identities into one hub identity and rewrites the executor-delegation scorer to source its alias table from the hub `mode-registry.json`. The dissolution is gated behind the scorer rewrite so there is no interval where the family filter matches the hub and delegation routing silently degrades (the `external` noun resolving to the non-executor `cli-external`, and the model-alias backstop dropping via `activeExecutorIds`).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 004 relocated cli-opencode and repointed the fail-open hook
- [ ] The hub `mode-registry.json` exists as the scorer's future source of truth
- [ ] The current `EXECUTOR_KINDS` members and fixture `expectedTop` distribution are inventoried from the live worktree

### Definition of Done
- [ ] cli-claude-code tree moved with `git mv`, history preserved
- [ ] Exactly one hub `graph-metadata.json` remains, folding both children's edges/signals
- [ ] The scorer sources from the hub mode-registry, resolves to `EXECUTOR_KINDS`, dist rebuilt, fixtures re-baselined green, all in one commit
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Atomic workflow-packet fold-in plus a hub-aware runtime rewrite, gated so identity dissolution never precedes the scorer's new source of truth.

### Key Components
- **cli-claude-code packet tree**: The former flat skill contents, moved under `cli-external/cli-claude-code/`.
- **Single hub identity**: `cli-external/graph-metadata.json` absorbing the union of both children's edges, domains, and intent signals.
- **Rewritten scorer**: `executor-delegation.ts` reading `packetSkillName` values from the hub `mode-registry.json`, resolving to the `EXECUTOR_KINDS` strings.
- **Parity fixtures and vitest**: `executor-delegation-cases.json` (11 cases: 6 `cli-opencode`, 2 `cli-claude-code`, 2 `sk-code`, 1 `none`) and `executor-delegation.vitest.ts`, re-baselined and green with the negatives preserved and no `cli-external` resolution.

### Data Flow
Delegation prompts enter the scorer, which builds its executor alias table from the hub `mode-registry.json` `packetSkillName` values and resolves the top match to the executor-kind string `executor-config.ts` expects. Before this phase the table came from the `family === 'cli'` projection filter; after it, from the registry — same output contract, hub-aware source.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/cli-claude-code/` | Independent Claude Code dispatch skill | Move into `.opencode/skills/cli-external/cli-claude-code/` with `git mv`, rewriting its ~13 internal outbound relative paths | Destination contains the moved tree; old flat folder absent; link-resolve check clean |
| both children's `graph-metadata.json` | Two independent advisor identities | Delete after folding their union into the hub metadata | Exactly one `graph-metadata.json` under `cli-external/` |
| `executor-delegation.ts` (+ dist) | Builds the alias table from the `family === 'cli'` filter | Rewrite to source from the hub `mode-registry.json` (no hub-id noun), resolving to `EXECUTOR_KINDS`; rebuild dist | Delegation prompts resolve the right executor; no prompt resolves to `cli-external`; dist reflects the rewrite |
| `executor-delegation-cases.json` + `executor-delegation.vitest.ts` | 11 cases (6/2/2/1) and the delegation test | Re-baseline and keep green | All 11 pass, the 2 `sk-code` + 1 `none` negatives stay green; vitest green |
| `check-prompt-quality-card-sync.sh` | Card-sync CI gate (cli-claude-code path) | Repoint in the same commit as the move | `.github/workflows/prompt-card-sync.yml` green |
| `dispatch-preflight-lint.mjs` | Fail-open hook resolving per-skill SKILL.md | Finalize the cli-claude-code registry entry to the hub path | Hook resolves `cli-external/cli-claude-code/SKILL.md` |

Required inventories:
- Same-class producers: `rg -n '<field|string|helper|literal|error-pattern>' <module-or-files>`.
- Consumers of changed symbols: `rg -n '<changedSymbol>|<changedConstant>|<changedPublicField>' . --glob '*.ts' --glob '*.js' --glob '*.md'`.
- Matrix axes: list every independent input axis and the required rows before implementation.
- Algorithm invariant: for path/redaction/parser/resolver/security fixes, state the invariant and adversarial cases.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm phase 004 landed and the hub `mode-registry.json` exists
- [ ] Inventory the `EXECUTOR_KINDS` members and the current fixture `expectedTop` distribution
- [ ] Inventory both children's `graph-metadata.json` edges and intent signals for the union fold

### Phase 2: Core Implementation
- [ ] `git mv` the cli-claude-code tree into `cli-external/cli-claude-code/`, rewriting its ~13 internal outbound relative paths (add a `../`) in the same move
- [ ] Rewrite `executor-delegation.ts` to source from the hub `mode-registry.json` (no hub-id noun), resolving to `EXECUTOR_KINDS`, and rebuild the dist
- [ ] Delete both children's `graph-metadata.json` and fold their union into the hub metadata — in the SAME commit as the scorer rewrite
- [ ] Finalize the hook's cli-claude-code registry entry and repoint `check-prompt-quality-card-sync.sh`'s cli-claude-code card path, in the same commit

### Phase 3: Verification
- [ ] Re-baseline `executor-delegation-cases.json` (11 cases, negatives preserved, no `cli-external`) and confirm `executor-delegation.vitest.ts` is green
- [ ] Run a link-resolve check for the rewritten relative paths; confirm `check-prompt-quality-card-sync.sh` and its workflow are green
- [ ] Confirm exactly one `graph-metadata.json` under `cli-external/`, and the dissolution + scorer rewrite are provably one commit; run phase-folder validation
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Delegation unit | Executor resolution after the rewrite | `tests/scorer/executor-delegation.vitest.ts` |
| Parity fixtures | 11 cases (6/2/2/1), negatives preserved, no `cli-external` | `executor-delegation-cases.json` re-baseline |
| Structural | One graph identity, one commit | Graph-metadata inventory, `git show --stat` atomicity check |
| Template validation | Phase 005 spec docs | `validate.sh` against this phase folder |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 004 cli-opencode relocation | Internal | Yellow until confirmed | The hub and the hook's cli-opencode branch must exist first |
| Hub `mode-registry.json` | Internal | Green from phase 003 | The rewritten scorer has no source of truth without it |
| `EXECUTOR_KINDS` enum contract | Internal | Green from phase 001 research | The scorer must resolve to these exact strings or downstream config rejects the result |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The delegation vitest goes red, a parity fixture fails, or more than one `graph-metadata.json` remains under `cli-external/`.
- **Procedure**: Revert the atomic phase commit as one unit so the moved tree, the graph dissolution, the scorer source, its dist, and the fixtures return together. Do not partially restore only the move or only the scorer.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
