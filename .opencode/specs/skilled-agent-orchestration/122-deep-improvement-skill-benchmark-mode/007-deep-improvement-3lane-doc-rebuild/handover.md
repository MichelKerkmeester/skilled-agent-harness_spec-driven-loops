# Handover — Deep-Improvement 3-Lane Doc Rebuild (packet 122 / child 007)

> **Resume entry point.** Read this top-to-bottom; everything needed to execute
> is here. Created at the end of a context-exhausted planning session AFTER the
> operator approved the plan. No code/doc files have been mutated yet — only this
> spec folder (`spec.md` + this file) was created. Recommend `/clear` then resume.

---

## 0. OPERATOR-LOCKED DECISIONS (authoritative — these override any older plan prose)

The operator answered four AskUserQuestion choices. These WIN over the plan file
at `~/.claude/plans/analyze-users-michelkerkmeester-mega-dev-dapper-cerf.md`,
whose prose contradicted two of them (it said "125" + "full rewrite").

1. **Architecture = lane-grouped, MIRROR both docs.** Renumber categories AND
   scenario IDs into one consistent taxonomy used by BOTH trees; rewrite all
   cross-refs/paths. High churn, accepted.
2. **Content depth = Lane C fresh + fix ONLY known-stale in A/B.** Do NOT rewrite
   every A/B entry body. A/B entries DO get moved (git mv) into the new dirs and
   their SOURCE METADATA path + cross-refs updated (structural), and their
   confirmed-stale lines fixed — but not a full prose re-verification.
3. **Engine = GPT-5.5 via cli-opencode drafts; Opus verifies every file vs
   source before ship.** This is the explicit guard against the false-content
   over-claiming pattern from this session. NO file ships unverified.
4. **Gate-3 home = packet 122, this child `007-deep-improvement-3lane-doc-rebuild`.**
   NOT a new packet 125. Packet 122 is a PHASE PARENT; its existing children are
   `001-skill-benchmark-deep-research`, `002-implementation-deep-research`,
   `003-skill-rename-deep-improvement`, `004-skill-benchmark-mode`,
   `005-validation-and-docs`, `006-deep-review` (all prior/closed work — do not
   pollute them). `007` is the correct next free child slot.

---

## 1. DISPATCH CONTRACT (verified live this session)

- cli-opencode CAN target GPT-5.5: `openai/gpt-5.5` is in `opencode models`, and
  the `openai` provider is configured (preflight passed).
- CLI dispatch rule satisfied: `cli-opencode/SKILL.md` was read in full.
- Command shape (read-only drafting; capture stdout; I write the files):
  ```bash
  opencode run --model openai/gpt-5.5 --variant high --agent general \
    --format json --dir <repo-root> "<PROMPT>" </dev/null
  ```
  - `</dev/null` is MANDATORY (stdin-EOF hang bug; cli-opencode ALWAYS rule 5).
  - `--variant high` = the "high" reasoning the operator asked for. (There is no
    separate `--fast` flag; `openai/gpt-5.5-fast` is a distinct model id if speed
    is wanted, but `openai/gpt-5.5 --variant high` is the high-reasoning path.)
  - Single-dispatch discipline: ONE dispatch at a time; wait for return; verify
    output; `pkill -9 -f "opencode run"` between dispatches; never auto-kill
    operator-owned interactive opencode sessions.
- Memory note caveat: a saved memory says "codex CLI unreliable; prefer Opus
  subagents" — that was about cli-CODEX hanging on a multi-file RENAME. This task
  uses cli-OPENCODE for stdout-only DRAFTING (no file mutation by the model), and
  the operator explicitly requested GPT-5.5-via-cli-opencode, so it applies here.
  Still: verify every draft; if cli-opencode misbehaves, fall back to authoring
  directly in the main loop (the operator cares about the result, not the engine).

---

## 2. AUTHORITATIVE STRUCTURE CONTRACT (sk-doc)

Templates (canonical): `.opencode/skills/sk-doc/assets/skill/`
References (deeper rules): `.opencode/skills/sk-doc/references/feature_catalog_creation.md`
and `.../references/manual_testing_playbook_creation.md`.
Snippet/landing templates also exist under
`.opencode/skills/sk-doc/assets/{feature_catalog,testing_playbook}/`.

**Validator (run before delivery, exit 0 required):**
```bash
python .opencode/skills/sk-doc/scripts/validate_document.py \
  .opencode/skills/deep-improvement/feature_catalog/feature_catalog.md --type reference
python .opencode/skills/sk-doc/scripts/validate_document.py \
  .opencode/skills/deep-improvement/manual_testing_playbook/manual_testing_playbook.md --type playbook
```
- H2 section headers MUST be ALL CAPS (e.g. `## 1. OVERVIEW`) — blocking if not.
- Playbook landing required sections: OVERVIEW, GLOBAL PRECONDITIONS, GLOBAL
  EVIDENCE REQUIREMENTS, DETERMINISTIC COMMAND NOTATION, REVIEW PROTOCOL, then
  numbered per-category H2s.
