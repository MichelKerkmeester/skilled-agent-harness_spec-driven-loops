---
title: "Implementation Summary: Phase 071 verifier remediation"
description: "Actionable Phase 071 verifier findings were remediated; global gates still expose generated and pre-existing residuals outside the actionable scope."
trigger_phrases:
  - "phase 071 remediation summary"
  - "verifier remediation complete"
  - "gate residuals"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/058-stack-agnostic-cleanup/001-remediation"
    last_updated_at: "2026-05-05T20:06:30Z"
    last_updated_by: "cli-codex"
    recent_action: "Applied verifier remediation"
    next_safe_action: "Review residual global gate failures"
    blockers:
      - "Gate 1 still matches package-lock checksum text and documented compiled skill graph aggregation"
      - "Gate 2 still matches generated advisor shadow-deltas data"
      - "Gate 3 still matches pre-existing non-cli-opencode hardcoded paths outside the allowed remediation set"
      - "Gate 7 still reports a pre-existing sk-code diff outside this remediation"
    key_files:
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/settings.py"
      - ".opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/explicit.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/lexical.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py"
      - ".opencode/skills/mcp-code-mode/references/workflows.md"
      - ".opencode/skills/cli-opencode/README.md"
      - ".opencode/skills/cli-opencode/references/opencode_tools.md"
    session_dedup:
      fingerprint: "sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
      session_id: "phase-071-001-remediation"
      parent_session_id: null
    completion_pct: 90
    open_questions:
      - "Should a separate cleanup packet remove generated shadow-deltas, package-lock checksum false positives, and older hardcoded path examples outside cli-opencode?"
    answered_questions:
      - "V-008 is documented as out of 071 scope in ADR-002."
      - "V-009 is documented as expected sk-code-derived compiled graph aggregation in ADR-003."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Phase 071 Verifier Remediation

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `skilled-agent-orchestration/z_archive/058-stack-agnostic-cleanup/001-remediation` |
| **Completed** | 2026-05-05 |
| **Level** | 2 |
| **Status** | Remediation applied, global gates have residual failures |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The actionable Phase 071 verifier findings are fixed in the targeted files. The remediation removes named library defaults from executable CocoIndex settings, strips stack-specific advisor scoring cues outside sk-code, neutralizes tracked real-client scan artifacts, replaces hardcoded cli-opencode local paths, aligns the MyService tool example, and removes stale mcp-chrome-devtools links.

### P0 and P1 Fixes

V-001 now uses a generic skill asset subtree in `settings.py`. V-002 now uses surface-agnostic advisor cues in TypeScript source, Python scorer logic, and ignored dist JS mirrors. V-003 and V-004 no longer expose the real-client name in the targeted artifacts and workflow docs. V-005 removes cli-opencode local workspace paths across the cli-opencode docs. V-006 now uses `myservice.myservice_sites_list()` consistently.

### P2 Handling

V-007 is fixed by removing stale sk-code reference links from the agnostic Chrome DevTools examples. V-008 and V-009 are documented in `decision-record.md`: parent metadata repair is separate scope, and compiled `skill-graph.json` may carry sk-code-derived metadata.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/settings.py` | Modified | Remove named library canonical path default |
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/explicit.ts` | Modified | Remove stack/library explicit boosts and taxonomy comments |
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/lexical.ts` | Modified | Remove stack-specific lexical hint |
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py` | Modified | Remove stack-specific legacy scorer cues |
| `.opencode/skills/system-spec-kit/mcp_server/dist/skill_advisor/lib/scorer/lanes/*.js` | Modified | Mirror advisor lane changes in ignored dist files |
| `.opencode/skills/system-spec-kit/scripts/.folder-list.txt` | Modified | Neutralize tracked scan artifact paths |
| `.opencode/skills/system-spec-kit/scripts/.scan-lines.txt` | Modified | Neutralize tracked scan artifact paths |
| `.opencode/skills/mcp-code-mode/references/workflows.md` | Modified | Replace real-client expected log text |
| `.opencode/skills/mcp-code-mode/manual_testing_playbook/06--third-party-via-cm/002-myservice-list-sites.md` | Modified | Align MyService tool naming |
| `.opencode/skills/mcp-chrome-devtools/examples/README.md` | Modified | Remove dead sk-code links |
| `.opencode/skills/cli-opencode/*` | Modified | Replace hardcoded local path examples with placeholders |
| `.opencode/skills/system-spec-kit/*tests*` | Modified | Neutralize old sample terms in test source and repair the touched JS test runner |
| `specs/skilled-agent-orchestration/z_archive/058-stack-agnostic-cleanup/001-remediation/*` | Created | Add child remediation packet |
| `specs/skilled-agent-orchestration/z_archive/058-stack-agnostic-cleanup/graph-metadata.json` | Modified | Register `001-remediation` child |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The changes were delivered as narrow text and scorer-rule edits after reading the verifier report and target files. I preserved unrelated worktree changes, kept sk-code source untouched, and ran targeted tests for the Python settings change, advisor scorer behavior, and modified system-spec-kit tests.

