# Iteration 009 — Traceability A8 (cross-runtime config & gemini-removal completeness)

## Dispatcher
- **Run:** 9 (dispatch slot) — JSONL-derived count = 3 (committed state has 2 `type:"iteration"` lines). Parallel-run mode: dispatch assigns slot 009; state.jsonl is NOT mine to append. Mismatch recorded as Edge Case 1 (expected under parallel fan-out).
- **Mode:** review (read-only — findings only, no code modification)
- **Dimension:** traceability
- **Angle:** A8 — `_NOTE_` parity across the 4 MCP configs; dangling refs after the gemini deletion (commit 8683890935); constitutional pruning correctness (cb1ed47168 / c377d6dcd8)
- **Budget profile:** verify (target 11-13 tool calls; used ~10)
- **Review target:** `a9e9bdb0a5^..HEAD` via `git show`/`git diff` + grep of the CURRENT live tree
- **Parallel-safety:** wrote ONLY `iterations/iteration-009.md` + `deltas/iter-009.jsonl`. Did NOT touch state.jsonl, strategy, registry, or config.

## Files Reviewed
- Gemini-removal commit: `git show --stat 8683890935` (deletes `.gemini/**` + `.opencode/skills/cli-gemini/**`; edits `.opencode/agents/{orchestrate,deep-review,prompt-improver}.md`, `.opencode/skills/deep-{research,review,ai-council}/assets/runtime_capabilities.json`, `.opencode/agents/README.txt`).
- Live-tree dangling-ref grep for `gemini` / `cli-gemini` / `.gemini/` / `.gemini/agents` across `*.json|toml|md|cjs|js|ts|sh|yaml` (excluded `.git`, `node_modules`, `specs/`, changelogs, `.worktrees/`, this review folder, `.score-cache/`).
- MCP configs: `opencode.json`, `.claude/mcp.json`, `.mcp.json` (symlink → `.claude/mcp.json`, verified), `.codex/config.toml`, `.devin/config.json` — `_NOTE_*` key set, `37`-tool claim, server block, JSON validity (`node JSON.parse` PASS on all 3 JSON files).
- Main-tree `runtime_capabilities.json` (deep-research / deep-review / deep-ai-council) — gemini-ref grep.
- `.claude/agents/{orchestrate,deep-review,prompt-improver}.md`, `.codex/agents/{deep-review,prompt-improver}.toml`, `.claude/agents/README.txt`, `.codex/agents/README.txt` — agent dir resolution + mirror lists.
- Constitutional: confirmed deletion of `codex-cli-auth-usable.md` + `dual-claude-max-accounts.md`; orphan cross-ref grep; `constitutional/README.md` rule-count vs actual file count.

## Findings — New

### P0 Findings
None.

### P1 Findings
None. (Skeptic note: the dangling `.gemini/agents/` refs were considered for P1 but downgraded — they live in Claude/Codex runtime *mirrors* and stale docs, NOT in any machine-read routing source; the canonical machine source `runtime_capabilities.json` is clean. No runtime path resolves to the deleted dir because no Gemini runtime is wired. Severity capped at P2.)

### P2 Findings

1. **Dangling `.gemini/agents/` pointers in Claude + Codex agent mirrors** — `.claude/agents/orchestrate.md:21`, `.claude/agents/deep-review.md:252`, `.claude/agents/prompt-improver.md:50`, `.claude/agents/README.txt:8`, `.codex/agents/deep-review.toml:260`, `.codex/agents/prompt-improver.toml:54`, `.codex/agents/README.txt:8` — These point to `.gemini/agents/` (deleted in commit 8683890935). `orchestrate.md:21` is an active routing instruction: "Gemini profile reads `.gemini/agents/`" → resolves to a now-deleted directory. `deep-review.md:252` / `deep-review.toml:260` list `.gemini/agents/deep-review.md` as a "Gemini runtime mirror". README.txt mirror lines still say "Mirrored to: .claude/agents/, .gemini/agents/, .codex/agents/". The gemini-removal commit cleaned the OpenCode canonical surfaces (`.opencode/agents/*`) and the deep-* skill `runtime_capabilities.json` assets but did NOT touch `.claude/agents/` or `.codex/agents/` (confirmed: `git show 8683890935 --name-only | grep '^\.(claude|codex)/agents/'` = empty). Mirror drift; no runtime crash because no Gemini runtime is dispatched.
   - Finding class: doc/config drift in runtime mirrors (READ-ONLY downstream packaging surfaces per agent contract).
   - Scope proof: 7 file:line hits enumerated above; all reference the deleted `.gemini/agents/` path; commit name-only diff proves these mirrors were not re-synced post-deletion.
   - Affected surface hints: Claude + Codex agent mirror regen/packaging step; mirror sync should re-run after the OpenCode canonical edit and either drop the Gemini row/column or reflect the deletion.
   ```json
   {"type":"traceability","claim":"Claude/Codex agent mirrors point to deleted .gemini/agents/ paths post-removal","evidenceRefs":[".claude/agents/orchestrate.md:21",".claude/agents/deep-review.md:252",".claude/agents/README.txt:8",".codex/agents/deep-review.toml:260",".codex/agents/README.txt:8"],"counterevidenceSought":"checked main-tree runtime_capabilities.json (machine source) — CLEAN of gemini; checked git show 8683890935 --name-only for .claude/.codex agent edits — NONE","alternativeExplanation":"intentional historical reference — REJECTED: orchestrate.md:21 is an active 'reads .gemini/agents/' routing directive, not a changelog note","finalSeverity":"P2","confidence":"high","downgradeTrigger":"already at floor for mirror-only drift; would rise to P1 only if a live Gemini runtime were wired to resolve agents from .gemini/agents/"}
   ```

