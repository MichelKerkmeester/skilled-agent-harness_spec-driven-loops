---
title: "Implementation Summary: Create/Doctor/Skill-Advisor Core Alignment Fixes"
description: "Create and doctor now speak one vocabulary about a skill's advisor-index state instead of tribal knowledge."
trigger_phrases:
  - "core alignment fixes implementation summary"
  - "advisor index handoff shipped"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/035-create-doctor-skill-advisor-alignment/002-core-alignment-fixes"
    last_updated_at: "2026-07-31T03:57:25Z"
    last_updated_by: "claude-code"
    recent_action: "A1-A7 plus gap remediation documented"
    next_safe_action: "validate.sh --strict, then user decides on commit"
    blockers: []
    key_files:
      - "implementation-summary.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "035-002-core-alignment-fixes"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "G2 vs G3 disentangled: G2 is create-skill-parent-auto.yaml omitting leaf-manifest generation entirely (fixed here); G3's fleet-blast-radius citation is actually about init_skill.py, the STANDALONE initializer, not the parent workflow (confirmed by direct grep — init_skill is never referenced from create-skill-parent-*.yaml)."
      - "Should init_skill.py's fleet --fix call be narrowed the same way create-skill-parent-auto.yaml's was? Resolved differently than first assumed: rather than swapping to the scoped generator directly (incomplete for class-S leaf-aliases.json), added a --skill <name> flag to ci-skill-root-metadata.cjs itself so --fix can be scoped without duplicating generation logic."
---
# Implementation Summary: Create/Doctor/Skill-Advisor Core Alignment Fixes

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-core-alignment-fixes |
| **Completed** | 2026-07-31 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Before this packet, a newly scaffolded skill was structurally valid but silent about whether the advisor index actually knew it existed — creation and diagnosis used different, undocumented vocabularies, `/doctor:skill-advisor` never called the one tool (`skill_graph_validate`) that catches structural graph drift, and `/create:skill-parent` never generated the `leaf-manifest.json` its own validation gate already required. This packet closes all seven researched gaps (A1-A7 from `../001-research/research/research.md` Section 6 Track A) so every create and doctor surface now renders the same field vocabulary about a skill root's advisor state.

### A1 — Three zero-ambiguity defects fixed
`route-validate.py`'s presentation-table parity regex was still matching pre-migration snake_case yaml filenames (`doctor_[a-z0-9_-]+\.yaml`) against the actual hyphen-case files, silently reporting all 10 routes as missing from the table that in fact listed all 10. `skill_graph_validate` was a live, registered tool nowhere declared on the doctor route or router frontmatter. `/create:skill-parent.md` pointed at a template path (`assets/skill/`) that had already been renamed to `assets/parent-skill/`.

### A2 — `skill_graph_validate` wired into doctor with real severity semantics
`doctor-skill-advisor.yaml`'s verification phase now derives `pass`/`warn`/`fail`/`unavailable` from `skill_graph_validate`'s actual payload (`isValid`, `errorCount`, `warningCount`) instead of never calling it, sources `graph_scan_report` from `skill_graph_status`'s authoritative totals instead of `advisor_rebuild`'s payload (which never returned them), and folds the result into the existing `pass`/`fail`/`partial`/`skipped_unverified` terminal-state policy — a transport failure (advisor IPC cold) renders `UNAVAILABLE (retryable)`, never `FAILED`.

### A3 — Leaf-manifest generation added at create time
`/create:skill-parent`'s `:auto` and `:confirm` workflows now run the scoped `generate-leaf-manifest.cjs --write <skillDir>` after packets are finalized, instead of never generating it at all (the parent workflow previously called neither the scoped generator nor the fleet gate — a pure omission, confirmed by grep). Standalone `/create:skill`'s `full-update` branch, which never runs the class-metadata gate, now runs the read-only `--check` variant so its completion report states real freshness instead of assuming it.

