ALTER TABLE `split_days` RENAME COLUMN "day" TO "days";--> statement-breakpoint
ALTER TABLE `split_days` RENAME COLUMN "is_upper_day" TO "are_upper_days";--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_sets` (
	`id` text PRIMARY KEY NOT NULL,
	`exercise_id` text NOT NULL,
	`date` text NOT NULL,
	`reps` integer NOT NULL,
	`weight` real NOT NULL,
	`rest` integer NOT NULL,
	FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_sets`("id", "exercise_id", "date", "reps", "weight", "rest") SELECT "id", "exercise_id", "date", "reps", "weight", "rest" FROM `sets`;--> statement-breakpoint
DROP TABLE `sets`;--> statement-breakpoint
ALTER TABLE `__new_sets` RENAME TO `sets`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_users` (
	`id` text PRIMARY KEY NOT NULL,
	`height` real NOT NULL,
	`gender` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_users`("id", "height", "gender") SELECT "id", "height", "gender" FROM `users`;--> statement-breakpoint
DROP TABLE `users`;--> statement-breakpoint
ALTER TABLE `__new_users` RENAME TO `users`;