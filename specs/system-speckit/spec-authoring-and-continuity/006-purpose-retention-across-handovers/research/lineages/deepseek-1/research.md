---
title: "Research Synthesis: Keep a packet's core purpose across handovers and compactions"
description: "Where a system-spec-kit packet's problem, purpose and user need are dropped across session handovers, relaunch hops and context compactions, and the smallest change that keeps them."
trigger_phrases:
  - "purpose retention across handovers"
  - "why compaction loses the purpose"
importance_tier: normal
contextType: general
---
# Research Synthesis: Purpose Retention Across Handovers

<!-- SPECKIT_TEMPLATE_SOURCE: research | v2.4 -->
<!-- SPECKIT_LEVEL: research -->

## 1. METADATA

| Field | Value |
|-------|-------|
| Research packet | `specs/system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers` |
| Lineage | `deepseek-1` (5 iterations, max-iterations stop policy) |
| Questions | 5 of 5 answered |
| Iterations | 5 (`iteration-001` … `iteration-005`) |
| Sources | 48 findings, every one cited to a file or a measured command |
| Mode | Read-only research; no file outside the lineage was modified |

---

## 2. INVESTIGATION REPORT

### Q1. Where are a packet's problem, purpose and user need written today, per level and for a phase parent, and which of those places is required and validated?

**Answer.** The problem and purpose are written once, in `## 2. PROBLEM & PURPOSE` with `### Problem Statement` and `### Purpose`, and that is true at every authored level. The user need, as a distinct statement, is written only at Level 3 and above. The section is declared required at Levels 1-3 and at the phase level, but the executed check covers only stamped Level 1-3 documents and explicitly exempts phase parents, so the parent's requirement is declared and not enforced.

- The core template carries the section for Levels 1-3/3+ [SOURCE: .skilled/skills/system-spec-kit/templates/core/spec.md.tmpl:99-107]; the phase-parent template carries the same two subsections [SOURCE: .skilled/skills/system-spec-kit/templates/packet-types/phase-parent.spec.md.tmpl:63-72]; the research-record template carries it too [SOURCE: .skilled/skills/system-spec-kit/templates/packet-types/research.spec.md.tmpl:57-67].
- The only `As a … I want … so that …` surface is `## 11. USER STORIES`, emitted inside `<!-- IF level:3,3+ -->` [SOURCE: .skilled/skills/system-spec-kit/templates/core/spec.md.tmpl:326-347]. At Levels 1-2 the user need exists only as prose inside the Problem Statement.
- Level contract: Levels 1-3 require `spec.md`, `plan.md`, `tasks.md`; `implementation-summary.md` only after implementation starts; `handover.md`, `goal.md`, `timeline.md`, `decision-record.md` and `research/research.md` are lazy addons; `acceptance-criteria.md` is optional at Levels 2-3 with `AC_CLOSURE` as the separate gate [SOURCE: .skilled/skills/system-spec-kit/templates/spec-kit-docs.json:104; .skilled/skills/system-spec-kit/references/structure/folder-structure.md:158-190].
- The phase level requires `spec.md` alone and declares `problem` required for it [SOURCE: .skilled/skills/system-spec-kit/templates/spec-kit-docs.json:1844-1848].
- Enforcement: `ANCHORS_VALID` requires every anchor whose template section is a required H2, but only for documents carrying a v2.3+ stamp, which a v2.4 spec does [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:758-768,1028-1035]. It returns early for a phase parent with `'Phase parent lean document set accepted'` [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:963-970], and the sufficiency loop enforces missing anchors only for `timeline.md` and `goal.md` [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts:1182-1191].
- No rule reads the purpose prose: grep counts for `problem` are zero across the validator modules; the only content checks are placeholder tokens and the non-empty-anchor-body check [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:752-756,889-899].
- The successor-facing surfaces carry no purpose field: `handover.md` has no problem/purpose heading [SOURCE: .skilled/skills/system-spec-kit/templates/addons/handover.md.tmpl:37,50,84,107,121], and the `_memory.continuity` block has `recent_action`, `next_safe_action`, `blockers`, `key_files`, `completion_pct`, `open_questions`, `answered_questions` and no purpose key [SOURCE: .skilled/skills/system-spec-kit/templates/core/implementation-summary.md.tmpl:38-63].

