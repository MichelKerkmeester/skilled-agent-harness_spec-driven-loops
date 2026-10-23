---
title: "Implementation Summary"
description: "OpenCode 2 is now the version the repository expects. The resolver prefers the first opencode2 anywhere on PATH and falls back to the first opencode only when none exists, the docs recommend OpenCode 2 first with OpenCode 1 as temporary backwards compatibility, and both versions are proven live."
trigger_phrases:
  - "opencode 2 primary v1 fallback implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/082-opencode-v1-v2-dual-compat/062-opencode-2-primary-v1-fallback"
    last_updated_at: "2026-10-22T23:10:00Z"
    last_updated_by: "spec-record-writer"
    recent_action: "Recorded the push 4505c338b1, green CI and the resolved changelog limitation (5801f6f807)"
    next_safe_action: "None: phase complete"
    blockers: []
    key_files:
      - ".skilled/skills/system-deep-loop/runtime/scripts/opencode-version.cjs"
      - "tests/_support/hermetic-opencode-path.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-062-opencode-2-primary-v1-fallback"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 062-opencode-2-primary-v1-fallback |
| **Status** | Complete |
| **Completed** | Work finished 2026-10-22; pushed to main as `4505c338b1` with CI green |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

OpenCode 2 is now the version the repository expects. A machine that has OpenCode 2 and OpenCode 1 in different PATH directories runs OpenCode 2 without a pin, and uses OpenCode 1 only when OpenCode 2 is not installed. The docs now say the same thing: OpenCode 2 is the version to move to, and OpenCode 1 support is temporary backwards compatibility for users who have not updated, with no removal date.

### Phase 62: opencode-2-primary-v1-fallback

The fan-out runtime resolver and cli-opencode's documented one-line resolver used to walk PATH directory by directory, trying `opencode2` then `opencode` inside each directory. That order let an `opencode` (OpenCode 1) in an earlier directory beat an `opencode2` in a later one. On this machine both live in `~/.local/bin`, so `opencode2` already won here; the change matters for machines with the two in different directories. Both resolvers now take the first `opencode2` anywhere on PATH, fall back to the first `opencode` only when no `opencode2` exists, and still let `OPENCODE_BIN` override both.

The dual-dispatch tests follow the same order. The old PATH-order test was replaced by "prefers opencode2 on a later PATH directory over opencode on an earlier one", and two tests were added: "falls back to the first opencode on PATH when no opencode2 exists" and "OPENCODE_BIN overrides an opencode2 elsewhere on PATH". As a negative control, the old loop returned the v1 `opencode` for the new fixture. A new shared `tests/_support/hermetic-opencode-path.ts` setup removes host `opencode2` directories from PATH and deletes `OPENCODE_BIN`, because a host install otherwise shadows the v1 stubs the suites put first; it is wired into the deep-loop and spec-kit vitest configs. Before that fix, 53 tests failed in the fan-out suites and 32 in a full run on this host.

The documentation now recommends OpenCode 2 first and labels OpenCode 1 the fallback for users who have not updated, with no removal date. That order reached cli-opencode's SKILL.md, README.md, references/install-and-versions.md, cli-reference.md and providers-and-models.md; assets/prompt-templates.md, prompt-quality-card.md and the manual-testing-playbook overview; the opencode-setup.sh usage text, where OpenCode 2 is recommended first and the shell logic is unchanged; `.opencode/plugins/README.md`, `.skilled/CROSS-CLI.md` and the root README.md; the feature-catalog opencode-dual-version-dispatch doc, the runtime scripts README and the cli-opencode changelog v1.5.0.0; and the Hermes mirror, regenerated.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-deep-loop/runtime/scripts/opencode-version.cjs` | Modified | First `opencode2` anywhere on PATH wins, first `opencode` is the fallback only when none exists, `OPENCODE_BIN` still overrides both |
| cli-opencode's documented one-line resolver | Modified | Same two-pass order as the runtime resolver |
| `opencode-dual-dispatch.vitest.ts` | Modified | Replaced the PATH-order test and added the no-`opencode2` fallback and `OPENCODE_BIN` override tests |
| `tests/_support/hermetic-opencode-path.ts` | Created | Shared setup that strips host `opencode2` directories and `OPENCODE_BIN` from the test environment |
| `.skilled/skills/system-deep-loop/vitest.config.ts`, `system-spec-kit/runtime/vitest.config.ts` | Modified | Wire the shared hermetic PATH setup into both vitest projects |
| cli-opencode SKILL.md, README.md, references/install-and-versions.md, references/cli-reference.md, references/providers-and-models.md | Modified | OpenCode 2 first, OpenCode 1 labelled the fallback |
| cli-opencode assets/prompt-templates.md, assets/prompt-quality-card.md, references/manual-testing-playbook.md | Modified | Prompt assets and playbook overview reordered |
| `.skilled/skills/cli-external-orchestration/cli-opencode/opencode-setup.sh` | Modified | Usage text recommends OpenCode 2 first; shell logic unchanged |
| `.opencode/plugins/README.md`, `.skilled/CROSS-CLI.md`, `README.md` | Modified | Reordered to OpenCode 2 first |
| feature-catalog opencode-dual-version-dispatch doc, runtime scripts README, cli-opencode changelog v1.5.0.0 | Modified | Reordered and updated |
| Hermes mirror | Modified | Regenerated from the updated cli-opencode source |
| `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` | Modified | This phase's packet, filled from the scaffold |
| `../spec.md` | Modified | The phase map row for 062 and the 061 to 062 handoff row |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

