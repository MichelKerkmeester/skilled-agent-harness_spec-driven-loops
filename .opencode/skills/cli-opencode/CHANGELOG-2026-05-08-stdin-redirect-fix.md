# cli-opencode `</dev/null` Stdin-Redirect Fix — 2026-05-08

> Fixes silent dispatch hangs in `opencode run` when stdout/stderr are redirected to files in non-interactive automation (deep-research, deep-review, stress tests, ad-hoc shell pipelines). Independent from the tool-name regex fix shipped earlier the same day.

---

## TL;DR

`opencode run` (OpenCode CLI v1.14.39, Bun-compiled Mach-O ARM64 on macOS Darwin 25.4.0) reads stdin at startup before session creation. When stdout and/or stderr are redirected to files via `> stdout.log 2> stderr.log` (the typical automation pattern), opencode's stdin remains attached to the parent terminal and the startup read blocks **forever**. The process sits at 0% CPU, no TCP connections, 0 bytes output, and the internal log stops at `+60s service=snapshot prune=7.days cleanup`.

**Fix**: append `</dev/null` to every non-interactive `opencode run` invocation. The 9-character redirect provides immediate EOF on stdin, unblocking the startup. Foreground `| tail` accidentally bypasses the bug because the upstream pipe stage is empty, but `> file 2> file` does not.

This packet (097-cli-opencode-stdin-fix) applies the fix across:
- 4 deep-research/deep-review YAML workflow files
- cli-opencode SKILL.md ALWAYS rule 5 (generalized from `while read` loops to all non-interactive cases)
- cli-opencode references/integration_patterns.md §6
- cli-opencode references/cli_reference.md §4 (new "Stdin handling" subsection)
- cli-opencode assets/prompt_templates.md (top-of-file warning)
- cli-opencode README.md §2 Quick Start (new §5 Background Dispatch)
- 2 stress-test `dispatch-cli-opencode.sh` scripts
- Barter sibling skill mirror (where present)

---

## 1. SYMPTOMS

```
$ timeout 720 opencode run \
    --model deepseek/deepseek-v4-pro \
    --variant high \
    --pure \
    --dangerously-skip-permissions \
    "$(cat prompt.md)" \
    > stdout.log 2> stderr.log

# 14 minutes elapse. opencode exits with code 124 (SIGTERM from timeout).
# stdout.log: 0 bytes
# stderr.log: 0 bytes
# Internal log: stops at "+60s service=snapshot prune=7.days cleanup"
# Process tree: opencode child at 0% CPU, RSS 2.8 MB, no TCP to provider
```

The same dispatch in foreground via `cmd 2>&1 | tail` works fine and emits real tool calls.

## 2. ROOT CAUSE

opencode's `run` subcommand entrypoint reads from stdin during initialization, before session creation reaches the LLM provider. The read should be a quick check for piped context, then proceed regardless. But in opencode v1.14.39, the read **blocks indefinitely** when stdin is connected to a parent process / controlling terminal that never sends EOF.

Different shell invocations connect stdin differently:

| Invocation | What stdin is connected to | EOF arrives? |
|---|---|---|
| `opencode run "..."` (interactive terminal) | tty | Yes — terminal sends EOF when user presses Ctrl-D or types nothing |
| `opencode run "..." \| tail -N` | Empty upstream pipe | Yes — pipe is closed since nothing produces |
| `opencode run "..." > stdout 2> stderr` | **Inherited parent stdin** (often hung tty in background mode) | **NO** — hangs forever |
| `opencode run "..." </dev/null > stdout 2> stderr` | `/dev/null` (always-empty file) | Yes — instant EOF |
| `opencode run "..." \| tee combined.log` | Empty upstream pipe | Maybe — `tee` may keep the pipe open differently depending on shell + tee implementation; empirically observed to hang in this environment |

The `</dev/null` redirect is the universal fix.

## 3. FIXES APPLIED

### Fix A — 4 YAML workflow files