### Q2. For each hop surface, what does it read and what does it emit, and does the purpose travel?

**Answer.** No hop carries the purpose, and the compaction path actively substitutes the next action for the goal.

| Surface | Reads | Emits | Purpose travels? |
|---|---|---|---|
| Claude PreCompact (`compact-inject.ts`) | Transcript tail: active files, recent topics, attention signals, last five meaningful lines, detected spec-folder path | Budgeted brief with `Active files`, `Recent topics`, `Working memory attention`, `Recent context`, `Active spec folder` | No — no packet document is opened [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/compact-inject.ts:443-492] |
| Continuity snapshot path (Claude, opt-in) | Thin continuity record | `Goal` / `Decision` / `Progress` / `Gotcha` facets | No — `Goal` is filled from `next_safe_action` [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/continuity/thin-continuity-record.ts:289-323]; the path needs `authored_continuity_snapshot: true` [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/compact-inject.ts:348-355] |
| `session-prime.ts` | Session lifecycle | Startup pointers; after compaction, `Run /speckit:resume …` | No — pointers only [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/session-prime.ts:135-170,230-258] |
| Codex PreCompact | Delegates to the Claude adapter | Same as Claude | No [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/codex/compact-inject.ts:36-38] |
| DSH compaction | Shared session-prime output | Base context + `/speckit:resume` pointer | No [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/dsh/session-compact-context.mjs:7,122,126-142; .skilled/skills/system-spec-kit/runtime/hooks/dsh/session-start-context.mjs:44-58] |
| Pi / Devin compaction | Retained summary, `lastSpecFolder` | Summary + `## Active Spec Folder` + recovery pointer | No [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/pi/session-compact-context.ts:141-190; .skilled/skills/system-spec-kit/runtime/hooks/devin/post-compaction.cjs:266-290] |
| `/speckit:resume` workflow | Its own ladder: `handover.md` → `_memory.continuity` → spec docs → ripgrep for a named gap | Brief with `Confidence`, `Context source`, `Now`, `Last confirmed`, `Next safe action` | Not rendered — no purpose row [SOURCE: .skilled/commands/speckit/assets/speckit-resume-auto.yaml:105-112,138] |
| `buildResumeLadder` (code) | Handover labelled fields, thin continuity record, spec-doc snapshots | `summary`, `recentAction`, `nextSafeAction`, `blockers`, `keyFiles`, `documents`, `packetPointer` | No purpose field exists [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/resume/resume-ladder.ts:56-72,632-712,758-790] |
| `/speckit:handoff` | Bound packet | Continuity save first, then a handover note | No — note template has no purpose [SOURCE: .skilled/commands/speckit/handoff.md:42,61,78-88] |
| `/speckit:save` (`generate-context`) | Session payload | Compact continuity: `recent_action` (≤96 chars), `next_safe_action` (≤16 words), `blockers`, `key_files` (≤5), `completion_pct`, questions | No — mechanics only [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/continuity/generate-context.ts:170-181] |
| Deep-loop child brief | Config `research_topic` | `Research Topic:` plus focus and questions per iteration | Yes — the one hop that restates the topic [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1655-1669; .skilled/skills/system-deep-loop/deep-research/assets/prompt-pack-iteration.md.tmpl:11-16] |

The mechanism behind the operator's observation is finding 3 of iteration 2: the facet a compacted session reads under the heading "Goal" is `next_safe_action`. The session keeps the mechanics and loses the purpose by construction, not by accident.

### Q3. In real packets under `specs/` that have a `handover.md` or several continuity saves, is the purpose restated, shortened or absent? Do phase children restate the parent's purpose or drift from it?

**Answer.** It is absent on both successor surfaces and drifts between parent and child.

