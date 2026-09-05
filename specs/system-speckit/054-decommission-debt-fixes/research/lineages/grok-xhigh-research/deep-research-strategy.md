# Deep Research Strategy - Memory decommission residue

## 2. TOPIC
Review-angle research over the memory-database decommission programme: what did landing (052), the runtime rename (053) and the debt-fixes packet (054) miss? Hunt residue, drift and debt the review loops did not catch.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
Generated from the reducer registry.

- [x] Q1. What live code or config still serves or describes a retired surface (memory database, memory MCP tools, spec-memory launcher, zvec lane, system-plugins, mcp-server identity of system-spec-kit/runtime)?
- [x] Q2. Which registrations, symlinks, hook configs, CI workflows and doctor assets were dropped or left dangling by the sweeps, including the eleven session-lifecycle registrations restored at 273767431d?
- [x] Q3. Which dependencies lack an importer, and which importers lack a declared dependency, across the system-spec-kit workspace (shared, scripts, runtime)?
- [x] Q4. Which tests pass only because they test a surface that no longer exists, or that were weakened rather than fixed?
- [x] Q5. Which documentation claims a behavior the code no longer has, across system-spec-kit, install-guides, README.md, AGENTS.md and the runtime mirrors?
- [x] Q6. What did the retired memory surface cover that the trigger index, ripgrep retrieval lane and continuity writer do not?
- [x] Q7. Which gates can pass while lying (freshness stamps, generated metadata, routing guard, validate.sh) after these changes?
<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Implement fixes, edit production code or regenerate derived metadata.
- Run generate-context.js, validate.sh, git write or checkout, or any command that writes outside this lineage directory.
- Read node_modules, dist, benchmark, changelog, z_archive, manual-testing-playbook, feature-catalog, package-lock.json or any trigger-index.json.
- Expand a directory with a wildcard listing.
- Re-litigate D5 preserved-set items (skill advisor, shared HF model server and socket, shared embeddings and IPC, deep-loop locks) except to name residue that still describes them as the retired memory surface.

---

## 5. STOP CONDITIONS
- Hard stop at iteration 20 (`stopPolicy: max-iterations`). Convergence before that is telemetry only.
- Do not synthesize early. Broaden review angles instead.
- Pause if `.deep-research-pause` appears in this lineage directory.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Q1: leftover writers (`memory_index` / `storeEntities`), default `context-index.sqlite`, leftover untracked `mcp-server/` tree. No live MCP/plugin/zvec.
- Q2: eleven hook registrations still live. Doctor-update still snapshots `mcp-server/database`. `.devin` build fallback still says mcp-server. Claude/Pi skills are symlinks.
- Q3: `sqlite-vec` + `sqlite-vec.d.ts` have no importer. SDK stays for advisor IPC. `better-sqlite3` still has leftover readers.
- Q4: integration/retry-manager/naming-migration/entity-extractor/workflow-invariance tests pass on gone surfaces or dead allowlists.
- Q5: extraction README ghost pipeline; session-prime README; ARCHITECTURE "memory artifacts"; doctor/CI mcp-server comments. Root README/AGENTS.md match the two-lane story.
- Q6: startup priming and `session_learning` writer have no successor. Loss table is honest; leftover harness still writes/grades sqlite. Continuity fingerprint remains.
- Q7: CONTINUITY_FRESHNESS skip-as-pass; validate.sh helper-continue; `--strict` does not fail warnings; T012 can write a lying zero-debt 052 log row.
<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- Charter-first pass so later residue hunts did not rediscover T004–T008 or 053-fixed P2s.
- Existence checks instead of reading excluded playbooks/dist.
- Splitting D5 (advisor/HF/IPC) from leftover writers and leftover directories.
- Reading doctor-update execute actions, not only step names (`context-index` → trigger-index generator).
<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- Workspace-wide `rg` under `system-spec-kit` dies on leftover `mcp-server/node_modules`.
- `git check-ignore` on paths beyond symlinks is noisy; `git ls-files` emptiness is the better leftover-dir proof.
- Cannot re-run template validators or a fresh npm install inside this write surface (onnxruntime-common remains UNKNOWN).
<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
- Grepping all of system-spec-kit without excluding leftover mcp-server/node_modules.
- Treating every remaining `memory` string as a miss.
- Treating 053 PASS or 052 DONE WHEN as current-tree proof.
- Re-running validate.sh / generate-context.js from this lineage.
<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- Live memory MCP / spec-memory plugin / zvec lane still serving operators.
- Dropping advisor SDK or HF `runtime/database` directory as D8 residue.
- Eleven hook registrations dropped again after 273767431d.
- `/doctor memory` and `/memory:save`+`/memory:search` as dangling retired commands.
- T004–T007 still open.
- Escalating the leftover set to a hidden P0 server.
<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: seven charter angles after iteration 20
- Remaining frontier: onnxruntime-common fresh install; T011 untracked-dir sweep; sk-doc validator class defects; operator choice of follow-on packet vs extra 054 tasks
<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
- onnxruntime-common fresh-install proof (F-I15-002)
- T011 sweep coverage of untracked leftover dirs (F-I13-003)
- Missing attempt-1 stalled review report (F-I1-006)
- Owner for leftover writers: extra 054 tasks vs new packet (F-I13-002)
<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Lineage complete. Operator follow-on: absorb F-I19-003 leftovers without closing T012 as zero-debt. Do not save continuity from this process.
<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

