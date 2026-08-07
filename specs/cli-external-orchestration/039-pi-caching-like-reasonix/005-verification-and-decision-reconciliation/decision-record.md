---
title: "Decision Record: Fork-and-Split DeepSeek Caching Ownership (Supersedes 002-synthesis-and-decision's ADR-001)"
description: "Accepted ADR-001 (this file): narrowly supersede 002-synthesis-and-decision's ADR-001 build-gate closure by adopting a narrow ownership guard across pi-cache-optimizer's 6 model-specific hooks plus deep-pi for DeepSeek exclusively, accepted after live composition verification passed."
trigger_phrases:
  - "fork-and-split deepseek cache split"
  - "supersede pi caching build gate"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/039-pi-caching-like-reasonix/005-verification-and-decision-reconciliation"
    last_updated_at: "2026-08-07T11:18:45Z"
    last_updated_by: "spec-author"
    recent_action: "Composition verification passed with live evidence; status Accepted"
    next_safe_action: "Close the packet"
    blockers: []
    key_files:
      - "decision-record.md"
      - "../002-synthesis-and-decision/decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-07-cli-039-005"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Direct extension-level instrumentation (fs/process writes inside the guard functions) was attempted and produced no observable output; the cause was not conclusively diagnosed (deep-pi's own code successfully uses fs/process elsewhere, e.g. hashlines.ts, so a blanket sandboxing explanation is not fully supported — treat this as an inconclusive negative result). Composition proof instead relies on the observable pi-cache-optimizer-stats.json channel (proven reliable in phase 003) plus source-level predicate equivalence between isDeepPiOwned and isDeepPiModel."
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

<!-- SPECKIT_LEVEL: 3 -->

# Decision Record: Fork-and-Split DeepSeek Caching Ownership (Supersedes 002-synthesis-and-decision's ADR-001)

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Narrow supersession of 002-synthesis-and-decision's ADR-001 build-gate closure

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted — composition verification passed with live evidence (see Five Checks below and `checklist.md` CHK-020/021/022) |
| **Date** | 2026-08-07 |
| **Deciders** | Operator; live source investigation this session (installed `pi-cache-optimizer` v2.8.0 source, `deep-pi` source via GitHub fetch) |

---

<!-- ANCHOR:adr-001-context -->
### Context

`002-synthesis-and-decision`'s ADR-001 (2026-08-06) recorded a NO-GO on a new Reasonix-style Pi caching plugin, because the useful narrow scope already shipped as `pi-cache-optimizer`. It closed the build gate on phases 3+ and set an explicit re-entry contract: "Re-entry requires a new phase child and a superseding ADR." The operator has since stated an intention to route substantially more work through DeepSeek. Live investigation this session found:

- `pi-cache-optimizer` v2.8.0 registers 7 hooks; 6 are model-specific and run unconditionally for every provider today, DeepSeek included (only `session_shutdown` is confirmed model-agnostic cleanup). A first patch draft proposed reading `event.model`, which does not exist on any of these event types — the real model lives on `ctx.model`, confirmed against the installed source and Pi's own type definitions.
- `deep-pi` (`github.com/christopherarter/deep-pi`, Apache-2.0, derived from `jrimmer/pi-deepseek-optimized`) exists, works exclusively with DeepSeek's direct API (`deepseek-v4-flash`/`deepseek-v4-pro`), and self-gates all three of its modules (stability, storm-breaker, hashline-edits/telemetry) behind one `isDeepPiModel` check with no per-module toggles.
- This environment's own `.pi/settings.json` has `opencode/deepseek-v4-flash-free` enabled — a DeepSeek-family model on a provider other than `deepseek`. A broad "contains deepseek" guard would have left it with no optimizer at all. The corrected guard in phase 003 narrows to `provider === "deepseek"` + the two `deep-pi`-owned model ids specifically, so this model keeps `pi-cache-optimizer`.

This is not the broad greenfield "Reasonix-parity" plugin ADR-001 rejected. It's a shared ownership-guard on an already-installed package (applied across every model-specific hook, not just two), plus adoption of an already-existing, narrowly-scoped DeepSeek package.

### Constraints

- ADR-001 listed three specific revisit triggers. As the Claim Resolution below shows, none of the three applies verbatim to this work — the real premise is a changed fact (materially increased DeepSeek usage) ADR-001 never evaluated, not a fit to one of its enumerated conditions. A valid re-entry still requires that changed-fact premise to be real and load-bearing, not a stretch dressed up as one of the three triggers.
- This ADR cannot honestly move to "Accepted" until this phase's own live composition verification has run — a decision record is a documentation artifact, not a substitute for the check itself.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Supersede ADR-001's build-gate closure narrowly — adopt a forked `pi-cache-optimizer` with a narrow ownership guard across its 6 model-specific hooks (phase 003) plus `deep-pi` as the exclusive extension for `deepseek-v4-flash`/`deepseek-v4-pro` (phase 004), instead of building any new plugin from scratch.

**How it works**: Provider-partitioned ownership. `pi-cache-optimizer` keeps its proven high-hit-rate scope for every provider except the two direct-DeepSeek-API models `deep-pi` owns — including DeepSeek-family models on other providers, like `opencode/deepseek-v4-flash-free`. Neither extension is rewritten from scratch; the fork's new code is one shared predicate function plus a guard call in 6 existing hooks (11 lines added to `index.ts`, 9 lines added to its test file).
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Fork-and-split (this decision)** | Reuses two already-maintained/existing packages; a 20-line diff across 2 files; no new caching engine | Depends on live verification actually confirming zero overlap | 8/10 |
| Do nothing; let both extensions mutate DeepSeek requests | Zero effort | Confirmed double-mutation risk once DeepSeek usage increases, per this session's source investigation | 2/10 |
| Greenfield DeepSeek-specific plugin (a second attempt at what ADR-001 rejected) | Full control over feature set | ADR-001 already found this unjustified when the operator's DeepSeek usage was near zero; even with usage increasing, `deep-pi` already exists and covers the same scope | 3/10 |
| Adopt `jrimmer/pi-deepseek-optimized` directly instead of `deep-pi` | Granular per-module env-var toggles | Less refined (deep-pi explicitly fixed its risky rewind behavior and added better telemetry); kept as documented fallback, not primary path | 6/10 |

**Why this one**: It's the smallest change that resolves the real problem (DeepSeek usage increasing with no dedicated optimization, and a real double-mutation risk once one is added) without re-opening the greenfield-build question ADR-001 already closed.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- DeepSeek sessions get cache-prefix stability, retry-loop guarding, and hash-verified edits with no double-mutation risk
- Non-DeepSeek sessions (100% of current traffic) keep their proven 89% hit rate, completely unaffected

**What it costs**:
- A forked (not upstream) `pi-cache-optimizer` needs manual re-syncing if `jiangge/pi-cache-optimizer` ships a new release
- `deep-pi`'s all-or-nothing module bundle means no independent on/off control per module on DeepSeek sessions

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Fork drifts from upstream `pi-cache-optimizer` releases | M | The diff stays localized to one predicate function + 6 guard calls, so re-applying after an upstream bump is mechanical |
| `deep-pi`'s low commit count (8, via its `jrimmer` lineage) signals less battle-testing than `pi-cache-optimizer` (189 commits) | M | This phase's live composition verification is the real gate, not the commit count alone |
| Composition verification (this phase) fails | H if unmitigated | Did not occur — CHK-020/021/022 all passed live: DeepSeek-direct silent, non-DeepSeek + `opencode/deepseek-v4-flash-free` unaffected, mid-session switch clean |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Operator intends materially more DeepSeek usage; today neither extension is safe to run together on DeepSeek without the guard |
| 2 | **Beyond Local Maxima?** | PASS | Four alternatives scored, including the `jrimmer` base as a documented fallback |
| 3 | **Sufficient?** | PASS | Live composition verification passed: DeepSeek-direct session with both extensions installed showed zero `pi-cache-optimizer` stats entries; non-DeepSeek and `opencode/deepseek-v4-flash-free` sessions showed normal continued activity; a mid-session switch (DeepSeek→non-DeepSeek in one session) handed off cleanly |
| 4 | **Fits Goal?** | PASS | Delivers "best for DeepSeek, still decent elsewhere" exactly as the operator specified |
| 5 | **Open Horizons?** | PASS | `jrimmer/pi-deepseek-optimized` fallback and an upstream-contribution path both stay open |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `pi-cache-optimizer` (forked): two-line DeepSeek-exclusion guard (phase 003)
- Pi install: `@arter/deep-pi@1.0.0` added (phase 004)
- This packet's decision trail: `002-synthesis-and-decision`'s ADR-001 (NO-GO on greenfield) stands unchanged; this file's ADR-001 narrowly supersedes only its build-gate closure

**How to roll back**: Revert the Pi install source for `pi-cache-optimizer` back to `npm:pi-cache-optimizer` (phase 003's rollback plan) and uninstall `@arter/deep-pi` (phase 004's rollback plan). No data migration needed.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

## Claim Resolution Against ADR-001's Revisit Triggers

Honest accounting, per fresh review: **none of ADR-001's three original revisit triggers cleanly apply.** Forcing this decision into "closest match" against the final-wire-diagnostic trigger (an earlier draft's framing) overstated the fit — storm-breaking and hashline editing are different capabilities, and no evidence was ever gathered that they can't be contributed upstream.

