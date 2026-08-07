# Deep Research Strategy - Specs Folder Relocation Implications

## 2. TOPIC
Implications of relocating the root `.opencode/specs` folder to a top-level `specs/` directory outside `.opencode`.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
[None — all answered]
<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Performing any actual move, symlink flip, or config edit
- Choosing the final migration approach as an implementation task
- Implementing dual-root adapters or mass path rewrites

---

## 5. STOP CONDITIONS
- All five key questions evidence-backed — MET
- Legal-stop gates pass — MET at iteration 6
- Or maxIterations 10 — not needed

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- [x] Tooling hardcode vs dual-accept (iteration 1, residual 6)
- [x] Cross-runtime mirrors / Gate 3 (iteration 2)
- [x] Git symlink + gitignore (iteration 3)
- [x] Memory MCP path resolution (iteration 4)
- [x] Path-ref scale/risk (iteration 5) + ranked recommendation (iteration 6)
<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- Reading create.sh default beside dual-root validator (iteration 1)
- Contrasting hook JSON emptiness with SYNC/AGENTS path language (iteration 2)
- Separating SOURCE negation vs downstream global ignore roles (iteration 3)
- Treating Memory discovery "canonical wins if present" as the cutover hazard (iteration 4)
- Splitting runtime ~117 files from md/json volume (iteration 5)
<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- Unconstrained occurrence counts as rewrite estimates (iteration 5) — ruled out
- Assuming Claude SYNC on-disk specs symlink exists (iteration 2)
<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### Symlink-only migration — BLOCKED (iteration 1–4)
- What was tried: analyze flip-only scenarios
- Why blocked: create defaults + Memory discovery + startup-checks still assume `.opencode/specs`
- Do NOT retry: claiming symlink flip is sufficient
<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- Immediate raw relocate without Memory/create/startup changes (iteration 6)
- Mirror-first migration (iteration 2)
- Blanket sed across repo (iteration 5)
- Memory MCP already fully dual-root (iteration 4)
<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Saturated: tooling, mirrors, gitignore, memory MCP, path-ref scale
- Remaining frontier: none for this research charter (implementation is out of scope)
<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
- Implementation sequencing for dual-root cutover (out of research scope; for later plan phase)
<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
SYNTHESIS COMPLETE — no further research iterations.
<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
resource-map.md emitted at synthesis. See `resource-map.md` and `research.md`.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 10; completed: 6
- Convergence threshold: 0.05; stopPolicy: convergence
- Session: fanout-grok-1786007920763-ma04a6
- Status: complete
