---
title: "Decision Record: Phase 030 Local Provider Loader"
description: "Proposed architecture decisions for Phase 030: add one shared local-provider loader under src/config that both entry points consume, fail closed to the exact original on absent or malformed provider config, and default the local path to local-only privacy with a required judge."
trigger_phrases:
  - "local-provider-loader"
  - "architecture decision"
  - "shared loader and fail-closed local provider config"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-communication/001-sk-communication-creation/030-local-provider-loader"
    last_updated_at: "2026-08-14T18:42:57.776Z"
    last_updated_by: "opencode"
    recent_action: "Accepted and verified the shared loader, fail-closed, and local-only privacy decisions."
    next_safe_action: "Consume the loader from operator rollout documentation when the opt-in story is written."
    blockers: []
    key_files:
      - "decision-record.md"
      - "spec.md"
      - "plan.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-030-local-provider-loader-20260814"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "One shared loader is the single construction seam both entry points consume."
      - "The loader fails closed to the exact original on absent or malformed provider config and keeps the local path local-only with judgeMode required."
---
# Decision Record: Phase 030 Local Provider Loader

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Add one shared loader consumed by both entry points

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-14 |
| **Deciders** | Project owner and implementer at closeout |

---

<!-- ANCHOR:adr-001-context -->
### Context

The projection engine already ships every primitive for calling a local model: `createOllamaModelRecord`, `createLlamaCppModelRecord`, the OpenAI-compatible and Ollama-native adapters, `createLocalHttpTransport`, and the reject-only judge. But no entry point constructs the `projectMessage` input from an operator-provided local provider. The OpenCode plugin passes an empty provider config and the wrapper bin passes captured bytes through, so turning enablement on no-ops both entry points. The Phase 029 research names a shared loader under `src/config/` as the first choice: one construction site that both the plugin and the wrapper call, so behavior cannot diverge between entry points.

### Constraints

- The loader must reuse the shipped presets, privacy router, transports, and judge; no new provider path, adapter, or judge may be invented.
- Both entry points must resolve the same provider from the same file.
- The loader must be exported from the package barrel the plugin already imports.
- The existing `enabled` enablement contract must stay intact and backward-compatible.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We decided**: add one shared loader under `src/config/` that turns the optional `localProvider` block in the git-ignored `enablement.local.json` into the full projection wiring, and have both the OpenCode plugin input builder and the CLI-output wrapper bin call it.

**How it works**: the loader parses the file, validates the `localProvider` object (`kind`, `model`, optional `endpoint`), and returns a config carrying a local `ProviderModelRecord` (built from the shipped presets with a per-kind default endpoint), a local-only privacy policy, `judgeMode: 'required'`, a concrete local HTTP transport, and a shipped copy-editing prompt. A non-null result supplies the `projectMessage` input; a null result leaves each entry point's exact-original fallback untouched.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| One shared loader consumed by both entry points | Single construction seam, no entry-point divergence, reuses shipped presets | One module both seams must import | 9/10 |
| Env-only primary setup | No file to manage | No reader, not auditable, no committed example | 3/10 |
| Inline construction at each entry point | No new module | Duplicates construction and lets the plugin and wrapper diverge | 3/10 |
| Map LM Studio to the generic hosted family | One more preset family | The registry requires hosted deployment mode for that family, so LM Studio would be treated as hosted | 2/10 |

**Why this one**: one shared loader is the smallest complete design that makes a configured local provider project automatically through both entry points while reusing the shipped presets and keeping behavior identical everywhere.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:

- A configured local provider projects automatically at both entry points after one file write.
- The plugin and wrapper resolve the same record, policy, judge, prompt, and endpoint.
- No new adapter, judge, or hosted default enters the codebase.

**What it costs**:

