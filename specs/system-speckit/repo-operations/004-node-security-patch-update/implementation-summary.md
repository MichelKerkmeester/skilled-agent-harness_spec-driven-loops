---
title: "Implementation Summary"
description: "Records the completed Node.js security release update, its verification results and the remaining operator-owned nvm cleanup."
trigger_phrases:
  - "node security patch update implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/repo-operations/004-node-security-patch-update"
    last_updated_at: "2026-11-10T11:45:54Z"
    last_updated_by: "generate-context"
    recent_action: "Moved Node pins, CI jobs and declared minimums to the patched releases"
    next_safe_action: "Run the MCP doctor on each machine that hosts Code Mode"
    blockers: []
    key_files:
      - ".skilled/skills/mcp-code-mode/mcp-server/.nvmrc"
      - ".skilled/skills/mcp-code-mode/mcp-server/package.json"
      - "CONTRIBUTING.md"
    session_dedup:
      fingerprint: "sha256:1b1b1c562cf8214750b3267e76035a87cfbd2ba54a0345290c0e63f6bd6b3f4a"
      session_id: "scaffold-004-node-security-patch-update"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "1dd4a9a8-36db-41ed-a4d5-da599d436310"
      workspace: "/Users/michelkerkmeester/worktrees/public/336-subtrack-gap-fixes"
      savedAt: "2026-11-10T11:45:54Z"
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
| **Spec Folder** | 004-node-security-patch-update |
| **Completed** | 2026-11-10 |
| **Level** | 2 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built
<!-- FILL: Open with the user-visible change in two sentences, then list each changed file. GOOD: `--keep 3` leaves three archives in `logs/archive`. A plain run leaves all ten. WEAK: Implemented the feature. -->

Every repository-managed Node.js pin and declared engine floor now starts at the patched releases, and all 37 setup-node steps use Node 22. This removes Node 20, 23 and 25 from declared package support while keeping the Code Mode launcher on a supported Node 24 interpreter.

### Move every Node.js pin, CI job and declared minimum to the patched October 2026 releases

The update responds to the 2026-10-23 security notice. The 2026-11-10 release index confirmed Node 22.23.4 as a security release and listed 24.22.2 and 26.13.0 as the newest releases on their lines. Node 20 had no release after 20.20.2 in March 2026, so it has no patched release.

