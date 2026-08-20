import { Router } from "express";

export const graphRouter = Router();

// GET /api/graph
//
// The graph visualization polls this endpoint and renders whatever it
// returns. Right now it always returns an empty graph — there is no
// persistence layer wired up yet.
//
// TODO (candidate): back this with your own database and
// return the current state of the family tree:
//   {
//     people: [{ id, name, ...whatever attributes you decide to track }],
//     parentEdges: [{ parentId, childId }],   // single-direction, <= 2 parents/child
//     spouseEdges: [{ personAId, personBId }] // undirected, distinct from parent/child
//   }
//
// The graph must stay a valid DAG with respect to parentEdges (no cycles),
// and must survive a process restart.
graphRouter.get("/", async (_req, res) => {
  // example data to illustrate the expected shape of the response. This is not
  // persisted anywhere, and will be lost on server restart.
  const peopleExample = [
    { id: "1", name: "Alice" },
    { id: "2", name: "Bob" },
    { id: "3", name: "Charlie" },
  ];
  
  const parentEdgesExample = [
    { parentId: "1", childId: "3" },
    { parentId: "2", childId: "3" },
  ];

  const spouseEdgesExample = [
    { personAId: "1", personBId: "2" },
  ];

  res.json({
    people: [
      ...peopleExample
    ],
    parentEdges: [
      ...parentEdgesExample
    ],
    spouseEdges: [
      ...spouseEdgesExample
    ],
  });
});
