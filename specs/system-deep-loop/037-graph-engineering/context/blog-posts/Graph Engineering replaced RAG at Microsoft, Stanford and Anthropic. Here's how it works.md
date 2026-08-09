Source: https://x.com/Sprytixl/status/2078778799064584535?s=12

Graph Engineering replaced RAG at Microsoft, Stanford and Anthropic. Here's how it works.
Right now anyone can build an AI system that answers complex questions with 18% better accuracy and 85% lower costs than regular RAG. No PhD. No million dollar budget. No team of researchers.

The only thing standing between you and that result is one concept that Microsoft, Stanford and Anthropic all independently discovered - and which most developers still haven't caught up with.

Regular RAG finds text. Graph Engineering finds relationships. Here's the full system behind it.

Bookmark This and follow - I'm Sprytix, a developer who builds AI systems and automation pipelines that turn technology into real income. DMs open.
Why regular RAG hits a ceiling

Regular RAG works like this:

text
Question
↓
Search documents for matching text
↓
Return most relevant chunks
↓
Model generates answer from chunks
This works well for simple questions. It breaks completely for complex ones.

Ask "why did our product sales drop in March?" and RAG finds documents with the words "sales" and "March." It finds fragments. It does not find the chain of causation.

text
RAG answer:
Here are 5 documents mentioning sales in March.

Graph Engineering answer:
Sales dropped because of a release delay
caused by a supplier dependency
triggered by a warehouse problem
which generated negative reviews
which reduced conversion by 23%.
Same model. Same data. Completely different result - because one system searches text and the other searches reality.

This is what Microsoft, Stanford and Anthropic all independently discovered. And it's why all three of them moved to Graph Engineering.

Document 1 - Microsoft GraphRAG

github.com/microsoft/graphrag 
github.com/microsoft/graphrag/blob/main/docs/index/architecture.md

Microsoft built GraphRAG and open-sourced it. The results from their research are the most concrete numbers available on what Graph Engineering actually delivers versus regular RAG.

The architecture converts unstructured text into a full knowledge graph:

text
Load Documents
↓
Chunk Documents
↓
Extract Entities and Relations
↓
Build Graph
↓
Detect Communities
↓
Generate Community Reports
↓
Embed Entities and Reports
↓
Local Search / Global Search
The key insight Microsoft documented: regular RAG answers local questions well - find me information about this specific entity. It fails on global questions - what are the main themes across this entire dataset, what patterns connect these 10,000 documents.

Graph Engineering answers both.

text
Local Search   |  what happened with supplier X in March
               |  finds specific node and its connections

Global Search  |  what are the main risk patterns across
               |  all our supplier relationships
               |  finds patterns across entire graph
Practical results from Microsoft's GraphRAG research:

text
Accuracy improvement    |  18% higher than raw document approach
Token cost reduction    |  85% lower than loading structured files directly
Cost per task           |  approximately $0.004 in tested configuration
arxiv.org/abs/2603.22528

These numbers come from the ChatP&ID paper - GraphRAG applied to industrial engineering diagrams. The same principles apply across domains.

Document 2 - Stanford DSPy and the graph connection

github.com/stanfordnlp/dspy 
arxiv.org/abs/2310.03714
Stanford's DSPy paper established that the model is a node in a graph - not the center of the universe. This is the theoretical foundation that connects directly to Graph Engineering.

DSPy treats the AI pipeline as a graph of modules:

text
Question
↓
Retriever      - finds relevant information
↓
Reasoning      - processes and connects
↓
Verifier       - checks the result
↓
Answer
The connection to Graph Engineering is direct: DSPy optimizes the pipeline graph, GraphRAG optimizes the knowledge graph. Both treat the model as one component in a larger structure rather than the entire solution.

Stanford's STORM paper goes further:

github.com/stanford-oval/storm 
arxiv.org/abs/2402.14207
STORM builds knowledge from scratch through a structured graph of research steps before writing a single word. Research, source collection, outline, writing, verification, revision - each step informed by the relationships discovered in the previous one.

The shared insight across all Stanford research: complex tasks need a system of connected steps, not a single model call. The graph is the system.

Document 3 - Stanford scaling laws for knowledge graphs

arxiv.org/abs/2505.16276
This paper compared 26 open-source models on knowledge graph engineering tasks. The conclusion is one of the most important in the field:

text
Larger model + bad graph   |  worse results
Smaller model + good graph |  better results
The right graph beats the bigger model. Every time.

