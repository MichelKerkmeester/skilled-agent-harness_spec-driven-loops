---
title: "Implementation Summary: CLI package residue removal"
description: "Forty-six files nothing reached left the CLI package, its three self-descriptions now agree, the validation story names the 39 dispatched rules and the orchestrator hop, one phase-child regex holds everywhere, and a spec-kit-check workflow runs the gates that no CI had ever run."
trigger_phrases:
  - "cli residue removal summary"
  - "what shipped cli package cleanup"
  - "coverage graph copy removed"
  - "spec kit check workflow shipped"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/035-spec-kit-simplification-research/007-cli-package-residue-removal"
    last_updated_at: "2026-09-06T18:50:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Closed the packet with every gate observed green"
    next_safe_action: "None; continue with the next research lane"
    blockers: []
    key_files:
      - ".github/workflows/spec-kit-check.yml"
      - ".opencode/skills/system-spec-kit/ARCHITECTURE.md"
      - ".opencode/skills/system-spec-kit/runtime/cli/README.md"
    session_dedup:
      fingerprint: "sha256:f7b817226c5f5812d893c0964fb813ef06776709b726a4a7b735ff3b5c378736"
      session_id: "2026-09-06-simplification-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: CLI package residue removal

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-cli-package-residue-removal |
| **Completed** | 2026-09-06 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The CLI package is 9,886 lines lighter and every one of those lines was unreachable. You can now read one description of the package in three places, follow the validation story from `validate.sh` through the orchestrator to the 39 registered rules, and rely on a pull-request workflow to run the check gate, the typecheck and the test suites that until today ran only in a developer's shell.

### What left

Seven scan leftovers, the markdown AST parser and the heading fixer with their orphan test, the kpi folder, an unsourced setup helper, three research harnesses in evals, a doctor script the `/doctor` command never called, two one-time migrations, the memory ranker, a smart-router check, the dead core scorer with the two tests that existed to explain it, the renderers module, the script registry and its loader, the five-module coverage-graph copy with its nine tests, the two ops healers with their runbook and shared helper, and a test that could not run because it used CommonJS `require` inside an ESM package. Every README row, tree entry, mock, legacy-suite section, export-contract row and fixture entry that named one of them went with it.

### What now says the same thing as the code

`package.json`, the CLI README and ARCHITECTURE describe one package. ARCHITECTURE names the 39 registered rules by class and the orchestrator hop, and the rules README states that hop once. The command-tree parity row names the workflow that runs it. The plan command contracts no longer carry a key that promises indexing. The phase-child regex is `^[0-9]{3}-[a-z0-9][a-z0-9-]*$` in every document, comment and code site, including the folder-naming rule, the child-manifest check and the resume ladder, which had used a looser form. The two placeholder checks and the two comment-hygiene lanes each name their sibling and the input that separates them. The ops README describes the two helpers that remain.

### What now runs in CI

`spec-kit-check.yml` builds the three packages, runs `npm run check` and `typecheck` in the CLI, the shared package tests, the CLI vitest project, and the five runtime-mirror checks the doctor runs on demand.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| 46 files under `runtime/cli/` | Deleted | The confirmed dead set, listed above |
| `runtime/cli/package.json`, `runtime/cli/README.md`, `ARCHITECTURE.md`, `runtime/cli/rules/README.md` | Modified | One description; the validation story |
| `runtime/cli/{continuity,lib,ops,setup,evals,spec,types,loaders,extractors,config}/README.md`, `config/index.ts`, `tsconfig.json` | Modified | Pointers to removed members |
| `runtime/cli/tests/{task-enrichment,description-enrichment,quality-scorer-calibration}.vitest.ts`, `tests/test-scripts-modules.js` | Modified | Mocks, blocks and sections for removed modules |
| `runtime/cli/{spec,rules}/check-placeholders.sh`, `rules/check-comment-hygiene.sh` | Modified | Sibling-lane headers |
| Ten regex sites across `runtime/lib`, `runtime/cli`, `assets`, `references` and the implement command contract | Modified | The enforced regex |
| `.opencode/commands/speckit/assets/speckit-plan-{auto,confirm}.yaml` | Modified | `post_save_write` |
| `README.md`, `.opencode/skills/system-spec-kit/README.md`, four feature-catalog pages | Modified | Rows for removed members |
| sk-code conventions tree, two sk-doc code-folder fixtures | Modified | Removed folders |
| deep-research playbook `graph-convergence-signals.md` | Modified | Points at the command contract instead of the removed copy |
| `.github/workflows/spec-kit-check.yml` | Created | The CI runner |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Every synthesis row was censused with a repository-wide search before anything moved, and the verdicts went into the research lane's `confirmed-findings.md`. The edits ran as one literal-replacement script that aborts on any site it cannot find exactly once; the files went through `git rm`; the package was rebuilt so the source-to-dist alignment check saw the orphans gone. Another session's uncommitted README sweep landed in the same checkout mid-phase, so the commit was assembled in a private index from this phase's paths only and the branch advanced with a compare-and-swap, leaving the sweep in the working tree.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Remove the coverage-graph copy rather than merge it | The deep-loop runtime already owns the production implementation; the copy had zero production importers and nine tests written to patrol the difference |
| Keep the save-path phase-parent copy | It recognises derived children and hardened membership, which the engine's detector does not; the command contract now says so |
| Keep `sweep-track-roots.mjs` | It is the documented manual tool the drift regeneration used |
| Tighten the folder-name regex in code, not only in prose | Three code sites accepted a name the phase detectors rejected; no existing folder used that shape |
| Wire the mirror checks into CI although three fail today | The failures are the other session's uncommitted diagram move, which is the drift the finding said CI could not see |
| Record the manifest test failure instead of patching it | It reads a manifest inside another session's live packet; that packet is not this program's to touch |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npm run rebuild` in `runtime/cli` | PASS |
| `npm run check` in `runtime/cli` | PASS, zero violations, dist alignment clean |
| `dist-freshness.cjs check-all` after rebuilding runtime | PASS, all watched outputs fresh |
| Six touched vitest files | PASS, 96 tests |
| Full CLI vitest project | 135 files and 1,346 tests pass; the one failure is `recursive-child-manifest.vitest.ts`, which reads another session's packet and failed before this phase |
| Legacy module suite | PASS, 289 tests |
| Shared package tests | PASS |
| Residue census for every removed name | Nothing outside specs, changelogs, benchmark reports and generated fixtures |
| `validate.sh <this child> --strict` | RESULT: PASSED |
| Commit `3f161d2ee9` | On `skilled/v4.0.0.0` and `main` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The workflow has not run on GitHub yet** Every command in it ran locally in this session, but the first pull-request run is the proof of the wiring.
2. **Three mirror checks fail on the other session's uncommitted move** `create-diagram.md` exists in `.cursor` and `.codex` without a source; the workflow will report it until that session commits or reverts.
<!-- /ANCHOR:limitations -->

---
