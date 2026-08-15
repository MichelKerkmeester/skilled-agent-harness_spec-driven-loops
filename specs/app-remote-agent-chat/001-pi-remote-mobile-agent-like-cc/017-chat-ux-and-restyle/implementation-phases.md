# Pi Remote Desktop-Parity Chat UX - Optimized Phased Implementation Plan

## Overview

This planning-only document implements the recommendations in `research/research.md`, the lineage reports, and `restyle-plan.md`. It does not contain application code.

All application paths below are relative to:

`/Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile`

The plan is organized around independently verifiable increments. Runtime authority is proven before visible controls. Presentation work remains downstream of guarded, redacted state. The inert Claude foundation runs as a parallel track after the deployed runtime baseline and joins the critical path before the first visible control ships.

## Optimization notes and critical path

- **Recommended build order:** Phase 0, then Phase 1A, Phase 1B, Phase 1C, Phase 2A, Phase 2B, Phase 3A, Phase 3B, Phase 4A, and Phase 4B. Foundation F1 and F2 run in parallel after Phase 0, with F1 before F2 and both complete before Phase 2A.
- **Critical path:** deployed runtime proof, exact contracts and Plan enforcement, serialized runtime authority, narrow relay exposure, host-backed mobile controls, explicit composer behavior, typed turn parity, streaming and Plan handoff, global visual cutover, then physical-device release proof.
- **Safe parallel tracks:** after Phase 0, the runtime lane owns protocol, extension, relay, verifier, and root dependency work. The foundation lane owns web tokens, font assets, pre-paint theme bootstrap, and service-worker cache manifests. The foundation lane must not edit `App.tsx`, protocol or relay source, root package dependency files, or runtime tests before the merge gate.
- **First demoable milestone:** Phase 1C is the first end-to-end testable slice. An unstyled harness performs a ticketed model, effort, and mode mutation, observes host-confirmed state, exercises command filtering, and proves stale, restart, and delivery-unknown behavior. Phase 2A is the first user-facing phone milestone.
- **What changed:** the former large control-plane phase is split into contracts, runtime authority, and relay exposure. The former foundation is split into token/font and theme/cache work and moved off the critical lane after Phase 0. The mobile, transcript, and release phases are split at reviewable behavior boundaries. No planned task, acceptance check, coverage mapping, prohibited shortcut, or security invariant is removed.

## Planning basis and current constraints

The current implementation establishes these constraints:

- `scripts/boot.mjs` already maps `--full-access` to `PI_REMOTE_FULL_ACCESS=1`.
- `apps/pi-remote-relay/src/index.ts::fullAccessPiArguments()` already returns `--mode rpc --no-session --approve`. Full access is not a browser preference and this plan does not redesign it.
- `apps/pi-remote-relay/src/rpc/supervisor.ts` still has the safe legacy default `--no-tools --no-extensions` when no explicit runtime posture is selected.
- `apps/pi-remote-relay/src/rpc/supervisor.ts::send()` serializes stdin writes but does not hold the mutation lane until response settlement. Runtime mutations therefore need a distinct settled queue.
- `apps/pi-remote-web/src/App.tsx` currently owns session orchestration, the virtualized block transcript, theme application, and a native three-row textarea whose plain Enter submits.
- `apps/pi-remote-web/src/state.ts` reconciles transcript blocks by stable id, revision, and sequence, with snapshot barriers and cache or relay provenance.
- `apps/pi-remote-web/src/relay.ts` obtains one-use tickets for prompt submission and WebSocket sync.
- `apps/pi-remote-relay/src/http/server.ts` is loopback-only, exact-origin authenticated, default-deny, bounded-body, and independently rate-limits prompts.
- `apps/pi-remote-relay/src/prompt/prompt-service.ts` has single-flight submission idempotency and an explicit `delivery-unknown` state that blocks automatic retry.
- `apps/pi-remote-web/src/cache.ts` is a bounded read-only transcript and session cache. Runtime authority must never be added to it.
- `apps/pi-remote-web/src/attention.ts` and the relay push path are content-free. Runtime labels and command data must never be added to push payloads.

## Dependency graph and merge gates

| Phase | Depends on | Unblocks | Independent exit condition |
| --- | --- | --- | --- |
| 0 | Existing deployment and installed Pi | 1A, F1 | Deployed full-access and Plan behavior are observed, redacted, and rollback-tested. |
| 1A | 0 | 1B | Exact protocol guards and the pinned RPC-safe Plan bridge pass negative controls and the runtime verifier. |
| 1B | 1A | 1C | Serialized mutations, revisions, hydration, lifecycle invalidation, idempotency, and redaction pass service tests. |
| 1C | 1B | Merge gate A | Narrow authenticated endpoints, sync publication, filtered commands, prompt modes, abort, and the unstyled end-to-end harness pass. |
| F1 | 0 | F2 | Inert Claude primitives, aliases, fonts, licenses, manifests, and integrity tests land with screenshot stability. |
| F2 | F1 | Merge gate A | Pre-paint theme and two-generation cache behavior pass all first-paint, upgrade, downgrade, offline, and rollback tests. |
| Merge gate A | 1C and F2 | 2A | The dark control plane and inert foundation pass together. Root dependency files are reconciled once. Existing screens remain visually stable. |
| 2A | Merge gate A | 2B | Host-backed Model, Effort, and Build or Plan controls work on the unchanged transcript and composer. |
| 2B | 2A | 3A | Commands, quick actions, explicit Send, Steer, Later, Stop, and draft recovery work on the unchanged transcript. |
| 3A | 2B | 3B | Derived turns replace equal event cards with complete typed-renderer and replay parity. |
| 3B | 3A | 4A | Named streaming phases, reader-controlled live edge, and Plan execution handoff pass authority and accessibility gates. |
| 4A | 3B | 4B | Global Claude cutover, legacy-surface migration, restrained motion, response actions, and automated release checks pass. |
| 4B | 4A | Release | Physical iPhone, installed-PWA, rollback, offline, reconciliation, and full workspace gates pass. |

The following starts are prohibited:

- Phase 1A cannot start until Phase 0 identifies the deployed Pi binary, arguments, and extension behavior.
- F1 cannot start until Phase 0 captures the screenshot and rollback baseline.
- Phase 2A cannot start until both runtime and foundation lanes pass Merge gate A.
- Phase 2B cannot start until Phase 2A proves host-confirmed controls against the old composer and transcript.
- Phase 3A cannot start until the composer and runtime behavior are stable.
- Phase 3B cannot start until typed renderer parity is complete.
- Phase 4A cannot start until the final information hierarchy and live-edge behavior are stable.
- Phase 4B cannot start until the final visual candidate is frozen.

## Demoable and shippable milestones

| Milestone | Phase exit | Demonstration |
| --- | --- | --- |
| Runtime truth | 0 | Staged verifier proves the real full-access launch, Pi reads, `/plan` behavior, and rollback. |
| Dark end-to-end control | 1C | Unstyled harness proves ticketed model, effort, Plan, commands, prompt modes, abort, restart, stale revision, and reconciliation. |
| First phone control slice | 2A | Model, Effort, and Build or Plan appear beside the unchanged composer and transcript, with no optimistic committed state. |
| Complete composer slice | 2B | Slash discovery, quick actions, multiline drafting, Send, Steer, Later, Stop, immutable submit, and recovery are usable. |
| Conversational transcript | 3A | Derived turns and evidence disclosure ship with every typed block and replay invariant intact. |
| Calm live session | 3B | Named work phases, elapsed time, reader-away live edge, and safe Plan execution handoff work together. |
| Release candidate | 4A | Claude restyle, legacy surfaces, limited motion, and settled-turn actions are frozen for device verification. |
| Release-ready build | 4B | Physical iPhone and rollback evidence pass with the complete workspace gate. |

## Cross-phase authority and rollback rules

- Pi is the authority for model, thinking level, streaming state, active tools, and Plan mode. The browser may show pending intent but never an optimistic committed value.
- The relay remains the only phone-to-Pi boundary. No phase adds raw Pi RPC passthrough, arbitrary tool invocation, or a second live session.
- Existing security semantics are preserved per deployment posture. Mutation-family deployments retain the approval extension. `--full-access` retains its explicitly approved desktop-style no-phone-gate posture. New chat controls add no bypass to either posture.
- Every phone-originated mutation consumes a one-use ticket, carries an idempotency id, is rate-limited, and fails closed on unknown action, shape, operation, value, command, or session.
- `expectedRevision` protects runtime controls from stale writes. A stale client refreshes state before a user-initiated retry.
- A delivery-unknown prompt, abort, mode, model, or thinking mutation is never retried automatically. Reconciliation must establish host state first.
- Plan mode is enforced inside the Pi extension by active-tool restriction and Bash filtering. Browser wording or local state is never treated as enforcement.
- Runtime and command projections use the canonical redaction boundary. No API key, authorization value, cookie, session file, source path, workspace path, full tool catalog, or unredacted prompt enters a browser DTO, durable envelope, cache, or push hint.
- Rollback for runtime and visible phases disables the new runtime-control capability, deploys the prior verified web and relay build, and restarts through the verified `--full-access` boot path. Runtime state requires no database or schema migration. Any later persistence proposal is separate reviewed scope.
- Rollback for F1 and F2 reverts only inert `style.css` primitives and aliases, the two font files and manifests, the `index.html` bootstrap, `main.tsx` cooperation, and service-worker manifests. It never touches authority, protocol, session storage, or legacy selectors.

