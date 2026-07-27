---
title: "Implementation Plan: Dead Code, Legacy Artifact and Architecture Simplification Audit"
description: "Run twenty forced-depth research passes across three model families, path-verify every claim against the real tree, then synthesize one ranked findings report. Audit only: nothing is deleted, moved, or refactored in this phase."
trigger_phrases:
  - "dead code audit plan"
  - "release cleanup 016 plan"
  - "architecture simplification plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/001-release-cleanup/016-dead-code-and-architecture-audit"
    last_updated_at: "2026-07-27T05:50:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Authored the research-then-audit plan"
    next_safe_action: "Pre-flight executor auth, then dispatch lineage L1"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-27-028-016-dead-code-audit"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Dead Code, Legacy Artifact and Architecture Simplification Audit

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, JavaScript (CommonJS + ESM), Bash, Python 3 |
| **Framework** | OpenCode skill/command framework, MCP servers, deep-loop runtime |
| **Storage** | SQLite (spec memory, code graph, deep-loop ledgers), JSONL state logs |
| **Testing** | Vitest for runtime libs, shell validators, spec-kit `validate.sh` |

### Overview

Two orchestrated research lineages and one hand-driven Devin sequence sweep the repository under a forced-depth policy. Their findings are merged, path-verified against the real working tree, deduplicated, ranked by value against blast radius, and written to a single findings report. No remediation happens here; the report is the deliverable and the remediation phase is separately approved.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Executor auth pre-flight passes for `cli-opencode`, `cursor-agent`, and `devin`
- [ ] Five distinct manual-pass focuses are declared before the first Devin dispatch
- [ ] Artifact root under `research/` is bound before any dispatch

### Definition of Done
- [ ] 20 passes recorded (10 + 5 orchestrated, 5 manual)
- [ ] Every finding path-verified against the working tree
- [ ] `findings-report.md` covers all six categories and is ranked
- [ ] `git status --porcelain` shows changes confined to this spec folder
- [ ] `validate.sh --strict` exits 0 for this folder
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Redundant discovery across model families feeding a single verification-and-synthesis stage. Discovery is deliberately duplicated; acceptance is deliberately centralized and evidence-gated.

### Key Components

- **L1 (`cli-opencode`, `openai/gpt-5.6-sol`, effort high, 10 passes)**: the depth lineage — reachability, layering, and over-engineering analysis that needs sustained reasoning.
- **L2 (`cli-cursor`, `composer-2.5-fast`, 5 passes)**: breadth lineage — fast, wide filesystem and naming sweeps for residue and misplacement.
- **M1 (`cli-devin`, `glm`, 5 manual passes)**: independent third opinion on the same surfaces, dispatched by hand because Devin is not a deep-loop executor kind.
- **Verification and synthesis stage**: path-checks every claim, drops unverifiable ones, deduplicates, records disagreements, and ranks.

### Data Flow

L1 and L2 write iteration files, deltas, and JSONL state logs under their own bound directories in `research/`. Each Devin pass writes a transcript to `research/manual-devin/pass-NN.md`. The merge step reads all three sources, produces a candidate finding set, verifies each candidate against the working tree, and emits `findings-report.md`. Nothing in the flow writes outside this spec folder.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Pre-flight and setup
- [ ] `opencode providers list` confirms the OpenAI GPT-5.6 catalog is authenticated
- [ ] `cursor-agent --list-models` confirms `composer-2.5-fast` is reachable
- [ ] `command -v devin` succeeds and the self-invocation guard is clear
- [ ] Working tree is clean or committed, and the recovery-baseline commit hash is recorded
- [ ] Research topic, six category prompts, and the five manual-pass focuses are bound

### Phase 2: Research program (20 passes)
- [ ] Dispatch L1 and L2 as one fan-out, `--convergence-mode=divergent`, `--stop-policy=max-iterations`
- [ ] Confirm at each lineage's first iteration boundary that it is producing real state, not stalling
- [ ] Run the five Devin passes one at a time, each with its own pre-declared focus
- [ ] Confirm no lineage exited on early convergence and no manual pass was skipped

### Phase 3: Verification and synthesis
- [ ] Path-check every candidate finding against the working tree; drop what does not exist
- [ ] Attach a reproducible verification command to every CAT-1 through CAT-4 candidate
- [ ] Deduplicate across passes; record disagreements rather than silently merging
- [ ] Rank by remediation value against blast radius
- [ ] Write `findings-report.md` and the remediation handoff in `implementation-summary.md`

### Phase 4: Close
- [ ] `git status --porcelain` confirms no collateral writes
- [ ] `validate.sh --strict` exits 0
- [ ] Parent phase map row updated to the real status
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structural | Spec folder conformance | `validate.sh --strict` |
| Evidence | Sampled re-run of per-finding verification commands | `rg`, code-graph queries |
| Containment | No writes outside this spec folder | `git status --porcelain` |
| Reachability | Dynamic-reference check for dead-code candidates | String-literal search across `.ts`, `.js`, `.cjs`, `.md`, `.yaml`, `.json` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `cli-opencode` + OpenAI GPT-5.6 catalog auth | External | Unverified until pre-flight | Lineage L1 cannot start |
| `cursor-agent` CLI auth | External | Unverified until pre-flight | Lineage L2 cannot start |
| `devin` CLI auth | External | Unverified until pre-flight | Manual pass M1 cannot start |
| Deep-loop fan-out runtime | Internal | Green | No multi-lineage run; would fall back to sequential single-executor |
| Code graph index | Internal | Empty at session start; needs a scan | Reachability analysis falls back to text search only |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A dispatched pass writes outside `research/`, or the working tree shows unexpected modifications during the run.
- **Procedure**: Stop all passes, `git status` to enumerate stray paths, restore them from the recorded recovery-baseline commit, and re-dispatch with a tighter write-path constraint in the rendered prompt. Because this phase performs no remediation, no repository content is at risk from the audit's own intended output.
<!-- /ANCHOR:rollback -->
