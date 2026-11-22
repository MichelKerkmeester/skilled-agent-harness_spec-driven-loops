# Review Iteration 004

## Dispatcher

- Mode: review (fan-out lineage `vibe`, session `fanout-vibe-1795299580084-7g6zan`, generation 1, lineageMode `new`)
- Review target: `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub` (spec-folder)
- Dimension: maintainability
- Iteration: 4 of 5 (`stopPolicy: max-iterations`)
- Operator review focus addressed: this iteration covered the "end-to-end verification" half of the focus at the documentation layer — the hub's four prose documents, its two changelog entries, the seven-scenario playbook and the two benchmark run indexes — and asked whether the recorded evidence still describes the shipped state. That question is what surfaced the P1.

## Files Reviewed

- `.skilled/skills/mcp-browser-use/README.md` (full)
- `.skilled/skills/mcp-browser-use/SKILL.md` (sections 2-3, for the stage definitions and layout)
- `.skilled/skills/mcp-browser-use/ROUTER.md` (sections 1-4)
- `.skilled/skills/mcp-browser-use/description.json` (full)
- `.skilled/skills/mcp-browser-use/changelog/v1.1.0.0.md` (full)
- `.skilled/skills/mcp-browser-use/manual-testing-playbook/manual-testing-playbook.md` (sections 1-5)
- `.skilled/skills/mcp-browser-use/manual-testing-playbook/hub-routing/holdout-agentic-browser.md` (frontmatter and section 1)
- `.skilled/skills/mcp-browser-use/benchmark/reports/README.md` (full)
- `.skilled/skills/mcp-browser-use/benchmark/reports/2026-11-21--manual-testing-playbook--hub-routing/README.md` (full)
- `.skilled/skills/mcp-browser-use/benchmark/reports/compiled-routing/2026-11-21--two-stage-replay--compiled/README.md` (index row cross-check)

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **The hub's own routing gate is recorded as failing, and no later run supersedes it after the gold was changed** -- `.skilled/skills/mcp-browser-use/benchmark/reports/2026-11-21--manual-testing-playbook--hub-routing/README.md:9` -- the recorded hub-routing run states "Verdict: FAIL" (`:9`), records MT-H04's gold as `mcp-aside-devtools` against an observed `defer` (`:27`), and records the admission check as `mcp-browser-use drift 6 pass, 1 drift, 0 stale, 0 n/a` with `EXIT=1` (`:73`, `:76`). The scenario file that supplies that gold now says the opposite: `expected_intent: defer` and `expected_workflow_mode: defer` (`manual-testing-playbook/hub-routing/holdout-agentic-browser.md:6`, `:8`), with the change explained at `:24` — "The gold changed from `mcp-aside-devtools` to `defer` on 2026-11-21, by operator decision, when the first run under the new hub deferred." The benchmark index still carries the FAIL as the newest hub-routing row (`benchmark/reports/README.md:27`). Three consequences follow. First, the hub's own readiness condition — "The hub is ready only when `node .skilled/bin/compiled-route-admission.cjs --hub mcp-browser-use` reports no drift and no stale gold" (`manual-testing-playbook/manual-testing-playbook.md:58`) — is recorded as unmet, and the packet's convention that "a run whose result changes gets a new folder" (`benchmark/reports/README.md:19`) means the re-run that would show it met was never recorded. Second, the report's own finding 1 says "The gold was not edited to match" (`:95`), which is no longer true of the scenario file, so the report and the scenario contradict each other on whether the drift is open. Third, the parent goal's criterion 6 is satisfied by the three mode playbooks, but the hub-level playbook that the same packet added is the one whose recorded verdict is FAIL, so a reader checking "is the hub verified" gets a different answer from the index than from the scenario.
   Finding class: stale-evidence
   Scope proof: all four files are in `reviewScopeFiles`; the contradiction is between artifacts inside the packet, and the gold values were read from the frontmatter rather than inferred.
   Affected surface hints: `.skilled/skills/mcp-browser-use/benchmark/reports/2026-11-21--manual-testing-playbook--hub-routing/README.md`, `.skilled/skills/mcp-browser-use/benchmark/reports/README.md`, `.skilled/skills/mcp-browser-use/manual-testing-playbook/hub-routing/holdout-agentic-browser.md`, `.skilled/skills/mcp-browser-use/manual-testing-playbook/manual-testing-playbook.md`, `.skilled/bin/compiled-route-admission.cjs`
   Case: an operator deciding whether to ship the hub opens `benchmark/reports/README.md`, sees the newest hub-routing row is `6 PASS, 1 FAIL` with verdict `FAIL`, and blocks the release — while the scenario file says the drift was resolved by operator decision and the router's `defer` is now the correct answer.

