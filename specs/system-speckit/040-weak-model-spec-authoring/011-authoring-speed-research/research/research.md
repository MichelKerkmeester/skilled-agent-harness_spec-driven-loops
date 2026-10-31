---
title: "Research: where spec-kit authoring time goes, and which changes make it faster without losing packet 054's quality"
description: "Verified synthesis of the five-iteration pi-deepseek lineage: every cited claim re-checked against the repository, four claims dropped, six corrected, and twelve changes ranked by time saved against quality risk, three of them buildable now."
trigger_phrases:
  - "spec authoring speed research"
  - "authoring speed ranked changes"
  - "source tags fsmonitor slow validation"
  - "spec kit upkeep cost"
importance_tier: "important"
contextType: "research"
---
# Research: where spec-kit authoring time goes

<!-- SPECKIT_TEMPLATE_SOURCE: research | v1.0 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Topic** | Where AI models spend time writing and maintaining spec-kit docs, and which changes make authoring and upkeep faster than before packet 054 while keeping the card, the v2.3 value tokens, the GOOD and WEAK fill notes, the two guards and the versioned placeholder gate |
| **Packet** | `specs/system-speckit/054-weak-model-spec-authoring/011-authoring-speed-research` |
| **Lineage** | `pi-deepseek` (one fan-out lineage, cli-pi, DeepSeek V4.1 Flash) |
| **Iterations** | 5, stop reason `maxIterationsReached` |
| **Lineage findings** | 45 in `findings-registry.json`, 17 ruled-out directions |
| **Synthesis** | Every finding treated as a hypothesis. Each source citation in the iterations was opened, the numbers were re-measured, and three new measurements were taken (section 4) |
| **Date** | 2026-10-25 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:investigation-report -->
## 2. INVESTIGATION REPORT

### Request Summary

Find where authoring and upkeep time goes in the spec-kit path, and rank concrete changes that make it faster than the pre-054 tree without giving back what 054 added. Each change names the files it touches, its time saving and the basis for it, its quality risk and its effort, and is marked `build now` or `defer`. `build now` means small, low risk, file-disjoint from phase 010 or safely sequenced after it, buildable tonight by three agents in under 45 minutes, and provable by a check. Anything that needs the 2026-10-26 speed benchmark to judge, or that changes an existing packet's verdict (parent decision D2), is `defer`.

### Current Behavior

A new packet is four documents scaffolded from level-gated templates that keep their fill notes, filled under an 11-section card, and checked by a 41-rule validator. Strict validation of an ordinary packet takes about 1.3 seconds here. A packet that holds `research/` or `review/` artifacts takes 15 to 33 seconds, and almost all of that is one rule waiting on the git file-system monitor. A model that routes a planning task through the skill's `PLAN` intent is pointed at eight reference documents totalling 15,293 words, twice the 7,255 words of the four core templates.

### Key Findings

1. **The lineage's headline speed claim is wrong.** It credits two fill-note sentences with a 58.7-second (23%) cut. The 252.3-second mean is the pre-054 tree; the set run before the `fix-completeness` note fix already averaged 194.7 seconds, and the set after it 193.7 (section 5). The note fix moved the mean by one second, under unequal load. (observed)
2. **The biggest measured, risk-free saving is in validation upkeep, not authoring.** The citation scanner behind `SOURCE_TAGS` takes 6.9 to 9.9 seconds with the git file-system monitor and 0.9 seconds without it, with identical output. (observed)
3. **The biggest read-volume cost is the `PLAN` resource bundle, not the templates.** Four of its eight documents (8,687 words) explain a level choice that `recommend-level.sh` makes in one call. (observed volume, time inferred)
4. **The required-anchor gap is real, but smaller than the lineage says, and phase 010 is already closing it.** Of the three benchmark sets that failed on missing anchors, two lost only optional anchors; a required-anchor gate would have caught one of the three. (observed)
5. **The card tells a model three different things about a plan with more than four steps**: "Do not raise the level yourself" (section 2), "Split it or raise the level" (section 6) and "Stop and write the question" (section 11). The only diagnosed authoring failure in the benchmark was a note a model read as permission. (observed text, effect inferred)

