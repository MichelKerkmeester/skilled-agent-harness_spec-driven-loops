---
title: "Implementation Plan: Doctor Router Phase 1 [system-spec-kit/026-graph-and-context-optimization/010-doctor-update-orchestrator/003-skill-advisor-routing-engine-consolidation/plan]"
description: "Step-by-step implementation plan for shipping the additive /doctor router + /doctor:mcp infra command + _routes.yaml manifest + route-validate.sh CI assertion across 4 runtimes."
trigger_phrases:
  - "013/004 router phase plan"
  - "doctor router implementation plan"
  - "_routes.yaml plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/010-doctor-update-orchestrator/003-skill-advisor-routing-engine-consolidation"
    last_updated_at: "2026-05-11T16:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Phase 1 router shipped + verified"
    next_safe_action: "Phase 2 lives in 004-hard-cutover"
    blockers: []
    key_files:
      - "spec.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-014-001-router-phase-2026-05-11"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
---
# Implementation Plan: Doctor Router Phase 1 (Additive)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

**Strategy:** Manifest-driven router. The router .md is mostly UX surface + shared boilerplate (frontmatter, EXECUTION PROTOCOL, CONSTRAINTS, GATE 3 STATUS, examples, troubleshooting). The actual route table — `target → YAML → setup_vars → allowed_flags → mutating class → mcp_tools → trigger_phrases` — lives in a separate `_routes.yaml` file. The router reads the manifest, presents a target menu (or accepts a positional target), runs the per-target flag parser via a `case` block, and hands off to the resolved YAML asset.

