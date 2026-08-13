# Review Report — pre-cutover validation gate over the whole deep-loop skill

**This is a pre-cutover validation run, not this phase's gate execution.** See
`../PRE-014-VALIDATION-RUN.md` for why that distinction matters.

## 1. WHAT RAN

Forty review iterations over the whole `system-deep-loop` skill, scoped by a frozen
1,985-path manifest. Each iteration dispatched one fresh read-only external leaf; the
orchestrator owned every state write. Executors rotated 60/40 across two GPT-5.6 tunes
(24 xhigh, 16 high), all on the fast tier.

| Property | Value |
|---|---|
| Iterations | 40 / 40, forced depth (convergence telemetry only) |
| Conformance | 40 state records, 40 route-proofs, 40 delta records, 0 thin artifacts |
| Dimensions | correctness, security, traceability, maintainability — all covered |
| Findings | 166 open (36 P0 · 104 P1 · 26 P2), 0 duplicates |
| Independently confirmed | 13 of 13 checked against real code — no fabrications |

Findings by dimension: correctness 62, maintainability 39, traceability 38, security 27.
Concentration by module: `runtime/lib` 64, `runtime/scripts` 27, `deep-improvement/scripts`
10, `deep-alignment/scripts` 10 — matching the inventory pass's own risk ranking.

**All 166 findings, each with its evidence and recommended action, are enumerated in
`findings-register.md`** — grouped by severity then module, with confirmed findings marked
and the cutover blockers cross-tagged. This report carries the verdict and the reasoning;
the register is the remediation worklist. Both render from the findings registry, which
stays the source of truth.

## 2. VERDICT

**The authority cutover is blocked.** Not on judgement — on four mechanisms, each
confirmed against code with file and line evidence.

### Blocker 1 — shadow parity cannot detect the divergence it exists to detect

Council parity hand-derives its projection by scanning event stems and **discards the real
reducer fold**: the ledger path calls the reducer only to validate, then returns the
scanner's output instead. Alignment derives *both* comparison sides from one
`foldProjection`, where the only path-dependent field is a resume digest. Both harnesses
therefore compare a thing to a near-copy of itself.

Shadow parity is the named precondition proving the dark path matches legacy behaviour
before authority moves. For these two modes, a passing harness is not that proof.

### Blocker 2 — the compatibility bridge blocks ordinary live events

The research upcaster recognises three mapped event names plus seven pinned ones;
everything else resolves to a blocked `unknown-legacy-record`. Live workflows emit
`graph_convergence`, `config_warning`, and `lock_released`, none of which are mapped or
pinned. A real legacy state log is therefore unmigratable — the first ordinary lifecycle
record blocks it. Sibling findings report the same class in review, alignment, council, and
skill-benchmark.

Consequence: resume-from-legacy-state does not work at cutover, which is the specific
failure the compatibility wave was built to prevent.

### Blocker 3 — the authorized append enforces no fencing

The append-only ledger contains no fencing, lease, token, or high-water-mark logic at all.
`appendAuthorized` validates the decision, prior head, expiry, and authority epoch, but
never a fencing token; fencing lives only in a separate optional writer wrapper. A
superseded writer holding an unexpired proof can append directly.

Inert while the ledger is dark. A corruption vector the moment it is authoritative under
multiple writers.

### Blocker 4 — completion evidence does not reconcile with reality

Migration checklists carry checked P0/P1 items whose cited test counts match neither their
own cited implementation summaries nor the current suites. Verified case: one shadow-parity
checklist repeats a count across five items while the summary it cites reports a different
number and the suite defines a third. Corroborated by a mode's script suite being red
before any change this session, which makes every "green tests" claim in that area stale.

**This session landed the column in question and reconciled its parent to Complete, so this
is a defect in our own completion claim.**

## 3. HOW TO READ 166 FINDINGS

Three calibration classes, without which the count misleads:

**Severity inflation.** Leaves assign P0 whenever false certification or arbitrary
execution is *possible*. In every confirmed case the actor is the operator or a stale local
file, not a remote attacker — for example, unescaped shell interpolation in the fan-out
wrappers breaks a dispatch on ordinary punctuation rather than enabling remote execution.
**Read P0 as cutover-readiness and robustness risk, not breach risk.**

**Evidence drift.** Blocker 4's class. Checked items whose evidence strings cite
unreproducible numbers. Every completion claim in the migration program needs reconciling
against the current suites before cutover.

**Dark-by-design.** Findings noting the typed migration families have no production callers
describe the *intended* additive-dark state. Reclassified as expected, not defective, so the
build is not misread as accidentally unwired.

**Silent-failure semantics** also recurs across the maintainability dimension: malformed
query bounds returning success with wrong data, misspelled reducer flags silently
redirecting writes, missing files surfacing as generic script errors. Same family as the
coverage defects fixed during this run — unmeasured or invalid input presenting as fine.

## 4. WORK DONE DURING THE RUN

Alignment coverage could report complete when nothing had been measured. Five build rounds
and five adversarial verifications closed it; landed as one commit.

Closed with scenario tests: malformed corpus is a typed fault and absent corpus a distinct
pre-discovery state, neither readable as covered nor sealable; checked identifiers are
intersected with the canonical corpus; every configured lane must appear in a non-empty
corpus, with duplicate and orphan identities rejected by both readers through one shared
normalizer; configured lane elements are validated; an integrity fault outranks every other
outcome including the iteration cap under forced depth; completion requires a sealed
registry through every path including a resumed session; only successful iterations
contribute coverage or stability; count-only reports stay truthful but earn no completeness
credit. Suite grew 18 → 48 tests, 11 → 41 passing, with five pre-existing command-contract
failures unchanged and the whole-runtime type-check clean.

Each verification round found real defects the preceding green gate had missed — including
one regression introduced by the fix itself. That pattern is the durable lesson: a passing
gate authored alongside the change is not independent evidence.

## 5. KNOWN LIMITATIONS OF THIS RUN

Recorded rather than quietly carried:

- **Alignment coverage is self-attested.** Corpus membership is enforced; audit execution
  and dispatched-slice membership are not. A leaf claiming canonical paths receives credit
  without demonstrating work — the same fabrication mode observed live this session when a
  fan-out lineage emitted formally valid iteration artifacts it had not earned. Closing this
  needs design work: bind claims to per-artifact evidence and restrict credit to the
  dispatched slice.
- **Lane identity is not injective** across scope types or comma-containing values, so
  legitimate distinct lanes can now collide into a duplicate fault.
- **Count-only progress still advances the partition cursor**, which can strand a loop
  without affecting convergence.
- **The scope manifest is imperfect and was deliberately frozen** mid-run: it includes two
  ignored untracked paths and omits the tracked curated benchmark reports that hold the
  declared frozen baseline. Re-scoping partway would have made early and late iterations
  audit different corpora.
- **Recursive strict validation of the parent is red for unrelated reasons** — it validates
  every numbered child, including phases added after the original program whose checklists
  use a different item form.
- **The review target moved during the run.** A concurrent session was editing executor
  configuration and fan-out code under review.

## 6. RECOMMENDED SEQUENCE

1. Reconcile the migration program's completion claims against current suites (Blocker 4),
   including the column this session landed.
2. Rebuild shadow parity for council and alignment so both sides derive independently
   (Blocker 1) — parity evidence is worthless until then.
3. Extend the compatibility upcasters to the event vocabularies live runs emit, or prove
   no legacy state needs migrating (Blocker 2).
4. Decide fencing at the append boundary before authority moves (Blocker 3).
5. Triage the remaining P0/P1 findings using the three calibration classes above.
6. Only then re-evaluate the cutover.
