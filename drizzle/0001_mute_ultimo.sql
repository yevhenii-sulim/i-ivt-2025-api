ALTER TABLE "galleries" ADD COLUMN "title" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "galleries" ADD COLUMN "description" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "galleries" ADD COLUMN "createdAt" timestamp DEFAULT now() NOT NULL;