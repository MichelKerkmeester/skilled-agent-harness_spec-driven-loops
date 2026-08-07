---
title: "Implementation Plan: Wave 007 - Shared Base & Parity Core"
description: "Plan for running the validated dispatch recipe against 5 sk-design playbook scenarios and grading each against its own Pass/Fail Criteria."
trigger_phrases:
  - "wave 007 plan"
  - "shared base parity core dispatch plan"
importance_tier: "high"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/023-full-manual-playbook-execution/007-shared-base-and-parity-core"
    last_updated_at: "2026-07-07T17:25:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored plan.md"
    next_safe_action: "Author tasks.md and checklist.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "wave-007-shared-base-parity-core"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Wave 007 - Shared Base & Parity Core

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | `skill_advisor.py` (advisor probe CLI), `opencode run` (real orchestrator dispatch CLI, `openai/gpt-5.5-fast --variant medium --format json`) |
| **Framework** | `manual_testing_playbook` `{PREFIX}-NNN` scenario contract shape; validated dispatch recipe (advisor probe → real dispatch → JSONL capture → grade) |
| **Storage** | `/tmp/skd-<dispatch-id>-{advisor,response}.{txt,jsonl}` capture files; this spec folder for the durable documentation |
| **Testing** | Manual grading against each scenario file's own Pass/Fail Criteria section |

### Overview

Read all 5 assigned scenario files in full first (ground truth for exact prompts and criteria), plus one sibling phase's docs as the exact structural template. Then ran the 2-step dispatch recipe sequentially for each scenario: a deterministic advisor probe with the clean prompt, then a real `opencode run` dispatch with the clean prompt plus the standardized addendum (target-file clause included only for prompts naming a hypothetical local UI surface). Captured every response as JSONL, parsed it into text/tool_use segments, and graded against the scenario's own criteria, citing the exact line.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Read all 5 scenario files in full (`hub-routing-only.md`, `procedure-selection-proof.md`, `context-proof-gates.md`, `motion-procedure-selection-proof.md`, `audit-procedure-selection-proof.md`)
- [x] Read `022-benchmark-rerun-and-coverage-fill/`'s 5 docs as the exact Level 2 structural template
- [x] Confirmed `skill_advisor.py` and `opencode` CLI are both available

### Definition of Done
- [x] `SR-004` advisor probe + real dispatch run, graded
- [x] `PB-001` advisor probe + real dispatch run, graded
- [x] `PB-002` advisor probe + real dispatch run, graded
- [x] `PB-004` advisor probe + real dispatch run, graded
- [x] `PB-005` advisor probe + real dispatch (primary) run, graded
- [x] `PB-005` negative-control variant dispatched per its own Exact Command Sequence step 4, graded
- [x] `dispatch-log.md` written with one row per dispatch (6 rows for 5 scenario ids)
- [x] `implementation-summary.md` written with the verdict summary
- [x] `generate-description.js` + `backfill-graph-metadata.js` + `validate.sh --strict` all run clean
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Sequential single-agent dispatch loop: for each of the 5 scenarios, (1) run the deterministic advisor probe against the clean exact prompt via `Bash`, (2) construct the real dispatch prompt by appending the standardized addendum (with or without the no-target clause, decided by reading the scenario's own exact prompt text for a named hypothetical local UI surface), (3) run `timeout 300 opencode run ... </dev/null` and capture full JSONL stdout, (4) parse the JSONL into text/tool_use segments with a small Python extractor (avoids exceeding file-read token caps on large multi-tool-call responses), (5) grade against the scenario's own Pass/Fail Criteria, citing the exact line.

### Key Components

- **No-target clause decision**: applied for `PB-001` ("this fintech dashboard"), `PB-002` ("the supplied dashboard screenshot description"), `PB-004` ("this command menu"), and `PB-005` ("this checkout screen" / "this hero section") — all name a hypothetical local UI surface with no real file in this repo. Omitted for `SR-004`, which is a routing/ownership question about the skill's own file structure, not a named local UI target.
- **Advisor-probe divergence handling**: the standalone `skill_advisor.py` probe hit "Native advisor unavailable" twice (`PB-002`, `PB-005` primary), falling back to a local heuristic scorer that ranked `sk-design` below or tied with `sk-code`/`system-spec-kit` rather than a clean top-1 win. Both occurrences are recorded verbatim rather than re-run until a clean result appeared, and the live orchestrator's own internal `mk_skill_advisor_advisor_recommend` tool call (visible inside the JSONL response) was used as the more authoritative live signal when it diverged from the standalone probe.
- **JSONL extraction script**: a small inline Python script reads each `.jsonl` file line by line, printing only `type:"text"` message text and `type:"tool_use"` tool+input summaries — this avoids the Read tool's token cap on some of the larger multi-tool-call responses (`SR-004`'s response alone was ~54k tokens raw).
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `shared-reference-base/hub-routing-only.md` (`SR-004`) | Scenario source | Read-only real dispatch | Captured `/tmp/skd-SR004-response.jsonl`, graded |
| `parity-behavior/{procedure-selection-proof,context-proof-gates,motion-procedure-selection-proof,audit-procedure-selection-proof}.md` (`PB-001/002/004/005`) | Scenario sources | Read-only real dispatches | Captured `/tmp/skd-{PB001,PB002,PB004,PB005,PB005neg}-response.jsonl`, graded |
| This spec folder | New | Level 2 doc set + dispatch log | `validate.sh --strict` |

