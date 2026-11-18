# Fix plan

Target: HEAD; head: 1e350ae863f1d4fe433e4b708ab58a3eabb6ac46

## In scope

### skill:.skilled/skills/system-deep-loop

- [x] B-S3-01 P2 .skilled/skills/system-deep-loop/runtime/feature-catalog/coverage-graph/source-quality-class.md:24 Case: a research SOURCE node arrives with an unclassified path, an unclassified name, and a label that names a document (for example path 'working notes', name 'note', label 'docs/loop.md'). The entry [handed off]
  fix: derives the class from the source `path`, then `name`, then `id` -> derives the class from the source `path`, then `name`, then `label`, then `id`
- [x] A-1 P1 .skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs:391 Case: a review run reuses a finding id for a different finding in a later iteration (the code treats ids as unique only per source, so deriveReviewFindingEvidence places the later one at finding:<id># [handed off]
- [x] D-01 P1 .skilled/skills/system-deep-loop/hub-router.json:33 The hub's routing vocabulary names none of the new features. `hub-router.json`'s `research-aliases` and `review-aliases`, `graph-metadata.json`'s `intent_signals` (line 42) and `description.json`'s `k [handed off]
- [ ] A-3 P2 .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:234 Case: deep-research-config.json exists but is truncated or hand-edited into invalid JSON. readTargetConfig catches every error and returns null, so readCaps (239-259) treats the run as having no confi
- [x] A-4 P2 .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:195 Case: a question begins with an ordinary 1-2 letter word, a number and a colon ('We 2: how does the loop stop'). The id-prefix strip ^[a-z]{1,2}[-\s]?\d+... removes it, so dedupeKey collapses that que [handed off]
- [ ] A-5 P2 .skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs:377 Case: a caller passes --state-log/--delta-dir to a non-review loop, --iteration with neither source, --iteration 0, a flag without a value, or an unreadable state log. The five new inputError branches
- [x] B-S4-03 P2 .skilled/skills/system-deep-loop/runtime/manual-testing-playbook/coverage-graph/source-quality-class-derivation.md:61 Case: the label-only node from B-S3-01 (path and name unclassified, label naming a document) is graded with this scenario. The Fail list makes 'A label or leaf value decides the class' a FAIL, but the [handed off]

### skill:.skilled/skills/system-deep-loop/deep-research

- [x] B-S4-01 P1 .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/manual-testing-playbook.md:52 Case: an operator finishes any deep-research scenario and records its outcome under the instruction in section 3 GLOBAL EVIDENCE REQUIREMENTS, which asks for 'A PASS, PARTIAL, or FAIL verdict'. Sectio [handed off]
  fix: - A PASS, PARTIAL, or FAIL verdict with reasoning. -> - A PASS, FAIL, or SKIP verdict with reasoning, and SKIP only with a specific sandbox blocker.
- [x] C-03 P2 .skilled/skills/system-deep-loop/deep-research/README.md:107 The 'Packet Files' table is the README's only inventory of what a run writes, and it omits the frontier node store that `--depth-mode=expansive` creates under {spec_folder}/research/. The file name ap [handed off]
  fix: | `.deep-research-pause` | Operator | The pause sentinel checked before each dispatch | -> | `.deep-research-pause` | Operator | The pause sentinel checked before each dispatch | | `frontier-nodes.jsonl` | Front
- [x] A-2 P2 .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2684 Case: a seeded frontier node (frontier-admit always writes iteration 0) is closed by applyFrontierBudget's band sweep at iteration 9. The close exists only in the projection, so there is no resolution [handed off]
- [x] A-6 P2 .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2508 Case: the depth-band budget is implemented twice with the same shares, bandOf, allotted/carry math and status sweep: applyFrontierBudget here (2508-2538) and applyReviewFrontierBudget in runtime/scrip [handed off]
- [x] B-S4-04 P2 .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/manual-testing-playbook.md:316 Case: an operator runs DR-025 from its root summary and looks for the 'v1.1.0 agent instructions' the expected signal names. .skilled/agents/deep-research.md carries no version field at all and its St [handed off]
- [x] C-02 P2 .skilled/skills/system-deep-loop/deep-research/README.md:127 The depth-mode paragraph gives the derived budget as `min(24, max(10, 2 x (S + maxDepth - 1)))` and stops there, so a reader computing S=0 gets 10 iterations. A fan-out research lineage dealt no seed  [handed off]
- [x] D-02 P2 .skilled/skills/system-deep-loop/deep-research/SKILL.md:57 The SMART ROUTING sentence says this packet is selected when the request names 'a research state packet', but no stage carries that phrase: `graph-metadata.json` has no such `intent_signals` entry and [handed off]

### skill:.skilled/skills/system-deep-loop/deep-review

- [x] C-01 P2 .skilled/skills/system-deep-loop/deep-review/README.md:139 The 'State on Disk' table lists every file under {spec_folder}/review/ except `frontier-nodes.jsonl`, while the same section's depth-mode paragraph (line 158) tells the reader 'Node status lives in `r [handed off]
  fix: | `iterations/iteration-NNN.md` | One write-once file per iteration | -> | `iterations/iteration-NNN.md` | One write-once file per iteration | | `frontier-nodes.jsonl` | Frontier node rows, wri
- [x] B-S2-01 P2 .skilled/skills/system-deep-loop/deep-review/SKILL.md:229 Case: a review run reaches its maxDurationMinutes budget (120 by default). The section says runtime/scripts/convergence.cjs 'computes the whole stop decision once per pass' and that deep-review.yaml ' [handed off]
- [x] B-S4-02 P2 .skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/manual-testing-playbook.md:793 Case: an operator uses section 14 'FEATURE CATALOG CROSS-REFERENCE INDEX' to reach the deep-review catalog, or opens one of the 13 new review scenarios to check it against the catalog entry that cover [handed off]
- [x] C-04 P2 .skilled/skills/system-deep-loop/deep-review/README.md:158 The new depth-mode paragraph is one 367-word block whose sentences average 28 words and reach 46, against the standard's 'short paragraphs of short sentences, about 10-15 words each and about 60 words [handed off]

### unowned

- [x] BAT-01 P2 -:- S9-command-references failed (exit 1). [handed off]

## Pre-existing or outside the scope

### unowned

- [x] D-03 P2 .skilled/commands/scripts/validate-command-references.cjs:134 The S9-command-references row fails on `speckit-resume.yaml:104`, and the failing reference is correct: `.skilled/skills/system-spec-kit/runtime/database/access-telemetry.json` is gitignored runtime s (unchanged in range) [handed off]
  fix: if (/^\.skilled\/skills\/system-deep-loop\/runtime\/database\/[^/]+\.sqlite$/.test(token)) continue; -> if (/^\.skilled\/skills\/system-deep-loop\/runtime\/database\/[^/]+\.sqlite$/.test(token)) continue; // The spec-kit tel

