---
title: "Fixture path assertions"
description: "Question 7: whether tests assert paths beside the 35 recorded fixtures, classified by assertion kind and verified against the cited lines."
---

# Fixture path assertions (Q7)

**Result:** one of the 35 recorded fixtures sits beside an assertion that compares a repo-relative `.opencode` literal: `.opencode/commands/create/assets/tests/test_emitted_name_contract.py:52` asserts that the create-command assets still contain the `.opencode/changelog/...` and `.opencode/skills/system-spec-kit/...` tokens its fixture lists. Phase 009 must rewrite that fixture in the same commit as those assets. No other assertion ties to the root name: 5 read their fixture through an absolute path, 3 assert only fragments, 2 compare `specs/...` literals, and 24 have no test reader.


All results here ran against worktree 055 at base `d26f0c60ca88dab922752ab3d9ce8a07463934ae`.

## Classification (unit U9)

| Kind | Count |
|------|-------|
| Repo-relative `.opencode` literal asserted | 1 |
| Repo-relative `specs/...` literal asserted, not `.opencode` | 2 |
| Absolute read, no path literal asserted | 5 |
| Fragment assertion | 3 |
| Unread by any test | 24 |

The lane's full table follows. Rows it marked unread for the twelve `memory-quality` fixtures were re-searched by the orchestrator (see Verification).

