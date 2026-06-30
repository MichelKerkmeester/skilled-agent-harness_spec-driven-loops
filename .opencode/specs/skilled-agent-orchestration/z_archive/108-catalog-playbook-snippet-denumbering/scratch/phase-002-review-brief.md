# Phase 002 — Tool Review (MiMo COSTAR brief)

## Context
A pure-Node CommonJS migration tool `denumber-snippets.cjs` (CWD-relative path: `.opencode/specs/skilled-agent-orchestration/z_archive/108-catalog-playbook-snippet-denumbering/scratch/denumber-snippets.cjs`) de-numbers per-feature snippet filenames in feature-catalog / manual-testing-playbook trees and rewrites references. Its contract is in the same folder's `phase-002-tool-brief.md`; its test harness is `test-tool.cjs`. The tool ALREADY passed all 23 harness assertions and a real-tree dry-run (14+22 renames, 0 collisions, nothing written). KNOWN AND ACCEPTED (do not flag): it processes ONE tree at a time; cross-tree / cross-skill / spec-folder references are intentionally deferred to a later repo-wide sweep, not this tool.

## Objective
Adversarially read `denumber-snippets.cjs` and find any CORRECTNESS bug the 23-assertion harness might miss: a data-loss path, a reference rewrite that OVER-matches (alters a Feature ID like `M-219`, or unrelated text) or UNDER-matches (misses a real in-tree link), a collision-gate hole (any way a collision slips through to a write), a non-idempotency, or a `--apply` path that could write outside the tree. Read the tool file directly.

## Style
precise, no preamble

## Tone
neutral

## Audience
automated pipeline — your output is parsed directly; prose around the JSON is harmful.

## Response
Return ONLY one JSON object in a single fenced ```json block:
```json
{ "verdict": "PASS" | "FAIL", "findings": [ { "severity": "P0"|"P1"|"P2", "line": <number>, "issue": "<what is wrong>", "fix": "<concrete fix>" } ], "summary": "<= 2 lines" }
```
PASS with findings=[] if you find no real correctness bug (in-scope). Read-only; do not modify files. The spec folder is pre-approved (skip Gate 3); do not ask questions.
