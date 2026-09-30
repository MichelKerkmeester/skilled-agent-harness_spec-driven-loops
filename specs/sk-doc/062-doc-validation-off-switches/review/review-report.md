# Deep Review Report: Doc Validation Off Switches and the Changelog Work (Two-Model Fan-Out)

Target: the 127 files in `../goal-file-manifest.txt`. They cover packet 062 (the two validation off switches, the four readers of `hook-flags.env` and the 20 guarded sk-doc validators), packet 061's changelog work (the release-line split, changelog findability and the adjacent alignment, which includes the changelog validator) and both packets' docs. The runner pins `review_target` to this spec folder, so the manifest carried the wider scope.
Lineages: `luna` (GPT-6 LUNA, `max` effort, `fast` tier, through cli-codex) and `deepseek` (DeepSeek V4.1 Flash Max, through cli-devin), five iterations each, stop policy `max-iterations`. Per-lineage reports: `lineages/luna/review-report.md` and `lineages/deepseek/review-report.md`.

<!-- ANCHOR:review-dimensions -->
Dimensions reviewed: correctness, security, traceability, maintainability
<!-- /ANCHOR:review-dimensions -->

---

## 1. Executive Summary

- **Verdict: CONDITIONAL**, `hasAdvisories: false`. The flag applies only to a PASS.
- Active findings after dedup and the adversarial self-check: **P0 0, P1 1, P2 7**. The merged registry holds nine entries. P2-LUNA-004 and F001 are the same defect, found by both lineages on their own, and count once.
- The P1 (P1-LUNA-002): with `SPECKIT_SKIP_VALIDATION` on, `progressive-validate.sh --json --level 1` prints the skip notice ahead of the JSON, so its stdout does not parse. REQ-005 promises valid JSON from a skipped run. The plan lists the wrapper as "Passes the output through" and "Unchanged", but the wrapper captures stderr together with stdout. At the default level the JSON parses, but it drops `skipped` and says `passed: true`.
- Both lineages ran five iterations and closed with `synthesis_complete`, stop reason `maxIterationsReached`. Dimension coverage is 4 of 4 in each. Release readiness is `converged`: no P0 is active, and neither lineage found a new P0 or P1 in its last two iterations. LUNA's own close said `release-blocking`, which the review contract keeps for an active P0.
- Coverage: the lineages' iteration records name 39 of the 127 manifest files. Packet 062 is covered in full: its five docs, all four readers, the skip producer and its direct consumers. Packet 061's changelog work is not. The lineages read 2 of the 18 create-changelog workflow files, 2 of the 17 packet 061 docs and 2 of the 16 changelog entries. Neither read the create-changelog YAMLs, `sk-create-changelog/SKILL.md`, its template, the release-line playbook scenarios, `test_changelog_validator.py` or `nested-changelog.ts`. The verdict speaks for 062 and says little about 061.
- The orchestrator re-checked all eight distinct findings during synthesis, three of them by running the code (see the Checked column).

---

## 2. Planning Trigger

`/speckit:plan` is required, because one P1 is active. Its fix is small: keep stderr out of the wrapper's two JSON captures, carry `skipped` into its aggregate report and add a wrapper test. The seven P2 items fall into three advisory workstreams that can ride the same change or wait.

