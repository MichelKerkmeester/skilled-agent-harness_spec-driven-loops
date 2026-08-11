---
title: "Research strategy for portable CLI communication projection"
description: "Evidence plan for reproducing the claudish-to-english communication feel safely across six CLIs and hosted or local providers."
trigger_phrases:
  - "portable communication research"
  - "claudish reverse engineering"
  - "six CLI rewrite layer"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/042-improved-communication/001-research-strategy"
    last_updated_at: "2026-08-11T06:40:41Z"
    last_updated_by: "codex"
    recent_action: "Completed local reverse engineering and two native web-research lanes."
    next_safe_action: "Run the two forced-depth deep-research lineages in an authorized isolated executor worktree."
    blockers:
      - "The cli-opencode deep-loop executor uses a dangerous permission bypass and therefore requires an isolated worktree; the current branch is dirty and was the user's selected workspace."
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "001-research-strategy-20260811"
      parent_session_id: null
    completion_pct: 55
    open_questions:
      - "May the deep-research workflow use a temporary isolated executor worktree?"
    answered_questions:
      - "Use OpenCode Go DeepSeek V4 Flash for seven iterations and OpenAI GPT-5.6 SOL Fast high for three iterations."
      - "Use max-iterations stop policy so neither lineage converges early."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Research strategy for portable CLI communication projection

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | In Progress |
| **Created** | 2026-08-11 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 1 of 1 currently scaffolded |
| **Predecessor** | None |
| **Successor** | Determined by this phase |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The reference proves that whole-message rewriting, user-question context, a narrow copy-editing prompt, low sampling, and fail-open display can make assistant output noticeably easier to read. It also assumes Claude's `MessageDisplay`, one Ollama protocol, serialized chunk delivery, filesystem-safe identifiers, and prompt obedience without a deterministic fidelity validator. Those assumptions do not hold across six evolving CLIs or across arbitrary hosted and local providers.

The target is not generic summarization. The presentation must retain every fact, name, number, path, URL, code block, caveat, requirement level, and next step while achieving the same direct, natural feel as the reference.

### Purpose

Produce an evidence-backed architecture and execution plan before implementation. The phase must identify the safest presentation surface in each CLI, define provider and privacy boundaries, specify measurable 1:1 fidelity, and convert uncertainty into bounded downstream phases.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Reverse-engineer `../context/claudish-to-english-main/` with file-and-line evidence.
- Research current official integration surfaces for Claude CLI, Codex CLI, Pi CLI, OpenCode CLI, Devin CLI, and Cursor CLI.
- Compare OpenCode Go with DeepSeek V4 Flash, generic hosted OpenAI/Anthropic-compatible services, Ollama, llama.cpp, and model-specific protocol adapters.
- Define a display-only architecture built around runtime adapters, whole-message assembly, context selection, providers, protected spans, fidelity validation, and atomic render decisions.
- Combine two native web-research subagent lanes with two independent `system-deep-loop` research lineages.
- Force seven DeepSeek V4 Flash iterations and three GPT-5.6 SOL Fast high-reasoning iterations without early convergence.
- Define the corpus, deterministic gates, human rubric, operational metrics, and downstream phase recommendation needed for implementation.

### Out of Scope

