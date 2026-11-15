---
title: "Implementation Summary"
description: "Mistral Vibe now has the command surfacing tools the other runtimes have. The scorer reads its sessions, the runner names it as not measured, the doctor checks its hook and mirrors, its observations carry its own name, and its brief names the document of each command it offers."
trigger_phrases:
  - "vibe runtime parity implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/008-command-surfacing-build/030-vibe-runtime-parity"
    last_updated_at: "2026-11-15T12:45:00Z"
    last_updated_by: "coordinator"
    recent_action: "Closed the phase: fix 6c026746381 and follow-up 0c4de1808e7, review SHIP"
    next_safe_action: "None in this phase. The handed-back gaps wait on the operator"
    blockers: []
    key_files:
      - ".skilled/skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs"
      - "scratch/repro-after.txt"
      - "scratch/review/report.txt"
      - "scratch/handback.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "77af2d6d-58e8-4180-b6da-697f12833f71"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 030-vibe-runtime-parity |
| **Completed** | 2026-11-15 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A Mistral Vibe session now gets the same command surfacing support as the other runtimes. A model on Vibe sees the document of each command its brief offers, and the tools that measure and check the brief now know Vibe.

### Phase 30: vibe-runtime-parity

Vibe has no command loader and its prompt stubs are named with a dash (`/doctor-setup`), while the brief names commands with a colon (`/doctor:setup`). A model on Vibe now gets one extra line under the routing head, such as `Command documents (read in full before taking one): /create:readme is .skilled/commands/create/readme.md.`, so it can open the workflow the brief offers. The line names only documents that exist, and it is added before the repeat check, so an unchanged head is still dropped.

The transcript scorer now scores a Vibe run from the tool calls its journal records. The behaviour runner names Vibe as not measured, with its reason, rather than as an unknown runtime. `/doctor:setup`'s wiring check reads `.vibe/hooks.toml` and prints `ok vibe`, and `/doctor:runtime-mirrors` runs the three Vibe mirror checks. A policy observation from Pi, DSH, Vibe or Codex now carries that runtime's name instead of `Claude Code`.

