---
title: "Research: Keep a packet's core purpose across handovers and compactions"
description: "Merged synthesis of two deep-research lineages on where a spec packet's problem, purpose and user need drop across compactions, resumes and relaunch hops, and the smallest change that keeps them."
trigger_phrases:
  - "purpose retention across handovers"
  - "why compaction loses the purpose"
  - "purpose row in the resume brief"
importance_tier: "normal"
contextType: "general"
---
# Research: Keep a packet's core purpose across handovers and compactions

Merged synthesis of two deep-research lineages, `deepseek-1` and `deepseek-2`, over the five questions in `spec.md` section 7.

<!-- SPECKIT_TEMPLATE_SOURCE: research | v1.0 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

- **Research ID**: RESEARCH-006
- **Feature/Spec**: `specs/system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers/spec.md`
- **Status**: Complete
- **Date Started**: 2026-11-13
- **Date Completed**: 2026-11-13
- **Researcher(s)**: two `cli-deepseek-harness` lineages on `deepseek-v4.1-flash-1017` at max effort, 5 iterations each
- **Reviewers**: the orchestrating session, which opened the load-bearing citations itself (section 9)
- **Last Updated**: 2026-11-13

**Related Documents**:
- Lineage syntheses: `research/lineages/deepseek-1/research.md` and `research/lineages/deepseek-2/research.md`
- Resource map: `research/resource-map.md`

**Independence warning.** Both lineages ran the same model at the same effort on the same brief. Where they agree, that agreement is not independent confirmation. Only the orchestrator checks in section 9 add a second reader.
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:investigation-report -->
## 2. INVESTIGATION REPORT

### Request Summary
The operator reported that after several relaunch hops or compactions a session keeps the mechanics of the work and loses why it exists and whom it serves. The run had to find where the purpose drops on each hop and name the smallest change to system-spec-kit logic or templates that keeps it in front of the next session.

### Current Behavior
The purpose is written once, in `spec.md` section 2, and no automatic hop reads it back. The compaction path goes further: the continuity facet titled "Goal" is filled from `next_safe_action`, so the slot named for the purpose carries the next step.

### Key Findings
1. **Written once, read never.** Every level and the phase-parent template carry Problem Statement and Purpose. No compaction brief, resume brief or save record carries them forward.
2. **The "Goal" facet is the next action.** `buildContinuityFacets` sets `goal: uniqueFacetItems([nextSafeAction], 2)`. [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/continuity/thin-continuity-record.ts:299]
3. **The default Claude compaction brief is transcript-only.** It emits Active Files, Recent Topics and Recent Context. [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/compact-inject.ts:365-384]
4. **The resume brief has no purpose row.** [SOURCE: .skilled/commands/speckit/assets/speckit-resume-auto.yaml:138]
5. **Phase parents often carry no real purpose**, because `create.sh` writes generic layout text and the validator exempts parents from anchor checks. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1875-1876] [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:976]

### Recommendations

**Primary Recommendation** (orchestrator adjudication, section 10):
- Carry the purpose on the read side first, in three small parts that all quote one existing text, and pair that with stopping `create.sh` from writing a generic parent purpose.

**Alternative Approaches**:
- deepseek-1: a Purpose row in the `/speckit:resume` brief only. Smallest change, reaches one hop.
- deepseek-2: an optional purpose value in `_memory.continuity`, rendered in the Goal facet, plus the scaffold fix and a v2.4 stamp on the parent template. Reaches more hops in principle and costs a schema change. The default compaction brief does not render it.
<!-- /ANCHOR:investigation-report -->

---

<!-- ANCHOR:executive-overview -->
## 3. EXECUTIVE OVERVIEW

### Executive Summary
A packet's purpose is authored in `spec.md` and then left behind. Saves write action and state. Compaction writes transcript fragments. Resume reports confidence, the current step and the next action. Phase children write their own local purpose and rarely restate the parent's.

The two lineages agree on that diagnosis and disagree on the fix. deepseek-1 wants a reader added to the resume brief. deepseek-2 wants a purpose value added to the continuity record. The orchestrator recommends the read-side carry, widened to the compaction brief and the relaunch note, plus deepseek-2's scaffold fix. The continuity field is held back because it is the larger change and the default compaction brief would not show it.

### Research Sources

