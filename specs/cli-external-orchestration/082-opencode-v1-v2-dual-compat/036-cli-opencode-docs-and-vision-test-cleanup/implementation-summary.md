---
title: "Implementation Summary"
description: "The follow-ups phases 027 and 028 left are closed. The pre-flight test finds shell comments by quote state and checks each prefix grep reads the standalone listing, every note that sends an OpenCode 2 reader to `opencode2 models --standalone` names the prefix to look for, two guards keep it that way, the sk-vision kill-switch tests leave no directory behind, and the plugin playbook snippets that load a plugin in-process run again."
trigger_phrases:
  - "cli opencode docs and vision test cleanup implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/082-opencode-v1-v2-dual-compat/036-cli-opencode-docs-and-vision-test-cleanup"
    last_updated_at: "2026-10-20T22:00:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Recorded the local verification and sent the change to review"
    next_safe_action: "Apply the review verdict, then push to main and confirm CI"
    blockers: []
    key_files:
      - ".skilled/skills/cli-external-orchestration/cli-opencode/scripts/tests/opencode2-models-form.test.cjs"
      - ".skilled/skills/sk-vision/vision-runtime/tests/plugin.test.ts"
      - ".skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/git-preflight-advisory/git-preflight-advisory.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-036-cli-opencode-docs-and-vision-test-cleanup"
      parent_session_id: null
    completion_pct: 80
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
| **Spec Folder** | 036-cli-opencode-docs-and-vision-test-cleanup |
| **Completed** | In progress |
| **Status** | In Progress |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Five follow-ups from phases 027 and 028 are closed, and two problems found on the way are fixed with them.

### Phase 36: cli-opencode-docs-and-vision-test-cleanup

**Pre-flight comments.** The doc test used to cut a trailing comment at the first ` #` after a line's last quote, so a quote inside the comment kept a fake `grep '^opencode-go/' ... && OPENCODE_GO_OK=1` active. `activeShellLines` now walks each line's quote state: a `#` starts a comment only outside quotes, unescaped, at the line start or after whitespace or `;|&()`. Each prefix grep in the OpenCode 2 block must also read the standalone listing, piped straight from `opencode2 models --standalone` or from a variable an earlier line filled from it.

**Listing notes.** 43 notes across the cli-opencode docs and one cli-devin reference sent an OpenCode 2 reader to `opencode2 models --standalone` without saying what to look for. Each now names a prefix: the dispatched provider's (`opencode-go/`), the route a 2.0.32 run used (`llmgateway/`), or the model's `<provider>/` where no provider is named.

**Two new guards.** One fails on a lowercase `opencode models` or `opencode2 models` command left in prose outside code spans and fenced blocks; none exists today. The other fails on a clause that sends a reader to the standalone listing with a check word and names no prefix. It reads the prefix, filter and grep words from the clause's prose only, so an unrelated command span cannot exempt it. Both scan every shipped doc under the CLI skills and the Hermes copy.

**sk-vision temp directories.** Each kill-switch case pointed `HOOK_FLAGS_CONFIG` at a file inside a fresh `mkdtemp` directory and never removed it. The path now sits under a parent that is never created, so a run adds no `sk-vision-flags-*` entry. Before the change it added 7.

**Playbook snippets.** The follow-up named the `.skilled/plugins/` path in the speckit-completion step 6. That path is a symlink to `.opencode/plugins/` and resolves. What actually failed was the call: `mod.default({ directory })` throws `mod.default is not a function`, because every plugin default-exports `{ id, setup, server }`. Ten such calls in seven playbooks now go through `default.server(...)`. Running those snippets turned up a second break: CO-038's scratch repo held only the sk-git `SKILL.md`. The plugin finds its source root through `skills/system-spec-kit/SKILL.md` and reads its rules from `hard-rules.json`, so step 3 printed no advisory. Step 2 now copies both.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `cli-opencode/scripts/tests/opencode2-models-form.test.cjs` | Modified | Quote-aware comment stripper, listing-source check, prose guard, prefix-note guard and their unit tests |
| 28 Markdown files under `cli-external-orchestration/cli-opencode/` and `cli-devin/references/providers-and-models.md` | Modified | The listing notes name the prefix |
| `sk-vision/vision-runtime/tests/plugin.test.ts` | Modified | The kill-switch switch-file path is never created |
| Seven plugin playbooks in system-spec-kit, sk-code, cli-external-orchestration and cli-opencode | Modified | In-process snippets call `default.server(...)`; CO-038 step 2 copies the rules and the source-root sentinel |
| `../spec.md`, `../graph-metadata.json` | Modified | Phase map, handoff row and child id |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

