---
title: "Deep Review Report: sk-create-goal and cross-repo references"
description: "Five MiMo v2.6 Pro iterations over the sk-create-goal mode and every surface that names it. Verdict CONDITIONAL: no P0, two P1 after the adversarial self-check, nineteen P2."
trigger_phrases:
  - "sk-create-goal deep review report"
  - "create-goal review findings"
importance_tier: "normal"
contextType: "research"
---
# Deep Review Report: sk-create-goal and cross-repo references

<!-- MACHINE-OWNED: review-report -->

---

## 1. EXECUTIVE SUMMARY

**Verdict: CONDITIONAL.** hasAdvisories: false.

| Severity | Active |
|---|---|
| P0 | 0 |
| P1 | 2 |
| P2 | 19 |

The adversarial self-check below confirmed two of the three P1 findings and moved R2-P1-001 to P2, since it needs a frontmatter block that is not valid YAML. The reducer registry still lists the original three P1 severities.

**Scope.** The review covered 89 files: the sk-create-goal mode (27 files), the `/create:goal` command and its three runtime prompt mirrors, the five speckit workflows, the goal hooks, the sk-doc hub registries, system-spec-kit's docs, template and validator, the markdown agent across five runtimes, three Hermes skill copies, the advisor bridges, `.opencode/plugins/README.md`, `AGENTS.md` and the root `README.md`. Iteration 5 also swept the whole repository outside `specs/`.

**Run.** Five iterations dispatched through the workflow's cli-pi branch to `llmgateway/mimo-v2.6-pro` at `--thinking high`. Stop reason `maxIterationsReached` under `stopPolicy=max-iterations`. Every iteration passed `verify-iteration.cjs` with exit 0.

**Against the operator's three bars.**

- **sk-doc alignment.** Every automated sk-doc gate passes: the playbook package validator (8 scenarios, 0 violations, 0 warnings), the skill package check and `validate_document.py` on every mode document. Seven gaps sit where no validator looks: an out-of-enum `contextType`, a restated cut order, a stale README row, a changelog in an older shape, a scenario without a human-voice request and two scenario grading defects.
- **Cross-repo references.** The sweep resolved every pointer to the canonical sections, the six operations, the registries and the advisor bridges. What remains is one boundary rule stated wrong everywhere it is restated (R1-P1-001), a stale evidence line number, dead relative links in the Hermes copies and one term collision in the goal hooks README.
- **Playbook capability.** Six of eight scenarios are fully supported by today's code. SCG-004 grades against a five-step cut order that skips canonical step 3. SCG-005 seeds placeholder text from a template the mode no longer copies.

---

## 2. PLANNING TRIGGER

The operator chose to fix every finding inside this phase before running the playbook, so no new `/speckit:plan` packet is opened. The planning packet below seeds that remediation.

```json
{
  "Planning Packet": {
    "triggered": true,
    "verdict": "CONDITIONAL",
    "hasAdvisories": false,
    "activeFindings": {"P0": 0, "P1": 2, "P2": 19},
    "remediationWorkstreams": ["WS1 budget boundary", "WS2 frontmatter parsing", "WS3 goal CLI and hooks hardening", "WS4 /create:goal trust boundary", "WS5 sk-doc alignment", "WS6 playbook grading", "WS7 cross-repo pointers"],
    "specSeed": "Extend 012-goal-send-and-dedupe with the review remediation requirements",
    "planSeed": "One edit per finding, tests for each code change, then the eight playbook scenarios with MiMo",
    "findingClasses": ["doc_code_contradiction", "tool_divergence", "regex_dos", "input_validation_fail_open", "path_containment_gap", "missing_trust_boundary", "injection_surface", "state_mutation_footgun", "contract_inconsistency", "citation_mismatch", "template_contract_drift", "duplicated_rule_text", "stale_pointer", "format_contract_drift", "voice_contract_drift", "class-of-bug"],
    "affectedSurfacesSeed": [".skilled/skills/sk-doc/sk-create-goal/", ".skilled/hooks/goal/lib/goal-slice.cjs", ".skilled/hooks/goal/bin/goal.cjs", ".skilled/commands/create/", ".skilled/commands/speckit/assets/", ".skilled/skills/system-spec-kit/references/workflows/goal-set-string-playbook.md", ".skilled/hooks/goal/README.md", ".hermes/skills/"],
    "fixCompletenessRequired": true
  }
}
```

