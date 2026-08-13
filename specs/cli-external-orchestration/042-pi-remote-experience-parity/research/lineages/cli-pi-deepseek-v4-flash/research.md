# Pi Remote Experience Parity — Deep Research Synthesis

**Lineage**: cli-pi (deepseek-v4-flash) fan-out lineage `fanout-cli-pi-deepseek-v4-flash-1786514481346-vicu2t`
**Spec folder**: `specs/cli-external-orchestration/042-pi-remote-experience-parity`
**Anchor architecture**: 041-pi-remote-mobile-agent-like-cc (phases 001-007)
**Loop**: 20 iterations, stopReason `maxIterationsReached` (convergence telemetry: newInfoRatio 1.00 → 0.40, last-5 mean ≈ 0.44 — saturation confirmed; threshold 0.02 treated as telemetry per operator directive)
**Date**: 2026-08-12

---

## 1. Overview

This research designs the best-in-class remote-control experience for the Pi coding agent — a private mobile client pairing with Pi like Claude Code + Claude mobile, exceeding it, without abandoning the loopback-relay / tailnet-only / foreground-authority / redaction posture. Eight experience axes were investigated over 20 iterations with ~40 primary sources (vendor docs, standards, OWASP/NIST, platform documentation) plus the 041 phase specs as the architecture anchor.

The central finding: **the reference product (Claude Code Remote Control, still a research preview as of 2026-08-12) is weaker than its marketing at exactly the points the 042 charter targets — notification actionability, approval friction and reliability, session-list navigation, and cloud-free pairing — and Pi's 041 architecture (persist-before-broadcast epochs, canonical-digest lease/CAS approvals, content-free push hints) already contains the right primitives to exceed it.** The design work below converts those primitives into a concrete, buildable experience layer.

## 2. Methodology

