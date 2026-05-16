# Deep Review Iteration 008 - Validate Sweep + Active P1 Re-verification

**Session**: 2026-05-07T17:08:57Z  
**Generation**: 1  
**Lineage Mode**: new  
**Dimensions**: correctness, security, traceability, maintainability  
**Verdict**: FAIL (`hasAdvisories=true`)

## External Validator Sweep

Strict validation is not clean. The top-level packets 093, 094, 095, 096, and 098 validate, but one 096 child and every 098 remediation child fail strict validation.

| Packet | Exit | Result |
|---|---:|---|
| `093-testing-playbooks-code-review-and-git` | 0 | pass |
| `093/.../001-sk-code-review-playbook` | 0 | pass |
| `093/.../002-sk-git-playbook` | 0 | pass |
| `094-playbook-prompt-naturalness` | 0 | pass |
| `095-sk-code-review-playbook-execution` | 0 | pass |
| `096-rename-opencode-dirs-to-plural` | 0 | pass |
| `096/.../001-skills` | 0 | pass |
| `096/.../002-agents` | 0 | pass |
| `096/.../003-commands` | 0 | pass |
| `096/.../004-symlinks` | 2 | fail: `ANCHORS_VALID`, `SPEC_DOC_SUFFICIENCY` |
| `098-097-remediation` | 0 | pass |
| `098/.../001-dist-rebuild` | 2 | fail: `TEMPLATE_HEADERS`, `ANCHORS_VALID` |
| `098/.../002-sk-deep-token-replace` | 2 | fail: `TEMPLATE_HEADERS`, `ANCHORS_VALID` |
| `098/.../003-narrative-validation-repair` | 2 | fail: `TEMPLATE_HEADERS`, `ANCHORS_VALID` |
| `098/.../004-hooks-resolver-tighten` | 2 | fail: `TEMPLATE_HEADERS`, `ANCHORS_VALID` |
| `098/.../005-checklist-evidence` | 2 | fail: `TEMPLATE_HEADERS`, `ANCHORS_VALID` |
| `098/.../006-skill-advisor-python` | 2 | fail: `TEMPLATE_HEADERS`, `ANCHORS_VALID` |
| `098/.../007-p2-doc-drift` | 2 | fail: `TEMPLATE_HEADERS`, `ANCHORS_VALID` |

The 098/001 verbose validator output shows the common shape: `tasks.md` uses `Phase 1: Preflight` / `Phase 2: Remediation` while the Level 2 contract expects `PHASE 1: SETUP` / `PHASE 2: IMPLEMENTATION`; `checklist.md` uses a collapsed `required`/`optional` template while strict validation expects protocol, pre-implementation, code-quality, testing, fix-completeness, security, docs, and file-org anchors.

## Skill Advisor Routing

The default advisor path fails the requested deep-review trigger check:

| Command | Exit | Recommendation |
|---|---:|---|
| `skill_advisor.py "deep-review track:skilled-agent-orchestration" --threshold 0.8` | 0 | `[]` |
| same prompt with `--force-native --show-rejections` | 0 | `[]` |
| same prompt with `--force-local --show-rejections --threshold 0.1` | 0 | `deep-review`, confidence `0.95`, uncertainty `0.15` |

This is not a Python crash. It is a native/default routing miss. The native scorer's deep-review bonus targets `sk-deep-review`, while discovered skill inventory exposes `deep-review`.

## Discovery And Hook Gates

OpenCode discovery is structurally sane:

| Probe | Result |
|---|---|
| `.opencode/skill` | absent |
| `.opencode/agent` | absent |
| `.opencode/command` | absent |
| `.opencode/skills/*/` | 18 dirs: 16 named skills plus `.advisor-state` and `.smart-router-telemetry` operational dirs |
| `.opencode/agents/*` | 12 entries including README plus 11 agent definitions |
| `.opencode/commands/*/` | 5 command groups |

Hook gates are clean:

| Gate | Result | Evidence |
|---|---|---|
| Stop hook env override | pass | `session-stop.ts:39-46` honors `SPECKIT_GENERATE_CONTEXT_SCRIPT` only under `NODE_ENV='test'` or `SPECKIT_TEST='true'`. |
| SessionStart schema | pass | `.claude/settings.local.json:55-65` uses nested `hooks.SessionStart[] -> { matcher, hooks: [...] }`. |

## Active P1 Re-verification

All 10 active P1s remain confirmed.

