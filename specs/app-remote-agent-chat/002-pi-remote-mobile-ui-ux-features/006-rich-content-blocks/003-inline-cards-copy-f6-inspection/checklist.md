# Checklist — Inline cards, exact Copy, and F6 inspection

- [ ] Shell calls/results, fenced code, explicit artifacts, and settled long text render as the specified cards.
- [ ] Short prose, routine tools, thinking, usage, diffs, optimistic prompts, and unsafe/unknown blocks remain on their specified existing or safe fallback paths with no Copy/Open where required.
- [ ] Every Command/Output lifecycle and code/text card state has the correct status, bounded preview, available actions, and canonical source.
- [ ] Command, output, current streaming output, code, text, and F6 Copy all are exact string matches, including whitespace and final newlines.
- [ ] Copy success, failure, and unavailable states preserve focus and expose the required persistent announcement or recovery text without toast, network, worker, or permission-query dependency.
- [ ] F6 uses one shared React Aria viewer, stores only an opaque block ID in ephemeral history, traps focus, supports all required dismissals, restores focus/scroll, and leaves virtualized row height unchanged.
- [ ] Completed F6 command/output opens at the top; running output opens at the tail, follows only at the live edge, and exposes Jump to latest after upward scroll.
- [ ] Safe Markdown and card previews cannot create executable/raw DOM or remote navigation; redaction markers are the only sensitive values visible to browser and clipboard.
- [ ] True-390px light and dark captures show card hierarchy, shell-well boundary, 44px controls, safe areas, no page overflow, and unchanged composer behavior.
- [ ] `npm run typecheck` passes.
- [ ] `npm test` passes.
- [ ] `npm run test:web` passes.
- [ ] `npm run build` passes.
- [ ] Mocked fetch, WebSocket, ticket, filesystem, and host-call spies report zero rich-content calls.
- [ ] Every visible action measures at least 44×44 CSS pixels and has an accessible name beginning with its visible label.
- [ ] Focus-visible treatment, safe-area geometry, theme contrast, stable card geometry, and zero page horizontal overflow are inspected at true 390 CSS pixels in both themes.
- [ ] Security/privacy review approves canonical source, redaction provenance, clipboard, hidden DOM, safe Markdown, F6 history, and no-network/no-ticket behavior before live enablement.