This is the same conclusion Microsoft reached with GraphRAG and Anthropic reached with Claude Code - the system around the model determines the output more than the model itself. Graph Engineering is the most concrete implementation of that principle.

Document 4 - MIT Press research on relational memory

direct.mit.edu/tacl/article/doi/10.1162/tacl_a_00476

Published in Transactions of the Association for Computational Linguistics.

The research shows what happens when you connect a language model to relational memory - a knowledge graph of relationships rather than just text chunks.

text
Text Context
↓
Retrieve Relevant Relations from Graph
↓
Relational Memory
↓
Language Model
↓
More coherent, more accurate generation
The key finding: models with access to explicit relationship structures produce more coherent text and make fewer logical errors than models working from text alone.

This is the scientific explanation for why Graph Engineering works. The model doesn't have to infer relationships from text. The relationships are explicit in the graph. The model uses them directly.

Document 5 - KEPLER

direct.mit.edu/tacl/article-abstract/doi/10.1162/tacl_a_00360/98089 
github.com/THU-KEG/KEPLER
KEPLER combines language model training with knowledge graph embeddings. Instead of treating language understanding and factual knowledge as separate problems - KEPLER optimizes both simultaneously.

text
Language Model
+
Knowledge Embeddings
+
Knowledge Graph
=
Model that understands both language and facts
The practical implication: a model that has access to a properly structured knowledge graph doesn't have to guess at relationships between entities. It looks them up. The accuracy difference on factual questions is significant.

Document 6 - Anthropic and Claude in the graph

www.anthropic.com/customers/graph 
github.com/anthropics/anthropic-cookbook 
github.com/modelcontextprotocol
Anthropic doesn't have a product called "Graph Engineering." What they have is three layers where Claude integrates directly into graph architecture.

Layer 1 - Claude extracts the graph from text

text
Documents
↓
Claude extracts entities and relationships
↓
JSON triples:
{
  "subject": "Anthropic",
  "relation": "created",
  "object": "Claude"
}
↓
Knowledge Graph
Claude handles entity extraction, relation extraction, deduplication, normalization and ontology drafting. The tasks that used to require specialized NLP pipelines now run through one API call.

Layer 2 - Claude queries the graph

text
User Question
↓
Claude
↓
Cypher / SPARQL query
↓
Knowledge Graph
↓
Result
↓
Claude explanation in plain language
Claude translates natural language into graph queries, runs them against Neo4j or any graph database and explains the results. No query language knowledge required from the user.

Layer 3 - MCP connects Claude to the graph

github.com/modelcontextprotocol

text
Claude
↓
MCP Protocol
↓
Graph Database
↓
Entities + Relationships
↓
Claude with full graph context
MCP is the transport layer that gives Claude permanent access to any knowledge graph without rebuilding the connection for every session.

The LaunchNotes case - real production numbers

www.anthropic.com/customers/graph


LaunchNotes built a product called Graph that connects GitHub, Jira and Linear. Claude analyzes the relationships between engineering work across all three systems.

text
GitHub commits
+
Jira tickets
+
Linear tasks
↓
Graph of Engineering Work
↓
Claude
↓
Incident Detection + Project Insights
Results from the Anthropic case study:

text
Incident detection     |  up to 5x faster
Meeting time           |  approximately 50% reduction
Release notes          |  generated automatically in seconds
These numbers come from connecting structured relationship data - not just searching documents.

What a knowledge graph actually is

Before building one - the fundamental concept.

A knowledge graph stores information as triples:

text
Subject → Relation → Object
Examples:

text
Anthropic → created → Claude
Claude → supports → MCP
MCP → connects → external tools
Microsoft → built → GraphRAG
GraphRAG → reduces token cost by → 85%
Every piece of information is an explicit relationship between two entities. Not a paragraph of text that might contain this information - an explicit, structured, queryable fact.

text
Regular database:
Table of companies
Table of products
No explicit relationships between them

Knowledge graph:
Company → created → Product
Product → competes with → Other Product
Other Product → owned by → Other Company
Company → invested in → Other Company
The graph doesn't just store facts. It stores how facts connect to each other. That's what makes complex reasoning possible.

The full Graph Engineering pipeline

text
Step 1  |  Collect raw documents
        |  PDFs, emails, reports, database exports

Step 2  |  Extract entities
        |  people, companies, products, events, concepts

Step 3  |  Extract relationships
        |  who did what to whom, when, why, how

Step 4  |  Build schema
        |  define entity types and relationship types

