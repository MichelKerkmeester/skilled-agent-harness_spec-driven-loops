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
    recent_action: "Live-verified: hooks never fire under devin -p; adapters built dormant"
    next_safe_action: "Re-run the probe methodology if the installed devin version ever changes"
    blockers: ["No headless -p attachment point for hooks exists in devin 3000.2.17"]
    key_files: ["spec.md", "plan.md", "../../../../.opencode/skills/system-spec-kit/mcp-server/hooks/devin/README.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-devin-revival-authoring", parent_session_id: null }
    completion_pct: 100
    open_questions: ["Does hook firing work in true interactive mode (untestable from this environment, no TTY)?"]
    answered_questions: ["read_config_from.claude fidelity became moot: hooks.v1.json/config.json hooks key are never read at all under -p.", "Operator directed committing .devin/hooks.v1.json anyway, mirroring .codex/hooks.json's tracked precedent, despite confirmed dormancy."]
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

**Revision (2026-07-24) -- the deeper finding this ADR did not anticipate**: `read_config_from.claude`'s fidelity turned out to be the SMALLER unknown. Live-probing the installed `devin 3000.2.17` binary (temporary uncommitted `.devin/hooks.v1.json` + a real dispatched tool call, mirroring the exact methodology `cli-cursor`'s phase 004 used) found that **`.devin/hooks.v1.json` and `.devin/config.json`'s `"hooks"` key are never consulted at all under `devin -p`** -- confirmed via zero probe firings across `SessionStart`/`UserPromptSubmit`/`PreToolUse`/`Stop`, and via deliberately malformed hook JSON producing zero parse errors (proof the file isn't read, not merely ignored once read). `--agent-config`'s own strict parser separately confirmed `hooks` is not a valid field in that schema (`unknown field 'hooks'`). No headless/dispatched attachment point for Devin's hook system exists in this build -- and `-p` is the only mode any dispatcher, including this repo's own `cli-devin` executor, would ever use. True interactive mode was not testable from this environment (no TTY) and remains the one unconfirmed gap. The operator chose to build the adapters anyway, explicitly marked dormant, so the code is ready the moment a future `devin` build adds `-p` hook support -- not to claim coverage that does not exist today.
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
- The 2 in-scope guard hooks (`SessionStart` lifecycle prime, `UserPromptSubmit` Gate-3 classify) exist as ready, typechecked, directly-invocation-verified code the moment Devin ships `-p` hook support -- no adapter work needed at that point, only registration.
- The adapter strategy rests on a precedent already proven live for `cli-codex`, and the code is byte-identical in shape to that proven pattern.

**What it costs**:
- Zero live coverage today: unlike `cli-codex`/`cli-cursor`, these adapters cannot be claimed to close any enforcement blind spot right now, because no dispatched Devin session can trigger them. This is not a maintenance cost, it is a confirmed, documented capability gap.

**Risks**:

| Risk | Impact | Mitigation |
|---|---|---|
| `-p` hook support is added in a future `devin` build but this dormant status is never re-checked, so the adapters ship silently believing they're still dead code | M | Re-verification trigger recorded in both README.md files (`mcp-server/hooks/devin/`, `runtime/hooks/devin/`); re-run the exact probe methodology whenever the installed `devin` version changes, since `.devin/hooks.v1.json` is already committed and would silently start working with no prompt to re-verify |
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
| 3 | **Sufficient?** | PASS (revised) | Hand-built adapters for the two proven-first events (`SessionStart`, `UserPromptSubmit`) are built, typechecked, and directly-invocation-verified -- sufficient as ready code. They do NOT close a live enforcement gap today: confirmed no `-p`-mode attachment point exists in this `devin` build. Honestly labeled dormant, not overstated. |
| 4 | **Fits Goal?** | PASS | Matches the `cli-codex` precedent exactly - the same adapter shape, the same neutral cores, the same fail-open discipline, the same `hookSpecificOutput` envelope. |
| 5 | **Open Horizons?** | PASS | Re-evaluate this whole dormant status (not just `read_config_from.claude`) once a devin build documents `-p` hook support, or once interactive mode is confirmed to fire hooks where `-p` does not. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `system-spec-kit/mcp-server/hooks/devin/` created: `shared.ts`, `session-start.ts`, `user-prompt-submit.ts`, `README.md` -- built, typechecked (`tsc --noEmit` 0 errors), compiled, directly-invocation-verified. Dormant (see README.md §2).
- `system-spec-kit/runtime/hooks/devin/` created: `spec-gate-classify.mjs`, `README.md` -- built, directly-invocation-verified. Dormant. `spec-gate-enforce.mjs` is NOT created here; it belongs to phase 008.
- `.devin/hooks.v1.json` **committed 2026-07-24 per operator direction**, mirroring `.codex/hooks.json`'s real, tracked precedent, registering both adapters. Confirmed dormant under `-p` dispatch, same as the adapters themselves - not a claim of active coverage, just the wiring ready for a future build.

**How to roll back**: Delete `hooks/devin/`, `runtime/hooks/devin/`, and `.devin/hooks.v1.json`. The neutral cores (`hooks/claude/**`, `runtime/lib/spec-gate/**`) were never modified, so no reversal is needed there - confirm with `git diff` showing no changes to those paths.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---