### A4/A5 — One shared vocabulary, wired into every resolved create branch
`advisor-index-handoff.md` is the new canonical contract: metadata ownership, the operator-owned refresh choice (`skill_graph_scan` vs `advisor_rebuild`, presented as one explicit choice, never chained), the `NOT RUN`/`PASSED`/`FAILED`/`UNAVAILABLE (retryable)` verification-state enum, the `fresh`/`stale`/`missing` leaf-manifest enum, and the class-applicability rule (H-only fields never render on a standalone root). All 8 workflow-asset surfaces — standalone `:auto`/`:confirm`/presentation and parent `:auto`/`:confirm`/presentation — render this same vocabulary; reference-only/asset-only branches render only the narrow `Leaf-manifest freshness` signal, never the full block, since those roots forbid every H-only field by construction.

### Gap Remediation — G3, G4, and three pre-existing test failures
The initial A1-A7 pass closed with three documented limitations and deferred G3/G4; on operator direction ("Fix gaps") all five closed:

- **G3 (fleet-gate blast radius) was resolvable after all.** The blocker recorded at Complete was that `generate-leaf-manifest.cjs --write` alone doesn't generate `leaf-aliases.json` for class-S roots, so swapping `init_skill.py`'s fleet `--fix` call for the scoped generator directly would be incomplete. The actual fix was smaller: add a `--skill <name>` flag to `ci-skill-root-metadata.cjs` itself, filtering discovery to one basename-matched root before `--fix` runs. This reuses the exact same generation logic (nothing duplicated) while eliminating the blast radius — proven end-to-end by scaffolding a real skill next to a sibling root and confirming the sibling's file was byte-identical before and after.
- **G4 (missing vs stale redirect).** `parent-skill-check.cjs`'s check 11a (the class-contract check, which is what actually catches a genuinely-missing `leaf-manifest.json` — the earlier 10-block treats absence as "not yet opted in" and stays silent) reported a bare `MISSING_GENERATED_FILE` message with no redirect, unlike the byte-drift (10b) check which already prints the exact regenerate command. Added the same redirect, read-only, only when the violation is actually the generated-file case (not a registry-authored defect, where `--write` wouldn't help).
- **Three pre-existing test failures, all root-caused and fixed, not just reconfirmed as unrelated:**
  - `parent-skill-check-leaf-manifest.test.cjs` never staged `s-class-config-defaults.json` in its fixture, which `generate-leaf-manifest.cjs` requires at runtime — `create-journey-proof.test.cjs` already had this fix; mirrored it here.
  - `create-journey-proof.test.cjs` failed because `init_skill.py`'s graph-metadata scaffold (and both its hand-authored templates) carried a stray `manual` top-level key — cross-contamination from the unrelated spec-folder graph-metadata schema, which coincidentally uses the same field name for a completely different purpose — plus only 1-2 `intent_signals` entries against an 8-entry floor. Removed the key from all three sites, expanded `intent_signals`.
  - `test_create_skill_contract.py` hardcoded `bin/lib/compiled-routing/010-live-activation`, but the real runtime layout selector (`compiled-route-layout.cjs`) treats `010` as legacy and `013` as current, and only `013` exists on disk — a stale path from an unrelated renumbering. Replaced the hardcode with dynamic discovery of the one `*-live-activation` directory present.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/commands/doctor/scripts/route-validate.py` | Modified | Fixed stale snake_case parity regex (A1) |
| `.opencode/commands/doctor/_routes.yaml` | Modified | Added `skill_graph_validate` to the skill-advisor route (A1) |
| `.opencode/commands/doctor/speckit.md` | Modified | Added `skill_graph_validate` to router allowed-tools (A1) |
| `.opencode/commands/create/skill-parent.md` | Modified | Fixed `assets/skill/` -> `assets/parent-skill/` cross-reference (A1) |
| `.opencode/commands/doctor/assets/doctor-skill-advisor.yaml` | Modified | Wired `skill_graph_validate` severity derivation into `phase_4_verify`; fixed a stale "STEP 1-6" phrasing (A2) |
| `.opencode/commands/create/assets/create-skill-parent-auto.yaml` | Modified | Added scoped leaf-manifest generation + assertion + handoff report (A3, A5b) |
| `.opencode/commands/create/assets/create-skill-parent-confirm.yaml` | Modified | Same fix mirrored for the `:confirm` variant (A3, A5b — discovered during implementation, not in the original file list) |
| `.opencode/commands/create/assets/create-skill-parent-presentation.txt` | Modified | Added the Advisor/Index Handoff block (A5b) |
| `.opencode/commands/create/assets/create-skill-auto.yaml` | Modified | Added full-update `--check`, conditional handoff/narrow-signal template (A5a, A5c) |
| `.opencode/commands/create/assets/create-skill-confirm.yaml` | Modified | Same mirrored for `:confirm` (A5a, A5c) |
| `.opencode/commands/create/assets/create-skill-presentation.txt` | Modified | Added the conditional handoff/narrow-signal template (A5a, A5c) |
| `.opencode/skills/sk-doc/sk-create-skill/references/shared/advisor-index-handoff.md` | Created | The canonical shared vocabulary contract (A4) |
| `.opencode/skills/sk-doc/sk-create-skill/scripts/tests/advisor-index-handoff-contract.test.cjs` | Created | 9 assertions pinning the vocabulary across standalone/parent/doctor (A6a) |
| `.opencode/commands/doctor/scripts/tests/skill-advisor-route-contract.test.cjs` | Created | 4 assertions pinning the required tool subset against the live registry, existence-only (A6b) |
| `.opencode/skills/sk-doc/leaf-manifest.json` | Regenerated | Refreshed after adding `advisor-index-handoff.md` (a new leaf under `sk-doc`'s own tracked corpus) |
| `.opencode/commands/doctor/scripts/tests/parent-skill-check-leaf-manifest.test.cjs` | Modified | Added `s-class-config-defaults.json` to the fixture-copy list (gap fix) |
| `.opencode/skills/sk-doc/sk-create-skill/scripts/init_skill.py` | Modified | Removed stray `manual` graph-metadata key, expanded `intent_signals` to 8, scoped the class gate's `--fix` via `--skill` (G3, gap fix) |
| `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-graph-metadata-template.json` | Modified | Removed the same stray `manual` key (gap fix) |
| `.opencode/skills/sk-doc/sk-create-skill/assets/parent-skill/parent-skill-graph-metadata-template.json` | Modified | Removed the same stray `manual` key (gap fix) |
| `.opencode/skills/sk-doc/scripts/tests/test_create_skill_contract.py` | Modified | Replaced hardcoded `010-live-activation` with dynamic `*-live-activation` discovery (gap fix) |
| `.opencode/commands/doctor/scripts/parent-skill-check.cjs` | Modified | Check 11a now redirects `MISSING_GENERATED_FILE` violations at the scoped generator (G4, gap fix) |
| `.opencode/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs` | Modified | Added `--skill <name>` scoping flag, fully backward compatible when absent (G3, gap fix) |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each of A1-A7 was implemented then independently re-verified before the next began: `route-validate.sh` after every doctor-surface edit, `parent-skill-check.cjs` after every create-surface edit, `python3 -c "import yaml; yaml.safe_load(...)"` after every YAML edit. The A6 contract tests were written last, once real behavior existed to pin (per research's own ruled-out direction against test-first pinning). At that point the full verification surface was re-run: `route-validate.sh` (10/10 routes, 0 errors), `parent-skill-check.cjs` across all 7 class-H hubs (7/7, after regenerating `sk-doc`'s own stale leaf-manifest), the fleet `ci-skill-root-metadata.cjs` across all 11 skill roots (11/11), and the full `sk-create-skill`, `doctor/scripts`, and `test_create_skill_contract.py` suites. Three pre-existing failures (unrelated to this packet) were confirmed via `git stash`-based baseline diff against commit `6fbaee057c` — identical failures both before and after, so not a regression at that point.

On operator direction to fix the two deferred findings and the three pre-existing failures, each of the five gap fixes followed the same discipline: read the actual failing code/message first, confirm root cause with a targeted grep or manual repro (e.g. the `--skill` fix was proven live by scaffolding a real skill and diffing a sibling root's file before/after, not just re-running the test suite), then re-run the specific suite that had failed. The full verification surface was re-run one final time after all five fixes: `route-validate.sh` (10/10), `parent-skill-check.cjs` (7/7 hubs), the fleet gate (11/11 roots), `sk-create-skill` (17/17, up from 16/17), `doctor/scripts` (5/5, up from 4/5), and `test_create_skill_contract.py` (23/23, up from 21/23) — zero pre-existing failures remain.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Mirrored every `:auto`-only edit into the matching `:confirm` workflow (A3, A5a, A5b) | Both variants render the same shared presentation template — fixing only `:auto` would leave `:confirm` promising handoff fields it never generates, a worse state than before this packet |
| Kept `description.json` and standalone `/create:skill` free of any parent-hub-metadata assertion (A7) | Nine iterations of research converged on this exact boundary being the mistake most likely to get silently reintroduced; stated it explicitly as a guardrail in `advisor-index-handoff.md` rather than leaving it implicit |
| Used a shared vocabulary doc with per-surface duplicated rendering, not a shared formatter | Research Theme F1/F2: create and doctor have genuinely different result shapes; a byte-identical formatter would flatten real lifecycle differences the research explicitly warned against |
| Closed G3 with a `--skill <name>` scoping flag on the fleet gate itself, not a new leaf-aliases generator | Building a second alias-derivation code path risked silently diverging from `init_skill.py`'s own logic over time; scoping the existing, already-correct fleet gate to one root reuses the same generation code and eliminates the blast radius with a much smaller, more auditable change |
| Fixed the two graph-metadata templates as well as `init_skill.py`'s inline literal, not just the scaffolder | `create-journey-proof.test.cjs`'s `assertShapeMatches` check compares scaffold output against the template file's key set — fixing only one side would have traded a real bug for a new shape-mismatch failure |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `route-validate.sh` | PASS — 10/10 routes validated, 2 pre-existing informational warnings only |
| `parent-skill-check.cjs` (all 7 class-H hubs) | PASS — 7/7 after regenerating `sk-doc`'s own leaf-manifest.json |
| `ci-skill-root-metadata.cjs --format json` (fleet, all 11 roots) | PASS — 11/11, 0 failed |
| `advisor-index-handoff-contract.test.cjs` (new, A6a) | PASS — 9/9 |
| `skill-advisor-route-contract.test.cjs` (new, A6b) | PASS — 4/4 |
| `sk-create-skill` full test suite (`*.test.cjs`) | PASS — 17/17 (was 16/17; `create-journey-proof.test.cjs` fixed) |
| `doctor/scripts` full test suite (`*.test.cjs`) | PASS — 5/5 (was 4/5; `parent-skill-check-leaf-manifest.test.cjs` fixed) |
| `test_create_skill_contract.py` (pytest) | PASS — 23/23 (was 21/23; both compiled-routing-path failures fixed) |
| `validate_document.py` on `advisor-index-handoff.md` | PASS — 0 issues, document type `reference` |
| YAML syntax check on every edited asset (11 files) | PASS — all clean immediately after each edit |
| `--skill` scoping live proof (G3) | PASS — scaffolded a real skill next to a sibling root; sibling's `graph-metadata.json` byte-identical before/after |
| Missing-manifest redirect message (G4) | PASS — manual fixture with a deleted `leaf-manifest.json` now prints `MISSING_GENERATED_FILE ... Re-run: node ".../generate-leaf-manifest.cjs" --write "..."` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

All three limitations recorded when this packet first reached Complete have since been resolved (see Gap Remediation above):

1. ~~`init_skill.py`'s fleet-gate blast radius (G3)~~ — resolved via a `--skill <name>` scoping flag on `ci-skill-root-metadata.cjs`.
2. ~~Three pre-existing, unrelated test failures~~ — all three root-caused and fixed.
3. ~~Doctor's missing-vs-stale redirect (G4)~~ — resolved in `parent-skill-check.cjs` check 11a; `doctor-parent-skill.yaml` needed no change since it already prints the checker's report verbatim.

None identified as of this update.
<!-- /ANCHOR:limitations -->

---

<!-- HVR rules: .opencode/skills/sk-doc/references/hvr-rules.md -->
