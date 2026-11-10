# Deep Research Strategy - devin-swe-2-max lineage

Fan-out lineage packet. Executor: cli-devin model=swe-2-max. Session: fanout-devin-swe-2-max-1791406414802-qayl99.
Lead brief: `steer.md` in this directory is read before init and before every iteration and is listed among each iteration's sources.

## 2. TOPIC

Analyze every change branch 091-consolidate-small-packets made to the spec folder tooling and the spec corpus (the commits in `git log origin/main..HEAD` plus the uncommitted corpus-wide repair of phase 013), then answer: how do we harden it, and how do we automate healing and fixing of specs in old formats, including pre-v4 repos, so external users on older versions are not burdened? Answer five questions with file:line evidence.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)

- [ ] Which one-off repair fixes should become permanent idempotent tooling, and where should each live?
- [ ] What causes each validation failure class at the source, and how do we stop new instances?
- [ ] How should an older or pre-v4 repo be detected and migrated or healed safely, and how does that fit /doctor:update?
- [ ] What should be hardened in this branch's own changes: the CI rebuild job, the cleanup tools, the seeder, the Gate 3 wording and the token push?
- [ ] Which checks belong in CI or pre-commit so drift is caught early and cheaply?
<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS

- Not implementing any fix; findings and recommendations only.
- Not modifying anything outside this lineage directory; the spec corpus, `.skilled/` tooling and `.github/` workflows are read-only evidence.
- Not auditing the Claude 5.5 roster commits (`75c78afa045`, `e9935e99bbc`) beyond noting they are low relevance.
- Not proposing migrations that change what a document says or that invent history (steer.md Q3 constraints).

## 5. STOP CONDITIONS

- `config.maxIterations` = 15 under `stopPolicy: max-iterations`; convergence is telemetry only, never an early stop.
- Terminal synthesis record must carry `stopReason: "maxIterationsReached"`.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS

[None yet -- populated as iterations answer questions]
<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED

[Populated per iteration from delta and narrative evidence]
<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED

[Populated per iteration]
<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)

[None yet]
<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS

[Consolidated from iteration dead-end data]
<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER

- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded
<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS

[Populated after iteration 1]
<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS

Iteration 1: inventory the branch commits (`git log --stat origin/main..HEAD`) and the phase 013 uncommitted corpus repair; begin the failure-class taxonomy from the scratchpad detail reports.
<!-- /ANCHOR:next-focus -->

---
<!-- MACHINE-OWNED: END -->

## 12. KNOWN CONTEXT

- Spec folder: `specs/system-speckit/034-spec-folder-tooling/014-spec-auto-healing-research`.
- Lead brief and write limits: `steer.md` in this lineage directory.
- Branch evidence: commits `4b33313bd4c`, `4af470d1531`, `bdd678bccff`, `01b0773d067`, `5e4164bfac9`, `7fe1cbeda87`, `b36842de3c1`, `d727cf94fe1` (plus low-relevance `75c78afa045`, `e9935e99bbc`); phase packets `006` through `013` under `specs/system-speckit/034-spec-folder-tooling/`.
- In-progress corpus repair: `specs/system-speckit/034-spec-folder-tooling/013-corpus-wide-validation-repair/spec.md` (uncommitted, ~4,371 packets).
- One-off scripts and rule-by-rule failure reports (read-only): `/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/bd2aa56c-623b-43f8-a2ef-69a13c32d626/scratchpad/`.
- Fresh scaffold sample (byte copies of this packet's docs as `create.sh` produced them): `specs/system-speckit/034-spec-folder-tooling/014-spec-auto-healing-research/research/scaffold-sample/*.txt`.
- Tooling under analysis: `.skilled/skills/system-spec-kit/runtime/cli/spec/`, validator registry and `references/validation/`, `templates/`, `.skilled/commands/doctor/`, `.github/workflows/`.
- `resource-map.md` not present in the spec folder at init; coverage gate skipped.

## 13. RESEARCH BOUNDARIES

- Max iterations: 15
- Convergence threshold: 0.05 (telemetry only under stopPolicy max-iterations)
- Per-iteration budget: 24 tool calls, 30 minutes
- Progressive synthesis: true
- research.md ownership: workflow-owned canonical synthesis output at the lineage root
- Write surface: this lineage directory only; no writes to `specs/` outside it, `.skilled/`, `.github/`, repo root, or the scratchpad
- Banned commands: the spec-kit write scripts named in steer.md section 1, `npm`/`npx`/`vitest`/test commands, and every git write command
- No em dash character in any file this lineage writes
- Current generation: 1
- Started: 2026-10-07T21:07:28Z
