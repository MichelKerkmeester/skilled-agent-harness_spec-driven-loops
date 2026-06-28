---
title: "Implementation Summary: Open Design inner-generator payload binding"
description: "Post-build record for the new mcp-open-design/references/inner_generator_binding.md: the four payload-digest mappings, the both-turn recompute-and-reject, the §4-by-citation canonicalization reuse, the pinned-model and blanket-default denials, and the named closed-daemon residual. One new doc, scope clean."
trigger_phrases:
  - "inner generator payload binding implementation summary"
  - "open design inner payload binding record"
  - "build-fire payload digest binding summary"
importance_tier: "normal"
contextType: "general"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/004-d4-open-design-pairing/006-inner-generator-payload-binding"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Record the inner-payload binding contract and the named daemon residual"
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
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-inner-generator-payload-binding |
| **Completed** | 2026-06-28 |
| **Level** | 2 |
| **Deliverable** | `.opencode/skills/mcp-open-design/references/inner_generator_binding.md` (124 lines, 1 new doc) |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

The guarded proxy already binds the first outgoing Open Design request to a `DESIGN_PROOF_TOKEN`, but Open Design generation is multi-turn: turn 1 commonly returns a discovery question-form and writes zero files, and a second payload — the form answers or a follow-up message — is what fires the build that writes the design. This phase closes that gap with one new contract doc that binds the inner generator's effective input payload, across both turns, back to the token. A drifted inner generation, a blanket-default run, or a wrong inner model is now denied at the adapter boundary instead of laundering past a valid turn-1 token.

This is a prose contract, not code. The enforceable spine — the proof token and the guarded proxy / Codex gate — already exists; this binds the inner-generation payload as a recomputable consumer of that spine. It edits no live skill, gate, hook, or CLI file.

### The binding contract and the four digest mappings

`inner_generator_binding.md` defines `INNER_GENERATOR_BINDING v1`. It reconstructs the complete inner payload as structured metadata and maps each component to exactly one existing token digest: subject → `subjectDigest`, brief (`--message`) → `briefDigest`, form answers / follow-up message → `formAnswersDigest`, and Open Design lineage → `openDesignLineageDigest`. The inner agent and model are pinned by declared equality against the authorization metadata — an equality check, not a new digest and not a new token field.

### Both-turn recompute and reject

The adapter recomputes all four digests from the actual inner payload for both the turn-1 request and the build-fire turn, and compares them against the SAME token that authorized the run. The build-fire turn (`od ui respond --value | --value-json | --skip` or `od run start --conversation`) must recompute to `formAnswersDigest` and leave `subjectDigest`, `briefDigest`, and `openDesignLineageDigest` unchanged. The boundary returns DENY on any recomputed-digest drift, on a build-fire turn that cannot be rebound to the same token, on a blanket `--skip` / "recommended defaults" that materializes no recomputable answers, on a wrong inner model, and on absent, prose-only, ambiguous, or validator-failing input. ALLOW fires only when both turns reconstruct, every digest matches, and the model matches.

### Canonicalization reuse by citation

