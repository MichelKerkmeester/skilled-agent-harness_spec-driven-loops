---
title: "Implementation Summary"
description: "The plugins README now states both tested OpenCode versions and matches the code again, and ARCHITECTURE.md explains the dual export and the bridge in depth. Luna passed both files on the 25th review round."
trigger_phrases:
  - "plugins compat docs implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/082-opencode-v1-v2-dual-compat/019-plugins-compat-docs"
    last_updated_at: "2026-10-20T06:00:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Luna PASS on round 25"
    next_safe_action: "Merge main, rerun the checks and push"
    blockers: []
    key_files:
      - ".opencode/plugins/README.md"
      - ".opencode/plugins/ARCHITECTURE.md"
      - "specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/019-plugins-compat-docs/scratch/facts.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-019-plugins-compat-docs"
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
| **Spec Folder** | 019-plugins-compat-docs |
| **Completed** | 2026-10-19 |
| **Level** | 1 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A reader of the plugins README can now see which OpenCode versions the plugins were tested on, and the folder carries an architecture document that explains how one dual export serves both majors. Every claim in both documents traces back to the code.

### Phase 19: plugins-compat-docs

`.opencode/plugins/README.md` states that every plugin runs on OpenCode 1 (`server`, tested 1.19.3) and OpenCode 2 (`setup`, tested 2.0.32), verified 2026-10-19, and it matches the code. The overview names the discovery shape and the fact that neither host calls the other's entry. The inventory table carries every hook each plugin actually registers, and the kill-switch and rejection rules describe what the code does. A link sends the design questions to the new `.opencode/plugins/ARCHITECTURE.md`.

`.opencode/plugins/ARCHITECTURE.md` follows sk-doc's eight-section architecture template. It covers the dual export, the bridge's hook and event mapping, the v1 client adapters, sk-vision's own path, the kill switches, what has no OpenCode 2 equivalent, how to add a plugin, verification and known limits, each claim with a repo source.

The README drifts fixed, in the order the orchestrator scored them. The version statement and the audit's six drifts are the first seven, and the Luna rounds raised the last ten:

1. No tested versions stated.
2. `cli-dispatch-audit.js` `tool.execute.before` dispatch guard missing.
3. `session-cleanup.js` `dispose` missing.
4. sk-vision hooks listed as only 13 tools, when `/vision` is always registered and the rest is gated by `SK_VISION_AUTOINSPECT=1`.
5. Kill-switch claim false for `system-speckit-completion.js` and `sk-vision.js`.
6. One canonical-name exception named where `hook-flags.cjs` has six.
7. Registration test said to cover 11 plugins, when it covers 12.
8. Rejection described as opt-in, when the git message gate and the dispatch guard reject by default.
9. Advisor subprocess described as per-prompt, when it spawns only on a cache miss.
10. Message gate described as allowing what it cannot read, when it refuses when the rules exist but cannot be read.
11. Goal plugin events understated. The message, permission and question events are now listed.
12. Injection-screen buffer described as one advisory, when it holds up to 20.
13. Relaunch seed described as injected once, when it is injected on each request while the note is open.
14. sk-vision described as having behavior coverage in the hard-plugin suite, when its OpenCode 2 behavior is tested in its own `bun test` suite.
15. `node --check` described as resolving imports. It checks syntax only.
16. The syntax loop could exit 0 after a failure. It now propagates the failure exit status.
17. Oxford commas and a semicolon the Human Voice Rules forbid are gone.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/plugins/README.md` | Modified | States both tested versions with the proof date, fixes the 17 drift items above and links `ARCHITECTURE.md` |
| `.opencode/plugins/ARCHITECTURE.md` | Created | The dual-version design in sk-doc's eight-section architecture template, with a repo source per claim |
| This folder's `spec.md`, `plan.md`, `tasks.md` and `implementation-summary.md` | Created | The phase records, filled from the scaffold |
| `../spec.md` and `../graph-metadata.json` | Modified | The phase 19 row in the phase map and the 019 child in the packet's child list |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Every fact was checked against the code by loading each plugin's v1 factory with a stub host (`scratch/list-plugin-hooks.mjs`, output in `scratch/plugin-hook-keys.txt`) and recorded with its source in `scratch/facts.md`. GLM 5.3 Flash through cli-pi wrote every doc edit from short literal briefs, because DeepSeek on llmgateway was down. Luna (GPT-6 Luna through cli-codex, read-only) reviewed each round against those facts. Each brief named what to change and the fact behind it, so no doc sentence rests on memory.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Document the two kill-switch gaps as they are rather than fix code | This phase changes no code. A README that promises a switch the code does not honor is worse than one that names the gap, and a code change belongs in its own phase with its own tests |
| Leave `.opencode/plugins/tests/README.md` unedited and note its missing `session-relaunch` entry instead | The tests README is outside this phase's scope. The parent README now flags the missing row, so a reader is not misled while the owning change fixes it |
| Describe CI from `origin/main`, where the dual-version workflow went green at `793b50ccbf` | This worktree predates the CI fix, so the only green runs live on `origin/main`. `scratch/ci-dual-version-runs.txt` captures the failing runs and the first green one |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `validate_document.py` on `README.md` | VALID, 0 issues (`scratch/verify/validate-README.txt`) |
| `validate_document.py` on `ARCHITECTURE.md` | VALID, 1 warning, the document-type fallback to README rules (`scratch/verify/validate-ARCHITECTURE.txt`) |
| Authored-name check | PASS, the name is exempt (`scratch/verify/kebab.txt`) |
| `test_readme_manifest.py` | Manifest reproducible (`scratch/verify/manifest.txt`) |
| Plugin suite `node --test .opencode/plugins/tests/` | 397 pass, 0 fail (`scratch/verify/plugins.txt`) |
| Luna review | PASS on round 25 with no findings (`scratch/verify/luna-pass.txt`). Rounds 1 to 24 each raised wording or accuracy findings, and every one was fixed before the next round. Round 20 first hit a cli-codex usage limit and ran after it reset |
| Strict validation | 019 strict and 082 recursive, see `tasks.md` T009 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The two kill-switch gaps stand.** `system-speckit-completion.js` ignores the master kill switch, and `sk-vision.js` reads no switch on OpenCode. Both are documented as they are, not fixed.
2. **`.opencode/plugins/tests/README.md` does not list `session-relaunch`.** The README notes the gap instead of editing that file.
3. **Live per-hook delivery on OpenCode 2 is not verified plugin by plugin.** The doctor battery proves all 17 files load on 1.19.3 and show active on 2.0.32, and the stub-context tests prove the mapping, but no live host run exercised every hook.
<!-- /ANCHOR:limitations -->

---