| `.opencode/bin/tests/fixtures/no-spec-import/negative/clean-runtime.cjs` | `.opencode/bin/compiled-routing-foundation.vitest.ts:285` (scanner reads it); CI also feeds it via `.github/workflows/runtime-no-spec-import.yml:42` | **absolute** — read via `join(HERE,'tests','fixtures',…)`; assertion is `expect(v).toEqual([])` (:286), no path literal compared; CI passes the dir as a repo-relative `.opencode/...` literal (:42) | `compiled-routing-foundation.vitest.ts:285-286`; `runtime-no-spec-import.yml:42` |
| `.opencode/commands/create/assets/tests/fixtures/emitted-name-contract.json` | `.opencode/commands/create/assets/tests/test_emitted_name_contract.py:21` (path), `:31` (read) | **repo-relative literal (`.opencode`)** — `assertIn(token, content)` at `:52` with tokens `.opencode/changelog/{…}` and `.opencode/skills/system-spec-kit/…` | `test_emitted_name_contract.py:31,48-52`; fixture `:62,:65,:87,:98` |
| `.opencode/commands/scripts/fixtures/broken-command-refs.yaml` | `.opencode/commands/scripts/validate-command-references.cjs:396` (self-test reader; dispatched at `:474`; no test suite reads it) | **absolute** — read via `path.join(__dirname,'fixtures',…)`; assertion is count-only (`brokenViol.length > 0`, `:399`; exit at `:468`); the fixture's own `.opencode/...` refs are scan inputs | `validate-command-references.cjs:395-400,468,474`; `broken-command-refs.yaml:17`; `commands/scripts/fixtures/README.md:86` |
| `.opencode/skills/sk-design/sk-design-diagram/scripts/tests/fixtures/design-md-sample.html` | `.opencode/skills/sk-design/sk-design-diagram/scripts/tests/corpus-mutations.test.cjs:133` (case table read via `:132`; file read at `:43-44`) | **fragment** — case `file:` is `scripts/tests/fixtures/design-md-sample.html`; assertions match `/provenance/` and `/textOnMark/`; the `.opencode/...` provenance path (fixture `:10`) is only a patch anchor, never asserted | `corpus-mutations.test.cjs:132-135,43,59-61`; `mutation-cases.cjs:45-52`; `design-md-sample.html:10` |
| `.opencode/skills/system-deep-loop/deep-improvement/test-fixtures/060-stress-test/.codex/agents/cp-improve-target.toml` | **no test file** — manual-playbook setup reads it: `.opencode/skills/system-deep-loop/deep-improvement/manual-testing-playbook/agent-discipline-stress-tests/setup-cp-sandbox.sh:102` (`require_path`), `:120` (`copy_file`) | **unread** (by tests); the script's `FIXTURE_ROOT` is a repo-relative `.opencode/skills/...` literal (`:9`), and its `require_path` check reads the `.toml` through it | `setup-cp-sandbox.sh:9,102,120`; fixture `:2` |
| `.opencode/skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-config.json` | **none** — the dir's only suite builds its own configs in `mkdtemp` (`.opencode/skills/system-deep-loop/deep-review/scripts/tests/reduce-state-summary-fallback.test.cjs:16,24-26`); fixture is manually exercised | **unread** (by tests); fixture records a `.opencode/...` `specFolder` (`:15`) that nothing asserts | `scripts/tests/README.md:21`; `reduce-state-summary-fallback.test.cjs:24-26`; `blocked-stop-session/README.md:25-26`; `deep-review-config.json:15` |
| `.opencode/skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-state.jsonl` | **none** — same suite builds dynamic state; manual reducer command only | **unread** (by tests); fixture records `.opencode/...` `specFolder` at `:1` unasserted | `scripts/tests/README.md:21`; `blocked-stop-session/README.md:25-26`; `deep-review-state.jsonl:1` |
| `.opencode/skills/system-deep-loop/runtime/tests/fixtures/council-value/seed-helpers.ts` | `.opencode/skills/system-deep-loop/runtime/tests/integration/council-graph-value-scenarios.vitest.ts:12` (import; dac-0xx fixtures import at their `:1`) | **fragment** — no assertion compares a path; the fixture probes `path.join(current, '.opencode')` for repo-root discovery (`:139`); consumer assertions compare answer payloads (`:40-43`) | `council-graph-value-scenarios.vitest.ts:12,40-43`; `seed-helpers.ts:139` |
| `.opencode/skills/system-skill-advisor/runtime/tests/fixtures/lifecycle/index.ts` | `.opencode/skills/system-skill-advisor/runtime/tests/lifecycle-derived-metadata.vitest.ts:38`; `.opencode/skills/system-skill-advisor/runtime/tests/scorer/native-scorer.vitest.ts:25` | **fragment** — `expect(…sourcePath).toContain('/z_archive/')` (`:442`) and an existence check via `join(dirname(import.meta.url),'fixtures',…)` (`:444`); fixture's `.opencode/...` literals (`:22,:27`) never compared; native-scorer asserts redirect values (`:139-141`) | `lifecycle/index.ts:22,27`; `lifecycle-derived-metadata.vitest.ts:441-444`; `native-scorer.vitest.ts:139-141` |
| `.opencode/skills/system-spec-kit/runtime/cli/retrieval/fixtures/corpus-manifest.json` | **no test** — suite generation paths point into a temp root (`.opencode/skills/system-spec-kit/runtime/cli/tests/trigger-index.vitest.ts:58`); production default read `generate-trigger-index.mjs:65,354` / `measure-cold-lookup.mjs:40,163` | **unread** (by tests); `/doctor speckit-retrieval` reads it by repo-relative `.opencode/...` literal | `trigger-index.vitest.ts:58`; `generate-trigger-index.mjs:65,354`; `commands/doctor/assets/doctor-speckit-retrieval.yaml:157` |
| `.opencode/skills/system-spec-kit/runtime/cli/retrieval/fixtures/daemon-off-proof.json` | **none** | **unread** — README: "have no runtime reader" | `retrieval/README.md:78` |
| `.opencode/skills/system-spec-kit/runtime/cli/retrieval/fixtures/generation-diagnostics.json` | **no test** — tests use `path.join(root,'out',…)` (`trigger-index.vitest.ts:53`); production default read `generate-trigger-index.mjs:66,355` | **unread** (by tests); `/doctor` reads it by `.opencode/...` literal | `trigger-index.vitest.ts:53`; `generate-trigger-index.mjs:66,355`; `doctor-speckit-retrieval.yaml:157,189` |
| `.opencode/skills/system-spec-kit/runtime/cli/retrieval/fixtures/latency-report.json` | **none** | **unread** — "no runtime reader"; script default *write* path only (`measure-cold-lookup.mjs:41,340`); doctor references it by `.opencode/...` literal but forbids writing it | `retrieval/README.md:78,88`; `measure-cold-lookup.mjs:41,340`; `doctor-speckit-retrieval.yaml:36,158` |
| `.opencode/skills/system-spec-kit/runtime/cli/retrieval/fixtures/phrase-variants.json` | **no test** — tests use `path.join(root,'out',…)` (`trigger-index.vitest.ts:60`); production default read `generate-trigger-index.mjs:67,356` | **unread** (by tests); `/doctor` compares manifestHash by `.opencode/...` literal | `trigger-index.vitest.ts:60`; `generate-trigger-index.mjs:67,356`; `doctor-speckit-retrieval.yaml:157` |
| `.opencode/skills/system-spec-kit/runtime/cli/retrieval/fixtures/recipe-execution.json` | **none** | **unread** — "have no runtime reader" | `retrieval/README.md:78` |
| `.opencode/skills/system-spec-kit/runtime/cli/retrieval/fixtures/residue-allowlist.json` | **no test** — suite writes temp allowlists (`.opencode/skills/system-spec-kit/runtime/cli/tests/sweep-memory-residue.vitest.ts:150,157`); production default read `sweep-memory-residue.mjs:52,437` | **unread** (by tests) | `sweep-memory-residue.mjs:52,437`; `sweep-memory-residue.vitest.ts:150-165` |
| `.opencode/skills/system-spec-kit/runtime/cli/retrieval/fixtures/semantic-probes.json` | **none** | **unread** — "no runtime reader"; its only in-repo mention is the `source` string it records for another fixture | `retrieval/README.md:78`; `semantic-probes.json:2233` |
| `.opencode/skills/system-spec-kit/runtime/cli/tests/fixtures/manual-playbook-fixture.js` | loaded via `.opencode/skills/system-spec-kit/runtime/cli/tests/manual-playbook-runner.ts:5` (import; used at `:1036`) when `.opencode/skills/system-spec-kit/runtime/cli/tests/manual-playbook-runner.vitest.ts:8-16` imports the runner | **repo-relative literal (`specs/…`, not `.opencode`)** — vitest compares substitution output `paths: ['specs/system-spec-kit/001-target/decision-record.md']` (`:79`); the fixture's own `.opencode/specs/...` `DEFAULT_REPORT_DIR` (`:15`) is not asserted | `manual-playbook-runner.vitest.ts:7,16,79`; `manual-playbook-runner.ts:5,1036`; `manual-playbook-fixture.js:15`; `cli/tests/fixtures/README.md:21` |
| `.opencode/skills/system-spec-kit/runtime/cli/tests/fixtures/manual-playbook-fixture.ts` | type-read at `.opencode/skills/system-spec-kit/runtime/cli/tests/manual-playbook-runner.vitest.ts:7`; documented as the source of the workspace builder | **repo-relative literal (`specs/…`, not `.opencode`)** — no assertion reads fixture data; nearest path assertion is the `specs/…` literal (`:79`); fixture's `.opencode/specs/...` default (`:48-51`) unasserted | `manual-playbook-runner.vitest.ts:7,79`; `manual-playbook-fixture.ts:48-51`; `cli/tests/fixtures/README.md:21` |
| `…/cli/tests/fixtures/memory-quality/F-AC1-truncation.json` | `.opencode/skills/system-spec-kit/runtime/cli/tests/memory-quality-phase2-pr3.test.ts:158` (read via `join(FIXTURE_DIR,name)`, `:16,:31`) | **absolute** — assertions compare importance tiers (`:168-169`); the fixture's `.opencode/...` file paths (`:6,:11`) and `<spec-folder>` placeholder (`:2`) are never path-asserted | `memory-quality-phase2-pr3.test.ts:158,165,168-169`; fixture `:2,:6,:11` |
| `…/memory-quality/F-AC3-happy-path.json` | **none found** | **unread** (no consumer found; see Gaps) | `cli/tests/fixtures/README.md:26`; only reads of that folder: `memory-quality-phase2-pr3.test.ts:158`, `memory-quality-phase3-pr6.vitest.ts:34,82`, `memory-quality-phase6-migration.test.ts:81-83` |
| `…/memory-quality/F-AC3-path-fragment.json` | **none found** | **unread** (no consumer found; see Gaps) | same as above |
| `…/memory-quality/F-AC3-standalone-stopwords.json` | **none found** | **unread** (no consumer found; see Gaps) | same as above |
| `…/memory-quality/F-AC3-suspicious-prefix.json` | **none found** | **unread** (no consumer found; see Gaps) | same as above |
| `…/memory-quality/F-AC3-synthetic-bigrams.json` | **none found** | **unread** (no consumer found; see Gaps) | same as above |
| `…/memory-quality/F-AC4-importance-tier.json` | **none found** | **unread** (no consumer found; see Gaps) | same as above |
| `…/memory-quality/F-AC6-provenance.json` | **none found** | **unread** (no consumer found; see Gaps) | same as above |
| `…/memory-quality/F-DUP-001-trigger-cluster.json` | **none found** | **unread** (no consumer found; see Gaps) | same as above |
| `…/memory-quality/F-DUP-002a-blank-observation-titles.json` | **none found** | **unread** (no consumer found; see Gaps) | same as above |
| `…/memory-quality/F-DUP-002b-proposition-overlap.json` | **none found** | **unread** (no consumer found; see Gaps) | same as above |
| `…/memory-quality/F-DUP-003-canonical-trigger.json` | **none found** | **unread** (no consumer found; see Gaps) | same as above |
| `…/memory-quality/F-DUP-004b-last-clipping.json` | **none found** | **unread** (no consumer found; see Gaps) | same as above |
| `.opencode/skills/system-spec-kit/runtime/tests/description/fixtures/017-002-cluster-consumers.description.json` | `.opencode/skills/system-spec-kit/runtime/tests/description/repair-specimens.vitest.ts:18` (name), `:22-23` (read), used `:211-217` | **absolute** — read via `new URL('./fixtures/…', import.meta.url)`; assertions compare payload/saved fields (`:245-248`); the fixture's `.opencode/...` validator string (`:69`) is never asserted | `repair-specimens.vitest.ts:18,22-23,211-217,245-248`; fixture `:69`; `tests/description/fixtures/README.md:48` |
| `.opencode/skills/system-spec-kit/runtime/tests/fixtures/golden-queries.json` | **none** — only occurrence in the tree is a `source` field inside another fixture | **unread** | `semantic-probes.json:2233`; `runtime/tests/fixtures/README.md:21-24` |
| `.opencode/skills/system-spec-kit/runtime/tests/fixtures/hooks/session-stop-replay.jsonl` | `.opencode/skills/system-spec-kit/runtime/tests/hook-session-stop-replay.vitest.ts:18`, `:119` (read/copied at `:153`) | **absolute** — read via `fileURLToPath(new URL(…))`; nearest path assertions: `touchedPaths[0].startsWith(sandbox.sandboxRoot)` (`:37`, absolute) and `lastSpecFolder` literal `'specs/system-spec-kit/026-…'` (`:51-53`, repo-relative but not `.opencode`) | `hook-session-stop-replay.vitest.ts:18,37,51-53,119,153` |

