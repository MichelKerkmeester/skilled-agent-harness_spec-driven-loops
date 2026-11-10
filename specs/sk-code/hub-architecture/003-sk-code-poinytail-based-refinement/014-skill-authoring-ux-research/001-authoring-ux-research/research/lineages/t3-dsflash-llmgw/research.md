# Skill Authoring UX Research — Synthesis

Lineage: t3-dsflash-llmgw | Executor: cli-pi (deepseek-v4.1-flash, max) | Iterations: 10 of 10 | Stop reason: maxIterationsReached with all key questions answered (a convergence-threshold stop was never reached; each iteration opened new surface until iteration 8).

Scope: sk-create-skill and system-skill-advisor, their generators, validators and checks, plus the repository hook/CI/doctor planes that carry their drift detection. Audiences: repository maintainers and external users who author skills in their own repositories.

Method: every claim carries a `[SOURCE: path:line]` tag that was read this run, and every finding is labeled Verified (the line or command was read/run here) or Inferred. Two live defects were found and left untouched (research-only phase): the router intent-signal carry fails for cli-classifier, and the compiled skill graph is stale.

## 1. Root Causes

### E1 — Generated artifacts drift from their sources and must be re-minted by hand

Evidence status: Verified

Root cause: each artifact is a stored projection of an authored source, and its re-mint is triggered only by a check that runs outside the author's edit loop. The compiler's docs say the canonical reindex is "operator-gated" [SOURCE: .skilled/commands/doctor/scripts/skill-graph-freshness.cjs:7-17]. The three live planes split the artifacts into three states: (a) already prevented at commit time — compiled-route manifests for staged routing inputs, Hermes copies, spec metadata [SOURCE: .skilled/scripts/git-hooks/pre-commit:352-549] [SOURCE: .skilled/scripts/git-hooks/pre-commit:259-267]; (b) check exists but the trigger misses the author — leaf-manifest, whose inputs (references/, assets/) are absent from the pre-commit trigger list [SOURCE: .skilled/scripts/git-hooks/pre-commit:439-449]; router intent signals, whose generator check fails today with no routine caller [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/generate-router-intent-signals.cjs:1-25]; (c) healed only after merge — the trigger index, rebuilt by CI after push [SOURCE: .github/workflows/trigger-index-rebuild.yml:1-10]. The prior __pycache__ fix removed a false-drift producer in the leaf walk but did not change mint timing [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/007-follow-up-fixes/002-leaf-generator-ignores/implementation-summary.md:48].

Why the UX lets it happen: the author is editing a reference or asset file inside a skill; nothing on that write path re-mints, the generator's staleness message names --write but only appears when someone runs the check [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:539-551], and the repo's auto-re-mint precedent covers sibling families only. The author would have to know which of the six generated families their edit touches, and to run the per-family check before every commit; the manual re-mint duty is visible in the epic's own orchestrator logs ("re-mints with archive copies, leaf manifest, Hermes (9 copies), ... trigger index") [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/goal.md:119].

Smallest fix, ranked by reversal cost:
1. Build nothing — fails: docs already say "regenerate rather than hand-edit" [SOURCE: .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:232], and the drift still happened; the failure mode is timing, not knowledge.
2. Change a value — fails: no value governs when a mint runs.
3. Extend the existing pre-commit function in place (the working move): add the staged skill's leaf roots (references/, assets/) to the route-remint trigger and re-mint leaf-manifest.json through the existing scoped generator, staging and confirming it exactly as the route manifests are [SOURCE: .skilled/scripts/git-hooks/pre-commit:352-549]. For the trigger index, add one gateable call of the existing --check to the routing-drift CI job beside the leaf gate [SOURCE: .github/workflows/routing-registry-drift.yml:196]; for router intent signals, wire the existing check the same way (today: RESULT FAILED).
4. A new standalone hook file — fails at (3): the hook framework and its auto-fix precedent already exist, so a new file buys nothing.
5. A generic derived-artifact registry abstraction — fails until a sixth family appears; each family's check already exists and needs only a trigger.

Proof: node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-leaf-manifest-freshness.cjs (today: checked=14 fresh=14 failed=0), node .skilled/bin/compiled-route-guard.cjs (today: all hubs fresh), node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-router-intent-signals.cjs --check (today: RESULT FAILED, cli-classifier missing 23 phrases), node .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs --check (today: exit 1, 5 stale documents, all from this packet).

