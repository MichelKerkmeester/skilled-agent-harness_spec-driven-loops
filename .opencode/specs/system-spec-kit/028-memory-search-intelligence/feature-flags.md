# Packet 028 Feature Flags: Every New Switch In Plain Words

> Packet 028 added a lot of new search and memory behavior. Almost none of it runs on its own. Every new behavior sits behind an environment-variable switch, and every switch ships in the OFF position. With all of these switches off, the system behaves exactly the way it did before 028. This document explains each switch in everyday language: what the feature is, what turning it ON changes and what happens when it stays OFF.

---

## THE BIG IDEA

Think of 028 as a box of new parts that are all unplugged. The code for each new feature is in the tree, but it does nothing until you set its environment variable. This is on purpose. The team wanted to ship the new machinery for correctness and safety first, and only switch features on later once a real before-and-after benchmark earns the flip. So far none of them has earned it, so they all stay off.

There is a promise attached to this, called **flag-off byte-identity**. It means that when a switch is off, the output the system produces is identical, byte for byte, to the output it produced before the feature existed. A test called **flag-ceiling** locks this in. It runs the search and memory paths with every new 028 switch off and checks that nothing about the result changed. So "off" is not "mostly off". It is "the old behavior, unchanged".

**How many switches and what kind.** Packet 028 added **37** new environment variables. They split into two groups.

- **On/off feature gates (30 of them).** Each one turns a single new feature on. The default is OFF. You set it to `true` to try the feature.
- **Value and path knobs (7 of them).** These do not turn a feature on. They tune a number or point a path somewhere. They are `SPECKIT_PARSER_SKIP_LIST_MAX_RETRIES`, `SPECKIT_KNOWN_ITEM_QUERY_COUNT`, `SPECKIT_RETRIEVAL_EVAL_K`, `SPECKIT_RETRIEVAL_EVAL_OUTPUT`, `SPECKIT_ENTITY_CONFIG_PATH`, `SPECKIT_ADVISOR_OUTCOME_STORE_DIR` and `SPECKIT_WORKSPACE_ROOT`. Each one has a safe default that keeps the prior behavior, so leaving them unset changes nothing.

**Nothing 028 added ships ON.** There is no new 028 switch that is enabled by default. The closest thing to "always-on" is the value and path knobs above, and even those only matter once the feature they belong to is turned on, or they simply re-point a file location.

A note on phases. Packet 028 is split into phase folders. Phase `001-speckit-memory` is the memory and search engine. Phase `002-code-graph` is the code structure index. Phase `003-skill-advisor` is the skill recommender. Phase `004-deep-loop` is the multi-agent loop runtime. The last column of each table below tells you which phase a switch came from.

---

## 1. SEARCH FUSION AND SCORING

Search blends results from several sources into one ranked list. "Fusion" is just the step that merges those lists. "Scoring" is how each result earns its place. These switches add new ways to merge or weight results before you see them.

| env var | default | what it does (plain English) | 028 phase |
| --- | --- | --- | --- |
| `SPECKIT_SUMMARY_FUSION_LANE` | OFF (`false`) | Treats short auto-written summaries of your documents and topic clusters as a real search source that competes for a spot in the results, instead of a side note. ON adds that summary source to the blend. OFF leaves the result list exactly as before. | 001 |
| `SPECKIT_RETRIEVAL_PROFILE_WEIGHTS` | OFF (`false`) | Lets the system nudge the different search sources up or down depending on the shape of your question. For example a "find one exact thing" question can lean on plain text matching and mute the graph source. ON applies those per-question weight nudges. OFF uses the flat, equal weights from before. | 001 |
| `SPECKIT_FANOUT_NEAR_DUP_DEDUP` | OFF (`false`) | Used by the multi-agent loop when it merges findings from many agents at once. ON makes the merge also fold together findings that are near-duplicates of each other, not just exact copies. OFF only folds exact copies, as before. | 004 |

---

## 2. RETRIEVAL ROUTING

Routing is the decision about which search sources to even run for a given question. A question that wants one exact record does not need the same machinery as a broad "how does this whole area work" question. These switches let the system pick a route based on the question.

| env var | default | what it does (plain English) | 028 phase |
| --- | --- | --- | --- |
| `SPECKIT_RETRIEVAL_CLASS_ROUTING` | OFF (`false`) | Looks at the shape of your question and, for a narrow "find this one item" question, skips the graph and link-count sources because they tend to add noise there. ON turns on that skipping. OFF keeps every source in play for every question, exactly like before. | 001 |
| `SPECKIT_WORLD_SUMMARY_PRELUDE` | OFF (`false`) | Adds a quick coarse-to-fine warm-up step. Before the detailed search runs, it reads a high-level summary of the whole memory to get its bearings, then drills in. ON runs that warm-up step for context lookups. OFF skips straight to the detailed search, as before. | 001 |

