---
title: "Implementation Plan: Pi manual-testing playbook authoring"
description: "Plan for authoring the root manual-testing-playbook.md plus 19 PI-NNN scenario files, mirroring cli-cursor's structure, live-executing scenarios against phase 012's new .pi/ artifacts."
trigger_phrases: ["pi manual testing playbook authoring plan"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/031-cli-pi-creation/013-pi-manual-testing-playbook-authoring"
    last_updated_at: "2026-07-27T17:10:00Z"
    last_updated_by: "claude-code"
    recent_action: "Playbook built, live-verified, GLM reviewed, closed Complete"
    next_safe_action: "None -- terminal phase"
    blockers: []
    key_files: ["../010-pi-manual-testing-playbook/spec.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-pi-creation-authoring", parent_session_id: null }
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Pi manual-testing playbook authoring

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
| **Language/Stack** | Markdown (manual-testing-playbook root + scenario files) -- no application code. |
| **Framework** | `sk-doc`'s `create-manual-testing-playbook` canonical contract. |
| **Storage** | None. |
| **Testing** | `validate_document.py`, `extract_structure.py`, live `pi` sessions in this worktree for executable scenarios. |

### Overview
Author `cli-pi/manual-testing-playbook/manual-testing-playbook.md` plus 19 `PI-NNN` scenario files across 8 categories, mirroring `cli-cursor/manual-testing-playbook/`'s proven shape and the `sk-doc` canonical per-scenario contract exactly. Execute phase 010's `spec.md` §9 coverage-plan table verbatim (no redesign). Live-execute the 7 scenarios phase 012's new `.pi/prompts/`/`.pi/agents/`/`.pi/extensions/` artifacts make executable; the remaining scenarios stay honestly docs-grounded or SKIP with a named blocker (provider credentials, worktree-provisioning gap), matching this packet's own established discipline.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phase 012 confirmed landed (its `.pi/prompts/`, `.pi/agents/`, `.pi/extensions/` artifacts exist and are live-verified). [EVIDENCE: commit `97036ca885`]
- [x] `cli-cursor/manual-testing-playbook/`'s exact structure read and understood as the shape template. [EVIDENCE: this session's research agent report]
- [x] `sk-doc/create-manual-testing-playbook/SKILL.md`'s canonical contract read in full. [EVIDENCE: same report]

### Definition of Done
- [x] Root file + 19 scenario files exist, pass `validate_document.py`/`extract_structure.py`. [EVIDENCE: all 20 independently re-validated, 0 issues each]
- [x] 9 scenarios live-executed with captured evidence. [EVIDENCE: PI-001/007/008/009/011/012/014/015/017]
- [x] Every SKIP names a real, specific blocker. [EVIDENCE: manual spot-check of PI-010/PI-013/PI-005/PI-006/PI-018]
- [x] `validate.sh --strict` passes for this phase folder; whole-packet `--recursive --strict` still `Errors: 0`. [EVIDENCE: `implementation-summary.md`]
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Mirror `cli-cursor`'s playbook exactly: root file (frontmatter -> H1 -> EXECUTION POLICY -> SELF-INVOCATION GUARD -> canonical-artifacts list -> 17 numbered sections) + kebab-case category folders + kebab-case per-scenario files (5-section canonical contract: OVERVIEW/SCENARIO CONTRACT/TEST EXECUTION/SOURCE FILES/SOURCE METADATA). The one structural difference from `cli-cursor` is category count (8 vs. cursor's 9 — phase 010 found no Pi-unique category candidate yet) and scenario count (19 vs. cursor's 21).

### Key Components
- **Root file**: `.opencode/skills/cli-external-orchestration/cli-pi/manual-testing-playbook/manual-testing-playbook.md`.
- **8 category folders** (from phase 010's own rollup): `cli-invocation` (3), `skill-discovery` (3), `command-dispatch` (2), `agent-bridge` (2), `mcp-host-integration` (3), `hook-extension-layer` (3), `model-dispatch` (2), `prompt-quality` (1).
- **Live-execution harness**: real `pi --offline --approve -p "..."` sessions in this worktree, reusing phase 012's real artifacts and this worktree's already-installed `pi-subagents`/`pi-mcp-extension`.

### Data Flow
Phase 010's `spec.md` §9 table (source of truth for scope) -> per-scenario file authored per the canonical contract -> for executable scenarios, a real `pi` command run -> captured output becomes the `TEST EXECUTION` section's evidence -> `validate_document.py`/`extract_structure.py` structural gate -> whole-packet `validate.sh --recursive --strict`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm phase 012 landed with its real artifacts.
- [x] Re-read phase 010's `spec.md` §9 table verbatim (do not redesign).

### Phase 2: Core Implementation
- [x] Author the root `manual-testing-playbook.md`.
- [x] Author all 19 scenario files across the 8 category folders.

### Phase 3: Verification
- [x] Live-execute the 7 scenarios phase 012's artifacts make executable; capture real evidence.
- [x] Run `validate_document.py`/`extract_structure.py` against the root file and all 19 scenario files.
- [x] GLM-5.2 independent review.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structural | Root + 19 scenario files | `validate_document.py`, `extract_structure.py` |
| Live execution | 7 executable scenarios | Real `pi` sessions in this worktree |
| Independent review | Full diff | GLM-5.2 via `devin -p --model glm-5.2` |
| Whole-packet | All 13 phases | `validate.sh --recursive --strict`, `parent-skill-check.cjs` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `010-pi-manual-testing-playbook` | Internal | Complete | Coverage plan source |
| `012-pi-runtime-compatibility` | Internal | Must land first | Several scenarios' live-execution unavailable without it |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A scenario file makes an unsupported PASS claim, or structural validation fails.
- **Procedure**: Fix the specific scenario file's evidence/verdict; re-run `validate_document.py`; re-verify before re-committing. All new files, so a simple revert is safe if needed.
<!-- /ANCHOR:rollback -->

---

## RELATED DOCUMENTS
- `spec.md`, `tasks.md`, `checklist.md` (this phase)
- `../010-pi-manual-testing-playbook/`, `../012-pi-runtime-compatibility/`
