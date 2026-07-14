---
title: "Phase 004: cli-devin Rewrite Prompts"
description: "Author deep-skill-style state machinery and dispatch prompts for cli-devin (SWE-1.6) to retroactively rewrite all 2,795 HEAD commit messages in 50-commit batches across ~56 iterations."
trigger_phrases:
  - "112-cli-devin-rewrite-prompts"
  - "commit rewrite deep-loop"
  - "cli-devin commit rewrite iter"
  - "agent-config-commit-rewrite-iter"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-git/z_archive/091-commit-standards-and-retroactive-rewrite/004-cli-devin-rewrite-prompts"
    last_updated_at: "2026-07-14T21:12:36Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Scaffolded phase 004 docs; awaits phase 002 lock"
    next_safe_action: "Author 9 artifacts and pin agent-config recipe in cli-devin assets"
    blockers:
      - "Phase 002 must close (commit-standards + derivation-heuristics inputs)."
      - "Phase 003 should close (sk-git reflects final standards) — but Phase 004 can run in parallel with 003 if 002 is locked."
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "decision-record.md"
      - "templates/commit-rewrite-config.json"
      - "templates/iteration-NNN.md"
      - "templates/agent-config-commit-rewrite-iter.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-004-2026-05-16"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Final state-schema choices (record format, append-only fields)"
      - "Whether to ship a dedicated commit-rewrite-state.jsonl reducer or reuse the deep-research reducer"
    answered_questions:
      - "Batch size: 50 commits/iter (Plan-agent recommendation)"
      - "Total iters: ~56 (2,795 ÷ 50)"
      - "Model pin: swe-1.6"
      - "Permission mode: auto (read-only baseline; write scoped to packet dir only)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Phase 004: cli-devin Rewrite Prompts

<!-- SPECKIT_LEVEL: 1 -->
<!-- NOTE: Upgrade to Level 3 on activation. Pre-staged decision-record.md captures state-schema choices. -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 (upgrade to 3 on activation — decision-record.md pre-staged) |
| **Priority** | P1 |
| **Status** | Pending (blocked on Phase 002 close; can parallel Phase 003) |
| **Created** | 2026-05-16 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 4 of 5 |
| **Predecessor** | 003-sk-git-skill-update |
| **Successor** | 005-retroactive-rewrite-execution |
| **Handoff Criteria** | `agent-config-commit-rewrite-iter.json` schema-validates against cli-devin recipe pattern; iter template passes sk-prompt CLEAR 5-check; dry-run on 5 hand-authored mappings succeeds on throwaway clone |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the 112 packet. It authors the deep-skill-style scaffolding that Phase 005 will run. Modeled directly on:

- `.opencode/skills/cli-devin/assets/deep-loop-iter-template.md` (framework tag + pre-planning + scoped task + output contract)
- `.opencode/skills/cli-devin/assets/agent-config-deep-research-iter.json` (pinned recipe with `mcp_servers`, `permission_mode`, `tool_allowlist`)
- `.opencode/skills/deep-research/references/state_format.md` (config.json + state.jsonl + strategy.md + iterations/ + synthesis)
- `.opencode/skills/deep-research/references/loop_protocol.md` (4-phase lifecycle: INIT → LOOP → SYNTHESIS → SAVE)
- `.opencode/skills/deep-research/references/convergence.md` (`stopReason` enum + `legalStop` gate)

