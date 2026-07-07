---
title: "Implementation Plan: Wave 010 - md-generator Serial Pipeline Dispatches"
description: "Plan for the 9 strictly-sequential opencode-run dispatches (MR-005, AI-001-P5, PB-003, MG-001..MG-004, FR-001-md-generator, FR-002-md-generator), the coordinator fixture checkpoint, and criteria-cited grading."
trigger_phrases:
  - "wave 010 plan"
  - "md-generator serial pipeline dispatch plan"
importance_tier: "high"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/023-full-manual-playbook-execution/010-md-generator-serial-pipeline"
    last_updated_at: "2026-07-07T18:15:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored plan.md"
    next_safe_action: "Author tasks.md and checklist.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "wave-010-md-generator-serial"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Wave 010 - md-generator Serial Pipeline Dispatches

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | `opencode run` CLI (real executor: `openai/gpt-5.5-fast`, `--variant medium`, `--format json`); `skill_advisor.py` deterministic probe script; `design-md-generator`'s live Playwright backend (`extract.ts`, `build-write-prompt.ts`, `validate.ts`, `report-gen.ts`, `preview-gen.ts`) |
| **Framework** | `manual_testing_playbook` `{PREFIX}-NNN` scenario contract shape; the validated dispatch recipe shared across all `023-full-manual-playbook-execution` waves |
| **Storage** | `/tmp/skd-<dispatch-id>-response.jsonl` transcripts; live-extraction sandbox artifacts under `/tmp/skd-MR005/`, `/tmp/skd-PB003/`, `/tmp/skd-MG001/`, `/tmp/skd-MG002/`, `/tmp/skd-MG003/`; this spec folder's own documentation |
| **Testing** | Manual grading against each scenario file's own Pass/Fail Criteria section |

### Overview

Nine dispatches, run strictly one at a time in a fixed order (this wave is the one wave in the 10-folder execution plan where every dispatch can write real files, so parallelism was structurally forbidden): a mode-routing check (`MR-005`), one positive-advisor-control probe (`AI-001-P5`), a parity-preservation confirmation (`PB-003`), the four-scenario `04--md-generator-pipeline/` set (`MG-001` extract-write-validate, `MG-002` validate-only, `MG-003` fidelity/report, `MG-004` brief-only negative control), and both md-generator variants of the fallback-and-resilience negative controls (`FR-001-md-generator`, `FR-002-md-generator`). `MG-001`'s real extraction output was copied forward via a plain-Bash coordinator checkpoint (not a dispatch) to seed `MG-002` and `MG-003`'s fixture inputs. Each dispatch followed the same 4-step recipe: deterministic advisor probe on the clean exact prompt, real `opencode run` dispatch with the standard evaluation addendum (empty `NO_TARGET_CLAUSE` throughout this wave, since every prompt either names a real external URL, an already-seeded `/tmp` fixture, or is a non-UI-surface advisory/routing question), full JSON-lines transcript capture, and a verdict graded strictly against the scenario file's own Pass/Fail Criteria. A mandatory `git status --porcelain` check ran immediately after `MR-005` and `AI-001-P5` (the two dispatches whose prompts do not pin an explicit sandboxed output path) to catch any write escaping outside `/tmp/`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Read all 9 constituent scenario files in full (`md-generator-mode.md`, `positive-design-controls.md`, `md-generator-preservation-confirmation.md`, `extract-write-validate.md`, `validate-design-md.md`, `design-fidelity-check.md`, `brief-only-authoring-boundary.md`, `no-card-matches-fallback.md`, `direct-fallback-without-subagents.md`)
- [x] Located the Level 2 documentation template shape from `../../022-benchmark-rerun-and-coverage-fill/` and the same-family strict-serial precedent in `../009-fallback-and-hub-intake/`
- [x] Read `design-md-generator/SKILL.md`'s Smart Router Pseudocode, `INTENT_SIGNALS` keyword table, `RESOURCE_MAP`, and Resource Loading Levels table in full to author two clean prompts and grade phase/resource claims precisely