The package engine ranges now reject Node 20, 23 and 25, along with releases below the patched floors on Node 22, 24 and 26. npm warns rather than fails because no package sets engine-strict. The Code Mode launcher selects an interpreter that satisfies its declared range and cannot start without Node 24.22.1 or newer on the 24 line.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/mcp-code-mode/mcp-server/.nvmrc` | Modified | Pins the Code Mode server to Node 24.22.2 |
| `.github/workflows/` | Modified | Moves 15 setup-node steps from 20 to 22. All 37 steps now name 22. Removes the Node 20 rerun blocks in opencode-plugin-tests.yml and sk-code-script-tests.yml. |
| `.skilled/skills/mcp-code-mode/mcp-server/package.json` | Modified | Raises the Code Mode server floor to >=24.22.1 <25.0.0 |
| `.skilled/skills/sk-design/sk-design-md-generator/backend/package.json` | Modified | Declares the patched supported lines |
| `.skilled/skills/sk-doc/package.json` | Modified | Declares the patched supported lines |
| `.skilled/skills/system-deep-loop/package.json` | Modified | Declares the patched supported lines |
| `.skilled/skills/system-deep-loop/runtime/package.json` | Modified | Declares the patched supported lines |
| `.skilled/skills/system-skill-advisor/runtime/package.json` | Modified | Declares the patched supported lines |
| `.skilled/skills/system-spec-kit/package.json` | Modified | Declares the patched supported lines |
| `.skilled/skills/system-spec-kit/runtime/cli/package.json` | Modified | Declares the patched supported lines |
| `.skilled/skills/system-spec-kit/runtime/package.json` | Modified | Declares the patched supported lines |
| `.skilled/skills/system-spec-kit/shared/package.json` | Modified | Declares the patched supported lines |
| Seven package-lock.json files | Modified | Sync 14 copies of the updated engine ranges |
| `CONTRIBUTING.md` | Modified | Raises the stated Node.js minimum |
| `.skilled/skills/system-spec-kit/README.md` | Modified | Raises the stated Node.js minimum |
| `.skilled/skills/system-spec-kit/shared/README.md` | Modified | Raises the stated Node.js minimum |
| `commands/doctor/scripts/tests/run-all.sh` | Modified | Updates the install hint |
| `commands/doctor/scripts/mcp-doctor.sh` | Modified | Raises the diagnostic floor from 20.11.0 to 22.23.4 |
| `.skilled/bin/mcp-code-mode-launcher.test.cjs` | Modified | Updates the expected engine range constant |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
<!-- FILL: Name the commands that proved it and the order they ran. GOOD: Ran `--keep 3` and a plain run, then the suite. All three passed. WEAK: Tested and shipped. -->

The operator approved nvm installs of 22.23.4, 24.22.2 and 26.13.0, then repointed ~/.local/bin/node to the nvm 26.13.0 binary. The repository changes updated the Code Mode pin, CI, ten package manifests, seven lockfiles, stated minimums, doctor diagnostics and launcher expectation.

The node-engine-resolver and mcp-code-mode-launcher suites reported 21 passed and 1 failed. The single direct-server test failure matched the pre-change result because mcp-server dependencies were not installed in this worktree. The resolver real-host test failed before patched Node 24 was installed, as expected from the raised minimum. The doctor test runner reports the same failing tests with and without this change. Both affected workflow files parsed as YAML. The exact test command invocations were not included in the supplied facts.

mcp-doctor.sh printed [PASS] Node.js v26.13.0 and [PASS] Node engine range satisfied by the nvm 24.22.2 interpreter. The Barter host fallback .nvmrc moved from v26.10.0 to v26.13.0 in its own commit d5f4d628e.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions
<!-- FILL: Write one decision per row. Give the reason, not the label. GOOD: Option over environment variable: one run can pick a different count without editing config. WEAK: Used the best approach. -->

| Decision | Why |
|----------|-----|
| Pin the newest release on each supported line | The operator chose the current 22, 24 and 26 releases so the pin reflects the newest available release on each line. |
| Raise declared minimums as well as pins | The notice called for patched releases, so package declarations now reject older patches and unsupported Node 20, 23 and 25 lines. |
| Remove the two Node 20 rerun blocks | No package declares Node 20 support now, and the main jobs already run the suites on Node 22. |
| Keep the npx bridge scripts and Node 22 workflow comments unchanged | The bridge scripts use a third-party Node 18 floor for npx, and the workflow comments still describe Node 22 behavior. |
| Delete the eight older nvm versions only after showing what they held | The operator saw the global packages under each version first, then chose to delete all eight. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification
<!-- FILL: Write one check per row with the exact output. GOOD: `ls logs/archive | wc -l` after `--keep 3`: 3. After a plain run: 10. Suite: PASSED. WEAK: All tests pass. -->

| Check | Result |
|-------|--------|
| Node.js release index dated 2026-11-10 | Confirmed 22.23.4 as a security release and 24.22.2 and 26.13.0 as the newest releases on their lines. Node 20 had no release after 20.20.2 in March 2026. |
| CI workflow updates | All 37 setup-node steps name 22. Fifteen moved from 20 to 22. The two Node 20 rerun blocks were removed. Both affected workflow files parse as YAML. |
| Package engine declarations and locks | Ten package.json files were updated. Seven package-lock files synced 14 entries. The nine shared ranges and the Code Mode server's 24-only range match the supplied values. |
| node-engine-resolver and mcp-code-mode-launcher tests | 21 passed, 1 failed. The direct-server failure is unchanged from before the update because mcp-server dependencies are absent. |
| Resolver real-host check | Failed before patched Node 24 was installed. This was the expected result after raising the minimum. |
| mcp-doctor.sh | Printed [PASS] Node.js v26.13.0 and [PASS] Node engine range satisfied by the nvm 24.22.2 interpreter. |
| Doctor test runner | Reports the same failing tests with and without this change. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations
<!-- FILL: Name one real limit and the workaround. GOOD: `--keep` deletes the older archives for good. Copy `logs/archive/` aside first when a run may cut too deep. WEAK: No limitations. -->

1. **The eight older nvm versions are uninstalled.** v20.19.5, v22.23.1, v24.9.0, v24.19.0, v25.6.1, v26.5.0, v26.8.2 and v26.10.0 are gone, with the global npm copies of claude-code, copilot, mcp-proxy and a kilocode package that sat under two of them. The separate Node copy at ~/.hermes/node is still v26.8.2 and was left alone.
2. **npm does not enforce the package engine ranges by default.** No package sets engine-strict, so npm warns instead of failing. The Code Mode launcher selects a compliant interpreter and requires Node 24.22.1 or newer on the 24 line.
3. **The direct-server test still fails in this worktree.** It requires mcp-server dependencies that are not installed here. The same single failure was reported before the change.
<!-- /ANCHOR:limitations -->

---


