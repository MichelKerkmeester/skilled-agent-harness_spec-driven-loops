# Iteration 004 -- Maintainability

## Dispatcher

- Iteration: 4 of 5. The state log held three canonical `type:"iteration"` records, and the dispatch named 4, so the JSONL-derived number and the dispatched number agree.
- Mode: review. Target: `specs/hooks-plugins-extensions/hook-platform/008-hook-library-cleanup-and-readme-rewrite`.
- Dimension: maintainability, the last unreviewed dimension.
- Run: `2026-11-16T10:21:46.673Z`, generation 1, lineageMode `new`.

## Files Reviewed

- `.skilled/hooks/README.md:1-436` -- the root index, switch table, placement rules, directory tree and coverage matrix.
- `.skilled/hooks/cli-dispatch/README.md:1-278` -- sampled feature README.
- `.skilled/hooks/subagent-dispatch-guard/README.md:1-200` -- sampled feature README.
- `.skilled/hooks/completion-evidence/README.md:1-228` -- sampled feature README.
- `.skilled/hooks/session-handover/README.md:1-283` -- the split orientation page.
- `.skilled/hooks/injection-contract.md:20` and `.skilled/hooks/coverage-rationale.md:30` -- the two pointers to the canonical switch index.
- `004-hook-readme-fold-and-rewrite/spec.md:184`, `implementation-summary.md:3,59,134-137,145-146`, `acceptance-criteria.md:56,58,60` -- the count and structure evidence.
- Commands: `git ls-files`, `find`, `comm`, `ls`, `git log` and `git status` over `.skilled/hooks` and `session-handover/`.

## Findings - New

### P0 Findings

None. No correctness or security exposure appeared in this dimension.

### P1 Findings

None.

### P2 Findings

1. **The canonical switch pointer lands on an anchor the README no longer defines** -- `.skilled/hooks/injection-contract.md:20` -- Both contract documents call `./README.md#kill-switch-index` the single source for concern names and aliases, but the rewritten root README defines no heading or explicit anchor with that id. Its headings run `## 1. OVERVIEW` (line 21) through `## 8. RELATED` (line 424), and the switch table sits inside OVERVIEW at lines 47-77 behind the prose sentence `The kill-switch index below lists every concern and alias.` (line 43). A reader who follows the documented pointer lands at the top of a 436-line page. Adding an explicit `kill-switch-index` anchor above the table restores both links without moving any content. [SOURCE: .skilled/hooks/injection-contract.md:20] [SOURCE: .skilled/hooks/coverage-rationale.md:30] [SOURCE: .skilled/hooks/README.md:43]

   Case: A maintainer opens `coverage-rationale.md`, follows the `README.md#kill-switch-index` link to check a switch name, and lands on the README's first line instead of the table.
   Finding class: maintainability
   Scope proof: `injection-contract.md`, `coverage-rationale.md` and `README.md` are all declared in `reviewScopeFiles`, and the broken edge is doc-to-doc inside the declared target.
   Affected surface hints: `injection-contract.md:20`; `coverage-rationale.md:30`; `hooks/README.md:43-77`.

2. **The browsable tree omits the session-handover history engine it indexes** -- `.skilled/hooks/README.md:251` -- The directory-tree block lists `session-handover/bin/session-handover.cjs, history-lookup.mjs`, the four runtime adapter folders, `lib/`'s seven modules and `tests/`, but no `history/` folder. `bin/history-lookup.mjs` is that engine's runnable entry, and the concern README documents `history/` with `lib/`, a `dist/` build and Vitest suites at lines 169 and 124-127. `git ls-files .skilled/hooks/session-handover/history | wc -l` prints 27 tracked files, so the folder is real code in the hub rather than a link-only folder the tree deliberately filters at line 274. One tree line for `history/` closes the gap. [SOURCE: .skilled/hooks/README.md:251] [SOURCE: .skilled/hooks/README.md:274] [SOURCE: .skilled/hooks/session-handover/README.md:169]

   Case: A maintainer follows the browsable tree to change the history lookup, finds no `history/` entry, and edits `bin/history-lookup.mjs` instead of the engine under `history/lib/`.
   Finding class: maintainability
   Scope proof: both READMEs are declared in `reviewScopeFiles`, and the omitted folder is tracked code inside the declared tree.
   Affected surface hints: `hooks/README.md:251-259`; `hooks/session-handover/history/`; `hooks/session-handover/README.md:169`.

3. **The phase-4 README count no longer reproduces from its own command** -- `004-hook-readme-fold-and-rewrite/spec.md:184` -- SC-001 defines success as `find .skilled/hooks -name README.md | wc -l` printing 104. From the current tree the same command prints 105. The extra entry is `.skilled/hooks/README.md`, the folder-root index, which `git ls-files '.skilled/hooks/**/README.md'` excludes, leaving 104 tracked concern READMEs. The phase summary then reports both bases without naming either: line 59 says the tree `now holds 104 READMEs`, while the post-origin/main baseline row at line 146 records `pass=105 fail=0`. The library itself is intact; the criterion and its recorded evidence are what no longer line up. State the basis once (104 concern READMEs, 105 including the folder-root index after the merge) and both numbers reconcile. [SOURCE: 004-hook-readme-fold-and-rewrite/spec.md:184] [SOURCE: 004-hook-readme-fold-and-rewrite/implementation-summary.md:59] [SOURCE: 004-hook-readme-fold-and-rewrite/implementation-summary.md:146]

   Case: A reviewer reruns SC-001 on the merged tree, sees 105, and cannot tell from the packet whether the phase regressed or the counting basis changed.
   Finding class: maintainability
   Scope proof: SC-001, its phase summary and the root README are declared in `reviewScopeFiles`, and the observed counts come from the target tree.
   Affected surface hints: `004/spec.md:184`; `004/implementation-summary.md:59`; `004/implementation-summary.md:146`; `hooks/README.md`.

