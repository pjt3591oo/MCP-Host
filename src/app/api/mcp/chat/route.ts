/* eslint-disable @typescript-eslint/no-explicit-any */
import { EMcpServerType, TMcpServer } from "@/types/mcp.type";
import { NextResponse } from "next/server";

import { mcpServers } from "@/utils/mcpServer";
import { model } from "@/utils/model";
import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { MultiServerMCPClient } from '@langchain/mcp-adapters';

function getMcpServerTransport(server: TMcpServer) {
    let temp = {

    };
    if (server.type === EMcpServerType.LOCAL) {
        temp = {
            transport: 'stdio',
            command: server.command as string,
            args: server.args as string[],
        }
    } else {
        temp = {
            transport: 'sse',
            url: server.url as string,
        }
    }
    const rst = {
        [server.name]: temp,
    }

    return rst;
}

export async function POST(request: Request) {
    try {
        const { message } = await request.json();
        console.log(message);

        const mcpServersTransport = mcpServers.map((server: TMcpServer) => getMcpServerTransport(server))

        const client = new MultiServerMCPClient({
            mcpServers: mcpServersTransport.reduce((acc, curr) => ({...acc, ...curr}), {}) as any,
        });

        const tools = await client.getTools();
        

        const agent = createReactAgent({
          tools,
          llm: model,
        });
        
        const result = await agent.invoke({
            messages: [
                
                {
                    role: 'user',
                    content: message,
                }
            ],
        });
        
        console.log(result);
        await client.close();
        // 프로세스 ID 반환
        return NextResponse.json({ 
            result,
            status: 'started'
        });
    
      } catch (error) {
        console.error('Server error:', error);
        return NextResponse.json(
          { error: 'Internal server error' },
          { status: 500 }
        );
      }
}