### Recommendations

Build three changes now in three file-disjoint lanes (`phase-012-proposal.md`): skip the file-system monitor in the citation scanner, remove the card's level-raising contradiction and align the tasks template's frontmatter with its own task format (after phase 010 commits), and drop the inconsistent document-size LOC figures. Defer the rest until the 2026-10-26 benchmark can price them; the largest deferred item is the `PLAN` bundle cut.
<!-- /ANCHOR:investigation-report -->

---

<!-- ANCHOR:executive-overview -->
## 3. EXECUTIVE OVERVIEW

### Executive Summary

Packet 054 did not make authoring measurably slower: every post-054 DeepSeek set was faster than the pre-054 baseline, under load the report itself calls unequal. What the evidence supports tonight is narrow. One upkeep path is slow for a mechanical reason and can be fixed with no quality risk. Two texts a model reads contradict themselves and can be fixed in a sentence each once phase 010 lands. Every change that cuts what a model reads (fill notes, card sections, the planning bundle, a one-document packet) is plausible, unmeasured, and waits for the benchmark.

### Quick Reference

| Surface | Value | Class |
|---|---|---|
| Composed Level 1 core templates (HEAD) | 14,673 bytes, 427 lines, 26 fill notes | observed |
| Finished Level 1 example (HEAD) | 14,621 bytes | observed |
| Fill-note share of composed Level 1 spec / plan / tasks | 33.3% / 35.6% / 41.5% | observed |
| Authoring card | 1,246 words at HEAD, 1,291 in the working tree (phase 010 editing) | observed |
| `PLAN` intent bundle in `SKILL.md` | 8 documents, 15,293 words, 116,813 bytes | observed |
| Strict validation, phase 009 | 1.29 s wall | observed, one run |
| Strict validation, phase 011 (holds `research/`) | 32.66, 16.29, 15.49 s wall | observed, three runs, phase 010 lanes active |
| `SOURCE_TAGS` alone on phase 011 | 18.91 s | observed, one run |
| Citation helper, monitor on / off | 6.93 and 9.85 s / 0.90 and 0.88 s | observed, alternating runs |
| DeepSeek Level 3 brief, mean seconds | 252.3 pre-054; 233.3, 194.7, 193.7 post-054 | recorded, unequal load |

### Research Sources

Repository-internal only: the five lineage iterations and its registry, the spec-kit templates, examples, card, references, validator registry and rule scripts, `SKILL.md`, the 2026-10-25 authoring benchmark report, and the plans and summaries of phases 003, 009 and 010. The resource map is `research/resource-map.md`.
<!-- /ANCHOR:executive-overview -->

---

## 4. METHOD AND VERIFICATION

1. Read all five iterations, the lineage synthesis, both registries, the strategy and the resource map.
2. Opened every source citation the iterations make and compared the claim with the file. Section 9 records each verdict.
3. Re-rendered the four core templates at levels 1, 2 and 3 by applying their `<!-- IF level:N -->` gates (the same gates `runtime/cli/templates/inline-gate-renderer.sh` applies), at HEAD and in the working tree, and counted bytes, lines, words and fill notes. The renderer keeps fill notes, so a scaffold carries them [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/templates/inline-gate-renderer.sh:27].
4. New measurements the lineage could not take: wall time of `validate.sh --strict` on phases 009 and 011, a per-rule bisection with `SPECKIT_RULES`, and the citation helper run alternately with and without `core.fsmonitor=false` (set through `GIT_CONFIG_COUNT`, no file changed). All timings ran while phase 010 lanes were active on the same machine, so they are single-machine observations under load, not benchmarks.
5. Read phase 010's plan to mark every recommendation that touches a file its lanes are editing.

Nothing outside the two output files was written. `git status --porcelain` printed 79 lines before and after the validation runs.

