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
    last_updated_at: "2026-07-31T03:28:14Z"
    last_updated_by: "claude-code"
    recent_action: "A1-A7 implemented, verified, and documented; Track A closed"
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
    open_questions:
      - "Should init_skill.py's fleet ci-skill-root-metadata.cjs --fix call (G3's actual citation) be narrowed the same way create-skill-parent-auto.yaml's was? Deferred — generate-leaf-manifest.cjs alone does not generate leaf-aliases.json for class-S roots, so a drop-in swap would be incomplete; needs its own scoped design decision."
    answered_questions:
      - "G2 vs G3 disentangled: G2 is create-skill-parent-auto.yaml omitting leaf-manifest generation entirely (fixed here); G3's fleet-blast-radius citation is actually about init_skill.py, the STANDALONE initializer, not the parent workflow (confirmed by direct grep — init_skill is never referenced from create-skill-parent-*.yaml)."
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
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each of A1-A7 was implemented then independently re-verified before the next began: `route-validate.sh` after every doctor-surface edit, `parent-skill-check.cjs` after every create-surface edit, `python3 -c "import yaml; yaml.safe_load(...)"` after every YAML edit. The A6 contract tests were written last, once real behavior existed to pin (per research's own ruled-out direction against test-first pinning). Before closing out, the full verification surface was re-run: `route-validate.sh` (10/10 routes, 0 errors), `parent-skill-check.cjs` across all 7 class-H hubs (7/7, after regenerating `sk-doc`'s own stale leaf-manifest), the fleet `ci-skill-root-metadata.cjs` across all 11 skill roots (11/11), the full `sk-create-skill` and `doctor/scripts` node test suites, and the Python `test_create_skill_contract.py` suite. Three pre-existing failures (unrelated to this packet) were confirmed via `git stash`-based baseline diff against commit `6fbaee057c` before this session's changes — identical failures both before and after, so not a regression.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Mirrored every `:auto`-only edit into the matching `:confirm` workflow (A3, A5a, A5b) | Both variants render the same shared presentation template — fixing only `:auto` would leave `:confirm` promising handoff fields it never generates, a worse state than before this packet |
| Left `init_skill.py`'s fleet `ci-skill-root-metadata.cjs --fix` call unchanged, despite it being G3's actual cited defect | `generate-leaf-manifest.cjs --write` alone doesn't generate `leaf-aliases.json` for class-S roots (confirmed by reading the generator's own docstring and grep), so swapping the call would be an incomplete substitute — this needs its own scoped design decision, not a drop-in change buried inside this packet |
| Kept `description.json` and standalone `/create:skill` free of any parent-hub-metadata assertion (A7) | Nine iterations of research converged on this exact boundary being the mistake most likely to get silently reintroduced; stated it explicitly as a guardrail in `advisor-index-handoff.md` rather than leaving it implicit |
| Used a shared vocabulary doc with per-surface duplicated rendering, not a shared formatter | Research Theme F1/F2: create and doctor have genuinely different result shapes; a byte-identical formatter would flatten real lifecycle differences the research explicitly warned against |
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
| `sk-create-skill` full test suite (`*.test.cjs`) | 16/17 — 1 pre-existing failure (`create-journey-proof.test.cjs`), confirmed unrelated via `git stash` baseline diff |
| `doctor/scripts` full test suite (`*.test.cjs`) | 4/5 — 1 pre-existing failure (`parent-skill-check-leaf-manifest.test.cjs`, stale fixture-copy list missing `lib/s-class-config-defaults.json`), confirmed unrelated |
| `test_create_skill_contract.py` (pytest) | 21/23 — 2 pre-existing failures on compiled-routing counter/path state, confirmed unrelated |
| `validate_document.py` on `advisor-index-handoff.md` | PASS — 0 issues, document type `reference` |
| YAML syntax check on every edited asset (11 files) | PASS — all clean immediately after each edit |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`init_skill.py`'s fleet-gate blast radius (G3) is unresolved.** The standalone `/create:skill` `full-create` path still calls `ci-skill-root-metadata.cjs --fix --skills-dir <parent>` — a fleet-wide gate that can regenerate unrelated roots' generated files as a side effect of scaffolding one new skill. Narrowing this correctly requires either a scoped `leaf-aliases.json` generator for class-S roots or an explicitly target-scoped class-gate API; out of scope for this packet (not in the original Files-to-Change table, and a drop-in swap would be functionally incomplete).
2. **Three pre-existing, unrelated test failures remain** (`create-journey-proof.test.cjs`, `parent-skill-check-leaf-manifest.test.cjs`, 2 cases in `test_create_skill_contract.py`) — confirmed via baseline diff to predate this packet. Not fixed here; flagged for whoever owns those surfaces next.
3. **Doctor's `/doctor:parent-skill` redirect behavior (G4)** — distinguishing "manifest missing" from "manifest stale" and pointing at the scoped generator without attempting repair — was part of research's A3 recommendation but was not in this packet's frozen Files-to-Change table (`doctor-parent-skill.yaml` was never listed). Not built here; a legitimate fast-follow if the operator wants it.
<!-- /ANCHOR:limitations -->

---

<!-- HVR rules: .opencode/skills/sk-doc/references/hvr-rules.md -->
