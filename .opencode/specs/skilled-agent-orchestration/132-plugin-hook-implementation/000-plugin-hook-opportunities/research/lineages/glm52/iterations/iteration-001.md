# Iteration 1: sk-git, sk-code, and system-spec-kit hook/plugin candidates

## Focus

Inventory the sk-git, sk-code, and system-spec-kit skill families for latent behaviors that could be promoted to OpenCode plugins or Claude hooks, focusing on scripts that already have a proven runtime contract.

## Findings

### Candidate 1: Git Commit Message Guard (sk-git → Claude PreToolUse/Bash + OpenCode tool.execute.before)

**Source skill:** `.opencode/skills/sk-git/SKILL.md` (commit workflows, conventional commits)
**Runtime surface:** Claude `PreToolUse` matcher `Bash` + OpenCode `tool.execute.before`

The sk-git skill defines conventional commit format enforcement (`type(scope): description`), branch naming conventions (`wt/{NNNN}-{name}`), and safety refusals (no `--no-verify`, no force-push to main, no secrets in diff, no amending published commits). These are documented in `manual_testing_playbook/03--safety-refusals/`. Currently these are purely advisory — the skill instructs the agent, but nothing enforces them at the tool-call boundary.

A `PreToolUse`/Bash hook (Claude) or `tool.execute.before` (OpenCode) plugin could intercept `git commit`, `git push --force`, and `git commit --amend` commands and:
- Validate commit message format against conventional-commits spec
- Block `--no-verify` flag (matches manual_testing_playbook safety refusal)
- Block `--force` to `main`/`master`/`trunk` (matches safety refusal)
- Warn on amend when the commit is already pushed

**Blast radius:** Medium (enforce/block). Must fail-open to avoid blocking legitimate operations. Pattern is identical to `mk-deep-loop-guard.js`'s `tool.execute.before` interception.

[SOURCE: .opencode/skills/sk-git/SKILL.md:2-6]
[SOURCE: .opencode/skills/sk-git/manual_testing_playbook/03--safety-refusals/no-verify-bypass-refused.md]
[SOURCE: .opencode/skills/sk-git/manual_testing_playbook/03--safety-refusals/force-push-to-main-refused.md]
[SOURCE: .opencode/plugins/mk-deep-loop-guard.js:42-67]

### Candidate 2: Comment Hygiene PostToolUse Hook (sk-code → Claude PostToolUse/Write|Edit + OpenCode tool.execute.after)

**Source skill:** `.opencode/skills/sk-code/code-quality/scripts/check-comment-hygiene.sh`
**Runtime surface:** Claude `PostToolUse` matcher `Write|Edit` + OpenCode `tool.execute.after`

The `check-comment-hygiene.sh` script (215 lines, Python) already detects ephemeral artifact labels in code comments — packet/phase references, ADR/REQ/CHK/task IDs, spec paths, etc. It supports JS/TS/Python/Shell/JSONC and has an escape hatch (`hygiene-ok`). Currently this script runs only when the agent manually invokes it during the quality gate phase.

The existing `PostToolUse/Write|Edit` hook (`claude-posttooluse.sh`) already runs `check-dist-staleness.sh` after file writes. Adding `check-comment-hygiene.sh` to the same hook surface (or a sibling hook) would catch violations at write-time rather than at quality-gate time, when the violation is freshest and cheapest to fix.

For OpenCode, a `tool.execute.after` plugin would serve the same role, inspecting the edited file path after a Write/Edit tool call completes.

**Blast radius:** Low (observe/advise). The hook would output violations to stderr/context but not block the write. This matches the existing dist-freshness pattern exactly.

[SOURCE: .opencode/skills/sk-code/code-quality/scripts/check-comment-hygiene.sh:1-215]
[SOURCE: .claude/settings.json:112-123]
[SOURCE: .opencode/plugins/mk-dist-freshness-guard.js (analogous warn-only pattern)]

