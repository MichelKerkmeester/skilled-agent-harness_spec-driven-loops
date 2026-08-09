//! A restricted JSON Schema subset, and structural subtyping over it.
//!
//! Restricted on purpose: `anyOf`, `$ref`, `not` and friends make satisfiability
//! undecidable-in-practice, and a checker that silently skips what it cannot
//! understand is worse than one that refuses it. Unsupported constructs are
//! **rejected at authoring time** so no binding is ever unchecked without
//! anyone noticing.

use std::collections::BTreeMap;

use serde_json::Value;

#[derive(Clone, Debug, PartialEq, Eq)]
pub enum Type {
    Object {
        properties: BTreeMap<String, Type>,
        required: Vec<String>,
        open: bool,
    },
    Array(Box<Type>),
    String,
    Number,
    Integer,
    Boolean,
    Null,
    /// No `type` declared: matches anything, and satisfies nothing specific.
    Any,
}

#[derive(Clone, Debug, PartialEq, Eq)]
pub struct Unsupported {
    pub construct: String,
    pub at: String,
}

pub fn parse(schema: &Value) -> Result<Type, Unsupported> {
    parse_at(schema, "$")
}

const REJECTED: &[&str] = &[
    "anyOf",
    "oneOf",
    "allOf",
    "not",
    "$ref",
    "if",
    "then",
    "else",
    "patternProperties",
    "dependentSchemas",
    "propertyNames",
    "unevaluatedProperties",
];

fn parse_at(schema: &Value, path: &str) -> Result<Type, Unsupported> {
    let Some(obj) = schema.as_object() else {
        return Ok(Type::Any);
    };

    for key in REJECTED {
        if obj.contains_key(*key) {
            return Err(Unsupported { construct: (*key).to_string(), at: path.to_string() });
        }
    }

    let Some(ty) = obj.get("type").and_then(|t| t.as_str()) else {
        return Ok(Type::Any);
    };

    match ty {
        "object" => {
            let mut properties = BTreeMap::new();
            if let Some(props) = obj.get("properties").and_then(|p| p.as_object()) {
                for (name, sub) in props {
                    properties.insert(name.clone(), parse_at(sub, &format!("{path}.{name}"))?);
                }
            }
            let required = obj
                .get("required")
                .and_then(|r| r.as_array())
                .map(|a| a.iter().filter_map(|v| v.as_str().map(String::from)).collect())
                .unwrap_or_default();
            let open = obj.get("additionalProperties").and_then(|v| v.as_bool()).unwrap_or(true);
            Ok(Type::Object { properties, required, open })
        }
        "array" => {
            let items = obj.get("items").map(|i| parse_at(i, &format!("{path}[]"))).transpose()?;
            Ok(Type::Array(Box::new(items.unwrap_or(Type::Any))))
        }
        "string" => Ok(Type::String),
        "number" => Ok(Type::Number),
        "integer" => Ok(Type::Integer),
        "boolean" => Ok(Type::Boolean),
        "null" => Ok(Type::Null),
        other => Err(Unsupported { construct: format!("type: {other}"), at: path.to_string() }),
    }
}

/// Does a value of type `source` satisfy a requirement of type `target`?
///
/// `Any` on the *source* side satisfies nothing specific — an undeclared output
/// cannot be shown to meet a declared input, and quietly allowing it would make
/// the whole binding check decorative.
pub fn satisfies(source: &Type, target: &Type) -> bool {
    match (source, target) {
        (_, Type::Any) => true,
        (Type::Any, _) => false,
        (Type::Integer, Type::Number) => true,
        (
            Type::Object { properties: sp, required: sr, .. },
            Type::Object { properties: tp, required: tr, .. },
        ) => {
            for name in tr {
                if !sr.contains(name) {
                    return false;
                }
            }
            for (name, tty) in tp {
                match sp.get(name) {
                    Some(sty) if satisfies(sty, tty) => {}
                    Some(_) => return false,
                    None => {
                        if tr.contains(name) {
                            return false;
                        }
                    }
                }
            }
            true
        }
        (Type::Array(s), Type::Array(t)) => satisfies(s, t),
        (a, b) => a == b,
    }
}

#[derive(Clone, Debug, PartialEq, Eq)]
pub enum PathError {
    Malformed(String),
    NoSuchField { field: String, at: String },
    NotAnObject { at: String },
    NotAnArray { at: String },
}

