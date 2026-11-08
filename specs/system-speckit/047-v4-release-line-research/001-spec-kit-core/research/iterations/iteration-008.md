# Iteration 8 — Continuity Save and Resume, Writer vs. Router

## Focus

Key question 4, deepened rather than repeated: where continuity content is actually routed by the writer, and whether the routing vocabulary the docs promise exists in code. Secondarily, the two `/doctor:update`-adjacent surfaces named in the strategy's carried-forward list were **not** touched this iteration (Q6 residual unchanged).

Method: read `generate-context.ts` (help block and payload contract), `core/config.ts`, `core/spec-root-write-guard.ts`, `core/workflow.ts` planner branches, `runtime/lib/validation/spec-doc-structure.ts` routing aliases, `references/memory/save-workflow.md` §Canonical Save Router, the four docs asserting `handover_state`, and ran the compiled writer twice against a scratch git repo in `/tmp`.

## Actions Taken

1. Read `generate-context.ts:60-230` (help text, payload format, continuity/operatorDecisions rules) and grepped the file for every routing token.
2. Read `core/config.ts:100-175` (`gitTopLevel`, `resolveProjectRoot`) and `core/spec-root-write-guard.ts:1-40`.
3. Read `save-workflow.md:405-445` (§Canonical Continuity Expectations, §Canonical Save Router) and grepped the whole `.skilled` tree for `LLM_REFORMULATION_ENDPOINT`, `pending-route`, `handover_state`.
4. Read `spec-doc-structure.ts:168-186` and `:1262-1330` (alias table, `inferCategory`, `validateCrossAnchorContamination`), plus the vitest case that feeds it.
5. **Ran the writer twice** in `/tmp/iter8-probe` (a `git init` scratch repo holding `specs/001-probe`):
   - stdin, no `--project-root`, `--full-auto`, payload with `routeAs: "handover_state"`.
   - file mode with `--project-root /tmp/iter8-probe`.

## Findings

### F1 — `CROSS_ANCHOR_CONTAMINATION` never receives a routing payload, so it always passes

The registered rule is a no-op on every real run. Its validator returns the skip result when no plan is supplied: `createResult('CROSS_ANCHOR_CONTAMINATION', [], 'No routing payload supplied; contamination check skipped')` [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts:1289]. `contaminationPlan` appears **nowhere** in `runtime/cli` — `grep -rn "contaminationPlan" .skilled/skills/system-spec-kit/runtime/cli --include=*.ts` returns no non-test hits — and the only producer in the repository is a unit test that hand-builds the plan [SOURCE: .skilled/skills/system-spec-kit/runtime/tests/spec-doc-structure.vitest.ts:646]. The writer never sets the field either: `routeAs` survives only as a help-text sentence [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/continuity/generate-context.ts:168].

- type: bug (dead check) · severity: P1 · release: present at v4.0.2.0, outlet path added pre-v4 · confidence: high
- verify: `grep -rn "contaminationPlan" .skilled/skills/system-spec-kit/runtime/cli --include=*.ts | grep -v tests/` → empty.
- why it matters: the Q9/iteration-6 reading of this rule ("a rule exists") is true at the registry level and false in practice. This is the mirror image of the iteration-5 finding that a rule cannot fail (F1, `MEASURED_BEHAVIOR`): here the rule cannot run.

### F2 — `save-workflow.md` §Canonical Save Router documents a live router that has no code

The reference states the routed save path "classifies each canonical chunk into exactly 8 categories", that Tier 3 "is part of the live save handler by default" via `LLM_REFORMULATION_ENDPOINT` [SOURCE: .skilled/skills/system-spec-kit/references/memory/save-workflow.md:432], that drop refuses into `scratch/pending-route-<hash>.json` [SOURCE: .skilled/skills/system-spec-kit/references/memory/save-workflow.md:426], and that `routeAs` "can force a category" [SOURCE: .skilled/skills/system-spec-kit/references/memory/save-workflow.md:435]. None of the three exist: `grep -rn "LLM_REFORMULATION_ENDPOINT\|pending-route" .skilled --include=*.ts --include=*.js --include=*.mjs --include=*.md | grep -v node_modules` returns only the four `save-workflow.md` lines themselves, and `routeAs` occurs exactly once in the writer's 1,307 lines, inside its help string, where it is described as *accepted for compatibility* — i.e. parsed past and ignored.

