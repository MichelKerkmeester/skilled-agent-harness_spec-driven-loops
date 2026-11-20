---
title: "Implementation Summary"
description: "No hand-written file outside history names OpenCode 1: the refusal, the remove-v1 helper and every v1 observation are gone, and the version families are v2 and unknown."
trigger_phrases:
  - "v1 reference purge implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/005-v1-reference-purge"
    last_updated_at: "2026-11-20T17:12:33Z"
    last_updated_by: "generate-context"
    recent_action: "Purged every OpenCode 1 reference outside history; gate and live battery green"
    next_safe_action: "None for this phase; it closes the v1 removal"
    packet_purpose: "Purpose: No file outside history names OpenCode 1, every version consumer reads only the `v2` and `unknown` families, and the gate shows no regression beyond the deliberately removed v1 tests."
    blockers: []
    key_files:
      - "specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/005-v1-reference-purge/implementation-summary.md"
      - "specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/005-v1-reference-purge/decision-record.md"
      - "specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/005-v1-reference-purge/acceptance-criteria.md"
    session_dedup:
      fingerprint: "sha256:968e0319be974adf3965e0fd453282e2b1327f13641d81731328b241c0ca61ea"
      session_id: "scaffold-005-v1-reference-purge"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "df9261d4-6090-4b52-892b-db52ff291ccd"
      workspace: "/Users/michelkerkmeester/worktrees/public/493-v1-reference-purge"
      savedAt: "2026-11-20T17:12:33Z"
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

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-v1-reference-purge |
| **Completed** | 2026-11-20 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

No hand-written file outside history names OpenCode 1 any more. The version families are now `v2` and `unknown`, the refusal and the `remove-v1` helper are gone, and the gate is unchanged apart from five tests that only exercised the removed code.

### Phase 5: v1-reference-purge

You read one rule everywhere now: major 2 is `v2`, anything else is `unknown`. The deep loop refuses `unknown` with its existing "was not supported" error, and the dispatch guard holds it to every rule at its declared severity, so a stray OpenCode 1 binary is handled by the same path as any other unrecognized version. The wrapper adds `--standalone` without probing the version first, and the setup helper offers `v2` and `check` only.

Docs lost every OpenCode 1 observation. Where a claim was measured only on OpenCode 1 it was deleted. Where an OpenCode 2 observation already backed the fact it was kept without the version tag. No OpenCode 2 result was invented.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/hooks/cli-dispatch/lib/opencode-version.mjs`, `.skilled/skills/system-deep-loop/runtime/scripts/opencode-version.cjs` | Modified | Drop the major-1 branch and the `unsupported` family and refusal |
| `.skilled/hooks/cli-dispatch/lib/dispatch-rule-checks.mjs` | Modified | `UNRESOLVED_FAMILIES` is `['unknown']` |
| `.skilled/bin/skilled-loop` | Modified | Remove the version probe and refusal; keep `--standalone` |
| `.skilled/commands/doctor/scripts/opencode-version-battery.cjs` | Modified | Drop the major-1 branch and the unsupported-binary detail |
| `.skilled/skills/cli-external-orchestration/cli-opencode/scripts/opencode-setup.sh` | Modified | Remove `remove-v1`, its helpers and the `opencode1` name in `check` |
| `.skilled/hooks/cli-dispatch/lib/opencode-version-corpus.json` | Modified | Six v1 rows replaced by the same shapes on v2 or another major; 13 rows |
| Nine test files and the wrapper test harness | Modified | v1 samples moved to `3.0.0`; tests of removed code deleted; a usage test for the two modes added |
| `.github/workflows/opencode-v2-battery.yml`, `.github/workflows/README.md` | Modified | Drop the `remove-v1` description |
| `.opencode/plugins/tests/plugin-inventory.json` | Modified | Drop the 1.19.3 observation from one reason |
| 27 docs and the sk-git fixture | Modified | Delete or rewrite every OpenCode 1 observation |
| Trigger index and retrieval fixtures | Regenerated | Rebuilt by `generate-trigger-index.mjs` |
| `../003-v1-docs-and-playbooks-sweep/scratch/justified.txt` | Modified | First line marks the list superseded by ADR-001 |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The baseline gate ran before the first edit, in worktree `worktrees/493-v1-reference-purge` from origin/main. Code and tests changed first and the gate ran again, then docs, then the trigger index was regenerated. The branch was rebased onto origin/main, the gate ran a third time, and the commits were pushed to main.

The five removed tests are the three `remove-v1` end-to-end cases (one usage test was added in their place), the wrapper's OpenCode 1 refusal test, the wrapper's "starts standalone after the version probe" test (it now duplicated the first-launch test), and the `unsupported` copy of the rule engine's family loop.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Purge everything, superseding phase 003 ADR-001 (ADR-001) | The operator chose it, accepting that a leftover v1 binary launches and fails without a clear message |
| Accept history-fed residue in the two generated retrieval files (ADR-002) | Their v1 phrases come only from changelogs, spec docs and the cli-opencode 1.x skill versions, which stay as written |
| Teach the sk-git fixture parity test the fixture's one edit | The test compares the fixture with a frozen Git commit, so the edit has to be stated, and it is stated as a pattern so the test file names no old version |
| Keep the battery's flat `info.mcp` reader | It is not shown to be OpenCode 1 only, so the code stays and only the test variable was renamed |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Sweep on the final tree | Lists only `phrase-variants.json` and `trigger-index.json`; a source trace finds 48 cli-opencode skill-version phrases, 4 history phrases, 0 live sources |
| Gate node leg, 43 files | Baseline 837 tests (836 pass, 1 skip); after 832 (831 pass, 1 skip), 0 fail, exit 0 |
| dispatch-audit vitest | 133 of 133 before and after |
| Deep-loop opencode subset | 490 pass and 3 skipped before and after |
| Vibe repo-guards | 28 of 28 before and after |
| Whole deep-loop runtime vitest | 3821 pass and 11 skipped of 3832, before and after |
| Doctor suite | 1388 of 1388 before and after |
| sk-skill-convert | 69 of 69 |
| Live battery `--family=v2 --json` on OpenCode v2.3.2 | exit 0; family-present, plugin-active (20 of 20), skill-visible (14), command-listed (92 of 92) all PASS |
| Runtime mirrors, check-only | `sync-runtime-mirrors.cjs --check` PASS for 260 mirrors; the other 13 checkers exit 0 |
| Phase 003 replacement checks | 0, 0 and 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A leftover OpenCode 1 binary fails with OpenCode's own usage error.** The wrapper launches it with `--standalone`, which it does not accept. Remove it by hand with `npm uninstall -g opencode-ai`.
2. **The literal sweep is not empty.** The two generated retrieval files keep phrases fed by history and by the cli-opencode skill's 1.x version numbers (ADR-002).
3. **The effort-ladder rows in the cli-opencode model catalog stay unverified on 2.3.2.** They no longer say where they were observed, and no OpenCode 2 reading of them is recorded.
<!-- /ANCHOR:limitations -->

---
