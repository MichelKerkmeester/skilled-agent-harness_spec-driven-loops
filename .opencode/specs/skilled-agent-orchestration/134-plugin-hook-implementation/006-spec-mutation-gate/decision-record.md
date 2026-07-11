---
title: "Decision Record: Spec Mutation Gate [template:level_3/decision-record.md]"
description: "ADRs for the runtime Gate-3 spec-mutation guard: the ESM core-plus-two-adapters boundary, and the advisory-by-default, deny opt-in, fail-open posture."
trigger_phrases:
  - "spec mutation gate decisions"
  - "esm core two adapters"
  - "mk-spec-gate-enforce posture"
  - "fail open kill switch"
  - "gate 3 adr"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/134-plugin-hook-implementation/006-spec-mutation-gate"
    last_updated_at: "2026-07-11T06:21:17.844Z"
    last_updated_by: "spec-author"
    recent_action: "Authored two ADRs for the core-plus-adapters boundary and the fail-open enforce posture"
    next_safe_action: "Confirm ADR-001 file-format choice (compiled TS vs standalone .mjs) before implementation"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/006-spec-mutation-gate"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Decision Record: Spec Mutation Gate

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Runtime-neutral ESM core plus two thin adapters

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-07-11 |
| **Deciders** | Framework owner, spec-author |

---

<!-- ANCHOR:adr-001-context -->
### Context

The guard runs in two runtimes and must reuse the ESM gate-3-classifier without duplicating policy. We chose between one runtime-neutral core plus thin adapters and two runtime-specific implementations, because two copies of classify and enforce logic would drift and double the test surface. The classifier is compiled ESM (`shared/package.json:5 "type":"module"`), so the language of the core is not a free choice.

### Constraints

- The core must statically import `classifyPrompt` and `validateSpecFolderBinding` from the ESM classifier.
- OpenCode `tool.execute.before` exposes no user prompt, so classify and enforce cannot share one hook; the core must serve both surfaces from a single module.
- The deep-loop exemplar core is `.cjs` and its Claude hook uses `require()`; that shape cannot statically import an ESM module.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: One ESM policy core (`classifyIntent`, `evaluateMutation`) plus two thin adapters, one per runtime.

**How it works**: The core holds all classify, answer-parse, and enforce logic and writes no transport. The OpenCode plugin and the Claude hooks call the core and translate its decision into each runtime's contract. We author the core and hooks as TypeScript compiled to `dist/.js`, matching the existing `user-prompt-submit.ts` shim that `.claude/settings.json` already runs from `dist`.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **ESM core plus two thin adapters** | Single policy owner, one test surface, imports the ESM classifier directly | Needs a compiled-dist step for TS | 9/10 |
| Copy the deep-loop `.cjs` core plus `require()` shape | Familiar exemplar, no build step | A static `require()` of the ESM classifier fails at runtime | 3/10 |
| Two runtime-specific implementations, no shared core | No cross-tree import | Policy drift, double the tests, two places to fix `answerParse` | 2/10 |

**Why this one**: One ESM core is the only option that reuses the ESM classifier cleanly and keeps classify and enforce policy in a single tested place.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- One module owns classify and enforce; a fix to `answerParse` lands once.
- The adapters stay thin, so each runtime wiring is auditable at a glance.

**What it costs**:
- The core and hooks need a compiled-dist build step. Mitigation: reuse the existing `mcp_server` TS-to-dist wiring that the UPS shim already depends on.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Someone copies the `.cjs` `require()` shape and breaks the import | M | ADR records the ESM requirement; code comment states the asymmetry |
| Cross-tree import from `.opencode/plugins` into `mcp_server/dist` breaks on a path change | L | Follow the established `mk-deep-loop-guard.js` cross-tree import precedent |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Two runtimes must share one classifier and one policy; a core is the only non-duplicating way |
| 2 | **Beyond Local Maxima?** | PASS | Rejected the `.cjs` copy and the two-implementation options with reasons |
| 3 | **Sufficient?** | PASS | One core plus two thin adapters covers both surfaces with no extra layer |
| 4 | **Fits Goal?** | PASS | The core is the critical-path component the whole phase depends on |
| 5 | **Open Horizons?** | PASS | A neutral core admits a third runtime later with a new thin adapter only |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- New `mcp_server/lib/spec-gate/spec-gate-core.ts` compiled to `dist/lib/spec-gate/spec-gate-core.js`.
- New `mk-spec-gate.js` plugin and two Claude hooks that call the core.

