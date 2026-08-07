# Deep Review Report — phase 006 command-contract-structural (lineage p017c006-opus)

| Field | Value |
|-------|-------|
| Target | `017-search-and-output-intelligence-implementation/006-command-contract-structural` |
| Target type | spec-folder (Level 1) |
| Lineage | p017c006-opus (executor cli-claude-code / claude-opus-4-8) |
| Iterations | 1 (maxIterations=1) |
| Verdict | **CONDITIONAL** |
| hasAdvisories | true |
| Resource map present | false (coverage gate skipped) |

---

## 1. Executive Summary

**Verdict: CONDITIONAL** (active P0=0, P1=1, P2=2; `hasAdvisories=true`).

Phase 006 restructured `/memory:search` so weak instruction-followers stop dropping a populated query: a deterministic `§0` shell header computes `ARGS_PRESENT`/`QUERY`, the execute-path (§3 RETRIEVAL / §4 ANALYSIS) was moved ahead of the now-gated `§5` STARTUP section, an imperative no-ask guard binds control flow to the resolved values, and the presentation asset's `§1` was gated to match. The **structural intent is sound and consistently implemented** — the salience inversion and the `ARGS_PRESENT=false` gating are coherent across both files, and the `"$*"` join correctly fixes the word-split caveat the packet set out to address.

