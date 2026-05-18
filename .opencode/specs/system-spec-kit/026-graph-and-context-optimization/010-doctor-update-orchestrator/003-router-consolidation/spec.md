---
title: "Feature Specification: Doctor Router Phase 1 [system-spec-kit/026-graph-and-context-optimization/010-doctor-update-orchestrator/003-router-consolidation/spec]"
description: "Phase 1 of the doctor command consolidation: author the new /doctor router (.opencode/commands/doctor.md), /doctor:mcp infra command (.opencode/commands/doctor/mcp.md), _routes.yaml canonical manifest, and route-validate.sh CI assertion. Ships ADDITIVELY alongside the existing 10 commands so both /doctor memory and /doctor:memory invocation forms succeed during the validation window. Mirrors land in .claude / .gemini / .codex in the same packet. No deletes, no playbook changes, no YAML modifications."
trigger_phrases:
  - "003-router-consolidation"
  - "doctor router phase 1"
  - "/doctor router"
  - "_routes.yaml"
  - "route-validate.sh"
  - "argv-positional routing"
  - "manifest-driven doctor"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/010-doctor-update-orchestrator/003-router-consolidation"
    last_updated_at: "2026-05-11T16:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Phase 1 router shipped + verified"
    next_safe_action: "Phase 2 lives in 004-hard-cutover"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-014-001-router-phase-2026-05-11"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->"
