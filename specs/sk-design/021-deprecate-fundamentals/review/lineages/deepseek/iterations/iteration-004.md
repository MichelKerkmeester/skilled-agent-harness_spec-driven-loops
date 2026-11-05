# Deep Review Iteration 4: Security

## Dimension

Security. Scope: whether the new and changed documents, token asset, manifests and routing entries
introduce a secret, a path escape, an executable instruction, or trust-boundary advice that could
weaken an implementation.

## Review Focus Addressed

Operator focus, routing and doc-accuracy halves viewed through a trust boundary. The chart cleanup
and the frontend references are documentation, so the security pass concentrates on what the
guidance tells a coding agent to build, not on runtime code that does not exist in this diff.

## Files Reviewed

- `.skilled/skills/sk-code/sk-code-frontend/assets/tokens.css:1-149`
- `.skilled/skills/sk-code/sk-code-frontend/references/web-visual-values.md:1-566`
- `.skilled/skills/sk-code/sk-code-frontend/references/web-visual-hierarchy.md:474-590`
- `.skilled/skills/sk-code/sk-code-frontend/references/web-motion-and-interaction.md:1-642`
- `.skilled/skills/sk-code/leaf-manifest.json` and `.skilled/skills/sk-design/leaf-manifest.json`
- `.skilled/skills/sk-code/hub-router.json` and `.skilled/skills/sk-design/hub-router.json`
- `.skilled/skills/mcp-tooling/mcp-figma/manual-testing-playbook/figma-to-code/token-drift.md`
- `.skilled/skills/mcp-tooling/mcp-figma/manual-testing-playbook/figma-to-code/check-built-screen.md`
- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/009-sk-design/fixtures/canary-cases.v1.json`

Command evidence used:

- a JSON string scan for entries starting with `/` or containing `..` across the four changed
  manifests (only the command name `/design:diagram` starts with a slash)
- a secret and URL scan across the three new references and `tokens.css`
- a directive scan for "ignore previous instructions", "you must now", "system prompt" and
  "instruction" across the new references
- anchor verification for the A2/A3/A5/A8/A13/A14/A17 links used by the review pass
- a read of `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:1358-1366` to
  confirm metadata is data, not executable

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None new. R1-P1-001 remains active.

### P2 Findings

7. **The session-expiry exception can be read as client-side authorization** -- `.skilled/skills/sk-code/sk-code-frontend/references/web-motion-and-interaction.md:361` -- M33 says authentication redirects belong on the server, then permits a client-side redirect when a session expires while the page is open, on the ground that "the server is no longer in the loop". The item never says the data calls must still be refused by the server, so a reader can implement the exception as a client-only session check.
   Case: a tab stays open past session expiry. The client-side timer redirects, but an in-flight
   fetch still receives the protected payload and the page renders it for a frame, which is the
   same flash of data the item's own "Why" says to prevent. A coding agent following only this
   item can satisfy it while leaving the server-side refusal untouched.
   Finding class: instance-only
   Scope proof: the only authentication statement in the three new references is M33; the
   adjacent focus and feedback items do not cover authorization. `web-accessibility-patterns.md`
   has no auth guidance, and the new file's own "Why" names the flash-of-data risk.
   Affected surface hints: ["web-motion-and-interaction M33", "auth redirect guidance", "session expiry"]
   Recommendation: state that the client redirect is a UX redirect only, that every data request
   must still be refused server-side, and that cached protected data is cleared before the redirect.

## Traceability Checks

| Protocol | Level | Status | Evidence |
|----------|-------|--------|----------|
| `spec_code` | core | partial | The split holds except for R1-P1-001; no security requirement is added or removed by the spec. |
| `checklist_evidence` | core | partial | Unchanged from iteration 2. |
| `skill_agent` | overlay | pass | The agent capability table names the visual refs and the token file; no capability grants a new write or shell surface. |
| `agent_cross_runtime` | overlay | pass | Mirrors carry the same read-only evidence role; none adds a tool grant. |
| `feature_catalog_code` | overlay | notApplicable | No feature-catalog entry changes. |
| `playbook_capability` | overlay | pass | The Figma playbook commands changed are read-only `rg` lines; no new command was added. |

## Edge Cases

- `tokens.css` is a copyable asset, not a loaded stylesheet; its `@media (prefers-color-scheme: dark)`
  block is inert until a project copies it. No import, URL or remote font is present.
- The routing manifests contain no absolute path, no traversal segment and no executable payload.
  The one leading slash is the command name `/design:diagram`, which is a command key.
- The reviewed docs are untrusted content by contract. No directive-like text ("ignore previous
  instructions", "you must now") was found in the three new references or the chart files.

## Confirmed-Clean Surfaces

- No secret, API key, password value, private-key block or `http(s)://` URL in the three new
  references or `tokens.css`.
- No absolute filesystem path or `..` traversal in the four changed manifests.
- The accessibility anchors referenced by the new review pass all exist in
  `web-accessibility-patterns.md` (A2:71, A3:80, A5:98, A8:129, A13:182, A14:191, A17:222).
- The Figma playbook's changed commands are read-only `rg`/`get` steps; no destructive command was
  introduced.
- The chart cleanup removed pointers into a research packet; it did not add a URL, a token or an
  execution step.

## Ruled Out

- **A secret embedded in the moved token file.** Ruled out by scan; the file is HSL values,
  comments and custom properties only.
- **A path-traversal entry in a manifest.** Ruled out by the JSON string scan.
- **A prompt-injection directive in the reviewed docs.** Ruled out by the directive scan.
- **A leaked research path in the chart references.** Ruled out in iteration 2; the remaining
  shadcn mentions name a measured design source, not a research packet.

## Next Focus

Dimension: maintainability and traceability close-out. Re-check the active P1 against the compiled
router once more, confirm every earlier finding still stands, and check whether the new routing
vocabulary has regression coverage in the hub canary set.

Review verdict: CONDITIONAL