```json
{
  "type": "claim",
  "claim": "The packet's newest recorded hub-routing run reports FAIL and an admission-check exit 1 against a gold the scenario file has since changed to defer, and no re-run supersedes it.",
  "evidenceRefs": [
    ".skilled/skills/mcp-browser-use/benchmark/reports/2026-11-21--manual-testing-playbook--hub-routing/README.md:9",
    ".skilled/skills/mcp-browser-use/benchmark/reports/2026-11-21--manual-testing-playbook--hub-routing/README.md:27",
    ".skilled/skills/mcp-browser-use/benchmark/reports/2026-11-21--manual-testing-playbook--hub-routing/README.md:73",
    ".skilled/skills/mcp-browser-use/benchmark/reports/2026-11-21--manual-testing-playbook--hub-routing/README.md:95",
    ".skilled/skills/mcp-browser-use/benchmark/reports/README.md:27",
    ".skilled/skills/mcp-browser-use/manual-testing-playbook/hub-routing/holdout-agentic-browser.md:6",
    ".skilled/skills/mcp-browser-use/manual-testing-playbook/hub-routing/holdout-agentic-browser.md:24",
    ".skilled/skills/mcp-browser-use/manual-testing-playbook/manual-testing-playbook.md:58"
  ],
  "counterevidenceSought": "Read the whole hub-routing report, the whole benchmark index, the MT-H04 scenario and the playbook readiness clause. Checked whether a later run folder exists that would supersede the FAIL: the index lists exactly two rows, the two-stage replay (PASS) and this hub-routing run (FAIL), and the replay covers six curated requests, not the seven playbook scenarios, so it does not supersede the admission check. Checked whether the report is explicitly framed as a historical record: `benchmark/reports/README.md:19` says a run whose result changes gets a new folder, which makes the FAIL a record of a moment, but no new folder exists, so the packet holds no recorded state in which the gate passes.",
  "alternativeExplanation": "The FAIL could be a deliberate historical record kept so the drift decision stays auditable, with the scenario file's gold change as the resolution. That explains why the old folder was not overwritten, but it does not explain why the report's finding 1 still says the gold was not edited, nor why the index carries no superseding row, so the packet still has no recorded evidence that its own readiness condition is met.",
  "finalSeverity": "P1",
  "confidence": "high",
  "downgradeTrigger": "Downgrade to P2 if the packet documents that the hub-routing FAIL is a closed historical record and that the admission check is re-run only at release time, with the scenario gold change as the accepted resolution."
}
```

### P2 Findings