---

## 3. ACTIVE FINDING REGISTRY

| ID | Sev | Dimension | File | Finding | Fix |
|---|---|---|---|---|---|
| R1-P1-001 | P1 | correctness | `sk-create-goal/references/budget-and-handoff.md:33` | "Phase children are exempt from the cap" contradicts `budgetApplies()` at `goal-slice.cjs:380-382`, which measures a phase child that is itself a phase parent or declares the phase level. Restated in `SKILL.md`, the child template, the mode README, the set-string playbook, both create-goal YAMLs and three speckit YAMLs | State the real boundary once in section 2 and point the restatements at it |
| R2-P1-002 | P1 | security | `hooks/goal/lib/goal-slice.cjs:24-25` | The leading-comment group in `FRONTMATTER_PATTERN` and `FRONTMATTER_OPENER_PATTERN` backtracks exponentially on a fence-less file that opens with many comments. MiMo measured 28 comments at 3.3 s, and the orchestrator reproduced the growth (20 comments 5 ms, 22 comments 17 ms). The pattern runs on every hook render | Match a comment body that cannot span `-->` |
| R2-P1-001 → P2 | P2 | security | `hooks/goal/lib/goal-slice.cjs:24` | A bare `---` line inside frontmatter ends it early, so the rest reaches the durable and chat slices. Downgraded: it needs frontmatter that is not valid YAML, which no template or operation writes | Forbid the line in the authoring rules and make `check-goal.cjs` flag text between the closing fence and the first heading |
| R1-P2-002 | P2 | correctness | `sk-create-goal/scripts/check-goal.cjs:339` | The parent-budget check skips every phase child, so it passes a nested phase parent that `goal.cjs packet` reports over | Use the same three-condition test as `budgetApplies()` |
| R1-P2-003 | P2 | correctness | `hooks/goal/bin/goal.cjs:388` | An unknown token such as `--help` falls through to `set`, and every failure exits 0 | Refuse a leading `-` token as an unknown action and set a non-zero exit on failure |
| R1-P2-004 | P2 | correctness | `commands/create/assets/create-goal-presentation.txt:108` | The report line renders `/4000` for exempt children, and the handoff lines omit the `packet_budget=ok` gate | Drop the fixed denominator and add the send gate to both handoff lines |
| R1-P2-005 | P2 | traceability | `sk-create-goal/references/budget-and-handoff.md:87` | The Devin row cites goal-plugin line 170, which documents the shared CLI | Cite lines 158 and 162 to 168 |
| R2-P2-003 | P2 | security | `hooks/goal/lib/goal-slice.cjs:252` | `resolvePacketDir` judges containment lexically when the target does not exist yet | Resolve the deepest existing ancestor and judge on its real path |
| R2-P2-004 | P2 | security | `commands/create/assets/create-goal-auto.yaml:103` | `packet_path` accepts any existing directory, with no workspace containment | Require a spec packet directory whose real path stays inside the workspace, in both YAMLs |
| R2-P2-005 | P2 | security | `commands/create/assets/create-goal-auto.yaml:14` | No rule says packet and goal prose are data, never instructions | Add that rule to both YAMLs and the command |
| R2-P2-006 | P2 | security | `hooks/goal/lib/goal-slice.cjs:207` | `renderResendReminderText` interpolates `packetPath` and `recordCommand` unescaped into a model-facing line | Collapse line breaks and strip a leading bracket from both values |
| R3-P2-001 | P2 | traceability | `012-goal-send-and-dedupe/acceptance-criteria.md:77` | AC-019 cites `README.md:988`, but the claim sits at `README.md:990` | Correct the line number |
| R3-P2-002 | P2 | traceability | `.hermes/skills/sk-create-goal/SKILL.md:57` | The generated Hermes copies keep relative links that resolve to nothing from `.hermes/skills/` | Rewrite relative links to repository-root paths in the generator |
| R4-P2-001 | P2 | maintainability | `sk-create-goal/references/authoring-standards.md:10` | `contextType: reference` is outside the four-value enum in seven files | Use an enum value |
| R4-P2-002 | P2 | maintainability | `sk-create-goal/SKILL.md:108` | `SKILL.md` restates the cut order and has lost step 3 | Point to section 3 |
| R4-P2-003 | P2 | maintainability | `sk-create-goal/README.md:183` | The release-notes row names only `v1.0.0.0.md` | Point the row at the changelog directory |
| R4-P2-004 | P2 | maintainability | `sk-create-goal/changelog/v1.0.0.0.md:12` | The first changelog uses an older shape with no Upgrade section | Bring it to the compact shape |
| R4-P2-005 | P2 | maintainability | `manual-testing-playbook/goal-authoring/route-session-goal-away.md:29` | SCG-007's Real user request repeats the prompt, `$SCRATCH` included | Write a natural-human request |
| R5-P2-001 | P2 | traceability | `manual-testing-playbook/goal-authoring/cut-over-budget-parent.md:60` | SCG-004 grades a five-step cut order that skips canonical step 3 | Renumber to the canonical steps and add step 3 |
| R5-P2-002 | P2 | traceability | `manual-testing-playbook/goal-authoring/refuse-leftover-placeholder.md:83` | SCG-005 seeds `goal.md.tmpl` placeholder text that `/create:goal` never copies | Seed the top-level asset template's wording |
| R5-P2-003 | P2 | traceability | `hooks/goal/README.md:65` | The hooks README calls the bind-time projection "operator copy", the name the mode reserves for legacy text to delete | Name it the objective slice and point to section 4 |