| Source Type | Description | Link/Reference | Credibility |
|-------------|-------------|----------------|-------------|
| Repository code | Hooks, continuity library, validator, scaffold script | `.skilled/skills/system-spec-kit/runtime/` | High where the orchestrator opened it |
| Command assets | Resume and handoff workflows | `.skilled/commands/speckit/` | High where the orchestrator opened it |
| Corpus scans | Counts over `specs/**` | Lineage iteration files | Lineage-reported unless section 9 says otherwise |
<!-- /ANCHOR:executive-overview -->

---

## 4. Q1: Where the purpose is written and what validates it

**Answer (both lineages agree).** The problem and purpose are written once, in `spec.md` section 2, at every level and in both packet shapes. A standard packet stamped v2.3 or later must keep the `problem` anchor. A phase parent is asked for a root purpose by its template and is exempt from the anchor check. Nothing grades whether the text says anything. A distinct user need has no slot below Level 3.

- The core template carries Problem Statement and Purpose. [SOURCE: .skilled/skills/system-spec-kit/templates/core/spec.md.tmpl:99-107]
- The phase-parent template carries the same two subsections. [SOURCE: .skilled/skills/system-spec-kit/templates/packet-types/phase-parent.spec.md.tmpl:62-71]
- It lists "Root purpose: what problem does this entire phased decomposition solve?" as REQUIRED parent content. [SOURCE: .skilled/skills/system-spec-kit/templates/packet-types/phase-parent.spec.md.tmpl:35-36]
- It is stamped v2.2, below the v2.3 line at which required anchors are enforced. [SOURCE: .skilled/skills/system-spec-kit/templates/packet-types/phase-parent.spec.md.tmpl:28] [SOURCE: .skilled/skills/system-spec-kit/references/validation/validation-rules.md:449]
- The anchor check returns early for a phase parent with "Phase parent lean document set accepted". [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:976]
- The phase level requires `spec.md` alone and has no optional addon. [SOURCE: .skilled/skills/system-spec-kit/templates/spec-kit-docs.json:1844-1848]
- The only "As a ... I want" surface is User Stories, emitted at Level 3 and above. [SOURCE: .skilled/skills/system-spec-kit/templates/core/spec.md.tmpl:340] deepseek-2 found no template or validator that uses the term "user need" at all. [SOURCE: specs/system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers/research/lineages/deepseek-2/research.md:53]
- `goal.md` asks for a one-sentence Objective, and no level requires the file. [SOURCE: .skilled/skills/system-spec-kit/templates/addons/goal.md.tmpl:38-41]
- New phase parents get generic text from the generator: problem "This phased decomposition tracks ... across independently executable child phase folders" and purpose "Keep parent documentation lean while child phases own detailed plans, tasks, verification, and continuity." That sentence describes document layout, not the work. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1875-1876]

---

## 5. Q2: What each hop reads and emits

**Answer (both lineages agree).** The purpose travels on no automatic hop. The two places that use goal vocabulary are the relaunch note's free-written `## Goal` and the compaction "Goal" facet, which holds the next action.

| Surface | Reads | Emits | Purpose travels? |
|---|---|---|---|
| Claude PreCompact, default | Transcript lines | Active Files, Recent Topics, Recent Context | No [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/compact-inject.ts:365-384] |
| Claude PreCompact, authored snapshot | `_memory.continuity` | Goal, Decision, Progress, Gotcha facets | No. Opt-in only [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/compact-inject.ts:348-352] and Goal is `next_safe_action` [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/continuity/thin-continuity-record.ts:299] |
| `session-prime` startup | Hook state | "recover on demand from the packet docs" | No [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/session-prime.ts:230-238] |
| Codex, DSH, Pi, Devin compaction | Summary and active spec folder | Summary, folder and a recovery pointer | No [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/codex/compact-inject.ts:36-38] [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/dsh/session-compact-context.mjs:126-142] [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/devin/post-compaction.cjs:265-285] |
| `/speckit:resume` | Handover, continuity, spec docs | Confidence, Context source, Now, Last confirmed, Next safe action | No purpose row [SOURCE: .skilled/commands/speckit/assets/speckit-resume-auto.yaml:138] |
| `/speckit:handoff` and relaunch | Session state | Note with `## Goal`, Done, Remaining work, In-flight state | Only as free text the hop writes [SOURCE: .skilled/commands/speckit/handoff.md:110-111] |
| `/speckit:save` | JSON payload | `recent_action`, `next_safe_action`, blockers, key files, completion, questions | No [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/continuity/generate-context.ts:172-178] |
| Deep-loop iteration prompt | Config topic | `Research Topic`, focus, questions | Only when the topic text holds a why [SOURCE: .skilled/skills/system-deep-loop/deep-research/assets/prompt-pack-iteration.md.tmpl:12-15] |
| Child-dispatch brief | Brief contract | Files, ruled-out work, constraint, return format | No purpose item [SOURCE: .skilled/repo-rules/delegation-and-orchestration.md:96-98] |

