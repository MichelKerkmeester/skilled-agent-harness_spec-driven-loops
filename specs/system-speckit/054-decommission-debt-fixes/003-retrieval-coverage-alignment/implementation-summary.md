---
title: "Implementation Summary: Phase 3: retrieval-coverage-alignment"
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
    packet_pointer: "system-speckit/054-decommission-debt-fixes/003-retrieval-coverage-alignment"
    last_updated_at: "2026-09-05T06:13:06Z"
    last_updated_by: "claude-code"
    recent_action: "Converged scratch exclusion, widened trigger-index roots, added parity test"
    next_safe_action: "Proceed to phase 004; consider a follow-up for the two flagged divergent lists"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-003-retrieval-coverage-alignment"
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
| **Spec Folder** | 003-retrieval-coverage-alignment |
| **Completed** | 2026-09-05 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The trigger-index corpus walker and the documented ripgrep recipes drifted onto two independent exclusion and root policies with nothing to catch the gap. One coverage decision now governs both lanes explicitly, the exclusions that can safely converge do, the two that cannot are named with a reason, and a parity test keeps the agreement from drifting again.

### Retrieval Coverage Alignment

`.opencode/install-guides` joins the trigger-index corpus (it already carried well-formed `trigger_phrases` frontmatter and ripgrep already reached it - the trigger index missing it was a pure asymmetry). Root `README.md` and the five runtime mirrors (`.claude`, `.codex`, `.cursor`, `.devin`, `.pi`) join neither lane. The `scratch` exclusion converges into the ripgrep lane's code and documented recipes, matching the trigger index, the repository's own scratch convention, and the existing `sweep-memory-residue.mjs` precedent. `research/lineages` and fixture-named directories outside `specs/` stay a documented, reasoned divergence: both hold real content (thousands of lineage transcripts, 279+ real spec documents under fixture-named packet folders) that ripgrep's free-text lane must keep reaching, while the trigger index's narrower exclusion protects its curated phrase index from a different, index-specific noise concern.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/scripts/retrieval/lib/corpus.mjs` | Modified | Widened `CORPUS_ROOTS` to add `.opencode/install-guides`; exported `EXCLUDED_DIR_NAMES`/`FIXTURE_DIR_PATTERN` for the parity test |
| `.opencode/skills/system-spec-kit/scripts/retrieval/lib/rg-lane.mjs` | Modified | Added the converged `scratch` exclusion glob to `GLOBS` |
| `.opencode/skills/system-spec-kit/scripts/retrieval/rg-wrapper.mjs` | Modified | Mirrored the same `scratch` exclusion glob |
| `.opencode/skills/system-spec-kit/references/retrieval/retrieval-conventions.md` | Modified | Added `scratch` to every Section 2 recipe; added Section 9 (coverage and exclusion policy) with the full root/exclusion table |
| `.opencode/skills/system-spec-kit/scripts/retrieval/README.md`, `lib/README.md` | Modified | Reflect the widened root and the new exclusion; new test file added to the validation list |
| `.opencode/skills/system-spec-kit/scripts/tests/retrieval-coverage-parity.vitest.ts` | Created | Root/exclusion parity test with a proven negative control |
| `.opencode/skills/system-spec-kit/scripts/tests/rg-wrapper-recipes.vitest.ts` | Modified | Updated three hardcoded glob expectations; added a scratch-exclusion fixture and assertion |
| `.opencode/skills/system-spec-kit/scripts/tests/trigger-index.vitest.ts` | Modified | Added coverage for the new `.opencode/install-guides` root |
| `.opencode/skills/system-spec-kit/scripts/retrieval/fixtures/corpus-manifest.json`, `generation-diagnostics.json`, `phrase-variants.json`, `runtime/data/trigger-index.json` | Regenerated | Reflect the widened root and converged exclusion |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Read both lanes' real source (`corpus.mjs`, `rg-lane.mjs`, `rg-wrapper.mjs`, `retrieval-conventions.md`) rather than trusting the spec's already-drafted table, then measured the real-world blast radius of each candidate convergence directly against the repository: `scratch` (1,180+ directories, all ephemeral per repo convention, zero legitimate content) converged cleanly; `research/lineages` (2,369 real transcript documents) and fixture-named directories (279+ real spec documents) did not - converging either would have silently regressed real, currently-reachable content, so both were left as documented divergences instead. Every conditional exclusion was probed at both branches (inside/outside `specs/`, under/not-under a `research` parent) before being written into the divergence table, and the parity test imports the real `EXCLUDED_DIR_NAMES`/`FIXTURE_DIR_PATTERN` policy rather than a hand-copied guess, so a future addition to either fails the test automatically instead of drifting in silently - proven with a temporary injected divergence that failed loudly, named the exact entry, and reverted clean.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| `.opencode/install-guides` joins the trigger-index corpus | Already well-formed and already reachable by ripgrep; the omission was asymmetry, not a scope choice |
| Root `README.md` and the five runtime mirrors join neither lane | No `trigger_phrases` convention on the README; the mirrors are mostly symlinked duplicates of already-indexed content plus CLI sync-mechanics docs, not retrieval content |
| Converge `scratch` into the ripgrep lane | Zero-risk: unconditionally ephemeral by repo convention, already excluded by the trigger index and by `sweep-memory-residue.mjs` |
| Leave `research/lineages` and fixture-directories as a documented divergence rather than converging | Measured against the real corpus: converging would regress 2,369 and 279+ real documents respectively; the trigger index's exclusion reason (protecting a curated phrase index) does not apply to a raw evidence scan |
| Export `EXCLUDED_DIR_NAMES`/`FIXTURE_DIR_PATTERN` from `corpus.mjs` | Lets the parity test walk the real policy instead of a hand-copied guess, so a future addition on either side fails loudly instead of drifting in |
| Flag but do not touch `retrofit-convention.mjs`'s own `EXCLUDED_DIR_NAMES` and `sweep-memory-residue.mjs`'s own `EXCLUDE_GLOBS` | Neither is "the trigger-index corpus walker" or "the documented ripgrep recipes" this phase's Problem Statement names; recorded as a fourth and fifth divergent list for a future packet rather than absorbed here |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --check` on all three edited `.mjs` files | Pass |
| `generate-trigger-index.mjs --json` run twice consecutively (post-change) | Identical `indexSha256 959b3263cecdae12c1b23bc99141b29f302b1c7d20bcffcaaadbb30def535790` and `manifestHash` both runs |
| Isolated root-change diff (`walkCorpus` with old vs. new root list, same tree) | Exactly 2 documents added (`.opencode/install-guides/README.md`, `install-scripts/README.md`), both `ok` category, 0 new malformed |
| `lookup-trigger-index.mjs --json -- "trigger index"` | Exit 0, 20 results |
| `lookup-trigger-index.mjs --json -- "install guides"` | Exit 0, `.opencode/install-guides/README.md` scores `exact` |
| `scripts/tests/retrieval-coverage-parity.vitest.ts` | 7/7 pass |
| Negative control: temporary undocumented exclusion injected into `EXCLUDED_DIR_NAMES` | Parity test failed, named the exact entry (`undocumented-temp-dir`); reverted byte-identical; reran clean |
| `trigger-index.vitest.ts`, `rg-wrapper-recipes.vitest.ts`, `grep-convention.vitest.ts`, `grep-convention-rule.vitest.ts`, `sweep-memory-residue.vitest.ts`, `retrofit-convention-pipeline.vitest.ts`, `optimizer-replay-corpus.vitest.ts`, `retrieval-coverage-parity.vitest.ts` | 244/244 pass |
| `validate_document.py` on both changed READMEs | 0 issues each |
| `rg -n "phase\|retrieval-coverage-alignment"` over every changed `.mjs`/`.vitest.ts` file | 0 hits - no ephemeral artifact labels in code comments or test names |
| `NODE_PRESERVE_SYMLINKS=1 bash scripts/spec/validate.sh <phase folder> --strict` | RESULT: PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Two more divergent exclusion lists exist outside this phase's scope.** `retrofit-convention.mjs` carries its own minimal `EXCLUDED_DIR_NAMES` (`z_archive`, `node_modules` only) and `sweep-memory-residue.mjs` carries its own `EXCLUDE_GLOBS` (six entries including `.worktrees`, which neither of this phase's two lanes touches). Neither is "the trigger-index corpus walker" or "the documented ripgrep recipes" this phase's Problem Statement names, so both were left untouched and are flagged here as a candidate for a future packet.
2. **The Section 4 worked-example counts in `retrieval-conventions.md` were already stale before this phase**, independent of the `scratch` exclusion (confirmed empirically: the phrase `trigger index generator` returns identical counts with and without the new glob). Fixing that pre-existing drift is outside this phase's roots-and-exclusions scope and was left as found.
<!-- /ANCHOR:limitations -->

---
