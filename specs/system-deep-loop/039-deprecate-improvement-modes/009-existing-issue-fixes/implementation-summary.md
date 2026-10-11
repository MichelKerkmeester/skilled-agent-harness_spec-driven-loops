---
title: "Implementation Summary"
description: "Citations whose path holds a plus sign now resolve, the cli-opencode doc matches the Cline fan-out pin, and the agent-mirror-sync CI job builds the parser its checker loads."
trigger_phrases:
  - "existing issue fixes implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/039-deprecate-improvement-modes/009-existing-issue-fixes"
    last_updated_at: "2026-10-10T21:10:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Three existing defects fixed; new plus-sign test proven to fail without the fix"
    next_safe_action: "Watch the first pull request that changes an agent for the CI build step"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-010-existing-issue-fixes"
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
| **Spec Folder** | 009-existing-issue-fixes |
| **Completed** | 2026-10-10 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Three defects that predate this program are fixed. Research citations whose path contains a plus sign, such as `changelog/skilled/v3+/`, no longer raise false SOURCE_TAGS warnings. The cli-opencode provider doc now says the fan-out runner can use the Cline DeepSeek route at `xhigh`. The agent-mirror-sync CI job now builds the shared package its checker needs.

### Phase 9: existing-issue-fixes

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-doc/shared/scripts/classifier-cite-drift-scan.mjs` | Modified | `+` added to the path class and the lookbehind of `CITATION_RE` |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/check-source-tags.vitest.ts` | Modified | New case: `src/a+b/real.ts:3` resolves with no warning |
| `.skilled/skills/cli-external-orchestration/cli-opencode/references/providers-and-models.md` | Modified | Line 77 names the `xhigh` pin and fan-out support |
| `.github/workflows/agent-mirror-sync.yml` | Modified | Node setup and shared-package build before the checker |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

One DeepSeek V4.1 Flash work unit at max effort on DevPass (`scratch/brief-wu1.md`), after snapshot `1731c459c`. The orchestrator checked the four-file diff, then proved the new test catches the defect by running it against the old pattern. Tree after the phase: `b675aec1a`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
| Decision | Why |
|----------|-----|
| Add `+` to the lookbehind too, not only the path class | Without it a match can start right after the `+`, so `a+b/x.ts:3` would still read as `b/x.ts:3` |
| Copy the install and build steps from `deep-loop-runtime.yml` | That workflow already builds `system-spec-kit/shared` the same way |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `check-source-tags.vitest.ts` (cli project) | PASS: 19/19 (baseline 18/18) |
| Same test with the old `CITATION_RE` | FAIL: the new case fails, 1 failed, 18 passed. The test pins the defect |
| `test-cite-drift-scan.mjs` | PASS: 65 pass, 0 fail |
| `agent-mirror-sync.yml` YAML parse | PASS: steps are checkout, Setup Node, build, check |
| Live CI run of the new build step | Not run: needs a pull request that changes an agent |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The CI fix is unproven in CI.** The defect itself was inferred from the workflow and `.gitignore`. The first pull request that changes an agent file confirms both the defect's cause and the fix.
<!-- /ANCHOR:limitations -->

---


