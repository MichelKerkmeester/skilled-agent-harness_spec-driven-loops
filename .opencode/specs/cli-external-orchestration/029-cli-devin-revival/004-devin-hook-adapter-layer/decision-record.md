---
title: "Decision Record: Devin hook adapter layer"
description: "ADR-001: hook adapter strategy for the Devin hook adapter layer - hand-built adapters vs. native read_config_from.claude import vs. hybrid."
trigger_phrases: ["devin hook adapter decision record", "read_config_from.claude decision"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/029-cli-devin-revival/004-devin-hook-adapter-layer"
    last_updated_at: "2026-07-23T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored ADR-001 recommending hand-built Devin hook adapters"
    next_safe_action: "Verify read_config_from.claude fidelity before implementation starts"
    blockers: ["read_config_from.claude fidelity is unverified from fetched documentation alone"]
    key_files: ["spec.md", "plan.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-devin-revival-authoring", parent_session_id: null }
    completion_pct: 0
    open_questions: ["Does read_config_from.claude actually ingest Claude Code's own hooks in the same schema .devin/hooks.v1.json expects, or only simpler rules/instructions-style context?"]
    answered_questions: []
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
| **Status** | Proposed |
| **Date** | 2026-07-23 |
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

**How it works**: `hooks/devin/shared.ts` reads and validates each Devin hook payload, spawns the matching compiled `hooks/claude/*.js` adapter (the same neutral core `cli-codex` already delegates to), and translates the result into Devin's documented `hookSpecificOutput` response envelope. `runtime/hooks/devin/spec-gate-classify.mjs`/`spec-gate-enforce.mjs` wire the same way into `spec-gate-core.mjs`, mapping Devin's tool-call vocabulary onto the core's `bash`/`write`/`edit` vocabulary. This phase re-evaluates `read_config_from.claude` once its actual import fidelity is verified against a live Devin session, rather than assuming it now.
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
- The 7 guard hooks fire correctly under a dispatched Devin executor, closing the same enforcement blind spot `cli-codex`'s adapter layer already closed for Codex.
- The adapter strategy rests on a precedent already proven live, not an unverified vendor import path.

**What it costs**:
- More adapter code to write and maintain than a pure native-import approach would need, if that approach turns out to be fully faithful. Mitigation: keep adapters thin (translation only, no duplicated lifecycle logic), matching the codex precedent's own design discipline, and re-evaluate `read_config_from.claude` once its fidelity is confirmed, at which point some hand-built adapters could be retired.

**Risks**:

| Risk | Impact | Mitigation |
|---|---|---|
| `read_config_from.claude` turns out to be fully faithful, and hand-built adapters become redundant maintenance | M | Explicit re-evaluation trigger recorded here; not a silent abandonment of the simpler path |
| Devin's hook JSON schema drifts from what codex's adapters assume (matcher syntax, timeout units, decision field names) | M | Live-verify every field against a real fired event before marking an adapter done, not just against docs |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|---|---|---|
| 1 | **Necessary?** | PASS | Guard hooks must fire regardless of which CLI executor is dispatched; `cli-devin` currently has no adapters, a confirmed live gap. |
| 2 | **Beyond Local Maxima?** | PASS | `read_config_from.claude` was investigated and flagged as a future simplification, not ignored - it is deferred with an explicit re-evaluation trigger, not dismissed. |
| 3 | **Sufficient?** | PASS | Hand-built adapters for the two proven-first events (`SessionStart`, `UserPromptSubmit`) are sufficient to close the immediate enforcement gap in scope for this phase. |
| 4 | **Fits Goal?** | PASS | Matches the `cli-codex` precedent exactly - the same adapter shape, the same neutral cores, the same fail-open discipline. |
| 5 | **Open Horizons?** | PASS | Re-evaluate `read_config_from.claude` once its actual import fidelity is verified at implementation time; this could reduce future maintenance burden without requiring a rewrite of the chosen approach. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `system-spec-kit/mcp-server/hooks/devin/` created: `shared.ts`, `session-start.ts`, `user-prompt-submit.ts`, `README.md` (additional adapters as later hooks are wired).
- `system-spec-kit/runtime/hooks/devin/` created: `spec-gate-classify.mjs`, `spec-gate-enforce.mjs`, `README.md`.
- `.devin/hooks.v1.json` created at the project root, registering the two wired events.

**How to roll back**: Delete `hooks/devin/`, `runtime/hooks/devin/`, and `.devin/hooks.v1.json`. The neutral cores (`hooks/claude/**`, `runtime/lib/spec-gate/**`) were never modified, so no reversal is needed there - confirm with `git diff` showing no changes to those paths.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---