**Scope Boundary**: Author state machinery and prompts ONLY. No git history touched. No cli-devin dispatches executed (that's Phase 005). The artifacts live under this phase folder until ready; the agent-config recipe is promoted to `.opencode/skills/cli-devin/assets/` at phase close so Phase 005 can `--agent-config <path>` against it.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A 2,795-commit retroactive rewrite is too large for a single cli-devin dispatch. The deep-skill pattern (deep-research, deep-review) handles long-running deliberative work via batched iterations with externalized state, convergence detection, and a synthesis pass — but it has not been adapted for commit-message rewriting. Without that scaffolding, Phase 005 would be either (a) one giant dispatch that exceeds context limits, or (b) ad-hoc dispatches with no convergence story.

### Purpose
Mirror the proven deep-skill scaffolding for the commit-rewrite use case: batched iterations (50 commits/iter × ~56 iters), pinned agent-config recipe with mandatory `sequential_thinking` MCP, scoped tool allowlist, explicit output contract, and clear convergence criteria.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope — 9 Artifacts to Author

1. **`templates/commit-rewrite-config.json`** — Schema for the immutable per-run config: batch size, total commits, model pin (`swe-1.6`), session id, dimensions (`type-inference`, `subject-quality`, `body-quality`, `trailer-correctness`, `packet-id-handling`), `convergenceThreshold`, `stuckThreshold`.

2. **`templates/commit-rewrite-state.jsonl-schema.md`** — Append-only record format per iter: `iter`, `batch_range`, `commits_processed`, `commits_flagged_review`, `new_info_ratio`, `timestamp`, `durationMs`, `executor=cli-devin`, `model=swe-1.6`, `status`.

3. **`templates/commit-rewrite-strategy.md`** — Mutable per-iter "what worked / what failed / next focus / known context".

4. **`templates/iteration-NNN.md`** — Required headings for each iter's output file: `# Iter NNN`, `## Batch range (commit hashes)`, `## Per-commit mapping (old → new)`, `## Flags`, `## JSONL delta`.

5. **`templates/output-contract.md`** — Defines the final synthesis output schema: `mapping.jsonl` with one row per HEAD commit `{old_hash, new_subject, new_body, new_trailers, justification, flags}`.

6. **`templates/agent-config-commit-rewrite-iter.json`** — Pinned cli-devin recipe (model=`swe-1.6`, `mcp_servers: [sequential_thinking]` mandatory with per-iter ≥5 thoughts, tool allowlist scoped to `Read(.opencode/specs/skilled-agent-orchestration/112-…/**)` + `Read(.opencode/skills/sk-git/**)` + `Read(commit-standards.md, derivation-heuristics.md)` + `Exec(git log ...)` + `Write(rewrites/iteration-NNN.md)`, `--permission-mode auto`).

7. **`templates/iter-prompt-template.md`** — The per-iter prompt body, copy-paste-able by Phase 005. Structure: framework tag (BUILD) → pre-planning block → scoped task (batch range) → output contract → stop condition.

8. **`templates/synthesis-prompt.md`** — The final synthesis dispatch prompt: consolidate 56 iteration markdowns into a single `mapping.jsonl`, validate against commit count, emit `legalStop=true`.

9. **`decision-record.md`** — ADRs covering state-schema choices, batch-size rationale, convergence criteria, agent-config tool-allowlist scoping.

### Promotion at Phase Close

- After review, copy `templates/agent-config-commit-rewrite-iter.json` to `.opencode/skills/cli-devin/assets/agent-config-commit-rewrite-iter.json`. Phase 005 dispatches reference the promoted path.

### Out of Scope

- Running the dispatches (Phase 005).
- Adding rewrite-specific ALWAYS rules to cli-devin SKILL.md §4 (decide during execution if needed; minimal-change preferred).
- Touching deep-research / deep-review skills.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `templates/commit-rewrite-config.json` | Create | Per-run config schema |
| `templates/commit-rewrite-state.jsonl-schema.md` | Create | JSONL record format |
| `templates/commit-rewrite-strategy.md` | Create | Mutable strategy doc template |
| `templates/iteration-NNN.md` | Create | Per-iter output template |
| `templates/output-contract.md` | Create | Synthesis output schema |
| `templates/agent-config-commit-rewrite-iter.json` | Create | Pinned cli-devin recipe |
| `templates/iter-prompt-template.md` | Create | Per-iter prompt body |
| `templates/synthesis-prompt.md` | Create | Final synthesis prompt |
| `decision-record.md` | Create | ADRs for schema + sizing |
| `.opencode/skills/cli-devin/assets/agent-config-commit-rewrite-iter.json` | Create (promote) | At phase close |
| `implementation-summary.md` | Update | Fill at phase close |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance |
|----|-------------|------------|
| REQ-001 | Agent-config schema-validates against cli-devin pattern | Structural diff against `.opencode/skills/cli-devin/assets/agent-config-deep-research-iter.json` shows only intentional differences (model pin, tool allowlist, dimensions) |
| REQ-002 | Iter prompt template passes sk-prompt CLEAR 5-check | Run `sk-prompt` validation; record pass in implementation-summary |
| REQ-003 | Sequential_thinking mandate enforced in agent-config | `mcp_servers` includes `sequential_thinking`; `system_instructions` mandates ≥5 thoughts per iter |
| REQ-004 | Tool allowlist is read-mostly + scoped-write | Allowlist permits Read on standards/sk-git/spec folder; Exec on `git log`/`git show`; Write ONLY on `rewrites/iteration-NNN.md` + JSONL appends within packet dir |
| REQ-005 | Dry-run on 5 hand-authored mappings succeeds | Hand-author a 5-row `mapping.jsonl`, run filter-repo callback against a throwaway clone of this repo, confirm 5 messages updated as expected |
| REQ-006 | Convergence criteria explicit | `decision-record.md` ADR specifies: (a) `mapping.jsonl` count == 2,795, (b) zero needs_human_review entries or operator-cleared, (c) 5% adversarial sample pass, (d) `legalStop=true` |
| REQ-007 | `validate.sh --strict` exits 0 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- All 7 REQs pass.
- Agent-config is promotion-ready (passes structural diff against deep-research recipe).
- Dry-run on a throwaway clone proves the filter-repo pipeline works end-to-end on a small sample.
- Phase 005 can begin execution immediately by reading `iter-prompt-template.md` and dispatching cli-devin.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Agent-config drift from deep-research baseline**: every variation introduces non-determinism. Mitigation: structural diff at REQ-001; minimize differences.
- **Tool allowlist too permissive**: cli-devin with broad write access on a worktree mid-rewrite is RM-8 territory (`feedback_rm8_mitigation_works_under_deepseek`, `reference_cli_opencode_destructive_scope_doc`). Mitigation: scope write to `rewrites/iteration-NNN.md` + JSONL appends only; disallow Bash; disallow git mutations.
- **Sequential_thinking session exhaustion**: 50 commits × ≥5 thoughts/iter × 56 iters = significant budget. Mitigation: allow batch reduction if budget proves insufficient; record per-iter thought count.
- **Convergence criteria too soft**: if `needs_human_review` is allowed to leak through, Phase 005 will halt mid-apply. Mitigation: REQ-006 makes the gate explicit.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should the per-iter prompt include the FULL `commit-standards.md` inline, or reference it by path and assume cli-devin reads it? Path-reference saves context budget; inline guarantees fidelity. Likely path-reference with strict instruction.
- Whether to add `sequential_thinking` thought-count to JSONL delta for budget tracking.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- Parent: `../spec.md`
- Predecessor: `../003-sk-git-skill-update/spec.md`
- Successor: `../005-retroactive-rewrite-execution/spec.md`
- Pattern references:
  - `.opencode/skills/cli-devin/assets/deep-loop-iter-template.md`
  - `.opencode/skills/cli-devin/assets/agent-config-deep-research-iter.json`
  - `.opencode/skills/cli-devin/references/deep-loop-iter-contract.md`
  - `.opencode/skills/deep-research/references/state_format.md`
  - `.opencode/skills/deep-research/references/loop_protocol.md`
  - `.opencode/skills/deep-research/references/convergence.md`
- Inputs (from Phase 002): `commit-standards.md`, `derivation-heuristics.md`
