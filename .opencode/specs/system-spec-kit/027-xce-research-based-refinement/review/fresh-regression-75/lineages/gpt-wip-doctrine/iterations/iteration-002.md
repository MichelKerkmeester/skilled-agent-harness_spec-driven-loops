# Seat gpt-wip-doctrine — iteration 2 (global #64)

- Model: `claude-opus-4-8` · Executor: claude · Angle: gpt-wip-doctrine
- Verdict: **PASS** · Findings: P0=0 P1=0 P2=1

## Analysis

## Review Analysis — seat `gpt-wip-doctrine`

**Angle:** typed agent I/O contract (`agent-io-contract.md`) vs. the agents that adopt it; invariant that advisory metadata must never block a valid exchange. **Lens:** traceability.

### What I traced (read personally)

1. **Contract doc** `.opencode/skills/system-spec-kit/references/workflows/agent-io-contract.md` (all 7 groups + compatibility).
2. **Adopting agents** — `.opencode/agents/{orchestrate,code,review,context,debug}.md` envelope blocks, plus the `.claude/agents/*.md` and `.codex/agents/*.toml` mirrors.
3. **The one machine-checked surface** — `evidence-contract.ts` and `post-dispatch-validate.ts` in `deep-loop-runtime`.
4. **Changelog claims** vs. reality — `changelog-001-002-001-typed-agent-io-adapter.md` and the plan YAML assets.

### Invariant holds — "advisory never blocks"

- `validateEvidenceContract()` (evidence-contract.ts:111-155) classifies absent/present/malformed and **never throws, never returns a failure**. In `post-dispatch-validate.ts:749-761`, malformed evidence only pushes `warnings`; even `DEEP_LOOP_EVIDENCE_ENFORCEMENT=strict` (752-758) just adds an advisory and keeps `ok:true`. Faithful to doc §7 lines 171-173.
- Absence is silent (evidence-contract.ts:120-122 returns `absent`), matching doc line 171 and Compatibility line 180.
- The doc's enum claims are accurate: `EVIDENCE_CLAIM_CLASSES` / `EVIDENCE_SCOPE_STATES` (evidence-contract.ts:11,14) match doc §7 lines 162-167 exactly; the doc correctly defers ownership to the module rather than redefining.

### Traceability is otherwise tight

- Per-agent `failure_type` enums are all strict subsets of the doc §3 union (review = `p0|p1|p2|low_confidence|none`; code = `unknown_stack|scope_conflict|...`; debug = `missing_info|access_denied|...`), and the three runtime mirrors are byte-for-byte in lockstep (verified `.opencode` vs `.claude` vs `.codex`).
- Changelog's concrete claim "four `@context` dispatches carry the header in both plan YAMLs" verified: `grep -c AGENT_IO_DISPATCH` = 4 in each of `speckit_plan_auto.yaml` / `speckit_plan_confirm.yaml`.
- Confidence-band → numeric mapping (`high→0.90`) consistent across doc §3 and every agent body.

### One fresh finding (P2)

The **Evidence Group (§7) is documented as a text envelope in the same `text`-fenced family as §2–§6**, under a doc whose stated purpose is "dispatch headers and result envelopes." Every sibling group (§2–§6) is emitted as a literal text block by an agent/orchestrator. But §7 has **no emitter and no text parser**: `grep` for `AGENT_IO_EVIDENCE` / `claim_class` / `would_confirm` hits only the doc, the module, and its tests — zero agent files. Its sole consumer (`post-dispatch-validate.ts:288,750`) validates a structured JSONL `record.evidence` **object field**, never a parsed `AGENT_IO_EVIDENCE v1` text block. So a reader who formats the envelope as documented gets nothing validated; the documented surface and the checked surface don't connect. Non-blocking, doesn't break the invariant, and partially mitigated by the doc deferring ownership to `deep-loop-runtime` — hence P2, not P1.

No P0/P1 found. The contract is faithfully implemented and the advisory-never-blocks invariant is intact.

```json
{"seat":"gpt-wip-doctrine","model":"openai/gpt-5.5-fast","angle":"gem-team typed agent I/O contract: agent-io-contract.md vs the actual agent headers/envelopes; advisory metadata must never block a valid exchange.","verdict":"PASS","summary":"Contract faithfully implemented; advisory-never-blocks invariant holds in code; mirrors in lockstep. One P2 traceability gap: §7 Evidence envelope is documented as emittable text but has no emitter/text-parser and is validated only as a JSONL field.","files_reviewed":[".opencode/skills/system-spec-kit/references/workflows/agent-io-contract.md",".opencode/agents/code.md",".opencode/agents/review.md",".opencode/agents/debug.md",".opencode/agents/context.md",".opencode/agents/orchestrate.md",".claude/agents/code.md",".claude/agents/review.md",".claude/agents/debug.md",".codex/agents/code.toml",".codex/agents/review.toml",".codex/agents/debug.toml",".opencode/skills/deep-loop-runtime/lib/deep-loop/evidence-contract.ts",".opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts",".opencode/commands/speckit/assets/speckit_plan_auto.yaml",".opencode/commands/speckit/assets/speckit_plan_confirm.yaml",".opencode/specs/system-spec-kit/027-xce-research-based-refinement/changelog/001-research-and-doctrine/changelog-001-002-001-typed-agent-io-adapter.md"],"findings":[{"severity":"P2","dimension":"traceability","title":"Evidence Group (§7) documented as a text envelope but no agent emits it and no text-parser feeds its validator","file":".opencode/skills/system-spec-kit/references/workflows/agent-io-contract.md:159","evidence":"§7 presents `AGENT_IO_EVIDENCE v1` as a `text`-fenced block in the same family as §2-§6 (all of which agents emit literally). But grep for AGENT_IO_EVIDENCE/claim_class/would_confirm across .opencode/.claude/.codex agents returns zero hits; the only consumer, post-dispatch-validate.ts:288/750, validates a structured JSONL `record.evidence` object via validateEvidenceContract(record.evidence) — never a parsed text envelope.","why":"A reader following the doc would format an AGENT_IO_EVIDENCE text block expecting it to be checked like its siblings, but the documented emittable surface and the actually-validated surface (a JSONL field written by deep-loop iterations) are disconnected, with no bridge between them. Mild traceability gap in an otherwise tightly-traced contract; does not block any exchange and is partly mitigated by the doc deferring schema ownership to deep-loop-runtime.","recommendation":"In §7, note explicitly that the Evidence Group is carried as the `evidence` field on a deep-loop JSONL iteration record (not as a free-standing AGENT_IO_EVIDENCE text envelope appended to agent output), or state that no agent currently emits it, so the documented representation matches the only consumer."}]}
```
