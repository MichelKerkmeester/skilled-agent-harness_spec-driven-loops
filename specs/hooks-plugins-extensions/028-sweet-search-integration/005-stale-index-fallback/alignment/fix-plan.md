# Fix plan

Target: HEAD; head: fcab2a3c33c79210f8f6e61f8adaa0d197453f06

## In scope

### spec:specs/hooks-plugins-extensions/028-sweet-search-integration

- [ ] CR-4 P1 specs/hooks-plugins-extensions/028-sweet-search-integration/005-stale-index-fallback/acceptance-criteria.md:93 The packet still reports itself unbuilt: every acceptance row is `Unmet`, `Closeable` is `No` with 'Nothing is built yet', `tasks.md` and the goal completion list are unchecked, `implementation-summar

### skill:.skilled/skills/system-spec-kit

- [ ] CR-2 P1 .skilled/skills/system-spec-kit/README.md:171 The exit contract still says exit 0 means the index resolved candidates. A zero-hit fallback hit exits 0 with `staleFallback.matches: 5` while the same query with `--no-stale-fallback` returns no scor
  fix: Exit `0` means the index resolved candidates, `1` means a clean miss and `2` means a bad invocation or an unreadable ind -> Exit `0` means the lookup resolved candidates from the index or the zero-hit fallback, `1` means neither source matched 
- [ ] CR-1 P1 .skilled/skills/system-spec-kit/SKILL.md:129 `SKILL.md` still describes Gate 1 as resolving only against the committed trigger index (line 129) and never names the zero-hit fallback, `staleFallback` or `--no-stale-fallback`; the only change in t

### unowned

- [ ] PRB-01 P1 -:- Probe P02 "Look up a trigger phrase already in the index, and scan unindexed spec documents only if the index has no scored match." expected system-spec-kit; top-1 was command-doctor-helper.
- [ ] CR-3 P2 AGENTS.md:49 Gate 1's universal contract still says the lookup reads the committed index (line 49) and answers from the committed trigger index (line 214), but the new default zero-hit fallback also reads unindexe

### root:README.md

- [ ] CR-5 P2 README.md:1194 The root README's `/speckit:search` section still says only 'trigger-index lookup with `--triggers`, ripgrep recipes otherwise' and does not mention the zero-hit fallback. The command README and prese
  fix: Two lexical lanes over spec docs and skill docs: trigger-index lookup with `--triggers`, ripgrep recipes otherwise. -> Two lexical lanes over spec docs and skill docs: trigger-index lookup with `--triggers`, including a zero-hit fallback o

## Pre-existing or outside the scope

### unowned

- [ ] BAT-02 P2 -:- S9-command-references failed (exit 1). (pre-existing (critic))

