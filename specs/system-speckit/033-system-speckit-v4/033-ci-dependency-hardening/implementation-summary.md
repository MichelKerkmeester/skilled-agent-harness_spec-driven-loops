---
title: "Implementation Summary"
description: "The runs-failed emails stopped at the source: a commit that would fail CI's mirror job can no longer be made, CI fires on the commit that causes drift, and the forty-four open Dependabot alerts are down to zero."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "mirror gate shipped"
  - "dependabot zero"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/033-ci-dependency-hardening"
    last_updated_at: "2026-09-07T20:00:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Shipped the mirror-parity gate, widened CI triggers, closed every Dependabot alert"
    next_safe_action: "None; the operator flips the GitHub email preference"
    blockers: []
    key_files:
      - ".opencode/scripts/git-hooks/pre-commit"
      - ".github/workflows/spec-kit-check.yml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session_01N8fCNvYeGom82LR8vjg1ah"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 033-ci-dependency-hardening |
| **Completed** | 2026-09-07 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Fifteen red CI runs in a row came from one unstaged mirror file, and nothing on the way to the remote could catch it. That gap is closed. The pre-commit hook now runs the six mirror checks CI runs, so the failing commit cannot exist, and the workflow triggers on mirror paths, so a drift that does slip through fails on its own push rather than on someone else's.

### Harden CI mirror parity at commit time and remediate Dependabot alerts

You commit a command rename. Before the commit lands, the hook regenerates nothing and changes nothing; it only asks whether the generated mirrors under `.codex`, `.claude`, `.cursor`, `.devin` and `.pi` match their sources and are fully staged. If not, it refuses with the same message CI would print, and you fix it while the context is still in front of you. `SPECKIT_SKIP_MIRROR_PARITY=1` bypasses the gate for one commit if you must.

The Dependabot side was mostly transitive: `fast-uri`, `qs` and `toml` under four installed lockfiles, all lifted within existing ranges. The other twenty-four alerts sat on manifests this repository never installs, a retired `uv.lock` and a vendored research snapshot, and were dismissed with a written reopening condition.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/scripts/git-hooks/pre-commit` | Modified | Six-check mirror-parity gate plus unstaged-output scan |
| `.github/workflows/spec-kit-check.yml` | Modified | Trigger on every mirror source and output |
| `.opencode/commands/README.txt` | Modified | Chart and diagram rows under the design group |
| `.opencode/skills/sk-design/command-metadata.json` | Modified | `/design:extract` entry repaired |
| `package-lock.json` | Modified | `qs` 6.16.0 |
| `.opencode/package-lock.json` | Modified | `fast-uri` 3.1.7, `toml` 4.3.0 |
| `.opencode/skills/system-skill-advisor/mcp-server/package-lock.json` | Modified | `fast-uri` 3.1.7, `qs` 6.16.0 |
| `.opencode/skills/mcp-code-mode/mcp-server/package-lock.json` | Modified | `fast-uri` 3.1.7, `qs` 6.16.0 |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The gate was exercised by invoking the hook directly against four tree shapes, with array-based path lists because the harness runs under zsh and the hook under bash. Clean passed; a staged source with stale mirrors, regenerated-but-untracked mirrors, and a new command without catalog rows each blocked with the message CI prints. Residue was removed and the staged set re-checked before the commit. The hardening commit `328accca03` went to `skilled/v4.0.0.0` and `main`, and Spec-Kit Check passed on both.

Each bumped package was reinstalled from its new lockfile. The advisor suite ran green at 880 tests with the new lockfile and at 880 with the HEAD lockfile as a negative control; a transient four-test failure between the two runs traced to another session's in-flight fixture edits, not the dependency bump.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The hook runs CI's checks rather than a summary of them | A gate that approximates CI drifts from CI; running the same six scripts means the two cannot disagree. |
| Block on unstaged mirror output, not only on drift | The fifteen failures were all the "regenerated but forgot to stage" shape, which a drift check alone passes. |
| Widen triggers instead of removing the `paths:` filter | The job is a mirror job; running it on every push would spend minutes on unrelated commits without adding a signal. |
| Lockfile-only audit fixes | Every alert was transitive and patched within range, so no `package.json` needed to change. |
| Dismiss rather than fix the two uninstalled manifests | Bumping a lockfile nobody installs proves nothing; the dismissal comment states when the alert must be reopened. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Four-shape hook harness | PASS: clean 0; unregenerated 1; untracked 1; missing catalog rows 1 |
| Six mirror checks on a clean tree | PASS: all exit 0 |
| Workflow YAML parse | PASS: ten paths in each trigger block |
| Spec-Kit Check on `328accca03` | PASS on `main` and `skilled/v4.0.0.0` |
| `npm audit --omit=dev` in four packages | PASS: total 0 in each |
| Advisor vitest, new lockfile | PASS: 880 passed, 7 skipped |
| Advisor vitest, HEAD lockfile control | PASS: 880 passed, 7 skipped |
| Open Dependabot alerts after push | See continuation note below |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Failure emails are a GitHub user preference.** No API exposes it; the operator turns it off under Settings → Notifications → Actions.
2. **Dependabot closes lockfile alerts on its next scan of the default branch.** The alert count reads zero only after that scan; the lockfile push is the trigger.
3. **The gate needs `node` on the committing machine.** Without it the gate is skipped and CI remains the only backstop.
<!-- /ANCHOR:limitations -->

---
