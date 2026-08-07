# Iteration 10 — Wave 5 (generate, SYNTHESIS) — seat gpt-5 (openai/gpt-5.5-fast, variant high)

- Lens: synthesis-and-integration-risk
- Status: complete | exit=0 | duration=146s | findings=6 + 25-row ranked table | newInfoRatio=0.0 (synthesis)
- Focus: Portable vs incompatible; rank all candidate recs by value/effort with ADOPT-NOW/LATER/DO-NOT buckets + conflict matrix.
- Dispatch: cli-opencode opencode run, openai/gpt-5.5-fast --variant high (read-only); read iterations 001-008 + ponytail philosophy embedded.

## Seat output

**Core Tension**
Complementary, with strict boundaries.

Ponytail’s ladder is coherent only as a **pre-write design gate** inside `sk-code` Phase 1, after read-first + surface routing. It decides “what is the least code worth writing?” The `sk-code` Iron Law still decides “can we claim the written result works?” at Phase 3. Conflict appears only if ponytail’s “no loop / reflex” is imported literally to bypass read-first, scope-lock, or verification. Source: `iteration-001.md §Decision-Ladder Transplant F1/F5`, `sk-code/SKILL.md §Phase Overview`, `§Iron Law`.

**Ranked Recommendations**
| Rank | Recommendation | Source | Value/Effort | Bucket | Verdict |
|---:|---|---|---|---|---|
| 1 | Add a post-read, post-router “Design Restraint Ladder” at Phase 0→1 / Phase 1 entry. | iter 001 F1-F5 | High/S | ADOPT-NOW | Central transplant; preserves Iron Law. |
| 2 | Put ladder text in existing universal quality docs, not a new route/resource. | iter 001 F3-F4 | High/S | ADOPT-NOW | Avoids router-sync churn. |
| 3 | Add explicit `stdlib` / `native` replacement checks to `sk-code-review`. | iter 008 F1 | High/S | ADOPT-NOW | Cheap, concrete, low conflict. |
| 4 | Canary-lock exact `Review status:` strings across review docs. | iter 005 F1 | High/S | ADOPT-NOW | Automation-parsed invariant; low risk. |
| 5 | Adopt neutral ceiling comments, not `ponytail:` branding. | iter 004 F1, iter 001 F6 | High/S | ADOPT-NOW | Useful durable WHY; avoid brand label. |
| 6 | Treat ceiling comments as P2-only downgrade evidence for KISS/YAGNI false positives. | iter 004 F2 | Medium/S | ADOPT-NOW | Must never suppress security/correctness. |
| 7 | Add “was this new code actually asked for?” KISS/removal prompt. | iter 007 F1 | Medium/S | ADOPT-NOW | Fills fresh-addition gap without new severity/class. |
| 8 | Add `Replacement` field to removal plan. | iter 008 F3 | Medium/S | ADOPT-NOW | Makes deletion recommendations safer. |
| 9 | Add shrink check only when equally clear and behavior-preserving. | iter 008 F2 | Medium/S | ADOPT-LATER | Useful but style-churn risk. |
| 10 | Canonicalize Iron Law wording, then canary minimal invariant phrase. | iter 005 F2 | High/M | ADOPT-LATER | Valuable, but needs wording decision first. |
| 11 | Extend existing deep-improvement sweep with `code_loc` / overengineering markers behind correctness gate. | iter 006 F1-F3 | Medium/M | ADOPT-LATER | Good eval add-on; not core skill behavior. |
| 12 | Add `SK_CODE_REVIEW_DEPTH` as alias/persistence for existing ON_DEMAND review tier. | iter 003 §Q3/F4 | Medium/S | ADOPT-LATER | Only legal if floors remain immutable. |
| 13 | Add prompt-time standards injection hook. | iter 002 F2-F3 | High/M | ADOPT-LATER | Useful but runtime wiring/drift risk. |
| 14 | Add SessionStart surface priming. | iter 002 F1 | High/M | ADOPT-LATER | Good UX; not necessary for correctness. |
| 15 | Add OpenCode plugin parity. | iter 002 F4 | High/M | ADOPT-LATER | Value real, risk high due third runtime implementation. |
| 16 | Cross-runtime canaries for review-agent invariants. | iter 005 §Cross-runtime | Medium/M | ADOPT-LATER | Useful if narrowly scoped. |
| 17 | Add implementer “ship simplest specified version + scope-amendment note” bullet. | iter 007 F2 | Medium/S | ADOPT-LATER | Needs careful SCOPE-LOCK wording. |
| 18 | Avoid repo-visible active flag; use runtime cache only if persistence is accepted. | iter 002 F5 | Medium/S | DO-NOT-ADOPT as repo flag | Cache-only variant later. |
| 19 | Add `sk-code` verification lite/full/ultra slider. | iter 003 F1 | Low/M | DO-NOT-ADOPT | `lite` violates Iron Law; `ultra` duplicates conditionals. |
| 20 | Add `sk-code-review` slider that relaxes ALWAYS/security floor. | iter 003 F2 | Low/M | DO-NOT-ADOPT | Existing tiers already cover depth. |
| 21 | Create standalone PromptFoo clone. | iter 006 F1 | Low/L | DO-NOT-ADOPT | Duplicates existing sweep and lacks correctness gate. |
| 22 | Create standalone `ponytail-review` skill. | iter 008 §Merge vs Standalone | Low/M | DO-NOT-ADOPT | Violates one review baseline. |
| 23 | Add new finding class or severity for YAGNI/overengineering. | iter 007 F1 | Low/M | DO-NOT-ADOPT | Confuses fix-scope with action direction. |
| 24 | Use `net -N lines` / LOC as severity gate. | iter 008 Negative Knowledge, iter 006 F3 | Low/S | DO-NOT-ADOPT | Incentivizes under-solving. |
| 25 | Add `ceiling:` to comment-hygiene `ALLOWED_PATTERNS`. | iter 004 Recommendation | Low/S | DO-NOT-ADOPT | Could bypass forbidden IDs on same line. |

