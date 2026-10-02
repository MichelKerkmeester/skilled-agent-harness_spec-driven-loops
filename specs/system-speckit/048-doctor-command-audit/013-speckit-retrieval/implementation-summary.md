---
title: "Implementation Summary"
description: "Records the fix verdict for the speckit-retrieval doctor target, the files changed, the batch gates that passed and the subsystem findings left open."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/048-doctor-command-audit/013-speckit-retrieval"
    last_updated_at: "2026-10-02T21:12:00Z"
    last_updated_by: "closing-session"
    recent_action: "Recorded the fix verdict and closed the phase documentation"
    next_safe_action: "Continue with phase 014-doctor-env"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-013-speckit-retrieval"
      parent_session_id: null
    completion_pct: 100
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
| **Spec Folder** | 013-speckit-retrieval |
| **Completed** | 2026-10-02 |
| **Level** | 2 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

**Verdict: fix.** The `/doctor:speckit speckit-retrieval` target keeps its whole working lane — the index, the lookup, the recipes and the parity gate all behave as documented on this checkout — but six claims it made no longer matched the system, so the correction was applied rather than a retirement.

### Phase 13: speckit-retrieval

An operator who runs the target now sees results that match this checkout. The audit ran every step the workflow names in read-only form first, scored each signal against the committed index and the real asset names, and wrote the raw output to `scratch/doctor-run.log`. The verdict rests on both halves: the lane that works, and the six claims that did not.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/doctor/_routes.yaml` | Modified | Removed the dead `incremental` setup variable and `--incremental` flag from the `speckit-retrieval` route, and fixed the `doctor_<target>.yaml` removal note |
| `.skilled/commands/doctor/assets/doctor-speckit-retrieval.yaml` | Modified | Removed the dead setup input, its field-handling block and the incremental recommendation; corrected the Claude path note, the phrase-quality class list, the recipe glob count and the forbidden glob pattern |
| `.skilled/commands/doctor/assets/doctor-speckit-presentation.txt` | Modified | Replaced the regeneration-mode prompt with one sentence and removed the orphaned `--scope` prompt that read as this target's |
| `.skilled/commands/doctor/speckit.md` | Modified | Corrected `doctor_<target>.yaml` to `doctor-<target>.yaml` in the router text |
| `scratch/reality-check.md` | Created | Inventory of every named item, scored present, moved or missing with the command that showed it |
| `scratch/doctor-run.log` | Created | Raw output and exit status of every read-only probe |
| `scratch/proposal.md` | Created | Verdict, the minimal edits and the subsystem findings |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The audit ran at HEAD `83616db9ba221a80d271b2b924b3a32664962ffd` and left every tracked file untouched; the three scratch artifacts are its only writes, and the temporary latency and lookup probe files were removed after the run. Because `_routes.yaml`, `speckit.md` and the presentation are shared with the other `/doctor:speckit` targets, the fixes were applied in one batch with them by GPT-6 Luna (`cli-codex`), and the orchestrator reviewed the diff and reran the gates. The batch kept the target's route and asset; nothing was retired.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| `fix`, not `keep` or `retire` | Every script, fixture and path the target depends on exists and the central lane works end to end, but six claims no longer match the system, one of them promising a capability the command it recommends does not have |
| Remove the dead flag rather than implement it | No consumer exists anywhere in the repository, and `/doctor:update` documents a full regeneration with no incremental mode |
| Record subsystem defects as findings, never fix them here | The packet's frozen decision keeps the doctor audit separate from subsystem repairs |
| Apply the edits in the shared batch | The route manifest, the router doc and the presentation are shared with the other `/doctor:speckit` targets; one batch keeps parity while `route-validate.sh` enforces it |
| Leave the optional staleness probe out | It is an addition rather than a mismatch repair, and the finding it would address is already recorded |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `bash .skilled/commands/doctor/scripts/route-validate.sh` | PASS — exit 0, `OK: route-validate — 9 routes validated, 2 warnings`; J1 parity across the manifest, the router table and all 3 presentation displays |
| YAML parse | PASS — `python3 yaml.safe_load` over `_routes.yaml` and all 13 doctor asset YAML files reports YAML_OK |
| Command catalog mirror check | PASS — `node .skilled/commands/doctor/scripts/command-catalog-mirror-check.cjs` reports `STATUS=OK`, exit 0 |
| MCP mutation guard | PASS — `check-mcp-mutation-class.sh` reports `GUARD PASS`, exit 0 |
| Doctor script tests | `skill-advisor-route-contract.test.cjs` passes; the three `parent-skill-check-*.test.cjs` files fail exactly as before the batch, because their temporary fixtures cannot load `@spec-kit/shared/frontmatter/parse-frontmatter.js` in this worktree — baseline, not a regression |
| Edited-file re-read | PASS — `rg` over the four edited files finds no `--incremental`, no `doctor_*`, no CLAUDE.md symlink claim and no wrong glob count |
| Audit probes | `scratch/doctor-run.log` — 23 prompt-set lookups exit 0 or 1; a missing index exits 2 with ENOENT; the recipe returns 15 paths with and without `--no-config`; cold-lookup p95 104.256 ms against the 200 ms budget; `generate-trigger-index.mjs --check` exits 1 with 86 stale documents |
| Phase doc validation | PASS — `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <phase> --strict` reports `RESULT: PASSED` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

### Recorded findings (subsystem defects, kept as findings)

1. **The committed trigger index is stale.** 86 documents differ from the committed index and the corpus hash has moved on, so the doctor's medium-severity verdict for this checkout is correct on content, not just on mtime. Evidence: `generate-trigger-index.mjs --check --json` exits 1, `fresh: false`, `staleDocuments` 86, `missingDocuments` 86, `obsoletePaths` [], `corpusManifestHash` `4a2e8774…` against `indexManifestHash` `6c0344fd…`, 22938 documents scanned.
2. **`folder-token-fallback` is unreachable at generation, so one phrase gets two labels depending on which reader looks.** The generator judges every unique normalized phrase without folder context (`generate-trigger-index.mjs:260`), while the per-document validator passes it (`runtime/cli/rules/check-grep-convention-helper.mjs:187`). The committed `phraseQuality` has no key for the class, while `runtime/cli/retrieval/README.md:93` promises the bucket counts every rejected phrase by class.
3. **Staleness detection can only be mtime-based, because the index stores paths without per-path content hashes.** `trigger-index.json.paths` is an array of path strings, and the only content-level artifact is `corpusHash`, computed by a corpus walk. The 29 files that looked newer here are all within 24 ms of the index write, which is checkout noise; the authoritative content drift is the 86 documents in finding 1.
4. **`references/retrieval/retrieval-conventions.md` §9 root coverage names a symlink that does not exist.** The table's second row describes `.opencode/specs` as a symlink to `specs` and reasons about the walker canonicalizing that alias; the path is absent. `.opencode/skills` does exist and points at `../.skilled/skills`.
5. **`runtime/cli/retrieval/README.md:94` repeats the deleted-symlink claim:** "`CLAUDE.md` is a symlink to it". It has not existed since 2026-09-24, and the same tree's sync script states Claude reads the source directly.
6. **The acceptance packet the doctor names as its bar points at paths that no longer exist.** Its continuity block lists `.opencode/skills/system-spec-kit/scripts/retrieval/generate-trigger-index.mjs` and `.opencode/skills/system-spec-kit/data/trigger-index.json`; the tree is now `runtime/cli/retrieval/` and `runtime/data/`. The document still describes the accepted behaviour correctly.
7. **Informational: the conventions document pins its behavioural observations to ripgrep 14.1.1 while this host runs 15.2.0.** The §2.5 hazard was re-tested at 15.2.0 and still holds, so only the version pin is behind.

### Other limitations

1. The optional evidence-backed staleness probe from `scratch/proposal.md` was not applied, so the mtime heuristic stays mtime-only (finding 3). It is an addition, not a mismatch repair.
2. `doctor-update.yaml` still carries the dead `doctor_*.yaml` underscore pattern; the release-aware update redesign owns that file and its rewrite.
3. The frozen fixture `fixtures/latency-report.json` pins a different `manifestHash` and a worktree and layout that no longer exist. `runtime/cli/retrieval/README.md:79` states the five frozen acceptance fixtures pin their snapshot hash and that a mismatch is not a staleness signal, and the doctor's four-way compare excludes them; not a defect.
4. `pass_policy.index_regenerates_byte_identical` cannot be checked inside the workflow's own write boundary (report and state log only). The generator's scratch-build contract would allow the check; the doctor does not name it. Recorded, not changed.
5. No index regeneration was performed: the audit is read-only and `/doctor:update` owns regeneration, so the stale index reported in finding 1 still stands.
<!-- /ANCHOR:limitations -->

---