- Both entry points must import and call the loader. Mitigation: each seam has one call site and a test pins it.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| An entry point diverges and skips the loader. | High | REQ-005/REQ-006 require both call sites, with tests at each seam. |
| LM Studio wires to the wrong family. | High | A per-kind default endpoint over the llama-cpp preset; the registry family lock is respected. |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | Necessary? | PASS | No entry point constructs the projection input from a local provider today. |
| 2 | Beyond local maxima? | PASS | Env-only, inline, and hosted-family alternatives were compared. |
| 3 | Sufficient? | PASS | One loader plus two call sites is the smallest complete wiring. |
| 4 | Fits goal? | PASS | It makes a configured local provider project automatically at both seams. |
| 5 | Open horizons? | PASS | Rank-2 env overlays can join the loader later without touching the entry points. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What will change**:

- `spec.md`: REQ-001 and REQ-005 through REQ-007 stating the loader surface and both entry-point wirings.
- `plan.md` and `tasks.md`: the loader authoring and the two wiring and verification tasks.
- `decision-record.md`: this ADR and the fail-closed and privacy ADRs.

**How to roll back**: remove the loader call at the affected entry point, restore the exact-original fallback, rerun the entry-point tests, and refresh the packet metadata. No shipped primitive changes are involved.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Fail closed to the exact original on absent or malformed provider config

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-14 |
| **Deciders** | Project owner and implementer at closeout |

---

<!-- ANCHOR:adr-002-context -->
### Context

Projection is an opt-in display rewrite. The enablement contract is default-off, and the outer gate already keeps projection off until an operator opts in. The new provider block must not weaken that: an `enabled: true` with a missing, malformed, unknown-kind, missing-model, or invalid-endpoint `localProvider` must not silently project through a default or fabricated provider, and it must never throw into the session. The Phase 029 fail-closed table requires the exact original for every one of those cases.

### Constraints

- Absent or malformed provider config must yield the byte-exact original, never a default or hosted projection.
- The loader must never throw; a null return is the only failure signal.
- The null path at each entry point must stay byte-identical to today's behavior.
- An `enabled: false` block with a valid provider must not project.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We decided**: the loader returns null on any absent, malformed, unknown-kind, missing-model, or invalid-endpoint provider config, and both entry points keep today's exact-original fallback on null.

**How it works**: the pure parse/build core validates every field and returns null instead of throwing; `loadLocalProjectionConfig()` catches any file read or JSON parse failure and returns null; and each entry point checks the result and falls back to the exact original when it is null.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| Fail closed to the exact original on null | Never projects on an unproven provider and never throws | A misconfiguration silently reverts to the original | 9/10 |
| Throw a descriptive error | Surfaces the misconfiguration loudly | Violates the fail-open plugin boundary and can break the session | 2/10 |
| Default to a hosted provider on missing config | Always projects | Egresses content the operator never approved | 1/10 |
| Best-effort partial projection | Keeps some projected value | Violates the byte-exact canonical guarantee | 1/10 |

**Why this one**: the exact original is the only safe outcome for a display layer whose canonical bytes must never change and whose provider must be operator-declared.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:

- No unproven provider configuration can produce a projection.
- The plugin and wrapper keep their byte-exact fallback exactly as today.
- The loader never throws, so the fail-open seam stays intact.

**What it costs**:

- A misconfigured provider silently reverts to the original. Mitigation: the loader's validation rules and the example file document the accepted schema.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A malformed block is silently ignored. | Medium | The example file and the fail-closed tests document and pin the accepted shape. |
| A thrown parse error breaks the session. | High | `loadLocalProjectionConfig()` catches file and JSON errors and returns null. |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | Necessary? | PASS | A display layer with operator-declared providers needs a single fail-closed rule. |
| 2 | Beyond local maxima? | PASS | Throw, hosted-default, and partial-projection policies were compared. |
| 3 | Sufficient? | PASS | A null return plus the exact-original fallback at both seams is the smallest complete rule. |
| 4 | Fits goal? | PASS | It keeps the byte-exact original as the outcome of every unproven provider terminal. |
| 5 | Open horizons? | PASS | New malformed shapes join the same null rule without redesign. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What will change**:

- `spec.md`: REQ-002 stating the fail-closed selection.
- `plan.md` and `tasks.md`: the loader validation and the null-path verification tasks.
- `decision-record.md`: this ADR recording the fail-closed rule.

**How to roll back**: revise the loader validation and the corresponding requirements, rerun the loader and entry-point tests, and refresh the packet metadata. No runtime code changes are involved.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Default the local easy-config path to local-only privacy with a required judge

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-14 |
| **Deciders** | Project owner and implementer at closeout |

---

<!-- ANCHOR:adr-003-context -->
### Context

The loader constructs the projection wiring on the operator's behalf, so it must pick privacy and fidelity defaults that cannot surprise anyone. Hosted routing must never be enabled by the easy config, and meaning-preservation checking must not be skipped. The Phase 029 research fixes the defaults: `egressConsent: false`, allowed privacy classes derived from the endpoint host, and `judgeMode: 'required'` with the shipped reject-only judge.

### Constraints

- The loader policy must never allow hosted egress.
- Allowed privacy classes must be derived from the endpoint host, not operator-authored.
- The default judge must be required, not disabled, and no accept-only judge may be introduced.
- A hosted record alongside the easy config must be denied before any call.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We decided**: the loader ships a local-only policy (`egressConsent: false`, loopback-derived allow classes) and `judgeMode: 'required'` with no custom judge.

**How it works**: the loader derives the record's privacy class and the policy's allow list from the endpoint host (loopback allows `local-offline`; a non-loopback host adds `local-networked`), keeps `egressConsent: false`, and sets `judgeMode: 'required'` so `projectMessage` composes the shipped reject-only judge. A hosted record present alongside the easy config is denied by the local-only policy before any provider call.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| Local-only policy with a required judge | Never egresses and always checks meaning | Rejects genuinely bad local rewrites back to the original | 9/10 |
| `egressConsent: true` in the easy config | Enables hosted records | Allows hosted deployment-mode records to egress content | 2/10 |
| `judgeMode: 'disabled'` as the default | Skips the judge entirely | Skips meaning coverage | 3/10 |
| A new accept-only local judge | Explicit local acceptance | Would authorize candidates deterministic checks rejected | 2/10 |

**Why this one**: the easy config must be private by construction and must not weaken the fidelity gate the shipped judge provides.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:

- The easy config can never egress content to a hosted route.
- Every local projection still crosses the meaning-preservation judge.
- A hosted record alongside the easy config is denied before any call.

**What it costs**:

- A genuinely poor local rewrite reverts to the exact original. Mitigation: that is the intended fidelity behavior, not a defect.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A non-loopback endpoint is treated as fully trusted. | Medium | It still gets `egressConsent: false` and only local classes; `local-networked` is the honest class for a LAN model. |
| An operator expects disabled judging. | Low | The design pins `required`; operators can still supply a custom judge through the library surface. |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | Necessary? | PASS | The loader must not pick privacy or fidelity defaults that permit egress or skip meaning checks. |
| 2 | Beyond local maxima? | PASS | Egress-consent, disabled-judge, and accept-only-judge alternatives were compared. |
| 3 | Sufficient? | PASS | Local-only policy plus required judge is the smallest complete default set. |
| 4 | Fits goal? | PASS | It keeps the easy config private and meaning-checked by construction. |
| 5 | Open horizons? | PASS | Hosted and mixed modes remain explicit later choices, unchanged. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What will change**:

- `spec.md`: REQ-004 stating the local-only privacy and required-judge default.
- `plan.md` and `tasks.md`: the loader policy/judge construction and the hosted-deny verification task.
- `decision-record.md`: this ADR recording the privacy and judge defaults.

**How to roll back**: revise the loader's policy and judge defaults, rerun the loader and runtime tests, and refresh the packet metadata. No router or judge behavior changes are involved.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->
