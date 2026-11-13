# Purpose Retention Across Handovers, Relaunch Hops and Context Compactions

**Status:** final synthesis (deepseek-2 lineage)
**Run:** 5 iterations, stop reason `maxIterationsReached`
**Scope:** read-only research over `.skilled/skills/system-spec-kit`, `.skilled/commands/speckit`, `.skilled/skills/system-deep-loop` and `specs/`
**Packet:** `specs/system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers`

---

## Executive Summary

A spec packet does keep its mechanics across sessions and loses its why. The loss is not one broken template. It is a chain of five purpose-blind read/write surfaces plus one authoring gap:

- the parent purpose is **unvalidated** and often empty or generic;
- **saves** write action and state only;
- **compaction** injects active files, topics and recent context, and mislabels `next_safe_action` as "Goal";
- **resume** has no purpose slot and reads `spec.md` inconsistently;
- **relaunch notes** carry a free-authored Goal but live in gitignored runtime state;
- **child phases** write local outcomes and almost never inherit the parent's why.

The smallest evidence-backed change is a pair: (1) add a `purpose` value to the existing `_memory.continuity` block, populated from the packet's Problem & Purpose section (for a phase child, from the nearest ancestor that has one), and render it in the existing `Goal` facet; (2) stop `create.sh` substituting a generic parent purpose and stamp the phase-parent template `v2.4` so a new parent must author a real why. The first half carries the value across save, resume and compaction. The second half gives it something real to carry.

---

## Method

Five iterations, each with its own evidence set:

| # | Focus | Evidence |
|---|-------|----------|
| 1 | Where problem, purpose and user need are written today, per level and phase parent | Templates, level contract, validation contract, continuity schema |
| 2 | What each hop reads and emits | Hook source, resume/handoff/save workflows, deep-loop prompt, delegation brief contract |
| 3 | Real packet outcomes | 96 handovers, 2,870 implementation summaries, 297 phase parents, 1,029 parent-child purpose pairs |
| 4 | Candidate evaluation | Operator candidates A/B/C plus continuity-field and payload-line alternatives, ranked by coverage per migration risk |
| 5 | Ruled-out consolidation and stress test | Beneficiary scans, goal.md coverage, validator surface, failure-mode analysis |

Measurements are lexical and structural: exact-string probes, heading scans, and four-letter-word Jaccard overlap over purpose paragraphs. Corpus counts exclude `research_archive/`, `containment/`, `z_archive/`, `scratch/` and `node_modules/`. All counts were taken on 2026-11-13.

---

## Q1. Where are a packet's problem, purpose and user need written today, per level and for a phase parent, and which of those places is required and validated?

**Standard packets (Levels 1-3).** The only authored purpose carrier is `spec.md` §2 PROBLEM & PURPOSE: a Problem Statement and a one-sentence Purpose. [SOURCE: .skilled/skills/system-spec-kit/templates/core/spec.md.tmpl:100-112] Level 2 requires the anchors `metadata, problem, scope, requirements, success-criteria, risks, questions`; Level 1 requires `spec.md` itself; Level 3 adds only a lazy `decision-record.md`. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/template-structure.vitest.ts:74-83] [SOURCE: .skilled/skills/system-spec-kit/references/validation/validation-rules.md:218-223]

**What is validated.** Only structure. A document stamped `SPECKIT_TEMPLATE_SOURCE` v2.3 or later fails with `required anchor '<id>' is missing` for each anchor its rendered template requires; a v2.2 or unstamped document keeps integrity-only checking. `PLACEHOLDER_FILLED` catches unfilled template tokens. No rule grades whether the sentence says anything. [SOURCE: .skilled/skills/system-spec-kit/references/validation/validation-rules.md:449] [SOURCE: .skilled/skills/system-spec-kit/references/validation/validation-rules.md:57]

**Phase parents.** The validated contract is the lean trio `spec.md`, `description.json`, `graph-metadata.json`; heavy documents live in the children. [SOURCE: .skilled/skills/system-spec-kit/references/structure/phase-definitions.md:144-146] [SOURCE: .skilled/skills/system-spec-kit/references/validation/validation-rules.md:226-228] The parent template nevertheless lists "Root purpose: what problem does this entire phased decomposition solve?" as REQUIRED parent content and ships Problem Statement and Purpose subsections, with a note that this spec is the only authored parent document. [SOURCE: .skilled/skills/system-spec-kit/templates/packet-types/phase-parent.spec.md.tmpl:35-37] [SOURCE: .skilled/skills/system-spec-kit/templates/packet-types/phase-parent.spec.md.tmpl:63-71]

