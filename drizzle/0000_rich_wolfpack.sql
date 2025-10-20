CREATE TABLE `annotations` (
	`id` text PRIMARY KEY NOT NULL,
	`exercise_id` text NOT NULL,
	`annotation` text,
	FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `exercises` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`image` text,
	`muscle_group` text
);
--> statement-breakpoint
CREATE TABLE `favorites` (
	`id` text PRIMARY KEY NOT NULL,
	`exercise_id` text NOT NULL,
	FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `sets` (
	`id` text PRIMARY KEY NOT NULL,
	`exercise_id` text NOT NULL,
	`date` text NOT NULL,
	`reps` integer,
	`weight` real,
	`rest` integer,
	FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `split_days` (
	`id` text PRIMARY KEY NOT NULL,
	`day` text NOT NULL,
	`is_upper_day` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `user_weights` (
	`id` text PRIMARY KEY NOT NULL,
	`weight` real NOT NULL,
	`date` text DEFAULT 'CURRENT_TIMESTAMP'
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`height` real,
	`gender` text
);
