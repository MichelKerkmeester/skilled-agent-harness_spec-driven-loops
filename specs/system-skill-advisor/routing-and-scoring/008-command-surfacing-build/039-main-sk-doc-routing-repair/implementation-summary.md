---
title: "Implementation Summary"
description: "Open with a hook: what changed and why it matters. One paragraph, impact first."
trigger_phrases:
  - "main sk doc routing repair implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/008-command-surfacing-build/039-main-sk-doc-routing-repair"
    last_updated_at: "2026-11-16T19:23:36Z"
    last_updated_by: "generate-context"
    recent_action: "Merged main twice; review pass twelve started"
    next_safe_action: "Run the full alignment after review pass twelve"
    packet_purpose: "Purpose: README requests keep reaching sk-doc, the prompts that routed before main's change route as they did, and the compiled graph matches its sources."
    blockers: []
    key_files:
      - "specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/039-main-sk-doc-routing-repair/implementation-summary.md"
      - ".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts"
    session_dedup:
      fingerprint: "sha256:a6f1c021f572bd79405617ac42236a4652a254070e997543f5e2081cc19b00ba"
      session_id: "scaffold-039-main-sk-doc-routing-repair"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "77af2d6d-58e8-4180-b6da-697f12833f71"
      workspace: "/Users/michelkerkmeester/worktrees/public/352-command-surfacing-research"
      savedAt: "2026-11-16T19:23:36Z"
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
| **Spec Folder** | 039-main-sk-doc-routing-repair |
| **Completed** | 2026-11-16 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Bare git prompts, the runtime mirror doctor and two scorer gates route as they did before the merge again. The sk-doc README intents main added had given sk-doc words that other skills own. Those phrases are now narrower, and README requests still reach sk-doc.

### Phase 39: main-sk-doc-routing-repair

You can ask for "git hooks", "git rules" or "git standards" and reach sk-git again, and "runtime mirror drift" reaches `/doctor:runtime-mirrors`. A request for a named hook's README, a runtime or plugins folder README or a `SECURITY.md` still lands on sk-doc, though a dropped hook name loads the generic README template. The compiled skill graph matches its sources again, so the strict freshness check passes.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-doc/ROUTER.md` | Modified | The `HOOK_README` intent drops the `git-*` and `spec-gate` named phrases, `RUNTIME_PLUGIN_README` drops "hook mirror readme", `SECURITY_POLICY` keeps "security.md" only, and the prose says why |
| `.skilled/skills/sk-doc/graph-metadata.json` | Modified | Intent signals regenerated from the router |
| `.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json` | Modified | Recompiled graph |
| `scratch/try-variant.py`, `scratch/try-variant.sh` | Created | Measure one keyword variant against the failing tests |
| `runtime/lib/command-attach.ts` and its guards test | Modified | A single quote that opens or closes a command name is dropped before the lead reading, and a retired name reads beside its replacement, from review passes ten and eleven. One test pins that every mention fixture reads the same wrapped or retired as plain |
| Doctor install presentation, workflow and contract test | Modified | Name the eight manifest runtimes and drop the stale DSH sentence, from review pass ten |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each candidate change was applied to a clean router, regenerated and measured against the five failing test files by `scratch/try-variant.sh`. Main's new intents were removed one at a time to find which moved the holdout count and the ratchet row, so no holdout row was read. The chosen variant then ran the full gate both ways, and the README probes went through the advisor CLI.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Narrow main's phrases rather than retune the scorer or re-capture a baseline | The regression came from the data main added, so the fix belongs there and every gate keeps its meaning |
| Keep only "security.md" for the security policy intent | Every tried phrase with "security policy" in it dropped the holdout back to 48 |
| Keep the generic hook README phrases and the other named hooks | The README probes show named hook requests still reach sk-doc without the dropped names |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| The seven inherited tests | PASS, 69 of 69 in the five files |
| Full suite, flag unset and `AI_SESSION_CHILD=1` | PASS, 2353 passed 0 failed both ways (`scratch/after-pass-ten.txt`). An earlier unset run under review load failed only the 60 ms native scorer latency gate, which passes 21 of 21 alone |
| Doctor script tests | PASS, 1266 passed 0 failed |
| `FLOOR` and `EVAL` | PASS, 24/44, 0/35, 2/44 and [160,49,21,5] |
| Intent signals and graph freshness | PASS, `--check` RESULT: PASSED and `--strict` exit 0 |
| README probes | PASS, `scratch/readme-probes.txt` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A plain "security policy" request no longer loads the security policy template.** It has to name `SECURITY.md`. A future phrase needs to clear the holdout gate first.
2. **A README request for a `git-*` or `spec-gate` hook or for a hook mirror folder loads the generic README template.** sk-doc still owns the request, but the hook and runtime plugin templates no longer load for those names. Asking for "a README for this hook" still loads the hook template.
3. **A command wrapped in square brackets, `~~`, `<code>`, guillemets or primes still reads as offered after a refusal or question.** The mention check drops backticks, straight and curly quotes and bold, the wrappers chat produces most, and the invariance test pins those. Review pass twelve's F001 is kept as this limit by the operator's capped close (Q085).
4. **This edits files main's README-template work owns.** The next merge from main may conflict in `sk-doc/ROUTER.md`, and the merge has to keep these narrowings.
<!-- /ANCHOR:limitations -->

---


