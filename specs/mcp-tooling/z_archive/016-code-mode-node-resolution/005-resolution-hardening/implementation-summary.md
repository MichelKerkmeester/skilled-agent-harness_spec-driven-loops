---
title: "Implementation Summary"
description: "The search path now yields interpreters on a real host, the file every host launches is checked to exist, and the packet's completion records match what was executed."
trigger_phrases:
  - "resolution hardening summary"
  - "resolver version ladder shipped"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/016-code-mode-node-resolution/005-resolution-hardening"
    last_updated_at: "2026-08-29T10:18:53Z"
    last_updated_by: "session"
    recent_action: "Closed the review findings and reconciled the packet records"
    next_safe_action: "None; the packet is complete"
    blockers: []
    key_files:
      - ".opencode/bin/lib/node-engine-resolver.cjs"
      - ".opencode/bin/lib/node-engine-resolver.test.cjs"
      - ".opencode/skills/mcp-code-mode/scripts/install.sh"
      - ".opencode/commands/doctor/scripts/mcp-doctor.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Phase** | 5 of 5 |
| **Status** | Complete |
| **Completed** | 2026-08-29 |
| **Branch** | `skilled/v4.0.0.0` |
| **Executor** | Orchestrator, with the defect reproduced before the fix and the fix re-broken afterwards to prove the tests catch it |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A version ladder, two existence checks, and a set of records that no longer claim more than was run.

Enumeration now recognises a real interpreter. The search-path branch required each entry named `node` to pass a directory test, which every actual binary fails when the listing carries file types, so the branch answered for fixtures and for nothing else. It now accepts anything that is not a directory, and reads a version from the first source that has one: the candidate's own path, then the path it links to, then the interpreter itself. The last rung executes, so it is bounded - a fixed argument list, no shell, ignored input, a two-second timeout, deduplication by real path, and a cap of sixteen interpreters per enumeration.

The installer stops accepting any host above a fixed floor. It asks the resolver whether this host can satisfy the range the server declares, and refuses when it cannot. Both the installer and the diagnosis now check that the launcher file exists, because it is the command every host config names and it lives outside the skill tree that installs it. Both sweepers classify the launcher alongside the two sibling launchers they already knew.

### Files Changed

| File | Change |
|------|--------|
| `.opencode/bin/lib/node-engine-resolver.cjs` | Real directory entries accepted; version ladder with a bounded probe |
| `.opencode/bin/lib/node-engine-resolver.test.cjs` | Search-path coverage rebuilt on a real temporary tree; the machine-specific assertion replaced by a property of the answer |
| `.opencode/skills/mcp-code-mode/scripts/install.sh` | Prerequisites gate on the declared range; verification asserts the launcher |
| `.opencode/commands/doctor/scripts/mcp-doctor.sh` | `diagnose_code_mode()` reports a missing launcher |
| `.opencode/scripts/session-cleanup.sh` | The launcher joins the target commands |
| `.opencode/scripts/orphan-mcp-sweeper.sh` | The launcher gets its own class |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Reproduction first. A real interpreter was planted on a search path and enumerated through the default host access, which returned one candidate where a fixture-shaped call returned two. That gap is the whole defect, and having it on record meant the fix could be proved rather than argued.

