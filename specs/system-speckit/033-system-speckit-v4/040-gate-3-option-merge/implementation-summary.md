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
    packet_pointer: "system-speckit/033-system-speckit-v4/040-gate-3-option-merge"
    last_updated_at: "2026-09-15T00:00:00Z"
    last_updated_by: "implementation"
    recent_action: "Merged Gate 3 options C/D, relabeled Skip E to D, repo-wide"
    next_safe_action: "None — packet closed"
    blockers: []
    key_files:
      - "AGENTS.md"
      - ".opencode/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs"
      - ".opencode/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.test.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 040-gate-3-option-merge |
| **Completed** | 2026-09-15 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Gate 3 offered five options where two, "Update related" and "Extend phased packet," meant the same
thing: use another existing packet rather than the current one. The two now merge into one, "C)
Related," and Skip moves from E to D, so the menu a user or a runtime sees, types back, and gets
parsed against is a stable four letters everywhere it appears.

### Phase 1: gate-3-option-merge

Anyone answering Gate 3 with a bare letter no longer has to guess whether their related work is a
plain related spec or a phase child of one — both are "C" now, worded to cover a related packet, a
specific child under an existing phase parent, or a related standard packet decomposed into
phases. Skip is "D." The letter-recognition parser in the spec-gate hook narrowed its accepted
range from a-e to a-d to match: a bare fifth letter no longer has a menu meaning to attempt, so it
stops registering as an answer instead of being silently misread.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `AGENTS.md` | Modified | Root option text: five options collapsed to four |
| `.opencode/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs` | Modified | `GATE_3_QUESTION`, `GATE_3_DENY_DETAIL`, and every letter-recognition regex (renamed `STANDALONE_LETTER_E_REGEX` to `STANDALONE_LETTER_D_REGEX`, narrowed the accepted and alternative-option letter ranges) |
| `.opencode/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.test.mjs` | Modified | Both answer corpora rewritten; every direct call site naming a letter updated; added a bare-D-binds-skip and a bare-E-no-longer-registers case |
| `.opencode/skills/system-spec-kit/shared/gate-3-classifier.ts` | Unedited (confirmed) | Reads `satisfiedBy`/`prior_answer`, never an option letter; its test suite re-run unmodified |
| 19 command asset files under `.opencode/commands/{create,deep,speckit}/assets/` | Modified | Restated option lists, in each file's own format (YAML prose, presentation.txt Q&A blocks, ASCII lists) |
| 3 command files (`review.md`, `ai-council.md`, `research.md`) under `.opencode/commands/deep/` | Modified | Drift the planning-time inventory had not caught; same wording swap |
| `.opencode/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs` | Modified | The generator for the 3 compiled deep-loop contracts (found via search, not assumed) |
| 3 compiled contracts under `.opencode/commands/deep/assets/compiled/` | Regenerated | Via `node compile-command-contracts.cjs --command deep/<mode> --write`, not hand-edited |
| `.opencode/hooks/injection-contract.md`, `child-dispatch-preamble.md`, `prompt-pack-iteration.md.tmpl` | Modified | `A/B/C/D/E` shorthand relabeled to `A/B/C/D` |
| `.opencode/skills/system-spec-kit/references/{validation/decision-format.md,memory/trigger-config.md,workflows/worked-examples.md,workflows/quick-reference.md}`, `SKILL.md`, `runtime/hooks/pi/README.md` | Modified | Reference docs and the quick-reference priority/recommendation logic realigned to the merged four-option contract |
| `README.md` | Modified | Gate 3 pipeline-diagram box collapsed to one line |
| `.opencode/skills/system-skill-advisor/runtime/tests/parity/fixtures/policy-plan/baseline-contexts.json` | Modified | `"gate"` field now holds the exact new `GATE_3_QUESTION` string |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Read the spec/plan/tasks/acceptance-criteria contract first, then AGENTS.md and the hook plus its
test in full before editing either. Ran the inventory grep given in the task brief before touching
anything, which found 43 files against the plan's estimated 31 (drift: three `.opencode/commands/
deep/*.md` command files, several skill/hook reference docs, and two benchmark/evidence files).
Edited the hook and its test first (the contract itself), then every other surface in its own
format, then searched for and found the generator behind the compiled deep-loop contracts and
regenerated them instead of hand-editing. Left three dated, captured-transcript files untouched as
historical evidence (see Known Limitations). Verified with the hook's own test suite, the
classifier's existing test suite (confirmed unedited), the deep-loop contract-drift and
contract-compile test suites, a repeat of both inventory greps, the `CLAUDE.md` symlink check, and
`git diff --stat` scoped to the exact 42-file edit list to confirm no unrelated file changed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Narrow the accepted letter range from a-e to a-d, and the alternative-option range from a-d to a-c | The menu itself shrank to four letters; a bare fifth letter no longer has a meaning to recognize, so continuing to accept it would silently misread prose that merely starts with "E" as an answer attempt |
| Regenerate the 3 compiled deep-loop contracts via their generator instead of hand-editing | `compile-command-contracts.cjs` writes those files from source digests; a hand edit would be silently overwritten on the next regeneration and would desync the embedded digests |
| Leave `codex-hook-parity.md` and the two `2026-07-21--playbook-verify--sonnet` benchmark reports untouched | Each embeds a dated, captured transcript of a real prior run — including the model's own literal reply text and the tool's actual emitted JSON/text — presented as evidence of what happened, not as a restatement of the current contract; editing them would misrepresent history, the same rationale `spec.md` gives for excluding spec-folder archives |
| Update the `quick-reference.md` recommendation-priority sentence by letter substitution rather than collapsing its four-tier logic | The underlying priority order (phase-workstream fit, then current-packet fit, then another related packet, then new/unrelated) still matters for which folder gets suggested, even though two of its tiers now render the same letter "C" |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --test spec-gate-core.test.mjs` | PASS — tests 90, pass 87, fail 0, skipped 3 (pre-existing `--experimental-test-module-mocks` skips), exit 0 |
| `npx vitest run cli/tests/gate-3-classifier.vitest.ts --config ../vitest.config.ts` | PASS — Tests 62 passed (62), exit 0; classifier source confirmed unedited |
| `npx vitest run tests/unit/compile-command-contracts.vitest.ts` | PASS — Tests 12 passed (12) |
| `npx vitest run tests/unit/check-contract-drift.vitest.ts` | PASS — Tests 8 passed (8), confirming the regenerated compiled contracts match their sources |
| Inventory grep (`Update related\|Extend phased packet\|E\) Skip\|A/B/C/D/E\|A-E\b\|Use a phase folder`) | 3 files remain, all deliberately excluded historical evidence (see Known Limitations) |
| Narrow grep (`\bE\) Skip\b\|\(A/B/C/D/E\)\|letter A-E\b`) | Hits only inside the same excluded playbook file |
| `test -L CLAUDE.md && [ "$(readlink CLAUDE.md)" = "AGENTS.md" ]` | PASS |
| `node .../sync-gate1-pointers.cjs --check` | PASS — "2 instruction files carry the root Gate 1 lookup" |
| `git diff --stat` scoped to the 42 edited files | 42 files changed, matching the intended edit list exactly; no unrelated file touched |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Three files still show the old five-option text on purpose.** `.opencode/skills/cli-external-
   orchestration/manual-testing-playbook/plugins-and-hooks/codex-hook-parity.md` and the two
   `benchmark/reports/compiled-routing/2026-07-21--playbook-verify--sonnet/report.{md,json}` files
   each embed a dated, captured transcript of a real `codex exec` or benchmark run from before this
   merge, including literal quoted output (the model's own "I'm using option E" reply, and the
   tool's actual emitted JSON/text). These are historical evidence records, not descriptions of the
   current contract, so they were deliberately left unedited rather than silently corrected — the
   same reasoning `spec.md` gives for excluding spec-folder archives, applied here by content rather
   than by directory. No workaround needed; a future session touching those files for an unrelated
   reason should preserve this same distinction.
<!-- /ANCHOR:limitations -->

---