/// Resolve a restricted JSON path against a schema, yielding the selected type.
///
/// Supported: `$`, `$.a`, `$.a.b`, `$.a[]`, `$.a[*]`.
pub fn resolve(root: &Type, path: &str) -> Result<Type, PathError> {
    let path = path.trim();
    if path == "$" {
        return Ok(root.clone());
    }
    // A `forEach` node declares one child's output shape, and the expanded
    // parent produces an array of them. `$[*].field` therefore resolves against
    // the declared shape and yields an array of that field's type.
    if let Some(rest) = path.strip_prefix("$[*]") {
        let inner = match rest.strip_prefix('.') {
            None | Some("") => root.clone(),
            Some(tail) => resolve(root, &format!("$.{tail}"))?,
        };
        return Ok(Type::Array(Box::new(inner)));
    }
    let Some(rest) = path.strip_prefix("$.") else {
        return Err(PathError::Malformed(path.to_string()));
    };

    let mut current = root.clone();
    let mut walked = String::from("$");

    for raw in rest.split('.') {
        if raw.is_empty() {
            return Err(PathError::Malformed(path.to_string()));
        }
        let (field, index) = split_index(raw);
        if field.is_empty() {
            return Err(PathError::Malformed(path.to_string()));
        }

        current = match current {
            Type::Object { properties, .. } => properties.get(field).cloned().ok_or_else(|| {
                PathError::NoSuchField { field: field.to_string(), at: walked.clone() }
            })?,
            Type::Any => Type::Any,
            _ => return Err(PathError::NotAnObject { at: walked.clone() }),
        };
        walked.push('.');
        walked.push_str(field);

        // `[*]` and `[3]` both step into the element type; the difference is
        // how many elements the caller gets, which the schema cannot express.
        if index != Index::None {
            current = match current {
                Type::Array(inner) => *inner,
                Type::Any => Type::Any,
                _ => return Err(PathError::NotAnArray { at: walked.clone() }),
            };
        }
    }
    Ok(current)
}

/// Is the type at this path an array? Used to check `forEach` sources.
pub fn is_array(t: &Type) -> bool {
    matches!(t, Type::Array(_) | Type::Any)
}

#[cfg(test)]
mod tests {
    use super::*;
    use serde_json::json;

    fn t(v: Value) -> Type {
        parse(&v).unwrap()
    }

    #[test]
    fn unsupported_constructs_are_refused_not_skipped() {
        for construct in ["anyOf", "oneOf", "allOf", "not", "$ref"] {
            let schema = json!({ "type": "object", construct: [] });
            let err = parse(&schema).unwrap_err();
            assert_eq!(err.construct, construct);
        }
    }

    #[test]
    fn unsupported_constructs_are_found_nested() {
        let schema = json!({
            "type": "object",
            "properties": { "inner": { "anyOf": [] } }
        });
        let err = parse(&schema).unwrap_err();
        assert_eq!(err.construct, "anyOf");
        assert_eq!(err.at, "$.inner");
    }

    #[test]
    fn an_undeclared_output_satisfies_nothing_specific() {
        let anything = Type::Any;
        let wanted =
            t(json!({"type":"object","properties":{"a":{"type":"string"}},"required":["a"]}));
        assert!(!satisfies(&anything, &wanted));
        assert!(satisfies(&wanted, &Type::Any));
    }

    #[test]
    fn objects_subtype_structurally() {
        let source = t(json!({
            "type":"object",
            "properties":{"id":{"type":"string"},"extra":{"type":"number"}},
            "required":["id","extra"]
        }));
        let target = t(json!({
            "type":"object",
            "properties":{"id":{"type":"string"}},
            "required":["id"]
        }));
        assert!(satisfies(&source, &target), "extra fields are fine");
        assert!(!satisfies(&target, &source), "a missing required field is not");
    }

    #[test]
    fn required_fields_must_be_required_upstream() {
        let source = t(json!({"type":"object","properties":{"a":{"type":"string"}}}));
        let target =
            t(json!({"type":"object","properties":{"a":{"type":"string"}},"required":["a"]}));
        assert!(!satisfies(&source, &target), "optional cannot satisfy required");
    }

    #[test]
    fn type_mismatches_are_caught() {
        assert!(!satisfies(&Type::String, &Type::Number));
        assert!(satisfies(&Type::Integer, &Type::Number));
        assert!(!satisfies(&Type::Number, &Type::Integer));
    }

