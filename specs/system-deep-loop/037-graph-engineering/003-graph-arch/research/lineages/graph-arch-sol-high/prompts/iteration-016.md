DEEP-RESEARCH
Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Research Iteration 16 of 20

## Focus

Blog-corpus grounding pass A. Read and synthesize exactly the first six blog files in lexical filename order under `specs/system-deep-loop/037-graph-engineering/context/blog-posts/`:

1. `Eval Engineering: build the gate that lets your agents merge without you (full 6-step course).md`
2. `From Loops to Graphs: The Next Paradigm in AI Agent Engineering.md`
3. `Graph Engineering Roadmap.md`
4. `Graph Engineering explained: what it is, when to use it and when not to.md`
5. `Graph Engineering replaced RAG at Microsoft, Stanford and Anthropic. Here's how it works.md`
6. `Graph Engineering with Claude: How to Stop Running a Line and Start Running a Fleet.md`

For each post, extract only claims that confirm/refine/extend/contradict a specific study-1/study-2 or iteration-3–15 decision; identify unsupported marketing/generalization separately. Test whether the concrete GraphARC mechanisms faithfully instantiate the post's governance claims. Produce a six-post evidence matrix, cross-post tensions, and explicit when-not-to-use boundaries. Do not repeat already established decisions unless adding a source-backed delta.

## Outputs and constraints

Read `.opencode/agents/deep-research.md` completely and lineage state first. One LEAF iteration, 3–5 batched actions, no subagents. Write only `iterations/iteration-016.md`, one state append, and `deltas/iter-016.jsonl`. Every finding needs source/inference marker. Route proof iteration/run 16; executor `cli-codex/gpt-5.6-sol/high/fast`. Continue to max iterations.
