CREATE TABLE COMPANY(
   "id" INT PRIMARY KEY NOT NULL,
   "task-name" VARCHAR(255) NOT NULL,
   "completed-on" TIMESTAMP WITH TIME ZONE
);

INSERT INTO "to-dos"
	("task-name")
VALUES 
	('Start day'),
	('Eat breakfast'),
	('Go biking'),
	('Buy piano');