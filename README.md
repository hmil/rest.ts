# Rest.ts

The definitive HTTP API definition framework for TypeScript.

## What is this?

Rest.ts lets you write API contracts that tie together consumers and producers within the type system. Out of the box, Rest.ts gives you the following features:
- Auto-completion / intelliSense
- Easy code navigation

## How to use

### 1. Define your API

Use the utilities prvided by `rest-ts-core` to define your API with ease:

```ts
import { defineAPI, GET, POST } from 'rest-ts-core';

class Flower {
    id: string;
    color: string;
    name: string;
}

class FlowerDetail extends Flower {
    discoverer: string;
    description: string;
    extinct: boolean;
}

const FlowerIndexedAttribute = 'name' as 'name' | 'color';

export const FlowerAPI = defineAPI({
  
    listFlowers: GET `/flowers`
        .query({
            'sortBy': FlowerIndexedAttribute,
            'filterBy': FlowerIndexedAttribute
        })
        .response(Flower[]),
        
     addFlower: POST `/flowers`
        .body(Flower)
        .response({ id: 'string' }),
        
     getFlowerDetails: GET `/flowers/${'id'}/details`
        .response(FlowerDetail)
});
```

### 2. Create a server for this API

Use `rest-ts-express` to create a binding for an expressjs server.

```ts
import { createRouter } from 'rest-ts-express';
import { FlowerAPI } from './flowerAPI';

const router = createRouter(FlowerAPI, {
    listFlowers: async (req, res) => {
    
    },
    
    addFlower: async (req, res) => {
    
    },
    
    getFlowerDetails: async (req, res) => {
    
    }
});
```

### 3. Consume the API

The package `rest-ts-axios` lets you bind an API definition to an instance of axios<sup>*</sup>.

```ts
import { createConsumer } from 'rest-ts-axios';
import { FlowerAPI } from './flowerAPI';

const driver = axios.instance({
    baseURL: 'http://localhost:3000/api',
    // You can add global settings here such as authentication headers
});

// Create the binding once...
const api = createConsumer(FlowerAPI, driver);

// ...then use it anywhere in your client code
const roseResponse = await api.addFlower({
    body: new Flower('red', 'rose')
});
```

<sub><sup>*</sup>[axios](https://github.com/axios/axios) is the best cross-platform HTTP client for TypeScript out there.</sub>

## Recommended use

**Rest.ts works best with [runtypes](https://github.com/pelotom/runtypes)**.  
If you define your DTOs with runtypes, then `rest-ts-express` autaomatically takes care of validating the incoming data against the expected type. This helps you prevent bugs and vulnerabilities by [not trusting user input](https://www.owasp.org/index.php/Don%27t_trust_user_input) and [enforcing type checking at the boundary](https://lorefnon.tech/2018/03/25/typescript-and-validations-at-runtime-boundaries/).

```ts
import * as rt from 'runtypes';
import { defineAPI, GET, POST } from 'rest-ts-core';

const Flower = rt.Record({
   name: rt.String,
   color: rt.String,
   id: rt.String
});

// Note how runtypes makes it less awkward to defined union types
const FlowerIndexedAttribute = rt.Union('color', 'name');

export const flowerAPI = defineAPI({
    listFlowers: GET `/flowers`
        .query({
            'sortBy': FlowerIndexedAttribute,
            'filterBy': FlowerIndexedAttribute
        })
        .response(rt.Array(Flower))

    addFlower: POST `/flowers`
        // POST body data will be validated by the server. If it doesn't
        // conform to the expected type, a 400 error is returned.
        .body(Flower)
        .response(rt.Record({
            id: rt.String
        }))
});
```

WIP Status:

- [x] Add Makefiles
- [x] Finish importing axios
- [x] Split into three packages (base, express, axios)
- [x] Document usage in readme
- [ ] Add tests

