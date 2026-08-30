---
title: "Task Breakdown: Gateway State-Write [system-deep-loop/036-deep-loop-innovation/015-gateway-contract-remediation/tasks]"
description: "Sequenced tasks T001-T010 remediating the ten 014-review findings plus the merge-tool bug, WS1 behind a real-dispatch negative-control gate, mapped to REQ/ADR/quality-gates."
trigger_phrases:
  - "task"
  - "breakdown"
  - "gateway"
  - "state"
  - "write"
  - "tasks"
  - "015"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/015-gateway-contract-remediation"
    last_updated_at: "2026-08-25T14:20:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the task breakdown"
    next_safe_action: "Author checklist.md, then generate metadata and validate"
    blockers: []
    key_files:
      - "plan.md"
      - "checklist.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Task Breakdown: Gateway State-Write Contract Remediation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

- `T0NN` — task id (referenced by `checklist.md`).
- Each task names its target file(s), the change, its verification, and its blocking dependency.
- `[gate]` marks a quality gate that blocks downstream tasks until it passes.
- Status: `[ ]` planned · `[~]` in progress · `[x]` done-with-evidence. All tasks start `[ ]` — this is a plan.

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

_Contract core (WS1) — blocks everything downstream._

- [ ] **T001 [gate G1] Intent check for ADR-002.** Read `append-mode-event.ts` (projection pipeline, Phase 5 ~:394) and grep for review/alignment legacy-projection consumers. Answer: does a consumer exist? Choose ADR-002 direction A (wire refresh) or B (validator accepts receipt). If ambiguous → STOP, Logic-Sync escalate. *Verify:* the answer + chosen direction recorded in `decision-record.md` ADR-002 status (Accepted).
- [ ] **T002 Fix the prompt-pack templates.** In `deep-review/assets/prompt-pack-iteration.md.tmpl:117-118`, `deep-research/assets/prompt-pack-iteration.md.tmpl:65`, and `deep-alignment/assets/alignment-prompt-pack.md.tmpl`, replace `echo '<json>' >> {state_paths_state_log}` with the gateway call `append-mode-event.cjs --mode <m> --run-directory <d> --event-json <single-record file>`. Preserve exit-2-is-halt; add NO direct-write fallback. *Verify:* grep of the three templates finds zero `>>` state-log redirects and one gateway call each.
- [ ] **T003 Apply the ADR-002 runtime change.** Direction A → extend `append-mode-event.ts`'s research-only projection-refresh branch (:191,205) to review/alignment. Direction B → change `verify-iteration.cjs` (~:165-170) to accept a gateway receipt as proof. Exactly one file changes. *Verify:* a gateway append for a review/alignment mode now satisfies the validator in a unit/integration check.
- [ ] **T004 [gate G2] Negative-control dispatch.** Run one real review (or alignment) iteration with a gateway-only leaf. Reproduce `state_record_missing` + redispatch on the PRE-fix tree; confirm a clean pass on the POST-fix tree. *Verify:* captured output + exit status for both states. **No Phase-2 task starts until G2 passes.**

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

_P1 closure (WS2–WS6) — parallelizable once G2 passes._

- [ ] **T005 ai-council MCP staleness (WS2, F-001).** Remove the `sequential_thinking` mandate + `mcp__sequential_thinking__*` tool grant from ai-council prompts/metadata in each runtime where the server is gone (`.opencode`, `.claude`, others); replace the Depth-1 mechanism with in-context sequential deliberation. Inspect `.pi/mcp.json`: remove if stale, keep+document only if it backs a live local server (ADR-003). *Verify:* grep for `sequential_thinking` returns only genuinely-live registrations; `AGENTS.md:391` no longer contradicted.
- [ ] **T006 Injection-guard parity (WS3, F-002) [security-adjacent].** Port the untrusted-target prompt-injection guard from `deep-alignment.md:25` into the research and review leaves AND their prompt packs. *Verify:* the guard block is present in research/review leaves + packs; closed-gate replay with file:line evidence.
- [ ] **T007 SKILL doctrine (WS4, F-003+P1-002, P2-004).** In `deep-review/SKILL.md:60` (and the alignment/ai-council SKILLs) replace "reduce-state.cjs is the SINGLE state writer" with the gateway-owned model (gateway = state-log writer; reducer = derived artifacts); add the gateway reference. Fix `deep-research/SKILL.md:272,439` "JSONL delta" → the gateway's single-record input. *Verify:* no SKILL claims a single non-gateway writer; each names the gateway; no "JSONL delta" mislabel.
- [ ] **T008 Confirm-YAML containment (WS5, P1-001) [security-adjacent].** Port the auto-YAML write-containment guards (worktree / dirty-path / recovery-baseline) into `deep-research-confirm.yaml` and `deep-review-confirm.yaml` post-dispatch steps. *Verify:* both confirm YAMLs carry the containment block; closed-gate replay.
- [ ] **T009 Guard hardening (WS6, P1-003, P2-001, P2-003) [security-adjacent].** In `check-agent-gateway.sh`: derive the expected agent count from the runtime×agent matrix and assert the floor; exit non-zero on any unresolvable target; extend regexes to single-`>`, `| tee`, no-space-backtick `--event-json`; extend the scan to the prompt-pack templates and mode YAMLs. Add a fixture of legitimate/illegitimate references. *Verify:* guard fails closed on a synthetic missing agent and on each new bypass shape; passes on the fixed tree.

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

_Tooling fix (WS7), P2 advisories, and the whole gate._

- [ ] **T010 Merge-tool fix + advisories + whole gate (WS7 + P2 remainder).** Fix `fanout-merge.cjs:759` to consume the field the lineage registries actually emit (`disposition`/`status` reconciled); add a regression fixture with one active finding asserting a non-empty, non-PASS merge (G5). Batch remaining P2 (P2-002 sandbox-prose dedup) with touched files. Then run the whole gate (G6): `validate.sh <spec-folder> --strict` exit 0, deep-loop runtime tests at baseline+delta, scoped-diff/no-stray sweep, metadata reconcile. *Verify:* G5 fixture green; G6 evidence captured.

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- T001–T010 all `[x]` with cited evidence.
- All six quality gates (G1–G6) recorded green.
- Every one of the ten findings + the merge bug maps to a completed task (see `checklist.md`).
- `validate.sh --strict` exit 0; scoped diff carries only the named surfaces + this packet.

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Requirements: `spec.md` REQ-001..010.
- Decisions: `decision-record.md` ADR-001 (canonical path), ADR-002 (T001/T003 direction), ADR-003 (T005), ADR-004 (T009).
- Gates: `plan.md` §2 G1–G6; phases §5; critical path §10.
- Findings source: `../014-gateway-alignment-review/review/review-report.md` §3 registry (F-008, F-001, F-002, F-003+P1-002, P1-001, P1-003, P2-001..004, TOOL).

<!-- /ANCHOR:cross-refs -->