### Before and After Grep Counts

| Check | Before | After | Notes |
|-------|--------|-------|-------|
| V-001 `motion_dev|motion.dev` in `settings.py` | 1 | 0 | Target file clean |
| V-002 advisor source/dist stack-library cues | 13 | 0 | Targeted source/dist mirror search clean |
| V-003/V-004 `nobel|a[ ._-]*nobel` in targeted artifacts/docs | 29 | 0 | Target files clean |
| V-005 `/Users/...` in cli-opencode docs | 16 | 0 | cli-opencode clean |
| V-006 old MyService call name | 4 | 0 | New `myservice_sites_list` appears 4 times |
| V-007 stale `sk-code/references/*` links | 5 | 0 | Example README clean |
| Gate 1 broad grep file hits | 11 | 2 | Residuals: `package-lock.json` checksum text, V-009 compiled graph |
| Gate 2 surface-tag file hits | 1 | 1 | Residual: generated `shadow-deltas.jsonl` telemetry |
| Gate 3 hardcoded path file hits | 56 | 50 | cli-opencode removed; remaining hits are outside this remediation scope |
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Neutralize scan artifacts in place | The files are tracked and already had unrelated edits; replacing the real-client slug is the narrowest safe V-003 fix |
| Keep V-008 out of scope | The user explicitly said parent metadata repair was pre-existing and should be a separate packet |
| Keep V-009 as documented aggregation | The compiled graph carries sk-code metadata, and sk-code is the approved owner of stack-specific terms |
| Extend V-005 inside cli-opencode | Same-skill local path examples would keep the cli-opencode docs inconsistent if only two anchored lines changed |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `PYTHONPYCACHEPREFIX=/tmp/codex-pyc python3 -m py_compile ...settings.py ...skill_advisor.py` | PASS |
| `.opencode/skills/mcp-coco-index/mcp_server/.venv/bin/python -m pytest .opencode/skills/mcp-coco-index/tests/test_settings.py` | PASS, 20 passed |
| `npx vitest run skill_advisor/tests/scorer/native-scorer.vitest.ts` | PASS, 21 passed |
| `scripts/node_modules/.bin/vitest run scripts/tests/generate-context-cli-authority.vitest.ts scripts/tests/session-enrichment.vitest.ts --config mcp_server/vitest.config.ts` | PASS, 26 passed, 1 skipped |
| `node scripts/tests/test-subfolder-resolution.js` | PASS, 32 passed |
| Gate 1 broadened grep | FAIL, 2 file hits: `package-lock.json`, `skill-graph.json` |
| Gate 2 surface tags | FAIL, 1 file hit: generated `shadow-deltas.jsonl` |
| Gate 3 `/Users/` paths | FAIL, 50 file hits outside cli-opencode |
| Gate 4 8-prompt routing | PASS, 8/8 |
| Gate 5 compiler validation | PASS |
| Gate 6 child strict validation | PASS, exit 0 |
| Gate 6 parent strict validation | PASS, exit 0 for `071-stack-agnostic-cleanup` |
| Gate 7 sk-code untouched | FAIL as an exact command because a pre-existing sk-code manual testing file was already modified outside this remediation |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Global gates are not all green.** The actionable V-001 through V-007 target files are clean, but the exact broad gates still catch generated, vendored, or pre-existing files outside the allowed remediation set.
2. **Parent metadata remains separate scope.** V-008 is documented in ADR-002 and still needs a parent-metadata-repair packet.
3. **Compiled graph aggregation remains visible.** V-009 is documented in ADR-003; broad grep still sees the compiled aggregate.
4. **sk-code exact diff gate is polluted by pre-existing worktree state.** This remediation did not edit sk-code, but `git diff --name-only .opencode/skills/sk-code/` is not empty because the file was already modified before this turn.
<!-- /ANCHOR:limitations -->
