# Iteration 4: Per-tool mutation confirmation semantics and Bridge-dependent tools

## Focus
This iteration investigated the exact published Bridge-dependent operation set and the available per-tool mutation/confirmation signals. The interpretation was limited to provider documentation and the repository's caller-side safety contract; live Code Mode discovery was not available.

## Actions Taken
- Re-read Webflow's official Designer Session, Data, Utility, and architecture documentation.
- Compared the action-level read/write labels and destructive-operation descriptions in the official tool reference.
- Checked the local mcp-tooling manual-testing contract for confirmation and destructive-test handling.
- Checked the official documentation index to identify the current canonical tool-reference surfaces.

## Findings
1. The Bridge-dependent set is bounded to visual element snapshots, current Designer selection/page/mode/branch reads or changes, canvas navigation, and breakpoint reads. The official Designer reference corroborates that these are live-session operations, while Data tools are headless; the remaining listed Designer actions (page-folder creation and image upload) are also explicitly marked as write operations and therefore require the live Designer session. [SOURCE: https://developers.webflow.com/mcp/reference/how-it-works.md] [SOURCE: https://developers.webflow.com/mcp/tools/designer-tools.md]
2. The official tool inventory distinguishes Bridge-backed Designer actions from Data API mutations rather than treating all writes as Bridge-dependent. Data tools cover headless writes across assets, CMS, pages, scripts, styles, variables, and related site data; therefore Bridge absence should be classified by capability and surfaced as a mode/session condition, not as a generic mutation failure. [SOURCE: https://developers.webflow.com/mcp/reference/how-it-works.md] [SOURCE: https://developers.webflow.com/mcp/tools/data-tools.md]
3. The action-level inventory exposes materially different mutation risks: asset deletion is soft-delete and not restorable through the API; script deletion is irreversible; CMS publishing is separate from draft writes; and site publishing makes changes live. These distinctions support confirmation tiers for destructive, production-impacting, and reversible mutations, but they do not constitute a provider-enforced confirmation protocol. [SOURCE: https://developers.webflow.com/mcp/tools/data-tools.md] [SOURCE: https://developers.webflow.com/mcp]
4. No official per-tool confirmation prompt, dry-run flag, or confirmation metadata contract was found in the current reference pages. The repository's existing safety contract instead requires destructive tests to use throwaway data and explicit cleanup confirmation, so the Webflow packet should implement caller-side confirmation and test isolation without claiming that Webflow MCP itself enforces confirmation. [SOURCE: https://developers.webflow.com/mcp/reference/how-it-works.md] [SOURCE: .opencode/skills/mcp-tooling/mcp-click-up/manual-testing-playbook/manual-testing-playbook.md:69-82]

## Questions Answered
- Refined the exact bounded Bridge-dependent operation set.
- Refined the caller-side confirmation requirement for mutation classes.

## Questions Remaining
- Exact MCP OAuth scope names, authorization UX, workspace selection, and reconnect/revocation behavior remain unresolved.
- A live Code Mode `list_tools`/`tool_info` result is still needed to confirm callable names and detect documentation drift.

## Ruled Out
- Treating every Webflow mutation as Bridge-dependent was not supported by the official separation between Data API and live Designer capabilities. [SOURCE: https://developers.webflow.com/mcp/reference/how-it-works.md]
- Claiming provider-enforced confirmation or dry-run behavior remains unsupported by the consulted references. [SOURCE: https://developers.webflow.com/mcp/reference/how-it-works.md]

## Dead Ends
- Live callable discovery was unavailable in this iteration; no guessed tool name or schema was promoted.

## Edge Cases
- Ambiguous input: none; the focus was interpreted as documentation-level Bridge and confirmation semantics.
- Contradictory evidence: none found.
- Missing dependencies: live Code Mode discovery was unavailable; official tool references were used as the bounded fallback.
- Partial success: no; the documentation answered the Bridge boundary and mutation-risk portions, while live callable verification remains open.

## Sources Consulted
- https://developers.webflow.com/mcp/reference/how-it-works.md
- https://developers.webflow.com/mcp/tools/designer-tools.md
- https://developers.webflow.com/mcp/tools/data-tools.md
- https://developers.webflow.com/mcp/llms.txt
- .opencode/skills/mcp-tooling/mcp-click-up/manual-testing-playbook/manual-testing-playbook.md:69-82

## Assessment
- New information ratio: 0.875
- Questions addressed: per-tool mutation confirmation semantics; complete Bridge-dependent operation set
- Questions answered: Bridge-dependent operation boundary and caller-side mutation-confirmation requirement

## Reflection
- What worked and why: Action-level official tool references exposed distinctions that the overview alone does not show, especially write classification and irreversible/publish semantics.
- What did not work and why: Live callable discovery was unavailable, so exact runtime names and schemas could not be verified.
- What I would do differently: In the next iteration, use a fresh Code Mode session to run discovery first, then compare the returned catalog against this documented baseline.

## Recommended Next Focus
Use the final iteration to resolve the remaining authentication question and, if operator access permits, verify the Webflow manual's live `list_tools` and `tool_info` catalog without invoking mutation-capable tools.
