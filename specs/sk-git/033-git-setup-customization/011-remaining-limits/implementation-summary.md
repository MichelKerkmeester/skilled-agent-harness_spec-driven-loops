---
title: "Implementation Summary"
description: "Four limits left after phase 10 are closed: the adapter check reads an identifier default export, the drift guard reports 8 warnings instead of 278, the advisor playbook has no validator warnings, and the lease stress test fails only on a hang."
trigger_phrases:
  - "remaining limits implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-git/033-git-setup-customization/011-remaining-limits"
    last_updated_at: "2026-10-17T13:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "All four items closed and every gate rerun from the final state"
    next_safe_action: "Coordinator writes the changelog entries and commits, including the staged sk-vision untrack"
    blockers: []
    key_files:
      - ".skilled/commands/doctor/scripts/git-setup-check.cjs"
      - ".skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify_alignment_drift.py"
      - ".skilled/skills/system-skill-advisor/manual-testing-playbook/manual-testing-playbook.md"
      - ".skilled/skills/system-skill-advisor/runtime/stress-test/skill-advisor/single-writer-lease-stress.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-011-remaining-limits"
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
| **Spec Folder** | 011-remaining-limits |
| **Completed** | 2026-10-17 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Four checks now report what is true. A git advisory adapter that exports its plugin by name reads as registered. The drift guard's warnings name only spec research records, not throwaway scratch. The Skill Advisor playbook names real paths. The lease stress test fails on a hang, not on a slow CI runner.

### Phase 11: remaining-limits

- **Identifier default export** (`git-setup-check.cjs`, `findTopLevelBindingDeclaration()`). `/doctor:git setup` now follows `export default plugin;` to the top-level declaration of `plugin`, as a function declaration, a function expression, an arrow or an object literal, and applies the same OpenCode and Pi rules it applies to an inline export. A declaration nested in a function and an imported identifier still read as unregistered. The battery still reads the source and never executes it.
- **Drift guard noise** (`verify_alignment_drift.py`, `is_unscanned_record_path()`). Files under `scratch/` and `z_archive/` below `specs/` are no longer scanned, the same way spec `evidence/` folders already were. The same folders outside `specs/` are still scanned. Five real files gained the line the guard asked for, the 14 sk-doc fixture stand-ins gained a shebang and docstring, and the ignored sk-vision build bundle left the index.
- **Advisor playbook** (`system-skill-advisor/manual-testing-playbook/`). Ten backticked paths now name real files, and the index carries the result-persistence marker from the playbook template.
- **Lease stress budget** (`single-writer-lease-stress.vitest.ts`). The 10-way race may take up to 2,000 ms instead of 250 ms. The exactly-one-winner assertions are unchanged.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/doctor/scripts/git-setup-check.cjs` | Modified | Resolve an identifier default export, share the body check |
| `.skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs` | Modified | Four form tests and one negative test |
| `.skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify_alignment_drift.py` | Modified | Skip `scratch` and `z_archive` below `specs/` |
| `.skilled/skills/sk-code/sk-code-opencode/assets/scripts/test_verify_alignment_drift.py` | Modified | Spec scratch and archive skip test |
| `.skilled/skills/mcp-code-mode/mcp-server/scripts/check-node.cjs` | Modified | `'use strict';` |
| `.skilled/skills/sk-design/shared/scripts/render-screenshots.cjs` | Modified | `'use strict';` |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/generate-router-intent-signals.cjs` | Modified | `'use strict';` |
| `.skilled/skills/sk-doc/scripts/validate-doc-model-refs.js` | Modified | `'use strict';` |
| `.skilled/skills/sk-doc/scripts/tests/test_template_version_seed.py` | Modified | Canonical shebang |
| `.skilled/skills/sk-doc/scripts/tests/code-folder/**/*.py` (14 files) | Modified | Shebang and docstring |
| `.skilled/skills/sk-vision/hooks/opencode/sk-vision.js` | Untracked | Staged index removal, the file stays on disk |
| `.skilled/skills/system-skill-advisor/manual-testing-playbook/` (9 scenario files) | Modified | Real paths |
| `.skilled/skills/system-skill-advisor/manual-testing-playbook/manual-testing-playbook.md` | Modified | Result-persistence marker |
| `.skilled/skills/system-skill-advisor/runtime/stress-test/skill-advisor/single-writer-lease-stress.vitest.ts` | Modified | 2,000 ms budget and its reason |
| `specs/sk-git/033-git-setup-customization/spec.md` and `graph-metadata.json` | Modified | Phase 11 row, handoff row and child entry |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Luna (`gpt-6-luna`, max, fast) made every code and doc edit outside this folder in eight dispatches, one at a time, and all eight wrote what their brief asked. The orchestrator diffed each result against its brief, reran its tests outside the sandbox and checked each fix. One dispatch, 2b, put back the docstring's reason for skipping `evidence`, which the first verifier edit had dropped. The orchestrator untracked the sk-vision bundle itself, since that is an index change rather than an edit.