---

## Phase 0 - Deployed Runtime Boundary and Legacy-Contract Audit

### Goal and scope

Ship an evidence-backed deployment baseline before any new control API, foundation asset, or phone UI exists. Confirm that the live boot path is the already-wired full-access posture and determine whether RPC mode loads a usable `/plan` extension. Record every source, test, fixture, document, and installed client that still assumes the legacy steering-only contract.

This phase does not add model, effort, command, or mode controls. It does not change the transcript or visual system. It does not make the PWA responsible for selecting full access. It does not remove the safe `RpcSupervisor` fallback.

### Ordered tasks

1. **Encode the full-access launch chain as a testable invariant.**
   - Change `apps/pi-remote-relay/tests/rpc.test.ts` to cover `fullAccessPiArguments()` separately from the existing supervisor-default test.
   - Assert the full-access path contains `--mode rpc`, `--no-session`, and `--approve`, does not contain `--no-tools` or a restrictive `--tools` allowlist, and leaves the legacy supervisor default unchanged.
   - Change `scripts/boot.mjs` only if observation proves the existing `--full-access` to `PI_REMOTE_FULL_ACCESS=1` handoff is not the process launching the relay. Do not duplicate or replace the current flag path.

2. **Create a black-box runtime verifier.**
   - Create `scripts/verify-full-access-runtime.mjs` to launch or attach to the staged relay configuration used by deployment, speak strict LF-delimited Pi RPC, and record bounded, secret-free results for `get_state`, `get_available_models`, `get_available_thinking_levels`, and `get_commands`.
   - Confirm that `get_commands` contains `plan`, submit `/plan` through Pi `prompt`, and observe the extension's RPC-visible status signal.
   - Never print raw model objects, `sessionFile`, command `path`, environment, prompt content, or unbounded response data.
   - Add a `verify:runtime-boundary` package script. Keep it out of the unit-test path because it requires a real Pi installation.

3. **Capture deployment evidence and rollback.**
   - Create `docs/quality/pi-remote-full-access-runtime-baseline.md` with the Pi version, resolved executable, redacted argument vector, whether `/plan` loaded in RPC mode, the observed status signal, date and device, and exact rollback command or process.
   - Capture baseline screenshots before F1 starts.
   - Update `scripts/rollback-drill.mjs` and `tests/rollback-drill.test.ts` so the drill restores prior relay and web artifacts and relaunches the verified full-access posture without assuming a database migration.

4. **Inventory and correct legacy steering-only statements without erasing the safe fallback.**
   - Change `README.md`, `ARCHITECTURE.md`, `docs/setup.md`, `docs/install-and-onboarding.md`, and `apps/pi-remote-relay/src/rpc/README.md` to distinguish three postures: safe steering-only default, allowlisted mutation-family mode, and operator-selected full access.
   - Record `apps/pi-remote-relay/src/rpc/supervisor.ts`, `apps/pi-remote-relay/tests/rpc.test.ts`, and `apps/pi-remote-relay/src/fixtures/pi-rpc.jsonl` as intentional legacy or default speakers. Do not silently rewrite them to full access.
   - Record `apps/pi-remote-web/src/cache.ts` as transcript and session cache only. Runtime authority must not be restored from it after reconnect.
   - Record `apps/pi-remote-web/src/attention.ts` and push tests as content-free surfaces that must not receive model, effort, mode, command, or transcript strings.

5. **Gate Phase 1 on the real Plan result.**
   - If deployed `get_commands` does not expose `/plan`, or `/plan` does not produce an RPC-visible transition, mark the baseline failed and keep future phone controls dark.
   - Phase 1A must then pin and load the project-owned Plan bridge and rerun the same verifier before Phase 1B may start.
   - Do not substitute a client-only mode label.

### Protocol and relay contracts introduced

No browser-facing production contract is introduced. The verifier uses existing Pi RPC methods exactly as documented:

- `get_state`
- `get_available_models`
- `get_available_thinking_levels`
- `get_commands`
- `prompt` carrying `/plan`

The baseline fixes existing launch contracts in place. `--full-access` and `PI_REMOTE_FULL_ACCESS=1` select `fullAccessPiArguments()`. The no-flag supervisor path remains `--mode rpc --no-session --no-tools --no-extensions`.

### Objective acceptance checks

- **PASS**: `npm run verify:runtime-boundary` exits 0 against the staged deployed Pi version and reports all four reads plus a `/plan` status transition without printing forbidden fields. **FAIL**: any method is missing, malformed, or leaks a forbidden value.
- **PASS**: the observed child argument vector is the full-access vector selected by the boot flag. **FAIL**: deployment silently falls back to `--no-tools`, a fixture, or a different Pi binary.
- **PASS**: `get_commands` contains `plan`, and `/plan` is handled by an extension in RPC mode. **FAIL**: the command is absent, treated as plain prompt text, or has no machine-observable state.
- **PASS**: a repository scan finds no document claiming the steering-only default is the only deployed posture. **FAIL**: any listed document remains ambiguous.
- **PASS**: the rollback drill restores the prior build and relaunches full access without data loss. **FAIL**: rollback depends on deleting sessions or changing the database.

### Dependencies and sequencing

Phase 0 depends only on the existing deployment and installed Pi. Its evidence is the only prerequisite for 1A and F1. No downstream implementation starts from source assumptions alone.

### Security invariants preserved

- Verification output excludes raw model objects, command source paths, secrets, session files, environment, and prompt content.
- Full access stays host-selected. The phone cannot enable it.
- The legacy fail-closed supervisor default remains available.
- State-changing verification is never automatically retried. The `/plan` smoke is operator-run and restores its final mode before exit.
- Push and cached-client boundaries remain content-free and non-authoritative.

---

## Phase 1A - Exact Contracts and RPC-Safe Plan Bridge

### Goal and scope

Define the narrow wire contract and prove Plan enforcement before building runtime services. This phase converts the highest-risk unknowns into exact types, guards, extension behavior, and launch tests.

This phase does not expose browser endpoints, publish runtime state, add phone UI, or change visible styling.

### Ordered tasks

1. **Extend the shared Pi RPC and phone/relay protocol types.**
   - Change `packages/pi-rpc-protocol/src/types.ts` to add typed Pi commands for `get_available_models`, `set_model`, `get_available_thinking_levels`, `set_thinking_level`, and `get_commands` to `PiRpcCommand`.
   - Add `RuntimeStateDto`, `RuntimeOperation`, `RuntimeControlCommand`, and `CommandDescriptorDto` exactly as specified below.
   - Add bounded browser-safe `AvailableModelDto`, `RuntimeModelCatalogDto`, `CommandCatalogDto`, `RuntimeControlResponse`, and prompt abort or delivery types.
   - Keep raw Pi `Model` and raw `get_commands` rows relay-internal. Do not export them to the web.
   - Change `packages/pi-rpc-protocol/src/index.ts` to export the new public types and guards.

2. **Add exact guards and negative shapes.**
   - Change `packages/pi-rpc-protocol/src/guards.ts` to use exact-key validation for every new browser command and DTO.
   - Validate the seven thinking levels as a closed union.
   - Validate mode as `build | plan | executing-plan | unknown`.
   - Reject extra fields, raw paths, unsupported operations, unsupported levels or modes, unsafe ids, invalid revisions, and malformed catalogs.
   - Change `packages/pi-rpc-protocol/tests/guards.test.ts` to prove each positive and negative case.

3. **Create the pinned, RPC-safe Plan extension bridge.**
   - Create `extensions/pi-remote-plan/package.json`, `extensions/pi-remote-plan/tsconfig.json`, `extensions/pi-remote-plan/src/index.ts`, and `extensions/pi-remote-plan/tests/plan-mode.test.ts` using the installed Pi Plan example as the behavioral base.
   - Keep the real `/plan` command and `--plan` flag. Bare `/plan` remains an explicit toggle. Add deterministic `/plan on`, `/plan off`, `/plan execute`, and `/plan status` arguments for non-TUI callers.
   - Replace `ctx.ui.select()` and `ctx.ui.editor()` execution handoff with explicit command arguments.
   - Publish only an exact RPC status key and value for `build`, `plan`, or `executing-plan` through `ctx.ui.setStatus`. Do not serialize raw tool names to the phone.
   - Capture `pi.getActiveTools()` exactly once when entering Plan, remove `edit` and `write`, enforce the read-only Bash allowlist at `tool_call`, persist Plan, execution, todos, and prior tools, and restore the exact captured tool set before Build or execution.
   - Make `/plan execute` restore tools, publish `executing-plan`, persist state, and only then trigger execution.
   - A failed restore leaves execution blocked and publishes error or unknown. It never falls through to full-tool execution.
   - Change root `package.json` and generated `package-lock.json` so build, typecheck, and tests include `@pi-remote/plan-extension`.

4. **Pin the bridge into the verified full-access launch without narrowing desktop parity.**
   - Change `apps/pi-remote-relay/src/index.ts::fullAccessPiArguments()` to add the built project extension by explicit path while preserving built-in tools and normal extension discovery unless Phase 0 proves a duplicate `/plan` conflict.
   - Change `scripts/boot.mjs` to fail full-access preflight when the pinned Plan extension build is missing.
   - Pass `--plan` only for an explicit host-side cold-start choice. The phone never changes this flag.
   - Change `apps/pi-remote-relay/tests/rpc.test.ts` to assert the pinned extension path, absence of `--no-tools`, and cold-start `--plan` behavior.
   - Rerun the Phase 0 verifier against the pinned bridge before Phase 1B.

