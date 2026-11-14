---
title: "Implementation Summary"
description: "The hub router's prose now names files that exist and covers all three surfaces, the implement doctrine is routed, and the setup battery passes with an exit status of 0 where it used to fail on 23 files."
trigger_phrases:
  - "hub router alignment implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/hub-architecture/006-sk-code-audit-remediation/005-hub-router-alignment"
    last_updated_at: "2026-11-14T15:56:40Z"
    last_updated_by: "implement-workflow"
    recent_action: "Aligned the hub router prose with its map and turned the setup battery green"
    next_safe_action: "Start 006-skilled-packet-fixes"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-005-hub-router-alignment"
      parent_session_id: null
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

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-hub-router-alignment |
| **Completed** | 2026-11-14 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The hub router's prose now names files that exist and covers all three surfaces, the implement doctrine is routed, and the setup battery passes with an exit status of 0 where it used to fail on 23 files.

### Phase 5: hub-router-alignment

You can follow any path in sections 1 to 7 of the hub `ROUTER.md` and find the file. The language overlay lists each language's real files and folders. The implementation tier, the DEBUGGING row and the VERIFICATION row match section 8. `sk-code-ci` and `sk-code-frontend` have their own rows in the load tiers, the intent notes and the verification table. IMPLEMENTATION loads `shared/references/workflow-implement.md`, which is now a declared shared control. The four authoring checklists open by one stated selector, and the skilled and quality packets repeat the MCP server selector in the same words. The pointer to another repository is gone. The drift guard skips the header rule for a file that is only a one-line re-export, and the loop shell shim lost one blank line, so the guard reports no error. The hub is at version 3.12.0.0 with a release note that names the ledger rows phases 002 to 005 closed.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-code/ROUTER.md` | Modified | Sections 2, 3, 4, 5, 8 and 10 |
| `SKILL.md`, `description.json`, `mode-registry.json`, `hub-router.json` | Modified | Version 3.12.0.0 |
| `changelog/v3.12.0.0.md` | Created | The hub release note for phases 002 to 005 |
| `sk-code-skilled/SKILL.md`, `sk-code-quality/SKILL.md` | Modified | The MCP server checklist selector, one sentence each |
| `sk-code-skilled/assets/scripts/verify_alignment_drift.py` and its test | Modified | `is_single_line_reexport`, called from `check_typescript`, and one test |
| `sk-code-skilled/assets/checklists/typescript-checklist.md`, `references/typescript/style-guide/overview-strict-and-naming.md` | Modified | State the second header exemption |
| `sk-code-skilled/assets/scripts/verify-router-sync.cjs` | Modified | One comment, which said only debug and verify were routed |
| `.skilled/bin/skilled-loop-shell.sh` | Modified | One blank line removed |
| Two `activation/sk-code/manifest.json` files | Regenerated | Policy hash after the router and version change |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each cited line was read and each edit was designed as literal text before any dispatch. Twenty-three briefs went to DeepSeek V4.1 Flash at max thinking through cli-pi, one change each, and every diff was read. The orchestrating session ran the path check, the drift guards, the setup battery, the forced failure, the probe replay, the four test suites, the parent-skill check and the quality runner. The first commit attempt was blocked by the mirror-parity gate, because an earlier session had added headers to the 22 Pi entry files. The operator chose the guard exemption, the headers were reverted, and the code landed as `19214454c5`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| AC-003 reads the pass line the battery prints | ADR-001. The battery prints `STATUS=OK legs=9` on a pass and has never printed `STATUS=PASS failed=0` |
| The loop shell shim lost one blank line and gained no `set` | ADR-002. A top-level `set` would change the operator's interactive shell. The operator chose this on 2026-11-14 |
| The guard skips the header rule for a one-line re-export file | ADR-003. The mirror-parity gate requires each Pi entry file to be exactly that line. The operator chose this on 2026-11-14 |
| The MCP server selector is `the target is MCP server source: a file that defines an MCP server, registers its tools or sets how it starts` | The checklist's own Usage section lists those three cases. The wording is the session's and no second reader checked it |
| The hub version rose to 3.12.0.0, a minor step | IMPLEMENTATION now loads one more file, which changes what a route returns |
| The forced failure used `SPECKIT_COMPILED_ROUTING=0`, not a scratch copy | The battery reads the repository root, so a scratch copy means copying the whole tree. The switch fails two legs without touching a file |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| The path check in `plan.md` section 5 | `missing 0` |
| `rg -c 'workflow-implement.md' .skilled/skills/sk-code/ROUTER.md` | `5` |
| `run-all-drift-guards.sh` | `all 4 guards PASSED, 21 non-blocking warning(s)`, exit 0, 0 `[ERROR]` lines |
| `sk-code-setup-check.cjs` | Nine legs PASS, `STATUS=OK legs=9`, exit 0 |
| `SPECKIT_COMPILED_ROUTING=0 sk-code-setup-check.cjs` | `STATUS=FAIL failed=2 skipped=0`, exit 1, saved in `scratch/forced-failure.txt` |
| The REQ-005 count of `sk-code-ci` and `sk-code-frontend` lines in sections 3 and 5 | `4` |
| `rg -c 'by judgment'` on the three files, and `rg -c 'barter/'` on `ROUTER.md` | Nothing printed, exit 1, both times |
| `sync-hook-registrations.cjs --check` | `PASS`, 22 Pi extensions resolve |
| `pytest test_verify_alignment_drift.py` | 37 passed |
| `node --test` on the sk-code-skilled tests, the sk-code-quality tests, `compiled-route-surface-hint.test.cjs`, `sk-code-setup-check.test.cjs` and `skilled-loop-shell.test.cjs` | 55, 154, 15, 17 and 37 pass, 0 fail |
| Probe replay | `13 frontend 13`, `8 negative 0`, `1 review 1` |
| `parent-skill-check.cjs .skilled/skills/sk-code` | All hard invariants passed, 0 warnings |
| `quality-gate.cjs` | `NO_BLOCKER_FOUND` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The battery never prints `STATUS=PASS`.** Its pass line is `STATUS=OK legs=9`. AC-003, this phase's `goal.md` and the parent goal's third criterion quote the guessed line. ADR-001 records it.
2. **The shim fix depends on a line count.** A line added above line 80 of `skilled-loop-shell.sh` brings the guard error back.
3. **`spec.md` lists `.pi/extensions/*.ts` as files to change.** They are unchanged. ADR-003 records why.
4. **The packet router still maps the MCP server checklist under IMPLEMENTATION.** The hub router says a mapped `assets/` entry opens only on its selector. Phase 006 owns the packet router.
5. **The skilled and quality packets changed without a packet release note.** Phases 006 and 008 write those.
<!-- /ANCHOR:limitations -->

---