- The continuity record has no purpose field. [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/continuity/thin-continuity-record.ts:60-73]
- The resume workflow contradicts itself on `spec.md` (deepseek-2 finding, orchestrator confirmed). Its continuity ladder reads `spec.md` [SOURCE: .skilled/commands/speckit/assets/speckit-resume-auto.yaml:110], while `context_loading_priority` [SOURCE: .skilled/commands/speckit/assets/speckit-resume-auto.yaml:91-92] and the step 2 activity list [SOURCE: .skilled/commands/speckit/assets/speckit-resume-auto.yaml:164] name tasks, plan, acceptance-criteria, decision-record and resource-map and leave `spec.md` out. deepseek-1 read only the ladder and treated `spec.md` as already read.
- The relaunch note lives in gitignored runtime state, not in the packet. [SOURCE: .skilled/commands/speckit/handoff.md:23] Its `goal_packet` field is set by the tool only when a `goal.md` goal is proven. [SOURCE: .skilled/commands/speckit/handoff.md:127-129]
- No source file under `runtime/lib/resume`, `runtime/hooks` or `runtime/lib/continuity` mentions `goal.md` (section 9). The durable directive has no automatic reader.
- Claude's hook state already records the last spec folder, so a compaction hook can find the packet without a search. [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/hook-state.ts:345]

---

## 6. Q3: What real packets show

**Answer (both lineages agree on direction).** The purpose is absent from most handovers and from every continuity block, and phase children drift from the parent's purpose by construction. The exact figures differ by lineage and by counting rule.

- **Continuity blocks.** 0 of 2,901 live `implementation-summary.md` files with a continuity block carry a purpose-like key (orchestrator count, section 9). deepseek-2 reported 2,857 of 2,870 summaries carry a block, and none restates the first 80 characters of its packet's purpose. [SOURCE: specs/system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers/research/lineages/deepseek-2/iterations/iteration-003.md:13]
- **Handovers.** deepseek-1 reported 0 of 97 with a Purpose heading [SOURCE: specs/system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers/research/lineages/deepseek-1/iterations/iteration-003.md:32] and deepseek-2 reported 9 of 96 with a purpose-like heading. [SOURCE: specs/system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers/research/lineages/deepseek-2/iterations/iteration-003.md:11] The orchestrator counted 6 of 42 under a third rule. The counts are not comparable, and all three say most handovers have no such heading. The handover template offers none. [SOURCE: .skilled/skills/system-spec-kit/templates/addons/handover.md.tmpl:37-121]
- **Phase parents.** deepseek-2 reported 80 of 297 parents with no real purpose: empty, placeholder or the `create.sh` text. [SOURCE: specs/system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers/research/lineages/deepseek-2/research.md:85] It counted 4 with the generic sentence, and the orchestrator counted 5 live `spec.md` files that carry it.
- **Parent to child drift (lineage-reported, not checked).** deepseek-2: across 1,029 parent-child pairs, no child shares a 60-character run with its parent and the median word overlap is 0.067. [SOURCE: specs/system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers/research/lineages/deepseek-2/iterations/iteration-003.md:19] deepseek-1: on the largest live parent, 16 of 65 children share three or more significant words with the parent purpose. [SOURCE: specs/system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers/research/lineages/deepseek-1/iterations/iteration-003.md:21]
- **Spec corpus (lineage-reported, not checked).** deepseek-1 counted 3,294 live `spec.md` files, 2,943 with filled Purpose text. [SOURCE: specs/system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers/research/lineages/deepseek-1/iterations/iteration-003.md:16] deepseek-2 reported that 333 of 2,866 real Purpose paragraphs name a beneficiary, so the "for whom" is thin even where a purpose exists. [SOURCE: specs/system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers/research/lineages/deepseek-2/iterations/iteration-005.md:27]

---

## 7. Q4: Which change closes the gap at the lowest cost

The lineages disagree here. Both positions are set out in section 10 with the orchestrator's adjudication. The operator's three candidates, stated plainly:

