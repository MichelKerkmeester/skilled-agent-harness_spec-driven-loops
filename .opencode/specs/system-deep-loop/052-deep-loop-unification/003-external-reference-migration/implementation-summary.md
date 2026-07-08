---
title: "Implementation Summary"
description: "Migrated every deep-loop-workflows/deep-loop-runtime reference to system-deep-loop across ~750 files (Stages A-J), regenerated compiled command contracts, re-baselined the advisor routing corpus, fixed several genuine pre-existing/adjacent bugs found along the way, and removed both temporary compat symlinks. Verified via real test runs across two full suites, not assumed complete."
trigger_phrases:
  - "external reference migration implementation summary"
  - "system-deep-loop reference migration complete"
importance_tier: "critical"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/052-deep-loop-unification/003-external-reference-migration"
    last_updated_at: "2026-07-08T12:45:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Doc finalized, all evidence recorded"
    next_safe_action: "Run validate.sh --strict, then hand off to 004/005"
    blockers: []
    key_files:
      - "tasks.md"
      - "plan.md"
      - "checklist.md"
      - "research/stage-a-grep-inventory.txt"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "deep-loop-unification-052-003-scaffold"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-external-reference-migration |
| **Completed** | 2026-07-08 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Completed the reference migration that 002's physical move made necessary: every remaining `deep-loop-workflows`/`deep-loop-runtime` reference across the repo rewritten to `system-deep-loop`, in dependency order (Stages A-J per `plan.md`), landing on a residual grep of 14 files — every one deliberately preserved (a real filename, historical narrative, dual-keyword backward-compat, or a generated artifact deferred by design). Both temporary compat symlinks from 002 removed at the end, with a full two-suite test re-run confirming the timing was safe.

### Files Changed

