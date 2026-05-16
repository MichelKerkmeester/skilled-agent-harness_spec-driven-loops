---
title: "056: Root README deep-research realignment (20-iter cli-devin SWE 1.6)"
description: "Deep audit of the root ./README.md across 7 thematic tracks (20 iter total) followed by HVR sk-doc-style surgical rewrites via sonnet @markdown."
trigger_phrases:
  - "056 spec"
  - "root readme deep research"
  - "20 iteration cli-devin sweep"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-migration/054-root-readme-deep-research"
    last_updated_at: "2026-05-15T13:35:00Z"
    last_updated_by: "main_agent"
    recent_action: "Scaffolded 056 packet"
    next_safe_action: "Compose iter template via sk-prompt"
    blockers: []
    key_files:
      - "README.md"
      - ".opencode/skills/cli-devin/SKILL.md"
      - ".opencode/skills/sk-doc/references/global/hvr_rules.md"
    session_dedup:
      fingerprint: "sha256:2a7330417c169579e5943a713030632491e8898ecf6d0312026f45566d970b69"
      session_id: "056-spec-scaffolded"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions:
      - "Writer for rewrite phase? Sonnet @markdown sole writer (user choice)"
      - "Iteration scope? 7 thematic tracks x ~3 iter each (user choice)"
      - "Why bypass /spec_kit:deep-research? cli-devin is not a native executor in that command"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# 056: Root README deep-research realignment

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Target Level** | 1 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-05-15 |
| **Branch** | `main` |
| **Parent** | `system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-migration` |
| **Depends on** | `055-root-readme-realignment` (Phase D shipped) |
| **Successor** | None |
| **Handoff Criteria** | 20 iter complete, synthesis delta verified, ./README.md rewritten with HVR score >= 85, packet strict-validate PASS, single commit on main |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem

Packet 055 (Phase D) ran a single-pass audit on ./README.md. It found 16 claims, marked 1 DRIFTED + 1 UNVERIFIED, and Pass 2 cross-check added 2 missed items. 12 surgical edits shipped in commit 2d4086743 + patch 458b0e6b3. That audit was deliberately shallow — sampled rather than exhaustive.

The user now wants a deeper sweep: 20 cli-devin SWE 1.6 deep-research iterations covering every drift surface (HVR voice, diagram accuracy, cross-runtime claims, FAQ/Quick Start usability) plus HVR sk-doc-style rewrites of any drifted prose. Phase D exempted root README from HVR scoring; this directive overrides that exemption per hvr_rules.md line 18.

### Purpose

Catch the depth Phase D missed. 20 iterations across 7 thematic tracks. Sonnet @markdown applies HVR-compliant surgical edits scoped to a verified delta.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- 20 cli-devin SWE 1.6 research iterations, written under `research/iterations/`
- Per-iter state row in `research/deep-research-state.jsonl`
- Synthesis pass producing `research/research.md` + `research/delta-verified.md`
- Sonnet @markdown surgical rewrite of ./README.md per verified delta
- HVR scoring via `validate_document.py --type readme --json`
- Sonnet @markdown + @review final double-check
- Single commit on main per phase (per-iter immediate commit inside Phase 2)

### Out of Scope

- Rewriting non-drifted sections (preserve voice + structure where claims are still correct)
- Adding new top-level sections beyond what the verified delta calls for
- Restructuring the README's TOC ordering
- Phases A/B/C/D work (already shipped)

### 7 Thematic Tracks

