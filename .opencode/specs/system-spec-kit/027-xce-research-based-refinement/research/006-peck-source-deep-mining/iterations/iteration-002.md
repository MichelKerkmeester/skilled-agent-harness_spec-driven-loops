# Iteration 002 — Verdict-freshness binding (code change invalidates green)

**Focus:** peck "code change invalidates prior reviewer verdict; report only from current HEAD + clean tree" vs spec-kit completion gate (validate.sh --strict + checklist + continuity fingerprint).
**Executor:** cli-opencode `openai/gpt-5.5-fast` --variant high (read-only; orchestrator-written artifacts). **Status:** complete. **newInfoRatio:** 0.72.

## Findings
- **[F-002-01]** peck invalidates verdicts after any code change (`external/peck-master/src/assets/agents/implementer.md:41,53`); spec-kit completion requires only validate.sh --strict + checklist evidence + metadata reconcile — NO HEAD/content binding named (`CLAUDE.md:247-251`). GAP real. **ADOPT** · M · med · blast: CLAUDE.md, AGENTS.md, completion gate docs, validator.
- **[F-002-02]** spec-kit validator pass = structural errors/warnings == 0, NOT bound to git HEAD or changed-file hashes (`.opencode/skills/system-spec-kit/mcp_server/lib/validation/orchestrator.ts:386,397,409`). GAP real. **ADAPT** · M · med.
- **[F-002-03]** strict `CONTINUITY_FRESHNESS` checks only TIMESTAMP lag between `last_updated_at` and `derived.last_save_at` (`scripts/validation/continuity-freshness.ts:153,233,237`), not evidence-vs-content. GAP partial. **ADAPT** · S · low.
- **[F-002-04]** `session_dedup.fingerprint` is a real sha256 surface but validation only checks SYNTAX + required fields, never recomputes vs current files (`mcp_server/lib/validation/spec-doc-structure.ts:309,636`, `mcp_server/handlers/memory-save.ts:1006,1012`). GAP real. **ADAPT** · M · med — repurpose the fingerprint as a freshness binding.
- **[F-002-05]** `POST_SAVE_FINGERPRINT` is only a save-transaction integrity check (needs `postSavePlan`, else skipped) — not durable completion freshness (`spec-doc-structure.ts:1072,1077`). **SKIP** direct reuse / **ADAPT** the hashing idea · S · low.
- **[F-002-06]** peck requires a CLEAN TREE before completion (`implementer.md:53,59`); spec-kit constitutional requires clean git status only for COMMIT/PUSH claims, not generic checklist completion (`constitutional/verify-before-completion-claims.md:21,29,30`). GAP real. **ADOPT** · M · med.

## Ruled out
- peck reviewer pass/fail loop already ≈ spec-kit positive-verification discipline — only the FRESHNESS BINDING is missing (`verify-before-completion-claims.md:30`).
- `session_dedup.fingerprint` not already a freshness check (accepts a well-formed value, no recompute) (`spec-doc-structure.ts:636,640`).

## Verdict contribution
**Highest-value net-new finding so far.** A "completion-verdict freshness" mechanism: bind checklist-`[x]` evidence to a content fingerprint (reuse the existing `session_dedup.fingerprint` surface) and invalidate on later in-scope edits; add a clean-tree precondition to the completion rule. **ADOPT** as a core sub-packet item.