Step 5  |  Deduplicate and normalize
        |  "Microsoft Corp" and "MSFT" are the same entity

Step 6  |  Store in graph database
        |  Neo4j, Amazon Neptune, PostgreSQL with graph extension

Step 7  |  Build retrieval layer
        |  local search for specific entities
        |  global search for patterns across entire graph

Step 8  |  Connect model
        |  Claude queries graph via MCP or direct API

Step 9  |  Update continuously
        |  new documents expand the graph
        |  contradictions get flagged for review
The LLM-assisted Knowledge Graph Engineering paper at arxiv.org/abs/2307.06917 benchmarks how well language models handle each of these steps. The honest finding: LLMs are excellent assistants for extraction and normalization but zero-shot graph generation is not yet reliable enough for production without human review on the schema and deduplication steps.

The five prompts that run the entire pipeline

Graph Engineering doesn't eliminate prompts. It uses them at each specific stage of the graph pipeline.

Prompt 1 - Extraction

text
Extract all organizations, people, products and events.

For each entity return:
- canonical_name
- type
- description
- source

For each relationship return:
- source_entity
- relation_type
- target_entity
- evidence
- confidence_score
Prompt 2 - Normalization

text
Compare the following entities.
Determine whether they refer to:
- the same entity
- related but different entities
- unrelated entities

Return canonical name and explanation.
Do not merge entities without clear evidence.
Prompt 3 - Graph query

text
Translate the user question into a Cypher query.
Use only relationships present in the schema.
Do not invent labels or properties.
Return the query and a short explanation of the logic.
Prompt 4 - Grounded answer

text
Answer using only the retrieved graph paths.
For every conclusion:
- identify the supporting nodes
- identify the relationship path
- state uncertainty clearly
- do not infer causation from correlation
Prompt 5 - Graph maintenance

text
Compare new facts with the existing graph.
Classify each fact as:
- new
- duplicate
- contradiction
- update
- uncertain

Do not overwrite existing facts without evidence.
As Microsoft's GraphRAG documentation shows - prompts handle extraction, relationship identification, summarization and community report generation internally. Prompt engineering is the mechanism inside graph engineering, not its competitor.

Five businesses you can build on a knowledge graph

1 - Due diligence platform

text
Corporate reports + founders + investors
+ legal cases + subsidiaries + transactions
↓
Knowledge Graph
↓
Claude
↓
Risk analysis + hidden connections + conflict of interest detection
Clients: investment funds, law firms, banks, M&A consultants. Monthly retainer $2,000-10,000 per client.

2 - Sales intelligence

text
Contacts + companies + roles
+ previous emails + company problems + product
↓
Knowledge Graph
↓
Who influences the decision
Which objections repeat
Which case study to show this specific client
Where the deal is blocked
3 - Engineering intelligence

text
GitHub commits + Jira tickets + Linear tasks
↓
Graph of Engineering Work
↓
5x faster incident detection
50% less meeting time
Automatic release notes
LaunchNotes already sells this. The market is every engineering team that uses more than one project management tool.

4 - Research intelligence

text
Papers + authors + institutions
+ methods + datasets + results + contradictions
↓
Knowledge Graph
↓
Which GraphRAG methods use community detection
On which datasets they were tested
Which papers contradict each other
5 - Personal knowledge OS

text
Obsidian notes + emails + calendar
+ PDFs + contacts + tasks
↓
Personal Knowledge Graph
↓
Who did I discuss this idea with
Which tasks depend on one person's response
Which decisions contradict previous agreements
What did I promise to do this month
The shift that connects Microsoft, Stanford and Anthropic

text
Prompt Engineering   |  how to ask the right question
RAG                  |  which document to find
Graph Engineering    |  which entities exist
                     |  how they connect
                     |  which path leads to the answer
                     |  what changes if one node changes
LLM knows words. Knowledge graph knows relationships. The most powerful AI systems appear when both work together.

Microsoft proved this in production with GraphRAG - 18% better accuracy, 85% lower costs. Stanford proved it in research with DSPy, STORM and the scaling laws paper. Anthropic proved it in the LaunchNotes case - 5x faster incident detection, 50% less meeting time.

Three organizations. Three independent paths. One conclusion.

The model finds text. The graph finds reality. Build the graph.

Most developers will keep improving their prompts and wonder why complex questions still give bad answers. A few will spend one weekend building their first knowledge graph and never go back to searching documents. 

/ If this was useful - follow, the next one drops here first.