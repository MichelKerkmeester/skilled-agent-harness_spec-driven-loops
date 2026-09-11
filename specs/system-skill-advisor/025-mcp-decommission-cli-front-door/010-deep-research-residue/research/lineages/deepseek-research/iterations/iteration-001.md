# Iteration 1: The latent-failure class — a path that only runs after another has already failed

## Focus

Characterise the failure class the parent directive names — "a code path that only runs after another has already failed" — and test each packet defect claim in that class against the code as it exists at HEAD rather than against the prose log. Deliverable: a class definition with causal properties, a membership list with `file:line` evidence, and the promotion-time consequence.

## Findings

### 1. The class has three properties, and the third is what makes it invisible

A fallback-only path is not merely under-tested. Three properties must hold together, and the packet's own evidence shows each one separately:

| Property | Statement | Evidence in this packet |
|---|---|---|
| **Order-gated execution** | The path's only trigger is a prior failure, so its normal-case execution count is zero. | The hook's CLI helper "was only reached after the Python path failed" and "always reported `socket_absent`" — 004 finding F16, `../../../../004-caller-rewire/goal.md:82` |
| **Unverified preconditions** | Because it seldom runs, its own assumptions are never validated against the module that owns the value. | The helper assumed a flat socket path while the owner derives a scoped one — contrast `hooks/lib/skill-advisor-cli-fallback.ts:79,197` with `.opencode/bin/lib/launcher-ipc-bridge.cjs:151-153` |
| **Masked failure** | When it fails, the enclosing operation has already degraded, so the degraded result is attributed to the primary's failure, not to the fallback's own defect. | "Because it only ran after the Python path failed, it always reported `socket_absent` and nobody noticed" — `004-caller-rewire/goal.md:82` |

The third property is the operative one. The other two are preconditions for it: order-gating keeps the execution count at zero, unverified preconditions guarantee a latent defect, and masked failure is what prevents discovery once the path does run. Attribution is the mechanism: the observer already has an explanation for the degradation, and it is the correct one — the primary really did fail — so nothing invites a second look at the fallback.

The corollary is a reporting rule. A fallback must emit a **reason code that distinguishes its own failure from the failure it was answering**, and the code must be observable at the call site. In this packet the helper did exactly that and it still bought nothing: `socket_absent` is a normalized reason in the retryable set (`hooks/lib/skill-advisor-cli-fallback.ts:86-91`), so the caller treated it as an expected transient and continued. A distinguishable reason is necessary but not sufficient; the reason must be *surprising* to some assertion, or it is just a better-labelled silence.

### 2. Membership: the mechanism in each member, verified at HEAD

**M1 — The socket path was wrong by construction, not by typo.** The helper sets the socket *directory* to the default (`hooks/lib/skill-advisor-cli-fallback.ts:79` `DEFAULT_SOCKET_DIR = '/tmp/system-skill-advisor'`, applied at `:197`) and, in its defective form, computed the socket *path* from that directory directly. The owner scopes precisely that directory: `shouldScopeIpcSocket` returns true when the resolved socket dir equals the default (`launcher-ipc-bridge.cjs:103-109`), and the scoped directory is `sha256(canonicalDbDir).slice(0, 12)` (`:151-153`). So the default directory is the *one* directory whose socket is always one level deeper. Verified live on this machine:

```
/tmp/system-skill-advisor/12c06db97a8e
/tmp/system-skill-advisor/697296aed00e/daemon-ipc.sock
/tmp/system-skill-advisor/f5986893208c/daemon-ipc.sock
```

The flat `/tmp/system-skill-advisor/daemon-ipc.sock` does not exist. The generalisation: the defect was not a wrong literal, it was **two owners computing one derived path**. A copy fix (change the literal) would have been wrong within a month; the durable fix is that the helper passes the directory (`:197`) and lets `getIpcSocketPath` (`launcher-ipc-bridge.cjs:162-168`) derive the path — one owner, no second derivation.

**M2 — The fallback's time budget was below the latency of the call it made.** `DEFAULT_CLI_FALLBACK_TIMEOUT_MS = 250` (`hooks/lib/skill-advisor-cli-fallback.ts:76`) against a measured warm CLI latency of about 440 ms (004 finding F17, `004-caller-rewire/goal.md:83`), so a reachable daemon would still have timed out. The fix changed the *derivation*, not the number: `resolveSkillAdvisorCliFallbackTimeoutMs` now returns the caller's hook budget when one exists, with the reason stated in the source — "clamping it to the fallback default would kill a warm CLI call inside its measured latency" (`hooks/lib/skill-advisor-cli-fallback.ts:145-158`). The generalisable rule: **a fallback's timeout must be derived from the measured latency of the path it calls, not from a "cheap, it's only a fallback" default.** A constant chosen when the path did nothing expensive becomes wrong when the path is promoted to doing the real work.

