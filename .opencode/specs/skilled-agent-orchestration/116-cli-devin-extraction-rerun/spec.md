---
title: "Feature Specification: cli-devin extraction rerun — close 003 file-extraction gap, re-rank with live grader"
description: "Build a markdown-to-disk extraction layer, wire it into 003's scoring pipeline, re-run the 5 council-seeded variants with extraction + live claude-sonnet grader. Goal: validate the RCAF winner under full D1 acceptance scoring (not just text-quality dims)."
trigger_phrases:
  - "116 extraction rerun"
  - "cli-devin extraction layer"
  - "swe 1.6 file extraction"
  - "003 rerun with extraction"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/116-cli-devin-extraction-rerun"
    last_updated_at: "2026-05-17T05:35:00Z"
    last_updated_by: "main_agent"
    recent_action: "Scaffolded 116 spec"
    next_safe_action: "Build extract-files-from-markdown"
    blockers: []
    key_files:
      - "../114-cli-devin-swe16-prompt-optimization/003-eval-loop/synthesis.md"
      - "../114-cli-devin-swe16-prompt-optimization/002-eval-rig/scripts/deterministic/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000116"
      session_id: "116-scaffold"
      parent_session_id: null
    completion_pct: 5
    open_questions:
      - "If the ranking shifts post-extraction, does the new winner warrant cli-devin v1-0-6-0?"
      - "Grader cost ceiling: should we cap at $5 mid-run or run to completion?"
    answered_questions:
      - "Single Level 3 packet, not phase parent — bounded scope"
      - "Reuses 114/002 eval rig + 114/003 loop infrastructure; only adds extraction layer + re-runs"
      - "Live grader enabled this run (was mocked in 003)"
---
# Feature Specification: cli-devin extraction rerun — close 003 file-extraction gap

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

The 114/003 eval-loop run measured prompt-text quality on 7 fixtures, but SWE 1.6's `--print` mode returns markdown rather than files-on-disk. The D2 bundle-gate hard-fired on 4/7 fixtures because acceptance commands (`bash -n`, `npx vitest run`) couldn't find the referenced files. D1 was capped to 0.0 on those fixtures. The RCAF winner (v-004-rcaf-medium @ 0.5796) was selected on D2+D3+D4+D5 text signals alone.

This packet closes that gap: build a `scripts/extract-files-from-markdown.cjs` that parses fenced code blocks from SWE 1.6 output, infers file paths, writes each to the fixture CWD. Wire it into `score-variant.cjs` BEFORE deterministic checks. Re-run the same 5 council-seeded variants × 7 fixtures with `EVAL_LOOP_EXTRACT=true` AND the live claude-sonnet grader (003 used mock grader). Compare the new ranking against 003.

**Key Decisions**: Whether the file-extraction unlock changes the framework ranking (RCAF still wins, or does BUILD/STAR emerge with real D1 contribution?). Live grader cost ceiling.

