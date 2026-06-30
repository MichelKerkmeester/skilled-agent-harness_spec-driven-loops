# Iteration 10 — MiniMax-M3 (TIDD-EC) — maintainability

Dispatched: 2026-06-28T07:38:09.122Z | wall: 255s | billing: paid

---

I'll execute this maintainability review systematically. Let me first read all target files plus parent docs in parallel to gather evidence.
Now let me verify the parent docs, the claimed "dead pointer" HVR file, and check whether the parent phase claims "001 accepted" actually match reality.
Now let me verify the HVR rules pointer and the deep-loop-workflows description that contradicts the spec's claim.
Critical findings emerging. Let me check the actual claims against reality — the HVR rules file location, deep-loop-workflows pattern (already Option E before spec 154), and check 002-deep-loop-alignment contents.
Let me verify the spec 154 reference claim and check the 002 docs as well.
Let me verify the spec 154 internal claim about invokable-hub routing, since the implementation-summary attributes that pattern to it.
I have sufficient evidence. Let me write the final JSON output with 4 NEW maintainability findings. Verified evidence:

- **Reversed chronology**: deep-loop-workflows SKILL.md (Jun 26) predates sk-design SKILL.md (Jun 27) and explicitly documents "Routing is **registry-driven** (invokable-hub, Option E)" at line 36; spec 154/008 line 56 says sk-design "follows the deep-loop-workflows pattern" — yet impl-summary attributes the reference to spec 154.
- **Stale YAML**: three docs still say "Await user gate" while impl-summary line 46 says "Mechanism decided (Option E, Accepted)".
- **Spec Folder wrong**: impl-summary line 45 says `155-parent-skill-native-invocability`, missing the child slug.
- **Phase 1 label drift**: tasks.md says "Setup", plan.md says "Research and design".

I performed the maintainability review by reading all 8 target docs plus parent docs, then verified four maintainability-impact claims against the real files (the canonical deep-loop-workflows SKILL.md timestamp, the 154/008 spec.md directionality, the graph-metadata spec_folder, and the cross-doc phase naming). The dimension is dirty: the docs simultaneously claim a decision was made and that it is still gated; the reference implementation attribution is reversed; and three YAML frontmatter fields have not been synchronized with the body's claimed completion. These will mislead a future reader resuming this packet.

```json
{
  "findings": [
    {
      "severity": "P1",
      "dimension": "maintainability",
      "title": "implementation-summary reverses cause/effect of Option E reference implementation",
      "file": ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/001-invocability-mechanism/implementation-summary.md",
      "loc": "line 55 (What Was Built section)",
      "evidence": "the mechanism's reference implementation was carried out in spec 154 (the sk-design conversion): Skill(sk-design) loads the hub, which routes to the nested design-<mode> packets",
      "impact": "deep-loop-workflows/SKILL.md (line 36) reads \"Routing is registry-driven (invokable-hub, Option E)\" and was authored Jun 26 (one day before sk-design/SKILL.md at Jun 27). spec 154/008-nested-parent-conversion/spec.md line 56 explicitly says sk-design \"follows the deep-loop-workflows pattern\" and line 212 records 155's mechanism as now satisfied by the hub-routing approach. The packet attributes the proof to the wrong spec, so a future reader will search spec 154 for the original evidence that already lives in deep-loop-workflows.",
      "recommendation": "Rewrite line 55 to attribute Option E to deep-loop-workflows (the canonical original) and cite spec 154/008 only as a secondary adoption that formalized the pattern on sk-design."
    },
    {
      "severity": "P1",
      "dimension": "maintainability",
      "title": "next_safe_action / recent_action YAML fields in 3 docs still say 'Await user gate' while implementation-summary claims decision completed",
      "file": ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/001-invocability-mechanism/checklist.md",
      "loc": "checklist.md line 17-18; tasks.md line 17-18; implementation-summary.md line 17-18 vs implementation-summary.md line 46",
      "evidence": "tasks.md line 18 \"next_safe_action: Await user gate; then start the runtime extensibility probe task\"; checklist.md line 18 \"next_safe_action: Await user gate; verify Phase 1 outputs against these items\"; implementation-summary.md line 18 \"next_safe_action: Await user gate; then run Phase 1 runtime probe and prototype\" — but implementation-summary.md line 46 \"**Completed** | Mechanism decided (Option E, Accepted); reference implementation in spec 154\"",
      "impact": "The YAML frontmatter is the canonical quick-read summary the memory saver and resume ladder read first. Three docs still say \"Await user gate\" while the implementation-summary body claims the decision is Accepted; a future reader resuming the packet will see contradictory status between YAML headers and bodies across the same folder, eroding trust in the frontmatter.",
      "recommendation": "Update the three YAML frontmatters to reflect the post-decision state: set recent_action to \"Decision recorded (Option E, ADR-001 Accepted)\" and next_safe_action to \"Phase 1 prototype execution (gated)\" so the YAML matches the body's claimed completion."
    },
    {
      "severity": "P2",
      "dimension": "maintainability",
      "title": "implementation-summary.md Spec Folder field points to the parent phase, not this child",
      "file": ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/001-invocability-mechanism/implementation-summary.md",
      "loc": "line 45 (Metadata table)",
      "evidence": "**Spec Folder** | 155-parent-skill-native-invocability",
      "impact": "graph-metadata.json line 4 records the actual spec_folder as \"skilled-agent-orchestration/119-parent-skill-native-invocability/001-invocability-mechanism\". A memory search landing on this implementation-summary will direct the reader to the parent phase folder, which is itself a phase parent that links to two children (001 and 002) — easy to land on the wrong child packet and read the wrong decisions.",
      "recommendation": "Replace the value with the full child path \"skilled-agent-orchestration/119-parent-skill-native-invocability/001-invocability-mechanism\" to match graph-metadata.json spec_folder."
    },
    {
      "severity": "P2",
      "dimension": "maintainability",
      "title": "tasks.md labels Phase 1 'Setup' while plan.md labels it 'Research and design'",
      "file": ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/001-invocability-mechanism/tasks.md",
      "loc": "tasks.md line 53 vs plan.md line 124",
      "evidence": "tasks.md line 53 \"## Phase 1: Setup\"; plan.md line 124 \"### Phase 1: Research and design (gated entry; produces the decision)\"",
      "impact": "Tasks and plan are supposed to cross-reference; if the phase names diverge a reader using one to navigate to the other will spend cycles confirming the same label actually means the same phase. Phase 1's intent (research before implementation) is otherwise lost in the \"Setup\" label.",
      "recommendation": "Rename tasks.md Phase 1 heading to \"Research and design\" to match plan.md — the smaller change, since plan.md already documents the phase as research-driven."
    }
  ],
  "new_findings_count": 4,
  "dimension_clean": false
}
```

