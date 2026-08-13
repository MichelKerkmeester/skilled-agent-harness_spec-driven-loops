# Frontier Cutover Execution Plan

> Reversible execution plan for moving canonical authority from the legacy writers to the new dark spine. **This document plans; it flips nothing.** Every authority move, legacy deletion, and merge below is an irreversible/outward-facing step that stops for an explicit operator go-ahead. Grounded in the built runtime (candidate `c42ed8fa28`) and the phase-014/015/016/017 contracts. Derived after the round-4d independent review returned APPROVE with 0 open P0.

---

## 1. Where we are (preconditions, all confirmed)

- **Candidate `c42ed8fa28`**, branch `system-deep-loop/0144-036-p0-remediation`, **3 commits ahead of origin, unpushed. Nothing on `skilled/v4` or `main`.**
- **Independent verdict:** GPT-5.6-SOL (high, read-only) → `APPROVE — 0 open P0`. F2 (branded + canonical-pinned commit guard) and F7 (atomic exclusive frame publish) both DISCHARGED; F1/F3/F4/F5/F6/F8/F10 no-regression; new-defect scan none.
- **Authority is still legacy.** Every mode is `state: legacy_authoritative` / `selectedWriter: 'dark'`. The ledger + gateway + guard record in parallel but are **not authoritative** for any mode. No loop is served by the new spine yet.
- The one program rule holds: **additive-dark until parity.** Authority moves in exactly one phase (014), one mode at a time, behind a monitored rollback window; legacy writers are deleted last (015), only after zero-use telemetry.

## 2. Scope reality check — 4 modes, not 8 (needs operator confirmation)

The goal prompt referenced "8 mode cutovers." The **built** authority domain is a single `deep-improvement` domain with **4 modes** (`.opencode/skills/system-deep-loop/runtime/lib/per-mode-authority-flip/authority-dependency-graph.ts`):

```
deep-improvement-common  →  agent-improvement
                         →  model-benchmark
                         →  skill-benchmark
```

`deep-improvement-common` is the provider dependency for the other three (required edges `common->agent-improvement`, `common->model-benchmark`, `common->skill-benchmark`). There is **no second authority domain** in the runtime. The other deep-loop modes (deep-research, deep-review, deep-alignment, ai-council) are **not** part of the built authority cutover.

> **OPEN DECISION 1 (operator):** is the frontier the 4-mode deep-improvement domain as built, or did "8" mean a second authority domain (research/review/alignment/council) that is out of scope for 036 and belongs to a future packet? The plan below assumes the 4-mode built domain.

## 3. The cutover sequence (per-mode, dependency-ordered)

**Order is forced by the dependency graph:** `deep-improvement-common` **first** (it is the provider), then the three consumers. Among the three consumers the order is free unless the 012 write-set conflict graph serializes them; default is one-at-a-time.

```
1. deep-improvement-common   (first flip — provider; unblocks the rest)
2. agent-improvement
3. model-benchmark
4. skill-benchmark
```

## 4. What "wire dark → live" means (per mode, precise)

The ledger already records dark. A cutover does **not** rewrite the loop; it changes which writer is authoritative for one mode. Per mode, in order:

1. **Shadow-parity proof** (phase 008/003): the dark path reproduces legacy behaviour for that mode against the 003 baseline — by ID + semantics, not count. No flip without it.
2. **Rollback drill** (phase 008/005): an executable drill proves the flip is reversible before it happens.
3. **Cutover certificate** (phase 014/003): the evidence bundle that authorizes the flip — every evidence envelope re-verified through the provider registry (F8), signals resolved through registered providers (F4). A fabricated/empty-signal certificate cannot authorize.
4. **The flip transaction** (phase 014/002): a single authority-transition event appended through the fenced, gateway-authorized seam (`appendAuthorityTransitionEvent` → `appendAuthorizedThroughFence` → `#appendAuthorized`), validated in-lock by the **canonical-pinned branded commit guard** (F2). It moves that mode from `legacy_authoritative` to `new_authoritative_reversible` and points `selectedWriter` at the spine. The other modes stay legacy.
5. **Monitored rollback window opens** (phase 014/003): the flip stays reversible for at least **14 calendar days AND 5 successful executions** (`ROLLBACK_WINDOW_MINIMUM_CALENDAR_DAYS = 14`, `ROLLBACK_WINDOW_MINIMUM_SUCCESSFUL_EXECUTIONS = 5`). Health signals and execution receipts are monitored throughout.

Only when a mode's window closes clean does it advance from `new_authoritative_reversible` to `new_authoritative_final`.

## 5. Abort / rollback criteria (inside the window)

While any mode's window is open, the flip is reversible. Trigger a rollback if, for that mode:

- shadow parity diverges after the flip, or
- a monitored health signal breaches, or a required execution receipt is missing/unverified, or
- fewer than 5 successful executions accrue, or a manual abort is called.

**Rollback mechanism:** a rollback authority-transition returns the mode (and its active dependent closure) to `legacy_authoritative`. Because `deep-improvement-common` is the provider, rolling it back requires its dependents to already be legacy (dependency-graph closure — the F1 rollback-closure rule the canonical guard enforces). **Legacy writers are still present** (not deleted until 015), so rollback restores the prior authoritative path with no data reconstruction.

## 6. Point of no easy return (later, separately gated)

- **015 — legacy-writer retirement.** Delete the legacy writers **only after** each mode's window has closed final, zero-use telemetry confirms no caller still writes the legacy path, and archival-read evidence exists. After deletion, rollback is no longer a simple authority flip — it needs a restore. **This is a second operator go-ahead.**
- **016 — whole-system gate (Stage B).** Freeze the exact SHA, run every mode + cross-system parity gate, mixed-version replay, crash recovery, counterfactual adjudication, degeneration health, and obtain a blocking SOL review.
- **017 — integrate-latest + closeout**, then **merge to `main`.** The final outward-facing step. **Third operator go-ahead.**

## 7. Reversibility ledger

| Stage | To undo |
|-------|---------|
| Current (nothing flipped) | Delete the local branch / `git reset`. Live system untouched. |
| A mode flipped, window open | Rollback authority-transition → `legacy_authoritative`; legacy writers intact. |
| A mode window closed final, legacy NOT yet deleted | Re-flip legacy authoritative via a new transition; still no data loss. |
| Legacy deleted (015) | Restore from archival-read evidence; no longer a simple flip. |
| Merged to main (017) | Revert commit / release rollback; outward-facing. |

## 8. What I will NOT do without an explicit, in-the-moment go-ahead

- Append any authority-transition (flip) event for any mode.
- Delete or retire any legacy writer (015).
- Push the branch, land on `skilled/v4`, or merge to `main`.
- Wire the spine authoritative into the live loop-host.

## 9. Open decisions for the operator

1. **Scope:** 4-mode built domain vs an intended 8 (see §2).
2. **First-flip trigger:** what real-world evidence authorizes flipping `deep-improvement-common` — is the built shadow-parity + rollback-drill sufficient, or do you want a live soak period first?
3. **Window length:** keep the 14-day / 5-execution minimum, or a longer window for the provider mode?
4. **Certificate authority:** who signs/authorizes each cutover certificate (operator vs an automated gate)?
5. **Push now?** You chose "keep local"; revisit if you want an origin backup before any flip.

---

*Status: PLAN ONLY. No mode has flipped. Legacy remains authoritative. Awaiting operator decisions in §9 before any step in §6–§8.*
