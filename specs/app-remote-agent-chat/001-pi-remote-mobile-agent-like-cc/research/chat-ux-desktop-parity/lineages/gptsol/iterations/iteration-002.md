# Iteration 2: Model and Reasoning-Effort Controls

## Focus

This iteration determined the current Pi RPC surface for model and thinking-level selection, then compared it with current ChatGPT, Claude, and Cursor mobile patterns to define a low-friction, host-authoritative phone interaction.

## Findings

1. **Pi already provides all host primitives needed for model selection.** Current Pi RPC supports `get_state` (including the full active model and `thinkingLevel`), `get_available_models`, `set_model(provider, modelId)`, and `cycle_model`. `set_model` returns the selected full model object; `cycle_model` also returns the resulting thinking level. Pi Remote does not need to invent a shell-command bridge. [SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/rpc.md:162] [SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/rpc.md:217] [SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/rpc.md:235] [SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/rpc.md:259]

2. **Pi exposes exact, model-dependent thinking levels.** `set_thinking_level` accepts `off`, `minimal`, `low`, `medium`, `high`, `xhigh`, and `max`; `get_available_thinking_levels` returns only levels supported by the active model and returns `off` for a non-reasoning model. The UI should render that returned list, not a hard-coded global enum, and refresh it after every accepted model change. [SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/rpc.md:281] [SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/rpc.md:298] [SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/rpc.md:316]

3. **The Pi Remote protocol fork is behind the installed Pi 0.84.2 contract.** Its `PiRpcCommand` union and runtime guard accept only prompt/steer/follow-up/abort/read commands, so valid `set_model`, `get_available_models`, `set_thinking_level`, and related responses would currently be rejected. The first implementation step is to extend the shared types/guards and relay service with a deliberately allowlisted control family. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/packages/pi-rpc-protocol/src/types.ts:18] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/packages/pi-rpc-protocol/src/types.ts:63] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/packages/pi-rpc-protocol/src/guards.ts:189] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-relay/src/rpc/supervisor.ts:86]

