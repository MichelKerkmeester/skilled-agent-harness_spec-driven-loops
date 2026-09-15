---
title: "Deep Review Strategy — Angle-Driven Alignment Review, wave2-deepseek"
trigger_phrases: []
---
# Deep Review Strategy — Angle-Driven Alignment Review, wave2-deepseek

## 1. TOPIC

Angle-driven alignment review of the deep-loop system, its neighbours and its hubs. This lane runs wave two, angles 11 to 15, one angle per iteration: version authority across routing artifacts; leaf-manifest generation and doctrine reachability; preamble and leaf-set policy contradictions; roster completeness for the seventh executor; stale references in catalogs and READMEs.

---

## 2. REVIEW CHARTER

- Target: `specs/system-deep-loop/049-deep-loop-alignment-review/001-angle-driven-review` (`spec-folder`)
- Execution: autonomous detached lineage, executor `cli-pi`, model `deepseek-v4.1-flash`, reasoningEffort `max`
- Artifact root: `specs/system-deep-loop/049-deep-loop-alignment-review/001-angle-driven-review/review/lineages/wave2-deepseek`
- Findings only: P0/P1/P2; no fixes inside the review
- Resource Map Coverage: disabled because `resource-map.md` was absent at initialization
- Wave: 2 of 2. Angles 11 to 15 of the phase spec's declared angle block (`spec.md:83`, `spec.md:98-102`). Angles 11 to 15 are rewritten between waves from wave one's forty findings, so every iteration first re-verifies its named wave-one findings and then expands the same defect class across the fleet.

---

## 3. REVIEW DIMENSIONS (completed)
<!-- ANCHOR:review-dimensions -->
- [x] D1 Correctness — covered in iteration 3 (compiled-runtime preamble and enforcement trace); no angle asserted a correctness break without code proof
- [x] D2 Security — unreached by design: no angle in this lane touches a security surface
- [x] D3 Traceability — complete (iterations 1-5)
- [x] D4 Maintainability — complete (iterations 1-5)
<!-- /ANCHOR:review-dimensions -->

---

## 4. NON-GOALS

- No changes to any reviewed file: routing artifacts, generators, routers, catalogs, playbooks, READMEs, protocols or the phase spec itself.
- No fixes. Every confirmed finding routes to a parent phase in a separate follow-up.
- No re-run of wave one's angles 1 to 10 as first-principles reviews; wave-two iterations re-verify the specific wave-one findings their angle names and then sweep the same class wider.
- No structural review of surfaces outside the deep-loop, sk-code and cli-external-orchestration trees except where an angle crosses into them.

---

## 5. STOP CONDITIONS

- Run exactly five iterations, one per angle, in the order the phase spec names them.
- `stopPolicy: max-iterations`; `convergenceMode: off`. Convergence telemetry is recorded but never truncates the lane, and reaching a convergence signal before iteration 5 broadens the angle rather than synthesizing early.
- Stop after iteration 5 and synthesize, even if active findings remain.

---

## 6. COMPLETED DIMENSIONS
<!-- ANCHOR:completed-dimensions -->
| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
| D3 Traceability, D4 Maintainability | CONDITIONAL | 1 | Angle 11: 2 P1 + 1 P2. The newest changelog is the de-facto release authority and SKILL.md obeys it in 20/20 roots including all 17 mode packets; `system-deep-loop/description.json` is the one identity file left one release behind (F021), the registry/router/ROUTER.md version family matches no release and splits its pair in 2 of 3 hubs (F022), and the authoring doc licenses the ambiguity (F023). |
| D3 Traceability, D4 Maintainability | CONDITIONAL | 2 | Angle 12: 2 P1. The walker's symlink skip drops exactly 12 sk-code doctrine leaves while `--check` exits 0 and both fleet gates regenerate with the same walker (F024); the three shared doctrine files project as no typed resource and are reachable only through prose, with the shared-control list excluding them (F025). |
| D3 Traceability, D1 Correctness | CONDITIONAL | 3 | Angle 13: 1 P1 + 1 P2. Two hubs state opposite preamble policies and the third states different content; every array violates the field's scalar contract; the bound compiler never reads it and live policy snapshots carry no preamble at all (F026). The improvement lanes' identical 61-leaf sets are a real defect against the generator's N-to-1 contract but break no consumer (F027). |
| D3 Traceability, D4 Maintainability | FAIL (release-blocking) | 4 | Angle 14: 1 P0 + 4 P2. All three hypothesis arms confirmed: `ROUTER.md`'s three prose rosters omit `cli-hermes` while its machine block carries the mode (F028, P0 after re-adjudication — wave one's F007 downgrade path is unmet); hub `SKILL.md` counts contradict their registries in three places (F029); the catalogs claim three of eight executor kinds, twice with a duplicated kind name (F031). The sweep added protocol prose undercounting (F030) and the cli-* packet sibling freeze (F032). Machine layer — schema, adapter map, audit maps, compiled contracts, registries, live routing — is a complete positive control |
| D3 Traceability, D4 Maintainability | FAIL (release-blocking) | 5 | Angle 15: 6 P1 + 6 P2. The compiled-routing staleness is fleet-wide (F033: nine citations across three hubs), every wave-one stale reference re-reproduces at its live line (F034-F038), and the largest new class is post-deprecation residue — one removed lane still cited across all three hubs (F039: an enforcement guarantee, four commands that silently fall back, five consumer claims). Counts and cross-references drift wherever a human typed them instead of deriving them (F035, F036, F040-F044). |
<!-- /ANCHOR:completed-dimensions -->

