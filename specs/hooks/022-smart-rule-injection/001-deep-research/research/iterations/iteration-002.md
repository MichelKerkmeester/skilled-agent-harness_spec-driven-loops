{"timestamp":"2026-09-12T12:44:23.115Z","runtime":"claude","status":"ok","freshness":"live","durationMs":1072,"cacheHit":false,"skillLabel":"sk-code"}
All evidence gathered. Compiling the iteration findings.

---

## 1. INVENTORY — read-only bindings: iteration 1's list holds; the answer it missed is that this is by design

**Test of iteration 1 (all confirmed by direct read, no corrections):** `evidence-and-proof.md:34-38` (reporting/close-out fires while reading), `skill-hub-routing.md:38-39` (reporting a routing claim, quoting a gate result), `delegation-and-orchestration.md:41` (answering a judgment question from own reading), `root-cause-and-debugging.md:34-37` (diagnosis is largely read-only investigation). The list is real.

**What iteration 1 missed — the framework already carries these read-only bindings in the always-loaded layer.** `AGENTS.md:239`: *"These four bind unconditionally, including on a read-only turn where Gate 5 never fires and no rule file loads."* That sentence is the designed answer to this question. Each read-only-binding rule has a resident clause in AGENTS.md that binds without Gate 5:

| Rule | Resident carrier |
|---|---|
| evidence-and-proof | `AGENTS.md:239` four standards; "Finding = hypothesis" row |
| skill-hub-routing | `AGENTS.md:114` — *"Never report a mode as routed because a registry entry exists — check both stages, against the hub you actually changed"* (verbatim core of `skill-hub-routing.md:43`) |
| communication | `AGENTS.md:404` — "fires on every substantive reply… Load it before answering" |
| presenting-decisions | `AGENTS.md:406`; `:500` close-out |
| uncertainty-and-honesty | `AGENTS.md:482` "Never fabricate"; `:209` truth over agreement |
| root-cause | `AGENTS.md:191-192` reproduce/producer/seam |
| delegation | `AGENTS.md:239` finding-is-hypothesis row; `:209` |
| blast-radius (push) | `AGENTS.md:332` fresh-yes policy; `:334` pre-push hook named as backstop |

The rule files are the deep expansion; the resident layer is the read-only carrier. Anything not resident is also not read-only-bound: the two genuine non-resident read-only items are `skill-hub-routing.md:83-86` (checker mechanics — binds during hub *maintenance*) and `root-cause-and-debugging.md:109-117` (weakening a check — a *write* act).

**Corollary found this iteration:** every enforcing gate in the system fires at a mutation point — pre-commit (`.opencode/scripts/git-hooks/pre-commit:40-84`), pre-push (`pre-push:96-118,133-186,205-228,230-266`), spec-gate deny (`injection-contract.md:148-154`), dispatch guards (`:156-167`). No gate can fire on a reply. The two precise-silence prompt injections are both gate announcements: spec-gate fires only when the classifier flags a probable mutation (`AGENTS.md:66`, `injection-contract.md:82` "once per session until answered"); sk-vision fires only when a named path resolves to a file (`injection-contract.md:100`).

## 2. CANDIDATES

**A. Push-permission directive** (blast-radius `:63,93-96`; gate `pre-push:133-186`).
- **Trigger (observable):** prompt text requests a push/publish; or pre-turn git state (unpushed commits on a non-allowlisted branch).
- **Silence condition:** branch on the allowlist (`pre-push:23`); no unpushed commits; kill-switches.
- **Cost when wrong:** fires on every status/question turn in a workspace holding unpushed commits; carries ~2 lines telling the model something the operator's own words already said.
- **Bar side — retired.** The observable signal and the failure case are *disjoint*: the case that fails is the model pushing unprompted mid-turn, which has no prompt-time signature; when the user asks to push, that instruction self-authorizes (`AGENTS.md:332` — "an explicit user push instruction counts as that go-ahead"). The only deliverable version is a constant line, i.e. the retired every-turn shape. The gate's block message is already a complete instruction (`pre-push:175-183`).

**B. Routing-claim guard** (skill-hub-routing `:43`; resident `AGENTS.md:114`).
- **Trigger (observable):** routing vocabulary in the prompt ("is X routed/wired/registered"); better than A — it can land on the failure turn (claim composed after a prompt-time injection).
- **Silence condition:** no routing vocabulary; already delivered this session (directive lifecycle, `injection-contract.md:64`); advisor kill-switch.
- **Cost when wrong:** fires on the high-frequency "which skill for X" class where no claim is being made about wiring.
- **Bar side — retired.** Two independent failures: (1) its content is resident verbatim at `AGENTS.md:114`, so a directive restates the system prompt; (2) no gate enforces claim discipline — the rule's own text says so: `skill-hub-routing.md:75` *"A green gate is not integration. The per-hub gate covers some surfaces and asserts only presence, never reachability."* The manifest gates (`pre-push:230-266`, `:205-228`) police the wire, not the sentence, and the commit-time route gate self-heals (`pre-commit:213-228` auto re-mints and stages) — so there is no block cycle for a directive to pre-empt. This is "proof-over-appearance" applied to routing: a claim-justification discipline, resident, ungated. Retired side.

