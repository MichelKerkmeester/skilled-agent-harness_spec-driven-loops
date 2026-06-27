# Resource Map - gpt55fast audit lineage

## Primary Skill Files

| Resource | Use in this lineage |
| --- | --- |
| `.opencode/skills/sk-design/design-audit/SKILL.md` | Source of truth for routing, workflow, rules, success criteria and parseable pseudocode. Key evidence: audit purpose lines 13-16; routing/resource map lines 54-103; pseudocode lines 126-247; workflow/rules lines 252-319; success criteria lines 351-358. |
| `.opencode/skills/sk-design/design-audit/references/audit_contract.md` | Severity, `/20` scoring, findings schema, evidence rules and report order. Key evidence: lines 16-27, 29-47, 48-68, 69-76. |
| `.opencode/skills/sk-design/design-audit/references/evidence_capture.md` | Target resolution, evidence types, browser/deterministic evidence, screenshot fallback and confirmed/inferred labels. Key evidence: lines 22-35, 38-49, 52-61, 65-73, 87-109. |
| `.opencode/skills/sk-design/design-audit/assets/audit_report_template.md` | Current report skeleton; used to identify worksheet and backlog-handoff gaps. Key evidence: lines 20-32, 50-99, 112-140, 144-162. |
| `.opencode/skills/sk-design/design-audit/references/accessibility_performance.md` | A11y/perf threshold coverage. Key evidence: lines 18-43, 60-91. |
| `.opencode/skills/sk-design/design-audit/assets/a11y_quick_fixes.md` | Snippet-level fixes and boundary that audit cites but does not apply. Key evidence: lines 16-18, 22-166. |
| `.opencode/skills/sk-design/design-audit/references/anti_patterns_production.md` | Anti-slop, token, copy, pseudo-element, View Transition and production-readiness checks. Key evidence: lines 18-91. |
| `.opencode/skills/sk-design/design-audit/references/ai_fingerprint_tells.md` | Model-specific AI tell catalog and severity rules. Key evidence: lines 16-30, 34-129. |
| `.opencode/skills/sk-design/design-audit/references/hardening_edge_cases.md` | Production-readiness matrix. Key evidence: lines 16-29, 32-143. |
| `.opencode/skills/sk-design/design-audit/references/critique_hardening.md` | Cognitive-load, heuristic, persona, hardening and evidence-limit lenses. Key evidence: lines 16-24, 25-89. |
| `.opencode/skills/sk-design/design-audit/references/transform_remediation.md` | Register-gated bolder/quieter/distill/redesign routing. Key evidence: lines 16-18, 22-47, 50-108. |
| `.opencode/skills/sk-design/design-audit/references/corpus_map.md` | Prior corpus distillation trace. Key evidence: lines 17-37. |
| `.opencode/skills/sk-design/shared/register.md` | Shared Brand-vs-Product register required for audit severity. Key evidence: lines 16-29, 32-60, 73-79. |

## Testing and Benchmark Evidence

| Resource | Use in this lineage |
| --- | --- |
| `.opencode/skills/sk-design/design-audit/manual_testing_playbook/manual_testing_playbook.md` | Confirms nine scenario families exist for manual verification. Key evidence: lines 11-24, 25-44. |
| `.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/014-routing-benchmark/design-audit/**` | Glob returned no files in this checkout; used as evidence for missing checked-in audit benchmark artifacts. |
| Router replay stdout | Five representative prompts confirmed parseable resource routing and exposed absence of shared register from replayed resources. Captured in `logs/fanout-lineage.out` and `deep-research-state.jsonl`. |

## Prior Research

| Resource | Use in this lineage |
| --- | --- |
| `.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/009-reference-asset-expansion/research/research.md` | Baseline for what prior 009 research recommended and what is now implemented. Key evidence: audit expansion matrix lines 99-114; priority ranking lines 129-155; eliminated alternatives lines 158-175. |

## Limitations

- The operator-provided `82/100` routing score was not found as a checked-in `design-audit` benchmark report in this checkout.
- The broad grep over `.opencode/specs` failed earlier with `Ripgrep JSON record exceeded 65536 bytes`; targeted glob/read checks were used instead.