`.opencode/commands/spec_kit/assets/spec_kit_deep-research_auto.yaml` line 728:
```diff
              {optional_variant_flag} \
-              "$(cat '{state_paths.prompt_dir}/iteration-{current_iteration}.md')"
+              "$(cat '{state_paths.prompt_dir}/iteration-{current_iteration}.md')" \
+              </dev/null
          working_directory: "{repo_root}"
```

Plus a new entry in the `notes:` block documenting the requirement. Same pattern applied to:
- `spec_kit_deep-research_confirm.yaml` (line 660)
- `spec_kit_deep-review_auto.yaml` (line 792)
- `spec_kit_deep-review_confirm.yaml` (line 769)

### Fix B — cli-opencode skill SKILL.md ALWAYS rule 5

Generalized from `while read` loop case to ALL non-interactive callsites:

```diff
-5. Append `</dev/null` when backgrounding `opencode run` inside `while read` loops (otherwise stdin is silently consumed).
+5. **Append `</dev/null` to every non-interactive `opencode run` invocation** that redirects stdout and/or stderr to files OR runs inside `while read` loops. opencode v1.14.39 reads stdin at startup before session creation; without explicit closed stdin, automation hangs forever at 0% CPU after the `+60s service=snapshot prune=7.days cleanup` log line. Position: AFTER the prompt positional argument, BEFORE the `> stdout 2> stderr` redirects. ...
```

### Fix C — cli-opencode references/integration_patterns.md §6

Section retitled "STDIN HANDLING — `</dev/null` IS REQUIRED FOR ALL NON-INTERACTIVE DISPATCH" and expanded to cover three failure patterns and four fix patterns, with a hang-symptom diagnostic block, a position rule, and the canonical 12-min automation invocation.

### Fix D — cli-opencode references/cli_reference.md §4

New "Stdin handling — `</dev/null` is required for non-interactive dispatch" subsection added after the cli-opencode default invocation shape, with canonical position-on-command-line example.

### Fix E — cli-opencode assets/prompt_templates.md

Top-of-file warning callout added documenting that templates show foreground patterns (terminal stdout, no redirect — work as-is) and that any adaptation for automation/background dispatch (`> file 2> file`) MUST append `</dev/null` after the prompt.

### Fix F — cli-opencode README.md §2 Quick Start

New §5 "Background / Automation Dispatch (REQUIRES `</dev/null`)" section added with the canonical 12-min automation pattern.

### Fix G — 2 stress-test dispatch scripts

`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/015-mcp-runtime-stress-remediation/010-stress-test-rerun-v1-0-2/scripts/dispatch-cli-opencode.sh`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/015-mcp-runtime-stress-remediation/001-search-intelligence-stress-test/001-scenario-design/scripts/dispatch-cli-opencode.sh`

Both updated to include `</dev/null` after the prompt and before the stdout/stderr redirect.

### Fix H — Barter sibling mirror (conditional)

If `barter/.opencode/skill/cli-opencode/SKILL.md` exists, the same ALWAYS rule 5 update is mirrored. Documented in 097 implementation-summary.md if absent.

---

## 4. VERIFICATION

```bash
# All 4 YAMLs contain </dev/null in if_cli_opencode block
$ for f in .opencode/commands/spec_kit/assets/spec_kit_deep-{research,review}_{auto,confirm}.yaml; do
    grep -c "</dev/null" "$f"
  done
2  # spec_kit_deep-research_auto.yaml
2  # spec_kit_deep-research_confirm.yaml
2  # spec_kit_deep-review_auto.yaml
2  # spec_kit_deep-review_confirm.yaml

# All 4 YAMLs still parse
$ for f in .opencode/commands/spec_kit/assets/spec_kit_deep-{research,review}_{auto,confirm}.yaml; do
    python3 -c "import yaml; yaml.safe_load(open('$f'))" && echo "OK $f"
  done
OK ... × 4

