---
title: "Feature Specification: Private Surface Skills"
description: "Move the Webflow and Obsidian surfaces out of the shipped sk-code hub into two local-* skills this checkout links to but never tracks, kept in two external repositories"
trigger_phrases:
  - "private surface skills phase parent spec"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/013-private-surface-skills"
    last_updated_at: "2026-10-23T14:10:00Z"
    last_updated_by: "deepseek-v4.1-flash-1017"
    recent_action: "Finish the phase map, handoff blocks, open questions and parent goal"
    next_safe_action: "Run phase 001-ignore-and-commit-guard"
    blockers: []
    key_files:
      - "spec.md"
      - "goal.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X→Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: Private Surface Skills

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-10-23 |
| **Executor** | OpenCode 2 orchestrator; reviews via the `subagent` tool, agent `review` |
| **Parent Spec** | None (top-level packet) |
| **Parent Packet** | sk-code track |
| **Predecessor** | 012-sk-code-skilled-rename |
| **Successor** | None |
| **Handoff Criteria** | Every child validates `--strict`, and phase 5 proves from a fresh clone that no private skill, id or signal reaches a tracked file |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The shipped sk-code hub still carries two surface packets the operator alone uses: the Webflow surface (`.skilled/skills/sk-code/sk-code-webflow/`, 1.5M) and the Obsidian surface (`.skilled/skills/sk-code/sk-code-obsidian/`, 504K), 226 tracked files together. Because they live in the hub, they ship in the public repo, feed the committed trigger index and the advisor's tracked graph data, get mirrored into `.hermes/skills/`, and widen the hub's routing vocabulary for every consumer of the skill — including users who never touch Webflow or Obsidian.

### Purpose
The hub keeps only `sk-code-quality`, `sk-code-review` and `sk-code-skilled`. The two surfaces come back as two standalone skills, `.skilled/skills/local-webflow/` and `.skilled/skills/local-obsidian/`, that this checkout holds as gitignored symlinks to `local-skills/` folders tracked in two external repositories: `local-webflow` in a private repository and `local-obsidian` in a public one by operator choice. Only the operator's local skill advisor routes them; nothing about them reaches the public repo, the committed trigger index, the Hermes copies or any tracked file. The decomposition is ordered so that the safety net exists before the private bytes do: ignore rules and a blocking commit guard first, then the hub sheds the surfaces and every tracked consumer of them, then the advisor's tracked vocabulary and generated data lose the surface signals while its disk scans learn to follow a `local-*` symlink, then the two symlinks are stood up inside ignored paths, and finally a fresh clone plus local routing probes prove no leak.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The sk-code hub tree `.skilled/skills/sk-code/`, and the two surface folders inside it that leave the hub
- Tracked consumers that name `sk-code-webflow`, `sk-code-obsidian`, or the `WEBFLOW` / `OBSIDIAN` surface tokens: hub registries and routers, `leaf-manifest.json`, `graph-metadata.json`, `ROUTER.md`, `SKILL.md`, playbooks, checklists, catalogs, fixtures, tests and the `.hermes/skills/` mirror
- The advisor's sk-code surface vocabulary: scoring tokens, plugin surface detection, CLI manifest prose, tests, fixtures and baselines
- The advisor's disk scans and tracked-output writers, so a private skill is reachable locally and invisible to tracked artifacts
- Root `.gitignore` ignore rules for `local-*` skill paths, and the blocking pre-commit guard that refuses to stage them
- The two private skills `.skilled/skills/local-webflow/` and `.skilled/skills/local-obsidian/`, as gitignored symlinks in this checkout to `local-skills/` folders in two external repositories
- Verification evidence: a fresh clone, a throwaway advisor database, a rebuilt trigger index and local routing probes

