---
title: "Goal: cli-jev workflow integration"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "cli-jev workflow integration goal"
  - "jev research packet goal"
  - "jev integration completion criteria"
  - "jev goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration"
    last_updated_at: "2026-09-26T16:10:00Z"
    last_updated_by: "orchestrator-session"
    recent_action: "Authored the durable directive"
    next_safe_action: "Gather context for 001-deep-research"
    blockers: []
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/spec.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/001-deep-research/goal.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-workflow-integration"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
# Goal: cli-jev workflow integration

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> The durable slice runs from here to the log, and it is what the operator sets.
> A phase parent's limit is 4000 characters; `goal.cjs packet` measures it.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Find which Jev typed judgments earn a measured, opt-in place in `.skilled`, through 30 research iterations on three model families and a fresh Opus synthesis, then scaffold the recommended build phases as Planned children.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Three lineages of 10 iterations: `deepseek` (cli-pi, deepseek-v4.1-flash, max), `mimo` (cli-pi, mimo-v2.6-pro, high), `grok` (cli-cursor, grok-4.7-xhigh-fast, as no MAX tier exists) |
| D2 | Stop policy max-iterations, convergence off, concurrency 3 |
| D3 | Opus 5.5: medium for context, a fresh max for synthesis, high for build phases |
| D4 | Autonomous; stop only for a missing credential, an irreversible step or a push |
| D5 | Every recommendation is opt-in, works with no Jev key and sends Jev no secret |
| D6 | Worktree branch only, path-scoped commits, no push or merge |
| D7 | Build phases stay Planned; nothing recommended is built here |

### Operator copy

The operator holds this directive as the session objective, and that copy is
what judges completion, not this file. Whenever anything above the log changes
(objective, a decision, the binding table, a criterion), resend this file's
chat slice so the operator can update their copy. The chat slice is the
durable slice without its frontmatter, HTML comments, anchor markers, `---`
dividers or heading section numbers, and `goal.cjs packet` prints it as
`chat_slice`. Never send more than 4000 characters: cut this file first. Keep
reminding while the copy stays unset, and never stop work for it. A child goal
change that alters a parent decision or criterion is an amendment to the
parent: apply it there first, then resend the parent.
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

**Read the child goal before working a phase.** Each is authoritative for its
phase and binds as if written here.

| Phase | Goal document |
|-------|---------------|
| 001 | `001-deep-research/goal.md` |

**Precedence.** Decisions above outrank child detail. Child detail outranks any
summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Three to seven bullets, each checkable without opening another file. Copy them
verbatim into the objective: nothing dereferences a path, so criteria left only
here are invisible to whatever judges completion.

- [ ] `001-deep-research/context/` holds four digests and `research-angles.md` with 30 label-keyed angles
- [ ] cli-cursor's two allowlists list `grok-4.7-xhigh-fast`, their vitest files pass and a live probe replied `OK`
- [ ] Lineages `deepseek`, `mimo` and `grok` each hold `iteration-001.md` to `iteration-010.md` and a state log ending `maxIterationsReached`
- [ ] `research/research.md`, by a fresh Opus 5.5 max leaf, ranks each recommendation build-now, next, later or drop with a seam `file:line`, metric, opt-in behavior and smallest slice
- [ ] Each phase in the synthesis's proposed list is a Planned child with `spec.md`, `plan.md`, `tasks.md`, `goal.md`, a binding row and a phase-map row
- [ ] `validate.sh --strict --recursive` on this packet prints `RESULT: PASSED` and `check-goal.cjs` passes on the parent and every child
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
| Worktree | Done | `.worktrees/069-cli-jev-workflow-integration` at `f9d701bd13`, provisioned: 4 installed, 2 built, 0 failed |
| Scaffold | Done | `create.sh --phase` wrote the parent and `001-deep-research` |
| Context and angles | Done | Four digests (757 lines), `research-angles.md` with 30 angles, topic tightened by prompt-improver on Sonnet (748 chars) |
| Grok 4.7 roster | Done | `9fe8526284`; vitest 257/257, typecheck clean, guard fresh, live probe `OK` |
| Fan-out | Pending | |
| Synthesis | Pending | |
| Build phases | Pending | |

### Deviations and findings

| Item | Note |
|------|------|
| Grok 4.7 MAX fast | `cursor-agent --list-models` on 2026-09-26 lists `grok-4.7-{low,medium,high,xhigh}` with `-fast` variants and no MAX tier. The highest-effort fast id, `grok-4.7-xhigh-fast`, stands in (D1). |
| Level 1 child has no `acceptance-criteria.md` | sk-create-goal's phase-parent workflow expects one per child. The approved plan keeps the research child at Level 1, as packet 030 did, so its goal criteria come from `spec.md` requirements. |
| Spec-kit CLI build | `create.sh --phase` first failed in the fresh worktree because `runtime/cli/dist/` was not built; `npm run build` under `runtime/cli` fixed it. |
| prompt-improver on Opus | The agent definition denies Opus, so the topic pass ran on Sonnet, an eligible pair. |
| Close blocker | The fan-out close report no longer needs a root dashboard when lineage logs exist (`ed22403e09`), so no close blocker is expected. |
<!-- /ANCHOR:log -->