**M3 — A flag that was correct for the fallback and wrong for the primary.** `--warm-only` is right for a path that must never pay daemon start and wrong for a primary that must return a recommendation; 004 recorded the tension as an open question (F18, `004-caller-rewire/goal.md:84`). The resolution is visible at HEAD as an explicit inverse flag with the reasoning in the comment: "Without this flag the child env's prompt-time marker makes the CLI default to warm-only, which refuses with exit 75 and never starts anything — leaving every cold session with no brief at all" (`hooks/lib/skill-advisor-cli-fallback.ts:242-246`). This is the class at its purest: an argument that was *correct*, and becomes a defect, while the text of the argument never changes.

**M4 — The fallback was proven correct without being timed, on a path where latency was the point.** An unreachable daemon returned the degraded payload in 30317/30366/30332 ms because the CLI waited its whole 30 s tool timeout before falling back; the scorer itself takes about 213 ms (`004-caller-rewire/goal.md:80`). Correctness evidence and latency evidence are different evidence; for a fallback on a prompt path, an untimed proof of correctness is not evidence of the property the path exists for.

**M5 — The fix that removed the work and looked like a fix.** Removing the daemon spawn instead of bounding the wait left every cold session on the local scorer with one recommendation instead of three and no Advisor line at all; "The 209ms that looked like success was the signature of the defect: fast because it had stopped doing the work" (`004-caller-rewire/goal.md:78`). The corrected form states the converse invariant in the source: "A degraded answer is still an answer" (`hooks/lib/skill-advisor-cli-fallback.ts:307-309`). Generalisation: **on a degraded path, a speed-up is presumptively a defect until the work it stopped is accounted for.**

**M6 — The sibling class: a field consumed by one path and translated by another.** The CLI payload carried `ambiguous: true`; the mapper never mentioned the word, so the renderer printed the single-skill line instead of the near-tie — caught only by rebuilding both versions in one worktree and diffing (`004-caller-rewire/goal.md:77`). This is the same failure shape one layer over: the property existed in the producer, was dropped at the seam, and only a *cross-path comparison* — not a unit test of either side — could see it.

### 3. Provenance shows the packet did not introduce the defect; it changed its exposure

The helper file was added by `0d19afb4e86 feat(028): skill-advisor runtime integration`, before this packet's first commit `1d900a17bf`. The packet then touched it three times: `e8d564ca98` (moved the prompt hook onto the CLI, and the bad fast-fail fix F21 shipped here), `7920288acb` (bound the cold-start wait), `3feab865ea` (package rename). So 025 is not the author of the flat-path defect; 025 is what changed the path's execution count from zero to one.

That is the load-bearing generalisation for promotion: **promotion does not create the defect, it converts a defect of exposure zero into a defect of exposure one.** The audit therefore belongs to the promotion commit, and its scope is fixed: for every value the fallback reads, find the module that owns it and check the fallback's assumption against the owner's rule.

### 4. Live instance of the same class at HEAD, unreported by the packet

The second spelling of the advisor DB-directory override is unreachable at five sites because a rename rewrote the *second operand of an alias chain into a duplicate of the first*:

| Site | Line |
|---|---|
| `.opencode/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts` | `:182` |
| `.opencode/bin/lib/launcher-ipc-bridge.cjs` | `:95` |
| `.opencode/bin/system-skill-advisor-launcher.cjs` | `:358` (and the allowlist at `:131,133`) |
| `.opencode/plugins/system-skill-advisor.js` | `:355-356` |
| `.opencode/commands/doctor/scripts/skill-graph-freshness.cjs` | `:47` |

Each reads `process.env.SYSTEM_SKILL_ADVISOR_DB_DIR ?? process.env.SYSTEM_SKILL_ADVISOR_DB_DIR`. The intended second name is `MK_SKILL_ADVISOR_DB_DIR`, which is still deleted by the test that exists to prove the override works — `.opencode/plugins/tests/system-skill-advisor.test.cjs:193-194` — so the alias is expected by at least one caller and honored by none. Introduced by `19e1ffedaf0 refactor(hooks): rename mk- hook library to self-describing names` (2026-08-21), an ancestor of the packet's base commit.

