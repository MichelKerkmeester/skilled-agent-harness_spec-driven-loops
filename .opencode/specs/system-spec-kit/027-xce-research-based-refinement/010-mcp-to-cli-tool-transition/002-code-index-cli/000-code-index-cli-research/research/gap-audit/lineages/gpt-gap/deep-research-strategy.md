# Deep Research Strategy - GPT Gap Lineage

## 1. OVERVIEW

### Purpose

Run the forced five-lens gap audit for the code-index CLI workstream before implementation starts.

---

## 2. TOPIC

Adversarial completeness audit of the 002-code-index-cli workstream packet set. Packet docs are the audit subject; repository source is the evidence base.

---

## 3. KEY QUESTIONS (remaining)

- [x] LENS-1: Coverage cross-check (parity matrix vs phase ownership)
- [x] LENS-2: Delta/REQ traceability both directions
- [x] LENS-3: Runtime pairing completeness vs actual adapter/plugin inventory
- [x] LENS-4: Sequencing/estimates plus cross-workstream shared-infra risks
- [x] LENS-5: Adversarial residual sweep

---

## 4. NON-GOALS

- Do not relitigate the GO verdict for daemon-backed CLI.
- Do not report MCP removal, reference migration, Gemini hook work, or planned-state checklist absence as gaps.
- Do not modify packet docs outside this lineage artifact directory.

---

## 5. STOP CONDITIONS

- Complete all five audit lenses, or stop at maxIterations=5.
- Final output must contain either COMPLETE or a numbered gap register.

---

## 6. ANSWERED QUESTIONS

- LENS-1 answered in iteration 1.
- LENS-2 answered in iteration 2.
- LENS-3 answered in iteration 3.
- LENS-4 answered in iteration 4.
- LENS-5 answered in iteration 5.

---

<!-- MACHINE-OWNED: START -->
## 7. WHAT WORKED

- Phase-by-phase reconciliation against the parent phase map identified clean ownership for D1-D10 while exposing one phase-3 inventory weakness.
- Direct source inspection of hook adapters and plugin bridge code separated real import drift from already-owned implementation scope.
- Runtime config comparison caught note-level DB location drift across Codex vs the current launcher/server source.
- Failure-mode audit found a prompt-time dual-failure acceptance gap that is not covered by the warm-only wording alone.

---

## 8. WHAT FAILED

- Searching broad runtime references produced noisy historical hits; targeted line reads of current configs and phase docs were more reliable.
- Treating omission as proof of Gemini exclusion was too weak until paired with the program rule and Gemini hook README.

---

## 9. EXHAUSTED APPROACHES (do not retry)

### MCP removal gap -- BLOCKED (iteration 1, 1 attempt)
- What was tried: Checked workstream and program scopes for MCP retirement requirements.
- Why blocked: The dual-stack window explicitly keeps MCP registered.
- Do NOT retry: Do not report MCP removal as a code-index implementation gap.

### Gemini hook requirement -- BLOCKED (iteration 3, 1 attempt)
- What was tried: Compared repo Gemini hook presence against the program-wide pairing rule.
- Why blocked: The live pairing rule names Claude Code, Codex, and Devin; Gemini adapters are retained outside repo-level registration.
- Do NOT retry: Do not require Gemini code-index hook work in this packet unless the operator changes scope.

---

## 10. RULED OUT DIRECTIONS

- MCP removal as a gap: out of scope for dual-stack. Evidence: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/010-mcp-to-cli-tool-transition/002-code-index-cli/spec.md:80.
- Zod reuse as a gap: code-index uses hand-coded validateToolArgs plus dispatcher required-field checks. Evidence: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/010-mcp-to-cli-tool-transition/002-code-index-cli/000-code-index-cli-research/research/research.md:26.
- Literal socket directory collision: runtime configs use distinct /tmp service directories for memory, skill-advisor, and code-index. Evidence: file:.codex/config.toml:67; file:.codex/config.toml:92; file:.codex/config.toml:109.

---

## 11. NEXT FOCUS

Done. Synthesis complete. Verdict: GAP_REGISTER_REQUIRED with 0 P0, 2 P1, 3 P2.

<!-- MACHINE-OWNED: END -->

---

## 12. KNOWN CONTEXT

- Research authority says GO for daemon-backed dual-stack CLI, 8/8 tools portable, D1-D10, 6-9d.
- Parent program rule requires runtime pairing for Claude Code, Codex, Devin, plus OpenCode plugin fallback.
- Code graph was unavailable in this session, so structural queries used rg/find plus direct file reads.
- The requested cli-codex executor could not be nested inside Codex due to the cli-codex self-invocation guard; this lineage ran directly in the current Codex session.

---

## 13. RESEARCH BOUNDARIES

- Max iterations: 5
- Convergence threshold: 0
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true
- Artifact root: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/027-xce-research-based-refinement/010-mcp-to-cli-tool-transition/002-code-index-cli/000-code-index-cli-research/research/gap-audit/lineages/gpt-gap`
- Writes outside artifact root: none
