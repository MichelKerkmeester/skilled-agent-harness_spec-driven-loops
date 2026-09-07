# Iteration 004 — KQ-R1d: remaining 011/012 touches + fixture sweep

Session: fanout-deepseek-v4-flash-overengineering-1788762836148-1dgwlq | run 4 | focus: verify each remaining 011/012 touch — complete.md presentation boundary, optimizer adoption README, resource-map real link, BM25 zero residue, comment hygiene, 012 test fixes (both suites), and whether any other test still depends on old fixtures.
Evidence reads: `complete.md:85-100`, `assets/speckit-complete-presentation.txt:3`, `runtime/cli/optimizer/README.md:1-40`, `runtime/cli/resource-map/README.md:64`, `feature-catalog/feature-catalog.md:26,36`, `templates/addons/` listing, `runtime/tests/continuity-freshness.vitest.ts` (307 L, grep), `runtime/cli/tests/continuity-freshness.vitest.ts` (282 L, case names), `runtime/cli/tests/recursive-child-manifest.vitest.ts` (head 70), `.opencode/specs/system-deep-loop/036-…` existence. Reads cost: 7 bash calls. No node/validate/git.

## Positive confirmations (011/012 remaining touches hold)

1. **complete.md:92 presentation boundary** — now states "The dashboard layout and the research, deep-context, phase-decomposition and closeout checkpoints" (one layout, four checkpoints); the six-dashboard promise is gone; the presentation asset's own line 3 matches ("visible prompts, dashboard layout, and final result displays"). F18/R4 holds.
2. **Optimizer adoption** — `runtime/cli/optimizer/README.md` (Overview, "Current state") now says: "Adoption to date: `audit/promotion-reports/` holds no report and no config has been promoted from a replay run. The manifest is still read outside this directory: the deep-research and deep-review configs point at it … and the deep-loop anti-convergence test reads it, so the manifest stays a live contract while the replay scripts stay advisory." F23/R6 holds — and the consumers claimed are plausible in-boundary (optimizer-manifest.json exists on disk).
3. **resource-map README link** — `runtime/cli/resource-map/README.md:64` links `../../../templates/addons/resource-map.md.tmpl`; the file exists (templates/addons/resource-map.md.tmpl present in the listing). R5/F20 holds.
4. **BM25 zero residue** — remaining BM25 hits are: `feature-catalog.md:26,36` (the declared-loss statement: memory server removed, "vector and BM25 search … are gone"; "Semantic paraphrase, vector and BM25 fusion … are a declared loss, not a relocated capability") and changelogs (historical records). No live surface describes BM25 as available. F24/R7 holds.
5. **Comment hygiene** — grep for ticket-id patterns `(0NN)`/`[0NN]`/`#NNNN` across the 8 assets: 0 hits. The 18-line hygiene claim holds.
6. **012 freshness fixture** — `runtime/tests/continuity-freshness.vitest.ts` fixture carries evidence in `tasks.md` (`key_files: ["tasks.md"]` at :52; `- [x] Fixture check. Evidence: vitest.` at :65) and the stale edits now append to `implementation-summary.md` (:164,180,196) — the hashed document. 0 checklist.md references in the fixture. The "fixture that edits the document its rule hashes" fix holds.
7. **012 manifest suite** — the tracked case is now self-contained: `trackedEntries` = this test file + the checker script it exercises, written to a temp workspace manifest; assertions run against that (not the 369-file goal manifest). The deep-loop goal manifest references are gone from the tracked case. The checker itself (`check-goal-file-manifest.sh`) and the fixture source still come from `.opencode/specs/system-deep-loop/036-deep-loop-innovation/004-gate-closeout-and-drift/001-whole-system-gate/` — but that packet IS checked in this tree (verified exists), so the dependency resolves; and the test's subject is that checker, so the dependency is by design. 012's "self-contained" claim holds for the tracked-manifest case it fixed.
8. **No duplicate suite**: `runtime/tests/continuity-freshness.vitest.ts` (7 cases: flag-off byte-identity, stale-verdict warn, enforce mode, matching fingerprint, timestamp fallthrough, claim detection, dirty-tree scope) and `runtime/cli/tests/continuity-freshness.vitest.ts` (10 cases: timestamp budget, codes, CLI gating) are complementary layers — core/API vs CLI bridge — not a duplicated suite. No fusion finding.

## Findings

**F2-09 [P2 — recorded, kept with a note] recursive-child-manifest.vitest.ts still resolves its checker and fixture from another session's packet tree.**
- Where: `runtime/cli/tests/recursive-child-manifest.vitest.ts:12-18,24-25` (manifestCheck → `.opencode/specs/system-deep-loop/036-deep-loop-innovation/004-gate-closeout-and-drift/001-whole-system-gate/check-goal-file-manifest.sh`; sourcePacket → `.opencode/specs/system-deep-loop/036-deep-loop-innovation/001-research-inputs-and-architecture/001-deep-loop-market-research`).
- Cost: if the 036 packet is renamed/archived, this CLI test loses its subject and its fixture source; 012 halved the dependency (self-contained manifest) but the checker itself remains the other packet's artifact.
- Protects: nothing beyond the test's own subject necessity.
- Severity: P2 — cohesion, not a defect: the test legitimately tests that packet's checker; the 012 limitation note (deep-loop goal manifest stays stale) already discloses the cross-packet relationship.
- Recommendation: **keep** — the cross-packet reference is the test's subject; note in the 012 limitation is sufficient. (Recorded so the reader knows it was examined and judged intentional, not a leftover.)

## Ruled out / corrections

- "A second, duplicated freshness suite" — FALSE: complementary layers (7 vs 10 cases, distinct subjects).
- "BM25 still described as available" — FALSE: only the declared-loss statement + changelog history remain.
- "The six-dashboard promise persists somewhere in the command surface" — FALSE: complete.md + presentation line + 8 assets all name the 4-checkpoint shape.

## Provisional counts

- Verified-hold items this iteration: 8 (listed); findings: 1 (recorded-keep).
- 012's two test-file scope: only the two vitest files (per its key_files) — the completion-evidence-sentinel and completion-state.cjs were NOT in remediation scope, which is why F2-01 (iteration 1) survives: the checklist gate lives in code 012 did not touch.
