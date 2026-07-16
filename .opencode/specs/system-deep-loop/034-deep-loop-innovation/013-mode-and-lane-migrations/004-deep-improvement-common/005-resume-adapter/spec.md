---
title: "Feature Specification: Deep Improvement Common Services - Resume Adapter"
description: "Define the Deep Improvement Common Services resume adapter over the sealed typed event ledger: deterministic reducer reconstruction, continuity-ladder mapping, idempotent re-entry, and the shared evaluator, canary, and guarded-promotion service contracts reused by the three benchmark variants."
trigger_phrases:
  - "deep improvement resume adapter"
  - "deep improvement common services resume"
  - "sealed ledger resume"
  - "idempotent deep improvement re-entry"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/034-deep-loop-innovation/013-mode-and-lane-migrations/004-deep-improvement-common/005-resume-adapter"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/034-deep-loop-innovation/013-mode-and-lane-migrations/004-deep-improvement-common/005-resume-adapter"
    last_updated_at: "2026-07-15T20:40:00Z"
    last_updated_by: "opencode"
    recent_action: "Established ledger-only resume scope and shared service ownership"
    next_safe_action: "Define reducer mapping and idempotent re-entry fixtures"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Deep Improvement Common Services - Resume Adapter

> Phase adjacency under `004-deep-improvement-common` (navigation, not a hard runtime dependency): predecessor `004-certificates-and-receipts`; successor `006-shadow-parity`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/034-deep-loop-innovation/013-mode-and-lane-migrations/004-deep-improvement-common/005-resume-adapter |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-15 |
| **Owner skill** | system-deep-loop (deep-improvement common services) |
| **Origin** | Resume Adapter child of the deep-improvement common migration under phase 013 |
| **Inputs** | 065 parent spec; phase-tree manifest; findings registries from 065/002; typed ledger, receipts, and reducer contracts frozen by earlier program phases |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The evaluator-first deep-improvement loop is a shared backbone for candidate generation, evaluation, scoring, canary analysis,
and guarded promotion. Its three benchmark variants reuse the same packet and scoring backend, so a resume behavior implemented
inside one variant would create divergent state semantics and unsafe replay at the exact point where an interruption is most likely
to occur. The current runtime also carries process-local and JSONL-shaped in-flight state that cannot prove whether a candidate,
evaluator effect, score, canary, or promotion decision was already applied.

The parent program requires the new substrate to remain additive, dark, and non-authoritative until staged cutover. This phase
therefore plans one common Resume Adapter that rebuilds live state only from the sealed typed event ledger through deterministic
reducers. It maps the reconstructed state onto the continuity ladder, exposes an explicit per-step re-entry decision, and uses
stable logical identities plus idempotency receipts to prevent double-apply, lost events, or replayed side effects. The adapter
must treat immutable LLM or executor observations as history inputs; replay re-runs orchestration over those observations rather
than regenerating them.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The sealed-ledger read boundary for deep-improvement common services, including event-range selection, schema/upcaster compatibility, replay fingerprinting, and a deterministic reducer invocation contract.
- A continuity-ladder mapping from run and lineage identity through candidate generation, evaluator execution, scoring, canary analysis, guarded promotion, and terminal or blocked outcomes.
- Reducers that reconstruct evaluator, canary, and promotion service state from immutable events and receipts without writing replayed domain events or mutating historical evidence.
- An explicit per-logical-operation decision algebra: `reuse`, `reexecute`, `compensate`, or `reject`, with an `unknown` effect state when an effect started without a durable receipt.
- Stable resume request identity, event application guards, replay fingerprints, duplicate-request behavior, and changed-manifest handling for idempotent re-entry.
- The shared evaluator service contract: versioned evaluator capsule, raw observations, normalized score projections, uncertainty, evidence sufficiency, and evaluator identity.
- The shared canary service contract: sealed canary epoch, cross-domain and adversarial coverage, contamination or leak vetoes, and immutable canary receipts.
- The shared guarded-promotion service contract: candidate and baseline evidence, preservation checks, known-failure accounting, environment-policy freshness, canary health, and explicit `PROMOTE`, `REJECT`, `INCONCLUSIVE`, or `QUARANTINE` outcomes.
- Consumer handoff contracts for `005-agent-improvement`, `006-model-benchmark`, and `007-skill-benchmark`; variants supply typed mode payloads and consume these common services.
- Crash, duplicate, partial-receipt, schema-drift, changed-manifest, and replay-parity fixtures for the phase gate.