**The gap.** A phase parent is explicitly exempt from anchor checks and its template is stamped v2.2, so the v2.3+ required-anchor rule never fires. A parent can ship an empty Problem & Purpose and still pass `--strict`. [SOURCE: .skilled/skills/system-spec-kit/references/validation/validation-rules.md:443] [SOURCE: .skilled/skills/system-spec-kit/templates/packet-types/phase-parent.spec.md.tmpl:80]

**Secondary carriers, neither required.** `goal.md`'s Durable Directive asks for one sentence on what the packet is for, but `goal.md` is not in any level's required-file list. [SOURCE: .skilled/skills/system-spec-kit/templates/addons/goal.md.tmpl:38-41] `description.json` carries a one-line description, the only purpose-shaped field present at every level including a phase parent. [SOURCE: specs/system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers/description.json:2-9]

**User need.** No template or validator surface uses the term. A recursive search found it only in packet 006 itself; the nearest authored slot is the one-sentence Purpose, and the nearest machine-readable slot is `description.json`'s description. [SOURCE: specs/system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers/spec.md:36]

**Answer:** purpose is written once, in `spec.md` §2, at every level and in both packet shapes. It is structurally required for a standard packet, authoring-required but validator-exempt for a phase parent, and semantically unvalidated everywhere. The user need has no dedicated slot at all.

---

## Q2. For each hop surface, what does it read and what does it emit, and does the purpose travel?

| Surface | Reads | Emits | Purpose travels? |
|---|---|---|---|
| `session-prime` startup | hook state, last spec folder, optional cached brief | "Continuity: recover on demand from the packet docs" + recovery tools | No [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/session-prime.ts:230-251] |
| Claude pre-compaction | transcript analysis, authored continuity snapshot | `Active Files`, `Recent Topics`, `Recent Context`, continuity facets | No; the `Goal` facet is `next_safe_action` [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/compact-inject.ts:365-384] |
| Codex / dsh / pi / devin compaction | summary, active spec folder, history locator | summary + folder + lookup + recovery pointer | No [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/dsh/session-compact-context.mjs:126-142] [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/pi/session-compact-context.ts:148-165] [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/devin/post-compaction.cjs:265-285] |
| Authored continuity snapshot | `_memory.continuity` fields | `### Goal`, `### Decision`, `### Progress`, `### Gotcha` | No; `goal` facet = `next_safe_action` [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/continuity/thin-continuity-record.ts:289-313] |
| `/speckit:resume` | handover.md (<24h), continuity, supporting docs, ripgrep | `now|last|next|blockers|artifact` | No purpose slot; spec.md read is contradictory [SOURCE: .skilled/commands/speckit/assets/speckit-resume-auto.yaml:159-174] |
| `/speckit:handoff` + relaunch | packet continuity via save, session id | note with `## Goal`, `## Done`, `## Remaining work`, `## In-flight state` | Yes, but free-authored; `goal_packet` only when a goal.md is proven [SOURCE: .skilled/commands/speckit/handoff.md:104-131] [SOURCE: .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:822] |
| `/speckit:save` (`generate-context.js`) | JSON payload; writes leaf continuity | continuity block into leaf summary | No purpose field; a save aimed at a phase parent descends to the leaf [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/dist/continuity/generate-context.js:133-146] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/dist/continuity/generate-context.js:610-624] |
| Deep-loop iteration prompt | config topic, focus, questions | `Research Topic`, `Focus Area`, remaining questions | Only if the free-text topic contains a why [SOURCE: .skilled/skills/system-deep-loop/deep-research/assets/prompt-pack-iteration.md.tmpl:10-20] |
| Child-dispatch brief | task brief contract | files/symbols, tried work, frozen scope, question | No; purpose is in neither the required nor the forbidden list [SOURCE: .skilled/repo-rules/delegation-and-orchestration.md:96-100] |

**Contradiction recorded.** `speckit-resume-auto.yaml` lists `spec.md` in its `continuity_ladder` but omits it from both `context_loading_priority` and the step-2 activity list. [SOURCE: .skilled/commands/speckit/assets/speckit-resume-auto.yaml:92-93] [SOURCE: .skilled/commands/speckit/assets/speckit-resume-auto.yaml:106-110] [SOURCE: .skilled/commands/speckit/assets/speckit-resume-auto.yaml:159-174]

**Answer:** purpose does not travel on any automatic hop. The two surfaces with purpose vocabulary are the handoff Goal (free-authored) and the compaction `Goal` facet (actually an action). The rest have no slot to carry it.

---

## Q3. In real packets, is the purpose restated, shortened or absent? Do phase children restate the parent's purpose or drift?