1. **The hub changelog calls the advisor "stage one", which is the name the hub gives `hub-router.json`** -- `.skilled/skills/mcp-browser-use/changelog/v1.1.0.0.md:26` -- the release note says "Bare `aside`, `lighthouse` and `click through` stay out of stage one" (`:26`) and, three bullets later, "Bare `aside` is back in the Aside aliases" (`:29`). Both are true of different surfaces — the first describes the advisor's `graph-metadata.json` vocabulary, the second describes `hub-router.json` — but the hub defines "stage one" as `hub-router.json` itself (`SKILL.md:75`, "`hub-router.json`: stage one's policy, signals, vocabulary classes and tie-break order"), and `hub-router.json`'s `aside-devtools-aliases` class does carry bare `aside`. Under the hub's own terminology the first bullet is false, and a maintainer who reconciles the changelog with the router would remove bare `aside` to satisfy it — re-breaking "run aside on the pricing page", the exact regression the second bullet records as fixed.
   Finding class: terminology-drift
   Scope proof: both files are in `reviewScopeFiles`; the keyword was read from `hub-router.json` rather than assumed.
   Affected surface hints: `.skilled/skills/mcp-browser-use/changelog/v1.1.0.0.md`, `.skilled/skills/mcp-browser-use/SKILL.md`, `.skilled/skills/mcp-browser-use/hub-router.json`
   Case: a maintainer reads the changelog, sees bare `aside` must stay out of stage one, deletes it from `hub-router.json`'s `aside-devtools-aliases`, and the hub starts deferring on "run aside on the pricing page".

2. **The hub README's navigation table omits `leaf-scopes.json`, the file that decides which leaves are routable** -- `.skilled/skills/mcp-browser-use/README.md:50` -- the NAVIGATION table (`:50`) lists `mode-registry.json`, `hub-router.json`, `ROUTER.md` and `leaf-manifest.json` (`:57`) and stops there. `SKILL.md:91` lists `leaf-scopes.json` in the layout and `SKILL.md:106` explains that it is what makes the Lighthouse leaf routable, and `parent-skill-check` treats the manifest as generated from the scopes. A maintainer who adds a leaf root and follows the README will edit the generated manifest instead of the authored scope, and the next regeneration will silently drop the change.
   Finding class: incomplete-navigation
   Scope proof: both files are in `reviewScopeFiles`; the omission was confirmed by grepping the README for `leaf-scopes`, which returns nothing.
   Affected surface hints: `.skilled/skills/mcp-browser-use/README.md`, `.skilled/skills/mcp-browser-use/SKILL.md`, `.skilled/skills/mcp-browser-use/leaf-scopes.json`
   Case: a maintainer adds a new Chrome DevTools catalog leaf, edits `leaf-manifest.json` by hand because the README never mentions a scope file, and the next `generate-leaf-manifest.cjs --write` run reverts it.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | pass | Carried from iteration 3; this iteration added no criterion evidence and contradicted none. The one criterion-adjacent change is that the hub-level playbook's recorded verdict is FAIL, which does not affect criterion 6 because that criterion names the three mode playbooks. |
| `checklist_evidence` | pass | Carried from iteration 3. The P1 above is a gap in the hub-level benchmark record, not in a child phase's `tasks.md` evidence, so it does not lower this protocol. |

## Integration Evidence

- `.skilled/skills/mcp-browser-use/benchmark/reports/README.md:27` is the only index row that names the hub-routing run, and it carries `6 PASS, 1 FAIL` with verdict `**FAIL**`; the other row is the two-stage replay at `6 PASS` / `**PASS**`.
- The two-stage replay covers six curated requests (`results.csv`, MBU-R-01..03 and MBU-T-01..03) and does not include the seven playbook prompts, so it cannot stand in for the admission check.
- `.skilled/skills/mcp-browser-use/manual-testing-playbook/manual-testing-playbook.md:58` is the readiness clause the recorded FAIL contradicts, and it names the exact command (`compiled-route-admission.cjs --hub mcp-browser-use`) whose recorded output is `EXIT=1`.
- The hub playbook holds exactly seven scenario files under `hub-routing/`, matching the "7 routing scenarios" claim at `manual-testing-playbook.md:21`; the count is accurate even though the recorded verdict is not current.

## Edge Cases

