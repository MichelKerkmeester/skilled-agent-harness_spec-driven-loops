---
title: "Goal: Fix Phase: Trigger Index Rebuild, Freshness and Build Isolation"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/010-trigger-index-search-fixes"
    last_updated_at: "2026-09-27T12:30:00Z"
    last_updated_by: "authoring-leaf"
    recent_action: "Authored the durable directive from this phase's spec and acceptance criteria"
    next_safe_action: "Run T001 to reproduce the refused rebuild"
    blockers: []
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/010-trigger-index-search-fixes/spec.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/010-trigger-index-search-fixes/acceptance-criteria.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-workflow-integration"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Which score-0 miss shape does the system-spec-kit owner want (spec.md section 10)"
    answered_questions: []
---
# Goal: Fix Phase: Trigger Index Rebuild, Freshness and Build Isolation

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything between the frontmatter and the log is the DURABLE SLICE: it is
> what an operator sets as the session objective, and it must stay true for the
> life of the packet. The frontmatter above it is bookkeeping and never leaves
> this file: it is not sent in chat, not injected, not stored in an objective.
> Keep the slice short. A phase parent or top-level packet has one limit, 4000
> characters, measured from the frontmatter's closing fence to the log anchor.
> Up to 4000 passes and past it fails; the runtime goal surfaces cap what they
> hold, and a truncated objective loses its tail, which is where the criteria
> live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make `system-spec-kit`'s trigger-index rebuild publish again past this packet's two vendored model cards, rebuild the stale committed index, extend the save-time staleness check to the whole index and keep builds aimed elsewhere off every tracked file, while the score-0 miss shape waits on its owner.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Exempt only `MODEL_CARD_08B.md` and `MODEL_CARD_9B.md`, by exact path in `IGNORED_PATHS`. No directory rule, no reader change and no edit to the vendored cards |
| D2 | When `--out` names a path other than the default index, unset sidecar paths default beside `--out`. The no-flag rebuild keeps its tracked paths |
| D3 | Staleness has one definition, the per-document comparison `checkTriggerIndexFreshness` already runs at save time, moved into a shared helper that the save and `--check` both call. The lookup warns per call only if the measured cold-lookup p95 plus the path-only corpus-walk p95 is at most 200 ms. Otherwise `--check` runs as a report-only CI step. A per-lookup verdict stops the build until `spec.md` is amended |
| D4 | The lookup's score-0 rows and its exit status stay as they are until the `system-spec-kit` owner says yes to a change |
| D5 | The index is rebuilt from a `git archive` of HEAD in its own commit after the code commit. A merge conflict on the index or its three fixtures is resolved by regenerating, never by hand |

### Operator copy

The operator holds this directive as the session objective, and that copy is
what judges completion, not this file. Whenever anything above the log changes
(objective, a decision, the binding table, a criterion), resend this file's
chat slice so the operator can update their copy. The chat slice is the
durable slice without its frontmatter, HTML comments, anchor markers, `---`
dividers or heading section numbers, and `goal.cjs packet` prints it as
`chat_slice`. Never send more than 4000 characters: cut this file first. Keep
reminding while the copy stays unset, and never stop work for it. A child goal
change that alters a parent decision or criterion is an amendment to the
parent: apply it there first, then resend the parent.
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Three to seven bullets, each checkable without opening another file. Copy them
verbatim into the objective: nothing dereferences a path, so criteria left only
here are invisible to whatever judges completion.

