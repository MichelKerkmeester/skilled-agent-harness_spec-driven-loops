---
title: "Implementation Plan: Advisor routing and launcher hardening"
description: "Ships an asymmetric containment rule for scorer partial credit, activates the deep-loop and MCP doctor bridges, stops the launcher reinstalling a matching node_modules, makes the playbook validator check the advisor playbook and clears HVR blockers. The environment-variables item ships an authored lead_phrases field the operator approved."
trigger_phrases:
  - "routing and launcher hardening plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Advisor routing and launcher hardening

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (advisor runtime), CommonJS (launcher, deriver, probes), Python 3 (graph compiler, Python suite), Markdown |
| **Framework** | Node.js, Vitest |
| **Storage** | None changed. The scorer reads the filesystem projection under the pinned regime |
| **Testing** | Vitest, `node --test`, the Python suite, the routing CI steps |

### Overview
Each item was reproduced before planning. The scorer variants were measured in a scratch copy of the compiled build (`$S/exp`), so no repository file changed during research. The executor for every edit outside the spec folder is Luna (`gpt-6-luna`, max, fast), one dispatch at a time, verified after each run.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing, with a mutation check for each code fix
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Extend existing modules in place. No new module, option or dependency.

### Key Components
- **Scorer containment (item 1)**: the current rule credits `token.includes(candidate) || candidate.includes(token)`. Four variants were scored against the labeled, holdout and ambiguity corpora, the doctor slice and the short prompts, with `push allowlist` restored:

  | Variant | Rule | Top-1 moves |
  |---------|------|-------------|
  | v1 | prefix only either way | 5 (the five rows from last time, reproduced) |
  | v2 | containment, shorter at least half the longer | 1 holdout row |
  | v3 | both tokens at least 5 characters | 4 |
  | v5 | prompt token contains the skill token, or the skill token starts with the prompt token | 0 |

  v5 is chosen. It removes credit only where the prompt word sits inside or at the end of a longer skill word (`list` in `allowlist`, `form` in `platform`, `spec` in `inspect`). Its only moves are third-place changes on four spec prompts, where mcp-tooling stops passing on `spec` inside its `inspect the dom` phrases. The candidates that replace it already passed at the same 0.820 in fourth place.
