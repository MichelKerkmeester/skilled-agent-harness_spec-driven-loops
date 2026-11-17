---
title: "Implementation Summary"
description: "The 31 hook code folder READMEs and the hooks library README now follow the code-folder template, and every claim in them was checked against the code by a second session."
trigger_phrases:
  - "hook code folder readmes implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/document-standards/006-readme-template-conformance/007-hook-code-folder-readmes"
    last_updated_at: "2026-11-17T22:40:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Closed phase 007: 32 READMEs rewritten, reviewed and every gate green"
    next_safe_action: "Commit, merge origin/main and push, then close the program"
    packet_purpose: "Purpose: Each of the 32 READMEs follows the code-folder template, passes the validator and the voice scan with zero hard blockers, and lists only files, exports and commands the folder confirms."
    blockers: []
    key_files:
      - "specs/sk-doc/document-standards/006-readme-template-conformance/007-hook-code-folder-readmes/plan.md"
      - "specs/sk-doc/document-standards/006-readme-template-conformance/007-hook-code-folder-readmes/tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-007-hook-code-folder-readmes"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "256db329-443e-4697-8e43-b3b7f7c74ec6"
      workspace: "/Users/michelkerkmeester/MEGA/Development/Skilled"
      savedAt: "2026-11-16T19:27:10Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 95
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
| **Spec Folder** | 007-hook-code-folder-readmes |
| **Completed** | 2026-11-17 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A developer who opens any `lib/`, `tests/`, `bin/` or `history/` folder under `.skilled/hooks/` now finds a README on the code-folder template that lists every file in the folder and states only what the code confirms. The hooks library README keeps its kill-switch index and the coverage matrix a test reads, now under the template's section names.

### Phase 7: hook-code-folder-readmes

The phase covers 29 `lib/`, `tests/`, `bin/`, `history/` and `session-readers/` READMEs, the session handover fixtures README, `.skilled/hooks/shared/README.md` and, last, `.skilled/hooks/README.md`. Before the rewrite all 32 passed the validator and the voice scan, but three used section names of their own and one test README missed a file. After it, all 32 fit the code-folder section model and every file table names every file. Reviewers checked 3,040 claims and raised 80 findings. The main session confirmed 78 in the code and applied them, and rejected 2. A sample review then rechecked 160 claims across 31 files and raised 7 more, all confirmed and applied.

Several corrections change what a reader would do. The shared README said the ESM facade re-exports `isFlagOn`, and importing it that way throws, so it now names the default import. Two test READMEs gave a vitest command that only works from the repository root and a wrapper path that does not exist. The session handover CLI README now says which runtimes arm a pending record and that a missing value prints no syntax line. The hooks library README now lists Vibe on five link-only hooks and two default-off concerns, not one.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| The 29 `lib/`, `tests/`, `bin/`, `history/` and `session-readers/` READMEs under `.skilled/hooks/` | Modified | Rewritten to the code-folder scaffold, with every file table checked against a listing |
| `.skilled/hooks/session-handover/tests/fixtures/README.md` | Modified | Rewritten on the same scaffold and validated with `--no-exclude` |
| `.skilled/hooks/shared/README.md` | Modified | Rewritten, with HOW IT WORKS and CONFIGURATION folded into scaffold sections |
| `.skilled/hooks/README.md` | Modified | Rewritten last. CORE PLACEMENT and COVERAGE MATRIX became H3s under ARCHITECTURE and BOUNDARIES AND FLOW, and the `### Kill-switch index` heading kept its text |
| `006-runtime-folder-readmes/tasks.md` | Modified | T013 and CHK-051 ticked after the 006 push |
| `007-hook-code-folder-readmes/` packet docs | Modified | Tasks, checklist, acceptance rows, goal log and this summary closed |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A canary writer ran first on `session-handover/lib/README.md`. The other 30 went out in eight waves of four, each wave's writers before its reviewers, and the hooks library README ran alone after them. Each session handled one README, and a reviewer never checked a file it wrote. The drive ran detached, so it did not depend on this session.

