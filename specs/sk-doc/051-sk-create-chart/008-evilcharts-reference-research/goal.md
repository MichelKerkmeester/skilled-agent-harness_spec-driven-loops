---
title: "Goal: evilcharts Reference Research"
description: "The durable directive this phase executes against, and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/051-sk-create-chart/008-evilcharts-reference-research"
    last_updated_at: "2026-09-03T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Vendored evilcharts at a pinned commit and scaffolded the phase before dispatching the fan-out"
    next_safe_action: "Read research/research.md and decide which recommendations the next phase applies"
    blockers: []
    key_files:
      - "context/evilcharts/src/registry/charts"
      - "context/evilcharts/src/registry/ui"
      - ".opencode/skills/sk-doc/sk-create-chart/references/template-contract.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-03-051-008-evilcharts-reference-research"
      parent_session_id: null
    completion_pct: 40
    open_questions:
      - "Whether any evilcharts form belongs in the catalog as a new template"
    answered_questions:
      - "The reference is MIT, so code may be adopted with attribution"
      - "The source is vendored rather than fetched, so every citation resolves"
---
# Goal: evilcharts Reference Research

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE: it is what an operator sets as the session
> objective, and it must stay true for the life of the packet. Keep it short:
> the runtime goal surfaces cap what they will hold, and a truncated objective
> loses its tail, which is where the completion criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Reverse-engineer the vendored evilcharts source and turn it into a ranked list of concrete changes to the sk-create-chart templates and contract, each one cited and each one judged.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The reference is vendored at a pinned commit. A finding cites a path in that tree, never a URL |
| D2 | evilcharts is MIT, so code may be adopted with attribution. Permission is not obligation |
| D3 | The template contract holds: one self-contained file, no build step, no remote dependency. A recommendation says how it fits, or says it does not |
| D4 | This phase changes no file under `.opencode/skills/sk-doc/sk-create-chart/`. It recommends, and a later phase applies |
| D5 | The run owns a worktree. A live fan-out lineage and local authoring never share a working tree |
| D6 | Two lineages, five iterations each, convergence off. Neither may stop early |
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `context/evilcharts/LICENSE` is present, and `context/README.md` names the cloned commit sha, the date and the licence
- [ ] Each of the two lineage directories under `research/evilcharts-2026-09-03/lineages/` holds five files in `iterations/`
- [ ] `research/research.md` ranks every recommendation, and each row names a file and line inside `context/evilcharts/`
- [ ] Every recommendation carries one of three verdicts: adopt as an idea, adopt with attribution, or reject with a reason
- [ ] `validate.sh specs/sk-doc/051-sk-create-chart/008-evilcharts-reference-research --strict` prints `RESULT: PASSED`
- [ ] The parent phase map and the parent BINDING table both name this phase
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
| Worktree allocated | Done | `worktrees/043-evilcharts-reference-research`, allocated by `worktree-naming.sh create` |
| Reference vendored | Done | Commit `500ecd44c1fdcf319ba83ea68f3771bc76125974`, 16 MB, 856 files, nothing dropped |
| Phase documents authored | Done | Written before dispatch, because a live lineage restores tracked files from `HEAD` |
| DeepSeek lineage | Done | Five of five iterations, its own ranked synthesis, 16 adoptions and 13 rejections |
| GLM lineage | Done | Five of five. The fifth ran on 2026-09-03 through the runtime's resume path, answered the registry question and swept its own list |
| Cross-lineage synthesis | Done | `research/research.md`: nine agreements, five contradictions resolved, the unique contribution of each lineage, four operator decisions |
| Citations verified | Done | Every cited path resolves under the vendored tree, and four were opened at the exact line: the stroke constant, the dash default, the mono value class, the bar radius |

### Deviations and findings

| Item | Note |
|------|------|
| The GLM lineage ran short and was resumed rather than waived | It stopped at four of five. The operator chose a re-run over a waiver, and the runtime's own resume path took it to five. The sweep overturned no verdict and corrected four counts, the largest a block total overstated twofold |
| The recorded run summary had been overwritten by a failed attempt | Two dispatches died on network faults before the successful one, and the last of them left a summary claiming a single failed lineage. The successful run's summary replaces it, and the per-lineage state logs carry the full history |
| The two lineages contradict each other on five points | Stroke weight, glow, background patterns, a draggable range window and interaction hygiene. The fifth was missed on the first read of the two lists and was caught while planning the build, which is why the merged set is re-read rather than trusted. Three are settled by argument in the synthesis, and two are handed to the operator as a look-at-the-renders decision. Averaging them would have produced a recommendation neither model made |
| The fan-out runner forced the wrong thinking tier for GLM-5.3-Flash | `pinReasoningEffortForModel` in `executor-config.ts` knows GLM-5.3-Flash tops out at `xhigh`, and nothing in production calls it. The live pin is a stale copy inside `fanout-run.cjs`, which still forces `max` for the whole Flash family. Recorded in `implementation-summary.md` with the correction that made this run possible |
<!-- /ANCHOR:log -->
