---
title: "Implementation Plan: Phase 10: decision-routing-vocabulary"
description: "Adds four decision phrases to system-spec-kit's intent signals and a DECISION intent to its ROUTER.md, then re-exports the skill graph and rebuilds the advisor's SQLite index. No code changes. Proof is the native advisor_recommend probe on two decision prompts and four collision prompts, against a live control taken before any edit."
trigger_phrases:
  - "decision routing vocabulary plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 10: decision-routing-vocabulary

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JSON metadata, and a Markdown router whose machine block is Python-shaped pseudocode |
| **Framework** | None. The system-skill-advisor daemon scores prompts from its SQLite index |
| **Storage** | `skill-graph.json` (tracked) and `skill-graph.sqlite` (gitignored) under `.skilled/skills/system-skill-advisor/runtime/` |
| **Testing** | Native `advisor_recommend` probes, `skill-graph-freshness.cjs --strict`, `sk-skill-check.cjs`, `ci-router-vocabulary-reach.cjs`, `check-card-sync.sh` |

### Overview
Four phrases join system-spec-kit's `intent_signals`, and a DECISION intent joins its `ROUTER.md` in the human bullets and both machine dicts. The graph export and the SQLite rebuild then let the native scorer see the new phrases. Proof is six native probes against a live control, plus the freshness, doctor and reach checks.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
<!-- FILL: Turn each gate into a check a command can answer. Keep the boxes unticked until they pass. GOOD: `ls scripts/rotate-logs.sh` prints the path and `ls logs/archive | wc -l` prints 10 before the task starts. WEAK: The team agrees the plan is ready. -->

### Definition of Ready
- [ ] 008 is closed: `rg -n 'Closeable:\*\* Yes' ../008-project-scoped-state/acceptance-criteria.md` prints one line
- [ ] The advisor is live: `node .skilled/bin/skill-advisor.cjs advisor_status --workspace-root "$PWD" --format json | jq -r .data.trustState.state` prints `live`
- [ ] The live six-prompt control is recorded in `implementation-summary.md`

### Definition of Done
- [ ] All acceptance criteria met
- [ ] The two decision probes list `system-spec-kit` first at confidence 0.8 or higher and uncertainty 0.35 or lower, and the four collision probes match the control
- [ ] `skill-graph-freshness.cjs --strict` exits 0 and `sk-skill-check.cjs check system-spec-kit` prints `Result: PASS`
- [ ] `validate.sh specs/system-speckit/043-decision-capture/010-decision-routing-vocabulary --strict` prints RESULT: PASSED
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
Metadata-only routing. Both routing stages change in their source files, and the compiled views are regenerated from them.

### Key Components
- **`graph-metadata.json` `intent_signals`**: stage one. The advisor reads it to pick the skill.
- **`ROUTER.md` DECISION intent**: stage two. Inside the skill it picks which references load.
- **`skill-graph.json` and `skill-graph.sqlite`**: compiled views. The native scorer reads the SQLite index (`.skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts:74-76`), and the freshness panel compares the JSON export with disk.
- **`.hermes/skills/system-spec-kit/ROUTER.md`**: the generated Hermes mirror of the router.

### Data Flow
`skill_graph_compiler.py --export-json` reads every skill's `graph-metadata.json` and writes `skill-graph.json`. `advisor_rebuild` reads the same sources and writes `skill-graph.sqlite`. The daemon scores each prompt from that index, and the hook brief keeps only a skill at confidence 0.8 or higher and uncertainty 0.35 or lower (`.skilled/skills/system-skill-advisor/runtime/lib/skill-advisor-brief.ts:164-178`). Once system-spec-kit loads, its router matches DECISION and loads `save-workflow.md` and `decision-format.md`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES
<!-- FILL: Name each surface the change touches. Write `not a consumer` when it does not read the change. Write `N/A` or delete the whole addendum when no fix surface applies. GOOD: `scripts/rotate-logs.sh`: owns the deletion. Action: update. WEAK: Various files. -->

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| system-spec-kit `graph-metadata.json` `intent_signals` | Stage-one vocabulary the advisor scores | update | `jq '.intent_signals \| length'` prints 35; the two decision probes |
| system-spec-kit `ROUTER.md` §2, `INTENT_SIGNALS`, `RESOURCE_MAP` | Stage-two intent and resource choice | update | C7 reports 22 and 22; `rg -n '"DECISION"'` prints two lines |
| `.hermes/skills/system-spec-kit/ROUTER.md` | Generated Hermes mirror | regenerate | `sync-skills-hermes.cjs --check` prints `PASS`; C9 PASS |
| `skill-graph.json` | Compiled export the freshness panel compares | regenerate | `skill-graph-freshness.cjs --strict` exit 0, `SIGNAL DRIFT compiled vs disk: none` |
| `skill-graph.sqlite` | The native scorer's index | rebuild | `advisor_rebuild` output; probes report `freshness` `live` |
| sk-design and sk-git `graph-metadata.json` | Own "decision tree", "colour decision", "decision branch" | unchanged | Four collision probes match the live control |
| Python fallback `skill_advisor.py` deep routing (`architecture decision` at `:3543`) | Fallback scorer only | not a consumer of the native proof | None. Research §13 moves the proof to the native lane |
| `ci-router-vocabulary-reach.cjs` | Probes every multi-word `INTENT_SIGNALS` phrase | unchanged, reads the new phrases | `--skill system-spec-kit` on a live advisor |
| `check-card-sync.sh` | Parses `RESOURCE_MAP` for the authoring card | unchanged | `CARD SYNC OK` |
| `leaf-manifest.json`, `leaf-aliases.json` | Inventory of routable leaves | unchanged: both resources are already leaves | `generate-leaf-manifest.cjs --check` prints `leaf-manifest.json OK` |
| Trigger index | Gate 1 document lookup | unchanged, declined in spec.md Open Questions | Lookup exit 1 on the two prompts stays expected |

