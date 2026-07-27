# Deep Research Strategy

## 2. TOPIC
Second-pass, expand-do-not-converge audit of the parent packet and its full 21-child tree, excluding frozen research, benchmark, lineage, output, log, and run-record artifacts.

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Are all 21 direct child packets internally consistent and truthful about status and completion?
- [x] Do defects analogous to the known 012 and 017 failures exist in other direct children?
- [x] Do parent routing references match the live compiled-routing runtime and all seven hub routing surfaces?
- [x] Did commit 140266be3e introduce any new inconsistency, stale cross-reference, wrong metric, or broken link?
- [x] Are parent/child lifecycle metadata, children_ids, and derived.last_active_child_id truthful across nested topology?
- [x] Are links repo-rooted and valid, and are the 020/007 duplicate-012 collision and 015 sub-parent resume-safe?
<!-- /ANCHOR:key-questions -->

## 4. NON-GOALS
- Do not implement fixes.
- Do not report frozen historical artifacts as defects.
- Do not inspect `research/**`, `benchmark/**`, `lineages/**`, `*.out`, `*.log`, or run-record artifacts as defect candidates.
- Do not write outside the bound lineage artifact directory.

## 5. STOP CONDITIONS
- Run exactly 10 iterations; convergence before iteration 10 is telemetry only.
- Synthesize only after all 10 iterations are recorded and mechanically verified.

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Direct-child consistency: four PRE-EXISTING P1 defects verified in 012, 015, 017, and 019.
- Analogues beyond known defects: 015 and 019 have lifecycle/continuity contradictions; 013/014 and phase parents 020/021 were ruled out as false analogues.
- Commit impact at direct-child depth: `140266be3e` changed no canonical direct-child packet file, so none of these defects is NEW.
- Nested resume topology: null pointers at 020 and 020/007 block deterministic descent; 020/007/015 has a stale phase map and stale pointer.
- Duplicate phase prefix: full canonical IDs disambiguate the two `012-*` siblings, but numeric-only selection is ambiguous.
- Parent/runtime conformance: live routing is compiled-authoritative and default-on for all seven hubs; parent canon contains new and pre-existing contradictions.
- Canonical link audit: one NEW parent handoff break and three PRE-EXISTING stale/ambiguous path contracts were verified.
- Fleet claims: 7/7 route-gold framing is NEW and wrong in denominator scope; nested 009 and 013 overclaim completion; fleet activation is real but hard-invariant closure is incomplete.
- Nested sampling: 021 parent metadata is stale; 020/004 and 020/006 are Level-2 packets missing required canonical files, with 004 also splitting lifecycle truth.
- 020/005 subtree: all eight Level-2 children miss required files; completion and graph claims conflict; parent lifecycle/pointer metadata is stale.
- Commit regression inventory: every canonical non-frozen hunk in `140266be3e` was reviewed; no additional finding survived deduplication.
- Finding reconciliation: 27 canonical findings remain after merges, splits, downgrades, and provenance-limit exclusions.
<!-- /ANCHOR:answered-questions -->

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- Direct-depth inventory plus narrow strict validation separated genuine defects from planned-packet and phase-parent false positives (iteration 1).
- Narrow metadata, phase-map, and live-resolver reads established actual resume behavior without relying on frozen artifacts (iteration 2).
- Seven-hub inventory, live resolver calls, checker execution, and commit attribution separated authored, benchmark, and serving authority (iteration 3).
- Separating Markdown links, explicit repo paths, contextual backticks, and schema-owned logical IDs avoided broad-scan false positives (iteration 4).
- Pairing claim inventory with live route proof, checker execution, and checklist arithmetic separated serving activation from closure and lifecycle truth (iteration 5).
- Narrow branch inventories found Level-file and parent-pointer defects without repeating the primary 015 path (iteration 6).
- Strict validation plus exact target and Git object probes efficiently classified all eight 020/005 children (iteration 7).
- Zero-context changed-hunk review plus exact current-source checks closed the parent commit surface without inflating duplicate findings (iteration 8).
- Stable canonical IDs exposed exact duplicates, mixed provenance, severity downgrades, and structural/lifecycle splits (iteration 9).
<!-- /ANCHOR:what-worked -->

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- Broad recursive validator output mixed nested descendants into direct-child evidence; use narrow direct-file verification for subsequent topology passes (iteration 1).
- Exact 91/106 and 91/91 reproduction is unavailable from promoted non-frozen evidence; treat these as provenance gaps rather than false values (iteration 3).
<!-- /ANCHOR:what-failed -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
- Full direct-child inventory is complete; do not repeat unless canonical files change.
- The 020/005 eight-child inventory is complete; do not repeat unless canonical files change.
<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- Treating planned 013/014 implementation-summary absence as analogous to 012.
- Treating lean phase-parent 020/021 heavy-doc absence as a required-file defect.
- Classifying direct-child defects as NEW from `140266be3e`.
- Treating the 015 child-count claim as wrong; the count is 14, while its phase map exposes only 12.
- Treating complete canonical `last_active_child_id` values as ambiguous across duplicate numeric prefixes.
- Treating generic backticked filenames or logical `children_ids` as broken filesystem links without contextual/schema resolution.
<!-- /ANCHOR:ruled-out-directions -->

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
None. Remediation ownership is outside this research-only lineage.
<!-- /ANCHOR:carried-forward-open-questions -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Research complete. Use `research.md` as the canonical synthesis for remediation planning.
<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->

## 12. KNOWN CONTEXT
- The first audit covered parent-level docs only and commit `140266be3e` applied its findings.
- Known child defects to verify: `012-sk-doc-routing-fixes` required-file/LEVEL_MATCH inconsistency and `017-system-code-graph-routing-research` `_memory` frontmatter violation.
- The code graph is empty, so direct file evidence is authoritative for this run.
- No packet root `resource-map.md` exists.

## 13. RESEARCH BOUNDARIES
- Max iterations: 10
- Stop policy: max-iterations
- Allowed write root: `.opencode/specs/sk-doc/019-skill-routing-refactor/research/round-3-sol/lineages/sol`
- Every finding must include real `file:line` evidence, P1/P2 severity, and NEW/PRE-EXISTING classification.