- type: drift (docs vs code) · severity: P1 · release: introduced in commit `5399875c9e` (`docs(026)`), still unfixed at v4.0.2.0 · confidence: high
- verify: `grep -n "routeAs" .skilled/skills/system-spec-kit/runtime/cli/continuity/generate-context.ts` → one hit, line 168. `git log --oneline -S "LLM_REFORMULATION_ENDPOINT" -- .skilled/skills/system-spec-kit/references/memory/save-workflow.md` → one doc commit.
- why it matters: this is the section `/speckit:save` sends a model to for routing decisions. A model that reads it will try `routeAs` and believe the category was honoured; the writer will accept the payload and write nothing to that category.

### F3 — The documented 8 categories and the coded 5 can never agree

`ROUTE_CATEGORY_ALIASES` holds `narrative_progress`, `task_update`, `decision_log`, `research_findings`, `metadata_only`, `drop` and five aliases [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts:175]. `inferCategory` returns only those same five plus `drop` [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts:1272]. The doc's `narrative_delivery`, `decision`, `handover_state` and `research_finding` [SOURCE: .skilled/skills/system-spec-kit/references/memory/save-workflow.md:421] are absent from both, so a declared value for any of them falls through unchanged at the alias lookup [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts:1297] and then **must** mismatch the inferred value, emitting `SPECDOC_CONTAM_001`/`002` as a warning [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts:1316]. The category names drifted on one side only.

- type: misalignment (doc vocabulary vs code vocabulary) · severity: P2 · release: pre-v4.0.0.0, live at v4.0.2.0 · confidence: high (both tables read)
- verify: `sed -n '174,186p' .skilled/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts` and compare with `sed -n '419,426p' .skilled/skills/system-spec-kit/references/memory/save-workflow.md`.

### F4 — Project-root resolution silently falls back to the runtime repository (probe-confirmed)

`resolveProjectRoot` returns `RUNTIME_REPOSITORY_ROOT` whenever the caller's git top-level does not "use spec-kit", writing one stderr note and continuing [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/core/config.ts:143]. The writer's help promises the opposite default: "Defaults to the git top-level of the working directory, and must sit inside it" [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/continuity/generate-context.ts:99].

Repro (run this iteration):

```
mkdir -p /tmp/iter8-probe && cd /tmp/iter8-probe && git init -q .
# specs/001-probe with spec.md + implementation-summary.md
echo '{"specFolder":"specs/001-probe","routeAs":"handover_state"}' \
  | node <repo>/.skilled/skills/system-spec-kit/runtime/cli/dist/continuity/generate-context.js --stdin --full-auto
```

Output line 1: `[spec-kit] /private/tmp/iter8-probe is not inside a repository that uses spec-kit; using the runtime repository /Users/.../Skilled as the project root`, followed by a block from the write guard [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/core/spec-root-write-guard.ts:29]. The guard is the only thing standing between a scratch project and a write into this checkout.

- type: bug (write-escape default) · severity: P1 · release: pre-v4, live at v4.0.2.0 · confidence: high (observed output)
- verify: the command above; then `find /tmp/iter8-probe -name "*.json" -newer /tmp/iter8-payload.json` → nothing written.
- note: with `--project-root /tmp/iter8-probe` the same payload gets past the guard and fails later on the quality gate (`INSUFFICIENT_CONTEXT_ABORT`, exit 1, no files written) — the guard path and the quality path are distinguishable, so the fallback, not the guard, is the defect.

### F5 — A legitimate guard refusal is classified as "Unexpected Error"

The writer keeps a list of messages it treats as expected input errors; the block text is not in it (`/Spec folder not found|...|project-root|Continuity rejected/`) [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/continuity/generate-context.ts:1266]. The probe therefore printed the refusal three times — `Unexpected Error:`, `Error:`, then a stack — for a condition the operator can fix. The message itself is also misleading: it reports `collision class is divergent-duplicate (no readable packet roots)` [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/core/spec-root-write-guard.ts:29] for what was simply a packet that does not exist under a root that does.

- type: ux (operator + AI reader) · severity: P2 · release: pre-v4, live at v4.0.2.0 · confidence: high for the classification (list read), medium for the "misleading" reading (only one probe)
- verify: the F4 repro, and `grep -n "isExpected" .skilled/.../generate-context.ts`.

### F6 — `--planner-mode hybrid` is accepted and has no behaviour

