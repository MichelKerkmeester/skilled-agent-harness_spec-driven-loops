# Deep Research Strategy

## 2. TOPIC

Inventory every reference to the model-benchmark deep-loop mode (workflowMode model-benchmark, command /deep:model-benchmark, assets deep-model-benchmark-*.yaml and deep-model-benchmark-presentation.txt, loopHostMode model-benchmark in the shared deep-improvement packet) across this whole repository outside specs/, so its full deletion can be planned. Classify each reference DELETE / EDIT / SHARED-WITH-AGENT-IMPROVEMENT / KEEP-AS-HISTORY, cover indirect wiring (registry projections, compiled contracts, drift guards, generated mirrors, tests and fixtures) separately, and finish with the tests, validators and doctor checks that cover the touched surfaces.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Which deep-loop hub registries and metadata files reference the model-benchmark mode, and how is each reference classified (DELETE vs EDIT)?
- [x] Which .skilled/commands/deep surfaces and deep-improvement packet files implement the model-benchmark mode?
- [x] How is model-benchmark wired into system-skill-advisor and sk-doc surfaces (projections, aliases, drift guards, sk-create-benchmark)?
- [x] Which runtime mirrors (.claude .opencode .codex .cursor .pi .devin .hermes) and repo-level surfaces (hooks, bin/, scripts, READMEs, changelogs, env examples) reference the mode, and is each a symlink, a generated copy, or a hand-written file?
- [x] Which indirect wiring (compiled contracts, generated mirrors, drift guards, tests, fixtures, validators, doctor checks) covers the mode's surfaces, and does anything outside the repository consume the mode?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS

- Editing, moving, deleting or staging any repository file (this lineage is read-only outside its own research directory).
- Deciding the deletion mechanics for the agent-improvement mode, which a sibling lineage inventories.
- Re-validating the correctness of the mode's implementation beyond locating and classifying references.

---

## 5. STOP CONDITIONS

- max-iterations reached (stopPolicy: max-iterations forces all 10 iterations; convergence is telemetry only).
- All five key questions answered with cited evidence before the cap (telemetry, not a stop: the cap still runs).

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Which deep-loop hub registries and metadata files reference the model-benchmark mode, and how is each reference classified (DELETE vs EDIT)?
- Which .skilled/commands/deep surfaces and deep-improvement packet files implement the model-benchmark mode?
- How is model-benchmark wired into system-skill-advisor and sk-doc surfaces (projections, aliases, drift guards, sk-create-benchmark)?
- Which runtime mirrors (.claude .opencode .codex .cursor .pi .devin .hermes) and repo-level surfaces (hooks, bin/, scripts, READMEs, changelogs, env examples) reference the mode, and is each a symlink, a generated copy, or a hand-written file?
- Which indirect wiring (compiled contracts, generated mirrors, drift guards, tests, fixtures, validators, doctor checks) covers the mode's surfaces, and does anything outside the repository consume the mode?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- the master `rg -l` sweep gave the full repository file partition before drilling in, so each later iteration has a bounded, verifiable work list; line-verified `sed` reads kept every citation exact. (iteration 1)
- sizing files first surfaced that the command surface is four delete-only files plus edits inside Lane A surfaces; the Lane B/Lane A seam (shared scripts) emerged from reading the YAML step bodies rather than the prose. (iteration 2)
- reading the Lane A YAML call sites first fixed the shared/delete split before classification; the default.json fixture list pinned the exact fixture carve-out. (iteration 3)
- separating the manual alias group from the generated projection block by a full-file match scan avoided a wrong regen instruction; reading both projection locations caught the manual/generated duplication. (iteration 4)
- reading the family router first exposed that sk-create-benchmark is four families, preventing a wrong whole-skill deletion call; the false-positive catch shows the value of exact-pattern re-verification, now scheduled for iteration 10. (iteration 5)
- the `--max-columns` retry after the flood; extracting with `rg -o` avoided re-reading single-line JSONs; directory comparison exposed the `.opencode/bin` mirror ahead of the dedicated mirror iteration. (iteration 6)
- `ls -la` first classified seven trees in one look; the generated headers named their generators, and the filename search located them, turning "unknown sync tool" into an actionable regen step. (iteration 7)
- a per-surface sweep kept the READMEs and env files from being missed, and the changelog classification stayed uniform. (iteration 8)
- the `--no-ignore` compiled-routing sweep closed the loop on iteration 6 cleanly; separating mode-exclusive packages from shared ones (deep-improvement-common) kept the delete set precise. (iteration 9)
- the two-mode re-scan (default vs `--no-ignore --hidden`) produced a clean superset reconciliation that classified every residual; it caught `BARTER.md`, the compiled dist, and the sandboxes, which no earlier targeted pass had surfaced. (iteration 10)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- nothing material; the hub-root `routing-allowlist.json` assumption was wrong and cheaply corrected. (iteration 1)
- nothing material. (iteration 2)
- nothing material. (iteration 3)
- nothing material. (iteration 4)
- the initial dot-wildcard sweep over-counted by one file; correction recorded. (iteration 5)
- the first sweep wasted output budget on a giant JSON line; corrected pattern now standard for report files. (iteration 6)
- a zsh glob failure silently skipped one plugin scan; re-ran the guard check against the single file and confirmed the dynamic registry read. (iteration 7)
- nothing material. (iteration 8)
- nothing material. (iteration 9)
- the first master sweep missed a root-level file; the closing sweep is what makes the inventory trustworthy, and the reason the run reserved an iteration for it. (iteration 10)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### `.pi/extensions` and runtime hook JSONs: no matches. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: `.pi/extensions` and runtime hook JSONs: no matches.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `.pi/extensions` and runtime hook JSONs: no matches.