**C. Check-weakening prohibition** (root-cause `:109-117`).
- **Trigger (observable):** failing check in play; fix vocabulary in prompt. Not resident (`AGENTS.md:191-192` carries reproduce/seam, not weakening).
- **Silence condition:** no failure in the session.
- **Cost when wrong:** noise on every debugging turn.
- **Bar side — fails the gate leg.** Nothing detects a loosened assertion or skipped test (the mass-deletion ceiling catches only bulk, default 100 tracked files, `pre-push:96-118`); and it needs no earlier delivery — weakening a check *is* a write, so Gate 5 fires first (`AGENTS.md:122`). **Leave at Gate 5.**

## 3. SURFACE — the contract can carry a directive without a new mechanism; the surface is not the blocker

`POLICY_BLOCK_REGISTRY` (`system-skill-advisor/runtime/lib/policy-plan.ts:214-256`) is an ordered registry of directive blocks with per-block content providers, and it already carries both a constant and a conditional: hygiene at order 1 (`:220-224`), the Gate-3 question at order 4 pulling its text live from `spec-gate-core` (`:203-212,225-229`), and the OpenCode compiled-route block that returns `undefined` unless targets exist (`:248-255`). Delivery: full on first proven message + after lifecycle boundaries, suppressed within cadence otherwise (`injection-contract.md:64`); kill-switches concern-level (`hooks/README.md:40-45`); fail-open; the hygiene directive survives even degraded briefs (`render.ts:443-446`), with its stated rationale being the missing-carrier problem verbatim — "so all hook-capable runtimes receive the comment hygiene rule even when AGENTS.md is absent from session context" (`render.ts:99-101`).

Three surface facts constrain any candidate: (a) **no per-directive kill switch** — silencing one entry means killing the advisor concern (`hooks/README.md:40`), since the flags index has no per-ID entries; (b) **Cursor is dark** — a live probe confirmed Cursor does not deliver `beforeSubmitPrompt` and the prompt-time hooks registered there are dormant (`injection-contract.md:103`), so a new prompt directive silently does not exist on one of six runtimes; (c) **there is no relevance engine** — providers see context, but the only prompt-time predicates are prompt text, session state, and file resolution; the directive lifecycle's transcript access is byte-offset dedup, not semantic reading (`directive-lifecycle-contract.ts:21-26` stores `transcriptHighWaterBytes`, no content interpretation).

## 4. PORTABILITY — pointer-form survives; content- or command-form does not

- **Discovery key:** resolve workspace root install-anchored (precedent: `skill-advisor-hook.md:36` "install-anchored walk, not CWD-relative"), then check for `REPO RULES.md` — the same key Gate 5 uses (`AGENTS.md:122`). Absent → silent. Portable across all three repos by construction.
- **Inject only the pointer.** `repo-rules/<file>.md` is a corpus-internal convention owned by `REPO RULES.md` itself (`REPO RULES.md:40-50`), stable wherever the corpus is symlinked. Inlining rule *content*, or a checker command living inside a hub, breaks "hub names are stable; paths inside hubs are not" — `skill-hub-routing.md:86` deliberately says "The commands are in the reference above" rather than naming them, and the hygiene directive itself hardcodes no path. Any candidate must do the same.
- **Consequence:** portability is satisfiable only for a pointer-form, predicate-gated directive — and none of §2's candidates has a predicate that isolates a failure case cheaply (§2A: disjoint; §2B: redundant; §2C: no gate). Portability is not what kills them; the bar is.

## 5. VERDICT — REFUSE the injection; the corpus stays at Gate 5, and the read-only bindings stay in the resident layer

The intersection {obligation not resident in AGENTS.md} × {mechanically gated} × {prompt-time-observable trigger} is **empty** for all 11 rules, and it is empty for a structural reason: gates only fire at mutation points, so a surviving directive is by definition a gate announcement — and read-only obligations have no gate to announce. The framework already states this: `AGENTS.md:239` carries the four read-only standards explicitly for the turn "where Gate 5 never fires and no rule file loads," and `:114`, `:332`, `:404`, `:482` carry the other read-only cores. The single classifier-gated injection (Gate 3) confirms rather than contradicts the pattern: it exists to unblock a *write* ("this turn looks like it will mutate a file," `injection-contract.md:74`), with answer-once silence (`:82`).

Per candidate: **A — refuse** (signal and failure case are disjoint; only the retired constant form remains). **B — refuse** (resident verbatim; its subject matter is the one space its own text proves is ungated). **C — leave at Gate 5** (write-bound anyway; no gate leg). If a read-only failure is ever observed empirically, the lever is the resident layer — `AGENTS.md` — not a hook, because that is the layer that binds when nothing else loads. Any future candidate must name, in order: its content-provider predicate, its suppressing state, and its gate — the three things that separate a mechanism from a restated disposition (`injection-contract.md:54`).
