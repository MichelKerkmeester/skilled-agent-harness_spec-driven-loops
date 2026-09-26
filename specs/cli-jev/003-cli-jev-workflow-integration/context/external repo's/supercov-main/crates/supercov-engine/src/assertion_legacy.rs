//! Read-only v1 import. Former acknowledgements never become v2 credit.
use super::{Anchor, version};
use serde::{Deserialize, Serialize};
use std::collections::{BTreeMap, BTreeSet};
#[derive(Debug, Clone, Default, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub enum Analysis {
    #[default]
    Unmapped,
    Partial,
    Mapped,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct Node {
    pub id: String,
    pub at: Anchor,
    #[serde(default, skip_serializing_if = "String::is_empty")]
    pub role: String,
    #[serde(default, skip_serializing_if = "String::is_empty")]
    pub meaning: String,
}
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct Edge {
    pub from: String,
    pub to: String,
    pub kind: String,
    #[serde(default, skip_serializing_if = "String::is_empty")]
    pub basis: String,
}
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(tag = "kind", rename_all = "camelCase", deny_unknown_fields)]
pub enum Watch {
    File { file: String },
    Span { at: Anchor },
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct Flow {
    pub id: String,
    pub explanation: String,
    #[serde(default, skip_serializing_if = "Vec::is_empty")]
    pub applies_to: Vec<String>,
    pub nodes: Vec<Node>,
    #[serde(default)]
    pub edges: Vec<Edge>,
    pub counts_as_asserted: Vec<String>,
    pub watch: Vec<Watch>,
}
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct Assertion {
    pub id: String,
    pub at: Anchor,
    #[serde(default)]
    pub analysis: Analysis,
    #[serde(default)]
    pub observes: Vec<String>,
    #[serde(default)]
    pub flows: Vec<Flow>,
}
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct Retired {
    pub assertion: Assertion,
    pub reason: String,
}
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct AssertionMap {
    #[serde(default = "version")]
    pub schema_version: u32,
    pub assertions: Vec<Assertion>,
    #[serde(default, skip_serializing_if = "Vec::is_empty")]
    pub retired_assertions: Vec<Retired>,
}

#[derive(Debug, Clone, Default, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct Review {
    pub fingerprint: String,
    pub reasons: BTreeSet<String>,
}
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct State {
    pub schema_version: u32,
    pub inputs_digest: String,
    pub evidence_digest: String,
    pub reviews: BTreeMap<String, Review>,
    pub scope_review: BTreeSet<String>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub inheritance: Option<Inheritance>,
}
#[derive(Debug, Clone, Default, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct Inheritance {
    pub from: Option<String>,
    pub skipped: Vec<SkippedMap>,
}
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct SkippedMap {
    pub run: String,
    pub reason: String,
}

pub(super) fn import(bytes: &[u8]) -> Result<super::AssertionMap, String> {
    let old: AssertionMap = serde_json::from_slice(bytes).map_err(|e| e.to_string())?;
    if old.schema_version != 1 {
        return Err("unsupported legacy assertion schema".into());
    }
    fn assertion(a: Assertion) -> super::Assertion {
        let mut questions = vec![];
        if a.analysis == Analysis::Partial {
            questions.push("Legacy analysis was partial; continue its investigation.".into());
        }
        super::Assertion { id:a.id, at:a.at, observes:a.observes, questions,
            flows:a.flows.into_iter().map(|f| super::Flow {
                id:f.id, basis:None, explanation:f.explanation, applies_to:vec![],
                questions:vec![format!("Imported v1 flow: qualify appliesTo with test file and name, and inspect authored paths to $assertion. Former selectors: {:?}", f.applies_to)],
                nodes:f.nodes.into_iter().map(|n| super::Node{id:n.id,at:n.at,role:n.role,meaning:n.meaning}).collect(),
                edges:f.edges.into_iter().map(|e| super::Edge{from:e.from,to:e.to,kind:e.kind,basis:e.basis}).collect(),
                counts_as_asserted:f.counts_as_asserted,
                watch:f.watch.into_iter().map(|w| match w {Watch::File{file}=>file,Watch::Span{at}=>at.file}).collect::<BTreeSet<_>>().into_iter().collect(),
            }).collect() }
    }
    Ok(super::AssertionMap {
        schema_version: 2,
        assertions: old.assertions.into_iter().map(assertion).collect(),
        change_assessments: vec![],
        retired_assertions: old
            .retired_assertions
            .into_iter()
            .map(|r| super::Retired {
                assertion: assertion(r.assertion),
                reason: r.reason,
            })
            .collect(),
    })
}
pub(super) fn state(
    bytes: &[u8],
    map: &super::AssertionMap,
    inputs: &super::InputManifest,
    evidence: &str,
    legacy_digest: Option<&str>,
) -> Result<super::State, String> {
    let old: State = serde_json::from_slice(bytes).map_err(|e| e.to_string())?;
    if old.evidence_digest != evidence
        || !(old.schema_version == 2 && old.inputs_digest == super::digest(inputs)
            || old.schema_version == 1 && Some(old.inputs_digest.as_str()) == legacy_digest)
    {
        return Err("legacy assertion state does not match run evidence".into());
    }
    let mut state = super::seed_manifest(inputs, evidence).1;
    state.inheritance = old.inheritance.map(|i| super::Inheritance {
        from: i.from,
        skipped: i
            .skipped
            .into_iter()
            .map(|s| super::SkippedMap {
                run: s.run,
                reason: s.reason,
            })
            .collect(),
    });
    super::invalidate(
        &mut state,
        map,
        "Imported legacy map; inspect current source and v2 flow claims",
    );
    for reason in old.scope_review {
        super::add_change(
            &mut state,
            None,
            None,
            None,
            reason,
            BTreeSet::new(),
            BTreeSet::new(),
        );
    }
    Ok(state)
}
