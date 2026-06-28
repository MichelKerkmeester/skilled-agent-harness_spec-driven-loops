---
title: "Implementation Summary: Invert Open Design exemption to a positive openDesignPurpose"
description: "Post-build record for the design-influence-axis inversion in mcp-open-design: the boolean feeds_design_decision is replaced by a required openDesignPurpose (openDesignExemption vs skDesignGate), a missing or unknown value maps to unclassified and is denied for design, the exemptTransport allowlist is preserved, the od-CLI cross-reference is folded in, and the old-boolean-consumer residual is named. Two files, scope clean."
trigger_phrases:
  - "open design purpose inversion implementation summary"
  - "unknown maps to guarded record"
  - "boolean to opendesignpurpose summary"
importance_tier: "normal"
contextType: "general"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/004-d4-open-design-pairing/008-positive-exemption-inversion"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Record the openDesignPurpose inversion, the unknown-guarded invariant, and the named residual"
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
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 008-positive-exemption-inversion |
| **Completed** | 2026-06-28 |
| **Level** | 2 |
| **Deliverable** | `.opencode/skills/mcp-open-design/references/guarded_proxy.md` (+27/-30) and `.opencode/skills/mcp-open-design/SKILL.md` (+18/-7) |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

The design-influence axis of the Open Design guarded proxy used to be driven by a caller-supplied boolean that defaulted to false. Omitting the flag meant "not design", so a caller could skip the design gate by saying nothing. This phase closes that allow-by-default-via-omission vector. The boolean `feeds_design_decision` is gone, replaced by a required `openDesignPurpose` that takes exactly two positive values. A caller who omits the purpose no longer slips onto the exempt path; the omission is now `unclassified` and denied for design.

This is a policy/contract inversion, not running code. The gate is never-executed pseudocode at the agent-side adapter, and the contract is the durable artifact the wider enforcement spine reads. The change touches exactly two files and edits no hook, policy file, or CLI surface.

### The positive two-value purpose

`openDesignPurpose` is required and takes exactly `openDesignExemption` (pure transport that forbids any later design use of the returned artifact) or `skDesignGate` (design-authorized; requires a valid `DESIGN_PROOF_TOKEN`). A missing value, an unknown value, or anything reconstructed ambiguously maps to `unclassified`. There is no longer a boolean default, so there is no silent "not design" path: `feeds_design_decision` is fully removed from `SKILL.md` with zero remaining references.

### The "unknown ⇒ guarded" invariant

The contract states one controlling rule: unknown ⇒ guarded. An unknown tool (absent from the `exemptTransport` allowlist) and an unknown purpose (no positive `openDesignExemption`) both deny without a token. The Classification table is now two-axis: a `mutating`/`destructive` operation is guarded; `skDesignGate` is guarded and token-required; a `read`/`transport` op is exempt only when it carries `openDesignExemption` AND is listed in `exemptTransport`; a missing/unknown/other purpose is guarded; and an unmapped or unlisted operation is guarded. Exemption requires BOTH the positive `openDesignExemption` assertion AND allowlist membership — either missing leaves the call guarded.

### The preserved exemptTransport allowlist

The pure-transport carve-out is preserved verbatim and is NOT newly token-gated. The MCP set (`list_projects`, `list_files`, `list_skills`, `list_plugins`, `list_agents`) and the read-only CLI verbs still pass without a `DESIGN_PROOF_TOKEN` — now keyed on a positive `openDesignExemption` rather than an omitted boolean. The Policy JSON swaps `requiresFeedsDesignDecisionFalse` for `requiresOpenDesignPurpose: "openDesignExemption"` and keeps `forbidsLaterDesignUse: true`, so the allowlist still allows harmless inventory, status, and polling while forbidding design laundering through a nominally read-only op.

### The folded-in od-CLI cross-reference (discharges D4-R5 P1)

The contract now states that the `od` CLI design-mutating Bash surface is enforced by the codex PreToolUse hook's od-CLI lane, not by this proxy. That cross-reference was the deferred P1 from D4-R5; landing it here discharges that residual. The proxy governs requests through the agent-side adapter and explicitly defers the design-mutating `od` Bash lane to the hook.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/mcp-open-design/references/guarded_proxy.md` | Modified | Invert the design-influence axis: required `openDesignPurpose` in the Canonical Request, two-axis Classification, Exemption Model + Policy JSON keyed on a positive `openDesignExemption`, the "unknown ⇒ guarded" invariant, the folded-in od-CLI cross-reference, and the named `feedsDesignDecision`-consumer residual — +27/-30 |
| `.opencode/skills/mcp-open-design/SKILL.md` | Modified | Remove the `feeds_design_decision=False` boolean default from `design_gate` / `route_open_design_resources` and the surrounding prose; require the positive `openDesignPurpose`; missing → `unclassified` → guarded — +18/-7, 0 remaining boolean refs |

