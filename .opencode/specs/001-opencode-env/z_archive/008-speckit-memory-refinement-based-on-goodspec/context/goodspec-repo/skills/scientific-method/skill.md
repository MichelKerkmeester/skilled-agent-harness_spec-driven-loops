---
name: scientific-method
description: Apply scientific reasoning to software development for systematic problem-solving.
category: core
triggers:
  - hypothesis
  - experiment
  - evidence
  - method
version: 0.1.0
---

# Scientific Method Skill

## Purpose
Apply scientific reasoning to software development for systematic problem-solving.

## The Method

### 1. Observation
Gather facts about the current state.
- What is actually happening?
- What are the symptoms?
- What data do we have?

### 2. Question
Formulate a clear question to answer.
- What specifically are we trying to understand?
- What would a solution look like?

### 3. Hypothesis
Propose an explanation or solution.
- "If we do X, then Y should happen because Z"
- Make it testable and falsifiable

### 4. Prediction
What specific outcomes would confirm/refute the hypothesis?
- Define success criteria
- Identify measurable indicators

### 5. Experiment
Test the hypothesis with minimal changes.
- Change one variable at a time
- Document what you're testing
- Keep controls in place

### 6. Analysis
Interpret the results.
- Did the prediction hold?
- What did we learn?
- Are there alternative explanations?

### 7. Conclusion
Draw conclusions and iterate.
- Confirm or reject hypothesis
- Form new hypotheses if needed
- Document learnings

## Application to Debugging

1. **Observe** - Note error messages, behavior
2. **Question** - "Why is X happening?"
3. **Hypothesize** - "The bug is in module Y because..."
4. **Predict** - "If I'm right, adding this log will show..."
5. **Experiment** - Add the log, run the test
6. **Analyze** - Check the output
7. **Conclude** - Fix or form new hypothesis
