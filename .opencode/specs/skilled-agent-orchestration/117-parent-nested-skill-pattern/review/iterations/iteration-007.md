# Review Iteration 007 — /create scaffolder correctness

- **Model**: opus-4.8 (claude2)
- **Seat**: r07
- **clean**: False
- **findings**: 4

## Analysis

I have enough to report. Let me summarize what I verified and the defects found.

## Review: `/create:parent-skill` scaffolder correctness (r07/10)

**What I verified clean (confirmed by reads + executed checks):**
- **Both YAMLs parse** (`python3 yaml.safe_load` OK for auto + confirm) and **mirror the feature-catalog trio** (presentation.txt + auto.yaml + confirm.yaml; same Phase-0 / Setup / Dashboard / Completion contract shape).
- **Registration is complete** — `/create:parent-skill` is present in `.opencode/commands/README.txt:128`, `.opencode/commands/create/README.txt:44,69,81-82`, and the `@markdown` command-map in **all 3 mirrors** (`.opencode/agents/markdown.md:58,191`, `.claude/agents/markdown.md:43,176`, `.codex/agents/markdown.toml:48,181`). No missing mirror.
- **H4 one-identity** is specified in both YAMLs (`H4_one_identity` + step_5 "Count graph-metadata.json … assert exactly 1 … 0 inside packets/shared") and is deterministically backstopped by `parent-skill-check.cjs` checks 1a/2a (doctor route wired at `_routes.yaml:157-165`). Adequate.
- **shared/ is non-discoverable** by design (step_4 forbids a graph-metadata.json there).
- The **registry template** (`parent_skill_registry_template.json`) is correct and complete — it carries the full discriminator + `legacyAdvisorId`, so faithful template-first execution *can* produce a doctor-passing registry. Canonical doctor run: **exit 0, all invariants PASS**.

