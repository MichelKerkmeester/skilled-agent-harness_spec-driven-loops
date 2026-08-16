---
title: "Implementation Plan: sk-vision 003 runtime fork"
description: "Fork shipped Senses runtime into vision-runtime, rebrand identifiers, and compile dist/plugin.js."
trigger_phrases:
  - "sk-vision runtime plan"
  - "sk-vision fork plan"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-vision/001-sk-vision-fork-of-opencode-senses/003-runtime-fork"
    last_updated_at: "2026-08-15T17:45:00.000Z"
    last_updated_by: "cursor-grok"
    recent_action: "Aligned plan with GPU load/status and package name."
    next_safe_action: "Wait for 002; then copy dump into vision-runtime/."
    blockers: []
    key_files:
      - "plan.md"
      - "spec.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-003-runtime-20260815"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: sk-vision 003 runtime fork

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Python 3.10+, Bun / Node.js |
| **Framework** | NDJSON JSON-RPC Subprocess Core |
| **Storage** | Local disk cache (`~/.cache/sk-vision/`) |
| **Testing** | Bun test / Vitest, Pytest |

### Overview
Copy shipped Senses v0.2.0 files into `.opencode/skills/sk-vision/vision-runtime/`, perform an exhaustive string and symbol rebrand from `SENSES_*` to `SK_VISION_*`, retain MIT licensing, update dump unit tests, and compile `dist/plugin.js`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Predecessor `002-skill-scaffold` complete (still Planned; do not start 003 until 002 closes).
- [x] Upstream code present in `../context/`.
- [x] Rebranding identifier mappings finalized in ADR-004.

### Definition of Done
- [ ] 0 residual `SENSES_` / `opencode-senses` / `senses_` identifiers in `vision-runtime/` (LICENSE copyright excepted).
- [ ] Package name is `sk-vision` (not `@opencode-ai/sk-vision`, not `opencode-senses`).
- [ ] TypeScript package compiles cleanly to `dist/plugin.js`, or a `tsc` substitute is documented.
- [ ] Unit tests pass after rebrand.
- [ ] GPU smoke is JSON-RPC `load` then `status`, or SKIP with hardware note. `ping` is not the smoke.
- [ ] Spec packet passes strict validation.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Host-agnostic JSON-RPC client/server subprocess architecture.

### Key Components
- **`RuntimeClient` (`src/runtime/client.ts`)**: Manages Python daemon lifecycle and NDJSON transport over stdio.
- **`Python Daemon` (`python/runtime.py`)**: Loads Moondream2 model weights, handles image decoding, point queries, detection, and OCR.
- **`PhotonProvider` (`src/providers/photon.ts`)**: Bridges high-level vision actions to JSON-RPC daemon commands.
- **`Plugin Factory` (`src/plugin.ts`)**: Base plugin definition consumed by OpenCode adapter.

### Data Flow
`Host Adapter` -> `PhotonProvider` -> `RuntimeClient` -> `stdio (NDJSON)` -> `python/runtime.py` -> `Moondream2 / PyTorch` -> `Response`
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| **Upstream Dump** | `../context/` | Read source | `diff -r` comparison |
| **Vision Runtime** | `.opencode/skills/sk-vision/vision-runtime/` | Create & rebrand | Grep audit for `SENSES_` |
| **Build Artifacts** | `vision-runtime/dist/` | Generate build | Verify `dist/plugin.js` existence |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup & Code Extraction
- Create `.opencode/skills/sk-vision/vision-runtime/`.
- Copy shipped v0.2.0 files from `../context/`.

### Phase 2: Core Implementation & Rebranding
- Rebrand all `SENSES_*` variables to `SK_VISION_*`.
- Update cache and venv default directories to `~/.cache/sk-vision`.
- Update error tags to `<SK-VISION ...>`.
- Update `LICENSE` file with original author copyright and modification notice.
- Run build script to generate `dist/plugin.js`.

### Phase 3: Verification & Smoke Testing
- Run `rg -n 'SENSES_|opencode-senses|~/.cache/opencode-senses|<SENSES|senses_'` across `vision-runtime/`.
- Run unit test suite.
- Optional GPU smoke: JSON-RPC `load` then `status` on NVIDIA Ampere+ or Apple Silicon (first load ~3.9 GB). If hardware is absent, record SKIP. `ping` is not the smoke.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Provider & Runtime client tests | Bun test / Vitest |
| Integration | Python runtime daemon test | pytest / python unittest |
| Lint / Audit | Rebranding string compliance | ripgrep |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `002-skill-scaffold` | Internal | Planned | Blocks directory placement |
| Upstream context dump | Internal | Ready | Critical source material |
| Python 3.10+ | External | Available | Blocks daemon execution |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Fatal build or runtime defects introduced during forking.
- **Procedure**: Delete `.opencode/skills/sk-vision/vision-runtime/` and revert changes.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────► Phase 2 (Rebrand & Build) ──────► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | `002-skill-scaffold` | Rebrand & Build |
| Rebrand & Build | Setup | Verify |
| Verify | Rebrand & Build | `004-opencode-adapter`, `005-pi-adapter` |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 15 mins |
| Rebrand & Build | Medium | 45 mins |
| Verification | Low | 20 mins |
| **Total** | | **80 mins** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Upstream context preserved read-only at `../context/`.
- [ ] Skill scaffold intact (002 must close first).

### Rollback Procedure
1. Execute `rm -rf .opencode/skills/sk-vision/vision-runtime`.
2. Verify git status is clean outside expected spec directories.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────────────┐     ┌─────────────────────┐     ┌─────────────────────┐
│  002-skill-scaffold │────►│  003-runtime-fork   │────►│ 004-opencode-adapter│
└─────────────────────┘     └──────────┬──────────┘     └─────────────────────┘
                                       │
                                       ▼
                            ┌─────────────────────┐
                            │   005-pi-adapter    │
                            └─────────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| `vision-runtime/` | Context dump | Core library | 004, 005 adapters |
| `dist/plugin.js` | TypeScript build | Importable module | 004 adapter |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Setup & Copy** - 15 mins - CRITICAL
2. **Rebranding Refactor** - 45 mins - CRITICAL
3. **Build & Validation** - 20 mins - CRITICAL

**Total Critical Path**: 80 mins
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Shipped Files Copied | All v0.2.0 files in place | Phase 1 |
| M2 | Rebrand & Build Complete | `dist/plugin.js` compiled, 0 old tokens | Phase 2 |
| M3 | Verified & Validated | Unit tests pass, strict validation exit 0 | Phase 3 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

See `decision-record.md` for full architectural decisions.
