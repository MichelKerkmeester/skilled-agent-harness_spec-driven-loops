# Iteration 003 — KQ-R1c: post-remediation mechanical claims coherence

Session: fanout-deepseek-v4-flash-overengineering-1788762836148-1dgwlq | run 3 | focus: verify 011's three mechanical claims — help printer (categories derived, 39 rules, test holds it), README "three strict-only rules" count, and the freshness fingerprint definition now agreeing across checker code / validation-rules.md / governance.
Evidence reads: `runtime/cli/spec/validate.sh:40-84` (printer), `runtime/cli/lib/validator-registry.json` (python count), `runtime/cli/tests/validate-help-lists-every-rule.vitest.ts` (48 lines), `runtime/cli/validation/continuity-freshness.ts:240-420` (evaluateCompletionFreshness), `runtime/lib/validation/spec-doc-structure.ts:600-635` (normalizeForContinuityFingerprint + buildContinuityFingerprint), `references/validation/validation-rules.md:113`, `AGENTS.md:280,301`, `README.md:62,133,593`, `runtime/cli/validation/generated-metadata-integrity.ts` (105 lines). Reads cost: 6 bash calls. No node/validate/git.

## Positive confirmations (the 011 mechanics hold, verified line-by-line)

1. **Help printer**: `validate.sh:45-61` `list_registry_rules()` derives `categories = [...new Set(rules.map(category))]` from the registry and prints every rule id + severity + strict-only suffix, including the `structural` category (6 rows, re-counted). `validate-help-lists-every-rule.vitest.ts` (48 lines) asserts (a) every registry rule id appears with its severity and (b) every category gets its own heading — registry-driven, so a new category needs no test edit. The old hardcoded pair is gone. 39 rows re-counted = 20 authored_template / 13 operational_runtime / 6 structural; severities 32 error / 5 warn / 2 info (unchanged from round one's count — live cells, no stale numbers anywhere in the checked-in registry).
2. **Three strict-only rules**: `strict_only` in the registry = exactly CONTINUITY_FRESHNESS, GENERATED_METADATA_INTEGRITY, GENERATED_METADATA_DRIFT — matches README.md:62 ("three strict-only rules gated behind `--strict`") and README.md:593 (`--strict` for strict-only rules). The old "four" claim is gone everywhere in-tree.
3. **Fingerprint definition — all three layers now agree**: `validation-rules.md:113` states the fingerprint = SHA-256 of implementation-summary.md's own text after "line endings are normalized, trailing whitespace is stripped and the fingerprint line itself is zeroed". `spec-doc-structure.ts:629-635` implements exactly that (CRLF→LF; `^(\s{6}fingerprint:\s*)(?:["'])?sha256:…` → ZERO placeholder with 6-space indent at the YAML depth the continuity writer actually stamps; trailing `[ \t]+$` per line stripped). `continuity-freshness.ts:339-356` binds the attestation to implementation-summary.md's stored `_memory.continuity.session_dedup.fingerprint` (the only stamped doc), compares to `recomputedFingerprint` of that doc, and zero/missing fingerprints are skipped rather than warned ("never recorded" semantics — matches validation-rules.md:113 and AGENTS.md:280). No layer names a different input; F30's definition-half is fixed and coherent.

## Observed, recorded (not findings)

- **One rule row, two verdict engines** — `continuity-freshness.ts` carries `evaluateCompletionFreshness` (completion-claim vs fingerprint + dirty-tree) and `validateContinuityFreshness` (last_updated_at vs graph-metadata save time). The timestamp branch runs only when completion-freshness says `no_completion_claim`; the code comment (:378-390) documents the authority protocol. Kept judgment: sub-behaviors of one documented rule, distinct codes in the report; the authority protocol prevents silent cross-substitution. No cut.
- **`generated-metadata-integrity.ts`** (105 lines) is a thin CLI bridge over `@spec-kit/runtime/api` (`checkGeneratedMetadataIntegrity` + `resolveGeneratedMetadataIntegrity` + grandfather/status-completion gates) — the real check lives in runtime/api (out of the file); the registry row is a bridge only. Consistent with the "3-layer execution machinery" finding round one kept; note only.
- README.md:133 "Exit 0 means all rules pass" is a simplification vs the governance contract (exit 0 also covers warn-only runs); the authoritative exit doc (root governance, validation-rules.md) carries the distinction. Not counted as a finding — layering, not contradiction.

## Findings

**No new findings this iteration** — the three 011 mechanical claims verified true against the current tree; the only candidate observed (README:133 wording) is the simplification/contract layering, not a contradiction to fix. Convergence telemetry: rolling-avg 0.75; treated as telemetry only per dispatch (threshold 3 unreachable on the 0..1 scale).

## Ruled out / corrections

- "The help test hardcodes the rule list" — FALSE: it reads the registry at runtime (both assertions are registry-driven; a new category/rule needs no test change) — the 011 claim holds.
- "The checker hash input is still unnamed anywhere" — corrected (round-one F30 half): validation-rules.md:113 names it exactly, code matches.
- "Defensive check — the normalize regex zeroes only exactly-6-space-indented fingerprint lines": verified the depth matches the continuity writer's emission (`_memory:continuity:session_dedup:fingerprint` is 6-deep); a differently-indented stamped line would not be zeroed and would make the hash unstable — the generator's own emitter is the only one that stamps, so this is contained (noted, not a finding).

## Provisional counts (this tree)

- Registry: 39 rows (20/13/6 categories; 32/5/2 severities; 3 strict-only) — re-counted, matches README claims.
- Help test: 48 lines, 2 assertions, registry-driven.
- Fingerprint normalization surface: 1 function × 3 transforms (line-endings, zeroing, trailing ws) — matches the docs word-for-word.