---

## 7. RUNNING FINDINGS
<!-- ANCHOR:running-findings -->
- **P0 (Critical):** 1 active (F028)
- **P1 (Major):** 11 active (F021, F022, F024, F025, F026, F033, F034, F036, F037, F039, F040)
- **P2 (Minor):** 12 active (F023, F027, F029, F030, F031, F032, F035, F038, F041, F042, F043, F044)
- **Delta this iteration:** +0 P0, +6 P1, +6 P2
- **Final verdict:** FAIL (release-blocking): 24 active findings, 0 resolved, one active P0
- **Cumulative delta:** iterations 1-5 added 1 P0, 11 P1, 12 P2 with zero findings resolved
- **One rule landed for angle 11:** one release version per skill root, carried by SKILL.md and equal to the newest changelog; every other version-bearing artifact is either stamped to that release or renames its field to a schema-specific, validated value.
- **One rule landed for angle 12:** a file a surface SKILL.md claims it loads must be reachable through a typed artifact or a declared shared control — prose is not a delivery path.
- **One rule landed for angle 13:** a policy statement must have exactly one operative artifact behind it; a field no consumer reads is documentation debt, not policy.
- **One rule landed for angle 14:** a roster enumeration in prose is a claim about a machine authority; it either names all members of that authority or points to it. Hand-written counts and lists drift monotonically and no gate reads prose — the machine layer (schema, adapter map, registry, compiled contract) is where completeness actually lives.
- **One rule landed for angle 15:** a reference in a catalog, README or playbook is a claim about the tree at the cited line, and a count is the weakest and most frequently wrong form of that claim. A deprecation is not complete while any live document still routes through the removed artifact.

[Findings are tracked in `deep-review-findings-registry.json`. This section provides a running count summary updated after each iteration.]
<!-- /ANCHOR:running-findings -->

---

## 7A. WHAT WORKED

- **Diffing against the changelog (iteration 1).** The changelog is the only artifact family that must move on every release, so diffing each version field against the newest entry converted "values disagree" into "this value is the release and these are the defects". Reuse for any version-authority claim.
- **Using the mode packets as a fleet-wide control (iteration 1).** All seventeen mode packets pair SKILL.md with their newest changelog, which isolated the drift to hub-root artifact families without needing a fleet convention argument.
- **Computing the invisible-file set as a disk-minus-manifest difference (iteration 2).** The set difference produced the exact twelve misses, proved the defect is confined to `sk-code`, and bounded the blast radius that reading the walker alone could not.
- **Executing the gate command instead of reasoning about it (iteration 2).** `generate-leaf-manifest.cjs --check` exited 0 with a digest, which turned "the gates should catch it" into "the gates structurally cannot"; both gates share the same builder.
- **Loading the live policy snapshot rather than reading the compiler (iteration 3).** Reading the five per-hub compilers produced three different stories; loading the exact snapshot the runtime engine evaluates settled the question in one step: no hub's policy carries the field.
- **Reading the runtime layout selector before counting compilers (iteration 3).** The promoted layout binds one compiler for the whole closure, so the other per-hub compilers are mint-time tooling; without the selector the enforcement claim would have been wrong.
- **Building the authority table first, then censusing prose (iteration 4).** Reading `EXECUTOR_KINDS`, the adapter map, the audit maps and both compiled contracts before reading a single roster sentence turned every prose statement into a checkable claim and produced the positive-control finding: every machine surface is complete, every defect is in hand-authored prose.
- **Reading lists as lists, not greps (iteration 4).** Omissions are absent strings; only reading each enumeration end to end surfaced the missing seventh leaf bullet, the cli-opencode duplicated in cli-claude-code's sibling list, and the two catalog 'A, B, and A' substitutions.
- **Censusing a deprecation from its own delete list (iteration 5).** Reading spec 047's delete list and implementation summary first turned "find references to skill-benchmark" into a closed checklist: every deleted path was grepped in turn, and the surviving `sk-create-benchmark` storage tree was separated from the removed lane before filing.
- **Executing the cited check instead of trusting the README (iteration 5).** The legacy README's expected result was falsified by running the checker (exit 1, ten unresolved references), converting a plausibility concern into a bounded finding with a population.
- **Counting every way a count could be right (iteration 5).** Headings, links, disk files and the category table were counted independently; the runtime catalog's 55-claim lost to all four counts.