| Candidate | Verdict | Why |
|---|---|---|
| Parent-level acceptance criteria | Ruled out by both lineages | The schema has no purpose column (AC-ID, REQ, Given/When/Then, Verification, Status, Waiver) [SOURCE: .skilled/skills/system-spec-kit/templates/addons/acceptance-criteria.md.tmpl:58] and a required parent file breaks the lean parent [SOURCE: .skilled/skills/system-spec-kit/templates/spec-kit-docs.json:1844-1848] |
| A parent-level user story or purpose section | Already exists | The phase-parent template ships Problem & Purpose [SOURCE: .skilled/skills/system-spec-kit/templates/packet-types/phase-parent.spec.md.tmpl:62-71] |
| An improved parent template | Half right | The template already asks for a root purpose. The defect is the generator's generic text and the validator exemption [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1875-1876] [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:976] |

Other candidates the evidence raised: a Purpose row in the resume brief (deepseek-1), a purpose value in the continuity record (deepseek-2), a purpose line in the compaction brief (both, as a complement) and a purpose quote in the relaunch note's Goal (orchestrator).

---

## 8. Q5: What is ruled out

| Direction | Why | Lineage |
|---|---|---|
| Parent-level acceptance criteria | No purpose column, and a new required parent file | Both |
| A new parent user-story or purpose section | The section already exists | Both |
| A template-only fix | A template supplies text and no reader | Both |
| A validator-only fix | Presence checks cannot grade meaning, and the check enforces authoring without crossing a hop | Both |
| `handover.md` as the carrier | No purpose slot, and most handovers have none | Both |
| Relabelling the "Goal" facet alone | It renames the next action without adding a purpose [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/continuity/thin-continuity-record.ts:299] | deepseek-1 |
| `goal.md` as the general carrier | Lineage-reported: 889 of 2,912 packets have one [SOURCE: specs/system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers/research/lineages/deepseek-2/iterations/iteration-005.md:23] | deepseek-2 |
| Relying on children to restate the parent | Drift is the default (section 6) | Both |
| The continuity field as the first change | Held, not ruled out: larger change, and the default compaction brief does not render it | Orchestrator |

---

## 9. Orchestrator Verification

The orchestrating session opened these citations and counts itself. Paths under `runtime/` and `templates/` are under `.skilled/skills/system-spec-kit/`.

| Check | Result |
|---|---|
| `runtime/lib/continuity/thin-continuity-record.ts` builds the `goal` facet from `next_safe_action` (`goal: uniqueFacetItems([nextSafeAction], 2)`), and the record interface at lines 60-73 has no purpose field | CONFIRMED. The orchestrator recorded line 298. In this worktree the facet line is 299 (the `return {` is 298), and the body cites 299 |
| `runtime/hooks/claude/compact-inject.ts:365-384` builds the default compaction brief from transcript lines only (Active Files, Recent Topics, Recent Context). The authored continuity snapshot is opt-in at lines 348-352 | CONFIRMED |
| `.skilled/commands/speckit/assets/speckit-resume-auto.yaml:138` `reply_format` is Confidence, Context source, Now, Last confirmed, Next safe action, with no purpose row. The continuity ladder at line 110 lists `spec.md`, while `context_loading_priority` at line 92 and the step 2 activity list at line 164 omit it | CONFIRMED |
| `runtime/cli/spec/create.sh:1875-1876` fills a new phase parent's problem and purpose with generic text | CONFIRMED |
| Phase-parent template stamped v2.2 at `templates/packet-types/phase-parent.spec.md.tmpl:28`, root purpose REQUIRED at lines 35-36 | CONFIRMED with a corrected line. deepseek-2 cited line 80 for the stamp |
| Validator passes a phase parent's anchors at `runtime/lib/validation/orchestrator.ts:976` with "Phase parent lean document set accepted" | CONFIRMED with a corrected line. deepseek-1 cited 963-970 |
| `.skilled/commands/speckit/handoff.md:110-111` gives the relaunch note a free-authored `## Goal` section | CONFIRMED |
| No source file under `runtime/lib/resume`, `runtime/hooks` or `runtime/lib/continuity` mentions `goal.md` | CONFIRMED |
| 0 of 2,901 live `implementation-summary.md` files with a continuity block carry a purpose-like key | CONFIRMED |
| Handover counts | NOT REPRODUCED EXACTLY. deepseek-1: 0 of 97 with a Purpose heading. deepseek-2: 9 of 96 with a purpose-like heading. Orchestrator, excluding `z_archive`, `research` and `scratch`: 6 of 42 with a heading that names purpose, problem, objective or why. The counting rules differ. The direction holds |
| Parents with the generic `create.sh` purpose | NOT REPRODUCED EXACTLY. deepseek-2: 4. Orchestrator: 5 live `spec.md` files carry the sentence |
| Parent-child overlap figures, the 3,294 and 2,870 corpus totals, the `goal.md` coverage figures and the beneficiary percentages | NOT CHECKED. Lineage-reported |
| deepseek-2 state log timestamps | WARNING. 4 of 7 state rows carry timestamps after the run window, and the runner flagged a timestamp anomaly. Its iteration files exist and its content citations checked out where opened. Its timestamps are unreliable and its findings are usable |