### Protocol and relay contracts introduced

```ts
interface RuntimeStateDto {
  sessionId: string;
  revision: number;
  model: { provider: string; id: string; label: string } | null;
  thinkingLevel: string;
  availableThinkingLevels: readonly string[];
  mode: "build" | "plan" | "executing-plan" | "unknown";
  streaming: boolean;
  updatedAt: string;
}

type RuntimeOperation =
  | { type: "set_model"; provider: string; modelId: string }
  | { type: "set_thinking_level"; level: string }
  | { type: "set_mode"; mode: "build" | "plan" };

interface RuntimeControlCommand {
  type: "runtime.control";
  controlId: string;
  sessionId: string;
  expectedRevision: number;
  operation: RuntimeOperation;
  ticket: string;
}

interface CommandDescriptorDto {
  name: string;
  description: string | null;
  source: "extension" | "prompt" | "skill";
  enabled: boolean;
  disabledReason: string | null;
  requiresConfirmation: boolean;
}

interface AvailableModelDto {
  provider: string;
  id: string;
  label: string;
}

interface RuntimeModelCatalogDto {
  sessionId: string;
  runtimeRevision: number;
  models: readonly AvailableModelDto[];
}

interface CommandCatalogDto {
  sessionId: string;
  revision: number;
  commands: readonly CommandDescriptorDto[];
}
```

### Objective acceptance checks

- **PASS**: all new protocol guards accept only documented exact shapes and reject every extra or unknown field. **FAIL**: a raw Pi response or unguarded record can enter web state.
- **PASS**: Plan removes `edit` and `write`, blocks destructive Bash, persists across resume, reports `plan`, and restores the exact prior or custom tool set before `build` or `executing-plan`. **FAIL**: browser state alone can make Plan appear active, or execution starts before tool restoration.
- **PASS**: the staged verifier observes the pinned extension in RPC mode and exact status transitions. **FAIL**: the bridge depends on a TUI prompt or an ambiguous text label.
- **PASS**: the full-access launch still keeps built-in tools and desktop parity. **FAIL**: pinning the bridge narrows full access or activates a phone-selected launch flag.

### Dependencies and sequencing

Phase 1A depends on Phase 0. It precedes runtime state because service behavior must compile against exact guards and proven Plan semantics.

### Security invariants preserved

- The protocol union remains closed and exact.
- The phone cannot select the launch posture or cold-start flag.
- The extension, not the browser, enforces Plan and exact-tool restoration.
- No raw Pi model, command, path, or tool list becomes a public type.

---

## Phase 1B - Serialized Runtime Authority and Redaction Core

### Goal and scope

Build the in-process authority core behind tests. This phase owns settled mutation ordering, runtime revisions, hydration, lifecycle invalidation, idempotency, delivery-unknown behavior, and safe projection. It intentionally stops before HTTP exposure.

### Ordered tasks

1. **Make supervisor mutation serialization and lifecycle observable.**
   - Change `apps/pi-remote-relay/src/rpc/supervisor.ts` to expose a mutation queue that serializes each mutation through response settlement, not only stdin writes.
   - Route prompt, abort, model, thinking, and mode mutations through it.
   - Keep read requests correlated and bounded outside the mutation lane where safe.
   - Add a supervisor lifecycle subscription so runtime state becomes `unknown` on child exit or restart.
   - Restore known runtime state only after the new child answers the required reads and the Plan extension republishes status.
   - Create `apps/pi-remote-relay/src/runtime/plan-status.ts` to parse only `extension_ui_request` records with the pinned status key and exact allowed values.
   - Ignore unknown status keys and text. Fail malformed allowed-key values closed to `unknown`.

2. **Create the authoritative runtime service.**
   - Create `apps/pi-remote-relay/src/runtime/runtime-service.ts` to own the per-session monotonic `revision`, sanitized model catalog, exact thinking levels, Plan status, streaming state, `updatedAt`, and bounded `controlId` idempotency records.
   - Initial and restart hydration call `get_state`, `get_available_thinking_levels`, and the Plan status bridge. Model catalog reads call `get_available_models`.
   - A model change refreshes `get_state` and `get_available_thinking_levels` as one reconciled update.
   - For `set_model` and `set_thinking_level`, validate against the current live catalog, compare `expectedRevision`, reject while the child is not live or state is unknown, send the real Pi command, then reread authoritative state before incrementing and publishing revision.
   - For `set_mode`, compare desired state with the bridge, send Pi `prompt` with `/plan on` or `/plan off`, wait for exact host status, then publish.
   - Preserve settled idempotent responses for bounded replay.
   - If transport fails after delivery may have occurred, store and return `delivery-unknown`. Never enqueue an automatic retry.

3. **Apply canonical redaction before projection.**
   - Change `apps/pi-remote-relay/src/store/redaction.ts` to add explicit safe projectors for model and command responses rather than passing raw Pi responses into generic JSON redaction.
   - Change `apps/pi-remote-relay/tests/redaction.test.ts` and `apps/pi-remote-relay/tests/security/negative-controls.test.ts` with canaries for API keys, absolute POSIX and Windows paths, `sessionFile`, command `path`, authorization, cookies, tool lists, and prompt content.

4. **Prove the authority core before transport exposure.**
   - Create `apps/pi-remote-relay/tests/runtime-control.test.ts` for success, stale revision, unsupported values, model to thinking refresh, Pi restart, mode confirmation, exact-tool restore, idempotent replay, mutation settlement ordering, and delivery-unknown.
   - Add a negative control that overlapping prompt, abort, model, thinking, and mode mutations cannot pass each other in the settled mutation lane.

### Protocol and relay contracts introduced

No browser endpoint is introduced. The runtime service consumes Phase 1A contracts and produces safe internal results that Phase 1C may expose only after guards and redaction pass.

### Objective acceptance checks

- **PASS**: replaying a settled `controlId` from the same device and content returns the settled result without a second Pi command. **FAIL**: any mutation is delivered twice.
- **PASS**: a stale `expectedRevision` sends no Pi command and returns current safe runtime state to the caller layer. **FAIL**: stale phone intent overwrites the host.
- **PASS**: model change updates model and supported thinking levels atomically. Unsupported levels never reach Pi. **FAIL**: the DTO can show an impossible pair.
- **PASS**: child restart immediately sets mode and runtime authority to unknown, disables mutation, and restores known state only after fresh Pi reads plus Plan status. **FAIL**: cached or pre-restart state remains actionable.
- **PASS**: timeout after possible delivery becomes `delivery-unknown` and generates no automatic retry. **FAIL**: reconnect or caller retry silently repeats a mutation.
- **PASS**: explicit projectors remove path, secret, prompt, session, and tool-list canaries before any DTO or envelope is returned. **FAIL**: generic redaction is the only boundary for raw model or command objects.

### Dependencies and sequencing

Phase 1B depends on 1A. It precedes endpoints so network behavior cannot conceal authority defects. F2 may run concurrently because it owns disjoint web infrastructure files.

### Security invariants preserved

- Canonical redaction happens before sync, persistence, DTO return, or broadcast.
- Runtime mutations bind session, device, idempotency id, operation, and current revision at the service boundary.
- Mutation serialization covers prompts and controls, closing model, mode, prompt, and abort races.
- Delivery-unknown is terminal until explicit reconciliation.
- Restart invalidates browser-actionable runtime state.

---

## Phase 1C - Narrow Relay Exposure and Dark End-to-End Slice

### Goal and scope

Expose only the proven authority core through authenticated, rate-bounded routes and the existing sync path. Add the safe command catalog, prompt mode semantics, abort, and a black-box harness. This is the first end-to-end demoable increment and remains visually dark.

### Ordered tasks

1. **Create the safe command catalog and reuse prompt submission.**
   - Create `apps/pi-remote-relay/src/commands/command-service.ts` to call Pi `get_commands`, remove `path` and `location`, map source to `extension | prompt | skill`, apply a server allowlist and denylist, and assign a catalog revision.
   - Hide unknown or privileged commands by default, including credential, session, reload, share, and package administration.
   - Never expose `!`, `!!`, raw Bash or editor commands, or a raw RPC field.
   - Change `apps/pi-remote-relay/src/prompt/prompt-service.ts` so a leading-slash prompt is revalidated against the current filtered catalog immediately before the existing `prompt` call.
   - Keep one ticketed `prompt.submit` path. Do not add a command-execute authority.
   - Idle Send uses Pi `prompt`. Active Steer uses `prompt` with `streamingBehavior: 'steer'`. Later uses `prompt` with `streamingBehavior: 'followUp'`.
   - Extension commands are accepted only through the prompt path, never Steer or Later.
   - Add a ticketed abort command and endpoint for Stop. Treat uncertain abort as delivery-unknown and never repeat it automatically.

2. **Expose narrow authenticated endpoints and sync state.**
   - Change `apps/pi-remote-relay/src/auth/policy.ts` to add only `runtime:read`, `runtime:control`, `commands:list`, and `prompt:abort`. Unknown actions remain denied.
   - Change `apps/pi-remote-relay/src/http/server.ts` to add the endpoints in the contract table below, exact body guards, a runtime-control limiter separate from the general request limiter, one-use ticket consumption for mutations, same-session and same-device checks, and a requirement that the mutating device has a live authenticated sync socket.
   - Change `apps/pi-remote-relay/src/index.ts` to construct and inject runtime and command services and publish `runtime.state` envelopes through the existing `SyncHub` after canonical redaction.
   - Change `apps/pi-remote-relay/src/fixtures/pi-rpc.jsonl` and `apps/pi-remote-relay/tests/integration/recorded-fixture-flow.test.ts` to include safe runtime-state and Plan-status records without secret or path fixtures.

