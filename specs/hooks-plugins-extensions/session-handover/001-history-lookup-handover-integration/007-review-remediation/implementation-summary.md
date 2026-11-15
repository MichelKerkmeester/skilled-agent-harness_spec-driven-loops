---
title: "Implementation Summary"
description: "A claimed note now prints a lookup command only when that command can answer from the sender's own transcript in the receiver's checkout, and the command reads a Claude store moved by CLAUDE_CONFIG_DIR. The twelve P2 advisories from the deep review are fixed in the code or corrected in the docs."
trigger_phrases:
  - "review remediation implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/007-review-remediation"
    last_updated_at: "2026-11-15T18:13:47Z"
    last_updated_by: "generate-context"
    recent_action: "Deep review done: CONDITIONAL, 0 P1, 7 P2 after 10 iterations"
    next_safe_action: "Plan the seven P2 advisories in review/review-report.md"
    packet_purpose: "Purpose: A claimed note prints a lookup command only when that command can answer from the sender's own transcript in the receiver's checkout, and every doc the review named matches the code."
    blockers: []
    key_files:
      - "review/review-report.md"
      - "review/deep-review-findings-registry.json"
      - "review/resource-map.md"
    session_dedup:
      fingerprint: "sha256:c8856119a3247b81c9ef3269d1a64f5bc6d955b818f7c0244f58fe8fdb43fa59"
      session_id: "scaffold-007-review-remediation"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "18bab8d4-e0f3-4389-862e-01b44355af59"
      workspace: "/Users/michelkerkmeester/MEGA/Development/Skilled"
      savedAt: "2026-11-15T15:09:27Z"
      locatorKind: "transcript_path"
      version: 1
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
| **Spec Folder** | 007-review-remediation |
| **Completed** | 2026-11-15 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A claimed note now prints the history lookup only when the command can answer, and the command now finds a Claude transcript wherever Claude Code keeps it. A note that names another project's session, or that comes from another checkout, gets no lookup and leaves no hook state behind.

### Phase 7: review-remediation

The claim compares the receiver's checkout with the note's folder before it mints, so a note from another checkout no longer rewrites the sender's stored locator. The mint then reads the head of the transcript and requires the folder the transcript records to sit in the same checkout, which closes the path where a note pointed the lookup at another project's session by id. The lookup command resolves the Claude store from `CLAUDE_CONFIG_DIR` first, as the mint already did. `prepare` no longer mints a locator the claim would overwrite, and a lookup entry whose compiled core cannot load says `core_unavailable` instead of the bad-arguments code.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-spec-kit/runtime/hooks/lib/history/cli.ts` | Modified | Claude store root from `CLAUDE_CONFIG_DIR`, and `core_unavailable` in the refusal union |
| `.skilled/hooks/session-handover/lib/relaunch-core.cjs` | Modified | Checkout guard before the mint, and the transcript folder check in the mint |
| `.skilled/hooks/session-handover/bin/session-handover.cjs` | Modified | Removed the prepare-time mint |
| `.skilled/hooks/session-handover/bin/history-lookup.mjs` | Modified | `core_unavailable` when the core cannot load |
| `.skilled/hooks/session-handover/tests/session-handover-cli.test.cjs` | Modified | Removed four prepare-locator tests, added a prepare no-locator test, reworked the stale-locator test, added redeem, other-checkout, foreign-transcript and Codex claim tests |
| `.skilled/hooks/session-handover/tests/history-lookup-entry.test.cjs` | Modified | Added the `core_unavailable` test |
| `.skilled/commands/speckit/handoff.md`, `.skilled/changelog/skilled/v4.0.2.1.md` | Modified | The 30-minute locator window |
| `.skilled/hooks/session-handover/README.md`, `.skilled/hooks/session-handover/bin/README.md`, `.skilled/hooks/injection-contract.md`, `.skilled/skills/system-spec-kit/runtime/hooks/lib/history/README.md` | Modified | Claim-only mint, the new refusal code and the transcript check |
| `.skilled/skills/system-spec-kit/feature-catalog/` entry, index and two link labels, the playbook page and its index row | Modified | Renamed to "Handoff history lookup" in titles and triggers, file names kept |
| `../spec.md`, `../004-offer-lookup-at-claim/`, `../005-deprecate-compaction-offer/`, `../006-docs-and-live-hop-proof/` | Modified | The packet doc drift the review named |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Origin/main fast-forwarded the worktree branch to `abf02ba1e6c` first. The post-merge baseline was then 999 handover tests and 149 history and compaction vitests, all passing. Each code test ran on the unfixed code first: the prepare no-locator, redeem, other-checkout and foreign-transcript tests failed there, the foreign-transcript and Codex tests also failed with the checkout comparison or the `session_meta` branch disabled, and the redeem test failed with `store_unreadable` because the command looked under `HOME/.claude`. The old entry printed `operation_invalid` with no core, as `spec.md` records. After the fixes the runtime was rebuilt and both suites rerun.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Drop the prepare-time mint rather than reuse it at claim | The operator chose it. The claim mints a fresh locator anyway, because the lookup refuses one older than 30 minutes. |
| Read 256 KiB of the transcript head for its folder | The first Codex `session_meta` line measured at most 19,040 bytes over 200 rollouts, and a Claude transcript's first `cwd` line sat within 5,466 bytes over 300 transcripts |
| Apply the folder check to Codex too | All 200 rollouts measured open with a `session_meta` line that carries `payload.cwd`. A Codex claim test covers it |
| One end-to-end redeem test instead of a separate store-root vitest | It runs the real entry and compiled core under `CLAUDE_CONFIG_DIR`, so it catches the store root and the redeem path together |
| Rescaffold phase 7 at Level 1 | All six sibling phases are Level 1 |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --test .skilled/hooks/session-handover/tests/*.test.cjs` | 1001 tests, 1001 pass, 0 fail. Baseline 999: minus 4 removed prepare-locator tests, plus 6 added |
| `npx vitest run tests/history-*.vitest.ts tests/compaction-adapters.vitest.ts` | 10 files, 149 passed, unchanged from the baseline |
| `npx tsc --noEmit -p .` in the runtime | Exit 0 |
| `quality-gate.cjs --files` on the six changed code files | `gate=NO_BLOCKER_FOUND`, findings 0 |
| `validate_document.py` on the six edited docs | 0 issues each |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A session that moved checkouts after it started gets no lookup.** The transcript records the folder the session started in, so a session that later worked from another checkout fails the folder check. The note still prints in full, only without the lookup section.
2. **The Claude reader's own default store root still ignores `CLAUDE_CONFIG_DIR`.** The lookup command passes the root it resolved, so the claim path is not affected. Any other caller of `claudeStoreRoot` without a `claudeRoot` option still reads `~/.claude`.
<!-- /ANCHOR:limitations -->

---
