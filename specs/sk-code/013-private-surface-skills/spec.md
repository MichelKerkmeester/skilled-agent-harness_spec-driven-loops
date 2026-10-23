---
title: "Feature Specification: Private Surface Skills"
description: "Move the Webflow and Obsidian surfaces out of the shipped sk-code hub into gitignored local-* private skills that only the operator's local advisor routes"
trigger_phrases:
  - "private surface skills phase parent spec"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/013-private-surface-skills"
    last_updated_at: "2026-10-23T00:00:00Z"
    last_updated_by: "template-author"
    recent_action: "Author the phase-parent spec"
    next_safe_action: "Plan or resume a child phase folder"
    blockers: []
    key_files: []
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
| **Branch** | `worktrees/212-private-surface-skills-spec` |
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
The hub keeps only `sk-code-quality`, `sk-code-review` and `sk-code-skilled`. The two surfaces come back as two standalone private skills, `.skilled/skills/local-webflow/` and `.skilled/skills/local-obsidian/`, that exist only on the operator's machine and are routed only by the operator's local skill advisor; nothing about them reaches the public repo, the committed trigger index, the Hermes copies or any tracked file. The decomposition is ordered so that the safety net exists before the private bytes do: ignore rules and a blocking commit guard first, then the hub sheds the surfaces and every tracked consumer of them, then the advisor's tracked vocabulary and generated data lose the surface signals while its disk scans learn to follow a `local-*` symlink, then the private skills are stood up inside ignored paths, and finally a fresh clone plus local routing probes prove no leak.

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
- The two private skills `.skilled/skills/local-webflow/` and `.skilled/skills/local-obsidian/` themselves, as ignored local content
- Verification evidence: a fresh clone, a throwaway advisor database, a rebuilt trigger index and local routing probes

### Out of Scope
- Generic Webflow or Obsidian words in other skills and modes: `mcp-tooling` / `mcp-obsidian`, `mcp-notion`, the Webflow CMS vocabulary in `mcp-code-mode` (`fusion.ts:600-602`, `explicit.ts:131`, `skill_advisor.py:2181`), the `P1-MCP-002` regression and holdout rows, and `sk-design` style bundles
- Dated historical records: every `changelog/` file, `.skilled/changelog/skilled/*.md`, `benchmark/reports/`, `specs/**/z_archive/`, the `doctor-update-*` playbooks in `.skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/`, and the `anchor-repair-sample` test fixture
- Git history. Removed content stays reachable in history; scrubbing it is an operator decision outside this packet
- Any behavior change to the two surfaces beyond making them standalone and private, and any change to hub routing for the three remaining surfaces

