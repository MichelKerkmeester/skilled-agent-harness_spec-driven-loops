---
title: "Implementation Plan: Phase 7 — advisor and integration"
description: "Extract ground-truth rename maps, build a deterministic longest-match repointer with a dry-run gate, sweep all live references, integrate the hub advisor node, and stage the rebuild for main."
trigger_phrases:
  - "sk-code advisor integration plan"
  - "sk-code reference repoint plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/124-sk-code-parent/007-advisor-and-integration"
    last_updated_at: "2026-07-04T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Documented the deterministic repoint + advisor-integration plan"
    next_safe_action: "phase 008 routing-benchmark-and-review"
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
# Implementation Plan: Phase 7 — advisor and integration

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context
| Aspect | Value |
|--------|-------|
| **Language/Stack** | Skill/agent markdown, JSON graph metadata, shell hooks, CI YAML |
| **Framework** | `sk-code` parent hub + advisor graph node |
| **Storage** | Repo-wide live references; hub `graph-metadata.json` |
| **Testing** | Deterministic dry-run diff, on-disk existence validation, repo-wide residual grep, JSON validity |

### Overview
Rather than hand- or LLM-repoint ~200 references (unreliable path math — the 004 lesson), extract the exact `old → new` rename pairs from the 004 and 005 commits and drive a deterministic repointer. Gate it with a mandatory dry-run, exclude fixtures and archives, and validate every target exists. Then integrate the hub advisor node and stage the rebuild for main.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] 004 and 005 commits provide ground-truth rename pairs.
- [x] The broken-reference surface is enumerated and the load-bearing subset identified.
- [x] Fixture and archive exclusions are defined.

### Definition of Done
- [x] Deterministic repointer built from ground-truth maps + explicit delete+add fixups.
- [x] Dry-run reviewed; high-risk categories (test fixtures) excluded.
- [x] Sweep applied; 0 residual live broken references.
- [x] Hub advisor node integrated; valid JSON; alias kept.
- [x] Advisor rebuild + reindex documented for main.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Ground-truth deterministic repoint: build the mapping from recorded git renames (not inference), apply longest-match (exact-file over derived-directory), and validate targets on disk.

### Key Components
- **Rename maps**: `git show --find-renames` on 004 (128 pairs) + 005 (42 pairs), plus explicit `code-review` SKILL.md/README.md mappings (005 recorded them as delete+add).
- **Repointer**: derives unambiguous directory mappings (single-destination, subpath-preserving), sorts keys longest-first, excludes `.git`/`node_modules`/`dist`/`changelog`/`specs` and JS/TS test fixtures, dry-run by default.
- **Hub advisor node**: `graph-metadata.json` edges, domains, intent_signals, trigger_phrases.

### Data Flow
Extract rename pairs → build + validate mapping → dry-run + review → apply → grep-verify 0 residual → integrate advisor node → stage rebuild for main → document.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| pre-commit hooks + CI | Hygiene/canary gates | Repoint checker/script paths | CHECKER + workflow paths resolve on disk |
| `.claude/settings.json` | PostToolUse hook | Repoint hook command | hook path resolves |
| hub `graph-metadata.json` | Advisor identity | Repoint key_files; merge review keywords; clean edges | valid JSON; 0 review edges; alias kept |
| agents + deep-loop template | Review doctrine loaders | Repoint `review_core.md` path | new path resolves; `.claude` mirror + `.codex` symlink covered |
| ~70 docs/scripts | Cross-skill references | Deterministic path repoint | residual grep clean |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Repoint the definitely-broken `sk-code-review/` direct path loads.
- [x] Enumerate the full external-reference surface; confirm the pre-commit gate regression.
- [x] Extract ground-truth rename maps from 004 + 005; add delete+add fixups.

### Phase 2: Core
- [x] Build the deterministic repointer with derived-directory mapping + existence validation.
- [x] Dry-run; exclude JS/TS test fixtures and historical archives; review the change surface.
- [x] Apply the sweep.
- [x] Integrate the hub advisor node (edges, domains, intent_signals, alias) and fix the test.sh depth.

### Phase 3: Verification
- [x] Repo-wide residual grep: 0 live broken references (only intentional fixtures remain).
- [x] Load-bearing files (pre-commit, settings, CI, hub key_files) resolve on disk.
- [x] Hub `graph-metadata.json` valid JSON, review keywords merged, 0 dangling edges, alias present.
- [x] Confirm advisor rebuild + reindex are staged for main, not run here.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
| Test Type | Scope | Tools |
|-----------|-------|-------|
| Dry-run diff | Full mapping | repointer `--dry-run`, per-file counts |
| Existence validation | Every mapping target | `os.path.exists` in the builder |
| Residual grep | Repo-wide live surface | ripgrep excluding archives/fixtures |
| JSON validity | Hub graph-metadata | `json.load` |
| Load-bearing spot-check | Hooks, settings, CI, key_files | direct path existence tests |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 004 relocation + 005 fold commits | Internal | Complete | No ground-truth rename data |
| Advisor rebuild + memory reindex (main) | Internal | Pending | Derived skill-graph not regenerated from edited sources |
| 008 routing benchmark | Internal | Pending | Alias removal (009) not yet validated |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
- **Trigger**: A repoint is wrong or the advisor node integration misroutes before 008.
- **Procedure**: All edits are additive text/JSON changes in a git-tracked worktree; `git checkout`/`git reset` to the pre-007 commit reverts them. The sweep is reproducible from `scratchpad/repoint-007.py` + the rename-map TSVs. No destructive filesystem operation occurs in this phase.
<!-- /ANCHOR:rollback -->