After each wave the main session read every handback and opened the cited code for every finding before applying it. It then reran the validator, the voice scan, the section model, the link check, both README reference checkers and a new inventory check. That check fails when a file in the folder is missing from the README or a table row names a file that does not exist. A negative control with one row removed and one phantom row added failed on both, so its passes mean something. A `git status` diff against the pre-drive snapshot confirmed each writer touched only its own file.

The first five READMEs were committed early, at the operator's request, as `2fe63bf404a`. A separate operator request replaced "OpenCode component" with "Skilled component" in four README files, committed as `c9d8ff4dfcc`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| A folder with a subfolder names its table KEY FILES, not FILES | The template allows FILES only in place of a directory tree, for a flat folder. Two writers used FILES beside a tree, and the brief gained the rule for the later waves |
| The hooks library README dropped its per-concern adapter table | The coverage matrix carries the same per-runtime coverage, and the OpenCode plugins README names all 11 plugin files, so no fact was lost |
| `### Kill-switch index` kept its exact text | `coverage-rationale.md` and `injection-contract.md` link to `README.md#kill-switch-index` |
| Writers ran at high effort from wave 6 on, reviewers stayed at max | The operator asked for high effort for speed. Wave 6, the first written at high, drew 13 findings against 12 for wave 5 written at max, so quality held |
| cli-pi on llmgateway set up as the fallback route | The operator named it for an OpenCode Go quota hit. No quota hit happened, so every session ran on OpenCode Go |
| A wave-7 finding about reader imports was reversed | The sample review showed every reader but Cursor imports `project.mjs`. The first check missed multi-line imports, so the edit made from it was wrong and is now undone |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

Before numbers come from `baseline-007-before.tsv`, taken before the canary ran. After numbers come from `baseline-007-after.tsv`, taken on the final tree.

| Check | Result |
|-------|--------|
| `baseline.sh` on the 32 files | Before: 31 `✅ VALID` plus the fixtures README, `hard=0` and `emojiH=0` on all 32. After: the same, with 4,943 lines against 2,811 before |
| Fixtures README with `validate_document.py --no-exclude` | `✅ VALID`, `Total issues: 0`, and `hard blockers: 0` from the voice scan |
| Voice ceilings, before then after | Eight rose and none fell: decision-capture bin 95 to 100, goal bin 99 to 100, goal tests 99 to 100, history 99 to 100, session handover tests 95 to 100, session readers 99 to 100, shared 96 to 100 and the hooks library 94 to 98. The other 24 stayed at 100 |
| `h2model.py` against the code-folder section list | `SUBSET` and `nodiv=0` for all 32. Every H1 holds a colon and matches its frontmatter `title` |
| Inventory check | Before: 1 of 32 bad, `shared/tests/README.md` missing `cli-entry.test.mjs`. After: `SUMMARY readmes=32 bad=0` |
| `check_readme_references.py` and `check_derived_readme_counts.py` | Before: references 29 of 32, with 6 unresolved paths in three files. After: `SUMMARY files=32 pass=32 fail=0` for each |
| `readme_links.py . <32 files>` | Before: 140 outbound and 2 inbound anchored links, `0 problems`. After: 182 outbound and 2 inbound, `0 problems` |
| Command blocks | All 56 fenced command blocks are followed by their expected result |
| `runtime-refusal.test.mjs` | `pass 6`, `fail 0` before and after |
| `test_readme_verdict_parity.py` | `PARITY PASS: verdict diff is empty`, 1,246 files |
| sk-doc `run-script-tests.sh` | 58 PASS, `all sk-doc script tests passed`, exit 0 |
| `check-markdown-links.cjs` | `OK — 0 broken markdown links.` |
| Secret scan over the 32 files | 34 hits on token, secret or API key, all prose or identifiers such as `projectToken`. No key-shaped string, no user path and no scratchpad path |
| Scope of the change | `git status` over `.skilled/hooks/` shows 28 modified files, all READMEs: the 32 in scope less the four committed in `2fe63bf404a` and not touched since. No other file under `.skilled/hooks/` changed |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:review-record -->
## Review Record

