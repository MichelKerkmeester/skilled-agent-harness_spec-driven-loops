---
title: "cli-opencode `</dev/null` stdin-redirect fix: opencode run hangs without explicit stdin EOF"
description: "Fix the silent-hang bug in `opencode run` when stdout/stderr are redirected to files. Add `</dev/null` to all 4 deep-research/deep-review YAML workflow dispatches, the cli-opencode skill SKILL.md/README/references/assets, and 2 stress-test dispatch scripts. Document the bug and the workaround as a permanent ALWAYS rule until upstream fixes opencode v1.14.39's stdin-startup-read."
trigger_phrases:
  - "097 cli-opencode stdin fix"
  - "opencode run hangs"
  - "opencode dev null stdin"
  - "opencode background dispatch hang"
  - "cli-opencode automation hang"
importance_tier: "important"
contextType: "fix"
_memory:
  continuity:
    packet_pointer: "specs/skilled-agent-orchestration/097-cli-opencode-stdin-fix"
    last_updated_at: "2026-05-08T13:30:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Scaffolded 097 spec folder for cli-opencode stdin-redirect fix"
    next_safe_action: "Apply </dev/null to 4 YAML workflows + cli-opencode skill files + 2 stress scripts"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - ".opencode/commands/spec_kit/assets/spec_kit_deep-research_auto.yaml"
      - ".opencode/commands/spec_kit/assets/spec_kit_deep-research_confirm.yaml"
      - ".opencode/commands/spec_kit/assets/spec_kit_deep-review_auto.yaml"
      - ".opencode/commands/spec_kit/assets/spec_kit_deep-review_confirm.yaml"
      - ".opencode/skills/cli-opencode/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-08-097-stdin-fix-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: cli-opencode `</dev/null` Stdin-Redirect Fix

<!-- SPECKIT_LEVEL: 2 -->

---

## EXECUTIVE SUMMARY

`opencode run` (OpenCode CLI v1.14.39, Bun-compiled Mach-O ARM64 on macOS Darwin 25.4.0) silently hangs indefinitely at 0% CPU after the `+60s service=snapshot prune=7.days cleanup` log line whenever stdout and/or stderr are redirected to files without an explicit closed stdin. The opencode binary reads stdin during startup before session creation; when the parent shell hasn't explicitly closed it, opencode blocks forever waiting for input that never arrives. Foreground pipes like `| tail` accidentally bypass the bug because the pipe provides EOF on stdin; `> stdout.log 2> stderr.log` redirects do not.

This fix adds **`</dev/null`** as a permanent rule across all automation surfaces that dispatch `opencode run` non-interactively. Touched files: 4 YAML workflow files (deep-research auto/confirm + deep-review auto/confirm), the `cli-opencode` skill (SKILL.md, README.md, references/cli_reference.md, references/integration_patterns.md, assets/prompt_templates.md), and 2 stress-test `dispatch-cli-opencode.sh` scripts. The Barter sibling repo's mirrored cli-opencode skill is included where present.

**Discovered:** 2026-05-08 during the 027-xce-research-based-refinement deep-research run. After 14 dispatch attempts hung silently, GPT-5.5 multi-AI council deliberation (`codex exec --model gpt-5.5 -c model_reasoning_effort=xhigh -c service_tier=fast`) identified the stdin-startup-read pattern. Confirmation took 90 seconds: a single `opencode run ... </dev/null > out 2> err` test produced 13 real tool calls vs the 0-byte hang from the same command without `</dev/null`.

**Key Decisions in this Spec**:
- Patch in-repo **immediately** rather than wait for upstream — the workaround is 9 characters per dispatch and the hang costs 12 minutes per timeout cycle.
- Document as a permanent ALWAYS rule in `cli-opencode` SKILL.md §4 (not just a §3 Note), so future automation gets it right at write time.
- File upstream issue with opencode-ai requesting `process.stdin.isTTY` skip in non-interactive mode (out of scope for this packet — separate follow-up).
- This packet does NOT change opencode binary itself or revise the YAML workflow's `--variant`/`--pure`/`--dangerously-skip-permissions` flags.

**Critical Constraints**:
- The `</dev/null` redirect must appear AFTER the prompt positional argument and BEFORE the stdout/stderr redirects (`> ... 2> ...`). Misplacement (e.g., before the prompt) silently fails because shell precedence rules redirect stdin earlier than intended.
- Do not break the `while read` loop pattern documented in cli-opencode references/integration_patterns.md §6 — that pattern already had `</dev/null` for a different reason (stdin consumption inside the loop body). The new ALWAYS rule generalizes the requirement.
- No source code changes to opencode itself; this is a workaround at every dispatch callsite.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Spec-Scaffolded |
| **Created** | 2026-05-08 |
| **Branch** | `main` |
| **Parent Track** | `skilled-agent-orchestration` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`opencode run` is the entry point for cross-AI dispatch from Claude Code, Codex, Gemini, and shell automation. The deep-research and deep-review YAML workflows hardcode the `if_cli_opencode` dispatch branch as:

```bash
opencode run \
  --model "{config.executor.model}" \
  --agent general \
  --format json \
  --dangerously-skip-permissions \
  --pure \
  --dir "{repo_root}" \
  {optional_variant_flag} \
  "$(cat '{state_paths.prompt_dir}/iteration-{current_iteration}.md')"
```

Followed by `> stdout.log 2> stderr.log` in the dispatching shell wrapper. With this shape, opencode reads stdin during init (before session creation reaches the LLM provider) and the read blocks forever because stdin remains attached to the parent terminal / `/dev/tty` even in background-mode dispatches. Symptoms:

- Process at 0% CPU, RSS ~2 MB, no TCP connections, 0 bytes stdout/stderr.
- opencode internal log under `~/.local/share/opencode/log/<timestamp>.log` reaches `service=snapshot prune=7.days cleanup` (+60s) and stops cold. No subsequent `service=session`, `service=provider`, or LLM-call entries.
- 12-minute per-iteration timeouts fire and SIGTERM the process; the deep-research loop emits `error` status records and stalls.

Foreground dispatches via `cmd 2>&1 | tail -N` work because the pipe provides closed stdin to the `tail` consumer, and opencode's stdin-read-at-startup gets EOF immediately.

### Purpose

Add `</dev/null` to every non-interactive `opencode run` callsite in this repo so the automation works reliably until opencode upstream fixes the stdin-startup-read. Document the requirement as a permanent ALWAYS rule in the `cli-opencode` skill so any future automation written by humans or LLMs gets it right at write time.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Add `</dev/null \` to the `if_cli_opencode` command block in 4 YAML workflow files:
  - `.opencode/commands/spec_kit/assets/spec_kit_deep-research_auto.yaml` (line ~727)
  - `.opencode/commands/spec_kit/assets/spec_kit_deep-research_confirm.yaml` (line ~659)
  - `.opencode/commands/spec_kit/assets/spec_kit_deep-review_auto.yaml` (line ~791)
  - `.opencode/commands/spec_kit/assets/spec_kit_deep-review_confirm.yaml` (line ~768)
- Update `cli-opencode` SKILL.md ALWAYS rule list to include `</dev/null` requirement.
- Update `cli-opencode` README.md if it has automation snippets.
- Update `cli-opencode/references/cli_reference.md` and `cli-opencode/references/integration_patterns.md` (§6 background dispatch pattern) to document `</dev/null` requirement and the `process.stdin.isTTY` Unix gotcha.
- Update `cli-opencode/assets/prompt_templates.md` copy-paste templates that show non-interactive dispatch.
- Add `</dev/null` to 2 stress-test scripts:
  - `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/003-mcp-runtime-stress-remediation/010-stress-test-rerun-v1-0-2/scripts/dispatch-cli-opencode.sh`
  - `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/003-mcp-runtime-stress-remediation/001-search-intelligence-stress-test/001-scenario-design/scripts/dispatch-cli-opencode.sh`
- If Barter sibling repo has a mirrored `cli-opencode` skill at `barter/.opencode/skill/cli-opencode/`, mirror the SKILL.md + references updates there.
- Add CHANGELOG note in `.opencode/skills/cli-opencode/CHANGELOG-2026-05-08-tool-name-regex-fix.md` (existing — extend with the third root cause).
- Add `feedback_opencode_run_requires_dev_null_stdin.md` memory entry (already done in main session — verify).

### Out of Scope

- Modifying the opencode binary or opencode-ai/opencode source.
- Filing the upstream issue with opencode-ai (separate follow-up; this packet documents that as a recommended next step).
- Re-running iterations of the 027-xce-research-based-refinement deep-research packet (separate work, ongoing).
- Changing any other flags (`--pure`, `--variant`, `--dangerously-skip-permissions`, `--agent`, `--format`, `--dir`) on the dispatch — those are governed by other packets.
- Replacing the existing `while read` loop `</dev/null` references in `cli-opencode/references/integration_patterns.md` §6 — those stay as-is; the new ALWAYS rule supersedes/generalizes them.

### Files Read (research input — read-only)

| Path | Purpose |
|------|---------|
| `.opencode/commands/spec_kit/assets/spec_kit_deep-research_auto.yaml` | Locate `if_cli_opencode` block (line ~727) for patch |
| `.opencode/commands/spec_kit/assets/spec_kit_deep-research_confirm.yaml` | Same |
| `.opencode/commands/spec_kit/assets/spec_kit_deep-review_auto.yaml` | Same |
| `.opencode/commands/spec_kit/assets/spec_kit_deep-review_confirm.yaml` | Same |
| `.opencode/skills/cli-opencode/SKILL.md` | ALWAYS rule list + §3 Default Invocation example |
| `.opencode/skills/cli-opencode/README.md` | Front-page snippet check |
| `.opencode/skills/cli-opencode/references/cli_reference.md` | Flag reference + invocation examples |
| `.opencode/skills/cli-opencode/references/integration_patterns.md` | §6 background-dispatch pattern |
| `.opencode/skills/cli-opencode/assets/prompt_templates.md` | Copy-paste templates for automation |
| `feedback_opencode_run_requires_dev_null_stdin.md` (memory) | Already authored — verify referenced |

### Files Modified (write paths)

| Path | Change |
|------|--------|
| `.opencode/commands/spec_kit/assets/spec_kit_deep-research_auto.yaml` | Add `</dev/null \` between prompt arg and trailing-args section in `if_cli_opencode` block |
| `.opencode/commands/spec_kit/assets/spec_kit_deep-research_confirm.yaml` | Same |
| `.opencode/commands/spec_kit/assets/spec_kit_deep-review_auto.yaml` | Same |
| `.opencode/commands/spec_kit/assets/spec_kit_deep-review_confirm.yaml` | Same |
| `.opencode/skills/cli-opencode/SKILL.md` | Add ALWAYS rule N: "Append `</dev/null` to every non-interactive `opencode run` invocation. ..." |
| `.opencode/skills/cli-opencode/README.md` | Snippet update if present |
| `.opencode/skills/cli-opencode/references/cli_reference.md` | Add note in flag reference |
| `.opencode/skills/cli-opencode/references/integration_patterns.md` | §6 update — generalize from `while read` loop case to all non-interactive cases |
| `.opencode/skills/cli-opencode/assets/prompt_templates.md` | Update templates that include `> stdout.log 2> stderr.log` to also include `</dev/null` |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/.../010-stress-test-rerun-v1-0-2/scripts/dispatch-cli-opencode.sh` | Add `</dev/null` |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/.../001-search-intelligence-stress-test/001-scenario-design/scripts/dispatch-cli-opencode.sh` | Same |
| `.opencode/skills/cli-opencode/CHANGELOG-2026-05-08-tool-name-regex-fix.md` | Add §Fix 4 entry for the stdin redirect |
| `barter/.opencode/skill/cli-opencode/SKILL.md` (if present) | Mirror ALWAYS rule update |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 — Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 4 YAML workflows include `</dev/null` in `if_cli_opencode` dispatch | `grep -A2 "if_cli_opencode" .opencode/commands/spec_kit/assets/spec_kit_deep-{research,review}_{auto,confirm}.yaml` shows `</dev/null` in each command block |
| REQ-002 | cli-opencode SKILL.md ALWAYS list documents `</dev/null` rule | New ALWAYS rule with rationale, position-in-command guidance, and 1-line failure-mode reminder |
| REQ-003 | cli-opencode references/integration_patterns.md §6 generalizes the rule | Section retitled or extended to cover ALL non-interactive `opencode run` callsites (not just `while read` loops) |
| REQ-004 | 2 stress-test `dispatch-cli-opencode.sh` scripts include `</dev/null` | `grep "</dev/null" specs/.../015-.../scripts/dispatch-cli-opencode.sh` returns a hit in each |
| REQ-005 | CHANGELOG-2026-05-08-tool-name-regex-fix.md adds §Fix 4 for stdin redirect | Heading + diff + verification block present |
| REQ-006 | Barter sibling skill mirror (if present) updated | Same SKILL.md ALWAYS rule on barter side OR documented absence |

### P1 — Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | cli-opencode README.md and assets/prompt_templates.md updated where they show automation dispatch | Templates with `> stdout 2> stderr` patterns include `</dev/null` |
| REQ-008 | references/cli_reference.md flag reference notes the requirement near the `--format`/`--dir` documentation | New paragraph or callout |

### P2 — Nice to have

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-009 | Pre-commit lint check that flags `opencode run` invocations without `</dev/null` redirect when stdout is also redirected | New script in `scripts/` (deferred — recommend follow-on packet) |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: After this packet, every `opencode run` callsite in the repo that redirects stdout and/or stderr also redirects stdin from `/dev/null`. Verified by `grep -L "</dev/null" $(grep -lE "opencode run.*>.*\.log" .opencode/ -r)` returning empty.
- **SC-002**: Re-running `/spec_kit:deep-research:auto --executor=cli-opencode --model=deepseek/deepseek-v4-pro` no longer hangs at the `+60s snapshot prune cleanup` log line. Each iteration completes within the 12-min per-iter cap.
- **SC-003**: cli-opencode skill SKILL.md §4 ALWAYS list contains a rule about `</dev/null` discoverable via `grep "/dev/null" .opencode/skills/cli-opencode/SKILL.md`.
- **SC-004**: A future LLM or human reading the cli-opencode skill encounters the rule before writing automation, preventing regression.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | YAML edit misplaces `</dev/null` (e.g., before the prompt arg, after the stdout redirect) | Medium — silently fails as if no redirect was added | Use Edit tool with explicit context window; verify via shell-level test (`bash -n` syntax-check + post-edit `grep`-test) |
| Risk | A future maintainer adds new automation that doesn't include `</dev/null` | Medium — same hang pattern returns | REQ-002/003 documents in SKILL.md; REQ-009 (P2) pre-commit lint deferred |
| Risk | Barter sibling repo has different cli-opencode SKILL.md path | Low — mirror is best-effort | Document absence as an "out of scope" note if path differs |
| Risk | opencode upstream fixes the bug and `</dev/null` becomes redundant | Low — `</dev/null` is harmless when stdin-EOF is already correct | Documentation note that the rule can be relaxed once upstream fix lands; currently no ETA |
| Dependency | None | — | Self-contained packet |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No measurable performance impact from `</dev/null` redirect (microseconds to add stdin EOF).
- **NFR-P02**: Total wall-clock for this fix packet under 30 minutes (mechanical edits + validation).

### Reliability
- **NFR-R01**: All 4 YAML files remain syntactically valid (parse with the workflow YAML parser).
- **NFR-R02**: All 2 stress-test shell scripts remain `bash -n` clean.

### Auditability
- **NFR-A01**: Each YAML edit references the exact line range modified in implementation-summary.md.
- **NFR-A02**: CHANGELOG entry §Fix 4 documents the discovery method (multi-AI council deliberation) and the cheapest discriminator test.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A YAML file where the `if_cli_opencode` block doesn't exist (e.g., a YAML that only supports native dispatch). Skip with a "not applicable" note in implementation-summary.md.
- A stress-test script that already has `</dev/null`. Skip — the requirement is met.
- The Barter cli-opencode skill at a non-standard path (sibling repo conventions differ). Treat as out-of-scope — document absence.

### Error Scenarios
- Edit tool reports "string not found" because line numbers shifted between scoping and implementation. Re-read the file and use a wider context anchor; do NOT use replace_all on `opencode run` patterns (multi-match risk).
- A YAML edit accidentally inserts `</dev/null` BEFORE the prompt argument — silent fail. Catch via shell test: dispatch a 30-second `PONG` test through the modified YAML's command and verify it exits ≤30s with non-zero stdout bytes.
- A `dispatch-cli-opencode.sh` script uses `< some-other-file` (intentionally piping content via stdin). Don't break that pattern — REQ-004 only applies to scripts that don't already provide stdin.

### State Transitions
- Pre-fix: any `opencode run` automation with `> stdout 2> stderr` hangs at +60s.
- Post-fix: same automation completes within the model's normal response window (5-12 min for deep-research dispatches).
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | 4 YAMLs + 5 cli-opencode skill files + 2 shell scripts + 1 changelog + 1 barter mirror = 13 files |
| Risk | 8/25 | YAML edit-misplacement risk + barter mirror best-effort |
| Research | 4/20 | Root cause already established by GPT-5.5 council; no new investigation needed |
| **Total** | **26/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Does the Barter sibling repo's `barter/.opencode/skill/cli-opencode/` exist? If not, REQ-006 is N/A. (Default: check at implementation time.)
- Should the upstream issue with opencode-ai be filed as part of this packet or as a follow-up? (Default: follow-up — out of scope here.)
- Should we add a pre-commit lint check (REQ-009 P2) now or defer to a separate packet? (Default: defer — this packet is mechanical, not architectural.)
<!-- /ANCHOR:questions -->

---

<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-001
REQ-002
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
REQ-009
**Given** opencode run dispatch from automation script
**Given** stdout/stderr redirected to files
**Given** stdin is not explicitly closed
**Given** opencode v1.14.39 reads stdin at startup
**Given** </dev/null is appended to the dispatch command
**Given** YAML edit places </dev/null between prompt arg and stdout redirect
**Given** post-edit shell test runs PONG dispatch through modified YAML
**Given** Barter sibling has cli-opencode skill mirror
**Given** stress-test dispatch-cli-opencode.sh script invokes opencode run
-->