**Handovers.** 96 packet handovers were scanned. 71 contain no occurrence of purpose, problem statement, objective, user need or "why this"; only 9 carry a purpose-like heading. The handover template's headings are `Handover Summary`, `Context Transfer`, `For Next Session`, `Validation Checklist`, `Session Notes`, so there is no purpose slot to fill. [SOURCE: .skilled/skills/system-spec-kit/templates/addons/handover.md.tmpl:37-84]

**Continuity saves.** 2,857 of 2,870 `implementation-summary.md` files carry a `_memory.continuity` block, while the summary template's sections are Metadata, What Was Built, Files Changed, How It Was Delivered, Key Decisions, Verification and Known Limitations. [SOURCE: .skilled/skills/system-spec-kit/templates/core/implementation-summary.md.tmpl:85-149] Of 2,315 packets with both a real Purpose and an implementation summary, **zero** carry even the first 80 characters of the purpose sentence verbatim and **zero** carry a Purpose heading. Purpose is absent from the document the save refreshes, not shortened in it.

**Phase parents.** Of 297 phase parents, 68 have an empty Purpose, 8 hold a scaffold placeholder, and 4 hold `create.sh`'s generic text, so 80 carry no real why. The most frequent real value (5 occurrences) describes the parent document's own role ("Own navigation, the child-phase map, and aggregate status for this theme"), not the work's problem.

**Phase children.** Across 1,029 parent-child pairs where both purposes are real text, **zero** children share a 60-character run with the parent and the median four-letter-word Jaccard overlap is **0.067**; 700 of 1,029 pairs fall below 0.10. Children write local outcomes. For a parent purpose about deciding what should surface repo rules, children wrote "CI fails when a rule's Fires-when bullet has no counterpart in its router row" and "The corpus shrinks by 20% to 28% while every norm, test, exception ... survives".

**Why drift is structural.** The child `spec.md` is scaffolded with a local Problem & Purpose, the parent is the only carrier of the cross-phase why, and no child scaffold or save path reads the parent document. [SOURCE: .skilled/skills/system-spec-kit/templates/core/spec.md.tmpl:100-112] [SOURCE: .skilled/skills/system-spec-kit/templates/packet-types/phase-parent.spec.md.tmpl:71]

**Answer:** purpose is absent from most handovers and from every measured continuity document, and phase children drift by construction. Restatement is the rare exception, not the default.

---

## Q4. Which candidate change closes the measured gap at the lowest cost?

The measured failure has three points: the parent purpose is unvalidated and often empty; the save target has no purpose slot; every recovery hop has no purpose slot. A candidate is scored by how many points it closes per unit of migration risk.

### Candidate A — parent-level acceptance criteria

**Verdict: ruled out as a purpose mechanism.** `acceptance-criteria.md` holds METADATA, Given/When/Then CRITERIA and a CLOSURE STATEMENT, so it measures completion and has no why slot. [SOURCE: .skilled/skills/system-spec-kit/templates/addons/acceptance-criteria.md.tmpl:41-83] Adding it to a parent contradicts the lean trio and forces `FILE_EXISTS` and `AC_CLOSURE` changes plus a 297-parent migration. Cost high; purpose coverage zero.

### Candidate B — parent-level user story or purpose and problem section

**Verdict: already exists in form; the missing part is substance.** The phase-parent template ships §2 PROBLEM & PURPOSE and marks root purpose REQUIRED. [SOURCE: .skilled/skills/system-spec-kit/templates/packet-types/phase-parent.spec.md.tmpl:35-37] But 80 of 297 parents carry no real why, because nothing forces a value and `create.sh` substitutes a generic sentence. A new section would duplicate the existing one.

### Candidate C — improved parent-specific spec template

**Verdict: insufficient alone.** The template already requires root purpose; a parent is exempt from anchors and stamped v2.2, so the requirement is unenforced. [SOURCE: .skilled/skills/system-spec-kit/references/validation/validation-rules.md:443] [SOURCE: .skilled/skills/system-spec-kit/references/validation/validation-rules.md:449] The generator fills the section with "Keep parent documentation lean while child phases own detailed plans, tasks, verification, and continuity", a statement about documentation layout. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1875-1876]

### Candidate D — a purpose value in the continuity block (recommended)

**Verdict: best coverage per unit of migration risk.** The block is present in 2,857 of 2,870 summaries, is the second rung of the resume ladder, and is rendered into the compaction snapshot. [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/continuity/thin-continuity-record.ts:60-73] [SOURCE: .skilled/commands/speckit/assets/speckit-resume-auto.yaml:106-110] [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/continuity/authored-continuity-snapshot.ts:104-115] One field therefore travels on save, resume and compaction. Cost is bounded to one subsystem: the record interface and validator, the `generate-context.js` payload/help and carry path, the `buildContinuityFacets` source, and their tests. The field can be optional, so no existing packet fails validation.

