---
title: "Feature Specification: Phase 3: Remediate the /doctor Subsystem"
description: "The 001 deep-research synthesis confirmed six /doctor findings (DR-01 through DR-06): the speckit.md router table and presentation menu/valid-targets/subsystem table omit the real skill-graph-freshness route; four read-only routes write packet-local artifacts; the memory route over-grants the mutating memory_index_scan tool; route-validate.py cannot catch any of the above; _routes.yaml falsely claims Skill Advisor consumes trigger_phrases; and doctor_fable-mode.yaml lacks the sibling mutation_boundaries schema. This phase fixes exactly those six findings and re-validates route-validate.sh after each edit."
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
    recent_action: "REQ-001..006 implemented; route-validate.sh + self-test exit 0"
    next_safe_action: "006-validation-closeout: run read-only /doctor target proof"
    blockers: []
    key_files:
      - ".opencode/commands/doctor/speckit.md"
      - ".opencode/commands/doctor/_routes.yaml"
      - ".opencode/commands/doctor/scripts/route-validate.py"
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
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 3: Remediate the /doctor Subsystem

<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-10 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 6 |
| **Predecessor** | 002-remediation-slash-commands |
| **Successor** | 004-remediation-agents |
| **Handoff Criteria** | DR-01 through DR-06 fixed per REQ-001..REQ-006; `route-validate.sh` (with the DR-04 extensions) exits 0; `validate.sh --strict` exits 0 on this packet; read-only `/doctor` target execution proof is deferred to 006-validation-closeout |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the Command, agent, and asset conformance audit against current skill reality specification.

**Scope Boundary**: Only the six confirmed `/doctor` findings from the 001 deep-research synthesis (DR-01 through DR-06), scoped to `.opencode/commands/doctor/speckit.md`, `_routes.yaml`, the four affected `assets/doctor_*.yaml` route files, `assets/doctor_speckit_presentation.txt`, and `scripts/route-validate.py`. Skill internal logic (SKILL.md bodies), the other command families (create / deep / design / memory / speckit), and the agent surface are out of scope — they belong to sibling phases.

**Dependencies**:
- Phase 2 (`002-remediation-slash-commands`) complete so the shared command/asset conventions are settled before doctor-specific fixes land.
- Phase 1 deep-research synthesis (`001-conformance-deep-research`, `research/research.md` §3.2) — the authoritative source for DR-01 through DR-06; all six were re-verified present on disk as of 2026-07-10 and re-confirmed by direct read during this authoring pass.
- DR-04 (`route-validate.py` extension) must land together with DR-02/DR-03 so the new read-only mutation-policy check can immediately prove those two fixes (see plan.md sequencing).

**Deliverables**:
- `speckit.md` Workflow Assets table and `doctor_speckit_presentation.txt` menu/valid-targets/subsystem table all list the `skill-graph-freshness` route (DR-01).
- The four read-only routes that write packet-local artifacts (`memory`, `causal-graph`, `code-graph`, `deep-loop`) carry an honest `mutating` classification (DR-02).
- The `memory` route's over-grant of `memory_index_scan` is removed from `_routes.yaml` and the router frontmatter (DR-03).
- `route-validate.py` gains route→script existence, target-set parity, and read-only mutation-policy checks (DR-04).
- `_routes.yaml`'s header no longer falsely claims Skill Advisor consumption of `trigger_phrases`; `route-validate.py`'s G1 message is softened to match (DR-05).
- `doctor_fable-mode.yaml` carries a `mutation_boundaries:` block matching its 10 routed siblings (DR-06).

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 001 deep-research synthesis confirmed six `/doctor` defects, all re-verified against current disk state: (DR-01, P1, most-corroborated finding in the whole audit) `speckit.md`'s Workflow Assets table and the presentation menu/valid-targets/subsystem table all list only 9 of the 10 routes defined in `_routes.yaml` — `skill-graph-freshness` (a real, working route) is invisible to interactive discovery; (DR-02, P2) four routes labeled `read-only` in `_routes.yaml` (`memory`, `causal-graph`, `code-graph`, `deep-loop`) actually write packet-local reports/state logs, conflicting with the router's read-only contract; (DR-03, P2) the `memory` route over-grants the mutating `mcp__mk_spec_memory__memory_index_scan` tool that its own diagnostic workflow never calls; (DR-04, P2) `route-validate.py` validates only YAML-asset existence and the `mutating` enum, so it silently passes while DR-01/02/03 persist; (DR-05, P2) `_routes.yaml`'s header has falsely claimed Skill Advisor lexical-lane consumption of `trigger_phrases` since commit `10b76891c2` — neither the Python nor TS advisor harvester reads doctor route YAML; (DR-06, P2) `doctor_fable-mode.yaml` uses a prose `read_only_invariant:` string instead of the structured `mutation_boundaries:` block all 10 of its routed siblings declare.

