# Review Iteration 1 — Correctness

## Dispatcher

- Mode: review · Target agent: deep-review · Resolved route: `Resolved route: mode=review target_agent=deep-review`
- Run: `fanout-deepseek-1793081281038-z2aj1o` · lineage `deepseek` · generation 1 · lineageMode `new`
- Target: `specs/system-speckit/054-weak-model-spec-authoring` (spec-folder, phases 001-022, main at `558570a83e`)
- Iteration: 1 of 3 · Stop policy: `max-iterations` · Convergence threshold: 0.10 (telemetry until the cap)
- Operator review focus carried into this iteration: check what packet 054 shipped against what each phase spec claims. This iteration reads the phase records for 003, 004, 005, 017, 021 and 022 (the phases that own the placeholder gate, the two guard scripts, the draft auto-repair, the CI gate and the advisor routing) and then opens the shipped file each one names, so every claim below is compared with code, not with the closeout prose.

## Files Reviewed

- `.skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh`
- `.skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts`
- `.skilled/skills/system-spec-kit/runtime/cli/rules/check-placeholders.sh`
- `.skilled/skills/system-spec-kit/runtime/cli/rules/README.md`
- `.skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json`
- `.skilled/skills/system-spec-kit/runtime/cli/lib/status-classifier.sh`
- `.skilled/skills/system-spec-kit/runtime/cli/spec/check-card-sync.sh`
- `.skilled/skills/system-spec-kit/runtime/cli/spec/check-example-drift.sh`
- `.skilled/skills/system-spec-kit/references/validation/validation-rules.md`
- `.skilled/commands/speckit/plan.md`, `.skilled/commands/speckit/implement.md`, `.skilled/commands/speckit/complete.md`
- `.skilled/skills/system-spec-kit/templates/core/tasks.md.tmpl`, `spec.md.tmpl`
- `.github/workflows/changed-packet-validation.yml`
- Phase records read for the claim side: `003-versioned-placeholder-gate/implementation-summary.md`, `004-template-section-fill-guidance/`, `005-weak-model-authoring-card/`, `017-measured-behavior-and-draft-metadata/{spec.md,implementation-summary.md}`, `021-ci-gate-regressions/implementation-summary.md`, `022-advisor-routing-and-local-install/implementation-summary.md`

## Findings by Severity

### P0 Findings

None. No shipped behavior contradicts a phase spec in a way that fails a packet's verdict.

### P1 Findings