| ID | Status | Evidence |
|---|---|---|
| P1-007 | confirmed | `093/.../001-sk-code-review-playbook/checklist.md:58-61` and `:106-108` still have unchecked P0/P1 checklist rows; `098/.../005-checklist-evidence/implementation-summary.md:125-136` confirms line-by-line CHK evidence was deferred. |
| P1-015 | confirmed | `skill-graph/scan.ts:40` still defaults to `.opencode/skill`; `advisor-rebuild.ts:84` still indexes `.opencode/skill`. |
| P1-016 | confirmed | `scripts/dist/observability/smart-router-measurement.js:14-17` still contains generated `.opencode/skill` defaults. |
| P1-017 | confirmed | `095/.../implementation-summary.md:57-58` claims 18/18 PASS and 0 SKIP, while `:112` and `:124-125` say CR-016/017/018 were skipped or accounted as 15 PASS + 3 SKIP; no durable CR-016/CR-018 transcript files exist in the packet. |
| P1-018 | confirmed | Playbook roots exist, but `rg "manual_testing_playbook" sk-code-review/SKILL.md sk-git/SKILL.md` returns no owning-skill links. |
| P1-019 | confirmed | `spec_kit_deep-review_auto.yaml:118` and confirm `:118` interpolate raw `{spec_folder}` into `node -e` before resolver containment; `review-research-paths.cjs:201-204` only `path.resolve`s before building artifact paths. |
| P1-020 | confirmed | `audit_descriptions.py:421-427` exits from JSON output based only on `exitOver`; a zero-inventory stub returned exit 0 with `counts.total: 0`. |
| P1-021 | confirmed | `check-smart-router.sh:260-263` checks only `skill_dir / resource`; CLI skills reference existing shared files via `../system-spec-kit/...`, so valid shared refs still fail the local-only resolver. |
| P1-022 | confirmed | `096/.../004-symlinks/spec.md:136-152` opens `questions` then `nfr` and closes `reliability`/`nfr`; `:189` closes `questions`; strict validation exits 2. |
| P1-023 | confirmed | `098/.../005-checklist-evidence/implementation-summary.md:16` has `blockers: []` while `:125-136` and `:144` carry the deferred checklist-evidence work only in prose. |

## New Findings

### P1-024 [P1] 098 remediation child packets claim completion but fail strict validation

- File: `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/003-remediation/001-dist-rebuild/checklist.md:39`
- Evidence: Every 098 child phase exits 2 under `validate.sh --strict`. The sampled 098/001 checklist starts a collapsed `required` section at `checklist.md:39` instead of the Level 2 protocol/pre-implementation/code-quality/testing/fix-completeness/security/docs/file-org anchor set, and `tasks.md:55-72` uses non-contract task phase headings. These children are completion artifacts, so strict validation failure is a required gate issue.
- Finding class: matrix/evidence
- Scope proof: The same `TEMPLATE_HEADERS` + `ANCHORS_VALID` failure appears across all seven direct 098 child phases.
- Recommendation: Repair the 098 child docs against the Level 2 contracts, then rerun strict validation recursively on 098.

### P1-025 [P1] Native skill advisor fails explicit deep-review routing

- File: `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/scorer/aliases.ts:19`
- Evidence: The default advisor and `--force-native` both return `[]` for `deep-review track:skilled-agent-orchestration` at threshold 0.8; `--force-local` returns `deep-review` at confidence 0.95. Native aliases and bonuses target `sk-deep-review` at `aliases.ts:19-24` and `fusion.ts:191-194`, but discovered skill inventory reports `deep-review`.
- Finding class: cross-consumer
- Scope proof: `skill_advisor.py --health` reports `deep-review` in `skill_names`; no `sk-deep-review` skill exists in discovery output.
- Recommendation: Align native canonical IDs and aliases with the actual `deep-review` skill id, then add a regression case for the exact trigger phrase.

### P1-026 [P1] Findings registry reports zero open findings while state log carries active P1s

- File: `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/004-track-rereview/review/deep-review-findings-registry.json:8`
- Evidence: The registry is still `status: "INITIALIZED"` with `openFindings: []`, `findingsBySeverity.P1: 0`, and `openFindingsCount: 0` at lines 8-26. The append-only state log's latest iteration records 10 active P1s and 6 P2s at `deep-review-state.jsonl:8`.
- Finding class: matrix/evidence
- Scope proof: The contradiction is within the same review packet and generation; it affects reducer-owned convergence state, not only prose reporting.
- Recommendation: Replay/reduce the review deltas into the registry before any stop or synthesis decision, and add a guard that rejects `INITIALIZED` registry state after evidence-bearing iterations exist.

## Traceability Status

| Protocol | Result | Notes |
|---|---|---|
| spec_code | fail | Existing active P1s plus P1-024/P1-025/P1-026. |
| checklist_evidence | fail | P1-007 and P1-023 remain active. |
| skill_agent | mixed | Skill inventory exists, but native advisor routing fails explicit deep-review. |
| agent_cross_runtime | fail | P1-017 remains active. |
| feature_catalog_code | fail | P1-015/P1-025 remain active. |
| playbook_capability | mixed | P1-018 remains active. |

## Verdict

FAIL. The review cannot flip to PASS with 13 active P1 findings, strict validation failures on claimed-complete 098 child packets, and a reducer registry that says zero open findings despite the state log carrying active required fixes.
