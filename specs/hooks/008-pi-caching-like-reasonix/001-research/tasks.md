---
title: "Tasks: Pi Reasonix-Style Caching Research"
description: "Route verification, 20 non-converging fan-out iterations (SOL/TERRA/LUNA per iteration), claim ledger, synthesis, validation."
trigger_phrases:
  - "pi caching research tasks"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "hooks/008-pi-caching-like-reasonix/001-research"
    last_updated_at: "2026-08-06T11:48:24Z"
    last_updated_by: "spec-author"
    recent_action: "Task list authored"
    next_safe_action: "T001 route verification"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-06-cli-039-research"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Pi Reasonix-Style Caching Research

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

> **Iteration RQ rotation:** RQ1 = Reasonix claims · RQ2 = Pi caching surface · RQ3 = lumo.md gap features · RQ4 = plugin feasibility. Each iteration fans out to all three executors (SOL high, TERRA max, LUNA max via cli-codex), fresh context per dispatch.

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Preload cli-codex SKILL.md; verify GPT-5.6 SOL/TERRA/LUNA routes enabled by successful `cli-codex` dispatches (`research/orchestration-status.log`, `research/lineages/*/research.md`)
- [ ] T002 Dry-run `/deep:research:auto` to confirm setup resolves and halts before dispatch (superseded by real launch; not executed as a dry-run)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

> **Execution:** launch `/deep:research:auto` with the 3-lineage `--executors` payload (SOL high / TERRA max / LUNA max via cli-codex), `--max-iterations=20 --stop-policy=max-iterations --concurrency=3`. The runtime drives each lineage's 20 iterations; the list below is the research **coverage agenda** the lineages must collectively address, not manual per-iteration dispatch.

- [x] T003 Launch the 3-lineage `/deep:research:auto` run; confirmed `research/lineages/{sol-high,terra-max,luna-max}/` exists and each lineage fulfilled after SOL targeted retry
- [x] T004 Coverage — RQ1: Reasonix hit-rate + cost-delta claims → primary source (`research/research.md` §4)
- [x] T005 Coverage — RQ2: Pi native `cache_control` / provider-agnostic layer; `pi-cache-optimizer` existence + what it does (`research/research.md` §§4, 6, 7)
- [x] T006 Coverage — RQ4: DeepSeek prefix-cache API limits + plugin architecture surface Pi exposes (tools/commands/events) (`research/research.md` §§5, 6, 9)
- [x] T007 Coverage — RQ1: Reasonix "cache-first by design" / DeepSeek coupling + reliability/source-class of its figures (`research/research.md` §§3-5)
- [x] T008 Coverage — RQ2: Pi cross-agent cache sharing; Pi savings claims (70–90%) verify/refute (`research/research.md` §4)
- [x] T009 Coverage — RQ3: Context Engine v2, MCP first-class, plan mode, checkpoints & rewind — real gap vs already covered (`research/research.md` §8)
- [x] T010 Coverage — RQ4: cache-invalidation frequency + state-persistence/concurrency race risks (`research/research.md` §§9-10)
- [x] T011 Coverage — RQ1: Reasonix DeepSeek-only lock-in extent; adversarial check of the $61→$12 claim (`research/research.md` §4)
- [x] T012 Coverage — RQ2: Pi caching diagnostics / flag-insertion surface; cost-control runtime tools already in Pi (`research/research.md` §§6-9)
- [x] T013 Coverage — RQ3: logging/monitoring + recovery/updates gaps (`research/research.md` §8)
- [x] T014 Coverage — RQ4: overall effort estimate + cost/benefit inputs (`research/research.md` §§10, 13)
- [x] T023 Monitor the run; runtime wrote each iteration to `research/lineages/{label}/iterations/` + appended lineage JSONL (`research/orchestration-status.log`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T024 Confirm `research/research.md` resolves every lumo.md claim → verified/refuted/unknown + cited source + reliability class (`research/research.md` §§3-4)
- [x] T025 Confirm `research/research.md` answers RQ1–RQ4 with citations, gap table, feasibility + cost/benefit, and lineage-divergence notes (`research/research.md` §§4, 8-13)
- [x] T026 Verify each lineage logged 20 iterations; stop reason `maxIterationsReached` (count check: `sol-high=20`, `terra-max=20`, `luna-max=20`; `research/research.md` §16)
- [x] T027 Run `validate.sh --strict` on this phase folder; mark checklist with evidence (`validate.sh .opencode/specs/hooks/008-pi-caching-like-reasonix/001-research --strict`: 0 errors, 0 warnings)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]` (T002 remains open because dry-run was not executed)
- [x] No `[B]` blocked tasks remaining
- [x] Claim ledger and synthesis are consolidated in `research/research.md`; 60 logged iteration files present under `research/lineages/*/iterations/`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
