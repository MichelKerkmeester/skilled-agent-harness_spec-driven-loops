---
title: "Implementation Plan: Phase 2: update-and-mirror"
description: "4 fixed-string substitutions across canonical .opencode/, then mirror replication via rsync byte-copy and TOML regeneration. cli-codex with workspace-write sandbox executes; Claude orchestrates and audits."
trigger_phrases:
  - "068/002 plan"
  - "update-and-mirror plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/z_archive/007-sk-doc-organization/002-update-and-mirror"
    last_updated_at: "2026-05-05T08:30:00Z"
    last_updated_by: "claude-orchestrator"
    recent_action: "Authored phase 2 plan.md while cli-codex executes the substring sweep"
    next_safe_action: "Author tasks.md, monitor codex completion, then author implementation-summary.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase2-authoring"
      parent_session_id: null
    completion_pct: 30
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 2: update-and-mirror

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | cli-codex (gpt-5.5, reasoning=high, service_tier=fast) + Bash + rsync + Python tomllib |
| **Framework** | Multi-runtime mirror parity (`.opencode/.claude/.codex/.gemini`) |
| **Storage** | Filesystem under each runtime tree |
| **Testing** | `rg --no-config --no-ignore-vcs` residual check; `diff -rq` for byte-identity; `tomllib.loads()` for TOML parse-check |

### Overview
Phase 2 closes the path-reference gap left by Phase 1. cli-codex applies 4 fixed-string substitutions (NOT regex) to ~24 files in canonical `.opencode/`, then bulk-copies to `.claude/.codex/` via `rsync` (preserves provable byte-identity) and regenerates `.gemini/*.toml` via TOML triple-quoted prompt re-escape (substring substitution would break TOML escape rules). Single commit on main: `feat(sk-doc): update path references to assets/ root layout + mirror across 4 runtimes (068/002)`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phase 1 (001-relocate) complete (commit ccd73ef55)
- [x] Pre-flight `diff -rq .opencode/commands/create/ .claude/commands/create/` returns empty (3-way mirror parity preserved)
- [x] On `main` branch with no feature branch surviving from Phase 1
- [x] cli-codex reachable: `codex exec --sandbox workspace-write -c service_tier="fast" -c model="gpt-5.5" -c model_reasoning_effort="high" "..."`

### Definition of Done
- [ ] All 4 fixed-string substitutions applied across canonical `.opencode/` (24 files)
- [ ] `.claude/commands/create/` and `.codex/prompts/create/` byte-identical to canonical (`diff -rq` empty)
- [ ] 4 `.gemini/commands/create/*.toml` regenerated and parse cleanly (`tomllib.loads()` exits 0 each)
- [ ] `.codex/agents/create.toml` regenerated with sandbox + Path Convention preserved
- [ ] `.claude/agents/create.md` and `.gemini/agents/create.md` byte-identical to updated `.opencode/agents/create.md`
- [ ] Residual `rg` returns ZERO hits in active scope
- [ ] One commit on main with prescribed message
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Canonical-edit + mirror-replication. Single source of truth (`.opencode/`) gets edited, mirrors are generated from canonical (rsync byte-copy for `.md`/`.yaml`, regeneration for `.toml`). This pattern eliminates drift risk that comes from per-runtime substring re-edit (substring drift compounds 3× across 3 substring passes).

### Key Components
- **Fixed-string substitution** (4 patterns, executed via codex Edit tool or sed with literal flags): the 4 path-string transformations
- **`rsync -a --delete`** (2×): bulk byte-copy from canonical `.opencode/commands/create/` to `.claude/commands/create/` and `.codex/prompts/create/`
- **TOML regeneration** (4×): `.gemini/commands/create/*.toml` rebuilt from updated `.md` content with triple-quoted prompt blocks, post-write `tomllib.loads()` parse-check
- **TOML regeneration** (1× for codex agent): `.codex/agents/create.toml` rebuilt preserving sandbox + Path Convention

### Data Flow
```
canonical .opencode/        rsync          .claude/.codex/  (byte-identical)
              \             ────►
               \
                \           regen          .gemini/*.toml  (semantically equivalent)
                 ────►
                            cp             .claude/agents/create.md, .gemini/agents/create.md  (byte-identical)
                            ────►
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup (cli-codex pre-flight)
- [ ] Verify on `main` branch
- [ ] `diff -rq .opencode/commands/create/ .claude/commands/create/` returns empty
- [ ] `diff -rq .opencode/commands/create/ .codex/prompts/create/` returns empty

### Phase 2: Core Implementation (cli-codex executes; halt on any failure)
- [ ] Apply 4 fixed-string substitutions to 11 sk-doc internal files (B.1)
- [ ] Apply 4 fixed-string substitutions to 11 /create:* canonical files (B.2)
- [ ] Apply 4 fixed-string substitutions to 2 @create + install guide files (B.3)
- [ ] `rsync -a --delete .opencode/commands/create/ .claude/commands/create/`
- [ ] `rsync -a --delete .opencode/commands/create/ .codex/prompts/create/`
- [ ] Regenerate `.gemini/commands/create/agent.toml` (TOML triple-quoted prompt)
- [ ] Regenerate `.gemini/commands/create/changelog.toml`
- [ ] Regenerate `.gemini/commands/create/feature-catalog.toml`
- [ ] Regenerate `.gemini/commands/create/testing-playbook.toml`
- [ ] Regenerate `.codex/agents/create.toml` (preserve sandbox + Path Convention)
- [ ] `cp .opencode/agents/create.md .claude/agents/create.md`
- [ ] `cp .opencode/agents/create.md .gemini/agents/create.md`

### Phase 3: Verification
- [ ] Residual `rg` returns ZERO hits across active scope
- [ ] `diff -rq` confirms `.opencode↔.claude` and `.opencode↔.codex` byte-identical
- [ ] `tomllib.loads()` parse-check exits 0 for all 4 `.gemini/*.toml` and `.codex/agents/create.toml`
- [ ] One commit on main with prescribed message
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Each substring substitution per file | Codex Edit tool with literal find/replace |
| Integration | Cross-runtime mirror parity | `diff -rq` (byte-identity), `tomllib.loads()` (TOML parse) |
| Manual | Sample 3 random files for content drift | `cat <file>` and visual confirmation |
| Residual | Repo-wide stale path detection | `rg --no-config --no-ignore-vcs` with active-scope filter |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 1 (001-relocate) commit ccd73ef55 | Internal | Green | Cannot start Phase 2; references would substitute against missing source paths |
| `rsync` (>= 3.0) | External | Green | Fall back to `cp -R` (loses byte-identity guarantees) |
| Python 3 with `tomllib` (3.11+) | External | Green | Fall back to manual TOML inspection |
| cli-codex with workspace-write sandbox | External | Green | Fall back to direct Bash sed (Claude orchestrator scope creep) |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Residual `rg` non-zero, mirror parity fail, TOML parse fail, or unexpected files modified
- **Procedure**: `git reset --hard ccd73ef55` (rolls back to end of Phase 1; Phase 2 commit cleanly reverted)
- **Granularity**: One commit covers Phase 2 entirely. Surgical rollback returns repo to post-Phase-1 state.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
