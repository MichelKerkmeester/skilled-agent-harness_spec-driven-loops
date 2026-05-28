<!-- framework: RCAF | sk-prompt-composed per cli-devin §4.12 | batch: deep-loop-runtime/02-05 lib-inspection (DLR-004..010) -->
<framework>RCAF</framework>

<role>
Deterministic manual-testing executor for the deep-loop-runtime skill. Run each scenario's documented Steps for real against CURRENT source and tests; report PASS / PARTIAL / FAIL / SKIP with reproducible evidence. Execute for real — never mock, never infer from memory. SKIP only on a concrete sandbox blocker.
</role>

<context>
Repo root (cwd): /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
Skill root: .opencode/skills/deep-loop-runtime/

CRITICAL — source-anchor base path: every scenario's SOURCE ANCHORS path (e.g. `lib/deep-loop/<x>.ts`, `tests/unit/<x>.vitest.ts`) is RELATIVE TO THE SKILL ROOT above, NOT the repo root. Resolve all anchors under `.opencode/skills/deep-loop-runtime/`.
SANDBOX REALITY: vitest cannot be executed here (permission-mode auto blocks exec, and deep-loop-runtime has no wired vitest config). Reach each verdict by INSPECTING the implementation source AND the matching `tests/unit/*.vitest.ts` assertions — the scenarios explicitly permit "Run OR inspect". Do not attempt to run vitest.

Scenario files (read each in full; the file names its own impl + test anchors):
  02--prompt-rendering/004-prompt-pack.md            (DLR-004, impl lib/deep-loop/prompt-pack.ts)
  03--validation/005-post-dispatch-validate.md       (DLR-005, impl lib/deep-loop/post-dispatch-validate.ts)
  04--state-safety/006-atomic-state.md               (DLR-006, impl lib/deep-loop/atomic-state.ts) [FOUNDATIONAL primitive]
  04--state-safety/007-jsonl-repair.md               (DLR-007, impl lib/deep-loop/jsonl-repair.ts)
  04--state-safety/008-loop-lock.md                  (DLR-008, impl lib/deep-loop/loop-lock.ts)
  04--state-safety/009-permissions-gate.md           (DLR-009, impl lib/deep-loop/permissions-gate.ts)
  05--scoring/010-bayesian-scorer.md                 (DLR-010, impl lib/deep-loop/bayesian-scorer.ts)
(all under .opencode/skills/deep-loop-runtime/manual_testing_playbook/)
Context budget: treat any `[... truncated N tokens]` marker as an intentional boundary; do not invent omitted content.
</context>

<pre-plan>
1. Read all 7 scenario files; per ID extract {impl anchor, test anchor, documented pass condition}. Acceptance: a per-ID list. Verify: re-print it before inspecting.
2. For each ID in order, resolving anchors under the skill root: open the impl .ts and confirm the documented function/type/field/behavior exists; open the matching tests/unit/*.vitest.ts and confirm assertions cover that behavior. Verify: note the concrete file:line for the decisive symbol.
3. Compare observed source/test reality to each scenario's Expected Outcome + Failure Modes; assign PASS / PARTIAL / FAIL / SKIP. For any non-PASS, cite the precise contradiction. Verify: every verdict cites a file:line anchor.
4. Emit the verdict table + summary. Verify: exactly 7 rows (DLR-004..010).
</pre-plan>

<action>
Use sequential_thinking (>=5 thoughts) to plan, then inspect-and-verdict the 7 scenarios (DLR-004..010) per their documented Steps.
Spec folder: .opencode/specs/system-spec-kit/030-deep-loop-skills-playbook-validation/001-deep-loop-runtime-scenarios (pre-approved, skip Gate 3).
</action>

<format>
Return ONLY:

### BATCH VERDICTS: deep-loop-runtime/02-05-lib-inspection
| Scenario ID | Category | Verdict | Decisive inspection | Evidence excerpt (<=8 lines) | Anchor file:line | Notes |
|---|---|---|---|---|---|---|
(one row each: DLR-004, DLR-005, DLR-006, DLR-007, DLR-008, DLR-009, DLR-010)

### BATCH SUMMARY: <p> PASS / <pa> PARTIAL / <f> FAIL / <s> SKIP

Keep each evidence excerpt <=8 lines. Standard constraints only.
</format>
