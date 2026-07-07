# Iteration 4 — Wave 2 (generate) — seat gpt-2 (openai/gpt-5.5-fast, variant high)

- Lens: ceiling-comments-vs-comment-hygiene
- Status: complete | exit=0 | duration=140s | findings=2 | newInfoRatio=0.42
- Focus: Do // ponytail: ceiling comments pass our comment-hygiene HARD BLOCK; can sk-code-review use them to cut over-engineering false positives?
- Dispatch: cli-opencode opencode run, openai/gpt-5.5-fast --variant high (read-only); ponytail source embedded in prompt.

## Seat output

VERDICT: content allowed; literal `ponytail:` prefix not recommended.

1. A ceiling comment like `// ceiling: global lock; per-account locks if throughput matters` is durable WHY, not an ephemeral label. It names an intentional shortcut, its known ceiling, and the upgrade path.
2. Literal `ponytail:` currently passes the checker, but policy-wise it is a perishable/cargo-cult brand label unless this repo adopts it as a stable convention. Prefer neutral `ceiling:` / `intentional-limit:`.

Evidence:
- `AGENTS.md:52-53`: forbidden list is “spec-folder paths, packet/phase numbers, ADR ids, task/checklist/requirement ids, or finding ids” with examples `// ADR-007:`, `// REQ-003:`, `// specs/042-foo`; allowed stable refs are `// CWE-79`, `// RFC 2616`, `// POSIX`.
- Repo-root `CLAUDE.md` was not present; `/Users/michelkerkmeester/.claude/CLAUDE.md` contains only compaction behavior, not comment hygiene.
- `.opencode/skills/sk-code/references/universal/code_style_guide.md:123-139` says keep durable WHY, forbid artifacts that get “renamed, renumbered, archived, or deleted,” and allows stable standards/platform names.
- `.opencode/skills/sk-code/scripts/check-comment-hygiene.sh:145-180` allows `CWE`, `RFC`, `POSIX`, `HTTP`, `WEBFLOW`, `MOTION`, `LENIS`, `V\d+`; flags packet/phase, `ADR-`, `REQ-`, `CHK-`, `T###`, `specs/...`, review/finding/checklist IDs.
- `.opencode/skills/sk-code/scripts/check-comment-hygiene.sh:190-196` skips any comment line containing `hygiene-ok`, then skips violation detection if an allowed pattern matches.

Recommendation:
- Adopt a stable neutral convention, not the brand: `// ceiling: <shortcut>; <upgrade path when condition>`.
- Do not add `ceiling:` to `ALLOWED_PATTERNS`; that would suppress forbidden IDs on the same line because allowed patterns run before violation patterns. If tooling needs detection, add a separate detector/linter, not a hygiene bypass.
- `hygiene-ok` already covers exceptional false positives but should not become the convention.

Review impact:
- `sk-code-review` can treat a concrete ceiling comment as evidence that “too simple / missing feature” is intentional and downgrade/suppress P2 KISS/YAGNI findings.
- Touches `.opencode/skills/sk-code-review/references/code_quality_checklist.md:122-143` KISS/DRY, especially speculative future flexibility/YAGNI.
- Also touches performance/scaling review prompts at `code_quality_checklist.md:47-59` when the ceiling is scale-related.
- It must not suppress security/correctness, public contract, persistence, auth, sandboxing, or data-loss findings.
- For fix-completeness classes, use `algorithmic` for naive parser/heuristic ceilings, `matrix/evidence` for env/scale/runtime-axis ceilings, and only `instance-only` when grep proves no siblings/consumers per `fix-completeness-checklist.md:20-42`.

Integration risks:
- Ceiling comments rot when load/requirements change.
- They can become excuses to skip real fixes.
- Vague comments like `// ceiling: simple for now` are worse than no comment.
- `hygiene-ok` can hide forbidden traceability labels if overused.

```json
{"seat":"gpt-2","lens":"ceiling-comments-vs-comment-hygiene","findings":[{"id":"F1","title":"Ceiling-comment content is durable WHY, but the ponytail brand prefix should not be adopted","ponytail_source":"external/ponytail-main/skills/ponytail/SKILL.md#L50","target":"sk-code:.opencode/skills/sk-code/scripts/check-comment-hygiene.sh + sk-code:.opencode/skills/sk-code/references/universal/code_style_guide.md","mechanism":"The checker only flags ephemeral tracking patterns and would not flag ponytail:/ceiling: unless the line also contains ADR/REQ/CHK/spec/finding-style labels; policy allows durable constraints and upgrade paths but not perishable labels.","recommendation":"Adopt a neutral stable convention such as ceiling: or intentional-limit:, and do not add it to ALLOWED_PATTERNS; use a separate detector if reviewer/tool recognition is needed.","value":"high","effort":"S","integration_risk":"Allowed-pattern suppression would create a bypass for forbidden IDs on the same line; brand prefix may become cargo-cult traceability.","redundant_with":"","confidence":"high"},{"id":"F2","title":"Review can downgrade P2 over-engineering findings when a concrete ceiling comment proves intentional simplification","ponytail_source":"external/ponytail-main/skills/ponytail/SKILL.md#L50","target":"sk-code-review:.opencode/skills/sk-code-review/references/code_quality_checklist.md","mechanism":"KISS/YAGNI checks flag speculative complexity; a concrete shortcut+ceiling+upgrade-path comment is evidence against 'this is too simple' false positives, especially for P2 maintainability/performance comments.","recommendation":"Treat ceiling comments as downgrade/suppress evidence only for P2 KISS/missing-feature concerns; never suppress security/correctness/contract/persistence/auth/sandboxing defects, and require runnable evidence for non-trivial logic.","value":"medium","effort":"S","integration_risk":"Comments can rot or become excuses to defer required fixes; reviewers must verify the current requirement still fits the stated ceiling.","redundant_with":"","confidence":"high"}],"newInfoRatio":0.42,"negative_knowledge":["Repo-root CLAUDE.md was not present; the quotable comment-hygiene hard-block is in AGENTS.md and the universal code style guide.","The existing hygiene checker does not need a tweak for ceiling comments; adding ceiling: to ALLOWED_PATTERNS would be risky because allowed patterns bypass violation checks.","hygiene-ok is an escape hatch, not the right mechanism for routine intentional-simplification markers."]}
```