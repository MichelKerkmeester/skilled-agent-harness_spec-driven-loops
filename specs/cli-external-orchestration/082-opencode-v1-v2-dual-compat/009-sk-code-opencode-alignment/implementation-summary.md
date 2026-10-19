---
title: "Implementation Summary"
description: "A findings-first review of the 75 code files the build changed found five P1 defects, among them a dispatch guard that never refused anything and a v2 /vision command that never ran; all five are fixed, and every gate and suite passes at or above its baseline."
trigger_phrases:
  - "sk code opencode alignment implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/082-opencode-v1-v2-dual-compat/009-sk-code-opencode-alignment"
    last_updated_at: "2026-10-19T02:30:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Closed the review, the fixes and the gates"
    next_safe_action: "Phase complete. Start phase 010, the documentation sweep"
    blockers: []
    key_files:
      - "specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/009-sk-code-opencode-alignment/findings.md"
      - ".opencode/plugins/cli-dispatch-audit.js"
      - ".skilled/skills/sk-vision/vision-runtime/src/plugin.ts"
      - ".skilled/skills/system-deep-loop/runtime/scripts/render-command-contract.cjs"
      - ".skilled/commands/doctor/scripts/opencode-version-battery.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-009-sk-code-opencode-alignment"
      parent_session_id: null
    completion_pct: 100
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
| **Spec Folder** | 009-sk-code-opencode-alignment |
| **Completed** | 2026-10-19 |
| **Level** | 2 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The review found two features that looked finished and did nothing. Both now work on OpenCode 1 and 2.

### Phase 9: sk-code-opencode-alignment

The dispatch guard plugin read the command from the hook's first argument. OpenCode passes it on the second, so the guard has never refused a dispatch on either version. It now reads the right argument, and its tests call it the way OpenCode does (F-01).

On OpenCode 2, the repo's own `vision.md` command shadows the command sk-vision registers. The model got a template that promised image evidence, and no evidence ever arrived. sk-vision now fills that template from OpenCode 2's prompt hook, the same way OpenCode 1's `command.execute.before` does. An image attached to the `/vision` message itself is now found too (F-04, F-05).

