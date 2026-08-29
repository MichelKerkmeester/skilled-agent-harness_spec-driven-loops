---
title: "Implementation Plan: Phase 9 — cutover and rollout"
description: "Split the cutover at the verifiability seam: land cleanup + fold-fixes in the branch, stage the atomic advisor-rebuild (scorer removal, graph regen, reindex, alias deletion, NAME-ref repoint, release) for main. Includes the NAME-ref bucket map."
trigger_phrases:
  - "sk-code cutover plan"
  - "sk-code-review NAME-ref map"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/001-sk-code-parent/009-cutover-and-rollout"
    last_updated_at: "2026-07-04T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Documented the branch/main split plan + the NAME-ref bucket map"
    next_safe_action: "Merge, then run the main-side rollout runbook"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 9 — cutover and rollout

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context
| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node CJS harness + vitest, TS/Python advisor scorer, JSON graph, skill/agent markdown, shell |
| **Framework** | sk-code parent hub + system-skill-advisor scorer + deep-improvement harness |
| **Storage** | Branch: worktree. Main: compiled `dist`, `skill-graph.json`, SQLite advisor DB, memory corpus |
| **Testing** | Branch: skill-benchmark vitest, router replay. Main: advisor TS vitest + parity, pytest, benchmark, `parent-skill-check.cjs`, `validate.sh --recursive` |

### Overview
The load-bearing cutover cannot run in the worktree (graph compiler fails validation on un-built `dist`; TS scorer can't load). So: do the verifiable cleanup + fold-fixes now, and stage the atomic advisor-rebuild for main. The alias stays a working shim so routing is never broken mid-flight.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Cutover surface mapped (alias sites, scorer entries, corpora, NAME refs).
- [x] Worktree un-runnability of graph regen + TS scorer confirmed empirically.
- [x] Cleanup items fully scoped with verified minimal fixes.

### Definition of Done (branch)
- [x] 3 cleanup items + smart_routing fix landed and verified.
- [x] 2 fold-broken live refs fixed.
- [x] Main-side rollout runbook complete and ordered.
- [x] Phase docs + metadata.

### Definition of Done (main — tracked, post-merge)
- [ ] Advisor scorer removed (TS+Python), corpora rebaselined, graph regenerated, reindexed.
- [ ] 4 alias sites deleted; ~350 NAME refs repointed; release cut.
- [ ] Full verification suite green; 0 live sk-code-review refs.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Split at the verifiability seam. Anything that can be built, run, and tested in the worktree lands in the branch; anything that needs main's `dist` (or is coupled to something that does) is one atomic main-side rebuild. Coupling drives sequencing: scorer-source removal → graph regen → alias deletion → NAME-ref repoint → release, so no step exposes an unresolvable identity.

### Key Components
- **Branch**: deep-improvement harness (tests + generator + router + vocab check), `smart_routing.md`, two fold-broken files.
- **Main**: `system-skill-advisor` scorer (TS + Python mirror), `skill-graph.json` compiler, SQLite advisor DB, memory corpus, the 4 hub alias sites, the NAME-ref surface, version/changelog.

### Data Flow (main-side)
build dist → remove scorer identity (TS+Python parity) → rebaseline corpora → regen graph (node 19→18) → reindex → delete alias sites → repoint NAME refs → cut release → verify (vitest/parity/pytest/benchmark/grep).
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:name-ref-map -->
## FIX ADDENDUM: NAME-REF BUCKET MAP (for main-side step 4)

Repoint `sk-code-review` → `sk-code` (+ `code-review` mode) across ~350 occurrences / ~90 files. Buckets (from the cutover-surface investigation):

| Bucket | Files (representative) | Notes |
|--------|------------------------|-------|
| Agent prose | `.claude`/`.opencode` `code.md`, `review.md`, `orchestrate.md`, `deep-review.md` | The real dispatch surface |
| speckit `baseline:` config | `speckit_{complete,implement}_{auto,confirm}.yaml` (4 files) | Load-vs-route semantics — change with alias removal |
| Install guides | `install_guides/README.md`, `SET-UP - AGENTS.md` | Prose |
| Skills README + CLI orchestrators | `skills/README.md` (link done in branch), `cli-claude-code`/`cli-opencode` SKILL/assets | Prose |
| deep-review skill docs | `deep-review/README.md`, `SKILL.md`, `references/protocol/quick_reference.md` | Prose |
| sk-code family docs | `code-implement`/`code-quality` refs, `code-review/**` (94 lines, mostly one templated line ×19 scenarios), `shared/references/universal/code_quality_standards.md` §8 | Mechanical |
| sk-design / sk-git cross-refs | `sk-design` SKILL + audit/interface docs + `graph-metadata.json` edges; `sk-git/graph-metadata.json` | Edge + prose |
| Root README | `README.md` (prose + the `sk-code-review` section header) | Prose |
| **Advisor (with the rebuild)** | `system-skill-advisor` scorer source, `advisor_scorer.md`, `manual_testing_playbook/` captured outputs, `skill-graph.json` | Source + re-captured outputs |
| Exclude | `changelog/`, `.opencode/specs/**`, all `*.vitest.ts`/`*.test.*` fixtures, `z_archive/*.retired.md` | Archives / synthetic fixtures |
<!-- /ANCHOR:name-ref-map -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup (branch)
- [x] Map the cutover surface, version state, and cleanup scope (3 read-only agents).
- [x] Confirm worktree un-runnability of graph regen + TS scorer.

### Phase 2: Core (branch)
- [x] Migrate the 8 harness tests; fix `smart_routing.md` drift (0 dead).
- [x] Generalize vocab-sync; fix the CS-003 matcher.
- [x] Fix the two fold-broken live references.

### Phase 3: Verification (branch) + handoff
- [x] Harness suite `1 failed | 98 passed`; CS-003 + vocab-sync replay-verified.
- [x] Author the ordered main-side rollout runbook.
- [ ] (Main, post-merge) Execute the runbook; full verification suite.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
| Test Type | Scope | Tools |
|-----------|-------|-------|
| Harness suite | Branch cleanup | vitest (`skill-benchmark/tests`) |
| Router replay | CS-003 + smart_routing | `routeSkillResources` node replay |
| Advisor scorer + parity | Main (post-rebuild) | advisor TS vitest, pytest |
| Graph integrity | Main | `skill_graph_compiler.py --validate-only` |
| Recursive validation | Main | `parent-skill-check.cjs`, `validate.sh --recursive` |
| Residual grep | Main | ripgrep (0 live sk-code-review refs) |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 008 benchmark + review | Internal | Complete | No verified routing baseline |
| Compiled `dist` on main | Internal | Pending (post-merge) | Advisor rebuild + regen + reindex can't run |
| 007 advisor node + alias | Internal | Complete | Provides the shim + node source |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
- **Trigger (branch)**: a cleanup fix misbehaves. **Procedure**: all branch edits are additive text/JSON/markdown in a git-tracked worktree; `git checkout`/`git reset` reverts. Harness suite is the guard.
- **Trigger (main)**: the rebuilt advisor misroutes after cutover. **Procedure**: the runbook is ordered and each step is independently revertable; restore the pre-cutover `skill-graph.json` + scorer source + alias sites from git, re-run the compiler and reindex. The alias shim means reverting the alias deletion instantly restores back-compat resolution.
<!-- /ANCHOR:rollback -->
