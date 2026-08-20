import { Router } from "express";
import { getChatReply } from "../llm/client.js";

export const chatRouter = Router();

// POST /api/chat
// Body: { messages: [{ role: "user" | "assistant", content: string }, ...] }
//
// This is intentionally stateless and tool-free: the client sends the full
// conversation each time, and the server forwards it to the model as-is.
//
// TODO (candidate): this is where the assignment really starts. Replace/extend
// this handler so that the model can call tools to read and write the family
// tree (person nodes, parent->child edges, spouse edges), and so that tool
// calls actually mutate durable state rather than just producing text. You'll
// likely want to:
//   - Define a tool schema (see README's "Data Model Requirements")
//   - Run an agentic loop: send messages + tools -> handle tool_use blocks ->
//     execute against your persistence layer -> feed tool_result back -> repeat
//     until the model returns a plain text reply
//   - Resolve ambiguous references and in-place corrections before committing
//     any edge/node mutation
chatRouter.post("/", async (req, res) => {
  const { messages } = req.body;

  if (!Array.isArray(messages)) {
    return res.status(400).json({ error: "messages must be an array" });
  }

  try {
    const reply = await getChatReply(messages);
    res.json({ reply });
  } catch (err) {
    console.error("[chat] LLM request failed:", err);
    res.status(502).json({ error: "LLM request failed" });
  }
});
