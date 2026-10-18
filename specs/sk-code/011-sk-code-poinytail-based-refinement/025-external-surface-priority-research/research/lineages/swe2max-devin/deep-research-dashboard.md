---
title: Deep Research Dashboard
description: Auto-generated reducer view over the research packet.
---

# Deep Research Dashboard - Session Overview

Auto-generated from JSONL state log, iteration files, findings registry, and strategy state. Never manually edited.

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Reducer-generated observability surface for the active research packet.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:status -->
## 2. STATUS
- Topic: Round two of the external sk-code surface priority research. Round one (research/research.md in this spec folder, findings F1-F33, recommendations R1-R5, rejected ideas X1-X9, phases P1-P4) found that the one order source is sk-code hub-router.json routerPolicy.tieBreak; a user's own surface outranks the native sk-code-skilled if it is inserted ahead of opencode (R1); stack-agnostic tooling must stop naming the obsidian and webflow examples (R2); deleting the examples must become a documented, verified path including the re-mint and authored copy (R3); the two surfaces must be marked as examples (R4); R5 (opencode generic keywords) stays as is by operator ruling. Background: sk-code-obsidian and sk-code-webflow are the operator's personal example surfaces; an external user deletes them and adds their own surface, which must outrank sk-code-skilled. sk-code-review, sk-code-quality and shared/ are stack-agnostic. Round two goes deeper, with path:line or command evidence: (1) F10, ROUTER.md stack-agnostic intents (debugging, performance, deployment, accessibility, implementation) load mostly or only Webflow leaves, so after an external user deletes webflow those intents load almost nothing: what shared/ or opencode leaves could serve them, and a proposed R6; (2) F20, compiled-routing re-mint depends on the authored closure under specs/sk-doc/z_archive/019-skill-routing-refactor/, so a user who prunes specs/ cannot re-mint: cost and blast radius of fixing it versus documenting it, and R7 or a reasoned no; (3) F18, adding a surface by hand fails five doctor legs (3d-files, 6b, 5k-alias, 5k-packet, 5k-canary): does /create:skill-parent update --surfaces (.skilled/commands/create/skill-parent.md and its assets) perform those steps, observed in a throwaway full-tree copy; (4) stress-test R1-R4: exact edit text, every file each one touches (including the auto twin of create-skill-parent-confirm.yaml, both README tables, the sk-code README), what can still break, and whether each is the smallest correct fix under .skilled/repo-rules/prevent-overengineering.md; (5) anything round one missed: other hubs or tooling that assume sk-code's examples (benchmarks, playbooks, feature catalogs, advisor batteries and fixtures, Hermes and runtime mirrors, CI workflows under .github/, install guides, /doctor:update release-engine keep-local rules) and the end-to-end external-user flow (clone, delete examples, add own surface, run doctor, route a prompt); (6) challenge the rejected ideas X1-X9 once more and name new rejections. Every recommendation must pass .skilled/repo-rules/prevent-overengineering.md: name the cheaper move and why it fails. Number new findings from F34, new recommendations from R6 and new rejections from X10 only in the final synthesis; inside iterations use the finding-row format the preamble gives.
- Started: 2026-10-12T18:58:06.247Z
- Status: INITIALIZED
- Iteration: 10 of 10
- Session ID: dr-025r2-swe2max-devin-2026-10-12T18:58:06.247Z
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Q7/F10: ROUTER.md intent-to-leaf ownership, shared/opencode stack-agnostic leaf inventory, throwaway-copy delete-and-replay of sk-code-webflow+sk-code-obsidian, and smallest-fix R6 | sk-code-router | 0.80 | 0 | complete |
| 2 | Q9/F18: does /create:skill-parent update --surfaces perform the five steps a hand-added surface misses (3d-files, 6b, 5k-alias, 5k-packet, 5k-canary), observed in throwaway full-tree copies | - | 0.75 | 8 | complete |
| 3 | Q8/F20: reader census and failure-mode cost of the compiled-routing authored closure at specs/sk-doc/z_archive/019-skill-routing-refactor/ | compiled-routing-dependency | 0.80 | 12 | complete |
| 4 | Q10 R1 stress test: tieBreak write/doc/check site census, exact per-site edit text, throwaway-copy tie test (stand-in surface ahead of sk-code-skilled, refresh, route tied prompt) | routing-policy | 0.80 | 0 | complete |
| 5 | Q10 R2 stress test: classify drift-guard/test couplings to the obsidian+webflow examples, write the exact R2 change for verify-router-sync.cjs, and verify in a throwaway copy whether R2 as written is complete | - | 0.80 | 12 | complete |
| 6 | Q10, R3 and R4 stress test: executed full example-surface removal in a throwaway copy, ran all six gates, found and resolved the sync authored/runtime deadlock, inventoried every surface-naming doc line, wrote corrected doctor/3c texts | - | 0.80 | 0 | complete |
| 7 | Q11 outside-hub dependents of the sk-code-obsidian/sk-code-webflow examples | - | 0.80 | 16 | complete |
| 8 | End-to-end external-user journey in throwaway copy: docs-driven delete of obsidian/webflow surfaces, then routing/doctor/advisor probes | external-user-ux | 0.85 | 11 | complete |
| 9 | Automation coverage of add/remove-surface steps by existing commands; external-user guide placement and doctor pointers; X1-X9 re-challenge plus new rejections and ranked recommendations | - | 0.70 | 0 | complete |
| 10 | Adversarial re-verification of iterations 1-9 and round-one F10/F18/F19/F20 against the current tree | - | 0.75 | 0 | complete |

