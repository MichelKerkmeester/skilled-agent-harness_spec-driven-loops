---
title: "Resource Map -- feature 022 Jev spec-folder suggestion (lineage deepseek)"
status: complete
date: 2026-10-03
---

# Resource Map -- what this research touched and where the work would land

Paths relative to repository root unless marked (external). "Role" is what the artifact answered for this research; "Served by" names the recommendation that would change it.

## Measured surface (where a fix would land)

| Path | Role | Status | Served by |
|---|---|---|---|
| `.skilled/skills/system-spec-kit/runtime/cli/evals/score-alignment-suggestion.ts` | The scorer: census, path replay, rows writer, keep rule, Jev/Deem arms. Scored run used it at commit-time state; revision unpinned in run evidence. | canonical | R2, R4 |
| `.skilled/skills/system-spec-kit/runtime/cli/spec-folder/alignment-validator.ts` | `validateContentAlignment` (:477) and `validateFolderAlignment` (:601); thresholds :73-75; alternative ranking :522-545 / :641-664; TTY prompt and hard blocks :546-596 / :666-684. | canonical | R2 (suggestion text), R5 (serving) |
| `.skilled/skills/system-spec-kit/runtime/cli/spec-folder/folder-detector.ts` | Save-flow callers :1043 (CLI), :1160/:1187 (data); redirect :1166; auto-detect ranking :200-541 and low-confidence fall-through :1247-1350. | canonical | R5, F4-02 copy |
| `.skilled/skills/system-spec-kit/runtime/cli/core/subfolder-utils.ts` | `findChildFolderAsync` :130; ambiguity hook :29. | canonical | adjacency only |
| `.skilled/skills/system-spec-kit/runtime/cli/core/find-predecessor-memory.ts` | Candidate tie :244-268 -> null :365-372. | canonical | adjacency only |
| `.skilled/skills/system-spec-kit/runtime/cli/continuity/generate-context.ts` | Ambiguous child resolution refused, "Did you mean" list :1020-1040. | canonical | adjacency only |

## Corpus and run evidence

| Path | Role | Status | Note |
|---|---|---|---|
| `~/.skilled/.labels/022-rows.jsonl` (external) | The scored 40-row corpus with arbiter labels. | evidence | not in repository history; not hash-pinned |
| `specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/fixtures/022-rows.jsonl` | Repository copy, `label: null` on all 40 rows. | fixture copy | differs from scored file by label only |
| `~/.skilled/.labels/runs/047-022-jev-20261002/{calls.jsonl,report.json}` (external) | 121 call records; counts and p. | evidence | no token/price receipt |
| `~/.skilled/.labels/runs/047-022-jev.stdout.txt` (external) | Row/baseline/keep-rule/verdict lines. | evidence | recorded in results.md |
| `~/.skilled/.labels/drafts/022-arbiter.jsonl` (external) | 40 `{id,label}` arbiter labels. | evidence | arbiter input set not recorded |

## Packet history (what governed the measurement)

| Path | Role | Status |
|---|---|---|
| `specs/.../022-alignment-folder-suggestion/{spec.md,plan.md,goal.md,implementation-summary.md}` | Feature contract: REQ-001..010, baseline definition :118, keep rule :184-206 frozen 2026-09-29, census counts. | canonical history |
| `specs/.../042-label-drafting-and-confirmation/{spec.md,scratch/evidence/label-inventory-1.md,scratch/evidence/card-022.md}` | Label-gate method; 022 blocked for lack of rows; arbiter amendment; label schema notes. | canonical history |
| `specs/.../047-measure-every-jev-feature/{goal.md,scratch/evidence/results.md}` | D1/D4/D6 decisions; fixture allowance; recorded verdict row. | canonical history |
| `specs/.../019-advisor-suggested-order/goal.md` | Sibling precedent for a Jev tiebreak in a different judge. | precedent |

## Operating rules loaded

| Path | Role |
|---|---|
| `REPO RULES.md` | Gate 5 router; matched write/report/dialogue actions. |
| `.skilled/repo-rules/evidence-and-proof.md`, `scope-discipline.md`, `delegation-and-orchestration.md`, `uncertainty-and-honesty.md` | Evidence tiers, write-surface discipline, delegation posture, UNKNOWN handling. |

## Gaps this research did not close

- Real-transcript corpus (T1) and adjudicated labels (T2) do not exist yet; the run remains a fixture result until they do.
- Token/price receipts and fire frequency are absent, so no dollar cost model exists (F2-06, F5-03).
- No census of low-confidence auto-detect branches exists, so the highest-value pay-off surface (F4-02) has no frequency estimate.
