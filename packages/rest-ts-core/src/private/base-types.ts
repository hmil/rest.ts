
// Define basic type definitions interfaces.
// This is the place to write interop code for the different "at the boundary" type checking libraries like "runtypes".

// Currently supported runtime type checking libraries:
// - runtypes

import * as rt from 'runtypes';

export type Dictionary<T> = { [_: string]: T };

export type ArrayDefinition<T> = T extends rt.Runtype ? rt.Array<T> | Array<T> : Array<T>;

export type StringDefinition = rt.String | string;
export type NumberDefinition = rt.Number | number;
export type RecordDefinition<T> = T extends rt.Runtype ? rt.Record<Dictionary<T>> | Dictionary<T> : Dictionary<T>;

export type DTO_Type = rt.Runtype<any> | RecordDefinition<any> | NumberDefinition | StringDefinition;

/** 
 * Extracts the runtime type from a type definition.
 * This is helpful to transition from definition of an interface to its concrecte application.
 */
export type ExtractRuntimeType<T> =
        T extends undefined ? void :
        T extends Array<infer T> ?
            T extends [ infer A ] ? [ ExtractBaseType<A> ] :
            T extends [ infer A, infer B ] ? [ ExtractBaseType<A>, ExtractBaseType<B> ] :
            T extends [ infer A, infer B, infer C ] ? [ ExtractBaseType<A>, ExtractBaseType<B>, ExtractBaseType<C> ] :
            T extends [ infer A, infer B, infer C, infer D ] ? [ ExtractBaseType<A>, ExtractBaseType<B>, ExtractBaseType<C>, ExtractBaseType<D> ] :
            T extends [ infer A, infer B, infer C, infer D, infer E ] ? [ ExtractBaseType<A>, ExtractBaseType<B>, ExtractBaseType<C>, ExtractBaseType<D>, ExtractBaseType<E> ] :
            T extends [ infer A, infer B, infer C, infer D, infer E, infer F ] ? [ ExtractBaseType<A>, ExtractBaseType<B>, ExtractBaseType<C>, ExtractBaseType<D>, ExtractBaseType<E>, ExtractBaseType<F> ] :
            T extends [ infer A, infer B, infer C, infer D, infer E, infer F, infer G ] ? [ ExtractBaseType<A>, ExtractBaseType<B>, ExtractBaseType<C>, ExtractBaseType<D>, ExtractBaseType<E>, ExtractBaseType<F>, ExtractBaseType<G> ] :
            T extends [ infer A, infer B, infer C, infer D, infer E, infer F, infer G, infer H ] ? [ ExtractBaseType<A>, ExtractBaseType<B>, ExtractBaseType<C>, ExtractBaseType<D>, ExtractBaseType<E>, ExtractBaseType<F>, ExtractBaseType<G>, ExtractBaseType<H> ] :
            Array<ExtractBaseType<T>> :
        ExtractBaseType<T>;


type ExtractBaseType<T> = T extends rt.Runtype ? rt.Static<T>
    : T extends { new(...args: any[]): infer T } ? T
    : T extends any[] | Function ? T
    : T extends { [k: string]: any } ? { [K in keyof T]: ExtractRuntimeType<T[K]> }
    : T;

/**
 * Checks input data against the DTO schema definition.
 * 
 * If using a supported DTO library (currently, only runtypes is supported), then this function
 * checks that the input data matches the runtype definition.
 * 
 * Otherwise, this function is a no-op.
 * 
 * @param definition The DTO definition
 * @param data The input data
 */
export function deserialize<T extends DTO_Type>(definition: T, data: unknown): unknown {
    if (isRuntype(definition)) {
        return definition.check(data);
    } else {
        return data;
    }
}

function isRuntype(input: any): input is rt.Runtype {
    return '_falseWitness' in input;
}