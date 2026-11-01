---
title: "Implementation Summary"
description: "Observed implementation and verification results for the three doctor scripts using the shared sentinel resolver."
trigger_phrases:
  - "nested skilled root implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "commands/002-doctor-audit-and-fixes/003-nested-skilled-root"
    last_updated_at: "2026-11-01T06:38:22Z"
    last_updated_by: "markdown"
    recent_action: "Recorded implementation and verification results from existing evidence"
    next_safe_action: "Commit the Skilled fix and re-pin Barter coder before the live proof"
    blockers:
      - "Strict validation still reports generated metadata integrity and drift errors outside the writable scope."
      - "The live Barter proof waits for the commit and re-pin."
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-003-nested-skilled-root"
      parent_session_id: null
    completion_pct: 92
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
| **Spec Folder** | 003-nested-skilled-root |
| **Status** | In Progress |
| **Completed** | Local implementation and verification are recorded; packet closure remains blocked by strict validation and the live re-pin proof |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The three doctor scripts now resolve the framework copy through the shared sentinel resolver. A nested vendored copy reads its own `.skilled` tree, so the hub check no longer reports `HUB_NOT_FOUND` and the freshness panel no longer reports a missing-tree `panel error`.

### Phase 3: nested-skilled-root

The three scripts that choose their own root keep their public shape. `lib/sk-skill-surface.cjs` keeps `findRepoRoot(start)` and its `repoRoot` and `startDir` options, `skill-graph-freshness.cjs` keeps `SKILL_GRAPH_FRESHNESS_ROOT` above the resolver, and `parent-skill-check.cjs` keeps `REPO_ROOT` as the one value its helper paths join onto. What changes is where that value comes from: the sentinel file `skills/system-spec-kit/SKILL.md` under `.skilled` or `.opencode`, searched upward from the script's own directory.

The implementation changes four files: the three doctor scripts and the freshness command asset. One new `doctor-root-resolution.test.cjs` suite covers nested, decoy, checkout and linked layouts.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/doctor/scripts/lib/sk-skill-surface.cjs` | Modified | Root walk becomes a resolver call, so `sk-skill-check` and `sk-skill-convert` read the tree they were launched from |
| `.skilled/commands/doctor/scripts/skill-graph-freshness.cjs` | Modified | Root walk becomes a resolver call, so the panel scans its own `.skilled/skills` |
| `.skilled/commands/doctor/scripts/parent-skill-check.cjs` | Modified | `.opencode` walk and arithmetic fallback become a resolver call, so an ancestor decoy cannot capture `REPO_ROOT` |
| `.skilled/commands/doctor/scripts/tests/doctor-root-resolution.test.cjs` | Created | Temporary git repository holding the framework copy one folder below its root, plus the decoy, checkout and linked layouts |
| `.skilled/commands/doctor/assets/doctor-skill-graph-freshness.yaml` | Modified | States the resolver default instead of the `.git` walk |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The new suite moved from `3/8` passing against the unmodified scripts to `8/8` after the resolver change. The Skilled checkout and linked-`.skilled` cases preserve the existing verdicts. The live proof inside Barter coder remains open until the change is committed and re-pinned.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Delegate to `shared/workspace/repo-root.mjs` instead of copying the sentinel walk into the doctor scripts | The resolver already ships as source, the hooks and the CLI use it, and a fourth copy is the defect this packet removes |
| Import it by a path relative to each script, as `review-research-paths.cjs:169` does | A package specifier needs a provisioned `node_modules` link, which a vendored copy does not carry; the relative path loads from the copy itself |
| Keep the freshness panel's exit contract | `panel error` at exit 0 is the documented report-only behaviour; the defect is the wrong root, not the exit code, and changing the exit code would gate a `/doctor` run |
| Build the fixture instead of refreshing Barter's copy | The vendored copy is pinned at `6f42c7b169`; a fixture proves the shipped code, while a refreshed copy would prove only that checkout |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Red-before-green fixture suite | `3/8` passed before the fix; `8/8` passed after it (`scratch/orchestrator-verify.md:18-30`) |
| Existing Node suites and delta | 304 existing passes remained; the new suite added 8, for 312 Node passes across the recorded set (`scratch/orchestrator-verify.md:35-49`) |
| Freshness panel suite | 19 passed, matching the recorded baseline (`scratch/orchestrator-verify.md:45`) |
| Aggregate runner | 7 suite(s) passed, 0 failed; node aggregate 999 pass, 0 fail (`scratch/T034.md:15-18`) |
| Skilled and linked baselines | Hub path count 1, panel-error count 0, warning count 1; linked and checkout cases pass 2 (`scratch/T031.md:4-15`, `scratch/T014.md:4-13`) |
| Scratch fixture scan | `find specs/commands/002-doctor-audit-and-fixes/003-nested-skilled-root/scratch -name '.skilled' -type d` printed no line, exit 0 |
| Static secret scan | No `secret` or `password` matches; `token` hits are identifier names only |
| Strict packet validation | `PLACEHOLDER_FILLED: No unfilled template placeholders found`; `Summary: Errors: 2 Warnings: 0`; `RESULT: FAILED` with only `GENERATED_METADATA_INTEGRITY` and `GENERATED_METADATA_DRIFT` (the generated metadata files are out of scope) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The live Barter proof is not complete.** The `coder/.skilled` copy stays at its pinned revision until the change is committed and re-pinned. The fixture is the proof for the local change.
2. **Root resolution cannot repair an incomplete copy.** A framework copy without `skills/system-spec-kit/SKILL.md` is not recognised as a source tree, and the resolver falls back to the folder holding `.skilled`, which is the safest answer but not a working install.
3. **Freshness still exits 0 on a panel error by default.** That is the documented contract, so a caller that needs a gate must pass `--strict`.
4. **One generic fix-completeness check remains unverified.** Existing suite evidence covers nested, decoy, no-sentinel and linked cases, but does not show delimiter, joined-input, outside-root, no-op and fallback table cases; `CHK-FIX-004` remains unticked.
<!-- /ANCHOR:limitations -->

---