---

## 3. GRAPH AND EDGES (TIME AND MEANING AWARE)

The memory keeps a graph: documents and facts are nodes, and the links between them are "edges". These switches add smarter edges. Some are **meaning aware**, which means they compare the actual meaning of two facts rather than just matching words. Some are **time aware**, which means they track when a fact was true and when it stopped being true.

| env var | default | what it does (plain English) | 028 phase |
| --- | --- | --- | --- |
| `SPECKIT_SEMANTIC_EDGE_LAYER` | OFF (`false`) | Builds a meaning-based fingerprint for each fact-to-fact link during background consolidation, so links can later be compared by meaning. ON starts writing those fingerprints. OFF writes no fingerprints and the graph is unchanged. This is the base layer the next four switches build on. | 001 |
| `SPECKIT_EDGE_VECTOR_INDEX` | OFF (`false`) | A lookup that finds the links most similar in meaning to a given link. ON enables that nearest-link side lookup. OFF leaves it absent. | 001 |
| `SPECKIT_EDGE_TRIPLET_SEARCH` | OFF (`false`) | Lets search score a "this relates to that" fact as a whole unit instead of scoring the two ends separately. ON enables that whole-relationship scoring. OFF scores results the old way. | 001 |
| `SPECKIT_EDGE_SEMANTIC_DEDUP` | OFF (`false`) | Spots two links that say the same thing in different words and proposes merging them. ON runs this as a quiet shadow check that suggests merges. OFF does no meaning-based link merging. | 001 |
| `SPECKIT_EDGE_SEMANTIC_INVALIDATION` | OFF (`false`) | Spots when a newer fact contradicts an older link and proposes retiring the stale one. ON runs this as a quiet shadow check. OFF leaves old links in place as before. | 001 |
| `SPECKIT_EDGE_PRESENCE_CURRENTNESS` | OFF (`false`) | Keeps a link's "is this still current" marker in sync with whether the link has been retired, so two parts of the system cannot disagree about whether a fact is live. The new column it needs is always added, but this reconciliation read is gated because retiring a fact is a live change. ON runs the reconciliation. OFF keeps the prior retirement behavior. | 001 |
| `SPECKIT_ENTITY_CONFIG_PATH` | unset (uses the built-in entity rules) | A path knob. Points the entity extractor at your own rules file for pulling names and things out of text at save time. Set it to a file path to override the defaults. Leave it unset to use the built-in rules, which is the prior behavior. | 001 |

---

## 4. RECALL MODES

"Recall" is the act of pulling the right memories back out. These switches add new recall strategies. They are kept off because some of them bring in an outside language model or a new ranking signal, and those must prove they are worth it on a benchmark first.

| env var | default | what it does (plain English) | 028 phase |
| --- | --- | --- | --- |
| `SPECKIT_AGENTIC_RECALL` | OFF (`false`) | Adds a "think, look, look again" loop that lets a language model steer the memory lookup instead of running one fixed query. ON allows that model-driven loop. OFF keeps the fast, predictable, fixed lookups every caller relies on today. A built-in guard refuses to run the loop while this is off, so the model path is simply unreachable. | 001 |
| `SPECKIT_BITEMPORAL_RECALL` | OFF (`false`) | Turns on recall that understands two kinds of time at once: when a fact was actually true in the world and when the system first learned it. The word for tracking both is "bitemporal". ON lets queries ask time-aware questions. OFF ignores the learned-at timeline, as before. | 001 |
| `SPECKIT_PROCEDURAL_OUTCOME_EMITTER` | OFF (`false`) | Records whether a remembered step actually worked out, by copying strong success or failure signals into a small outcomes log. ON starts writing those outcome rows. OFF writes nothing new. This feeds the next switch. | 001 |
| `SPECKIT_PROCEDURAL_RELIABILITY_RECALL` | OFF (`false`) | Uses that track record of what worked to rank reliable memories higher. ON lets the reliability signal influence recall ranking. OFF ranks without it, as before. | 001 |

---

## 5. RETENTION AND FORGETTING

Memory cannot keep everything forever. "Retention" is deciding what to keep. "Forgetting" is letting low-value items fade. This switch adds a careful new safety layer around forgetting.

| env var | default | what it does (plain English) | 028 phase |
| --- | --- | --- | --- |
| `SPECKIT_RETENTION_FORGETTING_V1` | OFF (`false`) | Adds conservative guardrails so forgetting only ever drops genuinely spare items and never drops something that other live memories still point to. ON turns on those spare-only rules and the live-link protection. OFF keeps the existing retention behavior unchanged. | 001 |

---

## 6. SLEEP-TIME CONSOLIDATION

"Sleep-time" means work the system does off to the side, between your turns, the way a brain tidies memories during sleep. "Consolidation" is reorganizing and tidying what is stored. These two switches stage that carefully: one to think, one to actually write.

