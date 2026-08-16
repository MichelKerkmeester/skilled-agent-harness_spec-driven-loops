<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Phase 2 — Shared in-memory catalog and deterministic command engine

## Summary

This phase gives inline discovery and the existing `+` browser one session-scoped in-memory catalog and one pure interaction model. It makes lifecycle, trigger parsing, ranking, insertion, and revision binding testable before the inline panel is added.

## Problem & Goal

The existing command browser has one-shot client behavior, while the planned inline route needs deterministic local filtering and identical insertion semantics. The goal is to provide one client-side source of truth and pure catalog, trigger, ranking, insertion, binding, and stale-state logic without opening any command execution path.

## Scope

### In scope

- Replace one-shot `useCommands` behavior with a session-scoped in-memory catalog lifecycle.
- Add pure trigger, ranking, insertion, binding, and stale-state logic.
- Move the existing `+` browser onto the shared catalog, ranking, and insertion path without changing its visual surface.
- Keep all filtering local and all command execution out of the selection reducer.
- Share in-flight requests, abort stale work, and commit only responses matching the current auth epoch, session, and request identity.

### Out of scope

- Rendering the new inline autocomplete panel or changing the visual surface of the existing `+` browser.
- Ticket acquisition, prompt submission, host mutation, or final running-state Send orchestration.
- A static/client fallback catalog, usage-history ranking, edit-distance correction, inferred metadata, or browser persistence.
- Changes to the fixed bone/carbon/clay design system, typography, themes, WCAG AA target, or host/extension-enforced plan mode.

## User-facing behavior + states

This phase touches the existing `+` route only. The `+` browser keeps its current visual surface, reads the live session-scoped catalog, uses deterministic shared ranking, and inserts the exact canonical `/${name} ` draft locally without requesting a ticket or executing on the host. Inline autocomplete is not rendered yet; catalog loading, unavailable, forbidden, incompatible, and stale lifecycle states remain represented for the later surface without displaying another session’s rows.

## Acceptance criteria

- A live session prefetches one catalog, shares it between inline-ready state and `+`, and stores no catalog or binding in browser persistence.
- Out-of-order responses, session changes, host-epoch changes, aborts, and foreground/reconnect refreshes cannot overwrite the current scoped snapshot.
- Ranking fixtures produce the specified order and never autocorrect a typo.
- The `+` browser inserts exactly the same canonical string and binding as the future inline route, with zero ticket or host execution.
- Unit tests prove trigger parsing is independent from transport/filtering and that editing the command token clears the binding while editing arguments retains it.
- This phase remains read-only: no new host mutation path is opened.

## Security & Redaction

The relay-filtered catalog from Phase 1 remains the sole source of truth. The client stores only the current scoped snapshot, query, and binding in memory; it does not persist catalogs, bindings, or query text in local storage, IndexedDB, Cache Storage, service-worker responses, URLs, telemetry, crash reports, or content-bearing logs. Guarded transport errors distinguish unavailable, forbidden, incompatible, and stale responses. Request aborts, session/epoch changes, and out-of-order responses fail closed by refusing to commit mismatched data. Filtering and selection make no ticket, prompt, mutation, or Pi RPC request, and the client never infers aliases, argument syntax, paths, privileges, or availability from strings.

## Dependencies & affected areas

| Area | Files/components | Phase responsibility |
|---|---|---|
| Catalog lifecycle | `apps/pi-remote-web/src/commands.ts` | Session/auth-epoch scoping, shared in-flight request, abort/request ordering, in-memory state, and revalidation helpers. |
| Pure command engine | `apps/pi-remote-web/src/rankHostCommands.ts`, `apps/pi-remote-web/src/useSlashTrigger.ts`, `apps/pi-remote-web/src/insertSlashCommand.ts` | Normalization/ranking, trigger predicate, canonical replacement, caret/focus restoration, and revision binding. |
| Existing route | `apps/pi-remote-web/src/CommandPalette.tsx`, `apps/pi-remote-web/src/SessionComposer.tsx`, `apps/pi-remote-web/src/App.tsx` | Consume shared state and insertion while preserving ordinary text and current `+` visuals. |
| Web transport | `apps/pi-remote-web/src/relay.ts` | Guarded lifecycle calls and unavailable/forbidden/incompatible/stale error classes. |
| Web tests | `apps/pi-remote-web/tests/rankHostCommands.test.ts`, `apps/pi-remote-web/tests/useSlashTrigger.test.ts`, `apps/pi-remote-web/tests/insertSlashCommand.test.ts`, catalog lifecycle tests, `CommandPalette.test.tsx`, relevant `App.test.tsx` fixtures | Pure behavior, race/lifecycle, insertion parity, and compatibility coverage. |