- **NO per-category index files** — confirmed convention (deep-loop-runtime: 9
  cats, 0 index files). Landings link to category dirs; dirs hold entry files.

**Catalog entry file** (existing deep-improvement convention, keep it):
frontmatter `title` + `description`; sections `## 1. OVERVIEW`,
`## 2. CURRENT REALITY`, `## 3. SOURCE FILES` (### Implementation table +
### Validation And Tests table), `## 4. SOURCE METADATA` (Group / Canonical
catalog source / Feature file path). Dirs `NN--category`, files `NN-name.md`.

**Playbook scenario file** (existing convention): frontmatter `title`,
`description`, `feature_id`, `category`; sections `## 1. OVERVIEW`,
`## 2. SCENARIO CONTRACT`, `## 3. TEST EXECUTION` (Recommended Orchestration
Process + 9-column table: Feature ID | Feature Name | Scenario | Exact Prompt |
Exact Command Sequence | Expected Signals | Evidence | Pass/Fail | Failure
Triage), `## 4. SOURCE FILES` (Playbook Sources + Implementation/Test Anchors),
`## 5. SOURCE METADATA`. Dirs `NN--category`, files `NNN-name.md`.
Exemplars to mirror: `feature_catalog/04--model-benchmark-mode/01-mode-switch.md`
and `manual_testing_playbook/09--model-benchmark-mode/035-mode-switch-routing.md`.

**Best whole-tree exemplar of a clean multi-mode layout:** `deep-loop-runtime`
(`.opencode/skills/deep-loop-runtime/feature_catalog/` — 9 categories, coverage
table in OVERVIEW, 1:1 catalog↔playbook mapping).

---

## 3. TARGET TAXONOMY (mirror both trees — identical category dir set)

| # | Category dir | Lane | Surface |
|---|---|---|---|
| 01 | `01--agent-improvement-loop` | A | init, candidate-gen, scoring dispatch, promotion gates, rollback, plateau |
| 02 | `02--agent-improvement-integration` | A | surface discovery, runtime mirrors, command dispatch, profile gen, trade-off, stability |
| 03 | `03--agent-discipline` | A | proposal-only boundary, critic overfit, legal-stop bundles |
| 04 | `04--model-benchmark` | B | mode switch, model dispatcher, opt-in 5dim scorer, mode records + hardening gates |
| 05 | `05--skill-benchmark` | C | **NEW** — mode wiring, hint-free fixtures + contamination gate, router-replay + advisor probe (Mode A), D5 connectivity hard gate, D1-D5 scoring + funnel, dual report + remediation taxonomy |
| 06 | `06--shared-scoring` | Shared | 5-dim rubric, dynamic profiling, deterministic scoring, dimensional progress |
| 07 | `07--shared-runtime` | Shared | reducer/dashboard, stop-reason taxonomy, journal, resume, legal-stop gates, mutation-coverage, lineage, replay |

Catalog has feature entries; playbook has scenario entries — counts differ, the
category SPINE is identical. Both landings get a 3-lane legend + a category table
(links + counts) and the "two-lane" stale text removed.

### Current → target mapping (existing files to move)

**feature_catalog/ (17 entries today):**
- `01--evaluation-loop/` (6: initialization, candidate-generation, scoring-dispatch, promotion-gates, rollback, plateau-detection) → split: loop bits → `01--agent-improvement-loop`; scoring bits → `06--shared-scoring`.
- `02--integration-scanning/` (3: surface-discovery, runtime-mirrors, command-dispatch) → `02--agent-improvement-integration`.
- `03--scoring-system/` (4: five-dimension-rubric, dynamic-profiling, deterministic-scoring, dimensional-progress) → `06--shared-scoring`.
- `04--model-benchmark-mode/` (4: mode-switch, model-dispatcher, opt-in-5dim-scorer, mode-records-and-gates) → `04--model-benchmark`. **FIX STALE** in `01-mode-switch.md`: "VALID_MODES holds only agent-improvement and model-benchmark" / "closed two-value set" — VALID_MODES now includes skill-benchmark (verify against `scripts/shared/loop-host.cjs`).

