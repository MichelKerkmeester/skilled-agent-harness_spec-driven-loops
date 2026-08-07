# Iteration 2: CLI candidate identity and genuine headless boundary

## Focus

Determine whether a community CLI is worth adopting over the official CLI when the mode needs note operations, and separate true headless operation from headless synchronization.

## Actions Taken

- Verified the official Headless Sync documentation and package/binary identity.
- Verified the `@obsidian-vfs/core` npm package and its degraded-mode behavior.
- Verified the PyPI `obsidian-cli` package identity and documented command scope.
- Triangulated the official CLI runtime constraint against the candidates.

## Findings

1. Obsidian Headless is a separate official open-beta Sync client: `npm install -g obsidian-headless` exposes the `ob` command and requires an Obsidian Sync subscription. It syncs a local vault without the GUI; it is not documented as a note CRUD/search/backlinks API. [SOURCE: https://obsidian.md/help/sync/headless]
2. `@obsidian-vfs/core` is a real npm package (0.4.0 at the checked registry page), but it is a library, not a CLI. It reads/enumerates files directly when Obsidian is down; its search and wikilink resolution depend on the official `obsidian` binary and are unavailable in degraded mode. [SOURCE: https://www.npmjs.com/package/%40obsidian-vfs/core]
3. The PyPI `obsidian-cli` package is a real but different binary named `obsidian`; its documented scope is vault listing/opening/template creation, not full note CRUD/search/backlinks/frontmatter. It risks a name collision with the official first-party `obsidian` CLI. [SOURCE: https://pypi.org/project/obsidian-cli/]
4. The official `obsidian` CLI remains the only audited CLI that directly covers the requested operations—note CRUD, search, backlinks, daily notes, tags/properties, and template create—but it must drive a running desktop app. [SOURCE: https://obsidian.md/help/cli]
5. A true headless mode can be assembled from official Headless Sync plus direct Markdown/filesystem operations, but that is a build decision with explicit semantic gaps: no Obsidian index, no verified backlinks, no template-plugin execution, and no app-managed link updates unless another component supplies them. [INFERENCE: based on https://obsidian.md/help/sync/headless and https://www.npmjs.com/package/%40obsidian-vfs/core]
6. The sensible CLI ranking is therefore: (1) adopt official `obsidian` for the normal desktop-local mcp-obsidian mode; (2) build a deliberately small filesystem fallback only if a non-desktop server is a hard requirement; (3) do not adopt the conflicting PyPI `obsidian-cli` or a generic unverified vault CLI as the primary surface. [SOURCE: https://obsidian.md/help/cli] [SOURCE: https://pypi.org/project/obsidian-cli/]

## Questions Answered

- Which community CLI candidates have a verified package/binary identity, usable feature coverage, and true headless execution?

## Questions Remaining

- Which MCP-server candidates have a verified identity and transport, and do they require the Local REST API plugin and a running Obsidian app?
- How does the Local REST API community plugin authenticate and what CRUD/search/backlink/daily-note/tag/frontmatter/template operations does it expose?
- What exact environment variables and safety controls should the mcp-obsidian manual expose?

## Ruled Out

- Adopting PyPI `obsidian-cli` as the mcp-obsidian CLI: it shares the `obsidian` executable name with the official CLI but its documented scope is vault setup/opening rather than the requested operational surface. [SOURCE: https://pypi.org/project/obsidian-cli/]
- Treating official Obsidian Headless (`ob`) as an automation API: its documented surface is Sync administration, not note CRUD/search/backlink tooling. [SOURCE: https://obsidian.md/help/sync/headless]
- Treating `@obsidian-vfs/core` as a drop-in executable: npm describes it as a shared engine/library and its useful graph/search functions are unavailable while Obsidian is down. [SOURCE: https://www.npmjs.com/package/%40obsidian-vfs/core]

## Dead Ends

- A third-party CLI that reuses the `obsidian` binary name introduces ambiguous invocation and an avoidable installer/configuration conflict. [SOURCE: https://pypi.org/project/obsidian-cli/]

## Edge Cases

- Ambiguous input: “headless” is again held to no running desktop application, not merely noninteractive terminal use.
- Contradictory evidence: no audited candidate provides the full requested surface headlessly; Headless Sync supplies a local filesystem but does not contradict the official CLI app requirement.
- Missing dependencies: Headless Sync requires an Obsidian Sync subscription, so it is not a free general fallback.
- Partial success: the filesystem fallback is feasible for raw Markdown but cannot claim parity with app-backed backlinks, templates, or link management.

## Sources Consulted

- https://obsidian.md/help/cli
- https://obsidian.md/help/sync/headless
- https://www.npmjs.com/package/%40obsidian-vfs/core
- https://pypi.org/project/obsidian-cli/

## Assessment

- New information ratio: 0.80
- Novelty justification: This pass added verified identities and narrowed the requested headless decision to a clean adopt-versus-small-build split.
- Questions addressed: community CLI identities; full-surface headless viability.
- Questions answered: community CLI candidates and true headless boundary.

## Reflection

- What worked and why: Registry pages exposed both executable identity and maintenance/scope signals, avoiding README-only package assumptions.
- What did not work and why: No audited third-party CLI reached full feature parity without either a running app or a custom filesystem implementation.
- What I would do differently: Keep the CLI selection and headless-server fallback as separate product modes rather than forcing one binary to promise both.

## Recommended Next Focus

Rank direct Local REST API MCP against verified wrapper packages, then turn the winning auth/config pattern into an exact Code Mode manual and `.env.example` proposal.