**What it must hold.** The user need is absent even where purpose is written: only 333 of 2,866 real Purpose paragraphs (11.6%) mention a beneficiary, and 623 of 2,884 Problem Statements (21.6%) do. The carried value must therefore include the Problem Statement, not only the Purpose sentence, or the who is still lost.

### Candidate E — a purpose line in the resume or compaction payload

**Verdict: a complement, not a substitute.** The compaction hook would need a disk read inside a tight budget, and the resume change helps one hop. Once the continuity block carries the value, both surfaces can read it with no extra packet read. [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/compact-inject.ts:365-384]

### Recommended change (paired)

1. **Carrier:** add `problem_and_purpose` (or `purpose`) to `_memory.continuity`, optional, populated by the save writer from the packet's `spec.md` §2 Problem & Purpose. For a phase child, walk to the nearest ancestor whose purpose is real, using the parent walk the save path already performs for phase-parent pointers. Render it as the `Goal` facet in the compaction snapshot, replacing `next_safe_action` there (the action remains available in `Progress`). [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/dist/continuity/generate-context.js:610-624]
2. **Authoring fix:** remove the generic parent-purpose substitution from `create.sh` so the template placeholder reaches the file and `PLACEHOLDER_FILLED` fails a Draft parent, and bump the phase-parent stamp to v2.4 so the `problem` anchor is required for new parents. Grandfather existing parents under the documented tolerant policy. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1875-1876] [SOURCE: .skilled/skills/system-spec-kit/templates/packet-types/phase-parent.spec.md.tmpl:80] [SOURCE: .skilled/skills/system-spec-kit/references/validation/validation-rules.md:228]

**Cost.** Two subsystems (continuity writer/snapshot; scaffold generator/template) and their tests. No new required file, no validator signature change, no corpus migration because the continuity field is optional and populated on the next save.

**How to validate the change.**
- Create a phase parent, add a child, run `/speckit:save` on the child, then `/speckit:resume`: the resume brief must show the parent's problem and purpose.
- Trigger a compaction: the injected `### Goal` must contain the carried purpose, not `next_safe_action`.
- Run `validate.sh --strict` on a new parent scaffolded without a purpose: it must fail `PLACEHOLDER_FILLED`. On an existing parent, it must still pass.
- Re-run the iteration-3 measurement: the verbatim-restatement count must move off zero for new saves, and the parent-child overlap on newly created children must rise above the 0.067 baseline.

---

## Q5. What is ruled out, and why?

| Direction | Why ruled out |
|---|---|
| A new parent-level document (acceptance criteria or a dedicated purpose file) | AC has no why slot; a new required parent file breaks the lean trio and forces a 297-packet migration [SOURCE: .skilled/skills/system-spec-kit/templates/addons/acceptance-criteria.md.tmpl:41-83] |
| An improved parent template alone | Root purpose is already required; parents are anchor-exempt, stamped v2.2, and filled with generic generator text [SOURCE: .skilled/skills/system-spec-kit/references/validation/validation-rules.md:443] |
| `handover.md` as the carrier | No purpose slot; 71 of 96 real handovers never mention purpose vocabulary [SOURCE: .skilled/skills/system-spec-kit/templates/addons/handover.md.tmpl:37-84] |
| The continuity block as it stands | Present in 99.5% of summaries but action-and-state only [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/continuity/thin-continuity-record.ts:60-73] |
| The compaction `Goal` facet | Filled from `next_safe_action` [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/continuity/thin-continuity-record.ts:289-303] |
| `/speckit:resume` as it stands | No purpose slot; contradictory `spec.md` read order [SOURCE: .skilled/commands/speckit/assets/speckit-resume-auto.yaml:92-93] |
| The relaunch note as compensation | Gitignored runtime state, unvalidated, no notes to sample [SOURCE: .skilled/commands/speckit/handoff.md:28-37] |
| `goal.md` as the general carrier | 889 of 2,912 packets (30.5%) have one; Objective vs Purpose median overlap 0.256 with 132 of 854 pairs below 0.10 [SOURCE: .skilled/skills/system-spec-kit/templates/addons/goal.md.tmpl:38-41] |
| A validator-only fix | Presence and token checks cannot grade meaning; fail-closed enforcement would fail 80 existing parents [SOURCE: .skilled/skills/system-spec-kit/references/validation/validation-rules.md:449] |
| Relying on children to restate the parent naturally | 0 of 1,029 pairs share a 60-character run; median overlap 0.067 |

