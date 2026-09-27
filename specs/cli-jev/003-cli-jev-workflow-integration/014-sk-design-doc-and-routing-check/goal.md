---
title: "Goal: Phase 14: sk-design-doc-and-routing-check"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/014-sk-design-doc-and-routing-check"
    last_updated_at: "2026-09-27T14:30:00Z"
    last_updated_by: "authoring-leaf"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-workflow-integration"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 14: sk-design-doc-and-routing-check

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

**Objective:** Bring sk-design's hub rules and md-generator gate docs into line with what its router and validator actually do, record the hub's first routing accuracy number from the tools that already exist and fix the SD-007 routing drift that number exposes.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Rule 6 of `.skilled/skills/sk-design/SKILL.md` changes only from a live `compiled-route.cjs --hub sk-design` rerun at build time. A legacy sentinel keeps rule 6 and is reported instead |
| D2 | The md-generator gate waits on the owner's choice, recorded in this phase's `spec.md`. Option A: the docs follow the code's zero-hard-failure gate. Option B: the code enforces the 80-point rule. The recommendation is A, because the code's gate is already stricter than 80 |
| D3 | The accuracy number comes from `compiled-route-admission.cjs` for the 4 hub scenarios with gold and from the `compiled-route.cjs` front door for the 49 mode scenarios. No harness, compiled-routing code or scenario prompt changes |
| D4 | Only files under `.skilled/skills/sk-design/` change, plus sk-design's re-minted activation manifest when the SD-007 fix edits `hub-router.json`. One path-scoped commit that `git revert` undoes. No model call |
| D5 | SD-007 is diagnosed after the replay baseline and fixed with the smallest vocabulary change or gold correction, only after the sk-design owner says yes |

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

- [ ] `node .skilled/bin/compiled-route.cjs --hub sk-design --prompt "make a bar chart of monthly revenue"` prints `"action":"route"`, and `grep -c "not in the compiled closure" .skilled/skills/sk-design/SKILL.md` prints `0`
- [ ] `grep -n "Owner choice: [AB]"` on this phase's `spec.md` prints one dated line, committed no later than the first md-generator change dated 2026-09-27 or after
- [ ] Under option A, `rg -n 'isPass[^A-Za-z]|>= ?80' -g '*.md' .skilled/skills/sk-design/sk-design-md-generator` prints nothing. Under option B, `npm test` in `sk-design-md-generator/backend` exits 0
- [ ] `.skilled/skills/sk-design/benchmark/reports/` holds one replay folder whose report states `N of M scored` over 53 playbook scenarios, and `benchmark/README.md` section 2 has a row naming that folder
- [ ] The build commit touches only paths under `.skilled/skills/sk-design/`, this phase folder and at most `.skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-design/manifest.json`
- [ ] After the SD-007 fix, `node .skilled/bin/compiled-route-admission.cjs --hub sk-design` prints `4 pass, 0 drift` and exits 0, and the rerun replay shows no scenario that matched its gold in the baseline and misses now
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
| Planning documents | Done | 2026-09-27: `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, this goal and `implementation-summary.md` authored from the owner-fix brief's section for this phase and `007-classifier-deep-research/research/research.md` section 8 |
| Live route check | Done | 2026-09-27: the chart prompt routed to `sk-design-chart`, a DESIGN.md prompt to `sk-design-md-generator` and `SPECKIT_COMPILED_ROUTING=0` printed the legacy sentinel, all exit 0 |
| Admission baseline | Done | 2026-09-27: `compiled-route-admission.cjs --hub sk-design` printed verdict `drift` with 3 pass, 1 drift, 0 stale and 2 modes without gold, exit 1 |
| Build | Pending | Nothing is built. The phase is Planned |

### Deviations and findings

| Item | Note |
|------|------|
| The 80-point rule is looser than the code | `score` loses 5 per hard failure and `claimsScore` 10 per `provenance` failure, which is hard. Enforcing 80 would pass documents the code fails today. This drives the option A recommendation |
| Wider gate inventory than the brief | The brief cites 5 doc sites. `rg -n 'isPass[^A-Za-z]\|>= ?80'` found 26 lines in 11 md-generator files, including `claims >= 80` expected signals in three playbook files |
| The existing harness covers 4 of 53 | `compiled-route-admission.cjs` reads gold only from the hub's own playbook folder, so the 49 mode scenarios need the front-door run script. No new harness is planned |
| SD-007 drift | The hub scenario `unknown-fallback/ambiguous-multi-intent.md` expects chart and diagram, and the engine routes diagram only. Its prompt, `Improve doc quality and add flowcharts for the new feature docs.`, names no data chart, so the gold may be the fault. The diagnosis decides |
| `report-gen.ts` left alone | Its "Pass" band at 80 is reached only with zero hard failures, where `score` is 100 |
| `parent-skill-check.cjs` baseline | Exit 1 on 2026-09-27 on `12-lib`, a missing `@spec-kit/shared` module, before any change |
| Title | The scaffold said "Phase 5". The files now say Phase 14, matching the parent phase map |
| Amendment: SD-007 fix | 2026-09-27, from the coordinator, citing the operator's request that every noticed fix has a spec and noting no other spec covers SD-007. The out-of-scope line and the later-phase question were replaced by REQ-008, AC-008, D5, tasks T019 to T022, plan steps 7 and 8 and a seventh criterion. D3, D4, REQ-006 and AC-006 now allow the re-minted activation manifest |
| Amendment: `parent-skill-check.cjs` risk | 2026-09-27, from the coordinator: the `12-lib` failure hits every hub in this worktree for a provisioning reason and phase `018-worktree-provision-shared-link` plans the fix. The risk row and T017 point there. Not confirmed by this leaf beyond the sk-design run, and 018's documents did not mention it when read |
<!-- /ANCHOR:log -->
