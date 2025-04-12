/* eslint-disable @typescript-eslint/no-explicit-any */
export enum EMcpServerType {
    LOCAL = 'local',
    REMOTE = 'remote',
}

export enum EMcpServerStatus {
    RUNNING = 'running',
    PENDING = 'pending',
    STOPPED = 'stopped',
    ERROR = 'error',
}

export type TToolProperty = {
    argName: string;
    type: string;
}

export type TTool = {
    name: string;
    properties: TToolProperty[];
}

export type TCallData = {[key: string ]: string | number};


export type TToolHistory = {
    toolName?: string;
    toolArguments?: TCallData;
    message: string;
}

export type TMcpServer = {
    id: string; // uuid
    name: string;
    desc: string;

    status: EMcpServerStatus;

    type: EMcpServerType,

    url?: string;
    command?: string;
    args: string[];

    tools: any[];
    histories: TToolHistory[];
}