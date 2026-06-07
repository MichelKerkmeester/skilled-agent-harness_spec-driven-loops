---
title: "Implementation Summary: Import purity and comment-hygiene checker coverage"
description: "The code-index launcher is now side-effect-free on import, and the comment-hygiene checker catches the RC/DR/phase/seat label classes it used to miss, with the daemon-reliability backlog scrubbed."
trigger_phrases:
  - "import purity done"
  - "comment hygiene checker coverage done"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/024-import-purity-and-comment-hygiene-coverage"
    last_updated_at: "2026-06-07T20:05:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Both fixes verified green; packet ready to commit"
    next_safe_action: "Commit and push the packet"
    blockers: []
    key_files:
      - ".opencode/bin/mk-code-index-launcher.cjs"
      - ".opencode/skills/sk-code/scripts/check-comment-hygiene.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-026-007-024-import-purity-and-comment-hygiene-coverage"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 024-import-purity-and-comment-hygiene-coverage |
| **Completed** | 2026-06-07 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The two open follow-ups from the daemon-reliability cross-check are closed. Importing the code-index launcher no longer rewrites your environment or prints to stderr, and the comment-hygiene checker now catches the perishable-label classes that used to slip past it. Two gpt-5.5 agents implemented the fixes in parallel on disjoint files.

### Import-purity for the code-index launcher

Requiring `mk-code-index-launcher.cjs` for its helper exports used to load dotenv files into `process.env`, force the maintainer-mode index flags, and write launcher lines to stderr, because the entrypoint guard sat below those statements. Those side effects now live in `bootstrapLauncherEnv()`, which runs only inside the `require.main === module` block. A new regression test fresh-requires the module and asserts `process.env` is byte-identical across the import and that the bridge and classify exports still resolve. Running the file as the launcher is unchanged, because every env read happens inside functions that run after the bootstrap call.

### Wider comment-hygiene coverage

The checker gained patterns for `RC-N`, single-number `DR-N`, hyphen `phase-NNN`, and council `P#-Seat#`, and it now scans inline trailing comments instead of only full-line comments. A blanket `F\d+` pattern was deliberately left out and documented in the checker, because about ninety comment hits are function keys and figure references rather than finding labels. The daemon-reliability labels the new patterns surface were rewritten to durable intent in the launcher, the supervision library, and the watchdog test. A self-contained test covers the should-flag and should-pass cases including an inline probe and the `hygiene-ok` escape.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/bin/mk-code-index-launcher.cjs` | Modified | Defer env side effects into `bootstrapLauncherEnv()`; scrub one council label |
| `.opencode/skills/system-spec-kit/mcp_server/tests/launcher-code-index-import-purity.vitest.ts` | Created | Require-purity regression test |
| `.opencode/skills/sk-code/scripts/check-comment-hygiene.sh` | Modified | Add RC/DR-single/phase-hyphen/seat patterns and inline-comment scanning |
| `.opencode/skills/sk-code/scripts/check-comment-hygiene.test.sh` | Created | Should-flag and should-pass checker test |
| `.opencode/bin/mk-spec-memory-launcher.cjs` | Modified | Scrub RC and packet-test labels to durable WHY |
| `.opencode/bin/lib/model-server-supervision.cjs` | Modified | Scrub DR and phase labels to durable WHY |
| `.opencode/skills/system-spec-kit/mcp_server/tests/launcher-watchdog.vitest.ts` | Modified | Scrub the finding-label comment to durable WHY |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Two gpt-5.5 high-fast codex agents ran in parallel on disjoint files, each with the Gate 3 spec folder pre-approved and a scope lock. The orchestrator then verified everything independently rather than trusting the self-reports. The launcher refactor was confirmed safe by grepping for module-scope env reads, finding none outside functions that run after the bootstrap call. The checker behavior was confirmed by its self-test plus a positive probe that flags all five classes including an inline comment and a negative probe that clears the allow-list and the `hygiene-ok` escape. The four scrubbed files and the three edited launchers all return clean from the extended checker.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Move env loading into a bootstrap function behind the entrypoint guard | It is the minimal change that makes import side-effect-free while keeping entrypoint behavior identical |
| Exclude a blanket `F\d+` checker pattern | About ninety comment hits are false positives, so a broad pattern would punish legitimate function and figure references |
| Scope the scrub to the daemon-reliability files only | The other repo-wide labels are a larger backlog, and scrubbing them here would expand the packet beyond its purpose |
| Defer wiring the checker into git pre-commit | The unscrubbed repo-wide labels would block concurrent sessions until a full sweep lands |
| Run two gpt-5.5 agents in parallel on disjoint files | The two fixes share no files, so parallel execution is safe and faster |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --check` on the three edited launchers | PASS |
| vitest: import-purity, code-index-proxy, watchdog | PASS, 30/30 |
| `require()` of the code-index launcher prints nothing | PASS |
| Checker self-test | PASS, all cases |
| Should-flag probe (RC-2, inline REQ-3, DR-005, phase-004, P1-Seat2) | PASS, exit 1 |
| Should-pass probe (CWE, RFC, POSIX, V16, RC-no-number, hygiene-ok) | PASS, exit 0 |
| Extended checker on the four scrubbed files plus three launchers | PASS, all clean |
| `validate.sh --strict` on this packet | PASS |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **F-notation stays review-owned.** The checker does not flag `F\d+` finding labels because the false-positive rate is too high. Genuine F labels rely on review.
2. **Repo-wide label backlog remains.** About forty single-number `DR-N` labels and a few others elsewhere in the tree are not scrubbed here. They are a separate follow-on.
3. **No git pre-commit wiring yet.** The extended checker runs through the PostToolUse hook. Wiring it into git pre-commit waits until the repo-wide backlog is scrubbed, so it does not block concurrent sessions.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
