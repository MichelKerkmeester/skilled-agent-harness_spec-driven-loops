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
and `manual_testing_playbook/09--model-benchmark-mode/mode-switch-routing.md`.

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