---
# Feature Specification: Doctor Router Phase 1 (Additive)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 (verification gates required) |
| **Priority** | P2 |
| **Status** | In Progress |
| **Created** | 2026-05-11 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Predecessor** | `../002-deep-review-remediation/spec.md` |
| **Successor** | `../004-hard-cutover/spec.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 10 `/doctor:*` markdown commands in `.opencode/commands/doctor/` share ~50 lines of duplicated boilerplate per file. The 10 YAML workflow assets are self-sufficient and own all execution semantics; the markdown's only real job is to parse `$ARGUMENTS`, resolve setup variables, and hand off to the right YAML. This is a routing problem that today is solved by 10 near-identical .md files instead of one router plus a manifest. Maintenance cost compounds across 4 runtime mirrors (40 total .md files) and a 23-scenario manual playbook that hard-codes the per-command surface.

### Purpose
Ship a new `/doctor` router command (argv-positional dispatch: `/doctor <target> [flags]`) plus a small companion `/doctor:mcp` command (which bundles `mcp_debug` and `mcp_install` behind `install` / `debug` sub-actions). The router reads a canonical `_routes.yaml` manifest to dispatch to one of 7 Gen-A YAMLs while preserving each target's setup-variable contract, mutation-class classification, and trigger-phrase recall. Ships in Phase 1 ALONGSIDE the existing 10 commands so that user workflows continue to function during validation; old `.md` files are NOT deleted in Phase 1 (that's Phase 2's job).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `.opencode/commands/doctor.md` (router, ~250-300 LOC) — argv-positional target resolution + per-target flag parsing + YAML handoff
- `.opencode/commands/doctor/mcp.md` (~150 LOC) — `install` / `debug` argv-positional sub-action; loads `doctor_mcp_install.yaml` or `doctor_mcp_debug.yaml`
- `.opencode/commands/doctor/_routes.yaml` — canonical manifest: target → YAML → setup_vars → allowed_flags → mutating class → mcp_tools → trigger_phrases
- `.opencode/commands/doctor/scripts/route-validate.sh` — CI assertion that each route's YAML exists in `assets/`, each route's `mcp_tools` falls within the router's frontmatter `allowed-tools` union, no duplicate target names, allowed_flags don't collide across targets
- Mirrors:
  - `.claude/commands/doctor.md` + `.claude/commands/doctor/mcp.md` (body-equivalent to .opencode)
  - `.gemini/commands/doctor.md` + `.gemini/commands/doctor/mcp.md` (body-equivalent)
  - `.codex/commands/doctor.toml` + `.codex/commands/doctor/mcp.toml` (TOML-shaped per Codex Path Convention; workspace-write sandbox)

### Out of Scope
- DELETING the existing 10 `.md` files (`causal-graph`, `cocoindex`, `code-graph`, `deep-loop`, `memory`, `skill-advisor`, `skill-budget`, `mcp_debug`, `mcp_install` × 4 runtimes) — that's Phase 2.
- Modifying the 10 YAML workflow files in `.opencode/commands/doctor/assets/` — all stay verbatim.
- Modifying `.opencode/commands/doctor/update.md` — the orchestrator stays standalone.
- Modifying the 4 helper scripts in `.opencode/commands/doctor/scripts/` (`audit_descriptions.py`, `doctor-runtime-bootstrap.sh`, `mcp-doctor-lib.sh`, `mcp-doctor.sh`).
- sed-updating the 23 manual playbook scenarios at `system-spec-kit/manual_testing_playbook/23--doctor-commands/` — that's Phase 2.
- Rebuilding the Skill Advisor index — that's Phase 2 (it happens after the old descriptions are gone).
- Modifying `/doctor:update`'s YAML cross-references — that's Phase 2.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Create | This file. |
| `plan.md` | Create | Phase 1 implementation plan. |
| `tasks.md` | Create | Decomposed task list. |
| `checklist.md` | Create | Verification gates. |
| `decision-record.md` | Create | ADRs (Option C rationale, manifest-file split, argv-positional UX, two-phase rollout). |
| `description.json` | Create | Packet identity. |
| `graph-metadata.json` | Create | Packet metadata + parent_id. |
| `.opencode/commands/doctor.md` | Create | The router. |
| `.opencode/commands/doctor/mcp.md` | Create | MCP infra bundling. |
| `.opencode/commands/doctor/_routes.yaml` | Create | Canonical route manifest. |
| `.opencode/commands/doctor/scripts/route-validate.sh` | Create | CI assertion. |
| `.claude/commands/doctor.md` | Create | Claude mirror (body-equivalent). |
| `.claude/commands/doctor/mcp.md` | Create | Claude mirror. |
| `.gemini/commands/doctor.md` | Create | Gemini mirror. |
| `.gemini/commands/doctor/mcp.md` | Create | Gemini mirror. |
| `.codex/commands/doctor.toml` | Create | Codex mirror (TOML form). |
| `.codex/commands/doctor/mcp.toml` | Create | Codex mirror (TOML form). |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 — Hard blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The router parses the positional target FIRST and the per-target flag schema SECOND. Global flag pre-parse is forbidden. | Router code structure: (1) read first positional arg → bind `target`, (2) `case "$target" in` block runs per-target flag parser, (3) load `assets/doctor_<target>.yaml` and hand off. Unit test: invoking `/doctor memory --confidence-threshold=0.8` raises a clear error (--confidence-threshold belongs to `causal-graph`, not `memory`). |
| REQ-002 | `_routes.yaml` enumerates exactly 7 routes (memory, causal-graph, code-graph, deep-loop, cocoindex, skill-advisor, skill-budget) with the schema declared in §5. | `yq '.routes | length' _routes.yaml == 7`; each route has the required keys (target, yaml, setup_vars, allowed_flags, mutating, gate3_location, mcp_tools, trigger_phrases). |
| REQ-003 | Each route's `yaml` field references a file that exists in `.opencode/commands/doctor/assets/`. | `route-validate.sh` exits 0; no missing-YAML errors. |
| REQ-004 | Each route's `mcp_tools` is a subset of the router's frontmatter `allowed-tools` union. | `route-validate.sh` asserts this; failures point at the offending route. |
| REQ-005 | Router's frontmatter `allowed-tools` is the union of all 7 routes' `mcp_tools` PLUS the tools needed by `/doctor:mcp` install/debug sub-actions. | Same as `/doctor:update`'s allowlist today (~32 tools). |
| REQ-006 | The combined GATE 3 STATUS table in the router .md has one row per target citing each target's specific `Location` AND the mutation class (`read-only` / `add-only` / `mutates`). | Manual inspection: skill-budget marked `read-only`; causal-graph marked `add-only`; memory/code-graph/deep-loop/cocoindex/skill-advisor marked `mutates`. |
| REQ-007 | `/doctor:mcp install` and `/doctor:mcp debug` each resolve to the correct YAML (`doctor_mcp_install.yaml` and `doctor_mcp_debug.yaml`). | Smoke test produces identical first-message output as today's `/doctor:mcp_install` / `/doctor:mcp_debug`. |
| REQ-008 | All 7 Gen-A target invocations (`/doctor memory --dry-run`, `/doctor causal-graph --dry-run`, etc.) produce equivalent first-message output to today's `/doctor:<target>` form. | Smoke test for each of 7 + 2 MCP sub-actions. |
| REQ-009 | Router argv-positional UX is the documented primary form. `--target=<name>` is preserved as a compatibility alias. | Examples section shows argv-positional first; `--target=<name>` mentioned in the per-target flag parser case block. |
| REQ-010 | Cross-runtime mirrors (.claude, .gemini) have body-equivalent markdown to the canonical .opencode files; .codex has TOML form with same body content. | `diff` shows zero non-whitespace differences in markdown bodies; codex TOML body matches token-by-token. |

### P1 — Quality gates (verification)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-101 | The router's frontmatter `description` fits the Skill Advisor per-command soft target (≤110 chars). | `wc -c` on description string. |
| REQ-102 | `_routes.yaml` aggregate `trigger_phrases` cover all 7 historical /doctor:<target> trigger phrases at confidence ≥ 0.8 in the Skill Advisor lexical lane. | `skill_advisor.py "memory continuity index drift" --threshold 0.8 → /doctor`; same for other 6 targets' phrases. |
| REQ-103 | `route-validate.sh` exits 0 on the fresh manifest; non-zero on intentionally corrupted manifest (test fixtures). | Script self-tests pass. |
| REQ-104 | Router does NOT modify any of the 10 YAML files in `.opencode/commands/doctor/assets/`. | `git diff` shows zero changes under `assets/`. |
| REQ-105 | `/doctor:update` orchestrator behavior is unchanged. | `update.md` and `assets/doctor_update.yaml` are byte-identical to pre-router-consolidation state; smoke test of `/doctor:update --dry-run` produces same output. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

### `_routes.yaml` schema (canonical)

```yaml
routes:
  - target: <string>        # e.g. "memory"
    yaml: <string>          # e.g. "doctor_memory.yaml"
    setup_vars: [<string>]  # e.g. [execution_mode, intent, incremental, no_snapshot, dry_run]
    allowed_flags: [<string>]  # e.g. ["--incremental=true|false", "--no-snapshot", "--dry-run"]
    mutating: read-only | add-only | mutates
    gate3_location: <string>   # human-readable Location citation
    mcp_tools: [<string>]      # subset of router's frontmatter allowed-tools union
    trigger_phrases: [<string>] # advisor lexical-routing phrases
