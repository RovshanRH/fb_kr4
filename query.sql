CREATE TABLE user (
    ID serial primary key,
    first_name varchar(255) not null,
    last_name varchar(255) not null,
    age int not null,
    created_at timestamp not null,
    updated_at timestamp not null
);