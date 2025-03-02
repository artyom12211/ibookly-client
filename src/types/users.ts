interface User {
    userid:              string,
    firstname:           string,
    username?:           string,
    language_code?:       string,
    allows_write_to_pm?:  boolean,
    has_pro:             boolean,
}

export type {
    User
}