### Out of Scope
- Implementing the three benchmark variants or their mode-specific candidate schemas, reducers, certificates, or mode gates.
- Re-defining the canonical event envelope, append-only storage, transition authorization, receipts, or certificate primitives owned by earlier shared phases.
- Generic durable fan-out/fan-in, novelty and claim projections, convergence, termination, or the six sibling concerns in this mode migration.
- Authority cutover, legacy-writer retirement, or any change that makes the ledger or promotion result authoritative for live runtime behavior.
- Re-running candidate generation from current configuration when the original manifest is unavailable or changed; that case is a new lineage or an explicit rejection, not implicit resume.
- Adding evaluator policy that belongs to a variant rather than the shared service boundary.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Resume reconstructs state from the sealed ledger only | Given the same sealed event range, registry/upcaster identity, reducer set, and reference-artifact digests, repeated rebuilds produce byte-equivalent state and a stable resume fingerprint without reading mutable checkpoints or current process memory |
| REQ-002 | Reducers are deterministic and non-emitting | Reducers consume validated effective events in ledger order, preserve raw observations and receipt provenance, and never append a replayed event, mutate an old event, or invoke an external effect |
| REQ-003 | The continuity ladder is explicit | Every supported in-flight state maps to one ladder level, its sealed evidence, reconstructed projection, and next re-entry decision; unmapped or ambiguous states fail closed |
| REQ-004 | Replay compatibility is event-level and sealed | Unknown event types, unsupported versions, broken upcaster chains, changed reducer identity, mismatched ledger seals, or incompatible fingerprints return a typed `REJECT` or `QUARANTINE` result before re-entry |
| REQ-005 | Re-entry uses an explicit decision algebra | Each logical candidate/evaluator/canary/promotion operation resolves to `reuse`, `reexecute`, `compensate`, or `reject`; a changed manifest cannot inherit success by label alone |
| REQ-006 | Resume requests are idempotent | The same resume request key and payload returns the existing re-entry receipt without another apply; reuse of a key with different payload or fingerprint fails closed |
| REQ-007 | No event is lost, double-applied, or replayed as a side effect | Event identity and logical effect identity remain stable across retries, while attempt identity may change; branch-local successes survive interruption and incomplete effects remain explicitly `UNKNOWN` |
| REQ-008 | The evaluator service is shared and replayable | Evaluator capsule, fixture epoch, evaluator identity, raw observations, normalized scores, uncertainty, and evidence sufficiency are versioned and reducible independently of candidate generation |
| REQ-009 | The canary service is sealed and independent | Canary inputs are frozen for an epoch, candidate-visible leakage produces a veto without exposing canary content, cross-domain health is separate from target reward, and canary receipts bind the candidate and epoch digests |
| REQ-010 | Promotion is a guarded evidence decision | Promotion requires the receipt lattice for target repair, baseline-pass preservation, known failures, environment and policy freshness, and canary health; `UNKNOWN` or `INSUFFICIENT_EVIDENCE` cannot become `PROMOTE` |
| REQ-011 | The three variants consume one common contract | `005-agent-improvement`, `006-model-benchmark`, and `007-skill-benchmark` can call the same evaluator, canary, promotion, and resume interfaces while retaining variant-owned payloads and projections |
| REQ-012 | Dark-mode authority boundaries remain intact | Resume and promotion decisions affect only the typed shadow path before phase 017; legacy state, live control flow, and user-visible authority remain unchanged |
<!-- /ANCHOR:requirements -->

### Continuity-ladder and re-entry contract

The adapter must reconstruct the following ladder from sealed events. The ladder is a projection contract, not a second source of
truth; each row is derived from immutable event evidence and the common service receipts.

