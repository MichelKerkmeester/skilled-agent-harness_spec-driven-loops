# Resource Map — Pi Remote Mobile Chat Parity

## Lineage

- Session: `fanout-gptsol-1786777562169-s2n1hh`
- Executor: `cli-codex`, model `gpt-5.6-sol`, reasoning `high`
- Iterations: 5 / 5
- Stop reason: `maxIterationsReached`
- Final synthesis: `research.md`

## Iteration artifacts

| Iteration | Focus | Narrative | Delta |
|---:|---|---|---|
| 1 | Current implementation and architecture baseline | `iterations/iteration-001.md` | `deltas/iter-001.jsonl` |
| 2 | Model and reasoning-effort controls | `iterations/iteration-002.md` | `deltas/iter-002.jsonl` |
| 3 | Typed commands and plan-mode safety | `iterations/iteration-003.md` | `deltas/iter-003.jsonl` |
| 4 | Mobile chat hierarchy and interaction polish | `iterations/iteration-004.md` | `deltas/iter-004.jsonl` |
| 5 | Architecture, sequencing, and acceptance plan | `iterations/iteration-005.md` | `deltas/iter-005.jsonl` |

## Local evidence

| Surface | Key resources | Used for |
|---|---|---|
| Pi Remote web | `App.tsx`, `state.ts`, `relay.ts`, `attention.ts`, `style.css` | Current transcript/composer behavior, typed blocks, theming, motion, accessibility, missing runtime controls |
| Shared protocol | `packages/pi-rpc-protocol/src/types.ts`, `guards.ts` | Existing command union, DTOs, validation gap, typed-control proposal |
| Relay | `rpc/supervisor.ts`, `prompt/prompt-service.ts`, `http/server.ts`, `auth/policy.ts` | Serialization, tickets, idempotency, routing, default deny, action allowlist |
| Feature/design docs | `Apps/Pi Mobile/docs/**` | Redaction, foreground authority, replay/sync, projection, composer, platform constraints |
| Installed Pi docs | `docs/rpc.md`, `usage.md`, `sdk.md`, `extensions.md`, `README.md` | Model/thinking RPC, commands, streaming semantics, extension APIs |
| Plan extension | `examples/extensions/plan-mode/index.ts`, `utils.ts`, `README.md` | Host-enforced read-only tools, Bash allowlist, persistence, `/plan`, `--plan`, execution handoff |
| Prior research | packet `044-pi-mobile-ui-ux-research/research/research.md` | Compose safety, turn hierarchy, live edge, eliminated alternatives |

## External primary evidence

| Source | URL | Used for |
|---|---|---|
| OpenAI ChatGPT release notes | https://help.openai.com/en/articles/6825453-chatgpt-release-notes | Mobile picker placement, simplified reasoning bands, consolidated tool sheet, long-press Send, immediate feedback, empty mobile composer |
| OpenAI ChatGPT Android FAQ | https://help.openai.com/en/articles/8142208-chatgpt-android-app-faq | Contextual long-press response actions |
| Claude model/effort/thinking | https://support.claude.com/en/articles/8664678-change-the-model-effort-and-thinking-settings | Composer-adjacent runtime controls, effort, thinking timer/disclosure |
| Claude voice mode | https://support.claude.com/en/articles/11101966-use-voice-mode | Input/voice/stop spatial pattern |
| Claude Code CLI | https://docs.anthropic.com/en/docs/claude-code/cli-usage | Explicit plan permission mode |
| Cursor iOS | https://cursor.com/changelog/ios-mobile-app | Mobile model choice, slash commands, remote control, artifacts/diffs/status |
| Cursor commands | https://docs.cursor.com/en/agent/chat/commands | Leading-slash discovery and reusable command catalog |
| Cursor modes | https://docs.cursor.com/agent | Mode picker and read-only Ask distinction |
| Cursor Plan Mode | https://cursor.com/blog/plan-mode | Fast input toggle, clarify/review/edit/build plan flow |
| Cursor planning | https://docs.cursor.com/en/agent/planning | Visible todos and queued-message status |
| React Aria | https://react-spectrum.adobe.com/react-aria/getting-started.html | Accessible unstyled components and interaction states |
| React Spectrum ComboBox | https://react-spectrum.adobe.com/v3/ComboBox.html | Filtering, grouped options, touch/small-screen picker behavior |

## Evidence limitations

- Exact proprietary type scales, spacing, and colors are not documented by comparison products; Pi styling values are explicit inferences.
- The inspected checkout still contains the older steering-only supervisor default, while the operator selected full-access desktop parity. Production arguments and plan-extension loading require implementation-time confirmation.
- The reference plan extension lacks a documented machine-readable RPC mode state contract; the proposed bridge is an implementation requirement.
