---
title: "Feature Specification: Phase 2: update-and-mirror"
description: "Apply 4 fixed-string substring substitutions across canonical .opencode/, then replicate to .claude/.codex/.gemini via rsync byte-copy and TOML regeneration."
trigger_phrases:
  - "068/002"
  - "update-and-mirror"
  - "sk-doc reference sweep"
  - "create command mirror"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/z_archive/007-sk-doc-organization/002-update-and-mirror"
    last_updated_at: "2026-05-05T08:00:00Z"
    last_updated_by: "claude-orchestrator"
    recent_action: "Authored phase 2 spec.md scope after parent metadata"
    next_safe_action: "Author plan.md/tasks.md, then dispatch cli-codex for substring sweep batches"
    blockers: []
    key_files:
      - .opencode/skills/sk-doc/SKILL.md
      - .opencode/commands/create/assets/create_agent_auto.yaml
      - .opencode/agents/create.md
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase2-authoring"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 2: update-and-mirror

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Pending |
| **Created** | 2026-05-05 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 3 |
| **Predecessor** | 001-relocate |
| **Successor** | 003-verify-and-ship |
| **Handoff Criteria** | Zero residual `rg` hits in active scope; `.opencode↔.claude↔.codex` byte-identical via `diff -rq`; `.gemini` `*.toml` parse cleanly; `.codex/agents/create.toml` regenerated with sandbox + Path Convention preserved |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the Reorganize sk-doc/assets reorganization. After Phase 1 physically moved 4 asset items to `assets/` root and deleted the empty `agents/` subfolder, all dependent references still point to the OLD paths. Phase 2 closes that gap by applying 4 fixed-string substring substitutions across the canonical `.opencode/` tree and then replicating the changes to the other 3 runtime mirrors (`.claude/`, `.codex/`, `.gemini/`).

**Scope Boundary**: Reference-string updates only. No asset content changes. No new files. No file deletions (Phase 1 already deleted `agents/`).

**Dependencies**:
- Phase 001-relocate must be complete (4 git mv + rmdir landed on main)
- Pre-flight `diff -rq .opencode/commands/create/ .claude/commands/create/` must return empty (3-way mirror parity preserved)

**Deliverables**:
- Substring sweep applied to canonical `.opencode/` (~24 files: sk-doc internal + /create:* canonical + @create + install guide)
- `.claude/commands/create/` and `.codex/prompts/create/` byte-identical via `rsync`
- 4 `.gemini/commands/create/*.toml` regenerated (agent, changelog, feature-catalog, testing-playbook)
- `.codex/agents/create.toml` regenerated with workspace-write sandbox + Path Convention preserved
- `.claude/agents/create.md` and `.gemini/agents/create.md` copied from updated `.opencode/agents/create.md`
- One commit on main: `feat(sk-doc): update path references + mirror to 4 runtimes (068/002)`

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
After Phase 1 moves the 4 asset items to `assets/` root, every dependent reference across sk-doc internal docs, `/create:*` commands × 4 runtimes, the `@create` agent × 4 runtimes, and the install guide still points to the OLD paths. Without a coordinated reference sweep, the `/create:*` workflows would fail at template-load time and sk-doc internal docs would render broken links.

### Purpose
Close the path-reference gap by applying 4 fixed-string substring substitutions on the canonical `.opencode/` source, then replicate to `.claude/.codex/` via rsync byte-copy (preserves provable byte-identity) and to `.gemini/` via TOML regeneration (TOML escape rules force regeneration over substring edit).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- 4 fixed-string substring substitutions on canonical `.opencode/` (sk-doc internal: 11 files; /create:* canonical: 11 files; @create + install: 2 files)
- Pre-flight `diff -rq` mirror parity assertion before bulk-copy
- `rsync -a --delete` replication from `.opencode/commands/create/` to `.claude/commands/create/` and `.codex/prompts/create/`
- Regeneration of 4 `.gemini/commands/create/*.toml` files (TOML triple-quoted prompt blocks; `tomllib.loads()` parse-check)
- Regeneration of `.codex/agents/create.toml` (workspace-write sandbox + Path Convention preserved from current frontmatter)
- `cp` of `.opencode/agents/create.md` to `.claude/agents/create.md` and `.gemini/agents/create.md`
- One commit on main with descriptive message

