---
title: "Implementation Summary: Freeze the design-affecting Open Design automation surface"
description: "Post-build record for the automation-freeze contract appended to guarded_proxy.md: a design-affecting automation is DENIED by default because the proof token is single-use + ~300s TTL; two escape paths (per-execution fresh-mint, named pre-authorized replay) and a read-only exemption; the DESIGN_PROOF_TOKEN Section 2 reuse by citation; and the daemon-internal scheduler named as the residual. One file, pure append, scope clean."
trigger_phrases:
  - "open design automation freeze implementation summary"
  - "headless automation deny by default record"
  - "automation freeze escape paths summary"
importance_tier: "normal"
contextType: "general"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/004-d4-open-design-pairing/011-automation-freeze"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Record the appended Automation Freeze section, two escape paths, named residual"
    next_safe_action: "Let the parent refresh description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-open-design/references/guarded_proxy.md"
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
| **Spec Folder** | 011-automation-freeze |
| **Completed** | 2026-06-28 |
| **Level** | 2 |
| **Deliverable** | `.opencode/skills/mcp-open-design/references/guarded_proxy.md` (+25/-0, pure append) |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

The Open Design guarded proxy denies any design-affecting call that arrives without a valid `DESIGN_PROOF_TOKEN`, and that token is single-use with a ~300-second life. A headless automation has no live operator at fire time, so it cannot mint or carry that token — which left the automation surface as an unhandled gap in the contract. This phase closes that gap by appending an `## Automation Freeze` section that makes the automation subset deny-by-default and writes down the only two ways a design-affecting automation may proceed. The change is a pure append to one existing reference file; nothing prior was removed.

This is a prose policy contract at the agent/proxy boundary, not running code. It refines the guarded-proxy precondition that the wider enforcement spine reads, reuses the existing token rules by citation instead of restating them, and names the one fire path the agent side cannot reach.

### The freeze rule

A design-affecting automation is FROZEN — DENIED by default. That covers `od automation create` or `od automation run` when the automation triggers a design-mutating operation, and any scheduled `start_run` fire that would launch design work. The rationale is the token contract itself: `DESIGN_PROOF_TOKEN` Section 2 requires `singleUse: true` and a short `expiresAt` of approximately 300 seconds, and an unattended automation cannot mint or carry a live interactive single-use token at fire time. The freeze cites that section rather than restating any token field schema, so the single-use/TTL rule keeps exactly one source of truth.

### Escape path A — per-execution fresh-mint

The automation pauses for a live operator to mint a fresh single-use token bound to that specific fire's actual outgoing payload. This converts a headless fire into an attended execution, and the normal token validator then governs the ALLOW. There is no headless shortcut here: the operator presence is the whole point.

### Escape path B — named, auditable pre-authorization

The automation records a create-time frozen binding: subject digest, payload digests, `maxRuns`, and `reviewWindow`. Fire-time accepts only an exact replay of that binding inside the review window and the remaining run budget. Any drift in the subject/payload digest, a missing binding, an expired window, or an exhausted budget is DENY. This is the only way a fire proceeds without a live operator, and it stays bounded and auditable by construction.

### The read-only-automation exemption

Pure inventory automation feeds and mutates no design decision, so it needs no token. `od automation list`, `od automation view`, and `od automation show`, carrying `openDesignPurpose: "openDesignExemption"`, are ALLOWED without a design token — consistent with the host Exemption Model. Mutating create/run stays guarded.

### The named daemon-scheduler residual

The bundled Open Design daemon ships its own internal scheduler, which can fire a scheduled automation without traversing the agent-side adapter. Agent-side policy cannot freeze that path, so the section names it plainly as the residual rather than implying it away. The honest boundary is the agent/proxy surface; this is a prose policy contract there, not a daemon patch.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/mcp-open-design/references/guarded_proxy.md` | Modified (append) | Append a new `## Automation Freeze` section: the freeze rule grounded in the single-use/~300s token, escape path A (per-execution fresh-mint), escape path B (named pre-authorized replay of a frozen `maxRuns`/`reviewWindow` binding), the read-only exemption (`od automation list`/`view`/`show`), the named daemon-scheduler residual, the `DESIGN_PROOF_TOKEN` Section 2 citation, and a section Acceptance table — 25 insertions, 0 deletions |