resource-map.md not present; skipping coverage gate.

### Bounded Context Snapshot

- Source pointers:
  - `specs/system-speckit/052-memory-decommission-landing/goal.md` (D1-D11, LOG, DONE WHEN)
  - `.opencode/specs/system-speckit/053-spec-kit-runtime-rename/implementation-summary.md`
  - `.opencode/specs/system-speckit/054-decommission-debt-fixes/spec.md` and `tasks.md`
  - `.opencode/specs/system-speckit/053-spec-kit-runtime-rename/review/lineages/luna-max-pass3/review-report.md`
  - `.opencode/specs/system-speckit/053-spec-kit-runtime-rename/review/lineages/luna-max-pass3.attempt-3-conditional/review-report.md`
  - Live engine: `.opencode/skills/system-spec-kit/runtime/`, `scripts/`, `shared/`
  - Successors: trigger-index lookup, ripgrep recipes in retrieval-conventions.md, `generate-context.js`
- Reuse candidates: 052 residue-sweep definition of debt (D6), 053 dependency-resolution method, 054 recorded debt rows (T004-T008 done, T009-T012 open)
- Integration points: hook mirrors `.claude` `.codex` `.cursor` `.devin` `.pi`, doctor assets, dist-freshness, routing guard, validate.sh
- Constraints and risks: write surface is this lineage only; do not treat 053 PASS as proof the tree is clean; 054 alignment (T009) is unfinished

### Charter facts already in hand (iteration 0, not findings)

- D6 defines debt as residue-sweep live records, trigger-index nondeterminism, validate.sh errors, template validator failures, stale generated metadata, a skipped gate, or a doc or hook that describes or serves a surface that no longer exists.
- D8 moved `system-spec-kit/mcp-server` to `runtime` and dropped MCP SDK plus importer-less dependencies.
- D11 retired the zvec lane, packets 050 and 051 and the `system-plugins` home.
- 054 still has T009 (code alignment and code READMEs) and T010-T012 (verification and packet close) unchecked.
- 053 pass-3 PASS left two P2s (stale `[mcp-server/]` label, dependency arithmetic). Goal log says those were fixed at `85d9791eb3`. This lineage must re-check rather than trust the log.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 20
- Convergence threshold: 3 (telemetry only under max-iterations)
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true
- research.md ownership: workflow-owned canonical synthesis output inside this lineage
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred)
- Current generation: 1
- Started: 2026-09-05T04:12:00Z
- Session: fanout-grok-xhigh-research-1788581555646-udzw72
- Completed: 2026-09-05T06:30:00Z
