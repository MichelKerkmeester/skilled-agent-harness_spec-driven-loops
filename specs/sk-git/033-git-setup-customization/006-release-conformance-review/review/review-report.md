# Deep Review Report: v4.0.0.11 release conformance (/doctor:git setup)

<!-- ANCHOR:deep-review-v4-0-0-11-release-conformance -->

## 1. Executive Summary

- **Verdict: CONDITIONAL.** hasAdvisories: true.
- **Active findings, deduplicated across lineages: P0 0, P1 1, P2 24.** The merged registry (`deep-review-findings-registry.json`, from `fanout-merge.cjs`) carries the raw per-lineage counts P0 0, P1 2, P2 28. Five findings were reported by both lineages and count once here.
- **Scope:** the 27 files in `../goal-file-manifest.txt`: the setup-check script and its test, the gate-inputs workflow, script and test, the `/doctor:git` router, YAML, presentation and routes, the sk-git skill docs, playbook, catalog and hooks README, the cross-repo indexes and both changelogs.
- **Lineages:** `luna-max-fast` (cli-codex, gpt-6-luna, max effort, fast tier) and `deepseek-max` (cli-pi, deepseek-v4.1-flash, max thinking). Each completed 5 of 5 iterations under `stop_policy=max-iterations`. Both exited 0.
- **What passed:** the setup battery runs clean against this repo (`STATUS=OK checks=11`), its test suite passes 44/44, `check-gate-inputs.sh` passes (`failures=0`) and its fixture suite passes 50/50. Every repo surface that lists `/doctor:git` targets names `setup`. The one enumeration without it, `.skilled/commands/doctor/git.md:59`, is the `--dry-run` flag table, where only the write targets belong.

## 2. Planning Trigger

`/speckit:plan` is required: one active P1 blocks a clean release-conformance verdict.

```json
{
  "label": "Planning Packet",
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": true,
  "activeFindings": { "P0": 0, "P1": 1, "P2": 24 },
  "remediationWorkstreams": ["WS-1 sk-git SKILL.md size and stale claims", "WS-2 HVR punctuation pass", "WS-3 doc accuracy and index drift", "WS-4 setup-check hardening", "WS-5 command router conformance"],
  "specSeed": "Bring the v4.0.0.11 /doctor:git setup surfaces into conformance with their sk-doc authoring modes",
  "planSeed": "Trim sk-git SKILL.md under 5,000 words first, then the documentation and HVR passes, then the two setup-check hardening items",
  "findingClasses": ["packaging-validation", "documentation-drift", "hvr-punctuation", "command-authoring", "diagnostic-correctness"],
  "affectedSurfacesSeed": [".skilled/skills/sk-git/SKILL.md", ".skilled/skills/sk-git/README.md", ".skilled/skills/sk-git/manual-testing-playbook/manual-testing-playbook.md", ".skilled/skills/sk-git/feature-catalog/feature-catalog.md", ".skilled/commands/doctor/git.md", ".skilled/commands/doctor/assets/doctor-git-presentation.txt", ".skilled/commands/doctor/scripts/git-setup-check.cjs", "README.md"],
  "fixCompletenessRequired": true
}
```

## 3. Active Finding Registry

Lineage key: L = luna-max-fast, D = deepseek-max. Iteration numbers follow the lineage's own sequence.

### P1

| ID | Title | Dimension | file:line | Lineages | Failure case |
|----|-------|-----------|-----------|----------|--------------|
| F-01 | sk-git SKILL.md exceeds the skill package word limit | standards conformance | `.skilled/skills/sk-git/SKILL.md:1` | L3, D3 | `python3 .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py .skilled/skills/sk-git --check` prints `SKILL.md exceeds word limit (5038 words, max: 5000)` and `Result: FAIL`. The skill's own README states the same command reports `PASS` (`.skilled/skills/sk-git/README.md:271`). A maintainer running the documented release check gets a failure. Re-verified in synthesis. |

### P2

