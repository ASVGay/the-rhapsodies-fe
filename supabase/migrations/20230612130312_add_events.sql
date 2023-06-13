    drop type if exists "public"."event_type";
    drop type if exists "public"."attending";

    CREATE TYPE EVENT_TYPE AS ENUM ('Brainstormborrel', 'Rehearsal');
    CREATE TYPE ATTENDING AS ENUM ('present', 'absent', 'undecided');


    CREATE TABLE event (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      event_type EVENT_TYPE NOT NULL,
      start_time TIMESTAMP WITH TIME ZONE NOT NULL,
      end_time TIMESTAMP WITH TIME ZONE not null,
      location TEXT NOT NULL
    );

    CREATE TABLE attendee (
        event_id UUID REFERENCES event(id) NOT NULL,
        user_id UUID REFERENCES member(id) NOT NULL,
        attending ATTENDING NOT NULL,
        remark TEXT
    )