## Implications

- Shape A: tests that read through absolute paths or fragments survive the rename. The emitted-name contract test fails as soon as phase 009 rewrites the assets unless its fixture changes in the same commit, and the trigger-index fixtures that `/doctor speckit-retrieval` reads by an `.opencode` literal need that literal to keep resolving, which the link does.
- Shape B: same as shape A, because every `.opencode/<entry>` a fixture names is a per-entry link into `.skilled/`.
- Shape C: the `/doctor` literals into `.opencode/skills/system-spec-kit/runtime/cli/retrieval/fixtures/` and the setup script's `.opencode/skills/...` fixture root stop resolving unless phase 009 rewrites them first.

## Verification

- **Brief:** `/tmp/skilled-probes-003/briefs/u9-fixture-assertions.md`, the child preamble, the read-only persona and four literal lines with the 35 paths extracted from map C by `awk -F'\t' 'NR > 1 && $12 ~ /recorded-fixture/ {print $3}'`.
- **Dispatch:** as in `council-graph-rebuild.md`, from worktree 055. Exit 0, 18:55:01Z to 19:02:23Z, 13,713 bytes. Stderr held only the skill-advisor hook's fail-open line.

| Returned citation | Status |
|-------------------|--------|
| `test_emitted_name_contract.py:21`, `:31`, `:48-52` and fixture `emitted-name-contract.json:62`, `:65`, `:87`, `:98` | matched |
| `compiled-routing-foundation.vitest.ts:285-286` | matched |
| `manual-playbook-runner.vitest.ts:79` | matched |
| `hook-session-stop-replay.vitest.ts:37`, `:51-53` | matched |
| `retrieval/README.md:78` | matched |
| `generate-trigger-index.mjs:65-67` | matched |
| Twelve `memory-quality` fixtures marked unread | confirmed: `git grep` finds no reference to their basenames outside `specs/` and the fixture directory, and the three suites that open `fixtures/memory-quality` build names from `FIXTURE_DIR` (`memory-quality-phase2-pr3.test.ts:16`, `memory-quality-phase3-pr6.vitest.ts:10`, `memory-quality-phase6-migration.test.ts:16`) without listing the directory |

