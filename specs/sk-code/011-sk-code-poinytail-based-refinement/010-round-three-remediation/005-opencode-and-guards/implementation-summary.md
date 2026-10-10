---
title: "Implementation Summary"
description: "A fourth sk-code drift guard now reads the prose that cites the routers, router-sync check 2 reads the ROUTER.md shared controls, doctor parity covers the README and packet changelogs, and the OpenCode packet is clean at 1.2.0.0."
trigger_phrases:
  - "opencode and guards implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/005-opencode-and-guards"
    last_updated_at: "2026-10-10T14:30:00Z"
    last_updated_by: "verifier"
    recent_action: "Re-verified after the six fix units applied"
    next_safe_action: "Orchestrator re-mints compiled routes and runs Hermes"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-005-opencode-and-guards"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-opencode-and-guards |
| **Completed** | 2026-10-10 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The sk-code drift gate now reads the prose that cites the routers. A new documentation claim checker is the fourth guard in `run-all-drift-guards.sh`, the router-sync guard takes its shared controls from `ROUTER.md` instead of a private list, the doctor compares the hub README and each packet changelog with the SKILL.md version, and the canary covers the Obsidian-over-Webflow precedence. The OpenCode packet reports no checker hit and ships as 1.2.0.0.

### Phase 5: opencode-and-guards

`verify_doc_claims.cjs` walks every Markdown and JSON file under the hub (skipping `changelog/`, `benchmark/reports/` and symlinked files) and runs four checks: path references resolve, retired packet names are gone, no wording counts two surfaces, and the `ROUTER.md` load-tier claims are backed by `DEFAULT_RESOURCE`. Deliberate legacy lines go in an `ALLOWED` data block that carries a reason per row. Router-sync check 2 now reads the `SHARED_CONTROL_RESOURCES` list and the `DEFAULT_RESOURCE` preamble from `ROUTER.md` and accepts a workflow mode's own leaf through `leaf-manifest.json`. Doctor checks 13c (hub README version, warn-only for `cli-classifier`, `cli-external-orchestration`, `sk-doc` and `system-deep-loop`) and 13d (packet SKILL.md version against its newest changelog entry) close the version-parity gap.

