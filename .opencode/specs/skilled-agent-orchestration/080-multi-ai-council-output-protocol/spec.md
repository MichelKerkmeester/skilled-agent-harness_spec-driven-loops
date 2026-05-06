---
title: "Feature Specification: Multi-AI Council Output Protocol"
description: "Introduce ai-council/ subfolder convention parallel to research/ and review/ for capturing multi-ai-council deliberation rounds, per-seat outputs, critiques, and the final synthesized plan. Lightweight (no dedicated skill folder); all council logic stays in the @multi-ai-council agent body plus optional shared references under system-spec-kit."
trigger_phrases:
  - "ai-council"
  - "multi-ai-council subfolder"
  - "council output protocol"
  - "council deliberation rounds"
  - "council seat outputs"
  - "iterative council planning"
importance_tier: "critical"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/080-multi-ai-council-output-protocol"
    last_updated_at: "2026-05-06T10:00:00.000Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored Level 3 spec.md proposing ai-council/ folder convention"
    next_safe_action: "Author plan.md, tasks.md, checklist.md, decision-record.md"
    blockers: []
    completion_pct: 25
    open_questions:
      - "Where exactly should shared references live: system-spec-kit/references/multi-ai-council/ vs a top-level references path?"
      - "Does the validator need to recognize ai-council/ as a known subfolder, or is it free-form like scratch/?"
    answered_questions: []
---

# Feature Specification: Multi-AI Council Output Protocol

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-05-06 |
| **Branch** | `main` |
| **Parent Track** | `skilled-agent-orchestration` |
| **Predecessor** | None |
| **Successor** | None (yet) |
| **Handoff Criteria** | Spec docs validate strict; agent invocation contract is unambiguous; folder layout matches user intent (parallel to research/ and review/, lightweight, no dedicated skill). |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem-statement -->
## 2. PROBLEM STATEMENT

The `@multi-ai-council` agent (`.opencode/agent/multi-ai-council.md`) produces multi-round deliberation across diverse AI seats and synthesizes a final plan. Today the output is **transient**: it returns to the user inline (stdout) and any intermediate seat outputs land in unstructured `scratch/` files when written at all. There is no parity with the deep skills (`@deep-research` writes to `research/`, `@deep-review` writes to `review/`).

This means:

- Council deliberations are not preserved as packet artifacts. Future iterations cannot build on prior rounds.
- The synthesized plan is not retrievable from the spec packet (only from chat history).
- Reviewers and downstream implementation agents cannot audit which seats said what or how the final plan converged.
- The framework lacks a documented convention for "I dispatched a council on this packet, where did the output go?"

**Goal:** introduce a structured `ai-council/` subfolder that mirrors the `research/` and `review/` patterns at a smaller scope (no dedicated skill), so council outputs are first-class packet artifacts that support iteration, audit, and resume.
<!-- /ANCHOR:problem-statement -->

---

<!-- ANCHOR:goals -->
## 3. GOALS AND NON-GOALS

### Goals
- **G1.** Define a canonical `ai-council/` subfolder layout under any spec packet.
- **G2.** Document file shapes (state.jsonl, config.json, strategy.md, per-round, per-seat, critiques, council-report.md).
- **G3.** Update `@multi-ai-council` agent body so every dispatch writes outputs to `ai-council/` of the active spec folder.
- **G4.** Support iterative re-dispatch: a second council run on the same packet appends a new round, doesn't overwrite.
- **G5.** Keep this lightweight: NO dedicated skill folder, NO YAML workflow, NO new command surface. All logic lives in the agent body + optional shared references under `system-spec-kit`.
- **G6.** Preserve plan-only safety: agent retains `write: deny` on source files; the only writes go to `ai-council/` artifacts.

### Non-Goals
- **N1.** Building a full deep-skill clone (no convergence detection comparable to deep-research, no severity scoring like deep-review).
- **N2.** Adding a `/spec_kit:council` slash command. Council remains agent-dispatched only.
- **N3.** Formalizing seat-selection logic into a skill. Seat diversity stays as agent-body guidance per the existing CRITICAL note in the agent.
- **N4.** Replacing `scratch/` for experimental council runs that don't warrant packet preservation. Operators can still drop notes there.
- **N5.** Implementing a CLI-based council orchestrator. Council seat dispatch reuses existing CLI skills (cli-codex, cli-copilot, cli-gemini, etc.) via the agent's `task: allow` permission.
<!-- /ANCHOR:goals -->

---

<!-- ANCHOR:proposed-design -->
## 4. PROPOSED DESIGN

### 4.1 Folder layout

