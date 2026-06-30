# Iteration 005 — Cross-cutting + Hook coverage

## Findings (P0/P1/P2 with evidence — HIGH BAR for novelty; only flag what iters 1-4 missed)

### P0 — Blockers

None newly discovered in this pass.

The D9 supersession gap is critical, but it is not novel: iteration 003 already recorded it as a P1 formal-doc staleness issue. This iteration confirms it remains unresolved.

### P1 — Required

1. **ADR-005 is revised in metadata but still unrevised in the decision body.** Phase 1 `decision-record.md` says ADR-005 is `Accepted (revised...)` and its revision note correctly says ClickUp practice is `package.json` + `package-lock.json` committed while `node_modules` is built locally via `npm install` (`001-barter-figma-agent/decision-record.md:166-169`). The same ADR then still says "Full bundling - include `node_modules/` in the commit" and "the entire folder commits" (`decision-record.md:179-182`), with consequences about repo-size growth (`decision-record.md:188-191`). Phase 1 `implementation-summary.md` has the correct revised state: `node_modules` is gitignored and not committed (`implementation-summary.md:43-46`, `:85-87`, `:108-111`). Fix: rewrite ADR-005's Context/Decision/Consequences body so it matches the revised status and implementation summary.

2. **Hook F's current one-failure state is not reflected in formal closeout docs.** The review strategy says parity tests now pass and only `advisor-graph-health` remains failing due to sk-code drift (`review/deep-review-strategy.md:72`). I re-ran the targeted advisor tests: `advisor-corpus-parity.vitest.ts` and `python-ts-parity.vitest.ts` passed, while `advisor-graph-health.vitest.ts` failed on sk-code `kind: "reference-category"`. However, Phase 3 `implementation-summary.md` still says 293/296 with 3 known failures in frontmatter and Hook F (`003.../implementation-summary.md:3`, `:15`, `:103-111`), and the parent phase map still says hooks E+F+G passed with 3 documented known failures (`spec.md:104`). Fix: update Phase 3 summary/frontmatter and parent map to the current 1-failure state, or explicitly ledger the later commit that resolved the two parity gaps.

### P2 — Suggestions

1. **The sk-code drift handoff is documented, but the tracking path is indirect.** 067 marks the invalid `reference-category` enum as out-of-scope and "069 packet's territory" (`review/deep-review-strategy.md:41-42`; `003.../implementation-summary.md:128`). The 069 packet exists and its scope includes refreshing sk-code `graph-metadata.json` (`069-sk-code-motion-dev-and-playbook/spec.md:91-96`), and the live invalid entity is in `.opencode/skills/sk-code/graph-metadata.json:199-202`. I found no explicit 069 task text for `advisor-graph-health` or `reference-category`. This is acceptable as an out-of-scope marker, but weak as a follow-up tracker.

## Coverage

| Sub-check | Status | Evidence |
|---|---|---|
| A. D9 supersession acknowledged | FAIL | Actual Public/Figma is internal-scope after commit `766206b` (`git -C AI_Systems/Public show --no-patch --oneline 766206b`; current `Public/Figma/README.md:24`, `:45-54`, `:644-647`). Review strategy acknowledges the supersession (`review/deep-review-strategy.md:68`). Formal Phase 2 docs are still stale: `002-public-figma-agent/spec.md:59-62`, `decision-record.md:48-69`, and `implementation-summary.md:3`, `:56`, `:85` still describe open-source framing. Already found in iteration 003; still unresolved. |
| B. ADR-005 revised state consistent | FAIL | Metadata/revision note is revised (`001.../decision-record.md:166-169`), but the ADR body still chooses committed `node_modules` (`:179-182`) while Phase 1 summary says the lighter gitignored pattern is actual and correct (`001.../implementation-summary.md:108-111`). |
| C. Hook A-G coverage all green | FAIL | B PASS: Phase 1 summary says Hook B 9/9 PASS (`001.../implementation-summary.md:90-102`). C PASS: Hook C 5/5 PASS (`002.../implementation-summary.md:79-87`). D PASS: Hook D 7/7 PASS (`002.../implementation-summary.md:89-99`). E PASS after 5b: `003.../implementation-summary.md:94-101`. F NOT GREEN: targeted vitest run exits 1 with only `advisor-graph-health` failing on sk-code `reference-category`; parity tests passed. G PASS: `003.../implementation-summary.md:113-120`. Hook A evidence is weaker but parent strict validation now exits 0. |
| D. Telemetry retention acceptable | PASS | `.opencode/skills/.smart-router-telemetry/compliance.jsonl` retains exactly 4 `mcp-figma` rows (`rr-iter2-052`, `rr-iter3-176`, `rr-iter3-187`, `rr-iter3-198`). Phase 3 summary explicitly preserves them as gitignored immutable history per D2 spirit (`003.../implementation-summary.md:98`, `:130`). No purge recommended. |
| E. Sk-code drift tracked elsewhere | FAIL | Out-of-scope is documented in 067 (`review/deep-review-strategy.md:41-42`; `003.../implementation-summary.md:128`), and 069 exists with sk-code metadata scope (`069.../spec.md:91-96`). But there is no explicit 069 mention of `advisor-graph-health` or `reference-category`; the live invalid entity remains at `.opencode/skills/sk-code/graph-metadata.json:199-202`. |
| F. validate.sh --strict | PASS | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/z_archive/053-mcp-figma-transfer --strict` auto-enabled recursive phase-parent validation and exited 0 with `RESULT: PASSED`. |
| G. handover.md presence | CONDITIONAL | `find .../067-mcp-figma-transfer -name handover.md` returned no files. Resume is partly covered by `_memory.continuity` in phase summaries, but no parent or child handover exists for an operator-friendly continuation path. |
| H. _memory.continuity blocks current | FAIL | Phase 1 has useful current D5 continuity (`001.../implementation-summary.md:10-30`). Phase 3 continuity is stale against the current Hook F state: it still says 3 known failures (`003.../implementation-summary.md:10-16`) while strategy and targeted tests show only graph-health remains (`review/deep-review-strategy.md:72`). |

## Verdict

CROSS-CUTTING: FAIL

The parent strict validator passes, and most hook coverage is clean. The packet is still not cross-cutting clean because formal docs remain stale against real repo state in three places: D9 internal-scope supersession, ADR-005 revised bundling semantics, and Hook F's current one-failure status.

## Newly Discovered Concerns (NOT in iter 1-4)

- ADR-005 was only partially revised: its metadata and revision note are correct, but the decision body still instructs committed `node_modules`.
- Hook F's improved state is split across sources: strategy plus live tests show only one remaining failure, while Phase 3 summary and parent map still describe three failures.
- The sk-code `advisor-graph-health` follow-up is out-of-scope but not explicitly task-tracked inside the 069 packet.

## Next Focus (for iteration 6)

Adversarial resume-readiness check: verify whether a fresh `/speckit:resume` user would land on the correct current truth from parent `graph-metadata.json`, phase `_memory.continuity`, implementation summaries, and review strategy despite the stale Phase 2/Phase 3 formal docs.