The gate was measured before any edit for the same reason. Fifteen failures were already present, all in one suite, and attributing them to a commit outside this packet before touching anything is what makes the closing comparison meaningful.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- **Ask the interpreter, but only last.** Reading a version from a path costs a directory read and answers for every version manager. It answers for nothing else, which is why an installer-placed interpreter was invisible. Executing a candidate is the only way to close that gap without guessing, and it widens nothing: the resolver only probes a candidate it could itself select and hand to the launcher, so every binary that can be probed is one that could already have been executed.
- **Keep the selection contract untouched.** The range parsing, the highest-satisfying rule and the null-on-failure behavior are unchanged. Only the supply of candidates grew, so reverting this phase narrows the supply without altering how a candidate is chosen.
- **Test against a real filesystem.** The defect was invisible to injected fixtures by construction, so the new coverage reads a real temporary tree through the default host access. Reintroducing the inverted test fails five of the fourteen tests, which is the property that matters.
- **Record the unrelated failures rather than repair them.** The fifteen failing tests belong to the sk-code hub registry and to a commit outside this packet. Fixing them here would have edited files that another change is actively rewriting, and would have hidden which failures this phase is answerable for.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Reproduction before the fix | The planted interpreter yielded 1 candidate through real directory entries, 2 through string entries |
| Positive control after the fix | The same planted interpreter is returned with source `PATH` |
| Version ladder, all three rungs | `PATH` 24.11.0 from the path, `PATH-link` 24.12.0 from the link target, `PATH-probe` 24.13.0 from the interpreter |
| Defect reintroduced | 5 of 14 fail, including the directory-named-node case; restored, 14 pass 0 fail |
| `node --test` on the resolver suite | 14 pass, 0 fail |
| `node --test` on the launcher suite | 4 pass, 0 fail |
| Workspace node gate | 75 files, 753 pass, 15 fail against a 747 pass, 15 fail baseline: the 6 added tests, no new failure |
| `bash -n` on all four scripts | Clean |
| Installer on a host that cannot satisfy the range | Prerequisites fail with `No Node.js interpreter satisfies >=24.0.0 <25.0.0 (unsatisfied)` |
| Installer on a host that can | Emits `["node", ".opencode/bin/mcp-code-mode-launcher.cjs"]`, no absolute interpreter path |
| Launcher existence, installer | `Launcher verified at:` present, `Launcher not found:` absent |
| Launcher existence, diagnosis | `[PASS] launcher present`, `[FAIL] launcher missing` |
| Sweeper classification | `mcp-code-mode-launcher` for the launcher, `mcp-code-mode` still returned for the server |
| Live launcher handshake | `serverInfo {"name":"CodeMode-MCP","version":"1.0.0"}` |
| Suites on a checkout without the installed server | The manifest-dependent cases skip with a stated reason; where the server is installed all 18 still run, 0 skipped |
| Operator's live servers | Four long-running code_mode processes unchanged throughout |
| Comment hygiene | No spec paths or artifact ids in any changed file |

The fifteen gate failures are all subtests of the compiled-route manifest suite, asserting `SYNC FAILED: authored closure failed to resolve hubs: sk-code`. That suite reads the sk-code hub registry, which a commit outside this packet rewrites and which nothing here touches.

Worth reading twice: the installer's refusal was produced by accident. A scratch home was used so the script's unconditional npx cache clearing could not reach the operator's, and that same isolation hid the only satisfying interpreter on the machine - so the new gate fired for real, on a host that genuinely could not satisfy the range, before it was ever asked to.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- The probe reports what an interpreter says about itself. A binary named `node` that answers `-v` with a version string is believed, so the ladder's last rung trusts the same thing the launch would.
- The version read from a candidate's own path is trusted over the interpreter's own answer, because it is cheaper and correct for every version manager. A directory deliberately named for a version it does not contain would be believed.
- The installer reports completion even when its verification step fails, printing a warning and exiting zero. That behavior predates this phase and is unchanged here, so a missing launcher is reported but does not fail the install.
- The declared range lives in a file git does not track: `.opencode/.gitignore` ignores `package.json`, so the server manifest exists only where the server has been installed. Every surface fails closed without it - the resolver reports a missing manifest, the launcher refuses, and the diagnosis and installer both report the gap - and the manifest arrives with the server install the installer already verifies. The packet's suites now skip rather than fail on such a checkout, but the source of truth remaining untracked is a property of the vendoring, not something this phase changed.
- The probe cap bounds one enumeration, not one process. A caller that resolves repeatedly pays the cap each time, since the budget is created per enumeration rather than cached across calls.
<!-- /ANCHOR:limitations -->

---
