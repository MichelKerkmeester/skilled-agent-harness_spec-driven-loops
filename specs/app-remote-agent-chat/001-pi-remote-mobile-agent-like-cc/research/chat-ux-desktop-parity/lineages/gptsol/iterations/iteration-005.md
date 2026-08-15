# Iteration 5: Architecture, Sequencing, and Acceptance Plan

## Focus

This final evidence iteration reconciled the proposed controls with Pi Remote's actual shared protocol, serialized RPC supervisor, one-use tickets, action allowlist, prompt idempotency, transcript projection, and web client. It turns the previous four passes into a dependency-ordered implementation plan with explicit proof points.

## Findings

1. **The current checked-in control plane is narrower than the operator-selected runtime posture.** The source and legacy setup docs still default the Pi child to `--no-tools --no-extensions`, while this packet explicitly says the deployed direction is full-access desktop parity with redaction and foreground authority retained. Treat full-access launch/extension loading as a required verified precondition, not something the chat UI should attempt to configure. Before UI work, confirm the actual production argument source and that the plan-mode extension is loaded in RPC mode. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-relay/src/rpc/supervisor.ts:148] [SOURCE: specs/cli-external-orchestration/047-pi-remote-desktop-parity-chat-ux/spec.md:59] [INFERENCE: the operator-selected state is newer than this source snapshot]

2. **Add one typed runtime projection before building pickers.** Introduce a relay-owned `RuntimeStateDto` with `{sessionId, revision, model, thinkingLevel, availableThinkingLevels, mode, streaming, updatedAt}`. `model` contains display name plus provider/model ids; `mode` is `build | plan | executing-plan | unknown`. Seed it from Pi `get_state` plus available-thinking query and plan-extension state, emit a redacted sync delta on change, and refetch/reconcile on reconnect. This becomes the single read source for chips, picker checkmarks, action labels, and mode banners. [SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/rpc.md:162] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/docs/feature-catalog/transport-and-state/transcript-projection.md:30]

3. **Use a narrow, ticketed control command rather than raw RPC passthrough.** Define a guarded `runtime.control` union for `set_model`, `set_thinking_level`, and `set_mode`, carrying `controlId`, `sessionId`, `expectedRevision`, operation data, and a one-use ticket. The relay action allowlist gains an explicit `runtime:control`; the service serializes through the existing supervisor, validates against live catalogs, and returns the reconciled `RuntimeStateDto`. Unknown operations and stale revisions fail closed. The browser never submits arbitrary Pi RPC JSON. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/packages/pi-rpc-protocol/src/types.ts:18] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-relay/src/auth/policy.ts:3] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-relay/src/rpc/supervisor.ts:86]

4. **Give command discovery and execution separate typed boundaries.** A `commands.list` read action asks Pi `get_commands`, strips paths, applies the server allowlist, and returns safe descriptors. A `command.submit` mutation carries `submissionId`, selected `name`, reviewed `message`, session, catalog revision, and ticket; the relay verifies the command is still eligible and dispatches through Pi `prompt`. Preserve the current single-use submission and delivery-unknown protections. Plain prompts continue through `prompt.submit`; shell editor syntax and unknown extensions never enter the phone catalog. [SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/rpc.md:793] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-relay/src/prompt/prompt-service.ts:35]

5. **Plan mode requires a small extension bridge, not a browser-side invention.** Adapt the existing plan extension so RPC mode can query machine-readable state and request `plan`, `build`, or `execute-plan` transitions without depending on `ctx.ui.select`. The extension remains responsible for storing/restoring the exact pre-plan tool set and blocking non-allowlisted Bash. The relay maps `set_mode` to this narrow bridge and projects the result. Starting Pi with `--plan` remains useful for a cold-start default but is not the interactive phone toggle. [SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/examples/extensions/plan-mode/index.ts:66] [SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/examples/extensions/plan-mode/index.ts:240]

6. **Phase 1 should ship protocol/authority and an unstyled control harness.** Extend shared types and guards; add negative controls; add runtime/command services, routes, policy actions, ticket consumption, rate limits, idempotency, projection, and reconnect tests; verify production child arguments and extension loading. Exercise controls through test clients before touching the visual composer. This order prevents a polished phone UI from displaying untrustworthy local state. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/packages/pi-rpc-protocol/src/guards.ts:189] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-relay/src/http/server.ts:702]

7. **Phase 2 should ship the mobile control dock and safe commands.** Build `RuntimeStrip`, `ModelSheet`, `EffortSheet`, `ModeSwitch`, `CommandPalette`, and `ComposerDock` with React Aria. Wire pending/ack/failure/reconciliation first; use live catalogs; selection inserts command drafts; explicit touch dispatch; one active mutation at a time. Keep the old transcript renderer initially so failures are isolated to control flow. [SOURCE: https://react-spectrum.adobe.com/react-aria/.../getting-started.html] [SOURCE: https://react-spectrum.adobe.com/v3/ComboBox.html] [INFERENCE: component separation follows distinct host transactions]

8. **Phase 3 should remodel transcript presentation without changing stored blocks.** Add a pure `groupBlocksIntoTurns` view model, then render `Turn`, `AssistantMessage`, `WorkingGroup`, `PlanCard`, `DiffCard`, and `UsageDetails`. Add live-edge state and signal-based disclosure defaults. Retain stable ids/revisions and virtualization so transport, caching, and redaction semantics do not change. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/packages/pi-rpc-protocol/src/types.ts:123] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src/App.tsx:1119]

