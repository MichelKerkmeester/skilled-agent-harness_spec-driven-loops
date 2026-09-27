"""LibertAI Deem — open System One decision models.

This package implements the core prompt-format layer: typed question
primitives, the letter-slot cross-encoder prompt builder, and debiasing
scaffolding.  Python 3.10 stdlib only.
"""

from .primitives import (
    MAX_LEVELS,
    MAX_OPTIONS,
    ChoiceQuestion,
    ChoiceResult,
    NoulQuestion,
    NoulResult,
    QuestionSet,
    DeemError,
    ScoreQuestion,
    ScoreResult,
)
from .format import (
    LETTERS,
    LETTER_INDEX,
    build_prompt,
    confidence_from_probabilities,
    index_for_letter,
    letter_for_index,
    marginalize,
    marginalize_choice,
    marginalize_score,
    permute_question,
    prompt_hash,
    read_answers,
    render_state,
    softmax,
)
from .debias import (
    CHOICE_TEMPLATES,
    NOUL_TEMPLATES,
    SCORE_TEMPLATES,
    normalize,
    pmi_prior,
    pmi_probabilities,
    templated_instructions,
    templated_question,
    templates_for,
)

__version__ = "0.1.0"

__all__ = [
    "MAX_LEVELS",
    "MAX_OPTIONS",
    "ChoiceQuestion",
    "ChoiceResult",
    "NoulQuestion",
    "NoulResult",
    "QuestionSet",
    "DeemError",
    "ScoreQuestion",
    "ScoreResult",
    "LETTERS",
    "LETTER_INDEX",
    "build_prompt",
    "confidence_from_probabilities",
    "index_for_letter",
    "letter_for_index",
    "marginalize",
    "marginalize_choice",
    "marginalize_score",
    "permute_question",
    "prompt_hash",
    "read_answers",
    "render_state",
    "softmax",
    "CHOICE_TEMPLATES",
    "NOUL_TEMPLATES",
    "SCORE_TEMPLATES",
    "normalize",
    "pmi_prior",
    "pmi_probabilities",
    "templated_instructions",
    "templated_question",
    "templates_for",
]
