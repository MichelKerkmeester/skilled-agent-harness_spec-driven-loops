---
title: "Implementation Summary"
description: "The eight P2 advisories of the OpenCode v1 removal review are closed: a loopback-pinned battery server, the remove-v1 test in CI, definePlugin, corpus-wide parser parity, retired opencode2 vocabulary and corrected phase 001 evidence."
trigger_phrases:
  - "v2 review p2 fixes implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/004-v2-review-p2-fixes"
    last_updated_at: "2026-11-20T12:13:07Z"
    last_updated_by: "generate-context"
    recent_action: "Closed all eight review advisories with the gate unchanged against its baseline"
    next_safe_action: "Review and merge branch worktrees/482-opencode-v2-p2-fixes into main"
    packet_purpose: "Purpose: Each advisory is fixed or shown already covered, with a command that proves it, and the gate shows no regression against the baseline taken before the first edit."
    blockers: []
    key_files:
      - "specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/004-v2-review-p2-fixes/implementation-summary.md"
      - "specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/004-v2-review-p2-fixes/acceptance-criteria.md"
      - "specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/004-v2-review-p2-fixes/decision-record.md"
      - "specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/004-v2-review-p2-fixes/scratch/gate-after.txt"
      - ".opencode/plugins/lib/v2-bridge.js"
    session_dedup:
      fingerprint: "sha256:9feac44473e3baf4a3b6b80a2d49ed0664de632c25ce6a3237a90ac5d642c886"
      session_id: "scaffold-004-v2-review-p2-fixes"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "df9261d4-6090-4b52-892b-db52ff291ccd"
      workspace: "/Users/michelkerkmeester/MEGA/Development/Skilled"
      savedAt: "2026-11-20T12:13:07Z"
      locatorKind: "transcript_path"
      version: 1
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
<!-- FILL: Fill the folder name, the completion date and the level. Use the real date. GOOD: `004-rotate-logs-keep`. Completed 2026-10-24. Level 1. WEAK: Folder: TBD. -->

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-v2-review-p2-fixes |
| **Completed** | 2026-11-20 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

All eight P2 advisories from the third OpenCode v1 removal review are closed. The battery's private server now listens on loopback only, the one `remove-v1` end-to-end test runs in CI, and the plugin builder is named for the v2-only contract it implements.

### Phase 4: v2-review-p2-fixes