The OpenCode packet drops the retired `code-*` names, labels its comment budget as the surface setting in six places, fixes two stale link labels and a packet-number pointer, and gains `references/shared/workflow-guardrails.md`. That file takes the three "OpenCode Surface Only" subsections out of the shared implement and verify workflows (child 001 replaced the originals with pointers to its `#2-implementation-guardrails`, `#3-verification-reality` and `#4-runtime-build-traps` anchors, which resolve) and is routed through the OpenCode `DEFAULT_RESOURCE`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify_doc_claims.cjs` | Created | Documentation claim checker with four checks and an allowlist |
| `.skilled/skills/sk-code/sk-code-opencode/scripts/tests/verify_doc_claims.test.cjs` | Created | Six tests: clean hub, allowlist scope, one known-bad input per check |
| `.skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify_router_sync.cjs` | Modified | Check 2 reads `ROUTER.md` and the manifest leaves; `PARENT_TIER_ALLOWLIST` removed |
| `.skilled/skills/sk-code/sk-code-opencode/scripts/tests/verify_router_sync.test.cjs` | Modified | Two check 2 tests |
| `.skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh` | Modified | Fourth guard and four-guard wording |
| `.skilled/skills/sk-code/sk-code-opencode/SKILL.md` | Modified | Version 1.2.0.0, packet names, guard count, guardrails in `DEFAULT_RESOURCE` and the shared-tier map |
| `.skilled/skills/sk-code/sk-code-opencode/README.md`, `scripts/README.md`, `assets/scripts/README.md` | Modified | Packet names, guard count, checker and test rows |
| `.skilled/skills/sk-code/sk-code-opencode/references/shared/` (alignment-verification-automation, code-organization, universal-patterns) | Modified | Names, guard count, budget label, link label, carry-over line |
| `.skilled/skills/sk-code/sk-code-opencode/references/{javascript,python,config,shell,typescript}` style guides | Modified | Comment-budget label, one link label |
| `.skilled/skills/sk-code/sk-code-opencode/manual-testing-playbook/` (root and nine scenarios) | Modified | Packet names and guard count |
| `.skilled/skills/sk-code/sk-code-opencode/references/shared/workflow-guardrails.md` | Created | OpenCode guardrails, verification reality and runtime build traps |
| `.skilled/skills/sk-code/sk-code-opencode/changelog/v1.2.0.0.md` | Created | Changelog entry |
| `.skilled/skills/sk-code/leaf-manifest.json` | Modified | Regenerated for the new asset script and reference |
| `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json` and its archive copy | Modified | `surface-collision-obsidian-over-webflow` case; the two copies are byte-identical |
| `.skilled/commands/doctor/scripts/parent-skill-check.cjs` and its invariants test | Modified | Checks 13c and 13d, three tests |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

DeepSeek V4.1 Flash built 85 units one at a time (79 planned plus six for the guardrails move), each gated by its own check; all 85 are ticked. The verifier reran 83 of the 85 unit checks (all matched), ran every Phase 3 task and every goal criterion, and read the full diff plus every new file. The two negative controls were rerun or reasoned: the HEAD router-sync guard fails the two new check 2 tests (`fail 2`, rerun in a copy), and the HEAD doctor holds none of the 13c/13d ids the three new doctor tests assert (the builder's run showed `fail 3`; an isolated rerun of the HEAD doctor did not start in a copy, so that one is not independent).

The builder skipped Phase 1, so no `before-*` files exist. Before state came from `git show HEAD:<file>` for the findings and the Markdown validator and voice-scan comparison, from `scratch/plan-doc-claims.txt` for the checker (paths 53, names 137, surfaces 1, tiers 6), and from the plan.md section 6 numbers for the rest.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The checker reads the hub from disk and its test writes known-bad inputs into a temp hub | A bad fixture kept under the hub would fail the live checker and router-sync check 1b |
| `code-quality` and `code-review` count as retired only in backticks or after `sk-code:` | The bare words are routing keywords and plain English in `hub-router.json` and `description.json` |
| Check 2 reads both the `SHARED_CONTROL_RESOURCES` list and the `DEFAULT_RESOURCE` preamble | The root-router contract lets the list hold `shared/` paths only, so a workflow mode's own leaf passes through the manifest |
| Doctor 13c warns for four hubs whose README already lags | Every other hub keeps its `OK` verdict; the four lagging READMEs are not this phase's files |
| The OpenCode-only workflow text moved as a real file | One copy lives in the tier that owns it, and child 001 points the shared docs at it |
| f-iter014-001 is recorded as already fixed | `grep -n 'every leg of it (1a, 1b, 2, 3 and 4)'` finds it at `SKILL.md:175` |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| 1. `node --test verify_doc_claims.test.cjs` | PASS: exit 0, pass 6, fail 0 |
| 2. `verify_router_sync.cjs` and its test | PASS: exit 0, `router-sync: 5/5 checks passed`, pass 5, fail 0 |
| 3. `verify_doc_claims.cjs \| grep -c 'sk-code-opencode/'` | PASS: prints 0, grep exit 1 |
| 4. `parent-skill-check-invariants.test.cjs` | PASS: exit 0, pass 98, fail 0; all seven hubs end `OK: parent-skill-check` |
| 5. `run-all-drift-guards.sh` | PASS: exit 0, four PASS lines, `run-all-drift-guards: all 4 guards PASSED`; checker `doc-claims: 4/4 checks passed` |
| 6. `validate.sh <folder> --strict` | PASS: `RESULT: PASSED`, Errors 0 |
| Canary and fixture copies | PASS: cases 12 failures 0, `cmp` silent |
| Leaf manifest | PASS: `--check` OK (59ea33fd...), checked=14 fresh=14 failed=0 |
| Compiled routing | PENDING-ORCHESTRATOR: `sk-code stale-manifest` (sibling hub edits; no re-mint here) |
| Hermes | PENDING-ORCHESTRATOR: `--check` reports 9 drifted including sk-code-opencode |
| Edited Markdown (22 files) | PASS: validate_document issues and hvr hard blockers do not rise against HEAD (0 of 22 worse) |
| Scope | PASS: 34 paths, 30 modified and 4 new, all in Files to Change |

Review result: six defects found and fixed (FX1 to FX6, applied and re-verified): four correct `ROUTER.md:605` words were flagged (P1), `ALLOWED` rows were ignored by the tiers check (P2), and `alignment-verification-automation.md:142` named three guards where the gate runs four (P2). The patched test fails against the checker with the fix reverted (pass 5, fail 1), and the patched checker still reports the original 6 tier hits on a HEAD copy of ROUTER.md.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The tiers check treats a bullet's file or `/*` glob as an every-route claim.** A conditional bullet that names a glob would still be reported; bare folders count only in the ALWAYS row.
2. **Link labels that are not `./` or `../` paths are not checked.** A label such as `assets/checklists/x.md` over a `../sk-code-opencode/...` target passes even when the label no longer names a real packet-local file.
3. **Backticked paths with `#anchor` and link anchors are not resolved.** Only the file part of a link target is checked.
4. **A missing `--root` directory crashes with a stack trace** instead of a usage error.
5. **The moved guardrails text carries four semicolons** that the voice scan counts as hard blockers; they were verbatim in the shared docs and are left as a faithful move.
<!-- /ANCHOR:limitations -->

---