### Purpose
Fix exactly these six confirmed findings in the `/doctor` router, route manifest, four affected target YAMLs, presentation contract, and validator script, then re-run `route-validate.sh` after each edit so the manifest stays internally consistent and each fix's grep/validate acceptance criterion is provably true.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **DR-01**: Add the `skill-graph-freshness` row to `speckit.md`'s Workflow Assets table, and to `doctor_speckit_presentation.txt`'s numbered startup menu, "Valid targets:" line, and subsystem manifest table — positioned between `parent-skill` and `fable-mode` to match `_routes.yaml`'s route order (line 171, between lines 156 and 186), renumbering the menu options that follow.
- **DR-02**: Reclassify `memory`, `causal-graph`, `code-graph`, and `deep-loop` in `_routes.yaml` from `mutating: read-only` to `mutating: add-only` with a concrete `gate3_location` naming the actual `<packet_scratch>` write path each route already uses (default resolution — see plan.md; the alternative "render to stdout only" fix is rejected as it would remove working diagnostic-report persistence).
- **DR-03**: Remove `mcp__mk_spec_memory__memory_index_scan` from the `memory` route's `mcp_tools` list in `_routes.yaml` (lines 27-39) and from `speckit.md`'s frontmatter `allowed-tools` (line 4), since it is only genuinely used by the standalone `/doctor:update` (`doctor_update.yaml:399`).
- **DR-04**: Extend `route-validate.py` with (a) a new assertion class resolving each route's `script_invocations` and rejecting missing scripts, (b) a target-set parity check comparing `_routes.yaml` routes against `speckit.md`'s Workflow Assets table and the presentation menu/valid-targets/subsystem-table target sets, and (c) a read-only mutation-policy check that fails any `mutating: read-only` route whose YAML declares a file/DB write or a mutating MCP tool. Land this together with DR-02/DR-03 so the new checks immediately prove those two fixes correct.
- **DR-05**: Rewrite `_routes.yaml`'s header `# Consumed by: Skill Advisor lexical lane (per-target trigger_phrases)` claim (lines 1-24) to state the true scope — not currently harvested by either advisor implementation; `/doctor <target>` dispatch is presentation-menu/argv-driven, not advisor-driven — and soften `route-validate.py`'s G1 assertion message so it no longer implies advisor consumption.
- **DR-06**: Replace `doctor_fable-mode.yaml`'s prose `read_only_invariant:` block (lines 20-24) with a structured `mutation_boundaries:` block matching the sibling schema used by, e.g., `doctor_embeddings.yaml:34-40` (`read_only: true`, `allowed_targets: []`, `forbidden_targets: ["**/*"]`, `invariant:` carrying the preserved wording).
- Re-run `route-validate.sh` after every edit in this phase to confirm the manifest stays internally consistent.

