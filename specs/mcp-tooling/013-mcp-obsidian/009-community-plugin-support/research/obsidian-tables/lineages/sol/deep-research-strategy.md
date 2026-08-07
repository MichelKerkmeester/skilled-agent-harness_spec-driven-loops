# Deep Research Strategy — obsidian-tables

## 1. OVERVIEW

### Purpose

Produce a source-verified knowledge base for file-layer AI manipulation of `aztekgold/obsidian-tables` `.table.md` JSON documents.

## 2. TOPIC

Exact persisted data model, feature behavior, safe file-layer workflows, and troubleshooting for the Obsidian Tables community plugin.

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)

- None within the repository-current persistence contract; non-blocking parity questions are carried forward below.
<!-- /ANCHOR:key-questions -->

## 4. NON-GOALS

- Modifying the plugin or vault files.
- Reverse-engineering only the minified installed `main.js` when readable repository source is available.
- General Obsidian database-plugin comparisons unrelated to `aztekgold/obsidian-tables`.

## 5. STOP CONDITIONS

- Run exactly two evidence iterations, treating convergence as telemetry.
- Synthesize only after both iterations or an unrecoverable state/write failure.

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS

- [x] Exact wrapper/root/IDs/rows/order (iteration 2).
- [x] Every requested type, value encoding, options, and colors (iteration 2).
- [x] Formula definition/result persistence (iteration 2).
- [x] Views, filters, sorts, embeds, and divergence (iterations 1–2).
- [x] Features/settings/CSV/migrations/workflows/troubleshooting (iteration 2).
<!-- /ANCHOR:answered-questions -->

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED

- README/tree reads established the public contract and source map without inventing keys (iteration 1).
- GitHub connector obtained source bodies after raw transports failed (iteration 2).
- Types plus serializers/runtime handlers resolved shape and divergences (iteration 2).
<!-- /ANCHOR:what-worked -->

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED

- Raw GitHub shell retrieval failed DNS resolution (iteration 1).
- Blob/API/CDN paths failed through cache or URL-safety controls (iteration 1).
<!-- /ANCHOR:what-failed -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)

### Raw/blob/API/CDN source retrieval — BLOCKED

- Exhausted in iteration 1; use connector or local checkout instead.
<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS

- Bare-JSON `.table.md`; canonical multi-select string; render-only formula results; all stored sorts executing; README labels as schema keys.
<!-- /ANCHOR:ruled-out-directions -->

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER

- Completed pivots: 1 — README/tree to connector source inspection
- Failed pivots: 1 — raw/blob/API/CDN family
- Audited overrides: 0
- Saturated: wrapper/root, columns/cells, formulas, views/filters/sorts, migration, workflows, troubleshooting
- Pivot lineage: unavailable bodies → connector → verified Agentable contract
- Remaining frontier: installed parity and later-release/command-ID audit only
<!-- /ANCHOR:divergence-frontier -->

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS

- Confirm installed tag/commit before applying the `main` contract to another release.
- Audit later multi-sort behavior and exhaustive command IDs/notices only if operationally required.
<!-- /ANCHOR:carried-forward-open-questions -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS

None. Synthesis, resource map, reducer state, and convergence report are complete.
<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->

## 12. KNOWN CONTEXT

- The target repository is `https://github.com/aztekgold/obsidian-tables`.
- The installed `main.js` is minified; repository source and README are the required primary evidence.
- `resource-map.md` is not present; skipping that coverage gate.
- Startup memory context was unavailable, so no prior findings are assumed.

## 13. RESEARCH BOUNDARIES

- Max iterations: 2
- Convergence threshold: 0.05
- Stop policy: max-iterations
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true
- Allowed writes: this lineage artifact directory only
- Session: `fanout-sol-1785673258726-kcaoky`
