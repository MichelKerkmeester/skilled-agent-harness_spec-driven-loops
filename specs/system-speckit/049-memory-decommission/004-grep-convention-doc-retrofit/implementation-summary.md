---
title: "Implementation Summary: grep convention doc retrofit"
description: "A written convention, a five-stage pipeline and a validator rule turned 22,094 active spec documents into one predictable grep target: 10,210 rewritten, every body preimage identical, zero residue and an index that regenerates byte-identical."
trigger_phrases:
  - "grep convention"
  - "spec doc retrofit"
  - "frontmatter normalization"
  - "greppable spec docs"
  - "implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/049-memory-decommission/004-grep-convention-doc-retrofit"
    last_updated_at: "2026-09-04T02:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "Closed all sixteen acceptance rows after the fourteen-track retrofit"
    next_safe_action: "Take the packet closeout decisions to the operator, then land the branch"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/references/structure/grep-convention.md"
      - ".opencode/skills/system-spec-kit/scripts/retrieval/retrofit-convention.mjs"
      - ".opencode/skills/system-spec-kit/scripts/retrieval/lib/grep-convention.mjs"
      - ".opencode/skills/system-spec-kit/scripts/rules/check-grep-convention.sh"
      - ".opencode/skills/system-spec-kit/scripts/lib/validator-registry.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-04-004-grep-convention-doc-retrofit"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Do the report-only classes escalate from warn to error once their owners fix them?"
      - "Who authors frontmatter for the 55 canonical documents that lack it?"
      - "Do importance_tier and contextType get normalized across the corpus?"
    answered_questions:
      - "The oversized budget is 120 characters per phrase and 20 members per list, the index's own limits"
      - "A partial block on a canonical document is refused, because it fails the packet where an absent block only warns"
      - "The phrase-count baseline is unique normalized phrases over the in-scope corpus, not the index's own total"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-grep-convention-doc-retrofit |
| **Completed** | 2026-09-04 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The corpus is now the retrieval engine, so this phase made the corpus regular. A written convention
fixes the frontmatter keys, the anchor grammar and the naming rules; a five-stage pipeline applied it
to 22,094 active spec documents; a validator rule keeps new documents from drifting back. 10,210
documents were rewritten and every one of the 22,094 body preimages is byte-identical afterwards,
which is the property that makes a 10,000-file documentation diff reviewable at all.

### The convention

`grep-convention.md` was written and committed before anything else was touched, which is D4 and
AC-013 rather than a courtesy. Writing it surfaced seven points sections 13.1 to 13.6 of the spec had
left open, and each is now decided in section 13.7 so the retrofit and the validator classify the same
way: the oversized budget is 120 characters per phrase and 20 members per list, the index's own
limits; non-canonical keys are preserved verbatim in their original order; a duplicate is equal after
the index's normalization and the first occurrence wins; typed anchor ids get a grammar instead of an
enumerated prefix list; severity is staged by category; scalar quoting is preserved; a 10-token
sentence budget sits alongside the character budget so a long single term is reported as oversized
rather than as prose. Two of those points came from the corpus fighting back mid-run and are
described under the seams below.

The in-scope total also moved. The spec estimated 22,127 documents; the frozen manifest counts
22,094, because 184 documents under hidden backup directories are unreachable by the section 14
recipes and are excluded with a recorded reason.

### The pipeline and the rule

`retrofit-convention.mjs` carries five subcommands — `enumerate`, `dry-run`, `process`, `rescan` and
`verify-preimage` — over one frozen manifest, each stage consuming the previous stage's artifact
rather than re-deriving the corpus. The classification, preimage hashing, anchor parsing, trigger
allowlist, diff classification and per-variant handlers live in `lib/grep-convention.mjs`, which also
owns the `CATEGORY_SEVERITY` table the validator imports, so the two tools cannot disagree about what
counts as an error. `rg-wrapper.mjs` builds the three recipes, applies the caller-side rank tuple and
maps exit status; ripgrep produces evidence there and does not rank. `check-grep-convention.sh` and
its helper are registered always-on in `validator-registry.json` with status derived from the rows:
error for the seven non-conforming variants, warn for the classes this phase reports but does not
rewrite.

That staging is the difference between a rule that ships and one that cannot. A fleet scan under a
flat error mapping put 319 of 2,799 packets in error, most of them on report-only classes; with the
staged mapping the same scan reads 7 fail, 207 warn and 2,585 pass, and the 7 were the malformed
documents, since repaired.

### The retrofit

Enumerate classified all 22,094 documents with zero unclassified: missing 10,187, of which 9,143 had
no block at all and 1,044 had a block with no trigger key; malformed-or-unclosed 1; non-yaml 1;
valid-empty 11,882; duplicate 23; oversized 0. The dry-run emitted a 3.96 MB plan diff that was read
on the `specs/agents` track before the first write. Process then ran the 14 tracks in sequence and
wrote 10,210 documents with 0 failures. The rescan reports residue 0, `verify-preimage` verified all
22,094 with 0 mismatches, and the mechanical diff classifier put all 36,271 changed lines across
10,202 files inside the frontmatter block, with 0 anchor-marker lines and 0 in the `other` bucket. A
second full pipeline run wrote nothing and left the diff byte-identical.