**Defects found** (the command's prose contract diverges from both the template it loads and the doctor gate it must pass):

1. **P1 — YAML registry contract under-specifies the mode shape.** `create_parent_skill_auto.yaml:175` documents the mode/advisorRouting shape as only `{routingClass, advisorDefaultMode, legacyAliases, packetSkillName}` and never restates the **3-tier discriminator** (`workflowMode`/`runtimeLoopType`/`backendKind`) or the **top-level `packet`** field — exactly the fields `parent-skill-check.cjs` HARD-requires at checks 3c/3d (`:204-228`). It also omits `legacyAdvisorId` (lists `legacyAliases` instead), the field the projection/drift-guard key on (template line 13, doctor 4b at `:265`). step_5 self-validation (`:286-289`) likewise never checks the discriminator, `packet`, or the `routingClass` enum — so a literal reading can self-report `STATUS=OK` yet **fail `/doctor:parent-skill` 3c/3d**. Template-first execution mitigates, but the contract is the risk surface.

2. **P1 — advisorRouting blocks are inert without out-of-band edits the command neither performs nor flags.** Under the shipped "C-plus = no runtime registry read" design, the advisor only routes via its hardcoded Python `DEEP_ROUTING_MODE_BY_KEY` / TS `DEEP_MODE_BY_CANONICAL` maps + the single drift-guard test. A newly scaffolded skill's `advisorRouting` blocks are read by **nothing** until someone hand-adds those map entries, a per-skill drift-guard test, and a discoverable family. Yet the command reports "Registry advisorRouting coverage: PASSED" (presentation §5; auto.yaml:283) — over-claiming functional wiring. The `update` branch has the sharper edge: adding a new `lexical`/`alias-fold` mode without the matching map edit makes the existing drift-guard test go **red** and the mode never routes; step_2/step_4 never mention this.

3. **P1 — over-strict 1:1 mode→packet + `deep-<mode>` rule contradicts the cited canonical and exceeds the doctor gate.** auto.yaml hard-encodes "no two modes resolve to the same packet folder" (`:251`) and "folder == packetSkillName == deep-<mode>" (`:179,:273`, validated at `:288`). The command's own cited canonical (`reference_sources.canonical_example: deep-loop-workflows`) **violates both**: 4 modes (agent-improvement, model-benchmark, skill-benchmark, ai-system-improvement) all map to one `deep-improvement` packet, and the `ai-council` mode's packet is `ai-council` (≠ `deep-ai-council`). The doctor check enforces neither (3c only checks the dir exists). So step_5 (`:288`) would **fail a doctor-valid, canonical-shaped layout**, and an `update` that reuses an existing packet for a benchmark/command-bridge mode is wrongly flagged as a conflict / forced into a spurious new packet. The scaffolder cannot reproduce its own reference pattern.

4. **P2 — scaffolded non-canonical skills with lexical modes won't cleanly pass `/doctor:parent-skill` 4b.** `parent-skill-check.cjs:261-296` cross-checks the target's lexical projection against the **live global** advisor `DEEP_ROUTING_MODE_BY_KEY` (which only describes deep-loop-workflows). Any scaffolded skill declaring a `lexical` mode with `legacyAdvisorId` yields a different key set → 4b **FAIL**. Root cause is in the doctor script (r08 territory), but it directly answers "would a scaffolded skill pass doctor": for lexical-declaring skills, no. (Med confidence — depends on the scaffolder choosing lexical over metadata/command-bridge classes; the failure mechanism itself is confirmed.)

Net: the scaffolder is structurally sound and well-registered, the one-identity invariant is properly gated, and the template is correct — but the command's prose contract is incomplete/over-strict relative to the template and the doctor gate, and it over-claims advisor wiring that the C-plus design leaves to manual map edits. Not clean.

===REVIEW-JSON===
{"slice":"/create:parent-skill scaffolder correctness","findings":[{"severity":"P1","path":".opencode/commands/create/assets/create_parent_skill_auto.yaml:175","issue":"Registry contract under-specifies the mode shape: only documents advisorRouting={routingClass,advisorDefaultMode,legacyAliases,packetSkillName}; never restates the 3-tier discriminator (workflowMode/runtimeLoopType/backendKind), the top-level `packet` field, or legacyAdvisorId — exactly the fields parent-skill-check.cjs HARD-requires (3c/3d at :204-228) and the projection keys on (4b at :265). step_5 self-validation (:286-289) also omits these checks, so a literal reading can report STATUS=OK yet fail /doctor:parent-skill.","fix":"Restate the full mode shape in registry_requirements/step_2/step_5 to match parent_skill_registry_template.json (discriminator + packet + legacyAdvisorId), and add discriminator/packet/routingClass-enum assertions to step_5 so the command's success gate equals the doctor gate.","confidence":"high"},{"severity":"P1","path":".opencode/commands/create/assets/create_parent_skill_auto.yaml:283","issue":"Command reports 'Registry advisorRouting coverage: PASSED' but under the C-plus 'no runtime registry read' design a new skill's advisorRouting blocks are inert until matching hardcoded Python DEEP_ROUTING_MODE_BY_KEY / TS DEEP_MODE_BY_CANONICAL entries + a per-skill drift-guard test exist. The contract never performs or surfaces these; an `update` adding a lexical/alias-fold mode silently turns the existing drift-guard test red and the mode never routes.","fix":"Add a post-generation step + completion note that lexical/alias-fold modes require hand-editing the advisor projection maps and the drift-guard test; downgrade the 'coverage PASSED' claim to 'registry-declared (advisor map sync required)'.","confidence":"high"},{"severity":"P1","path":".opencode/commands/create/assets/create_parent_skill_auto.yaml:251","issue":"Hard-encodes 1:1 mode->packet ('no two modes resolve to the same packet folder') and folder==packetSkillName==deep-<mode> (:179,:273, validated :288), but the cited canonical deep-loop-workflows maps 4 modes to one deep-improvement packet and names a packet 'ai-council' (not deep-ai-council). The doctor check enforces neither, so step_5:288 would FAIL a doctor-valid canonical-shaped layout and the update branch mis-handles packet reuse.","fix":"Relax step_2/step_5 to allow many-modes-to-one-packet and grandfathered packet names (match template line 16 + soft gate S1); only enforce deep-<mode> as the default for net-new single-mode packets, not as a hard validation gate.","confidence":"high"},{"severity":"P2","path":".opencode/commands/doctor/scripts/parent-skill-check.cjs:261","issue":"4b dynamic cross-check compares the target's lexical projection against the single live global advisor DEEP_ROUTING_MODE_BY_KEY (only deep-loop-workflows). Any scaffolded non-canonical skill declaring a lexical mode with legacyAdvisorId yields different keys -> 4b FAIL, so such a scaffold cannot cleanly pass /doctor:parent-skill.","fix":"Scope 4b to the canonical target only (skip when basename != deep-loop-workflows) or compare against a per-skill dumped map, so the dynamic cross-check is not a false-fail for newly scaffolded skills.","confidence":"med"}],"clean":false}
===END===

## Findings (structured)

```json
[
  {
    "severity": "P1",
    "path": ".opencode/commands/create/assets/create_parent_skill_auto.yaml:175",
    "issue": "Registry contract under-specifies the mode shape: only documents advisorRouting={routingClass,advisorDefaultMode,legacyAliases,packetSkillName}; never restates the 3-tier discriminator (workflowMode/runtimeLoopType/backendKind), the top-level `packet` field, or legacyAdvisorId \u2014 exactly the fields parent-skill-check.cjs HARD-requires (3c/3d at :204-228) and the projection keys on (4b at :265). step_5 self-validation (:286-289) also omits these checks, so a literal reading can report STATUS=OK yet fail /doctor:parent-skill.",
    "fix": "Restate the full mode shape in registry_requirements/step_2/step_5 to match parent_skill_registry_template.json (discriminator + packet + legacyAdvisorId), and add discriminator/packet/routingClass-enum assertions to step_5 so the command's success gate equals the doctor gate.",
    "confidence": "high"
  },
  {
    "severity": "P1",
    "path": ".opencode/commands/create/assets/create_parent_skill_auto.yaml:283",
    "issue": "Command reports 'Registry advisorRouting coverage: PASSED' but under the C-plus 'no runtime registry read' design a new skill's advisorRouting blocks are inert until matching hardcoded Python DEEP_ROUTING_MODE_BY_KEY / TS DEEP_MODE_BY_CANONICAL entries + a per-skill drift-guard test exist. The contract never performs or surfaces these; an `update` adding a lexical/alias-fold mode silently turns the existing drift-guard test red and the mode never routes.",
    "fix": "Add a post-generation step + completion note that lexical/alias-fold modes require hand-editing the advisor projection maps and the drift-guard test; downgrade the 'coverage PASSED' claim to 'registry-declared (advisor map sync required)'.",
    "confidence": "high"
  },
  {
    "severity": "P1",
    "path": ".opencode/commands/create/assets/create_parent_skill_auto.yaml:251",
    "issue": "Hard-encodes 1:1 mode->packet ('no two modes resolve to the same packet folder') and folder==packetSkillName==deep-<mode> (:179,:273, validated :288), but the cited canonical deep-loop-workflows maps 4 modes to one deep-improvement packet and names a packet 'ai-council' (not deep-ai-council). The doctor check enforces neither, so step_5:288 would FAIL a doctor-valid canonical-shaped layout and the update branch mis-handles packet reuse.",
    "fix": "Relax step_2/step_5 to allow many-modes-to-one-packet and grandfathered packet names (match template line 16 + soft gate S1); only enforce deep-<mode> as the default for net-new single-mode packets, not as a hard validation gate.",
    "confidence": "high"
  },
  {
    "severity": "P2",
    "path": ".opencode/commands/doctor/scripts/parent-skill-check.cjs:261",
    "issue": "4b dynamic cross-check compares the target's lexical projection against the single live global advisor DEEP_ROUTING_MODE_BY_KEY (only deep-loop-workflows). Any scaffolded non-canonical skill declaring a lexical mode with legacyAdvisorId yields different keys -> 4b FAIL, so such a scaffold cannot cleanly pass /doctor:parent-skill.",
    "fix": "Scope 4b to the canonical target only (skip when basename != deep-loop-workflows) or compare against a per-skill dumped map, so the dynamic cross-check is not a false-fail for newly scaffolded skills.",
    "confidence": "med"
  }
]
```
