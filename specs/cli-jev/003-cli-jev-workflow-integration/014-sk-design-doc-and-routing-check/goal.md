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
    last_updated_at: "2026-09-27T19:45:00Z"
    last_updated_by: "closure-leaf"
    recent_action: "Amended AC-006, criterion 5, REQ-006 and D4 at close; all seven criteria ticked"
    next_safe_action: "None. The phase is closed; the orchestrator commits"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-workflow-integration"
      parent_session_id: null
    completion_pct: 100
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
| D4 | Only files under `.skilled/skills/sk-design/` change, plus generated derivatives: Hermes copies and the re-minted activation manifest with its mirror. Three build commits, and a rollback reverts those three. No model call |
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

- [x] `node .skilled/bin/compiled-route.cjs --hub sk-design --prompt "make a bar chart of monthly revenue"` prints `"action":"route"`, and `grep -c "not in the compiled closure" .skilled/skills/sk-design/SKILL.md` prints `0`
- [x] `grep -n "Owner choice: [AB]"` on this phase's `spec.md` prints one dated line, committed (`6f47c32dce`, 18:04:32) before this build's first md-generator commit (`fb04862cee`, 18:30:45)
- [x] Under option A, `rg -n 'isPass[^A-Za-z]|>= ?80' -g '*.md' .skilled/skills/sk-design/sk-design-md-generator` prints nothing. Under option B, `npm test` in `sk-design-md-generator/backend` exits 0
- [x] `.skilled/skills/sk-design/benchmark/reports/` holds one replay folder whose report states `N of M scored` over 53 playbook scenarios, and `benchmark/README.md` section 2 has a row naming that folder
- [x] The build commits touch only `.skilled/skills/sk-design/`, this phase folder and generated derivatives: `.hermes/skills/` copies and the sk-design activation manifest with its mirror
- [x] After the SD-007 fix, `node .skilled/bin/compiled-route-admission.cjs --hub sk-design` prints `4 pass, 0 drift` and exits 0, and the rerun replay shows no scenario that matched its gold in the baseline and misses now
- [x] `validate.sh --strict` on this phase prints `RESULT: PASSED`
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
| Baselines (O1) | Done | 2026-09-27, orchestrator at `6f47c32dce`: the chart and DESIGN.md prompts routed to `sk-design-chart` and `sk-design-md-generator`, the kill switch printed the legacy sentinel, exit 0. Admission `drift`, pass 3 drift 1, exit 1. `parent-skill-check.cjs` exit 0 with 0 warnings. The option A `rg` found 26 lines in 11 files. Source: the orchestrator's build evidence |
| Owner gate choice | Done | 2026-09-27: `Owner choice: A` in `spec.md`, commit `6f47c32dce`, before any gate edit |
| Build | Done | 2026-09-27, commit `fb04862cee`: brief 01 (pi) rewrote rule 6, briefs 02 to 12 (pi) changed 27 lines in 11 md-generator files with per-file numstat matching the index, brief 13 (codex gpt-5.5 medium) wrote the 49-probe run script, prompts `IDENTICAL` to their scenarios. The orchestrator verified each brief. O2: `rg` no match (exit 1), backend diff empty |
| Replay and report | Done | 2026-09-27, commit `def91d168d`: `raw/admission.json` (drift, 3 pass 1 drift, exit 1), `raw/mode-routing.txt` (49 sections, 49 `RC: 0`, a second run byte-identical) and the report, **40 of 52 scored, 1 n/a, 12 misses**, recounted against `raw/`. Brief 14 (pi) added the README row |
| SD-007 diagnosis and owner yes | Done | 2026-09-27: report section 6 names the cause. `SD-007 fix approved: option (b)` recorded in commit `c114d00d97` after the operator answered "Correct the gold (Recommended)" |
| SD-007 fix and proof | Done | 2026-09-27, commit `31768cc51e`: brief 15 (pi) set the frontmatter gold to `sk-design-diagram`, numstat `4 10`. Admission prints `4 pass, 0 drift`, exit 0. Status `compiled-serving`. The after-fix replay is byte-identical to the baseline. `compiled-route-guard.cjs` all hubs fresh, exit 0 |
| Phase-close gates | Done | 2026-09-27 at `31768cc51e`, orchestrator: g1 to g5 pass. g6: the run script calls only `node .skilled/bin/compiled-route.cjs`, but the changed paths include `.hermes/skills/` and the two sk-design activation manifests, which the amendment at close allows |
| Phase docs | Done | 2026-09-27, closure leaf: tasks, acceptance criteria, this log and `implementation-summary.md` record the evidence. `validate.sh --strict` and `check-goal.cjs` results are in `implementation-summary.md` Verification. Status Complete after the amendment at close |

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
| `parent-skill-check.cjs` baseline moved (build) | At `6f47c32dce` it exited 0 with all hard invariants passed and 0 warnings. The `12-lib` failure no longer exists after the main merge, so T003 and T017 compare exit 0 with exit 0. Source: the orchestrator's build evidence |
| Option A is 27 lines, not 26 (build) | `quality-checklist.md:478` sits inside VS-05, which `spec.md` names as `:476-479`, but is not an inventory hit. Brief 03 rewrote it too. Source: the orchestrator's build evidence and `scratch/briefs/00-index.md` |
| `claims 100`, not `failures: []` (build) | T007 said to write `failures: []`. Briefs 08 to 10 write `claims 100`, because those lines already assert zero failures and a zero-failure run scores `claimsScore` 100 (`validate.ts:661`). Source: the orchestrator's build evidence |
| Activation manifests re-minted (build) | The pre-commit route-remint gate re-minted `.skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-design/manifest.json` and its `specs/sk-doc/019` mirror in `fb04862cee`, because the hub `SKILL.md` is a routing input. D4 and REQ-006 allow the manifest only under the vocabulary option, and the gold option was taken. Generated, not hand-edited. Source: the orchestrator's build evidence |
| Hermes copies regenerated (build) | `.hermes/skills/sk-design/SKILL.md` and `.hermes/skills/sk-design-md-generator/SKILL.md` are generated copies of the two edited `SKILL.md` files, regenerated with the owner's sync tool. Outside the spec's file list. Source: the orchestrator's build evidence |
| Five commits, not one (build) | D4 and the rollback plan name one path-scoped commit. The build landed as `fb04862cee`, `def91d168d` and `31768cc51e`, with the owner answers in `6f47c32dce` and `c114d00d97`, because the owner's SD-007 yes came after the replay. A rollback reverts the three build commits. Source: `git log` on the worktree |
| `benchmark/reports/` created (build) | The folder did not exist. Brief 13 created it with the run script. Source: the orchestrator's build evidence |
| SD-007 body left as it is (build) | The approved fix was frontmatter only, so the body still states CHART+FLOWCHART as the expected intent (`ambiguous-multi-intent.md` lines 47, 50, 78, 97 and 108). A follow-up for the sk-design owner. Source: the orchestrator's build evidence |
| Chart lost its admission gold (build) | After the fix, admission reports "3 mode(s) without gold", chart among them. The report records this as the cost of option (b). Source: the orchestrator's build evidence and report section 6 |
| Run label and the kebab checker (build) | `check_authored_name_kebab.py` rejects the double-hyphen run label that sk-create-benchmark's naming grammar (section 6) and the existing cli-jev report label use. A checker finding for its owner. Source: the orchestrator's build evidence |
| Executors (build) | codex hit its usage limit mid-wave. Every brief of this phase had already run on pi or codex before that. Brief 09 reported BLOCKED on its own check pattern, which lacked a backtick; its file matches the brief's new text, so the edit stands. Brief 15's first launch was stopped before it wrote anything because its VERIFY expected numstat `2 8`; the corrected brief expects `4 10`. Source: the orchestrator's build evidence |
| Briefs kept (build) | The dispatch briefs stay in `scratch/briefs/` as the record of what each executor was sent. Source: the orchestrator's build evidence |
| Parent changelog absent (build) | `spec.md` Phase Context asks for a refresh of `../changelog/`. `specs/cli-jev/003-cli-jev-workflow-integration/changelog/` does not exist, so there was nothing to refresh. Source: the orchestrator's build evidence, rechecked with `ls` on the parent folder |
| Baseline captures not saved (build) | T001 to T004 name `scratch/baseline-*` files. The results are recorded in the orchestrator's build evidence, and no such files exist in `scratch/`. Source: `ls scratch/` while closing the docs |
| Amendment at close: AC-006, criteria 2 and 5, REQ-006, D4 | 2026-09-27, from the orchestrator. Evidence: `git show --name-only --format= fb04862cee def91d168d 31768cc51e` lists four paths outside `.skilled/skills/sk-design/` and this phase: `.hermes/skills/sk-design/SKILL.md`, `.hermes/skills/sk-design-md-generator/SKILL.md`, the sk-design activation manifest and its `specs/sk-doc/019` mirror. Both Hermes files carry `<!-- generated by sync-skills-hermes.cjs; do not edit -->` and copy in-scope `SKILL.md` files. Each manifest diff changes only `effectivePolicyHash` (`b150477a...` to `cdc87474...`), and the route-remint gate re-mints it whenever a hub `SKILL.md` is staged, whichever SD-007 option is taken. Rechecked read-only by the closure leaf. Reason: the intent holds, since nothing hand-authored sits outside sk-design, no routing code changed and no model was called. The letter missed files the repository's own generators write. D4 now names three build commits and keeps its no-model-call rule. Criterion 2 now names the owner-choice commit `6f47c32dce` (18:04:32) and this build's first md-generator commit `fb04862cee` (18:30:45), because its old wording, "the first md-generator change dated 2026-09-27 or after", also caught `094cdb9f8a` (17:16, another packet's changelog-metadata commit, no gate text), so its literal text failed. The operator can revert this amendment |
| AC-002 date query (closure) | The row's `--since=2026-09-27` printed nothing, since git reads a bare date at the current clock time. The row now uses `--since='2026-09-27 00:00'`. With `--since='2026-09-27 00:00'` the first md-generator commit is `094cdb9f8a` (17:16), another packet's changelog search metadata, before the owner choice at 18:04. It touches no gate file. The first commit of this build is `fb04862cee` (18:30). Source: `git log` rerun while closing the docs |
<!-- /ANCHOR:log -->