**Critical Dependencies**: 114/002 eval rig (unmodified — extraction is a new script alongside, not a rewrite); 114/003 loop runner (unmodified); cli-devin SWE 1.6 (unchanged); claude-sonnet via cli-claude-code (new dependency for this run vs 003's mock).

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P2 |
| **Status** | Draft |
| **Created** | 2026-05-17 |
| **Branch** | `main` |
| **Parent Spec** | n/a (root packet under skilled-agent-orchestration) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
114/003 synthesis.md notes a known limitation: SWE 1.6 `--print` returns markdown text rather than files. The deterministic acceptance checks (`bash -n wrapper.sh`, `npx vitest run`, `node transform.js`) require files-on-disk to execute. D2 bundle-gate Layer 3 (smoke-run) hard-fired on 4/7 fixtures, which short-circuited D1 to 0.0 per the council ADR. The variant ranking (RCAF wins by 33%) was selected on D2+D3+D4+D5 text-quality signals alone. With D1 contributing real signal, the ranking may shift.

### Purpose
Build the file-extraction layer the 003 limitation deferred. Re-run with extraction + live grader. Confirm or revise the RCAF winner.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- New `scripts/extract-files-from-markdown.cjs` — parses SWE 1.6 markdown output, infers file paths from comment headers / markdown headers / context heuristics, writes blocks to fixture CWD
- Modification to 114/002 `scripts/score-variant.cjs` — call extraction before deterministic checks when `EVAL_LOOP_EXTRACT=true`
- Re-run loop on the 5 council-seeded variants × 7 fixtures with `EVAL_LOOP_EXTRACT=true` AND live claude-sonnet grader
- New `synthesis-v2.md` comparing v1 (text-only) vs v2 (with extraction) rankings
- If ranking shifts: scaffold cli-devin v1.0.6.0 changelog draft (separate uplift not in this packet)
- Cost ceiling: hard cap at $10 grader spend; pause loop if approaching

### Out of Scope
- Modifying cli-devin SKILL.md / assets (separate uplift if needed)
- Re-running 001 council (rubric unchanged)
- Adding new fixtures (same 7 from 003)
- Adding new mutation axes (same 5 axes; no hill-climbing this run, just seeded variants)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `116-cli-devin-extraction-rerun/scripts/extract-files-from-markdown.cjs` | Create | Parse markdown → write files to fixture CWD |
| `114-cli-devin-swe16-prompt-optimization/002-eval-rig/scripts/score-variant.cjs` | Modify | Call extraction when env flag set; restore fixture CWD between variants |
| `116-cli-devin-extraction-rerun/state/eval-loop-state-v2.jsonl` | Create | New run's state (separate from 003's state.jsonl) |
| `116-cli-devin-extraction-rerun/iterations/iteration-NNN.md` | Create (5) | One per variant run |
| `116-cli-devin-extraction-rerun/synthesis-v2.md` | Create | New ranking + comparison vs 003 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Extraction script handles fenced code blocks + file-path inference | Given a canned SWE 1.6 output, script writes expected files to expected paths; idempotent on re-run |
| REQ-002 | Extraction wired into score-variant.cjs behind env flag | `EVAL_LOOP_EXTRACT=true` triggers extraction; `=false` (or unset) preserves 003 behavior |
| REQ-003 | Re-run completes 5 variants × 7 fixtures | state-v2.jsonl has 5 iteration rows + loop-start + loop-end |
| REQ-004 | Live grader called (not mock) | Per-iteration row shows `grader.parse_status: ok` with non-zero confidence values; grader cache populates with real claude-sonnet outputs |
| REQ-005 | synthesis-v2.md compares v1 vs v2 rankings | Markdown table shows both runs' top-3 variants side-by-side; explicit "ranking changed" / "ranking stable" verdict |
| REQ-006 | Cost ceiling held | Total grader spend tracked; loop pauses if approaching $10 (writes pause sentinel like 003's rate-limit path) |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Fixture CWD restored between variants | After each variant scoring, extracted files cleared; next variant starts from pristine seed |
| REQ-008 | Extraction summary logged per fixture-result | fixtureResult includes `extraction: {files_written: N, paths: [...], skipped: [...]}` field |
| REQ-009 | If ranking shifts, draft v1.0.6.0 changelog | New file `cli-devin-v1.0.6.0-draft.md` in synthesis-v2 directory; separate commit/uplift not required in this packet |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Extraction layer ships and is reusable (003 v3 + future packets can opt in)
- **SC-002**: Re-run completes within ~2 hours wall-clock + $10 grader cost ceiling
- **SC-003**: synthesis-v2.md gives a clear answer on whether the RCAF winner holds under full D1 scoring
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Path inference heuristic mis-attributes blocks (writes to wrong location) | Med | Conservative heuristic: prefer explicit comment headers; skip ambiguous blocks rather than guess; log all skipped blocks |
| Risk | Extraction overwrites fixture seed files | Med | Restore-cwd cycle between variants; pre-extraction snapshot of seed/ contents for diff/restore |
| Risk | Live grader cost exceeds $10 | Low | Pause sentinel at $9 (config); operator-resume to continue past ceiling |
| Risk | Live grader produces parse failures on unfamiliar prompt shapes | Med | Harness already has 3-tier parse fallback (003 verified); flag persistent failures in synthesis-v2.md |
| Risk | Re-ranking finds NO change (RCAF still wins) | Low — but valuable | Synthesis explicitly documents this is the expected null-result outcome; confirms 003's text-only ranking is robust |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Extraction adds < 1s per fixture (vs ~60s SWE 1.6 dispatch); negligible overhead
- **NFR-P02**: Total re-run wall-clock < 2.5 hours (5 variants × 7 fixtures × ~60s + grader serial)

### Security
- **NFR-S01**: Extraction writes only inside the fixture CWD (no traversal); reject paths with `..` segments

### Reliability
- **NFR-R01**: Extraction is idempotent — re-running on same output produces same files
- **NFR-R02**: Extraction failure on one block does not corrupt the fixture (skip + log)

---

## 8. EDGE CASES

### Data Boundaries
- Empty SWE 1.6 output: extraction is a no-op; score-variant proceeds with empty CWD (D1 fails, D2-D5 may still score)
- Fenced block with no path comment: skip + log (don't guess)
- Multiple blocks for same path: last-wins; log conflict

### Error Scenarios
- Path resolves outside fixture CWD: reject + log; do not write
- Grader API rate limit during re-run: existing pause-sentinel pattern from 003 handles
- Grader returns malformed JSON: existing 3-tier parse fallback handles

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 12/25 | 1 new script + 1 modification + re-run; bounded |
| Risk | 14/25 | Live grader cost; extraction-overwrites-seed risk |
| Research | 4/20 | Extraction patterns are standard; no novel research |
| Multi-Agent | 6/15 | SWE 1.6 + live grader dispatches |
| Coordination | 8/15 | Reuses 114/002+003 infrastructure |
| **Total** | **44/100** | **Level 3** (live external dispatch + cross-packet coordination justifies L3) |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Path inference writes to wrong location | M | M | Conservative heuristic + skip-on-ambiguity + log |
| R-002 | Extraction corrupts fixture seed | M | L | Pre-extraction snapshot + restore between variants |
| R-003 | Live grader cost > $10 ceiling | L | L | Pause sentinel at $9 |
| R-004 | Re-ranking confirms 003 (null result) | L | M | Document as positive outcome — confirms RCAF robust |

---

## 11. USER STORIES

### US-001: Operator runs the re-run (Priority: P0)

**As an** operator wanting to validate 003's RCAF winner under full D1 scoring, **I want** to invoke the re-run with one command, **so that** I get an updated synthesis-v2.md within 2.5 hours.

**Acceptance Criteria**:
1. Given the extraction layer is built, When operator runs `node 116-cli-devin-extraction-rerun/scripts/loop-v2.cjs --real`, Then the loop dispatches 5 variants × 7 fixtures with extraction + live grader and exits with synthesis-v2.md written.

### US-002: Downstream consumer reads synthesis-v2.md (Priority: P0)

**As** a future cli-devin uplift packet (v1.0.6.0 or later), **I want** to read synthesis-v2.md and know whether 003's RCAF default is confirmed or revised, **so that** I can decide whether a v1.0.6.0 uplift is warranted.

**Acceptance Criteria**:
1. Given the re-run completes, When 004-style uplift consumer reads synthesis-v2.md, Then they see a clear verdict ("ranking stable: RCAF still wins" OR "ranking shifted: <new winner>").

## 12. OPEN QUESTIONS

- If the re-run produces a different winner, does the operator want me to also ship cli-devin v1.0.6.0 in the same packet, or split it into a follow-on?
- Should the cost ceiling be configurable, or hard-coded at $10?
- Do we need a third run after this one (e.g., with hill-climbing mutations now that D1 contributes), or is one re-run sufficient to validate?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Upstream contract**: `../114-cli-devin-swe16-prompt-optimization/001-council-design/ai-council/council-report.md`
- **Upstream rig**: `../114-cli-devin-swe16-prompt-optimization/002-eval-rig/`
- **Upstream loop**: `../114-cli-devin-swe16-prompt-optimization/003-eval-loop/`
- **Upstream synthesis (v1)**: `../114-cli-devin-swe16-prompt-optimization/003-eval-loop/synthesis.md`
