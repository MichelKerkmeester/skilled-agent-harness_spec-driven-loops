//! Port of `src/deem/format.py` — the Deem prompt format.
//!
//! Everything here mirrors the Python implementation byte-for-byte:
//! canonical JSON state serialization (sorted keys, compact separators,
//! `ensure_ascii=False`), angle-bracket hardening, the letter-slot prompt
//! layout, and the answer decoding (softmax over valid letters, derived
//! confidence `(N·pmax − 1)/(N − 1)`).

use serde_json::Value;

pub const MAX_OPTIONS: usize = 255;
pub const STATE_OPEN: &str = "<state>";
pub const STATE_CLOSE: &str = "</state>";

/// Spreadsheet-style bijective base-26: 0 -> "A" ... 25 -> "Z", 26 -> "AA".
pub fn letter_for_index(index: usize) -> String {
    assert!(index < MAX_OPTIONS, "option index exceeds cardinality cap");
    let mut n = index + 1;
    let mut letters = Vec::new();
    while n > 0 {
        let rem = (n - 1) % 26;
        letters.push((b'A' + rem as u8) as char);
        n = (n - 1) / 26;
    }
    letters.iter().rev().collect()
}

pub fn index_for_letter(letter: &str) -> Option<usize> {
    if letter.is_empty() {
        return None;
    }
    let mut index = 0usize;
    for ch in letter.chars() {
        if !('A'..='Z').contains(&ch) {
            return None;
        }
        index = index * 26 + (ch as usize - 'A' as usize + 1);
    }
    index -= 1;
    if index >= MAX_OPTIONS {
        return None;
    }
    Some(index)
}

// ---------------------------------------------------------------------------
// Numerics
// ---------------------------------------------------------------------------

pub fn softmax(logits: &[f32], temperature: f32) -> Vec<f32> {
    assert!(temperature > 0.0, "temperature must be positive");
    assert!(!logits.is_empty(), "softmax of empty vector");
    let scaled: Vec<f32> = logits.iter().map(|x| x / temperature).collect();
    let m = scaled.iter().cloned().fold(f32::NEG_INFINITY, f32::max);
    let exps: Vec<f32> = scaled.iter().map(|x| (x - m).exp()).collect();
    let total: f32 = exps.iter().sum();
    exps.iter().map(|e| e / total).collect()
}

pub fn sigmoid(x: f32) -> f32 {
    if x >= 0.0 {
        1.0 / (1.0 + (-x).exp())
    } else {
        let z = x.exp();
        z / (1.0 + z)
    }
}

/// Derived confidence `(N * pmax - 1) / (N - 1)`; 1.0 when N <= 1.
pub fn confidence_from_probabilities(probabilities: &[f32]) -> f32 {
    let n = probabilities.len();
    if n <= 1 {
        return 1.0;
    }
    (n as f32 * probabilities.iter().cloned().fold(f32::NEG_INFINITY, f32::max) - 1.0)
        / (n as f32 - 1.0)
}

// ---------------------------------------------------------------------------
// State rendering
// ---------------------------------------------------------------------------

fn harden(text: &str) -> String {
    text.replace('<', "\\u003c").replace('>', "\\u003e")
}

/// Canonical JSON with sorted keys, compact separators, non-ASCII raw.
/// Mirrors: json.dumps(state, sort_keys=True, separators=(",", ":"),
/// ensure_ascii=False).
pub fn canonical_json(v: &Value) -> String {
    let s = serde_json::to_string(v).unwrap_or_else(|_| "null".to_string());
    harden(&s)
}

pub fn render_state(state: &Value) -> String {
    canonical_json(state)
}

// ---------------------------------------------------------------------------
// Question types
// ---------------------------------------------------------------------------

#[derive(Debug, Clone)]
pub enum Question {
    Choice {
        instructions: String,
        options: Vec<String>,
    },
    Score {
        instructions: String,
        levels: Vec<String>,
    },
    Noul {
        instructions: String,
    },
}