### `.skilled/commands/doctor/**`: clean; no further surface there. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: `.skilled/commands/doctor/**`: clean; no further surface there.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `.skilled/commands/doctor/**`: clean; no further surface there.

### `assets/compiled/manifest.jsonl` and `assets/legacy/` bodies: confirmed no model-benchmark pairs exist; only the README sentences mention it. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `assets/compiled/manifest.jsonl` and `assets/legacy/` bodies: confirmed no model-benchmark pairs exist; only the README sentences mention it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `assets/compiled/manifest.jsonl` and `assets/legacy/` bodies: confirmed no model-benchmark pairs exist; only the README sentences mention it.

### `benchmark/reports/compiled-routing/**` under sk-doc: historical benchmark reports, KEEP-AS-HISTORY, no edit needed. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `benchmark/reports/compiled-routing/**` under sk-doc: historical benchmark reports, KEEP-AS-HISTORY, no edit needed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `benchmark/reports/compiled-routing/**` under sk-doc: historical benchmark reports, KEEP-AS-HISTORY, no edit needed.

### `cli-classifier/README.md` beyond the JEV table has no other mode references. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: `cli-classifier/README.md` beyond the JEV table has no other mode references.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `cli-classifier/README.md` beyond the JEV table has no other mode references.

### `mode-contracts` under runtime/lib: no mode string present (per master sweep absence). -- BLOCKED (iteration 9, 1 attempts)
- What was tried: `mode-contracts` under runtime/lib: no mode string present (per master sweep absence).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `mode-contracts` under runtime/lib: no mode string present (per master sweep absence).

### `routing-accuracy/` and `fixtures/` (no matches); `command-bridges/README.md` does not exist. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `routing-accuracy/` and `fixtures/` (no matches); `command-bridges/README.md` does not exist.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `routing-accuracy/` and `fixtures/` (no matches); `command-bridges/README.md` does not exist.

### Any compiled-routing stage outside 009: verified clean with a full-tree `--no-ignore` sweep. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Any compiled-routing stage outside 009: verified clean with a full-tree `--no-ignore` sweep.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Any compiled-routing stage outside 009: verified clean with a full-tree `--no-ignore` sweep.

