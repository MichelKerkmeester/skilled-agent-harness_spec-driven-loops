---
title: "Goal: pi-fast-mode-w-subagent-support"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "pi fast mode subagent goal"
  - "fast mode fork goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "hooks/011-pi-fast-mode-w-subagent-support"
    last_updated_at: "2026-09-04T00:37:02+02:00"
    last_updated_by: "spec-validation-backfill"
    recent_action: "Restructured the goal onto the goal template"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-validation-backfill"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: pi-fast-mode-w-subagent-support

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Fork the upstream `pi-openai-fast-mode` Pi extension into a new package `pi-fast-mode-w-subagent-support` that keeps its `{ enabled, targets }` engine and adds strict parent-to-child subagent handoff of the fast-mode preference through an inherited environment variable, shipped as a tested raw-TypeScript Pi extension installed only after package, command-ownership, live-UI and rollback gates pass.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Env var `PI_FAST_MODE_W_SUBAGENT_SUPPORT`, strict `1` / `0`; invalid or unset means no opinion and never auto-enables a paid tier |
| D2 | Keep `{ enabled, targets }`; one-time legacy-path migration to an atomic new-path write; no dual-read; legacy file left untouched |
| D3 | Indicator is namespaced `ctx.ui.setStatus` (composes with footers, works in RPC mode); `setFooter` rejected |
| D4 | Precedence: explicit `--fast` / `/fast off` > inherited env `1`/`0` > persisted config; handoff never bypasses model/target gating; child is read-only |
| D5 | Install local-path first; npm publish deferred. Child-handoff proof pinned to `openai-codex/gpt-5.6-luna`. Live indicator proof is the RPC `setStatus` request JSON |
| D6 | Workstreams run in order: `001-fork-and-package`, `002-subagent-handoff`, `003-integration-and-tests`; each leaf passes `validate.sh --strict` before its handoff |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

**Read the child goal before working a phase.** Each is authoritative for its
phase and binds as if written here.

| Phase | Goal document |
|-------|---------------|
| 001-fork-and-package | `001-fork-and-package/goal.md` |
| 002-subagent-handoff | `002-subagent-handoff/goal.md` |
| 003-integration-and-tests | `003-integration-and-tests/goal.md` |

**Precedence.** Decisions above outrank child detail. Child detail outranks any
summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] The fork package keeps the `{ enabled, targets }` engine; `tsc --noEmit`, Vitest and `npm pack --dry-run` pass
- [ ] Strict `PI_FAST_MODE_W_SUBAGENT_SUPPORT=1|0` handoff, explicit-flag precedence and child isolation pass the handoff matrix and child-process test
- [ ] `/fast` ownership is proven with `get_commands`, and live `setStatus` and child-handoff receipts are recorded
- [ ] `.pi/PLUGINS.md` is updated, `sync-pi-configs.sh --check` passes and the rollback boundary is documented
- [ ] Every child phase passes `validate.sh --strict`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Deep research, 10 / 10 lanes | Done | `research/research.md` |
| Phase leaves and phase parents planned, evidence checklists written (145 items) | Done (2026-08-16) | Recorded in the earlier goal text |
| Packet status | Complete per spec | `spec.md` metadata Status and phase map rows read `complete` |

### Deviations and findings

| Item | Note |
|------|------|
| Earlier goal text read "Planned (0% built)" with next action `001-fork-and-package/001-source-baseline` | Superseded by the spec's Complete status; kept here as history |
| Binding rows name no child goal | Resolved 2026-10-03: each workstream now has a `goal.md` and its row points at it. The nine leaves under the workstreams each carry a `goal.md`, bound from their workstream goal |
| Highest empirical risk sat in `003-live-verification-and-sync` | Command-suffix renumbering, live RPC/TUI `setStatus` and real child inheritance need live `pi -e` / `get_commands` probes |
| npm publication | Open product decision; not required to build or install locally |
| Lean-trio restructuring | The earlier goal noted an in-flight restructuring to checkpoint before implementation |
<!-- /ANCHOR:log -->
