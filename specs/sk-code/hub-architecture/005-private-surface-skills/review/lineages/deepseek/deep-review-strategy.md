---
title: Deep Review Strategy - sk-code/013-private-surface-skills
description: "Persistent review state for the private-surface-skills phase parent: dimension coverage, findings, ruled-out directions and next focus."
trigger_phrases:
  - "deep review strategy 013"
  - "private surface skills review state"
importance_tier: normal
contextType: planning
---

# Deep Review Strategy - Session Tracking

Runtime state for the fan-out lineage `deepseek`. Tracks review progress across iterations.

## 1. OVERVIEW

### Purpose

The persistent brain for this lineage: which dimensions remain, what was found (P0/P1/P2), what review approaches were exhausted, and where to focus next. Read at every iteration and refreshed by the reducer.

### Usage

- **Init:** populated from `deep-review-config.json` and the bounded context snapshot below.
- **Per iteration:** the executor reads Next Focus, reviews the assigned dimension, records findings, marks the dimension complete, and sets a new Next Focus.
- **Mutability:** mutable. Machine-owned blocks are wrapped in ownership markers; commentary lives outside them.

---

## 2. TOPIC

Review of the phase-parent packet `specs/sk-code/013-private-surface-skills` (Level 2, five phase children), which moved the Webflow and Obsidian surfaces out of the shipped `sk-code` hub into gitignored `local-*` symlinks backed by two external repositories.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS

- Re-running the packet's own verification suites (`validate.sh --strict`, vitest, the pre-commit harness): this lineage must not write outside its artifact directory, so suite execution is out of scope and every claim about a suite is read from source or the packet's record.
- Implementing fixes. This is observation-only; remediation belongs to a follow-on planning packet.
- Re-auditing the two external repositories (`anobel.com`, `obnotion_notion-cloned-into-obsidian`), which are not part of this checkout.
- Re-opening the frozen decisions D1-D7. Drift is reported; the decision text is not re-litigated.

---

## 5. STOP CONDITIONS

- Hard ceiling: `maxIterations = 5` (`stopPolicy: max-iterations`), so convergence is telemetry only and the run always runs the full breadth.
- Manual stop only through the operator's pause sentinel, which this lineage does not create.

---

<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

<!-- /ANCHOR:completed-dimensions -->
<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 4
- P2 (Suggestions): 13
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED

[First iteration -- populated after iteration 1 completes]

---

## 9. WHAT FAILED

[First iteration -- populated after iteration 1 completes]

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **D4 containment (Python mirror).** `skill_advisor_runtime.py:155-205` is a faithful port: `os.path.relpath` containment with the same `os.curdir`/`os.pardir`/`isabs` tests, `os.path.realpath` on both sides, `allow_self` only for declared roots, and lazy root resolution once per scan. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **D4 containment (Python mirror).** `skill_advisor_runtime.py:155-205` is a faithful port: `os.path.relpath` containment with the same `os.curdir`/`os.pardir`/`isabs` tests, `os.path.realpath` on both sides, `allow_self` only for declared roots, and lazy root resolution once per scan.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **D4 containment (Python mirror).** `skill_advisor_runtime.py:155-205` is a faithful port: `os.path.relpath` containment with the same `os.curdir`/`os.pardir`/`isabs` tests, `os.path.realpath` on both sides, `allow_self` only for declared roots, and lazy root resolution once per scan.

### **D4 containment (TypeScript).** `private-skill-target.ts:21-58` resolves `realpathSync` for every trusted root and for the target, tests containment with `path.relative` (rejecting `..`, `..${sep}` and absolute results), requires the target to be a directory, and sets `allowSelf: false` for the skills root so a link cannot re-enter the tree. With `SPECKIT_PRIVATE_SKILL_ROOTS` unset, only the skills root is trusted and no external link resolves — fail-closed. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **D4 containment (TypeScript).** `private-skill-target.ts:21-58` resolves `realpathSync` for every trusted root and for the target, tests containment with `path.relative` (rejecting `..`, `..${sep}` and absolute results), requires the target to be a directory, and sets `allowSelf: false` for the skills root so a link cannot re-enter the tree. With `SPECKIT_PRIVATE_SKILL_ROOTS` unset, only the skills root is trusted and no external link resolves — fail-closed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **D4 containment (TypeScript).** `private-skill-target.ts:21-58` resolves `realpathSync` for every trusted root and for the target, tests containment with `path.relative` (rejecting `..`, `..${sep}` and absolute results), requires the target to be a directory, and sets `allowSelf: false` for the skills root so a link cannot re-enter the tree. With `SPECKIT_PRIVATE_SKILL_ROOTS` unset, only the skills root is trusted and no external link resolves — fail-closed.