## Briefs and citation checks

Each brief is reproduced verbatim. The citation check resolves every `path:line` a lane returned to a file, using the lane's own abbreviations (`$PI/`, `BUNDLE/`, `CURSORSKILLS/` = `~/.cursor/skills-cursor/`, `help:`, `str:`, `dump:`, `cap/`), and confirms the cited lines exist. A bare basename that matches several tracked files counts as matched only when every candidate holds the line. "Matched" means the line exists. Content was opened only for the citations the verification tables above name. "Struck" means the file did not resolve or the line runs past the end of the file.

### u9-fixture-assertions

**Brief:**

```text
GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and `SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is empty. This is a read-only task: your final message is the whole deliverable.

PERSONA (this repository's read-only `context` agent, condensed): you retrieve and verify, nothing else. You never write, edit, create, delete, stage or commit a file, and you never hand work to another agent. Every claim you make comes from a file you opened with your read, grep, find or ls tools, cites `path:line`, and anything you could not settle goes under a final "Gaps" heading as UNKNOWN.

Question: for each fixture file below, which test files read it, and does the assertion beside that read compare a repo-relative `.opencode` path literal, an absolute path, or only a path fragment?
Read these fixture paths, then search the repository's test files for each fixture's basename and read the matching assertions: .opencode/bin/tests/fixtures/no-spec-import/negative/clean-runtime.cjs; .opencode/commands/create/assets/tests/fixtures/emitted-name-contract.json; .opencode/commands/scripts/fixtures/broken-command-refs.yaml; .opencode/skills/sk-design/sk-design-diagram/scripts/tests/fixtures/design-md-sample.html; .opencode/skills/system-deep-loop/deep-improvement/test-fixtures/060-stress-test/.codex/agents/cp-improve-target.toml; .opencode/skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-config.json; .opencode/skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-state.jsonl; .opencode/skills/system-deep-loop/runtime/tests/fixtures/council-value/seed-helpers.ts; .opencode/skills/system-skill-advisor/runtime/tests/fixtures/lifecycle/index.ts; .opencode/skills/system-spec-kit/runtime/cli/retrieval/fixtures/corpus-manifest.json; .opencode/skills/system-spec-kit/runtime/cli/retrieval/fixtures/daemon-off-proof.json; .opencode/skills/system-spec-kit/runtime/cli/retrieval/fixtures/generation-diagnostics.json; .opencode/skills/system-spec-kit/runtime/cli/retrieval/fixtures/latency-report.json; .opencode/skills/system-spec-kit/runtime/cli/retrieval/fixtures/phrase-variants.json; .opencode/skills/system-spec-kit/runtime/cli/retrieval/fixtures/recipe-execution.json; .opencode/skills/system-spec-kit/runtime/cli/retrieval/fixtures/residue-allowlist.json; .opencode/skills/system-spec-kit/runtime/cli/retrieval/fixtures/semantic-probes.json; .opencode/skills/system-spec-kit/runtime/cli/tests/fixtures/manual-playbook-fixture.js; .opencode/skills/system-spec-kit/runtime/cli/tests/fixtures/manual-playbook-fixture.ts; .opencode/skills/system-spec-kit/runtime/cli/tests/fixtures/memory-quality/F-AC1-truncation.json; .opencode/skills/system-spec-kit/runtime/cli/tests/fixtures/memory-quality/F-AC3-happy-path.json; .opencode/skills/system-spec-kit/runtime/cli/tests/fixtures/memory-quality/F-AC3-path-fragment.json; .opencode/skills/system-spec-kit/runtime/cli/tests/fixtures/memory-quality/F-AC3-standalone-stopwords.json; .opencode/skills/system-spec-kit/runtime/cli/tests/fixtures/memory-quality/F-AC3-suspicious-prefix.json; .opencode/skills/system-spec-kit/runtime/cli/tests/fixtures/memory-quality/F-AC3-synthetic-bigrams.json; .opencode/skills/system-spec-kit/runtime/cli/tests/fixtures/memory-quality/F-AC4-importance-tier.json; .opencode/skills/system-spec-kit/runtime/cli/tests/fixtures/memory-quality/F-AC6-provenance.json; .opencode/skills/system-spec-kit/runtime/cli/tests/fixtures/memory-quality/F-DUP-001-trigger-cluster.json; .opencode/skills/system-spec-kit/runtime/cli/tests/fixtures/memory-quality/F-DUP-002a-blank-observation-titles.json; .opencode/skills/system-spec-kit/runtime/cli/tests/fixtures/memory-quality/F-DUP-002b-proposition-overlap.json; .opencode/skills/system-spec-kit/runtime/cli/tests/fixtures/memory-quality/F-DUP-003-canonical-trigger.json; .opencode/skills/system-spec-kit/runtime/cli/tests/fixtures/memory-quality/F-DUP-004b-last-clipping.json; .opencode/skills/system-spec-kit/runtime/tests/description/fixtures/017-002-cluster-consumers.description.json; .opencode/skills/system-spec-kit/runtime/tests/fixtures/golden-queries.json; .opencode/skills/system-spec-kit/runtime/tests/fixtures/hooks/session-stop-replay.jsonl.
Answer with one markdown table whose columns are: Fixture | Reading test (path:line) | Assertion kind (repo-relative literal, absolute, fragment, or unread) | Evidence (path:line).
Cite path:line for every cell and write UNKNOWN when no line settles it.
```

**Dispatch:** `PI_CODING_AGENT_DIR=/tmp/skilled-probes-003/pi-agent AI_SESSION_CHILD=1 SYSTEM_SPEC_GATE_ENFORCE=0 pi -p --offline --provider llmgateway --model llmgateway/deepseek-v4.1-flash --thinking max --tools read,grep,find,ls --no-session "<brief>" </dev/null`, run from worktree 055. (U8 to U10 ran before the developer-role rejection began, without `PI_CODING_AGENT_DIR`.)

**Citation check:** 69 matched, 1 struck.

| Citation | Status | Resolved to |
|----------|--------|-------------|
| `.opencode/bin/compiled-routing-foundation.vitest.ts:285` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/bin/compiled-routing-foundation.vitest.ts (288 lines) |
| `.github/workflows/runtime-no-spec-import.yml:42` | matched | ~/worktrees/public/055-skilled-source-root-migration/.github/workflows/runtime-no-spec-import.yml (42 lines) |
| `compiled-routing-foundation.vitest.ts:285-286` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/bin/compiled-routing-foundation.vitest.ts (288 lines) |
| `runtime-no-spec-import.yml:42` | matched | ~/worktrees/public/055-skilled-source-root-migration/.github/workflows/runtime-no-spec-import.yml (42 lines) |
| `.opencode/commands/create/assets/tests/test_emitted_name_contract.py:21` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/commands/create/assets/tests/test_emitted_name_contract.py (91 lines) |
| `test_emitted_name_contract.py:31,48-52` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/commands/create/assets/tests/test_emitted_name_contract.py (91 lines) |
| `.opencode/commands/scripts/validate-command-references.cjs:396` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/commands/scripts/validate-command-references.cjs (492 lines) |
| `validate-command-references.cjs:395-400,468,474` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/commands/scripts/validate-command-references.cjs (492 lines) |
| `broken-command-refs.yaml:17` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/commands/scripts/fixtures/broken-command-refs.yaml (26 lines) |
| `commands/scripts/fixtures/README.md:86` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/commands/scripts/fixtures/README.md (101 lines) |
| `.opencode/skills/sk-design/sk-design-diagram/scripts/tests/corpus-mutations.test.cjs:133` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/sk-design/sk-design-diagram/scripts/tests/corpus-mutations.test.cjs (179 lines) |
| `corpus-mutations.test.cjs:132-135,43,59-61` | matched | ambiguous: 2 files, line in range in 2 |
| `mutation-cases.cjs:45-52` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/sk-design/sk-design-diagram/scripts/tests/mutation-cases.cjs (98 lines) |
| `design-md-sample.html:10` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/sk-design/sk-design-diagram/scripts/tests/fixtures/design-md-sample.html (23 lines) |
| `.opencode/skills/system-deep-loop/deep-improvement/manual-testing-playbook/agent-discipline-stress-tests/setup-cp-sandbox.sh:102` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-deep-loop/deep-improvement/manual-testing-playbook/agent-discipline-stress-tests/setup-cp-sandbox.sh (123 lines) |
| `setup-cp-sandbox.sh:9,102,120` | struck | ambiguous: 3 files, line in range in 2 |
| `.opencode/skills/system-deep-loop/deep-review/scripts/tests/reduce-state-summary-fallback.test.cjs:16,24-26` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-deep-loop/deep-review/scripts/tests/reduce-state-summary-fallback.test.cjs (286 lines) |
| `scripts/tests/README.md:21` | matched | ambiguous: 5 files, line in range in 5 |
| `reduce-state-summary-fallback.test.cjs:24-26` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-deep-loop/deep-review/scripts/tests/reduce-state-summary-fallback.test.cjs (286 lines) |
| `blocked-stop-session/README.md:25-26` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/README.md (27 lines) |
| `deep-review-config.json:15` | matched | ambiguous: 2 files, line in range in 2 |
| `deep-review-state.jsonl:1` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-state.jsonl (5 lines) |
| `.opencode/skills/system-deep-loop/runtime/tests/integration/council-graph-value-scenarios.vitest.ts:12` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-deep-loop/runtime/tests/integration/council-graph-value-scenarios.vitest.ts (54 lines) |
| `council-graph-value-scenarios.vitest.ts:12,40-43` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-deep-loop/runtime/tests/integration/council-graph-value-scenarios.vitest.ts (54 lines) |
| `seed-helpers.ts:139` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-deep-loop/runtime/tests/fixtures/council-value/seed-helpers.ts (419 lines) |
| `.opencode/skills/system-skill-advisor/runtime/tests/lifecycle-derived-metadata.vitest.ts:38` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-skill-advisor/runtime/tests/lifecycle-derived-metadata.vitest.ts (446 lines) |
| `.opencode/skills/system-skill-advisor/runtime/tests/scorer/native-scorer.vitest.ts:25` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-skill-advisor/runtime/tests/scorer/native-scorer.vitest.ts (510 lines) |
| `lifecycle/index.ts:22,27` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-skill-advisor/runtime/tests/fixtures/lifecycle/index.ts (40 lines) |
| `lifecycle-derived-metadata.vitest.ts:441-444` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-skill-advisor/runtime/tests/lifecycle-derived-metadata.vitest.ts (446 lines) |
| `native-scorer.vitest.ts:139-141` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-skill-advisor/runtime/tests/scorer/native-scorer.vitest.ts (510 lines) |
| `.opencode/skills/system-spec-kit/runtime/cli/tests/trigger-index.vitest.ts:58` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-spec-kit/runtime/cli/tests/trigger-index.vitest.ts (722 lines) |
| `generate-trigger-index.mjs:65,354` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs (549 lines) |
| `measure-cold-lookup.mjs:40,163` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-spec-kit/runtime/cli/retrieval/measure-cold-lookup.mjs (355 lines) |
| `trigger-index.vitest.ts:58` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-spec-kit/runtime/cli/tests/trigger-index.vitest.ts (722 lines) |
| `commands/doctor/assets/doctor-speckit-retrieval.yaml:157` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/commands/doctor/assets/doctor-speckit-retrieval.yaml (260 lines) |
| `retrieval/README.md:78` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-spec-kit/runtime/cli/retrieval/README.md (153 lines) |
| `trigger-index.vitest.ts:53` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-spec-kit/runtime/cli/tests/trigger-index.vitest.ts (722 lines) |
| `generate-trigger-index.mjs:66,355` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs (549 lines) |
| `doctor-speckit-retrieval.yaml:157,189` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/commands/doctor/assets/doctor-speckit-retrieval.yaml (260 lines) |
| `measure-cold-lookup.mjs:41,340` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-spec-kit/runtime/cli/retrieval/measure-cold-lookup.mjs (355 lines) |
| `retrieval/README.md:78,88` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-spec-kit/runtime/cli/retrieval/README.md (153 lines) |
| `doctor-speckit-retrieval.yaml:36,158` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/commands/doctor/assets/doctor-speckit-retrieval.yaml (260 lines) |
| `trigger-index.vitest.ts:60` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-spec-kit/runtime/cli/tests/trigger-index.vitest.ts (722 lines) |
| `generate-trigger-index.mjs:67,356` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs (549 lines) |
| `doctor-speckit-retrieval.yaml:157` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/commands/doctor/assets/doctor-speckit-retrieval.yaml (260 lines) |
| `.opencode/skills/system-spec-kit/runtime/cli/tests/sweep-memory-residue.vitest.ts:150,157` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-spec-kit/runtime/cli/tests/sweep-memory-residue.vitest.ts (251 lines) |
| `sweep-memory-residue.mjs:52,437` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-spec-kit/runtime/cli/retrieval/sweep-memory-residue.mjs (613 lines) |
| `sweep-memory-residue.vitest.ts:150-165` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-spec-kit/runtime/cli/tests/sweep-memory-residue.vitest.ts (251 lines) |
| `semantic-probes.json:2233` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-spec-kit/runtime/cli/retrieval/fixtures/semantic-probes.json (2236 lines) |
| `.opencode/skills/system-spec-kit/runtime/cli/tests/manual-playbook-runner.ts:5` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-spec-kit/runtime/cli/tests/manual-playbook-runner.ts (1074 lines) |
| `.opencode/skills/system-spec-kit/runtime/cli/tests/manual-playbook-runner.vitest.ts:8-16` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-spec-kit/runtime/cli/tests/manual-playbook-runner.vitest.ts (319 lines) |
| `manual-playbook-runner.vitest.ts:7,16,79` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-spec-kit/runtime/cli/tests/manual-playbook-runner.vitest.ts (319 lines) |
| `manual-playbook-runner.ts:5,1036` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-spec-kit/runtime/cli/tests/manual-playbook-runner.ts (1074 lines) |
| `manual-playbook-fixture.js:15` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-spec-kit/runtime/cli/tests/fixtures/manual-playbook-fixture.js (607 lines) |
| `cli/tests/fixtures/README.md:21` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-spec-kit/runtime/cli/tests/fixtures/README.md (42 lines) |
| `.opencode/skills/system-spec-kit/runtime/cli/tests/manual-playbook-runner.vitest.ts:7` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-spec-kit/runtime/cli/tests/manual-playbook-runner.vitest.ts (319 lines) |
| `manual-playbook-runner.vitest.ts:7,79` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-spec-kit/runtime/cli/tests/manual-playbook-runner.vitest.ts (319 lines) |
| `manual-playbook-fixture.ts:48-51` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-spec-kit/runtime/cli/tests/fixtures/manual-playbook-fixture.ts (851 lines) |
| `.opencode/skills/system-spec-kit/runtime/cli/tests/memory-quality-phase2-pr3.test.ts:158` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-spec-kit/runtime/cli/tests/memory-quality-phase2-pr3.test.ts (171 lines) |
| `memory-quality-phase2-pr3.test.ts:158,165,168-169` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-spec-kit/runtime/cli/tests/memory-quality-phase2-pr3.test.ts (171 lines) |
| `cli/tests/fixtures/README.md:26` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-spec-kit/runtime/cli/tests/fixtures/README.md (42 lines) |
| `memory-quality-phase2-pr3.test.ts:158` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-spec-kit/runtime/cli/tests/memory-quality-phase2-pr3.test.ts (171 lines) |
| `memory-quality-phase3-pr6.vitest.ts:34,82` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-spec-kit/runtime/cli/tests/memory-quality-phase3-pr6.vitest.ts (122 lines) |
| `memory-quality-phase6-migration.test.ts:81-83` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-spec-kit/runtime/cli/tests/memory-quality-phase6-migration.test.ts (160 lines) |
| `.opencode/skills/system-spec-kit/runtime/tests/description/repair-specimens.vitest.ts:18` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-spec-kit/runtime/tests/description/repair-specimens.vitest.ts (314 lines) |
| `repair-specimens.vitest.ts:18,22-23,211-217,245-248` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-spec-kit/runtime/tests/description/repair-specimens.vitest.ts (314 lines) |
| `tests/description/fixtures/README.md:48` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-spec-kit/runtime/tests/description/fixtures/README.md (69 lines) |
| `runtime/tests/fixtures/README.md:21-24` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-deep-loop/runtime/tests/fixtures/README.md (74 lines) |
| `.opencode/skills/system-spec-kit/runtime/tests/hook-session-stop-replay.vitest.ts:18` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-spec-kit/runtime/tests/hook-session-stop-replay.vitest.ts (226 lines) |
| `hook-session-stop-replay.vitest.ts:18,37,51-53,119,153` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-spec-kit/runtime/tests/hook-session-stop-replay.vitest.ts (226 lines) |
