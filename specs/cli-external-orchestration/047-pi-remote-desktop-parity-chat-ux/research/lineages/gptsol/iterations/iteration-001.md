# Iteration 1: Current Pi Remote UX and Architecture Baseline

## Focus

This iteration established what the current mobile PWA already does well, where the requested controls are absent, and which UX changes are constrained by the relay-owned authority and redaction model. It used the requested application files, current design documentation, and the earlier Pi Mobile UI/UX research.

## Findings

1. **The architecture already has the right display primitive: typed, revisioned transcript blocks.** `state.ts` normalizes `text`, `thinking`, `plan`, `tool_call`, `tool_result`, `file_diff`, `usage`, and unknown blocks by stable ID/revision/sequence; snapshots, deltas, and optimistic prompt reconciliation keep display state deterministic. This is a stronger foundation than flattening everything into generic bubbles. The improvement should be a new conversational hierarchy over the typed semantics, not a replacement of the block model. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src/state.ts:106] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src/state.ts:173] [SOURCE: specs/cli-external-orchestration/044-pi-mobile-ui-ux-research/research/research.md:240]

2. **All four operator-requested controls are absent from the web state and relay client.** `Session` owns only prompt text, send state, retry ID, and prompt error; `relay.ts` exposes prompt submission and approval/sync operations but no model catalog, model selection, thinking level, command dispatch, or plan-mode endpoint. Therefore the UI cannot safely add cosmetic selectors first: it needs typed protocol/relay state and acknowledgements so the visible active state is host-derived. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src/App.tsx:883] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src/relay.ts:34] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src/relay.ts:46]

3. **The composer is reliable but visually and behaviorally behind modern mobile chat inputs.** It is a fixed three-row raw `<textarea>` with a separate uppercase label, instructional footer, full-width mobile send button, and plain Enter-to-send. It has no autosizing, attachment/action rail, contextual chips, command suggestions, mode badge, model label, stop control, or pending-delivery treatment even though `pendingPromptIds` exists. Prior research already ruled out plain Enter-to-send on touch because it conflicts with multiline editing and found that quick actions should populate the draft rather than submit. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src/App.tsx:1003] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src/App.tsx:1078] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src/style.css:1232] [SOURCE: specs/cli-external-orchestration/044-pi-mobile-ui-ux-research/research/research.md:174]

4. **The transcript is optimized as an operator timeline rather than a calm conversation.** Every block is a bordered card with header and timestamp, set beside a timeline rail; the session title is oversized and a nested transcript scroller is capped at `70dvh`. This makes tool evidence explicit, but it gives routine assistant text, thinking, plans, tool I/O, diffs, and usage nearly equal visual weight. The likely parity move is to keep user/assistant prose visually primary and progressively disclose execution evidence, while preserving every typed block in the DOM model. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src/App.tsx:1197] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src/style.css:1181] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src/style.css:1226] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src/style.css:1351]

5. **Streaming lacks a live-edge contract.** The virtualizer announces newly completed blocks to assistive technology and adds an “Agent working” row, but it neither tracks whether the reader is at the bottom nor exposes “N new / Jump to latest.” Forced autoscroll would destroy review position; the earlier research already recommends signal-based follow behavior and stable block anchors. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src/App.tsx:1119] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src/App.tsx:1136] [SOURCE: specs/cli-external-orchestration/044-pi-mobile-ui-ux-research/research/research.md:206] [SOURCE: specs/cli-external-orchestration/044-pi-mobile-ui-ux-research/research/research.md:241]

6. **The visual foundation is already disciplined and should be retained.** The stylesheet provides restrained OKLCH light/dark tokens, one blue accent, safe-area padding, 44px coarse-pointer targets, focus-visible rings, and a global reduced-motion override. These are compatible with a Claude/GPT-like calmer layout; the project does not need a new design system, only a narrower chat token layer and better component composition. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src/style.css:11] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src/style.css:68] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src/style.css:1802] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src/style.css:1810]

7. **Control state must follow the same foreground-authority pattern as prompt submission and approvals.** The transport acquires one-use tickets, rejects malformed relay data, visibly disables stale input, redacts before persistence/broadcast, and treats push/cache as non-authoritative. Model, effort, command, and plan-mode changes should therefore be authenticated foreground commands with idempotency, validation, host acknowledgement, and relay-projected active state; they should not be persisted as authoritative client preferences. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src/relay.ts:46] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/docs/security.md:26] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/docs/security.md:34] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/docs/security.md:100]

8. **Empty states and session chrome spend space without helping the next action.** An empty transcript is one sentence; the session header prominently repeats session ID, “Live transcript,” and agent state, while the composer is separated below a bordered transcript frame. A first-class chat surface should use that space for one clear status line and safe quick actions that only seed the draft. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src/App.tsx:1050] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src/App.tsx:1146] [SOURCE: specs/cli-external-orchestration/044-pi-mobile-ui-ux-research/research/research.md:183]

## Ruled Out

- Replacing typed blocks with undifferentiated bubbles: this would erase execution semantics and contradict the existing protocol projection.
- Treating model, effort, or plan mode as local-only UI preferences: the phone would display state that the Pi process may not have accepted.
- Force-scrolling on every delta: this would break transcript review and steering during long runs.

## Dead Ends

- No current web or relay-client hook exists to “just wire” a selector; a typed control plane is required first.
- The current `pendingPromptIds` array alone cannot express model/mode/command acknowledgement; dedicated active/pending/error control state is needed.

## Edge Cases

- Ambiguous input: “tab-to-plan-mode” is interpreted as a fast, adjacent mode toggle, not dependence on a literal Tab keyboard key on iPhone.
- Contradictory evidence: none.
- Missing dependencies: the requested Pi core RPC contract is not defined in the five web files; later iterations must inspect the wider repository and Pi documentation.
- Partial success: none; the baseline question is answered.

## Sources Consulted

- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src/App.tsx`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src/state.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src/relay.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src/attention.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src/style.css`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/docs/security.md`
- `specs/cli-external-orchestration/044-pi-mobile-ui-ux-research/research/research.md`

## Assessment

- New information ratio: 0.92
- Novelty justification: This is the first lineage-specific baseline and identifies the exact missing control-plane surfaces while separating reusable foundations from parity gaps.
- Questions addressed: current implementation support and highest-value parity gaps.
- Questions answered: current implementation support and highest-value parity gaps.

## Reflection

- What worked and why: reading the React state, relay client, CSS tokens, security docs, and prior research together exposed both UI gaps and the host-authority constraints that determine viable fixes.
- What did not work and why: broad docs grep was noisy because many security and operations documents repeat the same authority language.
- What I would do differently: use narrower symbol searches for control-plane RPC and Pi CLI capabilities in the next pass.

## Recommended Next Focus

Determine the authoritative Pi model and thinking-level APIs, then compare how leading mobile AI apps expose model/effort state with minimal phone friction.