DeepSeek v4.1 flash at max thinking, through cli-pi on llmgateway, wrote every code and doc change from seven one-change briefs. I wrote this folder's docs, registered the phase, ran every check below and wrote the mutants. Luna (GPT-6 Luna, max, fast, read-only through cli-codex) reviews the range from the baseline commit `b66382b384`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Fix the call form, keep the `.skilled/plugins/` path | The symlink resolves, and the snippets failed on `mod.default(...)`, not on the path |
| Fix all seven playbooks, not only the one the follow-up named | They break the same way, the fix is the same call, and REQ-002 asks every changed snippet to run |
| Fix CO-038 step 2 here | It is one of the changed snippets, and with the call fixed it still printed nothing |
| A switch-file path that is never created, rather than an `afterEach` cleanup | Nothing is created, so nothing can leak, even when a case throws |
| The prose guard matches the lowercase command form only | The capitalised product name "OpenCode models" is ordinary prose |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| cli-opencode script tests | PASS, 19/19 (baseline 13/13) |
| Mutants of the six new rules (`scratch/mutation/`) | Each fails 1 test: text-level comment cut, any listing counts, no prose scan, no prefix scan, exemption on the whole clause, no `confirming` |
| sk-vision `bun test tests` | PASS, 80/80 (baseline 80/80); `sk-vision-flags-*` entries 63 before and 63 after a run (baseline added 7) |
| sk-vision `bunx tsc --noEmit` | PASS, exit 0 |
| speckit-completion steps 3 and 6 (`scratch/after/speckit-completion.txt`) | Run; step 6 prints `hooks keys: []` with the switch set (baseline: `TypeError`, exit 1) |
| dist-freshness steps 3 and 4 | Run, exit 0 |
| session-cleanup harness | Run, exit 0; the startup warning is injected once and dispose is idempotent |
| completion-sentinel adapter block | Run, exit 0; one advisory line, deduplicated on the repeat |
| post-edit-quality live block | Run, exit 0; the advisory finding is injected |
| cli-dispatch-audit live block | Run, exit 0; the bearer token is logged as `[REDACTED]` |
| CO-038 steps 2 to 4 | Step 3 prints `[commit-scope-drops-untracked]`; step 4 with `SKGIT_ADVISORY=0` prints `{"system":[]}` |
| Playbook validator `--strict` | PASS, exit 0; cli-opencode 72 scenarios, 0 violations |
| Markdown link integrity | PASS, 0 broken links |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Other sk-vision test temp directories.** `tests/host-adapter.test.ts` (`sk-vision-host-`), `tests/runtime/client.test.ts` (`sk-vision-client-`) and the `temporaryDirectory()` helper in `tests/plugin.test.ts` still leave 10 directories per run. They were not a recorded follow-up.
2. **A speckit-completion fixture moved.** Step 3's "Level-2 EVIDENCE_MISSING" fixture now reports `level: 1` and `P0_INCOMPLETE`, so its expected values are stale. The snippet runs; the fixture choice is outside this phase.
3. **The cli-pi twin of CO-038** also copies only the sk-git `SKILL.md` into its scratch repo, so it may print no advisory for the same reason. It drives a Pi extension, not this plugin, and was not run here.
4. **The prefix guard reads wording.** A clause that names a prefix the reader should not look for still passes; review covers that.
<!-- /ANCHOR:limitations -->