---

## 10. The Disagreement and the Adjudication

### deepseek-1: a Purpose row in the resume brief
Add a one-sentence Purpose row to the `/speckit:resume` reply format, read from the packet's `spec.md` Purpose with a `goal.md` Objective as fallback. The row is omitted when neither exists. Cost: three text assets, no schema change, no migration. Its reason: every runtime's recovery pointer ends at `/speckit:resume`. [SOURCE: specs/system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers/research/lineages/deepseek-1/research.md:92]

### deepseek-2: a purpose value in the continuity record
Add an optional purpose value to `_memory.continuity`, filled at save from the packet's Problem & Purpose (or the nearest ancestor's for a phase child), and render it in the Goal facet in place of `next_safe_action`. Pair it with stopping `create.sh` writing the generic parent purpose and stamping the parent template v2.4. Its reason: the block is in almost every summary and feeds save, resume and the authored snapshot. [SOURCE: specs/system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers/research/lineages/deepseek-2/research.md:121-126]

### Why they disagree
Neither lineage could measure at which hop the loss happens in practice, because behavior after a compaction is not observable from the repository. Each picked the hop its own model of the loss made central. The evidence is thin at that one point. The question was not underspecified.

### Adjudication
This is one reader's judgment over two lineages that ran the same model.

Recommend the read-side carry first, in three small parts that all quote one existing text: the packet's `### Purpose` or the nearest ancestor parent's for a phase child or the `goal.md` Objective when one is bound.

1. **Resume.** Add a Purpose row to the resume brief [SOURCE: .skilled/commands/speckit/assets/speckit-resume-auto.yaml:138] and add `spec.md` to the step 2 read list, which closes the contradiction in section 5. [SOURCE: .skilled/commands/speckit/assets/speckit-resume-auto.yaml:164]
2. **Compaction.** Add a purpose line to the compaction brief. On Claude the hook can open the spec folder its state already records. [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/compact-inject.ts:365-384] [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/hook-state.ts:345]
3. **Relaunch.** Have the relaunch note's `## Goal` quote the packet's purpose when a packet is bound. [SOURCE: .skilled/commands/speckit/handoff.md:110-111] A Goal that each hop rewrites from its own memory degrades with every hop. That reason is the orchestrator's inference, not a lineage finding.

Pair it with deepseek-2's scaffold fix: `create.sh` stops writing the generic parent purpose, so the placeholder reaches the file and an author has to replace it. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1875-1876]

Hold the continuity field. It is the larger change, and the default Claude compaction brief does not render the continuity facets, so without the opt-in it would not reach that hop. [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/compact-inject.ts:348-352]

**Cost.** Text edits to two resume assets and the handoff command. One function in the Claude compaction hook plus the matching surface on the other runtimes. Two lines in `create.sh`. No schema change and no migration.

**How to validate.** Run `/speckit:resume` on this packet and confirm the brief shows its Purpose sentence. Run it on a phase child with an empty Purpose and confirm the parent's purpose appears, labelled as the parent's. Trigger a Claude compaction and confirm the injected brief carries the purpose line. Run `/speckit:handoff` on a bound packet and confirm the note's Goal quotes the purpose. Scaffold a new phase parent and confirm `validate.sh --strict` flags the unfilled purpose.

**What would change this.** A measured case where resume or the compaction brief is not run or not read after a hop. That would move the carrier into the record every hop loads, which is deepseek-2's continuity field.

---

## Eliminated Alternatives

