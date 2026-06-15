# Iteration 006 — Routing-parity fixtures — what breaks under each model

- **Model**: gpt-5.5-fast xhigh (cli-opencode, read-only)
- **Seat**: 006
- **model_pick**: A

## Analysis

**Recommendation**
Pick **A) ONE-IDENTITY + REGISTRY-DRIVEN**. It preserves the current parity fixture contract, preserves the B5 one-identity keystone, and closes the drift gap by making Python/TypeScript derive `{legacy alias -> workflowMode}` from `mode-registry.json` instead of duplicating maps.

**What The Fixtures Assert**
`routing-parity-deep-skills.vitest.ts` calls `python3 skill_advisor.py --deep-skill-routing-json` with `{prompt, packet_context}` and parses the JSON result; it does not call the TypeScript/native scorer directly (`routing-parity-deep-skills.vitest.ts:39-49`). Its `RoutingResult` hard-types `skill` as literal `'deep-loop-workflows'` and `mode` as only `'research' | 'review' | 'ai-council'` (`routing-parity-deep-skills.vitest.ts:27-35`).

| Fixture | Prompt | Expected |
|---|---|---|
| INV-001 | `check convergence on the embedder testing architecture investigation` | `{skill: deep-loop-workflows, mode: research}`, winner `research`, research >= 0.75, review < 0.40 (`routing-parity-deep-skills.vitest.ts:53-66`) |
| INV-002 | `audit the deep-research packet for drift from the original embedder investigation topic` | `{skill: deep-loop-workflows, mode: research}`, winner `research`, research >= 0.70, review < 0.50 (`routing-parity-deep-skills.vitest.ts:69-82`) |
| INV-006 | `resume the autonomous research loop and check newinforatio convergence...` | `{skill: deep-loop-workflows, mode: research}`, winner `research`, research >= 0.75, review < 0.30 (`routing-parity-deep-skills.vitest.ts:85-98`) |
| INV-003 | `iterate on the spec folder until the architecture decision converges` | `{skill: deep-loop-workflows, mode: ai-council}`, winner `ai-council`, ai-council >= 0.65, review < 0.45 (`routing-parity-deep-skills.vitest.ts:101-114`) |
| INV-004 | `deliberate on whether deep-council should use coverage-graph signals...` | `{skill: deep-loop-workflows, mode: ai-council}`, winner `ai-council`, ai-council >= 0.80, research < 0.30 (`routing-parity-deep-skills.vitest.ts:117-130`) |
| INV-009 | `deliberate across multi-seat strategy options until the architecture decision converges` | `{skill: deep-loop-workflows, mode: ai-council}`, winner `ai-council`, ai-council >= 0.80, review/research < 0.30 (`routing-parity-deep-skills.vitest.ts:133-147`) |
| INV-005 | `run a loop on the deep-research packet until findings stabilize` | `{skill: deep-loop-workflows, mode: review}`, winner `review`, review >= 0.70, research < 0.50 (`routing-parity-deep-skills.vitest.ts:150-163`) |
| INV-007 | `continue the iterative review loop until the p0 and p1 findings stabilize` | `{skill: deep-loop-workflows, mode: review}`, winner `review`, review >= 0.75, research < 0.30 (`routing-parity-deep-skills.vitest.ts:166-179`) |
| INV-008 | `run a multi-pass spec folder audit until the review-report findings converge` | `{skill: deep-loop-workflows, mode: review}`, winner `review`, review >= 0.70, research < 0.30 (`routing-parity-deep-skills.vitest.ts:182-195`) |

`routing-parity-deep-council.vitest.ts` uses the same Python CLI path (`routing-parity-deep-council.vitest.ts:92-103`). It defines five council prompts in a table (`routing-parity-deep-council.vitest.ts:54-90`) and for every one asserts `{skill: deep-loop-workflows, mode: ai-council}`, winner `ai-council`, confidence >= fixture threshold, and runner-up below threshold (`routing-parity-deep-council.vitest.ts:105-116`).