- Production implementation or packaging in this phase.
- Changes to the reference repository under `../context/`.
- Rewriting canonical transcripts, model-visible messages, tool inputs, or tool results.
- Publishing, deployment, provider purchases, or remote content egress outside the explicitly requested research executors.
- Default local-to-hosted fallback; protocol compatibility does not grant privacy consent.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `../spec.md` | Modify | Root purpose and phase map |
| `spec.md` | Create | Research requirements and acceptance contract |
| `plan.md` | Create | Best combined research workflow and target architecture |
| `tasks.md` | Create | Execution and evidence tracking |
| `checklist.md` | Create | Level 2 verification with objective evidence |
| `implementation-summary.md` | Create | Honest current-state and handoff record |
| `description.json` | Generate | Search metadata |
| `graph-metadata.json` | Generate | Graph and phase status metadata |
| `research/` | Workflow-generated | Deep-loop state, iterations, deltas, logs, and synthesis |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Inventory the reference behavior and failure modes. | Evidence covers hook registration, stream buffering, context extraction, prompt, provider call, display modes, Markdown mutation, cleanup, and failure paths with exact local file locations. |
| REQ-002 | Establish a current six-runtime capability matrix. | Each CLI has a primary-source-backed safest integration, event model, presentation constraint, required emulation, and `confirmed`, `inferred`, or `unsupported` status. |
| REQ-003 | Preserve the canonical contract. | The recommended design keeps event streams, transcripts, model context, tool inputs, and tool results unchanged; unsupported display interception falls back to append, sidecar, or a custom client. |
| REQ-004 | Define the portable component boundary. | Research specifies `RuntimeAdapter`, `MessageAssembler`, `ContextProvider`, `RewriteProvider`, `ProtectedSpanCodec`, `FidelityValidator`, and `RenderDecision` responsibilities without binding the core to one CLI or protocol. |
| REQ-005 | Define provider-neutral hosted and local inference. | The provider record covers protocol, base URL, model, credentials, auth headers, timeout, privacy class, cost metadata, capability overrides, discovery, streaming, and explicit fallback policy. |
| REQ-006 | Make fidelity objectively rejectable. | Validation rejects missing, duplicated, or changed protected spans; new facts; polarity or requirement-strength changes; empty/refused/truncated output; malformed Markdown; and changed fenced code. Rejection always selects the original text. |
| REQ-007 | Execute the specified deep research at full depth. | One `cli-opencode` lineage runs `opencode-go/deepseek-v4-flash` for exactly 7 iterations and one runs `openai/gpt-5.6-sol-fast` with high reasoning for exactly 3, both with live web access and `--stop-policy=max-iterations`. |
| REQ-008 | Keep deep-loop state canonical and auditable. | The named `/deep:research:auto` workflow owns `deep-research-state.jsonl`, iteration files, deltas, logs, validation, and final synthesis under this phase; no hand-rolled loop substitutes for it. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-009 | Triangulate native and deep research. | CLI and provider native-subagent findings are checked against primary sources and compared with both deep-loop lineages; conflicts and dated claims remain explicit. |
| REQ-010 | Define 1:1 communication evaluation. | A versioned corpus and blind rubric separately measure meaning preservation, reference-style/plainness, fluency, pairwise indistinguishability, latency, cost, and privacy class with at least three runs per model/prompt. |
| REQ-011 | Cover failure and concurrency boundaries. | Research addresses out-of-order, duplicate, missing-final, concurrent, oversized, short, empty, code-only, malformed-stream, timeout, auth, quota, refusal, truncation, and cancellation cases. |
| REQ-012 | Recommend executable downstream phases. | The final synthesis identifies scoped children, dependencies, handoff criteria, verification gates, and unresolved decisions without creating speculative implementation detail. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All six CLIs and all required provider families appear in sourced capability matrices with confirmed and inferred claims separated.
- **SC-002**: The architecture never requires semantic mutation merely to change presentation.
- **SC-003**: The evaluation contract can automatically reject any changed protected literal, code fence, URL, number, path, or completion failure and can route back to original output.
- **SC-004**: Deep-loop artifacts prove exactly 10 requested iterations split 7 and 3, with no convergence stop.
- **SC-005**: The final research synthesis names the next child phases and the evidence each must inherit.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Current official CLI and provider documentation | Surfaces, versions, pricing, and privacy terms can change | Date every matrix, prefer primary sources, pin tested versions, and re-probe before implementation |
| Dependency | OpenCode Go and configured provider access | Requested DeepSeek lineage cannot run if credentials, quota, or model access fail | Preflight model discovery and record the provider failure without substituting an unapproved model |
| Risk | Display hooks are mistaken for safe arbitrary renderers | Canonical or model-visible data could be changed | Prefer custom-client projection boundaries; use hooks only where documentation proves display-only behavior |
| Risk | Prompt-only preservation silently changes meaning | The output feels better but becomes wrong | Protect literals before inference, validate after inference, and fail to the original on any mismatch |
| Risk | Replace mode suppresses output before a validated rewrite exists | A timeout or process death can swallow the answer | Commit replacement atomically only after validation; otherwise append or display the original |
| Risk | Hosted fallback leaks content | Local-classified content crosses a privacy boundary | Require explicit privacy-class-compatible fallback; never auto-cascade local content to hosted services |
| Risk | Deep-loop executor permissions exceed current-worktree safety | Dirty user work could be modified | Run the executor only in an authorized temporary isolated worktree with allowed write paths |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which temporary isolated worktree is authorized for the deep-loop executor?
- Do users want append as the universal fallback, or should runtimes without atomic replacement require a custom client?
- Is Markdown-file rewriting a separate opt-in product surface rather than part of the display projection?
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: Measure p50/p95 provider time-to-first-token and full rewrite latency, plus local cold and warm latency; implementation targets are set from the measured baseline rather than invented in this phase.
- **NFR-P02**: Bound message bytes, accumulated chunks, provider output, timeout, retries, and temporary-state lifetime before implementation.

