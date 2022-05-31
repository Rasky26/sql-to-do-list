CREATE TABLE "todolist"
	"id" SERIAL PRIMARY KEY,
	"task_name" VARCHAR(255) NOT NULL,
    "set_on" DATE NOT NULL,
    "due_date" DATE DEFAULT NULL,
	"hidden_until" DATE DEFAULT NULL,
	"completed_on" DATE DEFAULT NULL,
	"note" VARCHAR(2047);

ALTER TABLE "todolist"
ADD "due_date" DATE DEFAULT NULL;

INSERT INTO "todolist"
    ("task_name", "set_on", "note")
VALUES
    ('Brush teeth', '2022-05-29', 'Most important task!'),
    ('Take over the world', '2022-05-23', 'Team up with that mouse, he seems pretty smart. His brother on the other hand...');


INSERT INTO "todolist"
    ("task_name", "set_on", "hidden_until", "note")
VALUES
    ('Unveil plan for world domination', '2022-05-23', '2022-05-27', 'Keep this quite until later');


INSERT INTO "todolist"
    ("task_name", "set_on", "completed_on", "note")
VALUES
    ('Buy beans', '2022-05-27', '2022-05-28', 'Gotta keep myself fed.');