### Assuming `routing-allowlist.json` exists at hub root: it does not; only the deep-improvement packet has one (iteration 3 scope). -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Assuming `routing-allowlist.json` exists at hub root: it does not; only the deep-improvement packet has one (iteration 3 scope).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Assuming `routing-allowlist.json` exists at hub root: it does not; only the deep-improvement packet has one (iteration 3 scope).

### Claiming external consumers exist: the probe found none; statement recorded as inference with its basis. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Claiming external consumers exist: the probe found none; statement recorded as inference with its basis.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Claiming external consumers exist: the probe found none; statement recorded as inference with its basis.

### Classifying `benchmark/reports/**` as mode-owned: they are historical reports about the skill (info rows only) and carry no Lane B run outputs ("Recorded Lane B runs: none yet"). -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Classifying `benchmark/reports/**` as mode-owned: they are historical reports about the skill (info rows only) and carry no Lane B run outputs ("Recorded Lane B runs: none yet").
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Classifying `benchmark/reports/**` as mode-owned: they are historical reports about the skill (info rows only) and carry no Lane B run outputs ("Recorded Lane B runs: none yet").

### Classifying the `benchmark-integration/` playbook pages as Lane B-only: the playbook's own lane map puts that category in the shared set. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Classifying the `benchmark-integration/` playbook pages as Lane B-only: the playbook's own lane map puts that category in the shared set.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Classifying the `benchmark-integration/` playbook pages as Lane B-only: the playbook's own lane map puts that category in the shared set.

### Covering `.worktrees/**`/`barter/**` in this inventory: duplicate checkouts; recorded as an explicit scope assumption. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Covering `.worktrees/**`/`barter/**` in this inventory: duplicate checkouts; recorded as an explicit scope assumption.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Covering `.worktrees/**`/`barter/**` in this inventory: duplicate checkouts; recorded as an explicit scope assumption.

### Doctor or validator edits: no mode references exist in them. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Doctor or validator edits: no mode references exist in them.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Doctor or validator edits: no mode references exist in them.

### Editing `.cursor`, `.devin`, `.opencode` file copies directly: they are symlinks or generated mirrors. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Editing `.cursor`, `.devin`, `.opencode` file copies directly: they are symlinks or generated mirrors.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Editing `.cursor`, `.devin`, `.opencode` file copies directly: they are symlinks or generated mirrors.

### Editing any changelog: all historical mentions are KEEP-AS-HISTORY. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Editing any changelog: all historical mentions are KEEP-AS-HISTORY.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Editing any changelog: all historical mentions are KEEP-AS-HISTORY.

### Editing the anchor-repair spec fixtures: parser-test corpus, historical; edits would invalidate test expectations. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Editing the anchor-repair spec fixtures: parser-test corpus, historical; edits would invalidate test expectations.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Editing the anchor-repair spec fixtures: parser-test corpus, historical; edits would invalidate test expectations.

### Editing the guard plugin source: it resolves modes from `mode-registry.json` at runtime. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Editing the guard plugin source: it resolves modes from `mode-registry.json` at runtime.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Editing the guard plugin source: it resolves modes from `mode-registry.json` at runtime.

### Editing the JEV feature implementations for this deletion: only documentation caller references change. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Editing the JEV feature implementations for this deletion: only documentation caller references change.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Editing the JEV feature implementations for this deletion: only documentation caller references change.

### Escalating `cite-drift-redirects.json`: resolved as spec-tree history. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Escalating `cite-drift-redirects.json`: resolved as spec-tree history.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Escalating `cite-drift-redirects.json`: resolved as spec-tree history.

### Grepping for a committed `benchmark/model-benchmark/{run_label}` outputs tree: none exists; only the two historical report folders are present. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Grepping for a committed `benchmark/model-benchmark/{run_label}` outputs tree: none exists; only the two historical report folders are present.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Grepping for a committed `benchmark/model-benchmark/{run_label}` outputs tree: none exists; only the two historical report folders are present.

