import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

/*== STEP 1 ===============================================================
The section below creates a Todo database table with a "content" field. Try
adding a new "isDone" field as a boolean. The authorization rule below
specifies that any unauthenticated user can "create", "read", "update", 
and "delete" any "Todo" records.
=========================================================================*/
const schema = a.schema({
    KnowledgeBase: a
    .model({
      drug: a.string(),
      medicineClass: a.string(),
      therapeuticIndication: a.string(),
      geneSymbol: a.string(),
      phenotype: a.string(),
      userGuidance: a.string(), 
      userInterpretation: a.string(),
      medicalGuidance: a.string(), 
      medicalInterpretation: a.string(),
    })
    .authorization(allow => [allow.guest()]),
    User: a
    .model({
      favaId: a.string(),
      name: a.string(),
      email: a.string(),
      address1: a.string(), 
      address2: a.string(), 
      city: a.string(), 
      county: a.string(), 
      postcode: a.string(),
      dob: a.date(),
      sex: a.string(),
      gender: a.string(),
      ethnicGroup: a.string(),
      conditions: a.string(),
      takesMedicines: a.boolean(), 
      medicines: a.string(), 
      medicineIssues: a.string(),
      inviteToken: a.string(),  
      inPerson: a.boolean(), 
      status: a.string(),  
      testResult: a.hasMany('TestResult', 'userId'),
      testKit: a.hasMany('TestKit', 'userId')
    })
    .authorization(allow => [allow.publicApiKey()]),
    TestKit: a
    .model({
      userId: a.id(),
      user: a.belongsTo("User", 'userId'), 
      testKitSerial: a.string(), 
    })
    .authorization(allow => [allow.publicApiKey()]),
    TestResult: a
    .model({
      userId: a.id(),
      user: a.belongsTo("User", 'userId'), 
      genotype: a.string(), 
      diplotype: a.string(), 
      phenotype: a.string()
    })
    .authorization(allow => [allow.publicApiKey()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'iam',
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});

    {/* 

    */}
/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server 
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