impl Question {
    pub fn n_valid(&self) -> usize {
        match self {
            Question::Choice { options, .. } => options.len(),
            Question::Score { levels, .. } => levels.len(),
            Question::Noul { .. } => 2,
        }
    }

    pub fn labels(&self) -> Option<&[String]> {
        match self {
            Question::Choice { options, .. } => Some(options),
            Question::Score { levels, .. } => Some(levels),
            Question::Noul { .. } => None,
        }
    }
}

/// Ordered question set (Python dict insertion order).
#[derive(Debug, Clone, Default)]
pub struct QuestionSet {
    pub items: Vec<(String, Question)>,
}

impl QuestionSet {
    pub fn push(&mut self, id: String, question: Question) {
        self.items.push((id, question));
    }
}

/// Render the canonical Deem prompt.
pub fn build_prompt(state: &Value, questions: &QuestionSet, permutations: &Permutations) -> String {
    let mut lines: Vec<String> = vec![
        STATE_OPEN.to_string(),
        render_state(state),
        STATE_CLOSE.to_string(),
    ];
    for (k, (qid, question)) in questions.items.iter().enumerate() {
        let k1 = k + 1;
        lines.push(String::new());
        lines.push(format!("Question {k1}: {}", question_instructions(question)));
        let perm = permutations.get(qid);
        let perm = permutations.get(qid);
        match question {
            Question::Choice { .. } | Question::Score { .. } => {
                let options = question.labels().unwrap();
                let displayed: Vec<String> = if let Some(p) = perm {
                    p.iter().map(|i| options[*i].clone()).collect()
                } else {
                    options.to_vec()
                };
                lines.push("Options:".to_string());
                for (i, label) in displayed.iter().enumerate() {
                    lines.push(format!("({}) {}", letter_for_index(i), label));
                }
            }
            Question::Noul { .. } => {}
        }
        lines.push(format!("Answer {k1}: ("));
    }
    lines.join("\n")
}

pub type Permutations = std::collections::HashMap<String, Vec<usize>>;

fn question_instructions(q: &Question) -> &str {
    match q {
        Question::Choice { instructions, .. }
        | Question::Score { instructions, .. }
        | Question::Noul { instructions } => instructions,
    }
}

// ---------------------------------------------------------------------------
// Answer decoding
// ---------------------------------------------------------------------------

#[derive(Debug)]
pub enum Answer {
    Choice {
        choice: String,
        probabilities: Vec<(String, f32)>,
        confidence: f32,
    },
    Score {
        level: String,
        probabilities: Vec<(String, f32)>,
        expected: f32,
        confidence: f32,
    },
    Noul {
        value: f32,
        confidence: f32,
    },
}

/// Decode per-slot letter logits into typed results. `logits_by_slot` is
/// indexed by 1-based slot position; entries are indexed by *displayed*
/// option position. Probabilities land back in original option order.
pub fn read_answers(
    questions: &QuestionSet,
    logits_by_slot: &[Vec<f32>],
    permutations: &Permutations,
    temperature: f32,
) -> Vec<(String, Answer)> {
    let mut out = Vec::new();
    for (k, (qid, question)) in questions.items.iter().enumerate() {
        let logits = &logits_by_slot[k];
        let perm = permutations.get(qid);
        let ans = match question {
            Question::Noul { .. } => {
                // binary readout: [not-true, true]
                let probs = softmax(&logits[..2], temperature);
                let value = probs[1];
                Answer::Noul {
                    value,
                    confidence: 2.0 * value.max(1.0 - value) - 1.0,
                }
            }
            Question::Choice { options, .. } => {
                let (probs, labels) = remap_and_softmax(options, logits, perm, temperature);
                let choice = argmax_label(&labels, &probs).to_string();
                let confidence = confidence_from_probabilities(&probs);
                Answer::Choice {
                    choice,
                    probabilities: labels.iter().cloned().zip(probs).collect(),
                    confidence,
                }
            }
            Question::Score { levels, .. } => {
                let (probs, labels) = remap_and_softmax(levels, logits, perm, temperature);
                let level = argmax_label(&labels, &probs).to_string();
                let expected: f32 = probs.iter().enumerate().map(|(i, p)| i as f32 * p).sum();
                let confidence = confidence_from_probabilities(&probs);
                Answer::Score {
                    level,
                    probabilities: labels.iter().cloned().zip(probs).collect(),
                    expected,
                    confidence,
                }
            }
        };
        out.push((qid.clone(), ans));
    }
    out
}

