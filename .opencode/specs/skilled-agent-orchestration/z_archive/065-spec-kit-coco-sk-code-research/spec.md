---
title: "Feature Specification: 077 Deep Research on system-spec-kit + mcp-coco-index + sk-code OpenCode"
description: "10-iteration deep research audit of three intertwined surfaces (system-spec-kit, mcp-coco-index, sk-code OpenCode side) using cli-codex executor; surface drift, coverage gaps, and integration findings synthesized into a 4-phase remediation roadmap."
trigger_phrases: ["077", "spec-kit-coco-sk-code-research", "077 research", "077 findings", "OpenCode authoring recipe"]
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/065-spec-kit-coco-sk-code-research"
    last_updated_at: "2026-05-05T17:00:00Z"
    last_updated_by: "claude-orchestrator"
    recent_action: "10-iter loop complete; research.md synthesized"
    next_safe_action: "Validate + commit + memory save"
    blockers: []
    key_files:
      - .opencode/specs/skilled-agent-orchestration/z_archive/065-spec-kit-coco-sk-code-research/research/research.md
      - .opencode/specs/skilled-agent-orchestration/z_archive/065-spec-kit-coco-sk-code-research/research/resource-map.md
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "077-final"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: 077 Deep Research on system-spec-kit + mcp-coco-index + sk-code OpenCode

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | In Progress |
| **Created** | 2026-05-05 |
| **Branch** | `main` |
| **Predecessor** | 069 sk-code v3.1.0.0 (motion_dev cross-stack) |
| **Successor** | 078+ remediation phases (4-phase roadmap proposed) |
| **Handoff Criteria** | research.md + resource-map.md shipped; 10 iteration narratives + deltas + state log committed; user decides on remediation packet |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Three OpenCode skill ecosystem surfaces — system-spec-kit, mcp-coco-index, and sk-code (OpenCode side specifically) — have grown organically and accumulated drift between docs and code, coverage gaps, and missing integration paths. Without a deep audit, remediation work risks chasing symptoms instead of root causes. Specifically: validators may pass on broken graph metadata, semantic search may miss canonical resources due to default exclusion patterns, and sk-code claims OPENCODE authoring scope but ships only language-level checklists. No prior packet has surveyed all three surfaces holistically.

### Purpose
Run a 10-iteration deep research loop using cli-codex (gpt-5.5/high/fast) to map drift, coverage gaps, and cross-cutting integration findings across the three surfaces. Synthesize a prioritized remediation roadmap so the user can make informed decisions about subsequent remediation packets.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- 10-iteration `@deep-research` loop with cli-codex executor (gpt-5.5/high/fast/workspace-write/900s)
- Audit of `.opencode/skills/system-spec-kit/` (skill + MCP server + scripts + templates)
- Audit of `.opencode/skills/mcp-coco-index/` (skill + MCP server + settings + CLI parity)
- Audit of `.opencode/skills/sk-code/{references,assets}/opencode/` (drift + coverage gaps + missing files)
- Cross-cutting questions: smart-router x spec-folder writes; CocoIndex ingestion of sk-code; missed integration points
- `research/research.md` synthesis with prioritized remediation roadmap
- `research/resource-map.md` covering 43+ touched paths across READMEs/Documents/Commands/Agents/Skills/Specs/Scripts/Tests/Config/Meta sections
- Level 1 spec docs (spec, plan, tasks, implementation-summary)