| ADR-001 revisit trigger | Status |
|---|---|
| "A measured A/B baseline shows a material caching win on the real target workload that `pi-cache-optimizer` does not already deliver." | Does not apply — `pi-cache-optimizer` is not being replaced or benchmarked against; it's being scoped away from `deep-pi`'s two owned models only |
| "`pi-cache-optimizer` is found unmaintained or unsafe on the target Pi version, and no equivalent package exists." | Does not apply — `pi-cache-optimizer` stays in service, unmodified in behavior, for every provider it served before |
| "A concrete final-wire diagnostic need appears that cannot be contributed upstream." | Does not cleanly apply — no upstream-contribution attempt was made, and this isn't a diagnostic gap |

**The actual grounding premise, stated honestly**: ADR-001 was decided when the operator's DeepSeek usage was near zero, so no DeepSeek-specific optimization was worth building or adopting. The operator has since stated an intention to route **materially more work through DeepSeek**. That is a changed fact ADR-001 did not evaluate, not a fit to one of its three enumerated triggers. This decision record treats "materially increased DeepSeek usage" as the re-entry premise on its own terms, and narrows the resulting change to the smallest one that addresses it (a scoping guard plus adopting an already-existing package), consistent with ADR-001's underlying reasoning (don't build or adopt speculative capability) even though it doesn't match any single listed trigger verbatim.

## Cross-References

- **Superseded decision**: `../002-synthesis-and-decision/decision-record.md` (ADR-001)
- **Upstream evidence**: This session's live source reads of `pi-cache-optimizer` (`~/.pi/agent/npm/node_modules/pi-cache-optimizer/index.ts`) and `deep-pi` (`github.com/christopherarter/deep-pi/extensions/deeppi.ts`)
- **Implementation phases**: `../003-fork-and-guard-cache-optimizer/`, `../004-adopt-deep-pi-deepseek/`