No live skill, gate, hook, CLI, or `.codex` file was edited beyond these two. `tool_surface.md`, `.codex/policy.json`, and `pre-tool-use.ts` were NOT touched; they are named in the residual.

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementer (`cli-codex gpt-5.5 high fast`) edited only the two named files — `guarded_proxy.md` (+27/-30) and `SKILL.md` (+18/-7) — and held scope: `tool_surface.md`, `.codex/policy.json`, and `pre-tool-use.ts` were not touched. The orchestrator then verified the result independently against the actual files: `feeds_design_decision` is fully removed from `SKILL.md` (0 references on grep), the contract is deny-by-default on both the mutation and the design-influence axes, the "unknown ⇒ guarded" invariant is documented (an omitted `openDesignPurpose` is guarded, not exempt), the `exemptTransport` allowlist (`list_projects`/`list_files`/`list_skills`/`list_plugins`/`list_agents` plus the read-only verbs) is preserved and not newly token-gated, the od-CLI cross-reference is folded in, and a "## Named Residual" section flags any hook/policy/adapter/caller still reading a `feedsDesignDecision` boolean. An evergreen scan over the edited docs found no spec, packet, or phase identifiers and no `specs/` paths. This documentation records and re-verifies that work; it writes only the phase-folder docs and touches no live file beyond the two named edits.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Replace the boolean with a required two-value `openDesignPurpose` | A boolean with a false default lets a caller opt out by omission; a required positive purpose makes "no answer" fail closed instead of silently exempting |
| Map missing/unknown/other purpose to `unclassified` and deny | The only safe default for the design axis is fail-closed; `unclassified` can never feed a design decision |
| Require BOTH `openDesignExemption` AND allowlist membership to exempt | Either condition alone is insufficient — a positive assertion on an unlisted op, or a listed op with no assertion, both stay guarded; this is the two-axis deny-by-default |
| Preserve the `exemptTransport` allowlist verbatim, not newly token-gated | The legitimate pure-transport reads must stay allowed; tightening the axis must not regress harmless inventory/status/polling |
| Fold in the od-CLI cross-reference here | The design-mutating `od` Bash lane belongs to the codex PreToolUse hook; stating it discharges the D4-R5 deferred P1 and keeps the proxy boundary honest |
| Name the old-boolean-consumer residual instead of claiming closure | Any hook, policy file, adapter, or caller still reading `feedsDesignDecision` speaks the old contract until separately migrated; naming it keeps the boundary honest, no taste claim |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Boolean removed from `SKILL.md` | PASS, `feeds_design_decision` grep count = 0 |
| `openDesignPurpose` required, two positive values | PASS, `OPEN_DESIGN_PURPOSES = {"openDesignExemption", "skDesignGate"}`; `design_gate` raises on `unclassified` |
| Missing/unknown purpose → unclassified → denied for design | PASS, `classify_open_design_purpose` maps non-members to `unclassified`; gate denies |
| Deny-by-default on both axes | PASS, Classification guards mutating/destructive, `skDesignGate`, missing/unknown purpose, and unlisted/ambiguous ops |
| "unknown ⇒ guarded" invariant documented | PASS, stated in the contract intro, Policy block, and Acceptance table |
| Exemption requires positive assertion AND allowlist membership | PASS, Exemption Model: "Either condition missing means guarded" |
| `exemptTransport` allowlist preserved, not newly token-gated | PASS, `list_projects`/`list_files`/`list_skills`/`list_plugins`/`list_agents` + read-only verbs intact; gated on `openDesignExemption`, no token |
| od-CLI cross-reference folded in (discharges D4-R5 P1) | PASS, "The `od` CLI design-mutating Bash surface is enforced by the codex PreToolUse hook's `od` CLI lane" |
| Named Residual flags old-boolean consumers | PASS, "## Named Residual" names any hook/policy/adapter/caller still reading `feedsDesignDecision` |
| Evergreen: no spec/packet/phase IDs or `specs/` paths | PASS, edited-doc scan clean |
| Scope: only the two named files; no other live file touched | PASS, `tool_surface.md` / `.codex/policy.json` / `pre-tool-use.ts` not touched |
| `validate.sh --strict` (phase folder) | PASS for all non-generated checks; see GENERATED_METADATA residual below |
| GENERATED_METADATA residual (description.json / graph-metadata.json) | EXPECTED, the orchestrator regenerates these; level/fingerprint drift is not hand-written |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Policy/contract, not running code.** The gate is never-executed pseudocode at the agent-side adapter. This phase inverts the contract that closes the allow-by-default-via-omission vector; the enforceable controls (PreToolUse hook lanes, the proof token, transport-result re-validation) already exist and are what enforce it.
2. **Old-boolean consumers are a named residual, not migrated.** Any PreToolUse hook, policy file (`.codex/policy.json`), adapter, or caller still reading a `feedsDesignDecision` boolean speaks the old contract and can misclassify omission as non-design until separately migrated. `tool_surface.md`, `.codex/policy.json`, and `pre-tool-use.ts` are out of scope here.
3. **Daemon-side bypass is out of scope.** A raw HTTP-port call or an in-app Skills-UI message that reaches the bundled daemon without traversing the agent-side adapter cannot be forced through this proxy; the daemon residual is named, not implied away.
4. **No taste claim.** This binds the design-influence axis to a positive purpose; it does not certify the design quality of anything Open Design produces.

<!-- /ANCHOR:limitations -->

---

<!--
LEVEL 2 IMPLEMENTATION SUMMARY
- Core + Level 2 verification focus
- Policy/contract inversion: feeds_design_decision boolean replaced by a required openDesignPurpose; missing/unknown ⇒ unclassified ⇒ guarded ("unknown ⇒ guarded")
- exemptTransport allowlist preserved and not newly token-gated; od-CLI cross-ref folded in (discharges D4-R5 P1); old-boolean-consumer residual named; two files (+27/-30, +18/-7); GENERATED_METADATA regenerated by the orchestrator
-->