Every P0 and P1 carries a typed claim-adjudication packet in its iteration delta. Each iteration's `claim_adjudication` ledger event records `passed: true`.

---

## 4. REMEDIATION WORKSTREAMS

1. **WS1 budget boundary (P1).** R1-P1-001, R1-P2-002, R1-P2-004. One boundary sentence in `budget-and-handoff.md`, pointers everywhere it is restated, `check-goal.cjs` aligned with `budgetApplies()`, and a test for a nested phase parent.
2. **WS2 frontmatter parsing (P1).** R2-P1-002, R2-P1-001. A linear comment match in `goal-slice.cjs`, a timing test, the no-`---` rule and a `check-goal.cjs` finding for text before the first heading.
3. **WS3 goal CLI and hooks hardening.** R1-P2-003, R2-P2-003, R2-P2-006, each with a test.
4. **WS4 `/create:goal` trust boundary.** R2-P2-004, R2-P2-005.
5. **WS5 sk-doc alignment.** R4-P2-001 to R4-P2-005.
6. **WS6 playbook grading.** R5-P2-001, R5-P2-002.
7. **WS7 cross-repo pointers.** R1-P2-005, R3-P2-001, R3-P2-002, R5-P2-003.

---

## 5. SPEC SEED

- Add remediation requirements to `012-goal-send-and-dedupe/spec.md`, one per workstream, each naming its files and its check.
- Add acceptance criteria with the before and after measurement for each code change.

---

## 6. PLAN SEED

- One exact edit per finding, the owning test suite rerun after each code change, the sk-doc validators rerun after the doc changes.
- Then run SCG-001 to SCG-008 with MiMo v2.6 Pro and record the run in a new dated benchmark folder.

---

## 7. TRACEABILITY STATUS

### Core protocols

| Protocol | Status | Evidence |
|---|---|---|
| `spec_code` | pass with one deferral | Iteration 3 traced REQ-001 to REQ-018 to their files |
| `checklist_evidence` | partial | AC-019 cites the wrong README line (R3-P2-001) |

### Overlay protocols

| Protocol | Status | Evidence |
|---|---|---|
| `skill_agent` | pass | The markdown agent names the mode and its command consistently across `.skilled`, `.claude`, `.codex`, `.pi` and `.hermes` |
| `agent_cross_runtime` | partial | The prompt mirrors are generated wrappers with nothing to drift. The Hermes skill copies carry dead relative links (R3-P2-002) |
| `feature_catalog_code` | not applicable | The mode ships no feature catalog, and the sk-doc hub catalog names it correctly |
| `playbook_capability` | partial | 6 of 8 scenarios fully supported. SCG-004 and SCG-005 carry findings |

