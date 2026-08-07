---
title: "Phase 004 Plan: cli-devin Rewrite Prompts"
description: "Author deep-skill-style state machinery and dispatch prompts for the cli-devin commit-rewrite loop."
trigger_phrases:
  - "112-cli-devin-rewrite-prompts plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-git/z_archive/004-commit-standards-and-retroactive-rewrite/004-cli-devin-rewrite-prompts"
    last_updated_at: "2026-07-15T04:22:47Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored phase 004 plan"
    next_safe_action: "Read deep-research pattern references then author state schema"
    blockers:
      - "Phase 002 must close (commit-standards + derivation-heuristics inputs)"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-004-plan-2026-05-16"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 004 — cli-devin Rewrite Prompts

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Mirror the deep-research / deep-review scaffolding for the commit-rewrite use case. Author 8 template artifacts plus 4 ADRs, then promote the pinned agent-config recipe into `.opencode/skills/cli-devin/assets/`. Dry-run on a throwaway clone validates the filter-repo pipeline before Phase 005 commits to running 56 dispatches.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Check | Acceptance |
|------|-------|------------|
| G1 | Agent-config structural diff vs deep-research recipe shows only intentional differences | Manual review |
| G2 | Iter prompt template passes sk-prompt CLEAR 5-check | sk-prompt run |
| G3 | `sequential_thinking` mandated in agent-config | Recipe inspection |
| G4 | Tool allowlist is read-mostly + write scoped to packet dir + JSONL only | Recipe inspection |
| G5 | Dry-run on 5-row mapping succeeds on throwaway clone | Manual run |
| G6 | `validate.sh --strict` exits 0 | Validator passes |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Deep-skill 4-phase lifecycle (INIT → LOOP → SYNTHESIS → SAVE) adapted for commit-rewrite. State machinery: `commit-rewrite-config.json` (immutable) + `commit-rewrite-state.jsonl` (append-only) + `commit-rewrite-strategy.md` (mutable per iter) + `rewrites/iteration-NNN.md` (write-once) + `mapping.jsonl` (synthesis output). Convergence via the shared `stopReason`/`legalStop` enum from deep-research.

Batch size: 50 commits/iter × ~56 iters. Model pin: swe-1.6. Tool allowlist scoped to prevent RM-8-style scope violations.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Stage 1 — Read pattern references
- cli-devin: `deep-loop-iter-template.md`, `agent-config-deep-research-iter.json`, `deep-loop-iter-contract.md`
- deep-research: `state_format.md`, `loop_protocol.md`, `convergence.md`

### Stage 2 — Author state schema
- `templates/commit-rewrite-config.json` (immutable per-run config)
- `templates/commit-rewrite-state.jsonl-schema.md` (append-only record format)
- `templates/commit-rewrite-strategy.md` (mutable strategy doc)
- `templates/iteration-NNN.md` (per-iter output template)
- `templates/output-contract.md` (final synthesis output schema)

### Stage 3 — Author agent-config
- `templates/agent-config-commit-rewrite-iter.json` based on deep-research recipe
- Pin `model: swe-1.6`, `mcp_servers: [sequential_thinking]`, ≥5-thought system instruction
- Scoped tool allowlist (Read on standards + sk-git + packet; Exec on git log/show; Write on rewrites + JSONL only)

### Stage 4 — Author prompts
- `templates/iter-prompt-template.md` (BUILD framework + pre-planning + scoped task + output contract)
- `templates/synthesis-prompt.md` (consolidation pass + count check + legalStop)

### Stage 5 — Draft ADRs
- ADR-1: state-schema choices
- ADR-2: batch-size rationale (50 per iter, ~56 iters)
- ADR-3: convergence criteria (4-clause gate)
- ADR-4: tool-allowlist scoping (RM-8 prevention)

### Stage 6 — Dry-run
- Clone repo to /tmp/112-throwaway
- Hand-author 5-row `mapping.jsonl`
- Author `templates/callbacks/apply-mapping.py` filter-repo callback
- Run filter-repo against throwaway; verify 5 messages updated

### Stage 7 — Promote
- Copy `templates/agent-config-commit-rewrite-iter.json` to `.opencode/skills/cli-devin/assets/`
- Run `validate.sh --strict`; update implementation-summary and parent graph-metadata
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Two-tier: (a) structural diff of agent-config vs deep-research recipe to detect drift, (b) end-to-end dry-run on a throwaway clone of this repo with 5 hand-authored mappings. The dry-run proves the filter-repo callback path works before committing to 56 real dispatches in Phase 005.

sk-prompt CLEAR check on iter-prompt-template ensures dispatch prompts pass the cli-devin SWE-1.6 prompt-quality contract.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Phase 002 outputs (`commit-standards.md`, `derivation-heuristics.md`)
- `cli-devin` binary + `sequential_thinking` MCP
- Deep-research / deep-review pattern files (read-only references)
- `git filter-repo` (for dry-run)
- `sk-prompt` skill (for CLEAR check)
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

`rm -rf templates/ decision-record.md` and remove the cli-devin/assets promotion (`rm .opencode/skills/cli-devin/assets/agent-config-commit-rewrite-iter.json`). No git history mutated.
<!-- /ANCHOR:rollback -->