- **Environment variables (item 2)**: shipped with a lead-phrase field. With `environment variables` added to system-spec-kit, both env prompts score system-spec-kit 0.833/0.16, so any vocabulary that passes the bare prompt also passes `check my environment variables`, and the ordering rule then puts the skill first. Three ordering rules were tested against the doctor slice:
  - exact whole-prompt bridge phrase first: breaks doctor-a-09, doctor-b-git-04 and doctor-b-advisor-01, which are exact bridge phrases that want the skill first;
  - bridge first when it outscores the top skill: moves 9 slice rows, including `check my git hooks setup` (sk-git 0.827 against the bridge's 0.907);
  - bridge phrase covers the skill's matched phrase: `skill graph freshness` (skill matched `skill graph`) and `trigger index drift` (skill matched `trigger index`) have that shape and want the skill first.
  Only an authored per-phrase precedence field in `_routes.yaml`, carried by the deriver into the scorer, separates the env row. The operator approved it: `lead_phrases` is an optional subset of a route's trigger phrases, each of three or more words. The deriver emits it, `route-validate` checks it, and both scorers put the first passing bridge whose lead phrase matches above a passing skill.
- **Doctor bridges (item 3)**: `/doctor:deep-loop` gets activation entries and three-word phrases. The deriver and `doctor-phrase-reach.cjs` read `mcp_subroutes` as routes of `/doctor:mcp`, giving `command-doctor-mcp-install` and `command-doctor-mcp-debug` with runnable `/doctor:mcp install` and `/doctor:mcp debug`.
- **Launcher (item 4)**: `buildIfNeeded` skips the runtime install when every non-optional lockfile package is installed at its locked version, then still builds.
- **Playbook validator (item 5)**: the advisor whole-tree override dates from the first validator commit (`23f56dbcfa`), which called the advisor hub "predominantly" routing gold. The same commit added the per-file routing-gold signature, which today still classifies 25 of the 61 files as routing gold. Dropping the whole-tree override exposes 36 operator scenarios. The 14 doctor-commands scenarios, DOC-385 to DOC-391 among them, already pass. The 22 older scenarios carry 122 violations, mostly from baked run output and missing standard headings.

### Data Flow
`_routes.yaml` → `derive-command-bridges.cjs` → `command-bridges.generated.json` and generated TypeScript and Python blocks → scorer. `graph-metadata.json` → `skill_graph_compiler.py --export-json` → `skill-graph.json`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `scoreTokenOverlap` (`text.ts`) | Partial credit for the lexical, derived and semantic-shadow lanes | update | Scorer unit test plus all corpora |
| `lanes/lexical.ts`, `lanes/derived.ts`, `lanes/semantic-shadow.ts` | Callers of `scoreTokenOverlap` | unchanged | Per-prompt comparison and doctor slice |
| sk-git `graph-metadata.json` `intent_signals` | Short-prompt vocabulary | update | Graph compile, freshness strict, short-prompt probe |
| `derive-command-bridges.cjs` | Builds doctor bridges from `_routes.yaml` | update | `--check` fresh, deriver tests |
| `doctor-phrase-reach.cjs` | Recomputes the deriver's doctor bridges | update | Probe exit 0 |
| `render.ts` generated block, Python slash markers | Deriver outputs | regenerated | `derive-command-bridges.cjs --check` |
| Launcher `buildIfNeeded` | Stale-build bootstrap | update | Fixture test with a failing fake `npm` |
| `playbook-corpus-manifest.json` | Whole-tree routing-gold overrides | update | Validator run on the advisor package |

Required inventories:
- Same-class producers: `rg -n 'includes\(candidate\)' .skilled/skills/system-skill-advisor/runtime --glob '!dist' --glob '!node_modules'` (one hit, `text.ts`).
- Consumers of changed symbols: `rg -n 'scoreTokenOverlap' .skilled/skills/system-skill-advisor/runtime --glob '*.ts' --glob '!dist'` (three lanes and one test).
- Matrix axes: corpora (labeled 195, holdout 66, ambiguity 24), doctor slice (52), short prompts (59), live CLI prompts.
- Algorithm invariant: partial credit applies only when the prompt token contains the skill token, or the skill token starts with the prompt token, both at least four characters.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `scoreTokenOverlap` credit rule; launcher lockfile check | Vitest |
| Integration | Launcher stale-build bootstrap with a failing fake `npm`; deriver output | Vitest, `node --test` |
| Routing | Per-prompt comparison, short-prompt probe, doctor slice, phrase reach, routing CI | Node scripts |
| Manual | Live CLI `advisor_recommend` for the named prompts | Advisor CLI |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Luna via `codex exec` | External | Green | Hand-edit after three failures on one change, recorded |
| Parallel 033/010 build | Internal | Yellow | Shared files are diffed before editing |
| `runtime/node_modules` | Internal | Green | Restored from the lockfile if a sandbox wipes it |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A gate fails after a change, or a routing row is lost.
- **Procedure**: Restore the touched file from its `$S/before-N.*` backup, rebuild and rerun the gate.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup (baselines) ──► Scorer + metadata ──► Doctor bridges ──► Launcher ──► Playbook ──► HVR docs ──► Verify
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | All |
| Scorer + metadata | Setup | Doctor bridges (shared routing baseline) |
| Doctor bridges | Scorer | Verify |
| Launcher, Playbook, HVR | Setup | Verify |
| Verify | All | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Done during research |
| Core Implementation | High | About 15 Luna dispatches |
| Verification | Med | Full gate list after the last change |
| **Total** | | **One working session** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (each target copied to `$S/before-N.*` before its dispatch)
- [x] Feature flag configured (not applicable; no flag added)
- [x] Monitoring alerts set (not applicable; local tooling)

### Rollback Procedure
1. Copy the `$S/before-N.*` backup over the changed file.
2. Rerun the deriver and the graph compiler when a manifest or metadata file was restored.
3. Rebuild the runtime and rerun the per-prompt comparison.
4. Report the rollback in `implementation-summary.md`.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
