---
title: "Goal: Advisor Import And Ollama Consolidation"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "advisor import ollama goal"
  - "ollama implementation merge"
  - "import specifier consistency"
  - "advisor isolation doctrine preserved"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/036-recorded-findings-closure/011-advisor-import-and-ollama-consolidation"
    last_updated_at: "2026-09-07T17:00:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-07-036-011-advisor-import-and-ollama-consolidation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Advisor Import And Ollama Consolidation

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE: it is what an operator sets as the session
> objective, and it must stay true for the life of the packet. Keep it short:
> the runtime goal surfaces cap what they will hold, and a truncated objective
> loses its tail, which is where the completion criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Merge the advisor's two live Ollama embedding implementations behind one contract both daemon dispatch paths reach, and normalize every advisor-owned @spec-kit/shared import and vi.mock specifier to the .js extension form, keeping the advisor's own tests and the golden-prompt suite green and the unicode-normalization isolation doctrine untouched.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Both the getAdapter('ollama').embed() and createEmbeddingsProvider() call sites must resolve through the merged implementation, and skill-graph-db.ts's dual-path dispatch itself is not changed |
| D2 | The .js extension form is the target convention, matching the one confirmed production call site at skill-graph-db.ts:18, not the extensionless form the seven inconsistent files currently use |
| D3 | mcp-server/lib/shared/unicode-normalization.ts's local-duplication isolation doctrine is out of scope. Finding L7 already recorded it as a no-change decision for this program |
| D4 | Both Ollama files are read in full before any merge, since their contracts genuinely diverge and a naive merge risks dropping a config option one dispatch path relies on |
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Three to seven bullets, each checkable without opening another file. Copy them
verbatim into the objective: nothing dereferences a path, so criteria left only
here are invisible to whatever judges completion.

- [x] One Ollama implementation is reached by both getAdapter('ollama').embed() and createEmbeddingsProvider()
- [x] The advisor's own test suite passes (waived for four pre-existing failures per ADR-001; routed to 014 and 016)
- [x] All nine advisor-owned @spec-kit/shared specifiers use the .js extension form
- [x] A lint rule or test pins the .js convention and fails on a throwaway extensionless specifier
- [x] routing-golden-prompts.vitest.ts passes and unicode-normalization.ts is unchanged
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Packet opened | Done | spec.md, plan.md, tasks.md, acceptance-criteria.md and this goal.md authored from R5-01, R5-02, R5-04, R9-01, R3-I1-01 and R3-I1-02, cross-checked against the current skill-graph-db.ts and the seven specifier files |
| One Ollama transport: `providers/ollama.ts` now embeds through an `OllamaAdapter` built from a prefix-free manifest; the adapter gained per-instance base URL and timeout, dimension learning and an exported availability probe | Done | `implementation-summary.md` Verification |
| Nine specifiers in seven advisor files carry `.js`; a new test walks the server and fails on any extensionless `@spec-kit/shared` specifier, with a negative control | Done | `tests/shared-import-specifier-extension.vitest.ts` |
| Gates | Done | shared typecheck and 18 tests pass after the README env table regenerated; advisor typecheck clean; golden prompts, pinning and factory-parity 21 pass; full advisor suite in the summary |

### Deviations and findings

| Item | Note |
|------|------|
| Merge shape | Two interfaces stay because two call sites need them: batch `embed()` with typed errors for the daemon, single-text chunked and normalised embeddings for the legacy factory. Only the transport was duplicated, so only the transport merged, into the adapter |
| Adapter capabilities added, none lost | The provider needed a fixed per-instance timeout, an explicit base URL and dimension learning for unlisted models; the adapter now carries all three as options, and its readiness probe returns the provider's reason strings |
| README env table regenerated | Moving the base-URL read out of the provider changed the reader list the shared README's table pins; the generator rewrote one row |
| Four advisor failures predate this child and are waived | Thirteen assertions in four files: the `/memory:save` bridge in `lib/scorer/projection.ts` and the 21-versus-20 metadata count go to 016; the settings-parity regex that still expects `mcp-server/dist/hooks/claude/` goes to 014; the daemon job-semantics flake is rerun under 016. `decision-record.md` ADR-001 |
| Nine specifiers, seven files | One test file under `lib/` sits outside the vitest include and is still normalised; the pinning test walks `lib` too |
<!-- /ANCHOR:log -->