### Out of Scope
- Generic Webflow or Obsidian words in other skills and modes: `mcp-tooling` / `mcp-obsidian`, `mcp-notion`, the Webflow CMS vocabulary in `mcp-code-mode` (`fusion.ts:600-602`, `explicit.ts:131`, `skill_advisor.py:2181`), the `P1-MCP-002` regression and holdout rows, and `sk-design` style bundles
- Dated historical records: every `changelog/` file, `.skilled/changelog/skilled/*.md`, `benchmark/reports/`, `specs/**/z_archive/`, the `doctor-update-*` playbooks in `.skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/`, and the `anchor-repair-sample` test fixture
- Git history. Removed content stays reachable in history; scrubbing it is an operator decision outside this packet
- Any behavior change to the two surfaces beyond making them standalone and private, and any change to hub routing for the three remaining surfaces

### Frozen Decisions

Every phase honors these. Changing one is an amendment to this spec.

| ID | Decision |
|----|----------|
| D1 | The hub keeps `sk-code-quality`, `sk-code-review` and `sk-code-skilled`; the two surfaces return only as gitignored `local-*` symlinks in this checkout to two external `local-skills/` folders (Obsidian public by operator choice, Webflow private), and only the operator's local advisor routes them. |
| D2 | Four slash-less root ignore rules cover `local-*` under `.skilled`, `.hermes`, `.codex` and `.cursor`, and a blocking pre-commit guard refuses a staged `local-*` path under all eight skill roots: `.skilled`, `.opencode`, `.claude`, `.pi`, `.devin`, `.hermes`, `.codex` and `.cursor`. |
| D3 | The limits are recorded rather than claimed away: `git commit --no-verify` bypasses the guard, removed content stays in git history, a renamed copy passes a name-based guard, and no standing pre-push surface-token guard exists. |
| D4 | A followed top-level `local-*` symlink must resolve through `realpathSync` to a directory inside the skills root or one of the two roots named in `SPECKIT_PRIVATE_SKILL_ROOTS`; no other link is followed. |
| D5 | Every tracked-output writer skips a `local-*` name before its first filesystem probe, so no private skill reaches the fallback graph, the Hermes mirror, a CI gate or a doctor finding. |
| D6 | The boundary is the hub tree, the tracked consumers that name the two surfaces, and the advisor's sk-code surface vocabulary; generic words in other skills, dated records and git history stay unchanged. |
| D7 | No history rewrite runs in this packet; scrubbing is an optional operator decision after phase 5's read-only inventory. |