### Out of Scope
- Webflow stack changes (per user constraint)
- motion_dev directory work (just shipped in 069 / sk-code v3.1.0.0; immutable for this packet)
- barter/coder/ mirror tree (separate sync concern)
- z_archive/ historical records (immutable record)
- cli-* skill audits (codex/copilot/opencode/gemini/claude-code) — focus is the 3 named surfaces
- Code rewrites or implementation — this is research-only; remediation lives in successor packets

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `077/research/deep-research-config.json` | Create | Loop config (cli-codex executor, 10 iters, 0.10 convergence) |
| `077/research/deep-research-state.jsonl` | Create | Append-only canonical state log |
| `077/research/deep-research-strategy.md` | Create | Per-session strategy (machine-owned sections updated by reducer) |
| `077/research/findings-registry.json` | Create | Reducer-owned registry of open/resolved questions + findings |
| `077/research/iterations/iteration-{001..010}.md` | Create | 10 iteration narratives |
| `077/research/deltas/iter-{001..010}.jsonl` | Create | Per-iteration structured delta streams |
| `077/research/prompts/iter-{001..010}.md` | Create | Per-iteration prompts dispatched to cli-codex |
| `077/research/scripts/{dispatch-iter,run-loop}.sh` | Create | Per-iteration dispatcher + loop driver |
| `077/research/research.md` | Create | Synthesis with 4-phase remediation roadmap |
| `077/research/resource-map.md` | Create | 43-path inventory grouped by section |
| `077/{spec,plan,tasks,implementation-summary}.md` | Create | Level 1 packet docs |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | 10 iteration narratives produced | `ls 077/research/iterations/iteration-*.md \| wc -l` = 10 |
| REQ-002 | All 10 iterations exit_code 0 from cli-codex | `grep -c "codex exit=0" 077/research/loop-master.log` = 10 |
| REQ-003 | Canonical state log has ≥10 `"type":"iteration"` records | `grep -c '"type":"iteration"' 077/research/deep-research-state.jsonl` ≥ 10 |
| REQ-004 | research.md exists and includes per-surface findings + cross-cutting + remediation roadmap | Sections 2.1, 2.2, 2.3, 3, 5 present |
| REQ-005 | resource-map.md exists with section-grouped path inventory | Sections READMEs/Documents/Commands/Agents/Skills/Specs/Scripts/Tests/Config/Meta present |
| REQ-006 | validate.sh --strict on 077 exits 0 | `bash validate.sh 077 --strict` exit 0 |
| REQ-007 | One commit on main + pushed | `git push origin main` exit 0 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | Memory save via /memory:save | `generate-context.js` exits 0; graph-metadata.json refreshed |
| REQ-009 | Findings tally surfaces ≥15 P1 + ≥10 P2 issues | Counts visible in research.md §2-3 |
| REQ-010 | Remediation roadmap is concrete and sequenced | research.md §5 lists 4-5 phases with finding-ID closures per phase |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: User has a self-contained planning input (research.md) that supports a yes/no/defer decision on remediation work without re-reading the 10 iteration narratives.
- **SC-002**: All 22 P1 findings are mapped to exactly one remediation phase (no orphan findings).

### Given/When/Then Verification Scenarios

**Given** 10 iterations are dispatched, **When** the loop completes, **Then** all exit codes are 0 and 10 iteration-NNN.md files exist.

**Given** research.md is authored, **When** read by a maintainer, **Then** they can identify which finding closes in which proposed remediation phase.

**Given** resource-map.md is authored, **When** a reviewer audits scope, **Then** they can see all 43+ touched paths grouped by section.

**Given** validate.sh --strict is run on 077, **When** all four spec docs match Level 1 manifest contract, **Then** exit 0 with 0 errors and 0 warnings.

**Given** all changes are committed, **When** running `git push origin main`, **Then** push succeeds and remote is in sync.

**Given** memory is saved, **When** future sessions search for "077" or "OpenCode authoring recipe", **Then** the memory MCP returns this packet.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | cli-codex stalls on large iteration prompts | Med | Memory-rule mitigation: stdin redirection (used in dispatch-iter.sh) |
| Risk | False-positive findings from cli-codex hallucinating filenames | Low | Iteration prompt explicitly requires file:line evidence; spot-check verified iter 1 cited real paths |
| Risk | Synthesis loses fidelity vs raw iteration narratives | Med | Resource-map.md preserves path-level evidence; research.md cross-references finding IDs back to iterations |
| Risk | Remediation roadmap proposes too many phases (scope explosion) | Low | Roadmap explicitly proposes 4 dependent phases + 1 optional polish phase; user can defer or sequence |
| Dependency | cli-codex CLI installed (codex-cli 0.128.0) | Green | Verified before dispatch |
| Dependency | OPENAI_API_KEY for codex auth | Green | Codex calls all returned exit 0 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None. All 7 strategy questions resolved (see research.md §4).
<!-- /ANCHOR:questions -->

---

<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
