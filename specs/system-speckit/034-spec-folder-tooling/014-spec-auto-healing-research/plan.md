---
title: "Implementation Plan: Spec auto-healing research"
description: "Run the /deep:research fan-out with three executors for 15 iterations each, review every lineage against the source and merge the result into one ranked synthesis on hardening the spec tooling and healing old corpora."
trigger_phrases:
  - "spec auto healing research plan"
importance_tier: "normal"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Spec auto-healing research

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash and Node.js tooling under `.skilled/skills/system-spec-kit/`, read only |
| **Framework** | `/deep:research` in auto mode with multi-executor fan-out (`fanout-run.cjs`) |
| **Storage** | Per-lineage JSONL state, delta files and iteration markdown under `research/lineages/` |
| **Testing** | Orchestrator re-reads of every load-bearing citation, plus strict validation of this packet |

### Overview
Three executors each run a full 15-iteration research loop on the same five questions, concurrently and in their own lineage directories. The orchestrator reviews each iteration as it lands, checks the claims against the code and merges the lineages into `research/research.md` with ranked recommendations.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Fan-out research with a reviewing lead. Each executor is an independent lineage, and the lead's only channel into a running lineage is that lineage's `steer.md`.

### Key Components
- **`fanout-run.cjs`**: launches one CLI process per executor, each running the whole loop (init, 15 iterations, lineage synthesis), with containment snapshots and a status ledger.
- **`steer.md` per lineage**: fixes the five Key Questions, the write scope, the banned tools and the citation format. It later carried one mid-run steer.
- **`fanout-merge.cjs` and `reduce-state.cjs`**: merge the lineage registries and emit the resource map.
- **`synthesis-closeout.cjs` and `append-mode-event.cjs`**: check the synthesis invariants and record the terminal events through the ledger gateway.

### Data Flow
Each lineage writes iteration narratives, deltas and state records into its own directory. After all three finish, the merge reads them in place, the lead writes `research/research.md` from the iteration files and its own verification notes, and a bounded findings block is written back into `spec.md`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase fixes nothing. The table lists the surfaces the research recommends changing, so the follow-up packet starts from a known inventory.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `templates/core/spec.md.tmpl` and its golden snapshot | Renders the `questions` anchor around the Level 2 and 3 sections | Recommend update (SH-01) | `research/research.md` Section 5.2 |
| `runtime/cli/spec/create.sh` `--phase` path | Exits before graph-metadata derivation | Recommend update (SH-02) | Section 5.3 |
| `runtime/cli/spec/archive.sh`, `repair-derived.cjs`, `upgrade-legacy.mjs` | Hold conflicting archive policies | Recommend a policy decision, then update (SH-03) | Section 7.4 |
| `.github/workflows/trigger-index-rebuild.yml` | Rebuilds and pushes the trigger index | Recommend update (SH-04) | Section 8.1 |
| `runtime/cli/spec/heal-spec-docs.cjs`, `check-template-staleness.sh` | Restore phrases and stamp template versions | Recommend update (SH-05, SH-06) | Sections 5.6 and 8.5 |
| `.skilled/commands/doctor/` | Release update scoped to `.skilled/` | Recommend a compatibility check and a separate migration action (SH-08) | Section 7 |

Required inventories: the follow-up packet should run the same-class producer and consumer searches listed with each recommendation in `research/research.md` Section 11 before it edits.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Citation check | Every load-bearing claim in the synthesis | `rg`, `sed -n`, `git show` against the cited line |
| Probe | A byte copy of this packet's fresh scaffold, validated outside the repo | `validate.sh --strict` on the copy |
| Invariant | Synthesis artifacts against lineage state | `synthesis-closeout.cjs` |
| Validation | This packet | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| cli-pi with `opencode-go/deepseek-v4.1-flash` | External | Green | One lineage lost, the other two still answer |
| cli-devin with `swe-2-max` | External | Green | Same |
| cli-codex with `gpt-6-luna` on the fast tier | External | Green | Same |
| Phase 13 scratchpad scripts and reports | Internal | Green, read only | The taxonomy would rest on the validator alone |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the research output is wrong or the packet is unwanted.
- **Procedure**: delete this phase folder. Nothing outside it changed, and no commit was made.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Fan-out run and review) ──► Phase 3 (Synthesis and verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Fan-out run |
| Fan-out run and review | Setup | Synthesis |
| Synthesis and verify | Fan-out run | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 30 minutes |
| Fan-out run and review | High | About 80 minutes of executor time, reviewed as it ran |
| Synthesis and verification | Med | 1 to 2 hours |
| **Total** | | **About 3 to 4 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (if data changes): not needed, nothing outside this packet changes
- [x] Feature flag configured: not applicable to a research packet
- [x] Monitoring alerts set: the fan-out status ledger was watched for the whole run

### Rollback Procedure
1. Delete `014-spec-auto-healing-research/`.
2. Confirm `git status` shows no other change from this phase.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