AC_COVERAGE: exempt. The target is a skill, not a lifecycle spec folder.

resource-map.md was not present at init, so the coverage gate was skipped.

---

## 8. DEFERRED ITEMS

These are defects in the deep-review tooling, found while running this review. They sit outside the review target, and the review's own run worked around each one.

1. **`deep-review-auto.yaml` `if_cli_pi` drops `reasoningEffort`.** The branch builds `lineage = { kind, model, sandboxMode }`. For a model without a pin, Pi then falls back to its global `xhigh`, a level MiMo does not expose. This run's driver added `reasoningEffort: config.executor.reasoningEffort` to `lineage` and `executor`. Fix: the same field in the YAML branch.
2. **The prompt pack prescribes a record the review gateway refuses.** `prompt-pack-iteration.md.tmpl` tells the leaf to send a raw `{"type":"iteration"}` row to `append-mode-event.cjs`. In review mode that returns `Unrecognized event format`, exit 1. This run recorded each iteration as a `deep_review.dimension_pass_completed` event from the delta's first line.
3. **`step_create_state_log` conflicts with the gateway projection.** A directly written config row makes the first gateway append fail with `Projection replace would drop keys from the existing config row`. This run left the state log to the gateway.
4. **`step_marker_scan` halts every run as written.** Every rendered prompt starts with `DEEP-REVIEW`, so the literal check fires at iteration 2. Precedent runs continued, and so did this one.
5. **The projected state log drops `dimensions`.** The reducer registry therefore shows every dimension as uncovered, though the deltas cover all four.
6. **The upsert wrapper reads stdin with `readFileSync(0)`.** Under a non-blocking stdin that throws `EAGAIN`. It passes with `</dev/null`.

---

## DIMENSION EXPANSION MAP

- Saturated directions: none. No pivots ran, convergence mode `default`.
- Iteration 5 broadened past the four dimensions into `playbook_capability` and a repository-wide sweep, as `stopPolicy=max-iterations` directs.
- Remaining frontier: `encoding_handling` (CRLF and invalid UTF-8 goal files) was deferred by iteration 2 and not re-entered.

---

## SEARCH LEDGER

| Iteration | Coverage mode | Ruled out | Deferred |
|---|---|---|---|
| 1 | graphless fallback | `measurement_error` | none |
| 2 | graphless fallback | `symlink_following`, `regex_injection`, `data_exposure` | `encoding_handling` |
| 3 | graphless fallback | `registry_omission`, `bridge_drift` | `spec_mismatch` |
| 4 | graphless fallback | `prompt_desync`, `rcaf_misuse`, `version_drift` | `advisor_contexttype_acceptance` |
| 5 | graphless fallback | `stale_pointer` | none |

hasSearchDebt: false. The reducer's `searchDebt` is empty.

---

## AUDIT APPENDIX

### Convergence

| Iteration | Focus | New ratio | P0/P1/P2 | Graph decision before dispatch |
|---|---|---|---|---|
| 1 | correctness | 1.00 | 0/1/4 | STOP_BLOCKED 0.40 |
| 2 | security | 0.61 | 0/2/4 | STOP_BLOCKED 0.61 |
| 3 | traceability | 0.08 | 0/0/2 | STOP_BLOCKED 0.62 |
| 4 | maintainability | 0.17 | 0/0/5 | STOP_BLOCKED 0.74 |
| 5 | traceability, broadened | 0.09 | 0/0/3 | STOP_BLOCKED 0.78 |

Stop reason: `maxIterationsReached`. Dimension coverage: 4 of 4, from the deltas.

### Adversarial self-check on P0 and P1

| Finding | Hunter | Skeptic | Referee |
|---|---|---|---|
| R1-P1-001 | Re-read `budget-and-handoff.md:33` and `goal-slice.cjs:380-382`. Confirmed | Could exemption be the intended rule and the code wrong? The code's three conditions are deliberate and mirrored in the validator | Confirmed P1 |
| R2-P1-002 | Reproduced in memory: growth about 3.4 times per two added comments | Needs comments stacked at the very start of a file with no fence | Confirmed P1. The pattern runs on every hook render, so one corrupted file stalls every prompt |
| R2-P1-001 | Reproduced: the first `---` closes the block | A `---` line inside YAML frontmatter is a document separator, so the block is malformed, and every frontmatter parser closes at the first fence | Downgraded to P2 |

