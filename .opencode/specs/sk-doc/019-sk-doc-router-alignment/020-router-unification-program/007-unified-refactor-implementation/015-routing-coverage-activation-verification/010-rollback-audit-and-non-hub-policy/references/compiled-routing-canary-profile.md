# Compiled-Routing P2 Canary — Profile, Owner, Window, Thresholds & Rollback Trigger

> **Contract (REQ-006 / CF-ACT-11, canary half).** Names the P2 canary's profile,
> promotion-owner role, observation window, pass/fail thresholds, and rollback trigger,
> so the staged cutover (`011-activation-cutover-p4`) has a concrete, findable contract
> to execute against. **This child does not run the canary** — it only names it.
> Satisfies the open `012-default-on-decision/checklist.md:66` CHK-004 (informational
> cross-reference; this child edits none of `012`'s files).

## Canary profile

The exact environment / flag-state combination under observation:

| Dimension | Value |
|-----------|-------|
| Flag | `SPECKIT_COMPILED_ROUTING=1` (default-off elsewhere; set only for the canary invocation). |
| Cohort | Exactly **one** hub in the default-on cohort at a time (single-hub canary), that hub `servingAuthority: compiled`; the other six stay `legacy`. |
| Recommended first hub | The lowest-blast hub by traffic (operator selects; a natural first pick is a hub whose mis-route is cheap to detect and cheap to reverse). |
| Frozen inputs | The three pinned scorer digests unchanged throughout (`router-replay.cjs`, `score-skill-benchmark.cjs`, `load-playbook-scenarios.cjs`). |
| Reversibility | `flip-serving.cjs --hub <id> --rollback` restores the byte-identical pre-flip manifest at any time; `activate-hub.cjs --hub <id> --rollback` reverts the binding if needed after the serving flip is first rolled back. |

## Promotion owner (role — operator-fill placeholder)

- **Role:** Router Cutover Owner — accountable for promoting the canary hub to steady
  default-on, or triggering rollback.
- **Named owner:** `<OPERATOR: assign a named promotion owner>` — **intentionally a
  placeholder.** This child has no authority to name a human owner and does not fabricate
  one; filling this is an operator decision (spec.md §7).

## Observation window

- **Minimum:** the longer of **72 hours** of live traffic **or** **200 routed prompts**
  through the canary hub.
- **Extend** the window (do not shorten it) if traffic is too low to reach 200 routed
  prompts within 72 hours.
- Promotion decision is taken **only after** the window closes with all thresholds green.

## Pass / fail thresholds

All must hold for the whole window to pass:

| Threshold | Pass condition |
|-----------|----------------|
| Parity | Compiled routing is **byte-identical to legacy** on every route-gold scenario for the hub (`compiled == legacy`, zero divergences). |
| Mis-routes | **Zero P0 mis-routes** (a prompt the legacy path routes correctly that the compiled path sends elsewhere). |
| Defer rate | Compiled `defer` rate within **±2 percentage points** of the hub's shadow-baseline defer rate (a sudden defer spike signals detector drift). |
| Canary harness | The hub's `validate-canary.cjs` stays **green** for the whole window. |
| Frozen scorer | The three pinned scorer digests are **unchanged** at every check. |
| Audit | Every flip/rollback in the window is present in the hub's append-only `flip-history.jsonl`. |

> The ±2pp defer-rate band and the 72h/200-prompt window are proposed defaults for
> `011` to adopt or tune with real baseline numbers; the parity / zero-P0 / frozen-scorer
> thresholds are hard and not tunable.

## Rollback trigger

Trigger an **immediate** rollback (`flip-serving.cjs --hub <id> --rollback`) on **any**
of:

- Any parity divergence (`compiled != legacy`) on any route-gold scenario.
- Any P0 mis-route observed in live traffic.
- Any drift in a frozen scorer digest.
- The canary harness going red.
- Defer rate outside the ±2pp band beyond a single transient check.

After a rollback, the event is captured in `flip-history.jsonl` (`serving-rollback`,
`direction: rollback`), the hub returns to `legacy`, and promotion does not proceed until
the divergence is root-caused.

## Cross-references (informational — this child edits none of these)

- `012-default-on-decision/checklist.md:66` CHK-004 — the sibling item this contract
  satisfies.
- `011-activation-cutover-p4` — the owner/executor of the actual staged canary run.
- `spec.md` REQ-006 / SC-006 and this packet's `checklist.md` CHK-033.