```

### End-to-end success criteria

- **SC-001**: All 17 files (4 router/mcp + 1 routes.yaml + 1 validate.sh + 4 .claude mirrors + 2 .gemini mirrors + 2 .codex mirrors + 3 lean-trio spec files) exist with non-empty content.
- **SC-002**: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-packet> --strict` exits 0.
- **SC-003**: `bash .opencode/commands/doctor/scripts/route-validate.sh` exits 0 on the shipped manifest.
- **SC-004**: For each of 7 Gen-A targets, `/doctor <target> --dry-run` produces equivalent output to `/doctor:<target> --dry-run`.
- **SC-005**: `/doctor:mcp install --server spec-kit-memory` reaches `doctor_mcp_install.yaml`; `/doctor:mcp debug --fix` reaches `doctor_mcp_debug.yaml`.
- **SC-006**: `/doctor:update --dry-run` is byte-equivalent (in output) to pre-router-consolidation state.
- **SC-007**: 4-runtime mirror parity: `.opencode` ↔ `.claude` ↔ `.gemini` markdown bodies diff zero non-whitespace; `.codex` TOML body matches token-by-token.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:effort -->
## 6. EFFORT ESTIMATION

| Component | LOC est. | Time est. |
|-----------|----------|-----------|
| 013 phase parent (lean trio) | 60 | 10 min |
| 003-router-consolidation Level 2 docs (spec/plan/tasks/checklist/decision-record + lean trio) | 500-600 | 30-40 min |
| `.opencode/commands/doctor.md` (router) | 250-300 | 20-30 min |
| `.opencode/commands/doctor/mcp.md` | 150 | 10-15 min |
| `.opencode/commands/doctor/_routes.yaml` | 80-100 | 10 min |
| `.opencode/commands/doctor/scripts/route-validate.sh` | 80-100 | 15 min |
| 4-runtime mirrors (12 files) | 12 × (250 + 150) ÷ 4 ≈ 1200 reused | 15-20 min (mostly copy + format-tweak) |
| Verification (validate.sh, route-validate.sh, smoke tests) | n/a | 20-30 min |
| **Total** | **~2400-2700 LOC across 17 files** | **~2-3 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:edge-cases -->
## 7. EDGE CASES & FAILURE MODES