Audience: maintainers get the commit-time auto-mint and CI gates; external authors get the shipped generators, their fix-naming messages, and — the gap found in iteration 8 — one missing validator entry for standalone leaf freshness [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/validate_skill_package.py:247-288].

### E2 — One hub version in six files plus a changelog number that can collide at merge

Evidence status: Verified

Root cause: the version is a hand-allocated value stored six times, and no single writer moves it. SKILL.md is the release authority; ROUTER.md, description.json, hub-router.json and mode-registry.json must equal it (13a), README should (13c), and the newest changelog entry must equal it (13b) [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1783-1891]. The only writer of the changelog filename computes the next version from the local checkout's own v*.md list and resolves collisions locally by incrementing BUILD [SOURCE: .skilled/commands/create/assets/create-changelog-auto.yaml:486-512], then writes only the changelog file [SOURCE: .skilled/commands/create/assets/create-changelog-auto.yaml:636-652]; it never writes the carriers. The author guidance says "Update frontmatter version field", one field [SOURCE: .skilled/skills/sk-doc/sk-create-skill/references/skill/examples-and-maintenance.md:179-185]. Parity is doctor-time only — the pre-commit gates do not run 13a-13d [SOURCE: .skilled/scripts/git-hooks/pre-commit:191-700] — and README drift is deliberately warn-only on the four hubs that have it [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1804-1821]. Parallel branches allocate from the same base list, so the same next number is chosen independently; the packet records the outcome as "a changelog whose number collided at merge" [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/014-skill-authoring-ux-research/spec.md:62].

Why the UX lets it happen: the author bumps the frontmatter they can see, in an editor, with guidance naming one file; five followers and a filename must move in lockstep; nothing runs parity until a doctor command (or the external validator) is invoked. Live today: sk-doc carries README 2.2.0.77 against SKILL.md 2.3.0.0, warn-only (ran parent-skill-check; exit 0).

Smallest fix, ranked by reversal cost:
1. Build nothing — fails: the guidance already exists and the drift persists.
2. Change the values first — empty README_VERSION_WARN_ONLY once those four READMEs are repaired so the rule has teeth [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1804].
3. Extend the existing changelog command in place (the working move): allocate the next version against the shared ref, not only the working tree, and after writing the changelog file write the same four-part version into the component's SKILL.md and its followers. One command then performs the whole bump and most parallel-branch collisions disappear [SOURCE: .skilled/commands/create/assets/create-changelog-auto.yaml:486-512].
4. A new standalone bump script — fails at (3): the command already resolves the component and writes the versioned file.
5. A version registry with locks or derive-at-read carriers — new abstraction/dependency; unearned while the command exists.

Proof: re-run node .skilled/commands/doctor/scripts/parent-skill-check.cjs on the bumped hub and expect 13a/13b/13c/13d all PASS; run the changelog command from two worktrees against the same base and expect the second to take the next free number.

Audience: maintainers (hook safety net plus fleet parity); external authors (the command ships in sk-create-skill; the doctor does not, so the command is their whole fix).

### E3 — Advisor routing: right intent, wrong hub; right hub, unserved signals

Evidence status: Verified

Root cause, part one — split vocabularies. The compiled graph's signals are built only from graph-metadata.json intent_signals plus derived affordance triggers [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_graph_compiler.py:1009-1016]. description.json has no consumer in the advisor runtime — a bounded search finds only its README and tests — so keyword additions there cannot move a route, which the round-two child recorded in its own limitations ("The sk-code graph does not list description.json as a source, so the new keywords do not reach the advisor") [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/008-round-two-recommendations/001-restraint-routing/implementation-summary.md:121]. The file-path pull is a bounded keyword lane: derived key_files/source_docs become derivedKeywords at max contribution 0.35 (derived_generated), against intent_signals at 1.0 (explicit_author) [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts:749-763] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/derived/trust-lanes.ts:40-51]. No counter-signal lane exists anywhere (negative_keywords has zero occurrences), so the battery's own proposal for stopping the N1 doc prompt has no implementation [SOURCE: .skilled/skills/sk-code/manual-testing-playbook/skill-advisor-integration/advisor-probe-battery.md:115-117]. Ties between surfaces are decided by the compiled routerPolicy.tieBreak, and generic words decide it; the shipped mitigation is a caller-supplied surface hint applied at serve time [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/008-session-aware-tie-break/plan.md:57-58].