### Files to Change
Summary of the areas each phase touches; per-phase file detail lives in each child's plan.md.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.gitignore` (root) | Modify | 001 | Four rules — `/.skilled/skills/local-*`, `/.hermes/skills/local-*`, `/.codex/skills/local-*` and `/.cursor/skills/local-*` — each with no trailing slash so a folder and a symlink both match |
| `.skilled/scripts/git-hooks/pre-commit`, `.skilled/scripts/git-hooks/tests/pre-commit.test.sh` | Modify | 001 | Blocking guard over eight skill roots against staging a `local-*` skill path, with seven new harness cases |
| `.skilled/skills/sk-code/sk-code-webflow/`, `.skilled/skills/sk-code/sk-code-obsidian/` | Delete | 002 | Both surface folders leave the hub (226 tracked files) |
| `.skilled/skills/sk-code/` registries, routers, manifests, `ROUTER.md`, `SKILL.md`, `graph-metadata.json` | Modify | 002 | Hub keeps `sk-code-quality`, `sk-code-review`, `sk-code-skilled` and drops the surface modes, signals and vocabulary classes |
| Hub playbooks, checklists, catalogs, fixtures, tests and `.hermes/skills/` mirror | Modify | 002 | Every tracked consumer that names the removed surfaces |
| Advisor runtime code and plugin surface detection | Modify | 003 | Surface tokens, surface detection branches, and the `local-*` symlink and skip handling in disk scans and tracked-output writers |
| Advisor tests, fixtures and calibration baselines | Modify | 003 | Surface rows replaced with `SKILLED` or neutral values, plus one failing-before test per scan change |
| Trigger index, retrieval fixtures, advisor tracked fallback graph | Regenerate | 003 | Generated data loses every surface mention; never hand-edited |
| `.skilled/skills/local-webflow/`, `.skilled/skills/local-obsidian/` | Create (ignored symlinks) | 004 | Two gitignored symlinks to `local-skills/` folders in two external repositories, whose content is restored from `42b41dd286`; each target is a standalone skill with its own frontmatter and one skill-root `graph-metadata.json`, and no `description.json` |
| Private skill internal links to hub shared references | Modify (ignored) | 004 | The three `references/workflow-*.md` symlinks become real copies, and every relative link broken by the move is rewritten to its old target |
| No product file | None (verification only) | 005 | Fifteen evidence files under `scratch/evidence/`: fresh clone, blob comparison, D6 audit, throwaway advisor DB, four retrieval artifacts, corpus probe, six routing probes in two checkouts, history inventory and drift scripts |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-ignore-and-commit-guard/ | Land four slash-less `local-*` ignore rules and a blocking pre-commit guard over eight skill roots, with seven harness cases, before any private file exists | Pending |
| 2 | 002-hub-surface-removal/ | Delete both surface folders (226 tracked files) and strip every tracked consumer, regenerating generated artifacts and hand-editing `ROUTER.md` and `graph-metadata.json`; the hub keeps three packets | Pending |
| 3 | 003-advisor-vocabulary-cleanup/ | Remove the surface vocabulary from the advisor scorer, plugin, schemas and tests, and give seven skill-tree scans an explicit `local-*` rule with realpath containment; regenerate the tracked fallback graph | Pending |
| 4 | 004-private-local-skills/ | Link `.skilled/skills/local-*` to `local-skills/` folders in two external repositories and restore both surfaces there from `42b41dd286`, each standalone with one skill-root `graph-metadata.json` | Pending |
| 5 | 005-leak-and-routing-verification/ | Prove from a fresh clone that no private path, byte or routing signal is tracked, and that six routing probes in two consumer checkouts still return both private skills | Pending |

### Phase Transition Rules

