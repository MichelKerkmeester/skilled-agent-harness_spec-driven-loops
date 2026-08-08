# Knowledge Graph Workflows — paste-ready

Nine blocks, one per task. Block 1 is the anchor: it hands the whole course to a model and
has it teach you. The other eight are single-purpose tools. Each is self-contained; run them
in order and each eats the last one's output.

Source course: [npubird/KnowledgeGraphCourse](https://github.com/npubird/KnowledgeGraphCourse)
Skill version (hand the whole discipline to your agent): [`graph-engineering/`](graph-engineering/)

---

## 1 · THE ANCHOR — `/kg-tutor`

```
You are teaching me Southeast University's graduate Knowledge Graph course. I want to finish able to build one, not able to describe one.

HOW YOU RUN THIS

Ask me three things, then wait for my answers:
- what I'm building, or want to build
- my level: never touched one / used a graph database / read the papers
- hours per week I actually have

Then propose a route through the modules and let me approve it. Never teach two modules in one message.

Per module: explain the idea in plain terms using MY domain as the running example — never a generic movies-and-actors graph. Name the one mistake beginners make here. Then give me a single build task and STOP. Do not continue until I show you output. When I do, critique it before moving on: tell me what breaks at 100x the volume.

THE MODULES
01 concepts — what a KG is, and when it is the wrong tool
02 representation — semantic networks, frames, description logic, embeddings
03 ontology — schema design, domains and ranges. hardest, most durable
04 extraction — routing sources by type
05 entities · 06 relations · 07 events
08 fusion — deduplication, alignment, blocking
09 embeddings — TransE family, and how link prediction is really evaluated
10 KG x LLM — GraphRAG, grounding, models building graphs

WHAT YOU MUST NOT DO
Do not teach 2016 methods as current practice. Feature-engineered NER and translation embeddings are literacy, not tooling — say so when we reach them. Do not let me skip 03 or 08; that is where real projects die. Do not accept "makes sense" as evidence I understood — make me apply it. If my project does not actually need a graph, tell me in module 01 and stop the course.

END OF EVERY SESSION
Give me one line I can paste back next time to resume: modules covered, what I built, what I got wrong, what's next.

Ask your three questions now.
```

## 2 · `/kg-scope`

```
Act as a knowledge graph architect. I want to model a domain before writing any code.

Domain: [DESCRIBE IN 2 SENTENCES]
What I want to answer with it: [3 REAL QUESTIONS]

Return:
1. 8-12 entity types, each with the 3-5 attributes that matter and a note on what uniquely identifies an instance
2. 5-8 relation types as (subject type, predicate, object type), with cardinality
3. My 3 questions rewritten as traversals over those types
4. Anything my questions need that the schema cannot answer, and what's missing

Do not write code. If a question needs aggregation rather than traversal, say so — that's a database, not a graph.
```

## 3 · `/kg-schema`

```
Act as an ontology engineer. Turn this draft schema into a real ontology.

Draft: [PASTE YOUR /kg-scope OUTPUT]

Return:
1. A class hierarchy with explicit subclass relations, no more than 3 levels deep
2. Every property with domain, range, and whether it's functional or inverse-functional
3. Turtle serialization I can load straight into Protégé
4. Every modeling decision where you chose between two defensible options, and why

Reuse schema.org or an existing vocabulary for anything generic — only mint new IRIs for what's specific to my domain. Flag anything you modeled as a class that should have been an instance.
```

## 4 · `/kg-extract`

```
Act as an extraction engineer. Design the pipeline before I build it.

Sources: [LIST THEM — e.g. 400 PDFs, a Postgres table, scraped HTML]
Target schema: [PASTE /kg-schema OUTPUT]

Return:
1. Split my sources into structured / semi-structured / unstructured, and the method for each — the first two should not need a model
2. For the unstructured set: the prompt, the output JSON schema, the chunking strategy
3. The 5 failure modes most likely for this specific data, with a detection check for each
4. A 50-document hand-check protocol: what I sample, what I record, what number tells me to stop tuning

Do not propose fine-tuning until the prompted baseline has a measured error rate.
```

## 5 · `/kg-relations`

```
Act as a relation extraction engineer.

Schema relations: [PASTE THEM]
Corpus: [DESCRIBE IT]

Return:
1. A prompt that emits only typed triples valid against my schema, each with a confidence score and a verbatim evidence span
2. A distant-supervision baseline: which existing table or list I can align to my text to generate training pairs for free, and the noise that introduces
3. Rejection rules — the triples to drop before they ever reach the graph
4. How to test the two approaches against each other on 100 sentences

Every triple carries provenance. A triple with no evidence span is a hallucination with extra steps.
```

## 6 · `/kg-events`

```
Act as an event extraction engineer. I want a graph of things that happened, not things that are.

Domain and corpus: [DESCRIBE]

Return:
1. An event type schema: trigger, arguments and their roles, time anchor
2. The extraction prompt, one record per event, with argument spans
3. The edges between events — causal, temporal, conditional — and how to distinguish "reported as causing" from "merely co-occurred"
4. How to store this so a query can walk a chain backwards from an outcome

Keep event nodes separate from entity nodes. Never collapse a cause into an attribute.
```

## 7 · `/kg-fuse`

```
Act as an entity resolution engineer. My graph has duplicates.

Entity type and volume: [e.g. 40k company records]
Available fields: [LIST THEM]

Return:
1. A blocking strategy so I'm not doing n-squared comparisons, with the expected reduction
2. The match function: which fields, which similarity measure, which weights, which threshold
3. A review band — the score range where a human decides instead of the machine
4. A merge policy: on conflict, which source wins, and what survives as an alias rather than being discarded
5. 10 hard cases from my field list where the naive approach fails

Merges must be reversible. Tell me what to log so I can undo one.
```

## 8 · `/kg-eval`

```
Act as a skeptical reviewer of my knowledge graph.

What I built: [DESCRIBE]
Numbers I'm about to claim: [PASTE THEM]

Return:
1. Precision and recall at the triple level — how to sample and estimate them with a stated confidence interval, not a vibe
2. Where my test set leaks into my training or prompt-development set
3. If I'm reporting link prediction: whether the filtered setting was used, and what a trivial baseline would score
4. The three claims a reviewer attacks first, and the experiment that defends each

Assume my numbers are inflated until the sampling method proves otherwise.
```

## 9 · `/kg-rag`

```
Act as a retrieval engineer. Wire my graph into an agent and prove it beats vector search.

Graph: [DESCRIBE]
Question types: [3 EXAMPLES]

Return:
1. The retrieval strategy per question type — entity lookup, k-hop traversal, subgraph extraction, or plain vector. Say which questions do not need the graph at all
2. How a retrieved subgraph gets serialized into context without blowing the window
3. A vector-only baseline over the same source text
4. An eval set of 30 questions written before either system runs, with an answer key and the metric that separates them

If the graph doesn't win on multi-hop questions, it isn't earning its maintenance cost.
```