**manual_testing_playbook/ (42 scenarios today):**
- `01--integration-scanner/` (001-004) → `02--agent-improvement-integration`.
- `02--profile-generator/` (005-008) → `02--agent-improvement-integration` (or `06--shared-scoring` for profile→scoring; pick by source).
- `03--5d-scorer/` (010,012,013) → `06--shared-scoring`.
- `04--benchmark-integration/` (014,015) → `06--shared-scoring` or `02-...` (verify source).
- `05--reducer-dimensions/` (017,018,019) → `07--shared-runtime`.
- `06--end-to-end-loop/` (020-024) → `01--agent-improvement-loop`.
- `07--runtime-truth/` (025-034) → `07--shared-runtime`.
- `08--agent-discipline-stress-tests/` (013-018 dup-numbered + setup-cp-sandbox.sh) → `03--agent-discipline`. NOTE the duplicate-numbered files here — renumber carefully under the new continuous scheme.
- `09--model-benchmark-mode/` (035-039) → `04--model-benchmark`.
- Landing `manual_testing_playbook.md` still says "one of **two** lanes" → fix to three.

> Renumber scenario IDs continuously under the new category order. The 9-column
> table "Exact Prompt" must stay in sync with the SCENARIO CONTRACT Prompt field
> and the landing summary (prompt-sync is a sk-doc rule).

---

## 4. LANE C SOURCE INVENTORY (author these fresh — verify each against the .cjs)

Scripts: `.opencode/skills/deep-improvement/scripts/skill-benchmark/`
- `run-skill-benchmark.cjs` — Lane C orchestrator (loop-host --mode=skill-benchmark): resolve target skill → D5 connectivity hard gate (first) → load public/private fixture pairs → contamination-lint public prompt → router-replay (Mode A, deterministic, CI gate) → score vs private gold → aggregate → report.json + report.md.
- `router-replay.cjs` — Mode A deterministic router replay (CI gate), no live dispatch.
- `contamination-lint.cjs` — public-fixture leak detection (banned-vocab list).
- `d5-connectivity.cjs` — D5 static connectivity scan; the HARD GATE; runs first.
- `score-skill-benchmark.cjs` — per-scenario scoring vs private gold; aggregates.
- `advisor-probe.cjs` — D1-inter advisor discovery probe (follow-on, NOT CI gate).
- `build-report.cjs` — renders report.md from report.json (dual-report anti-drift).
- `_args.cjs` — arg parser utility for the skill-benchmark scripts.
- (also confirm `parse-resource-loads.cjs` if present — earlier audit listed it.)

Mode wiring: `scripts/shared/loop-host.cjs` `--mode=skill-benchmark` arm.
Tests: `scripts/tests/skill-benchmark.vitest.ts`, `scripts/tests/remediation.vitest.ts`.
References: `references/skill-benchmark/{operator_guide,scenario_authoring,scoring_contract}.md`.
Assets: `assets/skill-benchmark/{default_profile.json, remediation_taxonomy.json,
fixtures/deep-improvement/agent-improve-001.{public,private}.json}`.

The existing landing `feature_catalog.md` §6 "SKILL-BENCHMARK MODE" already has 6
coherent feature blurbs (mode wiring; hint-free fixtures + contamination gate;
router-replay + advisor probe Mode A; D5 hard gate; D1-D5 scoring + funnel; dual
report + remediation taxonomy) — use them as the seed for the 6 catalog entries,
but RE-VERIFY each against the .cjs before shipping.

---

## 5. EXECUTION ORDER (safe/additive first, risky renumber last)

1. **(done)** Create this spec folder (spec.md + handover.md). Next session may
   add lean plan.md/tasks.md/checklist.md from
   `.opencode/skills/system-spec-kit/templates/` and run validate.sh --strict.
2. **Author Lane C fresh** (additive, zero risk to existing files): create
   `feature_catalog/05--skill-benchmark/` (≈6 entries) and
   `manual_testing_playbook/05--skill-benchmark/` (≈6 scenarios). GPT-5.5 drafts
   each from the §4 sources; Opus verifies each file against the cited .cjs.
   NOTE: temporarily these are dir "05"; final numbering settles in step 4.
3. **Verify Lane C** against source (the core gate). Fix anything invented/stale.
4. **Structural renumber** of existing A/B/shared dirs into the §3 taxonomy via
   `git mv` (reverse order to avoid collisions); update each moved entry's SOURCE
   METADATA "Feature file path" + any cross-refs; fix the confirmed-stale lines
   (the mode-switch "two-value" line; the playbook landing "two lanes" line).
   Delete NOTHING without reading it first.
5. **Rewrite both landings** to the new taxonomy: 3-lane legend, category table
   (links + counts matching dirs), corrected stale text, correct index `type`.
6. **Validate**: sk-doc validator exit 0 on both landings; acceptance checks in
   spec.md §4; `validate.sh <this folder> --strict` green.
7. **Commit** scoped by explicit pathspec (the two skill doc trees + this spec
   folder). NEVER `git add -A`. Then `/memory:save` to this folder.

---

## 6. STANDING CONSTRAINTS (do not violate)

