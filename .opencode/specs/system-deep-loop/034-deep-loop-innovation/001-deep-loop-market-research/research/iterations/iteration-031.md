<!-- iteration 31 | model sol (gpt-5.6-sol) | angle: Reflection loops: measured gains vs hype | 2026-07-14T23:48:28.491Z -->

The evidence rejects “reflection” as a generally beneficial loop primitive. The critical survey finds reliable gains mainly when feedback is externally verifiable or correction is explicitly trained. Reflexion’s 91% HumanEval result is therefore a composite gain from tests, evaluator signals, retries, and memory—not proof that unguided introspection works. Its Rust ablation actually fell from 60% to 52% when reflection lacked tests. ([critical survey](https://aclanthology.org/2024.tacl-1.78/), [Reflexion](https://arxiv.org/abs/2303.11366))

Self-Refine’s reported ~20-point average similarly hides task and prompt heterogeneity. Later controls found a stronger one-shot prompt scoring 81.8 versus 75.1 after seven refinement calls; oracle-gated correction and unmatched budgets also inflate apparent gains. ([Self-Refine](https://papers.neurips.cc/paper_files/paper/2023/hash/91edff07232fb1b55a505a9e9f6c0ff3-Abstract-Conference.html), [Huang et al.](https://arxiv.org/abs/2310.01798))

For `deep-improvement`, reflection should be a conditional repair route: preserve the original candidate, record feedback provenance and correct→wrong transitions, localize the error before rewriting, require independent evidence before promotion, and restart from clean context after a rejected trajectory. Training can make correction real—SCoRe reports +15.6 points on MATH and +9.1 on HumanEval—but that is learned policy, not prompt-time reflection magic. ([SCoRe](https://proceedings.iclr.cc/paper_files/paper/2025/hash/871ac99fdc5282d0301934d23945ebaa-Abstract-Conference.html))

```json
{
  "new_repos": [
    {
      "name": "RLHFlow/Self-rewarding-reasoning-LLM",
      "url": "https://github.com/RLHFlow/Self-rewarding-reasoning-LLM",
      "stars": "~231",
      "what": "Training and evaluation recipes for self-rewarding correction; last default-branch commit 2025-03-02.",
      "lesson": "Measure wrong-to-correct and correct-to-wrong separately; prompted correction hurt badly while trained correction produced net gains.",
      "maps_to": [
        "deep-improvement",
        "runtime/convergence",
        "runtime/gauges-observability",
        "runtime/budget-cost"
      ],
      "confidence": "high"
    },
    {
      "name": "WHGTyen/BIG-Bench-Mistake",
      "url": "https://github.com/WHGTyen/BIG-Bench-Mistake",
      "stars": "~89",
      "what": "First-error-location benchmark over five reasoning tasks; five commits and last push in 2024.",
      "lesson": "Split reflection into locate_error, validate_location, and repair_from_boundary instead of permitting an unconstrained rewrite.",
      "maps_to": [
        "deep-review",
        "deep-improvement",
        "runtime/convergence",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    },
    {
      "name": "open-compass/CriticEval",
      "url": "https://github.com/open-compass/CriticEval",
      "stars": "~49",
      "what": "NeurIPS 2024 benchmark separating feedback, comparison, correction, and meta-feedback; last commit 2024-11-29.",
      "lesson": "Calibrate critic capabilities separately; good critique prose or ranking ability does not imply safe revision.",
      "maps_to": [
        "deep-review",
        "deep-improvement",
        "deep-ai-council",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    },
    {
      "name": "princeton-pli/Contextual-Drag",
      "url": "https://github.com/princeton-pli/Contextual-Drag",
      "stars": "~10",
      "what": "2026 code for an 11-model, eight-task study of failed drafts contaminating later reasoning; 11 commits and no releases.",
      "lesson": "Quarantine rejected rationales and send only structured failure evidence into a clean-context repair branch.",
      "maps_to": [
        "deep-improvement",
        "runtime/continuity-threading",
        "runtime/state-jsonl-checkpointing",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    }
  ],
  "insights": [
    {
      "insight": "Reflection eligibility should depend on feedback provenance: intrinsic, peer, tool, environment, human, and oracle feedback must not be pooled. Preserve the original candidate and require verified improvement before promotion.",
      "evidence": "https://aclanthology.org/2024.tacl-1.78/ ; https://arxiv.org/abs/2303.11366",
      "maps_to": [
        "deep-improvement",
        "runtime/state-jsonl-checkpointing",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    },
    {
      "insight": "Use a transition ledger and continue only when P(initial-wrong)*P(W→C) exceeds P(initial-correct)*P(C→W) plus marginal token and tool cost. On MATH, prompted correction changed 65.4% to 51.4% with 15.4% C→W; trained IFT+DPO changed 72.8% to 78.6% with 6.0% W→C and 0.2% C→W.",
      "evidence": "https://github.com/RLHFlow/Self-rewarding-reasoning-LLM",
      "maps_to": [
        "deep-improvement",
        "runtime/convergence",
        "runtime/gauges-observability",
        "runtime/budget-cost"
      ],
      "confidence": "high"
    },
    {
      "insight": "Error localization is the bottleneck, not necessarily repair: best exact localization was 52.87%, while supplying the true first-error location enabled substantial backtracking gains. Route unlocalized cases to independent branches rather than destructive refinement.",
      "evidence": "https://aclanthology.org/2024.findings-acl.826/",
      "maps_to": [
        "deep-review",
        "deep-improvement",
        "runtime/fan-out-fan-in",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    },
    {
      "insight": "Failed trajectories are active contaminants: contextual drag caused 10–20% drops across 11 models and eight tasks, surviving external feedback and successful self-verification. Store rejected traces for audit, but exclude them from the next model context unless distilled into evidence-bound failure facts.",
      "evidence": "https://arxiv.org/abs/2602.04288",
      "maps_to": [
        "deep-improvement",
        "runtime/continuity-threading",
        "runtime/state-jsonl-checkpointing",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    },
    {
      "insight": "Reflective memory needs admission control. A 2026 study found 16 frozen ALFWorld environments where none of 121 reflections named the correct target; programmatic failure extraction raised correct mentions from 0% to 86% and reduced reflection repetition from 0.64 to 0.10.",
      "evidence": "https://arxiv.org/abs/2605.29463",
      "maps_to": [
        "deep-improvement",
        "runtime/dedup-novelty",
        "runtime/continuity-threading",
        "runtime/gauges-observability"
      ],
      "confidence": "med"
    }
  ],
  "contradictions": [
    {
      "claim": "Reflexion's 91% HumanEval result shows that verbal self-reflection reliably improves agents.",
      "counter": "Reflection without generated tests scored 52% versus a 60% base; tests plus reflection reached 68%. External evidence quality is load-bearing for deep-improvement.",
      "evidence": "https://arxiv.org/abs/2303.11366"
    },
    {
      "claim": "Self-Refine improves task performance by roughly 20 absolute points on average.",
      "counter": "Math gains were nearly flat, and a resource-strong one-shot prompt scored 81.8 versus 75.1 after a seven-call refinement workflow; runtime/budget-cost needs matched-call baselines.",
      "evidence": "https://papers.neurips.cc/paper_files/paper/2023/hash/91edff07232fb1b55a505a9e9f6c0ff3-Abstract-Conference.html ; https://arxiv.org/abs/2310.01798"
    },
    {
      "claim": "LLMs cannot intrinsically self-correct.",
      "counter": "Neutral zero-temperature prompts show small, fragile gains, while trained policies such as SCoRe show substantial gains. Reflection policy and correction capability are distinct for deep-improvement.",
      "evidence": "https://arxiv.org/abs/2406.15673 ; https://proceedings.iclr.cc/paper_files/paper/2025/hash/871ac99fdc5282d0301934d23945ebaa-Abstract-Conference.html"
    },
    {
      "claim": "Adding external feedback is sufficient to make iterative reflection safe.",
      "counter": "Contextual drag persisted despite external feedback and successful verification; runtime/continuity-threading must also remove or quarantine the failed rationale.",
      "evidence": "https://arxiv.org/abs/2602.04288"
    }
  ],
  "next_angles": [
    "Actor-author bias: causally compare self-authored, peer-authored, tool-role, and memory-role errors while holding the erroneous text identical.",
    "Reflection-memory poisoning: replay raw failures versus structured failure summaries versus clean-room restarts, measuring repetition, structural drag, recovery, and token cost.",
    "Build a resource-symmetric benchmark comparing strong one-shot, matched-budget best-of-N, gated reflection, tool-verified repair, and trained correction on the same model snapshots."
  ],
  "notes": "The main coverage gap is causal comparability: many studies mix oracle stopping, stronger revision prompts, retries, generated tests, and unmatched token budgets. Results also remain concentrated in objective reasoning and coding; research synthesis, open-ended review, and long-lived JSONL memory need dedicated transition and contamination benchmarks."
}
```


----- stderr -----
Reading additional input from stdin...
OpenAI Codex v0.144.4
--------
workdir: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-deep-loop/065-deep-loop-innovation/001-deep-loop-market-research/scratch
model: gpt-5.6-sol
provider: openai
approval: never
sandbox: read-only
reasoning effort: ultra
reasoning summaries: none
session id: 019f6302-6bc4-7de2-902d-31486d6b0488
--------
user
You are iteration 31/45 of a NON-CONVERGING (deliberately BROADENING) research loop mapping the state of the art in LOOP ENGINEERING for agentic / iterative AI systems.
The goal is to improve "system-deep-loop": a parent skill that runs iterative deep-research, deep-review, multi-agent deliberation, self-improvement, and alignment loops on top of an externalized-state (JSONL) runtime with convergence math, fan-out/fan-in, dedup/novelty scoring, budget control, and observability gauges.

THIS ITERATION'S ANGLE: Reflection loops: measured gains vs hype
DIRECTIVE: Critical read of Reflexion/self-refine efficacy studies; where reflection helps vs hurts. Log contradictions. Map to deep-improvement.

You have live web search ENABLED. Use it to find REAL, currently-existing GitHub repositories, papers, and authoritative docs. For every repo you MUST give its real URL and, where findable, approximate GitHub star count and a recency signal (last release / commit year). Do NOT invent repos, URLs, or numbers — if unsure, mark confidence "low" and say what you could not verify.

BROADEN — do not repeat prior coverage. Here is what has already been gathered:
Repos already catalogued (145) — do NOT re-list these, find NEW ones or go deeper/adjacent:
  Q00/ouroboros, OpenHands/software-agent-sdk, strongdm/attractor, AIDASLab/MATA, egmaminta/GEPA-Lite, google/ax, langchain-ai/langgraph, temporalio/temporal, restatedev/restate, dbos-inc/dbos-transact-py, microsoft/agent-framework, google/adk-python, ray-project/ray, apache/beam, togethercomputer/MoA, UKGovernmentBEIS/inspect_ai, stanfordnlp/dspy, confident-ai/deepteam, ScalerLab/JudgeBench, openai/prm800k, noahshinn/reflexion, madaan/self-refine, ysymyth/ReAct, spcl/graph-of-thoughts, ace-agent/ace, karpathy/llm-council, machine-theory/lm-council, thunlp/ChatEval, S-Abdelnabi/LLM-Deliberation, Henrymachiyu/Multi_Agent_Judge_Bias, mem0ai/mem0, getzep/graphiti, microsoft/graphrag, microsoft/Mnemis, DSAIL-Memory/EvoMemBench, pydantic/pydantic-ai, BerriAI/litellm, GeniusHTX/TALE, sajjadanwar0/token-budgets, microsoft/LLMLingua, eunomia-bpf/agentsight, open-telemetry/semantic-conventions-genai, Arize-ai/openinference, langfuse/langfuse, comet-ml/opik, stanford-oval/storm, langchain-ai/open_deep_research, OpenBMB/UltraRAG, Ayanami0730/arag, sciknoworg/deep-research, inngest/inngest, hatchet-dev/hatchet, dbos-inc/dbos-transact-golang, microsoft/durabletask-go, langchain-ai/langgraphjs, langchain-ai/agent-protocol, langchain-ai/deepagents, redis-developer/langgraph-redis, ag2ai/ag2, crewAIInc/crewAI, microsoft/autogen, zou-group/textgrad, microsoft/Trace, microsoft/PromptWizard, google-deepmind/opro, meta-llama/prompt-ops, SWE-agent/SWE-agent, SWE-agent/mini-swe-agent, huggingface/smolagents, SWE-agent/SWE-ReX, hyang0129/onlycodes, promptfoo/promptfoo, UKGovernmentBEIS/inspect_evals, ServiceNow/AgentLab, sierra-research/tau2-bench, xlang-ai/OSWorld, google/vizier, optuna/optuna, zhengkid/AutoTTS, Xieyangxinyu/reasoning_uncertainty, QianJaneXie/CostAwareStoppingBayesOpt, microsoft/lost_in_conversation, microsoft/DELEGATE52, OpenAutoCoder/Agentless, slhleosun/reasoning-trajectory, wzy6642/ProCo, texttron/hyde, Raudaschl/rag-fusion, au-clan/Diverge, deepset-ai/haystack, run-llama/llama_index, MemTensor/MemOS, letta-ai/letta-code, agiresearch/A-mem, LLM-VLM-GSL/AriadneMem, aiming-lab/SimpleMem, agentscope-ai/agentscope, trpc-group/trpc-agent-go, aixgo-dev/aixgo, langchain-ai/langchain, yuchenlin/LLM-Blender, aws/aws-durable-execution-sdk-python, triggerdotdev/trigger.dev, conductor-oss/conductor, argoproj/argo-workflows, mastra-ai/mastra, openai/openai-agents-python, cloudflare/agents, ag-ui-protocol/ag-ui, ResearAI/DeepScientist, agentscope-ai/AgentTeams, microsoft/best-route-llm, junhongmit/P-and-B, Pranjal2041/AdaptiveConsistency, simplescaling/s1, raymin0223/mixture_of_recursions, microsoft/agent-lightning, github/gh-aw, MAS-Infra-Layer/Agent-Git, ServiceNow/BrowserGym, ethz-spylab/agentdojo, SakanaAI/treequest, hao-ai-lab/Dynasor, VainF/Thinkless, ScalingIntelligence/large_language_monkeys, automl/DEHB, apache/spark, dask/distributed, PrefectHQ/prefect, hibiken/asynq, uxlfoundation/oneTBB, i-Eval/FairEval, tatsu-lab/alpaca_eval, microsoft/LLM-Rubric, NEUIR/Genii, S3IC-Lab/RobustJudge, terrierteam/ir_measures, decile-team/submodlib, scikit-bio/scikit-bio, guilgautier/DPPy, dapr/dapr-agents, get-convex/workflow, kurrent-io/KurrentDB, hazelcast/hazelcast, nanomaoli/llm_reproducibility
Angles already covered: Loop control & termination policies | State externalization, checkpointing, resumability | Fan-out / fan-in orchestration | Evaluator / critic / verifier loops | Reflection & self-improvement | Multi-agent deliberation / debate | Dedup, novelty & knowledge accumulation | Budget / cost / depth control | Observability & gauges | Research-loop specific technique | Durable-execution engines for loop resumability | LangGraph persistence/checkpointing internals | AutoGen/AG2 + CrewAI orchestration patterns | DSPy / TextGrad — optimization-as-loop | Coding-agent loop control (OpenHands/SWE-agent/smolagents) | Eval harnesses as loops (Inspect/promptfoo) | Convergence math & formal stopping rules | CONTRADICTION: when NOT to loop | Query reformulation & source diversification | Cross-iteration memory & knowledge accumulation | Reducer / aggregator design patterns | Partial-failure tolerance, retries, idempotency | Human-in-the-loop / steering / interrupt-resume | Cost economics & adaptive-depth scheduling | GAP-SWEEP #1: adjacent ecosystems uncovered | Contradiction audit: convergent vs divergent | Determinism under concurrency (fan-out correctness) | Evaluator reliability: LLM-as-judge failure modes | Novelty/coverage metrics that formally drive broadening | Durable-execution ↔ agent-loop mapping (deep)
Insights so far: 149; contradictions logged: 91.
Open threads prior iterations flagged: Calibrate Good-Turing and capture-recapture unseen-mass estimators under adaptive, non-IID agent search and correlated source families. | Design a versioned semantic-aspect ontology with split/merge lineage so coverage cannot be inflated by clustering drift. | Replay historical JSONL trajectories through the two-axis STOP/PIVOT policy and measure premature-stop, unnecessary-pivot and budget-regret deltas. | Compare quality-weighted k-DPP, submodular facility location and farthest-first fan-out under family-correlated agent failures. | Build a Jepsen-style crash-point matrix for runtime/state-jsonl-checkpointing and runtime/locks-recovery across pre-send, post-send, post-response, pre-fsync, and post-fsync failures. | Survey provider-specific request idempotency and status-reconciliation support, then quantify duplicate-token and duplicate-effect exposure in runtime/budget-cost. | Fuzz replay compatibility across driver, policy, prompt, model, rubric, and tool-schema upgrades for runtime/continuity-threading and deep-improvement. | Compare first-current-epoch-wins, evaluator-selected, and human-reviewed policies when multiple valid LLM responses emerge from one indeterminate logical call.

Map every finding to at least one concrete system-deep-loop target from this list: deep-research, deep-review, deep-ai-council, deep-improvement, deep-alignment, runtime/convergence, runtime/fan-out-fan-in, runtime/dedup-novelty, runtime/gauges-observability, runtime/state-jsonl-checkpointing, runtime/budget-cost, runtime/locks-recovery, runtime/continuity-threading.

Write a concise analysis (what you found + why it transfers), THEN end your message with a SINGLE fenced json block that is valid JSON and the LAST thing in your message, matching exactly:
```json
{
  "new_repos": [{"name":"owner/repo","url":"https://...","stars":"~N or unknown","what":"one line","lesson":"transferable lesson for system-deep-loop","maps_to":["subsystem"],"confidence":"high|med|low"}],
  "insights": [{"insight":"one specific transferable idea","evidence":"repo/paper/url","maps_to":["subsystem"],"confidence":"high|med|low"}],
  "contradictions": [{"claim":"","counter":"","evidence":""}],
  "next_angles": ["a specific divergent angle worth exploring next"],
  "notes": "coverage gaps you noticed"
}
```
Target 2-5 NEW repos and 2-5 insights. Novelty and verifiable specifics over volume. If this angle is genuinely exhausted, return few/no new_repos but propose sharp next_angles (that is the divergent pivot, not a failure).
codex
I’m treating this as read-only research inside the existing deep-loop packet, so no spec-folder write gate is needed. I’ll triangulate efficacy claims against critical self-correction studies, then verify any new repositories’ URLs, stars, and activity signals before including them.
web search: 
web search: site:arxiv.org LLM self-correction reflection cannot self-correct reasoning critical study external feedback ...
web search: 
web search: CorrectBench GitHub Guiyao Tie self correction ...
web search: 
web search: site:arxiv.org "Can LLMs find reasoning errors" self-correction ...
web search: 
web search: site:arxiv.org "LLMs cannot find reasoning errors" paper ...
web search: 
web search: "BIG-Bench Mistake" GitHub ...
web search: 
web search: https://api.github.com/repos/WHGTyen/BIG-Bench-Mistake
web search: 
web search: github WHGTyen BIG-Bench-Mistake stars ...
exec
/bin/zsh -lc 'for repo in WHGTyen/BIG-Bench-Mistake polgrisha/ToolReflection PlusLabNLP/VISCO HCR050806/CorrectBench ryokamoi/llm-self-correction-papers Michael98Liu/self-reflection DCDmllm/Meta-Reflection; do curl -L -s "https://api.github.com/repos/$repo" | jq -r '"'[.full_name,.stargazers_count,.pushed_at,.updated_at,.html_url] | @tsv'; done" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-deep-loop/065-deep-loop-innovation/001-deep-loop-market-research/scratch
 succeeded in 0ms:
codex
The critical distinction is already emerging: “reflection” is not one mechanism. Intrinsic diagnosis, externally grounded verification, and revision after a localized error have very different outcomes. I’m using the GitHub repository workflow now because search snippets omit reliable star/activity metadata; this is verification, not additional scope.
exec
/bin/zsh -lc "sed -n '1,240p' /Users/michelkerkmeester/.codex/plugins/cache/openai-curated-remote/github/0.1.8-2841cf9749ae/skills/github/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-deep-loop/065-deep-loop-innovation/001-deep-loop-market-research/scratch
 succeeded in 0ms:
---
name: github
description: Triage and orient GitHub repository, pull request, and issue work through the connected GitHub app. Use when the user asks for general GitHub help, wants PR or issue summaries, or needs repository context before choosing a more specific GitHub workflow.
---

# GitHub

## Overview

Use this skill as the umbrella entrypoint for general GitHub work in this plugin. It should decide whether the task stays in repo and PR triage or should be handed off to a more specific review, CI, or publish workflow.

This plugin is intentionally hybrid:

- Prefer the GitHub app from this plugin for repository, issue, pull request, comment, label, reaction, and PR creation workflows.
- Use local `git` and `gh` only when the connector does not cover the job well, especially for current-branch PR discovery, branch creation, commit and push, `gh auth status`, and GitHub Actions log inspection.
- Keep connector state and local checkout context aligned. If the request is about the current branch, resolve the local repo and branch before acting.

Once the intent is clear, route to the specialist skill immediately and do not keep broad GitHub triage in scope longer than needed.

## Connector-First Responsibilities

Handle these directly in this skill when the request does not need a narrower specialist workflow:

- repository orientation once the repo, PR, issue, or local checkout is identified
- recent PR or issue triage
- PR metadata summaries
- PR patch inspection
- PR comments, labels, and reactions
- issue lookup and summarization
- PR creation after a branch is already pushed

Prefer the GitHub app from this plugin for those flows because it provides structured PR, issue, and review-adjacent data without depending on a local checkout. If the repository is not already identifiable from the user request or local git context, ask for the repo instead of pretending there is a repo-search flow that may not exist.

## Routing Rules

1. Resolve the operating context first:
   - If the user provides a repository, PR number, issue number, or URL, use that.
   - If the request is about "this branch" or "the current PR", resolve local git context and use `gh` only as needed to discover the branch PR.
   - If the repository is still ambiguous after local inspection, ask for the repo identifier.
2. Classify the request before taking action:
   - `repo or PR triage`: summarize PRs, issues, patches, comments, labels, reactions, or repository state
   - `review follow-up`: unresolved review threads, requested changes, or inline review feedback
   - `CI debugging`: failing checks, Actions logs, or CI root-cause analysis
   - `publish changes`: create or switch branches, stage changes, commit, push, and open a draft PR
3. Route to the specialist skill as soon as the category is clear:
   - Review comments and requested changes: `../gh-address-comments/SKILL.md`
   - Failing GitHub Actions checks: `../gh-fix-ci/SKILL.md`
   - Commit, push, and open PR: `../yeet/SKILL.md`
4. Keep the hybrid model consistent after routing:
   - connector first for PR and issue data
   - local `git` and `gh` only for the specific gaps the connector does not cover

## Default Workflow

1. Resolve repository and item scope.
2. Gather structured PR or issue context through the GitHub app from this plugin.
3. Decide whether the task stays in connector-backed triage or needs a specialist skill.
4. Route immediately when the work becomes review follow-up, CI debugging, or publish workflow.
5. End with a clear summary of what was inspected, what changed, and what remains.

## Output Expectations

- For triage requests, return a concise summary of the repository, PR, or issue state and the next likely action.
- For mixed requests, tell the user which specialist path you are taking and why.
- For connector-backed write actions, restate the exact PR, issue, label, or reaction target before applying the change.
- Never imply that GitHub Actions logs are available through the connector alone. That remains a `gh` workflow.

## Examples

- "Use GitHub to summarize the open PRs in this repo and tell me what needs attention."
- "Help with this PR."
- "Review the latest comments on PR 482 and tell me what is actionable."
- "Debug the failing checks on this branch."
- "Commit these changes, push them, and open a draft PR."

mcp: codex_apps/github.search_repositories started
mcp: codex_apps/github.search_repositories started
mcp: codex_apps/github.search_repositories started
mcp: codex_apps/github.search_repositories started
mcp: codex_apps/github.search_repositories started
mcp: codex_apps/github.search_repositories started
mcp: codex_apps/github.search_repositories started
mcp: codex_apps/github.search_repositories (completed)
mcp: codex_apps/github.search_repositories (completed)
mcp: codex_apps/github.search_repositories (completed)
mcp: codex_apps/github.search_repositories (completed)
mcp: codex_apps/github.search_repositories (completed)
mcp: codex_apps/github.search_repositories (completed)
mcp: codex_apps/github.search_repositories (completed)
mcp: codex_apps/github.search_repositories started
mcp: codex_apps/github.search_repositories started
mcp: codex_apps/github.search_repositories started
mcp: codex_apps/github.search_repositories started
mcp: codex_apps/github.search_repositories (completed)
mcp: codex_apps/github.search_repositories (completed)
mcp: codex_apps/github.search_repositories (completed)
mcp: codex_apps/github.search_repositories (completed)
mcp: codex_apps/github.search_repositories started
mcp: codex_apps/github.search_repositories started
mcp: codex_apps/github.search_repositories started
mcp: codex_apps/github.search_repositories started
mcp: codex_apps/github.search_repositories started
mcp: codex_apps/github.search_repositories started
mcp: codex_apps/github.search_repositories started
mcp: codex_apps/github.search_repositories started
mcp: codex_apps/github.search_repositories started
mcp: codex_apps/github.search_repositories started
mcp: codex_apps/github.search_repositories started
mcp: codex_apps/github.search_repositories started
mcp: codex_apps/github.search_repositories started
mcp: codex_apps/github.search_repositories started
mcp: codex_apps/github.search_repositories started
mcp: codex_apps/github.search_repositories started
mcp: codex_apps/github.search_repositories started
mcp: codex_apps/github.search_repositories started
mcp: codex_apps/github.search_repositories started
mcp: codex_apps/github.search_repositories started
mcp: codex_apps/github.search_repositories started
mcp: codex_apps/github.search_repositories started
mcp: codex_apps/github.search_repositories started
mcp: codex_apps/github.search_repositories started
mcp: codex_apps/github.search_repositories started
mcp: codex_apps/github.search_repositories started
mcp: codex_apps/github.search_repositories started
mcp: codex_apps/github.search_repositories started
mcp: codex_apps/github.search_repositories started
mcp: codex_apps/github.search_repositories started
mcp: codex_apps/github.search_repositories started
mcp: codex_apps/github.search_repositories started
mcp: codex_apps/github.search_repositories started
mcp: codex_apps/github.search_repositories started
mcp: codex_apps/github.search_repositories started
mcp: codex_apps/github.search_repositories started
mcp: codex_apps/github.search_repositories started
mcp: codex_apps/github.search_repositories started
mcp: codex_apps/github.search_repositories started
mcp: codex_apps/github.search_repositories started
mcp: codex_apps/github.search_repositories (completed)
mcp: codex_apps/github.search_repositories (completed)
mcp: codex_apps/github.search_repositories (completed)
mcp: codex_apps/github.search_repositories (completed)
mcp: codex_apps/github.search_repositories (completed)
mcp: codex_apps/github.search_repositories (completed)
mcp: codex_apps/github.search_repositories (completed)
mcp: codex_apps/github.search_repositories (completed)
mcp: codex_apps/github.search_repositories (completed)
mcp: codex_apps/github.search_repositories (completed)
mcp: codex_apps/github.search_repositories (completed)
mcp: codex_apps/github.search_repositories (completed)
mcp: codex_apps/github.search_repositories (completed)
mcp: codex_apps/github.search_repositories (completed)
mcp: codex_apps/github.search_repositories (completed)
mcp: codex_apps/github.search_repositories (completed)
mcp: codex_apps/github.search_repositories (completed)
mcp: codex_apps/github.search_repositories (completed)
mcp: codex_apps/github.search_repositories (completed)
mcp: codex_apps/github.search_repositories (completed)
mcp: codex_apps/github.search_repositories (completed)
mcp: codex_apps/github.search_repositories (completed)
mcp: codex_apps/github.search_repositories (completed)
mcp: codex_apps/github.search_repositories (completed)
mcp: codex_apps/github.search_repositories (completed)
mcp: codex_apps/github.search_repositories (completed)
mcp: codex_apps/github.search_repositories (completed)
mcp: codex_apps/github.search_repositories (completed)
mcp: codex_apps/github.search_repositories (completed)
mcp: codex_apps/github.search_repositories (completed)
mcp: codex_apps/github.search_repositories (completed)
mcp: codex_apps/github.search_repositories (completed)
mcp: codex_apps/github.search_repositories (completed)
mcp: codex_apps/github.search_repositories (failed)
mcp: codex_apps/github.search_repositories (failed)
mcp: codex_apps/github.search_repositories (failed)
mcp: codex_apps/github.search_repositories (failed)
mcp: codex_apps/github.search_repositories (failed)
mcp: codex_apps/github.search_repositories (failed)
mcp: codex_apps/github.search_repositories (failed)
mcp: codex_apps/github.search_repositories started
mcp: codex_apps/github.search_repositories started
mcp: codex_apps/github.search_repositories started
mcp: codex_apps/github.search_repositories started
mcp: codex_apps/github.search_repositories started
mcp: codex_apps/github.search_repositories started
mcp: codex_apps/github.search_repositories started
mcp: codex_apps/github.search_repositories started
mcp: codex_apps/github.search_repositories started
mcp: codex_apps/github.search_repositories started
mcp: codex_apps/github.search_repositories started
mcp: codex_apps/github.search_repositories started
mcp: codex_apps/github.search_repositories started
mcp: codex_apps/github.search_repositories started
mcp: codex_apps/github.search_repositories started
mcp: codex_apps/github.search_repositories started
mcp: codex_apps/github.search_repositories started
mcp: codex_apps/github.search_repositories started
mcp: codex_apps/github.search_repositories started
mcp: codex_apps/github.search_repositories started
mcp: codex_apps/github.search_repositories started
mcp: codex_apps/github.search_repositories started
mcp: codex_apps/github.search_repositories (failed)
mcp: codex_apps/github.search_repositories (failed)
mcp: codex_apps/github.search_repositories (failed)
mcp: codex_apps/github.search_repositories (failed)
mcp: codex_apps/github.search_repositories (failed)
mcp: codex_apps/github.search_repositories (failed)
mcp: codex_apps/github.search_repositories (completed)
mcp: codex_apps/github.search_repositories (completed)
mcp: codex_apps/github.search_repositories (completed)
mcp: codex_apps/github.search_repositories (completed)
mcp: codex_apps/github.search_repositories (completed)
mcp: codex_apps/github.search_repositories (completed)
mcp: codex_apps/github.search_repositories (completed)
mcp: codex_apps/github.search_repositories (completed)
mcp: codex_apps/github.search_repositories (completed)
mcp: codex_apps/github.search_repositories (completed)
mcp: codex_apps/github.search_repositories (completed)
mcp: codex_apps/github.search_repositories (completed)
mcp: codex_apps/github.search_repositories (completed)
mcp: codex_apps/github.search_repositories (completed)
mcp: codex_apps/github.search_repositories (completed)
mcp: codex_apps/github.search_repositories (completed)
mcp: codex_apps/github.search_repositories started
mcp: codex_apps/github.search_repositories started
mcp: codex_apps/github.search_repositories started
mcp: codex_apps/github.search_repositories started
mcp: codex_apps/github.search_repositories started
mcp: codex_apps/github.search_repositories started
mcp: codex_apps/github.search_repositories started
mcp: codex_apps/github.search_repositories started
mcp: codex_apps/github.search_repositories started
mcp: codex_apps/github.search_repositories (completed)
mcp: codex_apps/github.search_repositories (completed)
mcp: codex_apps/github.search_repositories (completed)
mcp: codex_apps/github.search_repositories (completed)
mcp: codex_apps/github.search_repositories (completed)
mcp: codex_apps/github.search_repositories (completed)
mcp: codex_apps/github.search_repositories (completed)
mcp: codex_apps/github.search_repositories (completed)
mcp: codex_apps/github.search_repositories (completed)
mcp: codex_apps/github.search_repositories started
mcp: codex_apps/github.search_repositories started
mcp: codex_apps/github.search_repositories started
mcp: codex_apps/github.search_repositories started
mcp: codex_apps/github.search_repositories started
mcp: codex_apps/github.search_repositories started
mcp: codex_apps/github.search_repositories started
mcp: codex_apps/github.search_repositories started
mcp: codex_apps/github.search_repositories started
mcp: codex_apps/github.search_repositories started
mcp: codex_apps/github.search_repositories started
mcp: codex_apps/github.search_repositories started
mcp: codex_apps/github.search_repositories started
mcp: codex_apps/github.search_repositories started
mcp: codex_apps/github.search_repositories started
mcp: codex_apps/github.search_repositories started
mcp: codex_apps/github.search_repositories started
mcp: codex_apps/github.search_repositories started
mcp: codex_apps/github.search_repositories started
mcp: codex_apps/github.search_repositories started
mcp: codex_apps/github.search_repositories (completed)
mcp: codex_apps/github.search_repositories (completed)
mcp: codex_apps/github.search_repositories (completed)
mcp: codex_apps/github.search_repositories (completed)
mcp: codex_apps/github.search_repositories (completed)
mcp: codex_apps/github.search_repositories (completed)
mcp: codex_apps/github.search_repositories (completed)
mcp: codex_apps/github.search_repositories (completed)
mcp: codex_apps/github.search_repositories (completed)
mcp: codex_apps/github.search_repositories (completed)
mcp: codex_apps/github.search_repositories (completed)
mcp: codex_apps/github.search_repositories (completed)
mcp: codex_apps/github.search_repositories (completed)
mcp: codex_apps/github.search_repositories (completed)
mcp: codex_apps/github.search_repositories (completed)
mcp: codex_apps/github.search_repositories (completed)
mcp: codex_apps/github.search_repositories (completed)
mcp: codex_apps/github.search_repositories (completed)
mcp: codex_apps/github.search_repositories (failed)
mcp: codex_apps/github.search_repositories (failed)
web search: 
web search: site:arxiv.org 2502.19613 Self-rewarding reasoning LLM self-correction 65.4 51.4 ...
web search: 
web search: https://arxiv.org/abs/2402.13764
web search: 
web search: 'Star '
web search: 
web search: 
web search: 
web search: https://github.com/WHGTyen/BIG-Bench-Mistake
web search: 
web search: 
2026-07-14T23:46:17.668421Z ERROR codex_core::tools::router: error=timeout_ms must be at least 10000
codex
Measured results now support a narrower claim than the hype: reflection helps when it is a gated, evidence-backed repair operation; it hurts when the same model both diagnoses and rewrites without a trustworthy error boundary. I’m checking two remaining confounds—cost-matched baselines and contamination from failed trajectories—before fixing the final transfer rules.
web search: 
web search: https://arxiv.org/abs/2303.11366
web search: 
web search: Reflexion HumanEval Rust 52 60 68 test generation reflection ablation ...
web search: 
web search: https://proceedings.iclr.cc/paper_files/paper/2025/hash/871ac99fdc5282d0301934d23945ebaa-Abstract-Conference.html
codex
The evidence rejects “reflection” as a generally beneficial loop primitive. The critical survey finds reliable gains mainly when feedback is externally verifiable or correction is explicitly trained. Reflexion’s 91% HumanEval result is therefore a composite gain from tests, evaluator signals, retries, and memory—not proof that unguided introspection works. Its Rust ablation actually fell from 60% to 52% when reflection lacked tests. ([critical survey](https://aclanthology.org/2024.tacl-1.78/), [Reflexion](https://arxiv.org/abs/2303.11366))

Self-Refine’s reported ~20-point average similarly hides task and prompt heterogeneity. Later controls found a stronger one-shot prompt scoring 81.8 versus 75.1 after seven refinement calls; oracle-gated correction and unmatched budgets also inflate apparent gains. ([Self-Refine](https://papers.neurips.cc/paper_files/paper/2023/hash/91edff07232fb1b55a505a9e9f6c0ff3-Abstract-Conference.html), [Huang et al.](https://arxiv.org/abs/2310.01798))

For `deep-improvement`, reflection should be a conditional repair route: preserve the original candidate, record feedback provenance and correct→wrong transitions, localize the error before rewriting, require independent evidence before promotion, and restart from clean context after a rejected trajectory. Training can make correction real—SCoRe reports +15.6 points on MATH and +9.1 on HumanEval—but that is learned policy, not prompt-time reflection magic. ([SCoRe](https://proceedings.iclr.cc/paper_files/paper/2025/hash/871ac99fdc5282d0301934d23945ebaa-Abstract-Conference.html))

```json
{
  "new_repos": [
    {
      "name": "RLHFlow/Self-rewarding-reasoning-LLM",
      "url": "https://github.com/RLHFlow/Self-rewarding-reasoning-LLM",
      "stars": "~231",
      "what": "Training and evaluation recipes for self-rewarding correction; last default-branch commit 2025-03-02.",
      "lesson": "Measure wrong-to-correct and correct-to-wrong separately; prompted correction hurt badly while trained correction produced net gains.",
      "maps_to": [
        "deep-improvement",
        "runtime/convergence",
        "runtime/gauges-observability",
        "runtime/budget-cost"
      ],
      "confidence": "high"
    },
    {
      "name": "WHGTyen/BIG-Bench-Mistake",
      "url": "https://github.com/WHGTyen/BIG-Bench-Mistake",
      "stars": "~89",
      "what": "First-error-location benchmark over five reasoning tasks; five commits and last push in 2024.",
      "lesson": "Split reflection into locate_error, validate_location, and repair_from_boundary instead of permitting an unconstrained rewrite.",
      "maps_to": [
        "deep-review",
        "deep-improvement",
        "runtime/convergence",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    },
    {
      "name": "open-compass/CriticEval",
      "url": "https://github.com/open-compass/CriticEval",
      "stars": "~49",
      "what": "NeurIPS 2024 benchmark separating feedback, comparison, correction, and meta-feedback; last commit 2024-11-29.",
      "lesson": "Calibrate critic capabilities separately; good critique prose or ranking ability does not imply safe revision.",
      "maps_to": [
        "deep-review",
        "deep-improvement",
        "deep-ai-council",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    },
    {
      "name": "princeton-pli/Contextual-Drag",
      "url": "https://github.com/princeton-pli/Contextual-Drag",
      "stars": "~10",
      "what": "2026 code for an 11-model, eight-task study of failed drafts contaminating later reasoning; 11 commits and no releases.",
      "lesson": "Quarantine rejected rationales and send only structured failure evidence into a clean-context repair branch.",
      "maps_to": [
        "deep-improvement",
        "runtime/continuity-threading",
        "runtime/state-jsonl-checkpointing",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    }
  ],
  "insights": [
    {
      "insight": "Reflection eligibility should depend on feedback provenance: intrinsic, peer, tool, environment, human, and oracle feedback must not be pooled. Preserve the original candidate and require verified improvement before promotion.",
      "evidence": "https://aclanthology.org/2024.tacl-1.78/ ; https://arxiv.org/abs/2303.11366",
      "maps_to": [
        "deep-improvement",
        "runtime/state-jsonl-checkpointing",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    },
    {
      "insight": "Use a transition ledger and continue only when P(initial-wrong)*P(W→C) exceeds P(initial-correct)*P(C→W) plus marginal token and tool cost. On MATH, prompted correction changed 65.4% to 51.4% with 15.4% C→W; trained IFT+DPO changed 72.8% to 78.6% with 6.0% W→C and 0.2% C→W.",
      "evidence": "https://github.com/RLHFlow/Self-rewarding-reasoning-LLM",
      "maps_to": [
        "deep-improvement",
        "runtime/convergence",
        "runtime/gauges-observability",
        "runtime/budget-cost"
      ],
      "confidence": "high"
    },
    {
      "insight": "Error localization is the bottleneck, not necessarily repair: best exact localization was 52.87%, while supplying the true first-error location enabled substantial backtracking gains. Route unlocalized cases to independent branches rather than destructive refinement.",
      "evidence": "https://aclanthology.org/2024.findings-acl.826/",
      "maps_to": [
        "deep-review",
        "deep-improvement",
        "runtime/fan-out-fan-in",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    },
    {
      "insight": "Failed trajectories are active contaminants: contextual drag caused 10–20% drops across 11 models and eight tasks, surviving external feedback and successful self-verification. Store rejected traces for audit, but exclude them from the next model context unless distilled into evidence-bound failure facts.",
      "evidence": "https://arxiv.org/abs/2602.04288",
      "maps_to": [
        "deep-improvement",
        "runtime/continuity-threading",
        "runtime/state-jsonl-checkpointing",
        "runtime/gauges-observability"
      ],
      "confidence": "high"
    },
    {
      "insight": "Reflective memory needs admission control. A 2026 study found 16 frozen ALFWorld environments where none of 121 reflections named the correct target; programmatic failure extraction raised correct mentions from 0% to 86% and reduced reflection repetition from 0.64 to 0.10.",
      "evidence": "https://arxiv.org/abs/2605.29463",
      "maps_to": [
        "deep-improvement",
        "runtime/dedup-novelty",
        "runtime/continuity-threading",
        "runtime/gauges-observability"
      ],
      "confidence": "med"
    }
  ],
  "contradictions": [
    {
      "claim": "Reflexion's 91% HumanEval result shows that verbal self-reflection reliably improves agents.",
      "counter": "Reflection without generated tests scored 52% versus a 60% base; tests plus reflection reached 68%. External evidence quality is load-bearing for deep-improvement.",
      "evidence": "https://arxiv.org/abs/2303.11366"
    },
    {
      "claim": "Self-Refine improves task performance by roughly 20 absolute points on average.",
      "counter": "Math gains were nearly flat, and a resource-strong one-shot prompt scored 81.8 versus 75.1 after a seven-call refinement workflow; runtime/budget-cost needs matched-call baselines.",
      "evidence": "https://papers.neurips.cc/paper_files/paper/2023/hash/91edff07232fb1b55a505a9e9f6c0ff3-Abstract-Conference.html ; https://arxiv.org/abs/2310.01798"
    },
    {
      "claim": "LLMs cannot intrinsically self-correct.",
      "counter": "Neutral zero-temperature prompts show small, fragile gains, while trained policies such as SCoRe show substantial gains. Reflection policy and correction capability are distinct for deep-improvement.",
      "evidence": "https://arxiv.org/abs/2406.15673 ; https://proceedings.iclr.cc/paper_files/paper/2025/hash/871ac99fdc5282d0301934d23945ebaa-Abstract-Conference.html"
    },
    {
      "claim": "Adding external feedback is sufficient to make iterative reflection safe.",
      "counter": "Contextual drag persisted despite external feedback and successful verification; runtime/continuity-threading must also remove or quarantine the failed rationale.",
      "evidence": "https://arxiv.org/abs/2602.04288"
    }
  ],
  "next_angles": [
    "Actor-author bias: causally compare self-authored, peer-authored, tool-role, and memory-role errors while holding the erroneous text identical.",
    "Reflection-memory poisoning: replay raw failures versus structured failure summaries versus clean-room restarts, measuring repetition, structural drag, recovery, and token cost.",
    "Build a resource-symmetric benchmark comparing strong one-shot, matched-budget best-of-N, gated reflection, tool-verified repair, and trained correction on the same model snapshots."
  ],
  "notes": "The main coverage gap is causal comparability: many studies mix oracle stopping, stronger revision prompts, retries, generated tests, and unmatched token budgets. Results also remain concentrated in objective reasoning and coding; research synthesis, open-ended review, and long-lived JSONL memory need dedicated transition and contamination benchmarks."
}
```
hook: Stop
hook: Stop Completed
tokens used
191,195