---

## 5. WHERE THE TIME GOES

### Template and fill-note volume (observed)

| Document | L1 bytes / fills | L2 bytes / fills | L3 bytes / fills |
|---|---|---|---|
| `spec.md` | 4,449 / 7 | 6,751 / 10 | 8,306 / 14 |
| `plan.md` | 3,653 / 7 | 8,031 / 11 | 11,720 / 15 |
| `tasks.md` | 2,875 / 6 | 7,363 / 16 | 10,870 / 22 |
| `implementation-summary.md` | 3,696 / 6 | 3,701 / 6 | 3,701 / 6 |

HEAD values; the working tree differs by under 100 bytes per document because phase 010 is editing them. Level gating removes 73% of the raw `spec.md.tmpl` (16,442 bytes) at Level 1, so raw template sizes overstate small-work cost by far more than the lineage's 46%.

### What a model is told to read (observed)

- **On the card path**, section 4 sends the author to one example's `spec.md` and `tasks.md` and to the scaffold's own fill notes, nothing else [SOURCE: .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:62]. The lineage's "26 KB guidance stack" (card plus fill-guidance catalog leaf plus level-selection guide) is not on this path.
- **On the skill-routed path**, the `PLAN` intent lists eight documents [SOURCE: .skilled/skills/system-spec-kit/SKILL.md:174]: the card (1,291 words), `intake-contract.md` (2,096), `template-compliance-contract.md` (1,947), `level-decision-matrix.md` (2,089), `complexity-decision-matrix.md` (1,523), `level-selection-guide.md` (1,059), `level-specifications.md` (4,016) and `folder-structure.md` (1,272). The four level documents total 8,687 words for a decision the card scripts as one command [SOURCE: .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:38].

### The one timed fixture (recorded, corrected)

The benchmark ran one frozen Level 3 brief, three runs per set, on cli-devin DeepSeek V4.1 Flash. Means: 252.3 s on the pre-054 tree `ac2be31ec6`, 233.3 s on the post-054 tree with the L3+ label fix [SOURCE: .skilled/skills/system-spec-kit/benchmark/reports/2026-10-25--model-eval--authoring-baseline/README.md:64], 194.7 s on the next set before the `fix-completeness` note fix [SOURCE: .skilled/skills/system-spec-kit/benchmark/reports/2026-10-25--model-eval--authoring-baseline/README.md:90], and 193.7 s after it [SOURCE: .skilled/skills/system-spec-kit/benchmark/reports/2026-10-25--model-eval--authoring-baseline/README.md:118]. The report states the seconds are not like-for-like [SOURCE: .skilled/skills/system-spec-kit/benchmark/reports/2026-10-25--model-eval--authoring-baseline/README.md:167]. Supported reading: post-054 runs were not slower than pre-054 runs on this brief. Unsupported: that any single note change saved time.

---

## 6. VALIDATION GATES AND THE FIX LOOP

