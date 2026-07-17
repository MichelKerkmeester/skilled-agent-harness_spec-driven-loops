# Iteration 001 — Correctness: phase topology

The parent specification describes the packet as a 16-phase `000–015` program and maps phases 007–015 to leaf folders that are no longer the current execution topology. The authoritative `manifest/phase-tree.json` instead declares a literal-maximal re-decomposition with 175 nodes and 156 leaves; it makes former phase 003 a parent. The active terminal documents also end the current top-level sequence at `011-integrate-and-closeout`, whose adjacency says it has no successor.

This is not historical context labelled as such: the parent map is presented as the execution ordering and includes instructions for the current program. An operator following it can target nonexistent phase folders and miss current grouped children.

Finding F001 is open at P1. The parent needs one generated, current topology source rather than an obsolete parallel map.

## Assessment

Dimensions addressed: correctness

Review verdict: CONDITIONAL