Three smaller defects are also fixed. The deep-loop renderer wrote its manifest into a folder phase 004 had emptied, recreating it (F-02). The doctor battery and git-setup-check took a following flag as a value, so `--out --json` wrote a file named `--json` (F-03). The freshness guard missed `opencode2 run` (F-18). Sixteen P2 findings are deferred, each with its reason in `findings.md`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/plugins/cli-dispatch-audit.js` | Modified | Read the before-hook args from the output (F-01) |
| `.opencode/plugins/tests/source-root-consumers.test.cjs` | Modified | Real hook shape and a five-row guard table |
| `.opencode/plugins/system-dist-freshness-guard.js` and its test | Modified | Match `opencode2 run` (F-18) |
| `.skilled/skills/sk-vision/vision-runtime/src/plugin.ts` | Modified | v2 prompt hook, prompt files in the image scan (F-04, F-05, F-24, F-25) |
| `.skilled/skills/sk-vision/vision-runtime/src/plugin.test.ts` | Modified | 17 new tests for the match, the template read and the hook |
| `.skilled/commands/doctor/scripts/opencode-version-battery.cjs` and `git-setup-check.cjs` | Modified | Refuse a flag as a spaced value (F-03) |
| The two doctor test files | Modified | Flag-value tables and the parser's adversarial cases (F-26) |
| `.skilled/hooks/dispatch/lib/dispatch-audit.test.mjs` | Modified | The parser's adversarial cases (F-26) |
| `.skilled/skills/system-deep-loop/runtime/scripts/render-command-contract.cjs` and its test | Modified | Manifest path in the moved folder (F-02) |
| `.skilled/skills/system-deep-loop/runtime/lib/legacy-projections/legacy-projection-manifest.ts` | Modified | The same path (amendment) |
| `.gitignore` | Modified | Ignore the manifest at its new path (amendment) |
| `specs/system-deep-loop/036-deep-loop-innovation/001-research-inputs-and-architecture/003-baseline-taxonomy-and-state-census/state-backend-census.json` | Modified | The census row a projection test compares with the manifest (amendment) |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Four findings-first reviews covered all 75 changed code files. DeepSeek reviewed the code Luna wrote in phases 002 to 006, and Luna reviewed the code DeepSeek wrote in 007 and 008 (decision 0). The orchestrator read every cited line before writing a row. It raised the dispatch-guard bug from P2 to P1, refuted one reviewer's claim that `opencode2` was broken on this machine, and kept one P2 fix because it is a single regex in the packet's own v2 scope (decision 4).

The two sk-vision P1s rested on a premise no one had checked. A private v2 server and a throwaway fixture settled it: a Markdown command beats a plugin command of the same name, and the prompt hook sees the expanded template with a mutable text and file list (decision 6). That evidence set the fix.

DeepSeek wrote six fix batches, one after another, and the orchestrator reran each gate itself before closing a row. Batch 3 stopped correctly at its file list when a census row in another packet broke a test, and the orchestrator changed that row as a recorded amendment (decision 7). Luna's fix review reopened F-05 on the no-template path; batch 5 closed it, and Luna's verify passed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| F-01 raised to P1 (decision 4) | The guard is the plugin's only purpose, and it never ran on either version |
| v2 `/vision` fills the template from the prompt hook (decision 6) | The v2 command API has only `add`, so a plugin cannot override a Markdown command |
| The match is exact, built from `vision.md` (decision 6) | v2 replaces every `$ARGUMENTS` in the trimmed body, so a prefix, backreference and suffix match is exact |
| Three files joined by amendment (decisions 5 and 7) | Each held a stale copy of the path F-02 fixes |
| AC-002 covers the files the checker reads (decision 11) | The checker skips TOML and YAML, so those four files are hand-checked |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `bash .skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh` | Exit 0, `all 4 guards PASSED, 10 non-blocking warning(s)`, on two consecutive runs (`scratch/gates/drift-after.txt:44`) |
| `.skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh <file>` on each changed code file | 73 exit 0; the four TOML and YAML files exit 2 (skipped) and are hand-checked (`scratch/gates/hygiene-after.txt`) |
| `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <this folder> --strict` | `RESULT: PASSED`, 0 errors and 0 warnings, after `repair-derived.cjs --apply` |
| Touched suites against their baselines (`scratch/suites-after/`) | Plugin 355 (303), guard node 29 (21), guard vitest 106 (86), shared hooks 57 (57), classifier 90 (78), config shape 2 (2), gate-3 17 (17), doctor 383 (380), sk-vision 46 (29), deep-loop 2742 (2718); all exit 0 |
| Stripped environment (`scratch/gates/hostile-env.txt`) | Every changed test file exits 0 under `env -i` |
| Battery, both families (`scratch/gates/battery-both.json`) | Six legs PASS: 16 of 16 plugins loaded on v1 and active on v2, 57 skills visible; process list unchanged |
| Live v2 `/vision` (`scratch/probes/v2-vision-live.txt`) | The stored prompt is the template with the question in both slots, followed by the plugin's text |
| Live manifest render (`scratch/gates/render-manifest-live.txt`) | One row at the new path, ignored by `.gitignore:196`, old folder not recreated |
| Reviews | Four reviews, Luna's fix review FAIL, then Luna's verify PASS (`scratch/review-fix-verify-luna.txt`) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The dispatch-guard fix has no live OpenCode run behind it.** The v1 hook contract (`dist/index.d.ts:235-241`) and the bridge (`v2-bridge.js:330`) both put args on the output, and the tests use that shape, but no model-driven bash call has hit the guard yet. Phase 011's smoke runs can show it.
2. **The live `/vision` check covered only the no-image answer.** With an image the handler starts the local vision runtime, which this phase did not run. The unit tests show the image reaches the scan as the last message.
3. **An unapproved model call ran.** The live `/vision` check cost one llmgateway turn, USD 0.0037, because the private server's config was not isolated. The fixture probes may have run four more small turns. Their records are gone, so that part is inferred (decision 9).
4. **Sixteen P2 findings are deferred.** Each has its reason in `findings.md`. Two are worth an owner's look: the v2 event pump stops at the first throw (F-06), and a broken `opencode2` refuses a dispatch with no fallback (F-14).
5. **One doc line still names the old manifest path.** `command-support/deep/assets/compiled/README.md:112` goes to phase 010.
<!-- /ANCHOR:limitations -->

---
