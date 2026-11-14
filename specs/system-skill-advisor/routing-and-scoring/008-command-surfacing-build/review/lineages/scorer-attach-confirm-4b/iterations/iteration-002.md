# Review Iteration 002 — scorer-attach-confirm-4b

## Dispatcher

- Mode: review (deep-review, fan-out lineage)
- Review target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build`
- Lineage: `scorer-attach-confirm-4b`, session `fanout-scorer-attach-confirm-4b-1794680176420-xvj4ed`, generation 1, lineageMode `new`
- Focus: traceability — the remediation plan's own contract for each fix, packet-doc claims, and the doc rows
- Operator focus: `review-brief-4b.txt` — confirming round of pass four. This iteration addressed it by reading the remediation spec that owns each fix (`027-review-pass-four-remediation/spec.md`, `tasks.md`), mapping every scorer-attach row to its task and verification line, and correcting one iteration-1 finding whose evidence came from a ripgrep replacement artifact rather than the file.
- Sources read: `steer.md` (absent), `review-brief-4b.txt`, `review-scope-4b.txt`, `review/verify-4/report.md`, `027-review-pass-four-remediation/spec.md` (finding table, P046/P048, A6), `027-review-pass-four-remediation/tasks.md` (T004, T005, T014-T017, CHK-FIX-001, CHK-FIX-004), `020-command-offer-fit-guards/spec.md` (REQ-003, edge cases), `runtime/lib/render.ts`, `doctor-brief-render.vitest.ts`.
- Budget profile: verify (10 analysis calls).

## Corrections

1. **SAC4B-P2-002 is retracted.** Iteration 1 reported that `README.md:121` names `parent-named only` while the renderer prints `(n)`. The evidence came from `rg -rn "parent-named only"`, where `-r` is ripgrep's *replace* flag: the printed `n` was my own replacement text, not file content. Re-read without `-r`: `render.ts:113` is `const PARENT_NAMED_POLICY = 'parent-named only';`, `render.ts:48` says "renders as parent-named only", and `doctor-brief-render.vitest.ts:84` asserts `... /doctor:update (parent-named only)`. The README sentence is correct and matches the code; 027 T016's verification line (`tasks.md:109`) also checks that exact constant. Withdrawn from the registry via `resolvedFindings`.
2. **`iter4-P2-unscored-only-dead-field` is an accepted deferral, not an unfixed finding.** `027-review-pass-four-remediation/spec.md:214` records it with the pair-block and `paired` name as deferred to phase 026 T052 (operator decision P046). It remains a dead field (`score-command-transcripts.mjs:1633,1702`, no increment path), but the remediation plan owns it. Closed here as deferred, not re-raised.

## Files Reviewed

- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/027-review-pass-four-remediation/spec.md:195-215,385-388`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/027-review-pass-four-remediation/tasks.md:79-80,107-110,218,221,246`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/020-command-offer-fit-guards/spec.md:175,241`
- `.skilled/skills/system-skill-advisor/runtime/lib/render.ts:48,113,204-216`
- `.skilled/skills/system-skill-advisor/runtime/tests/doctor-brief-render.vitest.ts:84`
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:366-440` (re-read for the contract comparison)
- `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:155-201` (re-read)

Context-only (sibling rows): `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md:69,124,188`.

## Findings - New

### P0 Findings

None.

### P1 Findings

None new. **SAC4B-P1-001 remains active and is strengthened, not re-raised:** `027-review-pass-four-remediation/spec.md:201` states the fix contract for SA4-P1-002 as "A decline lead also covers every command an or-list joins to the one it leads." The implementation at `command-attach.ts:379` joins only `/cmd or /cmd`, so `do not run /create:agent or the /create:readme command` still returns a command (probe, iteration 1). The contract names the command the list joins, not the literal absence of the article, so the article form is inside the fix's own promise; the only clause-opening exemption the spec allows is a second use verb (`A4`, `027/spec.md:385`: `do not run A or run B` keeps B's command), which this input does not have. The missing test row is visible against `027 tasks.md:79` (all five rows are bare forms), while `CHK-FIX-004` (`tasks.md:221`) asks for the delimiter and joined-input cases; the article form is a delimiter-adjacent case with no row.

### P2 Findings

None new.

## Traceability Checks

| Check | Result | Evidence |
|---|---|---|
| `spec_code` — remediation contract per scorer-attach fix | partial | T004 (`027/spec.md:201`), T009 (`:205`), docs T014-T016 (`:209`, `tasks.md:107-109`) all match their code; T004's contract is met only for the bare or-list form (SAC4B-P1-001) |
| `checklist_evidence` — CHK-FIX-001, CHK-FIX-004, CHK-042 | pass with one gap | finding classes and doc corrections hold (`tasks.md:218,246`); CHK-FIX-004's adversarial table has no article-inside-or-list row (`tasks.md:221`) |
| `skill_agent` — README describes the skill's own behaviour | pass | `README.md:121` matches `render.ts:113` and `doctor-brief-render.vitest.ts:84` (correction 1) |
| `agent_cross_runtime` — sibling-owned Codex reader | pass (context) | `codex.mjs:164-171` opens `storePath`; not this lineage's row |
| `feature_catalog_code` — feature-catalog rows | pass | `advisor-recommend.md:39` ↔ `advisor-recommend.ts:475-478`; `command-meaning-matching.md:65` ↔ 28 `it` blocks (027 T015, `tasks.md:108`) |
| `playbook_capability` | notApplicable | no playbook in scope |
| 020 REQ-003 reach | pass as written, silent on the article | `020/spec.md:175` names the seven prompts; `020/spec.md:241` says a two-command prompt is read once per command, which the article form still satisfies semantically while the code returns a request |
| Accepted limits not re-raised | pass | SA4-P1-001 (retired name) and SA4-P1-003 (broad creation words) accepted at `027/spec.md:212-213` (P045); SA4-P2-004 superseded by note at `027/spec.md:210` (P048); unscoredOnly/pair/paired deferred at `:214` (P046) |

Core protocol status after this iteration: `spec_code` partial (one open contract gap, SAC4B-P1-001), `checklist_evidence` pass with the same gap. Dimension covered: traceability.

## Integration Evidence

- Remediation ownership: `027-review-pass-four-remediation/spec.md` is the packet doc that names each fix, its finding class (CHK-FIX-001) and its deferral decisions (P046, P048); it is the traceability anchor for this round.
- Documentation chain: `README.md:121` → `render.ts:113` → `doctor-brief-render.vitest.ts:84` all agree on the child-session policy phrase.
- Sibling boundary: `routing-accuracy/README.md` carries the `offeredAs`, pair-block and A11 rows; those are accuracy-runner rows and are not raised here.

## Edge Cases

- The retraction in this iteration changes the running P2 count from 3 to 1 (SAC4B-P2-001 only). The registry now records the closed id and the deferred id; the narrative and delta agree.
- `rg -r` is a destructive read habit in a review: it prints the file as if edited. Every finding in this lineage is now either probe-verified (module import) or `rg -n`-verified; no finding rests on a `-r` output.
- `SA4-P2-004` (phase 020 says 10, code uses 9) is a superseding note, not an erratum, by operator decision P048 (`027/spec.md:210,387`); not raised.
- The article-inside-or-list gap has no test row; the fix's own task list (T004) defines only the bare form, so a follow-up fix must widen both the constant and the table.

## Confirmed-Clean Surfaces

- `COMMAND_BARE_ASK_LEAD` article fix matches its task exactly (`027 tasks.md:80`, `command-attach-guards.vitest.ts:198`).
- Meaning-anchor count 28 matches the doc row and 027 T015's verification (`tasks.md:108`).
- Head-keeps-command sentence matches `index === 0` (`advisor-recommend.md:39`, `advisor-recommend.ts:478`).
- Shell-read start and heredoc end-word fixes map to 027 T009/T010 (`027/spec.md:205`) and their task rows.

## Ruled Out

- `R4-P2-002`, `iter2-P1-fit-decline-ungated`, `iter3-P2-attached-metrics-unpinned`: rejected in `verify-4/report.md`; no new input found.
- `SA4-P2-004` (10 vs 9): accepted superseding note under P048; re-reporting it would contradict the operator decision.
- `iter3-P2-pair-doc-shared-rows`, `iter4-P2-paired-arm-key-collision`, `iter4-P2-unscored-only-dead-field`: accepted deferrals to phase 026 (P046); not re-raised.
- The 027 T016 verification line was re-run mentally against the real file: `rg -c -F "PARENT_NAMED_POLICY = 'parent-named only'" render.ts` prints 1, so the task's evidence is sound. No finding.

## Next Focus

- Dimension: security and maintainability (combined pass)
- Focus area: holdout hygiene in the scorer's live capture path, guard reach and regex cost on the new or-list constant, dead code and test pinning on the new rows
- Reason: traceability is complete and the remaining configured dimensions have no iteration of coverage; the convergence gate needs both before STOP
- Rotation status: correctness and traceability complete; security and maintainability remaining
- Required evidence: `score-command-transcripts.mjs` holdout path (`:1201-1240,1500-1520`), `COMMAND_OR_LIST` cost and reach, the three new test tables
- Recovery note: none

Review verdict: CONDITIONAL