| env var | default | what it does (plain English) | 028 phase |
| --- | --- | --- | --- |
| `SPECKIT_SLEEPTIME_CONSOLIDATION` | OFF (`false`) | Runs a background pass that reorganizes memory between turns. ON runs it in a safe rehearsal mode that decides what it would change without changing anything. OFF runs no background reorganization at all. | 001 |
| `SPECKIT_SLEEPTIME_LIVE_WRITE` | OFF (`false`) | The second stage. Lets that background pass actually write its changes for real, such as archiving old items. ON allows the real writes. OFF keeps it to rehearsal only. You would turn this on only after the rehearsal mode above has proven itself. | 001 |

---

## 7. CALIBRATION AND CONFIDENCE

"Calibration" is fine-tuning a score so it means what you think it means. These switches adjust how a particular ranking signal is weighted so one loud signal does not drown out the rest.

| env var | default | what it does (plain English) | 028 phase |
| --- | --- | --- | --- |
| `SPECKIT_CARDINALITY_PENALTY` | OFF (`false`) | The graph gives a small boost to documents that are well connected. A few super-connected hub documents can hog that boost just by being popular. This switch damps those hubs so connection count alone cannot let them dominate. ON applies the damping. OFF leaves the boost as it was, which can change which result lands first, so it is held until a benchmark earns it. | 001 |

---

## 8. DERIVED-ID PROVENANCE

When the system creates a link on its own rather than being told about it, it helps to give that link a stable identity so you can trace where it came from. "Provenance" just means a trustworthy record of origin. This switch adds that.

| env var | default | what it does (plain English) | 028 phase |
| --- | --- | --- | --- |
| `SPECKIT_DERIVED_ID_PROVENANCE` | OFF (`false`) | Gives every auto-generated link a stable id computed from its own content, so the same generated link always gets the same id and is traceable. ON writes those content-based ids at the time the link is made. OFF leaves generated links without that stable id, as before. | 001 |

---

## 9. SKILL ADVISOR

The Skill Advisor is the helper that recommends which skill to use for a request. These switches add new ways for it to score and rank candidate skills. They are all off by default so the recommendations you get today do not move until a feature is proven. One more advisor switch, its text-match calibration, lives in the BM25 engine section below.

| env var | default | what it does (plain English) | 028 phase |
| --- | --- | --- | --- |
| `SPECKIT_ADVISOR_RRF_FUSION` | OFF (`false`) | Blends the advisor's several scoring lanes into one ranking using reciprocal rank fusion, a simple method that merges ranked lists by position rather than by raw score. ON uses that blend. OFF uses the prior single-score ranking. | 003 |
| `SPECKIT_ADVISOR_QUERY_CLASS_ROUTING` | OFF (`false`) | Sorts your request into a rough class first, such as "implementation" or "review", and routes scoring accordingly. ON turns on that class-based routing. OFF scores every request the same way, as before. | 003 |
| `SPECKIT_ADVISOR_EXACT_SEMANTIC_RERANK` | OFF (`false`) | Re-checks the top few skill matches by meaning and gently re-sorts close calls. ON runs that small meaning-based re-sort on the top results. OFF leaves the top order untouched. | 003 |
| `SPECKIT_ADVISOR_OUTCOME_WEIGHTED_RERANK` | OFF (`false`) | Leans on how well a skill has worked before to re-sort recommendations. Until the shared reliability math is wired in it treats every skill as neutral, so even ON it does not change the order yet. ON enables the seam. OFF keeps it absent. | 003 |
| `SPECKIT_ADVISOR_SELF_RECOMMENDATION_GUARD` | OFF (`false`) | Stops the advisor from recommending itself. ON enables that guard. OFF allows the prior behavior where the advisor could appear in its own results. | 003 |
| `SPECKIT_ADVISOR_OUTCOME_STORE_DIR` | unset (uses a folder under the system temp directory) | A path knob. Sets where the advisor writes its record of which skills worked. Point it at a folder to override. Leave it unset to use the default temp-folder location. | 003 |
| `SPECKIT_WORKSPACE_ROOT` | unset (uses the current working directory) | A path knob. Tells the advisor's outcome-bookkeeping script which project folder it is working in. Set it to a path to override. Leave it unset and it uses the folder you ran from, which is the prior behavior. | 003 |

---

## 10. CODE GRAPH AND PARSER

The Code Graph reads your source files and builds a map of how the code connects. The "parser" is the part that reads each file. These switches add new map-building tricks and one parser tuning knob. They are off by default because they change how the map is built or read.

