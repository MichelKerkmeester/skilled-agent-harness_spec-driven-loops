# Deep Research Strategy — Beancount Ledger 2.3.1

## 2. TOPIC

Verify the plugin-owned state, Beancount v3 ledger model, subprocess contracts, BQL surface, dashboards, file-layer workflows, and failure modes needed by an AI that edits vault files directly.

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)

- None. All scoped questions were resolved by iteration 2.
<!-- /ANCHOR:key-questions -->

## 4. NON-GOALS

- Do not operate Obsidian UI controls or modify the plugin/ledger.
- Do not implement fixes or write outside this detached lineage.
- Do not infer undocumented plugin state keys from similarly named finance plugins.

## 5. STOP CONDITIONS

- Complete exactly two iterations because `stopPolicy=max-iterations`; early convergence is telemetry only.
- Halt only for unrecoverable source access/state corruption or a security concern.

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS

- [x] Exact `data.json` schema: 21 current keys plus possible retained legacy/unknown keys (iteration 1).
- [x] Seven commands, structured views/files, direct and named BQL forms, query argv, price argv, and dashboard recipes (iteration 1).
- [x] Beancount directive grammar, transaction weights, multi-currency assertions, and cost-basis lot booking (iteration 2).
- [x] Validation-first account, transaction, reconciliation, CSV-import, and price workflows (iteration 2).
- [x] Parser, validation, subprocess, balance, and lot-booking failure recovery (iteration 2).
<!-- /ANCHOR:answered-questions -->

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED

- Exact tag-source reads through the GitHub connector exposed versioned source and stable file URLs (iteration 1).
- Cross-reading settings, main, structured layout, directive writers, and query builders resolved the actual file-layer contract (iteration 1).
- Primary Beancount syntax plus beanquery grammar/source tables resolved semantics that plugin code assumes (iteration 2).
- Beangulp and beanprice primary repositories resolved import and market-price boundaries (iteration 2).
<!-- /ANCHOR:what-worked -->

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED

- Release `main.js` could not be read as a repository file because it is not tracked; exact tag source is the verifiable substitute (iteration 1).
- Direct raw/release-asset web fetches returned cache misses (iteration 1).
- beanquery's docs directory has no substantive query-language reference; grammar and implementation source were required (iteration 2).
<!-- /ANCHOR:what-failed -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)

### Release bundle in Git tree — BLOCKED (iteration 1)
- What was tried: tag `2.3.1` Contents reads, raw and release-asset URLs.
- Why blocked: `main.js` is a generated release asset, not a tracked file.
- Do not retry: use tag 2.3.1 TypeScript sources and state the provenance limit.
<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS

- Treating `obsidian-flat-financing` as this plugin: different repository, ID, settings, and behavior.
- Treating missing `main.js` as missing source: ruled out because the tagged TypeScript compiles the release bundle.
<!-- /ANCHOR:ruled-out-directions -->

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER

- Completed pivots: 0
- Failed pivots: 0
- Saturated: plugin state/commands, Beancount syntax/lots, beanquery grammar, price flow, AI workflows, troubleshooting
- Remaining frontier: none within the two-iteration scope
<!-- /ANCHOR:divergence-frontier -->

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS

None.
<!-- /ANCHOR:carried-forward-open-questions -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS

Synthesis: consolidate the two verified iterations into the final knowledge base and resource map.
<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->

## 12. KNOWN CONTEXT

- Obsidian community registry maps `beancount-finance` to `mkshp-dev/obsidian-finance-plugin`.
- `manifest.json` at tag `2.3.1` confirms version 2.3.1, desktop-only, minimum Obsidian 1.7.2.
- The Git repository does not track the built `main.js`; the tag source is TypeScript and `main.js` is distributed as a release asset.
- Repository code-search commit used for source navigation: `a686c5003b75de554a4cd1a1cfb9c5c76fe6cb81`; tag reads will be preferred for claims.
- `resource-map.md` is not present for this detached packet.

## 13. RESEARCH BOUNDARIES

- Max iterations: 2
- Convergence threshold: 0.05
- Stop policy: max-iterations
- Per-iteration budget: 12 tool calls
- Progressive synthesis: true
- Current generation: 2
- Started: 2026-08-02T11:52:43.836Z
