# Disposition Table — Advisor Surface Audit

Nine findings re-verified against current HEAD. Four applied, five recorded with a reason.

| Finding | Cat | Disposition | Evidence |
|---------|-----|-------------|----------|
| F1 | CAT-1 | **APPLIED** | Four `handle_advisor_*` aliases removed from their handler files and the barrel. Outside `.opencode/specs/` (archived transcripts) they appeared only in their own declaration and the re-export. |
| F2 | CAT-1 | DEFERRED | Launcher forwards an unused Codex timeout variable. The launcher is 1,497 lines and a shared-supervision consumer; touching it needs its own verification pass. |
| F3 | CAT-2 | RECORDED | Two `search-quality/harness.ts` copies exist, 15 whitespace-normalized diff lines apart. The advisor copy's only reference is its own README. Genuine duplication, but which copy is canonical is a decision, not a cleanup. |
| F4 | CAT-3 | **APPLIED** | One tracked `shadow-deltas.jsonl` inside a pid-and-timestamp temp workspace, untracked and deleted; `**/tests/.tmp-*/` added to `.gitignore` so a run cannot recommit one. |
| F5 | CAT-4 | RECORDED | `semantic-shadow-cosine.vitest.ts` sits outside the `tests/**` include glob and has never run. Wiring it will likely surface real failures; that is a decision with its own blast radius. |
| F6 | CAT-4 | DEFERRED | Retained code-graph benchmarks are misplaced and reported broken. Benchmarks are archive-governed in this repository, so relocation needs the owning README read first. |
| F7 | CAT-5 | RECORDED | The documented test contract and Vitest discovery disagree. Same root cause as F5; both should be resolved by one decision about where tests may live. |
| F8 | CAT-5 | RECORDED | The compatibility contract has two manually synchronized sources. Needs the canonical side named before either is touched. |
| F9 | CAT-6 | RECORDED | All nine MCP tool descriptors are copied into a second CLI registry. Removing either breaks a surface until the canonical registry is chosen. |

## Why five were not executed

Three of them (F3, F8, F9) are the same shape: two sources of one truth, where the fix is not "delete a copy" but "decide which copy is authoritative and make the other derive from it". Choosing wrong replaces duplication with a wrong single source, which is harder to notice.

F5 and F7 are also one problem rather than two. A test outside the include glob has never run, and the documented contract says tests live somewhere the runner does not look. Wiring the test in without settling the contract just moves the disagreement.

## The systemic finding

F5 is the **second** independent instance in this repository of a test file that exists, looks maintained, and has never executed. The release-cleanup audit found `detector-regression-floor.vitest.ts.test.ts`, invisible because its filename fell outside the include glob; this one is invisible because its directory does.

Two instances found by two unrelated audits means the class is systemic. The durable fix is a check that fails when a `*.vitest.ts` file on disk is not collected by any Vitest project, rather than two point repairs that leave the third instance undiscovered.
