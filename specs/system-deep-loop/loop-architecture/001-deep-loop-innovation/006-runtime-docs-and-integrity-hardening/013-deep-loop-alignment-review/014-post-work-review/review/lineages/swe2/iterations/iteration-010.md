# Iteration 10 — Whole-Program Read: What Thirteen Phases Still Missed

**Focus:** D2 Security + D1 Correctness + D3 Traceability — Angle 10: the closing pass. Cover the three unaudited phases (001 meta-review outputs, 002 roster completeness, 012 stress-fixture root), close the security dimension, and ask the question the program exists to answer: does any surface still state a count its own registry contradicts?
**Phase records audited:** `001-angle-driven-review`, `002-roster-completeness`, `012-missing-stress-fixture-root`

## Method

1. Phase 002 — counted executor kinds and registry modes directly, then swept the registry's own prose for residual counts.
2. Phase 012 — walked the restored fixture root and audited `setup-cp-sandbox.sh`'s repo-root arithmetic and per-tree requirements.
3. Phase 001 — verified the review wave lineages it claims exist.
4. Security dimension — the program's security surface is its guards/hooks; checked each audited guard's failure mode against its documentation.

## Evidence

### Phase 002 — the named file still contradicts itself

- `EXECUTOR_KINDS` has 8 entries: `native` + seven CLI kinds (`cli-codex`, `cli-claude-code`, `cli-opencode`, `cli-cursor`, `cli-devin`, `cli-pi`, `cli-hermes`) [SOURCE: executor-config.ts:11].
- `mode-registry.json` carries **7** modes and its own `:5` description says "All seven modes."
- **But the same file's field glossary still says "six" three times**: `:9` "cli-dispatch for all six external CLI workflows", `:14` "All six cli-external-orchestration modes use folder == packetSkillName", `:15` "None of the six executor modes has a dedicated command". This is the file phase 002's problem statement named — its sweep fixed the roster statements but not the field-documentation counts.
- `SKILL.md` is consistent now: "seven workflow modes" at :3, :15, :56, :192 and all seven CLIs in the keyword line.

### Phase 012 — verified clean

- Fixture root live at `test-fixtures/060-stress-test/` with all six runtime tree shapes: `.opencode`/`.claude`/`.cursor`/`.pi` (`.md`), `.codex` (`.toml`), `.devin` (`agents/cp-improve-target/AGENT.md`).
- `setup-cp-sandbox.sh` requires each tree with the correct per-tree shape — TOML under `.codex` (the drift defect fixed), `AGENT.md` under `.devin`.
- `REPO_ROOT` walks six levels — the script sits exactly six below root; the comment documents the move-with-the-tree invariant.
- Sandbox guard fails closed: absolute `/tmp/*` only, `..` rejected before `rm -rf` runs.

### Phase 001 — outputs exist

- Wave lineages present: `001-angle-driven-review/review/lineages/{wave1-deepseek,wave2-deepseek,wave2-glm}/deep-review-findings-registry.json` plus the merged registry.

### Security dimension — covered

Every audited guard's documented failure mode matches its implementation: write-containment quarantines rather than reverts by default (iter 5), pre-push's mass-deletion/naming gates fail open *with a printed warning* where the header documents fail-open (iter 9), the sandbox validator fails closed before any destructive call (this pass), and the routing-commit-parity gate fails closed on the pushed-bytes check. No undocumented fail-open surface found.

## Findings

### F007 (P1 — correctness): phase 002's named file still states "six" against its own seven-entry modes array

The phase's stated purpose was "no document states a roster or count that its own registry or the executor config contradicts." `mode-registry.json` — the file the problem statement named — still carries three stale count claims in its field glossary (:9, :14, :15) while its own `modes[]` has seven entries and its own description says seven. Same defect class as the finding, surviving in prose one indentation level below the corrected line.

*Adjudication:* claim = "three glossary strings state a count the same file's modes array contradicts"; evidence = :9/:14/:15 vs `len(modes)=7` vs :5 "All seven"; counterevidence sought = a reading where "six" scopes to something else (none — all three phrases predicate over the modes/executors, which are seven); alternative = glossary prose is exempt from the count rule (the phase's purpose states no count exception); final severity P1; confidence high; downgrade trigger = evidence the three strings were deliberately left as historical record (no such marker exists).

## Verdict rationale

The closing pass found the program's most-cited defect class — a count contradicting its own registry — still alive in the very file a phase named, alongside six clean phases and a clean security surface. F004 and F007 together say the program's sweeps correct the named lines but not the named files.

Review verdict: CONDITIONAL
