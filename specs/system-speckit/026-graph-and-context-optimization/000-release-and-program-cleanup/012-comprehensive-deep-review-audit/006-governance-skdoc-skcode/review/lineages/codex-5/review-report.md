---
title: Governance + sk-doc + sk-code Drift Review Report
sessionId: fanout-codex-5-1780595350529-5jk4vx
verdict: CONDITIONAL
status: complete
generatedAt: 2026-06-04T17:58:13Z
---

# Governance + sk-doc + sk-code Drift Review Report

## Executive Summary

Verdict: CONDITIONAL.

The lineage covered all four configured dimensions across five iterations and reached convergence after a stabilization pass. No P0 blockers were found. Three active P1 findings remain and require remediation before this slice should be treated as clean. Two P2 advisories are recorded for stale navigation/path drift.

| Severity | Active |
|---|---:|
| P0 | 0 |
| P1 | 3 |
| P2 | 2 |

Scope reviewed:

- `.opencode/skills/system-spec-kit/constitutional/**`
- `.opencode/skills/sk-doc/SKILL.md` and `.opencode/skills/sk-doc/assets/**`
- `.opencode/skills/sk-code/SKILL.md` and `.opencode/skills/sk-code/assets/**`

## Planning Trigger

Route to remediation planning. Active P1 findings affect standards consistency and enforcement reliability:

- sk-code simultaneously forbids ticket ids in comments and recommends ticket-number TODO examples.
- comment-hygiene enforcement has a whole-line allowlist bypass.
- sk-doc's machine-readable skill rules drift from the skill template's packaging requirement.

## Active Finding Registry

### F001 - P1 - sk-code ticket-id TODO contradiction and checker gap

sk-code forbids ticket ids in comments while recommending ticket-number TODO comments, and the checker does not enforce ticket ids.

Evidence:

- `.opencode/skills/sk-code/assets/opencode/checklists/universal_checklist.md:75`
- `.opencode/skills/sk-code/assets/opencode/checklists/universal_checklist.md:148`
- `.opencode/skills/sk-code/assets/opencode/checklists/universal_checklist.md:159`
- `.opencode/skills/sk-code/scripts/check-comment-hygiene.sh:85`
- `.opencode/skills/sk-code/scripts/check-comment-hygiene.sh:97`

### F002 - P2 - stale Claude hook path in sk-code

sk-code names the Claude write-time hook as `scripts/hooks/claude-posttooluse.sh`, but the checked-in hook lives under the skill-local `scripts/hooks` path.

Evidence:

- `.opencode/skills/sk-code/SKILL.md:216`
- `.opencode/skills/sk-code/scripts/hooks/claude-posttooluse.sh:3`
- `.opencode/skills/sk-code/scripts/hooks/claude-posttooluse.sh:13`

### F003 - P1 - whole-line allowlist bypass in comment-hygiene checker

Allowed durable-reference patterns short-circuit comment-hygiene detection for the whole line, so a mixed allowed-plus-forbidden comment can pass the gate.

Evidence:

- `.opencode/skills/sk-code/scripts/check-comment-hygiene.sh:70`
- `.opencode/skills/sk-code/scripts/check-comment-hygiene.sh:112`
- `.opencode/skills/sk-code/scripts/check-comment-hygiene.sh:114`
- `.opencode/skills/sk-code/scripts/check-comment-hygiene.sh:116`
- `.opencode/hooks/pre-commit:21`
- `.github/workflows/comment-hygiene.yml:27`

### F004 - P1 - sk-doc template rules omit packaging-required references

sk-doc's machine-readable skill rules omit the `REFERENCES` section that its own skill template says packaging requires.

Evidence:

- `.opencode/skills/sk-doc/assets/template_rules.json:62`
- `.opencode/skills/sk-doc/assets/template_rules.json:64`
- `.opencode/skills/sk-doc/assets/template_rules.json:68`
- `.opencode/skills/sk-doc/assets/skill/skill_md_template.md:112`
- `.opencode/skills/sk-doc/assets/skill/skill_md_template.md:115`

### F005 - P2 - stale sk-doc frontmatter link

sk-doc's skill template has a stale same-directory link to `frontmatter_templates.md`; the actual asset is one directory up.

Evidence:

- `.opencode/skills/sk-doc/assets/skill/skill_md_template.md:79`
- `.opencode/skills/sk-doc/assets/skill/skill_md_template.md:98`
- `.opencode/skills/sk-doc/assets/frontmatter_templates.md:1`

## Remediation Workstreams

1. Comment-hygiene policy alignment: resolve whether ticket ids are banned everywhere or allowed only in TODO owner slots, then update checklists and checker patterns together.
2. Comment-hygiene checker hardening: remove the whole-line allowlist bypass by scanning forbidden patterns first or suppressing only exact durable tokens.
3. sk-doc validator/template alignment: make `template_rules.json` model the `REFERENCES` requirement or explicitly document it as a weaker pre-packaging precheck.
4. Documentation path cleanup: fix stale hook and frontmatter links.

## Spec Seed

Add a remediation packet for governance/sk-doc/sk-code drift with these acceptance criteria:

- Comment-hygiene checklists, constitutional text and checker behavior agree on ticket ids.
- Mixed allowed-plus-forbidden comment lines fail the checker.
- sk-doc machine-readable skill rules match the packaging-required section model.
- Stale local links in reviewed templates resolve from their file locations.

## Plan Seed

1. Patch sk-code checklists and `check-comment-hygiene.sh` together.
2. Add checker fixtures for ticket ids and mixed allowed/forbidden comment lines.
3. Patch sk-doc `template_rules.json` and any validator tests that read it.
4. Fix stale path/link references.
5. Run targeted script tests plus strict spec validation for the remediation packet.

## Traceability Status

| Protocol | Status | Notes |
|---|---|---|
| spec_code | partial | Slice requirements were covered, with active P1 drift findings as remediation inputs. |
| checklist_evidence | skipped-pass | No `checklist.md` exists in this Level 1 slice packet. |
| feature_catalog_code | skipped-pass | No feature catalog file was in declared scope. |
| playbook_capability | partial | Playbook assets were present, but no executable playbook-capability finding was produced. |

## Deferred Items

- F002 and F005 can be remediated with the P1 work or batched into a documentation cleanup.
- Code Graph was unavailable, so the review used direct file reads and `rg` evidence.
- No resource-map coverage gate ran because `resource_map_present` was false at init.

## Audit Appendix

Iterations:

| Iteration | Focus | New P0 | New P1 | New P2 | Ratio | Verdict |
|---:|---|---:|---:|---:|---:|---|
| 001 | correctness | 0 | 1 | 1 | 1.00 | CONDITIONAL |
| 002 | security | 0 | 1 | 0 | 0.45 | CONDITIONAL |
| 003 | traceability | 0 | 1 | 0 | 0.31 | CONDITIONAL |
| 004 | maintainability | 0 | 0 | 1 | 0.06 | PASS |
| 005 | stabilization | 0 | 0 | 0 | 0.00 | PASS |

Convergence replay:

- Last two ratios: 0.06 -> 0.00.
- Rolling average: 0.03, below the 0.08 stop band.
- Dimension coverage: correctness, security, traceability, maintainability complete.
- Claim adjudication: P1 packets present for F001, F003 and F004.
- Graphless fallback: active, because Code Graph was unavailable in this runtime.

Stop reason: converged. Final verdict: CONDITIONAL.