**Model Impact**
| Model | Fixture Result | Why |
|---|---|---|
| A) One-identity + registry-driven | Stays green; no migration needed | The current emitted payload is already `{skill, mode, scores, winner, confidence}` (`skill_advisor.py:2530-2537`), and the registry already carries `workflowMode` values `research`, `review`, and `ai-council` (`mode-registry.json:22-49`). The implementation change is replacing the map source, not changing test-visible output. |
| B) Discoverable-nested | Breaks if implemented honestly | The fixtures hard-code `skill: deep-loop-workflows` (`routing-parity-deep-skills.vitest.ts:30-31`, `routing-parity-deep-council.vitest.ts:27-30`). Discoverable nested mode packets would be separate `skill_nodes`, and parser requires `skill_id === basename(folder)` (`skill-graph-db.ts:654-657`), so council would need `skill_id: ai-council`, not `deep-ai-council`, unless discovery rules are changed. |
| C) Derived-mode-hints/status quo | Stays green but does not solve the problem | The Python map is hardcoded as `deep-review -> review`, `deep-research -> research`, `deep-ai-council -> ai-council` (`skill_advisor.py:2319-2324`), and the tests exercise that Python CLI directly (`routing-parity-deep-skills.vitest.ts:39-49`). These fixtures would not catch drift from `mode-registry.json`. |
| D) Hybrid | Only green if defined as “one public identity + registry-derived virtual sub-surface”; breaks if partial discoverable mode metadata changes public skill IDs | Recursive discovery indexes every `graph-metadata.json` under the skill dir (`skill-graph-db.ts:601-625`), while the current parent contract says exactly one hub metadata file and no per-packet metadata (`SKILL.md:77-86`, decision record `decision-record.md:92-99`). |

**If B Wins**
Migrate fixtures deliberately to a separate-skill contract:

| Current | B Migration |
|---|---|
| `RoutingResult.skill: 'deep-loop-workflows'` | `RoutingResult.skill: 'deep-research' | 'deep-review' | 'ai-council'` unless parser rules are loosened |
| Research prompts | expect `{skill: deep-research, mode: research}` or drop `mode` if skill identity becomes the discriminator |
| Review prompts | expect `{skill: deep-review, mode: review}` |
| Council prompts | expect `{skill: ai-council, mode: ai-council}` under current `skill_id==folder` parser |
| One parity table | add `expectedSkill` and `expectedMode` per invariant |

I would not pick B: it conflicts with the documented one-identity keystone that packets deliberately carry no `graph-metadata.json` (`decision-record.md:92-99`) and with the project scope that Phase 3 should keep routing parity green unless a different model is deliberately chosen (`spec.md:69-71`).

**Standard Test Contract**
Standardize this pattern:

1. Parent-skill routing fixtures assert `result.skill === registry.skill` and `result.mode === registry.modes[].workflowMode`.
2. `result.winner` must equal `result.mode`; `scores` keys must be workflowMode names, not legacy skill IDs.
3. Ambiguous sub-mode prompts keep per-mode confidence and runner-up thresholds like the current INV/COUNCIL cases.
4. Add a registry parity fixture that loads `mode-registry.json` and checks Python + TypeScript projections match registry entries, rather than duplicating `DEEP_ROUTING_MODE_BY_KEY` and `DEEP_MODE_BY_CANONICAL`.
5. Add a discovery fixture/doctor rule: exactly one discoverable `graph-metadata.json` for one-identity parent skills; per-mode packet metadata is forbidden unless the model is explicitly B.
6. Add a naming validator: `packet` paths in the registry must exist and point to folders with a `SKILL.md`; `ai-council` folder versus `name: deep-ai-council` must be an explicit allowed mismatch, not an accidental parser exception.

===RESEARCH-JSON===
{"angle":"routing-parity-fixtures","recommendation":"Pick A: keep one discoverable deep-loop-workflows identity, load workflowMode projections from mode-registry.json, and keep the existing parity fixtures unchanged while adding registry/discovery parity tests.","model_pick":"A","key_findings":[{"claim":"The parity fixtures assert both the merged skill identity and the concrete mode, so flat skill equality is intentionally insufficient.","evidence":".opencode/skills/system-skill-advisor/mcp_server/tests/routing-parity-deep-skills.vitest.ts:5-10; .opencode/skills/system-skill-advisor/mcp_server/tests/routing-parity-deep-council.vitest.ts:5-8","confidence":"high"},{"claim":"The fixtures exercise the Python --deep-skill-routing-json path, not the TypeScript alias projection, so they do not currently catch TypeScript/registry drift.","evidence":".opencode/skills/system-skill-advisor/mcp_server/tests/routing-parity-deep-skills.vitest.ts:39-49; .opencode/skills/system-skill-advisor/mcp_server/tests/routing-parity-deep-council.vitest.ts:92-103","confidence":"high"},{"claim":"Current Python routing output already has the A-compatible public contract {skill: deep-loop-workflows, mode: workflowMode}.","evidence":".opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:2513-2541","confidence":"high"},{"claim":"Discoverable-nested B conflicts with the current parser unless each per-packet skill_id equals its folder basename, which makes council skill_id ai-council rather than deep-ai-council.","evidence":".opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:654-657; .opencode/specs/skilled-agent-orchestration/155-parent-nested-skill-pattern/001-rename-fix-and-shared-decision/decision-record.md:88-105","confidence":"high"},{"claim":"The one-identity keystone is explicit: only the hub graph-metadata.json is advisor-discoverable and mode packets deliberately carry none.","evidence":".opencode/skills/deep-loop-workflows/SKILL.md:77-86; .opencode/specs/skilled-agent-orchestration/155-parent-nested-skill-pattern/001-rename-fix-and-shared-decision/decision-record.md:92-99","confidence":"high"}],"risks":["The current parity fixtures cover only research/review/ai-council, while mode-registry.json also contains context and four improvement lanes.","The hub documentation says routing is registry-driven, but Python and TypeScript still hardcode projections, so docs can drift from implementation until A is implemented.","A B-style migration would require deciding whether council's discoverable id is ai-council or whether parser rules get a special-case exception."],"standardize":["Parent-skill routing fixtures assert one public skill plus registry workflowMode, not nested skill ids.","Generate Python and TypeScript alias/mode projections from mode-registry.json or test them against it.","Add /doctor:parent-skill validation for one graph-metadata.json, valid packet paths, explicit naming mismatches, and no per-packet metadata under one-identity mode.","Add a routing/discovery benchmark with prompt fixtures per workflowMode and thresholds for winner, runner-up, and discovery identity."],"open_questions":["Should context and the four improvement lanes get their own routing-parity prompts or a separate registry-coverage fixture?","Should the accepted ai-council folder/name mismatch be represented explicitly in mode-registry.json?","Should TypeScript aliases.ts remain a static generated artifact or load mode-registry.json at runtime?"]}
===END===