DeepSeek v4.1 flash 1017 writers through cli-pi wrote the code at max thinking and the docs at high thinking, and separate read-only DeepSeek sessions reviewed the result. The orchestrator fixed one setup-file path segment in `system-spec-kit/runtime/vitest.config.ts` by hand. Luna was not used. The orchestrator then reran the suites: plugins 533 of 533; battery, config-shape and cli-opencode script tests 85 of 85; the cli-opencode playbook PASS with 72 scenarios and 0 violations; the deep-loop full suite 2806 passed and 8 skipped of 2814; and the combined spec-kit config ran 35 deep-loop tests green. Both live proofs are saved in `scratch/live/`: with both versions installed, the resolver returned `opencode2` v2 and an unpinned fan-out cli-opencode dispatch ran `opencode2 run --standalone -m llmgateway/deepseek-v4.1-flash-1017#max`, exit 0, reply OK; with v2 hidden from PATH, the resolver returned `opencode` v1 and an unpinned dispatch ran `opencode run --model llmgateway/deepseek-v4.1-flash-1017 --variant max`, exit 0, reply OK. The change was pushed to main as `4505c338b1`, and CI is green on that commit: all 19 workflows succeeded, including OpenCode Dual-Version Battery `39877603254`, OpenCode Plugin Tests `39877603364`, Deep-Loop Runtime Tests `39877603319`, Hook Node Tests `39877603327`, Spec-Kit Check `39877603324` and Playbook Operator Contract `39877603329`. The index rebuild `1ed84757f3` had 13 succeeded, Trigger Index Rebuild skipped and Spec-Kit Check `39877786754` green.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Make the first `opencode2` anywhere on PATH win | The operator wants OpenCode 2 expected and promoted, so a later OpenCode 2 must not lose to an earlier OpenCode 1 just because of directory order |
| Keep the first `opencode` as the fallback only when no `opencode2` exists | OpenCode 1 support is temporary backwards compatibility for users who have not updated, so it must still work when OpenCode 2 is absent |
| Keep `OPENCODE_BIN` as the override | An explicit pin must beat any PATH search, as it did before |
| Add a shared hermetic PATH setup instead of per-suite cleanup | A host OpenCode 2 install shadows the v1 stubs; one setup shared by both vitest projects keeps every suite independent of the host and removes the 53 fan-out and 32 full-run failures |
| Name OpenCode 2 first in every doc with no removal date for OpenCode 1 | The operator's request says OpenCode 1 support is temporary and not all users have updated, so the docs recommend the move without announcing a cut-off |
| Leave the v4.0.0.13 changelog's old per-directory rule alone | Another phase owns that file, so this phase records it as a known limitation instead of editing outside its scope |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Resolver with both versions installed | PASS: `opencode2` v2 at `~/.local/bin/opencode2` (`scratch/live/resolve-both-installed.json`) |
| Resolver with v2 hidden from PATH | PASS: `opencode` v1 (`scratch/live/resolve-v2-hidden.json`) |
| Unpinned fan-out dispatch with both versions installed | PASS: `opencode2 run --standalone -m llmgateway/deepseek-v4.1-flash-1017#max`, exit 0, reply OK (`scratch/live/fanout-unpinned-both-installed.txt`) |
| Unpinned fan-out dispatch with v2 hidden from PATH | PASS: `opencode run --model llmgateway/deepseek-v4.1-flash-1017 --variant max`, exit 0, reply OK (`scratch/live/fanout-unpinned-v2-hidden.txt`) |
| Dual-dispatch tests | PASS: later-`opencode2` preference, no-`opencode2` fallback and `OPENCODE_BIN` override, with the old loop failing the new fixture as the negative control |
| Hermetic PATH setup | PASS: host `opencode2` directories removed and `OPENCODE_BIN` deleted in both vitest projects; before it, 53 fan-out tests and 32 tests in a full run failed on this host |
| Plugins suite | PASS: 533 of 533 |
| Battery, config-shape and cli-opencode script tests | PASS: 85 of 85 |
| cli-opencode playbook | PASS: 72 scenarios, 0 violations |
| Deep-loop full suite | PASS: 2806 passed, 8 skipped (2814) |
| Combined spec-kit config | PASS: 35 deep-loop tests green |
| Separate read-only DeepSeek reviews | Completed by separate read-only sessions |
| Push to main | PASS: pushed as `4505c338b1` |
| CI on `4505c338b1` | PASS: all 19 workflows succeeded, including OpenCode Dual-Version Battery `39877603254`, OpenCode Plugin Tests `39877603364`, Deep-Loop Runtime Tests `39877603319`, Hook Node Tests `39877603327`, Spec-Kit Check `39877603324` and Playbook Operator Contract `39877603329` |
| Index rebuild `1ed84757f3` | PASS: 13 succeeded, Trigger Index Rebuild skipped, Spec-Kit Check `39877786754` green |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The v4.0.0.13 skilled changelog still stated the old per-directory rule.** This phase left it alone because another phase owns that file. Resolved on main by `5801f6f807`, which came from another phase: the changelog now states the opencode2-anywhere-on-PATH rule.
<!-- /ANCHOR:limitations -->

---
