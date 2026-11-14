---
title: "RD-005: Non-Frontend Requests Stay Off the Frontend Surface"
description: "Verify that requests which borrow a frontend-sounding word but concern backend, shell, tooling or image work never route to sk-code-frontend."
version: 1.0.0.0
---

# RD-005: Non-Frontend Requests Stay Off the Frontend Surface

## 1. OVERVIEW

This scenario verifies that the sk-code hub keeps the frontend surface off requests that share a word with frontend work but carry a different task. Prompts built from words such as padding, hover, easing, transition, contrast or shadow appear in binary, language-server, shell, state-reducer and image-processing requests, and none of them is a frontend request.

The risk this scenario guards against: a bare single-word keyword once matched inside an unrelated sentence and sent binary, shell and language-server work to the frontend references.

---

## 2. SCENARIO CONTRACT

**Realistic user request**: A developer asks for backend or tooling work whose wording happens to contain a frontend-sounding word.

**Exact prompt**:
```
add left padding to the binary buffer before hashing
```

Prompt: `add left padding to the binary buffer before hashing`

**Why this is not frontend work**:
- The target is a binary buffer in a hashing path, not a rendered box model.
- The word padding describes byte alignment, not a spacing token.
- A frontend route would load layout and styling references that cannot answer the request.

**Expected router result**:
- Every one of the eight prompts produces one decision line.
- A decision line is either a defer or a route to another packet such as `sk-code-skilled`.
- No decision line names `sk-code-frontend`.

**Expected behavior if a frontend route appears anyway**: This is a misroute. The likely cause is a frontend keyword that is a single bare word, so it matches inside an unrelated sentence. The remediation narrows the vocabulary in the hub router and in the router intent signals, and it never edits a prompt to make the run pass.

---

## 3. TEST EXECUTION

### Preconditions

1. `node` is callable.
2. `node .skilled/bin/compiled-route-guard.cjs --json` reports the sk-code hub as fresh.

### Exact Command Sequence

1. **Save the prompt set**, one prompt per line:
   ```
   bash: cat > /tmp/skc-RD005-prompts.txt <<'EOF'
   add left padding to the binary buffer before hashing
   hover over the symbol to debug the typescript type error
   pad the string with zeros in the python formatter
   easing the migration of the shell scripts to bash 5
   the transition between workflow states fails in the reducer
   add a hover provider to the language server
   fix the contrast stretch in the image processing python script
   the shadow copy of the config file is stale
   EOF
   ```
2. **Replay each prompt through the hub router**:
   ```
   bash: while IFS= read -r p; do node .skilled/bin/compiled-route.cjs --hub sk-code --prompt "$p"; done < /tmp/skc-RD005-prompts.txt > /tmp/skc-RD005-routes.txt
   ```
3. **Count the frontend routes**:
   ```
   bash: grep -c '"workflowMode":"sk-code-frontend"' /tmp/skc-RD005-routes.txt
   ```

### Expected Signals

Expected signals: 8 decision lines. A line may be a defer or a route to another packet such as `sk-code-skilled`. The count command prints `0` and exits 1.

### Pass/Fail Criteria

- **PASS** iff: the frontend count is `0`.
- **FAIL** iff: any decision names `sk-code-frontend`.

Evidence: `/tmp/skc-RD005-routes.txt` (the eight decision lines, one per prompt).

### Failure Triage

1. Find the failing prompt's line in the routes file.
2. List the frontend keywords that carry no space and no hyphen:
   ```
   bash: node -e "const v=require('./.skilled/skills/sk-code/hub-router.json').vocabularyClasses;console.log(Object.keys(v).filter(c=>c.startsWith('code-frontend')).flatMap(c=>v[c].keywords).filter(k=>!/[ -]/.test(k)))"
   ```
3. Replace each single-word keyword it prints with a phrase of two or more words, in `hub-router.json` and in the `INTENT_SIGNALS` rows of both `ROUTER.md` files.
4. If the list is empty, a phrase is too broad, so narrow the phrase that matched. Never edit a prompt to make it pass.

---

## 4. SOURCE FILES

- `../manual-testing-playbook.md`: Root directory page and scenario summary.
- `.skilled/skills/sk-code/hub-router.json`: The frontend vocabulary classes.
- `.skilled/skills/sk-code/mode-registry.json`: The FRONTEND detection block.
- `.skilled/bin/compiled-route.cjs`: The compiled route entry point the run replays prompts through.

Catalog: `feature-catalog/two-axis-registry-driven-routing/two-axis-registry-driven-routing.md`, the entry that states how the hub bundles a surface packet beside a workflow mode.

---

## 5. SOURCE METADATA

- Group: Routing Disambiguation
- Playbook ID: RD-005
- **Created**: 2026-11-14
- **Critical path**: No
- **Destructive**: No
- **Concurrent-safe**: Yes
- **Last validated**: pending first manual run
