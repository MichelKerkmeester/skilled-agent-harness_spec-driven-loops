# Live run results - 13 scenarios

Run 2026-06-15. Models: Kimi K2.7 (`kimi-for-coding/k2p7`) + DeepSeek v4 Pro (`deepseek/deepseek-v4-pro`) for model-judgment/routing and the design-system reads; `od run start --agent opencode --model deepseek/...` for OD generation; Code Mode UTCP for the wiring.

| ID | Skill | Verdict | Evidence | Refinement surfaced |
|----|-------|---------|----------|---------------------|
| ID-001 brainstorm + deviate | sk-id | PASS (Kimi + DeepSeek) | both produce grounded token systems naming all 3 default clusters + justified deviation | none |
| ID-002 pinned brief verbatim | sk-id | PASS (Kimi + DeepSeek) | both follow cream/serif/terracotta verbatim, cite §4, no deviation | none |
| ID-003 quality-floor gate | sk-id | PASS (Kimi + DeepSeek) | both graded the real 154 fixture, found concrete WCAG contrast failures + fixes | scenario assumed a fixture without naming one - name a fixture |
| ID-004 system as critique-against | sk-id | PASS (Kimi + DeepSeek) | both read the real bundled `luxury` system, named its cliche, justified a deviation, confirmed no chooser/cache | name the bundled-system source path |
| ID-005 route to sk-code | sk-id | PASS (Kimi + DeepSeek) | both route to sk-code, no design plan, cite SKILL.md §1 | none |
| ID-006 route to sk-doc | sk-id | PASS (Kimi + DeepSeek) | both route to sk-doc, no design plan | none |
| ID-007 licensing/provenance | sk-id | PASS | Apache attribution present, LICENSE.txt present, package_skill PASS, no real vendored leftovers | de-vendor grep tokens are vague (false-positived on legit Apache prose) - name exact tokens |
| ID-008 reuse-before-generate | sk-id | PASS (Kimi + DeepSeek) | both read the real bundled `professional` system, reused 20+ tokens + 8 components, net-new only at gaps, no style menu | name the bundled-system source path |
| ID-009 previewUrl fidelity | sk-id | PASS | live od MiMo run completed (index.html present, not awaiting_input); both-gates judgment applies; render is anti-default | state the runId source (a completed live run) |
| WIRE-001 mcp install | mcp-od | PARTIAL | open-design manual installed into .utcp_config.json (persisted + valid + spec matches od --print); live tools/list blocked - Code Mode loads MCP-stdio manuals at startup, needs a fresh session | document Code Mode/UTCP wiring path + the startup-load caveat |
| READ-001 read design system | mcp-od | PASS | read the real bundled `professional` DESIGN.md (9 sections) + tokens.css live | document where systems live (app bundle .../open-design/design-systems/) + the token/Code-Mode read paths |
| RUN-001 gated verb + negative control | mcp-od | PASS | gated builds into throwaway projects proven live (model-pinned, multi-turn question-form -> build -> index.html); confirm-before-mutate upheld | add model-pinning + answer-via-follow-up-message |
| FAIL-001 daemon unreachable | mcp-od | PASS | bogus OD_SIDECAR_IPC_PATH -> clear ECONNREFUSED, no hang or silent success | note the raw uncaught exception + the bogus-socket non-destructive simulation |

## Tally
- PASS: 12 (ID-001..009 except WIRE/READ are mcp-od; all sk-id 9 PASS; mcp-od READ-001, RUN-001, FAIL-001 PASS)
- PARTIAL: 1 (WIRE-001 - install done, live tools/list needs a fresh Code Mode session)
- SKIP: 0

## Correction
The first pass marked READ-001/ID-004/ID-008 SKIP ("no design system registered") from the empty data-dir + the `od tools` token wall. That was premature: ~150 built-in systems are bundled in the app at `/Applications/Open Design.app/Contents/Resources/open-design/design-systems/<name>/` (each with DESIGN.md + tokens.css + components.html). Reading those un-blocked all three - now PASS.

## Cross-finding (drove the 154 fix)
Both Kimi and DeepSeek, applying sk-interface-design, independently flagged the SAME real WCAG contrast failures in the 154 MiMo Meridian design (footer slate ~2.6-3.0:1, copper eyebrows ~3.7-4.2:1, CTA ~3.6:1, process-number ~1.3:1). The 154 offline test only verified palette presence, not contrast math. Fixed in 154 per the user's request.