3. **Prove the dark control plane before UI work.**
   - Extend `apps/pi-remote-relay/tests/runtime-control.test.ts` with route, ticket, foreground socket, rate-limit, and response-code coverage.
   - Create `apps/pi-remote-relay/tests/commands.test.ts` for filtering, path stripping, start-of-input validation, extension-command prompt routing, and hidden privileged or unknown commands.
   - Extend `apps/pi-remote-relay/tests/prompt.test.ts`, `apps/pi-remote-relay/tests/security/negative-controls.test.ts`, and `apps/pi-remote-relay/tests/rpc.test.ts` for ticket replay, rate limits, same-device foreground authority, unknown operation denial, abort, prompt modes, and mutation serialization.
   - Extend `scripts/verify-full-access-runtime.mjs` as the unstyled harness for list, set, prompt mode, abort, stale, restart, and reconcile behavior.
   - Rerun every Phase 0 check after the project Plan extension and relay routes are integrated.

### Protocol and relay contracts introduced

| Endpoint | Action | Ticket | Result |
| --- | --- | --- | --- |
| `POST /api/runtime/state` | `runtime:read` | No, authenticated read | `{ state: RuntimeStateDto }` from live host state. Cache is never authority. |
| `POST /api/runtime/models` | `runtime:read` | No, authenticated and rate-bounded read | `RuntimeModelCatalogDto` with no raw Pi model fields. |
| `POST /api/commands/list` | `commands:list` | No, authenticated and rate-bounded read | `CommandCatalogDto` with no path, location, or raw command fields. |
| `POST /api/runtime/control` | `runtime:control` | Yes, consumed once for the same session, device, and action | Host-confirmed `RuntimeStateDto`, or explicit stale, unsupported, unavailable, or delivery-unknown result. |
| `POST /api/prompt/submit` | `prompt:submit` | Existing one-use ticket | Existing authoritative user block. Leading slash is revalidated and still sent through Pi `prompt`. |
| `POST /api/prompt/abort` | `prompt:abort` | Yes, consumed once | Host-confirmed abort or explicit unavailable or delivery-unknown result. |

HTTP semantics are fixed for buildability:

- 200 for reads and idempotent settled replay
- 202 for a newly accepted and confirmed mutation
- 400 for malformed shape
- 401 or 403 for authentication or authority failure
- 409 for stale revision or conflicting id reuse
- 422 for unsupported model, level, mode, or command
- 429 for rate limit
- 503 for unavailable or delivery-unknown host outcome

The response body, not a blind retry, distinguishes unavailable from delivery-unknown.

### Objective acceptance checks

- **PASS**: replaying a consumed ticket fails, while settled idempotent replay returns the prior result without a second Pi command. **FAIL**: a mutation can be delivered twice.
- **PASS**: stale `expectedRevision` returns 409 with current safe runtime state and sends no Pi command. **FAIL**: stale state reaches the host.
- **PASS**: command descriptors contain no `path`, `location`, secrets, or privileged or unknown commands, and slash submission uses the existing ticketed prompt service. **FAIL**: selection gains a second execution authority.
- **PASS**: a mutation from a device without a live authenticated sync socket is denied. **FAIL**: background or stale phone state can mutate runtime.
- **PASS**: push bytes and `apps/pi-remote-web/src/attention.ts` remain content-free. **FAIL**: runtime or command strings enter a push payload.
- **PASS**: the unstyled harness changes model, effort, and mode, observes host-confirmed state, lists only safe commands, exercises Send, Steer, Later, and Stop, and reconciles restart and delivery-unknown. **FAIL**: any state is inferred from local intent.

### Dependencies and sequencing

Phase 1C depends on 1B. It is the runtime lane input to Merge gate A. Visible controls remain blocked until F2 also passes.

### Security invariants preserved

- The auth action union remains default-deny.
- Raw RPC and raw command execution do not exist.
- Runtime, abort, and prompt mutations consume one-use tickets and bind session, device, action, idempotency id, and revision where applicable.
- Slash commands reuse ticketed prompt authority.
- Foreground authority requires a live authenticated sync socket.
- Delivery-unknown remains terminal until explicit reconciliation.

---

## Foundation F1 - Inert Claude Tokens and Deterministic Fonts

### Goal and scope

Land the static, reversible part of the verified Claude restyle with no visible product change. This phase owns exact source primitives, Pi Remote semantic aliases under an opt-in scope, and the deterministic offline font pair.

F1 may run beside 1A after Phase 0. It must not edit `App.tsx`, protocol or relay source, root package dependency files, current component selectors, icon or manifest colors, or global token values used by legacy surfaces.

### Ordered tasks

1. **Add the exact Claude source primitives under new names.**
   - Change `apps/pi-remote-web/src/style.css` to add the verified `@theme` block with exact Claude primitives: bone, paper, soft stone, carbon ink, graphite, ashen, pebble, mist, chalk, obsidian, clay, reference font identities, 11, 14, 24, and 30 type steps, 8, 16, 24, 32, 40, 64, 80, and 96 spacing steps, 8, 16, and 24 radii, and the two paper shadows.
   - Keep source primitives distinct from application roles.
   - `--font-display` and `--font-ui` name the bundled families. `--font-anthropic-*` remains a reference only.

2. **Add the Pi Remote semantic alias layer under an opt-in scope.**
   - Add theme-aware roles for canvas, surfaces, ink tiers, safe tertiary text, disabled text, placeholder, lines, control boundary, accent, actions, focus, operational semantic colors, diffs, radii, typography, layout, spacing, and motion.
   - Record every current token against the restyle disposition table.
   - Delete no current token without an alias through Phase 4A cutover.
   - New or migrated roots opt in. Unmigrated surfaces retain legacy aliases.

3. **Commit the deterministic offline font supply chain.**
   - Add `apps/pi-remote-web/public/fonts/source-serif-4-4.005r-regular.woff2` and `apps/pi-remote-web/public/fonts/inter-4.1-roman-variable.woff2` as the only committed font files.
   - Add the two OFL license files and `font-assets.json` with family, release, source URL, archive SHA-256, extracted path, committed path, byte length, and committed-file SHA-256.
   - Verify archive checksum before extraction and committed checksum after extraction.
   - Require `sha256sum -c` or the cross-platform Node equivalent in CI.
   - Do not subset. Do not use an unverified hash. Do not add an external origin.
   - Add `@font-face` declarations for `Source Serif 4` weight 400 and `Inter` weights 400 through 600 with `font-display: swap`, no `local()`, and deterministic system fallbacks.

### Protocol and relay contracts introduced

No phone or relay authority contract is introduced. F1 adds only inert web definitions and static assets.

### Objective acceptance checks

- **PASS**: existing Phase 0 screenshots remain pixel-stable. **FAIL**: any body font, global alias, component selector, icon, or manifest appearance changes.
- **PASS**: every current token has a final declaration or explicit alias and no undefined token use remains. **FAIL**: a token is deleted or renamed without an alias through cutover.
- **PASS**: both archive and committed-file font hashes verify and only the two WOFF2 files ship. **FAIL**: a font hash is unverified or an external asset origin appears.
- **PASS**: F1 rollback removes only inert token declarations, font files, licenses, and the font manifest. **FAIL**: rollback touches authority, storage, or legacy selectors.

### Dependencies and sequencing

F1 depends on Phase 0 screenshots and rollback evidence. It precedes F2. It may run beside 1A because file ownership is disjoint.

### Security invariants preserved

- Runtime font and asset requests to external origins remain prohibited.
- No visual class or asset manifest contains runtime, prompt, tool, or session content.
- Legacy selectors and current visible values stay unchanged.
- The change is reversible and independent of protocol, authority, ticketing, revision, and storage.

---

## Foundation F2 - Inert Theme Bootstrap and Cache Rollback

### Goal and scope

Complete the reversible PWA infrastructure needed by visible phases. This phase owns first-paint theme authority, font preloads, release-specific caches, explicit activation, two-generation retention, and executable upgrade and downgrade proof.

F2 may run beside 1B and 1C. It must not edit `App.tsx`, protocol or relay source, or root dependency files before Merge gate A.

### Ordered tasks

1. **Add the inert pre-paint theme bootstrap and font preloads.**
   - Change `apps/pi-remote-web/index.html` to add the validated bootstrap after `theme-color` and before any stylesheet, render-affecting preload, or module script.
   - Use current `#f4f5f7` light and `#101319` dark shell constants so the foundation stays visually inert.
   - Add exactly two font preloads with `as="font"`, `type="font/woff2"`, and `crossorigin`.
   - Keep `data-theme="system"` as the no-script fallback.
   - Keep the bootstrap static, with no user-controlled interpolation and no external request.
   - Change `apps/pi-remote-web/src/main.tsx` to read validated `document.documentElement.dataset.theme` before `createRoot`, pass it as initial App theme, and install one runtime theme authority with one `matchMedia` listener that recomputes only resolved theme for system preference.

