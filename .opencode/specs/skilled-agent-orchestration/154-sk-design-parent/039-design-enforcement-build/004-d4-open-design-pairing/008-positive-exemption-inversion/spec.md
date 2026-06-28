---
title: "D4-R8 — Positive two-value openDesignPurpose; invert default-false to unclassified-guarded"
description: "Replace the boolean feeds_design_decision with a required openDesignPurpose (openDesignExemption vs skDesignGate); a missing or unknown value maps to unclassified and is denied for design."
trigger_phrases:
  - "d4-r8 positive exemption inversion"
  - "open design purpose unclassified guarded"
  - "unknown maps to guarded design gate"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/004-d4-open-design-pairing/008-positive-exemption-inversion"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Upgrade spec to Level 2; record the boolean-to-openDesignPurpose inversion and named residual"
    next_safe_action: "Let the parent refresh description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-open-design/references/guarded_proxy.md"
      - ".opencode/skills/mcp-open-design/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# D4-R8 — Positive two-value openDesignPurpose; invert default-false to unclassified-guarded

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Enforcement class** | hybrid |
| **Dimension** | D4 — mcp-open-design Pairing |
| **Completed** | 2026-06-28 |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The design-influence axis of the Open Design guarded proxy was driven by a caller-supplied boolean, `feeds_design_decision` in the skill gate and the normalized `feedsDesignDecision` at the proxy, that defaulted to `False`. A caller who omitted the flag was silently classified as non-design and routed onto the exempt path. Omission was an allow-by-default vector: "no answer" meant "not design", so the gate could be skipped by saying nothing.

### Purpose
Invert that axis so absence fails closed. The boolean-with-a-false-default is replaced by a **required** `openDesignPurpose` field taking exactly two positive values — `openDesignExemption` (pure transport that forbids any later design use of the artifact) and `skDesignGate` (design-authorized, requires a valid `DESIGN_PROOF_TOKEN`). A missing, unknown, or any-other value maps to `unclassified`, which is **denied for design**. The controlling invariant is stated explicitly: **"unknown ⇒ guarded"** — an unknown tool (absent from the allowlist) and an unknown purpose (no positive `openDesignExemption`) both deny without a token. Exemption now requires BOTH a positive `openDesignExemption` assertion AND `exemptTransport` allowlist membership; either condition missing leaves the call guarded.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Replace the boolean `feeds_design_decision` default with the required `openDesignPurpose` in the skill gate (`design_gate`, `route_open_design_resources`) and its prose
- Define `openDesignPurpose` with two positive values plus the `unclassified` deny-state in the guarded-proxy contract
- Rewrite the Classification table to a two-axis decision keyed on a positive `openDesignExemption` AND allowlist membership; `skDesignGate` ⇒ token-required; missing/unknown purpose ⇒ guarded
- Update the Exemption Model prose and the Policy JSON (`requiresFeedsDesignDecisionFalse` → `requiresOpenDesignPurpose: "openDesignExemption"`), keeping the allowlist closed and not newly token-gated
- Document the "unknown ⇒ guarded" invariant as the controlling rule
- Fold in the od-CLI cross-reference: the `od` CLI design-mutating Bash surface is enforced by the codex PreToolUse hook's od-CLI lane (this discharges the D4-R5 deferred P1)
- Name the residual: any PreToolUse hook, policy file, adapter, or caller still reading a `feedsDesignDecision` boolean

