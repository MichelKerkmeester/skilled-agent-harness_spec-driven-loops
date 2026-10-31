# Iteration 4: Where else the same judgment pays off

**Focus:** Q4 — the corpora that carry line-anchored citations outside the current scan scope, the checkers that already neighbor this judgment, and what a wider scan must solve before it can expand.

## Findings

### F4-01 — The big adjacent corpus is `specs/**`, not the runtime mirrors
A repository census of line-anchored citations (`<ext>:` + `<line>`, fences excluded for the small corpora, `git grep` sizing for specs): `specs/` holds 12,092 documents with at least one file:line citation, 7,203 of them outside `z_archive` — against the skills tree's 82 documents carrying citations at HEAD. The skills tree is where the scan points today; `specs/` is two orders of magnitude larger and is what implementers, reviewers and phase closure actually read. [SOURCE: git grep census over `specs/**/*.md`; worktree citation scan over `git ls-files .skilled/skills`; both run by this iteration]

### F4-02 — Both neighbors check less than deadness, and neither checks support
`check-ac-coverage.sh`'s `_ac_citation_resolves` (in `.skilled/skills/system-spec-kit/runtime/cli/rules/`) resolves a `file:line` citation only far enough to prove the cited line number exists (`_ac_file_has_line`, counting lines), and only for spec-folder acceptance criteria. `validate_catalog_package.py` explicitly strips a trailing `:123` or `:123-145` (`LINE_RANGE_SUFFIX_RE`) before checking path existence, and left the cells it cannot substantiate unchecked. So on these two live surfaces a citation whose line moved but still exists passes every existing gate, and whether the line still supports its sentence is checked nowhere. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-ac-coverage.sh:425-455; .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py:487-505]

### F4-03 — Expanding to mirrors, root docs, or repo rules buys nothing; their dialect is path-only
Runtime mirrors and governance docs carry almost no line-anchored citations: `.skilled/hooks` 2, `.skilled/agents` 1, `.hermes/skills` 1, and one each in the `.pi`/`.cursor`/`.claude`/`.devin` agent trees; root docs and all 13 repo-rules files carry none. What they do carry is path-only backticked references: 43,523 occurrences across 5,736 skill docs (5,000+ in each of system-deep-loop, sk-design, system-spec-kit, mcp-tooling, cli-external-orchestration, sk-doc). That dialect has no window to judge, so it is a path/anchor-existence check — a different tool, not this judgment. [SOURCE: worktree scans over `git ls-files` for each corpus, run by this iteration]

### F4-04 — Within the current scope, 41% of citations are invisible, and most of those are illustrative
The run's census counts 208 in_range, 44 ambiguous and 103 unresolved. A worktree rescan of the same 82 documents reproduces the shape (272 resolved, 38 ambiguous, 155 unresolved of 465; the worktree differs slightly from the HEAD snapshot the census reads) and characterizes the unresolved set: it is dominated by example-target paths in guidance prose — `main.ts` and `src/main.ts` in the sk-code-obsidian reference docs, `tools/screenshots/capture.mjs`, and `code_surface_detection.md:30-37` inside an "e.g. failure triage" sentence in the sk-code playbook. Ambiguous rows are basename collisions (e.g. several `main.ts`). A wider scan must classify example references before it measures anything, or every corpus it adds will hand back mostly unresolved noise. [SOURCE: ~/.skilled/.labels/runs/032-jev.stdout.txt; worktree rescan of the 82 citing documents, run by this iteration; .skilled/skills/sk-code/manual-testing-playbook/manual-testing-playbook.md:185]

### F4-05 — Expansion cost is bounded on the model side and expensive on the read side
The model cost scales with the labeled draw (40 rows, ~121 calls), not with corpus size, so a wider scope can keep model spend flat; what scales with corpus size is the census/doc-reader cost, which is already the pipeline's bottleneck (8,667 docs for 82 citing ones, iteration 2). The draw is currently per-skill round-robin with a single global 40-row gate; a per-corpus draw with the same 20-live/20-constructed shape would let each corpus carry its own labels and its own keep rule. [SOURCE: .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:430-480,1036; iteration-002.md F2-02]

### F4-06 — Ranked same-judgment surfaces
1. **Spec acceptance-criteria citations** — deadness-only today, and acceptance criteria are the closure gate; a support check catches the class where a criterion cites a line that still exists but no longer shows the behavior. 2. **Spec evidence citations** in plan.md / implementation-summary.md / research docs — the research program's own evidence trail (this research uses `file:line` for every claim), currently unchecked beyond deadness. 3. **The in-scope sk-code surface docs** — the densest live citation users inside the current scope (109 citations, 43 of them unresolved), so the same measurement already has a second corpus available at no expansion cost. 4. **Hub SKILL.md cross-references** — mostly path-only; only path-existence can be checked there. [SOURCE: F4-01..F4-04; 032 run stdout per-skill census lines]

## Sources Consulted

- `~/.skilled/.labels/runs/032-jev.stdout.txt` (per-skill census, unresolved counts)
- Worktree scans over `git ls-files` for `.skilled` (non-skills), runtime mirrors, root docs, and specs sizing (`git grep`)
- `.skilled/skills/system-spec-kit/runtime/cli/rules/check-ac-coverage.sh:425-455`
- `.skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py:487-505`
- `.skilled/skills/sk-code/manual-testing-playbook/manual-testing-playbook.md:180-190`
- `.skilled/skills/sk-doc/scripts/validate-doc-model-refs.js` (a sibling checker, about model names, not citations)

## Assessment

- **newInfoRatio:** 0.85
- **Novelty justification:** The specs corpus sizing, the mirror/root-doc null result, the illustrative-unresolved characterization, and the ranked surfaces are new; F4-02 confirms and quotes the neighbors previously named in the 032 goal log.
- **Confidence:** High for F4-01..F4-03 (scans over tracked files); high for F4-02 (source quotes); medium-high for F4-04 (a worktree rescan, slightly different from the HEAD snapshot the census reads, and the illustrative classification is a reading of samples).

## Reflection

- **What worked:** Running the same regex over each corpus separately; sampling unresolved rows instead of reasoning about the aggregate.
- **What failed:** An initial assumption that the runtime mirrors would carry copied citations worth checking failed — they carry almost none, and the null result is the finding.
- **Ruled out:** "Expand the scan to mirrors and repo rules" — ruled out (F4-03). "Path-only references are the same judgment" — ruled out; they need a path/anchor check, and the catalog validator shows what that looks like.

## Recommended Next Focus

Q5: What would a default-on integration need, and at what cost and risk? Assemble the constraints from all four iterations: the census cost, the label lifecycle, the reader gap, the recording gaps, the qualification rules, and the surfaces named in F4-06.