2. **Add release-specific cache manifests and two-generation retention.**
   - Change `apps/pi-remote-web/public/service-worker.js` to name caches `pi-remote-shell-<release-id>` and `pi-remote-assets-<release-id>`.
   - Embed `CURRENT_RELEASE` and `PREVIOUS_RELEASE` plus exact shell and font manifests.
   - Retain current and previous release caches after clients are on the new worker.
   - Keep push and API bypass unchanged.
   - Never cache `/service-worker.js`, `/api/*`, or `/health`.
   - Replace unconditional install-time `skipWaiting()` with an explicit update-ready activation handshake.
   - Never rename or overwrite a versioned font in place.

3. **Prove inertness, font integrity, and cache behavior.**
   - Add screenshot tests that the Phase 0 state stays pixel-stable except elimination of a wrong-theme flash.
   - Recheck archive and committed-file hashes.
   - Add cache upgrade and downgrade drills that keep one previous generation available.
   - Add first-paint tests that delay `/src/main.tsx` and the JS bundle.
   - Cover explicit light, explicit dark, system light, system dark, a live system change, corrupt storage, blocked storage, and no-script fallback.
   - Assert `data-theme`, `data-resolved-theme`, computed canvas color, and `theme-color` before React loads.

### Protocol and relay contracts introduced

No authority contract is introduced. Push payloads, API bypass, ticketing, revisions, redaction, transcript storage, and browser session storage remain unchanged.

### Objective acceptance checks

- **PASS**: existing screenshots are pixel-stable except elimination of a wrong-theme flash. **FAIL**: any visible restyle lands before 4A.
- **PASS**: all eight first-paint cases show correct theme before React loads with no opposite-theme frame. **FAIL**: a frame renders the wrong theme.
- **PASS**: cache upgrade and downgrade retain current and one previous release and cold-load offline with both bundled fonts. **FAIL**: an old cache is deleted early or a font misses the cache.
- **PASS**: both font hash classes still verify after cache integration. **FAIL**: a cache manifest references an unmanifested or external font.
- **PASS**: rollback removes only inert `style.css` additions, font assets, bootstrap, `main.tsx` cooperation, and worker manifests. **FAIL**: rollback touches protocol, session data, or legacy selectors.

### Dependencies and sequencing

F2 depends on F1. It joins 1C at Merge gate A. It cannot mask control defects because visible UI stays unchanged and the runtime lane is verified independently before the merge.

### Security invariants preserved

- The bootstrap uses a validated enum, static source text, no external request, and no user-controlled interpolation.
- If CSP arrives, the exact script uses a nonce or pinned hash, never `unsafe-inline`.
- Push remains content-free and service-worker API bypass is unchanged.
- Cache activation never makes partial assets authoritative.
- Rollback remains recoverable without session or transcript storage changes.

---

## Phase 2A - Host-Backed Runtime Controls on the Existing Session View

### Goal and scope

Ship the first visible phone slice on top of Merge gate A. Add authoritative Model, Effort, and Build or Plan controls while retaining the old transcript and composer. This isolates runtime behavior from command and compose changes.

### Ordered tasks

1. **Add non-authoritative runtime client state.**
   - Create `apps/pi-remote-web/src/runtime.ts` with a reducer for `loading | checking | ready | pending | stale | error`, current `RuntimeStateDto`, model and command catalogs, and selected pending control id.
   - Never hydrate runtime state from `apps/pi-remote-web/src/cache.ts`.
   - On session selection or reconnect, start at `checking` and disable controls until fresh runtime read or guarded `runtime.state` sync reconciliation.
   - Change `apps/pi-remote-web/src/state.ts` only to route safe runtime envelopes without altering transcript normalization, stable ids, snapshot barriers, or cache and relay provenance.

2. **Add guarded relay client functions.**
   - Change `apps/pi-remote-web/src/relay.ts` to add `fetchRuntimeState`, `fetchRuntimeModels`, `fetchCommands`, `controlRuntime`, and `abortPrompt` using shared guards.
   - `controlRuntime` obtains a fresh one-use ticket immediately before mutation and sends current `expectedRevision`.
   - Do not mutate a persistent chip until host response or sync state arrives.
   - Preserve delivery-unknown as a distinct error identity so UI code cannot turn it into generic retry.

3. **Build the persistent runtime strip.**
   - Create `RuntimeStrip.tsx` to compose `ModelSheet`, `EffortSheet`, and `ModeSwitch` above the existing composer.
   - Closed model text is always `Model · <short label>`. It never collapses to effort-only text.
   - Closed effort text is `Effort · <exact level>`.
   - Build `ModelSheet` with React Aria dialog, search, and list primitives. Group live results by provider, check host-selected row, and show pending only on the chosen row.
   - Build `EffortSheet` as a React Aria single-select list. Render only host-supported values with exact Off, Minimal, Low, Medium, High, Extra high, and Max labels plus short hints. Hide or collapse when the only choice is off.
   - Build `ModeSwitch` with labeled React Aria Build and Plan controls. Show `Mode · Checking…` while authority is unknown and `Plan · read-only` only after host confirmation. Do not label it Tab.

4. **Mount the strip without changing composer or transcript behavior.**
   - Change `App.tsx::Session` to own runtime fetch and sync state for the strip.
   - Keep existing `TranscriptList`, `Block`, prompt submit, and textarea behavior for this milestone.
   - Disable mutation when connection is non-live, snapshot barrier is active, runtime is unknown, or a relevant mutation is pending.
   - Reinforce host-confirmed Plan in session title and status copy without changing prompt behavior yet.

5. **Add functional runtime-control styling and tests.**
   - Opt only RuntimeStrip, ModelSheet, EffortSheet, and ModeSwitch into Claude semantic aliases.
   - Implement 44px targets, keyboard-safe sheets, long labels, light and dark support, and complete React Aria rest, hover, pressed, selected, focus-visible, disabled, pending, and error states.
   - Test host-confirmed updates, no optimistic chips, stale revision refresh, rejection, delivery-unknown, reconnect checking, model to effort refresh, exact effort levels, Plan label, disabled stale state, Escape, focus return, and logical tab order.
   - Keep old transcript and composer screenshots unchanged outside the new strip.

### Protocol and relay contracts introduced

No new authority is introduced. Phase 2A consumes `RuntimeStateDto`, model catalog, runtime control, and sync contracts from the runtime lane.

### Objective acceptance checks

- **PASS**: model and effort chips match host state after success, rejection, stale revision, reconnect, and Pi restart. **FAIL**: any committed chip is optimistic or cached.
- **PASS**: changing model refreshes visible supported effort levels as one update and never leaves an impossible combination. **FAIL**: stale effort remains selectable.
- **PASS**: Plan chrome appears only after host confirmation, survives reconnect, and becomes Checking when authority is unknown. **FAIL**: local toggle state can claim read-only mode.
- **PASS**: current prompt and transcript behavior, virtualization, cache, sync barriers, approvals, attention, and push tests remain green. **FAIL**: runtime strip work changes existing semantics.

### Dependencies and sequencing

Phase 2A depends on Merge gate A. It precedes commands and composer replacement so the first visible controls can be diagnosed against stable existing behavior.

### Security invariants preserved

- Controls render only redacted DTOs and remain disabled without fresh foreground authority.
- Every mutation uses relay endpoint, fresh one-use ticket, and current revision.
- Plan state is host-confirmed with no local fallback to on.
- Runtime authority never enters browser cache.
- Delivery-unknown has no automatic UI retry.
- Push remains content-free.

---

## Phase 2B - Commands, Explicit Composer, and Draft Recovery

### Goal and scope

Complete the mobile control dock while retaining the block transcript. Add slash discovery, allowlisted quick actions, multiline composition, explicit Send, Steer, Later, and Stop, immutable pending snapshots, independent new draft, and exact recovery states.

### Ordered tasks

1. **Build slash typeahead and discoverable quick actions.**
   - Create `CommandPalette.tsx` with React Aria `ComboBox`, `Input`, `Popover`, `ListBox`, and `ListBoxItem` for `/` as the first non-whitespace character only.
   - Add one visible Commands or plus `Button`. Do not add a permanent row of command icons.
   - Show `/name`, safe description, and source label.
   - Selection inserts `/name ` into draft, returns focus to composer, and never submits.
   - Render two to four allowlisted quick actions from the same catalog or safe draft templates.
   - Every quick action fills draft. None executes automatically.
   - Exclude `!`, `!!`, raw shell, raw RPC, credential, reload, share, and package operations.

2. **Replace the compose box with an explicit action dock.**
   - Create `ComposerDock.tsx` with React Aria `TextArea` and `Button` components, autosized from one to six lines and padded above `env(safe-area-inset-bottom)`.
   - Touch and plain Return insert newline.
   - `Cmd+Enter` or `Ctrl+Enter` is an optional hardware-keyboard submit shortcut. Visible controls remain primary.
   - When idle, expose Send. When streaming, expose Steer, Later, and Stop with clear labels.
   - Extension slash commands remain restricted to prompt and cannot use Steer or Later.
   - On submit, freeze an immutable submitted snapshot and immediately create a new editable draft.
   - Safely rejected submission offers exact failed-draft restoration without overwriting new text.
   - Delivery-unknown shows Reconcile, not Retry, and never sends again automatically.

3. **Integrate controls without changing the transcript renderer.**
   - Change `App.tsx::Session` to integrate runtime, command, and composer state while keeping existing `TranscriptList` and `Block` rendering.
   - Disable mutations when connection is non-live, snapshot barrier is active, runtime is unknown, or relevant mutation is pending.
   - Reinforce Plan in session title, composer placeholder, and tint only from `RuntimeStateDto`.
   - Convert empty transcript state to a calm greeting with current model, effort, and mode plus three fill-draft actions. Never auto-submit.
   - Remove the old plain Enter submit path only after new keyboard tests pass.