### Hand-editing compiled dist or sandbox artifacts: both are generated; rebuild/regenerate. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Hand-editing compiled dist or sandbox artifacts: both are generated; rebuild/regenerate.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Hand-editing compiled dist or sandbox artifacts: both are generated; rebuild/regenerate.

### Hunting for hook-level registrations: hooks never reference the mode (verified across all seven runtimes). -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Hunting for hook-level registrations: hooks never reference the mode (verified across all seven runtimes).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Hunting for hook-level registrations: hooks never reference the mode (verified across all seven runtimes).

### None yet. The master sweep file list is now the authoritative work partition. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: None yet. The master sweep file list is now the authoritative work partition.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None yet. The master sweep file list is now the authoritative work partition.

### Regenerating `generation-diagnostics.json` by hand: it is a generated diagnostic dump; regen or bulk edit after deletion. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Regenerating `generation-diagnostics.json` by hand: it is a generated diagnostic dump; regen or bulk edit after deletion.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Regenerating `generation-diagnostics.json` by hand: it is a generated diagnostic dump; regen or bulk edit after deletion.

### Regenerating the deep routing alias projection in `aliases.ts`: the generated group set does not include `deep-model-benchmark`; only the manual group needs deletion and the embedded hash stays valid. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Regenerating the deep routing alias projection in `aliases.ts`: the generated group set does not include `deep-model-benchmark`; only the manual group needs deletion and the embedded hash stays valid.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Regenerating the deep routing alias projection in `aliases.ts`: the generated group set does not include `deep-model-benchmark`; only the manual group needs deletion and the embedded hash stays valid.

### Runtime `SYNC.md` files: no mode mentions. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Runtime `SYNC.md` files: no mode mentions.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Runtime `SYNC.md` files: no mode mentions.

### Searching for model-benchmark inside `research.md`, `review.md`, `ai-council.md`: no matches; the three sibling command files do not reference Lane B. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Searching for model-benchmark inside `research.md`, `review.md`, `ai-council.md`: no matches; the three sibling command files do not reference Lane B.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searching for model-benchmark inside `research.md`, `review.md`, `ai-council.md`: no matches; the three sibling command files do not reference Lane B.

### Searching only `model-benchmark` as an exact string: misses "model benchmark" prose and `benchmark-harness` alias; used the `model[-_ ]?benchmark` alternation instead (recovered both). -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Searching only `model-benchmark` as an exact string: misses "model benchmark" prose and `benchmark-harness` alias; used the `model[-_ ]?benchmark` alternation instead (recovered both).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searching only `model-benchmark` as an exact string: misses "model benchmark" prose and `benchmark-harness` alias; used the `model[-_ ]?benchmark` alternation instead (recovered both).

### Treating `cite-drift-redirects.json` as an in-scope reference: verified false positive from the dot wildcard. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Treating `cite-drift-redirects.json` as an in-scope reference: verified false positive from the dot wildcard.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating `cite-drift-redirects.json` as an in-scope reference: verified false positive from the dot wildcard.

### Treating `run-benchmark.cjs` / `benchmark-profiles/default.json` as Lane B-only: Lane A YAMLs call them directly (finding 11), so they are shared. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Treating `run-benchmark.cjs` / `benchmark-profiles/default.json` as Lane B-only: Lane A YAMLs call them directly (finding 11), so they are shared.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating `run-benchmark.cjs` / `benchmark-profiles/default.json` as Lane B-only: Lane A YAMLs call them directly (finding 11), so they are shared.

### Treating `scripts/model-benchmark/` as one DELETE directory: Lane A consumes `run-benchmark.cjs` from it, so the directory is a carve-out, not a whole-tree delete. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Treating `scripts/model-benchmark/` as one DELETE directory: Lane A consumes `run-benchmark.cjs` from it, so the directory is a carve-out, not a whole-tree delete.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating `scripts/model-benchmark/` as one DELETE directory: Lane A consumes `run-benchmark.cjs` from it, so the directory is a carve-out, not a whole-tree delete.