## Structured output

```json
{
  "angle": "routing-parity-fixtures",
  "recommendation": "Pick A: keep one discoverable deep-loop-workflows identity, load workflowMode projections from mode-registry.json, and keep the existing parity fixtures unchanged while adding registry/discovery parity tests.",
  "model_pick": "A",
  "key_findings": [
    {
      "claim": "The parity fixtures assert both the merged skill identity and the concrete mode, so flat skill equality is intentionally insufficient.",
      "evidence": ".opencode/skills/system-skill-advisor/mcp_server/tests/routing-parity-deep-skills.vitest.ts:5-10; .opencode/skills/system-skill-advisor/mcp_server/tests/routing-parity-deep-council.vitest.ts:5-8",
      "confidence": "high"
    },
    {
      "claim": "The fixtures exercise the Python --deep-skill-routing-json path, not the TypeScript alias projection, so they do not currently catch TypeScript/registry drift.",
      "evidence": ".opencode/skills/system-skill-advisor/mcp_server/tests/routing-parity-deep-skills.vitest.ts:39-49; .opencode/skills/system-skill-advisor/mcp_server/tests/routing-parity-deep-council.vitest.ts:92-103",
      "confidence": "high"
    },
    {
      "claim": "Current Python routing output already has the A-compatible public contract {skill: deep-loop-workflows, mode: workflowMode}.",
      "evidence": ".opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:2513-2541",
      "confidence": "high"
    },
    {
      "claim": "Discoverable-nested B conflicts with the current parser unless each per-packet skill_id equals its folder basename, which makes council skill_id ai-council rather than deep-ai-council.",
      "evidence": ".opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:654-657; .opencode/specs/skilled-agent-orchestration/155-parent-nested-skill-pattern/001-rename-fix-and-shared-decision/decision-record.md:88-105",
      "confidence": "high"
    },
    {
      "claim": "The one-identity keystone is explicit: only the hub graph-metadata.json is advisor-discoverable and mode packets deliberately carry none.",
      "evidence": ".opencode/skills/deep-loop-workflows/SKILL.md:77-86; .opencode/specs/skilled-agent-orchestration/155-parent-nested-skill-pattern/001-rename-fix-and-shared-decision/decision-record.md:92-99",
      "confidence": "high"
    }
  ],
  "risks": [
    "The current parity fixtures cover only research/review/ai-council, while mode-registry.json also contains context and four improvement lanes.",
    "The hub documentation says routing is registry-driven, but Python and TypeScript still hardcode projections, so docs can drift from implementation until A is implemented.",
    "A B-style migration would require deciding whether council's discoverable id is ai-council or whether parser rules get a special-case exception."
  ],
  "standardize": [
    "Parent-skill routing fixtures assert one public skill plus registry workflowMode, not nested skill ids.",
    "Generate Python and TypeScript alias/mode projections from mode-registry.json or test them against it.",
    "Add /doctor:parent-skill validation for one graph-metadata.json, valid packet paths, explicit naming mismatches, and no per-packet metadata under one-identity mode.",
    "Add a routing/discovery benchmark with prompt fixtures per workflowMode and thresholds for winner, runner-up, and discovery identity."
  ],
  "open_questions": [
    "Should context and the four improvement lanes get their own routing-parity prompts or a separate registry-coverage fixture?",
    "Should the accepted ai-council folder/name mismatch be represented explicitly in mode-registry.json?",
    "Should TypeScript aliases.ts remain a static generated artifact or load mode-registry.json at runtime?"
  ]
}
```