9. **Phase 4 is physical-iPhone polish and accessibility, not more architecture.** Verify safe-area behavior with the software keyboard, PWA standalone mode, rotation, VoiceOver, 200% text, dark mode, offline/reconnect, reduced motion, long transcripts, long model names, and command sheets. Tune density only after those tests. Voice input is a later optional enhancement; it should not delay the requested control and transcript improvements. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/docs/platform-support.md:58] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src/style.css:1810]

10. **Objective acceptance checks can prove the experience and the authority boundary together.** Required checks: (a) model/effort/mode chips exactly equal host state after success, rejection, reconnect, and stale revision; (b) plan mode removes write tools and blocks destructive Bash in Pi, then restores the prior tool set on Build; (c) command descriptors contain no host paths, unknown extensions are absent, and selection never submits; (d) touch Return inserts newline, Send/Steer/Stop stays above the keyboard, and delivery-unknown never auto-retries; (e) scrolling up freezes position and `N new` returns to the live edge; (f) errors/diffs/plans remain visible under grouping; (g) VoiceOver names every control/state and reduced-motion has no continuous animation; (h) existing redaction, ticket, default-deny, prompt-idempotency, sync, and transcript tests remain green. [SOURCE: combined confirmed contracts from iterations 1–4]

## Proposed Data Shapes

```ts
interface RuntimeStateDto {
  sessionId: string;
  revision: number;
  model: { provider: string; id: string; label: string } | null;
  thinkingLevel: string;
  availableThinkingLevels: readonly string[];
  mode: 'build' | 'plan' | 'executing-plan' | 'unknown';
  streaming: boolean;
  updatedAt: string;
}

type RuntimeOperation =
  | { type: 'set_model'; provider: string; modelId: string }
  | { type: 'set_thinking_level'; level: string }
  | { type: 'set_mode'; mode: 'build' | 'plan' };

interface RuntimeControlCommand {
  type: 'runtime.control';
  controlId: string;
  sessionId: string;
  expectedRevision: number;
  operation: RuntimeOperation;
  ticket: string;
}

interface CommandDescriptorDto {
  name: string;
  description: string | null;
  source: 'extension' | 'prompt' | 'skill';
  enabled: boolean;
  disabledReason: string | null;
  requiresConfirmation: boolean;
}
```

## Ruled Out

- Styling pickers before the relay can project and reconcile authoritative state.
- A generic “send any Pi RPC” endpoint.
- Combining runtime reads, mutations, slash execution, and normal prompts into one unguarded payload.
- Using the current TUI-only plan execution selector unchanged in RPC mode.
- Rewriting the transcript storage/projection model to achieve visual hierarchy.
- Gating the requested improvements on optional voice input or a brand redesign.

## Dead Ends

- The checked-in supervisor/setup documentation still describes a steering-only child. The exact production full-access argument configuration is not visible in the inspected source; it must be confirmed in the implementation environment before the plan extension can be treated as loaded.
- The current Pi plan example does not expose a formal RPC state/query contract, so a small extension change is unavoidable for reliable phone reconciliation.

## Edge Cases

- Model change may atomically change the supported/default thinking level; return one reconciled state and one announcement.
- A reconnect between ticket issue and consumption invalidates pending UI and requires a fresh ticket/state revision.
- A stale command catalog revision keeps the draft but blocks execution until refreshed.
- Mode switching during an active turn must have defined immediate-versus-next-turn semantics from the extension; the UI displays that result rather than guessing.
- Restoring Build must restore the exact tools captured before Plan, including custom tools, not a hard-coded default list.

## Sources Consulted

- Pi Remote shared protocol types and guards
- Pi Remote RPC supervisor, prompt service, HTTP route/action policy, relay client, transcript projection, feature docs, and platform support
- Pi RPC and plan-extension documentation/source
- Findings from iterations 1–4

## Assessment

- New information ratio: 0.51
- Novelty justification: This pass found the concrete policy, ticket, idempotency, and serialized-supervisor integration points, exposed the source/runtime-posture mismatch, and produced a testable phased plan rather than another pattern list.
- Questions addressed: a phased, concrete design and implementation plan for the existing stack.
- Questions answered: a phased, concrete design and implementation plan for the existing stack.

## Reflection

- What worked and why: tracing the existing prompt submission route supplied a proven template for every new mutation and clarified which protections must be reused.
- What did not work and why: broad project grep entered dependency trees; only authored application and documentation files were accepted as evidence.
- What I would do differently: implementation should begin with a production runtime-argument/state audit because the operator-selected full-access posture is not represented by the inspected default source.

## Recommended Next Focus

Synthesize all five verified iterations into the final research report and implementation-ready adoption order.