### **D5 tracked writers.** Every writer that can reach a tracked artifact skips a `local-*` name before reading it: `skill_graph_compiler.py:203-209` (skip by name, then skip any other top-level link), `sync-skills-hermes.cjs:59` (mirror), `derive-command-bridges.cjs:83` (bridge file), `metadata-loader.ts:38` (cross-skill edges applied into tracked metadata). The committed `skill-graph.json` contains no `local-` entry. The trigger-index walker never follows a directory symlink (`corpus.mjs:287-301`), so it needs no name rule and still cannot index a private skill. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **D5 tracked writers.** Every writer that can reach a tracked artifact skips a `local-*` name before reading it: `skill_graph_compiler.py:203-209` (skip by name, then skip any other top-level link), `sync-skills-hermes.cjs:59` (mirror), `derive-command-bridges.cjs:83` (bridge file), `metadata-loader.ts:38` (cross-skill edges applied into tracked metadata). The committed `skill-graph.json` contains no `local-` entry. The trigger-index walker never follows a directory symlink (`corpus.mjs:287-301`), so it needs no name rule and still cannot index a private skill.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **D5 tracked writers.** Every writer that can reach a tracked artifact skips a `local-*` name before reading it: `skill_graph_compiler.py:203-209` (skip by name, then skip any other top-level link), `sync-skills-hermes.cjs:59` (mirror), `derive-command-bridges.cjs:83` (bridge file), `metadata-loader.ts:38` (cross-skill edges applied into tracked metadata). The committed `skill-graph.json` contains no `local-` entry. The trigger-index walker never follows a directory symlink (`corpus.mjs:287-301`), so it needs no name rule and still cannot index a private skill.

### **Edge applier path escape.** `apply-graph-metadata-patch.ts:36-41` uses `resolve()` + `startsWith(root + sep)` + `basename === 'graph-metadata.json'`, which is sound against traversal. It does not use `realpath`, so a symlinked `graph-metadata.json` inside a tracked skill could write through the link; that applier predates this packet and sits outside D6's boundary (generic skill plumbing, not a surface consumer), so it is recorded here as an observation rather than a finding against this packet. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Edge applier path escape.** `apply-graph-metadata-patch.ts:36-41` uses `resolve()` + `startsWith(root + sep)` + `basename === 'graph-metadata.json'`, which is sound against traversal. It does not use `realpath`, so a symlinked `graph-metadata.json` inside a tracked skill could write through the link; that applier predates this packet and sits outside D6's boundary (generic skill plumbing, not a surface consumer), so it is recorded here as an observation rather than a finding against this packet.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Edge applier path escape.** `apply-graph-metadata-patch.ts:36-41` uses `resolve()` + `startsWith(root + sep)` + `basename === 'graph-metadata.json'`, which is sound against traversal. It does not use `realpath`, so a symlinked `graph-metadata.json` inside a tracked skill could write through the link; that applier predates this packet and sits outside D6's boundary (generic skill plumbing, not a surface consumer), so it is recorded here as an observation rather than a finding against this packet.

### **Guard coverage.** `pre-commit:105` matches `^\.(skilled|opencode|claude|pi|devin|hermes|codex|cursor)/skills/local-[^/]+(/|$)` — eight roots, staged `ACMR` paths, NUL-separated names, no bypass variable. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Guard coverage.** `pre-commit:105` matches `^\.(skilled|opencode|claude|pi|devin|hermes|codex|cursor)/skills/local-[^/]+(/|$)` — eight roots, staged `ACMR` paths, NUL-separated names, no bypass variable.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Guard coverage.** `pre-commit:105` matches `^\.(skilled|opencode|claude|pi|devin|hermes|codex|cursor)/skills/local-[^/]+(/|$)` — eight roots, staged `ACMR` paths, NUL-separated names, no bypass variable.