- 20 sequential iterations, each with one focus, web/standards research, and a write-once iteration file with cited sources (`iterations/iteration-001..020.md`).
- Reference product facts verified against live vendor docs (remote-control, permission-modes, costs, permissions) and its public issue tracker (issues #35637, #29214, #24596, #24612, #26730, #59708, #46862 used as design input).
- Platform mechanics verified against standards/vendor docs (RFC 8291, WebKit, Chrome SW FAQ, Android notification docs, Apple watchOS docs, Tailscale docs).
- Every convenience design reconciled against the 041-001 risk classes (auth, path, crash, replay, approval, containment, leakage) — see Section 11.
- Architecture anchor: `pi --mode rpc` native event vocabulary fetched from live Pi docs (pi.dev/docs/latest/rpc), mapped onto 041-003 envelope semantics.

## 3. Reference Baseline (what ships today, dated 2026-08-12)

- **Claude Code Remote Control** (research preview, v2.1.51+; push v2.1.110+): QR/session-URL pairing requiring a claude.ai subscription + full-scope login token; phone views transcript/tool activity, sends messages/files, approves tool calls, receives push on "Claude decides"/permission-prompt toggles (two toggles, no per-event config); one remote session per interactive process; session dies with the terminal; ~10-min outage → exit; documented mobile-render failure leaves sessions frozen (issue #35637); permission modes Manual/Accept edits/Plan (no Auto/Bypass remote).
- **Copilot + GitHub Mobile**: async issue→agent→draft-PR loop with Agents panel (mission control); cloud-bound, PR-shaped.
- **Cursor/OpenAI**: phone remote control arrived 2026 (iOS app; Codex remote in ChatGPT apps); cloud-account-bound.
- **stream-json**: the de facto NDJSON transcript vocabulary (text_delta, input_json_delta, tool events, result with usage) — community-maintained, undocumented officially.
- **Pi native RPC**: already emits `message_update` with text/thinking/toolcall deltas, `tool_execution_start/update/end`, `bash_execution_update`, `queue_update` (steering/followUp — the native attention signal), `turn_start/end`, `compaction_*` with usage, `auto_retry_*` — richer than the reference's stream-json.

## 4. Axis 1 — Live Transcript Richness (iterations 2, 3, 12, 18)

**Design**: canonical relay event vocabulary (`transcript.assistant.delta`, `transcript.thinking.delta`, `transcript.todo`, `transcript.tool.call`, `transcript.tool.diff`, `transcript.tool.result`, `transcript.usage`, `transcript.run.status`, `transcript.session.meta`) riding the 003 envelope `{epoch, seq, ts, kind, payload}` — full schema in Section 10. Diff streaming uses LSP-style incremental range edits (`{pathWs, version, edits}`) with full-snapshot-on-reconnect, unified diff derived for display. Usage emits per-turn (`transcript.usage`) from Pi's existing per-turn accounting. PWA renders thinking as collapsible dimmed blocks, TODOs as live checklists, tool timeline with digest chips, diff viewer, per-message cost chips + session budget ring.

**Security mechanism**: redacted projections everywhere — paths as `ws-<opaque>:relative`, sensitive args masked by policy classes, thinking `display: omitted` option, tool results metadata-only (full output host-side). Redaction classes are machine-enforced at the relay (001 REQ-002).

**Parity-vs-exceed verdict**: **EXCEEDS** — the reference has no thinking deltas, no todo events, no per-turn cost, no structured diffs in its stream; community parsers exist because the schema is undocumented. Pi's vocabulary is native, typed, and redaction-aware; search/navigation (Section 9) is seq-anchored.

## 5. Axis 2 — Low-Friction Phone Approval (iterations 4, 15, 17)

**Design**: risk-class tiered friction — low/known-safe: no prompt; medium (in-workspace edits/tests): compact card with one-tap approve after session-level biometric; high (shell/network/destructive): full card, expand-to-view exact command, expiry countdown, optional number matching, per-action biometric. Approval events: `approval.requested|decided|expired|queue`. Every decision is a lease-CAS settlement (006) — the digest chip shows the user that what they approve is what runs; args change after display → "action changed — needs re-review" + invalidation.

**Security mechanism**: canonical digest recomputed at final boundary (006 unchanged); exactly-one settlement via atomic CAS (fencing semantics — 003 ledger, never LWW); expiry is first-class (timeout policy per risk class: auto-deny, never auto-approve); the reference's frozen-session failure (issue #35637) is impossible by construction.

**Parity-vs-exceed verdict**: **EXCEEDS** — reference approvals can fail to render (stall) and have no digest visibility; Pi adds visible binding, guaranteed expiry outcomes, coalesced queues ("3 approvals waiting"), and glance-class submission (Section 8).

## 6. Axis 3 — Actionable Notification-as-Pull (iterations 5, 13, 14, 19)

**Design**: bounded attention class `needs_input | finished | error` (`attention.raised/resolved`); push payload ≤256 bytes, all opaque `{v, a:<attentionId>, c:<class>, s:<sessionOpaqueId>}` — byte-for-byte 007-compliant. **Content-free-push contradiction resolved**: actionability lives in a local encrypted cache (populated over the tailnet WSS while foreground; AES-GCM, memory-only key) plus fetch-on-open — the notification is a wake-up pointer, never a content channel. SW handling is a bounded three-path wake (cache hit + unlocked → rich local copy; miss → bounded waitUntil fetch of redacted summary; fail → generic "Pi needs attention — open to view"), satisfying the iOS visible-notification rule. Tag discipline: `tag = ${s}:${c}`, `renotify` only on class transitions, count aggregation (Web Push tag semantics).

**Security mechanism**: push carries zero decision/transcript/path content; lock-state-aware rendering (locked → generic copy); OWASP/NIST rules (attention signal, unlock-to-reveal, single-use secrets, anti-spam coalescing).

**Parity-vs-exceed verdict**: **EXCEEDS** — the reference's push is two coarse toggles with content arriving only on open (and its open path has documented failures); Pi delivers per-class granularity, actionable-but-content-free notifications, and a zero-cloud Android path (UnifiedPush/ntfy).

## 7. Axis 4 — Scoped Accept-Edits / Session Allow-List (iterations 6, 8, 17)

**Design**: the allow-list **mints policy-backed leases** — a matching rule makes the relay the decider through the *same* 006 lease path (`allow.matched/granted/revoked`, `decidedBy: "policy"`, ruleId in metadata-only audit). Rules are bounded: tool + exact pattern (workspace-relative; Bash = exact-command patterns compiled against the canonical digest args, never wildcards), window (5-15 min, sudo-timestamp vocabulary), maxGrants, deny precedence with symlink-resolved target checking. Revocation invalidates outstanding grants and bumps the epoch.

**Security mechanism**: no bypass mode exists; the 006 extension still recomputes the digest pre-execution — if the action's args differ from the granted digest, the policy grant is rejected exactly like a stale human approval. "Convenience without bypass" is literal: a pre-authorized lease, not a permission-layer skip.

**Parity-vs-exceed verdict**: **EXCEEDS** — the reference's acceptEdits is mode-level with prompt-level gating and a (removable) bypass mode; Pi's grants are bounded, expiring, auditable, epoch-invalidatable leases with final-boundary revalidation.

## 8. Axis 5 — Browsable, Renamable Session List (iterations 7, 16, 18)

**Design**: two-layer identity (Tailscale name-vs-key separation applied to sessions) — server: immutable `sessionOpaqueId` (never human-readable); client: per-device label map stored encrypted at rest, rename = local write, no server round-trip; optional cross-device label sync as relay-stored ciphertext (device-group keyed, off by default). Server session list returns only safe metadata: `{id, status, model, startedAt, lastActiveAt, workspaceLabel, pendingApprovals, epochFloor}` — complete field list, nothing else. Auto-proposal follows tmux conventions (`<workspaceLabel>-<state>`).

**Security mechanism**: the server cannot leak a label it never holds in plaintext; ids are deliberately non-searchable; labels never derive from host paths.

**Parity-vs-exceed verdict**: **EXCEEDS** — the reference has no documented session naming (three open issues ask for a session manager, rename, and search); Pi's per-device naming is private by construction.

## 9. Axis 6 — Background Sessions & Starting Work While Away (iterations 8, 10, 14, 19)

**Design**: sessions survive disconnects by construction (003 SC-001); "detached" = zero connected clients with relay supervision (`session.supervise`: on-failure restart + backoff + health pings — systemd model, never restart a clean stop). Unattended execution is **bounded by the pre-authorized grant surface**: leases decide by policy or expire → run **parks** (`run.parked`, visible needs_input, resumable). Starting work while away: `session.create` requires authenticated app session + biometric gesture + a workspace from the host-registered set (no arbitrary paths); the create card carries the unattended policy and an optional pre-run cost estimate.

**Security mechanism**: no auto-approve, no bypass; parked state is first-class; crash recovery via durable replay + reconciliation; budget cap parks at the next step boundary (never mid-mutation).

**Parity-vs-exceed verdict**: **EXCEEDS** — the reference's unattended story is `--dangerously-skip-permissions` in CI or terminal-bound sessions that die with the terminal; Pi's reach is a defined policy surface with guaranteed parking.

## 10. Axis 7 — Onboarding/Pairing (iterations 9, 20)

**Design**: one QR scan = tailnet join + device enrollment. `pi remote pair` renders a QR carrying `{nonce, hostTailnetName, hostPubkeyFingerprint, tailnetJoinURL}` where `tailnetJoinURL` is a one-off, tagged, pre-approved, short-lived Tailscale auth key (generated via a scoped OAuth client at pairing time). The phone joins the tailnet in one tap, then performs the enrollment exchange over the tailnet WSS (device public key + nonce proof) → long-lived device credential (Signal-style linked-device keys) that replaces the manual bootstrap ticket; per-*session* tickets remain (004 unchanged). Bidirectional confirmation + linked-device inventory with one-tap revoke (MITRE T1676 defenses).

**Security mechanism**: ephemeral nonce, single-use, 2-min expiry; enrollment only over the tailnet; device credential is revocable and epoch-invalidatable; Serve-proxy identity validation (local-proxy headers only).

**Parity-vs-exceed verdict**: **EXCEEDS** — 3 steps (install TS → tailnet membership → app ticket) collapse to 2 (install TS once → scan QR); no admin dependency, no cloud account, no manual ticket.

## 11. Axis 8 — Single-Host Multi-Session Concurrency (iterations 10, 17)

**Design**: one relay, N Pi children (003 REQ-001); configurable capacity with sane default; per-session fault isolation (one session's needs_input/crash never blocks siblings); isolation layers named honestly (organizational / workspace / resource — no container claims); **workspace write leases** (ledger-backed) serialize same-workspace writes or force worktree mode — solving the reference's same-dir conflict default; one WSS multiplexes sessions (envelope already carries sessionOpaqueId+epoch+seq); cross-session governance: one global pending-approvals queue (per-session leases), per-host token/cost budget with per-session allocation, lifecycle `queued → running → parked|completed|failed|cancelled` with restart reconciliation.

**Security mechanism**: per-session lease ledger, epoch isolation, catalog workspace-scoped (003); capacity is the only global governor; no LWW anywhere.

**Parity-vs-exceed verdict**: **EXCEEDS** — the reference's capacity default (32, same-dir conflicts on) is replaced by durable conflict prevention, per-session fault isolation, and cross-session budget/approval governance.

## 12. Additional Depth (iterations 11-19)

- **Security reconciliation (11)**: per-design verdict table vs 001 risk classes; three new hardening items — machine-enforced redaction classes per envelope, lock-state-aware notifications, Serve-proxy identity validation.
- **Canonical schema (12)**: full event vocabulary in Section 10 of this document.
- **Verification (13)**: reference is a research preview; two notification toggles; chat-app conversation rename exists but code-session naming doesn't; Web Push tag semantics validated.
- **Platform audit (14)**: SW is a bounded wake handler (30s idle termination, no sockets); iOS storage eviction + no background fetch; permission prompt at pairing (user gesture, never on load).
- **Glance surfaces (15)**: Android/Wear quick actions = decision submissions through the same lease CAS with OS-gated auth; iOS has no web notification actions (documented row); MASWE-0037 content discipline.
- **Catalog/retention (16)**: complete server field list; retention tier table; AES-GCM cache spec (fresh IV per record, memory-only key); ITP eviction reality.
- **Adversarial (17)**: fencing semantics; expiry/CAS edge table; offline displays-never-decides; idempotency keys everywhere.
- **Search + cost guard (18)**: seq-anchored search/bookmarks; cost-as-control-signal (chip, forecast, progressive thresholds, recoverable parking).
- **Waiting/error UX (19)**: waiting bar with countdown (frozen state impossible); recovery card with classification (transient/correctable/permanent) and explicit choices; browser fallback surface.

## 13. Recommendations (mapped to 041 amendments)

1. **041-005 (PWA)**: adopt the `relay.event.v1` vocabulary (Section 10), LSP-range diff rendering, thinking/todo/tool-card rendering vocabulary, seq-anchored search, cost chip + drawer, waiting bar, recovery card, per-device label map, offline AES-GCM cache.
2. **041-006 (Approval)**: add approval event family + tiered-friction UX + digest chip + glance decision submission (Android) + grant/allow event family (policy-backed leases) + expiry/timeout policy table; no contract changes to lease/CAS — only event and UX surfaces.
3. **041-007 (Push)**: keep the hint contract; add attention class enum + opaque pointer payload schema + SW three-path handling + tag/renotify discipline + per-class preferences + lock-state-aware copy + UnifiedPush/ntfy Android row + platform matrix rows (iOS action limitation, browser fallback).
4. **041-004 (Auth/Pairing)**: one-QR pairing ceremony (tailnetJoinURL + nonce), device credential enrollment replacing bootstrap ticket, Serve-proxy validation, linked-device inventory.
5. **041-003 (Relay)**: machine-enforced redaction classes per envelope; workspace write leases; supervision events; attention queue dedup.

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| Copying stream-json verbatim as transcript vocabulary | No redaction projection, no digest binding, undocumented | iteration-002.md | 2 |
| Flattening subagent output into parent transcript | Loses execution tree | iteration-002.md | 2 |
| diff-match-patch as live diff wire format | Fuzzy application breaks deterministic sync | iteration-003.md | 3 |
| Lock-screen one-tap approve | OWASP-prohibited; no exact-action review | iteration-004.md | 4 |
| Auto-approve on lease expiry | Never; no-action default is the standard | iteration-017.md | 17 |
| Silent push wake / badge-only signaling | Illegal on iOS; badges not observable | iteration-005.md | 5 |
| E2EE push payloads as content channel | Encryption ≠ policy exemption | iteration-005.md | 5 |
| Bypass-mode permission skipping | No digest revalidation, no per-action audit | iteration-008.md | 8 |
| Server-side shared label namespaces | Collisions, leaks, server trust | iteration-007.md | 7 |
| Wildcard Bash allow rules | Unbounded blast radius | iteration-006.md | 6 |
| Implicit abort cascades across sessions | Sessions are peers | iteration-010.md | 10 |
| Same-dir silent concurrent writes | The reference's failure mode | iteration-010.md | 10 |
| LWW for lease settlement | Silently loses decisions | iteration-017.md | 17 |
| Offline decision authority | Offline displays, never decides | iteration-017.md | 17 |
| Server-side transcript indexing | Content boundary; search stays device-local | iteration-018.md | 18 |
| Glance actions carrying tool/args content | MASWE-0037 lock-screen exposure | iteration-015.md | 15 |
| Ephemeral phone nodes in pairing | Wrong for persistent enrollment | iteration-020.md | 20 |

## 14. Open Questions

- Implementation validation of the schema against the live relay (out of research scope — 041 phase implementation).
- Exact per-risk-class timeout defaults (proposed: low 10m / medium 5m / high 2m) — operator-configurable, default deny at expiry.
- UnifiedPush/ntfy Android path is optional (Web Push via FCM remains the baseline).

## 15. Security Posture Reconciliation

Every convenience design was checked against the 041-001 risk classes; no design violates the posture. Hardening additions: machine-enforced redaction classes (001 REQ-002), lock-state-aware notification rendering, Serve-proxy identity validation, deny-precedence allow rules with symlink resolution, fencing-token settlement semantics, and the "offline displays, never decides" rule. The push payload remains ≤256 bytes of opaque pointers; approvals remain canonical-digest lease settlements; pairing requires no cloud account; unattended execution is bounded by pre-authorized grants.

## 16. Parity-vs-Exceed Summary

| Axis | Verdict | Decisive advantage |
|---|---|---|
| 1 Transcript richness | EXCEEDS | Native thinking/todo/usage events; typed schema; seq-anchored search |
| 2 Phone approval | EXCEEDS | Digest visibility; guaranteed expiry; no frozen sessions |
| 3 Notification pull | EXCEEDS | Actionable + content-free via local cache; per-class control |
| 4 Allow-list | EXCEEDS | Policy-backed leases with final-boundary revalidation; no bypass |
| 5 Session list | EXCEEDS | Server-opaque id + private per-device naming |
| 6 Background | EXCEEDS | Defined grant surface + visible parking; survives disconnects |
| 7 Pairing | EXCEEDS | One QR scan; no admin, no cloud account, no ticket |
| 8 Concurrency | EXCEEDS | Durable conflict prevention; per-session isolation; budgets |

## 17. References

Primary sources (full per-iteration lists in `iterations/iteration-001..020.md`):
- code.claude.com/docs/en/remote-control, /permission-modes, /permissions, /costs, /monitoring-usage; agent-sdk/streaming-output
- github.com/anthropics/claude-code/issues/{24596,24612,26730,29214,35637,46862,59708}
- platform.claude.com/docs/en/build-with-claude/extended-thinking
- opencode.ai/v2/docs/build/client; github.com/anomalyco/opencode/issues/{33397,20849,19215}
- pi.dev/docs/latest/rpc; pi.dev/docs/latest/usage
- datatracker.ietf.org/doc/html/rfc8291; web.dev push-notifications-{behaviour,common-notification-patterns}
- webkit.org/blog/{13878,14112,14403}; chromium.org SW security FAQ
- developer.android.com (notifications, wearable extender, VISIBILITY_PRIVATE); developer.apple.com (watchOS notifications, lockScreenSetting)
- tailscale.com (serve, grants, auth-keys, machine-names, node-keys, qr-code login, https certificates)
- OWASP (Transaction Authorization, Mobile Top 10 M5, MASWE-0037, Logging Vocabulary); NIST SP 800-63B; MITRE ATT&CK T1676
- signal.org linked-devices; sudoers(5); systemd.service; martin.kleppmann.com distributed locking
- coder.com usage-insights; claude.com/plugins/session-report; github.blog (Copilot agents panel)
- specs/cli-external-orchestration/041-pi-remote-mobile-agent-like-cc/{001..007}/spec.md (architecture anchor)
