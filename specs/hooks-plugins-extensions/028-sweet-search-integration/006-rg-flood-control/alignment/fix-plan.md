# Fix plan

Target: HEAD; head: 214ad8b5cb71e19f9240b036172caef7e3749a79

## In scope

### command:speckit

- [ ] CC-4 P2 .skilled/commands/speckit/README.txt:91 The command-family README now says 'Structured free-text results keep the highest-ranked row per file' and describes the wrapper's --limit, but the same table defines /speckit:search's free-text lane 
  fix: Structured free-text results keep the highest-ranked row per file. The wrapper's `--limit` defaults to 20 files, and `-- -> The `rg-wrapper.mjs` structured lane keeps the highest-ranked row per file. Its `--limit` defaults to 20 files, and `--l
- [ ] S9-free-text-execution-mismatch P1 .skilled/commands/speckit/assets/search-presentation.txt:121 Case: a normal /speckit:search request for a common phrase reaches the command’s raw ripgrep recipe at search.md:105-107. That path does not invoke rg-wrapper, so it cannot cap the streamed results be

### skill:.skilled/skills/system-spec-kit

- [ ] A1 P2 .skilled/skills/system-spec-kit/runtime/cli/retrieval/rg-wrapper.mjs:304 Case: invoke `structured` with `--limit` followed by a 400-digit decimal. The digit check accepts it, but `Number.parseInt` returns `Infinity`; JSON output then reports `limit: null` in a successful n
  fix: limit = Number.parseInt(value, 10); -> const parsedLimit = Number(value); if (!Number.isSafeInteger(parsedLimit)) throw new Error('--limit requires a non-negat
- [ ] CC-3 P2 .skilled/skills/system-spec-kit/runtime/cli/tests/rg-wrapper-recipes.vitest.ts:340 The new Number.isSafeInteger guard at rg-wrapper.mjs:305-306 rejects the A1 case (a 400-digit --limit) but the invalid-limit test covers only -1, 2junk and 1.9. The guard has no regression test, and t
  fix: for (const limit of ['-1', '2junk', '1.9']) { -> for (const limit of ['-1', '2junk', '1.9', '9'.repeat(400)]) {
- [ ] CC-1 P2 .skilled/skills/system-spec-kit/README.md:81 The skill README still describes free-text retrieval as only 'literal ripgrep recipes ... ordered by a caller-side ranking tuple', and its frontmatter version remains 2.7.31.0. The new wrapper behavio
  fix: | **Free-text retrieval** | literal ripgrep recipes scoped by track and packet, ordered by a caller-side ranking tuple | -> | **Free-text retrieval** | literal ripgrep recipes scoped by track and packet, ordered by a caller-side ranking tuple; 
- [ ] CC-2 P2 .skilled/skills/system-spec-kit/runtime/cli/tests/retrofit-convention-pipeline.vitest.ts:169 AC-003 says the retrofit test file proves the baseline resultCount equals record.matchCount, but the only baseline test checks recipe names, exitCode and outcome; it never reads resultCount. The defau

### spec:specs/hooks-plugins-extensions/028-sweet-search-integration

- [ ] CC-5 P2 specs/hooks-plugins-extensions/028-sweet-search-integration/006-rg-flood-control/benchmark/run.mjs:178 The 006 benchmark runner records only the index sha256; plan section 5 and T002b require the git status --porcelain count in both JSON files, and the 004/005 runners record it. before.json's state has
  fix: const state = { indexSha256: sha256(fs.readFileSync(path.join(REPO_ROOT, INDEX))) }; -> const status = spawnSync('git', ['-c', 'core.fsmonitor=false', 'status', '--porcelain'], { cwd: REPO_ROOT, encoding: 'ut

### unowned

- [ ] BAT-01 P2 -:- S9-command-references failed (exit 1).

## Pre-existing or outside the scope

### skill:.skilled/skills/system-spec-kit

- [ ] C-002 P2 .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/rg-lane.mjs:88 `SPECKIT_RG_BIN` is an operator-settable ripgrep executable override: the code reads it and its error message tells callers to set it. Neither `.env.example` nor `ENV-REFERENCE.md` lists it. The token (pre-existing (critic))

### unowned

- [ ] C-001 P2 README.md:798 The root system-spec-kit summary mentions trigger-index changes but omits the new structured ripgrep behavior: one highest-ranked row per file, the default 20-file limit, `--limit 0`, and hidden-resul (reason unknown)
  fix: It owns the packet continuity writer, the generated trigger index and the ripgrep retrieval recipes. -> It owns the packet continuity writer, the generated trigger index and the ripgrep retrieval recipes. Structured ripgrep 