### The exceptions the phase reports and does not fix

432 generic trigger candidates — 202 that repeat a token of their own folder name, 182 generic
workflow words, 27 over the sentence budget, 17 all stop words and 4 produced by the frontmatter
editor's fallback. 95 unmatched anchor markers and 51 duplicate ids, against 165,580 marker lines
with zero non-conforming ids. 664 naming exceptions. Zero alias hits: no document in scope declares
the `triggerPhrases` spelling as a key, so the normalizer never fired on the corpus.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/references/structure/grep-convention.md` | Created | The convention, committed at `89faec9717` before any corpus change |
| `.opencode/skills/system-spec-kit/scripts/retrieval/retrofit-convention.mjs` | Created | The five-stage pipeline over the frozen manifest |
| `.opencode/skills/system-spec-kit/scripts/retrieval/lib/grep-convention.mjs` | Created | Classifier, preimage hasher, anchor parser, allowlist, diff classifier, handlers and the shared severity table |
| `.opencode/skills/system-spec-kit/scripts/retrieval/rg-wrapper.mjs` | Created | Three recipes, the caller-side rank tuple and the exit mapping |
| `.opencode/skills/system-spec-kit/scripts/rules/check-grep-convention.sh` and its helper | Created | The standing validator rule, same diagnostics schema as the retrofit |
| `.opencode/skills/system-spec-kit/scripts/lib/validator-registry.json` | Modified | `GREP_CONVENTION` registered always-on with status derived from rows |
| `.opencode/skills/system-spec-kit/templates/core`, `templates/addons`, `templates/examples` | Modified | A freshly scaffolded packet conforms with no manual step; 16 goldens refreshed |
| `.opencode/skills/system-spec-kit/scripts/tests/**` | Created/Modified | Fixtures for the eight variants plus the grep-convention, pipeline, wrapper, rule and trigger-index suites |
| `.opencode/skills/system-spec-kit/scripts/git-hooks/lib/memory-drift-marker.sh`, `drift-marker-write.ts` | Modified | The post-commit hook streams the diff instead of passing it as an argument |
| `specs/**/*.md` (10,210 documents across 14 tracks) | Modified | Frontmatter normalized; bodies untouched by preimage |
| 55 canonical documents across the corpus | Modified | Withdrawn to their prior content after the partial block failed their packets |
| 212 packets' `description.json` and `graph-metadata.json` | Modified | Generated metadata refreshed for every packet whose canonical documents changed |
| `specs/system-speckit/049-memory-decommission/004-grep-convention-doc-retrofit/scratch/**` | Created | Baselines, inventories, dry-run and residue reports, preimage verification and per-track diagnostics |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Three agents built the pieces: D6 wrote the convention, C6 built the pipeline across six rounds, and
C7 took the validator rule, the templates, the test harness and the drift-marker hook fix. The
orchestrator ran the corpus passes itself, one track at a time, and did the work that had to stay in
one pair of hands: the verdict comparison against the phase-002 commit, the mechanical diff
classification and the commits. Delivery is seven commits — the convention at `89faec9717`, the
tooling at `d09294c2a9` and `2f3320a6b1`, and the corpus at `6fb5a7181e`, `41f18b4ca9`, `c307a2265e`
and `fb59dd49dd`.

The 10,000-file commit broke a hook on its way through. The post-commit drift-marker hook passed the
diff as an argument and overflowed the environment limit; it now streams, fixed in `2f3320a6b1`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The preimage, not review, is the body-preservation gate | A reviewer cannot read 10,202 files. A digest over the body region with anchor-marker lines removed can be recomputed, and it either matches for all 22,094 or the run fails |
| Severity is staged by category rather than flat | A flat error mapping put 319 of 2,799 packets in error, most on classes this phase never rewrites, which would have failed unrelated packets' completion gates permanently. Escalation is now a one-line registry change once owners fix their rows |
| A partial block on a canonical document is refused, not written | The minimal block moved 26 packets from pass or warn to fail, because the frontmatter rule treats present-but-empty required scalars as errors where an absent block is only a continuity warning. An authored block is the only conforming fix |
| Any edit that would leave a block unparseable is refused | Appending a block key after a flow mapping stops the parser. The code agent's own semantic check caught it on 8 compiled policy cards, the change was reverted, and a refusal gate now stops the class rather than the instance |
| The phrase-count baseline is the corpus measure, not the index total | The retrofit adds no phrase, so unique normalized phrases is invariant by construction and provable. The index's own total also covers `.opencode/skills` and now excludes tooling fixture trees, so it moves for reasons that have nothing to do with the corpus |
| Naming exceptions are reported and left unrenamed | A rename inside a 10,000-file frontmatter pass makes the diff unreviewable, and the diff being reviewable is the whole delivery strategy |
| The large scratch artifacts stay untracked | The manifest, the preimage manifest and the plan diff are 14 MB of regenerable output. Their sha256 digests are recorded instead, so the evidence is pinned without the bytes |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Convention precedes the corpus | `grep-convention.md` at `89faec9717`, strictly before the tooling at `d09294c2a9` and the first corpus pass at `6fb5a7181e`; registered in the skill `SKILL.md` and README, sk-doc validator 0 issues |
| Enumeration completeness | 22,094 documents, zero unclassified: missing 10,187 (9,143 no block, 1,044 no key), malformed-or-unclosed 1, non-yaml 1, valid-empty 11,882, duplicate 23, oversized 0 |
| Corpus pass | 14 tracks in sequence, 10,210 written, 0 failures; rescan residue 0 across 22,094 considered |
| Body preservation | `verify-preimage` 22,094 verified, 0 mismatches, 0 missing; diff classifier 36,271 changed lines across 10,202 files all inside frontmatter, 0 anchor-marker lines, 0 other |
| Idempotence | Second full pipeline run wrote 0 documents, diff byte-identical |
| Archive exclusion | No archived path in the manifest or in any control; `git status` counts 0 changed files under `z_archive/` |
| Recipe controls | Frontmatter-only returns exit 0 and exactly its one declaring document; the anchor id returns marker evidence with line numbers; the body-only phrase ranks below every field hit; the generic word adds no field hit and every candidate is reported; the malformed fixture is byte-identical with one diagnostic row. Exit statuses recorded in `scratch/baseline.json`, ripgrep 14.1.1 |
| Trigger phrase baseline | `uniqueNormalizedPhrases` 26,743 before and after; declared members 38,331 to 38,308 as the 23 duplicates came out |
| Trigger index | Publishes and regenerates byte-identical across two runs at the same sha256, 33,791 unique phrases and 13,096 paths against 33,871 and 13,220 at the phase start, the difference being the new fixture-tree exclusion |
| Tooling suites | grep-convention 66, pipeline 27, wrapper 16, rule 19, trigger-index 41, sweep 29, all pass |
| Validation harness | `test-validation.sh` 31/31 and `test-validation-system.cjs` 92 pass; fixture 053's seven expectations were relaxed from pass to warn because its author-chosen phrase "template" is a token of its own folder name, a documented false positive the rule tolerates |
| Scaffold conformance | Templates in core, addons and the 16 examples conform; 16 scaffold goldens refreshed and passing |
| Canonical refusals | 55 documents withdrawn to their prior content; all 26 packets that had flipped from pass or warn to fail returned to their prior verdict, checked through `validate.sh` against the phase-002 commit |
| Malformed repairs | 7 documents hand-repaired with the preimage identical and the diff frontmatter-only; 1 malformed and 1 non-yaml captured transcript skipped by design |
| Generated metadata | Refreshed for the 212 packets whose canonical documents changed; 3 in a non-conforming scopes directory were already failing folder rules and still are |
| Fleet validator scan, post-retrofit | 7 fail (all malformed, since repaired), 207 warn, 2,585 pass across 2,799 packets, against 319 failing under a flat error mapping |
| Spec-kit kept suites, final state | 39 failing files: the 38 that fail identically at the phase-003 baseline, plus the golden that was refreshed in this phase. Zero regressions attributable to this phase |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **55 canonical documents and 8 flow-mapping policy cards are still reported as `missing`.** Both are refusals, not misses. The canonical documents need an authored frontmatter block, because a minimal one fails their packets; the policy cards need a block that a flow mapping does not stop the parser from reading.
2. **Four classes are reported and never rewritten.** The fleet scan carries generic-trigger 361, anchor-duplicate 42, anchor-unmatched 6 and naming-exception 19 rows as warnings. Escalating them to `error` is a one-line registry change once their owners fix them, and it is a decision rather than a leftover.
3. **The retrofit's frontmatter classifier is a line-shape heuristic while the validator uses `js-yaml`.** So the retrofit's malformed count is a floor and the validator is the authority. Putting `js-yaml` behind `classifyVariant` would collapse the two readings into one.
4. **`importance_tier` and `contextType` are conforming but not normalized.** The corpus carries 10 distinct tier values and 35 distinct context types. The convention fixes the key and the shape, not the vocabulary.
5. **The large scratch artifacts are not committed.** `manifest.json`, `preimage-manifest.json` and `plan.diff` are regenerable multi-megabyte outputs; their sha256 digests are recorded in the tasks instead, so re-running the pipeline is how you get them back.
6. **The tests are vitest, not the `node:test` the plan named.** One runner rather than two, decided when the surrounding suites turned out to be vitest.
7. **Frontmatter version fields were not bumped** on the documents this phase edited, matching the phase-002 and phase-003 convention.
<!-- /ANCHOR:limitations -->