- Purpose is authored and mostly filled at spec level: of 3,294 live `spec.md` files, 3,211 carry the `problem` anchor, 2,943 have filled Purpose text, 22 keep a placeholder, 246 have an empty Purpose subsection [INFERENCE: measured by the extraction walk in iteration 3].
- 0 of 97 `handover.md` files has a Purpose heading; 22 mention purpose/problem/objective incidentally (a checklist pointer to `spec.md`, a "purpose-built" port note, a frontmatter description) [SOURCE: specs/system-deep-loop/loop-architecture/001-deep-loop-innovation/012-runtime-enablement/handover.md:173].
- Exactly one of 97 restates an objective, as an author-added `- **Objective:**` bullet no parser reads [SOURCE: specs/system-deep-loop/z_archive/022-sk-deep-research-evolution/005-sk-deep-research-review-mode/handover.md:33].
- 0 purpose-like keys exist at continuity indentation in any `implementation-summary.md` in `specs/` — absence by construction given the six-field record [INFERENCE: grep over `specs/**/implementation-summary.md`, iteration 3].
- 68 of the 97 handover packets also carry `implementation-summary.md`, so the "several continuity saves" case is common and both surfaces are purpose-free.
- Phase children drift: on the largest live parent (69 numbered children, 65 with purpose text) only 16 share at least three significant words with the parent's 481-character purpose; children 001 and 002 share zero [SOURCE: specs/system-speckit/runtime-and-release/001-system-speckit-v4/spec.md:71; specs/system-speckit/runtime-and-release/001-system-speckit-v4/001-plan-preflight-track-packets/spec.md:66; specs/system-speckit/runtime-and-release/001-system-speckit-v4/002-daemon-reaper-orphan-classification/spec.md:72].
- The parent's purpose is a container statement and already stale: it says "the thirty-eight packets as phases" while the folder holds 69 numbered children [SOURCE: specs/system-speckit/runtime-and-release/001-system-speckit-v4/spec.md:71].

### Q4. Which candidate change closes the measured gap at the lowest cost?

**Answer (corrected in iteration 5).** The gap is on the read side. The purpose already exists in `spec.md` and, in 94 of 319 phase parents, in `goal.md`; no hop reads either. The cheapest closing change is one `Purpose` row in the `/speckit:resume` workflow's reply format, sourced from the `spec.md` its ladder already reads.

| Candidate | Closes the gap? | Cost |
|---|---|---|
| (a) Parent-level acceptance criteria | No — no purpose column in the AC schema, and only 10 of 319 parents carry the file | Highest: level manifest, `AC_CLOSURE` scope, `create.sh` seeding, template |
| (b) Parent-level user story or purpose section | No — the phase-parent template already has Problem & Purpose and the validator exempts parents | Zero effect |
| (c) Improved parent-specific template | No — the template cannot supply a reader | Authoring only |
| (d) Purpose field in the continuity block | Partially — leaves 29 handover-only packets and needs a migration for 4,657 summaries | Highest of the code options: record + validation + save payload + template + parser |
| (e) Purpose line in the compaction brief | Partially — one hop; needs per-runtime wiring; Claude's continuity path is opt-in | Low on Claude (`lastSpecFolder` already persisted [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/hook-state.ts:345]) |
| **(f) `Purpose` row in the resume reply format** | **Yes — every runtime's recovery pointer lands on `/speckit:resume`** | **Three text assets, no schema, no migration** |

- (a) is ruled out by the AC template's columns (`AC-ID`, `REQ`, `Given/When/Then`, `Verification`, `Status`, `Waiver`) [SOURCE: .skilled/skills/system-spec-kit/templates/addons/acceptance-criteria.md.tmpl:57-66] and by the phase level's empty optional-addon list [SOURCE: .skilled/skills/system-spec-kit/templates/spec-kit-docs.json:1848].
- `goal.md`'s durable directive is a purpose carrier with no consumer: 0 references in `resume-ladder.ts`, in `runtime/hooks/**` and in `runtime/lib/continuity/**` [INFERENCE: grep counts, iteration 4].
- The resume workflow already reads `spec.md` as the third rung of its ladder [SOURCE: .skilled/commands/speckit/assets/speckit-resume-auto.yaml:105-112], while its reply format has no purpose field [SOURCE: .skilled/commands/speckit/assets/speckit-resume-auto.yaml:138]. Adding the row is the smallest change that puts the purpose in front of a resumed session.
- The programmatic `buildResumeLadder` has one non-test consumer, the opt-in authored snapshot [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/continuity/authored-continuity-snapshot.ts:201]; changing its signal alone would not reach the operator-facing brief.

