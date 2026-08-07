# Deep Review Report: Skill Documentation Drift Remediation

## 1. Executive Summary

Verdict: CONDITIONAL

Stop reason: `max-iterations` after 5/5 iterations. The loop covered correctness, security, traceability, maintainability, and stabilization. No P0 finding was confirmed. Two active P1 findings block a clean PASS, and one P2 advisory remains.

Active severity counts: P0=0, P1=2, P2=1. `hasAdvisories=true`. Release readiness state: `in-progress`.

## 2. Planning Trigger

Plan a focused documentation/metadata cleanup rather than implementation changes. The original six drift clusters are mostly fixed in sampled code/docs, but the remediation left a broader cli-opencode direct-agent routing drift and did not reconcile packet completion state.

## 3. Active Finding Registry

| ID | Severity | Category | Finding | Evidence |
|---|---|---|---|---|
| F001 | P1 | cli-opencode-agent-routing-drift | `cli-opencode`'s main contract says not to pass `--agent general` and not to direct-route subagents, but living reference/playbook docs still publish those exact patterns. | `.opencode/skills/cli-opencode/SKILL.md:261`, `.opencode/skills/cli-opencode/SKILL.md:285`, `.opencode/skills/cli-opencode/README.md:105`, `.opencode/skills/cli-opencode/README.md:125`, `.opencode/skills/cli-opencode/references/agent_delegation.md:197`, `.opencode/skills/cli-opencode/references/agent_delegation.md:222`, `.opencode/skills/cli-opencode/references/agent_delegation.md:225`, `.opencode/skills/cli-opencode/references/agent_delegation.md:229`, `.opencode/skills/cli-opencode/references/agent_delegation.md:231`, `.opencode/skills/cli-opencode/manual_testing_playbook/manual_testing_playbook.md:190`, `.opencode/skills/cli-opencode/manual_testing_playbook/manual_testing_playbook.md:368` |
| F002 | P1 | packet-completion-state-drift | Packet docs and graph metadata disagree on completion: `spec.md`, `plan.md`, and `graph-metadata.json` still say in-progress/pending while `tasks.md`, `checklist.md`, and `implementation-summary.md` say complete. | `.opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/015-skill-doc-drift-remediation/spec.md:14`, `.opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/015-skill-doc-drift-remediation/spec.md:17`, `.opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/015-skill-doc-drift-remediation/spec.md:25`, `.opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/015-skill-doc-drift-remediation/spec.md:44`, `.opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/015-skill-doc-drift-remediation/plan.md:58`, `.opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/015-skill-doc-drift-remediation/plan.md:61`, `.opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/015-skill-doc-drift-remediation/plan.md:96`, `.opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/015-skill-doc-drift-remediation/tasks.md:75`, `.opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/015-skill-doc-drift-remediation/tasks.md:85`, `.opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/015-skill-doc-drift-remediation/checklist.md:114`, `.opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/015-skill-doc-drift-remediation/implementation-summary.md:15`, `.opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/015-skill-doc-drift-remediation/graph-metadata.json:40` |
| F003 | P2 | metadata-key-file-coverage | `graph-metadata.json` key_files only covers the original file set, but `implementation-summary.md` says 13 additional files and two sandbox scripts were modified during verification. | `.opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/015-skill-doc-drift-remediation/graph-metadata.json:41`, `.opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/015-skill-doc-drift-remediation/graph-metadata.json:61`, `.opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/015-skill-doc-drift-remediation/implementation-summary.md:92`, `.opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/015-skill-doc-drift-remediation/implementation-summary.md:104`, `.opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/015-skill-doc-drift-remediation/implementation-summary.md:106` |

## 4. Remediation Workstreams

| Workstream | Findings | Action |
|---|---|---|
| cli-opencode routing docs | F001 | Normalize `references/agent_delegation.md` and manual testing playbooks to the current contract: omit `--agent general`, route generic subagents through `orchestrate` when help-verified, and keep direct `--agent` examples only where currently valid. |
| packet state reconciliation | F002 | Update `spec.md`, `plan.md`, and `graph-metadata.json` so status, DoD, and continuity fields match the completed implementation summary and checklist. |
| metadata coverage | F003 | Regenerate or patch graph metadata key files to include additional files claimed by the implementation summary, or explicitly narrow why those files are excluded. |

## 5. Spec Seed

Add a follow-up requirement: living `cli-opencode` reference/playbook examples must not contradict `SKILL.md` and `README.md` dispatch rules for `--agent general`, generic subagents, or command-owned loop executors.

## 6. Plan Seed

1. Re-scan `.opencode/skills/cli-opencode` for `--agent general`, `--agent context`, `--agent review`, and `--agent debug` in living guidance.
2. Classify each hit as historical/changelog, intentional negative example, or stale operational guidance.
3. Patch operational guidance to omit `--agent` for default/general or route through `orchestrate` for subagents.
4. Reconcile packet state docs and graph metadata.
5. Run the packet validation gate and a scoped grep diff.

## 7. Traceability Status

| Protocol | Status | Notes |
|---|---|---|
| spec_code | partial | Remediation claims are mostly supported, but F001/F002 show remaining doc/metadata drift. |
| checklist_evidence | partial | Checklist evidence exists, but completion metadata contradicts it. |
| feature_catalog_code | partial | cli-opencode reference/playbook surfaces still publish stale dispatch patterns. |
| playbook_capability | partial | Playbook scenarios CO-001/CO-013 still depend on `--agent general`. |

Acceptance coverage: Level 2 lifecycle predicate is active because `checklist.md` and `implementation-summary.md` exist. Checklist claims 15/15 verified, but the review marks acceptance coverage partial because packet state docs contradict the completion claim.

## 8. Deferred Items

- P2 F003 can be deferred if graph key_files intentionally tracks only originally scoped files, but that exclusion should be documented.
- A full repo-wide cli-opencode playbook sweep was not completed beyond exact-token grep and sampled reads; the P1 remediation should do the complete classification.

## 9. Audit Appendix

Iteration summary:

| Iteration | Dimension | Verdict | New Findings |
|---:|---|---|---:|
| 1 | correctness | CONDITIONAL | 1 |
| 2 | security | PASS | 0 |
| 3 | traceability | CONDITIONAL | 1 |
| 4 | maintainability | PASS | 1 |
| 5 | stabilization | PASS | 0 |

Checks performed:

- Confirmed `.opencode/agents/*.toml` glob returns no files.
- Confirmed `.opencode/plugins/*.js` returns six plugin entrypoint files.
- Confirmed scoped `deep-loop-workflows` grep for `.opencode/agents/*.toml` patterns returns no files.
- Confirmed `deep-improvement` scanner template now contains `.opencode/agents/{name}.md` and `.claude/agents/{name}.md` only.

Final verdict: CONDITIONAL
