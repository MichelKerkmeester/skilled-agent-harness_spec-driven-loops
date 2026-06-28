# Iteration 5 — gpt-5.5 (xhigh, fast) — security
Dispatched 2026-06-28T13:58:54.842Z | wall 248s

---

Found one new security-contract gap. The WebFetch caveat is documented, but the accepted “union grant” is not actually the union on disk.

```json
{"findings":[{"severity":"P1","dimension":"security","title":"ADR-004 accepts a hub union grant that is not actually the union of mode tool contracts","file":".opencode/specs/skilled-agent-orchestration/155-parent-skill-native-invocability/002-deep-loop-alignment/decision-record.md","loc":"line 311","evidence":"ADR-004 says: \"Its `allowed-tools` grant is the union of the tools its nested modes require, including `WebFetch` for deep research.\" The live hub only grants `.opencode/skills/deep-loop-workflows/SKILL.md:5` `allowed-tools: [Read, Write, Edit, Bash, Grep, Glob, Task, WebFetch]`, while mode packets require additional tools: `.opencode/skills/deep-loop-workflows/deep-research/SKILL.md:4` includes `memory_context, memory_search`, and `.opencode/skills/deep-loop-workflows/deep-review/SKILL.md:4` includes `memory_context, memory_search, code_graph_query`.","impact":"NFR-S01 is closed on a permission-contract premise that does not match the repo. If hub tools govern `Skill(deep-loop-workflows)`, research/review may lose mode-required memory/code-graph tools; if mode frontmatter extends grants after dispatch, ADR-004's statement that the hub grant is the union is false and the accepted residual risk is incomplete.","recommendation":"Reconcile the contract: either make the hub `allowed-tools` the real full union and document the broader residual risk, or amend ADR-004/spec/checklist to say the hub is a partial routing grant and cite evidence that selected mode packet grants are applied after dispatch."}],"new_findings_count":1,"dimension_clean":false}
```
