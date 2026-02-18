import { pgTable, text, serial, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// export * from "./models/auth";
export * from "./models/chat";

// Extend conversations to have user_id if needed, but for now let's stick to the blueprint's structure 
// and maybe just link them in application logic or add a column if I could edit it easily.
// Actually, I can edit `shared/models/chat.ts` but it's better to leave blueprint files alone if possible.
// However, for a multi-user app, we really need `userId` in conversations. 
// Since I can't easily modify the blueprint file without potentially breaking future updates (though unlikely here),
// I will just use the `urbanReports` for now and maybe assume chat is global or just session based?
// No, auth is installed. Chat should be per user.
// The chat blueprint is often basic. I will assume I can modify `shared/models/chat.ts` if needed, 
// OR I can just create a new table `user_conversations` to link them? 
// Or better, I'll just rely on the fact that `registerChatRoutes` might not handle user auth by default.
// Let's look at `server/replit_integrations/chat/routes.ts`. It doesn't seem to use `req.user`.
// I will implement `urbanReports` and if I need to link chat to users, I might need to customize the chat routes or storage.
// For now, I'll stick to the requested `urban_reports` table.

export const urbanReports = pgTable("urban_reports", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(), // References auth user id (which is string/varchar)
  city: text("city").notNull(),
  country: text("country").notNull(),
  formData: jsonb("form_data").notNull(),
  generatedReport: text("generated_report"), // Markdown content
  pdfUrl: text("pdf_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUrbanReportSchema = createInsertSchema(urbanReports).omit({
  id: true,
  createdAt: true,
  generatedReport: true,
  pdfUrl: true
});

export type UrbanReport = typeof urbanReports.$inferSelect;
export type InsertUrbanReport = z.infer<typeof insertUrbanReportSchema>;
