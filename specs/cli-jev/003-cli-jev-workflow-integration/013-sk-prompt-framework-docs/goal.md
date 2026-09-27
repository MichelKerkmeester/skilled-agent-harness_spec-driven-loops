---
title: "Goal: Phase 13: sk-prompt framework docs"
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
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/013-sk-prompt-framework-docs"
    last_updated_at: "2026-09-27T18:30:00Z"
    last_updated_by: "closure-leaf"
    recent_action: "Recorded the build evidence; every completion criterion is met"
    next_safe_action: "None. The phase is closed; the orchestrator commits"
    blockers: []
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/013-sk-prompt-framework-docs/spec.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/013-sk-prompt-framework-docs/acceptance-criteria.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-workflow-integration"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 13: sk-prompt framework docs

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

**Objective:** Make sk-prompt's framework registry state that it holds code-task scaffolds for five of the skill's seven frameworks, and make every sk-prompt run read only the selection section, the chosen framework's deep dive and the CLEAR section of `patterns-evaluation.md` instead of all 36,580 bytes.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Seven frameworks stay. The registry keeps its five ids and entries, and only its `description` changes to name CRISPE and CRAFT as frameworks without a scaffold. The owner's matrix, quality card, README and card sync guard all name seven, and the sweep test pins the five ids |
| D2 | A run reads `## 2. FRAMEWORK LIBRARY & SELECTION`, the chosen framework's subsection of `## 3. FRAMEWORK DEEP DIVES` and `## 10. CLEAR EVALUATION MASTERY`. A framework switch reads the new subsection, an unmatched name reads all of section 3 and an on-demand keyword reads the whole file |
| D3 | The build edits `SKILL.md`, the registry's `description` and one sk-prompt changelog file. `patterns-evaluation.md`, `depth-framework.md`, the agent file and every consumer stay unchanged |

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

- [x] `node -p` over `.skilled/skills/sk-prompt/assets/framework-registry.json` prints the ids `rcaf,race,cidi,tidd-ec,costar` and `true` for both `/CRISPE/` and `/CRAFT/` tested against its `description`
- [x] `grep -c 'FRAMEWORK DEEP DIVES'` and `grep -c 'CLEAR EVALUATION MASTERY'` on `.skilled/skills/sk-prompt/SKILL.md` each print at least 2, and `grep -c '"all frameworks"'` on it prints 1
- [x] `wc -c < .skilled/skills/sk-prompt/SKILL.md` prints at most 24000, and `implementation-summary.md` records the before read of 59,661 bytes and the CRAFT section read of 9,686 bytes
- [x] `validate_document.py` on `SKILL.md` prints `VALID`, `quick_validate.py .skilled/skills/sk-prompt` exits 0, `check-prompt-quality-card-sync.sh .` prints `GUARD PASS` and `npx vitest run model-benchmark/tests/sweep-foundation.vitest.ts` exits 0
- [x] `git diff --name-only 6f47c32dce..HEAD -- .skilled/skills/sk-prompt` lists exactly `SKILL.md`, `assets/framework-registry.json` and one file under `changelog/`
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
| Phase planned | Done | Spec, plan, tasks, acceptance criteria and this goal authored from `research.md` section 7 and a recheck of every cited line on 2026-09-27 at `00480a8d5c` |
| Concurrent-access recheck | Done | 2026-09-27, orchestrator: `git status --short -- .skilled/skills/sk-prompt .hermes/skills/sk-prompt` printed nothing. The newest skill commit is `094cdb9f8a` (changelog search metadata only), and no commit after `86e99e7fc1` touches `SKILL.md`. `sync-skills-hermes.cjs --check` printed `PASS: 71 Hermes skill copies in sync`, exit 0. Build-start HEAD `6f47c32dce` |
| Baseline | Done | 2026-09-27, orchestrator: 23081, 36580, 3066, 3950, 2670 and 538 bytes, `rcaf,race,cidi,tidd-ec,costar false false`, `VALID`, `Skill is valid!`, `GUARD PASS` and `Tests  26 passed (26)`, each exit 0 |
| Build | Done | 2026-09-27: four briefs run by `pi` (`llmgateway/deepseek-v4.1-flash`, thinking max), each verified by the orchestrator. 01 registry description (`true true`, numstat `1 1`), 02 section-read rule (greps 2, 2 and 1, `SKILL.md` 23893 bytes), 03 version 3.0.1.0 to 3.0.2.0, 04 `changelog/v3.0.2.0.md` (`VALID`, `Document type: changelog`). The orchestrator regenerated the Hermes mirror. Commit `e3cf07f4f9` |
| Verification | Done | 2026-09-27, orchestrator: `rcaf,race,cidi,tidd-ec,costar true true`, `deep=2 clear=2 allfw=1`, `SKILL.md` 23893 bytes, section counts unchanged, `VALID`, `Skill is valid!`, `GUARD PASS`, `Tests  26 passed (26)`, each exit 0. `git diff --name-only 6f47c32dce..HEAD -- .skilled/skills/sk-prompt` lists exactly `SKILL.md`, `assets/framework-registry.json` and `changelog/v3.0.2.0.md` |
| Phase docs | Done | 2026-09-27: tasks, acceptance criteria, this log and `implementation-summary.md` record the evidence. `validate.sh --strict` prints `RESULT: PASSED` and `check-goal.cjs` exits 0 |

