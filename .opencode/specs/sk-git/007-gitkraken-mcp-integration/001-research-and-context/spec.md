---
title: "Feature Specification: Phase 1: research-and-context"
description: "Research gate for the GitKraken MCP integration program: verify the real tool surface, config shape, and auth state of the locally installed gk CLI, and resolve the read/write safety-carve-out design against sk-git's existing rules."
trigger_phrases:
  - "gitkraken mcp research"
  - "gk cli tool inventory"
  - "gitkraken mcp safety carve-out"
  - "phase 001 research-and-context"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/128-gitkraken-mcp-integration/001-research-and-context"
    last_updated_at: "2026-07-10T06:21:30Z"
    last_updated_by: "claude"
    recent_action: "Captured the full 31-tool surface via gk mcp --list-tools"
    next_safe_action: "Proceed to phase 002 using the recorded config-shape decision"
    blockers: []
    key_files:
      - ".opencode/specs/skilled-agent-orchestration/128-gitkraken-mcp-integration/001-research-and-context/spec.md"
      - ".opencode/specs/skilled-agent-orchestration/128-gitkraken-mcp-integration/001-research-and-context/implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-001-research-and-context"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "gk CLI already installed via Homebrew (/opt/homebrew/bin/gk) and authenticated (whoami: MichelKerkmeester, GitHub connected) — README's tool list was incomplete; `gk mcp --list-tools` is the ground truth"
      - "31 real tools exist across 6 groups: app-internal (2, forbidden), local git mutations/reads (11), GitLens AI workflows (5), GitKraken workspaces (1), issue management (3), PR management (5), repository read (1)"
      - "`gk mcp config claude` emits {command: <local gk path>, args: [mcp, --host=claude], type: stdio} but the repo convention for portability is npx -y <pkg> mcp, matching every other .utcp_config.json manual"
      - "Decision: register WITHOUT --readonly (user explicitly wants gitlens_commit_composer and pull_request_create_review, both write-capable); safety is enforced by routing discipline in sk-git docs/rules, not by disabling the transport's write surface"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 1: research-and-context

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-07-10 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 5 |
| **Predecessor** | None |
| **Successor** | 002-utcp-config-registration |
| **Handoff Criteria** | Verified tool inventory, config shape, and a resolved read/write safety-carve-out decision are ready for phase 002 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The GitKraken MCP integration program (see `../spec.md`) needs ground truth before any file changes: the GitHub README under-documents the real tool surface (it names only 3 example tools against a real 31), the correct `.utcp_config.json` config shape isn't obvious (the CLI's own config generator emits a machine-local form, not the repo's portable `npx` convention), and whether to register the server read-only or read+write is a real safety tradeoff against sk-git's existing ask-first/no-direct-branch/conventional-commit rules.

### Purpose
Establish verified, evidence-backed answers to all three questions by querying the locally installed, authenticated `gk` CLI directly, so phases 002-004 implement from facts instead of assumptions.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Querying the locally installed `gk` CLI (`--version`, `whoami`, `mcp --help`, `mcp --list-tools`, `mcp config claude`) for ground-truth tool inventory, auth state, and config shape.
- Reading existing repo files for convention context: `.utcp_config.json`, `sk-git/SKILL.md`, `sk-git/references/github_mcp_integration.md`, `sk-git/graph-metadata.json`, the advisor's `explicit.ts` lane.
- Resolving the read/write safety-carve-out design decision.