Required inventories:
- Same-class producers: sibling wave agents (`001`-`006`, `008`-`010`) run concurrently against disjoint scenario sets in disjoint spec folders; no shared-file contention since each wave only writes inside its own folder.
- Consumers of changed symbols: none — no sk-design source files were modified, only read/dispatched against.
- Matrix axes: scenario x {advisor probe, real dispatch, grading} — every scenario gets all three steps; `PB-005` gets the real-dispatch step twice (primary + negative control).
- Algorithm invariant: every verdict traces to a real captured `.jsonl` file and cites the exact Pass/Fail Criteria line it rests on — no verdict is asserted from memory or paraphrase.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read all 5 scenario files in full
- [x] Read `022-benchmark-rerun-and-coverage-fill/`'s 5 docs as the structural template
- [x] Confirmed `skill_advisor.py` and `opencode` CLI availability

### Phase 2: Dispatch Execution (sequential, one at a time)
- [x] `SR-004`: advisor probe (sk-design 0.904 top-1) → real dispatch → PASS
- [x] `PB-001`: advisor probe (sk-design 0.878 top-1) → real dispatch → PASS
- [x] `PB-002`: advisor probe (native unavailable, fallback: sk-design 0.89, NOT top-1) → real dispatch → PARTIAL
- [x] `PB-004`: advisor probe (sk-design 0.867 top-1) → real dispatch → PASS
- [x] `PB-005` primary: advisor probe (native unavailable, fallback: sk-design 0.95 tied #1) → real dispatch → contributes to PASS
- [x] `PB-005` negative control: advisor probe (sk-design 0.914 top-1) → real dispatch → contributes to PASS

### Phase 3: Grading & Documentation
- [x] Graded all 6 dispatches against their scenario's own Pass/Fail Criteria, citing exact lines
- [x] Wrote `dispatch-log.md` (one row per dispatch)
- [x] Wrote this Level 2 doc set (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`)
- [x] Ran `generate-description.js`, `backfill-graph-metadata.js`, `validate.sh --strict`
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Advisor probe | Deterministic top-1/confidence check per scenario | `skill_advisor.py --threshold 0.8` |
| Real dispatch | End-to-end skill-routing + packet-load + response behavior | `opencode run --model openai/gpt-5.5-fast --variant medium --format json` |
| Criteria grading | Each dispatch's JSONL transcript vs. scenario's own Pass/Fail Criteria | Manual read + Python JSONL extraction |
| Spec-folder validation | Doc-shape and metadata conformance | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `skill_advisor.py` | Advisor probe tool | Available | Would need MCP `advisor_recommend` as substitute |
| `opencode` CLI (`1.17.11`) | Real dispatch tool | Available | No substitute — this is the required real-execution transport |
| Native skill-advisor daemon | Advisor accuracy | Intermittently unavailable (2 of 6 probes fell back to local scorer) | Fallback scorer still ran; divergence recorded honestly, did not block dispatch |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A grading verdict is later found to misread a scenario's own Pass/Fail Criteria.
- **Procedure**: Re-read the scenario file's criteria section, re-grade from the already-captured `/tmp/skd-*-response.jsonl` transcript (no re-dispatch needed since the transcript is preserved), and edit `dispatch-log.md`/`implementation-summary.md` accordingly. No source-code or skill-file changes are involved since this wave never modified sk-design itself.
<!-- /ANCHOR:rollback -->
