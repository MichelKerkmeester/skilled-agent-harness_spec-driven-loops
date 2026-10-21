---
title: "Implementation Summary"
description: "An unpinned OpenCode 2 dispatch now defaults to llmgateway/deepseek-v4.1-flash#max while OpenCode 1 keeps opencode-go; the hook node:test files gate merges in a new CI job, and the recorded doc and comment follow-ups are closed."
trigger_phrases:
  - "v2 default model and follow ups implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/082-opencode-v1-v2-dual-compat/043-v2-default-model-and-follow-ups"
    last_updated_at: "2026-10-21T09:30:00Z"
    last_updated_by: "group-043-worker"
    recent_action: "Built, verified and Luna-reviewed the v2 default model and follow-ups"
    next_safe_action: "Rerun the OpenCode 1 unpinned live dispatch once the opencode-go quota resets"
    blockers:
      - "OpenCode 1 live dispatch: opencode-go reports Go usage limit exceeded"
    key_files:
      - ".skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
      - ".github/workflows/hooks-node-tests.yml"
      - ".skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-043-v2-default-model-and-follow-ups"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions:
      - "OpenCode 2 default provider: llmgateway (operator, 2026-10-21)"
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
| **Spec Folder** | 043-v2-default-model-and-follow-ups |
| **Completed** | 2026-10-21 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

An OpenCode 2 lineage with no pinned model used to name `opencode-go/deepseek-v4.1-flash`, a provider OpenCode 2 does not list on this machine, so it failed. It now defaults to `llmgateway/deepseek-v4.1-flash#max`, and OpenCode 1 keeps `opencode-go/deepseek-v4.1-flash --variant max`. The 29 hook node:test files and the installer test now gate merges in their own CI job.

### v2 default model and follow-ups

The fan-out runner picks the default from the binary it resolves, so the same lineage file works on either version. The cli-opencode skill, README, references, playbook, assets and the Hermes copy say which default belongs to which binary, and the pre-flight sets `DEFAULT_OK` from the provider that hosts it. The default-model test pins both ids, checks each selector form and asserts the two share the model and differ in provider.

The follow-ups recorded by 035, 037 and 042 are closed: the v2-bridge announcement tests fail in about a second instead of hanging the suite, the plugins README no longer claims more than the probe saw, the spec gate's shell-write limit is documented, and four comments now say what the code does.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modified | Per-version default model, exported `OPENCODE_V2_DEFAULT_MODEL` |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts`, `opencode-dual-dispatch.vitest.ts` | Modified | Drift case and one unpinned test per version |
| `.skilled/skills/cli-external-orchestration/cli-opencode/` (SKILL.md, README, references, playbook, assets) and `.hermes/skills/cli-opencode/SKILL.md` | Modified | Per-version default model |
| `cli-opencode/scripts/tests/default-model-id.test.cjs` | Modified | Both defaults pinned and asserted to differ |
| `.opencode/plugins/tests/v2-bridge.test.cjs` | Modified | One-second timeout on the announcement tests |
| `.opencode/plugins/README.md` | Modified | Probe claim limited to what was observed |
| `.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/README.md`, `plugin-utilization/system-spec-gate.md` | Modified | Shell-write known limit |
| `.skilled/hooks/task-dispatch/lib/dispatch-guard.cjs`, `.skilled/hooks/post-edit-quality/lib/post-edit-router.cjs`, `.github/workflows/trigger-index-rebuild.yml` | Modified | Comment accuracy only |
| `.github/workflows/hooks-node-tests.yml`, `.github/workflows/README.md` | Created / Modified | Blocking Hook Node Tests job |
| `../006-*/implementation-summary.md`, `../036-*/implementation-summary.md`, `../goal.md` | Modified | v2 default-model notes marked resolved |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

DeepSeek v4.1 flash at max, through cli-pi on llmgateway, wrote every change from eleven one-change briefs (`scratch/briefs/`). I ran every local check in the table below myself and reproduced the timeout mutation; the Luna row is its review, and the CI row stays pending until the push. Luna (GPT-6 Luna, max, fast, read-only through cli-codex) reviewed the range from `d76353d242`. Round 1 failed with four P1s and one P2: the OpenCode 1 live dispatch had not exited 0, the README probe sentence still overclaimed, the shell-write row misstated where paths are evaluated, the mutation proof was not recorded, and a break-lock comment missed the unreadable-record fallback. The three wording findings were fixed in `9f2c2529ce` and the mutation proof is in `scratch/after/v2-bridge-timeout-mutation.txt`; the live dispatch is the open item under Known Limitations.