## Traceability Checks

| Protocol | Status | Gate class | Evidence | Summary |
|---|---|---|---|---|
| `spec_code` | partial | hard | `004/spec.md:184`, `004/implementation-summary.md:59`, `004/implementation-summary.md:146`, `.skilled/hooks/README.md:79-94` | README structure, runtime-table shape and the concern-key to folder map hold on every sampled surface. SC-001's counting command prints 105 against the stated 104, so this README surface is partial pending R4-P2-003. Iteration 3's behavioral spec-to-code evidence is unaffected. |

## Integration Evidence

- The switch-index integration was reviewed at its exact surfaces: `.skilled/hooks/injection-contract.md:20` and `.skilled/hooks/coverage-rationale.md:30` both name `.skilled/hooks/README.md#kill-switch-index`, and the target page defines no such anchor.
- The session-handover split was reviewed as a cross-document surface: the orientation page links all five siblings at `.skilled/hooks/session-handover/README.md:31` and repeats them at lines 270-274, and the five files exist at the folder top level.
- No runtime registration surface was re-entered; iterations 1 and 2 exhausted it.

## Edge Cases

- The 104-versus-105 tally recorded as an ambiguity in iteration 3 is now resolved into a counting-basis difference, not an unresolved ambiguity. It is reported as R4-P2-003 because the criterion, read literally, is not reproducible.
- The `history/` omission was tested against the tree's own filter. That filter excludes link-only folders (`.skilled/hooks/README.md:274`), and `history/` is tracked code, so the omission is drift rather than a deliberate exclusion.
- README uniformity was sampled, not exhaustively read. Four concern READMEs plus the root index were compared, so the clean result is about the real-core family and the shared template, not a claim about all 104 files.
- No scope violations occurred. No review target, config, registry or reducer output was modified.

## Confirmed-Clean Surfaces

- The deliberate concern-key divergence is documented once where a maintainer will find it: `.skilled/hooks/README.md:79` states `The switch name follows the key, not the folder.` and the table at lines 81-93 maps `dispatch` to `cli-dispatch/`, `task-dispatch` to `subagent-dispatch-guard/` and `completion` to `completion-evidence/`. The same convention is echoed in `subagent-dispatch-guard/README.md:157`.
- The four sampled feature READMEs share one structure: frontmatter with `title`, `description` and `trigger_phrases`, then numbered sections `## 1. OVERVIEW` through `## 8. RELATED`, with the runtime table carrying the same five columns (`Runtime | Event | Entry in this folder | Real file | What the runtime shows`).
- The session-handover split is coherent: the orientation page names the five siblings at line 31, its RELATED section repeats them at lines 270-274, and all five exist. Its `tests/ nineteen Node test files plus payload fixtures` line matches the 19 `*.test.*` files observed in `tests/`.
- The real-core placement table (`.skilled/hooks/README.md:117-125`) matches the folders whose code actually lives in the hub, and the link-only folder list at line 276 accounts for the rest.
- The 40-check claim in `cli-dispatch/README.md:49` matches the 40 rows in its check table (lines 53-92).

## Ruled Out

- Feature README structure drift. All four sampled READMEs use the same section order and the same five-column runtime table; no divergent template was found.
- Undocumented concern-key to folder divergence. It is stated at `.skilled/hooks/README.md:79-94` and repeated in the affected concern README.
- Orphaned session-handover sibling. All five sibling documents exist at the folder top level and are linked from both the orientation page and its RELATED section.
- Unresolved 104-versus-105 ambiguity. Resolved to the folder-root README counting basis and reported as R4-P2-003.
- Not retried: the old-name search, the registration checks, the installer check path, the secret-mode checks and the phase-4 completion-claim direction, which the strategy records as exhausted or blocked.

## Next Focus

- Dimension: none remains. Iteration 5 is the final synthesis pass over the carried findings.
- Focus area: reconcile the five active P2 findings (R3-P2-001, R3-P2-002, R4-P2-001, R4-P2-002, R4-P2-003) and confirm the verdict from the findings registry.
- Reason: the stop policy is max-iterations, and all four dimensions have one pass each, so iteration 5 adds no new discovery dimension.
- Rotation status: correctness 1, security 1, traceability 1, maintainability 1. Complete.
- Blocked/productive carry-forward: do not retry the old-name search, the registration checks, or the count drift now resolved as R4-P2-003; do not re-enter the blocked phase-4 completion-claim direction.
- Required evidence: registry totals of five active P2s and no active P0 or P1 at synthesis.

Review verdict: PASS