    #[test]
    fn arrays_subtype_by_element() {
        let strings = t(json!({"type":"array","items":{"type":"string"}}));
        let numbers = t(json!({"type":"array","items":{"type":"number"}}));
        assert!(satisfies(&strings, &strings));
        assert!(!satisfies(&strings, &numbers));
    }

    #[test]
    fn paths_resolve_through_objects_and_arrays() {
        let root = t(json!({
            "type":"object",
            "properties":{
                "customers":{"type":"array","items":{"type":"object",
                    "properties":{"id":{"type":"string"}},"required":["id"]}}
            },
            "required":["customers"]
        }));

        assert_eq!(resolve(&root, "$").unwrap(), root);
        assert!(is_array(&resolve(&root, "$.customers").unwrap()));
        let elem = resolve(&root, "$.customers[*]").unwrap();
        assert!(satisfies(
            &elem,
            &t(json!({"type":"object","properties":{"id":{"type":"string"}},"required":["id"]}))
        ));
        assert_eq!(resolve(&root, "$.customers[*].id").unwrap(), Type::String);
    }

    #[test]
    fn a_path_into_a_field_that_does_not_exist_is_an_error() {
        let root = t(json!({"type":"object","properties":{"a":{"type":"string"}}}));
        assert_eq!(
            resolve(&root, "$.missing"),
            Err(PathError::NoSuchField { field: "missing".into(), at: "$".into() })
        );
    }

    #[test]
    fn malformed_paths_are_errors_not_silent_passes() {
        let root = t(json!({"type":"object"}));
        assert!(matches!(resolve(&root, "customers"), Err(PathError::Malformed(_))));
        assert!(matches!(resolve(&root, "$."), Err(PathError::Malformed(_))));
    }

    #[test]
    fn indexing_a_non_array_is_an_error() {
        let root = t(json!({"type":"object","properties":{"a":{"type":"string"}}}));
        assert!(matches!(resolve(&root, "$.a[*]"), Err(PathError::NotAnArray { .. })));
    }
}

/// Validate a concrete value against a parsed schema.
///
/// Used at `done`, where an output that does not match its declared schema is a
/// refusal rather than a warning: every downstream binding was checked against
/// that declaration at plan time, so accepting a mismatch would make those
/// checks retroactively meaningless.
pub fn validate_value(value: &Value, ty: &Type) -> Result<(), ValueError> {
    validate_at(value, ty, "$")
}

#[derive(Clone, Debug, PartialEq, Eq)]
pub struct ValueError {
    pub at: String,
    pub expected: String,
    pub found: String,
}

fn describe(v: &Value) -> String {
    match v {
        Value::Null => "null",
        Value::Bool(_) => "boolean",
        Value::Number(n) if n.is_i64() || n.is_u64() => "integer",
        Value::Number(_) => "number",
        Value::String(_) => "string",
        Value::Array(_) => "array",
        Value::Object(_) => "object",
    }
    .to_string()
}

fn validate_at(value: &Value, ty: &Type, at: &str) -> Result<(), ValueError> {
    let mismatch = |expected: &str| {
        Err(ValueError { at: at.to_string(), expected: expected.into(), found: describe(value) })
    };

    match ty {
        Type::Any => Ok(()),
        Type::Null => value.is_null().then_some(()).ok_or(()).or_else(|_| mismatch("null")),
        Type::Boolean => {
            value.is_boolean().then_some(()).ok_or(()).or_else(|_| mismatch("boolean"))
        }
        Type::String => value.is_string().then_some(()).ok_or(()).or_else(|_| mismatch("string")),
        Type::Integer => value
            .as_i64()
            .map(|_| ())
            .or_else(|| value.as_u64().map(|_| ()))
            .ok_or(())
            .or_else(|_| mismatch("integer")),
        Type::Number => value.is_number().then_some(()).ok_or(()).or_else(|_| mismatch("number")),
        Type::Array(inner) => {
            let Some(items) = value.as_array() else { return mismatch("array") };
            for (i, item) in items.iter().enumerate() {
                validate_at(item, inner, &format!("{at}[{i}]"))?;
            }
            Ok(())
        }
        Type::Object { properties, required, .. } => {
            let Some(obj) = value.as_object() else { return mismatch("object") };
            for field in required {
                if !obj.contains_key(field) {
                    return Err(ValueError {
                        at: format!("{at}.{field}"),
                        expected: "present".into(),
                        found: "absent".into(),
                    });
                }
            }
            for (name, sub) in properties {
                if let Some(v) = obj.get(name) {
                    validate_at(v, sub, &format!("{at}.{name}"))?;
                }
            }
            Ok(())
        }
    }
}