- **Rule surface (observed).** 41 rules: 22 `authored_template`, 13 `operational_runtime`, 6 `structural`; 32 error, 7 warn, 2 info; three carry `strict_only` (`CONTINUITY_FRESHNESS`, `GENERATED_METADATA_INTEGRITY`, `GENERATED_METADATA_DRIFT`).
- **Validator time (observed, corrects the lineage).** The reference cites about 108 ms from packet 004's harness [SOURCE: .skilled/skills/system-spec-kit/references/validation/validation-rules.md:821]. Measured here end to end: 1.29 s on phase 009, and 15.5 to 32.7 s on phase 011. Bisection put 18.91 s of it in `SOURCE_TAGS`; every other rule tried ran in 0.16 to 0.23 s.
- **Why `SOURCE_TAGS` is slow (observed).** Its helper lists untracked files with `git ls-files --others` [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-source-tags-helper.mjs:108] and calls sk-doc's `listTrackedFiles`, which runs `git ls-files -z` [SOURCE: .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:195]. This worktree sets `core.fsmonitor=true`. Tracked listing took 1.07 to 9.69 s with the monitor and 0.06 s without; untracked listing 1.07 to 13.7 s against 0.63 s. Phase 010 fixes the same class in the trigger index with `-c core.fsmonitor=false` [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs:205]. Who pays: every strict run of a packet with `research/` or `review/`, including the recursive strict run that closes a phase parent. A second, larger cost is suspected but not diagnosed: the helper ran for more than five minutes on the packet 054 parent (which holds `review/`) before it was stopped, and `git log -M --diff-filter=R --name-status --format= HEAD`, the rename listing the scanner uses for moved files, took 136 seconds on its own here. Whether unresolved citations send the scanner into that listing is the next check; the lane 1 fix does not touch it.
- **Required anchors (observed, narrowed).** Strict validation does not check required anchors [SOURCE: .skilled/skills/system-spec-kit/benchmark/reports/2026-10-25--model-eval--authoring-baseline/README.md:18]. Three of four final sets failed on missing anchors, but the first two lost only optional Level 3 sections (0 required anchors missed in the diagnostic) [SOURCE: .skilled/skills/system-spec-kit/benchmark/reports/2026-10-25--model-eval--authoring-baseline/README.md:188]; only the fresh set's run 1 deleted a required section. Phase 010 ADR-001 adds the v2.3 required-anchor check [SOURCE: specs/system-speckit/054-weak-model-spec-authoring/010-deep-review-finding-fixes/plan.md:289].
- **Unfilled tokens (observed).** A v2.3 token is a warning while `Status: Draft` and an error otherwise, which the card states [SOURCE: .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:130]. The 97-hint figure the lineage cites describes the v2.2 scaffold before phase 003, not today's gate.
- **Fix loop (observed text).** The card says fix the first failing rule, re-run, and stop after three fixes on the same rule. No counter of real round trips exists, so the loop's cost is unmeasured.

---

## 7. DERIVED METADATA AND CONTINUITY

- Every planner mode of the continuity writer refreshes `description.json`, `graph-metadata.json` and the phase-parent pointers; only `--full-auto` writes continuity fields [SOURCE: .skilled/skills/system-spec-kit/references/memory/save-workflow.md:257]. No per-edit refresh is required. (observed)
- The card forbids the authoring worker from running `generate-context.js` or `/speckit:save` [SOURCE: .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:25], so refresh happens after the author stops. (observed)
- `GENERATED_METADATA_DRIFT` is an error under strict only when its drift-gate flag is on, and a grandfather report otherwise [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json:422]. The lineage's "a wording edit can fail strict on metadata alone" holds only with that flag set. (observed, corrects the lineage)
- `CONTINUITY_FRESHNESS` is strict-only and inert unless `SPECKIT_COMPLETION_FRESHNESS=true`, and the reference says so [SOURCE: .skilled/skills/system-spec-kit/references/validation/validation-rules.md:150]. (observed)
- The graph's `derived` block holds 16 fields in this packet, four of them clock stamps (`created_at`, `last_save_at`, `last_accessed_at`, `last_active_at`), plus `lastUpdated` in `description.json`. That every save rewrites them is inferred from the field names and was not run. (mixed)
- `create.sh` appends each new packet to the track root's `children_ids` (20 entries, 2,890 bytes for `system-speckit`), so parallel packet creation converges on one file. (observed)

---

## 8. PLANNING CEREMONY SMALL WORK DOES NOT NEED

Each item below is confirmed in the files. Whether removing it saves time is unmeasured.

