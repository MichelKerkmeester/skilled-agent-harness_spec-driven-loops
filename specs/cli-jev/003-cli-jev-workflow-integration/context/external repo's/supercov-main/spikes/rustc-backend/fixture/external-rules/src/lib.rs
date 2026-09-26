#[macro_export]
macro_rules! external_choice_function {
    ($name:ident) => {
        pub fn $name(value: bool) -> usize {
            if value { 181 } else { 191 }
        }
    };
}
