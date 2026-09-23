---
title: "Implementation Summary: Phase 51: Save writer continuity fields"
description: "A full-auto save now writes the continuity fields it carries into the packet that holds the work, keeps every ancestor's pointer leading there, and passes strict validation straight after with no repair step."
trigger_phrases:
  - "implementation summary"
  - "save writer continuity fields"
  - "continuity write evidence"
  - "phase parent save routing"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/051-save-writer-continuity-fields"
    last_updated_at: "2026-09-23T17:10:55Z"
    last_updated_by: "generate-context"
    recent_action: "Closed the phase with the full gate green"
    next_safe_action: "Await operator approval to commit this phase"
    blockers: []
    key_files:
      - ".skilled/skills/system-spec-kit/runtime/cli/core/workflow.ts"
      - ".skilled/skills/system-spec-kit/runtime/cli/continuity/generate-context.ts"
      - ".skilled/skills/system-spec-kit/runtime/lib/continuity/thin-continuity-record.ts"
      - ".skilled/skills/system-spec-kit/runtime/cli/tests/save-continuity-write.vitest.ts"
      - ".skilled/skills/system-spec-kit/references/memory/save-workflow.md"
    session_dedup:
      fingerprint: "sha256:f03d303615fdd05d6674cb6f957b7a7fcfe845506cb8d46bce472841b20476b7"
      session_id: "fb879d4c-5543-4760-8339-b0f3499f278d"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 051-save-writer-continuity-fields |
| **Completed** | 2026-09-23 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`/speckit:save` writes continuity again. Since the memory engine was removed, the writer ignored every continuity field it was given, so each packet's resume state was whatever someone last typed by hand, and a save could fail its own strict validation. A full-auto save now validates the fields it carries, writes them into the packet that holds the work, and leaves the generated metadata fresh enough to pass `validate.sh --strict` straight after.

### Continuity from the save payload

Put `recent_action`, `next_safe_action`, `blockers`, `key_files`, `completion_pct`, `open_questions` or `answered_questions` in the save JSON, in snake_case or camelCase, and a `--full-auto` save writes them into the leaf's `_memory.continuity` block with its own timestamp and actor. A field you leave out keeps its stored value while that value still validates; a stored value that fails is dropped and named in the output. A payload value that fails stops the save before it writes any file. Plan-only saves accept the fields and say that only a full-auto save writes them.

### Saves aimed at a phase parent

A phase parent has no summary of its own, so a save aimed at one finds the child that holds the work. At each level it follows the payload's file paths when they all sit inside one child, and the parent's pointer only when no path does. Paths spread across two children resolve nothing: the save writes no continuity, leaves every pointer as it was, and lists the candidates. After a leaf save, every phase-parent ancestor, up to five levels and never the specs root itself, points one level down toward that leaf, so a resume from any of them lands on it.

### A save that validates straight after

The graph refresh hashes the packet's docs, so any doc write after it left the stored hash stale and failed the next strict run with `SOURCE_FINGERPRINT_MISMATCH`. The continuity write and the completion fingerprint stamp now land before the refresh, each through a temp file and a rename. The continuity upsert also stopped rewriting the rest of the frontmatter: it replaces only the `_memory` block, where it used to re-serialize every field and damaged 17 of 421 real summaries in a dry run.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/cli/utils/input-normalizer.ts` | Modified | Accepts the seven fields and their camelCase spellings, and carries them through both normalizer paths |
| `runtime/cli/types/session-types.ts` | Modified | Carries the normalized fields in the collected save data |
| `runtime/cli/core/workflow.ts` | Modified | Plans and validates the continuity write before any file changes, writes it, stamps, then refreshes the graph |
| `runtime/cli/continuity/generate-context.ts` | Modified | Leaf resolution for parent saves, the ancestor pointer walk, canonical paths and the `--help` section |
| `runtime/cli/core/memory-metadata.ts` | Modified | Atomic fingerprint stamp, called inside the workflow |
| `runtime/lib/continuity/thin-continuity-record.ts` | Modified | Upsert rewrites only the `_memory` block |
| `runtime/lib/resume/resume-ladder.ts` | Modified | One pointer step shared by the resume ladder and the writer |
| `runtime/api/index.ts` | Modified | Exposes the pointer step and the continuity reader and upsert to the writer |
| `runtime/cli/evals/import-policy-allowlist.json` | Modified | Lets the save test call the resume ladder's full walk |
| `runtime/cli/tests/save-continuity-write.vitest.ts` | Created | End-to-end saves against an anchored temp workspace |
| `runtime/cli/tests/` (three suites) and `runtime/tests/thin-continuity-record.vitest.ts` | Modified | Field acceptance, the changed parent-save pointer case, the moved stamp case, and a byte-for-byte frontmatter check |
| `.skilled/commands/speckit/save.md` | Modified | Names the fields, the full-auto condition and parent routing |
| `references/memory/save-workflow.md` | Modified | Continuity field table, writer contract rows and the rewritten parent routing section |

