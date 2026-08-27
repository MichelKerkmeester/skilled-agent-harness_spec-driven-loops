# Deep Review Report — deep-alignment deprecation + session work

## 1. Executive summary

Independent review of the three commits shipped this session (deep-alignment + conformance-benchmark removal `8849444aa6`; executor single-dispatch routing `d1a5981b58`; Phase-0 gate retirement `e41aa1878a`). The code changes are sound — the executor dispatch fails closed, there is no injection surface, and the retired gate was not a trust boundary. **The review caught one real release-blocker the removal shipped: the removal was incomplete** — it deleted the deep-alignment/command-benchmark commands and their `agents/` mirrors but left four git-tracked **prompt** mirrors that still dispatch agents to the deleted command files, contradicting the packet's recorded "0 active refs" gate. That P0 and the surrounding documentation drift were remediated in this same pass and re-verified.

**As-reviewed verdict: FAIL** (1 confirmed P0). **Post-remediation verdict: PASS** (P0 removed, doc-drift closed, re-verified — §5, §7).

## 2. Method & deviations

The canonical `/deep:review :auto` loop (opencode `run --command`) **hangs fleet-wide** at iteration-2 process-nesting / startup (an opencode snapshot-lock deadlock, reproduced across cli-devin, cli-pi, and three independent sessions). Per PLAN-WORKFLOW LOCK the deviation was operator-flagged and approved, and an independent fresh-Opus review confirmed the strategy. The review therefore ran as **operator-approved manual multi-agent orchestration**: the conductor (Claude Opus) is the single writer of all state artifacts; read-only review passes ran on **cli-pi `glm-5.3-flash` (OpenRouter route)**; every finding carries `[SOURCE: file:line]` and every P0/P1 was re-verified by the conductor against the tree before it entered this report.

**Deviation from the requested 10 iterations, recorded honestly:** four breadth dimension passes ran on cli-pi (correctness, security, spec-alignment, completeness). The completeness pass and any further whole-tree passes **hung the executor** (13 min, no output — the same class of failure that blocks the loop), so completeness was completed by an authoritative conductor `git grep`, and the depth/adversarial/residual dimensions were covered by conductor verification (independent re-confirmation of every finding + the deletion blast-radius grep) rather than six more hanging cli-pi passes. Findings had fully converged (all residue is one incomplete-removal class), so additional passes would not have changed the verdict. The literal 10-pass ceremony was not achievable on the current executor; the substantive coverage (all four dimensions × three commits + adversarial verification) was.

## 3. Scope

`8849444aa6` (removal, 291 files) · `d1a5981b58` (executor single-dispatch, 10 files) · `e41aa1878a` (Phase-0 gate retirement, 33 files). Union ≈ 323 files.

## 4. Findings (as reviewed)

| # | Sev | Dimension | Source | Finding |
|---|-----|-----------|--------|---------|
| F5 | **P0** | spec-alignment / completeness | `.codex/prompts/deep-alignment.md` (+ `.codex/prompts/deep-command-benchmark.md`, `.pi/prompts/deep-alignment.md`, `.pi/prompts/deep-command-benchmark.md`) | Four git-tracked prompt mirrors for the removed commands survived; each is generated from and instructs agents to follow a now-deleted command file — a live REQ-001 violation contradicting `implementation-summary.md`'s "0 active files". Root cause: removal cleaned `agents/` mirrors but never re-ran the prompt-sync generators. |
| F1 | P1 | correctness | `.opencode/skills/system-deep-loop/SKILL.md:58` | Hub SKILL.md documented `alignment` as an active `workflowMode` (+ mode hint, backendKind), so an operator following the loaded hub instructions routed to a deleted packet. |
| F2 | P2 | correctness | `.opencode/commands/README.txt:45` | Commands index claimed 8 deep commands + listed deleted `alignment.md`; directory has 6. |
| F3 | P2 | correctness | `runtime/lib/README.md:12` (+ `mode-contracts/README.md:12`) | Runtime READMEs advertised alignment as a served mode. |
| F6 | P2 | spec-alignment | `024-executor-kind-routing/checklist.md:74` | 024 packet still cites the deleted `deep-alignment-auto.yaml` as evidence with no supersession note. |
| F7 | P2 | completeness | `.claude/SYNC.md:112` | Used `deep-alignment` as a stale past-drift example. |
| — | P2 (advisory) | correctness | `deep-review-auto.yaml:1496` | The ~90-line executor heredoc is duplicated 6× across two YAMLs — a sync obligation, acceptable for the deterministic `branch_on` design. |

