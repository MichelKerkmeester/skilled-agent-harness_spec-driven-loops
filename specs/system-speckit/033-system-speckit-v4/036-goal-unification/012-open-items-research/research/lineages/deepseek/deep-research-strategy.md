---
title: "Deep Research Strategy: the goal items left open (deepseek lineage)"
description: "Lineage-local strategy for the detached fan-out loop over the five open goal items: one ring per iteration, five iterations, no early convergence."
trigger_phrases:
  - "open goal items research"
  - "goal line length distribution"
  - "goal unowned surfaces"
  - "goal naming collision"
  - "goal machine checks"
importance_tier: important
contextType: research
---

# Deep Research Strategy: the goal items left open (deepseek lineage)

## Research Topic

The five items the repo-wide goal research and its remediation left open, one per iteration:
(1) line length across the goal files, measured repo-wide; (2) the unowned surfaces; (3) the root
README goal section, tested or reachable or neither; (4) the word "goal" naming four unrelated
things; (5) which facts earn a machine check and which do not.

Source of record for the ring plan: `../../deep-research-strategy.md` (the packet strategy), plus
the contradiction register and §4 of the prior synthesis
`../../../010-repo-wide-goal-research/research/research.md`.

## Known Context

- `resource_map.md not present; skipping coverage gate`.
- Prior lineage `010-repo-wide-goal-research/research/lineages/deepseek/` (session
  `fanout-deepseek-1789192823658-autusz`) closed the contradiction register C1-C15 and named the
  unowned surfaces. Its §4 is the starting inventory this lineage verifies and quantifies.
- Remediation landed in commits `dfb4aee666`, `2f91a9362b` and `fa660efc41`; the fixed items are
  no longer findings, and re-verifying them is out of scope unless a ring depends on them.
- Evidence rule for this lineage: every claim about current behaviour carries a `file:line` that
  was opened in this session. Design conclusions are marked CLAIM; anything unconfirmed is
  INFERRED or UNKNOWN with the action that would settle it.
- Write surface: this lineage directory only. The append gateway writes outside it, so state is
  recorded in-lineage in the gateway's record shape (deviation recorded in
  `deep-research-config.json`).

## Key Questions

1. What is the real line-length distribution across the repository, and does any declared or
   enforced standard make 100 characters a live limit? Enforce, exempt, or retire?
2. For each unowned surface, who owns it, should it be deleted, or should it be generated? Which
   duplications are still consistent and which have already drifted?
3. The root README goal section: contract test, retrieval lane, or deliberately outside both?
4. The word "goal" naming four unrelated things: rename, note, or nothing, and every file a
   rename touches?
5. Given rings 1-4, which facts earn a test, with what test shape, and which do not?

## Answered Questions

1. Line length: retire the 100-character prose standard. No prose rule exists; the cited limit is a
   code-style maximum, and enforcement would flag ~216,500 lines.
2. Unowned surfaces: keep the consistent duplications under named owners; repair the two drifted
   surfaces (undocumented `OPENCODE_GOAL_RUNTIME_LABEL`; the packet-resident manifest checker).
3. Root README goal section: cover by the contract test, keep out of both retrieval lanes.
4. Naming collision: rename the deep-review scope manifest and its checker; thirteen live files.
5. Machine checks: three checks plus one agreement assertion in the blocking spec-kit vitest lane;
   four facts explicitly declined.

## What Worked

- Replaying a test's own regex over a candidate file before recommending that the test cover it;
  the ring 3 path scan passed today, so the recommendation could not land a pre-existing failure.
- Prototyping each candidate check before recommending it: the env-var scan found three
  undocumented variables, and the roster scan cleared the rosters that looked broken.
- Separating live citations from historical ones before pricing a rename (73 citing files -> 13 live).
- Counting machinery per name rather than treating four names as four problems.

## What Failed

- Trying to reproduce the strategy's 365-line count from candidate four-file sets: disproved the
  number but could not recover its provenance, because the claim names no files.
- The first support-story grep matched every file mentioning Cursor and Devin; duplication counts
  without a file list are not verifiable.

## Exhausted Approaches

- Repo-wide 100-character lint; goal-docs-only line budget; exemption clause for the goal documents.
- Generating the flag rosters or the support story from one source.
- Joining the root README to a retrieval lane; adding frontmatter to the README.
- Renaming the session-goal vocabulary.
- Per-copy prose scans of the support-story restatements.
- Promoting the whole advisory node-test lane to blocking.

## Ruled-Out Directions

- Deleting the state-directory README, the manifest files, or the historical benchmark records.
- Checking the state-directory README's claims or historical citations with a test.
- Treating the ClickUp goals card as actionable: it self-declares UNSUPPORTED.

## Next Focus

Operator decision on the five recommendations. If accepted, the implementation order that shifts
least at once: (1) the ring 5 check file plus the three env-var doc lines; (2) README contract-test
coverage; (3) checker relocation and manifest rename as one change; (4) record the line-length
retirement; (5) the `RUNTIME_LABEL` doc line.
