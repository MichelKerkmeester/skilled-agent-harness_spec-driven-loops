# W3b brief: adversarial accuracy read of the authored merge documents

Ten packets were merged into `specs/system-deep-loop/036-deep-loop-innovation/` as phase children of
five group parents. Four root documents and five parent maps were authored for that merge. Your job is
to attack them: find any claim that is wrong, overstated, unsupported by the packet's own documents,
or that contradicts another document. You are read-only: `read`, `grep`, `find`, `ls` only — no
writes, no shell.

## Documents under review

- `specs/system-deep-loop/036-deep-loop-innovation/spec.md` — frontmatter description, the PHASE MAP &
  OUTCOMES intro, the merged-children block near the end of that section, and the PHASE DOCUMENTATION
  MAP intro.
- `specs/system-deep-loop/036-deep-loop-innovation/timeline.md` — metadata header, the table intro,
  rows 64-73, the ten-packet narrative section, and the MILESTONES entry.
- `specs/system-deep-loop/036-deep-loop-innovation/changelog.md` — the `## 2026-09-20` entry, the
  first bullet of `## What's New at a Glance`, and the `## Included Phases` counts.
- `specs/system-deep-loop/036-deep-loop-innovation/before-and-after.md` — the intro sentence of
  `## What happened after the switch-over`, the `041`-to-`050` bullet, and the closing
  `**Why it matters.**` sentence.
- The five parent maps:
  `007-executor-and-cli-hardening/spec.md`, `006-runtime-docs-and-integrity-hardening/spec.md`,
  `008-review-and-rollback-followup/spec.md`, `003-mode-contracts-migration-and-cutover/spec.md`,
  `002-substrate-and-orchestration/spec.md`.

## Ground truth you must hold the documents to

- Destination map: 041→`007/008`, 042→`006/012`, 043→`008/005`, 044→`007/009`, 045→`007/010`,
  046→`003/005`, 047→`003/006`, 048→`002/008`, 049→`006/013`, 050→`002/009` (all under
  `036-deep-loop-innovation/`).
- Merge date 2026-09-20; the three earlier merged children (026-028) arrived 2026-09-05.
- 036 keeps exactly 28 direct children. 045 brought 20 children; 049 brought 17.
- Timeline rows: 64=041, 65=042, 66=043, 67=044, 68=045, 69=046, 70=047, 71=048, 72=049, 73=050;
  statuses: all `complete` except 046 which is `draft`.

## Specific claims to falsify (each needs a verdict with evidence)

1. Every factual sentence about a packet in the new changelog entry, the ten-packet timeline narrative,
   and the `before-and-after` bullet — verify against that packet's own `spec.md` /
   `implementation-summary.md` / `acceptance-criteria.md`. Flag anything the packet does not support.
2. Numeric claims: "1,858 tracked paths" (045), "132 of 132" (043), "53 errors to zero" (042),
   "196 tracked files deleted and 57 edited" and "554 historical benchmark reports" and "five workflow
   modes instead of six" (047), "twenty angle-driven iterations across four lanes", "seventeen phases",
   "six completion criteria" (049), "23 committed research ledgers and 175 events" (050), "20 children"
   (045), "17 children" (049). Confirm or refute each against the packet documents.
3. Status claims: the documents must not call `046` anything but draft; `041` and `049` must be
   described in a way consistent with their own declared status while their derived or open items are
   acknowledged, not hidden.
4. Adjacency claims in the five parent maps: predecessor/successor chains must be internally
   consistent (each new row's predecessor is the preceding row and its successor the next row; the
   last new row ends with `none`; the previously-last existing row now points at the first new row).
5. Cross-document consistency: the same packet must be described consistently in `spec.md`, `timeline.md`,
   `changelog.md` and `before-and-after.md` (names, numbers, statuses, destinations). Report any
   contradiction, and any packet that is missing from a document that should mention it.
6. Coverage: all ten packets must appear in the changelog entry and the timeline narrative, and all ten
   must be listed in the merged-children block of `spec.md`; the five parent maps must each show their
   new rows. Report any omission.

## Boundaries

- Read-only. Attack the documents, not the packets: a claim the packet docs do not support is a finding
  even if you believe it is probably true.
- Where a claim is unverifiable from the available documents, say UNVERIFIABLE and name what would settle it.
- Rank findings P0 (false claim), P1 (unsupported or contradictory), P2 (imprecise or stale wording).
- Close with `W3B REVIEW COMPLETE` and nothing after it.