### **Home path in tracked files.** 512 tracked files name the operator's home directory, all pre-existing benchmark reports, launchagents and specs excluded by D6. This packet introduced none. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Home path in tracked files.** 512 tracked files name the operator's home directory, all pre-existing benchmark reports, launchagents and specs excluded by D6. This packet introduced none.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Home path in tracked files.** 512 tracked files name the operator's home directory, all pre-existing benchmark reports, launchagents and specs excluded by D6. This packet introduced none.

### **Hub composition.** `.skilled/skills/sk-code/` holds `sk-code-quality`, `sk-code-review`, `sk-code-skilled` (plus `sk-code-ci`, added by packet `014-code-modes-research`), `shared/`, and no `sk-code-webflow` or `sk-code-obsidian`. `mode-registry.json` declares `sk-code-quality`, `sk-code-review` and `sk-code-skilled` as the spec requires. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Hub composition.** `.skilled/skills/sk-code/` holds `sk-code-quality`, `sk-code-review`, `sk-code-skilled` (plus `sk-code-ci`, added by packet `014-code-modes-research`), `shared/`, and no `sk-code-webflow` or `sk-code-obsidian`. `mode-registry.json` declares `sk-code-quality`, `sk-code-review` and `sk-code-skilled` as the spec requires.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Hub composition.** `.skilled/skills/sk-code/` holds `sk-code-quality`, `sk-code-review`, `sk-code-skilled` (plus `sk-code-ci`, added by packet `014-code-modes-research`), `shared/`, and no `sk-code-webflow` or `sk-code-obsidian`. `mode-registry.json` declares `sk-code-quality`, `sk-code-review` and `sk-code-skilled` as the spec requires.

### **Ignore rules.** `git check-ignore -v` matches all four rules for the four roots (`.gitignore:236-239`), and the rules are slash-less as D2 requires. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Ignore rules.** `git check-ignore -v` matches all four rules for the four roots (`.gitignore:236-239`), and the rules are slash-less as D2 requires.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Ignore rules.** `git check-ignore -v` matches all four rules for the four roots (`.gitignore:236-239`), and the rules are slash-less as D2 requires.

### **No hardcoded private root.** `private-skill-target.ts`, the launcher, the Hermes sync and the guard contain no `/Users/...` path. The launcher only forwards the `SPECKIT_PRIVATE_SKILL_ROOTS` key (`system-skill-advisor-launcher.cjs:145-147`), so the daemon inherits the operator's roots and indexes no private skill without them. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **No hardcoded private root.** `private-skill-target.ts`, the launcher, the Hermes sync and the guard contain no `/Users/...` path. The launcher only forwards the `SPECKIT_PRIVATE_SKILL_ROOTS` key (`system-skill-advisor-launcher.cjs:145-147`), so the daemon inherits the operator's roots and indexes no private skill without them.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **No hardcoded private root.** `private-skill-target.ts`, the launcher, the Hermes sync and the guard contain no `/Users/...` path. The launcher only forwards the `SPECKIT_PRIVATE_SKILL_ROOTS` key (`system-skill-advisor-launcher.cjs:145-147`), so the daemon inherits the operator's roots and indexes no private skill without them.

### **Private skill name in the committed trigger index.** The 69 `sk-code-obsidian` rows are `specs/` document paths the packet deliberately retains; no `.skilled/skills/local-` or deleted-hub-surface path appears. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Private skill name in the committed trigger index.** The 69 `sk-code-obsidian` rows are `specs/` document paths the packet deliberately retains; no `.skilled/skills/local-` or deleted-hub-surface path appears.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Private skill name in the committed trigger index.** The 69 `sk-code-obsidian` rows are `specs/` document paths the packet deliberately retains; no `.skilled/skills/local-` or deleted-hub-surface path appears.

