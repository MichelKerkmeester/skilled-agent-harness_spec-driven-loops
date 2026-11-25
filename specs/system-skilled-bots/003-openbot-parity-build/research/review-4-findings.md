# Fourth review of the 003 plans (after the third fix pass)

Fresh Opus high re-review, read-only. Paths are relative to the packet folder. Build order 001 to 011, each phase passing before the next.

## P0
- R4-P0-1 006 T004 (006 tasks.md:39) expects `answer` and `inbox` with empty options lists, but 001 T020 and T021 add --json, --all, --as and --scope. Same stale baseline in 006 spec.md:80-86 and 011 spec.md:104 ("eleven verbs"). Fix: re-baseline on the 001 surface.

## P1
- R4-P1-1 002's `bots enable` answers the fatigue item through a second write path with no resume (002 T021, plan.md:66). 006 REQ-004 (spec.md:155) and 011 do not name it, so after 006 fatigue items carry grants null (breaks parent spec.md:128) and skip 006's guarded write and 011's roster check. Fix: one answerItem with a no-resume option used by bots enable, and 006 REQ-004 lists it.
- R4-P1-2 002 REQ-006 failure rule "non-null exit.class and no exit.refusal" (002 spec.md:165, plan.md:62) still counts parked runs (class operator, no refusal, .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts:277). Fix: also require exit.reason is not awaiting-decision.
- R4-P1-3 011 REQ-021 (spec.md:204) refuses any actor not on the roster and exempts only "no --as", but answerItem gets a bare name and cannot tell the two apart. With no roster, 001's explicit-actor tests (AC-004, AC-008) fail when 011 reruns the suite. Fix: pass a source argument (terminal or channel) to answerItem and state the no-roster behavior.
- R4-P1-4 003 file table (spec.md:129-141) has main.rs and no lib.rs, so cargo test --lib (AC-004, AC-013, AC-014, AC-015, T017) cannot run and tests/*.rs cannot import modules. Fix: add src/lib.rs.
- R4-P1-5 003 AC-011 and T031 pipe empty stdin to bots-ui, which cannot select an item, and crossterm reads /dev/tty (inferred). Fix: a lib test that feeds an EOF event. T030, AC-009's Esc and the handoff at spec.md:32 need a tty by design and must say so.
- R4-P1-6 006 REQ-005 and spec.md:103,199 state child reach to the state root without splitting by executor kind; .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:299-312 marks cli-codex and cli-cursor preventive. Fix: state it per executor kind.

## Map (research/research.md Divergence Map)
- R4-MAP-1 devin-1 "serialized?" should read "no" (devin-1 iteration-006.md:15 is a P1 saying no rule exists).
- R4-MAP-2 devin-1 "011 belongs: yes" has no supporting line: mark not found.
- R4-MAP-3 vibe-2 "vault-policy: no": vibe-2 never mentions it, mark not found.
- R4-MAP-4 vibe-1 self-corrections are two, at iterations 3 and 9 (vibe-1 research.md:232).
- R4-MAP-5 the "This synthesis" shared-host cell contradicts Open Questions #2: align.
- R4-MAP-6 four of the five missed vibe-2 findings are now fixed (002 REQ-006, 009 dependencies, 006 REQ-005, parent spec.md:127): mark them fixed.