Each advisory got the smallest change that removes it, plus a proof that fails without the change. Tests and live docs no longer present `opencode2` as the v2 launcher. The dispatch guards still match any numbered launcher, because narrowing them would let a renamed binary run unaudited. The unmapped-hook advisory turned out to be covered already: `plugin-inventory.test.cjs` sets up every bridged plugin and compares `skippedKeys` with an empty allowlist in CI. What it lacked was a guard against passing on zero plugins, which a missed rename would cause, and that guard is now added.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/plugins/lib/v2-bridge.js` and the 20 plugin entry files | Modified | `dualPlugin` becomes `definePlugin` |
| `.opencode/plugins/tests/` (`v2-bridge`, `plugin-inventory`, the helper, `README.md`) | Modified | Rename; the hook case fails when no plugin is bridged |
| `.opencode/plugins/ARCHITECTURE.md`, `.opencode/plugins/README.md` | Modified | Name `definePlugin` and the classify test in CI |
| `.skilled/commands/doctor/scripts/git-setup-check.cjs`, its test | Modified | Read the renamed export |
| `.skilled/skills/cli-external-orchestration/cli-opencode/references/agent-delegation.md`, `cli-reference.md`, the sk-code security reference, the spec-kit session-handover playbook | Modified | Rename in docs |
| `.skilled/commands/doctor/scripts/opencode-version-battery.cjs`, its test | Modified | `serve` gets `--hostname 127.0.0.1`, and the fake server records argv so the test asserts it |
| `.github/workflows/opencode-v2-battery.yml`, `.github/workflows/README.md` | Modified | The unit step runs `opencode-setup-classify.test.cjs` |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/opencode-dual-dispatch.vitest.ts` | Modified | Parity over the corpus plus the hand-written outputs |
| `.skilled/skills/cli-external-orchestration/cli-opencode/scripts/tests/opencode-models-form.test.cjs` | Modified | Scan `opencode models` only |
| `.opencode/plugins/tests/system-dist-freshness-guard.test.cjs`, `.skilled/hooks/cli-dispatch/lib/dispatch-audit.test.mjs`, `.skilled/hooks/cli-dispatch/pi/dispatch-preflight-lint.ts` and its test | Modified | Numbered-launcher cases use `opencode9` |
| `../001-v1-runtime-code-and-tests/scratch/event-capture.txt`, `../001-v1-runtime-code-and-tests/tasks.md` | Modified | Header names both parts; CHK-041 command narrowed |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The gate in `scratch/gate.sh` ran before the first edit, with the output in `scratch/gate-baseline.txt`. Each fix was then proved on its own. The two mutation checks in `scratch/unmapped-hook-mutation.txt` showed what the inventory test catches. Removing `--hostname` failed the battery test, and the real `--family=v2` battery leg passed on 2.3.2. The workflow's unit step command ran with no `opencode` or `npm` on PATH. The gate then reran from the final tree into `scratch/gate-after.txt`, and the runtime-mirror checks ran in check-only form.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Retire `opencode2` as a v2 name but keep the `opencode\d*` guard breadth (ADR-001) | Q005 chose renaming, and the breadth is what audits a renamed launcher |
| Keep the models-form scan reading only server-form `opencode models` commands | A bare `opencode models <provider>` appears only in dated OpenCode 1 observations, which keep the command as it ran. Reading them flagged five history lines, not defects |
| `--hostname 127.0.0.1`, not a banner check | `opencode serve --help` on 2.3.2 prints `--hostname`, and the banner check the battery already runs stays as a second guard |
| No `dualPlugin` alias (ADR-002) | Every caller is in the repository and changed in the same commit |
| Add one assertion to the inventory hook case and nothing at plugin setup | The case already caught an unmapped key in CI. A console line at setup would corrupt `opencode run --format json`, and a throw would stop a plugin loading |
| Narrow CHK-041 and say so on the line | The command as first written could never print 0, so the record now states the command that does |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Gate, node leg (43 files) | Baseline 837 tests, 836 pass, 0 fail, 1 skipped. After: the same |
| Gate, dispatch-audit vitest | Baseline 133 of 133. After: 133 of 133 |
| Gate, deep-loop runtime opencode subset (13 files) | Baseline 484 passed, 3 skipped. After: the same |
| Gate, Vibe repo-guards | Baseline 28 of 28. After: 28 of 28 |
| Deep-loop runtime, whole suite | Baseline 195 files, 3716 passed, 11 skipped. After: the same |
| Hooks vitest tree and the Pi preflight lint | 509 of 509 across 10 files, and 259 of 259 for the lint suite alone. After only |
| `git-setup-check.test.cjs` | 87 of 87 |
| Battery test without `--hostname` | 48 of 49, the argv assertion fails |
| Real `--family=v2` battery on 2.3.2 | Four PASS legs, all 20 plugin files active, exit 0 |
| Classify step with no `opencode` or `npm` on PATH | 79 of 79, exit 0, nothing left in HOME |
| Runtime mirrors, check-only | 15 in sync, 1 WARN (Codex hook approval is per checkout path), 0 drift |
| `dualPlugin` outside `specs/` | 0 files |
| Comment hygiene in added code lines | No phase, packet, finding or REQ id |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The gate is a reconstruction.** The prior gate's file lists were never recorded, so `scratch/gate.sh` rebuilds them from the CI workflows. Its node total matches the prior 837, and the deep-loop subset differs from the prior 411-test set. The "Claude source clamps prompts" test that failed before did not fail in this worktree, either at baseline or after.
2. **A bare `opencode models <provider>` in a new doc is not caught.** Before this phase the scan flagged a bare `opencode2 models <provider>`. It now reads only server-form commands, so that coverage narrowed. The workaround is review.
3. **The listener sample cannot name the battery's own socket.** Every `opencode` listener sampled during the live leg was on 127.0.0.1, but other sessions also run servers, so which row was the battery's is inferred, not shown.
4. **The hooks vitest tree, git-setup-check and Pi lint have no pre-edit baseline.** They were run after the change only.
<!-- /ANCHOR:limitations -->
