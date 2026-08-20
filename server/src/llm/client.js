import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-5";

const SYSTEM_PROMPT = `You are a friendly assistant helping someone describe their family tree in conversation.
Ask clarifying questions whenever a detail is ambiguous or missing.
You are currently a plain conversational assistant — you have no way to record or persist
what the user tells you yet. That piece is intentionally left unimplemented.`;

const TOOLS = [
  {
    name: "add_person",
    description: "Add a new person to the family tree.",
    input_schema: {
      type: "object",
      properties: {
        id: { type: "string" },
        name: { type: "string" },
      },
      required: ["id", "name"],
    },
  }
];

function runTool(name) {
  if (name === "add_person") {
    return "Person added successfully";
  }
  throw new Error(`Unknown tool: ${name}`);
}

/**
 * Sends a conversation to the model and returns its plain-text reply.
 * Runs an agentic loop: if the model responds with tool_use blocks, the
 * requested tools are executed and their results are fed back until the
 * model returns a plain text reply.
 *
 * @param {Array<{role: "user" | "assistant", content: string}>} messages
 * @returns {Promise<string>}
 */
export async function getChatReply(messages) {
  let conversation = messages;

  while (true) {
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      tools: TOOLS,
      messages: conversation,
    });

    const toolUseBlocks = response.content.filter((block) => block.type === "tool_use");
    if (toolUseBlocks.length === 0) {
      const textBlock = response.content.find((block) => block.type === "text");
      return textBlock?.text ?? "";
    }

    conversation = [
      ...conversation,
      { role: "assistant", content: response.content },
      {
        role: "user",
        content: toolUseBlocks.map((block) => ({
          type: "tool_result",
          tool_use_id: block.id,
          content: runTool(block.name),
        })),
      },
    ];
  }
}
