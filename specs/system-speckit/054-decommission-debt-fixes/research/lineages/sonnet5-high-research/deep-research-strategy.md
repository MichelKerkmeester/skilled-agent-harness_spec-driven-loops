# Deep Research Strategy - Session Tracking (Lineage: sonnet5-high-research)

## 1. OVERVIEW

Fan-out lineage under `054-decommission-debt-fixes`, executed inline by the
`cli-claude-code` (claude-sonnet-5, high reasoning) executor. Read-only audit;
no repository writes outside this lineage directory.

---

## 2. TOPIC

Repository-wide audit of what still needs fixing, aligning, or better
integrating with system-spec-kit, the spec-folder workflow and continuity
runtime at `.opencode/skills/system-spec-kit` (CLI at `runtime/cli`, engine at
`runtime`, shared at `shared`). Evidence-cited findings, one fix per finding,
severity-ranked.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)

- [ ] Q1: Which `.opencode/commands` write files/state without routing through Gate 3, `create.sh`, `validate.sh`, or the continuity writer?
- [ ] Q2: Which skills/agents still describe retired surfaces (memory MCP tools, `scripts/` paths, `memory/` paths, `@spec-kit/scripts`, `/memory:*`)?
- [ ] Q3: Do hook registrations across `.claude`/`.codex`/`.cursor`/`.devin`/`.pi`/`opencode.json` match the adapters in `runtime/dist/hooks`, and do CI workflows match the commands they invoke?
- [ ] Q4: Across 15+ sampled spec packets, do generated metadata/status fields/phase maps contradict the documents?
- [ ] Q5: Which helpers are duplicated across skills that spec-kit's runtime already exports via `@spec-kit/runtime/api` or CLI utilities?
- [ ] Q6: What retrieval coverage gaps exist (trigger index/ripgrep unreachable docs, exclusion-list disagreements, missing trigger phrases)?
- [ ] Q7: What validation rule gaps exist (hand-found defects no `validate.sh` rule would catch)?
- [ ] Q8: How accurate is the spec-kit README/feature-catalog against the current code?
- [ ] Q9: How do fanout-run, deep-review/deep-research leaves, and the reducer write spec packets, and where do they bypass/duplicate spec-kit's metadata generators?
- [ ] Q10: Ranked, deduplicated synthesis of all findings with owner surface, fix sketch, one-line verification command.
<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS

- No repository writes outside this lineage directory (read-only audit).
- No running `generate-context.js`, `validate.sh --recursive`, or git write/checkout/commit commands.
- No implementation of fixes -- findings + fix sketch only.
- No exhaustive line-by-line audit of every file in the repo; representative, evidence-cited sampling per angle.

---

## 5. STOP CONDITIONS

