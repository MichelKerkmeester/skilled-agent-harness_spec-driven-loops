---
title: "Implementation Summary"
description: "Open with a hook: what changed and why it matters. One paragraph, impact first."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/047-plugin-scanner-readiness"
    last_updated_at: "2026-10-01T18:43:04Z"
    last_updated_by: "template-author"
    recent_action: "Initialize continuity block"
    next_safe_action: "Replace template defaults on first save"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-047-plugin-scanner-readiness"
      parent_session_id: null
    completion_pct: 0
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
| **Spec Folder** | 047-plugin-scanner-readiness |
| **Completed** | 2026-10-01 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The eight code findings the HOL plugin scanner raised in skill code are gone, CI actions are pinned to commit SHAs, the repository has a security policy, and 32,372 vendored files under `specs/**/context/` leave the tracked tree. The listing itself still cannot pass the scanner's gate, because its secret heuristic reads every `sk-` skill name as an OpenAI key.

### Plugin scanner readiness

Shell commands that were assembled as strings now pass their arguments straight to the process, so a quote or space in a path can no longer change what runs. The benchmark scorer still runs model-written code in a separate process per test case with a timeout. It now loads that code as a temp module instead of through the `Function` constructor. Dependabot keeps the pinned actions current.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.gitignore` | Modified | Ignore `specs/**/context/`; drop the vendored `image-size/dist` exception |
| `.github/workflows/*.yml` (23 files) | Modified | Pin 50 action references to commit SHAs |
| `.github/dependabot.yml` | Modified | Add the `github-actions` ecosystem |
| `SECURITY.md` | Created | Vulnerability reporting policy |
| `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/code-task-scorer.cjs` | Modified | Temp-module loading in the runner child |
| `.skilled/skills/sk-code/sk-code-webflow/assets/scripts/minify-webflow.mjs` | Modified | `execFileSync` for terser |
| `.skilled/skills/cli-classifier/benchmark/pi-transport/score-pi-transport.mjs` | Modified | Comment wording |
| `.skilled/skills/system-spec-kit/runtime/tests/progressive-validation.vitest.ts` | Modified | `execFileSync` argument arrays |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/multi-ai-council-validator.vitest.ts` | Modified | `execFileSync` argument arrays |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/test-validation-system.cjs` | Modified | `execFileSync` with env passed as an option |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/test-frontmatter-backfill.js` | Modified | `execFileSync` argument arrays |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-merge.vitest.ts` | Modified | `execFileSync` argument arrays |
| `.skilled/skills/sk-doc/scripts/tests/code-folder/baseline-readme-verdicts.json` | Modified | Rebuilt from 1,040 tracked READMEs |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Every affected suite ran before and after the edits. The tracked-tree change was built in a temporary git index, never in the shared one, because another session commits from this checkout. That tree was exported with `git archive` and scanned with `plugin-scanner` 3.15.5 at the catalog's thresholds.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep `scratch/`, `z_archive/`, `lineages/` and run logs tracked | They were untracked only to fit the scanner's 50,000-file and 512 MB budget. Once the complete scan showed the `sk-` false positive blocks the gate regardless, the operator kept them |
| Leave the `.mcp.json` symlink | The operator declined the swap; it costs 8 scanner points and nothing else |
| Do not use the scanner's `ignore_paths` config | The catalog's pinned action defaults `trust_repository_policy` to false, so a repository config never reaches the gate |
| Leave the trigger-index corpus policy unchanged | Excluding `context/` there is a retrieval policy change with its own divergence table, and only one indexed document is affected |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Spec-kit progressive-validation + multi-AI-council Vitest | PASS 54/54, baseline 54/54 |
| `test-validation-system.cjs` | PASS, same PASS count as baseline, including the `SPECKIT_STRICT` env case |
| `test-frontmatter-backfill.js` | PASS 15/0, baseline 15/0 |
| Deep-loop `fanout-merge.vitest.ts` | PASS 61/61, baseline 61/61 |
| Scorer `sweep-isolation` + `sweep-runtime` | PASS 29/29, baseline 29/29 |
| Scorer by hand | Syntax error reported as `define:`, correct function passes, infinite loop reports `timeout` |
| `minify-webflow.mjs` on `sub dir/it's.js` | PASS, 42.27% reduction, correct output |
| README verdict parity against an index without `context/` | PASS 1,040/1,040, diff empty |
| Scanner, exported final tree | Score 70, incomplete (file budget); 0 high in `.skilled/`; 19 high in tracked `specs/` scratch and archive scripts and logs |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The catalog gate stays red.** With the budget lifted, the scanner reports 3,351 high `HARDCODED_SECRET` findings, 3,302 of them on lines carrying an `sk-` skill name that matches its `^sk-(?:proj-|ant-)?[A-Za-z0-9_-]+$` OpenAI key pattern. Only an upstream scanner fix or a maintainer review clears it.
2. **The trigger index still lists one `context/` document.** `specs/cli-jev/003-cli-jev-workflow-integration/007-classifier-deep-research/context/deem-local.md` stays on disk and in the index, so the advisory CI freshness check reports one obsolete path until the corpus walker excludes `context/`.
3. **The score falls to 70 from 76.** The vendored repositories scored well on per-package checks; without them the remaining fixture packages weigh more. The scan still stops at the file budget.
<!-- /ANCHOR:limitations -->

---


