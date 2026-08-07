---
title: "Decision Record: Devin hook adapter layer"
description: "ADR-001: hook adapter strategy for the Devin hook adapter layer - hand-built adapters vs. native read_config_from.claude import vs. hybrid."
trigger_phrases: ["devin hook adapter decision record", "read_config_from.claude decision"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/029-cli-devin-revival/004-devin-hook-adapter-layer"
    last_updated_at: "2026-07-24T16:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Corrected ADR outcome after documented-schema live firings"
    next_safe_action: "Retain the original negative experiment as superseded evidence"
    blockers: []
    key_files: ["spec.md", "plan.md", "../../../../.opencode/skills/system-spec-kit/mcp-server/hooks/devin/README.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-devin-revival-authoring", parent_session_id: null }
    completion_pct: 100
    open_questions: ["Do PermissionRequest and PostCompaction fire when those events occur?"]
    answered_questions: ["The project hooks.v1.json is read under devin -p when it uses top-level event arrays with nested matcher groups.", "The unsupported wrapper schema caused the earlier zero-firing result."]
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Devin hook adapter layer

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Hook adapter strategy: hand-built adapters vs. native `read_config_from.claude` import vs. hybrid

### Metadata

| Field | Value |
|---|---|
| **Status** | Accepted (revised 2026-07-24) |
| **Date** | 2026-07-23 (revised 2026-07-24) |
| **Deciders** | claude-code (authoring), operator (approval) |

---

<!-- ANCHOR:adr-001-context -->
### Context

This repo enforces its scope-lock and quality discipline through 7 guard hooks. `cli-codex` already gets these hooks firing correctly via thin per-CLI adapters at `system-spec-kit/mcp-server/hooks/codex/` (confirmed live: `session-start.ts`, `user-prompt-submit.ts`, `session-stop.ts`, `compact-inject.ts`, `completion-evidence-stop.cjs`, `shared.ts`, `README.md`) plus runtime-neutral gate wiring at `system-spec-kit/runtime/hooks/codex/`. `cli-devin` needs the same coverage, but Devin's own project-level config supports a `read_config_from: {"cursor": true, "windsurf": true, "claude": true}` boolean map (confirmed via `docs.devin.ai/cli/reference/configuration/config-file.md`) that natively imports config from a `.claude/` directory.

We needed to choose between building the adapter layer by hand, mirroring the codex pattern, or relying on Devin's native import to cover part or all of the same ground, because the two approaches have very different maintenance profiles going forward.

### Constraints

- Devin's documentation confirms `read_config_from.claude` exists and imports from `.claude/`, but does **not** confirm whether it ingests Claude Code's own hooks (under the `hooks` key in `.claude/settings.json`) in the same schema `.devin/hooks.v1.json` expects, or only simpler rules/instructions-style context.
- The `cli-codex` hand-built adapter pattern is proven working today - 7 files, live-registered in `.codex/hooks.json`, delegating to the same neutral cores this ADR would reuse.
- Any adapter strategy must keep the runtime-neutral hook cores (`hooks/claude/*.ts`, `runtime/lib/spec-gate/spec-gate-core.mjs`) unmodified - both `cli-codex` and `cli-devin` are meant to be additional consumers of those cores, not forks of them.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Start with hand-built thin adapters for Devin, mirroring the proven `cli-codex` pattern exactly, rather than relying on `read_config_from.claude`'s unverified import fidelity.

**How it works**: `hooks/devin/shared.ts` reads and validates each Devin hook payload, spawns the matching compiled `hooks/claude/*.js` adapter (the same neutral core `cli-codex` already delegates to), and translates the result into Devin's documented `hookSpecificOutput` response envelope. `runtime/hooks/devin/spec-gate-classify.mjs` wires the same way into `spec-gate-core.mjs` for `UserPromptSubmit`. `spec-gate-enforce.mjs` (`PreToolUse`, mapping Devin's tool-call vocabulary onto the core's `bash`/`write`/`edit` vocabulary) is NOT built in this phase -- it belongs to phase 008 alongside the other 5 remaining lifecycle events, matching this phase's own explicit "starting with SessionStart/UserPromptSubmit" scope statement, which the original Files-to-Change table's inclusion of `spec-gate-enforce.mjs` contradicted.

**Superseded revision (2026-07-24)**: The original probe observed zero firings while using an unsupported wrapper schema and incorrectly inferred that no headless attachment point existed. The malformed-JSON no-error result did not distinguish unread input from silently discarded invalid configuration.

**Correction (2026-07-25)**: Rewriting `.devin/hooks.v1.json` to the documented top-level event schema produced immediate firings under `devin -p`. `SessionStart`, `UserPromptSubmit`, `PreToolUse`, `PostToolUse`, `Stop` and `SessionEnd` were observed; adapter output reached the model. The hand-built adapter decision remains valid, but the dormancy conclusion does not.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|---|---|---|---|
| **(a) Hand-built adapters [chosen]** | Full control over payload/matcher/envelope translation; proven pattern already working for `cli-codex`; no dependency on unverified vendor behavior | More adapter code to write and maintain per event | 8/10 |
| (b) Native `read_config_from.claude` import [deferred] | Less code to write; potentially near-zero maintenance if fidelity holds | Fidelity is completely unverified from the fetched documentation - could silently import only partial rules/context instead of real hook behavior, creating a false sense of coverage | 4/10 |
| (c) Hybrid [premature] | Could combine native import for simple context with hand-built adapters only where native import falls short | Premature to design a split before knowing what native import actually covers; risks building complexity around a guess | 3/10 |

**Why this one**: Option (a) has a known-working precedent (`cli-codex`) and zero dependency on unverified vendor behavior. Option (b) could reduce future maintenance burden, but is deferred, not rejected outright, until its fidelity is confirmed. Option (c) is premature until (b)'s actual coverage is known - designing a hybrid split now would be guessing at a boundary that live verification hasn't drawn yet.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- The 2 in-scope guard hooks are typechecked, directly tested and observed live under `devin -p`.
- The adapter strategy rests on a precedent already proven live for `cli-codex`, and the code is byte-identical in shape to that proven pattern.

**What it costs**:
- The adapter layer adds runtime-specific maintenance compared with native import. Mitigation: it delegates to shared cores and keeps translation bounded.

**Risks**:

| Risk | Impact | Mitigation |
|---|---|---|
| The registration schema drifts and hooks silently stop firing | M | Validate the nested event structure and run a bounded `devin -p` smoke test after material CLI updates. |
| Interactive mode (untested from this environment) turns out to already fire hooks, meaning coverage exists today for human-run sessions specifically, and this ADR's "zero coverage" framing is too pessimistic | L | Explicitly flagged as the one unconfirmed gap; operator can test interactively and update this ADR with the result |
| `read_config_from.claude` turns out to be fully faithful, and hand-built adapters become redundant maintenance once `-p` hook support exists | L | Explicit re-evaluation trigger recorded here; not a silent abandonment of the simpler path |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|---|---|---|
| 1 | **Necessary?** | PASS | Guard hooks must fire regardless of which CLI executor is dispatched; `cli-devin` currently has no adapters, a confirmed live gap. |
| 2 | **Beyond Local Maxima?** | PASS | `read_config_from.claude` was investigated and flagged as a future simplification, not ignored - it is deferred with an explicit re-evaluation trigger, not dismissed. |
| 3 | **Sufficient?** | PASS (corrected) | Hand-built adapters for `SessionStart` and `UserPromptSubmit` are built, typechecked, directly tested and observed live. |
| 4 | **Fits Goal?** | PASS | Matches the `cli-codex` precedent exactly - the same adapter shape, the same neutral cores, the same fail-open discipline, the same `hookSpecificOutput` envelope. |
| 5 | **Open Horizons?** | PASS | Re-run a schema and live-event smoke test after material Devin CLI changes. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `system-spec-kit/mcp-server/hooks/devin/` created: `shared.ts`, `session-start.ts`, `user-prompt-submit.ts`, `README.md` - built, typechecked, compiled, directly tested and observed live.
- `system-spec-kit/runtime/hooks/devin/` created: `spec-gate-classify.mjs`, `README.md` - built, directly tested and observed live. `spec-gate-enforce.mjs` belongs to phase 008.
- `.devin/hooks.v1.json` committed and later corrected to the documented top-level event schema. Current registration is live under `devin -p`.

**How to roll back**: Delete `hooks/devin/`, `runtime/hooks/devin/`, and `.devin/hooks.v1.json`. The neutral cores (`hooks/claude/**`, `runtime/lib/spec-gate/**`) were never modified, so no reversal is needed there - confirm with `git diff` showing no changes to those paths.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---