```
specs/<track>/<NNN-name>/
├── ai-council/
│   ├── ai-council-config.json     # one per packet, mutated across runs
│   ├── ai-council-strategy.md     # charter authored on first run, edited as scope evolves
│   ├── ai-council-state.jsonl     # append-only state log (one line per round event)
│   ├── seats/                     # per-AI seat outputs, organized by round
│   │   ├── round-001/
│   │   │   ├── seat-001-cli-codex.md
│   │   │   ├── seat-002-cli-copilot.md
│   │   │   └── seat-003-cli-gemini.md
│   │   └── round-002/...
│   ├── deliberations/             # synthesized cross-seat deliberation per round
│   │   ├── round-001.md
│   │   └── round-002.md
│   ├── critiques/                 # cross-seat critiques (ROUND > 1)
│   │   └── round-002-critique.md
│   └── council-report.md          # FINAL synthesized plan, the chosen output
```

### 4.2 File shapes (canonical)

**`ai-council-config.json`**
```jsonc
{
  "topic": "<one-line statement of what the council deliberates>",
  "spec_folder": "<canonical packet path>",
  "max_rounds": 3,
  "current_round": 2,
  "seats": [
    { "id": "seat-001", "executor": "cli-codex", "model": "gpt-5.5", "lens": "analytical-decomposition" },
    { "id": "seat-002", "executor": "cli-copilot", "model": "gpt-5.5", "lens": "implementation-pragmatism" },
    { "id": "seat-003", "executor": "cli-gemini", "model": "gemini-3.1-pro-preview", "lens": "external-research" }
  ],
  "convergence_signal": "two-of-three-agree",
  "started_at": "<ISO-8601>",
  "rounds_completed": 1,
  "final_report_at": null
}
```

**`ai-council-strategy.md`** (charter)
- Council goal in 2-3 sentences
- Diversity requirement (per existing agent guidance)
- Stop conditions (rounds, convergence signal, manual halt)
- Output expectations (council-report.md structure)

**`ai-council-state.jsonl`** (one event per line)
```jsonl
{"event":"round_start","round":1,"timestamp":"<ISO>","seats":["seat-001","seat-002","seat-003"]}
{"event":"seat_returned","round":1,"seat":"seat-001","timestamp":"<ISO>","status":"ok","tokens":<n>}
{"event":"deliberation_synthesized","round":1,"timestamp":"<ISO>","convergence_score":0.65}
{"event":"round_end","round":1,"timestamp":"<ISO>","new_findings_count":<n>}
```

**`seats/round-NNN/seat-NNN-<executor>.md`**
- Seat plan output (verbatim from CLI dispatch)
- Lens label in frontmatter
- Token / latency stats

**`deliberations/round-NNN.md`**
- Cross-seat synthesis: what each seat agreed on, where they diverged, how the agent reconciled
- Voting / weighting if applied
- Open questions surfaced

**`critiques/round-NNN-critique.md`** (rounds > 1)
- Each seat critiques the prior round's deliberation
- Used to detect false convergence

**`council-report.md`** (FINAL)
- Headline plan
- Council composition table (seat, executor, lens)
- Comparison table (where seats agreed/disagreed)
- Implementation roadmap
- Confidence score
- Recommended next step (likely an implementation packet)

### 4.3 Where the logic lives (LIGHTWEIGHT principle)

- **`.opencode/agent/multi-ai-council.md`** — primary home. The agent body documents folder layout, file shapes, invocation contract, and state-update rules.
- **`.opencode/skill/system-spec-kit/references/multi-ai-council/` (NEW, optional)** — shared references the agent reads:
  - `folder-layout.md` (this section reduced to one page)
  - `seat-diversity-patterns.md` (which lens combinations work well)
  - `convergence-signals.md` (how to detect convergence)
  - `state-format.md` (jsonl schema)
- **`.opencode/skill/system-spec-kit/scripts/spec/validate.sh`** — recognizes `ai-council/` as a known optional subfolder; does NOT require any specific files inside it (free-form within the folder).
- **No new skill folder** (e.g., do NOT create `.opencode/skill/multi-ai-council/`). The agent + references suffice.

### 4.4 Invocation contract update

The agent receives a `spec_folder` arg (existing pattern). On dispatch:

1. **First call** (no `ai-council/` folder yet):
   - Create `ai-council/` skeleton (config, strategy, state.jsonl, empty seats/ + deliberations/)
   - Run round 1: dispatch seats, write `seats/round-001/seat-NNN-*.md`
   - Synthesize `deliberations/round-001.md`
   - If convergence signal met, write `council-report.md`. Otherwise increment `current_round` and continue.

2. **Subsequent calls** (`ai-council/` exists):
   - Read `ai-council-config.json` and `ai-council-state.jsonl`
   - Determine next round number
   - Run new seats with the prior deliberation as input
   - Append new state events
   - Synthesize new deliberation; check convergence

3. **Resume** (e.g., after interruption):
   - Read state log; determine last completed event
   - Resume from the next incomplete event

### 4.5 Iteration support (lightweight)