### Out of Scope
- Any edit to `tool_surface.md`, `.codex/policy.json`, or the PreToolUse hook (`pre-tool-use.ts`) — those carriers are named in the residual, not migrated here
- Redefining the `DESIGN_PROOF_TOKEN` internals — the `skDesignGate` path references the token contract by citation
- Closing the daemon-side bypass (a raw HTTP-port or in-app Skills-UI call that never traverses the agent-side adapter)
- Executing the gate — it is never-executed pseudocode at the agent-side adapter; this phase inverts a policy/contract, it does not ship running enforcement

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-open-design/references/guarded_proxy.md` | Modify | Invert the design-influence axis: required `openDesignPurpose`, two-axis Classification, Exemption Model + Policy JSON keyed on a positive `openDesignExemption`, the "unknown ⇒ guarded" invariant, the folded-in od-CLI cross-reference, and the named `feedsDesignDecision`-consumer residual — +27/-30 |
| `.opencode/skills/mcp-open-design/SKILL.md` | Modify | Remove the `feeds_design_decision=False` boolean default from the gate signature and prose; require the positive `openDesignPurpose`; missing → `unclassified` → guarded (0 remaining boolean refs) — +18/-7 |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Replace the boolean with a required positive purpose | `openDesignPurpose` is required and takes exactly `openDesignExemption` or `skDesignGate`; the `feeds_design_decision` boolean default is removed (0 remaining refs in `SKILL.md`) |
| REQ-002 | Missing/unknown purpose denies for design | A missing, unknown, or any-other `openDesignPurpose` maps to `unclassified` and is DENIED for design at the gate; no silent default-exempt path remains |
| REQ-003 | Exemption requires BOTH the positive assertion AND allowlist membership | `openDesignExemption` plus `exemptTransport` membership is required to exempt; either condition missing leaves the call guarded |
| REQ-004 | Document the controlling invariant | "unknown ⇒ guarded" is stated as the controlling rule: unknown tool AND unknown purpose both deny without a token |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Preserve the exemptTransport allowlist unchanged | The `list_projects` / `list_files` / `list_skills` / `list_plugins` / `list_agents` set plus the read-only CLI verbs remain ALLOWED with `openDesignExemption` and are NOT newly token-gated |
| REQ-006 | Fold in the od-CLI cross-reference (discharges D4-R5 P1) | The contract states the `od` CLI design-mutating Bash surface is enforced by the codex PreToolUse hook's od-CLI lane, not by this proxy |
| REQ-007 | Name the old-contract residual | A "Named Residual" flags any PreToolUse hook, policy file, adapter, or caller still reading a `feedsDesignDecision` boolean instead of `openDesignPurpose` |
| REQ-008 | Keep the edits evergreen | No spec, packet, or phase IDs and no `specs/` paths embedded in the edited policy docs |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The gate is deny-by-default on both axes — an unknown operation (absent from `exemptTransport`) and an unknown purpose (no positive `openDesignExemption`) both resolve to guarded/denied.
- **SC-002**: A call that omits `openDesignPurpose` is `unclassified` and DENIED for design; an `openDesignExemption` call that later feeds a design decision is DENIED; a `skDesignGate` call requires a valid `DESIGN_PROOF_TOKEN`.
- **SC-003**: The `exemptTransport` allowlist is preserved and not newly token-gated; the "unknown ⇒ guarded" invariant and the folded-in od-CLI cross-reference are present; the `feedsDesignDecision`-consumer residual is named; the edited docs carry no spec/packet/phase IDs or `specs/` paths.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The gate is never-executed pseudocode | A runtime that ignores the contract is not mechanically stopped by it | This is a policy/contract inversion at the agent-side adapter; it closes the allow-by-default-via-omission vector in the contract that downstream enforcement consumes. No taste claim |
| Risk | An old-boolean consumer still reads `feedsDesignDecision` | A PreToolUse hook, policy file, adapter, or caller that reads the removed boolean can still misclassify omission as non-design | Residual NAMED in `guarded_proxy.md`, not implied away; those carriers (`tool_surface.md`, `.codex/policy.json`, `pre-tool-use.ts`) are out of scope here and migrate separately |
| Risk | Daemon-side bypass | A raw HTTP-port or in-app Skills-UI call that never traverses the agent-side adapter cannot be forced through this proxy | Daemon residual named; the honest boundary is agent-side enforcement across wired adapters |
| Risk | Allowlist regression | Tightening the axis could newly block a legitimate pure-transport read | The `exemptTransport` set is preserved verbatim and gated only on the positive `openDesignExemption`, not newly token-gated |
| Dependency | `DESIGN_PROOF_TOKEN` contract | Green | Referenced for the `skDesignGate` path; not redefined here |
| Dependency | `exemptTransport` allowlist | Green | The closed pure-transport carve-out reused unchanged |
| Dependency | codex PreToolUse od-CLI lane | Green | The folded-in cross-reference points design-mutating `od` Bash calls at the hook lane; discharges the D4-R5 deferred P1 |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Security
- **NFR-S01**: The gate fails closed — a missing, unknown, or unreconstructable `openDesignPurpose` denies for design rather than silently exempting. Omission is no longer an allow-by-default vector.
- **NFR-S02**: Exemption is the explicitly-asserted exception. A positive `openDesignExemption` is required to take the carve-out, and it also asserts the returned artifact will not later be used as design-decision input.

### Defense-in-Depth
- **NFR-DD01**: The inversion is a contract-level control on the design-influence axis; the proxy already denies by default on the mutation axis. The two-axis deny-by-default contract is consumed by the wider enforcement spine (PreToolUse hook, policy, transport-result re-validation), with the old-boolean carriers named as the migration residual.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Purpose Values
- **Omitted purpose**: A call with no `openDesignPurpose` → `unclassified` → DENIED for design; absence is never exempt.
- **Unknown/other purpose**: Any value other than `openDesignExemption` or `skDesignGate` → `unclassified` → DENIED.
- **Exemption without allowlist membership**: `openDesignExemption` on an operation absent from `exemptTransport` → guarded; the positive assertion alone does not exempt.
- **Exemption that later feeds design**: `openDesignExemption` whose returned artifact is reused to decide layout/tokens/components/motion/brief → DENIED; the assertion forbids later design use.

### Tool Axis
- **Listed pure-transport op with exemption**: An `exemptTransport` op with `openDesignExemption` → ALLOWED without a token (no new gate).
- **Unknown design-affecting tool**: A new tool absent from the policy block, with any purpose → guarded; "unknown ⇒ guarded".

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

- **Surface count**: Two edited docs — the guarded-proxy contract (Canonical Request, Classification, Exemption Model, Policy JSON, invariant, residual) and the skill gate signature/prose. No source code, hook, or policy-file change.
- **Risk concentration**: The single material gap is a consumer that still reads the old `feedsDesignDecision` boolean, plus the daemon-side bypass — both named as residuals rather than claimed closed.

<!-- /ANCHOR:complexity -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should the old-boolean carriers (`tool_surface.md`, `.codex/policy.json`, `pre-tool-use.ts`) be migrated in this phase? **RESOLVED: No. They are out of scope here and named in the "Named Residual" section. Any PreToolUse hook, policy file, adapter, or caller still reading a `feedsDesignDecision` boolean speaks the old contract and can misclassify omission as non-design until separately migrated. Stating it keeps the boundary honest; no taste claim.**
- Does this phase ship running enforcement? **RESOLVED: No. The gate is never-executed pseudocode at the agent-side adapter. This is a policy/contract inversion that closes the allow-by-default-via-omission vector in the contract the downstream enforcement spine consumes. The enforceable controls (PreToolUse hook lanes, the proof token, transport-result re-validation) already exist; this binds the design-influence axis to a positive purpose for them to read.**

<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`

---

<!--
LEVEL 2 SPEC
- Core + Level 2 verification focus
- Policy/contract inversion: replace the feeds_design_decision boolean with a required openDesignPurpose; missing/unknown ⇒ unclassified ⇒ guarded ("unknown ⇒ guarded")
- exemptTransport allowlist preserved and not newly token-gated; od-CLI cross-ref folded in (discharges D4-R5 P1); old-boolean-consumer residual named; never-executed-pseudocode nature recorded in RISKS/OPEN QUESTIONS
-->