**Precedence / Conflict Flags**
| Conflict | Flag |
|---|---|
| Comment hygiene | Do not adopt literal `// ponytail:`. Neutral `ceiling:` content is okay; do not add it to allowed-pattern bypasses. Source: iter 004 F1. |
| Surface router precedence | Ladder and hooks must run after `sk-code` surface detection. They consume `OPENCODE > WEBFLOW > UNKNOWN`; they do not compete with it. Source: iter 001 F2, `sk-code/SKILL.md §Surface Detection`. |
| Iron Law | Any `lite` verification mode that lowers Phase 3 evidence is incompatible. Source: iter 003 F1. |
| READ-FIRST / SCOPE-LOCK | Ponytail’s “reflex, not research” must become “post-read reflex”; YAGNI challenge must be surfaced as scope-amendment, never silent scope cutting. Source: iter 001 F5, iter 007 F2. |
| P0/P1/P2 non-numeric gating | No LOC, `net -N`, risk score, or numeric threshold may decide blocking severity. P0/P1/P2 remains the gate. Source: iter 003, iter 007, iter 008. |
| Security/correctness floor | Ceiling comments, review depth, or YAGNI checks must not suppress security, auth, persistence, sandboxing, public contract, or correctness findings. Source: iter 004 F2, `sk-code-review/SKILL.md §Precedence Matrix`. |
| One review baseline | Merge ponytail-review ideas into `sk-code-review` rows; do not create a separate review skill, output contract, or severity doctrine. Source: iter 008 §Merge vs Standalone. |
| Hook/runtime parity | Claude/Codex hooks and OpenCode plugins are different surfaces; do not claim parity from one implementation. Source: iter 002 §Integration Risk. |
| Canary guards | Canary only stable automation/safety phrases; canonicalize drift first; do not lock volatile prose. Source: iter 005. |

**Best / Most Overrated**
Highest-value, lowest-risk overall: Phase-1 Design Restraint Ladder after read-first + surface routing, stored in existing universal quality guidance.

Most overrated: lite/full/ultra verification intensity for `sk-code`. It looks like the ponytail transplant, but it either violates the Iron Law or renames existing conditional escalation.