2. **`_NOTE_` parity gap: shared-socket + total-budget notes missing from `.codex/config.toml` and `.devin/config.json`** — `_NOTE_HF_EMBED_SOCKET` is present in `opencode.json:32` and `.claude/mcp.json:22` but ABSENT from `.codex/config.toml` and `.devin/config.json` (count=0 in both). `_NOTE_TOTAL_MCP_BUDGET` is present ONLY in `opencode.json` (absent from the other three). The `_NOTE_HF_EMBED_SOCKET` note carries an operationally load-bearing constraint ("Pinned identically for mk-spec-memory AND mk_skill_advisor … single-owner … Do not diverge the two services") — a Codex/Devin operator editing those configs lacks the divergence warning. All other 14-15 `_NOTE_*` keys, the `37`-tool claim, env, and command/args agree across all four configs.
   - Finding class: cross-runtime config doc parity gap (advisory `_NOTE_` only — does NOT affect tool registration or behavior).
   - Scope proof: per-file `_NOTE_*` key-set diff: opencode (17 keys, incl HF_EMBED_SOCKET + TOTAL_MCP_BUDGET), claude (16, incl HF_EMBED_SOCKET), codex (15), devin (15). Tool count `37` and `_NOTE_2_TOOLS` enumeration identical in all four.
   - Affected surface hints: MCP config maintenance step that fans the canonical `_NOTE_*` set into `.codex/config.toml` (TOML form) and `.devin/config.json`.
   ```json
   {"type":"traceability","claim":"_NOTE_HF_EMBED_SOCKET (and _NOTE_TOTAL_MCP_BUDGET) are not mirrored to codex/devin MCP configs","evidenceRefs":["opencode.json:32","opencode.json _NOTE_TOTAL_MCP_BUDGET",".claude/mcp.json:22",".codex/config.toml (no HF_EMBED_SOCKET)",".devin/config.json (no HF_EMBED_SOCKET)"],"counterevidenceSought":"grep'd codex/devin for the 'Shared hf-local model-server socket'/'single-owner' string — 0 hits, so not relocated under another key","alternativeExplanation":"intentional omission because codex/devin don't run skill_advisor — PLAUSIBLE but the note documents a shared-socket invariant relevant to any host running both services; left as P2 advisory","finalSeverity":"P2","confidence":"medium","downgradeTrigger":"if codex/devin profiles provably never co-host mk_skill_advisor, this is notApplicable rather than a gap"}
   ```

3. **`.mcp.json` symlink integrity — CONFIRMED CLEAN (recorded for traceability, not a defect)** — `.mcp.json` is a symlink → `.claude/mcp.json` (verified via `readlink`); both resolve to the same valid JSON with the same `_NOTE_*` set. No drift between the symlink target and the Claude config. Noted because the dispatch flagged it as a parity-risk surface; it is not.
   - Finding class: parity verification (no defect).
   - Scope proof: `readlink .mcp.json` = `.claude/mcp.json`; identical `_NOTE_*` grep output.
   - Affected surface hints: none.

## Traceability Checks
- **Iteration number:** JSONL `type:"iteration"` count = 2 → derived = 3; dispatch slot = 9. Mismatch is expected under parallel fan-out (dispatch owns slot assignment; state.jsonl reconciliation is the orchestrator's job, not this leaf's). Recorded as Edge Case 1.
- **gemini-removal completeness:** OpenCode canonical surfaces + deep-* `runtime_capabilities.json` (machine source) = CLEAN. Dangling refs survive ONLY in Claude/Codex mirrors + scattered docs (F-A8-01). `cli-gemini` executor mentions in `/deep:*` command files + matrix adapters are INTENTIONAL (external Gemini CLI still supported: `gemini "PROMPT" -m …`), explicitly affirmed by `constitutional/cli-dispatch-skill-preload.md:61` ("external Gemini binary has no project cli-gemini skill") — NOT dangling, ruled out.
- **MCP config parity:** 37-tool claim + `_NOTE_2_TOOLS` enumeration agree across all 4; JSON valid (opencode/claude/devin parsed clean); `.mcp.json` symlink intact. Gap = 2 advisory `_NOTE_*` keys (F-A8-02).
- **Constitutional pruning:** both pruned files deleted; ZERO orphaned cross-refs in the live tree; `constitutional/README.md` correctly states 12 rules and 12 files exist. CLEAN — no finding.