### Definition of Done
- [x] All 9 dispatches executed strictly sequentially in the mandated order, each with a captured JSON-lines transcript
- [x] Mandatory `git status --porcelain` check run and recorded after `MR-005` and `AI-001-P5`
- [x] Coordinator checkpoint verified against `MG-001`'s real output paths before copying into `MG-002`/`MG-003`
- [x] Each dispatch graded PASS/PARTIAL/FAIL/SKIP citing the scenario file's own criterion line
- [x] `dispatch-log.md` written with one row per dispatch
- [x] `description.json` and `graph-metadata.json` generated
- [x] `validate.sh --strict` clean (Errors: 0)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Strict sequential single-dispatch execution, unique among the 10 wave folders in this packet: advisor probe (deterministic, `--threshold 0.8`) -> real orchestrator dispatch (`timeout 580 opencode run ... </dev/null`, capturing JSON-lines stdout) -> mandatory `git status --porcelain` check for dispatches without a pinned sandbox path -> parse `type:"text"`/`type:"tool_use"` lines to reconstruct the model's reasoning, resolved mode/packet loads, and tool-call sequence -> grade against the scenario file's own Pass/Fail Criteria, citing the exact line. `MR-005` through `MG-004` (5 dispatches) each perform a real Playwright crawl of `https://example.com`; `FR-001-md-generator` and `FR-002-md-generator` are read/validate-only.

### Key Components

