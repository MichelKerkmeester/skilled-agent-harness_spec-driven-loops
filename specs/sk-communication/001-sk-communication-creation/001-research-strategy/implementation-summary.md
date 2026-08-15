---
title: "Research Phase Summary: Portable CLI communication projection"
description: "Completed research record covering reference analysis, native primary-source research, forced-depth synthesis, and the provider-neutral architecture handoff."
trigger_phrases:
  - "portable CLI research summary"
  - "improved communication current state"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "sk-communication/001-sk-communication-creation/001-research-strategy"
    last_updated_at: "2026-08-11T13:45:02Z"
    last_updated_by: "codex"
    recent_action: "Completed validated 7+3 research synthesis."
    next_safe_action: "Scaffold Phase 002 contracts and fixtures from research/research.md."
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "001-research-strategy-summary-20260811"
      parent_session_id: "001-research-strategy-20260811"
    completion_pct: 100
    open_questions:
      - "Version-pinned runtime fixture fields and atomic replacement capabilities"
    answered_questions:
      - "A projection layer over unchanged canonical events is the portable safety boundary."
      - "DeepSeek completed 7 iterations and GPT SOL Fast high completed 3 under max-iterations."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Research Phase Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-research-strategy |
| **Status** | Complete |
| **Last Updated** | 2026-08-11 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

### Current state

The phase now has a concrete research contract and canonical synthesis instead of a broad portability goal. It explains why the reference feels natural, where its safety claims break down, which presentation surfaces are documented across six CLIs, how hosted and local providers fit behind model-specific adapters, and what must be measured before implementation. The requested full-depth run completed without early convergence: DeepSeek produced 7/7 iterations and GPT SOL Fast high produced 3/3.

### Reference and runtime evidence

The local reference was traced from hook registration through streamed-chunk assembly, user-question context, copy-editing prompt, Ollama request, append/replace rendering, Markdown mutation, cleanup, and fallback. Its strongest idea is display-only transformation over an unchanged transcript. Its main portability and safety gaps are prompt-only fidelity, raw identifiers in temporary paths, no locking or completeness checks, and replace-mode suppression before a validated final response exists.

Current official documentation confirms a mixed adapter landscape. Claude has a native presentation-only `MessageDisplay` hook. Pi documents tool renderer overrides. Codex App Server, OpenCode server/SSE, and ACP for Devin and Cursor offer safer custom-client boundaries for arbitrary communication presentation. Hooks that mutate inputs, results, or context are excluded from the display projection.

### Provider and fidelity direction

OpenCode Go exposes DeepSeek V4 Flash through OpenAI-compatible Chat Completions, but OpenCode Go itself uses more than one wire protocol across models. The plan therefore uses per-model protocol adapters rather than equating one provider with one protocol. Ollama-native discovery remains preferable for local capability and timing data, while llama.cpp and generic compatibility endpoints require explicit probes.

The proposed fidelity path protects literals before inference, validates meaning and completion after inference, and renders the original on any failure. Blind human evaluation measures meaning, target plainness, fluency, and reference likeness separately. Automatic metrics are regression signals only.

### Deep-research synthesis

The named `/deep:research:auto` workflow ran in the authorized isolated worktree with literal banned-operation and allowed-write-path boundaries. Both lineages stopped with `maxIterationsReached`; all ten canonical iteration validators passed. The merge retained 97 attributed findings from 10 deltas with no skipped registry and no corruption. Eight DeepSeek state timestamps fell after the observed subprocess window and one record lacked a timestamp, so those timestamps are disclosed but not accepted as chronological evidence.

The selected architecture is an immutable canonical event mirror plus a separate display projection. Claude can use `MessageDisplay`; Codex, OpenCode, Devin, and Cursor use client-owned presentation; Pi uses custom rendering or JSON/RPC. Model-specific providers support OpenCode Go DeepSeek V4 Flash, arbitrary compatible hosted routes, Ollama, and llama.cpp behind privacy-first eligibility and explicit fallback policy.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `../spec.md` | Authored | Define the phased epic, invariant, scope, current child, and candidate downstream workstreams |
| `spec.md` | Authored | Freeze the phase requirements, risks, non-functional constraints, edge cases, and acceptance criteria |
| `plan.md` | Authored | Define the best combined research method, architecture under study, source matrices, executor config, evaluation, and rollback |
| `tasks.md` | Authored | Track completed local/native research and blocked deep-loop/synthesis work |
| `checklist.md` | Authored | Tie completion to objective Level 2 evidence |
| `implementation-summary.md` | Authored | Preserve honest current state and the next safe action |
| `research/` | Generated and validated | Preserve configurations, state, iterations, deltas, logs, registries, resource map, and canonical synthesis |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The phase used three independent evidence lanes. One native agent inspected every local reference file. A second researched official runtime integration surfaces. A third researched hosted/local provider protocols, preservation strategy, fallback, privacy, cost, latency, and evaluation. The primary agent then reopened the load-bearing official pages and reran the local syntax and metadata checks before incorporating those findings.