- **Ambiguity: is a recorded FAIL a defect or a record.** The packet's own convention (`benchmark/reports/README.md:19`, "A run whose result changes gets a new folder. A prior run is never overwritten") makes the FAIL a legitimate historical record. I kept the P1 because the packet holds no superseding record, so its newest evidence for its own readiness gate is a failure; if the convention were read as "records are never re-run", the finding would drop to P2.
- **Contradiction recorded, not resolved:** the report's finding 1 says "The gold was not edited to match" (`:95`) while the scenario file records that the gold was changed by operator decision (`holdout-agentic-browser.md:24`). I did not decide which artifact is authoritative; the P1 names both.
- **Missing optional evidence:** I did not run `compiled-route-admission.cjs` — the lineage's write constraints forbid running repo tooling that writes, and the admission check writes a report. The finding rests on the recorded output, not on a fresh run.
- **Out-of-scope note:** `005-routing-and-surfaces/implementation-summary.md:164` records that the `cli-orca` hub-deferral playbook still says `mcp-tooling` declares eight tool bridges. That file is outside `reviewScopeFiles`, so it is recorded here as a carried-forward item rather than raised as a finding.

## Confirmed-Clean Surfaces

- The hub playbook's scenario count is accurate: seven files under `hub-routing/` against the "7 routing scenarios" claim, and the category description matches the five-moved-plus-two-new split.
- `description.json` carries no registry-owned duplicate keys and its keyword list names all three modes plus the hub identity; `parent-skill-check` `8a` and `8b` pass on it.
- Version agreement holds across the hub: `SKILL.md`, `README.md`, `ROUTER.md`, `mode-registry.json`, `hub-router.json`, `description.json` and the newest changelog entry all carry `1.1.0.0`.
- The changelog shape is correct: one file per release, a title line, a reason paragraph, a "What's New at a Glance" list, an Upgrade section and a spec-folder pointer.
- The hub README's verification section names two runnable commands, and both targets exist: `parent-skill-check.cjs` and `sk-doc/scripts/validate_document.py` (a symlink to `sk-doc/shared/scripts/validate_document.py`).

## Ruled Out

- **The hub README's verification commands pointing at missing scripts.** Ruled out: `parent-skill-check.cjs` exists and exits 0 on the hub, and `validate_document.py` resolves through a symlink to a real file.
- **A stale scenario count in the playbook.** Ruled out: seven scenario files against a stated seven.
- **The two-stage replay superseding the hub-routing FAIL.** Ruled out: the replay covers six curated requests and never invokes the admission check.
- **`description.json` duplicating registry-owned keys.** Ruled out by `parent-skill-check` `8b`.

## Next Focus

- Dimension: cross-reference (integration verification)
- Focus area: the end-to-end verification surfaces the earlier iterations deferred — `.skilled/bin/compiled-route.cjs` and `.skilled/bin/compiled-route-guard.cjs`, `.skilled/bin/compiled-route-sync.cjs`, `.skilled/bin/tests/compiled-route-admission.test.cjs` and `compiled-route-rule-bound.test.cjs`, `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/{compiled-route.cjs,resolve.cjs}`, `.skilled/bin/lib/compiled-routing/serving-closure.manifest.json`, and the `.skilled/skills/mcp-tooling/` six-mode surface after losing two modes.
- Reason: the P1 from this iteration is about the admission check's recorded state, so the last iteration should read the admission check itself and the serving closure that decides whether the hub is served compiled or legacy — the one integration surface no iteration has opened yet.
- Rotation status: correctness, security, traceability and maintainability complete; cross-reference is the remaining configured dimension.
- Blocked/productive carry-forward: productive — reading a recorded run against the artifact that supplies its gold found the P1; reuse it on the admission test's pinned corpus count.
- Required evidence: the admission check's gold source, the serving-closure entry for `mcp-browser-use`, and the pinned scenario count in `compiled-route-admission.test.cjs`.
- Recovery note: not applicable.

Review verdict: CONDITIONAL