`hybrid` is in the union [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/continuity/generate-context.ts:45], is validated as one of three legal values [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/continuity/generate-context.ts:1003], and is then never compared: every consumer branches on `plannerMode !== 'full-auto'` [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/core/workflow.ts:577] or `=== 'full-auto'` [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/core/workflow.ts:2208]. The help text concedes it: "hybrid behaves like plan-only" [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/continuity/generate-context.ts:97].

- type: over-engineering · severity: P2 · release: pre-v4, live at v4.0.2.0 · confidence: high
- what breaks if removed: two union members, one CLI validation entry, two help lines, one doc sentence. Nothing branches on it, so nothing stops working — which is the finding. A caller who passes `hybrid` expecting the "merge" the name implies gets a plan-only response with no notice.
- verify: `grep -rn "plannerMode" .skilled/skills/system-spec-kit/runtime/cli/core/workflow.ts` → six comparisons, all against `full-auto`.

### F7 — `handover_state` → `handover.md` is asserted by five doc rows and implemented by none

`save-workflow.md` lists `handover.md::session-notes` as the target of `handover_state` routing [SOURCE: .skilled/skills/system-spec-kit/references/memory/save-workflow.md:422] and as "refreshed by `/speckit:save` when `handover_state` routing applies" [SOURCE: .skilled/skills/system-spec-kit/references/memory/save-workflow.md:340]; `SKILL.md` repeats it [SOURCE: .skilled/skills/system-spec-kit/SKILL.md:74], as do `template-guide.md:566` and `level-specifications.md:732`. The writer contains **zero** occurrences of `handover`: `grep -c "handover" .skilled/skills/system-spec-kit/runtime/cli/continuity/generate-context.ts` → 0. Meanwhile 33 packets carry a `handover.md` (12 at three levels, 21 at four), so the artifact is real and the maintenance route is not.

- type: drift · severity: P2 · release: handover claims entered at v4.0.0.13, unchanged through v4.0.2.0 · confidence: high for absence, medium for attribution
- overlap: iteration 6 F6 covered `/speckit:handoff` discoverability from the `handover.md` intent-table row; this is the writer half — the row above claims a save-time write path that does not exist.
- verify: `grep -rn "handover" .skilled/skills/system-spec-kit/runtime/cli/continuity/generate-context.ts | wc -l` → 0; `ls -d specs/*/*/handover.md | wc -l` → 12.

### Invariant (positive control)

The quality gate does refuse a thin save. With `--full-auto` and a minimal payload the run exits 1 with `INSUFFICIENT_CONTEXT_ABORT` (title too generic, primary evidence 0, semantic substance 36 chars) and writes no file in the target packet — so the JSON-primary path cannot silently persist an empty continuity block.

## Questions Answered

None newly. Key question 4 was already ticked at iteration 3; this iteration deepens it with the writer-side evidence the earlier pass lacked (the router described in the reference has no implementation, and the one coded routing rule never receives input). `answeredQuestions: []` on the record for that reason.

## Questions Remaining

- **Q6 (upgrade preview/rollback)** — unchanged residual: only `check` has been executed; `align`, `apply`, `rollback`, `compat` are read but unrun.
- **Q7 (create.sh + level templates)** — unchanged; the fill-note comparison against sk-doc canon is still open.
- **New residual from F4:** whether `usesSpecKit()` accepts a project that only carries a `specs/` folder — the scratch repo *had* `specs/001-probe` and was still rejected, so the marker is something else (unread). That is the difference between "fallback for a non-skilled project" and "fallback for a project that merely looks wrong", and only the first is defensible.
- **New residual from F2:** whether a v3-era memory daemon used to provide the router (the `LLM_REFORMULATION_ENDPOINT` name suggests it). `git log -S` showed a single docs commit for the section, so the code was never in this tree — but the docs commit could have migrated text from `.opencode/skill/...`. Unverified.
- **Carried:** Q3 freshness signal, Q4 stale-index gate, Q5 over-budget bind, Q9 rules/options pairs, Q10–Q12.

## Next Focus

Iteration 9 should close **Q7** (`create.sh` + level templates against `validate.sh --strict`) and **Q12's continuity extension limb** — specifically whether a `routeAs` implementation is worth proposing (extension F2 suggests yes: 15 lines that read the field and hand it to `ROUTE_CATEGORY_ALIASES`, which would turn F1's dead rule live). Do not re-probe `generate-context.js` file output; that ground is now measured.
