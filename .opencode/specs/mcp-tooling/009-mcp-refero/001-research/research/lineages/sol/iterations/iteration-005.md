# Iteration 5: contradiction review and implementation-readiness matrix

## Focus

Challenge the proposed packet against the current official repository, live documentation, the pre-existing manual, and local routing/testing conventions; retain useful Refero research mechanics while explicitly rejecting upstream authority or setup assumptions that violate the requested transport boundary.

## Actions Taken

1. Queried the official GitHub repository metadata and recursive tree, confirming its current default branch and complete reference inventory.
2. Read the current official `SKILL.md`, `visual-workflow.md`, `example-workflow.md`, `mcp-tools.md`, and `anti-ai-slop.md` at the repository head.
3. Rechecked the official Tools and Examples pages for current names, schemas, workflow ordering, batching, and common mistakes.
4. Re-read the exact existing `refero` manual, `mcp-tooling` router, transport routing fixture, Figma Code Mode discovery fixture, and graph/document inventory.
5. Built an adoption/divergence map and an implementation/test checklist that preserves known unknowns rather than converting them into invented guarantees.

## Findings

- F-032: The official repository’s default branch is `master`, not `main`; current head is `f78b4eccf112d7a179b92afeafdd7e8684560ac2`, root skill version 1.1, with ten Markdown references plus one banner asset. Downstream citations and provenance should use `master` or the immutable commit, and earlier `main` URLs should be treated as branch-name mistakes rather than evidence. [SOURCE: https://api.github.com/repos/referodesign/refero_skill] [SOURCE: https://github.com/referodesign/refero_skill/tree/f78b4eccf112d7a179b92afeafdd7e8684560ac2]
- F-033: Adopt the upstream research mechanics, not its authority model: brief first; styles for visual language; screens for concrete patterns/elements/app context; flows for journeys; search 3–5 angles; retrieve a modest shortlist; select one primary reference; borrow only 1–2 bounded traits; preserve token/media roles; create a reference lock and decision ledger before implementation. These mechanics become evidence supplied to `sk-design`. [SOURCE: https://raw.githubusercontent.com/referodesign/refero_skill/master/SKILL.md] [SOURCE: https://doc.refero.design/mcp/examples]
- F-034: The upstream root skill explicitly presents itself as the primary/default design methodology and includes direction selection, optional image generation, implementation, and visual QA. That conflicts with this packet’s requested transport role and the local contract that `sk-design` owns taste, mode selection, proof, and ready claims. `mcp-refero` must not copy upstream activation priority, implementation permissions, three-direction user chooser, image-generation behavior, or design acceptance language. [SOURCE: https://raw.githubusercontent.com/referodesign/refero_skill/master/SKILL.md] [SOURCE: https://raw.githubusercontent.com/referodesign/refero_skill/master/references/visual-workflow.md] [SOURCE: file:.opencode/skills/sk-design/SKILL.md:263]
- F-035: The upstream setup example uses a direct HTTP client with a bearer header, whereas this repository already has a stdio `refero` manual launching `npx -y mcp-remote https://api.refero.design/mcp` with empty env. The packet must describe the existing manual as authoritative, avoid an install/config snippet, and route auth failures to operator-owned OAuth/manual setup without accepting credentials in prompts or calls. [SOURCE: https://raw.githubusercontent.com/referodesign/refero_skill/master/SKILL.md] [SOURCE: file:.utcp_config.json:148]
- F-036: The official skill reference says `response_format` is client/schema dependent even though the current docs enumerate it on seven text-returning tools; `refero_get_screen_image` has no response format. Therefore runtime `tool_info` is the final callable schema, while the packet documents the current expected schema and fails closed on drift. This reconciles docs/repository variation without guessing. [SOURCE: https://raw.githubusercontent.com/referodesign/refero_skill/master/references/mcp-tools.md] [SOURCE: https://doc.refero.design/mcp/tools]
- F-037: Router integration is mechanical and testable: append `mcp-refero` to `tieBreak`; add a `routerSignals` entry with narrow classes such as `refero-aliases` and `design-reference-search`; add exact vocabulary like `refero`, `refero mcp`, `search Refero styles/screens/flows`, and `UI reference research`; map the resource to `mcp-refero/SKILL.md`; and add a routing fixture proving Refero wins without letting generic “design” steal Figma or browser intents. [SOURCE: file:.opencode/skills/mcp-tooling/hub-router.json] [SOURCE: file:.opencode/skills/mcp-tooling/manual_testing_playbook/hub_routing/figma_transport.md]
- F-038: The downstream change set must keep projections synchronized: packet folder (`SKILL.md`, `README.md`, targeted references, manual playbook, changelog), hub `SKILL.md`/`README.md`/`description.json`, `mode-registry.json`, `hub-router.json`, hub playbook, and `graph-metadata.json`. Counts and prose describing “three modes” or “one transport” must become four modes/two transports; `mcp-code-mode` stays an external dependency and `.utcp_config.json` remains unchanged. [SOURCE: file:.opencode/skills/mcp-tooling/SKILL.md] [SOURCE: file:.opencode/skills/mcp-tooling/graph-metadata.json]
- F-039: Local manual-test convention supports four fixture groups: hub routing (Refero-specific positive plus Figma/generic-design holdouts), Code Mode discovery (manual prefix, `tool_info`, eight expected tools, fail-closed drift), read-only workflows (style→screen, flow, similar, explicit image, pagination/batch), and recovery/negative controls (401/browser action, quota/429, invalid UUID/flow ID, stale names/args, unavailable tool, timeout, no secret logging). Each needs exact prompt, command sequence, signals, evidence, verdict, and triage; live paid/OAuth scenarios must be marked operator-dependent. [SOURCE: file:.opencode/skills/mcp-tooling/mcp-figma/manual_testing_playbook/manual_testing_playbook.md:340] [SOURCE: file:.opencode/skills/mcp-tooling/manual_testing_playbook/manual_testing_playbook.md]
- F-040: Final unknowns are operational rather than packet-design blockers: authenticated live tool schemas and response drift, actual search page size, unpublished per-second/concurrency/burst policy, `Retry-After` behavior, and successful end-to-end OAuth/refresh through the currently broken advertised protected-resource metadata URL. The packet should report these as unknown or runtime-observed, never hardcode guarantees. [SOURCE: https://doc.refero.design/mcp/tools] [SOURCE: https://github.com/geelen/mcp-remote] [SOURCE: https://api.refero.design/.well-known/oauth-authorization-server]

## Questions Answered

- What exact read-only Code Mode surface, `sk-design` judgment pairing, safety boundary, and verification plan should the downstream `mcp-refero` packet adopt? Use an MCP-first transport mode with read-only local tools plus Code Mode discovery/execution, an eight-operation live-verified allowlist, no Bash/write/task/credential handling, `sk-design` intake and judgment before design-affecting retrieval, evidence-only reference locks, synchronized hub projections, deterministic contract fixtures, and separate paid OAuth smoke tests.

## Questions Remaining

- No authoring-blocking research question remains. Operational unknowns require a paid, operator-authorized authenticated session or future published documentation and must remain explicit in the packet.

## Sources Consulted

- https://api.github.com/repos/referodesign/refero_skill
- https://github.com/referodesign/refero_skill/tree/f78b4eccf112d7a179b92afeafdd7e8684560ac2
- https://raw.githubusercontent.com/referodesign/refero_skill/master/SKILL.md
- https://raw.githubusercontent.com/referodesign/refero_skill/master/references/visual-workflow.md
- https://raw.githubusercontent.com/referodesign/refero_skill/master/references/example-workflow.md
- https://raw.githubusercontent.com/referodesign/refero_skill/master/references/mcp-tools.md
- https://raw.githubusercontent.com/referodesign/refero_skill/master/references/anti-ai-slop.md
- https://doc.refero.design/mcp/tools
- https://doc.refero.design/mcp/examples
- file:.utcp_config.json:148
- file:.opencode/skills/mcp-tooling/hub-router.json
- file:.opencode/skills/mcp-tooling/mode-registry.json
- file:.opencode/skills/mcp-tooling/manual_testing_playbook/manual_testing_playbook.md
- file:.opencode/skills/mcp-tooling/mcp-figma/manual_testing_playbook/manual_testing_playbook.md
- file:.opencode/skills/sk-design/SKILL.md

## Assessment

- newInfoRatio: 0.44
- Novelty justification: This pass corrected repository provenance, exposed two material authority/setup conflicts, resolved schema precedence, and converted architecture into a synchronized authoring and test inventory.
- Confidence: High for repository/local contract facts and current published schemas; medium for unauthenticated OAuth inference; explicitly unknown for paid live behavior and unpublished throttling.

## Reflection

- What worked and why: A contradiction-oriented comparison prevented the official skill’s broad design-authority and direct-bearer setup from leaking into a deliberately narrow local transport packet.
- What did not work and why: Current public sources still cannot establish authenticated schemas, page size, burst limits, or successful token refresh.
- What I would do differently: Pin source provenance to immutable commits in the research record while requiring runtime discovery for the actual MCP schema.

## Ruled Out

- Vendor or install the upstream Refero Skill wholesale: its authority, implementation, image-generation, and QA scope conflicts with the local transport/taste separation. [SOURCE: https://raw.githubusercontent.com/referodesign/refero_skill/master/SKILL.md]
- Replace the existing manual with the upstream bearer-header example: the operator explicitly scoped the packet atop the existing `mcp-remote` manual. [SOURCE: file:.utcp_config.json:148]
- Hardcode a single authenticated schema snapshot: Code Mode discovery and `tool_info` are the runtime authority, with the official docs as expected baseline. [SOURCE: file:.opencode/skills/mcp-code-mode/SKILL.md:285]
- Add generic “design” as a strong Refero router keyword: it would collide with Figma and the design hub; narrow Refero/reference-research phrases are safer. [SOURCE: file:.opencode/skills/mcp-tooling/hub-router.json]

## Dead Ends

- Public documentation does not disclose per-second, burst, concurrency, or retry-header behavior. [SOURCE: https://doc.refero.design/mcp/tools]
- Credential-free tests cannot validate paid tool execution or OAuth refresh without violating the lineage’s no-outside-write boundary. [SOURCE: https://github.com/geelen/mcp-remote]

## Recommended Next Focus

Synthesize the five verified iterations into the final transport authoring packet: exact tool matrix, auth/plan boundary, workflow recipes, adoption/divergence map, registry/router blueprint, fixture matrix, risks, open operational questions, and convergence report.
