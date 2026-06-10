# Memory Search Presentation Contract

Single source of truth for `/memory:search` startup questions, analysis dashboards, and result displays.

## 1. Startup Question Policy

When `$ARGUMENTS` is empty, ask one open-ended question:

```text
What would you like to retrieve or analyze?
```

Accept any natural-language answer as the retrieval query. Do not dump the full intent or subcommand menu at startup.

Ask a targeted follow-up only when genuinely ambiguous:

| Ambiguity | Targeted question |
| --- | --- |
| User asks for `history` without a folder | `Which spec folder should I show learning history for?` |
| User asks for `causal` without an id | `Which spec-doc record ID should I trace?` |
| User asks for `preflight` or `postflight` without required fields | `Which spec folder and task id should I use?` |
| User says `dashboard` or `ablation` | Route directly to analysis mode. |

If the user asks what is available, show the analysis overview in Section 5.

## 2. Retrieval Result Display

Use compact, parseable output for model dispatch. No option dumps, score bars, long previews, or hidden metadata unless trace was requested.

```text
MEMORY:SEARCH "<query>" intent=<detected_intent> results=<count>
--------------------------------------------------
<leaf-folder>/
  <score>  #<id>  <title>
  <score>  #<id>  <title>

<leaf-folder>/
  <score>  #<id>  <title>

STATUS=OK RESULTS=<count> INTENT=<detected_intent>
```

Folder display rules:
- Group by spec folder.
- Show only the leaf folder name unless two leaves collide.
- Each result line shows only score, id, and title.
- Include trace/provenance only when requested or needed to explain a degraded result.

## 3. Empty Result Fallback

```text
MEMORY:SEARCH "<query>" intent=<detected_intent> results=0
--------------------------------------------------
No spec-doc records matched this query via semantic or lexical search.

Trigger-matched spec-doc records
  <leaf-folder>/
    #<id>  <title>

Constitutional rules
  #<id>  <title>

STATUS=OK RESULTS=0 TRIGGERED=<n> CONSTITUTIONAL=<n>
```

After the block, ask at most one clarifying follow-up if the query was broad.

## 4. Forbidden Vocabulary

Never emit legacy labels that combine trigger wording with the generic noun `memory` or `memories`, and never label constitutional rows with the generic noun `memory` or `memories`.

Required labels:
- Trigger fallback rows: `Trigger-matched spec-doc records` or `Trigger-matched spec-doc record`.
- Constitutional rows: `Constitutional rules` or `Constitutional rule`.
- Generic result-class label: `Spec-doc record`.

Pre-render gate: scan the candidate output case-insensitively for legacy trigger labels and legacy constitutional-result labels, then rewrite them before emitting.

## 5. Analysis Overview

Show only when requested or when the user selected analysis tools.

```text
MEMORY:SEARCH ANALYSIS
--------------------------------------------------
Epistemic
  preflight <specFolder> <taskId>
  postflight <specFolder> <taskId>
  history <specFolder>

Causal graph
  causal <memoryId>
  link <sourceId> <targetId> <relation>
  unlink <edgeId>
  causal-stats

Evaluation
  ablation
  dashboard

STATUS=OK ACTION=overview
```

## 6. Analysis Result Displays

### Preflight

```text
MEMORY:SEARCH PREFLIGHT
--------------------------------------------------
Spec        <specFolder>
Task        <taskId>
Knowledge   <score>/100
Uncertainty <score>/100
Context     <score>/100

Gaps
- <gap>

STATUS=OK ACTION=preflight
```

### Postflight

```text
MEMORY:SEARCH POSTFLIGHT
--------------------------------------------------
Spec        <specFolder>
Task        <taskId>
Knowledge   <pre> -> <post> (delta <delta>)
Uncertainty <pre> -> <post> (delta <delta>)
Context     <pre> -> <post> (delta <delta>)
Learning    <value> (<interpretation>)

STATUS=OK ACTION=postflight LI=<value>
```

### History

```text
MEMORY:SEARCH HISTORY
--------------------------------------------------
Spec        <specFolder>
Records     <count>

<taskId>  K <pre>-><post>  U <pre>-><post>  C <pre>-><post>  LI <value>

STATUS=OK ACTION=history
```

### Causal

```text
MEMORY:SEARCH CAUSAL
--------------------------------------------------
Record      #<id> "<title>"
Depth       <maxDepth>
Direction   <direction>

Chain
- #<id> "<title>" --<relation>--> #<id2> "<title2>"

STATUS=OK ACTION=causal EDGES=<count>
```

### Link and Unlink

```text
MEMORY:SEARCH LINK
--------------------------------------------------
Source      #<sourceId>
Target      #<targetId>
Relation    <relation>

STATUS=OK ACTION=link
```

```text
MEMORY:SEARCH UNLINK
--------------------------------------------------
Removed     Edge #<edgeId>

STATUS=OK ACTION=unlink
```

### Causal Stats

```text
MEMORY:SEARCH CAUSAL-STATS
--------------------------------------------------
Total Edges <count>
Coverage    <pct>% (<linked>/<total> spec-doc records)

By relation
caused       <count>
enabled      <count>
supersedes   <count>
contradicts  <count>
derived_from <count>
supports     <count>

STATUS=OK ACTION=causal-stats COVERAGE=<pct>%
```

### Evaluation

```text
MEMORY:SEARCH ABLATION
--------------------------------------------------
Recall@<K> deltas
-vector   <delta>
-bm25     <delta>
-fts5     <delta>
-graph    <delta>
-trigger  <delta>

STATUS=OK ACTION=ablation
```

```text
MEMORY:SEARCH DASHBOARD
--------------------------------------------------
Sprint trends
<sprint>  Recall@20 <value>  MRR <value>

Channel performance
vector <value>
bm25   <value>
fts5   <value>

STATUS=OK ACTION=dashboard
```

## 7. Error Display

```text
MEMORY:SEARCH
--------------------------------------------------
FAIL        <short reason>
Recovery    <next safe action>

STATUS=FAIL ERROR="<message>"
```