Mutation checks, each with the original source swapped back in and then restored:
- Item 1: with the old function, the four form tests fail and the negative test passes. With a mutation that accepts any resolved identifier, the negative test fails. An independent 29-case probe passes on the new code and fails the 8 identifier cases on the old one.
- Item 2: with the old rule, the new verifier test fails because `specs/demo/001-x/scratch/run.sh` is discovered.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Skip only `scratch` and `z_archive` below `specs/` | Scanning spec code is deliberate: the verifier already skipped spec `evidence` and gave the reason. A whole-`specs/` skip would drop the eight research records a reader may still want flagged. |
| Fix the 14 fixture stand-ins instead of excluding their tree | They are not meant to break Python rules. Each holds two lines that exist only to make a folder count as code, and the README validator lists their names without reading them (`validate_document.py:1018`). |
| Untrack the sk-vision bundle instead of editing it | It is a build artifact that `sk-vision/.gitignore:4` lists and `hooks/README.md:66` calls gitignored, and nothing loads it: both plugin links point at `vision-runtime/dist/plugin.js`. A hand edit would be lost on the next build. |
| Only top-level declarations count for an identifier export | `export default plugin` names the module-scope binding, so a declaration nested in a function is a different binding. |
| Change only the lease test's budget | In the last 15 stress runs, it was the only timing failure, and the other 63 tests passed in both failed runs. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `run-all.sh` (doctor) | 7 suites passed. node:test 348/348 before, 353/353 after |
| `git-setup-check.test.cjs` | 59/59 before, 64/64 after |
| `git-setup-check.cjs --tool=claude` / `--tool=hermes` | `STATUS=OK checks=11` both |
| `single-writer-lease-stress.vitest.ts` | 5 runs, 3/3 each |
| `run-all-drift-guards.sh` | all 4 guards PASSED, 278 warnings before, 8 after |
| `test_verify_alignment_drift.py` | 28 OK before, 29 OK after |
| `validate-playbook-package.cjs --package system-skill-advisor` | `violations=0 warnings=11` before, `violations=0 warnings=0` after |
| `validate-playbook-package.cjs` (fleet) | 52 PASS, 5 SKIP, 0 FAIL before and after. Warnings 100 before, 89 after |
| `validate-playbook-package.test.cjs` | 1/1 before and after |
| sk-doc fixture tests | code-folder `failures=0`, verdict parity PASS, manifest reproducible, template seed 3 passed, before and after |
| `sync-runtime-mirrors.cjs --check` | PASS: 185 mirrors across 8 trees |
| `sync-skills-hermes.cjs --check` | PASS: 68 |
| `compiled-route-guard.cjs` | all hubs fresh or excused, exit 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Eight drift warnings remain.** They sit on spec research and test records outside `scratch/` and `z_archive/`: one `pi-dedup-test.cjs` under `specs/hooks/`, four `.executor-state` scripts and one `verify.cjs` and one `assemble-research.sh` in research lineages, and one `run-iterations.sh`. None is a shipped file.
2. **The lease timing failure does not reproduce locally.** The old 250 ms budget passed three of three runs here, so the evidence for the cause is the two CI logs, at 414.7 ms and 431.8 ms.
3. **The adapter check still misses a few shapes.** A single-parameter arrow without parentheses (`pi => {}`), an inline default-exported arrow with a return type and a `var` declared inside a top-level block read as unregistered. A probe of each confirmed it. A resolved arrow with a return type does read as registered.
4. **The sk-vision removal is staged, not committed.** `git restore --staged .skilled/skills/sk-vision/hooks/opencode/sk-vision.js` undoes it.
<!-- /ANCHOR:limitations -->

---
