// TypeScript utilities for ninjas

/** 
 * Converts a tuple of strings to a dictionnary where the keys are the strings of the input tuple,
 * and the values are just `string`s
 */
export type Tuple2Dict<T> = 
      T extends [ infer A ] ? A extends string ? { [key in A]: string } : never
    : T extends [ infer A, infer B ] ? A extends string ? B extends string ? { [key in A | B]: string } : never : never
    : T extends [ infer A, infer B, infer C ] ? A extends string ? B extends string ? C extends string ? { [key in A | B | C]: string } : never : never : never
    : T extends [ infer A, infer B, infer C, infer D ] ? A extends string ? B extends string ? C extends string ? D extends string ? { [key in A | B | C | D]: string } : never : never : never : never
    : T extends [ infer A, infer B, infer C, infer D, infer E ] ? A extends string ? B extends string ? C extends string ? D extends string ? E extends string ? { [key in A | B | C | D | E]: string } : never : never : never : never : never
    : T extends [ infer A, infer B, infer C, infer D, infer E, infer F ] ? A extends string ? B extends string ? C extends string ? D extends string ? E extends string ? F extends string ? { [key in A | B | C | D | E | F]: string } : never : never : never : never : never : never
    : T extends [ infer A, infer B, infer C, infer D, infer E, infer F, infer G ] ? A extends string ? B extends string ? C extends string ? D extends string ? E extends string ? F extends string ? G extends string ? { [key in A | B | C | D | E | F | G]: string } : never : never : never : never : never : never : never
    : T extends [ infer A, infer B, infer C, infer D, infer E, infer F, infer G, infer H ] ? A extends string ? B extends string ? C extends string ? D extends string ? E extends string ? F extends string ? G extends string ? H extends string ? { [key in A | B | C | D | E | F | G | H]: string } : never : never : never : never : never : never : never : never
    : { [key in string]: string };

/**
 * The set difference between T and U, where T and U are string literals or string literal unions.
 */
export type Diff<T, U> = T extends U ? never : T;

/**
 * The record type T where the key Key has been omitted.
 */
export type RemoveKey<T, Key extends keyof T> = {
    [K in Diff<keyof T, Key>]: T[K];
};

/**
 * A record made of the values in T associated to the keys in Key. Key is a string literal or
 * string literal union, and must represent valid index values of T.
 */
export type Pick<T, Key extends keyof T> = {
    [K in Key]: T[K];
};
