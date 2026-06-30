# Research Iteration 4 — gpt-5.5 (xhigh, fast)
## Slice: NFR-S01 resolution (hub WebFetch / tool-permission widening)
Dispatched 2026-06-28T08:50:25.969Z | wall 147s

---

NFR-S01 should be reconciled to the parent-hub union-grant pattern. Do not strip `WebFetch` from `deep-loop-workflows`: `deep-research` explicitly needs it, and the reusable parent-skill template says hub tools are the union needed by modes.

```json
{
  "verified_facts": [
    {
      "claim": "The NFR-S01 review finding is real: 001 says no mechanism may widen tool permissions, but the selected Option E uses a parent hub whose tools govern the invocation.",
      "status": "confirmed",
      "evidence": ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/001-invocability-mechanism/review/review-report.md:39-43; .opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/001-invocability-mechanism/spec.md:157"
    },
    {
      "claim": "The same NFR-S01 issue is mirrored in 002 and specifically cites the deep-loop hub WebFetch grant.",
      "status": "confirmed",
      "evidence": ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/002-deep-loop-alignment/review/review-report.md:73-77 and 205-209"
    },
    {
      "claim": "deep-research needs WebFetch; removing WebFetch from the deep-loop hub would break the research route under Option E parent invocation.",
      "status": "confirmed",
      "evidence": ".opencode/skills/deep-loop-workflows/deep-research/SKILL.md:4 includes WebFetch; .opencode/skills/deep-loop-workflows/deep-research/references/protocol/loop_protocol.md:577 handles WebFetch failures"
    },
    {
      "claim": "Non-research deep modes are narrower or inward-only, so the widening observation is also real.",
      "status": "confirmed",
      "evidence": ".opencode/skills/deep-loop-workflows/deep-context/SKILL.md:4 omits WebFetch and line 36 routes outward/web discovery to deep-research; .opencode/skills/deep-loop-workflows/deep-review/SKILL.md:8 says no WebFetch; deep-ai-council and deep-improvement omit WebFetch at line 4"
    },
    {
      "claim": "The reusable parent-skill contract says hub allowed-tools should be the union needed by modes.",
      "status": "confirmed",
      "evidence": ".opencode/skills/sk-doc/assets/skill/parent_skill_hub_template.md:53 says allowed-tools is the union the modes need; .opencode/skills/sk-doc/references/skill_creation/parent_skills_nested_packets.md:60 and 122-123 say the hub is thin and each mode keeps its contract"
    },
    {
      "claim": "sk-design resolves the sibling-parent case by keeping a wider routing hub and documenting per-mode ownership, not by narrowing the hub to the smallest mode.",
      "status": "confirmed",
      "evidence": ".opencode/skills/sk-design/SKILL.md:4 grants Write/Edit/Bash at hub level; lines 15, 41-53, and 62 say the hub routes only while mode packets keep behavior/tool needs; design-foundations/SKILL.md:4 is narrower, while design-md-generator/SKILL.md:4 needs Write/Edit/Bash"
    },
    {
      "claim": "The current 001 and 002 NFR-S01 wording over-promises because it is absolute no-widening language, not a documented parent-hub union-grant contract.",
      "status": "confirmed",
      "evidence": ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/001-invocability-mechanism/spec.md:157; .opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/002-deep-loop-alignment/spec.md:165"
    }
  ],
  "recommended_steps": [
    {
      "id": "S14",
      "action": "Replace 001 NFR-S01 with exact wording: `- **NFR-S01**: For an invokable parent-skill hub, allowed-tools is a family-level hub grant: it may be the union required by all routed mode packets. The mechanism must not move per-mode workflow logic, convergence/state behavior, or semantic tool-use boundaries into the hub, and any effective permission widening caused by Skill(<parent>) must be explicit in the decision record. A stricter per-mode runtime sandbox is a separate runtime enhancement, not part of Option E.`",
      "files": [
        ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/001-invocability-mechanism/spec.md"
      ],
      "rationale": "This reconciles NFR-S01 to the established parent-hub pattern without breaking modes that need broader tools.",
      "risk": "low",
      "reversible": true
    },
    {
      "id": "S15",
      "action": "Add this exact 001 decision-record wording after ADR-001 `Why this one`: `**Security / NFR-S01 evaluation**: Option E uses the parent hub's allowed-tools for parent invocation. That is an intentional parent-skill union grant, not proof that the runtime narrows to the selected packet's frontmatter. The hub stays routing-only; each mode packet retains its own behavior contract, but those contracts are not a separate runtime permission sandbox when reached through Skill(<parent>). For deep-loop, WebFetch must remain available to the family hub because the research mode declares and uses it. Therefore NFR-S01 is satisfied only as an explicit, documented union-grant contract. Runtime-enforced per-mode narrowing remains a future Option-D-style enhancement.`",
      "files": [
        ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/001-invocability-mechanism/decision-record.md"
      ],
      "rationale": "This closes 001-F006/001-F007 by recording the security trade-off instead of pretending Option E preserves per-mode runtime permissions.",
      "risk": "low",
      "reversible": true
    },
    {
      "id": "S16",
      "action": "Replace 002 NFR-S01 with exact wording: `- **NFR-S01**: Deep-loop alignment must preserve the parent-hub union-grant contract: the deep-loop-workflows hub may carry the union of tools needed by its modes, including WebFetch for deep-research. Alignment must not flatten per-mode workflow logic into the hub or change mode-owned instructions; inward-only modes remain inward-only by their packet contracts. The effective hub grant must be documented as broader than some mode frontmatters, and runtime-enforced per-mode permission narrowing is out of scope unless separately designed and verified.`",
      "files": [
        ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/002-deep-loop-alignment/spec.md"
      ],
      "rationale": "This resolves the false absolute no-widening claim while preserving the currently working deep-research route.",
      "risk": "low",
      "reversible": true
    },
    {
      "id": "S17",
      "action": "Add a new 002 decision-record section with exact wording: `## ADR-004: Parent-hub tool grant for NFR-S01\\n\\n| Field | Value |\\n|-------|-------|\\n| **Status** | Accepted - document union-grant contract |\\n| **Date** | 2026-06-28 |\\n\\n### Context\\n`deep-loop-workflows/SKILL.md` is the invokable hub. Its allowed-tools includes WebFetch; `deep-research/SKILL.md` also includes WebFetch, while context/review/ai-council/improvement do not. The parent-skill hub template says hub allowed-tools is the union the modes need.\\n\\n### Decision\\nKeep WebFetch on the deep-loop hub. Treat hub allowed-tools as the effective family-level grant for Skill(deep-loop-workflows); the hub remains routing-only and mode packets retain their own behavioral/tool-use contracts. Do not claim runtime-enforced per-mode permission narrowing unless a separate runtime enhancement proves it.\\n\\n### Consequences\\n- This resolves NFR-S01 by documenting the effective contract instead of pretending the hub is an intersection grant.\\n- Inward-only mode packets remain inward-only by instruction and review gates, not by a separate runtime permission sandbox when entered through the parent hub.\\n- Removing WebFetch is rejected because it would break the deep-research route through the hub.`",
      "files": [
        ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/002-deep-loop-alignment/decision-record.md"
      ],
      "rationale": "This is the concrete 002 resolution: document the union grant and reject the destructive WebFetch trim.",
      "risk": "low",
      "reversible": true
    },
    {
      "id": "S18",
      "action": "Do not change live hub allowed-tools in this remediation pass; any runtime-enforced per-mode permission narrowing should be a separate high-blast design with tests.",
      "files": [
        ".opencode/skills/deep-loop-workflows/SKILL.md",
        ".opencode/skills/sk-design/SKILL.md",
        ".opencode/skills/sk-doc/assets/skill/parent_skill_hub_template.md"
      ],
      "rationale": "The current repo pattern and deep-research requirement make WebFetch removal the wrong fix.",
      "risk": "med",
      "reversible": true
    }
  ],
  "open_decisions": [
    {
      "question": "Should NFR-S01 be fixed by documentation reconciliation or live permission narrowing?",
      "options": [
        "A: Document parent-hub union-grant as the effective contract",
        "B: Strip WebFetch from the deep-loop hub",
        "C: Build runtime-enforced per-mode permission narrowing"
      ],
      "recommendation": "A now. B breaks deep-research through the hub. C is a separate runtime/security design, not a packet-doc remediation."
    }
  ],
  "critique_prior": [
    "Strengthen the prior open-decision recommendation: this is no longer merely prefer-doc-reconciliation; WebFetch removal is the wrong remediation under the current parent-hub contract.",
    "Treat 002-F033's strip-WebFetch option as incomplete: it ignores deep-research/SKILL.md:4 and the parent hub template's union rule.",
    "Use sk-design as evidence against intersection-only narrowing, but do not overclaim it as a perfect full-union implementation because the sk-design hub omits Task while several child modes list Task.",
    "NFR-S01 should stop claiming absolute no-widening. The honest invariant is hub union grant plus routing-only hub plus mode-owned behavior contracts."
  ]
}
```
