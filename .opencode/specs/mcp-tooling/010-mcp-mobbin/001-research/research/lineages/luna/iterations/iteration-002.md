# Iteration 2: Official skills workflow and search_screens contract

## Focus

Determine how the official Mobbin skills repo turns app, screen, flow, and element design-research questions into MCP calls, what the result looks like, and how the skill is installed.

## Actions Taken

- Read the official skills repository README.
- Read the complete official `skills/mobbin-search/SKILL.md`.
- Compared the skill's MCP prerequisite and workflow with the server/auth findings from iteration 1.

## Findings

1. The official skills repository currently presents `mobbin-search` as its available skill. It is intended for design-related questions that need real app UI references, including exploring apps, screens, and flows, gathering inspiration, comparing patterns, and answering UI questions. [SOURCE: https://github.com/mobbin/skills]

2. The skill documents one concrete MCP operation, `search_screens`. It says the call returns screen metadata containing an index, screen id, app name, Mobbin URL, image URL, and platform, plus inline image blocks and a failed list. The public skill does not publish separate confirmed `search_apps`, `search_flows`, or `search_elements` calls. [SOURCE: https://github.com/mobbin/skills/blob/main/skills/mobbin-search/SKILL.md]

3. App, screen, flow, and element intent is expressed through query terms. The workflow plans query terms from the user's language, avoids inventing extra specifics, infers iOS versus web when possible, defaults to a limit of five, and treats roughly fifteen as an upper bound. These are search-planning rules, not a promise of four separate MCP tools. [SOURCE: https://github.com/mobbin/skills/blob/main/skills/mobbin-search/SKILL.md]

4. The skill requires a short plan announcement followed by a same-turn `search_screens` call, then visual inspection of returned images. It either answers from the inspected references or offers an HTML evidence board; the board is written under `.mobbin/` only after the user selects that path. [SOURCE: https://github.com/mobbin/skills/blob/main/skills/mobbin-search/SKILL.md]

5. The skill's prerequisite configuration is the official remote Mobbin URL with no API key: `https://api.mobbin.com/mcp`. The repository recommends `npx skills add mobbin/skills`; it also documents a manual clone/copy route for clients that do not support the installer. [SOURCE: https://github.com/mobbin/skills]

6. For a read-only `mcp-mobbin` transport, returning inline images and links is in scope, but writing the optional evidence board is not. The transport should supply evidence to a downstream design-judgment skill rather than persist or author design artifacts. This boundary is a local packet decision based on the skill's optional board behavior. [SOURCE: https://github.com/mobbin/skills/blob/main/skills/mobbin-search/SKILL.md] [SOURCE: file:.opencode/skills/mcp-tooling/SKILL.md]

## Questions Answered

- Which official skill? `mobbin-search`.
- What concrete operation? `search_screens`.
- How are app/screen/flow/element questions expressed? Query terms plus optional platform/limit context; separate public tool names are not confirmed.
- What does the result contain? Screen metadata, Mobbin/image URLs, platform, failure list, and inline image blocks.
- How is it installed? `npx skills add mobbin/skills`, or the documented manual clone/copy route.
- What is out of scope for a read-only transport? The optional `.mobbin` evidence-board write.

## Questions Remaining

- What exact Code Mode namespace and JSON schema does the authenticated server expose for `search_screens`?
- Are there additional authenticated tools absent from the public skill text?

## Ruled Out

- Four separately confirmed app/screen/flow/element tool names: the public skill documents `search_screens` and query dimensions.
- Automatic evidence-board persistence: the board is optional and outside the read-only transport.

## Assessment

- `newInfoRatio`: `0.80`
- Novelty justification: This pass added the official workflow and concrete result contract, while narrowing app/screen/flow/element claims to documented query dimensions instead of invented tool names.
- Confidence: high for the published skill workflow and install path; medium for the exact runtime tool name because Code Mode prefixes and live discovery are still required.

## Reflection

- Worked: the README and raw skill file give consistent prerequisite, workflow, and install guidance.
- Ruled out: four separately confirmed search tools and automatic evidence-board persistence.
- Limitation: visual image blocks and authenticated tool schemas cannot be validated from the public repository alone.

## Recommended Next Focus

Translate the evidence into a read-only, Code Mode-only transport contract and a paste-ready UTCP manual, while recording the live `tools/list` validation gate and the mandatory `sk-design` judgment pairing.

## Sources Consulted

- [SOURCE: https://github.com/mobbin/skills]
- [SOURCE: https://github.com/mobbin/skills/blob/main/skills/mobbin-search/SKILL.md]
- [SOURCE: https://github.com/mobbin/mobbin-mcp-server/blob/main/mcp.json]
- [SOURCE: https://docs.mobbin.com/mcp/introduction]
- [SOURCE: file:.opencode/skills/mcp-tooling/SKILL.md]