BASE is `70975514563`. The fix is `6c026746381` and the review follow-up is `0c4de1808e7`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs` | Modified | A Vibe tool table with the four recorded names, and `vibeRecords`, which turns the reader's entries into records in session order |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-transcript-score.vitest.ts` | Modified | The Vibe table, `vibeRecords` order and a summary scored from the committed fixture |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs` | Modified | Vibe in `NOT_MEASURED` with its reason |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-behaviour-guards.vitest.ts` | Modified | `--print-argv vibe` exits 2 as not measured |
| `.skilled/commands/doctor/scripts/hook-wiring-check.cjs` | Modified | A Vibe row read line by line from `.vibe/hooks.toml`, where every header line ends the block before it |
| `.skilled/commands/doctor/scripts/tests/hook-wiring-check.test.cjs` | Modified | Eight Vibe cases, including a commented header and a later table |
| `.skilled/commands/doctor/assets/doctor-runtime-mirrors.yaml` | Modified | Three Vibe check steps and repair lines under the n/a rule |
| `.skilled/commands/doctor/_routes.yaml` | Modified | The three Vibe check invocations |
| `.skilled/commands/doctor/scripts/tests/doctor-runtime-mirrors-contract.test.cjs` | Modified | The Vibe checks in the contract |
| `.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts` | Modified | The observation label is `Claude Code` for Claude and the runtime's own name for every other caller |
| `.skilled/skills/system-skill-advisor/runtime/tests/hooks/claude-user-prompt-submit-hook.vitest.ts` | Modified | Five label cases |
| `.skilled/skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs` | Modified | `withCommandDocuments` adds the document line before the head receipt |
| `.skilled/skills/system-skill-advisor/runtime/tests/hooks/vibe-prompt-advisor.vitest.ts` | Created | Three proof cases with the real advisor in an isolated scope and seven document-line cases |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md` | Modified | The scorer reads Vibe under `--summary`, and the runner names Cursor and Vibe as not measured |
| `.skilled/commands/doctor/scripts/README.markdown` | Modified | The wiring check reads `.vibe/hooks.toml` and names what that reading gets wrong |
| `.skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md` | Modified | The Vibe row says the head names each command's document |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The coordinator recorded the before state and the gap matrix. DeepSeek v4.1 flash workers on OpenCode Go then ran four code lanes side by side, one task per session, each test first, and an Opus verifier checked every code task before its lane moved on. The coordinator checked the five document tasks. The full gates, the floors, the matrix and the boundary checks ran after every lane closed, and one Opus reviewer read the fix diff. Four of its P2 notes became tasks T020 to T023 under the same lanes and verifiers. The verifier rejected T020 once for an extra comment line, which the coordinator removed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Read Vibe tool calls from the reader's entries in the scorer (D1) | The Vibe reader keeps tool calls out of its shared records on purpose, and changing the shared reader would touch every runtime |
| Name only recorded tool names (D2) | A process tool and a skill tool have no recorded call yet, so their names and arguments are unknown |
| Report Vibe as not measured (D3) | Live runs need an arena with credentials off and the behaviour arms are stopped |
| Read the hooks file line by line (D4) | No TOML parser is installed and decision D2 of the packet forbids an install |
| Add the document line in the Vibe hook, not `AGENTS.md` (D6) | `AGENTS.md` sits at 16250 of 16384 bytes before its last anchor, and only Vibe lacks a command loader |
| Label each observation with its runtime (D7) | Only tests read the label, so no reader breaks, and other runtimes' deliveries stop counting as Claude's |
| Stop the probe's scoped daemon before removing its folder | The daemon's shutdown wrote a generation file that recreated the removed folder about 20 seconds later |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Gap matrix | before: `unscorable_runtime`, `unknown runtime: vibe`, no Vibe wiring row, 0 and 0 mirror lines, no document line, four `["Claude Code"]` labels. After: `scored` 1, `runtime vibe is not measured:`, `vibe:ok`, 9 and 3 mirror lines, 3 document lines with the heads otherwise equal, labels `Claude Code`, `pi`, `dsh` and `vibe` (`scratch/repro-before.txt`, `scratch/repro-after.txt`) |
| Failing first runs | T003 4 failed, T004 1, T005 6, T006 4, T007 4, T009 10, T020 3, each for the reason its line names |
| Advisor suite | 2137 passed at BASE. After the fix, one run had 1 failed it did not name and two reruns had 2157 passed and 0 failed. After the follow-up, 2157 passed and 0 failed |
| Focused files after | scorer 199, runner guards 34, prompt hook 39, sink 5, drift guard 5, negative controls 13, Vibe proof 10 |
| Doctor and Vibe suites | doctor 1221 to 1229 passed, 0 failed. Vibe suites 79 and 79, 0 failed |
| Mirror and route checks | the eleven mirror checks, derive and route-validate exit 0. The wiring check prints five `ok` lines |
| Floors and eval | 24/44, 0/35, 2/44 and `[160,49,21,5]`, `cmp` equal before, after the fix and after the follow-up |
| `AGENTS.md` budget | 16250 / 16384, unchanged |
| Boundaries | `AGENTS.md`, packet 004, `.vibe`, `.skilled/hooks`, the row files, the baselines and the bridge JSON unchanged from BASE, no package change, no id in 58 added comment lines (`scratch/boundaries.txt`) |
| Review | `verdict: SHIP`, 0 P0 and 0 P1, five P2. The follow-up read `follow-up verdict: SHIP` with two new P2 kept as limits (`scratch/review/report.txt`) |
| Hand-back citations | every file and line in `scratch/handback.md` rechecked at the fix commit and still holds |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The wiring check reads TOML line by line.** A `.vibe/hooks.toml` that Vibe cannot parse, or that holds a duplicate key, can still read `ok vibe`. A value with a trailing comment or a single-quoted string reads `hook-missing`. A line that starts with `[` inside a multi-line value ends a block early and reads `hook-missing`. A second block that reuses an earlier block's name, or a command line inside another key's triple-quoted string, can still read `ok vibe`. The committed file uses none of these shapes, and the doctor scripts README names the first limits.
2. **No live Vibe start rate.** The runner names Vibe as not measured, so the packet's behaviour criterion still covers the six runtimes it named.
3. **Pi, DSH and OpenCode have no wiring row.** They load their prompt hook through an extension or a plugin, not a hooks file.
4. **One advisor suite run failed one case it did not name.** Two full reruns and the follow-up run passed with 0 failed.
5. **Handed-back gaps.** Goal binding and resend, the git advisory, doc drift, the automatic hop, the dropped repeat head and the `process_start` matcher belong to the Vibe packet or the hooks docs (`scratch/handback.md`).
6. **The label vocabulary is mixed.** Claude and OpenCode record display labels and the other runtimes record their ids. No non-test reader exists.
<!-- /ANCHOR:limitations -->

---