### Candidate 3: Spec Validation PostToolUse Hook (system-spec-kit → Claude PostToolUse/Write|Edit)

**Source skill:** `.opencode/skills/system-spec-kit/scripts/spec/validate.sh` (1243 lines)
**Runtime surface:** Claude `PostToolUse` matcher `Write|Edit`

The `validate.sh` script is the central spec-folder validator (structure, anchors, evidence markers, generated-metadata integrity, continuity freshness, command-tree parity). It currently runs manually or at completion-claim time. Several sub-checks — `check-placeholders.sh`, `check-template-staleness.sh`, `quality-audit.sh` — could be selectively run as a lightweight PostToolUse hook when a Write/Edit targets a `specs/**/` or `.opencode/specs/**/` path.

A bounded variant: when a spec doc is edited, run `check-placeholders.sh` (detects unresolved `TODO`/`PLACEHOLDER` markers) and anchor-structure validation on just the edited file, surfacing issues immediately rather than at completion-claim time.

**Blast radius:** Low (observe/advise). Only triggers on spec-folder paths, not arbitrary files.

[SOURCE: .opencode/skills/system-spec-kit/scripts/spec/validate.sh:1-60]
[SOURCE: .opencode/skills/system-spec-kit/scripts/spec/check-placeholders.sh]
[SOURCE: .opencode/skills/system-spec-kit/scripts/spec/quality-audit.sh]

### Candidate 4: Code-Graph Re-index Trigger (system-code-graph → OpenCode tool.execute.after + Claude PostToolUse/Write|Edit)

**Source skill:** `.opencode/skills/system-code-graph/SKILL.md`
**Runtime surface:** OpenCode `tool.execute.after` + Claude `PostToolUse/Write|Edit`

The code graph is currently re-indexed manually via `code_graph_scan` or on SessionStart. After code edits, the graph goes stale until the next explicit scan. A `tool.execute.after` plugin (OpenCode) or `PostToolUse/Write|Edit` hook (Claude) could trigger an incremental re-index of just the edited file, keeping the graph fresh without a full rescan.

The incremental scan capability already exists in `code_graph_scan({ incremental: true })`. A hook would call it with the specific file path, debounced to avoid thrashing on rapid edits.

**Blast radius:** Low (background observe). Must debounce and not block the edit.

[SOURCE: .opencode/skills/system-code-graph/SKILL.md]
[SOURCE: opencode.json:69-86 (mk_code_index MCP config)]

## Sources Consulted

- `.opencode/skills/sk-git/SKILL.md` (lines 1-80)
- `.opencode/skills/sk-git/manual_testing_playbook/03--safety-refusals/` (4 safety refusal scenarios)
- `.opencode/skills/sk-code/code-quality/scripts/check-comment-hygiene.sh` (full file)
- `.opencode/skills/sk-code/code-quality/scripts/hooks/claude-posttooluse.sh` (existing PostToolUse hook)
- `.opencode/skills/system-spec-kit/scripts/spec/validate.sh` (lines 1-60)
- `.claude/settings.json` (existing hooks)
- `.opencode/plugins/README.md` (existing 7 plugins)
- `.opencode/plugins/mk-deep-loop-guard.js` (tool.execute.before pattern)
- `opencode.json` (MCP server config)

## Assessment

- **newInfoRatio:** 1.0 — First iteration; all 4 candidates are new to this packet
- **Novelty justification:** First evidence-gathering pass; every finding is net-new
- **Confidence:** High — all candidates grounded in real scripts with proven runtime contracts

## Reflection

**What worked:** Starting with skills that have existing scripts (proven runtime contracts) yielded immediately promotable candidates. The PostToolUse/dist-freshness pattern is a proven template for adding new observability hooks.

**What failed:** Nothing yet — broad survey phase.

**Ruled out:** None yet.

## Recommended Next Focus

Inventory sk-doc (frontmatter version checking, flowchart validation, DQI scoring), sk-prompt (prompt quality), and sk-design (design audit) for hook promotion candidates.