### **Tracked-path count.** `git ls-tree -r --name-only HEAD` matches `local-(webflow|obsidian)|sk-code-(webflow|obsidian)` 108 times, all under `specs/`; zero live paths outside `specs/`. The 108 retained rows and the 336 rows at `42b41dd286` match `goal.md:92` exactly. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Tracked-path count.** `git ls-tree -r --name-only HEAD` matches `local-(webflow|obsidian)|sk-code-(webflow|obsidian)` 108 times, all under `specs/`; zero live paths outside `specs/`. The 108 retained rows and the 336 rows at `42b41dd286` match `goal.md:92` exactly.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Tracked-path count.** `git ls-tree -r --name-only HEAD` matches `local-(webflow|obsidian)|sk-code-(webflow|obsidian)` 108 times, all under `specs/`; zero live paths outside `specs/`. The 108 retained rows and the 336 rows at `42b41dd286` match `goal.md:92` exactly.

### **Trigger index.** The committed index contains no `.skilled/skills/local-` entry and no deleted hub-surface path. Its 69 `sk-code-obsidian` occurrences are `specs/...` document paths, which the packet deliberately retains. The walker never follows a directory symlink (`corpus.mjs:287-301`), so a `local-*` link cannot enter the index even in the operator's checkout. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Trigger index.** The committed index contains no `.skilled/skills/local-` entry and no deleted hub-surface path. Its 69 `sk-code-obsidian` occurrences are `specs/...` document paths, which the packet deliberately retains. The walker never follows a directory symlink (`corpus.mjs:287-301`), so a `local-*` link cannot enter the index even in the operator's checkout.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Trigger index.** The committed index contains no `.skilled/skills/local-` entry and no deleted hub-surface path. Its 69 `sk-code-obsidian` occurrences are `specs/...` document paths, which the packet deliberately retains. The walker never follows a directory symlink (`corpus.mjs:287-301`), so a `local-*` link cannot enter the index even in the operator's checkout.

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS

[Review angles investigated and definitively eliminated, consolidated from iteration dead-end data]

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All dimensions covered]

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- **Target pointers.** Parent `spec.md` (problem, scope, D1-D7, phase map, handoff blocks), parent `goal.md` (directive, binding, five completion criteria, volatile progress log), `description.json`, and the five child folders' `spec.md`, `acceptance-criteria.md`, `implementation-summary.md`, `decision-record.md`, `plan.md`, `tasks.md`, `goal.md`.
- **Implementation pointers named by the packet.** `.gitignore` (four slash-less `local-*` rules), `.skilled/scripts/git-hooks/pre-commit` plus its harness, `.skilled/skills/sk-code/` registries and routers, the advisor's `private-skill-target.ts` containment helper and its sixteen scan sites, `sync-skills-hermes.cjs`, the trigger-index generator and corpus walker, and the committed `trigger-index.json`.
- **Behavior claims to verify.** D2 (four rules, eight guarded roots), D3 (recorded limits), D4 (realpath containment with `SPECKIT_PRIVATE_SKILL_ROOTS`), D5 (every tracked-output writer skips `local-*` before its first probe), D6 (boundary), and the five completion criteria in `goal.md`.
- **Reuse and conventions.** The repo's own verification surface: `git check-ignore`, `git ls-tree`, ancestry checks against `origin/main`, and the packet's recorded commit ids.
- **Risks and gaps.** The review runs in a worktree at `worktrees/218-ci-efficiency-build`, not the operator's main checkout, so phase 004's symlinks are absent here by design; and the packet's suites are not executed by this lineage (see Non-Goals). Both limits are stated in findings rather than assumed away.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
[Alignment checks completed across core and overlay protocols]

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pending | - | - |
| `checklist_evidence` | core | pending | - | - |
| `skill_agent` | overlay | pending | - | - |
| `agent_cross_runtime` | overlay | pending | - | - |
| `feature_catalog_code` | overlay | pending | - | - |
| `playbook_capability` | overlay | pending | - | - |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
[Per-file coverage state table -- populated during initialization from scope discovery]

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| [pending] | [pending] | [pending] | [pending] | [pending] |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 5
- Convergence threshold: 0.1
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-deepseek-1792944728998-cwb2cp, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-10-25T17:20:00Z
<!-- MACHINE-OWNED: END -->
