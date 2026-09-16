---
title: "Implementation Summary: guard-index-and-parent-doc-fixes"
description: "The sk-code drift guard passes again, the trigger index no longer admits fan-out lineages wherever the runner writes them, and this packet's parent documents are filled in and within budget, each fixed where the defect was produced."
trigger_phrases:
  - "guard index fixes summary"
  - "drift guard passes again"
  - "trigger index regenerated lineages"
  - "parent documents filled"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/049-deep-loop-alignment-review/017-guard-index-and-parent-doc-fixes"
    last_updated_at: "2026-09-16T20:30:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Verified the three fixes and regenerated the trigger index"
    next_safe_action: "Commit when the operator asks"
    blockers: []
    key_files:
      - ".opencode/skills/sk-code/sk-code-opencode/assets/scripts/verify_alignment_drift.py"
      - ".opencode/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs"
      - "specs/system-deep-loop/049-deep-loop-alignment-review/goal.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "049-017-guard-index-fixes"
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
| **Spec Folder** | 017-guard-index-and-parent-doc-fixes |
| **Completed** | 2026-09-16 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Three checks were wrong about things they were never meant to judge. The drift guard read generated Hermes copies as authored skills, the trigger index's corpus read fan-out lineages as documents whenever they sat outside a `research` folder, and this packet's parent documents still said what the template said. Each is now fixed where it went wrong.

### Phase 17: guard-index-and-parent-doc-fixes

The dead-route check skips any `SKILL.md` carrying the generated-copy marker, because that copy holds only `SKILL.md` by design and the canonical skill it names is checked by the same walk. Clearing those 928 false reports exposed one real finding they had buried, a missing shebang on the Hermes plugin, which now follows house style. The corpus walker prunes every `lineages` directory under `specs/`, whatever artifact directory the runner wrote it into, and the index is regenerated under that rule. The parent spec's template leftovers are replaced with what is true of the packet, and the parent goal's durable slice is back within its budget.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-code/sk-code-opencode/assets/scripts/verify_alignment_drift.py` | Modified | Skip generated skill copies in the dead-route check |
| `.opencode/skills/sk-code/sk-code-opencode/assets/scripts/test_verify_alignment_drift.py` | Modified | Regression test for a generated copy |
| `.hermes/plugins/repo-guards/__init__.py` | Modified | House-style shebang |
| `.opencode/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs` | Modified | Prune `lineages` under `specs/` whatever the parent |
| `.opencode/skills/system-spec-kit/runtime/cli/tests/retrieval-coverage-parity.vitest.ts` | Modified | Probes and divergence entry for the widened rule |
| `.opencode/skills/system-spec-kit/references/retrieval/retrieval-conventions.md` | Modified | Section 9 divergence row |
| `.opencode/skills/system-spec-kit/runtime/data/trigger-index.json` | Regenerated | Current corpus under the corrected rule |
| `.opencode/skills/system-spec-kit/runtime/cli/retrieval/fixtures/*.json` | Regenerated | Manifest, diagnostics and variants beside the index |
| `specs/system-deep-loop/049-deep-loop-alignment-review/spec.md` | Modified | Template leftovers replaced |
| `specs/system-deep-loop/049-deep-loop-alignment-review/goal.md` | Modified | Durable slice within budget; deviation logged |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each fix followed the same order: find the producer, write a test that fails on the defect, change the producer, re-run the suite. The drift guard's cause was the marker every copy already carried and the verifier never read. The trigger index's cause was a pruning rule scoped to a `research` parent when the fan-out runner writes lineages into any directory it is given; every one of the 380 `lineages` directories under the corpus roots was checked and all are fan-out output. The index was regenerated only after this phase's own documents existed, then audited path by path. The parent goal belongs to the session that ran this packet's review, so every decision and criterion was kept, wording was tightened rather than removed, and the phase 16 and 17 deviation from D2 is logged.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Match the generated-copy marker rather than the `.hermes` path | `.hermes` also holds authored Python the language checks must keep covering, and the marker is what declares a file a copy |
| Fix the plugin's shebang rather than exempt `__init__.py` | All 56 Python files under `.opencode` carry it, and the standard says always |
| Scope the widened lineage rule to `specs/` | Every fan-out lineage lives there, and outside it an unrelated `lineages` directory still gets walked, as the rule always promised |
| Keep the research-parent rule alongside it | Replacing it would narrow the rule for any `research/lineages` outside `specs/` |
| Drop the template blockquote from the goal but keep `HVR_REFERENCE` | 204 of 246 goal files carry no blockquote, while 218 keep the reference |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Verifier suite | PASS: 18 passed before; the new test failed before the skip; 19 passed after |
| Hermes plugin suite | PASS: 42 passed before and after the shebang |
| `run-all-drift-guards.sh` | PASS: exit 1 with 929 errors before, exit 0 with both guards passing after |
| Retrieval and trigger suites | PASS: 75 passed before; the new probes failed before the rule; 199 passed and 1 skipped across 12 files after regeneration |
| Regenerated trigger index | PASS: 14,901 to 15,266 paths, 0 lineage paths under `specs/`, 10 untracked paths all in phases 016 and 017; the 30 removals are 26 pruned lineages and 4 deleted files |
| Lookup smoke test | PASS: "trigger index lineage exclusion" returns this phase's spec as an exact match |
| Comment hygiene on the five changed code files | PASS: clean |
| `validate_document.py` on the conventions document | PASS: 0 issues |
| Parent goal durable slice | PASS: 3,992 to 2,985 characters; D1 to D4, the binding and six criteria intact |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The drift-guard gate has two guards, not three.** The wrapper records its third guard, a router-sync suite, as retired with its lane, while the wrapper's header and the sk-code surface text still describe three.
2. **The goal template consumes most of its own budget.** An unfilled template's durable slice is 2,644 of the 3,000-character warning budget, and 61 goal files are over it.
3. **Containment snapshots nest.** A lineage's containment baseline can copy other lineages' containment directories, producing deeply recursive snapshot trees. The widened rule keeps them out of the index, but they still accumulate on disk.
<!-- /ANCHOR:limitations -->