- [ ] `generate-trigger-index.mjs` with all four outputs in a scratch directory exits 0 and prints `ignored malformed : 2`, where before the fix it exits 1 with `refused: 2 document(s)`
- [ ] `lookup-trigger-index.mjs --no-index-hash -- "deem local server"` prints `1.000  exact` on `007-classifier-deep-research/context/deem-local.md` against the committed index
- [ ] `generate-trigger-index.mjs --check --repo-root` over a `git archive` of the final HEAD exits 0, and `generate-trigger-index.mjs --check --bogus` exits 2
- [ ] After `generate-trigger-index.mjs --out` a scratch path with no other output flag, `git status --short .skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures .skilled/skills/system-spec-kit/runtime/data` prints nothing and the scratch directory holds `corpus-manifest.json`, `generation-diagnostics.json` and `phrase-variants.json`
- [ ] `implementation-summary.md` records the cold-lookup p95, the path-only walk p95 and the placement verdict that follows from the 200 ms rule
- [ ] `lookup-trigger-index.mjs --json -- "cli-classifier hub"` still returns 20 rows at score 0 with exit 0, unless this goal's log records the owner's yes to a change
- [ ] `trigger-index.vitest.ts` runs at least 53 tests with 0 failing, `workflow-trigger-index-freshness.vitest.ts` passes 7 of 7 with the save calling the shared helper, and `validate.sh --strict` on this phase prints `RESULT: PASSED`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Planning documents | Done | `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, `implementation-summary.md` and this goal authored on 2026-09-27 |
| Refusal reproduced | Done | Scratch-path build on 2026-09-27: exit 1, `refused: 2 document(s)`, 22,968 documents scanned, 20.6 s. Both rows `non-yaml-frontmatter` at line 1 on the two model cards. `git status --short` on the owner's `runtime/` was empty afterward |
| Staleness counted | Done | Scratch build with `--allow-malformed`: 124 paths missing from the committed index (99 in this packet, 17 in `system-skill-advisor/030`, 7 in `sk-doc/060`, 1 in `.skilled/skills/cli-jev`), 0 obsolete |
| Lookups reproduced | Done | "deem local server": committed index only score-0 `partial` rows, scratch index `1.000  exact` on `deem-local.md`. "cli-classifier hub": 20 rows, all `partial` at 0, `truncated: true`, exit 0 |
| Suite baseline | Done | `trigger-index.vitest.ts`: 49 passed, exit 0. `workflow-trigger-index-freshness.vitest.ts`: 7 passed, exit 0 |
| Build | Pending | Nothing is built |

### Deviations and findings

| Item | Note |
|------|------|
| Counts moved since the brief | The brief measured 22,920 documents and 76 missing. The recount found 22,968 and 124. The 48 extra are the new 010 to 017 scaffolds, which are untracked files in the worktree |
| Root cause is the reader | The cards hold valid YAML with list items at column 0. `lib/frontmatter.mjs:161` accepts a continuation line only when it is indented, and `trigger-index.vitest.ts:250` pins only the one-space form. The brief asked for the narrowest exclusion, so the reader change is an open owner question in `spec.md` section 10 |
| More tracked defaults than the brief named | Besides `phrase-variants.json`, an `--out`-only build also writes `corpus-manifest.json`, and it writes `generation-diagnostics.json` even when it refuses (`generate-trigger-index.mjs:353-356`, `:369`). REQ-004 covers all three. `measure-cold-lookup.mjs` writes the tracked `latency-report.json` by default (`:41`, `:340-341`) and stays out of scope, so the plan always passes `--out` |
| Existing partial staleness signal | `/doctor speckit-retrieval` flags a committed-pair hash mismatch and indexed files newer than the index (`doctor-speckit-retrieval.yaml:119`, `:185`). It stats only paths already in the index, so it cannot see an added document, which is the gap here |
| Collision with main | Main holds six `rebuild the trigger index from committed content` commits from 2026-09-27 (`44dcdc2f82` to `eaa02a56f5`) that this branch lacks, all on the same four artifacts. No main-only commit touches the retrieval code or its test. The owner's retrieval code last changed on this branch in `954ed7fde8` (2026-09-26, regenerate the index) |
| Placement is likely CI | Three in-process path-only `walkCorpus` runs took 1,853, 2,376 and 1,575 ms on 2026-09-27, against a 200 ms lookup budget. This is indicative only. T011 takes the measurement D3 decides on |
| Correction: a staleness signal exists | Source: the coordinator's message during authoring, 2026-09-27. The brief and the first draft said nothing signals staleness. At save time `generate-context.js` compares the saved packet's `spec.md` trigger phrases with the committed index and warns `Trigger index: STALE for spec.md` with added and removed phrases (`runtime/cli/core/workflow.ts:1977-1995`, comparison at `:346-391`, reread and confirmed). The coordinator reports it fired on this packet's save at 2026-09-27T12:20Z, which I did not observe. The gap is narrower: the lookup never warns, and the save check covers only the saved packet's `spec.md`. REQ-003, D3, PD-3, PD-4 and PD-7 now build `--check` on that comparison instead of a second definition |
<!-- /ANCHOR:log -->