No code-logic P0/P1: the correctness pass executed real suites (routing-registry drift-guard 7/7, render/projection/legacy/contract 51/51, all 3 compiled-contract digests fresh); the security pass confirmed fail-closed dispatch and no injection surface.

## 5. Remediation (applied this pass)

- **F5 (P0) — FIXED**: ran `sync-prompts.cjs` + `sync-prompts-pi.cjs` (write mode). They unlinked exactly the 4 orphan mirrors (`Wrote 0 of 33` = all valid prompts already in sync). `--check` now reports `PASS: 33 prompts are in sync` for both runtimes.
- **F1/F2/F3/F7 (P1+P2 doc-drift) — FIXED**: removed `alignment` as an active mode / backendKind from README.md, SKILL.md, ROUTER.md, `runtime/lib/README.md`, `runtime/lib/mode-contracts/README.md`, `commands/README.txt` (count 8→6, deleted the alignment.md entry), `.claude/SYNC.md`, and the manual-testing-playbook (removed the MO-005 scenario whose target file was deleted + fixed the internal scenario/mode counts). Corrected two consequent stale counts in SKILL.md ("five workflow families"→"four", "seven registered"→"six"). Kept the `alignment-convergence` prose out (its backend was deleted; registry has 0 alignment refs) and preserved all different-word uses ("subsystem alignment", "Council alignment") and historical changelog/report refs.
- **F6 (P2) — NOT fixed (documented)**: the 024 packet's stale evidence row is left as a documentation note; it is a completed-packet metadata nit with no runtime effect, tracked here rather than reopening 024.

## 6. Dimension coverage

| Dimension | c1 removal | c2 executor | c3 gate | Source |
|-----------|:-:|:-:|:-:|--------|
| Correctness | ✅ | ✅ | ✅ | iter-001 (cli-pi) |
| Security | ✅ | ✅ | ✅ | iter-002 (cli-pi) |
| Spec-alignment | ✅ | ✅ | ✅ | iter-003 (cli-pi) |
| Completeness | ✅ | ✅ | ✅ | iter-004 (conductor grep) |
| Adversarial verify | ✅ (P0 + all P1 conductor-re-verified) | | | conductor |

## 7. Verification evidence (post-remediation)

- Hard-token residue (`git grep deep-alignment|command-benchmark|conformance_benchmark|conformance-benchmark`, active tree, excl. changelog/reports/review packet): **0 files**.
- Prompt-sync: `sync-prompts --check` + `sync-prompts-pi --check` → `PASS: 33 in sync` (both).
- No active-mode `alignment` reference remains in the live hub docs (only historical + different-word uses).
- Deep-loop documentation-drift checker: `"errors": []`.
- mode-registry.json: 6 workflowModes, 0 alignment refs.
- Change set: 4 orphan deletions + 10 doc files edited; no `*.jsonl`/`*.sqlite`; no unrelated files.

## 8. Known limitations / deferred

- **Deferred (own Gate-3 packet):** the opencode deep-loop hang (snapshot-lock / iter-2 nesting under `opencode run --command deep/*`) — refuted lead: `SYSTEM_SPEC_GATE_ENFORCE` env-name (already correct); live lead: an opencode snapshot/stdio deadlock spawning iteration 2.
- The review used four cli-pi dimension passes + conductor verification rather than 10 literal passes (§2) — the executor could not sustain more heavy passes.

## 9. Verdict

The removal was not regression-free as shipped (one confirmed P0 — orphaned prompt mirrors — plus documentation drift). Both were remediated in this pass and independently re-verified: 0 residue, sync clean, docs consistent, six-mode registry intact, surviving modes and benchmark families unaffected.

Review verdict: PASS
