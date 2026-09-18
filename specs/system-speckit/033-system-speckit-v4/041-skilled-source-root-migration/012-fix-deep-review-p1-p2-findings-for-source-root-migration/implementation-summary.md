---
title: "Implementation Summary: Phase 12: fix-deep-review-p1-p2-findings-for-source-root-migration"
description: "Every caller that needs the source tree now asks one sentinel-based selection, and the migration review's live, pre-existing and coverage findings are closed with a test that fails without each fix."
trigger_phrases:
  - "source root remediation summary"
  - "deep review fixes shipped"
  - "sentinel selection block results"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/012-fix-deep-review-p1-p2-findings-for-source-root-migration"
    last_updated_at: "2026-09-18T10:45:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Landed the remediation and fixed all ten angle-10 findings"
    next_safe_action: "Push after operator approval"
    blockers: []
    key_files:
      - ".skilled/skills/system-spec-kit/shared/workspace/repo-root.mjs"
      - ".skilled/scripts/git-hooks/tests/source-root-selection.test.sh"
      - ".github/scripts/check-gate-inputs.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "6d11af6f-653e-4807-aca8-1c09c81640c1"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 012-fix-deep-review-p1-p2-findings-for-source-root-migration |
| **Completed** | 2026-09-18 |
| **Level** | 2 |
| **Status** | In Progress |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A checkout that carries only one of the two root names now works the same as one that carries both. Before this, nearly half the review's findings were one defect: code that joined `.opencode` or `.skilled` onto a path and hoped that name was the real one.

### One selection per language

JavaScript callers ask `findSourceRoot` in `.skilled/skills/system-spec-kit/shared/workspace/repo-root.mjs`, which returns the root whose `skills/system-spec-kit/SKILL.md` exists, `.skilled` first. The trigger-index generator derives its corpus roots from it and refuses to build without one (`runtime/cli/retrieval/lib/corpus.mjs`). The Codex installer respells each command under it (`.skilled/bin/install-codex-hooks.mjs`). The dispatch guard, the git preflight, the Codex watchdog and the advisor read through it (`.opencode/plugins/`).

The shell hooks cannot source a resolver file without first choosing a root to find it under, so each hook, the session-start checker and both hook installers carry one identical block. `.skilled/scripts/git-hooks/tests/source-root-selection.test.sh` holds the copies byte-identical, fails on any script that builds a path by naming one root, and runs the block in six layouts.

### The other findings

The gate-input parser resolves `$SOURCE_ROOT` paths and reads `.skilled` like `.opencode` in every branch (`.github/scripts/check-gate-inputs.sh`). Six guard workflows now run on direct pushes, `spec-kit-check.yml` triggers on the package manifests, and the workflows README states every trigger as the files declare it. Three install guides pass their document class, the compatibility manifest `.opencode/SYNC.md` matches the disk, and the retired install-guide names are gone from the Chrome installer, `PUBLIC-RELEASE.md` and the sk-doc README.

### Angle 10

The documentation review that did not finish the first time was re-run on GPT-5.6 Luna against `67fa4f7b8e`. It returned ten findings, every one confirmed on the tree: a Gate 3 option that does not exist, a pre-push naming gate that was removed, a Hermes roster documented as two models where the code enforces seven, stale runtime counts, and six smaller misstatements. All ten are fixed. The hub `graph-metadata.json` summary of the Hermes roster is the one residue, left to its generator.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-spec-kit/shared/workspace/repo-root.mjs` | Modified | `findSourceRoot` and `SOURCE_ROOT_SENTINEL` |
| `.skilled/scripts/git-hooks/*`, `.skilled/hooks/git/*`, `.skilled/bin/check-git-hooks.sh`, `.skilled/scripts/install-git-hooks.sh` | Modified | The shared selection block. Every tree path built from `SOURCE_ROOT` |
| `.github/scripts/check-gate-inputs.sh`, `.github/workflows/gate-inputs.yml` | Modified | `$SOURCE_ROOT` inputs resolved. Both roots read alike. Suites found under the selected root |
| `.skilled/bin/install-codex-hooks.mjs`, `runtime/cli/retrieval/{lib/corpus.mjs,generate-trigger-index.mjs}` | Modified | Commands and corpus roots follow the selected root |
| `.opencode/plugins/{cli-dispatch-audit,sk-git-preflight-advisory,codex-hooks-watchdog,system-skill-advisor}.js` | Modified | Read the tree through the selected root |
| Seven workflows and `.github/workflows/README.md` | Modified | Push coverage, manifest triggers, a true trigger table |
| `.opencode/SYNC.md`, `.opencode/README.md`, `PUBLIC-RELEASE.md`, sk-doc README, Chrome installer, three install guides | Modified | State only what exists |
| Five new test files and eight extended ones | Created/Modified | Each fails against the code or document it guards |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Eight commits on `worktrees/055-skilled-source-root-migration`, each through the git hooks with no bypass variable: `e7c7136391` (hooks and gate parser), `63ad140f9b` (resolver and runtime callers), `d755553a6e` (workflows), `67fa4f7b8e` (documents and their tests), `4dcc8c8f49` (the angle-10 fixes), `1b44fa6374` (these records), `156753e9d1` (the link and frontmatter debt the push guards reject) and `f906350655` (the binding count). The last two were approved by the operator on top of the review's findings. The main checkout was then fast-forwarded so the global hooks run the new selection block. Every new test was run a second time against the pre-fix code or document and failed there, so each one proves its fix rather than passing by construction.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| An identical block in each hook rather than a sourced resolver file | The hooks run from `~/.config/git/hooks` for every repository on the machine. Sourcing a file means choosing a root to find it under, and a lookup that failed would block every commit everywhere. A drift test gives one rule with no new failure path. |
| Select by the sentinel file, never by a directory existing | A placeholder `.skilled/` fooled the earlier directory test. The sentinel is the one thing only a real tree carries. |
| The advisor refuses to sign a workspace without a source root | A refused signature is already never cached, so the existing path gives the "uncacheable" behavior the finding asked for. |
| Put the six guards on push and clear what two of them caught | Both failures predate this work (the pre-remediation snapshot fails both). Leaving the guards off push would have kept the gap the finding named, so the operator chose to fix the debt instead. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Node gate, `.skilled/scripts/run-node-tests.mjs` | 88 files, 1001 pass, 1 fail. Baseline 84 files, 957 pass, 1 fail. The one failure is the same pre-existing `create-journey-proof.test.cjs` |
| Hook suites (eight, including the new selection test) | All pass. Selection test 38/38 |
| Gate-input suite and real-tree check | 48/48. Real tree PASSED with 141 inputs resolved against 132 at baseline |
| Resolver, retrieval and plugin suites | parity 42/42, retrieval 22/22, installer 21/21, consumers 7/7, advisor 29/29 |
| Negative controls | Each new test fails against the pre-fix code or document |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The retired skill-benchmark lane is unlinked, not rewritten.** About 43 documents still describe it. Their links now say it was retired, and rewriting them is the decision its retirement commit recorded.
2. **No CI job checks the Hermes skill mirror.** `sync-skills-hermes.cjs --check` found four copies drifted by this work before they were regenerated. Nothing would have caught it.
3. **The trigger index was not regenerated.** No gate checks its freshness, and the main checkout holds another session's uncommitted edits to it.
<!-- /ANCHOR:limitations -->

---