### Containment advisories

Iterations 2, 3 and 5 reported out-of-scope paths under packet `system-skill-advisor/030` and the cli-cursor docs. Another session was scaffolding in the same checkout at the time: its new phase `030/008-cross-cli-manual-testing` and edits to `fanout-run.cjs`. Every leaf reported writes only to its three allowed paths, and the containment mode was `preserve`, so nothing was reverted.

### Sources reviewed

The 89 scope files in `deep-review-config.json`, plus 35 files the iteration 5 sweep read outside scope. Per-iteration lists are in `iterations/iteration-001.md` to `iteration-005.md`.

---

## REMEDIATION STATUS

Added after synthesis, once the operator chose "Fix findings, then playbook". The sections above are the review's record and stay as synthesized. The phase 012 acceptance criteria AC-024 to AC-034 hold the before and after measurements.

| ID | Status | Fix | Evidence |
|---|---|---|---|
| R1-P1-001 | Fixed | Section 2 of `budget-and-handoff.md` states the boundary once. Fifteen restatements now point there or match it, including one in system-spec-kit's README that the producer sweep found | AC-024 |
| R2-P1-002 | Fixed | A comment body cannot cross `-->`, so each comment matches one way only | AC-025: 2,000 comments in under 250 ms, HEAD 12,568 ms for 26 |
| R2-P1-001 | Fixed | `check-goal.cjs` gained a fifth check, `frontmatter-fence`, and the authoring standards forbid an inner fence | AC-025 |
| R1-P2-002 | Fixed | The budget check calls the exported `budgetApplies()` | AC-024 |
| R1-P2-003 | Fixed | A leading flag no action owns fails with `UNKNOWN_ACTION`, `--budget` excepted, and every failure exits 1 | AC-026 |
| R1-P2-004 | Fixed | The report line drops `/4000`, and both handoff lines carry the `packet_budget=ok` gate | `create-goal-presentation.txt` |
| R1-P2-005 | Fixed | The Devin row cites goal-plugin lines 158 and 162 to 168 | AC-030 |
| R2-P2-003 | Fixed | A missing path is judged by the real path of its deepest existing ancestor | AC-026 |
| R2-P2-004 | Fixed | `packet_path` must be a spec packet whose real path stays inside its workspace, in both YAMLs and the router | AC-027 |
| R2-P2-005 | Fixed | Both YAMLs and the router say packet prose is data, never instructions | AC-027 |
| R2-P2-006 | Fixed | Both values are collapsed to one line. A leading bracket is left alone, because neither value can start a line once the line breaks are gone | AC-026 |
| R3-P2-001 | Fixed | AC-019 cites `README.md:990` | AC-030 |
| R3-P2-002 | Fixed | `sync-skills-hermes.cjs` rewrites each relative link to the path that reaches the same canonical file from `.hermes/skills/`. Copies built from committed or this phase's sources were regenerated first, and the cli-cursor and deep-review copies followed once their owners committed those sources | AC-034: 530 broken links at HEAD, 0 now |
| R4-P2-001 | Fixed | References use `implementation` and assets use `general`, as the sibling modes do | AC-028 |
| R4-P2-002 | Fixed | `SKILL.md` step 6 points to sections 2 and 3 instead of restating the cut order | AC-024 |
| R4-P2-003 | Fixed | The README row points at `changelog/` | AC-028 |
| R4-P2-004 | Fixed | `v1.0.0.0.md` has the compact shape with `## Upgrade` | AC-028 |
| R4-P2-005 | Fixed | SCG-007's real user request reads as a person would say it | AC-028 |
| R5-P2-001 | Fixed | SCG-004 runs all six cut steps in order, step 3 included | AC-029 |
| R5-P2-002 | Fixed | SCG-005 seeds the top-level asset template's decision placeholder | AC-029 |
| R5-P2-003 | Fixed | The hooks README, the goal plugin doc and two core comments name the objective slice | AC-030 |