Planning Packet:

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": [
    { "id": "P1-LUNA-002", "severity": "P1", "title": "Progressive JSON mode merges the skip notice into stdout", "file": ".skilled/skills/system-spec-kit/runtime/cli/spec/progressive-validate.sh", "line": 266 },
    { "id": "F001", "severity": "P2", "title": "Shell truthy check deletes internal whitespace", "file": ".skilled/hooks/shared/hook-flags.sh", "line": 26, "duplicates": ["P2-LUNA-004"] },
    { "id": "P2-LUNA-001", "severity": "P2", "title": "An environment value equal to the shell's absence marker falls through to the file", "file": ".skilled/hooks/shared/hook-flags.sh", "line": 38 },
    { "id": "P2-LUNA-005", "severity": "P2", "title": "A switch on a BOM-prefixed first line counts in two readers only", "file": ".skilled/hooks/shared/hook-flags.sh", "line": 44 },
    { "id": "P2-LUNA-003", "severity": "P2", "title": "Local audit consumers report a skipped run as a pass", "file": ".skilled/skills/system-spec-kit/runtime/cli/sweep/strict-pass-freshness.ts", "line": 257 },
    { "id": "F002", "severity": "P2", "title": ".env.example omits the two validation switches", "file": ".env.example", "line": 399 },
    { "id": "F003", "severity": "P2", "title": "The v4.0.0.2 release entry does not mention the switches", "file": ".skilled/changelog/skilled/v4.0.0.2.md", "line": null },
    { "id": "F004", "severity": "P2", "title": "hooks/README.md states the comment rule without the tab case", "file": ".skilled/hooks/README.md", "line": 71 }
  ],
  "remediationWorkstreams": [
    "WS-A (P1): keep stderr out of the progressive wrapper's JSON and carry skipped into its report - P1-LUNA-002",
    "WS-B (P2): shell reader parity in hook-flags.sh - F001 with P2-LUNA-004, P2-LUNA-001, P2-LUNA-005",
    "WS-C (P2): a skipped status in the local audit consumers - P2-LUNA-003",
    "WS-D (P2): the user-facing docs name both switches - F002, F003, F004"
  ],
  "specSeed": [
    "State that REQ-005's valid-JSON promise covers progressive-validate.sh --json, including a skipped field in its aggregate report.",
    "Pin REQ-002's precedence on whether the variable is set, not on a marker value, and state that only surrounding whitespace is trimmed.",
    "Either extend REQ-008 to a byte order mark on the first line or carve that case out of it."
  ],
  "planSeed": [
    "WS-A: capture stderr apart from stdout at progressive-validate.sh:266-268 and :494, add skipped to generate_json_report, and test --json at level 1 and at the default level with the switch on.",
    "WS-B: trim only the edges in __hook_flags_truthy, test presence with ${NAME+x} in __hook_flags_resolve, and add internal-whitespace, marker-literal and BOM rows to the four-reader test.",
    "WS-C: report a skip as its own status in quality-audit.sh and strict-pass-freshness.ts.",
    "WS-D: add both switches to .env.example, cover them in the v4.0.0.2 entry before it is tagged, and say 'space or tab' in hooks/README.md:71."
  ],
  "findingClasses": ["cross-consumer", "algorithmic", "instance-only"],
  "affectedSurfacesSeed": [
    ".skilled/skills/system-spec-kit/runtime/cli/spec/progressive-validate.sh",
    ".skilled/skills/system-spec-kit/runtime/cli/spec/quality-audit.sh",
    ".skilled/skills/system-spec-kit/runtime/cli/sweep/strict-pass-freshness.ts",
    ".skilled/hooks/shared/hook-flags.sh",
    ".skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh",
    ".skilled/hooks/shared/hook-flags.test.cjs",
    ".env.example",
    ".skilled/changelog/skilled/v4.0.0.2.md",
    ".skilled/hooks/README.md"
  ],
  "fixCompletenessRequired": true
}
```

---

## 3. Active Finding Registry

"Checked" says how the orchestrator re-verified the claim during synthesis. Paths under `runtime/` are in `.skilled/skills/system-spec-kit/`.

| ID | Sev | Dimension | Title | File:line | Evidence | Fix | Lineage | Checked | Disposition |
|----|-----|-----------|-------|-----------|----------|-----|---------|---------|-------------|
| P1-LUNA-002 | P1 | traceability | Progressive JSON mode merges the skip notice into stdout | `runtime/cli/spec/progressive-validate.sh:262-274`, `:494`, `:610-672` | JSON mode captures `validate.sh` with `2>&1` and prints the capture when level 1 is final. `generate_json_report` sets `passed` from the exit code alone (`:611-613`) and has no `skipped` field | Capture stderr apart, carry `skipped`, test both paths | luna | Yes, ran it. At `--level 1` stdout opens with `Validation skipped: SPECKIT_SKIP_VALIDATION is on in the environment`, then the JSON, and does not parse. At the default level it parses with `passed: true` and no `skipped` | active, cross-consumer, kept at P1 by the self-check in section 7 |
| F001 | P2 | correctness | Shell truthy check deletes internal whitespace | `.skilled/hooks/shared/hook-flags.sh:26` | `tr -d '[:space:]'` runs before the truthy match. `hook-flags.cjs:93-96` and `validation_switch.py:43-45` trim only the edges | Trim the edges only, add an internal-whitespace row | deepseek, and luna as P2-LUNA-004 | Yes, ran it. `o n` reads on in the shell reader and off in `hook-flags.cjs` and `validation_switch.py` | active. The line dates from 2026-08-14, before 062, but 062's `hook_flag_on` goes through it |
| P2-LUNA-004 | P2 | maintainability | Shell truthiness removes internal whitespace | `.skilled/hooks/shared/hook-flags.sh:25-29` | Same defect as F001 | As F001 | luna | As F001 | duplicate of F001 |
| P2-LUNA-001 | P2 | correctness | An environment value equal to the shell's absence marker falls through to the file | `.skilled/hooks/shared/hook-flags.sh:38-39` | The resolver substitutes `__HF_UNSET__` for an unset variable and compares against it, so a set value equal to the marker reads as unset. REQ-002 says any set value wins | Test presence with `${NAME+x}` | luna | Yes, ran it. `__HF_UNSET__` in the environment and `1` in the file reads on in the shell reader and off in `hook-flags.cjs`. The `0` control stays off | active. No real value collides with the marker, so the practical effect is nil |
| P2-LUNA-005 | P2 | maintainability | A switch on a BOM-prefixed first line counts in two readers only | `.skilled/hooks/shared/hook-flags.sh:44`, `.skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh:35-50` | `hook-flags.cjs` and `validation_switch.py` drop a leading byte order mark. The shell and dist readers keep it on the first key. REQ-008 (`spec.md:141`) says the four readers "return the same value for every line" | Align the readers or narrow REQ-008, then test all four | luna | Yes, read REQ-008 and limitation 5 of `implementation-summary.md` | active. The summary discloses it as older than 062, but REQ-008's wording still claims it |
| P2-LUNA-003 | P2 | traceability | Local audit consumers report a skipped run as a pass | `runtime/cli/spec/quality-audit.sh:126-132`, `runtime/cli/sweep/strict-pass-freshness.ts:257-272` | `quality-audit.sh` counts exit 0 as a pass. `strict-pass-freshness.ts` fails a folder only on a nonzero exit or `passed === false`, so a skip returns `status: 'pass'` | Report a skip as its own status | luna | Yes, read the lines | active. Already disclosed: the plan's table says `strict-pass-freshness.ts` "counts a skip as a pass" |
| F002 | P2 | maintainability | `.env.example` omits the two validation switches | `.env.example:399-404` | The file lists the sibling git-hook bypasses and names `hook-flags.env` in its kill-switch section. Neither switch appears anywhere in it | Add both lines beside the other bypasses | deepseek | Yes, searched the file: no hit for either name | active. The root `.env.example` is a user-facing env reference |
| F003 | P2 | traceability | The v4.0.0.2 release entry does not mention the switches | `.skilled/changelog/skilled/v4.0.0.2.md` | The switches landed before the entry's last commit (`47432cf846`, 14:19 +0200). The entry has no section for them, and no `v4.0.0.2` tag exists | Cover them before tagging, or record the deferral | deepseek | Yes, searched the entry and ran `git tag -l v4.0.0.2` | active |
| F004 | P2 | maintainability | `hooks/README.md` states the comment rule without the tab case | `.skilled/hooks/README.md:71` | "A comment can follow a value after a space". The code and every other description say "space or tab" | Say "after a space or tab" | deepseek | Yes, read the line | active |

---

## 4. Remediation Workstreams

P1 first, then the P2 advisories:

1. **WS-A (P1)** P1-LUNA-002. Capture stderr apart from stdout at `progressive-validate.sh:266-268` and `:494`, add `skipped` to `generate_json_report` and test `--json` at level 1 and at the default level with the switch on.
2. **WS-B (P2)** F001 with P2-LUNA-004, P2-LUNA-001 and P2-LUNA-005. Make the shell reader agree with the Node and Python readers: trim only the edges, test whether the variable is set rather than comparing with a marker, and settle the byte order mark. Add the three cases to the four-reader table in `hook-flags.test.cjs`.
3. **WS-C (P2)** P2-LUNA-003. Give `quality-audit.sh` and `strict-pass-freshness.ts` a skipped status, so a local opt-out cannot read as a pass.
4. **WS-D (P2)** F002, F003 and F004. Name both switches in `.env.example`, cover them in the v4.0.0.2 entry before it is tagged and fix the README sentence.

---

## 5. Spec Seed

- REQ-005 covers `progressive-validate.sh --json`, at level 1 and at the aggregate levels, and a skipped run carries `skipped: true` through the wrapper.
- REQ-002 decides precedence by whether the variable is set, and the readers trim only surrounding whitespace.
- REQ-008 either includes a byte order mark on the first line or says it does not.
- A local audit that finds the switch on reports the folder as skipped, not passed.

---

## 6. Plan Seed

1. WS-A: split the two `2>&1` captures in `progressive-validate.sh`, carry `skipped` into `generate_json_report` and add two wrapper tests with the switch on.
2. WS-B: edge-only trim and a presence test in `hook-flags.sh`, plus internal-whitespace, marker-literal and byte order mark rows in the four-reader test.
3. WS-C: a skipped status in `quality-audit.sh` and `strict-pass-freshness.ts`.
4. WS-D: the `.env.example` lines, a v4.0.0.2 section and the README wording.

---

## 7. Traceability Status

**Core protocols**

| Protocol | Status | Evidence |
|----------|--------|----------|
| spec_code | partial | Both lineages traced REQ-001 to REQ-008 to shipped behavior. Two gaps remain: REQ-005 on the progressive wrapper (P1-LUNA-002) and REQ-008's byte order mark case (P2-LUNA-005) |
| checklist_evidence | partial | Neither lineage re-ran the suites the packet cites, because lineage containment forbids writes outside the lineage folder. The orchestrator re-ran targeted probes, not the suites. No row failed |

**Overlay protocols**

| Protocol | Status | Evidence |
|----------|--------|----------|
| feature_catalog_code | pass | DeepSeek matched the spec-validation rule-engine entry and the changelog frontmatter check to the code. LUNA matched the rule-engine entry |
| playbook_capability | pass | DeepSeek checked scenarios CHG-011 and 458 against the code. LUNA marked the protocol not applicable |
| skill_agent | n/a | Spec-folder target, no agent contract changed |
| agent_cross_runtime | n/a | Spec-folder target |

**AC_COVERAGE**: exempt. 062 is Level 2 and has no `checklist.md`.

**Adversarial self-check of the one P1 (P1-LUNA-002)**

- Hunter: `progressive-validate.sh:262-274` captures `validate.sh` with `2>&1` in JSON mode and prints the capture when level 1 is final. `validate.sh:142-172` writes the notice to stderr and the report to stdout. With the switch on, `--level 1 --json` printed `Validation skipped: SPECKIT_SKIP_VALIDATION is on in the environment` as the first line of stdout, then the JSON, so the output does not parse. The same capture at `:494` feeds the level-3 suggestion parser.
- Skeptic: outside its tests and a manual playbook scenario, nothing in the repository calls the wrapper, and one of its test suites already pulls the report out of mixed output (`runtime/tests/progressive-validation.vitest.ts:213`). The merged capture is older than 062. It was harmless while `validate.sh --json` wrote nothing to stderr.
- Referee: kept at P1. REQ-005 (`spec.md:138`) promises valid JSON on stdout from a skipped run that asked for JSON. The wrapper is in the plan's affected-surface table (`plan.md:82`), and the table's claim that it passes the output through is false. 062's skip notice is the first stderr output on that path. The narrow reach argues for a small fix, not for a lower severity.

**Resource Map Coverage Gate**: skipped. 062 has no `resource-map.md`, so `resource_map_present` is false. Separately, `reduce-state.cjs --emit-resource-map` exits 3 at a fan-out root, because the root has no `deep-review-state.jsonl`. That was checked on a scratch copy of this folder, which the reducer left unchanged. Each lineage emitted its own `resource-map.md`.

---

## 8. Deferred Items

- **Packet 061's changelog work needs its own review.** Neither lineage read these manifest files:
  - `.skilled/commands/create/assets/create-changelog-auto.yaml` and `create-changelog-confirm.yaml`
  - `.skilled/skills/sk-doc/sk-create-changelog/SKILL.md`, its `README.md`, `assets/changelog-template.md` and the three files in `references/`
  - the playbook scenarios `release-line/route-skilled-release-entry.md`, `release-line/skip-release-for-component.md`, `release-line/never-infer-release-line.md` and `topology/route-global-component.md`
  - `.skilled/skills/sk-doc/scripts/tests/test_changelog_validator.py`
  - `runtime/cli/spec-folder/nested-changelog.ts` with its vitest, and the two retrieval tests `retrieval-coverage-parity.vitest.ts` and `retrieval-repo-root.vitest.ts`
  - 14 of the 16 changelog entries and 15 of the 17 packet 061 docs
- **Several of the 20 guarded validators** were verified by DeepSeek's guard-placement sweep rather than read in full.
- **Follow-ups the packet already records**, which DeepSeek confirmed as described: the dead `SPECKIT_SKIP_DOC_MODEL_VALIDATE` mentions in `.skilled/scripts/install-git-hooks.sh`, `.skilled/scripts/git-hooks/README.md` and `.skilled/scripts/git-hooks/tests/pre-commit.test.sh`, and the byte order mark asymmetry, which this review files as P2-LUNA-005.
- **The suite counts** in `tasks.md` and `implementation-summary.md` were not re-derived by either lineage.

---

## Dimension Expansion Map

Neither lineage recorded a divergence pivot, Council artifact or reducer-owned override. Convergence mode was `default`. Each lineage ran correctness, security, traceability and maintainability once, then a fifth pass across all four: DeepSeek's widened the scope, and LUNA's replayed its findings against the source. LUNA's report records one override in prose: the plan calls the progressive wrapper unchanged, and its recheck kept the P1. The remaining frontier is packet 061's changelog work, listed in section 8.

---

## 9. Search Ledger

*No search-depth state captured at the fan-out root.* DeepSeek recorded no search-depth state (a legacy v1 record). LUNA recorded search debt: it did not reread the 127 manifest paths one by one, and it sampled 061. `hasSearchDebt: true`, which on its own terms keeps the verdict at CONDITIONAL.

Ruled out across both lineages:

- Shell injection through `hook_flag_on`, because the name check runs before `eval` (`hook-flags.sh:51-59`).
- Config values run as shell code. All four readers parse the file as text.
- CI setting either switch or `HOOK_FLAGS_CONFIG`. A search under `.github` found none of the four names.
- An interaction between 061's changelog type detection and 062's guard in `validate_document.py`.

---

## 10. Audit Appendix

**Convergence**: stop reason `maxIterationsReached` in both lineages, as the `max-iterations` stop policy requires. New-finding ratios: deepseek 1.0, 1.0, 1.0, 1.0, 0.0. luna 1.0, 0.0, 0.857, 0.222, 0.0. Attribution convergence scores: deepseek 0.25, luna 0.

**Coverage**: 4 of 4 dimensions in each lineage. The iteration records name 39 of the 127 manifest files: deepseek 37, luna 18, both 16. DeepSeek's report puts its reads at about 45, counting its sweeps. By area: 062 docs 5 of 5, code and tests 16 of 36, other docs and metadata 12 of 35, create-changelog workflow 2 of 18, 061 docs 2 of 17, changelog entries 2 of 16. LUNA also read three consumers outside the manifest: `progressive-validate.sh`, `quality-audit.sh` and `strict-pass-freshness.ts`.

**Process notes**

- LUNA's first attempt, 12:22 to 12:45Z, wrote nothing. Every append-gateway call it made passed a mistyped event path (`/Users/michelkerkme/...`, the home folder's name cut short). The gateway answered ENOENT, and LUNA stopped rather than write state around the gateway. The runner scored the failure `salvage_miss`, transient, and retried. Attempt 2 ran 12:45 to 13:14Z and completed.
- Neither lineage wrote its state through the append gateway. The fan-out prompt tells a lineage to write the iteration file, delta and state record directly into its lineage folder, while the deep-review skill names the gateway as the single state writer. The ledger frames in each lineage folder are the runner's own.
- LUNA's iteration 1 cites `.skilled/skills/sk-doc/scripts/tests/validate-skip-switch.vitest.ts`. The file is `runtime/cli/tests/validate-skip-switch.vitest.ts`. P2-LUNA-001 does not rest on it.
- `fanout-merge.cjs` prints `active_p0` and `active_p1` but no `active_p2`, which the workflow binds from its output. The P2 count here is the merged registry's `activeP2`, 8, less the one duplicate.
- The runner's stall watchdog fired twice on LUNA, and both times its codex session was still writing. The two containment advisories on LUNA listed 23, then 10, out-of-scope paths from another session's evidence folder. All were preserved and none reverted.
- After the run, the runner's metadata refresh (`generate-description.js`, 13:14:31Z) rewrote this packet's `description.json`: the description became `` `SPECKITSKIPVALIDATION` exists but traps commits `` and the keywords lost `doc`, `validation` and `switches`. The review treats its target as read-only, so the orchestrator restored the committed file.
- The close-out recorded `synthesis_incomplete`, a warning, not `synthesis_complete`. Its one failed check, `structured_state_findings_partially_reflected_in_registry`, compares the registry's 9 entries with 24 finding mentions in the lineage state logs. Both fifth passes re-state earlier findings, and the 24 mentions carry exactly the registry's 9 IDs (`missingStructuredFindingCount: 0`). The check counts mentions where it should count unique findings (`synthesis-closeout.cjs:309`, `:328`).
- The workflow's event folder for the close-out went in the session scratchpad, not `/tmp`, and the review folder was not staged with `git add`. The index is shared with other sessions, and a bare commit from one of them would sweep staged files into its own commit.

**Cross-reference appendix**

- Core Protocols: `spec_code` partial, `checklist_evidence` partial.
- Overlay Protocols: `feature_catalog_code` pass, `playbook_capability` pass, `skill_agent` n/a, `agent_cross_runtime` n/a.

**Sources**: `lineages/*/iterations/iteration-00{1..5}.md`, `lineages/*/deep-review-state.jsonl`, `lineages/*/review-report.md`, `deep-review-findings-registry.json`, `fanout-attribution.md`, `orchestration-summary.json`, `orchestration-status.log`.
