import { ExtractBaseType } from './base-types';

// TypeScript utilities for ninjas



/** 
 * Extracts the runtime type from a type definition.
 * This is helpful to transition from definition of an interface to its concrecte application.
 */
export type ExtractRuntimeType<T> =
        T extends [ infer A ] ? [ ExtractBaseType<A> ] :
        T extends [ infer A, infer B ] ? [ ExtractBaseType<A>, ExtractBaseType<B> ] :
        T extends [ infer A, infer B, infer C ] ? [ ExtractBaseType<A>, ExtractBaseType<B>, ExtractBaseType<C> ] :
        T extends [ infer A, infer B, infer C, infer D ] ? [ ExtractBaseType<A>, ExtractBaseType<B>, ExtractBaseType<C>, ExtractBaseType<D> ] :
        T extends [ infer A, infer B, infer C, infer D, infer E ] ? [ ExtractBaseType<A>, ExtractBaseType<B>, ExtractBaseType<C>, ExtractBaseType<D>, ExtractBaseType<E> ] :
        T extends [ infer A, infer B, infer C, infer D, infer E, infer F ] ? [ ExtractBaseType<A>, ExtractBaseType<B>, ExtractBaseType<C>, ExtractBaseType<D>, ExtractBaseType<E>, ExtractBaseType<F> ] :
        T extends [ infer A, infer B, infer C, infer D, infer E, infer F, infer G ] ? [ ExtractBaseType<A>, ExtractBaseType<B>, ExtractBaseType<C>, ExtractBaseType<D>, ExtractBaseType<E>, ExtractBaseType<F>, ExtractBaseType<G> ] :
        T extends [ infer A, infer B, infer C, infer D, infer E, infer F, infer G, infer H ] ? [ ExtractBaseType<A>, ExtractBaseType<B>, ExtractBaseType<C>, ExtractBaseType<D>, ExtractBaseType<E>, ExtractBaseType<F>, ExtractBaseType<G>, ExtractBaseType<H> ] :
        ExtractBaseType<T>;

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

