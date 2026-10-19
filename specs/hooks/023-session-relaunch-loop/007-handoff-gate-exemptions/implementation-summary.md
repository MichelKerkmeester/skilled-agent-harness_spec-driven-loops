---
title: "Implementation Summary"
description: "A session with no Gate 3 answer can now hand off near the context limit without an operator prompt. The spec gate exempts the gitignored handoff note, AGENTS.md says so in its gate sentences, and the repo OpenCode default model is pinned. Live run 10 proved the hop on Claude, Pi and OpenCode with zero operator prompts."
trigger_phrases:
  - "handoff gate exemptions implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks/023-session-relaunch-loop/007-handoff-gate-exemptions"
    last_updated_at: "2026-10-19T11:46:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Recorded the verification results and the known limitations for phase 7"
    next_safe_action: "Operator reviews the uncommitted diff, then commits"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-007-handoff-gate-exemptions"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-handoff-gate-exemptions |
| **Completed** | 2026-10-19 |
| **Level** | 2 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A session that has no Gate 3 answer can now hand off near its context limit and finish the work in a fresh session, with no operator prompt. Before this phase, two framework rules and one hook rule stopped the hop. The spec gate denied the write of the handoff note when enforcement was on and a gate was open. Gate 3 asked the operator before a read-only session wrote its note. The Gate 2 artifact trigger sent the note to sk-doc, which answered `clarify`.

### Phase 7: handoff-gate-exemptions

The spec gate now treats a write under `.skilled/skills/.state/` as gitignored runtime state and lets it through. The one exception is a concern's tracked `README.md` directly under that folder, which stays gated, as does a `.state` folder nested under another path. The two AGENTS.md sentences that decide whether a turn is spec work now say the same thing, so a session reads the exemption before it decides to ask Gate 3 or to route the note to sk-doc.

The repo `opencode.json` now pins `llmgateway/deepseek-v4.1-flash` with variant `max` for the default model and for the `build` and `plan` agents. A launch without `-m` runs on that pair, so the OpenCode default no longer fails provider routing.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs` | Modified | Adds `RUNTIME_STATE_RELATIVE_PATH` (line 71) and the runtime-state exemption in `isExemptTargetPath` (lines 1573 to 1579) |
| `.skilled/skills/system-spec-kit/runtime/tests/hooks/spec-gate-core.test.mjs` | Modified | Adds the exemption test at line 896, which covers the allowed handoff note, the denied concern README and the denied nested `.state` file |
| `AGENTS.md` | Modified | Gate 2 artifact trigger (line 70) and Gate 3 "does not fire" clause (line 75) name gitignored runtime state |
| `opencode.json` | Modified | Default `model` (line 3), and `build` and `plan` agents with the same model and variant `max` (lines 6 to 7 and 10 to 11) |
| `.skilled/skills/system-spec-kit/benchmark/reports/2026-10-19--manual-testing-playbook--session-relaunch-gate-exemptions/` | Created | Run 10 record: README, results, source, three outcome files |
| `.skilled/skills/system-spec-kit/benchmark/reports/README.md` | Modified | One index row for the run |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-claude.md`, `session-relaunch-pi-opencode.md`, `session-relaunch-command-runtimes.md` | Modified | One pointer each to the run folder |
| `specs/hooks/023-session-relaunch-loop/spec.md` | Modified | Phase map row 7 names the phase and marks it complete |
| `specs/hooks/023-session-relaunch-loop/goal.md` | Modified | Binding rows for phases 006 and 007 |
| `specs/hooks/023-session-relaunch-loop/006-deep-review-2-remediation/spec.md` and `implementation-summary.md` | Modified | Pointer sentences saying G20 and G21 are addressed in phase 007 |
| `specs/hooks/023-session-relaunch-loop/007-handoff-gate-exemptions/` | Created | The six phase docs and `evidence/live-run10-2026-10-19/` (`relaunch-run10.log`, three pane captures, `launch-commands.txt`) |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The exemption was written test first. The new test asserted `allow` for a handoff note under `.skilled/skills/.state/`, and before the fix the assertion failed with an actual `deny`. The fix then took the test to green, and the full spec-gate test file stayed at `fail 0`.

