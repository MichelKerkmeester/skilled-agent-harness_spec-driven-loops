#![no_std]

pub fn no_std_choice(first: bool, second: bool) -> usize {
    if first && second { 401 } else { 409 }
}

pub fn no_std_logical_value(first: bool, second: bool) -> bool {
    first || second
}

pub fn no_std_match(value: Option<usize>) -> usize {
    match value {
        Some(value) => value,
        None => 419,
    }
}