| ID | Title | file:line | Lineages | Failure case |
|----|-------|-----------|----------|--------------|
| F-02 | Allowlist row reports PASS when the bash probe could not run | `.skilled/commands/doctor/scripts/git-setup-check.cjs:504` | D1 | A spawn failure (`result.error`) is mapped into a detail string on a passing row, so an unrunnable probe reads as a pass. |
| F-03 | Hook check accepts an installed target without confirming it is executable | `.skilled/commands/doctor/scripts/git-setup-check.cjs:351` | L1 | Presence and resolved path are checked (351, 355, 361), but not `+x`, which the installer sets (`.skilled/scripts/install-git-hooks.sh:180`). A non-executable hook passes. |
| F-04 | OpenCode and Pi hook checks can mistake matching text for a registered handler | `.skilled/commands/doctor/scripts/git-setup-check.cjs:891` | L1 | A textual token match marks the hook `registered`. A file holding both tokens without registering passes, and no test covers that case. |
| F-05 | `/doctor:git` description exceeds the 110-character target | `.skilled/commands/doctor/git.md:2` | L2, D2 | `validate_document.py --type command` reports `command_description_over_soft_target` at 133 characters. |
| F-06 | Presentation asset carries hard HVR semicolon blockers | `.skilled/commands/doctor/assets/doctor-git-presentation.txt:262` | L2, D2 | Four semicolons in the visible next-step prose at lines 262 to 264. |
| F-07 | Required-input gate does not bind the documented `--target` alias | `.skilled/commands/doctor/git.md:16` | L2 | The gate binds only a positional target, so `--target setup` (listed at line 62) falls to the startup menu. |
| F-08 | Mandatory input gate appears after other command content | `.skilled/commands/doctor/git.md:6` | L2 | A comment, H1 and intro precede the gate at line 12, against `sk-create-command/SKILL.md:225`. |
| F-09 | Scripts README claims every script has a test under `tests/` | `.skilled/commands/doctor/scripts/README.md:21` | D2 | The claim is inaccurate for one script. |
| F-10 | SKILL.md playbook census is stale | `.skilled/skills/sk-git/SKILL.md:573` | L3, D3 | It says `GIT-001`..`GIT-042` across 8 categories. The playbook holds GIT-001 to GIT-046 across 9 categories. |
| F-11 | SKILL.md playbook validation command cannot run as written | `.skilled/skills/sk-git/SKILL.md:573` | L3, D3 | It runs a Python validator through `bash` and mixes a repo-root script path with a skill-relative target path. |
| F-12 | SKILL.md has widespread HVR punctuation blockers | `.skilled/skills/sk-git/SKILL.md:220` | L3 | `hvr_scan.py --all` reports 61 hard punctuation findings. |
| F-13 | Playbook index canonical artifact list omits `doctor-commands/` | `.skilled/skills/sk-git/manual-testing-playbook/manual-testing-playbook.md:18` | D3 | The list names eight category folders, and the package holds nine. |
| F-14 | Playbook index range and count statements lag the tree | `.skilled/skills/sk-git/manual-testing-playbook/manual-testing-playbook.md:603` | D3 | Section 13 is titled `GIT-023..GIT-043` with a stale scenario count. |
| F-15 | Playbook wave plan double-books GIT-042 and omits GIT-044 to GIT-046 | `.skilled/skills/sk-git/manual-testing-playbook/manual-testing-playbook.md:161` | L3 | Waves 5 and 6 both include GIT-042, and no wave schedules GIT-044 to GIT-046. |
| F-16 | Playbook index has widespread HVR punctuation blockers | `.skilled/skills/sk-git/manual-testing-playbook/manual-testing-playbook.md:14` | L3 | `hvr_scan.py --all` reports 53 hard punctuation findings. |
| F-17 | sk-git README repeats the worktree reaper outcome | `.skilled/skills/sk-git/README.md:57` | L3 | "Keeps the rest and keeps and reports the rest" hides the reaped versus report-only distinction. |
| F-18 | Catalog entry omits the DEGRADED verdict | `.skilled/skills/sk-git/feature-catalog/feature-catalog.md:163` | D3 | It lists PASS, FAIL, SKIP or UNKNOWN. The battery also emits DEGRADED. |
| F-19 | Feature catalog skips section 3 | `.skilled/skills/sk-git/feature-catalog/feature-catalog.md:105` | L4 | `validate_document.py` reports `non_sequential_numbering`, expected 3 and found 4. |
| F-20 | Feature catalog fails the HVR punctuation scan | `.skilled/skills/sk-git/feature-catalog/feature-catalog.md:31` | L4 | `hvr_scan.py` exits 1 with 12 hard blockers. |
| F-21 | Hooks README fails the HVR punctuation scan | `.skilled/skills/sk-git/scripts/hooks/README.md:31` | L4 | `hvr_scan.py` exits 1 with 32 hard blockers. |
| F-22 | Command index carries two HVR semicolon blockers | `.skilled/commands/README.txt:54` | L4 | Semicolons at lines 54 and 203. |
| F-23 | Doctor category overview never mentions `/doctor:sk-code` | `.skilled/skills/system-spec-kit/feature-catalog/doctor-commands/category-overview.md:17` | D4 | The section 1 enumeration of shipped doctor commands is incomplete. |
| F-24 | Root README gives `/doctor:git setup` two different verdict sets | `README.md:1262` | D4 | One bullet lists PASS, FAIL, SKIP or UNKNOWN. Another place in the same file includes DEGRADED. |
| F-25 | Setup documentation omits the status counters the command emits | `README.md:1507` | L4 | The README and the catalog leaf (`doctor-git-settings.md:29`) show a bare STATUS line. The renderer appends counters (`git-setup-check.cjs:1007`, `1009`, `1011`). |

## 4. Remediation Workstreams

