---
title: "Baseline: frontmatter values and citation breakage at commit 5285608745"
description: "Frozen counts for the R1 R5 R9 adoption program, each with the command and commit that produce it, plus the call-site answer and the sk-doc frontmatter addendum."
trigger_phrases:
  - "okf baseline"
  - "contexttype census"
  - "citation breakage census"
  - "sk-doc frontmatter addendum"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-speckit/050-open-knowledge-format-adoption/002-baseline-and-decisions"
    last_updated_at: "2026-10-04T08:45:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Added the two-family labeled sample and D3 inputs"
    next_safe_action: "Operator approves D1 to D4"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-04-speckit-050"
      parent_session_id: null
    completion_pct: 80
    open_questions: []
    answered_questions: []
---
# Baseline: frontmatter values and citation breakage at commit 5285608745

Every number below comes from one commit, `5285608745fe243e633c6e396345611e32744113`, read from git objects rather than the working tree. A rerun on that commit gives the same output byte for byte: two runs of the census produced the same SHA-256 prefix, `44f685b3d0a25cc2`.

---

## 1. HOW TO REPRODUCE

Run from the repository root.

```bash
C=5285608745fe243e633c6e396345611e32744113
S=specs/system-speckit/050-open-knowledge-format-adoption/002-baseline-and-decisions/scratch
git log -M --diff-filter=R --name-status --format='C %H %ct' $C > "$TMPDIR/okf-renames.txt"   # about 2m15s
python3 $S/census.py $C "$TMPDIR/okf-renames.txt" > $S/census-5285608745.json                # about 16s
python3 $S/sample_draw.py $C 20261004 20 > $S/sample-rows.jsonl
```

The rename log holds 465,244 rename records, which collapse to 420,245 distinct old paths. It is kept out of the packet because of its size.

**Families.** `spec` is every tracked `.md` under `specs/` without a `z_archive` segment. `skill` is every tracked `.md` under `.skilled/skills/`.

**Symlinks count once.** 30 tracked skill docs and 1 spec doc are symlinks. Reading the working tree follows them and counts their targets twice, which is why a working-tree count gives `general` 954 on skill docs where the census gives 927.

---

## 2. FRONTMATTER VALUES

| Measure | Spec docs | Skill docs |
|---|---|---|
| Tracked docs | 23,370 | 8,667 |
| No leading frontmatter block | 4,904 | 4,491 |
| Docs with `contextType` | 11,387 | 1,610 |
| Distinct `contextType` values | 33 | 6 |
| `contextType` outside the four values and two aliases | 392 | 52 |
| Docs with `importance_tier` | 11,366 | 1,628 |
| Distinct `importance_tier` values | 10 | 4 |
| `importance_tier` outside the six values | 842 | 14 |

**Spec-doc `contextType` spread:** implementation 5,912, general 3,626, planning 1,039, research 370, spec 80, review 65, decision 48, specification 38, tasks 37, plan 36, reference 27, architecture 23, implementation-summary 15, documentation 9, handover 8, task 8, research-prompts 7, audit 6, testing 5, manual-testing 4, verification 4, implementation-plan 3, tasks-ledger 3, analysis 2, decision-record 2, phase-parent 2, review-report 2, and one each of deferred, governance, implementation_plan, remediation, resource-map and synthesis. The top three cover 92.9%.

**Skill-doc `contextType` spread:** general 927, implementation 593, reference 50, planning 34, research 4, review 2.

**`importance_tier` spread.** Spec docs: important 5,145, normal 4,879, high 803, critical 499, supporting 17, useful 12, medium 6, planning 3, standard 1, temporary 1. Skill docs: normal 1,425, important 189, high 12, supporting 2.

**Effect of the D1 alias table.** Mapping review, reference, documentation, spec, specification, plan and tasks leaves 100 spec-doc `contextType` values and 0 skill-doc values outside the list, headed by architecture 23 and implementation-summary 15. On `importance_tier`, the D1 aliases leave 3 spec-doc values outside the list, all `planning`. The first draft of this line said 80; the census JSON gives 100.

**Correction to earlier estimates.** The phase 003 spec estimated about 830 spec-doc outliers. At this commit the count is 392 for `contextType` and 842 for `importance_tier`, mostly `high`.

---