## Integration Evidence
- **MCP config fan-out** (`opencode.json`, `.claude/mcp.json` + `.mcp.json` symlink, `.codex/config.toml`, `.devin/config.json`): inspected directly for `_NOTE_*` parity, 37-tool claim, server block, validity. Parity gap = F-A8-02.
- **Agent runtime mirrors** (`.claude/agents/`, `.codex/agents/`): inspected as READ-ONLY downstream packaging surfaces per agent contract; dangling `.gemini/agents/` refs = F-A8-01. Not modified.
- **Deep-* skill `runtime_capabilities.json`** (machine-read runtime source): inspected; gemini entries correctly removed from the main tree by commit 8683890935.

## Edge Cases
1. **Iteration-number mismatch (dispatch 9 vs JSONL-derived 3):** Parallel fan-out — multiple review agents run concurrently, each owning one iteration slot; committed state.jsonl lags. Honored dispatch slot 009 per the parallel-safety directive; did NOT append to state.jsonl. Ambiguity resolved toward the dispatch contract.
2. **Worktree copies are OUT OF SCOPE:** `.worktrees/000*/.opencode/skills/deep-*/assets/runtime_capabilities.json` still carry gemini `mirrorPath` entries, but these are independent checkouts NOT in the `a9e9bdb0a5^..HEAD` main-tree diff. Excluded from findings (would be a false positive against the reviewed range).
3. **`cli-gemini` executor vs deleted `cli-gemini` skill — distinct:** The `cli-gemini` *executor route* (drives the external `gemini` binary) is intentionally retained in `/deep:*` commands + matrix adapters; the `cli-gemini` *skill directory* was deleted. References to the executor are correct; references to the skill dir would be dangling (none found in scope). Disambiguated to avoid over-flagging.
4. **`_NOTE_2_TOOLS` 37-tool claim not re-verified against `tool-schemas.ts` this pass:** That is A7's job (iter 7/8). A8 only checked cross-config agreement of the claim string, which holds.

## Confirmed-Clean Surfaces
- **Constitutional pruning (cb1ed47168 / c377d6dcd8):** clean — files deleted, no orphans, README count accurate.
- **Main-tree `runtime_capabilities.json` (deep-research/deep-review/deep-ai-council):** clean — gemini entries removed.
- **OpenCode canonical agents (`.opencode/agents/{orchestrate,deep-review,prompt-improver}.md`):** edited by the removal commit; no dangling `.gemini/` path refs remain (the earlier grep hits in `.opencode/agents/*` were `cli-gemini` *executor* mentions, intentional).
- **MCP tool count (37) + `_NOTE_2_TOOLS` enumeration + JSON validity + `.mcp.json` symlink:** clean across all 4 configs.

## Ruled Out
- **`cli-gemini` executor refs in `/deep:*` commands + matrix adapters as "dangling":** RULED OUT — external Gemini CLI is intentionally supported (`cli-dispatch-skill-preload.md:61`). Do not retry as a finding.
- **Constitutional orphaned cross-refs:** RULED OUT — grep returned zero hits for both pruned rule names.
- **Worktree gemini refs:** RULED OUT of scope — separate checkouts, not in the reviewed range.
- **MCP config invalidity / tool-count divergence:** RULED OUT — all JSON valid, 37-tool claim uniform.

## Next Focus
- **Dimension:** traceability
- **Focus area:** A9 — changelog/docs accuracy vs code (the 33 AI-authored changelogs from this session vs actual code facts; doc-drift in changed READMEs / playbook / feature-catalog).
- **Reason:** A7 (MCP contract parity) and A8 (config/gemini) now covered within traceability; A9 is the last traceability angle and overlaps the docs-drift remediation this session shipped.
- **Rotation status:** traceability in progress — A8 complete (this iter). A7 + A9 remain for the rotation (per charter iters 9-11).
- **Blocked/productive carry-forward:** Productive — F-A8-01 (Claude/Codex mirror drift) + F-A8-02 (`_NOTE_` parity gap) are both P2 advisories; feed the maintainability/dead-code pass (iter 12-13) for a mirror-regen + config-fan-out recommendation. The `_NOTE_2_TOOLS` 37-tool claim string is verified cross-config here but NOT against `tool-schemas.ts` — hand to A7.
- **Required evidence (A9):** spot-check 3-5 of this session's changelogs against the actual commit diffs for invented verification, wrong verdicts, or wrong counts; grep changed READMEs/feature-catalog for stale tool counts or deleted-surface references.
