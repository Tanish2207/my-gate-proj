-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "test" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "test_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	"marks" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "owner" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "owner_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"mobile_number" varchar(10) NOT NULL,
	"flat_number" integer NOT NULL,
	CONSTRAINT "owner_flat_number_key" UNIQUE("flat_number")
);
--> statement-breakpoint
CREATE TABLE "visitors" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "visitors_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"mobile_number" varchar(10) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "visits" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "visits_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"visitor_id" integer NOT NULL,
	"flat_id" integer NOT NULL,
	"entry_time" timestamp with time zone DEFAULT now(),
	"exit_time" timestamp with time zone,
	"reason" text
);
--> statement-breakpoint
ALTER TABLE "visits" ADD CONSTRAINT "visit_visitor_fkey" FOREIGN KEY ("visitor_id") REFERENCES "public"."visitors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "visits" ADD CONSTRAINT "visit_flat_fkey" FOREIGN KEY ("flat_id") REFERENCES "public"."owner"("flat_number") ON DELETE no action ON UPDATE no action;
*/