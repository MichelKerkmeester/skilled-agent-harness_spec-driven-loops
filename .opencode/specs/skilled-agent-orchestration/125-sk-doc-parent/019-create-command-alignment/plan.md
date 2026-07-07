---
title: "Implementation Plan: /create command coverage and rename"
description: "Copy-then-adapt 3 new commands, git-mv rename 4 to /create:<packet>, sweep every live surface with anchored patterns, and rename the skill-advisor ids test-neutrally."
trigger_phrases:
  - "create command alignment plan"
  - "125 sk-doc phase 019 plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/125-sk-doc-parent/019-create-command-alignment"
    last_updated_at: "2026-07-07T12:55:35.000Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored phase-019 plan"
    next_safe_action: "Finalize surfaces, validate, roll up"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Implementation Plan: /create command coverage and rename

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | OpenCode command sets (markdown routers + YAML workflows), JSON registry, TypeScript/Python advisor scorer |
| **Framework** | sk-doc mode-registry + discovery-by-filename; skill-advisor native + Python scorers |
| **Storage** | In-repo files; git mv for renames |
| **Testing** | `validate_document.py`, `test -e` path resolution, advisor `vitest` + parity suite, `validate.sh --strict` |

### Overview
Add three commands by copying the closest existing 4-file set and deterministically adapting content to the target packet (never regenerate from scratch — avoids auto/confirm drift). Rename four commands with `git mv` plus an anchored, live-surface-scoped reference sweep. Rename the advisor ids across TS + Python + tests uniformly so parity holds. Verify test-neutrality against a captured HEAD baseline. Historical records keep the old ids.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The 3 new commands' target packets exist with real templates
- [x] The advisor scorer code files are clean (concurrent session is on 011 specs/READMEs, not scorer code)

### Definition of Done
- [ ] `mode-registry.json` has zero `"command": null`
- [ ] 0 old command-ids on live surfaces (historical specs + v1.5.0.0 changelog excepted)
- [ ] Advisor suite is test-neutral vs HEAD baseline
- [ ] `validate.sh --strict` exit 0
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Copy-then-adapt for adds; `git mv` + anchored scoped sweep for renames; surgical text edits for compact JSON (never `json.dump`, which reformats).

### Key Components
- **Adds**: copy `agent`→command/flowchart, `feature-catalog`→benchmark; adapt content, wire real target-packet resource paths; normalize all 3 to the un-numbered thin-router structure and domain-adapt the verified flag + path-resolution block.
- **Renames**: `git mv` 16 files; update router bodies + asset cross-refs; sweep live surfaces with anchored `create:X` / `command-create-X` / filename rules (negative lookbehind for the `testing-playbook`⊂`manual-testing-playbook` collision).
- **Advisor**: uniform id rename across TS scorer + Python mirror + vitests + parity fixture so local↔native parity is preserved.

### Data Flow
1. Copy + adapt the 3 command sets; verify paths + validate routers.
2. `git mv` the 4 renames; fix internal refs; sweep registry + hub docs + mirrors + README.txt + packet docs + install guides.
3. Rename advisor ids; run native-scorer + parity; diff failures vs a stashed HEAD baseline.
4. 0-leak pathspec commits (adds, command-def rename, advisor as separate commits).
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Add 3 commands
- [ ] Copy + adapt the 3 four-file sets; wire real paths; validate routers
- [ ] Normalize structure + domain-adapt flags/path-resolution; set the 3 registry command fields

### Phase 2: Rename 4 commands + sweep surfaces
- [ ] `git mv` 16 files; fix internal refs
- [ ] Sweep registry, hub SKILL/README, packet docs, install guides, README.txt indexes, both mirrors

### Phase 3: Advisor + verification
- [ ] Rename advisor ids (TS + Python + tests + parity)
- [ ] Baseline-diff the advisor suite; confirm test-neutral
- [ ] `validate.sh --strict`; parent 125 rollup
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Path resolution | Every auto.yaml resource | `test -e` |
| Router validity | New routers | `validate_document.py` |
| Advisor parity | TS↔Python id consistency | `vitest` parity suite vs stashed baseline |
| Spec validation | This folder | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|--------------------|
| Advisor scorer code clean | Internal | Green (verified) | Rename would race the concurrent session |
| Pending 193-row re-baseline | Internal | Deferred (gated track) | Must regenerate against new ids later |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a rename breaks command resolution or the advisor suite regresses.
- **Procedure**:
  1. All work is in three scoped commits (adds, command-def rename, advisor); `git revert` any independently.
  2. Renames are `git mv` (fully reversible); advisor is one atomic commit.
  3. Re-run path-resolution + advisor baseline before re-committing.
<!-- /ANCHOR:rollback -->
