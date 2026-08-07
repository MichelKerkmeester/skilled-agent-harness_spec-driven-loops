---
title: "Tasks: External Reference Migration"
description: "Task ledger for the dependency-ordered migration of every deep-loop-workflows/deep-loop-runtime reference to system-deep-loop."
trigger_phrases:
  - "external reference migration tasks"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/030-deep-loop-unification/003-external-reference-migration"
    last_updated_at: "2026-07-08T00:00:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Stage A-D, F-I executed and verified; residual grep 15 files, all deliberate"
    next_safe_action: "Execute Stage J's 11-step exit gate, then remove the 2 compat symlinks"
    blockers: []
    key_files:
      - "plan.md"
      - "research/stage-a-grep-inventory.txt"
      - "research/gpt-verify-stage-c-constants.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "deep-loop-unification-052-003-scaffold"
      parent_session_id: null
    completion_pct: 85
    open_questions: []
    answered_questions: []
---
# Tasks: External Reference Migration

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Capture Stage-A baseline: scoped `rg` inventory + `score-routing-corpus.py` accuracy numbers. 716 files/3244 matches total (723/3244+ with `--hidden` — default `rg` silently skips `.claude/**`, root-caused via `--debug`, no config file found to explain the `.opencode` vs `.claude` asymmetry); 137 files/911 matches external to `system-deep-loop`'s own tree. Advisor accuracy baseline 0.3679 (71/193). Evidence: `research/stage-a-*`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Stage B: physical move already consumed by 002; temp compat symlinks kept in place (NOT dropped) — evidence during this phase showed a materially larger remaining scope (Stage E/F/H) than originally scoped, so early removal was assessed unsafe. Removal deferred to Stage J per the plan's own original gating.
- [x] T003 Stage C.1-C.9: hardcoded code constants. Path corrections found live (2 of 7 sites had stale planned paths — `lib/routing/{aliases,explicit}.ts` doesn't exist, real paths are `lib/scorer/aliases.ts` + `lib/scorer/lanes/explicit.ts`). Also fixed, pulled forward beyond the original 7-site list: `lexical.ts`+`fusion.ts` (same category, missed by original plan), `.gitignore` (C.8, new finding), 4 doctor command assets (C.9, new finding), `.opencode/hooks/README.md`. `routing-registry-drift-guard.vitest.ts`'s own 2 hardcoded literals fixed here (pulled forward from D.3, same sed pass). Verified: `mk-deep-loop-guard.test.cjs` all assertions pass; `check-agent-mirror-sync.cjs` OK on a real agent file.
- [x] T004 Stage D: `mode-registry.json`/`hub-router.json` `skill` fields + prose self-references; `--emit-routing-projection` codegen run (regenerated `aliases.ts` GENERATED block + `skill_advisor.py` hash). **Mid-execution bug found+fixed**: `MERGED_DEEP_SKILL_ID` reverted to the old value between the Stage C.2 edit and the codegen run (root cause not fully isolated — `_replace_marked_block` confirmed correctly scoped to the marker region via a `--check-routing-projection` "fresh" empirical test after the fix); re-edited and confirmed stable. `routing-registry-drift-guard.vitest.ts`: 7/7 passing.
- [x] T005 Stage E: source YAML `skill:` fields (12 asset yamls + 5 presentation.txt) + router `.md` one-liners (already fixed in 002) + regenerated all 3 compiled contracts via `compile-command-contracts.cjs --write`. `check-contract-drift.vitest.ts`: 8/8 passing (was 3 failing, the documented 002 known-limitation, now closed). Re-ran the compile step a second time after Stage F touched its source inputs (stale-digest sequencing caveat, see T007).
- [x] T006 [P] Stage F: `.opencode/agents/**` + `.claude/agents/**` (per-file scoped, both real independent files confirmed via `ls -la`/`readlink`, not symlinked). `.claude/agents/**` (5 files) was invisible to the Stage-A baseline command's default `rg` (silently skips `.claude/**`, see T001 note) — fixed directly.
- [x] T007 [P] Stage F: full remaining sweep (~600 files: `manual_testing_playbook/**`, `feature_catalog/**`, `assets/**`, `scripts/**`, `tests/**`, `references/**`, READMEs, `system-spec-kit`/`sk-doc`/`system-code-graph` cross-skill prose, `AGENTS.md`) via blanket sed, excluding `changelog/**` (historical, left as-is by design). **Self-correction required**: the blanket pass initially clobbered 3 deliberately-curated `system-deep-loop` identity files (dual-keyword backward-compat entries in `description.json`/`graph-metadata.json`, and 4 "formerly the separate deep-loop-runtime skill" historical-narrative sentences across `SKILL.md`/`README.md`/`description.json`/`graph-metadata.json`) plus ~15 genuinely broken bare-word replacements (a bare `deep-loop-runtime` → `runtime/` rule mangling filenames like `deep-loop-runtime.json` into `runtime/.json`, JSON identifier values, test fixture strings, and YAML `trigger_phrases` entries) plus one over-reach into `system-skill-advisor/scripts/skill-graph.json` (a generated artifact deliberately deferred to Stage J, reverted via `git checkout HEAD --`) and 4 lines describing archived `.opencode/specs/**` example paths (historical, reverted). All found via a full test-suite run + targeted `rg` re-sweep for the corruption pattern, not assumed clean from the sed's exit code. Final state verified: `runtime/` suite 70/71 (1 pre-existing unrelated flake-confirmed-via-`git log`), advisor suite 685/687 (2 deliberate symlink-artifact failures, 1 confirmed flake on re-run).
- [x] T008 Stage G: sibling `graph-metadata.json` edges — `system-spec-kit` (2 distinct-context edges merged to 1), `system-skill-advisor` (4 duplicate edges merged to 1), `cli-opencode` (2 duplicate `related_to` entries deduped), `sk-code` + `sk-prompt` (simple rename). Fixed a genuine phase-002 schema bug found along the way: `system-deep-loop/graph-metadata.json`'s `derived.entities[2].kind: "infrastructure"` isn't a valid enum value — corrected to `"reference"`.
- [x] T009 Stage H: `skill-parent.md`'s canonical-example sentence, `parent_skills_nested_packets.md`'s hub-matrix row, and both `create_skill_parent_{auto,confirm}.yaml`'s `packet_prefix` examples — the latter two rewritten with an explicit caveat sentence (system-deep-loop's packets keep the `deep-` prefix matching the `/deep:*` command namespace, not the hub folder name — the one documented exception to the folder-prefix/command-namespace-prefix equivalence), not a blind rename.
- [x] T010 Stage I: advisor corpus field-scoped label rename (`labeled-prompts.jsonl` 53 rows, `ambiguity-prompts.jsonl` 8 rows, `intent-prompt-corpus.ts` 2 rows — 2 of these 3 files were not named in the original plan, found via verification) + divergence ledger (25→27 net after 1 resolved-and-removed + 1 updated + 1 newly-added, hand-verified per entry, not blind) + `capture-scorer-eval-baseline.mjs --write` re-baseline (hashes only, all metrics held exactly: 147/193, 60/78, 15/25, 22/32, 25/32, 11/11) + manual regression-ID swap (`rr-iter2-060`→`rr-iter3-145`, hand-verified via the test's own `advisor-parity-report` log, not guessed) in **two** independent hardcoded `ACCEPTED_PARITY_REGRESSION_IDS` lists (`python-ts-parity.vitest.ts` and the legacy `advisor-corpus-parity.vitest.ts` — the second one only surfaced after Stage F's full-suite verification pass, not caught by the original 2-gate plan).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Stage J.1: residual-grep sweep clean — 14 files remain, all deliberate (real `deep-loop-runtime.json` filename, historical "formerly the separate deep-loop-runtime skill" narrative sentences, dual-keyword backward-compat entries, and generated-artifact deferrals). One genuine live fix found and applied at `AGENTS.md` (the project's own root behavioral-framework doc, symlinked from `CLAUDE.md`) — a Gate-4 tiebreaker sentence still named the old packet path.
- [x] T012 Stage J.2: `parent-skill-check.cjs` self-check — found and fixed a real gap: `DIRECTORY_ALLOWLIST` (the canonical list of non-mode support directories every parent hub is checked against) didn't include `runtime`, so `6a` failed with "child director(ies) neither registered as a packet nor allowlisted: [runtime]". Added `runtime` to the shared allowlist (benefits any future hub using this same nested-infrastructure pattern, not system-deep-loop-specific). Verified zero regression on sk-code/sk-design/sk-doc plus the checker's own fixture tests (12/12).
- [x] T013 Stage J.3: advisor codegen `--check-routing-projection` → `"status": "fresh"`; `routing-registry-drift-guard.vitest.ts` 7/7.
- [x] T014 Stage J.4: contract-compile determinism confirmed by snapshotting all 3 compiled contracts, re-running `--write`, and diffing byte-for-byte (zero diff on all 3).
- [x] T015 Stage J.5: routing-accuracy re-baseline holds and improved — `score-routing-corpus.py --min-advisor-accuracy 0.3679` (the Stage-A baseline) → live 0.5492, `overall_pass: true`. The jump reflects the whole system now being internally consistent (Stage A was captured mid-migration, when the corpus already said the new name but supporting code didn't).
- [x] T016 Stage J.6: divergence ratchet suite — required 2 more rounds of hand-verified updates as later Stage F fixes (lexical/explicit-lane) cascaded into further accuracy improvement: `tsAlsoCorrect` 103→104, `rr-iter3-145` resolved and pruned from **both** `ACCEPTED_PARITY_REGRESSION_IDS` lists (`python-ts-parity.vitest.ts` and the legacy `advisor-corpus-parity.vitest.ts`) and from the divergence ledger (73→72 entries). All 4 parity/legacy test files green.
- [x] T017 Stage J.7-10: agent-mirror sync OK (5 agents); doctor skill-graph rebuild via the live daemon (`skill_graph_scan --trusted`, generation 10489→10490 — the daemon's live index already reflected the merge correctly; the static `scripts/skill-graph.json` export is confirmed unconsumed by any live code via grep, left at its stale committed state rather than hand-edited); CI parity confirmed (`pre-commit` and `agent-mirror-sync.yml` reference the identical post-rename `MIRROR_CHECKER`/`CHECKER` path); full vitest — `runtime/` 70/71 (1 pre-existing unrelated flake), `system-skill-advisor` 691/692 (1 pre-existing unrelated gap, confirmed via `git blame` predating this session), `system-spec-kit test:council` 7/9 (exactly the 2 pre-existing failures phase 002's own research already documented by name).
- [x] T018 Stage J.11: `package_skill.py --check` — hub PASS (1 pre-existing unrelated warning), all 4 mode packets PASS (pre-existing unrelated warnings only).
- [x] T019 Removed both temporary compat symlinks (`deep-loop-workflows`, `deep-loop-runtime`). Re-ran the full `runtime/` + `system-skill-advisor` suites post-removal: zero new failures: the symlink-induced `advisor-graph-health.vitest.ts` "validates graph metadata without orphan skills" failure is now gone (was a genuine double-discovery artifact from the symlinks), confirming removal was safe and correctly timed.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining.
- [x] `validate.sh --strict` exits 0 for this folder (recursive check across all 6 packet 052 folders also clean).
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent**: `../spec.md`
<!-- /ANCHOR:cross-refs -->
