# Iteration 6: Prompt-technique / framework registry (pluggable + mutation)

- **Executor**: cli-codex gpt-5.5, reasoning=high, service_tier=fast, sandbox=read-only
- **Dispatch exit code**: 0
- **Tokens used**: 127,192

---

## Codex findings (verbatim)

The current implementation has two partial patterns, but no reusable framework registry yet.

**1. Current 126/004 Shape**

In [frameworks.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/z_archive/101-cli-opencode-mimo-pro-optimization/004-mimo-prompt-framework-benchmark/eval/frameworks.cjs:28), `frameworks` is an array of five JS objects. Each has `id`, `name`, `long`, `preplanning_density`, and `render: (f) => ...`. The harness imports that array and calls `fw.render(fx)` directly in [run-mimo-bench.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/z_archive/101-cli-opencode-mimo-pro-optimization/004-mimo-prompt-framework-benchmark/eval/run-mimo-bench.cjs:24) and [run-mimo-bench.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/z_archive/101-cli-opencode-mimo-pro-optimization/004-mimo-prompt-framework-benchmark/eval/run-mimo-bench.cjs:132).

The shared helpers interpolate `fixture.fn_name` and `fixture.signature` into the output contract at [frameworks.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/z_archive/101-cli-opencode-mimo-pro-optimization/004-mimo-prompt-framework-benchmark/eval/frameworks.cjs:12), and constraints are hard-coded prose at [frameworks.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/z_archive/101-cli-opencode-mimo-pro-optimization/004-mimo-prompt-framework-benchmark/eval/frameworks.cjs:21). The fixtures expose exactly the slots this file consumes: `id`, `fn_name`, `task`, `signature`, and tests in [fixtures.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/z_archive/101-cli-opencode-mimo-pro-optimization/004-mimo-prompt-framework-benchmark/eval/fixtures.cjs:8).

Definitions:
- `rcaf`: `render: (f) =>` inserts `constraints(f)`, `f.task`, and `outputContract(f)` under Role/Context/Action/Format in [frameworks.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/z_archive/101-cli-opencode-mimo-pro-optimization/004-mimo-prompt-framework-benchmark/eval/frameworks.cjs:30).
- `race`: `render: (f) =>` inserts `f.task`, `constraints(f)`, and `outputContract(f)` under Role/Action/Context/Expectation in [frameworks.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/z_archive/101-cli-opencode-mimo-pro-optimization/004-mimo-prompt-framework-benchmark/eval/frameworks.cjs:51).
- `cidi`: `render: (f) =>` inserts `outputContract(f)`, `constraints(f)`, and `f.task` under Context/Instructions/Details/Input in [frameworks.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/z_archive/101-cli-opencode-mimo-pro-optimization/004-mimo-prompt-framework-benchmark/eval/frameworks.cjs:72).
- `tidd-ec`: `render: (f) =>` inserts `f.task`, `f.fn_name`, `outputContract(f)`, and `f.signature` under Task/Instructions/Do’s/Don’ts/Examples/Context in [frameworks.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/z_archive/101-cli-opencode-mimo-pro-optimization/004-mimo-prompt-framework-benchmark/eval/frameworks.cjs:94).
- `costar`: `render: (f) =>` inserts `constraints(f)`, `f.task`, and `outputContract(f)` under Context/Objective/Style/Tone/Audience/Response in [frameworks.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/z_archive/101-cli-opencode-mimo-pro-optimization/004-mimo-prompt-framework-benchmark/eval/frameworks.cjs:126).

This is one-off because the framework is executable code, not data. Adding CRISPE, CRAFT, a custom technique, or a density variant requires editing `frameworks.cjs`, not adding a template file.

**2. Existing Canonical Catalog**

`sk-prompt` has canonical framework knowledge, but not a machine-readable framework-template catalog. [SKILL.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-prompt/SKILL.md:12) says it provides seven text frameworks, and [SKILL.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-prompt/SKILL.md:73) says framework definitions live in markdown resources. The router explicitly discovers only `.md` files and rejects non-markdown routable resources in [SKILL.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-prompt/SKILL.md:126).

The actual seven-framework matrix is prose/table data in [patterns_evaluation.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-prompt/references/patterns_evaluation.md:28): RCAF, COSTAR, RACE, CIDI, TIDD-EC, CRISPE, CRAFT. The same file has YAML-style examples for RCAF at [patterns_evaluation.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-prompt/references/patterns_evaluation.md:98), CRISPE at [patterns_evaluation.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-prompt/references/patterns_evaluation.md:235), and CRAFT at [patterns_evaluation.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-prompt/references/patterns_evaluation.md:280).

There is a JSON registry, but it is model metadata, not framework templates. [model-profiles.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-prompt/references/model-profiles.md:10) defines `assets/model-profiles.json` as the small-model source of truth, and [model-profiles.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-prompt/references/model-profiles.md:41) documents fields like model id, executors, provider, context length, quota pool, fallback. It contains prompt-framework notes, for example MiniMax “TIDD-EC + dense pre-planning” in [model-profiles.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-prompt/assets/model-profiles.json:197), but those are freeform notes, not structured templates.

