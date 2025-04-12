import { useState } from 'react';
import { EMcpServerType, TMcpServer } from '../../../types/mcp.type';
import { Card } from '../../molecules/Card';
import { AddServerModal } from '../AddServerModal';
import { McpServerIndicator } from '../../molecules/McpServerIndicator';

interface McpServerViewProps {
  servers: TMcpServer[];
  onAddServer: (server: Omit<TMcpServer, 'id'>) => void;
  onDeleteServer: (id: string) => void;
  onServerClick: (server: TMcpServer) => void;
}

export const McpServerView = ({ servers, onAddServer, onDeleteServer, onServerClick }: McpServerViewProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const handleAddServer = (serverData: Omit<TMcpServer, 'id'>) => {
    onAddServer(serverData);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">MCP Servers</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Server
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {servers.map((server) => (
          <Card
            key={server.id}
            title={server.name}
            subtitle={server.type === EMcpServerType.LOCAL ? <>Local Server</> : <>SSE Server</>}
            className="hover:shadow-lg transition-shadow w-full"
            onClick={() => onServerClick(server)}
          >
            <div className="space-y-2">
              <McpServerIndicator status={server.status} className="mb-2" />
              {server.type === EMcpServerType.LOCAL ? (
                <>
                  <div className="text-sm">
                    <span className="font-medium">Command:</span>{' '}
                    <code className="bg-gray-100 px-2 py-1 rounded">{server.command}</code>
                  </div>
                  {server.args.length > 0 && (
                    <div className="text-sm">
                      <span className="font-medium">Arguments:</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {server.args.map((arg, index) => (
                          <code
                            key={index}
                            className="bg-gray-100 px-2 py-1 rounded text-xs"
                          >
                            {arg}
                          </code>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="text-sm">
                    <span className="font-medium">Tools:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {server.tools.map((tool) => (
                        <code key={tool.name} className="bg-gray-100 px-2 py-1 rounded text-xs">
                          {tool.name}
                        </code>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-sm">
                  <span className="font-medium">URL:</span>{' '}
                  <code className="bg-gray-100 px-2 py-1 rounded break-all">
                    {server.url}
                  </code>
                </div>
              )}
            </div>
            <button
              onClick={() => onDeleteServer(server.id)}
              className="mt-4 text-red-500 hover:text-red-600 text-sm flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </button>
          </Card>
        ))}
      </div>

      <AddServerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddServer}
      />
    </div>
  );
};

export default McpServerView;