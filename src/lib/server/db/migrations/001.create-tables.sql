
-- Players

create table if not exists players (
  id integer primary key,
  guid text not null unique,
  last_active timestamp default (unixepoch('now')),
  data blob
);


-- Memes

create table if not exists memes (
  id integer primary key,
  banner text not null,
  color text not null,
  script text,
  owner_id integer not null references players(id),
  grid blob
);


-- Membership

create table if not exists memes_players (
  player_id integer not null,
  meme_id integer not null,
  primary key (player_id, meme_id),
  foreign key (player_id) references players(id),
  foreign key (meme_id) references memes(id)
);


-- Kernel Library

create table if not exists kernel_library (
  id integer primary key,
  name text not null,
  size integer not null,
  data blob
);

