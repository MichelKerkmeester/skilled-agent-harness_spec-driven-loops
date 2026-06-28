---
title: "Implementation Plan: Open Design inner-generator payload binding"
description: "Plan to author a new mcp-open-design reference that binds the Open Design inner generator's input payload (subject/brief/form-answers/lineage) across the multi-turn run flow to the DESIGN_PROOF_TOKEN digests, with a boundary recompute-and-reject rule that reuses the proof-token canonicalization."
trigger_phrases:
  - "inner generator payload binding plan"
  - "open design inner generation binding"
  - "build-fire payload digest binding"
  - "inner generator drift denial"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/004-d4-open-design-pairing/006-inner-generator-payload-binding"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Mark all plan phases complete with evidence for the delivered binding contract"
    next_safe_action: "Let the parent refresh description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-open-design/references/inner_generator_binding.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Open Design inner-generator payload binding

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Deliverable** | One new doc: `.opencode/skills/mcp-open-design/references/inner_generator_binding.md` |
| **Doc type** | Shared skill reference — a binding contract (prose), the sibling of `guarded_proxy.md` and `cli_child_pairing.md` |
| **Depends on** | `DESIGN_PROOF_TOKEN` (digest fields + §4 canonicalization) and the guarded-proxy precondition (the recompute point) |
| **Format** | Markdown reference: a payload-to-digest mapping table, the multi-turn binding rule, and an explicit named residual |
| **Status** | Planned — authored when an implementer runs this brief; not yet implemented |

### Overview
When `start_run` is accepted and forwarded, Open Design's inner generator/agent (`claude` / `codex` / `gemini` / `opencode`) produces the actual design from a payload. The guarded proxy already binds the FIRST outgoing request, but generation is multi-turn: turn 1 returns a discovery question-form and ends `awaiting_input` with zero files, and a SECOND payload — the form answers (`od ui respond --value | --value-json | --skip`) or a follow-up `od run start --conversation` message — is what fires the build that writes files. Nothing binds that second turn or the inner agent's effective input back to the proof token, so the inner generation can drift from the authorized subject/brief/form-answers/lineage. This plan specifies a binding contract that maps each inner-payload component to a `DESIGN_PROOF_TOKEN` digest and requires the boundary to recompute every digest from the actual inner payload — across BOTH turns — and deny on mismatch. The recompute reuses the proof-token canonicalization; this phase authors no second hashing rule and extends no token field. This phase produces the contract reference only; the daemon residual is named, not closed.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Objective and deliverable path frozen (new `mcp-open-design/references/inner_generator_binding.md`)
- [x] Inner-payload components sourced from the multi-turn run flow (start_run → discovery form → build-fire turn)
- [x] Digest mapping sourced from the proof-token field schema (subject/brief/form-answers/lineage digests)
- [x] Canonicalization rule is reused from the proof-token contract §4, not re-authored
- [x] Evergreen constraint understood (skill content carries no spec/packet/phase IDs or spec paths)

### Definition of Done
- [x] Doc exists at the exact target path with required frontmatter and ordered sections
- [x] Each inner-payload component maps to exactly one token digest (subject/brief/form-answers/lineage)
- [x] The recompute-and-reject rule binds BOTH the initial request and the build-fire turn to the SAME token
- [x] The rule cites proof-token §4 for canonicalization and authors no second hashing rule
- [x] Blanket `--skip` / "recommended defaults" that cannot materialize recomputable answers is denied
- [x] The unmodifiable-daemon residual (inner-agent process + daemon-side bypass) is named, not implied away
- [x] Doc body carries no spec/packet/phase IDs or spec paths (durable WHY only)
- [x] `checklist.md` items verified with evidence

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
A single shared reference doc that defines a binding contract: it names the inner generator's complete input payload, maps each component to an existing proof-token digest, and requires the guarded-proxy boundary to recompute each digest from the actual inner payload and deny on mismatch. It references the proof-token contract (digest convention, §4 canonicalization) and the guarded-proxy precondition (the recompute point), and redefines neither.

