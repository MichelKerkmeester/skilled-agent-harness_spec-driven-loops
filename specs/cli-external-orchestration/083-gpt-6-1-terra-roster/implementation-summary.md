---
title: "Implementation Summary"
description: "GPT-6.1 Terra is now a named model on cli-codex, cli-opencode and cli-pi, and the cli-pi fan-out accepts it."
trigger_phrases:
  - "gpt 6 1 terra roster implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/083-gpt-6-1-terra-roster"
    last_updated_at: "2026-10-27T06:59:33Z"
    last_updated_by: "generate-context"
    recent_action: "Added GPT-6.1 Terra to three CLI rosters and the cli-pi fan-out allowlist"
    next_safe_action: "None"
    blockers: []
    key_files:
      - ".skilled/skills/cli-external-orchestration/cli-codex/references/providers-and-models.md"
      - ".skilled/skills/cli-external-orchestration/cli-opencode/references/providers-and-models.md"
      - ".skilled/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md"
      - ".skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts"
      - ".skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
    session_dedup:
      fingerprint: "sha256:b21c51fdf829e0b3dea418f400ea248e3cd093d7ecf4bf5638978ed7f2bd440f"
      session_id: "scaffold-083-gpt-6-1-terra-roster"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata
<!-- FILL: Fill the folder name, the completion date and the level. Use the real date. GOOD: `004-rotate-logs-keep`. Completed 2026-10-24. Level 1. WEAK: Folder: TBD. -->

| Field | Value |
|-------|-------|
| **Spec Folder** | 083-gpt-6-1-terra-roster |
| **Completed** | 2026-10-27 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

You can now ask any of the three openai-capable CLI skills for GPT-6.1 Terra by name. Codex takes `--model gpt-6.1-terra`, OpenCode takes `openai/gpt-6.1-terra` or its `-fast` tier, and Pi takes `openai/gpt-6.1-terra`, which a deep-loop lineage can now pin too.

### Add GPT-6.1 Terra to cli-codex, cli-opencode and cli-pi through the openai provider

GPT-6.1 Terra is the newest Terra model in the Codex catalog, with efforts from `low` to `ultra`. Each skill's roster now lists it beside the models it already had, and nothing was removed. The Pi fan-out used to refuse the id. It now accepts it and dispatches it through the `openai` provider.

On the operator's request the same session checked every CLI for a newer release. Codex 0.164.0, OpenCode 2 2.1.4 and Pi 1.4.0 were already the latest. Four Pi extension packages moved up: both rpiv packages to 2.15.0, pi-blackhole to 0.5.16 and pi-web-access to 0.45.0.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `cli-codex/` SKILL.md, README.md, references, prompt templates, roster playbook | Modified | Fifth model row and ceiling |
| `cli-opencode/` SKILL.md and two references | Modified | Terra row in the GPT grid |
| `cli-pi/` SKILL.md, providers reference, allowlist playbook | Modified | openai roster row and ten-id allowlist |
| Three `changelog/` entries | Created | v1.9.8.0, v1.5.2.0 and v1.5.16.0 |
| `executor-config.ts`, `fanout-run.cjs` and two unit tests | Modified | Fan-out allowlist and provider map |
| `.pi/settings.json`, three `.hermes/skills` mirrors | Modified | Picker entry and regenerated mirrors |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The model id came from the Codex catalog and was then dispatched once on each CLI. The roster tests were changed first and failed for the expected reason, an allowlist without the id. The allowlist edit turned them green, and the full deep-loop runtime suite ran last. The work landed in `4b3b046da2` (fan-out allowlist) and `ac27f18a24` (rosters).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep `gpt-5.6-terra` on cli-codex | The request was to add the newest Terra, and Codex still lists the older one |
| Add both OpenCode Terra tiers but only the base Pi id | OpenCode's catalog lists a `-fast` slug, and Pi exposes base persona slugs only |
| Leave the Pi fast-mode extension's model list alone (reversed 2026-10-28) | It pins a priority service tier for Sol and Luna, and Terra there would change billing behavior nobody asked for. On 2026-10-28 the operator asked for Terra at high, fast, so `openai/gpt-6.1-terra` joined the extension's built-in targets in `src/config.ts`, its test and README; the config file alone could not do it, because the extension resets its targets to the built-in list at session start. `npm run check` passes 81/81. The legacy `openai-codex` provider is gone in Pi 1.0, so Terra was added under `openai` only. Pi's JSON events do not show the request payload, so a live priority-tier request is inferred from the tested matcher, not observed |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Codex `-m gpt-6.1-terra` one-turn smoke | PASS, `OK`, exit 0, header `model: gpt-6.1-terra` |
| OpenCode 1 `-m openai/gpt-6.1-terra` one-turn smoke | PASS, `OK`, exit 0 |
| Pi `--model openai/gpt-6.1-terra` smoke, before and after extension updates | PASS, `OK`, exit 0 both times |
| Roster unit tests before the allowlist edit | FAIL as expected, 2 failed, both naming the missing id |
| Two roster suites after the edit | PASS, both files passed inside the full run below |
| Full deep-loop runtime suite | 2816 passed, 7 failed, 8 skipped of 2831. Rerun alone, 5 of the 7 passed (timing under a 27-minute load). The OpenCode flag test failed once and passed once on the same tree. The zod pin check fails because commit `5db69806e2` raised the pin to 4.6.7 while `node_modules` holds 4.4.3. None touches the allowlist |
| Changelog entries | PASS, `validate_document.py` VALID with 0 issues, HVR scan no hard blockers |
| Hermes mirrors | PASS, sync wrote exactly the three touched mirrors |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **OpenCode's Terra effort range is unmeasured.** OpenCode does not report variant ranges, so the roster names the Codex catalog range and says so. Accepted: OpenCode exposes no range to measure, and the roster labels the borrowed range as unmeasured.
2. **The `-fast` OpenCode slug is list-verified only.** The base slug was dispatched, and the `-fast` one was seen in the catalog. Accepted: the slug comes from OpenCode's own catalog, and the base slug of the same model dispatched as expected.
3. **Done: the runtime `node_modules` matches its pin.** On 2026-10-27 `.skilled/skills/system-deep-loop/runtime/package.json:18` pins `zod` `4.6.7`, the installed `node_modules/zod/package.json` reads `4.6.7`, and `npm ls zod` prints `zod@4.6.7`.
4. **npm audit flags the Pi extension trees.** Fixed on 2026-10-28 with `npm audit fix`, no `--force`, on the operator's go-ahead. In `~/.pi/agent/npm` it cleared `body-parser`, `fast-uri` and `qs`; in the `pi-cache-optimizer` clone it cleared `brace-expansion` and `zod`. Accepted: `undici` 8.10.2 (high, an EventSource parser memory DoS) stays, because `@earendil-works/pi-coding-agent` 1.4.0, the latest release, pins that exact version, so no non-forced fix can move it, and the Pi CLI itself ships the same pin. Pi still answers `OK` with exit 0 on `--model openai/gpt-6.1-terra` after the fix. The clone's updated `package-lock.json` is left uncommitted in that repository for the operator.
5. **The fast-mode playbook targeted a removed provider.** Resolved 2026-10-28 after a Terra alignment run flagged it: every scenario in `.pi/extensions/pi-fast-mode-w-subagent-support/manual-testing-playbook/` now launches on the `openai` provider instead of the `openai-codex` name Pi 1.0 removed, and FAST-002 checks `openai/gpt-6.1-terra`. `validate-playbook-package.cjs --package` passes with 10 scenarios and 0 violations.
<!-- /ANCHOR:limitations -->

---