| Track | Iter count | Focus |
|-------|-----------:|-------|
| 1 | 3 | Counts and inventories (tools, agents, skills, commands, MCP servers) |
| 2 | 3 | Claim accuracy (MCP names, versions, file paths, env vars, install steps) |
| 3 | 3 | HVR voice violations (banned words/phrases, em dashes, semicolons, oxford commas) |
| 4 | 3 | Diagrams and topology (post-extraction boundaries, runtime arrows) |
| 5 | 3 | External refs + footer (NOTICE files, fork links, doc version, framework metric) |
| 6 | 3 | FAQ + Quick Start (Q&A accuracy, install-step usability) |
| 7 | 2 | Cross-runtime claims + residual catch-all |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | 20 iteration markdown files written | `research/iterations/iteration-001.md` ... `iteration-020.md` exist, each >= 1000 bytes |
| REQ-002 | State JSONL covers all 20 iter | `research/deep-research-state.jsonl` has 20 iteration rows + 1 config row + 1 converged event row |
| REQ-003 | Verified delta document exists | `research/delta-verified.md` lists EDITs with FROM/TO/REASON + iteration citation per drift |
| REQ-004 | ./README.md rewritten per verified delta | `git diff README.md` matches the verified delta's scope |
| REQ-005 | HVR score >= 85 on rewritten README | `validate_document.py --type readme --json` returns hvr_score >= 85 |
| REQ-006 | Strict-validate on packet | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <packet> --strict` exit 0 |
| REQ-007 | Sonnet double-check PASS | 0 P0 findings before commit |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | Per-iter immediate commit (parallel-session safety) | Each iter has its own commit on main |
| REQ-009 | Executor separation honored | cli-devin only SWE 1.6 (auto perm-mode); sonnet @markdown only via Task tool |
| REQ-010 | Voice preservation in non-drifted prose | git diff README.md scoped to delta edits, no out-of-scope rewrites |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 20 iter outputs persist, each citing concrete evidence (file path / line number / commit SHA).
- **SC-002**: Verified delta has 0 fabricated drift (every EDIT references at least one iteration finding).
- **SC-003**: HVR score >= 85 on ./README.md post-rewrite.
- **SC-004**: Voice preservation passes manual review.
- **SC-005**: Single final commit on main closes the packet.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | cli-devin SWE 1.6 prompt-quality contract not honored | High (degraded research quality) | One sk-prompt pass produces the iter template; all 20 dispatches reuse it |
| Risk | Convergence-gate violation (early stop) | Medium | Fixed 20-iter sweep, no early-stop per user directive |
| Risk | Parallel-session interference (Phase B precedent) | Medium | Per-iter immediate commit |
| Risk | HVR baseline below 85 in current root README | Medium | Track 3 surfaces violations; delta sizes accordingly |
| Risk | Sonnet @markdown voice drift in non-drifted prose | Low | Scope contract in dispatch prompt; git diff enforces |
| Dependency | Phase D 055 shipped | Met | 2d4086743 + 458b0e6b3 on main |
| Dependency | cli-devin SWE 1.6 reachable | Met | Used through Phases A/B/C |
| Dependency | sonnet @markdown via Task tool | Met | Used in Phase D Pass 3 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Per-iter wall-clock < 5 min (cli-devin SWE 1.6 read-only research)
- **NFR-P02**: 20-iter total wall-clock < 100 min
- **NFR-P03**: Synthesis pass < 10 min
- **NFR-P04**: Sonnet @markdown rewrite < 15 min

### Quality
- **NFR-Q01**: HVR score >= 85 post-rewrite
- **NFR-Q02**: No em dashes, semicolons, oxford commas in rewritten prose
- **NFR-Q03**: No banned HVR words/phrases in rewritten prose

### Reproducibility
- **NFR-R01**: All 20 iter prompts persist under `prompts/` (or referenced from iter-template + track-seeds)
- **NFR-R02**: All cli-devin logs persist under `dispatch-logs/`
- **NFR-R03**: Edit evidence captured in `research/edit-evidence.md`
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- **EC-001**: cli-devin returns malformed iter output → main agent flags + re-runs that iter with tighter prompt; max 2 retries per iter
- **EC-002**: An iter finds nothing new (newInfoRatio < 0.05) → still records as `complete`, no early stop
- **EC-003**: Track 3 surfaces > 30 HVR violations → delta grows; sonnet @markdown may need to chunk edits (cap per-dispatch edit count at 20 if needed)
- **EC-004**: Sonnet @markdown rewrites non-drifted section → reject, re-dispatch with tighter scope
- **EC-005**: Parallel session reverts an iter commit → re-apply, recommit; lesson saved to memory
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

None. Writer + iteration scope clarified at planning time.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Resource Map**: See `resource-map.md`
- **Iter Template**: See `assets/iter-template.md`
- **Track Seeds**: See `research/track-seeds.md`
- **Phase D Predecessor**: `../055-root-readme-realignment/`
<!-- /ANCHOR:related-docs -->