/// Extract a value by the same restricted path grammar as [`resolve`].
/// How a path segment indexes into an array, if at all.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum Index {
    None,
    /// `[*]` or `[]` — the whole array.
    All,
    /// `[3]` — one element. This is what `expand` writes for a `forEach`
    /// child, so a resolver that cannot read it makes every child unclaimable.
    At(usize),
}

pub fn split_index(raw: &str) -> (&str, Index) {
    if let Some(f) = raw.strip_suffix("[*]").or_else(|| raw.strip_suffix("[]")) {
        return (f, Index::All);
    }
    if let Some(open) = raw.rfind('[') {
        if raw.ends_with(']') {
            if let Ok(n) = raw[open + 1..raw.len() - 1].parse::<usize>() {
                return (&raw[..open], Index::At(n));
            }
        }
    }
    (raw, Index::None)
}

pub fn select(value: &Value, path: &str) -> Option<Value> {
    let path = path.trim();
    if path == "$" {
        return Some(value.clone());
    }
    // `$[*]` is the root array itself — what an expanded `forEach` parent
    // produces. `$[*].field` then plucks that field from every child.
    let (mut current, rest) = match path.strip_prefix("$[*]") {
        Some(rest) => {
            if !value.is_array() {
                return None;
            }
            (value.clone(), rest.strip_prefix('.').unwrap_or(""))
        }
        None => (value.clone(), path.strip_prefix("$.")?),
    };
    if rest.is_empty() {
        return Some(current);
    }

    for raw in rest.split('.') {
        let (field, index) = split_index(raw);
        if !field.is_empty() {
            current = match current {
                Value::Array(items) => Value::Array(
                    items.iter().map(|i| i.get(field).cloned()).collect::<Option<Vec<_>>>()?,
                ),
                other => other.get(field)?.clone(),
            };
        }
        match index {
            Index::None => {}
            Index::All => {
                if !current.is_array() {
                    return None;
                }
            }
            Index::At(n) => current = current.as_array()?.get(n)?.clone(),
        }
    }
    Some(current)
}

#[cfg(test)]
mod value_tests {
    use super::*;
    use serde_json::json;

    fn t(v: Value) -> Type {
        parse(&v).unwrap()
    }

    #[test]
    fn a_missing_required_field_is_named() {
        let ty =
            t(json!({"type":"object","properties":{"risk":{"type":"number"}},"required":["risk"]}));
        let err = validate_value(&json!({}), &ty).unwrap_err();
        assert_eq!(err.at, "$.risk");
        assert_eq!(err.found, "absent");
    }

    #[test]
    fn a_wrong_type_is_named_with_its_path() {
        let ty =
            t(json!({"type":"object","properties":{"risk":{"type":"number"}},"required":["risk"]}));
        let err = validate_value(&json!({"risk":"high"}), &ty).unwrap_err();
        assert_eq!(err.at, "$.risk");
        assert_eq!(err.expected, "number");
        assert_eq!(err.found, "string");
    }

    #[test]
    fn extra_fields_are_allowed() {
        let ty = t(json!({"type":"object","properties":{"a":{"type":"string"}},"required":["a"]}));
        assert!(validate_value(&json!({"a":"x","b":1}), &ty).is_ok());
    }

    #[test]
    fn array_elements_are_checked_and_the_index_is_reported() {
        let ty = t(json!({"type":"array","items":{"type":"string"}}));
        assert!(validate_value(&json!(["a", "b"]), &ty).is_ok());
        let err = validate_value(&json!(["a", 2]), &ty).unwrap_err();
        assert_eq!(err.at, "$[1]");
    }

    #[test]
    fn integers_satisfy_number_but_not_the_reverse() {
        assert!(validate_value(&json!(3), &Type::Number).is_ok());
        assert!(validate_value(&json!(3.5), &Type::Integer).is_err());
    }

    #[test]
    fn select_pulls_values_by_the_same_grammar_as_resolve() {
        let v = json!({"customers":[{"id":"c17"},{"id":"c18"}]});
        assert_eq!(select(&v, "$"), Some(v.clone()));
        assert_eq!(select(&v, "$.customers[*]"), Some(json!([{"id":"c17"},{"id":"c18"}])));
        assert_eq!(select(&v, "$.missing"), None);
    }
}
