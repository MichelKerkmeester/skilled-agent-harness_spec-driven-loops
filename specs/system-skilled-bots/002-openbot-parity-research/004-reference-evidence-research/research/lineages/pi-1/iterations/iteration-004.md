# Iteration 4: memory identity, compaction and the pinned prompt

## Focus

005-memory and 004-computer-exposure. The strategy's Next Focus is the terminal sentinel again, so the lowest-coverage rule applies. 005 is the phase with the most reference material left unread (turnstone's typed memory model and OpenGhost's bounded memory were cited by the parity synthesis but never read line by line), and 004 is read beside it because both phases write into the same prompt region and the same run record.

## Actions Taken

1. Read the plan side: `005-memory/spec.md` REQ-001 to REQ-012 (entry line form, bounds, forget-by-index, prompt block, memory-proposal items, secret scan, permissions) and `004-computer-exposure/spec.md` REQ-001 to REQ-008 (working-place line, branch evidence, status row, resume pinning).
2. Read turnstone's `docs/memory.md` sections on types, scopes, the identity tuple, the immutable index and the `save` parameter table, then listed its memory test corpus and read the head of `tests/data/memory_description_parity.json`.
3. Read `OpenGhost/memory.js` (limits, tidy prompt, cross-window reload) and skimmed OpenBot's `computer-token.ts` for the 004 comparison. Licences: turnstone Apache-2.0, OpenGhost MIT, OpenBot MIT.

## Findings

1. **005-memory.** turnstone gives every memory a stable identity — "A memory's identity is the tuple `(name, scope, scope_id)`", with saving on the same identity an upsert that preserves the id — and a required, authored retrieval hook (`description`, 1-512 normalised characters, supplied on every write, "Content-only updates are rejected"). The plan addresses an entry by its 1-based position: `bots remember --forget <n>` removes entry `n` and "every later entry's index shifts down by one", with a rule for copying forward bytes an append added during the rewrite (REQ-005). A positional index is a footgun the reference does not have: an index an operator wrote down, or that a needs-you item quoted, names a different fact after any forget, and the plan's own copy-forward rule exists because the window between read and rewrite is already known to be racy. A one-line identity (the first eight hex of a hash of the entry) costs one field and removes the shifting rule entirely. Size S. [SOURCE: specs/system-skilled-bots/context/turnstone-main/docs/memory.md:38-55] [SOURCE: specs/system-skilled-bots/context/turnstone-main/docs/memory.md:206-215] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:152] (observed)

2. **005-memory.** OpenGhost's memory is bounded twice — a hard limit of `records: 60` and `chars: 3600` and a *crowded* mark at `records: 28` — and the crowded mark triggers a rewrite: a model "write[s] it anew, shorter", with the prompt spelling out the merge rule ("put records about the same thing together into one, drop what is said twice, and where two disagree keep only what the later one says") and a 3,000-token budget. The plan has the same two numeric bounds but only the hard one: an append past 60 entries or 3,600 bytes is refused `memory-full` with exit 4 and the file is left unchanged. The consequence is that a bot whose memory is full can never remember anything again — every later `[REMEMBER]` proposal and every `bots remember` is refused — while the reference compacts before that point and keeps remembering. The reference's conflict rule is the part that makes a compaction specifiable; without it "make it shorter" silently picks a winner. Size M if the rewrite is a model call, S if it is a deterministic merge of same-source entries. Risk medium, because a rewrite is the one memory operation that can lose a fact. [SOURCE: specs/system-skilled-bots/context/OpenGhost-main/memory.js:8-18] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:150] (observed, plan consequence inferred)

3. **005-memory (and 004's pinned prompt).** The reference keeps bodies out of the index on purpose — the `<memory-index>` captures `scope`, `type`, `name` and `description` at the first admitted model turn and is stored durably, and the doc says plainly "Bodies never enter the index", with bodies read through an explicit `get` — so a run always reads live content while its index stays pinned. The plan does the opposite, and correctly for its size: the rendered memory block is injected into the prompt, bounded at 3.6 KB (REQ-006). What the plan does not state is what happens to *that block* when a run parks: 004 REQ-007 pins and re-checks the working-place line on resume and refuses a prompt that names another tree, but nothing pins or refreshes the memory block, so a fact remembered while a run waits for an answer never reaches the resumed run, and the one place a person would look for it is the prompt that ran. The fix is one sentence in 005 and one check beside 004's resume pin: rebuild the memory block on resume, or record the bytes it was built from. Size S. [SOURCE: specs/system-skilled-bots/context/turnstone-main/docs/memory.md:99-109] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:153] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/spec.md:149] (observed, gap inferred)

4. **012-manual-testing-scenarios (a test corpus, not a requirement).** turnstone's memory work ships a test corpus worth copying by shape rather than by content: six files (`test_structured_memory.py` at 597 lines, `test_memory_index.py`, `test_memory_relevance.py`, `test_project_memory_scope.py`, `test_structured_memory_storage.py`, `test_memory_api.py`) and one data fixture, `tests/data/memory_description_parity.json`, whose first key is `whitespace_code_points` with a list of 33 code points. The parity fixture is the pattern: rather than asserting one normalisation case, it enumerates every whitespace code point the language has, so the implementation cannot pass by covering the common ones. That is directly applicable to 005's whitespace-collapse rule and to 012's scenario design, and it is not in the plan's testing chapter. Size S. [SOURCE: specs/system-skilled-bots/context/turnstone-main/tests/data/memory_description_parity.json:1-8] [SOURCE: specs/system-skilled-bots/context/turnstone-main/tests/test_structured_memory.py:1-1] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:148] (observed)