fn remap_and_softmax(
    labels: &[String],
    logits: &[f32],
    perm: Option<&Vec<usize>>,
    temperature: f32,
) -> (Vec<f32>, Vec<String>) {
    let n = labels.len();
    let valid: &[f32] = &logits[..n.min(logits.len())];
    let (ordered_logits, ordered_labels): (Vec<f32>, Vec<String>) = match perm {
        Some(p) => {
            let mut reordered = vec![0.0f32; n];
            for (displayed, original) in p.iter().enumerate() {
                reordered[*original] = valid[displayed];
            }
            (reordered, labels.to_vec())
        }
        None => (valid.to_vec(), labels.to_vec()),
    };
    let probs = softmax(&ordered_logits, temperature);
    (probs, ordered_labels)
}

fn argmax_label<'a>(labels: &'a [String], probs: &[f32]) -> &'a str {
    let mut best = 0usize;
    for (i, p) in probs.iter().enumerate() {
        if *p > probs[best] {
            best = i;
        }
    }
    &labels[best]
}

/// Per-question temperature variant of `read_answers` (the server applies
/// per-dataset / per-primitive calibration temperatures).
pub fn read_answers_with_temps(
    questions: &QuestionSet,
    logits_by_slot: &[Vec<f32>],
    permutations: &Permutations,
    temperatures: &[f32],
) -> Vec<(String, Answer)> {
    let mut out = Vec::new();
    for (k, (qid, question)) in questions.items.iter().enumerate() {
        let temperature = temperatures.get(k).cloned().unwrap_or(1.0);
        let single = QuestionSet {
            items: vec![(qid.clone(), question.clone())],
        };
        let mut answers = read_answers(&single, &logits_by_slot[k..k + 1], permutations, temperature);
        out.push(answers.pop().unwrap());
    }
    out
}

/// Deterministic permutation for a question (mirror of permute_question).
/// Python's random.Random(seed).shuffle — the exact sequence must match if
/// order-averaging parity is required; server callers pass explicit perms.
pub fn identity_perm(question: &Question) -> Vec<usize> {
    match question.n_valid() {
        0 => Vec::new(),
        n => (0..n).collect(),
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn letters() {
        assert_eq!(letter_for_index(0), "A");
        assert_eq!(letter_for_index(25), "Z");
        assert_eq!(letter_for_index(26), "AA");
        assert_eq!(letter_for_index(27), "AB");
        assert_eq!(letter_for_index(254), "IU");
        assert_eq!(index_for_letter("IU"), Some(254));
    }

    #[test]
    fn prompt_layout() {
        let state = serde_json::json!("deploy box");
        let mut qs = QuestionSet::default();
        qs.push(
            "q".into(),
            Question::Choice {
                instructions: "What to do?".into(),
                options: vec!["deploy".into(), "hold".into()],
            },
        );
        let prompt = build_prompt(&state, &qs, &Permutations::default());
        assert_eq!(
            prompt,
            "<state>\n\"deploy box\"\n</state>\n\n\
             Question 1: What to do?\nOptions:\n(A) deploy\n(B) hold\nAnswer 1: ("
        );
    }

    #[test]
    fn confidence() {
        assert_eq!(confidence_from_probabilities(&[0.5, 0.5]), 0.0);
        assert_eq!(confidence_from_probabilities(&[1.0, 0.0]), 1.0);
    }
}