4. **Add functional styling, not final polish.**
   - Change `style.css` for a two-row sticky footer at narrow widths, 44px targets, keyboard-safe sheets, safe-area padding, visible focus, selected, pending, disabled, and error states, long label wrapping, and light or dark compatibility.
   - Use Claude semantic tokens only inside the Phase 2 opt-in scope.
   - Put only RuntimeStrip, ModelSheet, EffortSheet, ModeSwitch, CommandPalette, ComposerDock, and empty greeting in the scope.
   - Implement complete React Aria state rows.
   - Do not restyle legacy transcript, Home, Review, Attention, Enrollment, top bar, icon, or manifest.
   - Do not remove timeline rail or restyle transcript blocks.

5. **Test behavior before aesthetics.**
   - Change `apps/pi-remote-web/tests/App.test.tsx` for slash filtering, insertion without submission, quick-action draft fill, immutable pending submit, independent draft, safe rejection restore, delivery-unknown reconcile, Send, Steer, Later, Stop, and disabled stale-state controls.
   - Add keyboard tests for Return newline, optional hardware submit, command focus return, Escape closing sheets, and logical tab order.
   - Rerun Phase 2A host-confirmed control cases.

### Protocol and relay contracts introduced

| UI | Contract | Host method or bridge |
| --- | --- | --- |
| Model sheet | `runtime.control` with `set_model` | Pi `set_model`, then `get_state` and `get_available_thinking_levels` |
| Effort sheet | `runtime.control` with `set_thinking_level` | Pi `set_thinking_level`, then authoritative state read |
| Build or Plan | `runtime.control` with `set_mode` | Pi `prompt` with `/plan on` or `/plan off`, then extension status confirmation |
| Slash palette | `commands.list` read | Pi `get_commands`, relay-filtered |
| Selected slash or quick action | Draft insertion only | No host call before explicit submit |
| Send, Steer, or Later | Existing ticketed `prompt.submit` | Pi `prompt` with applicable streaming behavior |
| Stop | Ticketed `prompt.abort` | Pi `abort` |

### Objective acceptance checks

- **PASS**: `/` opens only in command position, VoiceOver receives a list announcement, and selection inserts without submitting. **FAIL**: mid-prompt slash opens or selection executes.
- **PASS**: command rows and browser network payloads contain no source path, location, or secret. **FAIL**: a raw `get_commands` row reaches browser.
- **PASS**: plain Return creates newline, visible actions stay above software keyboard and safe area, and hardware submit is optional. **FAIL**: touch Enter dispatches.
- **PASS**: rejected prompts preserve exact failed snapshot without overwriting new draft. Delivery-unknown offers no automatic retry. **FAIL**: draft is lost or mutation repeats.
- **PASS**: Send, Steer, Later, and Stop use only their documented prompt or abort paths. **FAIL**: an extension slash command bypasses prompt authority.
- **PASS**: current block renderer, virtualization, cache, sync barriers, approvals, attention, and push tests remain green. **FAIL**: composer work changes transcript semantics.

### Dependencies and sequencing

Phase 2B depends on 2A. It precedes transcript replacement so composer and security behavior can be tested against the old renderer.

### Security invariants preserved

- Selection and insertion are not authority.
- Unknown or privileged commands are absent.
- Slash execution remains ticketed prompt submission.
- Stop is ticketed and delivery-unknown is not retried.
- Immutable pending submit remains separate from editable draft.
- Push remains content-free and unchanged.

---

## Phase 3A - Derived Turns and Typed Evidence Parity

### Goal and scope

Replace equal event cards with a conversational turn view while preserving every typed block and every storage, sync, replay, cache, redaction, and virtualization invariant. Streaming labels, reader-away behavior, and Plan execution handoff remain for 3B.

### Ordered tasks

1. **Create a pure derived turn model.**
   - Create `group-blocks-into-turns.ts` with pure `groupBlocksIntoTurns(blocks)`.
   - Start a turn at each user `TextBlock` and attach following assistant text and typed evidence until the next user block.
   - Put leading or orphan evidence in stable synthetic turn keyed from first block id.
   - Derive stable turn keys from constituent ids and preserve block objects and revisions.
   - Never mutate, renumber, persist, or reproject blocks.
   - Test empty, orphan, streaming revision replacement, parallel or interleaved tools, unknown blocks, consecutive user blocks, and stable keys.

2. **Extract typed renderers and build turn components.**
   - Create `TypedBlock.tsx` by moving current Block, DiffPatch, thinking Disclosure, plan, tool, diff, usage, and unknown renderers without dropping any kind.
   - Create `TurnList.tsx` to virtualize turns and measure variable height with the existing `@tanstack/react-virtual` strategy.
   - Create `Turn.tsx` with compact raised user prompt, borderless assistant prose, and nested muted meta or evidence.

3. **Add signal-based execution disclosure.**
   - Create `WorkingGroup.tsx` to group thinking, tool, and usage evidence for a turn.
   - Keep errors, plans, approvals, and diffs expanded or prominent.
   - Collapse routine successful tool activity and usage only after settlement.
   - Keep every original typed block recoverable through React Aria Disclosure primitives.
   - Do not pair tool call and result by tool name when parallel execution interleaves.
   - Preserve source order and expand whole group when any result is error.

4. **Integrate the derived view without touching authority state.**
   - Change `App.tsx` to replace old TranscriptList presentation with TurnList only after every typed kind has equivalent coverage.
   - Remove in-file Block renderer only after parity tests pass.
   - Keep `state.ts`, `cache.ts`, relay transcript projector, sync, replay, and storage contracts unchanged unless a failing parity test proves a missing safe field.
   - Any proposed schema change requires separate review and returns to the runtime lane.

5. **Replace event-card styling with conversation hierarchy.**
   - Remove decorative timeline rail and reduce oversized session heading.
   - Use about 16px body text with about 1.6 line height and Pi Remote semantic 8, 12, 16, and 24 rhythm backed by Claude source scale.
   - Opt TurnList, Turn, typed evidence, and WorkingGroup into Claude semantic scope.
   - Implement complete state rows for owned components.
   - Keep user prompts as compact Stone or Paper bubbles, assistant prose borderless at 66ch, and code or evidence on bounded `#0f0f0e` surface.
   - Reserve cards and borders for plans, diffs, errors, approvals, and disclosed evidence.
   - Distinguish hierarchy with surface, weight, and spacing, not extra accent colors.

6. **Prove hierarchy and replay parity.**
   - Change `App.test.tsx` to assert every typed renderer remains reachable, errors, plans, and diffs remain prominent, and routine success collapses only after settlement.
   - Extend recorded fixture flow only if deterministic multi-turn or revision fixtures are needed.
   - Do not change persisted authority shapes for presentation convenience.

### Protocol and relay contracts introduced

No new phone or relay contract is introduced. `groupBlocksIntoTurns` is a pure browser view model over guarded, redacted `TranscriptBlock` values. Its output is never persisted or sent to relay.

### Objective acceptance checks

- **PASS**: same block list always produces same turn keys and order, and higher block revision updates its turn without duplication. **FAIL**: grouping changes storage or sequence semantics.
- **PASS**: text, thinking, plan, tool call, tool result, file diff, usage, and unknown blocks remain renderable and recoverable. **FAIL**: typed evidence disappears.
- **PASS**: routine successful execution settles collapsed while error, plan, approval, or diff stays prominent. **FAIL**: high-signal evidence is hidden by default.
- **PASS**: transcript cache, sync, replay, redaction, virtualization, and snapshot-gap tests remain green. **FAIL**: presentation work changes authority state.

### Dependencies and sequencing

Phase 3A depends on 2B. It precedes live-edge and Plan-card work so renderer parity is proven before scroll and execution behavior add complexity.

### Security invariants preserved

- Grouping occurs only after guarded and redacted data enters browser state.
- No new transcript or raw evidence endpoint is introduced.
- Stable ids, revisions, snapshot barriers, and replay remain authoritative.
- Typed evidence remains recoverable.

---

## Phase 3B - Streaming Phases, Reader-Controlled Live Edge, and Plan Handoff

### Goal and scope

Complete the calm live-session hierarchy over the proven turn view. Add named work phases, elapsed time, reader-position-aware recovery, throttled announcements, and extension-confirmed Plan execution handoff.

### Ordered tasks

1. **Add named streaming phases and elapsed time.**
   - Create `working-phase.ts` to derive stable labels from authoritative runtime streaming state and last meaningful redacted block: Thinking, Using tool, or Writing response.
   - Use runtime transition `updatedAt` as working start when available.
   - While live show labels such as `Thinking · 12s`.
   - After settlement collapse to `Worked for 28s · 5 steps`.
   - Announce phase changes, errors, and settlement through one throttled polite live region.
   - Never announce token deltas or timer ticks.

2. **Implement reader-controlled live edge.**
   - Create `LiveEdgeButton.tsx` and integrate with virtualizer scroll element.
   - Follow content only while reader is within bottom threshold.
   - Otherwise preserve anchored item and offset and show `N new · Jump to latest`.
   - Count meaningful block additions and turn revisions, not timer ticks.
   - Clear count only after user returns to live edge.