Commits: `32a096d41a` runtime, `5f56290b06` docs, `2bc3e8430b` default-model test, `c3b40e5b81` bridge timeout, `1218e32308` spec gate and probe docs, `90f98701f0` comments, `5a6b93251c` Hook Node Tests workflow, `784864b0e9` resolution notes, `9f2c2529ce` round 1 fixes.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Choose the default after the binary resolves | One lineage file then works on both versions, and an explicit model still wins |
| The pre-flight keeps one simple check per provider and derives `DEFAULT_OK` | The models-form test parses the `&& VAR=1 \|\| VAR=0` shape; a compound check broke it |
| The Hook Node Tests job selects files at run time and fails closed on zero | A new hook test joins the gate without a workflow edit, and an empty match cannot pass |
| Prove the timeout by mutating the bridge, not the test | The point is that a real missing announcement fails fast |
| 036 Known Limitation 7 is recorded again, not fixed | Closing it needs a shell parser, not a cheap change |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| cli-opencode script tests | PASS: default-model 5/5, setup-classify 2/2, models-form 16/16 (`scratch/after/checks-2.txt`) |
| Plugin suite | PASS 516/516 (baseline 516) |
| Hook node:test | PASS 856/856 over 29 files (baseline 856) |
| install-hooks.test.sh | PASS 4/4 (baseline 4) |
| Deep-loop vitest: fanout-run, opencode-dual-dispatch, executor-config | PASS 299/299 (273 baseline for two files plus 26) |
| sk-doc script tests | PASS; the rename harness failed only while live dispatches wrote into the worktree and passed 4/4 when rerun on a quiet worktree |
| Playbook validator | PASS, 72 scenarios, violations 0, warnings 0 (was 2 warnings) |
| Markdown links, Hermes sync | PASS, 0 broken; 68 copies in sync |
| actionlint, check-gate-inputs.sh | PASS |
| Bridge timeout mutation | Mutated: exit 1 in 4 s, 11 fail, 3 cancelled by timeout (before: killed by the 120 s alarm). Restored: diff empty, 51/51 |
| Live unpinned dispatch, OpenCode 2 | PASS: built `opencode2 run --standalone -m llmgateway/deepseek-v4.1-flash#max`, exit 0, replied OK (`scratch/live/v2-unpinned.txt`) |
| Live unpinned dispatch, OpenCode 1 | BLOCKED: built the expected `opencode run --model opencode-go/deepseek-v4.1-flash --variant max`, but opencode-go returned `Go usage limit exceeded` and 1.19.3 hung until the alarm (`scratch/live/v1-unpinned.txt`, `v1-probe-errors.txt`) |
| Luna review | Round 1 FAIL (4 P1, 1 P2), fixed in `9f2c2529ce`. Round 2 FAIL (2 P1 on packet-doc accuracy, 1 P2 whitespace), fixed in `1c5a576c40`. Round 3 FAIL (3 P1, 1 P2, all packet-doc accuracy), fixed in `05783e32d5`. Round 4 FAIL (2 P1): the CI-coverage overclaim in the problem statement, fixed after it, and the CO-012 high versus max mismatch, recorded as Known Limitation 4. The 4-round stop rule ends review there. The OpenCode 1 live run is classed recorded-blocked in every round |
| Hook Node Tests on CI | Pending: no run exists until the push to main |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **OpenCode 1 live dispatch not yet proven.** The opencode-go account is over its usage limit, so the unpinned v1 run cannot exit 0 until it resets. This phase did not change the v1 default; the unit tests pin its argv. OpenCode 1.19.3 also hangs on that error instead of exiting, which a caller only sees as a timeout.
2. **The pre-flight check reads shell text, not a shell parse** (036 Known Limitation 7, recorded again). It still misses an escaped delimiter before `#`, treats a backslash followed by spaces as a continuation, and accepts a `printf` whose format prints other text or a `printf -v` variable. Each needs a crafted line inside the skill's own block, and that block is run live.
3. **The shell-write gap stays open by choice.** The spec gate cannot refuse a file written by a shell command; the operator kept it as a known limit.
4. **CO-012 says `high` but runs `max`.** The variant-levels scenario calls `high` its verified upper point and `max` unverified, yet its step 2 commands pass `--variant max` and `#max` and label the result HIGH, while the roster pins this route to `max`. That mismatch predates this phase, which only edited the scenario's provider notes; aligning it means choosing the comparison's upper point, so it is left for the playbook's owner.
<!-- /ANCHOR:limitations -->

---
