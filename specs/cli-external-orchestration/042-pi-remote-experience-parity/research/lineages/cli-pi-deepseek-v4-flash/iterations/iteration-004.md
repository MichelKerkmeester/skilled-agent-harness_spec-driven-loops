# Iteration 4: Axis 2 — Low-Friction Phone Approval with Exact-Action Binding

## Focus
Design the approval UX that keeps 041-006's canonical-digest/lease/CAS guarantees (exactly one settled decision; digest recomputed pre-execution) while removing the friction the 042 charter flags: foreground-only reauth and a separate exact-action card. Prior art: OWASP transaction authorization, NIST 800-63B out-of-band rules, 1Password/Duo approve flows, Claude Code Remote Control permission prompts (and its documented mobile-rendering failure).

## Findings

### F1. OWASP/NIST approval-UI rules — the security UX canon
- Push is an **attention signal**, never the approval surface: tap → secure in-app review ([SOURCE: cheatsheetseries.owasp.org/cheatsheets/Transaction_Authorization_Cheat_Sheet.html]).
- Explicit review → approve sequence with biometric/PIN step-up; approval must **bind server-side to the exact transaction** (amount/payee/id); any material detail change invalidates the prior approval ([SOURCE: OWASP Transaction Authorization]).
- Never one-tap approve on the lock screen; use **number matching** for cross-device flows; rate-limit and coalesce pushes; decline must offer "I don't recognize this" ([SOURCE: OWASP; pages.nist.gov/800-63-4/sp800-63b.html]).
- Out-of-band secrets: single-use, short-lived, completed within 10 minutes (NIST 800-63B). Lock-screen previews minimize sensitive detail ([SOURCE: NIST 800-63B]).

### F2. Claude Code Remote Control approval state of the art (and its failure mode)
- Permission modes Ask / Auto accept edits / Plan; `--permission-mode acceptEdits`; "Push when Claude decides" notification toggle; `/permissions` narrow allow rules pre-approve known-safe commands while retaining prompts for higher-risk shell/network actions ([SOURCE: code.claude.com/docs/en/remote-control], [SOURCE: code.claude.com/docs/en/permissions]).
- **Documented failure**: interactive prompts can fail to render in the mobile app, leaving the local session waiting indefinitely in the terminal ([SOURCE: github.com/anthropics/claude-code/issues/35637]). This is the exact gap the lease model must close: an approval request is a first-class, expiring, observable state — never a hidden render.

### F3. 1Password/Duo approve flows
- Approve-on-another-device works for SSO/Duo enrollments; standard individual accounts use TOTP, not push-approve ([SOURCE: support.1password.com/sso-linked-apps-browsers/], [SOURCE: support.1password.com/duo/]). Implication: push-approve is reserved for high-assurance contexts in the reference world; Pi can make it the *default* because the tailnet is already the trust boundary.

## Design: Axis 2 deliverables

### Event schema (rides the 003 envelope)
- `approval.requested`: `{leaseId, tool, inputRedacted, digest, riskClass, policyVersion, expiresAt, sessionId, epoch}` — digest commits the canonical unredacted args host-side (006); the wire carries only the redacted projection + digest.
- `approval.decided`: `{leaseId, outcome: approved|denied, decidedBy: deviceId, at}` — broadcast to all devices (single-settled via CAS per 006).
- `approval.expired`: `{leaseId, reason: timeout|epochInvalidated|superseded}`.
- `approval.queue` (attention class, axis 3 consumes): `{sessionId, pending: n, oldestExpiry}`.
- `run.status = needs_input` ties the transcript to the pending lease (transcript.tool.call carries the leaseId).

### UX pattern: tiered friction
1. **Risk-class tiering** (policy-driven, per 006 per-command capability enablement):
   - read-only / known-safe (allow-listed, axis 4): no prompt, event only.
   - medium (in-workspace file edits, tests): compact card — tool name, workspace-relative path, redacted args, digest chip; **one-tap approve** after a session-level biometric unlock (biometric once per app session window; each tap signs `{leaseId, digest, nonce, decision}` with the session key).
   - high (shell, network, destructive): full card — expand-to-view exact command (host-relative), risk banner, expiry countdown, optional **number matching** (6-digit challenge shown in-app; host terminal shows the same number when observed); approve requires biometric per action.
2. **Exact-action binding preserved**: the relay validates at CAS time that `digest` equals the freshly recomputed canonical digest (006's final-boundary extension). UI consequence: if args changed after display, the card flips to "action changed — needs re-review" and the stale lease is invalidated (`approval.invalidated`). What you approve is what runs — now *visible* to the user via the digest chip, which the reference does not show.
3. **Coalescing + queue**: N pending approvals → one attention event `approval.queue` with count; deep-link opens the approval queue, not a single card. Prevents notification fatigue (OWASP anti-spam).
4. **Expiry is first-class**: countdown on card; on expiry, `approval.expired` + host-side timeout policy per risk class (default: auto-deny for high-risk, auto-deny for all — never auto-approve). This closes the reference's silent-indefinite-wait failure (issue #35637): a missing render cannot deadlock a session.
5. **"Decided elsewhere" resolution**: second device tapping approve/deny after the first decision gets `approval.decided` with `decidedBy` — CAS outcome surfaced as UX, not an error.

### Why this exceeds the reference
- Reference: prompts may not render (session stalls); forwarded-dialog expiry only; no digest visibility; no risk-tiered friction; no queue coalescing.
- Pi: every approval is an expiring, observable, single-settled state with visible digest binding, tiered friction, coalesced attention, and a guaranteed host-side timeout outcome. Same security, strictly better failure modes and friction curve.

## Sources Consulted
- [SOURCE: https://cheatsheetseries.owasp.org/cheatsheets/Transaction_Authorization_Cheat_Sheet.html]
- [SOURCE: https://pages.nist.gov/800-63-4/sp800-63b.html]
- [SOURCE: https://code.claude.com/docs/en/remote-control]
- [SOURCE: https://code.claude.com/docs/en/permissions]
- [SOURCE: https://github.com/anthropics/claude-code/issues/35637]
- [SOURCE: https://support.1password.com/sso-linked-apps-browsers/]
- [SOURCE: https://support.1password.com/duo/]
- [SOURCE: specs/cli-external-orchestration/041-pi-remote-mobile-agent-like-cc/006-approval-and-remote-mutation/spec.md]

## Assessment
- newInfoRatio: 0.80
- Novelty justification: approval event schema (requested/decided/expired/queue), tiered friction UX, digest-chip visibility, and the lease-expiry cure for the reference's stall failure are new; OWASP/NIST rules are consolidated prior art.
- Confidence: high on OWASP/NIST and Claude Code facts; design maps directly onto 006 lease/CAS contracts.

## Reflection
- What worked: treating the reference's rendering-failure issue as a design requirement (expiry + attention event) rather than an edge case.
- What failed / ruled out: lock-screen one-tap approve (OWASP-prohibited); TOTP-style codes as the primary flow (friction, no exact-action binding); client-side-only "authorization" (tap ≠ authority — server-side CAS remains).
- Ruled out: auto-approve on expiry (never); sending unredacted args in the approval card (004/006 violation).

## Recommended Next Focus
Axis 3: actionable notification-as-pull loop — the bounded needs_input/finished/error attention class and the content-free-push contradiction resolution.
