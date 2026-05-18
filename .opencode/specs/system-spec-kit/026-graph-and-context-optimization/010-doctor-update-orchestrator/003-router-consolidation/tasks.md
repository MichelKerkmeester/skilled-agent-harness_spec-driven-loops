---
title: "Tasks: Doctor Router Phase 1 [system-spec-kit/026-graph-and-context-optimization/010-doctor-update-orchestrator/003-router-consolidation/tasks]"
description: "Decomposed task list for the additive /doctor router + /doctor:mcp + _routes.yaml + route-validate.sh + 4-runtime mirrors."
trigger_phrases:
  - "013/004 router phase tasks"
  - "doctor router task graph"
  - "route-validate tasks"
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
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-014-001-router-phase-2026-05-11"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Doctor Router Phase 1 (Additive)

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## TASK NOTATION

| Marker | Meaning |
|--------|---------|
| `[x]` | Complete |
| `[~]` | In progress |
| `[ ]` | Pending |

Each task keeps its original `T-###` identifier so references from `plan.md`, `checklist.md`, and `decision-record.md` remain stable.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## PHASE 1: SETUP

### T-001 — Scaffold 013 phase parent (lean trio)
- [x] **Effort:** 10 min
- [x] **Files:**
  - `.opencode/specs/.../010-doctor-update-orchestrator/spec.md`
  - `.opencode/specs/.../010-doctor-update-orchestrator/description.json`
  - `.opencode/specs/.../010-doctor-update-orchestrator/graph-metadata.json`

### T-002 — Scaffold 003-router-consolidation Level 2 docs
- [~] **Effort:** 30-40 min
- [x] `spec.md`
- [x] `plan.md`
- [~] `tasks.md`
- [ ] `checklist.md`
- [ ] `decision-record.md`
- [ ] `description.json`
- [ ] `graph-metadata.json`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

### T-003 — Author `_routes.yaml`
- [ ] **Effort:** 10-15 min
- [ ] **File:** `.opencode/commands/doctor/_routes.yaml`
- [ ] Exactly 7 routes: `memory`, `causal-graph`, `code-graph`, `deep-loop`, `cocoindex`, `skill-advisor`, `skill-budget`.
- [ ] Each route has all 8 required keys: `target`, `yaml`, `setup_vars`, `allowed_flags`, `mutating`, `gate3_location`, `mcp_tools`, `trigger_phrases`.
- [ ] `yq '.routes | length' _routes.yaml == 7`.

### T-004 — Author `.opencode/commands/doctor.md` (router)
- [ ] **Effort:** 20-30 min
- [ ] **File:** `.opencode/commands/doctor.md`
- [ ] ~250-300 LOC.
- [ ] Frontmatter description <= 110 chars.
- [ ] `argument-hint: "<target> [flags] | list | ?"`.
- [ ] `allowed-tools` matches union from `update.md`.
- [ ] Tier 1 target parser -> Tier 2 per-target flag parser.
- [ ] Combined GATE 3 STATUS table with mutation class column.
- [ ] Examples for all 7 targets in argv-positional form.
- [ ] `--target=<name>` documented as compatibility alias.

### T-005 — Author `.opencode/commands/doctor/mcp.md`
- [ ] **Effort:** 10-15 min
- [ ] **File:** `.opencode/commands/doctor/mcp.md`
- [ ] ~150 LOC.
- [ ] Two sub-actions: `install` / `debug` (argv-positional).
- [ ] Loads `doctor_mcp_install.yaml` or `doctor_mcp_debug.yaml`.
- [ ] Frontmatter `allowed-tools` matches the union of `mcp_install` + `mcp_debug`.

### T-006 — Author `route-validate.sh`
- [ ] **Effort:** 15 min
- [ ] **File:** `.opencode/commands/doctor/scripts/route-validate.sh`
- [ ] Bash + `yq` script.
- [ ] Assertions per `plan.md` Step 6.
- [ ] Self-tests at the bottom (corrupt fixtures -> non-zero exit).
- [ ] `chmod +x` applied; `bash -n` passes.

### T-007 — Mirror to `.claude/commands/`
- [ ] **Effort:** 5 min
- [ ] `.claude/commands/doctor.md`
- [ ] `.claude/commands/doctor/mcp.md`
- [ ] Body-equivalent markdown to `.opencode`; frontmatter adjusted only if Claude-specific.

### T-008 — Mirror to `.gemini/commands/`
- [ ] **Effort:** 5 min
- [ ] `.gemini/commands/doctor.md`
- [ ] `.gemini/commands/doctor/mcp.md`
- [ ] Body-equivalent markdown to `.opencode`.

### T-009 — Mirror to `.codex/commands/` (TOML)
- [ ] **Effort:** 10 min
- [ ] `.codex/commands/doctor.toml`
- [ ] `.codex/commands/doctor/mcp.toml`
- [ ] TOML envelope: `description = "..."`, `model = "..."`, `body = """..."""`.
- [ ] Body content matches `.opencode/commands/doctor.md` markdown body token-by-token per `feedback_codex_toml_body_drift`.
- [ ] Workspace-write sandbox declared.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

### T-010 — Verification gate
- [ ] **Effort:** 20-30 min
- [ ] `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-packet> --strict` exits 0.
- [ ] `bash .opencode/commands/doctor/scripts/route-validate.sh` exits 0.
- [ ] 9 smoke tests per `plan.md` Step 8.
- [ ] Skill Advisor lexical-lane test for all 7 historical trigger phrases.
- [ ] 4-runtime parity diff.
- [ ] Acceptance: all gates green; `_memory.continuity.completion_pct: 100` on this packet.

### T-011 — Memory save + handover
- [ ] **Effort:** 5 min
- [ ] Run `generate-context.js` for this packet.
- [ ] Update `description.json` + `graph-metadata.json`.
- [ ] Update phase-parent `_memory.continuity.next_safe_action` to `Scaffold 004-hard-cutover`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## COMPLETION CRITERIA

- T-001 through T-011 are complete or have a documented user-approved deferral.
- Strict validation passes for this Level 2 packet.
- `route-validate.sh` passes against the shipped manifest.
- The additive router does not modify existing `/doctor:*`, `/doctor:update`, or doctor YAML assets.
- 4-runtime mirrors are body-equivalent.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## CROSS-REFERENCES

### Dependency Graph

```text
T-001
  -> T-002
    -> T-003
      -> T-004
      -> T-005
        -> T-006
          -> T-007 / T-008 / T-009
            -> T-010
              -> T-011
```

Critical path: T-001 -> T-002 -> T-003 -> T-004 -> T-006 -> T-007/T-008/T-009 -> T-010 -> T-011.

T-005 can run in parallel with T-004 once T-003 (`_routes.yaml`) is authored. T-007, T-008, and T-009 can run in parallel once T-004 and T-005 are complete.

### Related Docs

- `spec.md` — requirements and success criteria.
- `plan.md` — implementation phases, architecture, dependencies, and rollback.
- `checklist.md` — verification checkpoints.
- `decision-record.md` — ADR rationale for router consolidation choices.
<!-- /ANCHOR:cross-refs -->
