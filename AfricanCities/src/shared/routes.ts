import { z } from 'zod';
import { insertUrbanReportSchema, urbanReports } from './schema';

// ============================================
// SHARED ERROR SCHEMAS
// ============================================
export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

// ============================================
// API CONTRACT
// ============================================
export const api = {
  urbanReports: {
    list: {
      method: 'GET' as const,
      path: '/api/urban-reports' as const,
      responses: {
        200: z.array(z.custom<typeof urbanReports.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/urban-reports/:id' as const,
      responses: {
        200: z.custom<typeof urbanReports.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/urban-reports' as const,
      input: insertUrbanReportSchema,
      responses: {
        201: z.custom<typeof urbanReports.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    generate: {
      method: 'POST' as const,
      path: '/api/urban-reports/:id/generate' as const,
      responses: {
        200: z.object({ success: z.boolean(), reportId: z.number() }),
        404: errorSchemas.notFound,
      },
    }
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type UrbanReportInput = z.infer<typeof api.urbanReports.create.input>;
export type UrbanReportResponse = z.infer<typeof api.urbanReports.create.responses[201]>;
