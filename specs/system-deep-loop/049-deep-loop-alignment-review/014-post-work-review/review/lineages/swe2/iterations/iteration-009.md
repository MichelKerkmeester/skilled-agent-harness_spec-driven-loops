# Iteration 9 — Recorded-Defect Closure Audit

**Focus:** D1 Correctness + D4 Maintainability — Angle 9: phase 013 claims seven measured defects are each fixed or refuted, nothing left recorded as somebody else's. Audit each of the seven closures adversarially — including whether the fix's own file still contradicts itself.
**Phase record audited:** `013-recorded-adjacent-defects`

## Method

Read each of the seven fix sites and test the claim against the mechanism, not the summary.

## Evidence

### Verified closures (6 of 7 clean)

- **Push gate (the highest-stakes defect).** `pre-push:288-305` now loops `PUSHED_SHAS` and `git diff --quiet <pushed_sha> -- <routing bytes>` — blocking with `gate:routing-commit-parity` when the pushed commit's routing inputs/manifests differ from the working tree the guard validated. The old hole (guard validates a tree nobody receives) is closed by construction [SOURCE: .opencode/scripts/git-hooks/pre-push:270-305].
- **executor-config persona field.** `agentPersona` exists in the schema (:87), is listed in `cli-hermes`'s `EXECUTOR_KIND_FLAG_SUPPORT` (:122), and appears in the unsupported-field scan list (:630) — the field the flag table declared now exists and is enforced per-kind.
- **fanout-run devin comment.** Now describes the guard accurately: "records it and quarantines a copy under the lineage; it leaves the bytes in place unless the run opts into restoring" (:2471-2473) — matches the containment behavior verified in iteration 5.
- **reduce-state severity naming.** `normalizeSeverity` emits a stderr warning naming the unrecognized value once per value before dropping its findings (:97-107) — the silent-drop defect is fixed at the producer.
- **Collapse rule across all six agent trees.** Present in `.opencode` (:198), `.claude`, `.cursor` (symlink), `.pi`, `.codex` (`.toml:189`), `.devin` (`deep-review/AGENT.md` symlink → `.claude`). My first sweep missed `.codex`/`.devin` because I guessed wrong filenames — both resolve and carry the rule.
- **Design command references.** All `.opencode/skills/` paths cited by `design/assets/*.yaml` resolve; the palettes point at the live `sk-design-chart/assets/style-reference/evilcharts/palettes.json`.

### The one not-quite-clean closure

- **Stress scenario tree check.** The verification commands now diff all six trees (`.opencode`, `.claude`, `.codex`, `.pi`, `.cursor`, `.devin` at :87-92) — the executable fix landed. But the Objective line still reads: "leaves `.opencode`, `.claude`, and `.opencode` fixture surfaces unchanged" (:27) — `.opencode` twice, four trees unnamed. The prose that names what the scenario checks still carries the defect the commands fixed.

## Findings

### F006 (P2 — maintainability): the fixed stress scenario's own Objective still carries the duplicated enumeration it replaced

Phase 013's claim was "a duplicated check replaced by the four trees it left unchecked." The check (six diff commands) is fixed; the Objective sentence naming what is checked was not updated to match — it still enumerates `.opencode` twice and never names `.codex`, `.pi`, `.cursor`, `.devin`. A reader of the scenario's stated objective cannot tell six trees are verified. Doc-commands disagreement inside the fixed file — the program's own defect class, at small scope.

*Adjudication:* claim = "Objective line contradicts the verification block it introduces"; evidence = :27 vs :87-92 in the same file; counterevidence sought = an alternate Objective line elsewhere in the doc (none — this is the scenario's single objective); alternative = prose is descriptive not normative (still a contradiction in the file the phase touched); final severity P2; confidence high; downgrade trigger = none plausible.

## Verdict rationale

Six of seven closures verified clean including the push-gate hole; the seventh is fixed in its mechanism but its prose still describes the pre-fix state — a P2 documentation residue, not a functional failure.

Review verdict: CONDITIONAL
