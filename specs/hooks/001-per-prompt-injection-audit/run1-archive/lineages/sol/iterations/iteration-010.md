# Iteration 10: Always-on directive ownership, value, drift, and consolidation

## Focus
Deep-audit the comment-hygiene, governor, and proof-over-appearance directives: exact owners and six-runtime transport, literal duplication, overlap with root/lifecycle policy, guardrail value, staleness, trim failure modes, measurable fixtures, and a compact replacement.

## Findings
1. **Six transports resolve to two production literal owners.** `render.ts` owns all three strings and appends them to single, ambiguous, and fallback results. Claude calls it; Codex, Cursor, and Devin proxy Claude; Pi imports its compiled handler. OpenCode separately byte-mirrors the trio and fallback. A policy edit therefore spans canonical source/build plus an independent plugin copy and duplicated tests. [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/render.ts:51-69,196-215] [SOURCE: .opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:11-20] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/codex/user-prompt-submit.ts:15-20] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/cursor/user-prompt-submit.ts:45-51] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/devin/user-prompt-submit.ts:15-20] [SOURCE: .opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts:40-47,79-105] [SOURCE: .opencode/plugins/mk-skill-advisor.js:45-52,836-862]
2. **The 760-character recurring capsule contains policies of unequal marginal value.** Hygiene is 204 characters/28 words, governor 289/48, proof 255/41, plus label/newline overhead. Hygiene duplicates a machine-backed invariant; proof compresses a richer terminal protocol; governor restates behavioral prose without an executable boundary. [SOURCE: command `node` source-literal measurement: hygiene=204 chars/206 bytes/28 words; governor=289/291/48; proof=255/255/41] [SOURCE: AGENTS.md:57-58,72-96,193-211] [INFERENCE: marginal guardrail value differs because only hygiene and proof map directly to explicit gates]
3. **Comment hygiene is safest to remove from every-turn delivery, but its enforcement description is stale.** Root and constitutional policy retain the rule; PostToolUse, pre-commit validation, and PR CI independently enforce it. The capsule mentions only pre-commit. The constitutional page claims CI cannot be bypassed, while the workflow exits zero when its checker is missing; current checkout has that checker, so present liveness is confirmed but fail-closedness is not. [SOURCE: AGENTS.md:57-58] [SOURCE: .opencode/skills/system-spec-kit/constitutional/comment-hygiene.md:30-38,66-74] [SOURCE: .claude/settings.json:169-178] [SOURCE: .github/workflows/comment-hygiene.yml:14-21] [SOURCE: command `test -x .opencode/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh`: CHECKER_PRESENT]
4. **Proof over appearance protects the highest-risk transition but overstates negative control.** Root policy requires objective checks, observed exit status, a safe negative control only “when practical,” and a final artifact/diff/authoritative-gate rerun. The capsule makes “watch it fail before fixing” unconditional, which is inapplicable to some greenfield and read-only work. Trim it only if lifecycle/root delivery remains reliable; compact it to observed checks plus final-state sweep. [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/render.ts:62-65] [SOURCE: AGENTS.md:86-105,193-211]
5. **The governor's natural owner is root/agent policy, not advisor fallback.** Root instructions already require result-first, batched, problem-focused work and cheap reversible decisions; deep-agent definitions repeat the governor because per-turn hooks do not reach subagents. Removing only the per-turn copy should not weaken hard correctness gates, but may increase narration or indecision; that effect needs behavioral evaluation. [SOURCE: AGENTS.md:72-84] [SOURCE: .opencode/agents/deep-research.md:28-30] [INFERENCE: explicit context-boundary copies are more reliable than coupling disposition to advisor output]
6. **Tests freeze strings more strongly than behavior.** Claude tests assert the entire combined string; renderer/producer tests duplicate literals; OpenCode tests mostly assert hygiene/governor markers and the bridge separately checks proof. Replace this with: canonical/OpenCode byte parity; six adapters over `{pass,no-match,error} x {first,unchanged,changed,post-compact}`; real hygiene positive/negative fixtures; completion claims with missing versus observed proof; and scored governor cases for result-first opening, batching, reversible-choice latency, and relevant uncertainty. [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/tests/hooks/claude-user-prompt-submit-hook.vitest.ts:22-27] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/tests/legacy/advisor-brief-producer.vitest.ts:28-33] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/tests/legacy/advisor-renderer.vitest.ts:15-21] [SOURCE: .opencode/plugins/tests/mk-skill-advisor.test.cjs:206-237,339-373] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/tests/compat/plugin-bridge.vitest.ts:91]
7. **A lifecycle-delivered unified directive can cut 61.6% of characters.** Proposed exact text: `Directives:\n- Preserve durable code comments; rely on comment-hygiene gates for forbidden artifact pointers.\n- Work result-first: batch checks, decide reversible choices, and qualify only actionable uncertainty.\n- Prove machine-state claims with observed checks and a clean final-state sweep.` It is 292 ASCII characters/39 words. Deliver at SessionStart and after compact/recovery, retain full root/constitutional rules, and emit only changed passing advisor routes per turn. Where root/lifecycle delivery is unproven, use this compact block as a conditional adapter fallback rather than deleting coverage. [SOURCE: command `node` compact-fixture measurement: 292 chars/292 bytes/39 words] [SOURCE: .opencode/hooks/injection-contract.md:191-217] [INFERENCE: this preserves durable behavior while decoupling invariant policy from prompt-dependent advice]

