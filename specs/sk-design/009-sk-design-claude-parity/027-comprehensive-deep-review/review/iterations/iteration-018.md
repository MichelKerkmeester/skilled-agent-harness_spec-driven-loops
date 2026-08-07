# Iteration 018 - design-md-generator security + maintainability gap-fill

## Dimension

- Security and maintainability gap-fill for `.opencode/skills/sk-design/design-md-generator/**`.
- Scope note: Wave 4 already covered CSS-context injection, prompt-data isolation, output rooting for `extract.ts`/`guided-run.ts`, backend traceability/sk-doc conformance, and non-backend correctness/traceability. Existing `P1-001`, `P1-016-001`, `P2-016-001`, `P2-016-002`, and `P2-017-001` were not re-counted.

## Files Reviewed

- `.opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/deep-review-findings-registry.json:11`
- `.opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/deep-review-strategy.md:32`
- `.opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/iterations/iteration-015.md:14`
- `.opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/iterations/iteration-016.md:38`
- `.opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/iterations/iteration-017.md:34`
- `.opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/deep-review-state.jsonl:15`
- `.opencode/skills/sk-code/code-review/references/review_core.md:28`
- `.opencode/skills/system-deep-loop/deep-review/references/protocol/quick_reference.md:166`
- `.opencode/skills/sk-design/design-md-generator/SKILL.md:89`
- `.opencode/skills/sk-design/design-md-generator/README.md:187`
- `.opencode/skills/sk-design/design-md-generator/README.md:200`
- `.opencode/skills/sk-design/design-md-generator/INSTALL_GUIDE.md:99`
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/guided-run.ts:63`
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/guided-run.ts:133`
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/guided-run.ts:151`
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/extract.ts:74`
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/extract.ts:173`
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/crawl.ts:377`
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/crawl.ts:410`
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/crawl.ts:914`
- `.opencode/skills/sk-design/design-md-generator/backend/package.json:10`
- `.opencode/skills/sk-design/design-md-generator/backend/vitest.config.ts:8`
- `.opencode/skills/sk-design/design-md-generator/backend/tsconfig.json:11`
- `.opencode/skills/sk-design/design-md-generator/backend/tests/guided-run.test.ts:7`
- `.opencode/skills/sk-design/design-md-generator/backend/tests/parseargs.test.ts:10`

## Findings by Severity

### P0

- None.

### P1

- None new.

### P2

#### P2-018-001 [P2] Public-URL crawl boundary is documented but not enforced by the wrapper or extractor

- File: `.opencode/skills/sk-design/design-md-generator/backend/scripts/guided-run.ts:63`
- Claim: The packet documents that extraction works only on publicly accessible URLs, but `guided-run.ts` and the delegated extractor validate output location, not the URL trust boundary, before launching Playwright. This leaves local/private-network crawl attempts possible when an operator or agent passes `localhost`, loopback, or private-address URLs.
- Evidence: The public-URL contract is stated in user docs: `README.md:200` through `README.md:202` says authenticated pages are out of scope and the crawler needs a publicly accessible URL, and `INSTALL_GUIDE.md:99` says the tool only works on publicly accessible URLs. `guided-run.ts:63` through `guided-run.ts:95` accepts the first non-flag argument as `url` without scheme/host validation; `guided-run.ts:133` through `guided-run.ts:148` preflights Node, package files, dependencies, Chromium, and output path only; `guided-run.ts:151` through `guided-run.ts:159` forwards `options.url` directly to `extract.ts`. The extractor normalizes any non-http(s) input by prefixing `https://` at `extract.ts:74` through `extract.ts:79`, then constructs `new URL(url)` at `extract.ts:177` through `extract.ts:184` without rejecting local/private hosts. The crawler proceeds to `processPage` for initial URLs at `crawl.ts:908` through `crawl.ts:915`; discovered links are same-host filtered at `crawl.ts:377` through `crawl.ts:425`, which limits crawl expansion but does not make the initial host public.
- Counterevidence sought: Checked Wave 4 iterations and registry for prior URL trust-boundary coverage; prior security coverage focused on CSS injection, prompt-data isolation, and output rooting. Checked tests: `guided-run.test.ts:7` through `guided-run.test.ts:14` covers a happy-path public URL, and `parseargs.test.ts:10` through `parseargs.test.ts:28` covers flag behavior, but neither asserts rejection of loopback/private/authenticated targets.
- Alternative explanation: This is a local developer CLI, not a network service, and Playwright starts with a fresh browser context, so the issue is not a confirmed remote exploit or credential leak by itself.
- Finding class: matrix/evidence.
- Scope proof: The same gap crosses the wrapper and direct extractor entrypoint: `guided-run.ts` delegates to `extract.ts`, while `extract.ts` owns direct CLI parsing and crawler dispatch. Config scan did not find `.env`-style secret files or checked-in credentials in this packet; `backend/package.json:10` through `backend/package.json:18`, `vitest.config.ts:8` through `vitest.config.ts:11`, and `tsconfig.json:11` through `tsconfig.json:15` contain scripts/test/build scope only.
- Affected surface hints: [`guided-run.ts`, `extract.ts`, `crawl.ts`, `README.md`, `INSTALL_GUIDE.md`]
- Recommendation: Add a shared URL policy helper for crawl targets, used by both `guided-run.ts` and `extract.ts`, that allows `http:`/`https:` public hosts and rejects loopback, localhost, private/link-local IP ranges, `file:`/non-web schemes, and authenticated-only targets unless an explicit documented override is added for local development.
- Final severity: P2.
- Confidence: 0.84.
- Downgrade trigger: Downgrade to no finding if maintainers intentionally support local/private development crawling and update the docs/tests to state that boundary explicitly.

## Traceability Checks

- `spec_code`: PASS. Reviewed only `.opencode/skills/sk-design/design-md-generator/**` plus required review state and review-core doctrine; no reviewed implementation files were modified.
- `checklist_evidence`: N/A. This leaf review produced review evidence artifacts only and did not update checklist completion state.
- `skill_agent`: PASS. Stayed in `deep-review` leaf mode and did not dispatch sub-agents.
- `agent_cross_runtime`: N/A. The target is a skill packet and backend scripts, not a runtime agent definition.
- `feature_catalog_code`: PARTIAL. Feature catalog/report-preview corroboration of the existing output-boundary `P1-001` was already recorded in iteration 17 and was not re-counted.
- `playbook_capability`: PARTIAL. Guided-run and public-URL behavior are represented in docs/playbook surfaces, but this pass focused on executable trust-boundary enforcement rather than full playbook capability coverage.
- `security_config`: PASS with caveat. No packet config or env-like file with secrets was found in the in-scope scan; the new advisory is URL trust-boundary enforcement, not secret leakage.
- `maintainability_gapfill`: PASS with advisory. Existing maintainability findings cover SKILL.md size, backend bin/entrypoint drift, guided-run entrypoint discoverability, and stale reference count. No additional duplicate-logic or organization issue was confirmed beyond the new shared URL-policy recommendation.

## Verdict

PASS with advisories. One new P2 security/maintainability hardening finding was confirmed; no new P0 or P1 findings were identified in this gap-fill pass.

## Next Dimension

Iteration 19 should keep its assigned cross-hub routing consistency scope and should not re-review md-generator URL policy. Iteration 20 should keep its assigned final sk-doc template sweep.

Review verdict: PASS
