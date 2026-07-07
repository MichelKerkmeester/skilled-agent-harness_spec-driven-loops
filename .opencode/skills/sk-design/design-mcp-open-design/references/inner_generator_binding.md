---
title: "Open Design Inner Generator Binding Contract"
description: "Boundary contract that binds the Open Design inner generator's multi-turn input payload to DESIGN_PROOF_TOKEN payload digests."
trigger_phrases:
  - "open design inner generator binding"
  - "inner generator payload binding"
  - "build-fire payload digest binding"
  - "open design inner payload drift"
importance_tier: "important"
contextType: "implementation"
version: 1.0.0.0
---

# Open Design Inner Generator Binding Contract

`INNER_GENERATOR_BINDING v1` binds the Open Design inner generator's effective input payload to the authorized `DESIGN_PROOF_TOKEN` payload digests. A run may only proceed when the boundary can recompute the payload digests from the actual inner payload that will be forwarded.

This contract depends on the proof-token and guarded-proxy contracts:

| Dependency | Boundary |
|---|---|
| [`DESIGN_PROOF_TOKEN`](../../shared/design_proof_token.md) | Defines token schema, payload digest fields, freshness, replay, surface binding, validator behavior, and §4 digest canonicalization. This document cites that contract and does not redefine token internals. |
| [`Open Design Guarded Proxy`](./guarded_proxy.md) | Defines the agent-side precondition before an Open Design call is forwarded. This document extends that recompute point across the inner generator's multi-turn run flow. |

The binding is a boundary rule, not a new token. It extends no token field and never re-mints or amends a `DESIGN_PROOF_TOKEN`.

---

## Inner Generation Boundary

Open Design generation is multi-turn. The first turn starts the run and may spawn the inner agent:

| Turn | Operation | Boundary meaning |
|---|---|---|
| Turn 1 request | `start_run(prompt, skill, inputs, agent, model)` or `od run start --message` | Starts the run, selects the inner agent and model, and commonly returns a discovery question form with `awaiting_input` and zero files. |
| Build-fire turn | `od ui respond --value`, `od ui respond --value-json`, `od ui respond --skip`, or `od run start --conversation` | Supplies the form answers or follow-up message that causes the inner generator to write design files. |

The token authorizes the outgoing request, but the build-fire turn is where a drifted prompt, answers object, lineage object, or model can cause the generated design to differ from the authorized design request. This contract closes that gap at the adapter boundary for both turns.

---

## Bound Inner Payload

The adapter MUST reconstruct the complete inner generator payload as structured metadata before forwarding either turn. Prose summaries, inferred intent, and human-readable command text are not sufficient.

| Inner payload component | Token binding | Source examples |
|---|---|---|
| Subject | `subjectDigest` | The normalized subject or target design request the inner generator is asked to satisfy. |
| Brief | `briefDigest` | The structured brief object carried by `start_run`, `--message`, run inputs, or equivalent adapter metadata. |
| Form answers or follow-up | `formAnswersDigest` | Discovery-form answers from `od ui respond --value` / `--value-json`, or the follow-up object/message carried by `od run start --conversation`. |
| Open Design lineage | `openDesignLineageDigest` | The structured lineage object that identifies run, conversation, project, source artifacts, parent operation, and related Open Design context. |

The inner agent and pinned model are bound by declared equality against the authorization metadata available at the boundary. That equality check is not a digest and does not add a token field. If the actual inner model differs from the authorized pinned model, the boundary MUST deny.

---

## Recompute And Reject

The adapter MUST recompute `subjectDigest`, `briefDigest`, `formAnswersDigest`, and `openDesignLineageDigest` from the actual inner payload for both the turn 1 request and the build-fire turn. It MUST compare the recomputed values to the same `DESIGN_PROOF_TOKEN` that authorized the run.