- **Three reasoning sections in a Level 1 plan.** The Level 1 example `plan.md` carries quality gates, architecture and a rollback plan [SOURCE: .skilled/skills/system-spec-kit/templates/examples/level-1/plan.md:43]. These headers carry no `L2:` prefix, so under phase 010's ADR-001 they become required anchors for v2.3 Level 1 docs. Any later trim has to change the template's required set, which is a verdict-affecting change.
- **One proof authored up to four times.** A plan step carries an acceptance and a verify line (card section 6), every task carries a `Verify:` clause (card section 7), a Level 2+ criterion carries a Verification cell that `AC_COVERAGE` traces into `tasks.md`, and `implementation-summary.md` carries a verification table.
- **Four documents as the floor.** `recommend-level.sh` can print Level 0, `create.sh` accepts only 1, 2, 3, 3+, phase-parent, review and research, and the card maps Level 0 to `--level 1`.
- **Four level-choice references in the planning bundle** for a decision the helper makes in one call (section 5).
- **A plan-step tripwire with three answers** (Key Finding 5).

---

## 9. CLAIM LEDGER

The lineage's 45 findings make overlapping claims (iteration 5 restates iterations 1 to 4 as a ranking). Four distinct claims were dropped, seven were kept with a correction, and every other cited claim was confirmed as stated, within rounding.

**Dropped (not used in any ranking)**

| Claim | Iteration | Why dropped |
|---|---|---|
| Two fill-note sentences cut mean wall clock from 252.3 s to 193.7 s, 23% | 2 (finding 7), 5 (finding 3) | Refuted by the same report: the set before the note fix already averaged 194.7 s; 252.3 s is the pre-054 tree |
| Acceptance tables have 13 rows in the Level 2 and Level 3 examples | 3 (finding 4), 5 (finding 9) | Wrong count: 7 criterion rows, one per requirement, in each |
| Phase 011's `spec.md` still holds `[YOUR_VALUE_HERE:` at lines 3 and 24 | 1 (finding 8) | Not reproducible: the file holds no token now, and its earlier state was never recorded |
| The `Verify:` clause is the most expensive element per task | 3 (finding 3) | No measurement supports a cost ranking of task elements |

**Kept with a correction**

| Claim | Correction |
|---|---|
| Strict validation costs about 108 ms | The reference says so for packet 004's harness; measured here: 1.29 s, and 15.5 to 32.7 s on a packet with `research/` |
| A Level 1 author reads a 26 KB guidance stack | The card does not send authors to those docs; the skill's `PLAN` route sends them to 117 KB |
| Strict fails a wording edit on metadata drift | Only when the drift-gate flag is on |
| Three of four rounds failed on anchors strict passed | True, but two of the three lost only optional anchors; a required-anchor gate catches one |
| 17 derived graph fields | 16 in this packet |
| Level 3 example has 42 tasks | 48 task lines at HEAD |
| Level gating removes about 46% of the spec at Level 1 | 73% of the raw template's bytes |

Every other cited line was opened and says what the finding says: template byte counts, fill-note shares (within 0.2 points), the twin fill notes in `spec.md.tmpl`, the 1090 vs 1075 LOC figures, the 41-rule breakdown, the self-contradicting task format in `tasks.md.tmpl`, zero `Verify:` lines in the HEAD examples, the recommender weights and thresholds, `create.sh` level values, the small-task definition, the save-workflow refresh rule, the card's forbidden list, `CONTINUITY_FRESHNESS` inertness and the track-root append.

---

## 10. INTERACTION WITH PHASE 010

Phase 010's three lanes are editing the card, the core templates, the four example `tasks.md` files, `template-mapping.md`, the speckit plan and implement assets, the `markdown` agent, both guards, `create.sh`, the placeholder scanners, `orchestrator.ts`, `status-classifier.sh`, `packet-synopsis.ts`, the golden snapshot and five reference docs.

- **Already covered by 010.** The required-anchor check (ADR-001), and `Verify:` lines in the four examples (17, 28, 49 and 51 `Verify:` lines in the working tree, 0 at HEAD).
- **Bound by 010's ADR-006.** The card may grow at most 80 words and each core template 60 in phase 010, and template trimming is explicitly left to a separately measured change [SOURCE: specs/system-speckit/054-weak-model-spec-authoring/010-deep-review-finding-fixes/plan.md:365]. That is why every reading-volume cut below is deferred.
- **Sequenced after 010.** Recommendations 2 and 3 touch the card, `tasks.md.tmpl` and the golden snapshot, so they start only after phase 010's lane B commit.