| Scenario | Expected behavior |
|----------|-------------------|
| User invokes `/doctor` with no target | Router prints SUBSYSTEM MANIFEST table (or interactive menu) and waits for selection. No YAML load. |
| User invokes `/doctor unknown-target` | Router emits "unknown target 'unknown-target'; valid targets: memory, causal-graph, code-graph, deep-loop, cocoindex, skill-advisor, skill-budget" and exits non-zero. No YAML load. |
| User invokes `/doctor memory --confidence-threshold=0.8` (cross-target flag) | Per-target flag parser rejects: "`--confidence-threshold` is not a valid flag for `memory`; did you mean `/doctor causal-graph --confidence-threshold=0.8`?" |
| User invokes `/doctor list` or `/doctor ?` | Router prints SUBSYSTEM MANIFEST table and exits 0. No YAML load. |
| User invokes `/doctor --help` or `/doctor <target> --help` | Router (or per-target case block) emits the appropriate help text and exits 0. |
| `_routes.yaml` is missing | Router emits a clear error citing the manifest path; exits non-zero before any YAML load. |
| `_routes.yaml` references a non-existent YAML asset | `route-validate.sh` catches this in CI; runtime router emits "YAML asset doctor_<target>.yaml not found in assets/". |
| User invokes `/doctor:mcp` with no sub-action | `mcp.md` shows the install/debug menu and waits for selection. |
| User invokes `/doctor:mcp unknown-action` | `mcp.md` rejects: "unknown action; valid: install, debug". |
| User invokes `/doctor:update` (orchestrator) | Unchanged behavior — `update.md` is not touched. |
| Old `/doctor:memory` invocation (Phase 1 window, both forms exist) | Loads existing `memory.md` setup phase and YAML. Both forms work additively. |
| Old `/doctor:memory` invocation (post-Phase 2) | Advisor suggests `/doctor memory`. No file to load. |
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:nfr -->
## 8. NON-FUNCTIONAL REQUIREMENTS

- **Performance**: Router setup phase MUST resolve target + per-target flags + load YAML in < 100ms (file reads only; no MCP calls during setup).
- **Determinism**: Two invocations of `/doctor <target> --dry-run` produce identical reports.
- **Auditability**: Every router dispatch logs `target`, resolved flags, and chosen YAML asset to standard out at INFO level (for debugging only).
- **Compatibility**: Phase 1 is ADDITIVE — zero behavior regression on `/doctor:<target>` invocations, `/doctor:update`, or any of the 10 underlying YAMLs.
- **Maintainability**: New targets are added by appending to `_routes.yaml` only; the router .md stays untouched after Phase 1 ships.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:risks -->
## 9. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Flag-parsing order bug (codex's #1 surprise risk) | Cross-target flags silently bind to wrong schema | Router code reviewed pre-merge; cross-schema injection unit test (see REQ-001) |
| Risk | `allowed-tools` union grows uncontrolled | Router authorizes more tools than any individual target needs | `route-validate.sh` asserts per-target `mcp_tools` subsets are correct; future audits can spot orphan tools |
| Risk | Advisor trigger-phrase recall regression | Old phrases stop resolving | Per-target `trigger_phrases` in `_routes.yaml` ingested into advisor; smoke tests in §5 SC-002 |
| Risk | Codex TOML body drift | One runtime's command falls out of sync with markdown mirrors | 4-runtime parity smoke test; codex TOML body inspected manually per `feedback_codex_toml_body_drift` |
| Risk | Phase 1 ships but Phase 2 stalls indefinitely | Both invocation forms live forever; defeats the consolidation purpose | Phase 2 scaffolding tracked as the immediate next action on `_memory.continuity.next_safe_action` once Phase 1 closes |
| Dependency | Existing doctor YAML assets remain stable and self-sufficient | Router delegates to unchanged YAML workflows | Phase 1 validates route-to-YAML resolution without modifying assets. |
| Dependency | Existing shipped router implementation files remain untouched in this validation pass | Strict-doc cleanup must not change runtime behavior | This packet-compliance pass edits docs only. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Assessment |
|-----------|------------|
| Scope | Level 2: multiple authored command surfaces plus cross-runtime mirrors, but no architecture rewrite. |
| Risk | Medium: dispatch and mirror parity can regress existing workflows if validation is weak. |
| Verification | Strict spec validation, `route-validate.sh`, smoke tests, advisor checks, and parity diffs. |
| Rollback | Revert the 7 new Phase 1 implementation files and their mirrors; existing `/doctor:*` files remain available throughout Phase 1. |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

(All resolved at intake or deferred to Phase 2.)

- **Q-001** *(answered 2026-05-11)*: Should Phase 1 delete existing `/doctor:*` files? **Answer**: No. Phase 1 is additive; Phase 2 owns deletion and reference updates.
- **Q-002** *(answered 2026-05-11)*: Should `/doctor:update` move into the router? **Answer**: No. It remains standalone.
- **Q-003** *(answered 2026-05-11)*: Should the route manifest live inside the router markdown? **Answer**: No. `_routes.yaml` is canonical for validation and advisor ingestion.
<!-- /ANCHOR:questions -->