**Proposed change, in one sentence.** Add a one-sentence `Purpose` row to the resume brief (auto + confirm assets and the presentation template), populated from the `### Purpose` subsection of the packet's `spec.md` that the ladder already reads, falling back to a `#### DURABLE DIRECTIVE → Objective` line from `goal.md` when present, and omit the row rather than print "None" when neither exists.

**How to validate it.**
1. Render `/speckit:resume` against this packet (`…/006-purpose-retention-across-handovers`) and confirm the brief shows `Purpose: Find where a packet's problem, purpose and user need are dropped on each hop, and name the smallest change …` — the text already in its `spec.md` §2.
2. Render it against a packet whose `goal.md` exists and whose `spec.md` purpose is empty; confirm the objective is used.
3. Render it against a packet with neither; confirm the row is absent rather than "None".
4. If the programmatic path is also updated, extend `resume-ladder.vitest.ts` with the same three fixtures [SOURCE: .skilled/skills/system-spec-kit/runtime/tests/resume-ladder.vitest.ts].

### Q5. What is ruled out, and why?

1. **Parent-level acceptance criteria** — no purpose column, 10 of 319 parents carry the file, four or more edit points to enable it.
2. **A parent-level user story or purpose section as a standalone change** — the phase-parent template already carries Problem & Purpose; the validator exempts parents; no hop reads it.
3. **An improved parent-specific template as the closing change** — a template cannot supply a reader.
4. **A purpose field in the continuity block as the cheapest option** — the most expensive of the code options, needs a migration for 4,657 summaries, and still leaves handover-only packets bare.
5. **The compaction brief as the primary carrier** — one hop only, per-runtime wiring, and Claude's continuity path is opt-in.
6. **Relying on authors to restate the purpose in handovers** — 0 of 97 have a heading; one restates it outside any parsed field.
7. **Using validation as the lever** — the only executed required-anchor check exempts phase parents and the phase `problem` gate is never executed, so a validator change enforces authoring without crossing a hop.
8. **The programmatic ladder as the brief's renderer** — it is consumed only by the opt-in authored snapshot; the visible brief comes from the command workflow's reply format.

---

## 3. MEASURED EVIDENCE

| Measure | Value | How measured |
|---|---|---|
| Live `spec.md` with the `problem` anchor | 3,211 of 3,294 | Anchor extraction walk, iteration 3 |
| Purpose subsection filled / placeholder / empty | 2,943 / 22 / 246 | Same walk |
| `handover.md` with a Purpose heading | 0 of 97 | `rg` over `specs/**/handover.md` |
| Handovers restating an objective | 1 of 97 | Line inspection |
| Continuity blocks with a purpose key | 0 | `rg` at continuity indentation |
| Handover packets with `implementation-summary.md` | 68 of 97 | Directory check |
| Phase parents (live) | 319 | Parent walk, iteration 4 |
| Phase parents with `goal.md` / `acceptance-criteria.md` | 94 / 10 | Same walk |
| Readers of `goal.md` in resume/hooks/continuity | 0 | `rg` counts, iteration 4 |
| Child purposes sharing ≥3 significant words with the parent's | 16 of 65 | Lexical probe, iteration 3 |
| Programmatic ladder consumers | 1 (opt-in snapshot) | `rg` over `.skilled`, iteration 5 |

---

## 4. ELIMINATED ALTERNATIVES

| Alternative | Why eliminated | Evidence |
|---|---|---|
| Make the validator require the parent's purpose | Enforces authoring, not reading; the parent's `problem` gate is already declared and never executed | `orchestrator.ts:963-970`; `spec-kit-docs.json:1844-1848` |
| Add purpose to `_memory.continuity` | Highest cost, migration, still leaves handover-only packets uncovered | `thin-continuity-record.ts:60-78`; `generate-context.ts:170-181` |
| Rely on a purpose paragraph in `handover.md` | The parser reads four labelled fields; an unlabelled paragraph is not in the signal shape | `resume-ladder.ts:632-640` |
| Rename the "Goal" facet only | Relabels the next safe action without adding the purpose | `thin-continuity-record.ts:289-323` |
| Parent-level acceptance criteria as the carrier | The AC schema has no purpose column | `acceptance-criteria.md.tmpl:57-66` |
| New user-story section on the parent | The parent already has Problem & Purpose; no reader | `phase-parent.spec.md.tmpl:63-72` |

---

## 5. DIVERGENCE MAP