Inventories run for this plan:
- Same-class producers: `rg -n --glob 'graph-metadata.json' --glob 'ROUTER.md' -e '"as a decision"' -e '"decision record"' -e '"operator decision"' -e '"record my answer"' .skilled/skills` printed nothing and exited 1 on 2026-11-03, so no skill declares any of the four phrases.
- Consumers: the freshness panel, `sk-skill-check.cjs` rows C5 to C9, the reach check, `check-card-sync.sh` and the Hermes sync, all listed above.
- Matrix axes: prompt class (decision request, design collision, git collision, ADR collision) by index state (live control, live after change). Six prompts, two states, twelve probe rows.
- Invariant: a prompt that holds none of the four phrases returns the same skill list as the live control.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup counts the archives. Implementation adds `--keep`. Verification counts 3. WEAK: See tasks. -->

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state. Setup takes the live control, Implementation edits two files and regenerates three artifacts, and Verification reruns the six probes and the checks.

Implementation worker, per parent goal D6: `gpt-6-luna` at reasoning `xhigh` on service tier `fast`, through cli-codex, one change per brief. When Luna's quota is used up, the fallback is `llmgateway/deepseek-v4.1-flash-1017` at thinking `max`, through cli-pi. The orchestrator runs the probes and checks itself and diffs every edit.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | None: no code changes | N/A |
| Integration | Six native probes and the reach check against the live index | `node .skilled/bin/skill-advisor.cjs advisor_recommend`, `ci-router-vocabulary-reach.cjs --skill system-spec-kit` |
| Manual | Freshness, doctor skill check, card sync, leaf manifest, Hermes sync | `skill-graph-freshness.cjs --strict`, `sk-skill-check.cjs check system-spec-kit`, `check-card-sync.sh`, `generate-leaf-manifest.cjs --check`, `sync-skills-hermes.cjs --check` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 008-project-scoped-state Complete | Internal | Yellow: Draft on 2026-11-03 | The build waits. Routing first would send decision requests into the shared-state bug |
| A live advisor index | Internal | Yellow: stale at generation 2138 on 2026-11-03 | No probe can prove REQ-003 or REQ-004 until `advisor_rebuild` runs |
| `python3`, `jq`, `node` | External | Green | None. All three ran for the baseline |
| cli-codex with `gpt-6-luna` | External | Green | Fallback `llmgateway/deepseek-v4.1-flash-1017` through cli-pi, per D6 |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

- **Trigger**: a collision prompt loses its control route, or a decision prompt stays below confidence 0.8 on a live index.
- **Procedure**: revert this child's commit, then rerun `sync-skills-hermes.cjs`, `skill_graph_compiler.py --export-json` and `advisor_rebuild --trusted --force true`. The SQLite index is gitignored, so a revert alone leaves it holding the new phrases.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES
<!-- FILL: Draw the phase order in the fence, then fill the table with depends-on and blocks. Write `N/A` with one reason, or delete the whole section. GOOD: Setup to Implementation to Verification. Verification blocks close. WEAK: Phases depend on each other. -->

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | 008 Complete and a live advisor | Implementation |
| Implementation | The live control from Setup | Verification |
| Verification | Implementation | Close-out of this child |
<!-- /ANCHOR:phase-deps -->

---