| Alternative | Why eliminated | Evidence |
|---|---|---|
| Parent-level acceptance criteria | No purpose column, and a new required parent file breaks the lean parent | [SOURCE: .skilled/skills/system-spec-kit/templates/addons/acceptance-criteria.md.tmpl:58] |
| New parent user-story or purpose section | Problem & Purpose already exists on the parent | [SOURCE: .skilled/skills/system-spec-kit/templates/packet-types/phase-parent.spec.md.tmpl:62-71] |
| Template change alone | The template already asks for root purpose and supplies no reader | [SOURCE: .skilled/skills/system-spec-kit/templates/packet-types/phase-parent.spec.md.tmpl:35-36] |
| Validator change alone | Enforces authoring and crosses no hop | [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:976] |
| Purpose paragraph in `handover.md` | No slot, and most handovers carry none | [SOURCE: .skilled/skills/system-spec-kit/templates/addons/handover.md.tmpl:37-121] |
| Renaming the Goal facet only | Relabels the next action | [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/continuity/thin-continuity-record.ts:299] |
| Continuity field as the first change | Held: larger change, not rendered by the default compaction brief | [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/compact-inject.ts:365-384] |

---

## Divergence Map

- **Saturated directions:** none recorded. Both lineage registries list no saturated direction.
- **Pivots taken:** 0 completed, 0 failed, 0 audited overrides in either lineage.
- **Mid-lineage correction:** deepseek-1 iteration 5 moved its recommended edit point from the code ladder to the resume reply format after tracing that the code ladder has one consumer, the opt-in snapshot. [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/continuity/authored-continuity-snapshot.ts:201]
- **Cross-lineage divergence:** the lineages agree on Q1, Q2, Q3 and Q5 and split on Q4 (section 10).
- **Council artifacts:** none.
- **Remaining frontier:** whether a purpose line changes what a model does after a compaction, which the repository cannot show.

---

## 11. Open Questions and Limits

- **Which hop loses the purpose in practice.** Not measurable from the repository. This is the one point the recommendation rests on.
- **A purpose no packet holds.** When a session's purpose lives in the operator's prompt and the work spans several packets, no packet document holds it, so a spec-based carrier does not help. `goal.md` is the existing mechanism for that case (orchestrator observation).
- **Lexical counts.** The corpus figures are word and heading probes. Paraphrased restatement is undercounted.
- **No relaunch notes were sampled.** The relaunch conclusions rest on the command contract.
- **Same model.** Both lineages ran `deepseek-v4.1-flash-1017`, so their agreement is one reading repeated.
- **Not implemented.** This packet is read-only research. A later packet plans and builds the change.

---

## 12. References

- `research/lineages/deepseek-1/research.md` and its `iterations/`
- `research/lineages/deepseek-2/research.md` and its `iterations/`
- `research/resource-map.md`
- `.skilled/skills/system-spec-kit/runtime/lib/continuity/thin-continuity-record.ts`
- `.skilled/skills/system-spec-kit/runtime/hooks/claude/compact-inject.ts`
- `.skilled/skills/system-spec-kit/runtime/hooks/claude/hook-state.ts`
- `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh`
- `.skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts`
- `.skilled/skills/system-spec-kit/templates/packet-types/phase-parent.spec.md.tmpl`
- `.skilled/commands/speckit/assets/speckit-resume-auto.yaml`
- `.skilled/commands/speckit/handoff.md`

---

## Convergence Report

- Stop reason: maxIterationsReached
- Total iterations: 10 (2 lineages of 5)
- Questions answered: 5 / 5 in each lineage
- Remaining questions: 0
- Last 3 iteration summaries: deepseek-1 runs 3 to 5 (corpus 1.00, candidates 0.80, rule-outs 0.70). deepseek-2 runs 3 to 5 (corpus 0.94, candidates 0.94, rule-outs 0.87)
- Convergence threshold: 0.05, telemetry only, because the stop policy was max-iterations
- Divergence summary: no pivots in either lineage. The lineages split on the Q4 recommendation
- Independence: both lineages ran the same model, so their agreement is not independent confirmation

---

<!-- ANCHOR:changelog-updates -->
## CHANGELOG & UPDATES

| Date | Version | Changes | Author |
|------|---------|---------|--------|
| 2026-11-13 | 1.0.0 | Merged synthesis of lineages deepseek-1 and deepseek-2 with orchestrator verification | orchestrating session |
<!-- /ANCHOR:changelog-updates -->