Root cause, part two — the reindex gap. The advisor routes off three representations of the graph (compiled JSON, SQLite, on-disk metadata) and the canonical reindex is operator-gated; the freshness panel that diffs them is report-only and always exits 0 [SOURCE: .skilled/commands/doctor/scripts/skill-graph-freshness.cjs:7-17]. Live today: the compiled graph is STALE (generated 2026-10-02 against a newest source stamp of 2026-10-04, cli-classifier), so an author's intent-signal edit does not reach the served scorer until an operator reindexes. The battery measures the outcome and fails its own contract: 13 of 17 positives, 2 of 5 negatives, unchanged before and after the tie-break change [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/008-session-aware-tie-break/implementation-summary.md:121]; PASS requires at least 14 of 17 and zero negatives [SOURCE: .skilled/skills/sk-code/manual-testing-playbook/skill-advisor-integration/advisor-probe-battery.md:55-61].

Why the UX lets it happen: the author edits the file that looks like the keyword registry (description.json) or the router document; the file the scorer reads is graph-metadata.json, and even that edit waits behind two operator-gated reindexes. Nothing at authoring time says which vocabulary is consumed. The reach prober that could detect "landed but not served" exists but runs only as a doctor route and calls the advisor per phrase [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs:29-41].

Smallest fix, ranked by reversal cost:
1. Build nothing — fails: the battery failure is measured and reproducible.
2. Change values first — add intent signals to the expected winners of N1/N5 (sk-doc for doc edits, deep-research for research) before inventing an anti-signal lane; anti-signals are a new scorer lane and must land in the served implementation.
3. Extend in place (the working moves): flip the freshness panel's always-exit-0 to a gateable exit and add its call plus the intent-signals check to the existing routing-drift CI job [SOURCE: .github/workflows/routing-registry-drift.yml:187-197]; extend the carry generator to source description.json keywords into graph-metadata intent_signals so the author's obvious file becomes effective [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/generate-router-intent-signals.cjs:1-25]; name the reindex command in every failure that needs one.
4. New functions/abstractions — a third vocabulary linter fails at (3): 5k and the reach prober already cover coherence and reach [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1185-1256]; hook-driven auto-reindex contradicts the deliberate operator-gated design and adds a write-heavy step to every commit.

Proof: the three commands in E1's proof set plus the battery replay (node specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/008-session-aware-tie-break/scratch/advisor-battery.cjs, recorded 13/17 and 2/5). A fixed state reads 14+/17, 0/5, STALE-free panel, and a passing intent-signals check.

Audience: maintainers (gate plus reindex visibility); external authors (the carry generator and messages ship; the toolchain doctor does not).

### E4 — The compiled-route surface hint no automated caller passes

Evidence status: Verified

Root cause: the round-four tie-break added --surface-hint to the front door [SOURCE: .skilled/bin/compiled-route.cjs:36-37] and documented it as a caller duty [SOURCE: .skilled/skills/sk-code/SKILL.md:63], but advisor_recommend — the only automated caller — spawns the front door with just --hub and --prompt-stdin [SOURCE: .skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:360-377], and its options schema is closed with no surface key [SOURCE: .skilled/skills/system-skill-advisor/runtime/tools/advisor-recommend.ts:11-25]. A string count for the flag in the caller returns zero. The mechanism therefore cannot fire where the advisor routes.

Why the UX lets it happen: the flag's author was in the front door and the hub docs; to close the loop they would have to know that the advisor handler is itself a caller of the door and that its option object is validated and versioned. The CLI already carries both idioms the fix needs — a front-door source capability probe [SOURCE: .skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:350-359] and a retry that strips an option a too-old daemon rejects [SOURCE: .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1497-1510].

Smallest fix, ranked by reversal cost:
1. Build nothing — fails: the documented behavior never occurs on the advisor path.
2. Change a value — fails: no value carries the surface.
3. Extend in place (the working move): add surfaceHint to the options schema, thread it into the spawn as --surface-hint when present, reuse the existing unknown-option retry, and source the value from the existing stack-detection rules named in the docs — no new detection logic.
4. A new auto-detection function inside the advisor — follows if the hook caller cannot supply the surface; costlier, so second.
5. A session-state service — new dependency; fails the cheaper moves.

Proof: an advisor-level test asserting the front-door argv receives the flag (today the static count is zero), plus an end-to-end hinted tie leading with the hinted surface while the unhinted order is unchanged. The battery cannot prove E4 — it drives the Python advisor, which never calls the door [SOURCE: .skilled/skills/sk-code/manual-testing-playbook/skill-advisor-integration/advisor-probe-battery.md:82-86].