3. **Create the Plan card and safe handoff.**
   - Create `PlanCard.tsx` for todos, completion, Refine, and Build this plan.
   - Refine fills draft and focuses composer. It never auto-submits.
   - Build this plan uses separate explicit confirmation.
   - Send `/plan execute` through ticketed prompt path and wait for `mode: executing-plan` before showing execution as started.
   - Timeout or unknown blocks execution UI and offers Reconcile, never Retry.

4. **Complete integration, styling, and parity proof.**
   - Integrate working phase, live edge, and Plan card without changing authority reducers or persistence.
   - Opt Plan, working, and live-edge roots into Claude semantic scope with complete React Aria states.
   - Test phase transitions, elapsed labels, anchored scrolling, meaningful counts, Jump behavior, live-region throttling, Plan refine, confirmation, execution status, timeout, and reconcile.
   - Rerun every 3A typed parity and replay gate.

### Protocol and relay contracts introduced

Phase 3B consumes existing block ids, revisions, sequences, kinds, timestamps, `RuntimeStateDto.streaming`, mode, `updatedAt`, sync barriers, and ticketed prompt submission. No new authority contract is introduced.

### Objective acceptance checks

- **PASS**: scrolling away freezes position and increments `N new`, and Jump returns reliably after additions and revisions. **FAIL**: streaming force-scrolls reader.
- **PASS**: live-region output announces phase transitions and errors without token or timer chatter. **FAIL**: VoiceOver receives continuous updates.
- **PASS**: Build this plan cannot appear started until extension reports `executing-plan` after exact-tool restoration. **FAIL**: browser click alone starts or claims execution.
- **PASS**: same typed block, cache, sync, replay, redaction, virtualization, and snapshot-gap gates from 3A remain green. **FAIL**: live behavior changes authority or persistence.

### Dependencies and sequencing

Phase 3B depends on 3A. It precedes final visual cutover because device density and motion must be tuned against final hierarchy and reader behavior.

### Security invariants preserved

- Plan execution remains ticketed and extension-confirmed.
- Refine and Plan actions never auto-submit or auto-retry.
- Live-edge and announcements expose only already-redacted labels and counts.
- Reader state never becomes relay or runtime authority.

---

## Phase 4A - Global Claude Cutover, Restrained Motion, and Turn Actions

### Goal and scope

Freeze the final release-candidate presentation. Migrate legacy surfaces, flip global aliases, eliminate residue, limit motion to comprehension, and add quiet settled-response actions without expanding authority.

### Ordered tasks

1. **Own the global Claude token cutover and legacy surface migration.**
   - Finalize compact session chrome, runtime strip wrapping, sheet sizing, turn surfaces, 44px targets, 200% text wrapping, dark mode, safe areas, and standalone-PWA viewport behavior with final Claude semantic light and dark tokens.
   - Flip root aliases, remove opt-in scaffolding, and eliminate old hex values, raw `oklch(...)`, duplicated system-dark blocks, raw white fills, body gradient, backdrop filter, hover translate, continuous pulses, and former font references.
   - Migrate shell, Home, Review, Attention, Enrollment, push settings, empty and error states, and TurnActions menu states.
   - Review uses 30px Serif title, Paper approval cards, Carbon primary approval, outlined danger Deny, and secondary grant.
   - Attention uses label-first Paper rows with neutral icon wells.
   - Enrollment uses one 24px Paper card and Carbon primary action.
   - Add `scripts/verify-pi-remote-visual-literals.mjs` and reviewed `visual-literals.allowlist.json`.
   - Require zero residual matches across CSS, TSX, TS, HTML, SVG, web manifest, and service-worker asset manifests.
   - Change bootstrap and `theme-color` to `#f8f8f6` light and `#181715` dark.
   - Change manifest background and theme to `#f8f8f6`.
   - Change icon to approved Carbon, Bone, and Clay literals with self-contained pi path inside maskable safe zone instead of text.
   - Keep model label visible under truncation and prevent runtime strip overlap.

2. **Limit motion to state comprehension.**
   - Use only short focus, sheet or row, Plan pill, and Jump-to-latest transitions.
   - Remove continuous pulses, token animation, moving settled content, and decorative glass effects.
   - Under reduced motion, remove spatial and continuous animation while retaining immediate textual pending, selected, and error changes.

3. **Add quiet settled-response actions.**
   - Create `TurnActions.tsx` with React Aria menu primitives, opened by overflow or long press on settled conversational turns.
   - Provide Copy, Retry, and Edit and resend only where semantically valid.
   - Retry and Edit create or restore draft for explicit review. They never auto-submit.
   - Delivery-unknown turns do not expose Retry until reconciliation proves original did not settle.
   - Evidence and tool sections keep only Expand or Collapse.
   - Do not add persistent action rows to every block.

4. **Run automated release-candidate checks.**
   - Add web tests for reduced motion, large text, long labels, menu actions, no auto-submit, and reconciled retry.
   - Run token inventory, residual allowlist, contrast inventory, all interaction-state matrices, responsive browser checks, and cold-offline automated checks.
   - Freeze visual candidate before Phase 4B physical testing.

### Protocol and relay contracts introduced

No protocol contract is introduced. Any newly discovered protocol need returns to the runtime lane and reruns all downstream phases. It is not patched into polish.

### Objective acceptance checks

- **PASS**: reduced motion removes spatial and continuous animation and settled content does not move. **FAIL**: pulse or token animation remains.
- **PASS**: Copy, Retry, and Edit and resend are available only on valid settled turns and never auto-submit. **FAIL**: delivery-unknown action can repeat blindly.
- **PASS**: residual literal verifier, token inventory, contrast matrix, font checks, and first-paint tests pass with no unreviewed exception. **FAIL**: any old or external visual dependency remains.
- **PASS**: at automated 200% text and long strings, sheets and dock wrap without overlap or horizontal page scroll. **FAIL**: active model identity is hidden or actions collide.

### Dependencies and sequencing

Phase 4A depends on 3B. It produces the frozen candidate for physical-device verification. No feature work enters after freeze without reopening the owning upstream phase.

### Security invariants preserved

- Visual work does not alter endpoint authority, ticketing, revisions, redaction, Plan enforcement, or retry rules.
- Turn actions prepare drafts only.
- No asset manifest, class, label, or preview contains prompt, tool, path, or session content.
- Push parsing and content-free payload behavior stay unchanged.

---

## Phase 4B - Physical-iPhone Release and Rollback Gate

### Goal and scope

Prove the frozen candidate on a physical iPhone as an installed standalone PWA. Tune only defects revealed by objective device checks. This phase owns release evidence, rollback, full reconciliation scenarios, and the authoritative workspace gate.

Voice input, one-message model override by long-press Send, hardware-only model or effort cycling, mid-prompt slash completion, and broad desktop redesign remain deferred.

### Ordered tasks

1. **Create and execute the physical-device checklist.**
   - Create `docs/quality/pi-remote-chat-ux-iphone.md` with exact device, iOS, and build metadata.
   - Record pass or fail evidence for standalone mode, safe areas, software and hardware keyboard, rotation, VoiceOver, 200% text, light and dark mode, offline and reconnect, reduced motion, long transcripts, long model names, all seven effort levels, large command sheets, Plan transitions, and delivery-unknown presentation.
   - Record final palette, bundled fonts, pre-paint light, dark, and system behavior, cold offline launch with no blank text, and cache upgrade and downgrade rollback.
   - Verify command-sheet focus return, rotor, label, selected, pressed, and pending announcements, no keyboard-covered action, and no token-level live-region chatter.

2. **Add release regression coverage.**
   - Change `scripts/release-verify.mjs` and `scripts/check-thresholds.mjs` so release requires full workspace gates, visual-literals scan, and signed and dated physical-iPhone checklist for the candidate build.
   - Change `tests/rollback-drill.test.ts` to disable runtime controls and restore prior web and relay build while retaining session database.
   - Extend rollback test with service-worker release drill: upgrade from prior release, cold-launch offline, roll back with a new rollback worker whose current manifest points to prior release, cold-launch offline after rollback, and confirm session database and content-free push are untouched.

3. **Run final production-like reconciliation scenarios.**
   - Exercise model, effort, commands, Plan, Send, Steer, Later, Stop, transcript streaming, reader-away live edge, Pi restart, relay restart, browser background and foreground, offline draft, stale revision, rejection, and delivery-unknown on installed PWA.
   - Confirm `attention.ts` and push payloads remain content-free in every scenario.

### Protocol and relay contracts introduced

No new protocol contract is introduced. Phase 4B verifies presentation, accessibility, operations, security, and rollback only.

### Objective acceptance checks

- **PASS**: installed PWA controls remain visible and operable above software and hardware keyboard configurations, across rotation and safe areas. **FAIL**: any primary action is obscured or clipped.
- **PASS**: VoiceOver announces model, effort, mode, command results, working phase, errors, and live-edge changes with correct selected, pressed, and pending state and no token chatter. **FAIL**: authority state is conveyed only visually.
- **PASS**: at 200% text and long provider, model, or command strings, sheets and dock wrap without overlap or horizontal page scroll. **FAIL**: truncation hides active model or actions collide.
- **PASS**: reduced motion removes spatial and continuous animation and settled content does not move. **FAIL**: pulse or token animation remains.
- **PASS**: Copy, Retry, and Edit and resend exist only on valid settled turns and never auto-submit. **FAIL**: delivery-unknown action repeats blindly.
- **PASS**: offline, reconnect, and Pi or relay restart return controls to Checking or unknown until fresh state. Transcript position and drafts survive according to existing cache rules. **FAIL**: stale authority becomes actionable.
- **PASS**: full workspace build, lint, typecheck, unit, integration, web tests, runtime verifier, rollback drill, and physical checklist pass from release candidate. **FAIL**: any gate is skipped or inferred.