One P1 keeps the verdict at CONDITIONAL: the `§0` header solves only one of several expansions that occur in the same outer-shell phase. The trailing `$ARGUMENTS` is substituted **raw** into the outer shell before the protective `bash -c` runs, so glob characters, command substitution, and shell metacharacters in a query corrupt the resolved `QUERY` (contradicting the header's "deterministic ground truth" claim) and constitute a shell-injection sink. Severity is P1 rather than P0 because the input source is the operator's own typed query (self → self trust boundary). Two P2 advisories cover unpopulated spec/plan/tasks scaffolds and a pre-existing routing ambiguity.

Scope: the working tree also carries phase 007/O2 surface-parity content on these files; it was explicitly excluded from this review.

---

## 2. Planning Trigger

CONDITIONAL → routes to **`/speckit:plan`** for a small remediation packet. The single P1 (F001) is a bounded, well-localized fix on one line of one file; it does not require re-planning the phase. The two P2s are advisory and can be folded into the same remediation or deferred. No release-blocking P0.

---

## 3. Active Finding Registry

| ID | Sev | Dim | Title | Evidence | Status |
|----|-----|-----|-------|----------|--------|
| F001 | P1 | security/correctness | Unquoted `$ARGUMENTS` exposed to outer shell before `bash -c` → glob / command-substitution / metacharacter corruption + injection sink | `.opencode/commands/memory/search.md:17` (also `:13`, `:72`; `implementation-summary.md:66`) | active |
| F002 | P2 | traceability | `spec.md`/`plan.md`/`tasks.md` remain unpopulated scaffolds; continuity blocks (`completion_pct:0`, `template-author`, `scaffold/…` pointer, zeroed fingerprint) contradict the completed `implementation-summary.md` (`completion_pct:100`) | `006-…/spec.md:43-58`, `plan.md:12-27`, `tasks.md:11-26` vs `implementation-summary.md:27,46` | active |
| F003 | P2 | correctness | First-token analysis-subcommand routing can hijack legitimate retrieval queries (e.g. `history of auth decisions` → analysis mode); pre-existing semantics moved (not introduced) by O1 | `.opencode/commands/memory/search.md:91`, `:21` | active (advisory) |

### F001 detail

`bash -c '…' --` protects only expansion **inside** the wrapped script. `-- $ARGUMENTS` at the end of `search.md:17` is unquoted and substituted as raw text into the outer shell, which runs its full expansion phase first. Word-splitting (fixed by `"$*"`), pathname/glob expansion, command substitution, and metacharacter parsing all happen there:

- **Glob (correctness):** `find *.md handlers` → `*.md` expands against CWD → `QUERY` depends on filesystem state, contradicting "deterministic ground truth" (`:13`). `nullglob` unset → intermittent literal-vs-expanded corruption.
- **Command-substitution / metacharacters (security+correctness):** `$(…)`, backticks, `;`, `|`, `&`, `>` are interpreted by the outer shell; a `;` terminates the header and runs the rest as a separate statement. An injection sink, mitigated by the operator-trusted input source (→ P1, not P0).
- **Arg-echo cannot catch it:** the `:72` echo-equality rule compares against the already-corrupted `QUERY`, so the self-correction loop is blind to upstream corruption.

---

## 4. Remediation Workstreams

**Lane R1 — Harden the `§0` argument-resolution header (F001).** Close the outer-shell expansion path. Options, in order of preference:
1. Confirm whether the command renderer shell-quotes `$ARGUMENTS`; if it does, F001 downgrades to P2 documentation and only a comment is needed.
2. If raw, neutralize outer-shell expansion before the join — e.g. disable globbing for the substitution (`set -f`) and/or restructure so user text is not subject to the outer shell's expansion phase (read it via a quoted single token rather than positional `$ARGUMENTS` splitting).
3. Add an explicit note in the header documenting the residual constraint if full neutralization is infeasible within the slash-command mechanism.

**Lane R2 — Packet metadata hygiene (F002).** Populate `spec.md`/`plan.md`/`tasks.md` with the real requirements/scope (or explicitly mark them superseded by `implementation-summary.md`), and refresh the stale `_memory.continuity` blocks so completion metadata is consistent across the packet.

**Lane R3 — Routing disambiguation (F003, optional).** Decide whether to require an explicit prefix/sigil for analysis subcommands, or accept the documented ambiguity. Advisory; can be deferred.

---

## 5. Spec Seed

Minimal spec delta implied by findings (for a remediation packet under 017):

- **REQ-A (from F001):** The `/memory:search` `§0` header MUST resolve `QUERY` deterministically regardless of CWD contents or shell-active characters in the user query; glob expansion and command substitution of user input MUST NOT occur. Acceptance: queries containing `*`, `$(…)`, backticks, `;`, `|` resolve to the verbatim typed string.
- **REQ-B (from F002):** Each Level 1 packet's `spec.md`/`plan.md`/`tasks.md` MUST either carry populated content or an explicit supersession note, and continuity metadata MUST agree with `implementation-summary.md` on completion state.

---

## 6. Plan Seed

1. T1 — Determine command-renderer `$ARGUMENTS` substitution semantics (raw vs quoted). (F001 severity lock)
2. T2 — Implement the chosen R1 hardening for `search.md:17`; verify with glob/metachar/command-substitution queries. (F001)
3. T3 — Populate or supersede `spec.md`/`plan.md`/`tasks.md` and refresh continuity blocks. (F002)
4. T4 — (optional) Disambiguate first-token analysis routing or document the constraint. (F003)
5. T5 — Re-run `validate.sh <spec-folder> --strict`; if F001 fix touches behavior, re-run the documented Kimi/MiMo execute-rate follow-up.

---

## 7. Traceability Status

| Protocol | Level | Status | Gate | Evidence | Notes |
|----------|-------|--------|------|----------|-------|
| `spec_code` | core | partial | hard | `spec.md:114-128`; `search.md:17` | spec.md has no populated requirements; shipped behavior traced to `implementation-summary.md` + commit `eac1eb5ef8` instead. Drives F002. |
| `checklist_evidence` | core | N/A | hard | — | Level 1 packet; no `checklist.md` required. |
| `feature_catalog_code` | overlay | N/A | advisory | — | No catalog claim in scope. |
| `playbook_capability` | overlay | N/A | advisory | — | No playbook scenario in scope. |

Core hard gate `spec_code` is **partial** (not fail): the implementation is internally consistent with its authoritative record, but the spec document provides no requirement anchors. This is captured as F002 rather than a gate failure.

---

## 8. Deferred Items

- **F003 (P2):** first-token routing ambiguity — pre-existing; defer unless R3 is adopted.
- **Live execute-rate A/B (Kimi K2.7 / MiMo v2.5 Pro):** the packet's own documented follow-up; cannot run in a read-only review. Carry forward to remediation T5.
- **Phase 007/O2 surface-parity content** on these files: out of scope here; owned by `007-output-surface-parity`.

---

## 9. Audit Appendix

### Coverage
- Dimensions: 4/4 covered in a single converging pass (correctness, security, traceability, maintainability).
- Files: `.opencode/commands/memory/search.md`, `.opencode/commands/memory/assets/search_presentation.txt`, and the four 006 packet docs.
- Scope isolation: O1/006 deliverables separated from working-tree O2/007 content via `git show eac1eb5ef8`.

### Convergence replay
- Stop reason: maxIterations (1) reached. Single full-dimension pass; `newFindingsRatio=1.0` (all findings new on first iteration). No rolling-average/MAD votes applicable to a single iteration.
- P0 override: not triggered (no P0).
- Claim adjudication: F001 adjudicated with a typed packet (`passed=true`, confidence 0.82, finalSeverity P1); F002/F003 are P2 and require no packet.

### Methodology notes
- F001 evidence rests on shell semantics + the impl-summary's own statement that `$ARGUMENTS` "expands one word per argument" (raw substitution), which is the same mechanism that admits glob/command-substitution. A live shell demo was sandbox-blocked and is not required for the claim.
- Verdict mapping: P1 present, no P0 → CONDITIONAL.

### Iteration table
| Iter | Focus | Status | P0/P1/P2 | Ratio |
|------|-------|--------|----------|-------|
| 1 | all 4 dimensions | complete | 0/1/2 | 1.0 |