Canonicalization is inherited from `DESIGN_PROOF_TOKEN` §4 by reference — the subject-string rule for `subjectDigest` and the canonical-JSON rule (with each digest's empty/no-data value) for the brief, form-answer, and lineage digests. The doc intentionally defines no second hashing rule; it contains zero `sha256` / `hashlib` mentions, so there is one canonicalization authority, not two that can drift apart.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/mcp-open-design/references/inner_generator_binding.md` | Created | The binding contract: the four payload-digest mappings, the both-turn recompute-and-reject, the §4-by-citation canonicalization reuse, the model pin, the blanket-default denial, and the named daemon residual |

No live skill, gate, hook, CLI, or `.codex` file was edited. The proof-token and guarded-proxy contracts are referenced as dependencies, not restated.

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementer (`cli-codex gpt-5.5 high fast`) authored a single new reference and nothing else, keeping scope clean. The orchestrator then verified the result independently against the actual file: the change set is only the new doc; the body carries 11 payload-digest references and 18 multi-turn / both-turns references; the recompute rule cites proof-token §4 and adds no second hashing rule (0 `sha256` / `hashlib` mentions); the NAMED RESIDUAL section is present; and an evergreen scan over the body found no spec, packet, or phase identifiers and no `specs/` paths. The doc was walked through the documented rule for a positive case (ALLOW) and for drift, blanket-default, and wrong-model cases (DENY). This documentation records and re-verifies that work; it writes only the phase-folder docs and touches no live file beyond the named new reference.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Ship a prose binding contract, not code | The enforceable spine (proof token + guarded proxy / Codex gate) already exists; this phase binds the inner payload as a recomputable consumer of it rather than re-implementing enforcement |
| Map each inner-payload component to exactly one existing token digest | Reusing the proof-token digest schema keeps a single source of truth and avoids inventing a parallel binding surface |
| Reuse §4 canonicalization by citation, author no second hashing rule | Two digest algorithms would drift apart; one canonicalization authority keeps the recompute and the mint identical |
| Re-bind the build-fire turn to the same token | The second turn is what writes files; binding only turn 1 would let a drifted build launder past a valid token |
| Pin the inner model by declared equality, not a new digest | Equality against the authorized model closes the wrong-model path without extending the token schema |
| Name the closed-daemon residual instead of implying it away | The daemon spawns the inner agent in-app; honest scope states the adapter cannot reach inside that process or a daemon-side bypass |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Doc created at the exact target path | PASS, `.opencode/skills/mcp-open-design/references/inner_generator_binding.md` (124 lines) |
| Each inner-payload component maps to one token digest | PASS, subject/brief/form-answers/lineage → subjectDigest/briefDigest/formAnswersDigest/openDesignLineageDigest |
| Both turns bound to the same token | PASS, RECOMPUTE & REJECT re-binds the build-fire turn; 18 multi-turn / both-turns references |
| §4 canonicalization reused by citation | PASS, cites `DESIGN_PROOF_TOKEN` §4; 0 `sha256` / `hashlib` mentions, no second hashing rule |
| Payload-digest references present | PASS, 11 payload-digest references in the body |
| ACCEPTANCE positive walk | PASS, reconstructable both turns + matching digests + matching model → ALLOW |
| ACCEPTANCE drift walk | PASS, any recomputed-digest mismatch → DENY |
| ACCEPTANCE blanket-default walk | PASS, `--skip`/defaults without recomputable answers → DENY |
| ACCEPTANCE wrong-model walk | PASS, inner model != authorized pinned model → DENY |
| NAMED RESIDUAL present | PASS, closed inner-agent process + daemon-side HTTP / Skills-UI bypass both named |
| Evergreen: no spec/packet/phase IDs or `specs/` paths | PASS, body scan clean |
| Scope: only the new doc written; no live file touched | PASS, change set limited to the one new reference |
| GENERATED_METADATA residual (description.json / graph-metadata.json) | EXPECTED, orchestrator regenerates; not hand-written |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Prose contract, not code.** This phase ships a binding contract reference; it does not itself execute the recompute. The enforceable spine (proof token + guarded proxy / Codex gate) already exists and is the mechanism that enforces it.
2. **Closed-daemon residual is named, not closed.** The bundled daemon spawns the inner agent inside the closed app, so the adapter cannot observe the inner agent's private reasoning or daemon-internal payload mutation. The bind holds AT the adapter across both turns only.
3. **Daemon-side bypass persists.** A raw HTTP-port call or in-app Skills-UI message that reaches the daemon around the adapter is not forced through this binding. This residual is named in the contract.
4. **Taste is not certified.** This binds the authorized payload to the inner generation; it does not certify the design quality of what the inner generator produces.

<!-- /ANCHOR:limitations -->

---

<!--
LEVEL 2 IMPLEMENTATION SUMMARY
- Core + Level 2 verification focus
- Prose binding contract: inner-generator payload bound to DESIGN_PROOF_TOKEN digests across both turns
- One new doc; scope clean; closed-daemon residual named; GENERATED_METADATA regenerated by the orchestrator
-->