1. **WS-1 (P1 first):** F-01. Trim `.skilled/skills/sk-git/SKILL.md` below 5,000 words and rerun `package_skill.py --check` until it prints `PASS`. Fix F-10 and F-11 in the same edit, since they sit on the same line.
2. **WS-2 HVR pass:** F-06, F-12, F-16, F-20, F-21, F-22. Rerun `hvr_scan.py` per file.
3. **WS-3 doc accuracy:** F-09, F-13, F-14, F-15, F-17, F-18, F-19, F-23, F-24, F-25.
4. **WS-4 setup-check hardening:** F-02, F-03, F-04, each with a test that fails before the fix.
5. **WS-5 command router conformance:** F-05, F-07, F-08.

## 5. Spec Seed

- Release conformance for the `/doctor:git setup` surfaces: sk-git package check passes, HVR scans exit 0 on the touched docs, and the verdict vocabulary (including DEGRADED) and status-line counters read the same everywhere.
- The setup battery fails closed when a probe cannot run, when a hook target is not executable, and when a handler is matched only textually.

## 6. Plan Seed

- T1: trim sk-git SKILL.md and fix the line 573 census and command (F-01, F-10, F-11). Check: `package_skill.py --check` prints PASS.
- T2: HVR punctuation pass over the six files in WS-2. Check: `hvr_scan.py` exits 0 per file.
- T3: documentation accuracy fixes in WS-3. Check: `validate_document.py` per file, plus the playbook and catalog validators.
- T4: setup-check hardening in WS-4 with new failing-first tests. Check: `node --test .skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs`.
- T5: router fixes in WS-5. Check: `validate_document.py --type command` and `bash .skilled/commands/doctor/scripts/route-validate.sh`.

## 7. Traceability Status

**Core protocols**
- `spec_code`: the reviewed artifacts are the v4.0.0.11 release surfaces named in `../spec.md` section 3 and `../goal-file-manifest.txt`. Every manifest path exists.
- `checklist_evidence`: not applicable. This Level 1 review phase has no checklist.
- `AC_COVERAGE`: exempt (Level 1 phase).

**Overlay protocols**
- `skill_agent` and `agent_cross_runtime`: the Hermes mirror `.hermes/skills/sk-git/SKILL.md` was in scope. No mirror drift finding was raised.
- `feature_catalog_code`: drift found (F-18, F-19, F-25).
- `playbook_capability`: drift found (F-13, F-14, F-15).
- Cross-repo naming: every surface listing `/doctor:git` targets names `setup`. Confirmed in synthesis with a repo-wide `rg`. The only target enumeration without `setup` is the `--dry-run` flag table at `.skilled/commands/doctor/git.md:59`, which is correct because `setup` is read-only.

## 8. Deferred Items

- Containment advisory: the runner attributed a modification of `specs/system-skill-advisor/035-doctor-command-routing/description.json` to the `luna-max-fast` window. That path belongs to the parallel deep review running in the same checkout. In preserve mode nothing was reverted, and the patch is quarantined under `lineages/luna-max-fast/containment/quarantine/1/`. No action is needed from this review.
- Root resource map: `reduce-state.cjs --emit-resource-map` needs a root `deep-review-state.jsonl`, and under fan-out the state lives in each lineage. The lineage map is at `lineages/luna-max-fast/resource-map.md`.

## Dimension Expansion Map

No divergent pivots ran (`convergence_mode=default`, `stop_policy=max-iterations`). Iteration angles per lineage, as steered: code, then command surface, then skill docs, then cross-repo references, then changelogs and a final cross-check. Neither lineage raised a finding against the two changelogs or the Hermes mirror.

## 9. Search Ledger

*No search-depth state captured at the fan-out root (legacy v1 record).* Per-lineage search state lives in each lineage's `deep-review-strategy.md` and `deep-review-dashboard.md`.

## 10. Audit Appendix

- **Convergence:** both lineages ran to `maxIterationsReached` at 5 iterations. Per-iteration findings, deepseek: 1, 3, 6, 2, 0. Luna (cumulative counts): 2, 6, 13, 18, 18. Luna found nothing new in iteration 5, and deepseek's last iteration was clean.
- **Route proof:** all 10 iteration records carry `target_agent: "deep-review"`, `resolved_route`, `agent_definition_loaded: true` and `mode: "review"`.
- **Adversarial self-check:** F-01 was re-run in synthesis. `package_skill.py --check` printed `Result: FAIL` with 5,038 words against a 5,000 maximum. The finding holds at P1: it is the documented release check, and it fails as written. Not a P0, because nothing breaks at runtime.
- **Sources reviewed:** the 27 manifest files, the sk-doc mode contracts named in `../spec.md`, and `sk-code/sk-code-skilled` with its JavaScript and shell checklists.

**Core Protocols:** spec_code (pass), checklist_evidence (n/a).
**Overlay Protocols:** skill_agent (pass), agent_cross_runtime (pass), feature_catalog_code (drift), playbook_capability (drift).

<!-- /ANCHOR:deep-review-v4-0-0-11-release-conformance -->