- iterationsCompleted: 10
- keyFindings: 0
- openQuestions: 0
- resolvedQuestions: 6

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 6/6
- [x] Q7: F10, which shared/ or sk-code-skilled leaves could serve the stack-agnostic ROUTER.md intents once webflow is deleted, and what is the smallest fix (R6)?
- [x] Q8: F20, what does fixing the compiled-routing re-mint dependency on specs/sk-doc/z_archive/019-skill-routing-refactor/ cost across every hub, versus documenting it (R7 or a reasoned no)?
- [x] Q9: F18, does /create:skill-parent update --surfaces perform the five steps a hand-added surface misses (3d-files, 6b, 5k-alias, 5k-packet, 5k-canary), observed in a throwaway full-tree copy?
- [x] Q10: R1-R4 stress test, what exact edit text and which files does each touch, what can still break, and is each the smallest correct fix?
- [x] Q11: What other hubs, tooling, CI, mirrors, catalogs, playbooks, batteries or release-engine rules assume the obsidian and webflow examples, and what does the end-to-end external-user flow hit?
- [x] Q12: Do the rejected ideas X1-X9 still hold, and which new ideas should be rejected?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ▆▅▃▄▅▆▆▆▆▆▆▆▆▆▇▇▄▁▂▃
- score sparkline: ▆▅▃▄▅▆▆▆▆▆▆▆▆▆▇▇▄▁▂▃
- Last 3 ratios: 0.85 -> 0.70 -> 0.75
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.75
- coverageBySources: {"code":116,"other":59}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- Hand-editing §11 rows to remove webflow paths — defeats the generated-projection contract (ROUTER.md:41) and the re-mint already does it. (iteration 1)
- No per-surface `ROUTER.md`/map file found at `find -maxdepth 2` inside the surface packets — the per-packet maps ROUTER.md:41 describes live deeper or are generated; a later iteration (Q9/Q11) can locate the authored source the re-mint reads. (iteration 1)
- Treating `routeSkillResources` `resources` output as a bug — it faithfully emits the map; the map itself is stale until re-mint. (iteration 1)
- `/create:skill-parent update --surfaces` alone as the complete "add your own surface" path — observed gate exit 1 (5k-canary) and tieBreak-last placement. (iteration 2)
- Hand-editing `tieBreak` as part of the command's normal result — the YAML has no placement rule; natural execution appends at end. (iteration 2)
- None new; `compiled-route-sync --check` verified inapplicable to the surface-add gap (it is a served-copy check, not a map-coverage check). (iteration 2)
- "`compiled-route-manifest mint` requires the authored tree" — contradicted by observation: mint targets the runtime root and ran (exit 1 `already-exists`) with `specs/` absent. (iteration 3)
- "Move the whole 019 packet into `.skilled/`" — 73MB of spec history/research/real-model logs has no serving role; only the traced closure subset is consumed, and moving a subset splits the archival packet. (iteration 3)
- None new for the strategy list beyond the two ruled-out rows above. (iteration 3)
- "No re-mint step needed after editing hub-router.json" — contradicted: route output collapsed to `servingAuthority:"legacy"` until `refresh` ran. (iteration 4)
- "R1 = insert surface first in tieBreak" — illegal: 5i enforces workflow-before-surface; correct phrase is "ahead of the default surface" (observed `PASS: 5i` only with that placement shape). (iteration 4)
- "sync --check catches post-refresh manifest drift" — contradicted: exit 0 while authored and runtime manifests differed (`cmp` exit 1); the guard, not sync, owns that leg. (iteration 4)
- None new beyond the ruled-out rows. (iteration 4)
- "Just read surfaces from mode-registry.json" (the change the focus suggested as the (iteration 5)
- mode-registry.json `backendKind`/`packetKind`/`aliases`/`toolSurface` — all identical (iteration 5)
- Treating canary-cases.v1.json as R2 scope: it is generated closure data; re-mint owns it. (iteration 5)
- "leaf-manifest.json needs hand-editing" — `generate-leaf-manifest.cjs --check` returned `OK` on the scrubbed file, i.e. `--write` produces it. (iteration 6)
- "sync --check's printed remediation is sufficient" — the command it names is the one that fails (MOVE-SIMULATION); only the manual authored-path copy-back unblocks it. (iteration 6)
- None new beyond the violation forensics: whether the clone carried the writes or the shell cwd reverted could not be settled in budget; the end-state is recorded either way. (iteration 6)
- Broad `rg 'webflow|obsidian'` as the dependent set — ~150 hits dominated by `mcp-obsidian` (a different product), the `sk-design` webflow brand bundle, and changelogs; the operative signal is the precise `sk-code-obsidian|sk-code-webflow` pattern. (iteration 7)
- Searching `.github/`, `.devin/`, `.cursor/`, `.codex/`, `.claude/` for surface names — zero hits; CI and those mirror folders are clean by name (the CI coupling is indirect, via repo-walking tests and the drift guard). (iteration 7)
- `compiled-route.cjs --json` — not an option; correct form is `--hub <id> --prompt <text>` (usage line observed). Not a repo defect, just CLI shape. (iteration 8)
- Bare `compiled-route-manifest.cjs refresh` — exits 2 usage; requires `--hub` + `--skill-root`. (iteration 8)
- `/doctor:update` as the removal path — wrong tool class (release alignment, not checklist execution); carried F25. (iteration 9)
- `compiled-route-sync --check` as a coverage check — already BLOCKED (served-copy check, not map-coverage; strategy:196-199). (iteration 9)
- Broad `rg` for automation hooks: strategy marks the broad surface-name sweep BLOCKED (strategy:156-159); the targeted grep on the confirm YAML was sufficient. (iteration 9)
- Re-running copy probes for contract coverage: reading the workflow YAML settles which steps exist; a copy run would re-observe what iteration 2 already measured (5k-canary exit 1, tieBreak-last). (iteration 9)

<!-- /ANCHOR:dead-ends -->
<!-- ANCHOR:divergent-pivots -->
## 6A. DIVERGENT PIVOTS
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergent-pivots -->
<!-- ANCHOR:next-focus -->
## 7. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 8. ACTIVE RISKS
- None active beyond normal research uncertainty.

<!-- /ANCHOR:active-risks -->
<!-- ANCHOR:blocked-stops -->
## 9. BLOCKED STOPS
No blocked-stop events recorded.

<!-- /ANCHOR:blocked-stops -->
<!-- ANCHOR:graph-convergence -->
## 10. GRAPH CONVERGENCE
- graphConvergenceScore: 0.00
- graphDecision: [Not recorded]
- graphBlockers: none recorded

<!-- /ANCHOR:graph-convergence -->