# cli-opencode SKILL.md rule 5 documents </dev/null
$ grep -A2 "5\. \*\*Append" .opencode/skills/cli-opencode/SKILL.md | head -2
5. **Append `</dev/null` to every non-interactive `opencode run` invocation** that redirects stdout and/or stderr to files OR runs inside `while read` loops...

# Smoke test: deep-research dispatch via the patched workflow
$ timeout 720 opencode run --model deepseek/deepseek-v4-pro --variant high --pure --dangerously-skip-permissions \
    "$(cat prompt-1.2KB.md)" </dev/null > out 2> err
$ echo "rc=$? out=$(wc -c < out) err=$(wc -c < err)"
rc=0 out=1553 err=2420
# Was: 14-min hang with rc=124, 0 bytes everywhere
# Now: completes in 4m 36s, real iteration artifacts produced
```

---

## 5. DISCOVERY

This bug took 14 dispatch attempts over ~3 hours to diagnose. False trails included:
- Tool-name regex (correctly identified separately, but didn't fix the hang)
- Phantom dependency `@github/copilot-sdk` (correctly removed, but didn't fix the hang)
- Stale opencode-ai processes from prior multi-day sessions (correctly killed, but didn't fix the hang)
- `--pure` flag interaction (red herring; `--pure` was needed but not sufficient)
- Prompt size threshold (red herring; small prompts also hung after enough attempts)

Root cause was identified by **GPT-5.5 multi-AI council deliberation** via `codex exec --model gpt-5.5 -c model_reasoning_effort=xhigh -c service_tier=fast`. The council's Hypothesis #2 ("TTY/stdin read before session creation") was confirmed by the cheapest stdio discriminator test in 90 seconds: a single `opencode run ... </dev/null > out 2> err` test produced 13 real tool calls vs the 0-byte hang from the same command without `</dev/null`.

---

## 6. UPSTREAM

This is a workaround. The proper fix is in opencode-ai/opencode itself: in the `run` subcommand entrypoint, check `process.stdin.isTTY` (or use Bun's equivalent) and skip the stdin read when running non-interactively — the message is already provided as a positional argument, so stdin is informational only. Until upstream patches this, `</dev/null` at every callsite is the workaround.

**Recommended next step (out of scope for this packet):** file a bug report at `https://github.com/opencode-ai/opencode/issues` with the reproduction recipe from §4.

---

## 7. SCOPE / NON-SCOPE

**In scope of 097-cli-opencode-stdin-fix:**
- Mechanical edit of all callsites to append `</dev/null`
- Documentation updates in cli-opencode skill (SKILL.md, references, assets, README)
- Memory entry: `feedback_opencode_run_requires_dev_null_stdin.md` (already authored 2026-05-08)
- This changelog file

**Out of scope (separate work):**
- Modifying opencode binary
- Filing upstream issue
- Re-running 027-xce-research-based-refinement iterations (separate ongoing work)
- Pre-commit lint check that flags `opencode run` invocations missing `</dev/null` (P2 deferred)
- Updating any other flags (`--pure`, `--variant`, `--agent`, `--format`, `--dir`)

---

## 8. RELATED

- Spec packet: `specs/skilled-agent-orchestration/097-cli-opencode-stdin-fix/`
- Sibling fix from same day: `CHANGELOG-2026-05-08-tool-name-regex-fix.md` (independent — opencode-skills plugin recursion + @github/copilot-sdk phantom dep)
- Memory: `feedback_opencode_run_requires_dev_null_stdin.md`
- cli-opencode SKILL.md §4 ALWAYS rule 5
- cli-opencode references/integration_patterns.md §6
- 4 YAML workflow files in `.opencode/commands/spec_kit/assets/`

---

*Author: Claude Opus 4.7 + GPT-5.5 multi-AI council via cli-codex*
*Status: Verified working in 027-xce-research-based-refinement deep-research run (iter-15 attempt-15 succeeded in 4m 36s)*