---

<!-- ANCHOR:recommendations -->
## 11. RECOMMENDATIONS

Ranked by time saved per unit of quality risk. "Observed" means a command or recorded run produced the number; "inferred" means it follows from volume or text, not from timing.

| Rank | Change | Files touched | Time saved (estimate, basis) | Quality risk | Effort | Action |
|---|---|---|---|---|---|---|
| 1 | Run the citation scanner's two `git ls-files` calls with `-c core.fsmonitor=false` | `system-spec-kit/runtime/cli/rules/check-source-tags-helper.mjs` (`untrackedFiles`), `sk-doc/shared/scripts/cite-drift-scan.mjs` (`listTrackedFiles`). Not phase 010 files | 6 to 9 s per strict run of any packet with `research/` or `review/`, more on a recursive parent run. Observed: helper 6.93 and 9.85 s on, 0.90 and 0.88 s off, identical output | None: the same file lists, the same verdicts | 20 min | **build now**, lane 1 |
| 2 | Make the card's over-four-steps rule give one answer: replace "Split it or raise the level." in section 6 with a pointer to section 11 | `references/workflows/spec-authoring-card.md` (phase 010 file) | Unmeasured, small. Inferred: removes a three-way fork at plan time. Basis: the only diagnosed authoring failure in the benchmark was a note read as permission | Low. Net word count falls; the stop-and-ask rule already exists | 5 min | **build now**, lane 2, after phase 010's lane B commit |
| 3 | Add `Verify: <command> prints <expected output>` to the tasks template's frontmatter `description` (line 15) so it matches line 53 and card section 7 | `templates/core/tasks.md.tmpl`, `runtime/cli/tests/snapshots/scaffold-golden-snapshots.vitest.ts.snap` (both phase 010 files) | Unmeasured, small. Removes a format statement without `Verify:` that every new `tasks.md` inherits (this packet's `tasks.md` carries it) | Low. No runtime code reads the text (`rg 'Task Format'` over the runtime finds none); existing packets keep their own description | 10 min | **build now**, lane 2, after phase 010's lane B commit |
| 4 | Cut the `PLAN` intent bundle to the card plus the documents a plan needs beyond level choice | `SKILL.md` `RESOURCE_MAP["PLAN"]` | Largest read-volume cut found: up to 8,687 of 15,293 words. Time inferred, not measured | Medium. Changes what every skill-routed planner reads, and stronger models may use the matrices for edge cases | 15 min to edit, a benchmark arm to judge | **defer**: needs a plan-routed arm in the 2026-10-26 benchmark |
| 5 | Required-anchor check in strict validation for v2.3 docs | `runtime/lib/validation/orchestrator.ts`, `validator-registry.json` | One re-run round each time a model deletes a required section; observed once in four benchmark sets | Low, bound to v2.3 docs | Owned by 010 | **defer**: phase 010 lane A builds it (ADR-001); measure its effect in the benchmark |
| 6 | Shorten fill notes to one imperative and one GOOD example | `templates/core/{spec,plan,tasks,implementation-summary}.md.tmpl` | Up to a third of composed template text (33.3 to 41.5% at Level 1, observed); time inferred. The lineage's 23% precedent was refuted | Medium. The GOOD and WEAK contrast is 054's leftover-hint protection; all DeepSeek runs left 0 or 1 hints | 1 h plus snapshot | **defer**: needs the benchmark; ADR-006 keeps template trims out of phase 010 |
| 7 | Give the card a Level 1 short path | `spec-authoring-card.md`, `check-card-sync.sh` | Inferred from section count only | Low to medium. The card is the surface the passing runs used | 30 min | **defer**: needs the benchmark, and the card is mid-edit in phase 010 |
| 8 | Author each proof once: let a task's `Verify:` stand as the proof that plan steps, criteria and the summary point to | Core templates, `acceptance-criteria.md.tmpl`, card sections 6 and 7 | Inferred, up to three duplicate proof statements per item | Medium. Changes the `AC_COVERAGE` trace contract | Half a day | **defer**: needs the benchmark, touches gate contracts (D2) |
| 9 | Delete the document-size LOC figures (`~455`, `~875`, `~1090`, `~1075`) that rank Level 3+ below Level 3 | `references/templates/level-specifications.md` lines 55 to 61 and 823. Not a phase 010 file | None measurable. Clarity fix in a document the `PLAN` bundle loads; the composed Level 1 core renders 427 lines, not 455 | None. No validator or other doc reads them | 5 min | **build now**, lane 3 |
| 10 | One-document quick packet below 25 points | `create.sh`, `templates/spec-kit-docs.json`, `folder-structure.md`, `level-specifications.md` | Inferred, about three quarters of Level 1 write volume | High. Removes three protection surfaces | Days | **defer**: changes the level contract and a phase 010 file; needs the benchmark |
| 11 | Stop rewriting clock stamps in derived metadata on every save | `runtime/cli/spec-folder/generate-description.ts`, the graph-metadata writer | Reviewer and merge time only, inferred | Low to medium; consumers of the stamps are not yet listed | Half a day | **defer**: needs a consumer audit, and the writer change touches every packet on its next save |
| 12 | Enforce or retire `CONTINUITY_FRESHNESS` | `validator-registry.json`, `validation-rules.md` | None measurable; the reference already calls it inert | Enforcing changes existing verdicts | Small | **defer**: enforcement breaks D2, and retirement buys nothing the docs do not already say |
<!-- /ANCHOR:recommendations -->

