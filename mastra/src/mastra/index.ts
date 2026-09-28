import { Mastra } from '@mastra/core/mastra';
import { LibSQLStore } from '@mastra/libsql';
import { DuckDBStore } from '@mastra/duckdb';
import { MastraCompositeStore } from '@mastra/core/storage';
import {
  MastraStorageExporter,
  MastraPlatformExporter,
  Observability,
  SensitiveDataFilter,
} from '@mastra/observability';
import { agent } from './agents/agent';
import { kakeiboAgent } from './agents/kakeibo-agent';
// 今回作成した3つのマルチエージェントをインポート
import {
  budgetAnalystAgent,
  marketAdvisorAgent,
  reportCoordinatorAgent,
} from './agents/budget-report-agents';
import { startScheduleTool, stopScheduleTool } from './tools/schedule-tools';
import { getTransactionsTool } from './tools/kakeibo-tool';
import { savingAdviceWorkflow } from './workflows/saving-advice-workflow';

export const mastra = new Mastra({
  bundler: {
    externals: ['@duckdb/node-bindings'],
  },
  // agents に新しく作成した 3 つのエージェントを追加
  agents: {
    agent,
    kakeiboAgent,
    budgetAnalystAgent,
    marketAdvisorAgent,
    reportCoordinatorAgent,
  },
  tools: { startScheduleTool, stopScheduleTool, getTransactionsTool },
  workflows: { savingAdviceWorkflow },
  storage: new MastraCompositeStore({
    id: 'composite-storage',
    default: new LibSQLStore({
      id: 'mastra-storage',
      url: process.env.TURSO_DATABASE_URL || 'file:./mastra.db',
      authToken: process.env.TURSO_AUTH_TOKEN || undefined,
    }),
    domains: {
      observability: await new DuckDBStore().getStore('observability'),
    },
  }),
  observability: new Observability({
    configs: {
      default: {
        serviceName: 'mastra',
        exporters: [new MastraStorageExporter(), new MastraPlatformExporter()],
        spanOutputProcessors: [new SensitiveDataFilter()],
      },
    },
  }),
});