Canonicalization is inherited by reference from [`DESIGN_PROOF_TOKEN` §4](../../shared/design_proof_token.md#4-digest-canonicalization):

| Digest | Canonicalization source |
|---|---|
| `subjectDigest` | The §4 subject-string rule, including the empty/no-data subject value. |
| `briefDigest` | The §4 canonical-JSON rule for the exact brief object, including its empty/no-data value. |
| `formAnswersDigest` | The §4 canonical-JSON rule for the exact form-answer object, including its empty/no-data value. |
| `openDesignLineageDigest` | The §4 canonical-JSON rule for the exact lineage object, including its empty/no-data value. |

This document intentionally defines no second hashing rule. A validator that cannot reconstruct the digest input unambiguously MUST deny.

The boundary MUST return `DENY` when any of these occur:

| Case | Denial condition |
|---|---|
| Payload drift | Any recomputed digest from the actual inner payload differs from the token value. |
| Turn mismatch | The build-fire turn cannot be rebound to the same token used for the turn 1 request. |
| Changed stable components | The build-fire turn changes subject, brief, or lineage in a way that recomputes to different token digests. |
| Missing answers | `--skip`, "use recommended defaults", or an equivalent blanket-default request does not materialize concrete answers that recompute to `formAnswersDigest`. |
| Wrong model | The actual inner model differs from the pinned authorized model. |
| Ambiguous input | Required payload components are absent, unreadable, prose-only, or ambiguously reconstructable. |
| Validator failure | Classification, canonicalization, replay, freshness, target binding, or digest validation throws or cannot complete. |

The boundary MUST return `ALLOW` only when both turns can be reconstructed, every payload digest recomputes to the token value, the build-fire turn reuses the same token, and the pinned model matches.

---

## Where It Binds

The guarded-proxy precondition is the recompute point. Surface adapters normalize the request, classify it, rebuild `payloadDigestInputs` from the actual outgoing payload, and invoke the token validator before forwarding.

`INNER_GENERATOR_BINDING v1` applies that same precondition to the inner generator's multi-turn flow:

| Boundary | Required behavior |
|---|---|
| Turn 1 request | Recompute subject, brief, form-answer, and lineage digests from the actual `start_run` or `od run start --message` payload before inner-agent spawn. |
| Build-fire turn | Recompute the same digest set from the actual `od ui respond` or `od run start --conversation` payload before any file-writing generation fires. |
| Same-token binding | Compare both turns against the same token reference, nonce, run boundary, target surface, and pinned model. |

The binding is carried as structured metadata through the adapter. It must not be reconstructed from chat prose, UI labels, or caller assertions after the fact.

---

## Named Residual

The bundled Open Design daemon spawns the inner agent inside the closed app. The agent-side adapter can bind the inner payload only at the adapter boundary across the turn 1 request and the build-fire turn.

Once an accepted request is forwarded, this contract cannot observe the inner agent's private reasoning, any daemon-internal payload mutation, or any prompt material the closed daemon injects after the adapter boundary. It also cannot force a raw HTTP-port call or in-app Skills-UI message through this binding when that call reaches the daemon around the adapter.

That residual is explicit: this contract rejects drift visible at the adapter boundary. It does not claim control inside the inner-agent process or over daemon-side bypass paths.

---

## Acceptance

| Scenario | Expected result |
|---|---|
| Positive walk: the turn 1 request and build-fire payload are reconstructable; subject, brief, form answers, and lineage recompute to the same token digests; the pinned model matches. | `ALLOW` before inner-agent spawn or build-fire forwarding. |
| Negative walk: the build-fire payload changes form answers, follow-up content, subject, brief, or lineage so any recomputed digest differs from the token. | `DENY` at the adapter boundary. |
| Negative walk: `--skip`, "recommended defaults", or equivalent blanket defaults provide no concrete answers that recompute to `formAnswersDigest`. | `DENY` at the adapter boundary. |
| Negative walk: the actual inner model differs from the authorized pinned model. | `DENY` at the adapter boundary. |
| Canonicalization reuse | The contract cites `DESIGN_PROOF_TOKEN` §4 for digest canonicalization and defines no second hashing rule. |
| Schema stability | The contract adds no `DESIGN_PROOF_TOKEN` field and never re-mints the token. |
| Residual honesty | The closed inner-agent process and daemon-side HTTP or Skills-UI bypass are named as residuals outside the adapter boundary. |