**How to roll back**: Delete the plugin and the two Claude hook files, remove the `.claude/settings.json` entries, and delete the compiled core under `dist/lib/spec-gate/`. The shared classifier is untouched, so nothing else regresses.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

## ADR-002: Advisory by default, deny opt-in, fail-open everywhere

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-07-11 |
| **Deciders** | Framework owner, spec-author |

---

### Context

Enforce sits on the Write/Edit hot path, the busiest surface in agent work, so this is the highest-blast decision in the packet. We chose the default posture and the failure posture together, because a guard that denies by default or fails closed would stall correctly-scoped work the moment it has a bug. The classifier has gpt-only corroboration and `answerParse` is new logic with an unmeasured false-positive rate, so shipping deny on by default would gamble on untested behavior.

### Constraints

- A false deny stalls every task; a persistence failure that fails closed does the same.
- `answerParse` false positives close the gate without a real binding, so the enforce flip must wait on a measured rate.
- The framework exempts tiny edits by size, which is undetectable at hook time with no diff.

### Decision

**We chose**: Classify and advise by default, deny only when `MK_SPEC_GATE_ENFORCE=1`, and fail open on every error path.

**How it works**: With the env unset, the guard classifies, surfaces the Gate-3 question, and never denies, the same stance as `MK_DEEP_LOOP_GUARD_REJECT` when off. With the env set, deny fires only for the deterministic all-true predicate (Write or Edit, gate open, no bound folder, real in-repo source file). Bash stays advise-only. Any unreadable state, classifier throw, unresolvable root, or unexpected arg shape returns allow with no side effects. A path-class exemption (spec tree, /tmp, dist, node_modules, .git, out-of-repo) substitutes for the size exemption.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Advisory default, deny opt-in, fail-open** | Zero deny risk at rollout, reversible by one env var, safe under bugs | Tiny source edits still prompt once per session | 9/10 |
| Deny by default | Enforces the rule immediately | A single false deny or `answerParse` miss stalls all work; gpt-only corroboration | 2/10 |
| Fail-closed persistence (mk-goal shape) | Stronger guarantee that state is trusted | A state write failure blocks file writes, the exact harm we must avoid | 2/10 |

**Why this one**: It enforces the constitution's most-cited rule while guaranteeing that a bug in the new guard never blocks a correctly-scoped write.

### Consequences

**What improves**:
- Rollout carries zero deny risk; classify-only surfaces the question and measures `answerParse` first.
- The feature is reversible in one step by unsetting the env var.

**What it costs**:
- Tiny edits to real source still prompt once per session. Mitigation: one answer covers the whole session, so the cost is a single prompt.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| `answerParse` false positive closes the gate without a real binding | M | Corpus-measured rate gates the enforce flip; `answerParse` runs only when status is open |
| Operators leave enforce off forever and the rule stays advisory | L | Rollout plan sets a measured threshold (SC-003) as the flip trigger |

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The hot path demands a posture that cannot stall correctly-scoped work |
| 2 | **Beyond Local Maxima?** | PASS | Rejected deny-by-default and fail-closed with concrete stall scenarios |
| 3 | **Sufficient?** | PASS | Opt-in deny plus fail-open plus path-class exemption covers the blast radius |
| 4 | **Fits Goal?** | PASS | Enforces Gate 3 while honoring the fail-open safety rule |
| 5 | **Open Horizons?** | PASS | The env flip and measured threshold leave a clear path to full enforcement |

**Checks Summary**: 5/5 PASS

### Implementation

**What changes**:
- `evaluateMutation()` reads `MK_SPEC_GATE_ENFORCE` and returns deny only for the all-true predicate.
- Every core and adapter entry point wraps its body fail-open.

**How to roll back**: Unset `MK_SPEC_GATE_ENFORCE` for an instant no-op; classify stays observe-only and no writes are blocked.

---

<!--
Level 3 Decision Record (Addendum): One ADR per major decision.
Write in human voice: active, direct, specific. No em dashes, no hedging.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