**Why not inline the manifest in the router .md?** Two reasons:
1. **Skill Advisor ingestion**: a separate YAML file is a cleaner data source for the advisor's lexical lane than scraping a markdown table.
2. **CI validation**: `route-validate.sh` can `yq` the manifest and assert internal consistency (each `yaml` field references an existing file, each `mcp_tools` subset is within the router's `allowed-tools` union, no duplicate target names).

**Why argv-positional dispatch over `--target=<name>`?** Better UX (kubectl/git convention), no flag noise, naturally extensible. `--target=<name>` is preserved as a compatibility alias for the rare power user who prefers flag-only invocations.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- Phase parent lean trio exists and points at `003-skill-advisor-routing-engine-consolidation`.
- Level 2 packet docs are strict-template compliant before claiming completion.
- Existing doctor YAML assets and shipped command files are treated as references only for this doc-compliance pass.
- Scope remains limited to the Phase 1 router deliverables and packet docs.

### Definition of Done

- `validate.sh <this-packet> --strict` exits 0.
- `route-validate.sh` exits 0 on the shipped `_routes.yaml`.
- All 7 router targets and 2 MCP sub-actions have smoke-test coverage.
- Existing `/doctor:update` and legacy `/doctor:*` commands remain unchanged in Phase 1.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

```text
User invocation: /doctor <target> [flags]
  -> .opencode/commands/doctor.md (the router)
    -> Tier 1: parse positional target
      -> missing target: print interactive menu
      -> list / ?: print manifest table and exit
      -> unknown target: clear error
    -> Look up target in _routes.yaml
    -> Tier 2: per-target flag parser
      -> parse only that target's allowed_flags
      -> reject unknown or cross-target flags
      -> bind setup_vars
    -> Hand off to assets/doctor_<target>.yaml

Coexisting during Phase 1:
  - /doctor:memory still works through the old memory.md entrypoint
  - /doctor:update still works through update.md
  - /doctor:mcp_debug and /doctor:mcp_install still work through old files

Companion command:
  - /doctor:mcp install|debug routes to doctor_mcp_install.yaml or doctor_mcp_debug.yaml
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Step 1 — Scaffold the 013 phase parent (lean trio)
- [x] `.opencode/specs/.../010-doctor-update-orchestrator/spec.md`
- [x] `.opencode/specs/.../010-doctor-update-orchestrator/description.json`
- [x] `.opencode/specs/.../010-doctor-update-orchestrator/graph-metadata.json`

### Step 2 — Scaffold this packet (003-skill-advisor-routing-engine-consolidation Level 2 docs)
- [x] `spec.md`
- [ ] `plan.md` (this file)
- [ ] `tasks.md`
- [ ] `checklist.md`
- [ ] `decision-record.md`
- [ ] `description.json`
- [ ] `graph-metadata.json`

### Step 3 — Author `_routes.yaml`
The canonical route manifest. 7 routes (memory, causal-graph, code-graph, deep-loop, cocoindex, skill-advisor, skill-budget). Each row carries the schema declared in `spec.md` §5.

Verification: `yq '.routes | length' _routes.yaml == 7`.

### Step 4 — Author `.opencode/commands/doctor.md` (the router)

Sections:
1. **Frontmatter** — `description` ≤110 chars, `argument-hint: "<target> [flags] | list | ?"`, `allowed-tools` (union of all 7 routes' `mcp_tools` + the MCP tool subset needed by `/doctor:mcp`; copy from `update.md`).
2. **EXECUTION PROTOCOL block** (shared boilerplate, once)
3. **SUBSYSTEM MANIFEST** — narrative table for human readers; CANONICAL data lives in `_routes.yaml`
4. **CONSTRAINTS** — shared boilerplate (ONLY MODE / DO NOT dispatch / MARKDOWN OWNS SETUP / YAML START CONDITION)
5. **GATE 3 STATUS** — combined table; one row per target citing each target's specific `Location` and mutation class (read-only / add-only / mutates)
6. **UNIFIED SETUP PHASE** — Tier 1 (positional target → interactive menu if missing) → Tier 2 (per-target `case` block flag parser)
7. **EXAMPLES** — argv-positional invocations across the 7 targets
8. **TROUBLESHOOTING / NEXT STEPS** — pointers to `/doctor:update` and `/doctor:mcp`

### Step 5 — Author `.opencode/commands/doctor/mcp.md`
Same general pattern but with only 2 sub-actions (install / debug). Uses `mcp_install` and `mcp_debug` YAML assets.

### Step 6 — Author `.opencode/commands/doctor/scripts/route-validate.sh`
Bash + yq script. Assertions:
- `_routes.yaml` parses; `.routes` is a non-empty list
- Exactly 7 routes; each has all required keys
- Each `yaml` references a file in `assets/`
- Each `mcp_tools` entry exists in the router's frontmatter `allowed-tools` union (extracted via `awk` from `doctor.md`)
- No duplicate target names
- No flag collisions across targets (informational warning only — same flag can have different semantics per target, which is allowed but flagged)
- Self-tests at the bottom (intentionally corrupted manifests should make the script exit non-zero)

### Step 7 — Mirror to .claude / .gemini / .codex
- `.claude/commands/doctor.md` — body-equivalent copy of `.opencode/commands/doctor.md`. Adjust frontmatter as needed (Claude-specific tool naming if any).
- `.claude/commands/doctor/mcp.md` — body-equivalent copy of `.opencode/commands/doctor/mcp.md`
- `.gemini/commands/doctor.md` + `.gemini/commands/doctor/mcp.md` — same body-equivalent
- `.codex/commands/doctor.toml` + `.codex/commands/doctor/mcp.toml` — TOML form (workspace-write sandbox; body inspected manually per `feedback_codex_toml_body_drift`)

### Step 8 — Verify
1. `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-packet> --strict` → exit 0
2. `bash .opencode/commands/doctor/scripts/route-validate.sh` → exit 0
3. Smoke tests:
   - `/doctor --dry-run` (no target) → menu
   - `/doctor memory --dry-run` → loads `doctor_memory.yaml`
   - `/doctor causal-graph --dry-run` → loads `doctor_causal-graph.yaml`
   - `/doctor code-graph` → loads `doctor_code-graph.yaml`
   - `/doctor deep-loop --scope=both --dry-run` → loads `doctor_deep-loop.yaml`
   - `/doctor cocoindex --dry-run` → loads `doctor_cocoindex.yaml`
   - `/doctor skill-advisor --skip-tests --dry-run` → loads `doctor_skill-advisor.yaml`
   - `/doctor skill-budget --json --fail-over=5600` → loads `doctor_skill-budget.yaml`
   - `/doctor:mcp install --server spec-kit-memory` → loads `doctor_mcp_install.yaml`
   - `/doctor:mcp debug --fix` → loads `doctor_mcp_debug.yaml`
   - `/doctor:update --dry-run` → unchanged behavior
4. Skill Advisor:
   - `python3 .opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py "memory continuity index drift" --threshold 0.8` → `/doctor` recommended
5. 4-runtime parity:
   - `diff .opencode/commands/doctor.md .claude/commands/doctor.md` → only frontmatter differences
   - Same for .gemini
   - `.codex` TOML body inspected manually
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Testing is intentionally layered: first validate the packet structure, then validate the routing manifest, then smoke the dispatch surface, then check mirror parity.

| Layer | Command / Check | Expected Result |
|-------|-----------------|-----------------|
| Spec packet | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-packet> --strict` | Exit 0 |
| Manifest | `bash .opencode/commands/doctor/scripts/route-validate.sh` | Exit 0 |
| Router smoke | 7 `/doctor <target>` dry-run invocations | Correct YAML selected |
| MCP smoke | `/doctor:mcp install` and `/doctor:mcp debug` | Correct MCP YAML selected |
| Non-regression | `/doctor:update --dry-run` | Unchanged behavior |
| Mirror parity | `.opencode` ↔ `.claude` ↔ `.gemini`, plus `.codex` TOML body check | Body-equivalent |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

### Critical Files to Read First

When implementing, read these files in order:

1. `../spec.md` — the phase parent (cross-phase context)
2. `./spec.md` — this packet's requirements
3. `./decision-record.md` — ADRs locking the design
4. `.opencode/commands/doctor/causal-graph.md` — Gen-A exemplar to copy boilerplate from
5. `.opencode/commands/doctor/skill-budget.md` — Gen-A read-only exemplar (single-phase audit)
6. `.opencode/commands/doctor/mcp_debug.md` — Gen-B exemplar for `/doctor:mcp` patterns
7. `.opencode/commands/doctor/update.md` — orchestrator (DO NOT modify); reference for `allowed-tools` union
8. `.opencode/commands/doctor/assets/doctor_causal-graph.yaml` — YAML self-sufficiency proof
9. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-doctor-update-orchestrator/spec.md` — predecessor packet
10. `/Users/michelkerkmeester/.claude/plans/analyze-users-michelkerkmeester-mega-dev-dazzling-shore.md` — the approved plan (source of truth for design decisions)

---

### Reused Patterns

| Pattern | Source | Reuse strategy |
|---------|--------|----------------|
| EXECUTION PROTOCOL block (frontmatter + first-action) | `.opencode/commands/doctor/causal-graph.md` lines 7-22 | Copy verbatim into router .md and mcp.md; replace YAML asset name |
| CONSTRAINTS block | Same | Copy verbatim |
| UNIFIED SETUP PHASE structure | `.opencode/commands/doctor/skill-budget.md` lines 38-65 | Adapt: Tier 1 = target selection, Tier 2 = per-target flag parsing |
| GATE 3 STATUS table | `.opencode/commands/doctor/causal-graph.md` GATE 3 section | Expand to multi-row table; add `Mutation class` column |
| `allowed-tools` frontmatter union | `.opencode/commands/doctor/update.md` line 4 | Copy verbatim (it's already the union of all 7 subsystems' tools) |
| Manifest-driven dispatch | NEW (codex recommendation) | `_routes.yaml` as canonical source; `route-validate.sh` enforces consistency |
| TOML mirror for codex | `.codex/commands/doctor/causal-graph.toml` (existing) | Body-equivalent TOML envelope |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Phase 1 is additive, so rollback is straightforward: revert the 7 new implementation files and their runtime mirrors, then restore the packet docs to the previous state. Do not delete or modify the existing `/doctor:*` command files during rollback; they remain the working surface until Phase 2 cutover.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

Phase 2 depends on Phase 1 reaching a clean validation state. The hard cutover must not begin until `/doctor`, `/doctor:mcp`, `_routes.yaml`, and `route-validate.sh` pass their checks and the Skill Advisor sees both `/doctor` and `/doctor:mcp`.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Workstream | Estimate | Notes |
|------------|----------|-------|
| Packet docs compliance | 30-45 min | Header, anchor, frontmatter, checklist, and implementation-summary cleanup. |
| Router implementation | Already authored | Runtime files are outside this doc-compliance pass. |
| Validation | 10-20 min | Run strict validator and iterate on remaining template issues. |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

If a validation or smoke-test failure is discovered after Phase 1, keep the legacy `/doctor:*` files in service and disable the new router by reverting only the additive router files. The recovery path must leave `.opencode/commands/doctor/update.md`, existing YAML assets, and legacy command markdown untouched.
<!-- /ANCHOR:enhanced-rollback -->