```json
{"seat":"gpt-5","lens":"synthesis-and-integration-risk","findings":[{"id":"F1","title":"Ponytail ladder is portable as a pre-write design gate, not as a no-verification philosophy","ponytail_source":"6-rung ladder / decide upfront","target":"sk-code:SKILL.md + references/phase_detection.md + references/universal/code_quality_standards.md","mechanism":"Run after read-first and surface+intent routing, before implementation; Phase 3 verification remains mandatory.","recommendation":"ADOPT-NOW: add a compact Design Restraint Ladder at the 0->1 / Phase 1 entry point and keep Iron Law untouched.","value":"high","effort":"S","integration_risk":"Low-medium: must not bypass READ-FIRST, SCOPE-LOCK, or Phase 3 verification.","bucket":"ADOPT-NOW","confidence":"high"},{"id":"F2","title":"Review portability is checklist rows, not a standalone ponytail-review skill","ponytail_source":"ponytail-review deletion/std-lib/native/shrink checks","target":"sk-code-review:references/code_quality_checklist.md and references/removal_plan.md","mechanism":"Merge stdlib/native/replacement/needed-ness checks into existing P0/P1/P2 review baseline.","recommendation":"ADOPT-NOW for stdlib/native and replacement rows; ADOPT-LATER for shrink checks; DO-NOT-ADOPT standalone review skill.","value":"high","effort":"S","integration_risk":"Low if severity and final-line contracts remain unchanged.","bucket":"ADOPT-NOW","confidence":"high"},{"id":"F3","title":"Ceiling comments are portable only as neutral durable-WHY comments","ponytail_source":"// ponytail: ceiling comments","target":"sk-code:comment-hygiene policy and sk-code-review:code_quality_checklist.md","mechanism":"Use shortcut+ceiling+upgrade-path as evidence of intentional simplification.","recommendation":"ADOPT-NOW with neutral ceiling/intentional-limit wording; do not whitelist it in hygiene allowed patterns; never suppress security/correctness.","value":"high","effort":"S","integration_risk":"Medium if used as a bypass or excuse for stale shortcuts.","bucket":"ADOPT-NOW","confidence":"high"},{"id":"F4","title":"Canary guards are portable for exact automation invariants","ponytail_source":"check-rule-copies.js canary phrases","target":"sk-code-review:Review status contract; sk-code:Iron Law wording after canonicalization","mechanism":"Assert stable load-bearing phrases across docs/runtime mirrors.","recommendation":"ADOPT-NOW for Review status triplet; ADOPT-LATER for Iron Law after canonical wording decision; avoid overguarding prose.","value":"high","effort":"S","integration_risk":"Low for exact parsed strings; medium for prose invariants.","bucket":"ADOPT-NOW","confidence":"high"},{"id":"F5","title":"Intensity sliders are mostly incompatible or redundant","ponytail_source":"lite/full/ultra persistent mode","target":"sk-code:Phase 3 verification; sk-code-review:resource loading levels","mechanism":"A lite mode lowers hard floors; full/ultra mostly rename existing conditional/on-demand tiers.","recommendation":"DO-NOT-ADOPT sk-code verification slider; only consider SK_CODE_REVIEW_DEPTH as an alias for existing ON_DEMAND, never as a floor relaxer.","value":"low","effort":"M","integration_risk":"High for sk-code because it creates an Iron-Law bypass.","bucket":"DO-NOT-ADOPT","confidence":"high"},{"id":"F6","title":"Benchmark idea is portable only as an optional correctness-gated metric","ponytail_source":"PromptFoo LOC/cost/latency benchmark","target":"deep-improvement:scripts/model-benchmark and sk-code:benchmark reports","mechanism":"Add code_loc and overengineering markers to existing sweep rows behind correctness eligibility.","recommendation":"ADOPT-LATER as a metric extension; DO-NOT-ADOPT standalone PromptFoo clone or LOC-based verdicts.","value":"medium","effort":"M","integration_risk":"Medium: LOC can reward under-solving unless correctness remains the gate.","bucket":"ADOPT-LATER","confidence":"high"}],"newInfoRatio":0.0,"negative_knowledge":["Do not import ponytail's no-loop stance as permission to skip sk-code verification.","Do not add a sk-code lite verification mode.","Do not create a standalone ponytail-review skill or second review doctrine.","Do not adopt literal // ponytail: comments or whitelist ceiling comments in hygiene allowed patterns.","Do not use LOC/net-lines/numeric scores as severity gates.","Do not use repo-visible session flag files by default.","Do not lock volatile prose with canaries; lock only parsed strings or safety invariants."]} 
```