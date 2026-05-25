DEEP-RESEARCH

ROLE
You are a SWE-1.6 deep-research iteration worker (LEAF, read-only except this packet's output files). Run exactly ONE research cycle, then exit. Do not dispatch sub-agents.

MANDATORY FIRST STEP
Call mcp__sequential_thinking__sequentialthinking with at least 5 thoughts: (1) pre-plan, (2) read evidence, (3) extract findings with file:line/path, (4) gaps, (5) compose JSONL record. Only then emit outputs.

CONTEXT
- Topic: Deprecate `mcp-coco-index` + `system-rerank-sidecar`; decouple `system-code-graph` from CocoIndex.
- Iteration: 6 of 12. FOCUS = RQ7 — DELETION COMPLETENESS: the non-source artifacts that must also be removed/cleaned, beyond the file edits already mapped.
- Repo root (cwd): /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
- READ FIRST: strategy.md, iterations 001-005 (known inventory — add NET-NEW only).
- SCOPE: `.opencode/specs/**` = FROZEN.

ACTION (pre-planned, <= 12 tool calls)
1. Read strategy.md + scan iterations 001-005 headers.
2. RQ7 — enumerate deletion-completeness items with path + how-to-verify-gone:
   - venvs: `.opencode/skills/mcp-coco-index/mcp_server/.venv`, `.opencode/skills/system-rerank-sidecar/.venv` (+ any pip editable installs / direct_url.json pointing at them).
   - bundled scripts under each skill: `mcp-coco-index/scripts/{install,doctor,ensure_ready,update,common}.sh`, `system-rerank-sidecar/scripts/{install,start,use-model,rerank_sidecar.py,ensure_rerank_sidecar.py}` + `tests/`.
   - runtime/daemon artifacts (gitignored, on disk): `~/.cocoindex_code/` (daemon.sock, daemon.pid, daemon.log), `.cocoindex_code/` index dir at repo root, sidecar reaper telemetry `~/Library/Logs/spec-kit/sidecar-reaper.jsonl`, port 8765 references.
   - HuggingFace model cache: `~/.cache/huggingface/hub/models--Qwen--Qwen3-Reranker-0.6B` and the nomic/CodeRankEmbed cache (note: cache is shared infra — classify as OPTIONAL-cleanup, not a repo delete).
   - git hooks / scripts referencing coco/ccc/rerank: `.github/hooks/scripts/session-start.sh`, `.opencode/scripts/*` (install-git-hooks, copy-skill-advisor, post-commit), `.opencode/commands/doctor/scripts/mcp-doctor.sh` doctor checks.
   - `package.json` / dependency manifests pinning cocoindex or sidecar deps; `.gitignore` entries.
   - the `cocoindex_code` skill's own `changelog/`, `INSTALL_GUIDE.md`, `references/`, `assets/` (all die with the skill DELETE, but confirm no cross-skill imports).
3. Flag which items are repo-tracked DELETE vs on-disk runtime CLEANUP (operator machine) vs shared-infra OPTIONAL.
4. Note gaps for iteration 7.

FORMAT (write exactly these two, then exit)
A) Write `.../001-touchpoint-research/research/iterations/iteration-006.md`:
   - `## Focus (RQ7)`
   - `## Deletion-completeness items` — table: `Path | Type (repo-delete / runtime-cleanup / shared-optional) | Verify-gone | Note`
   - `## Cross-skill import check` — does anything outside the 2 deleted skills import their code? (cite)
   - `## Gaps for next iteration`
   - Every claim cites `[SOURCE: file:line]` or `[SOURCE: path]`.
B) Append ONE line to `.../001-touchpoint-research/research/deep-research-state.jsonl`:
   `{"type":"iteration","iteration":6,"newInfoRatio":<0..1>,"status":"complete","focus":"RQ7 deletion completeness","novelty":"<one sentence>","timestamp":"<ISO-8601 now>","sessionId":"dr-014-001-touchpoint-20260525","generation":1}`

CONSTRAINTS
- Read-only outside the two packet output files. Report findings only.
- Never edit `.opencode/specs/**`. Stay within ~10 tool calls; stop after the two outputs.
