# Iteration 1: Broad full-tree completion-state drift survey

## Focus
Establish the Q1 baseline: enumerate every packet's `graph-metadata.json` `status` and cross-check declared `spec.md` Status against graph-metadata, with emphasis on the phase-005 (sk-design) "shipped" claim and all `z_archive` folders. This iteration does NOT narrow to the five renumber tracks — it is a full-tree sweep.

## Findings

### F1.1 — Completion-state drift is systemic (37% raw mismatch rate)
Across 121 packets where both a spec.md Status field and a graph-metadata.json status exist, **45 show a mismatch** (76 match). After filtering whitespace-only normalizations (`in progress` vs `in_progress`), **~23 are true semantic mismatches**. The dominant pattern is **spec.md claims `complete` while graph-metadata.json reports `in_progress` or `planned`** — i.e. the human-authored narrative over-states completion relative to the derived graph state.
- [SOURCE: file:.opencode/specs/cli-external-orchestration/001-cli-gemini-creation/spec.md] declares `complete`; [SOURCE: file:.opencode/specs/cli-external-orchestration/001-cli-gemini-creation/graph-metadata.json] reports `in_progress`.
- [SOURCE: file:.opencode/specs/sk-doc/015-sk-doc-parent/spec.md] declares `complete`; graph-metadata = `planned`.
- [SOURCE: file:.opencode/specs/sk-git/014-gitkraken-mcp-integration/spec.md] declares `complete`; graph-metadata = `planned`.
- [SOURCE: file:.opencode/specs/sk-prompt/002-sk-improve-prompt-rename/spec.md] `complete`; graph-metadata = `planned`.

### F1.2 — Reverse drift also occurs
At least one packet drifts the opposite way: spec says `in progress` while graph says `complete`.
- [SOURCE: file:.opencode/specs/system-deep-loop/032-goal-opencode-plugin/spec.md] = `in progress`; [SOURCE: graph-metadata.json] = `complete`.

### F1.3 — Phase 005 (sk-design reconstruct) "shipped" claim is unsubstantiated by graph state
The 006 packet narrates phases 001/003/005 as "complete, shipped" and uses that to satisfy its own launch gate ("GATE STATUS: SATISFIED — 001/003/005 complete"). But:
- [SOURCE: file:.opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/006-global-spec-drift-deep-research/spec.md:48] claims "001/003/005 complete".
- Every `sk-design/*/graph-metadata.json` reads `draft` (001-004, 006-009) or `planned` (005-design-md-generator). The sk-design phase-005 child `graph-metadata.json` and the 000 parent `graph-metadata.json` both read `draft`.
- This means the **research sweep was launched on a gate the graph state does not corroborate** — a load-bearing completion claim rests on narrative, not derived state. Whether sk-design was actually shipped (graph just stale) or never shipped (narrative wrong) is unresolved; both are drift.

### F1.4 — `z_archive` status is anomalous across nearly all tracks
Seven of eight `z_archive` folders carry `planned` status; only `sk-git/z_archive` is `complete`.
- `planned`: sk-code, sk-design, sk-doc, system-code-graph, system-deep-loop, system-skill-advisor, system-speckit.
- `complete`: sk-git.
- [SOURCE: graph-metadata.json in each z_archive folder above]
An archive reporting `planned` is semantically odd (archived content is not "planned"); this is either a default-template artifact never overwritten, or a genuine drift where the archive lifecycle never set a terminal status.

## Sources Consulted
- 121 spec.md Status rows + 121 graph-metadata.json status fields (full-tree scan).
- `.opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/006-.../spec.md` §EXECUTIVE SUMMARY.
- All 8 `*/z_archive/graph-metadata.json`.

## Assessment
- **newInfoRatio: 1.0** — first pass; all findings are new to this packet. Novelty justification: establishes the systemic baseline that completion-state drift is widespread (~37% raw / ~19% semantic mismatch), not confined to the five renumber tracks.
- **Confidence:** high on the mismatch counts (mechanical scan); medium on whether sk-design was "actually shipped" (requires implementation-summary/shipped-artifact check — deferred to a later iteration).
- Answered part of Q1 (baseline established); Q1 not fully closed until the severity and remediation-cost characterization is done.

## Reflection
- **Worked:** mechanical spec-vs-graph status diff is high-signal and cheap; it should be the canonical drift detector.
- **Failed:** none yet.
- **Ruled out:** none yet.

## Recommended Next Focus
Iteration 2: **numbering-drift (Q2)** in the non-001-005 tracks — enumerate gaps, cross-track collisions, and jumps (system-deep-loop 029→063 gaps; sk-doc 018→032 jump + `999` sentinel; cli-external-orchestration `z_archive`/`026` collision). Then Q3 naming in iteration 3.
