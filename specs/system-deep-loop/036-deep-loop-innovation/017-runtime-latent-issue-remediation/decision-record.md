---
title: "Decision Record: System-Deep-Loop Runtime Latent-Issue Remediation"
description: "The architecture decisions behind the 016-audit remediation: verify-then-fix fan-out, scoping the gateway fail-closed to real refresh failures, keeping ledger-bypass detection opt-in and advisory, gating the budget cap on guaranteed spend, and the misplaced-edits recovery."
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/017-runtime-latent-issue-remediation"
    last_updated_at: "2026-08-26T06:00:00Z"
    last_updated_by: "claude"
    recent_action: "Recorded the remediation's key architecture decisions"
    next_safe_action: "Finalize the packet docs and validate --strict"
trigger_phrases: []
---
# Decision Record: System-Deep-Loop Runtime Latent-Issue Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Verify-then-fix fan-out over blind application

**Status**: Accepted

**Context**: The 016 audit produced ~44 candidate findings (P0 + P1 + co-located P2). Many were leaf-reported hypotheses, not confirmed defects. Applying all of them blindly would have shipped fixes for false positives into shipped runtime.

**Decision**: Partition the findings into eight disjoint-file workstreams and have each Sonnet-5 (xhigh) agent VERIFY its findings against current source before fixing, recording false positives instead of patching them. The conductor then re-verifies every diff against source and the failing symptom.

**Consequences**: 32 findings confirmed, 11 ruled false-positive, 1 uncertain; 27 fixed, 17 deliberately not fixed. The false-positive filter (e.g. F-030 full-replay is the documented safety model, F-031 no legacy format exists for other modes) prevented harmful edits. Every load-bearing fix carries a fail-before/pass-after test.

<!-- /ANCHOR:adr-001 -->
---

<!-- ANCHOR:adr-002 -->
## ADR-002: The gateway fails closed only on an attempted-and-failed projection refresh

**Status**: Accepted

**Context**: The P0 (F-029) was that the append gateway returned `ok:true` even when the projection refresh failed, so the ledger advanced while the legacy projection went stale, silently. The first fix failed closed on ANY `projectionRefreshed === false` — but that flag is also false in benign states where no refresh was attempted (no declared boundary, or a pre-flight config gap such as an unregistered contract or an event-registry digest mismatch). That broke every append test whose harness uses a fixture registry.

**Decision**: Track whether the projection engine was actually invoked (`projectionAttempted`). Fail closed (`ok:false`, `PROJECTION_FAILED`, exit 2) only when a refresh was attempted and did not succeed; a config gap that never reached the engine stays a durable `ok:true` with the reason surfaced. Preserve the append receipt on the error outcome so callers can tell "durable write, stale projection" from "rejected write".

**Consequences**: The real divergence case (engine ran and failed) fails closed and the prompt-pack halt fires; benign pre-flight states do not. Gateway suite green.

<!-- /ANCHOR:adr-002 -->
---

<!-- ANCHOR:adr-003 -->
## ADR-003: A default-on structural ledger-backing gate (operator chose option C)

**Status**: Accepted

**Context**: The operator observed a recent research run whose leaf wrote the state-log projection directly, bypassing the append gateway, so the mode ledger held zero iteration events while the projection looked complete — and nothing flagged it. The deep-loop modes are in `new_authoritative_final` authority (legacy shadow writer dropped), so a direct write is a genuine bypass. Investigation showed the watermark check (`check-direct-append`) resolves its path from the packet root, which does not match the lineage-rooted layout research uses, so a watermark-based gate would false-alarm on research. The mode ledger (`{leaf}-ledger`), by contrast, is created by the gateway at its run directory and is unambiguously absent on a bypass.

**Decision**: Three layers, the operator having chosen the strongest (option C). (1) Always-on prevention: the deep-research/review/alignment prompt-packs state unambiguously that the gateway call is REQUIRED and in-scope and that the "don't run tooling" guidance does not exempt it — killing the exact rationalization the leaf used. (2) Structural gate (C): `verify-iteration` fails an iteration when, under ledger authority, the projection shows a complete iteration but no `{leaf}-ledger` frames back it — checked at both the artifact dir and its parent to survive the lineage-vs-packet path split. Default-on and fatal, with an emergency kill-switch `DEEP_LOOP_LEDGER_BACKING_GATE=0`. (3) The opt-in watermark advisory (`DEEP_LOOP_VERIFY_GATEWAY_RECEIPT=1`) is retained as an additional non-fatal signal.

**Consequences**: The reported incident now fails loudly by default (a projection-only report can no longer look complete), overriding the fixer's by-design ruling on F-015 at the verify-iteration boundary. Residual risk: any legitimate final-authority flow that does not create a `{leaf}-ledger` will fail until it does; the kill-switch makes this reversible, and tests that exercise verify-iteration's other checks disable the gate explicitly. The reducer itself still reads the projection (F-015 unchanged internally); the gate catches the divergence at the iteration boundary instead.

<!-- /ANCHOR:adr-003 -->
---

<!-- ANCHOR:adr-004 -->
## ADR-004: The pre-dispatch budget cap gates on guaranteed base spend, not the worst-case retry ladder

**Status**: Accepted

**Context**: The cap counted the full retry ladder (`iterations × cost × total_attempts`) as guaranteed spend, so a legitimate long config (e.g. a 20-iteration lineage with the default retries) was unlaunchable before a single attempt ran.

**Decision**: Gate the pre-dispatch cap on `base_cost_units` (one attempt, no retries — the guaranteed spend). Keep `estimated_cost_units` (worst-case) for logging/visibility. Retries are contingency that fires only on failure, not a certainty.

**Consequences**: Legitimate long configs launch; a lineage whose guaranteed single-attempt spend exceeds the cap is still rejected. The pool tests cover both directions; the cli-codex adapter test was updated to assert over-budget-by-base rejection.

<!-- /ANCHOR:adr-004 -->
---

<!-- ANCHOR:adr-005 -->
## ADR-005: Misplaced fan-out edits were recovered by patch-transfer, not re-run

**Status**: Accepted

**Context**: Six of the eight fan-out agents resolved their relative file paths against the main checkout (`Public/.opencode/…`) instead of this worktree, so their edits landed in the wrong tree. The two others (gateway, containment) hit the worktree correctly.

**Decision**: Rather than re-run the fan-out (nondeterministic, wasteful), confirm the committed bases were byte-identical between the two trees, capture the six workstreams' changes as a patch plus the one new untracked test, apply them to the worktree, and restore the main checkout to clean.

**Consequences**: All 34 edits + 1 new test consolidated in the worktree with no loss; the main checkout was returned to its prior clean state. A future fan-out over shipped files should pin agent cwd or pass absolute paths to prevent the split.

<!-- /ANCHOR:adr-005 -->