The framework sentences and the OpenCode model were edited next. The OpenCode model was checked in a TUI session started in the worktree without `-m`. Its footer read `Build · DeepSeek V4.1 Flash DevPass (LLM Gateway) · max`, and the stored message rows carried `modelID` `deepseek-v4.1-flash` and `variant` `max`. A variant set without the agent model did not apply, so the agent model is set alongside the variant.

Live run 10 came last. Three loops ran in detached tmux sessions through `clean-tmux.sh`, with the Claude session variables and `AI_SESSION_CHILD` unset. Each prompt carried no Gate 3 answer, and the thresholds were `SESSION_RELAUNCH_THRESHOLD=0.05`, `SESSION_RELAUNCH_WINDOW_TOKENS=100` and `SESSION_RELAUNCH_MAX_HOPS=1`. Each loop prepared, took SIGTERM, relaunched and declined a further hop. Nothing was committed, pushed or merged. The change waits for the operator's review.

**Key Decisions**: see the table below. The run is recorded in `.skilled/skills/system-spec-kit/benchmark/reports/2026-10-19--manual-testing-playbook--session-relaunch-gate-exemptions/`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Exempt the path under `.skilled/skills/.state/`, not the tool or the hook | The exemption rides on the path, so source writes stay gated. A concern's `README.md` and a nested `.state` file stay gated too, and the test holds both cases |
| Fix the trigger text, not the sk-doc router or the Gate 3 classifier | The router's `clarify` is correct for a note that no doc mode fits. The classifier returned `no_match` for the relaunch seed and for a read-only prompt, so it does not fire on this path |
| Pin the OpenCode default in the repo `opencode.json` | The operator chose the repo config, and the pin takes effect without a flag. The agent model is set beside the variant, because a variant alone did not apply |
| Record the 113.6 s Pi gap as model time | The sending session re-read its note after the prepare line. The killer waited for idle as designed, so the gap is not a gate prompt |
| Run the OpenCode leg on the repo default | The operator asked for DeepSeek V4.1 Flash max as the OpenCode default, and only a launch without `-m` proves the default applies. Parent D7 amendment 3 records it |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --test .skilled/skills/system-spec-kit/runtime/tests/hooks/spec-gate-core.test.mjs` | PASS: tests 110, pass 107, fail 0, skipped 3, exit 0. Includes the eight-row adversarial table test |
| Same run with `SPEC_KIT_SPECS_DIR=/etc`, `SPECKIT_SPECS_DIR=../..` and `SYSTEM_SPEC_GATE_ENFORCE=1` set | PASS: tests 109, pass 106, fail 0, skipped 3, exit 0. `isExemptTargetPath` reads the specs-dir overrides, and the test file passes with them set |
| Exemption test red before the fix | PASS as evidence: an actual `deny` where `allow` was expected. Recorded during this phase. The pre-fix state is not on disk, so this run did not repeat it |
| Same-class producer inventory, `rg` for `.skilled/skills/.state`, `RUNTIME_STATE_RELATIVE_PATH` and `GATE_STATE_DIR` | PASS: the new constant and its derived `GATE_STATE_DIR_RELATIVE_PATH` are the only spec-gate definitions. Other `.skilled/skills/.state/<name>` paths belong to loop-guard, goal, completion-sentinel and smart-router, which are gitignored state already |
| Consumer inventory, `rg` for `isExemptTargetPath` | `spec-gate-core.mjs:1787` (the core), `codex/spec-gate-enforce.mjs:27` and `devin/permission-request-policy.mjs:128`. The Codex and Devin adapters inherit the exemption. Neither was rerun live in this phase |
| `node --check spec-gate-core.mjs` | PASS: exit 0. No lint configuration exists at the repo root |
| Console and unhandled-error scan of the normal test run | PASS: 0 matches |
| Secret-pattern scan of the phase evidence and the run folder | PASS: the only matches are the variable name `OPENAI_API_KEY` in pane text, not a secret |
| Live run 10, Claude | PASS: prepare 11:34:56.858Z, SIGTERM 11:35:04.649Z, relaunch `ready` 11:35:05.362Z, the receiver reported 248 lines (`sr-claude10-receiver-pane.txt`), note `status: done`, `WRAPPER_EXIT=0`, zero operator prompts |
| Live run 10, Pi | PASS: prepare 11:37:06.308Z, SIGTERM 11:38:59.883Z, relaunch `ready` 11:39:00.386Z, the receiver counted 248 lines, note `status: done`, `WRAPPER_EXIT=0`, zero operator prompts |
| Live run 10, OpenCode | PASS: prepare 11:36:42.504Z, SIGTERM 11:37:11.232Z, relaunch `ready` 11:37:11.456Z, the receiver reported 248 lines and `# Session Relaunch` (`sr-oc10-receiver-pane.txt`), note `status: done`, `WRAPPER_EXIT=0`, zero operator prompts. Launched without `-m` |
| Manifest audit, `test_readme_manifest.py` | PASS: `reproduced=True`, exit 0, after `--write` regenerated the durable manifest (782 directories) |
| `validate_document.py` on the run README, `source.md` (`--type reference`) and the reports README | PASS: 0 issues each, exit 0 |
| `validate_document.py` on the three session-relaunch playbook pages | PASS: 0 issues each, exit 0 |
| Playbook package validator, `validate-playbook-package.cjs --package .skilled/skills/system-spec-kit/manual-testing-playbook` | PASS: exit 0, violations 0, warnings 1. The warning is `PROMPT_UNSYNCED` in `ux-hooks/comment-hygiene-checker-baseline.md`, a file this phase did not touch |
| `hvr_scan.py` on the eight prose docs (the six phase docs, the run README and `source.md`) | PASS on hard blockers: 0 in every doc, exit 0. Soft deductions remain, with a mechanical ceiling of 97 to 100. A first pass had 5 hard blockers, all semicolons in `goal.md`, and they are fixed. The remaining review hits are `, and` joins between two full clauses, which the serial-comma rule allows, plus a few soft words |
| `validate.sh --strict` on this folder | PASS: `RESULT: PASSED`, Errors 0, Warnings 0, exit 0. The first run failed on an unclosed `log` anchor in `goal.md`, a stale `graph-metadata.json` fingerprint and two `AC_COVERAGE` citation forms. Each was fixed, and `repair-derived.cjs --folder <007> --apply` re-derived the metadata |
| `validate.sh --strict --recursive` on the parent | PASS: `RESULT: PASSED`, exit 0, for the parent and all seven children. Phase 006 also needed `repair-derived.cjs --apply`, because its source docs changed with the pointer sentences. `goal.cjs packet` prints `packet_budget=ok` at 3661 durable characters |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The home `~/.claude/CLAUDE.md` copy lacks the exemption.** It is a home copy of `AGENTS.md`, it already differs from the repo file (it lacks the "A relaunch hop is the same session" line), and Claude loads both. Updating it is a home-config write, so the operator decides it.

2. **The change is not committed.** It is drafted for the operator's review on branch `worktrees/142-session-relaunch-loop`. Nothing was committed, pushed or merged, so no commit SHA pins it. The commit waits for the operator's review.

3. **The exemption covers the whole `.skilled/skills/.state/` tree.** It is not limited to the relaunch folder, and the Codex and Devin spec-gate adapters call the same function. The rule is intended, because that tree is gitignored runtime state. Codex and Devin were not rerun live in this phase.

4. **Live runs cover three runtimes.** Codex, Cursor, Devin and Hermes were not rerun in this phase. Codex keeps its phase 006 result.

<!-- /ANCHOR:limitations -->
