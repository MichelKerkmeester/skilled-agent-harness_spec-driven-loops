---
title: "Implementation Summary: Phase 3: remediation-doctor"
description: "DR-01 through DR-06 fixed and verified: skill-graph-freshness added to all discovery displays, four packet-scratch-writing routes reclassified add-only, the unused memory_index_scan grant removed, route-validate.py extended with I/J/K assertions plus 3 new self-test fixtures, the advisor-consumption header corrected, and fable-mode's mutation_boundaries schema aligned."
trigger_phrases:
  - "remediate doctor commands"
  - "doctor route manifest drift"
  - "doctor router workflow assets table"
  - "doctor read-only targets proof"
  - "003-remediation-doctor"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/131-command-agent-conformance-audit/003-remediation-doctor"
    last_updated_at: "2026-07-11T08:49:19Z"
    last_updated_by: "markdown-agent"
    recent_action: "Fixed DR-01..DR-06; route-validate.sh + --self-test both exit 0"
    next_safe_action: "006-validation-closeout runs the read-only /doctor target execution proof"
    blockers: []
    key_files:
      - ".opencode/commands/doctor/speckit.md"
      - ".opencode/commands/doctor/_routes.yaml"
      - ".opencode/commands/doctor/scripts/route-validate.py"
      - ".opencode/commands/doctor/scripts/route-validate.sh"
      - ".opencode/commands/doctor/assets/doctor_speckit_presentation.txt"
      - ".opencode/commands/doctor/assets/doctor_fable-mode.yaml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "conformance-audit-132"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Phase 3: remediation-doctor

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-remediation-doctor |
| **Completed** | 2026-07-11 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

All six confirmed `/doctor` findings from the 001 deep-research synthesis (DR-01 through DR-06) are fixed and re-verified. `skill-graph-freshness` — a real, working route that was invisible to interactive discovery — is now listed everywhere a user would look for it. The four routes that quietly wrote packet-scratch diagnostics while claiming `read-only` (`memory`, `causal-graph`, `code-graph`, `deep-loop`) now carry the honest `add-only` classification with a concrete write path. The `memory` route's unused mutating `memory_index_scan` grant is gone. `route-validate.py` gained three new assertion classes (I/J/K) that make all three of the above regress-proof, and its own self-test fixture set doubled from 3 to 6. `_routes.yaml`'s header no longer claims Skill Advisor consumption it never had, and `doctor_fable-mode.yaml` now speaks the same `mutation_boundaries:` schema as its 10 siblings.

