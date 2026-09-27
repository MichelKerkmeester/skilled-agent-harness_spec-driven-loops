"""Debiasing scaffolding for Deem: PMI-style priors and multi-template
phrasings.

Deem does its architectural work in debiasing rather than novel heads
(see SPEC.md §3).  This module provides the two inference-time pieces that
operate on the prompt format itself:

* :func:`pmi_prior` — pointwise-mutual-information style option priors
  (Zheng et al., ICLR 2024 and successors): score the question's options
  with the state *removed*, so that the model's bare option-token bias can
  be subtracted from posterior (state-conditioned) scores.
* :func:`normalize` / :func:`pmi_probabilities` — combine prior and
  posterior log-scores into a debiased distribution.

Multi-template support: at least 3 distinct phrasings per primitive are kept
as constants (:data:`CHOICE_TEMPLATES`, :data:`SCORE_TEMPLATES`,
:data:`NOUL_TEMPLATES`) and cycled deterministically by seed
(:func:`templated_question`), so template variance can be measured and
averaged over.
"""

from __future__ import annotations

import dataclasses
import zlib
from typing import Callable, Optional, Sequence, Union

from .format import build_prompt, softmax
from .primitives import (
    ChoiceQuestion,
    NoulQuestion,
    QuestionSet,
    ScoreQuestion,
)

__all__ = [
    "CHOICE_TEMPLATES",
    "NOUL_TEMPLATES",
    "SCORE_TEMPLATES",
    "templates_for",
    "template_index",
    "templated_instructions",
    "templated_question",
    "pmi_prior",
    "normalize",
    "pmi_probabilities",
]

# ---------------------------------------------------------------------------
# Multi-template phrasings
# ---------------------------------------------------------------------------

#: Distinct phrasings for Choice questions.  ``{instructions}`` is replaced
#: with the question's instructions; the surrounding phrasing varies so that
#: template variance can be measured as a data-quality signal.
CHOICE_TEMPLATES: tuple = (
    "{instructions}\nPick the single best option.",
    "{instructions}\nFrom the options given, choose exactly one.",
    "{instructions}\nWhich option applies? Select one.",
    "{instructions}\nExactly one option is correct. Select it.",
)

#: Distinct phrasings for Noul questions.
NOUL_TEMPLATES: tuple = (
    "{instructions}\nJudge the probability that this proposition is true.",
    "How likely is it that the following is true?\n{instructions}",
    "{instructions}\nRate the probability that this is true.",
    "Consider the proposition below and estimate its probability of being "
    "true.\n{instructions}",
)

#: Distinct phrasings for Score questions.
SCORE_TEMPLATES: tuple = (
    "{instructions}\nRate the item against the ordered levels below.",
    "{instructions}\nWhich level best describes it? Select one.",
    "Score the item described below against the ordered levels.\n{instructions}",
    "{instructions}\nPick the level that fits best.",
)


def templates_for(question) -> tuple:
    """The template tuple for a question's primitive."""
    if isinstance(question, ChoiceQuestion):
        return CHOICE_TEMPLATES
    if isinstance(question, ScoreQuestion):
        return SCORE_TEMPLATES
    if isinstance(question, NoulQuestion):
        return NOUL_TEMPLATES
    raise TypeError(f"unsupported question type {type(question).__name__}")


def template_index(question, seed: Optional[Union[int, str]] = None) -> int:
    """Deterministically pick a template index for ``seed``.

    Ints index directly; strings are hashed with CRC-32 (stable across
    runs, unlike :func:`hash`).  ``None`` selects template 0.
    """
    templates = templates_for(question)
    if seed is None:
        return 0
    if isinstance(seed, bool):
        seed = int(seed)
    if isinstance(seed, int):
        return seed % len(templates)
    crc = zlib.crc32(str(seed).encode("utf-8"))
    return crc % len(templates)


def templated_instructions(
    question, seed: Optional[Union[int, str]] = None
) -> str:
    """The question's instructions re-phrased by its seeded template."""
    templates = templates_for(question)
    index = template_index(question, seed)
    return templates[index].format(instructions=question.instructions)


def templated_question(question, seed: Optional[Union[int, str]] = None):
    """A copy of ``question`` with template-rephrased instructions.

    Options, levels and criteria are preserved unchanged, so the result is a
    drop-in replacement for :func:`deem.format.build_prompt`.
    """
    return dataclasses.replace(
        question, instructions=templated_instructions(question, seed)
    )


# ---------------------------------------------------------------------------
# PMI-style prior correction
# ---------------------------------------------------------------------------

#: State value used to elicit content-free option scores.  ``None`` renders
#: as canonical JSON ``null`` — an explicit, unambiguous empty state.


def pmi_prior(
    scorer: Callable[[str], Sequence], question
) -> list:
    """Score a question's options *without* the state (PMI-style prior).

    :param scorer: a callable that maps a prompt string (the question
      rendered with a content-free state, exactly one answer slot) to that
      slot's letter-logit vector, indexed by displayed option position.
    :param question: a :class:`~deem.primitives.ChoiceQuestion` or
      :class:`~deem.primitives.ScoreQuestion`.
    :returns: raw prior log-scores, one per option/level, in question order
      (no permutation is applied).

    For a :class:`~deem.primitives.NoulQuestion` the scorer's first value
    is returned as the single prior logit.
    """
    prompt = build_prompt(None, QuestionSet.of(prior=question))
    scores = scorer(prompt)
    scores = list(scores)
    if isinstance(question, NoulQuestion):
        if len(scores) < 1:
            raise ValueError(f"scorer returned no scores for noul prior: {scores}")
        return scores[:1]
    labels = getattr(question, "options", None) or getattr(question, "levels", None)
    if len(scores) < len(labels):
        raise ValueError(
            f"scorer returned {len(scores)} scores for {len(labels)} options"
        )
    return scores[: len(labels)]


def normalize(
    prior_scores: Sequence,
    posterior_scores: Sequence,
    weight: float = 1.0,
) -> list:
    """Combine prior and posterior log-scores.

    PMI-style correction works in log space: the debiased log-score is the
    posterior (state-conditioned) log-score minus ``weight`` times the
    content-free prior log-score.  ``weight`` 0 disables the correction,
    1 is the standard PMI correction, and fractional values allow softer
    variants.
    """
    if len(prior_scores) != len(posterior_scores):
        raise ValueError(
            f"prior has {len(prior_scores)} scores, "
            f"posterior has {len(posterior_scores)}"
        )
    return [
        posterior - weight * prior
        for prior, posterior in zip(prior_scores, posterior_scores)
    ]


def pmi_probabilities(
    question,
    prior_scores: Sequence,
    posterior_scores: Sequence,
    weight: float = 1.0,
    temperature: float = 1.0,
) -> dict:
    """Debiased probability distribution for ``question``.

    Applies :func:`normalize` then a temperature softmax, keyed by option
    (Choice) or level (Score) text.  For :class:`~deem.primitives.NoulQuestion`
    the single corrected logit is passed through a sigmoid instead.
    """
    if isinstance(question, NoulQuestion):
        from .format import sigmoid

        corrected = normalize(prior_scores, posterior_scores, weight)
        return {"true": sigmoid(corrected[0] / temperature)}
    corrected = normalize(prior_scores, posterior_scores, weight)
    probs = softmax(corrected, temperature)
    labels = getattr(question, "options", None) or getattr(question, "levels", None)
    return dict(zip(labels, probs))
