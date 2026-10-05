## Row 51 (ambiguous)
- Doc: `specs/cli-jev/003-cli-jev-workflow-integration/007-classifier-deep-research/research/lineages/swe/iterations/iteration-004.md:65`
- Citation: `spec.md:91`
- Candidates: `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/002-valid-level1/spec.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/003-valid-level2/spec.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/004-valid-level3/spec.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/005-unfilled-placeholders/spec.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/007-valid-anchors/spec.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/008-invalid-anchors/spec.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/009-valid-priority-tags/spec.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/010-valid-evidence/spec.md` and 4650 more

```text
| Function | Signature | Notes |
|---|---|---|
| `probeBackend(flag)` | `('--deem'|'--jev'|'--both'|'none') → {backend, model, endpoint} | null` | Deem: `GET /health` 200 + `status=="ok"` + `backend` in allowlist `{torch}` or `ensemble:*` sans `stub` + `model=="deem-0.8-v1"` (deepseek-04 F10's gate, quoted). Jev: D5 (`command -v jev`, `jev 0.6.2`, `jev auth status --provider <p>` exit 0). Default order: **Deem first** — this payload is the operator's own transcripts, the packet's highest privacy class (`spec.md:91`); Jev egresses the fitted state |
| `questionsFor(call)` | vendored port | verbatim intent: `call_<id>` keep-call, `result_<id>` keep-verbatim (`compact.ts:58-67`) |
| `batchCalls(calls, stateTokens)` | vendored port (`compact.ts:73-101`) | |
```

## Row 52 (ambiguous)
- Doc: `specs/system-speckit/033-system-speckit-v4/038-goal-unification/001-goal-unification-research/research/lineages/glm/iterations/iteration-013.md:28`
- Citation: `resume.md:4`
- Candidates: `.claude/commands/speckit/resume.md`, `.skilled/commands/speckit/resume.md`

```text
### F3. The whitelist ladder: verified exactly, and it already encodes the read/write authority split

`plan.md:4`, `implement.md:4`, `complete.md:4` = `Read, Write, Edit, Bash, Grep, Glob, Task, opencode_goal, opencode_goal_status`; `resume.md:4` = the same list **without** `opencode_goal` (`[SOURCE: .opencode/commands/speckit/plan.md:4]`, `[SOURCE: .opencode/commands/speckit/implement.md:4]`, `[SOURCE: .opencode/commands/speckit/complete.md:4]`, `[SOURCE: .opencode/commands/speckit/resume.md:4]`). it-007 F4's citations resolve exactly. Resume is already a read-only goal surface; the mutation ladder (which commands may set) precedes this design.

### F4. The template: run 1's it-007 citations were precise; its it-002 citations were not — and two uncited lines are the design
```

## Row 54 (ambiguous)
- Doc: `specs/sk-communication/006-sk-communication-clarity/001-research-communication-context/research/iterations/iteration-008.md:38`
- Citation: `sk-communication/SKILL.md:180`
- Candidates: `.hermes/skills/agent-ai-council/SKILL.md`, `.hermes/skills/agent-code/SKILL.md`, `.hermes/skills/agent-context/SKILL.md`, `.hermes/skills/agent-debug/SKILL.md`, `.hermes/skills/agent-deep-improvement/SKILL.md`, `.hermes/skills/agent-deep-research/SKILL.md`, `.hermes/skills/agent-deep-review/SKILL.md`, `.hermes/skills/agent-design/SKILL.md` and 131 more

```text
2. **The `VOICE PERSONALITY` exclusion cannot be removed by file geometry; a split only moves it.**
The exclusion's stated reason is message ownership, not documentness:
`sk-communication/SKILL.md:180` — "A projection carries someone else's message, so a reaction the
original never held is a fidelity failure rather than a voice improvement." Because
`communication.md:121-122` puts the voice directives in the reply half, any document/reply split
```

## Row 55 (ambiguous)
- Doc: `specs/system-speckit/028-memory-search-intelligence/003-spec-data-quality/020-archive-renumber-010-044-to-001-023/review/iterations/iteration-005.md:54`
- Citation: `implementation-summary.md:131`
- Candidates: `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/002-valid-level1/implementation-summary.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/003-valid-level2/implementation-summary.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/004-valid-level3/implementation-summary.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/007-valid-anchors/implementation-summary.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/009-valid-priority-tags/implementation-summary.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/010-valid-evidence/implementation-summary.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/011-anchors-duplicate-ids/implementation-summary.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/012-anchors-empty-memory/implementation-summary.md` and 3798 more

```text
| P1-001 remediation safety | Pass, low-risk/narrow | The affected set is exactly 7 files from iteration 002, and the packet already identifies the safe mechanism: re-run `generate-description.js` + `backfill-graph-metadata.js`, which derive fields fresh from disk path (`spec.md:72`, `spec.md:139`, `implementation-summary.md:99`, `implementation-summary.md:117`). A minimal fix can target only those 7 `description.json.parentChain` arrays or run the same regeneration path over the affected subtree, followed by the existing exact old-number+slug scan. |
| Documentation-scope clarity | Pass with caveat | `implementation-summary.md` is sufficiently scoped for the post-audit claims because it names the exact fields checked before the `zero remaining mismatches` phrase (`implementation-summary.md:99`) and later limits the audit to identity-field/`children_ids` integrity (`implementation-summary.md:151`). Caveat: `checklist.md:78` remains overbroad for `self-references`, which is already covered by P1-001. |
…ification, no new finding | The packet documents the important reusable lessons: single-pass substitution instead of chained `sed` (`spec.md:74`, `implementation-summary.md:111`), the `TOP_MAP` overlap bug class (`implementation-summary.md:97`), and corrected number+slug sweeps (`checklist.md:70`, `implementation-summary.md:131`, `implementation-summary.md:139`). A repo-wide grep for these terms surfaced this packet and its review artifacts, not a generic reusable checklist, so
```

## Row 56 (ambiguous)
- Doc: `.skilled/skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/iterations/iteration-002.md:11`
- Citation: `src/registry.ts:88`
- Candidates: `.skilled/skills/system-skill-advisor/runtime/lib/embedders/registry.ts`, `.skilled/skills/system-spec-kit/shared/embeddings/registry.ts`

```text

### P1 - Required
- **F003**: Missing null guard in registry merge - `src/registry.ts:88` - Correctness path dereferences prior state before checking the record exists.

### P2 - Suggestion
```
