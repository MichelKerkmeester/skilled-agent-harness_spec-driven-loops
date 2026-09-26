use proc_macro::{TokenStream, TokenTree};

#[proc_macro_derive(SupercovChoice)]
pub fn derive_choice(item: TokenStream) -> TokenStream {
    let mut saw_item_keyword = false;
    let name = item
        .into_iter()
        .find_map(|token| match token {
            TokenTree::Ident(identifier) if saw_item_keyword => Some(identifier.to_string()),
            TokenTree::Ident(identifier)
                if matches!(identifier.to_string().as_str(), "struct" | "enum" | "union") =>
            {
                saw_item_keyword = true;
                None
            }
            _ => None,
        })
        .expect("derive input has an item name");
    format!(
        "impl {name} {{ pub fn derived_choice(&self, value: bool) -> usize {{ if value {{ 193 }} else {{ 197 }} }} }}"
    )
    .parse()
    .expect("valid generated derive implementation")
}

#[proc_macro]
pub fn generated_function(_input: TokenStream) -> TokenStream {
    "pub fn generated_by_proc(value: bool) -> usize { if value { 17 } else { 19 } }"
        .parse()
        .expect("valid generated Rust")
}

#[proc_macro]
pub fn generated_match_function(_input: TokenStream) -> TokenStream {
    "pub fn generated_match_by_proc(value: bool) -> usize { match value { true => 31, false => 37 } }"
        .parse()
        .expect("valid generated Rust match")
}

#[proc_macro]
pub fn generated_guarded_match_function(_input: TokenStream) -> TokenStream {
    "pub fn generated_guarded_match_by_proc(value: Option<usize>, enabled: bool) -> usize { match value { Some(value) if value > 0 && enabled => value, Some(_) => 2, None => 0 } }"
        .parse()
        .expect("valid generated guarded Rust match")
}

#[proc_macro]
pub fn generated_loop_nested_match_function(_input: TokenStream) -> TokenStream {
    "pub fn generated_loop_nested_match_by_proc(values: Vec<Result<usize, usize>>) -> usize { let mut total = 0; for value in values { match value { Ok(value) => match value.checked_sub(1) { Some(remaining) => total += remaining, None => total += 100 }, Err(value) => total += value } } total }"
        .parse()
        .expect("valid generated loop-nested Rust match")
}

#[proc_macro]
pub fn generated_nested_match_function(_input: TokenStream) -> TokenStream {
    "pub fn generated_nested_match_by_proc(value: Option<Result<usize, usize>>) -> usize { match value { Some(result) => match result { Ok(value) => value + 10, Err(value) => value + 20 }, None => 0 } }"
        .parse()
        .expect("valid generated nested Rust match")
}

#[proc_macro]
pub fn generated_nested_scrutinee_match_function(_input: TokenStream) -> TokenStream {
    "pub fn generated_nested_scrutinee_match_by_proc(value: Option<bool>) -> usize { match match value { Some(value) => value, None => return 0 } { true => 1, false => 2 } }"
        .parse()
        .expect("valid generated nested-scrutinee Rust match")
}

#[proc_macro]
pub fn generated_nested_guard_match_function(_input: TokenStream) -> TokenStream {
    "pub fn generated_nested_guard_match_by_proc(value: Option<usize>, enabled: bool) -> usize { match value { Some(value) if match enabled { true => value > 0, false => false } => value, Some(_) => 2, None => 0 } }"
        .parse()
        .expect("valid generated nested-guard Rust match")
}

#[proc_macro]
pub fn generated_let_else_function(_input: TokenStream) -> TokenStream {
    "pub fn generated_let_else_by_proc(value: Option<usize>) -> usize { let Some(value) = value else { return 0; }; value + 1 }"
        .parse()
        .expect("valid generated Rust let-else")
}

#[proc_macro]
pub fn generated_two_let_else_function(_input: TokenStream) -> TokenStream {
    "pub fn generated_two_let_else_by_proc(first: Option<Result<usize, usize>>, second: Option<usize>) -> usize { let Some(Ok(first)) = first else { return 0; }; let Some(second) = second else { return first; }; first + second }"
        .parse()
        .expect("valid generated sequential Rust let-else")
}

#[proc_macro]
pub fn generated_try_function(_input: TokenStream) -> TokenStream {
    "pub fn generated_try_by_proc(value: Result<usize, &'static str>) -> Result<usize, &'static str> { Ok(value? + 1) }"
        .parse()
        .expect("valid generated Rust try operator")
}

#[proc_macro]
pub fn generated_two_try_function(_input: TokenStream) -> TokenStream {
    "pub fn generated_two_try_by_proc(first: Result<usize, &'static str>, second: Result<usize, &'static str>) -> Result<usize, &'static str> { Ok(first? + second?) }"
        .parse()
        .expect("valid generated sequential Rust try operators")
}

#[proc_macro]
pub fn generated_nested_try_function(_input: TokenStream) -> TokenStream {
    "pub fn generated_nested_try_by_proc(value: Result<Result<usize, &'static str>, &'static str>) -> Result<usize, &'static str> { Ok(value?? + 1) }"
        .parse()
        .expect("valid generated nested Rust try operators")
}

#[proc_macro]
pub fn generated_assertion_function(_input: TokenStream) -> TokenStream {
    "pub fn generated_assertion_by_proc(left: bool, right: bool) { assert!(left && right, \"generated assertion failed\"); }"
        .parse()
        .expect("valid generated Rust assertion")
}

#[proc_macro]
pub fn generated_expression(_input: TokenStream) -> TokenStream {
    "if true { 41usize } else { 43usize }"
        .parse()
        .expect("valid generated Rust expression")
}

#[proc_macro]
pub fn generated_local_function(_input: TokenStream) -> TokenStream {
    "fn generated_local_by_proc(value: bool) -> usize { if value { 47 } else { 53 } }"
        .parse()
        .expect("valid generated local Rust function")
}

#[proc_macro]
pub fn generated_nested_external_function(_input: TokenStream) -> TokenStream {
    "external_rules::external_choice_function!(generated_nested_external_by_proc);"
        .parse()
        .expect("valid nested external declarative invocation")
}

#[proc_macro_attribute]
pub fn generated_choice(_attribute: TokenStream, item: TokenStream) -> TokenStream {
    let mut saw_function_keyword = false;
    let name = item
        .into_iter()
        .find_map(|token| match token {
            TokenTree::Ident(identifier) if saw_function_keyword => Some(identifier.to_string()),
            TokenTree::Ident(identifier) if identifier.to_string() == "fn" => {
                saw_function_keyword = true;
                None
            }
            _ => None,
        })
        .expect("attribute input has a function name");
    format!(
        "pub fn {name}(first: bool, second: bool) -> usize {{ if first && second {{ 353 }} else {{ 359 }} }}"
    )
    .parse()
    .expect("valid generated attribute function")
}

#[proc_macro_attribute]
pub fn generated_test(_attribute: TokenStream, item: TokenStream) -> TokenStream {
    let mut output: TokenStream = "#[test]".parse().expect("valid test attribute");
    output.extend(item);
    output
}
