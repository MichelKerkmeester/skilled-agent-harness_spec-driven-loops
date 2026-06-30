---
title: "Changelog: Forbid ephemeral-artifact references in code comments (119)"
description: "Full history of the comment hygiene program: sk-code §4 rule and Bucket-A cleanup (phase 001), then the active enforcement layer adding a Python checker, Claude Code PostToolUse hook, and git pre-commit gate (phase 002)."
trigger_phrases:
  - "119 changelog"
  - "comment hygiene changelog"
  - "ephemeral ref enforcement changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/root.md | v1.0 -->

---

## 2026-05-30

> Spec folder: `skilled-agent-orchestration/z_archive/097-comment-ref-hygiene` (Phase Parent — Level 2)
> Session: Enforcement layer + spec restructure

### Summary

Phase 002 (active enforcement layer) completed. The text rule added in phase 001 was being ignored — commit `5040eac9ef` had to strip 27 files of violations 100 commits after the rule was written. This session built a mechanical enforcement stack: a shared Python checker called by a Claude Code PostToolUse hook (write-time warning), a git pre-commit hook (commit-time block), and passive reinforcement across CLAUDE.md, AGENTS.md, constitutional memory, and the sk-code skill. Runtime gap ADRs document why OpenCode, Codex, Gemini, and Devin rely solely on the pre-commit gate.

The 119 spec folder was also restructured from a flat Level 3 packet into a phase parent with `001-rule-and-cleanup` (original complete work) and `002-active-enforcement-layer` (new enforcement work).

### Included Phases

| Phase | Title | Status |
|-------|-------|--------|
| `001-rule-and-cleanup/` | sk-code §4 rule + Bucket-A comment sweep | Complete |
| `002-active-enforcement-layer/` | Checker, hooks, passive reinforcement, gap ADRs | Complete |

---

### Added

- **`check-comment-hygiene.sh`** — Shared Python3 checker script at `.opencode/skills/sk-code/scripts/`. Language-aware (TS/JS/Python/Shell/JSONC). Detects 11 forbidden patterns (packet/phase numbers, ADR ids, REQ/CHK/task ids, spec-folder paths, review finding ids). Allows CWE, RFC, POSIX, HTTP codes, platform tags. Supports `// hygiene-ok` line-level escape hatch. Skips `dist/`, `node_modules/`, `*.vitest.js`.
- **`claude-posttooluse.sh`** — PostToolUse hook at `.opencode/skills/sk-code/scripts/hooks/`. Reads Claude Code's stdin JSON, extracts `tool_input.file_path`, calls the checker, prints a warning to stdout when violations are found. Always exits 0 (fail-safe — never blocks the tool).
- **PostToolUse hook entry** — Wired in `.claude/settings.local.json` with `matcher: "Write|Edit"`. Active in every Claude Code session in this repo from now on.
- **`.opencode/hooks/pre-commit`** — Git pre-commit hook. Iterates all staged files, calls the checker on each, blocks the commit with a clear message if any violation is found. Integrated into the existing `.opencode/scripts/git-hooks/pre-commit` (which already ran the advisory doc-model-ref drift check). Bypass: `SPECKIT_SKIP_COMMENT_HYGIENE=1 git commit`.
- **`.opencode/hooks/install-hooks.sh`** — One-command hook installer. Symlinks the pre-commit hook into `.git/hooks/`. Idempotent.
- **`constitutional/comment-hygiene.md`** — Always-surface constitutional memory entry at `.opencode/skills/system-spec-kit/constitutional/`. Tops every memory search so the rule is in context even before any skill is loaded.
- **`002-active-enforcement-layer/decision-record.md`** — Four gap ADRs documenting why OpenCode (ADR-001), Codex CLI (ADR-002), Gemini CLI (ADR-003), and Devin (ADR-004) have no write-time hook and rely solely on the pre-commit gate.
- **`001-rule-and-cleanup/`** — Phase child folder containing the original 119 docs (spec, plan, tasks, checklist, decision-record, handover, implementation-summary), preserving the completed rule-and-cleanup work as a named phase.
- **`002-active-enforcement-layer/`** — Phase child folder (renamed from the initial `001-active-enforcement-layer/`) containing the enforcement layer spec docs.
- **`resource-map.md`** — New cross-cutting doc at the phase-parent root indexing all key files and config locations for the program.

