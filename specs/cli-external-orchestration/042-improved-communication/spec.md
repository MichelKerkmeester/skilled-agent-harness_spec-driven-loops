---
title: "Portable CLI communication projection"
description: "Phase parent for a provider-neutral communication rewrite layer that preserves canonical CLI output while presenting claudish-to-english quality prose."
trigger_phrases:
  - "portable CLI communication"
  - "claudish to english across CLIs"
  - "improved communication"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/042-improved-communication"
    last_updated_at: "2026-08-11T06:40:41Z"
    last_updated_by: "codex"
    recent_action: "Defined the phased epic and opened its research-strategy child."
    next_safe_action: "Run phase 001 deep research."
    blockers:
      - "The requested deep-research executors require an isolated worktree under the cli-opencode safety contract."
    key_files:
      - "spec.md"
      - "001-research-strategy/spec.md"
      - "001-research-strategy/plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "042-improved-communication-20260811"
      parent_session_id: null
    completion_pct: 20
    open_questions:
      - "Which temporary isolated worktree should host the forced-depth external research runs?"
    answered_questions:
      - "The epic is phased and phase 001 owns the research strategy."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Portable CLI communication projection

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | Phase parent |
| **Priority** | P0 |
| **Status** | In Progress |
| **Created** | 2026-08-11 |
| **Branch** | `main` |
| **Parent Spec** | None |
| **Parent Packet** | `cli-external-orchestration/042-improved-communication` |
| **Predecessor** | None |
| **Successor** | Determined by phase 001 research |
| **Handoff Criteria** | Phase 001 supplies a sourced runtime matrix, provider architecture, fidelity contract, forced-depth findings, and a recommended child-phase sequence |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The reference implementation makes Claude Code output easier to read, but its design is bound to Claude-specific hooks, local Ollama, disk-buffered shell processes, and prompt-only fidelity. It does not offer one safe presentation contract across Claude CLI, Codex CLI, Pi CLI, OpenCode CLI, Devin CLI, and Cursor CLI, nor does it support arbitrary hosted providers and local models behind the same policy boundary.

### Purpose

Deliver a portable projection layer that makes supported CLI communication feel indistinguishable from the reference's best plain-English output while leaving canonical events, transcripts, model context, and tool behavior unchanged. Hosted and local inference remain interchangeable only through explicit provider, privacy, capability, and fallback policy.

The root invariant is:

```text
canonical event stream/transcript ──> unchanged persistence and model context
                              └─────> validated display projection
```

Detailed research, architecture, implementation, and verification belong to child phases. This parent records only the epic contract and phase map.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Presentation-safe adapters for Claude CLI, Codex CLI, Pi CLI, OpenCode CLI, Devin CLI, and Cursor CLI.
- A provider-neutral rewrite core supporting OpenCode Go with DeepSeek V4 Flash, other hosted providers, Ollama, llama.cpp, and compatible local endpoints.
- Whole-message assembly, protected-span preservation, semantic/factual validation, atomic render decisions, and original-output fallback.
- Explicit privacy, cost, capability, latency, and fallback policies per provider and model.
- A conformance corpus and human evaluation that test whether communication feels 1:1 with the reference rather than merely sounding simpler.

### Out of Scope

- Rewriting canonical transcripts or model-visible context as a default behavior.
- Silently sending locally classified content to a hosted fallback.
- Treating a shared wire protocol as proof of model capability, privacy, retention, or semantic fidelity.
- Detailed child-phase plans in this parent document.

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `001-research-strategy/` | Create | 001 | Reverse engineering, current-source research, architecture framing, evaluation design, and downstream phase recommendation |
| Future child folders | Create after phase 001 | Later | Normalized contracts, provider/fidelity core, runtime adapters, conformance, and release work as justified by research |
| `context/claudish-to-english-main/` | Read only | All | Reference behavior and evidence; never modified by this epic |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | `001-research-strategy/` | Establish the evidence base, portable architecture, provider policy, fidelity evaluation, and recommended implementation sequence | In Progress |

### Candidate downstream workstreams

Phase 001 must decide the final boundaries and order. Current candidates are:

1. Normalized event, assembly, and runtime capability contracts.
2. Provider discovery, privacy policy, prompt, protected-span, and fidelity-validation core.
3. Runtime adapters grouped by native renderer, server/App Server, ACP, and headless-stream integration families.
4. Cross-runtime conformance, latency/cost/privacy evaluation, packaging, and release gates.

These are not phase folders until phase 001 confirms their scope and the folders are explicitly scaffolded.

### Phase Transition Rules

- Each phase must pass `validate.sh` independently before its handoff.
- A runtime adapter may not mutate canonical content to simulate a display-only integration.
- Unknown capabilities remain `unknown`; they are not silently promoted to supported.
- Human-adjudicated semantic regressions block release even when automated style metrics improve.
- Run recursive strict validation on this parent after every child-phase status change.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001 research strategy | First implementation child | Six-runtime matrix, provider matrix, reference inventory, 7+3 deep-research evidence, fidelity rubric, and phase recommendation are complete | Phase checklist and strict recursive validation |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Should runtimes without an atomic display replacement default to append, sidecar, or a custom-client-only mode?
- Which model and prompt version becomes the reference baseline after blind comparison against the original plugin?
- Which downstream workstreams meet independent phase thresholds after research closes?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Active child**: `001-research-strategy/spec.md`
- **Reference implementation**: `context/claudish-to-english-main/`
- **Graph metadata**: `graph-metadata.json`
