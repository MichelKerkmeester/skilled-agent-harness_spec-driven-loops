# Deep Research Strategy — Parent Packet Audit

## 1. OVERVIEW

Audit the live parent packet against its actual on-disk child tree. Findings must be concrete, severity-ranked, and grounded in current file:line evidence.

## 2. TOPIC

Detect parent-level drift left by the rename migration and subsequent fixes.

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)

- [x] Does the parent phase map match all direct children, including names, counts, duplicate-number collisions, phase-parent structure, and current statuses?
- [x] Are workstream groups A–F complete, mutually coherent, and consistent across `spec.md` and `context-index.md`?
- [x] Do rename history, old-to-new mappings, and parent supporting references contain stale names, path spellings, obsolete counts, or broken links?
- [x] Do resume, handoff, open-question, and RELATED DOCUMENTS pointers lead to current authoritative surfaces?
- [x] Are parent `graph-metadata.json` and `description.json` internally consistent and synchronized with the live tree and parent content?
<!-- /ANCHOR:key-questions -->

## 4. NON-GOALS

- Do not edit the audited parent or child documents.
- Do not inspect or report drift inside frozen `research/**`, `benchmark/**`, `lineages/**`, `*.out`, `*.log`, or run-record artifacts.
- Do not implement fixes.

## 5. STOP CONDITIONS

- Run exactly ten iterations.
- Treat convergence before iteration ten as telemetry only.
- Synthesize only after the tenth iteration.

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS

- The direct `001`–`021` names, count, numbering, and A–F membership form a bijection with the live root tree.
- The duplicate `012` is nested under `020/007`; the phase-parent `015` is `020/007/015`, not root child `015`.
- Parent status labels conflict with several child spec/summary/graph lifecycle values, so status truth remains split.
- A–F root membership is correct; Group E’s nested topology is under-documented for resume.
- Supporting references contain fleet-state contradictions, stale defaults/guard claims, broken underscore paths, and outdated operational guidance.
- Root handoff/resume links are incomplete, including a broken `../spec.md` pointer.
- Parent metadata contains a ghost child, stale narrow description, and null active-child routing.
<!-- /ANCHOR:answered-questions -->

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED

- Numbered direct-child enumeration plus `children_ids` distinguishes real phase parents from incidental directories. (iteration 1)
- Symmetric seven-hub comparison exposed partial documentation migration. (iteration 3)
- Literal link resolution found broken path spellings and resume pointers. (iterations 4, 6)
- Adversarial falsification separated current defects from intentional history. (iteration 10)
<!-- /ANCHOR:what-worked -->

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED

- Broad max-depth directory counting over-counts `research`, `scratch`, `design`, and `reviews`; use numbered children plus metadata. (iteration 1)
- Treating old names in the rename ledger as live defects creates false positives. (iterations 3, 4, 7)
<!-- /ANCHOR:what-failed -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)

- Root-level duplicate-`012` hypothesis: prefixes `001`–`021` are unique; the collision is under `020/007`. (iteration 1)
- Root `015-sk-code-router-alignment` as phase parent: ruled out by empty `children_ids`; nested `020/007/015` is the phase parent. (iteration 1)
<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS

None yet.
<!-- /ANCHOR:ruled-out-directions -->

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER

- Completed pivots: 0
- Saturated: none
- Remaining frontier: all five key questions
<!-- /ANCHOR:divergence-frontier -->

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS

All evidence questions are answered. Three policy decisions remain: active-child selection, lifecycle-status authority, and whether routing references are current or dated snapshots.
<!-- /ANCHOR:carried-forward-open-questions -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS

Synthesis complete. Next action is a separately authorized remediation packet; do not edit audited sources from this research lineage.
<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->

## 12. KNOWN CONTEXT

- The parent currently has direct children numbered `001` through `021`.
- The audit request calls out a duplicate `012` collision and phase `015` being a phase parent as high-risk facts to verify.
- Parent surfaces in scope are `spec.md`, `context-index.md`, `routing-config-and-advisor-reference.md`, `routing-before-after.md`, `graph-metadata.json`, and `description.json`.
- Historical artifacts are frozen and excluded.

## 13. RESEARCH BOUNDARIES

- Maximum iterations: 10
- Convergence threshold: 0.05
- Stop policy: max-iterations
- Artifact root: `.opencode/specs/sk-doc/019-skill-routing-refactor/research/lineages/sol-parent-audit`
- Writes outside the artifact root are forbidden.