## 7B. WHAT FAILED

- **Treating `ROUTER.md`'s version as a compiled-routing generation (iteration 1, corrected before filing).** The field looks generator-owned, but the root-metadata contract lists `ROUTER.md` among the seven authored files and never regenerates it, so there is no generation for it to track; it stays inside F022 instead of becoming a separate finding. See `iterations/iteration-001.md` §Dead Ends.
- **Counting invisible files by reading the generator (iteration 2, corrected within the iteration).** The first pass inferred "some symlinks"; only the programmatic set difference produced the exact twelve and revealed that three surfaces cite the doctrine by filename in prose rather than as a link. Do not trust a read-only walker inference for a population count.
- **Treating the five rollout compilers as one pipeline (iteration 3, corrected within the iteration).** The directory holds per-hub compilers, but the runtime layout binds only the sk-code child's compiler; the field-consumption count needed the layout selector, not a directory grep.
- **Trying to settle the missing `if_cli_hermes` branch key from the tree (iteration 4, left unresolved deliberately).** No reader of `branch_on` / `if_cli_*` exists in `.opencode/bin` or `.opencode/skills`; the matcher lives outside the repository, so the question is carried in the ledger as `deferred` with its resolution path instead of being filed as a finding.
- **Trusting a raw extraction count as a census (iteration 5, corrected within the iteration).** The path sweep over ~1,100 documents produced 2,675 unresolved candidates, dominated by environment variables, template placeholders and command strings; only per-class hand triage separated the real reference classes. A first pass also miscategorized one deep-research feature doc as unlinked when the precise per-heading check showed 25/25 links resolve. Extraction produces candidates, never findings.
- **Assuming the storage-guide links died with the lane (iteration 5, corrected before filing).** The cli-* benchmark READMEs' skill-benchmark storage-guide links resolve against a surviving `sk-doc/sk-create-benchmark/references/skill-benchmark/` tree; the residue census excludes them.
- **Treating "the test files don't exist" as the right claim (iteration 5, narrowed before filing).** The coverage-graph test names F034 cites exist in stale copies under `barter/` and `.worktrees/`; the accurate claim is that they are absent at the cited path in the live tree.

---

## 9. EXHAUSTED APPROACHES (do not retry)
<!-- ANCHOR:exhausted-approaches -->
[Populated when a review approach has been tried from multiple angles without yielding new findings]
<!-- /ANCHOR:exhausted-approaches -->

---

## 9A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
<!-- ANCHOR:dimension-expansion -->
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: hub-root version fields across three hubs and all seventeen mode packets (angle 11); leaf-manifest generation and the twelve invisible symlink leaves (angle 12); the compiled runtime's preamble enforcement and the improvement-lane leaf-set identity (angle 13); every executor/mode roster statement across three hubs, four artifact classes, six command YAMLs and two compiled contracts (angle 14); every catalog, README and playbook reference, count and cited path under the three hubs, ~1,100 documents scanned (angle 15)
- Pivot lineage: none yet
- Remaining frontier: synthesis complete — the lane has run all five of its angles; remediation routes through `/speckit:plan`
<!-- /ANCHOR:dimension-expansion -->

---

## 11. RULED OUT DIRECTIONS