5. **004-computer-exposure, confirmation with evidence.** Nothing in the references goes as far down this path as the plan already does, and the two nearest artifacts are container plumbing the plan has declined: OpenBot derives a per-bot computer token as `HMAC-SHA256(COMPUTER_TOKEN, label)`, which exists to authenticate a bot into a loopback-only container, and 004 rules out that container. The plan's working-place line — the directory, the branch and the run folder, with a prefix constant so a resumed run finds it by exact text and refuses a prompt naming another tree — has no liftable counterpart in any of the ten repos, and its five git answers (branch, detached HEAD, non-zero status, null status, empty stdout) are more specific than anything the references state. Recorded so a later iteration does not re-open 004 looking for a missing reference: the reference evidence here is *negative evidence*, and it supports the plan. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/shared/computer-token.ts:1] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/spec.md:143-155] (observed)

## Ruled Out

- **Lifting turnstone's body-free index into 005.** It solves a problem the plan does not have: the index exists because turnstone's memory is unbounded and bodies cannot be injected, while the plan's bound is 3.6 KB, which is cheaper to inject whole than to index and then fetch. The plan's choice is the one the evidence supports; only the pinned-block consequence (finding 3) needs closing.
- **Reading OpenGhost's cross-window reload path (`store.onChange`, `SAVE_DELAY = 400`).** It exists because two Electron windows share one memory; the runtime has one process per run and no second window, so it is dead code for this build.
- **Re-opening 004's container question.** OpenBot's `computer-start.ts` and `computer-token.ts` are the container's own bootstrap and token derivation; 004 declines the container, so their evidence lands on a refused capability. The parity synthesis's eliminated-alternatives row already records that refusal.

## Dead Ends

- `find … | xargs grep -ln "class StructuredMemory"` returned no file, yet `grep -ln` over the same tree had already named `turnstone/core/memory.py` and `turnstone/core/memory_index.py`. The `xargs` form silently dropped the paths, so the class body was never read; the doc plus the module names were enough, and no claim rests on the class body.
- Reading `OpenBot-main/docs/routines.md` around the count-reset rule to compare fatigue semantics produced nothing new: 002 REQ-006 already cites the exact line.

## Edge Cases

- **Contradictory evidence:** none. Findings 1 and 2 are divergences where the reference is ahead; finding 3 is a consequence the plan does not state; finding 5 is negative evidence in the plan's favour.
- **Ambiguous input:** "what a builder should lift or mirror, with the licence of the source" is read as *behaviour worth adopting*, not *code worth copying*. Finding 1's identity change is a behaviour, and no line of turnstone's Apache-2.0 code is proposed for copying.
- **Missing dependency:** none.
- **Partial success:** the `xargs` miss means the turnstone class body is unread; no finding depends on it, and the doc's normative statements carry the claims instead.

## Sources Consulted

- specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:148-164
- specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/spec.md:143-155
- specs/system-skilled-bots/context/turnstone-main/docs/memory.md:1-55,95-110,186-215
- specs/system-skilled-bots/context/turnstone-main/tests/data/memory_description_parity.json:1-8
- specs/system-skilled-bots/context/turnstone-main/tests/test_structured_memory.py:1
- specs/system-skilled-bots/context/OpenGhost-main/memory.js:1-30
- specs/system-skilled-bots/context/OpenBot-main/shared/computer-token.ts:1

## Assessment

- New information ratio: 0.85
- Questions addressed: 005-memory and 004-computer-exposure, plus a 012 test-corpus pattern
- Questions answered: none tracked; carried by findings

## Reflection

- **What worked and why:** reading the plan's numeric bounds against the reference's numeric bounds. Both name 60 and 3,600, so the comparison narrowed immediately to *what happens at the bound* — refuse or compact — which is where the two designs actually differ. Two numbers that agree are a strong signal that the plan already lifted the right shape, and they let the iteration spend its budget on the one remaining difference instead of re-deriving the shape.
- **What did not work and why:** the `xargs grep -ln` form dropped file paths that a plain `grep -ln` had found minutes earlier, which cost a call and produced an empty variable that made the next command a no-op. Separately, the positional-index footgun in REQ-005 was visible on the first read of the requirement and should have been the first finding written, not the third.
- **What I would do differently:** when two sources agree on a constant, write the agreement down as confirmation and pivot immediately to the state machine around the constant; and never pipe `find` into `xargs grep` to locate a class — grep the tree directly.

## Recommended Next Focus

001-activity-and-actor and 009-skills: read OpenBot's `app/src/lib/bot-lifecycle/activity-groups.ts` and `shared/activity-rows.ts` against 001's group ids and the status index, then `OpenGhost/skills.js` and the `tinyagents-hooks` seam against 009's `skills:` list and its proposal flow. After that 010-conversations (openhuman's in-process chat surface and turnstone's `cli.py` loop), then 003's residual interaction surface and 012/013/014.
