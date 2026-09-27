---
title: "Goal: Phase 9: cli-jev-hub-move"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "cli-jev hub move goal"
  - "cli-jev into cli-classifier criteria"
  - "cli-jev replay baseline goal"
  - "cli-jev move kill criterion"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/009-cli-jev-hub-move"
    last_updated_at: "2026-09-27T09:40:00Z"
    last_updated_by: "authoring-leaf"
    recent_action: "Authored the directive from the round-3 synthesis, section 14"
    next_safe_action: "Record the route replay baseline once 008 and question 49 clear"
    blockers:
      - "008-cli-classifier-hub is Planned"
      - "Research open question 49: no Deem arm result kept yet"
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/009-cli-jev-hub-move/spec.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/007-classifier-deep-research/research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-workflow-integration"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Should the move wait on a Deem result the operator keeps (research question 49)"
    answered_questions: []
---
# Goal: Phase 9: cli-jev-hub-move

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything between the frontmatter and the log is the DURABLE SLICE: it is
> what an operator sets as the session objective, and it must stay true for the
> life of the packet. The frontmatter above it is bookkeeping and never leaves
> this file: it is not sent in chat, not injected, not stored in an objective.
> Keep the slice short. A phase parent or top-level packet has one limit, 4000
> characters, measured from the frontmatter's closing fence to the log anchor.
> Up to 4000 passes and past it fails; the runtime goal surfaces cap what they
> hold, and a truncated objective loses its tail, which is where the criteria
> live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Move the `cli-jev` hub into the `cli-classifier` hub (proposed, phase 008) as mode `cli-jev` over its unchanged packet `cli-usage`, beside `cli-deem` (proposed), so every canary case and hub-routing scenario routes as it did before the move.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Build only after 008 is Complete and the operator keeps a Deem arm result. With no kept result the phase stays Planned and is never built |
| D2 | Record the replay of the 7 canary cases and the 3 hub-routing scenarios through `--hub cli-jev` before any file moves |
| D3 | Move all 81 hub files with `git mv`. Hub-level files merge into their `cli-classifier` counterparts. Never move part of the hub and then delete the rest |
| D4 | One commit holds the move, the merges, every literal list and the regenerated artifacts. Changelogs and dated benchmark reports stay as written |
| D5 | Kill: any canary case or hub-routing scenario that routes differently after the move means `git revert` of that commit |

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

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Three to seven bullets, each checkable without opening another file. Copy them
verbatim into the objective: nothing dereferences a path, so criteria left only
here are invisible to whatever judges completion.

- [ ] A baseline file holds the route JSON and exit status of all 10 prompts through `compiled-route.cjs --hub cli-jev`, taken while `git ls-files .skilled/skills/cli-jev` printed 81 lines
- [ ] After the move commit, `git ls-files .skilled/skills/cli-jev` prints 0 lines, and that commit's `git show -M --name-status` has a rename for every moved file and a `D` row only for a hub-level file merged into a `cli-classifier` counterpart
- [ ] `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/cli-classifier` exits 0, and its `mode-registry.json` lists two modes, one of them `cli-jev` with packet `cli-usage`
- [ ] The 10 prompts replayed through `--hub cli-classifier` match the baseline on `action`, `selectionKind` and `packetId` for every prompt, or the move commit is reverted
- [ ] `git grep -l '\.skilled/skills/cli-jev/' -- . ':!specs' ':!**/changelog/**' ':!**/benchmark/reports/**'` prints nothing
- [ ] `validate.sh --strict` on this phase prints `RESULT: PASSED`
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
| Planning documents | Done | `spec.md`, `plan.md`, `tasks.md`, this goal and `implementation-summary.md` authored on 2026-09-27 from `007-classifier-deep-research/research/research.md` section 14 (`### 009-cli-jev-hub-move (new)`), R23 in section 12, What Not To Build row 104 and ledger rows 79 to 94 |
| Literal lists reopened | Done | 2026-09-27 at the worktree HEAD: `compiled-route.cjs:35`, `compiled-route-sync.cjs:59`, `compiled-route-guard.cjs:47`, `compiled-routing-flag.ts:19` and `:37`, `resolve.cjs:36-44` (`cli-jev` at `:41`), `serving-closure.manifest.json:5-13` (`:10`) and `dispatch-audit.mjs:46`, `:234`, `:237` all hold `cli-jev` as section 14 says |
| Footprint recount | Done | `git ls-files .skilled/skills/cli-jev` 81, 59 in `cli-usage`, 22 at hub level. `git grep -l cli-jev` outside `specs/` and the hub: 48. Canary fixture: 7 cases |
| Build | Pending | Blocked on 008 and on research open question 49. Nothing is built |

### Deviations and findings

| Item | Note |
|------|------|
| Operator approval of a new phase | Section 14 says each amendment waits for operator approval. The parent goal's D5 and fourth criterion direct that each proposed phase become a Planned child, so the phase was authored without asking |
| Replay comparison rule | Section 14 says "routes differently" without a comparison rule. The phase compares `action`, `selectionKind` and `packetId`, reading hub `cli-jev` as `cli-classifier` and mode `cli-usage` as `cli-jev`. It ignores `effectivePolicyHash` and `generation`, which the merged registry changes by construction. This is the leaf's judgment |
| Dated benchmark reports | Section 14's stale-path check excludes only changelogs. `cli-usage/benchmark/reports/2026-09-20-post-migration-reverification/skill-benchmark-report.md:15` names the old path as the place a past run happened, and the packet is to stay unchanged, so the check also excludes `benchmark/reports/`. This is the leaf's judgment |
| Hub-level merges | `git mv` cannot land on a file 008 already created, so the 8 hub-root files merge into their counterparts and leave `D` rows. The guard against row 104's `rm -rf` is that `D` rows are limited to files the disposition table names as merged |
| "About 48 edited" | 48 files name `cli-jev` outside `specs/` and the hub, and 4 of them are changelogs that stay as written, so at most 44 take an edit. Some lines record history and stay too |
| Level and priority | Level 1 per the orchestrator's assignment. P2, because the phase runs last and only on a kept Deem result |
<!-- /ANCHOR:log -->