### Treating all `deep-agent-improvement-*` mentions as DELETE: the Lane A surfaces survive; only their Lane B paragraphs are edits. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Treating all `deep-agent-improvement-*` mentions as DELETE: the Lane A surfaces survive; only their Lane B paragraphs are edits.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating all `deep-agent-improvement-*` mentions as DELETE: the Lane A surfaces survive; only their Lane B paragraphs are edits.

### Treating the sk-prompt/system-deep-loop benchmark reports as editable: they are historical measurements; no edit, KEEP-AS-HISTORY. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Treating the sk-prompt/system-deep-loop benchmark reports as editable: they are historical measurements; no edit, KEEP-AS-HISTORY.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the sk-prompt/system-deep-loop benchmark reports as editable: they are historical measurements; no edit, KEEP-AS-HISTORY.

### Treating the skill-graph `model benchmark` fragment as a deep-loop routing signal: it belongs to sk-doc's harvested trigger set. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Treating the skill-graph `model benchmark` fragment as a deep-loop routing signal: it belongs to sk-doc's harvested trigger set.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the skill-graph `model benchmark` fragment as a deep-loop routing signal: it belongs to sk-doc's harvested trigger set.

### Treating the whole `sk-create-benchmark` skill as DELETE: it is a four-family skill; only the model-benchmark family is removed and the shared/other families stay. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Treating the whole `sk-create-benchmark` skill as DELETE: it is a four-family skill; only the model-benchmark family is removed and the shared/other families stay.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the whole `sk-create-benchmark` skill as DELETE: it is a four-family skill; only the model-benchmark family is removed and the shared/other families stay.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- Assuming `routing-allowlist.json` exists at hub root: it does not; only the deep-improvement packet has one (iteration 3 scope). (iteration 1)
- None yet. The master sweep file list is now the authoritative work partition. (iteration 1)
- Searching only `model-benchmark` as an exact string: misses "model benchmark" prose and `benchmark-harness` alias; used the `model[-_ ]?benchmark` alternation instead (recovered both). (iteration 1)
- `assets/compiled/manifest.jsonl` and `assets/legacy/` bodies: confirmed no model-benchmark pairs exist; only the README sentences mention it. (iteration 2)
- Searching for model-benchmark inside `research.md`, `review.md`, `ai-council.md`: no matches; the three sibling command files do not reference Lane B. (iteration 2)
- Treating `run-benchmark.cjs` / `benchmark-profiles/default.json` as Lane B-only: Lane A YAMLs call them directly (finding 11), so they are shared. (iteration 2)
- Treating all `deep-agent-improvement-*` mentions as DELETE: the Lane A surfaces survive; only their Lane B paragraphs are edits. (iteration 2)
- Classifying `benchmark/reports/**` as mode-owned: they are historical reports about the skill (info rows only) and carry no Lane B run outputs ("Recorded Lane B runs: none yet"). (iteration 3)
- Classifying the `benchmark-integration/` playbook pages as Lane B-only: the playbook's own lane map puts that category in the shared set. (iteration 3)
- Grepping for a committed `benchmark/model-benchmark/{run_label}` outputs tree: none exists; only the two historical report folders are present. (iteration 3)
- Treating `scripts/model-benchmark/` as one DELETE directory: Lane A consumes `run-benchmark.cjs` from it, so the directory is a carve-out, not a whole-tree delete. (iteration 3)
- `routing-accuracy/` and `fixtures/` (no matches); `command-bridges/README.md` does not exist. (iteration 4)
- Regenerating the deep routing alias projection in `aliases.ts`: the generated group set does not include `deep-model-benchmark`; only the manual group needs deletion and the embedded hash stays valid. (iteration 4)
- Treating the skill-graph `model benchmark` fragment as a deep-loop routing signal: it belongs to sk-doc's harvested trigger set. (iteration 4)
- `benchmark/reports/compiled-routing/**` under sk-doc: historical benchmark reports, KEEP-AS-HISTORY, no edit needed. (iteration 5)
- Treating `cite-drift-redirects.json` as an in-scope reference: verified false positive from the dot wildcard. (iteration 5)
- Treating the whole `sk-create-benchmark` skill as DELETE: it is a four-family skill; only the model-benchmark family is removed and the shared/other families stay. (iteration 5)
- `cli-classifier/README.md` beyond the JEV table has no other mode references. (iteration 6)
- Editing the JEV feature implementations for this deletion: only documentation caller references change. (iteration 6)
- Treating the sk-prompt/system-deep-loop benchmark reports as editable: they are historical measurements; no edit, KEEP-AS-HISTORY. (iteration 6)
- Covering `.worktrees/**`/`barter/**` in this inventory: duplicate checkouts; recorded as an explicit scope assumption. (iteration 7)
- Editing `.cursor`, `.devin`, `.opencode` file copies directly: they are symlinks or generated mirrors. (iteration 7)
- Editing the guard plugin source: it resolves modes from `mode-registry.json` at runtime. (iteration 7)
- Runtime `SYNC.md` files: no mode mentions. (iteration 7)
- `.pi/extensions` and runtime hook JSONs: no matches. (iteration 8)
- Claiming external consumers exist: the probe found none; statement recorded as inference with its basis. (iteration 8)
- Editing any changelog: all historical mentions are KEEP-AS-HISTORY. (iteration 8)
- Hunting for hook-level registrations: hooks never reference the mode (verified across all seven runtimes). (iteration 8)
- `mode-contracts` under runtime/lib: no mode string present (per master sweep absence). (iteration 9)
- Any compiled-routing stage outside 009: verified clean with a full-tree `--no-ignore` sweep. (iteration 9)
- Editing the anchor-repair spec fixtures: parser-test corpus, historical; edits would invalidate test expectations. (iteration 9)
- Regenerating `generation-diagnostics.json` by hand: it is a generated diagnostic dump; regen or bulk edit after deletion. (iteration 9)
- `.skilled/commands/doctor/**`: clean; no further surface there. (iteration 10)
- Doctor or validator edits: no mode references exist in them. (iteration 10)
- Escalating `cite-drift-redirects.json`: resolved as spec-tree history. (iteration 10)
- Hand-editing compiled dist or sandbox artifacts: both are generated; rebuild/regenerate. (iteration 10)

