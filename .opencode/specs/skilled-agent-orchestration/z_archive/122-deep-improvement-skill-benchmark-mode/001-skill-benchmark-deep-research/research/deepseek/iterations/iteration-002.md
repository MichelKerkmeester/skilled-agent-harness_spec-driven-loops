# Iteration 002 — DeepSeek-v4-pro: RQ2 Hint-Free Dispatch Harness Design

**Model:** deepseek-v4-pro | **Iteration:** 2 of 5 | **Date:** 2026-05-30

---

## Focus

Design a credible HINT-FREE dispatch harness for Lane C: run a realistic scenario against an AI and capture which references/assets it loaded plus its tool trace, WITHOUT leaking the expected answer/path into the prompt. This iteration answers three interconnected design questions: (a) how to instrument resource-load capture, (b) how to hold out the expected-resource key, and (c) how to avoid prompt contamination.

---

## Actions Taken

1. **Re-read** deep-agent-improvement SKILL.md §2 (Smart Router) lines 97-214 — the `INTENT_SIGNALS` keyword-to-intent map, `RESOURCE_MAP` intent-to-path map, `RUNTIME_ASSETS` always/conditional loading, and `discover_markdown_resources()` as the canonical resource inventory function. These ARE the expected-resource key. [SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:97-214]

2. **Re-read** deep-agent-improvement SKILL.md §3-4 (Lane A/B structure) — the three pluggable seams (candidate-source, dispatcher, scorer) and the `--mode=` routing. The existing Lane B dispatcher (`dispatch-model.cjs`) already wraps external CLI invocations with structured return payloads (`{ok, exit_code, stdout, stderr, attempts}`). Lane C can extend this pattern with a `toolTrace` field. [SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:273-282]

3. **Re-read** system-skill-advisor SKILL.md §2 (Smart Router) lines 99-270 — the advisor's own `RESOURCE_MAP` entries, `_guard_in_skill()` path sandboxing, and `load_if_available()` resource tracking. The advisor's existing resource-inventory and guard patterns are directly reusable for Lane C's resource-key generation. [SOURCE: .opencode/skills/system-skill-advisor/SKILL.md:99-270]

4. **Read** sk-doc SKILL.md §2 lines 199-345 — the `route_documentation_resources()` function with `load_if_available()`, `seen` set deduplication, and `inventory` from `discover_markdown_resources()`. These are the reference implementation for how resource loading SHOULD work — Lane C benchmarks whether the AI actually follows this pattern at runtime. [SOURCE: .opencode/skills/sk-doc/SKILL.md:199-345]

5. **Cross-referenced** iteration-001 findings — the five scoring dimensions (D1 routing accuracy, D2 resource discovery, D3 efficiency, D4 skill-on/skill-off ablation, D5 structural connectivity) all depend on the hint-free harness as the data collection layer. Without a clean harness, none of the metrics are measurable. [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/001-skill-benchmark-deep-research/research/deepseek/iterations/iteration-001.md:33-80]

6. **Read** 121-sibling iteration-002 (dispatch-model.cjs generalization) — the Lane B harness already uses `cli-opencode run --model X --agent Y --dir CWD "prompt"` with stdin=ignore and captures `stdout`/`stderr`/`exit_code`. The Lane C harness extends this by adding structured tool-call trace capture. [SOURCE: .opencode/specs/skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode/002-implementation-deep-research/research/iterations/iteration-002.md:64-120]