- **Catalog index integrity (iteration 5).** The deep-research (25/25), deep-ai-council (33/33), deep-review (29/29) and deep-improvement (19/19) catalog indexes reconcile; only the runtime catalog's prose count is wrong (F035). Wave one's fourth stale-generation site (the hub index `feature-catalog.md:71`) no longer carries the string.
- **Surviving storage-guide links (iteration 5).** The cli-* benchmark READMEs' skill-benchmark storage-guide links resolve against `sk-doc/sk-create-benchmark/references/skill-benchmark/`, which the deprecation did not remove.
- **Forward-referenced fixture (iteration 5).** `blocked-stop-reducer-surfacing.md:28` cites its fixture path "once T048 lands" — a prerequisite, not a current-state claim.
- **Scenario marker (iteration 5).** `mixed-marker-ambiguity.md`'s `preview-server.js` mention is a scenario prompt marker, not a reachability claim.
- **Aggregate ruled-out set across iterations 1-4** (from each delta's `searchCoverage.ruledOut`): mode-packet version drift, preamble-reaches-runtime, second invisible class, routing-capability breakage, identical-set consumer breakage, and the remaining classes recorded per iteration.

---

## 12. NEXT FOCUS
<!-- ANCHOR:next-focus -->
None — the lane is complete (5 of 5 iterations, synthesis done). Wave-two angles 16-20 belong to the sibling lane `wave2-glm`. Remediation of this lane's 24 active findings routes through `/speckit:plan` per `review-report.md`.
<!-- /ANCHOR:next-focus -->

---

## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- **Target pointers**: `.opencode/skills/{system-deep-loop,sk-code,cli-external-orchestration}/` hub roots (`SKILL.md`, `ROUTER.md`, `mode-registry.json`, `hub-router.json`, `leaf-manifest.json`, `graph-metadata.json`, `description.json`), their mode packets, the leaf-manifest generator at `.opencode/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs`, the compiled-routing layout at `.opencode/bin/lib/compiled-routing/`, the runtime executor roster at `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts`, and every catalog, README and playbook under the three hubs.
- **Behaviour claims to verify**: the phase spec's wave-two angle list (`spec.md:98-102`) is the authoritative statement of what each iteration must check; wave one's twenty `wave1-deepseek` findings are prior art this lane re-verifies, never assumes.
- **Reuse and conventions**: hubs follow a common seven-artifact shape; the leaf-manifest generator is the fleet's single manifest producer for both hubs and standalone packets; the compiled-routing layout generations are named with numeric directory prefixes.
- **Review risks and gaps**: no code graph and no semantic search were available to this lane; every claim rests on direct reads and exact-path searches. Convergence is off by configuration, so the lane's coverage is bounded by the angle list, not by a stop signal.

---

## 14. CROSS-REFERENCE STATUS
<!-- ANCHOR:cross-reference-status -->
[Alignment checks completed across core and overlay protocols]

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | partial | 5 | Angles 11-15 are each fully executed; every iteration ends partial because the reviewed artifacts cannot satisfy their own stated rosters, rules or references as written. |
| `checklist_evidence` | core | notApplicable | — | The phase spec carries no per-iteration checklist rows; its REQ rows are assessed at synthesis. |
| `feature_catalog_code` | overlay | partial | 5 | Angle 15 completed the cited-path, count and layout-generation sweep: nine stale generation citations across three hubs (F033), nine stale references in four classes (F034), one count shortfall (F035), one renamed extension (F043) and one stale command path (F041). Index integrity itself is sound. |
| `playbook_capability` | overlay | partial | 5 | Every playbook command and flag resolves; the deep-review playbook's test cross-reference is a false absence claim (F037), the council's names five renamed files (F040), and the legacy README's validation block fails as written (F038). |
<!-- /ANCHOR:cross-reference-status -->

---

## 15. FILES UNDER REVIEW
<!-- ANCHOR:files-under-review -->
[Per-file coverage state table -- populated as iterations read files]

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| `.opencode/skills/system-deep-loop/{SKILL.md,ROUTER.md,mode-registry.json,hub-router.json,description.json}` | D3, D4 | 1 | 2 P1, 1 P2 | partial |
| `.opencode/skills/sk-code/{SKILL.md,ROUTER.md,mode-registry.json,hub-router.json,description.json}` | D3 | 1 | ref F022 | partial |
| `.opencode/skills/cli-external-orchestration/{SKILL.md,ROUTER.md,mode-registry.json,hub-router.json,description.json}` | D3 | 1 | ref F022 | partial |
| All 17 mode-packet `SKILL.md` + `changelog/` roots | D3 | 1 | 0 | complete |
| `.opencode/skills/sk-doc/sk-create-skill/references/parent-skill/{parent-hub-router-schema,parent-skills-nested-packets}.md` | D4 | 1 | 1 P2 | partial |
| `.opencode/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs` + `lib/skill-root-metadata-contract.cjs` | D3 | 1 | ref F023 | partial |
| `.opencode/skills/sk-doc/sk-create-skill/scripts/{generate-leaf-manifest,ci-leaf-manifest-freshness}.cjs` | D3, D4 | 2 | 1 P1 | partial |
| `.opencode/skills/sk-code/{sk-code-webflow,sk-code-opencode,sk-code-mobile-cli,sk-code-obsidian}/references/workflow-{implement,debug,verify}.md` | D3 | 2 | 1 P1 | partial |
| `.opencode/skills/sk-code/{shared/references/workflow-*.md,SKILL.md,ROUTER.md,shared/README.md}` | D3 | 2 | 1 P1 | partial |
| `.opencode/skills/{system-deep-loop,cli-external-orchestration}/leaf-manifest.json` | D3 | 2 | 0 | complete |
| `.opencode/skills/{system-deep-loop,sk-code,cli-external-orchestration}/{hub-router.json,ROUTER.md}` | D3, D1 | 3 | 1 P1, ref F027 | partial |
| `.opencode/bin/lib/compiled-routing/009-parent-hub-rollout/*/lib/registry-compiler.cjs` + `harness/build-artifacts.cjs` | D1, D3 | 3 | ref F026 | partial |
| `.opencode/bin/lib/compiled-routing/014-runtime-engine/lib/{resolve,compiled-route}.cjs` + `.opencode/bin/compiled-route.cjs` | D1 | 3 | ref F026 | complete |
| `.opencode/skills/system-deep-loop/leaf-manifest.json` (improvement lanes) | D4 | 3 | 1 P2 | partial |
| `.opencode/skills/cli-external-orchestration/{ROUTER.md,SKILL.md,README.md,mode-registry.json,description.json}` | D3, D4 | 4 | 1 P1, 1 P2 | partial |
| `.opencode/skills/system-deep-loop/{SKILL.md,description.json,mode-registry.json}` (count statements) | D4 | 4 | 1 P2 | partial |
| `.opencode/skills/cli-external-orchestration/cli-*/{SKILL.md,references/*.md}` (sibling rosters) | D4 | 4 | 1 P2 | partial |
| `.opencode/skills/system-deep-loop/{deep-review,deep-research,deep-ai-council}/**` (executor-kind prose) | D3 | 4 | 1 P2 | partial |
| `.opencode/skills/system-deep-loop/runtime/{lib/deep-loop/executor-config.ts,lib/deep-loop/executor-audit.ts,scripts/fanout-run.cjs}` | D3 | 4 | 0 (positive control) | complete |
| `.opencode/skills/system-deep-loop/{deep-review,runtime,deep-improvement}/feature-catalog/` (executor-kind claims) | D3 | 4 | 1 P2 | partial |
| `.opencode/commands/deep/assets/*.yaml` + `compiled/*.contract.md` (roster statements, branch sets) | D3 | 4 | ref F030, 1 deferred | partial |
| `.opencode/skills/{system-deep-loop,sk-code,cli-external-orchestration}/feature-catalog/compiled-routing-and-legacy-fallback/*.md` | D3 | 5 | 1 P1 | partial |
| `.opencode/skills/system-deep-loop/{runtime/feature-catalog/**,deep-research/feature-catalog/**,deep-review/feature-catalog/**}` (reference sweep) | D3 | 5 | 1 P1, 1 P2 | partial |
| `.opencode/skills/system-deep-loop/{deep-review,deep-ai-council}/manual-testing-playbook/**` (test cross-references) | D3 | 5 | 2 P1 | partial |
| `.opencode/commands/deep/assets/{compiled,legacy}/README.md` + `commands/scripts/validate-command-references.cjs` | D3 | 5 | 1 P1, 1 P2 | partial |
| skill-benchmark deprecation residue census across three hubs (spec 047 surfaces) | D3 | 5 | 1 P1 | partial |
| `.opencode/skills/sk-code/{sk-code-obsidian,sk-code-mobile-cli}/README.md` | D4 | 5 | 1 P2 | partial |
| `.opencode/skills/system-deep-loop/{deep-ai-council/feature-catalog/**,deep-improvement/manual-testing-playbook/agent-discipline-stress-tests/**}` | D4 | 5 | 2 P2 | partial |
<!-- /ANCHOR:files-under-review -->

---

## 16. REVIEW BOUNDARIES
<!-- ANCHOR:review-boundaries -->
- Max iterations: 5
- Convergence threshold: 0.1
- Convergence mode: off (telemetry only)
- Stop policy: max-iterations
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-wave2-deepseek-1789475514883-p58bmd, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[feature_catalog_code, playbook_capability]
- Started: 2026-09-15T12:32:10Z
<!-- /ANCHOR:review-boundaries -->
