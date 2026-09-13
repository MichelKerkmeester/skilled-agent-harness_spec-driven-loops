---
title: "Implementation Plan: Governance documentation alignment: 006-resume queue plus router and root-doc research"
description: "Restore 006 to a validated state, then research the reply-shape router and the root instruction document under a recorded GLM-5.3-Flash dispatch contract, acting only after the sequencing question is answered."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Governance documentation alignment: 006-resume queue plus router and root-doc research

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown documentation, spec-kit Level 2 tooling |
| **Framework** | system-spec-kit validators and repair tooling, the deep-loop fan-out |
| **Storage** | Git, no database |
| **Testing** | validate.sh --strict, repair-derived.cjs, focused inspection, receipt audits |

### Overview

This packet restores 006 to a validated state, then researches the two governance surfaces the 006 handover scoped out of its frozen scope. Stream A repairs and revalidates 006 and verifies the swarm's twelve rewritten files against the pre-swarm commit. Streams B and C run as two parallel research lineages under the dispatch contract in section 8, and their adopted findings act only after the sequencing question is answered.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done

- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
- [ ] 055 validates under `validate.sh --strict` with RESULT: PASSED
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Other: documentation and research, no runtime.

### Key Components

- **006-resume lane**: direct commands and edits, no lineage, because two commands and two edits buy nothing from a dispatched swarm. The 006 authoring swarm's validation scar tissue is the recorded precedent.
- **Research lineages**: two parallel dispatched runs, one for the router, one for the root doc, under the section 8 contract.
- **Acceptance trace**: acceptance-criteria.md maps every requirement to its Given/When/Then and its receipt, and decides closure.

### Data Flow

The 006 handover's queue flows into the three streams, their findings land in this packet's research folders, and acceptance-criteria.md decides closure. Nothing writes outside this packet except the two 006 files the Files-to-Change table names, plus the conditional decision-record append.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| AGENTS.md | The root instruction document, the root-doc research's target | research, then deferred modify | Each finding cites its read-at commit and its case |
| REPO RULES.md and repo-rules/ | The reply-shape router and its eleven rule files | research, then deferred modify | Both-direction reachability, the full rule-file enumeration |
| 006's spec.md, 007's spec.md, the decision record | The paused packet's phase map and ratification wording | Stream A modifies | The diffs: one clause each, the record consulted first |
| This packet's five docs and two research folders | The deliverable | create and author | validate.sh --strict returns RESULT: PASSED |

Required inventories:

- Every rule file the router must reach: the 11 under `repo-rules/`, enumerated at research time, 5 of them recently edited.
- Consumers of the two 006 corrections: the phase-map readers and 007's dependents, named inside the 006 packet.
- Matrix axes: the router in both directions, the root doc across two failure classes, three discrimination cases.
- Invariant: no governance clause is deleted without its discrimination case, and case-one findings quote the delegate's own line.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

Execution order: 006-Resume first, then the two research lineages in parallel, then the gated acting phase, exactly as `tasks.md` sequences them.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Documentation integrity | Anchors, placeholders, TOC policy, cross-references, continuity frontmatter | validate.sh --strict, repair-derived.cjs |
| Research receipt audit | Iteration counts, deltas, read-at citations, reducer counts | focused inspection of the research folders |
| Dispatch receipt validation | Captured output text, artifact existence, effort pin | the audited wrapper's receipt, the artifact check, never the exit code |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 006's validation state | Internal | Yellow, 9 of 10 folders pass, the parent fails on stale derived metadata | Every later step trusts a packet nobody validated |
| The LLM Gateway credential and the GLM-5.3-Flash roster slot | External | Yellow, the key exports from ~/.zshenv, its arrival in a dispatched child is unobserved | Streams B and C stall, they fall back to direct execution by this session |
| 006's decision-record ratification state | Internal | Yellow, unread | REQ-005's wording corrections wait |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The packet's documents contradict their receipts, or a research contract fails its receipts.
- **Procedure**: Everything ships in one creation commit, so reverting that commit removes the 055 folder and the 006 handover together. Before the commit, the 055 folder is untracked, so deleting it undoes everything. The two 006 corrections, once they land, revert with `git-restore`.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:dispatch-contract -->
## 8. DISPATCH CONTRACT