### Files to Change
Summary of the areas each phase touches; per-phase file detail lives in each child's plan.md.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.gitignore` (root) | Modify | 001 | `/.skilled/skills/local-*` and `/.hermes/skills/local-*`, no trailing slash so a folder and a symlink both match |
| `.skilled/scripts/git-hooks/pre-commit`, `.skilled/scripts/git-hooks/tests/pre-commit.test.sh` | Modify | 001 | Blocking guard against staging a `local-*` skill path, with new test cases |
| `.skilled/skills/sk-code/sk-code-webflow/`, `.skilled/skills/sk-code/sk-code-obsidian/` | Delete | 002 | Both surface folders leave the hub (226 tracked files) |
| `.skilled/skills/sk-code/` registries, routers, manifests, `ROUTER.md`, `SKILL.md`, `graph-metadata.json` | Modify | 002 | Hub keeps `sk-code-quality`, `sk-code-review`, `sk-code-skilled` and drops the surface modes, signals and vocabulary classes |
| Hub playbooks, checklists, catalogs, fixtures, tests and `.hermes/skills/` mirror | Modify | 002 | Every tracked consumer that names the removed surfaces |
| Advisor runtime code and plugin surface detection | Modify | 003 | Surface tokens, surface detection branches, and the `local-*` symlink and skip handling in disk scans and tracked-output writers |
| Advisor tests, fixtures and calibration baselines | Modify | 003 | Surface rows replaced with `SKILLED` or neutral values, plus one failing-before test per scan change |
| Trigger index, retrieval fixtures, advisor tracked fallback graph | Regenerate | 003 | Generated data loses every surface mention; never hand-edited |
| `.skilled/skills/local-webflow/`, `.skilled/skills/local-obsidian/` | Create (ignored) | 004 | Two standalone private skills, each with its own frontmatter, `graph-metadata.json` and `description.json` |
| Private skill internal links to hub shared references | Modify (ignored) | 004 | Each private skill resolves its workflow references without the hub's surface layout |
| No product file | None (verification only) | 005 | Fresh clone, throwaway advisor DB, trigger-index and local routing evidence recorded in the child's implementation-summary.md |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-ignore-and-commit-guard/ | Add the two root `local-*` ignore rules and the blocking pre-commit guard, with tests, before any private file exists | Pending |
| 2 | 002-hub-surface-removal/ | Remove both surface folders from the hub and update every tracked consumer that names them, following the hub README's nine-step procedure | Pending |
| 3 | 003-advisor-vocabulary-cleanup/ | Strip the surface vocabulary from the advisor's tracked code, tests and generated data, and make its scans follow a `local-*` symlink while tracked outputs skip `local-*` | Pending |
| 4 | 004-private-local-skills/ | Stand up `.skilled/skills/local-webflow/` and `.skilled/skills/local-obsidian/` as standalone private skills inside ignored paths, as real folders or operator symlinks | Pending |
| 5 | 005-leak-and-routing-verification/ | Prove from a fresh clone that no private byte, id or signal is tracked, and prove the operator's local advisor still routes both skills | Pending |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- **Planning commit.** The parent's `spec.md`, `description.json` and `graph-metadata.json` and all five children's planning documents (`spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, `implementation-summary.md` and their metadata) land on `main` in the single planning commit that ships this packet, before any phase runs. Each phase then commits only its own updates inside its own child folder
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-ignore-and-commit-guard | 002-hub-surface-removal | Both root ignore rules match the private paths as a folder and as a symlink, and the pre-commit guard refuses a staged `local-*` skill path while its existing cases still pass | `bash .skilled/scripts/git-hooks/tests/pre-commit.test.sh` passes, and `git check-ignore -v .skilled/skills/local-webflow .hermes/skills/local-webflow` names both rules |
| 002-hub-surface-removal | 003-advisor-vocabulary-cleanup | The hub ships only `sk-code-quality`, `sk-code-review` and `sk-code-skilled`, and no tracked consumer outside the kept historical records still names the removed surfaces | `node .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-doc-claims.cjs` and `.../verify-router-sync.cjs` pass, and phase 2's own closure grep from `002-hub-surface-removal/acceptance-criteria.md` AC-007 — `rg -n "sk-code-webflow\|sk-code-obsidian" .skilled/skills/sk-code .skilled/bin .skilled/commands/doctor .skilled/skills/sk-doc README.md .skilled/skills/README.txt --glob '!**/changelog/**' --glob '!**/benchmark/reports/**'` — prints nothing. That scoped path list excludes the CI-generated trigger index and retrieval fixtures, so this handoff does not wait on them; phase 5 proves their zero count after the rebuild |
| 003-advisor-vocabulary-cleanup | 004-private-local-skills | The advisor's tracked vocabulary, tests and generated data are surface-free, and its disk scans accept a `local-*` symlink that resolves to a directory while tracked-output writers skip it | The advisor vitest suites pass, `python3 .skilled/skills/system-skill-advisor/runtime/scripts/skill_graph_compiler.py --export-json` leaves no surface signal in `runtime/scripts/skill-graph.json`, and the rebuilt trigger index has zero surface hits |
| 004-private-local-skills | 005-leak-and-routing-verification | Both private skills load and route locally, and every private byte sits in an ignored path with nothing staged | `git status --porcelain --ignored` lists both paths as `!!`, `git check-ignore -v` names the rule, and `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"<webflow prompt>"}' --format json` returns `local-webflow` top (same for an Obsidian prompt) while a generic frontend prompt still returns `sk-code` |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- **Real folder or symlink?** Each private skill may be a real folder or a symlink to a private repo. The operator decides at phase 4 and nothing blocks on the answer: phase 1's ignore rules match both, and phase 3 makes the advisor's scans accept a `local-*` symlink that resolves to a directory.
- **Scrub history?** Removed content stays reachable in git history. Scrubbing it (filter-repo plus a force push) is an optional operator decision after phase 5; it is out of scope for this packet and no phase depends on it.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