4. **Leading apps make the active choice visible at the point of conversation.** ChatGPT places its picker at the top of mobile conversations; its June 2026 picker deliberately simplifies the task choice to speed/reasoning bands. Claude puts the selected model and effort next to the send button and lets users change either for the next response without leaving the conversation. This convergence argues against burying Pi controls in global settings. [SOURCE: https://help.openai.com/en/articles/6825453-chatgpt-release-notes] [SOURCE: https://support.claude.com/en/articles/8664678-change-the-model-effort-and-thinking-settings]

5. **Use one persistent “runtime strip,” not two unrelated settings screens.** In Pi Remote, place compact host-backed chips immediately above the textarea: `Model · <short name>` and `Effort · <exact level>`. The selected values remain visible when the sheets are closed, are reachable by the same thumb that types/sends, and survive the session header scrolling offscreen. This adapts Claude’s next-to-send visibility while keeping room for the plan-mode chip. [INFERENCE: based on Claude’s composer-adjacent model/effort menu, ChatGPT’s in-conversation mobile picker, and Pi Remote’s sticky composer at App.tsx:1078]

6. **Model selection should be a searchable bottom sheet backed by live Pi data.** On open: request `get_available_models`, group by provider, show a checkmark on the host-reported active model, prioritize a small “Recent/Scoped” section, and keep provider/model IDs in secondary text. On selection: send one authenticated `set_model`, show a pending spinner only on that row, accept the returned model, then call `get_state` and `get_available_thinking_levels` to reconcile. Do not optimistically change the persistent chip before acknowledgement. Cursor’s mobile app validates that frontier-model selection belongs in the phone agent launch/control flow. [SOURCE: https://cursor.com/changelog/ios-mobile-app] [SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/rpc.md:217] [SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/rpc.md:259]

7. **Effort should use exact Pi levels with plain-language trade-off copy, not a lossy three-tier mapping.** Open a compact radio sheet from the effort chip; list only the returned supported values, title-case them (`Off`, `Minimal`, `Low`, `Medium`, `High`, `Extra high`, `Max`), mark the model default when Pi exposes it, and add one-line speed/depth guidance. Claude similarly exposes effort within the model menu and explains higher effort as slower/more token-intensive; ChatGPT’s simplified labels show that task-oriented language reduces model taxonomy burden. [SOURCE: https://support.claude.com/en/articles/8664678-change-the-model-effort-and-thinking-settings] [SOURCE: https://help.openai.com/en/articles/6825453-chatgpt-release-notes] [INFERENCE: exact Pi levels avoid ambiguous client-to-host remapping]

8. **Model and effort changes apply to the next response and need visible transaction states.** Disable both chips while a set command is pending; on success announce the new combination in an `aria-live` region and briefly show a non-transcript confirmation (“Using Sonnet · High for the next response”); on failure preserve the previous host state and provide Retry. If the model change invalidates the old effort level, show the host-selected fallback as a single reconciled update rather than a second error. [SOURCE: https://support.claude.com/en/articles/8664678-change-the-model-effort-and-thinking-settings] [SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/rpc.md:235] [SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/rpc.md:316]

9. **Pi’s own TUI provides a useful semantic precedent.** It always shows the current model in the footer, indicates thinking level through editor-border color, opens model selection with Ctrl+L, and cycles thinking with Shift+Tab. The PWA should preserve persistent text labels and use border/accent color only as redundant reinforcement; color alone is insufficient and the phone lacks dependable keyboard shortcuts. [SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/README.md:151] [SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/README.md:202]

## Ruled Out

- A settings-only model/effort page: active runtime context becomes invisible during the decision to send.
- A hard-coded model list or global effort enum: provider catalogs and thinking support vary by live Pi configuration and selected model.
- Optimistic active-state chips: a failed or reconciled host command would leave the phone lying about the next response.
- A three-tier client abstraction that maps several Pi levels together: it obscures the actual level and creates unstable mapping as models add `xhigh`/`max`.

## Dead Ends

- The existing `@pi-remote/pi-rpc-protocol` definitions cannot carry these commands unchanged; using raw `JsonObject` passthrough would weaken runtime validation and is rejected.
- Cursor’s public mobile pages confirm model choice exists but do not document precise picker placement or effort-level controls, so they cannot support detailed layout claims.

## Edge Cases

- Ambiguous input: “effort” is mapped to Pi’s `thinkingLevel`; Claude’s separate extended-thinking toggle is not copied because Pi exposes one thinking-level axis.
- Contradictory evidence: older Claude guidance said model changes could start a new chat; the current official article says model/effort changes can happen at any point and apply to the next response. Current guidance is used.
- Missing dependencies: Pi RPC’s full `Model` schema/default-level metadata needs confirmation during implementation; the documented commands are sufficient for interaction design.
- Partial success: Cursor placement details remain unverified, but Pi, ChatGPT, and Claude provide enough primary evidence.

## Sources Consulted

- `/Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/rpc.md`
- `/Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/README.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/packages/pi-rpc-protocol/src/types.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/packages/pi-rpc-protocol/src/guards.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-relay/src/rpc/supervisor.ts`
- `https://help.openai.com/en/articles/6825453-chatgpt-release-notes`
- `https://support.claude.com/en/articles/8664678-change-the-model-effort-and-thinking-settings`
- `https://cursor.com/changelog/ios-mobile-app`

## Assessment

- New information ratio: 0.82
- Novelty justification: The iteration found the exact Pi RPC commands and capability-dependent effort contract, then converted current mobile product patterns into a specific host-authoritative control design.
- Questions addressed: phone-first model and effort presentation and safe Pi RPC mapping.
- Questions answered: phone-first model and effort presentation and safe Pi RPC mapping.

## Reflection

- What worked and why: current installed Pi documentation gave a precise RPC contract, while current official product documentation clarified placement and simplified labels.
- What did not work and why: broad filesystem search crossed minified dependency artifacts and produced noise; subsequent Pi research should stay inside the package’s authored docs/source.
- What I would do differently: inspect only targeted Pi RPC and extension documentation for commands and plan mode in the next pass.

## Recommended Next Focus

Design the typed command surface and plan-mode toggle, including allowlisting, autocomplete, read-only mode visibility, and the Pi plan extension boundary.