### Out of Scope
- Executing the read-only `/doctor` targets to prove the whole surface runs clean end-to-end — that run-proof is owned by `006-validation-closeout`; this phase only re-validates `route-validate.sh` itself after each doc/YAML/py edit.
- Broader router↔manifest↔YAML↔script tri-existence, trigger-phrase collision-freedom across all routes, `setup_vars`↔`allowed_flags` alignment, and companion/standalone routing-honesty audits beyond what DR-01 through DR-06 flag — no confirmed 001 finding exists for these dimensions; SCOPE LOCK forbids opening new speculative scope.
- `.opencode/commands/doctor/mcp.md` and `.opencode/commands/doctor/update.md` themselves — `doctor_update.yaml:399`'s `memory_index_scan` usage is cited only as DR-03 evidence that the tool has a legitimate home; neither companion command file requires an edit in this phase.
- The three other doctor diagnostic scripts (`parent-skill-check.cjs`, `fable-mode-check.cjs`, `skill-graph-freshness.cjs`) — no confirmed finding flags them.
- Other command families (create / deep / design / memory / speckit / root) — owned by sibling Phase 2. The agent surface — owned by sibling Phase 4.
- The systems the doctor diagnostics inspect (memory DB, code-graph index, skill-advisor scorer, embedder) — this phase audits the `/doctor` surface, not what it inspects.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/commands/doctor/speckit.md | Modify | DR-01: add `skill-graph-freshness` row to Workflow Assets table (lines 29-39). DR-03: remove `mcp__mk_spec_memory__memory_index_scan` from frontmatter `allowed-tools` (line 4). |
| .opencode/commands/doctor/assets/doctor_speckit_presentation.txt | Modify | DR-01: add `skill-graph-freshness` to the numbered startup menu (lines 8-40), "Valid targets:" line (~79), and subsystem manifest table (95-105); renumber trailing menu options and the "Press 1-10, 0, or X." prompt text. |
| .opencode/commands/doctor/_routes.yaml | Modify | DR-02: reclassify `memory` (27-32), `causal-graph` (60-65), `code-graph` (76-84), `deep-loop` (100-105) from `read-only` to `add-only` with concrete `gate3_location`. DR-03: remove `memory_index_scan` from `memory` route `mcp_tools` (27-39). DR-05: rewrite header `# Consumed by:` claim (lines 1-24). |
| .opencode/commands/doctor/assets/doctor_memory.yaml | Modify | DR-02: align `phase_3_report` (202-225) mutation-class-relevant wording with the route's corrected `add-only` classification. |
| .opencode/commands/doctor/assets/doctor_causal-graph.yaml | Modify | DR-02: align `phase_3_report` (210-217) with the route's corrected `add-only` classification. |
| .opencode/commands/doctor/assets/doctor_code-graph.yaml | Modify | DR-02: align `phase_2_proposal` (174-186) with the route's corrected `add-only` classification. |
| .opencode/commands/doctor/assets/doctor_deep-loop.yaml | Modify | DR-02: align `phase_3_report` (227-235) with the route's corrected `add-only` classification. |
| .opencode/commands/doctor/scripts/route-validate.py | Modify | DR-04: extend the assertion set (docstring 6-16; new checks alongside the existing D/E sections at 181-212) with script existence, target-set parity, and read-only mutation-policy assertions. DR-05: soften the G1 assertion message (~line 245). |
| .opencode/commands/doctor/assets/doctor_fable-mode.yaml | Modify | DR-06: replace prose `read_only_invariant:` (lines 20-24) with a structured `mutation_boundaries:` block. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

None — the top finding in this phase (DR-01) is calibrated P1 in the 001 synthesis (GLM re-verification proved `skill-graph-freshness` executes cleanly via direct argv; only interactive discovery is broken).

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | DR-01: `speckit.md`'s Workflow Assets table and `doctor_speckit_presentation.txt`'s menu/valid-targets/subsystem table must all list `skill-graph-freshness`. | `grep -c 'skill-graph-freshness' .opencode/commands/doctor/speckit.md` returns ≥1; `grep -c 'skill-graph-freshness' .opencode/commands/doctor/assets/doctor_speckit_presentation.txt` returns ≥3 (menu option, valid-targets line, subsystem table row); a diff of `speckit.md` table targets vs `_routes.yaml`'s 10 `target:` keys is empty both directions; the renumbered "Press 1-N, 0, or X." prompt matches the new option count. |