One line per README. Every reviewer session was separate from the writer of the file it checked, and every finding was confirmed against the code before it was applied.

- **`.skilled/hooks/session-handover/lib/README.md`:** 144 claims. Applied 3, rejected 0. CLI entry calls only four of the listed functions, history writes one line per event not per hop, three modules export no constants.
- **`.skilled/hooks/classifier-injection-screen/lib/README.md`:** 90 claims. Applied 1, rejected 0. The Vibe adapter checks the switch after it reads the payload.
- **`.skilled/hooks/classifier-injection-screen/tests/README.md`:** 52 claims. Applied 1, rejected 0. The adapter's fail-open catch would swallow the notice factory's assert.fail.
- **`.skilled/hooks/cli-dispatch/lib/README.md`:** 86 claims. Applied 2, rejected 0. The vitest command runs from the repository root, the concern README holds no rule list.
- **`.skilled/hooks/cli-dispatch/tests/README.md`:** 84 claims. No findings.
- **`.skilled/hooks/completion-evidence/tests/README.md`:** 61 claims. No findings.
- **`.skilled/hooks/decision-capture/bin/README.md`:** 99 claims. Applied 1, rejected 0. The Claude, Devin and OpenCode sweeps print JSON and exit 1 when they find no session.
- **`.skilled/hooks/decision-capture/lib/README.md`:** 96 claims. No findings.
- **`.skilled/hooks/decision-capture/tests/README.md`:** 74 claims. Applied 1, rejected 0. Cases fire several events and the queue, notice and log checks are spread across cases.
- **`.skilled/hooks/git-message-gate/tests/README.md`:** 75 claims. No findings.
- **`.skilled/hooks/git-preflight/tests/README.md`:** 61 claims. No findings.
- **`.skilled/hooks/goal/bin/README.md`:** 116 claims. Applied 2, rejected 0. An unknown bare token falls through to set, the concern README holds a state directory, not a layout.
- **`.skilled/hooks/goal/lib/README.md`:** 86 claims. Applied 4, rejected 0. Show is refused by the CLI under the switch, the core also imports goal-slice, the slice reads spec.md, whitespace reflow keeps the hash.
- **`.skilled/hooks/goal/tests/README.md`:** 51 claims. Applied 1, rejected 0. Two unit cases build no adapter.
- **`.skilled/hooks/mcp-route-guard/lib/README.md`:** 87 claims. Applied 1, rejected 0. Cursor reaches the core through the Claude adapter.
- **`.skilled/hooks/mcp-route-guard/tests/README.md`:** 64 claims. Applied 2, rejected 0. Harness returns handlers, logs and ctx, the kill-switch case reads no manifest.
- **`.skilled/hooks/overlay-guard/lib/README.md`:** 75 claims. Applied 3, rejected 0. A deny follows any engine refusal, a note only for an unjudged path, Claude is not the shortest adapter.
- **`.skilled/hooks/overlay-guard/tests/README.md`:** 80 claims. Applied 1, rejected 0. The DSH suite stubs evaluateWrite, only the OpenCode plugin calls the real one.
- **`.skilled/hooks/post-edit-quality/lib/README.md`:** 72 claims. Applied 2, rejected 0. The wikilinks exception is the runtime state slot, the truncation marker follows the 2000-character cut.
- **`.skilled/hooks/post-edit-quality/tests/README.md`:** 45 claims. Applied 3, rejected 0. Some router cases build no temp tree, the Codex suite never sends apply_patch.
- **`.skilled/hooks/session-handover/bin/README.md`:** 125 claims. Applied 6, rejected 0. Two local frontmatter fallbacks, prepare's claim command comes from the core, per-runtime arming, claim mints the locator, hop notice off by default, missing values print no syntax.
- **`.skilled/hooks/session-handover/history/README.md`:** 174 claims. Applied 5, rejected 1. Ajv validates typed fixtures, KEY FILES name for a folder with subfolders, index re-exports seven modules, part_too_large is the reply budget, the capability matrix is in session-readers; rejected: a plain document word does get no parts (wording clarified).
- **`.skilled/hooks/session-handover/tests/README.md`:** 88 claims. Applied 4, rejected 0. KEY FILES name, the wrapper is .skilled/bin/skilled-loop, the two env variables come from different shells, the one-file example is the history lookup entry.
- **`.skilled/hooks/session-handover/tests/fixtures/README.md`:** 98 claims. Applied 2, rejected 0. Cost prices the input, output and cache fields, the recorder runs in the hook process.
- **`.skilled/hooks/session-lifecycle/tests/README.md`:** 90 claims. Applied 1, rejected 0. The pin case checks full commands for two guards only.
- **`.skilled/hooks/shared/session-readers/README.md`:** 130 claims. Applied 5, rejected 1. Vibe reads the session folder without a containment check, store-root helpers, routing-accuracy scripts also call the dispatcher, devinTranscriptRoot, the matrix covers seven runtimes; rejected after the sample review: the per-reader import finding was wrong, every reader but Cursor imports project.mjs.
- **`.skilled/hooks/shared/tests/README.md`:** 101 claims. Applied 6, rejected 0. Cursor is in the reader table and gated by its switch, fixtures.mjs not helpers.mjs reads production code, MCP route guard keeps its own fake context, six store builders, fixtures/ added to the tree (the claimed tests README does not exist, so it was not added).
- **`.skilled/hooks/spec-gate/tests/README.md`:** 57 claims. Applied 1, rejected 0. The suite's symlink path differs from the runtime's but resolves to the same file.
- **`.skilled/hooks/subagent-dispatch-guard/lib/README.md`:** 85 claims. Applied 3, rejected 0. Cursor has its own proxy that spawns the Claude adapter, tuning values come from process.env.
- **`.skilled/hooks/subagent-dispatch-guard/tests/README.md`:** 46 claims. Applied 2, rejected 0. The parity case runs in a temp project with no registry, the throw case asserts one log line without reading it.
- **`.skilled/hooks/shared/README.md`:** 148 claims. Applied 3, rejected 0. A few adapters import skill-owned modules, switchAlias export, the shell port honors the legacy master alias.
- **`.skilled/hooks/README.md`:** 300 claims. Applied 12, rejected 0. Four folders host two concern keys, two concerns are default-off, shared editor adapters, overlay settings file, Pi re-exports skill adapters too, Vibe on five link-only hooks, OpenCode runs the hook installer check.
- **Sample review, 31 files (all but the hooks library README):** 160 claims sampled, about 40 of them commands rerun. Applied 7 across 6 files: the `hook-flags.mjs` facade's named exports and its default export, the stdin reader rejecting on a stream error, the session reader imports, packet actions falling back to the current directory, rule severity mapping to `block` or `warn`, the lock reclaim checking only age, and `sweep-dsh.mjs` exporting `recoveredRecords`. Rejected 0.
<!-- /ANCHOR:review-record -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Fact checks sampled each file's claims.** Every claim a reviewer named was checked, but prose can still hold a claim nobody tested. The sample review found 7 errors the per-file reviewers missed, which is a measure of what can remain.
2. **The history package's build commands were not rerun by a reviewer.** `build` writes `dist/`, so reviewers skipped it. The main session ran the typecheck and the vitest suite, 10 files and 148 tests passing, and both match the README.
<!-- /ANCHOR:limitations -->

---