### Out of Scope
- Asset content changes — only path-string references move; template byte-content stays identical
- Phase 1 work (already complete) — physical file moves and rmdir
- Phase 3 work (handed off) — opus verification gate, implementation-summary, graph-metadata refresh
- `barter/coder/` parallel tree — locked out-of-scope at parent
- `z_archive/` and historical iteration logs — immutable history
- sk-doc/changelog/v1.1.3.0.md and v1.4.0.0.md — preserve historical accuracy

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-doc/{SKILL.md,references/global/*.md,references/specific/*.md}` | Modify | Substring sweep for 4 path patterns |
| `.opencode/skills/sk-doc/assets/documentation/frontmatter_templates.md` | Modify | One cross-ref to `../agents/command_template.md` |
| `.opencode/commands/create/{agent,feature-catalog,testing-playbook,changelog}.md` | Modify | Path table + DOC_REF substring sweep |
| `.opencode/commands/create/README.txt` | Modify | Markdown link refs |
| `.opencode/commands/create/assets/create_{agent,feature_catalog,testing_playbook}_{auto,confirm}.yaml` | Modify | YAML execution-path keys (`primary:`, `root_catalog:`, `feature_file:`) |
| `.opencode/agents/create.md` | Modify | Two template-load tables (lines 186-189, 282-285) |
| `.opencode/install_guides/SET-UP - Opencode Agents.md` | Modify | 4 hits |
| `.claude/commands/create/` | Replicate | rsync byte-identity from `.opencode/commands/create/` |
| `.codex/prompts/create/` | Replicate | rsync byte-identity from `.opencode/commands/create/` |
| `.gemini/commands/create/{agent,changelog,feature-catalog,testing-playbook}.toml` | Regenerate | TOML re-escape from updated `.opencode/` `.md` content |
| `.claude/agents/create.md` | Copy | cp from updated `.opencode/agents/create.md` |
| `.gemini/agents/create.md` | Copy | cp from updated `.opencode/agents/create.md` |
| `.codex/agents/create.toml` | Regenerate | TOML re-escape with sandbox + Path Convention |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 4 fixed-string substitutions applied across canonical `.opencode/` (sk-doc internal + /create:* canonical + @create + install guide) | `rg --no-config --no-ignore-vcs 'assets/(documentation/(feature_catalog\|testing_playbook)\|agents/(agent\|command)_template)' .opencode/` returns 0 hits |
| REQ-002 | Pre-flight 3-way mirror parity asserted before bulk copy | `diff -rq .opencode/commands/create/ .claude/commands/create/` returns empty; same for `.opencode↔.codex` |
| REQ-003 | `.claude/commands/create/` and `.codex/prompts/create/` byte-identical to canonical `.opencode/commands/create/` post-rsync | `diff -rq` between any pair returns empty |
| REQ-004 | All 4 `.gemini/commands/create/*.toml` files regenerated and parse cleanly | `python3 -c "import tomllib; tomllib.loads(open('<file>').read())"` exits 0 for each |
| REQ-005 | `.codex/agents/create.toml` regenerated with sandbox + Path Convention block preserved from current frontmatter | grep verifies `workspace-write` sandbox flag present and Path Convention section unchanged |
| REQ-006 | cli-codex used fixed-string substitution (NOT regex) | Codex transcript shows `rg -F` or literal `Edit` calls; no regex metacharacters in substitution patterns |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | One commit on main with descriptive message; no feature branch surviving | `git log -1 --format='%H %s'` matches; `git branch --show-current = main`; no `068-*` branch in `git branch` |
| REQ-008 | Repo-wide residual sweep (excluding archives, spec records, dist, observability, tmp) returns zero hits | `rg --no-config --no-ignore-vcs 'assets/(documentation/(feature_catalog\|testing_playbook)\|agents/)' .opencode .claude .codex .gemini \| grep -vE 'z_archive\|specs/.+/(iterations\|logs\|research\|review)/\|/dist/\|/observability/\|\.tmp/'` returns empty |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 6 P0 + 2 P1 REQs verified with evidence; no residual stale paths in active scope
- **SC-002**: 4-way mirror parity (`.opencode/.claude/.codex/.gemini`) provably consistent (rsync byte-identity for first 3, regenerated TOML semantically equivalent for `.gemini`)

### Given/When/Then Verification Scenarios

**Given** Phase 1 complete (4 git mv + rmdir landed), **When** cli-codex applies 4 fixed-string substitutions to `.opencode/skills/sk-doc/SKILL.md`, **Then** the file contains 0 occurrences of the OLD patterns and N occurrences of the NEW patterns matching the original hit count.

**Given** canonical `.opencode/commands/create/` substring sweep complete, **When** `rsync -a --delete .opencode/commands/create/ .claude/commands/create/` runs, **Then** `diff -rq .opencode/commands/create/ .claude/commands/create/` returns empty.

**Given** `.opencode/commands/create/agent.md` updated, **When** cli-codex regenerates `.gemini/commands/create/agent.toml` by re-escaping the `.md` content into TOML triple-quoted prompt, **Then** `python3 -c "import tomllib; tomllib.loads(open('.gemini/commands/create/agent.toml').read())"` exits 0.

**Given** `.opencode/agents/create.md` updated, **When** cli-codex copies to `.claude/agents/create.md` and `.gemini/agents/create.md`, **Then** the 3 files are byte-identical (`md5sum` match) and the path-references in each match the new layout.

**Given** all canonical edits complete, **When** running `git status --porcelain`, **Then** modifications are staged for one descriptive commit on main.

**Given** the substring sweep complete on all 4 runtimes, **When** running the residual `rg` from REQ-008, **Then** the output is empty (zero residual stale paths).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 1 (001-relocate) must be complete | High — Phase 2 cannot start without moves | Verify via `ls -la .opencode/skills/sk-doc/assets/` and `test ! -e .opencode/skills/sk-doc/assets/agents` before Phase 2 begins |
| Risk | cli-codex hallucinates a search pattern | High — silent corruption of one runtime | Pre-compute exact 4 fixed-string patterns; codex MUST use `rg -F` (literal) flags, not regex |
| Risk | TOML escape drift in `.gemini` regeneration | Medium — broken TOML parse at runtime | Use triple-quoted (`"""`) prompt blocks; post-write `tomllib.loads()` parse-check |
| Risk | 3-way mirror drift before rsync | Medium — stale state propagates | Pre-flight `diff -rq` assertion between B and C; halt if non-empty |
| Risk | rg cache vs reality | Low — false negative on residual check | All `rg` invocations use `--no-config --no-ignore-vcs` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None — all scope/sequencing decisions resolved during planning. Reference plan: `/Users/michelkerkmeester/.claude/plans/reorganize-sk-doc-assets-by-promoting-dynamic-pearl.md`.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->


<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