<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
[None yet]

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

Deep-research fan-out lineage `deepseek` for packet `001-model-benchmark-inventory`. Run is read-only outside its lineage directory. Starting points named by the dispatch: `.skilled/skills/system-deep-loop/` hub surfaces, `.skilled/commands/deep/`, `deep-improvement/` packet, `system-skill-advisor/`, `sk-doc/` (incl. sk-create-benchmark), `cli-external-orchestration/`, runtime mirrors, hooks, bin/, scripts/git-hooks, env examples, READMEs, changelogs, root README.md.

### Bounded Context Snapshot

- Source pointers: `.skilled/skills/system-deep-loop/mode-registry.json`, `hub-router.json`, `ROUTER.md`, `SKILL.md`, `command-metadata.json`, `leaf-manifest.json`, `leaf-scopes.json`, `graph-metadata.json`.
- Integration points: mode registry projections into runtime mirrors; skill-advisor routing registry; command asset YAMLs under `.skilled/commands/deep/assets/`.
- Constraints and risks: spec folder is out of write scope; validation of spec docs is deferred; telemetry heartbeats are recorded as a deviation.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 10 (stopPolicy: max-iterations)
- Convergence threshold: 0.05 (telemetry only)
- Per-iteration budget: 24 tool calls, 10 minutes
- Progressive synthesis: false (synthesis owns research.md)
- Lifecycle branches: `new` (this run)
- Canonical pause sentinel: `.deep-research-pause`
- Current generation: 1
- Started: 2026-10-10T18:39:43Z