Audience: maintainers and any consumer of the advisor; the hint path ships with the advisor runtime.

### E5 — Rules that gate everywhere except where the author is

Evidence status: Verified

Root cause: the E5 rule families live on a third check plane — the per-hub parent-skill-check (5e, 5i, 13a-13d, 10b) and the skill-local router-sync umbrella — while the two per-commit planes cover other families. parent-skill-check runs only in the doctor route and the routing-drift CI job [SOURCE: .skilled/commands/doctor/assets/doctor-parent-skill.yaml:5] [SOURCE: .github/workflows/routing-registry-drift.yml:180-186]; the umbrella has no workflow or hook caller at all, only the skill's own docs [SOURCE: .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh:1-33]. Severity semantics mean 5e/5i/13b/13d are hard by default through softFail, while 13c and selected 5k legs are warn-only on listed hubs [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:186-190] [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1075-1087] [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1142-1156].

Why the UX lets it happen: the author edits a hub file, the commit gate re-mints route manifests but asks none of the structural questions, and the answer arrives from a doctor run or CI after the change has landed. The cost is recorded: nine orphan docs and a tenth passed every gate while leg 1b was held back [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/009-round-two-follow-ups/001-router-orphan-docs/implementation-summary.md:52]. One hub's checker measures about two seconds, cheap enough for a scoped commit-time call (measured this run).

Smallest fix, ranked by reversal cost:
1. Build nothing — fails: 13c is live warn-only drift today.
2. Change values first — empty README_VERSION_WARN_ONLY and the 5k warn legs once those hubs are repaired [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1804-1821].
3. Extend the existing pre-commit staged-hub dispatch in place (the working move): when a hub file is staged, call the scoped parent-skill-check for that hub and the sk-code umbrella for staged sk-code files, blocking on hard failures only — the route-remint block already computes exactly that hub-from-staged-path set [SOURCE: .skilled/scripts/git-hooks/pre-commit:439-549].
4. A new aggregated authoring-gate script — fails at (3): the hook already owns the dispatch.
5. CI wiring alone — a one-line change but leaves the author paying an amend; keep it as step two.

Proof: node .skilled/commands/doctor/scripts/parent-skill-check.cjs <hub> and bash .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh by hand today; after the change, stage a deliberately broken tieBreak (a duplicate mode) on a scratch branch and confirm the commit blocks the way the route-remint gate does.

Audience: maintainers; external hub authors already get these rules through validate_skill_package.py's parent-skill-check call [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/validate_skill_package.py:271-288], and standalone external users are missing only the leaf-freshness entry.

### Cross-class pattern

Evidence status: Inferred

All five classes reduce to one mechanism: a value that should be derived from the author's edit is stored, and its re-mint is triggered by a check that runs on a different surface or cadence than the edit. Ten instances were verified (leaf manifest, route manifests, authored copies, Hermes copies, trigger index, compiled graph, SQLite graph, intent-signal carry, five version carriers plus changelog name, router prose inventory). A lexical split compounds it: the author-visible vocabularies are not always the consumed ones, and counter-signals have no lane. The smallest universal change is to attach each existing check to a surface the author already touches — the commit hook, the package validator, or the generator's own message — and never to build a new gate. That finding is Inferred because it generalizes verified mechanisms rather than a single measured line.

## 2. Rejected Ideas

Evidence status: Inferred (judgment over verified mechanisms)

Each rejection names the reversal-cost rung it failed:

- Pre-commit hook as a new file (E1): the hook framework and its auto-fix precedent exist; one trigger edit beats a new file [SOURCE: .skilled/scripts/git-hooks/pre-commit:352-549].
- Derive the leaf manifest on read: it is the typed (workflowMode, leafResourceId) keying surface; runtime derivation moves cost into the hot path for a per-commit event.
- Fleet-wide re-mint per commit: the leaf gate measures ~9.5s for 14 manifests; scope to the staged skill.
- Docs-only fixes anywhere: docs already carry the contract and the drift persisted; the failure is timing, not knowledge [SOURCE: .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:232].
- Running write-mode generators inside this lineage: would write outside the lineage's authority; recorded as defects with repair commands instead.
- Treating the CI post-merge trigger-index heal as sufficient for branch work: retrieval reads the committed index, so branch docs stay invisible until CI lands [SOURCE: .github/workflows/trigger-index-rebuild.yml:1-10].
- A per-document index daemon/watcher: new dependency for an event the CI heal plus a commit-time check can cover.
- A generic derived-artifact registry abstraction: each family's check exists; a registry earns its keep only when a sixth family cannot reuse the pattern.
- A version registry with allocation locks or derive-at-read carriers: the change-relevant allocation can be picked from the shared ref inside the existing command; locks are coordination machinery without a measured collision rate [SOURCE: .skilled/commands/create/assets/create-changelog-auto.yaml:486-512].
- A standalone bump script: the changelog command already resolves the component and writes the versioned file.
- A CI-only parity check for E2: CI sees the merged result after the author is gone; the commit-time surface is where the hook precedent lives.
- Hook-driven automatic SQLite reindex (E3): contradicts the deliberate operator-gated design recorded in the panel [SOURCE: .skilled/commands/doctor/scripts/skill-graph-freshness.cjs:7-17]; a gate plus a named command detects the same gap for a fraction of the cost.
- A third vocabulary linter: 5k and the reach prober already cover coherence and reach [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1185-1256].
- The battery as E4 proof: it drives the Python advisor, which never calls the compiled-route door [SOURCE: .skilled/skills/sk-code/manual-testing-playbook/skill-advisor-integration/advisor-probe-battery.md:82-86].
- Inferring the surface hint from the prompt, or passing a default constant: that is the tie the hint exists to break; an unchosen surface must stay the documented fallback.
- A new unified external authoring gate: validate_skill_package.py is already that command for a package; a second one splits the surface.
- The advisor daemon as a prerequisite for external single-repo authors: it is toolchain infrastructure; the shipped carry generator plus docs covers the authoring-time side.
- Claiming composite convergence for this run: the threshold math never dropped under 0.05 while new surfaces remained; the honest stop is the cap with questions answered.

## 3. Proposed Implementation Phases

Evidence status: Inferred (proposal, ranked by the requested metric: error classes prevented per unit of cost)

| Rank | Phase | Classes prevented | Files changed (all existing) | Check that proves it | Audience |
|------|-------|-------------------|------------------------------|----------------------|----------|
| 1 | Commit-time extension for the staged hub | E1 (leaf plus trigger cadence) and E5 (structural and router rules) — 2 classes for 1 file | .skilled/scripts/git-hooks/pre-commit (extend the staged-hub dispatch: leaf-roots trigger, scoped parent-skill-check, sk-code umbrella) | ci-leaf-manifest-freshness.cjs (14/14/0), parent-skill-check.cjs (hard rules), run-all-drift-guards.sh (single exit) | Both |
| 2 | Package-validator entry for standalone roots | E1 and E2 for external standalone users — 2 audience-classes for 1 file | .skilled/skills/sk-doc/sk-create-skill/scripts/validate_skill_package.py (one more check entry running the shipped leaf generator --check) | validate_skill_package.py on a stale fixture (exit 1) | External authors |
| 3 | One-command version bump | E2 — 1 class for 2 files | .skilled/commands/create/assets/create-changelog-auto.yaml (allocate against the shared ref; write all carriers) and .skilled/commands/doctor/scripts/parent-skill-check.cjs (empty the README warn set after repair) | parent-skill-check.cjs 13a-13d on the bumped hub (all PASS) | Both |
| 4 | Surface-hint pass-through | E4 — 1 class for 2 files | .skilled/skills/system-skill-advisor/runtime/tools/advisor-recommend.ts (schema) and runtime/handlers/advisor-recommend.ts (spawn argv plus capability probe) | new advisor-level argv test; hinted end-to-end order check | Both |
| 5 | Advisor vocabulary and reindex visibility | E3 — 1 class for 3 files | .skilled/commands/doctor/scripts/skill-graph-freshness.cjs (gateable exit), .github/workflows/routing-registry-drift.yml (call it plus the intent-signals check), .skilled/skills/sk-doc/sk-create-skill/scripts/generate-router-intent-signals.cjs (source description.json keywords) | intent-signals check (today FAILED), freshness panel (today STALE COMPILED), battery replay (14+/17, 0/5) | Both |

Notes: rank 5 addresses the only live failing measurement in the set; it ranks last by the strict classes-per-file metric but should be scheduled first if impact outranks the metric. Rank 1 is the best first build because it converts two classes from "checked late" to "fixed at commit" with one file. Every phase extends an existing file; no phase adds a new artifact family, command, or dependency. The proof for rank 2 requires constructing one stale standalone fixture; the rest run against the repository as it stands.