### Out of Scope
- Any file modification outside this phase folder — this is a read-only research gate.
- Live end-to-end testing of the `npx @gitkraken/gk mcp` form (deferred to phase 005).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` | Create | Phase-local research artifacts only |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### REQ-001: Verify the real GitKraken MCP tool surface
Run `gk mcp --list-tools` (the CLI is already installed and authenticated on this machine) rather than trusting the GitHub README's partial tool list. **Verified: 31 tools**, grouped:

| Group | Tools | Note |
|---|---|---|
| App-internal (FORBIDDEN) | `app_tool_box`, `app_update_user_preferences` | Tool descriptions explicitly say "App-only — agents must not call this tool" |
| Local git — reads | `git_status`, `git_log_or_diff`, `git_blame`, `git_branch` (list) | Overlaps local `git`/Bash; MCP adds no value for these, prefer Bash |
| Local git — mutations | `git_add_or_commit`, `git_push`, `git_pull`, `git_fetch`, `git_checkout`, `git_branch` (create), `git_worktree` (add), `git_stash` | Directly bypasses sk-git's ask-first worktree rule, no-direct-branch rule, and conventional-commit format if called instead of Bash |
| GitLens AI workflows | `git_commit_composer`, `gitlens_commit_composer`, `git_graph`, `git_resolve`, `gitlens_launchpad`, `gitlens_start_review`, `gitlens_start_work` | High-value, no local equivalent; `gitlens_start_review`/`gitlens_start_work` create worktrees internally |
| GitKraken workspaces | `gitkraken_workspace_list` | No local equivalent |
| Issues | `issues_add_comment`, `issues_assigned_to_me`, `issues_create`, `issues_get_detail` | Cross-provider (GitHub/GitLab/Azure DevOps/Bitbucket/Jira) |
| Pull requests | `pull_request_assigned_to_me`, `pull_request_create`, `pull_request_create_review`, `pull_request_get_comments`, `pull_request_get_detail` | Cross-provider; richer than `gh` CLI or GitHub MCP for non-GitHub remotes |
| Repository | `repository_get_file_content` | Cross-provider remote file read |

### REQ-002: Confirm auth and install state
`gk whoami` confirms the CLI is authenticated as `MichelKerkmeester <michelkerkmeester@pm.me>` with GitHub connected as a provider. `gk --version` / `git version 2.50.1 (Apple Git-155)` confirms a working install at `/opt/homebrew/bin/gk`.

### REQ-003: Resolve the config shape for `.utcp_config.json`
`gk mcp config claude` returns `{"command": "<local gk path>", "args": ["mcp", "--host=claude"], "type": "stdio"}` — this is the *locally installed* form. Every existing manual in `.utcp_config.json` (github, figma, clickup, chrome_devtools) instead uses `npx -y <pkg>[@version] ...` for portability across machines that don't already have the CLI installed. **Decision: use the npx form** (`command: "npx"`, `args: ["-y", "@gitkraken/gk", "mcp"]`) to match repo convention and avoid a hard local-install dependency.

### REQ-004: Resolve the read/write safety carve-out
`gk mcp --readonly` exists ("only allow read operations") but the user's own request explicitly names `gitlens_commit_composer` and `pull_request_create_review` as tools sk-git should use — both are write-capable. Disabling writes at the transport level would silently break the exact tools the user asked for.

**Decision**: register the manual with full read+write capability. Safety is enforced by *routing discipline* documented in phase 003's reference doc and `SKILL.md` rules, not by disabling the transport:
- Local-git-mutation tools (`git_add_or_commit`, `git_push`, `git_branch` create, `git_checkout`, `git_worktree` add, `git_stash`) MUST NOT be used as a substitute for sk-git's existing Bash-based workflow (ask-first worktree, conventional commits, no direct branch creation) — mirrors the existing GitHub MCP precedent ("Do not create branches via GitHub MCP; use local git worktree add -b").
- `app_tool_box` / `app_update_user_preferences` are forbidden outright (the tool descriptions self-declare app-only).
- `gitlens_start_review` / `gitlens_start_work` create worktrees internally — treat as worktree-creation actions subject to the same ask-first spirit, not auto-invoked.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The GitKraken MCP tool inventory used by every later phase is the real, verified output of `gk mcp --list-tools` — not the incomplete README — with an exact tool count and grouping.
- **SC-002**: The `.utcp_config.json` config shape and the read/write safety-carve-out decision are both resolved with a documented rationale, ready to drive phases 002-004 without further research.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Locally installed, authenticated `gk` CLI | Without it, the tool inventory would rely on the incomplete README only | Confirmed present and authenticated via `gk whoami` before proceeding |
| Risk | GitKraken CLI is explicitly labeled "public preview" | Tool names/parameters may drift after this snapshot | Documented as a known limitation in `implementation-summary.md`; re-verify with `gk mcp --list-tools` if revisited much later |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None outstanding. All three research questions (tool surface, config shape, read/write safety) were resolved with evidence during this phase.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:testing -->
## 8. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Live CLI probe | GitKraken MCP tool surface | `gk mcp --list-tools`, `gk whoami`, `gk mcp config claude` |
| Convention check | `.utcp_config.json` config shape | Manual diff against existing `github`/`figma` manual entries |
<!-- /ANCHOR:testing -->

---

## RELATED DOCUMENTS

- **Plan**: See `plan.md`
- **Tasks**: See `tasks.md`
- **Implementation Summary**: See `implementation-summary.md`
- **Parent Spec**: See `../spec.md`