Paths without a leading `.skilled/` are under `.skilled/skills/system-spec-kit/`.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each behaviour was built against a test that runs the real command-line entry point over an anchored temporary workspace with a track, a parent, a child parent, a leaf, a sibling and a root-level parent, with the telemetry store redirected into the temp directory. A dry run of the upsert over 421 real summaries came first and exposed the frontmatter damage, which was fixed at the upsert before the writer used it. The finished writer was then run once from `dist` on packet `sk-doc/057-sk-create-changelog-v4-style`: an edit to its summary, a full-auto save and a strict validation, after which the four files the save touched were restored with `git checkout` and `git status` matched the snapshot taken before the run. Nothing is committed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep valid stored fields, drop invalid ones and name them | 57 of 60 sampled blocks fail the validator, so failing the save on any stored defect would block almost every packet. Only an invalid `recent_action` or `next_safe_action` the payload does not replace fails the save |
| Payload paths outrank the pointer at every level | The pointer has no time window in the runtime ladder, so an old pointer to an existing child always looks valid, while the paths describe this save's own work |
| Write continuity only under `--full-auto` | The command's default mode promises a plan without mutation |
| Fix the upsert at its source | The opt-in pre-compaction snapshot calls the same upsert and had the same frontmatter damage; patching around it in the writer would have left that caller exposed. Its code is unchanged, and it now leaves the rest of the frontmatter alone too |
| Stop the ancestor walk below the specs root | The phase-parent check counts the specs root as a parent, so an unbounded walk would rewrite `specs/graph-metadata.json` on every save |
| Allowlist the save test's resume-ladder import | The test needs the real five-level walk to prove a resume lands on the saved leaf, and exporting it only for a test would break the API rule that every export has a named caller |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npm run typecheck` (shared, runtime, cli) | PASS, exit 0 |
| `runtime/cli` `npm run check` (lint, import policy, API and architecture boundaries, allowlist expiry, source and dist alignment, AST checks) | PASS, exit 0 |
| Full vitest suite, both projects, run before the three pointer-refusal cases were added | 2,736 passed, 2 failed, 32 skipped of 2,770. `dist-freshness` flagged `thin-continuity-record.ts` by file time after a restore; a forced rebuild produced byte-identical output and the test then passed 4 of 4. `opencode-plugins-folder-purity` and `spec-gate-pi-extension` fail importing the `dist` of `sk-communication/cli-communication-projection` and `system-skill-advisor/runtime`, which this worktree has not built and this phase does not touch |
| New and changed suites (`save-continuity-write`, `input-normalizer-unit`, `phase-parent-pointer`, `spec-root-phase-pointer`, `generate-context-cli-authority`, `phase-status-from-payload`, `thin-continuity-record`) | PASS, 65 of 65 in the CLI project and 6 of 6 in the root project, rerun after the pointer-refusal cases were added |
| `shared` tests, `test:legacy`, `test:validation` | PASS: 18 of 18; exit 0; exit 0 with 84 of 84 in the main validation suite and 0 failed in the others |
| CI mirror checks (runtime mirrors, Codex agents and prompts, agent roster, command catalog, hook registrations, Gate 1 pointers) | PASS, all seven |
| Real packet: edit, `--full-auto` save, `validate.sh --strict` on `sk-doc/057-sk-create-changelog-v4-style` | PASS: save exit 0, `RESULT: PASSED`, Errors 0, no `SOURCE_FINGERPRINT_MISMATCH`; reverted, status identical |
| Real packet with an invalid `next_safe_action` | Save exits 1 with `MEMORY_007` and writes nothing |
| Negative control on the pointer-refusal cases | With the child-shape check disabled in the compiled pointer step, the case whose pointer climbs out of the parent fails; restored byte for byte, 15 of 15 pass |
| Hermes skill and prompt sync checks | PASS, 70 skills and 33 prompts in sync |
| sk-doc `validate_document.py` on `save.md` and `save-workflow.md` | PASS, 0 issues each |
| `validate.sh --strict` | This phase: `RESULT: PASSED`, 0 errors and 0 warnings, straight after its own save. Parent run: the parent itself and 52 of its 53 children pass; `030-spec-kit-simplification-research` fails `SPECDOC_SUFFICIENCY_005` on a 6,498-character `goal.md`, a folder this phase does not touch |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Flow-style lists in a stored block are dropped.** The continuity reader parses `blockers: ["x"]` as a string, which fails validation, so the save drops the field and names it. Block-style lists survive.
2. **Two of 421 summaries cannot be saved to.** Their `_memory` blocks hold question-and-answer mappings the reader cannot parse, so the save fails and names the block rather than overwrite content it cannot read.
3. **The save and the resume command can disagree on an old pointer.** The writer shares the runtime ladder's pointer rule, which has no time window, while the `/speckit:resume` workflow redirects only within 24 hours.
4. **Plan-only mode still refreshes `graph-metadata.json`.** This predates the phase and is recorded in the spec as out of scope.
<!-- /ANCHOR:limitations -->

---