| Ladder level | Sealed evidence | Reducer projection | Re-entry rule |
|--------------|-----------------|--------------------|---------------|
| Run identity | Run-start event, lineage identity, manifest digest, authority epoch | `run` and `lineage` identity plus sealed input fingerprint | Reuse the original lineage only when the manifest and replay fingerprint match; otherwise reject or fork explicitly |
| Candidate generation | Candidate request, parent identities, candidate artifact digest, generation receipt | Candidate set with immutable parentage and artifact status | Reuse sealed candidates; reexecute only missing operations under the same logical identity; never regenerate silently from current configuration |
| Evaluation | Evaluator capsule, fixture epoch, evaluator invocation and observation receipts | Per-case observations, evaluator status, raw score evidence, and unknown effects | Reuse verified observations; reexecute missing compatible cells; quarantine capsule or input drift |
| Scoring | Score normalization, reducer version, calibration and aggregation events | Versioned score vector, uncertainty, evidence sufficiency, and score status | Reuse only the same score policy and input fingerprint; otherwise recompute as a new score revision without deleting prior evidence |
| Canary | Sealed canary epoch, candidate alias, coverage and leak-veto receipts | Canary health, coverage, veto state, and epoch identity | Reuse sealed results; an incomplete or unknown canary remains `INCONCLUSIVE`, never a pass |
| Promotion | Promotion request, evidence-lattice receipts, decision event, and side-effect receipt if any | Guarded decision plus decision fingerprint and applied status | Return a recorded decision on exact duplicate; pending or ambiguous application requires the shared effect policy, not an automatic repeat |
| Terminal or blocked | Terminal, rejection, quarantine, compensation, or explicit fork event | Stable terminal state and reason code | Terminal state is a no-op for the same request; a new outcome requires a new lineage or explicit authorized transition |

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Rebuilding one sealed deep-improvement ledger range twice yields the same continuity projection, service projections, and resume fingerprint.
- **SC-002**: Crash and duplicate fixtures prove no logical event or side effect is double-applied, lost, or replayed; branch-local successful work remains reusable.
- **SC-003**: The adapter distinguishes compatible reuse, missing-work re-execution, effect compensation, and rejection, with `UNKNOWN` preserved for incomplete external effects.
- **SC-004**: The evaluator, canary, and guarded-promotion services have one shared typed contract consumed by all three benchmark variants.
- **SC-005**: Promotion cannot pass on target score alone; baseline preservation, known failures, environment-policy freshness, and canary evidence remain independently visible.
- **SC-006**: Changed manifests, reducer or evaluator drift, unsupported event versions, and sealed-ledger mismatch fail closed without mutating prior evidence.
- **SC-007**: Resume and promotion remain dark and non-authoritative until the staged cutover phase, with no legacy behavior change.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Effect ambiguity can cause duplicate external work** - an effect-started event without a completion receipt must remain `UNKNOWN` and route through the shared effect policy (`retry-with-key`, `query`, `compensate`, or `quarantine`), never a universal retry.
- **Reducer or registry drift can change reconstructed state** - bind the reducer set, event registry/upcaster chain, service capsule, and sealed ledger range into the replay fingerprint; reject mismatches before re-entry.
- **A latest-checkpoint shortcut can skip branch-local evidence** - fold logical branch receipts independently and preserve completed siblings instead of replaying an entire wave or merged iteration.
- **Shared services can be copied into variants** - publish one common interface and consumer matrix; variant specs may add adapters but may not redefine evaluator, canary, promotion, or resume semantics.
- **Promotion can become hidden authority** - keep promotion as an auditable typed decision in the shadow path and defer live authority to phase 017; a successful shadow decision must not change legacy state.
- **Canary contamination can invalidate evidence** - use versioned epochs, candidate aliases, leak vetoes, and cross-domain health separate from optimization reward; a veto or unknown result blocks promotion.
- **Dependencies**: the phase-013 parent contract, the phase-012 shared mode interfaces and write-set conflict graph, the common typed ledger and reducers, and the adjacent receipts/certificates contract. This child keeps `depends_on: []` as an independent planning contract; runtime implementation readiness is established by the parent handoff rather than a new hard dependency.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None block planning; implementation resolves these against the frozen shared contracts:

- Which concrete event names and reducer module boundaries expose the continuity ladder without duplicating the phase-015 mode interface?
- Which effect-recovery policy is available for each evaluator, canary, and promotion side effect, and which operations are queryable by stable idempotency key?
- Which evaluator-capsule fields are common across the three variants and which remain opaque variant extensions while preserving capsule digest stability?
- What bounded replay-cache optimization is safe after the full-fold correctness contract is established, without making a cache authoritative?
<!-- /ANCHOR:questions -->
