---
title: "Implementation Plan: Phase 3: remediation-doctor"
description: "Ordered fix sequence for DR-01 through DR-06: independent doc/YAML fixes first (DR-01, DR-05, DR-06), then route-validate.py's new checks (DR-04) landed before and re-run after the route-manifest edits (DR-02, DR-03) they are meant to catch, closing with a full route-validate.sh pass and validate.sh --strict."
trigger_phrases:
  - "implementation"
  - "plan"
  - "doctor remediation"
  - "route-validate extension"
  - "plan core"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/131-command-agent-conformance-audit/003-remediation-doctor"
    last_updated_at: "2026-07-11T08:49:19Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored fix-sequenced plan for DR-01..DR-06"
    next_safe_action: "Execute Phase 1-4 steps below in order"
    blockers: []
    key_files:
      - ".opencode/commands/doctor/speckit.md"
      - ".opencode/commands/doctor/_routes.yaml"
      - ".opencode/commands/doctor/scripts/route-validate.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "conformance-audit-132"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->
# Implementation Plan: Phase 3: remediation-doctor

<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown (command docs), YAML (route manifest + target workflows), Python 3 + PyYAML (validator) |
| **Framework** | None — config-driven router/manifest pattern (`.opencode/commands/doctor/`) |
| **Storage** | None (docs/YAML only); diagnostic writes stay under `<packet_scratch>`, unaffected by this phase |
| **Testing** | `route-validate.py --self-test` fixture harness (extend with new fixtures for DR-04's I/J/K checks); `bash .opencode/commands/doctor/scripts/route-validate.sh` as the pass/fail gate |

### Overview
Six confirmed findings (DR-01..DR-06) touch `speckit.md`, `_routes.yaml`, four target YAMLs, the presentation contract, and `route-validate.py`. The approach is: fix the three findings with no cross-dependency first (DR-01 discoverability, DR-05 header/message honesty, DR-06 schema uniformity), then extend the validator (DR-04) and use it to prove DR-02/DR-03's route-manifest reclassification before and after the edit, closing with a full validator pass and `validate.sh --strict` on this packet.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (spec.md §2-3)
- [x] Success criteria measurable (spec.md §5, grep/exit-code based)
- [x] Dependencies identified (Phase 2 complete; 001 findings confirmed on disk)
- [x] NFRs defined with targets (spec.md §7)

### Definition of Done
- [ ] All REQ-001..REQ-006 acceptance criteria met
- [ ] `route-validate.sh` exits 0 after all six fixes land
- [ ] Docs updated (spec/plan/tasks/checklist all reflect final state)
- [ ] `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-folder> --strict` exits 0
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Config-driven router/manifest: `speckit.md` is a thin router that reads `_routes.yaml` (the canonical manifest) and dispatches to per-target YAML workflows; `doctor_speckit_presentation.txt` is the presentation source of truth for everything user-facing; `route-validate.py` is the CI assertion layer over the manifest.

### Key Components
- **`speckit.md`**: router doc + frontmatter `allowed-tools` grant; owns the Workflow Assets table (DR-01) and the tool grant scope (DR-03).
- **`_routes.yaml`**: canonical route manifest; owns `mutating`/`gate3_location` classification (DR-02), `mcp_tools` grants (DR-03), and the header provenance comment (DR-05).
- **`assets/doctor_{memory,causal-graph,code-graph,deep-loop}.yaml`**: per-target workflows whose `phase_3_report`/`phase_2_proposal` write descriptions must stay consistent with the manifest's `mutating` field (DR-02).
- **`assets/doctor_speckit_presentation.txt`**: startup menu, valid-targets line, subsystem manifest table — the three displays that must mirror `_routes.yaml` (DR-01).
- **`assets/doctor_fable-mode.yaml`**: the one route YAML still using prose instead of the `mutation_boundaries:` schema (DR-06).
- **`scripts/route-validate.py`** (+ `route-validate.sh` wrapper): CI assertion script; gains three new checks (DR-04) that make DR-01/DR-02/DR-03-class regressions structurally impossible to reintroduce silently.

### Data Flow
1. A user runs `/doctor <target>`; `speckit.md` resolves the target against `_routes.yaml`.
2. The router loads the matched `assets/doctor_<target>.yaml` for execution behavior and `doctor_speckit_presentation.txt` for all user-facing text.
3. `route-validate.sh` is the independent CI-side path: it parses `_routes.yaml` + `speckit.md` frontmatter and asserts schema/existence/subset invariants without executing any target.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Applies — all six findings are confirmed audit defects (`research_intent=fix_bug`).

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|---------------|
| `speckit.md` Workflow Assets table | Documents 9/10 routes | Update: add `skill-graph-freshness` row | `grep -c 'skill-graph-freshness' speckit.md` |
| `doctor_speckit_presentation.txt` (menu/valid-targets/subsystem table) | Mirrors `speckit.md`'s stale 9-target view | Update: add row/option to all three displays, renumber | `grep -c 'skill-graph-freshness'` per display section |
| `_routes.yaml` (`memory`/`causal-graph`/`code-graph`/`deep-loop` routes) | Declares `mutating: read-only` while writing packet-scratch artifacts | Update: `mutating: add-only` + concrete `gate3_location` | `grep -A1 'target: <name>'` shows `add-only` |
| `_routes.yaml` (`memory` route `mcp_tools`) | Grants unused `memory_index_scan` | Update: remove the grant | `grep -n memory_index_scan _routes.yaml` excludes the memory route block |
| `speckit.md` frontmatter `allowed-tools` | Globally grants `memory_index_scan` | Update: remove (no route needs it after DR-03) | `grep -c memory_index_scan speckit.md` = 0 |
| `_routes.yaml` header comment | Falsely claims advisor consumes `trigger_phrases` | Update: state true scope | `grep -n 'Consumed by' _routes.yaml` |
| `route-validate.py` | No script-existence/parity/read-only-policy checks | Update: add I/J/K assertion sections | `route-validate.sh` exit code + new self-test fixtures |
| `doctor_fable-mode.yaml` | Prose `read_only_invariant:` | Update: `mutation_boundaries:` block | `grep -c mutation_boundaries: doctor_fable-mode.yaml` = 1 |

Required inventories:
- Same-class producers: DR-02's four routes are the only `read-only`-labeled routes with packet-scratch writes — confirmed by reading all 10 route blocks in `_routes.yaml` and cross-checking each target YAML's `phase_*_report`/`phase_*_proposal` output section during spec authoring (see spec.md §3 Files to Change for exact line ranges).
- Consumers of changed symbols: `rg -n 'skill-graph-freshness' .opencode/commands/doctor/` (must include `speckit.md` + presentation after the fix); `rg -n 'memory_index_scan' .opencode/commands/doctor/` (must resolve to only `doctor_update.yaml:399` after the fix).
- Matrix axes: 6 findings × {doc/YAML edit, validator coverage, re-validate}. No security/path/parser/redaction dimension applies — these are documentation/manifest-honesty fixes, not runtime logic changes.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Independent fixes (DR-01, DR-05, DR-06)
No cross-finding dependency; each touches a distinct primary file.
- [ ] DR-01: Add `skill-graph-freshness` to `speckit.md`'s Workflow Assets table (between `parent-skill` and `fable-mode`).
- [ ] DR-01: Add `skill-graph-freshness` to `doctor_speckit_presentation.txt`'s numbered menu (new option between `parent-skill` and `fable-mode`), the "Valid targets:" line, and the subsystem manifest table; renumber every option after the insertion point and the "Press 1-N, 0, or X." prompt text; add a matching row to the "Accepted answers" table.
- [ ] DR-05: Rewrite `_routes.yaml`'s header `# Consumed by:` line (lines 1-24) to state doctor `trigger_phrases` are not currently harvested by either advisor implementation.
- [ ] DR-06: Replace `doctor_fable-mode.yaml`'s prose `read_only_invariant:` (lines 20-24) with a `mutation_boundaries:` block matching `doctor_embeddings.yaml:34-40`, preserving the existing wording as `invariant`.
- **Per-step verification**: `grep` checks per REQ-001/005/006 acceptance criteria; `bash .opencode/commands/doctor/scripts/route-validate.sh` exits 0 after this phase (DR-06's schema change and DR-05's comment-only change must not break existing assertions).

### Phase 2: Extend the validator BEFORE the route-manifest fix (DR-04, part 1)
- [ ] Add assertion I (route→script existence): resolve every route's `script_invocations` and fail on a missing script path.
- [ ] Add assertion J (target-set parity): parse `speckit.md`'s Workflow Assets table and `doctor_speckit_presentation.txt`'s menu/valid-targets/subsystem-table target sets; fail if any differs from `_routes.yaml`'s route set.
- [ ] Add assertion K (read-only mutation-policy): fail any `mutating: read-only` route whose target YAML declares a file/DB write (`Write to`, `Write state log to`, `Write report to`) or whose `mcp_tools` includes a known-mutating MCP tool.
- [ ] Add corresponding `--self-test` fixtures (missing-script, target-set-mismatch, read-only-with-write) alongside the existing missing-key/missing-asset/duplicate-target fixtures.
- **Sequencing constraint**: land this BEFORE Phase 3 so assertion K's pre-fix run (next step) is genuine proof, not retrofitted.
- **Verification**: `bash .opencode/commands/doctor/scripts/route-validate.sh --self-test` passes with the 3 new fixtures added; running `route-validate.sh` against the still-unfixed `_routes.yaml` shows assertion K FAILING for `memory`/`causal-graph`/`code-graph`/`deep-loop` (captures the "would have caught it" proof required by REQ-004's acceptance criteria) and assertion J FAILING for the pre-DR-01 target-set mismatch if Phase 1 has not yet landed, or PASSING if it has (Phase 1 must land first — see Phase 4 SEQUENCING note).

### Phase 3: Route-manifest fix (DR-02, DR-03) + target YAML alignment
- [ ] DR-02: Change `mutating: read-only` → `mutating: add-only` for `memory` (27-32), `causal-graph` (60-65), `code-graph` (76-84), `deep-loop` (100-105); set each `gate3_location` to the concrete `<packet_scratch>/...` path already named in that route's `phase_3_report`/`phase_2_proposal` `outputs`.
- [ ] DR-03: Remove `mcp__mk_spec_memory__memory_index_scan` from the `memory` route's `mcp_tools` list (27-39).
- [ ] DR-03: Remove `mcp__mk_spec_memory__memory_index_scan` from `speckit.md`'s frontmatter `allowed-tools` (line 4).
- [ ] DR-02: Align descriptive wording in `doctor_memory.yaml` (202-225), `doctor_causal-graph.yaml` (210-217), `doctor_code-graph.yaml` (174-186), `doctor_deep-loop.yaml` (227-235) so the write-behavior prose matches the new `add-only` classification (cosmetic consistency; no functional change).
- **Sequencing constraint**: Phase 2's assertion K must exist before this step lands (already satisfied by Phase 2 ordering).
- **Verification**: re-run `route-validate.sh`; assertion K now PASSES for all four routes; `grep -n memory_index_scan .opencode/commands/doctor/_routes.yaml` shows it absent from the `memory` block; `grep -c memory_index_scan .opencode/commands/doctor/speckit.md` = 0.

### Phase 4: Full verification
- [ ] Run `bash .opencode/commands/doctor/scripts/route-validate.sh` once against the fully-fixed manifest — expect exit 0 with all assertions (A-K) passing.
- [ ] Run `bash .opencode/commands/doctor/scripts/route-validate.sh --self-test` — expect all fixtures (original 3 + new 3) to correctly fail their negative cases.
- [ ] Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/131-command-agent-conformance-audit/003-remediation-doctor --strict` — expect exit 0.
- [ ] Update `implementation-summary.md` and mark `checklist.md` items with evidence (execution phase only — not part of this planning pass).

**Deferred to `006-validation-closeout`**: executing the read-only `/doctor` targets themselves (e.g. `code-graph`, `embeddings`, `skill-graph-freshness`) to produce the end-to-end run-proof table from `research.md` §4 is explicitly out of scope here — only `route-validate.sh` (a static manifest check, not a target execution) is re-run in this phase. Any doctor doc/YAML/py fix made here must, however, itself re-validate before this phase is considered done.

**Operator-gated**: none of DR-01..DR-06 require an operator decision beyond the two resolved-by-default open questions in spec.md §9 (DR-02's add-only-vs-stdout-only choice; DR-04's in-script-vs-separate-script choice).
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static assertion | `_routes.yaml` schema, existence, subset, parity, mutation-policy invariants | `route-validate.py` (A-K sections) via `route-validate.sh` |
| Fixture/self-test | New DR-04 checks (I/J/K) against synthetic bad manifests | `route-validate.sh --self-test` |
| Grep-based acceptance | Every REQ-001..REQ-006 criterion in spec.md §4 | `grep`/`rg` against the six touched files |
| Spec-packet validation | Document structure, frontmatter, anchors, level consistency | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `python3` + PyYAML | External | Green (confirmed available; baseline `route-validate.sh` run in `research.md` §4 exited 0) | `route-validate.sh` exits 3; treat as environment gap, not assertion failure |
| Phase 2 (`002-remediation-slash-commands`) | Internal | Pending sibling phase | Shared command/asset conventions not yet settled; doctor-specific fixes here do not directly depend on Phase 2's file set, so this is a soft dependency only |
| 001 deep-research findings (DR-01..DR-06) | Internal | Green — all six re-confirmed on disk during this authoring pass | N/A (already satisfied) |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: `route-validate.sh` fails to reach exit 0 after all six fixes land, or a Phase 2/3 edit breaks an existing (A-H) assertion.
- **Procedure**: revert the specific file's edit via `git checkout -- <file>`, re-run `route-validate.sh` to confirm the pre-edit baseline (exit 0 per the 2026-07-10 `research.md` §4 execution table) still holds, then re-attempt the fix in isolation.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (DR-01, DR-05, DR-06) ──┐
                                 ├──> Phase 3 (DR-02, DR-03) ──> Phase 4 (Verify)
Phase 2 (DR-04 validator ext.) ──┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1 (independent fixes) | None | Phase 2's assertion J proof (target-set parity needs the DR-01 fix landed to prove PASS, not just FAIL) |
| Phase 2 (validator extension) | None (assertions can be written before Phase 3) | Phase 3 (assertion K must exist first to prove DR-02/DR-03) |
| Phase 3 (route-manifest fix) | Phase 2 | Phase 4 |
| Phase 4 (verify) | Phase 1, Phase 2, Phase 3 | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase 1 (DR-01, DR-05, DR-06) | Low | 3 small doc/YAML edits |
| Phase 2 (DR-04 validator extension) | Medium | 3 new assertion sections + 3 self-test fixtures in a 281-line Python script |
| Phase 3 (DR-02, DR-03, target YAML alignment) | Low-Medium | 2 manifest edits + 4 cosmetic YAML alignment edits |
| Phase 4 (verification) | Low | 2 script runs + 1 `validate.sh --strict` run |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-execution Checklist
- [ ] Baseline `route-validate.sh` exit code recorded before any edit (confirmed 0 per `research.md` §4, re-confirm at execution start)
- [ ] Baseline `validate.sh --strict` exit code recorded for this spec folder before implementation begins

### Rollback Procedure
1. **Immediate**: identify which of the four phases introduced the regression via the last-passing `route-validate.sh` / `validate.sh --strict` run.
2. **Revert code**: `git checkout -- .opencode/commands/doctor/<file>` for the specific file(s) touched in that phase only — SCOPE LOCK forbids reverting unrelated files.
3. **Verify**: re-run `route-validate.sh` and confirm it returns to the last-known-good exit code.
4. **Resume**: re-attempt the reverted fix in isolation with a narrower diff.

### Data Reversal
- **Has data migrations?** No — this phase edits only Markdown/YAML/Python source files under `.opencode/commands/doctor/`; no database or generated-artifact state is touched.
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN (~220 lines)
- Core + Level 2 addendum
- Phase dependencies and effort estimation
- Enhanced rollback procedure
- Fix-sequenced for DR-01..DR-06, not generic feature phases
-->
