---
title: "Feature Specification: Route implementation prompts that name a runtime surface to the code skill, not the CLI executor"
description: "A prompt that asks to build a hook, plugin or guard for a named runtime routes to that runtime's CLI executor, because a bare executor alias counts as a hand-off. Eight of eleven alignment probes from the ask-surface guard work miss for this and for weak code vocabulary."
trigger_phrases:
  - "runtime name implementation routing"
  - "route implementation prompts that name a runtime surface"
  - "executor alias hook surface"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Route implementation prompts that name a runtime surface to the code skill, not the CLI executor

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-08 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The executor-delegation resolver treats any bare executor alias as a hand-off, so "Make the Claude Code Stop hook return a block" routes to `cli-claude-code` at confidence 0.95 and caps `sk-code` below it. The only exception covers OpenCode's own surfaces and `.skilled/` paths. Eight of the eleven routing probes the ask-surface alignment run wrote miss: four to a CLI executor, three to `sk-doc` on weak lexical scores and one to no skill.

### Purpose
A prompt that names a runtime as the owner of a hook, plugin, extension, adapter or guard routes by its work, while a real hand-off to the same runtime still routes to the executor.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ node .skilled/commands/assets/local-skilled-alignment/run-probes.cjs --probes <alignment run>/probes-input.json
fail       P01    want=sk-code                                  got=sk-doc
fail       P02    want=sk-code                                  got=cli-external-orchestration/cli-claude-code
pass       P03    want=sk-code                                  got=sk-code/sk-code-skilled
fail       P04    want=sk-code                                  got=cli-external-orchestration/cli-deepseek-harness
fail       P05    want=sk-code                                  got=cli-external-orchestration/cli-pi
fail       P06    want=sk-code                                  got=sk-doc
fail       P07    want=sk-doc                                   got=-
pass       P08    want=sk-doc                                   got=sk-doc
fail       P09    want=system-spec-kit                          got=cli-external-orchestration/cli-devin
pass       P10    want=sk-doc                                   got=sk-doc/sk-create-manual-testing-playbook
fail       P11    want=sk-code                                  got=sk-doc
STATUS=FINDINGS run-probes: pass=3 fail=8 cannot_run=0

$ node .skilled/bin/skill-advisor.cjs advisor_validate --confirm-heavy-run true --format json
full_corpus_top1 0.8103 (158/195)   holdout_top1 0.75 (30/40)   unknown_count 13
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Mask an executor alias that names the owner of a runtime surface (hook, plugin, extension, adapter, guard) before the resolver matches aliases.
- Trace the three `sk-doc` misses and the one no-skill miss, and fix any that a metadata-only change resolves without moving the corpus.
- Add the probe prompts as executor-delegation fixture cases, both the surface reading and a real hand-off beside a surface.
- Gate the change on `advisor_validate` against today's numbers.

### Out of Scope
- Lane weights and fusion constants - the four CLI misses come from the post-fusion override, not from fusion.
- The probe expectations themselves - they are the alignment critic's upheld judgment, and a miss whose fix would cost corpus accuracy is recorded instead.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/executor-delegation.ts` | Modify | Mask runtime-surface mentions before alias matching |
| `.skilled/skills/system-skill-advisor/runtime/tests/scorer/executor-delegation.vitest.ts` | Modify | Surface and hand-off cases |
| `.skilled/skills/system-skill-advisor/runtime/tests/parity/fixtures/executor-delegation-cases.json` | Modify | Probe prompts as parity cases |
| `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py` | Modify | The same mask in the Python fallback, so both engines agree |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/scorer-eval-baseline.json` | Modify | Re-captured: the delegation bucket grows from 18 to 20 cases |
| `.skilled/skills/system-skill-advisor/runtime/tests/handlers/advisor-validate.vitest.ts` | Modify | Delegation census pins move from 18 to 20 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | P02, P04, P05 and P09 no longer route to a CLI executor. |
| REQ-002 | "Use codex to fix the Claude Code Stop hook" still routes to the CLI hub with `cli-codex` as its target. |
| REQ-003 | `advisor_validate` stays within the bounded-delta gate: full corpus at or above 0.7544, holdout at or above 0.7261, UNKNOWN at or below 15, and no drop from today's 158/195 and 30/40. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | Each remaining probe miss is fixed or recorded with its cause and why it stays. |
| REQ-005 | The advisor vitest suite passes with no new failure against its starting count. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `run-probes.cjs` on the same input reports no CLI executor as any probe's top-1, down from four. The first draft asked for 7 of 11 passing; the trace showed the other misses are weak lexical scores, so `implementation-summary.md` records why that target changed.
- **SC-002**: `advisor_validate` reports full corpus and holdout counts at or above 158/195 and 30/40.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The compiled runtime under `runtime/dist` | The CLI scores with the build, so an unbuilt edit changes nothing | Rebuild with `npm run build` and confirm through the CLI, not the source alone |
| Risk | A real hand-off phrased as "run the pi extension" stops routing to `cli-pi` | Med | The mask needs a surface noun within two words, and the hand-off fixtures cover a cue beside a surface |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: Uncached recommend p95 stays within 2 ms of its `advisor_validate` latency reading before the change.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a prompt with no executor alias resolves exactly as before, since the mask only removes alias-led phrases.
- Maximum input: a prompt naming several runtimes masks each surface mention and still routes a separate hand-off cue.
- Failure path: a prompt naming only a surface ("the Pi extension") routes by fusion, with no executor lift.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 6/25 | One scorer module, its tests and one fixture |
| Risk | 14/25 | Changes routing for every prompt naming a runtime |
| Research | 8/20 | Cause traced; the lexical misses need tracing |
| **Total** | **28/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
