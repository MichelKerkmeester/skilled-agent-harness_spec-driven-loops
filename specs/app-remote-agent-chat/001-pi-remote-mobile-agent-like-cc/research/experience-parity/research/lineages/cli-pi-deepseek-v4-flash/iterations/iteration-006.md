# Iteration 6: Axis 4 — Scoped Accept-Edits / Session Allow-List Bound to Lease/CAS

## Focus
Design the low-friction "accept edits / allow this" convenience so it stays inside the 041-006 lease/CAS machinery — convenience without bypass. Prior art: Claude Code permission modes + allow/ask/deny rules, sudo timestamp credential caching, OpenCode permission guidance.

## Findings

### F1. Claude Code's acceptEdits and allow rules — mode-level convenience, prompt-level gating
- `acceptEdits` auto-approves file edits + common fs commands (mkdir/touch/rm/mv/cp/sed) **only within the working directory or additionalDirectories**; shell and out-of-scope actions still prompt ([SOURCE: code.claude.com/docs/en/permission-modes]).
- Rules resolve deny → ask → allow, first match wins, deny precedence; allow rules **are not a sandbox** — they only remove prompts; symlink allow requires both path and target to match ([SOURCE: code.claude.com/docs/en/permissions]).
- `bypassPermissions` skips the permission layer entirely (circuit-breaker remains only for `rm -rf /`); orgs can disable bypass ([SOURCE: code.claude.com/docs/en/permissions]).
- Implication: in the reference, convenience is *mode-level* (broad) and gating is *prompt-level* (no pre-execution digest revalidation). A tool that mutates outside the pattern after approval is not re-checked against the allow rule at execution time.

### F2. sudo timestamp — the time-bounded credential-cache pattern
- After authentication sudo caches a timestamp; subsequent commands skip re-prompt for a configured period (default 5 min); `timestamp_timeout=0` prompts always; `timestamp_type=tty|ppid` scopes the cache to a terminal/process lineage; `sudo -k` invalidates explicitly ([SOURCE: sudo.ws/docs/man/1.9.14/sudoers.man.pdf]).
- Principle: least privilege + time-bounded reuse; a timestamp proves a recent authentication event, **not continuous presence**.
- Implication: windows, scoping, and explicit invalidation are the proven vocabulary for "convenient but revocable."

### F3. OpenCode
- Same guidance: permissions are not a sandbox; run untrusted work in real isolation ([SOURCE: opencode.ai/docs/permissions]).

## Design: Axis 4 deliverables

### Core move: the allow-list mints **policy-backed leases**, never skips the lease ledger
006 requires exactly one canonical-digest lease per protected action, settled by first-valid CAS, with the extension recomputing the digest immediately before execution. A rule that bypasses approval would bypass the ledger — prohibited. Resolution: a matching allow rule makes the **relay itself the decider** through the *same* lease path:

- `allow.matched`: `{leaseId, ruleId, tool, digest, scope, window, remaining}` — the relay creates a lease record exactly like a human approval (same CAS, same epoch binding, same digest), with `decidedBy: "policy"` and `ruleId` in audit metadata.
- The 006 extension still recomputes the canonical digest pre-execution and consumes the lease. **If the action's args differ from the granted digest, the policy grant is rejected exactly like a stale human approval** — this is the "no bypass" property: bypass-mode products re-gate at prompt time only; Pi re-validates at the final boundary.
- Nothing in the design touches 006 REQ-002 (exactly one current decision settles a lease) — policy is one more *authorized responder*, distinguishable in audit.

### Rule shape (bounded, default-deny)
```
allow.rule = {
  ruleId, sessionScope: opaqueId | "*", tool, pattern, riskClass,
  windowSeconds (5-15m default, cap 60m), maxGrants, deny: [patterns]
}
```
- File edits: `{tool: Edit|Write, path: ws-<opaque>:src/**, window: 15m, maxGrants: 20}` — workspace-relative, single-session default.
- Bash: **exact-command** patterns compiled against the canonical digest args (e.g. `npm test`), never prefix wildcards; shell/network/destructive tools require explicit `riskClass: high` acknowledgment and short windows; wildcard Bash grants are rejected by policy.
- Deny precedence (Claude Code precedent): `.env`, `~/.ssh/**`, credential files, and any symlink resolution into deny paths invalidate the match — checked against the *resolved* target at grant time.

### Grant lifecycle (sudo vocabulary, lease-tracked)
- Window expiry → next matching action re-prompts (timestamp_timeout semantics); `maxGrants` counts consumption per window (rate-limit, OWASP).
- Scope: session-scoped by default (timestamp_type=tty analog); global scope requires explicit high-risk acknowledgment and is listed on the Grants screen.
- Revocation: `allow.revoke` (from PWA or host) invalidates outstanding grants immediately and bumps the epoch — stale grants cannot survive.
- Every grant decision is a metadata-only audit row (006): `decidedBy: policy`, ruleId, window, consumed count.

### PWA UX
- Approval card gains "Approve + allow for this session (15 min)" — one tap; the card previews the exact rule being created (tool, pattern, window, remaining grants) before commit; `allow.granted` appears in the transcript like any decision.
- Grants manager screen: list active grants per session with consumed counts and "Revoke now"; mirrors the host-side `pi remote allow` surface.
- Timeout policy: like leases, grants never auto-renew; expiry is visible in the card countdown.

### Why this exceeds the reference
- Reference: mode-level acceptEdits is broad and prompt-level; no pre-execution revalidation; bypass mode exists and can be enabled (org-gated).
- Pi: every convenience action is an explicit, bounded, expiring, auditable, epoch-invalidatable **pre-authorized lease** revalidated at the final boundary. The user gets acceptEdits-level flow with 006-level exactness — convenience with the same evidence trail as a manual approval, and no bypass mode exists at all.

## Sources Consulted
- [SOURCE: https://code.claude.com/docs/en/permission-modes]
- [SOURCE: https://code.claude.com/docs/en/permissions]
- [SOURCE: https://www.sudo.ws/docs/man/1.9.14/sudoers.man.pdf]
- [SOURCE: https://opencode.ai/docs/permissions]
- [SOURCE: specs/cli-external-orchestration/041-pi-remote-mobile-agent-like-cc/006-approval-and-remote-mutation/spec.md]

## Assessment
- newInfoRatio: 0.80
- Novelty justification: policy-backed leases (allow-list as an authorized responder inside the CAS ledger) are the new mechanism; Claude Code modes and sudo timestamps are consolidated prior art.
- Confidence: high on reference facts; mechanism maps 1:1 onto 006 contracts.

## Reflection
- What worked: asking "who is the decider?" — making policy a first-class, audited decider inside the ledger, rather than a layer that bypasses it.
- What failed / ruled out: bypass-mode-style permission skipping (no digest revalidation, no audit row per action); wildcard Bash allow rules (unbounded blast radius); global/never-expiring grants (sudo negative-timeout analog — inappropriate for remote).
- Ruled out: allow rules that bypass the 006 lease consumption.

## Recommended Next Focus
Axis 5: browsable, renamable session list under opaque-id/redaction constraints — client-local identity mapping.