- Comment-hygiene HARD BLOCK: never embed spec paths / ADR-REQ-CHK ids / packet
  numbers in CODE comments. (Docs/markdown are exempt; this is about .cjs/.ts.)
- Do NOT write to Claude native memory (`~/.claude/.../memory/`). Durable lessons
  go in in-repo skill docs.
- main-branch direct push is the authorized path for AIs under operator command;
  still scope commits + report.
- A parallel session may revert operator-sensitive files mid-task; re-grep on
  disk + verify HEAD before claiming any commit. Bash output may be truncated —
  write verdicts to a temp file and Read it; blank output is NOT success.
- Verify before completion claims — gate every "done" on a positive check you
  actually read.

---

## 7. SESSION 2 STATUS (resume from here)

### DONE + COMMITTED (one commit on `main`, message `docs(122): add Lane C (skill-benchmark) coverage to feature-catalog + testing-playbook`; confirm exact hash via `git log --oneline -8 | grep "add Lane C"`)

- **Lane C catalog subdir** `feature_catalog/05--skill-benchmark/` — 6 entries
  (01-mode-wiring, 02-contamination-gate-and-fixtures, 03-router-replay-and-advisor-probe,
  04-d5-connectivity-gate, 05-scoring-and-funnel, 06-dual-report-and-remediation).
  Authored by subagent, source-verified against `scripts/skill-benchmark/*.cjs`.
- **Lane C playbook subdir** `manual_testing_playbook/10--skill-benchmark/` — 6
  scenarios SB-040..SB-045. Live-verified (subagent ran the real scripts). File
  043's `printf '%s\n'` is intentional shell, NOT a defect.
- **Stale fixes:** `feature_catalog/04--model-benchmark-mode/01-mode-switch.md`
  now says `VALID_MODES` = three modes (was "only agent-improvement and
  model-benchmark"). Landing `feature_catalog.md` §6: two aspirational claims
  corrected (`default_profile.json` weights are hardcoded/reference-only;
  `remediation_taxonomy.json` is a reference asset NOT imported by report code —
  both verified by grep), and the six §6 "Source Files" lines now link into
  `05--skill-benchmark/*.md` (matching §2–§5).
- 14 files in that commit. Verify in HEAD:
  `git ls-tree --name-only HEAD .opencode/skills/deep-improvement/feature_catalog/05--skill-benchmark/ | wc -l` → 6.

### NOT DONE (resume work, in priority order)

1. **DONE (commit `0f70323e9c`).** Playbook landing now: Lane Note says three
   lanes, has a `## 16. SKILL-BENCHMARK MODE` section (SB-040..SB-045 with
   Description / Scenario Contract / Feature-File links into `10--skill-benchmark/`),
   `10--skill-benchmark/` added to the artifacts list + both cross-reference
   tables, coverage count bumped 42→48, and the closure wave lists SB-040..045.
   Verified: 0 residual "two lanes", section present, 6 SB feature-file links.
2. **Full mirror-renumber (operator's explicit ask)** — regroup BOTH trees into
   the §3 7-category taxonomy. Lane C catalog is ALREADY at its final `05--skill-benchmark`;
   playbook Lane C is at interim `10--skill-benchmark` and must move to `05--skill-benchmark`
   during the renumber. This is the large remaining piece (git mv existing cats,
   continuous playbook ID renumber, SOURCE METADATA path + cross-ref updates,
   rewrite both landings to the taxonomy). See §3 + §5.
3. **Spec folder `007` is untracked** — it was excluded from the Lane C commit to
   isolate it (the combined `git add` hit a transient pathspec error). Commit it
   separately: `git add <007 path> && git commit`. Optionally complete it to
   Level 2 (add plan/tasks/checklist) before `validate.sh --strict`.
4. **Validation:** run the sk-doc validator (§2) on both landings (exit 0) once
   the landings are final.

### ENVIRONMENT HAZARDS THIS SESSION (carry forward)

- 4 concurrent `claude --dangerously-skip-permissions` sessions (on packets 026
  & 123, not these docs) + a daemon rewriting `graph-metadata.json` → a hook
  emits "the state has changed!" that CLOBBERS bash stdout and intermittently
  delays/eats Read-tool results. Mitigations that worked: write command output to
  a UNIQUE `/tmp` file then Read it; Writes/Edits/commits EXECUTE even when their
  stdout doesn't render (verify via `git ls-tree HEAD` / re-Read the file);
  blank/garbled output is NOT proof of failure — re-verify on disk.
- Engine note: I authored Lane C via Opus subagents (each verified vs source),
  not cli-opencode GPT-5.5, because the stdout-clobbering made capturing dispatch
  JSON unreliable. Operator was told and can request the cli-opencode path.