### Deviations and findings

| Item | Note |
|------|------|
| Skill shape | The brief said sk-prompt was merged into a hub with `prompt-improve` and `prompt-models` modes. The tree says otherwise: `specs/sk-prompt/008-sk-prompt-standalone-conversion` (all eight phases Complete) made it a standalone skill, and `leaf-manifest.config.json` notes "sk-prompt is a normal skill (no mode-registry.json)". Paths are `.skilled/skills/sk-prompt/` directly |
| Direction of 7 against 5 | Chosen from the owner's sources, not guessed: `README.md` line 216 already calls the registry a code-oriented subset of five, every entry is `applies_to: ["code"]` and `sweep-foundation.vitest.ts` lines 37 and 43 to 45 pin the five ids. Recorded as D1 |
| Read set | The brief says "read only the selected framework's section". Section 2 is needed to choose (the NEVER rule scores at least three frameworks first) and section 10 to score, so D2 keeps both. Measured: 7,554 to 9,686 bytes against 36,580 |
| Research byte count | The research's 59,661 bytes counts `SKILL.md` and `patterns-evaluation.md`. A `$improve` run also loads `references/depth-framework.md` (21,817 bytes) as `DEFAULT_RESOURCE`, so the full read is 81,478 bytes. Out of this phase's scope, listed as an open question in `spec.md` |
| Scaffold title | `create.sh` titled the docs "Phase 4". Corrected to Phase 13, the folder's number and the metadata's "13 of 17" |
| Sweep test baseline | Not run while planning, to avoid writing a vitest cache outside this folder. T003 records it before the first edit |
| Hermes mirror (build) | `.hermes/skills/sk-prompt/SKILL.md` is a generated copy of `SKILL.md` and sits outside the spec's Files to Change and D3. The orchestrator regenerated it with the owner's sync tool, as the owner's earlier `SKILL.md` commits `239bc805db` and `86e99e7fc1` did, and `--check` printed `PASS: 71 Hermes skill copies in sync`. Source: `scratch/briefs/00-index.md` row 6 |
| Version bump (build) | The spec does not name `SKILL.md`'s `version`. It moved from 3.0.1.0 to 3.0.2.0 to match the new changelog, following the owner's precedent `239bc805db` and sk-create-changelog's patch rule for a docs change. Source: `scratch/briefs/00-index.md` row 4 and brief 03 |
| Parent changelog (build) | `spec.md` Phase Context asks for a refresh of `../changelog/`. `specs/cli-jev/003-cli-jev-workflow-integration/changelog/` does not exist, so there was nothing to refresh. Source: the orchestrator's build evidence, rechecked with `ls` on the parent folder |
| Brief 04 expectation (build) | Brief 04 expected `grep -c 'sk-prompt v3.0.2.0'` to print 1. The file prints 2, the title and a trigger phrase, as the sibling `v3.0.1.0.md` does. The brief was wrong, not the file. Source: the orchestrator's build evidence |
| Diff base moved (2026-09-27) | The main merge (`d6e512e6b5`) brought `094cdb9f8a`, which touched 15 sk-prompt changelog files, so the diff from `00480a8d5c` listed them before any build edit. The operator approved the merge; the fifth criterion and AC-007 now diff from the build-start HEAD `6f47c32dce`, taken after the concurrent-access recheck printed a clean status |
<!-- /ANCHOR:log -->
