---
title: "Stage B Enrichment Contract for 026 Changelog Backfill"
description: "The exact steps an enrichment agent follows to turn a nested-changelog --json scaffold into a publishable HVR-voice changelog, with a fabrication guard."
trigger_phrases:
  - "stage b enrichment contract"
  - "changelog enrichment steps"
  - "nested changelog contract"
importance_tier: "important"
contextType: "reference"
---

# Stage B Enrichment Contract

This is the contract every per-packet enrichment agent follows. It was derived from a live fidelity probe of `nested-changelog.js --json` across substantive, research, review, and phase-parent packets. The generator scaffold is the input. A publishable HVR-voice changelog is the output.

## Input

The agent receives: (a) the JSON scaffold from `nested-changelog.js <packet> --json`, (b) the packet `implementation-summary.md`, (c) the packet `spec.md`, (d) `git log --oneline` for files in the scaffold filesChanged or key_files, (e) a packet type tag.

## Step 1: Classify packet type

- **substantive**: filesChanged is non-empty OR key_files lists source files outside the packet folder.
- **research**: packet has a `research/` subdir OR spec.md says research-only or investigation.
- **review**: packet has a `review/` subdir OR spec.md title contains Deep Review or Audit.
- **phase-parent**: spec.md contains the CONTENT DISCIPLINE phase-parent comment OR the folder has numbered sub-phase dirs.
- **HALT**: no implementation-summary, or completion 0 to 5 percent with Planned, Pending, or Blocked status. Do not author. Report to the audit.

## Step 2: Rewrite Summary

Read implementation-summary in order: What Was Built, then description frontmatter, then spec.md Executive Summary, then Problem and Purpose. Use the first section that describes the shipped state (past-tense: now, fixed, shipped, merged). If What Was Built begins with "Status at authoring time: nothing in production yet", skip it and use the Verification table PASSED rows plus completion 100 evidence. Write 2 to 4 sentences: what was broken or missing, what was done, why it matters to operators. HVR voice. Do not use "this packet" or "this phase". Do not fabricate.

For phase-parents: enumerate child phases and their shipped status. Write "Track N covered X phases" plus one sentence per child outcome.

## Step 3: Set Added / Changed / Fixed

- **substantive**: derive bullets from What Was Built, the spec Files to Change or Scope table, and git messages. Added is net-new files, tests, columns, endpoints, fields, tools. Changed is behavior modifications, config, schema migrations. Fixed is bug corrections, crash fixes, regression removals. Each bullet is a complete phrase starting with a noun, never a task-id, CHK-id, or [P] prefix. Cap 6 per section. Empty section is "None."
- **research**: all three are "None. Research-only phase." Move investigation lines into one Verification note.
- **review**: all three are "None. Review-only phase." Move CHK and REQ lines out. List review artifacts only under Files Changed.
- **phase-parent**: all three are "None." Substance lives in child changelogs.

## Step 4: Verification

Keep concrete scaffold entries (have a PASS, FAIL, or Pending status and a test name or command). Drop generic "Tasks complete - N items" unless it is the only evidence. Research adds the synthesis path with iteration count and convergence. Review adds the review-report path with the verdict and P0/P1/P2 counts.

## Step 5: Files Changed

- **substantive**: if scaffold filesChanged is empty, extract from key_files frontmatter (files outside the packet), the spec Files to Change table, and `git diff --name-only` for the commit range. Derive Action from git first occurrence then the summary. Suppress rows for packet-internal docs (spec, plan, tasks, checklist, decision-record, implementation-summary) unless the type is research or review, where they consolidate into one "Packet docs" row. Cap 12 rows. New files get "(NEW)".
- **research**: list only research output files as Created.
- **review**: list only review output files as Created.
- **phase-parent**: list child sub-folder paths, not individual files.

## Step 6: Follow-Ups

Keep actionable, concrete, unfinished items. Drop items already completed in tasks or checklist. Drop raw task-spec stubs (P1.1, T015). Each is a complete sentence starting with an imperative verb. If none remain, write "None."

## Step 7: Frontmatter

Replace trigger_phrases with 3 to 5 phrases a human would search for, from the spec title, key file names, and the bug or feature. Set importance_tier to important for P0/P1 fixes, shipped user-facing features, and release-gating review verdicts. Otherwise normal.

## Fabrication guard

If a section needs evidence (Files Changed, Verification PASS claims, line numbers) and none exists in implementation-summary, spec, or git, write "Evidence not available in source files - manual verification required." Never invent file paths, test names, commit hashes, or pass/fail outcomes. For thin packets, populate Summary from the spec title and description only, set the change sections and Files Changed to None or empty, and note "Packet may be incomplete - verify before publishing" in Follow-Ups. Better still, classify thin packets as HALT in Step 1 and send them to the audit.

## Generator failure modes to correct

1. Stale summary extraction when docs predate code.
2. Research and review never get Added/Changed/Fixed = None from the generator; leaked task lines, CHK-ids, and [P] stubs must be removed.
3. Phase-parent boilerplate extracted verbatim as Summary and the sole Changed bullet.
4. Empty Files Changed when the summary has no three-column table; rebuild from key_files and git.
5. Follow-Ups leaking task sub-spec stubs.
6. Static trigger_phrases on every scaffold; always replace.
7. Packet-internal doc rows inflating Files Changed.
8. CHK-id and REQ noise classified into change sections by the regex classifier.
