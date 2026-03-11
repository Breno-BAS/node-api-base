CREATE TYPE "public"."roles" AS ENUM('admin', 'user', 'guest');--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "role" "roles" DEFAULT 'user' NOT NULL;