**3. Framework-Source Seam**

Use a data catalog plus one slot renderer. The older 120 renderer already proves the shape: it reads frontmatter/body templates, then does slot replacement for fixture and variant metadata in [render-variant.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/z_archive/098-cli-opencode-minimax-optimization/003-minimax-prompt-framework-benchmark/eval-loop/scripts/render-variant.cjs:27) and [render-variant.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/z_archive/098-cli-opencode-minimax-optimization/003-minimax-prompt-framework-benchmark/eval-loop/scripts/render-variant.cjs:54).

Proposed schema:

```json
{
  "version": "1.0",
  "frameworks": [
    {
      "id": "tidd-ec",
      "name": "TIDD-EC",
      "description": "Task / Instructions / Do's / Don'ts / Examples / Context",
      "applies_to": ["coding", "review", "compliance", "quality-critical"],
      "slots": ["task", "fn_name", "signature", "context", "constraints", "output_contract"],
      "template": "## Task\n{task}\n\n## Instructions\n1. Implement `{fn_name}` to satisfy every acceptance criterion.\n2. {output_contract}\n\n## Do's\n{constraints.dos}\n\n## Don'ts\n{constraints.donts}\n\n## Examples\nOutput shape: `{signature} { ... }` and nothing else.\n\n## Context\n{context}",
      "output_contract": {
        "id": "bare-js-function",
        "template": "Return ONLY the JavaScript function source for `{fn_name}` (signature `{signature}`). No prose, no explanation, no test code, no markdown fence."
      }
    }
  ]
}
```

Render flow: normalize fixture into slots, resolve the framework by `id`, derive `output_contract` from the fixture, inject optional technique blocks, interpolate `{slot}` values, and fail closed on unknown or missing required slots. That replaces five hand-written `render()` functions with one renderer.

**4. Pre-Planning Density Axis**

Pre-planning is already measured. The 120 config gives D5 “Pre-plan” weight `0.10` in [eval-loop-config.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/z_archive/098-cli-opencode-minimax-optimization/003-minimax-prompt-framework-benchmark/eval-loop/state/eval-loop-config.json:7), and the deterministic scorer looks for a `<pre-plan>` block, three or more numbered steps, acceptance criteria, and verification commands in [preplanning-regex.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/z_archive/098-cli-opencode-minimax-optimization/003-minimax-prompt-framework-benchmark/eval-rig/scripts/deterministic/preplanning-regex.cjs:7). The mutation config explicitly mutates `framework` and `preplanning_density` in [eval-loop-config.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/z_archive/098-cli-opencode-minimax-optimization/003-minimax-prompt-framework-benchmark/eval-loop/state/eval-loop-config.json:70).

So express density as a technique axis:

```json
{
  "techniques": {
    "preplanning_density": {
      "sparse": { "template": "" },
      "medium": { "template": "Before coding, include a <pre-plan> block with 3-4 ordered steps. Each step names input, output, acceptance criterion, and verification command." },
      "dense": { "template": "Before coding, include a <pre-plan> block with 4-5 ordered steps. Each step includes input, output, risk, acceptance criterion, verification command, and rollback condition." }
    }
  },
  "variants": [
    { "id": "tidd-ec+dense", "framework": "tidd-ec", "techniques": { "preplanning_density": "dense" } }
  ]
}
```

This should be model/profile-overridable. The generic CLI card prefers medium pre-planning in [cli_prompt_quality_card.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-prompt/assets/cli_prompt_quality_card.md:46), while 120/003 MiniMax found dense winning in [synthesis.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/z_archive/098-cli-opencode-minimax-optimization/003-minimax-prompt-framework-benchmark/eval-loop/synthesis.md:23). [cli_prompt_quality_card.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-prompt/assets/cli_prompt_quality_card.md:52) already says per-model overrides live in executor cards.

**5. Mutation / Hill-Climb**

120/003 does not mutate arbitrary prompt sections. It mutates metadata axes. `AXES` contains framework, preplanning density, thinking threshold, bundle gate strictness, and anti-hallucination strength in [mutate.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/z_archive/098-cli-opencode-minimax-optimization/003-minimax-prompt-framework-benchmark/eval-loop/scripts/mutate.cjs:24). It hashes canonical axis metadata in [mutate.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/z_archive/098-cli-opencode-minimax-optimization/003-minimax-prompt-framework-benchmark/eval-loop/scripts/mutate.cjs:36), drains seeded variants first in [mutate.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/z_archive/098-cli-opencode-minimax-optimization/003-minimax-prompt-framework-benchmark/eval-loop/scripts/mutate.cjs:90), then changes one active axis at a time in [mutate.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/z_archive/098-cli-opencode-minimax-optimization/003-minimax-prompt-framework-benchmark/eval-loop/scripts/mutate.cjs:103). The loop proposes, renders, dispatches, scores, updates best, and increments no-improvement count in [loop.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/z_archive/098-cli-opencode-minimax-optimization/003-minimax-prompt-framework-benchmark/eval-loop/scripts/loop.cjs:253).