### DR-01 — skill-graph-freshness discoverability
Added the `skill-graph-freshness` row between `parent-skill` and `fable-mode` (matching `_routes.yaml`'s own order) to `speckit.md`'s Workflow Assets table and to all three `doctor_speckit_presentation.txt` displays: the numbered startup menu (new option `10`, renumbering `fable-mode` from `10`→`11` and updating the Accepted-answers table, Help Block, and the "Press 1-11, 0, or X." prompt), the "Valid targets:" line, and the Subsystem Manifest Display table.

### DR-02 — honest mutation class for 4 packet-scratch-writing routes
Reclassified `memory`, `causal-graph`, `code-graph`, `deep-loop` from `mutating: read-only` to `mutating: add-only` in `_routes.yaml`, replacing each `gate3_location: "n/a (...)"` with the concrete `<packet_scratch>/...` (or `{packet_scratch}/...`, matching each YAML's own literal path style) write target already named in that route's own `phase_3_report`/`phase_2_proposal` output. Also updated the presentation's Subsystem Manifest Display "Mutation Class" column for those 4 rows (it explicitly states it must mirror `_routes.yaml`) — this is a direct, in-scope consequence of the DR-02 edit to the same file already being touched for DR-01, not opportunistic cleanup.

### DR-03 — remove the unused memory_index_scan over-grant
Removed `mcp__mk_spec_memory__memory_index_scan` from the `memory` route's `mcp_tools` list in `_routes.yaml` and from `speckit.md`'s frontmatter `allowed-tools`. `doctor_update.yaml:399`'s legitimate usage on the standalone `/doctor:update` is untouched.

### DR-04 — route-validate.py catches all of the above
Extended `route-validate.py` with three new assertion classes, landed and run against the still-unfixed manifest *before* DR-02/DR-03 to prove they catch the regression (see Verification):
- **I (route→script existence)**: resolves every `.opencode/...` script path inside each route's `script_invocations` against a new `--repo-root` argument and fails on any that don't exist on disk.
- **J (target-set parity)**: parses `speckit.md`'s Workflow Assets table and all three `doctor_speckit_presentation.txt` displays, and fails if any of those four target sets differs from `_routes.yaml`'s route set.
- **K (read-only mutation-policy)**: fails any `mutating: read-only` route whose target YAML contains a `Write to`/`Write state log to`/`Write report to` activity, or whose `mcp_tools` grants a known-mutating MCP tool (`memory_index_scan`, `memory_causal_link`, `advisor_rebuild`, `skill_graph_scan`).

`route-validate.sh` gained `--repo-root`/`--presentation` plumbing and 3 new `--self-test` fixtures (`missing-script`, `target-set-mismatch`, `read-only-with-write`) alongside the original 3.

### DR-05 — advisor-consumption header honesty
Rewrote `_routes.yaml`'s `# Consumed by:` header to state that neither advisor implementation harvests doctor route YAML (both walk only `.opencode/skills/*/{references,assets}/*.md`), that `/doctor <target>` dispatch is presentation-menu/argv-driven, and reworded the `trigger_phrases` schema-comment line to match. Softened `route-validate.py`'s G1 failure message to drop the "advisor will lose recall" implication.

### DR-06 — fable-mode schema uniformity
Replaced `doctor_fable-mode.yaml`'s prose `read_only_invariant:` block with a `mutation_boundaries:` block matching `doctor_embeddings.yaml`'s sibling shape (`read_only: true`, `allowed_targets: []`, `forbidden_targets: ["**/*"]`), preserving the original prose verbatim as the `invariant` value.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/commands/doctor/speckit.md` | Modified | DR-01: add `skill-graph-freshness` Workflow Assets row. DR-03: remove `memory_index_scan` from frontmatter `allowed-tools`. |
| `.opencode/commands/doctor/_routes.yaml` | Modified | DR-02: 4 routes → `add-only` + concrete `gate3_location`. DR-03: remove `memory_index_scan` grant. DR-05: rewrite header + trigger_phrases comment. |
| `.opencode/commands/doctor/assets/doctor_speckit_presentation.txt` | Modified | DR-01: add `skill-graph-freshness` to menu/Accepted-answers/Help-Block/Valid-targets/subsystem table, renumber `fable-mode` 10→11. DR-02: update Mutation Class column for the 4 reclassified routes. |
| `.opencode/commands/doctor/assets/doctor_memory.yaml` | Modified | DR-02: annotate the `Write to` activity with the add-only classification note. |
| `.opencode/commands/doctor/assets/doctor_causal-graph.yaml` | Modified | DR-02: annotate the `Write state log to` activity with the add-only classification note. |
| `.opencode/commands/doctor/assets/doctor_code-graph.yaml` | Modified | DR-02: annotate the `Write report to` activity with the add-only classification note. |
| `.opencode/commands/doctor/assets/doctor_deep-loop.yaml` | Modified | DR-02: annotate the `Write state log to` activity with the add-only classification note. |
| `.opencode/commands/doctor/assets/doctor_fable-mode.yaml` | Modified | DR-06: replace prose `read_only_invariant:` with a `mutation_boundaries:` block. |
| `.opencode/commands/doctor/scripts/route-validate.py` | Modified | DR-04: new I/J/K assertions + 2 parser helpers + `--presentation`/`--repo-root` args + docstring update. DR-05: soften G1 message. |
| `.opencode/commands/doctor/scripts/route-validate.sh` | Modified | DR-04: compute `ROOT_DIR`/`PRESENTATION_FILE`, pass new flags to python3, add 3 new self-test fixtures. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Fixed in dependency order per plan.md: DR-06, DR-05, DR-01 first (independent, no cross-finding dependency), then DR-04 (validator extension), then — critically — ran `route-validate.sh` against the still-unfixed `_routes.yaml` to capture the "would have caught it" proof (assertion K failing for `memory`/`causal-graph`/`code-graph`/`deep-loop`; raw output captured inline in tasks.md T013 and the Verification table below, then `scratch/` cleaned per file-org policy) before applying DR-02/DR-03. Re-ran `route-validate.sh` and `route-validate.sh --self-test` after every edit; both reached exit 0 only after all six findings landed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| DR-02: reclassify to `add-only` rather than strip the packet-scratch writes | The writes are useful diagnostic artifacts; removing them would be a behavior regression, not a classification fix (resolved-by-default per spec.md §9). |
| DR-04: new checks as lettered sections I/J/K in the existing script | Consistent with the script's own A–H structure and single `route-validate.sh` entry point; no separate script warranted. |
| `gate3_location` uses each route's own literal path style | `code-graph`'s YAML uses `{packet_scratch}/...` while the other three use `<packet_scratch>/...`; preserved verbatim rather than forcing a single convention not present in the source. |
| Multi-path `gate3_location` uses ` + ` separator | Matches the existing convention already used by the `skill-advisor` route (`"lib/scorer/lanes/*.ts + .opencode/skills/*/graph-metadata.json"`). |
| Updated the presentation Mutation Class column for the 4 reclassified routes | The file's own text says these values "should mirror `_routes.yaml`"; leaving it saying `read-only` after the DR-02 edit would introduce a fresh inconsistency in a file already in scope for DR-01. |
| T017 wording alignment done as inline annotations on the existing `Write to`/`Write state log to`/`Write report to` activity lines, not a rewrite of top-level `purpose`/invariant prose | Plan.md scopes this to "cosmetic consistency; no functional change" on the cited `phase_3_report`/`phase_2_proposal` line ranges specifically — those lines already describe the write plainly; the top-level "read-only"/"No mutations" framing in each YAML already refers to the inspected DB/graph, not packet-scratch, so it was not contradictory and was left untouched. |
| Self-test fixtures 4-6 are single-route manifests (like the original 3), not full 10-route copies | Matches the established fixture-harness design: only `ROUTES_FILE` is overridden per fixture, so any subset manifest also trips assertion J against the real 10-target displays — the self-test only asserts overall non-zero exit, not per-assertion isolation, same as fixtures 1-3. Documented inline in `route-validate.sh`. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Pre-fix proof: `route-validate.sh` against unfixed `_routes.yaml` (DR-01/05/06/04 landed, DR-02/03 not yet) | FAIL exit 1 — K1 failed for `memory`, `causal-graph`, `code-graph`, `deep-loop`; K2 failed for `memory` (`memory_index_scan`). A/B/C/D/E/F/G/I/J all PASS. |
| Post-fix: `bash .opencode/commands/doctor/scripts/route-validate.sh` | PASS exit 0 — `10 routes validated, 3 warnings` (H1 flag-collision warnings are pre-existing/informational, unrelated to DR-01..DR-06). |
| `bash .opencode/commands/doctor/scripts/route-validate.sh --self-test` | PASS exit 0 — all 6 fixtures (3 original + `missing-script`/`target-set-mismatch`/`read-only-with-write`) correctly rejected. |
| REQ-001: `grep -c skill-graph-freshness speckit.md` / presentation | 1 / 3 (≥1, ≥3 required) — PASS |
| REQ-002: 4 routes `add-only` + concrete `gate3_location` | Confirmed via `grep -A.. 'target: <name>'`; no `n/a` remains — PASS |
| REQ-003: `memory_index_scan` removed | `grep -n memory_index_scan _routes.yaml` → 0 matches; `grep -c memory_index_scan speckit.md` → 0; `doctor_update.yaml:399` untouched — PASS |
| REQ-004: I/J/K land + self-test + pre-fix K proof | All present, see rows above — PASS |
| REQ-005: header + G1 wording | `grep -n 'Consumed by' _routes.yaml` states the true unharvested scope; `grep -c 'will lose recall' route-validate.py` → 0 — PASS |
| REQ-006: `mutation_boundaries:` in fable-mode | `grep -c mutation_boundaries: doctor_fable-mode.yaml` → 1 (was 0); `grep -c read_only_invariant: doctor_fable-mode.yaml` → 0 (was 1) — PASS |
| Consumer sweep: `rg -n 'skill-graph-freshness' .opencode/commands/doctor/` | Appears in `_routes.yaml`, `doctor_skill-graph-freshness.yaml`, `speckit.md`, and all 3 presentation displays — no missed consumer |
| Consumer sweep: `rg -n 'memory_index_scan' .opencode/commands/doctor/` | Remaining hits are `doctor_update.yaml` (legit, untouched), `update.md`/`doctor_update_presentation.txt` (companion command, out of scope), `doctor_memory.yaml` prose comments (historical rationale text, not a grant), and the new `KNOWN_MUTATING_MCP_TOOLS` constant in `route-validate.py` (intentional — detects future regressions) |
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh 003-remediation-doctor --strict` | `Summary: Errors: 0  Warnings: 0` / `RESULT: PASSED`, exit 0 (after regenerating `description.json` + `graph-metadata.json` post-edit) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Read-only `/doctor` target execution proof deferred.** This phase only re-validates `route-validate.sh` (a static manifest check); actually executing the read-only `/doctor` targets end-to-end (per `research.md` §4's run-proof table) is explicitly owned by `006-validation-closeout` per spec.md's Handoff Criteria and Out of Scope.
2. **H1 flag-collision warnings are pre-existing.** `route-validate.sh` reports 3 informational `H1` warnings (`--scope`, `--dry-run`, `--dir` shared across multiple targets); these predate this phase, are explicitly "allowed but informational" per the script's own design, and are unrelated to DR-01..DR-06.
3. **Target-set parity (assertion J) checks names only, not full route metadata.** It does not diff `mutating`/`gate3_location`/`mcp_tools` between the manifest and the presentation table; the presentation Mutation Class column edit made here for the 4 reclassified routes was a manual, verified edit, not something J enforces going forward. A future enhancement could extend J to also diff mutation class, but no confirmed 001 finding calls for it and it is out of this phase's scope.
<!-- /ANCHOR:limitations -->

---

<!--
LEVEL 2 IMPLEMENTATION SUMMARY
- Core + Level 2 addendum
- DR-01..DR-06 finding-driven, not generic feature narrative
-->