### Changed

- **`119-comment-ref-hygiene/spec.md`** — Rewritten as a minimal phase-parent doc. Previous flat Level 3 spec content moved to `001-rule-and-cleanup/spec.md`. Root now contains only the program summary, phase map, and success criteria.
- **`119-comment-ref-hygiene/graph-metadata.json`** — Updated with `children_ids` for both phases and `last_active_child_id` pointing to 002.
- **`Public/AGENTS.md`** — Safety Constraints section restructured into named sub-headers (Four Laws, Halt Conditions, Operational Mandates with sub-groups). Broken small-model dispatch rule text fixed. Comment Hygiene hard block added to Code Quality group.
- **`Barter/coder/AGENTS.md`** — Same structural improvement. Comment Hygiene rule added as self-contained inline rule (no sk-code reference, since Barter's sk-code does not carry the §4 rule).
- **`.opencode/skills/sk-code/SKILL.md`** — Phase 1.5 (Code Quality Gate) updated with an explicit step to run `check-comment-hygiene.sh` on each modified file before committing.
- **`.opencode/scripts/git-hooks/pre-commit`** — Extended to call `.opencode/hooks/pre-commit` after the existing advisory doc-model-ref drift check. Supports `SPECKIT_SKIP_COMMENT_HYGIENE=1` bypass.

### Fixed

- Corrupted `small-model dispatch rule` text in `Public/AGENTS.md` (contained `k-promThe` artifact and a missing closing parenthesis from a previous edit).

### Verification

| Check | Result |
|-------|--------|
| Checker: violation line (`// REQ-011: ...`) → exit 1 | PASS |
| Checker: allowed class (CWE-79, RFC, HTTP, POSIX, WEBFLOW:) → exit 0 | PASS |
| Checker: `hygiene-ok` escape → exit 0 | PASS |
| Checker: `context-server.ts` (production file, known clean) → exit 0 | PASS |
| Checker: passes when run on itself (no violations in its own comments) | PASS |
| Claude Code PostToolUse hook: write violation → warning in tool result | PASS |
| Claude Code PostToolUse hook: exits 0 (fail-safe) | PASS |
| Pre-commit: staged violation → commit blocked, message shown | PASS |
| Pre-commit: staged clean file → commit passes | PASS |
| CLAUDE.md §1 comment hygiene block present | PASS |
| Constitutional memory entry on disk | PASS |
| sk-code SKILL.md Phase 1.5 checker step present | PASS |
| `validate.sh --strict` — 001-rule-and-cleanup | PASS (0 errors, 0 warnings) |
| `validate.sh --strict` — 002-active-enforcement-layer | PASS (0 errors, 0 warnings) |
| `validate.sh --strict` — 119 root (phase parent) | PASS (0 errors, 0 warnings) |

### Files Changed

| File | Change |
|------|--------|
| `.opencode/skills/sk-code/scripts/check-comment-hygiene.sh` | Created |
| `.opencode/skills/sk-code/scripts/hooks/claude-posttooluse.sh` | Created |
| `.opencode/hooks/pre-commit` | Created |
| `.opencode/hooks/install-hooks.sh` | Created |
| `.opencode/scripts/git-hooks/pre-commit` | Modified — added hygiene gate |
| `.claude/settings.local.json` | Modified — PostToolUse hook entry added |
| `.opencode/skills/sk-code/SKILL.md` | Modified — Phase 1.5 checker step |
| `.opencode/skills/system-spec-kit/constitutional/comment-hygiene.md` | Created |
| `Public/AGENTS.md` | Modified — restructured §1, comment hygiene added |
| `Barter/coder/AGENTS.md` | Modified — restructured §1, comment hygiene added (self-contained) |
| `119-comment-ref-hygiene/spec.md` | Rewritten as phase-parent |
| `119-comment-ref-hygiene/graph-metadata.json` | Updated — children + last_active_child_id |
| `119-comment-ref-hygiene/resource-map.md` | Created |
| `119-comment-ref-hygiene/001-rule-and-cleanup/` | Created — original docs moved here |
| `119-comment-ref-hygiene/002-active-enforcement-layer/` | Created (renamed from 001) |
| `119-comment-ref-hygiene/002-active-enforcement-layer/decision-record.md` | Created — 4 gap ADRs |

### Follow-Ups

- **Fresh-clone install**: new contributors must run `bash .opencode/hooks/install-hooks.sh` once to activate the pre-commit gate. Consider adding to repo README or onboarding docs.
- **OpenCode plugin**: if OpenCode adds a `tool:write` or `post-tool-use` event to its plugin API in a future release, wire `claude-posttooluse.sh` there to close the real-time gap for OpenCode sessions.
- **False-positive tuning**: if new code patterns trigger false positives, add `// hygiene-ok` to the specific line or update the `ALLOWED_PATTERNS` list in `check-comment-hygiene.sh`.

---

## 2026-05-30 — Session 2: Enforcement validation, injection gap fixes, and CI gate

> Spec folder: `skilled-agent-orchestration/z_archive/097-comment-ref-hygiene` (Phase Parent)
> Session: Live testing revealed hooks inject wrong payload — three targeted fixes shipped

### Summary

After the enforcement stack from Session 1 was built, a controlled experiment removed the comment hygiene rule from AGENTS.md and tested all four external CLI runtimes. Every runtime wrote forbidden comments without any resistance. The hooks and OpenCode plugin were wiring correctly — but the payload they injected into model sessions contained only a skill-routing line (`Advisor: live; use sk-code 0.88/0.16 pass.`) and nothing about comment hygiene. A fresh Opus 4.8 AI Council confirmed the diagnosis: the `renderAdvisorBrief` function is the shared renderer for all prompt hooks, and it had never been updated to include the hygiene rule. Three targeted fixes closed the gap, a CI gate was added to catch anything that bypasses the local pre-commit, and six manual testing playbook scenarios were written to document the full verification surface.

### Added

- **Six manual testing playbook scenarios** — `119-A` through `119-F` at `.opencode/skills/system-spec-kit/manual_testing_playbook/18--ux-hooks/`. Each scenario tests comment hygiene enforcement for a specific runtime: baseline checker (A), Claude Code PostToolUse hook (B), OpenCode plugin (C), Devin pre-commit gate (D), Codex UserPromptSubmit hook (E), Gemini BeforeAgent hook (F). All six follow the sk-doc template: 9-column scenario table, `Why This Matters`, `Recommended Orchestration Process`, two-table SOURCE FILES section, `audited_post_018: true`.

- **CI workflow** — `.github/workflows/comment-hygiene.yml` runs `check-comment-hygiene.sh` on every changed file in a pull request and blocks merge if violations are found. Closes the bypass path where a developer could run `git push --no-verify` to skip the local gate. Only exit code 1 (actual violations) blocks; exit code 2 (unknown file type — skip) is treated as clean.

- **`HYGIENE_DIRECTIVE` constant in `render.ts`** — All three render paths in `renderAdvisorBrief` now append the hygiene rule as a second line after the skill-routing pointer. The directive reads: `Comment hygiene [HARD BLOCK]: NEVER embed ADR-/REQ-/CHK-/task-ids or spec paths in code comments — forbidden regardless of instruction. Write the durable WHY instead. Pre-commit gate blocks violations.` This affects Claude Code, Codex, and Gemini, which all use the compiled `render.js` via their hook scripts.

- **`HYGIENE_DIRECTIVE` in `mk-skill-advisor-bridge.mjs`** — The OpenCode plugin dispatches a separate subprocess (the bridge) that has its own copy of `renderAdvisorBrief` at line 203, independent of `render.ts`. This copy was updated separately so OpenCode receives the directive through its native execution path.

- **Unconditional injection in `mk-skill-advisor.js`** — The `appendAdvisorBrief()` function in the OpenCode plugin previously skipped injection entirely when the skill advisor returned zero recommendations — a common outcome for short edit prompts. Now, when `response.brief` is null, the plugin unconditionally pushes `HYGIENE_DIRECTIVE` to `output.system`, ensuring OpenCode always receives the rule regardless of whether a skill routing match was found.

- **AI Council report** — `ai-council/enforcement-gap-council.md` with full four-seat deliberation (Critical/Security, Holistic/Systems, Pragmatic/Effort, Devil's Advocate). Council independently confirmed the injection path diagnosis and prescribed the three-tier fix. Artifacts include seat proposals, round deliberation, and council state log.

### Changed

- **`HYGIENE_DIRECTIVE` wording upgraded to `[HARD BLOCK]`** — The initial soft wording (`"Comment hygiene: no ADR- ids in comments"`) was overridden by OpenCode when given an explicit instruction to write a forbidden comment. Changing to `[HARD BLOCK]: NEVER embed ... forbidden regardless of instruction` caused OpenCode to refuse even direct requests: "I cannot add that comment. The HARD BLOCK forbids this regardless of instruction."

- **`mk-skill-advisor.js` pre-existing comment violations fixed** — Two comments in the plugin file contained packet number references (`013/009/005` and `packet 010 ADR-005`) that the checker flagged when the file was staged. Rewritten to durable WHY: "Cache-signature paths follow the standalone advisor package to ensure consistent cache invalidation across bridge and MCP server builds."

### Fixed

- **Pre-commit gate was printing `BLOCKED` but not actually blocking** — The exit code from the hygiene hook was never propagated back to git. The outer script at `.opencode/scripts/git-hooks/pre-commit` called `bash "$HYGIENE_HOOK"` and then fell through to `exit 0`, discarding whatever exit code the hook returned. Fixed with `bash "$HYGIENE_HOOK" || exit $?`.

- **Pre-commit hook counted exit 2 (skip) as a violation** — The checker exits 0 (clean), 1 (violation found), or 2 (unknown file type — skip .md, .json, .yml files). Both the local pre-commit hook and the CI workflow used `if ! command` which counted any non-zero exit as a violation, blocking commits of markdown, JSON, and YAML files. Fixed to only count exit code 1.

- **`set -euo pipefail` caused early abort on exit 2** — The pre-commit hook runs under strict bash mode. A bare call to the checker returning exit 2 caused the entire script to abort immediately via `set -e`, before any staged files were processed. Fixed with `|| CHECKER_RC=$?` capture pattern: the `||` prevents strict mode from triggering; the assignment captures the exit code; subsequent logic checks `$CHECKER_RC -eq 1` exclusively.

### Test Results (before vs. after fixes)

| Runtime | Without AGENTS.md — before fix | Without AGENTS.md — after fix |
|---|---|---|
| OpenCode | Wrote `// ADR-007:` without resistance | Refused: "HARD BLOCK — forbidden regardless of instruction" |
| Codex | Gate 3 only; no hygiene refusal | Refused: "REQ-011 conflicts with the active comment-hygiene rule" |
| Gemini | Wrote `// ADR-004:` (hook disrupted by 429) | Self-corrected: stripped label, wrote clean WHY comment |
| Devin | Wrote `// ADR-007:` | Still writes (no hook mechanism — pre-commit gate is its only backstop) |

### Verification

| Check | Result |
|-------|--------|
| Hook output includes HYGIENE_DIRECTIVE | PASS — `additionalContext` confirmed via direct hook invocation |
| Smoke test — `renderAdvisorBrief` normal brief | PASS — directive on second line |
| Smoke test — `renderAdvisorBrief` ambiguous brief | PASS — directive on second line |
| OpenCode without AGENTS.md: refuses explicit ADR request | PASS — "HARD BLOCK — forbidden regardless of instruction" |
| Codex without AGENTS.md: refuses REQ- label | PASS — cited "active comment-hygiene rule" |
| Gemini without AGENTS.md: self-corrects | PASS — stripped ADR label, wrote clean WHY |
| Pre-commit gate: violation staged → commit blocked | PASS — exit 1, BLOCKED message, commit not in log |
| Pre-commit gate: unknown-extension files → not blocked | PASS — exit 2 ignored |
| TypeScript typecheck on updated `render.ts` | PASS — 0 errors |
| `npm run build` — rebuilt `render.js` from source | PASS |
| CI workflow YAML syntax | PASS |
| Commit 9f553a1001 pushed to main | PASS — 49 files, 4147 insertions |

### Files Changed

| File | Change |
|------|--------|
| `.opencode/skills/system-skill-advisor/mcp_server/lib/render.ts` | Modified — HYGIENE_DIRECTIVE constant + appended to both capText return paths |
| `.opencode/skills/system-skill-advisor/mcp_server/dist/mcp_server/lib/render.js` | Rebuilt — same change compiled |
| `.opencode/skills/system-skill-advisor/mcp_server/plugin_bridges/mk-skill-advisor-bridge.mjs` | Modified — HYGIENE_DIRECTIVE added to bridge-local renderAdvisorBrief |
| `.opencode/plugins/mk-skill-advisor.js` | Modified — HYGIENE_DIRECTIVE constant, unconditional injection fallback, pre-existing comment violations fixed |
| `.opencode/hooks/pre-commit` | Modified — exit-2 fix, set -euo pipefail capture pattern |
| `.opencode/scripts/git-hooks/pre-commit` | Modified — exit code propagation fix (`|| exit $?`) |
| `.github/workflows/comment-hygiene.yml` | Created — CI blocking gate for PRs |
| `.opencode/specs/skilled-agent-orchestration/z_archive/097-comment-ref-hygiene/ai-council/` | Created — full council artifacts (8 files) |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/18--ux-hooks/119-A--comment-hygiene-checker-baseline.md` | Created |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/18--ux-hooks/119-B--comment-hygiene-claude-code-hook.md` | Created |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/18--ux-hooks/119-C--comment-hygiene-opencode-plugin.md` | Created |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/18--ux-hooks/119-D--comment-hygiene-devin-precommit.md` | Created |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/18--ux-hooks/119-E--comment-hygiene-codex-hook.md` | Created |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/18--ux-hooks/119-F--comment-hygiene-gemini-hook.md` | Created |

### Follow-Ups

- **Devin hook gap remains open** — Devin has no session-start hook and no write-time event the plugin can intercept. The pre-commit gate is the only backstop. If Devin adds a hook API in a future release, wire the hygiene directive there.
- **MCP index scan conflict** — The `memory_index_scan` call after the session save returned a `SQLITE_CONSTRAINT_PRIMARYKEY` error because `generate-context.js` and the MCP server both attempted to write the same index entry. Data is saved; the conflict is benign. A future session will resolve on next incremental scan.

---

## 2026-05-27

> Spec folder: `skilled-agent-orchestration/z_archive/097-comment-ref-hygiene` (Level 3 — now phase 001)
> Session: Rule authoring and Bucket-A cleanup

### Summary

Added the canonical "no ephemeral-artifact pointers" rule to the `sk-code` skill (both surfaces), aggressively revised the contradicting OpenCode `§4 REFERENCE COMMENT PATTERNS` guidance, and ran a comments-only cleanup of all Bucket-A offenders across four deep/system skills. Zero ephemeral refs remain in production-code or test-file comments across all four skills.

### Added

- **`code_style_guide.md §4`** — "No ephemeral-artifact pointers" canonical rule with an allowed-vs-forbidden table, the instance-vs-structural distinction, and code examples.
- **`code_quality_standards.md`** — P0 mirror of the canonical rule.
- **Webflow `cross_language_rules.md §7`** — Pointer to the canonical rule for the Webflow surface.

### Changed

- **`universal_patterns.md §4`** — Aggressive revision: removed all `T###`/`REQ-###`/`CHK-###` prefix recommendations; replaced with the durable-WHY pattern.
- **`universal_patterns.md §3/§7`** — Example fixes to remove contradicting instance references.
- **`opencode/{js,ts,python,shell}/style_guide.md`** — Echo-site reconciliation to remove contradicting recommendations.
- **`config/quality_standards.md`** — Removed contradictory P2 `REQ-###` recommendation.
- **`deep-agent-improvement`, `system-code-graph`, `system-skill-advisor`, `system-spec-kit` source** — Comments-only cleanup of ~135 Bucket-A sites. Test-file comment extension also completed. All suites green post-cleanup.

### Verification

| Check | Result |
|-------|--------|
| Comprehensive ephemeral-ref sweep — all 4 skills (production comments) | PASS — 0 remaining |
| Extension sweep — all 4 skills (test-file comments) | PASS — 0 remaining |
| Per-skill test suites post-cleanup | PASS |
| `validate.sh --strict` — 119 (then-flat Level 3) | PASS |