---

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| Credit the 252.3 s to 193.7 s drop to the fill-note fix and rank note rewrites on it | The set before the note fix already averaged 194.7 s; the baseline is the pre-054 tree | Benchmark README lines 64, 90 and 118 | 2, 5 (refuted in synthesis) |
| Thin the validator rule set to save time | Every rule but one ran in 0.16 to 0.23 s; the slow one is slow because of git, not its logic | `SPECKIT_RULES` bisection, section 6 | 2, 5 |
| Have authors run `repair-derived.cjs` after each edit | The continuity save already refreshes the same files; the repair CLI exists for structural moves | `save-workflow.md:257`, `repair-derived.cjs:16` | 4, 5 |
| Price the continuity fingerprint as current overhead | Opt-in and inert by default | `validation-rules.md:150` | 4 |
| Use the published LOC figures as a time model | Soft, inconsistent at Level 3 and 3+, read by no validator | `level-specifications.md:55` | 1 |
| Count raw template bytes as read cost | Gating removes 73% of the raw spec template at Level 1 | Section 5 render | 1 (figure corrected) |
| Treat a strict pass as proof of packet quality | Draft tokens are warnings and required anchors are unchecked until phase 010 lands | Section 6 | 2 |
| Rank the one-document quick packet first on raw saving | It is the only change that removes protection surfaces | Section 8 | 5 |
| Rewrite the validator rule set because 16 rules police derived files | Each has a writer; cost is round trips and one slow git call | Sections 6 and 7 | 5 |
| Look for a per-level authoring time measurement | None exists; only the Level 3 brief was ever timed | Benchmark README section 3 | 1, 5 |
| Look for a Level 0 path in `create.sh` | Not a dead end: the card maps Level 0 to `--level 1` | Card line 38 | 3 |
| Bypass the monitor with a `GIT_CONFIG_COUNT` wrapper in the rule script | Fixing each spawn follows phase 010's `corpus.mjs` precedent and leaves a caller's own git config alone | `corpus.mjs:205` | synthesis |

---

## Divergence Map

