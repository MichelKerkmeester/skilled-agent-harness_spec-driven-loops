---
title: "Decision Record: Phase 13 deep-review remediation"
description: "Judgment calls and honest deferrals for the deep-review remediation packet: the deep-alignment security-boundary reconciliation (F002), the executor-contract remove-not-implement decision (F004), and the autonomous-termination deferral (F010)."
trigger_phrases:
  - "deep-alignment remediation decision record"
  - "deep-alignment security boundary deferral"
  - "deep-alignment executor contract decision"
importance_tier: "normal"
contextType: "decision"
---
# Decision Record: Phase 13 deep-review remediation

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: F002 — reconcile the read-only claim; defer a mechanical shell sandbox

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-13 |
| **Deciders** | Remediation author (deep-review Pass A finding F002, P0) |

### Context

The `@deep-alignment` LEAF advertised its read-only-by-default invariant as enforced "at the tool-permission level, not merely by convention." In reality only Write/Edit are denied at the tool level; **Bash is granted and unrestricted** (empty `bashAllowlist`, no OS sandbox), and the agent performs every state write via Bash heredoc/append. Because an audited artifact is untrusted prompt input, a malicious or mistaken instruction could use Bash to reach any path the process can — the exact boundary the mode presented as mechanically enforced. The registry compounded this by marking `mutatesWorkspace: false` for a mode whose entire write mechanism is Bash (a mutating tool).

### Decision

1. **Correct the claim to match reality** (done). The agent doc (canonical + `.claude` mirror) now distinguishes the *mechanical* boundary (no Write/Edit tool) from the *behavioral* boundary (Bash unrestricted; packet-scoping and audited-artifact read-only-ness enforced by scope gates and path-restatement discipline, not a sandbox).
2. **Fix the registry misdeclaration** (done). `mutatesWorkspace` is now `true` — the mode does mutate the workspace, through Bash. This is the honest value and matches the skill-benchmark scorer's `MUTATING_TOOLS` set (`write`/`edit`/`bash`).
3. **Defer a mechanical packet-scoped shell sandbox** (deferred, this ADR). A true sandbox — restricting Bash to the `alignment/` packet, or replacing Bash with dedicated append/create tools — is an architectural change larger than a claim-reconciliation patch and would rewrite the agent's whole state-write contract.

### Rationale for the deferral

- The agent's externalized-state design writes iteration/JSONL/delta files via Bash; removing Bash requires new append/create tools and a rewire of every write step (auto + confirm workflows, the agent contract, the reducer boundary).
- No populated `bashAllowlist` would be *real* enforcement on the live `/deep:alignment` path — that field is consulted only by the skill-benchmark scorer and the hub-structure schema check, never by the runtime that dispatches the agent. Populating it to imply a security boundary would be theater, so it stays empty and honestly documented.

### Compensating controls (in force today)

- No Write/Edit tool (mechanical): no tool-mediated edit is possible.
- Agent scope gates (Gate Rule 3): every audited-artifact path is treated read-only even when Bash could reach it; each write path is restated against the packet root first.
- Operator-gated remediation: the mode ships no remediation logic; `remediate-hook.cjs` is a no-op proof-of-entry.
- Dispatch-guard repeat protection now covers `deep-alignment` (F008), limiting off-command hand-offs.

### Follow-up

A future phase MAY implement packet-scoped shell enforcement or tool-based state writes; until then the boundary is honestly labeled as contract-enforced, not sandbox-enforced.

---

<!-- ANCHOR:adr-002 -->
## ADR-002: F004 — remove the ignored executor flags rather than implement resolution

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-13 |
| **Deciders** | Remediation author (deep-review Pass A finding F004, P1) |

### Context

The command surface advertised `--executor` / `--model` / `--reasoning-effort` / `--service-tier` flags, but both the auto and confirm workflows always dispatch the native `@deep-alignment` agent on a fixed model with no executor-resolution branch. The flags were dead.

### Decision

Remove the ignored flags from the public contract rather than implement executor resolution. The `argument-hint` (`alignment.md`) and the legacy body now advertise only `--executor-timeout` (the one honored input); the auto/confirm `user_inputs.executor` blocks document `model`/`reasoning_effort`/`service_tier`/`sandbox_mode` as reserved placeholders the workflow never reads.

### Rationale

Implementing a real executor-resolution path (as `deep-ai-council`/`deep-review` have) is a feature, not a fix, and out of scope for a remediation packet. The honest, bounded fix is a contract that only promises what the workflow does. Nothing reads the executor sub-fields, so trimming the advertised surface carries no runtime risk.

---

<!-- ANCHOR:adr-003 -->
## ADR-003: F010 — fix the tractable setup-misbind signal; defer autonomous-termination proof

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-13 |
| **Deciders** | Remediation author (deep-review Pass A finding F010, P1) |

### Context

The captured behavior baseline (`012-behavior-benchmark-capture`) recorded setup-misbind cells and autonomous-budget timeouts (three of six autonomous cells hit the 900s cap after writing complete-looking state). F010 asks to fix setup routing and prove repeatable autonomous termination in a multi-sample, contention-controlled baseline.

### Decision

The correctness half of F010's setup-misbind — the unbound `resolved_lanes` on the no-config path (F003) — is **fixed** in this packet; that binding gap was the concrete setup-misbind a run could hit. Proving repeatable autonomous termination within budget is **deferred**: it requires re-running a controlled, multi-sample behavior benchmark, which is a measurement exercise (a new benchmark capture), not a source patch, and depends on a contention-controlled environment this remediation packet does not own.

### Rationale

A fabricated "termination fixed" claim without a fresh, multi-sample, contention-controlled capture would violate the honesty mandate. The tractable source defect (F003) is fixed here; the empirical termination-repeatability proof is recorded as an explicit, honest deferral for a follow-up benchmark capture rather than asserted.

<!-- /ANCHOR: adr-001 -->
<!-- /ANCHOR: adr-002 -->
<!-- /ANCHOR: adr-003 -->