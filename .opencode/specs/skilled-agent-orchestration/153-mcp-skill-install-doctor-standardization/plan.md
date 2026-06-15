---
title: "Implementation Plan: Standardize the mcp-* skills into the install-guide and doctor system"
description: "Bring all five mcp-* skills to a shared install-and-doctor shape and cross-reference the three design skills. Implemented with parallel gpt-5.5-fast write seats for the templated chunks and the orchestrator for the knowledge-heavy chunks."
trigger_phrases:
  - "mcp skill standardization plan"
  - "doctor.sh implementation"
  - "install guide parity"
  - "design skill cross-reference plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/153-mcp-skill-install-doctor-standardization"
    last_updated_at: "2026-06-15T06:10:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Implemented all changes via parallel seats plus orchestrator; verifying"
    next_safe_action: "Run validate.sh --strict, then scoped commit, then stop for review"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-open-design/scripts/install.sh"
      - ".opencode/commands/doctor/assets/doctor_mcp_install.yaml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-153-mcp-skill-install-doctor-standardization"
      parent_session_id: null
    completion_pct: 85
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Standardize the mcp-* skills into the install-guide and doctor system

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash scripts, Markdown docs, YAML command assets, JSON graph metadata |
| **Framework** | The spec-kit skill convention (per-skill `scripts/` plus INSTALL_GUIDE.md) |
| **Storage** | None |
| **Testing** | `bash -n`, `package_skill.py --check`, `validate.sh --strict`, targeted greps |

### Overview
Each mcp-* skill is brought to the same surface that mcp-figma already had: an INSTALL_GUIDE.md, a verify-only `scripts/install.sh`, and a read-only `scripts/doctor.sh` whose helper shape mirrors `mcp-figma/scripts/_common.sh`. The central `/doctor:mcp` install asset gains a `cli_skill_diagnostics:` class so the CLI-primary skills are part of the doctor setup without being treated as registered servers. The three design skills are cross-linked in prose and in the skill graph.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified (claude2 logged out, fell back to gpt-5.5-fast)

### Definition of Done
- [x] All acceptance criteria met
- [x] Scripts parse (`bash -n`) and skills pass `package_skill --check`
- [ ] `validate.sh --strict` passes and changes are committed scoped
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Shared skill convention. Each skill's scripts follow the mcp-figma reference shape (`_common.sh` helpers, `install.sh` detect-and-verify, `doctor.sh` read-only report).

### Key Components
- **Per-skill scripts**: `install.sh` (non-mutating) and `doctor.sh` (read-only) per skill.
- **Central doctor class**: `cli_skill_diagnostics:` in `doctor_mcp_install.yaml`, separate from `servers:`.
- **Cross-reference graph**: reciprocal edges among mcp-figma, mcp-open-design, sk-interface-design.

### Data Flow
`doctor.sh` reads local state (PATH, app paths, sockets, config files) and prints a report. `install.sh` detects the tool or app, verifies it, and prints gated next steps. Nothing mutates state.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not a bug fix, but `doctor_mcp_install.yaml` and `mcp.md` are shared command-policy surfaces, so the change is recorded here.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `doctor_mcp_install.yaml` `servers:` loop | Drives install/repair of registered MCP servers | unchanged | `python3 -c yaml.safe_load` parses; loop still iterates `servers:` only |
| `doctor_mcp_install.yaml` `cli_skill_diagnostics:` | New reference class for CLI-primary skills | added (additive, not consumed by the server loop) | grep shows the four skills; YAML parses |
| `mcp.md` Routing Rules | Documents `/doctor:mcp` scope | update (one rule clarifying the CLI-skill class) | grep shows the new rule |
| per-skill `scripts/doctor.sh` consumers | The operator or agent runs them directly | added | `bash -n` per file; manual read |

Required inventories:
- Same-class producers: `rg -n 'doctor.sh|install.sh' .opencode/skills/mcp-*` confirms every mcp skill's script surface.
- Consumers of changed symbols: `rg -n 'cli_skill_diagnostics' .opencode/commands/doctor` confirms only additive references.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Scope the gap matrix across the five mcp skills
- [x] Create packet 153 (Level 2) to satisfy Gate 3
- [x] Provider preflight for the write seats

### Phase 2: Core Implementation
- [x] mcp-figma 1.0.0.0 version bump and changelog rewrite (orchestrator)
- [x] mcp-open-design parity: INSTALL_GUIDE plus scripts (scripts via gpt-5.5 seat, guide by orchestrator)
- [x] doctor.sh for mcp-chrome-devtools and mcp-click-up (gpt-5.5 seats)
- [x] Central doctor `cli_skill_diagnostics:` wiring and mcp.md note
- [x] Cross-references among the three design skills plus graph edges

### Phase 3: Verification
- [x] `bash -n` on all new scripts, `package_skill --check`, JSON validity
- [x] Host fact-check of every generated script against the real source
- [ ] `validate.sh --strict` on the packet, then scoped commit
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static | Shell script syntax | `bash -n` |
| Structure | Skill packaging | `package_skill.py --check` |
| Structure | Packet docs | `validate.sh --strict` |
| Manual | CLI fact fidelity, house voice, comment hygiene | Read plus targeted `grep` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| claude2 (account-2 Opus) | External | Red | Logged out mid-session; substituted gpt-5.5-fast xhigh seats |
| gpt-5.5-fast via cli-opencode | External | Green | Authored the templated scripts |
| opencode CLI | External | Green | Dispatch transport |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A new doctor or install script misbehaves, or the doctor YAML fails to parse.
- **Procedure**: `git revert` the scoped commit. All changes are additive docs, scripts, and metadata with no data migration, so revert is clean.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Core) ──► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Scoping plus packet creation |
| Core Implementation | Med | Three parallel seats plus orchestrator authoring |
| Verification | Low | Static checks plus host fact-check |
| **Total** | Med | One focused session |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No data changes, so no backup needed
- [x] Changes are additive or doc-only
- [x] Scoped commit keeps the blast radius to this packet's files

### Rollback Procedure
1. Identify the scoped commit hash.
2. `git revert <hash>` (or `git rm` the new scripts and `git checkout` the edited docs).
3. Re-run `bash -n` and `validate.sh` to confirm a clean state.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->