## Ruled Out
- Deleting all directives merely because root policy overlaps: host loading and compaction retention are not uniformly proven.
- Exact-string tests as the main guardrail: they prove presence, not behavior.
- Unconditional “watch it fail”: root policy explicitly limits negative controls to practical, safe cases.

## Dead Ends
Static source cannot quantify the governor's behavioral effect; a controlled A/B evaluation is required.

## Edge Cases
- Ambiguous input: “six adapters” means six transports, not six content owners; both layers are mapped.
- Contradictory evidence: constitutional CI prose says non-bypassable, but the workflow fail-opens on a missing checker; the checker exists today.
- Missing dependencies: no live six-runtime transcript/tokenizer capture; source-derived character, byte, and word fixtures were used.
- Partial success: ownership, drift, risks, fixtures, and replacement are established; behavioral effect sizes remain open.

## Sources Consulted
- [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/render.ts:51-69,196-215]
- [SOURCE: .opencode/plugins/mk-skill-advisor.js:45-52,777-865]
- [SOURCE: .opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:11-20]
- [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/codex/user-prompt-submit.ts:15-20]
- [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/cursor/user-prompt-submit.ts:45-51]
- [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/devin/user-prompt-submit.ts:15-20]
- [SOURCE: .opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts:40-47,79-105]
- [SOURCE: AGENTS.md:57-58,72-105,193-211]
- [SOURCE: .opencode/skills/system-spec-kit/constitutional/comment-hygiene.md:30-74]
- [SOURCE: .claude/settings.json:169-178]
- [SOURCE: .github/workflows/comment-hygiene.yml:14-39]
- [SOURCE: .opencode/agents/deep-research.md:28-30]
- [SOURCE: .opencode/hooks/injection-contract.md:191-221]
- [SOURCE: command `node` source-literal and compact-fixture measurement]

## Assessment
- New information ratio: 0.93
- Questions addressed: ownership, variants, duplication, guardrail value, staleness, failure modes, fixtures, and compact policy.
- Questions answered: all source-level dispatch questions; only live behavioral effect sizes remain.

## Reflection
- What worked and why: owner-to-transport tracing separated six adapters from two content owners; comparing prose with executable gates exposed unequal value and CI fail-open drift.
- What did not work and why: static presence tests cannot estimate governor effects.
- What I would do differently: establish behavioral A/B acceptance thresholds before implementation.

## Recommended Next Focus
Run the proposed baseline-versus-lifecycle-only fixture matrix. Require zero regression in hygiene catches and unsupported-completion detection, then measure governor scores and six-runtime token savings.
