---
title: "Implementation Plan: sk-vision 001 research"
description: "One-shot Level 3 research: inventory the Senses dump, read live Pi types, lock four ADRs, and validate the child plus parent."
trigger_phrases:
  - "sk-vision research plan"
  - "senses fork plan"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "sk-vision/001-sk-vision-fork-of-opencode-senses/001-research"
    last_updated_at: "2026-08-16T06:28:08.000Z"
    last_updated_by: "cursor-grok"
    recent_action: "Authored the one-shot research plan."
    next_safe_action: "Run validate.sh --strict on this child."
    blockers: []
    key_files:
      - "plan.md"
      - "research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-001-research-20260815"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "upgrade-level.sh failed; L3 addons were rendered with inline-gate-renderer.sh."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: sk-vision 001 research

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown spec-kit; TypeScript/Python dump as evidence |
| **Framework** | system-spec-kit Level 3 child under a phase parent |
| **Storage** | Spec files under `specs/sk-vision/`; `.opencode/specs` is a symlink to `specs/` |
| **Testing** | `validate.sh --strict` and `validate.sh --recursive --strict` |

### Overview
Scaffold the existing dump folder as a phase parent, add this Level 3 research child, read Pi 0.84.2 extension types and the dumped OpenCode plugin, then write research plus four ADRs. No runtime code ships in this child.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Parent path chosen: `specs/sk-vision/001-sk-vision-fork-of-opencode-senses`
- [x] Research method chosen: one-shot Level 3, not `/deep:research`
- [x] Upstream dump present at `../context/`

### Definition of Done
- [x] REQ-001 through REQ-010 have evidence in `research/research.md` or ADRs
- [x] `validate.sh` child `--strict` and parent `--recursive --strict` planned as the close gate
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Host-agnostic core with thin host adapters (OpenCode plugin, Pi extension), housed in a standalone skill.

### Key Components
- **Core**: `RuntimeClient` NDJSON JSON-RPC plus `python/runtime.py` (Moondream/Photon)
- **OpenCode adapter**: `plugin.ts` + `opencode/tools.ts` + `opencode/attachments.ts`
- **Pi adapter**: `.pi/extensions` factory, `pi.registerTool()`, optional `pi.on("input")` image transform
- **Skill**: `.opencode/skills/sk-vision/` class S (later child)

### Data Flow
Image path or in-memory image -> host adapter -> PhotonProvider -> RuntimeClient -> Python runtime -> guarded evidence text back to the coding model
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This child authors spec docs only. No production runtime surface changes.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `../context/` | Upstream dump | unchanged | glob still lists README, plugin.ts, runtime.py |
| `specs/sk-vision/description.json` | Track metadata | rewrite | no longer names app-remote-agent-chat |
| Phase parent `spec.md` | Lean control file | create/author | lean trio only |
| `001-research/` | This child | create/author | Level 3 file set |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Fix track `description.json`
- [x] `create.sh --phase --phases 1 --phase-names research --path ...`
- [x] Render L3 checklist, decision-record, research templates after `upgrade-level.sh` failed

### Phase 2: Core Implementation
- [x] Live-read Pi `registerTool` / `InputEvent.images` / `ImageContent`
- [x] Inventory dumped OpenCode plugin hooks
- [x] Author spec, plan, tasks, ADRs, research.md

### Phase 3: Verification
- [x] `validate.sh` this child `--strict`
- [x] `validate.sh` parent `--recursive --strict`
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Not applicable this child | — |
| Integration | Spec-kit structure | `validate.sh --strict` |
| Manual | Pi type lines and dump paths | Read + grep |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| system-spec-kit `create.sh` | Internal | Green | Cannot scaffold |
| Pi 0.84.2 `types.d.ts` | External | Green | Pi claims stay `[U]` |
| Senses dump `../context/` | Internal | Green | No fork baseline |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Research child is abandoned or ADRs rejected
- **Procedure**: Delete `001-research/` and restore parent to dump-only, or revert the git commit that added the packet docs. `context/` is untouched source.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Track metadata ──► phase parent scaffold ──► L3 addon render ──► live type read ──► author docs ──► validate
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Track folder | Live read |
| Core Implementation | Setup | Verify |
| Verify | Core | Parent close |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 30 minutes |
| Core Implementation | High | 2-4 hours |
| Verification | Med | 30-60 minutes |
| **Total** | | **3-6 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No data migrations
- [x] `context/` not rewritten
- [ ] Monitoring alerts set — N/A, docs only

### Rollback Procedure
1. Stop authoring
2. `git restore` / delete `001-research/` and parent `spec.md` if uncommitted
3. Confirm `context/` still matches the dump
4. Leave track `description.json` corrected unless reverting that too

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Phase 1   │────►│   Phase 2   │────►│   Phase 3   │
│   Setup     │     │  Research   │     │   Verify    │
└─────────────┘     └─────────────┘     └─────────────┘
```

### Dependency Matrix

| From | To | Kind |
|------|-----|------|
| Track metadata | Parent scaffold | required |
| Parent scaffold | Child docs | required |
| Pi types + dump | ADRs | required |
| Child docs | validate.sh | required |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. Scaffold parent + child without deleting `context/`
2. Confirm Pi `registerTool` and `images` on installed types
3. Write ADRs and research.md
4. Strict validate child then parent
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| ID | Milestone | Exit | Date/Phase |
|----|-----------|------|------------|
| M1 | Scaffold exists | `001-research/spec.md` present | Setup |
| M2 | ADRs accepted | four Status: Accepted rows | Core |
| M3 | Validation green | both validate.sh invocations exit 0 | Verify |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

See `decision-record.md` for ADR-001 through ADR-004. This plan does not duplicate them.
