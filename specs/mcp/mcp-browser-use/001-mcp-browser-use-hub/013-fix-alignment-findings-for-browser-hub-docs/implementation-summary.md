---
title: "Implementation Summary"
description: "The browser hub's docs and scripts now match bdg 0.6.10 and Code Mode, and an own-Chrome attach request routes to Chrome DevTools. All 112 alignment findings are fixed or named open."
trigger_phrases:
  - "fix alignment findings for browser hub docs implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp/mcp-browser-use/001-mcp-browser-use-hub/013-fix-alignment-findings-for-browser-hub-docs"
    last_updated_at: "2026-11-23T21:40:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Fixed every alignment finding, reran the gates and both rechecks"
    next_safe_action: "Await the operator's word on committing, per hub decision D8"
    blockers: []
    key_files:
      - ".skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts"
      - ".skilled/skills/mcp-browser-use/mcp-chrome-devtools/scripts/install.sh"
      - ".skilled/skills/mcp-browser-use/mcp-chrome-devtools/references/troubleshooting.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "587eb5dd-b522-4898-9ee2-a03a0563e3ad"
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

| Field | Value |
|-------|-------|
| **Spec Folder** | 013-fix-alignment-findings-for-browser-hub-docs |
| **Status** | Complete |
| **Completed** | 2026-11-23 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The browser hub's commands now run as written. A `bdg cdp` call passes its JSON through `--params`, Code Mode blocks drop top-level `await`, `install.sh` finds Chrome on macOS and "Attach to my own Chrome and inspect the signed-in dashboard" reaches Chrome DevTools.

### Phase 13: fix-alignment-findings-for-browser-hub-docs

Phase 12's two alignment runs found 112 defects. The doc run found 91 and the skilled run found 21. The doc run's 45 literal fixes went in by script. Four opus-medium subagents fixed the judgment findings in four owned file sets: the chrome-devtools references, its install docs, its README, SKILL, catalog and playbook, and the Aside, Code Mode and Mobbin docs. This session checked their edits against bdg's source and fixed the rest: the hub scripts, the routing lift and the release notes.