### Dependencies and sequencing

Phase 4B depends on frozen 4A candidate. It is the final release gate. A device defect returns to the phase that owns the behavior, then reruns every downstream gate.

### Security invariants preserved

- Physical QA covers stale, restart, foreground, delivery-unknown, and content-free push transitions.
- Rollback keeps session database and transcript storage intact.
- Release evidence contains no secrets, prompt content, paths, or raw command data.
- No device-only workaround creates new authority.

---

## Verification gates for every implementation phase

Run focused tests during each task, then run the authoritative Pi Mobile workspace gates from final state of each phase:

```text
npm run format:check
npm run lint
npm run typecheck
npm test
npm run test:web
npm run build
```

Additional gates:

- After Phase 0 and any launch or extension change, run `npm run verify:runtime-boundary` against staged deployed Pi version.
- After 1A, run protocol guard, Plan extension, launch argument, and runtime verifier tests together.
- After 1B, run runtime service, mutation settlement ordering, lifecycle, redaction, idempotency, and delivery-unknown tests together.
- After 1C, run protocol guards, runtime control, commands, prompt, abort, RPC, redaction, security negative controls, integration fixture, foreground socket, and unstyled harness together.
- After F1, run token inventory, font archive and committed-file hashes, license and manifest validation, and pixel-stability checks.
- After F2, run eight first-paint cases and cache upgrade, downgrade, cold-offline, activation, and rollback drills.
- At Merge gate A, run runtime and foundation gates from combined state and reconcile root dependency files once.
- After 2A, prove pending, acknowledgement, failure, stale, restart, and reconnect against unchanged composer and transcript.
- After 2B, prove command filtering, no auto-submit, explicit keyboard behavior, immutable pending snapshot, independent draft, recovery, and unchanged transcript.
- After 3A, prove deterministic grouping, typed renderer parity, virtualization, snapshots, deltas, gaps, cache hydration, and revisions.
- After 3B, prove named phases, throttled announcements, reader anchoring, Jump behavior, Plan handoff, and all 3A parity gates.
- After 4A, run residual literal, contrast, font, theme, state matrix, responsive, and automated offline gates.
- After 4B, run rollback drill, signed physical-iPhone checklist, runtime verifier, and full workspace gates.

No works, complete, release, or no-regression claim is permitted from a focused test alone. The whole gate must be rerun and exit status observed from final phase state.

## Recommendation coverage matrix

| Research recommendation | Planned disposition |
| --- | --- |
| No model UI today | 2A persistent `Model · label` control. |
| Composer-adjacent model picker | 2A RuntimeStrip and ModelSheet. |
| Model remains visible | 2A closed chip and long-label acceptance checks. |
| Real model RPCs | 1A typed methods, 1B runtime service, 1C redacted routes. |
| Reject settings-only primary | In-composer control is required and settings-only is prohibited below. |
| Sibling effort chip | 2A EffortSheet beside Model. |
| Dynamic supported levels | 1B host refresh after model change and 2A live-only rendering. |
| Discrete select, not cycle | 2A single-select sheet with no cycle control in primary mobile path. |
| Effort is not thinking disclosure | 2A effort control and 3A evidence disclosure remain separate. |
| Live `get_commands` and prompt invocation | 1C filtered catalog and existing prompt authority. |
| Slash typeahead and two to four quick actions | 2B CommandPalette and fill-draft actions. |
| Same ticketed prompt authority | 1C revalidation inside prompt submit with no command-execute endpoint. |
| Defer mid-prompt slash | 2B accepts only first-non-whitespace command position. |
| Plan extension and host-only cold start | Phase 0 verification and 1A pinned bridge. |
| Persistent Plan badge | 2A selected control and session treatment, then 2B composer treatment. |
| Labeled touch toggle | 2A React Aria Build and Plan controls. Keyboard-only control is rejected. |
| Explicit Plan exit and host confirmation | 1B mode bridge and 2A checking, pending, and reconcile states. |
| No second Plan session | Single supervisor and session remain cross-phase invariant. |
| Sticky two-row dock | 2A runtime strip, 2B composer dock, and 4B device tuning. |
| Turn hierarchy and calm streaming | 3A derived turns and 3B working phase and live edge. |
| Empty state as capability runway | 2B greeting, runtime context, and fill-draft actions. |
| Hierarchy by weight and surface | 3A user, assistant, and evidence styling with semantic tokens. |
| Two or three intentional motions | 4A focus, Plan, sheet or row, and live-edge transitions with reduced motion. |
| Reject multicolor, glass, and promotional clutter | Prohibited below and enforced at 4A cutover. |
| Searchable and grouped model sheet with row-only pending and no optimism | 2A ModelSheet behavior and acceptance tests. |
| Exact seven Pi effort levels with hints | 1A closed union and 2A labels and hints with no lossy mapping. |
| Relay strips command path and location and hides privileged commands | 1C command service, projectors, and negative controls. |
| Selection and quick actions insert but never submit | 2B command and empty-state behavior. |
| Machine-readable build, plan, and executing-plan | 1A extension status bridge and runtime DTO. |
| Exact custom-tool restoration before execution | 1A extension tests and 3B Build this plan gate. |
| Named streaming phase and elapsed time | 3B working-phase derivation and throttled announcements. |
| Reader-position new-count and Jump to latest | 3B LiveEdgeButton and anchor tests. |
| Autosizing one-to-six-line composer with explicit touch dispatch | 2B ComposerDock and 4B keyboard and safe-area QA. |
| Pending immutable submit plus independent new draft | 2B composer state and rejected or delivery-unknown tests. |
| Quiet long-press or overflow actions | 4A TurnActions with draft-only retry and edit behavior. |
| Send, Steer, Later, Stop, and two-root IA from prior mobile research | 1C prompt and abort contracts and 2B visible actions. Home and Session roots remain unchanged. |
| Content-free attention and foreground authority | Phase 0 inventory, 1C live-socket mutation check, and all-phase negative tests. |
| Physical iPhone, VoiceOver, 200% text, offline and reconnect, reduced motion | 4B release checklist and release gate. |
| Optional one-message model override | Deferred beyond 4B. Persistent session model ships first. |
| Optional hardware model or effort cycle shortcuts | Deferred beyond 4B. Visible touch controls remain primary. |
| Optional voice input | Deferred beyond 4B. |

### Restyle coverage matrix

Every restyle contract item maps to a phase below. F1 and F2 are inert. Visible change lands through per-phase opt-in and 4A global cutover.

| Restyle contract item | Planned disposition |
| --- | --- |
| Claude source primitives under `@theme` with exact names and values | F1 task 1 in `style.css`. Source primitives stay distinct from application aliases. |
| Pi Remote semantic aliases and typography, spacing, width, and motion roles | F1 task 2. Components consume only aliases. Source font names remain reference only. |
| Exhaustive current-token disposition | F1 records every disposition. 4A flips root aliases and deletes nothing without alias. |
| Light semantic palette and allowed-use matrix | F1 opt-in scope. 4A final light values and selector-to-surface contrast inventory. |
| Dark semantic palette and permitted-surface matrix | F1 opt-in scope. 4A final dark values with system-dark branch sharing one declaration. |
| Deterministic offline font supply chain | F1 vendored pair, licenses, manifest, font faces, and hashes. F2 preloads and caches. No subsetting or external origin. |
| Pre-paint theme contract | F2 inert bootstrap with current shell colors. 4A switches constants. |
| Surface and component treatment | 2A runtime roots, 2B command, composer, and empty roots, 3A and 3B transcript roots, then 4A legacy surfaces and shell. |
| Universal and per-surface interaction-state matrices | Each visible phase implements complete state rows for owned components with React Aria data selectors. |
| React Aria and `App.tsx` migration contract | Per-phase opt-in styling with stable role classes. State remains with React Aria and authority reducers. |
| Residual-literal elimination and allowlist scan | 4A verifier and allowlist with zero-match negative control. |
| Service-worker rollback and two-generation retention | F2 cache manifests and retention. 4B final asset list and upgrade, downgrade, and cold-offline drill. |
| Source fidelity versus Pi Remote density adaptations | F1 primitives and typography roles. 4B comparison screenshots at 390 by 844 in light, dark, and 200% text. |
| Objective gates and visual proof | 4B checklist records palette, fonts, theme, cold offline launch, and cache rollback. |

## Prohibited implementation shortcuts

The following researched alternatives remain out of scope in every phase:

- Generic bubbles for every block or deletion of typed plan, tool, diff, error, or usage renderers.
- Timeline card for every event or retention of decorative timeline rail after 3A.
- Settings-only model or effort controls, hard-coded catalogs, optimistic runtime chips, or lossy Low, Medium, High effort mapping.
- Static or unfiltered slash catalogs, auto-submit on selection, `!` or `!!` quick actions, or raw Pi RPC input.
- Client-only or prompt-only Plan, second `--plan` session, or keyboard-only Plan affordance.
- Force scrolling, token animation, continuous pulse, plain Enter-to-send on touch, or permanent composer icon row.
- Multiple accents, promotional chips, glass-heavy rebranding, or cosmetic parity that ignores semantic tokens.
- Transcript persistence rewrite to achieve turn grouping. The view remains derived.