- **Saturated directions:** none recorded. The registry holds no `divergence` block, and the lineage took one focus per iteration.
- **Pivots taken:** none (0 completed, 0 failed, 0 audited overrides). No Council artifacts.
- **Evidence breadth:** one model, one lineage, repository-internal sources, one recorded benchmark series on one Level 3 brief. The synthesis added timings taken on one machine while phase 010 lanes ran.
- **Remaining frontier:** (a) a timed Level 1 and Level 2 brief, pre-054 and post-054 trees, same load; (b) a plan-routed arm that loads the `PLAN` bundle against one that loads only the card; (c) a fill-note arm that drops the WEAK half and counts leftover hints; (d) a counter of validator round trips per packet in real use.

This map documents breadth. The lineage stopped at its iteration cap, not because the topic converged.

---

## 12. OPEN QUESTIONS

1. What is the authoring wall clock for a Level 1 packet, pre-054 and post-054, under equal load? Recommendations 4, 6 and 7 depend on it.
2. Does a planner that reads only the card choose the same level and write the same plan as one that reads the full `PLAN` bundle?
3. Does dropping the WEAK example from each fill note raise leftover-hint counts?
4. How many validator round trips does a real packet take, and how many are spent on rules a fresh scaffold fails by construction?
5. Which consumers read `last_accessed_at` and `last_active_at`?
6. Why does the citation helper run for minutes on the packet 054 parent? The suspect is the 136-second rename listing in `cite-drift-scan.mjs`; a per-call timing on that folder would confirm or clear it.
7. Is the file-system monitor slowdown specific to this worktree's load, or present on a quiet main checkout? The fix is safe either way; only the size of the saving depends on it.

---

## 13. REFERENCES

- Lineage: `research/lineages/pi-deepseek/research.md`, `iterations/iteration-001.md` to `iteration-005.md`, `deep-research-strategy.md`, `deep-research-state.jsonl`
- Registries: `research/findings-registry.json`, `research/deep-research-findings-registry.json`
- Resource map: `specs/system-speckit/054-weak-model-spec-authoring/011-authoring-speed-research/research/resource-map.md`
- `.skilled/skills/system-spec-kit/templates/core/*.tmpl`, `templates/examples/level-1` to `level-3+`, `templates/addons/acceptance-criteria.md.tmpl`
- `.skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md`, `quick-reference.md`
- `.skilled/skills/system-spec-kit/references/templates/level-specifications.md`, `level-selection-guide.md`
- `.skilled/skills/system-spec-kit/references/validation/validation-rules.md`, `references/memory/save-workflow.md`, `references/structure/phase-definitions.md`
- `.skilled/skills/system-spec-kit/SKILL.md` (`RESOURCE_MAP`)
- `.skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json`, `runtime/cli/rules/check-source-tags-helper.mjs`, `runtime/cli/spec/recommend-level.sh`, `create.sh`, `repair-derived.cjs`, `runtime/cli/retrieval/lib/corpus.mjs`
- `.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs`
- `.skilled/skills/system-spec-kit/benchmark/reports/2026-10-25--model-eval--authoring-baseline/README.md`
- `specs/system-speckit/054-weak-model-spec-authoring/003-versioned-placeholder-gate/spec.md`, `009-authoring-benchmark-and-closeout/implementation-summary.md`, `010-deep-review-finding-fixes/plan.md`
- Build-now plan: `research/phase-012-proposal.md`

---

## Convergence Report

- Stop reason: maxIterationsReached
- Total iterations: 5
- Questions answered: 6 / 6
- Remaining questions: 0 in the lineage strategy (section 12 lists the questions this synthesis opened)
- Last 3 iteration summaries: run 3: Verify clauses, acceptance criteria and protection surfaces (0.72); run 4: derived metadata and continuity (0.78); run 5: ranked list and ceremony (0.55)
- newInfoRatio trend: 0.95, 0.82, 0.72, 0.78, 0.55
- Convergence threshold: 0.05 (telemetry only under the max-iterations stop policy; the last ratio stayed far above it)
- Divergence summary: no divergent pivots recorded
- Segment transitions, wave scores, and checkpoint metrics are experimental and omitted from the live report.