~750 files touched across this phase (on top of 002's ~1484). Highlights:

| File/Area | Action | Purpose |
|---|---|---|
| `skill_advisor.py`, `aliases.ts`, `explicit.ts`, `lexical.ts`, `fusion.ts` | Edit | Stage C: advisor scorer hardcoded constants (2 files had stale planned paths, corrected live) |
| `mk-deep-loop-guard.js` + test, `parent-skill-check.cjs`, pre-commit + CI workflow, `.gitignore`, 4 doctor assets | Edit | Stage C: remaining hardcoded constants, several new findings beyond the original 7-site plan |
| `mode-registry.json`, `hub-router.json` `skill` fields | Edit | Stage D: deferred-from-002 identity fields |
| `--emit-routing-projection` codegen | Run | Stage D: regenerated `aliases.ts`'s generated block + `skill_advisor.py`'s hash |
| 12 command asset YAMLs, 5 presentation.txt, 3 compiled `.contract.md` | Edit + regenerate | Stage E |
| ~600 files: `manual_testing_playbook/**`, `feature_catalog/**`, `assets/**`, `scripts/**`, `tests/**`, `references/**`, READMEs, `AGENTS.md` | Edit | Stage F (excludes `changelog/**` by design) |
| 5 sibling `graph-metadata.json` files | Edit | Stage G: edge collapse, one phase-002 schema bug fixed along the way |
| `skill-parent.md`, `parent_skills_nested_packets.md`, 2 `create_skill_parent_*.yaml` | Edit | Stage H, with an explicit prefix-exception caveat |
| `labeled-prompts.jsonl`, `ambiguity-prompts.jsonl`, `intent-prompt-corpus.ts`, divergence ledger, 2 `ACCEPTED_PARITY_REGRESSION_IDS` lists | Edit | Stage I: corpus relabel + hand-verified re-baseline |
| `parent-skill-check.cjs`'s `DIRECTORY_ALLOWLIST` | Edit | Stage J: added `runtime` (found via the self-check gate) |
| `.opencode/skills/{deep-loop-workflows,deep-loop-runtime}` | Delete | Stage J/T019: both compat symlinks removed |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Before any edit, dispatched 4 parallel GPT-5.5 (xhigh) verification agents against the live post-002 state — they caught 2 stale file paths in the plan (would have failed on Edit), several undercounted files (`.gitignore`, doctor assets, `.claude/agents/**` — invisible to a default `rg` scan for a reason never fully root-caused, only worked around with `--hidden`), and a sequencing landmine (the scorer's alias-canonicalization constant and the corpus relabel had to land atomically or accuracy checks would show a false catastrophic regression).

1. **Stages C+D executed together, verified against real test runs at each step** — not assumed correct from the plan's tables. A mid-execution bug surfaced: `MERGED_DEEP_SKILL_ID` reverted to its old value between the Stage C.2 edit and the Stage D codegen run. Root cause not fully isolated, but the fix was verified empirically (`--check-routing-projection` returning `"fresh"` only once the value was corrected and confirmed to survive a fresh codegen pass).

2. **Stage I's sequencing landmine materialized exactly as predicted**: after Stage C+D landed, the full advisor suite dropped from 0 to 31 failures — the scorer now predicted the new name while the corpus still said the old one. Fixed by completing Stage I in the same pass (corpus relabel, divergence ledger, both `ACCEPTED_PARITY_REGRESSION_IDS` lists) before re-verifying.

3. **Stage F's ~600-file blanket sweep needed a real self-correction, not silent trust in the sed's exit code.** A bare `deep-loop-runtime` → `runtime/` replacement rule was correct for path segments but wrong for bare identifiers — it mangled the real `deep-loop-runtime.json` filename into `runtime/.json`, JSON config values, YAML search-trigger phrases, and test fixture strings, and it clobbered 3 files (`description.json`, `graph-metadata.json`, `SKILL.md`/`README.md`) that had deliberately-preserved dual-keyword and "formerly the separate deep-loop-runtime skill" historical content from earlier in this same session. Found via a full `runtime/` test-suite run (2 failures) plus a targeted `rg` re-sweep for the specific corruption pattern across every file the sed had touched — not assumed clean because the command exited 0. Every instance individually diagnosed and repaired, including one accidental over-reach into a generated artifact (`skill-graph.json`, deliberately deferred to Stage J) reverted via `git checkout HEAD --`.

4. **Stage E's contract regeneration needed a second pass** after Stage F edited its own source inputs, since the compiled contracts embed source-file digests computed at compile time — a real sequencing dependency not called out in the original plan.

5. **Stage J's `parent-skill-check.cjs` self-check found a genuine, previously-undiscovered gap**: the canonical `DIRECTORY_ALLOWLIST` (shared across every parent hub, not system-deep-loop-specific) never had `runtime` as an allowed non-mode support directory. Fixed once, verified against 3 other hubs (sk-code, sk-design, sk-doc) plus the checker's own fixture tests to confirm zero regression.

6. **The advisor accuracy gate improved, rather than merely holding**, once the whole system became internally consistent (0.3679 → 0.5492 against the same Stage-A threshold) — but this improvement itself cascaded into 2 more rounds of hand-verified divergence-ledger and regression-ID updates as later fixes (lexical/explicit-lane) resolved entries that had been correctly flagged as divergent just steps earlier. Each resolution was hand-verified against the live scorer output, not mechanically accepted.

7. **Symlink removal was deliberately deferred past the original mid-phase checkpoint** once a broader live-code-path scan revealed materially more remaining scope than first estimated, then executed only after all of Stages E/F/H/I/J-1-11 passed — with a full two-suite re-run immediately after removal confirming zero new breakage and that the removal correctly resolved the one test (`advisor-graph-health.vitest.ts`'s orphan-skill check) that had been failing specifically because of the symlinks' directory-walk double-discovery.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Exclude `changelog/**` from the Stage F blanket sweep | Changelogs document what was true at the time an entry was written; rewriting historical entries to say the current name would be inaccurate, mirroring the `.opencode/specs/**` historical-preservation principle |
| Preserve "formerly the separate deep-loop-runtime skill" narrative sentences and dual old/new keyword entries rather than rename them | These are deliberate backward-compat/historical-accuracy choices from earlier in this same session (phase 002 and this phase's Stage D); a blind rename would silently destroy that intent |
| Fix `gate3-corpus-runner.mjs`'s unrelated broken import path to unblock Stage A's baseline capture | Same category as phase 002's `council-playbook-anchor-integrity.vitest.ts` fix — pulled forward because it blocked this phase's own verification, confirmed pre-existing via `git log` before touching it |
| Add `runtime` to `parent-skill-check.cjs`'s shared `DIRECTORY_ALLOWLIST` rather than special-casing system-deep-loop | The nested-infrastructure-not-a-mode pattern this merge established should be a first-class, reusable pattern for any future hub, not a one-off exception |
| Defer symlink removal past the original plan's mid-phase point | A broader live-code-path scan showed materially larger remaining scope than estimated; removing early would have been unverified even though a dedicated GPT verification pass had already said it was safe |
| Leave `system-skill-advisor/mcp_server/scripts/skill-graph.json` at its stale committed state rather than hand-editing or force-regenerating | Confirmed via grep that no live code consumes this specific static export; the daemon's own live index (which IS consumed) already reflects the merge correctly and was freshly re-scanned |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Residual grep (excl. `changelog/**`) | 14 files, each individually confirmed deliberate |
| `routing-registry-drift-guard.vitest.ts` | 7/7 |
| `score-routing-corpus.py --min-advisor-accuracy 0.3679` | live 0.5492, `overall_pass: true` |
| `local-native-divergence-ratchet.vitest.ts` | 6/6, after 2 rounds of hand-verified updates |
| `check-contract-drift.vitest.ts` | 8/8 (closed 002's documented gap) |
| Contract-compile determinism | byte-identical on a third consecutive run |
| `check-agent-mirror-sync.cjs` | 5/5 agents in sync |
| `parent-skill-check.cjs` (system-deep-loop + sk-code/sk-design/sk-doc) | all PASS, 0 hard-invariant failures |
| `package_skill.py --check` | hub + all 4 mode packets PASS |
| `runtime/` full vitest | 70/71 (1 pre-existing, `git log`-confirmed unrelated flake) |
| `system-skill-advisor` full vitest | 691/692 (1 pre-existing, `git blame`-confirmed unrelated gap predating this session) |
| `system-spec-kit test:council` | 7/9 (exactly the 2 failures phase 002's own research already named) |
| Symlink removal | both removed; full two-suite re-run confirmed zero new failures and one expected fix (the symlink double-discovery test) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`system-skill-advisor/mcp_server/scripts/skill-graph.json` remains at its stale, pre-migration committed content.** Confirmed unconsumed by any live code (grep swept clean); the live daemon index it's presumably a historical export of is already correct and was freshly re-scanned this phase. Left as-is rather than force-regenerated without a known generator command.
2. **Two pre-existing, unrelated test gaps were discovered (not caused) during this phase's verification passes**: `advisor-graph-health.vitest.ts`'s "keeps health ok" check (a hardcoded `deep-improvement` alias-group entry from 2026-05-30 plus an unrelated retired `cli-codex-retired` skill still tracked in SQLite) and `executor-provenance-mismatch.vitest.ts`'s Claude-Code-model-extraction case. Neither touched by this phase's edits; both confirmed via `git log`/`git blame` to predate this session.
3. **`.opencode/agents/**`/`.claude/agents/**` deep-ai-council test fixture files** (`findings-registry.vitest.ts`, `integration-deep-mode-e2e.vitest.ts`, `orchestrate-topic.vitest.ts`, `persist-artifacts.vitest.ts`) were content-verified clean by inspection but could not be run through a discovered test harness — neither `runtime/`'s vitest config nor any config local to `deep-ai-council/` includes their path. Pre-existing gap, not introduced by this phase.
<!-- /ANCHOR:limitations -->