- Saturated directions: none. The lineage ran five planned iterations on five distinct questions; no direction was re-entered after saturation.
- Completed pivots: 0. Failed pivots: 0. Audited overrides: 0.
- Pivot lineage: none. The only mid-lineage correction was iteration 5's consumer trace, which superseded iteration 4's edit-point list while keeping its read-side conclusion.
- Remaining frontier: whether a purpose line in the brief changes what a model actually does after a compaction (behavioral, not measurable from the repository), and whether `goal.md`'s zero-reader status is a separate defect worth its own packet.

---

## 6. OPEN QUESTIONS

- None blocking. The five section-7 questions are answered.
- Follow-ups for a later packet: (a) does a `Purpose` row measurably change post-compaction behavior; (b) should `goal.md` be added to the resume ladder's document priority given 94 phase parents author it; (c) should the "Goal" facet be relabelled once a true purpose exists next to it.

---

## 7. RESIDUAL RISKS OF THE RECOMMENDATION

- The brief is model-rendered from instructions, so a `reply_format` row is a softer guarantee than code; the workflow's sufficiency rule should name the purpose or the row will be skipped silently.
- A purpose string can be long (the measured parent purpose is 481 characters); the brief needs a one-sentence rule.
- A failed phase-parent redirect can surface the parent's stale container purpose (38 stated, 69 children); the row should be labelled as the parent's when that happens.
- The misleading "Goal" facet stays in place until separately fixed, so two surfaces would use "goal" for different things.

---

## 8. REFERENCES

- `.skilled/skills/system-spec-kit/templates/core/spec.md.tmpl`
- `.skilled/skills/system-spec-kit/templates/packet-types/phase-parent.spec.md.tmpl`
- `.skilled/skills/system-spec-kit/templates/addons/handover.md.tmpl`
- `.skilled/skills/system-spec-kit/templates/addons/goal.md.tmpl`
- `.skilled/skills/system-spec-kit/templates/addons/acceptance-criteria.md.tmpl`
- `.skilled/skills/system-spec-kit/templates/core/implementation-summary.md.tmpl`
- `.skilled/skills/system-spec-kit/templates/spec-kit-docs.json`
- `.skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts`
- `.skilled/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts`
- `.skilled/skills/system-spec-kit/runtime/lib/continuity/thin-continuity-record.ts`
- `.skilled/skills/system-spec-kit/runtime/lib/continuity/authored-continuity-snapshot.ts`
- `.skilled/skills/system-spec-kit/runtime/lib/resume/resume-ladder.ts`
- `.skilled/skills/system-spec-kit/runtime/hooks/claude/compact-inject.ts`
- `.skilled/skills/system-spec-kit/runtime/hooks/claude/session-prime.ts`
- `.skilled/skills/system-spec-kit/runtime/hooks/claude/hook-state.ts`
- `.skilled/skills/system-spec-kit/runtime/hooks/{codex,dsh,pi,devin,cursor}/`
- `.skilled/skills/system-spec-kit/runtime/cli/continuity/generate-context.ts`
- `.skilled/commands/speckit/resume.md`, `handoff.md`, `assets/speckit-resume-{auto,confirm}.yaml`, `assets/speckit-resume-presentation.txt`
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`, `assets/prompt-pack-iteration.md.tmpl`
- Corpus: `specs/**/spec.md` (3,294 live), `specs/**/handover.md` (97), `specs/**/implementation-summary.md` (4,657)

---

## Convergence Report
- Stop reason: maxIterationsReached
- Total iterations: 5
- Questions answered: 5 / 5
- Remaining questions: 0
- Last 3 iteration summaries: run 3: corpus measurement (1.00) | run 4: candidate ranking (0.80) | run 5: rule-outs and correction (0.70)
- Convergence threshold: 0.05 (telemetry only; stopPolicy is `max-iterations`)
- Divergence summary: no divergent pivots recorded; one evidence-forced correction of the recommendation's edit point in iteration 5

---

## Eliminated Alternatives

See §4. Each row names what it would take to build, why it does not close the measured gap, and the cited evidence that rules it out.

---

## History

| Date | Change |
|---|---|
| 2026-11-13 | Lineage `deepseek-1`: five iterations, five questions answered, synthesis compiled |