Attribution, stated honestly: this is **pre-existing, not produced by this packet**. It matters here for two reasons. First, it is a live specimen of the residue class "name that outlives its referent" in its *negative* form — the referent was removed from the code while a consumer still names it, and nothing fails because the default applies. Second, phase 007's env sweep did not find it, and the reason is instructive: 007 checked "the env example and the live advisor env surface carry no flag that served only the removed transport" (`007-docs-and-residue-sweep/goal.md:17`), a question about *transport* flags, so a duplicated *database-path* alias is outside the sweep's question even though it is inside its file set.

## Sources Consulted

- `../../../../004-caller-rewire/goal.md:77-85` — findings F13-F21 (F16 flat socket, F17 clamp, F18 warm-only, F19 ambiguity, F20 thirty-second fallback, F21 the removed spawn)
- `../../../../005-mcp-transport-removal/goal.md:19-24` — deletion blockers and the socket-as-request-handler blocker
- `.opencode/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:76,79,86-91,145-158,182,194-200,209-252,307-309`
- `.opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:287` (hook budget passed as `timeoutMs`)
- `.opencode/bin/lib/launcher-ipc-bridge.cjs:95,103-109,123-127,139-168`
- `.opencode/bin/skill-advisor.cjs:21-29,44-51,87-93` (shim; `mcpServerDir` identifier retained)
- `.opencode/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:36,1245-1291,1305-1340` (cold-start bound, fallback-aware wait)
- `.opencode/skills/system-skill-advisor/README.md` (package root, post-rename layout)
- `git log -S` / `git log --diff-filter=A` on branch `worktrees/049-advisor-mcp-decommission`: `0d19afb4e86`, `19e1ffedaf0`, `e8d564ca98`, `7920288acb`, `3feab865ea`
- Live filesystem: `/tmp/system-skill-advisor/` scope directories and their `daemon-ipc.sock` entries

## Assessment

- **newInfoRatio: 0.90**
- **Novelty justification:** The class was named in the research prompt, but the three-property structure, the membership list re-verified against HEAD rather than the log, the provenance result that 025 activated rather than authored the defect, and the five-site alias duplication defect are all new to this packet's record — and the duplication is not in any packet artifact.
- **Confidence:** High for the class definition and for M1, M2, M6 and the duplication (each verified in code or on the live filesystem). Medium for the counterfactual weight of M3 and M5, which rest on the phase log's own account of an intermediate commit rather than on a reproduction I ran.
- **Evidence gap:** I did not execute the helper or the CLI to reproduce the flat-path probe; the finding rests on the two rules (helper's directory constant, bridge's scoping predicate) plus the live socket layout. That is a structural proof, not an observed run, and is labelled as such.

## Reflection

- **Worked:** Reading the *owner* of a value rather than the copy that consumed it. The bridge's `shouldScopeIpcSocket` predicate made the flat-path defect a certainty rather than a suspicion, because the default directory is exactly the directory that is always scoped.
- **Worked:** Using `git log -S` to date a defect instead of accepting the phase log's narrative. The helper's origin commit reframed the whole question from "what did this packet break" to "what did this packet expose".
- **Failed / ruled out:** Explaining F16 as a mistyped or stale literal. Ruled out by the predicate: the literal was the correct unserialised form of the default socket directory, and any fix that corrected the string alone would have re-broken at the next derivation change. The mechanism is duplicated derivation, and the durable fix is single ownership.
- **Failed / ruled out:** Treating "the fallback ran and returned a reason code" as sufficient observability. Ruled out by `socket_absent` sitting inside `RETRYABLE_REASONS`: a reason code the caller already expects is not a signal.
- **Method note:** The packet's own goal log is trustworthy for *what happened* and unreliable for *what exists now* — F16-F21 are written in the present tense about defects that are fixed at HEAD. Every claim in this iteration was re-checked against code.

## Recommended Next Focus

Iteration 2: the detection surface. Take each property in section 1 and each member in section 2 and ask what check, run at promotion time, would have failed. The material to grade against already exists in this packet: the three-daemon-state brief proof (cold/warm/unreachable) from 004, the 22-case parity harness from 003 that "proved the CLI binary, not this helper", the byte-identical brief diff that caught F19, and the before-image baseline. Deliverable: for each candidate check, the artifact it reads, the failure it would have produced, and its cost — separating checks that can run in CI from checks that require a human to state an invariant.