### P2 - Optional (complete OR defer with documented reason)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | DR-02: `memory`, `causal-graph`, `code-graph`, `deep-loop` routes carry an honest mutation class. | `grep -A1 'target: \(memory\|causal-graph\|code-graph\|deep-loop\)' .opencode/commands/doctor/_routes.yaml` shows `mutating: add-only` (not `read-only`) for all four, each with a concrete `gate3_location` naming its real `<packet_scratch>` write path; `route-validate.sh` exits 0 after the edit. |
| REQ-003 | DR-03: the unused `memory_index_scan` grant is removed from the `memory` route and the router frontmatter. | `grep -n 'memory_index_scan' .opencode/commands/doctor/_routes.yaml` shows it absent from the `memory` route's `mcp_tools` block; `grep -c 'memory_index_scan' .opencode/commands/doctor/speckit.md` returns 0; `doctor_update.yaml:399`'s usage is untouched. |
| REQ-004 | DR-04: `route-validate.py` gains route→script existence, target-set parity, and read-only mutation-policy checks, landed together with REQ-002/REQ-003. | `route-validate.py --self-test`-style fixtures (or new equivalent fixtures) exercise all three new checks; running `bash .opencode/commands/doctor/scripts/route-validate.sh` after REQ-001/002/003/005/006 land exits 0; the new read-only-policy check would have failed on the pre-fix `memory`/`causal-graph`/`code-graph`/`deep-loop` routes (verified against a saved pre-fix fixture or git diff). |
| REQ-005 | DR-05: `_routes.yaml`'s header no longer falsely claims advisor consumption of `trigger_phrases`; `route-validate.py`'s G1 message matches. | `grep -n 'Consumed by' .opencode/commands/doctor/_routes.yaml` shows text stating the field is not currently harvested by either advisor implementation; `grep -n 'will lose recall' .opencode/commands/doctor/scripts/route-validate.py` returns 0 (message reworded to drop the advisor-consumption implication). |
| REQ-006 | DR-06: `doctor_fable-mode.yaml` carries a `mutation_boundaries:` block instead of prose. | `grep -c 'mutation_boundaries:' .opencode/commands/doctor/assets/doctor_fable-mode.yaml` returns 1 (was 0); `grep -c 'read_only_invariant:' .opencode/commands/doctor/assets/doctor_fable-mode.yaml` returns 0 (was 1); `route-validate.sh` exits 0 after the edit. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `speckit.md`'s Workflow Assets table and all three `doctor_speckit_presentation.txt` displays (menu, valid-targets, subsystem table) list 10/10 `_routes.yaml` routes (was 9/10); target-set diff against the manifest is empty both directions.
- **SC-002**: `_routes.yaml`'s `memory`/`causal-graph`/`code-graph`/`deep-loop` routes are `add-only` with concrete `gate3_location` values, and the `memory` route's `mcp_tools` no longer lists `memory_index_scan`.
- **SC-003**: `route-validate.py` includes script-existence, target-set-parity, and read-only-mutation-policy checks; `bash .opencode/commands/doctor/scripts/route-validate.sh` exits 0 after all six findings are fixed.
- **SC-004**: `_routes.yaml`'s header and `route-validate.py`'s G1 message no longer imply Skill Advisor consumes doctor `trigger_phrases`; `doctor_fable-mode.yaml` declares `mutation_boundaries:` matching its 10 routed siblings.
- **SC-005**: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-folder> --strict` exits 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `route-validate.sh` requires `python3` with PyYAML | Validator returns exit 3 (missing dependency) instead of a real pass/fail | Confirm PyYAML availability before each re-validate; record exit 3 as an environment gap, not a manifest failure. |
| Risk | Editing `_routes.yaml` or the four target YAMLs introduces a new tri-existence or schema regression | High | Re-run `route-validate.sh` (exit 0 required) after every manifest/YAML edit; keep edits surgical and scoped to the six findings. |
| Risk | Renumbering the presentation menu (DR-01) misaligns the "Accepted answers" table or the "Press 1-N, 0, or X." prompt | Med | Update the numbered menu, the accepted-answers table, and the prompt text together in one edit; grep-verify option count parity. |
| Risk | DR-02's reclassification to `add-only` requires a non-empty `gate3_location`; an imprecise path breaks the manifest's own schema contract | Med | Use each YAML's actual `<packet_scratch>/...` write path (already present in `phase_3_report`/`phase_2_proposal` `outputs`) verbatim as `gate3_location`. |
| Dependency | DR-04's new checks must not regress the existing D/E/F/G/H assertions | Med | Add new checks as new lettered sections (e.g. I/J/K) after H; re-run `--self-test` plus a manual pass against the fixed manifest. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: `route-validate.sh` must remain deterministic — identical exit code and assertion output across repeated runs against an unchanged `_routes.yaml`.
- **NFR-R02**: The DR-04 read-only mutation-policy check must not produce false positives against any of the 6 routes that stay genuinely `read-only` (`embeddings`, `skill-advisor` note: `skill-advisor` is `mutates`, `skill-budget`, `parent-skill`, `skill-graph-freshness`, `fable-mode`).

### Maintainability
- **NFR-M01**: The DR-01 fix must be structurally traceable back to `_routes.yaml` (i.e., a future new route added to the manifest should be easy to also add to the three presentation displays via the same pattern), not a one-off hardcoded row.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- **Route count changes**: if a future route is added/removed from `_routes.yaml`, the DR-04 target-set-parity check must fail loudly rather than silently pass with a stale display.
- **Menu renumbering**: DR-01's fix must renumber every option after the insertion point (the former option `10` for `fable-mode` becomes `11`); a partial renumber that duplicates or skips a digit is a regression, not a fix.

### Error Scenarios
- **PyYAML unavailable**: `route-validate.sh` exits 3 (documented environment gap); this phase's re-validation step must distinguish exit 3 from a real assertion failure (non-zero from `route-validate.py` itself).
- **`gate3_location` left as `"n/a (...)"` after reclassifying to `add-only`**: DR-04's read-only-policy check (or a schema check) must catch an `add-only` route with an `n/a` `gate3_location` as inconsistent.

### State Transitions
- **Partial fix landed**: if DR-02/DR-03 land without DR-04, `route-validate.py` cannot yet catch a regression to the old read-only-but-writes pattern — this is why plan.md sequences DR-04 together with DR-02/DR-03.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- DR-02's fix has two options per the 001 synthesis: reclassify to `add-only`, or remove the packet-scratch writes and render to stdout only. **RESOLVED (default)**: reclassify to `add-only` — the writes are useful diagnostic artifacts and removing them would be a behavior regression, not a classification fix.
- Should DR-04's new checks live in `route-validate.py` as new lettered sections, or as a separate script? **RESOLVED (default)**: new lettered sections (I/J/K) in the existing script, consistent with its current A–H structure and its single `route-validate.sh` entry point.
- Is a recorded exit-75/exit-3 sufficient run-proof for the read-only targets touched indirectly by these fixes, or must this phase execute them? **Deferred to 006-validation-closeout** per the phase routing note — this phase re-validates `route-validate.sh` only.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Findings Source**: `../001-conformance-deep-research/research/research.md` §3.2 (DOCTOR), §4 (per-target execution results), §6 (remediation routing)
<!-- /ANCHOR:related-docs -->

---

<!--
LEVEL 2 SPEC (~250 lines)
- Core + Level 2 addendum
- NFRs and Edge Cases added
- Verification-focused documentation
- Findings-driven (DR-01..DR-06), not speculative pre-findings scope
-->
