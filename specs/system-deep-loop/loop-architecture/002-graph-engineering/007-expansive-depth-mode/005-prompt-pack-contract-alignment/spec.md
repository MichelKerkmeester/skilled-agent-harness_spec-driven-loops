---
title: "Feature Specification: Align the research prompt pack with the agent definition"
description: "The research agent definition allows writing research/research.md under progressiveSynthesis, but the prompt pack's allowed-write list omits it, and the pack asks for a Next Focus heading that the reducer does not parse. This phase brings the pack in line with the agent definition and the reducer, and adds a lockstep test so the two cannot drift again."
trigger_phrases:
  - "prompt pack contract alignment"
  - "progressive synthesis write conflict"
  - "recommended next focus heading"
  - "slice e prompt pack"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Align the research prompt pack with the agent definition

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-11-17 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | `../004-focus-hijack-fix/spec.md` |
| **Successor** | `../006-state-log-leaf-fields/spec.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A research leaf gets two contradicting write rules: `.skilled/agents/deep-research.md:58` allows `research/research.md` when `progressiveSynthesis == true`, while the prompt pack's "ALLOWED WRITE PATHS" list (`deep-research/assets/prompt-pack-iteration.md.tmpl:42-45`) names only the iteration narrative, the delta and the gateway writes (defect D6, seen on 12 of 12 iterations across both generations of the parent run). The pack also asks for a `Next Focus` heading (`:61`), while the reducer parses `## Recommended Next Focus` by exact, case-insensitive heading match (`deep-research/scripts/reduce-state.cjs:1891-1895`, `:1930`), so a pack-compliant narrative is not parsed (defect D13).

### Purpose
A research leaf reads one write rule and one heading contract, and a test fails if the agent definition and the prompt pack disagree again.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ rg -n "research/research.md|ALLOWED WRITE PATHS" .skilled/skills/system-deep-loop/deep-research/assets/prompt-pack-iteration.md.tmpl
42:- **ALLOWED WRITE PATHS (the ONLY paths you may create, modify, or append to)**:

$ rg -n "Next Focus" .skilled/skills/system-deep-loop/deep-research/assets/prompt-pack-iteration.md.tmpl .skilled/agents/deep-research.md
.skilled/agents/deep-research.md:75:3. DETERMINE FOCUS ─> Pick focus from strategy "Next Focus"
.skilled/agents/deep-research.md:130:Use strategy.md "Next Focus". If it is empty or vague, pick the first unchecked "Key Questions (remaining)" item; if none remain, investigate the lowest-coverage area.
.skilled/agents/deep-research.md:133:- Prefer explicit dispatch context over strategy prose, strategy "Next Focus" over unchecked questions, unchecked questions over lowest-coverage inference.
.skilled/agents/deep-research.md:135:- Record deferred focus candidates in the iteration file's `Ruled Out` or `Recommended Next Focus` section.
.skilled/agents/deep-research.md:139:If useful tangents appear outside the current focus, record `idea_observed` events through the append gateway only when explicitly allowed and packet-local; otherwise record them in the iteration file's `Recommended Next Focus`. Never emit `idea_promoted` or `idea_rejected`; the reducer owns promotion, ranking, and rejection filtering.
.skilled/agents/deep-research.md:228:## Recommended Next Focus
.skilled/agents/deep-research.md:316:- The iteration file contains Focus, Findings, Sources Consulted, Assessment, Reflection, and Recommended Next Focus sections.
.skilled/agents/deep-research.md:371:Strategy "Next Focus" available?
.skilled/skills/system-deep-loop/deep-research/assets/prompt-pack-iteration.md.tmpl:61:1. **Iteration narrative markdown** at `{state_paths_iteration_pattern}` (path is pre-substituted for the current iteration number). Structure: headings for Focus, Actions Taken, Findings, Questions Answered, Questions Remaining, Next Focus.
```
The first command finds the list header and no `research/research.md` entry. In the second, the agent's iteration-file heading is `Recommended Next Focus` (lines 228, 316); the strategy-file "Next Focus" lines (75, 130, 133, 371) are a different file and stay as they are. The pack's narrative heading list ends in `Next Focus` (line 61). `progressiveSynthesis` defaults to `true` (`deep-research/assets/deep-research-config.json:14`), so every default research run carries the D6 conflict.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `research/research.md` to the pack's allowed-write list with the agent's own condition: only when `progressiveSynthesis` is `true` in the run config.
- Rename the pack's narrative heading `Next Focus` to `Recommended Next Focus`, the spelling the reducer and the agent definition already use.
- Regenerate the compiled research command contract, which records a sha256 of the template (`.skilled/commands/deep/assets/compiled/deep-research.contract.markdown:74-75`), so the contract-drift check stays green.
- Add a lockstep case that fails when the agent definition and the research pack disagree on the progressive-synthesis write rule or on the iteration narrative's next-focus heading.
- Check the review side and record that it needs no change: the review pack, agent and reducer already agree.

### Out of Scope
- Changing the agent definition or its runtime mirrors (`.claude/agents/`, `.opencode/agents/`) - the agent is the contract owner in the chosen direction, so it stays as is (see Open Questions for the reverse option).
- Changing the research reducer's heading parse - the reducer already reads `Recommended Next Focus`; reading the parsed value is `../004-focus-hijack-fix/`.
- The review prompt pack and `.skilled/agents/deep-review.md` - verified consistent: both allow the iteration file, the delta and the strategy file, and the review reducer accepts `Recommended Next Focus`, `Next Focus (recommendation)` and `Next Focus` (`runtime/scripts/reduce-state.cjs:355`).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-deep-loop/deep-research/assets/prompt-pack-iteration.md.tmpl` | Modify | One conditional allowed-write entry for `research/research.md`; heading list `Next Focus` becomes `Recommended Next Focus` |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/prompt-pack.vitest.ts` | Modify | Rendered-pack case for both changes plus the agent/pack lockstep case |
| `.skilled/commands/deep/assets/compiled/deep-research.contract.markdown` | Regenerate | `node .skilled/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs --command deep/research --write` refreshes the template digest |
| `.skilled/agents/deep-research.md` | Check only | Source of the rule the pack must match (`:58`, `:228`, `:309-310`, `:316`) |
| `.skilled/commands/deep/assets/deep-research.yaml`, `deep-review.yaml` (`render_prompt_pack`) | Check only | No new render variable is needed, so the YAMLs stay unchanged; only the research compiled contract is regenerated, for the template digest |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The research pack's allowed-write list names `research/research.md` under the `progressiveSynthesis` condition | `rg -n "research/research.md.*progressiveSynthesis" .skilled/skills/system-deep-loop/deep-research/assets/prompt-pack-iteration.md.tmpl` prints one line inside the ALLOWED WRITE PATHS list |
| REQ-002 | The pack's narrative heading list uses `Recommended Next Focus` | `rg -n "Questions Remaining, Recommended Next Focus" .skilled/skills/system-deep-loop/deep-research/assets/prompt-pack-iteration.md.tmpl` prints one line, and `rg -n ", Next Focus\." <same file>` prints nothing |
| REQ-003 | A lockstep test fails when the agent definition and the pack disagree | A `prompt-pack.vitest.ts` case reads `.skilled/agents/deep-research.md` and the research template and asserts both name `research/research.md` with `progressiveSynthesis` and both name `Recommended Next Focus`; deleting either line from the pack in a scratch copy makes the case fail |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | A pack-compliant narrative is parsed by the research reducer | A `deep-research-reduce-state` or `prompt-pack` case feeds a narrative with the headings the pack names and gets a non-empty parsed `nextFocus` |
| REQ-005 | Existing suites stay green, including the compiled-contract drift checks | `npx vitest run prompt-pack deep-research-deltas-contract deep-review-deltas-contract check-documentation-drift check-contract-drift compile-command-contracts` from `.skilled/skills/system-deep-loop/runtime` exits 0 |
| REQ-006 | The review side is unchanged | `git diff --stat` after the change lists no file under `deep-review/`, neither agent definition, and no compiled contract other than `deep-research.contract.markdown` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The rendered research prompt pack and `.skilled/agents/deep-research.md` state the same progressive-synthesis write rule and the same next-focus heading, and a test proves it.
- **SC-002**: `npx vitest run prompt-pack deep-research-deltas-contract deep-review-deltas-contract check-documentation-drift check-contract-drift compile-command-contracts` exits 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Default-path behavior changes: with `progressiveSynthesis: true` by default, research leaves on normal runs are now told they may update `research/research.md`, which the pack forbade before | Low-Medium | The rule matches what the agent definition already allows; state the change in the phase changelog note |
| Risk | Detached CLI executors read the raw template, not a rendered one (`runtime/scripts/fanout-run.cjs:1617-1619`), so an unrendered placeholder would reach them verbatim | Medium if a render variable were used | The entry is static text that names the config key, so no new placeholder exists; REQ-001 checks the literal line |
| Dependency | None. This phase has no prerequisite slice (parent §20 order) | None | Not applicable |
| Dependency | This phase is a prerequisite of `../010-research-frontier-mode/` (parent §20, Slice J depends on E; §10 requires the frontier pack block to keep the write list consistent with the agent) | The frontier pack block would extend an inconsistent list | Land this phase before 010 starts |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Direction of the D6 fix. This spec makes the pack conform to the agent, because parent §10 says the allowed-write list "must stay consistent with the agent definition". The reverse option removes the leaf's `research/research.md` permission from the agent definition and its runtime mirrors, leaving synthesis to the orchestrator; choose it instead if the operator wants leaves never to touch `research.md`.
- Parent §20 lists `render_prompt_pack` in both YAMLs as a file to change. This spec uses static pack text instead, because a render variable would reach detached executors unrendered. If the implementer finds a reason to render the line, the YAML variables, `fanout-run.cjs` and both compiled contracts under `.skilled/commands/deep/assets/compiled/` all change with it.
<!-- /ANCHOR:questions -->

---
