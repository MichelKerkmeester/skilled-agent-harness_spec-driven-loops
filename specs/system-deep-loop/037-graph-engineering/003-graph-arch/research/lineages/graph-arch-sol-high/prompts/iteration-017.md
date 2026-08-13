DEEP-RESEARCH
Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Research Iteration 17 of 20

## Focus

Blog-corpus grounding pass B. Read and synthesize exactly the remaining six blog files in lexical filename order:

1. `Graph Engineering: After Loops, This Is How You Wire Multi-Agent Orgs.md`
2. `Harness, Loop, or Graph? Building Reliable Agent Systems at the Right Layer.md`
3. `How to Build a Self-Correcting AI Loop That Catches Its Own Mistakes Before You See Them.md`
4. `How to Use Graph Engineering to Build a Multi-Factor Alpha Model.md`
5. `LOOP ⭢ GRAPH ⭢ HARNESS: build the whole pipeline in one sitting.md`
6. `What is Graph Engineering.md`

For each post, extract only claims that confirm/refine/extend/contradict a specific study-1/study-2 or iteration-3–16 decision; isolate unsupported marketing/generalization. Test GraphARC implementation fidelity. Produce a six-post evidence matrix, cross-post tensions, interactions with pass A, and when-not-to-use boundaries. Do not repeat established decisions without a new source-backed delta.

## Outputs and constraints

Read `.opencode/agents/deep-research.md` completely and lineage state first. One LEAF iteration, 3–5 batched actions, no subagents. Write only `iterations/iteration-017.md`, append one state record, and `deltas/iter-017.jsonl`. Ensure the delta first line is the canonical iteration record. Every finding cited. Route proof iteration/run 17 with executor `cli-codex/gpt-5.6-sol/high/fast`. Continue to max iterations.
