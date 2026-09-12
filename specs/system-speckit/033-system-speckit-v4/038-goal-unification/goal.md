---
title: "Goal: Goal unification"
description: "Make the packet goal.md the single source of goal state for every runtime, and make spec-kit keep it current and resend it without being asked."
trigger_phrases:
  - "goal unification"
  - "packet goal single source"
  - "goal.md across runtimes"
  - "frontmatter never sent in chat"
  - "parent goal resend"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/038-goal-unification"
    last_updated_at: "2026-09-11T07:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "Closed all seven phases with review fixes and a green sweep"
    next_safe_action: "Operator review of AGENTS.md wording, then commit; schedule the 008 backlog"
    blockers: []
    key_files:
      - "goal.md"
      - "spec.md"
      - "001-goal-unification-research/research/deep-research-strategy.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-11-system-spec-kit-goals"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Whether the ESM opencode plugin can import a CommonJS slice module without a build step"
      - "Host injection caps for pi, cursor, devin, Claude Code and Codex"
    answered_questions:
      - "Binding is an explicit per-session pointer written by a deliberate bind, never inferred"
      - "The store is demoted to a per-session index; it holds zero records on this checkout"
      - "Claude Code and Codex keep host-private goal surfaces; the packet goal.md reaches them through speckit commands"
      - "Goal commands ship for pi, opencode, cursor and devin; Claude Code and Codex keep their native goal command"
      - "Research runs sequentially: iterations 1-10 deepseek-v4.1-flash, 11-15 glm-5.3-flash, no early convergence"
---
# Goal: Goal unification

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make the packet `goal.md` the single source of goal state for every runtime, and make spec-kit keep it current and resend it without being asked.

### Decisions

| ID | Decision |
|----|----------|
| D1 | A session binds to one packet. Goal state lives in that packet's `goal.md`, nested when phased, singular otherwise. |
| D2 | The `.opencode/skills/.state/goal` store is demoted to a per-session index with liveness and telemetry. It never holds the directive. |
| D3 | Frontmatter is never sent to chat, injected, or stored in an objective. One strip function serves every surface. |
| D4 | A durable-slice change triggers an unprompted parent resend. Reminders repeat while unset. Work never stops unless told. |
| D5 | Goal commands ship for pi, opencode, cursor and devin (devin is a new adapter). Claude Code and Codex keep their native goal command; nesting reaches them via speckit commands and conversation. |
| D6 | Parent durable slice: warn at 3000, error at 4000 characters, frontmatter excluded. Children are unbounded. |
| D7 | Research precedes every build decision: 10 deepseek-v4.1-flash then 5 glm-5.3-flash iterations, no early convergence. |
| D8 | The always-on goal posture is one `AGENTS.md` row; mechanics stay in spec-kit. No repo rule. |

### Operator copy

The operator's copy judges completion. When anything above the log changes,
resend the durable slice in chat, frontmatter excluded. A child change that
alters a parent decision or criterion is amended here first, then resent.
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

**Read the child goal before working a phase.** Each binds as if written here.

| Phase | Goal document |
|-------|---------------|
| 001-goal-unification-research | `001/goal.md` |
| 002-decisions-and-contract-freeze | `002/goal.md` |
| 003-speckit-goal-contract | `003/goal.md` |
| 004-goal-core-packet-backed | `004/goal.md` |
| 005-runtime-surfaces | `005/goal.md` |
| 006-speckit-command-integration | `006/goal.md` |
| 007-retirement-docs-and-verification | `007/goal.md` |
| 008-hardening-research | `008/goal.md` |
| 009-close-open-decisions | `009/goal.md` |
| 010-repo-wide-goal-research | `010/goal.md` |
| 011-goal-drift-remediation | `011/goal.md` |
| 012-open-items-research | `012/goal.md` |

**Precedence.** Decisions above outrank child detail; child detail outranks any
summary of it. Name a conflict rather than resolving it silently.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `goal.md.tmpl`, the set-string playbook and `spec-kit-docs.json` agree on the frontmatter-strip boundary and the 4000-character durable budget. (003)
- [x] A restored validator rule warns a parent `goal.md` over 3000 durable characters, fails it over 4000, and fails a binding row naming a missing child `goal.md`. (003)
- [x] `goal-core.cjs` reads and writes the packet `goal.md` as the source of truth, and no chat or injection path emits frontmatter. (004)
- [x] Every shipped runtime surface resolves the same packet `goal.md` for the same session; deferred runtimes are named in the decision record. (005)
- [x] speckit plan, implement, complete and save update the parent `goal.md` on a decision, binding or criterion change and resend the stripped slice; resume resends without mutating. (006)
- [x] The legacy goal state store is demoted per D2, with a migration note covering both key schemes. (007, 006)
- [x] `AGENTS.md` carries the goal posture row and a quick-reference entry; no repo rule duplicates it. (007, 006)
- [x] `validate.sh --strict` over the whole packet, the goal hook `node --test` suites and the opencode-goal plugin tests all pass. (007)
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
| Packet scaffolded (parent + 7 children) | Done | `create.sh --phase --level phase-parent --with-goal`, 2026-09-11 |
| Parent goal sent in chat | Done | Operator set it via /goal on 2026-09-11 (pasted copy carries terminal wrap artifacts; this file is the source) |
| 001 research run 1 (deepseek, 10 iterations) | Done | 10 iteration files, `lineages/deepseek/research.md` (20 KB, decision matrix D1-D7), stop reason maxIterationsReached. Driver marked the lineage failed on write containment tripped by another session editing `.opencode/skills/mcp-tooling/`; those three files restored from the containment patch. |
| Review pass 3 | Done | 5 iterations, 0 P0, 0 P1, 10 P2, nine fixed; hook 124, plugin 138, validator 27, drift PASS |
| 008 hardening research | Done | 5 research iterations + 5 review iterations on deepseek max; ten do-now rows and six review advisories built; 122/137/26 green; backlog recorded |
| 007 retirement, docs, verification | Done | Store demoted with migration note; docs rewritten; sweep 8/8 + 112 + 135 + 25 + drift; review 5 P1 fixed, 6 P2 follow-ups recorded |
| Criteria 1-8 | Done | Each criterion has its evidence in the phase logs and summaries: 1-2 in 003, 3 in 004, 4 in 005, 5 in 006, 6-7 in 007 and 006, 8 in 007 |
| 005 runtime surfaces | Done | opencode bind/resent/packet, pi and cursor reminder, devin adapter; 110/110 + 134/134; playbook on the real packet |
| 006 speckit command integration | Done | packet_goal YAML blocks, save log step, AGENTS.md posture row, natural-language triggers |
| 004 goal-core packet-backed | Done | goal-slice.cjs + bind/unbind/resent/log; 105/105 hook tests, 132/132 plugin tests, drift PASS |
| 003 spec-kit goal contract | Done | Template, playbook, contract JSON, validator diagnostics 005/006, vitest 25/25, parent warns at 3864 |
| 002 decisions frozen | Done | Eight ADRs in `002-decisions-and-contract-freeze/decision-record.md` from `research/synthesis.md` |
| 001 research run 2 (GLM, 5 iterations) | Done | `lineages/glm/iterations/iteration-011..015.md`, `research.md` (21 KB, 27 corrections, no run-1 option overturned, D6 recommendation corrected). Containment again reverted another session's 12 files; restored from the patch. |

### Deviations and findings

| Item | Note |
|------|------|
| Parent `goal.md` rendered by hand | Phase mode scaffolds child goals from `--with-goal` but not the parent; rendered from `goal.md.tmpl` at level phase. |
<!-- /ANCHOR:log -->
