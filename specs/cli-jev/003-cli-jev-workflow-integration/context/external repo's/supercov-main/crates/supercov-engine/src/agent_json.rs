use serde::Serialize;
use serde_json::Value;
use supercov_contracts::{AGENT_JSON_MAX_BYTES, AGENT_JSON_SCHEMA_VERSION, AgentPagination};

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum ErrorCode {
    AmbiguousSelector,
    DecisionNotFound,
    FilterUnavailable,
    InternalError,
    InvalidArgument,
    MinimizationComplexityLimit,
    NoRuns,
    ResponseTooLarge,
    RunNotFound,
    ScopeUnavailable,
    SourceNotFound,
    TargetUnreachable,
    TestFilterEmpty,
    TestNotFound,
    UnattributedEvidence,
    UnknownCommand,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct AgentError {
    pub code: ErrorCode,
    pub message: String,
    pub retryable: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub details: Option<Value>,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct ResponseTooLarge {
    pub actual_bytes: usize,
    pub max_bytes: usize,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct SuccessEnvelope<'a, T> {
    schema_version: u32,
    ok: bool,
    command: &'a str,
    data: &'a T,
    #[serde(skip_serializing_if = "Option::is_none")]
    pagination: Option<&'a AgentPagination>,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct FailureEnvelope<'a> {
    schema_version: u32,
    ok: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    command: Option<&'a str>,
    error: &'a AgentError,
}

fn newline_json<T: Serialize>(value: &T) -> Result<String, serde_json::Error> {
    let mut json = serde_json::to_string(value)?;
    json.push('\n');
    Ok(json)
}

pub fn pagination(offset: usize, limit: usize, returned: usize, total: usize) -> AgentPagination {
    let next = offset.saturating_add(returned);
    let has_more = returned > 0 && next < total;
    AgentPagination {
        offset,
        limit,
        returned,
        total,
        has_more,
        next_offset: has_more.then_some(next),
    }
}

pub fn success<T: Serialize>(
    command: &str,
    data: &T,
    page: Option<&AgentPagination>,
) -> Result<String, ResponseTooLarge> {
    let json = newline_json(&SuccessEnvelope {
        schema_version: AGENT_JSON_SCHEMA_VERSION,
        ok: true,
        command,
        data,
        pagination: page,
    })
    .expect("serializing a Supercov JSON envelope must not fail");
    if json.len() > AGENT_JSON_MAX_BYTES {
        return Err(ResponseTooLarge {
            actual_bytes: json.len(),
            max_bytes: AGENT_JSON_MAX_BYTES,
        });
    }
    Ok(json)
}

pub fn failure(command: Option<&str>, error: &AgentError) -> String {
    let envelope = FailureEnvelope {
        schema_version: AGENT_JSON_SCHEMA_VERSION,
        ok: false,
        command,
        error,
    };
    let json = newline_json(&envelope).expect("serializing a Supercov error must not fail");
    if json.len() <= AGENT_JSON_MAX_BYTES {
        return json;
    }

    let mut truncated = error.clone();
    truncated.message = truncated.message.chars().take(1_000).collect();
    truncated.details = None;
    newline_json(&FailureEnvelope {
        error: &truncated,
        ..envelope
    })
    .expect("serializing a truncated Supercov error must not fail")
}

#[cfg(test)]
mod tests {
    use serde_json::json;

    use super::*;

    #[test]
    fn success_is_byte_identical_to_the_frozen_golden() {
        let actual = success(
            "coverage.summary",
            &json!({"run": "run-123", "coverage": {"lines": 100}}),
            None,
        )
        .unwrap();
        assert_eq!(
            actual,
            include_str!("../test-assets/agent/agent-success.json")
        );
    }

    #[test]
    fn pagination_is_byte_identical_to_the_frozen_golden() {
        let page = pagination(20, 20, 1, 21);
        let actual = success(
            "coverage.gaps",
            &json!({"gaps": [{"file": "src/example.ts"}]}),
            Some(&page),
        )
        .unwrap();
        assert_eq!(actual, include_str!("../test-assets/agent/agent-page.json"));
    }

    #[test]
    fn errors_are_byte_identical_to_the_frozen_golden() {
        let actual = failure(
            Some("coverage.file"),
            &AgentError {
                code: ErrorCode::SourceNotFound,
                message: "Source file not found: missing.ts".into(),
                retryable: false,
                details: Some(json!({"selector": "missing.ts"})),
            },
        );
        assert_eq!(
            actual,
            include_str!("../test-assets/agent/agent-error.json")
        );
    }

    #[test]
    fn success_enforces_the_agent_context_budget() {
        let result = success("coverage.file", &"x".repeat(AGENT_JSON_MAX_BYTES), None);
        assert!(matches!(
            result,
            Err(ResponseTooLarge {
                max_bytes: AGENT_JSON_MAX_BYTES,
                ..
            })
        ));
    }
}