Two findings resolved differently than the runs proposed. X-2 is closed because every `bdg cdp` example in the troubleshooting guide now uses `--params`. X-3 is closed because §5 now says bdg reads no port variable, so `CHROME_DEBUGGING_PORT` does nothing, and it points at the §6 port-defect entry before you pick `-p`. D-2's proposed fix, new vocabulary in the hub's `graph-metadata.json`, was wrong: the miss came from the read-only explainer floor, so the fix is a lift in `fusion.ts` and the metadata stays unchanged.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `mcp-chrome-devtools/**` (36 files) | Modified | References, install docs, README, SKILL, catalog, playbook, changelog, scripts and examples |
| `mcp-aside-devtools/**` (21 files) | Modified | Aside docs the findings name |
| `mcp-browser-use/benchmark/README.md`, `manual-testing-playbook/manual-testing-playbook.md` | Modified | Hub root docs |
| `mcp-code-mode/SKILL.md`, `README.md`, two playbook leaves | Modified | Synchronous tool calls, the failed-run shape and the ClickUp manual |
| `mcp-tooling/mcp-mobbin/SKILL.md`, `README.md` | Modified | Mobbin findings |
| `sk-code` and `sk-doc` references (5 files) | Modified | Out-of-hub literal fixes |
| `system-skill-advisor/runtime/lib/scorer/fusion.ts` and `tests/scorer/route-gates.vitest.ts` | Modified | Own-Chrome attach lift and its tests |
| `system-skill-advisor/references/scoring/advisor-scorer.md` | Modified | Scorer doc finding |
| `system-skill-advisor/runtime/scripts/skill-graph.json` | Regenerated | Compiled graph refreshed |
| `system-deep-loop/runtime/scripts/fanout-run.cjs`, `lib/deep-loop/executor-config.ts`, `tests/unit/fanout-run.vitest.ts` | Modified | Devin model `deepseek-v4-1-flash-1017-max` |
| `cli-devin/SKILL.md`, `references/providers-and-models.md` | Modified | The same Devin model |
| `.skilled/commands/doctor/scripts/skill-graph-freshness.cjs` | Modified | Private `local-*` ids are not zombies or ghosts |
| `.skilled/changelog/skilled/v4.2.0.0.md` | Modified | The bdg port defect in the release notes |
| `.skilled/commands/assets/local-doc-alignment/local-doc-alignment-{auto,confirm}.yaml` | Modified (git-ignored) | `cli-vibe` in the preset kinds |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The session first baselined the hub gates, the advisor suite and the probes, then reproduced the P03 and P07 miss. Each bdg output shape the docs now quote was read from bdg 0.6.10's installed source: `ui/formatters/console.js` for console JSON, `ui/formatters/status.js` for status JSON and `commands/cdp.js` for the `--params` form. Code Mode behavior came from live probes: top-level `await` is refused, a failed run returns `success:true, result:null` with an `[ERROR]` log and tool proxies return synchronously. After the edits, every gate ran again from the final state and both alignment runs were rechecked. Nothing is committed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The own-Chrome lift needs an attach verb | "my own Chrome" or "logged-in Chrome" alone also opens questions about browser settings, and a first draft routed "Explain what logged-in Chrome profiles sync" to the hub |
| Fix D-3 at the shared `goneFromDisk` predicate | The ghost check reads the same predicate, so fixing only the zombie call site would leave the same false positive there |
| Fix `doctor.sh`'s Node minimum with `install.sh` | Both check the Node that bdg 0.6.10 needs, and the README now says both check for 20 |
| Record the commit method here, not in a decision record | This Level 1 packet's decision record is generated from recorded operator answers. The earlier commit `f719566d860` showed that the pre-commit spec-remint gate refuses a pathspec commit while spec docs are staged, so a plain commit after filtering the index is the working method |
| Judgment fixes ran on opus-medium subagents | This departs from hub decision D4, which names a second Claude account, and no operator approved the change. Subagents in the same session did the work, and this session checked each one's edits |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `run-probes.cjs --probes probes-p03.json` | PASS: `pass=9 fail=0`, was `pass=7 fail=2` |
| Negative controls through `advisor_recommend` | PASS: both "Inspect the signed-in dashboard and explain the revenue drop." and "Explain what logged-in Chrome profiles sync between devices." return no recommendation |
| Advisor suite, `npx vitest run` | `1 failed, 2737 passed, 4 skipped`. Baseline was `1 failed, 2734 passed`. The one failure is the same pre-existing empty `system-skilled-bots` folder |
| `parent-skill-check.cjs .skilled/skills/mcp-browser-use` | PASS: `OK`, 0 warnings |
| Five playbook validators | PASS: all exit 0. chrome-devtools reports 30 scenarios and 0 violations |
| `fanout-run.vitest.ts` and `combo-matrix.vitest.ts` | PASS: 244 of 244 and 2 of 2. The new model joined an existing test's list, so the count did not move |
| Typecheck of the advisor and deep-loop runtimes | PASS: both exit 0 |
| Freshness panel and its test | PASS: every row `none`, test 19 of 19 |
| `install.sh` functions, fixed against pre-change copy | PASS: the fix finds Chrome and logs 53 CDP domains. The old copy returned 1 and warned |
| Skilled-run recheck | Both failing battery rows pass and 4 items resolved. 16 need a reviewer: 15 judgment findings and D-4, a literal fix rewritten to drop a semicolon. D-3 reads as still open only because it was fixed at the predicate |
| Doc-run recheck, run with the skilled `recheck.cjs` | 39 literal findings resolved and 0 still open. 52 need a reviewer: 46 judgment findings and 6 literal fixes later rewritten by hand. `/local-doc-alignment` has no `--recheck` flag |
| Rescan sweeps over the topic scope and hub root | PASS: no positional `bdg cdp` call, no "26 tools", no bdg Node 18 left |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Aside's evidence script is still broken.** `mcp-aside-devtools/examples/repl-evidence-capture.sh` runs its tab and screenshot in two separate `aside repl` processes, so the second starts with `page` null. Its docs (L1-1 and L1-2) are fixed. The script needs a live signed-in Aside run to verify, so it stays open.
2. **Judgment findings have no machine recheck.** The rechecks confirm literal fixes and battery rows only. The 61 judgment fixes and 7 rewritten literal fixes were checked by reading them against bdg's source and the live probes, not by a fresh alignment run.
3. **Adjacent defects outside the topic scope stay open.** Top-level `await` appears in about 150 lines of docs outside the scope: the `mcp-code-mode` INSTALL-GUIDE, naming-convention, architecture, tool-catalog, workflows, configuration, its other playbook leaves and root playbook (including CM-012's `Promise.all`), `sk-git` references, `mcp-obsidian`, `mcp-click-up`, `mcp-figma` and the Mobbin INSTALL-GUIDE. `assets/config-template.md` still says "26 tools". The ids `deepseek-v4-1-flash-high` and `-max` are no longer in `devin models`. Troubleshooting §6 still offers `NODE_TLS_REJECT_UNAUTHORIZED`, and the utcp manuals carry em dashes at lines 36, 45 and 53. The root release notes fail three sentence-length rules that predate this phase, and the advisor suite's one failure comes from an empty `.skilled/skills/system-skilled-bots` folder another session left.
<!-- /ANCHOR:limitations -->

---