Mirrors deep-research's resume pattern but with simpler state:

- One config per packet (mutated, not replaced)
- One state log (append-only)
- Per-round folders for seat outputs (rounds isolated, not commingled)
- Convergence detection: simple agreement signal (e.g., 2/3 seats endorse the same plan AND no new critique surfaces in the next round)
- No dashboard, no delta jsonl per round, no separate research-style fixtures
<!-- /ANCHOR:proposed-design -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

| ID | Criterion | Verification |
|---|---|---|
| **SC-1** | An invocation of `@multi-ai-council` on packet X writes all output to `specs/.../X/ai-council/`, never to `scratch/` or chat-only. | Inspect packet after dispatch. |
| **SC-2** | A second invocation on the same packet appends round-002 without overwriting round-001. | Two-round dispatch test. |
| **SC-3** | After convergence, `council-report.md` exists with the canonical structure (composition, comparison, roadmap, confidence). | Open council-report.md. |
| **SC-4** | The agent body documents the folder layout + invocation contract in plain language. | Read agent file. |
| **SC-5** | `validate.sh --strict` accepts the new subfolder under any spec packet without false negatives. | Validator regression test. |
| **SC-6** | No dedicated skill folder is created (only agent + system-spec-kit references). | Filesystem inventory. |
| **SC-7** | Iteration support proven: resume from partial state log produces a coherent next round. | Simulated interruption test. |
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:scope -->
## 6. SCOPE BOUNDARIES

### In Scope
- Folder convention design
- File shape canonical specs
- Agent body update (`.opencode/agent/multi-ai-council.md`)
- Optional shared references under `system-spec-kit/references/multi-ai-council/`
- Validator awareness (treat ai-council/ as known optional subfolder)
- Plan + tasks + checklist + ADRs for implementation

### Out of Scope (explicit)
- Building a `multi-ai-council` skill folder
- Adding a `/spec_kit:council` slash command
- Implementing convergence math more sophisticated than 2/3 agreement
- Auto-dispatch policies (council remains user-invoked)
- Cross-packet council aggregation
- Replacing or deprecating `scratch/` usage for ad-hoc council notes
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:risks -->
## 7. RISKS AND MITIGATIONS

| Risk | Severity | Mitigation |
|---|---|---|
| Agent body bloat as council logic grows | M | Keep file <600 LOC; spill detail to system-spec-kit references when crossed. |
| Validator false positives on legacy packets without ai-council/ | L | Subfolder is OPTIONAL; validator does not require it. |
| Council writes to `ai-council/` collide with deep-research/review writes | L | Subfolder is namespaced; no overlap. |
| Per-round folders clutter packets that only run council once | L | Single-round dispatch produces only `round-001/` + `council-report.md`; minimal footprint. |
| State.jsonl format drift across runs | M | Document schema in references; validate at agent dispatch time. |
| Iteration support tempts feature creep toward a deep-skill clone | H | Explicit non-goal N1; ADR documents the lightweight bound. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:dependencies -->
## 8. DEPENDENCIES

- `.opencode/agent/multi-ai-council.md` — agent body (will be updated)
- `.opencode/skill/system-spec-kit/scripts/spec/validate.sh` — validator (will recognize new subfolder)
- `.opencode/skill/system-spec-kit/references/` — shared reference home (new subfolder)
- Existing CLI skills (`cli-codex`, `cli-copilot`, `cli-gemini`, `cli-claude-code`, `cli-opencode`) — used by council seats
- Existing patterns from `deep-research/` and `deep-review/` (for layout inspiration only; no code reuse)
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:open-questions -->
## 9. OPEN QUESTIONS

1. Should `ai-council/` validation be added to `validate.sh --strict`, or kept fully free-form (like `scratch/`)? Current preference: free-form, but document expected layout.
2. Where do shared references live: `system-spec-kit/references/multi-ai-council/` or a more general location? Current preference: under system-spec-kit.
3. Should `ai-council-state.jsonl` schema be enforced by a tiny validator (Python or TS), or by convention only? Current preference: convention only for v1; enforce later if drift becomes a problem.
4. Should the agent emit a memory save on council completion (like deep-skills do)? Current preference: yes, with a templated continuity payload, but design that in plan.md not spec.md.
<!-- /ANCHOR:open-questions -->

---

<!-- ANCHOR:references -->
## 10. REFERENCES

- `.opencode/agent/multi-ai-council.md` — current agent definition
- `.opencode/skill/deep-research/SKILL.md` — reference layout for `research/`
- `.opencode/skill/deep-review/SKILL.md` — reference layout for `review/`
- `.opencode/skill/system-spec-kit/SKILL.md` — packet validation, folder conventions
- This packet's `plan.md` — implementation sequence
- This packet's `decision-record.md` — design choices + alternatives
<!-- /ANCHOR:references -->