### Security and Privacy

- **NFR-S01**: Treat source messages, transcript context, provider output, and discovered content as untrusted data; content cannot override the copy-editing instruction or workflow boundaries.
- **NFR-S02**: Hash or encode external session/message identifiers, use private temporary directories and locks, and never interpolate raw IDs into deletion paths.
- **NFR-S03**: Provider configuration must expose retention/training/residency facts as dated metadata and require explicit consent before remote egress.

### Reliability

- **NFR-R01**: Where the runtime permits display projection, every rewrite failure yields the exact original presentation with at most one bounded notice per session.
- **NFR-R02**: Unknown stream events are tolerated, ordering/completion is reconciled explicitly, and no partial unvalidated replacement is displayed.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries

- Empty, short, code-only, or table-heavy content: bypass rewriting unless the evaluation proves value without structural loss.
- Oversized output: apply a declared size limit, cancel cleanly, and show the original rather than silently truncate.
- Instruction-like source content: delimit as data and verify that it does not redirect the rewriter.

### Error Scenarios

- Auth, quota, model-unavailable, network, timeout, refusal, malformed stream, empty result, or token limit: select the original and record a redacted reason.
- Missing, duplicated, reordered, or changed protected placeholder: reject the rewrite.
- Unsupported runtime interception: use append, sidecar, or a custom client; never alter canonical data to fake display replacement.

### State Transitions

- Out-of-order or duplicate chunks: assemble by stable event identity and sequence with idempotent writes.
- Missing final event or cancellation: expire private state and emit no replacement.
- Concurrent sessions/messages: isolate buffers, locks, notices, cancellation, and cleanup per stable hashed identity.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 22/25 | Six runtime families, multiple protocols, hosted/local providers, and evaluation design |
| Risk | 19/25 | Content fidelity, privacy egress, concurrency, and presentation-versus-semantic boundaries |
| Research | 17/20 | Current external surfaces plus ten forced-depth iterations and source triangulation |
| **Total** | **58/70** | **Level 2 for this research-only child; the aggregate work remains a phased epic** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:evidence -->
## 10. EVIDENCE SNAPSHOT

- The reference registers `MessageDisplay` and Markdown `PostToolUse` hooks with 60s and 180s limits in `../context/claudish-to-english-main/hooks/hooks.json:3` and `:14`.
- It buffers per-chunk deltas by session/message/index and reconstructs on the final event in `../context/claudish-to-english-main/rewrite.sh:89`, `:102`, `:106`, and `:117`.
- Its style prompt, truncated user-question context, non-thinking Ollama request, temperature 0.3, and response extraction live at `../context/claudish-to-english-main/rewrite.sh:149`, `:155`, `:162`, and `:168`.
- Replace mode suppresses intermediate chunks before a validated final rewrite at `../context/claudish-to-english-main/rewrite.sh:109`; this weakens the claimed fail-open guarantee if the process is killed before the final handler.
- Raw session/message IDs become directory names and a later recursive-deletion target at `../context/claudish-to-english-main/rewrite.sh:102` and `:126`; the portable design must not carry that path risk forward.
- The optional Markdown path mutates files after an opt-in directory check and uses a temporary rename at `../context/claudish-to-english-main/rewrite-md.sh:100` and `:200`; it is a separate semantic surface from display-only rewriting.
- Current-source runtime and provider links, confidence labels, and the exact research workflow are in `plan.md`.
<!-- /ANCHOR:evidence -->

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