- **Live-extraction two-hop write pattern**: `design-md-generator/backend/scripts/extract.ts` guards its own `--output` flag to only accept paths under `.opencode/specs` or the approved `/var/.../T/skd-*` sandbox. Every dispatch that requested a specific `/tmp/skd-*` or repo-root output path (`MR-005`, `AI-001-P5`, `PB-003`, `MG-001`) had its first direct-output attempt refused, then self-corrected: ran extraction into the approved sandbox, then copied (`cp`) or wrote (`apply_patch`) the final `DESIGN.md`/`tokens.json`/`extraction-report.json` to the originally requested location. This is expected, packet-documented behavior (`design_system_extraction.md`'s sandbox guard), not a failure — verified consistent across all 4 dispatches that hit it.
- **`AI-001-P5` timeout-then-leak sequence**: The first attempt (`timeout 300`) hit the 300s wall while `npm install && npx playwright install chromium` was still running (backend dependencies were not yet warm for this session), leaving an empty `design-extracts/example-com/` directory at repo root. Retried at `timeout 580` per the recipe's "300s+" allowance; the retry completed but — because the scenario's own prompt (`Extract design tokens from https://example.com and generate DESIGN.md.`) never specifies an output path — the model reasoned that "no workspace `DESIGN.md` exists outside bundled examples" and wrote the final artifact directly to the repo root as `DESIGN.md` (untracked, confirmed via immediate `git status --porcelain`). Documented, not cleaned up, per the coordinator's explicit instruction.
- **`FR-001-md-generator` authored-prompt gap**: the scenario file (`no-card-matches-fallback.md`) gives an exact prompt only for the `foundations` variant; the `md-generator` variant is described solely by its expected fallback-line text (`Procedure applied: none - baseline md-generator pipeline`). Authored a narrow doc-structure advisory prompt (`for the markdown document this mode produces, explain whether the Voice & Tone section should appear before or after the Components section`) after cross-checking it against every keyword in `INTENT_SIGNALS` (`EXTRACT_WRITE`, `VALIDATE`, `REPORT`, `STUDY`, `RUN_WRAPPER`) and the private procedure-card trigger list (`extraction, token capture, DESIGN.md, source design systems, screenshots, measured brand references`) to guarantee the no-card path is genuinely exercised.
- **`FR-002-md-generator` lightly-authored prompt**: the scenario file's own `md-generator variant` text uses generic `this DESIGN.md`/`tokens.json` with no path. Substituted the already-seeded `/tmp/skd-MG003/DESIGN.md` and `/tmp/skd-MG003/tokens.json` paths (produced by this same wave's `MG-001`+checkpoint), keeping every other word verbatim, per the recipe's own "prompts referencing already-seeded /tmp fixture files" empty-clause category.
- **`MG-002`/`MG-003` advisor-ranking anomaly**: both dispatches' internal `advisor_recommend` calls ranked `sk-doc` ahead of `sk-design` (0.87-0.88 vs 0.82), yet the model's own subsequent routing text explicitly named and resolved `md-generator`, loaded exactly the resource set each scenario's own "Expected mode resources loaded or cited" list specifies, and ran the correct backend script (`validate.ts` for `MG-002`; `validate.ts` + `report-gen.ts` + `preview-gen.ts` for `MG-003`). Graded PARTIAL against each scenario's explicit "advisor top-1 is sk-design" AND-condition, since that specific sub-criterion was not met even though the overall routing intent was correct.
- **`MG-004` router-precedence gap**: contrary to the scenario's own "Expected mode resolution: md-generator" and its cited router-contract reasoning (the Smart Router's `EXTRACT_WRITE` intent should score on `generate`/`design.md`-adjacent keywords and keep the request inside `md-generator`'s own CONDITIONAL authoring-boundary gate rather than falling through to `foundations`), the real dispatch resolved to `foundations` directly, never loaded `design-md-generator/SKILL.md` at all, and therefore never cited `references/authoring_boundary.md` or `assets/source_of_truth_router_card.md`. The produced (chat-only, not file-written) `DESIGN.md`-shaped content presented every brief value (`#1a73e8`, `Inter`, `8px`, `12px`) as unlabeled definitive CSS custom-property tokens, not distinctly labeled brief-provided prose. Graded FAIL against the scenario's own explicit FAIL triggers.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/sk-design/manual_testing_playbook/01--mode-routing/`, `02--advisor-integration/`, `06--parity-behavior/`, `04--md-generator-pipeline/`, `07--fallback-and-resilience/` | Scenario source | Read-only, no edits | Full-file reads before dispatching |
| `.opencode/skills/sk-design/design-md-generator/SKILL.md`, `mode-registry.json`, `hub-router.json` | Grading references | Read-only, no edits | Grep + targeted reads of the exact router pseudocode, resource-loading table, and phase-detection keyword sections cited by each scenario's Pass/Fail Criteria |
| `design-md-generator/backend/` live extraction pipeline (`extract.ts`, `build-write-prompt.ts`, `validate.ts`, `report-gen.ts`, `preview-gen.ts`) | External-facing tool under test | Not modified — exercised as a live dependency by 6 of the 9 dispatches | Confirmed via each dispatch's own tool-call transcript (`bash` invocations of the real scripts, real stdout captured) |
| Repo root `DESIGN.md` (untracked) | Real, unexpected write from `AI-001-P5`'s dispatch | Left in place, documented | Confirmed via `git status --porcelain` immediately after the dispatch; file still present at wave-completion time, 8295 bytes |
| Repo root `design-extracts/example-com/` (untracked, empty) | Leftover from `AI-001-P5`'s timed-out first attempt | Left in place, documented | Confirmed empty via `find`, still present at wave-completion time |
| `/tmp/skd-MR005/`, `/tmp/skd-PB003/`, `/tmp/skd-MG001/`, `/tmp/skd-MG002/`, `/tmp/skd-MG003/`, `/tmp/skd-MG004*` | Sandbox output paths | Written to (or confirmed absent, for `MG-004`) by the live dispatches | Confirmed via `find`/`ls` immediately after each dispatch |

Required inventories:
- Same-class producers: other `023-full-manual-playbook-execution` waves running concurrently in parallel sessions — no file-path collisions since each wave owns a distinct dispatch-id prefix and its own spec-folder path; this wave's own dispatches were the only ones permitted to run in parallel with each other zero times (strictly serial by design).
- Consumers of changed symbols: none — this wave produces no source-file or playbook-file changes, only spec-folder documentation and sandboxed/flagged artifact writes.
- Matrix axes: dispatch-id x {advisor probe result, real dispatch transcript, scenario's own Pass/Fail Criteria, verdict} — the grading grid every dispatch in `dispatch-log.md` follows.
- Algorithm invariant: every verdict cites the exact scenario-file criterion line it rests on; no verdict is asserted against a generic bar; no unexpected write outside a dispatch's assigned sandbox is silently cleaned up without being logged first.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Scenario Reading & Recipe Setup
- [x] Read all 9 constituent scenario files in full
- [x] Read `design-md-generator/SKILL.md`'s router/resource/phase-detection sections needed to author two clean prompts and grade each scenario's contract-specific claims

### Phase 2: Sequential Dispatch Execution (strict order, no parallelism)
- [x] `MR-005`: advisor probe -> exact-prompt real dispatch -> transcript -> mandatory git status check -> grade
- [x] `AI-001-P5`: advisor probe -> exact-prompt real dispatch (retried at 580s after a 300s timeout) -> transcript -> mandatory git status check -> grade
- [x] `PB-003`: advisor probe -> exact-prompt real dispatch -> transcript -> grade
- [x] `MG-001`: advisor probe -> exact-prompt real dispatch -> transcript -> grade (produces the fixture pair)
- [x] Coordinator checkpoint: verify `MG-001`'s real output paths, seed `/tmp/skd-MG002/` and `/tmp/skd-MG003/`
- [x] `MG-002`: advisor probe -> exact-prompt real dispatch -> transcript -> grade
- [x] `MG-003`: advisor probe -> exact-prompt real dispatch -> transcript -> grade
- [x] `MG-004`: advisor probe -> exact-prompt real dispatch (negative control) -> transcript -> confirm no file written -> grade
- [x] `FR-001-md-generator`: advisor probe -> authored-prompt real dispatch -> transcript -> grade
- [x] `FR-002-md-generator`: advisor probe -> lightly-authored-prompt real dispatch -> transcript -> grade

### Phase 3: Documentation & Verification
- [x] Write `dispatch-log.md` with one row per dispatch
- [x] Write this wave's Level 2 spec-folder documentation
- [x] Generate `description.json` and `graph-metadata.json`
- [x] Run `validate.sh --strict` and fix anything that fails
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Advisor probe | Deterministic top-1 skill + confidence per clean exact prompt | `skill_advisor.py --threshold 0.8` |
| Real dispatch | Full orchestrator behavior (routing text, tool calls, resolved mode/packet, real backend script execution, final response) | `opencode run --model openai/gpt-5.5-fast --variant medium --format json` |
| Sandbox-escape check | Confirm no dispatch writes outside its assigned sandbox without being flagged | `git status --porcelain` immediately after `MR-005` and `AI-001-P5`; `find`/`ls` on the assigned `/tmp/skd-*` path after every dispatch |
| Criteria-cited grading | Each dispatch's transcript vs. its scenario file's own Pass/Fail Criteria | Manual line-by-line comparison, citing the exact criterion |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Live `opencode run` executor (`openai/gpt-5.5-fast`) | Verification tool | Available, all 9 dispatches completed within the extended timeout | Would need router-mode-only grading, a weaker signal |
| `design-md-generator/backend` Playwright pipeline against `https://example.com` | External system, exercised by 5 of 9 dispatches | Available; backend `npm install`/Chromium install ran cold on `AI-001-P5`'s first attempt (causing its timeout), warm thereafter | Would block all live-extraction grading, forcing SKIP verdicts on `MR-005`/`AI-001-P5`/`PB-003`/`MG-001` |
| `MG-001`'s real fixture output | Internal dependency for `MG-002`/`MG-003` | Produced successfully at `/tmp/skd-MG001/{DESIGN.md,tokens.json}`, copied forward via the coordinator checkpoint | Would force `MG-002`/`MG-003` to SKIP per the task's own fallback instruction |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A verdict in `dispatch-log.md` turns out to be miscited against the wrong criterion on a later re-read.
- **Procedure**: `git restore` this spec folder's docs; no source-code or playbook file was touched, so no other rollback surface exists for the documentation itself. The two real repo-root side effects (`DESIGN.md` and `design-extracts/example-com/`) are not reversible by this session's own rollback authority — per explicit task instruction they were left in place and documented for operator decision (see `spec.md` Open Questions); an operator wishing to remove them can run `rm /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/DESIGN.md` and `rm -r /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/design-extracts/` (both untracked, so removal is a plain filesystem delete with no git history to unwind).
<!-- /ANCHOR:rollback -->
