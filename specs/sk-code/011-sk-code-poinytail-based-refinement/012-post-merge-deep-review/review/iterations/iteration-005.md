# Iteration 005 — Security: path containment and untrusted input

BINDING: target=Commits ba56b03412..5d9c970447 on main: the 37 commits of the sk-code Ponytail refinement epic, the merge 144b1d339e, then 9a74576ccc and 5d9c970447
BINDING: maxIterations=10
BINDING: convergence=0.1
BINDING: mode=review
BINDING: dimensions=security
BINDING: specFolder=specs/sk-code/011-sk-code-poinytail-based-refinement/012-post-merge-deep-review

## Dimension

security — path containment and untrusted input across the epic: generate-leaf-manifest.cjs symlink and git-ignore handling, hook stdin readers (unbounded input, JSON parse of partial input), the Webflow runtime check fix 82d297a374, and drift-guard or checker scripts that shell out with interpolated paths.

## Files Reviewed

| File | What was checked | Result |
|------|------------------|--------|
| .skilled/hooks/shared/hook-adapter-shared.cjs | readStdin accumulation, deadline settle, parseJsonFailOpen | No byte cap; finding R5-SEC-001 |
| .skilled/hooks/shared/hook-flags.sh | kill-switch resolver, eval-guard on switch names | Quoted expansions, name charset guard; no defect found |
| .skilled/hooks/classifier-injection-screen/claude/classifier-injection-screen-posttooluse.mjs | untrusted fetched text path, fail-open contract | Advisory-only by contract; fail-open deliberate |
| .skilled/hooks/ call sites (rg readStdin) | every adapter that consumes the shared reader | 20+ sites; all share the same uncapped reader |
| .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs | symlink containment (:141-:148, :179-:194), git-ignore drop (:112-:134), atomic write (:478-:503), symlink refusal (:518), alias diskPath validation (:76-:79), scope validation (:306-:323) | Alias diskPath check misses Windows forms; finding R5-SEC-002; writer and walker containment confirmed clean |
| .skilled/skills/sk-doc/sk-create-skill/scripts/lib/leaf-resource-contract.cjs | toPosix, assertContainment, resolveSharedAlias | assertContainment validates leafResourceId separately (:104, :135) |
| .skilled/skills/sk-code/sk-code-webflow/assets/scripts/test-minified-runtime.mjs | callback error capture, depth cap, PASS/FAIL decision | Depth cap silently absorbs callbacks; finding R5-SEC-003 |
| .skilled/skills/sk-code/sk-code-webflow/assets/scripts/runtime-fixture/** | known-bad and known-good fixtures executed read-only | known-bad 4/4 FAIL, known-good 2/2 PASS as printed |
| .skilled/skills/sk-code/sk-code-webflow/assets/scripts/minify-webflow.mjs | execFileSync call | argv array, no shell |
| .skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh | guard invocation, quoting, root resolution | set -euo pipefail, all expansions quoted, roots from BASH_SOURCE |
| .skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify_stack_folders.py | root resolution | Path(__file__).resolve().parents[2]; cwd-independent |
| .skilled/skills/sk-doc/sk-create-skill/scripts/regenerate-skill-derived.cjs | git check-ignore invocation | argv array (:73), no shell |
| .skilled/hooks/task-dispatch/cursor/task-dispatch-guard.mjs | spawnSync call | argv array (:84), no shell |

## Findings by Severity

### P0

None.

### P1

None.

### P2

1. **R5-SEC-001 — Shared CJS stdin reader buffers without a byte cap; the deadline bounds time, not memory** — .skilled/hooks/shared/hook-adapter-shared.cjs:26 — readStdin pushes every chunk into an unbounded array, with no maxBytes option and no truncation path; the 3000 ms default deadline (:20, timer at :47) bounds how long it reads, not how much it keeps [SOURCE: .skilled/hooks/shared/hook-adapter-shared.cjs:26] [SOURCE: .skilled/hooks/shared/hook-adapter-shared.cjs:20] [SOURCE: .skilled/hooks/shared/hook-adapter-shared.cjs:47]. The system-spec-kit TS sibling exposes a maxBytes option for the same protocol [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/shared-stdin.ts:28] [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/shared-stdin.ts:79]; the CJS copy read by every adapter under .skilled/hooks has no equivalent.
   Finding class: security — unbounded resource consumption on a shared adapter; the reader is imported by 20+ hook entrypoints (rg readStdin over .skilled/hooks).
   Scope proof: .skilled/hooks/shared/hook-adapter-shared.cjs is in review/scope-files.txt and was rewritten by the epic's deadline commits (iteration 2 narration).
   Distinguishing note: R2-COR-001 covers three registered entrypoints that read stdin with no deadline at all; this is a different claim about the deadline-equipped shared reader — truncation is absent from the reader that has the deadline. Iteration 2's file table already recorded "No byte cap (its TS sibling has one)" but never registered it as a finding.
   Evidence: live probe against the real module, stdin held open 3 s:
   bytes=6 elapsedMs=1002 json=null
   large-bytes=30000000
   The first line shows the deadline override firing at 1002 ms with partial bytes; the second shows 30 MB accepted whole by the same reader with no cap.
   Claim adjudication: {"claim":"readStdin accumulates unbounded bytes into memory; only time (the deadline) is bounded","evidenceRefs":[".skilled/hooks/shared/hook-adapter-shared.cjs:20",".skilled/hooks/shared/hook-adapter-shared.cjs:26",".skilled/hooks/shared/hook-adapter-shared.cjs:47",".skilled/skills/system-spec-kit/runtime/hooks/shared-stdin.ts:79"],"counterevidenceSought":"Searched the reader and its test for a cap constant or truncation path (rg maxBytes over .skilled/hooks/shared returns nothing); checked every call site for a cap argument (only timeoutMs is destructured)","alternativeExplanation":"the host runtime is the only stdin writer and already holds the payload, so a cap belongs to the host","finalSeverity":"P2","confidence":0.9,"downgradeTrigger":"a documented host-side payload bound, or a caller passing a byte cap into this reader"}

2. **R5-SEC-002 — Alias diskPath containment check misses backslash traversal and drive-letter forms that the sibling scope validator rejects** — .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:77 — the alias check tests the raw string with startsWith('/') and split('/').includes('..'), so ..\..\x, C:\x and C:/x pass a check whose own error text says "hub-relative, contained path" [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:77] [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:78]. normalizeLeafScope in the same file normalizes backslashes first and rejects drive-letter forms [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:307] [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:309]. Downstream, resolveSharedAlias runs toPosix over diskPath [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/lib/leaf-resource-contract.cjs:87] [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/lib/leaf-resource-contract.cjs:256], so a backslash traversal becomes a literal traversal string in matching semantics instead of being rejected at the gate.
   Finding class: security — containment validation gap (cross-platform path forms).
   Scope proof: file is inside the declared review scope and was changed inside the reviewed range (144b1d339e merge, 5ccf783d26 ignore fix).
   Case: an authored leaf-aliases.json entry with diskPath "..\..\secrets.md" or "C:\x.md" validates clean; the same shapes are refused by the scope validator two functions below.
   Claim adjudication: {"claim":"the alias diskPath check does not enforce the containment it advertises for Windows path forms","evidenceRefs":[".skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:77",".skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:307",".skilled/skills/sk-doc/sk-create-skill/scripts/lib/leaf-resource-contract.cjs:256"],"counterevidenceSought":"Checked whether diskPath can reach the filesystem (it cannot: it is only string-matched in resolveSharedAlias) and whether alias leafResourceIds have their own containment (they do: assertContainment at leaf-resource-contract.cjs:104, called at :135)","alternativeExplanation":"the check is deliberately POSIX-only because authored aliases are POSIX, but nothing states that and the sibling validator in the same file handles Windows forms","finalSeverity":"P2","confidence":0.8,"downgradeTrigger":"proof that alias files are normalized before this check (for example a writer that rewrites backslashes) or a contract note declaring diskPath POSIX-only"}

3. **R5-SEC-003 — Webflow runtime check silently drops callbacks past depth 20, so a deferred crash beyond the cap still reports PASS** — .skilled/skills/sk-code/sk-code-webflow/assets/scripts/test-minified-runtime.mjs:42 — run_callback returns without recording anything once callback_depth reaches MAX_SYNC_CALLBACK_DEPTH, so no entry reaches callback_errors and the PASS decision at :358 cannot see it [SOURCE: .skilled/skills/sk-code/sk-code-webflow/assets/scripts/test-minified-runtime.mjs:42] [SOURCE: .skilled/skills/sk-code/sk-code-webflow/assets/scripts/test-minified-runtime.mjs:358]. The cap and the recorder were both introduced by the reviewed fix 82d297a374 (git show: "+const MAX_SYNC_CALLBACK_DEPTH = 20" and "+ if (callback_depth >= MAX_SYNC_CALLBACK_DEPTH) return;"), whose stated contract is "Errors thrown inside setTimeout, requestAnimationFrame and Webflow.push callbacks" with no depth boundary [SOURCE: .skilled/skills/sk-code/sk-code-webflow/assets/scripts/test-minified-runtime.mjs:14]. The cap is load-bearing for the known-good poller, which retries until the cap every run [SOURCE: .skilled/skills/sk-code/sk-code-webflow/assets/scripts/runtime-fixture/known-good/src/2_javascript/z_minified/late-element-poll.js:7], so the fix trades a false FAIL for a silent false PASS: the checker cannot distinguish "the polling script ended" from "a callback chain longer than 20 was never judged".
   Finding class: security — verification integrity; a deploy gate (the script prints "Do not deploy" on failure) can pass a script that crashes past the cap.
   Scope proof: test-minified-runtime.mjs and the fixtures are changed files of the reviewed commit 82d297a374 (git show --stat) and inside review/scope-files.txt.
   Evidence: fixtures executed read-only from their own directories: known-bad printed Failed: 4/4 and the "Do not deploy" line; known-good printed Passed: 2/2. Cap lines added by the fix commit (diff above).
   Claim adjudication: {"claim":"a callback error that fires after 20 nested synchronous callbacks is never recorded and the file reports PASS","evidenceRefs":[".skilled/skills/sk-code/sk-code-webflow/assets/scripts/test-minified-runtime.mjs:42",".skilled/skills/sk-code/sk-code-webflow/assets/scripts/test-minified-runtime.mjs:358",".skilled/skills/sk-code/sk-code-webflow/assets/scripts/runtime-fixture/known-good/src/2_javascript/z_minified/late-element-poll.js:7"],"counterevidenceSought":"Checked whether the cap records a diagnostic when hit (it returns silently), whether deeper chains can no longer schedule (the known-good poller reaches the cap by design), and whether the fix commit documents the depth boundary in the contract (it does not)","alternativeExplanation":"callbacks beyond the cap are only reachable by endless pollers that cannot error, so the blind spot is unreachable","finalSeverity":"P2","confidence":0.7,"downgradeTrigger":"a demonstration that no reachable callback chain can carry an error past depth 20, or a checker note accepting the depth bound"}

## Ruled Out

- Deadline-truncated stdin reaching a security gate as a valid payload: ruled out (again) — the reader resolves partial bytes and consumers fail open via parseJsonFailOpen returning null; probe1 reconfirmed bytes=6 json=null. This direction was already ruled out in iteration 2 and is not re-reported [SOURCE: .skilled/hooks/shared/hook-adapter-shared.cjs:54].
- Shell injection via interpolated paths in checker or drift-guard scripts: all child_process call sites use argv arrays with no shell — generate-leaf-manifest.cjs:105 and :123, regenerate-skill-derived.cjs:73, minify-webflow.mjs:105, task-dispatch-guard.mjs:84 — and run-all-drift-guards.sh runs under set -euo pipefail with every expansion quoted [SOURCE: .skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh:20] [SOURCE: .skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh:49]. verify_stack_folders.py resolves its tree from its own file location, not from cwd or argv [SOURCE: .skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify_stack_folders.py:13].
- Manifest write-through-symlink: refused before writing [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:518]; the write is an O_EXCL temp file plus rename over the destination [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:478]; walk symlinks are resolved and refused when they escape the skill root or target a non-file [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:188].
- git-ignore mapping drift: check-ignore output is matched back by index against the exact repo-relative paths sent on stdin, and any other git failure falls back to name rules [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:129].

## Not Proven

- R5-SEC-003 reachability: no real minified script is demonstrated to throw exactly past the depth cap; the code path is proven, the live occurrence is not. This bounds the finding to P2.
- R5-SEC-002 exploitability: diskPath never reaches the filesystem, so the gap is validation laxity with no demonstrated read; bounded to P2.
- R5-SEC-001 exploitability: the host runtime is the only writer of hook stdin, so the unbounded buffer is a resource-exhaustion hardening item, not a demonstrated external attack.

## Edge Cases

1. The fixture runs were piped through tail, so the displayed EXIT=0 is the pipeline's last-command status, not the checker's exit code; the printed summaries (Failed 4/4 with the "Do not deploy" line, Passed 2/2) are the evidence used.
2. A non-work-tree run of the generator keeps custom-ignored files that only the 3-name fallback set does not cover; the fallback is documented and the manifest carries names only, so this is recorded as a note, not a finding.
3. find_js_files skips symlinked entries silently because readdir withFileTypes reports symlinks as neither file nor directory; recorded, not a finding (minified output trees hold real files).

## Confirmed-Clean Surfaces

- Alias leafResourceId containment is separately enforced by assertContainment [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/lib/leaf-resource-contract.cjs:104].
- The manifest writer never follows a symlink and restores the destination's mode from an lstat without following it [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:486].
- run-all-drift-guards.sh resolves all four guard paths from its own location and fails the gate on any guard failure [SOURCE: .skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh:33].
- The Webflow checker's callback-error path works for the shipped known-bad family: four files each fail with the named source of the first error [SOURCE: .skilled/skills/sk-code/sk-code-webflow/assets/scripts/test-minified-runtime.mjs:366].

## Traceability Checks

- Core (spec_code, checklist_evidence): not exercised this iteration; security focus only, core rows remain on the rotation for later iterations.
- Overlay (skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability): not exercised this iteration.

## Scope Violations

None. No out-of-scope mutation was attempted.

## Next Dimension

correctness — iteration 6 per the focus plan (sk-code-review checkers and canary commits 637eeaeb2e, da9ded3b36, 26df6c4a8a, 4dab32444c, 3cf65c519e, eda0cb91e4), unless the orchestrator re-assigns.

Review verdict: PASS
