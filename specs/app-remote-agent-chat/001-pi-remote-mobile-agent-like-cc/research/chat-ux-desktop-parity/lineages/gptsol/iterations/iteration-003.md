# Iteration 3: Typed Commands and Plan-Mode Safety

## Focus

This iteration traced Pi's command inventory and plan-mode extension end to end, then compared the interaction with Cursor and Claude Code. The result is a mobile command surface and a conspicuous Plan/Build switch whose visible state is projected from Pi rather than inferred by the browser.

## Findings

1. **Pi RPC provides a purpose-built command catalog.** `get_commands` returns extension commands, prompt templates, and skills with names, descriptions, sources, locations, and source paths. Commands are invoked through `prompt` with a leading slash. Pi Remote should add this typed RPC command instead of scanning directories or maintaining a second client catalog. The relay should strip `path` before projecting results to the phone because absolute host paths are unnecessary UI metadata and conflict with the transport's redaction posture. [SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/rpc.md:793]

2. **Leading-slash completion is the established interaction, and the menu should remain draft-first.** Pi's TUI opens completion when `/` is typed; Cursor likewise detects `/` in the chat input and displays available commands, while its iOS app explicitly supports slash commands. In Pi Remote, `/` as the first non-whitespace character should open a filtered React Aria listbox/popover above the composer. Each row should show `/name`, description, and a compact `Extension`, `Prompt`, or `Skill` label. Selecting a row inserts `/name ` into the draft and returns focus to the textarea; it should not auto-submit, because many commands accept arguments and phone users need a review point. [SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/usage.md:33] [SOURCE: https://docs.cursor.com/en/agent/chat/commands] [SOURCE: https://cursor.com/changelog/ios-mobile-app]

