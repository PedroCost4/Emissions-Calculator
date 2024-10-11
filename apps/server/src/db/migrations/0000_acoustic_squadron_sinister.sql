DO $$ BEGIN
 CREATE TYPE "public"."modal_type" AS ENUM('road', 'rail', 'air', 'waterway');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "mobile_emissions" (
	"id" uuid PRIMARY KEY NOT NULL,
	"source" text NOT NULL,
	"fuel_type" text NOT NULL,
	"quantity" numeric NOT NULL,
	"quantity_unit" text NOT NULL,
	"mode" "modal_type" NOT NULL,
	"created_at" date DEFAULT now() NOT NULL,
	"updated_at" date DEFAULT now() NOT NULL
);