No other live skill, daemon, hook, CLI, or `.codex` file was edited. The prior `guarded_proxy.md` content — the deny-by-default inversion, `openDesignPurpose`, the od-CLI cross-reference, and the existing Named Residual — is fully preserved; the change is append-only.

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementer (`cli-codex gpt-5.5 high fast`) appended the `## Automation Freeze` section to the existing `guarded_proxy.md` as a pure append — 25 insertions, 0 deletions — and held scope to that one file. The orchestrator then verified the result independently against the actual file: the append removed no lines (0 deletions), the prior content stayed intact (the `openDesignPurpose` model and the od-CLI cross-reference are still present), and the appended section carries the freeze rule, both escape paths, the read-only exemption, and the named daemon-scheduler residual. The single-use/TTL basis is reused by citation to `DESIGN_PROOF_TOKEN` Section 2 — the `#2-field-schema-v1` anchor resolves to that contract's `## 2. FIELD SCHEMA (v1)` heading — with no second field schema introduced. An evergreen scan over the appended section found no spec, packet, or phase identifiers and no `specs/` paths. This documentation records and re-verifies that work; it writes only the phase-folder docs and touched no live file beyond the named append.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Append the freeze contract to `guarded_proxy.md` rather than create a standalone reference | The boundary model, canonical request, classification, deny-by-default precondition, the `od automation` guarded/exempt split, and the token citation already live there; a standalone file would re-state all of that scaffolding |
| Make the design-affecting automation deny-by-default | A single-use, ~300s token cannot be minted or carried by an operator-absent fire, so the only safe default for the automation subset is fail-closed |
| Allow exactly two escape paths, no more | Per-execution fresh-mint converts a headless fire into an attended one; named pre-authorized replay stays bounded and auditable — anything looser would re-open the operator-absent laundering vector |
| Bound escape path B to an exact replay inside the review window and run budget | A frozen binding accepted as a free-running credential could re-authorize stale design work; the window and budget keep a pre-authorization from outliving its review |
| Reuse the single-use/TTL rule by citation to `DESIGN_PROOF_TOKEN` Section 2 | Restating token internals would fork the source of truth; citing it keeps one schema and lets the token contract evolve without drift here |
| Name the daemon-internal scheduler as the residual instead of claiming closure | The agent side cannot freeze a fire that never traverses the adapter; naming it keeps the boundary honest, no taste claim |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Pure append (no deletions) | PASS, 25 insertions / 0 deletions; prior content preserved |
| Prior content intact after append | PASS, `openDesignPurpose` model and the od-CLI cross-reference still present in `guarded_proxy.md` |
| Freeze rule denies a design-affecting automation by default | PASS, "A design-affecting automation is FROZEN — DENIED by default" covering `od automation create`/`run` and scheduled `start_run` |
| Escape path A (per-execution fresh-mint) documented | PASS, "pauses for a live operator to mint a fresh single-use token bound to that fire's actual outgoing payload" |
| Escape path B (named pre-authorized replay) documented | PASS, create-time frozen binding (subject/payload digests, `maxRuns`, `reviewWindow`); fire-time exact replay only; drift/expiry/exhaustion → DENY |
| Read-only-automation exemption documented | PASS, `od automation list`/`view`/`show` with `openDesignExemption` require no token |
| Single-use/TTL reused by citation, no second schema | PASS, cites `DESIGN_PROOF_TOKEN` Section 2 (`singleUse: true`, ~300s `expiresAt`); `#2-field-schema-v1` resolves; no token field schema restated |
| Named daemon-scheduler residual present | PASS, "the bundled Open Design daemon's own internal scheduler ... agent-side policy cannot freeze it" |
| Section Acceptance table present | PASS, deny / fresh-mint allow / replay allow / exempt allow / residual unenforceable |
| Evergreen: no spec/packet/phase IDs or `specs/` paths | PASS, appended-section scan clean |
| Scope: only the one named file; no other live file touched | PASS, single append to `guarded_proxy.md` |
| `validate.sh --strict` (phase folder) | PASS for all non-generated checks; see GENERATED_METADATA residual below |
| GENERATED_METADATA residual (description.json / graph-metadata.json) | EXPECTED, the orchestrator regenerates these; level/fingerprint drift is not hand-written |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Daemon-internal scheduler is a named residual, not a solved case.** The bundled Open Design daemon's own internal scheduler can fire a scheduled automation without traversing the agent-side adapter. Agent-side policy at the proxy boundary cannot freeze that path; it is named plainly rather than implied away.
2. **Prose policy contract, not running code.** The freeze is an evergreen reference section that refines the guarded-proxy precondition the downstream enforcement spine consumes. It ships no `automationBinding` data structure and no executed two-phase validator, and claims none.
3. **Escape path B depends on a faithful fire-time replay check.** The contract bounds a pre-authorization to an exact replay inside its review window and run budget; an enforcement consumer that fails to re-derive the subject/payload digests would not catch drift. The contract specifies the check; it does not itself execute it.
4. **No taste claim.** This freezes the automation surface at the agent/proxy boundary; it does not certify the design quality of anything Open Design produces.

<!-- /ANCHOR:limitations -->

---

<!--
LEVEL 2 IMPLEMENTATION SUMMARY
- Core + Level 2 verification focus
- Automation Freeze: a design-affecting Open Design automation is DENIED by default because the proof token is single-use + ~300s TTL; two escape paths (per-execution fresh-mint, named pre-authorized replay) + a read-only exemption
- Prose policy contract appended to guarded_proxy.md (+25/-0); DESIGN_PROOF_TOKEN Section 2 cited (no second schema); daemon-internal scheduler named as the residual; GENERATED_METADATA regenerated by the orchestrator; no taste claim
-->