- Run to `config.maxIterations` (10); `config.stopPolicy = max-iterations` means convergence signals are telemetry only, not an early-stop trigger.
- Escalate only on: unrecoverable state corruption, or a genuine security/credential finding (none expected for a read-only structural audit).

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- [x] Q1: commands writing state without spec-kit routing -- answered iteration 1 (F1-1 improvement/ gap; F1-2/F1-3 ruled false-positive)
- [x] Q2: retired-surface references in skill/agent contracts -- answered iteration 2 (verified clean, no live remnants; memory-system.md is the citable canonical doc)
- [x] Q3: hook registration parity + CI-to-script drift -- answered iteration 3 (F3-2 mkHookDrift asymmetry on claude/cursor; CI mapping verified clean)
- [x] Q4: generated metadata vs documents across sampled packets -- answered iteration 4 (F4-1: 127/2707 packets with stale children_ids, systemic; F4-2 confirms F3-2 is explicitly deferred debt)
- [x] Q5: duplicated helpers vs spec-kit's exported API -- answered iteration 5 (F5-1 reframes premise: no cross-skill export surface exists; F5-2/F5-3 concrete duplication)
- [x] Q6: retrieval coverage gaps -- answered iteration 6 (F6-1 CRITICAL: trigger index generator off-by-one root bug drops all skill-doc + install-guide entries, masked by a symlink)
- [x] Q7: validation rule gaps -- answered iteration 7 (F7-1 maps F1-1/F4-1/F4-4/F6-1 to zero existing rule coverage; F7-2 names the ownership seam)
- [x] Q8: README/feature-catalog accuracy -- answered iteration 8 (F8-1: README claims 46-rule registry x5, actual is 37 per validator-registry.json)
- [x] Q9: deep-loop integration seams -- answered iteration 9 (F9-1: research/review activity never refreshes packet description.json/graph-metadata.json; live ~4h staleness proof)
- [x] Q10: ranked synthesis -- answered iteration 10 (11-item ranked list + 10 verified-clean/ruled-out results, written to iteration-010.md and consolidated into research.md)
<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- Grepping every command file for `Gate 3|create.sh|validate.sh|generate-context.js` to triage spec-kit-aware vs ambiguous commands before targeted reads (iteration 1)
- Cross-referencing a research angle against the packet's own spec.md "Files to Change" table to turn a generic sweep into falsifiable spot-checks (iteration 2)
<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
(populated per iteration)
<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
(populated when an approach is tried from multiple angles without new signal)
<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- `create/*.md`, `design/extract.md`, `prompt/improve.md`, `rewrite/response-by-external-agent.md`, `agent-router.md` as Gate-3-bypass risks: each routes through its own owning skill pipeline by design (iteration 1, evidence: .opencode/commands/rewrite/response-by-external-agent.md:53)
- `.codex/agents` file-count mismatch as a cross-runtime parity defect: extension difference (`.toml` vs `.md`), 12/12 parity confirmed (iteration 2, evidence: .codex/agents directory listing)
- Retired memory-MCP/scripts/@spec-kit-scripts/memory-path surfaces as a live-doc debt source: exhaustively swept, zero remnants found (iteration 2)
- `runtime/dist/hooks` missing `pi/` as a build gap: intentional tsconfig exclusion, Pi loads .ts via symlinks (iteration 3, evidence: runtime/tsconfig.json:48)
<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: Q1-Q10 above
<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
(populated per iteration)
<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
None -- config.maxIterations (10) reached. Loop complete; proceeding to phase_synthesis (research.md).
<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

### Bounded Context Snapshot

- Source pointers: `.opencode/skills/system-spec-kit/SKILL.md`, `.opencode/skills/system-spec-kit/runtime/cli/`, `.opencode/skills/system-spec-kit/shared/`, `.opencode/commands/`, `.opencode/skills/system-deep-loop/`, `specs/system-speckit/`.
- Reuse candidates: `@spec-kit/runtime/api` exports (path containment, frontmatter parsing, spec-folder detection, level scoring) that other skills may be reimplementing.
- Integration points: Gate 3 classifier, `create.sh`/`validate.sh` CLI entry points, `generate-context.js` continuity writer, trigger-index generator, hook adapters under `runtime/dist/hooks`.
- Constraints and risks: this is a read-only investigation; the target repo is large (many skills, many spec packets) so sampling must be representative and every claim must carry `file:line`.

Do not inline full source bodies. Do not dispatch the retired standalone context loop.

---

## 13. RESEARCH BOUNDARIES

- Max iterations: 10
- Convergence threshold: 3 (operator override; stopPolicy = max-iterations, so this is telemetry, not an early-stop trigger)
- Per-iteration budget: 12 tool calls, 10 minutes (soft budget; this run is inline-executed by the orchestrating session itself)
- Progressive synthesis: true
- research.md ownership: workflow-owned canonical synthesis output (this lineage writes it directly, no nested dispatch)
- Lifecycle: `new`
- Machine-owned sections: reducer role played inline by this same executor after each iteration
- Canonical pause sentinel: `.deep-research-pause` (unused; no pause requested)
- Current generation: 1
- Started: 2026-09-05T20:26:22Z
