---
title: Deep Research Strategy — Round Two Ripgrep Search System Audit
description: Persistent research plan for the deepseek-v4-flash-ripgrep-search fan-out lineage: remediation verification, round-one gap finding, kept-row re-examination.
---

# Deep Research Strategy — deepseek-v4-flash-ripgrep-search

## Research Topic

ROUND TWO of the ripgrep-search-system retrieval audit, executed against the tree AFTER `006-retrieval-drift-remediation` closed. Three jobs in priority order: (1) verify each remediation landed completely and coherently — a fix that left one consumer, one document line, one fixture or one asset behind is a finding; (2) find what round one missed, preferring angles round one covered in one pass or not at all; (3) re-examine round-one kept rows and recorded decisions, re-listing one only with new evidence that its stated reason is wrong. Never re-report a row confirmed-findings marks fixed unless the fix is incomplete; never reuse a round-one count — recount in this tree. Two round-one findings were worktree artifacts, so read checked-in source and never run validate.sh, node tooling or git; compiled dist directories are untracked and stale. Non-goals: no edits; no database/vector redesign; no prose-style review. Exactly 10 iterations, no early convergence (convergence is telemetry only).

## Known Context

- Round-one synthesis: `lineages/glm-5-3-flash-ripgrep-search/research.md` (9 P1, 25 P2, 0 P0; stop reason maxIterationsReached).
- Round-one census: `research/confirmed-findings.md` — every row judged against the main checkout; L5 dropped (hook-system column is Manual fallback); P2 latency-<50ms row dropped (not reproduced).
- Remediation packet: `specs/system-speckit/035-spec-kit-simplification-research/006-retrieval-drift-remediation` — spec.md (15 files, REQ-001..007), implementation-summary.md (verification: 7 suites PASS, 221 tests, index+manifest regenerated, committed pair 4baf2dbd…, `committed_pair_mismatch` signal, retrofit moved to ops/).
- Round-one open questions carried: promptSetHash parity arm land-or-retire; grep-convention migration acceptance (licenses retrofit relocation); fixture hash pins exemption-or-refresh; whole-corpus regeneration owner.

## Key Questions

- q-verify-doc: Did every 006 doc fix land completely — recipe parity, five-label vocabulary everywhere, concept-lane removal, README paths, doctor wording?
- q-verify-data: Did the committed pair regenerate together, and does every generated artifact agree (index, manifest, diagnostics, variants)?
- q-verify-move: Did the retrofit relocation close every import, test, diagram, and count, in every document?
- q-corpus: What does the committed index actually contain — single-token, generic-word and fragment phrase census; is the §8 "declare two or more tokens" rule enforced anywhere?
- q-enforcement: Do the validator's negative classes, the doctor's pollution screening, and the generator's fail-closed policy cover the pollution classes that exist in the index?
- q-coverage: Which docs outside the corpus roots carry trigger_phrases and are unreachable by the keyed lane (repo-rules/, root docs)?
- q-verify-round1: Do round-one's dropped rows and kept rows hold against the new tree — any new evidence that a stated reason is wrong?
- q-removal: What can be removed or merged without losing a documented capability, given the post-fix tree?

## Answered Questions

- q-verify-doc ✓ — three doc-side leftovers (V1 presentation §3 matchClass vocabulary, V2 §3 evidence-field names, V3 README diagram/count); concept-lane removal + search.md recipe parity + old-path residue all verified landed.
- q-verify-data ✓ — committed pair equal (4baf2dbd…, python read); manifest/diagnostics counts consistent; doctor committed-pair signal + activity + wiring all present; retrofit relocation closed (zero old-path residue).
- q-verify-move ✓ — imports/tests/READMEs/grep-convention.md all point at ops; retrieval README §2 diagram is the single leftover (V3).
- q-corpus ✓ — 352 single-token phrases (2,245 postings, 826 docs), 29 numeric-only, 175 docs owning §8 generic words, junk fragments ('ation','tion','009'…) from a repo-wide frontmatter sweep; §8 rule enforced nowhere (N1/N2/N3).
- q-enforcement ✓ — shared judge has no class/category/severity for single-token/numeric/fragment (N4); doctor corpus_pollution screens only ≤5 stale-flagged packets (N5); diagnostics carry no quality bucket (N6).
- q-coverage ✓ — 164 repo-rules trigger phrases dead to Gate 1; §9 root table silent on repo-rules/ (N7); sk-create-repo-rule collision verifies manually only (N8).
- q-verify-round1 ✓ — L5 drop holds (column is Manual fallback); L9 kept decision holds with new nuance (probes already pin promptSetHash); F6.2 source not located in this tree (parked); shortlist item 6 rationale discharged by test; all four rule-outs hold.
- q-removal ✓ — vehicles consolidated: tests/fixtures row (V9), variants opt-in (V13), 4-artifact pair check (V10), judge+diagnostics pollution classes (N4/N6), repo-rules index-or-retire decision (N7).

## What Worked

- Python read-only census of the committed JSON artifacts gave exact numbers without running node tooling (the no-node constraint made the phrase-quality census a fresh surface).
- Grep residue sweeps for the removed/moved named things (concept lane, old retrofit path) separated landed fixes from one-line leftovers quickly.
- Static re-reads of generator/lookup code were enough to verify contract consistency where round one had executed; no claim was made that execution-level determinism was re-proven.

## What Failed

- Iteration 6 partially: `ignoredPathsUnmatched` array content was not printed before writing the file — the verification was corrected in the file's own fidelity note rather than claimed as complete.
- No execution-level verification was possible (node/prohibited) — all "runs" claims are restricted to path-existence + documented-form matching.

## Exhausted Approaches

- All round-two angles complete: doc-side residue, code/data-side residue, corpus census, enforcement matrix, repo-rules coverage, generator static, lookup static, callers census, kept-row re-examination, consolidation. Ground-truth surface re-read: conventions, search command + presentation, doctor YAML + wiring, corpus/normalize/grep-convention/rg-lane/modules, generator, lookup, wrapper, READMEs, fixtures, index data, repo-rules frontmatter, sk-create-repo-rule contract, hook-system table.

## Ruled-Out Directions

- Re-list L5 (hook-system column is titled Manual fallback; census confirms no hook runs the lookup).
- Re-list L9 with "slot should be removed" — the kept decision's reason (removal changes every manifest hash for no reader) remains true; the new evidence adds nuance (probes pin), not contradiction.
- Generator fail-closed expansion to phrase quality — policy call with 826-doc blast radius; diagnostics+warning first.
- "Digits in multi-token phrases are corruption" — documented normalization of dates/versions (author-declared).
- Re-executing generator/lookup determinism claims — prohibited; code-by-construction only.

## Divergence Frontier

Iteration plan (executed): (1) doc-side residue; (2) code/data-side residue; (3) corpus census; (4) enforcement stack; (5) repo-rules coverage; (6) generator static; (7) lookup static; (8) callers/consultation; (9) kept-row re-examination; (10) consolidation.

## Next Focus

None — 10 iterations complete (cap). Synthesis written; stop reason maxIterationsReached.