Reusable support should keep mutation optional. MVP should be static registry bake-off. Later mutation operators map cleanly:
- `switch_framework`: framework id enum.
- `set_preplanning_density`: sparse/medium/dense technique enum.
- `set_thinking_threshold`: numeric metadata/control hint.
- `set_bundle_gate_strictness`: output-contract/verification wording variant.
- `set_anti_hallucination_strength`: constraints block variant.

One caution from evidence: synthesized mutated files currently reuse the first seed body in [loop.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/z_archive/098-cli-opencode-minimax-optimization/003-minimax-prompt-framework-benchmark/eval-loop/scripts/loop.cjs:85), and an on-disk mutated variant says `framework: "TIDD-EC"` while its body still starts `# RCAF dispatch` in [v-mut-49dc891672248d5e.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/z_archive/098-cli-opencode-minimax-optimization/003-minimax-prompt-framework-benchmark/eval-loop/variants/v-mut-49dc891672248d5e.md:1). A registry renderer should render from metadata every time, not synthesize by copying a stale body.

**6. Custom Frameworks**

Zero-code custom framework path: a user adds a template file plus manifest entry, and model/profile selection points at that id. Today `model-profiles.json` has freeform prompt-framework notes for MiniMax and MiMo in [model-profiles.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-prompt/assets/model-profiles.json:197) and [model-profiles.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-prompt/assets/model-profiles.json:263). Make that structured:

```json
{
  "id": "my-custom-framework",
  "description": "Custom planning-heavy code-review framework",
  "template_path": "assets/frameworks/custom/my-custom-framework.md",
  "output_contract": "code-review-findings",
  "applies_to": ["review", "security"],
  "slot_schema": {
    "required": ["task", "context", "constraints", "output_contract"],
    "optional": ["examples", "acceptance_summary"]
  }
}
```

Then a profile can reference `"prompt_profile": { "framework": "my-custom-framework", "preplanning_density": "medium" }`. No new `render()` code.

**Proposals**

1. Add `sk-prompt/assets/framework-registry.json` as the canonical machine-readable framework catalog for RCAF, RACE, CIDI, TIDD-EC, COSTAR, CRISPE, and CRAFT.
2. Add a single renderer that supports `{slot}` interpolation, required-slot validation, and shared output contracts.
3. Move pre-planning density into a technique axis, not framework code, with profile-level overrides.
4. Replace 126/004 `frameworks.cjs` render closures with registry-backed loading.
5. Keep hill-climb optional: static bake-off first, then mutation operators over framework/technique axes.
6. Add custom framework support through manifest entries and template files, with no executable-code changes.

```json
[
  {
    "priority": "P0",
    "target": ".opencode/skills/sk-prompt/assets/framework-registry.json",
    "change": "Create a machine-readable framework registry for the canonical seven frameworks with id, description, applies_to, template, slots, and output_contract.",
    "confidence": 0.94
  },
  {
    "priority": "P0",
    "target": ".opencode/specs/skilled-agent-orchestration/z_archive/101-cli-opencode-mimo-pro-optimization/004-mimo-prompt-framework-benchmark/eval/frameworks.cjs",
    "change": "Replace hard-coded render(fixture) functions with registry-backed template rendering so framework additions are data changes.",
    "confidence": 0.91
  },
  {
    "priority": "P1",
    "target": ".opencode/specs/skilled-agent-orchestration/z_archive/098-cli-opencode-minimax-optimization/003-minimax-prompt-framework-benchmark/eval-loop/scripts/render-variant.cjs",
    "change": "Generalize slot interpolation into a reusable renderer with required-slot validation and support for framework plus technique axes.",
    "confidence": 0.88
  },
  {
    "priority": "P1",
    "target": ".opencode/skills/sk-prompt/assets/model-profiles.json",
    "change": "Replace freeform prompt-framework notes with structured prompt_profile fields: framework, preplanning_density, output_contract, and optional mutation_policy.",
    "confidence": 0.82
  },
  {
    "priority": "P1",
    "target": ".opencode/specs/skilled-agent-orchestration/z_archive/098-cli-opencode-minimax-optimization/003-minimax-prompt-framework-benchmark/eval-loop/scripts/mutate.cjs",
    "change": "Keep mutation optional, but map existing axis mutations to registry operators and render mutated variants from metadata instead of copying a seed body.",
    "confidence": 0.9
  },
  {
    "priority": "P2",
    "target": ".opencode/skills/sk-prompt/assets/frameworks/custom/",
    "change": "Add custom framework template loading via manifest entries so user-defined techniques can be profile-referenced without code changes.",
    "confidence": 0.86
  }
]
```