The operator confirmed this contract: it governs the streams' execution, recorded here and nowhere else. This packet's own documentation was authored directly, not dispatched.

- Two research lineages, Streams B and C, go through ONE `fanout-run.cjs` invocation. Model: the bare literal `glm-5.3-flash`, which the provider map binds to `llmgateway` (DevPass), composing the enforced two-segment selector `llmgateway/glm-5.3-flash`, the only GLM-5.3-Flash route the fan-out reaches. Effort is pinned, not chosen: `isFlashMaxPinnedModel` forces `max`. Receipts: the enforcement file's lines 209 and 237, plus the pin's unit tests. Recorded correction: the cli-pi skill's §6 pointer to `runtime/scripts/executor-config.ts` is stale, the enforcement config moved to `runtime/lib/deep-loop/executor-config.ts`. The fan-out script is edited the same day this was recorded, so the roster mapping is re-read at dispatch time.
- The verification review, Stream A3, is ONE read-only dispatch: print mode with a `read,grep,find,ls` tool allowlist, comparing the twelve rewritten files against the pre-swarm commit. The conductor validates its findings against receipts. The wrapper's exit zero is never proof.
- Streams A1 and A2 stay direct: two commands and two edits.
- The direct-dispatch envelope, when a direct dispatch is used at all: `SYSTEM_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1 pi -p "<shared preamble + inlined persona + task>" --provider llmgateway --model glm-5.3-flash --thinking max --mode text --offline </dev/null > stdout.log 2> stderr.log`. The persona resolves from `.pi/agents/` (deep-research for the lineages, review for the verification) and is inlined, because the child cannot resolve it. The shared child-dispatch preamble heads every non-interactive prompt, and the `AI_SESSION_CHILD=1` waiver is also stated in the prompt text.
- Receipt discipline: success classifies from captured output text, never the exit code, which has been observed as 0 and 1 across identical unauthenticated runs. No pipes over the exit. The killed-child case, SIGTERM 143 behind a wrapper zero, is caught only by the artifact check. The `route_proof_missing` gate failure is the expected deterministic false failure on every research iteration, the leaves' delta files carry the fields. Briefs name their files, because the sweep-sized brief died at fifteen-plus minutes. Leaves never dispatch again, no nested pi.
- Dispatch-time preflight: `command -v pi`, the ALWAYS-loads (`cli-reference.md`, `prompt-quality-card.md`) load when the route fires, the credential's presence inside the dispatched child is observed rather than assumed, and the roster mapping is re-read.
- Cost: 1.05M context, 131K output, effort pinned `max`. Recorded UNKNOWN: whether DevPass bills this route per token with the 3x credit bonus, as the skill's roster says, or flat-plan, as the enforcement comment says. Adjacent, unreconciled.
<!-- /ANCHOR:dispatch-contract -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
006-Resume (A) ──► Research (B ∥ C) ──► Acting, then closure
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| 006-Resume | None, the repair is idempotent | Research, Acting |
| Research | 006-Resume, for a trusted basis, and the dispatch preflight | Acting |
| Acting | Research, plus the recorded sequencing answer | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| 006-Resume | Low | 2-3 hours, two commands, two edits, one dispatched review |
| Research | Medium | 8 iterations across two metered lineages at pinned max effort, token cost logged at run time |
| Acting | Medium | Findings dependent, gated behind the recorded sequencing answer |
| **Total** | | 1-2 sessions |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist

- [x] No backup needed, every artifact is new, untracked or restored from Git
- [x] No feature flag, the packet is documentation
- [x] No monitoring alerts, the operator reads the chat

### Rollback Procedure

1. Before the creation commit: delete the 055 folder, nothing else changed
2. After the creation commit: revert that one commit, the 055 folder and the 006 handover leave with it
3. The two 006 corrections, once landed: `git-restore` their paths
4. No stakeholders to notify, the no-push decision keeps this local

### Data Reversal

- **Has data migrations?** No
- **Reversal procedure**: N/A, the packet holds no persisted state beyond Git
<!-- /ANCHOR:enhanced-rollback -->