3. **A visible quick-actions button complements slash typing without duplicating a command system.** Add a compact `+` or command-glyph button at the left edge of the composer. It opens the same catalog, with a short pinned section such as `Plan`, `Summarize`, and `Review changes`, followed by the searchable full inventory. Pinned actions are references to host-reported command names or safe draft templates, not separately implemented client behaviors. This supports one-handed discovery while preserving `/` for experienced use. [INFERENCE: combines Cursor's slash-command discovery with the existing Pi Remote single compose surface at App.tsx:1078]

4. **Extension commands have different streaming semantics and must use `prompt`.** Pi executes an extension command immediately even while a response is streaming; `steer` and `followUp` expand skills/templates but reject extension commands. Therefore the relay must classify a selected command from the latest `get_commands` result and route extension commands through `prompt`, not the current steer/follow-up choice. The confirmation copy must say `Run /plan now` when the action is immediate. Ordinary text retains the existing foreground-authority delivery behavior. [SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/rpc.md:45] [SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/sdk.md:234]

5. **The phone command catalog needs a server-side allowlist and a client-side eligibility state.** `get_commands` is broader than a safe remote-action menu: it can include credential, session, reload, share, package, or project-defined extension commands. The relay should map the live catalog through an explicit policy keyed by command name/source and emit only `{name, description, source, enabled, disabledReason, requiresConfirmation}`. Unknown extension commands default to hidden; read-only prompt templates and skills can default to visible but still pass through the authenticated ticketed prompt route. Never expose Pi's `!` or `!!` shell editor syntax as mobile quick actions. [SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/usage.md:17] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/docs/security.md] [INFERENCE: allowlisting preserves the documented foreground-authority boundary]

6. **Pi's reference plan extension already enforces read-only behavior in the host.** It registers `--plan` for cold-start state, `/plan` for in-session toggling, and a keyboard shortcut; when enabled it removes `edit`/`write`, restricts Bash to a read-only allowlist, injects a plan-only instruction, persists state with `appendEntry`, and shows `plan` status. This is materially stronger than merely adding “please do not edit” to a prompt. `--plan` should remain a launch/default mechanism; the phone's fast toggle should invoke the existing `/plan` command on the one live session. [SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/examples/extensions/plan-mode/index.ts:48] [SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/examples/extensions/plan-mode/README.md]

7. **Plan mode needs an explicit host-projected state contract.** The example extension persists mode internally, but Pi RPC `get_state` does not document plan status. A browser that sends `/plan` and flips a local boolean can become wrong after reconnect, failure, resume, or another controller action. Adapt the extension to emit/persist a machine-readable `plan-mode` custom entry or add a narrow relay query/control projection, then reconcile after every toggle and reconnect. A suitable projection is `{mode: "build" | "plan" | "executing-plan", revision, readOnly, activeToolsDigest}`; the relay remains the authority and redacts tool details if needed. [SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/examples/extensions/plan-mode/index.ts:95] [SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/examples/extensions/plan-mode/index.ts:313] [INFERENCE: current Pi RPC has no documented plan-mode getter]

8. **Use a thumb-reachable `Build | Plan` mode control and reinforce Plan in three persistent places.** Cursor uses a mode picker and Shift+Tab to enter Plan; Claude Code exposes a named `plan` permission mode. On iPhone, a segmented two-state toggle in the runtime strip is more discoverable than a keyboard metaphor. When Plan is active: show a pressed `Plan` segment, a persistent `Plan · read-only` chip near the session title, and a lightly tinted composer outline/placeholder (`Describe what to investigate and plan…`). Text must carry the state; color is redundant. The control sends `/plan`, shows `Switching…`, and changes only after acknowledged host projection. [SOURCE: https://cursor.com/blog/plan-mode] [SOURCE: https://docs.cursor.com/agent] [SOURCE: https://docs.anthropic.com/en/docs/claude-code/cli-usage] [INFERENCE: React Aria `ToggleButton`/radio semantics fit Pi Remote's existing component stack]

9. **Plan completion should have an explicit, reviewable handoff to Build.** Cursor's Plan Mode asks clarifying questions, produces an editable plan, and waits before building. Pi's extension similarly extracts a numbered plan and offers execute/stay/refine in an interactive TUI, but that `ctx.ui.select` cannot be assumed to render in RPC mode. Pi Remote should render the typed `plan` block with `Refine` and `Build this plan` actions; both require foreground tickets, and `Build this plan` must first obtain host confirmation that plan mode is off/full tools are restored before submitting the execution prompt. [SOURCE: https://cursor.com/blog/plan-mode] [SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/examples/extensions/plan-mode/index.ts:240] [INFERENCE: the PWA must replace TUI-only selection without bypassing the host extension]

## Ruled Out

- A static, client-owned slash-command list: it drifts from installed extensions, skills, and prompt templates.
- Auto-submitting a command when autocomplete is selected: arguments and safety consequences need a visible draft/review step.
- Exposing all commands returned by `get_commands`: host paths and privileged/project-defined commands exceed the remote UI's safe presentation boundary.
- Treating plan mode as prompt text or local UI state: neither disables write tools nor survives reconnect/reconciliation.
- Restarting a second Pi process with `--plan` for each plan request: it breaks the single-live-session product model; `/plan` is the in-session switch.
- Relying on Shift+Tab as the phone affordance: the physical shortcut is useful precedent but is not reliably available on iPhone.

## Dead Ends

- Pi's plan extension exposes TUI status/widgets but no documented plan-state RPC getter; direct reuse is incomplete until a machine-readable projection is added.
- Cursor's January 2026 web/mobile documentation said Plan was desktop-only, while its desktop product documents a mature Plan flow. It is used as an interaction reference, not evidence that Cursor mobile currently ships the toggle.

## Edge Cases

- If the command catalog changes after `/reload`, invalidate the cached list and refetch before dispatch.
- If a command disappears between selection and send, retain the draft and show a host-rejected message.
- If an extension command is selected during streaming, label its immediate behavior; do not silently apply steer semantics.
- On reconnect, render Plan state as `Checking…` until the relay obtains authoritative state; never default visually to Build.
- If plan-mode recovery reports `executing-plan`, show progress rather than a binary Plan state and do not offer another execute action.

## Sources Consulted

- `/Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/rpc.md`
- `/Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/usage.md`
- `/Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/sdk.md`
- `/Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/examples/extensions/plan-mode/index.ts`
- `/Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/examples/extensions/plan-mode/README.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/docs/security.md`
- `https://docs.cursor.com/en/agent/chat/commands`
- `https://cursor.com/changelog/ios-mobile-app`
- `https://cursor.com/blog/plan-mode`
- `https://docs.cursor.com/agent`
- `https://docs.anthropic.com/en/docs/claude-code/cli-usage`

## Assessment

- New information ratio: 0.76
- Novelty justification: This pass found the exact RPC command inventory, the immediate extension-command semantic, and the reference plan extension's host-enforced tool boundary, then converted them into a reconciled mobile control design.
- Questions addressed: safe typed commands and a prominent read-only plan-mode toggle.
- Questions answered: safe typed commands and a prominent read-only plan-mode toggle.

## Reflection

- What worked and why: authored Pi RPC and extension sources resolved both the discovery path and the enforcement boundary; current Cursor/Claude documentation supplied recognizable mode-switch patterns.
- What did not work and why: a broad filesystem search crossed other lineage artifacts and installed packages, so only targeted authored sources were used as evidence.
- What I would do differently: begin the next pass with current official mobile product documentation and use source inspection only to validate Pi Remote integration points.

## Recommended Next Focus

Compare message hierarchy, streaming feedback, typography, spacing, composer ergonomics, empty states, quick actions, and motion across Claude, ChatGPT, Cursor, and adjacent mobile references.