**What would overturn the recommendation.** A surface that is both ubiquitous and already read by every hop. None was found: `handover.md` is often purpose-free, `goal.md` covers 30.5%, the continuity block is ubiquitous but purpose-blind, and the compaction and resume contracts have no purpose slot. If a future change makes `/speckit:resume` read `spec.md` unconditionally and emit a purpose field, the continuity-field carrier becomes redundant for the resume hop, though not for compaction.

---

## Residual Gaps and Limits

1. **Lexical measurement.** Overlap and beneficiary counts are word-based; paraphrased restatement is undercounted. The zero exact-restatement result is "no verbatim carry and no purpose heading", not proof that no summary paraphrases.
2. **No relaunch notes existed to sample.** The relaunch-note conclusion rests on its command contract, not observed notes.
3. **`opencode` has no injected compaction surface** in the audited tree, so purpose cannot travel there by design.
4. **Cost is structural.** File/subsystem counts and migration risk, not engineer-hours; the repository has no timing data for comparable changes.
5. **The recommended change is not implemented.** This packet is read-only research by design.

---

## References

Primary sources (all repository paths are repo-relative):

- `.skilled/skills/system-spec-kit/templates/core/spec.md.tmpl`
- `.skilled/skills/system-spec-kit/templates/packet-types/phase-parent.spec.md.tmpl`
- `.skilled/skills/system-spec-kit/templates/addons/handover.md.tmpl`
- `.skilled/skills/system-spec-kit/templates/addons/acceptance-criteria.md.tmpl`
- `.skilled/skills/system-spec-kit/templates/addons/goal.md.tmpl`
- `.skilled/skills/system-spec-kit/templates/core/implementation-summary.md.tmpl`
- `.skilled/skills/system-spec-kit/references/structure/folder-structure.md`
- `.skilled/skills/system-spec-kit/references/structure/phase-definitions.md`
- `.skilled/skills/system-spec-kit/references/validation/validation-rules.md`
- `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh`
- `.skilled/skills/system-spec-kit/runtime/cli/dist/continuity/generate-context.js`
- `.skilled/skills/system-spec-kit/runtime/lib/continuity/thin-continuity-record.ts`
- `.skilled/skills/system-spec-kit/runtime/lib/continuity/authored-continuity-snapshot.ts`
- `.skilled/skills/system-spec-kit/runtime/hooks/claude/session-prime.ts`
- `.skilled/skills/system-spec-kit/runtime/hooks/claude/compact-inject.ts`
- `.skilled/skills/system-spec-kit/runtime/hooks/dsh/session-compact-context.mjs`
- `.skilled/skills/system-spec-kit/runtime/hooks/pi/session-compact-context.ts`
- `.skilled/skills/system-spec-kit/runtime/hooks/devin/post-compaction.cjs`
- `.skilled/commands/speckit/resume.md`
- `.skilled/commands/speckit/handoff.md`
- `.skilled/commands/speckit/assets/speckit-resume-auto.yaml`
- `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs`
- `.skilled/skills/system-deep-loop/deep-research/assets/prompt-pack-iteration.md.tmpl`
- `.skilled/repo-rules/delegation-and-orchestration.md`
- `specs/**/spec.md`, `specs/**/handover.md`, `specs/**/implementation-summary.md`, `specs/**/goal.md` (corpus scans)

Line-level citations for each claim live in `iterations/iteration-001.md` through `iteration-005.md` and in `deltas/iter-001.jsonl` through `iter-005.jsonl`.

---

## Convergence Report

- Stop reason: `maxIterationsReached`
- Total iterations: 5 of 5
- Questions answered: 5 / 5
- Remaining questions: 0
- Last 3 iteration summaries: run 3 (corpus evidence, ratio 0.94); run 4 (candidate evaluation, ratio 0.94); run 5 (ruled-out consolidation and stress test, ratio 0.87)
- Convergence threshold: 0.05
- Divergence summary: no divergent pivots recorded; the four focus tracks (`authoring-contract`, `hop-surfaces`, `corpus-evidence`, `candidate-evaluation`) each produced independent evidence.
- Note: convergence was not claimed early; the dependency chain between Q1-Q2 (mechanism), Q3 (measured outcome), Q4 (candidate ranking) and Q5 (elimination) required all five iterations.

### Scope conflict recorded

The workflow's `step_writeback_spec_findings` and `step_validate_post_synthesis_spec_doc` steps write to `{spec_folder}/spec.md`, which is outside this lineage's write surface. They were not executed; this synthesis is the canonical findings output for the lineage. The parent orchestration can write the generated findings fence at merge time.