1. **Recursive validation auto-repairs every Draft child, so a read-only audit mutates packets it was not asked to touch** -- `.skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh:414` -- `run_validation` validates the named folder, then re-invokes the same orchestrator once per phase child with the same flags, including `--strict`. Because each child is a fresh CLI entry, `runDraftAutoRepair` (`orchestrator.ts:1631`) judges that child on its own report: a Draft child whose only errors are derived-metadata rules gets one `repair-derived.cjs --apply` run. The documented refusal set (`orchestrator.ts:1568`, mirrored at `references/validation/validation-rules.md:849`) covers a passed report, the switch, `CI`, a `SPECKIT_RULES` subset, a non-strict run, a non-Draft status, a content error and a missing repository root. Recursion is not in it, so `validate.sh --strict <parent>` can rewrite `graph-metadata.json`, `description.json` and frontmatter pointers in several children in one run. The same concern was handled for five sibling callers (`repair-derived.cjs`, `upgrade-legacy.mjs`, `quality-audit.sh`, `progressive-validate.sh`, `strict-pass-freshness.ts` all set `SPECKIT_DRAFT_AUTO_REPAIR=0`), which leaves recursion as the one unguarded path.
   - Finding class: `missing-case`
   - Scope proof: `validate.sh:414` re-invokes `"${ORCHESTRATOR_CMD[@]}" --folder "$phase_dir" ${flags[@]+"${flags[@]}"}` with the user's `--strict`; `orchestrator.ts:1688` wraps `runDraftAutoRepair(validateFolder(folder, opts), opts)` at the CLI entry, which is exactly what a child invocation is.
   - Affected surface hints: `validate.sh --recursive` and its auto-enabled variant for phase parents (`validate.sh:433`), every packet authored as a Draft phase child, `references/validation/validation-rules.md` §auto-repair, the card's section 9 "run the validator once" instruction.
   - Case: a phase parent with three Draft children, two holding a stale `graph-metadata.json`, run as `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/<track>/<packet> --strict`, rewrites derived metadata in both children while the operator believes they ran a check.
   - Claim adjudication:
     ```json
     {
       "type": "implementation-gap",
       "claim": "A recursive --strict validation run repairs derived metadata in every Draft child, not only in the packet named on the command line.",
       "evidenceRefs": [
         ".skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh:414",
         ".skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:1568",
         ".skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:1631",
         ".skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:1688",
         ".skilled/skills/system-spec-kit/references/validation/validation-rules.md:849"
       ],
       "counterevidenceSought": "Read the refusal list for a recursion or multi-folder guard (none); read validation-rules.md:849 for a documented per-child repair (it documents only the switch, CI, subset and status gates); checked whether the child invocation differs from the parent's (same ORCHESTRATOR_CMD, same flags); checked whether the census harness that rewrote 4,757 folders could have done the same (it sets the switch to 0, which shows the authors knew the read-only-tool risk).",
       "alternativeExplanation": "The authors may treat a recursive run as N independent validate calls, so per-packet repair is the intended semantics and the docs simply do not restate it.",
       "finalSeverity": "P1",
       "confidence": 0.8,
       "downgradeTrigger": "A sentence in validation-rules.md, the card or the phase 017 spec stating that a recursive run repairs each Draft child would make this documented behavior and drop it to P2."
     }

### P2 Findings

2. **The placeholder rule's header describes a call path that no longer exists** -- `.skilled/skills/system-spec-kit/runtime/cli/rules/check-placeholders.sh:6` -- the header says "Sourced by validate.sh and compatible with strict mode", and `rules/README.md` says the opposite in the same tree ("validate.sh never sources a rule itself", registry spawns one script per rule). The file's own line 22 also promises parity with the orchestrator. In production the registry entry for `PLACEHOLDER_FILLED` is skipped, because `shouldRunRegistryShellRule` returns `!nativeRuleIds.has(rule.rule_id)` (`orchestrator.ts:427`) and the orchestrator pushes a native `PLACEHOLDER_FILLED` entry (`orchestrator.ts:1347`) whose id enters `nativeRuleIds` (`orchestrator.ts:1363`). A maintainer who edits this shell rule to change a verdict changes nothing.
   - Finding class: `instance-only`
   - Scope proof: `check-placeholders.sh:6` and `:22` versus `orchestrator.ts:427` and `:1363`; `rules/README.md` §Current state states the hop `validate.sh → orchestrator.js → registry → one spawn per rule script`.
   - Affected surface hints: the rule-authoring guide in `rules/README.md`, the phase 003 parity test, any future edit to the shell rule.
   - Case: an author fixed a placeholder case in `check-placeholders.sh` only, ran `validate.sh --strict`, saw the verdict unchanged, and concluded the validator was ignoring the edit.

3. **The legacy scan keeps a Draft-token branch that its own `continue` makes unreachable** -- `.skilled/skills/system-spec-kit/runtime/cli/rules/check-placeholders.sh:191` -- the token-gated branch ends at line 174 with `continue`, so every statement after it runs with `token_gated=false`. The `[[ "$token_gated" == true && "$draft_packet" == true ]]` test at line 191 can therefore never be true, and the comment above it ("A token in a Draft packet is deferred to a warning when the doc carries the token-gate stamp") describes behavior this path cannot produce. The behavior shipped is correct; the code reads as if the legacy path were Draft-aware.
   - Finding class: `instance-only`
   - Scope proof: `check-placeholders.sh:164-175` ends the token-gated path with `continue`; `:191` tests the same flag in the path reached only when it is false.
   - Affected surface hints: future edits to the legacy scan, the parity test in `placeholder-token-gate.vitest.ts`.
   - Case: an author reads line 191, believes an older-stamp doc in a Draft packet warns on a token, and does not add the case the code actually needs.

4. **Three durable command docs describe the rule set in changelog tense** -- `.skilled/commands/speckit/plan.md:107`, `.skilled/commands/speckit/implement.md:93`, `.skilled/commands/speckit/complete.md:102` -- all three carry the identical sentence "Its `validate.sh --strict` calls now include three warn-only rules". "Now" is a statement about a moment, and these are reference docs a reader opens a year later. The registry already holds eight `warn` rules (`validator-registry.json`), so the count is only right for the three authored-template rules the sentence names, and a future addition leaves the sentence reading as if three were all.
   - Finding class: `instance-only`
   - Scope proof: the three lines hold byte-identical prose; `validator-registry.json` reports 8 rules at severity `warn` out of 42.
   - Affected surface hints: the three `/speckit:*` command docs and their YAML assets, which repeat the same paragraph.
   - Case: a reader checks how many strict rules can warn, reads "three", and treats a `GRAPH_METADATA_*` or `LINKS_VALID` warning as a defect.

## Traceability Checks

| Protocol | Level | Status | Evidence |
|----------|-------|--------|----------|
| `spec_code` | core | partial | Phase 003's v2.3 token gate, phase 004's example drift guard and phase 005's card sync guard all hold against the shipped files: `check-card-sync.sh` printed `CARD SYNC OK` (196-line card, 10 PASS lines) and `check-example-drift.sh` printed `EXAMPLE_DRIFT_OK`. Phase 017's auto-repair holds its documented refusal cases but not recursion (finding 1). |
| `checklist_evidence` | core | partial | Phase 022's claim that `worktree-naming.sh provision` links `local-*` entries matches `_wn_link_local_commands` (`worktree-naming.sh:614-647`): every failure path `continue`s, an existing path is skipped, and the function returns 0. Its claim that mode suffixes are stripped before tokenizing matches `text.ts:45` and `skill_advisor.py:2972`; the phrase path in `derived.ts:59` still reads the raw prompt, which is documented behavior, not a defect. |
| `skill_agent` | overlay | notApplicable | No skill/agent parity surface changed in this dimension. |
| `agent_cross_runtime` | overlay | notApplicable | Not reached this iteration. |
| `feature_catalog_code` | overlay | pending | Scheduled for iteration 3. |
| `playbook_capability` | overlay | pending | Scheduled for iteration 2. |

## Edge Cases

- **Which validator is production.** `rules/README.md` and `validate.sh`'s own header agree that the shell rules are spawned by the orchestrator through the registry, and `orchestrator.ts:427` then shadows any rule id the orchestrator implements natively. Both readings were checked before finding 2 was recorded; neither supports the "sourced by validate.sh" header.
- **Registry warn count.** Eight registry rules carry `warn`, but only three are authored-template rules. Finding 4 is written against the tense and the ambiguity, not against a count error.
- **`recommend-level --quiet` in phase-spec fill notes.** The phrase appears in the fill comments of phases 016 and 017, but the sweep phase 015 promised (`rg -c -e '--quiet' -e 'recommend-level' templates/`) prints no match, so the neutralization claim holds for `templates/` and this is not a finding.

## Confirmed-Clean Surfaces

- `check-card-sync.sh` exits 0 with all ten checks passing, and is wired into `/speckit:plan`, `/speckit:implement` and `/speckit:complete` plus its own vitest.
- `check-example-drift.sh` exits 0 (`EXAMPLE_DRIFT_OK`) with an example folder for each of the four levels (5, 6, 7 and 7 documents).
- The placeholder gate's token-gated path matches the orchestrator on `<YOUR_VALUE_HERE:`, on a line holding both a token and an open question, and on the title `[template:` token; `speckit_carries_token_gate_stamp` accepts v2.3 or later and the templates now stamp v2.4.
- `goal.md` is inside the orchestrator's document set for a token-gated packet (it is a `lazyAddonDocs` entry), so the shell rule's extra `goal.md` scan is not a divergence.
- The changed-packet workflow's scratch skip (`changed-packet-validation.yml:91`) matches only a whole `scratch` segment, so `001-scratch-notes` is still graded.
- Phase 021's census and phase 017's census harness (`strict-pass-freshness.ts`) sets `SPECKIT_DRAFT_AUTO_REPAIR=0`, so neither census rewrote the packets it graded.

## Ruled Out

- **Placeholder gate reachable only for v2.3 docs while templates stamp v2.4**: `speckit_carries_token_gate_stamp` compares major/minor against 2.3, so v2.4 is gated. Ruled out.
- **`implementation-summary.md` scanned by the shell rule but not the orchestrator**: `FREEFORM_WORKFLOW_DOCS` holds only `review/review-report.md` and `research/research.md`, and `validationDocsForLevel` includes lifecycle and addon docs. Ruled out.
- **`check-example-drift.sh` aborting on a clean example**: with `set -euo pipefail`, `printf | rg -q ... && status=1` is an AND-OR list whose failing first command is exempt. Ruled out by reading, not by execution.
- **Template fill-note examples naming the benchmark task**: the sweep prints no match under `templates/`. Ruled out.

## Next Dimension

Security. Focus: the draft auto-repair write path (what it can rewrite and where it resolves paths), the `local-*` symlink provision step, and the template/validator handling of untrusted document content. This iteration's finding 1 hands the security pass one concrete question: what, exactly, can `repair-derived.cjs --apply` write, and can a packet's own content steer it outside the packet.

Review verdict: CONDITIONAL