The named `system-deep-loop` workflow ran without a manual substitute or reduced iteration count. The external executor used `.worktrees/0138-system-deep-loop-communication-research` on local branch `system-deep-loop/0138-communication-research`; startup auto-update residue was contained and restored before the retry. Copy-back included only the validated phase research directory and the bounded generated findings fence, reconciled into the concurrently renumbered `035-improved-communication` packet. The reference and unrelated primary-checkout changes remained untouched.

Raw lineage configs, logs, and orchestration state retain the original `042-improved-communication` path because those files are immutable execution evidence. The canonical packet now lives at `035-improved-communication`. Consumers must resolve canonical links from this packet and treat `042` only as provenance; rewriting the raw lineage would weaken reproducibility.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Preserve canonical events and rewrite only a display projection | This retains transcripts, model context, tools, and recovery while still improving readability. |
| Prefer custom clients when hooks cannot atomically replace presentation | Semantic hook mutation is not an acceptable substitute for a renderer. |
| Use whole-message rewrite and atomic commit | Later text can qualify earlier claims, and partial unvalidated replacement cannot fail open. |
| Keep provider records model and protocol specific | OpenCode Go itself maps models to different endpoint families, so provider name alone cannot determine request semantics. |
| Treat capabilities as `yes`, `no`, or `unknown` | Missing discovery metadata must not become accidental support. |
| Protect literals before inference and validate after | Prompt instructions alone cannot prove that facts, paths, code, or requirement strength survived. |
| Never cascade local content to hosted fallback by default | Wire compatibility does not grant privacy or retention consent. |
| Route the GPT lane through OpenCode | The current host is Codex, and the Codex CLI skill prohibits self-invocation. OpenCode exposes the requested SOL Fast high route without that conflict. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Baseline recursive strict validation before authored docs | FAIL as expected, exit 2 for incomplete scaffold/metadata; used as negative baseline |
| Reference `bash -n`, hook `jq empty`, and executable bits | PASS, exit 0 |
| ShellCheck at default severity | Advisory result, exit 1 for informational `SC2012` at read-only `rewrite.sh:145` |
| ShellCheck with warning threshold | PASS, exit 0; no warning-or-higher findings |
| Official-source verification | PASS for load-bearing Claude, Codex, Pi, OpenCode, Devin, Cursor, OpenCode Go, Ollama, and llama.cpp surfaces; inferences remain labeled in `plan.md` |
| DeepSeek 7-iteration lineage | PASS: 7/7 narratives, state records, deltas, and canonical verifier results; `maxIterationsReached` |
| GPT SOL Fast high 3-iteration lineage | PASS: 3/3 narratives, state records, deltas, and canonical verifier results; `maxIterationsReached` |
| Root fanout merge | PASS: 2/2 lineages, 97 attributed findings, 10 delta sources, zero corruption |
| Write containment and copy-back | PASS: isolated status contained only phase `spec.md` and `research/**`; copied research tree matched byte-for-byte before path-facing reconciliation |
| DeepSeek timestamp integrity | QUALIFIED: content/count validation passed, but 8 anomalous and 1 untimestamped state records are not chronology evidence |
| Final metadata and strict validation | PASS: child strict and parent recursive strict validation exit 0 with 0 errors and 0 warnings |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The capability matrices are a dated research snapshot.** Runtime events, beta surfaces, model routes, pricing, and privacy terms must be rechecked before implementation and release.
2. **No production code exists.** The architecture is an evidence-backed research target, not a working cross-CLI rewrite layer.
3. **The 1:1 feel is not yet benchmarked.** The corpus and rubric are specified, but no provider/model/prompt has passed blind human comparison against the reference.
4. **Markdown rewriting is unresolved.** It mutates durable files and should likely become a separate opt-in product surface rather than part of the display projection.
5. **DeepSeek chronology is untrusted.** Its content and forced iteration count validated, but the anomalous state timestamps cannot support timing claims.
<!-- /ANCHOR:limitations -->
