---
title: "Plan — 097 cli-opencode stdin-redirect fix"
description: "Step-by-step plan for adding </dev/null to all 4 YAML workflows + cli-opencode skill files + 2 stress scripts."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: 097 cli-opencode stdin-redirect fix

<!-- SPECKIT_LEVEL: 2 -->

---

## OVERVIEW

Mechanical edit packet. ~13 files touched. No new code logic, no schema changes, no behavioral semantics shift — only a 9-character shell redirect added to existing dispatch commands. Wall-clock target: 30 minutes.

---

## PHASES

### Phase 1: Patch 4 YAML workflow files (REQ-001)

For each of the 4 files in `.opencode/commands/speckit/assets/`:
- `spec_kit_deep-research_auto.yaml` (line ~727)
- `spec_kit_deep-research_confirm.yaml` (line ~659)
- `spec_kit_deep-review_auto.yaml` (line ~791)
- `spec_kit_deep-review_confirm.yaml` (line ~768)

The current `if_cli_opencode` block ends with:
```yaml
              {optional_variant_flag} \
              "$(cat '{state_paths.prompt_dir}/iteration-{current_iteration}.md')"
```

Add immediately AFTER the `"$(cat ...)"` line and BEFORE any subsequent block:
```yaml
              </dev/null
```

(Note: this is the LAST line of the command — no backslash continuation. The line is the shell input redirect.)

Verify: each YAML still parses. Smoke-test by re-running a 30-second PONG dispatch through one modified YAML pattern.

### Phase 2: Update cli-opencode skill (REQ-002, REQ-003, REQ-007, REQ-008)

`.opencode/skills/cli-opencode/SKILL.md`:
- §4 ALWAYS list — add new rule (numbered next sequential):
  > **N. Append `</dev/null` to every non-interactive `opencode run` invocation.** opencode v1.14.39 reads stdin at startup before session creation. Without an explicit closed stdin, dispatches with stdout/stderr redirected to files hang at 0% CPU after the `+60s snapshot prune cleanup` log entry. Position: AFTER the prompt positional argument, BEFORE the stdout/stderr redirects. Foreground `| tail` happens to provide closed stdin and bypasses the bug, but `> stdout.log 2> stderr.log` does not. See `references/integration_patterns.md` §6 and memory `feedback_opencode_run_requires_dev_null_stdin.md`.

`.opencode/skills/cli-opencode/references/integration_patterns.md` §6:
- Generalize from `while read` loop case to ALL non-interactive callsites.
- Add explicit "Hang symptom" diagnostic block: process at 0% CPU, no TCP, log stops at `+60s snapshot prune`.

`.opencode/skills/cli-opencode/references/cli_reference.md`:
- Add note in flag reference near `--format`/`--dir`: "Stdin: When stdout is redirected to a file (the typical automation pattern), append `</dev/null` to provide closed stdin. opencode v1.14.39 reads stdin at startup; without `</dev/null`, dispatches hang silently."

`.opencode/skills/cli-opencode/assets/prompt_templates.md`:
- Update any copy-paste templates that show automation dispatch (`> stdout.log 2> stderr.log`) to include `</dev/null`.

`.opencode/skills/cli-opencode/README.md`:
- If the README has a "Quick start" or "Example dispatch" snippet, update to include `</dev/null`.

### Phase 3: Patch 2 stress-test scripts (REQ-004)

`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/003-mcp-runtime-stress-remediation/010-stress-test-rerun-v1-0-2/scripts/dispatch-cli-opencode.sh`:
- Locate the `opencode run` invocation, add `</dev/null` after the prompt arg before `> ... 2> ...`.

`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/003-mcp-runtime-stress-remediation/001-search-intelligence-stress-test/001-scenario-design/scripts/dispatch-cli-opencode.sh`:
- Same.

Verify: `bash -n` clean for each.

### Phase 4: Update CHANGELOG (REQ-005)

`.opencode/skills/cli-opencode/CHANGELOG-2026-05-08-tool-name-regex-fix.md`:
- Add §Fix 4 (the stdin redirect) with diff + verification block.
- Update §TL;DR from "Two independent issues" to "Three independent issues."
- Update §1 Symptom B section from "downstream consequence of symptom A" framing to the corrected diagnosis (stdin-startup-deadlock).

### Phase 5: Mirror to Barter (REQ-006, conditional)

If `barter/.opencode/skill/cli-opencode/SKILL.md` exists, apply the same ALWAYS rule + references update there. If absent, document the absence in `implementation-summary.md`.

### Phase 6: Validate + implementation-summary (REQ-005 verification)

- Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/cli-external-orchestration/015-cli-opencode-stdin-fix --strict`.
- Verify checklist.md items checked with file:line evidence.
- Write implementation-summary.md.

---

## DEPENDENCIES

- None. Self-contained mechanical edit packet.

---

## OUT OF SCOPE

- Modifying opencode-ai/opencode source.
- Filing upstream issue (separate follow-up).
- Re-running 027-xce-research-based-refinement iterations (separate ongoing work).

---

## ROLLBACK PLAN

If a YAML edit breaks workflow parsing or shell dispatch:
1. Revert the specific YAML to git HEAD~1.
2. Re-apply manually with corrected `</dev/null` placement.

The change is 1 line per YAML. Rollback is trivial.