## 3. CITATION BREAKAGE

Each `path.ext:line` citation outside a fenced block is tested in order: direct (the citing doc's folder, then the repo root), then a rename chain from git history, then a unique basename. A citation counts as a `[SOURCE:]` tag when it sits inside `[SOURCE: ...]`.

| Class | Spec, in `[SOURCE:]` | Spec, bare | Skill, in `[SOURCE:]` | Skill, bare |
|---|---|---|---|---|
| In range | 4,755 | 10,145 | 5 | 117 |
| Past end | 270 | 691 | 0 | 18 |
| Moved, line in range | 10,217 | 21,388 | 0 | 6 |
| Moved, past end | 505 | 565 | 0 | 0 |
| Basename only | 1,241 | 18,667 | 0 | 51 |
| Ambiguous basename | 2,586 | 25,574 | 0 | 40 |
| Gone | 6,487 | 36,839 | 0 | 119 |
| **Total** | **26,061** | **113,869** | **5** | **351** |

**Where the moves come from.** The top rename roots for moved citations are `.opencode` to `.skilled` (26,372) and `.opencode` to `specs` (4,861).

**What this means for each phase:**
- **Phase 005.** Only 18% of `[SOURCE:]` tags in spec docs resolve directly and in range, so a check on old packets would be mostly noise. That supports the cutoff in D2.
- **Phase 004.** `cite-drift-scan.mjs` accepts a unique basename match as resolved (`.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:246-248`). 1,292 spec-doc tags and 51 bare skill-doc citations pass that way today without naming the file that moved.
- **Bare citations on spec docs.** Many short names, such as `spec.md:12`, point into another packet. This is why the spec-doc bare counts show far more ambiguous and gone citations than the tag counts do.

---

## 4. DOCUMENT KIND OR SESSION KIND

**Answer: the 10-value and 11-value lists classify a session. `context-types.ts` classifies a document.** The same key name carries both meanings. Confidence is about 85%.

- `runtime/cli/utils/input-normalizer.ts:1133-1136` holds 10 values and rejects anything else in a save payload. Accepted values pass through unchanged.
- `runtime/cli/extractors/session-extractor.ts:576-588` holds 11 values (the same 10 plus `discovery`) and guesses from tool-use ratios when the payload has none (`:120-134`, documented as "Classify the session context type" at `:115`).
- The session value sets the project phase (`collect-session-data.ts:1396-1408`), the importance tier for `planning` (`session-extractor.ts:150`) and the memory type (`core/memory-metadata.ts:78,81`).
- `shared/context-types.ts:16-31` has one runtime importer, `runtime/cli/lib/frontmatter-migration.ts:15`, which writes the value into doc frontmatter (`:1365`).
- No template carries a `{{CONTEXT_TYPE}}` placeholder, and no writer was found that copies the session value into a doc.

All paths above are under `.skilled/skills/system-spec-kit/`. Two findings would change the answer: a writer that copies the session value into frontmatter, or `post-save-review.ts:733-741` reading a real doc. Today `workflow.ts:2000` passes it a folder path, so it is UNKNOWN whether that review ever runs.

---

## 5. SK-DOC ADDENDUM

**Classes.** `.skilled/skills/sk-doc/sk-create-frontmatter/assets/frontmatter-templates.md` requires `importance_tier` and `contextType` on reference and asset docs (`:126`) and changelog entries (`:694`). They are optional on a README beside a SKILL.md (`:511`). They are not part of the SKILL.md, command, playbook, feature-catalog or agent classes. Its lists are `importance_tier` constitutional, critical, important, normal, temporary, deprecated (`:377`) and `contextType` planning, research, implementation, general (`:378`).

| Validator | Classes it reads | What it checks for these two keys | Severity |
|---|---|---|---|
| `sk-doc/shared/scripts/validate_document.py` | Agents, commands, changelog entries | Presence only, on changelog entries (`:1557`) | Blocking, exit 1 |
| `sk-doc/shared/scripts/quick_validate.py` | SKILL.md | Nothing | Exit 1 on name, description or version |
| `check-frontmatter-versions.sh` with `frontmatter-version.mjs` | SKILL.md, README beside it, references, assets, catalogs, playbooks | Nothing, only `version` | Exit 1 |
| `sk-create-skill/scripts/package_skill.py` | References and assets, nested too | Presence only, values skipped on purpose (`:108-110`) | Warning, error with `--strict` |
| `system-skill-advisor/runtime/scripts/check-skill-doc-frontmatter.mjs` | Top-level `references/` and `assets/` only, 101 of 724 docs | Values against its own copy of both lists (`:36-39`, `:128-136`) | Error, exit 1. CI runs it (`.github/workflows/skill-doc-frontmatter.yml:42`) |

**Hooks.** The post-edit hook runs only the version gate and never blocks. The pre-commit hook runs comment hygiene only.

**Advisor.** `system-skill-advisor/runtime/lib/skill-graph/doc-frontmatter.ts:115-163` parses both keys when `SPECKIT_ADVISOR_DOC_TRIGGERS=true` and stores them in SQLite (`skill-graph-db.ts:240-241`). `importance_tier` changes ranking through `docTierWeight` (`doc-frontmatter.ts:41-55`), and an unknown value such as `high` scores as `normal`. No scorer reads `contextType`.

---

## 6. LABELED CITATION SAMPLE

The D3 threshold was fixed in `decision-record.md` at 2026-10-04T08:33:14Z, before any label below existed.

**Draw.** `sample_draw.py` at seed 20261004 drew 20 skill-doc rows and 20 spec-doc rows. Every row is an in-range citation with a markdown target. The populations were 58 skill-doc and 10,933 spec-doc candidates. 13 of the 40 targets carry `<!-- ANCHOR:` markers. Two draws gave the same SHA-256 prefix, `ad22a0ad75009e8c`.

**Labelers.** `scratch/labels-claude.jsonl` came from a Claude subagent (claude-opus-5-5) and `scratch/labels-deepseek.jsonl` from `opencode-go/deepseek-v4.1-flash` at max effort through `cli-pi`, with read-only tools (`pi exit=0`). Both got the same brief (`scratch/label-brief.md`) and saw neither the other's labels nor the threshold. `scratch/agreement.py` computes the figures below into `scratch/agreement.json`.

| Measure | Value |
|---|---|
| Rows labeled by both | 40 of 40 |
| Same verdict | 24 of 40 |
| Same miss-or-support split | 37 of 40 |
| Claude verdicts | supports 18, contradicts 17, partial 4, unclear 1 |
| DeepSeek verdicts | supports 22, partial 13, contradicts 5 |
| Both say miss | 18 |
| Relocatable misses (both say miss and both relocate) | 13, rate 0.325 (skill 7, spec 6) |
| Relocation lines within five lines of each other | 11 of 13 |
| Relocatable-miss targets with `<!-- ANCHOR:` markers | 3 of 13, share 0.231 |
| Relocatable-miss targets with markdown headings | 13 of 13 |

**D3 inputs as fixed.** Condition 1 (at least 30 rows) passes. Condition 2 (at least 20% relocatable misses) passes at 32.5%, and still passes at 27.5% if only the 11 rows with matching relocation lines count. Condition 3 (at least half of those targets carry anchor markers) fails at 23.1%. On this sample, D3 as written points to not building phase 006. Phase 006 makes the formal call after the phase 004 census.

**What the data shows beyond D3.** Line drift into markdown is common: about a third of in-range citations in the sample point at the wrong lines of a file that still holds the cited text. Six of the 13 targets are skill `SKILL.md` or `README.md` files, which use headings but not `<!-- ANCHOR:` markers. A citation form keyed on heading slugs would cover all 13 targets. Counting headings would change condition 3 after the data was read, so it is recorded here as an option for the operator, not applied.

**Hand check.** The orchestrator checked five rows by hand (d3-05, d3-12, d3-21, d3-30, d3-37) and agreed with the Claude labels on all five. d3-21 is a confirmed relocatable miss: the cited row of `specs/sk-doc/060-create-goal-mode/spec.md` moved from line 146 to 149.

**Known flaws.** In d3-26 and d3-27, a bare `README.md` citation was resolved to the repo-root README, while the citing text means another README. Neither is a relocatable miss. The same short-name problem drives the large ambiguous and gone counts in section 3. The three miss-or-support disagreements (d3-07, d3-14, d3-37) are all one labeler's partial against the other's supports.