7. **Web-fetched** Lilian Weng's Prompt Engineering survey (lilianweng.github.io, Mar 2023) — the discussion of "Automatic Prompt Design" (APE, Zhou et al. 2022) shows how to generate instruction candidates from a seed set of input-output pairs WITHOUT leaking the target answer. The APE pattern (generate candidates → score against held-out ground truth → select best) is directly transferable to Lane C's scenario generation. [SOURCE: https://lilianweng.github.io/posts/2023-03-15-prompt-engineering/]

8. **Web-fetched** the Toolformer paper (Schick et al. 2023, arXiv 2302.04761) methodology — the self-supervised API-call annotation pipeline (prompt → annotate potential calls → filter by usefulness → fine-tune) shows how tool-use decisions can be captured at each text-generation step via special tokens (`<API>...</API>`). For Lane C, this maps to capturing Read/Glob calls as structured trace events. [SOURCE: https://arxiv.org/abs/2302.04761]

---

## Findings

### RQ2-A: Instrumenting Resource-Load Capture

The harness must capture every `Read()` and `Glob()` call the dispatched AI makes, along with the file paths it targets. Three instrumentation approaches are feasible, at increasing levels of invasiveness:

#### Approach 1: CLI Output Parse (Least Invasive, Most Practical)

All `cli-X` binaries in this repo emit structured JSONL or parseable stdout when invoked. The Lane B `dispatch-model.cjs` already captures `stdout` and `stderr` from these invocations [SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:274-279]. For Lane C, the existing `cli-opencode` tool can be invoked with a wrapper that parses the full exchange log:

```
cli-opencode run --model deepseek-v4-pro --agent general --dir <workspace> 'prompt here'
```

The output includes every tool call the AI made. A post-processing script (`scripts/skill-benchmark/extract-tool-trace.cjs`) parses the stdout to extract:
- File paths from `Read(filePath: ...)`
- File paths from `Glob(pattern: ...)`
- Tool-call order and timestamps
- Total token consumption (from the final summary line)

The key advantage: zero changes to existing CLI binaries. The harness wraps them as black boxes and parses the exchanged log.

#### Approach 2: Tool-Proxy Wrapper (Moderate Invasiveness, Higher Fidelity)

Wrap the CLI binary in a tool-proxy that intercepts every function call:

```javascript
// tool-proxy.cjs — wraps cli-opencode to capture structured tool-call traces
const { spawn } = require('child_process');

function dispatchWithTrace(scenario, opts = {}) {
  return new Promise((resolve) => {
    const toolCalls = [];
    const child = spawn(opts.binary, [
      'run',
      '--model', opts.model,
      '--agent', opts.agent,
      '--dir', opts.workspaceDir,
      scenario.prompt,
    ]);

    let stdoutBuffer = '';
    child.stdout.on('data', (chunk) => {
      stdoutBuffer += chunk.toString();
      // Parse tool-call patterns from streaming output:
      const readMatches = chunk.toString().matchAll(/Read\("([^"]+)"\)/g);
      for (const m of readMatches) {
        toolCalls.push({
          type: 'Read',
          path: m[1],
          timestamp: Date.now(),
          callIndex: toolCalls.length,
        });
      }
    });

    child.on('close', (exitCode) => {
      resolve({
        exitCode,
        stdout: stdoutBuffer,
        toolCalls,
        totalToolCalls: toolCalls.length,
        uniqueFilesRead: [...new Set(toolCalls.filter(c => c.type === 'Read').map(c => c.path))],
        firstSkillResourceIndex: toolCalls.findIndex(c =>
          c.path.includes('/.opencode/skills/')),
      });
    });
  });
}
```

This approach captures the tool-call trace as a structured JSON array during the run, rather than parsing the full output afterward. It requires no changes to the AI binary itself.

#### Approach 3: OpenCode MCP Intercept (Most Invasive, Gold Standard)

Since OpenCode exposes MCP tools natively, the tool-call trace can be captured at the MCP transport layer. This is the same approach the system-spec-kit's own `session_bootstrap` and `session_resume` use to track tool calls — the serialized transport records every `tool_use` block with its arguments. For Lane C, this means:

- Run the scenario via the OpenCode runtime directly (not through a CLI binary)
- Capture the full session's tool-call log from the runtime's internal trace buffer
- Filter to Read/Glob/Bash calls targeting files under `.opencode/skills/<target-skill>/`

This approach is the highest fidelity but couples the harness to the OpenCode runtime. **Recommendation: Layer approaches — use Approach 1 (CLI output parse) as the default, with Approach 3 as an opt-in high-fidelity mode for skills where fine-grained trace analysis matters.**

### RQ2-B: Holding Out the Expected-Resource Key

The expected-resource key is derived from the skill's own metadata. For each scenario, the key is:

```
scenario_key = {
  skill_slug: "deep-agent-improvement",
  expected_intent: "MODEL_BENCHMARK",              // from INTENT_SIGNALS classification
  expected_resources: [                             // from RESOURCE_MAP[MODEL_BENCHMARK]
    "references/model-benchmark/benchmark_operator_guide.md",
    "references/model-benchmark/evaluator_contract.md",
  ],
  expected_runtime_assets: [                        // from RUNTIME_ASSETS
    "assets/model-benchmark/benchmark-profiles/default.json",
  ],
  always_resources: [                               // from RUNTIME_ASSETS["ALWAYS"]
    "assets/agent-improvement/improvement_config.json",
  ],
}
```

[SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:113-138]

This key is NEVER included in the prompt. It is stored in the scenario definition file (`benchmark-scenarios/<skill-slug>/scenario-NNN.json`) and loaded only by the scoring pipeline AFTER the run completes. The scoring pipeline compares the captured tool-call trace against this key:

```javascript
// Scoring pipeline (post-run):
const trace = JSON.parse(fs.readFileSync(runOutputPath, 'utf8'));
const key = JSON.parse(fs.readFileSync(scenarioKeyPath, 'utf8'));

// D2: Resource Discovery Score
const expectedPaths = new Set([
  ...key.expected_resources,
  ...key.expected_runtime_assets,
  ...key.always_resources,
].map(p => `.opencode/skills/${key.skill_slug}/${p}`));

const foundPaths = new Set(trace.uniqueFilesRead.filter(p =>
  p.startsWith(`.opencode/skills/${key.skill_slug}/`)));

const hitRate = [...expectedPaths].filter(p => foundPaths.has(p)).length / expectedPaths.size;
const falsePositiveRate = [...foundPaths].filter(p => !expectedPaths.has(p)).length / (foundPaths.size || 1);
```

**Hold-out integrity:** The scenario definition file lives at a path that the AI has no reason to read (e.g., `.opencode/specs/.../benchmark-scenarios/`), and the key is formatted as a machine-readable JSON — the AI would need to actively Read() this file and misinterpret it as instructions, which is highly unlikely in a domain-generic prompt.

**Multiple correct paths:** The expected-resource key is a SET, not an ordered list. The AI can load the expected resources in any order. The scoring only checks set membership (hit rate), not order. This aligns with iteration-001's finding that skills don't have deterministic "correct chains" — the same task can be solved by reading references in different orders. [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/001-skill-benchmark-deep-research/research/deepseek/iterations/iteration-001.md:127]

### RQ2-C: Avoiding Prompt Contamination

Prompt contamination is the core challenge: if the prompt includes the skill's name, its trigger phrases, or paths to its resources, the AI can "cheat" by direct lookup rather than demonstrating genuine skill discovery.

#### Contamination Categories

| Category | Example Contamination | Clean Alternative |
|---|---|---|
| **Skill name** | "Use the deep-agent-improvement skill to..." | "I need to improve an agent prompt file systematically..." |
| **Trigger phrases** | "Run a model-benchmark loop" | "I want to measure how different models perform on repeatable tests..." |
| **Resource paths** | "Read references/model-benchmark/benchmark_operator_guide.md" | Never include paths; let the AI discover them |
| **Intent keywords** | "benchmark a model" (exact match to INTENT_SIGNALS keyword) | "I need to evaluate model quality across multiple runs..." |
| **Command names** | "Run /deep:start-model-benchmark-loop" | "Is there a way to automatically benchmark AI models?" |

#### Clean Prompt Construction Protocol

The prompt is constructed from the scenario's `domain_description` — a natural-language description of the TASK the user wants to accomplish, phrased in domain-generic terms. The construction protocol:

1. **Start with the task intent** — what real-world problem does the user have?
2. **Phrase in domain terms**, not skill terms — "I need to systematically test whether my AI agent's instruction file can be improved" (NOT "run agent-improvement mode")
3. **Include the necessary context** — enough information for the AI to understand what's needed, but not enough to bypass discovering the skill
4. **Omit the skill catalog** — never list available skills, trigger phrases, or resource paths
5. **Validate with contamination check** — a pre-run grep against the prompt for all trigger_phrases, intent keywords, and resource paths should return zero matches

Example clean prompt for the MODEL_BENCHMARK intent:

```
I have a set of benchmark problems that I want to run against different AI models.
Each problem has a prompt, an expected output shape, and a scoring rubric.
I need to: (1) run each model against each problem, (2) score the outputs, (3) compare
results across models, and (4) produce a report showing which model performed best.

The benchmark problems are in JSON files under a fixtures/ directory.
The models I want to test are: claude-sonnet-4-20250514, gpt-5.1, and deepseek-v4-pro.

How should I set this up? What's the most systematic way to do this?
```

This prompt:
- Describes the PROBLEM (benchmarking models against fixtures) in domain terms
- Includes enough detail for the AI to form a task model
- Does NOT mention "deep-agent-improvement", "model-benchmark", "Lane B", or any resource path
- Does NOT use any trigger phrase from the skill's frontmatter [SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:6-14]

#### Contamination Validation: Pre-Run Grep Gate

Before dispatching any scenario, a validation script runs a grep across the prompt text against the skill's contamination dictionary:

```javascript
// contamination-check.cjs — gate before dispatch
function checkContamination(prompt, skillMetadata) {
  const hits = [];
  const dict = [
    ...skillMetadata.trigger_phrases,
    ...Object.values(skillMetadata.INTENT_SIGNALS).flatMap(i => i.keywords),
    ...Object.values(skillMetadata.RESOURCE_MAP).flat(),
    ...Object.values(skillMetadata.RUNTIME_ASSETS).flat(),
    skillMetadata.name,
  ];

  for (const term of dict) {
    if (prompt.toLowerCase().includes(term.toLowerCase())) {
      hits.push({ term, category: 'contamination' });
    }
  }

  return {
    clean: hits.length === 0,
    hits,
    recommendation: hits.length > 0
      ? 'Prompt contains skill-specific terms — rewrite using domain-generic language'
      : 'Prompt passes contamination check',
  };
}
```

The scenario is rejected before dispatch if `clean: false`. This is a hard gate — no contaminated prompts ever reach the AI.

### RQ2-D: End-to-End Harness Flow

Putting it all together, the full harness flow:

```
┌─────────────────────────────────────────────────────────┐
│ 1. SCENARIO LOAD                                        │
│    scenario.json → { prompt, expected_intent,            │
│                      expected_resources, skill_slug }    │
├─────────────────────────────────────────────────────────┤
│ 2. CONTAMINATION GATE (RQ2-C)                           │
│    grep prompt against contamination dict → PASS/FAIL   │
│    FAIL → reject scenario, log contamination hits        │
├─────────────────────────────────────────────────────────┤
│ 3. DISPATCH (RQ2-A)                                     │
│    dispatch-model.cjs → cli-opencode run ...             │
│    Capture stdout + tool-call trace (Approach 1 or 3)    │
├─────────────────────────────────────────────────────────┤
│ 4. TRACE PARSE                                          │
│    extract-tool-trace.cjs → { toolCalls[], filesRead[] } │
│    Parse Read/Glob/Bash calls from output                │
├─────────────────────────────────────────────────────────┤
│ 5. SCORE AGAINST HELD-OUT KEY (RQ2-B)                   │
│    Load expected key → compute D1-D5 metrics             │
│    D1: Was the correct skill loaded?                     │
│    D2: Did the correct resources get opened?             │
│    D3: Tool calls / tokens / latency to first resource   │
│    D4: Skill-on vs skill-off output comparison           │
│    D5: Static structural checks                          │
├─────────────────────────────────────────────────────────┤
│ 6. REPORT                                               │
│    reduce-state.cjs → composite scores + findings        │
│    score-skill-benchmark.cjs → remediation-ranked report │
└─────────────────────────────────────────────────────────┘
```

**Key invariants:**
- The expected-resource key NEVER crosses the dispatch boundary (steps 1-2 → 3)
- The AI sees only the domain-generic prompt (step 3)
- The scoring pipeline loads the key separately (step 5)
- Contamination is a hard pre-dispatch gate (step 2)

### RQ2-E: Prior Art in Hint-Free Evaluation

The APE (Automatic Prompt Engineer, Zhou et al. 2022) workflow provides the closest analog to hint-free dispatch:

> APE generates instruction candidates from input-output DEMONSTRATIONS (not from the truth label), then scores them against a held-out evaluation set. The instruction candidates are generated without seeing the evaluation data. [SOURCE: https://lilianweng.github.io/posts/2023-03-15-prompt-engineering/]

Lane C's analog: the scenario prompt is generated from a domain description (the equivalent of APE's demonstrations), and scored against the held-out expected-resource key (the equivalent of APE's evaluation set). The AI never sees the key.

The BFCL v4 "Irrelevance Detection" category tests whether the model correctly identifies when no function should be called. Lane C's analog: each scenario batch includes "negative scenarios" — prompts in the skill's domain where invoking the skill would be INCORRECT. The contamination gate ensures these negative prompts don't leak the skill's name either. [SOURCE: https://gorilla.cs.berkeley.edu/leaderboard.html]

---

## Recommendations

1. **Implement Approach 1 (CLI Output Parse) as the default trace capture method.** It requires zero changes to existing CLI binaries and reuses the existing Lane B dispatch pattern. The post-run `extract-tool-trace.cjs` parser regex-matches `Read(filePath: ...)` patterns from stdout.

2. **Use the skill's own `RESOURCE_MAP` + `RUNTIME_ASSETS` as the expected-resource key.** This is the canonical source of truth — the skill's author already declared which resources should be loaded for which intents. The benchmark measures whether the AI actually follows this map at runtime.

3. **Implement the contamination check as a pre-dispatch hard gate.** The contamination dictionary = skill name + all trigger_phrases + all INTENT_SIGNALS keywords + all RESOURCE_MAP paths + all RUNTIME_ASSETS paths. Any match rejects the scenario.

4. **Adopt the clean prompt construction protocol.** Scenarios store a `domain_description` (the real-world problem in domain terms) and an `expected_intent` (which skill intent should match). The prompt is constructed from the domain_description, never from the expected_intent or expected_resources.

5. **Include negative scenarios (irrelevance detection) in every benchmark batch.** One in every N scenarios should be a prompt where the target skill should NOT be invoked. This measures routing precision (D1) — distinguishing when a skill is needed vs when it isn't.

6. **Use set membership (not ordered list) for resource-path scoring.** The AI can discover resources in any order. The scoring checks whether the expected set was covered, not whether the exploration order matches any prescribed path.

---

## Open Questions

- **RQ2-F: Trace depth — first-skill-resource vs all skill-resources?** The harness can stop tracing after the first skill resource is loaded (measures time-to-activation), or continue tracing the entire session (measures depth of resource exploration). Both are useful and may warrant separate metrics — initialActivationLatency vs fullResourceCoverage.

- **RQ2-G: Multi-skill scenarios?** The current design assumes one target skill per scenario. What about prompts that legitimately require multiple skills (e.g., "improve an agent file, document it, then commit and create a PR")? The expected-resource key would need to be a union across multiple skills.

- **RQ2-H: Skill-on vs skill-off — how to prevent cached knowledge?** For D4 ablation, the skill-off run must ensure the AI doesn't already "know" the skill's contents from training data. A skill-off run on a brand-new skill (just created) would be the gold standard, but isn't always feasible. Alternative: run skill-off first, then skill-on, to prevent contamination between runs.

- **RQ2-I: Tool-call trace capture reliability across executor CLIs.** The regex-based trace parser (Approach 1) must work across cli-opencode, cli-claude-code, cli-codex, cli-gemini, and cli-devin. Do all these binaries emit Read() calls in a parseable format? The 121 Lane B dispatch-model.cjs already standardizes stdout capture — the trace parser should be tested against each executor's output format.

- **RQ2-J: Expected-resource key staleness.** Skill authors update `RESOURCE_MAP` and `RUNTIME_ASSETS` over time. How does the benchmark detect that the expected-resource key is stale (references a file that was renamed/removed) and flag it before running? This is partially covered by D5 (structural connectivity), but needs a pre-run liveness check.