### Target doc outline (the implementer authors these sections, in order)
1. **OVERVIEW** — `INNER_GENERATOR_BINDING` pins the Open Design inner generator's input payload to the authorized `DESIGN_PROOF_TOKEN` payload digests so a drifted inner generation is denied. It depends on the proof-token contract and the guarded-proxy precondition and redefines neither.
2. **THE INNER GENERATION BOUNDARY** — generation is multi-turn: turn 1 `start_run(prompt, [skill], [inputs], [agent], [model])` (or `od run start --message`) spawns the inner agent and returns a discovery question-form, ending `awaiting_input` with zero files; turn 2 — form answers (`od ui respond --value | --value-json | --skip`) or a follow-up `od run start --conversation` message — fires the build that writes the design files. The token authorizes turn 1's outgoing request; the build-fire turn and the inner agent's effective input are the unbound surface this contract closes.
3. **BOUND INNER PAYLOAD** — define the inner generator's complete input payload and map each component to one token digest: subject → `subjectDigest`; brief (`--message`) → `briefDigest`; form answers / follow-up message → `formAnswersDigest`; Open Design lineage → `openDesignLineageDigest`. The inner agent/model (`--agent` / `--model`) is pinned to the authorized value by declared equality (no new token digest). All carried as structured metadata, never prose.
4. **RECOMPUTE & REJECT** — recompute each component digest using the proof-token §4 canonicalization, cited by reference and NOT redefined here: the subject-string rule (NFC, outer-trim, internal-whitespace collapse) for `subjectDigest`; the canonical-JSON rule for `briefDigest` / `formAnswersDigest` / `openDesignLineageDigest`; each digest's §4 empty/no-data canonical value. Compare every recomputed digest to the token value and DENY on any mismatch. The build-fire turn re-binds the SAME token: the form-answer/follow-up payload MUST recompute to `formAnswersDigest` and leave `subjectDigest` / `briefDigest` / `openDesignLineageDigest` unchanged. A blanket `--skip` / "use recommended defaults" is denied unless it materializes concrete answers that recompute to `formAnswersDigest`. The pinned inner model must equal the authorized model. Fail-closed on absence, ambiguity, unreadable inputs, or validator exception.
5. **WHERE IT BINDS** — the guarded-proxy precondition is the recompute point. This contract extends the proxy's single-request payload binding to the multi-turn build-fire boundary, including the `od ui respond` answer and the follow-up `od run start --conversation` message that fires the build. It adds a boundary, not a new token.
6. **NAMED RESIDUAL** — the bundled daemon spawns the inner agent inside the closed app. Once an accepted request is forwarded, the agent-side boundary cannot observe the inner agent's private reasoning or any payload the daemon mutates internally; it binds the inner payload AT the adapter across both turns and cannot reach inside the daemon's inner-agent process. The daemon-side bypass also persists: a raw HTTP-port call or in-app Skills-UI message that reaches the daemon around the adapter is not forced through this binding. Both residuals are named, not implied away.
7. **ACCEPTANCE** — the recompute-and-reject rule is defined for both turns, §4 canonicalization is reused with no second hashing rule, the unmodifiable-daemon residual is named, and the body is evergreen.

### Data flow
1. The design skill authorizes a design decision and mints a `DESIGN_PROOF_TOKEN` carrying the subject/brief/form-answers/lineage digests.
2. The guarded proxy validates turn 1 (`start_run`) against the token and forwards it; the inner agent returns a discovery form.
3. The build-fire turn (form answers or follow-up message) arrives at the same boundary carrying the inner payload as structured metadata.
4. The boundary recomputes the four digests from the actual inner payload using proof-token §4, compares to the SAME token, pins the inner model, and denies on any mismatch — a drifted inner generation never fires.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm `mcp-open-design/references/` exists and the target filename is free — evidence: target free, doc created at `references/inner_generator_binding.md`
- [x] Scaffold `inner_generator_binding.md` with frontmatter, H1, and the seven section headers from the outline — evidence: frontmatter + H1 + 7 sections present (Boundary, Bound Inner Payload, Recompute And Reject, Where It Binds, Named Residual, Acceptance)

