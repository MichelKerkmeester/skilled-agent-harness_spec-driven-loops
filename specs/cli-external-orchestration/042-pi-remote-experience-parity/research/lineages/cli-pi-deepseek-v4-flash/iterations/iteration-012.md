# Iteration 12: Cross-Cutting Pass B — Canonical Combined Relay Event Schema

## Focus
Merge the vocabulary from iterations 2-10 into ONE buildable event schema riding the 041-003 envelope (`{epoch, seq, ts, kind, payload}` — immutable, ordered, persist-before-broadcast). This is the primary buildable artifact for 042 amendments to 041 phases 005/006/007.

## Findings (consolidation, no new web evidence needed)
- Native source vocabulary: Pi `--mode rpc` events (message_update deltas incl. thinking; tool_execution_*; queue_update; compaction usage) [iteration 3].
- Envelope contract: 003 epoch/seq, redacted envelopes, replay floors, snapshot barriers, mutation ledger CAS [iteration 1-2, 11].
- Approval contract: 006 lease + canonical digest + exactly-one CAS settlement [iteration 4].
- Push contract: 007 opaque hints + fetch-on-open; attention classes [iteration 5].
- Redaction classes must be machine-enforced [iteration 11 gap 1].

## Design: Canonical Schema (schemaVersion 1, `relay.event.v1`)

### Envelope (003, unchanged)
```ts
interface Envelope { epoch: number; seq: number; ts: string; sessionOpaqueId: string; kind: RelayKind; payload: unknown; }
```
Every envelope is persisted before broadcast; seq is monotonic per (session, epoch); snapshot barriers reset replay floors (003).

### RelayKind union
```ts
type RelayKind =
  // transcript (axes 1)
  | "transcript.assistant.delta" | "transcript.thinking.delta" | "transcript.todo"
  | "transcript.tool.call" | "transcript.tool.diff" | "transcript.tool.result"
  | "transcript.usage" | "transcript.run.status" | "transcript.session.meta"
  // approval (axis 2)
  | "approval.requested" | "approval.decided" | "approval.expired" | "approval.queue"
  // allow-list (axis 4)
  | "allow.matched" | "allow.granted" | "allow.revoked"
  // attention / push (axis 3)
  | "attention.raised" | "attention.resolved"
  // sessions / background (axes 6, 8)
  | "session.created" | "session.detached" | "session.supervise" | "run.parked"
  // pairing / devices (axis 7)
  | "pairing.started" | "pairing.deviceLinked" | "pairing.revoked";
```

### Payload shapes (redacted projections; redaction class token machine-enforced)
```ts
interface TranscriptAssistantDelta { text: string; rc: RedactionClass; }              // rc: "none"|"code"|"path"|"secret"|"host"
interface TranscriptThinkingDelta { text?: string; display: "shown"|"omitted"; rc: "none"|"secret"; }
interface TranscriptTodo { items: { id: string; status: "pending"|"in_progress"|"done"; label: string }[]; }
interface TranscriptToolCall { callId: string; tool: string; inputRedacted: unknown; digest: string; riskClass: RiskClass; leaseId?: string; }
interface TranscriptToolDiff { callId: string; pathWs: string; version: number; edits: { range: {start:{line:number;char:number}; end:{line:number;char:number}}; text: string }[]; }  // LSP-style (iter 3)
interface TranscriptToolResult { callId: string; ok: boolean; exit?: number; durationMs: number; sizeBytes: number; summary: string; }
interface TranscriptUsage { turnId: string; model: string; tokens: { input: number; output: number; cacheRead: number; cacheWrite: number; thinking: number }; cost: { amount: number; currency: string }; context: { percentUsed: number; window: string }; }
type RunState = "running"|"waiting"|"needs_input"|"parked"|"finished"|"error";
interface TranscriptRunStatus { state: RunState; leaseId?: string; }
interface TranscriptSessionMeta { label?: string; workspaceLabel: string; model: string; startedAt: string; epochFloor: number; capacity?: { active: number; max: number }; }

interface ApprovalRequested { leaseId: string; tool: string; inputRedacted: unknown; digest: string; riskClass: "low"|"medium"|"high"; policyVersion: string; expiresAt: string; epoch: number; }
interface ApprovalDecided { leaseId: string; outcome: "approved"|"denied"; decidedBy: "user"|"policy"; ruleId?: string; at: string; }
interface ApprovalExpired { leaseId: string; reason: "timeout"|"epochInvalidated"|"superseded"; }
interface ApprovalQueue { pending: number; oldestExpiry?: string; }

interface AllowMatched { leaseId: string; ruleId: string; tool: string; digest: string; window: string; remaining: number; }
interface AllowGranted { ruleId: string; tool: string; pattern: string; window: string; maxGrants: number; }
interface AllowRevoked { ruleId: string; at: string; }

type AttentionClass = "needs_input"|"finished"|"error";
interface AttentionRaised { attentionId: string; class: AttentionClass; runId: string; leaseId?: string; raisedAt: string; expiresAt?: string; pendingCount?: number; }
interface AttentionResolved { attentionId: string; at: string; }

interface SessionCreated { sessionOpaqueId: string; workspaceOpaqueId: string; unattendedPolicy: "park"|"grants"; model: string; }
interface SessionDetached { clients: number; }
interface SessionSupervise { action: "restart"|"backoff"|"watchdogFired"; attempt: number; reason: string; }
interface RunParked { leaseId: string; parkedAt: string; policy: "timeout"; }

interface PairingStarted { nonce: string; expiresAt: string; }
interface PairingDeviceLinked { deviceId: string; name: string; fingerprint: string; workspaces: string[]; }
interface PairingRevoked { deviceId: string; at: string; }
```

### Push payload (007-compliant, ≤256 bytes)
`{v:1, a:<attentionId>, c:<AttentionClass>, s:<sessionOpaqueId>}` — deep-link `pi-remote://attention/{s}/{a}`; rich rendering from the local encrypted cache when unlocked (iter 5, 11).

### Redaction classes (001 REQ-002, machine-enforced)
`none|code|path|secret|host` — assigned by the relay classifier; the PWA must refuse to render `secret`/`host` classes as plaintext without a policy-granted, authenticated fetch; masking is defense-in-depth, not the control.

## Sources Consulted
- Iterations 2-11 of this lineage (consolidated design)
- [SOURCE: specs/cli-external-orchestration/041-pi-remote-mobile-agent-like-cc/003-relay-protocol-and-state/spec.md]
- [SOURCE: specs/cli-external-orchestration/041-pi-remote-mobile-agent-like-cc/006-approval-and-remote-mutation/spec.md]
- [SOURCE: specs/cli-external-orchestration/041-pi-remote-mobile-agent-like-cc/007-push-and-platform-hardening/spec.md]

## Assessment
- newInfoRatio: 0.60
- Novelty justification: the single canonical schema document (envelope + kind union + payload shapes + redaction classes + push payload) is new as an artifact; all parts derive from prior iterations.
- Confidence: high; the schema is directly mappable onto the cited 003/006/007 contracts.

## Reflection
- What worked: one artifact instead of scattered per-axis snippets — synthesis can cite it wholesale.
- What failed / ruled out: inventing a second envelope format (the 003 envelope already has epoch/seq/persist semantics); including raw args in any wire payload (digest + inputRedacted only).
- Ruled out: pushing anything beyond the 256-byte opaque pointer.

## Recommended Next Focus
Depth pass: verify current Claude Code mobile/remote capabilities and Anthropic's notification mechanics against the latest docs (claims from iteration 1 need freshness confirmation).
