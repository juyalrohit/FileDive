import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import axios from "axios";
import { z } from "zod";

const server = new McpServer({
  name: "folder-manager",
  version: "1.0.0",
});

server.registerTool(
  "create_folder",
  {
    description:
      "Create a folder in the folder management system",

    inputSchema: {
      name: z.string(),
      parentFolder: z.string().optional(),
    },
  },

  async ({ name, parentFolder }) => {

    try {

      const response =
        await axios.post(
          "http://localhost:3000/api/folders",
          {
            name,
            parentFolder,
          }
        );

      return {
        content: [
          {
            type: "text",
            text:
              `Folder '${response.data.folder.name}' created successfully`,
          },
        ],
      };

    } catch (error) {

      return {
        content: [
          {
            type: "text",
            text:
              "Failed to create folder",
          },
        ],
      };
    }
  }
);

const transport =
  new StdioServerTransport();

await server.connect(transport);