- **The order is fixed: `001 -> 002 -> 003 -> 004 -> 005`.** No phase starts before its predecessor is on `main`, and no phase runs in parallel with its neighbour.
- **Phase 004 must not start before phase 003 is on `main`.** Until phase 003 lands, the advisor's compiler follows a `local-*` symlink and would export a private skill into the tracked fallback graph.
- Each phase MUST pass `validate.sh` independently before the next phase begins
- **Planning commit.** The parent's `spec.md`, `goal.md`, `description.json` and `graph-metadata.json` and all five children's planning documents (`spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, `decision-record.md`, `goal.md`, `implementation-summary.md` and their metadata) land on `main` in the single planning commit that ships this packet, before any phase runs. Each phase then commits only its own updates inside its own child folder
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

Run each block from the repository root of the worktree, except block 4, which runs in the operator's main checkout at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public` because phase 004 creates both symlinks there; their targets are `local-skills/` folders in two external repositories.

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-ignore-and-commit-guard | 002-hub-surface-removal | Four slash-less rules match both private paths as a folder and as a symlink, and the guard refuses a staged `local-*` path under all eight roots while every existing harness case still passes | Block 1 |
| 002-hub-surface-removal | 003-advisor-vocabulary-cleanup | The hub ships only `sk-code-quality`, `sk-code-review` and `sk-code-skilled`, and no tracked consumer outside the dated records names either removed surface | Block 2 |
| 003-advisor-vocabulary-cleanup | 004-private-local-skills | The advisor's tracked vocabulary, tests and fallback graph are surface-free, and its scans accept a trusted `local-*` symlink while every tracked writer skips it | Block 3 |
| 004-private-local-skills | 005-leak-and-routing-verification | Both private skills load and route locally through their symlinks, each sits in an ignored path with nothing staged, and the two external roots are recorded | Block 4 |

#### Block 1 - 001 to 002

```bash
bash .skilled/scripts/git-hooks/tests/pre-commit.test.sh
git check-ignore -v .skilled/skills/local-webflow .hermes/skills/local-webflow
```

Expected: the harness exits 0 and its last line reads `pre-commit gates: 131 passed, 0 failed`; `git check-ignore` exits 0 and prints one line per path naming `/.skilled/skills/local-*` and `/.hermes/skills/local-*`.

#### Block 2 - 002 to 003

```bash
node .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-doc-claims.cjs
node .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs
rg -n 'sk-code-webflow|sk-code-obsidian' .skilled/skills/sk-code .skilled/bin .skilled/commands/doctor .skilled/skills/sk-doc README.md .skilled/skills/README.txt --glob '!**/changelog/**' --glob '!**/benchmark/reports/**'
```

Expected: `doc-claims: 4/4 checks passed`, then `router-sync: 5/5 checks passed`, then no output from `rg` and exit 1. That scoped path list excludes the CI-generated trigger index and retrieval fixtures, so this handoff does not wait on them; phase 5 proves their zero count after the rebuild.

#### Block 3 - 003 to 004

```bash
node -e "const g=require('./.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json');console.log(JSON.stringify(g.signals['sk-code'].filter(x=>/webflow|obsidian/i.test(x))))"
cd .skilled/skills/system-skill-advisor/runtime && ../../system-spec-kit/node_modules/.bin/vitest run tests/private-skill-target.vitest.ts tests/skill-graph-db.vitest.ts
```

Expected: `[]` from the graph check, then `Tests  16 passed (16)` and exit 0 from the vitest run (five containment cases plus eleven graph cases).

#### Block 4 - 004 to 005

Run this block in `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`.

```bash
export SPECKIT_PRIVATE_SKILL_ROOTS="/Users/michelkerkmeester/MEGA/Development/Obsidian Plugin/local-skills:/Users/michelkerkmeester/MEGA/Development/Websites/anobel.com/local-skills"
readlink .skilled/skills/local-webflow .skilled/skills/local-obsidian
git status --porcelain --ignored .skilled/skills/local-webflow .skilled/skills/local-obsidian
git check-ignore -v .skilled/skills/local-webflow .skilled/skills/local-obsidian
node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"implement a responsive webflow animation module"}' --format json | jq -r '.data.recommendations[0].skillId'
node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"add an obsidian plugin command palette integration"}' --format json | jq -r '.data.recommendations[0].skillId'
node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"add a responsive css layout to the settings page"}' --format json | jq -r '.data.recommendations[0].skillId'
```

Expected: two lines naming the two external `local-skills/` folders; two `!!` lines from `git status` and nothing else; two `git check-ignore` lines naming `/.skilled/skills/local-*`; then `local-webflow`, `local-obsidian` and `sk-code`, one per line.
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- **Phase 4 layout — answered 2026-10-23.** Both skills are gitignored symlinks in this checkout to `local-skills/` folders tracked in two external repositories: `local-obsidian` in the public `obnotion_notion-cloned-into-obsidian` repository (public by operator choice) and `local-webflow` in the private `anobel.com` repository. The targets sit outside both repos' `.skilled`, `.opencode` and `.claude` symlinks, so a target under any of those would loop. `SPECKIT_PRIVATE_SKILL_ROOTS` lists both `local-skills/` parents joined with `:`, and every advisor process needs it. ADR-001 in `004-private-local-skills/decision-record.md` records this mode.
- **Rewrite history after phase 5?** Phase 5 inventories reachable objects, tag trees and hosted release assets read-only in `12-history-inventory.md`; it rewrites nothing. Scrubbing the removed content (filter-repo plus a force push) is an optional operator decision taken after that inventory. It is out of scope for this packet, and no phase depends on it.
- **Workflow state-log projection — out of scope.** The deep-research workflow's state-log row drops the identity and answered-question fields, so a state-log-only recovery cannot rebuild the iteration record (research §9, P2). The workflow owner fixes it, not this packet: no phase edits the projection, and no criterion counts it.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