### Phase 2: Core Implementation
- [x] Author OVERVIEW and THE INNER GENERATION BOUNDARY (the multi-turn flow and the unbound second turn) — evidence: turn-1/build-fire table names the unbound second turn; 18 multi-turn references
- [x] Author BOUND INNER PAYLOAD: the component → digest mapping table plus the declared-equality model pin — evidence: subject/brief/form-answers/lineage → four digests; model pinned by declared equality
- [x] Author RECOMPUTE & REJECT: cite proof-token §4 for canonicalization, define the both-turn recompute, the `--skip`/defaults denial, and the model-pin check; author no second hashing rule — evidence: cites §4; 0 sha256/hashlib mentions; both-turn recompute + deny table
- [x] Author WHERE IT BINDS: extend the guarded-proxy precondition to the build-fire turn — evidence: Where It Binds applies the recompute point to turn-1 and build-fire turns
- [x] Author NAMED RESIDUAL (inner-agent process + daemon-side bypass) and ACCEPTANCE — evidence: Named Residual states both; Acceptance table covers positive + drift/defaults/wrong-model

### Phase 3: Verification
- [x] Walk an inner payload that recomputes to all four token digests → ALLOW; walk a drifted form-answer/follow-up payload → DENY — evidence: Acceptance positive walk → ALLOW; drift walk → DENY
- [x] Confirm the doc cites proof-token §4 and defines no second canonicalization rule — evidence: §4 cited; 0 sha256/hashlib mentions
- [x] Confirm both residuals (inner-agent process, daemon-side bypass) are named — evidence: Named Residual names the closed inner-agent process and the daemon-side HTTP / Skills-UI bypass
- [x] Grep the doc body for spec/packet/phase IDs and `specs/` paths; none present — evidence: evergreen scan over the body clean
- [x] Update `implementation-summary.md` and mark `checklist.md` with evidence — evidence: implementation-summary.md authored; checklist.md fully marked with evidence

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Method |
|-----------|-------|--------|
| Mapping completeness | Each inner-payload component maps to exactly one token digest | Manual table walk of subject/brief/form-answers/lineage |
| Canonicalization reuse | The recompute cites proof-token §4 and adds no second hashing rule | Read-through; grep for any re-stated digest algorithm |
| Both-turn binding | The build-fire turn re-binds the same token | Trace the form-answer/follow-up path against the recompute rule |
| Acceptance (positive) | A recomputable inner payload is ALLOWED | Apply the documented rule to a matching payload |
| Acceptance (negative) | A drifted inner payload, blanket `--skip`/defaults, or mismatched model is DENIED | Apply the rule to drift, defaults, and wrong-model cases |
| Residual honesty | Inner-agent process + daemon-side bypass are named | Confirm the NAMED RESIDUAL section states both |
| Evergreen | No spec/packet/phase IDs or spec paths in body | `rg` over the doc body for ID and `specs/` patterns |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `DESIGN_PROOF_TOKEN` digest fields + §4 canonicalization | Reference | Green | No digests to bind to; no canonical recompute rule to reuse |
| Guarded-proxy precondition (the recompute point) | Reference | Green | No boundary to extend the binding into |
| Multi-turn run flow (start_run → discovery form → build-fire turn) | Evidence | Green | The second-turn binding surface loses its source anchor |
| `mcp-open-design/references/` directory | Internal | Green | Target home for the new reference |
| Run/build gate and cross-child laundering guard | Downstream | Not built here | Consumers reference this binding later; out of scope |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The binding is wrong, ambiguous, or conflicts with the guarded-proxy precondition or the proof-token digest convention.
- **Procedure**: Delete the single new file `references/inner_generator_binding.md`, or `git revert` the authoring commit. No live target file is modified by this phase, so rollback has no blast radius beyond the new doc.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──> Phase 2 (Author) ──> Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Author |
| Author | Setup | Verify |
| Verify | Author | None |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup (skeleton) | Low | 15 minutes |
| Author (boundary + mapping + recompute rule + residual) | Medium | 1.5-2.5 hours |
| Verification (allow/deny walk + reuse check + evergreen scan) | Low | 30 minutes |
| **Total** | | **2.25-3.25 hours** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] New file path confirmed inside `mcp-open-design/references/` (no live target touched) — evidence: only `references/inner_generator_binding.md` created
- [x] No edits to any existing skill, gate, hook, or CLI file — evidence: change set is the single new doc; scope clean
- [x] Authoring commit isolated to the new reference doc — evidence: one new file plus phase-folder docs; no live file modified

### Rollback Procedure
1. **Immediate**: Delete `references/inner_generator_binding.md`
2. **Revert code**: `git revert HEAD` for the authoring commit if already committed
3. **Verify**: Confirm no consuming file imported the doc yet (this phase ships none)

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A, documentation-only artifact, no schema or data state created

<!-- /ANCHOR:enhanced-rollback -->

---