| env var | default | what it does (plain English) | 028 phase |
| --- | --- | --- | --- |
| `SPECKIT_CODE_GRAPH_SEEDED_PPR_RANKING` | OFF (`false`) | Ranks related code by how reachable it is from where you started, walking the call and import links outward. The method is personalized PageRank, a way to score nodes by how easily you can reach them from a chosen start point. ON uses that walk to rank context. OFF uses the prior simpler ranking. | 002 |
| `SPECKIT_CODE_GRAPH_REVERSE_DEP_FORCE_PARSE` | OFF (`false`) | When something changes, this also force-reads the files that depend on it, so their links are refreshed too. ON turns on that extra reverse pass. OFF only re-reads the changed files, as before. | 002 |
| `SPECKIT_CODE_GRAPH_EDGE_BITEMPORAL_READS` | OFF (`false`) | Lets reads of code links use the two-timeline data, so the graph can answer "how was this wired at that point in time". The new columns are always added, but reading from them is gated. ON reads the time-aware columns. OFF reads links the flat, current-only way. | 002 |
| `SPECKIT_CODE_GRAPH_EDGE_GOVERNANCE_VOCAB` | OFF (`false`) | Enforces a fixed, approved list of link types in the code graph database so stray or misspelled link kinds cannot creep in. ON turns on that check. OFF accepts link types as before. | 002 |
| `SPECKIT_PARSER_SKIP_LIST_MAX_RETRIES` | `5` | A value knob. A file that keeps failing to parse gets put on a skip list after this many tries. Raise it to be more patient with flaky files, lower it to give up sooner. Leave it at 5 for the default behavior. | 002 |

---

## 11. EVALUATION AND TELEMETRY

These are not product features. They are knobs for the offline test harness that measures how well search recalls the right thing. They only matter when you run that harness by hand. Their defaults keep the harness running the way it always has.

| env var | default | what it does (plain English) | 028 phase |
| --- | --- | --- | --- |
| `SPECKIT_KNOWN_ITEM_QUERY_COUNT` | `60` | A value knob. How many test questions the ground-truth generator builds when preparing a recall benchmark. Raise it for a bigger test set, lower it for a quicker run. | 001 |
| `SPECKIT_RETRIEVAL_EVAL_K` | `20` | A value knob. How many top results the recall benchmark looks at when checking whether the right answer showed up. A higher number is a more forgiving check. | 001 |
| `SPECKIT_RETRIEVAL_EVAL_OUTPUT` | `/tmp/speckit-retrieval-flag-eval.json` | A path knob. Where the recall benchmark writes its results file. Point it somewhere else to keep a run, or leave it on the default temp path. | 001 |

---

## 12. BM25 ENGINE

BM25 is a classic, well-understood way to rank text by word overlap. It is the plain "do the words match" scorer that sits under the smarter stuff. Packet 028 did **not** add a new core BM25 engine switch. The engine selector that picks which BM25 backend to use already existed before 028. The one BM25-related switch 028 added is a calibration knob inside the Skill Advisor's text-match lane.

| env var | default | what it does (plain English) | 028 phase |
| --- | --- | --- | --- |
| `SPECKIT_ADVISOR_BM25_QUERY_LENGTH_CALIBRATION` | OFF (`false`) | Fixes a fairness problem where longer requests pile up a higher raw text-match score just for being longer. ON adjusts the scoring so short and long requests are judged on a comparable scale. OFF uses one fixed scale for all lengths, which is the prior behavior. This switch is telemetry-only, meaning even ON it is set up to observe rather than change live recommendations. | 003 |

---

## HOW TO TURN ONE ON

Every switch is read from the environment. To turn on an on/off feature, set its variable to `true` and restart so the server picks it up. For example:

```bash
export SPECKIT_BITEMPORAL_RECALL=true
# then restart the MCP server, or start a fresh session
```

The accepted "on" values are `true`, `1`, `yes`, `on` and `enabled`. Anything else, including leaving the variable unset, counts as off. For the value and path knobs, set the variable to the number or path you want instead of `true`. A few features are staged in pairs, so read the description before flipping the live-write half. For example `SPECKIT_SLEEPTIME_LIVE_WRITE` should only go on after `SPECKIT_SLEEPTIME_CONSOLIDATION` has run safely in rehearsal mode first.

---

## WHY THE OFF STATE IS SAFE

The whole point of this design is that doing nothing is safe. With every 028 switch left at its default, the system runs exactly as it did before any of these features existed. Two kinds of tests prove this rather than assume it.

- **The flag-ceiling test.** It exercises the search and memory paths with all new 028 switches off and confirms the results did not move. This is the guarantee that "off" means "the old behavior".
- **The flag-off byte-identity tests.** For the riskier features, there are checks that the output with the flag off is identical down to the byte to the output from before the feature was added. No silent drift, no rounding, no reordering.

That is why these features could land in the codebase without changing anyone's results. The new behavior is present but dormant. It waits for a deliberate switch and, for the ranking-changing ones, for a real benchmark to show the change is an improvement before it ever runs by default.
